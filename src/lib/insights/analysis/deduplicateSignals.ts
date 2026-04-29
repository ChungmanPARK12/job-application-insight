type DeduplicatableSignal = {
  type: string;
  confidence: number;
  strength: string;
  score: unknown;
  metrics?: Record<string, number>;
  meta?: Record<string, string>;
};

export type DeduplicatedSignal<T extends DeduplicatableSignal> = T & {
  mergedCount: number;
};

const getScoreValue = (score: unknown): number => {
  if (typeof score === "number") {
    return score;
  }

  if (typeof score === "object" && score !== null) {
    const value = (score as { value?: unknown }).value;

    if (typeof value === "number") {
      return value;
    }
  }

  return 0;
};

const buildDeduplicationKey = <T extends DeduplicatableSignal>(
  pattern: T,
): string => {
  const dimension = pattern.meta?.dimension ?? pattern.meta?.key ?? "general";

  return `${pattern.type}:${dimension}`;
};

const getRepresentativeWeight = <T extends DeduplicatableSignal>(
  pattern: T,
): number => {
  const scoreValue = getScoreValue(pattern.score);

  return scoreValue * 0.7 + pattern.confidence * 0.3;
};

const selectRepresentativeSignal = <T extends DeduplicatableSignal>(
  signals: T[],
): T => {
  return [...signals].sort((a, b) => {
    return getRepresentativeWeight(b) - getRepresentativeWeight(a);
  })[0];
};

export const deduplicateSignals = <T extends DeduplicatableSignal>(
  patterns: T[],
): DeduplicatedSignal<T>[] => {
  const groupedSignals = new Map<string, T[]>();

  for (const pattern of patterns) {
    const groupKey = buildDeduplicationKey(pattern);
    const group = groupedSignals.get(groupKey) ?? [];

    groupedSignals.set(groupKey, [...group, pattern]);
  }

  return Array.from(groupedSignals.values()).map((signals) => {
    const representative = selectRepresentativeSignal(signals);

    return {
      ...representative,
      mergedCount: signals.length,
    };
  });
};
