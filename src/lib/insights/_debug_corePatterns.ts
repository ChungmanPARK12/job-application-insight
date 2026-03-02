// src/lib/insights/__debug_corePatterns.ts
import { detectCorePatterns } from "./detectCorePatterns";
import type { StatsResult } from "@/lib/stats";

export const runCorePatternDebug = () => {
  const cases: Array<{ name: string; mock: StatsResult }> = [
    // TEST 1 — Silence Mode (total < 20)
    {
      name: "TEST 1 — Silence Mode (total=15)",
      mock: {
        overall: { total: 15, interview_rate: 0.02 } as any,
        breakdowns: [
          { dimension: "job_source", rows: [{ key: "LinkedIn", total: 15, by_status: {} as any, interview_rate: 0.02 }] },
        ],
      } as any,
    },

    // TEST 2 — Weak Conversion Only (30<=total<50, rate<=7%)
    {
      name: "TEST 2 — Weak Conversion (total=35, rate=6%)",
      mock: {
        overall: { total: 35, interview_rate: 0.06 } as any,
        breakdowns: [
          { dimension: "job_source", rows: [{ key: "LinkedIn", total: 20, by_status: {} as any, interview_rate: 0.05 }, { key: "Seek", total: 15, by_status: {} as any, interview_rate: 0.07 }] },
          { dimension: "location", rows: [{ key: "Adelaide", total: 18, by_status: {} as any, interview_rate: 0.06 }, { key: "Remote", total: 17, by_status: {} as any, interview_rate: 0.06 }] },
          { dimension: "position_keyword", rows: [{ key: "junior", total: 20, by_status: {} as any, interview_rate: 0.06 }, { key: "(other)", total: 15, by_status: {} as any, interview_rate: 0.06 }] },
        ],
      } as any,
    },

    // TEST 3 — Strong Conversion Edge (total=50, rate=4%)
    {
      name: "TEST 3 — Strong Conversion Edge (total=50, rate=4%)",
      mock: {
        overall: { total: 50, interview_rate: 0.04 } as any,
        breakdowns: [
          { dimension: "job_source", rows: [{ key: "LinkedIn", total: 25, by_status: {} as any, interview_rate: 0.04 }, { key: "Seek", total: 25, by_status: {} as any, interview_rate: 0.04 }] },
        ],
      } as any,
    },

    // TEST 4 — Just Below Strong Sample (total=49, rate=3.9%)
    {
      name: "TEST 4 — Below Strong Sample (total=49, rate=3.9%)",
      mock: {
        overall: { total: 49, interview_rate: 0.039 } as any,
        breakdowns: [
          { dimension: "job_source", rows: [{ key: "LinkedIn", total: 25, by_status: {} as any, interview_rate: 0.04 }, { key: "Seek", total: 24, by_status: {} as any, interview_rate: 0.038 }] },
        ],
      } as any,
    },

    // TEST 5 — Distribution Weak Only (dominant_ratio=70%)
    {
      name: "TEST 5 — Distribution Weak Only (dominant=70%)",
      mock: {
        overall: { total: 60, interview_rate: 0.12 } as any, // high rate to avoid conversion trigger
        breakdowns: [
          {
            dimension: "location",
            rows: [
              { key: "Adelaide", total: 42, by_status: {} as any, interview_rate: 0.12 }, // 42/60=0.70 (weak)
              { key: "Remote", total: 18, by_status: {} as any, interview_rate: 0.12 },
            ],
          },
          {
            dimension: "position_keyword",
            rows: [
              { key: "junior", total: 30, by_status: {} as any, interview_rate: 0.12 }, // 30/60=0.50 (no target trigger)
              { key: "(other)", total: 30, by_status: {} as any, interview_rate: 0.12 },
            ],
          },
        ],
      } as any,
    },

    // TEST 6 — All 3 Strong (and max-2 exposure)
    {
      name: "TEST 6 — All 3 Strong (expect max 2)",
      mock: {
        overall: { total: 60, interview_rate: 0.03 } as any,
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
            rows: [{ key: "2026-02", total: 60, by_status: {} as any, interview_rate: 0.03 }],
          },
        ],
      } as any,
    },
  ];

  for (const t of cases) {
    const out = detectCorePatterns(t.mock);
    // eslint-disable-next-line no-console
    console.log(`\n${t.name}`);
    // eslint-disable-next-line no-console
    console.log(out);
  }
};