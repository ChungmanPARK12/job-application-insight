// src/types/ApplicationRecord.ts
import { NormalizedStatus } from '@/lib/csv/normalizeStatus';

export type ApplicationRecord = {
  application_id: string;
  applied_date: string;
  company: string;
  position: string;
  job_source?: string;
  location?: string;
  status: NormalizedStatus;
  notes?: string;
  resume_version?: string;
  link?: string;
};
