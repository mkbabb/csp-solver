# C08 — THE DRAWER'S FIRST GESTURE AND ITS ONSET/SETTLE RESTYLE — **NOT LANDED**

T9-W8 §8.2, track `drawer`, worktree `.claude/worktrees/w8-drawer`, branch `w8/drawer`.
preSha `7b0610cc` · reset to `7b0610cc` · **no commit exists** · 2026-09-17.
Charter: `../charters/C08.md`. Law and acceptance: `../charters/README.md`.

Two things are banked here. The **FIRST ACT** the charter ordered — the drawer traced at
dpr 3, which closes ATTRIBUTION gap 15 — and the measured verdict on **part B**, which is that
the chartered mechanism costs more than it saves. Part A is held for the device, on the
charter's own gate. Nothing under `web/frontend/src` survives; the worktree rebuilds to the
base arm byte for byte (identity below).

## Build identity, both ends

```
BASE   AUDIT: build-identity — dist entry index-9rZPzI5DEcpe.js · index.html md5 fa3d1af9870916cc728de11e97f57a90 · 43 files / 806.1 KB   (dist-base, the chair's copy, verified at open and at close)
CURED  AUDIT: build-identity — dist entry index-DaJpxqonnJ0q.js · index.html md5 e75becb005f0493ca0df5fcb21e37a2e · 43 files / 806.5 KB   (the arm measured below)
AFTER RESET  AUDIT: build-identity — dist entry index-9rZPzI5DEcpe.js · index.html md5 fa3d1af9870916cc728de11e97f57a90 · 43 files / 806.1 KB
```

An earlier cured build, `index-IZD-Gs76b_M0.js` / md5 `89c620e29d150ef51110e68829b183c5`, carried
a second half (a `queueMicrotask` forced flush at the onset) that moved nothing and was dropped
before the reading set; its one probe run is in `/tmp`, not banked, and nothing below cites it.

Servers: `npx vite preview --outDir dist-base --port 4258` and `--outDir dist --port 4259`,
`--strictPort --host 127.0.0.1`, both killed. Load (`sysctl -n vm.loadavg`, 1-minute) is in
`raw/loadavg.txt`: 13.16 at the first act, 11.46 → 7.13 across the 4× set, 5.73 → 25.23 across
the 6×/WebKit set. Up to ten sibling lanes shared the host.

## 1. THE FIRST ACT — the drawer at dpr 3 (the charter's order, gap 15 closed)

`drawer-trace-dpr3.mjs` and `onset-ablate-dpr3.mjs` are A4's instruments with the declared
changes noted in their heads: (1) an explicit `deviceScaleFactor` (A4 set none, so its "mobile"
was dpr 1); (2) the settle window split into `closeSettleFrame` [+480,+560] and
`closeSettleAfter` [+560,+800], the banked `closeSettle` [+480,+800] still reported; (3) PER-FRAME
attribution — the close mark carries both clocks, so each rAF frame owns the `UpdateLayoutTree`
events inside it and the charter's "settle-frame restyle" can be read as a frame rather than as a
320 ms window. Raw: `raw/firstact-dpr3.jsonl`, `raw/firstact-ablate-dpr3.jsonl`.

chromium · 390×844 **dpr 3** · unthrottled link · cold · `?game=sudoku&size=3&difficulty=EASY`:

| rate | first gesture, open worst | long33 / maxConsec | steady open worst | steady close worst |
| --- | --- | --- | --- | --- |
| 1× | 9.3 | 0 / 0 | 9.3 | 9.3–9.4 |
| 4× | **34.8** (25.0–41.9, n=5) | 1 / **1** (0,1,1,1,2) | 10.3–17.6 | 10.3–10.4, two windows of 10 at 16.3 / 18.4 |
| 6× | **58.4** (50.2–66.9, n=3) | 2 / 2 | 17.0–35.1 | 15.1–18.3 |

webkit dpr 3 (rAF gaps only; per-stage ms **NOT MEASURED**, no `longtask`, no trace): first
gesture open worst 27 (26–76), steady 19–43, close 19–24. **No WebKit number here is a Safari
number and none is an iOS claim** (M19: real Safari and real iOS were forbidden in this session).

**What dpr 3 changes, and it is not what the charter expected.** The first gesture's extra cost
is **not raster**. In the 50 ms onset window at 4×, raster reads 7.35 ms on the first gesture
against 5.76 steady (+1.6), paint 12.66 against 8.22 (+4.4), and recalc **20.33 against 11.04
(+9.3)**. The 9× pixels do not produce a raster burst: the first gesture is dominated by the
first style resolution and paint of a sheet that is `visibility: hidden` until it opens.

**The onset, split by lone provocation** (`onset-ablate-dpr3.mjs`, 4×, dpr 3, 3 reps; steady
reps 1–2, the first rep carries the page's own first-gesture cost and is reported apart):

| arm | restyled elements | recalc ms | raster ms |
| --- | --- | --- | --- |
| `inert` on `.board-cells` | **601–603** | 5.28–5.62 | 0.00 |
| `html.drawer-closed` | 277–280 | 6.26–6.57 | 0.32–3.98 |
| the tongue's Teleport | 75 | 1.13–1.86 | 0.37–0.41 |
| control (a forced layout, nothing else) | 0–64 | 0.00–0.16 | 0.00 |
| (rep 0, first provocation) `inert` 1167 / 22.41 ms · `drawerClass` 818 / 19.84 ms | | | |

DOM census at dpr 3: `gridNodes` 414, `cells` 81, `docNodes` 991, `sheetNodes` 167. **`inert`
restyles 601 of the document's 991 elements though the grid holds 415** — the invalidation is
wider than the subtree the attribute sits on, so there is no author-side narrowing of it.

## 2. PART B — measured, and it moves the number the WRONG WAY

**The cure as written.** One ref (`rested`) in `useControlsDrawer.ts`: `drawerInert` becomes
`!drawerOpen && rested`, `rested` drops at gesture onset and lands in the idle after the settle
(`requestIdleCallback` with a 400 ms timeout, `setTimeout(…, 32)` where there is none). That
moves BOTH a11y writes — the rail's `inert` on, the board's `inert` off — out of the settle
frame, which is the charter's own prescription ("after the settle frame, in the next idle").
`inert` still goes ON at onset, unchanged, so it covers a superset of the covered time.

**Reading set.** Interleaved b,c,b,c — five page loads per arm at 4×, three per arm at 6× and on
WebKit; three cycles per load, cycle 0 (the page's first gesture) reported apart from cycles 1–2.
n = 10 steady + 5 first per arm at 4×; 6 + 3 at 6× and WebKit. No window reported `tainted`; none
excluded. Raw: `raw/cure-4x.jsonl`, `raw/cure-6x.jsonl`, `raw/cure-webkit.jsonl`;
`summarize.py` folds them.

chromium · 390×844 dpr 3 · unthrottled · cold — **steady state (cycles 1–2)**, median [min,max]:

| mark | 4× base | 4× cured | 6× base | 6× cured |
| --- | --- | --- | --- | --- |
| **settle-window restyled elements** [+480,+560] | 826.5 [761,829] | **994 [952,1015]** | 825 [761,828] | 1015 [262,1019] |
| **settle-window recalc ms** | **7.24 [6.0,10.3]** | **10.97 [7.5,14.2]** | 11.98 [10.2,13.1] | 10.22 [4.8,16.9] |
| onset-window restyled elements | 979 [977,1045] | 980 [977,1045] | 1006 [975,1043] | 975 [975,977] |
| onset-window recalc ms | 11.04 [9.0,14.4] | 10.45 [7.8,15.8] | 17.38 [14.2,22.5] | 19.26 [12.1,21.7] |
| close worst rAF delta | 10.35 [10.3,18.4] | 10.30 [10.2,10.3] | 16.15 [15.1,18.3] | 13.35 [10.1,17.7] |
| close long33 | 0 | 0 | 0 | 0 |
| open worst rAF delta | 16.60 [10.3,17.6] | 17.60 [10.1,24.7] | 29.50 [17.0,35.1] | 24.90 [24.2,25.5] |
| the settle restyle's own frame: elements / its rAF delta | 754 / 8.35 | 753 / 8.35 | 754 / 16.15 | 753 / 9.00 |

First gesture (cycle 0): open worst 34.80 [25.0,41.9] base against 33.10 [27.0,41.6] cured at 4×;
58.40 [50.2,66.9] against 48.60 [48.1,66.8] at 6×, long33 2 in both arms. WebKit medians are flat
in both directions (open worst 22.5 against 25.0 steady; close 20.5 against 20.5).

**The verdict, and the mechanism behind it.** The settle frame's writes are ALREADY coalesced:
Blink resolves the `drawer-gesturing` removal, the rail's `inert` and the board's `inert` in ONE
style pass of 826 elements / 7.24 ms. Deferring the two a11y writes splits that pass in two, and
two passes cost **+168 elements and +3.7 ms** against one — the number the charter named
(912–979 elements, 8.2–13.0 ms at 4×) moves the wrong way on the tightest set in this file
(n = 10 per arm). Everything that looks better is inside its spread: 6× close worst 16.15 → 13.35
on n = 6 with ranges that overlap; the 4× close medians are 10.35 against 10.30. The two base
windows that read 16.3 / 18.4 vanish under the cure and no cured window exceeds 10.3 — a tail
worth a second look on the device, but a tail, not a median.

The onset half of part B has no lever left either. Its 979 elements are 601 of `inert` (wider than
the subtree, so unnarrowable in author CSS), 280 of `html.drawer-closed` (the ONE layout step the
FLIP requires at onset) and 75 of the Teleport. A `queueMicrotask` flush behind Vue's patch was
built and measured first: it pays the same recalc in the click's own task, which is the same rAF
interval the frame's style pass is in, so it moves nothing by construction. It was dropped.

**So part B does not land.** "A cure whose number doesn't move doesn't land" — this one moves and
the move is negative.

## 3. PART A — held for the device, on the charter's own gate

The charter: "land it only if your dpr-3 re-take shows a first-gesture burst at 4× AND the trade
costs nothing measurable at boot". The re-take says **no burst at 4×**: `maxConsecLong33` is
0,1,1,1,2 across five first-gesture windows (median 1), worst 34.8 ms median. And the premise
under it — "gesture one rasters it" — does not survive dpr 3: raster carries +1.6 ms of the
first gesture's +15, recalc carries +9.3. A pre-raster that moves ~100 raster tasks toward the
load path would be buying the smallest of the three terms. **No `w8/drawer-partA` branch was
written**: on this proxy the trade is priced against the wrong term, and 8.3's device reading is
what should decide whether it is worth anything at all. Nothing is prepared that the device has
not been asked about.

## 4. GATES, π AND THE SPECS — all green on the cured arm before the reset

Run bare in the worktree, exit codes read from `$?`:

`test:unit` 0 (**Test Files 66 passed (66) · Tests 810 passed (810)**) · `lint:eslint` 0 ·
`lint` 0 · `lint:knip` 0 · `lint:boundary` 0 · `lint:tdz` 0 · `lint:copy` 0 ·
`lint:live-regions` 0 · `lint:motion` 0 · `typecheck:e2e` 0 · `typecheck:node` 0.

π: `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4259 npx playwright test --config
playwright-golden.config.ts` → **4 passed**, no `--update-snapshots`, pose count 4, no golden
moved. `filterBudget.ts` untouched (`FILTER_BUDGET_CEILING` 14, the census test inside the 810).

The five specs the charter names, both engines, against the cured dist through the scratch config
banked here as `playwright-c08.config.ts` (the estate's default config with `webServer` dropped,
`globalSetup` dropped with it, and `baseURL` fixed to `127.0.0.1:4259` — nothing else):
`drawer.spec.ts`, `access.spec.ts`, `a11y.spec.ts`, `spoken-controls.spec.ts`,
`mobile-affordances.spec.ts` → **91 passed, 1 skipped, exit 0**. The a11y tail is spec-safe:
`inert` lands wherever the sheet covers the board. It simply does not pay.

## 5. WHAT THE CHAIR INHERITS

1. The dpr-3 re-take stands on its own: ATTRIBUTION gap 15 closes, G4's raster premise is
   REFUTED at dpr 3 (raster +1.6 of +15; recalc +9.3), G5's element counts are CONFIRMED at
   dpr 3 to the node, and B3's proxy stays NOT RED at 4× in steady state — long33 0 in 20 of 20
   windows, both arms, both directions.
2. C08's part B, as chartered, is measured counterproductive. The settle frame's restyle is one
   coalesced pass and splitting it costs 3.7 ms per gesture.
3. M02 ("not smooth") still has no proxy that reproduces it as dropped frames, now at dpr 3 as
   well as dpr 1. If the device reads clean frames too, the charter's own sentence applies: M02
   belongs to W7 §13, the tongue's berth swap.
4. The instruments here take `--dpr`, `--build` and `--port`, so 8.3 can re-run them.
