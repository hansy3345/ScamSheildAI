import React, { useEffect, useRef, useCallback } from 'react';
import { useTheme } from '../../store/ThemeContext';

/**
 * HeroCyberRadar — An ultra-modern animated cyber radar canvas
 * with rotating scanner beam, glowing threat pings, concentric distance rings,
 * particle grid matrix, and interactive mouse parallax effect.
 */
export default function HeroCyberRadar() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const { isDark } = useTheme();

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current = {
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 2
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let dpr = window.devicePixelRatio || 1;

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);

    // Threat targets on radar
    const targets = [
      { angle: 0.8, dist: 0.35, label: 'UPI PIN Trap', level: 'critical' },
      { angle: 2.1, dist: 0.65, label: 'Digital Arrest', level: 'critical' },
      { angle: 3.6, dist: 0.5,  label: 'Phishing KYC', level: 'high' },
      { angle: 4.8, dist: 0.78, label: 'Task Ponzi', level: 'high' },
      { angle: 5.7, dist: 0.3,  label: 'Safe Alert', level: 'safe' },
    ];

    let sweepAngle = 0;

    const render = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      const mx = mouseRef.current.x * 15;
      const my = mouseRef.current.y * 15;
      const cx = w * 0.5 + mx;
      const cy = h * 0.5 + my;
      const maxR = Math.min(w, h) * 0.44;

      sweepAngle += 0.025;
      if (sweepAngle > Math.PI * 2) sweepAngle -= Math.PI * 2;

      // 1. Draw subtle background grid
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 32;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // 2. Concentric Radar Rings
      const ringSteps = [0.25, 0.5, 0.75, 1.0];
      ringSteps.forEach((step, idx) => {
        const r = maxR * step;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = isDark
          ? `rgba(6, 182, 212, ${0.12 + idx * 0.05})`
          : `rgba(6, 182, 212, ${0.15 + idx * 0.06})`;
        ctx.lineWidth = 1;
        ctx.setLineDash(idx === 3 ? [4, 4] : []);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // 3. Radar Crosshairs
      ctx.strokeStyle = isDark ? 'rgba(6, 182, 212, 0.15)' : 'rgba(6, 182, 212, 0.2)';
      ctx.beginPath();
      ctx.moveTo(cx - maxR, cy);
      ctx.lineTo(cx + maxR, cy);
      ctx.moveTo(cx, cy - maxR);
      ctx.lineTo(cx, cy + maxR);
      ctx.stroke();

      // 4. Rotating Radar Sweep Beam (Sector Gradient)
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, maxR, sweepAngle - 0.45, sweepAngle);
      ctx.closePath();
      const sweepGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
      if (isDark) {
        sweepGrad.addColorStop(0, 'rgba(6, 182, 212, 0.25)');
        sweepGrad.addColorStop(1, 'rgba(139, 92, 246, 0.05)');
      } else {
        sweepGrad.addColorStop(0, 'rgba(6, 182, 212, 0.2)');
        sweepGrad.addColorStop(1, 'rgba(139, 92, 246, 0.03)');
      }
      ctx.fillStyle = sweepGrad;
      ctx.fill();

      // Leading beam line
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(sweepAngle) * maxR, cy + Math.sin(sweepAngle) * maxR);
      ctx.strokeStyle = isDark ? 'rgba(34, 211, 238, 0.8)' : 'rgba(6, 182, 212, 0.9)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // 5. Render Threat Targets
      targets.forEach((tgt) => {
        const tx = cx + Math.cos(tgt.angle) * (maxR * tgt.dist);
        const ty = cy + Math.sin(tgt.angle) * (maxR * tgt.dist);

        // Calculate angle difference from sweep beam
        let diff = sweepAngle - tgt.angle;
        while (diff < 0) diff += Math.PI * 2;
        while (diff > Math.PI * 2) diff -= Math.PI * 2;

        const isHit = diff < 0.6;
        const color = tgt.level === 'critical'
          ? '#ef4444'
          : tgt.level === 'high'
          ? '#f97316'
          : '#10b981';

        // Ping dot
        ctx.beginPath();
        ctx.arc(tx, ty, isHit ? 6 : 4, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = isHit ? 14 : 4;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Expanding ping ring
        if (isHit) {
          ctx.beginPath();
          ctx.arc(tx, ty, 14, 0, Math.PI * 2);
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Mini Label
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.75)' : 'rgba(15, 23, 42, 0.8)';
        ctx.fillText(tgt.label, tx + 10, ty + 3);
      });

      // 6. Central Core Hub
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 24);
      coreGrad.addColorStop(0, isDark ? '#22d3ee' : '#06b6d4');
      coreGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 24, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [isDark, handleMouseMove]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ minHeight: '420px' }}
      aria-hidden="true"
    />
  );
}
