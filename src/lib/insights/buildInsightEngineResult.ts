// src/lib/insights/buildInsightsEngineResult.ts
import type { StatsResult } from "@/lib/stats";
import { detectCorePatterns } from "./detectCorePatterns";
import { narrateCorePatterns } from "./narrateCorePatterns";
import { calculateInsightScore } from "./scoring/calculateInsightScore";
import type { Pattern } from "./pattern.types";
import type { InsightNarrative } from "./narration.types";

export type InsightEngineResult = {
  stats: StatsResult;
  patterns: Pattern[];
  narratives: InsightNarrative[];
};

export const buildInsightEngineResult = (
  stats: StatsResult
): InsightEngineResult => {
  const patterns = detectCorePatterns(stats);

  const scoredPatterns = patterns.map((pattern) => ({
    ...pattern,
    score: calculateInsightScore(pattern),
  }));

  const narratives = narrateCorePatterns(scoredPatterns);

  return {
    stats,
    patterns: scoredPatterns,
    narratives,
  };
};