import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Trash2,
  ExternalLink,
  History as HistoryIcon,
  Plus,
  Sparkles,
  Archive,
  ArrowUpRight,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { Button, Tag, SectionLine, RevealText, ScrollReveal, Modal, EmptyState } from '../components/ui';
import { useAnalysis } from '../store/AnalysisContext';
import { formatDate } from '../utils/helpers';

export default function HistoryPage() {
  const navigate = useNavigate();
  const { history, removeFromHistory, clearHistory } = useAnalysis();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest-risk' | 'lowest-risk'>('newest');

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [clearAllModalOpen, setClearAllModalOpen] = useState(false);

  // Filter & sort pipeline
  const filteredHistory = useMemo(() => {
    return history
      .filter((item) => {
        const matchesSearch =
          !searchQuery.trim() ||
          item.inputPreview.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.result.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.result.explanation.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesRisk = selectedRisk === 'all' || item.result.riskLevel === selectedRisk;
        const matchesType = selectedType === 'all' || item.inputType === selectedType;

        return matchesSearch && matchesRisk && matchesType;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        }
        if (sortBy === 'highest-risk') {
          return b.result.riskScore - a.result.riskScore;
        }
        if (sortBy === 'lowest-risk') {
          return a.result.riskScore - b.result.riskScore;
        }
        return 0;
      });
  }, [history, searchQuery, selectedRisk, selectedType, sortBy]);

  const confirmDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setItemToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleExecuteDelete = () => {
    if (itemToDelete) {
      removeFromHistory(itemToDelete);
      setItemToDelete(null);
      setDeleteModalOpen(false);
    }
  };

  const handleExecuteClearAll = () => {
    clearHistory();
    setClearAllModalOpen(false);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-slate-200 dark:border-white/10 gap-4">
        <div>
          <ScrollReveal direction="down">
            <Tag className="mb-3">
              <HistoryIcon className="w-3.5 h-3.5 text-violet-400" />
              <span>Audit Lineage & Memory</span>
            </Tag>
          </ScrollReveal>
          <RevealText
            text="Investigation Archive"
            as="h1"
            highlightWords={['Investigation', 'Archive']}
            className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight"
          />
        </div>

        <div className="flex items-center gap-3">
          {history.length > 0 && (
            <button
              onClick={() => setClearAllModalOpen(true)}
              className="px-4 py-2 rounded-full text-xs font-semibold text-rose-500 hover:bg-rose-500/10 border border-rose-500/20 transition-all cursor-pointer"
            >
              Clear Audit Log
            </button>
          )}
          <Link to="/analyze">
            <button className="eqty-btn-pill !py-2 !px-5 !text-xs">
              <Plus className="w-3.5 h-3.5" />
              <span>New Analysis</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Search & Filter Pill Strip */}
      <div className="p-5 rounded-3xl bg-white/70 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 backdrop-blur-2xl space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by keywords, category, domain, or phone numbers..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Risk Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-mono text-slate-400 font-semibold mr-1">Filter:</span>
            {['all', 'critical', 'high-risk', 'suspicious', 'safe'].map((risk) => (
              <button
                key={risk}
                type="button"
                onClick={() => setSelectedRisk(risk)}
                className={`px-3 py-1 rounded-full text-xs font-semibold uppercase transition-all cursor-pointer ${
                  selectedRisk === risk
                    ? 'bg-violet-500 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/5'
                }`}
              >
                {risk}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-slate-400 font-semibold">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest-risk">Highest Risk</option>
              <option value="lowest-risk">Lowest Risk</option>
            </select>
          </div>
        </div>
      </div>

      {/* History Items Grid */}
      {filteredHistory.length === 0 ? (
        <EmptyState
          icon={<Archive className="w-8 h-8 text-slate-400" />}
          title="No investigations found"
          description="Your analyzed threats and forensic reports will be saved here in local storage with zero cloud retention."
          action={
            <Link to="/analyze">
              <button className="eqty-btn-pill !py-2 !px-5 !text-xs mt-3">
                <span>Run First Analysis</span>
              </button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredHistory.map((item) => {
            const risk = item.result.riskLevel;
            const isCritical = risk === 'critical' || risk === 'high-risk';

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => navigate(`/results/${item.result.id || item.id}`, { state: { result: item.result } })}
                className="p-5 rounded-3xl bg-white/70 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 backdrop-blur-2xl space-y-3 cursor-pointer hover:border-cyan-400/40 transition-all group"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-400 dark:text-zinc-500 font-semibold">
                      {item.inputType.toUpperCase()}
                    </span>
                    <span className="text-slate-300 dark:text-zinc-700">•</span>
                    <span className="text-xs font-mono text-slate-500 dark:text-zinc-400">
                      {formatDate(item.timestamp)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                      isCritical ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {item.result.riskScore}/100 • {risk}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => confirmDelete(item.id, e)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                  {item.result.categoryLabel}
                </p>

                <p className="text-xs font-mono text-slate-600 dark:text-zinc-400 line-clamp-2 bg-slate-50 dark:bg-white/[0.02] p-2.5 rounded-xl border border-slate-200/60 dark:border-white/5">
                  "{item.inputPreview}"
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/5 text-xs text-cyan-600 dark:text-cyan-400 font-semibold">
                  <span>View Full Forensic Report</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modals */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Investigation Record"
        footer={
          <>
            <button
              type="button"
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 rounded-full text-xs font-semibold text-slate-600 dark:text-zinc-400"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleExecuteDelete}
              className="px-4 py-2 rounded-full text-xs font-bold bg-rose-500 text-white"
            >
              Delete Record
            </button>
          </>
        }
      >
        <p className="text-xs text-slate-600 dark:text-zinc-400">
          Are you sure you want to remove this investigation from your local browser memory? This action cannot be undone.
        </p>
      </Modal>

      <Modal
        isOpen={clearAllModalOpen}
        onClose={() => setClearAllModalOpen(false)}
        title="Clear Entire History"
        footer={
          <>
            <button
              type="button"
              onClick={() => setClearAllModalOpen(false)}
              className="px-4 py-2 rounded-full text-xs font-semibold text-slate-600 dark:text-zinc-400"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleExecuteClearAll}
              className="px-4 py-2 rounded-full text-xs font-bold bg-rose-500 text-white"
            >
              Clear All Records
            </button>
          </>
        }
      >
        <p className="text-xs text-slate-600 dark:text-zinc-400">
          This will delete all past investigation logs from this device.
        </p>
      </Modal>
    </div>
  );
}
