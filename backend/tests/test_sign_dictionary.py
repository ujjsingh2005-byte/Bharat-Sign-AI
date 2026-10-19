import pytest
from app.ai.sign_dictionary import get_sign, get_signs, get_all_signs, VOCABULARY_SIGNS, LEMMA_MAP

def test_get_all_signs_catalog():
    data = get_all_signs()
    assert data["total_validated_signs"] >= 200
    assert len(data["categories"]) > 0
    assert "Greetings" in data["categories"]
    assert "Emergency" in data["categories"]

def test_lookup_validated_sign():
    sign = get_sign("HELLO")
    assert sign["word"] == "HELLO"
    assert sign["is_validated"] is True
    assert sign["validation_status"] == "LINGUISTICALLY_VALIDATED"
    assert sign["animation"] == "hello"

def test_lookup_hinglish_lemma():
    sign = get_sign("PAANI")
    assert sign["word"] == "WATER"
    assert sign["is_validated"] is True
    assert sign["animation"] == "water"

def test_lookup_unvalidated_fallback():
    sign = get_sign("UNKNOWN_NONEXISTENT_WORD_123")
    assert sign["word"] == "UNKNOWN_NONEXISTENT_WORD_123"
    assert sign["is_validated"] is False
    assert sign["validation_status"] == "UNVALIDATED_TEXT_FALLBACK"

def test_map_multiple_gloss_signs():
    gloss_list = ["NAMASTE", "WATER", "HELP"]
    signs = get_signs(gloss_list)
    assert len(signs) == 3
    assert signs[0]["word"] == "NAMASTE"
    assert signs[1]["word"] == "WATER"
    assert signs[2]["word"] == "HELP"
