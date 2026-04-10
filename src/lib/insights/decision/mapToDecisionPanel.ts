import type { InsightEngineResult } from "../buildInsightEngineResult";
import type { DecisionPanelData } from "../types/decisionPanel.types";
import type { ExecutionStep } from "../types/decision.types";

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
      summary: decision.reasoning || "Key signals support this recommendation.",
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
      summary:
        decision.outcomeProjection?.summary ||
        "A measurable improvement is expected if this plan is followed.",
      improvement: decision.outcomeProjection?.expectedImprovement,
      direction: decision.outcomeProjection?.direction,
    },

    confidence: {
      label: decision.confidence.label,
    },
  };
};
