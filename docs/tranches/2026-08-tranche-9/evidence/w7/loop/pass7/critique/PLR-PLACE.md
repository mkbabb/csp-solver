# PASS-7 CRITIQUE · PLR-PLACE · Places at the board (§11)

Adversarial. I didn't write the charter or the prototype. Base and π control `74a2b5d9`. Work tree
`.claude/worktrees/w7-p4-PLR-PLACE` (uncommitted; `git diff --shortstat` 30 files +4,133/−406 at open and at
return; `PlayerMark.vue` `ed75fd82e2fc`, `App.vue` `8d11da55e25c`, `player-place.spec.ts` `54dbbffe586d`, the
sha1s the lane's battery printed). HEAD control: the shared `w7-control` dist, verified by its asset hash
`index-CubiZsMVSwTc.js`.

**CONVERGENCE: 87 (pass 6: 84). VERDICT: ADVANCE.**

The pass does what the charter asked on the board it measured. The key is read again at rest, and the yield
now keeps its promise. I reproduced both on my own copy of the tree, both engines, and added three cells the
lane didn't read. Row 15 is a real born-RED. The kill table reproduces to the hundredth, the dist rebuilds to
the cited identity, and the product diff replays 29/29 byte for byte.

What holds the number down is a board the lane never opened. **The chart is drawn at a fixed pitch (32/3 px a
cell), so at 16×16 it's 170.66 px square, not 96.** Under the shipping default, the sheet then laps the board
on every phone I read, including the 430×932 phone where the 9×9 chart laps nothing, and on the 1280×800 desk:

| 16×16, two at the table (chromium / WebKit) | chart (ships) | list | yield |
|---|---|---|---|
| 390×664 coarse | **169.30 / 169.61 px, 88 cells** | 17.53 / 17.84, 11 | = list |
| 390×844 coarse | **79.30 / 79.61, 44 cells** | 0 | = list |
| 430×932 coarse | **55.30 / 55.61, 30 cells** | 0 | = list (the 9×9 yield draws the chart here) |
| 812×375 coarse | **297.03, 26 cells** | 145.27, 12 | = list |
| 1280×800 fine | **184.33 / 184.63, 20 cells** | 32.63 / 32.92, 4 | = list |
| 1920×1080 fine | 0 | 0 | = chart (drawn, 0) |

LAWS P5 (§E) asks for "the widest board's copy (16×16) at 812×375". The ballot's kill table, the chart's named
LOSS, and `App.vue:757–759`'s "The chart costs the sheet +77.11px at every cell" are all 9×9 readings. At 16×16
the cost is **+151.76 px** (257.03 against 105.27), and the kill condition at 390×664 is 88 cells against 11.
The yield's promise does hold there (it equals the list on every 16×16 cell where the chart would lap), so the
mechanism isn't what's broken. What's broken is the owner's ballot: it understates the default's cost by half.

## 0 · What I ran myself

My rig. The work tree was never written.
- A byte-copy of the tree: rsync of `web/frontend` into `scratchpad/crit7plc-tree/`, with `node_modules` and
  `csp-solver` symlinked. `diff -rq` reads `src/` and `e2e/` identical to the tree, and the five sha1s equal
  the lane's. Every arm and plant was a const or listener edit in this copy, applied and restored by
  `plant.py` with the sha1 printed.
- Servers, killed by recorded PID (listener + npx parent):
  - dev `:4236`: the copy, cacheDir in scratch
  - control dist `:4237`: `w7-control` through its own `.vite-control.config.ts`, verified `index-CubiZsMVSwTc.js`
  - my rebuilt dist `:4238`
  
  All three ports read free at return.
- A second, clean copy for the gates (`crit7plc-gate`), and `git archive 74a2b5d9` for the control's gates.
- Box load: 1-min 40–60, with 189–237 node/playwright/vitest processes. No timing row is gated. The rest
  times below are readings only.

| # | what | chromium | webkit |
|---|---|---|---|
| KILL 9×9 | 390×664 n2 coarse (witnessed), payload `ATMuMTk3NjA0NT…` read back on A and B, B pinned `p-0000000b0b0b` | chart 182.38 · **94.64** · 21 · list 105.27 · **17.53** · 7 · yield = list | chart **94.95** · 21 · list **17.84** · 7 · yield = list |
| KILL 16×16 (new) | six cells × three arms (table above) | as above | as above |
| RSZ (the lane's cell) | chair's `openThenResize`, 390×860 → 390×664 n2 | chart: at rest 94.64 / 21 = fresh · **yield: at rest 17.53 / 7, no chart = fresh** | chart 94.95 = fresh · yield 17.84 / 7 = fresh |
| RSZ (new cells) | 430×932 → 390×664 n2 coarse · 1920×1080 → 1280×800 n2 fine | yield 17.53 / 7 = fresh · yield 32.63 / 2 = fresh (chart 109.67 / 4 = fresh) | 17.84 / 7 · 32.92 / 2 (chart 109.97 / 4); all 12 `agree: true`, rest 82–189 ms |
| ROW 15 | `player-place.spec.ts` row 15, both cells | clean chart ✓✓ · YIELD ✓✓ · **REFIT ✓ n2 ✘ n3** · **YIELD+REFIT ✘✘** | the same four verdicts |
| QUIET (new) | open at 390×860 n2, read every ~4 s for 115 s while B sits still, then reopen (ran under the chart arm, K1) | row height 22.39 throughout (B's qualifier went to `no cell shown` at 48 s), lap 0, open = fresh | the same |
| DIST | rebuilt from the copy, cacheDir and outDir in scratch | **`index-Dv42FUUJJNi4.js`, 43 files, 920 KB** (the cited identity) | |
| FILT | `filter-census.spec.ts` | my dist 12/12 · control dist 12/12 (exit 0 each) | |
| REPLAY | `git diff --binary -- web/frontend` on a fresh `git archive 74a2b5d9` | 29 files +4,131/−406, 247,799 B, sha1 `c94f15eee4ce`, `git apply --check` 0, **29/29 `cmp`-identical** | |

Gates, run bare. The tree column is my gate copy and the control column is `git archive 74a2b5d9`:

| gate | tree | control |
|---|---|---|
| `lint:copy` (check-copy-register) | 0 | 0 |
| `lint:lanes` | 0 | 0 |
| `lint:theme-tokens` | 0 | 0 |
| `lint:sleep` | 0 | 0 |
| `test:e2e:projects` | **1**: check 8 only, chromium 272 / 214, webkit 270 / 212 | 0 |
| `eslint .` | 0 | not re-run by me |
| `npm run lint` | 0 | not re-run by me |
| `check-property-block --fe` + `--dist` on my dist | 0 (43 registrations, stamp `Dv42FUUJJNi4`) | — |
| undefined-token census (pass-6 copy) | 1: 0 bare in TIMING slots, 2 bare `--tap-floor` (`PlayerMark.vue:544/545`, the admitted A.3 row), STALE `--refuse-dur` (inherited). Net GREEN under A.1 r4, as in pass 6 | — |

Not re-run by me: π whole-DOM, painted AA, the GHOST / E4 / TOUCHEND / SEAM_A / REACH plants, vitest, the
leader's estate files, r0's law-probe. The lane's readings for these print the sha1 pair (`breaks.txt` start ==
end == the files at return). I read those readings, but I didn't reproduce them.

## 1 · Defects the prototype did not see

### 1.1 The widest board was never read, and the ballot understates the default's cost by half (both engines)

`PlaceChart.vue:43` holds the pitch (`PITCH = 32 / 3`, the pass-2 ruling "the pitch is held, not the box"), so
the chart grows with the board: 42.67 px at 4×4, 96 at 9×9, 170.66 at 16×16. The lane's 16-cell census and
its ballot read 9×9 only, and LAWS P5 §E names the 16×16 read. At 16×16 the sheet is **257.03 px tall** under
the chart arm, against the list's 105.27. See the headline table: 88 cells at 390×664, 44 at 390×844, 30 at
430×932, 20 on the 1280 desk.

Three texts are 9×9-true and 16×16-false:
- `App.vue:757–759`: "The chart costs the sheet +77.11px at every cell". At 16×16 it's +151.76.
- The ballot's chart LOSS ("laps the board on every phone ≤ 844 tall, on the tablet, and on desks up to 1536
  wide"). At 16×16 it also laps the 430×932 phone.
- The yield's LOSS ("drawn on only 3 of 16 cells"). At 16×16, 430×932 loses the chart too, so of my six 16×16
  cells only 1920×1080 draws it.

The yield's mechanism is sound here: in every 16×16 cell it equals the list or draws the chart at lap 0.

To close: put the 16×16 rows (and one 4×4 row) in the B-CHART table, name the board size in the `App.vue`
comment, and restate both LOSS sentences with these figures. A 16×16 frame pair isn't owed if the table
carries it. The owner is choosing a default that costs 88 cells on a phone.

### 1.2 PlayerLobby's comment still says the page root hears the tap

`PlayerLobby.vue:57–62` wasn't touched this pass. It still says: "the mark shuts it (its `@click`, which
falls through to this root) and the page root's `closeAll` hears the same tap." With `@touchend.prevent` on
the sheet (pass 7, row 5b), a touch on the sheet sends no click, so the root hears nothing. The sheet shuts
from `onSheetRelease`. The behaviour is harmless: `claimHeadDisclosure` keeps one head sheet open at a
time, so `closeAll` would have had nothing else to close. But the law in the comment is now a different
mechanism's. To close: re-word it to name `onSheetRelease` and the prevented `touchend`.

### 1.3 The measured key has no content trigger (a watch, not demonstrated)

`fit()` runs on open, on `people.length`, on `resize`, and on a `transitionend` outside the head. Nothing
re-fits when a row's own height changes while the sheet is open, for example a qualifier (`no cell shown`,
`N seconds ago`) that wraps a long slug to a second line (+20.79 px, the lane's own floor). I tried the
natural case: 390×860 n2, 115 s, both engines. B's row went to `no cell shown` at 48 s and kept its 22.39 px
height. The lap stayed 0, and the open sheet equalled a fresh open. So nothing is demonstrated with these
slugs. With the 29-character slug the lane priced, it's reachable in principle. I book it as a watch, not a
gap.

## 2 · What is earned (reproduced by me)

- **The re-fit at rest works** (charter row 1). On the lane's cell, the yield at rest reads 17.53 / 17.84 over
  7 with no chart, equal to a fresh open, in both engines. I added two cells:
  - 430×932 → 390×664, width and height together
  - 1920×1080 → 1280×800 fine, the desk

  Both agree in both arms and both engines (12/12 `agree: true`).
- **Row 15 is a born-RED on the final file** (LAWS P6 §F). The plant is both re-fit listeners struck. It
  reds n3 alone under the chart arm, and both cells under YIELD, in both engines. Clean, it's 4/4 under the
  chart and 4/4 under YIELD. n2 can't red under the chart arm, and the lane says so in the row's comment.
- **The yield dominates the list on every cell I read**, the lane's 16 and my six 16×16 cells alike. Deciding
  on the list's pose and then comparing covered AREA on both axes (`covered(dressed) > covered(pose)`) is the
  right primitive. By construction it can't lap more than the list.
- **The kill table reproduces to the hundredth**: 94.64 / 94.95 over 21 against 17.53 / 17.84 over 7, on one
  payload read back per page.
- **The frame is lawful and framed where the arm differs** (LAWS P6 §C). I looked at it. Top: chart | yield
  at 664 (the yield is the list's pixels). Bottom: yield | list at 860 (the yield is the chart's pixels). One
  payload, one const, B pinned, 41,095 B, and it retires pass 6's crop 1 by name.
- **The identity chain holds.** I rebuilt the dist to `index-Dv42FUUJJNi4.js` (43 files, 920 KB). The filter
  census is 12/12 on it and on the control, and `check-property-block` on its served CSS is 0. The product
  diff replays 29/29 byte for byte on a fresh `74a2b5d9`.
- **M16 is 0.** No product string was added this pass (`lint:copy` 0).

## 3 · Open gaps (each closable, numbers attached)

1. **THE KILL CONDITION, the owner's (U-10).**
   - 9×9 at 390×664: chart 94.64 / 94.95 over 21 against list 17.53 / 17.84 over 7.
   - **16×16 at 390×664: 169.30 / 169.61 over 88 against 17.53 / 17.84 over 11.**

   It stays open until the owner disposes.
2. **The 16×16 board is missing from the ballot and from the cost comment** (§1.1). The chart arm laps:
   - 390×844: 79.30 / 79.61, 44 cells (list 0)
   - 430×932: 55.30 / 55.61, 30 (list 0)
   - 812×375: 297.03, 26 (list 145.27, 12)
   - 1280×800: 184.33 / 184.63, 20 (list 32.63 / 32.92, 4)

   `App.vue:757–759` says +77.11 px "at every cell", and the 16×16 cost is +151.76. To close: restate the
   B-CHART table, both LOSS sentences, and the comment with the board size named.
3. **The leader's landed rows `player-mark.spec.ts:510` and `:569` are RED under the shipping default** (the
   lane's reading, both engines: 390×800 lapped 7 against 0). They're GREEN under the list and the yield. This
   is the chart's cost, and it's the owner's.
4. **The outside band is priced, not cured.** In Chromium `hasTouch`, 1–3 px below the edge shuts the sheet
   and reaches nothing, and row 14 pins it. The RUNSHEET line (real finger, M19) is owed to the owner.
5. **Painted AA of the names is RED in light**: 2.972 / 3.009, fraction under 4.5 0.637 / 0.701 (the lane's).
   The control's roster reads the same ink at 2.713 / 2.443. This is §11c's ink and T9-R8's rung, the estate's
   row.
6. **Check 8, FLOOR BAND**: chromium 272 / 214, webkit 270 / 212 (reproduced). The control is 0. The restamp is
   the chair's.
7. **SELF's pass-7 defects arrive with the graft** (not re-proven by me, booked to SELF):
   - The cramp predicate keeps `board.left <= tall.rowsStart` as a lone disjunct (`PlayerMark.vue`, `fit`),
     which is SELF's 712×800 cliff.
   - `clickOwed` is never forgiven in WebKit: no click follows a prevented tap, so the next press-less
     activation is swallowed.
   - The landed four-band row reads light only.
   - The desk laps 4 cells, not the 2–3 its comment says.
8. **`PlayerLobby.vue:57–62` describes a dismissal path the pass removed** (§1.2). To close: a re-word.
9. **INTAKE-22 row 48 is half open.** The 390×664 and short-landscape laps are measured and closed by number.
   "The 430 sheet-top delta (+12 from the foot, −32.79 from the deal row)" is OPEN: it's §10's, read on
   `s10`. INTAKE-23 §4 has no PLR-PLACE row.
10. **Unrun by anyone this pass:** C2, S1, G1, G10, the relay arm (env-gated), goldens, real iOS (M19), π on a
    room, and a 16×16 frame. I also didn't re-run π, AA or the lane's GHOST / E4 / TOUCHEND / SEAM_A / REACH
    plants (see the lane's `breaks.txt`, sha1 pair equal).
11. **No `BANKED.txt` beside `pass7-delta-final.diff`** (LAWS P6 §C). The figures are in the README instead.
    The delta is `diff -ru` checked by `patch --dry-run`, not `git apply --check`. The chair's bank at the
    fold supplies this. The product diff I cut (sha1 `c94f15eee4ce`) is the one to bank.

## 4 · Failure-mode checklist

| tell | hit |
|---|---|
| vacuous convergence | no |
| spec cites itself | no |
| gates that cannot fail | **PARTIAL, declared.** Row 15's n2 cell can't red under the shipping chart arm (n3 carries the chart arm, and n2 carries the yield). I reproduced both born-REDs. The yield's "never laps more than the list" is a census reading, not a landed row, which is fair for an unshipped arm |
| **elegant-reduction trap** | **YES.** "The chart costs the sheet +77.11px at every cell": the reduction is 9×9's. At 16×16 the chart is 170.66 px and the cost doubles (§1.1) |
| legacy aliases | no (the old one-axis `laps()` is deleted; `NAMES_OVER_CELLS` is SELF's one const) |
| masked fallbacks | **inherited.** With no board box, `fit()` returns tall with the chart drawn (`bare` false, early return). Not demonstrated on a live page |
| **unverified gestalt** | **PARTIAL.** The 9×9 arms are framed lawfully. The 16×16 chart, the default's worst case, has never been photographed or tabled for the owner |
| consumer-less substrate | no |
| generic default | no. The frame shows a hand-drawn sheet, a box-pitch chart and swatch rows: no cream and terracotta, no eyebrows, no numbered markers |
| π (the undeclared pixel) | not re-run by me. The lane's 62 = the pass-6 critic's classified set, on the pass-7 dist (whose identity I reproduced) |
| **constraint it forgot** | **YES.** LAWS P5 §E's 16×16 read. CLEAR: filterBudget (12/12 on my rebuilt dist and the control), M16 (0), the @property law (0 source and served), the undefined-token census (0 in timing slots), W2's mechanics (untouched), the decided history (the lane's r0 L1–L6 GREEN on both; not re-run by me). AA is the estate's row (gap 5) |

## 5 · Ballots and fork rows

- **OWNER, B-CHART (U-10)**: three arms on one payload (crop 1), plus the 16×16 rows this critique adds.
  - Chart (ships): 9×9 at 390×664 laps 94.64 over 21 cells. **16×16 at 390×664 laps 169.30 over 88**, at
    430×932 55.30 over 30, and at 1280×800 184.33 over 20. It reds the leader's `:510` / `:569`.
  - List: 17.53 over 7 (9×9) and 17.53 over 11 (16×16) at 390×664. 0 at 390×844 and 430×932 for both boards.
  - Yield: the list wherever the chart would lap, and the chart where it's free, at both board sizes.
    **LOSS:** the chart draws on 3 of 16 cells at 9×9 and 1 of 6 at 16×16.
  - The frame for 9×9 is crop 1. The 16×16 case is a table row, not a frame.
- **LEADER (PLR-SELF)**: your area-keyed test (`covered(dressed) > covered(pose)`) closes your one-axis disjunct
  at the root. Consider it for `cramp`: take `short` when it covers less of the board than `tall`.
- **CHAIR**:
  - Check 8's restamp.
  - The RUNSHEET lines (both sides of the edge; the tap on the open sheet keeps the keyboard on your cell).
  - Bank the product diff `c94f15eee4ce` with a BANKED.txt.

## 6 · Cross-pollination

1. **A sheet whose content is sized by the board reads the widest board.** Any figure written "at every cell"
   names its board size. That includes COUNT's tally on a 16×16 room and anything else sized by
   `useBoardShape`.
2. **Decide on the cheaper pose, then add only what costs nothing.** The yield's shape (the list decides, and
   the chart is drawn only if the overlap AREA doesn't grow) is a clean two-axis primitive. SELF's `cramp` and
   COUNT's corner could take it whole.
3. **A measured regime has three triggers, not two**: space (resize, rest) and content (a row that grows
   while open). Name the third or state why it can't fire.

## 7 · Incidents (the critic's own)

- **K1: a broken plant script ran two readings unplanted.** I added the REFIT entry to `plant.py` through an
  unquoted heredoc. `\n` became a literal newline, and the script failed to parse. Its stderr wasn't captured
  in the run log, so three steps in run 2 ran on the unplanted copy (sha1 `ed75fd82e2fc` printed beside them):
  - "quiet-yield" and "kill16b yield" were the CHART arm.
  - "row15 refit-chart" was a second clean run.
  - "row15 refit-yield" was YIELD only.

  I caught it when a "yield" read drew the chart at 16×16 390×844. I rewrote `plant.py` with a quoted heredoc
  and checked it with `ast.parse`, then re-ran the break and the 16×16 yield/list cells in run 3, where every
  plant printed its sha1. Only run 3's plant verdicts are cited. The quiet probe is cited as the chart arm; the
  yield's pose at that cell is identical (chart drawn, 182.38, lap 0).
- **K2: my first kill run used `require` in an ESM spec.** The three 16×16 cells threw `ReferenceError` in run
  1. I fixed it with imports, and those cells were re-read in runs 2 and 3.
- **K3:** the filter census ran concurrently with my census runs, on separate servers. It's a count, not a
  timing row.
- No `rm`, no git in the control, no commit. The work tree was never written: `git status` shows 30 paths and
  the three sha1s unchanged at return. My scratch is `scratchpad/crit7plc-*` (the copies, configs, dist, logs,
  base archive), and it's the chair's to clean. I moved one scratch PW config out of my gate copy to
  `scratchpad/trash-crit7plc-gate-pwf`. Banked here: `critique/PLR-PLACE/instruments/` (crit.spec.ts,
  pw/pwe configs, plant.py as re-written, run1–3 and filt scripts, vite configs) and `readings/` (kill,
  resize, row15-breaks, quiet, dist-filters, gates). No crop was banked.
