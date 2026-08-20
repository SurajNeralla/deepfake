import cv2
import numpy as np
import base64
from PIL import Image
import io
from typing import Dict, Any, Tuple

def generate_saliency_heatmap(image_path: str, focus_regions: list = None) -> Tuple[str, list]:
    """
    Generate a visual Grad-CAM style Saliency Heatmap highlighting regions of visual anomaly.
    Returns (base64_heatmap_data_url, hot_spot_coordinates).
    """
    try:
        img = cv2.imread(image_path)
        if img is None:
            return "", []
        
        h, w, c = img.shape
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Compute gradient intensity map (sobel high frequencies + laplacian residual)
        sobelx = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=3)
        sobely = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=3)
        grad_mag = np.sqrt(sobelx**2 + sobely**2)
        
        # Apply Gaussian blur to create smooth saliency activation zones
        sal_blur = cv2.GaussianBlur(grad_mag, (21, 21), 0)
        
        # Add regional focus weight if face/anomaly regions are specified
        weighted_map = sal_blur.copy()
        if focus_regions:
            mask = np.ones_like(weighted_map) * 0.3
            for reg in focus_regions:
                rx, ry, rw, rh = reg.get("x", 0), reg.get("y", 0), reg.get("w", 0), reg.get("h", 0)
                mask[max(0, ry):min(h, ry+rh), max(0, rx):min(w, rx+rw)] = 1.0
            weighted_map *= mask

        # Normalize 0 to 255
        norm_map = cv2.normalize(weighted_map, None, alpha=0, beta=255, norm_type=cv2.NORM_MINMAX, dtype=cv2.CV_8U)
        
        # Apply COLORMAP_JET / VIRIDIS overlay
        heatmap = cv2.applyColorMap(norm_map, cv2.COLORMAP_JET)
        
        # Blend 40% original + 60% heatmap overlay
        blended = cv2.addWeighted(img, 0.4, heatmap, 0.6, 0)
        
        # Convert to RGB and encode to JPEG base64 Data URL
        blended_rgb = cv2.cvtColor(blended, cv2.COLOR_BGR2RGB)
        pil_img = Image.fromarray(blended_rgb)
        
        buffer = io.BytesIO()
        pil_img.save(buffer, format="JPEG", quality=85)
        b64_str = base64.b64encode(buffer.getvalue()).decode('utf-8')
        data_url = f"data:image/jpeg;base64,{b64_str}"
        
        # Extract hot spot centroids
        hot_spots = []
        _, thresh = cv2.threshold(norm_map, 200, 255, cv2.THRESH_BINARY)
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        for cnt in contours[:5]:
            x, y, bw, bh = cv2.boundingRect(cnt)
            if bw * bh > 100:
                hot_spots.append({"x": int(x), "y": int(y), "w": int(bw), "h": int(bh), "intensity": "high"})
                
        return data_url, hot_spots
    except Exception as e:
        return "", []
