# r1-config-census — config contrivance + superfluity

Lens: inventory every config/dot file across the app repo and pencil-boil; find what is
superfluous, duplicative, unenforced, dead, or lying. The owner names `knip.json` as the
exemplar of the class ("is there any other contrivance or superfluity?"). Answer: yes —
pencil-boil's changesets rig and the frontend's whole prettier/eslint gate story.

## Config inventory (git-tracked, non-evidence)

App repo `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion`:
- `.gitignore`, `.gitmodules` (submodule `docs/precepts`), `.env.example`
- `.github/workflows/ci.yml` (9 jobs / 10 lanes)
- `rust-toolchain.toml`, `Cargo.toml`, `csp-solver/Cargo.toml`, `csp-solver/wasm/Cargo.toml`
- `csp-solver/pyproject.toml`, `csp-solver/tests-py/pyproject.toml`
- `web/frontend/`: `package.json`, `eslint.config.js`, `knip.json`, `tsconfig.json`,
  `vite.config.ts`, `playwright.config.ts`
- NO tailwind.config / postcss.config (correct — Tailwind v4 via `@tailwindcss/vite`, CSS-config)
- NO wrangler.toml (deploy flags are inline in `package.json:17`); `web/frontend/.wrangler/tmp` is
  an empty untracked scratch dir (harmless)

pencil-boil `/Users/mkbabb/Programming/pencil-boil`:
- `package.json`, `tsconfig.json`, `.gitignore`
- `.changeset/config.json` + `.changeset/README.md`
- `.github/workflows/{ci.yml,release.yml}`

Each config below is either load-bearing (noted) or carries a finding.

---

## P1 — the lint hole / global prettier shadow (the chronic, anchored)

`web/frontend/package.json:11` — `"lint": "prettier --write src/"`.

- There is NO prettier config anywhere in the repo (`find … -iname .prettierrc* -o -iname
  prettier.config*` → empty; no `"prettier"` key in package.json). Confirmed.
- The machine carries a global `~/.prettierrc`:
  ```json
  { "printWidth": 88, "useTabs": false, "tabWidth": 4 }
  ```
- Repo source is authored at **2-space** indent (see `eslint.config.js`, `vite.config.ts`).
  Running bare `npm run lint` resolves prettier's config upward to the home dir and **rewrites
  the entire `src/` tree to 4-space indent** — a destructive, silent reformat driven by a file
  outside the repo. This is the K-class chronic the audit-context flags ("never run
  `npm run lint`").
- Second effect: `prettier-plugin-tailwindcss` (the class-sorter) is installed
  (`package.json:37`) but prettier 3 does not auto-load plugins without a config `plugins`
  entry — so even the intended class-sorting never runs. The script's name promises
  formatting the tree; it delivers a home-dir-dependent rewrite with no class sort.

Probe (non-destructive — shows the shadow prettier would apply, writes nothing):
```
cd web/frontend
npx prettier --find-config-path src/main.ts        # → (no repo config found)
cat ~/.prettierrc                                   # tabWidth:4  ≠ repo's 2-space
npx prettier --check 'src/**/*.{ts,vue}' | head     # reports the whole tree as "would change"
```
family_hint: `lint-config-shadow`

---

## P2 — eslint boundary config is never gated by CI (unenforced 194-line contrivance)

`web/frontend/eslint.config.js` is 194 lines of colocation-edict boundary rules
(pencil↮games, sudoku↮futoshiki, shared-floor, 3-level depth). `package.json:12` wires
`"lint:eslint": "eslint ."`. The config loads and runs clean:
```
cd web/frontend && npm run lint:eslint   # exits 0, no output
```
But `.github/workflows/ci.yml` never invokes it. The frontend lane (ci.yml:371-420) runs only
`vue-tsc --noEmit` + `knip`; the job named `lint:` (ci.yml:62-82) is **Rust fmt+clippy**, not
eslint. So every boundary rule the colocation edict "mechanically enforces" is enforced by
nothing in CI — a PR that reaches from `src/pencil/**` into `@games/**` passes all 9 lanes.
The rules are real (they load), but the gate is absent. per-mechanism green over gestalt gap.

Probe:
```
grep -n "eslint\|lint:eslint\|npm run lint" .github/workflows/ci.yml   # only ci.yml:62 (Rust job)
```
family_hint: `unenforced-config-gate`

---

## P2 — dead `prettier-plugin-tailwindcss` masked by the knip ignore list

`knip.json:6` — `"ignoreDependencies": ["prettier-plugin-tailwindcss"]`.

The plugin is declared at `package.json:37` and referenced **nowhere** (no prettier config to
load it; grep finds it only in package.json + the knip ignore). Knip runs `dependencies:
"error"` (knip.json:12) and would flag it as an unused dependency — the `ignoreDependencies`
entry exists solely to suppress that flag. So the knip gate is green over a genuinely dead dep;
the ignore line is the mask. This is downstream of the P1 lint hole: with no prettier config,
the plugin can never load, so it is pure dead weight the census must not let hide behind knip.

Probe:
```
cd web/frontend
grep -rn "prettier-plugin-tailwindcss" . --include=*.json --include=*.js | grep -v node_modules
# → package.json:37 (declared) + knip.json:6 (ignored) only — zero load sites
```
family_hint: `lint-config-shadow`

---

## P2 — pencil-boil changesets rig is a full contrivance (config + lying CONTRIBUTING)

`.changeset/config.json` + `.changeset/README.md` configure a changesets release flow, and
`CONTRIBUTING.md:33-41` documents it in prose:
> "Version bumps run through **changesets**… On merge to the default branch, the changesets
> workflow batches accepted changesets into a `Version Packages` PR; merging that PR…"

None of it is wired:
- `changesets` / `@changesets/cli` is **not** in `package.json` devDependencies (only
  `typescript` + `vue`).
- Neither workflow references changesets — `grep -rn changeset .github/` → nothing.
  `.github/workflows/release.yml` publishes via plain `npm publish --access public` on a
  `v*.*.*` tag (release.yml:23-33). There is no `changesets/action`, no "Version Packages" PR.
- Versions and `CHANGELOG.md` are hand-committed: `git log CHANGELOG.md` shows manual
  `feat(scheduler): 0.8.1…`, `chore(release): 0.6.0` commits, and CHANGELOG.md:148 still claims
  entries come "from changesets".

So `.changeset/config.json` is a superfluous config nothing consumes, and CONTRIBUTING.md:33-41
describes a workflow that does not exist. Exactly the "other contrivance/superfluity" the owner
asked to surface next to knip.

Probe:
```
cd /Users/mkbabb/Programming/pencil-boil
grep -rn changeset .github/                 # → (nothing)
grep -n changeset package.json              # → (nothing; not a dep)
sed -n '15,35p' .github/workflows/release.yml  # plain npm publish on tag
```
family_hint: `unwired-tooling-contrivance`

---

## P3 — stale `.gitignore` line for the excised morph crate

`.gitignore:60` — `csp-solver/wasm-morph/pkg/`. wasm-morph was excised to
github.com/mkbabb/morph at the W12 window (ci.yml:5-6 confirms). The directory is absent
(`ls csp-solver/wasm-morph` → not found). Dead ignore line — excision residue.
Probe: `ls -d csp-solver/wasm-morph` → absent.
family_hint: `excision-residue`

## P3 — pencil-boil tsconfig emits nothing yet sets declaration options

`/Users/mkbabb/Programming/pencil-boil/tsconfig.json` sets `"declaration": true` +
`"declarationMap": true`. The package ships raw TypeScript (`main/module/types` all
`./src/index.ts`, `files: ["src", …]`) with **no build step** — the only tsc invocation is
`"check": "tsc --noEmit"` (package.json), so no `.d.ts`/`.d.ts.map` is ever produced. Both
options are dead. Superfluity.
family_hint: `unwired-tooling-contrivance`

## P3 — `.mypy_cache/` absent from `.gitignore` and stale (Python 3.10)

`.gitignore` covers `__pycache__/`, `.venv/`, `*.tsbuildinfo`, etc. but not `.mypy_cache/`.
The dir is untracked (not committed — verified `git ls-files | grep .mypy_cache` → 0), so no
data leak, but it is uncovered clutter and its contents are a **Python 3.10** cache
(`.mypy_cache/3.10/…`) while the project pins 3.13 (ci.yml:146, rust-toolchain / pyproject).
Add `.mypy_cache/` to `.gitignore`.
family_hint: `gitignore-gap`

## P3 — `.env.example` is thin and contradicts the real `.env`

`.env.example` carries only `FRONTEND_PORT=9121`. The real `.env` uses `PYTHONPATH` and warns
"Ports managed by dev.sh (defaults: 9120/9121). Do NOT set PORT here." `FRONTEND_PORT` is not
consumed in any ts/js/json (only `scripts/dev.sh`). The example both omits the var the app
actually reads (PYTHONPATH) and hands a port the .env's own guidance says not to set.
family_hint: `doc-drift`

## P3 — CI carries stale "RED until W1" annotations from a closed campaign

`.github/workflows/ci.yml` comments describe lanes as broken pending fixes from the
grand-uplift W1: "clippy is RED until W1 fixes the 3 composition residuals" (ci.yml:60),
"RED until W1 fixes the src/py.rs E0063" (ci.yml:140, 183). That campaign closed and the
record claims CI green (memory: "CI 7/7 green"). The annotations are doc-meta-leak baked into
the live config — a reader can't tell which lanes are actually expected to fail.
family_hint: `doc-meta-leak`

---

## Load-bearing / clean (no finding)

- `vite.config.ts` — dense but every plugin is consumed (sudoku-templates codegen, head-hints
  preload, VitePWA). NOTE the HMR-pin caveat (vite.config.ts:268-281 / playwright.config.ts:9)
  is a real K46 footgun but it is documented and guarded by e2e global-setup — carried, not a
  new finding. One stale forward-reference: vite.config.ts:263-264 "Retire this entry when W12
  swaps the file: link for the published registry package" — W12 came and went and the `file:`
  link deliberately STAYS (ci.yml:368-370, memory), so the "retire when W12" note is stale but
  the code is correct; folded here rather than raised.
- `knip.json` — load-bearing (CI lane 8); its only smell is the masked dead dep above.
- `tsconfig.json` (frontend) — single non-composite config; `build` uses `vue-tsc -b` while CI
  uses `vue-tsc --noEmit`. `-b` on a non-composite root is tolerated by current vue-tsc; not
  reproduced as broken, so no finding.
- `rust-toolchain.toml`, Cargo/pyproject tomls, `.gitmodules` (submodule `docs/precepts`
  populated at 1f44742), pencil-boil `.gitignore` — clean.

## Probe bank (all rerunnable, non-destructive)
```
# P1 shadow
cd web/frontend && npx prettier --find-config-path src/main.ts; cat ~/.prettierrc
# P2 eslint ungated
grep -n "eslint\|lint:eslint" ../../.github/workflows/ci.yml
# P2 dead plugin
grep -rn prettier-plugin-tailwindcss . --include=*.json --include=*.js | grep -v node_modules
# P2 changesets contrivance
cd /Users/mkbabb/Programming/pencil-boil && grep -rn changeset .github/ package.json
# P3 morph residue
ls -d /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/csp-solver/wasm-morph
```
