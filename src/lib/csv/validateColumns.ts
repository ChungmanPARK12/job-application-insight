// src/lib/csv/validateColumns.ts
import { ApplicationField, HEADER_ALIASES } from './headerMapping';

export const REQUIRED_FIELDS: ApplicationField[] = [
  'applied_date',
  'company',
  'position',
  'status',
];

export type HeaderIndexMap = Record<ApplicationField, number | null>;

export const buildHeaderIndexMap = (headers: string[]): HeaderIndexMap => {
  const lower = headers.map(h => h.trim().toLowerCase());
  const map = {} as HeaderIndexMap;

  (Object.keys(HEADER_ALIASES) as ApplicationField[]).forEach((field) => {
    const aliases = HEADER_ALIASES[field].map(a => a.toLowerCase());
    const idx = lower.findIndex(h => aliases.includes(h));
    map[field] = idx >= 0 ? idx : null;
  });

  return map;
};

export const validateRequired = (map: HeaderIndexMap) => {
  const missing = REQUIRED_FIELDS.filter(f => map[f] == null);
  return { ok: missing.length === 0, missing };
};
