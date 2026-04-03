<!-- docs/insight-engine-v2-design.md -->
## [2026-02-24]

# Insight Engine v2 — Design Draft

Version: v2.0 (Draft)  
Date: 2026-02-24  
Status: Experimental thresholds

---

## Philosophy

- Week 3 stats remain untouched.
- v2 reads existing stats and detects statistical patterns.
- No deterministic claims.
- Output structure: Fact → Boundary → Reflection.
- Max 2 insights surfaced.

---

## Global Guardrails

- applications < 20 → Silence Mode
- applications ≥ 30 → Weak eligible
- applications ≥ 50 → Strong eligible

Silence Mode:
> Dataset not yet sufficient for meaningful pattern detection.

---

## Core Patterns (v2.0)

### 1) Conversion Imbalance
- Weak: applications ≥ 30 AND response_rate ≤ 7%
- Strong: applications ≥ 50 AND response_rate ≤ 4%

---

### 2) Distribution Concentration
- Weak: dominant_ratio ≥ 65%
- Strong: dominant_ratio ≥ 80%
- Requires ≥ 2 categories

---

### 3) Target Narrowness
- Weak: dominant_keyword_ratio ≥ 75%
- Strong: dominant_keyword_ratio ≥ 90%
- Requires ≥ 2 keyword groups

---

## Output Rules

- Weak → Fact + Boundary
- Strong → Fact + Boundary + Reflection
- Never infer skill or qualification level.
- Never prescribe actions.

---

## Layer Model

Week3 Stats  
→ Pattern Detection (3 types)  
→ Strength Filter  
→ Narration Layer  

---

End of Day1 specification.

## Day2 — Pattern Object Spec (Flexible Metrics)

### Pattern Types
- conversion_imbalance
- distribution_concentration
- target_narrowness

### Strength
- weak | strong

### Pattern Object (Draft)
```ts
export type PatternType =
  | "conversion_imbalance"
  | "distribution_concentration"
  | "target_narrowness";

export type PatternStrength = "weak" | "strong";

/**
 * Flexible metrics per pattern type.
 * v2 uses pattern objects as the bridge between Stats → Narration.
 */
export interface Pattern {
  type: PatternType;
  strength: PatternStrength;

  /** Pattern-specific numeric metrics used for narration (Fact-first). */
  metrics: Record<string, number>;

  /**
   * 0..1 confidence score.
   * v2.0 may use a simple heuristic; later versions can refine weighting.
   */
  confidence: number;

  /**
   * Optional metadata (non-numeric) for narration support (e.g., dominantCategory).
   * Kept optional to avoid bloating v2.0.
   */
  meta?: Record<string, string>;
}