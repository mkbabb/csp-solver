# T4-W12 · Wave A — the registry card face + drop-in

Base HEAD `38d3f223` (T4-W11 sealed). Port 4785. Additive over W11's `defineGame` + `games/registry.ts`
(the card contract EXTENDS that file, never a parallel declaration). No `App.vue`/pencil/shell edits.

## Footprint (2 edits + 3 new files)

```
 M web/frontend/src/games/registry.ts        GameCard face over defineGame + export const GAMES
 M web/frontend/src/games/registry.test.ts   +5 card-contract asserts (keeps GAMES non-orphan for knip)
?? web/frontend/src/games/shared/PosterBoard.vue      game-agnostic STATIC frozen-pose face (enrols NO beat)
?? web/frontend/src/games/sudoku/SudokuPoster.vue     canned 9×9 givens on PosterBoard (eager card's poster)
?? web/frontend/src/games/futoshiki/FutoshikiPoster.vue  canned 5×5 + inequality carets (lazy card's poster)
```

`App.vue` diff EMPTY. The registry graph stays tree-shaken out of the app (App.vue does not consume
`GAMES` yet — that seam is Wave B), so the dist is byte-unaffected: `grep -r 'PosterBoard|SudokuPoster|
FutoshikiPoster|gameRegistry|GAMES' dist/assets/*.js` → 0 hits. (Build shows 192 modules vs W11's 191 —
the +1 is concurrent lanes' in-flight `technique/` work in the shared tree, NOT Wave A: zero Wave-A
symbols reach the dist.)

## The contract (registry.ts)

`export interface GameCard { id; name; glyph?; range{label,levels}; poster()=>Promise<Component>;
scene()=>Promise<Component>; eager? }` + `export const GAMES: readonly GameCard[] = [sudokuCard, futoshikiCard]`.
- `id: string` (loose, NOT `keyof typeof gameRegistry`) — the drop-in seam: game #3 registers with zero
  `gameRegistry` edit. `id`/`name` name the SAME game the mechanics registered under (asserted: every card
  id is a `gameRegistry` key).
- `range.levels` DERIVED from each game's own `sizeOptions`/`boardSizeOptions` (no fourth mirror).
- Sudoku EAGER: static `import SudokuGame`, `scene: () => Promise.resolve(SudokuGame)` — rides the main
  chunk (byte-twin of App.vue's static import). Futoshiki LAZY: `scene: () => import(...).then(m=>m.default)`.
  Today's chunking preserved.

## The posters (static, non-interactive, boil-alive-capable · frozen pose 0)

`PosterBoard.vue` renders the hand-drawn grid FROZEN on one pose (`generateGridBoilFrames` pose 0, grain-
static once) + canned givens as settled `HandwrittenGlyph`s (`is-given` + not revealed/solved → dasharray
none, no draw-in, no murmur). **It deliberately does NOT mount `HandDrawnGrid`** — that component enrols the
shared beat via `useBeatFrame`; a flank poster must enrol nothing. `PosterBoard` never calls `useBoilBeat`/
`useBeatFrame`: the soul gate ("off-center cards enrol nothing") holds by construction. `pointer-events:
none` → non-interactive, no hover boil. The latent `pose` prop (default 0, never ticked by the poster) is
the "boil-alive-capable" seam the gallery may drive from ITS single beat. PRM-safe (no animation to freeze).

## Drop-in gate (born RED → GREEN) — throwaway worktree, deleted after

A stub third game `demo` added in a detached worktree at `38d3f223`:
- **Diff-of-record** (`third-game-drop-in.diff`): 3 files — `registry.ts` (+15/-1, a SINGLE hunk entirely
  inside the `GAMES` array literal) + 2 NEW files `games/demo/{DemoPoster,DemoScene}.vue`. **Zero edits
  outside `GAMES[]`** — no App.vue, no GameGallery, no pencil, no shared.
- **Compiles**: worktree `vue-tsc -b --force` exit 0 with the third card present.
- **Renders + selectable-as-data**: harness over `GAMES` → `CARDS_RENDERED=["sudoku","futoshiki","demo"]`;
  `captures/third-game-card.png` banked. (W13's Thermo lands as the real row later; this stub proved the
  mechanism and died with the worktree.)

## Design pass (Fable · DesignSync invoked)

`DesignSync.list_projects` → `[]` (no design-system project exists to sync to; the sync path is
inapplicable). The design pass ran as a rendered visual review on a self-served preview:
`captures/poster-faces-light.png` + `poster-faces-dark.png` (both themes — grid + glyph colors flip via the
`--grid-line-color`/`--color-foreground` tokens). Faithful house grammar (boil grid + handwritten glyphs +
futoshiki carets on the shared edges). PRM-safe + coarse/fine identical (no beat, no hover — `pointer-events:
none`). Both pointer types: no hover states by construction.

## Battery (all vs YOUR dist / clean tree)

| gate | result |
|---|---|
| `vue-tsc -b --force` | exit **0** |
| `test:unit` | **278 passed / 22 files** (W11's 273 UNEDITED + 5 card-contract asserts) |
| `lint:eslint` | exit **0** (`pencil/** ↛ games/**` holds; posters + PosterBoard are games/shared consumers) |
| `lint:knip` | exit **0** (GAMES + posters non-orphan via the test's GAMES import + dynamic poster loaders) |
| `prettier --check src/` | exit **0** |
| `build` | exit **0**, 192 modules; **0 Wave-A symbols in dist** (tree-shaken — dist byte-unaffected) |
| default e2e (`:4785`, mirror config, webServer stripped) | **63 passed** |
| darwin goldens (`:4785`, `test:golden`) | **4/4 passed** (cell-light, grid-corner-light, logo-light, toggle-crest-dark) |

Temp `playwright.w12a.config.ts` deleted; `:4785` preview killed; worktree removed + pruned; `:3000`/`:3001`
never touched. No commit (team lead commits).
```
