# T7-W6 — the perf lane's new floors, derived

W6 §vacuous gates: "`undoBurst`/`hoverSweep`/`solveWindow` are measured every run and priced in
gates.json nowhere… **No boot-TBT floor exists.**" Two floors land here, two rows stay declared
diagnostic, and two new scenarios arrive with readings and no floor.

**Host** darwin, 18 cpus, 2026-08-03. A contended box throughout — sibling waves were building
and driving Playwright, and the 1-minute load ran 7 → 42 across the session. Every run below
prints its own load at start and finish; the readings that back a floor are the ones whose
app-free control held (`long33 0`), per the rig's own admissibility law.

**Dist** three entry hashes crossed this session, a sibling rebuilding `dist/` under the rig:
`index-c2jZv3HXdfIh` → `index-BbRtDGOlVTam` → `index-D2gF0ovvWmO7`. Each reading below names
its own. This is the documented `dist/` trap (perf-rig/README.md, "why row 2 is an instrument
and not a habit") and it is the second reason both floors carry **RESTAMP AT WGATE**.

---

## 1 · `undoBurst` — GATE C

The number has existed since P1 and been priced nowhere. It needs **two** numbers because it
has two surfaces.

**The real-Safari floor — `desktop.undoBurst.minFps: 52`.** The r1/T5-W1 train
(`docs/tranches/2026-08-tranche-5/evidence/w1/perf-rig-run-manifest.txt:53-55`) read

| run | fps | long33 | worstMs |
| --- | --- | --- | --- |
| safari-C1 | 56.60 | 14 | 36 |
| safari-C2 | 54.39 | 15 | 42 |
| safari-C3 | 54.78 | 15 | 45 |

median 54.78 against the 98.4 ceiling — 55.7 %. Floored ~5 % under the median at **52**, the
same shape as its neighbours in the `desktop` block, enforced by the manual matrix.

**The CI floor — `desktop.undoBurst.ciMinPctOfCeiling: 0.90`.** Transposing 52/98.4 the way
GATE B transposes `idle3s` would have given CI a floor at 52.8 % of its measured ceiling. Here
is what the harness actually reads on that window:

| run | dist | engine | control fps / long33 | undoBurst median | % of ceiling |
| --- | --- | --- | --- | --- | --- |
| smoke, `--runs 1` | `c2jZv3HX` | chromium | 132.99 / 0 | 133.33 | 100.26 % |
| smoke, `--runs 1` | `c2jZv3HX` | webkit | 97.93 / 0 | 98.05 | 100.12 % |
| derive-A, `--runs 3` | `BbRtDGOl` | chromium | 133.09 / 0 | 133.63 | 100.41 % |
| derive-B, `--runs 3` | `D2gF0ovv` | chromium | 133.64 / 0 | 134.54 | 100.67 % |
| webkit-only, `--runs 3` | `D2gF0ovv` | webkit | 98.00 / 0 | 98.09 | 100.09 % |
| final-green, `--runs 3` | `D2gF0ovv` | chromium | 127.93 / 0 | 127.00 | 99.27 % |
| final-green, `--runs 3` | `D2gF0ovv` | webkit | 97.97 / 0 | 98.13 | 100.16 % |
| final-green-2, `--runs 3` | `D2gF0ovv` | chromium | 132.66 / 0 | 133.85 | 100.90 % |
| final-green-2, `--runs 3` | `D2gF0ovv` | webkit | 98.00 / 0 | 98.36 | 100.37 % |

Headless engines hold their ceiling on this window; real Safari does not (it drops ~15 frames).
A 52.8 % floor would sit **47 points under live** — the 43–400 % slack this tranche exists to
remove, re-created on arrival. So the CI arm declares its fraction outright:

    floor = min(clean readings) − ~9 points = 99.27 % − 9.3 = 0.90

Two full-matrix runs confirm it, both on dist `index-D2gF0ovvWmO7.js` with clean controls and
`EXIT=0`: GATE C required 115.14 / 88.17 against measured 127.00 / 98.13, then 119.39 / 88.20
against 133.85 / 98.36. `final-green-2` is the one taken on the file exactly as committed. Every
earlier arm ran while the floor was still the provisional 0.92 — the stricter number — so those
passes hold a fortiori.

**One more vacuity closed while the floor was being set.** GATE C's first cut printed
`NOT MEASURED` and let the run exit 0 whenever `undoBurst` produced too few clean windows — the
same shape as the row this wave opened. It now books an instrument failure for that engine's
row, so a GATE C that could not be measured can no longer ride out green on GATE A and B.

**Inadmissible readings, named and excluded.** Both `--runs 3` runs failed webkit's control
under contention (`long33` 1 and 3 against an allowance of 0) and issued no webkit verdict. In
those same runs webkit's `undoBurst` dipped to 87.7 % and 89.2 % of ceiling — under 0.90. That
is the argument for the control-validity gate, not against the floor: the run that produced
those numbers refused to grade them, exactly as designed. There is no observed case of a
control-clean host reading `undoBurst` below 100 %.

`hoverSweep` and `solveWindow` stay **unpriced by declaration** — the reasons are in
`perf-rig/README.md` § "the unpriced rows", one per row: `hoverSweep` measures a CSS *replay*
rather than a pointer, and `solveWindow`'s number is a mechanism census (`filterExecPerSec`)
that `filterBudget` already owns.

---

## 2 · boot TBT — GATE D

W6 offered two arms: "add a boot-window TBT scenario with a floor, or record explicitly that
boot blocking is unpriced." **W6 took the floor arm.** The rig's architecture allowed it: the
probe is injected as a classic script immediately before `</head>`, so it runs before the app's
deferred module, and a `longtask` PerformanceObserver armed at the top of the probe captures the
whole mount burst. The `bootTbt` scenario gets its **own page load** — a boot is not something a
driven page still has.

**The measurement.** TBT = Σ over long tasks starting inside `boot.tbt.windowMs` of
`max(0, duration − 50)`, the standard definition, so the number reads against any other TBT.

| run | dist | rate | windows | median TBT | tasks | longest task |
| --- | --- | --- | --- | --- | --- | --- |
| smoke | `c2jZv3HX` | 4× | 1 | 218 ms | 6 | 210 ms |
| derive-A | `BbRtDGOl` | 4× | 3 (287/357/316) | 316 ms | 10–11 | 248–274 ms |
| derive-B | `D2gF0ovv` | 4× | 3 | 275 ms | 9–11 | 228–274 ms |
| final-green | `D2gF0ovv` | 4× | 3 | 343 ms | — | — |
| throttle control | `BbRtDGOl` | **1×** | 2 (5/4) | 4.5 ms | 1 | 55 ms |

The 1× arm is the throttle's own control, and it is the reason the 4× numbers can be trusted:
same script, same box, a gates.json copy with `cpuThrottleRate: 1`, and a **60–70×** separation.
CDP throttling is demonstrably applied, not silently dropped. The rig refuses to grade at all
if the rate is requested and cannot be set (exit 2) — an unthrottled number read against a
throttled floor is a different measurement, not a lenient one.

**`boot.tbt.maxTbtMs: 1200`, provisional and deliberately generous.** The floor's target is a
2-core ubuntu runner, several times slower per thread than this box; a floor cut to darwin's
218–343 ms band would manufacture a red on the runner's first green tree. 1200 ms sits about
3.5× the worst darwin median and about 1.7× the ~714 ms @4× train the W6 audit itself cites,
which makes it
a live tripwire for the regression class that matters — a new synchronous raster or decode on
the boot path — without being a false-red machine. **RESTAMP AT WGATE off a runner reading**,
per W6's binding floor-timing clause.

**WebKit is NOT MEASURED, and says so.** Playwright WebKit ships no `longtask` entry type. The
support bit is read in the page and travels with the reading; the verdict table prints
`NOT MEASURED` for that row, never `PASS`, and a run in which no engine could measure it exits
2 (proven: `--engines webkit` alone, `ci-subset-ablation.txt` §5).

---

## 3 · `galleryDrag` and `drawerToggle` — measured, unpriced, and declared so

The two surfaces the owner's T6 marks created, given instruments. Both are **diagnostic: no
floor in gates.json**, and `perf-rig/README.md` § "the unpriced rows" says so in the same words.
Both carry their own proof of work, because a synthetic gesture the app ignored would otherwise
hand back a perfectly plausible frame curve — of the app sitting still.

Both engines, dist `index-D2gF0ovvWmO7.js` (build-identity line banked with the run), load 6.58,
`--attempts 1`, 1440×900:

| engine | scenario | fps | p50 | p95 | long33 | worst | frames | proof of work |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| chromium | `galleryDrag` | 128.11 | 7.7 | 9.4 | 1 | 118.8 ms | 308 | `scrollLeft 0 → 312 → 704`, moved |
| chromium | `drawerToggle` | 128.77 | 7.7 | 9.2 | 1 | 95.2 ms | 335 | `aria-expanded true/false/true` |
| webkit | `galleryDrag` | 91.51 | 10 | 12 | 2 | 97 ms | 220 | `scrollLeft 0 → 312 → 704`, moved |
| webkit | `drawerToggle` | 93.98 | 10 | 12 | 1 | 131 ms | 245 | `aria-expanded true/false/true` |

A second take on the same dist reproduced it within noise — chromium 129.32/130.39, webkit
91.97/94.25, worst frames 73.7 / 89.1 / 92 / 120 ms, identical `scrollLeft` and
`aria-expanded` trails. Both takes are in `perf-rig-runs.txt`.

Both surfaces drop frames on both engines — the drag's worst frame is 74–119 ms, the drawer's
89–131 ms, against a ~7.7/10 ms p50. That is an argument for pricing them, not for pricing them
*today*: two takes on one machine is how a floor arrives 43–400 % slack. The decision belongs to
the WGATE restamp, with the rest of the floors.

---

## 4 · What changed, and where

| file | change |
| --- | --- |
| `patches/p1-safari-ios-performance/gates.json` | `desktop.undoBurst` (`minFps` 52 · `ciMinPctOfCeiling` 0.90) and `boot.tbt` (`maxTbtMs` 1200 · `cpuThrottleRate` 4 · `windowMs` 3000), each with its derivation and its restamp note |
| `perf-rig/probe.js` | the boot `longtask` observer (support asserted, never assumed) + `bootTbt`, `galleryDrag`, `drawerToggle`; a synthetic-pointer primitive |
| `perf-rig/ci-subset.mjs` | GATE C + GATE D; accumulate-then-grade; `--canary-fail` |
| `perf-rig/README.md` | four gates, the grading-order rule, the full 13-key scenario roster partitioned, the unpriced rows and their reasons, the boot-arm statement |

Doc-truth's `perf-rig-scenario-roster` row (D20) reads GREEN against the new roster: 13 keys,
`CI-gated: bootTbt, idle3s, undoBurst`, `diagnostic-only: domDump, styleDump`, drivers' default
set unchanged.
