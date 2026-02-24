# CHANGELOG

## [2026-02-05] — Project Initialization

### Create Project
- Initialized Next.js project with TypeScript
- Command used:
  - `npx create-next-app@latest job-application-insight --typescript`
- Verified local development server (`npm run dev`)

### Tooling & Configuration
- ESLint configured (Next.js default)
- TypeScript + React standard linting
- Codebase structured under `src/` directory
- Import alias enabled (`@/`)

## [2026-02-12] — Week 2 Day 1

### CSV Upload (Preview Stage)
- Implemented CSV file upload in UI
- Read file content using FileReader
- Displayed file metadata (chars, lines, rows)
- Added header preview

## [2026-02-13] — Week 2: Data Stabilization Layer

### Added
- Header, internal field mapping (`HEADER_ALIASES`)
- Status normalization (3 states only):
  - No response
  - Rejected
  - Interview
- Required column validation
- `ApplicationRecord` model (UUID-based `application_id`)
- Unified CSV pipeline:
  - parse → mapping → validation → normalization → records

### Updated
- Integrated pipeline into `page.tsx`
- Added `records` and `pipelineError` state
- Added ApplicationRecord preview block

Next:
- Basic statistics calculation (interview conversion metrics)

## [2026-02-16]

### Week 3 — Insight Engine (Foundation)

- Created new analytics layer: `src/lib/stats/`
- Introduced unified `StatsResult` structure:
  - overall
  - breakdowns
  - meta
- Implemented `buildStatsResult(records)` as entry point

### Overall Statistics

- Implemented `computeOverallStats()` in overall.ts
  - total applications
  - status counts (interview / rejected / no_response)
  - interview conversion rate
- Added minimum sample guard (rate returns `null` if dataset too small)
- Added defensive status normalization (trim + lowercase handling)

### UI Integration

- Connected Stats Engine to `page.tsx`
- Rendering full `StatsResult` JSON for debugging
- Verified total and status counts match records

---

### Next

- Implement category breakdowns
- Then rule-based pattern detection

## [2026-02-17]

### Week 3 — Stats Engine (Foundation)

- Added breakdowns:
  - job_source
  - location
  - month (applied_date → YYYY-MM, invalid → (invalid_date))
  - position_keyword (intern/junior/graduate/mid/senior/lead/manager/other)
- Connected `StatsResult` rendering in `src/app/page.tsx` for debugging

### Next Plan
- Rule-based pattern detection

## [2026-02-17]

### Week 3 — Rule Engine (Pattern Detection & Narration)

- Implemented rule-based pattern detection on top of `StatsResult`
  - Compare group interview_rate vs overall interview_rate
  - Apply sample guards (overall / group)
  - Apply minimum delta threshold
- Introduced `PatternFinding` structure
- Implemented natural sentence generation via `narrateInsights`
  - Cautious phrasing ("In this dataset", "appears to...")
  - Sample-size awareness

---

### Week 3 — Completion Summary

- Stats Engine (overall + 4 breakdowns)
- Rule-based pattern detection
- Insight narration layer
- End-to-end flow:
  CSV → Structured Data → Stats → Breakdown → Pattern → Narrative Insight

- Week 3 Goal Achieved:
 - “Results can be explained in natural language.”

## Week 4 — Presentation

### Goal
“Insights are understandable to others.”

### Planned Scope

- Minimal UI refinement
  - Remove raw JSON debug view
  - Highlight key metrics only

- Insight card layout
  - Overall summary card
  - Top positive / negative patterns
  - Clean breakdown presentation

- README refinement
  - Architecture flow explanation
  - Design philosophy (cautious analysis)
  - Limitations (small dataset guard)
  - Sample output screenshots

## [2026-02-20]

### Week 4 — Presentation Layer (Phase 1)

## Completed Pahse 1

- Removed raw JSON debug view from default UI
- Added Insight Cards:
  - Overall Summary
  - Key Insights
  - Breakdown Summary (4 dimensions)
- Fixed breakdown mapping (dimension-based array structure)
- Added debug toggle (developer-only)
- Created structured test datasets:
  - Signal-heavy dataset (LinkedIn / Adelaide bias)
  - All No Response dataset (0% interview rate test)

Status:
Week 4 – Presentation MVP completed.
Logic layer (Week 3) untouched.




















