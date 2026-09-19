# C07b verify r1 — the non-author's reading

2026-09-18 · track `bake` · worktree `.claude/worktrees/w8-bake`, branch `w8/bake` ·
preSha `66e34b23` · cure commit `e694cc8c` · charter `../../charters/C07.md` ·
law `../../charters/README.md`. I did not write the cure; I read, built nothing, served,
measured and ruled. No product file, no commit.

**Verdict: ACCEPT**, with two corrections to the author's prose and the charter's own
`Accept` clause recorded as unmet-and-refuted (§5).

## 1. Identity and load, both ends

    dist-base  index-LjRNU9f7iIUb.js · index.html md5 b4865f796519e83934879968e3fbd4f0 · 43 files / 811.3 KB
    dist       index-DT3aGxCK2_YJ.js · index.html md5 71db526c330253b274d0895282c9134e · 43 files / 811.6 KB

Both match the author's report exactly and both were unmoved at the close. The bytes the
servers hand out match the dists: `curl :4252 | md5` = b4865f79…, `curl :4253 | md5` =
71db526c…. The cure is IN dist and ABSENT from dist-base — `fonts.ready` appears once in the
cured entry chunk, inside `Ch(){return Sl??(Sl=wh().then(mh))}`, and zero times in the base
entry chunk. The arms are not swapped and the cure is not masked on the measured path.
`sysctl -n vm.loadavg`: 3.69 at the open, 9.25 at the close; per-set values are the
`LOADAVG-OPEN`/`LOADAVG-CLOSE` lines in `raw/MARKS.txt`.

Servers: `vite preview --outDir dist-base --port 4252` and `--outDir dist --port 4253` from
the worktree's `web/frontend`, both killed at the end.

## 2. The diff

One product file, `src/pencil/chrome/HandwrittenLogo/HandwrittenLogo.vue`, +51/−1, one
expression of behaviour: `bakeFace()` resolves `afterFirstPaint()` (`document.fonts.ready`,
then one `requestIdleCallback` slot with a 1,000 ms timeout, or a 200 ms timer where rIC is
absent) before `loadBakeFace()`. Nothing under `src/pencil/config/` was opened; no library
worktree; no spec, no golden, no motion file. The mechanism is DEFERRAL, which M09 names.
Nothing on the REFUSED list is touched: the bake is not deleted, no subset dropped or
narrowed, no `frameCount`, no `captureSide`, no `DEFAULT_POSE_CACHE`, no theme-stripped
`cacheKey`, no `toBlob` stub, no DPR change, no transition shortened.

The deferral rides a contract that already existed: `captureW` is 0 while `faceCss` is null
and pencil-boil declines to bake at a non-positive box, so the extra window is the SAME
during-bake state the file already had (`loadBakeFace`'s null path, T7-W6 note), not a new
branch.

## 3. The numbers I read myself

Instrument: the author's `instrument/boot-freight.mjs` — `diff` against the banked
`attribution/A2/boot-freight.mjs` is **exit 0, byte-identical**, as is
`webkit-font-confirm.mjs`. Windows interleaved b,c,b,c… by `interleave.sh`; medians and
ranges by `stats.py`; nothing excluded in any set (`readyOk` true, `tainted` false in 44/44
windows).

### 3a. chromium · 4× CPU · Fast-3G · true first visit (cache ENABLED, fresh context) · 1280×800 · dpr 1 · 12 + 12

`raw/MARKS.txt`, `raw/STATS.txt`; load 3.63 → 4.14.

| mark | base | cured | Δ | reading |
|---|---|---|---|---|
| TBT (Σ longtask − 50) | **155.5 ms** (141–185) | **136.0 ms** (129–172) | **−19.5 ms** | a MOVE — cured lower in **12 of 12 interleaved pairs** (sign test p ≈ 2e−4); ranges OVERLAP |
| board-ready | 1,400.7 ms (1,374.6–1,420.5) | 1,379.8 ms (1,361.7–1,408.2) | −20.8 ms | NOT a move (overlap), as the author reported |
| woff2 GETs before ready | 4.0 | 3.0 | −1 | categorical, 12/12 |
| woff2 bytes before ready | 23,772 B | 23,472 B | −300 B | categorical, 12/12 |

The categorical row reproduces window for window: in base a fourth woff2 entry with
`initiatorType: "fetch"` starts at **1,172.8–1,191.9 ms**, ~200 ms before board-ready, in
12 of 12; in cured there is no such entry in the boot window, 12 of 12.

### 3b. chromium · 4× · unthrottled · cache DISABLED · dpr 1 · 5 + 5

`raw/MARKS.txt`, load 6.32 → 6.22.

| mark | base | cured | Δ | reading |
|---|---|---|---|---|
| **woff2 wire bytes before ready** | **38,408 B** (38,408–38,408) | **23,472 B** (23,472–23,472) | **−14,936 B** | disjoint 5/5 |
| woff2 GETs before ready | 4.0 | 3.0 | −1 | disjoint 5/5 |
| board-ready | 320.0 ms (299.1–336.5) | 295.6 ms (284.2–320.1) | −24.4 ms | NOT a move (overlap) |
| TBT | 175.0 ms (157–189) | 153.0 ms (139–170) | −22.0 ms | direction agrees, ranges overlap |

### 3c. webkit · unthrottled, no CDP · cold · dpr 1 · 5 + 5

`raw/MARKS.txt`, load 6.22 → 6.20. Served by `vite preview`, so 7 GETs (C07a's
`Vary: Origin` artifact), not 4.

| mark | base | cured | Δ | reading |
|---|---|---|---|---|
| **woff2 wire bytes before ready** | **61,880 B** | **46,944 B** | **−14,936 B** | disjoint 5/5 |
| woff2 GETs before ready | 7.0 | 6.0 | −1 | disjoint 5/5 |
| board-ready | 174.0 ms (171–179) | 180.0 ms (172–189) | **+6.0 ms** | NOT a move; the author read +3.0 |
| TBT | **NOT MEASURED** — no CDP, no `longtask` in Playwright WebKit | | | |

A WebKit number is not a Safari number and none of this is an iOS claim.

## 4. π, and the gates I re-ran

- **Goldens 4/4 PASS, exit 0**, `playwright-golden.config.ts` with
  `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4253`, no `--update-snapshots` —
  `golden · logo wordmark (light)` among them.
- **Per-pose hashes, BOTH engines, 3 + 3 windows**, on C01's banked `pose-hash.mjs` +
  `pi-compare.mjs` (`pi-c-desk.txt`, `pi-w-desk.txt`): *π: HOLDS — every surface's shown
  stack is byte-identical, pose for pose*, exit 0 in both. The wordmark's digests equal the
  author's banked ones (chromium 151a026e 1d265c29 165aa06c 0c04acf5 / 71c256fa 46eda3c1
  1f52e7c7 1f5350de; webkit 03a52c87 6b316e0a e450d681 26145a0e / c73b8d61 ef815785
  25b39bb7 37f507da). Encode counts equal arm to arm, surface for surface (grid 8, logo 8,
  sun 4, moon 4). **Pose count 4** per round on every surface in both engines.
- **filterBudget 9** — `src/pencil/config/` has zero lines of diff since `66e34b23`, and
  `filter-census.spec.ts` is green in both engines against the cured dist.
- Gates, bare, in the worktree: `test:unit` **exit 0 — Test Files 66 passed (66), Tests 810
  passed (810)** · `lint:eslint` 0 · `lint:knip` 0 · `lint:motion` 0 · `lint:copy` 0 ·
  `lint:boundary` 0 · `lint:tdz` 0 · `typecheck:node` 0 · `test:font-coverage` **0**.
- **Surface battery, both engines, cured dist**, through the author's scratch config:
  `font-census wordmark-integrity filter-census theme-bake-freshness theme-quadrants
  masthead-alignment` — **88 passed, exit 0**, including "all five labels render every glyph
  in Fraunces — zero fallback glyphs".
- **The suite's three reds are a host fact, re-proven on the BASE arm**: `presence.spec.ts:177`
  fails in both engines against **:4252 (dist-base)** exactly as against :4253 — 2 failed,
  exit 1, both arms. The relay Worker is not running in this session.

## 5. The must-nots, and the charter's Accept

| must not | reading |
|---|---|
| drop or narrow a subset | `index.css` never opened; `test:font-coverage` exit 0; both arms load the same 3,924 / 14,936 / 4,612 B |
| delete the data-URI bake | it runs, later; every per-pose digest equal, encode counts equal |
| wordmark paints a fallback face longer than today | HOLDS. The live pose-0 stack paints `.logo-text { font-family: var(--font-display) }` — the page's own Fraunces — and the page's `@font-face`/preload loads start at the SAME 169–186 ms in both arms in 12/12 windows. What is later is bitmaps-instead-of-live-filter: measured on WebKit, first logo encode t0 182–221 ms → 521–577 ms (+~340 ms); `wordmark-integrity`'s zero-fallback-glyph assertion is green |
| no bake dropped, boil thinned, filter removed, transition shortened | encode counts equal per surface per engine; `filter-census` green; no config or motion file opened |
| a golden may not move | 4/4, no `--update-snapshots` |

**The charter's `Accept` is met in one of three clauses.** "max requests per subset ≤ 1 in
both engines" is NOT met (unchanged: fraunces 2 on WebKit) and "WebKit board-ready down by
about 79 ms" is NOT met (+6.0 ms here). Both were refuted by the author with a mechanism —
WebKit keys the cache entry on the request's DESTINATION, so a `fetch` cannot consume a
`font` entry — and the 79 ms was already refuted in C07a as a one-armed-route bias. I did
not re-run the nine-shape lab; the refutation is the chair's to admit, not mine to certify,
and 8.3 closes B6 on the device. What this cure does move it moves for real.

## 6. Corrections the author owes his own prose

1. **"disjoint in 10 of 10 windows" for TBT overstates it.** At 12 + 12 the ranges overlap
   (base 141–185, cured 129–172). The move survives as a PAIRED result — cured lower in
   12 of 12 interleaved pairs — which is the stronger claim on a host carrying ten lanes.
   Say paired, not disjoint.
2. **The chromium half of the "what it costs" row does not reproduce.** The author read
   first logo encode t0 84–343 ms base → 343–375 ms cured; I read 96–352 base → 88–359
   cured, three windows each — noise at 1×, no clean shift. WebKit's +~340 ms does
   reproduce and is the honest statement of the cost.

## 7. Files

This dir holds ≤ 40 KiB of text, so the per-window `*.jsonl` and the gate logs were reduced
to the tables below after they were read; nothing here is rounded or re-derived by hand.

    instrument/interleave.sh, stats.py   the author's, unmodified (boot-freight.mjs was run
                                         from his dir and is byte-identical to
                                         ../../../attribution/A2/boot-freight.mjs — diff exit 0)
    raw/MARKS.txt      every window of all four reading sets, one line each: arm, rep, regime,
                       ready, TBT, woff2 count and bytes before ready, the link starts, the
                       bake fetch's own start and transferSize, tainted, readyOk
    raw/STATS.txt      stats.py's medians, ranges and disjointness for each set and the pool
    raw/GATES.txt      the gate exit codes, the unit counts, the goldens, the surface battery,
                       and the presence spec on BOTH arms
    raw/E2E-TAILS.txt  the tails of the three playwright runs
    pi-c-desk.txt, pi-w-desk.txt   the π verdicts, chromium and webkit, 3 + 3 windows each
