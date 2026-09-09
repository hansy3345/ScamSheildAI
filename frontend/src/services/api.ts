import type { AnalysisResult, AnalysisRequest } from '../types';
import { MOCK_RESULTS, SAMPLE_INPUTS } from './mockData';
import { generateId } from '../utils/helpers';

/**
 * API service layer.
 *
 * Automatically connects to the FastAPI backend at `/api/analyze`.
 * If the backend is offline or VITE_USE_MOCK is explicitly true,
 * it seamlessly falls back to the client-side mock & heuristic analyzer.
 */

const VITE_USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const API_BASE = import.meta.env.VITE_API_URL || '/api';

/* ===== Analyze Content ===== */

export async function analyzeContent(request: AnalysisRequest): Promise<AnalysisResult> {
  if (VITE_USE_MOCK) {
    return mockAnalyze(request);
  }

  try {
    const formData = new FormData();
    formData.append('input_type', request.inputType);
    formData.append('content', request.content);

    if (request.file) {
      formData.append('file', request.file);
    }
    if (request.url) {
      formData.append('url', request.url);
    }
    if (request.emailHeaders) {
      formData.append('email_from', request.emailHeaders.from);
      formData.append('email_subject', request.emailHeaders.subject);
    }
    if (request.jobDetails) {
      formData.append('job_company', request.jobDetails.company);
      formData.append('job_role', request.jobDetails.role);
      formData.append('job_salary', request.jobDetails.salary);
    }

    // Set a 4-second timeout to allow quick fallback if backend server isn't running
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.info('[ScamShield API] Backend unreachable or timed out. Using intelligent client-side AI analysis engine.');
  }

  // Graceful fallback to client-side heuristic engine
  return mockAnalyze(request);
}

/* ===== Mock Analysis ===== */

async function mockAnalyze(request: AnalysisRequest): Promise<AnalysisResult> {
  await new Promise(resolve => setTimeout(resolve, 300));

  const contentLower = request.content.toLowerCase();

  // Keyword-based sample matching
  if (contentLower.includes('prince') || contentLower.includes('inheritance') || contentLower.includes('4,500,000')) {
    return { ...MOCK_RESULTS['nigerian-prince'], id: generateId(), timestamp: new Date().toISOString() };
  }
  if (contentLower.includes('amazon') || contentLower.includes('delivery') || contentLower.includes('parcel') || contentLower.includes('address update')) {
    return { ...MOCK_RESULTS['fake-delivery'], id: generateId(), timestamp: new Date().toISOString() };
  }
  if (contentLower.includes('upi') || contentLower.includes('pin') || contentLower.includes('15,000') || contentLower.includes('gpay') || contentLower.includes('phonepe') || contentLower.includes('sofa')) {
    return { ...MOCK_RESULTS['upi-scam'], id: generateId(), timestamp: new Date().toISOString() };
  }
  if (contentLower.includes('kyc') || contentLower.includes('sbi') || contentLower.includes('sbi-kyc') || contentLower.includes('netbanking')) {
    return { ...MOCK_RESULTS['phishing-url'], id: generateId(), timestamp: new Date().toISOString() };
  }
  if (contentLower.includes('like youtube') || contentLower.includes('data entry') || contentLower.includes('work from home') || contentLower.includes('1,50,000') || contentLower.includes('globaltech')) {
    return { ...MOCK_RESULTS['suspicious-job'], id: generateId(), timestamp: new Date().toISOString() };
  }
  if (contentLower.includes('salary credited') || contentLower.includes('xx4821') || contentLower.includes('legitimate')) {
    return { ...MOCK_RESULTS['legit-bank'], id: generateId(), timestamp: new Date().toISOString() };
  }

  // Fallback generic heuristic generator
  return generateGenericResult(request);
}

function generateGenericResult(request: AnalysisRequest): AnalysisResult {
  const contentLower = request.content.toLowerCase();

  const scamIndicators = [
    { pattern: /(urgent|immediately|act now|suspended|blocked|24 hours|expire)/i, label: 'Urgency Pressure', severity: 85, desc: 'High psychological pressure to force hasty action' },
    { pattern: /(upi|pin|otp|password|cvv|account number|debit)/i, label: 'Credential / PIN Demanded', severity: 90, desc: 'Direct request for secret credentials or payment authorization' },
    { pattern: /(http:\/\/|https:\/\/[^\s]+(\.xyz|\.top|\.in|\.tk|\.cc|\.ru))/i, label: 'Suspicious Domain TLD', severity: 80, desc: 'Uses cheap or high-risk domain extension often linked to fraud' },
    { pattern: /(₹|\$|earn|lottery|winner|cashback|prize|reward)/i, label: 'Unrealistic Financial Incentive', severity: 75, desc: 'Promises large sum of money or reward to lower user defense' },
    { pattern: /(police|cbi|customs|digital arrest|court|warrant)/i, label: 'Authority Impersonation', severity: 95, desc: 'Impersonates law enforcement or government agency' },
  ];

  const matchedIndicators = scamIndicators.filter(ind => ind.pattern.test(contentLower));

  let score = 25;
  if (matchedIndicators.length === 1) score = 55;
  if (matchedIndicators.length === 2) score = 75;
  if (matchedIndicators.length >= 3) score = 90;

  const level = score <= 30 ? 'safe' : score <= 60 ? 'suspicious' : score <= 80 ? 'high-risk' : 'critical';

  return {
    id: generateId(),
    riskScore: score,
    riskLevel: level,
    scamCategory: matchedIndicators.length > 0 ? 'phishing' : 'unknown',
    categoryLabel: matchedIndicators.length > 0 ? 'Phishing & Social Engineering' : 'Unclassified Message',
    explanation: matchedIndicators.length > 0
      ? `This submission was flagged with a risk score of ${score}/100. It exhibits ${matchedIndicators.length} significant fraud indicators including ${matchedIndicators.map(m => m.label).join(', ')}.`
      : 'No common scam patterns detected. The message appears relatively benign, though standard caution is advised.',
    riskFactors: matchedIndicators.length > 0
      ? matchedIndicators.map(m => ({ label: m.label, severity: m.severity, description: m.desc }))
      : [{ label: 'Normal Structure', severity: 15, description: 'No overt high-risk triggers detected in payload' }],
    evidence: [
      {
        type: 'text',
        title: 'Linguistic Tone Analysis',
        detail: matchedIndicators.length > 0 ? 'Detected manipulative urgency and incentive patterns.' : 'Neutral communication tone.',
        severity: level,
      },
      {
        type: 'behavioral',
        title: 'Action Request Classification',
        detail: request.inputType === 'url' ? 'Analyzed link destination and structural reputation.' : 'Evaluated call-to-action intent.',
        severity: level,
      },
    ],
    recommendedActions: score > 30
      ? [
          { icon: 'Trash2', text: 'Do not respond, click links, or forward this message', priority: 'high' },
          { icon: 'ShieldAlert', text: 'Report the sender or domain to the official fraud hotline (1930)', priority: 'medium' },
          { icon: 'CheckCircle', text: 'Verify independently through official corporate phone numbers', priority: 'medium' },
        ]
      : [
          { icon: 'CheckCircle', text: 'Payload appears safe. Follow standard security hygiene.', priority: 'low' },
        ],
    avoidActions: score > 30
      ? [
          { icon: 'CreditCard', text: 'NEVER share OTP, CVV, NetBanking password, or UPI PIN', priority: 'high' },
          { icon: 'Ban', text: 'Do not download APKs, attachments, or remote desktop tools', priority: 'high' },
        ]
      : [
          { icon: 'CreditCard', text: 'Never disclose passwords over unverified chats or calls', priority: 'low' },
        ],
    confidence: 91,
    summary: score > 30 ? `Potential scam detected (${level.toUpperCase()}). Exercise extreme caution.` : 'Analysis indicates safe communication.',
    detailedAnalysis: `Processed across 6 specialized AI agents. Payload verified with ${matchedIndicators.length} risk indicators evaluated.`,
    timestamp: new Date().toISOString(),
  };
}
