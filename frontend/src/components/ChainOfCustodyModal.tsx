import React from 'react';

export interface ChainOfCustodyData {
  analysis_id: str;
  sha256_hash: string;
  original_filename: string;
  media_type: string;
  file_size: number;
  verification_status: string;
  custody_timeline: Array<{
    step: string;
    timestamp: string;
    details: string;
  }>;
}

interface ChainOfCustodyModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ChainOfCustodyData | null;
}

export const ChainOfCustodyModal: React.FC<ChainOfCustodyModalProps> = ({
  isOpen,
  onClose,
  data
}) => {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl max-w-2xl w-full p-6 shadow-2xl shadow-cyan-950/50 text-white relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl font-bold w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800"
        >
          ✕
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 font-bold text-lg">
            🛡️
          </div>
          <div>
            <h2 className="text-lg font-bold text-cyan-400">Media Chain of Custody & Hash Audit</h2>
            <p className="text-xs text-slate-400">Cryptographic audit log tracing media evidence lifecycle</p>
          </div>
        </div>

        {/* SHA-256 Hash Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 mb-5 font-mono">
          <div className="text-xs text-slate-400 uppercase tracking-wider mb-1 font-semibold">
            SHA-256 Checksum (Cryptographic Evidence Hash)
          </div>
          <div className="text-sm text-cyan-300 break-all bg-slate-900 px-3 py-2 rounded border border-slate-800 select-all">
            {data.sha256_hash}
          </div>
          <div className="flex justify-between items-center text-xs text-slate-500 mt-2">
            <span>Status: <strong className="text-emerald-400">{data.verification_status}</strong></span>
            <span>File ID: {data.analysis_id}</span>
          </div>
        </div>

        {/* Audit Timeline */}
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Chronological Audit Trail
        </h3>

        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
          {data.custody_timeline.map((item, idx) => (
            <div key={idx} className="flex gap-3 text-xs border-l-2 border-cyan-500/40 pl-3 py-1">
              <div>
                <div className="font-bold text-slate-200">{item.step}</div>
                <div className="text-slate-400 mt-0.5">{item.details}</div>
                <div className="text-[10px] text-slate-500 mt-1 font-mono">{item.timestamp}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-all"
          >
            Close Audit Log
          </button>
        </div>
      </div>
    </div>
  );
};
