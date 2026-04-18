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
        return "Strong potential to improve overall conversion.";
      }
      if (magnitude === "medium") {
        return "Moderate potential to improve overall conversion.";
      }
      return "Limited but meaningful potential to improve overall conversion.";

    case "distribution_concentration":
      if (magnitude === "high") {
        return "Strong potential to improve results by reducing dependence on a small number of sources.";
      }
      if (magnitude === "medium") {
        return "Moderate potential to improve results through a more balanced application mix.";
      }
      return "Limited but useful potential to improve results through better distribution balance.";

    case "target_narrowness":
      if (magnitude === "high") {
        return "Strong potential to improve results by expanding into a wider target range.";
      }
      if (magnitude === "medium") {
        return "Moderate potential to improve results by widening target coverage.";
      }
      return "Limited but meaningful potential to improve results through broader targeting.";

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
        return "Improving weaker areas is likely to create a strong lift in overall conversion.";
      }
      if (magnitude === "medium") {
        return "Improving weaker areas should lead to higher overall conversion.";
      }
      return "Improving weaker areas may lead to a modest gain in overall conversion.";

    case "distribution_concentration":
      if (magnitude === "high") {
        return "Reducing over-reliance on a few sources is likely to improve overall results.";
      }
      if (magnitude === "medium") {
        return "A more balanced distribution should improve overall results.";
      }
      return "Better distribution balance may lead to more stable results.";

    case "target_narrowness":
      if (magnitude === "high") {
        return "Expanding your target range is likely to improve access to stronger opportunities.";
      }
      if (magnitude === "medium") {
        return "A broader target range should improve opportunity coverage.";
      }
      return "Slightly broader targeting may improve reach and response potential.";

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
      ? "This expectation is supported by relatively strong confidence."
      : confidenceLabel === "Medium"
        ? "This expectation is supported by moderate confidence."
        : "This expectation should be treated cautiously because confidence is still limited.";

  switch (patternType) {
    case "conversion_imbalance":
      return `${confidencePhrase} Current results suggest that improving weaker areas can lift overall conversion.`;

    case "distribution_concentration":
      return `${confidencePhrase} Current results suggest that reducing dependence on a narrow set of sources can improve balance and overall performance.`;

    case "target_narrowness":
      return `${confidencePhrase} Current results suggest that a wider target range can improve coverage and create more opportunities.`;

    default:
      return `${confidencePhrase} The detected pattern supports a directional adjustment with possible upside.`;
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
