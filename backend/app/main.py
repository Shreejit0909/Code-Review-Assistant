"""
FastAPI Application Entry Point for Code Review Assistant

This module initializes the FastAPI application and configures all routes,
middleware, and CORS settings for the AI-powered code review system.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import review
from app.core.config import settings

# Initialize FastAPI application
app = FastAPI(
    title="Code Review Assistant API",
    description="AI-powered automated code review system using Ollama LLM",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS for React frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with specific frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(review.router, prefix="/api", tags=["Code Review"])


@app.get("/")
async def root():
    """
    Root endpoint to verify API is running.
    
    Returns:
        dict: Welcome message and API status
    """
    return {
        "message": "Code Review Assistant API is running",
        "status": "active",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """
    Health check endpoint for monitoring and deployment verification.
    
    Returns:
        dict: Health status of the API
    """
    return {
        "status": "healthy",
        "ollama_url": settings.OLLAMA_URL,
        "model": settings.MODEL_NAME
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
