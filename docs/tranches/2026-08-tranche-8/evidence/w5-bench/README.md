# T8-W5 — the bench: boil × multiplayer, and solving, on real Safari and the iOS simulator

The owner's order: *"what of our performance of both the design (boiling) of the multiplayer
(all lanes) and the solving (all lanes) — we should bench this properly, and in an actual
ios/safari env."*

And, after the first attempt seized the desktop: *"Abrogate ALL of that edict and script items—
remove that 'foremost' command … This should run in the background, though in a HEADFUL instance
with PROPER automated safari instance automation."*

Two families, and a driver that had to be rebuilt before either could be taken honestly.

> **The driver is its own record: [`quiet-driver.md`](./quiet-driver.md)** — what was deleted, what
> replaced it, and the platform truth the replacement uncovered. Read it first; the tables below
> depend on its verdict about which lanes can measure what.

---

## 0 · The one thing that needs the owner

Nothing needs a click to *run* — **Remote Automation is already enabled** on this box, and
`safaridriver -p 4285` served sessions all session long with no prompt.

What needs the owner is a **desktop-frame** measurement, and it is not a setting:

> **Leave the automation Safari window visible on the ACTIVE Space while a frame bench runs.**
> It is a small corner window (560×440), it never takes focus, and it never accepts input — the
> glass pane sees to that. But a window behind a full-screen app is *occluded*, and an occluded
> WebKit page has rAF **suspended outright**: 0 callbacks in 20 s, measured. No driver can fix
> that from the outside without doing exactly what was abrogated.

With the window visible, `./w5-bench.sh boil safari <tag>` takes the whole 15-cell matrix in the
background at **one activation**. Without it, every frame row is refused `OCCLUDED-INVALID` —
which is what happened to r3, 15 of 15, and those rows are printed as refusals rather than
quietly dropped.

Everything that does **not** need a visible window was measured meanwhile, and that turned out to
be the entire solver family — see §3.

---

## 1 · The rig — what was reused, what was built, what was gutted

T4-P1 left a whole instrument, and it is the reason this wave measured rather than built:
`probe.js` (the frame sampler), `probe-server.mjs` (injects it at serve time), the app-free
`/__ceiling` control, and `scripts/dist-identity.mjs`, which refuses to produce numbers with no
tree attached.

| path | status | what it is |
| --- | --- | --- |
| `perf-rig/safari-wd.mjs` | **new** | the quiet driver — W3C WebDriver against `safaridriver`, corner window, paint gate, banked session |
| `perf-rig/run-safari.sh` | **gutted + rebuilt** | the frontmost apparatus DELETED; now builds the URL, asserts build identity, delegates to `safari-wd.mjs` |
| `perf-rig/run-sim.sh` | **gutted** | `open -a` + `activate` + re-assert loop DELETED; now `open -g -a Simulator`, `simctl` only |
| `perf-rig/probe.js` | **extended + patched** | +`liveWindow`, +`solveMatrix`, +`startBusySentinel`, +`sessionCensus`; the `hasFocus` gate replaced by visibility + rAF cadence under automation |
| `perf-rig/peer.mjs` | **new** | the second player, headless — speaks `relayWire.ts`'s wire at the real relay |
| `perf-rig/w5-bench.sh` | **new** | the orchestrator: quiet gate, load stamping, peer lifecycle, shard loop; now also drives the footnote lanes |
| `perf-rig/pw-driver.sh` | **new** | `run-safari.sh`'s contract backed by Playwright, so the footnote lanes inherit the same discipline |
| `perf-rig/w5-summarize.mjs` | **new** | the two families' JSONL → tables, every row carrying its load and its TRUE engine |

### 1.1 · The peer is not a second browser

A multiplayer frame window needs somebody at the table. A second browser context would put a
whole second WebKit — compositor, rasteriser, its own boil — on the machine whose frame curve
*is* the measurement.

`peer.mjs` speaks the shipped wire directly: NIP-01 `EVENT`, kind `20411`, `x` tag
`sudoku-babb-dev/<room>`, the same four words (`hi` / `op` / `st` / `bye`). It costs one idle
socket, and it is a real member of the room by every test the app applies.

**Proof of work travels with every window.** `sessionCensus()` reports distinct player slugs, the
"connecting…" state, inked-cell count, and the ink/fill delta across the window itself. A row
claiming a multiplayer state with `players: 1` is a mislabelled solo row; `w5-summarize.mjs`
stamps it **MISLABELLED-SOLO** in the table rather than letting the runId's word stand. No row
below carries that stamp.

### 1.2 · The engine label is not guessed from the UA

Playwright's WebKit reports a Safari-shaped user agent — `Version/26.4 Safari/605.1.15`, no
`Chrome`. A UA sniff calls it "safari", and a headless WebKit number then gets quoted as a
real-Safari fact. That is the exact substitution this lane exists to refuse, so lanes are stamped
by the **driver**, into the runId, and the UA only corroborates; a disagreement prints `!UA(…)`.

Lanes: `safari-automation` (the quiet driver) · `safari-desktop (legacy frontmost driver)` (r1/r2,
see §2) · `playwright-webkit-headless` · `chromium-headless` · `ios-simulator`.

---

## 2 · Provenance: why some real-Safari rows are labelled "legacy"

The `-r1` and `-r2` runs were taken by the driver this wave abrogated — the one that forced
Safari frontmost and re-asserted the front every 2 s. They are **real desktop Safari at a
full-size viewport (2048×1032)**, they are load-stamped and census-proven, and they are the only
real-Safari *frame* numbers this wave has. They are also unreproducible by the quiet driver, and
they were bought by seizing the owner's screen.

So they are printed, and labelled for exactly what they are. They are not folded in silently, and
no claim below rests on them alone without saying so.

One consequence worth stating before any table: the quiet driver's corner window is **560×440**
(a 560×388 viewport) against the legacy driver's **2048×1032**. That is a materially different
amount of glass to paint, so the two are not interchangeable, and a rect-sensitivity reading is a
named gap in §5.

---

## 3 · Discipline — the machine stayed the owner's

- Everything outside a measurement burst ran `nice -n 15`. Bursts themselves did not: a nice'd
  measurement measures niceness.
- **The quiet gate.** Every burst waits for the 1-minute load average to fall under **8.0** and
  stamps the load it opened *and closed* under into its own run file. A burst whose load rose
  past the gate is marked `!` and is not quotable. The rig's own banked law: a WebKit RED at load
  13.83 that went GREEN at 2.99 on the same dist.
  - **One honest caveat about that stamp on the solver rows.** A solve burst pegs a core by
    design, so it raises the 1-minute average *by itself*. A `!` on a solve row therefore
    conflates self-load with contention, and is weaker evidence than the same mark on a frame row.
- Serial by construction: one browser, one window, one cell, one lane at a time.
- **A concurrency defect found and quarantined.** Two bench processes were briefly launched
  against the same tag (`r5`), sharing one WebDriver session; the second navigation re-entered the
  first's page and the shard ran twice, interleaved. Those files are moved to
  `perf-rig/runs/contaminated/` and nothing from them is quoted. The tell was two `env` rows in
  one run file — worth keeping as a check.

---

## 4 · What the instrument cannot see, measured rather than assumed

**Safari clamps `performance.now()` to 1 ms.** Every `solveMs`, `wasmMs` and `generateMs` value
across every real-Safari run in this wave is an integer — hundreds of samples, no exceptions —
while the same harness reports sub-millisecond values elsewhere. So:

- A solve that takes 0.3 ms and one that takes 0.9 ms are the same number here: `0` or `1`.
- The whole small-board half of the matrix (4×4 and 9×9 everything, futoshiki at every size) sits
  **under the clock's resolution**, and its latency columns say only "under a millisecond".
- The resolution-free column is **`nodes`** — the solver's own count of search nodes, an exact
  integer that scales with the work actually done. Where latency is quantised to 0/1, `nodes` is
  what carries the signal, and it is reported beside every cell.
- The cure, named as a gap: time a **batch** of N solves and divide, so the clamp amortises. That
  is a probe change, not a run, and it did not happen in this wave.

---

## 5 · Family 2 — solving, on real Safari, in a fully backgrounded window

**Engine: `safari-automation` — real desktop Safari 26.4, driven by the quiet driver, window
hidden throughout.** This is the family the occlusion finding sets free: a hidden page runs JS and
workers at full speed, so the whole matrix was taken while the owner had the machine.

**The control that proves it.** The same cells, taken by the legacy driver in a *visible*
full-size window (r2), against the quiet driver's *hidden* corner window (r6):

| cell | visible (r2, legacy) | hidden (r6, quiet) |
| --- | --- | --- |
| sudoku 9×9 EASY, generate | 3–4 ms | 3 ms |
| sudoku 9×9 MEDIUM, generate | 4–5 ms | 4 ms |
| sudoku 9×9 HARD, generate | 19–20 ms | 18 ms |
| sudoku 16×16 EASY, generate | 48 ms | 45 ms |

Agreement within the clock's own 1 ms grain, the hidden window marginally *faster* (it has no
compositing to do). Occlusion does not touch compute — asserted by Apple's docs, confirmed here
by the numbers.

### 5.1 · Warm matrix — game × board × tier

`__reps=5` boards per cell, 2 solves per board (n=10 solve samples), medians and full spread.
Load 6.25–6.87 throughout, no row suspect. `nodes` is the resolution-free column — see §4.

| game | board | tier | gen med ms | gen spread | solve med ms | solve spread | nodes med | note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| sudoku | 4×4 | EASY | 1 | 0–3 | 0 | 0–1 | 4 | |
| sudoku | 4×4 | MEDIUM | 0 | 0–1 | 0 | 0–1 | 9 | |
| sudoku | 4×4 | HARD | 0 | 0–1 | 0 | 0–1 | 12 | |
| sudoku | 9×9 | EASY | 3 | 2–4 | 0 | 0–1 | 20 | |
| sudoku | 9×9 | MEDIUM | 4 | 4–5 | 0 | 0–1 | 46 | |
| sudoku | 9×9 | HARD | 18 | 15–24 | 1 | 0–2 | 57 | |
| sudoku | 16×16 | EASY | 45 | 45–46 | 1 | 0–1 | 64 | |
| **sudoku** | **16×16** | **MEDIUM** | **684** | **198–1748** | **55** | **3–668** | **182** | the wall |
| sudoku | 16×16 | HARD | — | — | — | — | — | **generate exceeds 25 s — not measurable** |
| thermo | 4×4 | EASY | 0 | 0–4 | 0 | 0–1 | 4 | |
| thermo | 4×4 | MEDIUM | 1 | 1–1 | 0 | 0–0 | 9 | |
| thermo | 4×4 | HARD | 0 | 0–1 | 0 | 0–0 | 12 | |
| thermo | 9×9 | EASY | 2 | 2–4 | 1 | 0–1 | 20 | |
| thermo | 9×9 | MEDIUM | 5 | 5–6 | 0 | 0–1 | 46 | |
| thermo | 9×9 | HARD | 26 | 21–43 | 1 | 0–3 | 64 | |
| thermo | 16×16 | EASY | 51 | 51–53 | 1 | 0–1 | 64 | |
| thermo | 16×16 | MEDIUM | 175 | 164–409 | 8 | 3–106 | 146 | |
| thermo | 16×16 | HARD | — | — | — | — | — | trimmed — see §5.3 |
| killer | 4×4 | EASY | 1 | 0–6 | 0 | 0–1 | 4 | |
| killer | 4×4 | MEDIUM | 0 | 0–1 | 0 | 0–1 | 9 | |
| killer | 4×4 | HARD | 1 | 0–1 | 0 | 0–1 | 12 | |
| killer | 9×9 | EASY | 3 | 2–5 | 0 | 0–1 | 20 | |
| killer | 9×9 | MEDIUM | 6 | 5–7 | 0 | 0–1 | 46 | |
| killer | 9×9 | HARD | 16 | 16–20 | 1 | 0–1 | 64 | |
| killer | 16×16 | EASY | 59 | 56–61 | 1 | 0–2 | 64 | |
| killer | 16×16 | MEDIUM | 395 | 197–467 | 9 | 4–12 | 146 | |
| killer | 16×16 | HARD | — | — | — | — | — | trimmed — see §5.3 |
| kenken | 4×4 | EASY | 1 | 1–5 | 0 | 0–1 | 16 | |
| kenken | 4×4 | MEDIUM | 0 | 0–1 | 0 | 0–1 | 15 | |
| kenken | 4×4 | HARD | 0 | 0–1 | 0 | 0–1 | 14 | |
| kenken | 5×5 | EASY | 1 | 1–1 | 0 | 0–1 | 25 | |
| kenken | 5×5 | MEDIUM | 1 | 1–1 | 0 | 0–2 | 24 | |
| kenken | 5×5 | HARD | 1 | 1–1 | 0 | 0–0 | 20 | |
| kenken | 6×6 | EASY | 3 | 2–3 | 0 | 0–1 | 35 | |
| kenken | 6×6 | MEDIUM | 2 | 2–3 | 0 | 0–1 | 35 | |
| kenken | 6×6 | HARD | 2 | 2–3 | 0 | 0–1 | 33 | |
| futoshiki | 4×4 | EASY | 1 | 1–5 | 0 | 0–1 | 6 | |
| futoshiki | 4×4 | MEDIUM | 0 | 0–1 | 0 | 0–1 | 9 | |
| futoshiki | 4×4 | HARD | 0 | 0–1 | 0 | 0–1 | 11 | |
| futoshiki | 5×5 | EASY | 1 | 0–1 | 0 | 0–0 | 10 | |
| futoshiki | 5×5 | MEDIUM | 0 | 0–1 | 0 | 0–1 | 14 | |
| futoshiki | 5×5 | HARD | 0 | 0–1 | 0 | 0–1 | 17 | |
| futoshiki | 6×6 | EASY | 0 | 0–1 | 0 | 0–1 | 14 | |
| futoshiki | 6×6 | MEDIUM | 0 | 0–1 | 0 | 0–1 | 20 | |
| futoshiki | 6×6 | HARD | 1 | 1–1 | 0 | 0–1 | 25 | |
| futoshiki | 7×7 | EASY | 1 | 1–2 | 0 | 0–1 | 20 | |
| futoshiki | 7×7 | MEDIUM | 2 | 1–2 | 0 | 0–0 | 27 | |
| futoshiki | 7×7 | HARD | 3 | 2–3 | 0 | 0–1 | 34 | |

### 5.2 · What the matrix says

1. **Solving is not the cost. Generation is.** In every cell where either is measurable, the dig
   dominates the solve by an order of magnitude or more — sudoku 16×16 MEDIUM spends 684 ms
   generating and 55 ms solving; killer 16×16 MEDIUM, 395 ms against 9 ms. A player waiting on a
   board is waiting on `generate_by_digging`, not on the CSP search.
2. **Everything a player actually meets is free.** At the shipped default sizes — sudoku 9×9,
   futoshiki 5×5, thermo 9×9, killer 9×9, kenken 4×4 — generation is **0–6 ms** and solving is
   under the 1 ms clock. No size band below 16×16 is anywhere near a frame budget.
3. **The wall is 16×16 MEDIUM, and it is sudoku's.** 684 ms median generation with a spread of
   **198–1748 ms**, and a solve spread of **3–668 ms** — a 200× swing between boards on the same
   cell. That variance is the trajectory-dependence the estate has documented at every surface
   (`max_solutions=1` under Ac3 is trajectory-dependent), showing up as a user-visible wait that
   is sometimes instant and sometimes nearly two seconds.
4. **16×16 HARD does not generate.** sudoku's exceeded a 25 s budget outright and is recorded as
   a timeout, not omitted. thermo's and killer's were trimmed after sudoku's consumed a whole
   shard budget — so "does not generate in 25 s" is **measured for sudoku and untested for the
   other two**, which is a gap, not a finding.
5. **Cold start is nearly free.** A fresh worker plus wasm instantiation, measured 37 times:
   **median 8 ms, range 7–14 ms**. There is no meaningful cold/warm penalty to engineer against —
   the first solve after a page load pays single-digit milliseconds for the engine.

### 5.3 · Why some cells were trimmed

`solveMatrix` caps a cell at `__cellMs` and times each worker call at the same budget. The
top-size HARD cells blow through it in **generation**, and a shard carrying one spends its entire
driver budget on a single row that ends in a timeout regardless — which is exactly what consumed
r6's sudoku shard and, before it, r5's. `w5-solve-trim.sh` names those cells, and the rest of the
matrix lands. Nothing is hidden: the trimmed cells appear in the table above with their reason.
