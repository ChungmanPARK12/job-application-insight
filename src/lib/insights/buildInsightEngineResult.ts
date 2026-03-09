// src/lib/insights/buildInsightEngineResult.ts
import type { StatsResult } from "@/lib/stats";
import { detectCorePatterns } from "./detectCorePatterns";
import { narrateCorePatterns } from "./narrateCorePatterns";
import type { Pattern } from "./pattern.types";
import type { InsightNarrative } from "./narration.types";

export type InsightEngineResult = {
  patterns: Pattern[];
  narratives: InsightNarrative[];
};

export const buildInsightEngineResult = (
  stats: StatsResult
): InsightEngineResult => {
  const patterns = detectCorePatterns(stats);
  const narratives = narrateCorePatterns(patterns);

  return {
    patterns,
    narratives,
  };
};