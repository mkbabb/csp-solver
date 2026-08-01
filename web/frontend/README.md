# csp-solver frontend

Vue 3 + TypeScript + Tailwind v4 single-page app with a hand-drawn pencil-and-paper
aesthetic (custom SVG glyphs, path-based grid boil, stroke-dasharray draw-ins). No
router, no state library. Five games — sudoku, futoshiki, thermo, killer, kenken —
share one aesthetic layer, one board/scene/controls shell, and one solver transport.
Solving runs in-browser via `@mkbabb/csp-solver-wasm` inside a per-game Worker;
there's no backend.

Shared animation primitives come from
[`@mkbabb/pencil-boil`](https://github.com/mkbabb/pencil-boil) `^0.10.1`. The motion
system — cadence bands, the unified scheduler, celebration timeline, grain hoist,
filter presets — is documented in [`../../docs/animation.md`](../../docs/animation.md).

## Setup

```bash
npm install              # deps (the wasm file: link resolves from the lockfile)
npm run wasm             # build @mkbabb/csp-solver-wasm into pkg/ — the file: link target (once per fresh clone)
npm run dev              # Vite dev server (:3000)
npm run build            # vue-tsc -b && vite build (a prebuild hook re-runs `npm run wasm`)
npm run preview          # preview the production build
npm run lint             # prettier --check src/
npm run lint:eslint      # ESLint (boundary + depth rules, correctness)
npm run lint:knip        # knip — dead files, exports, deps
npm run test:unit        # Vitest (jsdom, src/**/*.test.ts)
npm run test:e2e         # Playwright — chromium + webkit
npm run test:golden      # visual goldens (DPR2, sRGB-pinned, reduced motion)
npm run deploy           # build + wrangler pages deploy dist
```

`engines`: Node ≥24, npm ≥11.

The wasm solver is a `file:` link to `../../csp-solver/wasm/pkg` — a gitignored build
artifact absent on a fresh clone. `npm run wasm` runs the ship recipe
(`make -C ../../csp-solver/wasm wasm`: `wasm-pack build --scope mkbabb --target web
--profile wasm-release --no-default-features`; needs the Rust toolchain + `wasm-pack`).
`npm run build` calls it through the `prebuild` hook; `npm run dev` doesn't, so run it
once after cloning.

## File tree

```
frontend/
├── vite.config.ts                  # :3000, @pencil/@games/@ aliases, sudokuTemplates + headHints plugins, ESM Workers
├── vitest.config.ts                # jsdom, src/**/*.test.ts
├── playwright.config.ts            # the default suite — chromium + webkit projects
├── playwright-golden.config.ts     # visual goldens: DPR2, --force-color-profile=srgb, reducedMotion
├── playwright-throttle.config.ts   # throttled probes on their own build + preview (:4188)
├── eslint.config.js                # the boundary + pencil-depth rules (see Boundaries)
├── knip.json                       # dead-code gate
├── scripts/                        # check-ink-pressure · check-golden-bytes · check-font-coverage · check-prod-shake
├── e2e/                            # specs + goldens/
└── src/
    ├── App.vue                     # the shell: masthead, gallery view, the mount fold, ?game=/?view= truth
    ├── main.ts                     # createApp + mount; dev-only rafInstrumentation import
    ├── lib/base64url.ts            # the permalink codec
    ├── assets/                     # index.css (Tailwind v4, CSS vars, paper texture) + typography.css; woff2 subsets + OFL texts
    ├── composables/useTheme.ts     # dark mode via @vueuse/core useDark — the one composable outside pencil/games
    ├── pencil/                     # generic aesthetic layer — never imports src/games/**
    │   ├── grid/                   # HandDrawnGrid/ (+ usePathAnimation: boil, draw-in/erase), HandDrawnOutline, gridPaths
    │   ├── glyph/                  # HandwrittenGlyph, glyphAnimations, glyphPaths (digits 0–9 + hex A–G), glyphRegistry
    │   ├── chrome/                 # GameGallery/ (carousel, cards, staging band), HandwrittenLogo/, AttributionCard/,
    │   │                           #   OptionSelector/, icons/ (8), BoilDivider, MarginNote, CompletionVignette,
    │   │                           #   KeyboardLegend, CelebrationStar/Heart, ScribbleLoader, SvgFilters
    │   ├── celestial/              # DarkModeToggle — sun/moon crest, boil-frame sparkles/stars/rays
    │   ├── sheet/                  # AnswerKeyLaminate (hold-to-peek), SheetWashiLabel
    │   ├── composables/            # boilBeat, celebration, rasterPose
    │   ├── config/                 # pencilConfig (MOTION bands, palette, filter/boil/celebration) + filterBudget (the census)
    │   ├── dev/                    # FilterTuner + rafInstrumentation — DEV-gated, 0 bytes in prod
    │   └── types.ts
    └── games/
        ├── registry.ts             # defineGame + the GAMES card table the gallery reads
        ├── shared/                 # the shells and machines every game rides (below)
        ├── sudoku/                 # SudokuGame/Poster, SudokuBoard/ (+ SudokuCell/), ControlPanel/, composables/,
        │                           #   solver/, technique/, data/templates.ts (generated — never hand-edit)
        ├── futoshiki/              # same shape; FutoshikiBoard/ carries the inequality carets, plus its own technique/
        ├── thermo/                 # ThermoGame/Poster/Board + ThermoTube/
        ├── killer/                 # KillerGame/Poster/Board + KillerCage/
        └── kenken/                 # KenKenGame/Poster/Board + KenKenCage/
```

`games/shared` is the game-agnostic floor:

- **Shells** — `GameBoard.vue` (the `role="grid"` scaffold: roving tabindex, reveal
  stagger, conflict/peer highlight, marginalia, completion vignette + celebration),
  `GameScene.vue` (board + controls layout, drawer registration, the Teleport host),
  `GameControlPanel.vue` (1..n option sections, New-game staging, action + play-tool
  rows), `PosterBoard.vue` (the static mini-board the gallery flanks render).
- **Machines** — `useGameState` (the whole board state machine), `useUndoHistory`
  (delta timeline, cap 200), `usePencilMarks` / `useUserMarks`, `useAssists`,
  `techniqueEngine` + `techniqueVoice`, `useControlsDrawer` and `useFlipGlide`
  (FLIP-on-WAAPI), `useGameGallery`, `useStagingBridge`, `useLiveFace`,
  `useKeyboardViewport`, `useCoarsePointer`, `honestHaptics`.
- **`shared/solver/`** — `transport.ts` (the Worker singleton, pending map, prewarm,
  bounded respawn), `protocol.ts`, `solverError.ts`, `classifyError.ts`,
  `describeError.ts`.

## Architecture

```
App.vue
├── SvgFilters                  # mounted once: the global filter defs (grain, wobble, stroke)
├── FilterTuner (DEV only)      # wrench icon, live preset/boil tuning
├── AttributionCard · DarkModeToggle
├── view === 'playing'
│   ├── HandwrittenLogo         # the wordmark IS the picker's handle — a click folds the board into the gallery
│   └── <scene>                 # one game mounted at a time: sudoku eager (main chunk), the rest lazy
│       └── GameScene → GameBoard (#cells + #overlay slots) · GameControlPanel
└── view === 'gallery'
    └── GameGallery             # the five cards; flanks are static posters, the centre face is the live board
```

`GAMES` in `games/registry.ts` is the registration table: each card names its id
(`?game=` token), its wordmark, its size/level sub-line drawn from the game's own
selector constants, its `localStorage` key, and the poster + scene loaders. A game
drops in by pushing one card; `App.vue` resolves the scene from it and nothing else
changes. `defineGame` pins the contract each game dir declares in its `game.ts` — the
model composable, cell furniture, clue furniture, control sections, solver payloads.
Every field is a component slot or a per-game function, never a config flag.

One live board ever. The gallery doesn't clone it: `GameScene` wraps its board host in
a `<Teleport>` whose target `App.vue` points at the centre card's face, so the mounted
instance is reparented — marks, undo timeline, worker state intact — and parked home on
cancel. A disabled Teleport renders in place, so the playing view sees byte-identical
home DOM.

## Boundaries

`eslint.config.js` enforces the layering mechanically:

1. `src/pencil/**` never imports `src/games/**`. The aesthetic layer draws whatever
   generic, already-erased data it's handed via props; it never reaches into domain
   state. The reverse is expected and unrestricted.
2. `src/games/sudoku/**` and `src/games/futoshiki/**` never import each other.
3. `src/games/shared/**` never imports a concrete game — the shared floor stays
   game-agnostic.
4. Depth: `src/games/**`, `App.vue`, and `main.ts` may not reach 4+ levels into pencil
   internals. A foldered component's public file
   (`@pencil/<subsystem>/<Component>/<Component>.vue`) is the deepest legal reach;
   flat modules sit shallower.

The variants ride their base game's furniture — thermo and killer import sudoku's
cell, tier constants, and technique module; kenken imports futoshiki's. Rule 2's glob
set names the sudoku/futoshiki pair alone, so those edges are convention, not lint.

## State

No Pinia, no Vuex. `useGameState` holds the board machine: values, the
given/original-given/overridden cell sets, `solveState` (idle → solving →
solved/failed/error), the epoch/race discipline, the undo timeline, pencil and user
marks, assists, the dirty signal, and the persist choreography. Each game builds a
small domain slot (`useSudoku`, `useFutoshiki`, `useThermo`, `useKiller`, `useKenken`)
and re-labels the size refs in its own vocabulary. State that spans games — the
controls drawer, the gallery view, the staging bridge, the live face, the dirty
register — lives in module-level singletons rather than a store.

URLs carry the truth the app boots from: `?game=` names the mounted game,
`?view=gallery` deep-links the picker, and sudoku and futoshiki round-trip a whole
board through `?board=` (base64url) alongside `?size=`/`?difficulty=`. Thermo, killer,
and kenken persist to their own `localStorage` keys; their share permalink isn't wired
— `boardLink` reads `"absent"` and `writeShareUrl` no-ops — so those boards survive a
reload but not a shared link.

## Solve path

Each game owns `solver/solver.worker.ts`, an ES-module Worker that top-level-imports
`@mkbabb/csp-solver-wasm` and runs generate/solve/propagate off the main thread, so the
search tail never blocks the boil. Five workers and five per-game protocols ride one
shared transport: the memoized singleton, the pending map, prewarm, and a bounded
respawn — a worker-level `error` rejects every in-flight call with `WORKER_FAILURE` and
retires the singleton, so the next call instantiates a fresh worker rather than posting
into a corpse. There's no network solve path; the shipped deploy has zero server
dependency.

`solveBoard` caps the client search at a size-scaled node budget (larger boards
legitimately explore more); exhausting it surfaces a typed `BUDGET_EXCEEDED`
`SolverError`, distinct from provable UNSAT, thrown as an `instanceof Error` with a
`.code` — never a silently-wrong `solved: false`. `maxSolutions: 1` is always passed:
the first valid completion under `Ac3` propagation need not be the only one, so a
different, still-valid completion is unspecified-but-correct.

`techniqueEngine` grades boards over self-computed basic-elimination candidates, never
over the masks `propagateBoard` returns — those are post-full-GAC and collapse most
served boards to singletons, which would read every empty cell as a naked single.

## Visual style

- **Aesthetic**: hand-drawn pencil-and-paper. No Rough.js in the tree; grid lines,
  glyphs, and chrome are custom SVG path generation.
- **Grid lines**: jagged linear segments, angular kinks, path-based boil.
- **Board**: pane-less; `role="grid"` with `aria-rowcount`/`aria-colcount` and roving
  tabindex (exactly one cell carries `tabindex="0"`; arrow keys + Ctrl+Home/End
  navigate).
- **Ink**: original clues take `--color-foreground` graphite at the heavier stroke;
  what you write takes `--color-user-ink` blue; what the solver fills takes the
  theme-resolved `#solver-ink` rainbow, and only that ink celebrates.
- **Marginalia**: one `role="status"` live region (`MarginNote.vue`) speaks for the
  puzzle in graphite/teacher-red/gold-star tones; infra failures go to a separate
  `role="alert"` note card, so the page never conflates "you got it wrong" with "the
  machinery broke."
- **Light**: cream paper, dark ink, a sun with sparkle diamonds. **Dark**: warm brown
  ground, muted accents, a moon with twinkling stars.
- **Fonts**: self-hosted subsets — Fraunces (display), Fira Code (mono), Patrick Hand
  (handwritten).

The full animation system — cadence bands, the unified rAF scheduler, the solve
celebration, the grain hoist, hold-to-peek, and `pencilConfig.ts` — is documented in
[`../../docs/animation.md`](../../docs/animation.md).

## License

[MIT](../../LICENSE) © 2026 Mike Babb.
