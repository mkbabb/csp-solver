# r1-perf — performance beyond the Safari finding (Chromium + WebKit)

Repo HEAD 65425697. Rig: fresh `dist/` (the shipped tree), served by my own
`vite preview --port 4202 --strictPort` (owner's :3001 untouched; :4188 left to the
safari lane; :4202 was free). Driver: playwright chromium-1228, **DPR2, 1440×900**,
CDP `Tracing` timeline. Every probe rerunnable in `perf-probes/` beside this file:
`murmur-trace.mjs` (solved/baseline paint+raster tally), `mem-idle.mjs` (heap/DOM/listener
leak sweep), `startup.mjs` (nav timing + waterfall), plus a PRM one-liner banked below.
Raw output: `perf-probes/out-{baseline,solved,mem}.json`.

Input taken as established (not re-litigated): the WebKit grid-boil finding and its six
folded corrections (`../../tranche3/safari/{s1,s2,s3,crit-safari}.md`). This lane goes
FURTHER on both engines.

---

## The comparative baseline (my first-party numbers, Chromium DPR2)

| trace (20–25s) | Paint/s | RasterTask/s | DrawFrame/s | Commit/s (main frames) | full-viewport Paints |
|---|--:|--:|--:|--:|--:|
| **unsolved idle** (`out-baseline.json`) | **0** | **8.0** | 8.0 | 8.7 | 0 |
| **solved, settled murmur** (`out-solved.json`) | **4.8** | **10.4** | 10.2 | **35.3** | **60 (2.4/s), all 1440×900** |
| **PRM (beat frozen)** (banked one-liner) | 0 | **0** | 0 | 0 | 0 |

The unsolved→solved delta is the whole story of this lane: a settled *solved* board is
NOT idle on Chromium — it climbs to 4.8 Paint/s (every one full-viewport) and 35.3
main-thread frames/s, from a 0-Paint / 8.7-frame baseline. PRM zeroes everything, proving
100% of it is beat/animation-driven, not layout.

---

## P1 — the solved-board murmur damages the FULL VIEWPORT per wiggle (both engines; the record calls this fixed)

**What.** Once a solve settles, the classroom murmur wakes one solved cell per 2.5 s
window for a single 600 ms wiggle (`celebration.ts:85-91` setTimeout chain →
`HandwrittenGlyph.vue:140-159` `murmurWiggleOnce` → `glyphAnimations.ts:88-131`
`createGlyphFlourish`, which `setAttribute('d')` on the glyph path). That path carries
`filter="url(#grain-static)"` (`HandwrittenGlyph.vue:290`) — and unlike the draw-in, which
drops the tooth for the duration (`grainOn.value = false`, `HandwrittenGlyph.vue:175`), the
**murmur wiggle keeps `grainOn=true`**, so every `d` swap re-executes the grain filter.

**Sized.** During the murmur, Chromium issues Paints whose clip is **1440×900 — the entire
CSS viewport** (`out-solved.json` `largestPaints` = five `1440x900`; `sampleFullVpDims` =
`1440×900` ×3): a ~40×56px single-cell glyph swap forcing a full-root-layer repaint at DPR2
(1440×900×4 = 5.2 M device px rastered per wiggle frame). 60 such full-viewport Paints in
25 s (2.4/s averaged; ~20/s *inside* a wiggle window), and the main-thread frame rate
quadruples 8.7→**35.3 commits/s**. A downstream tell in the same trace:
`IntersectionObserverController::computeIntersections` jumps ~17/s→~70/s (1766 fires in 25 s)
— the full-viewport damage drags intersection/layout recompute with it.

**Why full-viewport.** This is the *exact* damage class `SvgFilters.vue:20-23` documents as
RETIRED for the old per-beat `baseFrequency` write: *"an SVG reference filter is part of its
clients' PAINT … damaged the root scrolling layer full-viewport, 8×/s."* The murmur
re-introduces it — a filtered SVG sub-element whose content changes, with the cell **not
layer-isolated** (no `will-change`/`contain` on the cell or glyph, confirmed in
`SudokuCell.vue`/`HandwrittenGlyph.vue` scoped styles), so Chromium expands the invalidation
to the root scrolling layer.

**The record claims this is handled.** `glyphAnimations.ts:104-111` (write-dedup) says it
cut *"the settled solved page's murmur … ~30 paints/s tax"* by writing only on a real swap.
Measured: it cut the paint COUNT, not the full-viewport-damage-per-paint — 4.8 full-viewport
Paints/s persist. green-over-broken: the comment reads as a closed defect; the viewport
damage is live on every solved board. On WebKit this compounds crit-safari directly (each
grain re-raster is the ~150–224 ms board-area cost class, now also triggered by the murmur).

**Fix shape (within the pose/one-shot grammar, no new architecture):**
1. *Cheapest, already-sanctioned:* reuse the draw-in's discipline — drop `grain-static`
   (`grainOn=false`) for the 600 ms wiggle window, restore on `onDone`. Removes the live
   filter re-raster (`HandwrittenGlyph.vue:175` proves the pattern is safe here).
2. *Kills the full-viewport half directly:* layer-isolate the animated cell —
   `contain: paint` (or a transient `will-change`) on the cell/glyph wrapper so the murmur's
   invalidation clips to the ~40×56 cell box, not the root layer. CSS-only, filter kept.
3. *Unified with s3:* the bitmap-pose-cache generalized to glyph variants (bake each variant,
   opacity-swap baked layers). Heaviest (81 cells × N poses) — reserve for the WebKit-critical
   surfaces, prefer (1)+(2) for glyphs.

**Probe:** `node perf-probes/murmur-trace.mjs http://localhost:4202/ 25 solved 8`
vs `… 20 baseline`. family_hint: `filtered-elt-rootlayer-damage`

---

## P2 — the ~8/s Chromium RasterTask residue: bitmap-cache kills it ONLY in the N-layer variant, not s3's single-canvas one

**Confirmed & attributed.** Unsolved idle Chromium is **8.0 RasterTask/s + 8.0 DrawFrame/s
with 0 Paint** (`out-baseline.json`) — the grid grain-hoist's four `filter=url(#grain-static)`
`.boil-frame-layer` siblings, opacity-swapped on the ~8 Hz beat. PRM (frozen beat) →
**0 RasterTask/s** (banked probe), so the residue is 100% beat-driven compositor raster, not
main-thread. (Matches the ledger's *"idle 0 paints / 7.99 fps"* — the 0 is main-thread Paint;
the 8/s is the compositor RasterTask that phrasing omits.)

**The mechanism the two falsified fixes missed.** A *filtered* layer's opacity flip in
Chromium is NOT a free compositor blend — the filter result is not a stable cached texture, so
the compositor re-rasters the tile each beat (hence 8 RasterTask/s despite 0 Paint). s2's own
fixture proved the complementary fact: *resident filtered siblings that never flip cost 0*
(`s2.md:36-39`), and *a static filter rasters once* (`s2.md` L28-F1). So the raster is bought
by the **flip of a filtered layer**, precisely.

**Reasoned answer to the lens.** The bitmap-pose-cache is the third fix that kills the 8/s —
**but only in the N-static-bitmap-layer + opacity-swap variant** (s3 §3 "N-bitmap-layer
variant"). Baked `<img>`/`<canvas>` layers are stable textures; opacity-swapping them is a
pure compositor blend → **0 RasterTask**. s3's *other, preferred* variant — a single `<canvas>`
that `drawImage`s the pose bitmap every beat (`s3.md:278-292`) — does NOT reach zero: a
per-beat canvas mutation is itself a raster of that canvas's tile, so it trades a
feTurbulence-raster for a bitmap-blit-raster (cheaper, still ~8 RasterTask/s). s3 conflates the
two as both "one blit" (`s3.md:127-140`); for the RasterTask-residue goal they are not
equivalent. **Recommendation to the fix lane: mandate the N-layer opacity-swap variant for the
grid if zeroing the Chromium raster residue is a goal; the single-canvas variant leaves it.**

**Probe:** baseline vs PRM in `murmur-trace.mjs` / the banked PRM one-liner (below).
family_hint: `filtered-layer-flip-raster`

---

## P3 — startup, bundle, memory: verified, with two minor notes

### Memory — NO LEAK (clean, reported to close the lens)
`mem-idle.mjs`, solved+murmuring, GC forced each sample, 11 samples over ~200 s
(`out-mem.json`): JS heap **flat 5.30→5.35 MB (+0.05, noise)**; DOM nodes **flat 1742**;
JS listeners **flat 648**. The murmur's setTimeout chain + transient `sequence` subscribers
clean up (`celebration.ts:78-91`, `glyphAnimations.ts:124-128` self-remove; `boilBeat.ts:48-52`
ref-counted `onUnmounted`). No effect-scope / subscription growth. Caveat: 3.3 min, not the
full 10 (budget); the flat trend across forced-GC samples is strong. GPU-resident not
measurable headless — if the s3 bitmap cache ships, its ~35 MB residency (`crit-safari.md:116`,
independently reconfirmed) is the number to watch, not a current leak.

### Startup — HEALTHY (no finding)
`startup.mjs`, cold context, DPR2: DCL 54 ms, **FCP=LCP=72 ms**, load 55 ms (localhost — not
network-bound). `head-hints` (`vite.config.ts:128-171`) correctly injects modulepreload for
vue-vendor/animation-vendor/both workers, `preload as=fetch` for wasm, `preload as=font` for
the 3 woff2; `font-display:swap` on all three faces (`dist/assets/index-*.css`). Critical
transport is lean: index.js 44 KB gz + vue 30 KB gz + css 13 KB gz + animation 2.7 KB gz
≈ 90 KB gz, plus wasm 86.7 KB preloaded. No blocking-priority app JS. Nothing to fix here.

### Bundle notes (P3)
- **pencil-boil tree-shakes cleanly.** 22 named symbols imported across 16 files; the
  `animation-vendor` chunk is **6,617 B (2.7 KB gz)**; `pkg.sideEffects:false`. Dev-only
  surfaces (`FilterTuner`, `rafInstrumentation`, `schedulerDebugInfo`) are **absent from the
  prod bundle** (grep = 0 in `index-*.js`/`animation-vendor-*.js`). No pencil-boil bloat.
- **Two `solver.worker` chunks are both modulepreloaded at startup** (`dist/index.html`:
  `Cy6Z_m2a` + `D4X3ZJVp`, 10.7 + 10.85 KB) though only the default game (sudoku) is active;
  the futoshiki worker preload is speculative (`headHints` loops *all* `solver.worker*` files,
  `vite.config.ts:143-147`). Low cost (preload hint, ~3.3 KB enc each), but it is speculative
  work on the cold path. family_hint: `speculative-preload`
- **The census's "445KB precache" is stale** — already caught by r1-pwa P3-1 (true precache
  633 KiB incl. 192 KB install-only PNGs). Cross-referenced, not re-filed. The transport-
  critical subset (offline play) is ~90 KB gz + 86.7 KB wasm + 17.7 KB woff2.

---

## Banked probes

```
# baseline (unsolved) vs solved-murmur paint/raster tally, Chromium DPR2:
node perf-probes/murmur-trace.mjs http://localhost:4202/ 20 baseline
node perf-probes/murmur-trace.mjs http://localhost:4202/ 25 solved 8

# PRM (beat frozen) — proves the 8/s RasterTask is 100% beat-driven → 0:
node --input-type=module -e 'import {chromium} from "<fe>/node_modules/@playwright/test/index.mjs";
const b=await chromium.launch({headless:true});
const c=await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:2,reducedMotion:"reduce"});
const p=await c.newPage(),cdp=await c.newCDPSession(p);
await p.goto("http://localhost:4202/",{waitUntil:"networkidle"});await p.waitForTimeout(1500);
const ev=[];cdp.on("Tracing.dataCollected",m=>{for(const e of m.value)ev.push(e)});
await cdp.send("Tracing.start",{categories:"disabled-by-default-devtools.timeline,devtools.timeline",transferMode:"ReportEvents"});
await p.waitForTimeout(15000);const d=new Promise(r=>cdp.once("Tracing.tracingComplete",r));await cdp.send("Tracing.end");await d;
const by={};for(const e of ev)by[e.name]=(by[e.name]||0)+1;console.log("RasterTask",by.RasterTask||0);await b.close();'

# memory leak sweep (solved, GC-forced, 200s):
node perf-probes/mem-idle.mjs http://localhost:4202/ 200 20

# startup nav timing + waterfall:
node perf-probes/startup.mjs http://localhost:4202/
```
(`<fe>` = `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend`)
