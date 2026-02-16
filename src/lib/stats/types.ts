// src/lib/stats/types.ts

export type Status3 = 'interview' | 'rejected' | 'no_response';

export type OverallStats = {
  total: number;
  by_status: Record<Status3, number>;
  interview_rate: number | null;
};

export type BreakdownDimension =
  | 'job_source'
  | 'position_keyword'
  | 'location'
  | 'month';

export type BreakdownRow = {
  key: string;
  total: number;
  by_status: Record<Status3, number>;
  interview_rate: number | null;
};

export type BreakdownResult = {
  dimension: BreakdownDimension;
  rows: BreakdownRow[];
};

export type StatsResult = {
  overall: OverallStats;
  breakdowns: BreakdownResult[];
  meta: {
    generated_at: string;
    status_values: Status3[];
  };
};
