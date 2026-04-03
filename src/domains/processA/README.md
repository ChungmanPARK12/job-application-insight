# Process A — Outcome-driven Analysis

## Overview

Process A is a rule-based insight engine that analyzes job application outcomes.

Data flow:

CSV → Normalization → Stats → Pattern Detection → Narrative Insights

The system focuses on structured observation, not prediction.

---

## Purpose

To identify observable signals in job application outcomes
while maintaining cautious and non-deterministic language.

---

## Input

CSV job application history.

Recommended sample size:
- n ≥ 10 for basic signals
- n ≥ 30 for stable presentation

Required fields:
- company
- position
- location
- job_source
- applied_date
- status

---

## Status Normalization

All statuses are normalized into:

- Applied
- Rejected
- Interviewing
- Offer
- Withdrawn

---

## Statistical Output

The system computes:

- Overall application count
- Interview rate
- Status distribution
- Breakdown by:
  - job_source
  - location
  - month
  - position_keyword

---

## Pattern Detection

Signals are rule-based and include:

- Relative interview rate differences
- Minimum sample thresholds
- Guardrail enforcement

All insights use cautious phrasing
(e.g., "appear to", "may indicate").

---

## Current Stage

Week 3 — Insight Engine complete  
Week 4 — Presentation MVP complete