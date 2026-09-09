import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileSearch,
  Scan,
  Globe,
  Database,
  ShieldAlert,
  ShieldCheck,
  ArrowRight,
  Cpu,
  Sparkles,
  Lock,
  Layers,
  Terminal
} from 'lucide-react';
import { Tag, SectionLine, RevealText, ScrollReveal } from '../components/ui';

interface AgentDetail {
  step: string;
  name: string;
  role: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  inputs: string[];
  outputs: string[];
}

const AGENTS: AgentDetail[] = [
  {
    step: '01',
    name: 'Content & OCR Extraction Agent',
    role: 'Multimodal Parsing',
    icon: <FileSearch className="w-5 h-5 text-cyan-400" />,
    color: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
    description:
      'Performs optical character recognition on screenshots and structures raw SMS, emails, or job texts into semantic tokens while scrubbing sensitive PII locally.',
    inputs: ['Raw text, screenshot images, email headers, URLs'],
    outputs: ['Extracted tokens, structured entities, sender metadata']
  },
  {
    step: '02',
    name: 'Scam Pattern & Coercion Agent',
    role: 'Behavioral NLP',
    icon: <Scan className="w-5 h-5 text-violet-400" />,
    color: 'border-violet-500/30 text-violet-400 bg-violet-500/10',
    description:
      'Evaluates psychological coercion triggers: artificial urgency, fear of arrest, reverse UPI PIN traps, and unrealistic task earnings.',
    inputs: ['Structured text, intent vectors'],
    outputs: ['Psychological manipulation index, scam taxonomy match']
  },
  {
    step: '03',
    name: 'URL & Domain Forensic Agent',
    role: 'Threat Intelligence',
    icon: <Globe className="w-5 h-5 text-amber-400" />,
    color: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
    description:
      'Cross-checks URLs against Google Safe Browsing, detects IDN homograph punycode spoofing, and queries domain registration age.',
    inputs: ['Isolated URLs, domain names, short links'],
    outputs: ['Domain reputation score, punycode flags, WHOIS age']
  },
  {
    step: '04',
    name: 'Evidence Synthesis Agent',
    role: 'Signal Corroboration',
    icon: <Database className="w-5 h-5 text-emerald-400" />,
    color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    description:
      'Synthesizes parallel outputs from upstream agents, resolving conflicting signals through corroboration weighting matrices.',
    inputs: ['Agent 1-3 findings, threat feeds'],
    outputs: ['Consolidated indicator matrix, certainty weights']
  },
  {
    step: '05',
    name: 'Risk Calibration Agent',
    role: 'Scoring Engine',
    icon: <ShieldAlert className="w-5 h-5 text-rose-400" />,
    color: 'border-rose-500/30 text-rose-400 bg-rose-500/10',
    description:
      'Calculates an explainable 0–100 risk score and classifies the threat level into Safe, Suspicious, High Risk, or Critical.',
    inputs: ['Consolidated indicators, severity multipliers'],
    outputs: ['Calibrated score (0-100), risk tier, category assignment']
  },
  {
    step: '06',
    name: 'Tactical Containment Agent',
    role: 'Safety Directives',
    icon: <ShieldCheck className="w-5 h-5 text-indigo-400" />,
    color: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10',
    description:
      'Generates plain-language mitigation checklists (Do\'s & Don\'ts), reporting contacts (1930 Helpline), and immediate containment steps.',
    inputs: ['Risk classification, threat category'],
    outputs: ['Executive summary, Do\'s & Don\'ts checklists, report action']
  }
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <ScrollReveal direction="down">
          <Tag>
            <Cpu className="w-3.5 h-3.5 text-violet-400" />
            <span>Autonomous Agentic Network</span>
          </Tag>
        </ScrollReveal>

        <RevealText
          text="Multi-Agent Pipeline Architecture"
          as="h1"
          highlightWords={['Pipeline', 'Architecture']}
          className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight"
        />

        <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 leading-relaxed">
          ScamShield deploys a coordinated swarm of 6 specialized autonomous LLM agents. Each agent handles a dedicated stage of forensic threat verification.
        </p>
      </div>

      {/* 6-Agent Specification Blueprint Cards (EqtyLab Bento Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {AGENTS.map((agent, idx) => (
          <ScrollReveal key={agent.step} delay={idx * 0.08}>
            <div className="p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 backdrop-blur-2xl flex flex-col justify-between h-full space-y-6 hover:border-cyan-400/40 transition-all group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${agent.color}`}>
                    {agent.icon}
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-400 dark:text-zinc-500">
                    STAGE {agent.step}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-600 dark:text-cyan-400 font-bold block">
                    {agent.role}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                    {agent.name}
                  </h3>
                </div>

                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                  {agent.description}
                </p>
              </div>

              {/* Input / Output Vectors */}
              <div className="pt-4 border-t border-slate-100 dark:border-white/5 space-y-2 text-[11px] font-mono">
                <div className="flex items-start gap-2 text-slate-600 dark:text-zinc-400">
                  <span className="text-violet-400 font-bold shrink-0">IN:</span>
                  <span className="truncate">{agent.inputs.join(', ')}</span>
                </div>
                <div className="flex items-start gap-2 text-slate-600 dark:text-zinc-400">
                  <span className="text-cyan-400 font-bold shrink-0">OUT:</span>
                  <span className="truncate">{agent.outputs.join(', ')}</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Verification Protocol Callout Card */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-violet-500/10 via-slate-950 to-cyan-500/10 border border-white/10 backdrop-blur-2xl flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
        <div className="space-y-2 max-w-xl text-left">
          <Tag className="mb-2">
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Zero-Knowledge Privacy Guarantee</span>
          </Tag>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Client-Side Anonymization Engine
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            All bank account numbers, UPI IDs, phone numbers, and names are sanitized in-browser before ingestion. ScamShield never persists un-anonymized personal data.
          </p>
        </div>

        <Link to="/analyze">
          <button className="eqty-btn-pill whitespace-nowrap">
            <span>Test with Live Payload</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </div>
    </div>
  );
}
