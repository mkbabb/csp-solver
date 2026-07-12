# W13 lane b1 — the boil from first principles (findings 1 + 4)

Lane: DESIGN+PERF (Fable, frontend-design skill loaded). Tree audited: d0893614 at :3001 (Vite dev server — `curl :3001` returns `/@vite/client`; dev deltas are flagged wherever they matter). Traces: DevTools tracing via `chrome-devtools` CLI, viewport 1440×806, **DPR 2**, dark mode, unsolved 9×9 MEDIUM (36 givens), settled 10s+ before every recording. Raw traces + elimination-ladder artifacts sit beside this file (`b1-idle-trace.json`, `b1-clean-baseline.json`, `b1-test-{b..h}.json`, `b1-light.json`, `b1-idle.png`).

---

## (a) COST MODEL — what the idle page actually spends

### The two tiers

**Tier 1 — the vsync heartbeat (continuous, ~98–196 Hz).** `pencil-boil`'s scheduler is one rAF chain that re-arms itself EVERY vsync while any subscriber is enrolled (`node_modules/@mkbabb/pencil-boil/src/vue.ts:155` — `rafId = schedulerRunning ? requestAnimationFrame(schedulerTick) : null`), and the settled page always has exactly one subscriber: the shared-beat driver (`web/frontend/src/pencil/composables/boilBeat.ts:32`; live self-report `__schedulerDebug()` → `{chains:1, subscribers:1, kinds:{frame:1}}`). On this 120Hz display that's ~98 BeginMainThreadFrame/s and ~113 Commit/s of mostly-empty pipeline, forever. Measured floor with **every painter eliminated** (all boiling surfaces hidden + feTurbulence writes no-op'd, `b1-test-g.json`): **0 paints, still 98 main frames/s, 197 rAF fires/s, RunTask 5.3% of one core, 503 commits/4.4s**. The idle page never sleeps — it polls a 125ms clock at 8ms resolution.

Dev-only inflation inside that number: `src/pencil/dev/rafInstrumentation.ts:73-78` runs `recordLoop`, a second perpetual native-rAF loop (dev-gated at `src/main.ts:5` — absent from prod), plus the rAF wrapper itself. FunctionCall attribution in the 13.5s baseline: 1646 calls to the wrapper + 1646 to `recordLoop` = 118ms + 24ms JS. Prod keeps ONE chain → est. floor roughly halves to ~2.5–3% core, but it does not go to zero: the vsync-spinning tick ships.

**Tier 2 — the beat (8 Hz, every 125ms per `MOTION.beatMs`, pencilConfig.ts:117).** Clean 10.3s baseline (`b1-clean-baseline.json`, cursor parked on an inert cell):

| painter (node, identified by elimination) | paints/s | paint clip @DPR2 | main-thread paint | driver |
|---|---|---|---|---|
| **document root scrolling layer** (node 2) | 7.9 | **2880×1632 — FULL VIEWPORT** | 87µs avg | damage union of the un-promoted filtered painters below |
| control-panel HandDrawnOutline svg (1070; layer origin matches panel at 924,209) | 7.9 | 1441×817 | 7µs | `d` swap/beat under live `grain-outline` (HandDrawnOutline.vue:75,99) |
| BoilDivider (1002; clip 1001×16 = its viewBox) | 7.9 | 1001×16 | 2µs | `d` swap/beat under live `grain-static` (BoilDivider.vue:33,47) |
| DrawerTab HandDrawnOutline (125; confirmed by hiding `.drawer-tab .outline-svg`, test-c) | 7.9 | unbounded | 1µs | `d` swap/beat under live `grain-outline` |
| moon mascot svg 208×208 (230; light mode: sun = 214, `b1-light.json`) | 7.9 | unbounded | 5µs | wobble-celestial `baseFrequency` write/beat + 3 star polygons re-pointed + 3 twinkle inline transforms (DarkModeToggle.vue:19,121,212-222,287-293) |
| FilterTuner `fx` button (187; confirmed by hiding `.tuner-toggle`, test-h) | 7.9 | unbounded | 11µs | **always-on** `style="filter: url(#wobble-heart)"` (FilterTuner.vue:59) — dev-only chrome, but it re-rasters every beat and pollutes every dev trace |

Plus per beat: 1 style recalc resolving ~42 elements (334 ResolveStyle/s ÷ 8), 1 Layout, ~48 RasterTask/s (0.5ms/s — GPU raster is cheap; the damage bookkeeping isn't), GPUTask ~8ms/s, 8 DrawFrame/s. Invalidation ground truth (13.5s baseline, `LayoutInvalidationTracking`): 3×108 polygon "SVG resource invalidated" (the moon's wobble clients), 3×108 path `d`-attribute (outline ×2 + divider), 3×108 twinkle-star "Inline CSS style declaration was mutated".

**A seventh painter appears whenever the pointer rests on panel chrome**: my automation left the cursor on the randomize `.icon-btn`, and its `:hover { filter: url(#wobble-celestial) }` (ControlPanel.vue:524) enrolled it in the per-beat re-raster set (node 1006 in `b1-idle-trace.json`; vanished the instant feTurbulence writes were no-op'd, test-f). A parked pointer after a click is the NORMAL idle posture — hover-wobble is a live-filter surface too.

### Why a filter-param change forces a CPU re-raster (the platform mechanics, plainly)

An SVG `url(#...)` reference filter is part of the element's PAINT, not its composite. Blink cannot animate it on the compositor (only a whitelisted set of CSS shorthand filters composite; reference filters never do). So when `SvgFilters.vue:39` writes `baseFrequency` each beat:

1. The `<feTurbulence>` attribute change invalidates the **filter resource**, which invalidates EVERY client of that filter id (measured: the write alone repainted the moon, the fx button, and the hovered icon-btn — nodes 230/187/1006 all stopped with the write patched out, test-f).
2. Each client's PaintLayer re-records its display list and its tiles re-rasterize — the FULL filter graph re-executes per pixel (turbulence noise is re-evaluated, the displacement re-sampled) at DPR2 resolution.
3. Same mechanics for the `d`-swaps: the path is INSIDE the filtered subtree, so a geometry change re-runs the grain filter even though the grain params never change — HandDrawnGrid.vue:64-77 documents exactly this, and fixed it — for the grid only.
4. Clients that aren't isolated into their own composited layer damage the **root scrolling contents layer**, and that damage is recorded full-viewport (2880×1632 @DPR2, 8×/s = ~37.6M device px/s of damage bookkeeping) — the same mechanism a1 already named: "each dirtying a feTurbulence-filtered path INSIDE the un-promoted scrolling contents layer, so Chrome records ~50 full-viewport paints/s" (evidence/addendum/a1-completion-perf.md:86). W12 moved the writes onto one beat (45 sparse writers → 8 coalesced dirty frames/s) — it fixed the CADENCE, not the ARCHITECTURE. The full-viewport paint record survived at 8/s.

### Where the "awful" actually lives

Ranked by measured cost at idle: (1) the 98–196Hz rAF/commit heartbeat — 5.3% core with zero paints (dev; ~half ships); (2) the 8Hz full-viewport root damage + 6-layer paint/raster/commit/GPU pass (~0.2–0.5% core main-thread + ~8ms/s GPU); (3) the per-beat style/layout pass (42 elements, 14.7ms/10.3s). Item 1 is invisible in a paint profiler and is why the page feels warm even "doing nothing."

---

## (b) THE PRECEDENT — what's already pre-baked vs still live

Two precedents already killed live filters where they landed:

- **The grain hoist** (tranche-1; −74.3% raster per the campaign ledger): `frameCount` pre-baked grain-filtered sibling `<g>`s, geometry bound statically, `will-change: opacity`, the beat only flips `is-active` — HandDrawnGrid.vue:195-241,256-267. **Verified working in this trace**: the grid contributes ZERO Paint records at idle; the only trace residue is 8 `boil-frame-layer` class-toggle style records ×27/13.5s (compositor-only opacity flips).
- **The grid path-swap** (pre-baked boil variants, `generateGridBoilFrames`, gridPaths.ts) — poses are pre-computed geometry, not filter animation. And the geometric bake that drops the filter entirely is already BOOKED as the escape hatch at pencilConfig.ts:184-186 ("resample @8 units, ±1.25 amplitude, wavelength 25, seed 2, filter dropped").

Inventory of every boiling surface, steady state:

| surface | mechanism today | live filter at idle? |
|---|---|---|
| board grid (settled) | pre-baked 4-sibling grain stack, opacity swap | **NO — the target state** |
| board glyphs (settled) | static `d` + cached grain raster (HandwrittenGlyph.vue:279) | no (rasters once) |
| HandDrawnOutline ×2 mounted (panel SudokuGame.vue:150,193; drawer DrawerTab.vue:38) | `d` swap per beat UNDER `grain-outline` | **YES — re-filters 8/s** |
| BoilDivider ×1 mounted (ControlPanel) | `d` swap per beat UNDER `grain-static` | **YES — 8/s** |
| celestial mascot (sun/moon, 208×208) | live `wobble-celestial` param anim + per-beat polygon re-points + inline-transform twinkles + breathe/ray transforms INSIDE the filtered svg | **YES — 8/s, the heaviest single subtree** |
| toggle icons (both bodies carry `wobble-celestial` unconditionally, DarkModeToggle.vue:19,121; inactive is `visibility:hidden`) | live filter, active one only | YES — folded into mascot cost |
| logo text (`wobble-logo`, HandwrittenLogo.vue:29) | live param anim every 4th beat | YES — 2/s (no separate paint record surfaced; it rides root damage) |
| hover chrome: `.icon-btn:hover` wobble-celestial, `.section-heading:hover` / `.ctrl-btn:hover` wobble-heart (ControlPanel.vue:503,524; OptionSelector.vue:55) | live filter while hovered | YES whenever pointer rests |
| crayon hearts (CrayonHeart.vue:88-89), fx button (dev) | live wobble-heart when visible | fx: yes (dev); hearts: when card shown |
| draw-ins, celebration, whirl, murmur | one-shot `sequence` subscribers | transient — correctly live |

So the hoist and the path-swap solved this class **exactly once each, on the grid** — every other perpetual boil still runs the live-filter architecture the grid abandoned.

## (c) FIRST-PRINCIPLES REDESIGN — the boil is N poses, never a continuous filter

The boil is BY DESIGN ~8fps stop-motion over a finite pose set (4 frames everywhere; 6 for sun rays). A finite pose set has a finite render set. Nothing about the steady state requires a filter to execute after the poses exist. The generalization of the two precedents:

**P1 — retime the beat off vsync (the Tier-1 fix, pencil-boil library).** The scheduler tick is a poll; the beat is a clock. Replace the perpetual-rAF spin with a timeout-aligned tick: `setTimeout(→ next 125ms boundary)` → ONE `requestAnimationFrame` to land the writes in a frame → sleep. Keeps rAF for write timing (no tearing), keeps the PRM/visibility gates (setTimeout throttling in hidden tabs is the parking we already want), keeps `sequence` subscribers on rAF while they run (transient). Jitter ~4ms at 8fps stop-motion is sub-perceptual. Kills ~90 of 98 main frames/s and the empty commits. This is the single highest-leverage change and it's ~30 lines in `vue.ts`.

**P2 — pre-displaced path variants for all stroke boils (outlines, dividers).** These are stroke-only geometry; the booked §2.2 geometric bake applies verbatim: fold grain INTO the pre-generated pose paths (resample + per-vertex jitter at the grain wavelength, per-frame seeds), drop `filter=` from HandDrawnOutline.vue:99 and BoilDivider.vue:47, and render the 4 poses as static siblings with opacity swap (the grid template, minus the filter). Cost: path bytes only (~2–6KB/surface); startup: pose generation already happens at mount (`generateRectBoilFrames`/`generateLineBoilFrames` — extend, don't add). Steady-state raster: zero. Risk: the grain look on a 2.5–6px stroke — the soul gate; the grid's own SSIM discipline (0.983–0.985 at settled/DPR2, pencilConfig.ts:177-186) is the acceptance harness to reuse. Fallback if the bake fails the gate: grain-hoist stacks (P3 mechanics) at ~220KB–9.6MB/surface.

**P3 — pre-rastered pose stacks for raster-content wobbles (mascot, toggle icons, logo).** These have fills/text — geometry pre-displacement doesn't apply cleanly. Generalize the grain hoist: N sibling copies, each with the wobble filter FROZEN at pose-i params (distinct static `baseFrequency`/seed per sibling — rasters once each), `will-change: opacity`, beat flips visibility. Decompose the sun so transforms leave the filter: breathe `scale` and ray `rotate` move to un-filtered ancestor containers (compositor-only), rays become their own 6-pose sub-stack, sparkles/twinkles their own 4-pose sub-stack — pose counts stay 4/6/4, never a cross-product. GPU memory @DPR2 (416×416 mascot): 4×692KB = **2.77MB**; toggle icons 4×28KB total; logo (734×238) 4×0.70MB = **2.8MB**; rays+sparkle sub-stacks ~0.5MB. **Added steady GPU ≈ 6.1MB** against the 26.7MB the grid stack already pays (4× 1292² — the precedent's own price). Startup: ~12 one-time filter rasters, spreadable across first beats.

**P4 — filter hygiene.** (i) Stop per-beat writes to filters with zero visible clients — at idle the wobble-heart write served only the dev fx button; after P3 the SvgFilters watcher (SvgFilters.vue:28-41) deletes entirely. (ii) Hover flourishes swap onto the pre-baked stack (or freeze at one pose) — a resting pointer must not re-enroll a live filter (measured node 1006). (iii) Drop the fx button's always-on filter regardless — it corrupts every dev measurement. (iv) What stays live: one-shot draw-ins, peek/hint reveals, celebration, the whirl — transient `sequence` work, correctly ephemeral.

### Options ranked

1. **P1+P2+P3+P4 (recommended).** Steady state = 8Hz opacity flips on small composited layers + a sleeping main thread. Projected from the elimination ladder: paints 47.6/s → ~0; full-viewport root damage → none (every remaining animated surface is an isolated promoted stack); main-thread floor 5.3% → well under 1% core (test-g measured 5.3% was ALL heartbeat — P1 removes it); GPU ~8ms/s → ~0 between pose flips. ~6MB GPU, one-time startup rasters. The grain hoist's −74.3% extends to effectively 100% of steady-state raster.
2. **P2+P3+P4 without P1** — kills all raster but keeps the 98Hz heartbeat: the profiler goes quiet, the CPU doesn't. Half-measure; W12 already demonstrated cadence-only fixes leave the floor.
3. **P1 only** — cheapest (one library file), biggest single number, but keeps 8Hz full-viewport damage and the DPR2 filter re-rasters; the moon still simmers.
4. **Geometric bake everywhere incl. mascots** (vectorize wobble into paths, no stacks) — max perf, minimum memory, but re-litigates the soul gate on fill-heavy art with no precedent pass; not worth it when P3's memory cost is 6MB.

**Recommendation: option 1**, sequenced P1 → P2 → P3 → P4, each behind the SSIM soul gate the grid already established, each verifiable by re-running this lane's trace recipe (target: 0 recurring Paint records, ≤8 main frames/s, no full-viewport clips).

— traces, scripts, and screenshots beside this file; page state restored (dark mode, fx visible, patches removed) after measurement.
