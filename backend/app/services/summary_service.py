"""
Summary Service Module

This module provides code summary generation functionality,
acting as a wrapper around the LLM service for summary-specific operations.
"""

from app.services.llm_service import llm_service


class SummaryService:
    """
    Service class for generating code summaries.
    
    This service uses the LLM to create concise, informative summaries
    of code files focusing on purpose, functionality, and quality.
    """
    
    async def create_summary(self, code: str, filename: str) -> str:
        """
        Create a 3-4 line summary of the provided code.
        
        The summary focuses on:
        - Main purpose and functionality
        - Key algorithms or patterns used
        - Overall code quality assessment
        
        Args:
            code: Source code to summarize
            filename: Name of the file being summarized
            
        Returns:
            str: A concise 3-4 line summary
            
        Raises:
            Exception: If summary generation fails
        """
        try:
            summary = await llm_service.generate_summary(code, filename)
            return summary
        except Exception as e:
            raise Exception(f"Failed to generate summary: {str(e)}")


# Global summary service instance
summary_service = SummaryService()
