# census:drawin — T9-M20 on main `1d0dc4fd`

"The draw in on page load animation is not smooth and pencil like." Measured on MAIN as the owner saw it:
a private build of the main tree (`index-ChSrVSqM0j8q.js`, vite preview 127.0.0.1:4250, killed by PID)
plus a READ-ONLY cold read of the owner's dev server :3001 (its process untouched). Read-only on product
files; nothing in `src/` moved.

## Numbers first

Instrument: an init script samples every frame AFTER that frame's rAF callbacks and layout (a
ResizeObserver on a 1 px probe fires post-rAF, pre-paint), so each sample is the state that frame PAINTS.
Per grid line it reads `stroke-dasharray`/`stroke-dashoffset` and gives progress = 1 − offset/len. It also
reads the wordmark's computed `clip-path`, `.scene-controls` opacity, the given glyphs' dash progress and
the tally's. Long tasks and LoAF (with script attribution) come from chromium only. Every canvas
`drawImage` and `toBlob` is timestamped, which is how the bakes are seen. Cold = fresh context with the
CDP cache disabled (chromium) or a fresh context (webkit). Warm = a reload in the same context. d = 1280×800
DPR2 fine; m = 390×844 DPR3 `hasTouch: true, isMobile: true`. Cells are min/median/max over n runs.

**Clocks and load, read before the numbers:** headless chromium ticks rAF at ~120 Hz on this box (median
frame 8.3 ms) and WebKit at 60 Hz (median 16–17 ms). So ">16.7" counts ordinary WebKit frames, and ">25"
(one missed 60 Hz vsync) is the stall column that means something. The box was SHARED with the live pass-6
lanes: the load average was 139 (1 min) / 80 (15 min) at 11:47 and 207–224 during the GV arm at 11:49.
Chromium's three repetitions agree to ±10 %. The WebKit numbers scatter 2–4× between arms and are read as
lower bounds on the disease, not as its size.

### Main matrix (tag M, 11:38–11:42)

| cell (engine-vp-cache-theme-motion) | n | draw start ms | draw window ms | painted frames in draw | frame dt max ms | frames >16.7 / >25 | frozen ms (>25) | worst single-frame line Δ % | lines never seen partial (of 17) | line jumps (>2× own median) | logo worst Δ % | givens pop at ms (count) | grid bake sync ms (per pose max / sum) | bake poses inside draw | long tasks in draw (chromium) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| M-chromium-d-cold-dark-motion | 2 | 128.8/141.1/141.1 | 551.7/558.1/558.1 | 15/25/25 | 141.7/166.4/166.4 | 4/5/5 / 3/5/5 | 309/386/386 | 87.3/87.8/87.8 | 0/3/3 | 21/96 57/199 | 38/38.5/38.5 | 183.6(25) 177.4(27) | 1272px 81.9/321 1272px 68.3/268 | 4 4 | 83+79+82+80 67+67+66+69 |
| M-chromium-d-cold-light-motion | 3 | 64.4/68.5/71.6 | 556.9/557.6/558.4 | 38/38/40 | 133/133.1/141.7 | 3/3/4 / 2/2/3 | 200/208/226 | 71.7/75.8/76.2 | 0/0/0 | 82/352 83/352 81/361 | 36/38.9/39 | 95.9(62) 93.6(62) 89.8(26) | 1272px 52.9/205 1272px 50/200 1272px 50.5/201 | 4 4 4 | 50+51+52+53 50+50+52+50 51+50+50+50 |
| M-chromium-d-cold-light-prm | 1 | - | - | - | - | - / - | - | - | 0/0/0 | 0/0 | - | 517.9(62) | 1272px 80.7/316 | 0 | 0 |
| M-chromium-d-warm-light-motion | 3 | 37.5/44.9/46.2 | 558.1/558.4/566.6 | 38/39/42 | 108.2/132.9/134.4 | 2/3/3 / 2/3/3 | 200/218/226 | 72.5/72.8/73.3 | 0/0/0 | 89/353 90/368 80/358 | 29.4/38/40.4 | 12.8(27) 12.7(62) 11.6(26) | 1272px 56.5/214 1272px 50/199 1272px 52.3/204 | 4 4 4 | 57+54+52+53 50+50+50+50 50+51+53+51 |
| M-chromium-m-cold-light-motion | 3 | 52.8/53.4/60.7 | 558.2/566.6/566.7 | 49/49/50 | 116.8/117.6/118 | 2/2/3 / 2/2/2 | 126/126/142 | 48.7/51/51.4 | 0/0/0 | 103/407 101/405 112/412 | 33.8/35.1/35.4 | 70(25) 85.9(62) 69.4(24) | 1092px 37/147 1092px 37.5/149 1092px 37.5/147 | 4 4 4 | 0 0 0 |
| M-chromium-m-cold-light-prm | 1 | - | - | - | - | - / - | - | - | 0/0/0 | 0/0 | - | 145(24) | 1092px 51.1/202 | 0 | 0 |
| M-chromium-m-warm-light-motion | 3 | 41.9/43.3/46.8 | 565.4/566.2/566.7 | 45/47/48 | 100.3/107.3/133.3 | 2/2/3 / 2/2/2 | 150/165/175 | 52.4/64.9/66.3 | 0/0/0 | 104/394 104/400 93/387 | 31.1/31.7/38 | 13.5(25) - 16.8(24) | 1092px 46.2/167 1092px 44.6/168 1092px 46.4/184 | 4 4 4 | 0 0 0 |
| M-webkit-d-cold-dark-motion | 2 | 477/531/531 | - | 34/66/66 | 638/717/717 | 19/35/35 / 9/10/10 | 986/1501/1501 | 85.7/90.4/90.4 | 12/17/17 | 0/2 3/13 | 2.1/78.4/78.4 | 477(24) 531(25) | 1272px 133/458 1272px 143/495 | 4 4 | 0 0 |
| M-webkit-d-cold-light-motion | 3 | 209/216/217 | 483/495/498 | 4/7/8 | 338/342/446 | 2/3/4 / 2/3/3 | 385/396/446 | 100/100/100 | 5/7/16 | 17/62 19/74 1/22 | 74.6/75.8/77.3 | 216(25) 209(36) 217(24) | 1272px 76/253 1272px 63/243 1272px 92/331 | 4 4 4 | 0 0 0 |
| M-webkit-d-cold-light-prm | 1 | - | - | - | - | - / - | - | - | 0/0/0 | 0/0 | - | 822(25) | 1272px 133/435 | 0 | 0 |
| M-webkit-d-warm-light-motion | 3 | 145/153/167 | 502/504/510 | 11/12/12 | 340/346/350 | 5/6/7 / 2/3/3 | 355/368/375 | 100/100/100 | 3/3/3 | 32/110 32/100 42/110 | 78.4/80.3/80.7 | 80(36) - 96(62) | 1272px 67/260 1272px 70/265 1272px 71/269 | 4 4 4 | 0 0 0 |
| M-webkit-m-cold-light-motion | 3 | 174/179/284 | 486/510/519 | 7/24/24 | 143/150/357 | 3/12/13 / 2/2/3 | 150/160/402 | 66.7/66.7/100 | 0/0/9 | 47/212 48/213 7/47 | 45.3/47/77.9 | 179(36) 174(36) 284(25) | 728px 25/95 728px 27/102 728px 78/237 | 4 4 4 | 0 0 0 |
| M-webkit-m-cold-light-prm | 1 | - | - | - | - | - / - | - | - | 0/0/0 | 0/0 | - | 1032(62) | 728px 85/323 | 0 | 0 |
| M-webkit-m-warm-light-motion | 3 | 201/232/341 | 472/487/491 | 4/10/19 | 202/228/350 | 2/7/11 / 2/2/4 | 221/313/441 | 96.3/96.9/100 | 0/2/16 | 16/86 51/184 0/32 | 41.9/54.8/78.6 | - 148(25) - | 728px 42/159 728px 37/145 728px 53/203 | 4 4 4 | 0 0 0 |

"givens pop" is when the given glyph PATHS mount, all in one frame, at dash progress 0. They are NOT
painted whole: the GV arm (below) shows them drawing in through the reveal wave. "draw window –" means the
end of the draw was never painted. The transition layer unmounted inside a freeze before any frame showed
the lines finished.

### The owner's own server, :3001 dev (tag DEV, read-only, cold)

| cell (engine-vp-cache-theme-motion) | n | draw start ms | draw window ms | painted frames in draw | frame dt max ms | frames >16.7 / >25 | frozen ms (>25) | worst single-frame line Δ % | lines never seen partial (of 17) | line jumps (>2× own median) | logo worst Δ % | givens pop at ms (count) | grid bake sync ms (per pose max / sum) | bake poses inside draw | long tasks in draw (chromium) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| DEV-chromium-d-cold-light-motion | 2 | 411.6/629.5/629.5 | - | 167/168/168 | 116.7/126.1/126.1 | 9/10/10 / 8/8/8 | 516/518/518 | 90.4/92.7/92.7 | 6/7/7 | 3/40 3/40 | 27.8/27.9/27.9 | 1212.8(62) 996.1(36) | 1272px 109.5/427 1272px 107.6/428 | 4 4 | 104+107+109+111 108+107+108+108 |
| DEV-webkit-d-cold-light-motion | 2 | 843/1212/1212 | 389/389/389 | 3/9/9 | 323/1187/1187 | 2/5/5 / 2/4/4 | 356/1853/1853 | 99.4/100/100 | 15/17/17 | 0/5 1/24 | 62.3/62.3/62.3 | 1212(26) 843(25) | 1272px 257/771 1272px 186/592 | 4 1 | 0 0 |

### Ablations (instrument-only, no product change)

ABLD holds the GRID bake's own `drawImage` + `toBlob` (the 1272 px canvas only) back by 1.5 s, so the bake
lands after the draw. HLOGO hides `.logo-menu` (the wordmark and its 8 pose bakes) in WebKit, and
HLOGOABLD does both.

| cell (engine-vp-cache-theme-motion) | n | draw start ms | draw window ms | painted frames in draw | frame dt max ms | frames >16.7 / >25 | frozen ms (>25) | worst single-frame line Δ % | lines never seen partial (of 17) | line jumps (>2× own median) | logo worst Δ % | givens pop at ms (count) | grid bake sync ms (per pose max / sum) | bake poses inside draw | long tasks in draw (chromium) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ABLD-chromium-d-cold-light-motion | 3 | 106.1/115.6/120.3 | 550.2/558.3/558.4 | 57/57/59 | 50.2/66.7/75.1 | 1/3/3 / 1/1/1 | 33/50/58 | 26.2/28/33.4 | 0/0/0 | 109/432 111/427 110/428 | 16.5/20.6/24 | 198.1(62) 161.9(36) 157.3(36) | 1272px 0/0 1272px 0/0 1272px 0/0 | 4 4 4 | 0 0 0 |
| ABLD-webkit-d-cold-light-motion | 3 | 414/502/637 | 456/456/456 | 10/50/50 | 155/383/564 | 9/29/29 / 6/8/10 | 292/1172/1188 | 76.3/94.3/97.7 | 0/13/13 | 0/15 1/26 20/94 | 35.9/50.7/53.4 | 637(28) 502(24) 414(25) | 1272px 0/0 1272px 0/0 1272px 0/0 | 4 4 4 | 0 0 0 |
| cell (engine-vp-cache-theme-motion) | n | draw start ms | draw window ms | painted frames in draw | frame dt max ms | frames >16.7 / >25 | frozen ms (>25) | worst single-frame line Δ % | lines never seen partial (of 17) | line jumps (>2× own median) | logo worst Δ % | givens pop at ms (count) | grid bake sync ms (per pose max / sum) | bake poses inside draw | long tasks in draw (chromium) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| HLOGO-webkit-d-cold-light-motion | 3 | 482/490/503 | - | 40/53/61 | 595/634/742 | 21/32/35 / 4/5/5 | 992/1129/1366 | 79/79.6/80.2 | 15/15/15 | 2/8 0/5 0/4 | - | 482(27) 503(36) 490(62) | 1272px 143/449 1272px 148/532 1272px 114/446 | 4 4 4 | 0 0 0 |
| HLOGOABLD-webkit-d-cold-light-motion | 3 | 389/414/450 | 431/435/462 | 5/8/12 | 164/220/235 | 4/4/8 / 3/4/5 | 292/322/368 | 90.6/94.1/98 | 0/3/11 | 17/74 6/42 37/109 | - | 414(36) 450(27) 389(36) | 1272px 0/0 1272px 0/0 1272px 0/0 | 4 4 4 | 0 0 0 |

An earlier arm deferred only `toBlob` (not `drawImage`) and made chromium WORSE (frozen 275–408 ms, now as
script-less LoAF). The pose's filter raster runs lazily at the canvas flush, so the cost is the
feTurbulence raster of a 1272² pose, not the PNG encode. That arm is moved to scratch and not banked.

### Given glyphs and the tally (tag GV, load 214–224, n = 2 per engine, d cold)

| run | givens | reveal wave (first ink → all inked) | painted frames | dt max | frames >25 | worst mean-progress Δ in one frame | tally draw |
|---|---|---|---|---|---|---|---|
| chromium-0 | 35 | 701 → 1759 ms | 127 | 17 | 0 | 1.7 % | 701 → 1010 |
| chromium-1 | 25 | 689 → 1507 ms | 93 | 33 | 1 | 3.7 % | 689 → 990 |
| webkit-0 | 61 | 578 → 1912 ms | 8 | 752 | 5 | 61.6 % | 578 → 1458 |
| webkit-1 | 35 | 408 → 1725 ms | 4 | 636 | 3 | 69.2 % | 408 → 1044 |

## Every draw-in the boot runs (main, file:line)

| # | Surface | What draws | Curve · duration · delay | Driver | Measured |
|---|---|---|---|---|---|
| 1 | Grid frame | 1 closed path, clockwise from top-left | easeOutCubic · 350 ms · 0 ±20 jitter (`pencilConfig.ts:478-485`) | pencil-boil `sequence` subscriber per line (JS, one shared rAF chain), writes `style.strokeDashoffset` (`usePathAnimation.ts:64-77`, `:115-128`) | stalls: see matrix |
| 2 | Subgrid lines (9×9: 4) | v3, v6, h3, h6, in that order, top→bottom / left→right (`gridPaths.ts:478-520`) | easeOutCubic · 280 ms · 150 + 25·i ±25 (`pencilConfig.ts:486-492`) | same | same |
| 3 | Cell lines (9×9: 12) | v1,v2,v4,…,h8 | easeOutCubic · 200 ms · 300 + 10·i ±15 (`pencilConfig.ts:493-499`) | same | up to 15 of 17 lines in flight at once (chromium, gp max 15) |
| 4 | Wordmark | a CLIP WIPE of filled Fraunces text, not a stroke | `clip-path: inset(0 100% 0 0)` → 0 over 1.2 s `--ease-noteWrite` = easeOutQuint (`HandwrittenLogo.vue:680-686`), armed by a double rAF (`:253-263`) | CSS transition; main-thread in the sample (computed value), compositing in chromium unproven | 99 % at 822–846 ms (chromium). Its live pose-0 filter swaps to the baked bitmaps MID-WIPE (lb=4 at 393–431 ms chromium, 717 ms webkit) |
| 5 | Given digits | per-cell stroke draw-in (the deal marks givens as `animatingCells`, `useGameState.ts:596`) | easeOutCubic 350 ms, board noise stagger (`HandwrittenGlyph.vue:190-203`, `DRAW_IN_PRESETS.glyph`) | pencil-boil `createStrokeDrawIn` | GV table |
| 6 | Difficulty tally | inked strokes tick in | easeOutCubic 350 ms · 90 ms stagger (`DifficultyTally.vue:77`, `:135-161`) | `sequence` subscribers | GV table |
| 7 | Controls chrome | a FADE, not a draw | opacity 250 ms `--ease-drawOn` +150 ms (`scene.css:612`) | CSS animation | worst Δ 10–22 % per frame at a stall |
| 8 | Steady handoff | the transition layer (UNFILTERED, crisp, pose frozen at 0) unmounts, and the grain-baked bitmaps or the live grain filter mount | `HandDrawnGrid.vue:271-272` (`animState`), `:80` (pose frozen at 0 until `pathsVisible`) | Vue v-if | 27–38 ms after the last line (chromium, bitmap). WebKit lands on the LIVE FILTER (sl=4) in the DEV/GV/ablation arms, bitmap 0.4–0.75 s later |
| — | Toggle, ScribbleLoader, marks, laminate | no boot draw-in on this path: toggle poses appear whole, the loader never mounted (`ld=0` every run), marks/laminate are not on the boot | — | — | — |

**Correction to the brief:** `frontGate` is NOT on main. `HandDrawnGrid.vue:197` at `1d0dc4fd` is the T9-W8 C01
comment block, and `grep frontGate|FRONT_MIN` over main's `src/` is empty. The gate lives on ACC-FIVE's
tree and times the FILL gauge, the tally and the join fronts (A.6), not the boot grid. On main the boot
grid's clock is `usePathAnimation`'s time-based sequence.

## The mechanism

1. **The grid's own raster bake lands inside the grid's own draw-in.** `gridRaster`
   (`HandDrawnGrid.vue:229-252`) bakes 4 grain-filtered poses at the rendered side × DPR (1272 px desktop,
   1092 px chromium mobile, 728 px WebKit mobile) the moment the font gate opens and the box measures
   (`:238` `fontGatedBox`). fonts.ready lands at 76–137 ms, so the first grid pose starts 143–171 ms
   (chromium d cold) or 302–311 ms (WebKit d cold). That is inside the 557–567 ms draw every time: **4 of 4
   poses inside the draw in every one of 36 motion runs.** Each pose is one main-thread task of 50–53 ms
   (chromium d light), 66–82 ms (chromium d dark), 37–46 ms (chromium m), 57–92 ms (WebKit d light) and
   105–143 ms (WebKit d dark). LoAF names the script every time: `IMG[src=blob:…].onload` in
   `animation-vendor` (pencil-boil `raster.js` `capturePoseCanvas` → `encodeCanvas`).
2. **The draw is time-based, so a stalled frame is a jump, not a slowdown.** `createSequenceSubscription`
   computes progress from the rAF timestamp (`pencil-boil/dist/vue.js:194`). A 100–140 ms stall (chromium)
   or a 338–446 ms stall (WebKit) paints the lines wherever the clock says. Chromium: the worst single
   painted frame moves one line **72–76 %** of its length (desktop), 49–66 % (mobile), 87–88 % (dark).
   WebKit desktop: **100 %**, with 3–16 of the 17 lines never seen partial at all (they appear whole).
   WebKit dark: the whole draw is swallowed. One sample at 477 ms (frame line 86 %), the next painted
   frame at 1115 ms, already on the steady layer.
3. **Causation (chromium, ABLD):** with only the grid bake moved past the draw, frozen time falls
   200–226 → **33–58 ms**, painted frames 38–40 → **57–59**, the worst one-frame line Δ 72–76 % →
   **26–33 %**, and the wordmark's worst Δ 36–39 % → 16–24 %. The residual 50–75 ms frame is the
   wordmark's 8 pose bakes (LoAF 54–73 ms `IMG.onload` at 145–186 ms).
4. **WebKit is not cured by moving the grid bake alone** (ABLD 292–1188 ms frozen; HLOGOABLD 292–368 ms
   frozen, 5–12 painted frames). In WebKit the wordmark's 8 poses and the grid's 4 run back to back with no
   rendering opportunity between them. GV-webkit-1 shows logo 500–607 ms then grid 617–1028 ms, one
   ~530 ms block. The live grain-filter fallback then paints in the handoff. On a box at load 139–224 the
   arms do not separate cleanly: what remains of WebKit's freeze past the bakes is UNATTRIBUTED (no
   LoAF/longtask in WebKit).
5. **The wordmark wipe shares the stalls.** It is a 1.2 s easeOutQuint clip: 50 % revealed at 12.9 % of
   the time (155 ms), 90 % at 36.9 % (443 ms), then a 757 ms creep. Its worst one-frame Δ is 36–39 %
   (chromium d), 76–80 % (WebKit d). The screencast agrees with the computed value (crop 2: "sud" at
   440 ms), so no smoother compositor copy was seen.
6. **A late deal ERASES and REDRAWS the grid.** `useGameState.ts:610` bumps `boardGeneration` on the
   first deal, and `GameBoard.vue:966-977` erases a DRAWN grid (150 ms easeInCubic) and draws it again.
   When the deal lands inside the draw nothing restarts (the state is already 'drawing'). Under load it
   landed after: the screencast run (`cast.mjs`, chromium d cold) drew 51 → 718 ms, went steady at 825,
   then erased 917 → 1126 and drew again from 1141. The owner's :3001 cold deals at 843–1212 ms, which is
   the same race window.

## What "pencil-like" needs that the boot lacks (read from the code and the samples)

- **A hand's velocity profile.** Every draw-in is easeOutCubic: the tip leaves at 3× its mean speed at
  t=0 and has covered 50 % of the line at 20.6 % of the time (90 % at 53.6 %). A hand is bell-shaped
  (minimum-jerk: 0 → peak ~1.9× mean at mid-stroke → 0). The wordmark is worse: easeOutQuint.
- **A tip.** The leading edge is a round cap of the full width and opacity (`stroke-linecap="round"`,
  `HandDrawnGrid.vue:360,374,387` (frame, subgrid, cell)). Nothing leads: no taper, no darker pressure point, no graphite build-up.
- **Pressure.** Uniform `stroke-width` 12/8/5 and fixed opacity along the whole stroke, no lift at the end.
- **Texture while drawing.** The transition layer is UNFILTERED (the grain is off during the draw by design,
  `HandDrawnGrid.vue:337-346`), and the grain arrives in one step at the handoff (row 8). At the
  screencast's 1× resolution the step can't be seen (gap G4).
- **The hand's order.** Up to 15 of 17 lines are in flight at once. The 12 cell lines start within
  110 ms of each other (10 ms stagger), which is a machine sweep, not one hand. The wordmark isn't drawn
  at all: a rectangle slides off filled text, cutting through letters (crop 2).
- **Continuity.** The draw is time-based (no frame skipping protection). Under any main-thread block it
  teleports, and every boot bake is scheduled into its window.

## PRM arm (reduce, cold, 4 cells)

The grid snaps: no sample ever showed a partial line, so the transition layer never paints. The wordmark
is `clip-path: none` from the first sample (lc=1). The controls read opacity 1 at their first sample. The
glyphs mount already inked. PRM is a CUT as the law asks. But the steady layer is the LIVE grain filter
(sl=4) until the bake lands: 759–793 ms chromium d, and more than 5 s WebKit (never baked in the window).
PRM's first ~0.8 s is the filter-raster regime the bake exists to avoid (not a motion defect, but a
paint cost PRM users still pay).

## Crops (chromium · light · 1280×800 DPR2 · fine, CDP screencast of the cold boot at load ~190)

The screencast throttles to the frames it acks. These are painted frames, not rAF samples.

- `crop1-chromium-light-1280x800-fine-t224ms.jpg`: frame line ~45 % along the top edge, no wordmark.
- `crop2-chromium-light-1280x800-fine-t440ms.jpg`: the NEXT painted frame, 216 ms later. The frame line
  has jumped to ~85 % of the perimeter, one subgrid line is half-drawn, the controls card is whole, and
  the wordmark wipe cuts "sud|" mid-letter.
- `crop3-chromium-light-1280x800-fine-t623ms.jpg` → `crop4-…-t730ms.jpg`: board corner, 107 ms apart.
  Four cell lines go from absent to near-whole in one painted frame.

## Series and instruments

`series/summary-{M,DEV3001,ABLD,HLOGO,GV}.json` hold per-run summaries (windows, dt min/median/max, the
worst per-line Δ with its frame, jumps, bake timings, long tasks, LoAF). `series/instruments/` holds
`init2.js` (the post-rAF sampler), `run2.mjs` (the runner, with the ABL/HIDE arms), `an.mjs`,
`table.mjs` and `cast.mjs`. Raw per-frame JSON stays in scratch, not banked.

## Gaps

- G1: WebKit attribution is partial. The bakes explain ~250–530 ms of freezes that run 338–1853 ms, and
  the rest is unattributed (no LoAF/longtask in WebKit, and the box was at load 139–224).
- G2: every number was taken on a loaded, shared box. A quiet-box re-run, both engines, is owed before any
  number becomes a gate floor.
- G3: whether chromium composites the wordmark's clip-path transition is unproven. The screencast only
  agrees with the main-thread value at the frames it caught.
- G4: the grain step at the handoff (unfiltered → grain) and the wordmark's live-filter → bitmap swap
  mid-wipe are code facts. Neither was framed at DPR2 as a painted pair.
- G5: the erase-and-redraw race (mechanism 6) was caught once (screencast run). Its rate on the owner's
  :3001 is unmeasured (n = 2 DEV cold runs didn't show it).
- G6: m arms are chromium + WebKit emulation only. No real iOS device (and no osascript/Safari, M19).
- G7: the 16×16 and other games' boots were not run. The census is the default `/` (sudoku 9×9).
