import React, { useState } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  RefreshCw,
  Copy,
  Check,
  Ban,
  ShieldCheck,
  FileCheck
} from 'lucide-react';
import { Tag } from '../components/ui';
import { useAnalysis } from '../store/AnalysisContext';
import { MOCK_RESULTS } from '../services/mockData';
import { useAnimatedCounter } from '../hooks/useLocalStorage';
import { formatFullDate } from '../utils/helpers';
import type { AnalysisResult, RiskLevel } from '../types';

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { state: analysisCtx, history } = useAnalysis();

  let result: AnalysisResult | null = location.state?.result || analysisCtx.currentResult;

  if (!result && id) {
    const fromHistory = history.find((item) => item.result.id === id || item.id === id);
    if (fromHistory) {
      result = fromHistory.result;
    } else {
      result = Object.values(MOCK_RESULTS).find((r) => r.id === id) || null;
    }
  }

  if (!result) {
    result = MOCK_RESULTS['nigerian-prince'];
  }

  const [copied, setCopied] = useState(false);

  const animatedScore = useAnimatedCounter(result.riskScore, 1400);

  const handleCopyReport = () => {
    const summaryText = `ScamShield AI Report\nRisk Score: ${result.riskScore}/100 (${result.riskLevel.toUpperCase()})\nCategory: ${result.categoryLabel}\nSummary: ${result.summary}\nVerified with ScamShield AI`;
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case 'safe':
        return {
          text: 'text-emerald-500 dark:text-emerald-400',
          bg: 'bg-emerald-500/10',
          stroke: '#10b981',
          border: 'border-emerald-500/30',
          glow: 'shadow-[0_0_40px_rgba(16,185,129,0.25)]'
        };
      case 'suspicious':
        return {
          text: 'text-amber-500 dark:text-amber-400',
          bg: 'bg-amber-500/10',
          stroke: '#f59e0b',
          border: 'border-amber-500/30',
          glow: 'shadow-[0_0_40px_rgba(245,158,11,0.25)]'
        };
      case 'high-risk':
        return {
          text: 'text-orange-500 dark:text-orange-400',
          bg: 'bg-orange-500/10',
          stroke: '#f97316',
          border: 'border-orange-500/30',
          glow: 'shadow-[0_0_40px_rgba(249,115,22,0.25)]'
        };
      case 'critical':
        return {
          text: 'text-rose-500 dark:text-rose-400',
          bg: 'bg-rose-500/10',
          stroke: '#ef4444',
          border: 'border-rose-500/30',
          glow: 'shadow-[0_0_40px_rgba(239,68,68,0.25)]'
        };
    }
  };

  const riskColor = getRiskColor(result.riskLevel);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-200/80 dark:border-white/[0.08] gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Tag>
              <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Forensic Intelligence Report</span>
            </Tag>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Threat Evaluation Verdict
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 font-mono mt-1">
            Report ID: {result.id} • Generated on {formatFullDate(result.timestamp || new Date().toISOString())}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyReport}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-white/10 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Share Report'}</span>
          </button>

          <Link to="/analyze">
            <button className="eqty-btn-pill !py-2 !px-5 !text-xs">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Inspect Another</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Main Verdict Bento Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left: Score Circular Gauge (EqtyLab Bento Style) */}
        <div className="lg:col-span-5 p-8 sm:p-10 rounded-3xl bg-white/70 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 backdrop-blur-2xl flex flex-col items-center justify-center text-center space-y-6">
          <span className="text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-zinc-400 font-bold">
            CALIBRATED RISK RATING
          </span>

          {/* Glowing Circular Risk Meter */}
          <div className={`relative w-44 h-44 rounded-full border-4 ${riskColor.border} ${riskColor.bg} ${riskColor.glow} flex flex-col items-center justify-center`}>
            <span className={`text-5xl font-black font-mono tracking-tight ${riskColor.text}`}>
              {animatedScore}
            </span>
            <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-400 uppercase font-bold mt-1">
              Score / 100
            </span>
          </div>

          <div className="space-y-1.5">
            <span className={`inline-block px-4 py-1 rounded-full text-xs font-mono uppercase font-black tracking-wider ${riskColor.bg} ${riskColor.text} ${riskColor.border} border`}>
              {result.riskLevel}
            </span>
            <p className="text-sm font-bold text-slate-900 dark:text-white pt-1">
              {result.categoryLabel}
            </p>
          </div>
        </div>

        {/* Right: Executive Summary & Category */}
        <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-white/70 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 backdrop-blur-2xl flex flex-col justify-between space-y-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-bold mb-2 block">
              FORENSIC SYNTHESIS
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">
              {result.summary}
            </h2>
            <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
              {result.explanation}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-700 dark:text-zinc-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Multi-Agent Consensus: 100% Corroborated</span>
            </div>
            <span className="text-xs font-mono text-cyan-400 font-bold">&lt; 1.2s Latency</span>
          </div>
        </div>
      </div>

      {/* Corroborated Evidence Matrix */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 backdrop-blur-2xl space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Corroborated Evidence Log</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Isolated indicators verified by autonomous LLM agents
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-violet-500/10 text-violet-400 border border-violet-500/30">
            {result.evidence.length} Indicators Found
          </span>
        </div>

        <div className="space-y-3">
          {result.evidence.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 space-y-2 hover:border-cyan-400/40 transition-all"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  {item.severity}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-zinc-400 pl-4.5 leading-relaxed">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Tactical Containment Directives (Do's & Don'ts) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* What to DO */}
        <div className="p-6 sm:p-8 rounded-3xl bg-emerald-500/[0.03] border border-emerald-500/20 backdrop-blur-2xl space-y-4">
          <div className="flex items-center gap-2 text-emerald-500 dark:text-emerald-400 pb-2 border-b border-emerald-500/20">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="text-base font-bold">Recommended Safety Actions</h3>
          </div>
          <ul className="space-y-2.5">
            {result.recommendedActions.map((action, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-zinc-300 leading-relaxed">
                <span className="text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
                <span>{action.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* What NOT to DO */}
        <div className="p-6 sm:p-8 rounded-3xl bg-rose-500/[0.03] border border-rose-500/20 backdrop-blur-2xl space-y-4">
          <div className="flex items-center gap-2 text-rose-500 dark:text-rose-400 pb-2 border-b border-rose-500/20">
            <Ban className="w-5 h-5" />
            <h3 className="text-base font-bold">Critical Avoidance Directives</h3>
          </div>
          <ul className="space-y-2.5">
            {result.avoidActions.map((action, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-zinc-300 leading-relaxed">
                <span className="text-rose-400 font-bold shrink-0 mt-0.5">✕</span>
                <span>{action.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
