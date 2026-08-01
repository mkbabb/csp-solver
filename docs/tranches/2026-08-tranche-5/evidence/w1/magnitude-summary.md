# T5-W1.9 — CH-42 magnitude sample: the summary table

**Protocol**: `magnitude-rule.md`, pre-registered and banked **before** the first sample.
**Raw**: `magnitude-runs-w1.txt`, `magnitude-runs-w4.txt` (one JSONL row per attempt).
**Instrument check**: `magnitude-probe-pilot.txt` (excluded from the sample, per rule §3.2).
**Probe**: `web/frontend/e2e/magnitude-reporter.mjs` — a reporter, not a gate; no spec,
config, floor or baseline was touched to take this sample.

Tree `f38c5130` · darwin · node v26.0.0 · Playwright 1.56.1 · chromium (the golden config's
sole engine) · against `web/frontend/dist` built 2026-08-01 15:23, served by a `vite preview`
on **:4188** started and killed by this lane. Arms sequential, w=1 then w=4, one host, one
session. 2026-08-01T20:26–20:28Z. n = 25 per (golden × arm); **100 attempts, 100 measured
ratios, zero missing** — rule §5.1 E-3 and E-4 both clear.

---

## 1 · The table

Ratios exact: (differing pixels) / (baseline pixels, from the baseline's own IHDR).
`toggle-crest-dark-darwin.png` 220×220 = **48,400 px** · `logo-light-darwin.png` 768×226 =
**173,568 px**. Percentiles nearest-rank at n=25 (p50 = 13th, p90 = 23rd, p95 = 24th).

| golden | arm | p50 | p90 | **p95** | max | min | **≥ 0.017** | **≥ 0.05** |
|---|---|---|---|---|---|---|---|---|
| `toggle-crest-dark` | **workers=1** | 0.021240 | 0.021240 | **0.021240** | 0.021240 | 0.013285 | **22 / 25** | 0 / 25 |
| `toggle-crest-dark` | **workers=4** | 0.000000 | 0.013988 | **0.021240** | 0.021240 | 0.000000 | **2 / 25** | 0 / 25 |
| `logo-light` | **workers=1** | 0.000000 | 0.000000 | **0.000000** | 0.000000 | 0.000000 | **0 / 25** | 0 / 25 |
| `logo-light` | **workers=4** | 0.000000 | 0.000000 | **0.000000** | 0.000000 | 0.000000 | **0 / 25** | 0 / 25 |

Secondary — the stabilization spread (`worstRatio`, the worst capture inside an attempt):

| golden | arm | p95 | max | ≥ 0.017 | attempts whose captures disagree | mean captures/attempt |
|---|---|---|---|---|---|---|
| `toggle-crest-dark` | workers=1 | 0.024669 | 0.024669 | **25 / 25** | 24 / 25 | 5.12 |
| `toggle-crest-dark` | workers=4 | 0.025083 | 0.025083 | 5 / 25 | 7 / 25 | 2.12 |
| `logo-light` | both | 0.000000 | 0.000000 | 0 / 50 | 0 / 50 | 1.00 |

## 2 · The crest lands on a handful of discrete rasters, not a noise cloud

Verdict-capture pixel counts, tallied:

| arm | 0 | 643 | 677 | 1028 | — as ratios |
|---|---|---|---|---|---|
| workers=1 | 0 | 3 | 0 | **22** | 0 · 0.013285 · 0.013988 · **0.021240** |
| workers=4 | **18** | 2 | 3 | 2 | |

Across *all* captures (verdict + stabilization retries) the crest occupies exactly seven
states and no others: **0 · 375 · 643 · 677 · 1028 · 1194 · 1214 px** = 0 · 0.007748 ·
0.013285 · 0.013988 · **0.021240** · **0.024669** · 0.025083. `logo-light` occupies one:
**0**, on all 50 attempts and all 50 captures — byte-for-byte identical to its baseline
under an assertion at `maxDiffPixelRatio: 0`.

**The instrument corroborates the record exactly.** The campaign's two banked crest
magnitudes — 1,028 px and 1,194 px (`F3/final/goldens-head-1.log:18,35`) — both reappear
here verbatim, and Playwright's ceiled "0.03" resolves to **0.021240** and **0.024669**.
Both sit inside the blind band [0.017, 0.05): red at the darwin soul floor, green on the
only platform CI runs. The band is now measured, not inferred.

## 3 · Classification — rule §5 applied mechanically

| golden | P1 (p95 @ w=1) | P4 (p95 @ w=4) | modality (pooled n=50) | **class** | candidate carried to W5 |
|---|---|---|---|---|---|
| `toggle-crest-dark` | 0.021240 (> 0.019) | 0.021240 (> 0.019) | **BIMODAL** | **C — REAL-DRIFT (settle)** | Tighten the crop onto the disc core per the clause the spec already describes; re-run this same harness. **No re-baseline** |
| `logo-light` | 0.000000 (< 0.015) | 0.000000 (< 0.015) | unimodal | **A — NOISE-REFUTED (no drift at HEAD)** | Close its half of CH-42 as not-reproducible-at-HEAD. Floors, clause and baselines stand |

The two goldens are classified independently, as §4 requires. They disagree, and the
disagreement is not reconciled here.

No exclusion fired: 25/25 ratios per cell (E-3 clear), no silent row (E-4 clear), no p95 in
[0.015, 0.019] (E-1 clear), no ratio anywhere ≥ 0.05 (E-5 clear), P4 not below 0.015 (E-2
clear).

**Modality, disclosed rather than smoothed.** The pooled gap that trips the pre-registered
BIMODAL test sits between the **18 zero-observations and everything above**
(0 → 0.013285, gap 0.013285 ≥ 0.010, 18 below and 32 above). Those 18 zeros are almost
entirely the w=4 arm's. *Within* the w=1 arm the two occupied states 643 and 1028 px are
0.007955 apart — **below** the 0.010 gap threshold, so w=1 alone would not have been called
bimodal. The rule specifies the pooled test and the pooled test says BIMODAL; that is the
classification of record. W5 should read this paragraph before acting on branch C.

## 4 · The load hypothesis is refuted, and in the opposite direction

The standing hypothesis (`open-rows:242`) was that concurrency drives the crest's flake.
The measurement inverts it: **the loaded arm is the quiet one.**

- w=1: **0 / 25** attempts byte-identical; 22/25 verdicts at 0.021240; captures disagree
  within 24/25 attempts; 5.12 captures per attempt.
- w=4: **18 / 25** attempts byte-identical; captures disagree within 7/25; 2.12 captures per
  attempt.

Under load the crest settles *more* often, not less. Pinning `workers: 1` — estate §3.5's
first candidate — would therefore have made this golden **worse**, and the pre-registered
matrix correctly refuses to reach for it (branch B requires `P1 < 0.015`, and P1 is
0.021240). That refusal is the instrument earning its keep: the intuitive cure was the
wrong one, and a rate could never have shown it.

## 5 · Reconciliation with the historic 23.9% — a caveat, not a decision input

Report mode asserts at ratio 0, so no capture ever passes and the probe records the
**first** stabilized capture. The real gate asserts at 0.017, so its stabilization loop
stops at the first capture that *passes* — the gate effectively takes the best of several
captures, where the probe takes the first. The probe's `≥ 0.017` counts are therefore an
**upper bound** on the gate's red rate, not an estimate of it.

Derived from the same rows (secondary, and explicitly not a §5 input): attempts in which
**every** capture sat at or above 0.017 — the shape under which the live gate would have
red — are **3/25 (12%) at w=1** and **0/25 at w=4**. That is the same order as the pooled
historic **16/67 = 23.9%**, which additionally carries `logo-light` reds and the mint-window
runs. The record and the instrument agree.

## 6 · What this row did not do

No baseline was re-minted, re-pathed or touched — `e2e/goldens/` is byte-identical to HEAD.
No floor was changed: `SOUL_FLOOR` 0.017 and the linux clause floor 0.05 stand exactly as
found. No engine was added to the golden config. No n-run CI sampling on the ubuntu lane is
proposed (ruling G-5 — it remains a null instrument for this row). No cure landed.

**No CI fragment ships from row 1.9, and that is a position, not an omission.** CH-41's
lane already exists and is wired (`ci.yml:561`, job `frontend` — `ch41-lint-ink-local.txt`
banks the local run; its runner run-id is read from the field at seal). CH-42's instrument
is a **local darwin** harness by ruling G-5: the only CI form that could inform it is a
`macos-latest` golden lane, and proposing an ubuntu n-run job would re-commit the exact
error this row exists to correct. The integrator lane should expect nothing from 1.9 in
`fragments/`.

**W1 owns the number. W5 owns the disposition.**
