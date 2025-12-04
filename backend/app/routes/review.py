"""
Code Review API Routes

This module defines all API endpoints for the code review functionality,
including file upload, analysis, and review generation.
"""

from fastapi import APIRouter, UploadFile, File, HTTPException, status
from fastapi.responses import JSONResponse
from app.models.review_model import ReviewResponse, ErrorResponse
from app.services.llm_service import llm_service
from app.services.summary_service import summary_service
from app.services.diff_service import diff_service
from app.core.config import settings
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize router
router = APIRouter()


@router.post(
    "/review",
    response_model=ReviewResponse,
    status_code=status.HTTP_200_OK,
    summary="Review Code File",
    description="Upload a code file for AI-powered review, improvement suggestions, and diff generation"
)
async def review_code(file: UploadFile = File(...)):
    """
    Main endpoint for code review functionality.
    
    This endpoint:
    1. Accepts a code file upload
    2. Generates a summary of the code
    3. Creates an improved version using LLM
    4. Computes a unified diff
    5. Returns all results in a structured response
    
    Args:
        file: Uploaded code file (any text-based code file)
        
    Returns:
        ReviewResponse: Contains summary, original code, improved code, and diff
        
    Raises:
        HTTPException: If file processing or LLM operations fail
    """
    try:
        # Validate file
        if not file.filename:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No file provided"
            )
        
        # Read file content
        logger.info(f"Processing file: {file.filename}")
        content = await file.read()
        
        # Check file size
        if len(content) > settings.MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"File size exceeds maximum allowed size of {settings.MAX_FILE_SIZE} bytes"
            )
        
        # Decode content
        try:
            original_code = content.decode("utf-8")
        except UnicodeDecodeError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File must be a valid text file with UTF-8 encoding"
            )
        
        # Validate code is not empty
        if not original_code.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded file is empty"
            )
        
        logger.info("Generating code summary...")
        # Generate summary (3-4 lines)
        summary = await summary_service.create_summary(original_code, file.filename)
        
        logger.info("Generating improved code...")
        # Generate improved code
        improved_code = await llm_service.generate_improved_code(original_code, file.filename)
        
        logger.info("Generating diff...")
        # Generate diff
        diff = diff_service.generate_diff(original_code, improved_code, file.filename)
        
        logger.info(f"Successfully completed review for {file.filename}")
        
        # Return structured response
        return ReviewResponse(
            summary=summary,
            original_code=original_code,
            improved_code=improved_code,
            diff=diff,
            filename=file.filename
        )
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    
    except Exception as e:
        # Log unexpected errors
        logger.error(f"Error processing file {file.filename}: {str(e)}")
        
        # Return structured error response
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process code review: {str(e)}"
        )


@router.get(
    "/review/health",
    summary="Check Review Service Health",
    description="Verify that the review service and LLM connection are operational"
)
async def review_health_check():
    """
    Health check endpoint specifically for the review service.
    
    Returns:
        dict: Status of the review service and LLM configuration
    """
    return {
        "status": "healthy",
        "service": "code-review",
        "llm_configured": True,
        "ollama_url": settings.OLLAMA_URL,
        "model": settings.MODEL_NAME
    }
