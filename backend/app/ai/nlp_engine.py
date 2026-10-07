"""
Bharat Sign AI 3 - NLP Processing & Semantic Intermediate Representation Engine
Extracts Intents, Entities, and Semantic Relations to produce a structured
Semantic Intermediate Representation as required by Section 11 & 12 of Master Prompt.
"""

import re
from typing import Dict, Any, List

# Intent Taxonomy Definition
INTENTS = {
    "TRAVEL": ["go", "going", "travel", "flight", "train", "bus", "visit", "delhi", "mumbai"],
    "BOOKING": ["book", "reserve", "ticket", "hotel", "seat", "room"],
    "MEDICAL": ["doctor", "hospital", "medicine", "fever", "pain", "treatment", "sick", "help"],
    "EDUCATION": ["school", "college", "study", "teacher", "book", "read", "student", "class"],
    "FAMILY": ["father", "mother", "brother", "sister", "family", "friend", "home", "house"],
    "GREETING": ["hello", "namaste", "welcome", "good morning", "thanks", "thankyou"],
}

# Entities Dictionary
TIME_ENTITIES = ["today", "tomorrow", "yesterday", "now", "morning", "night", "later", "kal", "aaj"]
LOCATION_ENTITIES = ["delhi", "mumbai", "kolkata", "chennai", "bengaluru", "hospital", "school", "home", "office"]
OBJECT_ENTITIES = ["ticket", "water", "food", "medicine", "book", "computer", "car", "bus", "train", "money"]
PRONOUN_ENTITIES = ["i", "me", "my", "you", "your", "he", "she", "we", "they"]

def extract_nlp_semantics(text: str) -> Dict[str, Any]:
    """
    Parses normalized transcript text into an explicit Semantic Intermediate Representation.
    Returns Intent, Entities, Subject, Action, Object, Destination, Time, Negation, Question.
    """
    raw = text.strip()
    words = [re.sub(r'[^\w\s]', '', w.lower()) for w in raw.split()]
    
    # 1. Detect Intent
    detected_intent = "GENERAL_STATEMENT"
    max_matches = 0
    for intent_name, keywords in INTENTS.items():
        matches = sum(1 for w in words if w in keywords)
        if matches > max_matches:
            max_matches = matches
            detected_intent = intent_name

    # 2. Detect Entities & Roles
    subject = None
    action = None
    obj = None
    destination = None
    time_entity = None
    question_word = None
    negation = False

    for w in words:
        if w in ["not", "no", "never", "dont", "cant", "naha", "nahi"]:
            negation = True
        elif w in ["what", "where", "when", "why", "how", "who", "kya", "kahan"]:
            question_word = w.upper()
        elif w in TIME_ENTITIES:
            time_entity = w.upper()
        elif w in LOCATION_ENTITIES:
            destination = w.upper()
        elif w in OBJECT_ENTITIES:
            obj = w.upper()
        elif w in PRONOUN_ENTITIES or w in ["father", "mother", "doctor", "teacher"]:
            if not subject:
                subject = w.upper()
        elif w in ["go", "going", "want", "need", "eat", "drink", "help", "work", "study", "buy"]:
            if not action:
                action = w.upper()

    # 3. Construct Semantic Intermediate Representation
    semantic_ir = {
        "intent": detected_intent,
        "subject": subject or "ME",
        "action": action or "STATEMENT",
        "object": obj,
        "destination": destination,
        "time": time_entity,
        "negation": negation,
        "question": question_word,
        "entities": {
            "time": time_entity,
            "location": destination,
            "object": obj,
            "subject": subject
        },
        "semantic_relations": [
            f"Subject({subject or 'ME'}) -> Action({action or 'STATEMENT'})",
            f"Action -> Destination({destination})" if destination else None,
            f"Action -> Time({time_entity})" if time_entity else None,
        ]
    }
    semantic_ir["semantic_relations"] = [r for r in semantic_ir["semantic_relations"] if r]
    
    return semantic_ir
