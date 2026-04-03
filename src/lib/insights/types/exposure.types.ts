import type { RankedPattern } from "../rankInsightPatterns";

export type ExposureDecision =
  | "show"
  | "hide_low_sample"
  | "hide_low_confidence"
  | "hide_weak_pattern"
  | "hide_below_exposure_cap";

export interface FilteredPattern extends RankedPattern {
  exposureDecision: ExposureDecision;
  shouldExpose: boolean;
}