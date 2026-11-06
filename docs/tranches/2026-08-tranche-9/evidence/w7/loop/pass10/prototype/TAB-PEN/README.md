# TAB-PEN · pass 10 · §12 the tab's pen — the prototype's return

Lane: `.claude/worktrees/wf_b6676cd9-8c6-17` (HEAD `1d0dc4fd`, the §12 waiver standing: 0 `src/` bytes moved).
Batch 6. Ports 4233 / 4256 reserved and never opened (no browser row ran). The number is the critic's; this lane
does not score itself. Pass 9's critic's 82 stands until a critic reads this bank.

## Numbers first

| row | reading |
|---|---|
| open | temp index over the tree = `5c95b0a4` = pass-9 BANKED.txt's tree: **agrees** |
| homes v3 | `homes.on-WAVE.diff` `0723d508` applied `--3way`, exit 0, 10 paths → `0c486172`; equal to `1d0dc4fd` + `homes.diff` `07257854` on all 14 home paths: **0 residual home edits** |
| bank | `pass10.diff` 117,589 B sha1 `9f18a7e4fe5c…`, 14 files +2,622/−19, base `1d0dc4fd` + homes v3 (`13895fbb`) → `ead2b86f` · `pass10.delta.on-WAVE.diff` 127,439 B sha1 `ad6badcfa04f…`, 7 files +1,612/−1,277, base `954bbbab` + homes.on-WAVE (`8c46d9de`) → `6f6a512a` |
| apply --check | **0** on `1d0dc4fd` (+homes) → `ead2b86f` = the tree · **0** on `74a2b5d9` (+homes) · delta **0** on `954bbbab` + homes.on-WAVE and **0** on bare `954bbbab` (BANKED.txt) |
| the tie's CLASS (row 1) | the pass-9 critic's 12 plants + NN0, and 3 new property plants: **15/15 RED, NN0 GREEN** on the gate; `icons --check` the same 15/15 RED, NN0 exit 0, side by side (`logs/class-plants.txt`) |
| born-RED, same run | the pass-9 gate (`5c95b0a4`) against the same 16 plants: see §1 and `logs/bornred-p9.txt` |
| self-test | exit 0 · **74 RED** as required · **8 GREEN** (negative-negatives) · **23 EDGE + 3 CUT PINNED** · 0 FAILED |
| `--threshold-battery` | **52/52 BITE**, exit 0 (46 edge moves + 6 cut moves) |
| `--sabotage-battery` | **60/60 BITE**, exit 0 (50 gate checks + 10 library clauses) |
| disjunct battery | **18/18 BITE** + control exit 0 (the critic's 14 re-pointed at the split, plus IoU cut, reach, the two new reads and the near mask) |
| the gate's size (row 5) | `check-favicon.mjs` **1,881 → 857** lines; `selfTest()` **594 → 90**; the plant table to `check-favicon.plants.mjs` (555); self-test, EDGES, CUTS and batteries to `check-favicon.self-test.mjs` (716). The ESTATE grew **1,881 → 2,128** (+247: three cut rows, three disjunct plants, two headers) |
| the WAVE's two reds (row 7) | `lint:motion` and `check-pw-projects` check 6: **1 → 0** on the tree and on the materialised union |
| union reads (`6f6a512a`, materialised) | `check-favicon` 0 · self-test 0 · lint:motion 0 · check-pw-projects 0 · lint:lanes 0 · lint:copy 0 · typecheck:e2e 0 · knip 0 · eslint 0 |
| tree reads | the same nine, each 0 (`logs/`); prettier --check 0 on the four scripts (e2e/ is out of the format gate by design) |
| the twin (row 4) | code landed; **UNREAD both engines** (zone ≥ 8M, below) |
| row 6 (B's G4 repaint) | **UNREAD** (zone) — not landed |
| π | **not re-read, carried**: 0 bytes of `src/`, `public/`, `index.html` moved since pass 9's bank (the step touches `scripts/`, `e2e/`, `package.json`, `ci.yml` only), so pass 9's 45/47 byte-identical vs `1d0dc4fd` stands for the same build inputs |
| AA | **not re-read, carried**: the icon's bytes are pass 9's (`icon.svg`, `apple-touch-icon.png` unchanged); pass 9's glyph-pop W 8/8 vs control 6/8 stands for those bytes |
| unit battery | **not run**: `~/.claude/guard/ZONE-ARMED` present (owner guidance: no new long battery), and no `src/` byte moved |
| box | 1-min load 4.75–7.0 across every row (logs carry `uptime`); zone `inuse` 8,759,128 (14:19) → 8,833,953 (14:52) |

## 0 · Gaps first

1. **Every browser row is UNREAD.** `tail -1 ~/.claude/guard/log/zone.log` read 8,759,128 at open and 8,833,953 at
   the last read, over the 8,000,000 floor, with `~/.claude/guard/ZONE-ARMED` present. Unread, by name and engine:
   `e2e/tab-pen.spec.ts` (the twin: clean × 2 schemes × 3 instants, 22 plants, the 11-clause battery) on the tree and
   on the control, chromium AND WebKit; row 6's two consecutive WebKit 16 DPR1 reads of arm B; every frame. **The
   owner must reboot** before any of them opens.
2. **The twin's new code is unexecuted.** It typechecks (typecheck:e2e 0) and lints (eslint 0), nothing more. Two of
   its assumptions are untested: (a) a PNG served as `application/octet-stream` still loads as an image (P-ctype's
   exactness rests on it); (b) the parser's own link insertions are delivered while `readyState` is `"loading"`
   (else the clean row reds `mutation`). Either failing is a FAILED row, not a red the gate admits.
3. **The CSP rides the twin's route, not a preview config.** The charter asks for `public/_headers`' CSP "served by
   the twin's own preview config". The twin reads the `/*` block's policy and puts it on the document response
   itself, on the tree and the control alike. Only the document's policy governs the icon's loads, but it isn't the
   letter of the row.
4. **`icons --check` is STRUCK as a CI reader**, not wired: no linux-runner reading of its exact-zero match can be
   taken from a lane (no push). The gate alone now reds the class, so the step isn't needed for row 1; CI is unchanged.
5. **The IoU cut's `want` side has no plant of its own.** One cut, `CUTS["e.png-tie"]`, binarises both sides; its CUT
   row moves `got` (400 isolated whole-coverage pixels at 1 − (0.5 ± 0.01)). The analytic `want` can't move without
   moving the path; the disjunct row `tie union: want disjunct` bites (P3 and the IoU CUT row both FAIL).
6. **Row 5 is half-met.** The gate shrank (1,881 → 857) and `selfTest()` with it (594 → 90). The estate didn't: +247
   lines. A critic may read "the gate SHRINKS" as the estate.
7. **Row 6 is not landed** (T9-B28's caption stays README text, §6), and **M19** stays on the RUNSHEET (§7).

## 1 · The tie, at its class (row 1) — born-RED in one run

The colour clauses read EVERY pixel. `e.png-paper` is the max ΔE to the light paper over every pixel off the pen's
support dilated by `CUTS["e.png-reach"]` (1 px): a tint, a box at any coverage, one dot, wherever it sits. It
subsumes the charter's paper median (max ≥ median) and its "any component off the dilated path" blob (one pixel
is enough). `e.png-ink` (was `e.png-darkest`) is the max ΔE to the light ink over every pixel the pen covers whole,
eroded 1 px: a re-inked stroke reds however many dark pixels it keeps. Both bounds 1 (clean reads 0.000 and 0.000;
pass 9's paper bound 2 passed T14 at 1.879). The fringe between keeps mean |Δ|, IoU and the in-path blob.

Same run (`logs/bornred-run.txt`, box 6.39 → 6.46), the driver `class-plants.mjs` (the pass-9 critic's
`crit9-plants.mjs`, its 12 plants and NN0 verbatim, plus P1–P3 and `icons --check` side by side):

| plant (180 × 180) | pass-9 gate `5c95b0a4` | pass-10 gate `ead2b86f` | `icons --check` max Δ | pass-10 paper / ink max ΔE |
|---|---|---|---|---|
| NN0 the shipped pixels re-encoded | 0 GREEN | **0 GREEN** | 0 (exit 0) | 0.000 / 0.000 |
| F35@0.45 · F40@0.30 · F38@0.35 · F30@0.49 (grey boxes) | 0 · 0 · 0 · 0 GREEN | **1 · 1 · 1 · 1** | 108 · 72 · 84 · 118 | 33.9 · 22.2 · 26.0 · 37.2 / 0 |
| D8 · D10 (opaque 4 × 4 dots) | 0 · 0 GREEN | **1 · 1** | 241 · 241 | 84.1 / 0 |
| T14/0/−14 · T24/0/−24 · T0/−10/+20 (paper but pixel 0) | 0 · 1 · 0 | **1 · 1 · 1** | 14 · 24 · 10 | 1.879 · 3.161 · 3.019 / 0 |
| K5/15/45 · K0/10/70 · K60/20/10 (re-inked, darkest kept) | 0 · 0 · 0 GREEN | **1 · 1 · 1** | 35 · 60 · 50 | 0 / 7.25 · 12.27 · 12.69 |
| P1 one pixel at coverage 0.25, bottom row middle | 0 GREEN | **1** | 60 | 18.4 / 0 |
| P2 a 6 × 6 paper hole inside the stroke | 1 | **1** | 241 | 0 / 84.1 |
| P3 paper but pixel 0 tinted (7, 0, −7), T14 halved | 0 GREEN | **1** | 7 | 1.028 / 0 |

The pass-9 gate passes 13 of 15 visible marks (the critic's 11 of 12 reproduced, plus P1 and P3); the pass-10 gate
reds 15 of 15, and NN0 stays GREEN on both. `icons --check` agrees on every row on this host; its linux-runner
exact-zero is unread, so it's struck as a CI reader (gap 4). P3 sits 0.028 past the bound by construction: the
paper bound's own edge rows (§2) pin it at ±0.05.

## 2 · Every cut inside tie() pinned, every bound margined (row 2)

`tie()` now has no unnamed literal. `CUTS = { "e.png-tie": 0.5, "e.png-blob": 0.5, "e.png-reach": 1 }` sits beside
`BOUNDS`; each cut has a CUT row whose plant is built AT the row's own literal ± ε/2 (never read from `CUTS`), so a
battery that moves the cut by ε flips one side:

| CUT row | plant | past | inside | `--threshold-battery` |
|---|---|---|---|---|
| `e.png-blob` 0.5 ± 0.01 | 17 horizontally adjacent whole-coverage pixels at coverage 1 − t (one 4-connected strip) | RED e.png-blob | GREEN | up 0.02 BITE · down 0.02 BITE |
| `e.png-tie` 0.5 ± 0.01 | 400 whole-coverage pixels at even x, even y (none 4-adjacent: the blob stays 1) at 1 − t | RED e.png-tie | GREEN | up BITE · down BITE |
| `e.png-reach` 1 ± 0.5 | ONE ink pixel at Chebyshev distance 2 (past) / 1 (inside) from the pen's support | RED e.png-paper | GREEN | up 1 BITE · down 1 BITE |

The margins, printed by the gate on the clean tree: paper max ΔE **0.000** vs ≤ 1 · ink max ΔE **0.000** vs ≤ 1 ·
mean |Δ| **0.0010** vs ≤ 0.02 · IoU **0.9942** vs ≥ 0.97 · blob **0** vs ≤ 16 · coverage in [0.18, 0.32].

The edge plants are shaped to the PROPERTY (LAWS P9's estate rule, the critic's spec-cites-itself):
- `e.png-paper` has TWO edge rows: the paper moved on **every paper pixel but pixel 0**, and the paper moved on
  **one pixel** (the bottom row's middle, off the path, away from pixel 0). A pixel-0 read fails the first; a
  median read fails the second. Both PINNED at 1 ± 0.05 (past 1.00236 RED, inside 0.999451 GREEN).
- `e.png-ink`: the whole stroke re-inked **with the clean PNG's darkest pixel kept**. A darkest-pixel read can't pin
  it. PINNED at 1 ± 0.05 (past 1.0014, inside 0.999629).

## 3 · The disjunct battery (row 3): 18/18 BITE

`disjunct.mjs` (this directory): each row edits one disjunct, cut or read in a copy of the split gate (beside copies
of `check-favicon.self-test.mjs`, `.plants.mjs`, `icons.mjs`, `shape-census.mjs`) and runs its self-test with
`--root` the tree. Each anchor matched exactly once. `logs/disjunct.txt`, box 5.83 → 4.96.

| row | exit | the self-test row that catches it |
|---|---|---|
| d.arm path · d.arm width | 2 · 2 | P6, C1, C3 · P3 |
| d.pin sha · d.pin width | 2 · 2 | C8-T1 · T3 |
| e.link-icon ok · href | 2 · 2 | C7, C7c, C7d · C14 |
| e.link-touch ok · **href** | 2 · 2 | C7b, C8-E6, C8-E6b · **D1** (new: the one touch link pointed at /thick.png) |
| e.png-size **w** · **h** | 2 · 2 | **D3** (179 × 180) · **D2** (180 × 179), both new |
| tie union got · want | 2 · 2 | E5 + EDGE e.png-tie · P3 + CUT e.png-tie |
| **blob cut 0.5 → 0.95** | 2 | CUT e.png-blob (past GREEN) — the pass-9 HOLE |
| IoU cut 0.5 → 0.6 · reach 1 → 3 | 2 · 2 | CUT e.png-tie (inside RED) · CUT e.png-reach (past GREEN) |
| paper read → pixel 0 only | 2 | both EDGE e.png-paper rows + CUT e.png-reach |
| ink read → the darkest pixel only | 2 | E5 + EDGE e.png-ink |
| near mask cov > 0 → cov > 0.5 | 2 | CUT e.png-reach (inside RED) |
| unmodified copy (control) | 0 | — |

## 4 · The twin (row 4): written, unread

`e2e/tab-pen.spec.ts` (368 lines, from 284), on the tree and on the WAVE:
- **CSP**: reads `public/_headers`' `/*` block's Content-Security-Policy and puts it on the `/` document response
  of every context, clean and planted, tree and control (an empty read is a FAILED row). Gap 3 above.
- **As the UA loads it**: each live icon link is loaded with `new Image()` under that policy (img-src); a new clause
  `img` reds anything but `load` with `naturalWidth > 0`. `fetch()` stays for content type and sha (connect-src).
- **Three instants**: hydrated (+400 ms), late (2,000 ms after `load`, so a 1.5 s write is inside), toggled (the
  in-app `button[aria-label^="Switch to"]`, pressed, +400 ms). A clean row whose toggle isn't found is RED.
- **The observer** is the init script itself, at document start: attribute writes at any time, link
  insertions/removals once `readyState` leaves `"loading"`. A module-evaluation write is now inside it (X4).
- **New plants**: X1 `img-src 'none'` (exact `[img]`: fetch still 200), X2 the re-point at 1,500 ms, X3 the re-point
  on the toggle, X4 a same-origin module script re-pointing as it evaluates; P-origin now lets example.com into its
  own policy (so it stays exact `[origin]`); P-ctype moved to the touch icon as `application/octet-stream` (exact
  `[ctype]`, gap 2a), the SVG `text/plain` case kept as `>= [ctype]` (an SVG with the wrong type can't load as an
  image, so it reds `img` too). 22 plants, 11 clauses, each clause with a sole exact plant.
- Lines: `PRM: live, because …` at the head (lint:motion's roster, §5).

## 5 · Row 5 (the gate's size) and row 7 (the WAVE's two reds)

**Row 5.** `scripts/check-favicon.mjs` is the gate alone: header, BOUNDS, CUTS, the five clauses, `tie()`, the
PNG decoder, `readTree`, and `run()` behind a main-module guard. `scripts/check-favicon.self-test.mjs` imports it
by relative path and holds the self-test, EDGES, CUTS and both batteries. `scripts/check-favicon.plants.mjs` is the
plant table as a fixture: `plants(t)` takes its helpers in `t` and imports nothing. `npm run lint:favicon` is now
`node scripts/check-favicon.mjs && node scripts/check-favicon.self-test.mjs` (lint:lanes reds a gate that only an
import reaches, so both files are named; the plants file carries `NOT-A-LANE:` as a fixture). ci.yml's comment
re-counted (74 + 8 plants, 23 edges, 3 cuts, 50 + 10 sabotage ids, 52 moves); the step itself is unchanged.

| file | pass 9 | pass 10 |
|---|---|---|
| `check-favicon.mjs` | 1,881 | **857** |
| `selfTest()` | 594 | **90** |
| `check-favicon.self-test.mjs` | — | 716 |
| `check-favicon.plants.mjs` | — | 555 |
| the estate | 1,881 | 2,128 (+247) |

**Row 7.** Both reds were the lane's own, present on the lane tree too (not only union-born):

| check | tree before | tree after | WAVE + pass-9 bank + this step without the cure (scratch `acba18e9`) | the union `6f6a512a` |
|---|---|---|---|---|
| `check-motion-contract --self-test` (lint:motion) | **1** (`tab-pen.spec.ts: NO motion declaration`) | 0 | **1** | 0 |
| `check-pw-projects --self-test` check 6 | **1** (`tab-pen.spec.ts: on disk, NOT in SPEC_MANIFEST`) | 0 | **1** | 0 |

Cures: a `// PRM: live, because …` declaration at the spec's head (the twin measures no frame), and
`"tab-pen.spec.ts"` in `SPEC_MANIFEST` (sorted after `sudoku-interaction`). The spec carries no engine skip and no
env gate, so it needs no HOLDOUTS row; check-pw-projects reads 0 with it in both engines' lists.

## 6 · Row 6: T9-B28's caption (not landed)

The caption is unchanged from pass 9's proposed text, and stays README text: landing it needs B's G4 cost
REPAINTED (two consecutive WebKit reads at 16 DPR 1), which is a browser row and is UNREAD (gap 1). What it must
carry when it lands: arm A (WIDTH 4) the default; arm B (WIDTH 5) priced at WebKit 16 DPR 1 G4 1.67 / 1.85 (pass 8's
single reading, to be replaced by the repaint); the FADE80 slack (6/8 GREEN) cited to the glyph-pop home's
`bound 0.425` on a clean fraction of 0.341–0.389, not to TAB-PEN.

## 7 · M19 (on the RUNSHEET, re-cut)

Still unread by any instrument here, all four: a real browser tab's favicon at 16 px (not headless), Safari's
in-SVG `prefers-color-scheme` query, an iOS home-screen web clip from `apple-touch-icon.png`, Chrome's favicon
service cache across the rename. Each is an owner's-device row. Nothing in this pass moves them.

## 8 · Constraints

- **π**: carried, not re-read (numbers table). `src/` 0 bytes, so the §12 waiver stands.
- **filterBudget 9**: `public/icon.svg` unchanged (0 filters); `src/` empty in the diff.
- **M16**: no UI copy moved; `lint:copy` 0 on the tree and the union.
- **Frames**: none shot. Headroom spent: 0 B.
- **Instruments, by relative product path**: the gate and the twin import no home (`../scripts/icons.provenance.json`
  and `../public/_headers` are read as files); the class-plant, born-RED and disjunct drivers are evidence scripts in
  this directory, run with the tree's `web/frontend` as argument. No import from `docs/` in any product file.

## 9 · Replay route

- On `1d0dc4fd`: `git apply pass10/instruments/homes.diff` (`07257854`), then `git apply pass10.diff`
  (`9f18a7e4`) → `ead2b86f` (also 0 on `74a2b5d9` the same way → `5dc0a731`).
- On the WAVE: `954bbbab` + `git apply pass10/instruments/homes.on-WAVE.diff` (`0723d508`) → `8c46d9de`, then
  `git apply pass10.delta.on-WAVE.diff` (`ad6badcf`) → `6f6a512a`. The delta touches no home path and also checks 0
  on bare `954bbbab`.

## 10 · Incidents (self-declared)

1. `git apply --3way` under a fresh temporary index refused every home path ("does not match index") until
   `git update-index --refresh`; nothing was written by the refused run.
2. The pass-10 step's `package.json` and `check-pw-projects.mjs` hunks carry `1d0dc4fd`'s context, which the WAVE
   doesn't have. The on-WAVE tree was built with `-C1` for `package.json` (one line) and a blob edit for the
   manifest line; the banked delta is then re-cut from that tree with full context and checks 0, so `-C1` is not
   in the replay route.
3. The kernel zone read ≥ 8M from open to return, with ZONE-ARMED present: no browser row, no long battery.
4. A `git archive` scratch lacks the `docs/precepts` gitlink; the materialised union equals `6f6a512a` blob for
   blob on every other path (0 diffs).
5. No server was started; ports 4233 and 4256 were never bound by this lane.

Log names: `logs/selftest-final.txt` and `logs/threshold-final.txt` are the split files' runs (exit 0, 52/52,
box 5.97 → 7.08); `selftest-presplit.txt` and `threshold-presplit.txt` are the same gate before the split (identical
counts but for D1–D3); `sabotage.txt` ran on the split (60/60). Union reads: `logs/union-*.txt`, `union-reads.log`.
