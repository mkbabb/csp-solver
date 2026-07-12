# T3-W13 GATE g2 — toggle-crisp · toggle-storybook · drawer · draw-ins

Gate lane, read-only on src. All measurements first-party (probes rerun or written fresh,
never trusting lane numbers), headless chromium `--enable-gpu`, 1440×900 @DPR2 against :3001
(owner server untouched; dispatched clicks only). Probes + raw artifacts:
`w13-impl/g2/` (this dir's `g2/` subdir; lane artifacts left intact).

**Verdict: 3 rows PASS clean. The draw-ins row passes on every criterion EXCEPT its own
certification item — the PRT full-key trace TRIPS: the cheap claim does NOT certify, THE
STAGGER MUST WIDEN** (reported, not implemented, per gate discipline). The toggle row's
banked b2-B fallback is definitively NOT tripped.

---

## Row 1 — toggle crisp ("renders in a low-res variant on animation") — PASS

**Static A/B, b2's probe2 recipe adapted to the warp architecture** (`g2-toggle.mjs` §5;
PRM context freezes poses for determinism; live icon forced visible over the hidden stack;
`.corner-right` will-change toggled promoted↔unpromoted):

| scenario | meanAbsDiff (gray, /px) | gradient-energy ratio (prom/unprom) |
|---|---|---|
| warp scale 1.09 (crest) | **0.000** | **1.0000** |
| warp scale 0.3 | **0.000** | **1.0000** |
| CSS plush flex (scale 1.04, 0.96) | **0.000** | **1.0000** |

Promoted and unpromoted decode to byte-identical pixels at every scale — the b2 defect class
(cache stretched past native) is structurally gone: the warp is the filter's INPUT, so the
promoted layer's content re-rasters vector-fresh each frame. Crops:
`g2-ab-{crest1_09,warp0_3,plushflex}-{promoted,unpromoted}.png`.

**Live frames** (one gesture per capture): `g2-crest-t560.png` + `g2-crest-edge-t560.png`
(crescent edges crisp at inS≈1.09), `g2-bloom-scale03-t118.png` (mid-wring body legible, no
shred — checkpoint-3 escape stays untripped), `g2-plush-t930.png` (stars landed, flex frame
crisp).

**Frame-time trace across the ~1010ms gesture** (in-page rAF + CDP trace, shipped vs
`.toggle-icon{filter:none}` attribution control, `g2-toggle-trace-{shipped,nofilter}.json`):

| arm | rAF frames | median | max gap | gaps>1.75× | DroppedFrame | affects_smoothness | STATE_DROPPED |
|---|---|---|---|---|---|---|---|
| shipped | 125 | 8.3ms | 9.4ms | 0 | **0** | **0** | **0** |
| filter none | 125 | 8.3ms | 9.5ms | 0 | 0 | 0 | 0 |

Raster cost of the warp is noise-level (raster sum 7.3 vs 6.3ms across the WHOLE gesture,
max task 0.11ms; paints 427 vs 383). At 120Hz headless vsync not one frame dropped.
**The banked b2-B fallback (1.15× over-raster) is NOT TRIPPED.**

## Row 2 — toggle storybook ("warp in and out like a storybook-popup") — PASS

Full-gesture rAF trace `g2-gesture-samples.json` (125 frames, light→dark):

| beat-table check | spec | measured |
|---|---|---|
| wring-down completes | ~340ms | outgoing ≤0.065 at **t=353.8** (first sample past 340+frame) |
| bloom crest | ~1.08 @ t≈560 | **1.0919 @ t=527.9** — reproduces l6's recorded checkpoint-2 adjudication exactly (house spring kept verbatim; crit-perf's eased-max arithmetic) |
| total | ~1010ms | `is-turning` cleared at **1029ms**; backstop 1100ms in source |
| co-visible 240–340 | stage never empty | incoming ≥0.83 while outgoing 1.0 from t=237; outgoing's specified 100ms fade (delay 240) completes on schedule (0.013 @ t=337); **stage-empty frames: 0** across the whole gesture |
| theme flips at click | ≤1 frame | pre=light, sync=light, **microtask=dark**, frame1=dark — zero painted frames of stale theme (Vue microtask flush; targeted probe) |
| star pops on crest | 560/640/720 stagger | computed transition-delays **560/640/720ms verbatim** (source :695-703); observed scale-0.25 crossings 628.7/712/794.6 (the back-out curve dips below 0.2 first — crossing lands ~70ms into each 150ms pop); all three landed by the plush frame |
| plush flex | 860–1010 | 18 anisotropic CSS-scale frames in 860–1020 (e.g. `1.00174 0.998259` @ 878.8) |
| no −270°, no translateX(−50%) | anywhere | rotation range across EVERY frame, both warps: **[−15°, +12°]**; max icon translateX **0px**; source grep hits only the tombstone comment (:567) |
| mid-flight re-click retargets | pure transitions | re-click at 400ms: max scale step in the re-click window **0.0086** (no snap); max after 0.0586 (in the wring's opacity-masked tail — matches l6); settles light, turning cleared. `g2-retarget-samples.json` |
| PRM | immediate flip + crossfade + warp none | `.warp` computed `transform: none`; both stacks visible on 0.2s opacity crossfade; click → dark at +80ms with `turning` never raised; live icons hidden. `g2-prm-dark.png` |

**Twist adjudication RECORDED** (owner-taste checkpoint 1): **−15° kept** — l6 prototyped all
three (`l6-captures/wring-mid-t170.png`, `twist-8-t170.png`, `twist-0-t170.png`, banked);
at mid-wring the sun's 10-fold near-symmetry reads ≤15° as ray drift, no translation, no
multi-turn — zero whirl-residue in any variant. Overrule = one number in one rule
(`.is-turning .toggle-icon:not(.is-active) .warp`).
**Band ledger re-derivation**: ~950→~1010ms lives in DarkModeToggle.vue (plush-land 1010ms,
backstop 1100ms) — no pencilConfig ledger row exists to edit (l6 deviation 1 grep-confirmed).

## Row 3 — drawer ("not right AT ALL") — PASS, six criteria + S3 + S4

l2's probe rerun verbatim from `g2/g2-drawer.mjs`; results `g2/drawer-gate-results.json`,
raw frames `g2/drawer-samples.json`, trace `g2/drawer-trace.json`.

| criterion | measured (close / open) | verdict |
|---|---|---|
| 1 no teleport | frame-1 painted step 12.5 / 14.5px **along-path** (shipped defect: ~249px wrong-direction teleport into the masthead); rail painted top 261.3–264.6 ∈ [255,268]; max inter-frame step 24.1 / 34.9px = spring velocity | PASS |
| 2 one solid | max normalized progress gap host↔rail **0.0000** both directions | PASS |
| 3 one layout | Layout >5ms across two gestures: **0** (ceiling "exactly one"; the onset layout is sub-ms headless; 45 micro-layouts all ≤5ms) | PASS |
| 4 crisp at rest | settle+1 vs settle+30 @DPR2: **0 of 5,184,000 px differ** (threshold 6); at zero threshold 6–8 channels of 20.7M differ by exactly **1 LSB** (GPU raster nondeterminism, not settle work). `g2-settle-{close,open}-plus{1,30}-dpr2.png` | PASS |
| 5 onset | first painted motion at **frame 1** post-click, both directions | PASS |
| 6 PRM + a11y | PRM: same-task class flip, 0 animations, board grew 64px in-task; aria-expanded flips by first rAF (+4.2–4.7ms, the Vue microtask — zero painted stale frames); focus in drawer at open settle; closed-idle: inert + hidden + `translate: 0px -50%` parked | PASS |
| S3 mid-glide | min(rail.left − host.left) **375.8 / 432.2px** — the case NEVER peeks past the sheet's far edge; overshoot past the tuck **17.9 / 18.0px** (b4's ~18px rect math trace-confirmed). `g2/midglide-{close,open}-dpr2.png` | PASS |
| S4 reversal | re-click at 200ms: max step 25.6px (velocity-plausible), settles open, aria truthful, layout re-flips at reversed settle **t=423ms** | PASS |

Forensics note on C4: the probe's boil-freeze trick (PRM engage at settle) now itself starts
a 200ms toggle-stack crossfade — the first run's 36k-px "diff" was that transient caught
mid-flight, localized and eliminated by letting the PRM-engage settle 600ms before shot A.
Drawer settle work is genuinely zero.

## Row 4 — draw-ins ("need proper pencil draw-in animations") — criteria PASS; **PRT trips the banked stagger-widen**

l3's probes rerun (`g2/g2-drawins.mjs`, `g2/g2-marks16.mjs` → `g2/g2-drawins-results.json`)
plus fresh stagger + PRT probes:

- **Hint on H**: dashoffset **70 → 0 over ~350ms** (t=22 off=70; sub-1 by ~350–450ms
  sampled sparse; dash cleared to `none/0` on completion — the W8 discipline), stroke
  `url(#solver-ink)` on every frame. `g2/hint-middraw-dpr2.png`.
- **NO flourish on a lone hint**: 4s d-change watch — zero changes in the flourish window;
  the only burst is **2608–3058ms** = one 600ms murmur wiggle at the ~2.5s murmur window
  (l3 measured 2532–3131 — same signature). Hinted ink murmurs like solver ink; no gold star.
- **Solve reveals keep the beat**: d-changes from **1390ms** at the 150ms flourish cadence
  (l3: 1415ms) — beat-2 intact; e2e celebration specs green.
- **Marks stagger**: a 4-candidate cell carries delays exactly **0/20/40/60ms** (idx×20) with
  mid-write sibling offsets distinct in flight (0.406/0.646/0.969 @ t=67). Note: candidate
  plurality is generation luck (two probe boards propagated to all-singletons; a HARD 9×9
  hunt found a plural domain on the first fresh generation).
- **16×16 sweep**: rows 0–15 first-marks at **35→176ms (~9ms/row)**, each cell then writing
  160ms — the row-mount wavefront composes with the in-cell draw-ons.
  `g2/peek16-wavefront-dpr2.png`.
- **Laminate key**: delays exactly **{80,120,160,200,240,280,320}ms** (the 7 noise buckets,
  80–320 window), dur 180ms, opacity 0.9, `pathLength=1`; keys still at offset 1 at t≈101
  (the milk lands first); lay/lift byte-untouched by l3.
- **PRM instant everywhere**: hint `none/0` at 120ms; marks `animation none, opacity 1, off 0`;
  key `none, 0.9, 0` — primitive-inherited. `g2/prm-peek-dpr2.png`.
- Futoshiki twins green (hint 98→0 over ~340ms solver ink; marks carry the primitive).

### THE PRT FULL-KEY TRACE — the certification item: **DOES NOT CERTIFY**

`g2/g2-prt.mjs` + attribution controls `g2/g2-prt-control.mjs`; 16×16, `prefers-contrast:
more` (the opaque arm), K held, 1440×900 @DPR2, headless 120Hz vsync.

- The arm is real: **256 key cells / 256 paths, all 256 running `pencil-draw-on`
  concurrently at t≈151ms**, delays 80–320ms, strokes done by ~500ms.
- **Frames DROP**: **29 DroppedFrame / 24 STATE_DROPPED / 30 affects_smoothness** reports,
  dense across **158–567ms** — exactly the write window (`g2/g2-prt-trace.json`). rAF cadence:
  median 9.8ms, **max gap 33.3ms, 12 gaps >1.75× median** in [0,700] — several exceed even a
  60Hz 16.7ms budget, so this is not a 120Hz-only artifact.
- **Attribution airtight** (`g2/g2-prt-control-results.json`): shipped **29** drops;
  key-draw-ons-off (marks still writing, laminate still laying) **1** drop; all-draw-ons-off
  **1** drop. The 256 main-thread dashoffset paint invalidations are the cause — exactly the
  non-compositable-property risk the wave restated honestly (crit-design kill #5).
- Probe-effect forensics disclosed: two earlier runs showed 185–250ms gaps that were MY OWN
  instrumentation (a mid-window CDP screenshot; `getAnimations()` over 256 paths inside the
  rAF loop) — both removed; the residual drops are real and reproducible.
- **Ruling per the gate row: the stagger must WIDEN.** The tunables are the ones b5 named
  (the 80ms lead and the 40ms bucket width). Sizing note: 7×40ms buckets + 180ms strokes put
  all 256 paths concurrent by t≈162; widening the bucket to ~120ms (window 80–800ms) caps
  concurrency near ~64 paths. Implementation belongs to the l3 surface owner /
  finalize — NOT executed by this gate lane.
- Everything else in the arm is correct: full key printed (256, the W9 blocking-fix
  contract), noise window honored, `g2/g2-prt16-settled-dpr2.png`.

## Regression

- e2e: **44/44 green** (the suite is 44 now — l6's Test 8 added; one `throttled-void.spec.ts`
  budget flake under this lane's own probe load, passed in isolation and on the full rerun).
- No src file touched by this lane.

## Deviations

None from the gate method. Three measurement notes, all resolved above: (1) the co-visible
boolean was first computed stricter than the beat table defines (the outgoing fade ENDS at
340 by spec); (2) theme/aria flips land on the Vue microtask, not the dispatch statement —
zero painted stale frames, which is what "at click / ≤1 frame" means; (3) the C4 and PRT
probe-effect transients (PRM-engage crossfade; CDP screenshot + getAnimations stalls) were
identified, eliminated, and disclosed rather than reported as product defects.

## Changed files

**None in the repo** (gate lane, read-only on src). Written artifacts (scratchpad only):
- this report (`w13-impl/g2-motion.md`)
- probes + evidence under `w13-impl/g2/` (`g2-toggle.mjs`, `g2-prt.mjs`,
  `g2-prt-control.mjs`, `g2-drawer.mjs`/`g2-drawins.mjs`/`g2-marks16.mjs` copies, traces,
  screenshots, results JSONs — catalog in dir listing)

— gate lane g2, Fable, 2026-07-11.
