// src/lib/csv/headerMapping.ts

export type ApplicationField =
  | 'applied_date'
  | 'company'
  | 'position'
  | 'job_source'
  | 'location'
  | 'status'
  | 'notes'
  | 'resume_version'
  | 'link';

export const HEADER_ALIASES: Record<ApplicationField, string[]> = {
  applied_date: ['applied_date', 'date', 'applied', 'applied date'],
  company: ['company', 'company_name', 'employer'],
  position: ['position', 'role', 'job_title', 'title'],
  job_source: ['job_source', 'source', 'platform'],
  location: ['location', 'city', 'region'],
  status: ['status', 'result', 'outcome'],
  notes: ['notes', 'memo', 'comment'],
  resume_version: ['resume_version', 'cv_version', 'resume'],
  link: ['link', 'url', 'posting', 'job_link'],
};
