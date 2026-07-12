# T3-W13 RE-GATE rg2 — regression after the correction lanes (c1, c2, c3)

Read-only on src; nothing committed, no repo file touched. All checks run 2026-07-12 from
`/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend` against the
composite W13 working tree (baseline `d0893614` + six impl lanes + three correction lanes,
uncommitted). Dev server :3001 confirmed alive (HTTP 200) before and used only for probes.

Verdict: **5/5 PASS**.

## 1. `npx vite build` — PASS

Clean, zero warnings/errors:

```
dist/assets/index-QARPYg8w.css                  61.52 kB │ gzip: 13.02 kB
dist/assets/index-DfqOCJ0c.js                  135.87 kB │ gzip: 44.53 kB
✓ built in 303ms
PWA v1.3.0 … precache 22 entries (445.54 KiB)
```

## 2. Full e2e — PASS, exact count **44 passed (18.0s)**, 0 failed, 0 skipped

`npx playwright test` via the repo playwright config (own server; :3001/:3000 untouched).
The post-W13 baseline was 44 (g3: 43 baseline tests + l6's declared Test 8); this run is the
same 44, all green — no throttled-void flake, no affordances data-conditional skip this run
(c3 had hit both; neither recurred).

Per-spec `grep -c '^test('` audit vs `d0893614`: every spec count identical except
`visual-regression.spec.ts` 7→8; test-title diff per spec shows ZERO baseline titles changed,
renamed, or deleted — the single addition is l6's
`toggle warp rest pose: wrung into the page, no carousel travel` (green in the run, ✓ #41).

Assertion-change audit, matched to declared lists:
- `e2e/drawer.spec.ts` — all three diff hunks (@@-44, @@-53, @@-77) sit in the test-2 region
  (first hunk is test 2's header comment; the other two its body): exactly l2's declared
  classic-FLIP re-truing + c2's declared audit-4 re-truing (horizontal/monotone/
  zero-overshoot/one-ledgered-curve, 4 movers). Drawer tests 4/4 in the run, all green.
- `e2e/visual-regression.spec.ts` — hunks in registry/light-mode/grid-draw-in (l5's declared
  pose-variant + logo count-4 assertions) and the appended Test 8 (l6, re-trued by c1 to the
  whole-icon sun shape: 1 visible pose, `wobble-celestial-p\d`).
- `e2e/futoshiki.spec.ts` — the one declared l5 change only (`.first()` on the wordmark text,
  pose-stack disambiguation).

## 3. `npm run lint:eslint` — PASS

`eslint .` exits 0, zero output. (Bare `npm run lint`/prettier never run, per discipline.)

## 4. PRM parity AE=0 on the three re-touched surfaces — PASS (all AE = 0)

Probe: `rg2-prm-probe.mjs` + `rg2-prm-readout.mjs` (this dir, rerunnable); g3's recipe
verbatim — headless chromium vs :3001, 1440×900 **@DPR2**, `reducedMotion: 'reduce'`,
full-page screenshot PAIR 2.5s apart, exact AE via `magick compare -metric AE`.
Pairs in `rg2-prm/`.

| surface (lane) | AE | functional contract |
|---|---|---|
| toggle idle, light (c1 — whole-icon sun rest stack) | **0** | 10 svgs in `.sun-moon-toggle`, exactly the rest-pose actives visible, live icon pair `visibility: hidden`, `.warp` computed `transform: none`, 0 animations inside the toggle |
| toggle idle, dark (c1 — moon stack, regression) | **0** | same contract, same readout |
| drawer gesture (c2 — S5/S3′ recut, DrawerTab PRM override deleted) | **0** (pair from +400ms post-click) | aria-expanded truthful `false` at click (same-task swap); ZERO WAAPI movers ever created — post-click `getAnimations()` contains only discrete `visibility` CSSTransitions on the hiding controls + the pre-existing cell-reveal CSSAnimations (23 present before the click too); the gesture path never runs under PRM |
| laminate PRT arm (c3 — 16×16 `?size=4` + `prefers-contrast: more`, K held across the pair) | **0** | **256/256** key paths read `animationName none / opacity 0.9 / dashoffset 0px` at +600ms — instant, primitive-inherited; contrast arm confirmed active |

(The first probe's toggle `svgCount: 0` was a probe-selector artifact — root class is
`.sun-moon-toggle`, not `.dark-mode-toggle`; re-read with the correct selector above. Its
synchronous in-click-task `getAnimations` 72 likewise attributed: button visibility
transitions + reveal animations, zero WAAPI, static by +400ms — AE=0 stands.)

## 5. Full-changeset hygiene — PASS, zero strays

`git status --porcelain`: **32 modified + 2 untracked**, re-run fresh this session. Union
map, name-by-name (g3's 31-file map + exactly one delta):

- **l1**: `web/frontend/package.json`, `package-lock.json` (pencil-boil `^0.8.1` bump).
- **l2 ∩ c2**: `src/games/shared/useControlsDrawer.ts`, `src/games/shared/scene.css`,
  `src/App.vue`, `e2e/drawer.spec.ts`.
- **c2 alone (the one delta vs g3's map)**: `src/games/shared/DrawerTab.vue` — declared in
  c2's exact list (spring-transition rule + dead PRM override deleted).
- **l3 ∩ c3**: `src/pencil/sheet/AnswerKeyLaminate.vue` (c3's only file); l3's remaining
  eight: `src/assets/index.css`, `src/pencil/glyph/HandwrittenGlyph.vue`,
  `src/games/sudoku/composables/useSudoku.ts`, `SudokuBoard.vue`, `SudokuCell.vue`,
  `src/games/futoshiki/composables/useFutoshiki.ts`, `FutoshikiBoard.vue`, `FutoshikiCell.vue`.
- **l4**: `src/pencil/grid/gridPaths.ts`, `HandDrawnOutline.vue`,
  `src/pencil/chrome/BoilDivider.vue`.
- **l5**: `src/pencil/chrome/SvgFilters.vue`, `HandwrittenLogo/HandwrittenLogo.vue`,
  `src/pencil/dev/FilterTuner.vue`, both `ControlPanel.vue`s,
  `src/pencil/chrome/OptionSelector/OptionSelector.vue`,
  `AttributionCard/CrayonHeart.vue`, `e2e/futoshiki.spec.ts`.
- **l4 ∩ l5 ∩ c1 ∩ c2**: `src/pencil/config/pencilConfig.ts` (bake comment / pose helpers /
  `sunRays` retirement / `MOTION.curves.drawerGlide` — all four declared).
- **l6 ∩ c1**: `src/pencil/celestial/DarkModeToggle.vue`; `e2e/visual-regression.spec.ts`
  (shared l5/l6/c1, all declared).
- **Tranche docs (the authoring loop's own, expected)**: modified
  `docs/tranches/2026-07-tranche-3/README.md` + `evidence/PATHS.md`; untracked
  `docs/tranches/2026-07-tranche-3/waves/T3-W13-motion-perf-recut.md` + `evidence/w13/`.

`git diff --stat`: 32 files, **+1277/−461** — every path in the table above, no orphan hunk.
**Stray count: 0.** No untracked file exists anywhere outside the two declared doc paths.

## Artifacts

- `rg2-prm-probe.mjs`, `rg2-prm-readout.mjs`, `rg2-prm/` (8 DPR2 PNG pairs) — this directory
- build/lint/e2e excerpts above, rerunnable from `web/frontend`

— re-gate rg2, 2026-07-12.
