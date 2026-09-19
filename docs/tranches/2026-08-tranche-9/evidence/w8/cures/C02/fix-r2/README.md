# C02 — REPAIR ROUND 2 · the charter's cell read at last, and the census the floor cannot clear

2026-09-18 · track `bake`, worktree `.claude/worktrees/w8-bake`, branch `w8/bake` ·
preSha `5fba8e3b` (round 1's fix, committed by the agent a host reboot cut off before it could
return) · this round's commit `aa2573a6` (the seam's record; no behaviour) ·
library unchanged (`pencil-boil` `t9-w8` `617720b`, 0.12.1, local pack only).

    BASE ARM   AUDIT: build-identity — dist entry index-DOFGihfY7ZtC.js · index.html md5
               7241f47bba33881658ad9e63061fa9e3 · 43 files / 807.4 KB      (C01 at 854b562b)
    CURED ARM  AUDIT: build-identity — dist entry index-CS-Vym5OZcaO.js · index.html md5
               c07ba6d9f80a8b26559c0765120fe79d · 43 files / 811.1 KB      (C02 at aa2573a6)

The cured identity was re-derived by rebuilding from the committed HEAD **after** `aa2573a6` and
is byte-identical to the arm that was measured (comments do not survive the build), so the arm
read below is the arm on the branch. Base on :4252, cured on :4253, both `vite preview` out of
the worktree's `web/frontend`, both killed at the end.

**STATUS: the cure's number is proven and π holds; ONE gate does not, and it is the chair's.**
Round 1's ruled failure stays cured. The charter's own cell — the one round 1 could not read on a
host at load 400 — reads a disjoint −1,231.6 ms with the delta now INSIDE N2's spread. Every
npm gate, the goldens and the built-dist specs on both engines are green. The estate's idle
long-frame census (GATE A, `perf-rig/ci-subset.mjs`) reds on WebKit in three of three cured runs
against three clean base runs, and no lawful placement clears it — §4.

---

## 1 · WHAT ROUND 1 LEFT, AND WHAT THIS ROUND DID WITH IT

| # | verifier finding (`verify-r1/VERIFY.md`) | round 1 | round 2 |
|---|---|---|---|
| 1 | TBT(3000) moved: mobile dpr 3, +111.5 ms, disjoint | CURED (`5fba8e3b`) | **RE-PROVED** — §3 |
| 2 | GATE A breached once on the cured arm, unconfirmed | not cured, handed up as arithmetic | **MEASURED, 3+3 runs, quiet host** — §4 |
| 3 | 6× is a no-op that still spends encodes | stated in the commit message | **stated at the seam**, `aa2573a6` |
| 4 | the headline was a subgroup median | withdrawn | **replaced** by the whole-population read — §2 |
| 5 | advisory: `rootLadder` cached for the page's life | fixed (`5fba8e3b`) | unchanged, re-linted |
| 6 | advisory: `bootStacks` only ever increases | fixed (`5fba8e3b`) | unchanged, re-linted |
| — | round 1's own open item: the charter's cell unread | host at load 25 → 423 | **read at load 6–9** — §2 |

Nothing in this round changes behaviour. `aa2573a6` edits one comment block in
`src/pencil/composables/rasterPose.ts` and the build is byte-identical.

## 2 · THE MARK, IN THE CHARTER'S OWN CELL

`instr/toggle-probe.mjs` — A5's banked instrument, `diff` against the bank exits 0; only `--port`
differs between the arms. **chromium · 4× CPU · Fast-3G · cold (CDP) · desk 1280×800 · dpr 2 ·
boot light**, 5 + 5 interleaved b,c,b,c…, load `{6.11 7.04 10.55}` → `{9.08 7.70 10.36}`,
**0 tainted**, and every window clears round 1's pre-registered rule (`bootBakes ≥ 16`: base 16
in 5 of 5, cured 21–22 — the surplus is the warm's own encodes).

| quantity | base median | base spread | cured median | cured spread | Δ | outside both spreads |
|---|---|---|---|---|---|---|
| **deltaMs** (N1 − median N2..N4) | **1,254.8** | 1,134.4–1,303.6 | **23.2** | 10.1–41.5 | **−1,231.6** | **YES** |
| n1SettleMs | 1,355.4 | 1,234.7–1,418.9 | 134.8 | 122.1–146.1 | −1,220.6 | YES |
| n234SettleMs | 100.6 | 99.8–115.3 | 106.7 | 98.9–124.7 | +6.1 | no |
| **n1Bakes** | **8** | 8–8 | **0** | 0–0 | **−8** | **YES** (0 in 5 of 5) |
| n1WhirlFrames | 1 | 0–3 | 94 | 91–95 | +93 | YES |
| n1WhirlWorstMs | 225.3 | 209.1–225.8 | 75.1 | 66.7–83.9 | −150.2 | YES |
| n1RecalcMs (G8) | 83.3 | 78.5–92.0 | 277.7 | 272.0–291.2 | +194.4 | YES — §5 |
| boardReadyMs | 1,440.5 | 1,395.7–1,506.9 | 1,419.5 | 1,379.7–1,447.3 | −21.0 | no |
| bootBakes (≤ ready + 2.5 s) | 16 | 16–16 | 22 | 21–22 | +6 | YES — the warm |
| bootLongTaskMs (same window) | 1,243 | 1,123–1,252 | 1,649 | 1,522–1,732 | +406 | YES — the warm |

**The accept clause is met here, not merely approached**: the charter asks for `N1 bakes == 0`
and "the delta inside N2's spread". N1 bakes are 0 in every window and the delta's whole spread
(10.1–41.5) sits under N2–N4's own (98.9–124.7). The verifier's honest −900.8 at round 0 becomes
−1,231.6 with the floor in, and cured N1 settles in 134.8 ms — inside the ≤ 150 ms shape the
charter proposes, though that shape is still SET from the device through 8.3.

**Mobile, the re-take the charter ordered at controlled load** (chromium · 4× · Fast-3G · cold ·
390×844 · **dpr 3**, 3 + 3 interleaved, load 9.5–11.0, 0 tainted, bootBakes 16 → 23):

| quantity | base | cured | Δ |
|---|---|---|---|
| deltaMs | **908.0** [873.9–928.6] | **15.0** [4.8–18.1] | **−893.0**, disjoint |
| n1SettleMs | 1,003.9 [966.6–1,025.2] | 113.4 [103.5–114.3] | −890.5 |
| n1Bakes | 8 | **0** in 3 of 3 | −8 |
| n1WhirlFrames / worst | 29 / 158.8 ms | 97 / 58.2 ms | +68 frames, −100.6 ms |
| boardReadyMs | 1,371.3 | 1,365.2 | inside |
| bootLongTaskMs | 886 [813–926] | 1,284 [1,268–1,479] | +398 — the warm, again |

The lane's unstable 882 is retired: this is the mobile number, taken at a load the host held.

## 3 · THE RULED REGRESSION, RE-PROVED

A6's `readiness-timeline.mjs` VERBATIM, cell `mob-cr-4x-f3g-cold` (390×844 dpr 3 · chromium 4× ·
Fast-3G · cold), 5 + 5 interleaved, load `{9.53 8.26 10.37}` → `{10.30 8.18 10.44}`, 0 tainted:

| mark | base median | base spread | cured median | cured spread | verdict |
|---|---|---|---|---|---|
| **tbt3000Ms** | **558** | 545–572 | **567** | 545–570 | +9, fully overlapping — **cured** |
| longtasks3000 | 6 | 5–6 | 6 | 6–6 | unmoved |
| firstBoilTickMs (B1) | 2,559 | 2,558–2,570 | 2,567 | 2,564–2,572 | inside |
| boardReadyMs | 1,392 | 1,382–1,409 | 1,404 | 1,391–1,408 | inside |
| busyToBoardReadyMs | 229 | — | 239 | — | inside |

Round 0's same cell read 550.5 [544–567] → 662 [650–1,329], disjoint. GATE D agrees from the
other side: chromium boot TBT base 209 / 196 / 246 ms vs cured 191 / 199 / 202 ms against a
1,750 ms ceiling, PASS in all six rig runs.

## 4 · GATE A — MEASURED, AND IT IS THE CHAIR'S BALLOT

Full table in `stats-gate-a.txt`; runs in `rig/`. `perf-rig/ci-subset.mjs`, three runs per arm,
**interleaved** cured, base, cured, base, cured, base, load 4–10 throughout, and the rig's own
app-free control held 0 long frames in every one of the twelve windows it sampled.

| arm | chromium median long33 | WebKit median long33 | WebKit window worsts | RESULT |
|---|---|---|---|---|
| base ×3 | 0, 0, 0 | **0, 0, 0** | 18–27 ms | GREEN, GREEN, GREEN (EXIT 0) |
| cured ×3 | 0, 0, 0 | **1, 2, 2** | 35–48 ms | RED, RED, RED (EXIT 1) |

The census samples 3,000 ms starting 1,200 ms after board-ready, unthrottled, at 1440×900 dpr 1.
A warm floored at 3,000 ms runs 3.0 → 3.7 s: inside it. At the rig's pose chromium never reaches
33.4 ms; WebKit costs 35–48 ms per pose and the gate allows zero.

**There is no third placement, and the two censuses say so themselves.** TBT(3000) forbids a task
over 50 ms in [0, 3,000] from navigation. GATE A forbids a frame over 33.4 ms in
[board-ready + 1,200, board-ready + 4,200]. Unthrottled board-ready is 0.1–0.3 s, so the spans
overlap into one forbidden run to ~4.5 s; at 4× CPU board-ready is ~1.45 s and the idle span
[2.65 s, 5.65 s] swallows the moment TBT's closes. The flip the instruments read lands inside
that run — at 4× desk the probe's first toggle bakes at board-ready + 3.8 s. And a pose cannot be
sliced under the frame budget: the library's own measurement (`vue.ts`, "WHY A CACHE AND NOT A
THREAD") is that the encode does not leave the main thread, and every way to make a pose cheaper
— DPR, `captureSide`, `poseCount`, `grain-static` — is on the charter's REFUSED list.

So the shape is exactly what round 1 predicted in arithmetic, now in numbers:

> One or two 35–48 ms frames, once, on a page nobody is touching, against ~900 ms off the first
> theme flip. GATE A is a LOCAL instrument (O-12: CI is sixteen browserless lanes; perf-subset
> was deleted at `d1daefb3`), and its zero was written for PERMANENT idle churn — T4-P1's
> unlayered-SVG filter re-execution, which never stopped. A bounded one-time warm is a different
> animal the gate cannot distinguish. **Either the trade is taken in writing, or this family —
> C02, C11's persistence, any idle memoization — is closed by GATE A.**

## 5 · G8, THE ROW THE CHARTER SENDS US BACK TO

`n1RecalcMs` 83.3 → 277.7 ms at 4× desk (88.7 → 303.7 mobile). It is not a cost the cure added:
in the base arm N1's restyle is truncated because the whirl never runs (1 frame of ~100). With
the bakes gone the whirl runs (94 frames) and N1 restyles exactly like N2–N4 — N2's own recalc
was 256.6–276.4 ms before this cure existed. **G8's long flip frame is now the top item on this
surface**: cured N1 carries `whirlLong33` 1 and a 75.1 ms worst frame, and that frame is the
whole of what is left of the first flip's cost.

## 6 · THE DRAWER, WITH THE WARM IN FLIGHT

A4's `drawer-trace.mjs` VERBATIM, chromium 6× · mobile 390×844 · **dpr 1** (A4 sets no scale
factor — its own gap) · cold, 3 windows × 3 cycles per arm, interleaved, 0 tainted:

| arm | FIRST open worst | long33 each | FIRST close worst | steady open | steady close |
|---|---|---|---|---|---|
| base | 49.9 [49.9–50.8] | 1, 1, 1 | 16.6 [15.7–25.0] | 24.3 | 16.7 |
| cured | 57.7 [49.8–58.3] | 1, 1, 1 | **25.9 [25.9–33.9]** | 25.3 | 13.0 |

The verifier's tell is gone: FIRST open `long33` was 1 → 2 in 3 of 3 cured windows at round 0 and
is now **1, 1, 1 in both arms**, with overlapping worst-frame spreads. What is left is a smaller
one in the other direction: the first CLOSE's worst frame, 16.6 → 25.9 ms, spreads disjoint, and
one of the three cured windows carries a `long33` where the base carries none. At 6× the boot
round ends around 4.3 s, so the open's own gesture stands the warm down and the re-queue (1.2 s)
lands near the close. It is under the 33.4 ms line in 2 of 3 windows and over it in 1. Reported,
not explained away; it belongs with §4's ballot, since it is the same spend seen by another
instrument.

## 7 · π AND THE GATES

**π — run in this round, on the built cured dist.**

- Goldens: `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4253 npx playwright test --config
  playwright-golden.config.ts` → **4 passed, exit 0**, no `--update-snapshots`.
- Per-pose digests: `instr/pose-hash-toggle.mjs` 3 + 3 windows, chromium 4× · Fast-3G · cold ·
  desk dpr 2, 0 tainted; `pi-compare.mjs` **exit 0 — "π HOLDS"**: grid
  `[95f54de5 a885e347 e3829e30 6fe33241]`, logo `[71c256fa 46eda3c1 1f52e7c7 1f5350de]`,
  toggle-sun `[e33f39a8 410e0d7f f9c59d63 0cb30b53]`, toggle-moon `[8e55ead1 03bc159d a0a567d0
  030ed446]` — identical in both arms and identical to round 0's and the verifier's readings.
  The raws show the mechanism in one line: the base arm bakes that round at t0 9,543 → 10,586 ms
  (inside the gesture), the cured arm at **3,237 → 4,313 ms** (at idle, after the floor).
- Pose count **4** every round, both arms. 8 grid + 8 logo + 4 + 4 encodes per window, both arms —
  no bake dropped. `filterBudget.ts` is not in the diff and `filter-census.spec` is green below.
  No boil thinned, no filter removed, no transition shortened, no DPR lowered, no cacheKey
  theme-stripped.

| gate | exit | note |
|---|---|---|
| `npm run test:unit` | 0 | **Test Files 66 passed (66) · Tests 810 passed (810)** |
| `npm run lint:eslint` | 0 | |
| `npm run lint` | 0 | prettier |
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
| `perf-rig/ci-subset.mjs` GATE A (webkit) | **1** | §4 — three cured runs RED, three base runs GREEN |
| `perf-rig/ci-subset.mjs` GATE B/C/D | 0 | idle fps, undoBurst, boot TBT all PASS on both arms |

## 8 · WHAT IS STILL OWED

1. **The chair's ruling on §4.** Nothing else in this cure moves until it lands, and the same
   ruling decides C11 before it is written.
2. **The device (8.3).** Every number here is a proxy. A WebKit number is not a Safari number and
   is no iOS claim; the ≤ 150 ms shape is SET from the device, and the 35–48 ms idle frames want
   a real-Safari reading too.
3. **G8** (§5) — the flip's remaining cost, and the row the charter points at after this cure.
4. **The library release.** `pencil-boil` 0.12.1 exists only as a local pack
   (`.claude/worktrees/pencil-boil-t9-packs/mkbabb-pencil-boil-0.12.1.tgz`, commit `617720b` on
   `t9-w8`). The branch's `package.json` still names 0.12.0; the version bump and the publish are
   the chair's act at the seal.

`sysctl -n vm.loadavg`: stamped at both ends of every set in `fix-r2/raw/*` and in each set's log
lines; `{7.35 8.26 9.68}` at close. Up to ten sibling lanes shared this host, and every claim is
read against the arms' own spreads because of it.
