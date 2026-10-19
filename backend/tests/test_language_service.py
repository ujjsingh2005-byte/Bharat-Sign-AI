"""
Automated Unit Tests for Bharat Sign AI 3 - Task 2 Regional Languages Module.
Tests:
1. Supported language catalog & explicit capability separation (ASR vs. Translation).
2. Handling of unsupported languages with informative error messages.
3. Preservation of selected language context throughout the processing pipeline.
4. Hindi-English code-switching (Hinglish) normalization and translation.
5. Separate evaluation of each supported language independently.
"""

import pytest
from app.ai.language_service import language_service, LANGUAGE_CATALOG

def test_language_catalog_capabilities():
    languages = language_service.get_supported_languages()
    assert len(languages) >= 16 # auto + 15 Indian languages

    # Check Hindi has both ASR & Translation supported
    hi_entry = [l for l in languages if l["code"] == "hi"][0]
    assert hi_entry["asr_supported"] is True
    assert hi_entry["translation_supported"] is True
    assert hi_entry["hinglish_code_switching"] is True

    # Check Bhojpuri has Translation supported but ASR marked unsupported
    bho_entry = [l for l in languages if l["code"] == "bho"][0]
    assert bho_entry["asr_supported"] is False
    assert bho_entry["translation_supported"] is True

def test_unsupported_language_handling():
    # Test completely unsupported language 'xx' or 'fr'
    is_valid, error = language_service.validate_language("xx", required_capability="translation")
    assert is_valid is False
    assert error["error_code"] == "UNSUPPORTED_LANGUAGE"
    assert "not currently configured" in error["message"]

    # Test processing semantic pipeline with unsupported language
    res = language_service.process_semantic_pipeline("Hello world", source_language="klingon")
    assert res["success"] is False
    assert res["error_code"] == "UNSUPPORTED_LANGUAGE"

def test_asr_unsupported_capability_check():
    # Test ASR validation for Bhojpuri ('bho') which has no native ASR model
    is_valid, error = language_service.validate_language("bho", required_capability="asr")
    assert is_valid is False
    assert error["error_code"] == "ASR_UNSUPPORTED_FOR_LANGUAGE"
    assert "Speech recognition (ASR) is not currently configured" in error["message"]

def test_language_preservation_in_pipeline():
    # Test Marathi ('mr') language input preservation
    marathi_input = "मला मदत हवी आहे."
    res = language_service.process_semantic_pipeline(marathi_input, source_language="mr")
    
    assert res["success"] is True
    assert res["source_language"] == "mr"
    assert res["source_language_name"] == "Marathi"
    assert "HELP" in res["gloss"] or "WANT" in res["gloss"]
    assert res["sign_count"] > 0

def test_hinglish_code_switching():
    # Test Hinglish sentence: "aapka swagat hai hamare ghar mein"
    hinglish_text = "aapka swagat hai hamare ghar mein"
    res = language_service.process_semantic_pipeline(hinglish_text, source_language="auto")

    assert res["success"] is True
    assert res["code_switching_detected"] is True
    assert "Welcome" in res["english_translation"] or "HOME" in res["gloss_text"]
    assert res["sign_count"] > 0

def test_evaluate_each_language_separately():
    report = language_service.evaluate_all_supported_languages()
    assert report["total_evaluated"] >= 16
    assert report["failed"] == 0
    assert report["passed"] == report["total_evaluated"]

    # Verify each language produced valid English translation & signs
    for eval_item in report["evaluations"]:
        assert eval_item["status"] == "PASSED"
        assert eval_item["language_preserved"] is True
        assert len(eval_item["english_translation"]) > 0
        assert eval_item["signs_generated"] > 0
