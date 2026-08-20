from fastapi import APIRouter
from backend.app.api.endpoints import health, analyze, history, reports, api_keys, models

api_router = APIRouter(prefix="/api")

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(analyze.router, tags=["Forensics Analysis"])
api_router.include_router(history.router, tags=["History"])
api_router.include_router(reports.router, tags=["Reports"])
api_router.include_router(api_keys.router, tags=["API Keys"])
api_router.include_router(models.router, tags=["AI Models"])


