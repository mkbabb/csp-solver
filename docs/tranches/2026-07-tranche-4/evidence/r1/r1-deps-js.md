# r1-deps-js — JS/TS dependency currency + modern-facility audit

Subjects: `web/frontend/` and `/Users/mkbabb/Programming/pencil-boil`.
Toolchain in play: Node v26.0.0, npm 11.12.1. Registry-latest at audit time (npm view):
typescript **7.0.2**, vite **8.1.4**, eslint **10.7.0**, vue **3.5.39**. NO upgrades performed.

---

## F1 — pencil-boil ships a LIVE moderate CVE (postcss XSS), kept alive by a stale vue pin — P1
`family_hint: dep-transitive-cve`

`/Users/mkbabb/Programming/pencil-boil/package.json:38` pins `"vue": "^5.7.0"`… no —
`devDependencies.vue: "^3.5.0"`, which resolves to **vue 3.5.29** (installed), whose
`@vue/compiler-sfc@3.5.29 → postcss@8.5.8` trips GHSA-qx2v-qp2m-jg93 (PostCSS XSS via
unescaped `</style>`, fixed in postcss ≥8.5.10).

Probe (rerunnable):
```
cd /Users/mkbabb/Programming/pencil-boil && npm audit
#   postcss <8.5.10  moderate  1 vulnerability
cd /Users/mkbabb/Programming/pencil-boil && npm ls postcss
#   vue@3.5.29 → @vue/compiler-sfc@3.5.29 → postcss@8.5.8
```
The fix is already available in-registry: vue **3.5.39** is latest (`npm outdated` flags
`vue 3.5.29 → 3.5.39`), and its compiler-sfc pulls postcss ≥8.5.10. The vuln persists purely
because the resolved `vue` is 10 patch releases stale. Cost: any downstream that lints/builds
pencil-boil's SFC path inherits the advisory. `npm audit fix` or a `npm i` refresh clears it.

Note: frontend itself reports `found 0 vulnerabilities` (`cd web/frontend && npm audit`) — it
resolves vue 3.5.39 already. The exposure is pencil-boil's lockfile alone.

---

## F2 — TypeScript is a full major behind (frontend) / TWO majors behind (pencil-boil) — P2
`family_hint: dep-major-lag`

- `web/frontend/package.json:34` `"typescript": "~6.0.3"` → installed **6.0.3**, latest **7.0.2**.
  `~6.0.3` is a caret-free tilde, so it will NEVER float to 7.x — the major is pinned out.
- `pencil-boil/package.json:37` `"typescript": "^5.7.0"` → installed **5.9.3**, latest **7.0.2**
  = **two majors behind**. pencil-boil's `npm run check` (`tsc --noEmit`, package.json:14) and
  its `proof` suite run under TS 5.9, while the frontend that consumes pencil-boil's raw TS
  source (`main/module/types: ./src/index.ts`) typechecks it under TS 6.0 — a version skew
  between author-side and consumer-side type checking of the same files.

Probe:
```
cd web/frontend && npm outdated        # typescript 6.0.3 → latest 7.0.2
cd /Users/mkbabb/Programming/pencil-boil && npm outdated   # typescript 5.9.3 → 7.0.2
```
What the major buys (TS 7): the Go-port native compiler (~10x typecheck throughput — directly
relevant to `vue-tsc -b` in the `build` script and the CI typecheck lane), and 7.x diagnostic
/isolatedDeclarations refinements. Risk of the bump: TS majors routinely tighten inference;
`vue-tsc@3.3.7` + `typescript-eslint@8.63.0` must be co-validated against a `typescript@7` peer
before landing. Report-only; no bump performed.

---

## F3 — Neither package declares `engines` or `packageManager` — the npm≥11 / Node contract is unenforced — P2
`family_hint: unpinned-toolchain`

```
cd web/frontend && node -e "const p=require('./package.json');console.log(p.engines,p.packageManager)"
#   undefined undefined
cd /Users/mkbabb/Programming/pencil-boil && node -e "..."   # undefined undefined
```
Project memory states "npm ≥11 (frontend; npm 10 mis-resolves the lockfile)" and "Node… host"
constraints, and the deploy record blames an npx-packument OOM tied to tooling version. Yet
`web/frontend/package.json` (whole file) carries **no `engines` block and no `packageManager`
field**. A fresh clone on npm 10 / an older Node hits exactly the mis-resolution the memory
warns about, with nothing in the manifest to gate it (`npm install` would only warn, not fail,
even if `engines` existed — but `packageManager` + Corepack would pin it hard). The documented
requirement lives only in a memory ledger, not in the tree. Cost: reproducibility gap; the
"npm 10 mis-resolves the lockfile" trap is undefended at the manifest layer.

---

## F4 — Minor-version lags (low risk, banked for completeness) — P3
`family_hint: dep-minor-lag`

| pkg | where | current | latest | file:line |
|---|---|---|---|---|
| eslint | frontend | 10.6.0 | 10.7.0 | package.json:24 (`^10.6.0`) — floats on next install |
| vue | pencil-boil | 3.5.29 | 3.5.39 | package.json:38 (`^3.5.0`) — see F1, security-relevant |

Probe: `npm outdated` in each dir. Both are semver-caret-floatable; a plain `npm update`
clears them. eslint's is cosmetic; vue's is the F1 CVE lever.

---

## F5 — Zero `defineModel` adoption despite hand-rolled `prop + emit("update:…")` pairs — P3
`family_hint: modern-facility-gap`

`grep -rn "defineModel" src` → **0 hits**. Meanwhile the ControlPanels hand-roll the exact
prop/emit pair `defineModel` was built to collapse (Vue 3.4+, stable):

- `src/games/sudoku/ControlPanel/ControlPanel.vue:48` `props: { size, difficulty, … }` +
  `:66` `emit("update:size")` / `emit("update:difficulty")` (fired :174, :179).
- `src/games/futoshiki/ControlPanel/ControlPanel.vue:53` `boardSize` prop + `:60`
  `emit("update:boardSize")` (fired :156).

Each is a textbook `const size = defineModel<number>('size')` candidate — the manual
`props`+`defineEmits`+wrapper-write triple reduces to one line. Not a defect; a facility the
code predates. Also absent by scan: **generic components** (`grep -rln "generic="` → 0) and
**Vapor mode** (`grep -rn "vapor" src vite.config.ts` → 0; `@vitejs/plugin-vue@6.0.7` present
but no `features.vapor` wiring). Vapor readiness is a forward-looking note only — the app is
option-API-free (`defineProps<>` used in 31 sites) so it's a plausible future target, not a gap.

---

## F6 — knip: unused exports/types (dead surface) — P3
`family_hint: dead-export`

`cd web/frontend && npm run lint:knip`:
- Unused exports (2): `DEFAULT_BOIL_CONFIG` (src/pencil/config/pencilConfig.ts:183),
  `pickVariantIndex` (src/pencil/glyph/glyphRegistry.ts:35).
- Unused exported types (7): `InitSource` ×2 (futoshiki/sudoku useUrlState),
  `BoardSize` (futoshiki/types.ts:31), `WobbleConfig`/`MultiPassConfig`/`TextureConfig`
  (pencilConfig.ts:69/83/90), `DrawInPreset` (pencilConfig.ts:341).

Cost: minor — exported dead code the tree-shaker can't fully drop and that widens the public
surface of `pencil/config`. knip finds **no unused *dependencies*** (deps/devDeps are all
referenced), so the manifest is otherwise clean.

---

## F7 — Stale in-tree comment: the "W12 will swap the file: link" retirement never happened — P3
`family_hint: doc-stale-comment`

`web/frontend/vite.config.ts` `server.fs.allow` comment: *"Retire this entry when W12 swaps
the `file:` link for the published registry package (then the pkg lives under node_modules
inside root)."* W12 shipped (memory: tranche closed 2026-07-12), yet
`package.json:15` still reads `"@mkbabb/csp-solver-wasm": "file:../../csp-solver/wasm/pkg"`
and the `fs.allow` escape hatch is still load-bearing. The comment describes a future that the
record says already passed. Per memory the `file:` link is intentional (Option-A, owner
self-publishes), so the *link* isn't the defect — the **comment is a stale promise**. `file:`
deps are also invisible to `npm outdated`/`npm audit`, so the wasm package's currency is
untracked by any probe in this lane (noted, not actionable here).

---

## Clean signals (banked, not findings)
- `web/frontend`: `npm audit` → 0 vulnerabilities; knip → 0 unused deps.
- Vite is current-major (8.1.4 = latest), `@tailwindcss/vite`+`tailwindcss` on matched 4.3.2,
  Playwright 1.61.1, wrangler 4.110.0 (matches the pinned deploy record) — all at/near latest.
