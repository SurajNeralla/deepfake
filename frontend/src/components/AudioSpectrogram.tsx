import React from 'react';

interface AudioSpectrogramProps {
  audioUrl: string;
  zcr?: number;
  anomalyScore?: number;
}

export const AudioSpectrogram: React.FC<AudioSpectrogramProps> = ({ audioUrl, zcr, anomalyScore }) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Audio HTML5 Player */}
      <div className="glass-card p-4 rounded border border-white/10 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#00d1ff] text-2xl">graphic_eq</span>
          <div>
            <h4 className="font-mono text-xs font-bold text-white uppercase">Acoustic Signal Inspector</h4>
            <p className="font-body text-xs text-[#bbc9cf]">Spectral Energy & Vocoder Artifact Scan</p>
          </div>
        </div>

        <audio controls src={audioUrl} className="w-full mt-1 accent-[#00d1ff]" />
      </div>

      {/* Mel Spectrogram Plot Mock Visualizer */}
      <div className="glass-card p-4 rounded border border-white/10 flex flex-col gap-2">
        <div className="flex items-center justify-between font-mono text-xs text-[#bbc9cf]">
          <span>STFT Mel-Spectrogram (0 - 8kHz)</span>
          <span>Zero-Crossing Rate: {zcr ?? 0.08}</span>
        </div>

        {/* Cyber Spectrogram Heat Grid Animation */}
        <div className="h-44 w-full bg-[#0d0e13] rounded border border-white/10 relative overflow-hidden flex items-end px-2 py-1 gap-1">
          {Array.from({ length: 48 }).map((_, i) => {
            const hPct = Math.min(100, Math.max(15, Math.sin(i * 0.4) * 45 + 50 + (i % 5) * 8));
            const isAnomaly = anomalyScore && anomalyScore > 0.45 && i > 18 && i < 28;
            const barBg = isAnomaly
              ? 'bg-gradient-to-t from-[#ffb4ab] via-amber-400 to-[#7000ff]'
              : 'bg-gradient-to-t from-[#00d1ff] via-[#00fc92] to-[#7000ff]';

            return (
              <div
                key={i}
                className={`flex-1 rounded-t ${barBg} opacity-80 hover:opacity-100 transition-all duration-300`}
                style={{ height: `${hPct}%` }}
                title={`Frequency Bin #${i + 1}`}
              />
            );
          })}

          <div className="absolute top-2 left-3 font-mono text-[10px] text-[#00d1ff]/70">8.0 kHz</div>
          <div className="absolute bottom-2 left-3 font-mono text-[10px] text-[#00d1ff]/70">0.0 Hz</div>
        </div>

        <div className="flex items-center justify-between font-mono text-[10px] text-[#bbc9cf]/70">
          <span>0s</span>
          <span>Spectrogram Frequency Distribution</span>
          <span>End of File</span>
        </div>
      </div>
    </div>
  );
};
