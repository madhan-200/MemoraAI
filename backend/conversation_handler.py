"""Simplified conversation handling using Google Generative AI SDK directly."""
from typing import List, Dict, Any
import google.generativeai as genai
from config import settings
from memory_manager import MemoryManager


class ConversationHandler:
    """Handles conversations with memory-augmented context."""
    
    def __init__(self, memory_manager: MemoryManager):
        """Initialize conversation handler."""
        self.memory_manager = memory_manager
        
        # Configure Gemini
        genai.configure(api_key=settings.gemini_api_key)
        self.model = genai.GenerativeModel(settings.gemini_model)
        
        # System prompt
        self.system_prompt = """You are Memora, a helpful AI assistant with long-term memory capabilities. 
You can remember information about the user across conversations and use that context to provide 
more personalized and relevant responses.

When relevant memories are provided, use them naturally in your responses. If you don't have 
specific information in your memory, be honest about it rather than making assumptions.

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
        """Generate a response to user message with memory context."""
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
        
        # Generate response
        response = self.model.generate_content(full_prompt)
        response_text = response.text
        
        # Process conversation for potential memory storage
        if memory_enabled:
            self.memory_manager.process_conversation_for_memory(
                user_message=user_message,
                assistant_response=response_text,
                user_id=user_id
            )
        
        return response_text, memories_used
