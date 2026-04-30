// src/lib/insights/analysis/rankInsightPatterns.ts
import type { Pattern } from "../types/pattern.types";

export type RankedPattern = Pattern & {
  rank: number;
  rankScore: number;
};

const RANKING_WEIGHTS = {
  score: 0.4,
  confidence: 0.3,
  sampleSize: 0.2,
  strength: 0.1,
};

const strengthScore: Record<string, number> = {
  strong: 1,
  medium: 0.6,
  weak: 0.3,
};

const patternPriority: Record<string, number> = {
  conversion_imbalance: 3,
  distribution_concentration: 2,
  target_narrowness: 1,
};

const normalizeScore = (value?: number): number => {
  if (typeof value !== "number") return 0;
  return Math.max(0, Math.min(1, value));
};

const normalizeSampleSize = (sampleSize?: number): number => {
  if (!sampleSize || sampleSize <= 0) return 0;

  // 100 samples or more is treated as fully sufficient for ranking.
  return Math.min(1, Math.log10(sampleSize + 1) / 2);
};

const getSampleSize = (pattern: Pattern): number => {
  return (
    pattern.metrics?.sampleSize ??
    pattern.metrics?.applications ??
    pattern.metrics?.totalCount ??
    pattern.metrics?.count ??
    0
  );
};

const calculateRankScore = (pattern: Pattern): number => {
  const score = normalizeScore(pattern.score?.finalScore);
  const confidence = normalizeScore(pattern.confidence);
  const sampleSize = normalizeSampleSize(getSampleSize(pattern));
  const strength = strengthScore[pattern.strength] ?? 0;

  return (
    score * RANKING_WEIGHTS.score +
    confidence * RANKING_WEIGHTS.confidence +
    sampleSize * RANKING_WEIGHTS.sampleSize +
    strength * RANKING_WEIGHTS.strength
  );
};

export const rankPatterns = (patterns: Pattern[]): RankedPattern[] => {
  const ranked = patterns.map((pattern) => {
    console.log("=== SAMPLE METRICS CHECK ===", {
      type: pattern.type,
      metrics: pattern.metrics,
      extractedSampleSize: getSampleSize(pattern),
    });

    return {
      ...pattern,
      rankScore: calculateRankScore(pattern),
    };
  });

  const sorted = ranked.sort((a, b) => {
    if (b.rankScore !== a.rankScore) {
      return b.rankScore - a.rankScore;
    }

    const patternDiff =
      (patternPriority[b.type] ?? 0) - (patternPriority[a.type] ?? 0);

    if (patternDiff !== 0) {
      return patternDiff;
    }

    return a.type.localeCompare(b.type);
  });

  return sorted.map((pattern, index) => ({
    ...pattern,
    rank: index + 1,
  }));
};
