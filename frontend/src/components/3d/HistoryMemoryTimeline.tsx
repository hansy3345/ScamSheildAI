import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../../store/ThemeContext';

export default function HistoryMemoryTimeline() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 140;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    const timelineGroup = new THREE.Group();
    scene.add(timelineGroup);

    // 1. Horizontal Flowing Time Ribbon Line
    const linePoints: THREE.Vector3[] = [];
    const segmentCount = 40;
    for (let i = 0; i <= segmentCount; i++) {
      const x = (i / segmentCount) * 8 - 4;
      linePoints.push(new THREE.Vector3(x, 0, 0));
    }
    const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
    const lineMat = new THREE.LineBasicMaterial({
      color: isDark ? 0x8b5cf6 : 0x7c3aed,
      transparent: true,
      opacity: isDark ? 0.35 : 0.2
    });
    const line = new THREE.Line(lineGeo, lineMat);
    timelineGroup.add(line);

    // 2. Faint Glowing History Milestone Nodes
    const nodeCount = 5;
    const nodeGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0xa78bfa : 0x8b5cf6,
      emissive: isDark ? 0x8b5cf6 : 0x7c3aed,
      emissiveIntensity: 0.6
    });

    const nodes: THREE.Mesh[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const mesh = new THREE.Mesh(nodeGeo, nodeMat);
      const x = (i / (nodeCount - 1)) * 6 - 3;
      mesh.position.set(x, 0, 0);
      timelineGroup.add(mesh);
      nodes.push(mesh);
    }

    const amb = new THREE.AmbientLight(0xffffff, isDark ? 0.8 : 1.2);
    scene.add(amb);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 140;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Soft gentle vertical wave on nodes
      nodes.forEach((node, idx) => {
        node.position.y = Math.sin(elapsed * 1.5 + idx * 1.0) * 0.12;
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
      lineGeo.dispose();
      lineMat.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      renderer.dispose();
    };
  }, [isDark]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full min-h-[100px] max-h-[140px] flex items-center justify-center relative pointer-events-none"
      aria-label="Digital Memory Timeline Background"
    />
  );
}
