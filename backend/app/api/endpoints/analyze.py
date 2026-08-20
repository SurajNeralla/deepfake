import os
from datetime import datetime
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.schemas.analysis import AnalysisResponse, ExplanationItem
from backend.app.utils.security import validate_and_save_upload
from backend.app.services.forensic_service import run_media_analysis
from backend.app.models.analysis import AnalysisModel
from backend.app.preprocessing.gradcam import generate_saliency_heatmap
from backend.app.preprocessing.metadata_inspector import extract_metadata
from backend.app.services.chain_of_custody import generate_chain_of_custody_record

router = APIRouter()

def format_analysis_response(analysis: AnalysisModel) -> AnalysisResponse:
    metrics_map = {m.metric_name: round(m.score, 4) for m in analysis.metrics}
    
    explanations = [
        ExplanationItem(
            reason=e.reason,
            severity=e.severity,
            timestamp=e.timestamp,
            region=e.region_json
        ) for e in analysis.events
    ]

    created_str = analysis.created_at.strftime("%Y-%m-%d %H:%M:%S UTC") if isinstance(analysis.created_at, datetime) else str(analysis.created_at)

    return AnalysisResponse(
        analysis_id=analysis.id,
        filename=analysis.filename,
        original_filename=analysis.original_filename,
        media_type=analysis.media_type,
        classification=analysis.classification,
        confidence=round(analysis.confidence, 4),
        is_demo_fallback=analysis.is_demo_fallback,
        model_name=analysis.model_name,
        model_version=analysis.model_version,
        metrics=metrics_map,
        explanations=explanations,
        status=analysis.status,
        created_at=created_str,
        file_size=analysis.file_size,
        mime_type=analysis.mime_type
    )

@router.post("/analyze/image", response_model=AnalysisResponse)
async def analyze_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    file_id, safe_path, orig_name, size, mime = await validate_and_save_upload(file, "image")
    analysis = run_media_analysis(db, file_id, safe_path, orig_name, "image", size, mime)
    return format_analysis_response(analysis)

@router.post("/analyze/video", response_model=AnalysisResponse)
async def analyze_video(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    file_id, safe_path, orig_name, size, mime = await validate_and_save_upload(file, "video")
    analysis = run_media_analysis(db, file_id, safe_path, orig_name, "video", size, mime)
    return format_analysis_response(analysis)

@router.post("/analyze/audio", response_model=AnalysisResponse)
async def analyze_audio(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    file_id, safe_path, orig_name, size, mime = await validate_and_save_upload(file, "audio")
    analysis = run_media_analysis(db, file_id, safe_path, orig_name, "audio", size, mime)
    return format_analysis_response(analysis)

@router.post("/analyze/batch", response_model=List[AnalysisResponse])
async def analyze_batch(
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db)
):
    results = []
    for file in files:
        content_type = file.content_type or ""
        filename_lower = (file.filename or "").lower()
        if content_type.startswith("image/") or any(filename_lower.endswith(ext) for ext in [".jpg", ".jpeg", ".png", ".webp"]):
            mtype = "image"
        elif content_type.startswith("video/") or any(filename_lower.endswith(ext) for ext in [".mp4", ".mov", ".avi", ".webm"]):
            mtype = "video"
        elif content_type.startswith("audio/") or any(filename_lower.endswith(ext) for ext in [".mp3", ".wav", ".m4a"]):
            mtype = "audio"
        else:
            mtype = "image"

        file_id, safe_path, orig_name, size, mime = await validate_and_save_upload(file, mtype)
        analysis = run_media_analysis(db, file_id, safe_path, orig_name, mtype, size, mime)
        results.append(format_analysis_response(analysis))
    return results

@router.get("/analysis/{id}", response_model=AnalysisResponse)
def get_analysis_by_id(
    id: str,
    db: Session = Depends(get_db)
):
    analysis = db.query(AnalysisModel).filter(AnalysisModel.id == id).first()
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Analysis with ID '{id}' not found."
        )
    return format_analysis_response(analysis)

@router.get("/analysis/{id}/gradcam")
def get_gradcam_heatmap(
    id: str,
    db: Session = Depends(get_db)
):
    analysis = db.query(AnalysisModel).filter(AnalysisModel.id == id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    file_path = os.path.join("uploads", analysis.filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Original upload file missing on disk")
        
    focus_regions = [e.region_json for e in analysis.events if e.region_json]
    data_url, hot_spots = generate_saliency_heatmap(file_path, focus_regions)
    return {"analysis_id": id, "gradcam_data_url": data_url, "hot_spots": hot_spots}

@router.get("/analysis/{id}/metadata")
def get_analysis_metadata(
    id: str,
    db: Session = Depends(get_db)
):
    analysis = db.query(AnalysisModel).filter(AnalysisModel.id == id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
        
    file_path = os.path.join("uploads", analysis.filename)
    metadata = extract_metadata(file_path)
    return {"analysis_id": id, "metadata": metadata}

@router.get("/analysis/{id}/custody")
def get_chain_of_custody(
    id: str,
    db: Session = Depends(get_db)
):
    """Retrieve SHA-256 digital Chain of Custody audit record."""
    analysis = db.query(AnalysisModel).filter(AnalysisModel.id == id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis record not found")
        
    file_path = os.path.join("uploads", analysis.filename)
    custody_data = generate_chain_of_custody_record(
        analysis_id=analysis.id,
        file_path=file_path,
        original_filename=analysis.original_filename,
        media_type=analysis.media_type,
        file_size=analysis.file_size,
        classification=analysis.classification,
        confidence=analysis.confidence
    )
    return custody_data
