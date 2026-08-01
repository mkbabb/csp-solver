# STALL ATTRIBUTION — the ~280ms WebKit drawer-open stall, owned · pass 3, 2026-07-31

**The owner is named, and it is not the hypothesis on file.** The drawer's board re-fit changes
`HandDrawnGrid`'s measured side, that re-keys `useRasterStack`'s `cssSize`, and the four-pose grid
stack **re-bakes** — 8 pose captures per gesture (4 grid + 4 wordmark). The bake blocks the main
thread for **188–233 ms on desktop Safari 26.4** and **458–479 ms on iPad Pro 13 / iOS 26**, and
**~85% of that is not the filter at all** — it is the `createImageBitmap` + PNG-encode round-trip
of a canvas that was already rastered in ~1 ms.

Pinning the two re-fits takes the gesture to **0 ms blocked, 26–36 ms worst gap, zero bakes**.
The control fires.

| lane row | disposition |
|---|---|
| stall attributed? | **YES — owner named at file:line, negative control fires** |
| hypothesis on file (FLIP forced layout + three-pass stroke filter) | **REFUTED, both halves** (2.5% and ~0.5% of the number) |
| fixed or designed? | **DESIGNED, not shipped** — no cure clears the charter's "≤20 LOC AND obviously safe" bar; §7 |
| commit | **none.** Tree untouched at `6800af04`; estate re-verified green on it (§8) |

---

## 1 · Rig — and what the unlocked session bought

The screen was **unlocked** all session (`ioreg` returns no `CGSSessionScreenIsLocked`), so the two
rows pass 2 could not run — real desktop Safari, and JS-level attribution inside the gesture —
both ran.

- **Desktop**: Safari **26.4** (`AppleWebKit/605.1.15`), window pinned **1280×900** (viewport
  1280×810), DPR 2, frontmost enforced. The drawer is a **≥1024-only** surface
  (`useControlsDrawer.ts` §6), so every cell is measured in the row regime.
- **`iPad Pro 13-inch (M4)` `751EA9FC…`** — 1032×1248, DPR 2, coarse, iOS 26.0. The device pass 2
  actually measured the stall on. Booted for its cells, shut down after.
- **`perf-rig-iphone16` `1B3EB33C…`** — 393×699, DPR 3. Booted as ordered, shut down after.
  **The drawer does not exist there**: the probe returns `{"err":"no drawer-tab","iw":393}` —
  the §6 regime rule, the same fact `measure/RESULTS.md` §0 recorded. Shot:
  `pass3/shots/stall-iphone16-no-drawer-regime.png`. The phone's cell is §6 instead, and it is
  the more useful one.
- **Build**: the CURRENT deployed-equivalent dist. `npm run build` at `6800af04` reproduces
  `index-CaReTGTNUG3O.js` byte-for-hash; snapshotted to `pass3/stall/dist-head`, served on
  **:4901** (`:4894`/`:4895` untouched, `:3001`/`:4288` untouched).
- **Instrument**: the rig's `evalQ` seam. `ev/s1-open.js` decomposes the gesture;
  `ev/s2-bake.js` adds the bake path (`drawImage`, `createImageBitmap`, `convertToBlob`,
  SVG-blob mints) timed per call; `ev/s3-bakeany.js` drives the same instrument off the theme
  toggle. Every cell lands the drawer CLOSED first, settles, then taps — the gesture under study
  is drawer-**open**.

**The dist matters to the finding.** Pass 2 measured `32198688` — *before* the P1-W3/W4 filter
purge. HEAD carries the purged population (`filterBudget.ts`: 9 rows, per-cell 0, HTML boxes 0).
The stall survives the purge **unchanged in class**. That alone retires "the three-pass stroke
filter" as the owner: the filters it named are gone and the number is still here.

---

## 2 · Reproduction, on the current dist

| cell | device | worst rAF gap | blocked in the first 600 ms | board re-fit |
|---|---|---:|---:|---|
| `s2-base-r1…r4` | desktop Safari 1280×810 | 200 / 183 / 188 / 109 ms | 200 / 226 / 188 / 233 ms | 666 → 650 px |
| `ip-base-r1,r2` | iPad Pro 13, 1032×1248 | 173 / 319 ms | **458 / 479 ms** | **736 → 672 px** |

Pass 2's number (274–284 ms, σ≈4, iPad) reproduces as the same event, read with a finer
instrument: on the iPad it is not one gap but **two** (173 ms at +69 ms, 150 ms at +242 ms) —
pass 2's single-worst-gap statistic saw the larger half.

The iPad is worse than the desktop **because its board moves further**. The `drawer-closed` grow
is `min(46rem,85vw)` against `min(42rem,85vw)`, capped by `100dvh−9rem` against `100dvh−10rem`
(`GameBoard.vue:845-858`): where the dvh cap binds, the delta is 1rem = **16 px** (desktop 1280×810);
where the rem arm binds, it is 4rem = **64 px** (iPad 1032×1248). Bigger re-fit, bigger bake.

---

## 3 · The decomposition — the hypothesis on file, refuted

`ev/s1-open.js` splits the gesture into (A) the synchronous click handler, (B) handler-return to
the first rAF, (C) everything after. `Element.prototype.getBoundingClientRect` is patched for the
window of the gesture, so every forced layout names itself with a stack.

| segment | desktop | share of the stall |
|---|---:|---:|
| **A** — the whole synchronous handler (both FLIP rect sweeps, the `drawer-closed` class write, the four WAAPI movers) | **3–5 ms** | **≤2.5%** |
| **B** — handler-return → first rAF (the UA's recalc + layout + commit for the new state) | **2 ms** | ~1% |
| **C** — the stall, arriving **39–69 ms after the click**, 2–3 frames later | 188–233 ms | ~97% |

Forced reads inside the handler: **one** above 0.4 ms — `DIV.board-peek-host`, **2 ms**, from the
glide's `lastH` read (`useControlsDrawer.ts:194`). Classic FLIP did exactly what its comment
claims: one layout step, at onset, cheap.

- **"FLIP forced layout" — refuted.** 3–5 ms of 200.
- **"three-pass stroke filter" — refuted as a *live* cost.** No live filter re-executes on this
  gesture; the census population is 9 and none of it is on the board. The filter chain *does* run
  — exactly four times, inside the bake, and `ctx.drawImage` of the filtered SVG-as-image totals
  **0–4 ms** across all eight captures. **The filter raster is not the expense.**

The stall is **async, off the handler, and behind a ResizeObserver**.

---

## 4 · The owner, named

```
GameBoard.vue:845-858        html.drawer-closed .board-shell.shell-{sm,md,lg}
                             — the drawer-closed grow: the board re-fits 16px (desktop) / 64px (iPad)
   ↓ (layout)
HandDrawnGrid.vue:150        const { width: hostW, height: hostH } = useElementSize(svgRef)   // ResizeObserver
HandDrawnGrid.vue:155-158    captureSide = Math.round(min(hostW,hostH) / 4) * 4               // 664 → 648  (desktop)
                                                                                              // 732 → 668  (iPad)
HandDrawnGrid.vue:184        cssSize: { width: captureSide, height: captureSide }
   ↓ (reactive opts watch — the bake trigger)
pencil-boil/src/vue.ts:556-562   watch(`${cacheKey}|${dpr}|${W}x${H}|${poseCount}`) → bake()
pencil-boil/src/vue.ts:527       4 × rasterizePose(poseSvg(p), cssSize, dpr)
   ↓ (per pose, ×4)
pencil-boil/src/raster.ts:174    ctx.drawImage(img, 0, 0, deviceW, deviceH)   ← the filter raster.  0–4 ms TOTAL
pencil-boil/src/raster.ts:175    return await createImageBitmap(canvas)       ← 79–82 ms desktop · 195 ms iPad
rasterPose.ts:90-94              new OffscreenCanvas + ctx.drawImage(bm)
rasterPose.ts:95                 return oc.convertToBlob({type:'image/png'})  ← 87–95 ms desktop · 112 ms iPad
rasterPose.ts:68                 URL.createObjectURL(blob)  → <image href>
```

Second trigger, same mechanism, on the same gesture: **`App.vue:536`** — `html.drawer-closed
.masthead { --logo-scale: 1.05 }` resizes the wordmark, so `HandwrittenLogo`'s raster stack
re-bakes too (4 more captures, 788×232 device px). It is the small half.

**Per-gesture bake cost, measured (sum over the 8 captures):**

| | `drawImage` (the filter) | `createImageBitmap` | `convertToBlob` (PNG) | total |
|---|---:|---:|---:|---:|
| desktop, 1320² grid + 792×234 logo | 0–2 ms | 79–82 ms | 87–95 ms | **~170 ms** |
| iPad, 1432² grid + 788×232 logo | 3–4 ms | 195–196 ms | 112–115 ms | **~310 ms** |

**~98% of the bake is the bitmap/PNG round-trip of an already-rastered canvas.** The three-pass
`grain-static` chain rasters in about a millisecond; the estate then spends 170–310 ms converting
that raster into a PNG object URL so an SVG `<image>` can hold it.

---

## 5 · The negative control — and it fires

Three ablations through the rig's `__ablate` seam. `p1` pins the board's size across the gesture,
`p2` pins the wordmark's, `p3` pins both. Nothing else changes; the gesture, the glide and the
layout swap all still run.

| cell | worst gap | blocked <600 ms | pose bakes | `createImageBitmap` | `convertToBlob` |
|---|---:|---:|---:|---:|---:|
| base (×4) | 109–200 ms | 188–233 ms | **8** | 79–82 ms | 87–95 ms |
| `p1` board pinned | **39 ms** | **0 ms** | 4 (logo only) | 13 ms | 14 ms |
| `p2` logo pinned | 162 ms | 162 ms | 4 (grid only) | 71 ms | 78 ms |
| `p3` both pinned (×3) | **26 / 36 / 36 ms** | **0 ms** | **0** | **0** | **0** |

Apportionment, two ways and they agree: **grid re-bake ≈ 150 ms** (200−39, or 162−33),
**wordmark re-bake ≈ 10–40 ms** (39−33, or 200−162), gesture floor ≈ **33 ms**.

On the iPad the same control: base 458/479 ms blocked, 8 bakes → **`p3` 260 ms blocked, 0 bakes**
(the 260 ms residual is the simulator's own renderer floor — its `p3` worst gap is 85 ms against
the desktop's 26). **−210 ms of blocked main thread, and every bake gone.**

The control can fail and does: `p2` leaves the grid bake in and keeps 162 ms; `p1` leaves the logo
bake in and keeps 4 captures. This is not a switch that turns everything off.

---

## 6 · It is not a drawer defect — it is a bake-pipeline cost the drawer triggers

`ev/s3-bakeany.js` runs the identical instrument on **`perf-rig-iphone16`**, driven by the
**theme toggle** — a different trigger into the same `useRasterStack` bake, on the regime the
owner's mobile mark names:

| iPhone 16, 393×699 DPR3 | worst gap | bakes | `createImageBitmap` | `convertToBlob` | `drawImage` |
|---|---:|---:|---:|---:|---:|
| one theme toggle | **147 ms** | 8 | 89 ms | 46 ms | **1 ms** |

135 of 147 ms is the same round-trip. Every re-bake trigger the estate has — theme flip, DPR
change, board-size swap, the drawer's re-fit, and the cold-load double bake (`captureSide` seeds
at 620 then re-bakes at the measured side) — pays it. **The drawer is one entrance to a general
cost, and pass 2 found it there because that is where it looked.**

---

## 7 · The fix — designed, and why nothing shipped

The charter's bar is "≤ ~20 LOC **and obviously safe**". Three candidates clear the first half.
None clears the second, and each names the gate that would earn it.

### Option A — latch the capture side (in-repo, ~12 LOC, `HandDrawnGrid.vue:155-158`)

Re-bake only when the rendered side leaves a tolerance band around the baked side; the first
measurement always latches exactly, so a cold load — and therefore every golden and every CI
viewport, none of which toggles the drawer — bakes at today's size and renders today's pixels.

```ts
const bakedSide = ref(0);
watchEffect(() => {
  const s = Math.min(hostW.value, hostH.value);
  if (!(s > 0)) return;
  const q = Math.round(s / 4) * 4;
  if (bakedSide.value === 0 || Math.abs(q - bakedSide.value) > BAKE_RELATCH_PX) bakedSide.value = q;
});
const captureSide = computed(() => bakedSide.value || 620);
```

**Kills the whole 150 ms grid half. Costs a resample.** The tolerance has to swallow the drawer's
worst delta, which is **64 px on a tall-wide viewport — 9.5% of a 672 px board**. A 9.5% bilinear
resample of baked 1-px grain is precisely the class of change the estate gates with an SSIM floor
(≥0.98, `HandDrawnGrid.vue:185-197` — the DPR2 cap was licensed by measuring 0.9888, and it is a
33% resample, so the precedent is *favourable*, not decisive). And `grid-corner-light` /
`cell-light` are golden subjects.
**Gate it must pass before it can ship: an SSIM re-derivation of the grid at the latched size
against an exact bake, both engines, both themes, against the ≥0.98 floor — plus the two goldens
re-shot on the final tree.** That is a bake-off, not a one-line assertion, and it is a bigger
instrument than the cure.

**Variant A′ — latch UPWARD only** (re-bake when the board grows, hold the larger bitmap when it
shrinks). Strictly never upscales, so it is never softer than an exact bake — but a downscale of
baked grain can moiré, so it still owes the same SSIM pass, and it leaves the close gesture
stalling and grows residency on a window shrink.

### Option B — cache the stack per size (in-repo, ~25–35 LOC, `HandDrawnGrid.vue:207-236`)

Keep the bitmaps for both drawer states keyed by `cacheKey|captureSide`; the first toggle in each
direction bakes, every one after is an instant swap. **Pixel-identical — zero soul risk, zero
golden risk.** Two costs: it exceeds the LOC bar, and it needs the consumer to own the bake
(`useRasterStack` fires its own watch off `cssSize`, so the size must be held stable and `rebake()`
driven by hand — fighting the library's contract, which is how the F2/F5 offenses started). And it
doubles the resident decode on the one surface the estate DPR-capped to halve it (19→8 MB):
**+1.9 MB desktop, +0.9 MB phone.** Owed row: a residency measurement.

### Option C — kill the round-trip upstream (pencil-boil, the real cure)

`rasterizePose` already holds a fully rastered `<canvas>`; it converts it to an `ImageBitmap`
(79–195 ms) that the consumer then re-draws into an `OffscreenCanvas` and PNG-encodes
(87–115 ms) to get a URL. A `rasterizePoseToBlob()` that hands back `canvas.toBlob()` directly
deletes one full copy and one encode from **every bake in the estate** — cold load, theme flip,
DPR change, and this drawer gesture — and changes no pixel that reaches the screen.
**Not this repo. Not this lane.** `pencil-boil` is a published package (0.10.1); this is an
upstream row with its own version bump, and the estate's own rule is that the lockfile moves in
its own commit.

### Recommendation, in order

1. **C upstream** — it is the only change that is both pixel-identical and estate-wide. File it
   against pencil-boil; the measured saving is 79–195 ms per bake before anything else is touched.
2. **A with its SSIM gate run** — the in-repo cure for the drawer specifically, once the resample
   is measured rather than argued.
3. **B only if A's SSIM fails** — pixel-identical, but it buys that with residency and by taking
   the bake away from the library.

**What the F3 carrier inherits, and it is a ruling, not a suggestion:** the registry froze new
sheet motion "until the ~280 ms drawer-open stall is attributed". It is attributed. But the stall
is **not in the drawer spine** — not in `useFlipGlide`, not in `useControlsDrawer`, not in
`scene.css`, not in `SvgFilters`. The carrier's motion work is unblocked by this attribution.
What the carrier now owns instead is a constraint: **any sheet substrate that changes the board's
rendered size across a gesture re-bakes the grid and pays 150 ms on desktop, ~300 ms on an iPad,
per gesture.** Design the substrate so the board's laid-out size is invariant across the sheet's
states, or land one of the cures first.

---

## 8 · Estate green, single tree

No source was edited. The tree measured is the tree gated — `git status` clean at `6800af04`,
one run, after the last measurement.

| gate | result |
|---|---|
| `npx vue-tsc --noEmit` | **0** |
| `npx vitest run` | **307 passed / 29 files** |
| default e2e (`PLAYWRIGHT_BASE_URL=http://localhost:4189`, own dev server) | **77 passed** |
| `filter-census` (G3.1 + G3.2, built dist) | **3 passed** |
| `theme-bake-freshness` (G4.5, chromium + webkit) | **4 passed** |

`filterBudget.ts` untouched — no budget row moved, so no rendered-census re-derivation was owed.
`:3000` (foreign palette-api) and `:4188` were left alone; `:4189` and `:4901` were mine and are
torn down; `:4894`/`:4895` were never touched; both sims are shut down.

---

## 9 · Artifacts

```
pass3/stall/ev/s1-open.js       the gesture decomposition (forced-layout timing + stacks)
pass3/stall/ev/s2-bake.js       the bake-path instrument (drawImage/createImageBitmap/convertToBlob)
pass3/stall/ev/s3-bakeany.js    the same, driven off the theme toggle
pass3/stall/ev/s4-drive.js      the repeat-toggle drive cell for a native profiler attach
pass3/stall/ablations/p{1,2,3}-*.css   board-pin · logo-pin · both-pin  (the negative controls)
pass3/stall/runs/*.jsonl        14 cells: s1 ×1, desktop s2 ×7, iPad ×3, iPhone ×2, drive ×1
pass3/stall/attrib-table.txt    the folded evidence table
pass3/stall/dist-head/          the measured dist (index-CaReTGTNUG3O.js, = HEAD 6800af04)
pass3/shots/stall-iphone16-no-drawer-regime.png
```

**One method in the order did not land, stated plainly.** The `xctrace` Time Profiler attach
(r2 §6) ran — `tp-drawer.trace` / `tp-drawer.xml`, 16 s attached to the hottest
`com.apple.WebKit.WebContent` — but it caught a process whose profile is style-resolve and layout
(`Document::resolveStyle` 167 ms, `performLayout` 62 ms) with no bake frames in it: Safari's
front-window churn during the drive left the page occluded, and the attach picked the wrong
content process. It is corroboration this attribution does not need — the JS instrument names
the API calls, their per-call milliseconds, and a control that takes all of them to zero — so the
trace is banked, not re-run. **Owed row if the campaign wants the native symbol table: re-drive
with Safari held frontmost and the content process identified by page, not by CPU delta.**
