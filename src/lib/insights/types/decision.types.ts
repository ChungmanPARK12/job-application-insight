// src/lib/insights/types/decision.types.ts
import type { Pattern } from "./pattern.types";

export type DecisionConfidenceLabel = "High" | "Medium" | "Low";

export interface DecisionConfidence {
  value: number;
  label: DecisionConfidenceLabel;
}

export type ExecutionStepType = "sequential" | "parallel";

export interface ExecutionStep {
  step: number;
  title: string;
  description: string;
  type?: ExecutionStepType;
}

export interface ExecutionPlan {
  goal: string;
  steps: ExecutionStep[];
}

export interface Decision {
  patternType: string;
  decision: string;
  reasoning?: string;
  score: number;
  confidence: DecisionConfidence;
  executionPlan?: ExecutionPlan;
}

export interface PrimaryDecisionResult {
  primaryDecision: Decision | null;
  supportingSignals: Pattern[];
}
