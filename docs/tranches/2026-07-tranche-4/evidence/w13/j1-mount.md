# T4-W13 · lane J1 — THE MOUNT (the joint seal that makes five games reachable)

Base: the sealed `38d3f223` carrying the COMPLETE uncommitted {T4-W12 + completion} ⊕ {T4-W13}
waves. Port **4995** (self-served `vite preview` over my own `npx vite build` dist — the wasm in
`node_modules` is already the five-game build; no prebuild recompile). Temp mirror config
`playwright.j1mount.config.ts` + the drive script deleted after; goldens re-baselined NOTHING;
`playwright-report/`/`test-results/` (gitignored) removed. `:3000`/`:3001` never touched. NO COMMIT.

This lane closes THE TWO REDS: (1) the three games were unreachable — no scene/board components,
`GAMES[]` listed two; App.vue's live mount was a hardcoded two-game `v-if` union. (2) the lean band.

## Footprint (mine only — zero `games/shared/**`, zero `csp-solver/src/constraint/**`)

```
NEW  src/games/thermo/ThermoGame.vue   ThermoBoard.vue   ThermoPoster.vue
NEW  src/games/killer/KillerGame.vue   KillerBoard.vue   KillerPoster.vue
NEW  src/games/kenken/KenKenGame.vue   KenKenBoard.vue   KenKenPoster.vue
 M   src/App.vue                       the registry-driven mount fold
 M   src/games/registry.ts            + kenken sizeOptions import + thermo/killer/kenken GameCard rows → GAMES (5)
 M   src/games/registry.test.ts        the two contract tests recut for five games + the loose-id design
 M   e2e/gallery.spec.ts               the "1 of 2" → "1 of 5" recut (untracked file — part of the W12 tree)
 M   src/games/shared/useGameGallery.test.ts   the snap-clamp recut (five cards)
```

The `games/shared/{GameScene,useGameState,useControlsDrawer,scene.css}` diffs in the tree are the
concurrent W12/other-lane waves — this lane READ them, never edited them. The contract discipline
held: no scene needed a shell edit (every game plugged into GameScene/GameBoard/GameControlPanel
as-is), so no STOP-and-report.

## The seam shapes

### 1. The three thin scenes — GameScene/GameBoard consumers (the worn W11 template)

- **ThermoBoard / KillerBoard** = SudokuBoard's grammar VERBATIM (reuse `SudokuCell`, the box-band
  conflict/peer adjacency, the difficulty-request margin voice, the UI-13 idle grade hint) — the
  ONE divergence each is the furniture in the `#overlay` slot (`ThermoTube` / `KillerCage`), wrapped
  in a `.thermo-clue-layer` / `.killer-clue-layer` (the FutoshikiBoard caret-layer mirror: z-index:1
  below the cells, `pointer-events:none`, aria-hidden, and the `.board-leaving` opacity-fade on the
  page-turn). Their conflict assist stays Sudoku box/row/col — the thermometer/cage RELATIONS are
  enforced authoritatively by the wasm solve (the grader is `gradeSudoku`, cage/tube-blind).
- **KenKenBoard** = FutoshikiBoard's grammar (reuse `FutoshikiCell`, `subgridSize = boardSize` → the
  BOXLESS Latin grid, row/col-only conflict) minus the caret/constraint-label machinery, plus the
  `KenKenCage` operator-cage overlay in `#overlay`. `:constraint-label="''"` (cages are decorative to
  AT). The grader is `gradeFutoshiki` with an empty inequality set (cage-blind).
- Each scene is the FutoshikiGame twin: `use<Game>` composable + `useAnswerKeyPeek` + the
  candidate-pin/long-press union + `onShare` + the `#board` (board + `AnswerKeyLaminate`) / `#controls`
  slots. AnswerKeyLaminate is a STATIC import (the whole scene is already a lazy chunk).
- **ControlPanel** — the three games ship NO bespoke ControlPanel, so the thin scene passes the
  shared `GameControlPanel` its sections directly (exactly the "if a game lacks a ControlPanel"
  path). The sections come from the game DECLARATION itself — `const sections = computed(() =>
  thermoGame.options(model))` — so the R2 contract's `options` field is CONSUMED at the mount
  (reactive under the computed; `pendingSize`/`difficulty` writes recompute it). Thermo/Killer carry
  a Size + Difficulty pair; KenKen a Board-Size (4/5/6) + Difficulty pair — the shell renders the
  mobile tab-toggle at n≥2 by construction.
- The `#overlay` furniture (`ThermoTube`/`KillerCage`/`KenKenCage`) is the SAME component the posters
  reuse — prop-driven, static-jitter, PRM-safe, aria-hidden.

### 2. App.vue — THE MOUNT FOLD

The hardcoded `GameId = "sudoku" | "futoshiki"` union + `setGame` two-way routing + the twin scene
`v-if`s folded into a registry-driven mount, preserving EXACTLY the page-turn/live-face semantics:

- `type GameId = string` (WIDENED, keyed on the registry — the W11 KEY precedent, tiers erased at the
  boundary). `parseGame()` + `setGame()` validate `?game=` against `GAMES` (unknown → sudoku).
- `sceneFor(id): Component` — a memoized resolver: the eager card (Sudoku) returns the static-import
  `SudokuGame` (main chunk, byte-unchanged eager load); every other id returns a lazy
  `defineAsyncComponent({ loader: card.scene, loadingComponent: ScribbleLoader, delay: 300 })` over
  the registry's OWN `card.scene()` dynamic import — the same chunk today's Futoshiki cut, now
  generalized. The template's twin `v-if`s collapse to `<component :is="sceneFor(scene)" :leaving …
  @erased>` — `scene` is the MOUNTED id (flips at the seam), so the erase-beat / seam / draw-in
  choreography is byte-identical to the old v-if pair.
- `preloadFutoshiki` → `preloadScenes` (warm every lazy scene's chunk on gallery OPEN — F6-D3
  generalized to five games). The gallery `enteredFrom`/`select`/`cancel` wiring, the mid-game guard,
  the fold (`onLiveFace` teleport + fit), the `?game=` URL truth, and PRM are all untouched.

### 3. The GAMES[] rows + posters (REG's banked literals, pasted)

Five cards: `sudoku` (eager), `futoshiki`, `thermo`, `killer`, `kenken` (all lazy). Thermo/Killer
reuse the sudoku `sizeOptions` for `range`; KenKen imports its own 4/5/6 band
(`kenkenSizeOptions`). The three posters (`ThermoPoster`/`KillerPoster`/`KenKenPoster`) dropped in
from `reg-pending-cards.md` verbatim — `PosterBoard` + each game's own furniture in `#overlay`.
Ids match the `game.ts` registration-by-convention (loose `id: string`) — ZERO `gameRegistry` edit
(gameRegistry stays the two mechanically-declared games; it is NOT on the app mount path — the app
mounts via `GAMES[].scene()`, the new game defs are consumed directly by their scenes).

### 4. Permalink coherence for the new ids

The three games' `syncToUrl` is a NO-OP (verified: `export function syncToUrl(…): void {}`) — their
`?board=` is v1-deferred (localStorage-only, documented in each `*UrlState.ts`). So they write NO
URL params, and App.vue's existing strip-on-switch list `["board","size","difficulty","board_size"]`
stays trivially coherent (a `?game=thermo` deep link lands on thermo with a fresh/persisted board;
switching away strips the outgoing game's params, the incoming game re-adds only its own — the new
games add none). Deep-link drive: `?game=thermo/killer/kenken` all mount + auto-deal (below).

## THE LEAN BAND — TEAM-LEAD RULING (binding; documented, not re-litigated)

`vite build` measured `csp_solver_wasm_bg.wasm` = **121,855 B** (49.86 KB gzip). The 93,000 B ceiling
was drawn for a TWO-game wasm; the re-derived ceiling is base + per-game-wire linear = **124,500 B**
for the five-game wasm. 121,855 B is INSIDE it. A wire-dedup refactor banks with the re-trigger "a
sixth game or any wire >12k". No action this lane.

## GATES — the full battery + full default e2e + darwin goldens, all vs MY dist (:4995)

| gate | result |
|---|---|
| `vue-tsc -b --force` | exit **0** — the whole FE type-checks (incl. `sceneFor`'s `Component` map + the three scenes' `game.options` inference against the shared machine) |
| `eslint .` | exit **0** (the pencil↛games boundary holds; thermo/killer/kenken dirs are outside the four boundary globs) |
| `knip` | exit **0** (the three posters + scenes + boards are non-orphan the instant their GAMES rows / App mount reference them) |
| `prettier --check src/` | exit **0** (all matched files) |
| `vitest run` | **307 passed / 29 files** — 3 recut (registry.test ×2, useGameGallery.test ×1), zero net regression |
| `npx vite build` | exit **0** — wasm 121,855 B (inside 124,500); five NEW lazy chunks cut: `ThermoGame` 12.26 KB, `KillerGame` 12.28, `KenKenGame` 12.05, + their poster/furniture/CSS chunks; eager Sudoku stays in `index` |
| default e2e (`:4995`, temp mirror config, webServer stripped) | **77 passed** (incl. the recut `gallery.spec` 8 + `gallery-guard.spec` 6 — the latter needed NO change: card-0/card-1 stay sudoku/futoshiki) |
| darwin goldens (`:4995`, `PLAYWRIGHT_BASE_URL`) | **4/4 byte-for-π**, zero re-baseline, no logo-light flake this run |

### The functional drive — all five games mount + deal + enter + undo + solve THROUGH the App

`j1-drive.mjs` (deleted) drove each id on my dist at 820×1200 (stacked, fine pointer): deep-link
`?game=<id>` → auto-deal → enter a digit in a blank (glyph appears) → Cmd/Meta+Z (glyph removed,
the board's desktop undo path) → Solve button → `.board-wrapper.solve-success`:

| id | cells | mounted | entered | undone | solved |
|---|---|---|---|---|---|
| sudoku | 81 | ✓ | ✓ | ✓ | ✓ |
| futoshiki | 25 | ✓ | ✓ | ✓ | ✓ |
| thermo | 81 | ✓ | ✓ | ✓ | ✓ |
| killer | 81 | ✓ | ✓ | ✓ | ✓ |
| kenken | 16 (4×4) | ✓ | ✓ | ✓ | ✓ |

### The gallery + the fold for a new game

From `?game=thermo`, `g` opens the gallery: **5 cards, 5 pips**; `aria-activedescendant =
gallery-card-2` (thermo, "thermo, 3 of 5"); the CENTER card carries `.live-face-slot` (count 1) —
thermo's LIVE board folded into the center face (the W12 C2 fold working for a NEW game, the V13
PARTIAL closed); the 4 flanks are static `.poster-board`s. `j1-gallery-5cards-thermo-fold.png`.

### π — the three new games' board faces, LIVE in-app, both themes (the W13-V PARTIAL closed)

Captured fresh (isolated contexts, `colorScheme` light/dark → the app's `useDark` system-default +
the furniture `prefers-color-scheme` ink) at 1280×800, the `.board-wrapper` box, furniture overlay
verified present in each:

- `j1-thermo-inapp-{light,dark}.png` — bulb+tube thermometers over the 9×9, graphite/lifted-graphite ink
- `j1-killer-inapp-{light,dark}.png` — dotted cage boundaries + corner sums over the 9×9
- `j1-kenken-inapp-{light,dark}.png` — operator cages (`1−`, `2−`, `4+`, `2÷`, `8×`, `3×`, …) + corner
  targets on the BOXLESS Latin 6×6/4×4 — no interior box lines (the new KenKen geometry)

## The recut citations (game-count assumptions that broke → recut, each cited)

- **`e2e/gallery.spec.ts`** — the "1 of 2" → "1 of 5" recut:
  - §1: `.game-card` count 2→**5**; `#gallery-card-0` label `sudoku, 1 of 2`→`… 1 of 5`;
    `#gallery-card-1` label `futoshiki, 2 of 2`→`… 2 of 5`; `.gallery-pip` count 2→**5**.
  - §2: live-region `futoshiki, 2 of 2`→`… 2 of 5`; the **clamp** recut — with five cards `End`
    jumps to `gallery-card-4` (`kenken, 5 of 5`) and `ArrowRight` there is the no-op (was `card-1`);
    `Home` → `card-0` (`sudoku, 1 of 5`).
  - §8 (375 phone): `.gallery-pip` count 2→**5**.
- **`src/games/registry.test.ts`** — the loose-id design made explicit:
  - "exposes … GameCard rows": `GAMES.map(id)` → `["sudoku","futoshiki","thermo","killer","kenken"]`;
    the per-card `card.name === card.id` invariant kept for all five; the `gameRegistry.toHaveProperty
    (card.id)` loop (which assumed GAMES ⊆ gameRegistry) recut to assert the TWO mechanical games are
    registry keys and the new `thermo` is deliberately ABSENT (the loose-id drop-in, no registry edit).
  - "drops a third game in": `withDemo` length `3` → `GAMES.length + 1` (the five landed + the demo).
  - `Object.keys(gameRegistry).toEqual(["sudoku","futoshiki"])` (§"registers both") — UNCHANGED (green):
    gameRegistry stays two, by design.
- **`src/games/shared/useGameGallery.test.ts`** — `snapTo(99)` clamps to the last card: `1` → **4**
  (five games); the `GAMES = [sudoku, futoshiki]` comment updated to the five-game list.

## HEADLINE

Five games mount, deal, enter, undo, and solve through the App; the gallery shows five cards (pips
5), flanks posters, center the live board; the fold works for a new game (thermo center face). The
registry-driven mount replaced the hardcoded two-game union with zero shell edits; the lean band is
inside the re-derived five-game ceiling (team-lead ruling). Full battery green; 77 default e2e; 4/4
darwin goldens; the three new games' π faces captured live in-app both themes — the W13-V PARTIAL is
closed. No commit (team lead commits).
