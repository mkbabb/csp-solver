# W13 CRITIQUE LANE crit-perf — refute-by-default audit of b1 (boil first-principles) + b2 (low-res forensics)

Mandate: re-derive the cost-model claims against my own trace, verify the promoted-layer
mechanism by injection, check the pre-raster memory math honestly (N×M×bytes), refute weak
rankings. Read-only. Every verdict below is against a first-party re-derivation, not a re-read.

**Bottom line:** both lanes' CORE claims survive adversarial re-derivation — the Tier-1
heartbeat cost model is CONFIRMED against the raw `b1-test-g.json` trace to the event count,
and the promoted-layer low-res mechanism is CONFIRMED by my own inspection of b2's A/B
injection PNGs. Two secondary numbers are wrong and one is imprecise; the corrections do NOT
overturn either recommendation (P1-first, over-raster/pre-raster the toggle). convergence 90%.

---

## CONFIRMED — b1 Tier-1 heartbeat, against the raw trace (not the summary)

I histogrammed `b1-test-g.json` (all painters hidden + feTurbulence no-op'd) myself over its
~4.4s window:

| event | count | /s | b1 claim | verdict |
|---|---|---|---|---|
| Paint | **0** | 0 | "0 paints" | ✓ |
| RasterTask | **0** | 0 | (raster cheap/none) | ✓ |
| BeginMainThreadFrame | 433 | **98.4** | "98 main frames/s" | ✓ |
| FireAnimationFrame | 866 | **197** | "197 rAF fires/s" | ✓ |
| Commit | 503 | 113 | "503 commits/4.4s" | ✓ |

The idle page renders **zero pixels** yet schedules ~98 main frames/s forever. Mechanism
CONFIRMED at source: `node_modules/@mkbabb/pencil-boil/src/vue.ts:155`
(`rafId = schedulerRunning ? requestAnimationFrame(schedulerTick) : null`) re-arms every vsync
while any subscriber is enrolled, and the settled page holds exactly one — the
`boilBeat.ts:36` driver (`createBoilTicker(2, MOTION.beatMs, …)`, one module-level consumer).
`MOTION.beatMs = 125` (pencilConfig.ts:118) → 8 Hz beat. All CONFIRMED.

**Forensic REFINEMENT b1 under-states:** FireAnimationFrame (866) ≈ **2×** BeginMainThreadFrame
(433). That is TWO perpetual rAF loops, not one: pencil-boil's wrapped scheduler tick **plus**
the dev-only `recordLoop` (`src/pencil/dev/rafInstrumentation.ts:73-78`, `nativeRAF(recordLoop)`,
gated by `main.ts:5` `import.meta.env.DEV`). b1 names recordLoop but folds it into "the
heartbeat"; it is a **second, independent** vsync spinner. This matters for the P1 claim below.

---

## CONFIRMED — b2 promoted-layer low-res, by my own A/B inspection

I opened b2's injection pair myself. `static-promoted-1_6.png` (shipped `will-change: transform`,
scale 1.6, transition off): ray tips and outline strokes are visibly **soft/fuzzy**.
`static-unpromoted-1_6.png` (`will-change: auto`, everything else identical): **crisp** vector
strokes and sharp ray tips. Single-property toggle, static scale, motion isolated — the injection
is methodologically airtight and the blur delta is real to the eye. Mechanism (textbook Chrome:
a `will-change:transform` layer rasters once at native DPR2, then GPU up-samples the cached
texture — with `#wobble-celestial`'s `feDisplacementMap` baked into it — for any scale > 1.0)
CONFIRMED. Onset strictly at scale > 1.0 (edge crops), and the incoming icon rests at
`visibility:hidden` so the worst case "raster at 0.1 then 10× up" does NOT occur — CONFIRMED.

---

## CORRECTED — the pre-raster memory math omits the filter region (b1 §P3)

My explicit mandate. b1 sizes every pre-rastered pose to the element's **display box**. Wrong:
Chrome rasters a filtered element to its **filter region**, and `SvgFilters.vue:8-11`
(`filterRegion`) expands it by `margin` — `wobble-celestial` and `wobble-logo` both carry
`margin: 10` (pencilConfig.ts:219,207), so the region is **120% linear = 1.44× area**.

| surface | b1 (display box) | actual (region ×1.2 lin) | Δ |
|---|---|---|---|
| mascot 4×(416²) | 2.77 MB | 4×996 KB = **3.98 MB** | +44% |
| logo 4×(734×238) | 2.80 MB | 4×1.00 MB = **4.01 MB** | +43% |
| toggle icons + rays/sparkle | ~0.61 MB | ~0.9 MB | +44% |
| **P3 resident total** | **~6.1 MB** | **~8.6 MB** | **+40%** |

The grid precedent b1 quotes (26.7 MB = 4×1292²×4B — arithmetic CONFIRMED) is itself display-box
sized; grain-static is `margin:5` (110% → 1.21× area) → ~32 MB actual. Both understate by the
same class of factor, so b1's *relative* framing ("6.1 MB against the 26.7 MB the grid already
pays") is directionally right and the conclusion survives — but the honest N×M×bytes with the
filter-region factor is **~8.6 MB, not 6.1 MB**. Fix before it enters the spec. (Upper bound;
Chrome may trim fully-transparent margin, but turbulence-displaced content reaches near the
region edge so the trim is small.)

## CORRECTED — "test-g's 5.3% core was ALL heartbeat — P1 removes it" (b1 option 1)

The 5.3% is a **dev** number and conflates three sources: (i) pencil-boil scheduler-tick JS —
P1 (a `vue.ts` change) kills this; (ii) the dev-only `recordLoop` JS (~half the 866 rAF fires) —
P1 does NOT touch it, but it ships as zero (`import.meta.env.DEV` dead-code-eliminated); (iii)
the per-frame BeginMainFrame/Commit pipeline (98/s) — inherent to ANY perpetual rAF, persists
dev→prod, and P1 kills it. So P1 **is** the correct top lever and the *direction* is right, but
the single-cause "5.3% was all one thing" framing is wrong, and the actual prod floor is
**UNVERIFIABLE from a dev trace** (no prod build measured here). b1 already hedges "est. ~2.5–3%
prod" in §(a) — keep that hedge, drop the "5.3% ALL heartbeat" phrasing in the ranked options.

## CORRECTED (minor) — b2 spring overshoot peak

I evaluated `cubic-bezier(0.34,1.56,0.64,1)`: max eased-y = **1.0978** at t=0.582, so the
0.1→1.0 scale peaks at **1.088**, not b2's "1.09–1.10". Marginal overstate; still > 1.0, so the
up-sample and every downstream conclusion (option C out, lead with over-raster) stand.

## NIT — full-viewport damage dims

b1 writes "2880×1632 @DPR2" for a stated 1440×806 viewport; correct is **2880×1612** (806×2).
~1% on the 37.6M px/s figure. Immaterial; fix the digits.

---

## RANKINGS — no weak ranking to refute

b1 ranks P1 (retime the beat off vsync) highest-leverage. DEFENSIBLE and CONFIRMED: the idle
CPU is dominated by the heartbeat (measured 98 main frames/s + 197 rAF/s at **zero paint**),
against a raster/paint tier of only ~0.2–0.5% main-thread core + ~8 ms/s GPU. By idle main-
thread cost, P1 is correctly first. b2's finding is a QUALITY bug (not a perf cost) and its
B-then-D recommendation is coherent with the grain-hoist precedent. Nothing to overturn.

---

## Per-claim ledger

| claim | verdict |
|---|---|
| b1 Tier-1: perpetual rAF, 1 subscriber, 98 frames/s, 197 rAF/s, 0 paint | **CONFIRMED** (raw trace) |
| b1 two-rAF-loop attribution | **REFINED** (866≈2×433: lib scheduler + dev recordLoop) |
| b1 P3 resident GPU ≈ 6.1 MB | **CORRECTED** → ~8.6 MB (filter region ×1.44 area) |
| b1 grid 26.7 MB = 4×1292² | **CONFIRMED** arithmetic (display-box; ~32 MB w/ region) |
| b1 "5.3% ALL heartbeat, P1 removes it" | **CORRECTED** (dev-inflated; prod % UNVERIFIABLE) |
| b1 viewport damage 2880×1632 | **CORRECTED** → 2880×1612 (nit) |
| b1 P1-first ranking | **CONFIRMED** |
| b2 promoted layer low-res > scale 1.0 | **CONFIRMED** (own A/B inspection) |
| b2 rest at visibility:hidden, no 10× worst case | **CONFIRMED** (source) |
| b2 overshoot peak 1.09–1.10 | **CORRECTED** → 1.088 |
| b2 B/D recommendation | **CONFIRMED** (coherent w/ precedent) |

## convergence_pct arithmetic (from 100%)
- −5.0  P3 memory understated ~40% (the explicit honesty check my lane owns)
- −3.0  "5.3% ALL heartbeat / P1 removes it" conflation + unverifiable prod %
- −1.5  b2 overshoot peak overstate (1.088 vs 1.09–1.10)
- −0.5  viewport damage 1632 vs 1612 nit
- **= 90.0%**

## kill_list (strike/fix before these enter the W13 spec)
1. "P3 added steady GPU ≈ 6.1 MB" → **~8.6 MB** (filter region: margin-10 presets = 120% linear / 1.44× area; size poses to `filterRegion`, not the display box).
2. "test-g's 5.3% was ALL heartbeat — P1 removes it" → split the three sources; cite prod est ~2.5–3% (UNVERIFIABLE on the dev server), P1 removes the library scheduler + the per-frame pipeline, dev recordLoop ships as zero.
3. b1 "2880×1632" → **2880×1612**.
4. b2 "overshoot peaks around 1.09–1.10" → **1.088**.
