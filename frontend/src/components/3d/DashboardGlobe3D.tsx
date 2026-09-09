import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../../store/ThemeContext';

export default function DashboardGlobe3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 240;
    const height = container.clientHeight || 200;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // 1. Subtle Wireframe Cyber Globe
    const globeGeo = new THREE.SphereGeometry(1.3, 20, 20);
    const globeMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x06b6d4 : 0x0284c7,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.25 : 0.18
    });
    const globeMesh = new THREE.Mesh(globeGeo, globeMat);
    globeGroup.add(globeMesh);

    // 2. Global Threat Hotspot Nodes on Surface
    const hotspotCount = 12;
    const hotspotGeo = new THREE.SphereGeometry(0.06, 8, 8);
    const hotspots: THREE.Mesh[] = [];

    for (let i = 0; i < hotspotCount; i++) {
      const lat = (Math.random() - 0.5) * Math.PI * 0.8;
      const lon = Math.random() * Math.PI * 2;
      const r = 1.32;

      const x = r * Math.cos(lat) * Math.cos(lon);
      const y = r * Math.sin(lat);
      const z = r * Math.cos(lat) * Math.sin(lon);

      const color = i % 3 === 0 ? 0xef4444 : i % 2 === 0 ? 0xf59e0b : 0x06b6d4;
      const mat = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.7
      });
      const mesh = new THREE.Mesh(hotspotGeo, mat);
      mesh.position.set(x, y, z);
      globeGroup.add(mesh);
      hotspots.push(mesh);
    }

    // 3. Equatorial Analytics Ring
    const ringGeo = new THREE.TorusGeometry(1.65, 0.012, 16, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x8b5cf6 : 0x7c3aed,
      transparent: true,
      opacity: isDark ? 0.4 : 0.25
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2.3;
    globeGroup.add(ringMesh);

    // Lighting
    const amb = new THREE.AmbientLight(0xffffff, isDark ? 0.8 : 1.2);
    scene.add(amb);

    // Mouse Interaction
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
      const w = container.clientWidth || 240;
      const h = container.clientHeight || 200;
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

      globeGroup.rotation.y = elapsed * 0.3 + mouseX * 0.4;
      globeGroup.rotation.x = mouseY * 0.2;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      globeGeo.dispose();
      globeMat.dispose();
      hotspotGeo.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      renderer.dispose();
    };
  }, [isDark]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full min-h-[180px] max-h-[220px] flex items-center justify-center relative cursor-grab active:cursor-grabbing"
      aria-label="3D Threat Intelligence Globe"
    />
  );
}
