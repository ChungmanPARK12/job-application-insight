// src/lib/insights/types/decision.types.ts
import type { Pattern } from "./pattern.types";

export type DecisionConfidenceLabel = "High" | "Medium" | "Low";

export interface DecisionConfidence {
  value: number;
  label: DecisionConfidenceLabel;
}

export interface Decision {
  patternType: string;
  decision: string;
  reasoning?: string;
  score: number;
  confidence: DecisionConfidence;
}

export interface PrimaryDecisionResult {
  primaryDecision: Decision | null;
  supportingSignals: Pattern[];
}
