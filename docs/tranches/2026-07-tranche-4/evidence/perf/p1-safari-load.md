# p1-safari-load — frontend in Safari and under load

**Lane key:** p1-safari-load · **Tranche IV pre-execution perf-audit** · first-party only.
**Tree:** HEAD `731ebf49` (T4 ratification). Verified `git diff --stat 65425697 HEAD` touches
docs only — the runtime tree at HEAD is **byte-identical to the W13 ship**, so these numbers
re-anchor the exact surface W1 will patch.
**Rig:** fresh `npm run build` dist (lean wasm 86,746 B linked), served by a private
`vite preview --port 4501 --strictPort` (owner's :3001 untouched, verified still owner-held).
playwright chromium-1228 + webkit-2311 (Apple WebKit), **DPR2 / 1440×900**. Node 26, npm 11.12.
Every recipe rerunnable in this dir (`lib.mjs` + the named probes); `PROBE_URL` overridable.

CPU method note (binding): `top` **times out (spawnSync ETIMEDOUT)** on the saturated WebKit GPU
process — reproduced 3×. The trustworthy measure is the **accounting-accurate cputime-delta**
(`ps -o time` twice, ∆CPU-seconds / wallclock × 100 = average cores), which cannot inflate. On
every surface ps `pcpu` and cputime-delta AGREE, so the crit-safari "ps pcpu ≈3× inflates →
208% top-interval ≈ 2 cores" correction does **not** hold for the playwright-webkit surface.

---

## (a) Safari baseline refresh at HEAD — re-anchored

### playwright-webkit, DPR2 (`webkit-baseline.mjs`, `cpu-crossmethod.mjs`)

| arm | fps | p50 ms | max ms | jank>100 | GPU pcpu % | GPU cputime-Δ % | WC % |
|---|--:|--:|--:|--:|--:|--:|--:|
| idle unsolved (9×9) | **10.3** | 129 | 154 | 42 | 599.8 | **623–647** | 1.5 |
| idle unsolved (16×16) | **3.7** | — | 288 | — | ~510 | **509–516** | — |
| idle solved (isolated) | — | — | — | — | 464 | **514** | 4.9 |
| gesture: toggle (Bloom ×5) | 6.2 | 147 | 350 | 18 | 641 | — | 12 |
| gesture: drawer glide ×4 | 6.4 | 151 | 382 | 23 | 613 | — | 2.4 |
| gesture: K-hold peek | **78–86** | 10 | 332 | 3 | **28–40** | — | 5.1 |

- **The s1 signature reproduces exactly at HEAD**: idle GPU process pinned at ~6 cores, main
  thread idle (WC 1.5–5%), single-digit fps. K-peek (board glides under the laminate, grid boil
  off the critical raster path) is the bright arm — 78–86 fps, GPU collapses to ~30–40% — the
  same tell that the **grid grain-hoist is the entire cost**.
- **idle-solved stays GPU-pinned** (~514% cputime-Δ, the four `.boil-frame-layer` siblings still
  opacity-flipping with `grain-static` live over 81 filled cells). Solved is **not** better than
  unsolved (aligns with s1; corrects an order-contamination artifact where preceding gesture spam
  left one measurement reading 96 fps — non-reproducible in isolation).
- **16×16 idles WORSE than 9×9** (3.7 vs 10.3 fps) — larger filtered board area, more per-beat
  GPU raster. The 16×16 grid is the single largest resident bake win for W1.

### Real Safari 26 (`safari-real.mjs`, the s1 recipe: `open -a Safari`, sample system WebKit XPC)

| | GPU pcpu % | GPU cputime-Δ % | WC % |
|---|--:|--:|--:|
| before opening tab | 0.3 | — | 0 |
| **Safari settled idle 8s** | **168.5** | **175.1** (8.8 cpu-s / 5.0s wall) | 3.7 |

Real Safari idle = **~1.75 cores** on the GPU process, main thread idle — confirms s1's ~194%
real-Safari figure. Tab auto-closed after via AppleScript.

### The re-anchor W1 must gate against (the deliverable of part a)

W1's `webkit-cpu` gate reads *"baseline idle ≈ 208% (top-interval) / 194% (real Safari) ≈ 2 cores
today."* First-party finding: **the "208% top-interval" is unsourceable to the playwright-webkit
surface** — `top` cannot sample the saturated process (it times out), and both pcpu and the
accounting-accurate cputime-delta put playwright-webkit idle at **~600–647% ≈ 6.5 cores**, not 2.
Real Safari is a *separate* surface at ~175% ≈ 1.75 cores. W1 should re-anchor its CPU gate as
two numbers — playwright-webkit against cputime-delta (~640% → single-digit-cores), real Safari
against pcpu/cputime (~175% → ~0) — and **drop "208% top-interval"** (a tool artifact). The fix
(bitmap-pose-cache) is unchanged; only the gate's anchor number is corrected.

---

## (b) Under load — both engines

### Chromium, CDP `Emulation.setCPUThrottlingRate` (`chromium-load.mjs`), DPR2

fps / RasterTask-per-s per surface at 1×, 4×, 6×:

| surface | 1× fps (raster/s) | 4× fps (raster/s) | 6× fps (raster/s) | bound |
|---|---|---|---|---|
| idle | 118 (8) | 120 (8) | 118 (8) | **immune** |
| toggle (Bloom) | 68 (1887) | 53 (1199) | **41 (1033)** | **raster** (0 long-task, 0 jank) |
| drawer glide | 74 (287) | 68 (312) | 72 (267) | light |
| K-peek | 118 (484) | 118 (38) | 113 (317) | cheap |
| solve burst | 104 (943) | 93 (911) | 59 (649) | raster; max-frame 133 ms @6× |

- **Chromium idle is bulletproof** (118–120 fps at every throttle; the 8 RasterTask/s residue is
  the grid grain-hoist flip — W1's `chromium-residue` target).
- **The toggle/Bloom degrades FIRST under CPU load** — 68→41 fps across 1×→6×, purely
  **raster-bound** (~1000–1900 RasterTask/s from the live warp-wrapped filtered SVG; zero long
  tasks, zero >100 ms frames). Solve burst is the second raster-heavy surface.

### The 16×16 deal — the heaviest surface (`deal16.mjs`)

Data path (read from source): `getRandomBoard` pulls a **bundled template** (`TEMPLATE_BANK`,
`data/templates.ts`) → worker hole-digs (`kind:'generate'`). Deal **DATA** is worker-bound and
cheap; the deal **RENDER** (256-cell hand-drawn SVG mount) is the cost.

| engine / throttle | t_values (worker) | render max-frame gap | deal-window fps | jank>250 |
|---|--:|--:|--:|--:|
| chromium 1× | 79–95 ms | 25–42 ms | 109–113 | 0 |
| chromium 4× | 211–236 ms | **100–117 ms** | 96–98 | 0 |
| webkit 1× | 358–1391 ms | **304–681 ms** | **2.6–4.4** | 9–16 |

- **The deal is render-bound, not worker-bound** (worker round-trip ~40–95 ms; the hitch is the
  256-cell mount). Cold vs warm is within noise on both engines — no worker-warmup cliff.
- Chromium 4× worst-frame **100–117 ms == the recorded G7/D7 "99–103 ms @4× worst-frame"** — this
  is the W8-mount idle-chunking cost, reproduced. On WebKit the same mount is a **~680 ms freeze**
  at 2.7 fps (unthrottled, on the already-saturated GPU).

### WebKit under synthetic host load (`webkit-hostload.mjs`; 18-core box)

Burner = N `nice -n <lvl> sh -c 'while :; do :; done'` shells (documented, killed after).

| arm | idle fps | GPU cputime-Δ % | 16×16 deal max-gap |
|---|--:|--:|--:|
| no load (16×16 board) | 3.7–3.8 | 509–516 | 318–327 ms |
| 4 burners @ nice 10 | 3.8 | 505 | 331 ms |
| 16 burners @ nice 0 | 3.4 | 509 | 336 ms |

- **Host CPU load barely moves WebKit** — even 16 competing nice-0 threads take idle only
  3.8→3.4 fps. The grid-boil pain is **GPU-process raster-*latency*-bound, not core-bound**:
  there are spare cores, so contention doesn't change the per-beat serial raster. This confirms
  W1's diagnosis under load — the bitmap cache attacks the correct bottleneck.

### Where does it degrade first, and is it main-thread / raster / worker?

- **WebKit**: already degraded at *idle* — **raster** (GPU-process feTurbulence re-raster on the
  8 Hz beat). Everything rides on the saturated GPU; the 16×16 deal (a main-thread mount that
  feeds a larger filtered area) is the worst single surface (~680 ms freeze). Host/main-thread
  load is nearly irrelevant.
- **Chromium**: idle immune; under CPU throttle the **toggle/Bloom degrades first — raster**
  (~1900 RasterTask/s), then the solve burst; the 16×16 deal adds a **main-thread** one-shot
  render hitch (~100 ms @4×). No worker-bound degradation anywhere (worker data is cheap).

---

## (c) Load-order truth — cold cache @ Slow-3G (`coldload.mjs`)

CDP `Network.emulateNetworkConditions` Slow-3G (400 kbps, 400 ms RTT) + `setCacheDisabled`.
Two arms: SW allowed vs SW blocked (`serviceWorkers:'block'` — the post-W3 precache-dead world).

| arm | first-paint | interactive (cells+ctrl) | first-boil | wall | transfer / reqs | SW controlling? |
|---|--:|--:|--:|--:|--:|:--:|
| SW allowed | 2752 ms | 4085 ms | 4791 ms | 4795 ms | 121.7 KB / 11 | **false** |
| SW blocked (precache dead) | 2712 ms | 4037 ms | 4783 ms | 4784 ms | 121.7 KB / 12 | **false** |

- **The two arms are identical** (within noise). On a first cold visit the service worker
  **does not control the navigation** (`swControlled:false` both) — the precache contributes
  **zero** to first-paint / interactive / first-boil. **W3's PWA abrogation does not regress
  cold-load**; the precache only ever mattered for warm-revisit/offline, which W3 owns.
- Cold-load timeline is lean and network-bound: FCP 2.75 s → interactive 4.0 s → first-boil
  4.8 s, 122 KB over 11 requests for first paint (wasm streams behind, not on the interactive
  path). Nothing new to fix here.

---

## Ranked dispositions

1. **[NEW-ROW] CPU gate re-anchor / measurement-truth.** playwright-webkit idle GPU ~600% pcpu
   = 623–647% cputime-Δ ≈ 6.5 cores (NOT 208%/2-cores); real Safari ~175% ≈ 1.75 cores; `top`
   times out on the saturated process (the likely origin of the bogus "208% top-interval"). ps
   pcpu ≈ cputime-Δ on both surfaces → the "3× inflation" correction is refuted for this surface.
   W1's `webkit-cpu` gate should anchor two numbers (playwright cputime-Δ + real-Safari pcpu) and
   drop "208% top-interval." Gain: the CPU gate stops being anchored to a ~3× low tool artifact.
2. **[FOLD-W1] 16×16 deal render hitch = the D7/W8 mount idle-chunking row.** chromium 4× worst
   frame 100–117 ms (== recorded 99–103 ms @4×); webkit 1× ~680 ms freeze / 2.7 fps. Render-bound
   (256-cell SVG mount), not worker-bound (worker data ~40–95 ms). New evidence for D7's
   fold-vs-retire call: it fires at **680 ms unthrottled on WebKit**, not only >100 ms @4× on a
   mid-device — that argues **FOLD** (spread the mount via the raster-stack bake), not retire.
3. **[FOLD-W1] WebKit grid-boil is raster-latency-bound, confirmed under load.** 16×16 idles at
   3.7 fps (worse than 9×9's 10 fps — larger filtered area = larger bake win); host load (4@nice10
   and 16@nice0) barely moves it (3.8→3.4 fps). The bottleneck is GPU-process raster latency, not
   cores — W1's bitmap-pose-cache attacks exactly this; the 16×16 board is the top bake priority.
4. **[REJECTED-quality] Toggle/Bloom degrades first under Chromium CPU load.** 68→53→41 fps at
   1×/4×/6×, raster-bound (~1900 RasterTask/s from the live warp-wrapped filtered SVG). W1 keeps
   the Bloom untouched (correctly ephemeral one-shot). The only lever — thinning/pre-rastering the
   live filtered warp — would move pixels / reduce the gesture's fidelity → REJECTED. One-shot;
   40 fps @6× (extreme throttle) is acceptable. Banked as a load-regime datum, not an action.
5. **[CLEAN] Cold-load is unaffected by the precache death (W3-confirming).** FCP 2.75 s →
   interactive 4.0 s → first-boil 4.8 s at Slow-3G, identical with/without the SW (SW never
   controls the first nav). W3's abrogation does not regress cold-load; 122 KB / 11 reqs first
   paint. No W1/W5 action.
6. **[FOLD-W1] Preload hygiene reconfirmed in the fresh dist.** Both `solver.worker` chunks
   (`Cy6Z_m2a` + `D4X3ZJVp`) modulepreloaded though only sudoku boots; wasm preloaded `as=fetch`.
   W1 owns the per-game-worker-only + single-wasm-fetch fix.
7. **[FOLD-W1] idle-solved stays GPU-pinned (~514% cputime-Δ, boil flipping).** Confirms the
   solved board is not a cheaper surface; the murmur's full-viewport damage on top is W1-owned
   (measured on Chromium by r1-perf as 4.8 Paints/s). No separate action.

## Banked probes (rerunnable)
```
# build + serve:  (cd web/frontend && npm run build && npx vite preview --port 4501 --strictPort)
node webkit-baseline.mjs               # (a) playwright-webkit idle+gestures+CPU
node cpu-crossmethod.mjs               # (a) ps vs cputime-Δ vs top; solved boil state
node safari-real.mjs                   # (a) real Safari.app CPU sample (opens+closes a tab)
node chromium-load.mjs                 # (b) CDP 1x/4x/6x, all surfaces, raster tally
node deal16.mjs <chromium|webkit> <rate>   # (b) 16x16 deal: t_values + render hitch
node webkit-hostload.mjs <burnN> <nice>    # (b) webkit under host CPU load
node coldload.mjs                      # (c) Slow-3G cold-load, SW allowed vs blocked
```
