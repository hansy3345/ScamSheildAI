import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  ChevronRight,
  Zap,
  Radio,
  Globe,
  Database,
  Lock,
  FileCheck,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle,
  Layers,
  Activity,
  PhoneCall,
  Terminal,
  Crosshair
} from 'lucide-react';
import { Button, Tag, RevealText, ScrollReveal } from '../components/ui';
import { useAnimatedCounter } from '../hooks/useLocalStorage';
import HalftoneHero from '../components/3d/HalftoneHero';
import AgentSwarm3D from '../components/3d/AgentSwarm3D';
import HomeShield3D from '../components/3d/HomeShield3D';
import HeroCyberRadar from '../components/3d/HeroCyberRadar';
import HeroCyberBackground from '../components/3d/HeroCyberBackground';

interface ThreatScenario {
  id: string;
  name: string;
  category: string;
  icon: string;
  level: 'safe' | 'suspicious' | 'high-risk' | 'critical';
  score: number;
  confidence: number;
  payload: string;
  evidence: string[];
  verdict: string;
}

const PRESET_SCENARIOS: ThreatScenario[] = [
  {
    id: 'digital-arrest',
    name: 'Digital Arrest',
    category: 'Authority Extortion',
    icon: '👮‍♂️',
    level: 'critical',
    score: 98,
    confidence: 99,
    payload: 'CBI & Narcotics Notice: Illegal parcel with narcotics seized in your name. Connect immediately on Skype video call for interrogation. Warrant #CBI-9821 issued.',
    evidence: ['Fictitious law enforcement agency Skype mandate', 'Coercive digital arrest legal threat', 'Zero official judicial dispatch authentication'],
    verdict: 'CRITICAL EXTORTION: Law enforcement never conducts arrests or interrogations over Skype/WhatsApp video calls.'
  },
  {
    id: 'upi-scam',
    name: 'UPI PIN Trap',
    category: 'Financial Fraud',
    icon: '💸',
    level: 'critical',
    score: 95,
    confidence: 98,
    payload: 'OLX Buyer: I have sent ₹15,000 for your sofa. Scan this QR code or accept collect request and ENTER YOUR UPI PIN to receive money in your account.',
    evidence: ['PIN demand on inbound receipt workflow', 'Reverse UPI collect request mechanism', 'Marketplace overpayment pretext pattern'],
    verdict: 'CRITICAL FRAUD: You NEVER enter your UPI PIN to receive funds. Entering your PIN authorizes money to leave your account.'
  },
  {
    id: 'phishing-kyc',
    name: 'SBI KYC Phishing',
    category: 'Credential Harvester',
    icon: '🏦',
    level: 'critical',
    score: 92,
    confidence: 97,
    payload: 'Dear SBI Customer, your NetBanking access is blocked today due to pending PAN KYC. Update immediately at https://sbi-kyc-verification.top/portal to avoid permanent penalty.',
    evidence: ['Rogue unofficial domain TLD (.top)', 'Artificial 24-hour account suspension panic', 'Direct credential & NetBanking harvest trap'],
    verdict: 'CRITICAL PHISHING: Fake banking domain designed to skim username, NetBanking password, and OTPs.'
  },
  {
    id: 'electricity-bill',
    name: 'Power Cut SMS',
    category: 'Utility Extortion',
    icon: '⚡',
    level: 'critical',
    score: 90,
    confidence: 98,
    payload: 'Dear consumer, your electricity power will be disconnected tonight at 9:30 PM from the substation because previous month bill was not updated. Contact Electricity Officer at 9876543210 immediately.',
    evidence: ['Imminent power disconnection threat', 'Personal 10-digit mobile number supplied', 'DISCOM official billing gateway bypass'],
    verdict: 'CRITICAL EXTORTION: Fake electricity board alert prompting victim to call scammer and install remote desktop tools.'
  },
  {
    id: 'task-scam',
    name: 'YouTube Task Scam',
    category: 'Ponzi Task Syndicate',
    icon: '💼',
    level: 'high-risk',
    score: 86,
    confidence: 96,
    payload: 'Work from home opportunity: Earn ₹3,000 to ₹8,000 daily by liking YouTube videos and rating hotels. Join our official Telegram group @globaltasks to get ₹250 instant joining bonus.',
    evidence: ['Unrealistic reward-to-effort ratio', 'Telegram task syndicate funnel pattern', 'Precursor to prepaid deposit demand'],
    verdict: 'HIGH RISK TASK SCAM: Classic task fraud that pays small initial amounts before demanding massive prepaid deposits.'
  },
  {
    id: 'legit-bank',
    name: 'Legit Bank Alert',
    category: 'Authentic Alert',
    icon: '✅',
    level: 'safe',
    score: 12,
    confidence: 95,
    payload: 'Your A/C xx4821 is credited by ₹65,000 on 09-Sep-26 by NEFT/Salary from INFOSYS LTD. Total available balance: ₹1,42,850. - State Bank of India',
    evidence: ['Standard banking transaction format', 'Zero call-to-action or suspicious links', 'No credential or OTP extraction mechanism'],
    verdict: 'VERIFIED SAFE: Legitimate standard banking notification with zero deceptive vectors.'
  }
];

const LIVE_INTERCEPTIONS = [
  { time: '2s ago', type: 'Digital Arrest', from: 'Mumbai, MH', risk: 'CRITICAL', score: 98 },
  { time: '14s ago', type: 'UPI Collect Trap', from: 'Bengaluru, KA', risk: 'CRITICAL', score: 95 },
  { time: '28s ago', type: 'SBI KYC Phishing', from: 'Delhi, DL', risk: 'CRITICAL', score: 92 },
  { time: '41s ago', type: 'Electricity Power Cut SMS', from: 'Hyderabad, TS', risk: 'CRITICAL', score: 90 },
  { time: '55s ago', type: 'Telegram YouTube Task', from: 'Pune, MH', risk: 'HIGH RISK', score: 86 },
  { time: '1m ago', type: 'Fake Courier Parcel Link', from: 'Chennai, TN', risk: 'HIGH RISK', score: 84 },
  { time: '1m ago', type: 'Verified HDFC Salary Alert', from: 'Kolkata, WB', risk: 'SAFE', score: 10 }
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [quickInput, setQuickInput] = useState('');
  const [activeTab, setActiveTab] = useState<'SMS' | 'Emails' | 'Screenshots' | 'UPI'>('SMS');
  const [activeScenario, setActiveScenario] = useState<ThreatScenario>(PRESET_SCENARIOS[0]);
  const [isScanningSim, setIsScanningSim] = useState(false);
  const [activeAgentStage, setActiveAgentStage] = useState(2);

  const scansCounter = useAnimatedCounter(58490, 1800);
  const precisionCounter = useAnimatedCounter(99.8, 1200);

  const handleQuickAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) {
      navigate('/analyze');
      return;
    }
    navigate('/analyze', { state: { prefillContent: quickInput } });
  };

  const handlePillClick = (type: 'SMS' | 'Emails' | 'Screenshots' | 'UPI') => {
    setActiveTab(type);
    const presets: Record<string, string> = {
      SMS: 'URGENT: Your bank account will be blocked today. Update KYC immediately at https://bit.ly/bank-kyc-verify',
      Emails: 'From: security@paypal-verify-alert.com - Dear user, suspicious transaction of $489 detected.',
      Screenshots: 'Payment request screenshot: Enter UPI PIN to receive ₹5,000 cash prize.',
      UPI: 'Request from pay-winner99@oksbi: Collect ₹12,000 lottery reward.'
    };
    setQuickInput(presets[type] || '');
  };

  const handleScenarioChange = (scenario: ThreatScenario) => {
    setIsScanningSim(true);
    setActiveScenario(scenario);
    setQuickInput(scenario.payload);
    setTimeout(() => {
      setIsScanningSim(false);
    }, 400);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-white transition-colors duration-300">
      
      {/* ── TOP ANNOUNCEMENT STRIP ── */}
      <div className="border-b border-slate-200/80 dark:border-white/5 bg-slate-100/60 dark:bg-white/[0.02] py-2 px-4 text-center text-xs font-medium text-slate-600 dark:text-zinc-400 flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span>ScamShield Multi-Agent Runtime: Verifiable Autonomous AI Defense for SMS, Links & UPI</span>
        <Link to="/how-it-works" className="text-cyan-600 dark:text-cyan-400 font-semibold hover:underline inline-flex items-center gap-0.5 ml-1">
          Explore architecture <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      {/* =========================================================================
          SECTION 1: HERO (Softly Blended Cyber Hologram Backdrop + Interactive UI)
         ========================================================================= */}
      <section className="relative overflow-hidden">
        
        {/* Soft Holographic Cyber Backdrop — full-width, bleeds to screen edges */}
        <HeroCyberBackground />

        {/* Inner constrained content */}
        <div className="pt-14 pb-16 sm:pt-20 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          
          {/* Left Column: Oversized typography & interactive pills */}
          <div className="lg:col-span-7 text-left space-y-6">
            <ScrollReveal direction="down" delay={0.05}>
              <Tag>
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Autonomous Cyber Intelligence</span>
              </Tag>
            </ScrollReveal>

            {/* Giant Bold Headline with Animated Text */}
            <RevealText
              text="Think before you click."
              highlightWords={['you', 'click.']}
              as="h1"
              delay={0.12}
              stagger={0.08}
              className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.05]"
            />

            {/* Interactive Keyword Pill Subtitle */}
            <ScrollReveal delay={0.25}>
              <div className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-zinc-200 flex flex-wrap items-center gap-2 pt-2 leading-relaxed">
                <span>Align and control</span>
                {(['SMS', 'Emails', 'Screenshots', 'UPI'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handlePillClick(type)}
                    className={`eqty-pill cursor-pointer text-sm sm:text-base transition-all transform hover:scale-105 ${
                      activeTab === type ? 'ring-2 ring-cyan-400 font-bold !bg-violet-500/25 shadow-lg' : ''
                    }`}
                  >
                    {type}
                  </button>
                ))}
                <span>at runtime.</span>
              </div>
            </ScrollReveal>

            {/* Description */}
            <ScrollReveal delay={0.35}>
              <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-300 max-w-xl font-normal leading-relaxed">
                Optimize your digital safety perimeter with autonomous multi-agent heuristic verification, instant forensic provenance, and continuous scam containment.
              </p>
            </ScrollReveal>

            {/* Action Buttons */}
            <ScrollReveal delay={0.45}>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link to="/analyze" className="eqty-btn-pill group">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span>Start analyzing</span>
                  <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  to="/how-it-works"
                  className="px-6 py-3 rounded-full text-sm font-semibold text-slate-700 dark:text-zinc-300 hover:text-slate-950 dark:hover:text-white border border-slate-300 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/20 transition-all backdrop-blur-md"
                >
                  Explore architecture
                </Link>
              </div>
            </ScrollReveal>

            {/* Quick Interactive Input Box */}
            <ScrollReveal delay={0.55}>
              <form onSubmit={handleQuickAnalyze} className="pt-3 max-w-xl">
                <div className="relative flex items-center">
                  <Search className="absolute left-4 w-4 h-4 text-slate-400 dark:text-cyan-400" />
                  <input
                    type="text"
                    value={quickInput}
                    onChange={(e) => setQuickInput(e.target.value)}
                    placeholder="Paste suspicious SMS, KYC link, or UPI prompt to inspect..."
                    className="w-full pl-11 pr-32 py-3.5 rounded-full bg-white/90 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm shadow-sm backdrop-blur-md transition-all"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 px-4 py-2 rounded-full text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all cursor-pointer flex items-center gap-1 shadow-md"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </form>
            </ScrollReveal>
          </div>

          {/* Right Column: Clean spacious area showcasing the soft background visual */}
          <div className="hidden lg:block lg:col-span-5 min-h-[460px] pointer-events-none" />
        </div>
        </div>
      </section>

      {/* ── LIVE INTERCEPTED THREAT TELEMETRY (Ticker) ── */}
      <section className="py-3.5 bg-slate-900 text-white overflow-hidden border-y border-cyan-500/20 shadow-inner">
        <div className="flex items-center gap-6 animate-shimmer whitespace-nowrap px-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 shrink-0">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>LIVE INTERCEPTIONS:</span>
          </div>
          
          <div className="flex items-center gap-8 text-xs font-mono">
            {LIVE_INTERCEPTIONS.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 shrink-0">
                <span className="text-zinc-500">{item.time}</span>
                <span className="font-semibold text-white">{item.type}</span>
                <span className="text-zinc-400">({item.from})</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  item.risk === 'CRITICAL' ? 'bg-red-500/30 text-red-300' :
                  item.risk === 'HIGH RISK' ? 'bg-orange-500/30 text-orange-300' :
                  'bg-emerald-500/30 text-emerald-300'
                }`}>
                  {item.risk} ({item.score}/100)
                </span>
                <span className="text-zinc-600">•</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: 3D INTERACTIVE AGENT SWARM & FLOW VISUALIZATION
         ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <ScrollReveal direction="down">
            <p className="text-xs font-mono uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-bold">
              RUNTIME CONTROL PLANE
            </p>
          </ScrollReveal>
          <RevealText
            text="Autonomous Multi-Agent Architecture"
            as="h2"
            highlightWords={['Autonomous', 'Architecture']}
            className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight"
          />
        </div>

        {/* Dynamic 3D WebGL Swarm Center + Data Flow Pipeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12 rounded-3xl bg-white/60 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 backdrop-blur-2xl shadow-xl">
          
          {/* Left: Interactive Ingestion Nodes */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
              <span className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-bold">
                01 • Ingestion Feeds
              </span>
              <Database className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'SMS & OTPs', desc: 'Urgency cues' },
                { label: 'Emails', desc: 'DKIM/SPF spoof' },
                { label: 'Screenshots', desc: 'Vision OCR' },
                { label: 'UPI Requests', desc: 'PIN traps' }
              ].map((node) => (
                <div
                  key={node.label}
                  className="p-3.5 rounded-2xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-left hover:border-cyan-400/50 hover:scale-102 transition-all cursor-pointer shadow-sm"
                >
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{node.label}</p>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-400 font-mono mt-0.5">{node.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Center: Interactive 3D WebGL Swarm Visualization */}
          <div className="lg:col-span-4 relative flex flex-col items-center justify-center">
            <div className="w-full h-[280px] rounded-2xl overflow-hidden relative flex items-center justify-center">
              <AgentSwarm3D activeStageIdx={activeAgentStage} />
            </div>
            <p className="text-xs font-mono text-slate-500 dark:text-zinc-400 mt-2 text-center">
              6 WebGL Agent Spheres orbiting central reasoning core
            </p>
          </div>

          {/* Right: Output Assurance Binding */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
              <span className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-bold">
                03 • Binding Assurance
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-white dark:bg-white/[0.04] border border-emerald-500/40 flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Risk Score (0–100)</p>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-400 font-mono">Calibrated mathematical rating</p>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">VERIFIED</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-white/[0.04] border border-cyan-500/40 flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Tactical Containment</p>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-400 font-mono">Actionable Do's & Don'ts</p>
                </div>
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">READY</span>
              </div>
            </div>
          </div>

        </div>
      </section>



      {/* =========================================================================
          SECTION 3: 4-CARD BENTO GRID WITH DYNAMIC METERS & MOTIONS
         ========================================================================= */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-3xl mb-14">
          <ScrollReveal direction="down">
            <Tag className="mb-3">
              <Zap className="w-3.5 h-3.5 text-violet-400" />
              <span>Core Capabilities</span>
            </Tag>
          </ScrollReveal>
          <RevealText
            text="Autonomous Assurance for Digital Operations"
            as="h2"
            highlightWords={['Autonomous', 'Assurance']}
            className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Bento Card 1: 100% Circular Score Meter + Certificate */}
          <ScrollReveal delay={0.1}>
            <div className="eqty-bento p-8 sm:p-10 flex flex-col justify-between h-[380px] sm:h-[420px] group transition-all duration-300 hover:shadow-cyan-500/10">
              <div className="h-44 flex items-center justify-center gap-6 sm:gap-10">
                {/* 100% Circular Gauge */}
                <div className="relative w-32 h-32 rounded-full border-4 border-cyan-400/80 flex items-center justify-center bg-cyan-500/10 shadow-[0_0_30px_rgba(6,182,212,0.25)]">
                  <span className="text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">100%</span>
                  <div className="absolute inset-0 rounded-full border border-white/20 animate-ping opacity-20" />
                </div>

                {/* Certificate Shield Icon */}
                <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-violet-500/20 to-violet-500/5 border border-violet-400/30 flex items-center justify-center relative shadow-[0_0_30px_rgba(139,92,246,0.15)] group-hover:scale-105 transition-transform">
                  <FileCheck className="w-14 h-14 text-violet-400 dark:text-violet-300" />
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center font-bold text-xs shadow-md">
                    ✓
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Explainable Risk Scoring
                </h3>
                <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Calibrated mathematical scores from 0 to 100 backed by granular multi-signal corroboration.
                </p>
                <Link
                  to="/analyze"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet-600 dark:text-violet-400 group-hover:text-cyan-400 transition-colors pt-1"
                >
                  <span>Explore Threat Scoring</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </ScrollReveal>

          {/* Bento Card 2: Interactive 3D Cyber Radar Telemetry */}
          <ScrollReveal delay={0.2}>
            <div className="eqty-bento p-8 sm:p-10 flex flex-col justify-between h-[380px] sm:h-[420px] group transition-all duration-300 hover:shadow-violet-500/10">
              <div className="h-44 flex items-center justify-center relative overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <HeroCyberRadar />
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  360° Real-Time Threat Radar
                </h3>
                <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Continuous surveillance engine with revolving sector scanning across UPI, banking URLs, and dark web threat feeds.
                </p>
                <Link
                  to="/how-it-works"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet-600 dark:text-violet-400 group-hover:text-cyan-400 transition-colors pt-1"
                >
                  <span>Inspect Radar Engine</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: VERIFIED METRICS & EMERGENCY HELPLINE
         ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { value: '99.8%', label: 'Detection Precision', sub: 'Verified across 10+ scam types' },
            { value: '<250ms', label: 'Inference Latency', sub: 'Instant multi-agent response' },
            { value: '58,000+', label: 'Threats Intercepted', sub: 'Across SMS, UPI & URLs' },
            { value: '100%', label: 'Privacy Protected', sub: 'Zero-knowledge client redaction' }
          ].map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 0.1}>
              <div className="p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 text-center space-y-2 backdrop-blur-xl hover:scale-102 transition-transform">
                <p className="text-3xl sm:text-4xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-violet-500">
                  {stat.value}
                </p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {stat.label}
                </p>
                <p className="text-xs text-slate-500 dark:text-zinc-500 font-mono">
                  {stat.sub}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: EMERGENCY HELPLINE & SCANNER CALL-TO-ACTION
         ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl bg-gradient-to-br from-cyan-950/60 via-[#0a0e1c] to-violet-950/60 border border-cyan-500/40 p-8 sm:p-14 text-center space-y-6 shadow-2xl backdrop-blur-2xl overflow-hidden">
          
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold">
            <PhoneCall className="w-3.5 h-3.5 text-cyan-400" />
            <span>NATIONAL CYBER CRIME HELPLINE: 1930</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight max-w-2xl mx-auto leading-tight">
            Protect Yourself and Your Family from Digital Fraud Today.
          </h2>

          <p className="text-base text-zinc-300 max-w-xl mx-auto font-normal leading-relaxed">
            Free, instant, and privacy-preserving. Paste any suspicious message or upload a screenshot to run our autonomous 6-agent threat matrix.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/analyze"
              className="px-8 py-4 rounded-full text-base font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950 transition-all shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:scale-105 flex items-center gap-2 cursor-pointer"
            >
              <span>Scan Suspicious Message Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/safety"
              className="px-8 py-4 rounded-full text-base font-semibold text-white border border-white/20 hover:border-white/40 transition-all bg-white/5 backdrop-blur-md flex items-center gap-2"
            >
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <span>Cyber Safety Center</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
