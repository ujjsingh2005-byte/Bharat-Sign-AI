"""
Automated Unit Tests for Bharat Sign AI 3 - Task 4: 3D Avatar Animation & ISL Grammar Synthesis Engine.
Tests:
1. End-to-end Input Sentence -> ISL Grammar Reordering -> Validated Sign Sequence.
2. Sign-to-Animation keyframe mapping.
3. Automated dynamic kinematic sign mapping fallback for Out-of-Vocabulary (OOV) words.
4. Sequence order preservation and avatar playback structure.
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

def test_sign_to_animation_mapping():
    gloss_tokens = ["HOSPITAL", "WHERE"]
    signs = get_signs(gloss_tokens)
    
    assert len(signs) == 2
    assert signs[0]["word"] == "HOSPITAL"
    assert signs[0]["animation"] == "hospital"
    assert signs[0]["type"] == "sign"

    assert signs[1]["word"] == "WHERE"
    assert signs[1]["animation"] == "where"
    assert signs[1]["type"] == "sign"

def test_oov_dynamic_kinematic_synthesis_fallback():
    # Out of vocabulary word "XYZQUANTUM"
    gloss_tokens = ["XYZQUANTUM"]
    signs = get_signs(gloss_tokens)

    # Should fall back to dynamic 3D ISL sign item
    assert len(signs) == 1
    assert signs[0]["word"] == "XYZQUANTUM"
    assert signs[0]["animation"] == "xyzquantum"
    assert signs[0]["type"] == "sign"

def test_complete_sentence_avatar_sequence():
    sentence = "I am going to school tomorrow."
    gloss_res = text_to_gloss(sentence)
    signs = get_signs(gloss_res["gloss"])

    assert len(signs) > 0
    # Verify every item in sequence has valid animation label
    for item in signs:
        assert "word" in item
        assert "type" in item
        assert "animation" in item
