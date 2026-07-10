# A4 — Precepts Conformance

Repo: `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion`
Canon: `docs/precepts/` (vendored, read-only submodule). Read-only lane; nothing ships.
Date: 2026-07-10. Every claim cites file:line or a quoted command.

## 1. Canon inventory

The precepts submodule carries five doctrine strata plus an audit archive. What A4 audits the tree against is the process/structure/register canon; the motion/design canon is design-lane turf and is inventoried only.

| Stratum | Files | A4 scope |
|---|---|---|
| Core index | `README.md` (`docs/precepts/README.md:1`), `glossary/meta-terms.md` | yes (core rules, layout) |
| README shape | `canonical-readme-shape.md` | **yes — primary** |
| Operational | `instructions/README.md` (edicts + Code Discipline), `instructions/ORCHESTRATION.md`, `instructions/CONSUMING.md`, `instructions/LESSONS-LEARNED.md`, `instructions/gestalt-first-capture.md` | yes (colocation, testing, evidence) |
| Register | `instructions/STYLE.md`, `instructions/style/CALIBRATION.md` | **yes — primary** |
| Tranche/wave | `instructions/TRANCHE-AND-WAVE-SPEC.md`, `instructions/tranche/{SPEC,START,RESEARCH,CHALLENGE,DOC_UPDATE_WAVE,WAVE_SPEC,AGENT_DISPATCH_TEMPLATE,README}.md`, `instructions/prompts/*` | measurement/evidence gate only |
| Cross-repo | `cross-repo-dev-iteration.md`, `cross-repo-dev-resolution.md` | no (bbnf vendor lane) |
| Motion/design | `motion-canon.md`, `tunable-anim.md`, `design-idioms.md`, `affordance-map.md` | design-lane turf; not audited here |
| Infra | `infra/{deploy,domains,tls,blob-backend-dr}.md` | no (server abrogated) |
| Audit archive | `audits/overfitting-audit.md`, `audits/REAUDIT-2026-04-30/**` | reference only |

The five doctrines A4 was tasked with: **README shape** (`canonical-readme-shape.md`), **colocation doctrine** (`instructions/README.md:96-130` Code Discipline), **testing doctrine** (`instructions/README.md:126-130`), **measurement rules** (`instructions/README.md:13-14` + `:172-184` Gates; `STYLE.md:98-102` no-editorializing/evidence), **register** (`STYLE.md`).

## 2. Conformance rows

| # | Doctrine | Locus in canon | Tree locus | Verdict | Evidence |
|---|---|---|---|---|---|
| C1 | Canonical five — root | `canonical-readme-shape.md:83` (csc411 divergence, as amended by W7) | `README.md` | **PARTIAL** | Headings are Directory structure / Architecture / … / License (`README.md` §grep). No `## Install` (the W7-amended row prescribes an install matrix); no `## Contributing`. License present (`README.md:131`). |
| C2 | Canonical five — csp-solver | `canonical-readme-shape.md:7-33` | `csp-solver/README.md` | **PARTIAL** | Install `:27`, Usage `:40`, Documentation `:242`, License `:248` all present; **no `## Contributing`** section (grep `CONTRIBUTING` over the file: 0 hits). |
| C3 | Canonical five — wasm | `canonical-readme-shape.md:7-33`, `:67-69` (License mandatory) | `csp-solver/wasm/README.md` | **DIVERGENT** | Sections are Surface `:6` / Build `:27` / Consume `:53` / Layout `:93`. No Install, Usage, Documentation, **Contributing, or License**. A published npm package (`@mkbabb/csp-solver-wasm`) whose README omits the License section entirely. |
| C4 | Canonical five — frontend app | `canonical-readme-shape.md:77` (muster app precedent — `## Setup` replaces Install, other four remain) | `web/frontend/README.md` | **PARTIAL** | Setup `:15` (correct for an app), License `:148` present; no `## Contributing`, no Usage/Documentation equivalent. |
| C5 | Substantive internal READMEs | `canonical-readme-shape.md:71-73` (below-the-five body) | `web/frontend/src/games/{sudoku,futoshiki}/README.md` | **CONFORM** | Not published packages → canonical five N/A. Both carry WHAT+WHY explication, good register, correct wire-name discipline (`size` vs `board_size`), ESLint-boundary notes (`sudoku/README.md`, `futoshiki/README.md` full text). |
| C6 | LICENSE file per package | `canonical-readme-shape.md:67-69` + G.W5 release baseline | root, csp-solver, wasm | **PARTIAL** | `LICENSE` at root and `csp-solver/LICENSE` present; **`csp-solver/wasm/` has no LICENSE file** and `package.json` carries no `license` field (`grep -i license csp-solver/wasm/package.json` → 0 hits). |
| C7 | CONTRIBUTING.md exists + linked | `canonical-readme-shape.md:63-65` ("See [CONTRIBUTING.md]"); G.W5 baseline = LICENSE+CHANGELOG+CONTRIBUTING | repo-wide | **DIVERGENT** | `git ls-files \| grep -i contributing` → 0 hits. The only CONTRIBUTING.md in the tree is `target/package/csp-solver-0.2.0/CONTRIBUTING.md` — a stale build artifact inside the packaged 0.2.0 crate, not source. No README references it (grep across all four package READMEs: 0 hits). The 0.2.0 package shipped one; the current source has lost it. |
| C8 | Splits use directory modules | `instructions/README.md:110-113` | `csp-solver/src/` | **CONFORM** | `constraint/`, `domain/`, `solver/`, `puzzles/{sudoku,futoshiki}/`, `py/`, `builder/` are directory modules with `mod.rs` + children (CLAUDE.md structure §; tree confirmed). No flat `*_leaf.rs` siblings. |
| C9 | No god modules | `instructions/README.md:105-108` | whole tree | **CONFORM** | `find` for `utils.rs`/`helpers.rs`/`common.rs`/`utils.ts`/`helpers.ts` → 0 hits (non-vendored, non-target). |
| C10 | Tests live outside `src/` | `instructions/README.md:126-130` | csp-solver, wasm, frontend | **CONFORM** | Rust: `csp-solver/tests/` (14 files) + `csp-solver/wasm/tests/` (2). **Zero inline `#[cfg(test)]`** in `csp-solver/src` (`grep -rl` → empty). Python wheel-contract in `csp-solver/tests-py/`. Frontend e2e in `web/frontend/e2e/` (5 `.spec.ts`); **zero colocated `*.test.ts`/`*.spec.ts` under `src/`**. Cargo's crate-adjacent `tests/` satisfies the "framework discovery" caveat. |
| C11 | Typed-key + helper-pair DI | `instructions/README.md:114-124` | `web/frontend/src` | **N/A (no violation)** | No `InjectionKey` usage and no raw `inject(stringKey)` calls (`grep -rn inject` → 0). The app uses no provide/inject substrate (README: "no router, no state library" `web/frontend/README.md:72` §). Precept has no target here. |
| C12 | Measurement — stamped counts | `instructions/README.md:13-14`, `:172-184`; `STYLE.md:98-102` | `README.md` | **PARTIAL** | Test counts stamped date+machine: "All counts measured 2026-07-10, Apple M5 Max, this tree" (`README.md:76`); bundle sizes stamped (`README.md:97`). But "this tree" is weaker than the canon exemplar's commit-SHA stamp (`d9781e29`); no SHA pins the counts. |
| C13 | Measurement — evidence gate | `instructions/README.md:13-14` (gates close on a benchmark artefact), `:65-68` | `README.md:113`, `README.md` §Performance | **DIVERGENT (self-disclosed)** | The 13.36× GAC headline "rest[s] on a deleted scratch harness" — no reproducible artefact backs it; the committed `gac_ab_corpus` example only counts false-UNSATs (0/50), and "a first-party timing probe rides the W-GATE recertification" (`README.md:113`). The headline number therefore fails the reproducible-artefact gate until recert. Honestly flagged in-tree, but still a live divergence. |
| C14 | Currency — published versions | `instructions/README.md:132-136` (docs update with the change) | `README.md:107`, `csp-solver/Cargo.toml:3` | **DIVERGENT** | `csp-solver/Cargo.toml:3` = `0.3.0`; tranche context says 0.3.0 is live on crates.io. README table still reads "0.2.0 published; 0.3.0 staged in-tree—publication rides the W-GATE" (`README.md:107`). Version skew: crate `0.3.0` vs `csp-solver/wasm/Cargo.toml:3` = `0.2.0`. |
| C15 | Register — banned words | `STYLE.md:76-80` | all four package READMEs | **CONFORM** | Grep for the full ban list → one hit, "Ctrl+Home/End navigate" (`web/frontend/README.md:132`), a false positive (mechanical keyboard navigation, allowed). No delve/tapestry/robust/leverage/showcase/etc. |
| C16 | Register — em-dash discipline | `STYLE.md:82-86` (">1 per paragraph is over-punctuated") | `README.md` §Performance/§Deployment/§Architecture | **PARTIAL** | Per-paragraph density exceeds the ceiling. §Performance carries three em-dashes in one paragraph — "cost—3 of 5 …", "harness—the committed …", "claimed—the pre-tranche …" (`README.md:113`). §Architecture and §Deployment paragraphs each carry ≥2. Whole-file counts: root 28, csp-solver 49, wasm 11, frontend 24. |
| C17 | Register — no epanorthosis | `STYLE.md:87-91` (drop "X, not Y" false-contrast) | `README.md:101` | **MINOR DIVERGENT** | "the server-side solve hazard class is retired structurally, not mitigated" (`README.md:101`) is the "Y, not X" scaffold the precept bans. Assert the structural retirement directly. (Row 108's "not the registry package" is a factual qualifier, not epanorthosis — allowed.) |
| C18 | W7 upstream flag recorded | `T2-W7-precepts-upstream-flag.md` | `docs/tranches/2026-07-tranche-2/evidence/execution/` | **CONFORM (flag)** | The flag correctly records the vendored csc411 row (`canonical-readme-shape.md:83`) as stale on two counts (4→2 artifacts; single-root→per-package). Verified: line 83 still reads "four publishable artifacts (csp-solver crate + morph-core crate + @mkbabb/csp-solver-wasm + @mkbabb/morph)" — **still stale**, pending upstream sync. The landed tree matches the flag's proposed replacement (root + per-package READMEs, two artifacts). |

## 3. Divergences needing tree fixes (tranche-III authoring)

1. **C7 — restore CONTRIBUTING.md + wire it.** The G.W5 release baseline (LICENSE+CHANGELOG+CONTRIBUTING) lost its CONTRIBUTING; only a stale copy survives in `target/package/csp-solver-0.2.0/`. Add a source `CONTRIBUTING.md` (repo root, or per publishable package) and add the one-line `## Contributing` section (`See [CONTRIBUTING.md](./CONTRIBUTING.md).`) to each package README (C2, C4 gaps). Highest-priority: this is a release-readiness regression on a live-published crate.
2. **C3/C6 — wasm package hygiene.** `csp-solver/wasm/README.md` needs a `## License` section; `csp-solver/wasm/` needs a `LICENSE` file and a `license` field in `package.json`. A published npm package (`@mkbabb/csp-solver-wasm`) currently ships no license declaration in its README or manifest.
3. **C1 — root install matrix.** The W7-amended csc411 shape prescribes "root overview + install matrix". The root README has no `## Install` section; add the two-artifact install matrix (crates.io `csp-solver`, npm `@mkbabb/csp-solver-wasm`).
4. **C14 — version currency.** If 0.3.0 is live on crates.io, bump the `README.md:107` artifact row off "0.2.0 published; 0.3.0 staged" and reconcile the crate/wasm `0.2.0` vs `0.3.0` skew (`csp-solver/wasm/Cargo.toml:3`).
5. **C13 — recert the 13.36× headline.** Re-derive from a committed benchmark artefact (the W-GATE timing probe) or demote from headline. Until an artefact backs it, the number fails the evidence gate (`instructions/README.md:13-14`).
6. **C12 — SHA-stamp the counts.** Replace "this tree" (`README.md:76`) with the commit SHA the counts were measured at, matching the canon exemplar.
7. **C16/C17 — register touch-ups.** Thin the em-dashes in §Performance/§Deployment/§Architecture to ≤1 per paragraph; recast "retired structurally, not mitigated" (`README.md:101`) as a direct assertion.

## 4. Divergences needing upstream flags

- **Reaffirm the W7 flag (C18).** `docs/precepts/canonical-readme-shape.md:83` is still byte-for-byte the stale four-artifact / single-root-README row. The correction lives in `T2-W7-precepts-upstream-flag.md` but has **not** landed upstream; the vendored copy remains stale. Tranche-III should re-flag it so the next precept import doesn't re-seed the superseded model. No new upstream flag beyond W7 is warranted — the amendment text in the flag (`:37-39`) already covers the landed two-artifact per-package topology.

## 5. Net posture

Structure/colocation/testing doctrine: **conform** (C8–C11 clean — directory modules, no god modules, tests outside `src/`, no DI violation; this is the strongest stratum, reflecting tranche-2's colocation W8). README-shape doctrine: **partial-to-divergent** across every published package — the canonical five is incomplete everywhere (Contributing universally absent; wasm License absent). Measurement: **honest but not fully gated** (counts stamped; the flagship perf number self-discloses a broken evidence chain). Register: **conform on lexicon, loose on em-dash density**. The single upstream item (W7) is correctly captured and still pending.
