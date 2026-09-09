import type { RiskLevel, InputType, ScamCategory } from '../types';

/* ===== Risk Level Config ===== */

export const RISK_LEVEL_CONFIG: Record<RiskLevel, {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  glowClass: string;
  range: [number, number];
}> = {
  safe: {
    label: 'Safe',
    color: '#10b981',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    textColor: 'text-emerald-400',
    glowClass: 'shadow-emerald-500/20',
    range: [0, 30],
  },
  suspicious: {
    label: 'Suspicious',
    color: '#f59e0b',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    textColor: 'text-amber-400',
    glowClass: 'shadow-amber-500/20',
    range: [31, 60],
  },
  'high-risk': {
    label: 'High Risk',
    color: '#f97316',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    textColor: 'text-orange-400',
    glowClass: 'shadow-orange-500/20',
    range: [61, 80],
  },
  critical: {
    label: 'Critical',
    color: '#ef4444',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    textColor: 'text-red-400',
    glowClass: 'shadow-red-500/20',
    range: [81, 100],
  },
};

/* ===== Input Type Config ===== */

export const INPUT_TYPE_CONFIG: Record<InputType, {
  label: string;
  icon: string;
  placeholder: string;
  description: string;
}> = {
  message: {
    label: 'Message',
    icon: 'MessageSquare',
    placeholder: 'Paste the suspicious message here...',
    description: 'SMS, WhatsApp, or social media messages',
  },
  screenshot: {
    label: 'Screenshot',
    icon: 'Image',
    placeholder: 'Upload a screenshot of the suspicious content',
    description: 'Screenshots of chats, emails, or websites',
  },
  url: {
    label: 'URL',
    icon: 'Link',
    placeholder: 'https://suspicious-website.com',
    description: 'Website URLs or links you received',
  },
  email: {
    label: 'Email',
    icon: 'Mail',
    placeholder: 'Paste the email content here...',
    description: 'Full email including headers if possible',
  },
  'job-offer': {
    label: 'Job Offer',
    icon: 'Briefcase',
    placeholder: 'Describe the job offer details...',
    description: 'Job offers received via message, email, or call',
  },
  other: {
    label: 'Other',
    icon: 'FileQuestion',
    placeholder: 'Describe the suspicious content...',
    description: 'Any other suspicious content or interaction',
  },
};

/* ===== Scam Category Config ===== */

export const SCAM_CATEGORY_CONFIG: Record<ScamCategory, {
  label: string;
  icon: string;
  color: string;
}> = {
  phishing: { label: 'Phishing', icon: 'Fish', color: '#ef4444' },
  'job-scam': { label: 'Job Scam', icon: 'Briefcase', color: '#f97316' },
  'upi-fraud': { label: 'UPI/Payment Fraud', icon: 'CreditCard', color: '#f59e0b' },
  'investment-scam': { label: 'Investment Scam', icon: 'TrendingUp', color: '#8b5cf6' },
  'delivery-scam': { label: 'Delivery Scam', icon: 'Package', color: '#06b6d4' },
  'lottery-scam': { label: 'Lottery/Reward Scam', icon: 'Gift', color: '#ec4899' },
  impersonation: { label: 'Impersonation', icon: 'UserX', color: '#6366f1' },
  'romance-scam': { label: 'Romance Scam', icon: 'Heart', color: '#e11d48' },
  'tech-support-scam': { label: 'Tech Support Scam', icon: 'Monitor', color: '#14b8a6' },
  'advance-fee': { label: 'Advance Fee Scam', icon: 'Banknote', color: '#84cc16' },
  legitimate: { label: 'Legitimate', icon: 'CheckCircle', color: '#10b981' },
  unknown: { label: 'Unknown', icon: 'HelpCircle', color: '#6b7280' },
};

/* ===== Scan Stages ===== */

export const SCAN_STAGES_CONFIG = [
  {
    id: 'receiving',
    name: 'Receiving Input',
    agentName: 'Input Handler',
    description: 'Securely receiving and validating your submission',
    duration: 800,
    icon: 'Download',
  },
  {
    id: 'extracting',
    name: 'Extracting Content',
    agentName: 'Content Analysis Agent',
    description: 'Parsing text, metadata, and embedded elements',
    duration: 1200,
    icon: 'FileSearch',
  },
  {
    id: 'patterns',
    name: 'Detecting Patterns',
    agentName: 'Scam Pattern Agent',
    description: 'Matching against known scam patterns and techniques',
    duration: 1500,
    icon: 'Scan',
  },
  {
    id: 'evidence',
    name: 'Checking Evidence',
    agentName: 'Evidence & URL Agent',
    description: 'Cross-referencing databases and threat intelligence',
    duration: 1300,
    icon: 'Database',
  },
  {
    id: 'risk',
    name: 'Assessing Risk',
    agentName: 'Risk Assessment Agent',
    description: 'Computing risk score and confidence level',
    duration: 1000,
    icon: 'Shield',
  },
  {
    id: 'protection',
    name: 'Generating Protection',
    agentName: 'Safety Advisor Agent',
    description: 'Creating personalized safety recommendations',
    duration: 800,
    icon: 'ShieldCheck',
  },
] as const;

/* ===== Navigation ===== */

export const NAV_LINKS = [
  { label: 'Home', href: '/', icon: 'Home' },
  { label: 'Analyze', href: '/analyze', icon: 'Search' },
  { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'History', href: '/history', icon: 'History' },
  { label: 'Safety Center', href: '/safety', icon: 'ShieldAlert' },
  { label: 'How It Works', href: '/how-it-works', icon: 'Workflow' },
];

/* ===== App Constants ===== */

export const APP_NAME = 'ScamShield AI';
export const APP_TAGLINE = 'Think before you click.';
export const STORAGE_KEYS = {
  THEME: 'scamshield-theme',
  HISTORY: 'scamshield-history',
  LANGUAGE: 'scamshield-language',
} as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
