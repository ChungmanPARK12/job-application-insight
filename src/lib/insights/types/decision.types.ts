// src/lib/insights/types/decision.types.ts

import type { Pattern } from "./pattern.types";

export interface Decision {
  patternType: string;
  decision: string;
  reasoning?: string;
  score: number;
  confidence: number;
}

export interface PrimaryDecisionResult {
  primaryDecision: Decision | null;
  supportingSignals: Pattern[];
}