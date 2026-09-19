# C03 — SCHEDULE THE KEPT BAKE · NOT LANDED

2026-09-17 · track `bake`, worktree `.claude/worktrees/w8-bake`, branch `w8/bake` ·
preSha `854b562b` (C01's last fix) · the cure was built, measured, committed as `3785819e`
and then **reset off the branch**. The branch is back at `854b562b`.

**Why it did not land.** The schedule moves the number in three of the four cold cells the
charter names, by a lot and outside both arms' spreads — and it moves it the WRONG WAY, by
the same order of magnitude and also outside both spreads, in the fourth. A cure that trades
6× · Fast-3G for 4× · unthrottled is not a cure; it is a preference. The charter's own
**It must not** says *show an unbaked surface longer than today*, and at 6× · Fast-3G every
surface's bitmap lands later. So the branch goes back.

    BASE ARM   AUDIT: build-identity — dist entry index-DOFGihfY7ZtC.js · index.html md5
               7241f47bba33881658ad9e63061fa9e3 · 43 files / 807.4 KB      (C01 at 854b562b)
    CURED ARM  AUDIT: build-identity — dist entry index-BGwANEoMf1Qk.js · index.html md5
               37a8cb2344e7d6d8ff68a124483f67fd · 43 files / 808.7 KB      (C03 at 3785819e)

Both arms served from the worktree's `web/frontend` by `vite preview`, base on :4252 and
cured on :4253, printed at both ends of every reading set (`dist-identity.txt`). Ten sibling
agents measured on this host throughout; `sysctl -n vm.loadavg` is stamped at both ends of
every set and sits in each file's head. Readings are interleaved b,c,b,c,… one window per
invocation, so host drift falls on both arms equally.

## 1. What the cure was

A boot-bake QUEUE, app-side, in `src/pencil/composables/rasterPose.ts` beside C01's font
gate. Four surfaces bake at boot and today all four start in the same tick. The queue gave
each a LANE and opened one lane at a time:

| lane | surface | why there |
|---|---|---|
| 0 | wordmark + the celestial that is SHOWING | the small visible stacks, 4 × 18 ms and 4 × 5 ms |
| 1 | the board | the largest raster by an order of magnitude; the surface `boardDrawn` reads |
| 2 | the celestial that is NOT showing | nothing can ask for it until a tap; it waits for `requestIdleCallback` |

`useBakeLane(lane)` returns `gate(box)`, which hands the library ZERO — its "not measured
yet" — until the lane opens, and `settleOn(ready)`, which opens the next lane the moment
this one's stack lands. Claims are COUNTED (two instances of a surface both count), an
unclaimed lane is stepped over once the queue arms one paint after mount, a claimed lane
that never settles is stepped over by a watchdog, and the whole queue drains on timers so a
hidden tab still reaches the last lane. Once open a lane stays open, so a theme flip's
re-bake sees no gate at all.

Every pose is still baked, at the same box, the same DPR, the same count. Only the order
changed — which is why π held everywhere (§4).

## 2. The numbers, both signs

### 2a. Where it won — chromium · 4× · unthrottled · cold · 390×844 **dpr 3**

`refute/A6/refute-probes.mjs --mode gapsplit`, verbatim but for `--base`, 5 windows per arm
interleaved, 0 tainted of 10, load 33.17 → 25.11 (`gapsplit-a.txt`, raws `raw/gapsplit-a/`).

| mark | base median (spread) | cured median (spread) | Δ | outside both spreads |
|---|---|---|---|---|
| **leg 2** — drawn → bitmaps mounted (THE charter's number) | **896** (891–905) | **532** (344–576) | **−364** | YES |
| firstBake — the board's stack in the DOM | 2,025 (2,003–2,110) | 1,584 (1,549–1,774) | −441 | YES |
| **leg 1's blocking main thread** (Σ longtask inside the draw-in) | **665** (644–691) | **353** (330–509) | **−312** | YES |
| leg 2's blocking main thread | 0 (0–51) | 337 (164–389) | +337 | YES — the board's long tasks MOVED OUT of the draw-in, which is the point |
| leg 1 — the draw-in itself | 812 (771–836) | 837 (730–879) | +25 | no — inside the spread (not re-timed) |
| TBT(3000) | 641 (624–703) | 665 (600–728) | +24 | no — inside the spread (not worse) |
| board-ready | 344 (313–369) | 326 (314–364) | −18 | no — inside the spread |

### 2b. Where it won — chromium · 6× · **unthrottled** · cold · mobile dpr 3

`A6/readiness-timeline.mjs`, 4 windows per arm interleaved, load 13.32 → 7.96
(`rt-mob-6x-unthr.txt`).

| mark | base median (spread) | cured median (spread) | Δ | outside both spreads |
|---|---|---|---|---|
| firstBake | 2,500.1 (2,420–2,531) | 2,082.3 (2,051–2,180) | −417.9 | YES |
| **firstBoilTick** — B1's `boardDrawn` | 2,714.4 (2,593–2,726) | 2,111.5 (2,097–2,252) | **−602.9** | YES |
| LCP | 2,528 (2,444–2,560) | 2,096 (2,064–2,192) | −432 | YES |
| TBT(3000) | 1,017 | 1,014 | −3 | no — inside the spread |

### 2c. Where the VISIBLE surfaces won — chromium · 4× · Fast-3G · cold · mobile dpr 3

`A1/bake-census.mjs` verbatim but for `--port`, 5 windows per arm interleaved, 0 tainted of
10, load 18.30 → 13.49. Each row is when that surface's LAST pose blob resolved — its stack
landing (`lastbake-c4x-f3g-mob.txt`).

| surface | base median (spread) | cured median (spread) | Δ | outside both spreads |
|---|---|---|---|---|
| **wordmark** | 2,594.7 (2,428–2,976) | **1,686.5** (1,652–1,716) | **−908.2** | YES |
| **celestial shown** | 2,496.8 (2,402–2,830) | **1,638.2** (1,610–1,662) | **−858.6** | YES |
| board | 2,624.4 (2,543–3,046) | 2,504.1 (2,470–2,759) | −120.3 | no — inside the spread |
| celestial hidden | 2,457.0 (2,392–2,836) | 2,649.3 (2,573–2,919) | +192.3 | no — inside the spread (deferred on purpose) |
| encodes | 16 | 16 | 0 | no round added or dropped |
| TBT | 693 (626–996) | 662 (615–747) | −31 | no — inside the spread |

`A6/readiness-timeline.mjs` on the same cell, 5 + 5 (`rt-mob-4x-f3g.txt`): firstBake
2,482.9 → 2,472.7 and firstBoilTick 2,570.9 → 2,556.7 — **no move**, both inside the spread.
The visible stacks move ~900 ms on this link; the board does not.

### 2d. WebKit · unthrottled, NO CDP · cold · desk 1280×800 dpr 2

`A1/bake-census.mjs`, 5 + 5 interleaved, 0 tainted of 10, load 37.15 → 20.92
(`lastbake-w-desk.txt`). No CPU rate, no link, no `longtask`: a WebKit number is not a
Safari number and is not an iOS claim.

| surface | base median (spread) | cured median (spread) | Δ | outside both spreads |
|---|---|---|---|---|
| celestial shown | 658 (615–991) | 395 (310–502) | −263 | YES |
| board | 659 (615–992) | 655 (575–874) | −4 | no — inside the spread |
| wordmark | 273 (264–463) | 316 (243–395) | +43 | no — inside the spread |
| celestial hidden | 659 (615–992) | 1,694 (1,618–1,942) | +1,035 | YES — the idle lane, by design |
| worst rAF gap | 374 (333–465) | 262 (245–341) | −112 | no — inside the spread |

### 2e. **Where it LOST** — chromium · 6× · Fast-3G · cold · mobile dpr 3

`A6/readiness-timeline.mjs`, window widened to 9,000 ms per the charter, 5 windows per arm
interleaved, load 19.75 → 18.79 (`rt-mob-6x-f3g.txt`).

| mark | base median (spread) | cured median (spread) | Δ | outside both spreads |
|---|---|---|---|---|
| **firstBake** | 3,425.6 (3,187–3,632) | **4,035.6** (3,924–4,656) | **+610.0** | YES |
| **firstBoilTick** (`boardDrawn`) | 3,471.2 (3,209–3,637) | **4,218.3** (4,087–4,875) | **+747.1** | YES |
| LCP | 3,436 (3,200–3,648) | 4,064 (3,952–4,680) | +628 | YES |
| TBT(3000) | 1,232 (1,023–1,444) | 1,137 (1,074–1,335) | −95 | no — inside the spread |
| rAF-gap proxy TBT | 1,960 (1,810–2,009) | 1,713 (1,609–1,817) | −247 | no — inside the spread |

Confirmed twice: the bounded variant (§3, lane 0 capped at 300 ms) read **+728.1** on the
same cell, 4 + 4. The board's OWN span, at event grain, is 1,618 ms in base (1,651 → 3,269)
against 1,815 ms cured (2,055 → 3,870) — so the board is not merely starting 404 ms later,
it is also running 197 ms slower once it starts. At 4× · unthrottled the same comparison runs
the other way: 1,079 ms base (426 → 1,505) against 839 ms cured (750 → 1,589).

**The discriminator is the LINK, not the CPU.** 6× unthrottled wins by 418 (§2b); 6×
Fast-3G loses by 610. The mechanism for that flip is NOT established. The shaped suspicion,
unmeasured and left for whoever picks this up: on a throttled link the delayed board bake
lands on top of the wasm fetch-and-compile window (ATTRIBUTION row 5, givens at 3,048 ms),
which the base arm's bake gets in ahead of. If that is it, C04 changes the answer and this
cure is worth re-taking after it.

## 3. The four lane maps tried, and what each read

All four were built and measured against the same base arm on the same host, interleaved.

| variant | lanes | 4× unthr mobile, firstBake / leg 2 | 6× Fast-3G mobile, firstBake |
|---|---|---|---|
| V1 | wordmark · shown · board · hidden(idle) | −255 / −323, both YES | not taken — desk dpr 1 leg 1 went 600 → 755, outside both spreads, so it was dropped |
| **V2** | {wordmark, shown} · board · hidden(idle) | **−441 / −364, both YES** | **+610, YES** |
| V3 | all three visible together · hidden(idle) | −4 / +8, neither | +41.5, inside the spread |
| V4 | V2, lane 0 capped at 300 ms | not taken | +728.1, YES |
| V6 | board · {wordmark, shown} · hidden(idle) | −50 / +0.5, neither | not taken |

V3 is the finding that matters for the next author: **deferring the off-screen celestial to
idle, on its own, moves nothing** (−4 ms on firstBake, 4 + 4 interleaved). The whole of V2's
win is the ORDER — the small visible stacks' encodes issued before the board's — and the
whole of its loss is the wait that order costs on a throttled link. Putting the board first
instead (V6) recovers neither.

## 4. π — it held, everywhere it was asked

`instr/pose-hash.mjs` (C01's instrument, unchanged) SHA-256s every PNG the page encodes,
in-page off the blob, and `pi-compare.mjs` compares the kept round set-wise.

| regime | verdict | file |
|---|---|---|
| chromium · 4× · cold · desk dpr 2 | HOLDS — all four surfaces byte-identical, 4 encodes each, boxes 1272/765/416/416 | `pi-c4x-desk.txt` |
| chromium · 4× · cold · mobile dpr 3 | HOLDS — all four surfaces | `pi-c4x-mob.txt` |
| webkit · cold · desk dpr 2 | HOLDS — all four surfaces, boxes 1272/762/416/416 | `pi-w-desk.txt` |

Goldens, against the cured dist on :4253, never `--update-snapshots`:

    PLAYWRIGHT_BASE_URL=http://127.0.0.1:4253 npx playwright test --config playwright-golden.config.ts
    4 passed (1.6s)   EXIT=0

`filterBudget` 9 and pose count 4 are unmoved and both are gated: `e2e/filter-census.spec.ts`
passed on the cured dist in both engines, and the census unit test rode `test:unit`.

## 5. The gates, run bare in the worktree, on the cured tree

| gate | exit | note |
|---|---|---|
| `npm run test:unit` | 0 | Test Files 66 passed (66) · Tests 810 passed (810) |
| `npm run lint:eslint` | 0 | |
| `npm run lint` | 0 | RED first (prettier wanted `rasterPose.ts`); `prettier --write` on that one file, then green. The entry hash did not move across that write — `index-BGwANEoMf1Qk.js`, same md5 — so the arm measured is the arm committed |
| `npm run lint:knip` | 0 | |
| `npm run lint:boundary` | 0 | |
| `npm run lint:tdz` | 0 | |
| `npm run lint:copy` | 0 | |
| `npm run lint:live-regions` | 0 | |
| `npm run lint:motion` | 0 | |
| `npm run typecheck:e2e` | 0 | |
| `npm run typecheck:node` | 0 | |

e2e on the cured dist through `instr/playwright-cured.config.ts` (C01's scratch config —
`playwright.config.ts` with the `npm run dev` webServer dropped and baseURL on :4253), both
engines: `gallery` (incl. the CH-67 capture invariant) · `theme-bake-freshness` ·
`wordmark-integrity` · `filter-census` · `masthead-alignment` = **58 passed, EXIT=0**;
`visual-regression` · `board-covisibility` · `prm-void-audition` · `throttled-void` ·
`font-census` = **52 passed, EXIT=0**.

## 6. Two corrections to the charter, both measured

1. **"the wordmark … today LAST — its first `poseSvg` at 2,654 ms, queued behind the grid's
   1272 px encodes"** is STALE at the chain's build. Measured on the base arm at event grain
   (chromium · 4× · unthrottled · cold · mobile dpr 3, `raw/base-diag-mob.txt`): the
   wordmark's first `poseSvg` is at **313 ms — FIRST of the four surfaces**, 26 ms after
   board-ready. What lands last is its blob-SVG DECODE (its pose SVG carries the face as a
   data URI; `drawImage` does not fire until 1,131 ms, 766 ms after the blob was minted,
   because the board holds the thread) and then its PNG callback at 1,578 ms. C01 moved the
   mint; the decode and the callback are what the schedule has to reach.

2. **"one encode per task with a frame yielded between, never a `Promise.all` burst"** — the
   yield is ALREADY structural and no change can add it. `useRasterStack` starts its four
   captures with `Promise.all`, but each pose's `drawImage` + `toBlob` runs in its own image
   `onload` task, so the browser renders between them. The base arm's rAF census shows
   exactly one frame between consecutive board encodes: gaps at 581 / 748 / 906 / 1,082 ms,
   ~160 ms apart, which is one `toBlob` sync stretch each. What `Promise.all` really buys is
   four 1092² canvases alive at once; that is a memory fact, not a scheduling one, and this
   cure did not price it.

Also worth banking for C02: at 4× · unthrottled · mobile the off-screen celestial's stack
lands at **1,707 ms** under the idle lane (base 1,344) and at **1,694 ms** on WebKit desk
(base 659) — present long before any tap, so the idle lane never puts C02's N1 at risk. It
just does not buy anything on its own (§3).

## 7. Instruments, and exactly what was changed in each

Everything is in `instr/`, copied from the banked 8.1 lanes and pointed at :4252 / :4253.

- `bake-census.mjs`, `double-bake-proof.mjs`, `pose-hash.mjs`, `pi-compare.mjs`, `stats.mjs`,
  `merge.mjs`, `playwright-cured.config.ts` — **unchanged** from C01's `instr/`; only
  `--port` / `--base` differ per invocation.
- `refute-probes.mjs` — **unchanged** from `attribution/refute/A6/`; `--base` only.
- `readiness-timeline.mjs` — four edits, all named in its head: the boil-tick selector is
  `.boil-frame-layer`, not `.boil-frame` (the lane's spelling matches nothing on this tree —
  ATTRIBUTION §B1, corrected per its refuter); `--settle` widens the boot window past
  3,600 ms; `--noclick` drops the controls-response click, which is not this cure's mark and
  costs ~5 s a window; and one cell A6 never declared, `mob-cr-6x-unthr-cold`, to separate
  CPU from link. Both arms were read with the same edited file.
- `interleave.sh`, `gap-interleave.sh`, `rt-interleave.sh` — the b,c,b,c harnesses.
- `gapstats.mjs`, `rtstats.mjs`, `lastbake.mjs`, `timeline.mjs` — new readers. They print
  each arm's own SPREAD beside its median and say, per row, whether the two spreads are
  disjoint. Nothing in them decides anything.

Raws are gzipped under `raw/`. No frames were banked: the whole directory is 872 KB, text.

## 8. What is left standing

- The branch is at `854b562b`. `dist-base` and `dist` are both the chain's build.
- **Real Safari and iOS were never touched** (M19). Every number here is chromium under CDP
  throttle or Playwright WebKit unthrottled. 8.3 closes the budget on the device; nothing
  here closes anything.
- For the chair: C03's mechanism is REAL and large on an unthrottled link at both CPU rates,
  and it inverts on Fast-3G. If C04 lands first, the Fast-3G cell is worth re-reading before
  C03 is written off — the suspicion in §2e is the only lead, and it is a suspicion.
