import React from 'react';
import { ToastMessage } from '../hooks/useToast';

interface ToastProps {
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onClose }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none">
      {toasts.map((t) => {
        let border = 'border-[#00d1ff]';
        let bg = 'bg-[#121318]/90';
        let icon = 'info';

        if (t.type === 'error') {
          border = 'border-[#ffb4ab]';
          icon = 'error';
        } else if (t.type === 'success') {
          border = 'border-[#00fc92]';
          icon = 'check_circle';
        } else if (t.type === 'warning') {
          border = 'border-amber-400';
          icon = 'warning';
        }

        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded border ${border} ${bg} backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all animate-bounce-short`}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-xl" style={{ color: border.replace('border-', '') }}>
                {icon}
              </span>
              <span className="font-body text-sm text-[#e3e1e9]">{t.text}</span>
            </div>
            <button
              onClick={() => onClose(t.id)}
              className="text-[#bbc9cf] hover:text-white p-1 rounded"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};
