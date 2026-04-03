import { calculateTrendMetric } from "./calculateTrendMetric";
import type {
  BuildTrendAnalysisParams,
  TrendAnalysisResult,
} from "../types/trend.types";

export const buildTrendAnalysis = ({
  current,
  previous,
}: BuildTrendAnalysisParams): TrendAnalysisResult => {
  return {
    overall: {
      total: calculateTrendMetric(
        current.overall.total ?? 0,
        previous.overall.total ?? 0
      ),
      interview_rate: calculateTrendMetric(
        current.overall.interview_rate ?? 0,
        previous.overall.interview_rate ?? 0
      ),
    },
  };
};