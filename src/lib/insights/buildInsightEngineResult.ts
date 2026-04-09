// src/lib/insights/buildInsightEngineResult.ts
import type { StatsResult } from "@/lib/stats";
import { detectCorePatterns } from "./detectCorePatterns";
import { narrateCorePatterns } from "./narrateCorePatterns";
import { calculateInsightScore } from "./scoring/calculateInsightScore";
import { rankPatterns, type RankedPattern } from "./rankInsightPatterns";
import { filterPatternsForExposure } from "./filterInsightPatterns";
import { generateInsightActions } from "./generateInsightActions";
import { generateDecision } from "./decision/generateDecision";
import { buildExecutionPlan } from "./decision/buildExcecutionPlan";
import { buildOutcomeProjection } from "./decision/buildOutcomeProjection";
import type { FilteredPattern } from "./types/exposure.types";
import type { InsightNarrative } from "./types/narration.types";
import type { InsightAction } from "./types/action.types";
import type { Decision } from "./types/decision.types";

export type InsightEngineResult = {
  stats: StatsResult;
  patterns: RankedPattern[];
  filteredPatterns: FilteredPattern[];
  primaryDecision: Decision | null;
  supportingSignals: RankedPattern[];
  narratives: InsightNarrative[];
  actions: InsightAction[];
};

export const buildInsightEngineResult = (
  stats: StatsResult,
): InsightEngineResult => {
  const patterns = detectCorePatterns(stats);

  const scoredPatterns = patterns.map((pattern) => ({
    ...pattern,
    score: calculateInsightScore(pattern),
  }));

  const rankedPatterns = rankPatterns(scoredPatterns);

  const filteredPatterns = filterPatternsForExposure(rankedPatterns);

  const exposedPatterns = filteredPatterns.filter((item) => item.shouldExpose);

  const primaryPattern = exposedPatterns[0];

  const primaryAction = primaryPattern
    ? (generateInsightActions([primaryPattern])[0] ?? null)
    : null;

  const primaryDecision = primaryPattern
    ? (() => {
        const decision = generateDecision(primaryPattern);
        const executionPlan = primaryAction
          ? buildExecutionPlan(primaryPattern.type, primaryAction)
          : undefined;

        const outcomeProjection = buildOutcomeProjection({
          pattern: primaryPattern,
          confidenceLabel: decision.confidence.label,
        });

        return {
          ...decision,
          executionPlan,
          outcomeProjection,
        };
      })()
    : null;

  const supportingSignals = exposedPatterns.slice(1);

  const narratives = narrateCorePatterns(exposedPatterns);
  const actions = generateInsightActions(exposedPatterns);

  console.log("rankedPatterns", rankedPatterns);
  console.log("filteredPatterns", filteredPatterns);
  console.log("exposedPatterns", exposedPatterns);
  console.log("primaryDecision", primaryDecision);
  console.log("supportingSignals", supportingSignals);
  console.log("actions", actions);

  return {
    stats,
    patterns: exposedPatterns,
    filteredPatterns,
    primaryDecision,
    supportingSignals,
    narratives,
    actions,
  };
};
