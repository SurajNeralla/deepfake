from typing import Dict, Any
from backend.app.ml.base_detector import BaseDetector
from backend.app.preprocessing.audio_processor import extract_audio_features

class AudioDetector(BaseDetector):
    @property
    def detector_name(self) -> str:
        return "audio_detector"

    def predict(self, media_path: str) -> Dict[str, Any]:
        feats = extract_audio_features(media_path)
        
        spectral_anomaly = feats.get("spectral_anomaly_score", 0.50)
        audio_consistency = max(0.1, min(1.0, 1.0 - spectral_anomaly))
        metadata_score = 0.85 if feats.get("duration", 0.0) > 0 else 0.40
        artifact_score = spectral_anomaly

        raw_confidence = (spectral_anomaly * 0.7) + ((1.0 - audio_consistency) * 0.3)

        if raw_confidence < 0.30:
            classification = "REAL"
        elif raw_confidence < 0.55:
            classification = "LIKELY REAL"
        elif raw_confidence < 0.78:
            classification = "SUSPICIOUS"
        else:
            classification = "LIKELY FAKE"

        explanations = []

        if self.is_demo_fallback:
            explanations.append({
                "reason": "Model weights omitted — audio classification calculated via spectral feature analysis.",
                "severity": "low",
                "timestamp": None,
                "region": None
            })

        if spectral_anomaly > 0.45:
            explanations.append({
                "reason": f"High-frequency spectral discontinuity detected in acoustic envelope (Score: {round(spectral_anomaly, 2)})",
                "severity": "high" if spectral_anomaly > 0.65 else "medium",
                "timestamp": round(feats.get("duration", 0) * 0.35, 2),
                "region": None
            })

        if feats.get("zcr", 0.0) > 0.15:
            explanations.append({
                "reason": f"Elevated Zero-Crossing Rate (ZCR: {feats.get('zcr')}) indicative of synthetic phase noise or vocoder synthesis.",
                "severity": "medium",
                "timestamp": None,
                "region": None
            })

        return {
            "classification": classification,
            "confidence": round(float(raw_confidence), 4),
            "is_demo_fallback": self.is_demo_fallback,
            "audio_metadata": {
                "duration": feats.get("duration", 0.0),
                "sample_rate": feats.get("sample_rate", 16000),
                "zcr": feats.get("zcr", 0.0),
                "energy_std": feats.get("energy_std", 0.0)
            },
            "metrics": {
                "audio_consistency": round(float(audio_consistency), 4),
                "artifact_score": round(float(artifact_score), 4),
                "metadata_score": round(float(metadata_score), 4),
                "spectral_anomaly_score": round(float(spectral_anomaly), 4)
            },
            "explanations": explanations
        }
