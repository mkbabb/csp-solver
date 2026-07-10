# G7 — felt-perf trace: solve / generate / size-switch / marks(peek) @ DPR2

Lane: PASS 3, felt-perf trace. Charter: synthesis §"Open questions" item 11 + §2.3 A24-G7 row —
land the driven-browser trace that converts A17's PLAUSIBLE-not-measured felt-latency rows to
measured. QUIET BOX honored (siblings G3/G5/G6/G8/G10 already reported; harness/live-instance facts
reused from G10, not re-litigated).

Harness: `pass3/g7-harness/probe-felt.mjs` (Playwright/Chromium from the frontend's own
`node_modules`, the G10-proven driven-real-browser path). Raw: `felt-results.json` (run 2) +
`felt-results-run1.json` (run 1). Shots: `pass3/g7-shots/`. Live app: **http://localhost:3210**
(the running Vite instance; :3000 is its HMR socket per G10 §0). Every gesture at **DPR2**
(`deviceScaleFactor: 2`, the retina/2×-raster case), each run **unthrottled AND at 4× CPU**
(CDP `Emulation.setCPUThrottlingRate`), **N=2 samples**. Method: rAF-gap sampling — the sampler
ticks on the main thread, so a gap between ticks *is* a main-thread block; the largest gap is the
worst felt frame, and gaps over 16.7/50/100 ms are the dropped-frame counts.

**Machine/build disclosure (load-bearing — read before trusting a number):** Apple M5 Max, 2026-07-10,
against the **dev server** (Vite, unbundled ESM), not the production `dist/` build. Consequence:
(a) the **CPU-bound gesture costs are representative** — same components, same `generateGridPaths`,
same reveal/marks code paths as prod; (b) the **cold-start network half is NOT** — localhost fetch
is instant, so P1's real cost (the 40 KB-br wasm compile after a real-network fetch) stays A17's
wire analysis, not re-measured here; (c) **P4's chunk-graph cost is invisible** on an unbundled dev
graph. The 4× throttle is a proxy for a mid device; real mid-range mobile single-thread is ~6–20×
slower than this core, so every 4× worst-frame below is a **floor** for mid-device felt, not a ceiling.

---

## The felt-latency trace (both samples; worst-frame ms = the felt hitch)

| Gesture @ DPR2 | worst frame 1× (ms) | worst frame 4× (ms) | **4×/1× ratio** | >16ms drops (1×) | >50 / >100ms (4×) | reveal peak | cell remounts | A17 tie |
|---|--:|--:|--:|--:|--:|--:|--:|---|
| **size-switch 9→16** | 28 / 28 | **99 / 103** | **3.54 / 3.68** | 20 / 21 | 2 / 2·(1 over100) | 111 | **175 → 256** | **P2/P3 CONFIRMED** |
| **marks/peek 16×16** | 33 / 33 | **87 / 91** | **2.64 / 2.76** | 5 / 6 | 2 / 2 | 111 | 0 (~2.7k mark nodes) | **NEW row** |
| **solve** | 28 / 27 | 62 / 55 | 2.21 / 2.04 | 48 / — | 1 / 0 | 46 | 0 | not ranked — OK |
| **generate** | 37 / 36 | 65 / 69 | 1.76 / 1.92 | 12 / — | 1 / 0 | 35 | 0 | not ranked — OK |
| **marks/peek 9×9** | 27 / 29 | 31 / 36 | 1.15 / 1.24 | 1 / 4 | 0 / 0 | 35 | 0 (506 mark nodes) | served-default: free |
| cold-start TTI (dev) | 340 / 112 | 372 (—) | dev-only | — | — | — | — | P1 structural only |

Counts stable across both samples; ratios reproduce within ±0.15. Full per-run JSON in the harness dir.

---

## What the trace establishes

### 1. The size-switch is the sharpest felt hitch — A17 P2/P3 CONFIRMED, and it's uniquely a *remount*
`9→16` is the only gesture that **remounts cells** (175 mount-mutations landing 256 `.sudoku-cell`s;
every other gesture is `mounts: 0` — a value/reveal update on persistent cells). It is also the only
gesture whose worst frame is CPU-*dominated*: unthrottled 28 ms → **4× 99–103 ms, ratio ~3.6×, the
highest of any gesture, and the only one to cross 100 ms** (`over100: 1` at 4×). This is exactly
A17 P2's mechanism measured live: the synchronous `generateGridPaths` full frame+line+256-ghost pass
(uncached) **plus** 256 cell mounts **plus** the grid-template recalc, all in one main-thread burst,
at DPR2 rastering 256 wobble-path cells at 2×. On this M5 Max at 4× it's 100 ms; on a real mid device
(≥6× multiplier) it lands squarely in — or past — A17's disclosed **100–150 ms band**. **This is the
strongest single argument for the W8 `generateCellRects` extraction + LRU cache (A17 P2/P3, synthesis
§2.3).** The fix target is now measured, not inferred.

### 2. Marks/peek at 16×16 is a SECOND heavy gesture A17 never traced — a NEW felt row
The hold-to-peek marks gesture (`K` → `setMarksActive` → `refreshMarks(0)` → `propagateBoard`
worker round-trip → candidate mini-grids mounted across every empty cell) mounts **~2,700 mark nodes**
at 16×16 and produces a **4× worst frame of 87–91 ms (ratio ~2.7×)** — the second-largest CPU-sensitive
burst, and A17's ranked rows (P1–P7) **never covered the peek/marks path**. This matters because
A23 calls hold-to-peek "the app's best moment," it's a **served web size** (N=4/16×16 is in the
in-browser tier), and the worker round-trip is off-thread so the entire felt cost is the
main-thread mark-grid mount — the same class of fix as P2 (idle-chunk the mount, or cap/virtualize
mark rendering at 16×16). Recommend **synthesis add a felt row: "marks/peek 16×16 mount burst"**,
adjacent to P2/P3, gated by the same W8 trace.

### 3. Solve & generate are felt-smooth — correctly *unranked* by A17
Neither remounts (`mounts: 0`); both are distributed reveal waves (46 / 35 cells over ~3 s), so the
worst frame stays ≤69 ms even at 4× and `over100` never fires. A17 ranked neither — the trace
confirms that judgment. The reveal wave's `over16: 48` on solve is *by design* (many small
animated frames), not a hitch.

### 4. The served default (9×9) is essentially free
9×9 marks/peek: ratio ~1.2×, worst ≤36 ms at 4×, `over50/over100 = 0`. **Every felt problem this
lane found is 16×16-specific** — the switch *into* 16, and marks *at* 16. Since N=4 (16×16) is a
served in-browser size, these are user-reachable on the deployed web path, not native-only.

### 5. Cold-start: structural corroboration only (dev server ≠ production network)
Dev TTI-to-first-cell was 112–372 ms and is **not a production proxy** (localhost fetch is instant;
run-to-run swing 112↔340 ms unthrottled is Vite dep-cache warmth, not app behavior). The durable
finding is structural and reproduced in **both runs**: the served `index.html` head carries
**zero `modulepreload`, zero wasm preload, zero worker `modulepreload`, zero font preload** —
corroborating **A17 P1 (no worker/wasm prewarm) and A17 P5 (no font preload)** at the source level.
The real cold-start latency figure stays A17's wire analysis; this lane confirms the *mechanism*
(nothing warms the chain), not a production millisecond count.

---

## Disposition for the wave plan

- **A17 P2/P3 (W8 `generateCellRects` + LRU cache):** graduates from PLAUSIBLE to **MEASURED** —
  ratio 3.6×, 100–103 ms @4×, the only >100 ms gesture, the only remount. W8's before/after
  gate should assert the size-switch worst frame drops below the P2 band; this harness (`probe-felt.mjs`)
  is the reusable before/after instrument.
- **NEW row — marks/peek 16×16 mount burst:** ~2.7k node mounts, 87–91 ms @4×, ratio 2.7×; not in
  A17's ranking. Recommend folding into W8 adjacent to P2/P3 (same idle-chunk/cache class).
- **A17 P1/P5 (W8 preload injection):** the "no prewarm/no preload" premise is **structurally
  confirmed** (both runs, head-hint census); the millisecond payoff remains A17's wire estimate —
  W8's cold-cache before/after must run against the **built `dist/`**, not the dev server, to size it.
- **A17 P4 (Rolldown chunk pathology):** **out of this lane's reach** — unbundled dev graph. Stays
  a `dist/`-served trace; flag for the W8 gate to run against a preview build.
- **Solve / generate:** measured felt-smooth; **no wave action** — confirms A17 didn't rank them.

## Method limits (honest)
Single machine (M5 Max); dev server not `dist/` (P4 invisible, cold-start network non-representative);
4× throttle is a mid-device *floor*, not the real multiplier; N=2 samples (counts stable, worst-frame
±~5 ms, ratios ±0.15); rAF-gap sampling catches main-thread blocks and dropped frames but not
sub-frame paint jank within a rendered frame; worker round-trip elapsed is off-main-thread and not
separately surfaced (the felt cost measured is the main-thread reaction). The CPU-bound conclusions
(rows 1–4) are robust to all of these; the cold-start row is deliberately reported as structural-only.

*All figures measured this session (2026-07-10) against localhost:3210, working tree `5f9980c8`+dirty,
Apple M5 Max, DPR2, headless Chromium via the frontend's own Playwright install. Two full-battery samples.*
