// src/lib/insights/formatters/decisionFormatter.ts
import type { PatternType } from "../types/pattern.types";
import type { OutcomeDirection } from "../types/decision.types";

export const formatPatternType = (type: PatternType): string => {
  switch (type) {
    case "distribution_concentration":
      return "Your results are concentrated in a limited set of opportunities.";
    case "conversion_imbalance":
      return "Some application segments are performing significantly worse than others.";
    case "target_narrowness":
      return "Your application targeting may be too narrow.";
    default:
      return type;
  }
};

export const formatOutcomeDirection = (
  direction?: OutcomeDirection,
): string | null => {
  switch (direction) {
    case "increase":
      return "Improvement is likely if this approach is followed.";
    case "decrease":
      return "Performance may decline under the current pattern.";
    case "stable":
      return "Results are likely to remain stable.";
    default:
      return null;
  }
};

export const formatConfidenceLabel = (
  label: "High" | "Medium" | "Low",
): string => {
  switch (label) {
    case "High":
      return "High confidence based on consistent patterns.";
    case "Medium":
      return "Moderate confidence — more data could strengthen this recommendation.";
    case "Low":
      return "Low confidence due to limited or inconsistent signals.";
    default:
      return label;
  }
};
