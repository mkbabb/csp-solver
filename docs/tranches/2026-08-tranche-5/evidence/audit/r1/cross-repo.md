# Cross-repo truth audit — R1

**Auditor**: cross-repo truth row, T5 R1 audit. **Stamped**: 2026-08-01.
**Anchor**: csc411 HEAD `71456713d9f7361af80f09e1a456fc9787507e78` (2026-08-01, "CI-RED 30690204551: the empty bake is the runner's, and only the vacuity guard yields").
**Mode**: READ-ONLY. No edits, no commits, no pushes, no publishes, no deploys. The one bbnf-lang script invocation was `--check` (byte-diff only); `--update` was never issued. No process on 3001/4288/3000/4188 touched.

**Verdict**: 6 rows audited. **4 CLEAN, 2 DRIFT.** No live guardrail breach. Both drift findings are documentation/release-hygiene, not code: a stale README pin row and two untagged pencil-boil releases. One latent risk surfaced that no document records (PyPI name is third-party-owned).

| # | Row | Verdict |
|---|---|---|
| 1 | pencil-boil repo vs frontend pin | **DRIFT** (untagged releases; stale README row) |
| 2 | bbnf-lang vendored csp-solver | CLEAN (check passes; staleness is by-design, disclosed below) |
| 3 | morph excision residue | CLEAN |
| 4 | published-registry truth | CLEAN (one latent PyPI risk, unrecorded) |
| 5 | glass-ui guardrail (ZERO) | CLEAN — zero imports verified |
| 6 | file:-link discipline / npm ci | CLEAN — recurrence structurally blocked |

---

## Row 1 — /Users/mkbabb/Programming/pencil-boil vs the frontend pin

### Repo state

`git log -5 --format='%h %ad %s' --date=short` in /Users/mkbabb/Programming/pencil-boil:

```
763f1c0 2026-07-31 fix(raster): 0.10.1 — the bake yields a paint before it reads the cascade
08f4f5e 2026-07-31 release: 0.10.0 — the capture-intrinsic truth-fix (stamped intrinsic; zero-box bake guard)
503ff80 2026-07-31 fix(raster): stamp the capture intrinsic on the pose document; no bake at a zero box
a90f5ea 2026-07-15 docs: README em-dash thinning by clause rewrite; CHANGELOG headings re-cut to plain descriptors
3f72d17 2026-07-13 feat(cache): 0.9.2 — per-value onEvict disposal; useRasterStack captures fresh per bake
```

`git status --porcelain=v1 -b` → `## master...origin/master` and **no file lines**. Working tree clean; no ahead/behind marker.

### Unpushed drift — NONE

```
git ls-remote origin refs/heads/master
  763f1c03122dc1af090b4d1b4aa16a17d95a568e	refs/heads/master
git rev-parse HEAD
  763f1c03122dc1af090b4d1b4aa16a17d95a568e
```

Local HEAD and `origin/master` (git@github.com:mkbabb/pencil-boil.git) are the same commit. **Zero unpushed commits.** HEAD *is* the 0.10.1 release commit, so there is no post-release unpublished work either.

### Unpublished drift — NONE

- Source manifest: `package.json` `"version": "0.10.1"`.
- `npm view @mkbabb/pencil-boil version` → `0.10.1`; `dist-tags` → `{"latest": "0.10.1"}`.

Source == registry == frontend lock. Nothing unpublished.

### Frontend pin agreement — ALIGNED

- `web/frontend/package.json:36` — `"@mkbabb/pencil-boil": "^0.10.1"`
- `web/frontend/package-lock.json` — `node_modules/@mkbabb/pencil-boil` → version `0.10.1`, resolved `https://registry.npmjs.org/@mkbabb/pencil-boil/-/pencil-boil-0.10.1.tgz`, integrity `sha512-UYfvIdVhm4P69EmNbjua05PSSMRjbufW9U4NA6VAjywhxi/vb1Q1fCPKrHH2bzoVL/nLfiwHVEumfa77nEjt8Q==`
- Installed on disk: `node_modules/@mkbabb/pencil-boil/package.json` → `0.10.1`

Four-way agreement (source · registry · manifest · lockfile · installed tree).

### CHANGELOG truth — TRUE

`CHANGELOG.md` heads at `## 0.10.1 — 2026-07-31 (the stale-ink patch)` (line 3) and `## 0.10.0 — 2026-07-31 (the capture-intrinsic truth-fix)` (line 19). The full ladder is unbroken back to 0.3.0:

```
3:   ## 0.10.1 — 2026-07-31   19:  ## 0.10.0 — 2026-07-31   37:  ## 0.9.2 — 2026-07-13
58:  ## 0.9.1 — 2026-07-13    78:  ## 0.9.0 — 2026-07-12    124: ## 0.8.1 — 2026-07-11
135: ## 0.8.0 — 2026-07-11    160: ## 0.7.0 — 2026-07-10    191: ## 0.6.0 — 2026-07-06
205: ## 0.5.1 — 2026-07-06    214: ## 0.5.0 — 2026-07-06    245: ## 0.4.1 — 2026-06-10
255: ## 0.4.0 — 2026-06-10    265: ## 0.3.0 — 2026-05-28
```

Head entry matches `package.json` version, matches the npm `latest`, and the 0.10.1 body's claim (contrast 1.02:1 stale-ink; `proofs/raster-theme-flip.proof.ts` is the gate) is a same-commit gate reference — no orphan claim. No missing entries, no entry ahead of the published version.

### FINDING 1-A — the 0.10.x releases are UNTAGGED (both local and remote)

Local: `git tag --sort=-creatordate | head -8` → newest is `v0.9.2`, then v0.9.1, v0.9.0, v0.8.1, v0.8.0, v0.7.0, v0.6.0, v0.5.1.

Remote: `git ls-remote --tags origin | tail -6` →

```
106a5a26…  refs/tags/v0.7.0
8123f472…  refs/tags/v0.8.0
da51edbf…  refs/tags/v0.8.1
e792de6e…  refs/tags/v0.9.0
83de5eb5…  refs/tags/v0.9.1
3f72d17f…  refs/tags/v0.9.2
```

Every release from 0.3.0 through 0.9.2 carries a `vX.Y.Z` tag — `v0.9.2` = `3f72d17f`, exactly the 0.9.2 release commit. The convention holds for 13 releases and then stops. **0.10.0 (`08f4f5e`) and 0.10.1 (`763f1c0`) shipped to npm with no tag on either side.** The npm tarball is now the only immutable pointer to those two commits; a `git checkout v0.10.1` — the ordinary way to reproduce a published build — resolves to nothing. Severity: low-impact, high-recurrence-class (the pencil-boil bisect story for the whole 0.10 raster line is degraded).

Fix (owner action, not taken here — repo is read-only for this audit):
`git tag v0.10.0 08f4f5e && git tag v0.10.1 763f1c0 && git push origin v0.10.0 v0.10.1`

### FINDING 1-B — README's published-artifacts table pins pencil-boil at ^0.9.2

`/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/README.md:127`:

```
| `@mkbabb/pencil-boil` | npm (frontend dep) | ^0.9.2 |
```

Actual: `web/frontend/package.json:36` = `^0.10.1`; npm latest = `0.10.1`. The README row is **two minors stale**. It was true at the T4 close (2026-07-15, when 0.9.2 was current) and was not swept when the T4-P1 Safari patch published 0.10.0 + 0.10.1 on 2026-07-31 — the same commit window that produced `32198688` (WGATE §9) and `fb15253d` (Safari curve). This is the "ruling lands with its enforcing config same-commit" rule from `lessons-from-t2-t4.md` inverted: the dependency bump landed, its documentation row did not.

Note the adjacent row is *correct* and deliberately so — see Row 4.

---

## Row 2 — bbnf-lang's vendored csp-solver

### The script is not in csc411

The task named the script as csc411-adjacent; it is not present in the csc411 tree (`find . -name sync-csp-solver-vendor.sh` → no hits). Canonical location:

```
/Users/mkbabb/Programming/bbnf-lang/scripts/sync-csp-solver-vendor.sh
```

(31 further copies exist under `/Users/mkbabb/Programming/bbnf-lang/.claude/worktrees/*/scripts/` — agent worktrees, not authorities. The canonical `scripts/` copy was the one run.)

### Check run — PASS

```
$ cd /Users/mkbabb/Programming/bbnf-lang && bash scripts/sync-csp-solver-vendor.sh --check
OK: crates/csp-solver/{src,data} match csc411@02965a56cfe78f0c498f34095a9f88e1ff69974d byte-for-byte.
EXIT=0
```

`--update` was **not** run. bbnf-lang was **not** pushed (standing never-push order, restated in the script's own header at lines 44–45: "NEVER pushes: csc411's origin is a stale public crate identity; bbnf-lang's origin is under a standing never-push order. This script only READS the csc411 sibling").

bbnf-lang HEAD: `af15f63e0` (2026-07-18, "handoff(sk-v25): THE RE-ADJUDICATION packet set…").

### What the OK actually asserts — read this before citing it

`do_check()` (script lines 136–162) reads a 40-hex **pin** out of the vendored crate's `Cargo.toml` description, `git archive`s that rev from the csc411 sibling, and `diff -rq`s it against `crates/csp-solver/{src,data}`. It asserts **byte-fidelity to the pin**, not currency with csc411 HEAD. The pin lives at `/Users/mkbabb/Programming/bbnf-lang/crates/csp-solver/Cargo.toml:5`:

> "Source-of-truth tracked at csc411 commit `02965a56cfe78f0c498f34095a9f88e1ff69974d`…"

### Pin staleness — quantified, and by design

```
$ git -C csc411 log -1 --format='%h %ad %s' --date=short 02965a56…
  02965a56 2026-07-10 T3-W6: engine perf — flat CSR, the Vec-indexed cache, and a spine that guards itself
$ git -C csc411 rev-list --count 02965a56…..HEAD
  105
$ git -C csc411 diff --stat 02965a56…..HEAD -- csp-solver/src csp-solver/data | tail -1
  35 files changed, 2328 insertions(+), 62 deletions(-)
```

The pin predates all of Tranche 4. The vendored copy therefore carries **none** of the five-family surface (`PuzzleClass`, `generate_by_digging`, `puzzles::{thermo,killer,kenken}`, `CageSum`/`CageProduct`) that csc411 shipped at 0.6.0. Consistently, the vendored crate declares `version = "0.1.0"` (`bbnf-lang/crates/csp-solver/Cargo.toml:3`) against canonical `0.6.0`.

**This is not a failure.** bbnf-lang vendors csp-solver as its *bench substrate* (the crate description: "bench home of bbnf-lang"), and the script's contract is fidelity-to-pin plus `--verify` (the enforced-compile gate across both cfg branches, script lines 205–258) — deliberately decoupled from csc411's release cadence so a mid-edit csc411 lane can't break bbnf's build. The pin is a chosen rev, not a missed sync. Recorded here so no downstream reader mistakes `OK:` for "bbnf-lang is on 0.6.0".

**Advisory (owner election, not a defect)**: if bbnf's bench corpus should exercise the five-family surface, that is a deliberate `--update <release-rev>` decision — out of scope for a read-only audit, and it must never be paired with a push.

### Incidental — bbnf-lang working tree is dirty and 71 ahead

```
$ git -C /Users/mkbabb/Programming/bbnf-lang status --porcelain=v1 -b | head -3
## master...origin/master [ahead 71]
 M .cargo/config.toml
 D .github/workflows/bench-iai.yml
```

Expected under the standing never-push order — noted so the state isn't mistaken for drift on a future pass. Nothing was pushed, staged, or reverted.

---

## Row 3 — morph excision residue

### Live dependencies — ZERO

- No `morph` entry in any Cargo manifest or in `Cargo.lock`. The only hit across `Cargo.toml`, `csp-solver/Cargo.toml`, `csp-solver/wasm/Cargo.toml`, `Cargo.lock`, `web/frontend/package.json`, `web/frontend/package-lock.json` is a comment — `Cargo.toml:4`: "wasm crate, csp-solver-wasm) has no morph dependency and stays."
- No `@mkbabb/morph` in the frontend manifest or lockfile.
- No morph crate directory: `ls -d */morph* morph* csp-solver/morph*` → no matches.

### Non-doc references — 30 total, all historical prose or unrelated word-sense

Grep over the repo excluding `node_modules/`, `target/`, `dist/`, `.git/`, `__pycache__/`, `docs/`:

| Location | Nature |
|---|---|
| `Cargo.toml:2-4` | Excision provenance comment (points at the tag) |
| `csp-solver/CHANGELOG.md:8-14, 129, 198-211` | Historical release record; the excision preamble |
| `csp-solver/README.md:18-21` | Excision provenance prose |
| `.github/workflows/ci.yml:4-6, 295` | Comments explaining the two-member workspace |
| `csp-solver/tests/cost_finite.rs:37` | Doc comment: "drives the morph pipeline COP" — a COP-shape reference, no dependency |
| `web/frontend/src/pencil/glyph/glyphPaths.ts:8`, `glyphAnimations.ts:8, 81, 85, 134` | **Unrelated word-sense** — "variant-morph", "mid-morph", "wiggle/morph" describe glyph interpolation. Nothing to do with the excised package. |

121 files under `docs/` mention morph — historical record, explicitly in scope for exclusion.

### The mkbabb/morph pin — VERIFIED TRUE

`csp-solver/CHANGELOG.md:9-10` claims the excision landed at commit `4568dc7e`, tag `pre-morph-excision`. Verified against the repo:

```
$ git tag -l 'pre-morph-excision'   →  pre-morph-excision
$ git rev-parse --short pre-morph-excision  →  4568dc7e
```

The tag exists and resolves to exactly the SHA the CHANGELOG names. `csp-solver/README.md:18-21` repeats the same pin consistently. **Row CLEAN** — the excision is complete, and its documented pin is not a claim-without-evidence.

---

## Row 4 — published-registry truth vs source manifests

| Artifact | Registry | Registry version | Source manifest | Verdict |
|---|---|---|---|---|
| `@mkbabb/pencil-boil` | npm | `0.10.1` (`dist-tags.latest`) | `pencil-boil/package.json` `0.10.1` | **MATCH** |
| `@mkbabb/csp-solver-wasm` | npm | `0.2.0` (2026-07-06T21:51:58Z) | `csp-solver/wasm/Cargo.toml:3` = `0.6.0`; built `pkg/package.json` = `0.6.0` | **LAG — declared & intentional** |
| `csp-solver` | crates.io | `0.6.0` (2026-07-15T23:17:02Z, live, unyanked) | `csp-solver/Cargo.toml:3` = `0.6.0` | **MATCH** |
| `csp-solver-wasm` | crates.io | **not published** (sparse index → HTTP 404) | `0.6.0` | Not a publish target |
| `csp_solver` (wheel) | PyPI | name occupied by a **third party** | `csp-solver/pyproject.toml:7` = `0.6.0` | **UNPUBLISHED — latent name conflict** |

### crates.io — full version ladder, no yanks

```
$ curl -s https://index.crates.io/cs/p-/csp-solver
versions: ['0.1.0','0.2.0','0.3.0','0.4.0','0.5.0','0.6.0']  yanked: []
$ curl -s https://crates.io/api/v1/crates/csp-solver/versions
0.6.0  2026-07-15T23:17:02.543139Z  live
0.5.0  2026-07-13T09:49:21.730333Z  live
0.4.0  2026-07-13T02:05:26.024526Z  live
```

The 0.6.0 election recorded as an open owner row in project memory is **closed**: published 2026-07-15, matching commit `c49a73ca` ("0.6.0 true-up: registry stamps follow the publish, wasm rides lockstep"). `README.md:126` states "0.6.0 (published; the first release carrying all five puzzle families)" — true against the index. `csp-solver/CHANGELOG.md` §0.6.0 explains *why* 0.5.0's tarball predates the five-family surface; that reconciliation is honest and matches the two publish timestamps above (0.5.0 on 07-13, the puzzle-class work landing after).

### The wasm npm lag is DISCLOSED, not drift

`README.md:126` — "`@mkbabb/csp-solver-wasm` | npm | 0.2.0 on npm; source is 0.6.0. The SPA file-links the lean build, not the registry package."
`csp-solver/CHANGELOG.md` §0.6.0 — "The wasm npm tarball still stays at `0.2.0`—the frontend file-links the lean build."
`.github/workflows/ci.yml:473-475` — "consuming the published full-featured registry package would regress the lean band."

Three independent surfaces state the same fact with the same reason. A four-minor registry lag that is *declared everywhere it matters* is not a truth defect. Also note the CHANGELOG's "The Python wheel version joins at `0.6.0`" is a **version-alignment** statement (pyproject 0.6.0, up from the 0.4.0 lag), not a publish claim — and the README's published-artifacts table correctly carries no PyPI row. No false claim exists.

### FINDING 4-A (latent, unrecorded) — the PyPI name belongs to someone else

`csp-solver/pyproject.toml:5-7` declares `name = "csp_solver"`, version `0.6.0`, maturin backend. PyPI normalizes `csp_solver` and `csp-solver` to the same project. That project is live and **third-party-owned**:

```
$ curl -s https://pypi.org/pypi/csp-solver/json
name     CSP-Solver
version  0.1.2
author   'Sanskar Mani'  'mani.1@iitj.ac.in'
home     https://github.com/LezendarySandwich/Generic-CSP-Solver
summary  Library to solve Constraint satisfation problems
releases ['0.1', '0.1.1', '0.1.2']
$ curl -s -o /dev/null -w '%{http_code}' https://pypi.org/pypi/csp_solver/json   → 200 (same project)
$ curl -s -o /dev/null -w '%{http_code}' https://pypi.org/pypi/mkbabb-csp-solver/json → 404
```

Consequence: a future `maturin publish` under the current name **cannot succeed** — it will 403 on name ownership. Nothing in the repo records this; the owner row reads as "the wheel is unpublished", which understates it. Whenever the wheel is elected for publication it needs a rename (`mkbabb-csp-solver` is free, per the 404 above) or a PyPI name-transfer request. Flagged now because discovering it at publish time is a wasted release window, and because the version bump to 0.6.0 already implies publish intent.

No secrets, tokens, or credentials were read or printed at any registry surface.

---

## Row 5 — glass-ui guardrail (standing: ZERO)

### VERIFIED ZERO. The guardrail holds.

Import-form search over the frontend source:

```
$ grep -rn "from '@mkbabb/glass-ui\|from \"@mkbabb/glass-ui\|require('@mkbabb/glass-ui" src/
(no output — exit 1)
```

Dependency-graph search:

```
$ grep -rn -i 'glass' web/frontend/package.json web/frontend/package-lock.json
(no output)
$ ls -l web/frontend/node_modules/@mkbabb/
csp-solver-wasm -> ../../../../csp-solver/wasm/pkg   (symlink)
pencil-boil                                          (directory)
```

Zero import statements, zero manifest entry, zero lockfile entry, zero installed package. `@mkbabb/glass-ui` is absent from the runtime graph in every sense.

### The 220 textual hits are prose, docs, and one honest vendoring

Repo-wide, case-insensitive, excluding `node_modules/`, `target/`, `dist/`, `.git/`, `__pycache__/`: 220 lines. Every one is a comment, a doc paragraph, or a provenance header:

- `docs/precepts/design-idioms.md`, `docs/precepts/tunable-anim.md`, `docs/precepts/cross-repo-dev-resolution.md` — precept documents that name glass-ui as **owner** of an idiom (`design-idioms.md:3`: "**Owner**: glass-ui (`@mkbabb/glass-ui`)"). Reference, not consumption.
- `web/frontend/src/assets/index.css:544`, `web/frontend/src/pencil/sheet/AnswerKeyLaminate.vue:11` — comments describing an aesthetic relation ("in-family with glass-ui's own blur-0 plate").
- `web/frontend/src/assets/typography.css:1-14` — a **vendored copy with a declared provenance header**:

  > `VENDORED from @mkbabb/glass-ui@4.2.0:` … `WHY vendored, not imported: glass-ui's package exports allowlist has no styles/typography subpath, and pulling the whole ./styles bundle would drag the Plus Jakarta text register + the 13-stop jewel palette + glass-fx into a crayon-and-graphite world (soul-gate hazard). The √φ scale rungs carry NO font-family by construction…`

  This is the guardrail working exactly as intended: the numbers were copied, the dependency was not taken, and the reason is recorded at the copy site. `typography.css:239, 248` further mark which registers are pencil-local overrides rather than glass-ui-vendored — the port boundary is annotated line by line.

**Row CLEAN.** No action.

---

## Row 6 — file:-link discipline and lockfile agreement

### Inventory: exactly one file: link

`web/frontend/package.json` dependencies (lines 35–36 carry the two `@mkbabb` entries):

```
35:    "@mkbabb/csp-solver-wasm": "file:../../csp-solver/wasm/pkg",
36:    "@mkbabb/pencil-boil": "^0.10.1",
```

A programmatic sweep of `dependencies` + `devDependencies` + `optionalDependencies` for any `file:` specifier returns **one** result — `@mkbabb/csp-solver-wasm`. Everything else (`@tailwindcss/vite ^4.3.2`, `@vueuse/core ^14.3.0`, `tailwindcss ^4.3.2`, `vue ^3.5.39`, `@mkbabb/pencil-boil ^0.10.1`) is registry-resolved.

### Lockfile agreement — coherent on all three entries

`package-lock.json` (`lockfileVersion: 3`):

```
''                                     → name csp-solver-frontend, version 0.1.0, license MIT
'../../csp-solver/wasm/pkg'            → name @mkbabb/csp-solver-wasm, version 0.6.0, license MIT
'node_modules/@mkbabb/csp-solver-wasm' → resolved ../../csp-solver/wasm/pkg, link: true
'node_modules/@mkbabb/pencil-boil'     → version 0.10.1, resolved registry.npmjs.org/…-0.10.1.tgz, integrity sha512-UYfvId…
```

The link target's own entry records `version 0.6.0`, which matches both `csp-solver/wasm/Cargo.toml:3` and the built `csp-solver/wasm/pkg/package.json` (`@mkbabb/csp-solver-wasm 0.6.0`, files `[csp_solver_wasm_bg.wasm, csp_solver_wasm.js, csp_solver_wasm.d.ts]` — the three-file lean emission). The registry dep's semver range `^0.10.1` is satisfied by the locked `0.10.1`. No phantom entries, no version straddle.

### Empirical gate — PASS

```
$ cd web/frontend && npm ci --dry-run
up to date in 292ms
92 packages are looking for funding
$ npm -v → 11.12.1     $ node -v → v26.0.0
```

Clean resolution, no `EUSAGE`, on npm 11 (npm 10 mis-resolves this lockfile — the standing constraint). `--dry-run` writes nothing; `node_modules` was not mutated.

### Can the June divergence recur? — NO, and here is the mechanism

The disease class: `csp-solver/wasm/pkg/` is **gitignored** —

```
.gitignore:73-74
# wasm-pack build outputs (rebuilt at release by CI)
csp-solver/wasm/pkg/
$ git ls-files csp-solver/wasm/pkg | wc -l  →  0
```

so a fresh clone has no link target, and a naive `npm ci` would fail on an unresolvable `file:` path. Three structural guards make that non-recurrent:

1. **CI materializes the target before npm touches it.** `.github/workflows/ci.yml:481-487` — the `frontend` job declares `needs: [build-lean-wasm]` and its *first* step after checkout is `actions/download-artifact@v4` with `name: lean-wasm-pkg`, `path: csp-solver/wasm/pkg`. The link target exists before Node is even set up. The header comment (lines 471-477) states the intent: the lane downloads rather than rebuilds, and is Node-only by design.
2. **The lockfile-integrity gate runs before the install.** `ci.yml:499-501` — `npm ci --dry-run` in `web/frontend` as its own named step ("lockfile integrity gate"), *ahead of* the real `npm ci` at lines 502-504. Any lockfile/manifest divergence reds the lane at the dry-run, before install side effects. The step comment records the provenance: "EUSAGE was P0, Pass-2 prototype 8" — the June failure is the reason this step exists.
3. **npm version is pinned above the mis-resolving floor.** `ci.yml` "Pin npm >=11" runs `npm install -g npm@^11` even though Node 24 already ships npm 11.x, with the comment "older Node's npm 10 mis-resolves the lockfile."

Guard (1) removes the precondition, guard (2) detects divergence before it can install, guard (3) removes the resolver-version variable. The failure mode is closed at the config layer, in the same file that runs it — the `lessons-from-t2-t4.md` "trap→config on 2nd bite" rule, satisfied. **Row CLEAN.**

---

## Findings ledger

| ID | Row | Severity | Finding | Evidence |
|---|---|---|---|---|
| 1-A | 1 | Medium | pencil-boil 0.10.0 + 0.10.1 published to npm with no git tag, local or remote; breaks a 13-release convention | `git ls-remote --tags` newest = `v0.9.2` (`3f72d17f`); releases at `08f4f5e`, `763f1c0` |
| 1-B | 1 | Medium | `README.md:127` pins `@mkbabb/pencil-boil` at `^0.9.2`; actual is `^0.10.1` | `README.md:127` vs `web/frontend/package.json:36` |
| 4-A | 4 | Low (latent) | PyPI `csp_solver` is owned by a third party (Sanskar Mani, 0.1.2); the local wheel at `0.6.0` cannot publish under that name | pypi.org/pypi/csp-solver/json vs `csp-solver/pyproject.toml:5-7` |
| 2-N | 2 | Note | Vendored pin `02965a56` is 105 commits / 2328 insertions behind csc411 HEAD and predates T4; by design, but `OK:` must not be read as "current" | `git rev-list --count`; `bbnf-lang/crates/csp-solver/Cargo.toml:3,5` |
| 2-I | 2 | Note | bbnf-lang tree dirty, `[ahead 71]` — expected under the never-push order; not drift | `git status -b` in bbnf-lang |

Neither 1-A nor 1-B nor 4-A was acted on: this audit is read-only by mandate.

## Commands run (all read-only)

`git log/status/tag/rev-parse/rev-list/diff --stat/ls-remote/ls-files/check-ignore` (csc411, pencil-boil, bbnf-lang) · `bash scripts/sync-csp-solver-vendor.sh --check` · `npm view` (3×) · `npm ci --dry-run` · `curl` against index.crates.io, crates.io API, pypi.org · `grep`/`find`/`sed`/`python3 -c` reads.

Not run: `--update`, any `git push`/`commit`/`tag`, any publish, any deploy, any write to a source file or config.

ROW-COMPLETE
