import { useEffect, useRef, useCallback } from 'react';
import { useTheme } from '../../store/ThemeContext';

/**
 * HalftoneHero — A canvas-rendered animated halftone dot cluster
 * inspired by EqtyLab's concentric dotted sphere/arc hero graphic.
 *
 * Features:
 * - Multiple concentric arc layers of dots
 * - Slow rotation per layer (alternating directions)
 * - Gradient: bright lavender/cyan at center → faded at edges
 * - Mouse parallax shift for depth
 * - Smooth requestAnimationFrame rendering
 */
export default function HalftoneHero() {
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

    // ─── dot layers config ────────────────────────────────
    interface DotLayer {
      radius: number;       // radius of the arc ring
      dotCount: number;     // how many dots on this ring
      dotSize: number;      // base dot radius
      arcStart: number;     // arc start in radians
      arcEnd: number;       // arc end in radians
      speed: number;        // rotation speed (rad/frame)
      opacity: number;      // base opacity
    }

    const layers: DotLayer[] = [
      { radius: 40,  dotCount: 8,  dotSize: 2.5, arcStart: -0.4, arcEnd: Math.PI + 0.4,   speed: 0.003,  opacity: 0.95 },
      { radius: 65,  dotCount: 12, dotSize: 3.0, arcStart: -0.6, arcEnd: Math.PI + 0.6,   speed: -0.0025, opacity: 0.85 },
      { radius: 90,  dotCount: 16, dotSize: 3.5, arcStart: -0.5, arcEnd: Math.PI + 0.8,   speed: 0.002,  opacity: 0.75 },
      { radius: 115, dotCount: 20, dotSize: 3.0, arcStart: -0.8, arcEnd: Math.PI + 1.0,   speed: -0.0018, opacity: 0.6 },
      { radius: 140, dotCount: 24, dotSize: 2.8, arcStart: -0.6, arcEnd: Math.PI + 1.2,   speed: 0.0015, opacity: 0.5 },
      { radius: 165, dotCount: 28, dotSize: 2.5, arcStart: -1.0, arcEnd: Math.PI * 1.6,   speed: -0.0012, opacity: 0.38 },
      { radius: 190, dotCount: 30, dotSize: 2.2, arcStart: -0.8, arcEnd: Math.PI * 1.4,   speed: 0.001,  opacity: 0.28 },
      { radius: 215, dotCount: 32, dotSize: 2.0, arcStart: -1.2, arcEnd: Math.PI * 1.7,   speed: -0.0008, opacity: 0.18 },
      { radius: 240, dotCount: 34, dotSize: 1.8, arcStart: -1.0, arcEnd: Math.PI * 1.5,   speed: 0.0006, opacity: 0.12 },
    ];

    // Track accumulated rotation offsets per layer
    const rotationOffsets = layers.map(() => Math.random() * Math.PI * 2);

    const render = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      // Center with parallax offset
      const mx = mouseRef.current.x * 12;
      const my = mouseRef.current.y * 12;
      const cx = w * 0.5 + mx;
      const cy = h * 0.48 + my;

      // Color palette
      const lavender = isDark ? [196, 167, 250] : [139, 92, 246];   // violet/lavender
      const cyan = isDark ? [34, 211, 238] : [6, 182, 212];          // cyan accent
      const white = isDark ? [255, 255, 255] : [100, 116, 139];      // slate for light mode

      layers.forEach((layer, li) => {
        rotationOffsets[li] += layer.speed;
        const arcSpan = layer.arcEnd - layer.arcStart;

        for (let i = 0; i < layer.dotCount; i++) {
          const t = i / (layer.dotCount - 1);
          const angle = layer.arcStart + t * arcSpan + rotationOffsets[li];

          const x = cx + Math.cos(angle) * layer.radius;
          const y = cy + Math.sin(angle) * layer.radius;

          // Color interpolation: inner = cyan, mid = lavender, outer = white/fade
          const normalizedLayer = li / (layers.length - 1);
          let r: number, g: number, b: number;

          if (normalizedLayer < 0.4) {
            const lt = normalizedLayer / 0.4;
            r = cyan[0] + (lavender[0] - cyan[0]) * lt;
            g = cyan[1] + (lavender[1] - cyan[1]) * lt;
            b = cyan[2] + (lavender[2] - cyan[2]) * lt;
          } else {
            const lt = (normalizedLayer - 0.4) / 0.6;
            r = lavender[0] + (white[0] - lavender[0]) * lt;
            g = lavender[1] + (white[1] - lavender[1]) * lt;
            b = lavender[2] + (white[2] - lavender[2]) * lt;
          }

          // Pulse effect — subtle size variation
          const pulse = 1 + Math.sin(Date.now() * 0.001 + i * 0.5 + li * 0.3) * 0.15;
          const dotR = layer.dotSize * pulse;

          // Opacity: combine layer base + edge fade for dots near arc ends
          const edgeFade = Math.min(t * 6, (1 - t) * 6, 1);
          const alpha = layer.opacity * edgeFade;

          ctx.beginPath();
          ctx.arc(x, y, dotR, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${alpha})`;
          ctx.fill();
        }
      });

      // Central soft glow
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 60);
      if (isDark) {
        grad.addColorStop(0, 'rgba(139, 92, 246, 0.12)');
        grad.addColorStop(0.5, 'rgba(6, 182, 212, 0.06)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        grad.addColorStop(0, 'rgba(139, 92, 246, 0.08)');
        grad.addColorStop(0.5, 'rgba(6, 182, 212, 0.04)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(cx - 60, cy - 60, 120, 120);

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
      style={{ minHeight: '400px' }}
      aria-hidden="true"
    />
  );
}
