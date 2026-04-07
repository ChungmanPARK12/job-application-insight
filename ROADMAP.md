# Project Roadmap — Process A (v1)

## Week 1 — Foundation

- Project initialized and pushed to GitHub
- Process A domain structure created
- v1 CSV schema & status normalization defined
- Documentation for scope, assumptions, and non-goals prepared

## Week 2 — Data Ready

- CSV upload
- Parsing & normalization
- Basic statistics

## Week 3 — Insight Engine

- Rule-based pattern detection
- Insight phrasing templates

## Week 4 — Presentation

- Minimal UI
- Documentation polish

## [2026-02-23] — Insight Engine v2 Design Plan

WORK MODE — Reflection Engine Architecture Planning

### Week 1 — Pattern Detection Layer

Day 1 — Pattern Specification

- Defined 3 core patterns:
  - Conversion Imbalance
  - Distribution Concentration
  - Target Narrowness
- Drafted threshold rules
- Defined sample size guardrails
- Defined Weak / Strong strength criteria

Day 2 — Pattern Object Structure

- Designed pattern return object structure
- Standardized fields: type, strength, metrics, confidence

Day 3 — Pattern Detection Engine

- Designed detection flow:
  stats → detectPatterns() → pattern[]
- Separated Week3 stats from v2 logic

Day 4 — Statistical Guardrails

- Added sample size suppression rule
- Defined Silence Mode conditions
- Prevented low-confidence pattern surfacing

Day 5 — Internal Scenario Testing

- Tested 0 / 1 / 2 / 3 pattern scenarios
- Validated suppression logic
- Confirmed max pattern exposure rule

---

### Week 2 — Reflection Layer

Day 6 — Insight Template System

- Designed Fact → Boundary → Reflection structure
- Created pattern-specific narrative templates

Day 7 — Strength-Based Output Control

- Weak → Fact + Boundary
- Strong → Fact + Boundary + Reflection

Day 8 — Stage Layer Integration

- Added stage-aware tone adjustment
- Maintained statistical neutrality
- Confidence nuance

Day 9 — Insight Prioritization Logic

- Strong patterns prioritized
- Max 2 insights exposed
- Overload prevention rule added

Day 10 — Final Integration & Refactor

- Layer separation finalized:
  - Week3 (Observation)
  - Pattern Detection
  - Reflection Engine
- Architecture stabilized for future expansion

### Week 3 — Productization Layer

Day 11 — Engine Result Contract Expansion

- Extended `InsightEngineResult` output contract
- Included:
  - stats
  - patterns
  - narratives
- Stabilized unified engine entry via `buildInsightEngineResult`

Day 12 — CSV → Insight Pipeline Integration

- Connected CSV ingestion → stats pipeline → insight engine
- Established end-to-end flow:
  - CSV upload
  - stats generation
  - pattern detection
  - narrative generation
- Verified pipeline output consistency

Day 13 — Insight Panel UI (Next.js)

- Created initial Insight display components
- Rendered:
  - Fact
  - Boundary
  - Reflection (conditional)
- Displayed max 2 insights based on prioritization rules

Day 14 — Insight Metadata & UX Layer

- Added supporting metadata to insight output:
  - pattern_type
  - strength
  - confidence
  - stage
- Enabled UI labels and contextual indicators

Day 15 — Product Integration & UI Flow

- Built basic product workflow:
  - CSV upload → Insight analysis → Insight panel
- Verified stable UI rendering with real dataset
- Prepared structure for future improvements

Level 1 — Statistics
Level 2 — Pattern detection
Level 3 — Insight
Level 4 — Diagnosis
Level 5 — Recommendation

### Week 4 — Decision Layer

Day 16 — Insight Scoring System

- Introduced scoring dimensions:
  - impact
  - urgency
  - consistency
  - confidence (existing)
- Designed weighted scoring formula:
  - finalScore = weighted sum
- Enabled quantitative evaluation of patterns

Day 17 — Insight Ranking System

- Implemented sorting based on finalScore
- Maintained max 2 insight exposure rule
- Improved prioritization accuracy
- Reduced low-value insight noise

Day 18 — Action Generator

- Designed `InsightAction` schema:
  - title
  - description
  - priority
- Implemented pattern → action mapping logic
- Enabled actionable recommendations per insight

Day 19 — Trend Analysis Layer

- Introduced time-based comparison:
  - recent vs previous window
- Added:
  - trend direction (up / down / flat)
  - delta value
- Enabled change detection in performance metrics

Day 20 — Insight Card v2 (UI Upgrade)

- Redesigned Insight UI structure:
  - Pattern badge
  - Narrative (Fact / Boundary / Reflection)
  - Trend indicator
  - Action list
  - Confidence / Score display
- Improved readability and decision clarity
- Integrated metadata-driven UI rendering

## WORK MODE — Week 5 Planning (Decision Product Layer)

### Objective

Transform the system from:

- Insight generation (analysis)
  → to
- Decision support (actionable guidance)

Goal:
Eliminate interpretation burden and guide user actions directly.

---

## Week 5 — Decision Product Layer

### Day 21 — Decision Sentence Layer

**Goal**

- Convert insights into clear decision statements

**Key Changes**

- Introduce `Decision` schema
- Map pattern → decision message
- Shift tone:
  - descriptive → directive

---

### Day 22 — Primary Decision System

**Goal**

- Expose only one primary decision

**Key Changes**

- Select top 1 insight (highest score)
- Introduce:
  - `primaryDecision`
  - `supportingSignals`
- Reduce cognitive load

---

### Day 23 — Decision Confidence Layer(Completed)

**Goal**

- Make decision reliability explicit

**Key Changes**

- Convert confidence → user-facing label
  - High / Medium / Low
- Add reasoning:
  - sample size
  - signal stability

---

### Day 24 — Action → Execution Plan

**Goal**

- Transform actions into step-by-step plans

**Key Changes**

- Replace loose actions with structured steps
- Add execution sequence logic

---

### Day 25 — Outcome Projection

**Goal**

- Show expected impact of decisions

**Key Changes**

- Introduce:
  - expected improvement
  - directional outcome

---

### Day 26 — Decision UI v1

**Goal**

- Replace Insight Card → Decision Panel

**Structure**

- Primary Decision
- Why this matters
- What to do
- Expected outcome
- Confidence

---

## Structural Shift

### Week 4 (Completed)

Pattern → Score → Narrative → Card

### Week 5 (New)

Pattern → Decision → Plan → Outcome

---

## Design Philosophy Change

- Inform → Guide
- Describe → Decide
- Multiple signals → Single focus
- User interprets → System recommends
