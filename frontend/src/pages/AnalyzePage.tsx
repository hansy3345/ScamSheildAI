import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  MessageSquare,
  Image as ImageIcon,
  Link as LinkIcon,
  Mail,
  Briefcase,
  HelpCircle,
  UploadCloud,
  AlertCircle,
  X,
  Languages,
  ArrowRight,
  Shield,
  Lock,
  Cpu,
  CheckCircle2
} from 'lucide-react';
import { Tag, RevealText, ScrollReveal } from '../components/ui';
import { useAnalysis } from '../store/AnalysisContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { InputType, AnalysisRequest, SupportedLanguage } from '../types';
import { SAMPLE_INPUTS } from '../services/mockData';
import { isValidUrl } from '../utils/helpers';
import { STORAGE_KEYS } from '../utils/constants';

interface TabItem {
  id: InputType;
  label: string;
  icon: React.ReactNode;
  hint: string;
}

const TABS: TabItem[] = [
  { id: 'message', label: 'Message / SMS', icon: <MessageSquare className="w-3.5 h-3.5" />, hint: 'SMS, WhatsApp, Telegram, or social chats' },
  { id: 'screenshot', label: 'Screenshot', icon: <ImageIcon className="w-3.5 h-3.5" />, hint: 'OCR vision scan for chats, receipts, or fake bank portals' },
  { id: 'url', label: 'Website URL', icon: <LinkIcon className="w-3.5 h-3.5" />, hint: 'Phishing domains, IDN homographs, or short links' },
  { id: 'email', label: 'Email', icon: <Mail className="w-3.5 h-3.5" />, hint: 'Suspicious emails including sender headers and DKIM records' },
  { id: 'job-offer', label: 'Job Offer', icon: <Briefcase className="w-3.5 h-3.5" />, hint: 'Task scams, remote work traps & deposit requests' },
  { id: 'other', label: 'Other', icon: <HelpCircle className="w-3.5 h-3.5" />, hint: 'Investment pools, lottery messages, crypto scams' },
];

export default function AnalyzePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { startAnalysis } = useAnalysis();

  const [activeTab, setActiveTab] = useState<InputType>('message');
  const [content, setContent] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [emailFrom, setEmailFrom] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [jobCompany, setJobCompany] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [jobSalary, setJobSalary] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useLocalStorage<SupportedLanguage>(STORAGE_KEYS.LANGUAGE, 'en');

  useEffect(() => {
    if (location.state?.prefillContent) {
      setContent(location.state.prefillContent);
    }
  }, [location.state]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
    onDrop: (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) {
        setError('Please upload an image file under 10MB.');
        return;
      }
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setUploadedFile(file);
        setFilePreview(URL.createObjectURL(file));
        setError(null);
      }
    }
  });

  const handleSampleSelect = (sampleKey: string) => {
    const sample = SAMPLE_INPUTS[sampleKey];
    if (!sample) return;

    setError(null);
    setActiveTab(sample.inputType as InputType);

    if (sample.inputType === 'url') {
      setUrlInput(sample.content);
      setContent(sample.content);
    } else {
      setContent(sample.content);
    }
  };

  const handleClear = () => {
    setContent('');
    setUrlInput('');
    setEmailFrom('');
    setEmailSubject('');
    setJobCompany('');
    setJobRole('');
    setJobSalary('');
    setUploadedFile(null);
    if (filePreview) URL.revokeObjectURL(filePreview);
    setFilePreview(null);
    setError(null);
  };

  const handleAnalyze = () => {
    setError(null);

    let finalContent = content.trim();

    if (activeTab === 'url') {
      const u = urlInput.trim();
      if (!u) {
        setError('Please enter a URL to inspect.');
        return;
      }
      if (!isValidUrl(u)) {
        setError('Please enter a valid URL (e.g., https://example.com).');
        return;
      }
      finalContent = u;
    } else if (activeTab === 'screenshot') {
      if (!uploadedFile) {
        setError('Please drop or upload a screenshot to inspect.');
        return;
      }
      finalContent = `[Screenshot Uploaded: ${uploadedFile.name}]`;
    } else if (activeTab === 'email') {
      if (!finalContent) {
        setError('Please enter the email body content.');
        return;
      }
    } else if (activeTab === 'job-offer') {
      if (!finalContent) {
        setError('Please enter the job offer details or message.');
        return;
      }
    } else {
      if (!finalContent) {
        setError('Please paste or type suspicious content to analyze.');
        return;
      }
      if (finalContent.length < 5) {
        setError('Please provide at least 5 characters for accurate threat analysis.');
        return;
      }
    }

    const request: AnalysisRequest = {
      inputType: activeTab,
      content: finalContent,
      file: uploadedFile || undefined,
      url: activeTab === 'url' ? urlInput.trim() : undefined,
      emailHeaders:
        activeTab === 'email' && (emailFrom || emailSubject)
          ? { from: emailFrom.trim(), subject: emailSubject.trim() }
          : undefined,
      jobDetails:
        activeTab === 'job-offer' && (jobCompany || jobRole || jobSalary)
          ? { company: jobCompany.trim(), role: jobRole.trim(), salary: jobSalary.trim() }
          : undefined
    };

    startAnalysis(request);
    navigate('/scan', { state: { request } });
  };

  return (
    <div className="min-h-screen py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Page Header (EqtyLab style) */}
      <div className="max-w-3xl mb-10">
        <ScrollReveal direction="down">
          <Tag className="mb-3">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Neural Ingestion Console</span>
          </Tag>
        </ScrollReveal>

        <RevealText
          text="Inspect Digital Vectors in Runtime"
          as="h1"
          highlightWords={['Digital', 'Vectors']}
          className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-4"
        />

        <ScrollReveal delay={0.15}>
          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 leading-relaxed font-normal">
            Submit suspicious SMS messages, email bodies, screenshots, URLs, or job offers. Our 6-agent autonomous pipeline executes deep heuristic forensics without retaining sensitive PII.
          </p>
        </ScrollReveal>
      </div>

      {/* Main Console Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Input Canvas (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 backdrop-blur-2xl shadow-xl space-y-6">
            {/* Input Type Pill Tabs (EqtyLab style) */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-bold mb-3">
                Select Vector Channel
              </label>
              <div className="flex flex-wrap gap-2">
                {TABS.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(tab.id);
                        setError(null);
                      }}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/25 ring-2 ring-violet-400/50'
                          : 'bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5'
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input Area Depending on Tab */}
            <div className="space-y-4">
              {activeTab === 'url' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-2">
                    Target Domain or Link
                  </label>
                  <div className="relative">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://example-security-update.top"
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm font-mono"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'screenshot' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-2">
                    Visual Evidence / Screenshot
                  </label>
                  {!filePreview ? (
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
                        isDragActive
                          ? 'border-cyan-400 bg-cyan-500/10'
                          : 'border-slate-300 dark:border-white/10 hover:border-violet-400/50 bg-slate-50/50 dark:bg-white/[0.01]'
                      }`}
                    >
                      <input {...getInputProps()} />
                      <div className="w-14 h-14 mx-auto rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-3">
                        <UploadCloud className="w-7 h-7" />
                      </div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        Drop screenshot here or click to browse
                      </p>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 font-mono">
                        PNG, JPG, WEBP up to 10MB • Auto OCR extraction
                      </p>
                    </div>
                  ) : (
                    <div className="relative rounded-2xl overflow-hidden border border-cyan-500/30 bg-slate-950 p-2">
                      <img
                        src={filePreview}
                        alt="Screenshot Preview"
                        className="w-full max-h-64 object-contain rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setUploadedFile(null);
                          if (filePreview) URL.revokeObjectURL(filePreview);
                          setFilePreview(null);
                        }}
                        className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/90 text-white hover:bg-rose-600 transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'email' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                      Sender Email (From)
                    </label>
                    <input
                      type="text"
                      value={emailFrom}
                      onChange={(e) => setEmailFrom(e.target.value)}
                      placeholder="security-alert@bank-verify.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                      Email Subject
                    </label>
                    <input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      placeholder="Urgent: Account Suspended"
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'job-offer' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">Company</label>
                    <input
                      type="text"
                      value={jobCompany}
                      onChange={(e) => setJobCompany(e.target.value)}
                      placeholder="Global Media Ltd"
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">Position</label>
                    <input
                      type="text"
                      value={jobRole}
                      onChange={(e) => setJobRole(e.target.value)}
                      placeholder="Remote Video Evaluator"
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">Stated Pay</label>
                    <input
                      type="text"
                      value={jobSalary}
                      onChange={(e) => setJobSalary(e.target.value)}
                      placeholder="₹8,000 / day"
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Main Content Area */}
              {activeTab !== 'screenshot' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-2">
                    Payload Content / Message Body
                  </label>
                  <textarea
                    rows={5}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Paste the suspicious SMS, WhatsApp chat, email text, or task prompt..."
                    className="w-full p-4 rounded-2xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm font-sans leading-relaxed resize-none"
                  />
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400 font-mono mt-1 px-1">
                    <span>Zero PII logged client-side</span>
                    <span>{content.length} characters</span>
                  </div>
                </div>
              )}
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2.5 text-rose-600 dark:text-rose-400 text-xs font-semibold"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Language & Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Languages className="w-4 h-4 text-slate-500 dark:text-zinc-400" />
                <span className="text-xs text-slate-600 dark:text-zinc-400 font-medium">Dialect:</span>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value as SupportedLanguage)}
                  className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="en">English (EN)</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                  <option value="te">తెలుగు (Telugu)</option>
                </select>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={handleAnalyze}
                  className="eqty-btn-pill !py-2.5 !px-6 !text-xs whitespace-nowrap"
                >
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>Run Heuristic Inspection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Threat Vector Preset Pills */}
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-bold mb-3">
              Load Real-World Scam Signatures
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'upi-scam', label: '⚡ UPI Reverse Trap' },
                { key: 'digital-arrest', label: '⚖️ Digital Arrest Extortion' },
                { key: 'task-scam', label: '💼 YouTube Task Scam' },
                { key: 'electricity-bill', label: '🔌 Electricity Disconnection' },
                { key: 'phishing-url', label: '🌐 Punycode Banking Link' },
              ].map((preset) => (
                <button
                  key={preset.key}
                  type="button"
                  onClick={() => handleSampleSelect(preset.key)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-300 hover:border-cyan-400/50 hover:bg-cyan-500/5 transition-all cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Ingestion Telemetry & Integrity Badges (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-white/70 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 backdrop-blur-2xl shadow-xl space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-white/10">
              <Shield className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Defense Heuristics</h3>
            </div>

            <div className="space-y-3.5 text-xs text-slate-600 dark:text-zinc-300">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 dark:text-white block">Punycode & Homograph Shield</strong>
                  <span>Detects visually deceptive characters spoofing top banking portals.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 dark:text-white block">UPI PIN Solicitation Trap</strong>
                  <span>Flags reverse payment requests attempting unauthorized debits.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 dark:text-white block">Authority Impersonation</strong>
                  <span>Isolates fake CBI, FedEx, Customs, and Police coercion scripts.</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-white/10">
              <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-[11px] font-mono text-cyan-600 dark:text-cyan-300 flex items-center gap-2">
                <Lock className="w-4 h-4 shrink-0 text-cyan-400" />
                <span>Zero payload retention. Redacted client-side before multi-agent evaluation.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
