// src/app/debug/corePatternDebug.ts
import type { StatsResult } from "@/lib/stats";
import { buildInsightEngineResult } from "@/lib/insights/buildInsightEngineResult";
import { buildTrendAnalysis } from "@/lib/insights/trends/buildTrendAnalysis";
import { buildInsightCards } from "@/lib/insights/buildInsightCards";

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

const previousMockStats: StatsResult = {
  overall: {
    total: 50,
    interview_rate: 0.08,
  } as any,
  breakdowns: [] as any,
} as any;

const trend = buildTrendAnalysis({
  current: mockStats,
  previous: previousMockStats,
});

export const runCorePatternDebug = (): void => {
  console.log("TREND DEBUG:", {
    total: {
      delta: trend.overall.total.delta,
      direction: trend.overall.total.direction,
    },
    interview_rate: {
      delta: trend.overall.interview_rate.delta,
      direction: trend.overall.interview_rate.direction,
    },
  });

  console.log("SERVER DEBUG");

  const result = buildInsightEngineResult(mockStats);

  console.log(
    "FILTERED PATTERNS:",
    result.filteredPatterns.map((p) => ({
      type: p.type,
      finalScore: p.score?.finalScore,
      confidence: p.score?.confidence,
      rank: p.rank,
      decision: p.exposureDecision,
      shouldExpose: p.shouldExpose,
    }))
  );

  console.log(
    "EXPOSED PATTERNS:",
    result.patterns.map((p) => ({
      type: p.type,
      finalScore: p.score?.finalScore,
      confidence: p.score?.confidence,
      rank: p.rank,
    }))
  );

    console.log(
    "DECISIONS:",
    result.decisions.map((d) => ({
      patternType: d.patternType,
      decision: d.decision,
      score: d.score,
      confidence: d.confidence,
    }))
  );

  console.log("NARRATIVES:", result.narratives);

  console.log(
    "ACTIONS:",
    result.actions.map((a) => ({
      title: a.title,
      priority: a.priority,
    }))
  );

  const cards = buildInsightCards({
    patterns: result.patterns,
    narratives: result.narratives,
    actions: result.actions,
  });

  console.log(
  "INSIGHT CARDS:",
  cards.map((card) => ({
    patternType: card.meta.patternType,
    strength: card.meta.strength,
    fact: card.narrative.fact,
    boundary: card.narrative.boundary,
    reflection: card.narrative.reflection,
    actions: card.actions.map((a) => ({
      title: a.title,
      priority: a.priority,
    })),
    score: card.score,
    trend: card.trend ?? null,
  }))
);

  console.log("=== Insight Engine Debug Summary ===");
  console.log("patterns:", result.patterns.length);
  console.log("decisions:", result.decisions.length);
  console.log("narratives:", result.narratives.length);
  console.log("actions:", result.actions.length);
  console.log("cards:", cards.length);
};