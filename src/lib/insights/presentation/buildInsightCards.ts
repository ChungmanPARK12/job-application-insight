import type { InsightNarrative } from "../types/narration.types";
import type {
  BuildInsightCardsParams,
  InsightCard,
  InsightCardNarrative,
} from "../types/insightCard.types";

const buildNarrativeSections = (
  narrative?: InsightNarrative,
): InsightCardNarrative => {
  if (!narrative) {
    return {
      fact: "",
      boundary: "",
      reflection: "",
    };
  }

  return {
    fact: narrative.fact ?? "",
    boundary: narrative.boundary ?? "",
    reflection: narrative.reflection ?? "",
  };
};

export const buildInsightCards = ({
  patterns,
  narratives,
  actions,
}: BuildInsightCardsParams): InsightCard[] => {
  return patterns.map((pattern, index) => {
    const narrative = buildNarrativeSections(narratives[index]);

    const relatedActions = actions.map((action) => ({
      title: action.title,
      priority: action.priority,
      description: action.description,
    }));

    return {
      meta: {
        patternType: pattern.type,
        strength: pattern.strength,
      },
      narrative,
      actions: relatedActions,
      score: {
        finalScore: pattern.score?.finalScore ?? 0,
        confidence: pattern.score?.confidence ?? 0,
      },
    };
  });
};
