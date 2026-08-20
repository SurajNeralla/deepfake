import os
from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.responses import FileResponse, JSONResponse
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.analysis import AnalysisModel, ReportModel
from backend.app.services.pdf_generator import generate_pdf_report
from backend.app.api.endpoints.analyze import format_analysis_response

router = APIRouter()

@router.get("/report/{id}")
def get_report_details(
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

@router.get("/report/{id}/export")
@router.post("/report/{id}/export")
def export_report(
    id: str,
    format: str = Query("pdf", description="pdf or json"),
    db: Session = Depends(get_db)
):
    analysis = db.query(AnalysisModel).filter(AnalysisModel.id == id).first()
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Analysis with ID '{id}' not found."
        )

    if format.lower() == "json":
        data = format_analysis_response(analysis).model_dump()
        return JSONResponse(
            content=data,
            headers={"Content-Disposition": f"attachment; filename=deepguard_report_{id}.json"}
        )
    elif format.lower() == "pdf":
        pdf_path = generate_pdf_report(analysis)
        if not os.path.exists(pdf_path):
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to generate PDF report."
            )
        
        # Save record in reports table
        rep = db.query(ReportModel).filter(ReportModel.analysis_id == id).first()
        if not rep:
            rep = ReportModel(analysis_id=id, pdf_path=pdf_path)
            db.add(rep)
            db.commit()

        return FileResponse(
            path=pdf_path,
            filename=f"deepguard_report_{id}.pdf",
            media_type="application/pdf"
        )
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported format '{format}'. Use 'pdf' or 'json'."
        )
