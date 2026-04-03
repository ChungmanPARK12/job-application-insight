// src/lib/insights/trends/calculateTrendMetric.ts
import type { TrendMetric, TrendDirection } from "../types/trend.types";

const THRESHOLD = 0.01;

const getTrendDirection = (delta: number): TrendDirection => {
  if (delta > THRESHOLD) return "up";
  if (delta < -THRESHOLD) return "down";
  return "flat";
};

export const calculateTrendMetric = (
  current: number,
  previous: number
): TrendMetric => {
  const delta = current - previous;

  return {
    current,
    previous,
    delta,
    direction: getTrendDirection(delta),
  };
};