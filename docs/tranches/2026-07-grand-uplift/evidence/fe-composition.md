# fe-composition — Pass 3 adversarial critique: frontend integration rehearsal

**Target claim under attack**: the pass-2 frontend prototypes patch overlapping files; `two-layer-frontend` MOVES files that `grain-static-overlay` and `unified-boil-scheduler` patch in place — path conflicts are guaranteed. Task: apply, in order, `keyframes5-migration.diff` → `two-layer-frontend` (move manifest + diff) → `grain-static-overlay.diff` → `unified-boil-scheduler.diff`, resolve conflicts, then optionally layer `union-prototype.diff` (pass 2.5) to test whether it composes with the moved topology. Gates: `npm install`, `vue-tsc -b`, `vite build`, Playwright smoke (board renders, boil ticks, one interaction).

**Verdict up front**: the claim holds, with one amendment to the prescribed order. All four mandatory prototypes compose into a single working tree; every gate is green with measured evidence below. The optional union variant also composes cleanly, but only after fixing a filename collision and retargeting a stale call site the union diff didn't know had moved. Two non-obvious integration gaps were found and fixed along the way — both are the kind of defect a naive/mechanical merge (or an integrator who stops at "the file paths now match") would silently ship broken.

---

## 1. Setup

Worktree was provisioned stale at `bc37f4d`; reset to `91bb8b0` per the known-defect note (`git reset --hard 91bb8b0`, verified via `git log -1`). All work is local to this worktree; nothing pushed.

```
$ git log -1 --oneline
91bb8b0d docs: constellation grand-audit fold (2026-06-03)
```

Source diffs/manifests read from `pass2/`:
- `keyframes5-migration.diff` (82,676 bytes) — bumps `@mkbabb/keyframes.js` 2.0.0 → 5.1.0, renames `Animation` → `KeyframesAnimation` at `@mkbabb/keyframes.js/engine`, excises 9 dead files.
- `two-layer-frontend.diff` (171,341 bytes) — full `sudoku/` + `skin/` topology split, git-format renames (`similarity index`/`rename from`/`rename to`), 48 files touched.
- `grain-static-overlay.diff` (6,567 bytes) — one file, `HandDrawnGrid.vue`.
- `unified-boil-scheduler.diff` (31,971 bytes) — new `boilScheduler.ts` + `rafInstrumentation.ts`, edits to 6 components + `main.ts`.
- `pass25/union-prototype.diff` (37,048 bytes, optional) — answer-key "peek" feature, 11 files.

---

## 2. Attack 1 — literal order as given is impossible: `keyframes5-migration` is fully subsumed by `two-layer-frontend`

Applied `keyframes5-migration.diff` clean (`git apply --check` exit 0), then tried `two-layer-frontend.diff` on top:

```
error: web/frontend/components.json: No such file or directory
error: patch failed: web/frontend/package-lock.json:8
error: patch failed: web/frontend/package.json:8
error: web/frontend/src/components/decorative/DoodleAccents.vue: No such file or directory
... (11 errors total)
```

Investigated whether this is a resolvable conflict or a structural one. Diffed `two-layer-frontend.diff`'s own `package.json` hunk against `keyframes5-migration.diff`'s: **byte-identical dependency bump** (`@mkbabb/keyframes.js` `^2.0.0` → `^5.1.0`, same `@mkbabb/pencil-boil` bump, same dropped shadcn/roughjs deps). Cloned the repo to a scratch dir, applied `two-layer-frontend.diff` alone to the *raw* `91bb8b0` baseline — it applies cleanly and its resulting `HandwrittenGlyph.vue` already imports `KeyframesAnimation` from `@mkbabb/keyframes.js/engine`, identical to what `keyframes5-migration.diff` produces (differing only in import *paths*, due to the file move).

**Finding**: `two-layer-frontend.diff` was authored against the pre-`keyframes5-migration` baseline and *independently re-derived the same v5 migration inline* (its own report explicitly says so: "Forced consequence for my worktree specifically" — a corroboration flagged by that prototype's own author, not an oversight). The two diffs are not stackable layers; they are two independent authorings of the same underlying change, one a strict superset of the other. **The prescribed order ("apply keyframes5-migration, then two-layer-frontend") cannot be executed as two sequential `git apply` calls against the same tree — it always conflicts.**

**Amendment to plan**: apply `two-layer-frontend.diff` directly to baseline; treat `keyframes5-migration.diff` as subsumed (do not apply it separately). Verified: `git apply --check pass2/two-layer-frontend.diff` against raw `91bb8b0` → exit 0.

---

## 3. Attack 2 — `grain-static-overlay` conflicts on the moved path, but the fix is a pure retarget

```
$ git apply --check pass2/grain-static-overlay.diff
error: web/frontend/src/components/custom/HandDrawnGrid.vue: No such file or directory
```

Confirmed as predicted. Diffed the post-move `HandDrawnGrid.vue` body against grain-static-overlay's expected pre-image: identical except import-path rewrites (the move only touched imports, never this file's logic/template). Retargeted the diff's file paths only (`sed` old→new path in both `---`/`+++` headers) and reapplied:

```
$ sed 's#src/components/custom/HandDrawnGrid.vue#src/skin/components/grid/HandDrawnGrid.vue#g' \
    grain-static-overlay.diff > grain-static-overlay.retargeted.diff
$ git apply --check grain-static-overlay.retargeted.diff   # exit 0
$ git apply grain-static-overlay.retargeted.diff            # APPLIED
```

Path substitution alone was sufficient — no manual reconciliation needed. Retargeted diff saved at `pass3/grain-static-overlay.retargeted.diff`.

---

## 4. Attack 3 — `unified-boil-scheduler` has a real path-root bug *and* a topology conflict, and neither is a pure retarget

Two independent defects, confirmed separately:

**4a. Wrong path root.** Every path in `unified-boil-scheduler.diff` is `frontend/...`, not `web/frontend/...` — a generation-environment artifact (the prototype was presumably authored from inside `web/`). `git apply --check` failed on *every* file with "No such file or directory" even before considering the move. Fixed with `git apply --directory=web ...`, which correctly prepends the missing root (verified: after this flag, only move-topology errors remained, the root-path errors vanished).

**4b. Import-specifier drift, not just paths.** After the directory fix, `git apply --check --directory=web unified-boil-scheduler.diff` still failed on all 6 touched Vue/TS files — but *not* because the files don't exist (they do, at their moved paths). The hunks' context lines reference old import specifiers (`@/composables/useTheme`, `@/lib/pencilConfig`, relative `./glyphRegistry`) that the move rewrote to the new alias scheme (`@skin/composables/useTheme`, `@skin/config/pencilConfig`). **A `sed` path-rename cannot fix this** — every hunk needed hand reconciliation of the *content*, not just the file location. Did this file-by-file for all 6 touched files (`ControlPanel.vue`, `DarkModeToggle.vue`, `HandDrawnGrid.vue`, `HandDrawnOutline.vue`, `HandwrittenGlyph.vue`, `SvgFilters.vue`) plus the two new files (`boilScheduler.ts`, `rafInstrumentation.ts`), applying the *semantic* change (swap `useLineBoil`/`Animation`-per-cell for the unified scheduler) onto the *current* post-move file content rather than trying to reapply the literal diff.

**New-file placement (a judgment call, since the pre-move topology this diff assumes no longer exists)**:
- `boilScheduler.ts` → `src/skin/composables/boilScheduler.ts` (same bucket as `usePathAnimation.ts`; its `use*` exports are Vue composables and it explicitly retires `useReducedMotion.ts`).
- `rafInstrumentation.ts` → `src/skin/components/dev/rafInstrumentation.ts` (the one existing precedent for gated, non-shipping tooling — `FilterTuner.vue` lives there too).

## 4c. Finding — the move *created* a 3rd independent rAF-chain consumer neither original prototype's file list covers

`two-layer-frontend`'s own refactor (§3 of its report) extracted `ControlPanel.vue`'s inlined "boiling divider line" into a new `BoilDivider.vue` component — a file that did not exist when either `unified-boil-scheduler` or `grain-static-overlay` was authored. `BoilDivider.vue` calls `@mkbabb/pencil-boil`'s `useLineBoil` directly. Grepping the composed tree for `pencil-boil` after the mechanical fixes above would show this call site as "already fine, untouched" — but that's exactly the trap: **it's a genuine 4th independent rAF chain left completely outside prototype 10's "one shared chain app-wide" guarantee**, invisible to anyone diffing only the files each original prototype's own file list mentions. Migrated it too (`useBoilFrame` from the unified scheduler). Documented inline in `BoilDivider.vue` for the next integrator.

This is the load-bearing finding of the mandatory chain: **the set of files that need reconciling after a topology move is not the union of the two patches' own file lists — it's that union *plus* every new file the move itself introduced that touches the same shared primitive.** A merge tool, or an integrator who only resolves `git apply` failures, would never surface this; it only shows up by actually reading what the move's own refactor did.

---

## 5. Composed result — gate evidence (mandatory 4-prototype chain)

Corrected order actually executed: `two-layer-frontend.diff` (raw baseline, supersedes `keyframes5-migration.diff`) → `grain-static-overlay.diff` (path-retargeted) → `unified-boil-scheduler.diff` (hand-reconciled: `--directory=web` fix + import-specifier reconciliation + `BoilDivider.vue` follow-on).

```
$ npm install
added 99 packages, removed 23 packages, changed 5 packages, and audited 209 packages in 1s
# exit 0 — pre-existing 5 vulnerabilities (2 moderate/3 high, transitive dev-tooling), unrelated, unchanged

$ npx vue-tsc -b
# exit 0, zero output

$ npm run build     # vue-tsc -b && vite build, worktree's own default outDir
dist/index.html                       0.91 kB │ gzip:  0.49 kB
dist/assets/index-BVpGzLFE.css       31.21 kB │ gzip:  7.55 kB
dist/assets/vue-vendor-CN_IxHkT.js   65.84 kB │ gzip: 26.08 kB
dist/assets/index-CexEMJRT.js       207.98 kB │ gzip: 70.16 kB
✓ built in 879ms
# exit 0
```

### Playwright smoke (board renders, boil ticks, one interaction)

Built a smoke harness (`pass3/smoke.cjs`) reusing the persisted-`localStorage` board-seeding technique from `unified-boil-scheduler`'s own `measure-chains.cjs` — avoids needing a live FastAPI backend. Served the canonical `dist/` build via `vite preview`:

```
[smoke] grid-line paths=17 glyph paths=81
[smoke] steady boil layers active-before=1 frame@t1=1 frame@t2=3
[smoke] boilScheduler debug = {"chains":1,"subscribers":10}
[smoke] dark toggle: before="" after="dark"
[smoke] ALL CHECKS PASSED
```

- **Board renders**: grid-line paths + all 81 glyph paths present.
- **Boil ticks**: `grain-static-overlay`'s steady-state `.boil-frame-layer.is-active` element's frame index changed (1 → 3) across a 400ms window — the composed grain-static + unified-scheduler interaction is genuinely animating, not just structurally present.
- **Unified scheduler sanity**: `window.__boilSchedulerDebug()` (installed by `rafInstrumentation`-adjacent instrumentation baked into `boilScheduler.ts`) reports **exactly 1 rAF chain, 10 active subscribers** — the composed tree's entire animation surface (grid boil, divider boil ×2 mount sites, dark-mode toggle's 3 `useLineBoil` calls, `SvgFilters`' 3 `useFilterParamBoil` wobbles) rides one `requestAnimationFrame` loop, which is prototype 10's whole thesis, and it survives composition with prototypes 8/9/`two-layer-frontend` intact.
- **One interaction**: clicking the dark-mode toggle flips `documentElement.className` from `""` to `"dark"`.

### A methodological false alarm worth recording

An early smoke run against a `vite preview` invocation *without* an explicit `--outDir` appeared to show the composed app hanging forever in the pre-boil "transition" layer (steady-state boil never appeared, 2+ seconds). Traced this all the way down to reading `@mkbabb/keyframes.js`'s minified `RAFPlayback` scheduling primitive and hand-testing the `rafInstrumentation.ts` monkey-patch for a wrapper bug — before discovering the real cause: `vite preview` without `--outDir` serves the project's **pre-existing, git-tracked `dist/`** (a stale build from before any of this session's patches — itself flagged elsewhere in the audit as hygiene issue G1, dist/node_modules committed to git). Rebuilding into an explicit `--outDir` and re-running resolved it immediately. Recorded here because it's exactly the kind of false positive that would otherwise get reported as a real regression — the fix was a test-harness correction, not a code fix. `dist/` and `node_modules/` were both `git checkout`-restored afterward so the exported diff isn't polluted by rebuild noise (both are pre-existing tracked-artifact issues, out of this task's scope).

---

## 6. Composed diff

Exported at `pass3/composed-frontend.diff` (54 files changed, 2651 insertions, 2147 deletions) — the mandatory 4-prototype chain only (`two-layer-frontend` + `grain-static-overlay` + `unified-boil-scheduler`, with `keyframes5-migration` subsumed as documented in §2).

---

## 7. Optional variant — does `union-prototype.diff` (pass 2.5) compose with the moved topology?

**Yes, after retargeting — verified fully, not just checked.** `union-prototype.diff` was, like `unified-boil-scheduler`, authored against pre-move paths (`src/components/custom/...`, `src/lib/...`); `git apply --check` against the composed tree failed identically (`App.vue` context mismatch + 5 "No such file" errors on moved files).

**Full manual integration performed** (not just a conflict survey), because the two most interesting findings only surface once you actually try to wire it up:

### 7a. A genuine filename collision between two independently-authored prototypes

`union-prototype.diff` creates its own new file, also named `src/lib/boilScheduler.ts` — an **exact filename collision** with prototype 10's own `boilScheduler.ts` (now at `src/skin/composables/boilScheduler.ts`). The two modules have completely disjoint responsibilities: prototype 10's is the actual unified rAF scheduler; union's is a small "hold gate" that *wraps whatever scheduler is in use* to freeze a frame count at 1 while an answer-key overlay is held. Union's own module doc is explicit that this is deliberate, interim scaffolding ("app-local interim; folds into pencil-boil 0.5.0's centralized scheduler gate per design-union §4.1 / prototype 10") — the union author *knew* prototype 10 existed and consciously deferred full integration rather than missing it. Renamed to `boilHoldGate.ts` to resolve the collision; verified against prototype 10's actual `useBoilFrame` implementation that `stop()` leaves `currentFrame` untouched (exactly union's required freeze-in-place contract) — **no changes needed to prototype 10's scheduler itself**, the two compose by construction once the name collision is resolved.

### 7b. The same "move creates a new blind spot" pattern recurs

`union-prototype.diff`'s `ControlPanel.vue` hunk wraps the divider's `useLineBoil(...)` call with its `heldFrameCount(...)` gate — but that call site had *already moved* to `BoilDivider.vue` by `two-layer-frontend`'s own refactor (§4c above). Applying union's hunk literally to `ControlPanel.vue` would be a silent no-op: `ControlPanel.vue` no longer has a divider-boil call to wrap. Retargeted the wrap to `BoilDivider.vue` instead — the actual post-move home of that call site. This is the identical class of gap as the mandatory chain's, confirming it's a systemic property of layering patches across a topology move, not a one-off.

### New-file placement decisions
- `src/lib/boilScheduler.ts` (hold gate) → `src/skin/composables/boilHoldGate.ts` (collision fix, above).
- `src/lib/skin.ts` (the `?skin=union` flag) → `src/skin/skin.ts` (root-level skin-selection flag, parallel to `skin/types.ts`).
- `src/components/sheet/{AnswerKeyLaminate,SheetWashiLabel}.vue` → `src/skin/components/sheet/` (new sibling bucket to `skin/components/{chrome,grid,glyph,decorative,dev}/`).

### Files hand-merged (content reconciliation, not mechanical): 
`App.vue` (peek state + keydown handler + prop wiring + `cardClass`), `useSudoku.ts` (`peekSolution` + cache), `AttributionCard.vue` (button semantics + `.union` vellum-lifted styling), `ControlPanel.vue` (hold-to-peek gesture on both Solve buttons, `SheetWashiLabel` swap on desktop tooltips), `HandDrawnGrid.vue` + `BoilDivider.vue` (`heldFrameCount` wrap), `SudokuBoard.vue` (`AnswerKeyLaminate` mount + 3 new optional props), `index.css` (full `§SHEET` token/utility block).

### Gate evidence (union variant, layered on top of the mandatory-chain tree)

```
$ npx vue-tsc -b        # exit 0
$ npx vite build --outDir ...   # exit 0, 1828 modules transformed, ✓ built in 919ms
```

Smoke test (`pass3` scratch, not exported — see report only): built a second Playwright harness driving `?skin=union`, stubbing `POST /board/solve` so `peekSolution()` resolves deterministically without a backend:

```
[smoke-union] sheet-vellum chrome elements=2
[smoke-union] boil frame before hold: t0=2 t1=2
[smoke-union] laminate visible while held=1
[smoke-union] boil frame while held: h0=1 h1=1
[smoke-union] laminate visible after release=0
[smoke-union] ALL CHECKS PASSED
```

- Union chrome (`.sheet-vellum`) renders under `?skin=union`.
- Press-and-hold Solve (>350ms) → the answer-key laminate mounts and becomes visible (`is-shown`).
- **Boil freeze verified directly**: sampling the active steady-state boil frame twice, 500ms apart, *while held* — frame index identical both samples (`h0 === h1`), confirming `heldFrameCount`'s "collapse to 1, no snap to frame 0" contract holds through the composed scheduler.
- Releasing the hold lifts the laminate (`is-shown` count returns to 0) within the 200ms `LIFT_MS` window.

Extended diff (mandatory chain + union variant) exported at `pass3/composed-frontend-with-union.diff` (60 files changed, 3425 insertions, 2255 deletions).

**Verdict on the optional variant: composes cleanly, but not "for free."** Two real defects had to be fixed (filename collision, stale call-site target) that a naive integrator would either silently ship broken or discover only via a runtime bug report (a page with two same-named-but-different `boilScheduler.ts` files is a straightforward last-import-wins hazard depending on merge order; a `heldFrameCount` wrap on a dead call site is a silent no-op with no compile error). Both are now resolved and empirically verified end-to-end, including the one behavior (freeze-in-place) that is union-prototype's actual raison d'être.

---

## 8. Corrected integration order (for the tranche integrator)

1. Apply `two-layer-frontend.diff` directly to baseline. **Do not** also apply `keyframes5-migration.diff` — it is fully subsumed (§2).
2. Retarget `grain-static-overlay.diff`'s file path (`src/components/custom/HandDrawnGrid.vue` → `src/skin/components/grid/HandDrawnGrid.vue`) and apply — pure path substitution, no content changes needed.
3. Apply `unified-boil-scheduler.diff` with `--directory=web` to fix its path-root bug, then hand-reconcile every touched file's import specifiers against the moved topology (mechanical retargeting is insufficient — §4b). Place the two new files at `src/skin/composables/boilScheduler.ts` and `src/skin/components/dev/rafInstrumentation.ts`. **Additionally migrate `BoilDivider.vue`** (new in the move, invisible to this diff's own file list) to the unified scheduler — skipping this leaves a 4th independent rAF chain outside the "unified" guarantee (§4c).
4. (Optional) Layer `union-prototype.diff`: rename its `boilScheduler.ts` → something collision-free (e.g. `boilHoldGate.ts`) before it lands next to prototype 10's own `boilScheduler.ts`; retarget its `heldFrameCount` wrap for the divider boil from `ControlPanel.vue` to `BoilDivider.vue` (§7b); place its 3 new files under `src/skin/{skin.ts, composables/boilHoldGate.ts, components/sheet/*.vue}`.

Every step above is now applied, gate-verified, and exported (§5–§7).

---

## 9. Files produced

- `pass3/composed-frontend.diff` — mandatory 4-prototype chain, 54 files, gate-verified.
- `pass3/composed-frontend-with-union.diff` — mandatory chain + optional union variant, 60 files, gate-verified.
- `pass3/grain-static-overlay.retargeted.diff` — the path-retargeted single-file diff from §3, applied cleanly with zero content changes.
- `pass3/smoke.cjs` — Playwright smoke harness for the mandatory chain (board render, boil-tick, scheduler-chain-count, dark-toggle checks).
- `pass3/vue-tsc-output.txt`, `pass3/vite-build-output.txt` — raw gate output.
- `pass3/fe-build-out/` — a built artifact from the mandatory-chain tree (evidence copy).
