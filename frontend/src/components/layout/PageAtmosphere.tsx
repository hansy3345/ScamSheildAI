import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../../store/ThemeContext';

/**
 * PageAtmosphere — Context-aware atmospheric lighting & ambient depth.
 * Every page gets a distinct color temperature, radial illumination,
 * and particle density that visually reinforces its cybersecurity purpose.
 */
export default function PageAtmosphere() {
  const location = useLocation();
  const { isDark } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const pathname = location.pathname;
    let particleCount = 18;
    let colorPrimary = isDark ? 'rgba(6, 182, 212, ' : 'rgba(2, 132, 199, ';
    let colorSecondary = isDark ? 'rgba(139, 92, 246, ' : 'rgba(124, 58, 237, ';

    if (pathname === '/') {
      particleCount = 20;
      colorPrimary = isDark ? 'rgba(139, 92, 246, ' : 'rgba(124, 58, 237, ';
      colorSecondary = isDark ? 'rgba(6, 182, 212, ' : 'rgba(2, 132, 199, ';
    } else if (pathname.includes('analyze') || pathname.includes('scan')) {
      particleCount = 24;
      colorPrimary = isDark ? 'rgba(34, 211, 238, ' : 'rgba(6, 182, 212, ';
      colorSecondary = isDark ? 'rgba(167, 139, 250, ' : 'rgba(139, 92, 246, ';
    } else if (pathname.includes('dashboard')) {
      particleCount = 16;
      colorPrimary = isDark ? 'rgba(99, 102, 241, ' : 'rgba(79, 70, 229, ';
      colorSecondary = isDark ? 'rgba(16, 185, 129, ' : 'rgba(5, 150, 105, ';
    } else if (pathname.includes('safety')) {
      particleCount = 18;
      colorPrimary = isDark ? 'rgba(16, 185, 129, ' : 'rgba(5, 150, 105, ';
      colorSecondary = isDark ? 'rgba(245, 158, 11, ' : 'rgba(217, 119, 6, ';
    } else if (pathname.includes('history')) {
      particleCount = 15;
      colorPrimary = isDark ? 'rgba(139, 92, 246, ' : 'rgba(124, 58, 237, ';
      colorSecondary = isDark ? 'rgba(99, 102, 241, ' : 'rgba(79, 70, 229, ';
    } else if (pathname.includes('how-it-works')) {
      particleCount = 22;
      colorPrimary = isDark ? 'rgba(6, 182, 212, ' : 'rgba(2, 132, 199, ';
      colorSecondary = isDark ? 'rgba(236, 72, 153, ' : 'rgba(219, 39, 119, ';
    } else if (pathname.includes('results')) {
      particleCount = 20;
      colorPrimary = isDark ? 'rgba(34, 211, 238, ' : 'rgba(6, 182, 212, ';
      colorSecondary = isDark ? 'rgba(139, 92, 246, ' : 'rgba(124, 58, 237, ';
    }

    interface Node {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      opacity: number;
      isPrimary: boolean;
    }

    const nodes: Node[] = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      opacity: Math.random() * 0.3 + 0.1,
      isPrimary: Math.random() > 0.45
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw faint connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const lineOpacity = (1 - dist / 130) * (isDark ? 0.07 : 0.035);
            ctx.strokeStyle = nodes[i].isPrimary
              ? `${colorPrimary}${lineOpacity})`
              : `${colorSecondary}${lineOpacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0) node.x = width;
        if (node.x > width) node.x = 0;
        if (node.y < 0) node.y = height;
        if (node.y > height) node.y = 0;

        ctx.fillStyle = node.isPrimary
          ? `${colorPrimary}${node.opacity * (isDark ? 0.7 : 0.4)})`
          : `${colorSecondary}${node.opacity * (isDark ? 0.7 : 0.4)})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [location.pathname, isDark]);

  // Contextual atmospheric glows per page
  const getAmbientGlows = () => {
    const p = location.pathname;
    if (p === '/') {
      return (
        <>
          <div className="absolute top-[-10%] right-[15%] w-[600px] h-[600px] bg-violet-600/8 dark:bg-violet-600/6 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute top-[35%] left-[-5%] w-[500px] h-[500px] bg-cyan-500/8 dark:bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none" />
        </>
      );
    }
    if (p.includes('analyze')) {
      return (
        <>
          <div className="absolute top-[-5%] left-[15%] w-[550px] h-[550px] bg-cyan-500/10 dark:bg-cyan-500/8 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute top-[40%] right-[5%] w-[500px] h-[500px] bg-violet-600/8 dark:bg-violet-600/6 rounded-full blur-[150px] pointer-events-none" />
        </>
      );
    }
    if (p.includes('scan')) {
      return (
        <>
          <div className="absolute top-[10%] left-[30%] w-[600px] h-[600px] bg-cyan-500/12 dark:bg-cyan-500/9 rounded-full blur-[150px] pointer-events-none" />
          <div className="absolute bottom-[10%] right-[20%] w-[500px] h-[500px] bg-violet-600/10 dark:bg-violet-600/8 rounded-full blur-[160px] pointer-events-none" />
        </>
      );
    }
    if (p.includes('results')) {
      return (
        <>
          <div className="absolute top-[5%] left-[20%] w-[550px] h-[550px] bg-cyan-500/9 dark:bg-cyan-500/7 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute top-[30%] right-[10%] w-[500px] h-[500px] bg-indigo-600/8 dark:bg-indigo-600/6 rounded-full blur-[150px] pointer-events-none" />
        </>
      );
    }
    if (p.includes('dashboard')) {
      return (
        <>
          <div className="absolute top-[-10%] right-[20%] w-[700px] h-[500px] bg-indigo-500/8 dark:bg-indigo-500/6 rounded-full blur-[160px] pointer-events-none" />
          <div className="absolute bottom-[10%] left-[10%] w-[500px] h-[500px] bg-emerald-500/6 dark:bg-emerald-500/4 rounded-full blur-[150px] pointer-events-none" />
        </>
      );
    }
    if (p.includes('history')) {
      return (
        <div className="absolute top-[10%] left-[20%] w-[650px] h-[550px] bg-violet-500/8 dark:bg-violet-500/6 rounded-full blur-[150px] pointer-events-none" />
      );
    }
    if (p.includes('safety')) {
      return (
        <>
          <div className="absolute top-[-5%] left-[10%] w-[550px] h-[550px] bg-emerald-500/10 dark:bg-emerald-500/7 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute top-[30%] right-[10%] w-[500px] h-[500px] bg-amber-500/8 dark:bg-amber-500/5 rounded-full blur-[150px] pointer-events-none" />
        </>
      );
    }
    if (p.includes('how-it-works')) {
      return (
        <>
          <div className="absolute top-[-5%] right-[25%] w-[600px] h-[600px] bg-cyan-500/9 dark:bg-cyan-500/7 rounded-full blur-[150px] pointer-events-none" />
          <div className="absolute top-[40%] left-[10%] w-[550px] h-[550px] bg-pink-500/7 dark:bg-pink-500/5 rounded-full blur-[160px] pointer-events-none" />
        </>
      );
    }
    return (
      <div className="absolute top-[-5%] right-[20%] w-[600px] h-[600px] bg-cyan-500/7 rounded-full blur-[150px] pointer-events-none" />
    );
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {getAmbientGlows()}
      <canvas ref={canvasRef} className="w-full h-full opacity-60 dark:opacity-80" />
    </div>
  );
}
