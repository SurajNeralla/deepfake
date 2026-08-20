import React, { useState, useEffect } from 'react';
import { Explanation } from '../types';

interface ElaHeatmapProps {
  imageUrl: string;
  explanations: Explanation[];
  elaScore?: number;
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80";

export const ElaHeatmap: React.FC<ElaHeatmapProps> = ({ imageUrl, explanations, elaScore }) => {
  const [showElaOverlay, setShowElaOverlay] = useState(false);
  const [showFaceBoxes, setShowFaceBoxes] = useState(true);
  const [currentImg, setCurrentImg] = useState<string>(imageUrl || FALLBACK_IMAGE);

  useEffect(() => {
    if (imageUrl) {
      setCurrentImg(imageUrl);
    }
  }, [imageUrl]);

  const handleImageError = () => {
    if (currentImg !== FALLBACK_IMAGE) {
      setCurrentImg(FALLBACK_IMAGE);
    }
  };

  const regionExplanations = explanations.filter((e) => e.region);

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center justify-between bg-[#1a1b21] px-4 py-2 rounded border border-white/10">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#00d1ff] text-base">visibility</span>
          <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">Spatial Forensic Inspector</span>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer font-mono text-xs text-[#bbc9cf]">
            <input
              type="checkbox"
              checked={showElaOverlay}
              onChange={(e) => setShowElaOverlay(e.target.checked)}
              className="rounded bg-[#121318] border-white/20 text-[#00d1ff] focus:ring-0"
            />
            ELA Diff Heatmap
          </label>

          <label className="flex items-center gap-2 cursor-pointer font-mono text-xs text-[#bbc9cf]">
            <input
              type="checkbox"
              checked={showFaceBoxes}
              onChange={(e) => setShowFaceBoxes(e.target.checked)}
              className="rounded bg-[#121318] border-white/20 text-[#00d1ff] focus:ring-0"
            />
            Face Boxes
          </label>
        </div>
      </div>

      {/* Main Image Viewer Container */}
      <div className="relative aspect-video max-h-[420px] w-full bg-black/80 rounded overflow-hidden border border-white/10 flex items-center justify-center group">
        <img
          src={currentImg}
          onError={handleImageError}
          alt="Forensic Asset preview"
          className={`w-full h-full object-contain transition-all duration-300 ${
            showElaOverlay ? 'filter contrast-150 saturate-200 hue-rotate-180 invert brightness-125' : ''
          }`}
        />

        {/* ELA Heatmap Grid Overlay Effect when checked */}
        {showElaOverlay && (
          <div className="absolute inset-0 bg-gradient-to-tr from-[#7000ff]/30 via-transparent to-[#00d1ff]/20 pointer-events-none mix-blend-color-dodge">
            <div className="scan-line"></div>
          </div>
        )}

        {/* Face Bounding Box Overlays */}
        {showFaceBoxes &&
          regionExplanations.map((exp, idx) => {
            const reg = exp.region;
            if (!reg) return null;
            return (
              <div
                key={idx}
                className="absolute border-2 border-[#00d1ff] bg-[#00d1ff]/10 shadow-[0_0_12px_#00d1ff] transition-all"
                style={{
                  left: `${reg.x}px`,
                  top: `${reg.y}px`,
                  width: `${reg.w}px`,
                  height: `${reg.h}px`,
                }}
              >
                <div className="absolute -top-6 left-0 bg-[#00d1ff] text-[#05060B] font-mono text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                  REGION #{idx + 1}
                </div>
              </div>
            );
          })}
      </div>

      <div className="flex items-center justify-between text-xs font-mono text-[#bbc9cf]">
        <span>Error Level Analysis Scale: {elaScore ? Math.round(elaScore * 100) / 100 : 'Active'}</span>
        <span>Resolution: Normalized Spatial Scan</span>
      </div>
    </div>
  );
};
