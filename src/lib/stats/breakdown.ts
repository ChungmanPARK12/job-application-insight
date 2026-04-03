// src/lib/stats/breakdown.ts

import type { ApplicationRecord } from "@/types/ApplicationRecord";
import type { BreakdownDimension, BreakdownResult, BreakdownRow, Status3 } from "./types";

const initStatusCounter = (): Record<Status3, number> => ({
  interview: 0,
  rejected: 0,
  no_response: 0,
});

const normalizeStatusForStats = (raw: unknown): Status3 | null => {
  if (typeof raw !== "string") return null;

  const s = raw.trim().toLowerCase();

  if (s === "interview") return "interview";
  if (s === "rejected") return "rejected";

  if (s === "no_response") return "no_response";
  if (s === "no response") return "no_response";
  if (s === "no-response") return "no_response";
  if (s === "noresponse") return "no_response";

  return null;
};

const safeKey = (raw: unknown, fallback = "(unknown)"): string => {
  if (typeof raw !== "string") return fallback;
  const s = raw.trim();
  return s.length > 0 ? s : fallback;
};

export const computeBreakdown = (
  records: ApplicationRecord[],
  dimension: BreakdownDimension,
  keyFn: (r: ApplicationRecord) => string,
  options?: { minSampleGroup?: number }
): BreakdownResult => {
  const minSampleGroup = options?.minSampleGroup ?? 5;

  const groups = new Map<string, ApplicationRecord[]>();
  for (const r of records) {
    const key = safeKey(keyFn(r));
    const arr = groups.get(key);
    if (arr) arr.push(r);
    else groups.set(key, [r]);
  }

  const rows: BreakdownRow[] = [];

  for (const [key, groupRecords] of groups.entries()) {
    const by_status = initStatusCounter();

    for (const r of groupRecords) {
      const st = normalizeStatusForStats((r as any).status);
      if (st) by_status[st] += 1;
    }

    const total = groupRecords.length;
    const interview_rate = total >= minSampleGroup ? by_status.interview / total : null;

    rows.push({
      key,
      total,
      by_status,
      interview_rate,
    });
  }

  // Sort: bigger groups first, then key asc
  rows.sort((a, b) => {
    if (b.total !== a.total) return b.total - a.total;
    return a.key.localeCompare(b.key);
  });

  return { dimension, rows };
};

export const breakdownByJobSource = (
  records: ApplicationRecord[],
  options?: { minSampleGroup?: number }
): BreakdownResult => {
  return computeBreakdown(
    records,
    "job_source",
    (r) => (r as any).job_source ?? (r as any).jobSource ?? "(unknown)",
    options
  );
};

export const breakdownByLocation = (
  records: ApplicationRecord[],
  options?: { minSampleGroup?: number }
): BreakdownResult => {
  return computeBreakdown(
    records,
    "location",
    (r) => (r as any).location ?? "(unknown)",
    options
  );
};

// Application date
const toMonthKey = (raw: unknown): string => {
  if (typeof raw !== "string") return "(invalid_date)";
  const s = raw.trim();
  if (!s) return "(invalid_date)";

  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return "(invalid_date)";

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${yyyy}-${mm}`;
};

export const breakdownByMonth = (
  records: ApplicationRecord[],
  options?: { minSampleGroup?: number }
): BreakdownResult => {
  return computeBreakdown(
    records,
    "month",
    (r) => toMonthKey((r as any).applied_date ?? (r as any).appliedDate),
    options
  );
};

const detectPositionKeyword = (raw: unknown): string => {
  if (typeof raw !== "string") return "(other)";
  const s = raw.trim().toLowerCase();
  if (!s) return "(other)";

  // priority order (more specific first)
  if (s.includes("intern")) return "intern";
  if (s.includes("junior")) return "junior";
  if (s.includes("graduate") || s.includes("grad")) return "graduate";
  if (s.includes("mid") || s.includes("intermediate")) return "mid";
  if (s.includes("senior") || s.includes("sr")) return "senior";
  if (s.includes("lead") || s.includes("principal")) return "lead";
  if (s.includes("manager") || s.includes("mgr")) return "manager";

  return "(other)";
};

export const breakdownByPositionKeyword = (
  records: ApplicationRecord[],
  options?: { minSampleGroup?: number }
): BreakdownResult => {
  return computeBreakdown(
    records,
    "position_keyword",
    (r) => detectPositionKeyword((r as any).position ?? (r as any).title ?? ""),
    options
  );
};



