// insights/decision/generateDecision.ts
import type { Pattern } from "../types/pattern.types";
import type { Decision } from "../types/decision.types";

export const generateDecision = (pattern: Pattern): Decision => {
  switch (pattern.type) {
    case "conversion_imbalance":
      return {
        patternType: pattern.type,
        decision: "Focus on improving conversion in underperforming segments",
        score: pattern.score?.finalScore ?? 0,
        confidence: pattern.confidence,
      };

    case "distribution_concentration":
      return {
        patternType: pattern.type,
        decision: "Reduce over-reliance on dominant sources and diversify channels",
        score: pattern.score?.finalScore ?? 0,
        confidence: pattern.confidence,
      };

    case "target_narrowness":
      return {
        patternType: pattern.type,
        decision: "Expand targeting to broader segments to increase opportunities",
        score: pattern.score?.finalScore ?? 0,
        confidence: pattern.confidence,
      };

    default:
      return {
        patternType: pattern.type,
        decision: "Monitor this pattern for further signals",
        score: pattern.score?.finalScore ?? 0,
        confidence: pattern.confidence,
      };
  }
};