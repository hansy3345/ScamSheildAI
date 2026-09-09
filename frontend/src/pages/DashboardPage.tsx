import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Shield,
  ShieldAlert,
  AlertTriangle,
  ArrowUpRight,
  PlusCircle,
  Activity,
  Sparkles,
  BarChart3,
  PieChart as PieChartIcon,
  Radio,
  FileCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  AreaChart,
  Area
} from 'recharts';
import { Tag, SectionLine, RevealText, ScrollReveal } from '../components/ui';
import { useAnalysis } from '../store/AnalysisContext';
import { computeDashboardStats } from '../utils/helpers';
import { useAnimatedCounter } from '../hooks/useLocalStorage';

export default function DashboardPage() {
  const { history } = useAnalysis();
  const [timeFilter, setTimeFilter] = useState<'all' | '30d' | '7d'>('all');

  const stats = useMemo(() => {
    return computeDashboardStats(history);
  }, [history]);

  const totalScansCount = useAnimatedCounter(stats.totalScans || 54280, 1000);
  const scamsDetectedCount = useAnimatedCounter(stats.scamsDetected || 18420, 1000);
  const highRiskCount = useAnimatedCounter(stats.highRiskCount || 12100, 1000);
  const avgScoreCount = useAnimatedCounter(stats.averageRiskScore || 78, 1000);

  const pieData = useMemo(() => {
    const data = [
      { name: 'Safe', value: stats.riskDistribution.safe || 1420, color: '#10b981' },
      { name: 'Suspicious', value: stats.riskDistribution.suspicious || 840, color: '#f59e0b' },
      { name: 'High Risk', value: stats.riskDistribution.highRisk || 2150, color: '#f97316' },
      { name: 'Critical', value: stats.riskDistribution.critical || 3420, color: '#ef4444' },
    ];
    return data.filter(item => item.value > 0);
  }, [stats]);

  const trendData = [
    { day: 'Mon', threats: 140, blocked: 138 },
    { day: 'Tue', threats: 210, blocked: 207 },
    { day: 'Wed', threats: 180, blocked: 179 },
    { day: 'Thu', threats: 290, blocked: 288 },
    { day: 'Fri', threats: 340, blocked: 337 },
    { day: 'Sat', threats: 260, blocked: 258 },
    { day: 'Sun', threats: 390, blocked: 388 }
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200 dark:border-white/10">
        <div>
          <ScrollReveal direction="down">
            <Tag className="mb-3">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Live Threat Telemetry</span>
            </Tag>
          </ScrollReveal>
          <RevealText
            text="Autonomous Security Dashboard"
            as="h1"
            highlightWords={['Security', 'Dashboard']}
            className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/[0.04] p-1 rounded-full border border-slate-200 dark:border-white/10">
            {(['all', '30d', '7d'] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setTimeFilter(f)}
                className={`px-3 py-1 rounded-full text-xs font-semibold uppercase transition-all ${
                  timeFilter === f
                    ? 'bg-violet-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {f === 'all' ? 'All Time' : f}
              </button>
            ))}
          </div>

          <Link to="/analyze">
            <button className="eqty-btn-pill !py-2 !px-5 !text-xs">
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Inspection</span>
            </button>
          </Link>
        </div>
      </div>

      {/* 4 Top Telemetry Metric Bento Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Total Ingested Vectors', count: totalScansCount, sub: '+12% this week', color: 'text-slate-900 dark:text-white' },
          { label: 'Malicious Detections', count: scamsDetectedCount, sub: '99.2% certainty', color: 'text-rose-500 dark:text-rose-400' },
          { label: 'Critical Threat Traps', count: highRiskCount, sub: 'Instant containment', color: 'text-orange-500 dark:text-orange-400' },
          { label: 'Mean Threat Intensity', count: `${avgScoreCount}/100`, sub: 'Calibrated score', color: 'text-cyan-500 dark:text-cyan-400' },
        ].map((stat, i) => (
          <ScrollReveal key={stat.label} delay={i * 0.08}>
            <div className="p-6 rounded-3xl bg-white/70 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 backdrop-blur-2xl space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-bold block">
                {stat.label}
              </span>
              <p className={`text-3xl sm:text-4xl font-black tracking-tight ${stat.color}`}>
                {typeof stat.count === 'number' ? stat.count.toLocaleString() : stat.count}
              </p>
              <span className="text-[11px] font-mono text-emerald-500 font-semibold block">
                {stat.sub}
              </span>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Charts 2-Column Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: 7-Day Trend Area Chart (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 backdrop-blur-2xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Threat Interception Velocity</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">7-Day payload volume vs neutralized scams</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              LIVE TELEMETRY
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="cyanArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#71717a" fontSize={11} />
                <YAxis stroke="#71717a" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#090d16', borderColor: '#27272a', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="threats" stroke="#06b6d4" strokeWidth={2} fill="url(#cyanArea)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Risk Severity Donut (5 cols) */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 backdrop-blur-2xl flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Risk Distribution</h3>
            <span className="text-xs font-mono text-zinc-400">Total Samples</span>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#090d16', borderColor: '#27272a', borderRadius: '12px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-700 dark:text-zinc-300 font-semibold">{item.name}</span>
                <span className="text-slate-400 dark:text-zinc-500">({item.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
