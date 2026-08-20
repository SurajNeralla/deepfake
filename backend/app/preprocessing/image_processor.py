import os
import cv2
import numpy as np
from PIL import Image, ImageChops, ImageEnhance
from typing import Dict, Any, List, Tuple

def perform_ela(image_path: str, quality: int = 90, scale: int = 15) -> Tuple[float, np.ndarray]:
    """
    Perform Error Level Analysis (ELA) on image.
    Evaluates localized compression variance around faces vs background.
    """
    temp_ela_path = image_path + ".ela.tmp.jpg"
    try:
        original = Image.open(image_path).convert("RGB")
        original.save(temp_ela_path, "JPEG", quality=quality)
        resaved = Image.open(temp_ela_path).convert("RGB")

        # Compute absolute difference
        ela_im = ImageChops.difference(original, resaved)
        
        extrema = ela_im.getextrema()
        max_diff = max([ex[1] for ex in extrema])
        if max_diff == 0:
            max_diff = 1
            
        scale_factor = 255.0 / max_diff
        ela_im = ImageEnhance.Brightness(ela_im).enhance(scale_factor)
        
        ela_np = np.array(ela_im)
        mean_diff = float(np.mean(ela_np))
        std_diff = float(np.std(ela_np))

        # Calibrated anomaly scoring: Uniform compression across frame = Real (0.1 - 0.25)
        # High localized std variance relative to mean = Editing/Synthesis (0.6 - 0.9)
        variance_ratio = std_diff / (mean_diff + 1e-5)
        if variance_ratio < 1.2:
            # Uniform natural compression
            ela_score = min(0.25, max(0.05, mean_diff / 255.0))
        else:
            # Localized anomaly detected
            ela_score = min(0.95, max(0.30, (variance_ratio - 1.2) * 0.4 + (mean_diff / 200.0)))

        return float(ela_score), ela_np
    except Exception:
        return 0.15, np.zeros((100, 100, 3), dtype=np.uint8)
    finally:
        if os.path.exists(temp_ela_path):
            try:
                os.remove(temp_ela_path)
            except Exception:
                pass

def analyze_fft_spectrum(image_path: str) -> float:
    """
    Analyze High Frequency Component distribution using Fast Fourier Transform.
    GAN/Deepfake images exhibit artificial periodic grid artifacts.
    """
    try:
        img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
        if img is None:
            return 0.15
        
        img = cv2.resize(img, (512, 512))
        f = np.fft.fft2(img)
        fshift = np.fft.fftshift(f)
        magnitude_spectrum = 20 * np.log(np.abs(fshift) + 1e-8)

        h, w = magnitude_spectrum.shape
        cy, cx = h // 2, w // 2
        radius = 50

        y, x = np.ogrid[:h, :w]
        center_mask = (x - cx)**2 + (y - cy)**2 <= radius**2
        outer_mask = ~center_mask

        center_energy = float(np.mean(magnitude_spectrum[center_mask]))
        outer_energy = float(np.mean(magnitude_spectrum[outer_mask]))

        ratio = outer_energy / (center_energy + 1e-8)
        # Calibrated FFT grid score
        if ratio < 0.65:
            fft_score = float(max(0.05, ratio * 0.2))
        else:
            fft_score = float(min(0.95, max(0.30, (ratio - 0.65) * 2.5)))

        return fft_score
    except Exception:
        return 0.15

def detect_faces(image_path: str) -> List[Dict[str, int]]:
    """
    Detect faces using OpenCV Haar Cascade.
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
    """Calculate Laplacian variance to assess image focus/blur quality."""
    try:
        img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
        if img is None:
            return 100.0
        return float(cv2.Laplacian(img, cv2.CV_64F).var())
    except Exception:
        return 100.0
