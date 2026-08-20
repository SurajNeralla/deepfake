import React from 'react';

export interface MetadataInfo {
  camera_make?: string;
  camera_model?: string;
  software?: string;
  date_taken?: string;
  resolution?: string;
  color_space?: string;
  c2pa_provenance?: string;
  suspicious_tags?: string[];
  exif_present?: boolean;
}

interface MetadataInspectorCardProps {
  metadata: MetadataInfo | null;
}

export const MetadataInspectorCard: React.FC<MetadataInspectorCardProps> = ({ metadata }) => {
  if (!metadata) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl text-white">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
          <span>📋</span> Media Metadata & Provenance Inspector
        </h3>
        <span className="text-xs px-2.5 py-1 rounded-full font-mono bg-cyan-950 text-cyan-400 border border-cyan-800">
          Distinct from AI Neural Evidence
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
          <div className="text-slate-500 font-sans font-bold uppercase text-[10px]">Device & Capture Info</div>
          <div className="flex justify-between">
            <span className="text-slate-400">Camera Make:</span>
            <span className="text-slate-200 font-semibold">{metadata.camera_make || 'Unknown'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Camera Model:</span>
            <span className="text-slate-200 font-semibold">{metadata.camera_model || 'Unknown'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Creation Date:</span>
            <span className="text-slate-200">{metadata.date_taken || 'N/A'}</span>
          </div>
        </div>

        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
          <div className="text-slate-500 font-sans font-bold uppercase text-[10px]">Encoding & Format</div>
          <div className="flex justify-between">
            <span className="text-slate-400">Resolution:</span>
            <span className="text-cyan-300">{metadata.resolution || 'Native'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Color Profile:</span>
            <span className="text-slate-200">{metadata.color_space || 'sRGB'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Software Tag:</span>
            <span className="text-amber-400 font-semibold">{metadata.software || 'None'}</span>
          </div>
        </div>
      </div>

      {/* C2PA & Generative Software Tags */}
      <div className="mt-4 pt-3 border-t border-slate-800">
        <div className="text-xs text-slate-400 mb-2 flex items-center justify-between">
          <span className="font-bold text-slate-300">Content Credentials (C2PA) & Edit Traces</span>
          <span className="text-[10px] text-slate-500">{metadata.c2pa_provenance}</span>
        </div>

        {metadata.suspicious_tags && metadata.suspicious_tags.length > 0 ? (
          <div className="space-y-1">
            {metadata.suspicious_tags.map((tag, i) => (
              <div key={i} className="text-xs text-amber-400 bg-amber-950/40 border border-amber-800/50 px-3 py-1.5 rounded flex items-center gap-2">
                <span>⚠️</span> {tag}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-800/40 px-3 py-1.5 rounded">
            ✓ No suspicious generative software metadata signatures flagged in EXIF header.
          </div>
        )}
      </div>
    </div>
  );
};
