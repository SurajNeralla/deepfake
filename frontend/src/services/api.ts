import axios from 'axios';
import { AnalysisResult, HistoryResponse, HealthStatus, MediaType } from '../types';

const API_BASE = '/api';

export const api = {
  // Health
  getHealth: async (): Promise<HealthStatus> => {
    const res = await axios.get<HealthStatus>(`${API_BASE}/health`);
    return res.data;
  },

  // Upload & Analyze
  analyzeMedia: async (file: File, mediaType: MediaType, onProgress?: (pct: number) => void): Promise<AnalysisResult> => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await axios.post<AnalysisResult>(`${API_BASE}/analyze/${mediaType}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      }
    });

    return res.data;
  },

  // Get Analysis by ID
  getAnalysis: async (id: string): Promise<AnalysisResult> => {
    const res = await axios.get<AnalysisResult>(`${API_BASE}/analysis/${id}`);
    return res.data;
  },

  // History
  getHistory: async (mediaType?: string, classification?: string, limit = 20, offset = 0): Promise<HistoryResponse> => {
    const params = new URLSearchParams();
    if (mediaType && mediaType !== 'all') params.append('media_type', mediaType);
    if (classification && classification !== 'all') params.append('classification', classification);
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());

    const res = await axios.get<HistoryResponse>(`${API_BASE}/history?${params.toString()}`);
    return res.data;
  },

  // Export Report URL helpers
  getReportExportUrl: (id: string, format: 'pdf' | 'json') => {
    return `${API_BASE}/report/${id}/export?format=${format}`;
  }
};
