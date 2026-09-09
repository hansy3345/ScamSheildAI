import React from 'react';
import { motion } from 'framer-motion';
import { Scan, ShieldAlert, CheckCircle2, Cpu } from 'lucide-react';

interface ScreenshotScannerHUDProps {
  imageSrc: string;
  fileName?: string;
  isScanning?: boolean;
}

export default function ScreenshotScannerHUD({ imageSrc, fileName, isScanning = true }: ScreenshotScannerHUDProps) {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-cyan-500/40 bg-zinc-950 p-2 shadow-2xl">
      {/* 1. Futuristic HUD Corners */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400 z-20 pointer-events-none" />
      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400 z-20 pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400 z-20 pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400 z-20 pointer-events-none" />

      {/* 2. Top Telemetry Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900/80 border-b border-zinc-800 text-[11px] font-mono text-zinc-300 z-20 relative">
        <div className="flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
          <span className="text-cyan-400 font-bold">MULTIMODAL OCR ENGINE</span>
        </div>
        <span className="text-zinc-400 truncate max-w-xs">{fileName || 'screenshot_payload.png'}</span>
      </div>

      {/* 3. Image Container with Active Scanner Line */}
      <div className="relative overflow-hidden max-h-[360px] flex items-center justify-center bg-black/60">
        <img
          src={imageSrc}
          alt="Uploaded Screenshot"
          className="w-full h-auto object-contain max-h-[360px] opacity-90"
        />

        {/* Animated Laser Scanning Line */}
        {isScanning && (
          <motion.div
            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-lg shadow-cyan-400/80 z-10"
            initial={{ top: '0%' }}
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
          />
        )}

        {/* Highlighted Bounding Box Overlay 1: Urgency / Suspicious Text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute top-[35%] left-[10%] right-[15%] h-10 border-2 border-dashed border-rose-500 bg-rose-500/10 rounded-md z-10 flex items-center px-2"
        >
          <span className="text-[10px] font-mono font-bold bg-rose-600 text-white px-1.5 py-0.5 rounded shadow">
            ⚠️ SUSPICIOUS PATTERN DETECTED
          </span>
        </motion.div>

        {/* Highlighted Bounding Box Overlay 2: Link / Payment action */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2.2, repeat: Infinity, delay: 0.5 }}
          className="absolute bottom-[20%] left-[20%] right-[25%] h-8 border-2 border-dashed border-amber-500 bg-amber-500/10 rounded-md z-10 flex items-center px-2"
        >
          <span className="text-[10px] font-mono font-bold bg-amber-600 text-white px-1.5 py-0.5 rounded shadow">
            🔍 UNVERIFIED URL / ACTION
          </span>
        </motion.div>
      </div>

      {/* 4. Bottom Detection Status */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900/80 border-t border-zinc-800 text-[11px] font-mono">
        <span className="text-emerald-400 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" /> High-Confidence OCR Active
        </span>
        <span className="text-zinc-400">Bounding boxes extracted</span>
      </div>
    </div>
  );
}
