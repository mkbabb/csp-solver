# perf-rig — the frame-timing instrument

The rig that measured the P1 Safari/iOS patch, landed in-tree so `gates.json` has an executor.

It samples `requestAnimationFrame` deltas **in the page**, against the **built dist**, and
reports frame curves back over HTTP. Two lanes come out of it:

| lane | what runs it | what it can say |
| --- | --- | --- |
| **CI subset** | `ci-subset.mjs`, headless chromium + webkit | idle fps + long-frame census, as a regression tripwire |
| **manual matrix** | `run-safari.sh` / `run-sim.sh` / `cpu-attrib.sh`, real Safari + the iOS simulator | every row in `gates.json`, including the fps numbers the patch sealed on |

The thresholds both lanes read live in
`docs/tranches/2026-07-tranche-4/patches/p1-safari-ios-performance/gates.json`. Neither lane
carries a threshold of its own; a missing or malformed gates.json is a setup error, never a
default.

---

## The CI subset

```bash
node perf-rig/ci-subset.mjs                       # both engines, 3 windows each
node perf-rig/ci-subset.mjs --engines webkit      # one engine
node perf-rig/ci-subset.mjs --build --out run.txt # force a rebuild, tee the report
```

It builds-or-reuses `dist/`, serves it on **:4390** (its own port — never 3000, 3001, 4188 or
4288, which it refuses outright), drives the engines, and kills its server on the way out.
Exit `0` pass · `1` threshold breach · `2` setup error · `3` instrument failure.

**Two assertions, both derived from gates.json at run time.**

- **GATE A** — `median(long33) <= desktop.idle3s.maxLong33`. Unit-free and engine-portable: a
  frame over 33.4 ms is a dropped frame at any refresh rate. This is the P1 defect's own
  signature — 23 long frames per 3 s idle window at base, 0 after the cure.
- **GATE B** — `median(idleFps) >= (minFps / ceilingFps) * measuredCeilingFps`. The absolute
  97 fps in gates.json is anchored to real Safari on a 98.4 fps panel; a headless runner's
  ceiling is its own number. The threshold is transposed into the unit the rig itself calls
  portable (r1-rig-baseline.md §8, "the %-of-ceiling column is the portable one"), and the
  ceiling is re-measured every run by the app-free `/__ceiling` page. The absolute comparison
  is printed **advisory** and does not gate.

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

Scenarios, in the order they are state-safe (this is the default set):
`idle3s,deal,undoBurst,solveCelebration,galleryGlide,themeToggle`, plus `domDump` /
`styleDump` (diagnostic) and `rafCeiling` (the app-free control page).

Query knobs: `__attempts` (default 3), `__settle` (default 1200 ms), `__theme=light|dark|auto`,
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
