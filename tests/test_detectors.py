import os
import numpy as np
from PIL import Image
from backend.app.ml.image_detector import ImageDetector
from backend.app.ml.video_detector import VideoDetector
from backend.app.ml.audio_detector import AudioDetector

def test_image_detector_prediction():
    # Create temporary synthetic test image
    test_img_path = "./test_sample.jpg"
    img = Image.fromarray(np.uint8(np.random.rand(256, 256, 3) * 255))
    img.save(test_img_path)

    try:
        detector = ImageDetector()
        res = detector.predict(test_img_path)
        
        assert "classification" in res
        assert res["classification"] in ["REAL", "LIKELY REAL", "SUSPICIOUS", "LIKELY FAKE"]
        assert 0.0 <= res["confidence"] <= 1.0
        assert "visual_consistency" in res["metrics"]
        assert "artifact_score" in res["metrics"]
        assert res["is_demo_fallback"] is True
    finally:
        if os.path.exists(test_img_path):
            os.remove(test_img_path)

def test_audio_detector_prediction():
    detector = AudioDetector()
    res = detector.predict("non_existent.wav")
    assert "classification" in res
    assert "audio_consistency" in res["metrics"]
