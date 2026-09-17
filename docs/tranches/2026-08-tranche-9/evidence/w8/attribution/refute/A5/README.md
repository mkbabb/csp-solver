# REFUTER — lane A5 (THE DARK TOGGLE'S FIRST INVOCATION), T9-W8 §8.1

2026-09-17 · HEAD `58014efd` · dist entry `index-9rZPzI5DEcpe.js`, identity unmoved
(`dist-identity-before.txt` == `dist-identity-after.txt`) · served by my own `vite preview` on
**:4260** (assigned 4259 was already LISTEN; 4260 was the next free in band). Never rebuilt.
Server killed at the end. I did not write the lane.

## What I re-ran

The lane's own banked instruments, unmodified, invoked exactly as their header lines say.
**They run as banked** — `toggle-probe.mjs` and `trace-restyle.mjs` both executed first try
against my port with no edits. That clears the "an instrument that cannot be re-run is not
evidence" bar.

| my file | what |
| --- | --- |
| `retake-chromium-4x-desk-cold-fast3g-HIGHLOAD.jsonl` | the top-finding cell, taken at loadavg **12.5** |
| `retake-chromium-4x-desk-cold-fast3g-LOWLOAD.jsonl` | the same cell, taken at loadavg **3.5** (lens 2) |
| `retake-chromium-4x-desk-warm.jsonl` | the warm cell (finding 5) |
| `retake-chromium-4x-desk-cold-fast3g-STARTDARK.jsonl` | the symmetry cell (finding 6) |
| `retake-webkit-desk-cold.jsonl` | the webkit arm |
| `retake-trace-restyle.txt` | the trace, re-run (findings 7 + the EventDispatch attribution) |
| `critpath-ablate.mjs` · `critpath-live.jsonl` · `critpath-ablate.jsonl` | **my instrument** — the critical-path + causal-ablation lens |
| `refute-fold.jsonl` | the five retake cells folded, one line each |

`critpath-ablate.mjs` header: `cd web/frontend && node <thisfile> --port 4260 --throttle 4 --mode live|ablate --windows 3 --out <file.jsonl>`

## Lens 1 — REPRODUCE

Every cell lands inside the lane's own spread. 3 windows each, median reported, **zero tainted
windows** across all five cells (no blur, no visibilitychange, no 1000–1300 ms lone delta).

| cell | lane N1 | my N1 | lane board-ready | my board-ready | N1 bakes | N2..N4 bakes |
| --- | --- | --- | --- | --- | --- | --- |
| chromium 4× desk cold fast-3G | 1213.8 | **1194.1** (load 12.5) / **1251.9** (load 3.5) | 1369.9 | 1371.1 / 1388 | 8 | **0** |
| chromium 4× desk WARM | 1233.9 | **1228.4** | 310.9 | 289.4 | 8 | **0** |
| chromium 4× desk STARTDARK | 1202.4 | **1221.1** | 1388 | 1372.1 | 8 | **0** |
| webkit desk cold | 338 / 308 | **325** | 401 | 400 | 8 | **0** |

The 8-bakes-then-zero shape is exact in every cell: 4 × wordmark `765×224` + 4 × grid-hoist
`1272×1272`, zero celestial. Post-click `resource` entries: **0** in every N1 window I took
(the lane's font-refetch refutation reproduces). `game-cell` was the measured element in every
window, so the board-ready refinement the lane banked is stable.

The source citations check out on this tree: `HandwrittenLogo.vue:343` and
`HandDrawnGrid.vue:216` both carry `${isDark.value ? "d" : "l"}` in `cacheKey`;
`DarkModeToggle.vue:566/572` key `celestial-sun`/`celestial-moon` with no theme token.

## Lens 2 — HOST vs BUNDLE

**It is a bundle fact.** The lane's headline number does not shrink at low load — it grows
slightly. N1 = 1194.1 ms at loadavg 12.5 and **1251.9 ms at loadavg 3.5**; board-ready 1371.1 →
1388 ms. Nothing here halves at low load, so nothing needs adjusting downward. (The cell is
network-bound on the 150 ms-RTT link and CPU-bound on the 4× throttle, both of which dominate
host contention.) Loadavg banked at every cell boundary in the JSONL and in the identity files.

## Lens 3 — THE CRITICAL PATH (my own instrument)

The lane asserts `onCriticalPath: true` without separating *concurrent with the flip* from
*delaying the flip*. I timed three visible marks per click and then ablated.

**(a) The flip's paint IS delayed.** `critpath-live.jsonl`, chromium 4× desk, 3 windows:

| invocation | class flip | background actually repaints | whirl frames |
| --- | --- | --- | --- |
| N1 | 29.5 ms | **373.4 ms** | 4 |
| N2 | 37.5 ms | 24.1 ms | 100 |
| N3 | 37.6 ms | 22.7 ms | 100 |

The `<html class="dark">` write lands on time (29.5 ms) but the user-visible repaint is held off
**~350 ms** on the first invocation against ~24 ms afterwards. The raster work is not merely
early-but-parallel; it delays the mark. `onCriticalPath: true` **stands**.

**(b) But the cost is NOT the encode.** `critpath-ablate.jsonl` runs the identical probe with
`toBlob` stubbed to hand back a 1×1 blob on a microtask — the encode made free, nothing else
touched. (An *attribution* ablation only: it draws less, which M09 forbids as a cure.)

| | live | encode ablated | Δ |
| --- | --- | --- | --- |
| N1 click→settle | 1243.8 ms | **1074.2 ms** | −169.6 ms |
| N1 whirl frames | 4 | **3** | — |
| N1 background repaint | 373.4 ms | **386.5 ms** | — |
| N2/N3 click→settle | 105.1 / 97.3 | 0 / 0 | — |

Making all 8 encodes free removes only **169.6 ms of the ~1140 ms** first-invocation delta,
leaves the whirl just as starved (3 frames vs 4), and does not move the delayed repaint at all.
So the dominant term is the rest of the rasterize chain — the blob-SVG `load` → `drawImage`
hop — not `toBlob`. That is exactly what the lane's own trace says
(`EventDispatch` present only on toggle 1: lane 937.9 ms / n=58, my re-run **822.5 ms / n=48**),
so the README's *mechanism* paragraph is right. What is wrong is the **pricing** in findings 2
and 3.

## Lens 4 — THE LAW (M09)

| candidate | lane's mark | my check |
| --- | --- | --- |
| 1. Pre-warm the other theme's stacks at idle | MECHANISM | **LAWFUL.** Adds a bake earlier; drops nothing. π identity and filterBudget 9 untouched. But see the cache correction below — the lane's headroom argument is wrong, even though the conclusion survives. |
| 2. Bake-on-idle, serialized | MECHANISM | **LAWFUL.** Pure scheduling. |
| 3. Split the flip from the bake | MECHANISM | **LAWFUL with a caveat** — deferring the re-bake past the gesture window shows the *previous* theme's ink, at full quality, for ~1 s. Deferral of the not-yet-correct, not drawing less. 8.2 should state the stale-ink window explicitly. |
| 4. Compositor-only whirl | REFUSED | **REFUSED, correctly** — scaling the filter's output instead of its input trades the vector-crisp property for frames. |
| 5. Shorten the Bloom / thin the boil / drop a grid pose | REFUSED | **REFUSED, correctly** — all three buy the number with drawn quality. |

I add one: the ablation I ran (free encode) is **REFUSED** as a cure for the same reason — it
draws less. It is an attribution instrument only.

**Cache correction (load-bearing for candidate 1).** The lane writes that `DEFAULT_POSE_CACHE`
4 means "two surfaces × two themes = exactly 4 residents, which is what the library's own note
says the default 4 was measured for". That misreads the scope. In
`node_modules/@mkbabb/pencil-boil/dist/vue.js`, `const stacks = new Map()` is declared **inside**
`useRasterStack`, so the cache is **per surface instance**, 4 stacks each — and the doc comment
says so: *"Resident baked stacks **per surface**… a box that toggles between two values, across
a theme flip"* (i.e. 2 boxes × 2 themes, one surface). The coincidence that the estate has 2
themed surfaces is not why the default is 4. The consequence is *better* for candidate 1 than
the lane argued — each surface has its own 4 slots, so pre-warming the other theme costs 1 slot
per surface with headroom to spare, and there is no eviction thrash against the 16 celestial
boot captures. The conclusion holds; the stated reason does not.

## Arithmetic note on the headline number

The lane reports `msOnColdPath: 1018.4` for finding 1, computed as N1 − **N2** (1213.8 − 195.4).
Its own born-RED gate defines the unit as `N1 − median(N2..N4)`, which on the lane's own table
is 1213.8 − 110.3 = **1103.5 ms**. My five cells give deltas of 1093.1 / 1142.7 / 1137.0 /
1119.3 ms (chromium) and 325 ms (webkit). The defect is **larger** than the lane billed it, and
the lane's headline should be restated in the unit its own gate uses.

## Corroborating earlier pass (same lane id, same dir)

`retake-chromium-4x-desk-cold-fast3g.jsonl`, `…-6x-…`, `…-mobile-…` and `retake.log` were
banked at 15:24–15:28 by an earlier pass of this refuter, before this session's identity lines.
I cite them as corroboration, not as load-bearing: the window is bracketed by four
identity readings that are byte-identical (the lane's 15:00 and 15:19, mine at 15:51 and 16:00),
so the dist did not move across it, but I did not take the identity line inside it myself.

| cell | lane N1 | earlier-pass N1 (3 windows) |
| --- | --- | --- |
| chromium 4× desk cold fast-3G | 1213.8 | 1182.5 / **1213.3** / 1264.2 |
| chromium 6× desk cold fast-3G | 1921.1 | 1880.7 / **1909.8** / 1970.8 |
| chromium 4× mobile dpr3 | 981.2 | 950.3 / **1318.5** / 3772.3 |

Desk 4× and 6× reproduce to within a percent. **The mobile cell does not**: three windows
spanning 950 → 3772 ms, median 1318.5 against the lane's 981.2. The mobile row is the one
number in the lane's table I would not quote without a re-take at controlled load — the
mechanism (8 bakes, then 0) is identical there, but the magnitude is unstable.

## Did not land

- `inkSwapMs` (when the wordmark/grid visibly swaps to the new pose) read `null` in 0/3 windows
  of every cell — the surfaces do not render through `<img src="blob:">` where my probe looked.
  The visible-ink mark is **NOT MEASURED**; the background-repaint mark carried lens 3 instead.
- I did not re-take the 6× or the mobile cells; the four chromium cells I did take all agree, and
  the 6× row is the lane's most extreme, not its load-bearing one.
- No real Safari, no real iOS, no device number (M19). No webkit number here is a Safari number.
