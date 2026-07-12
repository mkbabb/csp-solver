# T3-W13 lane l2 — §3: the drawer as one solid (S1–S4 in full)

Design lane (Fable, frontend-design skill invoked). Wave §3 executed per the scope RULING:
full re-architecture, the minimal `translate:`-channel fix folded INSIDE S1 as
defense-in-depth. Baseline `d0893614`, live-driven at :3001 (HMR), verified headless at
1440×900 (DPR2 where screenshots demanded).

## What landed

### S1 — movers on WAAPI (F1 structurally unreachable)
- `useControlsDrawer.ts` glide engine rewritten: four movers (sheet host, case rail,
  masthead h1, tab counter-scale) each on `element.animate()` with explicit `[from, to]`
  keyframes, `composite: 'replace'`, `fill: 'none'`. No "previous committed style" exists
  to capture — the phantom class of bug is unreachable, not dodged.
- Defense-in-depth: `scene.css` parked pose `transform: translateY(-50%)` →
  `translate: 0 -50%` — the rest pose lives on a channel no mover animates.
- The `drawer-gesturing` transition arming DIES: `scene.css:62-71` and `App.vue`'s
  masthead rule keep only gesture-scoped `will-change: transform` (+ the case's
  `visibility: visible` override). `void host.offsetWidth` and the
  `--drawer-glide-scale` set are gone (the DrawerTab rule keeps, computes identity;
  the counter-scale now rides the fourth WAAPI mover — F5 behavior preserved:
  tab apparent width 47.96–48.10px across the glide, the 0.2% band).

### S2 — classic FLIP
- Layout class flips ONCE at onset (`applyLayout(toOpen)` inside the click task); first
  rects read pre-flip on the clean tree; last rects take the gesture's single forced
  layout; movers animate FROM the inverted old-pose delta TO identity.
- Settle frame clears finished animations + inline transform-origins + demotes — no
  layout, no re-raster, no snap (F4 dies; F3 halves and then dies, see the clock pin).
- The W12 crit kill keeps: the filtered board's SIZE is never tweened — exactly one
  layout + one re-raster per gesture, now at onset.

### S3 — one easing family
- `GLIDE_EASING = cubic-bezier(0.34, 1.56, 0.64, 1)`, 480ms, all four movers, zero
  stagger — plus the literal "one clock": every mover pinned to one shared
  `anim.startTime = document.timeline.currentTime` at creation. This also removes the
  WAAPI pending-start dead frames (measured: first painted motion moved from frame 4–5
  to frame 1, both directions).

### S4 — retarget by reversal
- `retarget()` now `anim.reverse()` per mover (the old transition-retargeting path
  deleted); settle keys off `Promise.allSettled(movers.map(a => a.finished))` with a
  generation token guarding stale callbacks; `SETTLE_GUARD_MS` kept as the never-never
  backstop; `applyLayout(targetOpen)` at settle stays the one truth (re-flips the layout
  class at a reversed settle — measured at t≈399–406ms after a 200ms re-click).
- Reversed-settle frame safety: Web Animations' "update animations and send events"
  performs a microtask checkpoint before paint, so the finished-driven settle lands the
  class re-flip in the same frame — `fill: none` is flash-free in both directions.

### Kept verbatim (F5 + a11y contract)
- Focus/`drawerInert` timing unchanged: aria-expanded at click, focus into panel at open
  settle, reclaim to tab at close start, inert + hidden at closed-idle. PRM branch
  unchanged (same-frame swap, no gesture window, zero animations). `DrawerTab.vue`
  untouched. Regime rule (<1024 no-op) untouched.

## Anchors (as changed)
- `web/frontend/src/games/shared/useControlsDrawer.ts` — doc claim :18-33 rewritten
  (the "two forced layouts, ZERO paints" claim was true of paints, false of transition
  bases — now describes classic FLIP on WAAPI); constants :41-48; glide engine
  (animateMover/glide/settleNow/retarget) fully re-cut.
- `web/frontend/src/games/shared/scene.css` — :50-63 parked pose on `translate:`;
  :65-80 gesturing rule arms NO transitions (promotion + visibility only).
- `web/frontend/src/App.vue` — masthead gesturing rule: transition dropped,
  will-change keeps (the :292-313 region).
- `web/frontend/e2e/drawer.spec.ts` — test 2 re-trued to the classic-FLIP contract:
  the ONE layout step lands at onset (pre-click sample added; "landing at settle,
  never before" assertion replaced by "first post-click frame holds the closed width,
  zero mutations after").

## Gate evidence — b4's six criteria + the S3 trace

Probe: `probe-drawer.mjs` (this dir; rerunnable from web/frontend against :3001).
Results: `drawer-gate-results.json`; raw frames `drawer-samples.json`,
`drawer-reclick-samples.json`; trace `drawer-trace.json`.

| criterion | measured | verdict |
|---|---|---|
| 1 — no teleport | frame-1 painted jump 12.1px close / 13.0px open, along-path toward target (today ~249px into the masthead zone, wrong direction); case painted top stays 261.3–264.6px ∈ [255,268] on close at 1440×900; max inter-frame step 23–44px = spring velocity, no regression | PASS |
| 2 — one solid | max normalized progress gap host↔rail = 0.0000 at every sampled frame (same keyframes-clock-curve; WAAPI lockstep) | PASS |
| 3 — one layout | Layout events >5ms per gesture: **0** (criterion ceiling "exactly one"; the single onset layout measures 0.63–0.88ms vs today's two ~10ms flips; remaining 20–40µs events are boil micro-layouts) | PASS (under ceiling) |
| 4 — crisp at rest | settle+1 vs settle+30 DPR2 screenshots **byte-identical** (0 of 5,184,000 px differ), both directions — boil frozen via PRM engage at settle to isolate settle work (the shipped tree still boils; §1 is another lane); `settle-{close,open}-plus{1,30}-dpr2.png` | PASS |
| 5 — onset | first painted motion at frame 1 post-click, both directions (spring already ~12px along); was frame 4–5 before the startTime pin | PASS |
| 6 — PRM + a11y | PRM: same-task layout class, no gesturing window, 0 animations, board grew in-task; aria-expanded truthful at click; focus in drawer at open settle; inert + hidden + `translate: 0px -50%` at closed-idle | PASS |
| S3 mid-glide | min(case.left − sheet.left) = 375.6px close / 429.6px open across every frame; overshoot excursion past the tuck 18.0px (b4's rect math confirmed by trace); DPR2 crest frame `midglide-close-dpr2.png` shows the case fully under the sheet, tab tongue only | PASS |
| S4 reversal | re-click at 200ms: max inter-frame step 27.7px (velocity-plausible, no discontinuity), settles open, layout re-flips at reversed settle (t≈399–406ms), aria truthful | PASS |

## Regression
- `npx vite build` clean; `vue-tsc --noEmit` clean; `npm run lint:eslint` clean.
- e2e **43/43 green** (full suite via repo playwright config, own server), drawer spec
  6/6 — run on the working tree with the other W13 lanes' concurrent edits present.

## Deviations
1. `e2e/drawer.spec.ts` was not in the exclusive file list but test 2 codified the
   inverted-FLIP contract ("one layout step at settle, never before") — structurally
   incompatible with the wave-ruled S2. Re-trued to the classic-FLIP contract; all other
   assertions (grow ≥24px, center ±2px, persistence, a11y, PRM, regime) unchanged.
2. The shared `startTime` pin is an S1/S3-internal mechanic ("one clock, zero stagger",
   made literal) adopted after the first probe showed WAAPI pending-start dead frames
   pushing first motion to ~3 frames at 60Hz on open — criterion 5 drove it.
3. Criterion 3 read as a ceiling: zero Layouts >5ms measured (strictly better than the
   authored "exactly one" — the one onset layout is sub-millisecond headless).

## Changed files (exact, repo-relative)
- web/frontend/src/games/shared/useControlsDrawer.ts
- web/frontend/src/games/shared/scene.css
- web/frontend/src/App.vue
- web/frontend/e2e/drawer.spec.ts
