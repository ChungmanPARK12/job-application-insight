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

# Week 6 Roadmap (Productization Layer)

## Goal

Transform the insight engine from a functional system into a product-grade decision experience.

Shift focus:

- From **correctness** → to **clarity**
- From **data output** → to **user decision guidance**

---

## Day 26 — Decision Panel Integration (Completed)

### Summary

- Decision pipeline successfully connected to UI
- Primary decision, reasoning, action, outcome, and confidence exposed
- End-to-end decision flow validated

---

## Day 27 — Language & Interpretation Layer(Completed)

### Goal

Convert system-generated output into clear, user-readable decision language

### Tasks

- Map raw pattern types to human-readable explanations
- Refine decision and outcome phrasing
- Improve confidence tone (e.g., "Medium confidence" → more contextual wording)
- Replace or remove mechanical labels (e.g., "Direction: increase")
- Eliminate redundant or repetitive phrasing

### Expected Outcome

- Decision panel reads like a human recommendation, not a system log

---

## Day 28 — UI Structure & Visual Hierarchy

### Goal

Improve readability and scan-ability of the decision panel

### Tasks

- Refine layout spacing and grouping
- Improve card structure (padding, borders, visual separation)
- Emphasize key sections:
  - Decision (primary focus)
  - Action (clear steps)
- Convert execution steps into structured visual format (numbered or timeline)
- Style confidence as a badge or visual indicator

### Expected Outcome

- Users can understand the decision within a few seconds

---

## Day 29 — Insight Simplification Layer

### Goal

Reduce cognitive load by showing only the most relevant signals

### Tasks

- Limit supporting signals to top 2–3 items
- Filter out weak or low-impact signals
- Enforce concise "Why this matters" summary (1–2 sentences)
- Consider optional expansion (e.g., "Show more")

### Expected Outcome

- Cleaner, more focused decision output
- Reduced information overload

---

## Day 30 — Narrative Consistency & Flow

### Goal

Ensure the decision panel reads as a single coherent narrative

### Tasks

- Validate logical flow:
  - Decision → Why → Action → Outcome
- Ensure consistency between reasoning and recommended actions
- Align outcome expectations with confidence level
- Adjust tone for consistency across all sections

### Expected Outcome

- Decision panel feels like a single, unified recommendation

---

## End of Week 6 State(Completed)

- Decision system is not only functional but **usable and intuitive**
- Output is:
  - Clear
  - Concise
  - Actionable
- System behaves like a **decision-making assistant**, not just an analytics tool

# Week 7 Roadmap (Algorithmic Intelligence Layer)

## Goal

Upgrade the decision engine from a rule-based system into a more advanced, algorithm-driven intelligence layer.

Shift focus:

- From **rule-based filtering** → to **algorithmic prioritization**
- From **static logic** → to **adaptive decision modeling**
- From **basic signals** → to **structured, high-quality insights**

---

## Day 31 — Signal Deduplication Engine

### Goal

Reduce redundancy by merging similar or overlapping signals into a single, meaningful insight.

### Tasks

- Define grouping keys for similar patterns
- Implement deduplication logic (e.g. same dimension or semantic overlap)
- Select a representative signal from each group
- Preserve important metadata (score, confidence, metrics)

### Expected Outcome

- Cleaner supporting signals
- Reduced repetition in the decision panel
- More concise and meaningful insights

---

## Day 32 — Advanced Ranking Logic

### Goal

Improve prioritization by introducing multi-factor ranking instead of relying on a single score.

### Tasks

- Design a weighted ranking model using:
  - score
  - confidence
  - sample size
  - pattern strength
- Normalize and combine multiple factors
- Replace simple sorting with composite ranking logic

### Expected Outcome

- More accurate prioritization of signals
- Better alignment between importance and visibility
- Stronger decision relevance

---

## Day 33 — Confidence Calibration

### Goal

Make confidence more reliable and explainable by incorporating multiple contributing factors.

### Tasks

- Decompose confidence into:
  - sample sufficiency
  - signal consistency
  - pattern strength
- Design a calibration function to combine factors
- Adjust confidence labels based on calibrated values

### Expected Outcome

- More trustworthy confidence levels
- Better alignment between data quality and system output
- Improved interpretability of decisions

---

## Day 34 — Outcome Projection Upgrade

### Goal

Enhance outcome predictions using structured logic instead of static messaging.

### Tasks

- Introduce a decision impact matrix:
  - pattern type
  - confidence level
  - pattern strength
- Adjust outcome direction and magnitude dynamically
- Refine expected improvement messaging

### Expected Outcome

- More realistic and data-aligned outcome projections
- Better consistency between decision and expected results
- Stronger user trust in predictions

---

## Day 35 — Explanation Consistency Engine

### Goal

Ensure all parts of the decision panel follow a consistent narrative structure.

### Tasks

- Align terminology across:
  - Decision
  - Why
  - Action
  - Outcome
- Implement template-based explanation generation
- Enforce consistent use of key concepts (e.g. conversion, distribution, targeting)

### Expected Outcome

- Fully coherent decision narrative
- Improved readability and flow
- Output feels like a unified recommendation

---

## End of Week 7 State

- Decision engine is no longer purely rule-based
- System incorporates structured algorithms for:
  - ranking
  - filtering
  - confidence modeling
  - outcome projection
- Output is:
  - More precise
  - More reliable
  - More scalable

System evolves from a **rule-based assistant** into an **algorithmic decision engine**
