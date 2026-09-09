import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../../store/ThemeContext';

interface AgentSwarmProps {
  activeStageIdx?: number; // 0 to 5
}

interface AgentNodeSpec {
  id: string;
  name: string;
  pos: [number, number, number];
  color: number;
}

const AGENT_SPECS: AgentNodeSpec[] = [
  { id: 'content', name: 'CONTENT', pos: [-3.2, 1.4, 0], color: 0x06b6d4 },
  { id: 'pattern', name: 'PATTERN', pos: [-1.2, 2.2, 0.8], color: 0x8b5cf6 },
  { id: 'source', name: 'SOURCE', pos: [1.2, 2.2, -0.8], color: 0xf59e0b },
  { id: 'evidence', name: 'EVIDENCE', pos: [3.2, 1.4, 0], color: 0x10b981 },
  { id: 'risk', name: 'RISK', pos: [1.8, -1.5, 0.6], color: 0xef4444 },
  { id: 'safety', name: 'SAFETY', pos: [-1.8, -1.5, -0.6], color: 0x6366f1 },
];

export default function AgentSwarm3D({ activeStageIdx = 0 }: AgentSwarmProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 340;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const swarmGroup = new THREE.Group();
    scene.add(swarmGroup);

    // 1. Central Quantum Core Hub
    const coreGeo = new THREE.IcosahedronGeometry(0.7, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x09090b : 0xf8fafc,
      emissive: isDark ? 0x06b6d4 : 0x0284c7,
      emissiveIntensity: 0.5,
      wireframe: true,
      transparent: true,
      opacity: 0.7
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    swarmGroup.add(coreMesh);

    // 2. 6 Agent Nodes & Rotating Holographic Rings
    const nodeMeshes: THREE.Mesh[] = [];
    const ringMeshes: THREE.Mesh[] = [];
    const nodeLights: THREE.PointLight[] = [];

    AGENT_SPECS.forEach((spec, idx) => {
      // Agent Node Sphere
      const nGeo = new THREE.SphereGeometry(0.32, 16, 16);
      const nMat = new THREE.MeshStandardMaterial({
        color: spec.color,
        emissive: spec.color,
        emissiveIntensity: idx <= activeStageIdx ? 0.9 : 0.2,
        roughness: 0.3,
        metalness: 0.8
      });
      const node = new THREE.Mesh(nGeo, nMat);
      node.position.set(...spec.pos);
      swarmGroup.add(node);
      nodeMeshes.push(node);

      // Node Halo Ring
      const rGeo = new THREE.TorusGeometry(0.48, 0.02, 8, 24);
      const rMat = new THREE.MeshBasicMaterial({
        color: spec.color,
        transparent: true,
        opacity: idx <= activeStageIdx ? 0.8 : 0.25
      });
      const ring = new THREE.Mesh(rGeo, rMat);
      ring.position.set(...spec.pos);
      swarmGroup.add(ring);
      ringMeshes.push(ring);

      // Point light per agent node
      const pLight = new THREE.PointLight(spec.color, idx <= activeStageIdx ? 1.5 : 0.3, 4);
      pLight.position.set(...spec.pos);
      swarmGroup.add(pLight);
      nodeLights.push(pLight);
    });

    // 3. Cyber Interconnect Lattice Lines
    const lineGroup = new THREE.Group();
    swarmGroup.add(lineGroup);

    const lineGeo = new THREE.BufferGeometry();
    const points: THREE.Vector3[] = [];

    // Connect sequentially + connect to center
    for (let i = 0; i < AGENT_SPECS.length; i++) {
      const p1 = new THREE.Vector3(...AGENT_SPECS[i].pos);
      const p2 = new THREE.Vector3(...AGENT_SPECS[(i + 1) % AGENT_SPECS.length].pos);
      points.push(p1, p2);
      // Connect to central core
      points.push(p1, new THREE.Vector3(0, 0, 0));
    }
    lineGeo.setFromPoints(points);

    const lineMat = new THREE.LineBasicMaterial({
      color: isDark ? 0x06b6d4 : 0x0284c7,
      transparent: true,
      opacity: isDark ? 0.35 : 0.2
    });
    const latticeLines = new THREE.LineSegments(lineGeo, lineMat);
    lineGroup.add(latticeLines);

    // 4. Data Pulse Packets
    const packetCount = 8;
    const packetGeo = new THREE.SphereGeometry(0.06, 8, 8);
    const packetMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee });
    const packetMeshes: THREE.Mesh[] = [];

    for (let i = 0; i < packetCount; i++) {
      const pMesh = new THREE.Mesh(packetGeo, packetMat);
      swarmGroup.add(pMesh);
      packetMeshes.push(pMesh);
    }

    // Lighting
    const ambLight = new THREE.AmbientLight(0xffffff, isDark ? 0.8 : 1.2);
    scene.add(ambLight);

    // Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 500;
      const h = container.clientHeight || 340;
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

      // Swarm slow rotation
      swarmGroup.rotation.y = elapsed * 0.25;
      coreMesh.rotation.x = elapsed * 0.4;
      coreMesh.rotation.z = elapsed * 0.3;

      // Pulse active agent rings
      ringMeshes.forEach((ring, idx) => {
        ring.rotation.x = elapsed * 1.2;
        ring.rotation.y = elapsed * 0.8;
        if (idx === activeStageIdx) {
          const scale = 1 + Math.sin(elapsed * 6) * 0.15;
          ring.scale.set(scale, scale, scale);
        } else {
          ring.scale.set(1, 1, 1);
        }
      });

      // Animate Data Packets along Lattice
      packetMeshes.forEach((pMesh, i) => {
        const fromIdx = (i + Math.floor(elapsed * 1.5)) % AGENT_SPECS.length;
        const toIdx = (fromIdx + 1) % AGENT_SPECS.length;
        const progress = (elapsed * 1.2 + i * 0.25) % 1;

        const start = new THREE.Vector3(...AGENT_SPECS[fromIdx].pos);
        const end = new THREE.Vector3(...AGENT_SPECS[toIdx].pos);
        pMesh.position.lerpVectors(start, end, progress);
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      coreGeo.dispose();
      coreMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      packetGeo.dispose();
      packetMat.dispose();
      nodeMeshes.forEach(m => {
        m.geometry.dispose();
        (m.material as THREE.Material).dispose();
      });
      ringMeshes.forEach(r => {
        r.geometry.dispose();
        (r.material as THREE.Material).dispose();
      });
      renderer.dispose();
    };
  }, [isDark, activeStageIdx]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full min-h-[300px] flex items-center justify-center relative"
      aria-label="3D Agentic AI Swarm Visualization"
    />
  );
}
