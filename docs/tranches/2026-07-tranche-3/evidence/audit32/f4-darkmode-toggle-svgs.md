# F4 — Greenfield critique: dark-mode toggle SVGs (sun / moon / wobble-celestial)

Lane: design critique, fleet-of-one. Read-only. Method: source dissection + a faithful
local render harness (exact replicas of the pencil-boil generators, same seeds, same
filter) rasterized via headless Chrome at every rendered size the app uses. Browser
extension was unavailable; the harness reproduces the component byte-for-byte at frame 0.

Harness + renders: `scratchpad/tranche3/audit32/f4-harness/` — `harness.html`,
`harness.png` (v1 at 64/80/208px, cross-paper, 6 ray-boil frames), `harness2.png`
(v1-vs-v2 refinement strips), `zoom-*.png` crops.

## Subject inventory

| Piece | Source | Notes |
|---|---|---|
| Toggle component | `web/frontend/src/pencil/celestial/DarkModeToggle.vue` | both icons always mounted, CSS crossfade |
| Sun drawing | DarkModeToggle.vue:16–50 | rays (2 polys), disc `<circle>`, spiral path, 3 diamond sparkles, 2 dot sparkles |
| Moon drawing | DarkModeToggle.vue:61–88 | crescent path, inner detail stroke, 3 star polygons, 3 white dot stars |
| Geometry generators | `node_modules/@mkbabb/pencil-boil/src/celestial.ts` (`generateSunRays`, `wobbleDiamond`, `wobbleStarPolygon`), `random.ts` (mulberry32) | seeded, deterministic |
| Filter | `pencilConfig.ts:196–201` (`wobble-celestial`: baseFrequency 0.02, octaves 2, scale 5, animScale 0.15, intervalMs 160), instantiated at `SvgFilters.vue:93–115` | JS-driven boil, one rAF chain |
| Rendered sizes | `App.vue:268` (5rem=80px), `:276` (13rem ≥1024px), `:320` (4rem ≤480px) | 200-unit viewBox → 0.32–1.04 scale |

## Verdict up front

The drawings are good. The Yoshi's-Story sun and the storybook crescent are genuinely
charming at 13rem, the seeded boil (rays at ~2.5fps, stars/sparkles at ~8fps, filter at
160ms) sits in the same stop-motion cadence band as the grain tick — the celestial chrome
reads as one hand. PRM handling is exemplary (DarkModeToggle.vue:123–126 re-assert gate +
:252–275 CSS). The findings below are at-size legibility and three or four path-level
nicks — all slight, per the owner's mandate. No redesign warranted or proposed.

## Line weight vs the wordmark

The wordmark is Fraunces 900 filled text (HandwrittenLogo.vue:232–246) and the caret/board
glyphs stroke at 4.5–5 units in a 40-unit viewBox — 11–12.5% relative weight
(HandwrittenGlyph.vue:58–60, :264). The toggle outlines are 5/200 (sun disc) and 6/200
(moon) — 2.5–3% relative; at the 5rem rung that's 2.0–2.4px of outline against the
masthead's chunky 900-weight stems sitting a few hundred px away. The icons are
deliberately wax-crayon (fill-first, colored — consistent with the index.css:140 "paper
darkens and the wax glows" doctrine), so they shouldn't match glyph weight — but they
currently sit a full register lighter than everything else in the masthead row.

**Spec W1 (validated in harness2.png):** +1 unit on the two primary outlines — sun disc
stroke-width 5→6 (DarkModeToggle.vue:30), moon crescent 6→7 (:65). That's +0.4px at 5rem,
+1px at 13rem — closes the register gap without leaving crayon territory. Rendered
side-by-side, v2 reads noticeably more "drawn" and no heavier than the caret glyph.

## Sun — findings and specs

**S1 — the spiral reads as the letter "G" at 5rem/4rem** (zoom-sun80.png,
zoom-sun-v1v2-80.png). The sw-10 stroke fuses coil gaps (~10 units ≈ stroke width; at
80px both are 4px) and the inner start segment M100,100→C…119,106 (DarkModeToggle.vue:33)
forms a horizontal bar at center-right — the G's crossbar. At 208px it reads as a spiral.
- Spec: trim the inner terminal so it curls instead of barring — start at `M100,102`
  with a tighter first curl (`C105,93 116,96 117,107`), and end the outer coil short of
  the disc edge (`…132,78` not `138,76`); sw 10→9. Harness v2 confirms the terminal-bar
  trim is the lever; color alone doesn't fix the G-read.

**S2 — spiral contrast is 1.17:1** (#F0B030 on #F09855 fill — computed, see report
appendix command). It's the drawing's one interior idea and it's nearly tonal.
- Spec: deepen one step within the golden family, `#F0B030 → #DF9A1E` (validated in v2 —
  articulates at 80px without turning graphic). Pairs with S1.

**S3 — sparkle diamonds are invisible at rendered size.** stroke-width 1.5 → 0.6px at
5rem, 0.48px at 4rem (sub-pixel); fill #FDE68A is 1.19:1 against light paper. They
currently exist as faint smudges (zoom-sun80.png, upper corners).
- Spec: stroke 1.5→3 (DarkModeToggle.vue:39–45) and deepen the stroke `#F0B030 →
  #D99A10`; optionally +1–2 units on the wobbleDiamond radii (6,10 → 7,12 etc., :144–146).
  v2 render: sparkles become legible at 80px and read as intended twinkle-anchors at 208px.

**S4 — the disc is the only compass-drawn primitive in the celestial set** (`<circle>`
:30). The filter's long-wavelength warp (baseFrequency 0.02 ≈ 4 turbulence cells across
the icon) bends limbs but doesn't fake hand-jitter; at 13rem the disc still reads
geometric next to the baked-jitter ray polygons.
- Spec (optional, lowest priority): replace with a 4-arc lumpy circle, radii 48±1 —
  `M100,52 C126,52 148,74 148,100 C148,127 126,149 99,148 C73,147 52,126 53,99 C54,73
  74,52 100,52 Z`. Silhouette-identical at 5rem (verified), slightly more drawn at 13rem.

**S5 — the second-pass ray line muddies at 5rem.** The inner polygon (#D16A32 sw5,
inset 5 units via `outerR2 = outerR − 5`, celestial.ts:75) is a sketchy double-line at
13rem but at 80px it merges with the ray fill (1.38:1) into edge dirt.
- Spec: widen the inset in `generateSunRays` — `outerR - 5 → outerR - 8`, `innerR + 2 →
  innerR + 4` — so the second pass separates at 13rem and vanishes cleanly (instead of
  dirtying) at 5rem. One-line change in pencil-boil; ships with the next patch version.

**Ray boil: no change.** Frames 0–5 at 120px (harness.png bottom strip) show a stable
silhouette with lively 10–12% radial jitter — exactly right; 240s spin + 6s breathe are
good ambient registers.

## Moon — findings and specs

**M1 — lower horn is blunt** (zoom-moon208.png). The outer sweep ends at (155,150) and
the return starts with C120,165 — the horn terminates as a chopped wedge; banana, not
crescent, against the elegantly tapered upper horn.
- Spec (validated, zoom-moon-v1v2.png): extend the outer terminus and pull the return's
  first control inward — `C55,185 118,192 160,143 C122,162 70,145 60,95`
  (DarkModeToggle.vue:64). v2 tapers to a proper point at both 80 and 208px. This is the
  single highest-value edit in the lane.

**M2 — cracked upper tip.** At the (85,30) cusp the sw6 round-join doubles over itself
and the inner detail stroke starts 10 units away (M75,45, :69) — a dark crease/notch
renders inside the tip at every size (zoom-moon208.png, zoom-moon80.png).
- Spec: move the detail stroke down and thin it — `M72,52 C52,68 47,105 55,133`, sw 4→3.5
  (:68–70); soften the cusp by nudging the closing control `65,40 → 66,42` (:64). v2
  reduces the crease visibly; a residual nick remains at 208px (acceptable boil
  character; eliminating it entirely would mean re-drawing the cusp tangents — beyond
  "slight").

**M3 — white dot stars are chromatic strays.** #FFFFFF circles (:85–87) against the
butter-yellow star polygons (#FFF4AA, 1.12:1 white-vs-butter) — at 5rem they read as
gray anti-aliased specks, and they're perfect circles in a set where everything else is
wobbled.
- Spec: recolor `#FFFFFF → #FFF4AA` (validated in v2 — the star field becomes one
  temperature). Optionally swap the largest dot (185,35 r2.5) for a `wobbleDiamond` at
  ~60% scale to kill the last geometric primitive.

**M4 — light-paper transient.** During the 800ms crossfade the incoming moon draws over
paper that's still light (fill 1.07:1, stroke 1.6:1 vs hsl(48 15% 98%) — "moon on light"
panel, harness.png). Ghost-faint for a beat.
- Spec (optional): deepen the crescent stroke `#E5C74D → #D4B33C` (~1.9:1 on light paper,
  still butter on dark at >13:1). Transient-only; fine to decline.

## Filter + transition notes (wobble-celestial)

- The preset itself is right: scale 5 ≈ 2px displacement at 5rem, 5.2px at 13rem; 160ms
  cadence coheres with the 150ms grain tick and the 8fps star boil. Don't raise
  baseFrequency for "tooth" — at 0.03+ it shreds the sub-pixel sparkles (S3 fixes
  legibility the right way).
- **F1 — the outgoing icon goes stiff mid-fade.** The filter is bound only to the active
  icon (`:filter="!isDark ? 'url(#wobble-celestial)' : undefined"`,
  DarkModeToggle.vue:14, :59), so the instant the flip starts, the outgoing drawing loses
  its wobble and crossfades as a frozen print. Spec: bind `filter="url(#wobble-celestial)"`
  unconditionally on both SVGs — the inactive icon is opacity-0 and its CSS animations are
  already paused (:224–227), so steady-state cost is nil; the 800ms page-turn keeps its
  boil the whole way through.
- **F2 (adjacent, structure lane may want it):** `#storybook-texture`
  (SvgFilters.vue:164–167) has zero consumers in `src/` — dead filter def
  (`grep -rn "storybook-texture" web/frontend/src` returns only the definition).

## What NOT to touch

Silhouettes, palette family, the two-icon crossfade choreography, ray/star/sparkle boil
architecture, PRM handling, the 240s spin, the star twinkle steps() keyframes — all of it
is soul-correct and none of it is in scope for the slight pass.

## Contrast appendix (WCAG relative-luminance ratios, computed)

```
sparkle fill FDE68A  vs light paper  1.19   sparkle stroke F0B030 vs light paper 1.84
spiral F0B030        vs disc F09855  1.17   moon fill FFF4AA vs light paper      1.07
moon stroke E5C74D   vs light paper  1.60   moon fill FFF4AA vs dark paper      16.86
sun ray E88845       vs dark paper   7.22   sun ray E88845   vs light paper      2.50
inner ray D16A32     vs ray E88845   1.38   white dots FFFFFF vs stars FFF4AA    1.12
```

Command: python3 luminance/contrast per WCAG 2.x formula over the literal hex values
(paper approximated as #FBFAF7 / #121110 from index.css:105, :180).
