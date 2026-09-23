# ACC-FIVE — pass-5 PROTOTYPE (the gauge as the fifth crayon; §3 §4 §12 leader)

Base and π control `74a2b5d9` (the shared read-only `w7-control`, dist `index-CubiZsMVSwTc.js`,
verified by asset hash). Work tree
`/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-41`,
advanced IN PLACE on the pass-4 diff, uncommitted. Servers (all killed by recorded PID, band re-read
FREE): lane dev `:4236`, control dist `:4237`, lane dist `:4238`, ACC-SIX `-45` dist `:4239`
(`index-BfaZiyPZjKWM.js`), ACC-GRAPHITE `-40` dist `:4240` (`index-p5CzZlhoZGR-.js`; both built
into scratch outside their trees, both trees' `git status` + diff sha1 byte-identical before and
after). The lane dist cited below is `index-DSX02oA-zLve.js`; the final tree rebuilds to
`index-Cky9y17EQZU1.js`, and the two are **43/43 files identical modulo asset hashes and Vue scope
ids** (normalised-content compare) — the edits between them were prettier and comments. The
pass-5 number is the CRITIC's.

## 0 · Replay route and the tree at open

No replay. At open `git diff --stat` read **9 modified / 3 untracked, +769 −97** — the pass-4
README's return state to the file, and the chair's `pass4.diff` bank. At return: **11 modified /
4 untracked, +868 −134** (tracked). New: `e2e/front-rate.spec.ts`; modified this pass:
`gridPaths.ts`, `HandDrawnGrid.vue`, `DifficultyTally.vue`, `GameGallery.vue` (comment only),
`gridPaths.poseFronts.test.ts`, `progress-corridor.spec.ts`, `join-language.spec.ts`,
`check-pw-projects.mjs` (SPEC_MANIFEST, two names), plus prettier over three pass-4 files. No
`git apply`, no line-count check owed.

## 1 · Numbers first

### 1.1 The rate budget binds all three `poseFronts` consumers (MUST 1; critique §3.1)

The cure: `frontGate` + `FRONT_MIN_MS` moved from `HandDrawnGrid` into `gridPaths.ts` beside
`poseFronts` (one primitive, one budget). The tally's draw-in is ONE linear clock with the stagger
as arithmetic (five per-stroke sequences cannot be cured by five gates — their commits interleave)
committing through one `frontGate`; its cut is `poseFronts(strokeFrames[i], f)` on the computed's
own array, so the memo hits.

One page A, one run, `?wire=local&size=3&difficulty=EASY` (dev; a random deal is fine here, the row
is not π): load (the tally draws in), three hints (the gauge), invite + B joins (the join ring).
`reducedMotion: no-preference` witnessed false in-page. Worst burst per consumer, `frames / span`
(the critic's form) and the interval form `(frames − 1) / span`:

| cell | panel | gauge | tally | join |
|---|---|---|---|---|
| chromium/light | 128 Hz | 56.8 (52.0) · 12 f / 211 ms | 50.4 (47.4) · 17 f / 338 ms | 52.1 (50.1) · 26 f / 500 ms |
| chromium/dark | 130 Hz | 50.7 (46.1) | 56.1 (53.2) | 52.0 (50.0) |
| webkit/light | 100 Hz | 56.1 (51.4) | 54.2 (51.2) | 51.1 (49.1) |
| webkit/dark | 100 Hz | 55.8 (51.2) | 53.7 (50.7) | 50.9 (48.9) |
| **ABLATED** `FRONT_MIN_MS` 16→0, chromium/light | 128 Hz | 141.3 (137.0) | 139.3 (136.3) | 135.7 (133.8) |
| ABLATED chromium/dark | 130 Hz | 137.1 (132.8) | 137.4 (134.5) | 137.4 (135.5) |
| ABLATED webkit/light | 100 Hz | 106.4 (102.1) | 102.3 (99.4) | 99.8 (97.8) |

The tally the critic read at 134.2/139.7/s now reads 47.4–53.2/s interval, 50.4–56.1 frames/span.
`readings/three-consumers-{GATED,ABLATED}.json`; the ablation was edited, run and restored with
`shasum -c` OK in one script (`logs/rate-battery.log`).

### 1.2 G10 is a gate (MUST 1; critique §3.2)

`e2e/front-rate.spec.ts` (its own file: a spec has ONE motion state and this row is live) — one
page, all three consumers, each must re-cut, each worst burst ≤ 62.5/s on the interval statistic
(stated in the row: `frames / span` reads 64/s on a 60 Hz panel whose every frame clears the gate).

| run | chromium | webkit |
|---|---|---|
| landed | PASS | PASS (`logs/e2e-front-rate.spec.ts.log`, 2 passed) |
| `FRONT_MIN_MS` 16→0 | **RED** gauge 133.5/s | **RED** gauge 100.9/s |
| tally's gate bypassed (`onProgress → at(t·span)`) | **RED** tally 136.8/s | **RED** tally 95.9/s |
| join's gate bypassed (`joinGate.write(to, true)`) | **RED** join 134.7/s | **RED** join 98.2/s |

Each ablation restored by `shasum -c` OK. Plus a deterministic unit row
(`gridPaths.poseFronts.test.ts`, `frontGate`): a 250 Hz write stream commits at 0/16/32/48, the
forced end lands, `rearm()` re-opens the leading edge, `1000 / FRONT_MIN_MS === 62.5`.

### 1.3 The corridor's born-REDs observe the product's throw (critique §3.6)

`progress-corridor.spec.ts`: one `corridor()` body serves the gate and its controls; a control
asserts the text of the error `corridor()` THREW. Two controls per theme: FAR (HEAD's `#8b5cf6`) must
throw `NO GAUGE PIXEL IN THE BAND (<scheme>)` with the grounds and the off-anchor clause; NEAR — an
in-window ink 25° off the anchor at the gauge's own OKLCH L and C (light `#bb7130`, dark `#8b5b19`,
Y within 3 %) — must throw on the HUE row, which now runs before the ratios. **12 passed** both
engines (`logs/e2e-progress-corridor.spec.ts.log`), so both controls red as required on this tree.
The ≤5° line the critic left un-demonstrated is demonstrated.

### 1.4 ROW B (print) — a DISPOSITION of `index.css`'s `@media print` → `@layer base` →
`.progress-trace { stroke: #000 !important }` (T9-W7 §4, this family's rule)

Read SETTLED (poll to three agreeing reads), one payload
`ATMuNjA4MTc5…` (61 givens, read back on both arms), ten hints (valuenow 25, not won):

| | chromium/light | chromium/dark | webkit/light | webkit/dark |
|---|---|---|---|---|
| +200 ms (the pass-4 instant) | rgb(13,9,1) | rgb(10,8,1) | rgb(14,11,2) | rgb(13,11,2) |
| **settled** (491–508 ms) | **rgb(0,0,0)** | **rgb(0,0,0)** | **rgb(0,0,0)** | **rgb(0,0,0)** |
| frame (print) | rgb(0,0,0), 12 u | same | same | same |
| gauge px changing ≥3:1, print | 644 | 659 | 726 | 179 |
| gauge px changing ≥3:1, screen | 1,982 | 1,893 | 2,543 | 2,205 |
| control (no print arm; violet prints), print | 3,501 | 3,872 | 12,312 | 11,425 |

The rule prints the gauge black on a black frame; 9–33 % of its ≥3:1 painted presence survives on
paper. **Ballot (owner): KEEP the graphite print arm (what ships) / RE-COLOUR it in the gold family.**
Default: what ships.

### 1.5 ROW C (forced colours) — a DISPOSITION of `@media (forced-colors: active)` → `@layer base` →
`.progress-trace { stroke: CanvasText !important }` (this family's rule)

Settled, same payload. The FRAME is not forced: `.grid-line` keeps rgb(38,38,38) light /
rgb(209,207,199) dark at 12 u in both engines (the pass-4 sentence "same colour and width" was
false; the critic was right).

| | chromium/light | chromium/dark | webkit/light | webkit/dark |
|---|---|---|---|---|
| trace | rgb(0,0,0) | rgb(255,255,255) | rgb(0,0,0) | rgb(0,0,0) |
| **trace : frame** | **1.388** | **1.56** | 1.388 | 13.461 |
| trace : paper | 21 | 21 | 20.632 | **1.122** |
| HEAD control (no forced rule; violet survives) trace : frame / paper | 3.574 / 4.234 | 3.653 / 3.685 | 3.574 / 4.16 | 3.653 / 3.284 |

The ratio the gauge loses against is **1.388 light / 1.56 dark (chromium)** — the frame it
retraces — not the ~1.16 the critique estimated. The family's own rule LOWERS trace:frame from
HEAD's 3.574 to 1.388 while raising trace:paper from 4.234 to 21. WebKit/dark is Playwright/WebKit's
forced-colours emulation (CanvasText resolves black, the paper stays rgb(19,18,17)); it is stated,
not read as an estate finding. Arms measured in the same layer: `Highlight` is engine-dependent
(chromium 1.258 / 1.022 vs the frame; webkit 7.597 / 1.277) — not a candidate; frame → CanvasText
makes trace:frame exactly 1. Keeping the crayon (dropping the rule) computes gold 4.08 : frame /
3.71 : paper light, 3.66 / 3.68 dark (ARITHMETIC, not painted). **Ballot (owner, an accessibility
row): CanvasText as landed / keep the crayon under forced colours.** Default: what ships; the 1.388
goes up beside it.

### 1.6 FORK A — the one cell (critique §3.5): `p5-1-forkA-win-light-contrastmore-chromium-fine.png`

chromium · light · `prefers-contrast: more` (witnessed) · 1280×800 · fine pointer · at the win
(Solve) · `reducedMotion: reduce` held on all three panes · one payload. Painted band modal on paper:

| pane | stroke | painted : paper |
|---|---|---|
| CURED (this tree) | rgb(140,105,29) 12 px | **4.967** |
| ABLATED (hedge struck, the LAYERED idiom) | rgb(201,154,46) 12 px | **2.533** |
| CONTROL `74a2b5d9` | computes rgb(139,92,246) 8 px, full dash | 1.548 (1 chromatic px) |

Cured↔ablated differ by the hedge alone; cured↔control by the tree alone. The control band paints a
near-black stroke while `.progress-trace` computes violet; `elementsFromPoint` cannot hit the
`pointer-events: none` SVG, so the mechanism is NOT verified (a gap, §3). Default: keep the hedge.
Retires `pass4/prototype/ACC-FIVE/win-dark-contrast.png`.

### 1.7 π on the two hidden surfaces (critique §3.9), driven, with its negative control

Built dists, one payload, 1280×800 fine. State G: dirty a cell → wordmark → ArrowRight → `d` (the
deal guard arms), then hover the leave verb. State S: hover the solver's button.

| cell | guard rest π paint / rect | guard hover π | sparkle hover π | control-vs-control (all three) |
|---|---|---|---|---|
| chromium/light | 21 / 0 | 20 / 0 | 1 / 0 | 0 / 0 |
| chromium/dark | 21 / 0 | 20 / 0 | 1 / 0 | 0 / 0 |
| webkit/light | 21 / 0 | 20 / 0 | 1 / 0 | 0 / 0 |
| webkit/dark | 21 / 0 | 20 / 0 | 1 / 0 | 0 / 0 |

Every diff is a claimed surface: 4× `.progress-trace` stroke, 5× the dirtied digit's glyph stroke
(`--color-user-ink`, pass 3's claim: rgb(2,111,196) ← rgb(37,99,235) light), 1× `.sparkle-icon`
filter (gold `drop-shadow` ← violet-300), `.guard-face` colour (rgb(208,42,82) ← rgb(10,10,10)
light; rgb(255,92,124) ← rgb(237,236,233) dark) and background (transparent ← the 8 % wash), and
the verb's drawn box (`outline-svg`/`boil-pose`/`path` colour, currentColor). 0 rect diffs, 0 nodes
in one arm only. `readings/pi-hidden.json`.

### 1.8 G5 — the leave verb's red, PAINTED (carried since pass 2) — RED at light hover

PAL-WALK's painted-text form (the face made transparent, word and box together; every changed pixel
against its ground), core = pixels ≥ 50 % of the max luminance change, sensitivity row k=.5/.7/.9/1:

| | rest: core median · p30 · max · fraction < 4.5 | hover |
|---|---|---|
| chromium/light proto | **4.62** · 4.358 · 4.917 · 0.31 | **4.41** · 4.331 · 4.693 · **0.541** |
| webkit/light proto | **4.589** · 4.189 · 4.917 · 0.329 | **4.384** · 4.233 · 4.693 · **0.57** |
| chromium/dark proto | 5.783 · 5.783 · 6.392 · 0.047 | 5.078 · 4.696 · 5.783 · 0.106 |
| webkit/dark proto | 5.849 · 5.849 · 6.392 · 0.066 | 5.078 · 4.7 · 5.849 · 0.113 |
| control (black / paper verb) | 14.93 / 13.58 light / dark | 16.72 / 12.76 |

The pass-2 "4.917" is the BEST PIXEL (the max column), a ceiling. The word is body text
(`--type-body`, hand face, normal weight), so 4.5 binds: light hover is UNDER it in both engines and
light rest is marginal with a third of the core under. The `GameGallery.vue` comment that carried
4.99 / 4.69 is corrected to these painted numbers in this diff; the cure is NOT landed (§3 gap 1).

### 1.9 The rest, measured

- **G0 (ACC-SIX's instrument) on this tree — MOVED** (the subject's ink left violet; the hue anchor is
  now a parameter, `instruments/g0.MOVED.PROPOSED.diff`). At the 5 % stop, painted share vs requested:
  this tree **+0.14 to +0.22 pts** in all four engine×dpr cells (26-segment cut front); the control
  chromium +0.16/+0.24, **webkit +15.69/+15.75** (the 494-segment dash restart, HEAD's defect). The
  CSS-form control at 25 % reproduces the falsification on this tree: chromium 24.96/25.23, webkit
  97.76/97.85. Honest: G0's own walk is degenerate on both arms (stops 2–5 read 100 %), so only the
  5 % stop discriminates.
- **filter-census, built dists, both engines** (`logs/filter-census-*`): LIGHT 12/12 passed on this
  tree and on the control; **DARK 4 failed / 8 passed on BOTH**, the same two unclaimed rows
  (`svg.crayon-heart.idle saturate(0.85)`) in G3.1 and G3.3 — HEAD's estate row (chair §1.4),
  identical on the control, not this diff's. The leader does NOT admit it: the chair's default (the
  idle saturate is deleted) stands; ACC-SIX carries the born-RED.
- **The memo** (critique §3.4), re-benched under a loaded box (esbuild bundle, node, 2,000 calls
  after 200): ring hit 0.0788 / miss 0.3682 ms (78.6 %); the tally's stroke, four poses, hit
  0.0106 / the old `poseFronts([d], f)` ×4 0.0570 ms (81.4 %). The critic's 0.0604 / 0.2595 (76.7 %)
  is written into the `poseGeometry` docstring with the call-shape trap. The bench's grain for the
  stroke is a stand-in (72 segments), not the rendered stroke.
- **`.progress-trace` count**: 4 nodes in ONE `svg.hand-drawn-grid` on the board route at 1280×800,
  4 `d` records per re-cut frame (48 d / 12 frames), both engines. The critique's 8 (two instances)
  does not reproduce on this route; `front-rate.spec.ts` prints the count it read.
- **The join wash's full handle**: the observer watched A ≥ 4 s after B joined (the whole 740–1180 ms
  handle) and saw ONE burst: 100–108 d records, 25–27 re-cut frames over 489–500 ms (48.9–50.1/s
  interval). After the ring stands whole nothing re-cuts; the rest of the handle is opacity. Per join
  = 25–27 re-cuts (ablated 51–70). The "≤74" ceiling was arithmetic and is now a count.
- **The screen-reader mirror**: `.progress-trace-a11y` carries no text node; the progressbar's
  `aria-valuenow` reads 0, 5, 5, 10, 10 over five hint presses on BOTH arms, both engines (the first
  press lands no digit). `aria-valuetext` was not read.
- **join-language's `ringFront`** read `1000 − strokeDashoffset`; the dash is gone, so it returned
  **1000 on the first frame the ring existed** (chromium d 273 chars, webkit 189) — a gate that could
  not fail since pass 3. Re-cut: 1000 only when a pose is WHOLE (an uncut pose closes with `Z`; a cut
  front never does); the same first frame reads 0. The file passes 6/6 both engines.
- **The unit battery**: `src/pencil` 10 files / 84 tests; `src/games src/composables` 60 / 757 —
  **70 files / 841 tests, 0 failed** (+1 on pass 4: the `frontGate` row), then the touched dirs
  re-run on the FINAL tree (after prettier and the comment edits): `src/pencil src/games/shared`
  44 files / 513 tests, 0 failed. `vue-tsc -b` 0, `vue-tsc -p tsconfig.e2e.json` 0.
- **M16**: `check-copy-register` bare exit 0 (no rendered string was added).

## 2 · The pre-return battery (each bare; the control's exit beside it)

| gate | work tree | control `74a2b5d9` |
|---|---|---|
| `check-copy-register` / `check-ink-pressure` / `check-theme-tokens` | 0 / 0 / 0 | 0 / 0 / 0 |
| `lint:copy` / `lint:ink` / `lint:lanes` / `lint:theme-tokens` | 0 / 0 / 0 / 0 | 0 / 0 / 0 / 0 |
| `lint:sleep` | 0 (first run 1, cured) | 0 |
| `lint:motion` | 0 (first run 1, cured) | 0 |
| `test:e2e:projects` / `check-pw-projects` (checks 1–8, band green) | 0 / 0 | 0 / 0 |
| `eslint .` / `npm run lint` (prettier) / `knip` | 0 / 0 (first run 1, cured) / 0 | 0 / 0 / 0 |
| `progress-corridor.spec.ts` whole, both engines | 12 passed | n/a (the file is this lane's) |
| `front-rate.spec.ts` whole | 2 passed | n/a |
| `join-language.spec.ts` whole | 6 passed | not run |
| `filter-census.spec.ts` light / dark, built dist | 12 passed / 4 failed | 12 passed / 4 failed (same rows) |

**Inherited reds, declared.** At the pass-4 return three rows were red and undeclared: `lint:motion`
(`progress-corridor.spec.ts` had no PRM declaration), `npm run lint` (prettier on
`HandwrittenGlyph.ink.test.ts`, `check-ink-pressure.mjs`, `check-theme-tokens.mjs`), and
`check-pw-projects` check 6 (the spec absent from SPEC_MANIFEST — the pass-4 diff never touched the
script). All three are cured here. `lint:sleep`'s two flags were this pass's refactor (the sleeps
moved into `corridor()`) and are cured by polls. The filter-census DARK red is HEAD's.

## 3 · Gaps — every one, largest first

1. **G5 is RED at light hover** (4.41 / 4.38 core median, 54–57 % of the core under 4.5, both engines)
   and marginal at light rest (4.62 / 4.59, a third under). This family's replayed pass-2 hunk. Not
   cured: the three honest cures are a palette decision — (a) the leave verb loses the hover ground,
   (b) a deeper red for the verb only (a new token), (c) the word goes back to ink and the red rides
   the drawn box (non-text 3:1). The comment now tells the truth.
2. **ROW C's landed rule lowers trace:frame to 1.388 / 1.56** from HEAD's 3.574 / 3.653. It is the
   owner's ballot (§1.5), not landed either way.
3. **FORK A's control pane is unexplained**: the control band paints near-black where the trace
   computes violet; the mechanism is not verified.
4. **Carried, not run this pass**: G9 (the per-anchor census), goldens, R6's heading census, R3's
   wobble, F1's two arms (PLR-SELF's flag was not flipped), G3's ΔL band median (pass 3's
   +0.0944 / +0.3217 stand as pass-3 numbers), `aria-valuetext`.
5. **The node CORRIDOR row** (`check-ink-pressure`) still cannot fail on HEAD's violet (token
   arithmetic 3.57 where the paint is 2.876): the KIN rows red, the CORRIDOR row stays green. It is a
   drift guard; the painted arm is `progress-corridor.spec.ts`.
6. **`#7D6902`** survives once, in a comment at `index.css:472` (the corridor ledger citing pass 2's
   rejected hex with its reason). No declaration carries it.
7. **G0's walk is degenerate** (§1.9) on both arms — ACC-SIX's instrument, its row.
8. **The rate readings ran on a box at load 19–32** with 100 Hz headless WebKit (pass 4 read 63–67):
   the gate is load-proof in one direction only (load lowers rates), and the born-REDs held.
9. **The wave is over its image cap** (`check-evidence-policy` exit 1: 2,543,916 B > 2,097,152 B at
   my return). This lane's three crops are 123,014 B (19,242 + 51,656 + 52,116, band-cropped from a
   first 196/204 KB composite); the chair sweeps.

## 4 · Leader duties

- **The section's fork, at ONE board** (`p5-2-…-chromium-fine.png`, `p5-3-…-webkit-fine.png`): gold
  (this tree) / violet (ACC-SIX `-45`) / graphite (ACC-GRAPHITE `-40`) / control, all built dists,
  one payload `ATMuMDkwNzAy…` read back on every arm, light · 1280×800 · fine · `reducedMotion:
  reduce`, ten hints, the top band of each board. Band modal on paper: gold 3.646, violet 3.309,
  graphite no chromatic ink (its state marks are graphite), control 4.444 chromium / 4.433 webkit —
  and in WebKit the control paints the WHOLE ring at 25 % (the defect) where gold and violet paint
  the top edge. **Uncontrolled variable, stated**: ACC-SIX's `aria-valuenow` reads 5 where the other
  three read 25 on the same board and fill (`-45 HandDrawnGrid.vue:337 :aria-valuenow="filled"`, a
  count, not a percent) — a row for ACC-SIX. Crops retire `pass4/prototype/ACC-SIX/frames/1-the-arc-desk-light-chromium-fine.png`
  and `pass4/prototype/ACC-FIVE/win-light-nopref.png`.
- **The rate budget, stated with the number as a hard co-landing condition**: `-45` and `-40` both
  consume `poseFronts` in the miss shape (`poseFronts([d], reveal[i])[0]`, `-45
  DifficultyTally.vue:171`, `-40 DifficultyTally.vue:167`) with no `frontGate`, and `-40`'s join ring
  is ungated (`HandDrawnGrid.vue:218`). Ungated, each consumer measures 133.8–137.0 re-cuts/s on a
  128–130 Hz panel. Neither front lands without `frontGate` from this tree's `gridPaths.ts` and the
  `front-rate.spec.ts` row.
- **GRAPHITE's sentence**, carried to its tree: `-40 gridPaths.ts:647–648` says the consumer "calls
  this on a RATE-GATED subset of its frames (HandDrawnGrid, T9-W7 §5), never once per vsync". On
  `-40` there is no gate; the sentence is false until the tree takes `frontGate` or strikes it.
- **ACC-SIX's 13.6 px redistribution** (393×699 coarse: masthead/logo/board/cells −13.6, play-controls/
  icon-btns/board-voice +13.6, a 27.2 px column; W2's `.drawer-tab` +13.6 at 844×390 — its critic's
  numbers, not re-measured here) is carried to NOTE-ERASE's fold row under §7's seating. Consumed,
  not minted.
- **G8 (T9-D-ACC6-3)**: the leader picks **RETIRE**, the chair's default. G1 reads the surface G8 tried
  to; G8 was not re-run here and its 83.16 % is ACC-SIX's pass-4 reading.
- **G2's frame statistic**: the perimeter median (7 px desk / 4 px phone). This record quotes no
  "× the frame" ratio; the corridor's flank sentence is in stroke units, stated as such.
- **filter-census DARK at HEAD**: §1.9 — not admitted; the deletion default stands.

## 5 · r0 / R6

No r0 row is MOVED by this diff; nothing written under `r0/`, `pass1/`–`pass4/`. One sibling
instrument is MOVED: ACC-SIX's G0 (`pass4/prototype/ACC-SIX/instruments/p4-g0.mjs`), copied with its
hue anchor parameterised — `instruments/g0.MOVED.PROPOSED.diff`. Law 25's reversion stays as booked.

## 6 · Incidents, self-declared

1. The first three-consumer run read 0 on gauge and tally in webkit/light (hints fired before the
   deal settled on a loaded box); the instrument waits for an enabled hint now and was re-run. The
   ABLATED webkit/dark cell lost its page (every count 0, `.progress-trace` 0) — not a finding; the
   e2e born-REDs cover webkit.
2. The first ROW B/C statistic (a raw pixel-diff count) could not separate black-on-frame from
   black-on-paper; the run was stopped by its PID mid-way (`logs/rows-bc-first-run-stopped.log`) and
   re-cut into the ground-split, ≥3:1-binned count.
3. G10's first cut used `locator(...).first()`, which resolved a hidden hint twin: two 90 s timeouts.
   Re-cut to the DOM press `fillByHint` uses.
4. The first battery run on the work tree was red on `lint:sleep`, `lint:motion` and prettier (§2);
   the G10 row moved to its own spec to honour one motion state per file.
5. My own new `HandDrawnGrid` comment claimed "two instances, eight `d` records"; the measurement said
   one instance and four. Corrected before return.
6. The lane dist was built before the prettier and comment edits; identity changed
   (`DSX02oA-zLve` → `Cky9y17EQZU1`) and the normalised compare says the content did not.
7. The scratch PW config gained a `SCHEME` env read while `join-language` was running (defaults
   unchanged). All scratch (configs, caches, test-results, dists) lived in the session scratchpad or
   `.acc-five/` and is deleted; the work tree's `git status` is product files only.
