# R1 — Mobile perf profile (E8 mobile-recut, RESEARCH)

**Lane**: R1 (mobile-perf). **Charge**: at the SEALED HEAD, find what is still expensive at
**mobile geometry — DPR3, small viewport, phone-class CPU** — ranked, A/B-isolated. NO fix
lands here; research only, no source edits, no commits.

**The one-line answer.** W1 (bake-once) is real at mobile too: **idle-after-bake, the murmur,
and the celebration are all cured at DPR3** on WebKit (93–98 fps, 0 jank) — the same cure the
desktop gate sealed. What still hurts at mobile is **the bake itself and its two live-filter
windows**: (1) the **cold-load fallback window** (the live grain-static filter runs at ~6 fps
until the bitmaps resolve — ~0.85 s on WebKit unthrottled, longer on a phone), (2) the
**theme-toggle / size-change re-bake** (a 250–456 ms mid-gesture hitch), and (3) the **DPR3
ImageBitmap residency** (~46 MB resident, half of it redundant) with its iOS tab-kill exposure.
**Glass/backdrop-filter is a null at this HEAD** (zero blurred surfaces). Capping the grid bake
at DPR2 on small screens is **measured visually lossless** (SSIM 0.984) and is the single
highest-leverage lever on all three.

---

## Method / provenance

The working tree is mid-W4 (the excision is mutating boards, cells, ControlPanels, solver
files), so **every number here is against the SEALED HEAD `7393e7df`** ("T4-W3: the PWA comes
out whole…") via a detached `git worktree` (removed after; `git stash` forbidden by charge).
`npm run build` of that HEAD built clean (`✓ built in 409ms`, vite 8.1.4, 171 modules), served
by a private `vite preview` on **`127.0.0.1:4153`** (415x band — owner's `:3000`/`:3001`
untouched; `:3001` LISTEN verified held throughout). pencil-boil is the file-linked **0.9.0**.

Driven by **Playwright 1.61.1**, `playwright.webkit` (Apple **webkit-2311** — the Safari
engine) and `playwright.chromium`, iPhone-class device profiles:

| profile | engine | viewport | DPR | throttle | notes |
|---|---|---|---|---|---|
| wk390 | webkit | 390×844 | 3 | — (webkit can't CPU-throttle — stated per row) | iPhone 13/14-class |
| cr390 | chromium | 390×844 | 3 | 1× and **4×** (phone-class compute) | isMobile+hasTouch |
| wk430/cr430 | both | 430×932 | 3 | — | larger phone (14/15 Pro Max-class) |
| DPR2 arms | both | 390×844 | **2** | — | the cap-at-2 counterfactual |

**Load discipline (per the W1 precedent — the box never quiets).** loadavg held **7–26 the
whole session**; it is **stamped on every number**. Geometry/memory/byte figures are
load-insensitive. Every fps/CPU figure is an **A/B on ONE build** — `baked` (as shipped) vs
`forcelive` (CSS-injected: hide the bitmaps, un-hide the live grain-static stack) — so the
ratio is load-robust even when absolutes are not. CPU is macOS `ps pcpu` summed over each
engine's helper processes minus a pre-launch baseline (WebKit's real work runs in reparented
XPC processes; the pid-tree walk is by exec-path, the s1 method). Probe scripts (rerunnable):
`/private/tmp/.../scratchpad/{mobile-dom,mobile-perf,mobile-coldload,mobile-interact,mobile-solved,mobile-scroll,ssim-probe,memprobe}.mjs`.

**Architecture under test (HEAD).** Three surfaces bake via `useRasterStack` (pencil-boil
`vue.ts`): **grid** (`HandDrawnGrid`, 4 poses), **logo** (`HandwrittenLogo`, 4 poses),
**toggle** (`DarkModeToggle`, sun 4 + moon 4 = 8 poses). Each pose: a self-contained SVG →
`<img>` → canvas → `createImageBitmap` (`raster.ts`) → **held in `bitmaps` ref**, then
`bitmapsToUrls` re-draws it to a second canvas → `toDataURL('image/png')` → the data URL backs
a static `<image>`/`<img>` opacity-swapped on the 150 ms beat. **The bake captures at
`cssSize × window.devicePixelRatio` with NO DPR cap** (`raster.ts` `currentDpr()`, `vue.ts`
`bake()`), so device-px area scales with `dpr²`. Bitmaps memoize in the shared module-level
**`BOIL_CACHE` LRU, cap 24 entries total** (`frames.ts`), keyed `(cacheKey,'raster',pose,dpr,w,h)`
— grid/logo/toggle rasters share that cap with the path-frame arrays.

---

## Ranked mechanism table

| # | mechanism | engine | cost @ mobile geometry | A/B proof | conf | fix direction |
|---|---|---|---|---|---|---|
| **1** | **Cold-load fallback window** — until the 4 grid bitmaps resolve, `showBaked=false` and the live `grain-static` stack renders; on WebKit that's the full feTurbulence+displacement re-raster | **WebKit** (Chromium's live filter is cheap; its window is bake-CPU only) | WebKit DPR3: bake **849 ms**, during which **6.1 fps**, rafP95 **469 ms**, 3 jank>100 (≈5.7 beats of the 631% re-raster). Chromium 4×: bake **1273 ms**, 6 tasks>100 ms up to **251 ms** | fallbackWindow **6.1 fps** vs bakedSteady **98 fps** (webkit DPR3, la 15.25). DPR2 arm: bake **987 ms** / worst task **181 ms** / 2 tasks>100 vs DPR3 **1273/251/6** (chromium 4×) | **High** | cap grid bake DPR→2 (−23% window, −⅔ long tasks); bake grid FIRST (logo+toggle compete); WebKit fallback = a **static frozen frame** not the live filter (PRM proves frozen grid = 60 fps); or bake off-main (OffscreenCanvas in a worker) |
| **2** | **DPR3 ImageBitmap residency + redundant retention + LRU accretion** — the `bitmaps` ImageBitmap set is **retained** after `bitmapsToUrls`, alongside the data-URL `<image>` decode (double residency); the cap-24 LRU never `.close()`s evicted bitmaps | both (renderer/GPU memory) | **390 DPR3: grid 19.08 MB (4×1092²), logo 2.48 MB (4×729×213), toggle 1.18 MB (8×192²) = 22.74 MB decoded ImageBitmap**, +1.33 MB base64, **+~22.7 MB `<image>` decode ≈ 46.8 MB resident**. 430 DPR3: grid **23.5 MB** (4×1212²) | measured decoded px + base64 bytes (`memprobe`, la 11); DPR2 counterfactual: grid **8.09 MB** (728²) — exactly **2.25×** less | **High** (arithmetic); tab-kill is real-device | `bitmap.close()` after `bitmapsToUrls` (frees ~22.7 MB redundant) or skip the round-trip via `createObjectURL(blob)` (one raster not two); cap grid DPR→2 (halves the rest); close on LRU eviction |
| **3** | **Theme-toggle / size-change re-bake stall** — the grid `cacheKey` folds `isDark` (and `boardSize`); flipping either re-bakes at DPR3, and during the null window the WebKit live-filter fallback re-rasters **mid-gesture** + a main-thread `toDataURL` burst of the new 1092² PNGs | WebKit worst; both | toggle: WebKit max frame gap **456 ms** (1 jank>250); Chromium 4× max **249.9 ms**, 4 jank>100, re-bake confirmed. Size 4→16 re-bakes larger | rebakeOccurred=**true** both; randomize (no geometry/theme change) = **98 fps, 0 jank, no re-bake** — isolates the re-bake as the cost (la 7.9) | **High** (max-gap is the true measure; per-frame bitmap sampling undercounts because rAF stalls inside the blocked frame) | keep both themes' bitmaps warm (pre-bake the off-theme); cap DPR; WebKit re-bake fallback = frozen frame not live filter; the Bloom already masks it visually — make it cheap underneath |
| **4** | **Bake main-thread burst (`toDataURL`)** — 12 synchronous PNG encodes (grid 4 + logo 4 + toggle 8) on cold load; PNG-encoding a 1092² image is the hot task | both (main thread) | Chromium DPR3 4×: **6 long tasks, worst 251 ms**; the W1 gate's QUALIFIED "mount bursts 355 ms @4×" reproduced at mobile as the 251 ms class | DPR2 4×: worst **181 ms**, 2 tasks>100 vs DPR3 **251 ms**, 6 tasks (same run family) | **High** | `OffscreenCanvas.convertToBlob` (async, off-main) instead of `toDataURL`; or bake in a Worker; cap DPR shrinks each encode 2.25× |

### Measured NULLS — cured or absent at the sealed HEAD (do not re-open without cause)

| surface | verdict | evidence (la stamped) |
|---|---|---|
| **Idle after bake** | **CURED at DPR3** | WebKit baked **93.5 fps / 22.7% pcpu / 0 jank** vs forcelive **22.5 fps / 631% / 49 jank** (la 26.4→22.6). Chromium flat **120 fps** both arms. The bake holds at DPR3. |
| **Murmur + celebration (solved)** | **CURED at DPR3** | WebKit celebration **97.6 fps**, steady murmur **96.7 fps**, **0 jank**, 35% pcpu; Chromium flat 120 (la 7.3). The s1 "solved crashes WebKit" was the pre-bake case; baked is fine. |
| **Glass / backdrop-filter** | **NULL — none exists** | `backdropFilterSurfaces: []` and `blurFilterSurfaces: []` on BOTH engines at 390/430 DPR3 (`getComputedStyle` over every element). The dist `backdrop-filter` token is Tailwind's `.transition` property-list; `blur(8px)` is an unused `--tw-blur` util; AttributionCard removed its `blur(12px)`. The drawer is `display:none` <1024 (desktop-only). **W10 "glass tokens" is a FUTURE risk to profile, not a current cost.** |
| **Scroll / viewport** | **clean** | WebKit **98.2 fps**, Chromium **120 fps** through an 8-step wheel sweep, **0 jank>100** (la 13). Page scrollH 891 vs 844 (47 px overflow), hOverflow 0. Minor: `overscroll-behavior:auto` (rubber-band uncontained); fixed dark-toggle carries `will-change:transform` (one persistent compositing layer, negligible). |

---

## The cap-at-2 verdict (load-bearing for #1/#2/#4)

**Test.** Both arms captured at a **DPR3 screen** (identical screenshot geometry — no
capture-rounding confound), digit glyphs hidden (separate overlays, not the grid bake). The
capped arm overrides `window.devicePixelRatio→2` *before mount* so ONLY the grid bake
resolution differs (728 vs 1092 px); the DPR3 compositor then bilinearly upscales the 728
bitmap on display — exactly the cap-at-2-on-a-DPR3-phone case. Pose frozen via reduced-motion.
Grayscale windowed SSIM (Wang 8×8, stride 4).

**Result (390×844, la 11.15):** **SSIM 0.984**, mean abs Δ **1.49/255 (0.58%)**, max abs Δ 170
(localized to displacement-edge pixels — the 1-px line-edge softening from the 1.5× upscale).
**0.984 clears the 0.98 identity floor W1 itself ratified.** Crops (`r1-crops/`, 44 KB total,
policy-clean): `grid-dpr3-native.png` vs `grid-dpr2-capped.png` — visually near-identical
hand-drawn character; the capped grain tooth is marginally softer, imperceptible at phone
viewing distance.

> **Caveat for the implement wave.** SSIM was run on the **grid** (19 MB — the whole memory/
> cold-load story) and passes. **Logo (2.48 MB) and toggle (1.18 MB) were NOT SSIM-tested**;
> the logo is **Fraunces text**, where sub-pixel sharpness reads more than on hand-drawn grain
> — recommend capping the **grid only**, leaving logo/toggle at native DPR (their memory win is
> minor), or SSIM the logo separately before capping it. An earlier naive SSIM read 0.889 — that
> compared two *different random puzzles* at *mismatched capture geometry*; it is discarded. The
> clean isolated number is **0.984**.

---

## UNMEASURABLE-HERE — real-device probes for the implement wave

Emulation reproduces the engine's raster/compositor logic but **not** the phone's memory
ceiling, GPU, refresh cap, or thermals. Each below is marked with the probe to run on a real
iPhone (Safari + Web Inspector, ssh-attached or Timeline recording):

1. **iOS jetsam / tab-kill at N MB residency** — no memory ceiling in headless. **Probe:** real
   iPhone, cold load → switch all 3 sizes → flip theme 5× (exercises the cap-24 LRU churn),
   watch for a tab reload (white re-flash); Web Inspector → Memory Timeline (JS heap + page +
   layer memory) or `os_proc_available_memory`. Threshold to watch: the measured ~46 MB × cache
   accretion, worst on a 3 GB-class iPhone SE/mini.
2. **Real GPU cost of the live filter during the bake/re-bake window (#1, #3)** — headless
   WebKit-GPU is a proxy; real A-series/M-series raster differs. **Probe:** real device, Safari
   Web Inspector Timeline, cold load + one theme toggle, sample the "feels awful" first seconds.
3. **Low Power Mode 30 Hz rAF cap** — headless runs uncapped. In LPM the bake window's 6 fps and
   the re-bake hitch are more visible (30 Hz budget). **Probe:** Settings→Battery→Low Power,
   cold load + toggle.
4. **ProMotion 120 Hz** — a 120 Hz iPhone makes any frame dropped during the bake/re-bake window
   more perceptible (8.3 ms budget). **Probe:** real ProMotion device (13 Pro+), same flows.
5. **iOS data-URL image-decode accounting** — Safari may retain both encoded (base64) and
   decoded rasters for a `data:` `<image>`, worsening #2 beyond the arithmetic. **Probe:** Web
   Inspector memory, diff resident before/after the 4 grid `<image>` mount.
6. **Thermal throttling on sustained play** — emulation is isothermal. **Probe:** real device,
   repeated solves/celebrations, watch for frame-rate decay over minutes.
7. **Tap-highlight / long-press callout / sticky-`:hover` on touch** — not perf; cross-ref R2's
   census (`r2-mobile-census.md` §4). Named here only so the recut doesn't double-count them.

---

## Net for the recut (research verdict, not a fix)

1. **W1 holds at mobile.** Idle, murmur, celebration, scroll are all cured/clean at DPR3 — the
   owner's "still awful" is **not** steady-state on the sealed HEAD (and production at his test
   time was the PRE-W1 build, so part of the complaint is that lag).
2. **The residual mobile pain is the bake's live-filter windows** — cold load (#1), re-bake on
   toggle/size (#3), and the main-thread encode burst (#4) — all worse at DPR3 and on a slow/
   ProMotion/LPM phone, plus the **DPR3 memory footprint** (#2) and its tab-kill exposure.
3. **One lever moves all four: cap the grid bake at DPR 2 on small screens** — proven **visually
   lossless (SSIM 0.984)**, halving grid memory (19→8 MB) and cutting the cold-load window ~23%
   with ⅔ fewer long tasks. Pair it with **releasing the redundant ImageBitmap** (`close()` /
   `createObjectURL`) and a **static (non-live-filter) WebKit fallback during bake/re-bake**.
4. **Glass is not a cost today** — but flag W10's incoming glass tokens as the next WebKit-GPU
   risk to profile before it ships.
