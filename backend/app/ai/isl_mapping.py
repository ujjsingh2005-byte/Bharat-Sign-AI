"""
Bharat Sign AI 3 - ISL Mapping Engine (Linguistic Transformation Layer)
Transforms Semantic Intermediate Representation into target Indian Sign Language (ISL) Grammar
Sentence Structure: Time -> Subject -> Object -> Verb -> Negation -> Question
"""

from typing import Dict, Any, List
from app.ai.sign_dictionary import VOCABULARY_SIGNS

class ISLMappingEngine:
    def __init__(self):
        self.vocabulary = set(VOCABULARY_SIGNS.keys())

    def map_semantics_to_isl(self, semantics: Dict[str, Any]) -> Dict[str, Any]:
        """
        Transforms structured semantics into an explicit ISL Gloss Sequence.
        ISL Grammar Standard Order: [TIME] [SUBJECT] [OBJECT] [VERB] [NEGATION] [QUESTION]
        """
        isl_gloss: List[str] = []
        unknown_words: List[str] = []
        
        # 1. TIME
        if semantics.get("time"):
            isl_gloss.append(semantics["time"])
            
        # 2. SUBJECT
        if semantics.get("subject"):
            isl_gloss.append(semantics["subject"])
            
        # 3. OBJECT / DESTINATION
        if semantics.get("destination"):
            isl_gloss.append(semantics["destination"])
        if semantics.get("object"):
            isl_gloss.append(semantics["object"])
            
        # 4. VERB
        if semantics.get("action") and semantics["action"] not in ["STATEMENT", "NONE"]:
            isl_gloss.append(semantics["action"])
            
        # 5. NEGATION
        if semantics.get("negation"):
            isl_gloss.append("NO")
            
        # 6. QUESTION
        if semantics.get("question"):
            isl_gloss.append(semantics["question"])

        # Fallback if empty
        if not isl_gloss:
            isl_gloss = ["HELLO"]

        # Map to Sign Items and check unknown sign availability
        mapped_signs = []
        for word in isl_gloss:
            upper_word = word.upper()
            if upper_word in VOCABULARY_SIGNS:
                mapped_signs.append({
                    "word": upper_word,
                    "animation": VOCABULARY_SIGNS[upper_word],
                    "type": "sign",
                    "available": True,
                    "description": f"Validated ISL gesture for '{upper_word}'"
                })
            else:
                unknown_words.append(upper_word)
                mapped_signs.append({
                    "word": upper_word,
                    "animation": upper_word.lower(),
                    "type": "sign",
                    "available": False,
                    "description": f"Procedural sign item for '{upper_word}'"
                })

        return {
            "targetLanguage": "Indian Sign Language (ISL)",
            "grammarRule": "Time + Subject + Object + Verb + Negation + Question",
            "isl_gloss": isl_gloss,
            "isl_gloss_text": " ".join(isl_gloss),
            "signs": mapped_signs,
            "unknown_words": unknown_words,
            "signAvailabilityRate": 100.0 if not unknown_words else round(((len(isl_gloss) - len(unknown_words)) / len(isl_gloss)) * 100, 2)
        }

isl_mapping_engine = ISLMappingEngine()
