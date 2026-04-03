import type { RankedPattern } from "./rankInsightPatterns";
import type { FilteredPattern, ExposureDecision } from "./types/exposure.types";

const MIN_SAMPLE_SIZE = 5;
const MIN_CONFIDENCE = 0.5;
const MIN_WEAK_PATTERN_SCORE = 0.6;
const MAX_EXPOSED_INSIGHTS = 2;

const getMetric = (
  metrics: Record<string, unknown>,
  key: string,
  fallback = 0
): number => {
  const value = metrics[key];
  return typeof value === "number" ? value : fallback;
};

const decideExposure = (item: RankedPattern): ExposureDecision => {
  const sampleSize = getMetric(item.metrics, "applications", 0);

  if (sampleSize < MIN_SAMPLE_SIZE) {
    return "hide_low_sample";
  }

  if ((item.score?.confidence ?? 0) < MIN_CONFIDENCE) {
    return "hide_low_confidence";
  }

  if (
    item.strength === "weak" &&
    (item.score?.finalScore ?? 0) < MIN_WEAK_PATTERN_SCORE
  ) {
    return "hide_weak_pattern";
  }

  return "show";
};

export const filterPatternsForExposure = (
  rankedPatterns: RankedPattern[]
): FilteredPattern[] => {
  const base: FilteredPattern[] = rankedPatterns.map((item) => {
    const exposureDecision = decideExposure(item);

    return {
      ...item,
      exposureDecision,
      shouldExpose: exposureDecision === "show",
    };
  });

  let shown = 0;

  return base.map((item) => {
    if (!item.shouldExpose) {
      return item;
    }

    if (shown < MAX_EXPOSED_INSIGHTS) {
      shown += 1;
      return item;
    }

    return {
      ...item,
      exposureDecision: "hide_below_exposure_cap",
      shouldExpose: false,
    };
  });
};