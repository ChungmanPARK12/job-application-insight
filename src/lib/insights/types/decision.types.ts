// src/lib/insights/types/decision.type

export interface Decision {
  patternType: string;
  decision: string;
  reasoning?: string;
  score: number;
  confidence: number;
}