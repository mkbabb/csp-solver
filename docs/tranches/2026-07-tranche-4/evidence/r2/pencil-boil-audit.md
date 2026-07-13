# r2-pencil-boil-audit — the library estate + the 0.9.0 shape

Subject: `/Users/mkbabb/Programming/pencil-boil` @ `da51edb` (v0.8.1, published on npm; app pins
`^0.8.1` at `web/frontend/package.json`). Tree clean. All paths pencil-boil-relative unless noted.
Green baseline established: `npm test` (check + all 5 proofs) exits 0, **73 assertions pass**
(boil-guard 37, frames 7, cache 7, prebake 9, celestial 13) — reran, verbatim below in §B.

---

## A. Public-surface census — r1's 16/35 is WRONG; the true count is 20 value + 2 type consumed

`src/index.ts` exports **33 values + 4 types = 37 named**. r1-consumer-truth F5 claimed the app
consumes "~16 of ~35" and listed `pointsToLinear`, `perturbPoints`, `wobbleRect`, `linear` as
**unconsumed**. They are consumed — verified in-body, not merely imported (`noUnusedLocals: true`
at `web/frontend/tsconfig.json:9` would reject an unused import, so an import IS a use):

- `wobbleRect` — `web/frontend/src/pencil/grid/gridPaths.ts:53,146`
- `pointsToLinear` — `gridPaths.ts:370,375,377,410,446,497,508` (7 in-body)
- `perturbPoints` — `gridPaths.ts:352,444,499`
- `linear` — `web/frontend/src/pencil/glyph/glyphAnimations.ts:115` (`easing: linear`)

**VERDICT: r1-consumer-truth F5 is CORRECTED.** True app consumption is **20 value exports + 2
types** (`WobbleOptions`, `SequenceHandle`), not 16; the unconsumed set is **13 value exports**,
not 17. `family_hint: census-undercount`.

Probe (rerunnable, from `web/frontend/`):
```
for s in wobbleRect pointsToLinear perturbPoints linear; do \
  echo "$s: $(grep -rn "\b$s\b" src --include='*.ts' --include='*.vue' | grep -v "from '" | grep -vc '// ') in-body uses"; done
```
(zsh: quote the globs or the `--include` args glob-expand and fail — the r1 census script tripped
exactly this; that is the likely mechanical cause of the undercount.)

### Per-export disposition table

Consumption re-derived from every `@mkbabb/pencil-boil` import site in `web/frontend/src`
(21 sites, multiline-aware). C = consumed by app · U = unconsumed by app.

| export | mod | app | disposition |
|---|---|---|---|
| `mulberry32` | random | C | keep (app: 7 sites) |
| `wobbleLinePoints` | path | C | keep (app: gridPaths) |
| `pointsToLinear` | path | C | keep (app) |
| `perturbPoints` | path | C | keep (app) |
| `wobbleLine` | path | C | keep (app) |
| `wobbleRect` | path | C | keep (app) |
| `catmullRomToBezier` | path | U | **keep (coherent lib API)** — the smooth serializer, README-documented, pair of `pointsToLinear` |
| `perturbPointsClosed` | path | U | **keep (coherent lib API)** — closed-ring boil, the `ellipsePoints` companion |
| `boilLineFrames` | path | U | **keep (coherent lib API)** — but see §A-note (hoist never adopted) |
| `boilRectFrames` | path | U | **keep (coherent lib API)** |
| `ellipsePoints` | path | U | **keep (coherent lib API)** — CHANGELOG 0.4.0: glass-ui `handmark` upstream requirement |
| `wobbleDiamond` | celestial | C | keep (app: DarkModeToggle) |
| `wobbleStarPolygon` | celestial | C | keep (app) |
| `generateSunRays` | celestial | C | keep (app) |
| `easeOutCubic` | easings | C | keep (app) |
| `linear` | easings | C | keep (app: glyphAnimations) |
| `resolveEasing` | easings | C | keep (app: usePathAnimation) |
| `easeInCubic` | easings | U | **keep (coherent lib API)** — a cubic-family set is incomplete without it |
| `easeInOutCubic` | easings | U | **keep (coherent lib API)** |
| `useLineBoil` | vue | U | **keep (coherent lib API)** — the HEADLINE composable (README Stage 3); app migrated off it (`BoilDivider.vue:14` records the W8 migration) but it is the library's raison d'être |
| `useBoilFrame` | vue | U | **PRUNE candidate** — pure alias of `useLineBoil`; its doc-comment (`vue.ts:386` "the name the sudoku consumer imports") is FALSE — no site imports it (§A-note) |
| `useFilterParamBoil` | vue | U | keep (coherent lib API) |
| `createBoilTicker` | vue | C | keep (app: boilBeat, glyphAnimations) |
| `createSequenceSubscription` | vue | C | keep (app: 4 sites) |
| `createStrokeDrawIn` | vue | U | **keep (coherent lib API)** — 0.7.0 hoist; app re-hand-rolls the draw-in inline (`usePathAnimation.ts` builds its own `createSequenceSubscription` draw-in) so the packaged helper is unused, but it is documented public API |
| `usePrefersReducedMotion` | vue | C | keep (app: 7 sites) |
| `schedulerDebugInfo` | vue | C | keep (app: rafInstrumentation) |
| `isBoilHeld` | boilHoldGate | U | keep (coherent lib API) — the read side of acquire/release |
| `acquireHold` | boilHoldGate | C | keep (app: AnswerKeyLaminate) |
| `releaseHold` | boilHoldGate | C | keep (app) |
| `heldFrameCount` | boilHoldGate | C | keep (app: HandDrawnGrid, BoilDivider) |
| `useBoilCache` | frames | C | keep (app: gridPaths) |
| `useBoilFrames` | frames | U | keep (coherent lib API) — the historical frame-array shape, `useBoilCache<T[]>` wrapper |

**The pruning framing is a red herring.** pencil-boil is a general library with named external
downstreams (CHANGELOG 0.3.0/0.4.0: `bbnf-buddy`, `fourier-analysis`, glass-ui `handmark`). App-scoped
non-consumption is NOT grounds to prune coherent primitives — an easing library ships its full cubic
set, a geometry library ships both serializers and both cache shapes. The **only** honest prune at
0.9.0 is `useBoilFrame` (a zero-cost alias whose doc claims a consumer that does not exist), and even
that is defensible as a rename ergonomic. **Recommendation: 0.9.0 is ADDITIVE (rasterizePoseStack), not
a prune wave.** Fix `useBoilFrame`'s lying doc-comment or drop the alias; leave the rest.
`family_hint: prune-framing-overreach`.

### §A-note — the 0.7.0 hoist that its own author never adopted (P2)
`boilLineFrames` (`path.ts:228`) was shipped at 0.7.0 as "the base→perturb→serialize loop every
consumer wrote by hand, in one call" (CHANGELOG:49). The consumer STILL hand-rolls that exact loop:
`gridPaths.ts:438-446` and `:496-508` do `wobbleLinePoints` → per-frame `perturbPoints` →
`pointsToLinear`, frame 0 = base — byte-for-byte `boilLineFrames`'s body. It was never swapped in.
And it cannot be swapped without a pixel change: `boilLineFrames` uses seed stride `seed + f*1013`
(`path.ts:249`) while the consumer uses `pathSeed + f*997` (`gridPaths.ts:444,499`). The hoist froze
the wrong constant. `family_hint: hoist-never-adopted`. Cost: a public API that duplicates live app
code it can't replace; a 0.9.0 that wanted the consumer on the library helper would first have to
reconcile the stride (a pixel change → a soul-gate).

---

## B. The proofs suite — what each guards, green at HEAD, and the gaps

`npm test` = `tsc --noEmit` + 5 proof scripts (run via `proofs/loader.mjs` + `ts-ext-resolver.mjs`,
which append `.ts` to the library's extensionless relative imports so Node's native TS stripping
resolves them). Reran at HEAD, all green:

```
boil-guard.proof: 37 assertions passed   # scheduler invariants (a)-(g)
frames.proof:      7 assertions passed    # useBoilFrames LRU + float-key
cache.proof:       7 assertions passed    # useBoilCache scalar + shared-LRU
prebake.proof:     9 assertions passed    # boilLineFrames/boilRectFrames count/determinism/shiver/finite/closure
celestial.proof:  13 assertions passed    # wobbleDiamond(4)/wobbleStarPolygon(10)/generateSunRays(20) count+determinism
```
Probe: `cd /Users/mkbabb/Programming/pencil-boil && npm run proof`.

**What boil-guard guards** (the crown jewel, `proofs/boil-guard.proof.ts`): a controllable
rAF+setTimeout+matchMedia stub drives the composables in a Vue `effectScope`. (a) frameCount=1 never
arms; (b) frameCount=3 arms/unmount disarms; (c) PRM is an independent gate; (d) draw-then-boil
1↔3 enrol/withdraw; (e) the M2 defect — mid-session PRM tears down an ALREADY-ACTIVE subscriber
centrally (not just gates new enrolment); (f) a `sequence` one-shot rides the continuous chain and
self-unsubscribes; (g) the T3-W13 P1 sleeping-steady-state contract — parks on ONE beat timer, lands
exactly ONE rAF per beat, re-parks, sequence supersede-and-fallback, withdrawal disarms both shapes.
This is a genuine behavioral gate (it would fail on a regression), not a vacuous green.

### Gaps (unproven surface) — P2/P3

1. **`boilHoldGate.ts` has NO proof** (P2, `family_hint: proof-gap-consumed-surface`). `heldFrameCount`
   / `acquireHold` / `releaseHold` / `isBoilHeld` are **consumed** (`heldFrameCount` in HandDrawnGrid
   + BoilDivider; acquire/release in AnswerKeyLaminate) yet the collapse-to-1 → freeze-in-place →
   re-enrol-on-release contract is unasserted. The one module the app leans on for the hold-to-peek
   gesture is the one with no gate. A `hold.proof.ts`: acquire → `heldFrameCount(()=>4)()===1` →
   `useLineBoil(held)` stops (subscriber withdrawn, `currentFrame` unchanged) → release → count
   returns to 4 → re-enrols. Runnable in the SAME node/effectScope harness as boil-guard.
2. **`resolveEasing` unproven** (P3). A consumed export (usePathAnimation) with a string→curve switch
   (`easings.ts:31`); no proof asserts `'easeInCubic'→easeInCubic`, unknown→`easeOutCubic` default.
   Trivial to add to a widened easings proof.
3. **`perturbPointsClosed` + `ellipsePoints` unproven** (P3). The closed-ring path (0.4.0's glass-ui
   handmark surface) has no count/determinism/finiteness proof, unlike its open-line sibling in
   prebake.proof. `catmullRomToBezier` / `wobbleRect` closure likewise only transitively exercised.
4. **`mulberry32` determinism not directly proven** (P3) — only transitively via celestial/prebake.

### The rasterizePoseStack proof shape — the CRITICAL gap for 0.9.0 (P1-for-the-release)
`family_hint: proof-harness-cannot-reach-dom`.

s3.md §4 specifies the release gate: deterministic capture (`repeatMatch`), distinct-per-pose, and
**untainted canvas** (`getImageData` does not throw). **The current proof harness CANNOT run this.**
The Node proofs stub `window`/`rAF`/`setTimeout`/`matchMedia` but there is **no canvas, no
`ImageBitmap`, no `document`, no SVG layout** in Node — the harness deliberately runs `No document =>
visibilitychange listener skipped` (boil-guard `installEnv`). `rasterizePoseStack`'s load-bearing
invariant (SVG→Blob→`drawImage`→`getImageData` stays CORS-clean, byte-deterministic) is a **browser**
property; s3 proved it with `playwright.webkit` + `fixture.html`, not Node.

So the 0.9.0 proof splits in two, and this must be in the release manifest:
- **Node-provable (the pure half):** the `poseSvg(i)` serializer — `<defs>` inlined into the
  serialized string (a detached blob can't reach page `<defs>`), colors resolved to hex literals
  (no `currentColor`/`var()` leaking), deterministic string for a fixed pose. This CAN live in the
  existing `npm test` rig as `raster-serialize.proof.ts`.
- **Browser-only (the identity half):** untainted + `repeatMatch` + distinct-per-pose at DPR2. This
  needs a NEW CI capability pencil-boil does NOT have today: a Playwright-driven proof lane. s3's
  `fixture.html` + `run-fixture.mjs` is the seed; promoting it means adding `@playwright/test` (or
  bare `playwright`) as a devDep and a second CI job (`proof:browser`). Alternatively keep it as a
  manually-run release gate (documented, not CI-wired) — but then it is a soul-gate that "cannot
  fail in CI," precisely the FAM-1 class the campaign is hunting. **Recommend the Playwright lane.**

Note the N-LAYER correction (r1-perf / FAM-3): s3's single-`<canvas>` `drawImage` variant leaves
Chromium's residual ~8/s tile churn; only the N stacked-bitmap-layer variant (opacity-swap, `filter=`
removed) zeroes it. The proof's cross-engine parity assertion (s3 §4.3) must therefore target the
**N-layer** consumer shape, not the single-canvas sketch in s3 §5.

---

## C. Internal hygiene

### C1 — tsconfig declares `.d.ts` emit that never happens, and would pollute `src/` if it did (P2)
`family_hint: declaration-without-emit`. `tsconfig.json:14-15` sets `declaration: true` +
`declarationMap: true`, but there is **no `outDir`, no `noEmit`, and no build script** — every script
(`check`, release `check`) passes `--noEmit` on the CLI, which overrides. So the declaration flags are
dead config: no `.d.ts` is ever produced (the package ships raw TS; `types: ./src/index.ts`,
`package.json:8`). Worse, it is a latent footgun: a bare `tsc` (an editor "build task", a
contributor's habit) would emit `.js` + `.d.ts` + `.d.ts.map` **as siblings of every `.ts` in
`src/`** (no `outDir` to redirect them), and `files: ["src", …]` (`package.json:14`) would then
publish that pollution. Fix at 0.9.0: drop both flags (raw-TS package needs neither) OR add
`"noEmit": true` to the config so intent is enforced in the file, not only on the CLI.

### C2 — the changesets rig: used through 0.6.0, ABANDONED at 0.7.0+, its automation prose fictional (P2)
`family_hint: config-truth-changesets`. Deeper than r1's "fully unwired": changesets `.md` files DID
exist historically (git log: `celestial-proofs.md`, `use-boil-frames.md`, `boil-guard-static-frame.md`,
`boil-hold-gate.md`, `centralized-scheduler.md`, `reactive-prm-teardown.md`) through the 0.5.x–0.6.0
era, consumed at hand-cut `chore(release): 0.x` commits. But:
- **0.7.0, 0.8.0, 0.8.1 have NO changeset** — they are direct `feat(scheduler): 0.8.0` commits that
  hand-bump `version` and hand-write CHANGELOG prose. The flow was abandoned after 0.6.0.
- **`@changesets/cli` is not a dependency** (`grep changeset package.json` → absent). CONTRIBUTING
  and `.changeset/README.md` say `npx changeset` — an ad-hoc npx download, which intersects the
  standing **npx-packument-OOM** trap (MEMORY: deploy ONLY via pinned deps, never bare npx).
- **The "Version Packages PR" automation does not exist.** CONTRIBUTING.md ("the changesets workflow
  batches accepted changesets into a `Version Packages` PR") and README.md ("Merging the accumulated
  changesets via the Version Packages PR cuts the version bump… which fires release.yml") describe a
  changesets GitHub Action that was never installed — `.github/workflows/` holds only `ci.yml` +
  `release.yml` (tag-triggered publish). Every release was in fact a manual `chore(release)` /
  hand-bump. The prose is a green-over-nothing lie in the record.
- **CHANGELOG 0.3.0's "Future entries accrete from changesets"** (`CHANGELOG.md:145`) is false for
  0.7.0+.

Decision for 0.9.0: either (a) actually wire `changesets/action` + add `@changesets/cli` devDep and
use it for the 0.9.0 bump, or (b) delete `.changeset/` + strike the changesets prose from
CONTRIBUTING/README and document the honest hand-cut `chore(release)` flow. Pick one; today the tree
lies either way.

### C3 — README/CHANGELOG truth (P3)
- README module map (`README.md:28`) omits **`perturbPointsClosed`** from the `path.ts` row (it lists
  `ellipsePoints` but not its closed-ring perturb partner). index.ts exports it (`index.ts:9`).
- CHANGELOG 0.3.0 + CONTRIBUTING name consumers **`bbnf-buddy` + `fourier-analysis`** — the live,
  verified consumer (this repo's `web/frontend`, pinning `^0.8.1`) is unlisted. Can't confirm the two
  named repos still consume it (out of tree); at minimum the consumer list is incomplete. Low confidence.
- CHANGELOG 0.6.0 documents `useCelestialSun` as "parked / never shipped" — accurate, no dead export.

### C4 — engines / packageManager undeclared (P2, corroborates r1-deps F3)
`family_hint: unpinned-toolchain`. `package.json` carries no `engines` and no `packageManager`. CI
pins `node-version: 24` (ci.yml, release.yml) but the manifest doesn't, so a fresh clone on npm 10 /
old Node hits the "npm 10 mis-resolves the lockfile" trap (MEMORY) with nothing to gate it. 0.9.0
should add `"engines": { "node": ">=24", "npm": ">=11" }` + `"packageManager": "npm@11.x"`.

### C5 — TS two majors behind (P2, corroborates r1-deps F2) + live postcss CVE (P1, r1-deps F1)
- `typescript: ^5.7.0` → installed 5.9.3, latest 7.0.2. The library type-checks its published source
  under 5.9 while the frontend consumes+checks it under TS 6.0 — author/consumer skew.
- **Live moderate CVE reconfirmed at HEAD:** `npm audit` → `postcss <8.5.10` (GHSA-qx2v-qp2m-jg93),
  via `vue@3.5.29 → @vue/compiler-sfc@3.5.29 → postcss@8.5.8`. `vue: ^3.5.0` resolved 10 patches
  stale; `npm i` / bumping the devDep to 3.5.39 clears it. Probe: `npm audit; npm ls postcss`.

---

## D. The 0.9.0 release manifest — one coherent shape

**Theme:** additive WebKit fix + hygiene, NOT a prune. Verified against s3.md (with the r1-perf
N-LAYER correction) and the census above.

### D1 — the feature (the reason for 0.9.0)
- New browser-only core `src/raster.ts` — `rasterizePoseStack(opts): Promise<ImageBitmap[]>`
  (framework-agnostic, no `vue` import, mirrors `path.ts`). Signature per s3 §5.
- New Vue composable `useRasterStack(opts, stepEveryBeats?)` in `vue.ts` — beside `useLineBoil` /
  `useFilterParamBoil`; memoizes each `ImageBitmap` through the existing `useBoilCache` under key
  `(cacheKey, pose, dpr, cssSize, theme)`, drives `pose` off the shared beat.
- **Consumer shape = N stacked bitmap layers** (per r1-perf FAM-3 correction), not the single-canvas
  sketch — N `<canvas>`/`<img>` with `filter=` removed, `is-active` opacity-swapped on `pose`. This
  is the ONLY variant that also zeroes Chromium's residual ~8/s tile churn; the single-canvas variant
  in s3 §5 leaves it. Both variants share the one `useRasterStack` bake.
- Re-bake triggers: DPR change (`matchMedia('(resolution:)')`), theme flip (masked by the Bloom
  gesture), `document.fonts.ready` (logo Fraunces). Live-filter fallback while baking (the L28-F1
  "one raster per appearance" sanctioned transient).
- The frozen `wobble-*-p{i}` / `grain-static` defs STAY (bake source + fallback filter);
  `wobblePoseFrequencies` / `wobblePoseId` unchanged. The Bloom's live warp-wrapped filter is untouched.

### D2 — the proofs (per §B)
- `proofs/raster-serialize.proof.ts` (Node, in `npm test`): defs-inlined, colors→hex-literal,
  deterministic `poseSvg(i)` string.
- `proofs/raster-identity` (Playwright, NEW `proof:browser` CI job): untainted + `repeatMatch` +
  distinct-per-pose at DPR2, cross-engine parity (Chromium + WebKit) — promote s3's `fixture.html` +
  `run-fixture.mjs`. Requires `@playwright/test` devDep + a second CI lane. Do NOT leave it as a
  manual-only gate (that is a FAM-1 vacuous green).
- `proofs/hold.proof.ts` (Node, §B gap 1): close the unproven consumed `boilHoldGate` surface while
  the harness is open.
- Widen `celestial`/`prebake` era proofs to cover `resolveEasing`, `perturbPointsClosed`,
  `ellipsePoints`, `catmullRomToBezier` (§B gaps 2-4).

### D3 — the hygiene (fold in, don't spin a separate wave)
- Prune `useBoilFrame` alias OR fix its false doc-comment (`vue.ts:386`). No other prune — §A.
- tsconfig: add `"noEmit": true` or drop `declaration`/`declarationMap` (C1).
- Changesets: wire the action + `@changesets/cli` devDep, OR delete the rig and strike the fictional
  prose from README/CONTRIBUTING/CHANGELOG (C2). Use the chosen path to cut the 0.9.0 bump.
- `package.json`: add `engines` + `packageManager` (C4); bump `vue` devDep to clear the postcss CVE
  (C5); consider `typescript` → 7.x co-validated with the consumer (C5).
- README: add `perturbPointsClosed` to the module map; reconcile the consumer list (C3).
- Reconcile `boilLineFrames`'s `f*1013` seed stride with the consumer's `f*997` if 0.9.0 wants
  gridPaths on the library helper (§A-note) — else leave both and note the divergence.

### D4 — what 0.9.0 must NOT do
- Do not prune the 13 app-unconsumed exports as a batch — they are coherent library API with named
  external downstreams (§A). The r1 "17/35 unconsumed → prune" framing is an app-scoped overreach.
- Do not ship the raster identity proof as manual-only (FAM-1 vacuous-green).
- Do not adopt the single-canvas variant (leaves Chromium churn — r1-perf).

---

## Verified-green (banked, so synthesis doesn't re-probe)
- `npm test` exits 0, 73 assertions, at `da51edb` (§B).
- boil-guard (g) is a real sleeping-steady-state gate — it asserts `rafArmCount`/`pendingTimers.size`
  transitions, would fail on a regression to the 0.7.x perpetual-chain shape. Not vacuous.
- `ts-ext-resolver.mjs` correctly scopes to dev (proofs excluded from the `files` tarball); the
  extensionless-import ship decision is sound (consumers would else need `allowImportingTsExtensions`).
- No `dist/` committed; `.gitignore` covers `node_modules`/`dist`/`.DS_Store`; `files` ships only
  `src`+README+LICENSE — publish surface is clean.
