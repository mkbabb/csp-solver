# R2 — Mobile-UX census (E8 mobile-recut, RESEARCH)

**Lane**: R2 (mobile-UX census). **Charge**: inventory what exists at mobile geometry, the
digit-pad removal surface, and what the keypad's abrogation touches — NOT the redesign.
Census-only, no source edits.

**Method / provenance.** The working tree is mid-W4 (the excision is actively mutating
`DigitPad.vue`, both `ControlPanel.vue`s, the boards, and the cells), so every source anchor
and every live probe here is against the **SEALED HEAD `7393e7df`** ("T4-W3: the PWA comes
out whole…") via a detached `git worktree` at `/private/tmp/.../r2-wt-head` (removed after).
Live census ran a `vite build` of that HEAD (dist built clean, `✓ built in 422ms`) served by
`vite preview` on port **4159** (415x band — 3000/3001 untouched), driven by Playwright 1.61.1
across three profiles:

| profile | engine | viewport | DPR | isMobile/hasTouch |
|---|---|---|---|---|
| cr390 | chromium | 390×664 | 3 | yes (iPhone 13 descriptor) |
| cr375 | chromium | 375×667 | 2 | yes |
| wk390 | webkit | 390×664 | 3 | yes (iPhone 13 descriptor) |

All three resolve `(pointer: coarse)=true`, `(hover: hover)=false`, `(hover: none)=true`,
`(pointer: fine)=false` — the exact media the coarse affordances key on. `padActive`
(`coarse && stacked`) is live end-to-end. Probe scripts + raw JSON:
`/private/tmp/claude-504/r2-census.mjs`, `r2-followup.mjs`, `r2-attr.mjs`.

---

## §1 — The digit pad: removal-surface inventory

The pad (T3-W11 U-A, "ratified BUILD") is a **touch entry tray layered over an already-native
`<input>`** — not the input mechanism itself. It renders `v-if="padActive"` where
`padActive = coarse && stacked (<1024)`. It emits `digit`/`erase`, which the game routes to the
board's exposed `enterValue()` → the same `onCellUpdate` path as the keyboard (override rules,
murmur hold, undo recording all inherited). Full removal surface, line-anchored against HEAD:

| # | file | anchor | what it is | on removal | conf |
|---|---|---|---|---|---|
| 1 | `games/shared/DigitPad.vue` | whole file (248 L) | the tray component (key caps, glyphs, grid col logic, scoped CSS) | **delete** | High |
| 2 | `e2e/digit-pad.spec.ts` | whole file (208 L) | 3 tests: pad-lands/erase/given-override (sudoku), futoshiki twin, coarse affordances | **delete/re-home** (test 3 "coarse affordances" is peek-washi/sublabels/Clear-confirm — NOT pad-specific; keep those, drop pad tests) | High |
| 3 | `games/sudoku/SudokuGame.vue` | import L14; wiring L68–80 (`isCoarse`/`isStacked`/`padActive`/`boardRef`/`cellFocused`); template L172–178 (`<DigitPad>`); `:pad-active` L127; `@cell-focus-change` L128 | pad mount + enablement wiring | **excise pad block; decide fate of `padActive`** (it also gates `suppressVirtualKeyboard` — see §2) | High |
| 4 | `games/futoshiki/FutoshikiGame.vue` | import L17; wiring L67–~85; template L156–162; `:pad-active`; `@cell-focus-change` | **structural twin** of #3 | **excise twin** | High |
| 5 | `games/sudoku/SudokuBoard/SudokuBoard.vue` | `padActive` prop L59–61; `cellFocusChange` emit L75–77; DigitPad wiring L286–304 (`cellsEl`, `onCellsFocusIn/Out`, `enterValue`, `defineExpose({enterValue})`) | board-side pad plumbing + focusin/out reporter + the `enterValue` façade | **remove `padActive` prop + focus reporters + `enterValue` expose** (nothing else calls `enterValue`) | High |
| 6 | `games/futoshiki/FutoshikiBoard/FutoshikiBoard.vue` | prop L68–69; wiring L267–282 (`enterValue` L279, `defineExpose` L282) | twin of #5 | **remove twin** | High |
| 7 | `games/sudoku/SudokuBoard/SudokuCell/SudokuCell.vue` | `suppressVirtualKeyboard` prop L29–32; `:inputmode` bind L183 | virtual-keyboard suppression flag threaded to the input | **flip `inputmode` to a static `'numeric'`; drop the prop** (see §2) | High |
| 8 | `games/futoshiki/FutoshikiBoard/FutoshikiCell/FutoshikiCell.vue` | prop L~33; `:inputmode` L183 | twin of #7 | **twin** | High |
| 9 | `games/shared/useCoarsePointer.ts` | whole file | `(pointer: coarse)` module ref | **SURVIVES** — shared by drawer + both ControlPanels; only the `padActive` *use* goes | High |
| 10 | `games/shared/useStackedLayout.ts` | whole file | `(max-width:1023px)` module ref | **SURVIVES** — shared by `useControlsDrawer`; only the `padActive` use goes | High |

**Removal-surface summary.** One component + its e2e delete cleanly; the two games, two boards,
and two cells each carry a matched twin block (D16 symmetry holds exactly — census-verified).
The two detection composables are **NOT** pad-private (drawer + ControlPanel co-consume them), so
they stay. The `enterValue`/`cellFocusChange`/`suppressVirtualKeyboard` chain exists *solely* for
the pad and comes out with it. `padActive` is the one shared thread: it both mounts the pad AND
sets `inputmode="none"` — §2 governs its fate.

---

## §2 — Input flow today (and what native entry must preserve)

**There is already a native input.** Every cell renders a real `<input type="text">`, positioned
`absolute inset-0`, `opacity-0` (invisible — the value paints as an SVG `HandwrittenGlyph`
overlay), focusable, roving-tabindex. `SudokuCell.vue:180–194`. The DigitPad is a tray *over*
this input; it is not the entry surface's foundation.

Tap-a-cell flow: `@click="focusInput"` focuses the hidden input → `@focus` sets `isFocused` +
emits `cellFocus` → the board's `focusin` reports `cellFocusChange(true)` (the pad's enablement).
Entry is **pure native `@input`/`@keydown`**, not synthetic:

- `handleInput` (`SudokuCell.vue:99`): strips non-digits, clamps `1..boardSize`, single-digit
  boards take the last digit (one-tap override), `≥10` boards take last-2 → `emit('update')`.
- `handleKeydown`: Backspace/Delete → `emit('update', pos, 0)`. Arrows fall through to the board's
  roving controller.

**`inputmode` today.** `:inputmode="suppressVirtualKeyboard ? 'none' : 'numeric'"`. On mobile
(`padActive` true) it's **`none`** — the OS keyboard is deliberately suppressed so the pad owns
entry. Live-probed `inputmode="none"` on cr390/cr375/wk390.

**What native-input entry must preserve (the removal's real contract):**

1. **The `onCellUpdate` write path** — override rules, murmur hold, undo/redo recording all live
   downstream of `emit('update')`. The pad already rides it via `enterValue`; native typing rides
   it directly. Removing the pad loses nothing here — the path is the input's, not the pad's.
2. **`inputmode` flip.** With the pad gone, `inputmode` must become **`numeric`** (or `none` stays
   and there's no entry at all). Native numeric summons the OS number pad on focus. **Zoom-on-focus
   is structurally safe**: the hidden input's computed `font-size` is **exactly `16px` on every
   board** (probed 16px at 9×9 [40px cell], 16×16 [22px cell], and futoshiki [72px cell]) —
   because the `opacity-0` input decouples text size from the visual cell (the glyph is SVG). iOS
   Safari zooms only when a focused input is `<16px`; 16px clears it. **This is the single biggest
   de-risk for the abrogation.** (High confidence — measured across all three board scales.)
3. **The OS-keyboard-eclipse problem the pad was built to dodge.** The pad's raison d'être
   (`SudokuGame.vue:69–72`): a coarse cell focus summons the OS keyboard that "eclipses half the
   board." Native entry re-introduces exactly that — the number pad covers the lower viewport, and
   (see §3) the board already doesn't fit above the fold. The redesign must answer keyboard
   avoidance (scroll-into-view on focus, or a compact bounded pad that isn't the OS keyboard).
4. **Given cells / futoshiki / notes:**
   - **Given cells**: no special input path — `handleInput` writes through; the override transition
     (given clue → your entry, undoable) is `applyCellValue`'s rule, inherited identically. The pad
     asserted PATH IDENTITY here (digit-pad.spec test 1); native typing is the same path.
   - **Futoshiki**: structural twin — same `<input>`, same `inputmode` logic, `maxlength="2"`
     (fixed, not size-conditional), boards 4–7, plus inequality carets between cells (display-only,
     no input surface). Its scene is lazy/async.
   - **"Notes"**: there is **no user notes/candidate-entry mode** anywhere (grepped: no
     note/candidate/pencil-mode toggle). The only pencil marks are **peek-domains** — solver
     propagation rendered `aria-hidden`, read-only, present only while the peek gesture is held
     (`SudokuCell.vue:196–237`). Native entry touches none of it.

---

## §3 — Affordance census at mobile geometry

Every affordance, live-probed at 390/375. Boxes in CSS px; "44px" = the coarse tap floor.

| affordance | where (mobile) | geometry / reach | 44px? | issues | conf |
|---|---|---|---|---|---|
| **Digit pad** | in the stacked control card, below the board | keys 66×48 (9×9) / 63×48 (375) / 52×48 (16×16, 17 keys) / 113×48 (futoshiki); pad box top **764**, bottom **881** | ✓ (min 48h) | **below the fold in EVERY case** — pad bottom 881/919/862 all exceed the 664/667 viewport; you must scroll to reach it one-handed. The thing being abrogated. | High |
| **Peek (hold-to-peek)** | boil divider in the control card | surface 350×**46** (335×46 @375); `touch-action:none`, `user-select:none`; persistent washi "hold to peek" | ✓ | the ONE board-adjacent gesture with a real touch path. Padded to 44px on coarse (`padding-block:1rem`). Clean. | High |
| **Hint** | — | **NO touch affordance.** `H` key only (`SudokuBoard.vue:343–346`). No button. | ✗ (absent) | **keyboard-only → unreachable on touch.** The legend that documents it is `display:none` on coarse. | High |
| **Undo / Redo** | — | **NO touch affordance.** `Cmd/Ctrl+Z` / `Shift+Z` only (board keydown L33–34). No button in either ControlPanel (mobile OR desktop). | ✗ (absent) | **keyboard-only → unreachable on touch.** The owner's ruling names undo explicitly. | High |
| **Share** | icon-btn in the card | 44×52; `aria-label` + sublabel track real clipboard outcome (copied! / in address bar) | ✓ | sticky-hover leak (below). Otherwise honest. | High |
| **Randomize / Clear / Solve** | icon-btns | Randomize 65×52 (label-widened), Clear/Solve 44×52 | ✓ | Clear has the two-tap "sure?" confirm on coarse (destructive). Sticky-hover leak. | High |
| **Menu / game select** | the wordmark `<h1>` is the picker button (masthead, centered <1024) | opens a paper listbox (sudoku/futoshiki) over the board — **opens on tap** (crop `game-picker-open-390.png`) | ✓ (logo-menu-item min 44) | overlays the board top-left; reachable. Works. | High |
| **Drawer (pencil case + pull-tab)** | **absent** | rail `#controls-drawer` `display:none`; `.drawer-tab` in DOM but `display:none`; `toggleDrawer` early-returns <1024 | n/a | **desktop-only by design** (`useControlsDrawer.ts:16–18`: "≥1024 ONLY… A touch bottom-sheet is an explicit non-goal this wave"). On mobile the controls card is inline below the board. | High |
| **Dark toggle** | fixed `.corner-right`, top-right | box top **−4**, right 4, 64×71 (cr) / 64×64 (wk); `--toggle-size` 5rem (<480: 4rem) | ~ | top edge at −4px, so its upper region sits **under the status bar / notch / Dynamic Island** (no safe-area handling — §4). No overlap with the wordmark (boxes clear; 13px gap @375). | High |
| **Attribution (@mbabb)** | `.mobile-attribution`, in-flow top-left above board | trigger 76×**44**, top 8 left 12 | ✓ | **card does NOT open on touch tap** (aria-expanded stays false; opens on mouse click) — see below. | High |
| **Error note** | `SolverErrorNote`, pinned below board | `role="alert"`, `scrollIntoView` on mount (handles below-fold), `try again` btn min-44 on coarse | ✓ | mobile-viable. Sticky-hover on the retry btn (minor). | Med |
| **Keyboard legend** | **absent** | `display:none` under `@media (hover:hover) and (pointer:fine)` gate | n/a | correctly hidden on touch — but it's the *only* surface documenting hint/undo/redo, so touch users get zero discovery of those (compounds the hint/undo/redo gap). | High |

**Attribution touch gap (reproduced).** `useHoverCard` wires the wrapper `@focusin=onHoverEnter`
(sets `isOpen=true`) + the button `@click.stop=toggle`. On a touch tap both fire in one gesture —
focusin opens, click toggles it back closed — net closed. Mouse `.click()` opens it (aria-expanded
→ true). So the attribution card is effectively **unreachable by touch tap**. (High on behavior,
Med-High on the focusin+toggle mechanism.)

---

## §4 — Touch discipline census

| axis | finding | conf |
|---|---|---|
| **`env(safe-area-inset-*)`** | **not used anywhere** (grepped `env(`/`safe-area`/`viewport-fit` — zero hits). Probed `paddingTop/Bottom: env(safe-area-inset-*)` → **`0px`** on all three (the meta lacks `viewport-fit=cover`, so insets are 0). Consequence: the fixed dark toggle (top −4px) and any future edge-anchored chrome ignore the notch/Dynamic Island/home-indicator. | High |
| **Zoom-on-focus (16px rule)** | **SAFE.** Cell input computed `font-size` = **16px** on 9×9/16×16/futoshiki (opacity-0 input decouples from cell size). No zoom probed on focus (`visualViewport.scale` 1→1) — but note that's partly because `inputmode=none` today suppresses the keyboard; the 16px fact is what keeps it safe once entry reverts to `numeric`. | High |
| **`:hover` stickiness on touch** | **LEAKS.** After tapping an `.icon-btn`, its `:hover` state STICKS: bg `transparent → rgb(246,246,244)`, filter `#grain-static → #wobble-celestial`, color darkens — persists until a tap elsewhere (`changed:true` all 3 profiles). Same class on `.section-heading:hover` (→`#wobble-heart`) and OptionSelector items. The whole hover grammar is authored for fine pointers and bleeds onto touch as stuck state. | High |
| **`-webkit-touch-callout`** | **not set anywhere** (grep: zero). Cells are `<input type=text>`; no `touch-callout:none`, no `user-select:none` on them → on iOS a **long-press on a cell can fire the OS callout / selection loupe**. Corroborated: cell input `user-select` computes **`text` on webkit** (vs `auto` on chromium). (Med — the native loupe can't be reproduced headlessly; inferred from `user-select:text` + absent callout suppression.) | Med |
| **`-webkit-tap-highlight-color`** | set to `transparent` **only** on `HandwrittenLogo` (L343). Every other tappable — icon buttons, digit-pad keys, cells, heading tabs — inherits the default → **gray tap-flash on iOS**. (Probes read `rgba(0,0,0,0)` because Chromium/WebKit don't expose the iOS default via getComputedStyle; the *source* has no rule, so real iOS shows the flash.) | Med |
| **`touch-action`** | set (`none`) **only** on `.peek-hold-surface` (both games) — correct, it owns a press-hold. No global `touch-action: manipulation`; no other scroll-jank surface found (`hOverflow=0`, no horizontal pan). Double-tap-zoom delay is otherwise unmitigated on buttons (minor on modern iOS). | Med |
| **`overscroll-behavior`** | not set anywhere → rubber-band / pull-to-refresh uncontained. Minor. | Med |
| **Horizontal overflow** | **none** — `documentElement.scrollWidth == clientWidth` (390/375, hOverflow 0) on all profiles. Board + card + pad hold the width cleanly. | High |

---

## §5 — Viewport meta, landscape, keyboard-avoidance posture

- **Viewport meta** (`index.html:5`): `width=device-width, initial-scale=1.0`. **No `viewport-fit=cover`**
  (→ safe-area insets are 0, §4), **no `maximum-scale`/`user-scalable=no`** (good — pinch-zoom stays,
  a11y-correct). High.
- **`visualViewport`**: **handled nowhere** (grep: zero refs). No listener re-flows the layout when
  the OS keyboard opens. Today this is masked because `inputmode=none` never summons the keyboard;
  **reverting to native `numeric` entry makes `visualViewport` keyboard-avoidance a live gap** —
  the number pad will cover the lower board with no compensating scroll/resize. High.
- **Landscape**: no landscape-specific CSS (grep `orientation`: zero). The layout is width-driven
  media only (`<1024` stacks). Landscape phone (≈844×390) crosses no breakpoint → still stacked, but
  the board + inline card + off-fold pad in a 390px-tall window is untested and almost certainly
  worse (pad even further below fold). Not live-probed this pass — flagged. Low-Med.
- **Fold math (the through-line)**: on 390×664 the board+card push the digit pad to y=764–881,
  **~100–217px below the fold** on every board and both games. The mobile scene does not fit one
  screen; entry (pad today, OS keyboard tomorrow) lives in scroll territory. This is the central
  geometry the recut inherits. High.

---

## Crops (pixel-truth only, `r2-crops/`, 292 KB total)

- `mobile-control-hub-390.png` (128 KB) — the stacked control card: SIZE/DIFFICULTY tabs, "hold to
  peek" washi on the boil divider, the four icon actions with coarse sublabels, and the digit pad
  (1–9 + erase) — the whole mobile affordance surface in one frame.
- `game-picker-open-390.png` (132 KB) — the wordmark-as-picker listbox open over the board;
  @mbabb top-left, the sun toggle at the top-right edge — the top-corner spatial arrangement.
- `topcorner-toggle-masthead-375.png` (32 KB) — the tightest case: dark toggle vs centered
  wordmark at 375 (13px gap, no overlap; toggle top edge off-screen).

## Net for the recut (census verdict, not redesign)

1. The pad delete is clean and twin-symmetric; the native `<input>` underneath already owns the
   write path — abrogation is a **revert (`inputmode` → `numeric`) + excision**, not a rebuild.
2. **16px input font is the de-risk** — native OS-keypad focus won't zoom, at any board size.
3. The recut's real work is what the pad was papering over: **keyboard-avoidance / off-fold
   geometry** (`visualViewport`), and the **missing touch affordances the ruling names** — hint,
   undo, redo have zero touch surface today; attribution won't open on tap; the drawer is
   desktop-only. Plus the hygiene leaks: sticky `:hover`, tap-highlight, long-press callout,
   safe-area under the notch.
