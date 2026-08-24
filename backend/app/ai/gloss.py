from app.ai.semantic_layer import analyze_semantics

def text_to_gloss(text: str) -> dict:
    """
    Transforms natural language English text into Indian Sign Language (ISL) Gloss structure
    utilizing semantic analysis and ISL grammar rules.
    """
    if not text or not text.strip():
        return {
            "raw": "",
            "gloss": [],
            "gloss_text": "",
            "semantics": {},
            "rule_applied": "None",
        }

    semantics = analyze_semantics(text)
    gloss = semantics.get("isl_gloss", [])

    return {
        "raw": text,
        "gloss": gloss,
        "gloss_text": " ".join(gloss),
        "semantics": semantics,
        "rule_applied": semantics.get("grammar_rule", "ISL Grammar Reordering"),
    }
