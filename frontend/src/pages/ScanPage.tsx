import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileSearch,
  Scan,
  Globe,
  Database,
  ShieldAlert,
  ShieldCheck,
  Cpu,
  CheckCircle2,
  Loader2,
  Terminal
} from 'lucide-react';
import { Tag } from '../components/ui';
import { useAnalysis } from '../store/AnalysisContext';
import { analyzeContent } from '../services/api';
import { SCAN_STAGES_CONFIG } from '../utils/constants';
import type { AnalysisRequest, AnalysisResult, ScanStageStatus } from '../types';

export default function ScanPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state: analysisCtx, completeAnalysis, addToHistory } = useAnalysis();

  const request: AnalysisRequest | null = location.state?.request || analysisCtx.currentRequest;

  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [stages, setStages] = useState(
    SCAN_STAGES_CONFIG.map((s, i) => ({
      ...s,
      status: (i === 0 ? 'active' : 'pending') as ScanStageStatus
    }))
  );
  const [progress, setProgress] = useState(10);
  const [logs, setLogs] = useState<string[]>([
    'Secure runtime environment initialized.',
    'Sanitizing raw payload and redacting local PII tokens...',
  ]);

  const resultRef = useRef<AnalysisResult | null>(null);

  // Trigger analysis call immediately
  useEffect(() => {
    if (!request) {
      navigate('/analyze');
      return;
    }

    let isMounted = true;

    async function fetchResult() {
      try {
        const res = await analyzeContent(request!);
        if (isMounted) {
          resultRef.current = res;
        }
      } catch (err) {
        console.error('Scan error:', err);
      }
    }

    fetchResult();

    return () => {
      isMounted = false;
    };
  }, [request, navigate]);

  // Stage progression loop
  useEffect(() => {
    if (!request) return;

    const logMessages = [
      ['Parsing input structure...', 'OCR tokenization complete.'],
      ['Evaluating psychological coercion patterns...', 'Urgency heuristics analyzed.'],
      ['Querying IDN punycode registers...', 'Domain provenance corroborated.'],
      ['Cross-checking threat intelligence databases...', 'Corroborating indicators.'],
      ['Computing calibrated 0–100 risk score...', 'Risk matrix synthesized.'],
      ['Formulating tactical containment directives...', 'Final security report compiled.']
    ];

    const interval = setInterval(() => {
      setCurrentStageIdx((prevIdx) => {
        const nextIdx = prevIdx + 1;

        if (nextIdx < SCAN_STAGES_CONFIG.length) {
          setStages((prevStages) =>
            prevStages.map((st, i) => {
              if (i < nextIdx) return { ...st, status: 'complete' as ScanStageStatus };
              if (i === nextIdx) return { ...st, status: 'active' as ScanStageStatus };
              return { ...st, status: 'pending' as ScanStageStatus };
            })
          );

          setProgress(Math.round(((nextIdx + 1) / SCAN_STAGES_CONFIG.length) * 100));

          if (logMessages[nextIdx]) {
            setLogs((prev) => [...prev, ...logMessages[nextIdx]]);
          }

          return nextIdx;
        } else {
          // Finished all stages
          clearInterval(interval);

          const finalResult = resultRef.current;
          if (finalResult) {
            completeAnalysis(finalResult);
            addToHistory(request.inputType, request.content.slice(0, 100), finalResult);
            navigate('/results', { state: { result: finalResult } });
          } else {
            // Fallback timeout
            setTimeout(() => {
              if (resultRef.current) {
                completeAnalysis(resultRef.current);
                addToHistory(request.inputType, request.content.slice(0, 100), resultRef.current);
                navigate('/results', { state: { result: resultRef.current } });
              }
            }, 600);
          }
          return prevIdx;
        }
      });
    }, 900);

    return () => clearInterval(interval);
  }, [request, navigate, completeAnalysis, addToHistory]);

  const stageIcons = [
    <FileSearch className="w-4 h-4" key="1" />,
    <Scan className="w-4 h-4" key="2" />,
    <Globe className="w-4 h-4" key="3" />,
    <Database className="w-4 h-4" key="4" />,
    <ShieldAlert className="w-4 h-4" key="5" />,
    <ShieldCheck className="w-4 h-4" key="6" />
  ];

  return (
    <div className="min-h-screen py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 mb-3">
          <Tag>
            <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
            <span>Autonomous Swarm Execution</span>
          </Tag>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
          Analyzing Threat Vectors
        </h1>
        <p className="text-sm text-slate-600 dark:text-zinc-400">
          6 autonomous agents are scrutinizing your payload across behavioral, domain, and linguistic models.
        </p>

        {/* Global Progress Bar */}
        <div className="mt-6 max-w-md mx-auto">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-600 dark:text-zinc-400 mb-2">
            <span>PIPELINE PROGRESS</span>
            <span className="text-cyan-400">{progress}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full"
              initial={{ width: '10%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* 6-Stage Pipeline Grid (EqtyLab Card Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stages.map((stage, idx) => {
          const isActive = stage.status === 'active';
          const isCompleted = stage.status === 'complete';

          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`p-5 rounded-2xl border backdrop-blur-xl transition-all ${
                isActive
                  ? 'bg-violet-500/10 border-violet-400/60 shadow-lg shadow-violet-500/10 ring-1 ring-violet-400/30'
                  : isCompleted
                  ? 'bg-white/70 dark:bg-white/[0.03] border-emerald-500/30 text-slate-700 dark:text-zinc-200'
                  : 'bg-white/40 dark:bg-white/[0.01] border-slate-200 dark:border-white/5 opacity-50'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                      isActive
                        ? 'bg-violet-500/20 border-violet-400 text-violet-300'
                        : isCompleted
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400'
                    }`}
                  >
                    {stageIcons[idx]}
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-zinc-500 font-bold block">
                      Stage {idx + 1}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{stage.name}</h3>
                  </div>
                </div>

                <div>
                  {isActive && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-violet-500/20 text-violet-300 border border-violet-400/40">
                      <Loader2 className="w-3 h-3 animate-spin text-cyan-400" />
                      <span>PROCESSING</span>
                    </span>
                  )}
                  {isCompleted && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>VERIFIED</span>
                    </span>
                  )}
                  {!isActive && !isCompleted && (
                    <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-600 uppercase font-semibold">
                      PENDING
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-zinc-400 mt-2.5 pl-12 leading-relaxed">
                {stage.description}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Live Terminal Audit Feed */}
      <div className="p-5 rounded-3xl bg-slate-950 border border-white/10 shadow-2xl font-mono text-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-white/10 text-zinc-400">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-white">Agentic Execution Stream</span>
          </div>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            LIVE AUDIT
          </span>
        </div>

        <div className="space-y-1.5 max-h-36 overflow-y-auto pr-2 text-zinc-300">
          {logs.map((log, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-cyan-400 select-none">&gt;</span>
              <span>{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
