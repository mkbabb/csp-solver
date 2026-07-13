# r2-cross-repo — bbnf vendor truth · pencil-boil record · wasm file:-link · api dangling refs

csc411 HEAD `65425697` (master). bbnf-lang HEAD `fe3e615d3` (master, 40 ahead / 0 behind origin). pencil-boil HEAD `da51edb` (== tag v0.8.1). All probes rerunnable, dates 2026-07-12.

Note: the brief's path `csc411/.../scripts/sync-csp-solver-vendor.sh` does NOT exist — the sync script lives in bbnf-lang (`/Users/mkbabb/Programming/bbnf-lang/scripts/sync-csp-solver-vendor.sh`), as r1-consumer-truth already noted. csc411 `scripts/` holds only `dev.sh`.

---

## (a) bbnf-lang vendor — VERIFIED CLEAN

**Pin & currency.** Vendor pin lives in exactly one place — `crates/csp-solver/Cargo.toml:5` description field: `02965a56cfe78f0c498f34095a9f88e1ff69974d` (csc411 T3-W6 "engine perf", 2026-07-10 23:51). csc411 HEAD is `65425697` (2026-07-12). The pin trails HEAD by wall-clock, but **content-current**: the only post-pin commit touching `csp-solver/` is `d0893614` (T3-WGATE), which changed **only `csp-solver/README.md`** — `src/` and `data/` are byte-identical between the pin and HEAD.
- Probe: `git -C csc411 log --oneline 02965a56..HEAD -- csp-solver/src csp-solver/data` → empty; `... -- csp-solver/` → only `d0893614`; `git show --stat d0893614 -- csp-solver/` → `csp-solver/README.md | 4 ++--` only.

**--check passes RIGHT NOW.**
```
cd /Users/mkbabb/Programming/bbnf-lang && ./scripts/sync-csp-solver-vendor.sh --check
→ OK: crates/csp-solver/{src,data} match csc411@02965a56…974d byte-for-byte.  (exit 0)
```

**Both cfg branches compile-gated (as claimed).** `--verify` (`sync-csp-solver-vendor.sh:246-262`) gates: `[1] root {bbnf,bbnf-ir,egraph}` · `[2] skinny {passes}` (separate workspace) · `[3] vendored csp-solver default` · `[4] vendored csp-solver --features py in an ISOLATED detached workspace at pyo3 0.29` (`verify_py_isolated`, :211-244) · lattice test suite. The py branch is isolated precisely because bbnf-core's jiter links pyo3 0.23 and cargo forbids two `links="python"` in one graph (:205-210) — a real, documented constraint. Both structural tripwires present: trait-surface Send/Sync allow-list (:104-107) and SolveConfig/SolveStats field-set delta vs `scripts/.csp-solver-fields.baseline` (:120-133, baseline file present, 158 B).
- **Partial live confirmation** (the vendored-code portion, not the full root bbnf build — expensive): `cd crates/csp-solver && cargo check` → clean (0.55s); `cargo test --test lattice` → **16 passed / 0 failed**. The default cfg branch compiles and the lattice suite is green at the pinned src. I did NOT run the full root `cargo check -p bbnf` nor the py-isolated stage (cost); the script structure gates both and the pre-push hook enforces them.

**Local-only discipline VISIBLE.** bbnf-lang `master` is **40 ahead / 0 behind** `origin/master` — never pushed (`git rev-list --left-right --count origin/master...HEAD` → `0  40`). Script header (:44-46) and pre-push hook (`scripts/hooks/pre-push:33-36`, runs `--check` AND `--verify`) both encode the never-push order; the script only READs csc411 (`git archive`/`cat-file`) and WRITEs inside bbnf-lang. Vendor dir `crates/csp-solver/` is git-clean. **DO NOT push — not touched.**

Verdict: vendor truth holds on every axis. No finding.

---

## (b) pencil-boil record — mostly honest; two findings

**0.6.0→0.8.1 all present and honest — CONFIRMED.** git tags `v0.6.0 v0.7.0 v0.8.0 v0.8.1` all exist; each tag's `package.json` version matches the tag (`v0.6.0→0.6.0` … `v0.8.1→0.8.1`); npm `dist-tags.latest = 0.8.1`, `versions` includes all four; CHANGELOG.md has dated entries for each (`:70 :39 :14 :3`). HEAD == `v0.8.1` (`da51edb`). Honest across git/npm/changelog/manifest.

**proofs suite GREEN at HEAD — CONFIRMED.** `npm run proof` → boil-guard/frames/cache/prebake/celestial all `ok` (9+13 assertions in the tail alone, 0 failures); `npm run check` (tsc --noEmit) → exit 0. `npm run test` = check && proof, both green.

### F1 (P2) — CONTRIBUTING describes a changesets release flow that does not exist; the real flow is tag-push publish
family_hint: `doc-describes-nonexistent-flow`

`CONTRIBUTING.md:33-43` prescribes: "Version bumps run through **changesets**… `npx changeset`… On merge to the default branch, the changesets workflow batches accepted changesets into a `Version Packages` PR; merging that PR… `.github/workflows/release.yml`, which type-checks + publishes to npm via `NPM_TOKEN`." (also :69 "Author a changeset (`npx changeset`)").

Reality — none of the changeset machinery is wired:
- No `@changesets/cli` in `package.json` (grep `changesets` → nothing); `node_modules/@changesets` not installed.
- No `changeset` / `version` / `release` npm script — `scripts` block is only `check` / `proof` / `test`.
- No changeset markdown files ever authored (`.changeset/` holds only `config.json` + `README.md`).
- No changesets/Version-Packages workflow in `.github/workflows/` (only `ci.yml` + `release.yml`).
- The real `release.yml` triggers on **`push: tags: "v*.*.*"`** and runs `npm ci → npm run check → npm publish --access public` (`.github/workflows/release.yml:9-27`). It never touches changesets and is not fed by a "Version Packages" PR.

So CONTRIBUTING doesn't merely reference an unwired rig (r1 FAM-7) — it **misdescribes the actual working release mechanism** (manual version bump + `vX.Y.Z` tag push) as a changeset-batched-PR flow that has never existed here. A contributor following CONTRIBUTING would `npx changeset` (fails — CLI absent) and expect an auto-PR that never comes. Cost: onboarding dead-end + a false record of the release process.

Probes: `grep -niE "changeset|release" CONTRIBUTING.md` · `grep changesets package.json` (none) · `cat .github/workflows/release.yml` (tag-triggered, no changesets).

### F2 (P3) — npm-published 0.1.1–0.4.1 have no git tags; release.yml can't have published them
family_hint: `record-gap-untagged-release`

npm `versions` = `0.1.1 0.2.0 0.3.0 0.4.0 0.4.1 0.5.0 0.5.1 0.6.0 0.7.0 0.8.0 0.8.1` (11). git tags exist only from `v0.5.0` up (6). So `0.1.1 0.2.0 0.3.0 0.4.0 0.4.1` are on npm with **no corresponding git tag**. Since `release.yml` publishes ONLY on a `v*.*.*` tag push, those five releases were published outside the recorded workflow (manual `npm publish` pre-tag-automation). CHANGELOG covers `0.3.0 0.4.0 0.4.1` (`:144 :134 :124`) but not `0.1.1 0.2.0` at all. Minor provenance gap in the release record — no live impact.

Probe: `npm view @mkbabb/pencil-boil versions` vs `git tag`.

---

## (c) wasm pkg file:-link contract — reproducible; one doc lie, one fresh-clone gap

**file:-link.** `web/frontend/package.json:20` → `"@mkbabb/csp-solver-wasm": "file:../../csp-solver/wasm/pkg"`.

**pkg is BUILT-ON-DEMAND, not committed.** `csp-solver/wasm/pkg/` is **gitignored** (`.gitignore:58`; `git ls-files csp-solver/wasm/pkg` → 0 tracked; `git check-ignore` → IGNORED). The on-disk pkg lean wasm is 86,746 B.

**Lean 86,746 B reproducible byte-identical — CONFIRMED.**
```
cd csp-solver/wasm && wasm-pack build --target web --profile wasm-release --no-default-features --out-dir /tmp/r2-lean
wc -c /tmp/r2-lean/…_bg.wasm pkg/…_bg.wasm  → 86746 / 86746
cmp /tmp/r2-lean/…_bg.wasm pkg/…_bg.wasm    → LEAN BYTE-IDENTICAL
```

**Full module reproducible = 188,095 B (NOT the recorded 222,436 B) — CONFIRMS r1-deps-rust F5.**
```
wasm-pack build --target web --profile wasm-release --out-dir /tmp/r2-full
wc -c /tmp/r2-full/…_bg.wasm  → 188095
```
The record states the full module as **222,436 B** in three places — `README.md:103`, `docs/benchmarks.md:51` ("not re-measured this tranche"), `.github/workflows/ci.yml:322`. That's −34 KB / −15% stale. ci.yml:322 additionally cites "90,602 B lean" (T2 figure; real is 86,746). Budgets (full fail >240 KB / lean fail >93 KB) still hold with headroom, so no gate breaks — stale doc figures only.

### F3 (P2) — wasm README claims `pkg/` is "committed alongside source"; it is gitignored
family_hint: `stale-doc-figure` (doc-vs-tree lie)

`csp-solver/wasm/README.md:44` "The committed `pkg/` is the lean… deploy artifact the frontend file-links" and `:85` "`pkg/` … wasm-pack output, committed alongside source" — both **false**: `pkg/` is gitignored (`.gitignore:58`). The frontend's `file:../../csp-solver/wasm/pkg` dep therefore resolves against a directory that a **fresh clone does not contain**. This matters for the fresh-clone-build question: pkg must be built before `web/frontend` `npm install` can resolve the file: dependency, yet the README asserts it ships in the tree.

### F4 (P2) — fresh clone does NOT build the frontend without a manual, non-obvious wasm step; the documented `make wasm` produces the WRONG artifact
family_hint: `build-recipe-drift` (confirms + extends r1-deps-rust F1)

A fresh clone has no `pkg/` (gitignored). Nothing auto-builds it: `web/frontend/package.json` has no `predev`/`preinstall`/`prebuild` hook, there is no root `Makefile`, and the only build recipe (`csp-solver/wasm/Makefile:8-10` `make wasm` = `wasm-pack build --target web --release`) produces the **FULL, wrong-profile** artifact (188,095 B full-feature, `--release` not `--profile wasm-release`) — over the CI lean budget (fail >93 KB) and carrying the `assignment` surface the deploy excludes. The correct lean command exists only as prose (`README.md:34`). So the reproducibility path is: run the manual `wasm-pack … --no-default-features` line, NOT the Makefile target, NOT documented as the frontend's prerequisite. r1-deps-rust F1 flagged the Makefile footgun; the cross-repo angle is that the **frontend file:-link silently depends on this uncommitted, correctly-built artifact** with no wiring or accurate doc to get a first-time cloner there.

Probe: `ls csp-solver/wasm/pkg` (present locally) vs `git ls-files csp-solver/wasm/pkg` (empty); `grep -E "pre(dev|install|build)" web/frontend/package.json` (none).

---

## (d) dangling web/api / EC2 / api.sudoku.babb.dev refs — CLEAN in live tree; one stale layout doc

**web/api / EC2 / api.sudoku.babb.dev — excision is clean in live code & config.** `web/api` dir GONE. Every git-tracked reference to `web/api`, `34.197.214.67`, `ssh -p 1022`, `/var/www/csp-solver`, `api.sudoku.babb.dev`, `fastapi`/`uvicorn` sits in **`docs/tranches/2026-07-tranche-2/` historical evidence** (the T2-W2 decommission record, CSP diffs, synthesis notes) — legitimate archival record, not dangling live config. No live `_headers`/`_redirects`/`nginx`/`ci.yml`/frontend reference to the api box or `connect-src https://api.sudoku.babb.dev` survives. (`Cargo.lock`/`uv.lock` "ec2" hits are checksum false-positives.) pencil-boil carries only benign provenance prose ("hoisted from the sudoku consumer", `CHANGELOG.md:56,91`; `vue.ts:386` alias comment) — no api/box refs. The `isomorphic` mentions in `csp-solver/src/*` are design comments ("isomorphic to Python's X"), not the excised wasm `isomorphic.rs`.

### F5 (P2) — csp-solver README py/ layout lists two files that don't exist, including a futoshiki binding the module never exposed
family_hint: `stale-doc-figure` (dangling source-layout doc)

`csp-solver/README.md:168-169` documents the `py/` tree as containing `sudoku_api.rs` (SudokuCSP…) and `futoshiki_api.rs` (FutoshikiCSP, create_futoshiki_csp, solve_futoshiki, create_random_futoshiki). The actual `csp-solver/src/py/` holds: `config.rs csp.rs enums.rs errors.rs mod.rs sudoku.rs`. So:
- `sudoku_api.rs` is misnamed — the file is `sudoku.rs`.
- **`futoshiki_api.rs` does not exist** — there is no futoshiki PyO3 binding at all; the README advertises a Python futoshiki API surface that the wheel does not ship.

This is a dangling doc reference in a product README (not a tranche record). Cost: the README overstates the Python binding surface and lists a nonexistent file.

Probe: `ls csp-solver/src/py/` vs `sed -n '168,169p' csp-solver/README.md`.

---

## Banked probes
```
# (a) vendor
grep -oE '[0-9a-f]{40}' /Users/mkbabb/Programming/bbnf-lang/crates/csp-solver/Cargo.toml | head -1
git -C /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion log --oneline 02965a56..HEAD -- csp-solver/src csp-solver/data
cd /Users/mkbabb/Programming/bbnf-lang && ./scripts/sync-csp-solver-vendor.sh --check
git -C /Users/mkbabb/Programming/bbnf-lang rev-list --left-right --count origin/master...HEAD
cd /Users/mkbabb/Programming/bbnf-lang/crates/csp-solver && cargo check && cargo test --test lattice
# (b) pencil-boil
cd /Users/mkbabb/Programming/pencil-boil && git tag && npm view @mkbabb/pencil-boil versions dist-tags
grep -niE "changeset|release" CONTRIBUTING.md ; grep changesets package.json ; cat .github/workflows/release.yml
npm run proof ; npm run check
# (c) wasm
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion
git check-ignore csp-solver/wasm/pkg ; git ls-files csp-solver/wasm/pkg
cd csp-solver/wasm && wasm-pack build --target web --profile wasm-release --no-default-features --out-dir /tmp/r2-lean && cmp /tmp/r2-lean/csp_solver_wasm_bg.wasm pkg/csp_solver_wasm_bg.wasm
wasm-pack build --target web --profile wasm-release --out-dir /tmp/r2-full && wc -c /tmp/r2-full/csp_solver_wasm_bg.wasm  # 188095
# (d) dangling
git -C … grep -n -iE "34\.197\.214\.67|api.sudoku.babb.dev|fastapi" HEAD | grep -v docs/tranches   # → empty
ls csp-solver/src/py/ ; sed -n '168,169p' csp-solver/README.md
```
