import React, { useState } from 'react';
import { ElaComparisonSlider } from '../components/ElaComparisonSlider';
import { MultimodalBreakdownCard } from '../components/MultimodalBreakdownCard';
import { MetadataInspectorCard } from '../components/MetadataInspectorCard';
import { ChainOfCustodyModal, ChainOfCustodyData } from '../components/ChainOfCustodyModal';

export const ForensicWorkspace: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(4); // 0: Upload, 1: Preprocessing, 2: Detection, 3: Evidence, 4: Investigation, 5: Report
  const [activeTimestamp, setActiveTimestamp] = useState<number | null>(4.2);
  const [isCustodyOpen, setIsCustodyOpen] = useState<boolean>(false);

  // Sample active analysis data
  const sampleCustodyData: ChainOfCustodyData = {
    analysis_id: "dg_audit_98412a7f",
    sha256_hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    original_filename: "suspect_interview_clip.mp4",
    media_type: "video",
    file_size: 14857600,
    verification_status: "CRYPTOGRAPHICALLY_VERIFIED",
    custody_timeline: [
      { step: "1. Media Ingestion & Hashing", timestamp: "2026-08-20 16:10:00 UTC", details: "File 'suspect_interview_clip.mp4' received. SHA-256 Checksum generated: e3b0c44298fc1c14..." },
      { step: "2. Preprocessing & Integrity Verification", timestamp: "2026-08-20 16:10:01 UTC", details: "Verified MIME format (VIDEO), size 14.17 MB. Sanitized file stream." },
      { step: "3. Feature Extraction & Forensic Pipeline", timestamp: "2026-08-20 16:10:03 UTC", details: "Ran spatial ELA residual scan, FFT spectral frequency distribution, and face/audio feature extraction." },
      { step: "4. Multimodal Ensemble Inference", timestamp: "2026-08-20 16:10:05 UTC", details: "Multimodal Neural Detector output: Classification=LIKELY FAKE, Confidence=87.4%." },
      { step: "5. Evidence Logging & Report Seal", timestamp: "2026-08-20 16:10:06 UTC", details: "Logged audit trail. Digital Certificate generated with cryptographic verification ID: dg_audit_98412a7f" }
    ]
  };

  const steps = [
    { num: 1, label: 'Upload' },
    { num: 2, label: 'Preprocessing' },
    { num: 3, label: 'Detection' },
    { num: 4, label: 'Evidence' },
    { num: 5, label: 'Investigation' },
    { num: 6, label: 'Report' }
  ];

  const timelineEvents = [
    { time: 4.2, label: 'Lip-Sync Misalignment', severity: 'high' },
    { time: 12.8, label: 'Facial Boundary Blending', severity: 'critical' },
    { time: 18.4, label: 'Acoustic Voice Pitch Artifact', severity: 'medium' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6">
      {/* Header & Workspace Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 rounded-full font-mono text-xs font-bold">
              DEFENSIVE SUITE v3.2
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              DEEPGUARD FORENSIC WORKSPACE
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Chain of Custody ID: <span className="text-cyan-400">dg_audit_98412a7f</span> • Target File: <span className="text-slate-200">suspect_interview_clip.mp4</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCustodyOpen(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-400 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg"
          >
            <span>🛡️</span> Chain of Custody Log
          </button>
          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-lg shadow-cyan-950/50"
          >
            Export Forensic PDF Report 📄
          </a>
        </div>
      </div>

      {/* Forensic Lifecycle Stepper */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {steps.map((s, idx) => {
            const isDone = idx <= activeStep;
            const isCurrent = idx === activeStep;
            return (
              <button
                key={s.num}
                onClick={() => setActiveStep(idx)}
                className={`flex items-center gap-2 p-2.5 rounded-lg font-mono text-xs transition-all ${
                  isCurrent
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 font-bold'
                    : isDone
                    ? 'bg-slate-950/80 text-emerald-400 border border-slate-800'
                    : 'bg-slate-950/40 text-slate-500 border border-slate-900'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  isCurrent ? 'bg-cyan-500 text-slate-950 font-bold' : isDone ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                }`}>
                  {s.num}
                </span>
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Media Viewer (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <span>📹</span> MEDIA FORENSIC VIEWER
              </h2>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded border border-cyan-800">
                1080p • 30 FPS • H.264 / AAC
              </span>
            </div>

            {/* Video / Interactive Slider Viewer */}
            <ElaComparisonSlider
              originalImage="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80"
              elaImage="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80"
              gradCamImage="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80"
            />
          </div>

          {/* Metadata Card */}
          <MetadataInspectorCard
            metadata={{
              camera_make: "Apple",
              camera_model: "iPhone 14 Pro",
              software: "Generative AI (Stable Diffusion v2.1)",
              date_taken: "2026-08-19 14:22:10 UTC",
              resolution: "1920x1080",
              color_space: "sRGB",
              c2pa_provenance: "Unsigned / Missing digital C2PA manifest",
              suspicious_tags: [
                "Generative AI Software signature detected: 'Stable Diffusion'",
                "EXIF timestamp modified post-encoding"
              ]
            }}
          />
        </div>

        {/* Right Column: AI Evidence Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Classification Result Gauge Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl text-center space-y-3">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Ensemble Detection Outcome</span>
            <div className="inline-block px-4 py-1.5 rounded-full text-sm font-bold bg-red-500/20 text-red-400 border border-red-500/40">
              🚨 CLASSIFICATION: LIKELY FAKE
            </div>
            <div className="text-4xl font-extrabold text-white font-mono">
              87.4% <span className="text-xs text-slate-400 font-sans font-normal">Synthetic Confidence</span>
            </div>
            <p className="text-xs text-slate-400">
              High statistical anomaly detected in facial boundary blending and lip-sync speech alignment.
            </p>
          </div>

          {/* Multimodal AI Evidence Card */}
          <MultimodalBreakdownCard
            facialScore={0.87}
            audioScore={0.72}
            temporalScore={0.91}
            lipSyncScore={0.84}
            metadataScore={0.65}
          />
        </div>
      </div>

      {/* Bottom Timeline Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <span>⏱️</span> FORENSIC TIMELINE & ANOMALY EVENTS
          </h3>
          <span className="text-xs text-slate-400 font-mono">Total Duration: 24.0s</span>
        </div>

        {/* Timeline Bar */}
        <div className="relative w-full bg-slate-950 h-10 rounded-lg border border-slate-800 flex items-center px-4">
          <div className="w-full bg-slate-800 h-1.5 rounded-full relative">
            {timelineEvents.map((ev, idx) => {
              const leftPct = (ev.time / 24.0) * 100;
              const isSelected = activeTimestamp === ev.time;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveTimestamp(ev.time)}
                  className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full transition-all flex items-center justify-center font-mono text-[10px] font-bold shadow-lg ${
                    isSelected
                      ? 'w-7 h-7 bg-amber-400 text-slate-950 border-2 border-white scale-110 z-10'
                      : 'w-5 h-5 bg-red-500 text-white hover:scale-110'
                  }`}
                  style={{ left: `${leftPct}%` }}
                  title={`${ev.time}s: ${ev.label}`}
                >
                  ●
                </button>
              );
            })}
          </div>
        </div>

        {/* Timestamp Event Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
          {timelineEvents.map((ev, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTimestamp(ev.time)}
              className={`p-3 rounded-lg border text-left transition-all ${
                activeTimestamp === ev.time
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-center text-slate-400 text-[10px] mb-1">
                <span>Timestamp: {ev.time}s</span>
                <span className="text-red-400 font-bold">[{ev.severity.toUpperCase()}]</span>
              </div>
              <div>{ev.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Chain of Custody Modal */}
      <ChainOfCustodyModal
        isOpen={isCustodyOpen}
        onClose={() => setIsCustodyOpen(false)}
        data={sampleCustodyData}
      />
    </div>
  );
};
