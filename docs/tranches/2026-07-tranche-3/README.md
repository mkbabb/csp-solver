# Tranche III — Encapsulation, Library Modernity, the Gold Move

**THE TRANCHE, third campaign.** The exact wave set that prunes the Python surface to its ratified core, sweeps the crate's public surface to 0.4.0, modernizes the library spine, lands the two perf packages, restructures the frontend under the three-home rule, and executes the gold design capstone. Authored from a five-phase convergence loop — pass-1 (21 lanes) → 32-lane audit → pass-2 (12 lanes) → the owner ballot → pass-3 (6 gap-lanes + the grand reconciliation) — closing at **91%, author-ready, zero deferrals minted**. Development-only campaign: nothing here is implemented yet; the waves are the implementation order.

Authoring base: `3b75eca2` (T2-WGATE close), G6-stamped clean — **rust 151/0/6 across 18 harnesses · tests-py 27/2 · e2e 33/33 · lean wasm 90,602 B source==dist** — the citable figure set (the stale system-prompt CLAUDE.md cache of 150/17/87,853 is dead, K45). G7/G10 stamped `5f9980c8`+dirty; **T3-W0 opens with the one-command discrepancy check** (`git status && git log -1`). Predecessor: [`../2026-07-tranche-2/`](../2026-07-tranche-2/) (nine waves landed, 98.2% at `c14995eb`).

---

## 1. Provenance

### The two owner mandates (2026-07-10, verbatim-anchored)

Both issued in the tranche-2 execution session; source of record `memory/t2-execution-progress.md:14`, re-verified row-by-row by the A1 recap lane (audit32, §5).

**Mandate I — encapsulation/modularization:** py bindings SOTA (naming / structuring / library conventions research as of Jul 2026) · `sudoku_api` disposition (needed? deprecated?) · `isomorphic.rs` disposition · the colocation edict re-verified.

**Mandate II — the expanded scope:** perf / library / UI / module-structure deep audit · **NO legacy code; NO workarounds — idiomatic, gestalt; architectural transpositions for elegance/simplicity/performance desirable** · fold ALL deferred + chronic items · the 5-step convergence loop (audit → synthesis → prototypes → critiques with a convergence % → agglomerate), iterated to author-ready, then author this tranche set. Riding it: the four owner design findings (dropdown-frame border misregistration · golden completion, NO modal — stars+gold, golden board, heart in Yoshi's-Story language · dark-toggle SVG + storybook transition · game-switch choreography), all run on Fable design lanes per the standing directive.

### The loop record

| Phase | Shape | Output | Convergence |
|---|---|---|---|
| **Pass 1** | 8 research + 6 prototypes + 7 critiques (21 lanes) + synthesis + agglomeration | settled set S1–S13, kill ledger K1–K27 | **64%** (floored) |
| **Audit-32** | 32 read-only lanes (perf, library, UI, structure, design F1–F8, deferred/chronic, doc-truth, A24 completeness) + synthesis | full decision set, 13-wave skeleton, the W1 memo charter | **72%** (floored) |
| **Pass 2** | 8 prototype/verification lanes + 4 adversarial critiques | T1–T9 settled, K28–K41, **zero hard refutations**, the 4-question ballot distilled | **83%** (floored) |
| **Owner ballot** | 2026-07-10, binding — **4/4 at recommended** | Q1–Q4 answered; T3-W1 discharged | — |
| **Pass 3** | 6 gap-lanes (G3 pin, G5 morph census, G6 baseline, G7 felt-perf, G8 security, G10 design re-probe) + the reconciliation | one decision set, one DAG, one ledger; K42–K49 | **91%, author-ready** |

Full arithmetic: [appendix D](appendices/D-convergence-record.md). **Convergence semantics:** every sub-100 row is either a gate the owning wave itself runs (re-runs at merged HEAD, quiet-box measurements, the dist-preview trace) or a corpus-lean default that executes in-wave with a **named owner-veto window** at that wave's gate (§4). No design unknown and no owner unknown gates the authoring of any wave document. The loop has nothing left to investigate.

---

## 2. The ballot ledger — Q1–Q4 (owner, 2026-07-10, all at recommended)

The ballot IS T3-W1's output, delivered before authoring — the wave is retired from the DAG (§3). Chosen options quoted verbatim from the pass-2 ballot; the reconciliation (R-1) folded the consequences everywhere.

| Q | Chosen option (verbatim) | What it resolved |
|---|---|---|
| **Q1 — py wheel** | "No PyPI (abi3 CI-only, abi3t dropped); adopt the four-class rule; remove `futoshiki_api.rs`; prune `solve_sudoku_board` + `template_count`; remove `PropagationStrategy` + `propagate_with` (capability loss accepted — matches the gated/spiked surface; stub `__all__`=15 stands)." | Audit W1 rows (a)/(b)/(c)/(d); the §2.2-D2 futoshiki_api conflict (owner voted REMOVE); pass-2 RES-1 closes, RES-3 **moot** — the hand stub, `__all__`=15 (135 lines, K31) and the P2-L2 combined diff stand **as built**, no re-derivation branch executes |
| **Q2 — core 0.4.0** | "Ratify **0.4.0** = 12 demotions + 2 removals + 1 relocation; remove `propagate_stratified` (wire-in filed as a scoped backlog item with the memo as spec); **reserve** `CspError::Timeout` + `CspTimeoutError` with a `// reserved: no constructor until cancel-driver` note; pyproject + wasm stamps ride to 0.4.0 in the same wave." | The 0.4.0 signature (K28's 12+2+1 everywhere); the `propagate_stratified` fork; the L25-06/L25-59 pair — RESERVE is a permanent recorded disposition, and **W4 deletes the two skipped py tests** (unexercisable by construction, R-3): tests-py goes 27/0 |
| **Q3 — FE shared home** | "Adopt the three-home rule: NEW `src/games/shared/` for cross-game-never-pencil (`useAnswerKeyPeek`, `scene.css`, `types.ts`, `constants.ts` **and relocate** `useUndoHistory` + `usePencilMarks` there); `celebration.ts` stays pencil; `useTheme` stays `src/composables/`; `useButtonAnimation` follows the rule into `games/shared/`; include the ~10-line eslint tripwire." | crit-coherence C2 / K39 (the P2-L5-vs-L6 home contradiction); W7's file plan un-forks; the composable-home rule (audit Q7) is now the documented rule itself |
| **Q4 — index.css** | "**Drop** — HELD-again record lands; `index.css` stays monolithic; the byte-identity bundle + built font-URL guard are banked; hold re-opens on the same trigger (critique default: net-zero runtime benefit, one new silent-404 footgun class)." | The T7/Q9/R8 hold — record lands in W7; full record in [appendix C §4](appendices/C-deferred-disposition.md) |

---

## 3. Wave index + DAG

**Twelve waves: T3-W0, W2–W11, WGATE.** T3-W1 is **retired from the DAG — the OWNER BALLOT of 2026-07-10 IS its output**, delivered before authoring; the numbering keeps the gap deliberately as the record of that discharge. Full specs in [`waves/`](waves/). Effort: S ≤ half-day-equiv, M = wave-day, L = multi-day.

| Wave | Scope (one line) | Effort | Depends | Headline gate |
|---|---|---|---|---|
| **T3-W0** | Anchor: base SHA/tree re-confirm (the G6-vs-G7 stamp discrepancy); banked evidence carried (G5 census, G6 logs + `pre-t3` baselines, G7/G8/G10 harnesses) — everything else the audit filed here is DONE | S | — | base SHA stamped; evidence dir opened under the G2 policy |
| **T3-W2** | Packaging + doc truth: the §1.9 currency batch; pyproject 0.2.0→0.3.0 interim; `_headers` wasm fix (live-proven, G8-H2) | S–M | W0 | blacklist grep-zero incl. the retired triplet; wheel METADATA inspected; single Cache-Control post-redeploy (or noted pending-Pages) |
| **T3-W3** | Dead surface (0.4.0 begins): isomorphic excise + co-edits; **py maximal prune per Q1 incl. futoshiki_api REMOVE**; `py/sudoku.rs` rename + parity retarget; `propagate_stratified` REMOVE; stale examples; mechanical FE kills; `#storybook-texture` KILL (R-4); npm 0.4.0 BREAKING stanza | M | W2 | rebuild pkg/ + re-measure; `maturin build -i <tests-py venv>` wheel + tests-py green; bbnf `--update && --verify` green at merged HEAD; stub `__all__`=15 asserts the post-prune surface |
| **T3-W4** | Core structure 0.4.0: 12+2+1 sweep + adjacency relocation; `wasm/src/errors.rs`; ImplicationConstraint tests; `gac/scratch.rs` split (K33 seam); search.rs waiver text; **Timeout RESERVE note + delete the 2 skipped py tests (R-3)**; S3 trait FOLD-EVALUATE through the sync gate; version-triple → 0.4.0 together; cargo-doc option (a) | M–L | W3 | full merge bar (test `--workspace`, queens `--test`, `--features py`, clippy `-D warnings`, `wasm-pack test --node`, internal-doc invocation); bbnf gate re-run; **tests-py 27/0** |
| **T3-W5** | Library: hungarian→hand-rolled Kuhn-Munkres (G5-unblocked); abi3 CI-only + hand stub + stubtest lane + module-name tripwire (as built, Q1); bbnf py-stage vs the abi3 build (RES-4); criterion `html_reports` drop; lucide-inline + autoprefixer verify-drop + esbuild drop; knip CI lane; maturin `-i` pin (R-11a) | M | W4 (W3 sequencing) | `assignment_proptest` green on the hand impl; cp310-abi3 wheel + 3.10/11/12 import-solve; stubtest fails-loud re-shown; knip lane green |
| **T3-W6** | Engine perf: CSR adjacency + Vec-indexed warm cache + `assigned_ns` bitset; GAC A/B + futoshiki bench + `gac_ab_corpus` 0/50 + node-count CI smoke; gac_alldiff oracle; lean-band stamp; **quiet-box + node-count-oracle discipline (R-12)** | M | W4 (∥ FE chain) | `gac_timing_probe` before/after on a quiet box — minority cost narrows, node counts invariant; new CI lanes green |
| **T3-W7** | FE structure: SudokuGame extraction + peek composable + scene CSS; **three-home rule per Q3** (+ tripwire); god-composable pulls + subdir barrels (K41); classifyError rename + K1b; icons regroup; e2e sweep + the D3 throttled-void gate; L25-19 re-point onto `useBoilFrames`/`useBoilCache`; playwright/:3000 + `hmr.port` hardening (R-11b); **index.css HELD-again record (Q4)** | L | W2 (ballot pre-folded) | vue-tsc + eslint-boundaries (tripwire negative control) + chunk-shape parity + full e2e + reduced-motion AE=0 parity bound (K38) |
| **T3-W8** | FE perf: worker/wasm prewarm + preload injection; font preload; cellRects extraction + LRU (**measured target: below the P2 band from 99–103 ms @4×**); NEW marks/peek 16×16 burst row (R-7); Rolldown `advancedChunks` against the preview build; P6 dropped | M | W7 | driven cold-cache before/after vs built `dist/` (G7's `probe-felt.mjs`); size-switch + marks worst frames assert below band |
| **T3-W9** | Design — the gold move: F8 steps 1–3 as F7-amended; F2-C + the felt heart (variant family, YOSHI_COLORS wired, dark exception); F3 block + meta; UI-10 deepening; **star form: inline default, owner veto at this gate**; PRM gate `index.css:302` | L | W7, W2 (tokens) | a23-harness probes 1/2/5 green; contrast ledger re-computed; F8 grammar checklist over every touched surface |
| **T3-W10** | Design — sky + page: F5 set-and-rise (microtask wording, R-9); F4 slight pass minus M4 (K43); celestial palette rewire (primitives only); F6 page-turn + D1/D2/D3; F1 px-native outline, all hosts incl. 375 | L | W9 (tokens); G10 dependency SATISFIED | PRM variants exercised; band ledger updated (800 ms→≈1.25 s row); F1 verified at 375; page-turn ≈1.05 s traced |
| **T3-W11** | UI completeness + security: A23 UI-4/5/6/7/8/9/11/12; **UI-13 keep+hint, veto window here**; mobile digit pad build-or-scope; G8-P2 futoshiki decoder hardening + `types.ts` doc-truth (R-8) | M | W9/W10 | probe suite green; `fuzz.mjs` re-run — 100k-pairs / non-adjacent / dup cases fail closed |
| **T3-WGATE** | Record + recert: doc re-sweep; convergence appendix; evidence dir per G2; cron `efaae137` CronDelete; RES-5 memo edit; `propagate_stratified` backlog item filed; defer-closed records; G8 clean bill; owner reminders carried; mod.rs post-tranche note | S | all | blacklist grep-zero; counts re-stamped at gate SHA; tests-py reads 27/0 |

**DAG:** `W0 → W2 → W3 → W4 → {W5, W6}` · `W2 → W7 → W8` · `W7 → W9 → W10 → W11 → WGATE` · W6 ∥ the FE chain. **Binding sequencing:** T9 binds W3→W4 (the 2 removals are `-D warnings`-forced by the demotions — they ride W4's commit or land strictly before; a bare W4 cannot compile). W3 before W5 is load-bearing (stub + sweep operate on the pruned tree). The design trio order = F8's internal dependency order.

---

## 4. Non-blocking defaults register

Corpus-lean defaults, applied and executing in-wave; each carries an owner-veto window at the named gate. None gates authoring.

| # | Default | Alternative | Veto window |
|---|---|---|---|
| 1 | **F2 star form — inline star glyph** in the merged margin-note line (F2-C's own primary text: "the star demotes to punctuation … the inline star is the subtler read"); both forms kill the collision, so no correctness fork rides on the choice | corner foil sticker (the named alternative) | **W9 gate review** |
| 2 | **UI-13 — KEEP grade-after-Solve + say-it hint** (A23's own lean: the pedagogy is "defensible and on-soul"; the margin voice hints "mark it and I'll grade"); the failed-state maroon beat is protected | immediate conflict marking | **W11 gate** |
| 3 | **mod.rs → self-named-file flip — post-tranche one-commit follow-up** with `clippy.self_named_module_files` (pass-2 §5.5's own recommendation); not tranche work | fold into W4 | **WGATE note** |

---

## 5. Owner reminders (actions, not questions — none gate authoring)

- **R5 worktree purge + `java` branch delete** — standing, owner-side, open since tranche-2 (52 worktrees live, `java` + `origin/java` both present at audit; A1 §7, A2 note 1). Carried to WGATE.
- **pencil-boil `v0.7.0` tag at `106a5a2`** — sibling-repo formality (G3): the lockfile sha512 already cryptographically pins 0.7.0 and local HEAD `106a5a2` IS the release state; the missing tag is the one gap.
- **CF Pages redeploy** picks up the W2 `_headers` fix (doubled `.wasm` Cache-Control, live-proven G8-H2) when it next ships.

---

## 6. Artifact map

**[`appendices/`](appendices/):** [A — decisions + kills](appendices/A-decisions-and-kills.md) (the unified decision set, kill ledger K28–K49, the KISS rejection ledger) · [B — prompt recap](appendices/B-prompt-recap.md) (the a1/a2/a3-unified matrix, both campaigns + this session) · [C — deferred disposition](appendices/C-deferred-disposition.md) (the A13/A14 fold: 27 folds + the true chronic set, defer-closed records, the index.css HELD-again record) · [D — convergence record](appendices/D-convergence-record.md) (64 → 72/83 → 91).

**The loop corpus — copied and pruned into [`evidence/`](evidence/):** `pass1/` (research R1–R8 + 6 prototypes + 7 critiques + synthesis + agglomeration), `audit32/` (32 lanes + a24 + synthesis-path-forward), `pass2/` (8 lanes + 4 critiques + agglomeration), `pass3/` (6 lanes + the reconciliation), `owner-shots/` (the three design PNGs). 111 files, 2.2 MB — pruned to load-bearing **under the A24-G2 policy** (the 47 MB/287-file lesson): ~12.5 MB of scratchpad shot-dumps and superseded prototype builds were dropped, each with a rationale in [`evidence/PATHS.md`](evidence/PATHS.md), which also maps the original scratchpad paths to their `evidence/` twins so every wave-file seed citation survives scratchpad cleanup. The named gate harnesses are banked live: `pass3/g7-harness/probe-felt.mjs`, `pass3/fuzz.mjs`, the `g10-shots/` set, the `g6/` baseline logs.
