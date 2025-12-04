"""
Pydantic Models for Code Review API

This module defines request and response models for the code review endpoints,
ensuring type safety and automatic validation.
"""

from pydantic import BaseModel, Field
from typing import Optional


class ReviewResponse(BaseModel):
    """
    Response model for code review endpoint.
    
    Attributes:
        summary: Brief 3-4 line summary of the code
        original_code: The original uploaded code
        improved_code: AI-generated improved version of the code
        diff: Unified diff between original and improved code
        filename: Name of the reviewed file
    """
    
    summary: str = Field(..., description="3-4 line summary of the code")
    original_code: str = Field(..., description="Original code content")
    improved_code: str = Field(..., description="AI-improved code with better structure")
    diff: str = Field(..., description="Unified diff showing changes")
    filename: str = Field(..., description="Name of the reviewed file")


class ErrorResponse(BaseModel):
    """
    Standard error response model.
    
    Attributes:
        error: Error type or category
        message: Detailed error message
        details: Optional additional error details
    """
    
    error: str = Field(..., description="Error type")
    message: str = Field(..., description="Error message")
    details: Optional[str] = Field(None, description="Additional error details")
