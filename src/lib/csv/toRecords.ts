// src/lib/csv/toRecords.ts
import { HeaderIndexMap } from './validateColumns';
import { normalizeStatus } from './normalizeStatus';
import { ApplicationRecord } from '@/types/ApplicationRecord';

const genId = () => crypto.randomUUID(); // Next.js runtime OK

const pick = (row: string[], idx: number | null) =>
  idx == null ? '' : (row[idx] ?? '').trim();

export const toApplicationRecords = (rows: string[][], map: HeaderIndexMap): ApplicationRecord[] => {
  return rows.map((row) => ({
    application_id: genId(),
    applied_date: pick(row, map.applied_date),
    company: pick(row, map.company),
    position: pick(row, map.position),
    job_source: pick(row, map.job_source) || undefined,
    location: pick(row, map.location) || undefined,
    status: normalizeStatus(pick(row, map.status)),
    notes: pick(row, map.notes) || undefined,
    resume_version: pick(row, map.resume_version) || undefined,
    link: pick(row, map.link) || undefined,
  }));
};
