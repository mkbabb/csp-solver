# R1 — the real-Safari probe rig, and the baseline it reads

Lane L1. The rig runs the app's **built dist** in **real Safari** (and in real MobileSafari on
the iOS 26 simulator), drives six scenarios in-page, and reports frame curves back over HTTP.
It exists because Playwright WebKit read 80–98 fps on a surface the owner calls a rendered mess:
that harness has no Core Animation compositing path, rasters and tiles differently, and idle-only
sampling never touches the interactions where the mess lives.

Everything below is measured on `web/frontend/dist` as built at `981353c0`—12-char hashed
names, `index-BsqxBJD-QIpf.js`, so the divider freeze (`fb15253d`) **is** in the bundle. The
dist is served from disk and never modified; the probe tag is injected at serve time.

---

## 1. The headline

**Desktop Safari drops a frame on every boil beat, at idle, forever.** An idle-only run holds 23
long frames in 3s at offsets 131, 262, 385, 509, 632, 763, 888, 1007, 1131, 1262, 1387, 1509,
1631, 1761, 1889, 2007, 2130, 2261, 2388, 2509, 2632, 2763, 2887—gaps of 118–131ms, each frame
34–38ms. That period is `MOTION.beatMs = 125`. Eight hitches a second, three or four missed
frames apiece, which is the whole of the 81 vs 98 fps idle deficit. A second run reproduces it
(median gap 126ms, with occasional 2× and 3× multiples where a beat lands free).

The interactions are worse, and they rank cleanly:

| rank | scenario | desktop fps (mean of 3) | % of ceiling | jank ms per window |
| --- | --- | --- | --- | --- |
| 1 | themeToggle | 46.2 | 47% | 1030–1230 of 2500 |
| 2 | undoBurst | 55.3 | 56% | 0 (sustained 35ms p95, no spikes) |
| 3 | galleryGlide | 70.7 | 72% | 432–629 of 2500 |
| 4 | deal | 74.5 | 76% | 0 |
| 5 | solveCelebration | 75.4 | 77% | 63–157 of 4000 |
| — | idle3s | 80.0 | 81% | 0 (the beat train is sub-50ms) |

The theme toggle spends **~45% of its window** in frames over 50ms. Two ~200ms frames land
every run: one at the click (offset 219–259ms), one at the toggle-back (924–1162ms). The gallery
fold pays a 187–197ms frame at ~900ms, every run.

`undoBurst` is a different shape and worth separating: **no** frame over 50ms in any run, yet
54–57 fps with p95 at 35–37ms. That is not a spike, it is a floor—~15 of 140 frames land over
33ms while digits are entered. Nothing to blame on a single re-raster.

---

## 2. Engine identity

**Desktop**—real Safari, external 4K panel, the window Safari opened at:

```
Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko)
  Version/26.4 Safari/605.1.15
vendor  Apple Computer, Inc.      platform  MacIntel
dpr 2   viewport 1920x960   screen 1920x1080 (3840x2160 device px)
hardwareConcurrency 8   maxTouchPoints 0   pointer fine   prefers-dark true   PRM false
host  Apple M5 Max, 18 cores, 128 GB
```

**iOS 26 simulator**—real MobileSafari, `perf-rig-iphone16` (`1B3EB33C-9F51-4D70-B994-E35877EB65E8`):

```
Mozilla/5.0 (iPhone; CPU iPhone OS 19_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko)
  Version/19.0 Mobile/15E148 Safari/604.1
dpr 3   viewport 393x699   screen 393x852
hardwareConcurrency 8   maxTouchPoints 5   pointer coarse   prefers-dark false   PRM false
```

### The ceilings

`GET /__ceiling` is an app-free page running the same sampler—the denominator every app
number is read against.

| surface | ceiling fps | p50 | p95 | worst | frames >33ms |
| --- | --- | --- | --- | --- | --- |
| desktop Safari 26.4 | **98.4** | 10ms | 11ms | 16ms | 0 |
| iOS 26 sim | **59.76** | 17ms | 17ms | 22ms | 0 |

Both hold their ceiling with zero long frames, so every deficit below belongs to the app.

---

## 3. Desktop baseline — 3 runs

`safari-C1`, `safari-C2`, `safari-C3`. All six scenarios, all windows untainted, no errors.
Ceiling 98.4 fps.

| scenario | fps C1/C2/C3 | mean | %ceil | >33ms | >50ms | worst ms | jank ms | p95 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| idle3s | 83.5 / 75.0 / 81.6 | 80.0 | 81% | 4 / 24 / 16 | 0 / 0 / 0 | 34 / 49 / 44 | 0 | 31 / 42 / 36 |
| deal | 77.7 / 73.2 / 72.6 | 74.5 | 76% | 2 / 3 / 2 | 0 / 0 / 0 | 35 / 47 / 38 | 0 | 23 / 24 / 21 |
| undoBurst | 56.6 / 54.4 / 54.8 | 55.3 | 56% | 14 / 15 / 15 | 0 / 0 / 0 | 36 / 42 / 45 | 0 | 35 / 37 / 36 |
| solveCelebration | 65.4 / 79.9 / 81.1 | 75.4 | 77% | 32 / 28 / 25 | 1 / 2 / 1 | 63 / 100 / 110 | 63 / 157 / 110 | 44 / 38 / 35 |
| galleryGlide | 71.6 / 68.7 / 71.8 | 70.7 | 72% | 8 / 9 / 7 | 4 / 7 / 4 | 187 / 194 / 197 | 432 / 629 / 440 | 30 / 35 / 31 |
| themeToggle | 43.0 / 49.0 / 46.6 | 46.2 | 47% | 21 / 21 / 21 | 12 / 10 / 10 | 210 / 194 / 266 | 1230 / 1030 / 1135 | 97 / 84 / 92 |

Repeatability is tight everywhere except `solveCelebration` (65.4 then 79.9, 81.1)—that one
takes a fresh deal per attempt, so board difficulty rides on the number. Treat its fps as
±8 and read its `long33` count (25–32) instead.

Where the worst frames land, run over run:

```
                    C1        C2        C3
galleryGlide      187@902   194@909   197@912   · the fold, ~910ms in, to the millisecond
themeToggle       210@1032  194@219   266@295   · the click and the toggle-back, both ~200ms+
solveCelebration   63@76    100@110   110@121   · the crest onset
undoBurst          36@167    42@1979   45@2105  · no spike; the window sits at ~35ms p95 throughout
```

The gallery fold's worst frame lands at 902, 909, 912ms across three runs—a fixed cost at a
fixed point, not jitter.

## 4. iOS simulator baseline — 2 runs

`sim-D1`, `sim-D2`. Ceiling 59.76 fps. **These numbers are not iPhone numbers**—see §7.

| scenario | fps D1/D2 | mean | %ceil | >33ms | >50ms | worst ms | jank ms | p95 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| idle3s | 54.4 / 54.0 | 54.2 | 91% | 9 / 16 | 1 / 0 | 131 / 44 | 131 / 0 | 34 / 38 |
| deal | 59.6 / 58.2 | 58.9 | 99% | 0 / 0 | 0 / 0 | 33 / 33 | 0 | 22 / 23 |
| undoBurst | 49.9 / 55.8 | 52.9 | 88% | 7 / 7 | 2 / 2 | 218 / 68 | 291 / 133 | 35 / 45 |
| solveCelebration | 51.9 / 51.8 | 51.9 | 87% | 26 / 27 | 3 / 3 | 93 / 115 | 196 / 221 | 42 / 46 |
| galleryGlide | 46.0 / 46.9 | 46.4 | 78% | 6 / 8 | 4 / 4 | 280 / 253 | 539 / 512 | 42 / 43 |
| themeToggle | 43.0 / 42.9 | 43.0 | 72% | 13 / 14 | 5 / 6 | 194 / 223 | 534 / 631 | 49 / 51 |

The mobile ranking matches the desktop's: **themeToggle worst, then galleryGlide**, both with
250ms+ worst frames. The gallery fold costs *more* here in absolute ms (280 and 253) than on the
desktop's larger raster, on a third of the pixels.

Two idle-only sim runs bracket the beat train: one landed clean at 60.29 fps with a single long
frame, the next showed 15 long frames at a median 134ms gap. Same train as the desktop, less
consistently armed.

## 5. Standing census (post-run, both surfaces)

Measured after every window closes, so the style recalc it forces can't taint a sample.

| | desktop C1 / C2 / C3 | sim D1 / D2 |
| --- | --- | --- |
| DOM nodes | 1240 / 1180 / 1180 | 1171 / 1171 |
| elements with a live `filter` | 123 / 101 / 101 | 99 / 99 |
| …of which are **HTML** (CPU path in WebKit) | 19 / 18 / 18 | 18 / 18 |
| `will-change` ≠ auto | 49 / 48 / 48 | 44 / 44 |
| `transition: all` **with** a non-zero duration | 46 | 46 |
| `.boil-pose` / `.rest-pose` / `.dt-pose` nodes | 16 / 8 / 4 | 12 / 8 / 4 |
| Web Animations at idle | 21–23 total, **0 running**, all finished | 21 total, 0 running |

The desktop's filtered-element count moves with board state (123 against 101) while the pose-node
counts hold: the extra live filters are cell-level, not chrome. The sim carries 12 `.boil-pose`
nodes against the desktop's 16—one fewer boiling surface in the narrow regime.

Two notes for the cure lanes:

- The orientation census's *35 cell-reveal CSSAnimations running at idle* does not reproduce here.
  `document.getAnimations()` reports 21–23 animations at idle on both engines with **playState
  `finished`** on every one—fill-forwards, not burning frames. The beat train, not a stuck
  animation, is what idle actually costs.
- `transition-property` computes to `all` by default in WebKit, so an unqualified count of it is
  meaningless. Gated on a non-zero duration the real number is **46** on both surfaces.

---

## 6. How to run it

Rig lives at
`/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/perf-rig`
(`$RIG` below). Runs land as JSON lines in `$RIG/runs/<runId>.jsonl`.

```
probe-server.mjs        node, zero deps — serves dist on :4894, injects the probe, collects metrics
probe.js                the in-page scenario engine (vanilla, classic script)
run-safari.sh           drives real desktop Safari
run-sim.sh              drives real MobileSafari on the iOS simulator
summarize.mjs           folds run JSONL into the tables above
validate-headless.mjs   Playwright-WebKit smoke of the SELECTORS ONLY, never a source of numbers
```

**The server is left running for L2.** Background task `b6pfzizwn`, pid 81316, port 4894.
Restart it with:

```bash
node /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/perf-rig/probe-server.mjs
# optional: --port 4894 --dist <path>   · health: curl -sf localhost:4894/__ping
```

Drive it:

```bash
cd $RIG
KEEP_SAFARI_FRONT=1 TIMEOUT=240 ./run-safari.sh <runId>                      # all six scenarios
KEEP_SAFARI_FRONT=1 ./run-safari.sh <runId> themeToggle,galleryGlide         # a subset
KEEP_SAFARI_FRONT=1 ./run-safari.sh <runId> idle3s ablations/no-boil.css     # with an ablation
KEEP_SIM_FRONT=1 TIMEOUT=240 ./run-sim.sh <runId>                           # the simulator
./run-safari.sh <runId> rafCeiling                                          # the display ceiling
node summarize.mjs <runId> [<runId>…]
```

Scenario names, in the order they are state-safe (this is the default set):
`idle3s,deal,undoBurst,solveCelebration,galleryGlide,themeToggle`, plus `domDump` (diagnostic)
and `rafCeiling` (the app-free control page). Extra query knobs: `__attempts` (default 3),
`__settle` (default 1200ms), `__ablate` (URI-encoded CSS, injected before the app boots).

Ablation CSS is passed as a **file** and encoded by the driver; put candidate files in
`$RIG/ablations/`. The CSS lands in a `<style>` ahead of the app's module, so it can suppress a
pose stack or a filter before first paint.

The path is verified end-to-end: `ablations/pose-freeze-all.css` (436 bytes, a crude estate-wide
pose-0 pin in the shape of the divider freeze) injected cleanly—`env.ablated: true`—and idle
came back at 80.9 fps with **9** long frames where the un-ablated runs carry 18–23, gaps stretching
to multiples of the beat (500, 256, 126, 122, 618, 131, 502, 493). Read that as a **lead for L2,
not a result**: the starter's `:first-of-type` selector is too blunt to guarantee it froze rather
than blanked each stack, and the fps mean barely moved. It does show the instrument can separate
the beat train from the rest.

### Reading a result

Per scenario: `fps` (frames ÷ wall), `frames`, `wallMs`, `p50`, `p95`, `worstMs`, `long33`,
`long50`, `jankMs` (summed time in frames >50ms), `worst3` and `long33At` (every long frame's
ms and offset—the **spacing** is the diagnosis: a fixed period means a cadence artifact, a
scatter means load). Plus `focusEvents`, `hadFocus`, `attempt`, `tainted`.

`fps` is `null` when a window collected under 5 frames or ran under 200ms—that is an aborted
window, and an fps there would be arithmetic rather than measurement.

---

## 7. Method notes and traps

**A backgrounded or occluded WebKit page has rAF and timers suspended.** This is the single
biggest hazard on this machine and it invalidated two runs before it was understood. Symptom: a
lone 1000–1300ms delta at a window edge, and in the worst case the probe posts its `env` line and
flatlines. `safari-A1` died that way with a full-screen app over Safari; `safari-B3` survived but
carried 6 focus events and 1.2–1.3s artifacts—**both are discarded**, kept in `runs/` only as
the record of the failure mode.

Three defences, all in the rig now:

1. `run-safari.sh` opens the URL through AppleScript into the **front window's current tab** and
   activates Safari. Plain `open -a Safari` does not guarantee tab-in-front.
2. The driver re-asserts the front whenever another app takes it, and prints the count. On this
   desktop the ChatGPT app and VS Code grab focus on their own schedule—measured: Safari held
   the front ~8s, then ChatGPT for ~11s, then Code. A run reporting re-asserts > 0 should be
   re-taken.
3. The probe watches `blur`/`focus`/`visibilitychange` itself and **re-takes any window that was
   tainted**, up to `__attempts` (default 3), keeping the first window that ran with focus
   throughout. Each scenario's `prepare` step restores its starting state outside the measured
   window, which is what makes a re-take honest—`solveCelebration` deals a fresh board per
   attempt, since a solved board has no celebration left to give. If every attempt is tainted the
   least-tainted one is reported with `tainted: true`, and it should not be quoted.

**Board-ready must require a *painted* cell, not a present one.** `.board-group` is `v-show`n, so
when the gallery holds the stage the cells stay in the DOM with zero client rects. A
presence-only check will happily "sample" an invisible board—that is what produced `safari-B1`'s
run of *no visible Deal control* / *no visible .logo-trigger* errors alongside a plausible-looking
idle number. Board-ready now demands a visible `.board-cells .game-cell`.

**Both control panels are always mounted.** The desktop and mobile `GameControlPanel` twins both
exist in the DOM; only one is painted. Every lookup filters on visibility, and on a coarse or
narrow regime the probe pulls `.drawer-tab` first, because a parked drawer is `visibility:hidden`
and every control inside it reads invisible.

**Deal is a two-tap arm/confirm only when coarse and dirty.** The probe clicks, waits 350ms,
re-reads the aria-label, and confirms only if it says *Tap again*. One code path, both regimes.

**A failed control lookup posts a `domDumpOnError` line**—every button's aria-label with the
exact reason it was rejected (no box / display / visibility / opacity), plus the structural
selectors. Read that before theorising about a missing control.

**Simulator numbers are not device numbers.** MobileSafari on the simulator runs against the
host's M5 Max CPU and GPU. It exercises the real mobile code path—coarse pointer, the drawer
regime, a 393×699 viewport at dpr 3, real WebKit compositing—but its throughput is Mac-class.
Read it for *does the mobile path jank, and where*; never for *the iPhone does N fps*. The
owner's iOS verdict still wants a real device.

**The machine was under load from sibling lanes** throughout. The tight run-to-run agreement
(`undoBurst` 54.4/54.8/56.6, `themeToggle` 42.9/43.0 on the sim) says contention is not driving
these numbers, but a quiet machine would likely read a little better.

---

## 8. Flags

- **No real iOS device was touched.** iOS runtimes finished downloading mid-lane and the
  simulator baseline is real MobileSafari, but hardware-class throughput is unmeasured. E8 device
  smoke remains an owner row.
- Desktop Safari opened on the **external 4K panel at a ~100Hz ceiling**, not the built-in
  120Hz XDR. A run on the built-in would shift every absolute number; the %-of-ceiling column is
  the portable one.
- `solveCelebration` fps carries board-difficulty variance (±8). Its `long33` count is the stable
  signal.
- Safari tab cleanup is best-effort via AppleScript and may be refused by TCC. Tabs opened during
  this lane were closed; if any `localhost:4894` tab survives, it is harmless.
- `safari-A1`, `safari-B1`, `safari-B2`, `safari-B3` in `runs/` are **failure-mode records, not
  baselines**. The baseline is `safari-C1..C3` (desktop), `sim-D1..D2` (simulator),
  `ceil-1` / `sim-ceil-1` (ceilings), `idle-E1..E4` (the beat train).
- The dist on disk is *newer* than the live edge: it carries `index-BsqxBJD-QIpf.js` at
  `981353c0`, while `sudoku.babb.dev` serves the earlier `index-Cp_nO-EV.js`. The rig measures
  the newer bundle—the one with the divider freeze.

## 9. What L2 should reach for first

1. **The 125ms beat train at idle**—8 hitches/second of 34–38ms on desktop, present on the sim
   too. Ablate the pose stacks one surface at a time (`__ablate` a `display:none` or a
   `.is-active` pin) against `idle3s` and watch `long33At`'s gap structure collapse or survive.
   HandDrawnGrid's four full-board `<image>` opacity flips per beat are the obvious first suspect
   on raster grounds.
2. **themeToggle, 47% of ceiling and ~200ms frames at both the click and the toggle-back**—the
   208px filtered celestial stack plus a whole-page theme repaint.
3. **The gallery fold's 187–197ms frame at ~900ms** (280ms on the sim)—`useFlipGlide`'s WAAPI
   card glide against live-filtered card faces.
4. **`undoBurst`'s floor**—55 fps with no frame over 50ms means no single re-raster to blame.
   That one is a per-keystroke cost spread across the board, and it wants a different instrument
   than the frame curve.
