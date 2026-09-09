import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Briefcase,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Search,
  ShieldCheck,
  BookOpen,
  Zap,
  HelpCircle,
  Radio,
  FileCheck
} from 'lucide-react';
import { Tag, SectionLine, RevealText, ScrollReveal } from '../components/ui';

interface ScamGuide {
  id: string;
  title: string;
  category: string;
  icon: React.ReactNode;
  badge: string;
  description: string;
  redFlags: string[];
  realExample: string;
  sampleKey?: string;
  protectionTips: string[];
}

const GUIDES: ScamGuide[] = [
  {
    id: 'upi-fraud',
    title: 'UPI & Reverse Payment Request Traps',
    category: 'Financial',
    icon: <CreditCard className="w-5 h-5 text-amber-400" />,
    badge: 'High Frequency',
    description:
      'Fraudsters send a "Collect Request" or a QR code claiming they are transferring money to you. In reality, entering your UPI PIN authorizes a debit FROM your account.',
    redFlags: [
      'Buyer asks you to enter your UPI PIN to "receive" cash or refunds.',
      'Scammer sends a QR code and asks you to scan it on GooglePay/PhonePe to claim money.',
      'Urgent pressure claiming their relative is hospitalized or payment will expire.'
    ],
    realExample:
      '"I am transferring ₹15,000 to your Google Pay for the sofa. Please approve the collect request and enter your UPI PIN to receive it immediately."',
    sampleKey: 'upi-scam',
    protectionTips: [
      'Golden Rule: You NEVER enter your UPI PIN to receive money. PIN is ONLY for sending.',
      'Never scan random QR codes sent over WhatsApp or SMS.',
      'Verify the actual sender name and VPA before clicking approve.'
    ]
  },
  {
    id: 'digital-arrest',
    title: 'Digital Arrest & Law Enforcement Extortion',
    category: 'Extortion',
    icon: <AlertTriangle className="w-5 h-5 text-rose-400" />,
    badge: 'Critical Severity',
    description:
      'Scammers impersonate police, CBI, or customs officials via video calls in fake studio setups, threatening immediate arrest unless you transfer "bail funds" to a secret clearance account.',
    redFlags: [
      'Video call from an "officer" wearing uniforms in a room with government logos.',
      'Claims your Aadhaar or phone is linked to a parcel with drugs or money laundering in Mumbai/Delhi.',
      'Demands you stay on video call 24/7 ("Digital Arrest") and keep it secret.'
    ],
    realExample:
      '"This is Cyber Crime Branch. A parcel with 5 fake passports and MDMA drugs booked under your Aadhaar was seized. Transfer ₹2,00,000 to RBI verification account to avoid arrest warrant."',
    sampleKey: 'digital-arrest',
    protectionTips: [
      'There is NO legal concept called "Digital Arrest" under Indian law.',
      'Police and CBI NEVER conduct interrogations or demand fund transfers over Skype/WhatsApp.',
      'Immediately disconnect and report to the National Cyber Crime Portal at 1930.'
    ]
  },
  {
    id: 'task-scam',
    title: 'Part-Time Video Like & Review Task Traps',
    category: 'Employment',
    icon: <Briefcase className="w-5 h-5 text-violet-400" />,
    badge: 'Advance Fee',
    description:
      'Victims are invited to earn ₹3,000–₹10,000/day simply by liking YouTube videos or rating Google Maps locations. Initial small rewards build trust before demanding large "prepaid merchant deposits".',
    redFlags: [
      'Unsolicited WhatsApp/Telegram messages offering high daily pay for trivial tasks.',
      'Invited to Telegram groups where fake members post screenshots of huge earnings.',
      'Requirement to deposit "security money" into crypto wallets or private bank accounts.'
    ],
    realExample:
      '"Earn ₹8,000/day liking YouTube videos from home! Complete 3 trial tasks to receive ₹150 instantly. Join VIP Telegram group @dailyincome2026 to start."',
    sampleKey: 'task-scam',
    protectionTips: [
      'Legitimate companies never ask you to pay money to unlock your earned salary.',
      'Never join unsolicited Telegram earning groups.',
      'Do not share personal bank details with unknown hiring agents.'
    ]
  }
];

export default function SafetyCenterPage() {
  const navigate = useNavigate();
  const [expandedGuide, setExpandedGuide] = useState<string | null>('upi-fraud');
  const [searchQuery, setSearchQuery] = useState('');

  // Awareness Quiz state
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const filteredGuides = GUIDES.filter(
    (g) =>
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-left max-w-3xl space-y-4">
        <ScrollReveal direction="down">
          <Tag>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Digital Awareness & Defense Hub</span>
          </Tag>
        </ScrollReveal>

        <RevealText
          text="Cyber Threat Encyclopedia"
          as="h1"
          highlightWords={['Cyber', 'Threat']}
          className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight"
        />

        <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 leading-relaxed">
          Arm yourself with real-world defense blueprints against today's sophisticated social engineering and financial coercion tactics.
        </p>
      </div>

      {/* Emergency Helpline Banner (EqtyLab Card Style) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-violet-500/10 border border-emerald-500/30 backdrop-blur-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold">
            NATIONAL CYBER HELPLINE (INDIA)
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Call <span className="text-emerald-500">1930</span> or visit <span className="text-cyan-400">cybercrime.gov.in</span>
          </h2>
          <p className="text-xs text-slate-600 dark:text-zinc-400">
            If you have lost funds in a cyber fraud, report within the first 2 hours ("Golden Window") for bank transaction freeze.
          </p>
        </div>

        <a
          href="https://cybercrime.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="eqty-btn-pill !py-2.5 !px-6 !text-xs whitespace-nowrap"
        >
          <span>File Cyber Complaint</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Interactive Scam Guides */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-white/10">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Threat Deconstruction Playbooks</h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400">Deep-dive into anatomy, psychology, and mitigation steps</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides..."
              className="w-full pl-9 pr-3 py-2 rounded-full bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredGuides.map((guide) => {
            const isExpanded = expandedGuide === guide.id;

            return (
              <div
                key={guide.id}
                className="rounded-3xl bg-white/70 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 backdrop-blur-2xl overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setExpandedGuide(isExpanded ? null : guide.id)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center">
                      {guide.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-400 font-semibold uppercase">{guide.category}</span>
                        <span className="text-slate-300 dark:text-zinc-700">•</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          {guide.badge}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{guide.title}</h3>
                    </div>
                  </div>

                  <div className="text-slate-400">
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-6 pb-6 pt-2 border-t border-slate-100 dark:border-white/5 space-y-6"
                    >
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
                        {guide.description}
                      </p>

                      {/* Real-world snippet */}
                      <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 text-xs font-mono text-zinc-300 space-y-1">
                        <span className="text-[10px] text-cyan-400 uppercase font-bold block">Simulated Threat Payload:</span>
                        <p className="italic">{guide.realExample}</p>
                      </div>

                      {/* Red Flags & Action tips */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold font-mono uppercase text-rose-500 tracking-wider">
                            🚩 Key Red Flags
                          </h4>
                          <ul className="space-y-2 text-xs text-slate-600 dark:text-zinc-400">
                            {guide.redFlags.map((flag, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-rose-400 font-bold shrink-0">•</span>
                                <span>{flag}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-xs font-bold font-mono uppercase text-emerald-500 tracking-wider">
                            🛡️ Defense Directives
                          </h4>
                          <ul className="space-y-2 text-xs text-slate-600 dark:text-zinc-400">
                            {guide.protectionTips.map((tip, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-emerald-400 font-bold shrink-0">✓</span>
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Direct action to test in analyze */}
                      {guide.sampleKey && (
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => navigate('/analyze', { state: { prefillContent: guide.realExample } })}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline"
                          >
                            <span>Inspect this exact scam in Analyze Studio</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Cyber Awareness Quiz Bento Card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white/70 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 backdrop-blur-2xl space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-white/10">
          <HelpCircle className="w-4 h-4 text-violet-400" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Interactive Cyber Awareness Check</h3>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            Scenario: You receive a PhonePe notification stating you won ₹10,000 cash cashback. Clicking it opens your UPI app asking for your 6-digit PIN. What happens if you enter your PIN?
          </p>

          <div className="space-y-2.5">
            {[
              'You receive ₹10,000 directly in your bank account.',
              '₹10,000 is immediately debited FROM your bank account to the scammer.',
              'Your UPI app validates identity and creates a secure lottery vault.',
              'Nothing happens unless you share your OTP.'
            ].map((opt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setQuizAnswer(i);
                  setQuizSubmitted(true);
                }}
                className={`w-full p-4 rounded-2xl text-left text-xs font-medium border transition-all cursor-pointer flex items-center justify-between ${
                  quizSubmitted && i === 1
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold'
                    : quizSubmitted && quizAnswer === i && i !== 1
                    ? 'bg-rose-500/10 border-rose-500 text-rose-400'
                    : 'bg-white dark:bg-white/[0.02] border-slate-200 dark:border-white/5 text-slate-700 dark:text-zinc-300 hover:border-violet-400/40'
                }`}
              >
                <span>{opt}</span>
                {quizSubmitted && i === 1 && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
              </button>
            ))}
          </div>

          {quizSubmitted && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 font-mono"
            >
              ✓ <strong>Correct Fact:</strong> UPI PIN is ONLY entered when authorizing money to LEAVE your bank. Receiving money never requires a PIN.
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
