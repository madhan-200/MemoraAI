"""Pydantic models for API request/response validation."""
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime


class ChatRequest(BaseModel):
    """Request model for chat endpoint."""
    message: str = Field(..., min_length=1, description="User message text")
    user_id: str = Field(default="default_user", description="User identifier for memory isolation")
    memory_enabled: bool = Field(default=True, description="Whether to use memory for this request")
    voice_data: Optional[str] = Field(default=None, description="Base64 encoded voice data (future use)")


class ChatResponse(BaseModel):
    """Response model for chat endpoint."""
    response: str = Field(..., description="Assistant's response message")
    memories_used: List[Dict[str, Any]] = Field(default_factory=list, description="Memories retrieved for context")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Response timestamp")


class RememberRequest(BaseModel):
    """Request model for explicit memory storage."""
    key: str = Field(..., min_length=1, description="Memory key/category")
    value: str = Field(..., min_length=1, description="Memory content")
    user_id: str = Field(default="default_user", description="User identifier")
    metadata: Optional[Dict[str, Any]] = Field(default=None, description="Additional metadata")


class RememberResponse(BaseModel):
    """Response model for remember endpoint."""
    success: bool = Field(..., description="Whether memory was stored successfully")
    memory_id: str = Field(..., description="Unique identifier for the stored memory")
    message: str = Field(..., description="Status message")


class RecallRequest(BaseModel):
    """Request model for memory recall."""
    query: str = Field(..., min_length=1, description="Query to search memories")
    user_id: str = Field(default="default_user", description="User identifier")
    limit: int = Field(default=5, ge=1, le=20, description="Maximum number of memories to retrieve")


class RecallResponse(BaseModel):
    """Response model for recall endpoint."""
    memories: List[Dict[str, Any]] = Field(..., description="Retrieved memories with metadata")
    count: int = Field(..., description="Number of memories found")


class StatusResponse(BaseModel):
    """Response model for status endpoint."""
    status: str = Field(default="operational", description="Service status")
    memory_count: int = Field(..., description="Total number of stored memories")
    last_update: Optional[datetime] = Field(default=None, description="Last memory update timestamp")
    storage_status: str = Field(..., description="Memory storage connection status")


class Memory(BaseModel):
    """Internal model for memory representation."""
    id: str = Field(..., description="Unique memory identifier")
    content: str = Field(..., description="Memory content")
    user_id: str = Field(..., description="User identifier")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Creation timestamp")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Additional metadata")
    source: Optional[str] = Field(default=None, description="Source conversation snippet")
