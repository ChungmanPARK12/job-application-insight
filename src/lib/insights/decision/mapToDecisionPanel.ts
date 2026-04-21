import type { InsightEngineResult } from "../pipeline/buildInsightEngineResult";
import type { DecisionPanelData } from "../types/decisionPanel.types";
import type { ExecutionStep } from "../types/decision.types";

const compressSummary = (
  text: string,
  maxSentences = 2,
  maxLength = 180,
): string => {
  const normalized = text.replace(/\s+/g, " ").trim();

  if (!normalized) {
    return "Key signals support this recommendation.";
  }

  const sentences = normalized
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  const limitedSentences = sentences.slice(0, maxSentences).join(" ");

  if (limitedSentences.length <= maxLength) {
    return limitedSentences;
  }

  return `${limitedSentences.slice(0, maxLength).trimEnd()}...`;
};

export const mapToDecisionPanel = (
  result: InsightEngineResult,
): DecisionPanelData | null => {
  const decision = result.primaryDecision;

  if (!decision) {
    return null;
  }

  return {
    primaryDecision: {
      message: decision.decision,
    },

    why: {
      summary: compressSummary(
        decision.reasoning || "Key signals support this recommendation.",
      ),
      supportingSignals: result.supportingSignals || [],
    },

    action: {
      steps:
        decision.executionPlan?.steps.map(
          (step: ExecutionStep, index: number) => ({
            step: step.step ?? index + 1,
            title: step.title,
            description: step.description,
          }),
        ) || [],
    },

    outcome: {
      summary: compressSummary(
        decision.outcomeProjection?.summary ||
          "A measurable improvement is expected if this plan is followed.",
      ),
      improvement: decision.outcomeProjection?.expectedImprovement,
      direction: decision.outcomeProjection?.direction,
    },

    confidence: {
      label: decision.confidence.label,
    },
  };
};
