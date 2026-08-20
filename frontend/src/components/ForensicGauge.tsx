import React from 'react';

interface ForensicGaugeProps {
  score: number; // 0.0 to 1.0
  label: string;
  classification?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ForensicGauge: React.FC<ForensicGaugeProps> = ({ score, label, classification, size = 'md' }) => {
  const percentage = Math.round(score * 100);

  let gaugeColor = '#00fc92'; // Neon Green for low manipulation / REAL
  if (score > 0.40 && score <= 0.70) gaugeColor = '#facc15'; // Yellow for SUSPICIOUS
  if (score > 0.70) gaugeColor = '#ffb4ab'; // Red for FAKE

  const radius = size === 'lg' ? 68 : size === 'md' ? 48 : 32;
  const stroke = size === 'lg' ? 10 : size === 'md' ? 8 : 6;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score * circumference);

  const containerSize = radius * 2;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: containerSize, height: containerSize }}>
        <svg height={containerSize} width={containerSize} className="transform -rotate-90">
          <circle
            stroke="#1e1f25"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke={gaugeColor}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.8s ease-in-out' }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="font-display font-bold text-[#e3e1e9]" style={{ fontSize: size === 'lg' ? '28px' : size === 'md' ? '20px' : '14px' }}>
            {percentage}%
          </span>
        </div>
      </div>

      <span className="font-mono text-xs text-[#bbc9cf] uppercase tracking-wider mt-2 font-bold text-center">
        {label}
      </span>
      {classification && (
        <span className="font-mono text-[10px] uppercase font-bold mt-0.5" style={{ color: gaugeColor }}>
          {classification}
        </span>
      )}
    </div>
  );
};
