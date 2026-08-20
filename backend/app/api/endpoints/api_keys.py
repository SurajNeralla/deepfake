import uuid
import secrets
from fastapi import APIRouter, Header, HTTPException, status
from pydantic import BaseModel
from typing import Dict, Any

router = APIRouter()

# In-memory store for API keys and rate limiting tokens
API_KEYS_DB: Dict[str, Dict[str, Any]] = {
    "dg_live_demo_key_99": {"name": "Default Developer Key", "rate_limit": 60, "requests": 0}
}

class APIKeyCreateRequest(BaseModel):
    name: str

class APIKeyResponse(BaseModel):
    key: str
    name: str
    rate_limit_per_min: int

@router.post("/keys/generate", response_model=APIKeyResponse)
def generate_api_key(req: APIKeyCreateRequest):
    new_key = f"dg_live_{secrets.token_hex(16)}"
    API_KEYS_DB[new_key] = {
        "name": req.name,
        "rate_limit": 60,
        "requests": 0
    }
    return APIKeyResponse(
        key=new_key,
        name=req.name,
        rate_limit_per_min=60
    )

def verify_api_key(x_api_key: str = Header(None)):
    """
    Dependency to validate X-API-Key header.
    Optional for local demo mode.
    """
    if x_api_key and x_api_key not in API_KEYS_DB:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or revoked API Key."
        )
    return x_api_key
