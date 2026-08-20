import os
import cv2
import numpy as np
from PIL import Image, ImageChops, ImageEnhance
from typing import Dict, Any, List, Tuple

def perform_ela(image_path: str, quality: int = 90, scale: int = 15) -> Tuple[float, np.ndarray]:
    """
    Perform Error Level Analysis (ELA) on image.
    Saves image at specified JPEG quality and computes absolute pixel difference.
    Returns ELA anomaly score (0.0 to 1.0) and ELA diff array.
    """
    temp_ela_path = image_path + ".ela.tmp.jpg"
    try:
        original = Image.open(image_path).convert("RGB")
        original.save(temp_ela_path, "JPEG", quality=quality)
        resaved = Image.open(temp_ela_path).convert("RGB")

        # Compute absolute difference
        ela_im = ImageChops.difference(original, resaved)
        
        # Scale brightness of difference
        extrema = ela_im.getextrema()
        max_diff = max([ex[1] for ex in extrema])
        if max_diff == 0:
            max_diff = 1
            
        scale_factor = 255.0 / max_diff
        ela_im = ImageEnhance.Brightness(ela_im).enhance(scale_factor)
        
        ela_np = np.array(ela_im)
        mean_diff = np.mean(ela_np)
        std_diff = np.std(ela_np)

        # Anomaly score based on variance of error distribution
        ela_score = min(1.0, (mean_diff * 0.4 + std_diff * 0.6) / 128.0)
        return float(ela_score), ela_np
    except Exception as e:
        return 0.5, np.zeros((100, 100, 3), dtype=np.uint8)
    finally:
        if os.path.exists(temp_ela_path):
            try:
                os.remove(temp_ela_path)
            except Exception:
                pass

def analyze_fft_spectrum(image_path: str) -> float:
    """
    Analyze High Frequency Component distribution using Fast Fourier Transform.
    GAN/Deepfake images frequently exhibit spectral grid artifacts or unnatural high frequency drop-offs.
    """
    try:
        img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
        if img is None:
            return 0.5
        
        # Resize to standard size
        img = cv2.resize(img, (512, 512))
        f = np.fft.fft2(img)
        fshift = np.fft.fftshift(f)
        magnitude_spectrum = 20 * np.log(np.abs(fshift) + 1e-8)

        # Calculate high-frequency energy ratio vs low-frequency center
        h, w = magnitude_spectrum.shape
        cy, cx = h // 2, w // 2
        radius = 50

        y, x = np.ogrid[:h, :w]
        center_mask = (x - cx)**2 + (y - cy)**2 <= radius**2
        outer_mask = ~center_mask

        center_energy = np.mean(magnitude_spectrum[center_mask])
        outer_energy = np.mean(magnitude_spectrum[outer_mask])

        ratio = outer_energy / (center_energy + 1e-8)
        # Unnatural high frequency artifact score
        fft_score = min(1.0, max(0.0, float(ratio - 0.2) * 2.0))
        return fft_score
    except Exception:
        return 0.5

def detect_faces(image_path: str) -> List[Dict[str, int]]:
    """
    Detect faces using OpenCV Haar Cascade.
    Returns list of face bounding boxes: [{'x': x, 'y': y, 'w': w, 'h': h}].
    """
    try:
        img = cv2.imread(image_path)
        if img is None:
            return []
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
        face_cascade = cv2.CascadeClassifier(cascade_path)
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(60, 60))

        results = []
        for (x, y, w, h) in faces:
            results.append({"x": int(x), "y": int(y), "w": int(w), "h": int(h)})
        return results
    except Exception:
        return []

def calculate_blur_variance(image_path: str) -> float:
    """Laplacian variance to detect unnatural blur or smoothing around faces."""
    try:
        img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
        if img is None:
            return 0.0
        var = cv2.Laplacian(img, cv2.CV_64F).var()
        return float(var)
    except Exception:
        return 0.0
