from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field
from datetime import datetime

class ExplanationItem(BaseModel):
    reason: str
    severity: str = Field(default="medium", description="low, medium, high, critical")
    timestamp: Optional[float] = Field(default=None, description="Video/Audio timestamp offset in seconds")
    region: Optional[Dict[str, Any]] = Field(default=None, description="Visual region coordinates (x, y, w, h)")

class AnalysisResponse(BaseModel):
    analysis_id: str
    filename: str
    original_filename: str
    media_type: str
    classification: str # REAL, LIKELY REAL, SUSPICIOUS, LIKELY FAKE
    confidence: float
    is_demo_fallback: bool = True
    model_name: str
    model_version: str
    metrics: Dict[str, float]
    explanations: List[ExplanationItem]
    status: str
    created_at: str
    file_size: int
    mime_type: str

class AnalysisSummaryItem(BaseModel):
    id: str
    original_filename: str
    media_type: str
    classification: str
    confidence: float
    is_demo_fallback: bool
    status: str
    created_at: str

class HistoryResponse(BaseModel):
    total: int
    items: List[AnalysisSummaryItem]

class HealthResponse(BaseModel):
    status: str
    version: str
    model_engine: str
    gpu_available: bool
    storage_ok: bool
