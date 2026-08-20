import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { MediaType } from '../types';

interface AnalyzeProps {
  addToast: (type: 'info' | 'success' | 'warning' | 'error', text: string) => void;
}

export const Analyze: React.FC<AnalyzeProps> = ({ addToast }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const initialType = (searchParams.get('type') as MediaType) || 'image';
  const [mediaType, setMediaType] = useState<MediaType>(initialType);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<string>('Initializing Forensic Pipeline...');

  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile]);

  const handleTabChange = (type: MediaType) => {
    setMediaType(type);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleFileSelect = (file: File) => {
    let targetType = mediaType;
    if (file.type.startsWith('image/')) targetType = 'image';
    else if (file.type.startsWith('video/')) targetType = 'video';
    else if (file.type.startsWith('audio/')) targetType = 'audio';

    if (targetType !== mediaType) {
      setMediaType(targetType);
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const allowedMap: Record<MediaType, string[]> = {
      image: ['jpg', 'jpeg', 'png', 'webp', 'jfif', 'pjp', 'pjpeg', 'svg', 'bmp', 'tiff'],
      video: ['mp4', 'mov', 'avi', 'webm', 'mkv', 'flv'],
      audio: ['mp3', 'wav', 'm4a', 'aac', 'flac', 'ogg']
    };

    if (!allowedMap[targetType].includes(ext) && !file.type.startsWith(targetType)) {
      addToast('error', `Unsupported file extension .${ext}. Allowed: ${allowedMap[targetType].join(', ')}`);
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      addToast('error', 'File size exceeds maximum upload limit of 100MB.');
      return;
    }

    setSelectedFile(file);
    addToast('info', `File ${file.name} selected for ${targetType.toUpperCase()} inspection.`);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleRunAnalysis = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setUploadProgress(10);
    setProcessingStep('Validating file integrity & MIME security headers...');

    try {
      setTimeout(() => setProcessingStep('Uploading asset to secure forensic sandbox...'), 600);
      
      const result = await api.analyzeMedia(selectedFile, mediaType, (pct) => {
        setUploadProgress(Math.min(90, Math.max(10, pct)));
      });

      setUploadProgress(95);
      setProcessingStep('Extracting spatial & spectral anomaly features...');

      setTimeout(() => {
        setUploadProgress(100);
        addToast('success', 'Analysis completed successfully!');
        navigate(`/results/${result.analysis_id}`);
      }, 800);

    } catch (err: any) {
      setIsProcessing(false);
      const errMsg = err?.response?.data?.detail || 'Analysis failed. Please verify file format and try again.';
      addToast('error', errMsg);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col gap-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-white mb-2">Media Forensic Inspector</h1>
        <p className="font-body text-base text-[#bbc9cf]">
          Upload media assets to execute defensive deepfake artifact checks and spectral scans.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-2 font-mono text-xs uppercase">
        <button
          onClick={() => handleTabChange('image')}
          className={`px-6 py-2.5 rounded-t transition-colors ${
            mediaType === 'image'
              ? 'bg-[#00d1ff]/10 text-[#00d1ff] border-b-2 border-[#00d1ff] font-bold'
              : 'text-[#bbc9cf] hover:bg-white/5 hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-base align-middle mr-2">image</span>
          Image Scanner
        </button>

        <button
          onClick={() => handleTabChange('video')}
          className={`px-6 py-2.5 rounded-t transition-colors ${
            mediaType === 'video'
              ? 'bg-[#00d1ff]/10 text-[#00d1ff] border-b-2 border-[#00d1ff] font-bold'
              : 'text-[#bbc9cf] hover:bg-white/5 hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-base align-middle mr-2">videocam</span>
          Video Scanner
        </button>

        <button
          onClick={() => handleTabChange('audio')}
          className={`px-6 py-2.5 rounded-t transition-colors ${
            mediaType === 'audio'
              ? 'bg-[#00d1ff]/10 text-[#00d1ff] border-b-2 border-[#00d1ff] font-bold'
              : 'text-[#bbc9cf] hover:bg-white/5 hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-base align-middle mr-2">mic</span>
          Audio Scanner
        </button>
      </div>

      {/* Main Upload Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Dropzone Container */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input-field')?.click()}
          className="lg:col-span-2 glass-card rounded-xl p-8 border-2 border-dashed border-[#00d1ff]/30 hover:border-[#00d1ff] transition-all cursor-pointer relative overflow-hidden flex flex-col items-center justify-center min-h-[380px] group"
        >
          <input
            id="file-input-field"
            type="file"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          />

          <div className="text-center z-10 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#00d1ff]/10 border border-[#00d1ff]/40 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl text-[#00d1ff]">cloud_upload</span>
            </div>

            <h3 className="font-display text-xl font-bold text-white">Drag & Drop {mediaType.toUpperCase()} File</h3>
            <p className="font-body text-sm text-[#bbc9cf]">or click to select from local storage</p>

            <div className="flex gap-2 mt-2 font-mono text-[10px]">
              {mediaType === 'image' && ['JPG', 'JPEG', 'PNG', 'WEBP'].map(ext => (
                <span key={ext} className="px-2 py-1 bg-[#1e1f25] border border-white/10 rounded text-[#bbc9cf]">{ext}</span>
              ))}
              {mediaType === 'video' && ['MP4', 'MOV', 'AVI', 'WEBM'].map(ext => (
                <span key={ext} className="px-2 py-1 bg-[#1e1f25] border border-white/10 rounded text-[#bbc9cf]">{ext}</span>
              ))}
              {mediaType === 'audio' && ['MP3', 'WAV', 'M4A'].map(ext => (
                <span key={ext} className="px-2 py-1 bg-[#1e1f25] border border-white/10 rounded text-[#bbc9cf]">{ext}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Selected File Specs & Preview Sidebar */}
        <div className="flex flex-col gap-6">
          <div className="glass-card rounded-xl p-6 border border-white/10 flex flex-col gap-4">
            <h4 className="font-mono text-xs font-bold text-white uppercase border-b border-white/10 pb-2">
              Selected Asset Information
            </h4>

            {selectedFile && previewUrl ? (
              <div className="flex flex-col gap-4">
                <div className="aspect-video bg-black/60 rounded overflow-hidden border border-white/10 flex items-center justify-center">
                  {mediaType === 'image' && (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                  )}
                  {mediaType === 'video' && (
                    <video src={previewUrl} controls className="w-full h-full object-contain" />
                  )}
                  {mediaType === 'audio' && (
                    <audio src={previewUrl} controls className="w-full px-4" />
                  )}
                </div>

                <div className="font-mono text-xs text-[#bbc9cf] flex flex-col gap-1.5">
                  <div className="flex justify-between">
                    <span>File Name:</span>
                    <span className="text-white truncate max-w-[140px]">{selectedFile.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>File Size:</span>
                    <span className="text-white">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>MIME Type:</span>
                    <span className="text-white">{selectedFile.type || 'Media File'}</span>
                  </div>
                </div>

                <button
                  onClick={handleRunAnalysis}
                  disabled={isProcessing}
                  className="btn-primary w-full py-3 rounded font-mono text-xs uppercase font-bold tracking-wider mt-2 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">memory</span>
                  Run Forensic Scan
                </button>
              </div>
            ) : (
              <div className="py-12 text-center text-xs font-mono text-[#bbc9cf]/60">
                No file selected. Drop an asset into the dropzone to preview.
              </div>
            )}
          </div>

          {/* Live Progress State Display */}
          {isProcessing && (
            <div className="glass-card rounded-xl p-6 border-l-4 border-[#00fc92] flex flex-col gap-3">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-[#00fc92] font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm progress-pulse">memory</span>
                  Analyzing Media
                </span>
                <span className="text-white font-bold">{uploadProgress}%</span>
              </div>

              <div className="w-full h-1.5 bg-[#1e1f25] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#00fc92] transition-all duration-300 shadow-[0_0_10px_#00fc92]"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>

              <p className="font-mono text-[11px] text-[#bbc9cf] mt-1">{processingStep}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
