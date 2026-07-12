# b4-drawer-smoothing — Finding 2: the drawer, "not right AT ALL"

Lane: DESIGN (Fable + frontend-design skill). Live-driven at :3001, 1440×900 (~98Hz display),
rAF frame traces both directions + a DevTools perf trace of a double toggle
(`drawer-toggle.json`, this directory). All rects CSS px. Repo read-only; page state restored
(drawer open, `csp-drawer-open=1`).

## Verdict

The glide engine's math is sound and the pipeline is clean — zero dropped frames (max rAF gap
12.2ms at ~10.2ms cadence). What's wrong is choreography, and one outright defect: **the case
(controls rail) starts every glide from the WRONG layout's pose — a one-frame ~249px vertical
teleport, then a 480ms diagonal slosh** — while the board glides correctly beside it on a
different easing family. Two loose parts, one of them lurching. That's the whole "not right
AT ALL".

## Frame-trace evidence

### F1 — the rail's phantom start (the killer defect)

**Close (open→closed).** Intended rail motion from rect math: `translate(-211.5px, +2.8px)` —
a flat lateral tuck under the sheet. Traced computed transform:

| t (ms) | rail computed | painted top (px) |
|---|---|---|
| 4.4 | `matrix(1,0,0,1, 0, -248.895)` | **11.4** |
| 23.3 | `(−11.6, −235.1)` | 25.3 |
| 167.4 | `(−144.2, −77.2)` | 183.1 |
| 494.2 | `(−211.5, +2.8)` | 263.1 |

−248.895 is exactly −50% of the rail's 497.79px height — the CLOSED layout's parked pose
(`scene.css:50-56`, `transform: translateY(-50%)`). The case teleports UP half its height
(painted top 11.4px — up in the masthead zone, above the board's top edge at 134), then glides
down-left for 480ms into the tuck. Its in-flow rest never moves more than 2.8px vertically;
it travels ~251px.

**Open (closed→open).** Mirror image: computed starts at `matrix(1,0,0,1,0,0)` — identity, when
the committed start should be the parked (0, −248.9) — and glides to `(211.5, −251.7)`. Painted:
the case pops in 249px BELOW its parked spot and swims up-right.

**Mechanism** (`useControlsDrawer.ts:180-190` × `scene.css:50-71`): the measure flip is
paint-invisible but not *recalc*-invisible. Three style recalcs land in the click task:

1. Recalc A — rect reads at `:181-183` with the TARGET layout applied: the rail's computed
   transform is the target layout's pose (parked −50%, or none).
2. Recalc B — `void host.offsetWidth` (`:190`) with the origin layout restored AND
   `drawer-gesturing` now arming `transition: transform` on the rail (`scene.css:67-71`).
   The rail's computed transform changes A→B **while the transition property is active** —
   an unintended transition starts between the two layouts' poses.
3. The mover's inline transform (`:202-207`) then retargets that in-flight transition, and
   Chrome retargets **from the current animated value** — ≈ the wrong end, 0% progressed.

Host and masthead are immune (no CSS rest transform in either layout — App.vue:298-312 moves
the masthead by flex alignment, the transform is inline-only). The tab is immune (both recalc
endpoints are correct poses, DrawerTab.vue:76-79). Only the rail expresses its rest pose AS a
transitionable transform — only the rail sloshes. The `useControlsDrawer.ts:19-21` doc claim
("two forced layouts, ZERO paints — reverted synchronously before any frame renders") is true
of paints and false of transition bases.

### F2 — easing family split: two loose parts

Board + masthead ride the spring `cubic-bezier(0.34, 1.56, 0.64, 1)` (`scene.css:63`,
`App.vue:310`); the rail rides easeOutCubic `cubic-bezier(0.33, 1, 0.68, 1)` (`scene.css:68`).
Traced host tx on close: 171.5 target, **peak 186.5 at t≈330 (+8.7% overshoot), doubling back**
while the case still travels monotonically. The sheet slides PAST the tuck line and retracts —
sheet/case relative motion reverses direction mid-gesture. The "case tucks under the sheet"
fiction requires the two to read as one stacked solid; a mid-gesture relative reversal on
different curves reads as two unrelated objects.

### F3 — onset dead zone

Both traces: frames 1–2 fully static (host AND rail at start pose through t≈15ms); first motion
at t≈23ms. The perf trace shows why: four RunTasks of 29.6–37.1ms (two toggles' click tasks +
settles), each click task containing TWO forced layouts (Layout ~10.1/10.3ms) plus
UpdateLayoutTree up to 13.8ms — the double measure flip burns 3+ frames of budget at 98Hz
before anything paints motion. At 60Hz on a lesser machine that's a visible hesitation between
click and glide.

### F4 — scale-blur during glide, sharpness pop at settle

The glide scales a pre-glide raster (paper texture, pencil strokes, digits) — 1.0216 at this
viewport (board 740→756), with the transform cleared and the true layout landing in one frame
at settle (`useControlsDrawer.ts:231-250`). The board runs soft for 480ms and snaps crisp.
Raster cost itself is trivial here (Paint ≤1.71ms, RasterTask ≤3.48ms) — the pop is perceptual,
not jank.

### F5 — verified sound (keep)

- FLIP math: class-flip measurement from true-open equals true-closed rects exactly
  (`flipClosedFromOpen ≡ settledClosed`, probed) — inline targets match rect deltas
  (tx 171.49, scale 1.0216). No flip/settle mismatch.
- Frame cadence: no dropped frames anywhere in the glide, settle included.
- Tab counter-scale: product of host×tab scale stays within 0.2% of 1 across the curve —
  imperceptible; keep as-is.
- PRM same-frame swap, a11y contract (aria-expanded at click, focus choreography, inert at
  closed-idle): untouched by this spec.

## The corrected choreography (W13 spec)

Principle: **one coupled system, one clock, one easing family — and the case's rest pose out of
the transition machinery's reach.** The paper fiction is kept whole: the sheet grows and slides
onto the page's axis; the case tucks flat beneath it; nothing ever moves vertically but the
sheet's own 2.8px drift.

### S1 — movers on WAAPI, not CSS transitions (kills F1 structurally)

Replace the `drawer-gesturing` transition-arming with `element.animate()` per mover: explicit
`[from, to]` keyframes measured from rects, `composite: 'replace'`, `fill: 'none'`. Explicit
keyframes have no "previous committed style" — the phantom class of bug (any intermediate recalc
becoming a transition base) is structurally unreachable, not merely dodged. `scene.css` keeps
only the gesture-scoped `will-change: transform` (or drop it — WAAPI transform animations
promote implicitly) and the `visibility: visible` override for the traveling case.

Belt-and-suspenders: express the parked pose on the `translate` property instead of `transform`
(`scene.css:54` → `translate: 0 -50%`). The rest pose then lives on a channel no mover ever
animates; even a future regression back to transitions can't capture it.

### S2 — classic FLIP, not inverted FLIP (kills F3 half, F4 whole)

Invert the W12 inversion: flip the layout class ONCE at gesture onset (true layout lands
immediately), measure last rects, then animate each mover FROM the inverted old-pose delta TO
identity. Consequences, each an improvement:

- **One forced layout per gesture instead of two** (first rects read pre-flip in the same task)
  — the 29–37ms click task shrinks by a ~10ms Layout + ~13.8ms UpdateLayoutTree; onset lands a
  frame earlier.
- **The settle frame does nothing** but clear finished animations — no layout step, no
  re-raster, no snap of any kind at rest. The settle-pop (F4) disappears by construction.
- **Crisp at rest, both directions**: the board rasters at its FINAL size at onset. On close it
  glides scaled 0.978→1 over a raster already crisp at 756 (never soft); on open it starts
  1.022 over the 740 raster — a 2% soft onset relaxing to exact — the eye forgives a soft
  attack, never a soft landing.
- The W12 crit kill is preserved: the filtered board's SIZE is still never tweened — exactly
  one layout and one re-raster per gesture, now at onset instead of settle.

Sequencing notes: `drawer-closed` landing at onset on close makes the parked rail
`visibility: hidden` immediately — the gesture-scoped visibility override must persist for the
glide's duration (as today, `scene.css:70`). Focus and `drawerInert` timing unchanged (phase
stays non-idle until animations finish).

### S3 — one easing family (kills F2)

Both movers + masthead + tab counter-scale on the SAME curve, same 480ms, zero stagger — the
spring `cubic-bezier(0.34, 1.56, 0.64, 1)` stays (Band-D user-triggered one-shot, the tranche's
physical flourish; W12 §6 vocabulary). The case may share the overshoot because its geometry
absorbs it: overshoot is ~8.7% of delta — case delta ~211px → ~18px excursion past the tuck,
against ~130px of cover under the sheet's edge (board right edge 918.5 vs parked case left 763)
— the case never peeks out the far side. With identical normalized progress on both movers,
sheet/case relative motion is monotone: they read as one solid that breathes once and settles.

### S4 — retarget by reversal

Re-click mid-glide: `anim.reverse()` on each mover (today's `retarget()`,
`useControlsDrawer.ts:254-264`, leans on the same transition-retargeting that produced F1).
Reversal preserves current pose and gives velocity-plausible motion on the same curve; the
settle handler keys off `Promise.allSettled(movers.map(a => a.finished))` with the existing
`SETTLE_GUARD_MS` timeout kept as the never-never backstop. Layout note under classic FLIP:
reversal must also re-flip the layout class at the reversed settle — the phase machine already
tracks `targetOpen`; `applyLayout(targetOpen)` at settle stays the one truth.

### Acceptance criteria (frame-trace testable, this lane's probes rerunnable verbatim)

1. **No teleport**: computed-transform discontinuity between consecutive frames ≤2px at every
   point of the gesture (today: ~249px at frame 1). On close at 1440×900 the case's painted top
   never leaves [255, 268]px (today: reaches 11.4px).
2. **One solid**: board and case normalized transform progress curves match within 1% at every
   sampled frame (same easing, same clock).
3. **One layout**: exactly one Layout >5ms per gesture in a perf trace (today: two ~10ms
   measure-flip layouts + the settle's).
4. **Crisp at rest**: the settle frame changes no layout and no raster — screenshot at
   settle+1 frame is pixel-identical to settle+30.
5. **Onset**: first painted motion within 2 frames of click at 60Hz.
6. PRM: same-frame swap, zero animations. A11y probes (aria-expanded at click, focus at settle,
   inert at closed-idle) unchanged from W12's contract.

## Files cited

- `web/frontend/src/games/shared/useControlsDrawer.ts` — :19-26 (doc claim), :161-227 (glide,
  measure flip :180-190, movers :193-220), :231-250 (settle), :254-264 (retarget)
- `web/frontend/src/games/shared/scene.css` — :50-56 (parked pose as CSS transform — the
  phantom's raw material), :62-71 (the split easing pair)
- `web/frontend/src/games/shared/DrawerTab.vue` — :76-79 (counter-scale, keep)
- `web/frontend/src/App.vue` — :292-313 (masthead half; :310 spring)
- Traces: `drawer-toggle.json` (this dir; Layout/UpdateLayoutTree/RunTask numbers),
  `b4-close-midglide.png` (8x-slowed mid-close), rAF tables inline above.
