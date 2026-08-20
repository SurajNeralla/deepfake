import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { HistoryItem } from '../types';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [recentItems, setRecentItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getHistory(undefined, undefined, 5, 0)
      .then((data) => {
        setRecentItems(data.items);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center pt-10 min-h-[65vh] text-center overflow-hidden cyber-grid rounded-xl px-6">
        {/* Background Glowing Ambient Light */}
        <div className="absolute inset-0 pointer-events-none flex justify-center items-center opacity-25">
          <div className="w-[70vw] h-[70vw] max-w-[650px] max-h-[650px] rounded-full bg-[#00d1ff] blur-[140px]" />
        </div>

        <div className="z-10 max-w-4xl mx-auto flex flex-col items-center gap-6">
          <div className="inline-flex items-center gap-2 bg-[#1e1f25] border border-[#00d1ff]/40 px-3 py-1 rounded-full font-mono text-xs text-[#00d1ff]">
            <span className="w-2 h-2 rounded-full bg-[#00fc92] animate-pulse"></span>
            DEFENSIVE MEDIA FORENSICS PLATFORM
          </div>

          <h1 className="font-display font-bold text-4xl sm:text-6xl md:text-7xl text-white tracking-tight leading-tight">
            Detect What’s <span className="text-[#00d1ff]">Real.</span>
          </h1>

          <p className="font-body text-base sm:text-lg text-[#bbc9cf] max-w-2xl">
            Analyze images, video streams, and acoustic signals using multi-signal deep learning and spectral forensics.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <button
              onClick={() => navigate('/analyze')}
              className="btn-primary px-8 py-4 rounded font-mono text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">analytics</span>
              Analyze Media Asset
            </button>
            <Link
              to="/about"
              className="btn-secondary px-8 py-4 rounded font-mono text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2"
            >
              Learn Methodology
            </Link>
          </div>
        </div>

        {/* Abstract AI Scanning Visualization */}
        <div className="mt-12 w-full max-w-5xl h-52 glass-panel rounded-xl flex items-center justify-center relative overflow-hidden z-10 border-t-[#00d1ff]/40">
          <div className="text-[#bbc9cf] flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-5xl animate-pulse text-[#00d1ff]">face</span>
            <span className="font-mono text-xs text-[#00d1ff]/80 font-bold tracking-widest uppercase">
              SCANNING ENGINE INITIATED • READY FOR INGESTION
            </span>
          </div>

          {/* Scanner Animated Line */}
          <div className="scan-line" />
        </div>
      </section>

      {/* Feature Capabilities Bento Grid */}
      <section className="max-w-7xl mx-auto w-full px-6">
        <h2 className="font-display text-2xl font-bold text-white mb-6">Forensic Analysis Engines</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Image Engine */}
          <div className="glass-panel rounded-xl p-6 flex flex-col gap-4 glow-hover transition-all group">
            <div className="w-12 h-12 rounded-full bg-[#1e1f25] flex items-center justify-center border border-white/10 group-hover:border-[#00d1ff]/60 transition-colors">
              <span className="material-symbols-outlined text-[#00d1ff]">image</span>
            </div>
            <h3 className="font-display text-xl font-bold text-white">IMAGE FORENSICS</h3>
            <p className="font-body text-sm text-[#bbc9cf] flex-grow">
              Pixel-level Error Level Analysis (ELA), Fourier frequency grid evaluation, and facial boundary smoothness metrics.
            </p>
            <Link to="/analyze?type=image" className="pt-4 border-t border-white/10 flex justify-between items-center text-[#00d1ff] font-mono text-xs uppercase font-bold">
              <span>Run Image Scan</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          {/* Video Engine */}
          <div className="glass-panel rounded-xl p-6 flex flex-col gap-4 glow-hover transition-all group">
            <div className="w-12 h-12 rounded-full bg-[#1e1f25] flex items-center justify-center border border-white/10 group-hover:border-[#00d1ff]/60 transition-colors">
              <span className="material-symbols-outlined text-[#00d1ff]">videocam</span>
            </div>
            <h3 className="font-display text-xl font-bold text-white">VIDEO FORENSICS</h3>
            <p className="font-body text-sm text-[#bbc9cf] flex-grow">
              Frame-by-frame temporal sampling, inter-frame jitter variance, face stability tracking, and suspicious timestamp mapping.
            </p>
            <Link to="/analyze?type=video" className="pt-4 border-t border-white/10 flex justify-between items-center text-[#00d1ff] font-mono text-xs uppercase font-bold">
              <span>Run Video Scan</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          {/* Audio Engine */}
          <div className="glass-panel rounded-xl p-6 flex flex-col gap-4 glow-hover transition-all group">
            <div className="w-12 h-12 rounded-full bg-[#1e1f25] flex items-center justify-center border border-white/10 group-hover:border-[#00d1ff]/60 transition-colors">
              <span className="material-symbols-outlined text-[#00d1ff]">mic</span>
            </div>
            <h3 className="font-display text-xl font-bold text-white">AUDIO FORENSICS</h3>
            <p className="font-body text-sm text-[#bbc9cf] flex-grow">
              STFT Mel-spectrogram profiling, zero-crossing rate calculation, and high-frequency vocoder phase discontinuity detection.
            </p>
            <Link to="/analyze?type=audio" className="pt-4 border-t border-white/10 flex justify-between items-center text-[#00d1ff] font-mono text-xs uppercase font-bold">
              <span>Run Audio Scan</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Inspections Table */}
      <section className="max-w-7xl mx-auto w-full px-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-display text-2xl font-bold text-white">Recent Audit History</h2>
          <Link to="/history" className="font-mono text-xs text-[#00d1ff] hover:underline uppercase font-bold">
            View All History →
          </Link>
        </div>

        <div className="glass-card rounded-xl border border-white/10 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center font-mono text-xs text-[#bbc9cf]">Loading recent forensic records...</div>
          ) : recentItems.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center gap-3">
              <span className="material-symbols-outlined text-4xl text-[#bbc9cf]/40">find_in_page</span>
              <p className="font-mono text-xs text-[#bbc9cf]">No forensic audits executed yet.</p>
              <Link to="/analyze" className="btn-primary px-4 py-2 rounded text-xs font-mono font-bold uppercase mt-2">
                Scan Your First File
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-body text-sm">
                <thead className="bg-[#1a1b21] font-mono text-xs text-[#bbc9cf] uppercase border-b border-white/10">
                  <tr>
                    <th className="p-4">File Name</th>
                    <th className="p-4">Media Type</th>
                    <th className="p-4">Classification</th>
                    <th className="p-4">Confidence</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentItems.map((item) => {
                    const badgeBg =
                      item.classification === 'REAL' || item.classification === 'LIKELY REAL'
                        ? 'bg-[#00fc92]/10 text-[#00fc92] border-[#00fc92]/30'
                        : 'bg-[#ffb4ab]/10 text-[#ffb4ab] border-[#ffb4ab]/30';

                    return (
                      <tr key={item.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 font-mono text-xs font-bold text-white max-w-[200px] truncate">
                          {item.original_filename}
                        </td>
                        <td className="p-4 font-mono text-xs text-[#bbc9cf] uppercase">{item.media_type}</td>
                        <td className="p-4">
                          <span className={`inline-block px-2.5 py-1 rounded border font-mono text-[10px] font-bold uppercase ${badgeBg}`}>
                            {item.classification}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-xs font-bold text-white">
                          {Math.round(item.confidence * 100)}%
                        </td>
                        <td className="p-4 font-mono text-xs text-[#bbc9cf]">{item.created_at}</td>
                        <td className="p-4 text-right">
                          <Link
                            to={`/results/${item.id}`}
                            className="font-mono text-xs text-[#00d1ff] hover:underline font-bold uppercase"
                          >
                            View Result
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
