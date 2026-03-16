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

## [2026-02-26]

### Day 2 — Pattern Object Structure
- Designed pattern return object structure
- Standardized fields: type, strength, metrics, confidence
- Preparing Day 3 Working, detailed in insight-engine-v2.md

## [2026-02-27]

### Day 3 — Pattern Detection Engine (Core v2)

### Insights
- Introduced `Pattern` type contract for Insight Engine v2
- Added new core pattern detector: `detectCorePatterns.ts`
- Implemented 3 statistical core patterns:
  - Conversion Imbalance
  - Distribution Concentration
  - Target Narrowness
- Applied guardrail thresholds (30 / 50 sample logic)
- Preserved existing Week3 stats and delta-based pattern detection (no breaking changes)

### Debugging & Validation
- Build verification: `npm run build` completed successfully (no TypeScript errors)
- Runtime validation: `detectCorePatterns` executed against real stats output
- Confirmed 3 strong patterns detected under test dataset:
  - Conversion Imbalance (60 applications, 3% interview rate)
  - Distribution Concentration (91.6% in single location)
  - Target Narrowness (96.6% single keyword dominance)
- Verified:
  - Threshold logic applied correctly
  - Confidence scoring (0.8 for 50+ samples) working as expected
  - Meta fields (dominant_dimension, dominant_category, dominant_keyword) populated correctly

### Next Step
- Max 2 exposure + Strong priority array
- Silence mode and Narrations connect, Fact -> Boundary -> reflection

## [2026-03-02]

### Day 4 — Statistical Guardrails

### Insights
- Added Silence Mode guardrail in `detectCorePatterns` (returns `[]` when overall sample size is below threshold)
- Limited surfaced core patterns to max 2 (`slice(0, 2)`)

### Debugging & Validation
- Runtime verified `detectCorePatterns` now outputs `Array(2)` (previously `Array(3)`)
- Confirmed prioritization works as intended:
  - Conversion Imbalance + Distribution Concentration surfaced
  - Target Narrowness suppressed due to max exposure rule

### Day 5 — Internal Scenario Testing

- Added multi-scenario mock tests for `detectCorePatterns`
- Verified Silence Mode (<20 samples)
- Validated weak/strong boundary thresholds (30/50 samples, 7%/4%, 65%/80%, 75%/90%)
- Confirmed max-2 exposure rule under 3-strong scenario
- No unexpected false positives observed

### Day 6 — Fact, Boundary, Reflection

- Implemented neutral narrative structure (Fact → Boundary → Reflection)
- Added pattern-specific templates:
  - Conversion Imbalance
  - Distribution Concentration
  - Target Narrowness
- Connected `detectCorePatterns` → `narrateCorePatterns`
- Verified narrative output across test scenarios

### Day 7 — Strength-Based Output Control
- Weak patterns output Fact + Boundary only (reflection omitted); strong patterns include reflection

## [2026-03-06]

### Day 8 — Stage Layer Integration
- Added stage-aware boundary tone in `narrateCorePatterns`
- Applied confidence nuance without exposing numeric confidence
- Fixed `applications` propagation in `detectCorePatterns`
- Verified early / mid / late narrative boundary behavior

### Day 9 — Insight Prioritization Logic
- Strong patterns prioritized
- Max 2 insights exposed
- Overload prevention rule added

## [2026-03-09]

### Day 10 — Final Integration & Refactor
- Added unified insight engine entry with `buildInsightEngineResult`
- Kept layer boundaries clear across stats, detection, and narration
- Verified integrated pattern → narrative flow with debug cases

## [2026-03-10]

### Day 11 — Engine Result Contract Expansion
- Extended `InsightEngineResult` to include `stats`
- Verified unified engine output: stats, patterns, narratives
- Confirmed integrated debug flow through `buildInsightEngineResult`

### Day 12 — CSV → Insight Pipeline Integration
- Added `runInsightPipeline` as the unified CSV → Insight orchestration entry
- Connected CSV parsing, stats generation, and insight engine
- Returned full pipeline result including records, stats, patterns, and narratives

### Day 12 — Pipeline Interaction Insight
- Added interaction insight generation to `runInsightPipeline`
- Connected combined pattern interpretation after core insight detection
- Verified pipeline structure for future UI rendering

## [2026-03-12]

### Day 13 — Insight Panel UI

- Refactored insight presentation into reusable components (`InsightPanel`, `InsightCard`) and connected them to the pipeline output while maintaining the prioritized narrative structure.

## [2026-03-12]

### Day 14 — Insight Metadata & UX Layer

- Added metadata fields to insight narratives:
  - `confidence`
  - `stage`
- Converted pattern confidence score → UI confidence label (low / medium / high)
- Extended `InsightNarrative` contract to include metadata
- Updated `narrateCorePatterns` to attach metadata during narrative generation
- Enhanced Insight UI:
  - Displayed `strength`, `confidence`, and `stage` badges in Insight cards
- Verified metadata propagation through the full pipeline:
  - pattern detection → narrative generation → UI rendering

























