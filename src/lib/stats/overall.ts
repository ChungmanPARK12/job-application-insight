// src/lib/stats/overall.ts

import type { ApplicationRecord } from "@/types/ApplicationRecord";
import type { OverallStats, Status3 } from "./types";

const initStatusCounter = (): Record<Status3, number> => ({
  interview: 0,
  rejected: 0,
  no_response: 0,
});

const normalizeStatusForStats = (raw: unknown): Status3 | null => {
  if (typeof raw !== "string") return null;

  const s = raw.trim().toLowerCase();

  // allow a few common variants just in case
  if (s === "interview") return "interview";
  if (s === "rejected") return "rejected";

  if (s === "no_response") return "no_response";
  if (s === "no response") return "no_response";
  if (s === "no-response") return "no_response";
  if (s === "noresponse") return "no_response";

  return null;
};

export const computeOverallStats = (
  records: ApplicationRecord[],
  minSampleOverall = 10
): OverallStats => {
  const total = records.length;
  const by_status = initStatusCounter();

  for (const r of records) {
    const normalized = normalizeStatusForStats((r as any).status);
    if (normalized) by_status[normalized] += 1;
  }

  const interview_rate =
    total >= minSampleOverall && total > 0 ? by_status.interview / total : null;

  return { total, by_status, interview_rate };
};
