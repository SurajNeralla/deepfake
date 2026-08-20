import os
import re
import uuid
from typing import Tuple
from fastapi import UploadFile, HTTPException, status
from backend.app.core.config import settings

MIME_TYPE_MAP = {
    "jpg": "image/jpeg",
    "jpeg": "image/jpeg",
    "png": "image/png",
    "webp": "image/webp",
    "mp4": "video/mp4",
    "mov": "video/quicktime",
    "avi": "video/x-msvideo",
    "webm": "video/webm",
    "mp3": "audio/mpeg",
    "wav": "audio/wav",
    "m4a": "audio/x-m4a"
}

def sanitize_filename(filename: str) -> str:
    """Strip path traversal characters and unsafe symbols from original filename."""
    if not filename:
        return "unnamed_media"
    # Remove directory separators & null bytes
    basename = os.path.basename(filename)
    clean_name = re.sub(r'[^a-zA-Z0-9_.-]', '_', basename)
    return clean_name[:100]

def validate_file_extension(filename: str, media_type: str) -> str:
    """Validate file extension matches allowed extensions for specified media type."""
    ext = filename.split(".")[-1].lower() if "." in filename else ""
    if not ext:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File has no extension. Please upload a valid media file."
        )

    if media_type == "image" and ext not in settings.ALLOWED_IMAGE_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported image extension '.{ext}'. Allowed: {', '.join(settings.ALLOWED_IMAGE_EXTENSIONS)}"
        )
    elif media_type == "video" and ext not in settings.ALLOWED_VIDEO_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported video extension '.{ext}'. Allowed: {', '.join(settings.ALLOWED_VIDEO_EXTENSIONS)}"
        )
    elif media_type == "audio" and ext not in settings.ALLOWED_AUDIO_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported audio extension '.{ext}'. Allowed: {', '.join(settings.ALLOWED_AUDIO_EXTENSIONS)}"
        )
    
    return ext

def generate_safe_path(ext: str) -> Tuple[str, str]:
    """Generate a random UUID filename and full absolute path inside upload directory."""
    file_id = str(uuid.uuid4())
    filename = f"{file_id}.{ext}"
    abs_path = os.path.abspath(os.path.join(settings.UPLOAD_DIR, filename))
    
    # Anti-path traversal guard
    upload_dir_abs = os.path.abspath(settings.UPLOAD_DIR)
    if not abs_path.startswith(upload_dir_abs):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file path detected."
        )
    return file_id, abs_path

async def validate_and_save_upload(file: UploadFile, media_type: str) -> Tuple[str, str, str, int, str]:
    """Validate upload size, extension, MIME, save safely, and return metadata."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="Empty file submission.")

    sanitized_original = sanitize_filename(file.filename)
    ext = validate_file_extension(sanitized_original, media_type)

    # Read content to check size and write
    content = await file.read()
    file_size = len(content)

    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if file_size > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE_MB}MB."
        )

    if file_size == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    file_id, safe_path = generate_safe_path(ext)

    # Write file securely
    with open(safe_path, "wb") as f:
        f.write(content)

    mime_type = file.content_type or MIME_TYPE_MAP.get(ext, "application/octet-stream")
    return file_id, safe_path, sanitized_original, file_size, mime_type
