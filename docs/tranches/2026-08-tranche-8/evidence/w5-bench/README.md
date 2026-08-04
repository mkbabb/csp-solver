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

## 0 · The one thing that needs the owner — CONFIRMED, and the rect theory refuted

**Remote Automation is enabled**, `safaridriver -p 4285` serves sessions with no prompt. Nothing
needs a click to *run*. What still blocks the **desktop frame** family is exactly what D2 said,
and D3 spent a run trying to prove otherwise and failed:

> **Leave the automation Safari window visible on the ACTIVE Space while a frame bench runs** —
> i.e. not behind a full-screen app. It never takes focus and never accepts input; the glass pane
> sees to that. It costs a corner of desktop, not interaction.

### 0.1 · The rect theory, and why it is dead

Mid-session the window was found `visible` at `0,0 900×700` and `hidden` at the banked default
`1400,760 560×420`, and the obvious conclusion was drawn: the default rect is offscreen. The
screen is **2048×1152** logical and that rect's bottom edge is **y = 1180**, genuinely 28 px past
it, which made the story fit. **It was wrong, and the error was measuring the two rects at
different times.**

The honest instrument is an **interleaved** control — the same two rects, alternating, seconds
apart:

| rect | visible samples |
| --- | --- |
| `1400,760 560×420` | 0/3 |
| `0,0 900×700` | 0/3 |
| `1400,760 560×420` | 0/3 |
| `0,0 900×700` | 0/3 |

Identical. And a **1700×1050** window — far too large for any ordinary window to cover — held
`hidden` for **0/15 samples over 30 s**. A window that size can only be fully occluded by
something occupying the whole screen. Placement is not the variable; D2's §3 was right and its
retraction is itself retracted.

Two further controls, both negative, are worth keeping because they rule out the cheap
explanations: **quitting the Simulator** the sim lane leaves running did not restore visibility,
and **a fresh session** — a new window, which macOS opens on the active Space — did not either.

The earlier "visible" readings were real, not noise: the window genuinely painted at 12:22, 12:24
and 12:34, and `w5-safari-sudoku-solo-r13` got a **clean `idle3s` through the visible period**
(60.34 fps, long33 0) before the closing gate caught the window going dark mid-run and refused the
rest. Visibility is a property of the owner's desktop minute by minute, which is precisely why it
is an owner action and not a rig setting.

### 0.2 · What was measured anyway

Everything that does not need a visible window, which is most of the bench: the **entire solver
family** on real Safari (compute gate — a hidden window runs JS and workers at full speed), and
the **entire iOS simulator frame family**, 15/15. See §5 and §6.

**The mechanism, unchanged and load-bearing.** An occluded WebKit page has rAF **suspended
outright** — 0 callbacks in 20 s, measured — while fixed integer work runs full speed
(84/84/91 ms). That split is why frames need a visible window, why compute does not, and why an
occluded row is refused rather than cured by taking focus.

> **What this cost, recorded as a lesson.** A sequential A/B across a changing desktop produced a
> confident, wrong root cause that was one edit away from being banked as fact. The control that
> caught it — interleaving the two conditions instead of running them in sequence — costs six
> seconds. The estate's own rule applies: *the record can't verify the record*.

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

### 1.2 · Which tree these numbers are about

Every burst in both families measured one pinned snapshot — **entry `index-C9b17OTx4t72.js`,
`index.html` md5 `791e9fb14fe6ecbabed578eddee42436`, 41 files / 744.7 KB** — and `dist-identity.mjs`
re-asserted before every single run that `:4244` was serving that same tree. No row exists without
that assertion above it in the log.

The snapshot matters more than usual here. `../dist` is unowned, and sibling lanes rebuilt and
edited the source throughout: by the close of this session the working tree carried nine modified
files the snapshot does not have, including a **new `playerIdentity.ts` (134 lines)** and changes
to **`relayWire.ts`** — the durable-identity work. So:

> **The multiplayer numbers below are about the wire as it stood at the snapshot, not as it stands
> in the working tree.** They are internally consistent and comparably stamped; they are not a
> verdict on the identity work that landed after them.

### 1.3 · The engine label is not guessed from the UA

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

---

## 6 · Family 1 — boil × multiplayer

Five games × three states. **(a) solo** — nobody else at the table. **(b) present** — a peer
joined and silent. **(c) traffic** — that peer writing at 500 ms, a player who knows the puzzle.
Each cell takes two 3 s windows: `idle3s` (the boil alone, graded against the T4-P1 gate) and
`liveWindow` (the same curve with the session census and a busy-loop sentinel attached).

### 6.1 · What proves a multiplayer row is multiplayer

`players` is a census taken **inside the window**, not a claim from the runId — the summarizer
stamps any non-solo row that saw fewer than two players **MISLABELLED-SOLO** and no row in this
wave carries it. Every `present` and `traffic` row below reads `players: 2` with two distinct
animal slugs.

**One honest correction to how `ink Δ` reads.** Two traffic rows land at `inkΔ 0` (futoshiki,
kenken) and that is not a peer that failed to write — the peer logs record **17 and 18 writes**
for those exact cells. `peer.mjs` loops its plan: past the first lap it *revises* cells it has
already inked, so the inked **count** goes flat while the traffic is entirely real. On the small
boards (futoshiki 5×5, kenken 4×4) the plan is short enough that the 3 s window lands in the
revision lap almost every time. So `inkΔ` is a floor on traffic, never a measure of it; the
load-bearing proof is `players` plus the peer log's own write count, and both are banked.

### 6.2 · iOS — the simulator, 15/15

**Engine: `ios-simulator` — iPhone 16, iOS 26, real MobileSafari in the Simulator, driven
GUI-less through `simctl` with the Simulator launched `open -g` (never raised).** Ceiling
58.88 fps (`w5-sim-ceiling-r9`); the sim gate wants 59/59.76 = **98.73%** of ceiling.

| game | state | idle3s fps | %ceil | long33 | worst ms | live fps | busy % | players | ink Δ | peer writes | gate | load 1m |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| sudoku | solo | 60.55 | 102.84% | 0 | 28 | 60.53 | 76.8 | 0 | 0 | — | PASS | 7.21→10.10 **!** |
| sudoku | present | 60.09 | 102.06% | 0 | 19 | 60.51 | 76.8 | 2 | 0 | 0 | PASS | 7.80→7.79 |
| sudoku | traffic | 60.34 | 102.48% | 0 | 29 | 60.19 | 77.3 | 2 | 3 | 21 | PASS | 7.46→6.38 |
| futoshiki | solo | 59.96 | 101.83% | 0 | 22 | 60.49 | 77.1 | 0 | 0 | — | PASS | 6.38→5.48 |
| futoshiki | present | 60.31 | 102.43% | 0 | 19 | 60.49 | 77.1 | 2 | 0 | 0 | PASS | 5.48→4.79 |
| futoshiki | traffic | 59.90 | 101.73% | 0 | 32 | 60.15 | 76.7 | 2 | 0 | 17 | PASS | 5.05→5.85 |
| thermo | solo | 60.05 | 101.99% | 0 | 31 | 60.51 | 77.3 | 0 | 0 | — | PASS | 6.03→5.55 |
| thermo | present | 60.07 | 102.02% | 0 | 28 | 60.49 | 77.5 | 2 | 0 | 0 | PASS | 5.55→5.69 |
| thermo | traffic | 60.23 | 102.29% | 0 | 18 | 60.21 | 78.0 | 2 | 6 | 21 | PASS | 5.47→5.01 |
| killer | solo | 60.13 | 102.12% | 0 | 30 | 60.53 | 78.4 | 0 | 0 | — | PASS | 4.77→5.02 |
| killer | present | 60.29 | 102.39% | 0 | 27 | 60.59 | 78.3 | 2 | 0 | 0 | PASS | 5.02→5.79 |
| killer | traffic | 59.76 | 101.49% | 0 | 25 | 60.25 | 78.7 | 2 | 6 | 17 | PASS | 5.79→6.18 |
| kenken | solo | 60.19 | 102.22% | 0 | 19 | 60.53 | 78.6 | 0 | 0 | — | PASS | 6.18→5.54 |
| kenken | present | 60.07 | 102.02% | 0 | 25 | 60.53 | 78.6 | 2 | 0 | 0 | PASS | 5.54→5.60 |
| kenken | traffic | 60.25 | 102.33% | 0 | 25 | 60.51 | 78.3 | 2 | 0 | 18 | PASS | 5.31→4.74 |

**!** `sudoku solo` closed at load 10.10 against an 8.0 gate. It is **re-measured** rather than
quoted — see §6.4.

### 6.3 · What the iOS matrix says

1. **Every cell passes, and not narrowly.** 15/15 over the T4-P1 sim `idle3s` floor, the whole
   band 101.49–102.84% of ceiling. Above 100% because the ceiling run itself carried the only
   `long33` in the family — the app-free control had one dropped frame and the app had none.
2. **Multiplayer costs nothing measurable.** solo → present → traffic moves the idle curve by
   under 0.6 fps in every game, inside the run-to-run spread of the solo rows themselves. A
   second player at the table is free; a second player *writing* is free.
3. **`long33` is zero across all fifteen cells** — one dropped frame total in the family, in
   futoshiki traffic's `liveWindow`, at 35 ms. There is no jank to attribute.
4. **The relay does not show up in the frame curve.** `busy %` sits at 76.7–78.7 in every state
   including traffic, so the main thread is no busier with a peer writing into it than alone.

### 6.4 · Desktop Safari — what exists, and what the occlusion cost

Three runs of this family were attempted. **None completed**, and the reason is §0's: the
automation window was occluded for most of the session and the paint gate refused rather than
measured. What there is:

| run | driver | result |
| --- | --- | --- |
| **r1** | legacy frontmost driver (abrogated) | **13 of 15 cells**, full-size 2048×1032 viewport — §2 |
| **r3** | quiet driver | 15/15 `OCCLUDED-INVALID` |
| **r10** | quiet driver | 2/15 attempted, both `OCCLUDED-INVALID`, stopped |
| **r13** | quiet driver, 900×700 | 1 cell **partial** — a clean `idle3s`, then the window went dark |

**The one quiet-driver desktop frame reading in the wave**, and it is worth having because it is
the first real-Safari frame number this lane ever took without seizing the screen:

| run | game | state | window | fps | %ceil | long33 | worst ms | gate (idle3s) | load 1m |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `w5-safari-sudoku-solo-r13` ·PARTIAL | sudoku | solo | idle3s | **60.34** | **99.65%** | **0** | 18 | **PASS** 99.65% vs 98.58% | 6.87→8.61 **!** |

Ceiling 60.55 fps (`w5-safari-ceiling-probe`, clean; r13's own 60.38 and r10's 60.11 corroborate).
The `liveWindow` half of that cell never ran — the closing gate caught the window going dark
mid-run, which is exactly the instrument working. The row is load-suspect on top of that
(load closed at 8.61 over an 8.0 gate), so it is **one corroborating reading, not a verdict**.

**What can and cannot be said about desktop Safari from this wave:**

- The legacy r1 rows (§2) are real desktop Safari and they pass — 13 cells, 98.77–99.69% of
  ceiling, `long33` 0 in every one, `players: 2` censused on every non-solo row. They were bought
  by seizing the owner's screen and cannot be reproduced by the quiet driver.
- r1 never got `kenken traffic` (timed out, load 10.47) or `killer traffic` (the file has 2 lines
  and no scenario rows), so **two of the fifteen desktop cells have never been measured by any
  driver**.
- The one quiet-driver row agrees with the legacy rows to within 0.7% of ceiling, which is
  evidence that the abrogation cost nothing in fidelity — but it is a single cell.

**This family is the wave's open gap, and it needs the owner's desktop, not more engineering.**
`w5-bench.sh boil safari <tag>` takes all fifteen in one activation the moment the automation
window is left un-occluded.

---

## 7 · The predecessor's rows — kept, re-measured, or refused

D2 died at the session wall mid-bench. Its estate was audited row by row before anything was
re-run; the rule was **audit, never redo**.

### 7.1 · Kept whole

| what | why it stands |
| --- | --- |
| **Warm solve matrix** (r4/r6/r7) — 45 cells, 5 games × every shipped size × 3 tiers | `__reps=5` boards × 2 solves = **n=10** per cell, load 6.25–7.52 throughout, **no row load-suspect**. kenken was independently measured twice (r4 at load 7.52, r7 at 6.25) and the two passes agree cell for cell — the only free replication in the wave. |
| **Cold arm** (r8) — 37 cold inits across futoshiki/thermo/killer/kenken | Each cold cell builds its own worker, so the cell list *is* the sample count: 12/8/8/9 per game, all ≥5. Median 8 ms, range 7–14. |
| **iOS sim frame matrix** (r9) — 15/15 | Every non-solo row censused `players: 2` with two distinct slugs; peer logs corroborate 17–21 writes on every traffic cell. 14 of 15 closed under the load gate. |
| **Legacy desktop rows** (r1) — 13 cells | Real Safari, load-stamped, census-proven. Kept **labelled** as legacy-driver, never folded in silently — §2. |
| **The quarantine** — `runs/contaminated/w5-safari-solve-sudoku-r5.jsonl` | D2 caught two bench processes sharing one WebDriver session and interleaving. The tell it banked (two `env` rows in one run file) was re-checked across every run file in the estate: **no other file carries it.** |

### 7.2 · Re-measured

| row | why | outcome |
| --- | --- | --- |
| `w5-sim-sudoku-solo-r9` | Closed at load **10.10** against an 8.0 gate — the one suspect row in the sim family | re-run queued as `-r12`, **did not land** — held at the load gate behind the sibling lanes (§9). The r9 row is printed with its `!` and is not quotable; the other 14 sim cells are unaffected. |
| `w5-safari-ceiling-r10` (mine) | Closed at 8.46, load-suspect | Superseded as denominator by `ceiling-probe` (60.55, clean). `w5-summarize.mjs` now **chooses** the ceiling instead of taking whichever `readdir` yielded last — it drops load-suspect candidates when a clean one exists and takes the max of the rest, and prints its provenance. |

### 7.3 · Could not complete, and exactly why

| gap | status |
| --- | --- |
| **Desktop Safari frame family, 15 cells** | **Blocked on the owner's desktop** — the automation window was occluded for nearly the whole session (§0). Three runs attempted (r3, r10, r13); one partial cell earned. Not an engineering gap. |
| `kenken traffic` / `killer traffic` on desktop | Never measured by **any** driver — r1 timed out on one and banked an empty file for the other, r3/r10/r13 never reached them. |
| **Rect-sensitivity reading** (D2's named gap: 2048×1032 legacy vs the quiet driver's small window) | Still open. The one quiet-driver row is 900×648 and agrees within 0.7% of ceiling, which is suggestive and not a control. |
| **Batched solve timing** to beat Safari's 1 ms `performance.now()` clamp (D2's §4 cure) | Still open. It is a probe change, not a run, and it did not happen in this wave either. |

---

## 8 · Verdicts against the T4-P1 gates

The thresholds are read from
`docs/tranches/2026-07-tranche-4/patches/p1-safari-ios-performance/gates.json`, never remembered.
The desktop absolutes there are anchored to a 98.4 fps ceiling, so the portable comparison is the
**ratio** the file itself implies (`minFps / ceilingFps`) applied to the ceiling *this* session
measured; `long33` needs no transposition, because a frame over 33.4 ms is a dropped frame at any
refresh rate.

| family | gate | wanted | measured | verdict |
| --- | --- | --- | --- | --- |
| **iOS sim** | `sim.idle3s` minFps 59 / ceiling 59.76 = **98.73%** | ≥98.73% of ceiling | **101.49–102.84%**, 15/15 cells | **PASS**, whole family |
| **iOS sim** | `sim.idle3s` long33 | (no sim cap declared) | **0** in all 15 | **PASS** |
| **desktop Safari** | `desktop.idle3s` minFps 97 / ceiling 98.4 = **98.58%**, maxLong33 **0** | ≥98.58%, long33 0 | **99.65%**, long33 0 — one partial cell | **PASS**, n=1 |
| **desktop Safari** (legacy driver) | same | same | **98.77–99.69%**, long33 0, 13 cells | **PASS**, labelled legacy |

### 8.1 · Two gates that do not exist, and should be named rather than implied

- **`liveWindow` is ungraded.** It is a new scenario this wave and `gates.json` has no row for it,
  so every `liveWindow` number in this record is **reported, not adjudicated**. The idle3s column
  beside it is what carries a verdict.
- **The solver family has no gate at all.** There is no threshold anywhere in the estate for
  generate or solve latency, so §5's matrix is a baseline, not a pass/fail. The one number in it
  that looks like it wants a gate is named below.

### 8.2 · Regressions, named with numbers

**No gate regressed.** Every graded cell passes, and nothing in this wave reads worse than the
T4-P1 basis. What the bench found instead are two *unpriced* costs and two blind spots:

1. **sudoku 16×16 MEDIUM generation — 684 ms median, spread 198–1748 ms.** Solving the same cell
   costs 55 ms. A player who picks the largest sudoku at medium waits on `generate_by_digging`,
   and waits an amount that swings **9× board to board** — the documented trajectory-dependence of
   `max_solutions=1` under Ac3, surfacing as a user-visible wait that is sometimes instant and
   sometimes nearly two seconds. Nothing gates this.
2. **sudoku 16×16 HARD does not generate inside 25 s** — recorded as a measured timeout, not
   omitted. thermo's and killer's equivalents were still untested when this record was written.
3. **Two desktop cells have never been measured by any driver** (`kenken traffic`,
   `killer traffic`) — §6.4.
4. **The whole small-board half of the solve matrix sits under Safari's 1 ms `performance.now()`
   clamp.** Every latency there reads 0 or 1 and the resolution-free `nodes` column is what
   carries signal — §4.

### 8.3 · The two findings that would survive deletion of everything else

- **Multiplayer is free.** solo → peer-present → peer-writing moves the idle frame curve by under
  0.6 fps in every game on iOS, inside the run-to-run spread of the solo rows themselves, with
  `busy %` flat at 76.7–78.7 across all three states. A second player at the table costs nothing
  the frame curve can see, and neither does that player writing.
- **Solving is not the cost; generation is.** In every cell where both are measurable the dig
  dominates the search by an order of magnitude or more, and at every size a player actually meets
  (sudoku 9×9, futoshiki 5×5, thermo 9×9, killer 9×9, kenken 4×4) generation is 0–6 ms and solving
  is under the clock. Cold start adds a median 8 ms, once.

---

## 9 · Residue

**M19 compliance, re-audited at the close.** Every rig script was grepped for
`osascript|activate|open -a|frontmost|PREV_APP|REASSERT|KEEP_*_FRONT` with comments stripped.
Two matches survive and neither is machinery: a log string in `safari-wd.mjs` that says the window
is *NOT* frontmost, and the engine label `"safari-desktop (legacy frontmost driver)"` in
`w5-summarize.mjs`. `run-sim.sh`'s `open -g -a Simulator` is the backgrounded launch the order
allows. **No executable path in the rig reaches for the front.**

One disclosure: the Simulator was quit once from the shell — as a *control* for the occlusion
theory, testing whether its window was the occluder (it was not). That was a teardown of an app
the rig itself launches, not a desktop seizure, and it is not in any script.

**Changes to the instrument, all of them stated where they bite:**

| file | change | why |
| --- | --- | --- |
| `w5-summarize.mjs` | the ceiling is now **chosen**, not stumbled into — load-suspect candidates dropped when a clean one exists, max of the survivors, provenance printed as an HTML comment | `readdir` order was silently deciding the denominator for every `%ceil` in the table, and one candidate was load-suspect |
| `w5-summarize.mjs` | `·PARTIAL` marker on runs that timed out with some scenarios banked | a row showing one window where its neighbours show two owes the reader that word |
| `run-safari.sh` | default `WD_RECT` `1400,760,560,420` → `0,0,900,700` | the old default hung 28 px off a 2048×1152 screen. **Hygiene, not a cure** — the comment says so, because it is not why frame rows get refused |

**The eslint nit named in the brief (`w5-summarize.mjs`, unused `id`) was already fixed by D2** —
the file lints clean, and a deliberate-unused-variable probe confirms eslint really does cover
`perf-rig/*.mjs` rather than silently ignoring it. Both summarizer edits above lint clean too.

**Still open, in the order they are worth closing:**

1. **The desktop frame family** — 15 cells, needs the automation window un-occluded for one run.
   No engineering left; see §0.
2. **`kenken traffic` / `killer traffic` on desktop** — never measured by any driver.
3. **thermo/killer 16×16 HARD generation** — sudoku's timeout is measured, these two are assumed.
4. **sudoku's cold arm** — 4 of 5 games have cold inits; sudoku has none.
5. **The chromium footnote lane** — `pw-driver.sh` is built and wired into `w5-bench.sh`; no
   footnote row has been taken.
6. **`w5-sim-sudoku-solo` re-measure** — the r9 row closed load-suspect and its replacement never
   got a gap. One cell of fifteen; the other fourteen are clean.
7. **A rect-sensitivity control** — 2048×1032 legacy vs the quiet driver's small window.
8. **Batched solve timing** to amortise Safari's 1 ms clock clamp — a probe change, still unwritten.

**Items 3, 4, 5 and 6 were scripted, launched, and never measured.** The lane sat at the load gate
from 12:41 while the 1-minute average climbed **14 → 45** and never came back under 8.0. It was
then stopped rather than left running, so that `runs/` and this record agree: **no `-r11` or
`-r12` file exists.** Nothing was measured through the peak to make a table look finished.

### 9.1 · Closing the residue — the exact bursts

On a quiet box, from `web/frontend/perf-rig/`, with the probe server up on `:4244` serving the
pinned snapshot:

```sh
export DIST=<the pinned dist-w5 snapshot>   # entry index-C9b17OTx4t72.js
export PORT=4244 MAX_LOAD=8.0 WAIT_TRIES=240
W=assets/solver.worker-eJy8PYEB.js          # or: ls $DIST/assets/solver.worker-*.js

# item 4 — sudoku's cold arm. w5-solve-trim.sh has no sudoku shard, which is the whole reason
# this gap exists. A cold cell = one fresh worker = one initMs, so 7 cells is n=7.
EXTRA="__cells=sudoku:2:0,sudoku:2:1,sudoku:2:2,sudoku:3:0,sudoku:3:1,sudoku:3:2,sudoku:4:0&__reps=1&__solves=2&__worker=/$W&__cold=1&__cellMs=25000" \
  TIMEOUT=240 ./run-safari.sh w5-safari-solvecold-sudoku-rN solveMatrix

# item 3 — the two untested top-size HARD cells, on sudoku's own 25 s leash so the three compare
EXTRA="__cells=thermo:4:2,killer:4:2&__reps=1&__solves=2&__worker=/$W&__cellMs=25000" \
  TIMEOUT=200 ./run-safari.sh w5-safari-solve-tophard-rN solveMatrix

# item 6 — the one suspect sim cell
EXTRA="game=sudoku&size=3&difficulty=EASY" TIMEOUT=110 ./run-sim.sh w5-sim-sudoku-solo-rN idle3s,liveWindow

# item 5 — the chromium footnote (headless; RELATIVE shape only, never a Safari or iOS fact)
./w5-bench.sh ceiling chromium rN && ./w5-bench.sh boil chromium rN

# item 1 — the desktop frame family, the moment the automation window is un-occluded
./w5-bench.sh ceiling safari rN && ./w5-bench.sh boil safari rN
```

Both solve bursts run under the **compute gate** — they need no visible window. Only the last one
does. Each burst must be wrapped in the load gate and stamped; `w5-bench.sh`'s `burst()` is the
reference for that, and `node w5-summarize.mjs --family boil|solve` folds whatever lands.

**The box, for the record.** This wave shared the machine with four sibling lanes running
Playwright suites. The 1-minute load average ran **6.9 → 32.9** across the session against an 8.0
gate, and a large share of the wall-clock was spent waiting for gaps rather than measuring. Every
row banked here closed under the gate or carries a `!`; nothing was measured through the peak.

### 9.2 · The r13 generation — the residue closed (2026-08-04, T8 WGATE)

Measured against the **T8 deploy candidate** (`index-jt51RN8od5PV.js`), not the r-series
snapshot — the solve instrument is byte-identical and the candidate is what ships, so the
candidate is the honest referent for the close. Runs `*-r13`, `*-r13b/c`, `*-r13w` in
`perf-rig/runs/`, folded by `w5-summarize.mjs` (`r13-solve-summary.txt`,
`r13-boil-summary.txt`).

- **Item 6 — the suspect sim cell** (`w5-sim-sudoku-solo-r13`): re-measured **102.33% of
  ceiling, long33 0** — the r9 reading stands; the suspicion was the box, not the cell.
- **Item 5 — the chromium footnote**: ceiling + full boil family ran headless; relative
  shape agrees with the sim family (no cell under its ceiling share). Footnote only, as
  chartered — never a Safari or iOS fact.
- **Item 4 — sudoku's cold arm** (`solvecold-sudoku-r13c`, 7 cells, fresh worker per
  cell): **initMs 12–21ms** at 4×4/9×9, 135ms at 16×16-EASY; a cold 16×16 cell lands
  whole in **281ms wall**. The cold arm is a non-event at player scale.
- **Item 3 — the top-size HARD cells** (`solve-tophard-r13c`): **thermo 16×16 HARD and
  killer 16×16 HARD both TIMED OUT generating at the 25,000ms leash** on real desktop
  Safari (initMs 13, then nothing). With the r-series' sudoku 16×16 HARD timeout and its
  MEDIUM at 684ms, the class is now three games wide: **16×16 HARD generation exceeds any
  tolerable deal wait**. The leash is the probe's, not the product's — the product would
  keep grinding. Booked as the widened T8-R05 (`DISPOSITIONS.md`); the obvious levers are
  pre-generation or capping the offered tier.
- **The wire re-run** (`*-r13w`: sudoku 9×9 + kenken 4×4 × solo/present/traffic, live
  relay peers): **101.46–102.77% of ceiling, long33 0 in all twelve cells** — Lane A's
  rewritten `relayWire`/`playerIdentity` (durable identity, `cur` cursor verb, live-claim
  guard) prices the same as the snapshot wire. **Multiplayer is still free.** The §1.2
  drift note is discharged.

Instrument fixes riding this generation: `run-safari.sh` empty-`SESS_ARG` expansion under
macOS bash 3.2 `set -u` (the `${arr[@]+…}` form), and two traps for the record: a stale
probe server injects a stale `probe.js` (the r13b runs died silently on a :4894 leftover —
kill old servers before a generation), and a battery script's cleanup `pkill safaridriver`
kills the DRIVER a sibling burst is about to need.
