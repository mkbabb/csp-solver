# P1 — Safari/iOS performance patch

**The owner's order (2026-07-31):** the live site is a rendered-performance mess on desktop
Safari and especially Safari iOS. The owner's word overrules the 19/19 Playwright-WebKit
battery—lessons rule 1 made that binding. Research ran as three lanes (`evidence/research/`):
r1 built the real-Safari rig (:4894) and read the baselines, r2 ran the sham-controlled
ablation matrix on real Safari 26.4 + real MobileSafari, r3 studied the cure space in source.
Two competing cure architectures (library-outward, deletion-inward) were adjudicated per the
thrice protocol; this charter is the agglomeration.

## Root cause (r2, measured)

One surface owns nearly all of it: **63–81 live `url(#grain-static)` reference filters on the
board digits** (`HandwrittenGlyph`). WebKit caches no filter result for unlayered SVG content,
so the 125 ms boil beat re-executes every chain on every repaint of the board region—8
hitches/s at idle, forever. Deleting them (`a10`) takes idle 79.0→98.3 fps with long33 24→0,
the celebration 63.6→96.8, deal 72.4→89.2, themeToggle 32.0→67.4, and GPU-process raster from
10.3 to 3.6 CPU-s per 30 s of sitting still. Cause 2: the theme swap tweens 46 `transition:
all` elements (+23.5 fps alone). Cause 3: reference filters on HTML boxes—16 `.icon-btn` + 2
`.control-panel-filtered`—WebKit's software filter path (+12.3 on deal). Blanket layerization
(`a13`) buys the same GPU seconds on desktop and **regresses the sim** (deal −3.8, gallery
−5.5, toggle −5.9), so promotion is not the cure. Riding along, mark 4 (verified): pencil-boil's
raster path lets WebKit pin filtered SVG-as-image bakes at declared intrinsic size—the logo
renders 3.7–5.6× soft, the toggle 2.1–3.1×—plus opsz divergence clips all five wordmark labels
and the fraunces subset lacks m+n. The same release must carry the perf cure and the raster
fix: one library version, one adoption wave.

## The apotheosis

**Center: subtract at the source and repair the library's one broken contract. The glyph,
icon, and loader reference filters leave (`a10` is the measured cure—deletion, not
relocation); pencil-boil 0.10.0 stamps its capture intrinsic and refuses zero-box bakes
(mark 4, cured for every caller with zero call-site diff); grain-in-geometry becomes library
mechanism only on the owner's ballot word; and the only machinery added anywhere is the
counted live-filter budget that makes the defect class unrepeatable.**

The soul question is not assumed away—it's balloted first, while the change is cheap (lessons
rules 6+8). P-W2 puts a three-way artifact on the rig: **A** live-filtered (the incumbent,
auditioned first), **B** grain baked into glyph geometry (fixed per-char sample count—variants
must keep identical command structure or the flourish/murmur morph silently dies), **C**
unfiltered authored paths. Dark+light, real Safari dpr2 + MobileSafari dpr3, 1× and a 4×
loupe, per-variant fps on the page, SSIM per pair as an indicator with a thin-line negative
control (the divider's 0.809 is the known failure mode—the instrument must be able to red).
Parsimony preference C > B > A; the owner's eye rules per surface; the ruling and its
enforcing config land in the same commit. Icons carry a pre-committed deletion argument: every
icon is viewBox 24 against grain-static's 25-unit wavelength—the filter is a uniform ±1.25-unit
nudge, not a tooth, and `CrayonHeart` already rules grain sub-perceptual below 20 px. The
panel (`.control-panel-filtered`) is the genuine open ballot.

From the library-outward design: the intrinsic fix inside `rasterizePose`, the born-RED rig
sharpness curve, the SSIM negative control, the reading-distance contact sheet, the five
`heldFrameCount` wraps (a shipped-contract repair), thresholds committed in `gates.json` in
the cure-merge commit. From the deletion-inward design: deletion as the default cure, the
zero-box bake guard, the three-way ballot with fps attached, the icon wavelength argument, the
glyph morph invariant, SSIM demoted from gate to tripwire, the hover-sweep and solve-window
gates, `filterBudget.ts` re-read from production, the release cut after the ballot.

## Refused—each against a number

- **EngineProfile / profiledFrameCount** — two consumers, both shipped and working; substrate
  wearing an API. Trigger: a third engine-gated surface.
- **usePoseLayers HTML-box hoist** — falsified: `a2` (pinning the grid's bitmap flips) bought
  +0.5 fps and zero GPU seconds; post-cure idle sits at the display ceiling.
- **`RasterStackHandle.urls` fold** — real duplication (three hand-rolled swap/revoke
  lifecycles) but working, defect-free, and 0.10.0 already changes what every bake captures—two
  variables, one bake. Trigger: the next pose-stack consumer, or the first URL leak.
- **The beat governor** — its prize was the idle beat train; the cure takes idle to the
  ceiling (98.44 desktop, 60.03 sim, long33 0). Parking a page at the display buys nothing and
  opens the one soul question not worth opening. Trigger: a real iPhone idling below 55 at
  default state post-P-W3.
- **WAAPI accelerated beat** — downstream of the refused hoist; ~24 permanently promoted
  layers is the residency failure `a13` already measured as a mobile regression.
- **Blanket `translateZ(0)` (`a13`)** — sim regressions across deal/gallery/toggle; 272 ms
  worst frame on desktop themeToggle vs `a10`'s 144.
- **`@animationend` class drop** — trades 81 finished animation objects for 81 listeners; the
  retained *effect* is what promotes, and `backwards` removes the effect. The re-reveal replay
  wrinkle (hint-then-Solve) is banked as its own defect with a trigger.
- **Clearing `animatingCells`** — breaks the `celebrating` derivation; the fill cure lives in
  CSS, never the store.
- **Logo/toggle DPR cap** — mark 4 is the owner saying these are too soft; capping trades the
  sharpness being shipped. Trigger: E7, a device layer/backing-store census.
- **Outline bake (E3)** — `a9`, the estate-wide upper bound, moved idle +2.9 at a ±2 noise
  floor. Not the bill.
- **IntersectionObserver work (17% of idle main thread)** — the bundle registers zero
  observers; WebKit's own per-rendering-update overhead. Not ours.
- **`a7`-shaped cell simplifications** — cost 16.1 fps on deal; the cells' animations are
  load-bearing.

## The countable invariant

Third occurrence of the live-filter class (grid hoist, divider collapse, glyph population), so
the count comes first: `web/frontend/src/pencil/config/filterBudget.ts`—one typed source:
`perCell: 0` · `beatDriven: 0` (sole exception: BoilDivider's 8 poses, Apple-frozen at
`fb15253d`; trigger: any bake retry or a Chromium red) · `htmlBoxes` per the panel ballot ·
a transient allowlist (each rasters once, one-line reason each) · **total ≤ 14** in the
default solved scene, against 99–123 today. Enforced by `e2e/filter-census.spec.ts` against
the **built dist** as an exact-match allowlist, not a ceiling—a new filter surface reds CI
even when an old one retires—wired into the existing e2e CI job in the same commit as the
deletions it licenses, and re-read from production at P-W4. Secondary census, same spec:
`forwards|both` fill sites equal a written allowlist (the tripwire that would've caught
`cell-reveal` before the owner did).

## Wave DAG

```
r1 ─ r2 ─ r3 (done, evidence/research/)
        └─ P-W2 library + ballot ─ P-W3 adoption ─ P-W4 validate + deploy + record
```

- [waves/p-w2-pencil-boil.md](waves/p-w2-pencil-boil.md) — pencil-boil 0.10.0 + the A/B/C ruling
- [waves/p-w3-adoption.md](waves/p-w3-adoption.md) — the app cure, net-negative LOC, the budget
- [waves/p-w4-validate-deploy.md](waves/p-w4-validate-deploy.md) — the rig battery, deploy per
  seal, the WGATE §9 addendum

E8—owner device smoke on a real iPhone—stays an owner row and **blocks the iOS claim**: sim
numbers say the mobile path ranks the same, never what an iPhone does (lessons rule 1).
