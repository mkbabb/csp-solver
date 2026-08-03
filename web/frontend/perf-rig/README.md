# perf-rig — the frame-timing instrument

The rig that measured the P1 Safari/iOS patch, landed in-tree so `gates.json` has an executor.

It samples `requestAnimationFrame` deltas **in the page**, against the **built dist**, and
reports frame curves back over HTTP. Two lanes come out of it:

| lane | what runs it | what it can say |
| --- | --- | --- |
| **CI subset** | `ci-subset.mjs`, headless chromium + webkit | idle fps, long-frame census, `undoBurst`, boot TBT — four gates, as a regression tripwire |
| **manual matrix** | `run-safari.sh` / `run-sim.sh` / `cpu-attrib.sh`, real Safari + the iOS simulator | every row in `gates.json`, including the fps numbers the patch sealed on |

The thresholds both lanes read live in
`docs/tranches/2026-07-tranche-4/patches/p1-safari-ios-performance/gates.json`. Neither lane
carries a threshold of its own; a missing or malformed gates.json is a setup error, never a
default.

---

## The CI subset

```bash
node perf-rig/ci-subset.mjs                       # both engines, 3 windows each
node perf-rig/ci-subset.mjs --engines chromium    # one engine (webkit alone exits 2 — GATE D)
node perf-rig/ci-subset.mjs --build --out run.txt # force a rebuild, tee the report
```

It builds-or-reuses `dist/`, serves it on **:4390** (its own port — never 3000, 3001, 4188 or
4288, which it refuses outright), drives the engines, and kills its server on the way out.
Exit `0` pass · `1` threshold breach · `2` setup error · `3` instrument failure.

**Boot blocking is priced, not declared** (T7-W6). The wave offered two arms — add a boot-window
TBT scenario with a floor, or record that boot blocking goes unpriced. This rig took the floor:
`bootTbt` runs in its own throttled page load, so it measures a boot rather than the tail of a
steady-state window, and GATE D grades it. What stays declared is narrower and named above —
the **webkit** boot window, which no `longtask`-less engine can measure, and which the report
prints `NOT MEASURED` rather than passing.

**Four assertions, every one read out of gates.json at run time.**

- **GATE A** — `median(long33) <= desktop.idle3s.maxLong33`. Unit-free and engine-portable: a
  frame over 33.4 ms is a dropped frame at any refresh rate. This is the P1 defect's own
  signature — 23 long frames per 3 s idle window at base, 0 after the cure.
- **GATE B** — `median(idleFps) >= (minFps / ceilingFps) * measuredCeilingFps`. The absolute
  97 fps in gates.json is anchored to real Safari on a 98.4 fps panel; a headless runner's
  ceiling is its own number. The threshold is transposed into the unit the rig itself calls
  portable (r1-rig-baseline.md §8, "the %-of-ceiling column is the portable one"), and the
  ceiling is re-measured every run by the app-free `/__ceiling` page. The absolute comparison
  is printed **advisory** and does not gate.
- **GATE C** — `median(undoBurstFps) >= desktop.undoBurst.ciMinPctOfCeiling * measuredCeilingFps`
  (T7-W6, CH-53). `undoBurst` has been measured every manual run since P1 and priced nowhere;
  a committed instrument with no threshold is the same defect as a committed threshold with no
  executor. It carries **two** numbers because it has two surfaces. `minFps` (52) is the
  real-Safari floor the manual matrix enforces — real Safari reads ~55 fps with ~15 long frames
  on this window. Headless WebKit reads its *ceiling* on the same window, so transposing
  52/98.4 the way GATE B does would hand CI a floor ~47 % under live, which is the slack this
  gate exists to remove. The CI arm therefore declares its fraction outright. Same shape as
  GATE B, one derived from an anchored pair and one measured here.
- **GATE D** — `median(bootTbtMs) <= boot.tbt.maxTbtMs`, taken over the first
  `boot.tbt.windowMs` of a page load under `boot.tbt.cpuThrottleRate`× CPU throttling (CDP,
  applied before the navigation). Every other row watches steady state; the boot burst happens
  once, before the first idle window opens, and had nothing to trip. **Graded only where
  `longtask` exists.** `PerformanceObserver.supportedEntryTypes` is checked in the page and the
  bit travels with the reading: WebKit ships no `longtask` entry type, so its row prints
  `NOT MEASURED`, never `PASS` — an empty task list from an engine that cannot see tasks is not
  a clean boot. A run in which *no* engine could measure it exits `2`, and throttling that is
  requested and cannot be applied exits `2` as well: an unthrottled number read against a
  throttled floor is a different measurement, not a lenient one.

**Grading order.** Every measured result is graded before any exit is taken, and the exit code
is the worst fact in the run: `1` (a breach, anywhere) > `2` (setup) > `3` (instrument) > `0`. A
breach outranks an instrument failure because a breach is a fact about the *bundle* and an
instrument failure is a fact about the *host* — a bad host cannot un-measure a bad bundle. The
lane used to grade after the engine loop, so a later engine's early return discarded a chromium
breach that had already been measured; with `ci.yml` mapping exit 3 to `CODE=0`, that shipped
green. Ablation-proven both ways at
`docs/tranches/2026-08-tranche-7/evidence/w6/ci-subset-ablation.txt`; `--canary-fail <engine>`
is the reproduction hook.

**Control validity.** `/__ceiling` is an empty page with one rAF counter. If *that* drops a
long frame, the host is not measuring the surface, and the run exits `3` — no verdict, green
or red. Control and window are **interleaved** (control-1, window-1, control-2, window-2, …)
per P-W4's instrument law: a block design maps host drift onto the windows alone and reads it
as a regression.

**The control's blind spot, stated.** An empty page coasts through contention that starves a
real compositing workload, so a clean control proves the host's rAF *cadence* is intact — not
that it has CPU to spare. A webkit RED from this gate on a loaded machine is therefore **not**
a fact about the surface until it reproduces on a quiescent host. The banked case:
`evidence/w1/perf-subset-contended-host-RED.txt` (RED at load 13.83, clean control throughout)
beside `evidence/w1/perf-subset-at-HEAD.txt` (GREEN at load 2.99, same dist). Every run prints
the host's load average at start and finish for exactly this reason.

**What a green here does not mean.** Playwright WebKit is not Safari — no Core Animation
compositing path, different raster and tiling. This harness read 80–98 fps on the very surface
the owner called a rendered mess, which is why the manual lane exists. Green is a regression
tripwire on the cured mechanism. It is not a Safari number and it is not an iOS claim.

---

## The manual matrix

Real Safari and the real iOS simulator, driven by AppleScript and `simctl`. macOS only, and it
takes the machine over while it runs — the driver keeps the browser frontmost because an
occluded WebKit page has rAF and timers **suspended outright**.

Start the server once, then drive it:

```bash
node perf-rig/probe-server.mjs                     # :4894, serves ../dist, health /__ping
```

```bash
cd web/frontend/perf-rig

# desktop Safari — all six scenarios, or a subset, or with an ablation
KEEP_SAFARI_FRONT=1 TIMEOUT=240 ./run-safari.sh <runId>
KEEP_SAFARI_FRONT=1 ./run-safari.sh <runId> themeToggle,galleryGlide
KEEP_SAFARI_FRONT=1 ./run-safari.sh <runId> idle3s ablations/a1-divider-pin.css

# the display ceiling — the denominator every app number is read against
./run-safari.sh <runId> rafCeiling

# the iOS 26 simulator (DEVICE=<udid|name>, default perf-rig-iphone16)
KEEP_SIM_FRONT=1 TIMEOUT=240 ./run-sim.sh <runId>

# process-CPU attribution across a ~20s idle window (WebKit.GPU vs WebKit.WebContent)
TAG=<tag> ./cpu-attrib.sh base
TAG=<tag> ./cpu-attrib.sh a10-glyph-grain-none

# the ablation matrix, cell order shuffled per round
./matrix.sh <round>            # desktop · CELLS=… SC=… to override
./rounds.sh 1 2 3              # several rounds, the full cell list
./sim-matrix.sh 1 2            # the top ablations, in the simulator

# fold runs into the tables
node summarize.mjs <runId> [<runId>…]
```

### The scenario roster

Every key in `probe.js`'s `SCENARIOS`, in its partition. The drivers' default set — the order
they are state-safe in — is `idle3s,deal,undoBurst,solveCelebration,galleryGlide,themeToggle`;
everything else runs only when passed by name.

| scenario | partition | what prices it |
| --- | --- | --- |
| `idle3s` | default · **CI subset** | GATE A + GATE B, gates.json `desktop.idle3s` |
| `undoBurst` | default · **CI subset** | GATE C, gates.json `desktop.undoBurst` (T7-W6) |
| `bootTbt` | **CI subset** only | GATE D, gates.json `boot.tbt` (T7-W6); own page load, throttled |
| `deal` | default | `desktop.deal.minFps`, manual matrix |
| `solveCelebration` | default | `desktop.solveCelebration`, manual matrix |
| `galleryGlide` | default | `desktop.galleryGlide.minFps`, manual matrix |
| `themeToggle` | default | `desktop.themeToggle.minFps`, manual matrix |
| `hoverSweep` | by name · **unpriced** | nothing — diagnostic, see below |
| `solveWindow` | by name · **unpriced** | nothing — diagnostic, see below |
| `galleryDrag` | by name · **unpriced** | nothing — diagnostic, see below (T7-W6) |
| `drawerToggle` | by name · **unpriced** | nothing — diagnostic, see below (T7-W6) |
| `domDump` | by name | diagnostic only — a DOM census, no frames, no fps |
| `styleDump` | by name | diagnostic only — a computed-style census, no frames, no fps |

`rafCeiling` is not in the table because it is not an app scenario: it is the app-free
`/__ceiling` control page, the denominator every number above is read against.

### The unpriced rows, and why they say so

Four scenarios are **measured, ungated**. Naming them here is the price of keeping them: a
measured number with no floor is a reading, and a reading that no one has declared unpriced
reads like a gate to the next person.

- **`hoverSweep`** — replays the app's own `*:hover` declarations across the control row.
  Diagnostic because it measures a *replay*, not a pointer: no floor can be honest about a
  gesture the page cannot actually perform. Pinned to 9×9/Easy (a 16×16 board turns the window
  from 68.9 fps into 19.5 — the pin is in the scenario, not in the reader's memory).
- **`solveWindow`** — arms the 16×16 loader and reads its filter execution rate. Diagnostic
  because its number (`filterExecPerSec`) is a mechanism census, not a frame budget; the census
  it feeds is `filterBudget`'s, which has its own lane.
- **`galleryDrag`** (T7-W6) — the mouse drag the owner's T6 mark created: a `scrollLeft` write
  per pointer move, snap suspended, one `glideTo` settle on release. Distinct from
  `galleryGlide`, which steps the same deck with the arrow keys. **No floor yet** — the surface
  has two takes, both on one machine in W6, and a floor derived off two takes on one machine is
  the 43–400 %-slack mechanism this tranche is removing. It carries its own proof of work
  (`dragMoved`, `scrollLeftFrom/Peak/To`) so a gesture the app ignored cannot pass for a fast one.
- **`drawerToggle`** (T7-W6) — the under-board glass drawer, two full 520 ms sweeps per window,
  ending in the state it started. Desk regime only (`.drawer-tab` is `display:none` under
  1024), which the lookup reports rather than silently measuring nothing. **No floor yet**, same
  reason; `expandedTrail`/`drawerMoved` are its proof of work.

W6's readings for both new rows, both engines, at
`docs/tranches/2026-08-tranche-7/evidence/w6/perf-floor-derivation.md`. Both surfaces drop
frames (worst 74–131 ms), which is the argument for pricing them once there is a train worth
pricing against — the WGATE restamp is where that decision belongs.

Query knobs: `__attempts` (default 3), `__settle` (default 1200 ms), `__bootMs` (default
3000 ms — the boot window `bootTbt` sums over), `__theme=light|dark|auto`,
`__ablate` (URI-encoded CSS, injected before the app boots — pass a **file** to the drivers,
which encode it). `EXTRA='game=sudoku&size=3&difficulty=EASY'` pins board state on the URL,
which any base-vs-cured pair **must** do: the app's state is localStorage-persisted per origin,
so two ports serving two dists do not share a board, and `deal`/`galleryGlide` scale with cell
count.

Runs land as JSON lines in `perf-rig/runs/<runId>.jsonl`, which is gitignored — the rig is the
instrument, the runs are readings, and readings are banked deliberately under
`docs/tranches/**/evidence/`, never carried in the working tree.

### Reading a result

Per scenario: `fps` (frames ÷ wall), `frames`, `wallMs`, `p50`, `p95`, `worstMs`, `long33`,
`long50`, `jankMs` (summed time in frames >50 ms), `worst3` and `long33At`. **The spacing of
`long33At` is the diagnosis**: a fixed period means a cadence artifact, a scatter means load.
`fps` is `null` when a window collected under 5 frames or ran under 200 ms — an aborted window,
where an fps would be arithmetic rather than measurement.

### Traps, all of them earned

- **Occlusion suspends rAF.** The tell is a lone 1000–1300 ms delta at a window edge. The driver
  re-asserts the front and counts it; the probe watches `blur`/`focus`/`visibilitychange` and
  re-takes any tainted window up to `__attempts`. A run reporting re-asserts > 0 should be
  re-taken; a window reported `tainted: true` should not be quoted.
- **The simulator is not a device.** MobileSafari on the sim runs against the host's CPU and
  GPU. It exercises the real mobile code path — coarse pointer, drawer regime, 393×699 at
  dpr 3 — at Mac-class throughput. Read it for *does the mobile path jank, and where*, never
  for *the iPhone does N fps*. E8 device smoke is still the only thing that closes an iOS claim.
- **Instrument drift is real.** An identical bundle slid galleryGlide 85.16 → 81.33 and
  themeToggle 88.88 → 82.60 over 23 minutes, monotone, while idle held. Those cells adjudicate
  **interleaved or quiesced only** — never as a block, never against a number taken 20 minutes
  earlier.
- **`solveCelebration` carries board-difficulty variance** (±8 fps, fresh deal per attempt).
  Read its `long33` count, not its fps.
- **Board-ready means a *painted* cell.** `.board-group` is `v-show`n, so a presence-only check
  will happily sample an invisible board. Both control-panel twins are always mounted; every
  lookup filters on visibility.

### Banked-run-id discipline

A manual run is evidence only if it can be found again. Every run that backs a claim records:

1. **the run id** — the `<runId>` argument, which names `runs/<runId>.jsonl`;
2. **the build identity** — `../dist`'s entry chunk, its `index.html` digest, and the assertion
   that the server was serving that same tree. `run-safari.sh` and `run-sim.sh` now print it
   themselves before anything else and **exit 4** if they cannot derive it, so this row is no
   longer a thing you remember to write down;
3. **the host** — machine, panel and refresh rate, and whether other lanes were running;
4. **the ceiling run** taken in the same session, since no app number means anything without
   its denominator;
5. **≥3 clean windows**, median reported, tainted windows named and excluded.

Base reds bank before cured greens, and one fresh base run goes in the same session as the
cured run — an old base against a new cured is drift, not a result.

**Why row 2 is an instrument and not a habit (T5-W4 pass-7, D6-G3).** `../dist` is
`.gitignore`d. It has no owner and carries no commit: it holds whatever tree the last
`npm run build` on this checkout produced, by whichever lane ran it. Pass 5 banked the
consequence — `dist/` was holding an ABLATE build and every lane that measured
`npm run preview` without rebuilding measured an ablation without knowing. The class then
reproduced itself *while the row closing it was being written*: this rig's dist changed
identity between two readings five minutes apart, rebuilt by a concurrent lane
(`…/design-loop/pass7/D/logs/g3-caught-live.log`). "The commit the dist was built at" was
never derivable from the dist — the entry chunk's content hash is, and that is what the
line prints:

```
node scripts/dist-identity.mjs --dist <dist> --served <baseURL>
AUDIT: build-identity — dist entry index-Cr-QIa0O4Gc3.js · index.html md5 82d4bd20… · 39 files / 722.4 KB · newest mtime …
```

The `--served` arm is the other half, and it is the cure for the `assert-the-SPA is tree-blind`
trap (PRECEPTS §3): a lane port already holding **another** lane's dist passes the SPA gate
happily, so the rig fetches the page and asserts the entry it references is the one on disk.
Any AUDIT prepend anywhere in the estate can carry the same line by calling the same script.

**The first manual run-id under this tranche banks at W-GATE.** Until it does, `gates.json`'s
sim rows, GPU-attribution row (`maxGpuProcessCpuSecondsPer30sIdle` 4.5) and interaction rows
have the CI subset's coverage only for `idle3s`, and none at all for the rest.

---

## Files

| file | what it is |
| --- | --- |
| `ci-subset.mjs` | the CI lane — the only file here that is not a straight landing of the P1 rig |
| `probe-server.mjs` | zero-dep static host for `../dist`; injects the probe at serve time, never touches the dist on disk; collects `/__metrics` into `runs/` |
| `probe.js` | the in-page scenario engine — vanilla classic script, no build step |
| `run-safari.sh` | drives real desktop Safari via AppleScript; opens with the build-identity line (exit 4 if it won't derive) |
| `run-sim.sh` | drives real MobileSafari on the iOS simulator via `simctl`; same build-identity open |
| `../scripts/dist-identity.mjs` | the build-identity line itself — entry-chunk hash, `index.html` digest, extent, and an optional served-vs-disk assertion. `--self-test` 6/6. Lives in `scripts/` so any rig or AUDIT prepend can call it |
| `cpu-attrib.sh` | per-process CPU attribution over an idle window (`WebKit.GPU` vs `WebKit.WebContent`) |
| `matrix.sh` · `rounds.sh` · `sim-matrix.sh` | the ablation matrix, cell order shuffled per round |
| `summarize.mjs` | folds run JSONL into markdown tables |
| `validate-headless.mjs` | a driver-only smoke of `probe.js`'s selectors — **never** a source of numbers |
| `ablations/*.css` | the ablation cells, injected before the app boots |
