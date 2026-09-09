import { Shield, ExternalLink, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionLine from '../ui/SectionLine';

export default function Footer() {
  return (
    <footer className="relative z-10 mt-auto pt-8 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionLine className="my-0 mb-12 opacity-50" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-slate-200/60 dark:border-white/5">
          {/* Brand Column */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-cyan-500" />
                </div>
                <span className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                  ScamShield AI
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 max-w-sm leading-relaxed">
                Autonomous multi-agent cybersecurity intelligence protecting individuals and organizations against social engineering, deceptive scams, and phishing attacks.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400 font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Live Threat Matrix Online</span>
            </div>
          </div>

          {/* Platform Links */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 dark:text-zinc-400 font-bold mb-4">
              Intelligence
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium">
              <li>
                <Link to="/analyze" className="text-slate-600 dark:text-zinc-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Multimodal Threat Scanner
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-slate-600 dark:text-zinc-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Threat Intelligence Feed
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-slate-600 dark:text-zinc-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  6-Stage Autonomous Pipeline
                </Link>
              </li>
              <li>
                <Link to="/safety" className="text-slate-600 dark:text-zinc-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Safety Knowledge Hub
                </Link>
              </li>
            </ul>
          </div>

          {/* Product & Community Links */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 dark:text-zinc-400 font-bold mb-4">
              Governance & Verification
            </h4>
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed mb-4">
              Verifiable AI inference powered by heuristic behavioral analytics and zero-knowledge client privacy protocols.
            </p>
            <div className="flex items-center gap-3">
              <Link
                to="/history"
                className="inline-flex items-center gap-1 text-xs font-mono text-cyan-600 dark:text-cyan-400 hover:underline"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Audit Trail</span>
              </Link>
              <span className="text-slate-300 dark:text-zinc-700">•</span>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-mono text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
              >
                <span>GitHub Repository</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-zinc-400">
          <p>© {new Date().getFullYear()} ScamShield AI Platform. Verifiable Cyber Defense.</p>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>TLS 1.3 ENCRYPTED</span>
            <span>•</span>
            <span>ZERO LOG RETENTION</span>
            <span>•</span>
            <span>v1.0.0-PRO</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
