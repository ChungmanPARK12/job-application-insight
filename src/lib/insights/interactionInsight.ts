import type { Pattern } from "./pattern.types";

export type InteractionInsight = {
  title: string;
  text: string;
};

export const buildInteractionInsights = (
  patterns: Pattern[]
): InteractionInsight[] => {
  const insights: InteractionInsight[] = [];

  const hasConversion = patterns.find(
    (p) => p.type === "conversion_imbalance"
  );

  const hasDistribution = patterns.find(
    (p) => p.type === "distribution_concentration"
  );

  const hasTarget = patterns.find(
    (p) => p.type === "target_narrowness"
  );

  /**
   * Conversion + Distribution
   */
  if (hasConversion && hasDistribution) {
    insights.push({
      title: "Channel concentration with low conversion",
      text:
        "Applications appear concentrated in a limited number of channels while overall interview conversion remains low. This may suggest testing additional job sources to evaluate whether outcomes vary by channel.",
    });
  }

  /**
   * Conversion + Target Narrowness
   */
  if (hasConversion && hasTarget) {
    insights.push({
      title: "Narrow targeting with low conversion",
      text:
        "Applications appear concentrated on a narrow role keyword while overall interview conversion remains low. Expanding the target role scope may help evaluate whether the current positioning is too restrictive.",
    });
  }

  return insights;
};