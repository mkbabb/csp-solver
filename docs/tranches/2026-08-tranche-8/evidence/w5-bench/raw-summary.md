# T8-W5 bench — the banked extract of the raw rows

**Added T9-W0, 2026-08-25.** `README.md` beside this file cites `perf-rig/runs/*.jsonl` at :175
and :585, and that directory is gitignored — no clone has ever reached a reading behind those
claims (T9 formation, family **F15**). This file is the extract: the per-cell medians, the
`env`/`hostLoad` rows the load discipline rests on, and the instrument rows behind every §9.2
bullet. It corrects nothing in the sealed record by rewriting it; where extraction disagreed
with the record, §5 says so and the record's own prose stands.

## 1 · Provenance

- **The raws are local-only and stay that way.** `web/frontend/perf-rig/runs/` at extraction:
  **530 `*.jsonl` + 47 `*.peer.log`, 584 entries, 2,452 KB**. `perf-rig/.gitignore` line 3 is
  `runs/`. Nothing under `docs/tranches/2026-08-tranche-8/` is a `.jsonl` — zero banked before
  this file.
- **The bench ran 2026-08-04** (file mtimes 12:34–18:38 local across the r13 generation).
  **This extraction ran 2026-08-25** on the owner's workstation — `Mac17,7`, macOS 26.4.1,
  `hw.ncpu` 18 — from the same checkout, at HEAD `c917f9a7`.
- **The host that took the readings isn't identifiable from the rows** beyond the probe's own
  `env` fields, reproduced below. Three weeks separate the run from the extract; treat the
  workstation identity above as where the files sit now, not as the bench box attested.
- Source files, sha256:

  | file | bytes | sha256 |
  |---|---|---|
  | `runs/r13-solve-summary.txt` | 18,312 | `f2a5010237de69ba82cac3802c143919e0c476869b1fa6e13d678cfac39e2106` |
  | `runs/r13-boil-summary.txt` | 19,816 | `da222a55e3faa03ee12e2052496dd606d1cb8357322bd62fd3e0e636c4fd4f73` |
  | `runs/w5-safari-solve-tophard-r13c.jsonl` | 2,556 | `a4da5e26e6b3273af14deb9e29800e9df6da1e9630ebfe4fd6de5150f1032091` |
  | `runs/w5-safari-solvecold-sudoku-r13c.jsonl` | 4,651 | `e5153fab167d8a8a6307b7848e9c3a1ceebcf87c7e625453409b8b2e05e213ab` |

  The two summaries are `w5-summarize.mjs` output, not hand tables.

## 2 · The tophard run — §9.2's item 3, whole

The claim: *"thermo 16×16 HARD and killer 16×16 HARD both TIMED OUT generating at the 25,000ms
leash on real desktop Safari (initMs 13, then nothing)."* Three files carry that tag; only the
third measured anything.

**`w5-safari-solve-tophard-r13c.jsonl` — the `env` row:**

```json
{"kind":"env","ua":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Safari/605.1.15","vendor":"Apple Computer, Inc.","platform":"MacIntel","dpr":2,"innerWidth":900,"innerHeight":648,"screenW":1920,"screenH":1080,"hardwareConcurrency":8,"deviceMemory":null,"maxTouchPoints":0,"prefersReducedMotion":false,"prefersDark":true,"themePinned":null,"htmlDark":true,"coarsePointer":false,"ablated":false,"ablateBytes":0,"scenarios":["solveMatrix"],"href":"http://localhost:4244/?__run=w5-safari-solve-tophard-r13c&__scenarios=solveMatrix&__cells=thermo%3A4%3A2%2Ckiller%3A4%3A2&__reps=1&__solves=2&__worker=%2Fassets%2Fsolver.worker-eJy8PYEB.js&__cellMs=25000&size=3&difficulty=HARD","runId":"w5-safari-solve-tophard-r13c","pageMs":591,"serverTs":"2026-08-04T22:37:02.379Z"}
```

**The two `solveCell` rows** — both empty of samples, both carrying the timeout:

```json
{"kind":"solveCell","game":"thermo","dim":4,"difficulty":2,"nodeBudget":50000000,"boards":1,"solvesPerBoard":2,"coldArm":false,"initMs":13,"generateMs":[],"solveMs":[],"nodes":[],"budgetExceeded":0,"error":"solver timeout: generate after 25000ms","cellWallMs":25018,"serverTs":"2026-08-04T22:37:27.884Z"}
{"kind":"solveCell","game":"killer","dim":4,"difficulty":2,"nodeBudget":50000000,"boards":1,"solvesPerBoard":2,"coldArm":false,"initMs":null,"generateMs":[],"solveMs":[],"nodes":[],"budgetExceeded":0,"error":"solver timeout: generate after 25000ms","cellWallMs":25001,"serverTs":"2026-08-04T22:37:52.893Z"}
```

The scenario row closes `cellsRun 2, cellsFailed 2, gate {"mode":"compute"}, tainted false`.
The claim holds on both cells. One wording nit: `initMs 13` is thermo's; killer's `initMs` is
`null` (the second cell reused the first's worker), so "initMs 13, then nothing" describes the
first row, not both.

**The three tags' `hostLoad` rows** — the load discipline. Every load field is reproduced; each
row's own `runId` (it repeats the filename) and `-r13`'s `extra` (the cells/reps query string,
already given above) are elided:

| file | row |
|---|---|
| `…-tophard-r13.jsonl` | `{"kind":"hostLoad","load1Start":7.78,"load1End":7.78,"maxLoad":8.0,"engine":"safari","driverExit":2}` |
| `…-tophard-r13b.jsonl` | `{"kind":"hostLoad","load1Start":15.72,"note":"post-hoc stamp, quiet box, CI remote"}` |
| `…-tophard-r13c.jsonl` | `{"kind":"hostLoad","load1Start":10.75,"maxLoad":8.0,"note":"quiet box, stamped at burst"}` |

**The oversubscription, stated plainly.** The burst that produced the measurement opened at
**load1Start 10.75 against its own `maxLoad` 8.0** — 34% over the gate the rig exists to
enforce — and its note calls the box quiet. The probe's `env` reads `hardwareConcurrency 8`
(Safari caps that figure; it isn't a core count), so the run-queue depth was at least 1.34×
the concurrency the page could see. The `-r13b` attempt stamped **15.72** post-hoc and banked
no cells at all. `-r13` exited 2 (setup) at 7.78. §3's discipline text — *"a burst whose load
rose past the gate is marked `!` and is not quotable"* — was not applied to these rows: they
carry no `!`, and §9.2 quotes them. The finding survives anyway (a timeout under contention is
still a timeout; contention can only make it likelier), but the row is load-suspect and the
record doesn't say so.

The same `10.75` stamp rides `w5-safari-solvecold-sudoku-r13c.jsonl` — the cold arm below was
measured in the same burst window.

## 3 · The r13 generation, bullet by bullet

### 3.1 · Item 4 — sudoku's cold arm (`solvecold-sudoku-r13c`, 7 cells, fresh worker per cell)

| cell | initMs | generateMs | solveMs | wasmMs | nodes | cell wall ms |
|---|---|---|---|---|---|---|
| sudoku 4×4 EASY | 14 | 5 | 1, 1 | 0, 1 | 4, 4 | 25 |
| sudoku 4×4 MEDIUM | 12 | 7 | 1, 1 | 1, 0 | 9, 9 | 25 |
| sudoku 4×4 HARD | 15 | 7 | 1, 1 | 0, 0 | 11, 11 | 29 |
| sudoku 9×9 EASY | 13 | 23 | 1, 1 | 0, 0 | 20, 20 | 43 |
| sudoku 9×9 MEDIUM | 14 | 24 | 1, 1 | 1, 1 | 46, 46 | 44 |
| sudoku 9×9 HARD | 21 | 61 | 2, 1 | 2, 1 | 55, 55 | 90 |
| sudoku 16×16 EASY | **135** | 135 | 3, 3 | 2, 2 | 64, 64 | **281** |

§9.2's *"initMs 12–21ms at 4×4/9×9, 135ms at 16×16-EASY; a cold 16×16 cell lands whole in
281ms wall"* reproduces exactly. `cellsRun 7, cellsFailed 0`.

### 3.2 · Item 6 — the suspect sim cell

| run | window | fps | %ceil | long33 | worst ms | load 1m |
|---|---|---|---|---|---|---|
| `w5-sim-sudoku-solo-r9` (the original suspect) | idle3s | 60.55 | 102.84% | 0 | 28 | 7.21→10.10 **!** |
| `w5-sim-sudoku-solo-r13` (the re-measure §9.2 quotes) | idle3s | 60.25 | 102.33% | 0 | 26 | 7.78→**40.05** **!** |
| `w5-sim-sudoku-solo-r13w` | idle3s | 60.21 | 102.26% | 0 | 21 | 7.22→7.54 |

§9.2 reports the middle row as the vindication of r9. Its own `hostLoad` closes at **40.05**
against the 8.0 gate — five times the gate, and worse contention than the 10.10 that made r9
suspect in the first place. The clean row that actually retires the suspicion is `-r13w`
(7.22→7.54, no flag), which the record doesn't cite for this purpose. Same verdict, different
row.

### 3.3 · The wire re-run (`*-r13w`, 12 cells, live relay)

| run | state | window | fps | %ceil | long33 | busy % | players | ink Δ | peer writes | load 1m |
|---|---|---|---|---|---|---|---|---|---|---|
| `w5-sim-sudoku-solo-r13w` | solo | idle3s | 60.21 | 102.26% | 0 | — | — | — | — | 7.22→7.54 |
| `w5-sim-sudoku-solo-r13w` | solo | liveWindow | 60.47 | 102.70% | 0 | 77.0 | 0 | 0 | — | 7.22→7.54 |
| `w5-sim-sudoku-present-r13w` | present | idle3s | 60.05 | 101.99% | 0 | — | — | — | 0 | 7.98→8.37 **!** |
| `w5-sim-sudoku-present-r13w` | present | liveWindow | 60.51 | 102.77% | 0 | 77.2 | 2 | 0 | 0 | 7.98→8.37 **!** |
| `w5-sim-sudoku-traffic-r13w` | traffic | idle3s | 60.29 | 102.39% | 0 | — | — | — | 21 | 10.28→10.41 **!** |
| `w5-sim-sudoku-traffic-r13w` | traffic | liveWindow | 60.40 | 102.58% | 0 | 78.3 | 2 | 0 | 21 | 10.28→10.41 **!** |
| `w5-sim-kenken-solo-r13w` | solo | idle3s | 60.15 | 102.16% | 0 | — | — | — | — | 7.28→6.93 |
| `w5-sim-kenken-solo-r13w` | solo | liveWindow | 60.51 | 102.77% | 0 | 78.3 | 0 | 0 | — | 7.28→6.93 |
| `w5-sim-kenken-present-r13w` | present | idle3s | 60.25 | 102.33% | 0 | — | — | — | 0 | 6.78→6.20 |
| `w5-sim-kenken-present-r13w` | present | liveWindow | 60.53 | **102.80%** | 0 | 78.1 | 2 | 0 | 0 | 6.78→6.20 |
| `w5-sim-kenken-traffic-r13w` | traffic | idle3s | 59.74 | **101.46%** | 0 | — | — | — | 17 | 6.35→6.12 |
| `w5-sim-kenken-traffic-r13w` | traffic | liveWindow | 60.49 | 102.73% | 0 | 78.2 | 2 | 0 | 17 | 6.35→6.12 |

Peer write counts re-derived from the `.peer.log` `done` rows: kenken traffic **17**, sudoku
traffic **21**, both `present` cells **0** (as designed). `long33` is 0 in all twelve — the
record's load-bearing claim holds. Two corrections to how the band is quoted: the range is
**101.46–102.80%**, not 101.46–102.77% (kenken present's `liveWindow` is the top), and **two of
the twelve rows closed over the 8.0 load gate** (sudoku present 8.37, sudoku traffic 10.41) —
neither disclosed.

### 3.4 · Item 5 — the chromium footnote (`w5-chromium-*-r13`, 15 cells)

Ceiling `w5-chromium-ceiling-r13` = **120.41 fps**. All fifteen `idle3s` rows PASS against the
transposed 98.58% floor, band **99.67–100.02%**, `long33` 0 throughout, `busy %` 74.1–78.4.
Two rows closed over the gate (`killer solo` 8.13, `thermo solo` 8.11). Footnote only — never a
Safari or iOS fact, as chartered.

## 4 · The warm solve matrix — per-cell medians

`w5-summarize.mjs` over the r-series, engine `safari-automation`, `boards: 5` (`__reps=5` × 2
solves = n=10) plus the zero-sample timeout rows. 58 rows: 48 distinct game × board × tier
cells, of which 45 measured and 3 timed out; kenken's nine were taken twice (r4 at load 7.52,
r7 at 6.25) and both passes are kept, which is the wave's only free replication.

| engine | game | board | tier | boards | solve n | solve med ms | solve spread | wasm med ms | wasm spread | gen med ms | gen spread | nodes med | load 1m |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| safari-automation | futoshiki | 4×4 | EASY | 5 | 10 | 0 | 0–1 | 0 | 0–1 | 1 | 1–5 | 6 | 6.57→6.44 |
| safari-automation | futoshiki | 4×4 | MEDIUM | 5 | 10 | 0 | 0–1 | 0 | 0–1 | 0 | 0–1 | 9 | 6.57→6.44 |
| safari-automation | futoshiki | 4×4 | HARD | 5 | 10 | 0 | 0–1 | 0 | 0–1 | 0 | 0–1 | 11 | 6.57→6.44 |
| safari-automation | futoshiki | 5×5 | EASY | 5 | 10 | 0 | 0–0 | 0 | 0–1 | 1 | 0–1 | 10 | 6.57→6.44 |
| safari-automation | futoshiki | 5×5 | MEDIUM | 5 | 10 | 0 | 0–1 | 0 | 0–1 | 0 | 0–1 | 14 | 6.57→6.44 |
| safari-automation | futoshiki | 5×5 | HARD | 5 | 10 | 0 | 0–1 | 0 | 0–1 | 0 | 0–1 | 17 | 6.57→6.44 |
| safari-automation | futoshiki | 6×6 | EASY | 5 | 10 | 0 | 0–1 | 0 | 0–1 | 0 | 0–1 | 14 | 6.57→6.44 |
| safari-automation | futoshiki | 6×6 | MEDIUM | 5 | 10 | 0 | 0–1 | 0 | 0–1 | 0 | 0–1 | 20 | 6.57→6.44 |
| safari-automation | futoshiki | 6×6 | HARD | 5 | 10 | 0 | 0–1 | 0 | 0–0 | 1 | 1–1 | 25 | 6.57→6.44 |
| safari-automation | futoshiki | 7×7 | EASY | 5 | 10 | 0 | 0–1 | 0 | 0–0 | 1 | 1–2 | 20 | 6.57→6.44 |
| safari-automation | futoshiki | 7×7 | MEDIUM | 5 | 10 | 0 | 0–0 | 0 | 0–1 | 2 | 1–2 | 27 | 6.57→6.44 |
| safari-automation | futoshiki | 7×7 | HARD | 5 | 10 | 0 | 0–1 | 0 | 0–0 | 3 | 2–3 | 34 | 6.57→6.44 |
| safari-automation | kenken | 4×4 | EASY | 5 | 10 | 0 | 0–1 | 0.5 | 0–1 | 1 | 1–5 | 15 | 7.52→7.52 |
| safari-automation | kenken | 4×4 | MEDIUM | 5 | 10 | 0 | 0–1 | 0 | 0–1 | 0 | 0–1 | 14 | 7.52→7.52 |
| safari-automation | kenken | 4×4 | HARD | 5 | 10 | 0 | 0–1 | 0 | 0–1 | 0 | 0–1 | 14 | 7.52→7.52 |
| safari-automation | kenken | 5×5 | EASY | 5 | 10 | 0 | 0–1 | 0 | 0–1 | 1 | 1–2 | 24 | 7.52→7.52 |
| safari-automation | kenken | 5×5 | MEDIUM | 5 | 10 | 0 | 0–1 | 0 | 0–1 | 1 | 1–1 | 25 | 7.52→7.52 |
| safari-automation | kenken | 5×5 | HARD | 5 | 10 | 0 | 0–1 | 0 | 0–0 | 1 | 0–1 | 21 | 7.52→7.52 |
| safari-automation | kenken | 6×6 | EASY | 5 | 10 | 0.5 | 0–1 | 0 | 0–1 | 2 | 2–3 | 36 | 7.52→7.52 |
| safari-automation | kenken | 6×6 | MEDIUM | 5 | 10 | 0 | 0–1 | 0 | 0–1 | 3 | 2–3 | 35 | 7.52→7.52 |
| safari-automation | kenken | 6×6 | HARD | 5 | 10 | 0 | 0–1 | 0 | 0–1 | 2 | 1–2 | 32 | 7.52→7.52 |
| safari-automation | kenken | 4×4 | EASY | 5 | 10 | 0 | 0–1 | 0 | 0–1 | 1 | 1–5 | 16 | 6.25→6.87 |
| safari-automation | kenken | 4×4 | MEDIUM | 5 | 10 | 0 | 0–1 | 0 | 0–1 | 0 | 0–1 | 15 | 6.25→6.87 |
| safari-automation | kenken | 4×4 | HARD | 5 | 10 | 0 | 0–1 | 0 | 0–0 | 0 | 0–1 | 14 | 6.25→6.87 |
| safari-automation | kenken | 5×5 | EASY | 5 | 10 | 0 | 0–1 | 0 | 0–1 | 1 | 1–1 | 25 | 6.25→6.87 |
| safari-automation | kenken | 5×5 | MEDIUM | 5 | 10 | 0 | 0–2 | 0 | 0–0 | 1 | 1–1 | 24 | 6.25→6.87 |
| safari-automation | kenken | 5×5 | HARD | 5 | 10 | 0 | 0–0 | 0 | 0–1 | 1 | 1–1 | 20 | 6.25→6.87 |
| safari-automation | kenken | 6×6 | EASY | 5 | 10 | 0 | 0–1 | 0.5 | 0–1 | 3 | 2–3 | 35 | 6.25→6.87 |
| safari-automation | kenken | 6×6 | MEDIUM | 5 | 10 | 0 | 0–1 | 0 | 0–1 | 2 | 2–3 | 35 | 6.25→6.87 |
| safari-automation | kenken | 6×6 | HARD | 5 | 10 | 0 | 0–1 | 0 | 0–1 | 2 | 2–3 | 33 | 6.25→6.87 |
| safari-automation | killer | 4×4 | EASY | 5 | 10 | 0 | 0–1 | 0 | 0–1 | 1 | 0–6 | 4 | 6.25→6.25 |
| safari-automation | killer | 4×4 | MEDIUM | 5 | 10 | 0 | 0–1 | 0 | 0–0 | 0 | 0–1 | 9 | 6.25→6.25 |
| safari-automation | killer | 4×4 | HARD | 5 | 10 | 0 | 0–1 | 0 | 0–0 | 1 | 0–1 | 12 | 6.25→6.25 |
| safari-automation | killer | 9×9 | EASY | 5 | 10 | 0 | 0–1 | 0 | 0–1 | 3 | 2–5 | 20 | 6.25→6.25 |
| safari-automation | killer | 9×9 | MEDIUM | 5 | 10 | 0 | 0–1 | 0 | 0–1 | 6 | 5–7 | 46 | 6.25→6.25 |
| safari-automation | killer | 9×9 | HARD | 5 | 10 | 1 | 0–1 | 1 | 0–1 | 16 | 16–20 | 64 | 6.25→6.25 |
| safari-automation | killer | 16×16 | EASY | 5 | 10 | 1 | 0–2 | 1 | 0–1 | 59 | 56–61 | 64 | 6.25→6.25 |
| safari-automation | killer | 16×16 | MEDIUM | 5 | 10 | 8.5 | 4–12 | 8 | 3–12 | 395 | 197–467 | 146 | 6.25→6.25 |
| safari-automation | killer | 16×16 | HARD | 0 | 0 | — | — | — | — | — | — | — | 10.75→null · solver timeout: generate after 25000ms |
| safari-automation | sudoku | 4×4 | EASY | 5 | 10 | 0 | 0–1 | 0 | 0–1 | 1 | 0–3 | 4 | null→null |
| safari-automation | sudoku | 4×4 | MEDIUM | 5 | 10 | 0 | 0–1 | 0 | 0–0 | 0 | 0–1 | 9 | null→null |
| safari-automation | sudoku | 4×4 | HARD | 5 | 10 | 0 | 0–1 | 0 | 0–0 | 0 | 0–1 | 12 | null→null |
| safari-automation | sudoku | 9×9 | EASY | 5 | 10 | 0 | 0–1 | 0 | 0–1 | 3 | 2–4 | 20 | null→null |
| safari-automation | sudoku | 9×9 | MEDIUM | 5 | 10 | 0 | 0–1 | 0 | 0–1 | 4 | 4–5 | 46 | null→null |
| safari-automation | sudoku | 9×9 | HARD | 5 | 10 | 1 | 0–2 | 0 | 0–1 | 18 | 15–24 | 57 | null→null |
| safari-automation | sudoku | 16×16 | EASY | 5 | 10 | 1 | 0–1 | 1 | 0–1 | 45 | 45–46 | 64 | null→null |
| safari-automation | sudoku | 16×16 | MEDIUM | 5 | 10 | **44** | 3–668 | 39.5 | 3–668 | **684** | 198–1748 | 182 | null→null |
| safari-automation | sudoku | 16×16 | HARD | 0 | 0 | — | — | — | — | — | — | — | null→null · solver timeout: generate after 25000ms |
| safari-automation | thermo | 4×4 | EASY | 5 | 10 | 0 | 0–1 | 0 | 0–1 | 0 | 0–4 | 4 | 6.44→6.25 |
| safari-automation | thermo | 4×4 | MEDIUM | 5 | 10 | 0 | 0–0 | 0 | 0–0 | 1 | 1–1 | 9 | 6.44→6.25 |
| safari-automation | thermo | 4×4 | HARD | 5 | 10 | 0 | 0–0 | 0 | 0–1 | 0 | 0–1 | 12 | 6.44→6.25 |
| safari-automation | thermo | 9×9 | EASY | 5 | 10 | 0.5 | 0–1 | 0 | 0–0 | 2 | 2–4 | 20 | 6.44→6.25 |
| safari-automation | thermo | 9×9 | MEDIUM | 5 | 10 | 0 | 0–1 | 0 | 0–1 | 5 | 5–6 | 46 | 6.44→6.25 |
| safari-automation | thermo | 9×9 | HARD | 5 | 10 | 1 | 0–3 | 1 | 1–3 | 26 | 21–43 | 64 | 6.44→6.25 |
| safari-automation | thermo | 16×16 | EASY | 5 | 10 | 1 | 0–1 | 1 | 0–1 | 51 | 51–53 | 64 | 6.44→6.25 |
| safari-automation | thermo | 16×16 | MEDIUM | 5 | 10 | 8 | 3–106 | 7 | 3–11 | 175 | 164–409 | 146 | 6.44→6.25 |
| safari-automation | thermo | 16×16 | HARD | 0 | 0 | — | — | — | — | — | — | — | 10.75→null · solver timeout: generate after 25000ms |

The `null→null` loads are rows the summarizer could not stamp, not rows that ran unloaded.

## 5 · Divergences found at extraction

Re-derived 2026-08-25 from the raw rows. The sealed prose stands; these are the deltas an
auditor reading both will hit.

| where | the record says | the raws say | how it was re-derived |
|---|---|---|---|
| `README.md` §5.1, §5.2, §8.2 · sudoku 16×16 MEDIUM **solve** | **55 ms** median | **44 ms** median | `w5-safari-solve-sudoku-r6.jsonl`, `solveMs` = `[3, 3, 103, 143, 33, 20, 668, 158, 55, 6]` → sorted `[3, 3, 6, 20, 33, 55, 103, 143, 158, 668]`, n=10. `w5-summarize.mjs:33-38` averages the two central samples → **44.0**, and prints 44 in `r13-solve-summary.txt`. `55` is the *upper* central sample — what an `s[n>>1]` median returns. The tracked summarizer has only ever had the averaging form (one commit, `f1aafba0`, the same commit that wrote this record), so the record's figure doesn't match its own instrument either way. The generation figures (684 ms median, 198–1748) are correct. The 55 propagated to the T8 close record §5 ("solve 55ms"). |
| `README.md` §9.2 · item 6 | the r13 re-measure retires the suspicion | the r13 re-measure closed at **load 40.05** vs an 8.0 gate | `w5-sim-sudoku-solo-r13.jsonl` `hostLoad`. The clean row is `-r13w` (7.22→7.54). Same verdict, different row. |
| `README.md` §9.2 · the wire re-run band | 101.46–102.77% | **101.46–102.80%**; two of twelve rows closed over the load gate | `r13-boil-summary.txt`, twelve `-r13w` rows |
| `README.md` §9.2 · the tophard cells | quoted without a load caveat | the burst opened at **10.75** vs its own 8.0 gate; §3's rule marks such a row unquotable | `w5-safari-solve-tophard-r13c.jsonl` `hostLoad` |
| `README.md` §9.2 · "initMs 13, then nothing" | reads as both cells | thermo `initMs 13`; killer `initMs null` | the two `solveCell` rows in §2 |

None of these overturn a §9.2 verdict — the two HARD timeouts, the cold arm's numbers, the
twelve `long33 0` cells and the footnote's shape all reproduce. What changes is what an auditor
can check, and the load stamps the record left out.
