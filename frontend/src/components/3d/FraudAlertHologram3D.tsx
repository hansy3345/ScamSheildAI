import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  Maximize2,
  ShieldAlert,
  Sparkles,
  Lock,
  DollarSign,
  User,
  Laptop,
  Settings,
  Activity,
  Scan
} from 'lucide-react';
import { useTheme } from '../../store/ThemeContext';
import { Tag } from '../ui';

export default function FraudAlertHologram3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { isDark } = useTheme();
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [hudTime, setHudTime] = useState('00:00:14:02');

  const isPlayingRef = useRef(isPlaying);
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      const ms = Math.floor(d.getMilliseconds() / 10).toString().padStart(2, '0');
      const s = d.getSeconds().toString().padStart(2, '0');
      const m = d.getMinutes().toString().padStart(2, '0');
      setHudTime(`00:${m}:${s}:${ms}`);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // Root Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // === 1. CYBER BACKGROUND GRID (Orthogonal perspective grid) ===
    const gridHelper = new THREE.GridHelper(16, 32, 0x06b6d4, 0x1e293b);
    gridHelper.position.y = -2.8;
    gridHelper.position.z = -1;
    rootGroup.add(gridHelper);

    // === 2. HELPER: CREATE 3D HEXAGON PRISM ===
    const createHexagonShape = (radius: number) => {
      const shape = new THREE.Shape();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        if (i === 0) shape.moveTo(x, y);
        else shape.lineTo(x, y);
      }
      shape.closePath();
      return shape;
    };

    const hexExtrudeSettings = {
      depth: 0.12,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.03,
      bevelThickness: 0.03
    };

    // Central "FRAUD ALERT" Hexagon
    const centerHexGeo = new THREE.ExtrudeGeometry(createHexagonShape(1.4), {
      depth: 0.25,
      bevelEnabled: true,
      bevelSegments: 4,
      bevelSize: 0.06,
      bevelThickness: 0.06
    });
    centerHexGeo.center();

    const centerHexMat = new THREE.MeshPhysicalMaterial({
      color: 0x031d38,
      emissive: 0x0284c7,
      emissiveIntensity: 0.7,
      metalness: 0.2,
      roughness: 0.1,
      transmission: 0.85,
      transparent: true,
      opacity: 0.88,
      ior: 1.5,
      thickness: 0.8,
      clearcoat: 1.0
    });
    const centerHexMesh = new THREE.Mesh(centerHexGeo, centerHexMat);
    centerHexMesh.position.set(0, 0, 0);
    rootGroup.add(centerHexMesh);

    // Central Hexagon Neon Edges
    const centerEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(centerHexGeo),
      new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.9 })
    );
    centerHexMesh.add(centerEdges);

    // Inner Core Radiant Light
    const alertLight = new THREE.PointLight(0x06b6d4, 3.0, 8);
    alertLight.position.set(0, 0, 0.5);
    centerHexMesh.add(alertLight);

    // === 3. SATELLITE HEXAGONAL NODES (As in the reference image) ===
    const nodeDefs = [
      { id: 'financial', label: 'Financial Security', icon: 'dollar', x: 0.9, y: 1.8, z: 0.3, radius: 0.52, color: 0x06b6d4 },
      { id: 'shield', label: 'Threat Firewall', icon: 'shield', x: -0.6, y: 2.1, z: -0.2, radius: 0.58, color: 0x38bdf8 },
      { id: 'identity', label: 'Identity Verification', icon: 'user', x: 2.3, y: -0.2, z: 0.5, radius: 0.68, color: 0x60a5fa },
      { id: 'lock', label: 'Account Safeguard', icon: 'lock', x: -1.8, y: 0.6, z: 0.2, radius: 0.45, color: 0x22d3ee },
      { id: 'laptop', label: 'Device Integrity', icon: 'laptop', x: 1.3, y: -1.6, z: 0.2, radius: 0.5, color: 0x38bdf8 },
      { id: 'vault', label: 'Encrypted Vault', icon: 'vault', x: -1.2, y: -1.5, z: 0.4, radius: 0.55, color: 0x0284c7 },
      { id: 'gears', label: 'Autonomous Agents', icon: 'gears', x: 3.1, y: -1.7, z: -0.3, radius: 0.48, color: 0x818cf8 },
      { id: 'defense', label: 'Perimeter Defense', icon: 'defense', x: 2.1, y: 1.7, z: -0.4, radius: 0.55, color: 0x38bdf8 }
    ];

    const nodeMeshes: { id: string; mesh: THREE.Mesh; basePos: THREE.Vector3; color: number }[] = [];

    nodeDefs.forEach((def) => {
      const geo = new THREE.ExtrudeGeometry(createHexagonShape(def.radius), hexExtrudeSettings);
      geo.center();

      const mat = new THREE.MeshPhysicalMaterial({
        color: 0x082f49,
        emissive: def.color,
        emissiveIntensity: 0.5,
        metalness: 0.3,
        roughness: 0.2,
        transmission: 0.8,
        transparent: true,
        opacity: 0.82
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(def.x, def.y, def.z);

      // Edge wireframe accent
      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(geo),
        new THREE.LineBasicMaterial({ color: 0x7dd3fc, transparent: true, opacity: 0.75 })
      );
      mesh.add(edges);

      rootGroup.add(mesh);
      nodeMeshes.push({
        id: def.id,
        mesh,
        basePos: new THREE.Vector3(def.x, def.y, def.z),
        color: def.color
      });
    });

    // === 4. HOLOGRAPHIC CONNECTION LINES (Neural data flow between nodes) ===
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.45
    });

    nodeMeshes.forEach((node) => {
      const pts = [new THREE.Vector3(0, 0, 0), node.basePos];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const line = new THREE.Line(lineGeo, lineMat);
      rootGroup.add(line);
    });

    // === 5. FLOATING SCANNER LASER BEAM ===
    const laserPlaneGeo = new THREE.PlaneGeometry(8, 0.08);
    const laserPlaneMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide
    });
    const laserMesh = new THREE.Mesh(laserPlaneGeo, laserPlaneMat);
    laserMesh.position.set(0, 0, 0.6);
    rootGroup.add(laserMesh);

    // === 6. FLOATING CYBER PARTICLES & AMBIENT DUST ===
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 12;
      particlePositions[i + 1] = (Math.random() - 0.5) * 8;
      particlePositions[i + 2] = (Math.random() - 0.5) * 6;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.04,
      transparent: true,
      opacity: 0.6
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    rootGroup.add(particleSystem);

    // Lighting
    const amb = new THREE.AmbientLight(0xffffff, isDark ? 0.9 : 1.3);
    scene.add(amb);

    const dir1 = new THREE.DirectionalLight(0x38bdf8, 2.0);
    dir1.position.set(4, 5, 4);
    scene.add(dir1);

    const dir2 = new THREE.DirectionalLight(0x818cf8, 1.4);
    dir2.position.set(-4, -3, 2);
    scene.add(dir2);

    // Mouse Parallax
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 450;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (isPlayingRef.current) {
        // Cinematic Camera Orbit / Sway
        camera.position.x = Math.sin(elapsed * 0.4) * 0.8;
        camera.position.y = Math.cos(elapsed * 0.3) * 0.4;
        camera.lookAt(0, 0, 0);

        // Gentle floating of central hexagon
        centerHexMesh.position.y = Math.sin(elapsed * 1.5) * 0.08;
        centerHexMesh.rotation.z = Math.sin(elapsed * 0.5) * 0.03;

        // Individual satellite floating
        nodeMeshes.forEach((n, i) => {
          n.mesh.position.y = n.basePos.y + Math.sin(elapsed * 1.8 + i) * 0.06;
          n.mesh.position.x = n.basePos.x + Math.cos(elapsed * 1.2 + i) * 0.04;
          n.mesh.rotation.z = Math.sin(elapsed * 0.8 + i) * 0.05;
        });

        // Laser scan line movement
        laserMesh.position.y = Math.sin(elapsed * 1.5) * 2.2;
        laserPlaneMat.opacity = 0.5 + Math.sin(elapsed * 3) * 0.3;

        // Particle subtle drift
        particleSystem.rotation.y = elapsed * 0.03;
      }

      // Mouse interactive tilt
      rootGroup.rotation.y += (mouseX * 0.25 - rootGroup.rotation.y) * 0.05;
      rootGroup.rotation.x += (-mouseY * 0.18 - rootGroup.rotation.x) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isDark]);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-slate-950 border border-cyan-500/30 shadow-2xl backdrop-blur-2xl">
      {/* Dynamic Cinematic HUD Overlay Elements */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-mono text-cyan-400 font-bold backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>LIVE INTERCEPTOR 3D</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline-block">
            TARGET: MULTI-VECTOR FRAUD
          </span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 text-[11px] font-mono text-cyan-400">
            {hudTime}
          </div>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-colors cursor-pointer"
            aria-label={isPlaying ? 'Pause 3D Clip' : 'Play 3D Clip'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={mountRef}
        className="w-full h-[380px] sm:h-[480px] relative select-none"
        style={{ cursor: 'grab' }}
      />

      {/* Center "FRAUD ALERT" 3D Hologram Overlay Badge */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 text-center flex flex-col items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="relative px-6 py-4 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-cyan-400/40 shadow-2xl shadow-cyan-500/30"
        >
          <div className="text-xl sm:text-3xl font-black tracking-wider text-white font-sans drop-shadow-[0_0_20px_rgba(6,182,212,0.8)]">
            FRAUD
          </div>
          <div className="text-2xl sm:text-4xl font-black tracking-widest text-cyan-400 font-sans drop-shadow-[0_0_25px_rgba(6,182,212,0.9)]">
            ALERT
          </div>
          <div className="h-0.5 w-16 mx-auto bg-gradient-to-r from-transparent via-cyan-400 to-transparent mt-1" />
        </motion.div>
      </div>

      {/* Bottom Telemetry HUD Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 text-xs font-mono">
        <div className="flex items-center gap-3 text-slate-300">
          <span className="text-cyan-400 font-bold flex items-center gap-1">
            <Scan className="w-3.5 h-3.5" /> 8 NODES CORRELATED
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="text-[11px] text-slate-400">
            UPI • PHISHING • EXTORTION • SPOOFING
          </span>
        </div>

        <div className="flex items-center gap-2 text-emerald-400 font-bold text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>REAL-TIME HEURISTIC MITIGATION</span>
        </div>
      </div>
    </div>
  );
}
