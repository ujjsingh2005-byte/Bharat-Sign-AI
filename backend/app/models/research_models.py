"""
Bharat Sign AI 3 - MongoDB Schemas & Data Models
Pydantic schemas for database storage (Users, Transcriptions, SemanticRepresentations,
SignSequences, Experiments, Datasets, Evaluations, Errors, AuditLogs).
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone

class UserSchema(BaseModel):
    username: str
    email: str
    role: str = "user" # "user", "researcher", "admin"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TranscriptionRecordSchema(BaseModel):
    user_id: Optional[str] = "anonymous"
    audio_filename: str
    audio_sample_rate: str
    asr_transcript: str
    asr_confidence: float
    low_confidence_warning: bool
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ExperimentRecordSchema(BaseModel):
    experiment_id: str
    name: str
    target_language: str = "Indian Sign Language (ISL)"
    model_version: str
    asr_version: str
    nlp_version: str
    dataset_version: str
    sentences_tested: int
    status: str # "Implemented", "Experimental", "Planned"
    reproducibility_card: Dict[str, Any]
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AuditLogSchema(BaseModel):
    event: str
    user_id: str
    stage: str
    details: Dict[str, Any]
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
