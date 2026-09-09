import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../../store/ThemeContext';
import type { RiskLevel } from '../../types';

interface ResultRiskOrbProps {
  score: number;
  level: RiskLevel;
}

export default function ResultRiskOrb3D({ score, level }: ResultRiskOrbProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 280;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const orbGroup = new THREE.Group();
    scene.add(orbGroup);

    // Color & behavior profiles
    const configMap: Record<RiskLevel, { color: number; speed: number; emissive: number; roughness: number }> = {
      safe: { color: 0x10b981, speed: 0.8, emissive: 0.4, roughness: 0.1 },
      suspicious: { color: 0xf59e0b, speed: 1.3, emissive: 0.5, roughness: 0.15 },
      'high-risk': { color: 0xf97316, speed: 1.8, emissive: 0.65, roughness: 0.2 },
      critical: { color: 0xef4444, speed: 2.4, emissive: 0.8, roughness: 0.25 }
    };

    const cfg = configMap[level] || configMap.critical;

    // 1. Translucent Outer Glass Orb
    const outerGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const outerMat = new THREE.MeshPhysicalMaterial({
      color: isDark ? 0x0f172a : 0xf8fafc,
      emissive: cfg.color,
      emissiveIntensity: isDark ? cfg.emissive * 0.5 : cfg.emissive * 0.3,
      metalness: 0.1,
      roughness: cfg.roughness,
      transmission: 0.85,
      transparent: true,
      opacity: 0.75,
      ior: 1.4,
      clearcoat: 1.0
    });
    const outerOrb = new THREE.Mesh(outerGeo, outerMat);
    orbGroup.add(outerOrb);

    // 2. Glowing Inner Energy Core
    const innerGeo = new THREE.IcosahedronGeometry(0.65, 2);
    const innerMat = new THREE.MeshStandardMaterial({
      color: cfg.color,
      emissive: cfg.color,
      emissiveIntensity: cfg.emissive,
      wireframe: true
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    orbGroup.add(innerCore);

    // 3. Thin Layered Scanning Rings
    const ringGeo = new THREE.TorusGeometry(1.5, 0.015, 16, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: cfg.color,
      transparent: true,
      opacity: 0.45
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 3;
    orbGroup.add(ringMesh);

    // Lights
    const amb = new THREE.AmbientLight(0xffffff, isDark ? 0.8 : 1.2);
    scene.add(amb);

    const point = new THREE.PointLight(cfg.color, 1.8, 8);
    point.position.set(0, 0, 2);
    scene.add(point);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 320;
      const h = container.clientHeight || 280;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime() * cfg.speed;

      // Soft breathing pulse
      const pulse = 1.0 + Math.sin(elapsed * 2.0) * (level === 'critical' ? 0.07 : 0.03);
      innerCore.scale.set(pulse, pulse, pulse);

      innerCore.rotation.y = elapsed * 0.4;
      innerCore.rotation.x = elapsed * 0.25;
      ringMesh.rotation.z = -elapsed * 0.5;

      orbGroup.position.y = Math.sin(elapsed * 1.2) * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      outerGeo.dispose();
      outerMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      renderer.dispose();
    };
  }, [isDark, score, level]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full min-h-[220px] max-h-[280px] flex items-center justify-center relative pointer-events-none"
      aria-label="3D Result Risk Orb"
    />
  );
}
