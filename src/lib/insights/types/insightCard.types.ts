import type { PatternStrength, PatternType } from "./pattern.types";
import type { InsightAction } from "./action.types";
import type { TrendDirection } from "./trend.types";
import type { InsightNarrative } from "./narration.types";

export interface InsightCardNarrative {
  fact: string;
  boundary: string;
  reflection: string;
}

export interface InsightCardTrend {
  direction: TrendDirection;
  delta: number;
}

export interface InsightCardScore {
  finalScore: number;
  confidence: number;
}

export interface InsightCardAction {
  title: string;
  priority: InsightAction["priority"];
  description?: string;
}

export interface InsightCardMeta {
  patternType: PatternType;
  strength: PatternStrength;
}

export interface InsightCard {
  meta: InsightCardMeta;
  narrative: InsightCardNarrative;
  trend?: InsightCardTrend;
  actions: InsightCardAction[];
  score: InsightCardScore;
}

export interface BuildInsightCardPatternInput {
  type: PatternType;
  strength: PatternStrength;
  score?: {
    finalScore: number;
    confidence: number;
  };
}

export interface BuildInsightCardsParams {
  patterns: BuildInsightCardPatternInput[];
  narratives: InsightNarrative[];
  actions: InsightAction[];
}