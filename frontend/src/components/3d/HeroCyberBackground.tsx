import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useTheme } from '../../store/ThemeContext';

/**
 * HeroCyberBackground — Full-screen-width soft cybersecurity backdrop.
 * The image spreads from the center to the right screen edge with no blank gaps.
 * Mouse parallax gives subtle life without being distracting.
 */
export default function HeroCyberBackground() {
  const { isDark } = useTheme();

  // Mouse Parallax Motion Values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth Spring physics — gentle, not snappy
  const springConfig = { damping: 40, stiffness: 90, mass: 1 };
  const transX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-18, 18]), springConfig);
  const transY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-12, 12]), springConfig);
  const rotateZ = useSpring(useTransform(mouseX, [-0.5, 0.5], [-1, 1]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0"
      style={{ pointerEvents: 'none' }}
    >
      {/* Ambient cyan glow — right side */}
      <div className="absolute top-1/4 right-0 w-[700px] h-[700px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-violet-500/8 rounded-full blur-[140px] pointer-events-none" />

      {/* Parallax image layer — fills from 40% to right edge */}
      <motion.div
        style={{ x: transX, y: transY, rotate: rotateZ }}
        animate={{ y: [-6, 6, -6] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 pointer-events-none"
      >
        {/* Mask: feather LEFT edge only — right edge fully bleeds to screen boundary */}
        <div
          className="absolute inset-0"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, black 32%, black 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 32%, black 100%)',
          }}
        >
          {/* Top & bottom fade */}
          <div
            className="absolute inset-0"
            style={{
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
            }}
          >
            <img
              src="/images/fraud_alert_hologram.png"
              alt=""
              aria-hidden="true"
              className={`absolute top-0 right-0 w-[70%] h-full object-cover object-left-top transform scale-110 transition-opacity duration-700 ${
                isDark
                  ? 'opacity-40 mix-blend-screen brightness-110 contrast-110'
                  : 'opacity-18 mix-blend-multiply brightness-90'
              }`}
              style={{ minWidth: '520px' }}
            />
          </div>
        </div>

        {/* Left-side gradient feather over the image for smooth blend into dark bg */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(to right, ${isDark ? '#030712' : '#f8fafc'} 0%, transparent 38%)`,
          }}
        />

        {/* Subtle laser scan line */}
        <motion.div
          className="absolute right-0 w-[68%] h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/25 to-transparent pointer-events-none"
          style={{ boxShadow: '0 0 12px #22d3ee60' }}
          animate={{ top: ['10%', '90%', '10%'] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Pulsing halo at shield center */}
        <motion.div
          className="absolute top-[45%] right-[25%] w-64 h-64 rounded-full bg-cyan-400/6 blur-3xl pointer-events-none"
          animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.15, 0.4, 0.15] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </div>
  );
}
