# r3—THE CURE DESIGN STUDY

**Lane L3, p1-safari-ios-performance.** No code changed anywhere. This is a source study of
`@mkbabb/pencil-boil@0.9.2` (`/Users/mkbabb/Programming/pencil-boil/src`, 1546 LOC across nine
modules) against the app's whole pose/filter estate, plus four candidate cures and the library
API sketch that carries them.

**Method.** Every count and every geometry figure below is read out of source—the pose-stack
templates, the CSS, the config hub—not measured. Every *measurement* is cited from the estate's
own banked evidence (`evidence/safari/s1.md`, `s2.md`, `s3.md`, `crit-safari.md`,
`evidence/perf/crit-perf-audit.md`, the T3-W13 `b1` painter inventory). Where a claim needs a
number nobody has taken yet, it's flagged and handed to L1/L2 as a named experiment (§8). The
owner's verdict—the live site is a rendered-performance mess on desktop and especially Safari
iOS, Playwright-WebKit's 80–98 fps notwithstanding—is the premise, not something this lane
re-litigates.

**The prior art that frames everything.** WebKit paints SVG interiors UNLAYERED: `will-change:
opacity` on an inner `<g>` earns no compositor layer, so a per-beat opacity flip of a
live-filtered pose re-executes the whole `feTurbulence + feDisplacementMap` chain. That's the
BoilDivider collapse—~10 fps steady state on desktop Safari against the deployed edge,
recovering to 98 fps with the divider pinned—fixed at `fb15253d` by an Apple-vendor pose-0
freeze riding the `frameCount ≤ 1` contract. Two independent lanes named the identical mechanism
before that (`s1`: grid grain-hoist hidden → GPU 624%→78%, page 4.6→49.6 fps; `s3`: nulling only
the `filter` while keeping the DOM, the four `will-change:opacity` layers and the 8 Hz flip
collapses CPU 11.9%→2.6%, identical to hiding the surface outright). `crit-safari` re-derived
both and cut `s1`'s magnitude ~3× (true interval ≈208% ≈ 2 cores) while confirming the
mechanism, the grid's dominance, and the will-change inversion (WebKit 10.3% vs Chromium 0.5%
for the identical markup).

**The geometry this study assumes**, stated once so the arithmetic is checkable: desktop 1280 ×
900, board ≈620 CSS px square, DPR2; iPhone-13 class 390 × 844, board ≈340 CSS px square, DPR3.
The grid bake is DPR-capped at 2 on Apple (`HandDrawnGrid.vue:187`); the logo and toggle bakes
are **not**—that asymmetry is a finding, §4.6.

---

## 1. The per-beat writer inventory

One shared counter (`src/pencil/composables/boilBeat.ts`) drives everything: a single imperative
`createBoilTicker(2, MOTION.beatMs=125, …)` subscriber on pencil-boil's unified chain, ref-counted,
increments `beat`; consumers derive frame indexes through `useBeatFrame(frameCount, stepEveryBeats)`.
PRM force-clears the driver centrally; tab-hidden parks the chain; `heldFrameCount` collapses a
count to 1 and the `total ≤ 1` path freezes in place with no snap to 0. That architecture is sound
and is not what's wrong.

What's wrong is what each consumer *does* on the beat. Every row below is a **pose flip**: two
class writes (`is-active` off the outgoing sibling, on the incoming), 8/s, coalesced into one rAF.

| surface | file | substrate | poses | raster / dirty area (desktop DPR2 → iPhone DPR3) | cadence | layerable on WebKit? | frozen look |
|---|---|---|---|---|---|---|---|
| **grid poses** | `HandDrawnGrid.vue:363` | `<image>` in SVG, baked bitmap | 4 | 1240² dev px ≈ 1.54 Mpx (capped DPR2) → 680² ≈ 0.46 Mpx | every beat | **NO**—SVG interior | a hand-ruled board. Already shipped as the cold-load pin (`showBaked === false` pins pose 0) |
| **grid live fallback** | `:386` | `<g filter="url(#grain-static)">` in SVG | 4 | same, ×4 resident | pinned to pose 0 pre-bake; `display:none` post-bake | n/a | the shipped cold-load surface |
| **progress trace** | `:437` | `<g>` vector, filterless, in the SAME SVG | 4 | dirty rect = board box, ~1.54 Mpx → ~1.04 Mpx | every beat | **NO**—SVG interior | a static violet ring, dash-front intact |
| **outline** ×3–4 | `HandDrawnOutline.vue:122` | `<g>` vector, grain-in-geometry, in SVG | 4 | card ≈328×708 CSS → 656×1416 ≈ 0.93 Mpx → 984×2124 ≈ 2.09 Mpx **each** | every beat | **NO**—SVG interior | a hand-ruled frame. Already shipped: every gallery flank is pose 0 |
| **logo poses** | `HandwrittenLogo.vue:239` | `<image>` in SVG, baked bitmap | 4 | ≈712×142 ≈ 0.10 Mpx → 1068×213 ≈ 0.23 Mpx (uncapped) | every 4th beat (`beatsFor(550)`) | **NO**—SVG interior | the wordmark, still |
| **toggle rest** | `DarkModeToggle.vue:200/276` | HTML `<img>` siblings | 4 ×2 bodies | 160² ≈ 0.026 Mpx → 240² ≈ 0.058 Mpx | every beat (active body only) | **YES**—HTML box | sun/moon, still |
| **difficulty tally** | `DifficultyTally.vue:194` | `<g>` vector, grain-in-geometry, in SVG | 4 | 76×44 viewBox at ~1.5em ≈ 41×24 CSS → tiny | every beat | **NO**—SVG interior | five tally strokes, still |
| **boil divider** ×1 | `BoilDivider.vue:74` | `<g filter="url(#grain-static)">` in SVG | 4 | ≈531×31 dev px | **FROZEN on Apple** (`fb15253d`) | **NO**—the proof case | a hand-drawn rule |
| **gallery center card** | `GameGallery.vue:95` → `GameCard` → `HandDrawnOutline :pose` | as outline | 4 | one card | every beat, center only; flanks pose 0 + `inert` | **NO** | the soul-gated flank look |

**The structural reading.** The T4-W1 bitmap bake killed the *filter re-execution* on three
surfaces (grid, logo, toggle)—the dominant cost, correctly. It did **not** move the flip out of
the SVG. Only DarkModeToggle flips HTML boxes; grid and logo flip `<image>` elements that are SVG
interiors, exactly the place `fb15253d`'s own comment says earns no layer. So the remaining
per-beat bill on WebKit is a **repaint**, not a compositor blend—a bitmap blit rather than a
turbulence pass, far cheaper, but over the board box, 8/s, on the CPU path, forever.

And three surfaces were never baked at all: `.progress-pose` (4 vector ring poses inside the grid
SVG), `HandDrawnOutline` (3–4 instances, the **largest** remaining per-beat dirty area on the page
at ~2.09 Mpx each on iPhone), and `.dt-pose`. Those repaint vector geometry per beat with no
filter anywhere in sight. On an engine that layerizes SVG interiors they're free; on WebKit
they're the bill nobody has itemized.

**Sequence (one-shot) writers**, for completeness—these self-unsubscribe and cost nothing at
steady state, so they're not targets: glyph draw-in / flourish / hover wiggle
(`glyphAnimations.ts`), grid path draw-in (`usePathAnimation.ts`), tally draw-in, celebration
star draw-on + heart bounce, gallery deal + snap chime. The celebration's beat-3 murmur is a
`setTimeout` chain (one cell per 2.5 s window), not a subscriber. That discipline is intact.

---

## 2. The live reference-filter inventory

`crit-safari` measured 63–74 filtered elements at idle on the deployed build, and proved the
attribution: `filter:none` with the beat still flipping drops idle CPU 88.9% → 3.1%. Here's what
those elements *are*. The split that matters on WebKit is **CSS `filter: url(#…)` on an HTML box**
(the CPU path) versus an SVG `filter=` attribute.

| # | site | filter | host | population (9×9 board scene) | recurs when |
|---|---|---|---|---|---|
| 1 | `HandwrittenGlyph.vue:348` | `url(#grain-static)` | SVG `<path>`, one per digit | **30 dealt → 81 solved** | every write to the path—draw-in (hoisted off), murmur (hoisted off), **hover wiggle (NOT hoisted—§4.2)** |
| 2 | `GameControlPanel.vue:719` `.control-panel-filtered` | `url(#stroke-light)` / `-dark`—**3× feTurbulence @ numOctaves 4 + 3× feDisplacementMap + 2× feBlend** | **HTML `<div>`** | 1 (mobile XOR desktop) | any repaint of the panel subtree—incl. `.section-heading:hover`, which changes the filter's INPUT |
| 3 | `GameControlPanel.vue:816` `.icon-btn` | `url(#grain-static)` | **HTML `<button>`** | 8–9 | any repaint—and `transition: all 150ms` guarantees ~9 repaints per hover edge (§3.2) |
| 4 | `GameControlPanel.vue:825` `.icon-btn:hover` | `url(#wobble-celestial)` | HTML `<button>` | 1 at a time | hover in/out |
| 5 | `GameControlPanel.vue:800` `.section-heading:hover` | `url(#wobble-heart)` | HTML `<h2>` **inside #2** | 1 at a time | hover in/out—re-runs #2 over the whole panel |
| 6 | `OptionSelector.vue:77` `.ctrl-btn:hover` | `url(#wobble-heart)` | HTML `<button>`, `transition-all duration-150` | 1 at a time of 3–9 | hover in/out |
| 7 | `BoilDivider.vue:79` | `url(#grain-static)` ×4 poses | SVG `<g>` | 4 | frozen on Apple; each rasters once |
| 8 | `HandDrawnGrid.vue:394` | `url(#grain-static)` ×4 poses | SVG `<g>` | 4, `display:none` once baked | pre-bake only, pinned pose 0 |
| 9 | `ScribbleLoader.vue:62` | `url(#grain-static)` | SVG `<path>` with **`animation: scribble-cycle 1000ms linear infinite`** | 1 while solving | **every frame—60 filter re-rasters/s for the solve duration** (§4.3) |
| 10 | `SolverErrorNote.vue:96` | `url(#grain-static)` | HTML element | 0–1, transient | on appearance |
| 11 | `PosterBoard.vue:108` | `url(#grain-static)` | SVG `<g>`, one per gallery card | 5 in the gallery | once each, static |
| 12 | `CelebrationStar.vue:130`, `CrayonHeart.vue:109` | `url(#grain-static)` / `url(#wobble-heart)` | SVG `<g>` | 0–2, transient | on appearance |
| 13 | `.sparkle-icon` | `drop-shadow(...)`, `transition: all 200ms` | HTML | 1 | hover—built-in filter, interpolable, cheap |

Row 1 is the population nobody counted: **a solved 9×9 carries 81 live reference filters**, one
per digit, each a `feTurbulence + feDisplacementMap` over a ~40×56 CSS box. At steady state each
rasters once and stays cached, which is why idle doesn't burn—but that's 81 filter regions
resident in the render tree, and every one is a landmine for any style write that reaches it.

Row 2 is the desktop-jank engine. A 3-pass, 4-octave turbulence chain plus three displacement
maps plus two blends, over a panel roughly 320×700 CSS px, on an **HTML** element—WebKit's CPU
filter path. `will-change: transform` gives it a layer (which is why the W5 repair helped a
*move*) but does nothing about re-execution when its input changes. Hovering a section heading
inside it changes its input.

---

## 3. The two adjudications

### 3.1 The 35 running cell-reveal animations—adjudicated from source

**The chain.** `useGameState.animatingCells` is a `ref<Set<string>>` written at deal (all givens,
`:434`), solve (all newly-filled, `:522`), hint (one cell, `:378`) and fill-forced (a batch,
`:608`). It is cleared **only** on reset / clear / undo / restore (`:273, :311, :396, :701, :760`).
`GameBoard.isRevealed(pos)` is `props.animatingCells.has(String(pos))` (`:655`). Each cell binds
`:class="{ 'cell-reveal-animated': isRevealed }"` (`SudokuCell.vue:98`, `FutoshikiCell.vue:103`).
And `index.css:598`:

```css
.cell-reveal-animated {
  animation: cell-reveal 0.3s var(--ease-anticipatePop);
  animation-delay: var(--reveal-delay, 0ms);
  animation-fill-mode: both;
}
```

**Verdict: they're not running—they're FINISHED AND FILLING, retained forever.** The animation
is 0.3 s, one iteration; 35 of them cannot be simultaneously running at idle. What retains them is
that nothing ever removes the class: `animatingCells` keeps the dealt/solved positions until the
next board op, so `animation-name` stays applied and the `CSSAnimation` object stays in
`document.getAnimations()`—which by spec includes finished-but-filling animations. The census's
"RUNNING" label is a probe artifact: a count of `getAnimations().length` without a
`playState === 'running'` filter. **The count is real; the label is not.** 35 is the blank count
of the dealt board; after a Solve it becomes the full 81.

**But the retention costs, and it costs precisely where the owner is complaining.** The 100%
keyframe is `transform: scale(1); opacity: 1`. `.game-cell` declares neither, so its cascade
values are `transform: none` and `opacity: 1`. `scale(1)` does **not** compute to `none`—it
computes to a matrix. So the forwards fill leaves **35–81 board cells with a non-`none` computed
transform, sourced from an animation effect**, indefinitely. Two consequences:

1. WebKit promotes elements carrying accelerated (transform/opacity) animations. De-promotion
   after a *filling* animation finishes is not something the estate has verified, and on an
   iPhone 35–81 promoted cell layers at DPR3 is a tile-budget event—exhaustion → eviction →
   re-raster churn on every subsequent scroll or interaction. That is the exact shape of "iOS
   especially," and it is the highest-value single hypothesis this lane produces (§8, E1).
2. Every one of those cells contains a filtered glyph (inventory row 1). A cell whose transform
   comes from an animation effect sits in a different compositing relationship to its filtered
   child than one that doesn't.

**The cure, in two moves, both zero-pixel-change.**

- `animation-fill-mode: both` → `backwards`. The forwards half is **redundant**: the 100% keyframe
  values equal the cascade values, so dropping it returns `transform: none` to every revealed cell
  and changes nothing on screen. The backwards half is load-bearing (it holds `scale(0)/opacity:0`
  through the `--reveal-delay` window) and is kept.
- Drop the class when the reveal lands: an `@animationend.self` on the cell root sets a local
  `revealDone` ref, re-armed on each `isRevealed` false→true edge. This removes the animation
  object outright.

  `animatingCells` itself must **not** be cleared—`celebrating` is derived from
  `solveState === 'solved' && animatingCells.size > 0` (`SudokuBoard.vue:79` and the three twins),
  so clearing it would kill the celebration gate. The cure belongs in the cell, not the store.

There's a functional wrinkle in the same place, worth banking: a cell already in `animatingCells`
that gets re-revealed (hint, then Solve) does **not** replay the reveal, because the class never
left. The `animationend` cure fixes that for free.

### 3.2 The `transition: 'all'` computed value on pose groups—adjudicated

**Verdict: a false positive.** `transition-property`'s initial value *is* `all`, so
`getComputedStyle(el).transition` returns `"all 0s ease 0s"` for every element in the document
that declares no transition. Grep proves the pose groups declare none: `.boil-pose`,
`.dt-pose`, `.logo-pose`, `.logo-pose-bmp`, `.boil-frame-layer`, `.boil-frame-bitmap`,
`.progress-pose` and `.rest-pose` carry `opacity` + `will-change: opacity` and nothing else. Zero
duration, zero cost. Nothing to fix.

**What the census caught by accident is a real problem one selector over.** The authored
`transition: all` sites with nonzero duration sit on the filtered HTML boxes:

- `.icon-btn { transition: all 150ms; filter: url(#grain-static); }`—`all` includes `filter`,
  `background`, `color`. Hover swaps the filter to `url(#wobble-celestial)`; a `url()`→`url()`
  filter-list pair isn't interpolable so that term flips discretely at 50%, but `background` and
  `color` *do* tween, and each of their ~9 frames repaints a filtered button—**9 reference-filter
  re-executions per hover edge, per button, 8–9 buttons in the row.** Sweep the pointer across the
  control row and that's a burst of turbulence passes on WebKit's CPU path. This is a first-order
  desktop interaction-jank source and it matches the owner's verdict exactly.
- `.ctrl-btn` (`OptionSelector.vue:33`)—Tailwind `transition-all duration-150`, same shape,
  `:hover { filter: url(#wobble-heart) }`.
- `.sparkle-icon { transition: all 200ms; filter: drop-shadow(...) }`—a built-in, interpolable,
  compositor-friendly filter. Benign; leave it.

**The cure is zero-soul:** narrow the property lists. `transition: background-color 150ms, color
150ms` on `.icon-btn` and the equivalent on `.ctrl-btn`. Nothing moves that moved before; `filter`
stops participating; the hover swap becomes one raster per edge instead of nine.

---

## 4. Free wins—no design cost, no measurement needed

These are oversights and dead work, not trade-offs. Each is source-proved above or below.

**4.1 The reveal fill-mode + class drop** (§3.1). Two edits, zero pixels, kills 35–81 retained
filling transform animations.

**4.2 The glyph hover wiggle is missing its grain-hoist.** `HandwrittenGlyph.setupReveal`'s
draw-in drops `grainOn` for its window (`:220`) and restores on completion; `murmurWiggleOnce`
does the same (`:201`) with an explicit comment that every `d` swap on a grain-filtered path
forces a per-frame filter re-raster. The **hover watcher (`:266`) does neither**—it calls
`createGlyphWiggle`, which swaps `d` per frame via `createBoilTicker`, with the filter ON. Hover a
cell and you get a 600 ms wiggle at the boil cadence with a live `feTurbulence` re-raster per
frame. Same bug class the estate already fixed twice; the third site was missed. One-line cure:
`grainOn.value = false` on hover-in, `true` on hover-out and on stop.

**4.3 ScribbleLoader animates a filtered path at 60 fps.** `animation: scribble-cycle 1000ms
linear infinite` writes `stroke-dashoffset` every frame on a `<path filter="url(#grain-static)">`.
That's 60 reference-filter re-executions per second for as long as the solve runs—the loader is
literally the thing on screen while the user waits, so it's the worst possible place for it. Cure:
the same hoist—drop the filter for the loader's life (the scribble is 2.2px stroke at 24px, the
grain tooth is sub-perceptual there), or move the grain into the path geometry via the
`gridPaths §Grain bake` precedent.

**4.4 The progress-pose stack flips when it's invisible.** `HandDrawnGrid`'s `.progress-pose`
`v-for` is **never gated**: it renders and flips 8/s regardless of `progress`. At `progress === 0`
the dash offset is 1000—the path draws nothing, and four invisible `<g>`s trade opacity forever.
Same after `.solve-success` hides `.progress-trace` (`index.css:501`). Cure: `v-if="progress > 0
&& !solveSuccess"`. On a fresh board this deletes a per-beat repaint of the whole board box for
zero visible ink.

**4.5 `.section-heading:hover` re-runs the 3-pass panel filter.** The heading lives inside
`.control-panel-filtered`, so its hover filter swap changes the panel filter's input →
`#stroke-light`'s three 4-octave turbulence passes, three displacement maps and two blends
re-execute over the whole panel, twice per hover round-trip. Cure options in ascending soul cost:
drop the heading's hover wobble (it's a decorative flourish on a non-interactive `<h2>`); or move
the heading out of the filtered wrapper; or §5.D3.

**4.6 The Apple DPR cap is grid-only, and the logo is the sharpness-sensitive one.**
`HandDrawnGrid.vue:187` caps the bake at DPR2 on `navigator.vendor === 'Apple Computer, Inc.'`,
licensed by a measured SSIM 0.9888 ≥ 0.98 floor, with the comment explicitly declining to cap the
logo (Fraunces text, untested) and the toggle (small). On an iPhone at DPR3 that leaves the logo
baking at 1068×213×4 poses ≈ 3.6 MB and the toggle at 240²×4×2 ≈ 1.8 MB uncapped, while the grid —
the big one—is capped. The asymmetry isn't wrong, it's *unmeasured*: nobody has run the logo's
SSIM at a cap. Hand it to the soul-gate lane as a cheap ~1.8 MB iOS residency win.

---

## 5. The candidates

### A—THE ENGINE CAPABILITY PROFILE (library)

**Mechanism.** `fb15253d` put `navigator.vendor === 'Apple Computer, Inc.'` in a component. That
tell is now needed by at least six surfaces, and each will re-derive it, differently, with its own
comment. Lift it into pencil-boil as a named profile every beat surface consumes, and generalize
the freeze into the library's existing frame-count vocabulary:
`profiledFrameCount(() => n, requirement)` sits beside `heldFrameCount` and collapses to 1 when
the live engine can't satisfy the requirement. The `frameCount ≤ 1` freeze-in-place contract does
the rest—no new mechanism, and the golden lanes get an override seam so a soul-gate A/B can pin
either profile.

**Predicted win, tied to mechanism.** By itself: modest. It doesn't remove work—it makes
removing work declarative. Its value is that B, C and every future surface gate on ONE tell
instead of six copies, and that the estate stops shipping engine sniffs inside components.

**Soul cost.** None on its own. It's the vehicle by which other candidates' soul costs become
engine-scoped instead of universal—which is the estate's stated preference in reverse (`s3` §#2
rejected engine gating in favour of unify). That rejection was correct *for the bake*, because the
bake is strictly better in both engines. It is not correct for a freeze, which is strictly worse
in one—so a freeze must be gated, and gating needs a profile.

**Effort.** Small: ~80 LOC library + one new export + four call sites (divider, outline, progress,
tally). No behaviour change on Chromium/Firefox by construction.

**Home.** pencil-boil. `src/engine.ts`, re-exported from `index.ts`.

### B—THE HTML-BOX POSE HOIST (library + app)

**Mechanism.** The bake removed the filter; it left the flip inside the SVG, where WebKit earns no
layer (§1). Move every baked stack out of the `<svg>` into absolutely-positioned HTML `<img>`
siblings—the shape `DarkModeToggle` already ships (`.rest-pose` as `<img>`) and `HandDrawnGrid`
/ `HandwrittenLogo` do not (`<image>` inside SVG). An HTML box with `will-change: opacity` does
get a compositor layer in WebKit; that's the whole difference between a repaint of the board box
and an opacity blend of two promoted textures.

Fold in the duplication while you're there: the `ImageBitmap` → object-URL → atomic-swap →
revoke dance is hand-rolled **three times** (`HandDrawnGrid.vue:201-233`,
`HandwrittenLogo.vue:180-200`, `DarkModeToggle.vue:555-592`), each with its own monotonic token
and its own `onUnmounted` revoke. That's three copies of a lifecycle with three chances to leak.
It belongs in `useRasterStack` as a `urls` member (§7).

Extend to the surfaces that were never baked: `.progress-pose`, `HandDrawnOutline`, `.dt-pose` are
**filterless** vector poses, so their bake is the trivial case—`serializePoseSvg` with no
`defs`, exact by construction, no SSIM question to answer. The outline is the prize: 3–4 instances
at ~2.09 Mpx dirty each on iPhone, the largest remaining per-beat area on the page.

The progress trace is the awkward one and needs its own ruling: its `stroke-dashoffset` is a live
value (board fill %), so a bitmap would need a re-bake per fill event. Recommendation for it
specifically—**stop boiling it.** Hold pose 0 and let the dash front carry the motion. What the
eye tracks on that gauge is the advancing violet front, not a 0.45-unit shiver under it; and
`.solve-success` hides the trace anyway at the moment it matters most.

**Predicted win.** Per-beat cost for grid + logo goes from *repaint the board box / the wordmark
box* to *blend two promoted textures*. On the estate's own attribution arithmetic—grid is the
dominant surface, and the flip is what recurs—this is the difference between an 8 Hz CPU repaint
of ~0.46 Mpx (iPhone, capped) and nothing at all. For the outlines it removes ~2 Mpx × 3
instances × 8/s of vector repaint.

**Soul cost.** Zero for grid/logo/outline/tally—same pixels, same poses, same cadence, only the
element type changes. Small and named for the progress trace: the violet gauge stops shivering.
Precedent for that exact concession is shipped and soul-gated twice over—the divider is frozen
on Apple (`fb15253d`), every gallery flank is frozen at pose 0 (`GameGallery` soul gate).

**Effort.** Medium. Library: fold `urls` + `PoseLayer` into `useRasterStack` (~120 LOC). App: four
surfaces re-templated, each losing hand-rolled lifecycle code—net LOC likely negative. Goldens
move (element types change, pixels don't), so every affected surface needs a re-mint against the
runner artifact per the golden discipline.

**Gate.** B rests on a hypothesis nobody has measured: *that the in-SVG flip still costs after the
filter is gone.* The discriminating experiment is one line and belongs to L1/L2 before a line of B
is written (§8, E2).

### C—THE BEAT GOVERNOR (library)

**Mechanism.** The cheapest cure for every per-beat writer at once, including the ones nobody has
baked, is to stop beating when nobody's watching. And the mechanism already exists: the boil-hold
gate. `acquireHold('idle')` collapses every `heldFrameCount`-wrapped count to 1; the `total ≤ 1`
path freezes each surface **in place**, no snap to pose 0; `releaseHold('idle')` resumes
mid-cadence with `lastTick = 0`. The governor is a timer and a set of passive listeners:
`pointermove` / `keydown` / `scroll` / `focusin` / `visibilitychange` release; N seconds of
silence re-acquire; any live `sequence` subscriber (draw-in, celebration, glide, chime) holds the
window open.

One correction to make it actually total: today only `HandDrawnGrid` and `BoilDivider` wrap their
counts in `heldFrameCount`. The outline, tally, logo, toggle and gallery don't—so the laminate
hold already doesn't freeze them. Wrapping all of them is the same edit the governor needs, and it
fixes a latent hold-gate gap on the way through.

**Predicted win.** Total, at idle, on every surface, in every engine: zero per-beat writes, zero
repaints, zero flips. The scheduler already parks between beats; the governor parks the *motion*.
It's the only candidate that bounds the surfaces this study hasn't itemized and the ones the next
wave adds.

**Soul cost—the real question, and the estate has already half-answered it.** The page settles.
Leave it alone and the drawing goes still; touch anything and it breathes again. `boilBeat.ts`'s
own header names the value: *"the settled page learns to idle"* (T3-W12 §2 P1)—the estate
already ruled that settling is a virtue, and implemented it one layer down, as the *scheduler*
sleeping between beats. The governor extends that same sentence one clause further: the page
sleeps between *interactions*. There's a craft argument it's an improvement, not a concession—a
pencil drawing on a desk doesn't shiver when nobody's looking at it. There's an equally honest
counter-argument that the ambient boil IS the product's signature and a still page is a dead one.
**That's an owner call, not a lane call.** What L3 recommends is that it be built behind the
profile (Apple engines park, Chromium doesn't) with `idleParkMs` as the single auditioned number.

**Effort.** Tiny—the smallest cure here by a wide margin. ~60 LOC library, one `install` call in
`App.vue`, plus wrapping the five unwrapped frame counts. Trivially reversible.

**Risk.** Screenshot goldens of a boiling surface must not race the park. Mitigations, both cheap:
arm `idleParkMs` from the FIRST interaction rather than from load (so a cold-load golden never
parks), and expose the override so e2e pins the governor off.

### D—FLATTEN THE CSS REFERENCE FILTERS ON HTML (app)

Four sub-moves, ascending in soul cost. D1/D2 are §4 free wins restated as a coherent move; D3/D4
are decisions.

**D1—narrow the transitions** (§3.2). Zero soul. `filter` stops participating in `.icon-btn` /
`.ctrl-btn` hovers; nine reference-filter re-executions per hover edge become one.

**D2—un-nest the heading hover from the panel filter** (§4.5). Zero-to-trivial soul. Stops a
3-pass, 4-octave turbulence chain re-executing over a ~320×700 CSS panel twice per heading hover.

**D3—retire `.control-panel-filtered`'s reference filter.** This is the single most expensive
filter on the page and it's on an HTML box, i.e. WebKit's CPU path. What it buys is a roughened
edge on the panel's headings, dividers and selector borders. Note that the panel's *frame*
roughening is already handled without a filter—`HandDrawnOutline` bakes the grain into geometry
at SSIM 0.996/0.993—so what remains is text and control borders. **L3 declines to pre-decide
this.** It's a genuine pixel change on the app's second-most-looked-at surface, and the honest move
is to build the A/B (panel filter on/off, side by side, real Safari + a device) and let the owner
rule with the fps delta in hand. Recommended as an *experiment to commission*, not a cure to ship.

**D4—the 81 glyph filters.** Two sub-moves. **D4a** is the §4.2 hover-hoist bug—ship it. **D4b**
is the structural one: bake the glyph grain into the path geometry, the `gridPaths §Grain bake`
precedent applied to `glyphPaths`. Glyph paths are static per variant, so the bake is a build-time
resample, and it would take the page from 81 live reference filters to **zero**. It needs its own
soul gate: the outline's comparable stroke work scored 0.993–0.996, and the divider *failed* at
0.809—but the divider failed because it's a single thin line where two noise realizations can't
correlate window-wise, and a glyph is a short thick multi-stroke run, structurally much closer to
the outline. Worth a gate lane; a pass here is the biggest single reduction in resident filter
count available anywhere in the estate.

**Predicted win.** D1+D2+D4a: interaction jank on desktop, which is half the owner's verdict, at
zero design cost. D3: the largest single idle-and-repaint filter on the page, at a pixel cost only
the owner can price. D4b: −81 filter regions, gated on SSIM.

**Effort.** D1/D2/D4a: hours. D3: the A/B is a day; the cure, if ruled, is a design task. D4b: a
soul-gate lane plus a `glyphPaths` bake—comparable to T3-W13 §1-P2.

**Home.** App, entirely. D4b's resampler is arguably library (`path.ts` already owns the grain
bake vocabulary).

### E—THE ACCELERATED BEAT (library)—booked, not built

**Mechanism.** Once the pose stacks are HTML boxes (B), the flip need not touch the main thread at
all. Drive each layer with a WAAPI `opacity` animation: `iterations: Infinity`, `steps(n)` easing,
duration `beatMs × poseCount × stepEveryBeats`, per-layer negative offset—and every animation's
`startTime` pinned to one module-level beat origin, so the T3-W12 phase-coalescence invariant
holds *by construction* instead of by landing writes in a shared rAF. `useFlipGlide` already
proves the estate can pin `startTime` across movers. PRM / visibility / hold call `pause()`.

**Predicted win.** The strongest possible version of "the flip is free": zero per-beat main-thread
work, zero Vue patches, the opacity animation accelerated in both engines. The 8 Hz beat driver
itself would serve only genuinely-vector surfaces, and if B+E covers all of them, the shared
ticker retires from the steady state entirely.

**Risk—why it's booked and not recommended.** WebKit de-accelerates an opacity animation on an
element it can't layerize, so E is strictly downstream of B. And ~4 poses × ~6 surfaces = ~24
resident accelerated animations means ~24 permanently promoted layers at board and wordmark size,
which on an iPhone could blow the tile budget *worse* than today's shape—the same failure mode
§3.1 hypothesizes for the retained reveal animations. E needs a residency budget before it needs
code.

---

## 6. Recommendation

**Sequenced by (win × certainty) / effort. Nothing here needs a design ruling until step 4.**

1. **Ship the free wins now**—§4.1 (reveal fill-mode + class drop), §4.2 (glyph hover
   grain-hoist), §4.3 (loader filter), §4.4 (progress stack gating), §4.5 + §3.2 (heading hover,
   transition narrowing = D1/D2). Zero pixels, zero design cost, all source-proved. This is
   the whole of the desktop interaction-jank story that source can see, and it's a day's work.

2. **Land the engine profile (A)** and wrap the five unwrapped frame counts in `heldFrameCount`.
   No behaviour change; it's the vehicle for 3 and it closes a latent hold-gate gap.

3. **Build the governor (C)**, profile-gated, `idleParkMs` auditioned by the owner. Smallest cure,
   broadest coverage, rides a shipped and soul-gated mechanism, trivially reversible. It bounds
   every per-beat writer this study found and every one it didn't. Its soul cost is the one thing
   in this document the owner must actually weigh—and `boilBeat.ts`'s own "the settled page
   learns to idle" is the estate's own precedent for weighing it favourably.

4. **Measure before building B.** Run E2 (§8). If the in-SVG flip still costs with the filter
   gone, B is the structural cure and the outlines are its first target. If it doesn't, B is dead
   and C is the whole answer—which would be a fine outcome.

5. **Commission the two auditions**: D3's panel-filter A/B and D4b's glyph-grain soul gate. Both
   are genuine design decisions with real wins behind them; neither should be decided by a
   research lane.

6. **E stays booked.** Revisit only after B lands and with an iOS layer-residency budget in hand.

---

## 7. The pencil-boil API sketch

In the library's own voice—`use*` for the Vue-facing composables, `create*` for imperative
handles, framework-agnostic cores with no `vue` import, one gate more on the same scheduler and
never a second chain.

### 7.1 `src/engine.ts`—the capability profile (new)

```ts
/**
 * Engine capability profile—what the live renderer can actually make cheap.
 *
 * The boil's whole economy rests on one assumption: that flipping which of N frozen poses is
 * opaque is a compositor-stage change. That assumption is TRUE in Blink/Gecko and FALSE in
 * WebKit, which paints SVG content unlayered—`will-change: opacity` on an inner <g> earns no
 * layer there, so the flip repaints, and a flip of a FILTER-BOUND pose re-executes the whole
 * feTurbulence chain (the measured collapse: ~10 fps steady state on desktop Safari, 98 fps with
 * the surface pinned).
 *
 * A capability is not a browser. Each field names one thing a beat surface needs to be cheap, so
 * a consumer asks for the capability it depends on and never for a vendor string. The detection
 * is deliberately a single conservative tell—every iOS browser is WebKit, so `navigator.vendor`
 * is the honest signal, and it lives HERE, once, instead of in six components.
 */
export interface EngineProfile {
  /** An opacity flip between sibling poses INSIDE an <svg> composites (vs repaints). */
  readonly layersSvgInteriors: boolean;
  /** A resident reference filter's raster survives an opacity flip without re-executing. */
  readonly cachesFilterRaster: boolean;
  /** A CSS `filter: url(#…)` on an HTML box takes a GPU path (vs the CPU path). */
  readonly gpuReferenceFilters: boolean;
  /** Ceiling on a bake's capture ratio, whatever `devicePixelRatio` reports. */
  readonly maxBakeDpr: number;
  /** Soft ceiling on total resident baked-bitmap bytes—the iOS tile budget. */
  readonly rasterBudgetBytes: number;
}

/** The live profile. Cheap, memoized, safe off-DOM (returns the permissive profile). */
export function engineProfile(): EngineProfile;

/** Reactive form, for a consumer that gates a `computed` on a capability. */
export function useEngineProfile(): Readonly<Ref<EngineProfile>>;

/**
 * Force a profile, or clear the forcing. THE GOLDEN SEAM: a soul-gate A/B must be able to render
 * both paths in one browser, and an e2e must be able to pin the permissive profile so a capture
 * isn't engine-dependent. Never called in product code.
 */
export function setEngineProfile(patch: Partial<EngineProfile> | null): void;

/** What a beat surface depends on, named. */
export type BoilCapability = 'poseFlip' | 'liveFilterFlip' | 'htmlReferenceFilter';

/**
 * Wrap a frame-count getter so it collapses to 1—the static-frame freeze—when the live
 * profile can't make `need` cheap. The sibling of `heldFrameCount`, same contract: the scheduler
 * withdraws a subscriber whose count drops to <= 1, `stop()` leaves the frame ref untouched, so
 * the surface freezes IN PLACE and resumes mid-cadence if the profile is later forced open.
 * Composes: `profiledFrameCount(heldFrameCount(() => n), 'liveFilterFlip')`.
 */
export function profiledFrameCount(base: () => number, need: BoilCapability): () => number;
```

`BoilDivider`'s `LIVE_FILTER_FROZEN` local becomes
`profiledFrameCount(heldFrameCount(() => BOIL_CONFIG.frameCount), 'liveFilterFlip')`, and the
vendor string leaves the app.

### 7.2 `src/vue.ts`—`useRasterStack` grows the URL lifecycle

`RasterStackHandle` gains `urls`, and the object-URL discipline the app hand-rolls three times
moves into the library:

```ts
export interface RasterStackHandle {
  bitmaps: Readonly<Ref<ImageBitmap[] | null>>;
  /**
   * The pose stack as object URLs—the DURABLE render artifact (the <img>/<image> decode is the
   * single resident raster the compositor draws; the ImageBitmap is the redundant copy, closed
   * once its URL exists). Encoded off the main thread via OffscreenCanvas.convertToBlob.
   *
   * ATOMIC SWAP, kept: the urls are RETAINED while `bitmaps` is null (a re-bake in flight), so a
   * theme flip or a resize never drops the surface back to its live-filter fallback mid-gesture.
   * One assignment swaps the stack; the previous urls revoke on the next frame. A monotonic token
   * drops a conversion superseded by a newer bake. Revoked on unmount.
   *
   * `resetUrls()` is the STRUCTURAL escape hatch: a geometry change (board size) makes the old
   * pixels wrong rather than merely stale, so the consumer drops them and shows its frozen-pose
   * fallback until the re-bake lands.
   */
  urls: Readonly<Ref<string[]>>;
  resetUrls: () => void;
  ready: Readonly<Ref<boolean>>;
  pose: Readonly<Ref<number>>;
  rebake: () => void;
}
```

and `RasterStackOptions` learns the profile:

```ts
export interface RasterStackOptions {
  cacheKey: string;
  poseCount: number;
  poseSvg: (pose: number) => string;
  cssSize: { width: number; height: number };
  /** Capture ratio. Defaults to `min(devicePixelRatio, engineProfile().maxBakeDpr)`—the T4-WM
   *  grid cap, generalized, so a surface opts OUT of the cap rather than re-deriving it. */
  dpr?: number;
}
```

### 7.3 `src/poseLayers.ts`—the HTML-box renderer (new, candidate B)

```ts
/**
 * Pose layers as HTML boxes—the WebKit flip cure.
 *
 * A baked stack rendered as <image> siblings INSIDE an <svg> still repaints on every flip in
 * WebKit (SVG interiors are unlayered—see `engine.ts`). Rendered as absolutely-positioned HTML
 * <img> siblings with `will-change: opacity`, each pose earns a real compositor layer and the
 * flip is an opacity blend in both engines. This is the shape the dark-mode toggle already ships;
 * it is the shape every baked stack wants.
 *
 * Emits attribute bags rather than DOM: the consumer keeps its own template (a11y attributes,
 * print rules, the during-bake fallback), and the library owns only the layer contract.
 */
export interface PoseLayer {
  readonly src: string;
  readonly active: boolean;
  readonly style: Readonly<Record<string, string>>;
}

export function usePoseLayers(
  stack: RasterStackHandle,
  opts?: {
    /** Extra style folded into every layer (object-fit, transform-origin, …). */
    style?: MaybeRefOrGetter<Record<string, string>>;
    /** Pin every layer to pose 0—the during-bake / frozen-profile path. */
    frozen?: MaybeRefOrGetter<boolean>;
  },
): { layers: Readonly<Ref<PoseLayer[]>>; baked: Readonly<Ref<boolean>> };
```

### 7.4 `src/governor.ts`—the beat governor (new, candidate C)

```ts
/**
 * The beat governor—the settled page learns to idle, one clause further.
 *
 * `boilBeat`'s scheduler already sleeps BETWEEN beats. The governor sleeps between
 * INTERACTIONS: after `idleParkMs` of silence it takes the boil-hold gate's 'idle' hold, every
 * `heldFrameCount`-wrapped surface freezes in place (no snap to pose 0), and the page becomes a
 * still drawing. Any wake signal releases the hold and the boil resumes mid-cadence.
 *
 * NO NEW MECHANISM: it acquires and releases the shipped hold the answer-key laminate uses, so
 * the freeze semantics are already soul-gated. NO NEW CHAIN: it owns one timer and a set of
 * passive listeners, never a subscriber.
 *
 * An active `sequence` subscriber holds the window open by construction—a draw-in, a
 * celebration crest or a glide is an interaction in flight, so the page can't settle under it.
 */
export interface BeatGovernorOptions {
  /** Silence before the park. Armed from the FIRST wake, never from load—a cold-load capture
   *  must never race the park. */
  idleParkMs: number;
  /** Which engines govern. Default: those whose profile can't make a pose flip cheap. */
  governs?: (p: EngineProfile) => boolean;
  /** Wake signals. Default: pointerdown, pointermove (throttled), keydown, wheel, scroll,
   *  focusin, visibilitychange→visible. All passive. */
  wake?: readonly BeatWakeSignal[];
}

export type BeatWakeSignal =
  | 'pointer' | 'key' | 'wheel' | 'scroll' | 'focus' | 'visibility';

export interface BeatGovernor {
  /** Release the idle hold and re-arm the park timer. Idempotent. */
  wake: () => void;
  /** Take the idle hold now—the surfaces freeze in place. Idempotent. */
  park: () => void;
  /** True while parked (for instrumentation and the e2e assertions). */
  readonly parked: Readonly<Ref<boolean>>;
  dispose: () => void;
}

export function installBeatGovernor(opts: BeatGovernorOptions): BeatGovernor;
```

`schedulerDebugInfo()` gains `governed: boolean` and `parkedByGovernor: boolean` so the perf rig
can tell an idle-parked page from a between-beats-parked one.

---

## 8. What L3 could not settle—the experiments to commission

Each is a one-line intervention against the live build on **real Safari**, desktop and (when the
iOS runtime lands) device. L3 is source-only; these are the numbers that decide between the
candidates.

- **E1—the retained reveal animations.** On a solved 9×9 in real Safari: read
  `document.getAnimations()` and confirm the playStates are `finished`, not `running` (adjudicates
  §3.1's label). Then `animation-fill-mode: backwards` via devtools and re-measure interaction fps
  and—the real question—whether WebKit's layer count drops. **Highest-value single test in
  this document**, because a 35–81 promoted-layer residency at DPR3 is the most plausible
  mechanism for "iOS especially" that source can point at.
- **E2—does the in-SVG flip still cost after the bake?** Pin `HandDrawnGrid`'s baked `<image>`
  stack to pose 0 (the `showBaked ? boilFrame : 0` expression already exists—force the `0`
  branch) and measure. Recovery ⇒ the flip is the cost, candidate B is the structural cure, and
  the outlines are its first target. No recovery ⇒ B is dead and C is the whole answer.
- **E3—the outline tax.** Hide `.outline-svg` on the three board-scene instances and measure.
  Source says they're the largest remaining per-beat dirty area on the page (~2.09 Mpx each,
  iPhone DPR3) and nobody has ever isolated them.
- **E4—the panel filter.** `.control-panel-filtered { filter: none }` and measure, idle and
  under a hover sweep of the control row. This is the fps number the owner needs to price D3.
- **E5—hover-sweep jank.** Sweep the pointer across the icon-btn row with and without the §3.2
  transition narrowing. Quantifies the desktop-interaction half of the owner's verdict.
- **E6—the glyph filter population.** `.glyph-svg path { filter: none }` on a solved 9×9 and
  measure. Sizes D4b's prize before anybody builds a resampler.
- **E7—layer + residency census on device.** WebKit layer count and backing-store bytes on an
  iPhone, board scene, before and after E1. Feeds E's residency budget and adjudicates §4.6's
  uncapped logo/toggle bakes.

---

## Ledger

- **Read in full:** `pencil-boil/src/{index,vue,raster,frames,boilHoldGate}.ts` (0.9.2);
  `web/frontend/src/pencil/composables/{boilBeat,rasterPose,celebration}.ts`;
  `src/pencil/config/pencilConfig.ts`; `src/pencil/chrome/{SvgFilters,BoilDivider}.vue`;
  `src/pencil/chrome/HandwrittenLogo/HandwrittenLogo.vue`;
  `src/pencil/grid/HandDrawnGrid/HandDrawnGrid.vue`; `src/pencil/grid/HandDrawnOutline.vue`;
  `src/pencil/celestial/DarkModeToggle.vue`; `src/pencil/glyph/HandwrittenGlyph.vue`;
  `src/games/shared/{DifficultyTally,gameCell.css,useFlipGlide.ts}`; `src/assets/index.css`
  (animation + utility layers); `GameControlPanel.vue` (filter + hover CSS);
  `GameGallery.vue` / `PosterBoard.vue` / `ScribbleLoader.vue` (filter + beat sites);
  `useGameState.ts` / `GameBoard.vue` (the `animatingCells` chain).
- **Cited, not re-derived:** `evidence/safari/{s1,s2,s3,crit-safari}.md`, T3-W13 `b1` painter
  inventory, T4-WM ranks 1–4, `fb15253d`.
- **Not done here (out of lane):** no code changed, no commit, no measurement, no browser opened.
