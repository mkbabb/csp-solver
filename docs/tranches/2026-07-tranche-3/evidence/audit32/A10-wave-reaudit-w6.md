# A10 — WAVE RE-AUDIT W6 @ HEAD (3b75eca2)

W6 = commit `b36b7b9f` "T2-W6: affordances — the bound order, PWA-minimal, and beat 9's pencil marks".
Verdict: **HOLDS in full.** All 8 affordances + beat-9 marks live in source at HEAD; PWA precache is
live on the *deployed* site (22 entries, wasm + 3 faces); permalink codec + undo/hint keyboard paths
present both games; e2e = 33. One environmental drift (task-prompt dev-server port) and one stale-memory
correction (deployed site is now post-tranche, not pre-tranche). No repo drift, no uncommitted W6 changes.

## Method
- Read W6 commit body + `--stat` for the enumerated scope.
- Verified each affordance in current source (grep + read, HEAD).
- Probed the **deployed product** `https://sudoku.babb.dev` (curl): sw.js, registerSW.js, manifest,
  hashed CSS/JS/worker chunks, wasm size.
- The `:3000` dev-server the prompt promised is NOT the sudoku app (see Drifts) — deployed site used instead.

## Affordance-by-affordance (HOLDS)

**Items 1–4 + L14 (print / peek-exempt / stale-note / stat-line / washi label)**
- `@media print` block lives: `web/frontend/src/assets/index.css:414`; the layer-precedence inversion
  (print overrides nested in `@layer base` to beat utilities-layer `!important`) is intact at
  `index.css:427`, with the comment explaining the inversion at `:409–413`. Chrome-hide selectors
  (`answer-key-laminate`, `controls-card`, `celebration-star`, masthead, etc.) at `:415–425`.
  **Deployed CSS `assets/index-Bykbkkbm.css` carries `@media print` + those selectors** — HOLD.
- K-peek input-exemption `t.closest('.board-cells')`: `web/frontend/src/App.vue:124` (K/Esc peek owner);
  the marks ride the same `peekActive` (App.vue:105–110) so isolation carries over. Deployed JS shows
  `board-cells` ×2 and `setMarksActive` ×2.
- Stale-note clear widened to any non-graphite tone on idle: `SudokuBoard.vue:245–249`
  (`state === 'idle' && marginTone.value !== 'graphite'`). Deployed JS carries `still sharpening`.
- Backtracks stat-line ×2 games: `SudokuBoard.vue:296–309` ("N backtracks — Xms", graphite Patrick Hand);
  Futoshiki twin present. Deployed JS: `backtrack` ×8.

**Item 5 — bounded undo (Cmd+Z-correct)**: `SudokuBoard.vue:196–201` (`case 'z'`, gated
`e.ctrlKey || e.metaKey`, plain z falls through, emits `redo`/`undo`); Futoshiki twin
`FutoshikiBoard.vue:260–264`. Emits declared `SudokuBoard.vue:47`. HOLD.

**Item 6 — share-on-demand permalink (`?board=`)**: base64url codec both games —
`sudoku/composables/useUrlState.ts:69–83` (encode `${size}.${cells}`, base-36/cell),
`futoshiki/composables/useUrlState.ts:65–83` (`${size}.${cells}.${ineqs}`, inequalities carried).
Q7 resolver amendments present: `decodeBoardParam` synthesizes a `PersistedBoard`, URL-wins-over-storage
(sudoku `:143–167`), mismatch fails closed. `.delete('board')` drop helper (sudoku `:222`, futoshiki `:213`).
Cross-game guard documented `useUrlState.ts:215–217`. Deployed share URL returns 200 (SPA; codec is
client-side, verified in source). HOLD.

**Item 7 — PWA-minimal (generateSW precache-only)**: `web/frontend/vite.config.ts:130`
(`VitePWA`, `strategies: 'generateSW'` :132, `injectRegister: 'script'` :133,
`globPatterns: ['**/*.{js,css,html,wasm,woff2,svg}']` :141, revision:null on hashed assets, no
runtimeCaching :149–151). **DEPLOYED sw.js is live and matches the claim exactly**:
`https://sudoku.babb.dev/sw.js` → HTTP 200, workbox generateSW output, **22 precache entries**,
`revision:null` on all hashed `assets/*`, includes the wasm (`csp_solver_wasm_bg-DUScTLrL.wasm`) and
**all three faces** (`patrickhand`, `fraunces`, `firacode` woff2), plus `manifest.webmanifest` + 3 pwa
icons. `registerSW.js` (134 B) and `manifest.webmanifest` both 200. Index.html links registerSW.js +
manifest. HOLD — and this corrects the stale MEMORY note that sudoku.babb.dev was "STILL PRE-TRANCHE".

**Item 8 — hint ('H')**: `SudokuBoard.vue:206–208` (`case 'H'`, un-gated by ctrl/meta so
Ctrl/Cmd+H falls through, emits `hint` with focused pos); Futoshiki twin `FutoshikiBoard.vue:270–272`.
Emit declared `SudokuBoard.vue:49`. Three keyboard layers (K-peek / undo / hint) stay disjoint. HOLD.

**Beat 9 — engine-domains pencil marks behind the held peek**:
- Wasm ops present: `propagateSudoku` at `csp-solver/wasm/src/sudoku.rs:222` (js_name), `propagateFutoshiki`
  at `csp-solver/wasm/src/futoshiki.rs:286`. **Both live in the deployed worker chunks**:
  `solver.worker-DS2fzlRC.js` (propagateSudoku ×1), `solver.worker-BqxFRgkr.js` (propagateFutoshiki ×1).
- Marks bound to `peekActive` only, never ambient: `App.vue:105–110`, board prop
  `:marks="pencilMarks?.[String(pos-1)]"` (`SudokuBoard.vue:401`, `FutoshikiBoard.vue:450`).
- **Lean artifact size = deployed wasm exactly 90,602 B** (`curl` size_download on
  `csp_solver_wasm_bg-DUScTLrL.wasm`), matching the commit claim `90,602 B < 93,000`. HOLD.

**Gate — e2e 33/33**: `web/frontend/e2e/affordances.spec.ts` present (9 tests, incl. the composed
keyboard spec + its futoshiki twin at `:278`/`:345`), `permalink.spec.ts` (6). Per-file tally:
affordances 9 + futoshiki 4 + permalink 6 + round9 7 + sudoku-interaction 7 = **33**.
`playwright.config.ts` has NO `projects` array (single browser) → 33 spec tests = 33 total, no
multiplication. HOLD.

## Drifts

1. **Environmental (task-prompt, not repo)**: no sudoku dev server is running at `:3000`. `curl :3000`
   → HTTP 000. The Node processes actually listening are unrelated projects — `:5173` = "The
   Connectivity Atlas", `:8090` = "Color Picker", `:4948` = unknown. Live-probe of the W6 affordances
   therefore ran against the **deployed** `sudoku.babb.dev` (which fully carries them), not localhost.
   Tranche-III authoring that wants a local probe must `npm run dev` in `web/frontend` first.

2. **Stale-memory correction (a HOLD, worth flagging)**: MEMORY.md says "Live sudoku.babb.dev is CF
   Pages static and STILL PRE-TRANCHE until the owner redeploys Pages." As of this probe the deployed
   site is **post-tranche**: PWA sw.js live (22-entry precache), lean wasm = 90,602 B (the W6 figure),
   title "Sudoku - CSP Solver", print CSS + marks JS all present. The Pages cutover has happened.

## No-drift confirmations
- `git status --short` on `web/frontend/e2e`, `vite.config.ts`, `src/App.vue`, `csp-solver/wasm/src`:
  clean — no uncommitted W6 changes at HEAD.
- Post-W6 waves (W7 docs, W8 colocation) did not disturb the W6 surfaces: keyboard handlers, codec,
  print block, and wasm ops all resolve at their W6 locations.
