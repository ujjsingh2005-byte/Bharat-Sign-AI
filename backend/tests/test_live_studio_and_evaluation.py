"""
Automated Unit Tests for Bharat Sign AI 3 - Task 5 Live Two-Way Communication Studio & Research Evaluation Engine.
Tests:
1. Bidirectional Speech <-> ISL Avatar <-> Camera Sign-to-Voice workflow.
2. Word Error Rate (WER) and Character Error Rate (CER) computation.
3. Research evaluation metrics and failure taxonomy logging.
"""

import pytest
from app.ai.language_service import language_service
from app.ai.sign_recognition_engine import sign_recognition_engine, LandmarkPoint
from app.ai.evaluation_engine import compute_wer, compute_cer, failure_logger

def test_bidirectional_hearing_to_deaf_flow():
    # Hearing speech/text input in Hindi
    hindi_input = "नमस्ते डॉक्टर कहाँ हैं"
    pipeline_res = language_service.process_semantic_pipeline(hindi_input, source_language="hi")

    assert pipeline_res["success"] is True
    assert pipeline_res["source_language"] == "hi"
    assert "DOCTOR" in pipeline_res["gloss"] or "WHERE" in pipeline_res["gloss"]
    assert len(pipeline_res["signs"]) > 0

def test_bidirectional_deaf_to_hearing_flow():
    # Deaf gesture input (Open Hand HELLO gesture)
    pts = []
    pts.append(LandmarkPoint(0.50, 0.80, 0.0))
    pts.append(LandmarkPoint(0.53, 0.72, 0.0))
    pts.append(LandmarkPoint(0.56, 0.65, 0.0))
    pts.append(LandmarkPoint(0.59, 0.58, 0.0))
    pts.append(LandmarkPoint(0.63, 0.50, 0.0))
    pts.append(LandmarkPoint(0.48, 0.60, 0.0))
    pts.append(LandmarkPoint(0.48, 0.50, 0.0))
    pts.append(LandmarkPoint(0.48, 0.40, 0.0))
    pts.append(LandmarkPoint(0.48, 0.20, 0.0))
    pts.append(LandmarkPoint(0.44, 0.60, 0.0))
    pts.append(LandmarkPoint(0.44, 0.50, 0.0))
    pts.append(LandmarkPoint(0.44, 0.40, 0.0))
    pts.append(LandmarkPoint(0.44, 0.18, 0.0))
    pts.append(LandmarkPoint(0.40, 0.60, 0.0))
    pts.append(LandmarkPoint(0.40, 0.50, 0.0))
    pts.append(LandmarkPoint(0.40, 0.40, 0.0))
    pts.append(LandmarkPoint(0.40, 0.22, 0.0))
    pts.append(LandmarkPoint(0.36, 0.60, 0.0))
    pts.append(LandmarkPoint(0.36, 0.50, 0.0))
    pts.append(LandmarkPoint(0.36, 0.40, 0.0))
    pts.append(LandmarkPoint(0.36, 0.25, 0.0))

    rec_res = sign_recognition_engine.classify_landmarks(pts)
    assert rec_res["detected"] is True
    assert rec_res["sign"] == "HELLO"

def test_wer_and_cer_metrics():
    ref = "Where is the hospital"
    hyp = "Where is hospital"

    wer_res = compute_wer(ref, hyp)
    assert wer_res["evaluated"] is True
    assert 0.0 <= wer_res["wer"] <= 1.0
    assert wer_res["deletions"] >= 1

    cer_res = compute_cer(ref, hyp)
    assert cer_res["evaluated"] is True
    assert 0.0 <= cer_res["cer"] <= 1.0

def test_failure_logger():
    entry = failure_logger.log_failure(
        stage="ASR",
        category="LOW_CONFIDENCE",
        error_message="Background noise ratio high",
        possible_cause="Acoustic echo",
        recovery_action="Prompt user to re-speak"
    )

    assert entry["id"].startswith("err-")
    assert entry["category"] == "LOW_CONFIDENCE"
    assert entry["stage"] == "ASR"
