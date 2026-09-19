# ACC-SIX — the sixth crayon · pass-1 SYNTHESIS

Section: §3 accent family · §4 fill meter · §12 multiplayer chrome · §15 danger ink · M07.
Route: arm (b) as the research left it — the sixth is a NAMING of the answer's violet, an
ink-only sixth ANCHOR with three rungs and zero new violet bytes. Arm (a) (the sixth as wax)
is dead on 1.93:1 and is not specified here. Written from
`../research/ACC-SIX/README.md`, `r0/r2-accent-family`, `r0/r6-idiom-history` (the law list),
and the source sites named below. Read-only on the product; this file is a spec, not a patch.

## 0. Method (the frontend-design two passes, on a voice rather than a page)

**Plan.** Palette: the house's (paper `hsl(48 15% 98%)`, card `#fdfdfc`, graphite `hsl(0 0% 15%)`;
dark paper `hsl(24 8% 6%)`, card `hsl(24 6% 7%)`, frame `hsl(48 10% 80%)`; the five crayons)
plus ONE sixth anchor at OKLCH 293° in three lightness rungs the tree already holds. Type:
Patrick Hand's lowercase cut for the one new drawn string; nothing else. Layout: the board frame
moves 12 viewBox units; nothing else moves. Principle: contrast is bought by lightness at a
locked hue; a sixth colour is one more thing to learn, so it takes exactly one job (the answer)
and blue takes exactly one (you).

**Review against the tell list.** The generic cure is a brand accent applied everywhere, a
percent-labelled progress bar, a glowing bar, and a red-tinted destructive button. Refused:
`%` is not in the hand's cut (index.css:94-96), a glow is a live filter (budget 9), and the
red-tinted ground measures 4.31/4.32 under AA. What survives is a count in words, no glow, and
red on the one word that must be read.

## 1. One memorable thing per surface

| surface | the one thing | everything else |
|---|---|---|
| the board | a small paper tape at the frame's top-left head that says `3 of 20 written` for the first three fills of a board, then lifts | the violet trace itself is unchanged in hue; the frame moves 7.63 px so the trace hugs it on four sides |
| your hand | your digits, the unit wash and the focus ring are ONE blue, crayon-blue's | the pen desaturates (C 0.215 → 0.131 light); the owner disposes (U-10) |
| the answer | the trace, the revealed digit's second stop and the sparkle's glow are ONE named violet | no violet byte moves; four 1.4.11 ratios byte-identical to HEAD |
| the confirm | one red word | the ground stays neutral; the stroke-weight mark stays |
| multiplayer | you are blue; every peer is the walk, kept ≥5° from six anchors | the palette itself is §11c's (PAL lanes); this family only states the arcs |

## 2. Tokens (index.css)

```
:root {
  /* THE SIXTH ANCHOR — the answer's violet, INK ONLY: no wax tier, no crayon dark law.
     One hue (293°), three rungs, all three already in the tree. Zero new hexes. */
  --color-answer-pale: #c4b5fd;   /* L .811  C .101  h 293.6 */
  --color-answer-mid:  #8b5cf6;   /* L .606  C .219  h 292.7 — the ONLY rung inside the light trace's window [.558,.666] */
  --color-answer-deep: #7c3aed;   /* L .541  C .247  h 293.0 — the ONLY rung inside the dark trace's window [.510,.576] */
  --color-solver-ink-2: var(--color-answer-deep);   /* verdict rung on white paper; 5.60:1 card (ledger unchanged) */
  --color-progress-ink: var(--color-answer-mid);    /* trace: 3.28 grid-line / 3.90 card painted (HEAD-identical) */
  --sparkle-glow-soft:   color-mix(in srgb, var(--color-answer-pale) 30%, transparent);
  --sparkle-glow-strong: color-mix(in srgb, var(--color-answer-pale) 60%, transparent);

  /* BLUE, ONE JOB — crayon-blue's ink tier (the red-ink / green-ink / orange-ink move). */
  --color-blue-ink: #2f76bd;                 /* h 251.4 locked, L .555, C .131; 4.64 card / 4.53 background (AA text) */
  --color-user-ink: var(--color-blue-ink);   /* 24 consumers stand; the peer seam (playerIdentity.ts:69) rebinds THIS name */
  /* --color-focus-sketch is DELETED (2 consumers re-pointed, see §3). */
}
.dark {
  --color-solver-ink-2: var(--color-answer-pale);   /* pastel on black paper, as today */
  --color-progress-ink: var(--color-answer-deep);   /* 3.48 grid-line / 3.11 card painted (HEAD-identical) */
  --color-blue-ink: var(--color-crayon-blue);       /* ink collapses into wax at night: #6aabeb, 7.70 opaque, 6.47 ring @0.9 */
  --color-user-ink: var(--color-blue-ink);
}
@media print                  { .progress-trace { stroke: #000 !important; } }   /* @layer base, beside .grid-line */
@media (forced-colors: active){ .progress-trace { stroke: CanvasText; } }        /* beside .glyph-svg path */
```

Hexes that die: `#2563eb`, `#60a5fa`, `#3a7bc4`, the two `rgba(196,181,253,…)` literals, the
`#2563eb` fallback at `HandwrittenGlyph.vue:85`. Born: `#2f76bd`. Names: `focus-sketch` dies,
`blue-ink` and the three `answer-*` rungs are born; `#7c3aed` keeps one hex name and two
semantic aliases (the estate's own alias rule, index.css "zero new hexes").

The comment at index.css:267-277 ("the SIXTH crayon … NON-blue by construction, 46° off
focus-sketch") is rewritten: the sixth is an ANCHOR of the house, ink only; the inversion
between themes is forced by the four-ground intersection being empty (research §0).

## 3. Components and states

**The focus ring** (`gameCell.css:246,:248`): `fill`/`stroke: var(--color-blue-ink)`, no
fallback. Painted at stroke-opacity 0.9 on `--color-card`: 4.01 light / 6.47 dark (HEAD 3.67 /
3.72). Draw-on unchanged: 180ms `--ease-ghostDraw`. TRAP: never `--color-user-ink` here — the
selector sits inside the cell the peer seam rebinds, and a peer's square would get a
peer-coloured ring.

**Your digit** (`HandwrittenGlyph.vue:85`): `var(--color-user-ink, var(--color-blue-ink))`.
Text contrast 4.64 light (AA, 0.14 headroom) / 7.70 dark. Print `#000`, forced-colours
`CanvasText` — both arms unchanged and both beat the presentation attribute by `@layer base`.

**The unit wash**: unchanged, `crayon-blue` at 7%. Pen, wash and ring are now one hue with
three pressures: wash 7% flat fill · ring 0.9 wobbled stroke around the cell · pen an opaque
glyph inside it. Separation is by form and pressure, never by hue.

**The fill trace** (`HandDrawnGrid.vue:461-480`): hue unchanged. `gridPaths.ts:339`
`FRAME_Y_PAD 0 → 12`: the trace sits ~2.7 px inside the board box on all four sides (today
+3.22 top / +1.72 bottom outside, 2.78 / 2.68 inside on the flanks); the graphite frame moves
with it by the A-1c one-source rule (7.63 CSS px at 1280, 4.38 on the phone; perimeter
3,952 → 3,904). A declared π DELTA on every board golden, re-minted from the runner artifact,
never on a single red. At 0% nothing renders (as today); no track ring — the inward offset is
already the join trace's (`HandDrawnGrid.vue:604-611`). The dash tween keeps 240ms; its curve
becomes `--ease-drawOn` (the pencil-stroke curve, since the trace is a pencil stroke); the
win bow-out keeps 500ms on `ease`. Both durations move home: `MOTION.traceFillMs: 240`,
`MOTION.traceWinMs: 500`, v-bound as `--trace-fill-ms` / `--trace-win-ms` (law 4 — naming
what is already there, §13's work).

**The count tape** (new; the §4 label). A `SheetWashiLabel` in a new anchor `head`:
absolute at the board wrapper's top-left, astride the frame's top edge where the trace begins
(the compartment tag's own pose, `--sheet-washi-neutral`, seeded tear and ±1.5° tilt,
`--type-tag`, weight 500, lowercase, foreground ink — the washi voice, not the violet, so it
carries no contrast question and stays under law 20's "never chrome"). Measured under the
overlay: 75 × 23 px desk, 67 × 20 px phone (18.3% of the phone board's width). `aria-hidden`:
the sr-only `role="progressbar"` beside it speaks the SAME literal (law 33), so nothing is
said twice (W3).
- Copy: `N of M written`, e.g. `3 of 20 written`. Every codepoint is in the cut (U+0030-0039
  present; `%` and `/` are not, so never a percent, never a slash); `check-font-coverage.mjs`
  passes with zero re-cut. "written" over "filled" because `Fill` is the FILL-FORCED button's
  own word a few hundred px away and does a different thing; "written" is what the count
  counts (HandDrawnGrid.vue:288: cells WRITTEN, wrong ones included). `aria-valuetext` is
  re-cut to the same literal (a `check-live-regions.mjs` row); `aria-label` stays `board fill`.
- Life: laid down on the FIRST fill of a board (write-in 250ms `--ease-noteWrite`, the
  MarginNote's clip-path write-in; home `MOTION.noteWriteMs: 250`, naming the existing number),
  its count updates in place on fills 2 and 3 (no re-write), and after the third fill it rests
  `MOTION.tapeRestMs: 2400` (the one NEW timing constant this family mints) then lifts over
  `chromeLeaveMs` 200 on `--ease-fadeOut`. It does not return for that board; a new deal
  resets it. Undo below the first fill removes it with the same lift. PRM: no write-in, no
  lift — same-frame show/hide, `fill: backwards` (law 6).
- Position: `left` = FRAME_X_PAD scaled (12 units × the board scale: 7.6 px desk / 4.4 px
  phone), `top` = −(tape height / 2) so it straddles the frame edge; `z-index: 3`,
  `pointer-events: none`. Must not touch `.masthead` at any W2 pose (a measured row).

**The sparkle** (`GameControlPanel.vue:2081,:2087`): `filter: drop-shadow(0 0 2px
var(--sparkle-glow-soft))`, hover 5px `--sparkle-glow-strong`; `transition: filter 200ms
var(--ease-standard)` (the `all` tween is what fed R2's census a tween frame). Still ONE
filter — the budget's own row 9, unchanged.

**The confirm's face** (`GameGallery.vue:1459` and the W1 §1.5 ribbon wherever it mounts):
`.guard-leave .guard-face { color: var(--color-red-ink); background: color-mix(in srgb,
var(--color-foreground) 5%, transparent); }`. Red on the WORD, the ground neutral — and at
5%, not 8%: red-ink over the 8% neutral ground measures 4.14 (ACC-FIVE, both engines), under
AA; bare 4.87–4.92. The research's "4.87 on a neutral 8% ground" is its table's "on the plain
card" row mislabeled, so the ground drops until the word paints ≥4.5 (5% must be re-measured
in both engines; if it misses, the ground goes to 0 and the stroke-weight mark carries the
verb alone). `keep` unchanged, `18.99:1`. Hover ground `--color-accent` unchanged; focus
ring unchanged. Both engines reach the ribbon by polling `g → staging-deal → ribbon`.

**Multiplayer chrome (§12)**: you write in `--color-blue-ink`; your mark (M14, PLR lanes)
takes the same token when a session is live — the "nice blue" is your own ink, not a fourth
blue. Peers keep the walk; the join trace keeps stroking the arriving ink at 0.95 inward at
`scale(0.984)`. The reserved set the palette must clear is SIX anchors at ±5° (KIN_DEG):
rose 14.2 · orange 68.7 · gold 83.7 · green 147.0 · blue 251.4 (yours) · the sixth 293.0
(the answer). Cost against the shipped walk: 1 index of the first 40 (i=10 at 295.0°, 2.0°
from the sixth — a tenth player dealt the answer's colour). Shape recommended to §11c: a
reject-sampler over the six arcs, cap-free, index ≠ hue. Not designed here.

## 4. Desktop and mobile, light and dark

- Desk 1280×800: board 636 px; trace 5.09 px; tape 75×23 at (7.6, −11.5) from the board box.
- Phone 393×699 dpr3: board 365 px; trace 2.92 px; tape 67×20; the frame moves 4.38 px.
- Light: trace `#8b5cf6` (3.28 grid / 3.90 card); ring `#2f76bd` 4.01; digit 4.64; verb
  red-ink ≥4.5 on the 5% ground (to measure).
- Dark: trace `#7c3aed` (3.48 / 3.11 — the charter's 3.07 floor holds, byte-identical); ring
  `#6aabeb` 6.47; digit 7.70; verb = the rose wax (`--color-red-ink` collapses), ≥4.5.

## 5. Plan — files in order, what dies

1. `web/frontend/src/pencil/config/pencilConfig.ts` — `MOTION.traceFillMs 240`,
   `traceWinMs 500`, `noteWriteMs 250` (named), `tapeRestMs 2400` (new).
2. `web/frontend/src/assets/index.css` — §2's block in `:root` and `.dark`; delete
   `--color-focus-sketch` (:219-222) and its false comment; rewrite :267-277; add the two
   `.progress-trace` arms at :894-952; the four rungs' comments carry their measured ratios.
3. `web/frontend/src/games/shared/gameCell.css:246,:248` → `var(--color-blue-ink)`.
4. `web/frontend/src/pencil/glyph/HandwrittenGlyph.vue:85` → drop the `#2563eb` literal.
5. `web/frontend/src/games/shared/GameControlPanel.vue:2081,:2087` → the two tokens; the
   transition narrows to `filter`.
6. `web/frontend/src/pencil/chrome/GameGallery/GameGallery.vue:1459` (+ the W1.1 ribbon) →
   red-ink word, 5% neutral ground.
7. `web/frontend/src/pencil/grid/gridPaths.ts:339` `FRAME_Y_PAD 12`; the A-1c comment gains
   the symmetry sentence; DELTA declared in the wave record; goldens re-minted from the
   runner artifact.
8. `web/frontend/src/pencil/sheet/SheetWashiLabel.vue` — anchor `head`;
   `web/frontend/src/pencil/grid/HandDrawnGrid/HandDrawnGrid.vue` — mount it, the three-fill
   lifecycle (a counter reset on deal, decremented on undo), `aria-valuetext` → `N of M
   written`, the dash/opacity timings v-bound.
9. `scripts/check-live-regions.mjs` — the valuetext literal row; `scripts/check-copy-register`
   — the new string; `r0/r2-accent-family/probe/accent-kinship.probe.ts` — the six-anchor
   ruling recorded in the file (exceptions shrink to rainbow stops 1/3/4/5 + the walk).
10. Hand-off rows, not this patch: the six reserved arcs to §11c; the mark's live colour to
    §11's PLR lanes.

Dies: `--color-focus-sketch`; `#2563eb` / `#60a5fa` / `#3a7bc4`; two `rgba()` literals; the
glyph's literal fallback; the "sixth crayon, 46° off" comment; `transition: all` on the
sparkle; the trace's `stroke-dashoffset … ease`.

## 6. Prototype brief (pass 2 builds this)

Build: a throwaway `git worktree` under the scratchpad carrying steps 1-8 as a `.diff` banked
under `pass1/prototype/ACC-SIX/proto/`; dev server `npx vite --host 127.0.0.1 --port 4235
--strictPort` (next free in 4230-4249 if taken); scratch Playwright config (copy, no
`webServer`/`globalSetup`, `baseURL` :4235), chromium + webkit headless, 1280×800 and 393×699
dpr3, light and dark. No osascript, no Safari (M19). Nothing committed; worktree removed.

Poses to screenshot (crops ≤150 KB, cited, few): (1) board top-left 330×210 at fill 1 with the
tape laid down, light + dark, beside R2's `frames/board-corner-*.png`; (2) the same corner at
fill 4 after the tape lifted; (3) a focused cell with a written digit and the unit wash, light
+ dark; (4) the armed confirm, both engines; (5) the solved board's corner (trace vs revealed
digit — the kill-by-form row); (6) print emulation and forced-colours emulation of the board
corner (the trace must be black / CanvasText); (7) phone 393 at the W2 bottom-tab pose with
the tape visible, proving zero overlap with the masthead.

Measurements that mean success: the four 1.4.11 ratios on painted bytes byte-identical to
HEAD (3.28/3.90 light, 3.48/3.11 dark); ring 4.01 / 6.47; digit 4.64 / 7.70; verb ≥4.5 on
the 5% ground both engines; meter |top − left inset| ≤ 0.5 px (HEAD 6.00); tape box within
the board box's left 25% and above its top edge, `masthead` overlap 0 at every viewport;
off-ANCHOR share (>15° from six anchors) full-board chromium light ≤ 30% (HEAD 64.29) and
dark ≤ 5% (HEAD 49.15), webkit likewise; the Chromium `color-mix`-in-`drop-shadow` glow
byte-matches `--color-answer-pale` at α .3 in 5 of 5 runs once the token is parsed with the
sheet (the research's flake, re-measured); `filterBudget` exactly 9 and the union area
unchanged; `check-font-coverage.mjs` passes with no re-cut; `check-copy-register.mjs` 0
unadmitted; `check-live-regions.mjs` green on the valuetext literal; the R6 heading census
unmoved (3 voices → still 3; this family claims no heading); the R3 wobble probe unmoved
(ring σ unchanged — hue moved, geometry did not); goldens: board 4/4 moved with the DELTA
declared and re-minted, every non-board golden 0 px.

## 7. Gates it lands with (born-RED at HEAD unless marked)

1. kinship rows 1/2 (light/dark) with the six-anchor ruling, KIN_DEG 5 — RED at HEAD
   (`user-ink` 11.5° / `progress-ink` off every anchor until the sixth is declared).
2. row 6 "the glow names a token": painted sparkle glow byte-matches a resolved token at its
   alpha — RED (inline `rgba`).
3. `--color-focus-sketch` absent from index.css AND the painted dark ring = `#6aabeb` @0.9
   ≥6.4:1 — RED (R6 law-probe R1).
4. the trace under `@media print` paints `rgb(0,0,0)` and under `forced-colors: active`
   `CanvasText`, both engines — RED (paints `rgb(139,92,246)` today).
5. the armed confirm's destructive verb: chroma > 0 AND ≥4.5:1 painted, both engines
   (polled path; subject-count guard ≥1 ribbon per engine) — RED (achromatic today).
6. meter symmetry: |top overhang − left inset| ≤ 0.5 px at 1280 and 393 — RED (6.00 px).
7. the tape: laid down at fill 1, literal == `aria-valuetext` == `N of M written`, gone by
   fill 4, zero overlap with `.masthead` at 1280×800 / 393×699 / 900×450 — RED (no tape).
8. off-ANCHOR full-board share (six anchors, 15° arc): light ≤30%, dark ≤5%, both engines —
   RED (64/49%).
9. no Tailwind stock hex in `index.css` or `HandwrittenGlyph.vue` (`#2563eb`, `#60a5fa`,
   `#3a7bc4`, `rgba(196,181,253`) — RED.
10. GREEN-by-construction guards carried beside them: the four 1.4.11 ratios ≥3:1 painted;
    digit AA both themes; `filterBudget` 9 exact + union area; rainbow tolls ≥4.5; peer worst
    ≥4.5 over 40; `check-font-coverage` / `check-copy-register` / `check-live-regions` /
    `check-ink-pressure` green.

## 8. What the owner disposes (U-10)

Whether your hand may desaturate (C 0.215 → 0.131, 5.08 → 4.64); whether the graphite frame
may move 7.63 px; whether the meter carries a tape at all, and for three fills. Nothing closes.
