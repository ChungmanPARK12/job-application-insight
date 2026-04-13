// src/lib/insights/decision/buildExecutionPlan.ts
import type { InsightAction } from "../types/action.types";
import type { ExecutionPlan } from "../types/decision.types";

const buildConversionPlan = (action: InsightAction): ExecutionPlan => {
  return {
    goal: action.title,
    steps: [
      {
        step: 1,
        title: "Review your recent applications",
        description:
          "Start by reviewing your recent applications across resume versions, job sources, locations, and role levels to spot any meaningful differences.",
        type: "sequential",
      },
      {
        step: 2,
        title: "Identify the weakest conversion factor",
        description:
          "Look for the factor that appears most often in lower interview-rate or response-rate outcomes.",
        type: "sequential",
      },
      {
        step: 3,
        title: "Test one focused change",
        description:
          "Apply one controlled change in your next batch of applications and observe whether conversion improves.",
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
        title: "Review where your applications are concentrated",
        description:
          "Check which source, location, or category currently receives most of your applications.",
        type: "sequential",
      },
      {
        step: 2,
        title: "Choose one nearby segment to test",
        description:
          "Pick one realistic adjacent segment that you can include in your next application cycle.",
        type: "sequential",
      },
      {
        step: 3,
        title: "Compare the results side by side",
        description:
          "Track the current dominant segment and the new segment together in the next cycle to see whether the wider distribution improves results.",
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
        title: "Review your current target focus",
        description:
          "Check which keyword group or position cluster currently dominates your application targeting.",
        type: "sequential",
      },
      {
        step: 2,
        title: "Add one closely related target group",
        description:
          "Choose one nearby keyword group or position cluster that still fits your background and experience.",
        type: "sequential",
      },
      {
        step: 3,
        title: "Measure whether broader targeting helps",
        description:
          "Track whether the wider target range leads to more responses or interview opportunities in the next cycle.",
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
        title: "Review what this signal is showing",
        description:
          "Start by checking the surrounding application context so you can understand what this signal may be pointing to.",
        type: "sequential",
      },
      {
        step: 2,
        title: "Choose one small adjustment",
        description:
          "Select one clear and trackable change to apply in the next cycle.",
        type: "sequential",
      },
      {
        step: 3,
        title: "Compare the next results",
        description:
          "Use the next cycle as a comparison point and check whether the change led to a better outcome.",
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
