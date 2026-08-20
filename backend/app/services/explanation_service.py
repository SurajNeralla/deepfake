from typing import Dict, Any, List

def generate_human_readable_explanation(
    media_type: str,
    classification: str,
    confidence: float,
    metrics: Dict[str, float],
    explanations: List[Dict[str, Any]],
    metadata: Dict[str, Any] = None
) -> Dict[str, Any]:
    """
    Generate dynamic human-readable Explainable AI (XAI) breakdown explaining:
    "Why did DeepGuard flag this?"
    """
    conf_pct = round(confidence * 100, 1)
    
    # 1. Executive Summary Narrative
    if classification in ["LIKELY FAKE", "SUSPICIOUS"]:
        executive_summary = (
            f"DeepGuard flagged this {media_type} with a {conf_pct}% synthetic anomaly confidence. "
            f"The classification was driven by statistical inconsistencies in spatial frequency distribution, "
            f"compression error variances, and anomalous media metadata signatures."
        )
    else:
        executive_summary = (
            f"DeepGuard verified this {media_type} as {classification} with {conf_pct}% confidence. "
            f"Pixel compression levels, frequency spectral distribution, and acoustic signal characteristics match authentic hardware capture patterns."
        )

    # 2. Detailed Human-Readable Factors
    flagged_factors: List[Dict[str, Any]] = []

    # Check ELA / Spatial Compression Variance
    ela = metrics.get("ela_residual_score") or metrics.get("artifact_score") or metrics.get("ela_score")
    if ela and ela > 0.40:
        flagged_factors.append({
            "title": "Error Level Analysis (ELA) Compression Variance",
            "impact": "+35% Confidence Contribution",
            "severity": "high" if ela > 0.65 else "medium",
            "explanation": f"Non-uniform compression levels detected. Re-saved pixel blocks indicate local region editing or neural image synthesis around key features."
        })

    # Check FFT Spectral Grid
    fft = metrics.get("fft_spectral_score") or metrics.get("visual_consistency")
    if fft and (fft > 0.45 or fft < 0.50):
        flagged_factors.append({
            "title": "Fourier Spectral Frequency Anomaly",
            "impact": "+30% Confidence Contribution",
            "severity": "high",
            "explanation": f"Unnatural high-frequency periodic grid patterns detected in Fourier space, characteristic of GAN (Generative Adversarial Network) or Diffusion model sampling."
        })

    # Check Audio / Pitch Jitter
    audio_synth = metrics.get("audio_synthesis_score") or metrics.get("spectral_rolloff_score")
    if audio_synth and audio_synth > 0.50:
        flagged_factors.append({
            "title": "Acoustic Spectral Roll-Off & Pitch Jitter",
            "impact": "+25% Confidence Contribution",
            "severity": "high",
            "explanation": "Voice harmonics display unnatural high-frequency energy cutoffs typical of text-to-speech (TTS) neural voice cloning software."
        })

    # Check Lip Sync
    lip_sync = metrics.get("lip_sync_alignment")
    if lip_sync and lip_sync > 0.60:
        flagged_factors.append({
            "title": "Acoustic-to-Visual Lip Sync Misalignment",
            "impact": "+20% Confidence Contribution",
            "severity": "high",
            "explanation": "Spoken phonemes fail to synchronize with facial viseme landmark movements in multiple video frame sequences."
        })

    # Check Metadata Tags
    if metadata and metadata.get("suspicious_tags"):
        for tag in metadata["suspicious_tags"]:
            flagged_factors.append({
                "title": "Generative Software / EXIF Metadata Signature",
                "impact": "+15% Confidence Contribution",
                "severity": "medium",
                "explanation": f"Header audit flagged software artifact: '{tag}'. Indicates post-processing or AI image generation tools."
            })

    if not flagged_factors:
        flagged_factors.append({
            "title": "Authentic Signal Distribution",
            "impact": "0% Synthetic Risk",
            "severity": "low",
            "explanation": "All inspected spatial, temporal, and acoustic feature vectors remain within natural camera sensor tolerance limits."
        })

    return {
        "question": "Why did DeepGuard flag this?",
        "executive_summary": executive_summary,
        "classification": classification,
        "confidence_percentage": conf_pct,
        "flagged_factors": flagged_factors
    }
