import type { RiskLevel, HistoryItem, DashboardStats, CategoryCount, TrendPoint } from '../types';
import { RISK_LEVEL_CONFIG, SCAM_CATEGORY_CONFIG } from './constants';

/**
 * Determine risk level from a numeric score
 */
export function getRiskLevel(score: number): RiskLevel {
  if (score <= 30) return 'safe';
  if (score <= 60) return 'suspicious';
  if (score <= 80) return 'high-risk';
  return 'critical';
}

/**
 * Get risk level display configuration
 */
export function getRiskConfig(level: RiskLevel) {
  return RISK_LEVEL_CONFIG[level];
}

/**
 * Format a date string to a readable format
 */
export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

/**
 * Format a date to full readable string
 */
export function formatFullDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Compute dashboard statistics from history items
 */
export function computeDashboardStats(history: HistoryItem[]): DashboardStats {
  const totalScans = history.length;

  const riskDistribution = {
    safe: 0,
    suspicious: 0,
    highRisk: 0,
    critical: 0,
  };

  const categoryMap = new Map<string, number>();
  let totalRiskScore = 0;
  let scamsDetected = 0;
  let highRiskCount = 0;

  for (const item of history) {
    const { riskScore, riskLevel, scamCategory } = item.result;
    totalRiskScore += riskScore;

    if (riskLevel !== 'safe') scamsDetected++;
    if (riskLevel === 'high-risk' || riskLevel === 'critical') highRiskCount++;

    switch (riskLevel) {
      case 'safe': riskDistribution.safe++; break;
      case 'suspicious': riskDistribution.suspicious++; break;
      case 'high-risk': riskDistribution.highRisk++; break;
      case 'critical': riskDistribution.critical++; break;
    }

    categoryMap.set(scamCategory, (categoryMap.get(scamCategory) || 0) + 1);
  }

  const categoryBreakdown: CategoryCount[] = Array.from(categoryMap.entries())
    .map(([cat, count]) => ({
      category: cat as keyof typeof SCAM_CATEGORY_CONFIG,
      label: SCAM_CATEGORY_CONFIG[cat as keyof typeof SCAM_CATEGORY_CONFIG]?.label || cat,
      count,
      color: SCAM_CATEGORY_CONFIG[cat as keyof typeof SCAM_CATEGORY_CONFIG]?.color || '#6b7280',
    }))
    .sort((a, b) => b.count - a.count);

  // Generate trend data from history (group by date)
  const trendMap = new Map<string, { scans: number; threats: number }>();
  for (const item of history) {
    const date = new Date(item.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const entry = trendMap.get(date) || { scans: 0, threats: 0 };
    entry.scans++;
    if (item.result.riskLevel !== 'safe') entry.threats++;
    trendMap.set(date, entry);
  }

  const scanTrend: TrendPoint[] = Array.from(trendMap.entries()).map(([date, data]) => ({
    date,
    scans: data.scans,
    threats: data.threats,
  }));

  const recentScans = [...history]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

  return {
    totalScans,
    scamsDetected,
    highRiskCount,
    averageRiskScore: totalScans > 0 ? Math.round(totalRiskScore / totalScans) : 0,
    riskDistribution,
    categoryBreakdown,
    recentScans,
    scanTrend,
  };
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get input type icon color
 */
export function getInputTypeColor(type: string): string {
  const colors: Record<string, string> = {
    message: 'text-cyan-400',
    screenshot: 'text-violet-400',
    url: 'text-indigo-400',
    email: 'text-amber-400',
    'job-offer': 'text-emerald-400',
    other: 'text-zinc-400',
  };
  return colors[type] || 'text-zinc-400';
}

/**
 * Delay utility for scan animation
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
