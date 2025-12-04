"""
Diff Service Module

This module provides functionality to generate unified diffs between
original and improved code versions using Python's difflib.
"""

import difflib
from typing import List


class DiffService:
    """
    Service class for generating code diffs.
    
    This service uses Python's difflib to create GitHub-style unified diffs
    showing the changes between original and improved code.
    """
    
    def generate_diff(
        self,
        original_code: str,
        improved_code: str,
        filename: str = "code"
    ) -> str:
        """
        Generate a unified diff between original and improved code.
        
        The diff format is similar to GitHub's diff view, showing:
        - Lines removed (prefixed with -)
        - Lines added (prefixed with +)
        - Context lines (unchanged)
        
        Args:
            original_code: The original source code
            improved_code: The improved version of the code
            filename: Name of the file (used in diff headers)
            
        Returns:
            str: Unified diff as a string, or message if no changes
        """
        # Split code into lines for difflib
        original_lines = original_code.splitlines(keepends=True)
        improved_lines = improved_code.splitlines(keepends=True)
        
        # Generate unified diff
        diff = difflib.unified_diff(
            original_lines,
            improved_lines,
            fromfile=f"a/{filename}",
            tofile=f"b/{filename}",
            lineterm=""
        )
        
        # Convert generator to string
        diff_text = "\n".join(diff)
        
        # Return appropriate message if no changes
        if not diff_text.strip():
            return "No changes detected between original and improved code."
        
        return diff_text
    
    def get_diff_stats(self, diff_text: str) -> dict:
        """
        Calculate statistics from a unified diff.
        
        Args:
            diff_text: The unified diff string
            
        Returns:
            dict: Statistics including lines added, removed, and changed
        """
        lines = diff_text.split("\n")
        
        added = sum(1 for line in lines if line.startswith("+") and not line.startswith("+++"))
        removed = sum(1 for line in lines if line.startswith("-") and not line.startswith("---"))
        
        return {
            "lines_added": added,
            "lines_removed": removed,
            "total_changes": added + removed
        }


# Global diff service instance
diff_service = DiffService()
