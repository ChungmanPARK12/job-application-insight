// src/lib/insights/__debug_corePatterns.ts
import { detectCorePatterns } from "./detectCorePatterns";
import type { StatsResult } from "@/lib/stats";

export const runCorePatternDebug = () => {
  const mock: StatsResult = {
    overall: {
      total: 60,
      interview_rate: 0.03, // 3%
    } as any,
    breakdowns: [
      {
        dimension: "job_source",
        rows: [
          { key: "LinkedIn", total: 50, by_status: {} as any, interview_rate: 0.02 },
          { key: "Seek", total: 10, by_status: {} as any, interview_rate: 0.1 },
        ],
      },
      {
        dimension: "location",
        rows: [
          { key: "Adelaide", total: 55, by_status: {} as any, interview_rate: 0.03 },
          { key: "Remote", total: 5, by_status: {} as any, interview_rate: null },
        ],
      },
      {
        dimension: "position_keyword",
        rows: [
          { key: "junior", total: 58, by_status: {} as any, interview_rate: 0.03 },
          { key: "(other)", total: 2, by_status: {} as any, interview_rate: null },
        ],
      },
      {
        dimension: "month",
        rows: [
          { key: "2026-02", total: 60, by_status: {} as any, interview_rate: 0.03 },
        ],
      },
    ],
  } as any;

  const out = detectCorePatterns(mock);
  // eslint-disable-next-line no-console
  console.log("detectCorePatterns output:", out);
};