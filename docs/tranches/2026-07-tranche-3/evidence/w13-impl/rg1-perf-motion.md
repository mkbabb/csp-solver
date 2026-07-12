# T3-W13 RE-GATE rg1 — first-party re-measurement after the correction lanes (c1/c2/c3)

Read-only on src (`git status` unchanged; no repo file touched). Every number below is a
first-party rerun of the banked recipes — probes copied to `rg1/` with outputs redirected
(lane evidence intact), executed against :3001 (never disturbed; 200 confirmed post-run)
and a fresh dist preview on :4523 (started and stopped by this lane). Headless chromium
via the repo playwright, 1440×806 or 1440×900 @DPR2 per the source recipe. Reports read
first: c1.md, c2.md, c3.md, g1-perf.md, g2-motion.md, plus l3/l6 for baselines; wave read
verbatim including the §3 audit-4 mid-wave owner ruling.

## VERDICT: PASS — all five rows clear. g1's two FAILs (F-1, F-2) and g2's PRT trip are closed on the tree as corrected; no offender remains.

---

## Row 1 — idle perf FINAL (10s settled trace, toggle VISIBLE, b1/g1 recipe verbatim)

`rg1-trace.mjs` (= g1-trace.mjs, OUT redirected), unsolved arm (murmur-free — g1's re-gate
recipe as written). Dist: fresh `npx vite build` (dist mtime 01:34) + `npx vite preview
--port 4523`.

| trace | Paint/s | paintTotal | full-viewport clips | any clip ≥ viewport | BMTF/s | evidence |
|---|---|---|---|---|---|---|
| dev :3001 unsolved | **0** | **0** | **0** | none (clipHist empty) | 119.92 (dev-only `recordLoop`, `import.meta.env.DEV`-gated — ships as zero; the wave's dev-floor hedge) | `rg1/rg1-dev-unsolved.summary.json` |
| **dist preview :4523 unsolved** | **0** | **0** | **0** | none | **7.99 ≤ 10** | `rg1/rg1-prod-unsolved.summary.json` |

Prod steady state is the pure 8Hz beat: BMTF = FireAnimationFrame = Commit = RasterTask =
UpdateLayoutTree = 7.99/s, zero Paint records, zero root damage. g1's F-1 (parked live
toggle pair painting 15.99/s + 80 full-viewport clips/10s) is gone — c1's gestureBound
freeze holds under a settled trace. The ~8/s single-tile RasterTask is c1's disclosed
GPU-side residue (zero main-thread Paint; not a gate line; forensics banked in c1.md).
Solved-arm murmur extras were adjudicated by g1 as designed episodic work out of W13 scope;
not re-traced. **PASS** (both binding numbers: recurring Paint 0, BMTF ≤ 10, no clip ≥
viewport, dev AND prod).

## Row 2 — sun rest SSIM ≥ 0.983 + moon spot-check (g1's A/B recipe)

`rg1-mascot-ab.mjs` (= c1-mascot-ab3.mjs = g1-mascot-ab.mjs + beat-phase offset), SSIM via
l4's ssim.mjs (full / border-band / structure-band). Phase-hunted until ALL FOUR whole-icon
poses were sampled (freeze-instant quantization put multiple offsets on the same pose;
distinct poses verified by `poseFilterId` in the banked state JSONs).

| A/B pair | pose sampled | full | band | struct | verdict |
|---|---|---|---|---|---|
| sun, phase 0ms | wobble-celestial-p0 | **1.0000** | 1.0000 | 1.0000 | PASS |
| sun, phase 31ms | p1 | **1.0000** | 1.0000 | 1.0000 | PASS |
| sun, phase 140ms | p2 | **1.0000** | 1.0000 | 1.0000 | PASS |
| sun, phase 260ms | p3 | **1.0000** | 1.0000 | 1.0000 | PASS |
| sun, prmload arm | p0 | **1.0000** | 1.0000 | 1.0000 | PASS |
| moon (dark, regression) | p1 | **1.0000** | 1.0000 | 1.0000 | PASS |

g1's F-2 (0.9145 full / 0.7121 struct at steady-state spin) is closed structurally — c1's
whole-icon 4-pose cut is recipe-proof at any freeze instant, all four poses byte-identical
to the pinned live-filter reference. Evidence: `rg1/mascot-light-{stack,live}-{0,31,140,260}.png`,
`rg1/mascot-light-prmload-*.png`, `rg1/mascot-dark-*.png`, state JSONs beside each.
**PASS** with maximum headroom (1.0000 ≥ 0.983).

## Row 3 — the Bloom unregressed

`rg1-bloom-probe.mjs` (= l6's) + `rg1-toggle.mjs` (= g2-toggle.mjs: crisp A/B + frame-time
trace + storybook beat table) + a one-off total-duration probe (`rg1-total.mjs`).

**Crest crisp at DPR2** (b2's defect class, promoted-vs-unpromoted A/B):

| scenario | meanAbsDiff | gradient-energy ratio |
|---|---|---|
| warp crest scale 1.09 | **0.000** | **1.0000** |
| warp scale 0.3 | **0.000** | **1.0000** |
| CSS plush flex | **0.000** | **1.0000** |

Byte-identical at every scale; crest edge crop eyeballed crisp (`rg1/crest-edge-t560.png`).

**Beat table spot-trace** (vs spec / g2 / c1):

| check | spec | rg1 measured | g2 / c1 record |
|---|---|---|---|
| wring-down completes | ~340ms | outS ≤0.065 at **t=356.3** (sampling: outS 0.151 @335) | 353.8 / ~340 |
| bloom crest | ~1.08–1.09 near t≈560 | **1.0919 @ t=525–531** | 1.0919 @ 527.9 / @531 |
| total | ~1010ms (backstop 1100) | turning cleared **1025.7–1030ms** | 1029 |
| theme flip | ≤1 frame | dark at **t=1.2ms** (first rAF) | microtask-flip, 0 stale painted frames |
| stage empty | never | **0 frames**; co-visible 240–337 (inOp 0.86–0.92 against outOp 0.89–1.0; the strict boolean trips only on the spec'd 100ms fade ENDING at 340 — g2's recorded adjudication) | same |
| rotation / travel | no −270°, no translateX | range **[−15°, +12°]**, max translateX **0px** | same |
| star pops | staggered onto crest | onsets 631/715/798 (scale-0.25 crossings ~70ms into each pop) | 628.7/712/794.6 |
| plush flex | 860–1010 | **18 anisotropic frames** | 18 |

**Frame-time trace** (~1010ms gesture, shipped vs filter-none): 125 rAF frames, median
8.3ms, max gap 10.6ms, gaps >1.75× **0**, DroppedFrame **0 / 0**, raster sum 6.8 vs 6.6ms
(noise). The banked b2-B fallback stays untripped. **Retarget**: mid-flight re-click max
jump in the re-click window **0.0073**, max after **0.0642–0.0701** (the opacity-masked
wring tail — l6/c1's 0.059 class), settles correctly, turning cleared. **PRM**: `.warp`
computed `transform: none`, both rest stacks visible on the 0.2s crossfade, mid-flip
immediate with `turning` never raised, live pair hidden. Rest pose verified: parked warp
matrix ≈ scale 0.060 / rotate 12.0°, live pair hidden, ONE visible pose (whole-icon,
`wobble-celestial-p2` at capture), 4 pose filters. **PASS** — c1's recut left the Bloom
beat-identical.

## Row 4 — drawer vs the AMENDED wave gate row (all 8 sub-rows)

`rg1-c2-gate.mjs` (= c2's probe, OUT auto-redirected to rg1/), :3001?size=3&difficulty=EASY.
Ledger curve read from the tree: `cubic-bezier(0.32, 0.72, 0, 1)` @ 520ms.

| # | criterion | rg1 measured (close / open) | verdict |
|---|---|---|---|
| 1 | no teleport, discontinuity | frame-1 jump **6.87 / 6.79px along-path** (glide-velocity class; shipped defect was ~249px wrong-direction); rail painted top 261.5–264.4 ∈ [255,268]; max inter-frame step 35.5 / 39.1px (velocity × frame skip; monotone, progress-gap 0) | PASS |
| 2 | one solid, ≤1% progress match | max normalized host↔rail progress gap **0.0000** both directions | PASS |
| 3 | exactly one Layout >5ms | **0** over two gestures (onset layout sub-ms headless; ceiling read); layout class flipped in the click task, board widths {672,736} only | PASS |
| 4 | settle frame inert | settle+1 vs settle+30 @DPR2 **byte-identical**, both directions | PASS |
| 5 | first painted motion ≤2 frames | **frame 1** post-click, both directions | PASS |
| 6 | PRM + a11y | PRM same-task swap (closed in-task, gesturing never raised, **0 animations**, board grew 64px in-task); aria truthful at click; focus in drawer at open settle; closed-idle rail inert + hidden + parked `translate: 0px -50%` | PASS |
| 7 | horizontal-from-under, no masthead zone, z-under | frames with rail above board top **0 / 0**; rail vertical drift vs sheet **0.01px** (pure horizontal); min(rail.left − host.left) 407 / 418.8px; z-under hit-test: **8/8 overlap frames hit the HOST**, never the rail (overlapW 281px) — the case genuinely emerges from beneath the paper | PASS |
| 8 | zero overshoot, monotone, one recorded glass curve on all four movers | max overshoot past tuck **0px**; monotone relative motion **true**; movers mid-glide **4**, distinct easings **{cubic-bezier(0.32, 0.72, 0, 1)}** = exactly the `MOTION.curves.drawerGlide` ledger row, distinct startTimes **1** (one clock) | PASS |
| S4 | reversal | re-click at 200ms: settles open, layout re-flips at reversed settle **t=471ms** (inside 520+220 guard); max step 46.5px = velocity × rAF frame-skip class (monotone holds) | PASS |

Numbers sit inside the envelope of c2's two certified runs (frame-1 6.70–7.63px, re-flip
415–491ms, z-under 6–11/6–11 host hits). Evidence: `rg1/c2-gate-results.json`,
`rg1/c2-{samples,reclick-samples}.json`, emergence + midglide + settle PNGs @DPR2. **PASS
on all 8.**

## Row 5 — PRT full-key re-trace + the 9×9 feel

`rg1-prt.mjs` / `rg1-prt-control.mjs` / `rg1-feel.mjs` / `rg1-c3-prm.mjs` (= c3's probes,
OUT redirected). 16×16, `prefers-contrast: more` opaque arm, K held.

**The arm is real**: 256 key cells / 256 paths on `pencil-draw-on` 0.18s, delay buckets
**{80,210,340,470,600,730,860}** — c3's size-derived 130ms bucket exact; mid-stroke
concurrency **36–37 typical, 73 peak** (2N/7 at a bucket boundary — the derivation's cap,
re-measured); writes stream 80→**1052.8ms**; full key printed.

**Dropped frames attributable to the draw-ins = 0** — with the attribution forensics
disclosed in full:

| interleaved control run (shipped / no-key-drawons / no-drawons) | loadavg | drops (times ms) | in-window attributable |
|---|---|---|---|
| c3 cert (banked) | — | 2 (17,25) / 1 (17) / 1 (22) | **0** |
| rg1 run 1 | ~7 | 2 (17,25) / 1 (15) / 1 (0) | **0** |
| rg1 run 2 | **~9 burst** | 6 (17,25,249,317,349,1224) / 1 (16) / 1 (17) | 3 (see below) |
| rg1 run 3 | 6.3 | 2 (17,25) / 1 (18) / 1 (17) | **0** |
| rg1 run 4 | 6.7 | 3 (33,148,1241) / 1 (**115** — in-window, control arm) / 1 (16) | **0** (1 − 1) |

The run-2 outlier coincides with a machine-wide load burst (loadavg 9.03, syspolicyd 72% /
mds churn — largely this lane's own probe fleet: dozens of fresh chromium launches +
multi-MB trace writes triggering signature checks and Spotlight). Its 3 in-window drops are
scattered singletons; run 4 shows the same singleton class landing in a CONTROL arm —
ambient, not draw-in work. The g2 trip signature — **29 drops dense across 158–567ms,
controls clean, reproducible** — is unambiguously gone: 4 of 5 controlled comparisons read
0 attributable, and the standalone traces' in-window rAF cadence is clean at steady state
(run 2 standalone: 1 drop @25ms pre-window only; gaps >1.75× in-window: 0). Certification
stands on the consensus, load-sensitivity disclosed for the record.

**The 9×9 laminate feel un-slowed** (vs l3/c3's report):

| arm | delay buckets | first-glyph start | last-glyph done | baseline (l3/g2 spec · c3) |
|---|---|---|---|---|
| 9×9 translucent (n=57) | **{80,120,…,320} byte-identical to shipped** | 92.9ms | **493.8ms** | 80 spec / 500ms · 93 / 492.8 |
| 9×9 opaque (n=81) | **{80,120,…,320} byte-identical** | 98.4ms | **496.6ms** | · 105.5 / 505.3 |
| 16×16 opaque (n=256) | {80,210,…,860} | 111.6ms | 1052.8ms | c3: 1052.2, derived ~1040 |

The floor-at-40ms derivation holds: the common laminate's computed CSS is unchanged, not
merely similar. **PRM parity**: at t=120ms every key path present reads `animation: none /
opacity 0.9 / dashoffset 0` (20/20 this deal — path count is generation luck; c3's deal had
58; the parity criterion is per-path and total). **PASS.**

## Housekeeping

- :3001 never touched (200 confirmed post-run). The :4523 preview this lane started is
  stopped (curl 000 confirmed).
- No repo file changed — read-only re-gate; artifacts only under `rg1/` (probes as run,
  traces, summaries, SSIM pairs, screenshots, control-run JSONs `rg1-prt-control-run{1..4}.json`,
  standalone PRT runs `rg1-prt-run{1,2,3}-*.json`).
- e2e not rerun by this lane (not an rg1 row); c1/c2/c3 each certified 44/44 green on this
  exact tree, c3's third pass documenting the known `throttled-void.spec.ts` budget flake +
  one data-conditional skip.

— re-gate rg1, Fable, 2026-07-12.
