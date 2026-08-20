import os
from fastapi import APIRouter
from backend.app.schemas.analysis import HealthResponse
from backend.app.core.config import settings

try:
    import torch
    TORCH_AVAILABLE = True
    GPU_AVAILABLE = torch.cuda.is_available()
except ImportError:
    TORCH_AVAILABLE = False
    GPU_AVAILABLE = False

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
def health_check():
    storage_ok = os.path.exists(settings.UPLOAD_DIR) and os.path.exists(settings.REPORT_DIR)
    
    return HealthResponse(
        status="healthy",
        version="2.4.0",
        model_engine="DeepGuard-Ensemble-v2.4",
        gpu_available=GPU_AVAILABLE,
        storage_ok=storage_ok
    )
