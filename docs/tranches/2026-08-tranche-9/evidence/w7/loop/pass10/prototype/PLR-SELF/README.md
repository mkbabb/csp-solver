# PLR-SELF · pass 10 · prototype (§11, batch 1)

Lane tree `.claude/worktrees/w7-p4-PLR-SELF` at `74a2b5d9`, advanced in place, nothing committed. Lane dev
`127.0.0.1:4241`, own control preview `127.0.0.1:4259` (the shared `w7-control`, dist `index-CubiZsMVSwTc.js`).
The WAVE side is a `git archive` of `8c46d9de` (= `954bbbab` + homes v3's on-WAVE step, archive tree `72b7ad67`)
under the lane's durable scratch, with its own `git init` and a READ-ONLY alternates line onto main's object
store (so `lint:bands`' B6 can read `74a2b5d9`; no object was written to main's store from it).

## 0 · Numbers first

| row | reading |
|---|---|
| open state | the tree cut through a temporary index reads `7fb4bdf0`, diff sha1 `013f21bb` 620,680 B, 39 files = `pass9-substrate.diff` byte for byte (BANKED.txt's "tree (with ledger)"). No difference. |
| homes v3 | `homes.on-WAVE.diff` sha1 `0723d508` applied plainly (`--3way` refused: the 10 home files are untracked in the worktree's real index, which I never touch): exit 0, 10 paths. All 13 home paths now equal `74a2b5d9` + `homes.diff` `07257854` (tree `ac862f1e`) blob for blob. Residual home edits of mine: **0**. |
| B-ROSTER | FOLDED by the chair (homes v3 `CHAIR-FOLD.md`, pick 10). The four-band row no longer skips: `DRAWN_FRAMES` and `DRAWN_PLANTS` are NAMED imports, `drawn: 'head-sheet'`, no typed `thick`/`thickTol` (the library throws on both), and every regime carries THIN_1PX + `P055_0.825px`. |
| roster absence (born-RED, no browser) | `DRAWN_FRAMES` renamed in `edge-bands.d.mts`: `tsc -p tsconfig.e2e.json` exit **2** (`TS2724 … no exported member named 'DRAWN_FRAMES'` at `player-mark.spec.ts:36`), clean **0**. Renamed in a lib copy: the spec's named import exits **1** (`SyntaxError … does not provide an export named 'DRAWN_FRAMES'`), clean copy **0**. Restored by sha1 (`shasum -c` OK both files). |
| roster pins | `authoredStroke` on the lane tree and on the WAVE: head-sheet 1 site at 1.5, tray-well 4 sites at 1.5, `why` empty on both. On the control: tray-well 4 × 1.5; head-sheet RED by absence (`HeadSheet.vue unreadable (ENOENT)`), a red reading, never a throw. |
| B-INK-RUNG on the WAVE | `lint:bands` B2 **cleared**: `presenceInkMs` EXEMPT at `ms: 400` with the chair's cite (pass10/CHAIR-RULINGS §11). Bare exits: WAVE `1` (B2 presenceInkMs, B6 no `74a2b5d9` in the clone, B11 `useSession.ts:1118` PLACE_SETTLE_MS, B13 ×2 `MarginNote.vue:314` / `gridPaths.ts:737`, the NN REGRESSED ×2) → WAVE + delta `1` (B11, B13 ×2 only; B2 and its NN regression gone; B6 green once the alternates line lets it read `74a2b5d9`). |
| lint:verbs on the WAVE | the two self-admitted rows STRUCK (`color … --ease-standard #1` signature, `0s #1` prm). The mark's colour turn names `var(--verb-layDown-ease)`; its PRM zeroes the length token (`--presence-ink-dur: 0s !important` in the reduce block) instead of a `transition-duration: 0s` declaration. Admissions 36 → **34**, stale 0, laundering 0, **no PlayerMark.vue finding**. The gate still exits 1, on PLACE's `PlayerLobby.vue:142/:143` only (present on the bare WAVE: not mine). |
| sabotage, WAVE seams | 6/6 plants red their own finding, restored by sha1: EXEMPT struck → B2 red + STALE; EXEMPT `ms: 401` → "an exemption licenses ONE value"; member 401 → the same; curve back to `--ease-standard` → `PlayerMark.vue:685 … a transition names a verb`; `transition-duration: 0s` back → `PlayerMark.vue:778 no verb names its curve`; the prm admission re-added → "admits … which is not there any more" (stale 1). Clean: neither gate names PlayerMark or presenceInk. Table: `readings/sab-wave.tsv`. |
| lint:copy | lane 0 · WAVE + delta 0 (no UI string added). |
| lint:sleep | lane 0 · WAVE + delta 1 = the bare WAVE's 3 findings byte for byte (`count-yield:302`, `note-reserve:305/:357`, SIX's and LEDGER's); none in `player-mark.spec.ts`. |
| shape-census / theme-tokens | `shape-census --self-test` lane 0 · WAVE + delta 0. `check-theme-tokens --self-test` WAVE 2 → WAVE + delta 2, output byte-identical (wash reach, not this delta's). |
| typecheck | `vue-tsc -b` lane 0 · WAVE + delta 0. `tsc -p tsconfig.e2e.json` lane 0 · WAVE + delta 0 (after one shim line, `declare module 'node:os' { loadavg }`, in `e2e/node.d.ts`). eslint 0 / 0 on the touched files; prettier 0 / 0 (e2e/ is prettier-ignored). |
| unit | `rowBudget.test.ts` lane 8/8 (light, single file). |

## 1 · Gaps first (open at this bank)

1. **No browser row was read** (§5): every e2e reading of this pass's rows, both engines, tree and control and
   WAVE + delta, is UNREAD behind the machine-wide browser queue. The roster's four-band row, the keyed `:546`
   budget, the area witness and the far-edge row are written, typechecked and linted, never run.
2. **The plants that need a browser are UNREAD** (§3): THIN_1PX/P055 on the real surface, the area witness's
   threshold pair, `PHONE_CELLS`, the far-edge floor and CUT arm, the dev-only SKIP on a dist.
3. **π, AA, dist identity: by construction only** (§7); no build ran.
4. **The full unit battery did not run** (§9 incident 2): two single files only.
5. **The off-roster drawn frames** (`bar-frame` and one unclassed 1.5 px HandDrawnOutline in the union's
   `GameControlPanel.vue`) are read by nothing; §6's surface, carried.
6. **The tray-well consumer reds** on control and tree alike (homes v3: site 1's bottom band under `div.action-bar`);
   control-born, §6's surface, cited not re-read.
7. **Union rows still red, not §11-mine**: `useSession.test` U3/U5 (TIN × WALK); `lint:verbs` `PlayerLobby.vue:142/:143`
   (PLACE); `lint:bands` B11 `PLACE_SETTLE_MS`, B13 ×2 (§7/§13); `lint:sleep` ×3 (SIX, LEDGER); the eleven COUNT rows
   under the chart arm (ruled, COUNT re-authors in batch 4); `player-tally:1479/:1312×2`, `peer-tin:928/:965` (priced).
8. **COUNT's tally-stroke admission** (`stroke var(--presence-ink-dur) var(--ease-standard) #1`, "PROVISIONAL") still
   stands in VERB's ledger; it is PLR-COUNT's row, not withdrawn by me. Its PRM now rides the zeroed token too.
9. **`--tap-floor` at `PlayerMark.vue:676/:707`** (union): T9-R10's reading, recorded by the chair, not cured.
10. Carried: check 8 FLOOR BAND, T9-R8, B-NAMES unframed (no crop: no browser), real iOS (M19).

## 2 · The charter's seven rows and the critic's twelve gaps (what moved, what holds)

| # | row | state at this bank |
|---|---|---|
| 1 | the drawn roster in the ONE library, thickTol refused, 0.55× plant, tray-well consumed, absence RED | **CLOSED in the lane's half.** The roster folded at batch 0 by the chair (homes v3, pick 10: thickTol and a typed thick throw; `DRAWN_TOL` a literal 0.9). The four-band row's `test.skip` is gone; absence is a load-time red (born-RED above); THIN_1PX and P055 ride every regime. The tray-well consumer is the library's own `--roster tray-well` (homes v3 §1, the chair's fold), not a row of mine: the instruments lane read it exit 1 / 1 on control and tree, both engines, equal verdicts (site 1's bottom band occluded by `div.action-bar`) — a control-born red on a §6 surface, cited, not re-read. The two off-roster 1.5 px HandDrawnOutlines on the union (`bar-frame`, one unclassed) stay off the roster and keep the law's 1.80: no row of mine reads them (gap 3's second half OPEN, §6's surface). |
| 2 | the key's area clause | **unreachability STATED WITH ITS NUMBER and gated**, the clause kept (PLACE's yield on the union calls the same predicate). `drawSheet` now reads `below` = the board's bottom minus the drawn sheet's bottom; `areaMoot` asserts `below > 0` on every one-row cell of the `:546` row, the KEY_CELLS row and the 1024–1056 sweep, and the KEY_CELLS row prints the least `below`. Where it is > 0 the clause reads exactly as `laps` (proof in `rowBudget.ts`'s header): B-NAMES arm (a) is captioned "any lap takes one row". LAPONLY is therefore GREEN by construction and is not re-run; the witness's born-RED is the threshold plant (§3). |
| 3 | `:546`'s budget | `test.setTimeout(PHONE_CELLS × CELL_BUDGET_MS)` = 8 × 30 s = 240 s, the count asserted (`cells === PHONE_CELLS`), the 1-minute load annotated at the row's head and tail (`node:os` `loadavg`, one shim line in `e2e/node.d.ts`). |
| 4 | the WAVE gates | B-INK-RUNG (b) EXEMPT with the chair's cite; the two self-admitted lint:verbs rows struck, the mark's turn re-spelled to a named verb and a zeroed length token (§0). |
| 5 | §11 × §11c (gaps 10–11) | F1 re-authored (§4); the state line under the chart LANDED as a WAVE row (§4); `player-tally:1479/:1312×2` and `peer-tin:928/:965` priced, not landed (§4). |
| 6 | the far edge and the CUT arm | a new row fires the press-less click IN THE PAGE on the first frame ≥ `FAR_MS` = 300 ms after the release's own time stamp, asserting `300 ≤ gap < 350` on both arms; the CUT arm is declared DEV-ONLY in the spec (`devServed`: a served dist SKIPS the forgiveness rows, never reds); the relabel comment corrected (+4–6 ms in Chromium, 60 ms only where the engine sends no trusted click). |
| 7 | π's roster row; `--tap-floor` | declared, not cured: `ul.players-roster.sr-only` flex → block is unpainted (sr-only clip) and sits outside the head — a π line of the pass-9 bank, unmoved here. `PlayerMark.vue:676/:707` `--tap-floor` on the union are T9-R10's species and the chair records them under T9-R10 (CHAIR §22: no row minted); no cure in this delta. |

## 3 · Born-RED and sabotage (what ran, with its negative in the same run)

| row | negative / plant | clean | planted | engine |
|---|---|---|---|---|
| roster absence, typecheck | `DRAWN_FRAMES` renamed in `edge-bands.d.mts` (`od -c` on the grep count: one hit) | `tsc -p tsconfig.e2e.json` 0 | 2 (`TS2724` at `player-mark.spec.ts:36`) | none (browserless) |
| roster absence, load | the export renamed in a whole `e2e/lib` copy; the spec's named import | 0 (prints `{"…head-sheet-frame","width":1.5,"sites":1}`) | 1 (`SyntaxError … no export named 'DRAWN_FRAMES'`) | node 26 |
| B2 EXEMPT (B-INK-RUNG) | row struck / `ms: 401` / member `401` | no presenceInk finding | 3/3 red their own finding | browserless |
| verbs, PlayerMark.vue | curve back to `--ease-standard` / `transition-duration: 0s` back / the prm admission re-added | no PlayerMark finding | 3/3 red their own finding (`:685`, `:778`, stale 1) | browserless |
| F1 re-authored | the pass-9 row (`length > 0` ↔ `SELF_TAKES_A_HAND`) on WAVE + delta | GREEN | (the bare WAVE's red, WAVE9-read / registry-v9 §2.5) | vitest |
| THIN_1PX + `P055_0.825px` on the four-band row | in-run plants, every regime, both themes | — | **UNREAD** (§5) | — |
| the area witness | threshold plant `below > least + 0.5` (RED) / `least − 0.5` (GREEN), the least read from the clean run | — | **UNREAD** (§5) | — |
| `:546`'s count clause | `PHONE_CELLS` 8 → 7 | — | **UNREAD** (§5) | — |
| far edge | CUT arm in-run (the S1 clause cut from the dev module, must land once); the floor plant (fire at 40 ms, floor 300) | — | **UNREAD** (§5) | — |
| dev-only | the forgiveness rows against the control's built dist must SKIP, never red | — | **UNREAD** (§5) | — |

Clause-, threshold- and disjunct-sabotage on the gates I own on the WAVE: B2's three (one per disjunct of the value
law: the key, the row's `ms`, the member's value) and verbs' three (one per offence the struck admissions covered,
plus the stale-admission arm). Each plant was one variable, restored by sha1 before the next.

## 4 · §11 on the union (leader duties): the rulings shipped, the arms priced

The shipped arms, read off the WAVE's own consts: `SELF_TAKES_A_HAND = true` (`useSession.ts:603`), `PLACE_CHART = true`
(`App.vue:978`), `CHART_YIELDS = false` (`PlayerMark.vue:394`). No default moves (LAWS P8 §G, CHAIR §9).

- **F1, `useSession.test.ts:446` (SELF × TIN) — RE-AUTHORED, mine.** The shipped arm is TRUE, and under it the
  union's `withSelfInk` binds your own ink once a SECOND id is known; the head mark rests graphite alone (SELF's own
  row 1). The row that read "an index of your own, minted at the join" is the side that contradicts what the shipped
  arm paints, so it is mine to re-author: a room of one binds nothing (`toEqual({})`), and the adoption half (the
  room's `k`, then a second id) still keys on `SELF_TAKES_A_HAND`. On WAVE + delta: F1 GREEN; `useSession.test.ts`
  48/50, the two reds U3 (`:691`, 2 distinct inks of 4) and U5 — PAL-TIN's wire-rule rows, union-born at TIN × WALK,
  not §11's. Arm FALSE would cost: the mark, the lobby row and the deck swatch paint you graphite while every other
  page paints you the room's ink (r0's I2), and `player-mark.spec` row 1's "takes the room ink" clause reds.
- **The state line under the chart (gap 11, PLACE × COUNT) — RULED and LANDED as a WAVE row.** The line and the chart
  never draw together and the shipped arm picks which: alone the line, in a room the chart (CHART arm) or the line
  (LIST arm); the YIELD arm asserts only "one of the two". Row: `player-mark.spec.ts` "the state line and the chart
  never draw together, and the shipped arm picks which" (WAVE + delta only; §11's lane tree has no chart). So the
  eleven reds (`player-tally:539/:569/:620×5/:888×4`, `player-place:307`, `player-tally:1589`) are COUNT's rows
  reading a line the shipped sheet does not draw in a room: COUNT re-authors them on WAVE + this delta in batch 4
  (CHAIR §9: COUNT and PLACE cut ONE route). Priced arm (the other side): drawing `.pl-state` under the chart too
  makes every room's sheet one line taller over the board on the chart arm (PLACE's `priced(list, chart)` cells
  grow) and says the room twice to the eye; it is refused as a default move.
- **`player-tally:1479` "the board binds no ink for your own writes", `:1312` ×2 the planted rung (TIN's mint vs
  SELF's hand) — PRICED, not landed.** A3 GREEN, A4/A5 RED: TIN's mint inks the board's author by id, and under
  `SELF_TAKES_A_HAND = true` you are an author with an index once the room has two. Arm (i), TIN's rule holds: the
  row re-keys to "your writes take your agreed ink once a second id is known" (COUNT's row, cost: a re-authored
  assertion, no product byte). Arm (ii), the row holds: `authorInk` must skip self-authored cells under both arms
  (a product byte in TIN's `useSession.ts`, cost UNMEASURED: your own digits stay graphite on your page while every peer's page
  inks them — the r0 I2 defect again, on the board). The shipped arm says (i).
- **`peer-tin:928` / `:965` the roster tick — PRICED, not landed.** SELF's roster is `sr-only` (the sheet's rows are
  the painted roster), so TIN's `PlayerTick` in the retired GCP row has no painted home. Arm (i): TIN's tick moves
  onto the lobby row's stub (`.pl-row .pl-stub`), PAL-TIN's row re-keys to the lobby; cost UNMEASURED: one glyph per row inside
  the head sheet, which the four-band and row-budget rows would read again. Arm (ii): a painted roster returns beside the
  board; cost UNMEASURED (a surface §11 deleted returns; the GCP's `tray-well` pin and the filter census would be re-read). §11's
  ruling: (i), on PAL-TIN's lane (§11c leads the mechanism, CHAIR §9).

**Leader's lines (§11).** The section's number is the critic's: 93 at v9; this bank claims no move (no browser row
read). The cures' blobs for COUNT and PLACE are in `BANKED.txt` (W3 + delta: `PlayerMark.vue` `ef87690c`,
`player-mark.spec.ts` `849d0a3d`, `rowBudget.ts` `031f9471`, `useSession.test.ts` `49d7b2a9`). NAMES_OVER_CELLS is
not on either tree (deleted at pass 9); B-NAMES arm (a) is `rowBudget.ts`'s no-growth rule, which on every real cell
reads as "any lap takes one row" (§2 row 2). The on-WAVE delta's gate reads, bare, WAVE → WAVE + delta: `lint:bands`
1 → 1 (B2 cleared; B11, B13 ×2 remain, not §11's), `lint:verbs` 1 → 1 (PlayerMark.vue findings 0 → 0 with 36 → 34
admissions; PLACE's PlayerLobby ×2 remain), `lint:copy` 0 → 0, `lint:sleep` 1 → 1 (identical findings),
`lint:theme-tokens` 2 → 2 with the whole output byte-identical (the wash reach, 6 offences: TIN's `useSession` and PLACE's `PlayerMark.vue` 2-vs-0 publishers, registry-v9 §8.2; not this delta's).

## 5 · The browser column: UNREAD (the guard's queue, not the zone)

The zone read inuse 13,854 → 14,344 the whole session (far under 8M; no reboot is owed for this lane), the 1-minute
load 5.96–15.67. No browser row opened: the one battery I queued — the lane tree, chromium, the rows this pass
changed (`paint a drawn edge|portrait phone|row budget|toggles once|forgives|far edge`), one `guarded` call with the
dev server inside it — sat in `queue-browser` from 15:53:57, 8th of 8 tickets, while all six browser slots were held
by `--exclusive webkit` jobs waiting on the machine-wide WebKit lock (§9 incident 1). Its log
(`pw-lane-cr`) carries the HEAD line and nothing else. So, by file and engine, UNREAD on this bank:

- `e2e/player-mark.spec.ts` on the lane tree (`ac862f1e` + `pass10.diff`): the four-band row with the folded roster
  and its THIN_1PX / P055 plants, the `:546` row on its keyed budget, the KEY_CELLS row and the sweep with the area
  witness (and the least `below` it prints), the forgiveness rows S1/S2/S3 and the new far-edge row — **chromium and
  WebKit**.
- the same rows on the control `:4259` (`index-CubiZsMVSwTc.js`): expected exit 1 by absence (no mark) and SKIP on
  the forgiveness rows (dev-only) — **both engines, UNREAD**.
- `e2e/player-mark.spec.ts` whole on WAVE + delta (`a9e00185`), including the landed state-line row and the union's
  `:595` (this tree's `:546`, arm-born at pass 9 on its 30 s budget) — **both engines, UNREAD**.
- the plants of §3 marked UNREAD; the tray-well consumer (cited from homes v3, not re-read); π and AA (by
  construction only, §7).

The pass-9 WAVE's own WebKit reading of this spec stands as WAVE9-read records it (`player-mark` 21/1/1, the one red
`:595`, the one skip `:1163` = the drawn-frame SKIP this bank removes); it is the WAVE's number, not this bank's.

## 6 · Replay route (one declared base per diff, LAWS P9 §A)

1. `pass10.diff` is cut on **`74a2b5d9`** through a temporary index, `--binary`, product paths only, and carries **no
   home path** (the 13 homes ride by sha, LAWS P9 §A: no second copy). Replay: a fresh `git archive 74a2b5d9`, `git init`,
   `git apply homes.diff` (`07257854`, pass10/instruments) → `ac862f1e`, then `git apply pass10.diff`. It also applies
   0 on bare `74a2b5d9` (its 26 paths are disjoint from the homes'), but the spec imports `e2e/lib/*`, so the tree
   that RUNS is `ac862f1e` + this diff.
2. `pass10.delta.on-WAVE.diff` is cut on **`8c46d9de`** = `954bbbab` + `homes.on-WAVE.diff` (`0723d508`), the
   archive tree `72b7ad67`, through a temporary index in the archive's own `.git`. It applies 0 on `8c46d9de` and on
   bare `954bbbab` (8 paths, none a home path). It does NOT apply on pass 9's `acde977b` (exit 1: `player-mark.spec.ts`
   is not there; that tree predates §11 on the union) — the route for COUNT and PLACE in batch 4 is `8c46d9de` + this
   delta, by sha, and nothing else.
3. Its 8 paths: the lane's advance carried over by `git apply --3way` (4 conflicts in `player-mark.spec.ts`, each
   resolved by keeping the union's B-CHART arm keys AND the lane's witness/budget lines), plus the WAVE-only seams
   that cannot ride on `74a2b5d9` because their tokens and gates are not there: `--verb-layDown-ease` and the PRM
   token in `PlayerMark.vue`, the EXEMPT row in `check-motion-bands.mjs`, the struck admissions in
   `check-pencil-verbs.mjs`, the F1 re-author in `useSession.test.ts`, and the state-line row.
4. Rig (never banked): `web/frontend/.plrself10/{pw.mts,vite.mts}` in each tree; every playwright run is ONE
   `guarded` call whose webServer starts the subject inside the run's own tree (lane dev `:4241`, or the control's
   pre-built dist previewed `:4259` from `w7-control`), so no server outlives its run. Scripts under the lane's
   durable scratch: `gates.sh`, `sab-wave.py`, `pw-run.sh`, `bank.sh`, `applycheck.sh`.

## 7 · Constraints (π, AA, filterBudget, M16)

- **π vs `74a2b5d9`: NOT RE-READ (no browser row ran; §5).** By construction: the lane's pass-10 product bytes are
  two comments (`rowBudget.ts`, `pencilConfig.ts`), which the build strips, so the lane's dist is the pass-9 bank's
  and its π line stands as pass 8/9 read it, plus the one undeclared line the critic named, now DECLARED: the
  `ul.players-roster.sr-only` flex → block row, unpainted (clipped), outside the head. On the WAVE the delta moves
  CSS only inside a transition (the mark's 400 ms colour turn takes layDown's curve `cubic-bezier(0.32, 0.72, 0, 1)`
  for `--ease-standard`'s `(0.4, 0, 0.2, 1)`): the rest pose is byte-identical, the PRM pose is 0 s both before and
  after. That is a cite by construction, not a reading, and it prices in the number.
- **AA**: no new ink, no new colour; T9-R8 cited. No painted-AA row ran.
- **filterBudget 9**: no `filter` in either diff (grep 0).
- **M16**: no UI string added; `check-copy-register` 0 on the lane and on WAVE + delta.
- **Dist identity / served CSS bytes**: no build ran (the heavy pool was full the whole session, §9); none is claimed.

## 8 · The bank line

`pass10.diff` sha1 `c6e830c6` · 184,025 B · 26 files +2,779/−402 · base `74a2b5d9` (runs on `ac862f1e`) · apply 0 on
`74a2b5d9` and `ac862f1e` · tree `b959448e` (with homes v3 `e855ff06`). `pass10.delta.on-WAVE.diff` sha1 `540b93da` ·
25,204 B · 8 files +174/−44 · base `8c46d9de` (archive `72b7ad67`) · apply 0 on `8c46d9de` and bare `954bbbab`, 1 on
`acde977b` (not a route) · result `a9e00185`. Every line, git dir and path count in `BANKED.txt`.

## 9 · Incidents (self-declared)

1. **Both guard pools saturated for the whole session.** At 15:44 I launched the lane dev `:4241` and the control
   preview `:4259` as `guarded --timeout 90 -- npx vite …` (heavy). Neither was admitted in 9 minutes: all 5 heavy
   slots were held by long-lived servers (other sessions' and sibling lanes'), 5 more heavy waiters queued. I stopped
   both of mine by recorded PID (60220, 60222; cwd checked: my tree and `w7-control`; neither had bound a port) and
   moved each server INTO its playwright run's own tree (the rig's `webServer`), so a browser row needs one browser
   slot and nothing else. The browser pool was then 6/6 held by `--exclusive webkit` waiters (four other projects
   and this repo's chair-fold replay, 17 min to 1 h 45 min old), 8 tickets queued, mine last.
2. **The unit battery was queued and withdrawn.** `unit.sh` (heavy, chunked by directory) waited behind the same
   heavy pool; I stopped it (PIDs 73090, 73114, mine) before the browser run could be admitted beside it, to keep
   one heavy run per lane. Only the two single files ran (light): `rowBudget.test.ts` 8/8 lane, `useSession.test.ts`
   48/50 WAVE + delta.
3. **A quoting slip** ran the first seamed `lint:bands`/`lint:verbs` reads as one missing module (`Cannot find module
   '…check-motion-bands.mjs --self-test'`); no reading was taken from it, both re-run bare.
4. **The first roster-absence ESM plant failed for the wrong reason** (a sibling module and `@playwright/test` not
   resolvable from a bare copy); discarded (`mv` to trash), re-run on a whole `e2e/lib` copy with `node_modules`
   linked: the SyntaxError names `DRAWN_FRAMES`.
5. **`--3way` refused homes v3 on the lane tree** ("does not exist in index": the home files are untracked in the
   worktree's real index, which I never touch); applied plainly instead, exit 0, verified blob-equal to `ac862f1e`.
6. **Temporary-index blobs in the shared store** (LAWS P9 §J's declared class): `write-tree`s through temporary
   indexes on the lane worktree wrote trees/blobs into main's object store (`ac862f1e`, `8c46d9de`, `b959448e`,
   `e855ff06`); no ref moved, no commit.
7. **`docs/tranches/LEDGER.md`** in the lane tree carried pass 2's CH-70/CH-71 rows (the pass-9 substrate's
   39th file); it is returned to `74a2b5d9`'s bytes so the tree's diff is product files only (a copy kept in the
   lane's scratch). No ledger row is minted (CHAIR §22).
8. **The queued browser battery was withdrawn at 16:02:35** after 8 min 38 s in `queue-browser` (position 8 → 7;
   the six tickets ahead included two more `--exclusive webkit` jobs, and the six slot-holders were WebKit waiters
   17 min to 1 h 48 min old with 20–90 min timeouts each, so the next chromium slot was hours away). Stopped by its
   task id; its log holds only the HEAD line, no `.exit` was written, `:4241` and `:4259` never bound. The rig dir
   `.plrself10/` was moved out of the lane tree (to the lane's trash) so the tree's diff is product files only:
   39 files against `74a2b5d9` = the 26 of `pass10.diff` + the 13 home paths at homes v3's bytes.
9. Servers at return: none of mine listening; nothing committed, stashed, pushed, deployed or installed.
