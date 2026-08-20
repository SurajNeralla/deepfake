import React, { useState } from 'react';

interface VideoTimelineProps {
  videoUrl: string;
  suspiciousTimestamps?: number[];
  duration?: number;
}

export const VideoTimeline: React.FC<VideoTimelineProps> = ({ videoUrl, suspiciousTimestamps = [], duration = 0 }) => {
  const [currentTime, setCurrentTime] = useState(0);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    const videoElem = document.getElementById('deepguard-video-player') as HTMLVideoElement;
    if (videoElem) {
      videoElem.currentTime = time;
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Video Player */}
      <div className="relative aspect-video max-h-[400px] w-full bg-black rounded overflow-hidden border border-white/10 flex items-center justify-center">
        <video
          id="deepguard-video-player"
          src={videoUrl}
          controls
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Frame Timeline & Marker Scrub Bar */}
      <div className="glass-card p-4 rounded border border-white/10 flex flex-col gap-2">
        <div className="flex items-center justify-between font-mono text-xs text-[#bbc9cf]">
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00d1ff] text-base">timelapse</span>
            Temporal Frame Analysis Timeline
          </span>
          <span>
            {currentTime.toFixed(1)}s / {duration.toFixed(1)}s
          </span>
        </div>

        {/* Scrub Bar with Marker Overlay */}
        <div className="relative w-full h-6 flex items-center">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="w-full accent-[#00d1ff] cursor-pointer z-10 opacity-80 hover:opacity-100"
          />

          {/* Suspicious Timestamp Marker Flags */}
          {duration > 0 &&
            suspiciousTimestamps.map((ts, idx) => {
              const leftPct = (ts / duration) * 100;
              return (
                <div
                  key={idx}
                  className="absolute top-0 bottom-0 w-1.5 bg-[#ffb4ab] shadow-[0_0_8px_#ffb4ab] pointer-events-none rounded"
                  style={{ left: `${leftPct}%` }}
                  title={`Suspicious Frame Anomaly at ${ts}s`}
                />
              );
            })}
        </div>

        {/* Timestamp Legend */}
        <div className="flex items-center justify-between font-mono text-[10px] text-[#bbc9cf]/70">
          <span>0.0s</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[#ffb4ab]">
              <span className="w-2 h-2 rounded-full bg-[#ffb4ab]"></span> Suspicious Timestamp Marker
            </span>
          </div>
          <span>{duration.toFixed(1)}s</span>
        </div>
      </div>
    </div>
  );
};
