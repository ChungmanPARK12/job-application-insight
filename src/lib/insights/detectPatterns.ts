// src/lib/insights/detectPatterns.ts

import type { StatsResult, BreakdownResult } from "@/lib/stats";

export type PatternMetric = "interview_rate";

export type PatternFinding = {
  dimension: BreakdownResult["dimension"];
  key: string; // group key, e.g. "LinkedIn", "Adelaide", "2026-02", "junior"
  metric: PatternMetric;

  group_total: number;
  overall_total: number;

  group_rate: number;
  overall_rate: number;

  delta: number; // group_rate - overall_rate
  direction: "higher" | "lower";
};

export type DetectPatternsOptions = {
  minSampleOverall?: number; // guard: overall rate must exist
  minSampleGroup?: number;   // guard: group total must be >= this
  minAbsDelta?: number;      // guard: only return findings above this
  topN?: number;             // return top N by abs(delta)
};

const abs = (n: number) => (n < 0 ? -n : n);

export const detectPatterns = (
  stats: StatsResult,
  options: DetectPatternsOptions = {}
): PatternFinding[] => {
  const minSampleOverall = options.minSampleOverall ?? 10;
  const minSampleGroup = options.minSampleGroup ?? 5;
  const minAbsDelta = options.minAbsDelta ?? 0.15; // 15%p difference
  const topN = options.topN ?? 8;

  const overall = stats.overall;

  // Guard: overall must be meaningful enough to compare against
  if (!overall || overall.total < minSampleOverall || overall.interview_rate == null) {
    return [];
  }

  const overallRate = overall.interview_rate;
  const findings: PatternFinding[] = [];

  for (const b of stats.breakdowns) {
    for (const row of b.rows) {
      if (row.total < minSampleGroup) continue;
      if (row.interview_rate == null) continue;

      const delta = row.interview_rate - overallRate;
      const magnitude = abs(delta);

      if (magnitude < minAbsDelta) continue;

      findings.push({
        dimension: b.dimension,
        key: row.key,
        metric: "interview_rate",
        group_total: row.total,
        overall_total: overall.total,
        group_rate: row.interview_rate,
        overall_rate: overallRate,
        delta,
        direction: delta >= 0 ? "higher" : "lower",
      });
    }
  }

  // Sort by absolute delta (largest differences first)
  findings.sort((a, b) => abs(b.delta) - abs(a.delta));

  return findings.slice(0, topN);
};
