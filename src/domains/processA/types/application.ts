export type ApplicationStatus =
  | "NoResponse"
  | "Rejected"
  | "Interview"
  | "Offer"
  | "Withdrawn";

export type ApplicationRow = {
  application_id: string;
  applied_date: string; // YYYY-MM-DD

  company: string;
  role_title: string;
  platform: string;

  status: ApplicationStatus;

  location?: string;
  seniority?: string;
  notes?: string;
};
