"""
Automatic ISL Database & Model Schemas
Manages videos, jobs, annotations, model versions, and custom avatar kinematic definitions.
"""

import sqlite3
import json
import datetime
from pathlib import Path
from typing import Dict, Any, List, Optional

DB_DIR = Path(__file__).resolve().parent.parent / "database"
DB_DIR.mkdir(parents=True, exist_ok=True)
DB_PATH = DB_DIR / "bharat_sign_ai.db"

STORAGE_DIR = Path(__file__).resolve().parent.parent / "storage"
VIDEOS_DIR = STORAGE_DIR / "videos"
PREVIEWS_DIR = STORAGE_DIR / "previews"
LANDMARKS_DIR = STORAGE_DIR / "landmarks"
MODELS_DIR = STORAGE_DIR / "models"

for directory in [VIDEOS_DIR, PREVIEWS_DIR, LANDMARKS_DIR, MODELS_DIR]:
    directory.mkdir(parents=True, exist_ok=True)


def get_db():
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Initializes tables for videos, training jobs, models, and custom kinematics."""
    conn = get_db()
    cursor = conn.cursor()

    # Table 1: Uploaded Videos and Landmark Status
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS videos (
        id TEXT PRIMARY KEY,
        filename TEXT NOT NULL,
        filepath TEXT NOT NULL,
        preview_filepath TEXT,
        landmarks_filepath TEXT,
        kinematics_filepath TEXT,
        file_size INTEGER DEFAULT 0,
        duration REAL DEFAULT 0.0,
        fps REAL DEFAULT 0.0,
        width INTEGER DEFAULT 0,
        height INTEGER DEFAULT 0,
        total_frames INTEGER DEFAULT 0,
        processed_frames INTEGER DEFAULT 0,
        hand1_detection_pct REAL DEFAULT 0.0,
        hand2_detection_pct REAL DEFAULT 0.0,
        pose_detection_pct REAL DEFAULT 0.0,
        label TEXT,
        english_meaning TEXT,
        hindi_meaning TEXT,
        category TEXT DEFAULT 'general',
        sentence TEXT,
        source TEXT DEFAULT 'user_upload',
        status TEXT DEFAULT 'uploaded',
        is_verified INTEGER DEFAULT 0,
        error_message TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
    )
    """)

    # Table 2: Training Jobs
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS training_jobs (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        status TEXT DEFAULT 'created',
        progress REAL DEFAULT 0.0,
        current_step TEXT,
        total_videos INTEGER DEFAULT 0,
        classes_count INTEGER DEFAULT 0,
        dataset_split TEXT, -- JSON summary of train/val/test
        metrics TEXT, -- JSON summary of epochs, loss, val_acc
        model_version_id TEXT,
        log_output TEXT,
        error_message TEXT,
        created_at TEXT NOT NULL,
        completed_at TEXT
    )
    """)

    # Table 3: Registered Models
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS registered_models (
        id TEXT PRIMARY KEY,
        version TEXT NOT NULL,
        architecture TEXT NOT NULL,
        weights_path TEXT NOT NULL,
        metadata_path TEXT NOT NULL,
        num_classes INTEGER NOT NULL,
        classes_json TEXT NOT NULL,
        validation_accuracy REAL DEFAULT 0.0,
        test_accuracy REAL DEFAULT 0.0,
        confusion_matrix_json TEXT,
        is_active INTEGER DEFAULT 0,
        created_at TEXT NOT NULL
    )
    """)

    # Table 4: Extracted Custom Sign Kinematics (for Avatar reproduction)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS sign_kinematics (
        sign_key TEXT PRIMARY KEY,
        video_id TEXT,
        label TEXT NOT NULL,
        duration REAL DEFAULT 2.4,
        kinematic_data_json TEXT NOT NULL, -- full time-series joint curves & start/end poses
        updated_at TEXT NOT NULL
    )
    """)

    conn.commit()
    conn.close()


# Auto-initialize database tables on module import
init_db()
