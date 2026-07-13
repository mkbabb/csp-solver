# T4-WU · U2 — the baked game: the staged/live partition (spec ROW 4, a Fable design row)

Lane U2 of workflow T4-WU. Base = the {W8, W9} sealed HEAD **`df013a36`** (`git rev-parse
HEAD`), built **on** U1's history-spine working tree (read `u1-spine.md`; never around it). Port
**4389**. DO-NOT-COMMIT honored — the tree is additive, HEAD unmoved, no git commit/push/reset.
Every anchor re-located at HEAD before editing (U1 had moved the composables; it did NOT touch the
ControlPanels, so their born-RED base = the W8 layout I read verbatim at start).

## Files touched (in-scope only — none of U1's spine files)

- `web/frontend/src/games/sudoku/ControlPanel/ControlPanel.vue` — the partition: staged "New
  game" zone (Size + Difficulty + the re-homed **Deal**, `role="group"` + `useId` heading), peek
  divider as the staged/live separator, action row shorn of Randomize; `.new-game-zone` /
  `.new-game-heading` / `.deal-row` / `.deal-btn` CSS.
- `web/frontend/src/games/futoshiki/ControlPanel/ControlPanel.vue` — the D16 twin.
- `web/frontend/src/games/sudoku/composables/useSudoku.ts` — `pendingSize` (staged) decoupled
  from `size` (live); `deal()` commit; `watch(size)` live re-deal RETIRED.
- `web/frontend/src/games/futoshiki/composables/useFutoshiki.ts` — `pendingBoardSize`; `deal()`;
  `watch(boardSize)` re-deal RETIRED → `watch([boardSize, difficulty])` URL-sync only; difficulty
  now seeded from `initial.difficulty` + persisted.
- `web/frontend/src/games/futoshiki/composables/useUrlState.ts` — difficulty folded into
  `PersistedBoard`/`InitialState`/`?difficulty=` (twin of sudoku's; closes the W6 residue).
- `web/frontend/src/games/futoshiki/composables/useUrlState.test.ts` — +7 difficulty round-trip
  tests; the pre-existing storage-only literal gained its `difficulty` field.
- `web/frontend/src/games/sudoku/SudokuGame.vue` + `.../futoshiki/FutoshikiGame.vue` —
  ControlPanel selector bound to the STAGED size (`pendingSize`/`pendingBoardSize`); `@deal`.
- e2e recut (below).

## Born-RED proofs (each defect PROVEN live at the base)

**Gate 1 — staged size (RED at base).** `watch(size)`/`watch(boardSize)` re-deal LIVE, unguarded:
```
grep -nA4 "watch(size"  useSudoku.ts   → 701: watch(size, () => { clearPersistedBoard(); initBoard(); randomize({record:false}); });
grep -nA5 "watch(boardSize" useFutoshiki.ts → 683: watch(boardSize, () => { syncToUrl(...); clearPersistedBoard(); initBoard(); randomize({record:false}); });
```
A size-chip tap wiped + re-dealt the board with no confirm — the loudest live hazard after
Randomize.

**Gate 2 — futoshiki difficulty persists (RED at base).** Absent from `PersistedBoard`,
hardcoded, size-only URL:
```
grep -nA9 "interface PersistedBoard" futoshiki/useUrlState.ts → boardSize,values,given,...,boardGeneration — NO difficulty field
grep -n 'difficulty = ref<Difficulty>("EASY")' useFutoshiki.ts → 79 (hardcoded, runtime-only, resets each mount)
grep -nA4 "export function syncToUrl" futoshiki/useUrlState.ts → sets board_size only
```
Unit proof: the 7 new round-trip tests FAILED at base —
`npx vitest run futoshiki/useUrlState.test.ts` → **7 failed | 16 passed** (`expected undefined to
be 'HARD'`, `expected 'url+storage' to be 'url-only'`). After the fold: **23 passed**.

## What landed

1. **STAGED "New game" zone**, both games, mobile + desktop: Size + Difficulty `OptionSelector`s +
   the **Deal** button (the `DiceIcon` re-homed from the action row — no new control, the WM input
   shape stays frozen). `role="group"` + `aria-labelledby` a per-instance `useId()` heading ("New
   game"). The selectors read provisional BY PLACEMENT; Deal is the verb that commits — zero copy.
   The hold-to-peek `BoilDivider` moved up to be the staged/live separator (existing grammar, no
   new divider invented).
2. **LIVE zone** below the divider: pencil-mode toggle, assists, Undo/Redo/Hint, Solve/Clear/Share
   — acts on the CURRENT board. **Spatial prophylaxis**: Deal now sits a full divider from the play
   tools, so a mid-game fat-finger lands on benign/recovery controls, never a board wipe.
3. **Size arm-not-live**, both games: `pendingSize`/`pendingBoardSize` (the staged selection) is
   decoupled from the live `size`/`boardSize` (which drives the board dims/URL/persistence). The
   `watch(size)`/`watch(boardSize)` live re-deal is RETIRED. `deal()` commits: a SAME-size Deal
   records one undoable board entry (U1's size-undo deferral closes here); a size-CHANGING Deal
   resets to the new dims and deals off-log (the board blob carries no size, so a cross-size undo
   can't restore honestly — a clean-reset deal, as the retired watch did, now behind the button).
4. **Futoshiki difficulty folds into `PersistedBoard`/`?difficulty=`/localStorage** — the twin of
   sudoku's (crit #10, the W6 residue). Legacy stored boards without a tier coerce to EASY (the
   board is the valuable unit, not discarded). Round-trip covered by the 7 new tests.
5. **The verb: "Deal"** (sketchbook idiom, W12-congruent). aria-label `"Deal a new board"`; the
   `.deal-btn` sublabel shows its name on EVERY pointer (not only coarse) so "next game" reads with
   zero copy. **OWNER-TASTE FLAG** on the label — the owner's own word was "bake"; recorded, not
   agonized.
6. **W12 non-collision**: this zone selects a game's PARAMETERS inside the per-game panel; the
   carousel selects the GAME. No third confirmation shape. `?difficulty=` is now a SHARED URL key —
   safe because App.vue already strips board/size/difficulty on a game switch, and each game
   re-writes its own on mount (see the recut permalink test 3).

## Gates closed

| Gate | Verdict | Evidence |
|---|---|---|
| **staged size** | **GREEN** | Runtime probe (1280×800, my dist): initial 81 cells → click 16×16 chip → **still 81, board signature UNCHANGED** (`board_unchanged_after_chip: true`) → click Deal → **256** (`deal_committed_new_size: true`). Size arms; only Deal deals. |
| **futoshiki difficulty persists** | **GREEN** | `useUrlState.test.ts` 23 passed (was 7-RED at base): `?difficulty=` url-only, case-insensitive, bare-difficulty arms, invalid→EASY, localStorage round-trip, url-board adopts tier, url-wins over disagreeing storage. |
| **π (staged zone)** | **GREEN** | Crops in `crops/` — `{sudoku,futoshiki}-{desktop-1280x800,desktop-1440x900,mobile-390x844}-{newgame,panel}.png`. Both games, both viewports show the "New game" group (Size · Difficulty · **Deal**) above the peek divider; the born-RED base had Randomize shoulder-to-shoulder with the action row (base source, verbatim — U1 confirms it never touched the ControlPanels). |

## Controls-card height — BANKED (the scene.css cap is not regrown)

`.controls-card` cap = `calc(min(42rem, 85vw, 100dvh − 10rem) − 2rem)`. Measured on my dist:

| viewport | card outer box (clientHeight) | = cap? | content scrollHeight |
|---|---|---|---|
| 1280×800 sudoku | **608 px** | yes (608) | 1026 px (scrolls) |
| 1280×800 futoshiki | **608 px** | yes | 1064 px |
| 1440×900 sudoku | **640 px** | yes (640) | 1028 px |
| 1440×900 futoshiki | **640 px** | yes | 1066 px |
| 390×844 mobile (both) | ~472 px | no cap (stacked, page scrolls) | ~476 px |

The OUTER box sits **exactly at the cap** at both desktop sizes — the partition adds ~90 px of
content (the New-game heading + Deal button), absorbed by `overflow-y:auto` inside the capped card.
The overflow that would push the masthead negative / rise above the sheet does NOT regrow; the cap
holds. Mobile is uncapped (inline below the board) and grows ~4 px — negligible.

## e2e recut (arm-not-live is a deliberate behavior change — hand-matched, single-quote style)

- `visual-regression.spec.ts` Test 7 + `futoshiki.spec.ts` Test 2 (size switching): each size chip
  now STAGES; added a Deal click before the cell-count poll.
- `permalink.spec.ts` (×2), `sudoku-interaction.spec.ts`, `visual-regression.spec.ts` Test 5:
  `[aria-label="Randomize board"]` → `[aria-label="Deal a new board"]` (same re-deal behavior).
- `permalink.spec.ts` Test 3: `?difficulty=` is now a futoshiki-owned key — assert it resets to
  `EASY` on a game switch (the foreign sudoku tier is stripped, futoshiki writes its own), instead
  of asserting the key absent.
- `mobile-affordances.spec.ts`: the coarse sublabel loop `"Randomize"` → `"Deal"`.
- `share-truth.spec.ts`: comment-only — `.icon-btn` DOM order is now Deal·Clear·Fill·Solve·Share,
  so `nth(4)` still lands on Share (Deal replaces Randomize at index 0).

## Battery + e2e (all vs my built dist, port 4389, killed after)

- `vue-tsc -b --force` → **exit 0**.
- `npm run test:unit` → **263 passed / 21 files** (U1's 256 + the 7 new futoshiki difficulty tests).
- `lint:eslint` → 0. `lint:knip` → 0. `prettier --check src/` → 0.
- `npm run build` → built (index 192.56 kB / gzip 69.35 kB).
- **e2e default suite** (`PLAYWRIGHT_BASE_URL=http://localhost:4389 npx playwright test`) → **61
  passed** (incl. both recut size-switch specs, the recut permalink/share/mobile-affordances). No
  golden re-baselined; no golden crops the control panel (they crop logo/toggle/cell/board-corner).
  Owner listeners on `:3000`/`:3001` never touched; `:4389` killed after.

## DesignSync (the design-lane house rule — plugin actually invoked)

`DesignSync{list_projects}` → **`{"projects":[]}`**. No writable Claude Design project exists for
this account, so there is no remote design system to sync the partition against. The design pass
therefore authored against the **in-repo pencil design system** — every element reuses the
documented local language: the `.section-heading` √φ eyebrow register, the `.icon-btn` grammar, the
`BoilDivider` peek separator, `SheetWashiLabel` hover chips, the `OptionSelector` chips. No new
input grammar, no new divider grammar, no box invented — the staged zone reads "provisional" by
placement + heading alone (PRM-safe, both themes, both games, mobile + desktop). Flagged.

## Flags (for the orchestrator)

- **OWNER-TASTE — the verb "Deal".** The label + aria say "Deal a new board"; the owner's own word
  was "bake". One `grep` swaps every surface (label, aria, washi, sublabel, the 5 e2e selectors) if
  the owner prefers "Bake". Recorded, not agonized (spec item 5).
- **The two-tap confirm on Deal is NOT in this lane.** ROW 4 re-homes the dice as a plain commit;
  the dirty-gated two-tap (ROW 3 — generalize the Clear grammar to Deal on `isDirty`) is a separate
  concern and NOT landed by U2. `deal()` currently commits on a single press. The staged zone is
  built so the confirm lane can wrap the Deal emit without structural change.
- **`?difficulty=` is now a SHARED URL key across both games.** Safe under the existing
  strip-on-switch discipline (App.vue deletes board/size/difficulty/board_size on a game switch;
  each game re-writes its own on mount) — proven by the recut permalink test 3. Named, not silent.
- **Size-changing Deal resets the timeline (off-log); same-size Deal records (undoable).** The
  board blob (U1's spine) carries no size, so a cross-size undo can't restore honestly — the size
  commit is a clean-reset deal, matching the retired `watch(size)` behavior, now guarded by the
  button. A future size-carrying board blob would make cross-size deals undoable.
- **`randomize()` stays exposed** on both composables (the internal deal primitive + the mount
  auto-deal); the Deal button routes through `deal()`. Not dead — knip clean.
