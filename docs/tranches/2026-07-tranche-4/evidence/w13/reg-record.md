# T4-W13 · lane REG — registration + the ledger rows

Base HEAD `38d3f223` (T4-W11 sealed). Port 4888. Working tree shared with the concurrent W12
(carousel) + T/K/N (games) + P (cage primitives) lanes. REG's write-set is **docs only**:
`README.md` (the ledger) + `evidence/w13/reg-{record,pending-cards}.md`. **Zero `src/` edits,
zero `csp-solver/` edits** — see the footprint proof.

## 1. The GAMES[] rows — PARKED, with a hard reason (not landed)

The Thermo/Killer/KenKen `GameCard` rows are banked paste-ready in
[`reg-pending-cards.md`](reg-pending-cards.md) (exact import + row literals, + the three
`*Poster.vue` components ready to drop). They are **not landed in the tree** because they cannot
build clean this lane — a downstream integration seam no lane closed:

- **The three scene components do not exist.** `grep -rn 'ThermoGame\|KillerGame\|KenKenGame\|
  ThermoBoard\|KillerBoard\|KenKenBoard' src/` → **empty**. The T/K/N game lanes ALL explicitly
  deferred the mountable scene/board (`w13/{t-thermo,k-killer,n-kenken}.md` §SCOPE, verbatim:
  *"The mountable scene/board … is NOT built this lane … the scene wiring + the `GAMES[]` registry
  row are W12's carousel seam ('App-level switch smoke rides the joint seal')"*). A `GAMES` row
  whose `scene` dynamically imports a non-existent module fails BOTH `vue-tsc` (`Cannot find
  module`) and `vite build` (`Could not resolve` — Vite resolves the static-string dynamic import
  at build time). So the rows are unbuildable until the scenes exist.
- **App.vue never consumes `card.scene()`, and extending it is W12's exclusive seam.** W12 wired
  `GAMES` into `App.vue` ONLY for the gallery card FACES (`<GameGallery :cards="GAMES">`); the game
  MOUNT is still a hardcoded `type GameId = "sudoku" | "futoshiki"` with `setGame` routing anything
  non-`futoshiki` to `sudoku` and `<SudokuGame v-if="scene==='sudoku'">` / `<FutoshikiGame
  v-if="…='futoshiki'">`. `card.scene()` is dead in the app. Mounting a third game requires editing
  `App.vue`'s union + routing + `v-if` — **App.vue is W12's exclusive territory (the cross-wave
  seam: "You must NOT edit App.vue")**. Adding rows + scenes without that App change ships
  unreachable lazy chunks (a select routes to sudoku) — a dead path M2 forbids.

**This is NOT a contract redraw** (no `games/shared/**` edit is wanted — all five `game.ts`
declarations type-check against `defineGame`/`GameCard`; the four shells are byte-untouched). It is
an **integration-seam finding**: the mount path (per-game scenes + `App.vue` routing via
`card.scene()`) is a joint-seal deliverable. REG banked the rows + posters and flagged the seam;
the joint seal drops them once the scenes + the App.vue mount land (checklist in the pending doc).

## 2. The DECIDED-retire ledger — LANDED (spec ROWs 5–8)

Landed in `docs/tranches/2026-07-tranche-4/README.md`, matched to the README's own §4 grammar
(bold DECIDED disposition labels; pipe tables):

- **§4f retitled + expanded** — "The banked game set + the DECIDED-retire games (W13, B4 / M8)".
  - **ROW 6 (bank)** preserved verbatim, now BANK-labeled: Skyscrapers · Arrow Sudoku · Kakuro ·
    Sandwich Sudoku · Hidato/Numbrix — each with its named re-trigger.
  - **ROW 7 (retire, each with its OWN rationale)** — the lumped "Binairo/Takuzu · Hitori" row is
    un-lumped and the set completed: **Binairo/Takuzu** (wrong engine — nothing all-different) ·
    **Hitori** (non-CSP global connectivity; shading not the digit shell) · **Nonograms/Picross**
    (line-DP, not the CSP core — wrong tool) · **Word search** (no solving problem; not the product
    identity).
  - **ROW 5 (crosswords)** — a dedicated retire row with the **two verified walls**: a real
    per-length word bank overflows the u128 domain ceiling (`bitset.rs:38`) + non-CSP/NLP clue
    authoring (offline-wasm violation); the sole re-trigger a curated ≤128-word grid-fill-only
    variant, which strays from the digit idiom.
- **§4c M8 row precision fix** — its parenthetical named the wave's general Wall-1 ("n-ary
  blindness"), which is NOT the crossword wall (crossword crossings are BINARY letter-match lambdas
  that DO propagate). Corrected to the spec-precise pair — "non-CSP/NLP clue authoring + the u128
  word-bank ceiling" — removing an in-document contradiction (M2/M6 truth discipline).
- **ROW 8 (`propagate_stratified`)** — already terminal at §4b ("RETIRED (terminal) — no consumer …
  W13 (checked) → retired"), NOT duplicated. **Re-confirmed live**: `grep -rn propagate_stratified
  csp-solver/` → empty (exit 1); the tree carries `constraint/cage.rs` (P's `CageSum`/`CageProduct`
  `revise_impl`s) + `add_cage_sum`/`add_cage_product` — bounds-propagation over a scope, NOT a
  stratified scheme. The §4b exception check holds: the cage primitives do not want it. Retire stands.

## 3. Gates

| Gate | Probe | Result |
|---|---|---|
| **footprint (nothing outside REG moved)** | `git diff --stat -- README.md` vs full `git diff --stat` | MY tracked edit = **README.md only** (+18/−10). Every other diff entry (`App.vue`, `registry.ts`/`.test.ts`, `csp-solver/**`, `pencil/**`, `useControlsDrawer`, `useGameState`, `HandwrittenLogo`, e2e/*) is the concurrent W12 / T / K / N / P lanes — untouched by REG |
| **ledger rows land** | `grep` §4f / §4c | ROW 5/6/7 present at §4f (line 169–188); ROW 8 terminal at §4b (confirmed); §4c M8 trued |
| **prettier** | `npx prettier --check src/` | **"All matched files use Prettier code style!"** |
| **build (vue-tsc + tree-shake)** | `npm run build` (`vue-tsc -b && vite build`) | **exit 0**, built in 2.14s. Parked posters/games correctly ABSENT from dist (thermo/killer/kenken tree-shaken — declaration layer, no `GAMES` row); W12's SudokuPoster/FutoshikiPoster/PosterBoard chunks present |
| **eslint** | `npm run lint:eslint` | **exit 0** |
| **knip** | `npm run lint:knip` | **exit 0** (game dirs non-orphan via their `game.test.ts` anchors; no parked poster orphaned — none dropped) |
| **test:unit** | `npm run test:unit` | **307 passed / 29 files**, exit 0 |
| **registry additions compile + tree-shake clean** | (parked) | N/A this lane — no `GAMES` addition landed (build-blocked by the missing scenes, §1); the tree with REG's docs-only change compiles + tree-shakes clean (build + knip green) |

## 4. The lean band + rust/wasm

REG adds **zero rust and zero wasm surface** (docs + parked FE only) — REG neither improves nor
regresses the lean band. The dist wasm at the joint tree is **121,855 B** (matching lane N's
isolated measure), **over the 93,000 B budget** — the FIVE per-game wire surfaces
(sudoku/futoshiki/thermo +9,766 / killer +10,152 / kenken +9,368), **not constraint bloat** (P's
`CageSum`/`CageProduct` add only +2,608 B). This is lanes T/K/N/P's flag, terminal for the joint
seal / WM lean reconciliation (revise the games-wave budget to +per-game-wire, or share the five
wires' result structs). Carried here as an observed cross-lane figure, not a REG deliverable.

## 5. e2e / goldens

REG's e2e footprint is **nil** — the three games cannot mount App-level (no scenes + App.vue's
two-game switch), so there is no gallery-select smoke to run this lane; it rides the joint seal
(per the game lanes' §SCOPE and the cross-wave spec, "App-level switch smoke rides the joint
seal"). Goldens re-baselined nothing. `:4888` never bound (no preview needed — docs-only landing);
`:3000`/`:3001` never touched.

## Headline

The DECIDED-retire ledger (spec ROWs 5–8) LANDS in `README.md` §4f/§4c/§4b, each candidate on the
record with its rationale, matched to the README grammar; the FE battery is GREEN over the joint
tree (prettier · build · eslint · knip · 307 unit); REG's tracked footprint is README-only
(git-diff-proven). The three `GAMES[]` rows are PARKED paste-ready with a hard, verified reason —
the per-game scenes + the `App.vue` mount routing (`card.scene()`) are a joint-seal integration
seam no lane closed, and `App.vue` is W12's exclusive territory. **FLAG for the joint seal:** land
the three scenes + wire `App.vue` to mount via `card.scene()` (or extend the `GameId` union), then
paste the banked rows + drop the three posters.
