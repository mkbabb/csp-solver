# C02 — REPAIR ROUND 1 · the warm waits for the boot census to close

2026-09-18 · track `bake`, worktree `.claude/worktrees/w8-bake`, branch `w8/bake` ·
preSha `84a4ad45` (round 0's cure, the version the verifier ruled REPAIR on) ·
fix `5fba8e3b` · library unchanged (`pencil-boil` `t9-w8` `617720b`, 0.12.1, still local-only).

    BASE ARM   AUDIT: build-identity — dist entry index-DOFGihfY7ZtC.js · index.html md5
               7241f47bba33881658ad9e63061fa9e3 · 43 files / 807.4 KB      (C01 at 854b562b)
    CURED ARM  AUDIT: build-identity — dist entry index-CS-Vym5OZcaO.js · index.html md5
               c07ba6d9f80a8b26559c0765120fe79d · 43 files / 811.1 KB      (C02+fix at 5fba8e3b)

The cured identity was re-derived by rebuilding from the committed HEAD after the commit and is
identical, so the arm measured is the arm committed. Base on :4252, cured on :4253, both from
the worktree's `web/frontend` by `vite preview`, both killed at the end.

**STATUS: PARTIAL.** The ruled regression is cured and proven. π holds on an instrument I ran.
Every gate is green. The charter's own cell — chromium 4× · desk dpr 2 — could NOT be re-read
on this host: the load ran 25 → 46 → 372 → 423 through the night (ten sibling lanes, WebKit
GPU processes at 130 % each), and at those loads the page's own boot round does not finish
before the instrument's tap in EITHER arm, which taints every window by the rule below. What
moved, moved at 1×. What is unmeasured is named, including one the fix makes riskier.

---

## 1 · WHAT THE VERIFIER FOUND, AND WHAT I DID WITH IT

| # | finding (`verify-r1/VERIFY.md`) | disposition |
|---|---|---|
| 1 | TBT(3000) moved: mobile dpr 3, +111.5 ms, disjoint spreads, three builds | **CURED** — §2 |
| 2 | GATE A breached once on the cured arm, unconfirmed (loaded control) | **NOT CURED, and the fix makes it likelier** — §5, handed up |
| 3 | 6× is a no-op that still spends encodes; must not be claimed as a win | **STATED, not claimed** — §4 |
| 4 | the returned headline was a subgroup median of a mixed population | **WITHDRAWN** — §3 |
| 5 | advisory: `rootLadder` cached module-globally for the page's life | **FIXED** — §6 |
| 6 | advisory: `bootStacks` only ever increases | **FIXED** — §6 |

## 2 · THE CURE OF THE RULED FAILURE

`bootStacksSettled` proves the page's own boot round is over. It does not prove the page is out
of the window the boot census READS, and at one pose size those are different facts by 600 ms:
at 390×844 dpr 3 · chromium 4× · Fast-3G the boot bakes end at 2,374–2,392 ms, round 0's warm
ran 2,628 → 3,606, and one whole grid pose landed inside the 3,000 ms census.

TBT(3000) is Σ max(0, longtask − 50) over entries whose `startTime` is under 3,000 ms, and a
grid pose is a task over 50 ms in every regime measured (1,092² at dpr 3 ≈ 190 ms at 4×; 1,272²
at dpr 2 ≈ 65 ms unthrottled). So a warm pose started inside the census moves TBT by
construction. The fix is the census's own edge, read off the clock the census uses:
`BOOT_CENSUS_MS = 3000` on `performance.now()` (`rasterPose.ts:367`, enforced at
`rasterPose.ts:476`). The contribution is zero rather than small.

**A6 `readiness-timeline.mjs` VERBATIM, 5 + 5 interleaved b,c,b,c…, mob-cr-4x-f3g-cold
(390×844 · dpr 3 · chromium 4× · Fast-3G · cold), load `{8.01 8.59 10.62}` → `{10.09 9.28
10.78}`, 0 tainted:**

| mark | base median | base spread | cured median | cured spread | Δ | verdict |
|---|---|---|---|---|---|---|
| **tbt3000Ms** | **694** | 555–731 | **635** | 550–842 | **−59** | inside both spreads — **the regression is gone** |
| longtasks3000 | 6 | 5–7 | 6 | 5–6 | 0 | inside |
| firstBoilTickMs (B1's boardDrawn) | 2,844 | 2,577–3,704 | 2,713 | 2,575–3,090 | −131 | inside |
| boardReadyMs | 1,480 | 1,406–1,506 | 1,448 | 1,409–1,495 | −32 | inside |
| busyToBoardReadyMs | 295 | 187–327 | 277 | 185–308 | −18 | inside |

Round 0's same cell read base 550.5 [544–567] → cured 662 [650–1,329] — disjoint. It is now
overlapping with the cured median BELOW the base's. (This host is louder than round 0's, which
is why both arms sit higher; the arms are read against each other, interleaved, not against the
older set.)

**Proof the floor is live, off the raws:** the first warm encode now starts at **3,008 / 3,010
ms** (`fix-r1/raw/c1x-none-cold-desk/cured-w1,w2`), where round 0's started at **878 / 886 /
878** (`raw/c1x-none-cold-desk`) and mobile's at **2,628 / 2,638 / 2,636**.

## 3 · THE MARK, RE-READ — AND THE CELL THAT COULD NOT BE READ

The headline of record for round 0's build is now the verifier's, not mine: **−900.8 ms**
(5 + 5, all windows, base 1,117.2 [905.5–1,343.4] → cured 216.4 [38.0–331.1]). My round-0
return's −1,403.0 was the median of the six windows where the warm landed differenced against a
base median over ten — a mixed population. **Withdrawn.**

**chromium · 1× · unthrottled link · cold · desk 1280×800 · dpr 2 · 3 + 3 interleaved**, load
`{9.58 14.84 13.73}` → `{25.86 25.22 19.10}`, `fix-r1/stats-c1x-none-cold-desk.txt`:

| quantity | base median | base spread | cured median | cured spread | Δ | outside both spreads |
|---|---|---|---|---|---|---|
| **deltaMs** (N1 − median N2..N4) | **567.7** | 523.9–814.6 | **0.0** | 0.0–130.1 | **−567.7** | **YES** |
| n1SettleMs | 827.6 | 523.9–984.9 | 0.0 | 0.0–420.7 | −827.6 | YES |
| **n1Bakes** | **8.0** | 8–8 | **0.0** | 0–0 | **−8** | **YES** (0 in 3 of 3) |
| n1WhirlWorstMs | 175.5 | 141.5–199.9 | 26.6 | 25.3–49.9 | −148.9 | YES |
| n1WhirlFrames | 47 | 26–78 | 99 | 92–115 | +52 | YES |
| boardReadyMs | 308.4 | 201.3–328.3 | 244.6 | 132.5–285.5 | −63.8 | inside |

So the floor does **not** cost the fast regime its warm, and the reason is worth writing down
because I got it wrong before measuring: the probe's tap is NOT at `boardReady + 2,500 ms` of
page time. `waitForFunction` polling and the CDP round trips put the real click at ~3.7 s at 1×
and at 4–6 s at 4×, which is why a warm floored at 3,000 ms still lands ahead of it.

**The charter's own cell, chromium 4× · desk dpr 2, is UNREAD.** Two 5 + 5 interleaved sets
(`stats-c4x-f3g-cold-desk.txt` at load 9 → 46, `…-HIGHLOAD.txt` at load 12 → 35) both read
"inside the spread" on every quantity, and both are **tainted by a pre-registered rule I state
here**: a window is valid only if the page's 16 boot encodes have completed before the tap
(`bootBakes ≥ 16`), the condition every round-0 and verify-r1 window met. In these sets the
base arm's `bootBakes` median is **0** and the cured arm's **2** — the page was still booting
when it was asked about its first toggle. Nothing about a cure can be read from that, in either
direction, and I am not reading one.

## 4 · 6× — STATED, NOT CLAIMED

At chromium 6× the boot round ends at ~4,330 ms, so `bootStacksSettled` already dominates the
3,000 ms floor and nothing changes: the warm has at best reached its first pose when the probe
taps, contributes no cache entry, and costs one encode. **The 6× cell is a no-op for this cure.**
Round 0 measured it +279.0 ms (one in-flight wordmark pose); the verifier measured it −263.3 ms;
both are inside their spreads and both agree on the substance. It is not a win and is not
claimed as one.

## 5 · GATE A — NOT CURED, AND THE FIX MAKES IT LIKELIER · THE CHAIR'S BALLOT

The verifier's §8 says the same deferral would take the idle encodes out of the perf rig's first
idle window. **It does the opposite**, and the rig's own source plus the raws say so:

- `perf-rig/probe.js` `idle3s` = `waitFor(boardReady)` → `sleep(SETTLE = 1200)` → `sampleFor(3000)`,
  and `ci-subset.mjs` runs that load **unthrottled** (only the boot-TBT load is throttled). So
  the window is `[boardReady + 1,200, boardReady + 4,200]`, and boardReady unthrottled is
  71–328 ms measured — a window of roughly **[1.3 s, 4.5 s]**.
- Round 0's warm ran **878 → 1,221 ms** at 1×: it ended 59 ms BEFORE that window opened, which
  is exactly why the verifier saw one leaked long frame rather than four.
- The floored warm runs **3,008 → 3,714 ms**: dead inside it.

GATE A's ceiling is `maxLong33 = 0` on a median of three windows. Whether the warm breaches it
turns on one unmeasured quantity — the cost of a grid pose at the rig's own pose (1440×900,
**dpr 1**, a quarter of dpr 2's pixels), where it may or may not clear 33.4 ms; the verifier's
single breach was WebKit at 42–43 ms worst frame on the UNFLOORED arm. **I could not run the rig:
at load 277–423 its admissibility rule refuses a verdict anyway (the control page drops frames).**

The general shape, which is the chair's to rule on and not mine:

> The estate's idle census forbids any main-thread frame over 33.4 ms in the three seconds after
> the board settles, and the charter's clause forbids any task over 50 ms in the three seconds
> after navigation. A pre-warm of eight rasters is ~300 ms of main thread at 1× and ~900 ms at
> 4×. There is no placement before the instrument's first tap that is outside both. C02 buys
> −900 ms inside a gesture by spending that time at idle; the two censuses are exactly the
> instruments that forbid spending it. **Either the trade is taken in writing, or the whole
> family — C02, C11's persistence, any idle memoization — is closed by GATE A.**

## 6 · THE TWO ADVISORIES

- `lightLadder` re-collects when the viewport changes (`rasterPose.ts:196-201`). The ladder is
  collected under the conditions that HOLD at collection time; `:root` declares tokens inside
  width media queries, so a ladder cached across a resize hands the probe a condition that has
  since flipped. No ink token sits behind such a condition today, so this moves no pixel now.
- `registerBootStack` releases its claim on scope disposal (`rasterPose.ts:415-431`). A surface
  that unmounts before admitting a stack would otherwise hold `bootStacks > bootStacksAdmitted`
  forever and no warm would ever run.

## 7 · π AND THE GATES

**π — I ran it after the fix, on the built cured dist.**

- Goldens: `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4253 npx playwright test --config
  playwright-golden.config.ts` → **4 passed, exit 0**, no `--update-snapshots` (`goldens-cured.txt`).
- Per-pose digests: `instr/pose-hash-toggle.mjs` 3 + 3 windows, chromium 4× · Fast-3G · cold ·
  desk dpr 2, 24 encodes per window, 0 tainted; `pi-compare.mjs` **exit 0 — "π HOLDS"**
  (`pi-c4x-desk.txt`): grid `[95f54de5 a885e347 e3829e30 6fe33241]`, logo `[71c256fa 46eda3c1
  1f52e7c7 1f5350de]`, toggle-sun `[e33f39a8 …]`, toggle-moon `[8e55ead1 …]` — identical in both
  arms, and identical to the digests the verifier read at round 0.
- Pose count **4** in every round, both arms. `filterBudget.ts` is not in the diff; the census
  spec is green below. No bake dropped (8 grid + 8 logo + 4 + 4 in both arms), no boil thinned,
  no filter removed, no transition shortened, no DPR lowered, no cacheKey theme-stripped.

**Gates, bare, in the worktree:**

| gate | exit | note |
|---|---|---|
| `npm run test:unit` | 0 | **Test Files 66 passed (66) · Tests 810 passed (810)** |
| `npm run lint:eslint` | 0 | |
| `npm run lint` | 0 | |
| `npm run lint:knip` | 0 | |
| `npm run lint:boundary` | 0 | |
| `npm run lint:tdz` | 0 | |
| `npm run lint:copy` | 0 | no user-readable string added |
| `npm run lint:live-regions` | 0 | |
| `npm run lint:motion` | 0 | no new spec, so no `// PRM:` obligation |
| `npm run typecheck:e2e` | 0 | |
| `npm run typecheck:node` | 0 | |
| goldens vs :4253 | 0 | 4 passed |
| `playwright-throttle.config.ts` vs :4253, BOTH engines | 0 | **67 passed** — filter-census, wordmark-integrity, theme-bake-freshness, theme-quadrants, throttled-void |
| `perf-rig/ci-subset.mjs` (GATE A–D) | **NOT RUN** | host at load 277–423; the rig refuses a verdict on a contended control |

## 8 · WHAT A ROUND 2 OWES

1. The charter's cell — chromium 4× · desk dpr 2 — 5 + 5 interleaved on a host under load ~10,
   with the `bootBakes ≥ 16` taint rule applied. 4× mobile dpr 3 beside it: the floored warm has
   ~900 ms of encode to fit between 3,000 ms and the tap, and that is the tightest cell there is.
2. `perf-rig/ci-subset.mjs --dist dist` ×3 against `--dist dist-base` ×3, quiet host, GATE A read
   per engine. §5 is arithmetic, not a measurement, and it predicts the cure is now inside the
   window it used to miss.
3. The chair's ruling on §5's ballot before any seal.

`sysctl -n vm.loadavg`: stamped at both ends of every set in `fix-r1/raw/*` and in the set logs
above. Ten sibling lanes shared this host throughout; every claim here is read against the arms'
own spreads because of it.
