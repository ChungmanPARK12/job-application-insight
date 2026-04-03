// src/lib/insights/narrateInsights.ts

import type { PatternFinding } from "./detectInsightPatterns";

export type InsightStage =
  | "statistics"
  | "pattern"
  | "insight"
  | "diagnosis"
  | "recommendation";

export type InsightConfidence = "low" | "medium" | "high";
export type InsightStrength = "weak" | "moderate" | "strong";

export type InsightSentence = {
  dimension: string;
  key: string;
  text: string;

  // Day 14 metadata
  pattern_type: string;
  strength: InsightStrength;
  confidence: InsightConfidence;
  stage: InsightStage;
};

const toPercent = (n: number) => `${(n * 100).toFixed(1)}%`;

// strength → confidence rule
const getConfidence = (strength: InsightStrength): InsightConfidence => {
  if (strength === "strong") return "high";
  if (strength === "moderate") return "medium";
  return "low";
};

export const narrateInsights = (
  findings: PatternFinding[]
): InsightSentence[] => {
  return findings.map((f) => {
    const directionText =
      f.direction === "higher"
        ? "appears to have a higher interview rate"
        : "appears to have a lower interview rate";

    const cautiousPrefix = "In this dataset,";

    const sampleNote =
      f.group_total < 10
        ? " However, given the limited sample size, this observation should be interpreted cautiously."
        : "";

    const text = `${cautiousPrefix} applications in the "${f.key}" group (${f.dimension}) ${directionText} compared to the overall average (${toPercent(
      f.group_rate
    )} vs ${toPercent(f.overall_rate)}).${sampleNote}`;

    const strength: InsightStrength =
      f.group_total >= 20 ? "strong" : f.group_total >= 10 ? "moderate" : "weak";

    return {
      dimension: f.dimension,
      key: f.key,
      text,

      // Day 14 metadata
      pattern_type: f.dimension,
      strength,
      confidence: getConfidence(strength),
      stage: "insight",
    };
  });
};