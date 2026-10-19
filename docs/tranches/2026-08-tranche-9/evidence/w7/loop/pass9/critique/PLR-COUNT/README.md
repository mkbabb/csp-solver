# PLR-COUNT · pass 9 · the adversarial critique (non-author)

Critic lane `crit-PLR-COUNT`, 2026-10-18 from 18:35. Ports: the work tree `:4242` (Vite dev on the lane's worktree
`wf_f72f3b5a-83a-52`, private cacheDir in the critic scratch), the control `:4260` (`w7-control`'s pre-built dist,
served identity read back: `index-CubiZsMVSwTc.js`). Both found FREE at open (no listener), both started by this lane
under `guarded --timeout 90`, PIDs recorded. Every battery: its own `guarded` call, `--workers=1`, WebKit
`--exclusive webkit`; exits read bare from a file the wrapper writes. No commit, stash, deploy, install; no git on main
or in the control tree (git ran only against the lane's worktree object store through a temporary index).

## 0 · Static checks (numbers first)

| check | result |
|---|---|
| the work tree through a temporary index | write-tree `3d5f368a`; `git diff --binary 74a2b5d9` = sha1 `f78f9cf1`, 725,892 B, `cmp` 0 against the bank: **tree = bank** |
| homes v2 by sha | `homes.diff` sha1 `1f70cfda` (13 paths); every home path's blob in `3d5f368a` = homes tree `d17813ba`'s: **13/13, no residual home edit** |
| SELF's pass-9 cures by sha | SELF's p8→p9 change set (`959454c2`→`04c8b7dc`, 17 files): 15 blob-equal; `PlayerMark.vue`, `player-mark.spec.ts`, `useSession.ts` carry COUNT's own edits under SELF's, and their `-U0` change-line hashes equal SELF's (`104ee19e`, `58b641cd`, `17eb5803`) |
| the pass-9 advance over pass 8 | `de3b278d`→`3d5f368a`: 18 files, +4,019/−422; of them 12 home paths + SELF's 5 (`useSession.ts`, `PlayerMark.vue`, `rowBudget.ts`, `rowBudget.test.ts`, `player-mark.spec.ts`) + **one file of COUNT's own: `e2e/player-tally.spec.ts` (+343 −64)**. No `src/` byte of COUNT's own moved this pass |
| `pass9.diff` `apply --check` on a fresh `git archive 74a2b5d9` | **0** |
| `pass9.delta.on-WAVE.diff` on bare WAVE (`74a2b5d9` + `WAVE.diff`, = `acb9c08e`) | **0** |
| the delta on `acde977b` (WAVE + `homes.on-WAVE.diff`) | **0**; applied for real → frontend tree **`2237e3d2`** = the lane's claimed union |
| **the delta on `acde977b` + SELF's on-WAVE delta (`33e41544`) — the lane's BANKED.txt base and replay route step 1** | **1: 44 error lines, 26 overlapping paths** (`join-language-prm.spec.ts:79`, `multiplayer.spec.ts:187`, `player-mark.spec.ts` "already exists", `check-font-coverage.mjs:181`, `App.vue:26`, `BoardHost.vue:69` …) |

**Finding S1 (a false bank line).** The on-WAVE delta is cut against `acde977b` ALONE: it already carries SELF's
on-WAVE content in COUNT's own merge (`acde977b` + delta → `2237e3d2`, the union every lane union row read).
BANKED.txt's "base = acde977b + PLR-SELF's pass-9 on-WAVE delta", its line "delta on acde977b (+ SELF's delta) exit
0", and README §9 step 1 ("apply … PLR-SELF's pass9.delta.on-WAVE.diff and then pass9.delta.on-WAVE.diff (each apply
--check 0)") are false as written: the stacked route exits 1. The batch gate (0 on `74a2b5d9` AND on the WAVE) is
MET; the replay route is not. Consequence for the fold: COUNT's and SELF's on-WAVE deltas are ALTERNATIVES on 26
shared paths, not a stack; §11's fold lands one and hand-merges the other (SELF's `PlayerStub.vue`/lobby is absent
from COUNT's union: `git apply -R --check` of SELF's delta on `2237e3d2` fails on `PlayerStub.vue` "No such file").

## 1 · Re-derived on the served surface (chromium; WebKit in §11)

Rig: `crit-PLR-COUNT/rig/pw.config.ts` (testDir = the lane's `e2e/`, `workers: 1`), driver `jobs.py` (one edit per
job, the plant's bytes read back with `od -c` — no `\u` escape in any plant — the file restored by copy and sha1-checked:
`PlayerLobby.vue` back to `2660643c`, `PlayerMark.vue` to `3adf42dd`, `index.css` to its open blob, `restored=OK` on
every job). Each chromium job its own `guarded` call; exits written by the driver.

**Row 1 re-derived (clean, chromium, 18:40:04–18:41:32, load 16.4/17.6 → 16.9/17.8, exit 0, 4 passed):** the tree's
fraction under 4.5 equals the control's on every line of every cell, to the third decimal — light-1
0.817/0.774/0.790, light-2 0.486/0.515/0.496, dark-1 0.530/0.537/0.514, dark-2 0.366/0.359/0.334 — the lane's numbers
exactly; control style = line style 12/12; served control `index-CubiZsMVSwTc.js`.

**OPA80F, the pass-8 plant, FIRST (18:43:59–18:45:29, load 16.9, exit 1, 4 failed):** RED 4/4 on the CLEAN verdict
(the first assertion thrown is `.pl-state (<cell>)`), G3 on every line of every cell (fraction 1.000 against bounds
0.384–0.867), G4 beside it in light-1/dark-1. The lane's row 1 born-RED reproduces in chromium.

**The plus twin (LOBBY_ARIA_ONLY), the disjunct battery the lane did not run** — `shown()` has three disjuncts (text
nodes, `title`, `::before/::after content`); PLUSF2 plants only the first. Two critic plants in `PlayerMark.vue` at the
same anchor PLUSF2 used (the count the mark renders at 6 and 16):
- `PLUSATTR` (`:data-p="LOBBY_COPY.plus(…)"` + `.pt-count::after { content: attr(data-p) }`): **exit 1, RED** — shown
  `5 plus 1` at 6, `5 plus 11` at 16 (chromium resolves `attr()` in the computed `content`). The ::after disjunct bites.
- **`PLUSSPLIT` (the same line painted over three text nodes: `{{ count }}<i>{{ TALLY_MAX }}</i>{{ LOBBY_COPY.plus(0,
  0).slice(1, -1) }}<i>{{ count - TALLY_MAX }}</i>`): exit 0, GREEN** — reads `shown: null` at 6 and 16 while the
  in-run plant is SEEN (`5 plus 11`). `shown()` joins text nodes with `\n` and the regex wants `\d+ plus \d+` inside one
  node, so a painted `plus` line split across elements (a `<tspan>`, an `<i>`, a `<b>` around the digits — the shape an
  SVG tally label takes) escapes the twin while its letters ship unsubset (the font-coverage exemption the twin exists
  to back). **Row 7 is cured for its plant, not its class (registry-v8 §2.12): OPEN.** The cure is a twin that reads
  the RENDERED line (`innerText` of each element's block, or the bare ` plus ` word with no digit clause) plus a
  PLUSSPLIT plant in the run.

**COMB, the pass-8 G5 plant (18:45:33–18:47:07, load 18.0, exit 1, 4 failed):** RED 4/4 on the clean verdict; the
clauses per cell equal the lane's table (light-1 G3+G4 · light-2 G2+G3+G4+G5 · dark-1 G3+G4+G5 · dark-2
G2+G3+G4+G5). Row 2 reproduces in chromium. COMB's G3 margin in light-1 is thin: 0.897/0.867, 0.867/0.824,
0.867/0.840 (0.027–0.043 over the bound) — G4 carries it there.

## 2 · What the anchor does not pin (the critic's batteries)

**Finding A1 · the control's identity is logged, never asserted.** `controlReads()` returns `bundle` (the control
page's `index-*.js`) and the row prints it, but the only assertion on the control is `G14_CONTROL` non-empty
(`player-tally.spec.ts:893`). The reference is a SYNTHESIZED payload — the line's text in `TAG_RUNG`'s declarations,
every value a `var()` the page at `G14_CONTROL` resolves — so the anchor's whole bite on a TOKEN regression is that the
page is `74a2b5d9`'s. Point `G14_CONTROL` at any served build of the tree and the token is read against itself.
Plants: `TOKENF` (`--ink-press-quiet` 68 % → 58 % in `src/assets/index.css`, read against `:4260`), `TOKENF-SELF` (the same
plant, `G14_CONTROL=http://127.0.0.1:4242`), `CLEAN-SELF` (the clean tree, self-anchored) — results in the table below.
The cure is one assertion: `expect(ctl.bundle).toMatch(/index-CubiZsMVSwTc\.js$/)` (or the identity read from the
control tree's own dist), born-RED by `TOKENF-SELF` (a self-anchored run must then red on the identity alone).

| job (chromium) | control | window · load | exit | clean verdict per cell |
|---|---|---|---|---|
| TOKENF (`--ink-press-quiet` 68 % → 58 %) | `:4260` (`index-CubiZsMVSwTc.js`) | 18:59:22–19:02:25 · 41.6 (the guard held it for headroom) | **1, 4 failed** | RED 4/4: light-1 1.000/0.867 G3+G4, light-2 1.000/0.536 G2+G3, dark-1 0.769/0.580 G3, dark-2 0.469/0.416 G3 |
| **TOKENF-SELF** (the same plant) | **`:4242` (the tree itself; bundle read back: empty, Vite dev ships no `/assets/index-*.js`)** | 19:02:29–19:03:55 | **0, 4 passed** | GREEN 4/4: light-1 1.000/1.000, light-2 1.000/1.000 (G2 printed: the "control" fails it too), dark-1 0.769/0.819, dark-2 0.469/0.519 |

**A1 is demonstrated:** the same shipped token regression reds 4/4 against the real control and passes 4/4 when the run
is anchored on any other server, with the row printing an EMPTY bundle and asserting nothing about it. The anchor is the
gate's precondition (LAWS P8 §F: key the precondition, not the property), and it is unasserted: a masked fallback.
`CLEAN-SELF` (19:04:04–19:05:30, exit 0) is VOID and not cited: it read the plant's numbers (light 1.000, dark-1
0.769) after the driver had restored `index.css` on disk (sha back to the open blob, write-tree `3d5f368a` re-read at
19:05:40). `shutil.copy2` put back the backup's OLD mtime and the Vite dev server kept serving the planted sheet. The
servers were cycled at 19:05:32 (stopped by recorded PID, cwd checked) and the fresh `:4242` serves `68 %`. The driver
now restores with `copyfile` + `utime` for the WebKit column. The chromium rows before TOKENF are unaffected: each
`PlayerLobby.vue` restore was read back clean by the next job (SLK045's fractions = the clean read's, to the third decimal).

**Finding A2 · the lane's "threshold sabotage" moves the slack to ±0.005, not the bound by ±ε.** `r5breaks.py`
sets `G14_SLACK=-0.005` and `G14_SLACK=0.005` (the spec reads `G14_SLACK` as the slack itself, `:737`), so "SLACK+eps"
is the slack cut to a tenth (bound = control + 0.005) and "SLACK−eps" a NEGATIVE slack. Neither is the stated bound
(control + 0.05) ± ε, which LAWS P8 §F asks for. The spec's own "THE BOUND'S EDGE" pair (`:960–972`) is likewise
`fracBound = own fraction ± 0.005` — the comparator's strictness at the CONTROL's fraction, not at the bound. Neither
battery can tell 0.05 from 0.20. The real ±ε pair is in §2's table (`SLK045`, `SLK055`, and `SLK20` for a 4× loosening).

What the in-run plants pin, re-derived from the clean chromium read (every plant's fraction minus the control's):
- **G5-alone sets** (C5's bite): dark-1 **8** (margins +0.011 … +0.042), dark-2 **2** (+0.033, +0.046), light 0 —
  the lane's numbers exactly. The set empties once the slack falls under +0.033 (dark-2) — a lower pin.
- **G2-alone set** (C2's bite): light-2 **18**, smallest margin **+0.005** — the lane's number.
- **G3-only in-run plants** (C3's bite; the only thing that can pin the slack from ABOVE): among the ASSERTED plants
  (the sweeps `G5one_*`/`G2win_*` are excluded from the "is seen" loop, `:1041`) there are exactly two, both
  `FADE80_fill` in dark-1 (`.pl-qual` +0.463, `.pl-more` +0.486 over the control); **light-1, light-2, dark-2: none**
  (the lane's gap 4). So in-run nothing reds a slack under +0.46 in dark-1 and nothing reds ANY slack elsewhere; only
  the offline FILE battery pins it, at its own margins:

| FILE plant (chromium, `PlayerLobby.vue`'s own `<style>`) | exit | clean verdict per cell (light-1 · light-2 · dark-1 · dark-2) | the largest slack that still reds it (`ceil.py`: `any` = a non-G3 clause reds it at every slack; else the line's fraction − the control's) |
|---|---|---|---|
| OPA80F `opacity: 0.8` (the lane's) | 1 | RED · RED · RED · RED | any(+0.226) · any(+0.514) · any(+0.486) · any(+0.666) |
| COMB 1 px stripes 25 % (the lane's) | 1 | RED · RED · RED · RED | any(+0.093) · any(+0.228) · any(+0.246) · any(+0.304) |
| **OPA90F `opacity: 0.9` (the critic's)** | 1 | RED · RED · RED (G3 only) · RED (G3 only) | any · any · +0.119 · **+0.061** (dark-2 lines 0.420/0.416, 0.416/0.409, 0.395/0.384: margins 0.004–0.011) |
| **OPA95F `opacity: 0.95` (the critic's)** | 1 | RED (G4) · RED (G2/G4) · RED (G3 only, 0.590/0.580, 0.611/0.587) · **GREEN** (0.392/0.416, 0.391/0.409, 0.366/0.384) | any · any · +0.074 · **+0.032 < 0.05** |

OPA90F 18:47:11–18:48:41 (load 23.6), OPA95F 18:48:45–18:50:20 (load ~20); both `restored=OK` (`2660643c`).

**Finding A3 · the slack is a knob that admits a shipped 5 % fade in dark DPR 2, and no FILE plant the lane banks pins
it.** Every FILE plant in the lane's battery reds at ANY slack in the light cells (another clause carries it) and at
+0.09 or more elsewhere, so the battery cannot tell slack 0.05 from 0.09. The critic's OPA90F is caught in dark-2 by
G3 alone with 0.004 to spare (it passes at slack 0.055 on `.pl-state`). **OPA95F's CLEAN verdict is GREEN in dark-2 at the
stated slack**: the shipped surface at `opacity: 0.95` passes the anchored gate on all three lines. The row exits 1 there
only because the C5 isolation side-row empties (`G5 sees a glyph no other gated clause sees (dark-2)`): every faded G5one
plant now clears G3's bound. That is a gate-quality row, not the regression verdict, reding by accident. LAWS P8 §E (a
constant that admits a regression is a knob and a ballot variable): the 0.05 owes its caption with the cell it flips
(dark-2 at 0.95) or a re-cut. The lane's gap 3 names the slack as "a knob for the critic". It is one, and here is its price.

## 3 · The charter's rows, the critic's reading

| # | row | the lane's state | the critic's state, and why |
|---|---|---|---|
| 1 | control-anchored G14 bound; OPA80F/FADE80F as FILE plants red | closed | **closed on its plants, OPEN on the class.** Re-derived: clean fractions = the control's, 12/12 lines (chromium); OPA80F RED 4/4 on the clean verdict. Open: A1 (the control's identity is unasserted, so a self-anchored run reads a token regression against itself), A3 (the 0.05 slack admits OPA95F in dark-2 on the clean verdict; no banked plant pins it under +0.09) |
| 2 | G5 on a core low quantile; COMB reds; HEAD12F stays red | closed | **closed** (COMB RED 4/4 chromium, G5 among the clauses wherever G5 is gated, the lane's per-cell clause sets exactly) |
| 3 | a G5-only in-run plant so C5 bites; C1–C5 whole | closed in the dark cells | **partial, as the lane says** (G5-alone sets re-derived 8/2/0/0 chromium; `G5_BITES = theme === "dark"` at `:815` is a lane-keyed gate of the assertion, declared) |
| 4 | G3 clamped | closed (the chair's fold) | **closed** (`boundOf` clamps at a reference ≥ 0.95; every bound on this sheet ≤ 0.867, so the clamp is never exercised on the product — the self-test is its only witness) |
| 5 | the G4 tolerance rule out of the lane's reader | closed | **closed** (`lowsOf` gone; `tolerate: control.g4Lows` inside the ONE probe) |
| 6 | B-FORK arm (a) framed at N = 7, or the chair's ruling cited | OPEN | **OPEN** — neither: no frame, and CHAIR-RULINGS pass 9 has no B-FORK ruling. v8 §2.16's list ("and nothing else") excludes it, so the lane could not have spent the headroom; it is the chair's, but it is not closed. The lane's own re-read moved the number (×1.21–1.25 light against pass 8's ×1.16–1.19) with no account of why |
| 7 | LOBBY_ARIA_ONLY's behavioural pair | closed | **OPEN on the class** — PLUSSPLIT (the line over three text nodes) is GREEN (§1) |
| 8 | SELF's pass-9 cures by sha | closed | **closed** — by bytes (§0) and on the surface: `player-mark.spec.ts` whole on this tree, chromium, 19:07:58–19:11:33 (load 32 → 52), **exit 0, 22 passed, 1 skipped** (`:1116`, SELF's B3 drawn-roster row, the lane's gap 6); the 1024–1056 × 768 coarse sweep (`:658`) GREEN |
| 9 | carried | carried | carried; plus finding S1 (the replay route's stacked base is false) |

**Gap 5 confirmed on the union:** on `acde977b` + COUNT's delta (`2237e3d2`), `games/shared/DifficultyTally.vue` is
byte-identical to the bare WAVE's (`cmp` 0): 11 `frontGate`/`frontTween`/`poseFronts` sites, 0 `useTallyStrokes`; the
mark and the lobby import `useTallyStrokes` (4 files). The union ships two tally-stroke clocks, the declared coupling row.

## 4 · Constraints

- **M16** (`check-copy-register.mjs` on the tree, `guarded --light`): exit **0** ("0 em/en dashes and 0 unadmitted
  jargon"); its `--self-test` exit **0**. `check-theme-tokens.mjs --self-test` exit **0**.
- **Gates re-run bare by the critic** (`guarded --light`, 19:24–19:26, exits written per gate). On the tree:
  `typecheck:e2e` 0, `lint:theme-tokens` 0, `lint:copy` 0, `test:font-coverage` 0. On the union (`acde977b` + COUNT's
  delta, frontend `2237e3d2`): `typecheck:e2e` **2** (9 errors, all `e2e/zone-grammar.spec.ts`, the union's own),
  `lint:theme-tokens` **1** (`--tap-floor` ×2 at `ConfirmRibbon.vue:140/141`, T9-R10), `lint:copy` 0,
  `test:font-coverage` 0. The lane's §3 table reproduces on these four rows.
- **filterBudget 9**: `src/pencil/config/filterBudget.ts` is not in `74a2b5d9..3d5f368a` (byte-identical); the `src/`
  diff adds no live filter (its five `filter` lines are array `.filter()` calls and two comments). The lane's filter
  census re-read by the critic in chromium on the built dists: `e2e/filter-census.spec.ts` **6/6 passed, exit 0** on `:4242`
  (the tree's `index-hxS-Vg-9VUB2.js`) and **6/6, exit 0** on `:4260` (the control), 19:16–19:17:40 (G3.1 census equals
  `filterBudget.ts` exactly, G3.3 coarse, G3.5 hover ×2, G3.2 ×2). WebKit's census is the lane's.
- **The @property law**: one new registration in the tree, `@property --head-rule` (`<length>`, inherits, 0px) in
  `src/assets/index.css`, which is SELF's by sha (present in SELF's `04c8b7dc`), not COUNT's; COUNT adds none.
- **AA from painted bytes**: G14 is the AA row and it reads painted pixels on both trees (§1). Its T9-R8 cells print
  G2/G5 where the control fails them: chromium light-1 G2+G5 on all three lines, light-2 `.pl-qual` G2, dark-1 G2 on
  all three — the lane's printed set exactly. The quiet ink's own ceiling is 5.16:1 (every column core on the clean
  read is ≤ 5.16), so any whole-line fade past ~13 % takes the line under 4.5 on every pixel (OPA90F light: 1.000).
- **π, re-derived in chromium on BUILT dists** (19:12:57 on; the tree built out of tree into the critic scratch,
  `guarded`, exit 0, emitting **`index-hxS-Vg-9VUB2.js` — the lane's dist identity, byte-for-byte deterministic**; served
  by `vite preview` on `:4242` beside the control's `index-CubiZsMVSwTc.js` on `:4260`; the lane's `pi9.spec.ts` copied
  to the critic rig, exit **0**): noise **0** in all four cells; delta **156** (1280×800) and **155** (390×844), both
  themes — the lane's numbers. **One row per cell sits OUTSIDE the head, against the lane's "0"**: the tray's
  `ul.players-roster.sr-only` (`display: flex → block`, its 1×1 box 854,1101 → 853,1097 at 1280 and 16,1405 → 15,1402 at 390).
  It is SELF's, by sha (`GameControlPanel.vue` blob `d5cb8fcf` = SELF's = COUNT's pass 8: the tray roster is now always
  `sr-only`), and it paints nothing (an sr-only 1×1). So it is a declared-by-SELF, unpainted move, and the lane's
  classifier missed it. WebKit π: the lane's alone.
- **T9-R6 (utilities minted from e2e strings)**: `[data-lobby]:visible` is spelled 8× in this lane's
  `player-tally.spec.ts` and 1× in SELF's `player-mark.spec.ts`; `[data-player-mark]:visible` 1× each in
  player-tally, player-mark and `multiplayer.spec.ts`. The lane's claim (curing its own spec moves no shipped byte while
  SELF's strings stand) holds by the grep. Named, not cured, as the lane says.

## 5 · The real ±ε pair on the stated bound (chromium)

| job | slack | window · load at open | exit | per cell |
|---|---|---|---|---|
| SLK045 (bound − ε) | 0.045 | 18:50:37–18:56:02 · 48.8 (the guard held it for headroom; a foreign VS Code plugin host at 622 % CPU and CrowdStrike at 379 %) | **0, 4 passed** | every clean verdict holds; every in-run plant seen; G5-/G2-alone sets non-empty |
| SLK055 (bound + ε) | 0.055 | 18:56:06–18:57:37 · 20.2 | **0, 4 passed** | every clean verdict holds; every in-run plant seen; the sets non-empty — **the bound + ε plant does not red** |
| SLK20 (4× loosened) | 0.20 | 18:57:41–18:59:15 · 26.1 | 1, **3 passed / 1 failed** | light-1, light-2, dark-1 GREEN (light-1's bound reads **1.017** — G3 cannot fire there; the clamp keys on a reference ≥ 0.95 only); dark-2 reds on `G2 sees a fade no other gated clause sees (dark-2)` — the C2 side-row ACTIVATES because the bound crossed 0.5 (`:1062`, `bound > 0.5`), and dark-2 has no G2-alone hair fade. No regression clause, no plant-seen row and no clean verdict reds |

**So the stated bound is pinned by nothing in the run.** Bound − ε holds (as it must), bound + ε holds, and four times
the slack holds everywhere except one cell, where a side-row's activation condition flips. The lane's ±0.005 rows
pinned the comparator at the control's fraction (A2), never the 0.05. A LAWS P8 §F threshold row is OPEN for G14: it
owes an in-run plant whose fraction sits within ε above the control-anchored bound, per cell (a graded whole-line fade
such as the critic's `opacity` ladder, read against the control's fraction), that reds at bound + ε by G3 alone. The
clamp is also cut on the reference, not on the bound: at any slack > 0.05 a reference under 0.95 can still carry a
bound above 1.0 (1.017 above). `min(b, 1 − ε)` on every bound would close it.

## 6 · What the lane's return states that the critic could not reproduce, or that is mislabelled

- BANKED.txt / README §9 step 1: "delta on acde977b (+ SELF's delta) exit 0" and the stacked replay route. **False as
  written** (S1: exit 1, 44 error lines); the delta is cut on `acde977b` alone.
- README §2 "Threshold sabotage … `G14_SLACK` ±0.005 around the stated 0.05": the job sets the slack TO ±0.005 (A2).
- Spec `:960` "THE BOUND'S EDGE, read in the run": the pair is cut at the line's own fraction ± 0.005, which sits 0.05
  BELOW the bound; it pins the comparator, not the bound (A2).
- Gap 3 "at +0.005 the G5- and G2-alone sets empty … G3 then sees every isolating plant": true of slack 0.005 (a tenth
  of the stated slack), not of 0.05 + ε. At 0.055 nothing reds (SLK055).
- Row 7 "closed": cured for PLUSF2's shape only (PLUSSPLIT GREEN).
- README §4 "delta rows outside the head: 0": one per cell sits outside it (the tray's `ul.players-roster.sr-only`,
  `display: flex → block`, SELF's by sha, unpainted). The classifier keyed on the head's ancestry and missed it (§4).

## 7 · The exact open gaps (the critic's, most binding first)

1. **A1 · G14's anchor is unasserted.** `controlReads()` reads the control's bundle and never asserts it. TOKENF reds 4/4
   against `:4260` and is GREEN 4/4 self-anchored (`TOKENF-SELF`, bundle empty). A masked fallback on the gate's
   precondition. The cure: assert the bundle is `index-CubiZsMVSwTc.js`, born-RED by a self-anchored run.
2. **A2/A3 · the stated slack (0.05) is pinned by nothing in the run.** SLK045 and SLK055 both exit 0, and SLK20 (4×)
   reds only by a side-row's activation flip in dark-2, with light-1's bound at 1.017. The lane's "±ε" rows move the
   slack to ±0.005 (A2). The FILE plants red at any slack in light and at ≥ +0.09 elsewhere. OPA95F's clean verdict is
   GREEN in dark-2 (A3). LAWS P8 §F's bound ± ε row is OPEN; LAWS P8 §E's knob caption (the cell it flips) is owed.
3. **Row 7 · the plus twin is cured for its plant, not its class.** PLUSSPLIT (the line over three text nodes) is GREEN.
   (PLUSATTR, the `::after attr()` disjunct, reds.)
4. **Row 6 · B-FORK arm (a) at N = 7 neither framed nor ruled.** The lane's own number moved (×1.16–1.19 → ×1.21–1.25
   light), unexplained.
5. **S1 · the replay route's stacked base is false.** The on-WAVE delta applies on `acde977b` ALONE (→ `2237e3d2`). On
   `acde977b` + SELF's delta it exits 1 (44 error lines, 26 shared paths). COUNT's and SELF's on-WAVE deltas are
   alternatives for §11's fold, not a stack. BANKED.txt and README §9 step 1 must say so.
6. **Row 3 · C5 bites in the dark cells only** (`G5_BITES = theme === "dark"`); C2 in light-2 only, C3 in dark-1 only,
   C4 3/4 WebKit (the lane's gaps 2 and 4, re-derived in chromium: G5-alone 0/0/8/2, G2-alone 18 at light-2, the only
   asserted G3-only plants `FADE80_fill` at dark-1).
7. **The G3 clamp keys on the reference, not the bound.** At ref < 0.95 a bound above 1.0 is reachable once the slack
   exceeds 0.05 (1.017 at SLK20). It is inert at the stated slack, but it is a gate a knob can blind.
8. **Gap 5 (union) · two tally-stroke clocks on the union** (`DifficultyTally.vue` keeps `frontGate`; the mark takes
   `useTallyStrokes`). Declared; blocked by CHAIR-RULINGS §6 until FIVE's row 1.
9. **π's "0 outside the head" is mislabelled** (§4, §6): chromium π on built dists re-derives the head's 156/155 and
   finds one row per cell outside it, the tray's `ul.players-roster.sr-only` (`display: flex → block`), SELF's by sha and
   unpainted. The return should name it. The filter census is re-derived 6/6 both dists (chromium). WebKit π is the lane's.
10. Carried, as the lane states them: check 8's FLOOR BAND; T9-R8; `--tap-floor` ×2 (T9-R10); SELF's B3 skip;
    T9-R6's `[data-lobby]:visible`/`[data-player-mark]:visible` utilities (the §-wide `@source not` line, the chair's);
    `proposed/glyph-pop.g5tol.diff`'s non-author run is now DONE in both engines (§10, §11): the fold condition is met.

## 8 · Incidents (self-declared)

1. **The first clean run failed to load its config** (18:39:42–18:39:49): the rig's `pw.config.ts` sits outside any
   `node_modules` tree (`Cannot find module '@playwright/test'`). No browser opened. Cured with a `node_modules` symlink
   to the lane worktree's own in the rig dir; the log was moved to trash and the run re-launched.
2. **My first WebKit waiter, stopped by me** (PIDs 98192/98197, mine, holding no lock) so the chromium chain and the
   WebKit column never overlap; the WebKit column was re-queued as ONE `guarded --exclusive webkit` call (`wk.sh`) whose
   jobs wait inside the lock for the chromium chain's sentinel.
3. **Foreign load**: the guard held SLK045 (18:50:20–18:54:35) and TOKENF (18:59–19:01) for headroom at 1-minute loads
   of 40–70 (VS Code plugin host 402–622 % CPU, CrowdStrike 379–578 %). No timing row is read here; every paint row
   opened at a load ≤ 48.8.
4. **CLEAN-SELF void** (§2): a stale planted sheet served after a `copy2` restore. Disk verified restored; the servers
   were cycled at 19:05:32 by recorded PID (cwd checked).
5. **A light, browserless compile check of the PLUSSPLIT plant** (19:06, between batteries): the plant written,
   Vite's transform of `PlayerMark.vue` read over HTTP (200; it carries the `<i>` VNodes and the `slice(1, -1)`), the
   file restored to `3adf42dd`. This proves the GREEN row read a plant that compiled and rendered.
6. Every plant restored and sha1-checked (`restored=OK` on every job); the work tree re-cut at 19:05:40 = `3d5f368a`
   (the bank).

**A note that softens A3 and does not close it.** The quiet ink's ceiling is 5.16:1, so a whole-line fill fade saturates:
the lane's own `G2win` ladder goes from 0.509 at 93.5 % fill to **1.000 at 93 %** (light-2 `.pl-state`). In the light
cells any whole-line fade past ~7 % therefore reds by G3 at any slack under ~0.5. The slack's value matters for PARTIAL
fades (a head, a tail, a middle band, a comb), and for the dark cells, where the ceiling sits higher: OPA95F passes there.
The ladder is the right shape for the ±ε row the law asks for (a graded fade read per cell), but it is excluded from the
"is seen" loop and asserted only as the C2 set. Cut to sit at the bound ± ε, it would be the threshold pair.

## 9 · The number and the verdict

**90 (from 89). ADVANCE.**

What earned the point: pass 8's holder is cured on the shipped surface. G14 is now a regression gate in the T9-R8
cells. OPA80F, COMB and the critic's own TOKENF and OPA90F red the CLEAN verdict 4/4, and the clean read equals the
control's to the third decimal on 12/12 lines. G5 sees COMB, C5 bites where it is asserted, `lowsOf` is gone, the clamp
is the library's, and SELF's sheet is GREEN on this tree. The lane re-read every number itself (attempt 4) and declared
ten incidents.

What holds it at 90, not more: the anchor that cures pass 8 is itself unasserted (A1, a masked fallback shown by
TOKENF-SELF); the bound it anchors is pinned by nothing in the run (A2/A3, with SLK055 and 4× GREEN); the plus twin is
cured for its plant, not its class (PLUSSPLIT); row 6 is neither framed nor ruled; and the bank's replay route is false
as written (S1). Each is small to cure, and each is the class law (registry-v8 §2.12) applied to this pass's own cures.
Not BANK: the family is alive and moving; its open rows are cut-sized, not structural. Not BLOCK: both banks apply-check
0 on `74a2b5d9` and on the WAVE (`acb9c08e`, and `acde977b` with the homes), the batch gate.

**Incidents 7–9 (after §9 was written):**
7. **The π run took `:4242` from the dev server** (19:12:57–19:17:52), holding a `CH.busy` sentinel that the WebKit driver
   waits on, so no WebKit row could overlap it. The dev server was stopped by recorded PID (cwd checked) and the dist
   preview stopped by its own PID at the end.
8. **The restored dev server's guard waited for headroom** (load 46–58, foreign). `pi.meta`'s `dev4242=200` at close was
   the dying preview, not the dev server. The WebKit driver now waits until `:4242` and `:4260` both answer before each
   job, and logs it (`servers.check`).
9. **Runs ahead of me on the `webkit` lock**: a glass-ui design run (`4311d068aa`, admitted 18:54:35, `--timeout 90`),
   then this lane's `wk.sh` (queued 18:47).

## 10 · The PROPOSED `g5tol`, a non-author run (CHAIR-RULINGS §9's fold condition)

`proposed/glyph-pop.g5tol.diff` applied (`git apply --check` 0, then for real) on a copy of homes v2's `e2e/lib` cut
from `3d5f368a` (`crit-PLR-COUNT/g5/`), run by the critic in chromium, 19:20:02–19:22:11, load 39 → 33:
- `--self-test`: **186 rows, exit 0** (homes v2 alone: 182, the lane's number).
- `GLYPH_SABOTAGE=g5tol`: **exit 3**, the four `#g-long g5tol HEAD12` rows read `same plant, tolerated → G5 RED ← a hole`
  (light/dark × DPR 1/2); the by-value arm holds (`deeper (8 %) → G5 RED`).
The lane's chromium claim reproduces on a non-author run. The WebKit half runs inside this lane's WebKit column (§11).
The clause would let G5 gate the light DPR 1 lines where the control fails G5 whole (gap 6's C5 light cells).


## 11 · WebKit, the critic's column (one `guarded --exclusive webkit`, admitted 19:30:14, load 30–38)

The column waited behind a foreign glass-ui WebKit run (incident 9). Inside the lock the driver calls Playwright direct
(a nested guard would deadlock on the flock), `--workers=1`, one job at a time, servers checked before each
(`logs/servers.check`), each plant sha-restored.

**CLEAN (19:30:33–19:33:27, load 34.6, exit 0, 4 passed).** The clean fractions equal the control's on **12/12 lines**
and equal the lane's WebKit table to the third decimal: light-1 0.814/0.816/0.814 · light-2 0.488/0.524/0.497 · dark-1
0.617/0.615/0.622 · dark-2 0.416/0.395/0.402 (`.pl-state/.pl-qual/.pl-more`), each bound = control + 0.05, the
style bundle equal to the control's on every line.

**The slack's in-run pin, WebKit (A2 sharpened).** WebKit's `G2win` ladder straddles the stated bound on four lines
inside the run itself: light-1 `.pl-state` rung 97.5 % reads control + 0.044 (unseen) and rung 97 % control + 0.051
(seen by G3); light-1 `.pl-qual` +0.048 / +0.058; light-1 `.pl-more` +0.037 / +0.056; dark-1 `.pl-more` +0.042 / +0.053.
That is the bound ± ε pair LAWS P8 §F asks for, already measured, and **nothing asserts it**: the "is seen" loop skips
`G2win_` rows (`:1041`), and the C2 row reads the ladder only on lines where G2 is gated and the bound exceeds 0.5,
asserting that the G2-alone set is non-empty, never that G3 sees rung 97 and misses rung 97.5. Every asserted G3-only
plant in this column (`FADE65_fill`, `FADE80_fill`, dark-1) sits at control + 0.378–0.383. The cure is one assertion
per straddling line: the rung past the bound is seen by G3, the rung inside it is not. In WebKit the in-run ladder
would then hold the slack inside (0.044, 0.051] on light-1 `.pl-state`. Chromium's clean read (`logs/clean-ch.log`) has
the same straddle: dark-1 `.pl-qual` rungs at control + 0.052 (seen by G3) and dark-1 `.pl-more` at + 0.048 (unseen),
light-1 `.pl-more` at + 0.048 to + 0.050 (unseen, at the bound). So SLK055's exit 0 (§5) is not for want of a rung
inside ε of the bound; it is for want of an assertion on the rungs already read.

**OPA80F, the pass-8 plant, WebKit (19:33:31–19:36:34, load 28.3, exit 1, 4 failed, `restored=OK`):** RED 4/4 on the
clean verdict (`.pl-state (<cell>)` thrown first), every line's fraction 1.000 against bounds 0.445–0.866, G3 on all
twelve lines. Per line: light-1 G3+G4 · G3+G4 · G3+G4+G5; light-2 G2+G3 · G3+G4 · G2+G3; dark-1 G3 · G3+G4 · G3;
dark-2 G2+G3 on all three. Their union per cell is the lane's WebKit table exactly (light-1 G3+G4+G5 · light-2
G2+G3+G4 · dark-1 G3+G4 · dark-2 G2+G3). Row 1's born-RED reproduces in WebKit.

**COMB, the pass-8 G5 plant, WebKit (19:36:38–19:39:49, load 30.7, exit 1, 4 failed, `restored=OK`):** RED 4/4 on the
clean verdict. Per line: light-1 G3+G4 · G3+G4+G5 · G3+G4+G5; light-2 G2+G3+G4+G5 · G3+G4 · G2+G3+G4+G5; dark-1 G3+G4 ·
G3+G4+G5 · G3+G4+G5; dark-2 G2+G3+G4+G5 · G2+G3+G4 · G2+G3+G4+G5. The per-cell union is the lane's WebKit table exactly,
and G5 is among the clauses in every cell. **G3's margin on COMB in light-1 is thinner in WebKit than in chromium**:
0.886/0.864, 0.876/0.866, 0.900/0.864, so **+0.010** to +0.036 over the bound (chromium +0.027 to +0.043). At a slack of
0.06, G3 would no longer see COMB on light-1 `.pl-qual`, and G4 and G5 would carry that line alone. That is the
second place the slack value matters inside the stated plants, and still nothing pins it (A2).

**PLUSSPLIT, WebKit (19:39:53–19:39:57, exit 0, 1 passed, `PlayerMark.vue` restored to `3adf42dd`):** GREEN, the
same hole as chromium. The row prints `shown: null` at N = 6 and N = 16 while its own in-run plant is seen (`5 plus 11`).
The plant is served (§8 incident 5's transform read; `od -c` in `logs/PLUSSPLIT.webkit.od.txt`, no `\u` escape).
Row 7 stays OPEN on the class in both engines.

**TOKENF, WebKit, against `:4260` (19:40:01–19:42:57, load 27.9, exit 1, 4 failed; `index.css` restored to
`175596b6`):** RED 4/4 on the clean verdict. Light-1 and light-2 read 1.000 on every line. Dark-1 reads
0.803/0.667 · 0.813/0.665 · 0.812/0.672. **Dark-2 is G3 alone, by +0.024 to +0.054**: 0.490/0.466 · 0.499/0.445 ·
0.481/0.452 (chromium dark-2: +0.053 to +0.088). So a ten-point regression of the quiet-ink token passes WebKit dark-2's
`.pl-state` at a slack of 0.075, and the whole cell at 0.105 (about 2× the stated value), with no other clause standing
behind G3. This is the plainest form of A2: the stated slack is the only thing between a real token regression and a
GREEN cell, and no row in the run pins it. The self-anchored twin (`TOKENF-SELF`, A1) is chromium-only; it reads the
anchor's identity, which no engine changes.

**The PROPOSED `g5tol`, WebKit, non-author (inside the same lock, 19:42:57–19:44:11, load 24 → 36):** `--self-test`
**186 rows, exit 0**. `GLYPH_SABOTAGE=g5tol` **exit 3**, the four `#g-long g5tol HEAD12 (cut 0..73.2)` rows read `same
plant, tolerated → G5 RED ← a hole` (light/dark × DPR 1/2). The control arm (`against the unplanted control → G5 RED`)
and the by-value arm (`deeper (8 %) → G5 RED`) hold. **The lane's claim reproduces in both engines on a non-author
run**, so CHAIR-RULINGS §9's fold condition for `proposed/glyph-pop.g5tol.diff` is met. The carried row in §7 item 10
is closed on this point.

**WebKit summary.** Five jobs and the g5tol pair, one lock, guard exit 0 (`logs/wk.guard.exit`), every plant
`restored=OK`. CLEAN equals the control and the lane on 12/12 lines; OPA80F, COMB and TOKENF red 4/4 with the lane's
clause unions; PLUSSPLIT is GREEN (row 7 open in both engines); g5tol reproduces. What WebKit adds: the slack is
pinned even less than chromium showed. The in-run ladder straddles the bound on four lines and is unasserted, COMB's
light-1 G3 margin is +0.010, and TOKENF's dark-2 cell rests on G3 alone at +0.024. The number does not move. A2 was
already the binding gap, and WebKit makes its cure concrete: one straddle assertion per line on rungs the run
already reads.

## 12 · Closing state

- **Unit, on the tree, `--maxWorkers=2`, one chunk at a time under the critic's `CH.busy` sentinel**: `src/pencil` 9 files / 81 tests,
  exit 0; `src/games/shared` 34 files / 429 tests, exit 0. Not the whole suite: the two chunks that hold COUNT's
  surface's neighbours (the tally's clocks and the shared row budget); the lane's 847 is not re-claimed here.
- **The tree after every plant** (19:44, after the WebKit column): a temporary-index `write-tree` reads **`3d5f368a`**,
  the bank. A mid-column read (19:38, COMB live) named `PlayerLobby.vue` +7 and nothing else. Every plant's restore is
  sha-checked in `logs/<job>.<engine>.restored`.
- **Listeners**: `:4242` (dev, PID in `logs/srv-4242.pid`) and `:4260` (control, `logs/srv-4260.pid`) were started by the
  critic and stopped at 19:44:38/39, each by the guard child of its recorded PID after a cwd check. No listener on either
  port, and no critic process remains (`ps`). The π dist preview was stopped at incident 7.
