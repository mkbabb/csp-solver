# Tranche IV — WGATE: the terminal record

**The closing wave. The disposition ledger closes at 100%—every chronic, deferred, partial, and prompt-recap row carries a terminal disposition; the counts re-stamp at the gate SHA; the five ballots land their recorded outcomes; and the standing traps carry forward.** Nothing is designed or built here. WGATE is the ledger that makes the tranche auditable: every re-truthed number traces to a wave artifact, every seeded disposition has a terminal row, and the owner-side reminders are actions carried, not questions left open.

**Gate SHA (the tree of record):** `d70073f30c827d8acebbc1df2388900f29d880b9`—`T4-W14: docs re-formulation …`, the W14 seal on master. **CI run of record:** `29449438899` (master, `conclusion: success`, 11/11 jobs green). Measured on the working tree at that HEAD—nothing checked out. **Machine:** Apple M5 Max, macOS 26.4.1, 2026-07-15.

The tranche was authored from a five-round convergence audit and executed in fifteen waves plus two mid-tranche insertions (WM mobile recut, WU undo spine). Its arc: the WebKit perf cure (bake-once bitmap pose cache), the honest estate (phantom debt dismissed, the ledger re-trued), the tests re-founded so every vacuous green now bites, the excision and currency sweep, generation truth, the technique engine, the market facilities, the game contract distilled, and the deck grown from two games to five—Thermo, Killer, and KenKen dealt on one `defineGame` contract, crosswords retired on the record. The provenance that feeds this record is the certified audit (§8).

---

## 1. The seal chain — W0 → W14

Every wave sealed on master; the terminal tree at the gate SHA is CI-green (run `29449438899`, 11/11). Several intermediate seals landed red on transient linux-golden raster contention or the lean-band recount and were carried green within the session by an addendum—the golden re-mints **from the runner artifact of record** (never a local re-baseline), and the band recount after the deck grew to five games. That discipline is itself a standing trap (§6). Seal detail lives in each wave file's execution record.

| Wave | Scope (one line) | Seal SHA(s) | CI green at |
|---|---|---|---|
| **W0** | record + estate truth—phantom debt dies, ledger re-trues, 55 MB shed, 0.4.0 ships | `429e7983` | `29219288631` |
| **W1** | perf: bake once, swap forever—the WebKit cure at ~98 fps; pencil-boil 0.9.0 cut, the release pipeline healed | `c78cee9d` | gate (batch-pushed with W2/W3) |
| **W2** | tests + gates re-founded—every vacuous green now bites; the FE unit layer born | `0ea30223` | gate (batch-pushed) |
| **W3** | PWA out whole + the share path stops lying (OG meta, version byte, `_headers` purge) | `7393e7df` | carried green (addendum chain) |
| **W4** | the excision—one grammar, one seam, the two DISEASE rows decided-build (+ one-time prettier normalization `c1dc6f20`) | `54b1bcb5` | carried green |
| **W5** | currency—the CVE dies at pencil-boil 0.9.1, the Makefile stops lying, a supply-chain tripwire | `33066681` (+ crest-dark linux re-mint `8c6af343`) | `29229784491` |
| **W6** | generation truth—the futoshiki difficulty axis, the 16×16 inversion dies, the corpus stops lying | `d4faa412` (+ GAC-spine re-mint `602c8de9`) | `29240187169` (WM chain) |
| **WM** | mobile recut (E8)—the digit pad abrogated, the OS keyboard is the keyboard; csp-solver 0.5.0 published, production deployed | `b8acf3f7` (authored `c2dd6476`; addenda `098de1c9`, `3b587b86`) | `29240187169` |
| **W7** | the technique engine—the hint says why, the grade means something | `6cad6327` (+ keyboard-avoid probe `7e03c5dc`) | `29267934350` |
| **W9** | the progress border—the frame fills violet, the tally tells the truth | `8875d261` | `29276164982` |
| **W8** | market facilities—editable marks, the check that waits, the avatar comes home | `df013a36` | `29276164982` |
| **WU** | the undo spine (E9)—every action undoes, the game bakes before it deals | `766aa068` (authored `ae2517c2`) | `29284479290` |
| **W10** | Vue idiom + glass tokens + four a11y gates—the easing ledger stops lying | `7d51f562` | `29291214817` |
| **W11** | the game contract—five shells, one machine, game #3 becomes a data row | `38d3f223` | `29426026443` |
| **W13** | the new games—Thermo proves the contract, two primitives clear the n-ary wall, five games deal | `f8950257` | `29445645304` (lean-band addendum) |
| **W12** | the carousel—the board folds into a card among cards, the desk holds five | `3781ec14` (+ lean-band addendum `1056cb18`, sun-crest clause `826f16e3`) | `29445645304` → `29446086277` |
| **W14** | docs re-formulation—every number restamped at HEAD, the meta-leak dies, MIKE-STYLE binds | `d70073f3` | **`29449438899` (11/11, the gate)** |

Two handoff commits sit between W10 and W11—the pause synthesis `ba98c2bf` (run `29296669476`) and the W11-returned postscript `b9cbb92b` (run `29299551269`)—the in-repo twin of the halt order (`HANDOFF-2026-07-13.md`). W11 completed 8/8, verified RED on one gate (the net-LOC floor) at the pause, and sealed whole after the fifth `use<Game>` extraction row and the floor re-derivation at `38d3f223`.

---

## 2. Counts re-stamped at the gate SHA

Lane **G2** re-measured every headline figure by its own runs on the working tree at the gate SHA, in the T2-WGATE-repro `command → output → figure` grammar. The full evidence, reproducible row by row, is **`evidence/wgate/g2-counts.md`**; its cross-check table is embedded here by reference. Headline summary:

| Figure | Gate value | Verdict vs the W14 census |
|---|---|---|
| rust triple (`cargo test --workspace`, 28 groups) | **208 passed / 0 failed / 0 ignored** | MATCH |
| fmt / clippy | `cargo fmt --check` exit 0 · `clippy … -D warnings` exit 0 | MATCH |
| tests-py (CI recipe: maturin → uv → pytest) | **27 passed / 0 skipped**; stubtest clean | MATCH |
| frontend unit (`npx vitest run`) | **307 tests / 29 files** | MATCH |
| e2e | **83 static `test(` / 13 files**; **82 executed** (77 + 4 + 1), all pass | files MATCH; static/executed split flagged (F-1) |
| lean wasm | **121,855 B darwin / 124,091 B runner** (fail >127,500; 3,409 B headroom) | MATCH |
| full-module wasm (runner) | 227,385 B (inside 240 KB fail / 230 KB warn) | green; the ci.yml 222,436 B comment is stale (banked, §5) |
| embedded bank | **45 files / 32,095 B** | MATCH |
| goldens | **4 pairs / 8 PNGs** (4 darwin + 4 linux) | MATCH |
| CI shape | **11 jobs, all `success`** | MATCH |
| versions | crate/wasm/pkg **0.5.0** · pyproject/wheel **0.4.0** · pencil-boil **^0.9.2** | py-0.4.0 lag flagged (F-2) |

Nine of eleven rows reproduce byte-/count-exact against the W14 census. **The invariant is the green unedited suite, not the integer**—the mechanics carried across every distillation row (W11's facility-preservation rule: the goldens and the rust+e2e batteries pass unedited), and only the stamp refreshes. The WGATE spec's authoring-time figures (rust 174, e2e 44, lean 86,746 B) are the base at HEAD `65425697`; they are **superseded** by G2's gate-SHA re-measure above—the tranche grew the rust suite (five games, the cage primitives, the parity tests), the e2e set (gallery, guard, permalink), and the wasm (the five-family surface).

Two G2 flags land here as terminal version-truth rows, not defects:

- **F-1 — e2e static 83 vs executed 82.** No `test.skip` exists in the tree (verified); the one-count gap is a Playwright default-config `project`/`testMatch` filter dropping one static case from the default run (static-in-default 78, executed-in-default 77). **DECIDED:** the census reads **83 static / 82 executed**, both cited; the executed 82 is the run-of-record figure. The suite is green unedited—only the integer moved.
- **F-2 — Python wheel/pyproject 0.4.0 lags the crate 0.5.0.** `csp-solver/pyproject.toml:7` pins `0.4.0`; the crate is `0.5.0`. The wheel ships `csp_solver-0.4.0-*` compiling `csp-solver v0.5.0`. Not a test defect (27/0 green; the wheel has no `__version__`). **DECIDED:** recorded as a registry-honest lag alongside the npm wasm 0.2.0-vs-source-0.5.0 split; the 0.5.0 pyproject bump is banked with the crates.io 0.6.0 publish (§5).

---

## 3. The disposition ledger — closes 100%

Every DISEASE row, orphan, estate closure, banked item, FAM family, x1 tier row, and ballot has a terminal disposition. **Re-booking is forbidden**—a DECIDED row is a permanent recorded disposition; re-entry is against its stated criterion, never a fresh proposal.

### 3.1 DISEASE rows (chronic, 2+ closes)

| Row | Disposition | Closed at (file · section) |
|---|---|---|
| prettier global-shadow (FAM-7 / D2) | **DECIDED-build**—`web/frontend/.prettierrc.json` pinned to the tree's actual 2-space (`printWidth 88`, `tabWidth 2`) with the tailwind plugin live; `lint` re-pointed off bare `--write` to `--check` + CI-gated; plugin dropped from `knip.json` ignore | `T4-W4-excision.md` §Prettier DISEASE |
| W8 mount idle-chunking (D7) | **DECIDED-retire-with-measurement**—the raster-stack bake IS async off the mount burst; the fallback grid geometry keeps cold mount at 89 ms@1× / 355 ms@4×, banked as the do-not-reopen-without-mid-device-trace rationale. No third close | `T4-W1-perf-bake-once.md` §W8-idle-chunking + execution record (w8-chunk row) |

### 3.2 Orphan deferrals — each a terminal DECIDED row

| Orphan | Disposition + rationale | Closed at (file · section) |
|---|---|---|
| core 0.4.0 crates.io publish | **DECIDED** by ballot B2—**0.4.0 published at W0** (147 files, dry-run clean, `max_version` verified 0.4.0). Doc version stamps follow the registry fact (W14 registry-honesty rule) | `T4-W0-record-estate.md` execution record (publish row) |
| `mod.rs` → self-named-file flip (D6) | **DECIDED-build**—10 `mod.rs` flipped to self-named files + `mod_module_files = "deny"` locks it (workspace-root `Cargo.toml:61`; W4 corrected the spec's inverted id—`self_named_module_files` REQUIRES mod.rs); the T3 owner-veto window closed unexercised, so it landed and stopped re-booking | `T4-W4-excision.md` §mod.rs flip |
| GPU tile residue (D4) | **DECIDED—superseded by W1**—the N-layer bitmap bake zeroes the Chromium residue (measured 0.08/s, verified superseded) | `T4-W1-perf-bake-once.md` execution record (w8-chunk / D4 row) |
| `propagate_stratified` wire-in | **DECIDED-retire**—the seed asked the lane to fold it into W13 if the cage primitives wanted it; they don't. `CageSum`/`CageProduct` are `revise_impl`s in the `AllDifferent`/`NotEqual` mold (bounds-propagation), not a stratified scheme; the symbol is grep-empty in `csp-solver/` at the base SHA. No consumer, not present, no need | `T4-W13-new-games.md` §ROW 8 |
| `keyframes.js` | **DECIDED-retire**—the house motion grammar is settled (CSS-var easing + WAAPI); the six doubled keyframes folded to one file each at W11 (`sharePop`, `eraserScrub`, `note-slide-in`, `note-fade-in`, `marks-fade-in`, `ghost-draw-on`). Re-adopting a second animation brain is the rejected covenant fix | `T4-W11-game-contract-distillation.md` §shells (doubled-keyframes gate) |
| bbnf cadence | **DECLARED**—sync-on-solver-release, scripted (`scripts/sync-csp-solver-vendor.sh --check/--update/--verify`, the enforced-compile gate). NEVER push bbnf-lang origin (standing). A declaration, not a change | standing |

### 3.3 Estate-truth closures (FAM-12/14/15, W0)

| Closure | Terminal disposition |
|---|---|
| 9 phantom dependabot alerts | **DISMISSED**—#50–58 bulk-dismissed (`not_used`; the REST API rejects `no_longer_relevant` with 422) with the spec comment verbatim; the manifest `web/api/uv.lock` was deleted at `98fe2562` (T2-W2). Dashboard true actionable count → 0 |
| the java branch | **STAYS**—recorded, correcting the T3 recap appendix B which ordered the deletion the owner overruled (E1, 2026-07-11). `java` + `origin/java` are never deleted; the three delete-orders were struck, the java-stays reversal registered in appendix B §5 |
| 44 worktree-* branches | **PRUNED**—44 merged orphans deleted; `worktree-wf_34cf008e` KEPT (unlanded mimalloc/profile-split attack work, ledgered); on-disk worktree count already 1 |
| `v0.3.0` tag + the pre-morph byte-dup | **RESOLVED**—annotated `v0.3.0` → `3b75eca2` pushed (`csp-solver/src` byte-identical to pre-publish HEAD); `pre-morph-excision` resolved truthful (direct parent of the excision `d9781e29`) |
| repo bloat (97 MB clone / 420 PNGs / no LFS) | **EXECUTED** by ballot B1—prune-to-essentials + size policy; the estate shed 55 MB at W0; the evidence dir opens pruned under the G2 size policy |

### 3.4 The x1 tier rows + non-goals (W8, ballot B3)

| Item | Disposition | Closed at |
|---|---|---|
| editable pencil marks (corner/center) · error-check mode (off/on-demand/live) · persistent auto-candidates · peer-unit highlight · attribution parity | **DELIVERED**—all game-agnostic in `games/shared/`, both games, riding the pure `findConflicts`/`propagateBoard` derivations; error-check defaults on-demand, never a mistake-counter | `T4-W8-market-facilities.md` ROWs 1–5 |
| dailies / streaks / calendar | **DECIDED-retire**—needs dated-puzzle infra + persistent identity; the streak-pressure frame is the engagement stack the product defines itself against. Re-entry: an owner election at B3 | `T4-W8-market-facilities.md` ROW 6 |
| statistics / leaderboards / trophies | **DECIDED-retire**—competitive/monetization-adjacent; clashes with the calm, stateless `?board=` product | `T4-W8-market-facilities.md` ROW 6 |
| pressure timers | **DECIDED-retire**—a countdown clashes with the pencil idiom; if elected, off-by-default and non-punitive, never a mistake-limit | `T4-W8-market-facilities.md` ROW 6 |

### 3.5 The 15 finding-families (FAM-1 … FAM-15)

Each family closes at its answering wave; all fifteen are sealed. FAM-12 (record/ledger truth) is the one that terminally closes **here**, at WGATE. Full mechanism table: `appendix-A-family-registry.md`.

| # | Family (mechanism) | Answering wave(s) | Status |
|---|---|---|---|
| FAM-1 | gate-cannot-fail (vacuous greens) | W2 (machinery + the two tautologies) · W1 (browser proof harness) | CLOSED |
| FAM-2 | test-overfit / superfluity / gaps | W2 (overfit prune + FE unit base) | CLOSED |
| FAM-3 | beat-driven filter re-raster | W1 (bake-once N-layer bitmap cache) | CLOSED |
| FAM-4 | dep-currency / toolchain lag | W5 (the CVE dies at pencil-boil 0.9.1) | CLOSED |
| FAM-5 | legacy / dead-code / dual-path | W4 (excision + seam dedup) · W1 (forked primitives reunified, one stride) | CLOSED |
| FAM-6 | PWA abrogation | W3 (clean break, full excision) | CLOSED |
| FAM-7 | config-truth (prettier DISEASE) | W4 (DECIDED-build, §3.1) | CLOSED |
| FAM-8 | doc-truth / meta-leak / style | W14 (MIKE-STYLE re-formulation, zero meta) | CLOSED |
| FAM-9 | gestalt / generation truth | W6 (generation truth) · W9 (displayed quality) | CLOSED |
| FAM-10 | a11y | W10 (four hard gates born RED) | CLOSED |
| FAM-11 | vue-idiom / glass | W10 (CSS-var easing family) | CLOSED |
| FAM-12 | record / ledger truth | W0 (re-true) → **WGATE (close)** | CLOSED-here |
| FAM-13 | robustness / share-truth | W3 (share truth + version byte) · W4 (worker respawn) | CLOSED |
| FAM-14 | estate / provenance | W0 (branches/tags) · W3 (OG meta) · W8 (attribution) · W14 (fonts, Nintendo rephrase) | CLOSED |
| FAM-15 | estate — bloat + untested claims | W0 (bloat, B1) · W1 (browser matrix) · W2 (CI compute-cost DAG) · W14 (en-only + matrix declared) | CLOSED |

---

## 4. Ballot outcomes — B1 … B5

| Ballot | Recommendation | Recorded outcome |
|---|---|---|
| **B1** repo estate | prune-to-essentials + size policy | **EXECUTED at W0**—55 MB shed; the size policy governs the tranche-4 evidence dir from the start |
| **B2** core 0.4.0 | publish to crates.io at W0 | **PUBLISHED**—0.4.0 at W0 **and** 0.5.0 at WM (the five-family surface postdates it). The version-stamps-follow-registry rule held through W14 |
| **B3** non-goals | retire dailies/streaks/leaderboards/pressure-timers | **RETIRED** with rationale (§3.4); each carries an owner-election re-entry |
| **B4** new-game set | Thermo + Killer + KenKen | **RATIFIED and shipped at W13**; crosswords DECIDED-retire on the two verified walls (construction is CSP-solvable but clue authoring is not a CSP—a bundled corpus or an online LLM breaks the offline-wasm/KISS model); skyscrapers/arrow/kakuro/sandwich/hidato BANKED with named re-triggers (§5) |
| **B5** owner-taste sheaf | celebration rainbow ink + the T3/W13-banked items | **RATIFIED 2026-07-15**—the owner's word ("Ratify") at the tranche close; every row below ships its tree default as the ratified state |

**The B5 sheaf — RATIFIED 2026-07-15 as shipped.** The owner ratified the sheaf in full at the tranche close; each row's tree default below is the ratified state, re-entry only by a fresh owner word. Rows 1–10 from `HANDOFF-2026-07-13.md §3`; rows 11–15 from the W12 execution record (`T4-W12-carousel.md`); the celebration rainbow ink and the W13 owner-taste checkpoints ride the sheaf.

| # | Item | Wave | Default in the tree |
|---|---|---|---|
| 1 | progress-ink violet (`--color-progress-ink` #8b5cf6/#7c3aed) vs graphite fallback | W9 | violet (contrast-proven 8/8 ≥3:1) |
| 2 | hint ink enters history (undo strips solver tone + re-arms the flourish) | WU | on-log |
| 3 | the verb "Deal" vs the owner's "bake" | WU | "Deal" |
| 4 | Confirm is coarse-only (desktop keeps instant + Cmd/Z) | WU | coarse-only |
| 5 | consecutive coarse deals re-arm (`isDirty = undoDepth > 0`) | WU | re-arm accepted |
| 6 | a Fill dirties the board (the sweep is on-log) | WU batch | ships |
| 7 | target-size geometric cap (16×16 sub-AA-24 below ~408 px) | W10 | ratified by team lead; standing acceptance is the owner's |
| 8 | Chromium DPR-cap question (WebKit-gated cap) | WM | WebKit-only |
| 9 | P2 ran on Opus (Fable-lane policy exception, self-reported) | W9 | noted |
| 10 | informational: one-time theme reset at the storage-key rename; session-only undo history | W10 / WU | named in records |
| 11 | carousel card-step 440 ms (auditioned 380/440/520) | W12 | 440 ms |
| 12 | the mid-game guard—a light pencil-note ribbon on dirty+different (never-ask is the KISS fallback, one gate to flip; no modal) | W12 | light ribbon default |
| 13 | the snap chime—visual-only (one 600 ms wobble bloom + scribbleUnderline, no audio) | W12 | visual-only |
| 14 | wordmark opens the gallery + dropdown retirement | W12 | default yes |
| 15 | the carousel PRM degradation—a PRM deck shows the static poster grid, not the live projection (RATIFIED at seal, required by the zero-animation invariant) | W12 | ratified |
| — | celebration rainbow ink | W9/design | ships (owner-taste ballot) |
| — | W13 owner-taste checkpoints: Bloom crest 1.092 · wring-down twist −15° · sun ray-comb 125 ms re-jitter · the forked-primitive one-stride sub-visual shift · the divider grain-hoist SSIM-0.9752 exception | W13 / W1 | banked for overrule |

---

## 5. New banked rows born this tranche

Each carries its re-entry trigger; none is a deferral of tranche-4 work—they are the honestly-named next surfaces the tranche's own closures surface.

| Banked row | Re-entry trigger |
|---|---|
| wasm wire-dedup | a sixth game, or any solver wire >12k |
| crates.io 0.6.0 bump + publish (incl. the pyproject 0.5.0 parity, F-2) | the five-family surface postdates the published 0.5.0—publish when the owner elects |
| `YOSHI_COLORS` source-symbol rename | rename the const + its 4 imports + 3 comments together (one atomic change) |
| full-module wasm re-measure | the ci.yml 222,436 B band comment is T2-stale (runner now 227,385 B); the CI bounds hold—refresh the comment on the next size-touching wave |
| `?board=` permalinks for thermo/killer/kenken | the v1 localStorage / permalink extension to the three new games |
| W8 mount idle-chunking (D7 residual) | a mid-device above-band trace (89 ms@1× / 355 ms@4× is the recorded do-not-reopen floor) |
| `docs/sudoku.md` deep sections for the three new games | the games ship; the deep-doc sections are the follow-on |

---

## 6. Standing traps carried

Recorded so they aren't re-discovered from zero. The T3 traps carry; the tranche minted its own.

**Carried from prior tranches:**
- **npx-packument-OOM**—deploy ONLY via `npm run deploy` (wrangler 4.110.0 pinned); the `npx` packument re-resolution OOMs node's heap.
- **prettier global-shadow**—closed at W4 (in-repo config); the shadow re-forms if the repo-local config is removed. Re-entry: any bare `--write` lint.
- **K46**—`hmr.port: 3000` desyncs from `--port` overrides by construction; name the app port explicitly (or check `lsof`).
- **cp314 / host Python 3.14**—PyO3-incompatible; the backend runs Python 3.13 via `uv`.
- **fmt-in-gates**—the formatting check belongs in a CI gate, not folded into a build lane that masks it.
- **NEVER push bbnf-lang origin** (standing)—its vendored csp-solver syncs via the scripted `--check/--update/--verify` gate; the tag is the owner's to cut.

**Minted this tranche:**
- **golden-vs-dist-only**—goldens run against the built `dist`, never a live `:3000` webServer; the foreign `:3000` and the owner's `:3001` stay untouched.
- **linux-golden mint-from-runner-artifact**—a shifted linux golden is re-minted from the CI runner artifact of record, never re-baselined locally; several W5/W6/WM/W12 seals red-then-green on exactly this.
- **the sun-crest clause**—linux coarse floors on the logo and toggle-crest goldens sit at 0.05, darwin's soul tolerance at 0.017; the mint-from-runner canon governs.
- **cwd-drift**—compound Bash inherits a drifted working directory; every compound command opens with an absolute `cd`.
- **npm-10-lockfile**—npm 10 mis-resolves the lockfile; npm ≥11 required.
- **prettier-scope-src-only**—`prettier --check src/` only; `e2e/` is hand-matched, never swept by `--write`.

---

## 7. Owner reminders — actions carried, none blocks the close

- **Production deploy — EXECUTED 2026-07-15 on the owner's approval.** `npm run deploy` at `aa77860e` (wrangler 4.110.0, deployment `0275562b`): `sudoku.babb.dev` now serves `index-Cp_nO-EV.js` — the tranche-close build, five games live (edge-verified: the Thermo/Killer/KenKen lazy chunks 200 from production). Supersedes the WM-era `index-CsU8SN8M.js`.
- **E8 device smoke.** The owner device smoke, now against the deployed tranche-close build.
- **The B5 sheaf — RATIFIED 2026-07-15** (§4); every row ships its tree default as the ratified state.
- **The crates.io 0.6.0 publish decision** (§5)—the five-family surface postdates the published 0.5.0; the owner elects when to bump and publish (carries the pyproject 0.5.0 parity).
- **The API reference box.** The FastAPI Option-A reference is the owner's EC2 box (`ssh -p 1022 mbabb@34.197.214.67`, `/var/www/csp-solver`), owner self-deploys; solving is in-browser by default (the file:-linked lean wasm in a per-game Worker). No tranche action.

---

## 8. Certification + provenance

The tranche is fed by a certified convergence audit. **5 rounds, 38 agents, ~170 adjudicated findings, 15 stable families.** The residual-yield stopping rule is disclosed, not laundered: **P2s ceased at round 3; P3 dust asymptotes at ~1–2 per pass, each folding into an existing family.** Rounds 4 and 5 both surfaced zero new families (r4 folded 2×P3 into FAM-7/13; r5 folded 1×P3 into FAM-13). A literal-zero pass on a living estate would launder the stopping rule, not satisfy it—so the honest record is "near-quiet at the mechanism-family grain," not a claim of zero findings. The full per-round trace: `evidence/registry/families.md`; the distilled family table: `appendix-A-family-registry.md`.

The counts re-stamped in §2 corroborate the gate: the whole tree at `d70073f3` builds and passes green (run `29449438899`, 11 jobs), the meta-leak enforcement grep reads zero across every shipped product doc, `.pyi`, and both CHANGELOGs (W14), the version table matches source and registry, and the CONTRIBUTING dangle is resolved by inlining the two-line flow (no link to a staged-deleted file). The disposition ledger closes at 100%—every chronic, deferred, partial, and prompt-recap row carries a terminal disposition, each with its re-entry criterion. The tranche is auditable. It closes.
