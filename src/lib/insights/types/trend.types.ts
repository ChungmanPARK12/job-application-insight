// src/lib/insights/types/trend.types.ts
import type { StatsResult } from "@/lib/stats";

export type TrendDirection = "up" | "down" | "flat";

export interface TrendMetric {
  current: number;
  previous: number;
  delta: number;
  direction: TrendDirection;
}

export interface TrendAnalysisResult {
  overall: {
    total: TrendMetric;
    interview_rate: TrendMetric;
  };
}

export interface BuildTrendAnalysisParams {
  current: StatsResult;
  previous: StatsResult;
}