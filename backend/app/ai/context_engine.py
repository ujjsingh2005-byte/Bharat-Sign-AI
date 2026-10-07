"""
Bharat Sign AI 3 - Context Engine
Provides conversational memory and context-aware entity resolution
(e.g., resolving pronouns "there" -> "Delhi", "he" -> last mentioned person).
"""

from typing import Dict, Any, Optional, List

class ContextEngine:
    def __init__(self):
        self.history: List[Dict[str, Any]] = []

    def resolve_context(self, current_semantics: Dict[str, Any], raw_text: str) -> Dict[str, Any]:
        """
        Enhances current semantic representation using conversational history.
        """
        resolved = dict(current_semantics)
        text_lower = raw_text.lower()
        
        # Check if previous context exists
        if self.history:
            prev = self.history[-1]
            prev_entities = prev.get("entities", {})
            
            # Resolve "there" -> previous location (e.g. "I want to go to Delhi" -> "I need a hotel there")
            if "there" in text_lower and prev_entities.get("location"):
                resolved["destination"] = prev_entities["location"]
                resolved["entities"]["location"] = prev_entities["location"]
                resolved["contextResolved"] = f"'there' -> {prev_entities['location']}"
                
            # Resolve "that" / "it" -> previous object
            elif ("that" in text_lower or "it" in text_lower) and prev_entities.get("object"):
                resolved["object"] = prev_entities["object"]
                resolved["entities"]["object"] = prev_entities["object"]
                resolved["contextResolved"] = f"'it' -> {prev_entities['object']}"

        # Push to session history
        self.history.append(resolved)
        if len(self.history) > 10:
            self.history.pop(0)

        return resolved

    def clear_history(self):
        self.history = []

context_engine = ContextEngine()
