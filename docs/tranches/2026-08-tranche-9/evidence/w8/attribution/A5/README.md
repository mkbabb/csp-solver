# A5 — THE DARK TOGGLE'S FIRST INVOCATION (T9-W8 §8.1, attribution only)

2026-09-17 · HEAD `58014efd` · dist entry `index-9rZPzI5DEcpe.js` (identity unmoved across the
whole reading set: `dist-identity-before.txt` == `dist-identity-after.txt`) · served by
`vite preview` on :4254, never rebuilt.

**The owner's mark (T9-M06)**: "First page load performance on mobile safari … is poor for
drawing, dark mode toggle, etc. Subsequent invocations are better." The first invocation is
**8 pose bakes** — the whole dark stack of two theme-keyed surfaces — and every invocation
after it is **zero**.

## What the instruments are

| file | what it is | how to run it |
| --- | --- | --- |
| `toggle-probe.mjs` | cold load → board-ready → N toggles; wraps `toBlob`/`toDataURL`, samples every rAF delta, `PerformanceObserver('longtask'\|'resource')`, CDP `Performance.getMetrics` around each click | `cd web/frontend && node …/toggle-probe.mjs --engine chromium --throttle 4 --viewport desk --net fast3g --port 4254 --windows 3 --toggles 4 --out raw.jsonl` |
| `run-matrix.sh` | the seven cells, sequentially, host loadavg banked between | `cd web/frontend && bash …/run-matrix.sh` |
| `trace-restyle.mjs` | the CDP `devtools.timeline` half — elements restyled, main-thread event census per toggle | `cd web/frontend && node …/trace-restyle.mjs --throttle 4 --port 4254` |
| `make-tables.mjs` | folds `raw-all.jsonl` into `tables.md` | `node …/make-tables.mjs` |
| `raw-all.jsonl` | every window of every cell, one JSON line each (`cell` names it). Boot-bake lists are censused per window (surface → count, box, Σ ms) rather than listed — the evidence-policy compaction, stated; boot-bake DETAIL is A1's lane. Every toggle-window field is untouched, bake by bake | — |
| `matrix.log` · `tables.md` · `trace-restyle.txt` | the run log with loadavg at each cell's start and finish · the folded tables · the trace | — |

**board-ready**, one definition, exactly as chartered: `.board-group` VISIBLE (it is `v-show`n
and both control-panel twins are always mounted — the probe filters on client rects +
computed display/visibility) AND the first `.cell`-class element's `getBoundingClientRect` is
non-zero AND one rAF after that, timestamped `performance.now()` from navigationStart. One
refinement, banked because it changes which element is measured: `[class*="cell"]` inside
`.board-group` matches the SVG grid paths `cell-line` first, and those are ink, not cells (the
literal first is 0×0 forever, a later one is not). The probe takes the first element carrying a
class TOKEN equal to `cell` or ending `-cell` — i.e. DigitCell's frozen contract. Every reading
reports the element it measured: `game-cell`, in all 9 cells.

**settle**, defined once and used for every number in the toggle table: activity = a bake
completion (`toBlob` callback), a long-task end, or an rAF delta > 33.4 ms. `settle` is the LAST
activity after the click, declared once 400 ms have passed with no further activity, ≥2 rAFs
have fired, and the 1 100 ms whirl window has elapsed. **click→settle = settle − click.** A
`0` in the table is literal and means what it says: nothing after the click reached the
activity threshold — no bake, no long task, no frame over 33.4 ms.

**Windows and host.** 3 windows per cell, median reported, per-window spread banked. Zero
tainted windows across the set (no blur, no visibilitychange, no 1000–1300 ms lone delta). Host
loadavg 3.66 → 9.12 over the session, printed at every cell boundary in `matrix.log`; up to six
sibling lanes shared this host. The in-page rAF control (1 000 ms of idle cadence taken in the
same document immediately before the first click) held 120.4–120.8 fps chromium / 60.3–60.8 fps
webkit with **0** long33 in every cell, so the cadence was intact everywhere. `webkit-desk-cold`
was re-taken at a materially higher load (4.14→6.34 first, 6.79→9.12 on the retake) and
reproduced: 338 ms vs 308 ms median first-toggle, 8 bakes both times.

## The toggle table

See `tables.md` for the full fold. The spine:

| cell | N1 click→settle | N2 | N3 | N4 | N1 bakes | N2–N4 bakes | Δ(N1−N2) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| chromium 4× desk cold fast-3G | **1213.8 ms** | 195.4 | 110.3 | 100.7 | **8** | 0 | **1018.4 ms** |
| chromium 6× desk cold fast-3G | **1921.1 ms** | 234.1 | 181.1 | 424.7 | **8** | 0 | **1687.0 ms** |
| chromium 4× mobile 390×844 dpr3 | **981.2 ms** | 99.2 | 99.5 | 93.9 | **8** | 0 | **882.0 ms** |
| chromium 4× desk WARM (cache on) | **1233.9 ms** | 93.8 | 100.1 | 94.4 | **8** | 0 | **1140.1 ms** |
| chromium 1× desk unthrottled | 311.2 ms | 0 | 0 | 0 | **8** | 0 | 311.2 ms |
| webkit desk cold (unthrottled) | 338 ms | 0 | 0 | 0 | **8** | 0 | 338 ms |
| webkit desk cold — RETAKE at load 9 | 308 ms | 0 | 0 | 0 | **8** | 0 | 308 ms |
| webkit mobile cold (unthrottled) | 158 ms | 0 | 0 | 0 | **8** | 0 | 158 ms |
| chromium 4× desk, **booted DARK** | **1202.4 ms** | 101.6 | 107.9 | — | **8** | 0 | **1100.8 ms** |

The whirl, same windows (rAF frames in [click, click+1100 ms]):

| cell | N1 whirl frames / fps / worst | N2+ whirl frames / fps / worst |
| --- | --- | --- |
| chromium 4× desk | 6 / **5.5 fps** / 207.6 ms | ~100 / 91.5 fps / 58.3 ms |
| chromium 6× desk | **0 frames in the whole 1 100 ms window** | ~88 / 80.1 fps / 100.6 ms |
| chromium 4× mobile | 28 / 25.5 fps / 157.8 ms | ~102 / 92.9 fps / 51–58 ms |
| webkit desk | 49 / 44.7 fps / 271 ms | ~63 / 57.7 fps / 26–30 ms |
| webkit mobile | 58 / 52.8 fps / 128 ms | ~65 / 59.3 fps / 18 ms |

The Bloom is a ~1 010 ms gesture. At the rig's GATE D rate it gets six frames; at 6× it gets
none. That is the owner's "poor", measured.

## The attribution

**It is the bake, and only the bake.** The first toggle runs 8 `toBlob` captures and every
later toggle runs 0, in every engine, at every throttle, at both viewports. Surfaces, by
capture box (chromium 4× desk, window 1):

- **4 × wordmark** `765×224` device px — `HandwrittenLogo.vue:343`, `cacheKey: logo-${label}-${isDark ? "d" : "l"}-${vbWidth}`
- **4 × grid hoist** `1272×1272` device px — `HandDrawnGrid.vue:216`, `cacheKey: grid-${boardSize}-${subgridSize}-${isDark ? "d" : "l"}`

Per-pose wall at 4×: wordmark ~1 000 ms each, grid 288–1 049 ms each, overlapped — 6 790 ms of
summed encode wall inside a 1 214 ms click→settle. On mobile dpr3 the grid box is `1092×1092`
and the first toggle is 981 ms. The toggle's OWN poses never re-bake: `DarkModeToggle.vue:566`
keys `celestial-sun`/`celestial-moon` with no theme token, and the readings agree — zero
celestial captures on any toggle, 16 of them at boot.

**Why the second invocation is free.** `useRasterStack`'s pose cache (`pencil-boil/dist/vue.js`,
`DEFAULT_POSE_CACHE` 4) keys on the FULL capture identity — `cacheKey|dpr|WxH|poseCount` — and
holds 4 stacks. Two surfaces × two themes = exactly 4 residents, which is what the library's own
note says the default was measured for. So within one document the light stacks survive the trip
to dark and come back byte-identical, and toggles 2..N cost zero encodes. **The cache is
per-document.** The warm cell proves the consequence: an HTTP-warm load reaches board-ready in
310.9 ms instead of 1369.9 ms, and still pays **1233.9 ms** on its first toggle. Every new page
load buys the first-invocation cost again.

**Not dark — the theme you are not in.** Booting with `sudoku-color-scheme=dark` in
localStorage and toggling dark→light costs 1202.4 ms and 8 bakes, indistinguishable from
light→dark's 1213.8 ms. The cost is symmetric. `raw-all.jsonl`, cell
`chromium-4x-desk-cold-fast3g-STARTDARK`.

**The four other suspects, refuted with numbers:**

- **Font re-fetch** — refuted. Across every window of every cell, post-click `resource`
  entries: 5 total, all `fraunces-subset-…woff2` with `transferSize 0` and `duration 0` — a
  memory-cache re-report of the preload link, not a fetch. No network on the flip, at all.
- **The `@theme` flip's cascade** — refuted as the first-invocation cost. The flip is a class
  on `<html>` (vueuse `useDark`, `selector: html`, `attribute: class`, `valueDark: "dark"`;
  `useTheme.ts`). The whole estate carries **8** rules whose selector mentions `.dark`, **37**
  declarations, **30** of them custom properties, over a 1 213-element document
  (`trace-restyle.txt`). And the trace runs the wrong way: `UpdateLayoutTree` on toggle 1 is
  100.8 ms / 6 083 elements, on toggle 2 it is **256.9 ms / 16 713 elements** and on toggle 3
  **275.1 ms / 20 421**. The cheap toggles restyle MORE, because on the expensive one the boil's
  per-beat restyles are starved out. Style recalc is not the defect; it is the defect's victim.
- **wasm / solver** — refuted. No wasm, worker or solve activity appears in any post-click
  window; the board is already dealt at board-ready and the flip touches no puzzle state.
- **Image decode of the other theme's bitmaps** — priced, and small. The trace shows
  `Decode Image` 59.5 ms / 28 on toggle 1 and 56.5 ms / 24 on toggle 2 — the boil's steady
  decode of already-resident poses, essentially flat across invocations. The first toggle's
  extra is not decode; it is **`EventDispatch` 937.9 ms (n=58) on toggle 1 against nothing in
  the top twelve on toggles 2 and 3** — the blob-SVG `load` → `drawImage` → encode chain that
  `rasterizePoseToBlob` runs per pose, on the main thread.

**Why the Bloom dies rather than degrades.** The gesture is `transform` transitions on an SVG
`<g>` with `transform-box: view-box` that is *the input to the filter chain*
(`DarkModeToggle.vue`, `.warp`, 340 ms accel-in / 800 ms springPop, plus a 1 010 ms `plush-land`
keyframe). An SVG transform feeding a filter is main-thread raster by construction in both
engines — it cannot be handed to the compositor without changing what is drawn. So main-thread
starvation does not slow the whirl, it stops it: 0 frames at 6×.

*Instrument honesty*: the whirl columns are **main-thread rAF gaps**, which price main-thread
starvation. They are the right unit for this defect (the warp IS main-thread), but they are not
a presentation-accurate frame timeline; a presentation reading belongs to 8.3's device
instrument. WebKit has no `longtask` entry type, so every webkit long-task and recalc cell reads
**NOT MEASURED**, never 0 — and no webkit number here is a Safari number or an iOS claim.

## Cure candidates (8.2 shapes them; the law check is here)

1. **Pre-warm the other theme's critical stacks at idle** — MECHANISM. After board-ready, on
   `requestIdleCallback`, bake the 8 poses the other theme needs and `retain()` them under their
   own capture identity, without swapping `urls` and without touching `<html class>`. The seam
   exists: `resolveCssValue(el, prop, fallback)` (`rasterPose.ts:102`) already takes the element
   whose cascade it resolves against, so a detached probe element carrying `class="dark"`
   resolves the other theme's 30 custom properties with no page-visible flip; the cache already
   holds 4 stacks, which is exactly 2 surfaces × 2 themes. Same bytes, same pixels, earlier.
   Lands at the library seam (`useRasterStack` gains a prewarm) or app-side as a hidden twin —
   8.2 picks. **Expected move: N1 → N2's number** (1213.8 → ~100–195 ms at 4×; Δ → the noise
   floor). π identity untouched (identical pose SVGs → identical bitmaps), filterBudget 9
   untouched (no new filter).
2. **Bake-on-idle, serialized** — MECHANISM. Whatever is not yet visible waits for idle, and
   the 8 pre-warm encodes are yielded one per idle callback rather than issued as one
   `Promise.all` burst (`vue.js` issues all poses at once). Keeps the boot path clear of the
   pre-warm's own cost. Same pixels.
3. **Split the flip from the bake** — MECHANISM. Even pre-warmed, a cold-cache miss (a DPR or
   viewport change between boot and toggle) re-enters the bake. Hold the whirl's first frames on
   the retained stack — which the atomic-swap discipline already does — and defer the re-bake to
   the first idle AFTER the gesture window rather than starting it inside it. Nothing dropped,
   only reordered.
4. **Compositor-only whirl** — **REFUSED as stated.** Moving the warp off the SVG group onto a
   promoted wrapper transform means the filter's output is scaled instead of its input, which is
   precisely the vector-crisp property the surface is built on (`DarkModeToggle.vue`: "transform
   INSIDE the filter input, so each frame is vector-crisp by construction"). That trades drawn
   quality for frames — the M09 law forbids it. The mechanism answer is to remove the
   contention (1–3), not to move the warp.
5. **Shorten the 1 010 ms Bloom / thin the boil during the flip / drop a grid pose** —
   **REFUSED**, named so the next reader does not re-propose them. All three buy the number by
   spending the drawn quality.

## Born-RED gate candidate

`boot.firstThemeToggle.maxFirstInvocationDeltaMs` — **first-toggle latency**, expressed as the
DELTA the defect actually is: `N1_clickToSettle − median(N2..N4)` on one device, one session,
one cold load. A delta is the portable unit here for the same reason GATE B transposes to
%-of-ceiling: it cancels the device's own speed and prices only the first-invocation work.
Born RED at HEAD by construction — 8 encodes on N1, 0 after — and RED on this tree's proxy at
**1018.4 ms** (chromium 4× desk), **882.0 ms** (4× mobile dpr3), **1687.0 ms** (6×),
**1140.1 ms** (HTTP-warm). Threshold to be SET from 8.3's device baseline, not from these:
proposed shape ≤ 150 ms, i.e. the pre-warm has to collapse the delta into the noise floor.

**Device method (for the 8.3 owner-run instrument, E8/CH-35 ten-minute shape)**: load the
deployed edge cold (cleared website data), wait for board-ready by the definition above, wait
2 s, then tap the celestial toggle four times with ≥2 s between taps; per tap record
click→settle by the settle rule above, the `toBlob` count (the same wrapper this probe
installs), and the rAF frame census across the 1 100 ms whirl; export the four rows with one
tap. Pass = `N1 − median(N2..N4) ≤ threshold` AND `N1 bakes == 0`. Real Safari and real iOS are
out of scope for THIS session (M19) — nothing here is a device number.

## Routed elsewhere

- **W7 (controls/transitions grammar)**: `color-scheme` is declared nowhere in the estate
  (`getComputedStyle(document.documentElement).colorScheme === "normal"` while `<html>` carries
  `.dark` — `trace-restyle.txt`). UA surfaces (scrollbars, form controls, the native
  `cell-native-input`) stay light in dark mode. Quality, not perf; not this lane's cure.
- **A1/8.2 (boot)**: boot takes **28** bakes in chromium (16 celestial, 8 grid, 4 wordmark) and
  20–24 in webkit. The grid's 8 is two full 4-pose stacks — a first bake and a re-bake at the
  settled box. A boot lane should price that second grid stack.
- **W7 (the Bloom's grammar)**: at 6× the whirl renders zero frames. Whatever W7 declares the
  transition to be, it has to survive a starved main thread, because the warp cannot leave it.
