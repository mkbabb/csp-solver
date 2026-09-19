# T9-W8 C02 — NON-AUTHOR VERIFICATION, round 3

2026-09-18 · track `bake` · worktree `.claude/worktrees/w8-bake` @ `feccbb04` (clean; this verifier
wrote no product file, made no commit, touched no main-tree source) · ports 4252 base / 4253 cured
/ 4259 the rig's own, all killed at the end.

**VERDICT: REPAIR.** Both findings the author set out to answer are answered, and I reproduced
both on my own interleaved windows: the drawer's first close is back inside the base arm's spread
(its cured median is now *below* base), and the guard makes an installed 0.12.0 a silent no-op with
two units on it. The mark itself re-reads at **−1,108.1 ms** with **N1 bakes 8 → 0 in 5 of 5**,
outside both arms' spreads, and π holds on an instrument I ran myself. Two things keep it from
landing at the fold, and both are the chair's to close, not the author's to code:
**GATE A still reds on the cured arm (2 of 2 runs, against 2 of 2 green base runs)**, and
**the branch's lockfile still cannot supply the library the measured arm was built from**.

---

## 1 · THE DIFF IS THE MECHANISM, ROUND 3 INCLUDED

`git diff aa2573a6..feccbb04` — one product file and one new unit file, 95 insertions:
`QUIET_MS = 1500` + `lastGestureAt` (`rasterPose.ts:362, 425, 430, 547`), `prewarmerOf` +
the whole-composable disarm (`:506, :516-525`), and `rasterPose.test.ts` (40 lines, two units).
No template, no style, no config, no spec, no golden, no gate.

Across the whole cure (`854b562b..feccbb04`, 4 files) it is **pre-warming**, which M09 names
lawful, and it **draws no less**: no bake dropped (16 boot encodes in both arms; the cured arm
adds 6 at idle), no boil thinned (`pencilConfig.ts` not in the diff, `BOIL_CONFIG.frameCount` 4,
pose count 4 in every π round), no filter removed (`filterBudget.ts` untouched, `FILTER_BUDGET`
9, `filter-census` green both engines), no transition shortened (the whirl gains 93 frames),
no DPR lowered (`gridDpr()` is the same `Math.min(devicePixelRatio, Apple ? 2 : Infinity)`,
moved verbatim), no `cacheKey` theme-stripped (`d`/`l` still in both keys). Nothing from the
REFUSED list is re-proposed by name; the REFUTED `prewarm()` row is `GameShell.vue`'s solver
warm, a different function. COPY LAW: no user-readable string added, `lint:copy` exit 0.
No new spec, so no `// PRM:` obligation; `lint:motion` exit 0 anyway.

## 2 · THE ARMS

```
base  : index-DOFGihfY7ZtC.js · index.html md5 7241f47bba33881658ad9e63061fa9e3 · 43 files / 807.4 KB
cured : index-JTBBcqICsyPr.js · index.html md5 af0d5ba680da72c8dacff24bfe7bdbd2 · 43 files / 811.3 KB
```

Both match the author's banked lines. I **rebuilt** the cured arm myself from the committed HEAD
(`npm run build`, exit 0) and it reproduces the same entry hash, so the served dist IS `feccbb04`.
The served bytes were checked from the servers, not from disk: `curl` on :4252 returns the base
entry and on :4253 the cured one, printed at both ends of the reading set. `dist-base` is genuinely
pre-cure (no `99999px` probe box in its entry; the cured entry has one). The worktree's
`node_modules/@mkbabb/pencil-boil` is a real directory at **0.12.1** (`dist/vue.js` md5
`aa27f230ef7f7dce4ddbb594ae00fe7f`); the main tree's copy is untouched at 0.12.0 — nothing was
written through a symlink.

## 3 · THE MARK, RE-READ BY ME (5 + 5, interleaved b,c,b,c…) — `stats-desk.txt`

`instr/toggle-probe.mjs`, `diff -q` SAME against `attribution/A5/`. A5's flag names are
`--throttle` / `--viewport` (the author's first round-3 attempt passed `--cpu` / `--vp`, ran
unthrottled, and discarded those windows by name in `fix-r3/battery-b.sh` — I used A5's own names
and the raws stamp `throttle 4x · viewport desk · dpr 2 · cold(CDP cache disabled)`).
**chromium · 4× CPU · Fast-3G · cold · desk 1280×800 · dpr 2 · boot light.**
Load `{8.16 7.41 8.94}` → `{7.24 7.14 8.64}`, 0 tainted of 10.

| quantity | base median | base spread | cured median | cured spread | Δ | outside both |
|---|---|---|---|---|---|---|
| **deltaMs** (N1 − median N2..N4) | **1132.8** | 1005.1–1176.7 | **24.7** | 19.5–233.7 | **−1108.1** | **YES** |
| n1SettleMs | 1258.9 | 1203.0–1284.6 | 127.7 | 123.4–335.2 | −1131.2 | YES |
| **n1Bakes** | **8** | 8–8 | **0** | 0–0 | **−8** | **YES** (0 in 5 of 5) |
| n1WhirlFrames | 2 | 0–6 | 95 | 92–96 | +93 | YES |
| n1WhirlWorstMs | 207.2 | 200.7–208.4 | 75.0 | 68.0–75.2 | −132.2 | YES |
| n1RecalcMs (row G8) | 84.2 | 82.9–92.7 | 277.3 | 252.1–283.4 | +193.1 | YES — §6 |
| boardReadyMs | 1391.5 | 1368.8–1418.5 | 1393.1 | 1376.5–1407.3 | +1.6 | no |
| bootBakes (≤ ready + 2.5 s) | 16 | 16–16 | 22 | 22–22 | +6 | YES — the warm |
| bootLongTaskMs (same window) | 1112 | 1100–1123 | 1540 | 1513–1745 | +428 | YES — the warm |

The cured median delta (24.7 ms) sits well under N2..N4's own settle (98.7–107.9), which is the
charter's accept shape. **None of the classic lies is present**: the arms are not swapped (the
8-bake arm serves the base entry hash), the regime is the charter's with dpr stamped by the
instrument, the cache is cold by CDP, and the cure is live on the path measured (+6 idle encodes,
0 bakes inside the gesture). The author's −1,112.8 reproduces at −1,108.1.

## 4 · THE REPAIRED FINDING — THE DRAWER, 6 + 6 WINDOWS — `stats-drawer.txt`

A4's `drawer-trace.mjs`, `diff -q` SAME. **chromium 6× · mobile 390×844 · dpr 1 (A4 sets no scale
factor) · cold · 6 windows × 3 cycles per arm, interleaved, 0 tainted**, load 8.10 → 6.74.

| arm | FIRST open | long33 | long50 | **FIRST close** | steady open | steady close |
|---|---|---|---|---|---|---|
| base | 53.6 [42.9–58.6] | 1×6 | 1,1,1,1,0,1 | **17.8 [16.7–18.5]** | 24.6 [16.3–33.0] | 15.9 [10.3–17.8] |
| cured | 49.5 [40.1–51.6] | 1×6 | 0,0,0,0,1,1 | **17.0 [15.3–25.4]** | 24.9 [16.1–34.8] | 16.9 [10.3–18.5] |

Round 2's ruled regression is **gone**: the first close's cured median is 0.8 ms *below* base and
the spreads overlap (round 2 read 17.4 → 25.4 disjoint). The first open reads better, with frames
over 50 ms in 2 of 6 cured windows against 4 of 6 base. **One residue, named**: cured *steady*
opens carry a frame over 33.4 ms in 3 of 12 cycles where base carries none (worst 34.8 vs 33.0) —
the honest tail of the author's own `warm-standdown` diagnostic (five poses still encode inside a
worked drawer, because this instrument's gap between cycles exceeds `QUIET_MS`). Medians overlap,
so it is not a move; `QUIET_MS` is the dial if the chair wants it at zero.

## 5 · π — I RAN IT MYSELF

**Goldens**: `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4253 npx playwright test --config
playwright-golden.config.ts` → **4 passed, exit 0**, no `--update-snapshots` (`goldens-cured.txt`).

**Per-pose digests** (`pi-c4x-desk.txt`), `instr/pose-hash-toggle.mjs`, 3 + 3 interleaved,
chromium 4× · Fast-3G · cold · desk dpr 2; `pi-compare.mjs` **exit 0 — "π HOLDS"**:
grid `[95f54de5 a885e347 e3829e30 6fe33241]`, logo `[71c256fa 46eda3c1 1f52e7c7 1f5350de]`,
toggle-sun `[e33f39a8 410e0d7f f9c59d63 0cb30b53]`, toggle-moon `[8e55ead1 03bc159d a0a567d0
030ed446]` — identical in both arms and identical to rounds 1 and 2. **Pose count 4** every round,
both arms. The raws carry the mechanism: the grid's second round bakes at t0 9,6xx ms in the base
arm (inside the gesture) and at **3,2xx ms** in the cured arm (at idle).

## 6 · G8, AS THE CHARTER ASKS

`n1Recalc` 84.2 → 277.3 ms. Not a cost the cure added: in the base arm N1's restyle is truncated
because the whirl never runs (2 frames of ~95). With the bakes gone N1 restyles as N2–N4 do.
G8's flip frame is the top item left on this surface.

## 7 · GATES, BARE, WITH EXIT CODES

| gate | exit | note |
|---|---|---|
| `npm run test:unit` | 0 | **Test Files 67 passed (67) · Tests 812 passed (812)** — the author's count |
| `lint:eslint` · `lint:knip` · `lint:motion` · `lint:copy` | 0,0,0,0 | |
| `lint:boundary` · `lint:tdz` · `lint:live-regions` | 0,0,0 | |
| `typecheck:node` · `typecheck:e2e` | 0,0 | |
| goldens vs :4253 | 0 | 4 passed, no `--update-snapshots` |
| surface specs vs :4253, BOTH engines, scratch config | 0 | **72 passed** — theme-bake-freshness, filter-census, wordmark-integrity, theme-quadrants |
| `perf-rig/ci-subset.mjs --dist dist-base` ×2 | 0,0 | GREEN both runs |
| `perf-rig/ci-subset.mjs --dist dist` ×2 | **1,1** | GATE A WebKit — §8 |

Scratch config `playwright-verify.config.ts`: the estate's default with `webServer` dropped and
`baseURL` on :4253, both engines, retries 0. Never :3000.

## 8 · WHAT STILL DOES NOT CLOSE

1. **GATE A, reproduced.** `perf-rig/ci-subset.mjs` unmodified, port 4259, interleaved
   cured/base/cured/base, unthrottled, desk 1440×900 dpr 1, every control window long33 0:
   WebKit median long33 **1 / 1** on cured (window worsts 35–37 ms) against **0 / 0** on base
   (worsts 18–33 ms) — **FAIL, FAIL vs PASS, PASS**, exits 1,1 vs 0,0. chromium reads 0 on both
   arms in all four runs. GATE B, C and D PASS on both arms every run (GATE D — the clause the
   charter names — chromium boot TBT 211–227 cured vs 201–221 base against a 1,750 ms ceiling).
   This is the cure's own idle encode inside a census whose allowance is zero; the author's
   placement arithmetic (`rasterPose.ts:413`) checks out against the rig's own window
   (`[boardReady+1450, boardReady+4470]`) and A5's tap at `boardReady + 3.8 s`. **It is a trade,
   and the trade is the chair's**: amend the census to admit a bounded one-time warm, or this
   family closes.
2. **The lockfile still cannot supply `prewarm`.** `web/frontend/package.json:71` asks
   `"@mkbabb/pencil-boil": "^0.12.0"` and `package-lock.json:1759-1762` resolves the published
   0.12.0, which has no `prewarm`; neither file is in the cure's diff. Round 3's guard
   (`rasterPose.ts:506`) correctly turns that into a **silent no-op** instead of an unhandled
   rejection — I confirmed the two units pass — but a no-op is a cure whose number does not move.
   As committed, **the branch does not build to the arm I measured** anywhere but this host, where
   a locally packed 0.12.1 sits in `node_modules`. Publishing 0.12.1 and re-locking is the chair's
   act at the seal; until it happens the mark in §3 belongs to this machine only.

## 9 · FILES

`VERIFY.md` (this) · `stats-desk.txt` · `stats-drawer.txt` · `pi-c4x-desk.txt` ·
`goldens-cured.txt` · `gate-*.txt` · `rig-summary.txt` · `rig-battery.{sh,log}` ·
`battery.{sh,log}` · `gates.sh` · `playwright-verify.config.ts`. Raw JSONL and the four full rig
transcripts were pruned after their figures were transcribed, to hold this directory under the
wave's text cap.

`sysctl -n vm.loadavg`: `{3.48 7.72 9.72}` at open, `{11.30 8.85 9.15}` at close; each set stamps
its own ends (drawer `{8.10 7.45 9.27}` → `{6.74 7.18 8.96}`; toggle `{8.16 7.41 8.94}` →
`{7.24 7.14 8.64}`; rig runs in `rig-summary.txt`). Up to ten sibling lanes shared this host and
every claim is read against the arms' own spreads because of it. Every number here is chromium or
Playwright WebKit. **A WebKit number is not a Safari number and no iOS claim** — the device closes
each budget through 8.3.
