# F1 — Dropdown border misregistration (design lane, Fable)

Owner shot: `scratchpad/tranche3/owner-shots/dropdown-border.png`. Reproduced live and measured
(Playwright headless against a local vite instance on :3011 — the :3000 server named in the brief
wasn't listening; probe script `scratchpad/tranche3/probe-f1.mjs`, shots `popover-dark.png` /
`popover-light.png`).

## Symptom, quantified

Steady state, dark, 900×800 viewport, menu open (card = `.logo-menu-card`, frame = the
`HandDrawnOutline` path):

| measure | value |
|---|---|
| card border box | 144 × 101.08 px, `border-radius: 12px`, `border: 2px solid` (hairline mix) |
| frame outset beyond card | left 5.53 / top 5.77 / right 5.11 / bottom 5.79 px |
| shadow reach beyond card | 8 px right, 8 px down (`cartoon-shadow-md`, 3 hard layers) |
| shadow past the frame line | ~2.9 px right, ~2.2 px bottom |
| card computed `transform` | identity — the utility's `translateY(-2px)` is dead (see R5) |
| frame corner geometry | square + endpoint overshoot; card corner 12 px round |

So: a ~5–6 px air gap on all four sides (empty at top-left, occupied by shadow at bottom-right —
hence the asymmetric "overflow top-left / shadow poking bottom-right" read), plus a crisp rounded
2 px border *inside* a square sketch frame — two disagreeing edges.

## Root causes

**R1 — mixed coordinate systems in HandDrawnOutline (the float).**
`web/frontend/src/pencil/grid/HandDrawnOutline.vue` outsets the SVG a *fixed* 6 px
(`inset: -6px; width: calc(100% + 12px)`, lines 86–90) but insets the path a *proportional*
`PAD = 8` viewBox units of a 1000-unit box (lines 14–15, 40). Net float per side ≈
`6 − 8·(w+12)/1000` px. At the popover (w = 144) that's ~4.75 px + wobble; at a ~610 px host it's
~1 px. The component's registration only holds at one host size — it was tuned for the big cards
(`App.vue:208,232`, both `SolverErrorNote`s, `FutoshikiGame.vue:122,144`), and the popover is its
smallest host by 3–4×. Measured float 5.11–5.79 px = 4.75 base + wobble displacement
(`maxDisplace = roughness·len·0.015` viewBox units, pencil-boil `src/path.ts:88`; ≈ ±1.2 px here).

**R2 — no radius concept in the wobble rect (radii disagree).**
`generateRectBoilFrames` builds four straight jagged sides meeting at square corners
(`gridPaths.ts:143–149`), with `jagged: true` endpoint overshoot extending *past* each corner
(`path.ts:89–94`). The card carries `border-radius: 0.75rem` (`HandwrittenLogo.vue:278`) — at
144 px wide, a 12 px radius is 8.3% of the width, so the square frame corner stands maximally
proud exactly where the panel retreats.

**R3 — two edges (the doubled-border read).**
`cartoon-shadow-md` bundles `border: 2px solid var(--color-border)` (`index.css:241–248`; dark
variant 258–264), and W5's dark hairline brightens it
(`color-mix(… 25% foreground …)`, `HandwrittenLogo.vue:288–290`). The panel therefore paints its
own crisp rounded edge inside the floating square sketch frame. Misregistration is only legible
because there are two edges to disagree.

**R4 — W5 H2-elevation interaction: amplifier, not origin.**
Commit `49506bf8` swapped `cartoon-shadow-sm bg-card` → `cartoon-shadow-md bg-popover` and added
the dark hairline mix (verified via `git show 49506bf8 -- …/HandwrittenLogo.vue`). Effects on F1:
shadow reach 6 → 8 px (now clearly crossing the frame line bottom-right); a brighter inner edge in
dark mode (making R3's double edge pop); a heavier down-right silhouette (making R1's symmetric
float read as up-left displacement). The float itself predates W5.

**R5 — latent transform collision (adjacent finding).**
`cartoon-shadow-md` declares `transform: translateY(-2px)` (`index.css:248`), but
`.logo-menu-card`'s `animation: logo-menu-in 250ms … both` (`HandwrittenLogo.vue:283`) fills
forward at the `to` keyframe's `translateY(0)` (`:328–337`), permanently overriding the utility's
lift — measured computed transform is identity. The utility's −2 px is silently dead on this host
and alive on non-animated hosts: an inconsistency to true in tranche-III.

## Idiomatic fix spec (no nudge-by-pixels)

1. **Px-native geometry — registration by construction.** HandDrawnOutline already measures its
   host (`useResizeObserver`, lines 21–27). Generate the path in a viewBox equal to the measured
   px box plus `2·outset`, where `outset` is a prop (default 0), and pad the rect by that same
   `outset` — one number, one coordinate system. Drop the fixed `inset: -6px / +12px` CSS, drop
   `preserveAspectRatio="none"` (scale becomes 1:1, so `vector-effect: non-scaling-stroke` and the
   anisotropic-wobble side effect of the non-square scaling both vanish). The frame hugs the
   border box at every host size, forever. Boil frames already regenerate on resize — no new cost.
2. **Radius-aware wobble rect.** Teach `generateRectBoilFrames` a `radius` param: shorten the four
   sides by `r`, join with jittered arc-sampled polylines (in-family with the jagged aesthetic).
   HandwrittenLogo passes the same radius the card uses — single token, no duplicated literal.
3. **One-edge ownership.** The wobble frame *is* the drawn edge; the host must not double it.
   Provide a border-less elevation variant (shadow without the utility's `border: 2px solid`) for
   outlined hosts. The 8 px hard shadow *stays*: with the frame hugging the panel, the shadow lies
   beneath the lifted sheet, outside the drawn edge — correct storybook grammar. Fixes 1+3
   dissolve the bottom-right complaint without touching W5's elevation intent.
4. **True R5.** Fold the −2 px lift into `logo-menu-in`'s `to` keyframe, or drop it from the
   utility for animated hosts — either way, make the declared lift and the rendered lift agree.

PRM is unaffected: the boil cadence is pencil-boil's (already gated), and `logo-menu-in` is
disabled under `prefers-reduced-motion` (`HandwrittenLogo.vue:356–367`).

**Blast radius of fix 1:** every HandDrawnOutline host currently floats somewhat (a ~400 px error
note floats ~2.7 px); px-native geometry tightens all of them uniformly — verify each host
visually after the change, and pick per-host `outset` where a hair of air is wanted.
