// types/decisionPanel.types.ts

import type { Decision } from "@/lib/insights/types/decision.types";
import type { Pattern } from "@/lib/insights/types/pattern.types";

export type DecisionPanelData = {
  primaryDecision: {
    message: string;
  };

  why: {
    summary: string; // 한 줄 요약
    supportingSignals: Pattern[];
  };

  action: {
    steps: {
      step: number;
      title: string;
      description: string;
    }[];
  };

  outcome: {
    summary: string; // “Interview rate likely increases”
    improvement?: string; // “+3% ~ +5%”
    direction?: "increase" | "decrease" | "stable";
  };

  confidence: {
    label: "High" | "Medium" | "Low";
    reasoning?: string;
  };
};
