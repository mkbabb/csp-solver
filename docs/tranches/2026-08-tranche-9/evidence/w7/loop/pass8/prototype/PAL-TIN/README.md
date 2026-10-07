# PAL-TIN · pass-8 prototype (§11c, the tin; PAL-WALK leads)

Work tree `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-2`. The base and π control are **`74a2b5d9`**. Nothing is committed. The tree started from the pass-7 bank plus the chair's `homes.diff` (`a1d8adeb`) and was advanced in place.

## Numbers first

Every row below ran on the final, unedited tree:

| file | sha1 |
|---|---|
| spec `e2e/peer-tin.spec.ts` | `e688d440` |
| gate `scripts/check-peer-tin.mjs` | `07e85589` |
| library `scripts/shape-census.mjs` | `bf5e8aa6` |
| `glyph-pop.mjs` | `07bca94b` |

### Charter rows

| row | reading |
|---|---|
| 1 B-TAPE vs HEAD same-index | The 10 keys, 360 rows (table below). **Light: 0 losses in 180 rows.** Dark: pink 0/36, teal 0/36, amber 0/36, violet 0/36 against same-index. **Green loses 10/36** (chromium DPR 1 only; min −0.103). For green, same-index *is* the best hue (137.5°). Against pass 7's best hue, pink loses 15/36 (min −0.310) and teal 15/36 (min −0.162), all chromium DPR 1. |
| 2 `--dist` through the regex-aware `stripJs` | The home stripper blanks **26 B (0.01 %)** of the shipped JS: one real `/* @__PURE__ */`. With `strip-regex` sabotaged, the entry chunk loses **14.31 %** from byte 185,750, vue-vendor **95.81 %**, and the bundle **26.21 %** overall, which is the critic's reading reproduced. The planted build `index-Bj_QgIoMD1j4.js` gives **5 `#ffb2f3` findings** (the 4 byte-exact bundler folds plus a `.join`), plus `oklch(from…)`, 3 minted `--color-peer-?-name`, `text-indigo-200` at ΔE 0.0111 and a second-tin table, and exits 1. The same bytes with `strip-regex` off give 0 findings from the entry chunk. The self-test plants `#ffb2f3` **inside the real shipped entry chunk** at bytes 971 / 7,787 / 108,885 / 217,448 plus a folded `.join`, and each reds. |
| 3 GATE 4 escapes + sabotage + behaviour | See the next table. |
| 4 §2b clean-tree G4 red | The **mechanism is named** (next section). Clean runs on the final sha: **chromium 6/6 and WebKit 6/6** (whole file ×1, §2b r2–r5 at DPR 1, §2b at DPR 2), each exit 0. `transient ≠ 0/0` in 1 of 864 rows, and that row stayed GREEN on G4 under the text-run clip. |
| 5 homes and bare exit | The spec imports `./lib/glyph-pop.mjs`, `./lib/paint-lib.mjs` and `../scripts/shape-census.mjs`. The gate imports `./shape-census.mjs`, statically. **A bare `npm run lint:tin` exits 0** on the tree and 1 on the control (script absent). TAIL12 is RED in both themes, both engines, 24/24 per engine. |
| 6 light ring pair as gate-2 row | The gate now **gates the ring arms**: light at `RING_FLOOR` 0.075 against the shipped green–teal **0.0769**, and dark at `MIN_DE` 0.1 against **0.1495**. The argument is written into the gate: at the ring pair's L 0.295 the five hues hold 0.10 only at L ≥ 0.380, and a ring never carries identity alone. The two ring controls (dark `#a8b6fe`, light `#263502`) each red. **The separation law goes to WALK as a diff**, `instruments/separation-law.into-walk-gate2.diff`, sha1 **`c8c129f7`**, 4,721 B. It passes `git apply --check` 0 on WALK's banked gate blob `bb15c9e1`. |
| 7 WebKit FADE80 | **Not 4/4.** Over 24 WebKit readings it is RED on G3 in 15 and GREEN in 9, and the split is deterministic over 5 runs. DPR 1: light B, light A0 and dark A0 red (G3 fraction 0.377/0.374, 0.372/0.362, 0.388/0.381 against the bound). Dark B stays GREEN (median ×0.889), and all four DPR 2 configs stay GREEN. FADE80 stays **printed** in WebKit. FADE65 is RED 24/24 in both engines and is required. |
| 8 roster n−1 + light-exemption premise | Roster n−1 at ten is **cited**, not re-run (W8's row). The premise holds: `nameInkOf` has one consumer, `GameBoard.vue:541`. On WALK's bank, the name is `--color-peer-name-ink` at `GameBoard.vue:1245`. |
| 9 from WALK | Taken: the per-payload G3 bound (`glyphGate`, clean + 0.05, `payload` required), and the hand-0 subject (A's own write, cells 14 and 16, read on B's page). **L6 in WALK's form was NOT run** (a gap). |

### Row 3: GATE 4

| reading | result |
|---|---|
| `g4attack8.sh` on a replica, final gate | clean 0 · **45/45 plants exit 1** (13 pass-6 + 20 pass-7 fresh + 12 own D41–D52) · clean again 0 · restored byte-equal |
| the same set on the pass-7 gate | 21 escaped: D23, 24, 25, 28, 29, 30a, 30b, 32–35, 39, 41, 42, 44–48, 50, 51 |
| gate self-test | **85 controls red** (90 with `--dist`), plus one GREEN control (a consumer, a concatenated consumer, a comment, a script helper `lab(…)`, a bundle's own sheet), exit 0 |
| gate sabotage battery `--sabotage-battery --dist` | **30/30 clauses red the self-test when deleted**: 21 gate clauses + 9 library clauses read through `SHAPE_SABOTAGE`. `channel-arity` bites by a throw (exit 1), not by a named control (exit 3). |
| library self-test | **97/97**, clauses planted 45/45. Library sabotage **45/45**. |
| born-RED on the homes seed (`--self-test --lib`) | **92/97**: the 5 new rows `fold-hole`, `fold-int`, `fold-text`, `tw-palette` and `channel-arity` fail, exit 1 |
| **BEHAVIOURAL row §2c** | Reads the painted core (pixels that moved ≥ 0.9 × top, ON vs OFF by stylesheet) of **the tape name and the tally tick** on the real surface, against the arm the cascade resolves, within `COPY_DE` 0.03. Clean: name ΔE **0.0000** light / **0.0102** chromium dark / **0.0000** WebKit dark, tick **0.0000** everywhere. Plants, each RED in both themes and both engines: another arm on the label (0.1262 / 0.2225–0.2234), another arm on the tick's stroke (0.1262 / 0.2234), and the arm 0.05 L darker by relative colour (0.0493 / 0.0501–0.0563). |

### Product rows (final battery)

- **Chromium DPR 1:** all 200 product rows read "RED G2" and are passed by the G2 rung. The rung is valid only where HEAD's same-index is also < 4.5, and it is.
- **Chromium DPR 2:** 40/40 GREEN. **WebKit:** 240/240 GREEN.
- **Plants:**
  - FAINT30, FADE65, TAIL12, TAIL35, HEAD12, MID20 and EMPTY: RED 24/24 per engine.
  - FADE80: RED 24/24 in chromium, printed-only in WebKit (row 7).
- **Readings:** `readings/plants-tally-final-battery.txt` and `logs/final-battery/*.txt` (12 logs, all `spec sha1 e688d440`).

### Node battery, tree | control (`logs/node-battery.txt`)

- **0 | 1:** lint-tin, gate-bare, gate `--dist`, gate self-test `--dist`, library self-test, library sabotage.
- **0 | 0:**
  - copy-register, lint:copy, lint:lanes, lint:theme-tokens, lint:sleep, lint:ink, lint:motion, lint:tdz
  - test:e2e:projects, check-pw-projects
  - property-block source and dist
  - **eslint, prettier, knip**
  - typecheck e2e and node
- **1 | 1 (inherited):** `lint:bands` and `lint:verbs`, the missing-script error on both sides.
- **Units:** cited from the arF archive run (`vue-tsc -b` 0; vitest 68 files, 838 tests, 0 failed). Since then `src/` changed by one JSDoc line only (`useSession.ts`: `@public` for knip).
- **dist:** the final build equals the product-only build byte for byte (`diff -rq` 0): `index-OjJxZB3ljh7A.js` / `index-aaNZWoto1P9b.css`, no `antialiased`.

## B-TAPE vs HEAD same-index: the ten keys (PAL-WALK leader duty)

HEAD's `inkFor` at `74a2b5d9` is `oklch(var(--peer-ink-l) 0.11 i*137.5)` with band 0.5 light / 0.8 dark. The same-index ink for `peer-k` is index k−1: amber 0°, green 137.5°, teal 275°, violet 52.5°, pink 190°. The "best hue" is pass 7's reading of HEAD's most favourable hue.

Each key has 36 rows: chromium and WebKit × (DPR 1 ×5 runs + DPR 2 ×1) × cells 11/12/8.

| key | tree median range | HEAD same-index median range | Δ same-index min / median / max | losses | Δ best-hue min / median / max | losses |
|---|---|---|---|---|---|---|
| light peer-1 | 2.122–12.486 | 1.828–5.609 | +0.235 / +4.615 / +6.877 | 0 | +0.353 / +5.013 / +7.419 | 0 |
| light peer-2 | 2.066–12.026 | 1.742–5.067 | +0.284 / +4.619 / +6.959 | 0 | (= same-index) | 0 |
| light peer-3 | 2.074–11.924 | 1.790–5.410 | +0.267 / +4.334 / +6.514 | 0 | +0.327 / +4.585 / +6.857 | 0 |
| light peer-4 | 2.302–13.143 | 1.804–5.454 | +0.498 / +5.530 / +7.689 | 0 | +0.527 / +5.812 / +8.076 | 0 |
| light peer-5 | 2.253–12.890 | 1.646–4.808 | +0.607 / +5.540 / +8.082 | 0 | +0.491 / +5.442 / +7.823 | 0 |
| dark peer-1 | 2.954–6.806 | 2.328–5.416 | +0.626 / +1.146 / +1.390 | 0 | +0.193 / +0.697 / +0.878 | 0 |
| dark peer-2 | 2.773–7.282 | 2.751–5.928 | **−0.103** / +1.292 / +1.354 | **10** | (= same-index) | **10** |
| dark peer-3 | 2.712–7.353 | 2.392–5.578 | +0.320 / +1.641 / +1.775 | 0 | **−0.162** / +1.295 / +1.425 | **15** |
| dark peer-4 | 3.004–6.920 | 2.362–5.560 | +0.642 / +1.274 / +1.360 | 0 | +0.244 / +0.942 / +1.019 | 0 |
| dark peer-5 | 2.614–6.561 | 2.460–5.955 | +0.154 / +0.446 / +0.606 | 0 | **−0.310** / +0.478 / +0.633 | **15** |

Every loss is chromium DPR 1 dark. Chromium DPR 2 and WebKit at either DPR lose nothing in any key. All 360 rows are in `readings/btape-same-index-every-row.txt`, and the per engine·DPR breakdown is in `readings/btape-same-index-ten-keys.txt`.

**What the pairing changes:** pass 7's pink and teal "losses" were against the best hue. Against the same index, the ink those players actually got at HEAD, they win in all 72 rows. The one real same-index loss is **dark green**, whose HEAD same-index ink is the best hue: 10 of 15 chromium DPR-1 rows, worst −0.103. That is B-TAPE's named loss.

## Row 4: the mechanism of §2b's clean-tree G4 red

The plants are `instruments/mech.paltin8.spec.ts`, and the logs are `logs/row4-mechanism-{chromium,webkit}.txt`.

- **The mechanism.** The pass-7 reader took its population over the whole label box, not the text run.
  - Any colour-bound non-glyph paint after the tick, such as FAR8 (an 8 px low-contrast box), enters the population as far-right columns.
  - Unclipped, those columns read 1.25 light / 1.30 dark (chromium), which reds G4. WebKit shows the same.
  - With the home's text-run clip, the same frame is **GREEN** (outside-run 120–126).
  - Clean chromium dark even reds a left column (1.56) unclipped, and is GREEN clipped (outside-run 8).
- **Refuted.** The critic's tally-svg hypothesis: the tick's stroke is `var(--color-user-ink)`, not `currentColor`, so it does not move between ON and OFF.
- **Blinks** are excluded: BLINK gives `transientOn 6` and does not enter G4.
- **Deterministic.** The clip is the fix, and the `outside-run` count is printed on every row as its plant.

## Gaps first

1. **Row 7 is not met.** WebKit FADE80 reds 15 of 24, not 4/4, deterministically. It stays printed, not required. Requiring it in WebKit would need a G3 bound under 0.005 of clean, and I did not tune the gate to the plant.
2. **Row 9's L6 in WALK's form was not run on this tree.** WALK's check 5 lives in WALK's gate, `check-peer-arcs.mjs`, which is not in this tree.
3. **The separation law reds WALK's walk.** WALK's bank gate with TIN's whole law applied (room 5; digits, rings, names) exits 1:
   - `--color-user-ink`: 0.0264 light / 0.0268 dark
   - `--color-peer-cursor-ink`: 0.0182 / 0.0170
   - `--color-peer-name-ink`: 0.0182 / 0.0194

   WALK's bank alone (room 2) exits 0. Watch 2 stays **HALF MET**, and the diff is handed over, not applied (`logs/walk-gate-with-tin-law.txt`, `logs/walk-gate-bank.txt`).
4. **Dark green loses to HEAD's same-index ink** in 10 chromium DPR-1 rows (worst −0.103). This is a named loss, not a pass.
5. **The library diff is PROPOSED, not landed.** `instruments/shape-census.tin8-fold-text-tw-palette-arity.PROPOSED.diff` is sha1 `973dc19f`, 18,358 B, and passes `git apply --check` 0 on the homes copy `5b8739d5`.
   - It adds the clauses `fold-hole`, `fold-int`, `fold-text`, `tw-palette` and `channel-arity`, and the `foldText` export.
   - The tree carries it applied, so the fold must land it into the one home.
   - `channel-arity` was found this pass: the spec's own `lab(want)` made the library's `parseColor` throw inside the gate. Prettier reflowed the library, so this diff supersedes the earlier cut.
6. **Roster n−1 at ten** is cited only (W8).
7. **Units** were not re-run on the final tree (one JSDoc line since).

## Replay route

None needed: this is one tree, advanced in place, not a merge. To replay:

1. Run `git archive 74a2b5d9`.
2. `git apply pass8.diff`.
3. Browser rows:
   - Copy `instruments/pw.paltin8.mts` to `web/frontend/.paltin8/pw.mts`.
   - Serve on 4245 with `instruments/vite.dev.mts`.
   - Run `instruments/final-battery.sh`, which calls `instruments/spec.sh`.
   - Then run `instruments/btape.py` on its logs.
4. Node rows: `instruments/node-battery.sh`.
5. GATE 4 attacks: `instruments/g4attack8.sh`, on an rsync replica, never on the tree.

§11c is not a merged section, so the integrated-tree check is not owed.

## Bank

`pass8.diff`:

- sha1 **`9f0ea6b9`**, 509,486 B, 27 files changed, 10,644 insertions(+), 83 deletions(−).
- Base `74a2b5d9`, tree `15df98f1`.
- Passes `git apply --check` 0 on a fresh archive. The applied archive is `diff -rq`-equal to the tree, apart from ignored build outputs.

`pass8-delta-homes.diff`:

- Taken against `74a2b5d9 + pass7.diff + homes.diff`.
- sha1 **`c2681a73`**, 108,708 B, 5 files changed, 1,150 insertions(+), 498 deletions(−).
- Passes `git apply --check` 0.

Both were cut through a temporary index with `--binary`, product paths only (`BANKED.txt`).

At return, the tree's `git status` shows product files only: 18 M and 5 untracked product paths. The dev server on 4245 (PID 84809) was stopped by PID after its cwd was checked. **Frames: none**, so none of ruling 18's headroom is spent.

## Incidents

1. **A write to `/tmp/null`** (a stray `> /tmp/null`). It was moved to the scratch trash, and nothing else was written outside scratch or evidence.
2. **Batteries killed and relaunched by PID, three times.**
   - The first two were to edit the spec and scripts.
   - The third was after the `channel-arity` find. The node battery and browser battery had started on library `54657fb8` and gate `ca4da5b5`, and I edited both mid-run. Both runs are void and archived in scratch.
   - Every number above comes from the relaunch on the unedited tree.
3. **An earlier sabotage battery ran while the scripts were being edited.** Void.
4. **Tailwind contamination.**
   - *Inherited:* pass 7's bank shipped `.antialiased` (82 B) from a spec comment. The pass-7-cited `index-BRQ9Cl7IHzwm.js` / `index-5okW5wT62AcM.css` are contaminated.
   - *This pass:* my own scratch config `.paltin8/pw-mech.mts` minted `.row-4{grid-row:4}` into one intermediate build. It was caught by the byte-compare against the product-only build, and the scratch was moved out. The final dist equals the product-only build.
5. **An inherited knip red from pass 7** (`withSelfInk` unused-export). Cured with `@public` and its reason.
6. **Orphaned browser helper processes** (ppid 1) could not be attributed to this lane, so they were left alone. A Playwright tree and `spec.sh` that were mine were killed by PID.
7. **`git init` ran in scratch dirs** to cut the library diff. Scratch only, never the tree or the control.
