import logging
import httpx
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

async def dispatch_webhook_alert(webhook_url: str, analysis_data: Dict[str, Any]) -> bool:
    """
    Send an HTTP POST webhook alert notification for flagged deepfakes.
    """
    if not webhook_url:
        return False

    payload = {
        "event": "DEEPFAKE_ALERT_FLAGGED",
        "analysis_id": analysis_data.get("analysis_id"),
        "filename": analysis_data.get("filename"),
        "classification": analysis_data.get("classification"),
        "confidence": analysis_data.get("confidence"),
        "media_type": analysis_data.get("media_type"),
        "timestamp": analysis_data.get("created_at"),
        "severity": "HIGH" if analysis_data.get("confidence", 0) > 0.8 else "MEDIUM",
        "message": f"🚨 DeepGuard Alert: High synthetic probability ({round(analysis_data.get('confidence', 0)*100, 1)}%) detected on '{analysis_data.get('filename')}'."
    }

    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.post(webhook_url, json=payload)
            return resp.status_code in [200, 201, 202, 204]
    except Exception as e:
        logger.error(f"Failed to dispatch webhook alert to {webhook_url}: {e}")
        return False
