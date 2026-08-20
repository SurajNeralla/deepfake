# DEEPGUARD — AI-Powered Deepfake Detection & Media Forensics Platform

DeepGuard is a complete, modular, defensive media-forensics platform designed to inspect images, videos, and acoustic signals for deepfakes, synthetic manipulations, and digital artifacts.

---

## Key Features

- **Multi-Modal Inspection**: Dedicated forensic pipelines for Images (JPG, PNG, WEBP), Videos (MP4, MOV, AVI, WEBM), and Audio (MP3, WAV, M4A).
- **Stitch Design System**: Responsive, high-contrast dark cyberpunk UI with live scanning animations, radial confidence gauges, ELA heatmaps, frame timelines, and STFT spectrograms.
- **Defensive Scope Mandate**: Built strictly for detection and authentication. Includes zero generative or identity-disguising features.
- **Transparent Demonstration Mode**: Clearly labels results when local model weights are absent rather than fabricating fake 99.9% AI accuracy claims.
- **Automated Report Engine**: Downloads downloadable PDF certificates and structured JSON exports.
- **Production-Ready Architecture**: Modular FastAPI backend with PyTorch/OpenCV pipeline, SQLAlchemy ORM (SQLite / PostgreSQL ready), and Docker support.

---

## System Architecture

```
deepguard/
├── frontend/                 # React + Vite + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── components/       # Reusable UI (Navbar, ForensicGauge, ElaHeatmap, VideoTimeline, AudioSpectrogram)
│   │   ├── pages/            # Dashboard, Analyze, Results, History, ReportView, About
│   │   ├── services/         # Axios API Client
│   │   └── hooks/            # Custom hooks (useToast)
│   └── vite.config.ts        # Dev server proxy configuration
│
├── backend/                  # FastAPI Application
│   ├── app/
│   │   ├── main.py           # FastAPI entrypoint & middleware
│   │   ├── api/              # Endpoints (/analyze, /analysis, /history, /report, /health)
│   │   ├── core/             # Configuration & DB session management
│   │   ├── models/           # SQLAlchemy DB models (Analyses, Metrics, Events, Reports)
│   │   ├── schemas/          # Pydantic JSON schemas
│   │   ├── ml/               # Modular Detector system (BaseDetector, ImageDetector, VideoDetector, AudioDetector)
│   │   ├── preprocessing/    # ELA, FFT, Face Bounding, Frame Sampling & Scipy Audio Spectral Processors
│   │   ├── services/         # Forensic orchestration & PDF generation
│   │   └── utils/            # Security validation & anti-path traversal
│   └── requirements.txt
│
├── models/                   # Model registry & weights directory
│   └── config.yaml           # Model thresholds & device configuration
├── uploads/                  # Safe temporary upload directory
├── reports/                  # Generated PDF & JSON reports
├── tests/                    # Pytest test suite
├── docker-compose.yml        # Docker composition file
└── .env.example              # Environment settings template
```

---

## Getting Started (Local Development)

### 1. Backend Setup (FastAPI)

```bash
# Navigate to project root
cd deepguard

# Create and activate virtual environment
python -m venv .venv
# On Windows PowerShell:
.venv\Scripts\Activate.ps1
# On Linux/macOS:
source .venv/bin/activate

# Install backend dependencies
pip install -r backend/requirements.txt

# Run FastAPI dev server
python -m uvicorn backend.app.main:app --reload --port 8000
```
Backend API will be accessible at: `http://localhost:8000`  
Swagger Documentation: `http://localhost:8000/docs`

### 2. Frontend Setup (React + Vite)

```bash
# Open a new terminal tab and navigate to frontend
cd frontend

# Install Node dependencies
npm install

# Start Vite development server
npm run dev
```
Frontend application will be accessible at: `http://localhost:5173`

---

## Running with Docker

Start both frontend and backend containers simultaneously:

```bash
docker compose up --build
```
- Frontend: `http://localhost`
- Backend API: `http://localhost:8000`

---

## API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | System health, storage status & PyTorch GPU availability |
| `POST` | `/api/analyze/image` | Upload & run spatial forensic analysis on image |
| `POST` | `/api/analyze/video` | Upload & sample frames for temporal video analysis |
| `POST` | `/api/analyze/audio` | Upload & run spectral STFT analysis on audio signal |
| `GET` | `/api/analysis/{id}` | Retrieve detailed forensic analysis JSON |
| `GET` | `/api/history` | Paginated & filterable analysis audit history |
| `GET` | `/api/report/{id}` | Fetch report metadata |
| `POST` | `/api/report/{id}/export?format=pdf` | Download official PDF forensic certificate |
| `POST` | `/api/report/{id}/export?format=json` | Export full JSON forensic audit data |

---

## Modular ML Architecture & Model Replacement

All detection models derive from `BaseDetector`:

```python
class BaseDetector(ABC):
    @abstractmethod
    def predict(self, media_path: str) -> Dict[str, Any]:
        pass
```

### Pluggable Weights Integration
To plug in custom trained PyTorch weights:
1. Save your `.pt` model file to `models/weights/image_detector.pt` (or `video_detector.pt` / `audio_detector.pt`).
2. Adjust detection thresholds and device preference in `models/config.yaml`.
3. The platform automatically detects the `.pt` file, sets `is_demo_fallback = False`, and runs neural inference.

---

## Testing

Run automated pytest suite:

```bash
pytest tests/
```

---

## Responsible AI & Ethics Statement

DeepGuard is strictly designed for **defensive detection and forensic verification**. It contains no functionality for deepfake generation, facial swap synthesis, voice cloning, or identity disguise. The system operates on privacy-by-design principles with automatic temporary file cleanup.
