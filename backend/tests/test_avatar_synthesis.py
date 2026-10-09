"""
Automated Unit Tests for Bharat Sign AI 3 - Task 3/4: 3D Avatar Animation & ISL Validation Engine.
Tests:
1. End-to-end Input Sentence -> ISL Grammar Reordering -> Validated Sign Sequence.
2. Controlled Sign-to-Animation keyframe mapping for validated ISL gestures.
3. ISL Manual Alphabet fingerspelling fallback for unmapped words.
4. Handling of unvalidated vocabulary without inventing fake signs.
"""

import pytest
from app.ai.gloss import text_to_gloss
from app.ai.sign_dictionary import get_signs, VOCABULARY_SIGNS

def test_isl_grammar_reordering():
    # Input English sentence: "Where is the hospital?"
    sentence = "Where is the hospital?"
    gloss_res = text_to_gloss(sentence)
    
    assert gloss_res["raw"] == sentence
    # ISL Grammar Rule: Question word 'WHERE' placed at the end: [HOSPITAL, WHERE]
    assert "HOSPITAL" in gloss_res["gloss"]
    assert "WHERE" in gloss_res["gloss"]
    assert gloss_res["gloss"][-1] == "WHERE"

def test_validated_sign_to_animation_mapping():
    gloss_tokens = ["HOSPITAL", "WHERE"]
    signs = get_signs(gloss_tokens)
    
    assert len(signs) == 2
    assert signs[0]["word"] == "HOSPITAL"
    assert signs[0]["animation"] == "hospital"
    assert signs[0]["is_validated"] is True
    assert signs[0]["validation_status"] == "LINGUISTICALLY_VALIDATED"

    assert signs[1]["word"] == "WHERE"
    assert signs[1]["animation"] == "where"
    assert signs[1]["is_validated"] is True
    assert signs[1]["validation_status"] == "LINGUISTICALLY_VALIDATED"

def test_isl_fingerspelling_fallback_mapping():
    # Unmapped vocabulary word "XYZQUANTUM"
    gloss_tokens = ["XYZQUANTUM"]
    signs = get_signs(gloss_tokens, allow_fingerspelling_fallback=True)

    # Should fall back to ISL manual alphabet fingerspelled tokens X-Y-Z-Q-U-A-N-T-U-M
    assert len(signs) == 10
    assert signs[0]["word"] == "letter_X"
    assert signs[0]["type"] == "letter"
    assert signs[0]["validation_status"] == "ISL_FINGERSPELLING_LETTER"
    assert signs[0]["is_validated"] is True

def test_unvalidated_text_fallback_notice():
    # Unmapped vocabulary word when fingerspelling is disabled or contains non-alphas
    gloss_tokens = ["XYZQUANTUM999"]
    signs = get_signs(gloss_tokens, allow_fingerspelling_fallback=False)

    assert len(signs) == 1
    assert signs[0]["word"] == "XYZQUANTUM999"
    assert signs[0]["type"] == "text_fallback"
    assert signs[0]["is_validated"] is False
    assert signs[0]["validation_status"] == "UNVALIDATED_TEXT_FALLBACK"
    assert signs[0]["available"] is False

def test_complete_sentence_avatar_sequence():
    sentence = "I am going to school tomorrow."
    gloss_res = text_to_gloss(sentence)
    signs = get_signs(gloss_res["gloss"])

    assert len(signs) > 0
    for item in signs:
        assert "word" in item
        assert "type" in item
        assert "animation" in item
        assert "is_validated" in item
