# A19 — LIBRARY AUDIT (FE)

Scope: `web/frontend/package.json` at HEAD (master, tranche-2 landed). Imports census per dependency, pencil-boil 0.7.0 surface utilization, the keyframes.js re-adoption dependency-mass question (for F6), vite-plugin-pwa posture, platform-replaceable candidates. Every row cites file:line or a quoted `npm view`.

Method: `grep -rn "<pkg>" src/` for every dep; `npm view` for transitive dep mass; `du -sh node_modules/<pkg>` for installed footprint (note: ESM `sideEffects:false` deps tree-shake — installed size ≠ shipped size).

---

## 1. Imports census (runtime `dependencies`)

| Dep | Range | Import sites | Symbols consumed | Verdict |
|---|---|---|---|---|
| `vue` | ^3.5.39 | pervasive | framework | KEEP (core) |
| `@mkbabb/csp-solver-wasm` | file:../../csp-solver/wasm/pkg | 2 workers | solver ctors + `wasmUrl?url` | KEEP (core; the solver) |
| `@mkbabb/pencil-boil` | ^0.7.0 | 20 sites / 16 files | 21 of 33 value exports + 3 types | KEEP (high util; zero dep mass) |
| `tailwindcss` | ^4.3.2 | `assets/index.css:1` `@import 'tailwindcss'` | styling engine | KEEP (core) |
| `@tailwindcss/vite` | ^4.3.2 | `vite.config.ts:4,123` | Vite plugin (Lightning CSS) | KEEP (core) |
| `@vueuse/core` | ^14.3.0 | 2 sites | `useDark, useToggle, createGlobalState` (`composables/useTheme.ts:1`), `useResizeObserver` (`pencil/grid/HandDrawnOutline.vue:3`) | KEEP-thin (4 fns; platform-replaceable, see §4) |
| `@lucide/vue` | ^1.24.0 | 3 sites | `Eraser, Share2` (both ControlPanels) + `Wrench, X, Copy, RotateCcw` (FilterTuner, DEV-only) | KILL-candidate (2 prod icons, see §5) |

Prod-shipped icon surface is only **`Eraser` + `Share2`** — `FilterTuner.vue` is `import.meta.env.DEV`-gated (`App.vue:61-62`, absent from prod builds per `App.vue:143`), so its 4 icons never ship.

---

## 2. pencil-boil 0.7.0 — surface utilization (consumes vs ships)

Installed `0.7.0` (`node_modules/@mkbabb/pencil-boil/package.json`): `main/module/types → ./src/index.ts` (ships **source TS**, compiled by the app's own build), `sideEffects:false`, **`dependencies:{}` — zero runtime deps**, `peerDependencies:{vue:^3.5.0}`.

Full export surface (33 values + 4 types, from `src/index.ts`):

**Consumed (21 values + 3 types):** `mulberry32` (8 sites — the workhorse), `useBoilFrame`, `heldFrameCount`, `useFilterParamBoil`, `usePrefersReducedMotion`, `schedulerDebugInfo`, `acquireHold`, `releaseHold`, `createSequenceSubscription`, `createBoilTicker`, `easeOutCubic`, `linear`, `resolveEasing`, `generateSunRays`, `wobbleDiamond`, `wobbleStarPolygon`, `wobbleLine`, `wobbleLinePoints`, `wobbleRect`, `pointsToLinear`, `perturbPoints` + types `BoilHandle`, `SequenceHandle`, `WobbleOptions`. `easeInCubic`/`easeInOutCubic` are reached indirectly via `resolveEasing('easeInCubic')` string lookup (`usePathAnimation.ts:140`, `pencilConfig.ts:53`) — retained, not dead.

**Shipped-but-unused (~10 exports):** `catmullRomToBezier`, `perturbPointsClosed`, `boilLineFrames`, `boilRectFrames`, `ellipsePoints`, `createStrokeDrawIn`, `isBoilHeld`, `useBoilCache`, `useBoilFrames`, `useLineBoil` (BoilDivider migrated off it to `useBoilFrame` at W8 — now comment-only, `BoilDivider.vue:13`). All confirmed 0 real import sites.

Verdict: **KEEP, no action.** Utilization is high (~64% of value exports, and the unused tail is library over-provisioning). Because pencil-boil is `sideEffects:false` ESM compiled from source, the ~10 unused exports are **dead-code-eliminated — zero ship cost.** The dep adds **no third-party mass** (deps `{}`, vue is a peer already present). This is the reference "earns its keep" row.

---

## 3. keyframes.js re-adoption — dependency-mass evidence (for F6's decision row)

The app deliberately **migrated off** `keyframes.js` onto pencil-boil. Code provenance of the migration (why it left):
- `glyphAnimations.ts:3-6` — draw-in "was a keyframes.js `KeyframesAnimation`, i.e. **one independent native rAF loop per drawing cell** (up to ...)" → now one `sequence` subscriber on pencil-boil's single scheduler.
- `usePathAnimation.ts:12` — "Each grid line was its own keyframes.js `KeyframesAnimation` → its own `RAFPlayback` → its own ..." (per-line rAF, collapsed to one chain).
- `pencilConfig.ts:271` — "never a per-cell keyframes.js RAFPlayback."
- `rafInstrumentation.ts:5` — instrumentation exists precisely to prove the one-chain claim keyframes.js's per-animation loops violated.

**Dependency-mass TODAY, standalone** (`npm view`, quoted):
```
@mkbabb/keyframes.js  →  version = '5.2.0'
                          dependencies = { '@mkbabb/value.js': '^3.1.0' }
@mkbabb/value.js      →  version = '3.1.0'
                          dependencies = { '@mkbabb/parse-that': '^1.0.0' }
@mkbabb/parse-that    →  (no further runtime deps)
```

Re-adoption pulls a **3-package `@mkbabb` transitive chain**: `keyframes.js → value.js → parse-that` (the last a parser-combinator). Contrast: `@mkbabb/pencil-boil@0.7.0 dependencies = {}` — the incumbent that already covers the consumed animation surface (`createBoilTicker`, `createSequenceSubscription`, the easing set, `resolveEasing`) carries **zero** runtime dep mass.

**Supply to F6:** re-adopting keyframes.js is a **dependency-mass regression (0 → 3 transitive @mkbabb pkgs)** AND a **perf-model regression** (per-animation `RAFPlayback` loops vs the single-scheduler one-chain that tranche-2 W8 shipped and instruments). It is only justified if keyframes.js exposes a capability pencil-boil lacks that the app actually needs; on the animation surface censused here it does not. Recommend F6 mark **do-not-re-adopt** absent a named capability gap.

---

## 4. Platform-replaceable candidates

**`@vueuse/core` (4 functions).** Installed 1.3M but ESM-tree-shaken to the 4 used fns.
- `useResizeObserver` (`HandDrawnOutline.vue:3`) ≈ raw `ResizeObserver` in `onMounted`/`onUnmounted` — trivial, ~8 lines.
- `useDark` + `useToggle` + `createGlobalState` (`useTheme.ts`) ≈ `matchMedia('(prefers-color-scheme: dark)')` + `localStorage` + a module-level `ref` singleton — ~25 lines, and it's the one non-trivial piece (SSR-safe class toggling, storage sync). 
- Verdict: **KEEP** (idiomatic, tree-shaken, low mass). If tranche-III wants zero-dep purity, a `useTheme` hand-roll is the higher-value swap of the two; `useResizeObserver` inlining is cosmetic. Not a mass problem — a purity call.

**`@lucide/vue` (2 prod icons: `Eraser`, `Share2`).** `sideEffects:false` → only the 2 prod icons ship (28M install is source). Verdict: **KILL-candidate / adopt-inline** — two inline `<svg>` glyphs (or two entries in the existing pencil glyph system) retire the dep outright. Given the hand-drawn aesthetic, Lucide's clean-line icons are arguably off-register anyway; the pencil layer could render both. Low-risk, clean win.

---

## 5. devDependencies — earns-keep pass

| DevDep | Used at | Verdict |
|---|---|---|
| `vite` ^8.1.4 | build/dev | KEEP |
| `@vitejs/plugin-vue` ^6 | `vite.config.ts:3` | KEEP |
| `vue-tsc` ^3 / `typescript` ~6 | `build` script | KEEP |
| `@playwright/test` ^1.61 | `e2e/*.spec.ts` (futoshiki, round9, permalink, …) | KEEP |
| `eslint` ^10 + `@eslint/js` + `typescript-eslint` + `eslint-plugin-vue` + `vue-eslint-parser` | `eslint.config.js` | KEEP (lint chain) |
| `globals` ^17 | `eslint.config.js:5,96` (`globals.browser`) | KEEP |
| `prettier` + `prettier-plugin-tailwindcss` | `lint` script | KEEP |
| `vite-plugin-pwa` ^1.3.0 | `vite.config.ts:8,130` | KEEP (see §6) |
| **`autoprefixer` ^10.5.2** | `vite.config.ts:5,118` `css.postcss.plugins:[autoprefixer()]` | **REVIEW / KILL-candidate** |
| **`esbuild` ^0.28.1** | not imported in any config/script | **REVIEW / KILL-candidate** |

**`autoprefixer` — REVIEW.** It *is* wired (a live `css.postcss` PostCSS pass, `vite.config.ts:110-119`), so it mechanically "earns keep." But it runs a **second, redundant vendor-prefixing pass on top of Tailwind v4's `@tailwindcss/vite`**, which uses **Lightning CSS** (already prefixes/transforms per browser targets). No `postcss.config.*` exists — this is the *only* PostCSS consumer. Adding a PostCSS pipeline solely for autoprefixer, when the CSS engine already prefixes, is legacy-shaped. Recommend tranche-III verify browser-target prefixing under Lightning CSS alone and **drop autoprefixer + the `css.postcss` block** if targets are covered (an architectural-simplification win: removes a whole PostCSS pass).

**`esbuild` — REVIEW.** Direct devDep `^0.28.1`, but `npm ls esbuild` shows it **deduped with vite@8.1.4's own esbuild@0.28.1**, and it is **imported by no config or script** (`grep` clean). It's a redundant explicit pin of a transitive Vite dep. If it exists to force-align vite's esbuild, an `overrides` entry (none present in `package.json`) is the idiomatic mechanism; as a bare devDep it's noise. Recommend **drop** unless a script materializes that imports esbuild directly.

---

## 6. vite-plugin-pwa posture

**KEEP.** Actively configured (`vite.config.ts:130-175+`), `generateSW` + `registerType:'autoUpdate'` + `injectRegister:'script'`. Posture is deliberate and CSP-honest:
- `injectRegister:'script'` emits an external `/registerSW.js` (never inline) so `script-src 'self'` needs no `'unsafe-inline'` (`vite.config.ts:126-129`).
- `workbox.globPatterns` widened to `{js,css,html,wasm,woff2,svg}` — necessary: the plugin default drops self-hosted woff2 faces + `favicon.svg`, which would break offline font rendering (`vite.config.ts:139-142`).
- No `runtimeCaching` — precache is the whole strategy for hashed assets; a second CacheFirst route would double-store the wasm (`vite.config.ts:159-163`).
- `test:pwa` script (`e2e/pwa-offline-smoke.mjs`) guards it.

Offline PWA is a shipped product feature (App-A/C topology). The plugin is the idiomatic path; no lighter platform substitute (hand-rolling a service worker + manifest injection is strictly more code). No action.

---

## Consolidated keep/kill/adopt rows

| # | Dep | Row | Rationale |
|---|---|---|---|
| 1 | `@mkbabb/pencil-boil` | **KEEP** | 21/33 exports used; zero runtime deps; unused tail tree-shaken |
| 2 | `vue`, `@mkbabb/csp-solver-wasm`, `tailwindcss`, `@tailwindcss/vite` | **KEEP** | core, non-negotiable |
| 3 | `vite-plugin-pwa` | **KEEP** | shipped offline feature; CSP-honest config; no lighter substitute |
| 4 | `@vueuse/core` | **KEEP (purity-optional)** | 4 tree-shaken fns; `useTheme` hand-roll is the only >trivial swap if zero-dep purity is wanted |
| 5 | `@lucide/vue` | **KILL-candidate → adopt-inline** | 2 prod icons (`Eraser`,`Share2`); inline as SVG / pencil glyphs, off-register with hand-drawn aesthetic |
| 6 | `autoprefixer` | **KILL-candidate (verify)** | redundant PostCSS pass atop Tailwind v4 Lightning CSS; verify targets, then drop `css.postcss` block |
| 7 | `esbuild` (direct) | **KILL-candidate** | deduped with vite's own; imported nowhere; use `overrides` if a pin is truly needed |
| 8 | `keyframes.js` (re-adoption) | **DO-NOT-ADOPT** (F6) | pulls `value.js`+`parse-that` (0→3 dep mass); reverses the W8 single-scheduler perf migration |

Nothing here ships — tranche-III authoring input only.
