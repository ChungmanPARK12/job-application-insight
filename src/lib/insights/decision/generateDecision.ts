import { getConfidenceLabel } from "./getConfidenceLabel";
import type { Pattern } from "../types/pattern.types";
import type { Decision } from "../types/decision.types";

const getConfidenceSuffix = (confidence: number): string => {
  if (confidence >= 0.75) {
    return "This is a consistent signal.";
  }

  if (confidence >= 0.5) {
    return "This appears meaningful, though more validation may help.";
  }

  return "This may be an early signal, and more data is needed.";
};

const getDecisionReasoning = (pattern: Pattern): string => {
  const confidenceSuffix = getConfidenceSuffix(pattern.confidence);

  switch (pattern.type) {
    case "conversion_imbalance":
      return `Some areas are converting less effectively than others, which is lowering overall performance. ${confidenceSuffix}`;

    case "distribution_concentration":
      return `Results are too dependent on a small number of dominant sources, which increases risk and limits flexibility. ${confidenceSuffix}`;

    case "target_narrowness":
      return `Current targeting is concentrated in a narrow range of opportunities, which may be limiting overall reach. ${confidenceSuffix}`;

    default:
      return `This pattern may affect overall decision quality. ${confidenceSuffix}`;
  }
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
        decision: "Focus on improving conversion in underperforming areas",
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
