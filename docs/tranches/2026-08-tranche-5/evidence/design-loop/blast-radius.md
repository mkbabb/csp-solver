# BLAST-RADIUS MAP — refreshed for PASS 3, post-P1 · post-Lane-D (ship 5)

Refreshed 2026-07-31 against **MAIN at `6800af04`** (the sealed P1 patch) with Lane D's pass-3
estate applied. The prior revision was written against `32198688` and priced a tree that no
longer exists: **P1-W2→W4 landed 13 commits between them**, and the single largest fact in this
document is that they *deleted the estate's reference filters*. Every mark-4 row below is
re-derived, not carried. **Mandatory reading before any pass-3 lane moves.**

**Method** (unchanged, and the reason pass-1's spec was wrong): grep positionally for the SYMBOL,
not the directory; sweep MAIN **and** all three worktrees; check `registry.ts` and every `game.ts`
before calling any path dead; count test + e2e + golden rows per surface; and where the pass-2 map
asserted a number, re-measure it rather than restate it.

**The four trees:**

| tree | path | lane | HEAD | working set |
|---|---|---|---|---|
| MAIN | `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion` | **D** | **`6800af04`** | 14 M/D + 3 `??` |
| wt-1 | `…/.claude/worktrees/wf_6e1b18f4-0f2-1` | **A** (F4 ritual) | `32198688` | 7 M + 2 `??` |
| wt-2 | `…/.claude/worktrees/wf_6e1b18f4-0f2-2` | **B** (F1 strata) | `32198688` | 7 M/D |
| wt-3 | `…/.claude/worktrees/wf_6e1b18f4-0f2-3` | **C** (F2 tray) | `32198688` | 13 M/D + 1 `??` |

**The three worktrees are 13 commits behind MAIN.** That is now the dominant collision in this
document: A, B and C each hold a diff against a base whose `GameControlPanel.vue`, `index.css`,
`OptionSelector.vue`, `GameScene.vue` and `typography.css` have all moved underneath them. None
of their hunks can be read — let alone merged — before a rebase onto `6800af04`.

---

## 0 · GOLDEN RADIUS — still zero, re-derived

The 4 committed subjects (×darwin/linux) are unchanged by P1: `logo-light`
(`visual-golden.spec.ts:182`, `svg.handwritten-logo`), `toggle-crest-dark` (`:206`, 110×110 clip
on `button.sun-moon-toggle`), `cell-light` (`:212`, `.sudoku-cell` first), `grid-corner-light`
(`:223`, 180×180 corner of `.board-wrapper`).

**No golden clips a control panel, drawer tab, washi tape, option chip, legend, tally, note,
gallery card, or staging band.** No pass-3 work order in A, B, C, D or the F3 carrier touches a
golden subject. Lane D's pass-3 estate — Deal's box, the legend, the note, the vignette, the
tally, the ink tokens — is clear of all four clips, and the P1 goldens were re-minted and held at
`ac59be9d`.

Corollary, unchanged: the linux sun-crest coarse floor (0.05) and the darwin soul floor (0.017)
are not in play. Do not re-baseline anything.

---

## 1 · IMPORT CYCLES — the TDZ boot rule, now **gated**

`registry.ts` statically imports `SudokuGame.vue` (`:24`, the eager-game asymmetry) **and**
`sudokuGame` from `sudoku/game.ts` (`:18`), while `App.vue` imports `SudokuGame.vue` before
`GAMES`. Adding `import { sudokuGame } from "./game"` to `SudokuGame.vue` closes
`SudokuGame.vue → game.ts → registry.ts → SudokuGame.vue`; `registry.ts`'s body then evaluates
`gameRegistry = { sudoku: sudokuGame }` with that const in its TDZ:

```
ReferenceError: Cannot access 'sudokuGame' before initialization
```

The app does not boot. **Rule, binding on every lane:** the four LAZY scenes (`futoshiki`,
`thermo`, `killer`, `kenken`) may import their own `game.ts` freely — they resolve after
`registry.ts` finishes. **`SudokuGame.vue` may not.** It builds `sections` from
`./ControlPanel/constants` (`SudokuGame.vue:38-66` (comment `:38-49`, list `:50-66`), reason written at the site).

**NEW — the duplication the rule forces is no longer guarded by prose.**
`src/games/sudoku/game.test.ts` (Lane D ship 3, 2 rows) mounts the scene with a `GameScene` stub
that renders the named `controls` slot, and requires the scene's list to equal
`sudokuGame.options(model)` in **shape** and in **what each `onChange` moves**. Negative controls
run and fire: dropping `ariaLabel` reds row 1; rewiring the difficulty handler reds row 2.
Any lane editing either side of that copy will hear about it in vitest.

The three `constants.ts` remain the most load-bearing non-component files in the estate:

| file | imported by (MAIN) |
|---|---|
| `sudoku/ControlPanel/constants.ts` | `registry.ts:25`, `sudoku/game.ts:14`, `sudoku/SudokuGame.vue:18`, `thermo/game.ts:18`, `killer/game.ts:19` |
| `futoshiki/ControlPanel/constants.ts` | `registry.ts:26`, `futoshiki/game.ts:16` |
| `kenken/ControlPanel/constants.ts` | `registry.ts:30`, `kenken/game.ts:20` |

**Never price a `ControlPanel/` directory as deletable** — only the four `ControlPanel.vue` /
`ControlPanel.test.ts` files were dead. Re-derived at `6800af04`: **419 LOC exactly** (99 + 114 +
100 + 106), zero importers, knip green after. Lane D has deleted them in MAIN.

Lane A additionally made `staging` a REQUIRED field on `GameCard` (wt-1 `registry.ts:181`) and
widened the `difficultyOptions` edge on all three `constants.ts`. Both edits land in the file the
TDZ rule guards; A owns both edges, on a rebased tree.

---

## 2 · WHAT P1 CHANGED UNDER EVERY LANE (read this before your own §)

### 2.1 The reference filters are GONE — mark 4's whole terrain moved

`6b8c1ffd` (P1-W3 group A) deleted, at source, on the owner's C/C/C ruling:

| surface | what left |
|---|---|
| `.control-panel-filtered` | `filter: url(#stroke-light/-dark)` **and** `will-change: transform`. The class survives as the structural hook the templates and `visual-regression.spec.ts` address; it carries **no paint** (`GameControlPanel.vue:723-725`, `display: block`). |
| `.icon-btn` | its filter, its `:hover` celestial wobble, and `transition: all 150ms` → `background-color, color` |
| `.section-heading:hover` | the wobble flourish, entirely |
| `OptionSelector` `.ctrl-btn:hover` | **the `filter: url(#wobble-heart)` wobble, deleted** (`:70-75` is now the tombstone comment); `transition-all` → `transition-colors` |
| `HandwrittenGlyph` | the `:filter` binding, `grainOn`, all six hoist/restore sites (63–81 chains → 0) |
| `ScribbleLoader` | its filter (48 re-executions/s during a solve → 0) |

Three pass-2 mark-4 charges are therefore **moot on this tree, not cured by their lanes**:

- **Lane A's composition breach** — the band imports `OptionSelector`, and the hover filter it
  was importing no longer exists. A's order 4 is discharged by the base tree; A still owes the
  *census* run, not the fix.
- **Lane D ship 1's "+10.4px inside a live SVG-filtered subtree"** — there is no filtered
  subtree, and §2.3 measures the wrapper's box at zero growth besides.
- **Lane B's "grain-static Deal box growth"** — same two reasons.

### 2.2 The rendered filter census the pass-2 registry ORDERED already exists

Registry §4 retired the grep gate and specified a successor: *"in the built DOM, per regime, count
live filtered surfaces AND their union raster area; threshold = zero new surfaces; negative
control = an injected filtered node must fire."* It is built and shipped:

- `src/pencil/config/filterBudget.ts` — the population of record, an **exact-match allowlist**
  (never a ceiling), per row, with the reason each surface is allowed. `FILTER_BUDGET_TOTAL` = **9**
  after the P1-W4 panel-twin `v-if` (14 before it; the charter ceiling stays 14 and does not follow
  the total down).
- `e2e/filter-census.spec.ts` — 3 rows against the **BUILT dist**, `retries: 0` (a retried census
  lies), in the `playwright-throttle.config.ts` bundled-preview lane.

**Every lane must run it, and it fires on addition even when something else retires.** It is the
cheapest real mark-4 witness in the estate: `PLAYWRIGHT_BASE_URL=… npx playwright test --config
playwright-throttle.config.ts --project filter-census`. Green on Lane D's pass-3 tree.

### 2.3 Ship 1's price, MEASURED — the pass-2 critique's §6 closure

One build, both engines, both regimes; BEFORE reproduced in-page by pinning the button back to the
base block's fixed square (`rig/deal-box.mjs`, `rig/deal-box.json`):

| box | fine 1440×900 before → after (chromium · webkit) | coarse iPhone 13 |
|---|---|---|
| `.deal-btn` | 44×44 → **55.94×54.38** · 44×44 → **55.95×54.36** | **44×52.16, unchanged** |
| its die `svg` | 28×**17.63** → 28×28 · 28×**17.64** → 28×28 | 28×28, unchanged |
| `.control-panel-filtered` | 241×359.78 → **241×359.78** · 241.03×359.73 → **241.03×359.73** | 350×126.02, unchanged |
| `.controls-card` **box** | 281×640 → **281×640** (clientH 640, a clipped column) | — |
| `.controls-card` **scrollHeight** | 1028 → **1038 (+10)** · same | — |

So: **+11.94w / +10.38h on the button, zero growth on the wrapper, zero growth on the card's box,
and +10px of scroll.** The card is a clipped column at fine, so the whole of Deal's growth is
spent as scroll, not layout — which is a **live collision with Lane B's G1** (`RESULTS` §2 G1:
495px of scroll on `dist-base`) and is booked here as **card scrollHeight**, the row the pass-2
map was charged with omitting.

`.deal-btn` geometry is now gated: `visual-regression.spec.ts` *"the Deal die is not crushed"* —
die squareness ≤0.5px, die ≥27px, and `btn.h ≥ die.h + label.h` (the general form: it fails for any
cause, not just the cascade tie). GATE-1 negative control run against a build patched back to the
bare `.deal-btn` selector: **RED**, then GREEN on the fix.

### 2.4 The `.deal-btn` mechanism is settled — C's form, D's tree

Registry §5 required one mechanism. **`.icon-btn.deal-btn` (0,2,0) ships** — Lane C's and Lane B's
independent choice, adopted over Lane D's block move because it is order-proof: no future rule
under `.icon-btn` can re-break it, and the invariant needs no comment to survive.

The second bound the pass-2 critique named is closed structurally rather than by comment: the bump
also outranks the coarse `.icon-btn` block, so **Deal's coarse padding is restated inside that
block at matching specificity** (`0.3rem 0.5rem`) and the shipped touch pose stays byte-identical —
measured above. Widening Deal's mobile box to the fine `0.85rem` is a **design call, open**, not a
cascade repair, and it is not made.

### 2.5 The mobile card is IN FLOW — there is no drawer below 1024

Re-derived from source and confirmed in both engines at iPhone 13 geometry: `GameScene.vue` mounts
`#controls-drawer` **only** under `v-if="rowRegime"` (`useCoarsePointer.useRowRegime()`,
`(min-width: 1024px)`). Below that it mounts `.mobile-board-width.lg:hidden`, in flow under the
board, and `.drawer-tab` computes `display: none`. `document.querySelector('#controls-drawer')`
returns **null** on a phone.

Consequences, routed not resolved:
- Any probe that opens the drawer to reach the mobile panel is addressing an element that does not
  exist; the panel is at `.mobile-board-width .control-panel-filtered`.
- The **~280ms "drawer-open" stall** (RESULTS §3/§4.1, 274–284ms, σ≈4, both builds, real WebKit)
  cannot be a `#controls-drawer` glide at phone widths. Its attribution row must first name the
  regime it was measured in. This does not weaken the finding — the number is real and
  build-independent — it re-points the hypothesis (`useFlipGlide` FLIP forced layout + the
  three-pass stroke filter) at a filter that **P1 deleted**, so the measurement must be re-taken on
  the post-P1 dist before any cure is designed against it.

### 2.6 P1's new surfaces every lane now inherits

| surface | what it is | who must care |
|---|---|---|
| `src/pencil/config/filterBudget.ts` + `e2e/filter-census.spec.ts` | the mark-4 witness of record (§2.2) | **all** |
| `e2e/theme-bake-freshness.spec.ts` (G4.5, both engines) · `e2e/wordmark-integrity.spec.ts` (G3.4, WebKit) | baked-pose ink + baked wordmark integrity, built dist | anyone touching bakes, themes, type |
| `scripts/check-font-coverage.mjs` + `npm run test:font-coverage` (CI lint lane) | cmap ⟷ rendered corpus, both directions, proven able to RED | anyone touching strings, `text-transform`, or a face |
| `useCoarsePointer.mediaRef()/useRowRegime()` | ONE module-level MQL per query; the drawer's 1024 split, Tailwind `lg`, and the DOM regime are now one ref | B (`GameScene` `p-5→p-4`), C, F3 carrier |
| `GameScene.vue` twin `v-if` | only ONE control card is mounted at a time | **B and C both rewrite that card** |
| `typography.css:266-267` | `.section-heading` is `text-transform: lowercase`, tracking `--type-tracking-wide` | B's `.section-heading` rung work is against a MOVED rule |
| `fraunces-subset.woff2` 13,788 B (B2 ruled + shipped) | 28 codepoints, both cases | the font row is **EXECUTED**, not open |

### 2.7 The inbound `--sheet-washi-neutral` dark row — still open, still Lane D's

Defined twice: `index.css:290` (light) and `:420` (dark), both `--color-foreground` 6% over a
white-ish base. In dark, `--color-foreground` is itself light, so the tape reads as a **highlighter
strike across the word** rather than tape under it (RESULTS §3 M5, `laneC/C-TYPE-tape-dark.png`).
The 8.96:1 ratio does not capture it.

Exactly two consumers, both estate-wide: `SheetWashiLabel.vue:81`, `DrawerTab.vue:105`. Covered by
`share-truth.spec.ts` (text only), `mobile-affordances.spec.ts:280-282` (text only), `drawer.spec.ts`
(structural/aria only). **Zero assertions and zero goldens read this token's value** — a free edit
in test terms and a wide one in rendered terms. Gate it with `lint:ink` plus a dark device shot,
never with a spec. It must land **before** B folds the washi rung into its dominance table and
before C's tags are adjudicated in dark. **Not shipped this pass** — it needs the dark device shot
the locked screen still forecloses.

---

## 3 · COLLISION TABLE — re-derived at `6800af04`

| # | file / surface | lanes | shape of the collision |
|---|---|---|---|
| **C0** | **every worktree file** | **A · B · C** | **The three worktrees are 13 commits behind MAIN.** `GameControlPanel.vue` alone moved ±63 lines under them; `index.css` ±53; `OptionSelector.vue` ±16; `GameScene.vue` ±25; `typography.css` ±14. **Rebase onto `6800af04` before reading a single hunk.** This supersedes half of the pass-2 table. |
| **C1** | `src/games/shared/GameControlPanel.vue` | **B · C · D** | Still the highest-risk file. B rewrites ~683 lines of its old 969-line base; C adds ~416; D's pass-3 footprint is now **+27/−11** (the `.icon-btn.deal-btn` bump, its coarse restatement, the armed-sublabel token, one ramp literal → token). D's footprint is small enough that **B and C rebase onto D cheaply**; the reverse is not true. |
| **C2** | `.deal-btn` cascade | **RESOLVED** | `.icon-btn.deal-btn` ships (§2.4). B's `:700` and C's `:1048` bumps are now the same edit as MAIN's — on rebase they collapse to no-ops. D's block-move alternative is withdrawn on the record. |
| **C3** | `OptionSelector.vue` `mobile` prop | **B · A · C** | Unchanged and still live: **B DELETES the prop**; `StagingBand.vue:73,83` (A), MAIN `GameControlPanel.vue:372` and `:426` and wt-3's equivalent all pass it. `vue-tsc` is the only guard. B's row/column unification is the right call; it still has three consumers nobody has sequenced. |
| **C4** | `OptionSelector.vue` `.ctrl-btn` geometry | **B · A** | **Narrowed by P1.** The hover filter half of this collision is gone (§2.1), so A and B are no longer editing the same 14 lines from opposite directions. What remains is B's own G2 failure: `gap: .1rem` + `px-1.5` ⇒ a 1.6px neighbour gap against B's ≥6px threshold, in every row of every regime. |
| **C5** | `AssistSettings.vue`, `PencilModeToggle.vue` | **B · C** | Both delete both files (−91, −47). Identical intent, duplicated work; 138 LOC counted twice in any naive ledger sum. Both files are still present in MAIN. |
| **C6** | per-game `ControlPanel.{vue,test.ts}` ×4 | **D · C** | **D has deleted all four in MAIN; C MODIFIED all four in wt-3** (+3/+1 each). Delete-vs-modify. C's rebase (C0) dissolves it — the edits are to files that no longer exist. |
| **C7** | `SudokuGame.vue`, `FutoshikiGame.vue` | **D · C** | D rewires both for the wrapper deletion (+38/−8 and +12/−8) and now owns the equality gate (§1). C adds one line each. Small — but the TDZ rule binds `SudokuGame.vue` and neither lane's diff cites it. |
| **C8** | `SheetWashiLabel.vue` | **C · B · D** | Ordered, not contradictory: **C lands `anchor="tag"`, D lands the `--sheet-washi-neutral` dark arm (§2.7, still open), B consumes both.** |
| **C9** | `HandDrawnOutline.vue` | **B · C · A** | The shared primitive, unchanged by P1 beyond ±9 lines. The pose-prune (`will-change: opacity` on `.boil-pose`, the enrolment decision, `frameCount`) is needed by B (2× idle long-frames), C (six well mounts) and A (`StagingBand.vue:65`, `GameCard.vue:239`). Fix once; **three** lanes inherit. 9 consumers estate-wide. |
| **C10** | `e2e/visual-regression.spec.ts` | **D · B · C** | **D has landed its row** — the file is now 8 tests (`:428`, the Deal geometry row). B still owes the separation assertion and the ≥19 floor it loosened to 17 in the same diff; C owes the 44px-floor extension to the Size/Difficulty chips. Two lanes left in one spec, both additive. |
| **C11** | `src/assets/index.css` | **D · B** | D owns the token blocks (`--ink-press-*` `:229-269`, `--sheet-washi-neutral` `:290`/`:420`). B's orphan purge targets `.mobile-heading-btn` **inside the shared coarse rule** `@media (pointer: coarse) { .ctrl-btn, .mobile-heading-btn, .attribution-trigger, .error-note-retry { min-height: 2.75rem } }`. **Deleting the selector from that list is not a comment removal — it is the 44px floor B's own G2 depends on.** |
| **C12** | `GameScene.vue`, drawer spine | **B · F3 carrier** | B ships `p-5`→`p-4` on `.controls-card`; P1-W4 already rewrote that template's regime handling (twin `v-if` + `useRowRegime`). F3 owns the substrate — and §2.5 changes its brief: **there is no drawer to carry below 1024.** The 280ms stall still freezes new sheet motion, and now also needs re-measuring on the post-P1 dist. |

**Highest-risk shared file remains `web/frontend/src/games/shared/GameControlPanel.vue`** — the sole
home of `.deal-btn`, the `OptionSelector` call sites, the wells, the ticket, the G4 keypad padding,
and the only file guarded by *all* of `share-truth.spec.ts:57`'s positional `.nth(4)`,
`visual-regression.spec.ts` (now including the Deal row), `mobile-affordances.spec.ts` (10 rows),
and `GameControlPanel.test.ts` (**10 unit rows, MAIN only** — B and C have never seen it).

---

## 4 · MOVE-FAST TABLE — per pass-3 lane

### Lane A (F4 ritual)

| move fast — zero test/golden contact | tread |
|---|---|
| `useStagingBridge.ts` (new; **write the vitest**) | `registry.ts` — `registry.test.ts` GameCard contract + the §1 TDZ rule; `staging` is now required |
| `StagingBand.vue` (new; no e2e names it) | `GameGallery.vue` / `GameCard.vue` — `gallery.spec.ts` (8 rows), `gallery-guard.spec.ts` (6) |
| `GameGallery/types.ts` | `OptionSelector` consumption — **C3**; the hover-filter half of the mark-4 order is already discharged by P1 (§2.1), so A's remaining duty is to RUN the census, not fork the component |
| the `staging-ledger-v1` backfill (localStorage only) | `App.vue` boot order — the cycle's premise |

### Lane B (F1 strata)

| move fast | tread |
|---|---|
| `KeyboardLegend.vue`, `MarginNote.vue`, `CompletionVignette.vue`, `DifficultyTally.vue` — 0 goldens, 0 direct e2e (but D just re-tokenised all four: **rebase, don't re-derive**) | `OptionSelector.vue` — `visual-regression.spec.ts` (the floor B loosened) + `index.css` coarse min-height + A's StagingBand consumer |
| the AssistSettings stale comment | `index.css` coarse list — **C11, that is the 44px floor, not a comment** |
| the washi rung folded into the dominance table (docs) | `.section-heading` — **the rule MOVED at P1-W3** (lowercase, `--type-tracking-wide`); any rung argument written against the uppercase form is stale |
| — | `HandDrawnOutline.vue` pose-prune — **C9, three lanes**; `GameScene.vue` — **C12**, rewritten by P1-W4 |

### Lane C (F2 tray)

| move fast | tread |
|---|---|
| `CheckStatus.vue` (new; **write the six-branch vitest**) | `SheetWashiLabel.vue` — `mobile-affordances.spec.ts:280-282` + `share-truth.spec.ts` assert washi **text**; the `role` drop is the a11y-visible edit |
| `.tray-well` CSS block — 0 e2e, 0 goldens | per-game `ControlPanel.vue`/`.test.ts` — **C6: deleted in MAIN. Rebase first (C0).** |
| the inkmass instrument (scratchpad, not shipped) | `GameControlPanel.vue` — **C1** |
| the pen branch **deletion** (~42 lines, if M2 doesn't run) | the 44px chip-floor extension → `visual-regression.spec.ts` — **C10** |

### Lane D (infrastructure — gates the others' commits)

| move fast | tread |
|---|---|
| `scripts/check-ink-pressure.mjs` (`lint:ink`; **still not in CI** — standing team-lead row) | `--sheet-washi-neutral` dark (§2.7) — 0 assertions, 2 estate-wide consumers; gate on `lint:ink` + a dark device shot |
| `--ink-press-*` token block | `GameControlPanel.vue` — **C1** |
| `GameControlPanel.test.ts`, `sudoku/game.test.ts` (grow them — the only unit guards on the estate's hottest file and on the TDZ hand copy) | `visual-regression.spec.ts` — **C10** |

### F3 carrier (re-entering)

| move fast | tread |
|---|---|
| the sheet substrate's own new files | `useKeyboardViewport.ts` — `useKeyboardViewport.test.ts` consumes `computeKeyboardInset`/`computeScrollDelta` |
| the `--vv-height` anchor (**proven necessary** by B's G4 control) | `useControlsDrawer.ts` / `useFlipGlide.ts` / `scene.css` / `DrawerTab.vue` — `drawer.spec.ts` (6 rows), `mobile-platform.spec.ts` |
| the 296px keypad constant (measured, replaces 336) | **§2.5: there is no drawer below 1024.** And **no new sheet motion ships until the ~280ms stall is attributed** — which now also requires re-measuring it on the post-P1 dist, since its leading hypothesis names a filter P1 deleted. |

---

## 5 · SUGGESTED LANDING ORDER

0. **Rebase A, B and C onto `6800af04`** (C0). Nothing below is readable before this.
1. **D** — landed: the `.icon-btn.deal-btn` mechanism, the ink ladder + its falsifiable gate, the
   wrapper deletion + its equality gate, the Deal geometry row, this map. Outstanding: the
   `--sheet-washi-neutral` dark arm (blocked on a dark device shot) and `lint:ink` into CI.
2. **C** — rebase onto D (C6 evaporates), then the wells + `anchor="tag"` + `CheckStatus`.
3. **B** — rebase onto C, land the ticket over the wells, adopt `anchor="tag"`, restore the
   separation and the ≥19 floor, and **prune `HandDrawnOutline` once for all three lanes** (C9).
4. **A** — rebase onto B (C3 resolves: the `mobile` prop is gone, so the band takes B's single row
   form; C4's filter half is already discharged by P1).
5. **F3 carrier** — last, and only after the 280ms attribution is re-taken post-P1.

---

## 6 · GATES A LANE CAN RUN CHEAPLY

```
npm run lint:ink            # graphite ladder + armed sublabel + falsifiable --self-test; NOT in CI
npm run lint:eslint         # colocation boundaries
npm run lint:knip           # dead files/exports — the wrapper-deletion guard
npm run test:font-coverage  # cmap ⟷ rendered corpus, both directions
npx vue-tsc --noEmit        # the ONLY guard on C3 (the deleted `mobile` prop) and on registry `staging`
npx vitest run              # 301 unit / 29 files in MAIN
PLAYWRIGHT_BASE_URL=http://localhost:<port> npx playwright test <specs>
PLAYWRIGHT_BASE_URL=http://localhost:<port> npx playwright test --config playwright-throttle.config.ts \
  --project filter-census --project theme-bake-chromium --project theme-bake-webkit --project wordmark-webkit
```

Spec row counts, for pricing a change: `affordances` 10 · `mobile-affordances` 10 · `gallery` 8 ·
`mobile-platform` 8 · `visual-regression` 8 (was 7 — D's Deal row) · `sudoku-interaction` 7 ·
`drawer` 6 · `gallery-guard` 6 · `permalink` 6 · `share-truth` 5 · `futoshiki` 4 · `visual-golden`
4 · `filter-census` 3 · `wordmark-integrity` 2 · `theme-bake-freshness` 1 · `throttled-void` 1.
Default suite (the five built-dist specs are `testIgnore`d out of it): **78 executed**.

CI (`.github/workflows/ci.yml`) runs vue-tsc, eslint, knip, prettier, font-coverage, e2e, the
bundled-preview lane, goldens, golden-bytes, throttled-void — **it does not run vitest**, so unit
coverage is a gate-time count, not a CI gate. `lint:ink` is still not wired in.

**Ports:** `:3000` is squatted by a foreign palette-api — always set `PLAYWRIGHT_BASE_URL`
explicitly. `:4188` is the throttle config's own preview (kill any orphan before a built-dist run);
`:4894`/`:4895` are rig servers; `:3001`/`:4288` are reserved. Lane D's pass-3 evidence was taken
against a preview on `:4197`.

**Single-tree evidence is binding** (registry §6.4): every gate and shot retaken after the final
edit, one run, one artifact set.
