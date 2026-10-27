"""
Video Training, Labeling & 3D Avatar Sync Router
Provides REST APIs for:
1. Video upload, processing & landmark extraction
2. Label & metadata management (Hindi, English, ISL category)
3. Background training job dispatching, progress tracking, and log streaming
4. Model version history, activation, and rollback
5. Custom Avatar Kinematics retrieval for direct 3D animation playback
"""

import os
import uuid
import json
import shutil
import datetime
from pathlib import Path
from typing import List, Optional, Dict, Any

from fastapi import APIRouter, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from pydantic import BaseModel

from app.database import (
    get_db,
    VIDEOS_DIR,
    PREVIEWS_DIR,
    LANDMARKS_DIR,
    MODELS_DIR,
)
from app.ai.video_processor_pipeline import video_pipeline
from app.ai.training_engine import training_engine
from app.ai.include.engine import include_sign_engine

router = APIRouter(prefix="/training", tags=["Automatic Video Learning & Model Training"])


class LabelUpdateRequest(BaseModel):
    video_id: str
    label: str
    english_meaning: Optional[str] = None
    hindi_meaning: Optional[str] = None
    category: Optional[str] = "general"
    sentence: Optional[str] = None
    is_verified: Optional[bool] = True


class BatchLabelUpdateRequest(BaseModel):
    items: List[LabelUpdateRequest]


class StartTrainingRequest(BaseModel):
    name: Optional[str] = "ISL Incremental Model Training"
    epochs: Optional[int] = 10
    batch_size: Optional[int] = 16
    learning_rate: Optional[float] = 0.001
    architecture: Optional[str] = "lstm"


def process_video_background_task(video_id: str, video_path: str, label: Optional[str]):
    """Background task to extract landmarks and compute avatar kinematics."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("UPDATE videos SET status = 'extracting_landmarks' WHERE id = ?", (video_id,))
    conn.commit()
    conn.close()

    result = video_pipeline.process_video(video_id, video_path)

    conn = get_db()
    cursor = conn.cursor()
    now = datetime.datetime.utcnow().isoformat()

    if result.get("success"):
        cursor.execute(
            """
            UPDATE videos SET
                status = 'processed',
                preview_filepath = ?,
                landmarks_filepath = ?,
                kinematics_filepath = ?,
                duration = ?,
                fps = ?,
                width = ?,
                height = ?,
                total_frames = ?,
                processed_frames = ?,
                hand1_detection_pct = ?,
                hand2_detection_pct = ?,
                pose_detection_pct = ?,
                updated_at = ?
            WHERE id = ?
            """,
            (
                result["preview_filepath"],
                result["landmarks_filepath"],
                result["kinematics_filepath"],
                result["duration"],
                result["fps"],
                result["width"],
                result["height"],
                result["total_frames"],
                result["processed_frames"],
                result["hand1_detection_pct"],
                result["hand2_detection_pct"],
                result["pose_detection_pct"],
                now,
                video_id,
            ),
        )

        # Register kinematics in sign_kinematics table if label is assigned
        if label:
            norm_key = label.strip().lower().replace(" ", "").replace("_", "")
            with open(result["kinematics_filepath"], "r", encoding="utf-8") as f:
                kin_data = f.read()

            cursor.execute(
                """
                INSERT OR REPLACE INTO sign_kinematics (sign_key, video_id, label, duration, kinematic_data_json, updated_at)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (norm_key, video_id, label, result["duration"], kin_data, now),
            )

    else:
        cursor.execute(
            "UPDATE videos SET status = 'failed', error_message = ?, updated_at = ? WHERE id = ?",
            (result.get("error", "Processing failed"), now, video_id),
        )

    conn.commit()
    conn.close()


@router.post("/upload")
async def upload_videos(
    background_tasks: BackgroundTasks,
    files: List[UploadFile] = File(...),
    label: Optional[str] = Form(None),
    english_meaning: Optional[str] = Form(None),
    hindi_meaning: Optional[str] = Form(None),
    category: Optional[str] = Form("general"),
):
    """
    Upload one or multiple sign language videos for landmark extraction & training.
    """
    uploaded_records = []
    now = datetime.datetime.utcnow().isoformat()

    conn = get_db()
    cursor = conn.cursor()

    for file in files:
        video_id = f"vid_{uuid.uuid4().hex[:10]}"
        ext = Path(file.filename).suffix or ".mp4"
        save_filename = f"{video_id}_{file.filename}"
        dest_path = VIDEOS_DIR / save_filename

        with open(dest_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        file_size = os.path.getsize(dest_path)

        cursor.execute(
            """
            INSERT INTO videos (
                id, filename, filepath, file_size, label, english_meaning,
                hindi_meaning, category, status, is_verified, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'uploaded', 0, ?, ?)
            """,
            (
                video_id,
                file.filename,
                str(dest_path),
                file_size,
                label,
                english_meaning or label,
                hindi_meaning or label,
                category,
                now,
                now,
            ),
        )

        background_tasks.add_task(process_video_background_task, video_id, str(dest_path), label)

        uploaded_records.append(
            {
                "id": video_id,
                "filename": file.filename,
                "file_size": file_size,
                "label": label,
                "status": "uploaded",
            }
        )

    conn.commit()
    conn.close()

    return {
        "success": True,
        "count": len(uploaded_records),
        "videos": uploaded_records,
        "message": f"Successfully queued {len(uploaded_records)} video(s) for feature extraction and avatar sync.",
    }


@router.get("/videos")
def list_videos(limit: int = 100, status: Optional[str] = None):
    """Retrieves all uploaded videos with processing telemetry and labeling status."""
    conn = get_db()
    cursor = conn.cursor()

    if status:
        cursor.execute("SELECT * FROM videos WHERE status = ? ORDER BY created_at DESC LIMIT ?", (status, limit))
    else:
        cursor.execute("SELECT * FROM videos ORDER BY created_at DESC LIMIT ?", (limit,))

    rows = cursor.fetchall()
    videos = [dict(row) for row in rows]
    conn.close()

    return {"success": True, "count": len(videos), "videos": videos}


@router.get("/video/{video_id}")
def get_video_detail(video_id: str):
    """Retrieves single video telemetry and kinematics details."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM videos WHERE id = ?", (video_id,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="Video not found")

    v = dict(row)
    # Include parsed kinematics if available
    kinematics_data = None
    if v.get("kinematics_filepath") and os.path.exists(v["kinematics_filepath"]):
        try:
            with open(v["kinematics_filepath"], "r", encoding="utf-8") as f:
                kinematics_data = json.load(f)
        except Exception:
            pass

    v["kinematics"] = kinematics_data
    return {"success": True, "video": v}


@router.get("/video/{video_id}/stream")
def stream_video_file(video_id: str):
    """Serves the original uploaded video file."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT filepath FROM videos WHERE id = ?", (video_id,))
    row = cursor.fetchone()
    conn.close()

    if not row or not os.path.exists(row["filepath"]):
        raise HTTPException(status_code=404, detail="Video file not found")

    return FileResponse(row["filepath"], media_type="video/mp4")


@router.get("/video/{video_id}/preview")
def stream_preview_file(video_id: str):
    """Serves the landmark overlay preview video."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT preview_filepath FROM videos WHERE id = ?", (video_id,))
    row = cursor.fetchone()
    conn.close()

    if not row or not row["preview_filepath"] or not os.path.exists(row["preview_filepath"]):
        raise HTTPException(status_code=404, detail="Preview file not found or still processing")

    return FileResponse(row["preview_filepath"], media_type="video/mp4")


@router.put("/video/label")
def update_video_label(req: LabelUpdateRequest):
    """Updates sign label, translations, and marks as verified."""
    conn = get_db()
    cursor = conn.cursor()
    now = datetime.datetime.utcnow().isoformat()

    cursor.execute(
        """
        UPDATE videos SET
            label = ?,
            english_meaning = ?,
            hindi_meaning = ?,
            category = ?,
            sentence = ?,
            is_verified = ?,
            updated_at = ?
        WHERE id = ?
        """,
        (
            req.label.strip(),
            req.english_meaning or req.label,
            req.hindi_meaning or req.label,
            req.category or "general",
            req.sentence,
            1 if req.is_verified else 0,
            now,
            req.video_id,
        ),
    )

    # If kinematics file exists, register into sign_kinematics table
    cursor.execute("SELECT kinematics_filepath, duration FROM videos WHERE id = ?", (req.video_id,))
    row = cursor.fetchone()
    if row and row["kinematics_filepath"] and os.path.exists(row["kinematics_filepath"]):
        norm_key = req.label.strip().lower().replace(" ", "").replace("_", "")
        with open(row["kinematics_filepath"], "r", encoding="utf-8") as f:
            kin_data = f.read()

        cursor.execute(
            """
            INSERT OR REPLACE INTO sign_kinematics (sign_key, video_id, label, duration, kinematic_data_json, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (norm_key, req.video_id, req.label, row["duration"], kin_data, now),
        )

    conn.commit()
    conn.close()

    return {"success": True, "message": f"Successfully updated label to '{req.label}'."}


@router.put("/videos/batch-labels")
def batch_update_labels(req: BatchLabelUpdateRequest):
    """Batch updates multiple video labels at once."""
    for item in req.items:
        update_video_label(item)
    return {"success": True, "updated_count": len(req.items)}


@router.post("/train/start")
def start_model_training(req: StartTrainingRequest):
    """Starts an asynchronous neural model training job."""
    job_id = f"job_{uuid.uuid4().hex[:10]}"
    res = training_engine.start_training_job(
        job_id=job_id,
        name=req.name or "ISL Incremental Model Training",
        epochs=req.epochs or 10,
        batch_size=req.batch_size or 16,
        learning_rate=req.learning_rate or 0.001,
        architecture=req.architecture or "lstm",
    )
    return res


@router.get("/jobs")
def list_training_jobs(limit: int = 50):
    """Lists training jobs with progress and status."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM training_jobs ORDER BY created_at DESC LIMIT ?", (limit,))
    rows = cursor.fetchall()
    jobs = []
    for row in rows:
        j = dict(row)
        if j.get("dataset_split"):
            try:
                j["dataset_split"] = json.loads(j["dataset_split"])
            except Exception:
                pass
        if j.get("metrics"):
            try:
                j["metrics"] = json.loads(j["metrics"])
            except Exception:
                pass
        jobs.append(j)
    conn.close()

    return {"success": True, "count": len(jobs), "jobs": jobs}


@router.get("/job/{job_id}")
def get_job_status(job_id: str):
    """Gets real-time training progress, log output, and validation accuracy."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM training_jobs WHERE id = ?", (job_id,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="Job not found")

    j = dict(row)
    if j.get("dataset_split"):
        try:
            j["dataset_split"] = json.loads(j["dataset_split"])
        except Exception:
            pass
    if j.get("metrics"):
        try:
            j["metrics"] = json.loads(j["metrics"])
        except Exception:
            pass

    return {"success": True, "job": j}


@router.get("/models")
def list_registered_models():
    """Returns all registered and versioned models."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM registered_models ORDER BY created_at DESC")
    rows = cursor.fetchall()
    models = []
    for row in rows:
        m = dict(row)
        if m.get("classes_json"):
            try:
                m["classes"] = json.loads(m["classes_json"])
            except Exception:
                pass
        if m.get("confusion_matrix_json"):
            try:
                m["confusion_matrix"] = json.loads(m["confusion_matrix_json"])
            except Exception:
                pass
        models.append(m)
    conn.close()

    return {"success": True, "count": len(models), "models": models}


@router.get("/kinematics/{sign_key}")
def get_sign_kinematics(sign_key: str):
    """
    Returns the real retargeted 3D Avatar kinematics curves extracted from video.
    Allows 3D Avatar to accurately reproduce learned signs.
    """
    norm_key = sign_key.strip().lower().replace(" ", "").replace("_", "")
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM sign_kinematics WHERE sign_key = ?", (norm_key,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return {"success": False, "found": False, "message": f"No custom kinematics found for '{sign_key}'."}

    k = dict(row)
    data = json.loads(k["kinematic_data_json"])
    return {
        "success": True,
        "found": True,
        "sign_key": norm_key,
        "label": k["label"],
        "duration": k["duration"],
        "kinematics": data,
    }


@router.get("/dataset/summary")
def get_dataset_summary():
    """Returns overview of uploaded videos, processed classes, and ready dataset size."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) as total FROM videos")
    total_videos = cursor.fetchone()["total"]

    cursor.execute("SELECT COUNT(*) as processed FROM videos WHERE status = 'processed'")
    processed_videos = cursor.fetchone()["processed"]

    cursor.execute("SELECT COUNT(DISTINCT label) as class_count FROM videos WHERE status = 'processed' AND label IS NOT NULL")
    labeled_classes = cursor.fetchone()["class_count"]

    cursor.execute(
        "SELECT label, COUNT(*) as count FROM videos WHERE status = 'processed' AND label IS NOT NULL GROUP BY label"
    )
    class_dist = {row["label"]: row["count"] for row in cursor.fetchall()}

    conn.close()

    return {
        "success": True,
        "total_videos": total_videos,
        "processed_videos": processed_videos,
        "labeled_classes_count": labeled_classes,
        "class_distribution": class_dist,
        "ready_for_training": processed_videos >= 1,
    }
