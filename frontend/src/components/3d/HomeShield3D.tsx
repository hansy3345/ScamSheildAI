import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  ShieldAlert,
  Lock,
  DollarSign,
  Search,
  Wallet,
  CreditCard,
  Settings,
  Building2,
  FileCheck2,
  Activity,
  CheckCircle2,
  Sparkles,
  Zap
} from 'lucide-react';
import { useTheme } from '../../store/ThemeContext';

interface CyberNode {
  id: string;
  top: string;
  left: string;
  label: string;
  category: string;
  desc: string;
  metric: string;
  icon: React.ElementType;
}

const CYBER_NODES: CyberNode[] = [
  {
    id: 'shield-lock',
    top: '42%',
    left: '58%',
    label: 'Autonomous Defense Shield',
    category: 'CORE RUNTIME VAULT',
    desc: 'Multi-agent neural barrier blocking unauthorized credential extraction & reverse UPI exploits.',
    metric: '99.8% DEFENSE',
    icon: Lock
  },
  {
    id: 'dollar',
    top: '13%',
    left: '39%',
    label: 'Financial Fraud Interceptor',
    category: 'PAYMENT SECURITY',
    desc: 'Analyzes payment amounts, fake invoices, and lottery extortion patterns in real-time.',
    metric: '<45ms SCAN',
    icon: DollarSign
  },
  {
    id: 'document',
    top: '19%',
    left: '45%',
    label: 'Forensic Evidence Matrix',
    category: 'PROOF AGGREGATION',
    desc: 'Corroborates headers, SMS sender IDs, and threat patterns to construct explainable proof logs.',
    metric: 'VERIFIED',
    icon: FileCheck2
  },
  {
    id: 'monitor',
    top: '14%',
    left: '50%',
    label: 'Live Telemetry Engine',
    category: 'RUNTIME MONITOR',
    desc: 'Continuous real-time behavioral analysis across incoming communications.',
    metric: 'ACTIVE',
    icon: Activity
  },
  {
    id: 'search',
    top: '15%',
    left: '65%',
    label: 'Domain & WHOIS Forensics',
    category: 'INFRASTRUCTURE WHOIS',
    desc: 'Inspects Punycode homographs, typosquats, and rogue domain TLDs (.xyz, .top, .tk).',
    metric: 'CALIBRATED',
    icon: Search
  },
  {
    id: 'wallet',
    top: '38%',
    left: '38%',
    label: 'UPI PIN & QR Guard',
    category: 'TRANSACTION SECURITY',
    desc: 'Stops reverse collect traps and fake marketplace receipt authorizations.',
    metric: 'BLOCKED',
    icon: Wallet
  },
  {
    id: 'credit-card',
    top: '42%',
    left: '43%',
    label: 'Banking Credential Vault',
    category: 'PII REDACTION',
    desc: 'Protects OTP, CVV, NetBanking passwords, and debit card numbers from phishing harvesters.',
    metric: 'ZERO-LOG',
    icon: CreditCard
  },
  {
    id: 'gears',
    top: '59%',
    left: '41%',
    label: 'Agentic Heuristics Swarm',
    category: '6-AGENT SWARM',
    desc: 'Autonomous cross-agent reasoning pipeline executing in parallel for instant risk classification.',
    metric: '6 AGENTS',
    icon: Settings
  },
  {
    id: 'bank',
    top: '62%',
    left: '47%',
    label: 'Institutional Impersonation Shield',
    category: 'BRAND SPOOF RADAR',
    desc: 'Detects fake SBI, HDFC, ICICI, TRAI, and Police/CBI authority impersonation.',
    metric: 'SHIELDED',
    icon: Building2
  },
  {
    id: 'checklist',
    top: '38%',
    left: '82%',
    label: 'Tactical Containment Protocol',
    category: 'MITIGATION BLUEPRINT',
    desc: 'Generates prioritized Do’s and Don’ts, banking freeze guides, and 1930 Cyber Hotline dispatch.',
    metric: 'AUTO-READY',
    icon: Zap
  }
];

export default function HomeShield3D() {
  const { isDark } = useTheme();
  const [activeNode, setActiveNode] = useState<CyberNode | null>(null);

  // Mouse 2D Parallax spring motion
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 22, stiffness: 180 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-14, 14]), springConfig);
  const brightness = useSpring(useTransform(mouseX, [-0.5, 0.5], [0.96, 1.12]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setActiveNode(null);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full min-h-[460px] sm:min-h-[520px] flex items-center justify-center select-none"
      style={{ perspective: 1100 }}
    >
      {/* 3D Moving Holographic Card Container */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          filter: `brightness(${brightness})`,
          transformStyle: 'preserve-3d'
        }}
        animate={{
          y: [-8, 8, -8]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="relative w-full max-w-[560px] rounded-3xl overflow-hidden border border-cyan-500/40 bg-slate-950/85 shadow-[0_0_50px_rgba(6,182,212,0.3)] backdrop-blur-2xl group cursor-pointer"
      >
        {/* Ambient Radial Gradient */}
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-950/40 via-transparent to-violet-950/30 pointer-events-none z-10" />

        {/* The Exact Reference Cyber Security Image */}
        <div className="relative w-full overflow-hidden">
          <motion.img
            src="/images/fraud_alert_hologram.png"
            alt="Cyber Security Holographic Shield"
            className="w-full h-auto object-cover transform group-hover:scale-103 transition-transform duration-700 block"
            animate={{
              scale: [1, 1.015, 1]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />

          {/* 1. Moving Cyber Laser Scanning Beam */}
          <motion.div
            className="absolute left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_18px_#22d3ee] pointer-events-none z-20"
            animate={{
              top: ['0%', '100%', '0%']
            }}
            transition={{
              duration: 3.6,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />

          {/* 2. Moving Horizontal Lens Flare Shimmer */}
          <motion.div
            className="absolute top-0 bottom-0 w-36 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none z-20"
            animate={{
              left: ['-35%', '135%']
            }}
            transition={{
              duration: 4.8,
              repeat: Infinity,
              repeatDelay: 1.2,
              ease: 'easeInOut'
            }}
          />

          {/* 3. Central Glowing Hologram Shockwave Rings */}
          <motion.div
            className="absolute top-[42%] left-[58%] -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full border-2 border-cyan-400/80 pointer-events-none z-20 shadow-[0_0_25px_rgba(6,182,212,0.6)]"
            animate={{
              scale: [0.85, 1.75],
              opacity: [0.9, 0]
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: 'easeOut'
            }}
          />

          <motion.div
            className="absolute top-[42%] left-[58%] -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full border border-violet-400/70 pointer-events-none z-20"
            animate={{
              scale: [0.7, 1.5],
              opacity: [0.8, 0]
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              delay: 0.8,
              ease: 'easeOut'
            }}
          />

          {/* 4. Interactive Glowing Hotspot Nodes on Every Hexagon */}
          {CYBER_NODES.map((node) => {
            const Icon = node.icon;
            const isHovered = activeNode?.id === node.id;

            return (
              <div
                key={node.id}
                style={{ top: node.top, left: node.left }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-30"
                onMouseEnter={() => setActiveNode(node)}
              >
                {/* Hotspot radar ping */}
                <span className="relative flex h-6 w-6 items-center justify-center cursor-pointer group/pin">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75 ${
                    isHovered ? 'scale-150 !bg-cyan-300' : ''
                  }`} />
                  <span className={`relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500 border-2 border-white shadow-[0_0_12px_#22d3ee] transition-all duration-300 ${
                    isHovered ? 'scale-130 !bg-white !border-cyan-400 shadow-[0_0_20px_#22d3ee]' : ''
                  }`} />
                </span>

                {/* Interactive Tooltip Card */}
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 p-3.5 rounded-2xl bg-slate-950/95 border border-cyan-400 text-left shadow-[0_0_30px_rgba(6,182,212,0.4)] backdrop-blur-2xl pointer-events-none z-40"
                  >
                    <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                      <span className="text-[9px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                        {node.category}
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                        {node.metric}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-white mt-1.5 flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{node.label}</span>
                    </p>

                    <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                      {node.desc}
                    </p>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
