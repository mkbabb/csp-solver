# T4-W7 — the technique engine — consolidated gate table

VERIFY lane, adversarial re-run against base SHA `3b587b86`. Every lane claim re-run from
scratch; nothing trusted on report. Battery exits (all `0`): vue-tsc `-b --force`, test:unit
(19 files / 195 tests), lint:eslint, lint:knip, prettier --check src/, build (177 modules) ·
rust fmt / clippy `-D warnings` / test --workspace · wasm-pack test --node (14: dualization 5
+ futoshiki_parity 9) · default e2e 62 passed (BUILT DIST :4188) · goldens 4 passed, 0 moved.

| Gate | born-RED (base SHA) | close (verified) | evidence-pointer |
|---|---|---|---|
| **Headline** — hint NAMES the cheapest technique with `becauseCells` before revealing; grade = hardest technique the engine needed; both over self-computed basic candidates, never GAC masks; sudoku + futoshiki graded; zero wasm for R1–R3 | no technique layer; hint = answer-key reveal; grade = opaque bucket | engine names the ladder; deal-time grade = `hardestTechnique`; grading path never reads `propagateBoard`/GAC (grep clean); both games graded; R1–R3 pure TS | this file; `e1-engine.md`, `e2-futoshiki.md`, `e3-hint-ux.md` |
| **substrate** (born RED) | grep `naked single\|hidden single\|x-wing\|pointing\|swordfish\|technique` over `src` returns empty | after: only the new technique layer + its wiring name these; singles board → tier-1, X-wing board → tier-3; self-computed candidates ≠ GAC-collapsed masks (independent re-derivation: 57+ empty cells self-ambiguous while GAC pins singletons; a GAC substrate grades tier-1) | `techniqueEngine.ts:8-18,39-101`; `sudokuTechnique.test.ts:64-110`; VERIFY independent harness (X-wing REQUIRED — ladder stalls when the rung is refused; GAC-collapse → naked-single tier-1) |
| **hint names the technique** (born RED) | `useSudoku.ts` hint reveals the digit with no name ("the hint IS a one-cell solve reveal") | two-press: 1st press names the cheapest single in the margin + lights `becauseCells` (`is-because` laminate); 2nd press inks via the existing reveal draw-in. Verified in a real browser both games (kbd + touch) | `useSudoku.ts:326-364`, `useFutoshiki.ts:294-352`; `SudokuBoard.vue` margin watch; e2e `affordances.spec.ts:298`, `mobile-affordances.spec.ts:206`, futoshiki two-press (browser) all pass |
| **fill-forced** (born RED) | only whole-board `solve()` or one-cell reveal — no middle rung | `fillAllForced` applies every current naked+hidden single in one sweep, then stops (no search, no cascade); fills exactly the forced-cell set; leaves a deadly-rectangle board untouched | `techniqueEngine.ts:656-692`; `sudokuTechnique.test.ts:112-149`; VERIFY hand-check (one-blank grid → fills exactly that cell) |
| **grade replaces bucket** (born RED) | difficulty is an opaque bank label, not measured live | deal-time grade runs to completion on `randomize`; `hardestTechnique`/`gradeSolved` held on game state; `freshBoardCopy` substitutes the measured signature ("singles only" / "needs an X-wing") for W6's request word once graded; ungraded boards keep the request voice | `useSudoku.ts:78-88,205-214`; `SudokuBoard.vue` `freshBoardCopy`; `techniqueVoice.ts:47-73` + `techniqueVoice.test.ts` |
| **futoshiki parity** (born RED) | `useFutoshiki.ts` reveals from the answer key, no technique | same shared engine grades futoshiki via singles + `inequality-forcing` (tier 2) + `inequality-chain` (tier 3); ONE `techniqueEngine.ts`, no second implementation; adapter substrate stays pure all-different (inequality reasoning lives only in the two appended rungs) | `techniqueEngine.ts:362-497`; `futoshikiTechnique.ts`; `futoshikiTechnique.test.ts` (singles→t1, forcing→t2, chain→t3, each stallsWithout its rung); `e2-futoshiki.md` |
| **zero-wasm (R1–R3)** | — | frontend diff touches only `web/frontend/src/games/**` + the two recut e2e specs; the SOLE `csp-solver/wasm` touch is E4's flagged getter pair (`nodes_explored`/`propagations` on both result types); lean wasm **90,249 B < 93,000 B** CI budget (2,751 B headroom); getters typed `bigint` on both `.d.ts` surfaces | `git diff --name-only`; `sudoku.rs`/`futoshiki.rs` getter diff; `e4-telemetry.md`; wasm-pack test --node 14/14 |

## π / DELTA

| Claim | Verified |
|---|---|
| **π (named hint)** | golden 4/4 unmoved — the hint is state-gated + the signature is margin text, neither in the 4 committed crops; the named-hint firing (`becauseCells` wash + margin name) captured in `sudoku-hint-named.png` (90.6 KB), `futoshiki-hint-named.png` (45.0 KB); browser e2e asserts margin contains "single" + `.is-because` visible, then +1 ink glyph |
| **DELTA (grade signature)** | `sudoku-grade-signature.png` (56.0 KB); `formatGradeSignature` unit-tested (singles→"singles only", x-wing→"needs an X-wing", unsolved→"beyond these techniques"); margin plumbing e2e-proven live |
| **DELTA (fill-forced)** | forced cells filled in one sweep, non-forced untouched — `sudokuTechnique.test.ts:112-149` + VERIFY hand-check |

## Deal-time grade latency

9×9 hard bank, pure TS, no search: E1 probe mean **0.246 ms** / worst **0.972 ms** (n=400);
VERIFY re-run < 50 ms bound holds with wide margin. No visible deal delay.

## Outstanding for the team lead

1. **`CONTRIBUTING.md` is deleted in the working tree** — tracked at HEAD (added T3-W2 `f6f28420`), unrelated to W7. NOT part of this wave; do not let it ride the W7 commit (restore or handle separately).
2. **Untracked VERIFY scratch — do NOT commit**: `web/frontend/e2e/__verify_futoshiki_hint.spec.ts`, `web/frontend/playwright.verify.config.ts` (VERIFY-lane reproduction harness; the default e2e suite swept the futoshiki spec in and it passed, but it is scratch).
3. The rebuilt `csp-solver/wasm/pkg/` is a gitignored file:-link artifact (90,249 B, local rebuild); CI's build-lean-wasm lane rebuilds it from the committed `.rs`. No pkg bytes cross the commit.
4. Team lead commits — VERIFY did not commit or push (standing constraint).
