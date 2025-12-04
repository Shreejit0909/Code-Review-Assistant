"""
Configuration Management Module

This module handles all application configuration using environment variables
and Pydantic settings for type safety and validation.
"""

from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    
    Attributes:
        OLLAMA_URL: Base URL for Ollama API endpoint
        MODEL_NAME: Name of the Ollama model to use for code review
        MAX_FILE_SIZE: Maximum allowed file size in bytes (default: 5MB)
        REQUEST_TIMEOUT: HTTP request timeout in seconds
    """
    
    OLLAMA_URL: str = "http://localhost:11434/api/generate"
    MODEL_NAME: str = "qwen2.5-coder:14b"
    MAX_FILE_SIZE: int = 5 * 1024 * 1024  # 5MB
    REQUEST_TIMEOUT: int = 120  # 2 minutes for LLM responses
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


# Global settings instance
settings = Settings()
