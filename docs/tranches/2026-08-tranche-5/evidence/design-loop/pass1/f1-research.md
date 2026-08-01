# F1 "CADENCE STRATA" — RESEARCH DOSSIER (pass 1)

Read-only pass over the shipped tree at `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend`.
No dev server touched; every pixel figure is token-derived arithmetic from the cited CSS (labelled ANALYTIC) or a
number the repo itself records (labelled RECORDED).

---

## Q1 — Inventory every control in `GameControlPanel.vue`, classify by cadence, verify against interaction

### The inventory (one rendered panel instance, sudoku)

| # | Control | Element | Cadence (charter) | Cadence (code says) |
|---|---|---|---|---|
| 1 | Size (3 opts) | `ctrl-btn` ×3 | per-game | per-game — **staged**, writes `pendingSize`, no live effect (`SudokuGame.vue:154`, `sudoku.pendingSize`) |
| 2 | Difficulty (3 opts) | `ctrl-btn` ×3 | per-game | per-game (staged) |
| 3 | Deal | `icon-btn deal-btn` | per-game | per-game, the commit |
| 4 | Marks Normal/Corner/Center | `ctrl-btn` ×3 | per-move | **per-move CONFIRMED** — the only settings-shaped control with a bare-key binding (`P`, `GameBoard.vue:438-441` → `cyclePencilMode`) |
| 5 | Check Off/Ask/Live | `ctrl-btn` ×3 | per-preference | **BIMODAL — see CONTRADICTION 1** |
| 6 | Candidates Off/On | `ctrl-btn` ×2 | per-preference | per-preference (default OFF, `useAssists.ts:66`) but HIG-classified task-scoped — see Q4 |
| 7 | Clear | `icon-btn` | per-game | per-game, dirty-gated two-tap on coarse (`GameControlPanel.vue:293-308`) |
| 8 | Fill forced | `icon-btn` | per-game | **per-move-ish**: a partial-solve act mid-solve, no confirm, no key |
| 9 | Solve | `icon-btn` | per-game | per-game (terminal) |
| 10 | Share | `icon-btn` | per-game | per-session |
| 11 | Undo | `icon-btn` (play-controls) | per-move | per-move CONFIRMED (`⌘Z`, `GameBoard.vue:417-428`) |
| 12 | Redo | `icon-btn` | per-move | per-move CONFIRMED (`⇧Z`) |
| 13 | Hint | `icon-btn` | per-move | per-move CONFIRMED (`H`, `GameBoard.vue:430-434`) |
| 14 | hold-to-peek | `.peek-hold-surface` (NOT a button) | per-move | per-move CONFIRMED (`K`/`Esc` via App.vue; `PEEK_HOLD_MS = 350`, `GameControlPanel.vue:157`) |
| — | KeyboardLegend | `<dl>`, 5 rows, non-interactive | — | desktop/fine only |

**The keyboard map is the cadence oracle.** `KeyboardLegend.vue:19-35` lists exactly five acts: `K` peek, `H` hint,
`P` pencil, `⌘/Ctrl Z` undo, `⇧Z` redo. Every one is a charter per-move control; nothing else in the panel has a key.
The per-move stratum is therefore already an identified set in the codebase — it is the keyboard set, minus nothing,
plus nothing. That is the strongest available verification of the classification, and it is first-party.

**Counter-evidence the charter should absorb**: `Fill forced` (#8) has no key and no confirm and acts on the CURRENT
board mid-solve. It sits in the "live action row" beside Clear/Solve/Share by placement but behaves per-move. It is
the one control whose stratum assignment the code does not settle.

### Button census (measured by grep + template read)

- `class="icon-btn` occurrences in `GameControlPanel.vue`: **16** (8 per branch × 2 branches).
- `<OptionSelector` mounts: **2** (both inside the `v-for` over `sections`); `section-heading` occurrences: **9**.
- Rendered interactive elements per panel instance, sudoku:
  - mobile branch: 2 tabs + 6 staged `ctrl-btn` + 1 Deal + 3 Marks + 5 Assist + 4 action + 3 play = **24 buttons**
  - desktop branch: 6 + 1 + 3 + 5 + 4 + 3 = **22 buttons** (+ 5 non-interactive legend rows)
- **`GameScene.vue` renders `<slot name="controls">` TWICE** (`GameScene.vue:83` stacked card, `GameScene.vue:102`
  rail card) → every game mounts **two** `GameControlPanel` instances simultaneously, so the live DOM carries
  **46 buttons and 12 `<h2>`s** for a two-section game, one set always hidden by `lg:hidden` / `hidden lg:flex`.
  The component itself acknowledges the double mount: *"each game mounts two panels — mobile card + desktop rail — so
  a static id would collide"* (`GameControlPanel.vue:239-240`, the `useId()` for `newGameId`).

### "~7 near-identical stanzas" (brief item 2) — measured

Exactly **5** `heading + OptionSelector` stanzas render per panel (Size, Difficulty, Marks, Check, Candidates),
plus the "New game" eyebrow and the `.deal-row` = **7 blocks**. The brief's count is right; the precise
stanza figure is 5. Three of the five come from OUTSIDE the shell (`PencilModeToggle.vue:36-45`,
`AssistSettings.vue:60-89`) and are visually indistinguishable from the two that come from game data — same
`.section-heading`, same `OptionSelector`, same `:boil-frame="0"` (only the game sections get a live boil frame,
`GameControlPanel.vue:379` vs `AssistSettings.vue:67`). **The only differentiator between staging and preference
today is the boil on the underline** — a 120ms×4 flicker nobody reads as hierarchy.

---

## Q2 — Per-move toolbar at the board's edge: inside `.board-peek-host` or outside?

### What living inside the host actually buys, and what it costs

**Buys (verified):**
1. The gallery fold for free — the whole host is the Teleport mover (`GameScene.vue:65-77`), so a child travels into
   the centre card's live face with the board.
2. A one-rule kill switch on the card face. The precedent is exact and is one selector:
   `.board-peek-host.in-live-face :deep(.drawer-tab) { display: none; }` (`GameScene.vue:126-128`). A toolbar needs the
   same rule and nothing else. Note `.in-live-face` already sets `pointer-events: none` on the whole host
   (`GameScene.vue:119-123`), so an un-killed toolbar would be visible-but-dead on the card face — visual noise, not a
   functional bug.

**Costs (three, all load-bearing, none mentioned in the charter):**

1. **The host's glide mover is translate + SCALE, not translate.** `useControlsDrawer.ts:211-216` pushes
   `from: flipTransform(firstH, lastH)` for the host. The `DrawerTab` exists as a *fourth WAAPI mover whose only job is
   to undo that scale*:
   ```ts
   const hostScale = firstH.width / lastH.width;
   specs.push({ el: tab, from: `translateY(-50%) scale(${1 / hostScale})`, to: `translateY(-50%) scale(1)` });
   ```
   (`useControlsDrawer.ts:228-236`; the rationale is spelled out at `DrawerTab.vue:74-79`). A toolbar inside the host
   therefore does NOT "ride the drawer glide for free" — it rides it *distorted* for 520ms unless it gets its own
   counter-scale mover, i.e. a fifth `FlipMover` in the drawer engine. The scale is real: `html.drawer-closed` grows
   the shell from `min(42rem,85vw)` → `min(46rem,85vw)` at the md rung (`GameBoard.vue:849-852`), ≈ 1.095× on a wide
   desktop.
2. **The host shrink-wraps the board box on purpose.** `.board-peek-host { position: relative; display: flex; }`
   (`scene.css:110-113`) and the doc comment: *"The host tightly wraps the board box so the laminate's `inset:0` aligns
   to `.board-cells`"* (`GameScene.vue:57-59`). `AnswerKeyLaminate` is a sibling of the board inside the same slot
   (`SudokuGame.vue:143-150`) and positions `absolute; inset: 0` (`AnswerKeyLaminate.vue:247-248`). An **in-flow**
   toolbar child would become a second flex item, widen the host, and de-align the peek laminate across all five games.
   The toolbar must be `position: absolute` — which is exactly what `DrawerTab` does (`DrawerTab.vue:50-66`,
   `left: calc(100% - 0.5rem); top: 50%; z-index: -1`).
3. **z-order is already spoken for.** ≥1024: `.board-peek-host { z-index: 20 }`, `.scene-controls { z-index: 10 }`
   (`scene.css:62-69`), `.controls-card { z-index: 45 }` (`scene.css:115-118`), `.board-margin { z-index: 50 }`
   (`GameBoard.vue:824-832`), `.corner-right { z-index: 60 }` (`App.vue:461`). `DrawerTab` uses `z-index: -1` *within*
   the host so the board's opaque paper covers it. A toolbar wanting to be visible must be `z ≥ 0` inside the host —
   i.e. above the board's paper — which is a different painting story from the tab's and must not collide with
   `.board-margin`'s z-50 overlay strip.

**Verdict (evidence, not preference):** inside the host is correct for the gallery + drawer coupling, but only as an
`position:absolute` child with (a) an added `.in-live-face` display:none rule, (b) an added counter-scale
`FlipMover` in `useControlsDrawer.glide()`. Cost: ~8 lines of CSS + ~7 lines in the drawer engine. That is cheap and
the precedent is byte-for-byte available.

### What happens on the card face
`.in-live-face` → host `pointer-events: none`; `.live-face-fit` owns an absolute-centre + `scale(--live-fit)` shrink
(`GameScene.vue:112-118`, `GameCard.vue:247, 317-327`). So the toolbar would be scaled down with the board and dead to
the pointer. `display:none` is the only correct treatment and it matches the tab.

---

## Q3 — The per-game "ticket": ONE composed object, n-section-generic

### The generic contract as it actually stands

`ControlSection` (`GameControlPanel.vue:11-25`) is `{ key, heading, ariaLabel?, options[], selected, onChange }`.
The registry types the supplier as `options: (model: TBoard) => ControlSection[]` (`registry.ts:101`).

**Measured: all five shipped games supply exactly n = 2 sections.**
- sudoku `ControlPanel.vue:59-75` — size (3 opts) + difficulty (3)
- futoshiki `ControlPanel.vue:60-75` — boardSize (4) + difficulty (3)
- thermo `game.ts:35-51`, killer `game.ts:36-52`, kenken `game.ts:38-54` — size/boardSize (3) + difficulty (3)

Consequence: `showTabs = computed(() => props.sections.length >= 2)` (`GameControlPanel.vue:127`) is **always true in
product**, and the `v-if="!showTabs"` single-section branch (`GameControlPanel.vue:366-374`) plus the
`<hr v-if="i > 0">` desktop divider (`:541`) are the only n-generic machinery — none of it is exercised by any shipped
game. The ticket can be designed for n=2 as the *only real* shape while keeping the n-generic escape hatch, and the
n=1 path costs ~10 lines today.

### The number that makes the ticket urgent: the desktop selector is VERTICAL

`OptionSelector.vue:28`:
```
:class="mobile ? 'options-row' : 'flex flex-col items-center md:items-stretch'"
```
Mobile = one horizontal `.options-row`. **Desktop = a vertical column of buttons.** So the desktop drawer card renders
**14 stacked option rows** for sudoku (3+3+3+3+2) and **15** for futoshiki — one row per option, five headings between
them. That, not the stanza count, is why the desktop card is 936px tall (see MEASUREMENTS). Any "ticket" that keeps
`OptionSelector`'s non-mobile branch inherits the column; a ticket that reads as one object must use the
`options-row` (horizontal) form at desktop too, or the family's own real-estate claim fails.

### The staging semantics are already right and must not be disturbed
`pendingSize` (not `size`) is what the section writes (`SudokuGame.vue:154`, thermo/killer/kenken `m.pendingSize`), and
difficulty writes live but affects only the NEXT deal. The zone's doc calls this **arm-not-live**
(`GameControlPanel.vue:331-334`). The ticket inherits this for free; nothing new is needed.
`role="group"` + `aria-labelledby=useId()` is the inherited a11y obligation (`GameControlPanel.vue:335, 241`).

---

## Q4 — The per-preference retreat: where do Check/Candidates go?

### Prior art delivers a verdict AGAINST the charter's framing
Apple HIG, *Settings* pattern: *"Task-specific options should be made available in the screens they affect without
requiring people to go to a separate settings area, such as options for showing or hiding parts of the interface…
putting such options in a separate settings area disconnects them from their context"*; only *"rarely-changed options
that affect the experience as a whole"* belong in a settings area.
**Candidates is literally the HIG's own example** — showing/hiding a part of the interface (the engine's surviving
domains). Exiling it to a flip-side or a ticket corner is the anti-pattern the HIG names. The correct retreat for
Candidates is *toward the board*, not away from it.

### `MarginNote.vue` cannot host either control — hard refusal
The charter offers "a margin note (`MarginNote.vue` exists)". It cannot:
- `.margin-note-block { pointer-events: none; }` (`MarginNote.vue:85-87`) and `.margin-note` repeats it (`:109`).
- It is a **live region**: `role="status" aria-live="polite" aria-atomic="true"` (`MarginNote.vue:52-56`). Interactive
  controls inside a polite atomic live region get re-announced on every text change; the file's own doctrine forbids
  the mixing — *"the tally … deliberately OUTSIDE the live region"* (`:79`).
- It is **derivation-free by contract** (`:11-13`) and mounted inside `GameBoard.vue:753`, not the panel.
The only precedent for re-enabling pointers there is `.margin-note-meta { pointer-events: auto; }` (`:160`) for
*selectable text*. A control host in the margin must be a **new sibling** of `MarginNote` inside `.board-margin`
(`GameBoard.vue:748-760`, which already carries `DifficultyTally` + `MarginNote` + `SolverErrorNote`), and
`.board-margin` is `pointer-events: none` (`GameBoard.vue:812-821`) with `z-index: 50` overlay behaviour ≥1024.

### The seam that constrains any replacement control
`errorCheckMode` is a manual prop+emit **because** `OptionSelector` emits on every click unconditionally
(`OptionSelector.vue:30`: `@click="emit('change', opt.value)"`), and the same-value re-emit is the on-demand re-arm:
`defineModel`'s `hasChanged` guard would swallow it (`GameControlPanel.vue:80-83`, `AssistSettings.vue:18-21`).
**Any control that replaces the Check row must emit on every activation, including a same-value one.** A native
`<select>`, a checkbox, or a `defineModel` toggle all break the feature silently.

---

## Q5 — Mobile: thumb-reach row + does the remaining card stop scrolling?

### The charter's cited cap does not govern mobile — see CONTRADICTION 2
`.controls-card { max-height: …; overflow-y: auto }` (`scene.css:41-46`) applies to the **row-regime rail card only**;
the file says so: *"Row-regime only: `.controls-card` lives inside the hidden `lg:flex` rail"* (`scene.css:39`), and
`GameScene.vue:101` puts the class inside `class="scene-controls hidden lg:flex"`. The **mobile** card is
`.mobile-board-width` (`GameScene.vue:80-86`), styled only `width: min(42rem, calc(100vw - 1.5rem))`
(`scene.css:120-122`) — **no max-height, no overflow**. The mobile card never scrolls internally; it grows and the
PAGE scrolls. e2e agrees: `drawer.spec.ts:286-287` asserts only visibility of `.mobile-board-width`, and no spec in
`e2e/` asserts a scroll height anywhere.

### ANALYTIC mobile stack, iPhone 13 (390 CSS px wide), sudoku 9×9
See MEASUREMENTS for the derivation. Today ≈ **1080px** of content against a ≈664px visible Safari viewport
(844 device height minus chrome) — ≈ **1.6 viewports**.
Stripping the two per-preference stanzas (−147px), the play-tools row (−56px) and compressing the staged stanzas into a
ticket (−60px) yields a card of ≈ **302px** and a page of ≈ **715px**. **The scroll is NOT killed**: still ~50px over
the visible viewport and only comfortable at the full 844 device height. Killing it requires also shrinking the board
(366px square) or overlaying the thumb row on the board rather than adding it below.

### The thumb row's real hazard: the OS keyboard, not the fold
Cell entry is a native `<input inputmode="numeric">` (`mobile-affordances.spec.ts:3-8`), so **touching a cell raises the
OS keypad**. `useKeyboardViewport.ts` publishes the occlusion as `--keyboard-inset` and `App.vue:552-560` turns it into
bottom padding, and `ensureVisible()` scrolls the **focused cell** — not any toolbar — clear of the band
(`useKeyboardViewport.ts:87-98`). A per-move row placed *below the board in flow* is therefore occluded by the keyboard
during exactly the interaction it serves. Positions that survive: `position: fixed` above `--keyboard-inset`; or the
board's **top/side** edge, which the scroll-to-cell logic lifts INTO view rather than out of it.

Procreate's precedent is the side edge for exactly this reason (undo/redo + brush size on the vertical sidebar, reachable
by the free hand, and *repositionable* left/right for handedness) — a board-edge vertical strip is the closer analogue
to this app's geometry than NYT's bottom bar, and it dodges the keyboard entirely. Handedness is then an open question
(Procreate ships a setting; this app has no such preference surface).

---

## Q6 — Parsimony: how much of the 1025 lines dissolves? Does net LOC fall?

### File anatomy (measured)
| Region | Lines | Notes |
|---|---|---|
| `<script lang="ts">` (the `ControlSection` interface) | 1–26 (26) | 15 of them comment |
| `<script setup>` | 28–326 (299) | **80 comment lines** |
| `<template>` | 328–711 (384) | 22 HTML comment blocks / 54 comment lines |
| `<style scoped>` | 713–1025 (313) | heavy provenance comments |
| **total** | **1025** | |

### The duplication, quantified
Mobile branch = template lines 330–526; desktop branch = 529–710. Stripping comments + blank lines and diffing by
`difflib.SequenceMatcher`: **160 vs 150 code lines, 122 identical → 76.2% of the larger branch is duplicate.**
The two branches differ almost only in (a) the mobile tab-toggle, (b) the 5 desktop `SheetWashiLabel`s, (c) the
`KeyboardLegend`, (d) flex utility classes.

### Honest LOC ledger for F1
Available deletions:
- unify the two template branches: **−122**
- the never-exercised n=1 path (`showTabs` + `v-if="!showTabs"` block): **−10**
- dead exported API in `useAssists.ts` — `ERROR_CHECK_CYCLE` + `cycleErrorCheckMode` + `toggleCandidates` have **zero
  consumers** anywhere in `src/` (grep: only the file itself + its own test): **−13**
- the `.controls-card` cap + its 12-line provenance comment, IF the desktop scroll dies: **−18**
- doubled labelling on desktop icon-btns (`SheetWashiLabel` ×5 alongside `.icon-sublabel`): **−5 to −15**

Additions the family requires: a board-edge toolbar component (~80–120 incl. absolute positioning, PRM, coarse floor,
`in-live-face` rule), a ticket component (~100–150), the fifth `FlipMover` (~7).

**Verdict: F1 is LOC-neutral-to-POSITIVE unless it collapses the mobile/desktop template branches in the same move.**
The 122-line duplicate is the only deletion large enough to pay for the two new components. This should be treated as
a *requirement* of the family, not a bonus.

---

## Q7 — Mark-coverage claims: which hold up

- **Mark 2 ("the drawer shrinks, the 520ms glide reads cleaner without retuning") — VERIFIED structurally.** The rail
  mover is translate-only from measured rects (`useControlsDrawer.ts:222-226`) and the parked pose is
  `top: 50%; right: 3rem; translate: 0 -50%` (`scene.css:83-89`) — centre-anchored, so a shorter card yields the same
  horizontal delta and the same near-zero vertical component the engine doc claims (*"its ~3px absolute drift IS the
  sheet's own center drift"*, `useControlsDrawer.ts:39-42`). No retune needed. Also: the parked pose rides the
  `translate:` **channel**, never `transform` — a new mover must not touch `translate` or it re-creates the F1 phantom
  the comment guards against (`scene.css:76-82`).
- **Mark 4 (no new live-filter surfaces) — the toolbar can comply, but the panel's current grammar cannot be copied
  verbatim.** `.icon-btn { filter: url(#grain-static) }` unconditionally (`GameControlPanel.vue:816`) and
  `:hover` swaps to `url(#wobble-celestial)` (`:824-826`); `.section-heading:hover` → `url(#wobble-heart)` (`:798-802`);
  `.ctrl-btn:hover` → `url(#wobble-heart)` (`OptionSelector.vue:75-79`). These are *frozen one-pose* filters by
  ruling (T3-W13 §1-P4-ii, quoted at `:793-797`), so reusing `.icon-btn` for the toolbar adds no live painter — but any
  NEW filtered pose must go through the pose-bake pipeline.
- **Brief item 5 ("the tab is a static tongue") — half false.** The tab has a WAAPI counter-scale mover during every
  glide (`useControlsDrawer.ts:228-236`) and a hover rotate transition (`DrawerTab.vue:109-114`). What IS frozen freight
  is the *card's contents*: the rail gets one translate mover and no child of it has a mover of its own.

---

## MEASUREMENTS

### LOC (wc -l)
```
1025  src/games/shared/GameControlPanel.vue
 859  src/games/shared/GameBoard.vue
 433  src/pencil/chrome/GameGallery/GameCard.vue
 335  src/games/shared/DifficultyTally.vue
 204  src/games/shared/PosterBoard.vue
 180  src/pencil/chrome/MarginNote.vue
 175  src/games/shared/scene.css
 133  src/games/shared/SolverErrorNote.vue
 129  src/games/shared/GameScene.vue
 126  src/games/shared/DrawerTab.vue
 114  src/pencil/chrome/OptionSelector/OptionSelector.vue
 107  src/pencil/chrome/KeyboardLegend.vue
 100  src/games/futoshiki/ControlPanel/ControlPanel.vue
  99  src/games/sudoku/ControlPanel/ControlPanel.vue
  91  src/games/shared/AssistSettings.vue
  47  src/games/shared/PencilModeToggle.vue
```
Panel-system total (shell + the two thin panels + the two shared toggles + OptionSelector + legend): **1583**.

### Template-branch duplication
mobile 160 code lines · desktop 150 · **122 identical (76.2%)**. Raw `diff` = 133 changed lines of 379.

### Control-density census
| | mobile branch | desktop branch | in DOM (both mounted) |
|---|---|---|---|
| buttons (sudoku) | 24 | 22 | **46** |
| buttons (futoshiki) | 25 | 23 | 48 |
| `<h2 class="section-heading">` | 6 | 6 | **12** |
| `OptionSelector` rows | 5 horizontal | 5 **vertical columns** = 14 stacked option rows | 19 |
| `SheetWashiLabel` | 1 (peek) | 6 | 7 |

### Desktop `.controls-card` — it already overflows, by a lot
- Cap: `max-height: calc(min(42rem, 85vw, 100dvh - 10rem) - 2rem)` (`scene.css:42`).
  → 1024×768: **576px**. 1440×900: **640px**. 1920×1200: **640px** (the 42rem arm binds).
- Content: **936px RECORDED** — `scene.css:29-33` states the assist rows *"grew the card past the sheet (936px against
  an 800px viewport …)"*, which is why the cap + `overflow-y: auto` exist. My ANALYTIC recomputation from the type
  tokens agrees at ≈940px (`.section-heading` = 25.9px×1.2 ≥md, `typography.css:36,262-265`; 14 vertical option rows
  at ≈31px; `p-5` = 40px).
- **⇒ the desktop drawer card scrolls ~300–360px TODAY at every viewport.** F1 must remove ≈300px to kill it.
  Removing the two assist stanzas (−233px) plus stanza chrome from the staged zone (−84px) lands ≈620px: **under the
  640 cap at ≥900px-tall viewports, still over the 576 cap at 768.**

### ANALYTIC mobile stack — iPhone 13, 390×844 (visible ≈664 with Safari chrome), sudoku 9×9
Token basis: `--type-caption` = 12.18px, `--type-body` = 16px, `--type-subheading` = 20.4px @390
(`typography.css:31-36`); `.section-heading` @<768 = 20.4×1.2 = **24.5px** (`typography.css:251-254`).

| Element | px | source |
|---|---|---|
| `main-content` pad-top | 4 | `App.vue:566-568` |
| masthead (`--logo-height: 3.9rem` ≤480 + `margin-top: .75rem`) | 74 | `HandwrittenLogo.vue:312`, `App.vue:486-488` |
| board square `min(42rem, 100vw − 1.5rem)` = 366 | 366 | `GameBoard.vue:217` |
| `.board-margin` (mt .4rem + note min-height 1.3em) | 27 | `GameBoard.vue:812-821`, `MarginNote.vue:107` |
| `.app-layout` gap 1.25rem | 20 | `scene.css:125-131` |
| **controls card** | **565** | breakdown below |
| `main-content` pad-bottom | 8 | `App.vue:566-568` |
| **total** | **≈1064–1080** | vs **664 visible** ⇒ ~1.6 viewports |

Controls-card breakdown (565): `mt-3` 12 · new-game heading 30 · tab row 37.5 · staged `options-row` 41 ·
`.deal-row` 61.8 (`margin-top: .6rem` + coarse column btn 52.2) · peek surface 46 (`padding-block: 1rem` ×2 +
14px divider — `GameControlPanel.vue:874-877`, `BoilDivider.vue:96-99`) · Marks 69.5 · **Assists 147** ·
action row 52.2 · play-controls 55.8 · card `py-1.5` 12.

After the strata move: card ≈ **302** (−147 assists, −56 play tools, −60 staged chrome) → page ≈ **715**.

### Tap-floor budget already asserted by e2e (must survive)
- undo/redo/hint ≥44×44 — `mobile-affordances.spec.ts:162,181-183`
- `.peek-hold-surface` ≥44 tall — `mobile-affordances.spec.ts:268,283-284`
- `.drawer-tab` 48×92 — `DrawerTab.vue:57-58`, 13 e2e references
- `.icon-btn` 2.75rem = 44 (fine) / coarse column with min 44 — `GameControlPanel.vue:804-892`

### e2e selector budget (what a relocation breaks)
- `.controls-card`-scoped queries: **35** call sites across 8 specs. The scoping is a documented discipline:
  *"scope every control query to `.controls-card`… A bare aria-label ALSO resolves the hidden mobile panel's [twin]"*
  (`affordances.spec.ts:9`, `futoshiki.spec.ts:9-11`, `permalink.spec.ts:11`, `drawer.spec.ts:8`).
  **Any control that leaves `.controls-card` leaves every one of those locators' scope.**
- **Positional and brittle:** `share-truth.spec.ts:57` → `page.locator('.controls-card button.icon-btn').nth(4)`.
  Today's desktop `.icon-btn` order is `0 Deal · 1 Clear · 2 Fill · 3 Solve · 4 Share · 5 Undo · 6 Redo · 7 Hint`.
  Moving Deal into a ticket or the play tools to the board edge **shifts this index** and reds the share-truth spec.
- `.mobile-board-width` 2 refs; `.peek-hold-surface` 1; `.ctrl-btn` 1; `.icon-sublabel` 14.
- Visual goldens keyed to panel internals: `.controls-card .control-panel-wrap` (`visual-regression.spec.ts:138`),
  `.controls-card` (`:193, :352`), `.controls-card .control-panel-filtered` (`:216`) — a re-composition re-baselines
  these three goldens; the sun-crest/coarse-floor discipline applies.

---

## CONTRADICTIONS — where the code disagrees with the charter

**1. "Check flips maybe once a session" is FALSE for the default mode.** `useAssists.ts:38` sets the default to
`"on-demand"`, and `:44-46`:
```ts
function setErrorCheckMode(mode: ErrorCheckMode) {
  errorCheckMode.value = mode;
  // Entering (or re-tapping) on-demand IS the check act; off/live carry no snapshot.
  checkArmed.value = mode === "on-demand";
}
```
with `watch(values, () => (checkArmed.value = false), { deep: true })` at `:63` — **every board edit disarms it**.
So in the shipped default, "Ask" is a per-MOVE verb ("check my work now") that must be re-tapped after each entry,
wearing a preference control's clothes. The Off/Live segments are per-preference; the Ask segment is not.
*This is very likely the mechanical root of the owner's "contrived, not naturally integrated"* — the control fuses two
cadences into one segmented row. F1's per-preference retreat therefore cannot just relocate Check; it must **split** it
into a cadence selector (off/ask/live) and a per-move "check now" act that belongs in the per-move stratum.

**2. `scene.css`'s `.controls-card` max-height cap does NOT govern the mobile card.** The charter asks to "measure
whether the remaining mobile card shrinks enough to kill its scroll (`scene.css` `.controls-card` max-height cap)".
`.controls-card` is row-regime only (`scene.css:39`, `GameScene.vue:96,101` — inside `hidden lg:flex`). The mobile card
is `.mobile-board-width`, which has **no cap and no `overflow-y`** (`scene.css:120-122`). Mobile has no card scroll to
kill — it has a **page** scroll. The card that genuinely scrolls today is the **desktop** one, by ~300px.

**3. `MarginNote.vue` is not an available host for Check/Candidates.** `pointer-events: none` (`:85-87, :109`) and it is
a `role="status" aria-live="polite" aria-atomic="true"` live region (`:52-56`) whose own doctrine keeps even
non-interactive metadata outside the region (`:79`). The charter's "a margin note (`MarginNote.vue` exists)" option is
closed; a new sibling inside `.board-margin` is the real move, and that container is itself `pointer-events: none`
(`GameBoard.vue:812-821`).

**4. "Rides the drawer glide for free" understates the cost.** The host mover is translate+**scale**
(`useControlsDrawer.ts:211-216`); `DrawerTab` needs a dedicated counter-scale mover because of it (`:228-236`).
A toolbar inside the host needs a fifth mover or it distorts for 520ms.

**5. Prior art contradicts the "retreat" for Candidates.** Apple HIG's *Settings* pattern names *"options for showing or
hiding parts of the interface"* as precisely the class that must stay in context and NOT go to a settings area.
Candidates is that. A "flip-side of the panel" home for it is the documented anti-pattern.

**6. Brief item 5's "the tab is a static tongue" is inaccurate** — it counter-scales on every glide and un-rotates its
washi on hover (`useControlsDrawer.ts:228-236`, `DrawerTab.vue:109-114`). The frozen freight is the card's *contents*.

**7. Dead code the charter's LOC question should bank.** `ERROR_CHECK_CYCLE`, `cycleErrorCheckMode`, and
`toggleCandidates` (`useAssists.ts:34,47-50,70-72`) have **zero consumers** outside their own file and test — grep over
`src/` confirms only `setErrorCheckMode` and `setCandidatesPinned` are wired (`useGameState.ts:746,900`;
`*Game.vue @update:error-check-mode`). ~13 free lines.

**8. Minor, but the code contradicts its own stated rule.** `futoshiki/ControlPanel/constants.ts:5-6` and
`kenken/ControlPanel/constants.ts:4-5` both assert *"games never import each other['s] ControlPanel constants"*, yet
`thermo/game.ts:18` and `killer/game.ts:19` both do exactly that:
`import { sizeOptions, difficultyOptions } from "@games/sudoku/ControlPanel/constants";`.
`eslint.config.js` only fences sudoku↔futoshiki (`:58-99`), so this is unlinted. A ticket sourcing its option data
generically should not inherit the fiction that each game owns its own constants file — three of five don't.

---

## OPEN QUESTIONS

1. **Where does `Fill forced` live?** No key, no confirm, acts mid-solve on the current board. Per-move by behaviour,
   per-game by placement. The code does not settle it and neither does the charter.
2. **`Peek` is not a button.** `.peek-hold-surface` is a pointer-only gesture host that doubles as the staged/live zone
   divider (`GameControlPanel.vue:412-421`); its keyboard twin (`K`) lives in App.vue. If the divider dissolves with the
   stanza stack, the hold surface loses its host *and* the two strata lose their only visual boundary. Where does a
   350ms hold-to-peek live in the strata model, and does the toolbar inherit it?
3. **Handedness.** A board-edge vertical toolbar biases one thumb. Procreate ships a left/right setting; this app has no
   preference surface at all, and adding one contradicts F1's own "the drawer stops being the home of everything".
4. **The double mount.** Two `GameControlPanel` instances always live (`GameScene.vue:83,102`). Does F1 keep the doubled
   render for the ticket, or does the ticket become a single instance the two regimes reposition? The latter is where the
   122-line deletion lives; it also changes the `useId()` collision story (`GameControlPanel.vue:239-241`) and every
   `.controls-card`-scoped e2e locator's disambiguation premise (`affordances.spec.ts:9`).
5. **Golden re-baseline scope.** Three `.controls-card`-anchored goldens (`visual-regression.spec.ts:138,193,216`) plus
   the drawer specs. The standing rule is "never re-baseline on a single red" — so the re-baseline needs to be one
   deliberate act at the end of the tranche, on the runner artifact, not per-iteration.
6. **Unmeasured in-browser.** Every px figure here is token arithmetic or a number the repo records; no dev server was
   started (charter constraint). The 936px RECORDED figure corroborates the method to ~0.4%, but the mobile 1080px
   figure has never been checked against real Safari iOS and the T4-P1 rig exists to do exactly that.
