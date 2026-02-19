// src/lib/insights/narrateInsights.ts

import type { PatternFinding } from "./detectPatterns";

export type InsightSentence = {
  dimension: string;
  key: string;
  text: string;
};

const toPercent = (n: number) => `${(n * 100).toFixed(1)}%`;

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

    return {
      dimension: f.dimension,
      key: f.key,
      text,
    };
  });
};
