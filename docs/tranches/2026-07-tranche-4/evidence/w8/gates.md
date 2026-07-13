# T4-W8 — Market facilities · consolidated gate table (VERIFY lane)

Adversarial re-verification against the BUILT DIST (`npm run build` → `vite preview :4188`,
`PLAYWRIGHT_BASE_URL=http://127.0.0.1:4188`). Base SHA `ae2517c2`. Every born-RED state
re-confirmed at base; every facility re-driven independently, not trusted from a lane.

## Verdict: **RED — one blocking regression.** All seven feature gates pass on their own; the
wave breaks the desktop layout: the two new W8 control rows overflow the 1280×800 viewport,
pushing the wordmark off-screen and reding **6 e2e specs + 1 darwin golden** (one root cause).

---

## Full battery

| Gate | Result |
|---|---|
| `npx vue-tsc -b --force` | **PASS** (exit 0) |
| `npm run test:unit` | **PASS** — 244 passed (21 files); +21 (useUserMarks 9 incl. collision gate) +14 (useAssists 8 + cell render) +6 (fill button) |
| `npm run lint:eslint` | **PASS** — clean, exit 0 (the W9 capture-script `no-undef` the M-lanes flagged is absent/clean now) |
| `npm run lint:knip` | **PASS** (exit 0) |
| `npx prettier --check src/` | **PASS** — all matched files clean |
| `npm run build` | **PASS** — 190 modules; avatar emitted `dist/assets/avatar-biqsjs3d.png` (6.09 kB, same-origin); index 188.16 kB / 67.83 kB gz |

## Component gates (born-RED confirmed at `ae2517c2`; after-state driven vs built dist)

| Gate | Born-RED (base) | After — independently verified | Verdict |
|---|---|---|---|
| **editable marks** (A1+A8) | `useUserMarks.ts` absent at HEAD | corner 3 (`1,2,5`) / center 2 (`3,9`) authored, cell value stays empty, zero engine `.pencil-marks` on the cell; two-slot split independent; user notes survive a full engine pin/unpin cycle (5 remain) AND the unit-level collision gate (ref identity through a real peek→refresh→re-peek) | **GREEN** |
| **error-check mode** (A3) | `SudokuBoard` conflict gated `solveState==='failed'` only; no `proactiveErrorCheck` | 3-state over the same pure `findConflicts`: default **on-demand SILENT** (0 invalid on a live duplicate) → Ask arms snapshot (3 shown) → an edit disarms (0) → **Live as-you-go** (6→3, persists across edits). **No mistake counter** — DOM scan finds no heart/lives/mistakes/×3/streak/strikes (only "Live", the mode label) | **GREEN** |
| **persistent candidates** (A2) | engine marks peek-only | default **OFF** (0 engine-mark cells); Candidates On → 46 cells marked persistently, no gesture held; Off → 0; user notes coexist throughout | **GREEN** |
| **peer highlight** (A14) | no peer wash at HEAD (`peerCells` absent both boards) | pure over `focusedPos`, focus-gated: sudoku 0→**20**→0 (row+col+box); futoshiki 0→**8**→0 (=2·(n−1), no box — Latin square) | **GREEN** |
| **attribution parity** (FAM-14) | CSP carried `avatars.githubusercontent.com`; caption "CSP-powered Sudoku solver"; card sudoku-only | **zero third-party network hits** (67 reqs, all `127.0.0.1:4188` or `data:`); avatar same-origin `/assets/avatar-biqsjs3d.png` (naturalWidth 64); 0 CSP violations; futoshiki caption "CSP-powered logic puzzles" | **GREEN** |
| **game-agnostic** | — | facilities live in `games/shared/` (`useUserMarks`, `useAssists`, `PencilModeToggle.vue`, `AssistSettings.vue`); identical prop/emit + union-arbiter wiring in both boards/games; no second implementation | **GREEN** |
| **B3 non-goals** | — | `evidence/w8/m3-parity.md` carries all three DECIDED-retire rows (A12 dailies/streak, A13 stats/leaderboard, A11 pressure-timers→off-by-default) with rationale + re-entry criteria; A15/A16/A17 declared preserved. Nothing silently dropped | **GREEN** |

## Fill-forced button (W7 seam)

| Check | Result |
|---|---|
| drives W7's detector, no duplication | **PASS** — `fillForced()`→`fillForcedSudoku/Futoshiki`→W7 `fillAllForced`; grep finds NO naked/hidden-single detector outside `techniqueEngine.ts` |
| sweep animates | **PASS** — clean sudoku press 1: 25→30 (+5), exactly 5 cells `.cell-reveal-animated` |
| stops at no-forced | **PASS** — sudoku 25→30→34→38→**38 (Δ0, stop)**; futoshiki 17→25→**25 (Δ0)**; M3 fixture 61→80 (+19) reproduced |

## Invariants / platform

| Check | Result |
|---|---|
| **E7 idle-paint** (live enabled, 5 s idle) | **PASS** — live-on == baseline: 0 layouts / 40 recalcs both (CDP `Performance` deltas). Enabling live adds zero idle paints — event-driven on `values`, off the boil beat |
| **Mobile smoke** (iPhone 13, `pointer:coarse`) | **PASS** — marks (corner 2 / center 1) + mode toggle + Live + fill-forced (61→80) all by touch; the WM native-input affordance intact (a cell tap focuses `.cell-native-input`) |
| **WM affordances** | **PASS** — `mobile-affordances.spec.ts` + `mobile-platform.spec.ts` (real `iPhone 13`, 390×844/640) green in the default e2e run |
| **darwin goldens** | **1 MOVE** — `logo-light` reds (0.26 diff, wordmark captured blank). ROOT CAUSE = the controls-card overflow below, not a logo change (logo renders fine at a taller viewport). Re-baseline NOTHING — flag to lead |

## BLOCKING regression (default e2e vs built dist)

`npx playwright test` (built dist, goldens/throttle excluded): **55 passed / 6 FAILED**.

**One root cause.** The desktop controls-card is **936 px** at 1280×800 — it overflows the
800 px viewport by 136 px and pushes `button.logo-trigger` to **top −127** (fully off-screen).
Attribution (measured): W8 added **417 px** to the panel — `pencil-mode-toggle` **149 px** +
`assist-settings` **268 px**; without them the card is ~519 px and fits. This is a **W8**
regression, not W9 (W9's `DifficultyTally` is not in this panel). The Fill button is a single
`justify-evenly` action-row addition — height-neutral, not a contributor.

Symptoms (all from the off-screen wordmark):
- `drawer.spec.ts:58` — board grow/center after drawer close
- `futoshiki.spec.ts:39, 66, 88, 122` — wordmark-listbox game switch + downstream
- `permalink.spec.ts:71` — game-switch URL cleanliness
- `visual-golden` `logo-light-darwin` — the wordmark is off-screen, so the element capture is blank

**Fix owner:** M-lanes / integrating lead — a height-capped or scrollable desktop controls-card
(or relocate/condense the assist rows). Out of the VERIFY lane's scope; touching the panel
layout would collide with the concurrent W9 lane. Once the card fits 800 px, all 7 breakages
clear together (the logo returns on-screen; the listbox is clickable).

## Team-lead outstanding

1. **BLOCKER — desktop controls-card overflow** (above): fix before seal; re-run e2e + goldens after.
2. **Commit the bundled avatar** — `web/frontend/src/pencil/chrome/AttributionCard/avatar.png` (untracked; a root `.gitignore` negation was added). Without `git add` it 404s on a fresh clone/CI and the localization regresses.
3. **darwin golden `logo-light`** — moved because of #1; do NOT re-baseline. It should self-resolve once the overflow is fixed; re-run `test:golden` to confirm before any re-mint.
4. Evidence files (`m1-marks.md`, `m2-modes.md`, `m3-parity.md`, `crops/`, this `gates.md`) are trackable via the docs `.gitignore` negation — include in the wave commit.
