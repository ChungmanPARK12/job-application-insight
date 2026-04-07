// src/lib/insights/decision/buildExecutionPlan.ts
import type { InsightAction } from "../types/action.types";
import type { ExecutionPlan } from "../types/decision.types";

const buildConversionPlan = (action: InsightAction): ExecutionPlan => {
  return {
    goal: action.title,
    steps: [
      {
        step: 1,
        title: "Audit recent application inputs",
        description:
          "Review recent applications by resume version, job source, location, and role level.",
        type: "sequential",
      },
      {
        step: 2,
        title: "Identify the weakest conversion variable",
        description:
          "Find which variable appears most often in lower interview-rate or response-rate outcomes.",
        type: "sequential",
      },
      {
        step: 3,
        title: "Run one controlled adjustment",
        description:
          "Change only one variable in the next application batch and track whether conversion improves.",
        type: "sequential",
      },
    ],
  };
};

const buildDistributionPlan = (action: InsightAction): ExecutionPlan => {
  return {
    goal: action.title,
    steps: [
      {
        step: 1,
        title: "Confirm the dominant segment",
        description:
          "Identify which source, location, or category currently dominates your application distribution.",
        type: "sequential",
      },
      {
        step: 2,
        title: "Select one adjacent segment",
        description:
          "Choose one nearby alternative segment that is realistic to test in the next cycle.",
        type: "sequential",
      },
      {
        step: 3,
        title: "Track both side by side",
        description:
          "Compare the current dominant segment and the new segment in parallel during the next application cycle.",
        type: "parallel",
      },
    ],
  };
};

const buildTargetNarrownessPlan = (action: InsightAction): ExecutionPlan => {
  return {
    goal: action.title,
    steps: [
      {
        step: 1,
        title: "Confirm the current target focus",
        description:
          "Identify which keyword group or position cluster currently dominates your targeting scope.",
        type: "sequential",
      },
      {
        step: 2,
        title: "Add one adjacent target group",
        description:
          "Choose one closely related keyword group or position cluster that still matches your background.",
        type: "sequential",
      },
      {
        step: 3,
        title: "Measure coverage impact",
        description:
          "Track whether the wider target range improves response volume or interview opportunities.",
        type: "sequential",
      },
    ],
  };
};

const buildFallbackPlan = (action: InsightAction): ExecutionPlan => {
  return {
    goal: action.title,
    steps: [
      {
        step: 1,
        title: "Review the signal context",
        description:
          "Check the surrounding application context and clarify what this signal is indicating.",
        type: "sequential",
      },
      {
        step: 2,
        title: "Define one small adjustment",
        description:
          "Choose one specific and trackable change for the next cycle.",
        type: "sequential",
      },
      {
        step: 3,
        title: "Observe the next outcome",
        description:
          "Compare the next cycle against the current baseline and check whether the change helped.",
        type: "sequential",
      },
    ],
  };
};

export const buildExecutionPlan = (
  patternType: string,
  action: InsightAction,
): ExecutionPlan => {
  switch (patternType) {
    case "conversion_imbalance":
      return buildConversionPlan(action);

    case "distribution_concentration":
      return buildDistributionPlan(action);

    case "target_narrowness":
      return buildTargetNarrownessPlan(action);

    default:
      return buildFallbackPlan(action);
  }
};
