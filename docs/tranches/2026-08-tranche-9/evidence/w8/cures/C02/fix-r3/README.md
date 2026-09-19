# T9-W8 C02 — REPAIR ROUND 3

2026-09-18 · track `bake` · worktree `.claude/worktrees/w8-bake` · branch `w8/bake` ·
preSha `aa2573a6` → **`feccbb04`** · ports 4252 (base) / 4253 (cured) / 4259 (the rig's own),
all killed at the end. Author of the repair; the ruling being answered is
`../verify-r2/VERIFY.md` (**REPAIR**, three findings).

```
base  : AUDIT: build-identity — dist entry index-DOFGihfY7ZtC.js · index.html md5 7241f47bba33881658ad9e63061fa9e3 · 43 files / 807.4 KB
cured : AUDIT: build-identity — dist entry index-JTBBcqICsyPr.js · index.html md5 af0d5ba680da72c8dacff24bfe7bdbd2 · 43 files / 811.3 KB
```

The base arm is unchanged from rounds 1 and 2 (C01 at `854b562b`), so the mark is read against
the same arm the charter and the verifier read. The cured arm was **rebuilt from the committed
HEAD** after the commit and reproduces the same entry hash, so the served dist is `feccbb04`.
`node_modules/@mkbabb/pencil-boil` is the private 0.12.1 from the local pack
(`dist/vue.js` md5 `aa27f230ef7f7dce4ddbb594ae00fe7f`) in both arms' builds; nothing was
written through a symlink, nothing was pushed, nothing was published.

---

## 1 · WHAT CHANGED, AND ONLY THAT

`git diff aa2573a6..feccbb04` — one product file and one new unit file. No template, no style,
no config, no spec, no gate, no golden.

| finding | repair |
|---|---|
| §5.4 the drawer's first close is disjointly worse | `QUIET_MS = 1500`: no warm pose starts until the page has seen no pointer, key, wheel, touch or click for 1.5 s. The two floors are one wait — `max(BOOT_CENSUS_MS − now, QUIET_MS − sinceLastGesture)`. |
| §8 the lockfile cannot supply `prewarm` | `prewarmerOf(handle)` reads the method once off the handle; its absence disarms the whole composable, so an installed 0.12.0 is a silent no-op instead of an unhandled rejection. Two units (`rasterPose.test.ts`). |
| §5.3 GATE A | **NOT CURED.** The arithmetic is closed at the seam rather than argued — §5 below. |

## 2 · THE MARK, RE-READ ON THIS BUILD (`stats-desk.txt`, `stats-mob.txt`)

A5's `toggle-probe.mjs`, byte-identical to the bank (`diff -q` SAME; only `--port`, a flag it
already takes). **chromium · 4× CPU · Fast-3G · cold (CDP) · desk 1280×800 dpr 2 · boot light**,
5 + 5 interleaved b,c,b,c…, load `{6.31 7.84 8.00}` → `{7.61 7.16 7.56}`, 0 tainted of 10.

| quantity | base median | base spread | cured median | cured spread | Δ | outside both |
|---|---|---|---|---|---|---|
| **deltaMs** (N1 − median N2..N4) | **1142.2** | 997.7–1213.6 | **29.4** | 15.4–378.7 | **−1112.8** | **YES** |
| n1SettleMs | 1244.3 | 1233.2–1322.0 | 129.5 | 122.7–479.1 | −1114.8 | YES |
| **n1Bakes** | **8** | 8–8 | **0** | 0–0 | **−8** | **YES** (0 in 5 of 5) |
| n1WhirlFrames | 2 | 0–3 | 95 | 92–96 | +93 | YES |
| n1WhirlWorstMs | 216.6 | 208.2–224.4 | 74.9 | 65.7–75.0 | −141.7 | YES |
| n1RecalcMs (row G8) | 77.0 | 62.8–84.1 | 276.8 | 272.8–283.1 | +199.8 | YES — §4 |
| boardReadyMs | 1369.7 | 1365.5–1388.6 | 1383.3 | 1376.2–1383.9 | +13.6 | no |
| bootBakes (≤ ready + 2.5 s) | 16 | 16–16 | 22 | 22–22 | +6 | YES — the warm |
| bootLongTaskMs (same window) | 1107 | 1100–1132 | 1720 | 1534–1761 | +613 | YES — the warm |

**mobile 390×844 dpr 3, same engine and link, 3 + 3**: deltaMs **854.1 [853.2–911.9] → 20.9
[15.3–370.8]**, n1Bakes **8 → 0 in 3 of 3**, whirl 32 → 99 frames, worst 150.0 → 66.8 ms,
boardReady 1345.8 → 1356.9 (inside), bootBakes 16 → 23, bootLongTaskMs 811 → 1283.

## 3 · THE REPAIRED FINDINGS

**§5.4 — THE DRAWER (`stats-drawer.txt`).** A4's `drawer-trace.mjs` verbatim, chromium **6×** ·
mobile 390×844 · **dpr 1** (A4 sets no scale factor) · cold, **6 windows × 3 cycles per arm**,
interleaved, 0 tainted, load 8–12. The verifier had three windows; this is six, because the
quantity is frame-quantized and three windows cannot separate 17 from 25 on a 60 Hz surface.

| arm | first open | long33 | long50 | first close | steady open | steady close |
|---|---|---|---|---|---|---|
| base | 54.2 [49.1–66.8] | 1,1,1,1,1,1 | 0,0,0,1,1,1 | **24.3 [16.7–25.1]** | 25.0 [24.5–41.8] | 16.6 [9.4–17.4] |
| cured | 45.8 [25.8–50.8] | 0,1,1,1,1,1 | 0,1,0,0,0,0 | **20.5 [16.0–25.1]** | 25.6 [16.5–41.8] | 16.7 [16.0–25.7] |

The ruled regression is gone: the first close's median is now 3.8 ms **below** the base arm's
and the spreads are the same. The first open, which round 2 also carried a tell on, reads
better than base at this load and carries fewer frames over 50 ms.

**A diagnostic of mine, not a mark** (`warm-standdown.mjs`, `warm-standdown.txt`, load 17–25):
it counts `toBlob` calls while the drawer is worked. Base: 16 boot bakes, **0** during the
interaction, 0 after. Cured: 16 boot bakes, **5 during** (two rounds, 3 poses then 2, each
abandoned at the next gesture), and then the **whole round of 8 in 288 ms after** the
interaction ends. The five are the honest residue of a 1.5 s floor against this instrument's
own 1.58 s gap between one cycle's close and the next cycle's open: the rule keeps a round out
of a pair of gestures 1.5 s apart or closer, and a wider gap lets a round start that the next
gesture then abandons. Abandoning costs the cache nothing (`prewarm` revokes what it minted)
and costs the surface nothing measurable — every drawer quantity above overlaps. `QUIET_MS` is
the single dial if the chair wants that residue at zero; moving it re-opens every reading in
this directory, which is why it was not moved on the last host of the day.

**§8 — THE LOCKFILE.** `package.json:71` still asks `^0.12.0` and the lock still resolves the
published 0.12.0. That stays true — the version bump and the publish are the chair's act at the
seal — but it can no longer break a page: `prewarmerOf` reads the method off the handle and
returns, so a 0.12.0 install warms nothing and throws nothing. Proven by two units that assert
on the app-wide gesture listeners the composable arms on its way in (absent → none armed;
present → `pointerdown` and `click` armed). `Test Files 67 · Tests 812` (was 66 / 810).

## 4 · ROW G8, AS THE CHARTER ASKS

`n1Recalc` 77.0 → 276.8 ms desk, 80.6 → 305.6 mobile. Not a cost this cure added: in the base
arm N1's restyle is truncated because the whirl never runs (2 frames of ~95). With the bakes
gone N1 restyles exactly as N2–N4 do. G8's flip frame is the top item left on this surface.

## 5 · GATE A — NOT CURED, AND WHY THERE IS NO PLACEMENT (`rig/`)

`perf-rig/ci-subset.mjs` unmodified, port 4259, unthrottled, desk 1440×900 dpr 1, interleaved
cured/base ×3, every control window clean:

| run | arm | webkit window long33 | worst ms | median | GATE A | EXIT | load at start |
|---|---|---|---|---|---|---|---|
| 1 | cured | 0,0,1 | 32 / 31 / 36 | 0 | PASS | 0 | 8.97 |
| 1 | base | 0,0,0 | 23 / 18 / 18 | 0 | PASS | 0 | 5.24 |
| 2 | cured | 0,2,1 | 32 / 39 / 37 | 1 | **FAIL** | 1 | 8.16 |
| 2 | base | 0,0,0 | 18 / 18 / 18 | 0 | PASS | 0 | 7.41 |
| 3 | cured | 5,3,6 | 52 / 48 / 68 | 5 | **FAIL** | 1 | 13.19 |
| 3 | base | 0,0,0 | 18 / 18 / 27 | 0 | PASS | 0 | 24.24 |

chromium reads long33 0 on both arms in all six runs. GATE B, C and D pass on both arms in all
six (**GATE D**, the clause the charter does name: chromium 4× boot TBT well under the 1,750 ms
ceiling, unmoved). Run 3 was taken at load 13–24 and its base twin, taken at load 24, still read
0/0/0 — the arm is what differs, load only amplifies it.

**The arithmetic, closed rather than argued.** The two censuses are `[0, 3000]` from navigation
(TBT, repair round 1's ruled finding) and `[boardReady + 1450, boardReady + 4470]` (the rig
settles 1,200 ms, sleeps 250 more, then samples a 3,000 ms window whose wall runs 3,014–3,017).
A5 — the instrument that reads this cure — waits 2,500 ms for the boot bakes, takes a census,
then measures a 1,000 ms idle control, so its first tap lands at **boardReady + 3.8 s**: about
**650 ms before the idle census closes**. A warm placed past that far edge arrives after the tap
and buys nothing; a warm placed before it is inside the census. Unthrottled the two spans
overlap into one forbidden run from 0 to ~4.5 s; at 4× they still touch. There is no third
placement, and a pose cannot be sliced under 33.4 ms — the encode does not leave the main
thread (the library's own reading), and every way of making a pose cheaper is on the charter's
REFUSED list. An `IdleDeadline.timeRemaining() >= 25 ms` rule was tried in round 0 and pushed
the whole warm past the tap.

So the trade is exactly what round 2 wrote and what this round measured a third time: one to
five 31–39 ms frames, once, on a page nobody is touching, against 833–1,113 ms off the first
theme flip. GATE A is a LOCAL instrument (O-12: CI is sixteen browserless lanes) whose ceiling
was written for permanent idle churn. **The ruling is the chair's**: amend the census to admit
a bounded one-time warm, take the trade in writing, or close this family — C02, C11's
persistence, and any idle memoization fall together.

## 6 · π AND THE GATES

| gate | exit | note |
|---|---|---|
| `npm run test:unit` | 0 | **Test Files 67 passed (67) · Tests 812 passed (812)** |
| `lint:eslint` · `lint` · `lint:knip` · `lint:boundary` | 0,0,0,0 | |
| `lint:tdz` · `lint:copy` · `lint:live-regions` · `lint:motion` | 0,0,0,0 | |
| `typecheck:e2e` · `typecheck:node` | 0,0 | |
| goldens vs :4253 | 0 | 4 passed, no `--update-snapshots` |
| surface specs vs :4253, both engines, scratch config | 0 | **72 passed** — theme-bake-freshness, filter-census, wordmark-integrity, theme-quadrants |
| `perf-rig/ci-subset.mjs --dist dist-base` ×3 | 0,0,0 | GREEN every run |
| `perf-rig/ci-subset.mjs --dist dist` ×3 | 0,1,1 | GATE A WebKit — §5 |

**π holds.** `pose-hash-toggle.mjs`, 3 + 3 interleaved, chromium 4× · Fast-3G · cold · desk
dpr 2; `pi-compare.mjs` **exit 0** (`pi-c4x-desk.txt`): grid `[95f54de5 a885e347 e3829e30
6fe33241]`, logo `[71c256fa 46eda3c1 1f52e7c7 1f5350de]`, toggle-sun `[e33f39a8 410e0d7f
f9c59d63 0cb30b53]`, toggle-moon `[8e55ead1 03bc159d a0a567d0 030ed446]` — identical in both
arms and identical to rounds 1 and 2. Pose count 4 every round. `filterBudget` 9, untouched.
No bake dropped, no boil thinned, no filter removed, no transition shortened, no DPR lowered,
no `cacheKey` theme-stripped, nothing from the REFUSED list re-proposed.

**TBT(3000)**, the clause round 1 exists for — A6's `readiness-timeline.mjs` verbatim, cell
`mob-cr-4x-f3g-cold` (390×844 dpr 3 · chromium 4× · Fast-3G · cold), 3 + 3 interleaved:
**550 [549–579] → 572 [545–582]**, spreads fully overlapping; longtasks3000 5 → 6 [5–6];
boardReady 1377.8 → 1406.6; firstBoilTick 2560.0 → 2566.9. No regression.

## 7 · FILES

`battery.sh` (set 1) · `battery-b.sh` (sets 2–5) + their logs · `drawer-more.sh` ·
`rig-battery.sh` + `rig/` (six transcripts) · `gates.sh` + `gate-*.txt` ·
`playwright-cured.config.ts` (the estate default with `webServer` dropped and `baseURL` on
:4253 — never :3000) · `stats-desk.txt` · `stats-mob.txt` · `stats-drawer.txt` ·
`stats-readiness-{base,cured}.txt` · `pi-c4x-desk.txt` · `goldens-cured.txt` ·
`gate-e2e-surface-cured.txt` · `warm-standdown.mjs` + `.txt` · `raw/`.

The first attempt at sets 2–4 passed A5's flags under the wrong names (`--cpu`, `--vp`), so the
probe ran unthrottled; those windows were discarded whole, are named in `battery-b.sh`, and are
counted nowhere.

`sysctl -n vm.loadavg`: `{4.20 5.94 7.17}` at open, `{8.93 13.48 11.94}` at close; each set
stamps its own start and end. Up to ten sibling lanes shared this host, which is why every
claim is read against the arms' own spreads. Every number here is chromium or Playwright
WebKit. **A WebKit number is not a Safari number and carries no iOS claim** — the device closes
each budget through 8.3.
