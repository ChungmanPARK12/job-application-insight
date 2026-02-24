<!-- docs/insight-engine-v2-design.md -->

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