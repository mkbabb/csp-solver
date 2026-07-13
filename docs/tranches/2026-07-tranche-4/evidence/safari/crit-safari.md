# crit-safari — REFUTE-BY-DEFAULT audit of s1 / s2 / s3

**Bottom line:** the *diagnosis and the fix survive*; two of the three headline
**numbers do not**. The mechanism (WebKit re-rasters a filtered SVG on every beat
flip; the board-area grid grain-hoist is the dominant surface; the bitmap pose cache
removes it) is reproduced first-party. But s1's "624% GPU / 6–7 cores pinned" is a
`ps pcpu` decaying-average **inflation of ~3×** (true interval ≈ 208% ≈ 2 cores,
matching s1's own real-Safari 194%), and s3's "SSIM 1.0000, capture is the filter's
own output, equality release-gate" is **empirically false in WebKit** (capture ≠ live:
93.6% exact, maxΔ 221). Status: **partial**, convergence **66%**. The recommendation
(bitmap pose cache) ships; three corrections attach to it.

Rig: fresh `npm run build` of `65425697` (verified `git rev-parse` = 65425697), served
by `vite preview --port 4321` (owner's :3001 untouched; :4320 was already occupied, left
alone). playwright webkit-2311 / chromium, DPR1 and DPR2 as noted. Machine under real
load the whole session (loadavg 8–22 on 18 cores) — flagged per arm. Recipes banked
beside this file: `crit-method-ab.mjs` (the ps-vs-top adjudication), `crit-identity.mjs`
(capture-vs-live pixel diff), plus reused `s2-fixtures/dist-ab.mjs`, `s1-run.mjs`,
`s2-fixtures/one-case.mjs`.

---

## What I re-derived (first-party reruns)

### 1. Mechanism — CONFIRMED (reproduced)
`dist-ab.mjs` on my :4321 (WebKit DPR1, `top -l` interval, own pids only), loadavg 13.7:

| state | idle CPU% (mine) | s2 reported |
|---|---|---|
| A — boils live | **88.9** | 100 |
| B — `filter:none`, beat still flips | **3.1** | 2.7 |
| C — timers cleared | 0 | 0 |

Filter-raster attribution **85.8%** (mine) vs s2's 97.3% — same decisive collapse. The
per-beat live-filter re-raster **is** the idle cost. (My filteredElements=74 vs s2's 63
— light-state difference, immaterial.) **CONFIRMED.**

### 2. Grid is the dominant surface — CONFIRMED (reproduced, in isolation)
`s1-run.mjs webkit attribution` against :4321, DPR2, **no concurrent lanes**:

| arm | fps | CPU% (ps pcpu) |
|---|---|---|
| baseline (all boil) | 9.9 | 669 |
| − grid grain-hoist | **59.3** | **46.7** |
| ALL boil off | 60.1 | 9.8 |
| PRM (beat frozen) | 60.1 | 2.5 |

Hiding only `.boil-frame-layer` restores 60 fps and drops cost to the floor — the
grid-is-93% attribution holds. **I initially suspected s1's magnitude was concurrent-lane
contamination; it is not — it reproduces isolated.** The magnitude problem is a
different bug (see #4). **CONFIRMED.**

### 3. will-change:opacity inversion — CONFIRMED (reproduced)
`one-case.mjs`, flip-opacity + will-change + logo size, clean slate:

| engine | CPU% (mine) | s2 reported |
|---|---|---|
| WebKit | **10.3** | 9.8 |
| Chromium | **0.5** | 0.5 |

~20× gap on the same DOM. The property that makes the boil free in Chrome makes it most
expensive in WebKit — you cannot tune one property to satisfy both. This validates s3's
rejection of the "just slow the beat / fewer poses" stopgaps. **CONFIRMED.**

### 4. s1's "624% / 6–7 cores" — CORRECTED (it is a `ps pcpu` artifact, ~3× inflated)
The decisive rerun. `crit-method-ab.mjs`: ONE clean WebKit DPR2 idle page, **same
window, same pids**, sampled two ways:

| method | total CPU% | GPU proc |
|---|---|---|
| **`ps -o pcpu`** (s1's method) | **646.5** | 641.3 |
| **`top -l 2 -s6`** interval (s2's method) | **208.5** | — |

`ps pcpu` is a **decaying lifetime average**, inflated by the page-load / draw-in raster
burst; it is not instantaneous CPU. True interval work at idle is **208%**, and that
**matches s1's own real-Safari cross-check (194.5% avg)** — which s1 hand-waved as
"window not pinned to DPR2." It wasn't the window; it was the sampling method. The honest
figure is **~2 cores continuously**, not 6–7. Every "624%", "−546", "6–7 cores pinned"
in s1 is the inflated number. **The relative attribution is unaffected** (both methods
agree grid dominates); only the absolute core count is wrong.

### 5. The fps severity — CONFIRMED real, mechanism RE-EXPLAINED
s1 frames 4.6 fps as "the GPU saturated across 6 cores starves rAF." With total CPU only
~2 cores, that causal story is wrong. The correct mechanism, from s2's own per-raster
scaling (~7 ms for the 734×238 logo at DPR1): the **board-area grid** (~1200×1200 =
8× the logo's area) at DPR2 (×4) is a **single serial filter raster of ~150–224 ms per
beat**, on the critical frame path. A 200 ms raster per beat = ~5 fps *by latency*, not
by core saturation — which is exactly why total CPU stays ~2 cores while fps collapses.
The single-digit idle fps is **real and reproduced isolated (9.9 fps)**; only its
attribution-to-core-count was wrong. (Absolute fps varies with machine load — 4.6 under
the heavier concurrent run, 6.7–9.9 in mine — but single-digit stands.)

### 6. Identity claim — REFUTED in WebKit, CONFIRMED in Chrome
s3's load-bearing claim: the bitmap "is the filter's own output, captured, so identity is
exact (SSIM 1.0000 by construction)... an equality check, not the 0.98 floor. Any pose
< 1.0 means the serialization dropped a def — a bug." s3 **never tested capture-vs-live**;
its fixture only tested capture-vs-capture (determinism), untaint, and distinctness.
`crit-identity.mjs` screenshots the **live on-screen filtered element** and pixel-diffs
it against the serialize→blob→drawImage capture, DPR2:

| engine | exact-match px | within±2 | mean Δ/ch | **max Δ/ch** | diff px |
|---|---|---|---|---|---|
| **Chromium** | **100%** | 100% | 0 | **0** | 0 |
| **WebKit** | **93.6%** | 94.8% | 1.59 | **221** | 14 745 (6.4%) |

In Chrome the capture is byte-identical to the live render — s3's claim holds there. In
**WebKit it does not**: 6.4% of pixels differ, some by 221/255 — a ~1px displacement-edge
misregistration between WebKit's canvas-image filter path and its on-screen compositor
path. So in the target engine the bitmap swap **does shift ~6% of edge pixels vs the
shipped live render**, and s3's "SSIM 1.0000 equality gate, sub-1.0 == bug" would raise a
**false bug** on every pose. The release gate must use a tolerance floor (≥0.98), not
equality. This does not break the fix (steady state is capture→capture, deterministic and
distinct per pose; the user sees the divergence only at the one bake-completion swap) —
it breaks the *claim of exactness* and the *gate spec*.

### 7. Memory arithmetic — CONFIRMED
Independently recomputed: grid 1200×1200×4 = 5.76 MB ×4 = 23.04; logo 1468×476×4 =
2.795 ×4 = 11.18; celestial 160×160×4 = 0.1024 ×8 = 0.82. Total **35.04 MB** (decimal
MB; ~33.4 MiB). s3's ≈35 MB is correct. (Minor: "Chrome already holds these as compositor
tiles, so it's not new cost" is loose — Chrome may discard hidden-layer tiles — but the
order of magnitude is right and the trade stands.)

---

## Per-claim verdicts

| # | claim | source | verdict |
|---|---|---|---|
| 1 | filter re-raster on beat = the cost; filter:none collapses idle | s1/s2/s3 | **CONFIRMED** |
| 2 | grid grain-hoist ≈ 93% of the boil cost | s1/s3 | **CONFIRMED** |
| 3 | idle is single-digit fps in WebKit DPR2 | s1/s3 | **CONFIRMED** |
| 4 | 624% GPU / 6–7 cores pinned | s1 | **CORRECTED** → ~208% top / 194% Safari ≈ 2 cores |
| 5 | causal: "GPU saturated across cores starves rAF" | s1 | **CORRECTED** → 150–224ms serial board-area raster/beat = latency, not core count |
| 6 | will-change:opacity ~20× worse in WebKit | s2 | **CONFIRMED** (10.3 vs 0.5) |
| 7 | resident filtered stacks at rest cost 0 | s2 | **PLAUSIBLE** (inherits from mechanism; not re-run) |
| 8 | scheduler parks correctly (125ms beat, no runaway) | s2 | **PLAUSIBLE** (not re-run; consistent with 0.8.1) |
| 9 | bitmap capture == live, SSIM 1.0000 by construction, equality gate | s3 | **REFUTED (WebKit)** / CONFIRMED (Chrome) |
| 10 | cross-engine parity gate: bitmap == Chrome reference in both, SSIM 1.0 | s3 | **REFUTED** — unachievable (WebKit capture ≠ WebKit live; feTurbulence differs across engines) |
| 11 | unify > gate also erases Chrome's residual ~8/s tile churn | s3 | **REFUTED** — s1's own Chromium control is flat 120fps / ~0% GPU / 0 jank idle; no measurable Chrome cost to erase |
| 12 | ≈35 MB resident bitmap memory | s3 | **CONFIRMED** |
| 13 | **recommendation: bitmap pose cache removes the WebKit cost** | s3 | **CONFIRMED it survives** (isolated −grid: cost→floor, 60fps) |

## Proxy / noise checks (the mandated attacks)
- **playwright-webkit vs real Safari:** s1's real-Safari GPU (194.5%) ≈ my playwright
  `top` interval (208.5%) — the proxy is *valid for CPU magnitude*, and it validates the
  corrected 2-core figure. **Gap:** real-Safari **fps was never measured** (only CPU); the
  "4.6 fps unusable" is a playwright + loaded-box number. Severity *direction* is real
  (2 pinned cores at idle; owner felt it), the specific fps is not a real-Safari datum.
- **Machine load:** loadavg 8–22 throughout; every arm stamped. The load-independent harm
  (2 cores, ~200ms board raster/beat) is grounded in the mechanism, not the load. Absolute
  fps is load-sensitive; the CPU attribution and the filter:none collapse are not.
- **Bitmap-cache identity in both engines:** tested (item 6) — the one place the reports
  were provably wrong.

---

## kill_list (corrections the loop must apply)

1. **Delete "624% GPU / 6–7 cores pinned" everywhere in s1.** Replace with **~208%
   (top -l interval) / 194% (real Safari) ≈ 2 cores.** The 624% is `ps pcpu`
   decaying-average inflation (646.5% ps vs 208.5% top, same page/window/pids).
2. **Recast the fps causal story:** single-digit idle fps is a **~150–224 ms serial
   board-area filter raster per beat** (latency), not multi-core saturation. Consistent
   with total CPU being only ~2 cores.
3. **Kill s3's "SSIM 1.0000 by construction / equality gate / sub-1.0 == bug."** In WebKit
   the capture ≠ live (93.6% exact, maxΔ 221, 6.4% edge px). Gate on a **tolerance floor
   ≥0.98**, not equality. Note that the fix shifts ~6% of edge pixels vs the shipped live
   render in WebKit — a real (if sub-visual) pixel change, contra "in no way."
4. **Drop s3's cross-engine parity gate (#3).** Per-engine capture-at-mount is correct;
   requiring WebKit's bitmap to match Chrome's filter at SSIM 1.0 is unachievable and
   unnecessary.
5. **Drop the "unify also speeds Chrome" argument for unify-over-gate.** Chrome idle boil
   cost is already ~0 (s1's own control). Decide unify vs engine-gate on maintainability
   alone; there is no phantom Chrome win.
6. **Stop citing "4.6 fps" as a real-Safari severity.** It is playwright + loaded box;
   real-Safari fps is unmeasured. The defensible real-Safari severity is CPU-only
   (~2 cores at idle) plus the owner's subjective report.

## What SURVIVES (do not let the corrections bury it)
The core finding is sound and reproduced: **the per-beat live-filter re-raster on the
board-area grid is the WebKit pain; kill the live filter at steady state (bitmap pose
cache) and leave every other surface as shipped.** The isolated −grid arm proves the cure
(cost → floor, 60 fps). Ship the bitmap pose cache — with a tolerance-floor identity gate,
per-engine capture, and the ~35 MB residency accepted.
