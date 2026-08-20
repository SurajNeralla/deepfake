import React from 'react';

interface MultimodalBreakdownCardProps {
  facialScore?: number;
  audioScore?: number;
  temporalScore?: number;
  lipSyncScore?: number;
  metadataScore?: number;
}

export const MultimodalBreakdownCard: React.FC<MultimodalBreakdownCardProps> = ({
  facialScore = 0.85,
  audioScore = 0.72,
  temporalScore = 0.91,
  lipSyncScore = 0.78,
  metadataScore = 0.34
}) => {
  const getScoreColor = (val: number) => {
    if (val > 0.75) return 'bg-red-500 text-red-400 border-red-500/40';
    if (val > 0.45) return 'bg-amber-500 text-amber-400 border-amber-500/40';
    return 'bg-emerald-500 text-emerald-400 border-emerald-500/40';
  };

  const items = [
    { label: 'Facial Swap / Artifacts', score: facialScore },
    { label: 'Audio Voice Synthesis', score: audioScore },
    { label: 'Temporal Coherence', score: temporalScore },
    { label: 'Lip-Sync Misalignment', score: lipSyncScore },
    { label: 'Metadata Evidence Risk', score: metadataScore },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl text-white">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
          <span>🧠</span> Multimodal AI Evidence Engine
        </h3>
        <span className="text-xs text-slate-400 font-mono">Video + Face + Audio + Lip Sync</span>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => {
          const pct = Math.round(item.score * 100);
          return (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">{item.label}</span>
                <span className={`font-mono font-bold ${getScoreColor(item.score).split(' ')[1]}`}>
                  {pct}% Risk
                </span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getScoreColor(item.score).split(' ')[0]}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
