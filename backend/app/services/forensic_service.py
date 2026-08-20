from datetime import datetime
from sqlalchemy.orm import Session
from backend.app.models.analysis import AnalysisModel, MetricModel, EventModel, ReportModel
from backend.app.ml.image_detector import ImageDetector
from backend.app.ml.video_detector import VideoDetector
from backend.app.ml.audio_detector import AudioDetector

image_detector_inst = ImageDetector()
video_detector_inst = VideoDetector()
audio_detector_inst = AudioDetector()

def run_media_analysis(
    db: Session,
    file_id: str,
    safe_path: str,
    original_filename: str,
    media_type: str,
    file_size: int,
    mime_type: str
) -> AnalysisModel:
    """Run detector pipeline according to media type and persist analysis record to DB."""
    
    # 1. Run ML Detector
    if media_type == "image":
        result = image_detector_inst.predict(safe_path)
    elif media_type == "video":
        result = video_detector_inst.predict(safe_path)
    elif media_type == "audio":
        result = audio_detector_inst.predict(safe_path)
    else:
        raise ValueError(f"Invalid media type '{media_type}'")

    # 2. Instantiate DB Model
    analysis = AnalysisModel(
        id=file_id,
        filename=f"{file_id}.{safe_path.split('.')[-1]}",
        original_filename=original_filename,
        media_type=media_type,
        file_size=file_size,
        mime_type=mime_type,
        classification=result["classification"],
        confidence=result["confidence"],
        is_demo_fallback=result.get("is_demo_fallback", True),
        model_name="DeepGuard-Ensemble-v2.4",
        model_version="2.4.0",
        status="completed",
        created_at=datetime.utcnow(),
        completed_at=datetime.utcnow()
    )

    db.add(analysis)
    db.flush()

    # 3. Add Metric entries
    metrics_dict = result.get("metrics", {})
    for k, v in metrics_dict.items():
        m = MetricModel(
            analysis_id=analysis.id,
            metric_name=k,
            score=float(v)
        )
        db.add(m)

    # 4. Add Event / Explanation entries
    explanations = result.get("explanations", [])
    for exp in explanations:
        ev = EventModel(
            analysis_id=analysis.id,
            reason=exp.get("reason", ""),
            severity=exp.get("severity", "medium"),
            timestamp=exp.get("timestamp"),
            region_json=exp.get("region")
        )
        db.add(ev)

    db.commit()
    db.refresh(analysis)
    return analysis
