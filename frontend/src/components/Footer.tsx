import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#0d0e13] border-t border-white/10 py-8 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-[#00d1ff]/10 border border-[#00d1ff]/40 flex items-center justify-center">
            <span className="material-symbols-outlined text-[#00d1ff] text-sm">shield</span>
          </div>
          <span className="font-display text-base font-bold text-white">DeepGuard AI</span>
          <span className="font-mono text-xs text-[#bbc9cf]">v2.4.0</span>
        </div>

        <div className="flex items-center gap-6 font-mono text-xs text-[#bbc9cf]">
          <Link to="/" className="hover:text-[#00d1ff] transition-colors">Dashboard</Link>
          <Link to="/analyze" className="hover:text-[#00d1ff] transition-colors">Analyze</Link>
          <Link to="/history" className="hover:text-[#00d1ff] transition-colors">History</Link>
          <Link to="/about" className="hover:text-[#00d1ff] transition-colors">Methodology & Ethics</Link>
        </div>

        <p className="font-mono text-xs text-[#bbc9cf]/60">
          Defensive Media Forensics • Strictly Non-Generative
        </p>
      </div>
    </footer>
  );
};
