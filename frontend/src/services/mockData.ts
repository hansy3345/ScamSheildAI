import type { AnalysisResult, HistoryItem, ScanStage } from '../types';

/* ===================================================================
 * Realistic mock scam analysis results used for demo & sample cases.
 * Each case is structured identically to what the Gemini API will
 * return, making the swap to real data seamless.
 * =================================================================== */

export const MOCK_RESULTS: Record<string, AnalysisResult> = {
  /* ---- 1. Nigerian Prince Email — Critical ---- */
  'nigerian-prince': {
    id: 'mock-001',
    riskScore: 92,
    riskLevel: 'critical',
    scamCategory: 'advance-fee',
    categoryLabel: 'Advance Fee Scam',
    explanation:
      'This message exhibits classic advance-fee fraud characteristics. It promises an unrealistic large sum of money in exchange for a small upfront payment or personal information. The sender claims to be royalty or a government official — a hallmark of Nigerian Prince scams that have been operating since the 1990s.',
    riskFactors: [
      { label: 'Unrealistic financial promise', severity: 95, description: 'Claims of millions in inheritance with no prior relationship' },
      { label: 'Request for personal information', severity: 90, description: 'Asks for bank details, phone number, and full name upfront' },
      { label: 'Urgency pressure', severity: 85, description: 'Uses phrases like "respond immediately" and "time-sensitive matter"' },
      { label: 'Grammatical inconsistencies', severity: 70, description: 'Multiple spelling errors and unusual phrasing patterns' },
      { label: 'Suspicious sender identity', severity: 88, description: 'Claims to be a foreign prince or government official' },
    ],
    evidence: [
      { type: 'pattern', title: 'Advance fee pattern', detail: 'Message matches known advance-fee fraud templates with 94% similarity', severity: 'critical' },
      { type: 'text', title: 'Financial bait', detail: 'Mentions specific large sum ($4.5M) to entice victim', severity: 'critical' },
      { type: 'behavioral', title: 'Cold outreach', detail: 'Unsolicited contact claiming pre-existing relationship or inheritance', severity: 'high-risk' },
      { type: 'text', title: 'Personal data request', detail: 'Requests bank account details, full name, and phone number', severity: 'critical' },
      { type: 'metadata', title: 'Common scam origin', detail: 'Language patterns consistent with West African advance-fee operations', severity: 'suspicious' },
    ],
    recommendedActions: [
      { icon: 'Trash2', text: 'Delete this message immediately', priority: 'high' },
      { icon: 'ShieldAlert', text: 'Report to your email provider as phishing', priority: 'high' },
      { icon: 'Ban', text: 'Block the sender', priority: 'high' },
      { icon: 'AlertTriangle', text: 'If you shared any info, contact your bank immediately', priority: 'high' },
      { icon: 'Users', text: 'Warn friends and family about this type of scam', priority: 'medium' },
    ],
    avoidActions: [
      { icon: 'Reply', text: 'Do NOT reply to the message', priority: 'high' },
      { icon: 'CreditCard', text: 'Do NOT share any banking or financial information', priority: 'high' },
      { icon: 'Send', text: 'Do NOT send any money or gift cards', priority: 'high' },
      { icon: 'Link', text: 'Do NOT click any links in the message', priority: 'high' },
      { icon: 'Phone', text: 'Do NOT call any phone numbers provided', priority: 'medium' },
    ],
    confidence: 97,
    summary: 'This is a classic Nigerian Prince / advance-fee scam with a 92/100 risk score.',
    detailedAnalysis: 'The message uses well-documented advance-fee fraud tactics including false authority claims, emotional manipulation through fabricated stories, and requests for sensitive personal and financial information. This scam type has been identified by the FBI, Interpol, and cybersecurity organizations worldwide.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },

  /* ---- 2. Fake Amazon Delivery SMS — High Risk ---- */
  'fake-delivery': {
    id: 'mock-002',
    riskScore: 78,
    riskLevel: 'high-risk',
    scamCategory: 'delivery-scam',
    categoryLabel: 'Delivery Scam',
    explanation:
      'This SMS impersonates Amazon delivery services with a fake tracking link. The URL leads to a phishing site designed to steal credit card information under the guise of a re-delivery fee. Amazon never sends SMS messages asking for payment for failed deliveries.',
    riskFactors: [
      { label: 'Fake brand impersonation', severity: 85, description: 'Pretends to be Amazon but uses unofficial contact method' },
      { label: 'Suspicious URL', severity: 90, description: 'Link domain does not match amazon.com — uses amaz0n-delivery.xyz' },
      { label: 'Payment request', severity: 80, description: 'Asks for a small "re-delivery fee" to capture card details' },
      { label: 'Urgency language', severity: 65, description: '"Package will be returned in 24 hours" creates false urgency' },
    ],
    evidence: [
      { type: 'url', title: 'Fraudulent domain', detail: 'amaz0n-delivery.xyz registered 3 days ago — typosquatting amazon.com', severity: 'critical' },
      { type: 'pattern', title: 'Delivery scam template', detail: 'Matches known fake delivery SMS patterns used in bulk campaigns', severity: 'high-risk' },
      { type: 'text', title: 'Small fee trap', detail: '$2.99 re-delivery fee is designed to seem harmless while capturing full card details', severity: 'high-risk' },
      { type: 'metadata', title: 'Non-standard sender', detail: 'SMS sent from short code not registered to Amazon', severity: 'suspicious' },
    ],
    recommendedActions: [
      { icon: 'Trash2', text: 'Delete the SMS message', priority: 'high' },
      { icon: 'Package', text: 'Check your Amazon account directly at amazon.com for delivery status', priority: 'high' },
      { icon: 'ShieldAlert', text: 'Report the number as spam on your phone', priority: 'medium' },
      { icon: 'Info', text: 'Forward the SMS to Amazon at stop@amazon.com', priority: 'medium' },
    ],
    avoidActions: [
      { icon: 'Link', text: 'Do NOT click the tracking link', priority: 'high' },
      { icon: 'CreditCard', text: 'Do NOT enter any payment information', priority: 'high' },
      { icon: 'Reply', text: 'Do NOT reply to the SMS', priority: 'medium' },
      { icon: 'Download', text: 'Do NOT download any apps linked in the message', priority: 'high' },
    ],
    confidence: 91,
    summary: 'Fake Amazon delivery SMS with phishing link — 78/100 risk score.',
    detailedAnalysis: 'This SMS uses brand impersonation, a fraudulent domain (registered 3 days ago), and a small-fee social engineering tactic to harvest credit card information. It is part of a widespread delivery scam campaign.',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
  },

  /* ---- 3. Legitimate Bank Notification — Safe ---- */
  'legit-bank': {
    id: 'mock-003',
    riskScore: 8,
    riskLevel: 'safe',
    scamCategory: 'legitimate',
    categoryLabel: 'Legitimate',
    explanation:
      'This appears to be a genuine notification from your bank. The message contains standard transaction alert formatting, comes from a verified sender, and does not request any personal information or contain suspicious links.',
    riskFactors: [
      { label: 'Standard format', severity: 5, description: 'Message follows standard bank notification format' },
      { label: 'No personal data request', severity: 3, description: 'Does not ask for passwords, PINs, or account details' },
      { label: 'Verified sender', severity: 8, description: 'Sender matches known bank communication channels' },
    ],
    evidence: [
      { type: 'metadata', title: 'Verified sender', detail: 'Message originates from verified bank shortcode/email domain', severity: 'safe' },
      { type: 'pattern', title: 'Standard notification', detail: 'Content matches standard transaction alert templates', severity: 'safe' },
      { type: 'text', title: 'No action required', detail: 'Informational only — does not request any user action or data', severity: 'safe' },
    ],
    recommendedActions: [
      { icon: 'CheckCircle', text: 'This message appears safe — no action needed', priority: 'low' },
      { icon: 'CreditCard', text: 'Verify the transaction amount in your banking app if unsure', priority: 'low' },
      { icon: 'Bell', text: 'Keep transaction alerts enabled for security', priority: 'low' },
    ],
    avoidActions: [
      { icon: 'AlertTriangle', text: 'Still avoid clicking links in messages — use your banking app directly', priority: 'medium' },
      { icon: 'Phone', text: "Don't call numbers in messages — use the number on your card", priority: 'low' },
    ],
    confidence: 94,
    summary: 'Legitimate bank transaction notification — 8/100 risk score.',
    detailedAnalysis: 'All indicators suggest this is a genuine bank notification. The formatting, sender details, and content are consistent with verified banking communications. No phishing or scam indicators detected.',
    timestamp: new Date(Date.now() - 10800000).toISOString(),
  },

  /* ---- 4. Suspicious Job Offer — Suspicious ---- */
  'suspicious-job': {
    id: 'mock-004',
    riskScore: 55,
    riskLevel: 'suspicious',
    scamCategory: 'job-scam',
    categoryLabel: 'Job Scam',
    explanation:
      'This job offer shows several warning signs common in employment scams. The salary is unusually high for the described role, there is no formal interview process, and it requests upfront fees for "training materials." However, some elements appear legitimate, making this a borderline case requiring caution.',
    riskFactors: [
      { label: 'Above-market salary', severity: 60, description: '₹1,50,000/month for entry-level data entry is 3x market rate' },
      { label: 'Upfront fee request', severity: 75, description: 'Requires ₹5,000 registration fee for training materials' },
      { label: 'No interview process', severity: 55, description: 'Direct offer without any assessment or interview' },
      { label: 'Vague company details', severity: 50, description: 'Company name yields limited results in business registries' },
      { label: 'WhatsApp-based hiring', severity: 45, description: 'Professional companies typically use official email for recruitment' },
    ],
    evidence: [
      { type: 'behavioral', title: 'No screening process', detail: 'Legitimate employers conduct interviews — this offers immediate hiring', severity: 'suspicious' },
      { type: 'text', title: 'Registration fee', detail: 'Genuine employers never charge candidates for hiring or training', severity: 'high-risk' },
      { type: 'metadata', title: 'Unverified company', detail: 'Company registration details could not be verified in MCA database', severity: 'suspicious' },
      { type: 'pattern', title: 'Job scam indicators', detail: '3 of 5 common job scam patterns detected', severity: 'suspicious' },
    ],
    recommendedActions: [
      { icon: 'Search', text: 'Research the company name on LinkedIn and official business registries', priority: 'high' },
      { icon: 'Ban', text: 'Never pay upfront fees for any job — this is a major red flag', priority: 'high' },
      { icon: 'Phone', text: 'Try to verify by calling the company through officially listed numbers', priority: 'medium' },
      { icon: 'Users', text: 'Ask in professional forums if others have received similar offers', priority: 'medium' },
    ],
    avoidActions: [
      { icon: 'CreditCard', text: 'Do NOT pay any registration or training fees', priority: 'high' },
      { icon: 'FileText', text: 'Do NOT share Aadhaar, PAN, or bank details at this stage', priority: 'high' },
      { icon: 'Forward', text: 'Do NOT forward the offer to others as a referral', priority: 'medium' },
    ],
    confidence: 78,
    summary: 'Suspicious job offer with upfront fee request — 55/100 risk score.',
    detailedAnalysis: 'The job offer combines elements that could be legitimate with several red flags typical of employment scams, particularly the upfront fee requirement and absence of any screening process.',
    timestamp: new Date(Date.now() - 14400000).toISOString(),
  },

  /* ---- 5. UPI Payment Request Scam — High Risk ---- */
  'upi-scam': {
    id: 'mock-005',
    riskScore: 85,
    riskLevel: 'critical',
    scamCategory: 'upi-fraud',
    categoryLabel: 'UPI/Payment Fraud',
    explanation:
      'This message attempts a UPI payment fraud where the scammer poses as a buyer on an online marketplace and sends a "payment request" instead of making an actual payment. The request would debit money FROM your account, not credit it. This is a very common scam in India.',
    riskFactors: [
      { label: 'Reversed payment direction', severity: 95, description: 'Claims to "send" money but actually requests money from your UPI' },
      { label: 'Marketplace impersonation', severity: 80, description: 'Pretends to be a buyer from OLX/Quikr responding to your listing' },
      { label: 'PIN request', severity: 90, description: 'Asks you to enter UPI PIN to "receive" money — PIN is only needed to SEND money' },
      { label: 'Social engineering', severity: 75, description: 'Creates urgency claiming they need item urgently for a family event' },
    ],
    evidence: [
      { type: 'pattern', title: 'UPI collect scam', detail: 'Matches UPI collect request fraud pattern with 96% similarity', severity: 'critical' },
      { type: 'behavioral', title: 'Reverse payment trick', detail: 'Sending a "collect" request instead of payment — money flows FROM victim', severity: 'critical' },
      { type: 'text', title: 'PIN social engineering', detail: 'Legitimate payments never require the RECEIVER to enter a PIN', severity: 'critical' },
      { type: 'metadata', title: 'Unknown UPI ID', detail: 'Sender UPI ID not linked to any verified merchant or business', severity: 'high-risk' },
    ],
    recommendedActions: [
      { icon: 'XCircle', text: 'DECLINE the UPI collect request immediately', priority: 'high' },
      { icon: 'ShieldAlert', text: 'Report the UPI ID to your bank and NPCI', priority: 'high' },
      { icon: 'Ban', text: 'Block the contact on WhatsApp/messaging app', priority: 'high' },
      { icon: 'Info', text: 'Remember: You NEVER need to enter PIN to receive money', priority: 'high' },
      { icon: 'MessageSquare', text: 'Report the user on the marketplace platform', priority: 'medium' },
    ],
    avoidActions: [
      { icon: 'KeyRound', text: 'Do NOT enter your UPI PIN for any "incoming" payment', priority: 'high' },
      { icon: 'CheckCircle', text: 'Do NOT approve any UPI collect/payment request', priority: 'high' },
      { icon: 'Share', text: 'Do NOT share your UPI PIN, OTP, or bank details', priority: 'high' },
      { icon: 'QrCode', text: 'Do NOT scan any QR code sent by the buyer', priority: 'high' },
    ],
    confidence: 96,
    summary: 'UPI collect request scam targeting marketplace sellers — 85/100 risk score.',
    detailedAnalysis: 'This is a textbook UPI collect request fraud. The scammer leverages the confusion between "collect" and "pay" requests on UPI platforms. Victims enter their PIN thinking they are receiving money, but are actually authorizing a debit from their account.',
    timestamp: new Date(Date.now() - 18000000).toISOString(),
  },

  /* ---- 6. Phishing URL — Critical ---- */
  'phishing-url': {
    id: 'mock-006',
    riskScore: 95,
    riskLevel: 'critical',
    scamCategory: 'phishing',
    categoryLabel: 'Phishing',
    explanation:
      'This URL is a sophisticated phishing site disguised as a banking login page. The domain uses homograph characters (replacing "i" with "ì") to mimic a legitimate bank website. The SSL certificate is self-signed and the site was registered less than 48 hours ago.',
    riskFactors: [
      { label: 'Homograph attack domain', severity: 98, description: 'Domain uses look-alike characters to impersonate legitimate bank' },
      { label: 'Recently registered', severity: 90, description: 'Domain registered less than 48 hours ago' },
      { label: 'Self-signed SSL', severity: 85, description: 'Uses self-signed certificate instead of legitimate CA' },
      { label: 'Credential harvesting form', severity: 95, description: 'Page contains login form that submits to attacker-controlled server' },
      { label: 'Known threat intel match', severity: 92, description: 'Domain flagged in multiple threat intelligence databases' },
    ],
    evidence: [
      { type: 'url', title: 'Malicious domain', detail: 'Domain hdfc-netbankìng.com uses Punycode homograph attack (xn--hdfc-netbanking-...)', severity: 'critical' },
      { type: 'url', title: 'New registration', detail: 'WHOIS data shows domain registered 36 hours ago via privacy proxy', severity: 'critical' },
      { type: 'pattern', title: 'Phishing kit detected', detail: 'Page structure matches known bank phishing kit "BankPhish v3.2"', severity: 'critical' },
      { type: 'metadata', title: 'Threat intelligence', detail: 'Domain appears in VirusTotal (4/89 detections), PhishTank, and OpenPhish feeds', severity: 'critical' },
      { type: 'behavioral', title: 'Data exfiltration', detail: 'Form data sent to external server at 185.xx.xx.xx (known C2 infrastructure)', severity: 'critical' },
    ],
    recommendedActions: [
      { icon: 'XCircle', text: 'Close the page immediately if you have it open', priority: 'high' },
      { icon: 'KeyRound', text: 'If you entered credentials, change your bank password NOW', priority: 'high' },
      { icon: 'Phone', text: 'Call your bank using the number on your card to report', priority: 'high' },
      { icon: 'ShieldAlert', text: 'Report the URL at safebrowsing.google.com', priority: 'medium' },
      { icon: 'Scan', text: 'Run an antivirus scan on your device', priority: 'medium' },
    ],
    avoidActions: [
      { icon: 'Link', text: 'Do NOT revisit this URL', priority: 'high' },
      { icon: 'KeyRound', text: 'Do NOT enter any credentials or personal information', priority: 'high' },
      { icon: 'Download', text: 'Do NOT download anything from this site', priority: 'high' },
      { icon: 'Forward', text: 'Do NOT forward this link to anyone', priority: 'high' },
    ],
    confidence: 99,
    summary: 'Sophisticated phishing site using homograph domain attack — 95/100 risk score.',
    detailedAnalysis: 'This is a highly sophisticated phishing attack using internationalized domain name (IDN) homograph techniques. The site is a pixel-perfect clone of a legitimate bank login page, hosted on recently registered infrastructure with known ties to phishing operations.',
    timestamp: new Date(Date.now() - 21600000).toISOString(),
  },
};

/* ===== Sample Input Text for "Try a Sample" Feature ===== */

export const SAMPLE_INPUTS: Record<string, { inputType: string; content: string; label: string }> = {
  'nigerian-prince': {
    inputType: 'email',
    label: 'Nigerian Prince Email',
    content: `Subject: URGENT — Inheritance of $4,500,000 USD\nFrom: prince.abubakar@diplomats-ng.com\n\nDear Beloved,\n\nI am Prince Abubakar, son of the late Minister of Petroleum in Nigeria. Before my father passed, he deposited $4,500,000 in a security vault. I need a trusted foreign partner to help me transfer these funds. You will receive 30% as compensation.\n\nPlease respond immediately with your:\n- Full Name\n- Bank Account Details\n- Phone Number\n\nThis matter is very urgent and time-sensitive. God bless you.\n\nPrince Abubakar`,
  },
  'fake-delivery': {
    inputType: 'message',
    label: 'Fake Delivery SMS',
    content: `AMAZON: Your package #AMZ-38491 could not be delivered. A re-delivery fee of $2.99 is required. Pay now to avoid return: https://amaz0n-delivery.xyz/redelivery?id=38491\n\nPackage will be returned to sender in 24 hours.`,
  },
  'legit-bank': {
    inputType: 'message',
    label: 'Legitimate Bank Alert',
    content: `SBI: Your a/c XX1234 debited by Rs.2,500.00 on 28-Aug-25 at SWIGGY. Avl Bal Rs.45,230.50. If not done by you, call 1800-111-111. — SBI`,
  },
  'suspicious-job': {
    inputType: 'job-offer',
    label: 'Suspicious Job Offer',
    content: `Hi! We found your resume on Naukri.com. We have an urgent opening for Data Entry Operator at GlobalTech Solutions.\n\nSalary: ₹1,50,000/month (work from home)\nExperience: No experience needed\nJoining: Immediate\n\nTo confirm your seat, pay ₹5,000 registration fee for training materials. Send to our HR WhatsApp: +91-98765-43210\n\nLimited seats available!`,
  },
  'upi-scam': {
    inputType: 'message',
    label: 'UPI Payment Scam',
    content: `Hi, I'm interested in buying the sofa you listed on OLX for ₹15,000. I'm sending the payment right now through Google Pay. Please accept the request and enter your UPI PIN to receive the money. I need it urgently for my sister's wedding this weekend. The collect request is from suresh.buyer@okaxis.`,
  },
  'phishing-url': {
    inputType: 'url',
    label: 'Phishing URL',
    content: `https://hdfc-netbankìng.com/secure/login`,
  },
};

/* ===== Default Scan Stages ===== */

export const DEFAULT_SCAN_STAGES: ScanStage[] = [
  { id: 'receiving', name: 'Receiving Input', agentName: 'Input Handler', description: 'Securely receiving and validating your submission', status: 'pending', duration: 800, icon: 'Download' },
  { id: 'extracting', name: 'Extracting Content', agentName: 'Content Analysis Agent', description: 'Parsing text, metadata, and embedded elements', status: 'pending', duration: 1200, icon: 'FileSearch' },
  { id: 'patterns', name: 'Detecting Patterns', agentName: 'Scam Pattern Agent', description: 'Matching against known scam patterns and techniques', status: 'pending', duration: 1500, icon: 'Scan' },
  { id: 'evidence', name: 'Checking Evidence', agentName: 'Evidence & URL Agent', description: 'Cross-referencing databases and threat intelligence', status: 'pending', duration: 1300, icon: 'Database' },
  { id: 'risk', name: 'Assessing Risk', agentName: 'Risk Assessment Agent', description: 'Computing risk score and confidence level', status: 'pending', duration: 1000, icon: 'Shield' },
  { id: 'protection', name: 'Generating Protection', agentName: 'Safety Advisor Agent', description: 'Creating personalized safety recommendations', status: 'pending', duration: 800, icon: 'ShieldCheck' },
];

/* ===== Pre-populated History for Dashboard Demo ===== */

export function getInitialHistory(): HistoryItem[] {
  return Object.entries(MOCK_RESULTS).map(([key, result]) => ({
    id: result.id,
    inputType: (SAMPLE_INPUTS[key]?.inputType || 'message') as HistoryItem['inputType'],
    inputPreview: SAMPLE_INPUTS[key]?.content.slice(0, 120) || 'Sample analysis',
    result,
    timestamp: result.timestamp,
  }));
}
