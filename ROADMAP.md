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
