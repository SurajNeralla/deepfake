import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    APP_ENV: str = "development"
    SECRET_KEY: str = "deepguard_super_secret_key_change_in_production_32bytes"
    DEBUG: bool = True
    CORS_ORIGINS: List[str] = ["*"]
    
    DATABASE_URL: str = "sqlite:///./deepguard.db"
    
    MAX_UPLOAD_SIZE_MB: int = 100
    ALLOWED_IMAGE_EXTENSIONS: List[str] = ["jpg", "jpeg", "png", "webp"]
    ALLOWED_VIDEO_EXTENSIONS: List[str] = ["mp4", "mov", "avi", "webm"]
    ALLOWED_AUDIO_EXTENSIONS: List[str] = ["mp3", "wav", "m4a"]
    
    UPLOAD_DIR: str = "./uploads"
    REPORT_DIR: str = "./reports"
    MODEL_CONFIG_PATH: str = "./models/config.yaml"
    USE_GPU: bool = False

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.REPORT_DIR, exist_ok=True)
