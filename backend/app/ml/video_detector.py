import numpy as np
from typing import Dict, Any, List
from backend.app.ml.base_detector import BaseDetector
from backend.app.preprocessing.video_processor import (
    extract_video_metadata,
    sample_video_frames,
    cleanup_sampled_frames
)
from backend.app.preprocessing.image_processor import perform_ela, analyze_fft_spectrum, detect_faces

class VideoDetector(BaseDetector):
    @property
    def detector_name(self) -> str:
        return "video_detector"

    def predict(self, media_path: str) -> Dict[str, Any]:
        metadata = extract_video_metadata(media_path)
        sample_fps = self.config.get("video_forensics", {}).get("default_fps_sample", 2.0)
        max_frames = self.config.get("video_forensics", {}).get("max_sampled_frames", 60)

        sampled_frames = sample_video_frames(media_path, sample_fps=sample_fps, max_frames=max_frames)

        frame_scores = []
        suspicious_timestamps = []
        ela_scores = []
        fft_scores = []
        face_counts = []

        for frame in sampled_frames:
            p = frame["temp_path"]
            ts = frame["timestamp"]

            ela, _ = perform_ela(p)
            fft = analyze_fft_spectrum(p)
            faces = detect_faces(p)

            frame_artifact = (ela * 0.5) + (fft * 0.5)
            frame_scores.append({
                "timestamp": ts,
                "frame_idx": frame["frame_idx"],
                "score": round(float(frame_artifact), 4)
            })

            ela_scores.append(ela)
            fft_scores.append(fft)
            face_counts.append(len(faces))

            if frame_artifact > 0.55:
                suspicious_timestamps.append(ts)

        # Cleanup extracted frames from disk
        cleanup_sampled_frames(sampled_frames, media_path)

        # Temporal consistency computation (inter-frame variance of scores)
        if len(ela_scores) > 1:
            temporal_variance = float(np.std(ela_scores)) + float(np.std(fft_scores))
            temporal_consistency = max(0.1, min(1.0, 1.0 - (temporal_variance * 2.0)))
        else:
            temporal_consistency = 0.85

        mean_ela = float(np.mean(ela_scores)) if ela_scores else 0.4
        mean_fft = float(np.mean(fft_scores)) if fft_scores else 0.4
        artifact_score = (mean_ela * 0.5) + (mean_fft * 0.5)
        visual_consistency = max(0.1, min(1.0, 1.0 - artifact_score))
        metadata_score = 0.90 if metadata.get("duration", 0) > 0 else 0.40

        # Aggregated confidence
        raw_confidence = (artifact_score * 0.5) + ((1.0 - temporal_consistency) * 0.5)

        # Classification mapping
        if raw_confidence < 0.30:
            classification = "REAL"
        elif raw_confidence < 0.55:
            classification = "LIKELY REAL"
        elif raw_confidence < 0.78:
            classification = "SUSPICIOUS"
        else:
            classification = "LIKELY FAKE"

        # Explanations with timestamps
        explanations = []

        if self.is_demo_fallback:
            explanations.append({
                "reason": "Model weights omitted — video pipeline executed using multi-frame forensic sampling.",
                "severity": "low",
                "timestamp": None,
                "region": None
            })

        if suspicious_timestamps:
            first_ts = suspicious_timestamps[0]
            explanations.append({
                "reason": f"Detected frame manipulation anomalies at {len(suspicious_timestamps)} timestamp(s), starting at {first_ts}s",
                "severity": "high" if len(suspicious_timestamps) > 3 else "medium",
                "timestamp": first_ts,
                "region": None
            })

        if temporal_consistency < 0.60:
            explanations.append({
                "reason": f"High temporal frame-to-frame flicker and noise variance observed across sequence.",
                "severity": "high",
                "timestamp": round(metadata.get("duration", 0) / 2.0, 2),
                "region": None
            })

        return {
            "classification": classification,
            "confidence": round(float(raw_confidence), 4),
            "is_demo_fallback": self.is_demo_fallback,
            "video_metadata": {
                "duration": metadata.get("duration", 0.0),
                "fps": metadata.get("fps", 0.0),
                "total_frames": metadata.get("total_frames", 0),
                "analyzed_frames": len(sampled_frames),
                "suspicious_timestamps": suspicious_timestamps
            },
            "frame_scores": frame_scores,
            "metrics": {
                "visual_consistency": round(float(visual_consistency), 4),
                "artifact_score": round(float(artifact_score), 4),
                "temporal_consistency": round(float(temporal_consistency), 4),
                "metadata_score": round(float(metadata_score), 4)
            },
            "explanations": explanations
        }
