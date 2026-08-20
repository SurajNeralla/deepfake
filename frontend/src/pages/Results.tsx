import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { AnalysisResult } from '../types';
import { ForensicGauge } from '../components/ForensicGauge';
import { ElaHeatmap } from '../components/ElaHeatmap';
import { VideoTimeline } from '../components/VideoTimeline';
import { AudioSpectrogram } from '../components/AudioSpectrogram';
import { ExplainableAiCard } from '../components/ExplainableAiCard';

interface ResultsProps {
  addToast: (type: 'info' | 'success' | 'warning' | 'error', text: string) => void;
}

export const Results: React.FC<ResultsProps> = ({ addToast }) => {
  const { id } = useParams<{ id: string }>();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    api.getAnalysis(id)
      .then((data) => {
        setResult(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch forensic analysis results.');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-6 text-center flex flex-col items-center gap-4">
        <span className="material-symbols-outlined text-5xl text-[#00d1ff] animate-spin">sync</span>
        <h2 className="font-display text-2xl font-bold text-white">Loading Forensic Analysis...</h2>
        <p className="font-mono text-xs text-[#bbc9cf]">Retrieving spatial, temporal and acoustic metrics for ID: {id}</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-6 text-center flex flex-col items-center gap-4">
        <span className="material-symbols-outlined text-5xl text-[#ffb4ab]">error</span>
        <h2 className="font-display text-2xl font-bold text-white">Analysis Record Not Found</h2>
        <p className="font-body text-sm text-[#bbc9cf]">{error || 'No result found for the specified analysis ID.'}</p>
        <Link to="/analyze" className="btn-primary px-6 py-3 rounded font-mono text-xs font-bold uppercase mt-4">
          Scan New Asset
        </Link>
      </div>
    );
  }

  const isLocalHost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const mediaUrl = (result as any).preview_data_url || (isLocalHost ? `http://localhost:8000/uploads/${result.filename}` : `/uploads/${result.filename}`);
  const isSuspiciousOrFake = result.classification === 'SUSPICIOUS' || result.classification === 'LIKELY FAKE';
  
  const classificationColor = isSuspiciousOrFake ? 'text-[#ffb4ab]' : 'text-[#00fc92]';
  const classificationBorder = isSuspiciousOrFake ? 'border-[#ffb4ab]/40 bg-[#ffb4ab]/10' : 'border-[#00fc92]/40 bg-[#00fc92]/10';

  const handleExportPDF = () => {
    window.open(api.getReportExportUrl(result.analysis_id, 'pdf'), '_blank');
    addToast('info', 'Generating PDF report download...');
  };

  const handleExportJSON = () => {
    window.open(api.getReportExportUrl(result.analysis_id, 'json'), '_blank');
    addToast('info', 'Downloading JSON data report...');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl font-bold text-white">Forensic Audit Results</h1>
            <span className={`px-3 py-1 rounded border font-mono text-xs font-bold uppercase ${classificationBorder} ${classificationColor}`}>
              {result.classification}
            </span>
          </div>
          <p className="font-mono text-xs text-[#bbc9cf] mt-1">
            Asset: <span className="text-white font-bold">{result.original_filename}</span> • ID: {result.analysis_id}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <button
            onClick={handleExportPDF}
            className="btn-primary px-4 py-2.5 rounded font-bold uppercase flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">picture_as_pdf</span>
            PDF Certificate
          </button>

          <button
            onClick={handleExportJSON}
            className="btn-secondary px-4 py-2.5 rounded font-bold uppercase flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">code</span>
            JSON Export
          </button>

          <Link
            to="/analyze"
            className="px-4 py-2.5 bg-[#1e1f25] border border-white/10 text-white hover:bg-white/10 rounded font-bold uppercase flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">add</span>
            Scan Another
          </Link>
        </div>
      </div>

      {/* Demonstration Mode Warning Notice if fallback */}
      {result.is_demo_fallback && (
        <div className="bg-[#1e1f25] border-l-4 border-amber-400 p-4 rounded flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-amber-400 text-2xl">info</span>
            <div>
              <h4 className="font-mono text-xs font-bold text-white uppercase">Demonstration Heuristic Mode Active</h4>
              <p className="font-body text-xs text-[#bbc9cf]">
                Model weights file omitted locally. Output was evaluated using OpenCV spectral and spatial heuristics rather than pretrained PyTorch neural network.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Top Overview Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Main Confidence Gauge Card */}
        <div className="glass-card rounded-xl p-6 border border-white/10 flex flex-col items-center justify-center">
          <ForensicGauge
            score={result.confidence}
            label="Aggregate Manipulation Risk"
            classification={result.classification}
            size="lg"
          />
        </div>

        {/* Forensic Metrics Breakdown */}
        <div className="md:col-span-3 glass-card rounded-xl p-6 border border-white/10 flex flex-col justify-between">
          <h3 className="font-mono text-xs font-bold text-white uppercase mb-4">Forensic Metric Indicators</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(result.metrics).map(([key, val]) => {
              if (val === undefined) return null;
              const displayVal = Math.round(val * 100);
              const labelClean = key.replace(/_/g, ' ').toUpperCase();
              const isLow = val < 0.50;

              return (
                <div key={key} className="bg-[#1a1b21] p-4 rounded border border-white/5 flex flex-col gap-1">
                  <span className="font-mono text-[10px] text-[#bbc9cf] uppercase truncate">{labelClean}</span>
                  <span className={`font-display text-xl font-bold ${isLow ? 'text-[#ffb4ab]' : 'text-[#00fc92]'}`}>
                    {displayVal}%
                  </span>
                  <div className="w-full h-1 bg-[#121318] rounded-full overflow-hidden mt-1">
                    <div
                      className={`h-full ${isLow ? 'bg-[#ffb4ab]' : 'bg-[#00fc92]'}`}
                      style={{ width: `${displayVal}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Explainable AI (XAI) "Why did DeepGuard flag this?" Section */}
      <ExplainableAiCard
        classification={result.classification}
        confidence={result.confidence}
        mediaType={result.media_type}
      />

      {/* Media Inspection Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Specialized Media Inspector */}
        <div className="lg:col-span-2 glass-card rounded-xl p-6 border border-white/10">
          <h3 className="font-display text-lg font-bold text-white mb-4">Forensic Asset Inspection</h3>

          {result.media_type === 'image' && (
            <ElaHeatmap
              imageUrl={mediaUrl}
              explanations={result.explanations}
              elaScore={result.metrics.ela_score}
            />
          )}

          {result.media_type === 'video' && (
            <VideoTimeline
              videoUrl={mediaUrl}
              suspiciousTimestamps={[]}
              duration={10}
            />
          )}

          {result.media_type === 'audio' && (
            <AudioSpectrogram
              audioUrl={mediaUrl}
              zcr={result.metrics.zcr}
              anomalyScore={result.metrics.spectral_anomaly_score}
            />
          )}
        </div>

        {/* Right Column: Explanations & Evidence Log */}
        <div className="glass-card rounded-xl p-6 border border-white/10 flex flex-col gap-4">
          <h3 className="font-mono text-xs font-bold text-white uppercase border-b border-white/10 pb-2">
            Evidence & Explanation Log
          </h3>

          <div className="flex flex-col gap-3 overflow-y-auto max-h-[460px] pr-1">
            {result.explanations.length === 0 ? (
              <p className="font-mono text-xs text-[#bbc9cf]/60">No suspicious anomalies detected in media scan.</p>
            ) : (
              result.explanations.map((exp, idx) => {
                let badgeClass = 'bg-[#00d1ff]/10 text-[#00d1ff] border-[#00d1ff]/30';
                if (exp.severity === 'high' || exp.severity === 'critical') {
                  badgeClass = 'bg-[#ffb4ab]/10 text-[#ffb4ab] border-[#ffb4ab]/30';
                } else if (exp.severity === 'medium') {
                  badgeClass = 'bg-amber-400/10 text-amber-400 border-amber-400/30';
                }

                return (
                  <div key={idx} className="bg-[#1a1b21] p-3.5 rounded border border-white/5 flex flex-col gap-2">
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className={`px-2 py-0.5 rounded border font-bold uppercase ${badgeClass}`}>
                        {exp.severity} severity
                      </span>
                      {exp.timestamp !== null && exp.timestamp !== undefined && (
                        <span className="text-[#00d1ff] font-bold">@ {exp.timestamp}s</span>
                      )}
                    </div>
                    <p className="font-body text-xs text-[#e3e1e9]">{exp.reason}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
