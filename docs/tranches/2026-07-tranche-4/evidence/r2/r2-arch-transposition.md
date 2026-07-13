# r2-arch-transposition — the elegance mandate (DESIGN LENS)

Repo HEAD 65425697 (master). pencil-boil v0.8.1 (`/Users/mkbabb/Programming/pencil-boil`).
NO source edits. Lens: judge candidate architectural transpositions by
elegance + simplicity + performance; for each — necessary vs vanity, what breaks, wave scope.
frontend-design skill unavailable in this subagent env; proceeded (this is structure, not visual).

Verdict register below. **T1 (solver transport) is the crown**: byte-identical machinery
duplicated across the game boundary on a MISSTATED rule, while the repo already proves the
correct pattern (`lib/base64url.ts`). T7 (repo-boundary boil fork) and T6 (TS/CSS token seam)
are transpositions the round-1 registry MISSED.

---

## T1 — the solver/worker seam: one protocol, duplicated as two "owned copies" on a false boundary  [NECESSARY, P2]
family_hint: `dual-path-owned-copy`

The brief asks: "is the protocol a module?" **No.** `protocol.ts` per game holds only the
type union; the protocol's *implementation* — id-correlation, worker lifecycle, prewarm,
error fan-out, error serialization, error classification — is **copy-pasted between the two
games**, and three of the four files are **byte-identical code**.

Evidence (code bodies, comments stripped):
- `games/sudoku/solver/solverError.ts` vs `games/futoshiki/solver/solverError.ts`: `diff` shows
  differences **only in the doc comment** (lines 2–12). Code identical.
- `games/{sudoku,futoshiki}/solver/classifyError.ts`: comment-stripped `diff` is **EMPTY** —
  byte-identical classifier.
- `useSolver.ts` (sudoku:59–144 / futoshiki:41–139): `worker`/`nextId`/`pending` singletons,
  `ensureWorker()`, `warmed`/`prewarm()`, `call()`, `toRecord()`, `throwIfError()`, and the
  `SolveResponse` interface are line-for-line identical (only the `console.debug` game tag
  and the request-payload builders differ).
- `protocol.ts` (sudoku vs futoshiki): the ENVELOPE is shared —
  `{id;kind:'ping'}` request, `{id;ok:true;kind:'ping'}` pong, and the
  `({id;ok:false} & SerializedSolverError)` error branch are identical
  (sudoku/protocol.ts:27–33,64–70 ≡ futoshiki/protocol.ts:34–40,73–79). Only the
  solve/generate/propagate *payloads* diverge (`n` vs `boardSize`+`inequalities`).

The duplication is **defended in the source** as principled:
`futoshiki/solver/solverError.ts:4-6` — "Structurally identical to games/sudoku/… (the two
games never import each other — the boundary is enforced — so this is an owned copy, not a
shared import)"; `classifyError.ts:5-7` same. **This is a category error.** The enforced
boundary (`eslint.config.js:29-43`, `pencilMayNotImportGames` + the cross-game rule) forbids
*game-A → game-B*. It does NOT forbid *game → a neutral shared home*. The repo already proves
this: `lib/base64url.ts` is the URL codec, imported by BOTH games
(`sudoku/composables/useUrlState.ts:1`, `futoshiki/composables/useUrlState.ts:11`) — a neutral
third home, no boundary crossed. And `games/shared/` exists and is heavily used
(`@games/shared/useControlsDrawer` ×5, `DigitPad.vue` ×2, etc.). The solver transport was left
dual on a premise the rest of the tree contradicts.

**Transposition:** `games/shared/solver/` (or `lib/solver/`) holds
`createSolverClient<Req extends {id:number;kind:string}, Res extends {id:number}>()` —
the transport factory (singleton worker, `pending` map, `call`, `prewarm`, worker-error
fan-out) — plus the shared `SolverError`/`isSerializedSolverError`/`classifyError`/`classifyCode`
(byte-identical today) and a generic `SolverEnvelope` (ping/pong/error). Each game supplies
only its worker URL, its request-payload builders, and its marshalling
(`toFlat`/`toRecord`/`toFlatInequalities`). Est. deletion: ~180 of the 2× ~210 LOC useSolver +
the whole duplicated solverError (2×~40) and classifyError (2×~80).

- **Elegance/simplicity:** high win — one transport, one error grammar, one prewarm; the
  game files shrink to their genuine differences (the wire payloads).
- **Performance:** neutral (transport is per-game-instance either way; the worker URL stays
  game-local so chunk-splitting is unaffected).
- **What breaks:** nothing at runtime; the depth/boundary lint must gain an allowance that
  `games/shared/solver` is a legal import target (it already is — same class as base64url).
  The `worker`/`nextId` singletons become factory-closure state (one per `createSolverClient`
  call) — semantically identical to today's module singletons.
- **Necessary?** YES. This is the single largest verbatim duplication in the frontend, and its
  stated justification is false. Owner's mandate (elegance+simplicity) squarely applies.

Probe (rerunnable):
```
cd web/frontend/src
diff <(sed '/^\s*\*/d;/^\s*\/\*/d;/^\s*\/\//d' games/sudoku/solver/classifyError.ts) \
     <(sed '/^\s*\*/d;/^\s*\/\*/d;/^\s*\/\//d' games/futoshiki/solver/classifyError.ts)   # EMPTY
sed -n '59,144p' games/sudoku/solver/useSolver.ts   # vs futoshiki 41,139 — transport identical
```
Wave hint: **W-excision / W-solver-seam** (fold with FAM-5). Scope: 1 wave, mechanical.

---

## T2 — barrel vs deep-import: the grammar is DUAL at the config level; the barrel's own justification is half-false  [NECESSARY, P2]
family_hint: `dual-import-grammar`

r1-dead-code + r1-consumer-truth established the barrels are over-declared and games deep-import.
r2 sharpens WHY and settles the resolution.

The depth lint (`eslint.config.js:22-27`, `pencilDepthPattern`) forbids `@pencil/*/*/*`
(3+ levels) for games. Its own comment (eslint.config.js:16-17) admits **"1- and 2-level
imports (@pencil/chrome/BoilDivider.vue) stay open."** So:
- The barrel is **needed** only for symbols nested at 3-level — `HandDrawnGrid/HandDrawnGrid.vue`,
  `icons/DiceIcon.vue`, `AttributionCard/AttributionCard.vue`, `HandwrittenLogo/HandwrittenLogo.vue`,
  `OptionSelector/OptionSelector.vue`. Reaching those directly WOULD trip the lint.
- The barrel is **redundant** for the flat files it also re-exports (`BoilDivider.vue`,
  `MarginNote.vue`, `SvgFilters.vue`, `CompletionVignette.vue`, `HandDrawnOutline.vue`) — those
  are 2-level, lint-legal directly, and games DO reach them directly.

Measured grammar (both true today — this is the dual path):
- Barrel imports: exactly **3 statements** — `App.vue:8` (HandwrittenLogo, AttributionCard via
  `@pencil/chrome`), `SudokuBoard.vue:5` + `FutoshikiBoard.vue:17` (HandDrawnGrid via `@pencil/grid`).
- Deep 2-level game imports (bypass barrel): `App.vue:6,7` (SvgFilters, ScribbleLoader),
  both `SolverErrorNote.vue` (HandDrawnOutline), both boards (CelebrationHeart, CompletionVignette,
  MarginNote, generateCellRects).
- **Smoking gun:** `SudokuBoard.vue:6` + `FutoshikiBoard.vue:18` import
  `@pencil/chrome/CelebrationHeart.vue` — a component **NOT in the chrome barrel at all**
  (`chrome/index.ts` exports CrayonHeart + CelebrationStar, no CelebrationHeart). A live,
  dual-consumed chrome component that *cannot* go through the barrel. The barrel is not the
  grammar; deep-import is — and the barrel is stale against it.

**Transposition (one grammar):** the barrel is the documented intent and already re-exports
nearly everything games need. Make it the SOLE crossing grammar:
1. Trim each barrel to symbols actually imported-through-it, ADD the missing CelebrationHeart,
   DELETE the dead re-exports (`generateGridPaths` [dead fn, r1], `generateGridBoilFrames`,
   `usePathAnimation`, `GridPaths`/`BoilFrames` types — 0 barrel importers per r1).
2. Convert the ~7 game deep-import sites to barrel imports.
3. Tighten `pencilDepthPattern` to also forbid game→pencil **2-level** (`@pencil/*/*`),
   forcing everything through the barrel. Pencil-INTERNAL deep imports stay exempt
   (already are — eslint.config.js:18-19; e.g. `BoilDivider.vue:4` importing gridPaths).

- **Elegance:** one grammar, barrel = the pencil public surface, enforced not aspirational.
- **Performance:** neutral — r1-perf verified subdir barrels tree-shake (`sideEffects:false`,
  chunk-shape parity); the K41 lazy-chunk risk is a ROOT barrel only, not these subdir ones.
- **What breaks:** ~10 import lines rewrite; lint tightens (may surface a few more sites).
- **Alternative rejected (flatten + delete barrels):** would require collapsing the
  colocation sub-folders (HandDrawnGrid/, icons/, AttributionCard/) to kill the 3-level paths —
  violates the colocation edict. Barrel-as-grammar is the elegant fit.
- **Necessary?** YES — a live dual path with a self-contradicting justification and a stale
  barrel (missing a consumed component).

Probe:
```
cd web/frontend/src
grep -rnE "from '@pencil/(chrome|grid)'" . ; grep -rnE "from '@pencil/(chrome|grid)/" . | grep -v /index.ts:
grep -n CelebrationHeart pencil/chrome/index.ts   # → absent
```
Wave hint: **W-excision / W-idiom**. Scope: small.

---

## T3 — pencil/ as a package boundary vs a src dir: SHED the generic, KEEP the product (do NOT wholesale-promote)  [PARTIAL — vanity if total, necessary if surgical]
family_hint: `boundary-blur`

The brief: where does the boil/pose machinery finally live, given `rasterizePoseStack` lands in
the library? (NB: `rasterizePoseStack` does **not exist yet** anywhere — grep-confirmed; it is
the FAM-3/s3 bitmap-pose-cache concept, a planned facility.)

Judgment: **`pencil/` should NOT become a package wholesale**, and NOT fold into pencil-boil.
It mixes two irreducibly different tenants:
- **Generic, library-grade, domain-blind:** `grid/gridPaths.ts`'s grain-bake block
  (`grainLattice`:177, `grainNoise`:184, `subdividePolyline`:207, `bakeGrainPoints`:231,
  `grainFrameSeed`:254 — a feTurbulence-stand-in displacement facility over ANY polyline),
  `arcBoilPoints`:267, and the `generateRect/LineBoilFrames` generators. These are pure geometry,
  reused across surfaces, and versionable. **They belong in pencil-boil** (see T7). A future
  `rasterizePoseStack` is the same class → pencil-boil.
- **Product chrome, app-specific:** `chrome/SvgFilters.vue` (the app's 7 named filter IDs),
  `HandwrittenLogo`, `celestial/DarkModeToggle`, `sheet/AnswerKeyLaminate`, and the
  `config/pencilConfig.ts` token hub. These encode THIS product's aesthetic — not library
  material. **They stay a src dir.**

So the boil/pose machinery finally lives in **pencil-boil** (the library), and `pencil/` becomes
the thinner product-chrome + token layer that *consumes* it. Promoting all of `pencil/` to a
package would be **vanity** — it would drag product-specific filter IDs and Vue chrome into a
general-purpose animation lib, inverting the dependency. Surgical shedding is the elegant move.

- **Necessary?** The shedding half is necessary (it resolves T7's dual-path). The
  "pencil/ becomes its own npm package" framing is vanity — decline it.
- **What breaks:** T7's mechanics.
Wave hint: **W-library** (with T7). Scope: medium (cross-repo).

---

## T4 — games/shared: the three-home rule settled RIGHT, with one exception  [MOSTLY-SETTLED]
family_hint: `partition-truth`

The three-home partition (`pencil/` aesthetic · `games/shared/` cross-game domain ·
`games/{sudoku,futoshiki}/` per-game) is real and healthy for components/composables:
`games/shared/` holds DigitPad, DrawerTab, useControlsDrawer, usePencilMarks, useAnswerKeyPeek,
useCoarsePointer, useStackedLayout, solveTally, constants, types — all dual-consumed via the
`@games/shared/*` alias (measured: useControlsDrawer ×5, useCoarsePointer ×4, etc.). The URL
codec was correctly hoisted to `lib/base64url.ts`. This settled right.

**The one exception is the solver seam (T1)** — the most-duplicated code in the tree refused the
shared home that every other cross-game concern accepted, on the misstated boundary. The
three-home rule is sound; the solver just wasn't run through it. (Also latent: `InitSource` is
dual-copied `sudoku/…/useUrlState.ts:14` ≡ `futoshiki/…/useUrlState.ts:28` — r1 P3; a trivial
hoist to the same shared home.)

- **Necessary?** The partition is fine; the only work is T1 (+ the InitSource hoist).
Wave hint: folds into **T1's wave**.

---

## T5 — pencilConfig as the single token hub: it IS the hub for TS tokens, but the easing family is homeless  [NECESSARY, P2 — deepens FAM-11]
family_hint: `untokenized-easing` (mechanism confirmed; FAM-11)

pencilConfig.ts is a genuine hub: `PENCIL`(:6), `YOSHI_COLORS`(:17), `FILTER_PRESETS`(:296),
`MOTION`(:116, beat+bands), `BOIL_CONFIG`(:177), pose variants(:325/335), `DRAW_IN`(:354),
`GLYPH_ANIM`(:387), `CELEBRATION`(:401). Palette is largely centralized (only 15 raw hexes in
all .vue, most in SvgFilters feFlood plumbing, not palette leak). The bands/beat are tokenized
and consumed. **This part is settled.**

FAM-11's easing finding is CONFIRMED and I add the structural reason it stayed aspirational:
`MOTION.curves` (pencilConfig.ts:128-142) is a **TS** object with ONE row (`drawerGlide`), but
**38 of 39** recurring-curve occurrences are inline literals inside component `<style>`
`transition:` declarations — **CSS, which cannot import the TS token**. The tree has a whole
CSS token layer too: **138 `--custom-property` definitions** (index.css/typography.css/App.vue),
but grep-confirmed **ZERO** of them carry a `cubic-bezier`, and only **2** `v-bind()` TS→CSS
bridges exist. So the easing family lives in NEITHER hub — not the TS one (drawerGlide is the
lone tenant, reachable only via v-bind), not the CSS one (no `--ease-*` vars).

**Transposition (the elegant fix, sharper than FAM-11's "extend MOTION.curves"):** the 9 house
curves belong as `--ease-*` custom properties in the existing `:root` block (index.css, where
138 vars already live), referenced `transition: … var(--ease-noteWrite)`. That aligns the token
with where its consumers actually are (CSS). Extending the TS `MOTION.curves` instead would force
v-binding all 38 sites — heavier, adds reactive plumbing for static values. Keep `drawerGlide` in
TS only because it's genuinely v-bound; document the two-layer rule (TS tokens for JS/v-bind
consumers, CSS vars for style consumers). The "single hub" is really a **coherent two-layer**
system with a stated which-lives-where rule — not one file.

- **Elegance/perf:** CSS-var easing is zero-runtime (no reactivity), one source, retune-in-place.
- **What breaks:** 38 inline literals → `var(--ease-*)` (mechanical); `AnswerKeyLaminate.vue:227`
  (the retired overshoot spring, r1 P3) resolves as it adopts `var(--ease-flourishSpring)` or the
  glass token.
- **Necessary?** YES — the "one row per ruling" ledger invariant is currently fiction.

Probe:
```
cd web/frontend/src
grep -rho "cubic-bezier([^)]*)" . | sort | uniq -c | sort -rn      # 9 curves, 39 occ
grep -rnE '\--[a-zA-Z-]+:\s*cubic-bezier' --include='*.css' --include='*.vue' .   # EMPTY
grep -rc 'v-bind(' --include='*.vue' .                              # 2 total
```
Wave hint: **W-idiom** (Fable). Scope: small-medium.

---

## T6 (registry-missed) — the repo-boundary boil-frame FORK: the app reimplemented an unconsumed library primitive, and they've DRIFTED  [NECESSARY, P2]
family_hint: `cross-repo-dual-path`

pencil-boil v0.8.1 EXPORTS `boilLineFrames` + `boilRectFrames` (`path.ts:228,262`; `index.ts:12-13`)
— the "generate points once, perturb per frame" boil-frame generators. r1-consumer-truth F5
found them **unconsumed by the app**. Meanwhile the app's `grid/gridPaths.ts` defines
`generateLineBoilFrames`:426 + `generateRectBoilFrames`:300 — **the same concept**, forked with
extra features (grain-bake + rounded-corner `arcBoilPoints`). Two implementations of one idea,
one per repo, and the library's is the dead one.

They have **already drifted**: the app fork perturbs at seed `+ f * 997`
(gridPaths.ts:359,444,506); the library primitive at `+ f * 1013` (path.ts:249). Same algorithm,
different constants — a silent divergence that guarantees the two can never be swapped for each
other without a visual change. This is the classic fork-rot the elegance mandate exists to kill.

**Transposition:** promote the app's richer generators INTO pencil-boil (add optional
`grain?`/`radius?` params + `arcBoilPoints` + the grain-bake block to `path.ts`), delete the
weaker `boilLineFrames`/`boilRectFrames` (or make them the `grain`/`radius`-omitted call), and
have the app consume the library version — deleting ~250 LOC of forked generator from
`gridPaths.ts`, which shrinks to ONLY the Sudoku-grid geometry (the line/cell placement loops).
`rasterizePoseStack` (T3) lands in the same `path.ts`/a new `raster.ts` in pencil-boil.

- **Elegance/perf:** one boil-frame generator, versioned in the lib; the grain-bake facility
  (a general feTurbulence stand-in) becomes reusable; the drift is erased.
- **What breaks:** cross-repo — needs a pencil-boil minor (0.9.0) + a `file:`-link bump; the
  `+997`/`+1013` reconciliation is a deliberate visual decision (pick one, re-bank the boil
  goldens). r1-perf's N-layer-vs-single-canvas finding (FAM-3) informs where the raster half lands.
- **Necessary?** YES — a dual path spanning the repo boundary, actively drifted. Prime elegance target.

Probe:
```
grep -n 'f \* 1013' /Users/mkbabb/Programming/pencil-boil/src/path.ts       # 249
grep -n 'f \* 997'  web/frontend/src/pencil/grid/gridPaths.ts               # 359,444,506
grep -rc 'boilRectFrames\|boilLineFrames' web/frontend/src                  # 0 app consumers
```
Wave hint: **W-library** (with T3, cross-repo, pairs with r2-pencil-boil-audit's 0.9.0 shape).
Scope: medium.

---

## T7 (registry-missed) — the TS/CSS token seam (see T5) is itself the transposition
Folded into T5 above — the deeper structural finding is that pencilConfig (TS) and the 138-var
CSS layer are unbridged, and any token whose consumers are CSS `transition:`/`color:` (easing,
and arguably some palette) wants the CSS-var home, not the TS hub. The elegant system is a
documented two-layer partition, not "one file." Called out so synthesis doesn't read T5 as a
mere FAM-11 restatement.

---

## Non-transpositions — judged and DECLINED (elegance cuts both ways)
- **A shared Board scaffold** (SudokuBoard 740 LOC / FutoshikiBoard 682; useSudoku 412 /
  useFutoshiki 397): the two diverge on essential domain (subgrids vs inequality furniture,
  different cell/caret models). A forced shared board would be a lossy abstraction — vanity DRY.
  The `:ref` inline-churn (r1 vue-glass P3) is a real shared *fix*, not a shared *module*. DECLINE.
- **A shared ControlPanel** (703 / 558 LOC): same — the controls are genuinely game-shaped
  (difficulty vs board-size, distinct option sets). The shared pieces already ARE extracted
  (OptionSelector, DigitPad, DrawerTab). DECLINE further merge.
- **pencil/ → npm package (whole):** vanity (T3). DECLINE; do the surgical shed instead.

---

## Register summary (for the tranche schedule)
| # | transposition | verdict | necessity | wave | breaks |
|---|---|---|---|---|---|
| T1 | solver transport → games/shared/solver (factory) | NECESSARY | high | W-solver-seam | lint allow-list; nothing at runtime |
| T2 | one import grammar = the barrel (enforced) | NECESSARY | high | W-excision | ~10 imports + lint tighten |
| T3 | shed generic boil/pose from pencil/ → lib (NOT whole-package) | PARTIAL | med | W-library | =T6 |
| T4 | three-home rule | SETTLED (exc. T1) | — | — | — |
| T5 | easing family → CSS-var layer (two-layer hub) | NECESSARY | med | W-idiom | 38 literals → var() |
| T6 | repo-boundary boil-frame fork → promote to pencil-boil | NECESSARY | high | W-library | cross-repo minor; 997/1013 reconcile |
