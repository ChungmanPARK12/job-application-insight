// insights/decision/generateDecision.ts
import { getConfidenceLabel } from "./getConfidenceLabel";
import type { Pattern } from "../types/pattern.types";
import type { Decision } from "../types/decision.types";

const getDecisionReasoning = (pattern: Pattern): string => {
  if (pattern.confidence >= 0.75) {
    return "Strong signal with consistent pattern";
  }

  if (pattern.confidence >= 0.5) {
    return "Moderate signal, but more validation may be helpful";
  }

  return "Weak signal and may require more data";
};

export const generateDecision = (pattern: Pattern): Decision => {
  const confidence = {
    value: pattern.confidence,
    label: getConfidenceLabel(pattern.confidence),
  };

  const reasoning = getDecisionReasoning(pattern);

  switch (pattern.type) {
    case "conversion_imbalance":
      return {
        patternType: pattern.type,
        decision: "Focus on improving conversion in underperforming segments",
        reasoning,
        score: pattern.score?.finalScore ?? 0,
        confidence,
      };

    case "distribution_concentration":
      return {
        patternType: pattern.type,
        decision:
          "Reduce over-reliance on dominant sources and diversify channels",
        reasoning,
        score: pattern.score?.finalScore ?? 0,
        confidence,
      };

    case "target_narrowness":
      return {
        patternType: pattern.type,
        decision:
          "Expand targeting to broader segments to increase opportunities",
        reasoning,
        score: pattern.score?.finalScore ?? 0,
        confidence,
      };

    default:
      return {
        patternType: pattern.type,
        decision: "Monitor this pattern for further signals",
        reasoning,
        score: pattern.score?.finalScore ?? 0,
        confidence,
      };
  }
};
