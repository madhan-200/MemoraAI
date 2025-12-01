"""FastAPI backend for AI Agent with Memory."""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from datetime import datetime
import logging

from config import settings
from models import (
    ChatRequest, ChatResponse,
    RememberRequest, RememberResponse,
    RecallRequest, RecallResponse,
    StatusResponse
)
from memory_manager import MemoryManager
from conversation_handler import ConversationHandler

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global instances
memory_manager: MemoryManager = None
conversation_handler: ConversationHandler = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup and shutdown events."""
    global memory_manager, conversation_handler
    
    # Startup
    logger.info("Starting AI Agent backend...")
    
    # Validate settings
    try:
        settings.validate_settings()
    except ValueError as e:
        logger.error(f"Configuration error: {e}")
        raise
    
    # Initialize memory manager
    logger.info("Initializing Memory Manager...")
    memory_manager = MemoryManager()
    
    # Initialize conversation handler
    logger.info("Initializing Conversation Handler...")
    conversation_handler = ConversationHandler(memory_manager)
    
    logger.info("Backend ready!")
    
    yield
    
    # Shutdown
    logger.info("Shutting down AI Agent backend...")


# Create FastAPI app
app = FastAPI(
    title="AI Agent with Memory",
    description="Voice/text-interactive assistant with persistent long-term memory",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "AI Agent with Memory API",
        "version": "1.0.0",
        "status": "operational"
    }


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Chat endpoint for conversational interactions.
    
    Processes user message, retrieves relevant memories, and generates response.
    """
    try:
        logger.info(f"Chat request from user: {request.user_id}")
        
        # Generate response with memory context
        response_text, memories_used = conversation_handler.generate_response(
            user_message=request.message,
            user_id=request.user_id,
            memory_enabled=request.memory_enabled
        )
        
        return ChatResponse(
            response=response_text,
            memories_used=memories_used,
            timestamp=datetime.utcnow()
        )
        
    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing chat: {str(e)}")


@app.post("/remember", response_model=RememberResponse)
async def remember(request: RememberRequest):
    """
    Explicit memory storage endpoint.
    
    Allows users to explicitly store information in memory.
    """
    try:
        logger.info(f"Remember request from user: {request.user_id}")
        
        # Store memory
        memory_id = memory_manager.store_memory(
            content=f"{request.key}: {request.value}",
            user_id=request.user_id,
            metadata={
                "key": request.key,
                "type": "explicit",
                **(request.metadata or {})
            },
            source="Explicit user request"
        )
        
        return RememberResponse(
            success=True,
            memory_id=memory_id,
            message=f"Successfully stored memory: {request.key}"
        )
        
    except Exception as e:
        logger.error(f"Error in remember endpoint: {e}")
        raise HTTPException(status_code=500, detail=f"Error storing memory: {str(e)}")


@app.post("/recall", response_model=RecallResponse)
async def recall(request: RecallRequest):
    """
    Memory recall endpoint.
    
    Retrieves memories based on semantic similarity to query.
    """
    try:
        logger.info(f"Recall request from user: {request.user_id}")
        
        # Retrieve memories
        memories = memory_manager.retrieve_memories(
            query=request.query,
            user_id=request.user_id,
            limit=request.limit
        )
        
        return RecallResponse(
            memories=memories,
            count=len(memories)
        )
        
    except Exception as e:
        logger.error(f"Error in recall endpoint: {e}")
        raise HTTPException(status_code=500, detail=f"Error recalling memories: {str(e)}")


@app.get("/status", response_model=StatusResponse)
async def status(user_id: str = "default_user"):
    """
    Status endpoint.
    
    Returns system status and memory statistics.
    """
    try:
        # Get memory stats
        stats = memory_manager.get_memory_stats(user_id=user_id)
        
        return StatusResponse(
            status="operational",
            memory_count=stats.get("total_memories", 0),
            last_update=datetime.utcnow(),
            storage_status=stats.get("status", "unknown")
        )
        
    except Exception as e:
        logger.error(f"Error in status endpoint: {e}")
        raise HTTPException(status_code=500, detail=f"Error getting status: {str(e)}")


@app.get("/health")
async def health():
    """Health check endpoint for deployment platforms."""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=True
    )
