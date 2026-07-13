# Tranche IV — The Safari Cure, the Honest Grade, the New Games

**THE TRANCHE, fourth campaign.** The wave set that cures the WebKit perf collapse at its architectural root, re-founds every gate that could not fail, abrogates the PWA, excises the dead surface and the forked dual paths, trues the difficulty grade the labels lie about, builds the technique engine the app never had, deals the market's table-stakes affordances, integrates the progress border into the board frame, distills the twin game dirs down to a contract, folds that board into a Wii-Shop carousel, and ships three new games on two new engine primitives. Fifteen waves. Formed from a **five-round adversarial audit — 38 agents, ~170 adjudicated findings, 15 mechanism families — closed at a two-consecutive-near-quiet-pass stability certification.** Development-only campaign: nothing here is implemented yet; the waves are the implementation order.

Authoring base: **HEAD `65425697`** on master (verified this pass). The citable figure set at base: **rust 174 tests · tests-py 27/0 · e2e 44 `test(` cases · lean wasm 86,746 B** (source `.wasm` 188,095 B pre-lean-band, a W14 size-truth row) · Cargo/pkg **0.4.0** · pencil-boil `^0.8.1`. Predecessor: [`../2026-07-tranche-3/`](../2026-07-tranche-3/) (fourteen waves landed + two owner-audit addendums, shipped `bbeb2b87`, production deploy `c90d9e06` at sudoku.babb.dev).

---

## 1. Provenance

### The governing mandate (2026-07-12, owner, verbatim-anchored)

The tranche has a single origin: the owner live-audited the shipped tree in Safari and found it unusable, then commissioned the audit that formed this plan. Two prompts anchor it.

**The perf finding (E7, verbatim):** *"The performance in safari is god awful and nearly entirely unusable. What pencil-boil facilities might we change — without a compromise in quality and design in any way. Profile."* — the origin of [W1](waves/T4-W1-perf-bake-once.md).

**The formulation mandate (M1–M7 + M8–M10, the governing prompt):** *"Let's plan for that [the Safari bitmap-pose-cache wave], and for a further refinement"* — explicitly **NOT an implementation phase**. DEEPLY audit the original plan + waves + all changes with 32 agents; recapitulate every prior prompt and precept; verify each is addressed or carries an explicit ledger row with an owner; form the next tranche from what the audit surfaces. The standing edicts (M2) bind every wave:

> NO quick solutions or workarounds — idiomatic, gestalt; **architectural transpositions in the sake of elegance, simplicity, and performance above all are both necessary and desirable.** NO legacy code — clean breaks: no aliases, no migration shims, no dual paths, no masking fallbacks. Every chronically deferred and deferred item folds as a **DECIDED** row: build, fold, or retire with rationale; **re-booking is forbidden**; a chronic riding 2+ closes un-decided is a **DISEASE row and deciding it is a wave of its own.** Recap ALL prompts; an unaddressed ask becomes a registry row with an owning wave; silent drops are forbidden.

**The return contract (M6):** a plan folder; wave specs with acceptance gates **born RED wherever the defect is live**; **π and DELTA obligations for every visual claim**; a terminal disposition for every chronic / deferred / prompt-recap row. Inventory without the resolving tranche is incomplete.

**The named scope (M7) + the expansion (M8–M10):** excise legacy code · total re-formulation of tests (rust/js/e2e) with superfluity + overfit pruning · *"Why do we have any notion of PWA — this is to be abrogated"* · modern rust/wasm facilities · no stale deps · more idiomatic Vue + glass-ui · the `knip.json`-class superfluity hunt · ALL docs re-formulated with **zero meta-language** under MIKE-STYLE (`/Users/mkbabb/Programming/sci-report/reports/style/MIKE-STYLE.md`, the doc-register canon; the spec copy is banked at [`evidence/r2/mike-style-spec.md`](evidence/r2/mike-style-spec.md)), *"the extant readme is quite good, but can be refined"* · **game-scope expansion** (*"what other games could we provide, KISS, with this engine? Crosswords?"*) · **extant-game facilities** (better hints and *"what are our hint heuristics?"*, better partial solving, *"an overall progress bar deftly integrated into the border of the board"*, displayed quality heuristics, *"a game selection screen that transforms the extant board into a carousel of games … a la the wii shop store"*) · **distillation** (*"How can we REDUCE code lines and complexity and maintain the full suite of facilities?"*).

The full ask corpus — every prompt G1→M10 and every standing constraint — is at [`evidence/corpus/owner-prompts.md`](evidence/corpus/owner-prompts.md); §4 below gives every row its terminal disposition.

### The audit that formed this tranche

Five rounds, run to the owner's stopping rule — *"rounds until two consecutive passes surface nothing new."* Withheld the favored success narrative from most auditors; adversarial throughout against the close-class lies (green-over-broken, vacuous-green gates, declared-captures-missing, masked fallbacks, alias smuggling, re-booked chronics, per-mechanism green over gestalt broken). Reports at [`evidence/`](evidence/); the family registry at [appendix A](appendix-A-family-registry.md).

| Round | Shape | Output | Verdict |
|---|---|---|---|
| **R1** | 16 read-only lanes (perf, gate-soundness, dead-code, deps ×2, doc-drift, a11y, gestalt, consumer-truth, config, tests, pwa, plan-diff, prompt-recap, vue-glass, chronic-ledger) | 94 findings → families FAM-1…FAM-12 | OPEN |
| **R2** | 9 adversarial + deep lanes (verify-P0/P1, arch-transposition, cross-repo, generation-truth, security, plan-diff-deep, mike-style-spec, pencil-boil-audit, gaps-sweep) | 62 findings; ALL R1 P0/P1 confirmed bar two corrected; **NEW FAM-13/14** | verify + expand |
| **R3** | verify-new + expansion-crit (refute x1–x6) + quiet-pass | all NEW rows confirmed; the x1–x6 corrections BIND authoring; **NEW FAM-15** | NOT quiet |
| **R4** | verify-r3new + quiet-pass-2 | four FAM-15 rows confirmed exact; CI-DAG corrected to compute-cost; two P3 into FAM-7/13 | NEAR-quiet |
| **R5** | quiet-pass-3 | three fresh CLEAN certs; one P3 into FAM-13 | **STABLE** |

**The stability certification (the record's own honesty row).** The registry is stable **at the mechanism-family grain**, not at literal-zero findings: rounds 4 and 5 both surfaced **zero new families** (r4 folded 2×P3 into FAM-7/13; r5 folded 1×P3 into FAM-13). The residual-yield curve is disclosed, not laundered — **P2s ceased at round 3; P3 dust asymptotes at ~1–2 per pass, each into an existing family.** A literal-zero pass on a living estate would launder the stopping rule, not satisfy it. So the audit closes on the honest reading: **5 rounds, 38 agents, ~170 findings, 15 families, two-consecutive-near-quiet-pass.** WGATE cites this certification as the tranche's provenance; [appendix A](appendix-A-family-registry.md) carries the residual-yield disclosure in full.

The two R2 corrections, for the record: the root README version table has ONE stale row (pencil-boil), not three (the `CONTRIBUTING.md` dangle stands); futoshiki is not a "non-puzzle" but a **design decision** — deterministic ~75–76% keep-density with no difficulty plumbing at any layer, though the generator already deals real low-density unique puzzles. Both fold as truth rows, not bug rows.

---

## 2. Wave index + DAG

**Fifteen waves: W0 through W14, then WGATE.** Full specs in [`waves/`](waves/). Effort: S ≤ half-day-equiv, M = wave-day, L = multi-day. Every visual claim carries **π** (a golden capture + comparison recipe) and **DELTA** (a before/after pair banked in evidence); the π/DELTA machinery itself is W2's deliverable, which is why W2 runs early. Gates are **born RED wherever the defect is live today** — each wave states its failing probe and current failing value.

| Wave | Thesis (one line) | Effort | Depends | Headline gate |
|---|---|---|---|---|
| **[W0](waves/T4-W0-record-estate.md)** | Record + estate truth: dismiss the 9 phantom alerts, re-true the frozen recap, prune the estate, land three estate rulings + four ballots | S | — | 9 dependabot alerts → 0 (all point at a deleted manifest); java-STAYS recorded; ballots B1/B2 tabled |
| **[W1](waves/T4-W1-perf-bake-once.md)** | Perf recut, bake once swap forever: capture each frozen pose to a bitmap, ship it as pencil-boil 0.9.0 + a browser proof harness | L | W0 | **RED** — no browser SSIM harness exists (`grep ssim` empty; Node harness skips); WebKit idle 100%→2.7% under `filter:none`, unassertable today |
| **[W2](waves/T4-W2-tests-gates-refounded.md)** | Tests + gates re-founded: make every gate able to fail, mint the π/DELTA golden system, re-cut CI as a compute-cost DAG | L, EARLY | W0 | **RED** — iai gate `abs-instrs=3171444 delta=0.000000% gate=PASS` on a doubled hot path; visual suite compares nothing |
| **[W3](waves/T4-W3-pwa-abrogation-share-truth.md)** | PWA abrogation + share truth: the offline machinery out whole; OG meta, clipboard-truth confirmation, codec version byte in | S | W0 | **RED** — zero OG meta on a share-centric app; "copied!" fires unconditionally, decoupled from the caught clipboard write |
| **[W4](waves/T4-W4-excision.md)** | The excision: dead surface out, barrels → one deep-import grammar, prettier + knip DISEASE decided-build, worker respawn, solver-seam dedup | M | W2 | **RED** — `generateGridPaths` ships dead in every build; bare `--write` reformats the 2-space tree to global 4-space |
| **[W5](waves/T4-W5-deps-toolchain.md)** | Deps + toolchain currency: kill the one live CVE, close the TS two-major lag, pin engines, true the wasm Makefile to the ship recipe | S–M | W4 | **RED** — pencil-boil `npm audit`: postcss <8.5.10 moderate via vue 3.5.29 pin |
| **[W6](waves/T4-W6-generation-truth.md)** | Generation truth: futoshiki grows a difficulty axis, sudoku's 16×16 label-inversion dies, the bucket stops wearing a measurement costume | M | W5, W2 | **RED** — difficulty proxy flat 9×9 and INVERTS at 16×16 (Hard easier than Medium); futoshiki has no `Difficulty` type at any layer |
| **[W7](waves/T4-W7-technique-engine.md)** | The technique engine: a pure-TS engine over self-computed candidates that names the cheapest human deduction — hint says *why*, grade = hardest technique | L | W6 | **RED** — the "hint" is a single-cell reveal off the answer key; no technique heuristic exists (grades over GAC-collapsed masks would over-prune) |
| **[W8](waves/T4-W8-market-facilities.md)** | Market facilities: editable pencil marks, error-check mode, persistent candidates, peer highlight, attribution parity; the engagement stack retired | M | W7, ∥ W9 | **RED** — marks are engine-domains-only, non-editable, peek-gated; conflicts fire only after a wrong Solve; attribution sudoku-only |
| **[W9](waves/T4-W9-progress-border.md)** | The progress border + displayed quality: a second pencil pass retraces the frame arc-proportional to fill; the tally shows hardest-technique | S/M · Fable | W7, W6 | **RED** — no progress signal on the frame; FILL/DIFFICULTY/CORRECTNESS conflated (three signals must become three labels); zero steady-state raster π |
| **[W10](waves/T4-W10-idiom-glass.md)** | Vue idiom + glass tokens: easing family → CSS vars, laminate onto the one glass curve, four a11y near-misses as hard gates | M · Fable | W4, W2 | **RED** — difficulty heading 2.05–2.22:1 (below AA); 39 raw `cubic-bezier` literals vs one tokenized curve; 320px reflow +6px |
| **[W11](waves/T4-W11-game-contract-distillation.md)** | The game contract + twin distillation: `defineGame<TBoard,TCell,TClue>` + Rust `PuzzleClass`; shells extracted in risk order; ~1,600–1,900 net LOC removed | L | W4, W2, W7 | **RED** — no third game compiles against a contract that doesn't exist; ~1,700 line-identical lines (34% of 5,059) forked across the twins |
| **[W12](waves/T4-W12-carousel.md)** | The carousel (a sketchbook, not a store): the board folds into a card among cards; game #3 is a data row, consuming W11's `defineGame` | L · Fable | W11, W2, ∥ W13 | **RED** — no game registry; the dropdown is the only game-select surface; every off-center card must enrol zero boil writers (π) |
| **[W13](waves/T4-W13-new-games.md)** | The new games: two n-ary cage primitives (sum + product) clear the engine's n-ary wall; Thermo-Sudoku FIRST (zero new constraints), then Killer, KenKen | L | W11 (ballot B4) | **RED** — n-ary lambdas over 3+ vars get zero pruning (`traits.rs:73-79`); no Thermo/Killer/KenKen exists |
| **[W14](waves/T4-W14-docs-reformulation.md)** | Docs re-formulation: every product doc rewritten under MIKE-STYLE, zero meta-language, truth re-stamped, CONTRIBUTING resolved, fonts + Nintendo-mark trued | M · Fable | ← all | **RED** — meta-narration pervades product docs, CHANGELOGs, `.pyi`; README links a staged-deleted `CONTRIBUTING.md`; version tables stale |
| **[WGATE](waves/T4-WGATE-record-recert.md)** | Record + recert: the disposition ledger closes 100%, counts re-stamp at the gate SHA, the five ballots land recorded outcomes, standing traps carry forward | S | ← all | the ledger closes 100%; every DISEASE/orphan/banked/FAM/x1/ballot row has a terminal DECIDED record; certification cited |

**DAG:** `W0 → {W1, W2, W3} → W4 → W5 → {W6 → W7 → {W8, W9}} ∥ {W10} → W11 → {W12, W13} → W14 → WGATE`.

W2 runs early and is load-bearing — it mints the π/DELTA machinery and the visual-golden invariant W11's shells extract under. W1 is independent of W2 except its browser-harness gate rides W2's runner conventions: the two co-develop, W1 defining the golden-crop identity convention W2 generalizes, the seam resolved by W1 banking its DELTAs on the Safari fixture harness pending W2's runner. The `{W8, W9} ∥ {W10}` fork lets the idiom sweep run beside the game chain; W11 waits on both arms before the shells extract.

---

## 3. The ballot sheaf (owner, at ratification — recommendation first)

Five ballots put to the owner via `AskUserQuestion`, recommendation first, each with its rationale row. Recorded outcomes land at [WGATE](waves/T4-WGATE-record-recert.md).

| Ballot | Recommendation | Rationale | Alternative(s) | Home |
|---|---|---|---|---|
| **B1 — repo estate** | **prune evidence PNGs to essentials + a size policy** | FAM-15: 420 PNGs = 70 MB = 95% of the tracked tree, no LFS, a 97 MB clone. The policy governs the tranche-4 evidence dir from its first commit — this README's own `evidence/` is `.md`-only by it | git-LFS · status quo | W0 |
| **B2 — core 0.4.0** | **publish `csp-solver` 0.4.0 to crates.io at W0** | 0.4.0 was ratified as the signature at T3 and stamped in-tree (Cargo/pkg 0.4.0) but never published — crates.io still shows 0.3.0. The doc version stamps (W14) follow the registry fact, so publishing closes the orphan | hold (docs stay honest about 0.3.0-published) | W0 |
| **B3 — non-goals** | **retire dailies/streaks, statistics/leaderboards, pressure timers** | The engagement stack needs dated-puzzle infra + persistent identity our stateless `?board=` model doesn't carry, and the streak-pressure frame is the monetization idiom the calm, ad-free product defines itself against | elect some (a timer lands off-by-default, non-punitive) | W8 |
| **B4 — new-game set** | **Thermo + Killer + KenKen** | Two n-ary `revise_impl`s (cage-sum + cage-product) serve Killer + KenKen; Thermo needs zero new constraints and ships first as W11's contract proof. Crosswords are NO on two verified walls (n-ary blindness + the u128 domain ceiling) | a subset | W13 |
| **B5 — owner-taste sheaf** | **adjudicate on captures** — celebration rainbow ink; the T3-banked items (sun ray-comb per-beat cadence, wring twist −15°, Bloom crest 1.092, divider hoist 0.9752 exception) | These are taste, not correctness — engineering carries the captures, the owner rules. Each rides its own wave's gate review with a before/after pair | per-item accept/veto on the capture | B5 → each item's wave |

---

## 4. The disposition ledger — closes 100%

Every chronic, deferred, banked, partial, and prompt-recap row gets a **terminal disposition**: **build** → a named wave · **fold** → a named wave · **bank** → a named re-trigger · **retire** → a stated rationale. **Re-booking is forbidden** — no row says "later" without a name. A DECIDED row is a permanent recorded disposition; re-entry is only against its stated criterion. The closing record is at [WGATE §the disposition ledger](waves/T4-WGATE-record-recert.md).

### 4a. DISEASE rows (chronic, 2+ closes — a wave of their own to decide)

| Row | Disposition | Home |
|---|---|---|
| prettier global-shadow (FAM-7) | **BUILD** — in-repo `.prettierrc.json` pinned to the tree's actual 2-space + CI `--check`; lint script re-pointed off bare `--write`; tailwind plugin un-masked from knip | W4 |
| W8 mount idle-chunking re-entry (FAM-3) | **DECIDED — fold-or-retire with the measurement**: the raster-stack mount path re-lands its work, or the row retires with the paint-count measurement banked | W1 |
| 9 phantom dependabot alerts (FAM-12, 2 closes) | **RETIRE** — bulk-dismiss `no_longer_relevant`; every alert points at `web/api/uv.lock`, deleted at `98fe2562` (T2-W2). Record-truth, not security | W0 |

### 4b. Orphan deferrals — each a terminal DECIDED row (registry FAM-12 list)

| Orphan | Disposition | Home |
|---|---|---|
| core `0.4.0` crates.io publish | **BUILD** by ballot B2 (publish at W0) | B2 / W0 |
| `mod.rs` → self-named-file flip | **BUILD** — rides W4 with `clippy.self_named_module_files`; the T3 owner-veto window is closed | W4 |
| GPU tile residue | **SUPERSEDED-by-W1** — the N-layer bitmap variant zeroes the Chromium 8/s residue; verify at W1's gate | W1 (verify) |
| `propagate_stratified` wire-in | **RETIRE** — no consumer, no evidence of need; symbol removed T3-W3. Exception checked: W13's two cage primitives do NOT require stratified propagation → retire stands | W13 (checked) → retire |
| `keyframes.js` | **RETIRE** — house motion grammar settled: CSS vars (W10's `--ease-*`) + WAAPI (the drawer/gallery `useFlipGlide` engine); a second animation brain is the rejected covenant (`App.vue:60-67`). The T3 open question is answered by the estate | W10 → retire |
| bbnf cadence | **DECLARE** — sync-on-solver-release, scripted (`scripts/sync-csp-solver-vendor.sh --check/--update/--verify`); NEVER push bbnf-lang origin (standing) | declare |

### 4c. Prompt recap — every ask row, terminal (walking [`owner-prompts.md`](evidence/corpus/owner-prompts.md))

Silent drops are forbidden; each row is ADDRESSED (with its home) or carries an explicit disposition.

| Row | Ask | Terminal disposition |
|---|---|---|
| **G1** | grand tranche executed (releases) | ADDRESSED-historical (grand tranche closed 2026-07-06); the 0.4.0-publish residue → B2 / W0 |
| **G2** | recursive colocation, all dirs (FE+BE); pencil decoupled from games | SATISFIED-standing (T2/T3 executed); **carried as invariant** — W4's one deep-import grammar + W11's shells preserve it |
| **T2-1** | indefatigable, idiomatic/gestalt, maximal parallelism, authorized to publish/deploy | STANDING precept — subsumed into M2/M4; carried into every wave's execution discipline |
| **T2-2** | cron robustness + guardrails + cleanup | SATISFIED — all crons killed at E6; no cron armed in T4; K46 etc. carried as traps (WGATE) |
| **T2-3** | resume directive, batches of three | STANDING execution discipline — carried (3-wide batches, rate wall) |
| **T3-1** | full closure requires spawning locally | SATISFIED-standing — owner dev server at :3001 live (hard rule: never kill/occupy/mutate) |
| **T3-2** | encapsulation/modularization FE+BE; deploy workflows; update tranche | SATISFIED T3; the deploy-contract-undocumented residue (FAM-14) → **document at W0** |
| **T3-3** | `sudoku_api.rs` split or remove | SATISFIED T3-W3 (py maximal prune); live-tree excision certified clean (R2); W14 trues the README's nonexistent py files |
| **T3-4** | `isomorphic.rs` still needed? | SATISFIED T3-W3 (excised) |
| **T3-5** | py bindings SOTA / comprehensive / structured | SATISFIED T3 (abi3 CI-only, four-class rule); W14 removes the never-shipped futoshiki-binding claim from the csp-solver README |
| **T3-6** | the 5-step convergence loop | METHODOLOGY — this campaign ran the audit form of it (5 rounds to two-near-quiet) |
| **T3-7** | 32-agent deep audit, no legacy, fold all deferred, recap all prompts | THIS tranche's charter — realized as M1–M6; the audit ran 38 agents |
| **T3-8a** | dropdown border misregistration | SATISFIED T3 design lane |
| **T3-8b** | completion star "preposterous" → gold, no modal | SATISFIED T3-W9 (the gold move) |
| **T3-8c** | dark-toggle SVGs + storybook transition | SATISFIED T3-W13 (the storybook warp) |
| **T3-8d** | game-switch choreography ("keyframes.js our lib?") | ANSWERED — `keyframes.js` **RETIRE** (W10 grammar settled); the switch is the page-turn grammar W12's carousel reuses |
| **T3-8e** | heart refined toward Yoshi's Story | SATISFIED T3-W9; the Nintendo-mark **rephrase to unbranded language** → W14 (FAM-14) |
| **T3-9…11** | explicate waves; ratify defaults; the binding ballot | SATISFIED T3 (four ballots at recommended) |
| **E1** | spawn dev server; the java branch stays | STANDING (:3001 live); **java STAYS recorded** (W0, correcting the frozen recap appendix B) |
| **E2** | owner audit 2 (completion, perf, boil, toggle, artifact; the drawer feature) | SATISFIED T3-W12 |
| **E3** | owner audit 3 (idle perf, drawer, peek draw-in, boil first-principles, toggle low-res) | SATISFIED T3-W13 |
| **E4** | owner audit 4 (drawer from under the board; glass-congruent curves) | SATISFIED T3-W13 (S5 + S3′, the one glass curve) |
| **E5** | "ALL workflows" | SATISFIED — execution-scope clarification, honored |
| **E6** | fix the OOM; what remains; kill all crons | OOM **root-caused + closed** (npx-packument trap → deploy via `npm run deploy`, carried as a WGATE trap); crons killed; "what remains" = **this tranche** |
| **E7** | Safari "god awful"; profile pencil-boil | → **W1** (the tranche's origin; FAM-3 + the Safari core `evidence/safari/`) |
| **M0** | plan only, no source edits | SATISFIED — this is a plan folder; the sole write surface is `docs/tranches/2026-07-tranche-4/` |
| **M1–M6** | audit / recap / return contract | SATISFIED — the audit (§1), this ledger, the born-RED π/DELTA waves |
| **M7** | excise legacy · re-formulate tests · abrogate PWA · modern rust/wasm · idiomatic Vue+glass · knip-class superfluity · docs no-meta MIKE-STYLE · refine the readme | **W4** (legacy) · **W2** (tests) · **W3** (PWA) · **W5** (rust/wasm currency) · **W10** (Vue+glass) · **W4** (superfluity) · **W14** (docs + readme refine) |
| **M8** | game-scope expansion; crosswords? | **W13** — Thermo/Killer/KenKen (B4); **crosswords RETIRE** on two walls (n-ary blindness + u128 ceiling) |
| **M9** | hints, partial solving, progress border, displayed quality, carousel | **W7** (hints/technique engine) · **W8** (partial solve + facilities) · **W9** (progress border + displayed quality) · **W12** (carousel) |
| **M10** | reduce LOC, distill to atomic precepts | **W11** — `defineGame` contract, ~1,600–1,900 net LOC removed, full suite the unedited invariant |

### 4d. Estate closures (FAM-12/14/15, from W0)

- **The java branch STAYS** — recorded, correcting the T3 recap appendix B, which ordered the deletion the owner overruled (E1). The branch is **not** deleted.
- **44 merged orphan `worktree-*` branches** pruned (FAM-14).
- **`v0.3.0` tag cut**; the `pre-morph-excision` byte-dup resolved; pencil-boil npm `0.1.1–0.4.1` tag gaps + the app tag stall at `v0.2.0` recorded/resolved (FAM-12).
- **Repo-bloat B1 executed**; OFL font license texts shipped (W14); the Nintendo-mark reference rephrased (W14); OG/social meta added (W3); attribution parity + third-party fetch localized (W8).

### 4e. The x1 tier rows + non-goals (W8, ballot B3)

**BUILD (each a terminal W8 row):** editable user pencil marks (corner/center) · error-check mode toggle (off/on-demand/live) · persistent auto-candidates toggle · peer-unit highlight · attribution parity + localized fetch.

**RETIRE with rationale (ballot B3):** dailies/streaks/calendar · statistics/leaderboards/trophies · pressure timers. Re-entry criterion recorded: an elected timer lands off-by-default and non-punitive, never a mistake-limit.

### 4f. The banked game set (W13, named re-triggers)

Each carries the trigger that reopens it — banked, not dropped:

| Game | Re-trigger |
|---|---|
| **Skyscrapers** | a visibility `revise_impl` is wanted, or check-only proves too slow past n=6 |
| **Arrow Sudoku** | after Killer/KenKen ship — reuses `CageSum` with a variable target (a further payoff on the sum primitive) |
| **Kakuro** | the sum primitive exists; re-triggers when the black/white skeleton + run-uniqueness generation is funded |
| **Sandwich Sudoku** | a positional-sum `revise_impl` justified by demand |
| **Hidato / Numbrix** | the var-per-number model-inversion friction is accepted (dark-horse) |
| **Binairo/Takuzu · Hitori** | **RETIRE** — wrong engine (nothing is all-different; needs 2+ new primitives / non-CSP global connectivity) |

### 4g. Owner-taste items (B5, adjudicated on captures)

Celebration rainbow ink · sun ray-comb per-beat cadence · wring-down twist −15° · Bloom crest 1.092 · divider grain-hoist 0.9752 exception. Each rides its wave's gate review with a before/after capture; the owner rules, engineering carries the proof. Banked from T3-W13 with the captures already in the T3 record.

---

## 5. Standing traps carried forward

Ledgered so they aren't re-discovered from zero (full list + re-entry criteria at [WGATE](waves/T4-WGATE-record-recert.md)):

- **npx-packument-OOM** — deploy ONLY via `npm run deploy` (wrangler 4.110.0 pinned); the `npx wrangler` packument path OOMs node's heap. Root-caused and closed at T3; stays closed by the pinned recipe.
- **prettier global-shadow** — closed at W4 (in-repo config); re-forms if the repo-local config is removed. Re-entry: any bare `--write` lint.
- **K46** — `hmr.port: 3000` desyncs from `--port` overrides by construction; lane briefs name the app port explicitly.
- **cp314 / host Python 3.14** — PyO3-incompatible; the backend runs Python 3.13 via `uv`.
- **fmt-in-gates** — the format check belongs in a CI gate, never folded into a build lane that masks it.
- **NEVER push bbnf-lang origin** (standing) — its vendored csp-solver syncs local-only via the scripted `--check/--update/--verify` gate; the tag is the owner's to cut. pencil-boil pushes ARE allowed.
- **:3001 stays alive** — the owner's dev server; auditors and executors serve their own preview on a free port.

---

## 6. Artifact map

**Plan folder** — [`waves/`](waves/) (15 wave specs, each: title-thesis · Dependencies · Scope with file:line anchors · a verbatim gate table born RED · π/DELTA obligations · Seeds · Residual risks) · [`README.md`](README.md) (this file) · [`appendix-A-family-registry.md`](appendix-A-family-registry.md) (the 15 families with final verdicts).

**The audit corpus** — copied and pruned into [`evidence/`](evidence/) under ballot B1: the two registry spines, the owner/context corpus, all five rounds' lane reports (r1–r5), the six expansion lanes (x/), and the Safari perf core (safari/) — **`.md` only, 45 files / 648 KB.** The screenshots, DevTools traces, probe scripts, and wasm build artifacts stay in the scratchpad; [`evidence/PATHS.md`](evidence/PATHS.md) records the exclusion rationale (FAM-15 is the whole point — do not re-create the bloat), the scratchpad recipe locations the born-RED gates re-run live, and the resolution rule that maps every wave-file seed citation (`r3/…`, `x/…`, `safari/…`) to its `evidence/` twin.
