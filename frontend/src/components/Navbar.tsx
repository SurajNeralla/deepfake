import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { HealthStatus } from '../types';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [health, setHealth] = useState<HealthStatus | null>(null);

  useEffect(() => {
    api.getHealth()
      .then(setHealth)
      .catch(() => setHealth(null));
  }, []);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-[#121318]/85 backdrop-blur-xl border-b border-white/10 shadow-[0_0_15px_rgba(0,209,255,0.15)] transition-all duration-300">
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded bg-[#00d1ff]/10 border border-[#00d1ff]/40 flex items-center justify-center group-hover:shadow-[0_0_12px_#00d1ff] transition-all">
            <span className="material-symbols-outlined text-[#00d1ff] text-xl">shield</span>
          </div>
          <span className="font-display text-xl font-bold text-[#00d1ff] tracking-tighter">DeepGuard</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6 h-full ml-4">
          <Link
            to="/"
            className={`font-mono text-xs uppercase tracking-wider py-1 border-b-2 transition-colors ${
              isActive('/') ? 'text-[#00d1ff] border-[#00d1ff]' : 'text-[#bbc9cf] border-transparent hover:text-[#00d1ff]'
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/workspace"
            className={`font-mono text-xs uppercase tracking-wider py-1 border-b-2 transition-colors ${
              isActive('/workspace') ? 'text-[#00d1ff] border-[#00d1ff]' : 'text-[#bbc9cf] border-transparent hover:text-[#00d1ff]'
            }`}
          >
            Workspace
          </Link>
          <Link
            to="/models"
            className={`font-mono text-xs uppercase tracking-wider py-1 border-b-2 transition-colors ${
              isActive('/models') ? 'text-[#00d1ff] border-[#00d1ff]' : 'text-[#bbc9cf] border-transparent hover:text-[#00d1ff]'
            }`}
          >
            Model Center
          </Link>
          <Link
            to="/analyze"
            className={`font-mono text-xs uppercase tracking-wider py-1 border-b-2 transition-colors ${
              isActive('/analyze') ? 'text-[#00d1ff] border-[#00d1ff]' : 'text-[#bbc9cf] border-transparent hover:text-[#00d1ff]'
            }`}
          >
            Analyze
          </Link>
          <Link
            to="/history"
            className={`font-mono text-xs uppercase tracking-wider py-1 border-b-2 transition-colors ${
              isActive('/history') ? 'text-[#00d1ff] border-[#00d1ff]' : 'text-[#bbc9cf] border-transparent hover:text-[#00d1ff]'
            }`}
          >
            History
          </Link>
          <Link
            to="/about"
            className={`font-mono text-xs uppercase tracking-wider py-1 border-b-2 transition-colors ${
              isActive('/about') ? 'text-[#00d1ff] border-[#00d1ff]' : 'text-[#bbc9cf] border-transparent hover:text-[#00d1ff]'
            }`}
          >
            About
          </Link>
        </div>
      </div>

      {/* Engine Status Indicator */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-[#1e1f25] px-3 py-1.5 rounded border border-white/10 font-mono text-xs">
          <span className={`w-2 h-2 rounded-full ${health?.status === 'healthy' ? 'bg-[#00fc92] shadow-[0_0_8px_#00fc92]' : 'bg-amber-400'}`}></span>
          <span className="text-[#bbc9cf] hidden sm:inline">ENGINE v2.4</span>
          <span className="text-white font-bold">{health?.gpu_available ? 'CUDA GPU' : 'CPU MODE'}</span>
        </div>

        <Link
          to="/analyze"
          className="btn-primary px-4 py-2 rounded text-xs font-mono font-bold uppercase tracking-wider hidden sm:flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-base">analytics</span>
          Scan Media
        </Link>
      </div>
    </nav>
  );
};
