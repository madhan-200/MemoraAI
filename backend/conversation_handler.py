"""Simplified conversation handling using Google Generative AI SDK directly."""
from typing import List, Dict, Any
import google.generativeai as genai
from google.generativeai.types import FunctionDeclaration, Tool
from config import settings
from memory_manager import MemoryManager
from web_search import web_search


class ConversationHandler:
    """Handles conversations with memory-augmented context and web search."""
    
    def __init__(self, memory_manager: MemoryManager):
        """Initialize conversation handler."""
        self.memory_manager = memory_manager
        
        # Configure Gemini
        genai.configure(api_key=settings.gemini_api_key)
        
        # Define web search function for Gemini
        search_function = FunctionDeclaration(
            name="search_web",
            description="Search the internet for current information, news, weather, facts, or any real-time data. Use this when the user asks about current events, weather, prices, or anything that requires up-to-date information.",
            parameters={
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "The search query to look up on the internet"
                    }
                },
                "required": ["query"]
            }
        )
        
        # Create model with tools
        self.model = genai.GenerativeModel(
            settings.gemini_model,
            tools=[Tool(function_declarations=[search_function])]
        )
        
        # System prompt
        self.system_prompt = """You are Memora, a helpful AI assistant with long-term memory capabilities and internet access.

You can:
1. Remember information about the user across conversations
2. Search the internet for current information using the search_web function

When the user asks about:
- Current weather, news, events → Use search_web
- Stock prices, sports scores → Use search_web  
- Any real-time or recent information → Use search_web

When relevant memories are provided, use them naturally in your responses.

Be conversational, friendly, and helpful."""
    
    def _format_memories_for_context(self, memories: List[Dict[str, Any]]) -> str:
        """Format retrieved memories into context string."""
        if not memories:
            return ""
        
        context_parts = ["Here's what I remember about our previous conversations:\n"]
        for i, memory in enumerate(memories, 1):
            content = memory['content']
            timestamp = memory.get('timestamp', 'unknown time')
            context_parts.append(f"{i}. {content} (from {timestamp[:10]})")
        
        return "\n".join(context_parts)
    
    def generate_response(
        self,
        user_message: str,
        user_id: str = "default_user",
        memory_enabled: bool = True
    ) -> tuple[str, List[Dict[str, Any]]]:
        """Generate a response to user message with memory context and web search."""
        memories_used = []
        
        # Retrieve relevant memories if enabled
        if memory_enabled:
            memories_used = self.memory_manager.retrieve_memories(
                query=user_message,
                user_id=user_id,
                limit=settings.max_memory_results
            )
        
        # Build prompt with system instructions and memory context
        full_prompt = self.system_prompt
        
        if memories_used:
            memory_context = self._format_memories_for_context(memories_used)
            full_prompt += f"\n\n{memory_context}"
        
        full_prompt += f"\n\nUser: {user_message}\n\nAssistant:"
        
        # Generate response with retry logic and function calling
        max_retries = 3
        base_delay = 1
        
        for attempt in range(max_retries):
            try:
                # Start chat with function calling enabled
                chat = self.model.start_chat()
                response = chat.send_message(full_prompt)
                
                # Handle function calls
                while response.candidates[0].content.parts[0].function_call:
                    function_call = response.candidates[0].content.parts[0].function_call
                    
                    # Execute web search
                    if function_call.name == "search_web":
                        query = function_call.args.get("query", "")
                        search_results = web_search.search(query)
                        
                        # Send results back to model
                        response = chat.send_message(
                            genai.protos.Content(
                                parts=[genai.protos.Part(
                                    function_response=genai.protos.FunctionResponse(
                                        name="search_web",
                                        response={"result": search_results}
                                    )
                                )]
                            )
                        )
                
                # Get final text response
                response_text = response.text
                break
                
            except Exception as e:
                if "429" in str(e) and attempt < max_retries - 1:
                    import time
                    import random
                    delay = (base_delay * (2 ** attempt)) + (random.random() * 0.5)
                    print(f"Rate limit hit, retrying in {delay:.2f}s...")
                    time.sleep(delay)
                else:
                    raise e
        
        # Process conversation for potential memory storage
        if memory_enabled:
            self.memory_manager.process_conversation_for_memory(
                user_message=user_message,
                assistant_response=response_text,
                user_id=user_id
            )
        
        return response_text, memories_used
