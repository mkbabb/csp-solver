# T9-W8 C02 — NON-AUTHOR VERIFICATION, round 1

2026-09-18 · track `bake` · worktree `.claude/worktrees/w8-bake` @ `84a4ad45` (clean, no commits by
the verifier, no product file touched) · ports 4252 (base) / 4253 (cured), both killed at the end.

**VERDICT: REPAIR.** The mechanism is the charter's, the headline mark moves and is outside both
arms' spreads, and π holds byte-for-byte on an instrument I ran myself. What fails is the
*no-regression* half of the charter's Accept clause: the ~900 ms the cure takes out of the gesture
lands on the main thread at idle, where three separate instruments see it — one of them the
estate's own perf-rig gate, which exited nonzero once on the cured arm and never on the base.

---

## 1 · THE DIFF IS THE MECHANISM THE CHARTER NAMES

`git diff 854b562b..84a4ad45` — three files, **script blocks only**, zero `<template>`/`<style>`
lines, zero config files, zero specs:

| file | what |
|---|---|
| `src/pencil/composables/rasterPose.ts` | `lightLadder` / `resolveThemedCssValue` (the probe), `markBoardDrawn`, `registerBootStack`/`bootStacksSettled`, `usePosePrewarm` (the clock), +2 lines inside `retainedPoseUrls` |
| `src/pencil/grid/HandDrawnGrid/HandDrawnGrid.vue` | ink becomes a parameter (`gridPoseSvgInked`), `gridCacheKey(dark)`, `gridDpr()` extracted verbatim, `markBoardDrawn` stamp, warm armed |
| `src/pencil/chrome/HandwrittenLogo/HandwrittenLogo.vue` | `logoPoseSvgInked`, `logoCacheKey(dark)`, warm armed |

Library: `pencil-boil-t9` `617720b` → 0.12.1 — `RasterStackHandle.prewarm(alt, beforePose?)` and
`retain(key, minted, cap, protect)`. It is additive; `bake()`, `urls`, `ready`, `liveKey` and the
bake token are untouched.

**It is pre-warming, which the charter's M09 law names as lawful.** It draws no less:

- no bake dropped — π shows 8 grid + 8 logo + 4 + 4 celestial encodes in BOTH arms;
- no boil thinned — `BOIL_CONFIG` not in the diff; pose count **4** in every round, both arms;
- no filter removed — `filterBudget.ts` not in the diff, `grain-static` still read by
  `gridPoseSvgInked`; `filter-census.spec` green against the cured dist (below);
- no transition shortened — nothing touches the Bloom's duration; the whirl gets MORE frames;
- no DPR lowered — `gridDpr()` is the same `Math.min(devicePixelRatio, Apple ? 2 : Infinity)`
  expression, moved verbatim out of the options literal;
- no cacheKey theme-stripped — `gridCacheKey`/`logoCacheKey` still carry `d`/`l`.

REFUSED list, by name: none re-proposed. The REFUTED `prewarm()` row points at
`GameShell.vue:84-87`, which is the **solver worker** warm — a different function, unrelated.
COPY LAW: no user-readable string added. No new spec, so no `// PRM:` obligation.

---

## 2 · THE ARMS

```
base  : AUDIT: build-identity — dist entry index-DOFGihfY7ZtC.js · index.html md5 7241f47bba33881658ad9e63061fa9e3 · 43 files / 807.4 KB   (= the author's banked line)
cured : AUDIT: build-identity — dist entry index-BtBRoiyMlXuV.js · index.html md5 451155dd6cc88b523bd75d57723fb788 · 43 files / 810.9 KB   (= the author's banked line)
```

- I **rebuilt** the cured arm from the committed HEAD (`npm run build`, exit 0): same entry hash,
  same `index.html` md5. The served dist IS `84a4ad45`.
- `dist-base` is genuinely pre-cure: its entry has no `left:-99999px`, no `touchstart`, and its
  `animation-vendor-CrUpJv3U-YcU.js` has **0** occurrences of `prewarm` / `protect`. The cured
  vendor chunk is +608 B and carries both.
- The one `prewarm` token in the base entry is GameShell's solver warm, present in both arms.
- No confound from C01: C01's library half was reverted (`93075fd`) before `854b562b`, so
  base = app@854b562b + lib 0.12.0 and cured = app@84a4ad45 + lib 0.12.0+prewarm. The delta is C02.
- `web/frontend/node_modules` in this worktree is a REAL directory with its own
  `@mkbabb/pencil-boil` 0.12.1 (`dist/vue.js` md5 `aa27f230ef7f7dce4ddbb594ae00fe7f`). The MAIN
  tree's copy is untouched — still 0.12.0, mtime Aug 2. Nothing was written through a symlink.

---

## 3 · THE NUMBER, RE-READ (5 + 5, interleaved b,c,b,c…)

`instr/toggle-probe.mjs` — `diff` against the banked `attribution/A5/toggle-probe.mjs` exits **0**
(the author's copy is verbatim; I ran the same file). Regime: **chromium · 4× CPU · Fast-3G · cold
(CDP cache disabled) · desk 1280×800 · dpr 2 · boot light**. Load `{4.95 6.61 11.60}` → `{9.94 8.70
11.70}`, per-pair loads in `raw/v-c4x-f3g-cold-desk.log`. 0 tainted of 10. Identity printed at both
ends of the set, unmoved.

| quantity | base median | base spread | cured median | cured spread | Δ | outside both spreads |
|---|---|---|---|---|---|---|
| **deltaMs** (N1 − median N2..N4) | **1117.2** | 905.5–1343.4 | **216.4** | 38.0–331.1 | **−900.8** | **YES** |
| n1SettleMs | 1259.9 | 1238.2–1466.6 | 322.2 | 144.8–447.7 | −937.7 | YES |
| **n1Bakes** | **8.0** | 8–8 | **0.0** | 0–0 | **−8** | **YES** (0 in 5 of 5) |
| n1WhirlFrames | 1.0 | 0–4 | 89.0 | 86–98 | +88 | YES |
| n1WhirlWorstMs | 216.1 | 214.7–216.4 | 82.2 | 58.3–83.7 | −133.9 | YES |
| n1RecalcMs | 82.2 | 72.7–93.2 | 271.0 | 237.5–310.3 | +188.8 | YES (G8, see §5) |
| boardReadyMs | 1419.5 | 1393.2–1438.1 | 1419.0 | 1398.2–1446.8 | −0.5 | no |
| **bootBakes** (≤ boardReady+2.5 s) | **16.0** | 16–16 | **22.0** | 21–24 | **+6** | **YES** |
| **bootLongTaskMs** (same window) | **1144** | 1099–1272 | **1743** | 1641–1983 | **+599** | **YES** |

The mark moves, in the direction claimed, outside the spread, on 5 windows per arm. None of the
classic lies is present: the arms are not swapped (base is the 8-bake arm and serves the base
entry hash), the regime is the charter's, the cache is cold by CDP, the cure is live on the path
measured (0 bakes in the gesture, and the warm's encodes are visible in `bootBakes`).

**But the headline the author returned is a subgroup median.** Their own pooled table
(`stats-c4x-f3g-cold-desk-POOLED.txt`) reads cured deltaMs **218.2** over all 10 windows and marks
it *"no — inside the spread"*; the returned `cured: 25.3 ms` is the median of the 6 windows where
the warm landed, differenced against a base median over all 10. Mixed populations. My 5+5 at
moderate load gives the honest version — **−900.8 ms, outside both spreads** — and it is a smaller
claim than −1,403.0.

**The charter's `≤ 150 ms` shape is not met at 4×**: cured N1 delta median 216.4 ms against an N2–N4
spread of 102–122 ms. What remains is not bakes (0) — it is the restyle (§5).

### 3b · 6× — the warm does not land, and nothing moves (3 + 3, load 6–11)

chromium · **6×** · Fast-3G · cold · desk dpr 2: deltaMs base 1793.1 [1543–1868] → cured 1529.8
[1385–1727], **−263.3, INSIDE the spread**. n1Bakes 8 → **5** (the warm gets 3 poses in before the
tap and the gesture bakes the rest). I did **not** reproduce the author's +279 ms regression here —
at my loads it read negative — but both readings agree on the substance: **at 6× the cure is a
no-op that still spends encodes.** The charter says "prove it on 1× / 4× / 6×"; 6× is unproven.

---

## 4 · π — I RAN IT MYSELF

**Goldens**: `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4253 npx playwright test --config
playwright-golden.config.ts` → **4 passed, exit 0**. No `--update-snapshots`. (`goldens-cured.txt`)

**Per-pose hashes**, `instr/pose-hash-toggle.mjs` 3 + 3 windows, chromium 4× · Fast-3G · cold ·
desk dpr 2, 0 tainted, `pi-compare.mjs` **exit 0 — "π HOLDS"** (`pi-c4x-desk.txt`):

- grid, base r2 (baked INSIDE the gesture, t0 9,919→11,574) and cured r2 (baked AT IDLE, t0
  4,600→6,769) are the same four digests `[95f54de5 a885e347 e3829e30 6fe33241]`, in all 3 + 3
  windows;
- logo, base r2 (t0 9,755→11,454) and cured r2 (t0 4,362→4,586) both `[71c256fa 46eda3c1 1f52e7c7
  1f5350de]`;
- the live/light round `[eb65657f …]` / `[151a026e …]` is identical in both arms;
- toggle-sun and toggle-moon: 4 encodes, identical digests, untouched.

**That is the proof of the probe**: the ink the detached clone reads produces bitmaps byte-identical
to what a real flip bakes, both surfaces, and the equality is independent of the author.

**filterBudget**: `filterBudget.ts` is not in the diff; `filter-census.spec.ts` green against the
cured dist under `playwright-throttle.config.ts` (below). **Pose count 4** in every round of the π
run, both arms.

---

## 5 · G8, RE-READ AS THE CHARTER ASKS

`n1Recalc` 82.2 → 271.0 ms. This is not a cost the cure added: in the base arm the first flip's
restyle is truncated because the whirl never runs (n1WhirlFrames median 1 of ~100). With the bakes
gone the whirl runs (89 frames) and N1 restyles like N2–N4. The author's reading of the same thing
(N1 86.0 → 277.2 ms, N2 256.6 / 276.4 unmoved) agrees. **G8's flip frame is now the top item on
this surface** and it is what keeps N1's delta at ~216 ms instead of ~25.

---

## 6 · GATES, BARE, WITH EXIT CODES

| gate | exit | note |
|---|---|---|
| `npm run test:unit` | 0 | **Test Files 66 passed (66) · Tests 810 passed (810)** |
| `npm run lint:eslint` | 0 | |
| `npm run lint` | 0 | prettier |
| `npm run lint:knip` | 0 | |
| `npm run lint:boundary` | 0 | |
| `npm run lint:tdz` | 0 | |
| `npm run lint:copy` | 0 | |
| `npm run lint:live-regions` | 0 | |
| `npm run lint:motion` | 0 | |
| `npm run typecheck:e2e` | 0 | |
| `npm run typecheck:node` | 0 | |
| goldens vs :4253 | 0 | 4 passed |
| `playwright-throttle.config.ts` vs :4253 (built-dist specs, BOTH engines) | 0 | **67 passed** — filter-census, wordmark-integrity, theme-bake-freshness, theme-quadrants, throttled-void |
| default suite vs :4253 (scratch config, BOTH engines) | **1** | 470 passed, **2 failed** — `presence.spec.ts:177` in chromium AND webkit |
| `presence.spec.ts` vs :4252 (**base arm control**) | **1** | **the same 2 failures, same test, both engines** |
| `perf-rig/ci-subset.mjs --dist dist-base` ×3 | 0, 0, 0 | GATE A/B/C/D PASS every run |
| `perf-rig/ci-subset.mjs --dist dist` ×3 | **1**, 0, 0 | run 1: **GATE A webkit BREACH** (median long33 1 > 0) |

**The presence red is a host fact, proven**: it reproduces byte-for-byte on `dist-base`
(`.controls-card .players-roster .player-row` expected 3, received 1 — a three-peer roster with no
relay on this host). Not the cure's.

---

## 7 · THE NO-REGRESSION CLAUSES — WHERE IT FAILS

The charter: *"no regression from spending ~900 ms of main thread at idle — `boardDrawnMs`,
TBT(3000) and GATE D unmoved, the drawer's first gesture (C08's instrument) no worse."*

1. **`boardDrawnMs` — HOLDS.** A6 `readiness-timeline.mjs`, 5 + 5 interleaved, mobile 390×844
   dpr 3, chromium 4× Fast-3G cold: firstBoilTick base 3226 [2839–3705] → cured 2844 [2713–3497];
   boardReady 1436 → 1486. Both inside the spread. 0 tainted.

2. **TBT(3000) — NOT CLEARED.** My own mobile set ran at host load 14–16 and is too noisy to
   decide: base 712 [634–1030] → cured 722 [698–1136], **+10, inside the spread**. That neither
   confirms nor refutes the author's **+111.5 ms DISJOINT at mobile dpr 3, reproduced three times
   across three builds** — their spreads (544–567 vs 650–1329) were taken at a quiet host and are
   the more sensitive reading, and their mechanism is arithmetic, not opinion (boot round ends
   2,474 ms, warm starts 2,746, ~238 ms of encode inside a census that closes at 3,000). **Two
   independent corroborations from my own data**: `bootLongTaskMs` at desk **+599 ms, outside both
   spreads**, and GATE D's chromium boot TBT **base 195 / 198 / 251 vs cured 232 / 348 / 584 ms**.
   The main thread is not saved; it is moved into the first idle window, and at dpr 3 part of it
   lands inside the census. **The clause says "unmoved". It moved.**

3. **GATE A (idle long-frame census, webkit) — BREACHED ONCE, ON THE CURED ARM ONLY.**
   `perf-rig/ci-subset.mjs --dist dist` run 1 exited **1**: `BREACH [webkit] long-frame census:
   measured 1 frames >33.4ms > allowed 0`; idle windows read long33 1 / 1 / 0, worst frames 42 and
   43 ms. Runs 2 and 3 passed. Three base runs: 0 / 0 / 0. The host was loaded (that run's CONTROL
   window also carried a long frame), so I do **not** call it confirmed — but it appeared only on
   the cured arm, and the mechanism fits exactly: an idle pose encode inside the 3 s idle census is
   a >33.4 ms frame. This is a CI-facing gate that can exit nonzero.

4. **GATE D — HOLDS against its ceiling.** chromium median boot TBT 195–251 (base) vs 232–584
   (cured) against a 1,750 ms ceiling: PASS in all six runs. webkit NOT MEASURED (no longtask).

5. **The drawer's first gesture — inside the spread, with a tell.** A4 `drawer-trace.mjs` verbatim,
   chromium 6× · mobile 390×844 · **dpr 1 (A4 sets no scale factor — its own gap)** · cold, 3
   windows × 3 cycles per arm, interleaved, load 12–20, 0 tainted: FIRST open worst **51.9
   [43.2–58.0] → 59.3 [48.0–73.6]**, +7.4 median, inside the spread; steady open 23.95 → 32.8,
   inside. But `long33` on the first open goes **1 → 2 in 3 of 3 cured windows**. The gesture stands
   the warm down; it cannot un-encode the pose already in the canvas.

---

## 8 · WHAT A REPAIR LOOKS LIKE (the verifier's read, not a design order)

Everything that fails is the warm's **placement in time**, which lives entirely in
`usePosePrewarm` (`rasterPose.ts:406`) — not in the mechanism, not in the probe, not in the library
seam, and not in anything π touches:

- the first warm pose must land **after** the TBT(3000) census closes (it is fixed to
  navigationStart, so `bootStacksSettled` + `FIRST_WARM_MS = 200` is not enough at mobile dpr 3,
  where the boot round ends at ~2.5 s);
- the same deferral would take the idle encodes out of the perf rig's first idle window;
- at 6× the warm never finishes before a plausible first gesture and buys 3 encodes for nothing —
  either let it run (it is upside-only per-pose) and accept that the cell is a no-op, or state in
  writing that 6× is out of scope. It should not be claimed as a win.

Non-blocking advisories:

- `rootLadder` (`rasterPose.ts:~160`) is cached **module-globally for the page's life**. The
  built CSS declares `:root` custom properties under viewport media conditions
  (`--type-option`, `--icon-act` …) — none of them ink for these two surfaces today, so π is safe,
  but a future ink token behind a media condition would silently bake wrong after a resize.
- `bootStacks` / `bootStacksAdmitted` only ever increase per surface instance; a surface that
  unmounts still counts toward "the boot round is over". Benign today (the count only gates the
  start), worth a line.

---

## 9 · FILES

`verify-r1/`: `VERIFY.md` (this) · `stats-c4x-f3g-cold-desk.txt` · `stats-c6x-f3g-cold-desk.txt` ·
`stats-drawer.txt` · `pi-c4x-desk.txt` · `pi-filterbudget.txt` · `goldens-cured.txt` ·
`gate-unit.txt` · `gate-lint-*.txt` · `gate-typecheck-*.txt` · `gate-e2e-default-cured.txt` ·
`gate-e2e-bakespecs-cured.txt` · `gate-e2e-presence-{base,cured}.txt` ·
`gate-d-{base,cured}[-r2,-r3].txt` · `interleave.sh` · `interleave-readiness.sh` ·
`playwright-verify.config.ts` · `raw/`.

`sysctl -n vm.loadavg`: `{4.95 6.61 11.60}` at the first set's open, `{6.52 11.66 14.02}` at close;
per-set starts and ends are stamped in each `raw/*.log`. Up to ten sibling agents shared this host
throughout, and every claim above is read against the arms' own spreads because of it.
