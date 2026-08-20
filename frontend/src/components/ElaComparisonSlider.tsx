import React, { useState } from 'react';

interface ElaComparisonSliderProps {
  originalImage: string;
  elaImage: string;
  gradCamImage?: string;
}

export const ElaComparisonSlider: React.FC<ElaComparisonSliderProps> = ({
  originalImage,
  elaImage,
  gradCamImage
}) => {
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [activeView, setActiveView] = useState<'ela' | 'gradcam'>('ela');

  const rightImage = activeView === 'gradcam' && gradCamImage ? gradCamImage : elaImage;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl text-white">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
          <span>🔍</span> Interactive Multi-Layer Forensic Slider
        </h3>
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setActiveView('ela')}
            className={`px-3 py-1 rounded-md transition-all font-medium ${
              activeView === 'ela' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            ELA Error Residual
          </button>
          {gradCamImage && (
            <button
              onClick={() => setActiveView('gradcam')}
              className={`px-3 py-1 rounded-md transition-all font-medium ${
                activeView === 'gradcam' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Grad-CAM Heatmap
            </button>
          )}
        </div>
      </div>

      <div className="relative w-full h-[360px] rounded-lg overflow-hidden select-none bg-slate-950 border border-slate-800">
        {/* Right Layer (ELA / Grad-CAM Overlay) */}
        <img
          src={rightImage}
          alt="Forensic Overlay"
          className="absolute top-0 left-0 w-full h-full object-contain"
        />

        {/* Left Layer (Original Image clipped by slider position) */}
        <div
          className="absolute top-0 left-0 h-full overflow-hidden"
          style={{ width: `${sliderPos}%` }}
        >
          <img
            src={originalImage}
            alt="Original Upload"
            className="absolute top-0 left-0 w-full h-full object-contain"
            style={{ width: '100%', maxWidth: 'none' }}
          />
        </div>

        {/* Split Divider Line */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-cyan-400 cursor-ew-resize z-10 shadow-[0_0_12px_#00d1ff]"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -left-3 w-7 h-7 bg-cyan-500 rounded-full flex items-center justify-center text-slate-950 font-bold text-xs shadow-lg border border-white">
            ↔
          </div>
        </div>

        {/* Dynamic Range Slider Input */}
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPos}
          onChange={(e) => setSliderPos(Number(e.target.value))}
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-ew-resize z-20"
        />

        {/* Image Labels */}
        <span className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur border border-slate-700 text-slate-300 text-xs px-2.5 py-1 rounded font-mono z-10">
          Original Input ({sliderPos}%)
        </span>
        <span className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur border border-slate-700 text-cyan-400 text-xs px-2.5 py-1 rounded font-mono z-10">
          {activeView === 'ela' ? 'ELA Residual Difference' : 'Grad-CAM Attention Overlay'}
        </span>
      </div>
    </div>
  );
};
