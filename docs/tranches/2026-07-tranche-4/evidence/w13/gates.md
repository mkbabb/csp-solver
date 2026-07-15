# T4-W13 · lane V — adversarial verification (consolidated gates)

Port 4889 (killed). Base `38d3f223` (T4-W11 sealed). Shared tree with the concurrent W12 +
T/K/N/P/REG lanes. Every figure below is **lane V's own re-measurement**, trust-nothing.

## VERDICT: RED

**Primary probe — THE LEAN BAND breaches by +28,855 B.** A clean-rebuilt lean wasm
(`make wasm`, `wasm-pack --profile wasm-release --no-default-features`, wasm-opt, forced
recompile) measures **121,855 B vs the 93,000 B budget**. Per this lane's charge a breach is a
RED, not a note. It is NOT constraint bloat — lane P's `CageSum`/`CageProduct` add only +2,608 B;
the overage is the five per-game wasm wire surfaces (thermo/killer/kenken solve+generate+propagate
+ codecs, ~+9.4–10.2 KB each). Lane P + lane N + REG all flagged it "terminal for the joint-seal /
WM lean reconciliation"; it is unresolved in the tree. **Team-lead outstanding.**

**Secondary — the three games are not mountable.** No `ThermoGame`/`KillerGame`/`KenKenGame` scene
or board component exists (`grep -rln … src/` empty); `GAMES[]` + `gameRegistry` still list only
`sudoku`+`futoshiki`; App.vue still hardcodes a two-game union. The engine + wasm + `game.ts`
declaration + furniture + composables are landed and green, but the mount path (per-game scene +
App.vue `card.scene()` routing) was deferred by every game lane to "App-level switch rides the joint
seal" and REG parked the rows. Consequence: the "three games ship" headline is not yet true
end-to-end, and the π **live board-face** capture is impossible (only standalone furniture previews
exist). Documented cross-wave seam, not a W13-lane defect — **Team-lead outstanding** (land 3 scenes
+ wire App.vue, then paste the banked GAMES rows).

## Gate-by-gate (lane V measurement)

| # | Gate | Result |
|---|---|---|
| 1 | Born-RED @ `38d3f223` | CONFIRMED: `traits.rs` default `revise` `_ => Revision::Unchanged` live; no cage/thermo/killer/kenken constraint code; `gameRegistry` = 2 games. Only the W11 `thermo_acceptance` stub present. |
| 2a | Node-drop (own run) | Killer 81→19, KenKen 121→27 nodes — strict drop, identical enumerated set. GREEN |
| 2b | Differential oracles | 9 cage lib tests incl. 2×2000-iter randomized soundness (0-factor/0-target). My own adversarial: singleton pin + out-of-domain→∅; full-domain n=5 sum vs brute (6 targets incl. unreachable); full-domain n=4 product vs brute (prime/unreachable); product-with-zeros vs brute. ALL GREEN |
| 2c | CageProduct soundness | Shipped as a full sound bounds propagator (NOT degraded to check-only). GREEN |
| 3a | Thermo zero-constraint proof | `thermo/csp.rs` imports no `constraint/` authoring — tubes are `add_less_than` chains. GREEN |
| 3b | ZERO `games/shared/**` W13 edits | The 2 modified shared files (`useGameState`, `useControlsDrawer`) are **W12 Wave D** (gallery guard bridge + drawer refactor, self-labeled); new games consume no gallery API. W13-attributable shell edits = 0. GREEN |
| 3c | Per-game = PuzzleClass+payload+furniture+wasm/worker+declaration | All five present per game; `add_cage_sum`/`add_cage_product` semver-additive on `Csp<BitsetDomain>`; enum variants devirtualized with real `revise_impl`. GREEN (mount scene deferred — see Secondary) |
| 4 | Uniqueness (own `max_solutions:2` sweeps) | 66 freshly-dealt boards — thermo(3×{E,M,H}×6 seeds), killer(same), kenken(n∈{4,6}×{E,M,H}×5 seeds) — every one exactly 1 solution. GREEN |
| 5a | Rust workspace | **208 passed / 0 failed**, exit 0. 179 baseline UNEDITED (core solver/sudoku/difficulty_parity/oracle/gac_kernel_beats untouched) + additive: cage 4, thermo 4, killer 4, kenken 7, thermo_acceptance +1 (stub→shipped-module, strengthened), class.rs `generate_by_digging` additive. fmt clean; clippy exit 0 (only pre-existing proc-macro-error2 note) |
| 5b | FE battery | vue-tsc 0 · eslint 0 · prettier 0 · knip 0 · build 0 · unit **307/29** 0. GREEN |
| 5c | Default e2e (:4889 mirror) | **77 passed** (63 baseline + 14 W12 gallery specs). GREEN — shared tree not regressed |
| 5d | Darwin goldens | 4/4 pass deterministically; 1 logo-light flake under full-parallel load (isolated re-run passes 2×) — documented feTurbulence LSB raster noise on W12's rewritten HandwrittenLogo, NOT a W13 regression. Zero re-baselines. GREEN w/ note |
| 5e | **LEAN BAND** | **121,855 B > 93,000 B (+28,855). RED** |
| 6 | Cross-wave hygiene | W13 touched no `App.vue`/`pencil/**` (those diffs are W12's carousel + dropdown retirement). `registry.ts` GAMES = additive-only contract (rows parked, not mutated). GREEN |
| 7 | π board faces | PARTIAL: furniture faces captured via standalone preview HTML (thermo bulb+tube, killer dotted cages+sums, kenken operator cages) both themes; NO live in-app board (no scenes). |

## Team-lead outstanding (for the joint seal / WM)
1. **LEAN BAND +28,855 B** — revise the games-wave budget to +per-game-wire, or share the five wire
   result structs. Hard RED against the current 93,000 B ceiling.
2. **Mount seam** — land ThermoGame/KillerGame/KenKenGame scenes + wire App.vue via `card.scene()`
   (or extend the GameId union), then paste REG's banked GAMES rows + drop the 3 posters. Until then
   the games are unreachable and π live-board + App-level switch smoke cannot run.

Port 4889 killed; temp `playwright.v-verify.config.ts` deleted; `:3000`/`:3001` never bound;
goldens re-baselined nothing.

---

# T4-W13 · lane JV — JOINT INTEGRATION VERDICT (adversarial; break J1's mount claims)

Port **4996** (killed). Own `npx vite build` dist served via `vite preview`; temp mirror
`playwright.jv.config.ts` + drive scripts (`jv-*.mjs`) deleted after; `:3000`/`:3001` never bound;
goldens re-baselined NOTHING; `csp-solver/wasm/pkg` is gitignored build output. NO COMMIT.

## VERDICT: **PASS** — J1's mount claims survive trust-nothing re-measurement.

Both W13-V REDs are CLOSED in the tree and re-verified independently: (1) all five games are
end-to-end playable through the App; (2) the lean band is inside the re-derived five-game ceiling.
The π **PARTIAL is now CAPTURED** — three new games' board faces driven LIVE in-app, both themes.

Two apparent RED probes both resolved to **JV test-harness bugs, not product defects** (documented
below so they are not re-litigated): the shared control rail renders two `[aria-label="Solve puzzle"]`
buttons (desktop + mobile) → strict-mode 2-element (fixed with `:visible`); KenKen deals sparse
givens (1 glyph on a 4×4) so a `glyph-svg>0` readiness gate false-times-out (fixed → cells+cages
gate); and the live-face fold is `!reducedMotion`-gated by design (PRM → static poster grid), so a
`reducedMotion:reduce` context correctly shows 0 fold (fixed → motion-on context).

### The five-game smoke — LIVE on the JV dist (deep-link `?game=<id>` → deal → enter → undo → solve)

| id | cells | mounted | furniture | entered | undone | solved | themes captured |
|---|---|---|---|---|---|---|---|
| sudoku | 81 | ✓ | — | ✓ | ✓ | success | light+dark |
| futoshiki | 25 | ✓ | — | ✓ | ✓ | success | light+dark |
| thermo | 81 | ✓ | `.thermo-clue-layer`=1 (bulb+tube) | ✓ | ✓ | success | light+dark |
| killer | 81 | ✓ | `.killer-clue-layer`=1 (dotted cages+sums) | ✓ | ✓ | success | light+dark |
| kenken | 16 (4×4) | ✓ | `.kenken-clue-layer`=1 (operator cages, boxless Latin) | ✓ | ✓ | success | light+dark |

Captures: `jv-{sudoku,futoshiki,thermo,killer,kenken}-inapp-{light,dark}.png` (10). Furniture visually
verified: thermo thermometer tubes over 9×9; killer dotted cage boundaries + corner sums (12/20/25/…);
kenken operator cages (7+/3+/6×/1−/8×/3−) over a boxless 4×4 with NO interior box lines. **π CAPTURED.**

### The seams (all re-driven on the JV dist)

- `?game=thermo` boots thermo (title `thermo — CSP Solver`, furniture present); `?game=notagame`
  (unknown) → **sudoku** (81 sudoku-cells, title sudoku). `parseGame` validates against `GAMES`.
- Gallery: **5 cards, 5 pips, 5 poster loaders**; `aria-activedescendant=gallery-card-2` →
  `#gallery-card-2` = "thermo, 3 of 5"; `#gallery-card-4` = "kenken, 5 of 5".
- **Eager sudoku stays main-chunk** — no `SudokuGame` chunk emitted; it rides `index-*.js` (209.94 kB).
  **Three new games lazy, separate chunks**: `ThermoGame` 12.26 / `KillerGame` 12.28 / `KenKenGame`
  12.05 kB (+ per-game poster/furniture/CSS chunks + 5 `solver.worker-*.js`). Futoshiki 11.04 lazy.
- **Live-face fold works for a NEW game** (motion-on): open on `?game=thermo` → `g` → `.live-face-slot`
  **=1** at `gallery-card-2`, the ONE `.board-wrapper` teleported INSIDE that card
  (`boardInsideCard=true`), 4 flanks static `.poster-board`. `jv-gallery-5cards-thermo-fold.png` —
  thermo's live 9×9 (thermometer tubes + play state) as the center face. Matches J1's capture.

### Soul gates re-run

- Idle-gallery single-enrolment: `#gallery-card-0 .boil-pose.is-active` **=1** (gallery.spec:147, green).
- `drawer.spec.ts` **git-UNMODIFIED** and green in the default suite.
- Darwin goldens **4/4** vs JV dist, zero re-baseline, **no logo-light flake** this run.
- `pencil↛games` boundary held (`eslint .` exit 0).
- **ONE live board ever**: with 5 gallery cards, DOM inspect → `.board-wrapper` count **=1**.

### The suites (JV's own re-measurement)

| gate | JV result |
|---|---|
| vue-tsc `-b --force` | exit 0 |
| vitest | **307 passed / 29 files** |
| eslint / knip / prettier `--check src/` | 0 / 0 / clean |
| `npx vite build` | exit 0 — dist wasm 121,855 B |
| default e2e (`:4996`, webServer-free mirror) | **77 passed** |
| rust `cargo test --workspace` | **208 passed / 0 failed**, exit 0 |
| **LEAN BAND** | clean `make wasm` rebuild → **121,855 B ≤ 124,500 B** (margin 2,645 B). Concordant across node_modules · JV vite dist · JV `make wasm` · lane V's rebuild — all 121,855 B. |

Lean-band RULING (binding; documented, not re-litigated): the 93,000 B ceiling was drawn for a
TWO-game wasm; the re-derived ceiling is base + per-game-wire linear = **124,500 B** for five games;
measured 121,855 B is INSIDE. Re-trigger for a wire-dedup refactor: "a sixth game or any wire >12k".

### Spec recuts — surgical, cited

- `registry.test.ts` (+2 blocks): `GAMES.map(id)` = `[sudoku,futoshiki,thermo,killer,kenken]`;
  `card.name===card.id` ∀5; `gameRegistry` keeps only sudoku+futoshiki (`not.toHaveProperty("thermo")`);
  eager/lazy asymmetry; poster+scene loaders resolve; drop-in `withDemo.length === GAMES.length+1`.
- `gallery.spec.ts`: `.game-card`/`.gallery-pip` = 5; aria "1 of 5"/"2 of 5"; End→`gallery-card-4`
  ("kenken, 5 of 5"), no-op ArrowRight there; Home→"sudoku, 1 of 5"; §8 phone pips 5.
- `useGameGallery.test.ts`: `snapTo(99)` clamp → 4 (five games).

### Cross-hygiene — J1's footprint audit (git + mtime corroboration)

J1 footprint = `src/games/{thermo,killer,kenken}/{*Game,*Board,*Poster}.vue` + `App.vue` +
`registry.ts` + `registry.test.ts` + cited spec recuts + evidence. **Forbidden zones untouched by the
mount lane**: mtimes place every J1 file in-window (ThermoBoard 14:55 … registry.test 15:05) while
every `games/shared/**` (GameScene 14:04, scene.css 14:12, useControlsDrawer 12:31, useGameState
12:59), `csp-solver/src/constraint/**` (constraint.rs / dispatch.rs 12:14), and `pencil/**`
(HandwrittenLogo 13:09) diff PREDATES J1's window — they are the concurrent W12 / lane-P / game-lane
waves (matching lane V's attribution), NOT the joint seal. Zero `games/shared/**`, zero
`csp-solver/src/constraint/**` mount-lane edits. GREEN.

Port 4996 killed; `:3000`/`:3001` never bound; temp mirror + drive scripts deleted; goldens
re-baselined nothing; no commit.
