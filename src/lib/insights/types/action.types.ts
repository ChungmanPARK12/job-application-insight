export type ActionPriority = "high" | "medium" | "low";

export interface InsightAction {
  title: string;
  description: string;
  priority: ActionPriority;
}