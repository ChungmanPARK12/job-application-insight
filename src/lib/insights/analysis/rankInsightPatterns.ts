// src/lib/insights/rankPatterns.ts
import type { Pattern } from "../types/pattern.types";

export type RankedPattern = Pattern & {
  rank: number;
};

const strengthPriority: Record<string, number> = {
  strong: 2,
  weak: 1,
};

const patternPriority: Record<string, number> = {
  conversion_imbalance: 3,
  distribution_concentration: 2,
  target_narrowness: 1,
};

export const rankPatterns = (patterns: Pattern[]): RankedPattern[] => {
  const sorted = [...patterns].sort((a, b) => {
    const aFinalScore = a.score?.finalScore ?? 0;
    const bFinalScore = b.score?.finalScore ?? 0;

    if (bFinalScore !== aFinalScore) {
      return bFinalScore - aFinalScore;
    }

    const strengthDiff =
      (strengthPriority[b.strength] ?? 0) - (strengthPriority[a.strength] ?? 0);

    if (strengthDiff !== 0) {
      return strengthDiff;
    }

    const patternDiff =
      (patternPriority[b.type] ?? 0) - (patternPriority[a.type] ?? 0);

    if (patternDiff !== 0) {
      return patternDiff;
    }

    return a.type.localeCompare(b.type);
  });

  return sorted.map((pattern, index) => ({
    ...pattern,
    rank: index + 1,
  }));
};
