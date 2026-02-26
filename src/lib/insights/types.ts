// src/lib/insights/types.ts

export type PatternType =
  | "conversion_imbalance"
  | "distribution_concentration"
  | "target_narrowness";

export type PatternStrength = "weak" | "strong";

export interface Pattern {
  type: PatternType;
  strength: PatternStrength;

  // pattern-specific numeric metrics
  metrics: Record<string, number>;

  // 0..1 heuristic confidence (v2.0)
  confidence: number;

  // optional string meta for narration
  meta?: Record<string, string>;
}