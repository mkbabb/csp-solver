# T9-W8 C02 — NON-AUTHOR VERIFICATION, round 2

2026-09-18 · track `bake` · worktree `.claude/worktrees/w8-bake` @ `aa2573a6` (clean; this verifier
wrote no product file, made no commit, touched no main-tree source) · ports 4252 (base) / 4253
(cured) + 4259 (the rig's own probe server), all killed at the end.

**VERDICT: REPAIR.** The mechanism is the charter's, the mark moves hugely and is outside both
arms' spreads, π holds on an instrument I ran myself, every npm gate is green, and round 1's ruled
TBT(3000) regression really is cured. What still fails is the same *no-regression* half of the
charter's Accept clause, and now in two places I reproduced independently: the estate's own idle
long-frame census (GATE A, WebKit) reds on the cured arm in **3 of 3 gradable runs** against **4 of
4** green base runs with clean controls, and the drawer's **first close** is disjointly worse.
A third finding is new here: the branch's lockfile cannot supply the library the cure needs.

---

## 1 · THE DIFF IS THE MECHANISM THE CHARTER NAMES

`git diff 854b562b..aa2573a6` — three files, script blocks only; zero `<template>`, zero `<style>`,
zero config, zero specs. `git diff 5fba8e3b..aa2573a6` (this round) is a **comment block only** in
`rasterPose.ts:334-390`, and a rebuild reproduces the committed entry hash exactly (§2).

| file | what |
|---|---|
| `src/pencil/composables/rasterPose.ts` | `lightLadder` / `resolveThemedCssValue` (the probe), `markBoardDrawn`, `registerBootStack` + `bootStacksSettled`, `BOOT_CENSUS_MS` (round 1's floor), `usePosePrewarm` (the clock) |
| `src/pencil/grid/HandDrawnGrid/HandDrawnGrid.vue` | ink becomes a parameter (`gridPoseSvgInked`), `gridCacheKey(dark)`, `gridDpr()` extracted verbatim, `markBoardDrawn` stamp, warm armed |
| `src/pencil/chrome/HandwrittenLogo/HandwrittenLogo.vue` | `logoPoseSvgInked`, `logoCacheKey(dark)`, warm armed |

Library: `pencil-boil-t9` `617720b` → 0.12.1, `prewarm(alt, beforePose?)` plus
`retain(key, minted, cap, protect)`. Additive: `bake()`, `urls`, `ready`, `liveKey` and the bake
token are untouched.

**It is pre-warming, which M09 names lawful, and it draws no less.** No bake dropped (8 grid + 8
logo + 4 + 4 celestial encodes per window in BOTH arms, §4); no boil thinned (`BOIL_CONFIG` not in
the diff, pose count 4 every round); no filter removed (`filterBudget.ts` untouched since
`060792a2`, `grain-static` still read by `gridPoseSvgInked`, `filter-census` green); no transition
shortened (the whirl gets 94 frames where it had 0-5); no DPR lowered (`gridDpr()` is the same
`Math.min(devicePixelRatio, Apple ? 2 : Infinity)`, moved verbatim); no `cacheKey` theme-stripped
(`d`/`l` still in both keys). REFUSED list: none re-proposed by name. The REFUTED `prewarm()` row
points at `GameShell.vue:84-87`, the solver-worker warm — a different function. COPY LAW: no
user-readable string added; `lint:copy` exit 0. No new spec, so no `// PRM:` obligation.

## 2 · THE ARMS

```
base  : AUDIT: build-identity — dist entry index-DOFGihfY7ZtC.js · index.html md5 7241f47bba33881658ad9e63061fa9e3 · 43 files / 807.4 KB
cured : AUDIT: build-identity — dist entry index-CS-Vym5OZcaO.js · index.html md5 c07ba6d9f80a8b26559c0765120fe79d · 43 files / 811.1 KB
```

Both match the author's banked lines. I **rebuilt** the cured arm from the committed HEAD
(`npm run build`, exit 0) and got the same entry hash, so the served dist IS `aa2573a6`.
`dist-base` is genuinely pre-cure: its entry carries no `99999px` probe and no `touchstart`, and
its `animation-vendor` chunk has zero `prewarm` tokens (the cured vendor chunk has one; the four
`prewarm` tokens in the base entry are GameShell's solver warm, present in both arms). The
worktree's `node_modules/@mkbabb/pencil-boil` is a real directory at 0.12.1
(`dist/vue.js` md5 `aa27f230ef7f7dce4ddbb594ae00fe7f`); the main tree's copy is untouched at
0.12.0 — nothing was written through a symlink.

## 3 · THE MARK, RE-READ (5 + 5, interleaved b,c,b,c…)

`instr/toggle-probe.mjs`, `diff` against the A5 bank exits **0**; only `--port` differs.
**chromium · 4× CPU · Fast-3G · cold (CDP cache disabled) · desk 1280×800 · dpr 2 · boot light.**
Load `{6.83 7.51 8.81}` → `{11.95 8.58 9.01}`, 0 tainted of 10, identity printed at both ends and
unmoved. Full table in `stats-c4x-f3g-cold-desk.txt`.

| quantity | base median | base spread | cured median | cured spread | Δ | outside both spreads |
|---|---|---|---|---|---|---|
| **deltaMs** (N1 − median N2..N4) | **1141.9** | 1105.9–1191.0 | **29.0** | −139.3–354.9 | **−1112.9** | **YES** |
| n1SettleMs | 1276.2 | 1206.3–1427.0 | 138.3 | 120.0–448.5 | −1137.9 | YES |
| **n1Bakes** | **8** | 8–8 | **0** | 0–0 | **−8** | **YES** (0 in 5 of 5) |
| n1WhirlFrames | 0 | 0–5 | 94 | 90–97 | +94 | YES |
| n1WhirlWorstMs | 212.9 | 208.4–217.3 | 74.9 | 66.6–91.6 | −138.0 | YES |
| n1RecalcMs (G8) | 87.7 | 82.6–96.3 | 276.1 | 246.7–284.6 | +188.4 | YES — §6 |
| boardReadyMs | 1375.0 | 1358.4–1422.2 | 1388.6 | 1369.0–1480.2 | +13.6 | no |
| bootBakes (≤ ready + 2.5 s) | 16 | 16–16 | 22 | 22–22 | +6 | YES — the warm |
| bootLongTaskMs (same window) | 1093 | 1072–1176 | 1697 | 1462–1738 | +604 | YES — the warm |

The mark moves, in the claimed direction, outside both spreads. **None of the classic lies is
present**: the arms are not swapped (the 8-bake arm serves the base entry hash), the regime is the
charter's, the cache is cold by CDP, and the cure is live on the path measured (0 bakes in the
gesture, +6 encodes at idle).

**One overclaim in the author's return.** They write that the cured delta's *whole spread*
(10.1–41.5) sits under N2–N4's own. At my load (7–12, ten sibling lanes) the cured spread is
−139.3–354.9: two of five windows read 355 and −139 ms because N2..N4 themselves scattered. The
**median** 29.0 ms is inside N2's spread and the accept clause's shape is met at the median; the
"whole spread" reading is a quiet-host fact, not a property of the cure.

## 4 · π — I RAN IT MYSELF

**Goldens**: `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4253 npx playwright test --config
playwright-golden.config.ts` → **4 passed, exit 0**, no `--update-snapshots` (`goldens-cured.txt`).

**Per-pose digests**: `instr/pose-hash-toggle.mjs`, 3 + 3 interleaved windows, chromium 4× ·
Fast-3G · cold · desk dpr 2; `pi-compare.mjs` **exit 0 — "π HOLDS"** (`pi-c4x-desk.txt`):
grid `[95f54de5 a885e347 e3829e30 6fe33241]`, logo `[71c256fa 46eda3c1 1f52e7c7 1f5350de]`,
toggle-sun `[e33f39a8 410e0d7f f9c59d63 0cb30b53]`, toggle-moon `[8e55ead1 03bc159d a0a567d0
030ed446]` — identical in both arms, and identical to the author's and to round 1's readings.
The raws carry the mechanism: the base arm bakes the grid's second round at t0 9,508 → 10,514 ms
(inside the gesture), the cured arm at **3,216 → 4,441 ms** (at idle, after the 3,000 ms floor).
**Pose count 4** in every round, both arms. The probe's ink is proved a second way by
`theme-bake-freshness` — all five games, both directions, both engines, green (§7).

## 5 · WHERE IT FAILS — THE NO-REGRESSION CLAUSES

The charter: *"no regression from spending ~900 ms of main thread at idle — `boardDrawnMs`,
TBT(3000) and GATE D unmoved, the drawer's first gesture (C08's instrument) no worse."*

1. **TBT(3000) — CURED, and I reproduced it.** A6's `readiness-timeline.mjs` VERBATIM, cell
   `mob-cr-4x-f3g-cold` (390×844 **dpr 3** · chromium 4× · Fast-3G · cold), 4 + 4 interleaved,
   load `{4.06 7.14 8.33}` → `{3.19 6.58 8.07}`, 0 tainted:
   **tbt3000 base 538 [536–561] → cured 555 [541–574]**, +17, fully overlapping; longtasks3000
   5 → 5; boardReady 1,379 → 1,398; firstBoilTick 2,563 → 2,572 — all inside. Round 1's ruled
   +111 ms disjoint regression is gone.
2. **GATE D — HOLDS.** chromium boot TBT 185–221 ms (cured) vs 185–200 (base) against a 1,750 ms
   ceiling: PASS in all eight rig runs. WebKit NOT MEASURED (no `longtask`).
3. **GATE A — BREACHED ON THE CURED ARM, 3 OF 3 GRADABLE RUNS** (`rig-summary.txt`). The rig
   unmodified, unthrottled, desk 1440×900 dpr 1, interleaved cured/base, controls clean in every
   window: WebKit median long33 **2 / 1 / 1** on cured (window worsts 30–43 ms) against **0 / 0 /
   0 / 0** on base (worsts 18–19 ms), `BREACH … measured N frames >33.4ms > allowed 0`, EXIT 1 ×3
   vs EXIT 0 ×4. chromium reads 0 on both arms. One cured run was an instrument failure (the probe
   server refused a connection at load 13.6) and is reported, not graded. This is not a host fact
   and not a single red: it is the cure's own idle encode landing inside a census whose allowance
   is zero.
4. **The drawer's first gesture — WORSE ON THE CLOSE, disjoint** (`stats-drawer.txt`). A4's
   `drawer-trace.mjs` VERBATIM, chromium **6×** · mobile 390×844 · **dpr 1** (A4 sets no scale
   factor — its own gap) · cold, 3 windows × 3 cycles per arm, interleaved, 0 tainted:

   | arm | FIRST open worst | long33 | long50 | FIRST close worst | steady open | steady close |
   |---|---|---|---|---|---|---|
   | base | 49.6 [41.6–50.0] | 1,1,1 | 0,0,0 | **17.4 [16.7–17.4]** | 25.0 | 16.7 |
   | cured | 50.1 [49.4–50.3] | 1,1,1 | **0,1,1** | **25.4 [25.0–25.6]** | 24.9 | 16.6 |

   Round 1's tell on the OPEN (long33 1 → 2) is cured, as the author says. But the first CLOSE
   goes **17.4 → 25.4 ms, spreads disjoint**, exactly the +8–9 ms the author reports, and the
   cured first OPEN carries a frame over **50** ms in 2 of 3 windows where the base carries none —
   a tell the author's return does not name. "No worse" is not met.

## 6 · G8, RE-READ AS THE CHARTER ASKS

`n1Recalc` 87.7 → 276.1 ms. Not a cost the cure added: in the base arm N1's restyle is truncated
because the whirl never runs (0–5 frames of ~95). With the bakes gone the whirl runs and N1
restyles like N2–N4. G8's flip frame is now the top item on this surface.

## 7 · GATES, BARE, WITH EXIT CODES

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
| goldens vs :4253 | 0 | 4 passed, no `--update-snapshots` |
| surface specs vs :4253, BOTH engines, scratch config | 0 | **72 passed** — theme-bake-freshness, filter-census, wordmark-integrity, theme-quadrants |
| `perf-rig/ci-subset.mjs --dist dist-base` ×4 | 0,0,0,0 | GREEN every run |
| `perf-rig/ci-subset.mjs --dist dist` ×3 gradable | **1,1,1** | GATE A WebKit — §5.3 |

Scratch config: `playwright-verify.config.ts` here — the estate's default with `webServer`
dropped and `baseURL` pointed at :4253, both engines, retries 0. Never :3000.

## 8 · A FINDING NEITHER ROUND HAS BOOKED: THE LOCKFILE CANNOT SUPPLY `prewarm`

`web/frontend/package.json:71` still declares `"@mkbabb/pencil-boil": "^0.12.0"` and
`package-lock.json` resolves it to **0.12.0 from the npm registry**. 0.12.0 has no `prewarm`.
The measured arms were built against a locally packed, unpublished 0.12.1, and neither
`package.json` nor the lock is in the cure's diff. A fresh `npm ci` anywhere else — CI, the fold,
another machine — installs 0.12.0, and `usePosePrewarm`'s `handle.prewarm(opts, …)`
(`rasterPose.ts:468`) is then a call on `undefined` inside a floating promise: the warm dies as an
unhandled rejection and the cure silently no-ops on every flip. The author names the publish as
the chair's act at the seal; until it happens, **the cure as committed does not build to the arm
that was measured**, and the app half has no `typeof handle.prewarm === "function"` guard.

## 9 · FILES

`verify-r2/`: `VERIFY.md` (this) · `stats-c4x-f3g-cold-desk.txt` · `stats-readiness-{base,cured}.txt`
· `stats-drawer.txt` · `pi-c4x-desk.txt` · `rig-summary.txt` · `goldens-cured.txt` ·
`gate-*.txt` + `gates.log` · `gate-e2e-surface-cured.txt` · `interleave.sh` ·
`interleave-readiness.sh` · `rig-battery.sh` · `rig-battery.log` · `playwright-verify.config.ts` ·
`set-*.log`. Raw jsonl and the six full rig transcripts were pruned after their figures were
transcribed, to hold this directory under the wave's text cap; run 4's rig pair is reproduced
verbatim inside `rig-summary.txt`.

`sysctl -n vm.loadavg`: `{7.41 7.76 9.00}` at open, `{7.43 7.25 7.83}` at close; each set stamps
its own start and end (toggle set `{6.83 7.51 8.81}` → `{11.95 8.58 9.01}`; readiness
`{4.06 7.14 8.33}` → `{3.19 6.58 8.07}`; rig runs 4–14 in `rig-summary.txt`). Up to ten sibling
lanes shared this host and every claim is read against the arms' own spreads because of it.
Every number here is chromium or Playwright WebKit. **A WebKit number is not a Safari number and
no iOS claim**; the device closes each budget through 8.3.
