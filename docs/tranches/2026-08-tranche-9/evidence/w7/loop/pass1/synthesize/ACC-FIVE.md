# ACC-FIVE — five crayons, no sixth · pass-1 SYNTHESIS

Section: §3 accent family · §4 fill meter · §12 multiplayer chrome · §15 danger ink · M07.
Route: every interactive accent is an alias into the FIVE crayons, hue-locked within 5°,
contrast bought by lightness alone. The violet dies from the interactive estate; progress is
gold ink that becomes the gold wax at the win. Written from `../research/ACC-FIVE/README.md`
(+ its `proto/five-crayons.css`), `r0/r2-accent-family`, `r0/r6-idiom-history`, and the
source sites below. Read-only on the product; this is a spec, not a patch.

## 0. Method (the frontend-design two passes, on a voice rather than a page)

**Plan.** Palette: the house's papers and the five crayons, plus THREE hue-locked ink rungs
(blue-ink for your hand, gold-ink-for-the-trace in two arms) found by the estate's own move:
hold the crayon's OKLCH hue, take the chroma sRGB allows there, walk lightness to the floor.
Type: nothing new is drawn in the hand face. Layout: the board frame moves 12 viewBox units
(the same overhang finding ACC-SIX proved has no free cure); nothing else moves. Principle:
gold is earned light, so the meter is the celebration arriving one pressure early, and every
other accent is one of five crayons at a different pressure.

**Review against the tell list.** The generic cure (brand accent, percent bar, glow, red
button) is refused on the same numbers as ACC-SIX (`%` not in the cut, glow = filter, red
ground 4.35 under AA). This family's own tell to refuse: a "warm cream + one accent" page
where gold becomes the accent everywhere. It does not — gold touches exactly two surfaces
(the trace and the solver's sparkle) and both are the one semantic the house already gave it.

## 1. One memorable thing per surface

| surface | the one thing | everything else |
|---|---|---|
| the board | at the win the gold ink trace on the frame lifts one pressure into the gold wax: same hue, same rect, same seed | the trace is 126 px of pressed pencil at the first digit, 0.16% of the board; no label; nothing at 0% |
| your hand | your digits are crayon-blue's ink; the ring is crayon-blue's wax at night for the first time | the digit's weight moves by 0.013 of a ratio (5.078 → 5.065) |
| the solver's button | the sparkle glows in the colour the solved board wears | the icon's own unthemed rainbow stays (chrome, documented) |
| the confirm | one red word on a faint ground of the same red | `keep` unchanged |
| the controls card | the difficulty tint lives on the chip that was decided, not the heading | chrome stays achromatic (a §1/§10 seam — see §8) |
| multiplayer | you are blue; peers are the walk, kept ≥5° from five arcs (78.3° reserved) | the palette is §11c's |

## 2. Tokens (index.css)

```
:root {
  --color-blue-ink: #026fc4;                 /* crayon-blue h 251.4 locked (Δ0.17°); L .536 C .156; 5.065 card / 4.945 background */
  --color-user-ink: var(--color-blue-ink);   /* 24 consumers stand; the peer seam rebinds THIS name */
  --color-progress-ink: #a47903;             /* crayon-gold h 83.7 locked (Δ0.12°); L .603 C .123; 3.59 grid-line / 3.59 card @0.95 */
  --sparkle-glow-soft:   color-mix(in srgb, var(--color-crayon-gold) 30%, transparent);
  --sparkle-glow-strong: color-mix(in srgb, var(--color-crayon-gold) 60%, transparent);
  /* --color-focus-sketch #3a7bc4 STAYS (light arm unchanged, 3.63 @0.9) */
}
.dark {
  --color-blue-ink: #47a7ff;                 /* h 249.3 locked (Δ0.07°); 7.341 card — the weight-preserving pick; see §7 for the two priced alternatives */
  --color-user-ink: var(--color-blue-ink);   /* the ONE ink that may not collapse into its wax: the wax is the ring's and the wash's */
  --color-focus-sketch: var(--color-crayon-blue);   /* the missing dark arm; 6.42 @0.9 on card; index.css:222 becomes true */
  --color-progress-ink: #7d6902;             /* crayon-gold dark h 95.2 (Δ0.59°); L .524 C .107; 3.22 grid-line / 3.25 card @0.95 */
}
@media print                  { .progress-trace { stroke: #000 !important; } }
@media (forced-colors: active){ .progress-trace { stroke: CanvasText; } }
```

Hexes that die: `#2563eb`, `#60a5fa`, `#8b5cf6` (progress light), the dark progress alias to
`#7c3aed`, the two `rgba(196,181,253,…)` literals, the glyph's `#2563eb` fallback. Born:
`#026fc4`, `#47a7ff`, `#a47903`, `#7d6902`. Gold now has THREE tokens (wax · gold-ink for
verdict text · progress-ink for the trace), three lightness tiers with three measured floors;
said out loud so a reviewer does not find it. `--color-solver-ink-2` (`#7c3aed`) stays as the
rainbow's stop, board content only (law 20) — the only violet left, and the instrument
records the rainbow as the ONE declared exception.

The comment at index.css:267-277 is rewritten: progress is gold's INK tier, inverted between
themes because the frame line flips value; the four ratios above replace the violet's ledger.

## 3. Components and states

**Your digit** (`HandwrittenGlyph.vue:85`): `var(--color-user-ink, var(--color-blue-ink))`.
5.065 light / 7.341 dark. Kin 0.2° / 0.07°. Print and forced-colours unchanged (`@layer
base` beats the presentation attribute).

**The focus ring** (`gameCell.css:246,:248`): token unchanged, dark arm now real. Light 3.63,
dark 6.42 @0.9. Draw-on unchanged (180ms `--ease-ghostDraw`). Pen vs ring: light ΔC 0.039 /
ratio 1.40; dark ratio 1.14 (iso-luminant by construction on near-black paper). Separation
is form: a 7-unit wobbled stroke drawn around the cell vs an opaque glyph inside it.

**The unit wash**: unchanged, crayon-blue 7%.

**The fill trace** (`HandDrawnGrid.vue:461-480`, `index.css:588-600`):
- Hue: gold ink (above). Form: `FRAME_Y_PAD 0 → 12` (`gridPaths.ts:339`) so the trace sits
  ~2.7 px inside on all four sides; the graphite frame moves with it (7.63 px desk / 4.38
  phone), a declared π DELTA on the board goldens. At 0% nothing renders: the graphite frame is
  the empty gauge, and a reader learns it exists when 126 px of pressed gold appear at the
  first digit. No label, no whisper.
- The win: `.solve-success .progress-trace { opacity: 0 }` DIES and becomes
  `.solve-success .progress-trace { stroke: var(--color-gold-star); }` with
  `transition: stroke var(--trace-win-ms) var(--ease-noteWrite)` — the trace stays and lifts
  one pressure into the wax. This is the cure for the blocker the research found: the
  solved frame's gold recolour lands on `.grid-line` nodes that are `display: none` under the
  bake and NEVER paints (0 chromatic px through 5 s at HEAD, both themes), while the trace
  is a live grain-baked pose stack that does. The trace carries the win instead of the
  hidden frame; `.solve-success .grid-line { stroke: gold-star !important }` stays for print
  (where the vector stack shows). Hand-off measured in tokens: light 83.4° → 83.7°, ΔL
  +0.110; dark 95.8° → 95.2°, ΔL +0.309. In dark the wax over the warm-grey frame line is
  1.07:1 on the line itself and 11.48 over the card beside it — the pose reads as the frame
  line turning gold, which is the sentence; the prototype's band census decides whether it
  reads at all (§6). The win pose is celebration, decorative under 1.4.11 exactly as the
  shipped solved frame (2.53 on the light card) already is; the 3:1 floor is the INK's,
  before the win.
- Motion home: `MOTION.traceFillMs: 240` (dash, `--ease-drawOn`), `MOTION.traceWinMs: 500`
  (the stroke lift; names the existing 500), v-bound `--trace-fill-ms` / `--trace-win-ms`.
  PRM: no dash tween (as today), stroke swaps same-frame.

**The sparkle** (`GameControlPanel.vue:2081,:2087`): `drop-shadow(0 0 2px var(--sparkle-glow-soft))`,
hover 5px `--sparkle-glow-strong`; `transition: filter 200ms var(--ease-standard)`. Measured
under the overlay `color(srgb 0.788235 0.603922 0.180392 / 0.3)` = crayon-gold at α .3.
Still one filter, budget 9.

**The confirm's face** (`GameGallery.vue:1459` and the W1 §1.5 ribbon):
`.guard-leave .guard-face { color: var(--color-red-ink); background: color-mix(in srgb,
var(--color-red-ink) 5%, transparent); }`, hover 14%. Measured: red-ink bare 4.92; over its
own 8% ground 4.35/4.36 (under AA); over a 5% ground 4.56 (AA, both engines). Dark: red-ink
is the rose wax, ≥4.5 to be re-measured on the same path. `keep` 18.99, unchanged.
Reached in BOTH engines by polling `g → staging-deal → ribbon`.

**The heading tint** (`GameControlPanel.vue:186-192`, `OptionSelector.vue:56`): `headingClass`
returns `text-muted-foreground` always; the selected chip keeps `colorClass`. One tint per
decision, on the thing decided. This touches §1's heading voice; the agglomerator seats it
with the CTRL families (§8).

**Multiplayer chrome (§12)**: you write and are marked in `--color-blue-ink`; peers keep
the walk and the join trace strokes the arriving ink inward at `scale(0.984)`. Reserved arcs
(both themes, ±5°): danger 7.2–19.2 · orange 59.2–76.8 · gold + progress 77.4–100.8 (this
family widens it to 100.8 with the dark trace) · green 142.0–153.3 · yours 244.3–258.3;
78.3° reserved, 281.7° free. Law 21 stands (no player takes wax or a rainbow stop). The
palette is §11c's; the arcs are stated here.

## 4. Desktop and mobile, light and dark

- Desk 1280×800: board 636 px; trace 5.09 px; frame moves 7.63 px.
- Phone 393×699 dpr3: board 365 px; trace 2.92 px; frame moves 4.38 px; nothing else.
- Light: trace `#a47903` 3.59 / 3.59 (HEAD violet 3.36 / 3.85; the binding worst-of-four
  rises 3.35 → 3.57); ring 3.63; digit 5.065; verb 4.56.
- Dark: trace `#7d6902` 3.22 / 3.25 (HEAD 3.46 / 3.07; worst-of-four 3.05 → 3.18); ring
  6.42; digit 7.341; verb ≥4.5 (measure).

## 5. Plan — files in order, what dies

1. `web/frontend/src/pencil/config/pencilConfig.ts` — `MOTION.traceFillMs 240`,
   `traceWinMs 500`.
2. `web/frontend/src/assets/index.css` — §2 in `:root` and `.dark`; the dark
   `--color-focus-sketch` arm; rewrite :267-277 and :219-222's comment; `.solve-success
   .progress-trace` opacity rule → stroke rule (:588-600); the two `.progress-trace`
   print/forced-colours arms (:894-952); the gold ledger comment gains the third tier.
3. `web/frontend/src/pencil/glyph/HandwrittenGlyph.vue:85` — drop the literal.
4. `web/frontend/src/games/shared/GameControlPanel.vue:2081,:2087` — the two tokens, the
   transition narrowed; `:186-192` `headingClass` → muted always.
5. `web/frontend/src/pencil/chrome/GameGallery/GameGallery.vue:1459` (+ the W1.1 ribbon) —
   red word, 5% red ground.
6. `web/frontend/src/pencil/grid/gridPaths.ts:339` `FRAME_Y_PAD 12`; DELTA declared; goldens
   re-minted from the runner artifact.
7. `web/frontend/src/pencil/grid/HandDrawnGrid/HandDrawnGrid.vue` — the timings v-bound; the
   trace's win transition on `stroke`; the `is-active` pin to pose 0 at the win stays.
8. `r0/r2-accent-family/probe/accent-kinship.probe.ts` — five anchors unchanged; row 4
   replaced by row 6 (the claim, not the regex); the rainbow recorded as the one exception.
9. Hand-off rows, not this patch: the five arcs to §11c; the mark's live colour to §11.

Dies: `#2563eb` / `#60a5fa` / `#8b5cf6`; the dark progress alias to `#7c3aed`; two `rgba()`
literals; the glyph's fallback literal; `.solve-success .progress-trace { opacity: 0 }`;
the heading's `colorClass`; `transition: all` on the sparkle; the violet's ledger comment.

## 6. Prototype brief (pass 2 builds this)

Build: a throwaway `git worktree` under the scratchpad carrying steps 1-7 as a banked `.diff`
under `pass1/prototype/ACC-FIVE/proto/`; `npx vite --host 127.0.0.1 --port 4236 --strictPort`
(next free in 4230-4249 if taken); scratch Playwright config (copy, no `webServer`/
`globalSetup`, `baseURL` :4236); chromium + webkit headless; 1280×800 and 393×699 dpr3; light
and dark. No osascript, no Safari (M19). Nothing committed; worktree removed.

Poses to screenshot (crops ≤150 KB, cited, few): (1) board top-left 330×210 at fill 1, light +
dark, beside R2's frames; (2) a strip of the same corner at 5 / 50 / 100 / won — the hand-off
is the family's centre and is unprovable today, so this crop is the one that matters; (3) a
focused cell with a written digit and the wash, dark (the iso-luminance the owner picks on);
(4) the armed confirm, both engines; (5) print + forced-colours emulation of the corner; (6)
the solver button at rest and hovered (the gold glow); (7) phone 393 at the W2 bottom-tab
pose, the trace at 50%.

Measurements that mean success: the four 1.4.11 ratios on painted bytes ≥ the research's
(3.59/3.59 light, 3.22/3.25 dark), worst-of-four ≥3.57 light / ≥3.18 dark; ring 3.63 / 6.42;
digit 5.065 / 7.341; verb ≥4.5 on the 5% ground both engines and both themes; meter |top −
left inset| ≤0.5 px; the 22×246 px frame band AFTER the win carries >0 chromatic px with
median OKLCH hue within 5° of crayon-gold at 900/1800/2700/3600/5000 ms, both themes (HEAD:
0 px — the blocker, cured by the trace carrying the win); paired pixel census off-family share
(R2's 40-115° band, one board): chromium light mid ≤16% (HEAD 21.25, overlay 15.22), dark mid
≤17% (36.54 → 16.52), webkit likewise; the glow byte-matches crayon-gold at α .3 in 5/5
chromium runs with the token parsed from the sheet; `filterBudget` 9 exact + union area;
R6 heading census: still three voices, but `h2.section-heading` computed colour = muted in
both themes at rest AND after the tween settles (row 11); the R3 wobble probe unmoved;
`check-copy-register` 0 unadmitted (no new string); `check-ink-pressure` green; goldens:
board 4/4 moved with the DELTA declared and re-minted, every non-board golden 0 px. Every
computed-style read waits out the 200/250 ms tweens (the trap the lane hit three times);
every colour read on the board's structure is pixels, never `getComputedStyle`; the overlay's
presence is asserted at every sample.

## 7. Gates it lands with (born-RED at HEAD unless marked)

1. kinship rows 1/2 with the FIVE-anchor set, KIN_DEG 5 — RED (`user-ink` 11.5° /
   `progress-ink` 41.3°).
2. row 6 "the glow names a token" (painted glow bytes == a resolved token at its alpha) —
   RED (inline `rgba`); replaces R2's unsatisfiable row 4.
3. the dark focus ring paints `#6aabeb` @0.9 ≥6.4:1 (R6 law-probe R1: `.dark` redefines
   `--color-focus-sketch`) — RED (3.66/3.67).
4. the trace under `@media print` paints `#000` and under `forced-colors` `CanvasText`,
   both engines — RED.
5. row 9 the destructive verb: chroma >0 AND ≥4.5:1 painted, both engines, polled path with
   a subject-count guard — RED.
6. row 10 the digit's weight and kinship: painted digit within 5° of crayon-blue AND ≥4.5
   on card and background, both themes — RED (11.5°).
7. row 11 chrome achromatic: `h2.section-heading` chroma 0 after the tween; the selected
   chip carries the tint — RED.
8. the hand-off: >0 chromatic px in the frame band after the win, median hue within 5° of
   crayon-gold, both themes, five samples — RED (0 px at HEAD).
9. meter symmetry ≤0.5 px at 1280 and 393 — RED (6.00).
10. no stock hex (`#2563eb`, `#60a5fa`, `#8b5cf6`, `rgba(196,181,253`) in `index.css` or
    `HandwrittenGlyph.vue` — RED.
11. GREEN-by-construction guards beside them: row 7 the four ratios ≥3:1 painted and
    non-decreasing worst-of-four; row 8 print/forced arms for the digit; the rainbow's tolls;
    the peer worst over 40; `filterBudget` 9 + area; `check-font-coverage` unchanged (no new
    string); `check-live-regions` unchanged.

## 8. What the owner disposes (U-10), and what the agglomerator must seat

Owner: the dark pen — `#47a7ff` (7.34, sep 1.14) vs `#0189e8` (5.12, 1.25) vs `#0180d8`
(4.53, 1.42); whether the graphite frame may move 7.63 px; whether a gold stripe at 5% is
gold spent early (the family says it is the celebration arriving; the strip shows it).

Agglomerator: the heading-tint retirement is a §1/§10 move that the CTRL families may also
decide; seat it once. The win-carried-by-the-trace cure is a substrate change shared with §5
(the bake) and W8 (nothing re-rasters at the win under it: it is a stroke swap on a live
pose stack, zero filters). Nothing closes here.
