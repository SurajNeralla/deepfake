import os
import time
from backend.app.core.config import settings

def cleanup_old_files(max_age_seconds: int = 86400):
    """
    Remove temporary upload files and generated reports older than max_age_seconds (default 24 hours).
    Ensures privacy and prevents disk bloat.
    """
    now = time.time()
    dirs_to_clean = [settings.UPLOAD_DIR, settings.REPORT_DIR]

    for d in dirs_to_clean:
        if not os.path.exists(d):
            continue
        for filename in os.listdir(d):
            file_path = os.path.join(d, filename)
            if os.path.isfile(file_path):
                try:
                    file_age = now - os.path.getmtime(file_path)
                    if file_age > max_age_seconds:
                        os.remove(file_path)
                except Exception:
                    pass
