import os
from PIL import Image, ExifTags
from typing import Dict, Any

def extract_metadata(file_path: str) -> Dict[str, Any]:
    """
    Extract EXIF headers, camera model, software tags, and synthetic provenance flags.
    """
    result = {
        "camera_make": "Unknown",
        "camera_model": "Unknown",
        "software": "None detected",
        "date_taken": "N/A",
        "resolution": "Unknown",
        "color_space": "sRGB",
        "c2pa_provenance": "Unsigned / No C2PA manifest found",
        "suspicious_tags": [],
        "exif_present": False
    }

    if not os.path.exists(file_path):
        return result

    try:
        with Image.open(file_path) as img:
            result["resolution"] = f"{img.width}x{img.height}"
            result["color_space"] = img.mode

            # Check raw info tags for generative AI software signatures
            info_str = str(img.info).lower()
            ai_keywords = ["stable diffusion", "midjourney", "dall-e", "comfyui", "photoshop", "automatic1111", "novelai", "c2pa"]
            for kw in ai_keywords:
                if kw in info_str:
                    result["suspicious_tags"].append(f"AI Generator / Edit signature detected: '{kw}'")
                    if kw in ["stable diffusion", "midjourney", "dall-e", "automatic1111", "comfyui"]:
                        result["software"] = f"Generative AI ({kw.title()})"
                    elif kw == "photoshop":
                        result["software"] = "Adobe Photoshop"
                    elif kw == "c2pa":
                        result["c2pa_provenance"] = "C2PA Content Credentials Signature Present"

            # Parse EXIF metadata if present
            exif_data = img._getexif() if hasattr(img, '_getexif') else None
            if exif_data:
                result["exif_present"] = True
                for tag_id, val in exif_data.items():
                    tag_name = ExifTags.TAGS.get(tag_id, tag_id)
                    if tag_name == "Make":
                        result["camera_make"] = str(val).strip()
                    elif tag_name == "Model":
                        result["camera_model"] = str(val).strip()
                    elif tag_name == "Software":
                        result["software"] = str(val).strip()
                    elif tag_name == "DateTimeOriginal":
                        result["date_taken"] = str(val).strip()

                if "software" in result and any(k in result["software"].lower() for k in ["diffusion", "midjourney", "gimp", "photoshop"]):
                    result["suspicious_tags"].append(f"Software tag altered: {result['software']}")
            else:
                if result["software"] == "None detected":
                    result["suspicious_tags"].append("EXIF metadata stripped (Common in AI-generated files & web exports)")

    except Exception as e:
        result["error"] = str(e)

    return result
