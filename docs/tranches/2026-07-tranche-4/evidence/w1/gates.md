# T4-W1 gate lane — bake once, swap forever (measured close)

**Rig:** fresh `npm run build` of the W1 working tree (vite 8.1.4, 171 modules, `built in 435ms`),
served by a private `vite preview` on `127.0.0.1:4191` (owner's `:3000`/`:3001` untouched, verified
LISTEN pids 90825/41133 pre+post). Driven by `playwright.webkit` (Apple **webkit-2311** — the Safari
engine) and `playwright.chromium` at **DPR2 / 1440×900**. Recipes rebuilt from the s1/s2/s3/crit inline
command blocks, banked in `recipes/` (rerunnable). pencil-boil at `/Users/mkbabb/Programming/pencil-boil`
version **0.9.0**.

**Box was never quiet.** loadavg held **8–15 the whole session** (a bounded 8-min wait-for-quiet
monitor polled 24× and never saw <4 — the chronic state this tranche's own crit lanes ran under:
crit-safari 8–22, crit-perf-audit 9.7–26.5). Per that precedent every number is **loadavg-stamped**, and
the load-sensitive gates (webkit-cpu/fps) are measured as an **A/B on ONE build** — `baked` (as shipped:
bitmap `<image>` opacity-swap, no live filter) vs `forcelive` (CSS-injected: hide the bitmaps, un-hide the
`.boil-frame-layer` grain-static stack, re-arming the pre-W1 per-beat filter re-raster). The A/B ratio is
load-robust; absolute fps/CPU are not.

---

## Headline

| gate | RED baseline (banked) | measured (this lane) | verdict |
|---|---|---|---|
| **Headline** | WebKit grid idle ~194% real-Safari / ~640% headless proxy ≈ pain; 9.9 fps isolated; murmur 4.8 full-vp Paints/s; Chromium 8.0 RasterTask/s; **no identity harness exists** | WebKit A/B **19.5→98.1 fps**, **724%→15.9%** ps-pcpu; murmur expensive re-raster **eliminated** (grain dropped, real work 56×56/0.01ms) w/ a literal-record caveat; Chromium residue **≈0**; **proof:browser born + green** SSIM ≥0.98 both engines; e2e **47/47** | **PASS** (2 honest caveats: murmur literal-record, D7 @4× mount) |

## Component gates

| gate | RED baseline → target | measured (loadavg) | verdict |
|---|---|---|---|
| webkit-cpu | ~208% top / 194% real-Safari ≈ 2 cores (grid ~93%) → grid surface single-digit | forcelive **724.1%** → baked **15.9%** ps-pcpu (4 pids); grid's own ~708% removed, residual 15.9% is the page idle floor (crit floor 9.8–34.5%) — grid surface **≈0** (la 15.2/13.0) | **PASS** |
| webkit-fps | 9.9 isolated / 4.6 loaded → 60 | forcelive **19.5 fps** (rafP95 118ms, max 203ms, 57 jank>100ms — the 150–224ms board raster reproduced) → baked **98.1 fps** (rafP95 12ms, 0 jank) (la 12.99/15.23) | **PASS** |
| browser-proof | BORN RED — no harness today | `proof:browser` exists (playwright, chromium+**webkit**, DPR2), wired in `ci.yml` `browser-proof` job; untainted+repeatMatch+distinct+SSIM≥0.98; **4/4 green** | **PASS** |
| identity-floor | WebKit capture-vs-live 93.6%/maxΔ221 → ≥0.98 floor, per-engine, cross-engine gate DROPPED | Chromium **1.0000** (100% exact, maxΔ0) ×4 poses; WebKit **0.9876–0.9890** (~97.2% exact, maxΔ21) ×4 poses — all ≥0.98, WebKit sub-equality as designed; DELTA crops pixel-identical | **PASS** |
| chromium-residue | 8.0 RasterTask/s → 0 (N-layer variant; single-canvas leaves 8/s) | baked unsolved idle **0.08 RasterTask/s, 0 Paints** (settled) (la 10.30). *Caveat: headless composites the `will-change:opacity` flip for free, so forcelive also read ~0 — the 8/s baseline needs a tile-backed/headed chromium to contrast; baked ≈0 stands, WebKit A/B carries the mechanism* | **PASS** (w/ reproduction caveat) |
| murmur-damage | 4.8 full-vp (1440×900) Paints/s → 0, cell-box clipped | grain **drops on the wiggling cell** (82→81 filtered paths, dips match cadence) ✓; real per-wiggle work = **56×56 / 0.01ms** cell paint ✓ — the expensive full-vp grain re-raster (D3) is **gone**. BUT ~**2.8/s** of 1440×900 **#document root-layer** paint records persist at **0.069ms** each (near-free bookkeeping, NOT a re-raster); `contain:paint` does **not** remove them (nocontain A/B identical). (la 8.5–10) | **QUALIFIED** — disease cured, literal "0 records" not met |
| forked-reunify | gridPaths hand-rolls `pathSeed+f*997` vs library `seed+f*1013` (dual path) | `gridPaths.ts` calls **`boilLineFrames`** ×3 (447/534/557); interior loop reconciled to **`+f*1013`** (456). Residual `+f*997` (360/396) is the distinct rounded-corner primitive (arc branch dead at r=0), not a `boilLineFrames` fork. Grid renders correct (crops + e2e visual-regression) | **PASS** |
| preload | both workers modulepreloaded + wasm double-fetched w/ warning → active worker only, 1 wasm fetch, no warning | `dist/index.html` modulepreloads **only** `solver.worker-D41ArYEa` (futoshiki `BbC_Hzj5` excluded); cold load **1 wasm fetch** (`csp_solver_wasm_bg`, streaming); **0 console warnings** | **PASS** |
| proofs | npm test green; raster-serialize/hold pass; boilHoldGate proven; useBoilFrame alias dropped/fixed | `npm test` **green** (check + 7 proofs); `raster-serialize` 10 asserts (self-contained guard catches currentColor/var leak); `hold` 20 asserts (collapse-to-1/freeze/re-enrol); `useBoilFrame` alias **dropped** | **PASS** |
| release-flow | fictional changesets flow, `@changesets/cli` not a dep → deleted + honest tag-push flow; README Stage-3 retrued | `.changeset/` **deleted**; `@changesets` **not a dep**; CONTRIBUTING documents manual bump → `vX.Y.Z` tag → `release.yml` `npm publish`; CHANGELOG notes rig retired; README Stage-3 = **parked scheduler** (no continuous-rAF) | **PASS** |
| w8-chunk (D7) | fold (bake re-lands the chunking) OR retire-with-measurement (99–103ms @4×) | bake is **async** (completes ~700ms@1× / ~2s@4×, off the synchronous mount) ✓, chunked across ~6 tasks. Whole-app cold mount worst task **89ms @1× (0 >100ms)** but **355–366ms @4× (6 tasks >100ms)** — the mount **still bursts >100ms @4×** (≈4.0× the @1× task; grid geometry for the fallback is still synchronous, only the raster is async) (la 8.5–10.2) | **QUALIFIED** — async bake confirmed, mount burst NOT eliminated |
| D4 GPU-tile residue | verify superseded by N-layer bake | chromium-residue baked **≈0** → superseded | **PASS** |
| parity | full e2e green; non-grid surfaces unchanged; PRM frozen→60fps nothing hidden | e2e **47/47 green** (10.8s) incl. visual-regression light/dark filter swap + DOM contract, grid draw-in+boil, toggle warp, 4×4/9×9/16×16. Chromium A/B **flat 134 fps both arms** (no phantom Chrome win — crit kill confirmed). PRM: **frozen beat** (pose[0] over 2.5s), **98.1 fps**, grid 668×668 + logo visible | **PASS** |

---

## DELTA — perf before/after (A/B on one build, DPR2 1440×900)

**WebKit** (the target engine):

| arm | fps | rafP50 | rafP95 | rafMax | jank>100ms | ps-pcpu | loadavg |
|---|---|---|---|---|---|---|---|
| forcelive (grid live filter) | 19.5 | 11 | 118 | 203 | 57 | 724.1% | 12.99 |
| **baked (shipped)** | **98.1** | 10 | 12 | 15 | 0 | 15.9% | 15.23 |

The forcelive rafP95=118ms / max=203ms **is** crit-safari's "150–224ms serial board-area raster per beat"
reproduced first-party; baking collapses it. 724% ps-pcpu ≈ the sanctioned headless ~640% proxy (footnote
only; the citable device baseline is real-Safari ~175–194%, owner-verified). Baked 15.9% is the page floor.

**Chromium** (control — never had the pain):

| arm | fps | rafP95 | ps-pcpu | loadavg |
|---|---|---|---|---|
| forcelive | 134.1 | 9.2 | 15.7% | 9.26 |
| baked | 134.0 | 9.1 | 16.8% | 9.75 |

Flat both arms — confirms the architecture was never Chromium's problem and there is **no phantom
Chrome win** (crit kill #5 upheld). chromium-residue baked = **0.08 RasterTask/s**.

## DELTA — the murmur (solved board)

| metric | before (banked r1-perf) | after (measured, baked) |
|---|---|---|
| grain filter during wiggle | grainOn=true (grain re-executes) | **grainOn=false** — filter dropped on the cell (82→81 paths) |
| real per-wiggle paint | 1440×900 grain re-raster (~150–224ms class) | **56×56 cell paint, 0.069ms/0.01ms** |
| full-vp (1440×900) Paint records | 4.8/s | **2.8/s** — persist as 0.069ms #document root-layer bookkeeping (NOT re-rasters); `contain:paint` doesn't remove them |
| celebration | renders whole | renders whole (crest passes, then steady murmur) |

**Honest read:** the *expensive* full-viewport damage (the D3 disease — a grain filter re-executing over
the viewport per wiggle) is eliminated: the grain drops and the real work is a 0.01ms cell paint. But the
*literal* gate ("0 full-viewport paint records") is not met — Chromium still logs ~2.8/s of 1440×900
`#document` paint-list entries at 0.069ms each, and `contain:paint` (present, `getComputedStyle`=`paint`)
does **not** remove them (identical with/without). The suspect mechanism: `contain:paint` gives paint
*containment*, not a *compositing layer*, so the animated cell's invalidation still dirties the root
graphics layer, whose Paint record reports layer bounds (1440×900) — but at 0.069ms it is bookkeeping, not
the ~150ms re-raster the baseline logged. A clean literal-zero would need the cell promoted to its own
layer (will-change / transform), not just contained.

## π — identity SSIM (proof:browser, per-engine, DPR2)

| engine | pose 0 | 1 | 2 | 3 | exact | maxΔ | vs floor 0.98 |
|---|---|---|---|---|---|---|---|
| chromium | 1.0000 | 1.0000 | 1.0000 | 1.0000 | 100% | 0 | PASS (byte-identical) |
| **webkit** | 0.9889 | 0.9876 | 0.9890 | 0.9881 | ~97.2% | 21 | **PASS** (sub-equality, ≥floor) |

WebKit disclosure: ~2.8% of pixels differ (a ~1px displacement-edge misregistration between WebKit's
canvas-image filter path and its compositor path) — sub-visual, seen only at the one bake-completion swap.
An equality gate would false-red every WebKit pose; the 0.98 floor is why. Cross-engine parity gate DROPPED
(correct). π goldens: `crops/grid-{chromium,webkit}-{baked,forcelive}.png` — baked vs live-filter are
pixel-identical to the eye (the DELTA), ≤27 KB each, ~78 KB total (policy: ≤150 KB/image, ≤2 MB/wave).

---

## Verdict

**10 of 12 gates PASS clean; 2 qualified, reported honestly (not massaged):**

- **murmur-damage** — the disease (expensive full-vp grain re-raster) is cured (grain dropped, real work =
  0.01ms cell paint), but the literal "0 full-viewport paint records" is not met: ~2.8/s of 0.069ms
  root-layer bookkeeping records persist; `contain:paint` provides containment, not compositing, so it does
  not zero them. Needs cell-layer promotion for a literal zero.
- **w8-chunk (D7)** — the bake IS async off the synchronous mount (confirmed), but the whole-app cold mount
  still bursts **355ms @4×** (6 tasks >100ms); the fallback grid geometry stays synchronous. Does NOT
  cleanly fold on the <100ms@4× criterion; the 89ms@1× / 355ms@4× figures are banked as the
  do-not-reopen-without-a-grid-isolated-quiet-@4×-trace measurement. Recommend the team lead record as
  **retire-with-measurement**, not a clean fold.

Everything load-sensitive is A/B-controlled and loadavg-stamped; the box never quieted (8–15 throughout).
No main-repo commit made — team lead seals.
