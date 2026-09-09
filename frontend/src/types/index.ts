/* ===== Core Data Types ===== */

export type RiskLevel = 'safe' | 'suspicious' | 'high-risk' | 'critical';

export type InputType = 'message' | 'screenshot' | 'url' | 'email' | 'job-offer' | 'other';

export type ScamCategory =
  | 'phishing'
  | 'job-scam'
  | 'upi-fraud'
  | 'investment-scam'
  | 'delivery-scam'
  | 'lottery-scam'
  | 'impersonation'
  | 'romance-scam'
  | 'tech-support-scam'
  | 'advance-fee'
  | 'legitimate'
  | 'unknown';

export type ScanStageStatus = 'pending' | 'active' | 'complete' | 'error';

export type AnalysisStatus = 'idle' | 'scanning' | 'complete' | 'error';

/* ===== Analysis Types ===== */

export interface RiskFactor {
  label: string;
  severity: number; // 0-100
  description: string;
}

export interface EvidenceItem {
  type: 'url' | 'text' | 'pattern' | 'metadata' | 'behavioral';
  title: string;
  detail: string;
  severity: RiskLevel;
}

export interface ActionItem {
  icon: string; // Lucide icon name
  text: string;
  priority: 'high' | 'medium' | 'low';
}

export interface AnalysisResult {
  id: string;
  riskScore: number; // 0-100
  riskLevel: RiskLevel;
  scamCategory: ScamCategory;
  categoryLabel: string;
  explanation: string;
  riskFactors: RiskFactor[];
  evidence: EvidenceItem[];
  recommendedActions: ActionItem[];
  avoidActions: ActionItem[];
  confidence: number; // 0-100
  summary: string;
  detailedAnalysis: string;
  timestamp: string; // ISO 8601
}

export interface AnalysisRequest {
  inputType: InputType;
  content: string;
  file?: File | null;
  url?: string;
  emailHeaders?: {
    from: string;
    subject: string;
  };
  jobDetails?: {
    company: string;
    role: string;
    salary: string;
  };
}

/* ===== Scan Stage Types ===== */

export interface ScanStage {
  id: string;
  name: string;
  agentName: string;
  description: string;
  status: ScanStageStatus;
  duration: number; // milliseconds
  icon: string; // Lucide icon name
}

/* ===== History Types ===== */

export interface HistoryItem {
  id: string;
  inputType: InputType;
  inputPreview: string;
  result: AnalysisResult;
  timestamp: string;
}

/* ===== Dashboard Types ===== */

export interface DashboardStats {
  totalScans: number;
  scamsDetected: number;
  highRiskCount: number;
  averageRiskScore: number;
  riskDistribution: {
    safe: number;
    suspicious: number;
    highRisk: number;
    critical: number;
  };
  categoryBreakdown: CategoryCount[];
  recentScans: HistoryItem[];
  scanTrend: TrendPoint[];
}

export interface CategoryCount {
  category: ScamCategory;
  label: string;
  count: number;
  color: string;
}

export interface TrendPoint {
  date: string;
  scans: number;
  threats: number;
}

/* ===== UI Types ===== */

export interface NavLink {
  label: string;
  href: string;
  icon: string;
}

export interface SafetyTip {
  id: string;
  category: string;
  icon: string;
  title: string;
  description: string;
  warningsSigns: string[];
  examples: string[];
  protectionTips: string[];
  color: string;
}

/* ===== Localization Types ===== */

export type SupportedLanguage = 'en' | 'hi' | 'te';

export interface LocaleStrings {
  [key: string]: string;
}
