"""
Bharat Sign AI — Expanded ISL Recognition & Landmark Training Router
Provides REST APIs for:
1. 80-Sign Curriculum & Category Catalog with live validation status tracking
2. Real MediaPipe landmark recording, storage, review, and deletion
3. Session-aware Model Training Engine with Precision, Recall, F1, and Confusion Matrix
4. Live Sequence Prediction with confidence calibration and "Unknown sign" handling
"""

from typing import List, Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

from app.ai.isl_dataset_service import isl_dataset_service
from app.ai.isl_curriculum_80 import ISL_CATEGORIES_LIST

router = APIRouter(prefix="/sign", tags=["Expanded 80-Sign ISL Learning & Dataset Engine"])

class LandmarkPoint(BaseModel):
    x: float
    y: float
    z: Optional[float] = 0.0

class LandmarkFrame(BaseModel):
    timestamp_ms: Optional[float] = 0.0
    hands: List[List[Dict[str, Any]]] # each hand is 21 dicts

class RecordSampleRequest(BaseModel):
    sign_label: str
    session_id: Optional[str] = "session_user_01"
    duration_ms: Optional[float] = 1000.0
    num_hands: Optional[int] = 1
    handedness: Optional[List[str]] = ["Right"]
    frames: List[Dict[str, Any]]
    is_verified: Optional[bool] = True

class LiveSequencePredictRequest(BaseModel):
    frames: List[Dict[str, Any]]
    target_language: Optional[str] = "en"

@router.get("/curriculum")
def get_curriculum():
    """
    Returns the comprehensive 80-Sign Indian Sign Language curriculum
    with real-time validation status (Not recorded, Samples collected, Ready for training, Trained, Passed independent testing).
    """
    signs = isl_dataset_service.get_curriculum_catalog()
    return {
        "success": True,
        "total_signs": len(signs),
        "categories": ISL_CATEGORIES_LIST,
        "signs": signs,
    }

@router.get("/categories")
def get_categories():
    """Returns the 6 ISL curriculum categories."""
    return {
        "success": True,
        "categories": ISL_CATEGORIES_LIST,
    }

@router.post("/record-sample")
def record_sample(request: RecordSampleRequest):
    """
    Stores an authentic recorded sequence of MediaPipe hand landmarks.
    Requires confirmed sign label.
    """
    try:
        res = isl_dataset_service.save_sample_recording(
            sign_label=request.sign_label,
            session_id=request.session_id or "session_default",
            frames=request.frames,
            duration_ms=request.duration_ms or 1000.0,
            num_hands=request.num_hands or 1,
            handedness=request.handedness or ["Right"],
            is_verified=request.is_verified if request.is_verified is not None else True,
        )
        return res
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save sample: {str(e)}")

@router.get("/samples/{sign_label}")
def list_samples(sign_label: str):
    """Lists all authentic landmark recordings collected for a given sign label."""
    samples = isl_dataset_service.list_samples_for_sign(sign_label)
    return {
        "success": True,
        "sign_label": sign_label.upper(),
        "sample_count": len(samples),
        "samples": samples,
    }

@router.delete("/sample/{sign_label}/{sample_id}")
def delete_sample(sign_label: str, sample_id: str):
    """Deletes a recorded landmark sample."""
    deleted = isl_dataset_service.delete_sample(sign_label, sample_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Sample not found.")
    return {
        "success": True,
        "message": f"Successfully deleted sample '{sample_id}' for '{sign_label}'.",
    }

@router.post("/train-expanded-model")
def train_expanded_model():
    """
    Executes model training on real collected landmark samples across all signs.
    Performs stratified session split to prevent data leakage.
    Returns per-class Precision, Recall, F1 score, and Confusion Matrix.
    """
    result = isl_dataset_service.train_model_on_collected_data()
    return result

@router.get("/model-evaluation-report")
def get_evaluation_report():
    """Returns the latest model training evaluation report and metrics."""
    report = isl_dataset_service.latest_evaluation_report
    if not report:
        return {
            "success": True,
            "has_report": False,
            "message": "No model training has been executed yet on custom recorded samples."
        }
    return {
        "success": True,
        "has_report": True,
        "report": report
    }

@router.post("/predict-live-sequence")
def predict_live_sequence(request: LiveSequencePredictRequest):
    """
    Infers sign from a live sequence of MediaPipe frames using identical preprocessing.
    Returns predicted sign or 'Unknown sign' for uncertain gestures.
    """
    pred = isl_dataset_service.predict_from_live_sequence(request.frames)
    return {
        "success": True,
        **pred
    }
