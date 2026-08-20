import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Sidebar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-[#121318]/90 backdrop-blur-md border-r border-white/5 hidden md:flex flex-col py-6 z-40">
      <div className="px-6 mb-6">
        <h2 className="font-display text-lg font-bold text-[#00d1ff]">DeepGuard AI</h2>
        <p className="font-mono text-xs text-[#bbc9cf]">Media Forensics Suite</p>
      </div>

      <nav className="flex-1 flex flex-col gap-1">
        <Link
          to="/"
          className={`flex items-center gap-3 font-mono text-xs uppercase px-6 py-3 transition-transform duration-200 ${
            isActive('/')
              ? 'bg-gradient-to-r from-[#7000ff]/20 to-transparent text-[#00d1ff] border-l-4 border-[#00d1ff]'
              : 'text-[#bbc9cf] hover:text-white hover:bg-white/5 hover:translate-x-1'
          }`}
        >
          <span className="material-symbols-outlined text-lg">dashboard</span>
          Dashboard
        </Link>

        <Link
          to="/analyze"
          className={`flex items-center gap-3 font-mono text-xs uppercase px-6 py-3 transition-transform duration-200 ${
            isActive('/analyze')
              ? 'bg-gradient-to-r from-[#7000ff]/20 to-transparent text-[#00d1ff] border-l-4 border-[#00d1ff]'
              : 'text-[#bbc9cf] hover:text-white hover:bg-white/5 hover:translate-x-1'
          }`}
        >
          <span className="material-symbols-outlined text-lg">analytics</span>
          Analyze
        </Link>

        <Link
          to="/history"
          className={`flex items-center gap-3 font-mono text-xs uppercase px-6 py-3 transition-transform duration-200 ${
            isActive('/history')
              ? 'bg-gradient-to-r from-[#7000ff]/20 to-transparent text-[#00d1ff] border-l-4 border-[#00d1ff]'
              : 'text-[#bbc9cf] hover:text-white hover:bg-white/5 hover:translate-x-1'
          }`}
        >
          <span className="material-symbols-outlined text-lg">history</span>
          History
        </Link>

        <Link
          to="/about"
          className={`flex items-center gap-3 font-mono text-xs uppercase px-6 py-3 transition-transform duration-200 ${
            isActive('/about')
              ? 'bg-gradient-to-r from-[#7000ff]/20 to-transparent text-[#00d1ff] border-l-4 border-[#00d1ff]'
              : 'text-[#bbc9cf] hover:text-white hover:bg-white/5 hover:translate-x-1'
          }`}
        >
          <span className="material-symbols-outlined text-lg">info</span>
          About & Specs
        </Link>
      </nav>

      <div className="px-6 mt-auto">
        <div className="glass-card p-4 rounded text-center border border-white/10">
          <span className="material-symbols-outlined text-2xl text-[#00d1ff] mb-1">lock</span>
          <p className="font-mono text-[10px] text-[#bbc9cf] uppercase font-bold">Defensive Security</p>
          <p className="font-body text-[11px] text-[#bbc9cf]/80 mt-1">Detection & Analysis Only</p>
        </div>
      </div>
    </aside>
  );
};
