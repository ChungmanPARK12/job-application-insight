// src/lib/insights/buildInsightEngineResult.ts
import type { StatsResult } from "@/lib/stats";
import { detectCorePatterns } from "../analysis/detectCorePatterns";
import { narrateCorePatterns } from "../presentation/narrateCorePatterns";
import { calculateInsightScore } from "../scoring/calculateInsightScore";
import {
  rankPatterns,
  type RankedPattern,
} from "../analysis/rankInsightPatterns";
import { filterPatternsForExposure } from "../analysis/filterInsightPatterns";
import { generateInsightActions } from "../decision/generateInsightActions";
import { generateDecision } from "../decision/generateDecision";
import { buildExecutionPlan } from "../decision/buildExcecutionPlan";
import { buildOutcomeProjection } from "../decision/buildOutcomeProjection";
import { deduplicateSignals } from "../analysis/deduplicateSignals";
import type { FilteredPattern } from "../types/exposure.types";
import type { InsightNarrative } from "../types/narration.types";
import type { InsightAction } from "../types/action.types";
import type { Decision } from "../types/decision.types";

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

  const deduplicatedPatterns = deduplicateSignals(scoredPatterns);

  const rankedPatterns = rankPatterns(deduplicatedPatterns);

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

  console.log("=== DAY 32 RANKING DEBUG ===");

  rankedPatterns.forEach((pattern) => {
    console.log({
      rank: pattern.rank,
      type: pattern.type,
      finalScore: pattern.score?.finalScore,
      confidence: pattern.confidence,
      sampleSize:
        pattern.metrics?.sampleSize ??
        pattern.metrics?.applications ??
        pattern.metrics?.totalCount ??
        pattern.metrics?.count,
      strength: pattern.strength,
      rankScore: pattern.rankScore,
    });
  });

  console.log("=== EXPOSURE DEBUG ===");

  filteredPatterns.forEach((pattern) => {
    console.log({
      rank: pattern.rank,
      type: pattern.type,
      shouldExpose: pattern.shouldExpose,
      rankScore: pattern.rankScore,
    });
  });

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
