# C01 round 2 — the non-author verification · VERDICT: REPAIR

2026-09-17 · track `bake` · worktree `.claude/worktrees/w8-bake` @ `67545682` · ports 4252 (base) / 4253 (cured).
I did not write this cure. Every number below is mine, read on my own interleaved windows.

## The arms

| arm | served | dist-identity |
|---|---|---|
| base | :4252 `dist-base` | `index-9rZPzI5DEcpe.js` · index.html md5 `fa3d1af9870916cc728de11e97f57a90` · 43 files / 806.1 KB |
| cured | :4253 `dist` | `index-BUi8Y5fyFrJc.js` · index.html md5 `3adf593a01bb5f0e28ab2d2a991174df` · 43 files / 806.4 KB |

Both printed at both ends of every reading set, unmoved (`dist-identity.txt`).

**The cured dist IS the branch.** I rebuilt HEAD myself into a scratch outDir (`npx vite build
--outDir dist-verify`, which skips the `prebuild` wasm step — `csp-solver/wasm/pkg` is a symlink
into the main tree and must not be written) and got `index-BUi8Y5fyFrJc.js` with index.html md5
`3adf593a01bb5f0e28ab2d2a991174df`, 43 files / 806.4 KB. Byte-for-byte the author's arm. Scratch
dir removed.

**The library is stock, and that is the round-1 finding closed.** `diff -r` between the main
tree's registry-installed `@mkbabb/pencil-boil` and the worktree's copy is EMPTY; `dist/vue.js`
md5 `e4527557bd917949724aeca81b06ae46` in both; `fontGateOpen` absent from the library; the
built `assets/animation-vendor-CrUpJv3U-YcU.js` is the same name and the same md5
`248be219af42f4b079ef2070678815ab` in dist and dist-base. Only four product files move
(`git diff --name-only 7b0610cc..HEAD`), all under `web/frontend/src/pencil/`.

Residue, not blocking: the worktree's `node_modules/.package-lock.json` still RECORDS
`"resolved": "file:../../../pencil-boil-t9-packs/mkbabb-pencil-boil-0.12.0.tgz"` with integrity
`sha512-Wb2CK…` where `package-lock.json` (clean, committed) says the registry's `sha512-gU4fY…`.
The bytes on disk are the registry's, the pack directory is now empty, and nothing tracked is
affected — but the install metadata lies about its provenance, and the chair's law said this
worktree's `node_modules` would be a SYMLINK into the main tree. It is a real directory.

## What I reproduced (interleaved b,c,b,c… · median · spread · load at both ends)

`stats-*.txt`, `cp-w-desk.txt`, `pi-*.txt`. Instruments are the author's banked copies run
unmodified — only `--port` differs — so this dir keeps `instr/interleave.sh` (the harness, with
my evidence root and my ports) and nothing else; the per-window JSONL raws and the instrument
copies were deleted after summarizing to hold the wave's text cap. Every summary here prints its
own per-window table, so each median can be re-read without them. Taint 0 in every window of
every set.

### chromium · 4× · Fast-3G · cold · 1280×800 dpr 2 · 5 + 5 windows · load 33.74 → 21.05

| quantity | base (spread) | cured (spread) | Δ | outside both spreads |
|---|---|---|---|---|
| encodes | 28 (28–28) | 16 (16–16) | −12 | YES |
| discarded ms | 1338.0 (1032.5–1463.5) | 0.0 | −1338.0 | YES |
| whole encode bill | 2698.4 (2239.1–3036.0) | 1334.0 (1072.0–1661.4) | −1364.4 | YES |
| last encode | 4841.4 (4202.8–5421.9) | 3220.9 (2851.3–3856.4) | −1620.5 | YES |
| TBT | 2082 (1641–2452) | 1084 (822–1479) | −998 | YES |
| board-ready | 1497.2 (1418.8–1580.3) | 1454.4 (1382.3–1587.0) | −42.8 | no — not a move |

Per surface, 5/5 windows both arms: base `grid 8 · sun 8 · moon 8 · logo 4`, cured
`grid 4 · sun 4 · moon 4 · logo 4`. My host ran heavier than the author's, so my absolute ms are
larger; the direction, the counts and the disjointness are theirs.

### chromium · 1× · unthrottled · cold · desk dpr 2 · 3 + 3 · load 37.53 → 45.84
encodes 28 → 16 · discarded 361.2 → 0 · bill 746.6 → 379.0 · last encode 1148.1 → 660.9 ·
TBT 234 → 133. All disjoint.

### chromium · 4× · Fast-3G · WARM (second navigation) · desk dpr 2 · 3 + 3
encodes base 20 (16–20, the race) → cured 16 (16–16) in every window: the charter's ≤ 20 ceiling
holds and stops racing. Bill 1849.0 → 1094.0 (disjoint) · TBT 1344 → 800 (disjoint).

### webkit · unthrottled, NO CDP · cold · desk dpr 2 · 5 + 5 · load 21.72 → 31.30
grid 8 encodes @1240 → 1272 px in 5/5 base windows becomes 4 @1272 in 5/5 cured.
**board-ready 551 (499–640) → 272 (196–378), Δ −279 ms, disjoint.** Round 1's regression is
reversed; the author read −215, I read −279.

### webkit · cp-probe · desk dpr 2 · 5 + 5 · load 24.42 → 20.30
condition-true 159 → 168 (unmoved) · stamp 530 → 259 · **gap 371 (339–405) → 91 (82–119)**.
The charter's accept row (≤ 2 frames ≈ 33 ms) is NOT MET at 91 ms, as the author says; HEAD
misses it by 371. Routed to C03 with its number.

### Not re-run by me
chromium 6×; mobile 390×844 dpr 3 (A6 `readiness-timeline.mjs`, `firstBakeMs` / LCP / TBT(3000)).
The author's own return retires the round-1 `firstBakeMs` −763.9 row as unbankable (the base arm
records it in one window of five) and retires the round-1 `controlsInteractiveMs` regression as
inside the spread. I take no position on rows I did not read; the charter's accept row
"`firstBakeMs` moves and the move is printed" therefore stands UNDEMONSTRATED.

## π

`playwright-golden.config.ts` against :4253, no `--update-snapshots`: **4 passed, exit 0**, and
`git status` in the worktree is clean afterwards — no golden file touched.

`pose-hash.mjs` + `pi-compare.mjs`, 3 windows per arm, three regimes, all run by me:
`pi-c4x-desk.txt`, `pi-c1x-desk.txt` (the charter's 1× trap), `pi-w-desk.txt`. Every surface:
`cured == base LAST round true`, exit 0. Boxes unchanged in both arms — grid @1272, logo @765
(webkit 762), sun/moon @416. Nothing bakes smaller.

`filterBudget` 9 and `BOIL_CONFIG.frameCount` 4 untouched (`filter-census` green in both
engines; the census unit test green).

## Gates, bare, in the worktree

| gate | exit |
|---|---|
| `npm run test:unit` | 0 — **Test Files 66 passed (66)**, **Tests 810 passed (810)** |
| `npm run lint:eslint` | 0 |
| `npm run lint` | 0 |
| `npm run lint:knip` | 0 |
| `npm run lint:motion` | 0 |
| `npm run lint:copy` | 0 |
| `npm run lint:tdz` | 0 |
| `npm run lint:boundary` | 0 |
| `npm run lint:live-regions` | 0 |
| `npm run typecheck:e2e` | 0 |
| `npm run typecheck:node` | 0 |
| `npx vue-tsc -b` | 0 |
| surface e2e, both engines, scratch config → :4253 (theme-bake-freshness, filter-census, wordmark-integrity, visual-regression, gallery incl. CH-67) | 0 — 70 passed |

## THE FINDING THAT RULES REPAIR

**On WebKit the font gate opens BEFORE the wordmark's face has landed, and the wordmark now
bakes a BLANK round in nearly every cold load.**

`web/frontend/src/pencil/composables/rasterPose.ts:118` reads `document.fonts.ready` inside
`openFontGate()`, which line 131 calls at MODULE EVALUATION — before the page's faces are
requested. WebKit hands out a `ready` promise that settles against the font set as it stands at
the moment it is read, so the app's gate opens at ~114 ms while the library's own gate (its
`fonts.ready` is read later, at `useRasterStack` setup — `node_modules/@mkbabb/pencil-boil/dist/vue.js:600-606`)
settles after the real face. The app therefore releases `HandwrittenLogo.vue:357` into a bake of
the wrong state, and the library's clear then re-bakes it.

Measured, webkit · unthrottled · cold · desk dpr 2, from `pi-w-desk.txt` and `raw/w-cold-desk/`:

| arm | logo encodes | round 1 | round 2 |
|---|---|---|---|
| base | 4 in 8 of my 10 windows | the real stack, 22,095–22,252 B per pose | — |
| base | 8 in 2 of my 10 windows | `9e8083d8` ×3 at **3,152 B** + one real | the real stack |
| cured | **8 in 8 of my 8 windows** (5 census + 3 π) | `9e8083d8` ×3 at **3,152 B** + one real | the real stack |

A 3,152-byte pose against 22 kB is an empty wordmark: three of the four poses of round 1 encode
to the SAME digest. The author's own round-2 raws agree — `fix-r1/raw/w-cold-desk/`: base 2 of 5
windows, cured 4 of 5. So the blank round pre-exists intermittently and the cure makes it the
rule: base 3/15 windows across both readers, cured 12/13.

Three consequences:
1. The cure's central claim fails on the surface the charter singles out. `HandwrittenLogo.vue:353-357`
   states in the tree, as the reason for the change, "the gate opens on `fonts.ready`, so this
   bakes the real face, once". It bakes the fallback first, then the real face, in 8 of 8 of my
   WebKit windows. A comment that the measurement refutes cannot land.
2. The author's WebKit row is misattributed. The return reads "the grid's own discard 39 ms
   (0–44)". `stats.mjs` sums the discard over surfaces with 8 encodes; the cured grid has 4, so
   that number is not the grid's — it is the wordmark's new blank round. I read 46 ms
   (41–301). The charter's "discarded ms → 0" is met on chromium and NOT met on WebKit.
3. It costs nothing to fix. The −12 encodes are entirely grid (−4), sun (−4), moon (−4); the
   logo is 4 → 4 on chromium in both arms, so the wordmark never needed the gate. Dropping
   `fontGatedBox` from `HandwrittenLogo.vue:357` (leaving the grid and the two celestials gated)
   restores the base arm's single correct WebKit round and moves no chromium number. If the gate
   is to stay on the logo instead, it has to wait on the FACE — `document.fonts.load()` for the
   wordmark family, or a `fonts.ready` read late rather than at module scope.

π as the charter defines it is not broken by this: the stack the estate SHOWS after settle is
byte-identical, pose for pose, in all three regimes. What is broken is the round before it.

## The must-nots, one by one

| clause | reading |
|---|---|
| bake at a smaller box | NO. Grid 1272, logo 765/762, sun/moon 416 — identical in both arms, printed per encode. |
| skip the post-font wordmark bake | NOT SKIPPED. The post-font round is the one that survives in every window, and its digests equal base's. |
| theme-strip a `cacheKey` | NO. `HandDrawnGrid.vue:233` still carries `-${isDark ? "d" : "l"}`; no cacheKey line moved. |
| trade the draw-in's frames for the bake's | NO. Nothing in the diff touches leg 1; `lint:motion` green; the diff is four `cssSize` call sites and one module-level gate. |
| credited with rows 1 + 2 + 4 | NOT CLAIMED. The return prices row 2 alone and routes the leftovers to C03. |
| a bake dropped / a boil thinned / a filter removed / a transition shortened / DPR lowered | NO on all six: `frameCount` 4, `filterBudget` 9, no filter or pose count moved, the DPR cap comment is untouched, pose count 4 on every surface in both arms. |
| the REFUSED list by name | The seed change at `HandDrawnGrid.vue:209` (620 → 0) is NOT "shrink `captureSide`": 620 was a pre-measurement guess, the MEASURED side is unchanged at 1272 in both arms, and the π hashes prove the kept bitmap is the same. Nothing else on the list is approached. |
| REFUTED list | Nothing re-proposed. |
