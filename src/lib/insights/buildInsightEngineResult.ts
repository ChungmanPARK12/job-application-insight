import type { StatsResult } from "@/lib/stats";
import { detectCorePatterns } from "./detectCorePatterns";
import { narrateCorePatterns } from "./narrateCorePatterns";
import { calculateInsightScore } from "./scoring/calculateInsightScore";
import { rankPatterns, type RankedPattern } from "./rankInsightPatterns";
import { filterPatternsForExposure } from "./filterInsightPatterns";
import { generateInsightActions } from "./generateInsightActions";
import type { FilteredPattern } from "./types/exposure.types";
import type { InsightNarrative } from "./types/narration.types";
import type { InsightAction } from "./types/action.types";

export type InsightEngineResult = {
  stats: StatsResult;
  patterns: RankedPattern[];
  filteredPatterns: FilteredPattern[];
  narratives: InsightNarrative[];
  actions: InsightAction[];
};

export const buildInsightEngineResult = (
  stats: StatsResult
): InsightEngineResult => {
  const patterns = detectCorePatterns(stats);

  const scoredPatterns = patterns.map((pattern) => ({
    ...pattern,
    score: calculateInsightScore(pattern),
  }));

  const rankedPatterns = rankPatterns(scoredPatterns);

  const filteredPatterns = filterPatternsForExposure(rankedPatterns);

  const exposedPatterns = filteredPatterns.filter((item) => item.shouldExpose);

  const narratives = narrateCorePatterns(exposedPatterns);
  const actions = generateInsightActions(exposedPatterns);

  console.log("rankedPatterns", rankedPatterns);
  console.log("filteredPatterns", filteredPatterns);
  console.log("exposedPatterns", exposedPatterns);
  console.log("actions", actions);

  return {
    stats,
    patterns: exposedPatterns,
    filteredPatterns,
    narratives,
    actions,
  };
};