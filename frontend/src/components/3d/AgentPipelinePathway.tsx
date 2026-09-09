import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../../store/ThemeContext';

export default function AgentPipelinePathway() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 260;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const pipelineGroup = new THREE.Group();
    scene.add(pipelineGroup);

    // 1. Seven Connected Sequential Glass Stages (Input -> Extract -> Pattern -> Source -> Evidence -> Risk -> Safety)
    const stageSpecs = [
      { name: 'Input', color: 0x94a3b8 },
      { name: 'Extract', color: 0x06b6d4 },
      { name: 'Pattern', color: 0x8b5cf6 },
      { name: 'Source', color: 0xf59e0b },
      { name: 'Evidence', color: 0x10b981 },
      { name: 'Risk', color: 0xef4444 },
      { name: 'Safety', color: 0x6366f1 }
    ];

    const stageCount = stageSpecs.length;
    const stageMeshes: THREE.Mesh[] = [];
    const stageGeo = new THREE.BoxGeometry(0.5, 0.7, 0.08);

    stageSpecs.forEach((spec, i) => {
      const mat = new THREE.MeshPhysicalMaterial({
        color: spec.color,
        emissive: spec.color,
        emissiveIntensity: isDark ? 0.35 : 0.2,
        metalness: 0.2,
        roughness: 0.15,
        transmission: 0.7,
        transparent: true,
        opacity: 0.85
      });
      const mesh = new THREE.Mesh(stageGeo, mat);
      const x = (i - (stageCount - 1) / 2) * 0.95;
      mesh.position.set(x, 0, 0);
      pipelineGroup.add(mesh);
      stageMeshes.push(mesh);
    });

    // 2. Connecting Data Conduit Line
    const linePoints: THREE.Vector3[] = [];
    stageSpecs.forEach((_, i) => {
      const x = (i - (stageCount - 1) / 2) * 0.95;
      linePoints.push(new THREE.Vector3(x, 0, 0));
    });
    const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
    const lineMat = new THREE.LineBasicMaterial({
      color: isDark ? 0x06b6d4 : 0x0284c7,
      transparent: true,
      opacity: isDark ? 0.4 : 0.25
    });
    const conduit = new THREE.Line(lineGeo, lineMat);
    pipelineGroup.add(conduit);

    // 3. Flowing Data Packet Beacon traversing the stages
    const packetGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const packetMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const packetMesh = new THREE.Mesh(packetGeo, packetMat);
    pipelineGroup.add(packetMesh);

    // Ambient Lighting
    const amb = new THREE.AmbientLight(0xffffff, isDark ? 0.9 : 1.3);
    scene.add(amb);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 500;
      const h = container.clientHeight || 260;
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

      // Gentle floating oscillation on stage panels
      stageMeshes.forEach((mesh, idx) => {
        mesh.position.y = Math.sin(elapsed * 2.0 + idx * 0.5) * 0.08;
      });

      // Packet traversing sequentially
      const progress = (elapsed * 0.8) % 1;
      const startX = -((stageCount - 1) / 2) * 0.95;
      const totalWidth = (stageCount - 1) * 0.95;
      const curX = startX + progress * totalWidth;
      packetMesh.position.set(curX, Math.sin(curX * 3.0 + elapsed * 2.0) * 0.08, 0.1);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      stageGeo.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      packetGeo.dispose();
      packetMat.dispose();
      renderer.dispose();
    };
  }, [isDark]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full min-h-[200px] max-h-[260px] flex items-center justify-center relative pointer-events-none"
      aria-label="3D AI Pipeline Flow Pathway"
    />
  );
}
