from typing import Optional
from datetime import datetime
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.schemas.analysis import HistoryResponse, AnalysisSummaryItem
from backend.app.models.analysis import AnalysisModel

router = APIRouter()

@router.get("/history", response_model=HistoryResponse)
def get_history(
    media_type: Optional[str] = Query(None, description="image, video, audio"),
    classification: Optional[str] = Query(None, description="REAL, LIKELY REAL, SUSPICIOUS, LIKELY FAKE"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    query = db.query(AnalysisModel)
    
    if media_type:
        query = query.filter(AnalysisModel.media_type == media_type.lower())
    if classification:
        query = query.filter(AnalysisModel.classification == classification.upper())

    total = query.count()
    records = query.order_by(AnalysisModel.created_at.desc()).offset(offset).limit(limit).all()

    items = []
    for r in records:
        created_str = r.created_at.strftime("%Y-%m-%d %H:%M:%S UTC") if isinstance(r.created_at, datetime) else str(r.created_at)
        items.append(AnalysisSummaryItem(
            id=r.id,
            original_filename=r.original_filename,
            media_type=r.media_type,
            classification=r.classification,
            confidence=round(r.confidence, 4),
            is_demo_fallback=r.is_demo_fallback,
            status=r.status,
            created_at=created_str
        ))

    return HistoryResponse(total=total, items=items)
