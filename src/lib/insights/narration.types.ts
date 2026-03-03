// src/lib/insights/narration.types.ts

import type { Pattern } from "./pattern.types";

export type InsightNarrative = {
  pattern_type: Pattern["type"];
  strength: Pattern["strength"];
  fact: string;
  boundary: string;

  reflection?: string;
};