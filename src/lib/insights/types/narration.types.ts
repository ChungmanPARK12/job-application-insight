// src/lib/insights/narration.types.ts
import type { Pattern } from "./pattern.types";

export type InsightStage =
  | "statistics"
  | "pattern"
  | "insight"
  | "diagnosis"
  | "recommendation";

export type InsightConfidence = "low" | "medium" | "high";

export type InsightNarrative = {
  pattern_type: Pattern["type"];
  strength: Pattern["strength"];
  confidence: InsightConfidence;
  stage: InsightStage;
  fact: string;
  boundary: string;
  reflection?: string;
};