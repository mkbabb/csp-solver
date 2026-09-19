# T9-W8 §8.2 · C01 — ONE BAKE ROUND, NOT TWO

Track **bake** · worktree `.claude/worktrees/w8-bake` · branch `w8/bake` · preSha `7b0610cc`
· cure commit **`c98e809d`** · library commit **`3db66cf`** on `t9-w8` (pencil-boil worktree).
Ports 4252 (base, `dist-base`) / 4253 (cured, `dist`); both killed at the end.
Charter: `../charters/C01.md`. Law and acceptance: `../charters/README.md`.

    base  index-9rZPzI5DEcpe.js · md5 fa3d1af9870916cc728de11e97f57a90 · 43 files / 806.1 KB
    cured index-DD23ypDktma1.js · md5 5990c83ef9c29b4397b7da99a6bb762a · 43 files / 806.1 KB

printed at both ends of every reading set (`dist-identity-{before,after}.txt`, both unmoved),
with the control build that proves the base arm reproduces from this track's own node_modules.

**Every number below is a PROXY.** Playwright chromium under CDP throttle, or Playwright WebKit
with no CDP at all — no CPU rate, no link, no `longtask`. No WebKit number is a Safari number
and none is an iOS claim. Real Safari and iOS were forbidden here (M19); the device closes each
budget through 8.3. Up to ten sibling lanes shared this host; `sysctl -n vm.loadavg` is stamped
at both ends of every set and every delta is read against its arm's own spread.

## 1. THE SEAM, and why it is two files

Two engines, two mechanisms — the charter named both, and each turned out to live on its own
side of the library boundary.

**Chromium — the font gate threw away a round it had just paid for.** `useRasterStack`'s gate
was `fontsReady.then(() => { clearStacks(); return bake(); })`. Correct about staleness, and it
charged a full round for the privilege: any surface whose box settled before the webfont
resolved baked, was cleared, and baked again. Four surfaces, 28 encodes to show 16.
**Cured in the library** (`pencil-boil` `src/vue.ts`): the gate now HOLDS — `bake()` is a no-op
until `fonts.ready` settles, and the gate's own bake is the first round. `clearStacks()` stays
where it was, as the invariant rather than the mechanism.

*Why the library and not the app.* The gate is the library's own scheduler. An app-side version
means each of the four `useRasterStack` call sites gating its own `cssSize` on
`document.fonts.ready` — four copies of a gate the library already owns, racing it, with the
library's clear still firing behind them. That is the charter's "would duplicate or fight the
library's own scheduler", exactly.

*Why HOLD and not "gate the clear on text-bearing stacks".* The charter offered both. Gating the
clear keeps the FIRST round's bytes — the gate's `bake()` would find a cache hit and serve the
pre-font stack. Holding keeps the SECOND round's moment. The π obligation is written in favour
of the second round, so only one of the two forms was available. (§4 revises what the trap
actually is, and the choice survives the revision either way.)

**WebKit — the grid seeded its capture box with a number nobody had measured.**
`HandDrawnGrid.vue:192` read `s > 0 ? Math.round(s / 4) * 4 : 620`. The library reads a
non-positive box as "not measured yet" and holds; a positive one it takes at its word. On WebKit
`fonts.ready` lands at 112–148 ms and the ResizeObserver's first `contentRect` at 129–169
(`raw/diag-box-webkit-base.jsonl`), so the gate's bake fired against the seed every time: a
620 × dpr round, discarded whole when the real box arrived and re-keyed. Chromium never showed
it because its box lands ~30 ms BEFORE `fonts.ready`, not after.
**Cured app-side** (`web/frontend/src/pencil/grid/HandDrawnGrid/HandDrawnGrid.vue`): the seed is
`0`. The guess was the app's; the library's contract was already right.

Neither half fixes the other engine: with only the library hold, WebKit still bakes the seed
then re-keys; with only the seed fix, chromium still clears and re-bakes. Both landed.

## 2. THE NUMBERS

Interleaved b,c,b,c… one window per invocation of A1's banked `bake-census.mjs`, so host drift
falls on both arms equally. `instr/` holds every instrument with the copy note in its head;
`instr/stats.mjs` prints each window and then the delta against both arms' spreads.

### A · chromium · 4× · Fast-3G · cold · desk 1280×800 dpr2 · 5 windows/arm · 0 tainted of 10
load `{ 28.86 15.05 12.88 }` → `{ 23.35 16.45 13.63 }` · `stats-c4x-fast3g-cold-desk.txt`

| quantity | base median | base spread | cured median | cured spread | Δ | outside both spreads |
|---|---|---|---|---|---|---|
| PNG encodes | 28 | 28–28 | **16** | 16–16 | −12 | YES |
| **discarded-round blocking ms** | **1011.2** | 995.2–1155.8 | **0.0** | 0–0 | **−1011.2** | YES |
| whole encode bill, ms | 2131.3 | 2061.5–2352.1 | 1073.3 | 989.1–1092.8 | −1058.0 | YES |
| last encode, ms from nav | 4167.3 | 3993.8–4530.0 | 2829.4 | 2818.5–2863.6 | −1337.9 | YES |
| TBT (Σ longtask−50), ms | 1582 | 1470–1813 | 824 | 752–849 | −758 | YES |
| board-ready, ms | 1430.4 | 1399.4–1527.9 | 1407.5 | 1382.4–1409.7 | −22.9 | no — inside |
| PNG bytes encoded | 2,580,978 | — | 1,334,086 | — | −1,246,892 | — |

The charter's row-2 number is **992.8 ms** (lane A1's own windows; refuter 1,034.3). This arm
reads **1,011.2** on the same instrument and takes it to **0.0**, 5 windows of 5.
Board-ready does not move on chromium and was never expected to: no bake starts before it in any
chromium regime (A1 §1, its refuter concurring).

### B · chromium · 6× · Fast-3G · cold · desk dpr2 · 3 windows/arm · 0 tainted of 6
load `{ 8.71 11.31 11.93 }` → `{ 10.83 11.36 11.89 }` · `stats-c6x-fast3g-cold-desk.txt`

| quantity | base | cured | Δ | outside |
|---|---|---|---|---|
| encodes | 28 | 16 | −12 | YES |
| discarded blocking ms | 1404.6 | 0.0 | −1404.6 | YES |
| whole encode bill ms | 2853.2 | 1579.4 | −1273.8 | YES |
| last encode ms | 5183.4 | 3704.6 | −1478.8 | YES |
| TBT ms | 2291 | 1380 | −911 | YES |
| board-ready ms | 1577.0 | 1568.6 | −8.4 | no — inside |

### C · webkit · unthrottled, NO CDP · cold · desk dpr2 · 5 windows/arm · 0 tainted of 10
load `{ 15.90 12.90 12.50 }` → `{ 11.05 12.07 12.22 }` · `stats-w-cold-desk.txt`,
`double-bake-webkit.txt`

| quantity | base median | base spread | cured median | cured spread | Δ | outside |
|---|---|---|---|---|---|---|
| **grid rounds** | **8 encodes, 1240→1272 px, 5/5** | — | **4 encodes, 1272 px, 5/5** | — | −4 | YES |
| discarded blocking ms | 274 | 246–297 | 28 | 0–40 | −246 | YES |
| whole encode bill ms | 611 | 577–721 | 365 | 358–432 | −246 | YES |
| last encode ms | 982 | 868–1032 | 619 | 605–704 | −363 | YES |
| **board-ready stamp ms** | **426** | 395–464 | **524** | 499–584 | **+98** | YES — see §3 |

TBT is **NOT MEASURED** on WebKit: there is no `longtask` entry type, so `stats.mjs` sums an
empty list and its `tbtMs` column reads 0.0 in BOTH arms. That 0 is an absence, not a number,
and nothing here is read off it.
The cured arm's residual 21–40 ms of discard is the LOGO's own second round, not the grid's:
`fonts.ready` resolves on WebKit at ~120 ms before the Fraunces face is applied, so the wordmark
re-bakes when the face really lands. It is present in the base arm too (2 of 5 windows) and in
the cured arm more often (4 of 5), because the wordmark's first round now happens earlier. It is
the post-font wordmark bake the charter requires be kept, and it is kept.

### D · webkit · cold · mobile 390×844 dpr3 · 5 windows/arm — the critical path
load `{ 10.52 11.28 11.86 }` → `{ 8.30 10.44 11.49 }` · `refute/A1`'s `cp-probe.mjs`, verbatim

| quantity | base | cured | Δ | outside |
|---|---|---|---|---|
| condition true (board up), ms | 109 (105–110) | 107 (104–120) | −2 | no — inside |
| **board-ready stamp, ms** | **386** (375–390) | **304** (168–343) | **−82** | YES |
| stamp − condition true, ms | 277 (270–281) | 197 (64–223) | −80 | YES |

On the phone-shaped pose the seed was at its worst: the base bakes a **1240 px** round and then
the 728 px round it keeps — 2.9× the pixels, for a board that is 364 CSS px wide. The cured arm
bakes 728 px once.

### E · chromium · 4× · Fast-3G · cold · mobile 390×844 dpr3 · 3 windows/arm — B1's own marks
load `{ 12.35 13.02 12.64 }` → `{ 8.16 11.73 12.18 }` · A6's `readiness-timeline.mjs`, verbatim

| A6 mark | base median | base windows | cured median | cured windows | Δ | outside |
|---|---|---|---|---|---|---|
| `firstBakeMs` | 3195.0 | 3189.2 / 3208.5 / 3195.0 | **2431.1** | 2450.7 / 2431.1 / 2411.8 | −763.9 | YES |
| `firstBoilTickMs` | 3326.0 | 3331.6 / 3326.0 / 3322.2 | **2573.8** | 2573.8 / 2563.9 / 2573.8 | −752.2 | YES |
| LCP | 3204 | 3200 / 3220 / 3204 | **2440** | 2460 / 2440 / 2420 | −764 | YES |
| TBT(3000) | 969 | 957 / 969 / 975 | **558** | 562 / 557 / 558 | −411 | YES |
| board-ready | 1413.1 | 1413.1 / 1408.9 / 1419.5 | 1413.2 | 1413.2 / 1403.9 / 1414.5 | +0.1 | no |
| `controlsInteractiveMs` | 107.2 | 109.3 / 107.2 / 102.6 | 145.6 | 142.2 / 145.6 / 150.3 | **+38.4** | YES — see §3 |

`firstBakeMs` moves, and the move is printed: **−763.9 ms**, the mark the charter asked for.

A6's `desk-wk-1x-unthr-cold` cell was taken in the same interleave and moves NOTHING outside its
spread (board-ready 239 → 277 against a cured spread of 201–294; `firstBakeMs` 726 → 723; LCP
742 → 739). That cell boots desk at **dpr 1** — the grid bake is 636², a twentieth of the work —
which is the whole reason it is quiet, and is the DPR split the 8.1 synthesis named.

### F · chromium · 1× · unthrottled link · cold · desk dpr2 · 3 windows/arm · 0 tainted of 6
load `{ 6.25 8.44 10.43 }` → `{ 6.45 8.20 10.25 }` · `stats-c1x-none-cold-desk.txt`

| quantity | base median | base spread | cured median | cured spread | Δ | outside |
|---|---|---|---|---|---|---|
| encodes | 28 | 28–28 | 16 | 16–16 | −12 | YES |
| discarded blocking ms | 240.8 | 235.8–249.4 | 0.0 | 0–0 | −240.8 | YES |
| whole encode bill ms | 517.8 | 491.5–519.1 | 274.6 | 267.4–285.1 | −243.2 | YES |
| last encode ms | 723.0 | 693.2–742.1 | 453.2 | 422.9–459.2 | −269.8 | YES |
| board-ready ms | 72.8 | 72.5–75.2 | 79.3 | 74.0–80.8 | +6.5 | no — inside |
| TBT ms | 24 | 3–27 | 19 | 10–23 | −5 | no — inside |

An unthrottled CPU on an unthrottled link is where the discard is cheapest, and it is still a
quarter of a second of main thread thrown away on every cold load.

### G · warm · chromium · 4× · Fast-3G · desk dpr2 · 3 windows/arm

Warm is the SECOND navigation in the same context, cache enabled; the first is the primer and is
discarded. Base encodes **20 / 28 / 16** — the race A1's refuter found, where a cached font
sometimes beats the celestials to the gate. Cured **16 / 16 / 16**. The cure does not merely sit
under the ≤ 20 ceiling, it makes the count deterministic.

## 3. WHAT MOVED THE WRONG WAY, and where it belongs

Two rows regressed, both outside their spreads, both the same mechanism. Reported, not buried.

- **WebKit desk dpr2 board-ready stamp: 426 → 524 ms (+98).** The charter's accept row "WebKit
  stamp − condition-true ≤ 2 frames" is **NOT MET**: 287 ms → 374 ms.
- **chromium mobile dpr3 `controlsInteractiveMs`: 107.2 → 145.6 ms (+38.4).**

**The mechanism, named.** `cp-probe` shows the board CONDITION holds at the same moment in both
arms (120 ms desk, 107 ms mobile) and FCP is unmoved (132 → 130). What moved is where a starved
rAF finds its seam. The base pipeline is longer and more fragmented — a discarded round, then
the celestials, then the kept round — and the poll's rAF used to land in the gap between the
first two. The cured pipeline is 246 ms shorter and packs into fewer, denser blocks, and the
grid's ONE round (1272² on desk dpr2, four encodes, ~65 ms each) is now unbroken across the
window the stamp needs. Less total work, a longer single stretch.

It is a queue-order defect, and queue order is **C03**'s charter — "schedule the kept bake:
visible-first, serialized, yielding". C01 is forbidden from trading the draw-in's frames for the
bake's and must not be credited across rows 1, 2 and 4, so the ordering is handed over rather
than taken here. The evidence C03 needs is in `raw/cp-w-desk/` and `raw/a6/`.

It is also pose-dependent and not a general WebKit regression: on the phone-shaped pose the same
stamp **improves by 82 ms** (§D), and at desk dpr 1 nothing moves at all. It scales with the size
of the single surviving round, which is what a serialized, yielding bake would dissolve.

## 4. π — AND A CORRECTION TO THE TRAP

`instr/pose-hash.mjs` takes a **SHA-256 of every PNG the page encodes**, in-page, off the blob
itself, with A1's surface classification read off the pose SVG's own bytes. `instr/pi-compare.mjs`
groups a surface's encodes into rounds **by toBlob START time** and compares the cured arm's one
round to the base arm's LAST round, as SETS (pose order inside a stack is the boil scheduler's).

| regime | base | cured | verdict |
|---|---|---|---|
| chromium 1× · cold · desk dpr2 | 28 encodes | 16 | **HOLDS** (`pi-c1x-desk.txt`) |
| chromium 4× · Fast-3G · cold · desk dpr2 | 28 | 16 | **HOLDS** (`pi-c4x-desk.txt`) |
| chromium 4× · cold · mobile dpr3 | 28 | 16 | **HOLDS** (`pi-c4x-mobile.txt`) |
| chromium 4× · Fast-3G · warm · desk dpr2 | 20/28/16 | 16 | **HOLDS** (`pi-c4x-warm.txt`) |
| webkit · cold · desk dpr2 | 20–24 | 16–20 | **HOLDS** (`pi-w-desk.txt`) |
| webkit · cold · mobile dpr3 | 20–24 | 16 | **HOLDS** (`pi-w-mobile.txt`) |

Every surface — grid, wordmark, sun, moon — renders a stack byte-identical, pose for pose, to
the round the estate keeps today. Visual goldens: **4 passed**, no re-baseline
(`PLAYWRIGHT_BASE_URL=http://127.0.0.1:4253 npx playwright test --config playwright-golden.config.ts`).

**THE TRAP WAS AN ARTIFACT, and it is worth saying so.** ATTRIBUTION gap 13 and this charter both
carry "at chromium 1× the grid's two rounds are NOT byte-identical (958,892 / 958,179 B discarded
vs the kept 957,715)". They are identical. `double-bake-proof.mjs` splits a surface's eight
encodes on ARRIVAL order (`rows.slice(0, half)`), and the two rounds' four encodes each COMPLETE
interleaved — so the split cuts across rounds and the two halves' byte SUMS differ even when the
underlying four PNGs are the same four PNGs. Split on START time and every window reads
`rounds byte-identical as SETS: true`, with each of the four digests appearing exactly twice:

    base w1 grid 1× · r1 t0 135 [eb65657f e933f00e 6ac9fa66 f9bdc5fb]
                    · r2 t0 392 [eb65657f e933f00e 6ac9fa66 f9bdc5fb]

The one place two rounds really do differ is WebKit's grid, and there they differ because they
are different BOXES (1240 vs 1272) — which is the defect this cure removes. The cure keeps the
second round's moment regardless, so the choice of form is unaffected; the trap simply is not one.

## 5. THE MUST-NOTS, each checked

- **Bake at a smaller box** — no. The kept box is unchanged in every pose: grid 1272² desk dpr2,
  1092² chromium mobile dpr3, 728² WebKit mobile (the licensed cap), celestials 416/192,
  wordmark 765/762/724. What disappeared is the 620-seed round, a box the layout never had.
- **Skip the post-font wordmark bake** — no. It survives, and on WebKit it fires MORE often than
  before (4 of 5 windows vs 2 of 5), because the wordmark's first round now runs earlier.
- **Theme-strip a `cacheKey`** — no. No `cacheKey` is touched; `e2e/theme-bake-freshness.spec.ts`
  green on both engines against the cured dist.
- **Trade the draw-in's frames for the bake's** — no. `BOIL_CONFIG.frameCount`, the draw-in and
  the transition layer are untouched; `visual-regression.spec.ts` "grid draw-in completes and
  path-based boil activates" green on both engines.
- **`filterBudget` 9** — untouched; `e2e/filter-census.spec.ts` green on both engines, and the
  census unit test rides in the 810.
- **Pose count 4** — every round in every window of every regime is four encodes.
- **No bake dropped, no boil thinned, no filter removed, no transition shortened** — the cure
  removes only rounds whose bitmaps were thrown away before a pixel of them was shown.

## 6. GATES, bare, with exit codes

| gate | exit | note |
|---|---|---|
| `npm run test:unit` | 0 | **Test Files 66 passed (66) · Tests 810 passed (810)** |
| `npm run lint:eslint` | 0 | |
| `npm run lint` | 0 | prettier --check |
| `npm run lint:knip` | 0 | |
| `npm run lint:boundary` | 0 | |
| `npm run lint:tdz` | 0 | |
| `npm run lint:copy` | 0 | no user-visible string changed |
| `npm run lint:live-regions` | 0 | |
| `npm run lint:motion` | 0 | 34 specs, every one declaring its motion state |
| `npm run typecheck:e2e` | 0 | |
| `npm run typecheck:node` | 0 | |
| `npm run build` (cured) | 0 | |
| goldens vs :4253 | 0 | 4 passed, no `--update-snapshots` |
| e2e surface set, both engines, vs :4253 | 0 | **86 passed** — `theme-bake-freshness`, `filter-census`, `wordmark-integrity`, `gallery` (incl. CH-67's capture invariant), `visual-regression`, and the spoken-gallery specs the gallery file pulls in |
| pencil-boil `npm run test` (worktree) | 0 | check + 13 proofs (**250 assertions**) + package boundary |

The e2e set ran through `instr/playwright-cured.config.ts`: `playwright.config.ts` with the
`npm run dev` webServer dropped and `baseURL` pinned to :4253 (the estate default starts :3000
and would have measured the dev server). Its one further edit is an absolute specifier for
`@playwright/test`, because the config sits in this evidence dir and not beside `node_modules`.

## 7. FILES

    instr/  bake-census.mjs  double-bake-proof.mjs  summarize.mjs   — A1's, verbatim
            cp-probe.mjs  readiness-timeline.mjs                    — refute/A1's and A6's, verbatim
            pose-hash.mjs  pi-compare.mjs                           — the π instrument and its verdict
            box-probe.mjs                                           — the WebKit diagnostic (§1)
            stats.mjs  merge.mjs  interleave.sh                     — the reading harness
            playwright-cured.config.ts                              — the scratch e2e config
    raw/    per-window JSONL per set, gzipped; `gunzip -c` and feed to the instrument named above
    *.txt   the derived tables quoted in §2–§4

## 8. WHAT THE DEVICE STILL OWES

Everything here is chromium-under-CDP or Playwright-WebKit. `firstBakeMs` −763.9, TBT(3000)
−411, LCP −764 and the 28→16 encode census all want reading again on the real iOS instance
through 8.3, at HEAD and with the cure, by the same rules. The WebKit stamp rows in §3 are the
ones most likely to read differently on hardware, because they are entirely about where a
starved rAF finds its seam.
