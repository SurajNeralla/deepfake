import os
import yaml
from abc import ABC, abstractmethod
from typing import Dict, Any

try:
    import torch
    TORCH_AVAILABLE = True
except ImportError:
    TORCH_AVAILABLE = False

class BaseDetector(ABC):
    def __init__(self, config_path: str = "./models/config.yaml"):
        self.config_path = config_path
        self.config = self._load_config()
        self.device = self._setup_device()
        self.model = None
        self.is_demo_fallback = True
        self._load_model()

    def _load_config(self) -> Dict[str, Any]:
        if os.path.exists(self.config_path):
            try:
                with open(self.config_path, "r") as f:
                    return yaml.safe_load(f) or {}
            except Exception:
                pass
        return {}

    def _setup_device(self) -> str:
        if not TORCH_AVAILABLE:
            return "cpu"
        pref = self.config.get("model", {}).get("device", "auto")
        if pref in ["cuda", "auto"] and torch.cuda.is_available():
            return "cuda"
        return "cpu"

    def _load_model(self):
        """
        Loads PyTorch model if weights file exists in weights_dir.
        Sets self.is_demo_fallback = False when real weights are loaded.
        """
        if not TORCH_AVAILABLE:
            self.model = None
            self.is_demo_fallback = True
            return

        weights_dir = self.config.get("model", {}).get("weights_dir", "./models/weights")
        weights_file = os.path.join(weights_dir, f"{self.detector_name}.pt")
        
        if os.path.exists(weights_file):
            try:
                self.model = torch.load(weights_file, map_location=self.device)
                self.model.eval()
                self.is_demo_fallback = False
            except Exception:
                self.model = None
                self.is_demo_fallback = True
        else:
            self.model = None
            self.is_demo_fallback = True

    @property
    @abstractmethod
    def detector_name(self) -> str:
        pass

    @abstractmethod
    def predict(self, media_path: str) -> Dict[str, Any]:
        """
        Must return structured dict containing:
        - classification (REAL, LIKELY REAL, SUSPICIOUS, LIKELY FAKE)
        - confidence (float 0.0 - 1.0)
        - metrics (dict of forensic indicator scores)
        - explanations (list of explanation dicts with reason, severity, timestamp, etc.)
        - is_demo_fallback (bool)
        """
        pass
