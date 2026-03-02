// src/lib/insights/detectCorePatterns.ts

import type { StatsResult } from "@/lib/stats";
import type { BreakdownDimension, BreakdownResult } from "@/lib/stats/types";
import { Pattern, PatternStrength } from "./types";

// Day1 thresholds (draft v2.0)
const MIN_WEAK_APPS = 30;
const MIN_STRONG_APPS = 50;

const CONV_WEAK_RATE_MAX = 0.07;
const CONV_STRONG_RATE_MAX = 0.04;

const DIST_WEAK_DOMINANT_MIN = 0.65;
const DIST_STRONG_DOMINANT_MIN = 0.8;

const TARGET_WEAK_DOMINANT_MIN = 0.75;
const TARGET_STRONG_DOMINANT_MIN = 0.9;

// Day4 thresholds
const SILENCE_MIN_APPS = 20;
const MAX_EXPOSED_PATTERNS = 2;

export type DetectCorePatternsOptions = {
  // if you want to tune later without touching core logic
  minWeakApps?: number;
  minStrongApps?: number;

  // Day4 knobs (optional)
  silenceMinApps?: number;
  maxExposed?: number;
};

const typePriority: Record<Pattern["type"], number> = {
  conversion_imbalance: 3,
  distribution_concentration: 2,
  target_narrowness: 1,
};

export const detectCorePatterns = (
  stats: StatsResult,
  options: DetectCorePatternsOptions = {}
): Pattern[] => {
  const minWeakApps = options.minWeakApps ?? MIN_WEAK_APPS;
  const minStrongApps = options.minStrongApps ?? MIN_STRONG_APPS;

  const silenceMinApps = options.silenceMinApps ?? SILENCE_MIN_APPS;
  const maxExposed = options.maxExposed ?? MAX_EXPOSED_PATTERNS;

  const totalApps = stats?.overall?.total ?? 0;
  const overallInterviewRate = stats?.overall?.interview_rate;

  // Day4 — Silence Mode: hard suppression for insufficient sample
  if (totalApps < silenceMinApps) return [];

  // Guardrail: if overall is missing or not meaningful, return empty
  if (overallInterviewRate == null || totalApps <= 0) return [];

  const patterns: Pattern[] = [];

  const p1 = checkConversionImbalance(
    totalApps,
    overallInterviewRate,
    minWeakApps,
    minStrongApps
  );
  if (p1) patterns.push(p1);

  const p2 = checkDistributionConcentration(stats.breakdowns, totalApps, minWeakApps);
  if (p2) patterns.push(p2);

  const p3 = checkTargetNarrowness(stats.breakdowns, totalApps, minWeakApps);
  if (p3) patterns.push(p3);

  // Day4 — Prevent noisy surfacing:
  // If everything is weak with low confidence, you can optionally suppress.
  // For v2.0, keep it simple: rely on minWeakApps + silenceMinApps guardrails.

  // Day4 — Prioritization + Max exposure
  patterns.sort((a, b) => {
    // 1) strong first
    if (a.strength !== b.strength) {
      return a.strength === "strong" ? -1 : 1;
    }
    // 2) higher confidence first
    if (a.confidence !== b.confidence) {
      return b.confidence - a.confidence;
    }
    // 3) fixed priority: Conversion > Distribution > Target
    return typePriority[b.type] - typePriority[a.type];
  });

  return patterns.slice(0, maxExposed);
};

// --------------------------
// Pattern A: Conversion Imbalance
// --------------------------
const checkConversionImbalance = (
  totalApps: number,
  interviewRate: number,
  minWeakApps: number,
  minStrongApps: number
): Pattern | null => {
  if (totalApps < minWeakApps) return null;

  let strength: PatternStrength | null = null;

  if (totalApps >= minStrongApps && interviewRate <= CONV_STRONG_RATE_MAX) {
    strength = "strong";
  } else if (interviewRate <= CONV_WEAK_RATE_MAX) {
    strength = "weak";
  }

  if (!strength) return null;

  // if responses count is needed later, we can estimate
  const estimatedInterviews = Math.round(interviewRate * totalApps);

  return {
    type: "conversion_imbalance",
    strength,
    metrics: {
      applications: totalApps,
      interview_rate: interviewRate,
      estimated_interviews: estimatedInterviews,
    },
    confidence: confidenceBySample(totalApps),
  };
};

// --------------------------
// Pattern B: Distribution Concentration (job_source or location)
// --------------------------
const checkDistributionConcentration = (
  breakdowns: BreakdownResult[],
  totalApps: number,
  minWeakApps: number
): Pattern | null => {
  if (totalApps < minWeakApps) return null;

  // Use job_source + location only
  const candidates = breakdowns.filter(
    (b) => b.dimension === "job_source" || b.dimension === "location"
  );

  // Need at least one meaningful breakdown with >=2 categories
  const valid = candidates.filter((b) => b.rows.length >= 2);
  if (valid.length === 0) return null;

  // Find the best dominant ratio among source/location
  let best: { dim: BreakdownDimension; key: string; ratio: number } | null = null;

  for (const b of valid) {
    const dom = getDominantFromBreakdown(b, totalApps);
    if (!dom) continue;

    if (!best || dom.ratio > best.ratio) {
      best = { dim: b.dimension, key: dom.key, ratio: dom.ratio };
    }
  }

  if (!best) return null;
  if (best.ratio < DIST_WEAK_DOMINANT_MIN) return null;

  const strength: PatternStrength =
    best.ratio >= DIST_STRONG_DOMINANT_MIN ? "strong" : "weak";

  return {
    type: "distribution_concentration",
    strength,
    metrics: {
      dominant_ratio: best.ratio,
    },
    meta: {
      dominant_dimension: best.dim,
      dominant_category: best.key,
    },
    confidence: confidenceBySample(totalApps),
  };
};

// --------------------------
// Pattern C: Target Narrowness (position_keyword)
// --------------------------
const checkTargetNarrowness = (
  breakdowns: BreakdownResult[],
  totalApps: number,
  minWeakApps: number
): Pattern | null => {
  if (totalApps < minWeakApps) return null;

  const b = breakdowns.find((x) => x.dimension === "position_keyword");
  if (!b) return null;

  const uniqueCount = b.rows.length;
  if (uniqueCount < 2) return null;

  const dom = getDominantFromBreakdown(b, totalApps);
  if (!dom) return null;

  if (dom.ratio < TARGET_WEAK_DOMINANT_MIN) return null;

  const strength: PatternStrength =
    dom.ratio >= TARGET_STRONG_DOMINANT_MIN ? "strong" : "weak";

  return {
    type: "target_narrowness",
    strength,
    metrics: {
      dominant_keyword_ratio: dom.ratio,
      unique_keyword_count: uniqueCount,
    },
    meta: {
      dominant_keyword: dom.key,
    },
    confidence: confidenceBySample(totalApps),
  };
};

// --------------------------
// Helpers
// --------------------------
const getDominantFromBreakdown = (
  b: BreakdownResult,
  totalApps: number
): { key: string; ratio: number } | null => {
  if (!b.rows || b.rows.length === 0) return null;

  let bestKey = "";
  let bestTotal = 0;

  for (const row of b.rows) {
    if (row.total > bestTotal) {
      bestTotal = row.total;
      bestKey = row.key;
    }
  }

  if (bestTotal <= 0 || totalApps <= 0) return null;

  return { key: bestKey, ratio: bestTotal / totalApps };
};

const confidenceBySample = (apps: number): number => {
  if (apps >= 100) return 1.0;
  if (apps >= 50) return 0.8;
  if (apps >= 30) return 0.6;
  return 0.4;
};