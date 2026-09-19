# T9-W8 §8.3 — THE OWNER-RUN DEVICE INSTRUMENT · the landing

2026-09-17 · track `probe` · branch `w8/probe` · worktree `.claude/worktrees/w8-probe` ·
preSha `7b0610cc` · commit `T9-W8 8.3: ...` (below) · host darwin 25.4.0 arm64, up to ten
sibling lanes live.

    BASE  AUDIT: build-identity — dist entry index-9rZPzI5DEcpe.js · index.html md5 fa3d1af9870916cc728de11e97f57a90 · 43 files / 806.1 KB
    CURED AUDIT: build-identity — dist entry index-BRDVCwHoo2FI.js · index.html md5 819e5816db9118d894e85c64451dd9c0 · 44 files / 819.8 KB

Both arms printed at both ends of every reading set (`arms-and-load.txt`), unmoved.

## What landed

`src/probe/devicePaint.ts` (the DOM half) + `src/probe/deviceMarks.ts` (the pure half, the
rules), armed by `?__probe=1` through ONE guarded dynamic import at the boot seam
(`src/main.ts`). Vite emits it content-hashed under `/assets/devicePaint-<hash>.js`: same
origin, no inline script, no header change, so the edge's own
`script-src 'self' 'wasm-unsafe-eval'` is satisfied as written. Unit rows in
`src/probe/deviceMarks.test.ts` (17), an e2e row in `e2e/device-probe.spec.ts` (3 rows x 2
engines). GATE D's executor amended three ways in `perf-rig/ci-subset.mjs`, documented in
`perf-rig/README.md`. The owner's ten minute sheet is `../../device/RUNSHEET.md`.

## THE NUMBER — an instrument is graded on what it does NOT move

8.3 is not a speed cure. Its acceptance is that the player's load is the load it was, and that
the owner's load pays exactly one chunk and nothing else. Both arms, interleaved b,c,b,c,
5 windows each, chromium 4x CPU, link unthrottled, cache cold (CDP cache-disabled),
390x844 dpr 3, instrument `readiness-ab.mjs` (A6's `readiness-timeline.mjs` with the four
changes its header names). Medians; 0 tainted, 0 errored in both sets.

### Set 1 — a load WITHOUT the flag (`ab-mob4x-noflag.jsonl`): the player's boot is unmoved

| mark | base | cured | delta | spreads |
|---|---|---|---|---|
| boardReadyMs | 297.1 | 280.6 | **-16.5** | overlap (base 272.9-311.2 · cured 276.0-286.8) |
| firstBakeMs | 2,662.1 | 2,617.3 | -44.8 | overlap (2,595.5-2,680.7 · 2,596.5-2,698.4) |
| **firstBoilTickMs** (= boardDrawnMs, B1) | 2,818.2 | 2,813.7 | **-4.5** | overlap (2,811.8-2,823.0 · 2,806.3-2,935.7) |
| lcpMs | 2,684 | 2,640 | -44 | overlap |
| tbt3000Ms | 1,006 | 977 | -29 | overlap |
| rafGapProxyTbtMs (PROXY, never TBT) | 1,263 | 1,236 | -27 | overlap |
| worstRafGapMs | 230.5 | 229.9 | -0.6 | overlap |
| controlsInteractiveMs | 108.1 | 108.7 | +0.6 | overlap |
| **resourceCount** | 29 | **29** | **0** | identical, 5/5 both arms |
| **transferBytes** | 212,064 | 212,124 | **+60** | disjoint and deterministic |

Every timing delta sits inside the spread: the guard costs nothing measurable. The only real
delta is 60 B on the wire — the compressed cost of `if (params.has("__probe")) import(...)` in
the entry chunk (+141 B raw). **Zero extra requests**, proven three ways: the resource count
above, the built chunk graph (`chunk-graph.txt`: the entry carries the probe's specifier and
its own guard, and none of the probe's strings), and `e2e/device-probe.spec.ts`'s inert row,
which waits past the 8 s mount moment and asserts no probe request and no probe DOM, in both
engines.

### Set 2 — a load WITH `?__probe=1` (`ab-mob4x-armed.jsonl`): what the owner's run costs

| mark | base | cured | delta |
|---|---|---|---|
| resourceCount | 29 | **30** | +1 (the probe chunk) |
| transferBytes | 212,064 | 217,563 | **+5,499** (13,835 B chunk, compressed) |
| boardReadyMs | 283.1 | 282.7 | -0.4, spreads overlap |
| firstBoilTickMs | 2,812.2 | 2,812.9 | +0.7, spreads overlap |
| tbt3000Ms | 986 | 970 | -16, spreads overlap |
| rafGapProxyTbtMs | 1,223 | 1,223 | 0, spreads overlap |
| controlsInteractiveMs | 110.7 | **NOT MEASURED** | see below |

Even armed, no timing mark moves outside the spread: the probe holds observers and one rAF
chain, and mounts no DOM until the 8 s window closes.

**`controlsInteractiveMs` NOT MEASURED in the armed cured arm, and why it is not a failure.**
The rig taps `.drawer-tab` without first declaring the load, and the expanded readout sits over
the tongue at 390 wide: the click times out 5 of 5, and `controlsHow` in `ab-mob4x-armed.jsonl`
carries the timeout verbatim on every cured window. That is a real defect and it was cured
rather than excused (the first armed set, before the cure, read exactly the same way): declaring
the load collapses the panel to a 48 px handle in the bottom LEFT corner, and the FIRST tap
that reaches the app collapses it too. `e2e/device-probe.spec.ts` proves the tab flips after the
collapse, in both engines, at 390x844. The run sheet's first instruction is the declaration, so
the owner never meets the blocked state.

## The instrument reads what the charter's table says, on both engines

`probe-row-wk.jsonl` and `probe-row-cr.jsonl` are captures by `probe-capture.mjs` — Playwright
at 390x844 dpr 3 making the owner's gestures and tapping the readout's own Copy button. **They
are not device readings and say so in their own `capturedBy` field.** What they prove is the
instrument: 66 keys, every mark a number or the words NOT MEASURED, never a 0 for something the
engine cannot see.

- WebKit: `firstPaintMs` NOT MEASURED (Safari ships no `first-paint`), `ltSupported: false`, so
  `tbt3000Ms` / `longtasks3000` / `longestTaskMs` / `busyToBoardReadyMs` all NOT MEASURED, and
  `rafGapProxyTbtMs` carries the only blocking figure there is. No line of PROSE on the readout
  calls a frame gap sum a TBT (asserted, case-insensitively, over the card minus its JSON
  block). The JSON row itself does carry `rafGapProxyTbtMs` and `tbt3000Ms` as key names: the
  proxy names itself a proxy before it names Tbt, and `tbt3000Ms` is the real long task census,
  NOT MEASURED where the engine has none. Corrected in repair round 1 (finding F2); the round-0
  wording "the word TBT never appears on the readout" was true only of the uppercase spelling.
- chromium: the same row with the task census filled in.
- `firstToggleBakes: 8` on the first theme flip and 0 after — G1's "N1 bakes 8, N2..N4 bake 0",
  read by the instrument that will read it on the phone.
- `givensMs` reads the input's `value`, not a text node: 81 cells on this tree carry text in
  none of them and a digit in 61 inputs. A3's banked probe reads the same pair, so the mark
  stays the same quantity as ATTRIBUTION row 5's.
- `boardDrawnMs` and `firstBoilTickMs` are the same observation under both names, so B1's
  spelling and the proxy rows' spelling both resolve.

**The fold is proven** (`fold-proof.md`): `A6/readiness.jsonl` + the two captured rows through
`A6/summarize-readiness.mjs` with no second reader, device-shaped rows and proxy rows in ONE
table.

Two corrections the captures earned, both cured in the same commit:

1. **A capture-phase `blur` listener on `window` sees every element's blur.** The first capture
   banked `taint: ["blur at 22203 ms", "blur at 25272 ms"]`, `tainted: true`, with the page in
   the foreground the whole time (`probe-row-wk-precure.jsonl`, kept for exactly this): ordinary
   tapping was spoiling every reading. Only `e.target === window` taints now, and the same
   capture re-run reads `taint: []`.
2. **The gallery's two directions are named, not numbered.** `galleryToBoard*` and
   `galleryToPicker*`, with `galleryWidthsNode: ".board-cells"` beside them, because A7 reads
   the entry's travel off the projected card and this instrument reads `.board-cells` — NOT the
   same quantity, and "in"/"out" read either way round. Open for the chair: the captures read
   20 distinct widths on the way to the picker and 1 on the way back to the board, which is the
   MIRROR of A7's G3 (entry glides, exit does not travel). Either the two instruments watch
   different nodes or the direction mapping differs; it is banked as a question, not a finding.

## GATE D's executor — three amendments, each ablated

Run at `--port 4390` (this cure owns it), against the cured dist.

| amendment | proof | the number |
|---|---|---|
| 1 · the 390x844 dpr 3 pose | `gated-poses-run.txt` | desk dpr 1 **247 ms** vs mobile dpr 3 **987 ms**, same tree, same 4x rate. The pose GATE D never booted costs 4.0x the pose it graded. PROVISIONAL, gating nothing, until gates.json carries `boot.tbt.poses.mob.maxTbtMs` stamped from n >= 3 RUNNER readings |
| 2 · admissibility per window | `canary-anchor-run.txt` (`--canary-anchor 900`, runs 3) | anchors 71, 116, 900. The OLD median rule would have graded **246 ms over 3 windows including the blown one**; per window, the 900 ms window is dropped by name and **253 ms over the 2 admissible** is the grade |
| 3 · grade the boot windows before an instrument failure discards the leg | `canary-fail-PREamend.txt` vs `canary-fail-AMENDED.txt` (`--canary-fail chromium`) | PRE: the GATE D table is EMPTY, the whole leg discarded. AMENDED: desk **PASS 250 ms**, mobile **PROVISIONAL 980 ms**, the engine's idle verdict still NOT MEASURED, exit still 3 |

Thresholds in the T4-P1 `gates.json` are untouched. A dpr 3 breach cannot be declared from
this host; the row says PROVISIONAL and the run sheet says the same thing in English.

## pi identity

- goldens: `goldens.txt` — 4/4 PASS against the cured dist, never `--update-snapshots`.
- the built-dist suite (`playwright-throttle.config.ts`, both engines): **67/67**, which carries
  `filter-census` (filterBudget 9, pose count 4), `wordmark-integrity`, `theme-bake-freshness`,
  `theme-quadrants` and `throttled-void`.
- no bake dropped, no boil thinned, no filter removed, no transition shortened. The probe reads.

## Gates, run bare, in the worktree

| gate | exit |
|---|---|
| `npm run test:unit` | 0 — **67 Test Files, 827 Tests**, all passed |
| `npm run lint:eslint` | 0 |
| `npm run lint` (prettier) | 0 |
| `npm run lint:knip` | 0 |
| `npm run lint:boundary` | 0 |
| `npm run lint:tdz` | 0 |
| `npm run lint:copy` | 0 |
| `npm run lint:live-regions` | 0 |
| `npm run lint:motion` | 0 — 35 specs, every one declaring |
| `npm run typecheck:e2e` | 0 |
| `npm run typecheck:node` | 0 |
| `npm run lint:sleep` | 0 |
| e2e `device-probe.spec.ts`, both engines, cured dist | 0 — 6/6 |
| golden suite, cured dist | 0 — 4/4 |
| built-dist suite, both engines | 0 — 67/67 |
| `npm run test:e2e:projects` | round 0: **1** — `device-probe.spec.ts: on disk, NOT in SPEC_MANIFEST`, wrongly held for the chair. **Repair round 1 (F1): 0.** The manifest is in this worktree and the gate's own message names the same commit as its home, so the entry lands here. See `fix-r1/`. |

## Files

In the worktree, on `w8/probe`: `src/probe/deviceMarks.ts`, `src/probe/deviceMarks.test.ts`,
`src/probe/devicePaint.ts`, `src/main.ts`, `e2e/device-probe.spec.ts`,
`perf-rig/ci-subset.mjs`, `perf-rig/README.md`.

Here: `readiness-ab.mjs` (the A/B instrument), `probe-capture.mjs` (the capture harness),
`playwright-scratch.config.ts` (copy it into `web/frontend/` to run it — Playwright resolves
`@playwright/test` from the package, and this directory is outside it), the jsonl sets, the rig
runs, `fold-proof.md`, `chunk-graph.txt`, `arms-and-load.txt`, `summary-raw.txt`.

## Load average, both ends of every set

`arms-and-load.txt`: start `{ 9.12 10.91 11.72 }`, mid `{ 7.35 9.94 11.26 }`, end
`{ 7.13 8.77 10.61 }`. Interleaved windows, so the drift lands on both arms.
