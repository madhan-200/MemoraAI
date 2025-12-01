"""Simplified memory management using JSON file storage."""
import json
import re
import uuid
from typing import List, Dict, Any, Optional
from datetime import datetime
from pathlib import Path


class MemoryManager:
    """Manages long-term memory storage using JSON files."""
    
    def __init__(self, storage_path: str = "./memories.json"):
        """Initialize memory manager with JSON file storage."""
        self.storage_path = Path(storage_path)
        self.memories = self._load_memories()
        
    def _load_memories(self) -> List[Dict[str, Any]]:
        """Load memories from JSON file."""
        if self.storage_path.exists():
            try:
                with open(self.storage_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception as e:
                print(f"Error loading memories: {e}")
                return []
        return []
    
    def _save_memories(self) -> None:
        """Save memories to JSON file."""
        try:
            with open(self.storage_path, 'w', encoding='utf-8') as f:
                json.dump(self.memories, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"Error saving memories: {e}")
    
    def _detect_memory_worthy_content(self, message: str) -> bool:
        """
        Detect if a message contains memory-worthy information.
        
        Conditions:
        - User expresses a preference (I like, I love, I prefer, my favorite)
        - User asks to remember something (remember, don't forget, keep in mind)
        - Long-term goals or habits mentioned (I want to, I'm trying to, I always)
        - Personal information (my name is, I am, I work as)
        """
        memory_patterns = [
            r'\b(i like|i love|i prefer|my favorite|i enjoy)\b',
            r'\b(remember|don\'t forget|keep in mind|note that)\b',
            r'\b(i want to|i\'m trying to|i always|i never|my goal)\b',
            r'\b(my name is|i am|i work as|i live in|i\'m from)\b',
            r'\b(i hate|i dislike|i don\'t like)\b',
        ]
        
        message_lower = message.lower()
        for pattern in memory_patterns:
            if re.search(pattern, message_lower):
                return True
        return False
    
    def store_memory(
        self,
        content: str,
        user_id: str = "default_user",
        metadata: Optional[Dict[str, Any]] = None,
        source: Optional[str] = None
    ) -> str:
        """
        Store a memory in JSON file.
        
        Args:
            content: The memory content to store
            user_id: User identifier for memory isolation
            metadata: Additional metadata to store
            source: Source conversation snippet
            
        Returns:
            Memory ID
        """
        memory_id = str(uuid.uuid4())
        timestamp = datetime.utcnow().isoformat()
        
        memory = {
            "id": memory_id,
            "content": content,
            "user_id": user_id,
            "timestamp": timestamp,
            "source": source or "",
            "metadata": metadata or {}
        }
        
        self.memories.append(memory)
        self._save_memories()
        
        return memory_id
    
    def retrieve_memories(
        self,
        query: str,
        user_id: str = "default_user",
        limit: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Retrieve relevant memories based on keyword matching.
        
        Args:
            query: Query text to search for
            user_id: User identifier to filter memories
            limit: Maximum number of memories to retrieve
            
        Returns:
            List of memory dictionaries with content and metadata
        """
        # Filter by user_id
        user_memories = [m for m in self.memories if m.get("user_id") == user_id]
        
        # Simple keyword matching (case-insensitive)
        query_lower = query.lower()
        query_words = set(query_lower.split())
        
        # Score memories by keyword overlap
        scored_memories = []
        for memory in user_memories:
            content_lower = memory["content"].lower()
            content_words = set(content_lower.split())
            
            # Calculate overlap score
            overlap = len(query_words & content_words)
            if overlap > 0 or query_lower in content_lower:
                scored_memories.append((memory, overlap))
        
        # Sort by score and return top results
        scored_memories.sort(key=lambda x: x[1], reverse=True)
        return [m[0] for m in scored_memories[:limit]]
    
    def process_conversation_for_memory(
        self,
        user_message: str,
        assistant_response: str,
        user_id: str = "default_user"
    ) -> Optional[str]:
        """
        Analyze conversation and store memory if conditions are met.
        
        Args:
            user_message: User's message
            assistant_response: Assistant's response
            user_id: User identifier
            
        Returns:
            Memory ID if stored, None otherwise
        """
        if self._detect_memory_worthy_content(user_message):
            source = f"User: {user_message[:100]}..."
            metadata = {
                "type": "conversation",
                "assistant_response": assistant_response[:200]
            }
            return self.store_memory(
                content=user_message,
                user_id=user_id,
                metadata=metadata,
                source=source
            )
        return None
    
    def get_memory_stats(self, user_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Get statistics about stored memories.
        
        Args:
            user_id: Optional user ID to filter stats
            
        Returns:
            Dictionary with memory statistics
        """
        if user_id:
            count = len([m for m in self.memories if m.get("user_id") == user_id])
        else:
            count = len(self.memories)
        
        return {
            "total_memories": count,
            "user_id": user_id,
            "status": "operational"
        }
