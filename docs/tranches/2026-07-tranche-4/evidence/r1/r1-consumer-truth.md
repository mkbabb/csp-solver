# r1-consumer-truth — the import graph vs the registries

Repo HEAD 65425697, master. Frontend `web/frontend/src`. All paths repo-relative to `web/frontend/`.

## Method
- `npx knip` (clean, no bare `npm run lint`).
- Filter-def census: grep every `url(#<id>)` client per FILTER_PRESETS id, excluding the def file and comment-only lines.
- Cross-repo: enumerated pencil-boil v0.8.1 public surface (`/Users/mkbabb/Programming/pencil-boil/src/index.ts`) and grepped every `@mkbabb/pencil-boil` / `@mkbabb/csp-solver-wasm` import (multiline-aware).

---

## F1 (P2) — the W13 P4 rule "no def without a visible client" did NOT hold: two base filter defs are orphaned
family_hint: `registry-def-orphan`

`SvgFilters.vue` renders one `<filter :id="p.id">` for **every** entry in `FILTER_PRESETS` via `v-for="p in presets"` (`presets = Object.values(FILTER_PRESETS)`, SvgFilters.vue:10, runtime — no tree-shake). The W13 §1-P3/P4 header (SvgFilters.vue:17-29) and MEMORY.md ("W13 P4 rule: no def without a visible client — verify it HELD") assert every emitted def has a visible `url(#id)` client. Two do not:

- **`grain-outline`** (pencilConfig.ts:225, grain branch → emitted def) has **0** `url(#grain-outline)` clients. Its filter def is dead; only its `.grain` CONFIG is consumed as data at `grid/HandDrawnOutline.vue:76` (`FILTER_PRESETS["grain-outline"]?.grain`). HandDrawnOutline.vue:62 itself records the live `url(#grain-outline)` was retired at W13 §1-P2 — but the DEF was never removed from SvgFilters, so it still mounts on every page load with no consumer.
- **`wobble-logo`** (pencilConfig.ts:230, wobble branch → base def emitted at SvgFilters.vue:61) has **0** `url(#wobble-logo)` clients. Only its pose children `wobble-logo-p0..p3` are consumed (`HandwrittenLogo.vue:171` `url(#${pid})`). The base-def justification in the SvgFilters header (line 25-28: "base `#wobble-*` defs stay … for the transient and hover clients") does not apply to the logo — the logo has no hover/transient wobble client. Base `#wobble-logo` is orphaned.

By contrast every other id has clients: grain-static 11, wobble-celestial 4, wobble-heart 4, stroke-light/-dark 2 each. So the rule holds for 5 of 7 base defs and fails for 2.

Cost: two dead SVG `<filter>` subtrees (feTurbulence+feDisplacementMap each) mount in `<defs>` on every load, and the record's stated invariant is false.

Probe (rerunnable, from `web/frontend/`):
```
for id in wobble-logo grain-outline wobble-celestial wobble-heart stroke-light stroke-dark grain-static; do \
  n=$(grep -rn -- "url(#$id)" src | grep -v SvgFilters.vue | grep -v '// ' | wc -l | tr -d ' '); \
  echo "$id -> $n non-def clients"; done
# expect: wobble-logo -> 0 ; grain-outline -> 0 ; others > 0
```

---

## F2 (P3) — vestigial `texture` surface: interface + field + 4 dead guard clauses, no producer, no render branch
family_hint: `dead-scaffold`

`TextureConfig` (pencilConfig.ts:90, knip-flagged unused type), the optional `texture?: TextureConfig` field on `FilterPreset` (pencilConfig.ts:102), and the four `!p.texture` guard clauses in SvgFilters (lines 43, 61, 86, 122) are all dead: **no preset ever sets `texture`** (grep `texture:` in `src/pencil/config` → none), and SvgFilters has no texture-rendering branch (only grain/wobble/multiPass). The four guards are permanently-true no-ops.

Probe:
```
grep -rn "texture:" src/pencil/config/pencilConfig.ts   # → no producer
grep -c "!p.texture" src/pencil/chrome/SvgFilters.vue    # → 4 dead guards
```

---

## F3 (P3) — knip-confirmed unused exports / export-superfluity
family_hint: `export-superfluity`

`npx knip` (clean) reports 2 unused exports + 7 unused exported types. Verified dispositions:
- `DEFAULT_BOIL_CONFIG` (pencilConfig.ts:183) — re-exported at :183 but consumed only internally (:177, :180); no external importer. Superfluous `export`.
- `pickVariantIndex` (glyphRegistry.ts:35) — used only internally by `getVariant` (:50); the sole external mention (FutoshikiCaret.vue:12) is a prose comment, not an import. Superfluous `export`.
- `BoardSize` (futoshiki/types.ts:31) and `DrawInPreset` (pencilConfig.ts:341) — genuinely unused types (no consumer, incl. same-file).
- `InitSource` (sudoku & futoshiki useUrlState.ts), `WobbleConfig`, `MultiPassConfig`, `TextureConfig` — used same-file but never imported elsewhere; superfluous `export` keyword (TextureConfig also dead per F2).

Probe: `npx knip` from `web/frontend/`.

---

## F4 (P3) — DarkModeToggle hardcodes the celestial pose count instead of deriving it from the registry
family_hint: `hardcoded-pose-count`

The pose helpers are consumed by both stacks as required, but asymmetrically:
- `wobblePoseId` (pencilConfig.ts:335): 3 consumers — SvgFilters:125, HandwrittenLogo:50, DarkModeToggle:394.
- `wobblePoseFrequencies` (pencilConfig.ts:325): 2 consumers — SvgFilters:124, HandwrittenLogo:50. **DarkModeToggle does NOT consume it.**

HandwrittenLogo derives its pose count from `wobblePoseFrequencies(logoPreset)` (:50) — registry-driven, safe. DarkModeToggle instead hardcodes `Array.from({ length: 4 })` for `RAY_POSES`/`SPARKLE_POSES`/`STAR_POSES_D` (DarkModeToggle.vue:373-382) and `poseFilterId(i) = wobble-celestial-p{i}` (:394). SvgFilters emits `wobble-celestial-p{i}` for `i in wobblePoseFrequencies(preset)` = `offsets.length` = 4 (pencilConfig.ts:246-253). The counts agree today only by coincidence. If `wobble-celestial.offsets` were retuned to ≠4 entries (FilterTuner mutates config live; the surface is advertised "live-tunable"), DarkModeToggle would reference `url(#wobble-celestial-p3)` that SvgFilters no longer emits (offsets<4) or silently drop the extra pose (offsets>4). Latent desync; no live trigger at rest params.

Probe: `grep -n "wobblePoseFrequencies\|length: 4\|poseFilterId" src/pencil/celestial/DarkModeToggle.vue`

---

## F5 (P3) — pencil-boil 0.8.1 census: the app consumes ~16 of the library's ~35 public exports (library prune input)
family_hint: `library-surface-unconsumed`

Enumerated `pencil-boil/src/index.ts` (v0.8.1). Frontend-consumed (verified imports):
`mulberry32`, `generateSunRays`, `wobbleDiamond`, `wobbleStarPolygon`, `usePrefersReducedMotion`, `createBoilTicker`, `createSequenceSubscription`, `schedulerDebugInfo`, `heldFrameCount`, `acquireHold`, `releaseHold`, `easeOutCubic`, `resolveEasing`, `wobbleLine`, `wobbleLinePoints`, `useBoilCache` (+ types `WobbleOptions`/`Easing`/handles as needed).

**Unconsumed by this app** (for the library's own prune wave — NB may be consumed by pencil-boil's `proofs/` or other downstreams; census is app-scoped only):
`catmullRomToBezier`, `pointsToLinear`, `perturbPoints`, `perturbPointsClosed`, `wobbleRect`, `boilLineFrames`, `boilRectFrames`, `ellipsePoints`, `easeInCubic`, `easeInOutCubic`, `linear`, `useLineBoil`, `useBoilFrame`, `useFilterParamBoil`, `createStrokeDrawIn`, `isBoilHeld`, `useBoilFrames`.

Probe: `grep -rhoE "from '@mkbabb/pencil-boil'" ...` cross-referenced against `grep export pencil-boil/src/index.ts`.

---

## Verified green (no finding — banked so synthesis doesn't re-probe)
- **Removed surfaces stay removed:** `grep -rn "isomorphic\|futoshiki_api" src` → NONE. No stale reference to the excised isomorphic / futoshiki_api surfaces.
- **wasm exports all consumed:** sudoku worker imports `init, generateSudoku, propagateSudoku, solveSudoku, SudokuDifficulty` + `csp_solver_wasm_bg.wasm?url` (solver.worker.ts:26-37); futoshiki worker imports `init, generateFutoshiki, propagateFutoshiki, solveFutoshiki` + wasmUrl (solver.worker.ts:14-22). No dangling wasm export reference.
- **Glyph registry reachable:** `getVariant` (5 call sites: DigitPad, Sudoku/FutoshikiCell, HandwrittenGlyph, AnswerKeyLaminate), `getAllVariants` (HandwrittenGlyph x3), `toDisplayChar` (cells + DigitPad) all consumed via dynamic key `glyphPaths[char]` (knip blind spot — verified live).
- **bbnf vendor sync out of scope here:** `scripts/sync-csp-solver-vendor.sh` does NOT exist in this repo (`scripts/` holds only `dev.sh`); it lives in bbnf-lang (per MEMORY.md), which is push-forbidden and not this audit's tree. Nothing to consume here.
