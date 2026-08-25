# T9-W8 — FIRST PAINT

The cold boot made fast on the device that matters. Born of owner marks T9-M06 and
T9-M02 (2026-08-10, real iPhone): first-load performance on mobile Safari is poor
for drawing and the dark-mode toggle; the drawer animation is not smooth; subsequent
loads are better but "could be improved dramatically." Registry family F20. No audit
lane measured this — the perf estate priced idle churn (T4-P1) and generation (W4);
the BOOT was the unexecuted GATE D the whole time (F1: perf-rig's boot-TBT threshold
has no executor).

## 8.1 The attribution, before any cure

One lane instruments the cold path and names where the milliseconds go — the
suspects, from the estate's own architecture:

- **The bake pipeline at first paint**: rasterPose/HandwrittenLogo bakes, the grain
  hoist's four pre-rastered layers, and every surface that must draw before the
  board reads as ready. Which bakes are render-blocking, which could be deferred,
  which re-run on the dark-mode toggle's FIRST invocation (the owner names the
  toggle — a first-toggle re-bake is the shaped suspect).
- **The main chunk's freight**: wasm init on boot vs on first deal; the 16×16
  template bank riding the entry chunk (W4 §4.4 moves it — this lane measures the
  boot share it steals); font subsets' fetch+bake double-life
  (HandwrittenLogo's data-URI bake).
- **The cache story**: WHY subsequent loads are better (CF edge + HTTP cache +
  bake memoization?) — the delta IS the attribution map for the cold path.
- **The drawer's jank** (M02): frame-time trace of the drawer open/close on device —
  compositor-driven (transform/opacity only?) or layout-thrashed; if the curve is
  at fault it goes to W7, if the frames are, it's cured here.

## 8.2 The cures (shaped by 8.1, bound by the laws)

Deferred/idle-time bakes for everything not needed at first paint; the dark-toggle's
first invocation pre-warmed (bake both themes' critical surfaces or bake-on-idle);
main-chunk freight off the boot path (with W4 §4.4); the drawer on compositor-only
properties. No cure lands without its 8.1 number moving — the attribution is the
gate, not vibes. π identity throughout: first-paint work must not move a single
golden; the boil budget census (filterBudget 9) must not grow.

## 8.3 The real-iOS validation (the M06 law)

Readings that close this wave come from a REAL iOS instance — the owner's word. M19
stands: no screen seizure, no frontmost theft. The wave PREPARES the instrument (an
owner-run device script in the E8/CH-35 ten-minute shape: loads the deployed edge
cold, reads paint/TBT/toggle timings, one tap to export); the owner RUNS it; the
readings bank as the wave's evidence. Simulator + Playwright-WebKit guide the work
in-flight; they close nothing. GATE D's threshold finally gets its executor — as a
LOCAL/device instrument per O-12, its cadence stated (every WGATE production pass,
device permitting), never a CI pretense.

## Gate spine

- Born-RED: the boot budget — first-load readiness and first-toggle latency
  thresholds set from 8.1's baseline (the owner's "poor" is the RED; the threshold
  quantifies it on the device baseline, then the cure must beat it).
- The drawer frame-time probe: no dropped-frame burst on open/close at the device
  baseline (RED at HEAD per M02).
- π identity on all goldens; filter census unchanged; DELTA only where W7 declares
  a visual change (the bar border, the sticky titles — not this wave's pixels).
- Evidence: the attribution table (8.1) and the before/after device readings banked
  under `evidence/w8/` — text-first, frames within policy caps.
