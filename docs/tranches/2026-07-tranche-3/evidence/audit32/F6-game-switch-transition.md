# F6 — the sudoku↔futoshiki game-switch transition

Lane: DESIGN (Fable, frontend-design invoked). Read-only audit; deliverable = choreography spec + library decision. All paths relative to `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/` unless noted. Live-browser probe unavailable this session (Chrome extension not connected); every claim below is code-cited.

---

## 1. Today's behavior — the switch path, traced

### 1.1 Selection → swap

- The wordmark IS the picker: `App.vue:161-167` binds `HandwrittenLogo` with `:game` + `:options`, `@select="setGame"`. Pencil never imports games — id + options are props (`src/pencil/chrome/HandwrittenLogo/HandwrittenLogo.vue:12-13`).
- `selectIndex(i)` emits then closes (`src/pencil/chrome/HandwrittenLogo/useGameMenu.ts:52-54`); `setGame` flips the `game` ref, rewrites `?game=`, strips both games' `board/size/difficulty/board_size` params, and ends any live peek (`App.vue:32-47`).
- The board swap is a hard `v-if` cut: sudoku scene at `App.vue:170`, `<FutoshikiGame v-if="game === 'futoshiki'" />` at `App.vue:255`. No `<Transition>`, no exit beat of any kind.

### 1.2 The wordmark (I2, W5)

`HandwrittenLogo.vue:92-101` — I2: a game swap RE-MEASURES the viewBox for the new label, never re-reveals the 1.2s clip-path wipe ("replaying it on every swap reads as a page reload, not a label change"). The comment's stated rationale — "the menu-close motion already carries the swap" (`:94`) — references a motion that **doesn't exist**: the menu is `v-if="isOpen"` (`:149`) with `logo-menu-in` 250ms on *open* only (`:283`, keyframes `:328-337`); close is an instant pop-off. **Defect D1.**

### 1.3 The boards on enter

- Both boards force a grid draw-in on every mount: `gridAnimState = 'drawing'` in `onMounted` (`src/games/sudoku/SudokuBoard/SudokuBoard.vue:324-327`; `src/games/futoshiki/FutoshikiBoard/FutoshikiBoard.vue:376-377`). The draw-in is stroke-dashoffset tweens as one-shot `sequence` subscribers on the ONE shared pencil-boil chain (`src/pencil/grid/HandDrawnGrid/usePathAnimation.ts:11-14`), ~800ms total (Band D, `src/pencil/config/pencilConfig.ts:21-22`), staged frame 350ms → subgrid base-delay 150ms → cells base-delay 300ms, `easeOutCubic` (`pencilConfig.ts:253-258`).
- The erase counterpart exists and is NEVER used on switch: `animateErase` (`usePathAnimation.ts:120-`), ~150ms + 4ms·i stagger, `easeInCubic` (`pencilConfig.ts:22,52-53`). Today it fires only on `boardGeneration` change (`SudokuBoard.vue:334-344`).

### 1.4 State asymmetry between the two scenes

- **Sudoku**: `useSudoku()` lives in App (`App.vue:65`) and survives the switch. Only the board component unmounts. On switch-back, `animatingCells` still holds the last randomize/solve set (cleared only in `initBoard`/`clearBoard`/`restoreBoard` — `src/games/sudoku/composables/useSudoku.ts:104,129,365`), and the remounted cells get fresh DOM → the CSS reveal wave (`cell-reveal-animated`, `src/games/sudoku/SudokuBoard/SudokuCell/SudokuCell.vue:162`) **replays with its full noise-stagger**. That's exactly the "reads as a page reload" failure I2 fixed for the wordmark, still live on the board. **Defect D2.**
- **Futoshiki**: the whole scene is async + `v-if` (`App.vue:19,255`) — `useFutoshiki` dies on switch-away and rebuilds on return (restore path sets no animation, `src/games/futoshiki/composables/useFutoshiki.ts:356-`). But `defineAsyncComponent` has **no loadingComponent** — the first-ever select renders *nothing* during the chunk fetch. **Defect D3.**
- The solver Worker is a module-level singleton (`src/games/futoshiki/solver/useSolver.ts:41-47`, `let worker: Worker | null` at module scope, no `terminate` anywhere) — it spins once and survives unmounts. Worker lifecycle is NOT a transition concern.

### 1.5 Net: today's switch is an unchoreographed cut

One frame the old exercise, next frame blank paper, then the new grid draws itself in (~800ms) with no exit ever having happened — draw-in with no erase is a one-armed gesture. Plus D1 (phantom menu-close motion), D2 (sudoku reveal-wave replay), D3 (first-select void).

---

## 2. The choreography spec — "turn to the next exercise"

Conceit: the two games are exercises in the same graded workbook. A switch is the pencil erasing this exercise and drawing the next — not a page reload, not a router transition. One Band-D sequence (finite, completion-emitting, PRM-substitutable — `pencilConfig.ts:21-23,42`), total ≈1.05s, well inside the 3.2s cap.

### Beat 0 — the choice (t=0)

Menu item click → menu closes with a real leave motion: 120-150ms reverse of `logo-menu-in` (fade + 6px lift-up), Band C's tooltip-fade rung (`pencilConfig.ts:20`). This makes I2's `:94` comment true instead of aspirational. Wordmark label swaps under I2 as-is: re-measure, no re-reveal.

### Beat 1 — exit, "erase the page" (t≈0–250ms)

- Outgoing grid plays the EXISTING erase: `gridAnimState = 'erasing'` → `animateErase` (easeInCubic, ~150ms + 4ms·i — ≈250ms on a 9×9's line count). The asset is built, wired, and idle on this path — the spec merely routes the switch through it.
- Glyphs + controls card + margin notes fade out 200ms `easeInCubic`, opacity-only (+≤2px lift at most — the erase easing family: things *leave* the page, `pencilConfig.ts:52-53`).
- Mechanism: App holds a transient phase — `game` stays put while `leavingGame` runs the exit; flip the `v-if` on the erase's `animationComplete` (the event already exists — `HandDrawnGrid.vue:99`). Equivalent shape: `<Transition mode="out-in">` whose `onLeave` awaits the erase. Either way the orchestrator is ~20 lines of App-level state, zero new dependencies.

### Beat 2 — the seam (t≈250ms)

- DOM swap on the erase-complete tick. The paper (bg + grain) never changes — only ink swaps, which is what sells "same workbook."
- Chunk warmth: preload the other game's chunk when the menu OPENS (`import('@games/futoshiki/FutoshikiGame.vue')` fired from `toggle` — by selection time it's cached), killing D3 structurally. Fallback if cold: hold blank paper ≤300ms, then `ScribbleLoader` (`src/pencil/chrome/ScribbleLoader.vue` exists) — never a spinner.

### Beat 3 — enter, "draw the new exercise" (t≈250–1050ms)

- Incoming grid draw-in exactly as shipped: frame 350ms → subgrid +150ms → cells +300ms, `easeOutCubic` (`pencilConfig.ts:253-258`) — the current mount behavior becomes *intentional* once it has an exit to answer.
- Givens: a switch is a restore, not a fresh puzzle — **no reveal wave**. Fix D2 by clearing `animatingCells` on switch-away (one line in `setGame`'s path, or key the reveal to a `boardGeneration`-freshness check). Futoshiki's restore path already behaves (`useFutoshiki.ts:356-`).
- Controls card fades in 250ms, delayed ~150ms after draw-in onset (the grid leads, chrome follows).

### PRM

Every constituent is already gated: draw-in/erase short-circuit via `showInstant` (`usePathAnimation.ts:74-79,127`), logo skips its wipe (`HandwrittenLogo.vue:47-49`, `:356` `animation: none`). The orchestrator must ALSO skip the Beat-1 hold under PRM so the swap stays a same-frame cut — a PRM user waiting 250ms for an animation they can't see is a regression.

### Budget table

| Beat | What | Duration | Easing | Mechanism |
|---|---|---|---|---|
| 0 | menu close (new leave motion) | 120-150ms | ease-out reverse of menu-in | CSS `@keyframes` |
| 1 | grid erase (existing) | ~250ms | easeInCubic | pencil-boil `sequence` |
| 1 | controls/glyphs fade-out | 200ms | easeInCubic | CSS |
| 2 | seam — v-if flip on `animationComplete` | 0 | — | App phase state |
| 3 | grid draw-in (existing) | ~800ms | easeOutCubic | pencil-boil `sequence` |
| 3 | controls fade-in | 250ms (+150ms delay) | easeOutCubic | CSS |
| Σ | | **≈1.05s** | | Band D cap 3.2s ✓ |

---

## 3. Library decision — pencil-boil + CSS vs re-adopting keyframes.js

FACT CHECK on the excision: current `package.json` carries no `@mkbabb/keyframes.js` (only `@mkbabb/pencil-boil: ^0.7.0`, `package.json:20`); zero source imports — the remaining grep hits are historical comments (`pencilConfig.ts:271`, `glyphAnimations.ts:3-5,39`, `glyphPaths.ts:7`, `rafInstrumentation.ts:5`). Pre-excision it rode an "animation-vendor" chunk (commit `26712e15`).

### The npm surface today (probed 2026-07-10)

`npm view @mkbabb/keyframes.js` — latest **5.2.0**, published 2026-07-09 (actively maintained). Dependencies: **only** `@mkbabb/value.js ^3.1.0`, which depends only on `@mkbabb/parse-that ^1.0.0`. **No reka-ui, no glass-ui anywhere in the chain — the transitive-mass objection that motivated the R8 excision no longer holds; it stands alone.** 645,181 B unpacked / 31 files; exports `.` (dist/keyframes.js) + `./engine`.

### Decision row

| Option | For | Against | Verdict |
|---|---|---|---|
| **pencil-boil `sequence` + CSS** (status quo, extended) | Already the ONE clock here — draw-in/erase are one-shot `sequence` subscribers on the shared chain (`usePathAnimation.ts:11-14`); both halves of the transition are *already implemented*, one is merely unrouted; Band-D law demands finite + completion-emitting, and `animationComplete` already flows (`HandDrawnGrid.vue:88,99`); crossfades are compositor-only CSS; **zero new bytes**; PRM gating already threaded through every piece | Orchestration lives in ~20 lines of App phase state (or `<Transition mode="out-in">`) — bespoke, but trivially so | **ADOPT** |
| **Re-adopt @mkbabb/keyframes.js 5.2.0 standalone** | Owner's lib, alive (pub'd yesterday), genuinely standalone now; declarative CSS-string keyframes for JS values; the fleet motion canon names it "the ONE motion brain" (`docs/precepts/motion-canon.md:136` — note: `docs/precepts/` is **untracked** in this repo, `git ls-files docs/precepts` empty — it's fleet reference material from the glass-ui world, not this repo's law) | What it buys — spring physics core, RAFPlayback loops, runtime CSS parsing (parse-that) — has **no site in this transition or this skin**: the pencil canon explicitly bans per-cell RAFPlayback (`pencilConfig.ts:271`), glyph draw-in *was* a keyframes.js loop and was deliberately migrated to a `sequence` subscriber (`glyphAnimations.ts:5`), and the skin's only two springs are CSS beziers (`MOTION.easings.pop/spring`, `pencilConfig.ts:55-57`). Re-adoption = a second animation brain + a runtime CSS parser to run 2 fades + 2 sequences that already exist. It also re-splits the clock the W8/W12 unification fought for (one scheduler, one rAF) | **REJECT for this repo** |
| WAAPI as a third leg | Native, compositor-friendly | Nothing here needs it — the fades are CSS `@keyframes`, the sequences are pencil-boil; WAAPI would be a third timing authority for zero capability gain | Not needed |

### Recommendation

**Pencil-boil scheduler + CSS, no re-adoption.** The transition is exit-erase → seam → enter-draw, and both animated halves already exist as `sequence` subscribers on the one chain — the whole feature is routing + two crossfades + three defect fixes (D1 menu-leave, D2 `animatingCells` clear on switch, D3 chunk preload on menu-open). keyframes.js standing alone at 5.2.0 is a true and useful fact for the *fleet* (glass-ui's liquid world, where spring physics IS the material), but the pencil skin is stop-motion graphite on paper — its motion brain is the boil scheduler by ratified design (W8/W12), and this transition doesn't present a single capability the scheduler + CSS lack. If keyframes.js re-enters this repo, it should be because a future feature needs numeric path morphing or spring physics (e.g. glyph shape-tweening, `glyphPaths.ts:7`'s dormant affordance) — not as the carrier for a 1s page-turn.

---

## 4. Defect ledger (for the tranche-III authoring)

| ID | Defect | Site | Fix shape |
|---|---|---|---|
| D1 | Menu close is instant; I2's comment cites a "menu-close motion" that doesn't exist | `HandwrittenLogo.vue:94,149,283` | 120-150ms leave animation (CSS) |
| D2 | Sudoku switch-back replays the full cell reveal wave (stale `animatingCells` + fresh DOM) — contradicts I2's own no-replay rationale | `App.vue:65` + `useSudoku.ts:104,129,365` + `SudokuCell.vue:162` | clear `animatingCells` on switch-away |
| D3 | First futoshiki select renders nothing during the async chunk fetch | `App.vue:19` (no loadingComponent) | preload on menu-open; ScribbleLoader fallback >300ms |
| D4 | Draw-in with no erase: enter beat plays on every remount with no exit counterpart — the structural gap this spec closes | `SudokuBoard.vue:324-327`, `FutoshikiBoard.vue:376-377`, unused `animateErase` on this path | route the switch through erase → seam → draw |
