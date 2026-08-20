export type MediaType = 'image' | 'video' | 'audio';

export type ClassificationType = 'REAL' | 'LIKELY REAL' | 'SUSPICIOUS' | 'LIKELY FAKE';

export interface Explanation {
  reason: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp?: number | null;
  region?: { x: number; y: number; w: number; h: number } | null;
}

export interface AnalysisMetrics {
  visual_consistency?: number;
  artifact_score?: number;
  metadata_score?: number;
  face_consistency?: number;
  ela_score?: number;
  fft_anomaly_score?: number;
  temporal_consistency?: number;
  audio_consistency?: number;
  spectral_anomaly_score?: number;
  [key: string]: number | undefined;
}

export interface AnalysisResult {
  analysis_id: string;
  filename: string;
  original_filename: string;
  media_type: MediaType;
  classification: ClassificationType;
  confidence: number;
  is_demo_fallback: boolean;
  model_name: string;
  model_version: string;
  metrics: AnalysisMetrics;
  explanations: Explanation[];
  status: string;
  created_at: string;
  file_size: number;
  mime_type: string;
}

export interface HistoryItem {
  id: string;
  original_filename: string;
  media_type: MediaType;
  classification: ClassificationType;
  confidence: number;
  is_demo_fallback: boolean;
  status: string;
  created_at: string;
}

export interface HistoryResponse {
  total: number;
  items: HistoryItem[];
}

export interface HealthStatus {
  status: string;
  version: string;
  model_engine: string;
  gpu_available: boolean;
  storage_ok: boolean;
}
