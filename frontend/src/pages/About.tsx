import React from 'react';

export const About: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col gap-12 text-[#e3e1e9]">
      <div>
        <div className="inline-flex items-center gap-2 bg-[#1e1f25] border border-[#00d1ff]/40 px-3 py-1 rounded font-mono text-xs text-[#00d1ff] mb-4">
          TECHNICAL SPECIFICATIONS & ARCHITECTURE
        </div>
        <h1 className="font-display text-4xl font-bold text-white mb-3">About DeepGuard Engine</h1>
        <p className="font-body text-base text-[#bbc9cf] leading-relaxed">
          DeepGuard is an open defensive media forensics platform created to evaluate digital media authenticity across image, video, and acoustic modalities.
        </p>
      </div>

      {/* Defensive Scope */}
      <div className="glass-card p-6 rounded-xl border border-white/10 flex flex-col gap-3">
        <div className="flex items-center gap-3 text-[#00d1ff]">
          <span className="material-symbols-outlined text-2xl">shield</span>
          <h2 className="font-display text-xl font-bold text-white">Strict Defensive Mandate</h2>
        </div>
        <p className="font-body text-sm text-[#bbc9cf] leading-relaxed">
          DeepGuard is built exclusively for detection, analytical inspection, and verification of digital media.
          The codebase intentionally contains zero functionality for deepfake generation, facial reenactment, voice synthesis, or identity masking.
        </p>
      </div>

      {/* Forensic Pipelines Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-xl border border-white/10 flex flex-col gap-3">
          <span className="material-symbols-outlined text-3xl text-[#00d1ff]">image</span>
          <h3 className="font-display text-lg font-bold text-white">Image Forensic Pipeline</h3>
          <ul className="font-mono text-xs text-[#bbc9cf] flex flex-col gap-2 list-disc pl-4">
            <li>Error Level Analysis (ELA) compression differential</li>
            <li>Fast Fourier Transform (FFT) high-frequency spectral noise</li>
            <li>Laplacian edge blur and color channel variance</li>
            <li>Spatial face detection boundary inspection</li>
          </ul>
        </div>

        <div className="glass-card p-6 rounded-xl border border-white/10 flex flex-col gap-3">
          <span className="material-symbols-outlined text-3xl text-[#00d1ff]">videocam</span>
          <h3 className="font-display text-lg font-bold text-white">Video Temporal Pipeline</h3>
          <ul className="font-mono text-xs text-[#bbc9cf] flex flex-col gap-2 list-disc pl-4">
            <li>Configurable FPS frame sampling</li>
            <li>Inter-frame noise stability tracking</li>
            <li>Temporal flicker and face landmark alignment variance</li>
            <li>Timestamped frame anomaly flagging</li>
          </ul>
        </div>

        <div className="glass-card p-6 rounded-xl border border-white/10 flex flex-col gap-3">
          <span className="material-symbols-outlined text-3xl text-[#00d1ff]">mic</span>
          <h3 className="font-display text-lg font-bold text-white">Audio Acoustic Pipeline</h3>
          <ul className="font-mono text-xs text-[#bbc9cf] flex flex-col gap-2 list-disc pl-4">
            <li>Short-Time Fourier Transform (STFT) Mel Spectrogram</li>
            <li>Zero-Crossing Rate (ZCR) voice profiling</li>
            <li>Vocoder phase discontinuity scoring</li>
            <li>Synthetic pitch contour fluctuation detection</li>
          </ul>
        </div>
      </div>

      {/* Modular ML Architecture */}
      <div className="glass-card p-6 rounded-xl border border-white/10 flex flex-col gap-4">
        <h2 className="font-display text-xl font-bold text-white">Modular Model Plug-and-Play System</h2>
        <p className="font-body text-sm text-[#bbc9cf] leading-relaxed">
          DeepGuard abstracts all detector logic using a standardized Python interface:
        </p>

        <div className="bg-[#0d0e13] p-4 rounded border border-white/10 font-mono text-xs text-[#00d1ff] overflow-x-auto">
          <code>
            BaseDetector (Abstract Parent)<br />
            ├── ImageDetector.predict(image_path)<br />
            ├── VideoDetector.predict(video_path)<br />
            └── AudioDetector.predict(audio_path)
          </code>
        </div>

        <p className="font-body text-sm text-[#bbc9cf] leading-relaxed">
          To drop in custom PyTorch model weights: place your trained weights file in <code className="text-[#00d1ff]">models/weights/image_detector.pt</code> and configure thresholds in <code className="text-[#00d1ff]">models/config.yaml</code>. The platform automatically detects and switches execution mode from Demonstration Heuristic to Production Neural Inference.
        </p>
      </div>

      {/* Limitations & Privacy */}
      <div className="glass-card p-6 rounded-xl border border-white/10 flex flex-col gap-4">
        <h2 className="font-display text-xl font-bold text-white">Privacy & File Retention Policy</h2>
        <ul className="font-mono text-xs text-[#bbc9cf] flex flex-col gap-2 list-disc pl-4">
          <li>Uploaded files are assigned random UUID v4 identifiers to eliminate path traversal vulnerabilities.</li>
          <li>Original filenames are sanitized and stored separately from the disk filesystem path.</li>
          <li>All uploaded media assets and generated reports undergo automated background cleanup purging after retention.</li>
          <li>User media is strictly used for one-shot forensic inference and is never transmitted to third parties or used for model training without consent.</li>
        </ul>
      </div>
    </div>
  );
};
