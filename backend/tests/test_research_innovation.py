"""
Automated Unit Tests for Bharat Sign AI 3 Research Innovation Pipeline.
Tests:
1. Expected Calibration Error (ECE) calculation.
2. Brier Score calculation.
3. Confidence calibration & Abstention policy thresholding.
4. Out-of-Vocabulary (OOV) fingerspelling fallback recovery.
"""

import pytest
from app.ai.reliability_engine import reliability_engine
from app.ai.missing_vocab_engine import missing_vocab_engine

def test_ece_calculation():
    confidences = [0.95, 0.88, 0.72, 0.65, 0.40]
    accuracies = [1, 1, 1, 0, 0]
    ece = reliability_engine.compute_ece(confidences, accuracies)
    assert isinstance(ece, float)
    assert 0.0 <= ece <= 1.0

def test_brier_score_calculation():
    confidences = [0.90, 0.80, 0.70]
    targets = [1, 1, 0]
    brier = reliability_engine.compute_brier_score(confidences, targets)
    assert isinstance(brier, float)
    assert 0.0 <= brier <= 1.0

def test_confidence_calibration_abstention():
    # Test low confidence sample (< 0.75 threshold) -> Should abstain
    eval_res = reliability_engine.evaluate_sample("Unclear audio sentence", 0.50, 0.60)
    assert eval_res["shouldAbstain"] is True
    assert eval_res["reliabilityStatus"] == "Unreliable - Abstain & Clarify"

    # Test high confidence sample (>= 0.75 threshold) -> Reliable
    eval_res_high = reliability_engine.evaluate_sample("Good morning doctor", 0.95, 1.0)
    assert eval_res_high["shouldAbstain"] is False
    assert eval_res_high["reliabilityStatus"] == "Reliable"

def test_missing_vocabulary_recovery():
    tokens = ["HELLO", "DOCTOR", "XYZQUANTUMUNSEEN"]
    vocab_res = missing_vocab_engine.recover_missing_vocabulary("Hello doctor xyzquantumunseen", tokens)
    
    assert vocab_res["coverage_ratio"] < 1.0
    assert "XYZQUANTUMUNSEEN" in vocab_res["unsupported_tokens"]
    assert vocab_res["expertReviewFlagged"] is True

    # Check that OOV term XYZQUANTUMUNSEEN received ISL fingerspelling fallback
    oov_item = [seq for seq in vocab_res["recovered_sequence"] if seq["token"] == "XYZQUANTUMUNSEEN"][0]
    assert oov_item["strategy"] == "ISL_FINGERSPELLING_FALLBACK"
    assert len(oov_item["signs"]) == 16 # X-Y-Z-Q-U-A-N-T-U-M-U-N-S-E-E-N
