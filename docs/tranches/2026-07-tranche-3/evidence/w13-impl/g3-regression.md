# T3-W13 GATE g3 — the regression row + repo hygiene

Gate lane, read-only on src. All seven checks run 2026-07-11 from
`/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend`
against the composite W13 working tree (baseline `d0893614` + all six lanes' uncommitted edits).
Verdict: **7/7 PASS** — the regression row of the wave's gate table clears in full.

## Row-by-row

### 1. `npx vite build` — PASS
Clean, `✓ built in 619ms`, PWA precache 22 entries (447.11 KiB), no warnings, no errors.
Bundle: `index-VRQ_tEm-.js` 137.29 kB (gzip 44.86), `index-DAIUbPSa.css` 61.80 kB.

### 2. Full e2e — PASS (44 = the baseline 43, all green, + l6's Test 8)
`npx playwright test` via the repo config (own server; :3001/:3000 untouched):
**44 passed (24.8s)**, zero failures/skips. Per-spec test-count audit vs `d0893614`
(`git show d0893614:… | grep -c '^test('`): every spec's count identical to baseline
except `visual-regression.spec.ts` 7→8 — l6's declared warp-rest-pose addition
(`toggle warp rest pose: wrung into the page, no carousel travel` — green in the run).
No baseline test deleted or renamed away; 43/43 ⊂ 44/44. The wave's "43/43" row is
satisfied with the suite grown by exactly the one declared addition.

### 3. `npm run lint:eslint` — PASS
`eslint .` exits clean, zero output. (Bare `npm run lint` / prettier never run, per discipline.)

### 4. PRM parity AE=0 bound (K38) — PASS on every touched surface
Probe: `g3-prm-probe.mjs` (beside this file; rerunnable). Headless chromium vs :3001,
1440×900 @DPR2, `reducedMotion: 'reduce'`; per surface: drive the gesture, settle, blur,
screenshot PAIR 2.5s apart, exact AE via `magick compare -metric AE` (ImageMagick 7.1.2).
Pairs in `g3-prm/`.

| surface (lanes covered) | AE | functional contract |
|---|---|---|
| settled idle, dark (l1 beat park; l4 outlines+divider; l5 logo/mascot/hover; l6 moon rest stack) | **0** | — |
| settled idle, light (l6 sun rest stack incl. breathe/ray wrappers) | **0** | — |
| toggle gesture (l6) | **0** (pair at +700ms post-click) | theme flips AT click (`html.dark` → `""` + aria-label flips in the same task, `turning` never raised); `.toggle-icon .warp` computed `transform: none` |
| drawer gesture (l2) | **0** (pair at +400ms post-click) | starts open `aria-expanded=true`; click closes, aria truthful `false` at click — same-frame swap, then static |
| hint (l3) | **0** | glyph present at t=150ms with `dash none / off 0` — instant branch, no draw-on, no murmur wiggle across the 2.5s window |
| peek K-hold (l3) | **0** (held throughout the pair) | 40 `.pencil-draw-on` paths, computed `animationName: none`, marks at rest opacity — primitive-inherited instant |

Note on the toggle row's raw probe JSON: `themeAfterClick: ""` is the CORRECT flipped
state (the PRM context loads dark = `html.className "dark"`; light mode carries no class) —
re-verified with a before/after read: `dark`/`Switch to light mode` → ``/`Switch to dark mode`.

### 5. `grain-static` byte-unchanged vs `d0893614` — PASS
`git diff d0893614 -- web/frontend/src/pencil/chrome/SvgFilters.vue`: every hunk sits in
the wobble machinery (watcher deletion, frozen pose-variant `<filter>`s, comments). The
grain branch (`<filter v-if="p.grain">` … `feDisplacementMap in2="grain"`) appears only as
CONTEXT lines — zero edits. The def's params source, `pencilConfig.ts` `"grain-static"`:
the diff adds comment lines strictly ABOVE the preset literal (l4's bake-disposition
truth-up); the value block (`margin: 5`, frequencies, seed, scale) has no diff lines.
Rendered def is byte-identical by construction; the crit-forensics HOLD carries.

### 6. Full-changeset `git diff --stat` review — PASS
31 files changed vs `d0893614` (+1222/−470) + 2 untracked doc paths. Every `web/frontend/*`
path maps to exactly one (or the declared shared two) of the six lanes' exact changed-file
lists — union verified name-by-name, no orphan:
- l1: `package.json`, `package-lock.json` — and the LIBRARY BUMP row holds: the bump's
  entire footprint is the 2-line `package.json` range (`^0.7.0`→`^0.8.1`) + the 8-line
  lockfile hunk (`@mkbabb/pencil-boil` 0.7.0→0.8.1, resolved+integrity only). No test,
  no src file rides it.
- l2: `useControlsDrawer.ts`, `scene.css`, `App.vue`, `e2e/drawer.spec.ts` (declared deviation).
- l3: `index.css`, `HandwrittenGlyph.vue`, `AnswerKeyLaminate.vue`, `useSudoku.ts`,
  `SudokuBoard.vue`, `SudokuCell.vue`, `useFutoshiki.ts`, `FutoshikiBoard.vue`, `FutoshikiCell.vue`.
- l4: `gridPaths.ts`, `HandDrawnOutline.vue`, `BoilDivider.vue`, `pencilConfig.ts` (shared with l5).
- l5: `pencilConfig.ts`, `SvgFilters.vue`, `HandwrittenLogo.vue`, `FilterTuner.vue`,
  both `ControlPanel.vue`s, `OptionSelector.vue`, `CrayonHeart.vue`,
  `e2e/visual-regression.spec.ts` (shared with l6), `e2e/futoshiki.spec.ts`.
- l6: `DarkModeToggle.vue`, `e2e/visual-regression.spec.ts`.

Outside the lane lists — all docs, none app-src, all the W13 AUTHORING loop's own artifacts
(pre-existing before the impl lanes ran): modified `docs/tranches/2026-07-tranche-3/README.md`
(§3b addendum + wave-index row) and `evidence/PATHS.md` (w13 accounting); untracked
`docs/tranches/2026-07-tranche-3/waves/T3-W13-motion-perf-recut.md` and `evidence/w13/`
(the 7 loop reports + exhibits). Expected; flagged for the orchestrator's finalize pathspec
so they ride the commit deliberately.

### 7. pencil-boil repo state — PASS
`/Users/mkbabb/Programming/pencil-boil`: HEAD `da51edb` (0.8.1) atop `8123f47` (0.8.0),
working tree CLEAN; tags `v0.8.0`→`8123f47`, `v0.8.1`→`da51edb` present locally AND on
`origin` (`ls-remote` confirms both); npm `@mkbabb/pencil-boil` versions end
`…, 0.7.0, 0.8.0, 0.8.1` — both publishes live. Matches l1's report exactly, including the
declared 0.8.1 deviation (gate-tripped clock-skew patch; frontend range `^0.8.1`).

## Carried adjudication items (other gate rows, not g3 — named so they don't drop)
1. **l4 divider hoist SSIM 0.9752** vs the idle-perf row's 0.983 line — l4's forensics
   (deterministic, phase-only, all-edge surface; the fallback clause prices the surface in
   memory ~0.26 MB, not SSIM). Belongs to the idle-perf gate row's adjudicator.
2. **PRT 256-path full-key trace** — the draw-ins row's certification item; l3 banked the
   stagger-widen fallback, untraced as of g3.
3. **l6's crest 1.092 vs "~1.08"** and the −15° twist keep — owner-taste checkpoints,
   recorded in l6's report for the owner pass.

## Evidence paths
- `g3-prm-probe.mjs`, `g3-prm/` (12 DPR2 PNG pairs) — this directory
- e2e/build/lint output excerpts — above (rerunnable from web/frontend)
- diffs quoted from `git diff d0893614` in the app repo; pencil-boil state from that repo directly

No src file, no e2e file, no config touched by this lane. Nothing committed anywhere.
