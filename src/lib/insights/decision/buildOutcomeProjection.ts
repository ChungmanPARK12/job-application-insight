// src/lib/insights/decision/buildOutcomeProjection.ts
import type {
  DecisionConfidenceLabel,
  OutcomeDirection,
  OutcomeMagnitude,
  OutcomeProjection,
} from "../types/decision.types";
import type { Pattern } from "../types/pattern.types";

const getOutcomeDirection = (patternType: string): OutcomeDirection => {
  switch (patternType) {
    case "conversion_imbalance":
    case "distribution_concentration":
    case "target_narrowness":
      return "increase";
    default:
      return "stable";
  }
};

const getOutcomeMagnitude = (
  strength: Pattern["strength"],
  confidenceLabel: DecisionConfidenceLabel,
): OutcomeMagnitude => {
  if (confidenceLabel === "Low") {
    return "low";
  }

  if (strength === "strong" && confidenceLabel === "High") {
    return "high";
  }

  return "medium";
};

const getExpectedImprovement = (
  patternType: string,
  direction: OutcomeDirection,
  magnitude: OutcomeMagnitude,
): string | undefined => {
  if (direction !== "increase") {
    return undefined;
  }

  switch (patternType) {
    case "conversion_imbalance":
      if (magnitude === "high") {
        return "Potential for a strong improvement in interview conversion.";
      }
      if (magnitude === "medium") {
        return "Potential for a moderate improvement in interview conversion.";
      }
      return "Potential for a limited but meaningful improvement in interview conversion.";

    case "distribution_concentration":
      if (magnitude === "high") {
        return "Potential for a strong improvement by reducing source concentration risk.";
      }
      if (magnitude === "medium") {
        return "Potential for a moderate improvement by broadening opportunity distribution.";
      }
      return "Potential for a limited but useful improvement through better distribution balance.";

    case "target_narrowness":
      if (magnitude === "high") {
        return "Potential for a strong improvement by expanding beyond a narrow target range.";
      }
      if (magnitude === "medium") {
        return "Potential for a moderate improvement by widening target coverage.";
      }
      return "Potential for a limited but meaningful improvement from broader targeting.";

    default:
      return undefined;
  }
};

const getOutcomeSummary = (
  patternType: string,
  direction: OutcomeDirection,
  magnitude: OutcomeMagnitude,
): string => {
  if (direction === "stable") {
    return "This decision is expected to stabilize performance rather than create a major shift.";
  }

  switch (patternType) {
    case "conversion_imbalance":
      if (magnitude === "high") {
        return "This decision is likely to produce a strong upward shift in interview conversion.";
      }
      if (magnitude === "medium") {
        return "This decision is likely to improve interview conversion in a measurable way.";
      }
      return "This decision may create a modest improvement in interview conversion.";

    case "distribution_concentration":
      if (magnitude === "high") {
        return "This decision is likely to improve outcomes by reducing over-concentration risk.";
      }
      if (magnitude === "medium") {
        return "This decision is expected to improve outcomes by spreading effort more effectively.";
      }
      return "This decision may improve outcome stability through better distribution balance.";

    case "target_narrowness":
      if (magnitude === "high") {
        return "This decision is likely to improve outcomes by expanding into stronger adjacent targets.";
      }
      if (magnitude === "medium") {
        return "This decision is expected to improve outcomes by widening the current target range.";
      }
      return "This decision may improve results by slightly broadening target coverage.";

    default:
      return "This decision is expected to create a positive directional outcome.";
  }
};

const getOutcomeReasoning = (
  patternType: string,
  confidenceLabel: DecisionConfidenceLabel,
): string => {
  const confidencePhrase =
    confidenceLabel === "High"
      ? "The signal is supported by relatively strong confidence."
      : confidenceLabel === "Medium"
        ? "The signal has moderate confidence and supports directional action."
        : "The signal is weaker, so the expected outcome should be treated cautiously.";

  switch (patternType) {
    case "conversion_imbalance":
      return `${confidencePhrase} Current performance suggests that improving the weakest conversion area can raise overall interview efficiency.`;

    case "distribution_concentration":
      return `${confidencePhrase} The current pattern shows over-reliance on a narrow distribution, so rebalancing effort should improve resilience and opportunity flow.`;

    case "target_narrowness":
      return `${confidencePhrase} The current pattern suggests that opportunity coverage is too narrow, so expanding target breadth should improve reach and result quality.`;

    default:
      return `${confidencePhrase} The detected pattern supports a directional adjustment with a reasonable expected benefit.`;
  }
};

interface BuildOutcomeProjectionParams {
  pattern: Pattern;
  confidenceLabel: DecisionConfidenceLabel;
}

export const buildOutcomeProjection = ({
  pattern,
  confidenceLabel,
}: BuildOutcomeProjectionParams): OutcomeProjection => {
  const direction = getOutcomeDirection(pattern.type);
  const magnitude = getOutcomeMagnitude(pattern.strength, confidenceLabel);
  const expectedImprovement = getExpectedImprovement(
    pattern.type,
    direction,
    magnitude,
  );
  const summary = getOutcomeSummary(pattern.type, direction, magnitude);
  const reasoning = getOutcomeReasoning(pattern.type, confidenceLabel);

  return {
    direction,
    magnitude,
    expectedImprovement,
    summary,
    reasoning,
  };
};
