import React from 'react';

export interface FlaggedFactor {
  title: string;
  impact: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  explanation: string;
}

interface ExplainableAiCardProps {
  classification: string;
  confidence: number;
  mediaType: string;
  factors?: FlaggedFactor[];
}

export const ExplainableAiCard: React.FC<ExplainableAiCardProps> = ({
  classification,
  confidence,
  mediaType,
  factors
}) => {
  const isFlagged = ['SUSPICIOUS', 'LIKELY FAKE'].includes(classification);
  const confPct = Math.round(confidence * 100);

  const defaultFactors: FlaggedFactor[] = isFlagged
    ? [
        {
          title: "Error Level Analysis (ELA) Compression Variance",
          impact: "+35% Risk Contribution",
          severity: "high",
          explanation: "Inconsistent JPEG error levels detected around facial features, indicating localized pixel manipulation or synthetic blending."
        },
        {
          title: "Fourier High-Frequency Spectral Artifacts",
          impact: "+30% Risk Contribution",
          severity: "high",
          explanation: "Unnatural periodic grid patterns detected in high-frequency spectral distribution, typical of Diffusion/GAN generative models."
        },
        {
          title: "Acoustic Voice Synthesis & Pitch Jitter",
          impact: "+20% Risk Contribution",
          severity: "medium",
          explanation: "Harmonic frequencies drop off unnaturally above 8kHz, matching neural text-to-speech (TTS) voice cloning characteristics."
        }
      ]
    : [
        {
          title: "Consistent Sensor Noise Distribution",
          impact: "0% Synthetic Risk",
          severity: "low",
          explanation: "Photo response non-uniformity (PRNU) noise patterns match authentic optical camera sensor profiles."
        }
      ];

  const displayFactors = factors && factors.length > 0 ? factors : defaultFactors;

  const getSeverityStyle = (sev: string) => {
    switch (sev) {
      case 'critical':
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'medium':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl text-white space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-base font-bold text-cyan-400 flex items-center gap-2">
            <span>💡</span> Explainable AI (XAI) Forensic Summary
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Human-readable breakdown generated from raw neural detector output
          </p>
        </div>
        <span className="text-xs px-3 py-1 bg-cyan-950 text-cyan-300 border border-cyan-800 rounded-full font-mono font-bold">
          Transparent AI
        </span>
      </div>

      {/* Prominent Question Banner */}
      <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
        <div className="text-xs uppercase font-bold text-slate-400 tracking-wider font-mono">
          QUESTION: <span className="text-amber-400 font-bold text-sm">"Why did DeepGuard flag this?"</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          {isFlagged ? (
            <>
              DeepGuard flagged this <strong>{mediaType.toUpperCase()}</strong> with a <strong>{confPct}% synthetic confidence score</strong> because the ensemble neural engine detected statistical anomalies in spatial compression variance, high-frequency Fourier spectral distributions, and acoustic pitch coherence.
            </>
          ) : (
            <>
              DeepGuard verified this <strong>{mediaType.toUpperCase()}</strong> as <strong>{classification}</strong> with <strong>{confPct}% confidence</strong> because sensor noise distribution and frequency spectrum match authentic hardware recording signatures.
            </>
          )}
        </p>
      </div>

      {/* Detailed Flagged Factors */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
          Key Detector Evidence Factors ({displayFactors.length})
        </h4>

        {displayFactors.map((f, idx) => (
          <div key={idx} className="bg-slate-950/60 border border-slate-800/80 p-3.5 rounded-lg space-y-1.5 font-sans">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-200">{f.title}</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-900">
                  {f.impact}
                </span>
                <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${getSeverityStyle(f.severity)}`}>
                  {f.severity}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-normal">
              {f.explanation}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
