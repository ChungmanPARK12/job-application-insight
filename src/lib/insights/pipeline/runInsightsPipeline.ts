// src/lib/insights/runInsightPipeline.ts
import { runCsvPipeline, type ParsedCSV } from "@/lib/csv/pipeline";
import { buildStatsResult } from "@/lib/stats/buildStatsResult";
import {
  buildInsightEngineResult,
  type InsightEngineResult,
} from "./buildInsightEngineResult";
import type { ApplicationRecord } from "@/types/ApplicationRecord";
import { buildInteractionInsights } from "../presentation/buildInteractionInsight";

export type InsightPipelineSuccess = {
  ok: true;
  records: ApplicationRecord[];
  stats: InsightEngineResult["stats"];
  patterns: InsightEngineResult["patterns"];
  filteredPatterns: InsightEngineResult["filteredPatterns"];
  narratives: InsightEngineResult["narratives"];
  actions: InsightEngineResult["actions"];
  primaryDecision: InsightEngineResult["primaryDecision"];
  supportingSignals: InsightEngineResult["supportingSignals"];
  interactions: ReturnType<typeof buildInteractionInsights>;
  csvMeta: {
    totalRows: number;
    mappedFields: Record<string, number | null>;
  };
};

export type InsightPipelineError = {
  ok: false;
  code: "CSV_PIPELINE_FAILED";
  message: string;
  details: unknown;
};

export type InsightPipelineResult =
  | InsightPipelineSuccess
  | InsightPipelineError;

export const runInsightPipeline = (
  parsed: ParsedCSV,
): InsightPipelineResult => {
  const csvResult = runCsvPipeline(parsed);

  if (!csvResult.ok) {
    return {
      ok: false,
      code: "CSV_PIPELINE_FAILED",
      message: csvResult.message,
      details: csvResult,
    };
  }

  const stats = buildStatsResult(csvResult.records);
  const insightResult = buildInsightEngineResult(stats);
  const interactions = buildInteractionInsights(insightResult.patterns);

  return {
    ok: true,
    records: csvResult.records,
    stats: insightResult.stats,
    patterns: insightResult.patterns,
    filteredPatterns: insightResult.filteredPatterns,
    narratives: insightResult.narratives,
    actions: insightResult.actions,
    primaryDecision: insightResult.primaryDecision,
    supportingSignals: insightResult.supportingSignals,
    interactions,
    csvMeta: csvResult.meta,
  };
};
