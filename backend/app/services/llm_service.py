"""
LLM Service Module

This module handles all interactions with the Ollama LLM API,
including summary generation and code improvement requests.
"""

import httpx
import json
from typing import Optional
from app.core.config import settings


class LLMService:
    """
    Service class for interacting with Ollama LLM API.
    
    This class provides async methods to generate code summaries and
    improved code versions using the configured Ollama model.
    """
    
    def __init__(self):
        """Initialize LLM service with configuration settings."""
        self.ollama_url = settings.OLLAMA_URL
        self.model_name = settings.MODEL_NAME
        self.timeout = settings.REQUEST_TIMEOUT
    
    async def _call_ollama(self, prompt: str) -> Optional[str]:
        """
        Internal method to make async HTTP calls to Ollama API.
        
        Args:
            prompt: The prompt to send to the LLM
            
        Returns:
            str: Generated response from LLM, or None if request fails
            
        Raises:
            httpx.HTTPError: If the HTTP request fails
            json.JSONDecodeError: If response parsing fails
        """
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                payload = {
                    "model": self.model_name,
                    "prompt": prompt,
                    "stream": False
                }
                
                response = await client.post(
                    self.ollama_url,
                    json=payload,
                    headers={"Content-Type": "application/json"}
                )
                
                response.raise_for_status()
                result = response.json()
                
                # Extract the generated response
                return result.get("response", "").strip()
                
        except httpx.TimeoutException:
            raise Exception(f"LLM request timed out after {self.timeout} seconds")
        except httpx.HTTPError as e:
            raise Exception(f"HTTP error occurred: {str(e)}")
        except json.JSONDecodeError as e:
            raise Exception(f"Failed to parse LLM response: {str(e)}")
        except Exception as e:
            raise Exception(f"Unexpected error in LLM service: {str(e)}")
    
    async def generate_summary(self, code: str, filename: str) -> str:
        """
        Generate a concise 3-4 line summary of the provided code.
        
        Args:
            code: The source code to summarize
            filename: Name of the file being reviewed
            
        Returns:
            str: A 3-4 line summary of the code
        """
        prompt = f"""You are a code review expert. Analyze the following code and provide a concise summary in EXACTLY 3-4 lines.

Focus on:
- What the code does (main purpose)
- Key functionality or algorithms used
- Overall code quality and structure

File: {filename}

Code:
```
{code}
```

Provide ONLY a 3-4 line summary. Do not include any code, explanations, or additional commentary."""
        
        summary = await self._call_ollama(prompt)
        
        if not summary:
            return "Unable to generate summary. Please try again."
        
        return summary
    
    async def generate_improved_code(self, code: str, filename: str) -> str:
        """
        Generate an improved version of the code with better structure and documentation.
        
        This method focuses on:
        - Better formatting and indentation
        - Adding docstrings and comments
        - Improving variable/function naming
        - Enhancing code structure and readability
        
        IMPORTANT: Does NOT change the logic or add new features.
        
        Args:
            code: The original source code
            filename: Name of the file being reviewed
            
        Returns:
            str: Improved version of the code
        """
        prompt = f"""You are a code review expert. Improve the following code by enhancing ONLY its readability, structure, and documentation.

STRICT RULES:
1. DO NOT change the logic or functionality
2. DO NOT add new features or capabilities
3. DO NOT remove existing functionality
4. ONLY improve:
   - Code formatting and indentation
   - Variable and function naming (make them more descriptive)
   - Add comprehensive docstrings to functions/classes
   - Add inline comments for complex logic
   - Improve code structure and organization
   - Follow language-specific best practices

File: {filename}

Original Code:
```
{code}
```

Return ONLY the improved code. Do not include explanations, markdown formatting, or any text outside the code itself."""
        
        improved_code = await self._call_ollama(prompt)
        
        if not improved_code:
            return code  # Return original if improvement fails
        
        # Clean up any markdown code blocks that might be in the response
        improved_code = improved_code.strip()
        if improved_code.startswith("```"):
            lines = improved_code.split("\n")
            # Remove first and last lines if they are markdown code fences
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines and lines[-1].startswith("```"):
                lines = lines[:-1]
            improved_code = "\n".join(lines)
        
        return improved_code.strip()


# Global LLM service instance
llm_service = LLMService()
