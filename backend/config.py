"""Configuration management for the AI Agent backend."""
import os
from typing import List
from dotenv import load_dotenv

load_dotenv()


class Settings:
    """Application settings loaded from environment variables."""
    
    def __init__(self):
        # Gemini API Configuration
        self.gemini_api_key = os.getenv("GEMINI_API_KEY", "")
        
        # Tavily API Configuration (for web search)
        self.tavily_api_key = os.getenv("TAVILY_API_KEY", "")
        
        # Memory Configuration
        self.memory_file_path = os.getenv("MEMORY_FILE_PATH", "./memories.json")
        
        # CORS Configuration
        self.cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000")
        
        # Server Configuration
        self.host = os.getenv("HOST", "0.0.0.0")
        self.port = int(os.getenv("PORT", "8000"))
        
        # Model Configuration
        self.gemini_model = "models/gemini-2.0-flash-lite"
        
        # Memory Configuration
        self.max_memory_results = 5
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins from comma-separated string."""
        return [origin.strip() for origin in self.cors_origins.split(",")]
    
    def validate_settings(self) -> None:
        """Validate that required settings are present."""
        if not self.gemini_api_key:
            raise ValueError("GEMINI_API_KEY environment variable is required")


# Global settings instance
settings = Settings()
