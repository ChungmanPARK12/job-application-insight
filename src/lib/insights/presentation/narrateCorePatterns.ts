// src/lib/insights/narrateCorePatterns.ts

import type { Pattern } from "../types/pattern.types";
import type {
  InsightNarrative,
  InsightConfidence,
  InsightStage,
} from "../types/narration.types";

type StageBand = "early" | "mid" | "late";
type ConfidenceTone = "cautious" | "measured" | "firm";

// Neutral, report-style wording only
export const narrateCorePatterns = (
  patterns: Pattern[],
): InsightNarrative[] => {
  return patterns.map(buildNarrative);
};

const buildNarrative = (p: Pattern): InsightNarrative => {
  let base: InsightNarrative;

  switch (p.type) {
    case "conversion_imbalance":
      base = narrateConversionImbalance(p);
      break;
    case "distribution_concentration":
      base = narrateDistributionConcentration(p);
      break;
    case "target_narrowness":
      base = narrateTargetNarrowness(p);
      break;
    default:
      base = fallbackNarrative(p);
  }

  // Day7 — Strength-based output control
  // Weak → Fact + Boundary (remove reflection)
  if (p.strength === "weak") {
    const { reflection, ...rest } = base;
    return rest;
  }

  return base;
};

const narrateConversionImbalance = (p: Pattern): InsightNarrative => {
  const applications = p.metrics.applications ?? 0;
  const rate = p.metrics.interview_rate ?? p.metrics.response_rate ?? 0;
  const pct = toPct(rate);

  const stageBand = getStageBand(applications);
  const confidenceTone = getConfidenceTone(p.confidence ?? 0.6);

  return {
    pattern_type: p.type,
    strength: p.strength,
    confidence: getConfidenceLabel(p.confidence ?? 0.6),
    stage: getInsightStage(),
    fact: `Total applications: ${applications}. Overall interview rate: ${pct}.`,
    boundary:
      `This meets the ${p.strength} threshold for conversion imbalance under the current rules ` +
      `(sample size and rate). This is a descriptive signal based on recorded outcomes only. ` +
      buildStageConfidenceBoundary({
        patternType: p.type,
        stageBand,
        confidenceTone,
      }),
    reflection:
      `Which variables remained consistent across applications (role level, location, source, resume version)? ` +
      `Which single variable changed most often during this period?`,
  };
};

const narrateDistributionConcentration = (p: Pattern): InsightNarrative => {
  const applications = p.metrics.applications ?? 0;
  const dominantRatio = p.metrics.dominant_ratio ?? 0;
  const pct = toPct(dominantRatio);
  const dim = p.meta?.dominant_dimension ?? "(unknown)";
  const cat = p.meta?.dominant_category ?? "(unknown)";

  const stageBand = getStageBand(applications);
  const confidenceTone = getConfidenceTone(p.confidence ?? 0.6);

  return {
    pattern_type: p.type,
    strength: p.strength,
    confidence: getConfidenceLabel(p.confidence ?? 0.6),
    stage: getInsightStage(),
    fact: `${dim}: ${cat} accounts for ${pct} of applications.`,
    boundary:
      `This meets the ${p.strength} threshold for distribution concentration under the current rules. ` +
      `Concentration does not imply effectiveness or ineffectiveness by itself. ` +
      buildStageConfidenceBoundary({
        patternType: p.type,
        stageBand,
        confidenceTone,
      }),
    reflection:
      `Is this concentration intentional or constraint-driven? ` +
      `What alternative segment could be tracked in parallel without changing the primary scope?`,
  };
};

const narrateTargetNarrowness = (p: Pattern): InsightNarrative => {
  const applications = p.metrics.applications ?? 0;
  const ratio = p.metrics.dominant_keyword_ratio ?? 0;
  const pct = toPct(ratio);
  const unique = p.metrics.unique_keyword_count ?? 0;
  const kw = p.meta?.dominant_keyword ?? "(unknown)";

  const stageBand = getStageBand(applications);
  const confidenceTone = getConfidenceTone(p.confidence ?? 0.6);

  return {
    pattern_type: p.type,
    strength: p.strength,
    confidence: getConfidenceLabel(p.confidence ?? 0.6),
    stage: getInsightStage(),
    fact: `Dominant target group: ${kw} (${pct}). Target groups observed: ${unique}.`,
    boundary:
      `This meets the ${p.strength} threshold for target narrowness under the current rules. ` +
      `No outcome inference is made from targeting scope alone. ` +
      buildStageConfidenceBoundary({
        patternType: p.type,
        stageBand,
        confidenceTone,
      }),
    reflection:
      `What was the original reason for this targeting scope? ` +
      `What adjacent target group would be the smallest expansion to track?`,
  };
};

const fallbackNarrative = (p: Pattern): InsightNarrative => {
  const applications = p.metrics.applications ?? 0;
  const stageBand = getStageBand(applications);
  const confidenceTone = getConfidenceTone(p.confidence ?? 0.6);

  return {
    pattern_type: p.type,
    strength: p.strength,
    confidence: getConfidenceLabel(p.confidence ?? 0.6),
    stage: getInsightStage(),
    fact: `Pattern detected: ${p.type}.`,
    boundary:
      `This output is descriptive only and uses the current ruleset. ` +
      buildGenericStageConfidenceBoundary(stageBand, confidenceTone),
    reflection: `Which additional context would help interpret this signal?`,
  };
};

const getInsightStage = (): InsightStage => "insight";

const getConfidenceLabel = (confidence: number): InsightConfidence => {
  if (confidence >= 0.7) return "high";
  if (confidence >= 0.4) return "medium";
  return "low";
};

const getStageBand = (applications: number): StageBand => {
  if (applications < 50) return "early";
  if (applications <= 120) return "mid";
  return "late";
};

const getConfidenceTone = (confidence: number): ConfidenceTone => {
  if (confidence >= 1.0) return "firm";
  if (confidence >= 0.8) return "measured";
  return "cautious";
};

const buildStageConfidenceBoundary = ({
  patternType,
  stageBand,
  confidenceTone,
}: {
  patternType: Pattern["type"];
  stageBand: StageBand;
  confidenceTone: ConfidenceTone;
}): string => {
  switch (patternType) {
    case "conversion_imbalance":
      return buildConversionBoundary(stageBand, confidenceTone);

    case "distribution_concentration":
      return buildDistributionBoundary(stageBand, confidenceTone);

    case "target_narrowness":
      return buildTargetBoundary(stageBand, confidenceTone);

    default:
      return buildGenericStageConfidenceBoundary(stageBand, confidenceTone);
  }
};

const buildConversionBoundary = (
  stageBand: StageBand,
  confidenceTone: ConfidenceTone,
): string => {
  if (stageBand === "early") {
    if (confidenceTone === "firm") {
      return `At this stage, the difference appears notable, though early-stage distributions may still shift as additional records accumulate.`;
    }

    if (confidenceTone === "measured") {
      return `At this stage, the signal appears directionally meaningful, though it may not yet reflect a stable conversion structure.`;
    }

    return `At this stage, the signal should be read cautiously, as early outcome distributions can still change materially with a relatively small number of additional records.`;
  }

  if (stageBand === "mid") {
    if (confidenceTone === "firm") {
      return `At this volume, the conversion pattern appears increasingly consistent and less likely to reflect short-term fluctuation alone.`;
    }

    if (confidenceTone === "measured") {
      return `At this volume, the conversion pattern suggests a recurring tendency, though some movement may still occur as the record set expands.`;
    }

    return `At this volume, the conversion pattern is observable, though moderate sample variation may still influence its shape.`;
  }

  if (confidenceTone === "firm") {
    return `At this scale, the conversion pattern appears relatively stable and more likely to reflect an established structure in the recorded outcomes.`;
  }

  if (confidenceTone === "measured") {
    return `At this scale, the conversion pattern appears broadly sustained rather than incidental.`;
  }

  return `At this scale, the conversion pattern is still better read as directional rather than absolute, despite the larger sample.`;
};

const buildDistributionBoundary = (
  stageBand: StageBand,
  confidenceTone: ConfidenceTone,
): string => {
  if (stageBand === "early") {
    if (confidenceTone === "firm") {
      return `At this stage, the concentration appears notable, though early application distributions may still rebalance as new records are added.`;
    }

    if (confidenceTone === "measured") {
      return `At this stage, the concentration suggests a visible directional skew, though it may not yet represent a settled distribution.`;
    }

    return `At this stage, the concentration should be interpreted cautiously, since a relatively small number of additional applications could still alter the distribution shape.`;
  }

  if (stageBand === "mid") {
    if (confidenceTone === "firm") {
      return `At this volume, the concentration appears increasingly consistent and less likely to be explained by short-term clustering alone.`;
    }

    if (confidenceTone === "measured") {
      return `At this volume, the concentration suggests a recurring distribution pattern, while still allowing room for moderate rebalancing.`;
    }

    return `At this volume, the concentration is observable, though it may still reflect moderate sample movement rather than a fully settled structure.`;
  }

  if (confidenceTone === "firm") {
    return `At this scale, the concentration appears relatively stable and more likely to reflect an established distribution pattern in the application set.`;
  }

  if (confidenceTone === "measured") {
    return `At this scale, the concentration appears broadly sustained rather than incidental.`;
  }

  return `At this scale, the concentration is still better treated as directional rather than absolute, despite the broader sample.`;
};

const buildTargetBoundary = (
  stageBand: StageBand,
  confidenceTone: ConfidenceTone,
): string => {
  if (stageBand === "early") {
    if (confidenceTone === "firm") {
      return `At this stage, the targeting scope appears notably concentrated, though early-stage targeting patterns may still widen or rebalance over time.`;
    }

    if (confidenceTone === "measured") {
      return `At this stage, the targeting scope suggests a visible narrowing tendency, though the range may still shift as additional records accumulate.`;
    }

    return `At this stage, the targeting scope should be read cautiously, since a small number of new target groups could still materially change the observed spread.`;
  }

  if (stageBand === "mid") {
    if (confidenceTone === "firm") {
      return `At this volume, the narrowing pattern appears increasingly consistent and less likely to reflect short-term clustering alone.`;
    }

    if (confidenceTone === "measured") {
      return `At this volume, the targeting scope suggests a recurring narrowing tendency, though some broadening may still occur as more records are added.`;
    }

    return `At this volume, the targeting scope is observable, though moderate sample variation may still affect how concentrated it appears.`;
  }

  if (confidenceTone === "firm") {
    return `At this scale, the targeting pattern appears relatively stable and more likely to reflect an established scope in the recorded applications.`;
  }

  if (confidenceTone === "measured") {
    return `At this scale, the targeting pattern appears broadly sustained rather than incidental.`;
  }

  return `At this scale, the targeting pattern is still better interpreted as directional rather than absolute, despite the larger sample.`;
};

const buildGenericStageConfidenceBoundary = (
  stageBand: StageBand,
  confidenceTone: ConfidenceTone,
): string => {
  if (stageBand === "early") {
    if (confidenceTone === "firm") {
      return `At this stage, the signal appears notable, though early-stage records may still shift as more entries are added.`;
    }

    if (confidenceTone === "measured") {
      return `At this stage, the signal appears directionally meaningful, though it may not yet reflect a stable structure.`;
    }

    return `At this stage, the signal should be interpreted cautiously, as early distributions can still change with additional records.`;
  }

  if (stageBand === "mid") {
    if (confidenceTone === "firm") {
      return `At this volume, the signal appears increasingly consistent and less likely to reflect short-term fluctuation alone.`;
    }

    if (confidenceTone === "measured") {
      return `At this volume, the signal suggests a recurring tendency, though some movement may still occur as records accumulate.`;
    }

    return `At this volume, the signal is observable, though moderate sample variation may still influence its shape.`;
  }

  if (confidenceTone === "firm") {
    return `At this scale, the signal appears relatively stable and more likely to reflect an established structural tendency.`;
  }

  if (confidenceTone === "measured") {
    return `At this scale, the signal appears broadly sustained rather than incidental.`;
  }

  return `At this scale, the signal is still better read as directional rather than absolute, despite the broader sample.`;
};

const toPct = (n: number): string => `${(n * 100).toFixed(1)}%`;
