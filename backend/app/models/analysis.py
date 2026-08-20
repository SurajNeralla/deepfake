import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class AnalysisModel(Base):
    __tablename__ = "analyses"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    filename = Column(String(255), nullable=False)
    original_filename = Column(String(255), nullable=False)
    media_type = Column(String(50), nullable=False)  # image, video, audio
    file_size = Column(Integer, nullable=False)
    mime_type = Column(String(100), nullable=False)
    
    classification = Column(String(50), nullable=False, default="SUSPICIOUS") # REAL, LIKELY REAL, SUSPICIOUS, LIKELY FAKE
    confidence = Column(Float, nullable=False, default=0.50)
    is_demo_fallback = Column(Boolean, default=True)
    
    model_name = Column(String(100), default="DeepGuard-Ensemble-v2.4")
    model_version = Column(String(50), default="2.4.0")
    status = Column(String(50), default="completed") # pending, processing, completed, failed
    
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    metrics = relationship("MetricModel", back_populates="analysis", cascade="all, delete-orphan")
    events = relationship("EventModel", back_populates="analysis", cascade="all, delete-orphan")
    report = relationship("ReportModel", back_populates="analysis", uselist=False, cascade="all, delete-orphan")


class MetricModel(Base):
    __tablename__ = "analysis_metrics"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    analysis_id = Column(String(36), ForeignKey("analyses.id"), nullable=False)
    metric_name = Column(String(100), nullable=False)
    score = Column(Float, nullable=False)

    analysis = relationship("AnalysisModel", back_populates="metrics")


class EventModel(Base):
    __tablename__ = "analysis_events"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    analysis_id = Column(String(36), ForeignKey("analyses.id"), nullable=False)
    reason = Column(Text, nullable=False)
    severity = Column(String(20), default="medium") # low, medium, high, critical
    timestamp = Column(Float, nullable=True) # video/audio seconds offset if applicable
    region_json = Column(JSON, nullable=True) # visual region coordinates if applicable

    analysis = relationship("AnalysisModel", back_populates="events")


class ReportModel(Base):
    __tablename__ = "reports"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    analysis_id = Column(String(36), ForeignKey("analyses.id"), nullable=False)
    pdf_path = Column(String(255), nullable=True)
    generated_at = Column(DateTime, default=datetime.utcnow)

    analysis = relationship("AnalysisModel", back_populates="report")
