# C06 — THE EXIT MOVER'S OWNERSHIP · the record

2026-09-17 · track `app` · worktree `.claude/worktrees/w8-app` · branch `w8/app` · preSha `7b0610cc`.
Charter: `../charters/C06.md`. Law and acceptance: `../charters/README.md`. ATTRIBUTION row G3, budget B4.

    BASE  AUDIT: build-identity — dist entry index-9rZPzI5DEcpe.js · index.html md5 fa3d1af9870916cc728de11e97f57a90 · 43 files / 806.1 KB
    CURED AUDIT: build-identity — dist entry index-CydLs17Yb6Kt.js · index.html md5 a5354065621a844ebf02a51cfc966251 · 43 files / 806.2 KB

Both lines printed at the start of the reading set and again at its end, unmoved.
Ports: base `dist-base` on 4257's neighbour 4256, cured `dist` on 4257, both `vite preview
--strictPort --host 127.0.0.1`, both killed at the end. `sysctl -n vm.loadavg` bracketed every
regime and is recorded per block below. Up to ten sibling lanes measured on this host
throughout, so every arm's windows are INTERLEAVED b,c,b,c,b,c.

**Every number here is a PROXY**: Playwright chromium under CDP throttle, or Playwright WebKit
unthrottled (no CDP, no `longtask`). No WebKit number is a Safari number and none is an iOS
claim. Real Safari and iOS were forbidden in this session (M19); 8.3 closes the budget.

## 1. The cure

Two lines of code, at the seam the mechanism names.

    web/frontend/src/games/shared/useFlipGlide.ts  — export const FLIP_GLIDE_ANIM_ID = "flip-glide";
                                                     …and `anim.id = FLIP_GLIDE_ANIM_ID` at :run
    web/frontend/src/App.vue:425 boardAnimations()  — …filter((a) => a.id !== FLIP_GLIDE_ANIM_ID)

The charter offered two shapes: tag the movers, or re-order the fold after the last restore.
The TAG is taken, because ordering is the thing that was already luck. `boardAnimations()` is
the one funnel both `snapshotBoardAnims` and `restoreBoardAnims` read through, so the filter
lands once and both halves agree by construction. `Animation.id` is WAAPI's own handle, present
in both engines, and it costs one string assignment per mover and one compare per swept
animation. Nothing about `restoreBoardAnims` is disabled: a `cell-reveal` the Teleport invents
is a CSS animation, is never tagged, and is still finished on the spot.

The mechanism, confirmed at source: `unfoldToBoard` calls `moveLiveBoard(null)` (queues restore
A), then `applyState()`, then `runFold` (queues the fold's own `nextTick`, C). The deck's unmount
inside that flush calls `onLiveFace(null)` → a SECOND `moveLiveBoard(null)`, whose snapshot is
taken before C runs and whose restore (B) is queued after it. So B swept a mover that C had just
created, did not find it in B's snapshot, and finished it. The entry escapes only because its
fold is ordered after its last restore.

No curve was minted and no duration was minted. The exit rides `foldCtl` — the SAME
`useFlipGlide` controller, the same `MOTION.boardFoldMs` 520, the same `MOTION.curves.drawerGlide`
— that the entry already rides. W7 §13 declares the exit's grammar and may re-point it.

## 2. The number it had to move — exit `boardTravel`

`fold-geometry.mjs`, copied byte-identical from `attribution/A7/` (md5 `a896a2891fdffd76819d11764bda5bfd`
both sides); the only thing changed is the `--port` argument it already takes. One window = one
exit cycle; 3 interleaved invocations × 2 cycles = 6 windows per arm per regime. Raws in `raw/geom-*`.

| regime (engine · CPU · link · cache · viewport · dpr) | base exit | cured exit | windows |
|---|---|---|---|
| chromium · 1× · unthrottled · warm · 1280×800 dpr2 | **NO TRAVEL** span 0 px, distinct 1, 6/6 | **GLIDE** span 295.8 px, distinct 45, step share 0.071, 6/6 | 6 / 6 |
| chromium · 4× · unthrottled · warm · 1280×800 dpr2 | **NO TRAVEL** span 0 px, distinct 1, 6/6 | **GLIDE** span 296.2 px, distinct 38, share 0.350, 6/6 | 6 / 6 |
| chromium · 1× · unthrottled · warm · 390×844 dpr3 | **NO TRAVEL** span 0 px, distinct 1, 6/6 | **GLIDE** span 78.0 px, distinct 31, share 0.071, 6/6 | 6 / 6 |
| chromium · 4× · unthrottled · warm · 390×844 dpr3 | **NO TRAVEL** span 0 px, distinct 1, 6/6 | **GLIDE** span 78.2 px, distinct 24, share 0.412, 6/6 | 6 / 6 |
| webkit · 1× · unthrottled · warm · 1280×800 dpr2 | **NO TRAVEL** span 0 px, distinct 1, 5/6 (one window read CUT, share 1.000 — the same instant swap, sampled across two frames) | **GLIDE** span 264.2 px, distinct 24, share 0.185, 6/6 | 6 / 6 |
| webkit · 1× · unthrottled · warm · 390×844 dpr3 | **NO TRAVEL** span 0 px, distinct 1, 6/6 | **GLIDE** span 73.4 px, distinct 19, share 0.146, 6/6 | 6 / 6 |

All figures are medians of the six windows. The base's spread is ZERO — span 0 px, distinct 1,
in 35 of 36 windows across six regimes and both engines — so no delta is inside it. The cure is
not a shift of a distribution; it is a channel that did not exist.

**Against the charter's accept.** Exit distinct widths ≫ 1: 19–45 by regime. Biggest step share
inside the ENTRY's band, measured in the same interleaved windows:

| | entry (control) | exit (cured) |
|---|---|---|
| chromium 1× desk | 0.072 | **0.071** |
| chromium 1× mobile | 0.075 | **0.071** |
| webkit desk | 0.193 | **0.185** |
| webkit mobile | 0.181 | **0.146** |

The charter's bands (0.067–0.08 chromium, 0.138–0.198 WebKit) are the unthrottled ones; at 4×
both directions coarsen together (entry 0.434 / 0.641, exit 0.350 / 0.412) and the exit is the
SMOOTHER of the two in every 4× regime.

**Tainted, named, excluded from the share medians only** (their verdicts still stand): `geom-c4x-mobile-cured-3`
cycle 0 entry read CUT with board distinct 6 AND logo distinct 7 — both movers starved together,
at the reading set's load peak (`vm.loadavg` 19.52). Its exit read GLIDE regardless.

## 3. The mover survives to its own settle

`mover-census.mjs`, copied byte-identical (md5 `5dd109139a51b8c81be665f10e09c805`). Raws in
`raw/movers-*`. SWEEP rows elided below for width; the sweep COUNT is unchanged on both arms
(the park count was never the defect — four sweeps per exit, both arms, both engines).

    BASE  chromium exit: board-peek-host@8.1ms/520ms, logo-menu@8.1ms/520ms, FINISH:board-peek-host@8.5ms,
                         CANCEL:board-peek-host@518.4ms, CANCEL:logo-menu@518.4ms
    CURED chromium exit: board-peek-host@7.7ms/520ms, logo-menu@7.8ms/520ms,
                         CANCEL:board-peek-host@522.6ms, CANCEL:logo-menu@522.6ms

    BASE  webkit   exit: board-peek-host@17ms/520ms, logo-menu@17ms/520ms, FINISH:board-peek-host@17ms,
                         CANCEL:board-peek-host@520ms, CANCEL:logo-menu@520ms
    CURED webkit   exit: board-peek-host@16ms/520ms, logo-menu@16ms/520ms,
                         CANCEL:board-peek-host@530ms/nullms, CANCEL:logo-menu@530ms

The `FINISH:board-peek-host` 0.3–0.4 ms after birth is gone in both engines, 4/4 exit cycles per
arm. The CANCEL at 518–530 ms is `useFlipGlide`'s own settle teardown — the mover reaches the end
of its own 520 ms clock. The ENTRY census is identical on both arms (14 calls, no FINISH).

## 4. T8-M7b's guard still holds

`m7b-guard.mjs` (this cure's, banked here). It re-runs M7b's own question — does the move
re-invent `cell-reveal`? — off the `animationstart` event, which is how the estate's own row in
`sudoku-interaction.spec.ts` asks it. Two modes:

- `--mode settled`, fold a board whose wave has expired: **0 runs, `armedAfter` 0**, 6 windows ×
  2 engines × both arms. 24/24 zero.
- `--mode inwave`, fold at ~790 ms with 61 cells armed and the boot deal's wave still running —
  the case the snapshot/restore pair exists for. Runs recorded after the press, interleaved:
  base **66 / 67 / 67**, cured **67 / 66 / 66** (chromium desk dpr2). Median 67 vs 66, Δ −1
  inside a ±1 spread. `armedAfter` 0 on every window, both arms.

The absolute in-wave count is the deal's own wave finishing plus what the gallery's mount draws;
C06 owes only that it does not move it, and it does not.

## 5. The exit's worst frame is not worse

`fold-frames.mjs`, copied byte-identical (md5 `dffc1cc571c9068ec44c18f3878b145f`). 3 interleaved
invocations × 2 cycles = 6 windows per arm. Raws in `raw/frames-*`.

| regime | mark | base (median of 3 invocation medians) | cured | verdict |
|---|---|---|---|---|
| chromium 4× desk dpr2, warm | exit worst frame | 66.5 ms (66.5 / 68.0 / 60.2) | **60.2 ms** (66.5 / 60.2 / 59.3) | not worse |
| chromium 4× desk dpr2, warm | exit long33 · long50 | 1 · 1 | 1 · 1 | unmoved |
| chromium 4× desk dpr2, warm | exit p95 · fps · bakes | 10.2 ms · 113.2 · 4 | 10.2 ms · 111.8 · 4 | unmoved |
| chromium 4× desk dpr2, warm | ENTRY worst · long33 · bakes | 108.4 ms · 2 · 8 | 106.9 ms · 2 · 8 | unmoved |
| webkit desk dpr2, warm | exit worst frame | 28 ms (34 / 27 / 28) | **27 ms** (27 / 26 / 34) | not worse |
| webkit desk dpr2, warm | exit long33 · bakes | 0 · 4 | 0 · 4 | unmoved |

The 60.2 vs 66.5 ms is inside the arm's own 59–68 ms spread and is NOT claimed as a gain. The
claim is the charter's: the exit's worst frame did not get worse for having drawn 520 ms more.

The exit's animation census carries the delta plainly — at 82, 120 and 211 ms after the press the
cured arm holds exactly ONE more live animation than the base (5 → 6, and 2 → 3 at 300 ms). That
one is the board.

## 6. π identity

- Goldens, cured dist, `playwright-golden.config.ts`, never `--update-snapshots`: **4 passed**,
  exit 0. Nothing moved. Goldens are resting frames and the cure only lets a transition draw.
- `filterBudget` 9, pose count 4: `lint:eslint`, `test:unit` (810/810) and the census row green;
  no bake dropped, no boil thinned, no filter removed, no transition shortened. Exit bakes 4 per
  fold on both arms, entry 8 on both.
- The transition DRAWS MORE — 520 ms of board travel that never rendered. That is the motion
  DELTA the charter routes to W7 §13, which declares the exit's grammar and may re-point this.

## 7. Gates, bare, with exit codes

Logs in `gates/`.

    test:unit          0   Test Files 66 passed (66) · Tests 810 passed (810)
    lint:eslint        0
    lint               0
    lint:knip          0
    lint:boundary      0
    lint:tdz           0
    lint:copy          0
    lint:live-regions  0
    lint:motion        0
    typecheck:e2e      0
    typecheck:node     0
    golden (cured)     0   4 passed
    e2e surface        0   170 passed, BOTH engines, against the cured dist

The e2e surface run is `gallery · gallery-deal · gallery-guard · board-covisibility · drawer ·
masthead-alignment · sudoku-interaction` (the filename match also swept `spoken-gallery`), through
`playwright-c06.config.ts` banked here: a copy of `web/frontend/playwright.config.ts` with the
`webServer` DROPPED and `baseURL` pinned to the cured port. `drawer.spec` is in the list because
`useFlipGlide` is the drawer's own engine and the wave's named risk — it is green, both engines.
Playwright cannot resolve `@playwright/test` from under `docs/`, so the run copies this file to
`web/frontend/playwright-c06.scratch.config.ts`, runs, and deletes it; nothing was committed.

## 8. `vm.loadavg`, both ends of every set

    geometry chromium 1× desk      start 18.97 13.09→18.89 …   end 14.44 18.22 14.08
    geometry chromium 4× desk      start 14.44 18.22 14.08     end 16.23 17.49 14.10
    geometry chromium 1× mobile    start 13.28 16.78 13.91     end 13.33 15.88 13.76
    geometry chromium 4× mobile    start 13.33 15.88 13.76     end 19.52 16.28 14.01   ← the taint's peak
    geometry webkit desk           start 19.89 16.48 14.11     end 25.73 18.03 14.82
    geometry webkit mobile         start 25.73 18.03 14.82     end 11.53 15.28 14.03
    mover census chromium desk     start 10.37 14.56 13.84     end  8.99 13.97 13.64
    mover census webkit desk       (inside the block above)    end  7.64 13.26 13.39
    m7b settled, both engines      start  6.69 12.46 13.10     end  7.48 11.45 12.66
    m7b in-wave, interleaved       (start as above)            end 11.46 12.06 12.82
    fold-frames chromium 4× desk   start  6.70  9.23 11.41     end  5.63  8.36 10.91
    fold-frames webkit desk        start  5.31  8.20 10.82     end  5.24  7.71 10.46
    end of readings, both arms re-identified                   end 25.44 14.99 12.90

The host ranged 5.2–25.7 across the sets, which is exactly why every arm is interleaved: the
drift is shared and cancels in the pair. The one window where it did not cancel is named in §2.

## 9. What this cure does NOT claim

- No device number. M19 held: no real Safari, no iOS, none of `perf-rig/`. B4's RED is the
  device baseline and 8.3 sets it.
- No `ms` of first paint. C06 is a gesture-path cure; it touches nothing before board-ready.
- The exit's grammar is still UNDEFINED (no beat 0, no un-deal, three easing vocabularies,
  controls landing 120 ms before the wordmark). C06 fixes ownership, not the grammar. W7 §13.
