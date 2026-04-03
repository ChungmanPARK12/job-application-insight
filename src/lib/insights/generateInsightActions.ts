import type { RankedPattern } from "./rankInsightPatterns";
import type { InsightAction, ActionPriority } from "./types/action.types";

const getMetric = (
  metrics: Record<string, unknown>,
  key: string,
  fallback = 0
): number => {
  const value = metrics[key];
  return typeof value === "number" ? value : fallback;
};

const toPct = (n: number): string => `${(n * 100).toFixed(1)}%`;

const getPriority = (pattern: RankedPattern): ActionPriority => {
  const finalScore = pattern.score?.finalScore ?? 0;

  if (pattern.strength === "strong" && finalScore >= 0.7) {
    return "high";
  }

  if (pattern.strength === "strong") {
    return "medium";
  }

  return "low";
};

const buildConversionAction = (pattern: RankedPattern): InsightAction => {
  const applications = getMetric(pattern.metrics, "applications", 0);
  const rate =
    getMetric(pattern.metrics, "interview_rate", 0) ||
    getMetric(pattern.metrics, "response_rate", 0);

  return {
    title: "Review conversion variables",
    description:
      `Interview rate is currently ${toPct(rate)} across ${applications} applications. ` +
      `Compare recent applications by resume version, job source, location, and role level ` +
      `to identify which variable changed most often in lower-conversion outcomes.`,
    priority: getPriority(pattern),
  };
};

const buildDistributionAction = (pattern: RankedPattern): InsightAction => {
  const dominantDimension = pattern.meta?.dominant_dimension ?? "category";
  const dominantCategory = pattern.meta?.dominant_category ?? "one segment";
  const dominantRatio = getMetric(pattern.metrics, "dominant_ratio", 0);

  return {
    title: "Reduce concentration risk",
    description:
      `${dominantDimension} is currently concentrated in ${dominantCategory} (${toPct(dominantRatio)}). ` +
      `Track one adjacent segment in parallel so you can compare whether the current concentration ` +
      `is intentional, constraint-driven, or limiting coverage.`,
    priority: getPriority(pattern),
  };
};

const buildTargetNarrownessAction = (pattern: RankedPattern): InsightAction => {
  const keyword = pattern.meta?.dominant_keyword ?? "current target group";
  const ratio = getMetric(pattern.metrics, "dominant_keyword_ratio", 0);

  return {
    title: "Test one adjacent target group",
    description:
      `${keyword} currently represents ${toPct(ratio)} of the observed targeting scope. ` +
      `Add one closely related keyword group or adjacent position cluster to test whether a slightly wider target range improves coverage.`,
    priority: getPriority(pattern),
  };
};

const buildFallbackAction = (pattern: RankedPattern): InsightAction => {
  return {
    title: "Review this insight manually",
    description:
      `This pattern is currently exposed in the insight layer. ` +
      `Review the related application context and identify one small, trackable adjustment for the next cycle.`,
    priority: getPriority(pattern),
  };
};

const buildActionForPattern = (pattern: RankedPattern): InsightAction => {
  switch (pattern.type) {
    case "conversion_imbalance":
      return buildConversionAction(pattern);

    case "distribution_concentration":
      return buildDistributionAction(pattern);

    case "target_narrowness":
      return buildTargetNarrownessAction(pattern);

    default:
      return buildFallbackAction(pattern);
  }
};

export const generateInsightActions = (
  patterns: RankedPattern[]
): InsightAction[] => {
  return patterns.map(buildActionForPattern);
};