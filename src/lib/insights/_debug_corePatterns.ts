// src/lib/insights/__debug_corePatterns.ts
import { detectCorePatterns } from "./detectCorePatterns";
import { narrateCorePatterns } from "./narrateCorePatterns";
import type { StatsResult } from "@/lib/stats";

export const runCorePatternDebug = () => {
  const cases: Array<{ name: string; mock: StatsResult }> = [
    // TEST 1 — Silence Mode
    {
      name: "TEST 1 — Silence Mode (total=15)",
      mock: {
        overall: { total: 15, interview_rate: 0.02 } as any,
        breakdowns: [
          {
            dimension: "job_source",
            rows: [{ key: "LinkedIn", total: 15, by_status: {} as any, interview_rate: 0.02 }],
          },
        ],
      } as any,
    },

    // TEST 2 — Early Stage + Weak Conversion
    {
      name: "TEST 2 — Early Stage Weak Conversion (total=35, rate=6%)",
      mock: {
        overall: { total: 35, interview_rate: 0.06 } as any,
        breakdowns: [
          {
            dimension: "job_source",
            rows: [
              { key: "LinkedIn", total: 20, by_status: {} as any, interview_rate: 0.05 },
              { key: "Seek", total: 15, by_status: {} as any, interview_rate: 0.07 },
            ],
          },
          {
            dimension: "location",
            rows: [
              { key: "Adelaide", total: 18, by_status: {} as any, interview_rate: 0.06 },
              { key: "Remote", total: 17, by_status: {} as any, interview_rate: 0.06 },
            ],
          },
          {
            dimension: "position_keyword",
            rows: [
              { key: "junior", total: 20, by_status: {} as any, interview_rate: 0.06 },
              { key: "(other)", total: 15, by_status: {} as any, interview_rate: 0.06 },
            ],
          },
        ],
      } as any,
    },

    // TEST 3 — Mid Stage + Strong Conversion
    {
      name: "TEST 3 — Mid Stage Strong Conversion (total=50, rate=4%)",
      mock: {
        overall: { total: 50, interview_rate: 0.04 } as any,
        breakdowns: [
          {
            dimension: "job_source",
            rows: [
              { key: "LinkedIn", total: 25, by_status: {} as any, interview_rate: 0.04 },
              { key: "Seek", total: 25, by_status: {} as any, interview_rate: 0.04 },
            ],
          },
        ],
      } as any,
    },

    // TEST 4 — Early Stage edge just below strong sample
    {
      name: "TEST 4 — Early Stage Edge (total=49, rate=3.9%)",
      mock: {
        overall: { total: 49, interview_rate: 0.039 } as any,
        breakdowns: [
          {
            dimension: "job_source",
            rows: [
              { key: "LinkedIn", total: 25, by_status: {} as any, interview_rate: 0.04 },
              { key: "Seek", total: 24, by_status: {} as any, interview_rate: 0.038 },
            ],
          },
        ],
      } as any,
    },

    // TEST 5 — Mid Stage Distribution Weak
    {
      name: "TEST 5 — Mid Stage Distribution Weak (total=60, dominant=70%)",
      mock: {
        overall: { total: 60, interview_rate: 0.12 } as any,
        breakdowns: [
          {
            dimension: "location",
            rows: [
              { key: "Adelaide", total: 42, by_status: {} as any, interview_rate: 0.12 },
              { key: "Remote", total: 18, by_status: {} as any, interview_rate: 0.12 },
            ],
          },
          {
            dimension: "position_keyword",
            rows: [
              { key: "junior", total: 30, by_status: {} as any, interview_rate: 0.12 },
              { key: "(other)", total: 30, by_status: {} as any, interview_rate: 0.12 },
            ],
          },
        ],
      } as any,
    },

    // TEST 6 — Mid Stage All 3 Strong + Max 2
    {
      name: "TEST 6 — Mid Stage All 3 Strong (total=60, expect max 2)",
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

    // TEST 7 — Late Stage Distribution Strong
    {
      name: "TEST 7 — Late Stage Distribution Strong (total=140, dominant=82%)",
      mock: {
        overall: { total: 140, interview_rate: 0.11 } as any,
        breakdowns: [
          {
            dimension: "location",
            rows: [
              { key: "Adelaide", total: 115, by_status: {} as any, interview_rate: 0.11 },
              { key: "Remote", total: 25, by_status: {} as any, interview_rate: 0.11 },
            ],
          },
          {
            dimension: "position_keyword",
            rows: [
              { key: "junior", total: 70, by_status: {} as any, interview_rate: 0.11 },
              { key: "(other)", total: 70, by_status: {} as any, interview_rate: 0.11 },
            ],
          },
        ],
      } as any,
    },

    // TEST 8 — Late Stage Target Strong
    {
      name: "TEST 8 — Late Stage Target Strong (total=150, keyword=88%)",
      mock: {
        overall: { total: 150, interview_rate: 0.12 } as any,
        breakdowns: [
          {
            dimension: "position_keyword",
            rows: [
              { key: "frontend", total: 132, by_status: {} as any, interview_rate: 0.12 },
              { key: "(other)", total: 18, by_status: {} as any, interview_rate: 0.12 },
            ],
          },
          {
            dimension: "location",
            rows: [
              { key: "Adelaide", total: 75, by_status: {} as any, interview_rate: 0.12 },
              { key: "Remote", total: 75, by_status: {} as any, interview_rate: 0.12 },
            ],
          },
        ],
      } as any,
    },
    // TEST 9 — Weak Only (expect 1 insight)
    {
      name: "TEST 9 — Weak Only (expect 1 insight)",
      mock: {
        overall: { total: 40, interview_rate: 0.06 } as any,
        breakdowns: [
          {
            dimension: "job_source",
            rows: [
              { key: "LinkedIn", total: 26, by_status: {} as any, interview_rate: 0.05 },
              { key: "Seek", total: 14, by_status: {} as any, interview_rate: 0.07 },
            ],
          },
          {
            dimension: "location",
            rows: [
              { key: "Adelaide", total: 28, by_status: {} as any, interview_rate: 0.06 },
              { key: "Remote", total: 12, by_status: {} as any, interview_rate: 0.06 },
            ],
          },
          {
            dimension: "position_keyword",
            rows: [
              { key: "junior", total: 32, by_status: {} as any, interview_rate: 0.06 },
              { key: "(other)", total: 8, by_status: {} as any, interview_rate: 0.06 },
            ],
          },
        ],
      } as any,
    },
    // TEST 10 — Strong Present (expect 2 insights)
    {
      name: "TEST 10 — Strong Present (expect 2 insights)",
      mock: {
        overall: { total: 60, interview_rate: 0.03 } as any,
        breakdowns: [
          {
            dimension: "job_source",
            rows: [
              { key: "LinkedIn", total: 48, by_status: {} as any, interview_rate: 0.02 },
              { key: "Seek", total: 12, by_status: {} as any, interview_rate: 0.1 },
            ],
          },
          {
            dimension: "location",
            rows: [
              { key: "Adelaide", total: 50, by_status: {} as any, interview_rate: 0.03 },
              { key: "Remote", total: 10, by_status: {} as any, interview_rate: 0.03 },
            ],
          },
          {
            dimension: "position_keyword",
            rows: [
              { key: "junior", total: 55, by_status: {} as any, interview_rate: 0.03 },
              { key: "(other)", total: 5, by_status: {} as any, interview_rate: 0.03 },
            ],
          },
        ],
      } as any,
    },
  ];

  for (const t of cases) {
    const patterns = detectCorePatterns(t.mock);
    const narratives = narrateCorePatterns(patterns);

    // eslint-disable-next-line no-console
    console.log(`\n==============================`);
    // eslint-disable-next-line no-console
    console.log(t.name);
    // eslint-disable-next-line no-console
    console.log(`==============================`);

    // eslint-disable-next-line no-console
    console.log("patterns:");
    for (const p of patterns) {
      // eslint-disable-next-line no-console
      console.log({
        type: p.type,
        strength: p.strength,
        confidence: p.confidence,
        applications: p.metrics.applications,
        metrics: p.metrics,
        meta: p.meta,
      });
    }

    // eslint-disable-next-line no-console
    console.log("narratives:");
    for (const n of narratives) {
      // eslint-disable-next-line no-console
      console.log({
        pattern_type: n.pattern_type,
        strength: n.strength,
        fact: n.fact,
        boundary: n.boundary,
        hasReflection: Boolean(n.reflection),
        reflection: n.reflection ?? null,
      });
    }
  }
};