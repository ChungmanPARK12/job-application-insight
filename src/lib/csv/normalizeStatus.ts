// src/lib/csv/normalizeStatus.ts

export type NormalizedStatus = 'No response' | 'Rejected' | 'Interview';

const STATUS_MAP: Array<{ match: RegExp; value: NormalizedStatus }> = [
  { match: /interview|phone screen|screening|1st interview|first interview/i, value: 'Interview' },
  { match: /reject|rejected|declined|unsuccessful|no longer/i, value: 'Rejected' },
  { match: /no response|ghost|pending|applied|submitted|waiting|in progress/i, value: 'No response' },
];

export const normalizeStatus = (raw: string): NormalizedStatus => {
  const s = (raw ?? '').trim();
  for (const rule of STATUS_MAP) {
    if (rule.match.test(s)) return rule.value;
  }
  // default: deterministic 판단 금지 → 애매하면 No response로 “보수적으로”
  return 'No response';
};
