import os
import cv2
import numpy as np
from typing import Dict, Any, List, Tuple

def extract_video_metadata(video_path: str) -> Dict[str, Any]:
    """Extract metadata (fps, duration, resolution, total_frames) from video."""
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return {
            "fps": 0.0,
            "duration": 0.0,
            "total_frames": 0,
            "width": 0,
            "height": 0
        }
    
    fps = cap.get(cv2.CAP_PROP_FPS) or 25.0
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT)) or 0
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)) or 0
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT)) or 0
    duration = total_frames / fps if fps > 0 else 0.0
    cap.release()

    return {
        "fps": round(fps, 2),
        "duration": round(duration, 2),
        "total_frames": total_frames,
        "width": width,
        "height": height
    }

def sample_video_frames(video_path: str, sample_fps: float = 2.0, max_frames: int = 60) -> List[Dict[str, Any]]:
    """
    Sample video frames at fixed interval (sample_fps).
    Saves temporary frames and returns list of sampled frame info:
    [{'frame_idx': idx, 'timestamp': sec, 'temp_path': path}].
    """
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return []

    fps = cap.get(cv2.CAP_PROP_FPS) or 25.0
    step = max(1, int(fps / sample_fps))
    
    frame_idx = 0
    sampled = []
    
    temp_dir = video_path + "_frames"
    os.makedirs(temp_dir, exist_ok=True)

    while True:
        ret, frame = cap.read()
        if not ret:
            break
        
        if frame_idx % step == 0 and len(sampled) < max_frames:
            timestamp = round(frame_idx / fps, 2)
            frame_path = os.path.join(temp_dir, f"frame_{frame_idx}.jpg")
            cv2.imwrite(frame_path, frame)
            sampled.append({
                "frame_idx": frame_idx,
                "timestamp": timestamp,
                "temp_path": frame_path
            })
            
        frame_idx += 1

    cap.release()
    return sampled

def cleanup_sampled_frames(frames: List[Dict[str, Any]], video_path: str):
    """Clean up extracted frame images and temporary folder."""
    for frame in frames:
        p = frame.get("temp_path")
        if p and os.path.exists(p):
            try:
                os.remove(p)
            except Exception:
                pass
    temp_dir = video_path + "_frames"
    if os.path.exists(temp_dir):
        try:
            os.rmdir(temp_dir)
        except Exception:
            pass
