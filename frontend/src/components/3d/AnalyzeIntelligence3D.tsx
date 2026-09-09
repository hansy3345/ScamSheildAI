import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../../store/ThemeContext';

export default function AnalyzeIntelligence3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 180;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // 1. Six Subtle AI Neural Nodes (Content, Pattern, Source, Evidence, Risk, Safety)
    const nodeCount = 6;
    const nodeMeshes: THREE.Mesh[] = [];
    const nodeGeo = new THREE.SphereGeometry(0.12, 16, 16);

    const colors = [0x06b6d4, 0x8b5cf6, 0xf59e0b, 0x10b981, 0xef4444, 0x6366f1];

    for (let i = 0; i < nodeCount; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: colors[i],
        emissive: colors[i],
        emissiveIntensity: 0.7,
        roughness: 0.2
      });
      const mesh = new THREE.Mesh(nodeGeo, mat);
      const x = (i - (nodeCount - 1) / 2) * 1.35;
      mesh.position.set(x, 0, 0);
      group.add(mesh);
      nodeMeshes.push(mesh);
    }

    // 2. Flowing Wave / Neural Data Connection Curve
    const curvePoints: THREE.Vector3[] = [];
    for (let i = 0; i <= 60; i++) {
      const t = (i / 60) * 8 - 4;
      curvePoints.push(new THREE.Vector3(t, Math.sin(t * 1.5) * 0.4, 0));
    }
    const curveGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
    const curveMat = new THREE.LineBasicMaterial({
      color: isDark ? 0x06b6d4 : 0x0284c7,
      transparent: true,
      opacity: isDark ? 0.35 : 0.2,
      linewidth: 1.5
    });
    const curveLine = new THREE.Line(curveGeo, curveMat);
    group.add(curveLine);

    // Secondary harmonic wave
    const curvePoints2: THREE.Vector3[] = [];
    for (let i = 0; i <= 60; i++) {
      const t = (i / 60) * 8 - 4;
      curvePoints2.push(new THREE.Vector3(t, Math.cos(t * 2.0) * 0.35, 0.2));
    }
    const curveGeo2 = new THREE.BufferGeometry().setFromPoints(curvePoints2);
    const curveMat2 = new THREE.LineBasicMaterial({
      color: isDark ? 0x8b5cf6 : 0x7c3aed,
      transparent: true,
      opacity: isDark ? 0.25 : 0.15
    });
    const curveLine2 = new THREE.Line(curveGeo2, curveMat2);
    group.add(curveLine2);

    // 3. Subtle Data Packet Beacons
    const packetGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const packetMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const packetMesh = new THREE.Mesh(packetGeo, packetMat);
    group.add(packetMesh);

    const amb = new THREE.AmbientLight(0xffffff, isDark ? 0.8 : 1.2);
    scene.add(amb);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 180;
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

      // Animate 6 nodes gently in a gentle undulating sequence
      nodeMeshes.forEach((mesh, idx) => {
        mesh.position.y = Math.sin(elapsed * 2.0 + idx * 0.8) * 0.15;
      });

      // Animate packet along wave
      const packetX = ((elapsed * 1.5) % 8) - 4;
      const packetY = Math.sin(packetX * 1.5) * 0.4;
      packetMesh.position.set(packetX, packetY, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      nodeGeo.dispose();
      curveGeo.dispose();
      curveMat.dispose();
      curveGeo2.dispose();
      curveMat2.dispose();
      packetGeo.dispose();
      packetMat.dispose();
      renderer.dispose();
    };
  }, [isDark]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full min-h-[120px] max-h-[160px] flex items-center justify-center relative pointer-events-none"
      aria-label="AI Intelligence Data Stream Visualization"
    />
  );
}
