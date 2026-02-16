// src/lib/stats/buildStatsResult.ts

import type { ApplicationRecord } from "@/types/ApplicationRecord";
import type { StatsResult, Status3 } from "./types";
import { computeOverallStats } from "./overall";

const STATUS_VALUES: Status3[] = ["interview", "rejected", "no_response"];

export const buildStatsResult = (records: ApplicationRecord[]): StatsResult => {
  return {
    overall: computeOverallStats(records),
    breakdowns: [], // Task 5에서 채움
    meta: {
      generated_at: new Date().toISOString(),
      status_values: STATUS_VALUES,
    },
  };
};
