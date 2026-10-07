"""
Bharat Sign AI 3 - Research Evaluation Engine & Failure Taxonomy Logging
Calculates WER, CER, Semantic Adequacy F1, True Stage Latency Breakdown,
and compares Baseline Pipeline (Direct Word/Sign) vs Proposed Pipeline (NLP/ISL Grammar).
STRICT RULE: NEVER FABRICATE UNMEASURED NUMBERS. Mark unmeasured items as 'Not evaluated yet'.
"""

import time
import math
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone

def compute_wer(reference: str, hypothesis: str) -> Dict[str, Any]:
    """
    Computes Word Error Rate (WER) using Levenshtein distance:
    WER = (Substitutions + Deletions + Insertions) / Number of Reference Words
    """
    ref_words = reference.strip().lower().split()
    hyp_words = hypothesis.strip().lower().split()

    if not ref_words:
        return {
            "wer": 0.0 if not hyp_words else 1.0,
            "substitutions": 0,
            "deletions": 0,
            "insertions": len(hyp_words),
            "ref_length": 0,
            "evaluated": True
        }

    # Levenshtein distance matrix
    d = [[0] * (len(hyp_words) + 1) for _ in range(len(ref_words) + 1)]
    for i in range(len(ref_words) + 1):
        d[i][0] = i
    for j in range(len(hyp_words) + 1):
        d[0][j] = j

    for i in range(1, len(ref_words) + 1):
        for j in range(1, len(hyp_words) + 1):
            if ref_words[i - 1] == hyp_words[j - 1]:
                d[i][j] = d[i - 1][j - 1]
            else:
                sub = d[i - 1][j - 1] + 1
                ins = d[i][j - 1] + 1
                delete = d[i - 1][j] + 1
                d[i][j] = min(sub, ins, delete)

    distance = d[len(ref_words)][len(hyp_words)]
    wer_val = round(distance / len(ref_words), 4)

    return {
        "wer": wer_val,
        "wer_percent": f"{round(wer_val * 100, 2)}%",
        "substitutions": min(distance, abs(len(ref_words) - len(hyp_words))),
        "deletions": max(0, len(ref_words) - len(hyp_words)),
        "insertions": max(0, len(hyp_words) - len(ref_words)),
        "ref_length": len(ref_words),
        "hyp_length": len(hyp_words),
        "evaluated": True
    }

def compute_cer(reference: str, hypothesis: str) -> Dict[str, Any]:
    """
    Computes Character Error Rate (CER).
    """
    ref_chars = list(reference.strip().lower().replace(" ", ""))
    hyp_chars = list(hypothesis.strip().lower().replace(" ", ""))

    if not ref_chars:
        return {"cer": 0.0, "cer_percent": "0.0%", "evaluated": True}

    d = [[0] * (len(hyp_chars) + 1) for _ in range(len(ref_chars) + 1)]
    for i in range(len(ref_chars) + 1):
        d[i][0] = i
    for j in range(len(hyp_chars) + 1):
        d[0][j] = j

    for i in range(1, len(ref_chars) + 1):
        for j in range(1, len(hyp_chars) + 1):
            if ref_chars[i - 1] == hyp_chars[j - 1]:
                d[i][j] = d[i - 1][j - 1]
            else:
                d[i][j] = min(d[i - 1][j - 1] + 1, d[i][j - 1] + 1, d[i - 1][j] + 1)

    dist = d[len(ref_chars)][len(hyp_chars)]
    cer_val = round(dist / len(ref_chars), 4)
    return {
        "cer": cer_val,
        "cer_percent": f"{round(cer_val * 100, 2)}%",
        "evaluated": True
    }

class FailureLogger:
    def __init__(self):
        self.logs: List[Dict[str, Any]] = []

    def log_failure(
        self,
        stage: str,
        category: str,
        error_message: str,
        possible_cause: str,
        recovery_action: str,
        session_id: str = "anon-session"
    ) -> Dict[str, Any]:
        entry = {
            "id": f"err-{len(self.logs) + 101}",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "sessionId": session_id,
            "stage": stage,
            "category": category, # ASR_FAILURE, NLP_FAILURE, MAPPING_FAILURE, UNKNOWN_SIGN, LOW_CONFIDENCE, etc.
            "errorMessage": error_message,
            "possibleCause": possible_cause,
            "recoveryAction": recovery_action,
            "status": "Recorded"
        }
        self.logs.append(entry)
        return entry

failure_logger = FailureLogger()
