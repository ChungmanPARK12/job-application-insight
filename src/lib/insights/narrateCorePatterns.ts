// src/lib/insights/narrateCorePatterns.ts

import type { Pattern } from "./pattern.types";
import type { InsightNarrative } from "./narration.types";

// Neutral, report-style wording only
export const narrateCorePatterns = (patterns: Pattern[]): InsightNarrative[] => {
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

  return {
    pattern_type: p.type,
    strength: p.strength,
    fact: `Total applications: ${applications}. Overall interview rate: ${pct}.`,
    boundary:
      `This meets the ${p.strength} threshold for conversion imbalance under the current rules ` +
      `(sample size and rate). This is a descriptive signal based on recorded outcomes only.`,
    reflection:
      `Which variables remained consistent across applications (role level, location, source, resume version)? ` +
      `Which single variable changed most often during this period?`,
  };
};

const narrateDistributionConcentration = (p: Pattern): InsightNarrative => {
  const dominantRatio = p.metrics.dominant_ratio ?? 0;
  const pct = toPct(dominantRatio);
  const dim = p.meta?.dominant_dimension ?? "(unknown)";
  const cat = p.meta?.dominant_category ?? "(unknown)";

  return {
    pattern_type: p.type,
    strength: p.strength,
    fact: `${dim}: ${cat} accounts for ${pct} of applications.`,
    boundary:
      `This meets the ${p.strength} threshold for distribution concentration under the current rules. ` +
      `Concentration does not imply effectiveness or ineffectiveness by itself.`,
    reflection:
      `Is this concentration intentional or constraint-driven? ` +
      `What alternative segment could be tracked in parallel without changing the primary scope?`,
  };
};

const narrateTargetNarrowness = (p: Pattern): InsightNarrative => {
  const ratio = p.metrics.dominant_keyword_ratio ?? 0;
  const pct = toPct(ratio);
  const unique = p.metrics.unique_keyword_count ?? 0;
  const kw = p.meta?.dominant_keyword ?? "(unknown)";

  return {
    pattern_type: p.type,
    strength: p.strength,
    fact: `Dominant target group: ${kw} (${pct}). Target groups observed: ${unique}.`,
    boundary:
      `This meets the ${p.strength} threshold for target narrowness under the current rules. ` +
      `No outcome inference is made from targeting scope alone.`,
    reflection:
      `What was the original reason for this targeting scope? ` +
      `What adjacent target group would be the smallest expansion to track?`,
  };
};

const fallbackNarrative = (p: Pattern): InsightNarrative => {
  return {
    pattern_type: p.type,
    strength: p.strength,
    fact: `Pattern detected: ${p.type}.`,
    boundary: `This output is descriptive only and uses the current ruleset.`,
    reflection: `Which additional context would help interpret this signal?`,
  };
};

const toPct = (n: number): string => `${(n * 100).toFixed(1)}%`;