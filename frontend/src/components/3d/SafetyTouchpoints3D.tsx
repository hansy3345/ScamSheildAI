import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../../store/ThemeContext';

export default function SafetyTouchpoints3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 280;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const ecosystemGroup = new THREE.Group();
    scene.add(ecosystemGroup);

    // 1. Central Protected Digital Device (Stylized Smartphone)
    const phoneGeo = new THREE.BoxGeometry(0.9, 1.6, 0.08);
    const phoneMat = new THREE.MeshPhysicalMaterial({
      color: isDark ? 0x0f172a : 0xf1f5f9,
      emissive: isDark ? 0x06b6d4 : 0x0284c7,
      emissiveIntensity: 0.2,
      metalness: 0.3,
      roughness: 0.2,
      clearcoat: 0.8
    });
    const phoneMesh = new THREE.Mesh(phoneGeo, phoneMat);
    ecosystemGroup.add(phoneMesh);

    // Screen Glass
    const screenGeo = new THREE.PlaneGeometry(0.75, 1.4);
    const screenMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x082f49 : 0xe0f2fe,
      transparent: true,
      opacity: 0.7
    });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.z = 0.045;
    phoneMesh.add(screenMesh);

    // 2. Floating Touchpoints: Message Bubble, Payment Card, Email, Shield Icon
    // Payment Card
    const cardGeo = new THREE.BoxGeometry(0.8, 0.5, 0.04);
    const cardMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.3,
      roughness: 0.4
    });
    const cardMesh = new THREE.Mesh(cardGeo, cardMat);
    cardMesh.position.set(1.6, 0.7, 0.4);
    cardMesh.rotation.z = -0.2;
    cardMesh.rotation.y = -0.3;
    ecosystemGroup.add(cardMesh);

    // Email Envelope shape
    const mailGeo = new THREE.BoxGeometry(0.6, 0.4, 0.04);
    const mailMat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      emissive: 0x8b5cf6,
      emissiveIntensity: 0.3,
      roughness: 0.3
    });
    const mailMesh = new THREE.Mesh(mailGeo, mailMat);
    mailMesh.position.set(-1.6, 0.6, 0.2);
    mailMesh.rotation.z = 0.25;
    mailMesh.rotation.y = 0.3;
    ecosystemGroup.add(mailMesh);

    // Verified Shield Icon
    const shieldGeo = new THREE.ConeGeometry(0.35, 0.6, 5);
    const shieldMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x10b981,
      emissiveIntensity: 0.4,
      roughness: 0.2
    });
    const shieldIcon = new THREE.Mesh(shieldGeo, shieldMat);
    shieldIcon.position.set(0, -1.3, 0.3);
    shieldIcon.rotation.x = Math.PI;
    ecosystemGroup.add(shieldIcon);

    // Soft Ambient Lights
    const amb = new THREE.AmbientLight(0xffffff, isDark ? 0.9 : 1.3);
    scene.add(amb);

    const dirLight = new THREE.DirectionalLight(0x06b6d4, isDark ? 1.2 : 0.8);
    dirLight.position.set(3, 4, 3);
    scene.add(dirLight);

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
      const w = container.clientWidth || 400;
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
      const elapsed = clock.getElapsedTime();

      // Gentle floating dance
      phoneMesh.position.y = Math.sin(elapsed * 1.2) * 0.08;
      phoneMesh.rotation.y = Math.sin(elapsed * 0.8) * 0.15 + mouseX * 0.2;
      phoneMesh.rotation.x = mouseY * 0.15;

      cardMesh.position.y = 0.7 + Math.sin(elapsed * 1.5 + 1) * 0.06;
      mailMesh.position.y = 0.6 + Math.sin(elapsed * 1.4 + 2) * 0.06;
      shieldIcon.position.y = -1.3 + Math.sin(elapsed * 1.3 + 3) * 0.05;

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
      phoneGeo.dispose();
      phoneMat.dispose();
      screenGeo.dispose();
      screenMat.dispose();
      cardGeo.dispose();
      cardMat.dispose();
      mailGeo.dispose();
      mailMat.dispose();
      shieldGeo.dispose();
      shieldMat.dispose();
      renderer.dispose();
    };
  }, [isDark]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full min-h-[220px] max-h-[280px] flex items-center justify-center relative cursor-grab active:cursor-grabbing"
      aria-label="3D Everyday Digital Safety Touchpoints"
    />
  );
}
