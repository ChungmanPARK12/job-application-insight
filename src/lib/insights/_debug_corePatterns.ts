// src/lib/insights/__debug_corePatterns.ts
import type { StatsResult } from "@/lib/stats";
import { buildInsightEngineResult } from "./buildInsightEngineResult";

const mockStats: StatsResult = {
  overall: {
    total: 60,
    interview_rate: 0.03,
  } as any,
  breakdowns: [
    {
      dimension: "job_source",
      rows: [
        {
          key: "LinkedIn",
          total: 48,
          by_status: {} as any,
          interview_rate: 0.02,
        },
        {
          key: "Seek",
          total: 12,
          by_status: {} as any,
          interview_rate: 0.1,
        },
      ],
    },
    {
      dimension: "location",
      rows: [
        {
          key: "Adelaide",
          total: 50,
          by_status: {} as any,
          interview_rate: 0.03,
        },
        {
          key: "Remote",
          total: 10,
          by_status: {} as any,
          interview_rate: 0.03,
        },
      ],
    },
    {
      dimension: "position_keyword",
      rows: [
        {
          key: "frontend",
          total: 52,
          by_status: {} as any,
          interview_rate: 0.03,
        },
        {
          key: "(other)",
          total: 8,
          by_status: {} as any,
          interview_rate: 0.03,
        },
      ],
    },
  ],
} as any;

export const runCorePatternDebug = (): void => {
  const result = buildInsightEngineResult(mockStats);

  console.log("=== Day 16 Score Debug ===");
  console.log("patterns:", result.patterns.length);

  for (const pattern of result.patterns) {
    console.log({
      type: pattern.type,
      strength: pattern.strength,
      confidence: pattern.confidence,
      score: pattern.score ?? null,
      metrics: pattern.metrics,
      meta: pattern.meta ?? null,
    });
  }

  console.log("narratives:", result.narratives.length);
  console.log(result.narratives);
};