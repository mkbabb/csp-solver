# T3-W13 GATE g1 — idle-perf + boil rows

Read-only gate lane. All six impl reports read; every number below is a first-party
rerun (headless chromium via the repo playwright, :3001 never disturbed, dist preview
on :4517 started and stopped by this lane). Wave gate table read VERBATIM
(`docs/tranches/2026-07-tranche-3/waves/T3-W13-motion-perf-recut.md` §Gates).
Evidence: `g1/` beside this file (scripts + traces + summaries + PNGs, all rerunnable).

## VERDICT: FAIL — two deviations, both lane l6

Everything l1/l2/l3/l4/l5 own passes its row. Both failures live in
`web/frontend/src/pencil/celestial/DarkModeToggle.vue`.

### F-1 (BLOCKING) — the parked live toggle instance is still a per-beat painter, dev AND prod

Gate row "idle perf" demands: recurring Paint 47.6/s → **0**, no paint clip ≥ viewport.
Measured (b1's recipe verbatim, 1440×806 @DPR2 dark, settled 12s, traced 10s):

| trace | BMTF/s | Paint/s | full-viewport clips | unbounded clips | evidence |
|---|---|---|---|---|---|
| dev :3001 unsolved | 120.4 (dev recordLoop — ships as zero) | **15.99** | 80/10s (1440×816 = 2880×1632 @DPR2) | 80/10s (16777215²) | `g1/g1-dev-unsolved.summary.json` |
| dev :3001 solved | 120.0 | 26.59 | 129/10s | 80/10s | `g1/g1-dev-solved.summary.json` |
| dev :3001 hover (node-1006 rerun) | 120.0 | 15.99 | 80/10s | 80/10s | `g1/g1-dev-hover.summary.json` |
| **prod preview :4517 unsolved** | **8.29** | **15.98** | 80/10s | 80/10s | `g1/g1-prod-unsolved.summary.json` |
| prod preview :4517 solved | 37.7 | 26.63 | 130/10s | 80/10s | `g1/g1-prod-solved.summary.json` |
| dev, toggle `display:none` (isolation) | — | **0** | **0** | **0** | `g1/g1-no-toggle.trace.json` (l5's trace.mjs, rerun) |

- The unbounded clips tick at EXACTLY 125ms cadence (paint-log gap analysis in
  `g1/g1-dev-solved.summary.json` paintLog; median gap 125ms) — the beat.
- Isolation is decisive: with the toggle `display:none`, the whole page paints ZERO
  records for 10s. Every recurring painter is the toggle.
- Attribution (whois, CDP DOM.describeNode on the invalidation nodeIds —
  l5/whois.mjs rerun `full` arm): node 22 = `svg.toggle-icon.toggle-moon.is-active`
  `filter="url(#wobble-celestial)"`, children `g.twinkle-star` ×3 "Style changed"
  (inline `transform:` writes) + `polygon` ×3 "SVG resource invalidated" — the live
  instance's `:style`/geometry bindings read the shared pose arrays' CURRENT frame,
  so they mutate every beat while the icon is PARKED (`visibility: hidden`,
  confirmed computed). A hidden element doesn't render, but the mutation still
  invalidates the filter-bound subtree → 8/s unbounded filtered-svg paint + 8/s
  full-viewport root-scrolling-layer damage + RasterTask ~12/s — finding-1's exact
  b1 tier-2 mechanism, surviving on one surface, and it SHIPS (prod trace identical).
- Deviation vs the wave: §1 target "0 recurring Paint records … the 2880×1612 root
  damage gone"; §2 interlock "rest = frozen stack, gesture = live instance". The
  rest stacks themselves are correct (F-verified below); the live pair's reactive
  bindings were never gated to the gesture window. l6's own restbeat probe checked
  pose cycling and park visibility but never ran a settled paint trace.
- Fix shape (l6's, not mine): freeze/detach the live instances' pose-array bindings
  at rest (bind them only while `turning`, or snapshot at gesture start) — zero
  choreography change.

Row-1 numbers that DO clear: prod-unsolved BMTF 8.29/s ≤ 10 (P1 certified — the
heartbeat is retired; l1's before-0.7.0 measured 119.95/s, ×14.5 collapse
re-confirmed first-party). Dev's 120/s is the dev-only `rafInstrumentation.ts`
recordLoop (`import.meta.env.DEV`-gated, b1 documented, ships as zero — the wave's
own dev-floor hedge, discharged on the preview). Solved-state extras are the
classroom murmur (beat-3 grammar, `murmurWindowMs: 2500`, pre-W13, P4-iv keeps it
live): 57×57 glyph clips in ~600ms bursts every ~2.5s + sequence rAF while running
(prod solved BMTF 37.7/s) — designed episodic work, attributed, NOT a lane
deviation; ledger note: the murmuring glyph also damages the root full-viewport
(un-promoted layer), same class b1 named, out of W13 scope.

### F-2 (BLOCKING, soul gate) — the sun rest stack fails SSIM against its live-filter reference

Gate row: SSIM ≥ 0.983 per P2/P3-baked surface vs its banked live-filter reference
@DPR2 settled. No pre-cut mascot reference was banked, so this lane reconstructed
it by b2's injection method (`g1/g1-mascot-ab.mjs`): freeze the beat (PRM engage),
capture the stack's active pose, then hide the stacks, un-park the live filtered
instance (`.warp` transform none — structurally the shipped whole-icon
architecture) with the base def pinned to the active pose's frequency (0.023 = p1;
ray frames verified aligned live↔stack, seeds verified identical,
`g1/g1-mascot-forensic.mjs`), capture, SSIM (l4's ssim.mjs).

| surface | full | band | struct | verdict |
|---|---|---|---|---|
| moon stack (dark) | **1.0000** | 1.0000 | 1.0000 | PASS — byte-identical raster |
| sun stack (light), steady-state ray-spin angle (~10° at capture) | **0.9145** | 0.9761 | **0.7121** | **FAIL** |
| sun stack, spin angle 0 (PRM-from-load isolation) | 0.9819 | 0.9991 | 0.9275 | still under the line |

Mechanism, isolated by the two-angle A/B: the ray sub-stack rasters at angle 0 and
the un-filtered `.rest-ray-spin` wrapper rotates the CACHED raster post-filter —
compositor resampling visibly rounds the ray tips (see `g1/mascot-light-stack.png`
vs `mascot-light-live.png`), and the 240s spin guarantees a non-zero angle at
essentially all times. The angle-0 residue (0.9819 full / 0.9275 struct) is the
per-sub-svg filter-field realization (disc/rays/sparkles filtered separately vs the
shipped whole-icon field) — l4's divider window-correlation mechanism. The wave's
P3 text authored the decomposition ("breathe/ray transforms move to un-filtered
ancestor containers"), so l6 implemented as ruled — but the wave ALSO binds every
baked surface to the 0.983 soul gate, and on the sun the two clauses conflict; the
gate rules for the soul line. The moon (whole-icon 4-pose stack, no wrappers)
proves the stack mechanism itself is sound at 1.0000.

### Rows that PASS (numbers)

| check | measured | evidence |
|---|---|---|
| prod heartbeat retired (row 2) | BMTF 119.95/s (0.7.0) → **8.29/s** on the dist preview, unsolved settled | `g1/g1-prod-unsolved.summary.json`; l1 `before-0.7.0.summary.json` |
| SSIM drawer-tab outline (P2 bake) | **0.9961** full / 0.9929 struct | first-party rerun of l4's banked pair, `w13-l4/refs↔after2` |
| SSIM panel outline (P2 bake) | **0.9980** / 0.9913 | same |
| SSIM logo (P3 stack) | **min 0.9998** mean 0.9999, pose-matched ×10 | first-party rerun of l5's ssim.py on banked frames |
| SSIM moon stack (P3) | **1.0000** | this lane's A/B |
| divider (P2 bake FAILED at 0.809 → wave-banked hoist fallback) | **0.9752** full / 0.9669 struct — below 0.983 | rerun of l4's pair; ADJUDICATION below |
| resident GPU delta (row: ≤ 10 MB) | full 45.8/42.5 MB cc vs one-pose-resident 44.4 MB → **delta 0 ± 3.3 MB run noise**; even the whole-surface removal bound (incl. the 1× the old architecture paid + tiling) is 17.1 MB, so the pose increment is far inside the ceiling | `g1/g1-gpumem2.mjs`, memory-infra detailed dumps ×4/run, prod preview |
| painter inventory: outlines ×2 | 4 poses / 1 active / **0 filtered nodes**, cycling on the beat | `g1/inventory.json` |
| divider | 4 pose groups on `grain-static` (params never written), 1 visible | same |
| logo | 4 poses on `wobble-logo-p0..3`, 1 active, advances every 4th beat | same |
| mascot/toggle rest | rest-moon 4-pose + rest-sun 4+6-pose sub-stacks, 1 active each, cycling {0,1,2,3}; live pair `visibility: hidden` | same (but see F-1) |
| SvgFilters watcher | gone in src (grep: no watch/useBoilBeat/turbEls) and behaviorally (base `#wobble-celestial` baseFrequency constant 0.02 across 2.2s of beat samples AND during hover); 12 shared pose defs + 2 ray-extras present | `g1/inventory.json` |
| fx button | computed `filter: none`, no inline style | same |
| parked pointer on `.icon-btn` (node-1006 rerun) | **NEGATIVE** — hover arm paint-identical to unsolved (15.99/s both, delta 0); hovered button's filter resolves to the static base def; l5's isolated hover-clean trace 0 paints stands | `g1/g1-dev-hover.summary.json` |

### Divider adjudication (flagged by l4, ruled here)

0.9752 is numerically below the 0.983 line. Ruling: **recorded fallback disposition,
not a lane failure** — (i) the bake was attempted, failed the gate at 0.809, and the
wave's own P2 clause banks exactly this fallback "at their memory price"; (ii) the
hoist carries the SAME frozen filter def on the SAME pose-0 geometry — l4's
forensics (same-build pairs = 1.0, best-shift optimal at (0,0), diff = stroke-edge
AA only) attribute the whole residue to composited-layer rasterization phase on an
all-edge 6px surface, and the first-party rerun reproduces their number exactly;
(iii) memory price measured trivial (~0.26 MB). The number is disclosed for the
wave record; the surface is soul-faithful by mechanism. Final call rides with the
orchestrator if the row is read strictly.

## Re-gate recipe (after l6 fixes)

1. `node g1/g1-trace.mjs unsolved <label>` against :3001 AND a fresh dist preview —
   Paint/s must read 0 (murmur-free unsolved board), fullViewportPaints 0.
2. `node g1/g1-mascot-ab.mjs light` (+ `light prmload`) → l4's ssim.mjs ≥ 0.983
   full AND at steady-state spin angle.
3. Rows already green need no rerun unless DarkModeToggle's rest stacks change
   shape (then rerun the dark A/B too).

## Changed files

None — read-only gate lane. Artifacts written only under the scratchpad
(`g1/` + this report). The vite preview this lane started on :4517 is stopped;
:3001 untouched (200 confirmed post-run).
