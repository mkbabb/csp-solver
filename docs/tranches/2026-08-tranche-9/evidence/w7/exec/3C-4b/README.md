# T9-W7 exec 3C-4b — the hover that arrives and never leaves

Commit `a649cf5e` on `w7/exec`, on top of `e4c45f53` (the first slice's six accepted commits),
plus repair r1 `e1f2304b` (one test row; §9 — `GameBoard.vue` untouched by it).
Closes gap **G8** of `FOLD-MANIFEST.md` §5 with the hardening that manifest names in its own
words: clear `pointedPos` on the grid's `focusout`.

## 1. The seam

`web/frontend/src/games/shared/GameBoard.vue`. At `e4c45f53` the tape reads

```
const pointedPos = ref<number | null>(null);            // written by onCellHover
const hoveredPos = computed(() =>
  isCoarse.value
    ? (pointedPos.value ?? (unitFocused.value ? focusedPos.value : null))
    : pointedPos.value,
);
```

`pointedPos` OUTRANKS the focus fallback, by design (3C-4's pinned precedence row). The residue
is what happens when the hover never ends: a coarse device that fires `mouseenter` on a tap and
no `mouseleave` after it, plus a focus move that fires no pointer event at all — an external
keyboard on a phone. `pointedPos` stays on the cell the player left and the tape strands there.

The cure is at `onGridFocusout` (`GameBoard.vue:472`), which is the grid's own handler and
already exists for the `unitFocused` gate. `focusout` bubbles from the OLD cell on every focus
move, cell to cell or off the board:

```
 function onGridFocusout(e: FocusEvent) {
+  if (isCoarse.value) pointedPos.value = null;
   const grid = e.currentTarget as HTMLElement;
   const next = e.relatedTarget as Node | null;
   if (!next || !grid.contains(next)) {
     unitFocused.value = false;
     noteFocus(null);
   }
 }
```

Scoped to the arm that strands, three ways:

- **`isCoarse.value` guards it.** A fine pointer is byte-for-byte what shipped: a mouse that
  still hovers A while focus goes to B by keyboard keeps its hover, and the tape stays on A.
  Pinned by the third new row and by the two fine-pointer rows already in the file.
- **The tap that GIVES focus is safe.** A tap's pointer events precede its focus events
  (`mouseenter` → `mousedown` → focus), so the clear runs on the OLD cell's `focusout`, which is
  after the new `pointedPos` write but before the new cell's `focusin`; the fallback then reads
  the freshly focused cell. Measured, not reasoned: read A of the 3C-4 focus arm is unchanged in
  both engines (§5), and read F1 below taps a cell with the grid already focused and still gets
  its tape.
- **`hoveredPos` itself is untouched** — no precedence was rewritten, so 3C-4's row "a
  synthesised coarse hover takes the focused cell's place while it lasts" stays green.

Two comments moved with it: the clear's own reasoning at `:472`, and one sentence appended to
the `hoveredPos` block at `:515` so a reader of the computed learns where the pointer is dropped.

Diff: `GameBoard.vue` +13/−1 (one statement, twelve lines of comment),
`GameBoard.coarseTape.test.ts` +71/−0 (one helper, three rows).

## 2. The born-RED rows

`web/frontend/src/games/shared/GameBoard.coarseTape.test.ts` grows a `keyFocus` helper — grid
`focusout` with a `relatedTarget` the grid CONTAINS (so `unitFocused` stays up), then `focusin`,
then the new cell's `onCellFocus`, and no pointer event of any kind — and three rows:

| row | pointer | shape | expects |
|---|---|---|---|
| hands the tape to the cell the keyboard moved to | coarse | tap A, hover-in A (no hover-out), arrow to peer B | tape names B's author, not A's |
| drops the tape when the keyboard moves to an unauthored cell | coarse | same, arrow to cell 8 | no tape |
| drops the tape when focus leaves the board with the hover still live (added at repair r1) | coarse | tap A, hover-in A (no hover-out), focus off the board | no tape |
| leaves a fine pointer's hover exactly where it was | fine | same | tape STAYS on A |

RED at `e4c45f53` (the cure reverted, the rows in place), bare
`npx vitest run src/games/shared/GameBoard.coarseTape.test.ts`, exit **1**:

```
 Test Files  1 failed (1)
      Tests  2 failed | 10 passed (12)
```

with `AssertionError: the tape names the cell the player is on, not the one they left: expected
'brave-otter' to contain 'quiet-lynx'` and `AssertionError: nobody wrote cell 8: expected true to
be false`.

GREEN at `a649cf5e`, exit **0**:

```
 Test Files  1 passed (1)
      Tests  12 passed (12)
```

The fine-pointer control row is GREEN on BOTH sides — it is the row that proves the cure did not
reach the desktop grammar, so it must never have been red.

## 3. Gates

Bare, in `.claude/worktrees/w7-exec/web/frontend`, exit code read from `$?`.

| gate | exit |
|---|---|
| the new rows RED at `e4c45f53` / GREEN at `a649cf5e` | 1 (designed) / 0 |
| `npx vue-tsc --noEmit` | 0 |
| `npm run typecheck:e2e` | 0 |
| `npx vitest run` | 0 — **Test Files 68 passed (68)**, Tests 829 passed (829) (826 + the three new rows) |
| `npm run lint` | 0 (first try; no prettier pass needed) |
| `npm run lint:eslint` | 0 |
| `npm run lint:copy` | 0 (no product string moved; the gate is not loosened) |
| `npm run lint:live-regions` | 0 |
| `npm run lint:motion` | 0 |
| `npm run test:font-coverage` | 0 (no rendered string changed) |
| `npm run lint:boundary` · `lint:tdz` · `lint:ink` · `lint:theme-selectors` · `lint:lanes` | 0 ×5 |
| `npx vite build --config .vite-exec.config.ts` | 0 — `dist/assets/index-DAj5SdL4MZJz.js`; built CSS still greps **0** hits of `not all and (hover:hover) and (pointer:fine)` across all 7 stylesheets, so 3C-4's deletion still ships |
| goldens, `playwright-golden.config.ts` vs the cured dist on `127.0.0.1:4259` | 0 — **4 passed**, no `--update-snapshots`, `git status` clean after |
| `e2e/visual-regression.spec.ts`, chromium + webkit, vs the cured dist | 0 — **24 passed** at `--workers=2`; see §7 gap 1 for the parallel-workers flake |
| `npm run test:e2e` (full battery) | **NOT RUN** — its config's `webServer` binds :3000, outside this lane's port fence (the manifest books this as G2, chair's on master) |
| `node scripts/check-evidence-policy.mjs` (repo root) | **1** — `per-wave 5,515,159 B > 2,097,152 B` on `evidence/w7`, a breach that pre-dates this lane by 5,440,974 B (§7 gap 8) |
| real device / Safari / simulator | **NOT RUN** (M19; G10/G22 stand) |

`lint:tdz` was run deliberately: the clear references `isCoarse` and `pointedPos`, both declared
below `onGridFocusout` in the same `<script setup>`. They are read at event time, never at module
evaluation, and the gate agrees.

## 4. π — the rect census

`3B-1/probe/rect-census.mjs`, unmodified: every element's `getBoundingClientRect` on the pinned
`?board=` permalink and on the gallery, 1280×800 and 390×844, `reducedMotion: reduce`, 2.5 s
settle, chromium. BEFORE is the worktree built at `e4c45f53` **before the edit**, into
`web/frontend/dist-before/` (locally excluded), served read-only on `127.0.0.1:4258`; AFTER is
the cured build on `127.0.0.1:4259`. The main tree was never built, edited or served.
`census/diff-before-after.txt` (the two JSON banks are gzipped beside it, as the prior lane's
are; `3B-1/probe/rect-diff.mjs` reads the plain `.json`, so gunzip before re-running it):

```
board-1280x800.json:   rects 1089/1089  max|d| 0.00px
board-390x844.json:    rects 1049/1049  max|d| 0.00px
gallery-1280x800.json: rects 1807/1807  max|d| 0.00px
gallery-390x844.json:  rects 1767/1767  max|d| 0.00px
WORST max|d| across all surfaces: 0.00px
```

**5,712 rects, 0.00 px, no key on one side only. Surfaces moved: none.** Expected: the tape is a
transient `position: absolute; width: 0; height: 0` anchor, and this census is fine-pointer and
sessionless, so the cure's arm cannot even fire in it. The reading that CAN fire is the coarse
browser arm in §5.

## 5. The browser arms — 390×844, both engines

Context: `hasTouch: true`, `isMobile` on chromium, `reducedMotion: reduce`,
`deviceScaleFactor: 2`; every run PRINTS `pointerCoarse: true, hoverNone: true` rather than
assuming it. A real two-page session over `?wire=local`: page A (1280×800) mints the room and
writes the peer digits, page B is the phone.

### 5.1 Read F — the new one. `3C-4b/probe/strand-arm.mjs`

F1 tap peer cell A → F2 dispatch `mouseenter` on A and never withdraw it → F3 ArrowRight onto
peer cell B, no pointer event at all. **A and B are both the peer's**, so the tape's TEXT cannot
tell them apart; the reading that does is the tape anchor's own x against the columns.

| run | dist | cells A→B | tape after F2 | tape after F3 (ArrowRight) | focus after F3 | verdict |
|---|---|---|---|---|---|---|
| `arm/F-before-390-chromium.txt` | HEAD `e4c45f53` | 25→26 (col 7→8) | col 7, x 315.66 | **col 7, x 315.66** | cell 26 | **STRANDED** |
| `arm/F-after-390-chromium.txt` | cured | 2→3 (col 2→3) | col 2, x 114.55 | **col 3, x 154.77** | cell 3 | **PASS** |
| `arm/F-before-390-webkit.txt` | HEAD `e4c45f53` | 9→10 (col 0→1) | col 0, x 34.11 | **col 0, x 34.11** | cell 10 | **STRANDED** |
| `arm/F-after-390-webkit.txt` | cured | 19→20 (col 1→2) | col 1, x 74.33 | **col 2, x 114.55** | cell 20 | **PASS** |

The anchor does not move one pixel at HEAD while focus moves a whole cell; cured, it moves with
the focus, in both engines. Tape count is 1 on every one of these reads — the cure changes WHICH
cell the tape names, never whether one exists.

### 5.2 Reads A–E — unchanged. `3C-4/verify-r1/focus-arm.mjs`, run unmodified vs the cured dist

| read | chromium | webkit | banked pose |
|---|---|---|---|
| A — tap the peer cell | tape `implicit-penguin`, 118.86 × 35 px, focus cell 6 | tape `holy-finch`, focus cell 1 | tape |
| B — `mouseleave` on the cell root | **tape STANDS**, same box | **tape STANDS** | STANDS |
| D — ArrowLeft onto an unauthored cell | count **0** | count **0** | 0 |
| C — ArrowRight back onto the peer cell | **tape rises**, same box | **tape rises** | rises |
| E — tap the drawer tab off the grid | count **0**, focus off the board | count **0**, focus off the board | 0 |

`arm/focus-arm-AE-390-{chromium,webkit}.txt`. A and C — the two the brief names — are as banked
in both engines, which is the measurement that the tap giving focus still tapes the tapped cell.

## 6. DELTA — frames

**No new pixel is claimed.** The cure changes which cell a transient tape names, and the resting
board is 0.00 px identical (§4). Two crops are banked as the F read before and after, 74,185 B
total, chromium 390×844, cropped to the two cells and the tape's berth — never a viewport.

**They are not a matched pair.** Each is its own run on its own room, so the cells, the row and
the tape's orientation differ between them (before: cells 25/26 in row 2, tape above the row,
slug `sparkling-cephalopod`; after: cells 2/3 in row 0, where the tape flips below the cell, slug
`innovative-warbler`). The difference a reader sees between the two images is the puzzle, not the
cure. Only the anchor x against its own run's columns — the §5.1 table — proves the claim:

- `frames/before-390-chromium-F3.png` (29,397 B) — HEAD, the run in the table above: focus is on
  cell 26 (the blue outline, column 8) and the tape `sparkling-cephalopod` still hangs over
  column 7. The crop clamps at the board's right edge, so the tape's left half is what shows;
  the number that proves it is anchor x 315.66, unmoved.
- `frames/after-390-chromium-F3.png` (44,788 B) — cured: focus on cell 3 (blue outline) and the
  tape `innovative-warbler` centred on it, anchor x moved 114.55 → 154.77.

## 7. Gaps

1. **`e2e/visual-regression.spec.ts` needed a second look.** Two full runs at the default worker
   count came back exit 1: the first with 16 of 24 reported, the second with 23 passed / 1 failed
   on `option chips keep their separation` (chromium) with `Error: browserContext.close: Target
   page, context or browser has been closed` — a harness crash, not an assertion. That row re-run
   alone passes against the CURED dist (exit 0) AND against the HEAD dist (exit 0), so it is
   symmetric and not this cure's. A third full run at `--workers=2` was **24 passed, exit 0**.
   This box is running several lanes at once; read the failure as contention.
2. **The spec was run through a throwaway config** (`playwright-3c4b.config.ts`: the repo config
   with `webServer: undefined` and `testMatch` narrowed), because the repo config's `webServer`
   binds :3000, outside the lane's fence. The file was deleted; `git status` carries only the
   permitted untracked `.vite-exec.config.ts`.
3. **The full Playwright battery is still NOT RUN** by any lane (manifest G2).
4. **No real device.** `hasTouch` emulation proves the media match and the event ordering; the
   shape this cure is FOR — a phone with an external keyboard — is emulated here by dispatching
   `mouseenter` by hand and then pressing a key, which is the shape, not the device. G10/G22
   stand: W8 §8.3's owner-run iOS instrument is where a device reads it.
5. **One arm run was thrown away and re-run.** An early cured chromium run reported focus jumping
   to cell 1 with the tape gone: `boardGeneration` bumped mid-arm (`GameBoard.vue:824` resets
   `focusedPos` to 0 on a new deal) and the peer's digits went with it. Not a cure behaviour and
   not counted; the banked run is the clean one. The arm has no guard against a deal landing
   mid-read — a probe row if anyone re-uses it.
6. **The tap-precedence argument is measured in two engines, not proved by spec.** Both fire
   pointer events before focus events, which is what the ordering rests on; a device that
   inverted them would clear a pointer the tap had just set, and the fallback would still name
   the tapped cell (focus lands there either way). The failure mode would be a tape flicker, not
   a wrong name.
7. **`pointedPos` is not cleared when a coarse pointer leaves the grid without a focus move** —
   there was never a focus in the grid to move out of, so no `focusout` fires and the ref holds a
   stale number until the next hover or focusout. **Corrected at repair r1:** this gap previously
   said "the tape needs `unitFocused` anyway, so nothing paints", which is false. `hoveredPos` is
   `isCoarse ? (pointedPos ?? (unitFocused ? focusedPos : null)) : pointedPos` — a non-null
   `pointedPos` short-circuits the `??` and `unitFocused` is never read, so a coarse hover with no
   focus anywhere in the grid DOES mount a tape, at `e4c45f53` and after this cure alike (measured
   by the verifier on both sides). What makes the residue narrow is not the gate but the event
   pairing: any pointer that really hovers also fires `mouseleave`, which nulls `pointedPos`
   (`DigitCell.vue:227-228` binds both; `onCellEnter` :176, `onCellLeave` :180). The residue is the
   device that synthesises one and not the other, with no focus in the grid at all — the same
   family G8 names, left open, chair's row.
8. **`node scripts/check-evidence-policy.mjs` reds at the WAVE level, and did before this lane.**
   Exit 1: `per-wave 5,515,159 B > 2,097,152 B` on `evidence/w7`, summed over `*.png`. This
   lane's two crops are 74,185 B of that; subtract them and it is still 5,440,974 B, so the
   breach is the design loop's `w7/loop/` captures, not this cure. No cap was raised and no
   grandfather line added. Chair's row. **Re-read at repair r1:** exit 1, now
   `per-wave 5,662,986 B` — the number climbs as other lanes bank, and 5,588,801 B of it is still
   there with this lane's crops subtracted. This repair added no bytes of evidence; no crop was
   cut or re-cut.
9. **A fine pointer keeps the residue by design.** A mouse hovering A with focus on B still tapes
   A. That is the shipped desktop grammar and the fine-pointer row pins it; if the chair ever
   wants the fine arm to follow focus too, that is a design change, not a hardening.

## 8. Files

- `web/frontend/src/games/shared/GameBoard.vue` — the clear at `onGridFocusout`, two comments
- `web/frontend/src/games/shared/GameBoard.coarseTape.test.ts` — `keyFocus` helper, four rows
  (three at `a649cf5e`, the off-board one added at repair r1 — §9)

Evidence (main tree, untracked at `master`): `probe/strand-arm.mjs`, `arm/` (6 readouts),
`census/{before,after,diff-before-after.txt}`, `frames/` (2 crops).

`web/frontend/dist-before/` is the HEAD control build; it is in `.git/info/exclude`, never
committed. `web/frontend/.vite-exec.config.ts` is the standing laws' scratch config, untracked.
Servers on 127.0.0.1:4258 and :4259 were killed before return.

## 9. Repair r1

The non-author verifier ruled REPAIR: one MUST against a false sentence in the record, two NOTEs.
`GameBoard.vue` is **not touched** — `git diff a649cf5e -- web/frontend/src/games/shared/GameBoard.vue`
is empty, so the shipped behaviour of the cure is exactly what the verifier measured. The repair
is one test row and three passages of this README.

### 9.1 MUST — gap 7 said something false

Gap 7 dismissed the uncleared-pointer residue with "the tape needs `unitFocused` anyway, so
nothing paints". That reason is wrong, and the verifier measured it wrong on both sides:
`hoveredPos` short-circuits at `pointedPos.value ?? …`, so when a coarse hover is live the
`unitFocused` fallback is never reached and a tape mounts with no focus in the grid at all. The
gap now says what is actually true — the residue is narrow because a pointer that really hovers
also fires `mouseleave` and nulls `pointedPos` (`DigitCell.vue:227-228` binds both handlers,
`onCellEnter` :176, `onCellLeave` :180) — and it stays open, with the chair no longer holding a
reason that cannot bear weight. No code moved for this finding, by the verifier's own fix.

### 9.2 NOTE — the widened arm is now pinned by a row

The clear is not guarded on where focus goes: it fires on every grid `focusout`, including focus
leaving the board entirely. The verifier measured that arm (HEAD tape after an off-board blur with
a live hover: `true`; cured: `false`) and asked for a row, because no row and no browser read held
it. `GameBoard.coarseTape.test.ts` grows a fourth row, **"drops the tape when focus leaves the
board with the hover still live"**: coarse, tap the peer cell, `onCellHover(PEER)` never
withdrawn, `blurBoard` — no tape.

Born-RED on the same twin as the first three (the clear reverted in place, the four rows standing),
bare `npx vitest run src/games/shared/GameBoard.coarseTape.test.ts`, exit **1**:

```
 Test Files  1 failed (1)
      Tests  3 failed | 10 passed (13)
```

the new row failing with `AssertionError: nobody is on the board: expected true to be false`
at `GameBoard.coarseTape.test.ts:286`. GREEN with the cure restored, exit **0**:

```
 Test Files  1 passed (1)
      Tests  13 passed (13)
```

The source was restored by `git checkout HEAD -- src/games/shared/GameBoard.vue` and then
`diff`ed byte-for-byte against the pre-revert copy, so the twin left nothing behind.

### 9.3 NOTE — the two crops are two rooms

§6 now says so in its own words: the before and after crops are separate runs on separate rooms,
with different cells, different rows and opposite tape orientations, so the visible difference
between the images is the puzzle and not the cure. Only the anchor x against each run's own
columns proves the claim, and that is the §5.1 table. No crop was re-cut; the frames directory is
still 2 files, 74,185 B.

### 9.4 The battery, re-run at repair r1

Bare, in `.claude/worktrees/w7-exec/web/frontend`.

| gate | exit |
|---|---|
| the fourth row RED on the reverted twin / GREEN cured | 1 (designed) — Test Files 1 failed (1), Tests 3 failed \| 10 passed (13) / 0 — Test Files 1 passed (1), Tests 13 passed (13) |
| `npx vitest run` | 0 — **Test Files 68 passed (68)**, Tests **830 passed (830)** (829 at `a649cf5e` + the fourth row) |
| `npm run lint` | 0 |
| `npm run lint:copy` | 0 (no product string moved; gate not loosened) |
| `npm run lint:live-regions` · `lint:motion` · `lint:boundary` · `lint:tdz` · `lint:ink` · `lint:theme-selectors` · `lint:lanes` | 0 ×7 |
| `npm run test:font-coverage` | 0 |
| `npm run typecheck:e2e` | 0 |
| `npx vue-tsc --noEmit` | 0 |
| `npx vite build --config .vite-exec.config.ts` | 0 — **`dist/assets/index-DAj5SdL4MZJz.js` again**, the same hash the cure banked, from a fresh build in a clean shell; the built CSS still greps **0** hits of `not all and (hover:hover) and (pointer:fine)` across all 7 stylesheets |
| goldens, `playwright-golden.config.ts` vs the rebuilt dist on `127.0.0.1:4259` | 0 — **4 passed**, no `--update-snapshots`, `git status` clean after |
| π rect census | **NOT RE-RUN** — and says so: `GameBoard.vue` is byte-identical to `a649cf5e` (empty `git diff`) and the rebuild lands on the same bundle hash, so §4's 0.00 px over 5,712 rects is the measurement of this exact dist. Nothing shipped changed for it to read. |
| browser reads A–F | **NOT RE-RUN**, for the same reason, and the verifier re-took read F four times himself in both engines with the same verdicts. |
| `node scripts/check-evidence-policy.mjs` (repo root) | **1** — `per-wave 5,662,986 B > 2,097,152 B` on `evidence/w7`, the same pre-dating wave breach, grown by other lanes' banking since the first read (§7 gap 8). This repair banked no new bytes. |
| `e2e/visual-regression.spec.ts` | **NOT RE-RUN** — it reads the dist, and the dist is the same bundle hash; the `a649cf5e` run (24 passed at `--workers=2`) stands. |
| `npm run test:e2e` · real device / Safari / simulator | **NOT RUN** (unchanged: G2 port fence; M19, G10/G22) |

The rebuild reproducing `index-DAj5SdL4MZJz.js` also closes one of the verifier's own NOT-RUN
rows — he served the dist as it was left rather than re-deriving it.

### 9.5 What the repair did not change

The verifier's three adversarial rows stand as he wrote them. ADV4 (a coarse hover with no focus
mounts a tape) is a HEAD behaviour this cure neither made nor cured; it is gap 7, now stated
truthfully and still open. ADV1 (the off-board blur) is now a unit row. The fine-pointer residue
(gap 9) remains the shipped desktop grammar.
