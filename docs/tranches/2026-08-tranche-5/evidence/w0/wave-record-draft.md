# T5-W0 — WAVE RECORD (draft, verifier lane)

The record heals first. Five fix lanes landed rows 0.1–0.8; this lane re-ran the gates, re-derived
every figure off the artifact, and drafted what follows. Rows 0.9/0.10 are the team lead's—memory
lives outside the tree, so the root attests to them separately. What's verifiable in-tree about
0.10 is verified here.

**HEAD** `e961bdb7` (2026-08-01 14:03:48 -0400), working tree docs-only over it.
**Host** Apple M5 Max, darwin/arm64, node v26.0.0, 2026-08-01.
**Verdict** doc-truth **exit 0**, 10 GREEN / 0 RED. ledger-diff **exit 1**, 34 orphans, **zero
inside W0's scope**—the deferral is named and arithmetic-checked in §2.

## 1. Gates

| Gate | Command | Exit | Bank |
|---|---|---|---|
| doc-truth | `node scripts/check-doc-truth.mjs` | **0** | `evidence/w0/doc-truth-GREEN.txt` |
| ledger-diff (dry-run) | `node scripts/ledger-diff.mjs` | 1 (scoped, §2) | `evidence/w0/ledger-diff-GREEN.txt` |
| ci.yml comment-only | `git diff -U0 .github/workflows/ci.yml` filtered | 0 non-comment lines of 40 | §4 |
| no source moved | `git status --porcelain` | 16 `.md` + 1 `.yml` + 2 untracked `.mjs` | §4 |

Both instruments were run by this lane, not inherited. The `ledger-diff` transcript is
byte-identical to the fix lane's `ledger-diff-after-closures.txt` outside the timestamp and
HEAD lines—`diff` of the two, filtered on those two keys, is empty.

## 2. The ledger-diff arithmetic

220 audited rows: 46 CORPUS, 127 SELF, 13 DELEGATED, 34 ORPHAN. Zero of the 34 belong to W0.

`record-closures.md:270-290` (§7) names the deferral and its reasoning: `evidence/` isn't corpus by
construction, so rows 0.6/0.8's substance discharges through the citations in
`waves/T5-W0-truth-and-record.md`, not through the audit file that carries the derivations. CH-16,
CH-34, CH-60, U-07 and U-08 were never orphans—each is cited by rows 0.6/0.8 and reads CORPUS.
CH-21 is an orphan and stays one: a held row's home is the living ledger, W6's `LEDGER.md`.

The residue: 23 CH − CH-21 = 22 CH, 7 PR, 4 U = 33, plus CH-21 = **34**. Those 33 are W5's to
dispose (`waves/T5-W5-decide.md:3`, `:46`—the CH-01…61 range the tool reads as scope, never as
citation) and W6's to home. `gates.json` puts the exit-zero close condition at W5
(`gates.W5.ledgerDiff.closeCondition`), and WGATE re-runs it (`gates.WGATE.ledgerDiffExitZero`).
So exit 1 here is the instrument working, not a wall.

## 3. Rows

| # | Row | State | Gate / cite |
|---|---|---|---|
| 0.1 | `web/frontend/README.md` rewritten | **GREEN** | `doc-truth-GREEN.txt` row `frontend-readme-two-games`; `grep -cEi "two games\|0\.7\.0\|prettier --write" web/frontend/README.md` → 0; derivations at `f1-notes.md:29-62` |
| 0.2 | Root README truth pass | **GREEN** | rows `root-readme-e2e-counts` (206 in 15 default, 4/1 golden, 23/4 throttle, 20 on disk), `chromium-alone-claim`, `pencil-boil-0.9.2`; sites `README.md:87`, `:96-102`, `:121`, `:124`, `:132`; `f2-notes.md` |
| 0.3 | benchmarks node spine · lean wasm ×4 · CH-32 band comment | **GREEN** | rows `lean-wasm-4-sites` (122,385 B ← `csp-solver/wasm/pkg/csp_solver_wasm_bg.wasm`, re-derived here by `wc -c`) and `ci-band-comment-406`; sites `docs/benchmarks.md:51`, `csp-solver/wasm/README.md:57`, `csp-solver/wasm/pkg/README.md:57` (gitignored, `.gitignore:74`), `.github/workflows/ci.yml:461`; `f3-notes.md`, `f3-gac-ab-corpus.txt` |
| 0.4 | `docs/sudoku.md` symmetry · ghost APIs · three deep sections | **GREEN** | row `sudoku-md-sections`; `docs/sudoku.md:92` (shared generator contract), `:104` Thermo, `:116` Killer, `:128` KenKen; ghost cites dead at `docs/algorithms.md:59,73,83` and `docs/benchmarks.md:36`; `f4-notes.md` |
| 0.5 | `csp-solver` install pin · precepts leak | **GREEN** | rows `install-pin-0.5`, `ofl-licenses-figures`; `csp-solver/README.md:35` reads `csp-solver = "0.6"` against `Cargo.toml` 0.6.0; markdown links into `docs/precepts/` across the consumer corpus → 0; fonts 21,724 B re-derived by `wc -c` at `README.md:62` and `LICENSES.md:3,11`; `f5-notes.md` |
| 0.6 | CH-16 · CH-34 · CH-60 · D6 closures | **GREEN** | `record-closures.md:26-174` (§§1–4); ledger-diff W0-scope orphans 0 |
| 0.7 | Deployment-id hygiene · the D11 trap | **GREEN** | `deployment-id-sweep.txt` (13 sites, 8 files, 15 enumerated exemptions); sealed-record correction confined to the label at `patches/p1-safari-ios-performance/waves/p-w4-validate-deploy.md:77`; trap written at `record-closures.md:294-331`, enforced by `gates.WGATE.deploymentIdVocabulary` |
| 0.8 | U-07 · U-08 closing cross-references | **GREEN** | `record-closures.md:178-266` (§§5–6); both close at `429e7983`, homed at `docs/tranches/2026-07-tranche-3/appendices/B-prompt-recap.md:121`, `:123` |
| 0.9 | MEMORY true-up | **TEAM-LEAD — PENDING** | see §5; the in-tree half of the vocabulary row is green (0.7), the memory body lines aren't |
| 0.10 | U-10 forward rule into the working directives | **TEAM-LEAD — LANDED** | rule text at `memory/lessons-from-t2-t4.md:69-73` (§9, the ninth family, "a design mark closes only on an owner-side re-look—never on an internal gate alone"); cited in W4 at `waves/T5-W4-design.md:3` and `:26`; `gates.W4.marksCloseOn` = `owner-re-look-only` |

### Re-derivations this lane ran itself

| Figure | Command | Result |
|---|---|---|
| rust attributes | `grep -rE '^[[:space:]]*#\[test\]' --include='*.rs' csp-solver/src csp-solver/tests \| wc -l` | 204 |
| rust totals | `cargo test --workspace` | 208 passed, 0 failed, 0 ignored; 26 `Running` lines; 2 `Doc-tests` sections (csp_solver 4, csp_solver_wasm 0) |
| lean wasm | `wc -c csp-solver/wasm/pkg/csp_solver_wasm_bg.wasm` | 122,385 B |
| fonts | `wc -c web/frontend/src/assets/fonts/*.woff2` | 3,624 + 13,788 + 4,312 = 21,724 B |
| deployment ids | `git cat-file -t` on `f1adfca5`, `a8174110`, `781fc09c`, `7cadf462`, `0275562b`, `c90d9e06` | all six *Not a valid object name*; none is a commit |
| id occurrences | `grep -roE` the three ids over `docs`, `README.md`, `.github`, minus `evidence/w0/` | 31, which is the sweep's 35 − the 4 its own trap row quotes into being |
| e2e | `check-doc-truth.mjs` invoking `playwright test --list` ×3 | 206/15 default, 4/1 golden, 23/4 throttle, 20 specs on disk |

## 4. The legal diff surface

`git diff -U0 .github/workflows/ci.yml`, stripped of hunk headers and comment lines, is **0 lines**
against 40 changed—comment-only, as row 0.3 requires. The enforced budgets don't move: the script
re-derives them off the workflow's own guards as full fail >240,000 B / warn >230,000 B / lean fail
>127,500 B, printed on the `ci-band-comment-406` row. That printed derivation is the check that
matters, per the trap `f3-notes.md:136-143` records: the band scraper reads 25 lines from its
anchor, so a comment that grows can push a guard out of the window and still print GREEN.

The tracked diff is 16 `.md` files and one `.yml`; untracked are the two `.mjs` gate scripts and the
two T5 evidence directories. No `.ts`, `.vue`, `.rs`, `.css` moved.

**One path-literal exception, adjudicated.** `web/frontend/src/assets/fonts/LICENSES.md` sits under
`web/frontend/src/` and so trips a literal reading of the no-source-code fence. It's a Markdown
license manifest, not source: the diff is the stale 17,708 B figure going to 21,724 B, Fraunces
9,772 → 13,788, and the table's column re-flowed to fit. Row 0.5's own gate row
(`ofl-licenses-figures`) asserts against that file by name, so the wave's instrument requires it be
true. Both figures re-derived here by `wc -c`.

## 5. Handed up

1. **Row 0.9 isn't done.** `memory/MEMORY.md:5` carries the corrections as a trailing clause, and
   the body they correct still stands: `:6` reads production `7cadf462` and `a8174110→781fc09c→7cadf462`
   in bare commit position (none resolves, §3); `:18` still lists "FastAPI at `web/api`" as live
   structure; `:31` still puts `sync-csp-solver-vendor.sh` in this repo's `scripts/`. The tree-side
   vocabulary row is green; the memory body wants the same pass.
2. **Verifier residue, logged.** The tenth doc-truth row (`test-count-208-vs-204`,
   `csp-solver/README.md:216`) was RED at the fix lanes' exit—each lane read it as another's. It's
   audit row S15 in `doc-canon-drift.md:135,265`, inside W0's FAM-C charter, named by no 0.x row.
   Cured here as single-token residue: "across 28 test binaries" → "across 26 test binaries + 4
   doctests", stamp moved from `826f16e3`/2026-07-15 to `e961bdb7`/2026-08-01 because the counts
   were re-run today, not inherited. Every number off `cargo test --workspace` in this lane (§3).
   `README.md:90` already read 26 + 4 and took no edit. **W2 re-stamps this line again**—its own
   gate says so (`waves/T5-W2-distill.md:24`, `gates.W2.rustEdges.testCountRestamped`), since the
   `assignment.rs` split and the `cage.rs` test extraction move the count.
3. **The band-scraper window is brittle** (`f3-notes.md:136-143`): a null or zero band prints GREEN.
   Whoever owns `check-doc-truth.mjs` should make an underived band loud.
4. **W6 row 6.1 targets a read-only submodule** (`f5-notes.md:71-74`): `docs/precepts/` is a
   `160000` submodule of `mkbabb/precepts` at `8781ebb0`, so `working-precepts.md` written there
   lands in another repo. It wants a tracked home.
5. **`gac_timing_probe` no longer completes** (`f3-notes.md:51`): it panics at
   `examples/gac_timing_probe.rs:264`. Its two wall-time figures stand under their old stamp with
   the abort disclosed. Retiring or re-deriving them is above W0's rows.
6. **ci.yml's meta vocabulary is the file's own convention**, not a new leak: 31 tranche/wave tokens
   at HEAD, 32 now. The meta-leak-zero corpus is the READMEs and `docs/*.md`, and it holds there.

## 6. Files changed

Tracked (`git status --porcelain`), all Markdown but the workflow:

```
 M .github/workflows/ci.yml                                        (comment-only, 40 lines)
 M README.md
 M csp-solver/README.md
 M csp-solver/wasm/README.md
 M docs/algorithms.md
 M docs/benchmarks.md
 M docs/sudoku.md
 M docs/tranches/2026-07-tranche-4/patches/p1-safari-ios-performance/waves/p-w4-validate-deploy.md
 M docs/tranches/2026-08-tranche-5/evidence/audit/r1/cc-prompt-ledger.md
 M docs/tranches/2026-08-tranche-5/evidence/audit/r2/design-loop-open-rows.md
 M docs/tranches/2026-08-tranche-5/evidence/design-loop/pass3-registry.md
 M docs/tranches/2026-08-tranche-5/evidence/design-loop/pass4-registry.md
 M docs/tranches/2026-08-tranche-5/evidence/design-loop/pass4/measure-report.md
 M docs/tranches/2026-08-tranche-5/evidence/design-loop/pass4/measure/RESULTS.md
 M docs/tranches/2026-08-tranche-5/evidence/design/alpha-gestalt.md
 M web/frontend/README.md
 M web/frontend/src/assets/fonts/LICENSES.md                       (§4 exception)
?? docs/tranches/2026-08-tranche-5/evidence/w0/
?? docs/tranches/2026-08-tranche-5/evidence/w5/
?? scripts/check-doc-truth.mjs                                     (524 lines)
?? scripts/ledger-diff.mjs                                         (436 lines)
```

Untracked-but-written: `csp-solver/wasm/pkg/README.md` (gitignored at `.gitignore:74`, re-synced so
the npm tarball stops shipping the stale byte figure).

`evidence/w0/` holds 21 files: this draft, `record-closures.md`, five lanes' notes, the
deployment-id sweep, and the gate transcripts—`doc-truth-RED-at-HEAD.txt` and
`ledger-diff-RED-canary.txt` proving both instruments born-RED, the per-lane after-runs, and this
lane's `doc-truth-GREEN.txt` / `ledger-diff-GREEN.txt`.

No commit, no push, no deploy. No dev server touched.

## 7. TEAM-LEAD SEAL (root, 2026-08-01)

**Row 0.9 — DONE at this seal.** The memory body now matches the corrections clause; the diffs, quoted:
- `MEMORY.md` T4-P1 line: "PRODUCTION \`7cadf462\` (tree…" → "PRODUCTION = CF deployment \`7cadf462\` (built from tree…"; "…cure→7cadf462 rearm…" → "…cure→CF deployment \`7cadf462\` rearm…; all three are CF deployment ids".
- `MEMORY.md` Structure: "FastAPI at web/api (7-code taxonomy, DI)" → "web/api DELETED at T2 \`98fe2562\` — no FastAPI in-repo, the owner's EC2 box is the reference deploy".
- `MEMORY.md` Key Patterns: vendor-sync script re-homed "IN bbnf-lang, not this repo"; pencil-boil "^0.9.2's scheduler" → "^0.10.1's scheduler" (a fifth stale line the sweep didn't name — same FAM-C class, cured on sight).
- `t4-formulation-2026-07-12.md:107`: the three bare ids labeled ("RE-PASS ALL GREEN on CF deployment \`f1adfca5\`", "production stays CF deployment \`f1adfca5\`", "KENKEN RE-CHECK ALL GREEN on CF deployment \`781fc09c\`"); the fourth-member line already read "production stays deployment \`7cadf462\`" — passes the bare predicate.

**Row 0.10 — LANDED** (verifier-confirmed both halves; §3).

**Adjudications on the handed-up six + the flagged residue:**
1. (0.9) Done above.
2. (S15 verifier residue) **RATIFIED** — the single-token cure with the stamp moved-because-re-run stands; W2 re-stamps per its own gate.
3. (band-scraper brittleness) **ORDERED → W1.7**: when doc-truth joins CI, an underived/absent band exits nonzero — loudness is part of the lane's acceptance.
4. (docs/precepts submodule) **HELD → W6.1-open**: the precepts file gets a tracked in-THIS-repo home (the submodule untouched) unless the owner rules otherwise at the ballot margin; decided and recorded at W6.
5. (gac_timing_probe panic at examples/gac_timing_probe.rs:264) **FOLDED → W2.7** rust edges: fix-or-retire with figures re-derived or struck.
6. (ci.yml meta vocabulary) **ACCEPTED** — the file's own pre-existing convention; the meta-leak-zero corpus is READMEs + docs/*.md and holds.
7. (S12/S13/S14 — the `make wasm` full-vs-lean doc, Makefile:16 "sudoku + futoshiki only", iai_queens.rs:8 + benchmarks.md:86 1,585,722-vs-1,529,452) — CH-32's hand-copied-comment class, three more members, no 0.x row ordered them. **Class cure ORDERED → W1.7**: check-doc-truth grows rows for the Makefile claims + the iai figure (fix the comments, gate the class); the iai_queens.rs:8 source comment itself rides W2.7.
8. (em-dash register) **RULED**: record-corpus files keep their local spaced convention (isomorphism within the corpus); consumer surfaces (READMEs, docs/*.md) follow MIKE-STYLE. 
9. (ledger-diff strict rule) **RATIFIED**: a chronic row terminal in its own ledger still wants a T5 citation — U-11's entire lesson; the fourth-route ceremony predicate is REFUSED. The 34 orphans discharge: 23 CH → W6.6's LEDGER.md seeding, 7 PR → LEDGER.md citations + the formation-discharge sentence (PR-132/135/136/137), 4 U → the naming line added to `waves/T5-W4-design.md` at this seal.

**Wave verdict: SEALED.** 0.1–0.10 all GREEN or team-lead-landed; both instruments born-RED with banked reds; ledger-diff exit-1 is scoped-and-owned (W5/WGATE's close condition, not W0's). CI conclusion for the seal commit rides the pinned run recorded in the tranche live state.
