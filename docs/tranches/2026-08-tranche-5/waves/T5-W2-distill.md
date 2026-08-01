# T5-W2 — THE DISTILL (the component apotheosis)

**The thrice adjudication.** ALPHA (gestalt, `evidence/design/alpha-gestalt.md`) rules retire-the-registry; BETA (mechanics, `evidence/design/beta-mechanics.md`) rules make-it-true. Both derive the same body: one spec table, one shell, one solver spine, twins dead, boundary sound by construction. The agglomeration takes both truths at once: **the TABLE was the fiction; the CONTRACT was the value.** `gameRegistry` — the 2/5 parallel table, its test theater, its 315 dead prod bytes — dies. The contract is reborn as the single **`GameSpec`** type (BETA's five declared slots as the floor, reconciled with ALPHA's 8-slot census at wave open — the union spec: model · grammar/geometry · clues · furniture · solver verbs · urlCodec · poster · deal), whose SOLE consumer is **`GameShell`/`BoardHost`** — every slot live by construction, production reads 4→25. The sole table is the gallery's cards list with per-game lazy `load()` (both designs' convergence). `defineGame` moves to `shared/defineGame.ts`, severing the game→registry edge — the reproduced TDZ wall dissolves structurally (BETA), not by workaround. A sixth game lands as one spec + its residue, never a five-fold copy. ALPHA's rejected-alternative paragraph and BETA's wall-discharge notes are both part of this record.

**Divergence as data.** The dup-matrix's two axes become fields, not forks: `BoardGrammar { geometry: boxed|latin, noun, requestVoice, gradeHint }`; the codec axis (FULL vs V1-STUB) collapses because V1-STUB dies — one `persistence.ts`/urlCodec serves all five (the stubs' SHA-identical tails are the proof it always could).

## The estate moves

| # | Move | Measured basis |
|---|---|---|
| 2.1 | 5 scenes → `GameShell`; 5 boards → `BoardHost`; cells → shared `DigitCell` (sudoku↔futoshiki 2.7%); cages → `CageOverlay` | dup-matrix: Game.vue TWINs 0.8–2.5%, Board 2.0%, ≈−4,150 raw LOC; per-game files 65→22 |
| 2.2 | Solver spine: 5×(useSolver + worker + protocol) + 3 wires → one client + ONE worker + one protocol over the one wasm binary; the `?url` contract 5 sites→1 (narrows I3's blast radius) | S6; ensureInit SHA-identical ×5 |
| 2.3 | The kill list — the UNION of ALPHA's (37 files · 15 tokens · dead props) and BETA's (51 files · 22 export/prop/token rows), checked against the fences; the 10 shadcn-default tokens and 5 residue tokens die (E3); PENCIL dead keys + YOSHI dead entries die, survivors renamed atomically (CH-31 lands); filterBudget.ts placement adjudicated (e2e-only is arguably correct — decide, record) | census 213 rows; E2/E3/E4 |
| 2.4 | FAIL-EXPLICIT: `TEMPLATE_BANK ?? []` → `TIER_SOURCE` with a build-time fail on a lost dir (J1's residual); the 11 `catch{ignore}` sites → 0 via **pencil-boil 0.11's `stop()` no-throw contract** (published with W4b's rasterizePoseToBlob in one release train) + a negative control; the v0 ratchet dies; the two Safari<14 shims die against W1.11's declared floor | J1-residual, J2, J3 |
| 2.5 | Boundary 20/20 BY CONSTRUCTION — after 2.1/2.2 nothing a game needs lives in a sibling; W1.4's generated rule (landed RED) turns green here; registry.ts's false comment dies with the file | A4, E5 |
| 2.6 | index.css re-opens BY CH-19's OWN TRIGGER (the token kills touch it); the byte-identity proof re-runs per the hold's banked method; the 842-line monolith's @layer extraction decided on that evidence — the hold's criterion, not a fresh proposal | CH-19 |
| 2.7 | Rust edges (r3/rust-gestalt): `assignment.rs` 607 split (U-09, the unwaived god module); `cage.rs` test-extraction (one act resolves size + the R4 law); `search.rs` waiver comment re-derived; **futoshiki conforms** to `create_X(…)→(Csp,given)` / `solve_X(…,SolveConfig)` (wasm/py ride the change); `from_difficulty` lands on SudokuClass (5/5 symmetry); CH-29's N=5 fold lands; wasm family dedup (board_total → its declared errors.rs home; `n()` naming unified; JsError typed with `.code` 5/5); the unraisable `CspTimeoutError` wired-or-removed per the T3 RESERVE's own terms | U-09, rust-gestalt rows |
| 2.8 | Lib shadows die: `createGlyphDrawIn` → pencil-boil `createStrokeDrawIn` (verbatim twin), boilRectFrames/ellipsePoints likewise; the 20/44 unconsumed pencil-boil exports adjudicated upstream (prune in 0.11 or document) | E6 |

## Fences (binding — ALPHA's, per the loop's C4 ownership)
`GameControlPanel`, `GameScene`'s zone grammar, `GameGallery` are W4's lanes. W2 does not restyle, recompose, or re-animate them; it may only re-home imports beneath them. The design loop lands on the DISTILLED estate (W4 after W2), but its charters own those surfaces.

## Gates
Every step born-RED with its named probe (both design docs enumerate them; the wave record fixes the final table at open). The spine: **π pixel-identity at every step** — the four goldens byte-stable or within floors, md5 single-tree discipline; a11y AX floors from W3 held wherever W3 has landed first (DAG says W3 follows W2 — so W2 carries the AX-tree PRE-state as its own regression baseline instead). Coverage floor (W1.14) ≥ baseline at exit. Unit lane (W1.1), knip, doc-truth, boundary-20/20 all green at exit. Census delta re-run: the 213-row census's kill rows read 0 hits; tests 204→ the true count re-stamped wherever docs cite it.

## π / DELTA
π: the goldens, every step. DELTA: none by design — pixel identity IS the claim; any pixel that moves is a defect or goes to W4's lanes.

## DAG
After W1 (needs 1.4-RED, 1.11 floor, 1.14 instrument). W4 follows. The pencil-boil 0.11 release train (2.4 + 2.8 + W4b's rasterizePoseToBlob) is one upstream act, tagged this time (D9's cure).
