// src/lib/insights/scoring/calculateInsightScore.ts
import { Pattern, InsightScore } from '../types/pattern.types';

const clamp = (v: number): number => {
  if (Number.isNaN(v)) return 0;
  if (v < 0) return 0;
  if (v > 1) return 1;
  return Number(v.toFixed(2));
};

const getMetric = (metrics: Record<string, unknown>, key: string, fallback = 0): number => {
  const val = metrics[key];
  return typeof val === 'number' ? val : fallback;
};

const calculateImpact = (pattern: Pattern): number => {
  const { type, metrics } = pattern;

  switch (type) {
    case 'conversion_imbalance': {
      const rate = getMetric(metrics, 'interviewRate', 0);

      if (rate >= 0.2) return 0.2;
      if (rate >= 0.1) return 0.5;
      if (rate >= 0.05) return 0.7;
      return 1;
    }

    case 'distribution_concentration': {
      const ratio = getMetric(metrics, 'topCategoryRatio', 0);

      if (ratio < 0.4) return 0.3;
      if (ratio < 0.6) return 0.6;
      return 1;
    }

    default:
      return 0.5;
  }
};

const calculateUrgency = (pattern: Pattern): number => {
  const delta = getMetric(pattern.metrics, 'delta', 0);

  if (delta >= 0) return 0.2;
  if (delta > -0.05) return 0.5;
  if (delta > -0.1) return 0.7;
  return 1;
};

const calculateConsistency = (pattern: Pattern): number => {
  const repeat = getMetric(pattern.metrics, 'repeatCount', 1);

  if (repeat <= 1) return 0.3;
  if (repeat <= 3) return 0.6;
  return 1;
};

export const calculateInsightScore = (pattern: Pattern): InsightScore => {
  const impact = clamp(calculateImpact(pattern));
  const urgency = clamp(calculateUrgency(pattern));
  const consistency = clamp(calculateConsistency(pattern));
  const confidence = clamp(pattern.confidence);

  const finalScore = clamp(
    impact * 0.4 +
    urgency * 0.3 +
    confidence * 0.3
  );

  return {
    impact,
    urgency,
    consistency,
    confidence,
    finalScore,
  };
};