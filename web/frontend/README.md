# csp-solver frontend

Vue 3 + TypeScript + Tailwind v4 single-page app with a hand-drawn pencil-and-paper
aesthetic (custom SVG glyphs, path-based grid boil, stroke-dasharray draw-ins). No
router, no state library. Five games — sudoku, futoshiki, thermo, killer, kenken —
share one aesthetic layer, one board/scene/controls shell, and one solver transport.
Solving runs in-browser via `@mkbabb/csp-solver-wasm` in one Worker every game shares;
the only server the deploy carries is the multiplayer relay, and a solo page never
opens it.

Shared animation primitives come from
[`@mkbabb/pencil-boil`](https://github.com/mkbabb/pencil-boil) `^0.12.0`. The motion
system — cadence bands, the unified scheduler, celebration timeline, grain hoist,
filter presets — is documented in [`../../docs/animation.md`](../../docs/animation.md).

## Setup

```bash
npm install              # deps (the wasm file: link resolves from the lockfile)
npm run wasm             # build @mkbabb/csp-solver-wasm into pkg/ — the file: link target (once per fresh clone)
npm run dev              # Vite dev server (:3000)
npm run build            # vue-tsc -b && vite build (a prebuild hook re-runs `npm run wasm`)
npm run preview          # preview the production build
npm run lint             # prettier --check --config .prettierrc.json src/ scripts/ ../../scripts/
npm run lint:eslint      # ESLint (boundary + depth rules, correctness)
npm run lint:knip        # knip — dead files, exports, deps
npm run test:unit        # Vitest (jsdom, src/**/*.test.ts)
npm run test:e2e         # Playwright — chromium + webkit
npm run test:golden      # visual goldens (DPR2, sRGB-pinned, reduced motion)
npm run deploy           # bash ../../scripts/deploy-gated.sh — no fresh green CI conclusion, no deploy
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
├── scripts/                        # the frontend gate scripts — 14 .mjs, most behind an npm run lint:*/test:*
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
        ├── cards.ts                # the GAMES card table the gallery reads
        ├── shared/                 # the shells, the machines, and the one solver every game rides (below)
        ├── sudoku/                 # spec.ts + SudokuPoster.vue, composables/, README.md,
        │                           #   data/templates.ts (generated — never hand-edit)
        ├── futoshiki/              # same shape, plus CaretOverlay.vue + FutoshikiCaret.vue for the
        │                           #   inequality carets and clue.ts to encode them
        ├── thermo/                 # spec.ts + ThermoPoster.vue, ThermoTube.vue, clue.ts, composables/
        ├── killer/                 # spec.ts + KillerPoster.vue, clue.ts, composables/
        └── kenken/                 # spec.ts + KenKenPoster.vue, clue.ts, composables/
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
- **Session** — `useSession` (the room, the roster, the Lamport ledger, and the
  transport seam), `relayWire` (NIP-01 straight to the co-deployed Durable Object,
  `import()`ed at join), `playerIdentity` (each peer's animal slug and its ink).
- **`shared/solver/`** — `solver.worker.ts` (the estate's one Worker module),
  `transport.ts` (the Worker singleton, pending map, prewarm, bounded respawn),
  `client.ts`, `protocol.ts`, `wire.ts`, `solverError.ts`, `classifyError.ts`,
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
│       └── GameShell → GameScene → BoardHost → GameBoard (#cells + #overlay slots) · GameControlPanel
└── view === 'gallery'
    └── GameGallery             # the five cards; flanks are static posters, the centre face is the live board
```

`GAMES` in `games/cards.ts` is the registration table: each card names its id
(`?game=` token), its wordmark, the size/difficulty bands it stages off the shared
selector vocabulary, its `localStorage` key, and the poster + spec loaders. A game
drops in by pushing one card; `App.vue` hands the row's spec to `GameShell` and nothing
else changes. `defineGame` pins the contract each game dir declares in its `spec.ts` —
the model composable, the board grammar, the clue seam, the cell furniture, the solver
spec, the url codec, the deal. The poster stays on the card row, so the gallery draws
five thumbnails without loading five specs. Every field is a component slot or a
per-game function, never a config flag.

One live board ever. The gallery doesn't clone it: `GameScene` wraps its board host in
a `<Teleport>` whose target `App.vue` points at the centre card's face, so the mounted
instance is reparented — marks, undo timeline, worker state intact — and parked home on
cancel. A disabled Teleport renders in place, so the playing view sees byte-identical
home DOM.

## Boundaries

`eslint.config.js` enforces the layering mechanically. Rules 2 and 3 aren't written
there: `eslint.boundary.config.js` generates them from the game list on disk, and
`eslint.config.js` imports them.

1. `src/pencil/**` never imports `src/games/**`. The aesthetic layer draws whatever
   generic, already-erased data it's handed via props; it never reaches into domain
   state. The reverse is expected and unrestricted.
2. No game imports another. `crossGameRules` derives the whole matrix — n×(n−1) = 20
   ordered pairs over the five directories carrying a `spec.ts` — so a sixth family is
   bound the moment its spec lands, with no edit to the config.
3. `src/games/shared/**` never imports a concrete game — the shared floor stays
   game-agnostic.
4. Depth: `src/games/**`, `App.vue`, and `main.ts` may not reach 4+ levels into pencil
   internals. A foldered component's public file
   (`@pencil/<subsystem>/<Component>/<Component>.vue`) is the deepest legal reach;
   flat modules sit shallower.

The matrix runs twice: folded into `npm run lint:eslint` (each generated block carrying
the depth pattern too) and standalone as `npm run lint:boundary`, its own CI lane, which
throws rather than lint vacuously green if it reads fewer than 2 families. Nothing the
variants share comes from a sibling — the cell, the tier constants, and the technique
engine all sit in `src/games/shared/**`, and no cross-game import survives in the tree.

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
`?view=gallery` deep-links the picker, and all five games — sudoku, futoshiki, thermo,
killer, kenken — round-trip a whole board through `?board=` (base64url) alongside
`?size=`/`?difficulty=`. Each also persists to its own `localStorage` key, so a board
survives a reload as readily as a send.

`?s=` carries the other kind of truth: a room, and the whole of the capability to enter
it. `useSession` is the subsystem behind it — the one state that leaves the device.
Every cell write goes out author-stamped with a Lamport pair `[lamport, author]`, and the
higher pair takes the cell on every page, so the room converges whatever order the writes
arrive in; a second stamp, the epoch, marks which board a write was aimed at, so a digit
meant for the board before the last deal is dropped rather than inked into the new one. No
CRDT library rides along: the board is `pos → digit` over a fixed index set, and a cell
that cannot move needs no sequence reconciled.
The wire is five verbs — `hi`, `op`, `st`, `cur`, `bye` — presence, one cell write, the
whole board, the focused cell, and the departure.
A peer's digits carry that peer's own ink, walked off the golden angle, so two players at
one board are never handed the same hue.

Transport is a seam with two arms behind one interface. `relayWire` speaks NIP-01 to the
Durable Object below and is `import()`ed at join, so a page playing alone downloads none
of it; `localWire` carries the identical script over `BroadcastChannel` for a second tab
on the same device, is DEV-only behind `?wire=local`, and is what the multiplayer e2e
battery drives, because a live relay in CI is a flake machine. Marks are private per op
and public per epoch: no `op` ever carries a mark, but the whole-board `st` frame carries
the board AND its marks, so a joiner adopts the publisher's and every deal, clear, or
solve republishes them. The protocol, both halves of the seam, is single-homed in
[`../../docs/multiplayer.md`](../../docs/multiplayer.md).

## Solve path

`games/shared/solver/solver.worker.ts` is the tree's only Worker module — an ES-module
Worker that top-level-imports `@mkbabb/csp-solver-wasm` and runs generate/solve/propagate
off the main thread, so the search tail never blocks the boil. Five per-game protocols
ride one shared transport: the memoized singleton, the pending map, prewarm, and a
bounded respawn — a worker-level `error` rejects every in-flight call with
`WORKER_FAILURE` and retires the singleton, so the next call instantiates a fresh worker
rather than posting into a corpse. There's no network solve path: the search never leaves
the tab. The deploy isn't server-free, though: `public/_headers` grants one `connect-src`
to `wss://sudoku-relay.mkbabb.workers.dev`, the co-deployed `web/relay` Durable Object
the multiplayer session speaks NIP-01 to. A solo page opens no socket at all, because
that transport is `import()`ed at join. The session — its arithmetic, wire grammar, and
trust model — is documented in [`../../docs/multiplayer.md`](../../docs/multiplayer.md).

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
