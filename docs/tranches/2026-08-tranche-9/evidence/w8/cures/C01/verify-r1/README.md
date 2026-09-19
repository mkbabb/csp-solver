# C01 · NON-AUTHOR VERIFY, round 1 — VERDICT: REPAIR

Track `bake` · worktree `.claude/worktrees/w8-bake` · branch `w8/bake` · preSha `7b0610cc`
· cure commit `c98e809d` · library commit `3db66cf` on `t9-w8` in the pencil-boil worktree.
Ports 4252 (base `dist-base`) / 4253 (cured `dist`) / 4254 (ablation, mine) — all killed.
I edited no product file, committed nothing, and reset nothing.

    base   index-9rZPzI5DEcpe.js · md5 fa3d1af9870916cc728de11e97f57a90 · 43 files / 806.1 KB
    cured  index-DD23ypDktma1.js · md5 5990c83ef9c29b4397b7da99a6bb762a · 43 files / 806.1 KB

printed at both ends of every set of mine, unmoved. Every number is a PROXY: Playwright
chromium under CDP throttle, or Playwright WebKit with no CDP (no CPU rate, no link, no
`longtask`). No WebKit number is a Safari number and none is an iOS claim (M19 honoured — no
real Safari, no simulator, no perf-rig script run here). Load: `{ 3.62 9.71 11.00 }` at the
first set's start, `{ 21.42 16.93 13.69 }` at the last set's end; sibling lanes shared the host,
which is why every set is interleaved b,c,b,c and every delta is read against both spreads.

## 1. THE MECHANISM IS LAWFUL, AND IT IS TWO HALVES IN TWO REPOSITORIES

`git diff 7b0610cc..HEAD` in this worktree is **one file, one line of code**:
`web/frontend/src/pencil/grid/HandDrawnGrid/HandDrawnGrid.vue:211` — `captureSide` returns `0`
instead of `620` while nothing is measured (+16 lines of comment). No `cacheKey` touched, no
`BOIL_CONFIG`, no `filterBudget`, no dpr, no transition. That is deferral, not drawing less:
`useRasterStack` reads a non-positive box as "not measured yet", the grid keeps rendering its
live-filter fallback exactly as it did while the discarded round was in flight, and the kept
round's box is unchanged (1272 px desk dpr2, verified below). It is on none of the REFUSED
names — in particular it is not "shrink `captureSide`": no bake happens at a smaller box, one
bake stops happening at a box the layout never had.

The other half is `pencil-boil` `src/vue.ts:596-600, 684-712` — the font gate HOLDS `bake()`
until `document.fonts.ready` settles instead of clearing and re-baking. That is scheduling, in
the library that owns the scheduler. Lawful, and the right seam.

**But it is not in this repository, and the branch does not consume it.** See §4.

## 2. THE NUMBERS REPRODUCE — my own windows, my own harness

A · chromium · 4× · Fast-3G · cold · desk 1280×800 · **dpr 2** · 5 windows/arm, interleaved,
0 tainted of 10 · A1's banked `bake-census.mjs`, run from the A1 bank, not from a copy
· load `{ 3.62 9.71 11.00 }` → `{ 9.75 8.65 10.20 }`

| quantity | base median (spread) | cured median (spread) | Δ | outside both | author |
|---|---|---|---|---|---|
| PNG encodes | 28 (28–28) | **16** (16–16) | −12 | YES | −12 ✓ |
| discarded-round blocking ms | 983.3 (975.0–995.8) | **0.0** | −983.3 | YES | −1011.2 ✓ |
| whole encode bill ms | 2031.0 (2010.5–2048.7) | 1053.9 (1051.0–1148.2) | −977.1 | YES | −1058.0 ✓ |
| last encode ms | 3942.3 (3902.0–3953.9) | 2795.2 (2775.2–2983.2) | −1147.1 | YES | −1337.9 ✓ |
| TBT ms | 1445 (1415–1455) | 809 (793–938) | −636 | YES | −758 ✓ |
| board-ready ms | 1384.9 (1378.9–1406.5) | 1396.5 (1373.1–1452.7) | +11.6 | no — inside | inside ✓ |

Direction and sign agree with the author everywhere; my magnitudes run 7–14 % smaller on the
ms rows, which is host load, not a discrepancy — the author's arms were read under a heavier
average. The charter's row-2 target (992.8 ms discarded) is the number I read at base (983.3)
and it goes to zero. Caveat on the accounting: `stats.mjs` prices `discardedMs` only for a
surface with exactly 8 encodes, so a one-round arm reads 0.0 by construction. The independent
rows are the whole encode bill (−977 ms) and TBT (−636 ms); they carry the claim on their own.

C · webkit · unthrottled, NO CDP · cold · desk · dpr 2 · 5 windows/arm, 0 tainted of 10
· load `{ 9.38 8.64 10.15 }` → `{ 8.33 9.00 10.06 }`

| quantity | base (spread) | cured (spread) | Δ | outside |
|---|---|---|---|---|
| encodes | 24 (20–24) | 16 (16–16) | −8 | YES |
| grid rounds | 8, 1240 px → 1272 px, 5/5 windows | 4, 1272 px, 5/5 | −4 | YES |
| discarded blocking ms | 296 (281–324) | 0 | −296 | YES |
| whole encode bill ms | 631 (618–760) | 362 (353–366) | −269 | YES |
| last encode ms | 1039 (968–1278) | 602 (591–617) | −437 | YES |
| **board-ready ms** | **452** (432–474) | **528** (512–539) | **+76** | YES — a regression |

TBT is NOT MEASURED on WebKit (no `longtask`); the 0.0 in both arms is an absence.

## 3. π HOLDS — my own run, not the author's file

`pose-hash.mjs` + `pi-compare.mjs`, 3 windows/arm, chromium 4× Fast-3G cold desk dpr2 and
webkit cold desk dpr2: every surface's shown stack is byte-identical, pose for pose, to the
round the estate keeps today — grid `eb65657f e933f00e 6ac9fa66 f9bdc5fb` @1272 px, logo
`151a026e 1d265c29 165aa06c 0c04acf5` @765, sun `e33f39a8 …` @416, moon `8e55ead1 …` @416,
`cured == base LAST round true` on all four surfaces in both engines. Pose count 4 in every
round of every window. Kept boxes unchanged, so "bake at a smaller box" is not what happened.

Goldens: `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4253 npx playwright test --config
playwright-golden.config.ts` → **4 passed, exit 0**, no `--update-snapshots`, no re-baseline.
Surface e2e through the author's scratch config (verified: it is `playwright.config.ts` with
the `npm run dev` webServer dropped and `baseURL` → :4253, nothing else) — `theme-bake-freshness`,
`filter-census`, `wordmark-integrity`, `visual-regression`, `gallery` (incl. CH-67's capture
invariant), both engines: **70 passed, exit 0**.
`filterBudget` 9: `src/pencil/config/filterBudget.ts` is not in the diff and `filter-census`
is green. The post-font wordmark bake survives: on WebKit the logo's last round is the same
digest set in both arms whether it takes one round or two.

## 4. WHAT FAILS — THE BRANCH DELIVERS THE WEBKIT HALF ONLY (the ablation)

`web/frontend/package.json:71` still reads `"@mkbabb/pencil-boil": "^0.12.0"` and
`package-lock.json:1759-1762` still resolves the registry tarball of 0.12.0, integrity
`sha512-gU4fYELJ8IPVEt7…`. The cured `dist` was built against a LOCAL pack —
`.claude/worktrees/pencil-boil-t9-packs/mkbabb-pencil-boil-0.12.0.tgz`, sha512
`Wb2CKbu7MA8HGivIYEu5ZXmiJdX9/SiFaLSIYTnV5nbf4s0bNi8Ob/dTpYzLPE0UIWghBaVLCOPdHuxnThj9aw==`
— which carries the gate (`fontGateOpen`, present three times in the installed `dist/vue.js`,
and as `g=!0` in the cured `animation-vendor-DwS6EVZwJIKc.js`) while declaring version 0.12.0.
The library's own `package.json` is still `0.12.0` and its CHANGELOG heads the entry
"0.12.1 — unreleased".

So I built the third arm. Stock `@mkbabb/pencil-boil` 0.12.0 (byte-identical to the main
tree's installed copy) + this branch's source, from this track's own private node_modules:
`dist-ablate`, entry `index-CiJpJ54SsMLj.js`. Its `animation-vendor-CrUpJv3U-YcU.js` is
**the same name and the same 11,649 bytes as `dist-base`'s** — which proves two things at once:
the private node_modules reproduces the chair's library output (so the base arm IS honest and
every cured delta is the cure's), and the ablation isolates exactly the library half.

Base vs ABLATION, 3 windows/arm interleaved, same regimes, load `{ 13.60 12.33 11.39 }` →
`{ 14.86 15.49 13.11 }`:

| regime | quantity | base | ablation (branch as committed) | Δ | outside |
|---|---|---|---|---|---|
| chromium 4× desk dpr2 | encodes | 28 | **28** | 0 | no |
| chromium 4× desk dpr2 | discarded ms | 971.8 | **996.5** | +24.7 | no — inside |
| chromium 4× desk dpr2 | encode bill ms | 2033.8 | 2069.7 | +35.9 | no — inside |
| chromium 4× desk dpr2 | TBT ms | 1502 | 1477 | −25 | no — inside |
| webkit desk dpr2 | encodes | 20 (20–24) | 16 (16–20) | −4 | no — inside |
| webkit desk dpr2 | discarded ms | 260 | 0 | −260 | YES |
| webkit desk dpr2 | encode bill ms | 579 | 381 | −198 | YES |
| webkit desk dpr2 | last encode ms | 969 | 633 | −336 | YES |
| webkit desk dpr2 | board-ready ms | 422 | **545** | **+123** | YES |

**On chromium the branch as committed moves nothing at all.** The headline — 28 → 16 encodes,
−983 ms of discarded blocking, −636 ms TBT, and with them `firstBakeMs` −764 and LCP −764 —
is entirely the unpublished library commit. An `npm ci` in this worktree, or CI, or a
production build, restores stock 0.12.0 silently and gives back the 28 encodes. The local pack
also SHADOWS a published version: same version string, different bytes, integrity that does not
match the lock.

The WebKit half does land from the branch alone, and takes its regression with it: the
board-ready stamp is +123 ms in the ablation against +76 ms with both halves.

## 5. THE CHARTER'S ACCEPT ROWS

| accept row | result |
|---|---|
| encodes 28 → ≤ 20 cold on chromium | MET with the library half · **NOT MET from the branch** (28) |
| grid 8 → 4 on both engines | MET (webkit 8→4 verified; chromium grid 8→4 with the library half) |
| discarded ms → 0 | MET both engines with both halves |
| **WebKit stamp − condition-true ≤ 2 frames** | **NOT MET** — board-ready +76 ms (both halves) / +123 ms (branch alone), outside spreads both times; the author reports +98 and the same failure |
| `firstBakeMs` moves and the move is printed | MET as measured by the author (−763.9, chromium 4× mobile dpr3); it rides on the library half |
| per-pose hashes equal | MET — my own run, two engines |
| visual-regression green without a re-baseline | MET — goldens 4/4, e2e 70/70 |

## 6. THE MUST-NOTS

Bake at a smaller box — no (kept boxes identical, digests identical). Skip the post-font
wordmark bake — no (same last-round digests; the gate's own bake IS post-font). Theme-strip a
`cacheKey` — no (`cacheKey` untouched, `theme-bake-freshness` green). Trade the draw-in's
frames for the bake's — no (`BOIL_CONFIG`, draw-in and transition untouched, visual-regression's
draw-in row green). Credited with rows 1+2+4 — no, the author claims row 2 only.

## 7. GATES I RAN MYSELF, bare, in the worktree

| gate | exit |
|---|---|
| `npm run test:unit` | 0 — **Test Files 66 passed (66) · Tests 810 passed (810)** |
| `npm run lint:eslint` | 0 |
| `npm run lint:knip` | 0 |
| `npm run lint:motion` | 0 |
| `npm run lint:boundary` | 0 |
| `npm run lint:tdz` | 0 |
| `npm run lint:copy` | 0 |
| `npm run lint:live-regions` | 0 |
| `npm run typecheck:node` | 0 |
| `npm run typecheck:e2e` | 0 |
| goldens vs :4253 | 0 — 4 passed |
| surface e2e, both engines, vs :4253 | 0 — 70 passed |
| `npm run build` (ablation arm) | 0 |

## 8. THE REPAIR

1. Release the library half: bump `pencil-boil` to 0.12.1, publish it, then bump
   `web/frontend/package.json` and `package-lock.json` off `^0.12.0`, and re-read the chromium
   set against a dist built from the lock. Until that lands, C01's chromium number is not in
   this repository. Do not leave a same-version local pack in a lane's node_modules: it
   disagrees with the lock's integrity and any `npm ci` reverts the cure without a word.
2. The WebKit board-ready stamp regression is an accept row of THIS charter, not C03's to
   inherit by assertion. Either C01 carries the ordering fix, or the chair rules the row
   over to C03 explicitly and C01 folds with a named, banked regression.
3. Watch item, not a blocker: with the hold, a surface now bakes NOTHING until
   `document.fonts.ready` settles, where before a first round landed regardless. On WebKit the
   grid's first encode starts at 273–289 ms cured against 142–153 ms base — the live-filter
   fallback is on screen longer, which is the likely mechanism of the stamp regression and the
   thing that would hurt most on a slow link. A bounded watchdog in the library (bake anyway
   after N ms) would cap it.

## 9. WHAT THE DEVICE STILL OWES

All of the above is chromium-under-CDP or Playwright-WebKit on a shared host. The encode
census, the TBT and LCP moves, and above all the two board-ready regressions want reading again
on the real iOS instance through 8.3, at HEAD and with the cure, by the same rules.
