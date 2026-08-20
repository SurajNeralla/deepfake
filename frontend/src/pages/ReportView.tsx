import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { AnalysisResult } from '../types';

export const ReportView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.getAnalysis(id)
      .then((data) => {
        setReport(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading || !report) {
    return (
      <div className="max-w-4xl mx-auto py-24 text-center font-mono text-xs text-[#bbc9cf]">
        Loading forensic report document...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col gap-6">
      {/* Top Bar Controls */}
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <Link to={`/results/${report.analysis_id}`} className="font-mono text-xs text-[#00d1ff] hover:underline uppercase font-bold">
          ← Back to Analysis Results
        </Link>

        <div className="flex items-center gap-3">
          <a
            href={api.getReportExportUrl(report.analysis_id, 'pdf')}
            target="_blank"
            rel="noreferrer"
            className="btn-primary px-4 py-2 rounded font-mono text-xs uppercase font-bold flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">download</span>
            Download PDF
          </a>
          <button
            onClick={() => window.print()}
            className="btn-secondary px-4 py-2 rounded font-mono text-xs uppercase font-bold flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">print</span>
            Print Report
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="glass-card p-8 rounded-xl border border-white/10 flex flex-col gap-6 text-[#e3e1e9]">
        {/* Certificate Title */}
        <div className="flex justify-between items-start border-b border-[#00d1ff]/30 pb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#00d1ff]">DEEPGUARD FORENSIC REPORT</h1>
            <p className="font-mono text-xs text-[#bbc9cf] mt-1">Official Forensic Inspection Certificate • ID: {report.analysis_id}</p>
          </div>
          <div className="text-right font-mono text-xs text-[#bbc9cf]">
            <p>Executed: {report.created_at}</p>
            <p>Engine: {report.model_name} v{report.model_version}</p>
          </div>
        </div>

        {/* Media Spec Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs bg-[#1a1b21] p-4 rounded border border-white/5">
          <div>
            <span className="text-[#bbc9cf] block text-[10px] uppercase">File Name</span>
            <span className="font-bold text-white truncate block">{report.original_filename}</span>
          </div>
          <div>
            <span className="text-[#bbc9cf] block text-[10px] uppercase">Media Type</span>
            <span className="font-bold text-white uppercase">{report.media_type}</span>
          </div>
          <div>
            <span className="text-[#bbc9cf] block text-[10px] uppercase">File Size</span>
            <span className="font-bold text-white">{(report.file_size / (1024 * 1024)).toFixed(2)} MB</span>
          </div>
          <div>
            <span className="text-[#bbc9cf] block text-[10px] uppercase">Execution Mode</span>
            <span className="font-bold text-[#00d1ff]">{report.is_demo_fallback ? 'Demo Heuristic' : 'Production AI'}</span>
          </div>
        </div>

        {/* Classification Summary */}
        <div className="border border-[#00d1ff] bg-[#00d1ff]/10 p-6 rounded text-center flex flex-col items-center gap-2">
          <span className="font-mono text-xs text-[#00d1ff] uppercase tracking-widest font-bold">CLASSIFICATION AUDIT VERDICT</span>
          <h2 className="font-display text-3xl font-bold text-white uppercase">{report.classification}</h2>
          <p className="font-mono text-sm text-[#00fc92] font-bold">
            CONFIDENCE SCORE: {Math.round(report.confidence * 100)}%
          </p>
        </div>

        {/* Metrics Grid */}
        <div>
          <h3 className="font-mono text-xs font-bold text-white uppercase mb-3">Forensic Metric Indicators</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
            {Object.entries(report.metrics).map(([k, v]) => (
              <div key={k} className="bg-[#1a1b21] p-3 rounded border border-white/5 flex justify-between">
                <span className="text-[#bbc9cf] uppercase">{k.replace(/_/g, ' ')}:</span>
                <span className="text-white font-bold">{v !== undefined ? Math.round(v * 100) : 0}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Evidence Logs */}
        <div>
          <h3 className="font-mono text-xs font-bold text-white uppercase mb-3">Evidence Log & Anomalies</h3>
          <div className="flex flex-col gap-2">
            {report.explanations.map((e, idx) => (
              <div key={idx} className="bg-[#1a1b21] p-3 rounded text-xs font-body flex items-start gap-2">
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#00d1ff]/10 text-[#00d1ff] border border-[#00d1ff]/30 uppercase">
                  {e.severity}
                </span>
                <span className="text-[#e3e1e9]">{e.reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer Notice */}
        <div className="border-t border-white/10 pt-4 font-mono text-[11px] text-[#bbc9cf]/70 leading-relaxed">
          <p>
            <strong>LEGAL & PRIVACY NOTICE:</strong> DeepGuard is a defensive media-forensics platform. All confidence metrics represent statistical signal evaluations.
          </p>
        </div>
      </div>
    </div>
  );
};
