# T9-W5 §5.5 — doc-truth's structural holes

Lane record. Fence: `scripts/check-doc-truth.mjs` (its fixture corpus lives inside
it, `selfTestCases()`), `docs/benchmarks.md:54` for the lean row alone, and this
directory. Head at entry `4dd9ec9c`.

**Counts at close.** 39 rows → **41**. 76 fixtures over 28 rows → **125 fixtures
over all 41**, every row in both colours. Gate on the tree: 3 RED / 38 GREEN, the
three belonging to other lanes and unchanged by this one. `--self-test` exit 0,
gate exit 1, both read bare — transcript in `doc-truth-canaries.txt`.

## Post-wall entry

`scripts/check-doc-truth.mjs` was dirty at entry with **no semantic change**: a
bare `prettier` run had reformatted the whole file to 4-space under the standing
`~/.prettierrc` global-shadow trap, and `npm run lint` (the repo-pinned
`--config .prettierrc.json`, 2-space) refused it. The bare run said "All matched
files use Prettier code style" — the two-answers-for-one-file failure ci.yml:746
documents, met in the wild. Reformatted under the pin; the residue was four
re-wraps, all cosmetic. Nothing pre-wall in this fence needed completing.

---

## The first row — `lean-wasm-4-sites`, band-not-bytes

CI-RED at run 32868316304 on `4dd9ec9c`: four sites failing at once because the
runner toolchain builds the same source at **124,423 B** against darwin's stamped
**122,541 B**. The row demanded the LOCALLY measured bytes at all four sites, so
no stamp could green both platforms. **The row was the defect**, and a gate whose
verdict depends on where it runs is grading the toolchain, not the canon.

Redesigned into three tiers, each naming the platform it speaks for:

| tier | assertion | platform |
| --- | --- | --- |
| AGREEMENT | every site carries a figure LABELLED as darwin's, and the four agree — that value is the stamp | every |
| BAND | stamp ≤ enforced band AND the present artifact ≤ enforced band (band derived off ci.yml's own `-gt` guard, never pinned) | every |
| EXACTNESS | measured bytes == stamp | only where `platform === stamp.platform` |

Runner-vs-darwin drift is INFO on the derived line: `INFO linux − darwin = +1,882 B
(toolchain divergence, not a defect)`. The label grammar accepts both orders the
canon already writes — `darwin measures <N> B` and `<N> B raw on darwin` — with a
comma-free 24-character window, which is what separates a stamp from the runner's
own figure two clauses later in the same sentence.

`D.platform` was added so the platform-conditional arm is provable in BOTH
directions from either host. A fixture colour that depends on where the suite runs
is not a proof.

Derived at close:

```
darwin stamp 122,541 B across 4/4 sites · band ≤ 127,500 B · here (darwin) 122,541 B
  ← csp-solver/wasm/pkg/csp_solver_wasm_bg.wasm
```

**`docs/benchmarks.md:54` trued** (in fence for this row): the runner sentence
carried 122,861 B at `f2ae188d`, three runs stale. It now states the live runner
figure 124,423 B at `4dd9ec9c` (run 32868316304), names the divergence as
divergence, and states the law the gate now enforces — the stamp carries its
platform, the band binds everywhere.

---

## Rows landed

### `crate-symbol-cites` — NEW

Backticked `Type::member` resolved against an index the crate builds: 120 `.rs`
files → 201 declared owners (`struct`/`enum`/`trait`/`type`/`impl`/`mod`, plus
file and directory module names). File-scoped, not block-scoped, on purpose — the
question a doc cite raises is *does this surface exist at all* (`from_parts`), and
a brace-matching parser would trade that answer for false REDs on every macro and
`cfg` arm.

**The changelogs enter the scan list TENSE-SCOPED, and the scope is the row's first
assertion rather than an assumption under it.** Measured: 35 `::` cites in the
canon, **12 in scope, 0 unresolved**; the 23 below the head release are every one
of them surface a later release excised — `FutoshikiPuzzle::from_parts`,
`ConstraintEnum::Soft`, `Ordering::DomWdeg`, `Csp::add_soft_constraint`,
`Variable::reset_to`. A changelog is a record of past states; grading a 0.3.0 entry
against HEAD would forbid removing a surface without rewriting history. The window
is the section whose heading names the version `Cargo.toml` declares, and the
pairing is asserted — a head heading that drifts from the manifest REDs the row
instead of silently re-scoping it. History is counted and published:

```
csp-solver/CHANGELOG.md head 0.7.0 vs csp-solver/Cargo.toml 0.7.0 — 110 line window,
  197 of history ungraded · csp-solver/wasm/CHANGELOG.md head 0.7.0 vs …/Cargo.toml
  0.7.0 — 40 line window, 83 of history ungraded
```

One live defect the scope excludes and the fixture still proves: `docs/algorithms.md:58`
names `SolveConfig::backjumping`, which the tree does not have — the sentence
retires it in its own words ("was excised … the field is gone"), so `RETIRED_LINE`
holds it, correctly.

### `precepts-reachable` — NEW

The `docs/` walk reaches `docs/precepts/` — 47 pages that were outside every gate.

Its shape is decided twice by one fact: **precepts is a submodule** (`.gitmodules`
→ `mkbabb/precepts`, gitlink `8781ebb0`). Nothing committed here can cure a line
inside it, so the row asserts what this repo OWNS and never the precepts' doctrine:

- **Declaration** (asserts on every checkout): `.gitmodules` names the path, and
  the index carries a gitlink there.
- **Seam** (when populated): the two infra precepts exist; every `npm run <x>` the
  deploy precept prints is a script `web/frontend/package.json` defines (5 rows, all
  resolve); every path it backticks ANCHORED HERE exists (4 cites, all resolve,
  resolved against repo root and `web/frontend` both).

`actions/checkout@v4` does not populate submodules, so the runner sees an empty
directory. That posture is **derived and published**, with the arms it disables
named on the line — a state of the checkout, not a derivation that failed. Fixtures
stub both postures so neither colour depends on how the tree was cloned.

**Blanket path-existence over the 47 was AUDITIONED AND DECLINED, with the
measurement**: precepts is cross-repo substrate; 315 distinct path-shaped tokens,
**290 unresolved**, nearly all sibling repos' (`crates/gorgeous`,
`parse_that/src/utils.rs`, `docs/tranches/AZ-III/AZ-III.md`). All 13 relative
markdown links are broken too, and 5 of those are a README *template*. Wiring that
would mint a 290-site born-RED with no curing hand in this repo. The anchored
subset is the honest subject.

### `cited-paths-exist` — crate READMEs unscoped, tree KIND graded

`CITED_DOCS` was README + frontend README + `docs/` only. It is now **all of `DOCS`
plus the changelogs** — 14 files. Unscoping put the three crate READMEs' cites and
file trees inside a gate for the first time and surfaced four real holes:

1. **The tree base was one directory too high whenever a fence root named a CHILD.**
   `csp-solver/README.md` draws `src/`; every node under it resolved to
   `csp-solver/<file>` — 47 sites wrong, invisible while the file sat outside the
   scan. `treeBase()` is a ladder now: the doc's own directory, then the root under
   it, then the repo root (the published `pkg/README.md` is a copy that draws
   `csp-solver/wasm/`).
2. **A file node cannot carry children.** The 2018 convention this README states in
   prose — `foo.rs` beside `foo/`, drawn as `constraint.rs + constraint/` — sent
   every child to `…/constraint.rs/traits.rs`. A parallel directory stack fixes it.
3. **The KIND was never graded.** `scripts/` drawn over a file, or `vite.config.ts`
   drawn over a directory, both resolved GREEN. Now asserted.
4. **The comment harvest reached only child DIRECTORIES.** Comments that enumerate
   child FILES (`assets/ # index.css … + typography.css`) named files nothing
   resolved. Now harvested and asserted.

Three scoping repairs came with it, each a bug the widening exposed rather than a
carve-out: the published `pkg/` is indexed for basenames (the wasm READMEs
enumerate its contents by name); `RETIRED_LINE` reads a two-line window because
prose wraps (`csp-solver/README.md:198–199` splits "went with the kernel
unification (the old" from "`backtrack.rs`/`backjump.rs`)"); and a NEGATED cite
("no `mod.rs`") or a metasyntactic stand-in (`foo.rs`) claims nothing.

**Subdirectory-roster completeness was AUDITIONED AND DECLINED, with the
measurement**: of the eight drawn parents, four are deliberately partial — the root
tree draws 4 of 4 at top level but `web/frontend` 3 of 6 and `csp-solver/src` 6 of
7. "A drawn directory draws all its children" is not a law this canon holds. Per-
directory COUNTS are held, and already were: `directory-count-claims` grades three
sites including the tree-comment form (`scripts/ # … 21 .mjs`).

### `chromium-alone-claim` — the census's bundle half wired

The install census's `installs` and `runs` already decided the second arm at HEAD
(T9-W0 cured that half). `tokens` — WHICH bundles the workflow installs — was still
computed, printed on the derived line, and thrown away. A third arm now decides on
it: under a browser-executing posture, a doc may name the engines CI installs and
no others. Dormant while O-12 stands and the census is empty, which is the honest
shape for a claim whose subject the workflow does not currently have; both colours
proved through the stub.

### The eleven — fixtures

Eleven rows carried no fixture. Each now carries both colours, every GREEN built
from the derivation it grades:

`frontend-readme-two-games` · `root-readme-e2e-counts` · `lean-wasm-4-sites` ·
`ci-band-comment-406` · `sudoku-md-sections` · `ofl-licenses-figures` ·
`install-pin-0.5` · `test-count-208-vs-204` · `make-wasm-recipe` · `ci-lane-count` ·
`iai-golden-figure`

The self-test sentence in the file header is trued to the corpus it exercises: 125
fixtures over 41 rows, the eleven named. The changelogs joined the overlay's blank
list, so a symbol fixture cannot borrow the tree's colour.

### `--only <id>`

The canary law wants a bare exit per arm, and a repo where any other lane's row is
red cannot give one. `--only` scopes the run and the verdict; an unknown id exits 2
rather than passing empty.

---

## Canaries

Eleven tree-level canaries, each plant → run BARE → restore → run BARE, exit codes
off the process and never through a pipe. Full transcript in
`doc-truth-canaries.txt`. Every one: tree exit 0, planted exit 1, restored exit 0,
restored file byte-identical.

| arm | plant | file |
| --- | --- | --- |
| lean TIER-1 agreement | one site restamped 123,999 B | `docs/benchmarks.md` |
| lean TIER-1 label | stamp stripped of "on darwin" | `docs/benchmarks.md` |
| lean TIER-2 band | a cited figure over 127,500 B | `docs/benchmarks.md` |
| symbol cite (owner) | `FutoshikiPuzzle::from_parts` in present-tense canon | `csp-solver/README.md` |
| symbol cite (member) | `Csp::add_soft_constraint` | `csp-solver/README.md` |
| changelog scope | head heading `## 0.9.9` vs manifest 0.7.0 | `csp-solver/CHANGELOG.md` |
| tree KIND | `docs/` drawn as a file | `README.md` |
| tree comment roster | a child file the comment names, absent | `web/frontend/README.md` |
| precept command row | `npm run ship-it` | `docs/precepts/infra/deploy.md` |
| precept path cite | `public/_nonesuch` | `docs/precepts/infra/deploy.md` |
| precepts declaration | path renamed in `.gitmodules` | `.gitmodules` |

The submodule was restored and `git -C docs/precepts status --short` is clean.

TIER-2's band arm cannot be isolated at tree level — all four sites would have to
go over band, and one of them is `ci.yml`, outside this fence and being edited by
another lane. It is isolated in the fixture instead (`TIER 2 in isolation`: all four
sites overlaid, platform stubbed to linux, the band the only arm that fires). The
DEGRADED posture — no artifact on disk, so the size comes out of the same workflow
the band comes out of — is fixture-proved beside it and now REDs rather than
bounding a figure by its own source. `chromium-alone-claim`'s bundle arm and
`precepts-reachable`'s unpopulated posture are fixture-only for the same reason:
their subject is a state of the environment, not of the tree.

The 125-fixture self-test is itself the per-arm planted-defect proof: each fixture
is a plant, and the run exits bare.

## Bare exits at close

```
node scripts/check-doc-truth.mjs --self-test    exit 0   125 PASS / 0 FAIL
node scripts/check-doc-truth.mjs                exit 1   3 RED / 38 GREEN
node scripts/check-doc-truth.mjs --only lean-wasm-4-sites      exit 0
node scripts/check-doc-truth.mjs --only crate-symbol-cites     exit 0
node scripts/check-doc-truth.mjs --only precepts-reachable     exit 0
node scripts/check-doc-truth.mjs --only cited-paths-exist      exit 0
node scripts/check-doc-truth.mjs --only chromium-alone-claim   exit 0
npm run lint (repo-pinned prettier)             exit 0
npx vitest run                                  57 Test Files / 735 tests passed
node scripts/check-evidence-policy.mjs          exit 0
node scripts/ledger-diff.mjs --require-ledger --assert-state --verify-cites --self-test   exit 0
node scripts/check-inline-tests.mjs             exit 0
node web/frontend/scripts/check-copy-register.mjs (M16)   exit 0
```

The three RED rows are `root-readme-e2e-counts`, `e2e-total-arithmetic` (the
concurrent wave's e2e counts) and `ci-lane-count` (the README says seventeen lanes;
`ci.yml` now has eighteen since the dist lane landed). All three were RED at entry
and are untouched here — orthogonal, as instructed.

## Handoffs

1. **`.github/workflows/ci.yml:1409`** — the doc-truth step's comment says "49
   fixtures over 21 rows at land". The corpus is 125 over 41. One line, outside
   this fence.
2. **`.github/workflows/ci.yml:1385`** — the doc-truth lane's `actions/checkout@v4`
   takes no `submodules:` input, so `precepts-reachable`'s roster and command-row
   arms are dormant on the runner (the declaration arm still asserts). Adding
   `with: { submodules: true }` makes them bite in CI. Deliberately not done here:
   ci.yml is another lane's fence and a third wave is editing it.
3. **`README.md:112`** — `ci-lane-count` is RED because the dist lane took ci.yml to
   eighteen jobs. The cure is the prose, in the dist lane's fence.
4. **`docs/precepts/infra/deploy.md`** — still prints `--commit-dirty=true`, the
   `^4.110.0` wrangler pin (tree: `~4.116.0`) and the `git checkout <sha> --
   web/frontend` rollback the deploy lane retired. The gate does NOT assert precept
   doctrine, deliberately: it is a submodule, so the cure is a commit in
   `mkbabb/precepts` plus a gitlink bump — the chair's, not any lane's.
