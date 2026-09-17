# T9-W7 round zero · lane R3 — THE MARKS

Wobble · focus rings · the fill meter · the hint note's life. Read-only on the product;
every number below was taken on THIS tree (uncommitted W3/W6 included) at
`127.0.0.1:4252`, chromium + webkit, 1280×800 and 393×699 dpr3. The formation census
(`evidence/formation/registry.md` F18/A3, 2026-08-10) predates W1–W6 and three of its four
claims in this lane have MOVED; each move is named.

Logs: `logs/*.json`. Instruments: `probe/*.probe.ts` (+ `probe/pw.config.ts`, a copy of the
estate's config minus `webServer`/`globalSetup`, pointed at this lane's own port).
Frame: `frames/ring-on-grid.png` (19 KB, dpr3 crop of one focused cell and its neighbours).

---

## (a) THE WOBBLE — the ring is not CAD-precise, it is LENGTH-STARVED

### How the grid's wobble is made

`gridPaths.ts:421 generateGridBoilFrames` → `boilLineFrames` (pencil-boil) per rule, four
poses per line, `useBoilCache` LRU. `pencilConfig.ts:268` sets `frameCount: 4`,
`intervalMs: 150` (~6.7 fps, "shooting on fours"), `frameBoil 1.2 / subgridBoil 0.6 /
cellBoil 0.3`. The poses are static filterless siblings that trade `opacity` on the shared
`boilFrame` beat (`HandDrawnGrid.vue:405-446`), and once the bake lands the live stack goes
`display: none` (`.baked-hidden`) while `<image>` bitmaps hold the surface. The grain is
BAKED INTO the geometry (`gridPaths.ts:72-169`), not filtered.

The amplitude law is one line of the library — `node_modules/@mkbabb/pencil-boil/dist/path.js`
`wobbleLinePoints`:

```
const maxDisplace = roughness * len * 0.015;
```

**Wobble is proportional to the edge's own length.** That is the whole mechanism, and it is
what the census read as "CAD-precise".

### How the ring and the wash are drawn

- **Ring** — `DigitCell.vue:410-423`: one `<svg>` per cell holding `<path class="cell-ghost-path"
  :d="ghostPath">`. `ghostPath` is `GameBoard.vue:156 generateCellRects` →
  `gridPaths.ts:59 wobbleRect(x, y, cellSize, cellSize, {roughness: 0.4, segments: 4, jagged: true})`.
  So the ring is ALREADY drawn with the house's own wobble primitive. It has no boil pose
  stack (one static path), and `gameCell.css:245` paints tier 2 on it: `stroke #3a7bc4`,
  `stroke-width 7`, `stroke-opacity 0.9`, sketched on over `ghost-draw-on 180ms`.
- **Wash** — `DigitCell.vue:261-265`: a bare `<div class="cell-peer">`, `gameCell.css:132`
  `background: color-mix(in srgb, var(--color-crayon-blue) 7%, transparent)`. A CSS box. It
  has no geometry at all, so its edge σ is 0 by construction, not by measurement.

### The measurement (`probe/wobble.probe.ts`, both engines identical to 3 dp)

σ = RMS perpendicular residual off the chord, ≥8 samples (33 walked), in CSS px.

| subject | σ px | max dev px | chord px | where |
|---|---|---|---|---|
| grid cell rule `path.cell-line` | **1.443** | 2.999 | 567.8 | `logs/wobble-chromium.json` |
| board frame `path.frame-line` | 1.145 | 2.395 | 503.7 | same |
| **selection ring** `.cell-ghost-path` (focused) | **0.092** | 0.202 | 43.6 | same |
| **peer wash** `.cell-peer` | **0** (CSS box) | — | 70.66×70.66 | same |

The grid's band `[0.5σ, 2.0σ] = [0.722, 2.886]px`. The ring reads 0.092px — **7.9× below the
floor**, and the wash has no edge to read.

**Where the census moved:** the formation said ring σ 0.00px and grid σ 2.5px. Measured here:
ring σ **0.092px** (not zero — the house primitive is already on it) and grid σ **1.443px**
(not 2.5 — that figure was either the frame+grain or a different sample window). The finding
STANDS at the perceptual level (0.2px peak deviation on a 636px board is invisible) but its
CAUSE is not "a geometric rect was used"; it is the length law.

### The length law, stated as its own reading

| board | grid σ px | ring σ px | grid ÷ ring |
|---|---|---|---|
| 4×4 | 1.031 | 0.138 | 7.5 |
| 9×9 | 1.443 | 0.092 | 15.7 |
| 16×16 | 0.631 | 0.077 | 8.2 |

A 9×9 cell edge is 111 user units against a rule's 948, so at the same `roughness 0.4` the
ring gets 0.667 units of displacement where the rule gets 5.69. The ring is quieter at every
board size, in both engines.

### THE π-GUARD, measured (`logs/budget-chromium.json`)

Live-filter census on this tree, the budget's own counting rule (own `filter` ≠ none AND own
`display` ≠ none): **9 at 4×4, 9 at 9×9, 9 at 16×16** — exactly `filterBudget.ts`'s rows
(2 `svg.crayon-heart g` + 2 `svg.toggle-icon` + 4 `g.boil-pose` + 1 `svg.sparkle-icon`).
`.cell-ghost-path`'s own computed `filter` is `none` at every size.

**The primitive a wobbly ring reuses without a new filter:** the one it is already drawn
with. `wobbleRect` (via `generateCellRects`) takes the amplitude; `perturbPointsClosed` /
`boilRectFrames` — both already exported by pencil-boil and already the grammar
`generateRectBoilFrames` uses — take the boil, as static filterless sibling poses
opacity-swapped on the SAME `boilFrame` the grid already publishes. Zero new filters, zero
new keyframes, and the grain would be baked in exactly as `generateFrameTraceFrames` does it
for the violet trace.

**The DOM budget the cure must respect** (the half a filter count cannot see): the ghost
`<svg>` + `<path>` is resident on EVERY cell — 16 / 81 / **256** paths at the three sizes. A
naive four-pose stack on every cell is 64 / 324 / **1,024** paths. The pose stack belongs to
the ACTIVE cell only, or the cure is a per-cell seed with no stack at all.

---

## (b) FOCUS RINGS — one house hand, four bespoke rects, six browser defaults

Tab-order census at 1280×800 light, chromium (`logs/focus-chromium.json`,
`logs/focus-contrast-chromium.json`). Two rows are DEV-only and absent from `dist`
(`.tuner-toggle`, `debug · off` — `App.vue:124` gates `FilterTuner` on `import.meta.env.DEV`);
the shipped inventory is below.

| stop | indicator | spec | 1.4.11 ratio (light) |
|---|---|---|---|
| `.game-cell` input | **house hand** — SVG `.cell-ghost-path` | `#3a7bc4`, 7px, 0.9, `ghost-draw-on 180ms` | **3.63** |
| `.sun-moon-toggle` | geometric rect | `2px solid var(--color-ring)`, offset `calc(2px − var(--toggle-bleed))` = **54px** measured | 18.99 |
| `.logo-trigger` | geometric rect | `2px solid color-mix(foreground 40%)`, offset 4px, radius 0.35rem | **2.70 — under 3:1** |
| `.drawer-tab` | geometric rect | `2px dashed currentColor`, offset 3px | 18.99 |
| `.game-card.is-center` (deck) | geometric rect | `2px solid color-mix(foreground 40%)`, offset 4px, radius 0.5rem | **2.70 — under 3:1** |
| `.staging-face` | geometric rect | `2px solid color-mix(foreground 45%)` (button itself `outline: none`) | not sampled |
| `.guard-face` | geometric rect | `2px solid color-mix(foreground 45%)` | not sampled |
| `.ctrl-btn` · `.icon-btn` · `.info-btn` · `.attribution-trigger` · both masthead `<a>`s | **UA default** `outline: auto` | browser-defined | ~20 (chromium) |

**Counted:** 1 house-hand affordance, 6 bespoke geometric-rect rules (toggle, logo,
drawer-tab, deck card, staging-face, guard-face), and the browser's own ring carrying every
button in the controls card and the masthead.

Two measured facts nothing in the estate gates:

1. **The modality gate does not exist.** `gameCell.css:243` says "a mouse click keeps the
   instant graphite tier and only keyboard focus gets the drawn-on ring." Measured, both
   engines (`logs/click-chromium.json`, `logs/click-webkit.json`): a mouse click, a click
   with the pointer moved away, and an arrow key ALL paint tier 2 (`rgb(58,123,196)`, 7px,
   0.9). A phone TAP does the same (`logs/phone-*.json`). The focus target is
   `<input type="text">`, which always matches `:focus-visible`. Tier 1 graphite only ever
   paints on hover WITHOUT focus.
2. **`outline: auto` is engine-defined, so the product has no focus look.** Six of the
   shipped treatments hand their ring to the UA. WebKit's macOS Tab traversal does not stop
   on buttons at all (`logs/focus-contrast-webkit.json` returned one row — the cell), which
   is why the estate's own specs use `.focus()` + a key press; programmatic focus does not
   match `:focus-visible` on a button in either engine (measured).

### The a11y floors that bind §6 (hard constraints)

- `e2e/access.spec.ts:232` **2.1 focus-occlusion census** — no control in `.controls-card`
  may focus into a burial ≥ 96% of 25 sample points. A ring nobody can see is a red.
- `e2e/access.spec.ts:325` **2.2 drawer-open inert census** — no covered control in the
  drawer subtree stays tabbable.
- `e2e/access.spec.ts:514` **2.3 contrast floor** — `.icon-sublabel` and `.ctrl-btn` TEXT at
  **4.5:1**, light AND dark, backdrop composited bottom-up. (This gates text, never a ring.)
- `e2e/spoken-gallery.spec.ts:200-262` **§3.7 the deck ring** — exactly ONE owner, and it is
  the `aria-activedescendant` card; `.gallery-viewport` must compute `outline-style: none`;
  and the ring must be **WHOLE**, i.e. `outlineOffset + outlineWidth ≤ the card's air inside
  the scrollport`. Measured at HEAD (`logs/deckring-chromium.json`): reach **6px**, air
  `9.6 / 713.6 / 24 / 24`px at both end cards → **3.6px of headroom**. A house-hand deck ring
  may grow its reach by 3.6px and not one pixel more at 1280×800.
- `gameCell.css:353` **forced-colors** — `outline: 2px solid Highlight; outline-offset: -2px`
  on `:focus-visible`, because `forced-color-adjust` strips the SVG ghost to a fragment. Any
  house-hand ring keeps a real outline under forced-colors.
- `e2e/a11y.spec.ts:536` **3.5 unnamedImages** — the 81 per-cell ghost `<svg>`s are
  `aria-hidden`; a ring redesign must not mint a named image node.

**No in-repo gate measures a focus indicator's own contrast.** The 3:1 figures above are this
lane's, and two rings are under the floor.

---

## (c) THE FILL METER (`logs/fillmeter-chromium.json`, `logs/phone-*.json`)

- **Form.** `HandDrawnGrid.vue:461-480`: four grain-baked poses of the frame's OWN rect
  (`generateFrameTraceFrames`, same seed/roughness/boil as the graphite frame, so it retraces
  it in registration), `stroke-width 8` viewBox units, `stroke-opacity 0.95`,
  `pathLength 1000`, `stroke-dasharray "1000 1000"`, `stroke-dashoffset 1000·(1−p)`. It
  opacity-swaps on the SAME 150ms boil beat as the grid, and the dash tweens
  `240ms ease` on a fill event (`no-preference` only).
- **Rendered size.** 8 user units × the measured scale: **5.09 CSS px** at 1280×800
  (scale 0.636), **2.96 CSS px** on the phone (scale 0.370, both engines). The formation's
  "8px violet stripe" is the viewBox number; the stripe you see is 3–5px.
- **Hue.** `stroke: rgb(139, 92, 246)` = `--color-progress-ink: #8b5cf6` (`index.css:278`;
  dark `#7c3aed`, `index.css:407`). It is the only violet in the product.
- **Placement — it does not straddle, it OVERHANGS.** The frame rect is inset
  `FRAME_X_PAD 12` on the sides and `FRAME_Y_PAD 0` top/bottom (`gridPaths.ts:338`), so the
  top side sits at viewBox y = 0 and half the 8-unit stroke plus the wobble's overshoot lands
  at negative y. Measured: the top ink band spans page-y **118.69 → 123.78** while the board
  svg's box starts at **124.45** — the whole top stripe is OUTSIDE the board box (the svg is
  `overflow: visible`). On the left the band is 132.13 → 137.21 against a box edge at 131.89,
  i.e. just inside. The stripe is asymmetric with the frame it claims to hug.
- **Label — none, visibly.** The only label is `role="progressbar"` on a 1×1 sr-only div:
  `aria-label "board fill"`, `aria-valuetext "board N% filled"` (`HandDrawnGrid.vue:299-307`).
  The only visible word "Fill" on the board page belongs to the FILL-FORCED **button**
  (`span.icon-sublabel: "Fill"`) and its washi tooltip "fill the cells that have only one
  digit" — a different act entirely. The one visible word that could name the meter names
  something else.
- **Growth.** At `progress === 0` the whole pose stack is **not rendered** (`traceNodes: 0`) —
  the meter does not exist until you write a digit. One keystroke on this deal took it
  0 → 5% (`aria-valuenow` 0 → 5; 20 fillable cells), which draws 5% of a 3,952-unit perimeter
  = **~126 CSS px of violet appearing at once** on a 636px board. `.solve-success` fades the
  trace to 0 over 500ms and pins the stack to pose 0.

---

## (d) THE HINT NOTE (`logs/hintnote-chromium.json`, `logs/hintnote2-chromium.json`)

`MarginNote.vue` renders one `role="status" aria-live="polite" aria-atomic` paragraph.
`.margin-note-ink` carries `ink-write-in 250ms var(--ease-noteWrite) backwards` — a clip-path
wipe IN. **There is no wipe out and no ageing rule anywhere in the component.**

The note's life is a single `watch(() => props.hint)` at `GameBoard.vue:685-707`, whose falsy
arm (T9-W1 §1.2, landed) calls `setMargin("", "graphite")` when `hintNoteLive`. `props.hint`
is `hintReasoning`, nulled at exactly five sites in `useGameState.ts`: **434** (clear /
restore), **487** (`applyCellValue` — any edit, yours OR a peer's, since `sessionSource.
applyValue` routes through it at line 375), **604** (deal), **770** (fill-forced), **790**
(the second hint press that inks the digit).

Measured, one fresh arm per act:

| act | note after |
|---|---|
| second H press (consume the hint) | **retracted** (`""`) |
| deal a new board | **retracted** |
| clear the board | replaced — "the board is clear" |
| fill forced | **retracted** |
| solve | replaced — "solved it!" |
| type a digit | **retracted** |
| **30 seconds of idle** | "only 8 fits here", opacity **1.000** |
| arrow to another cell | persists, opacity 1 |
| undo (no-op) | persists, opacity 1 |
| toggle dark mode | persists, opacity 1 |
| press P (pencil mode) | persists, opacity 1 |
| hold K (engine peek) | persists, opacity 1 |
| blur the board | persists, opacity 1 |
| scroll the page | persists, opacity 1 |
| press Escape (gallery) | persists, opacity 1 |

**Where the census moved:** the formation's "persists at opacity 1 through every later act
incl. joining multiplayer" is no longer true of board acts — W1 §1.2 gave the note its falsy
arm and all six board mutations retract or replace it. What remains, measured: **the note
never ages** (opacity 1.000 after 30s idle; the only animation is the 250ms write-in) and
**nine non-mutating acts leave it standing**, including navigating away from the board. On
the phone it is 16px Patrick Hand in a 188×21 box at y 523, in viewport, opacity 1.

Joining multiplayer is un-measured on the wire here, but the mechanism is decided: a JOIN
touches no board value, so it cannot reach any of the five null sites and the note stands. A
peer's first DIGIT, however, routes `sessionSource.applyValue` → `applyCellValue` → line 487
and **wipes your note on someone else's act** — which is a retraction rule nobody designed.

---

## What round zero hands the design step

Named in `findings`/`designQuestions` of this lane's return. The three that bind hardest:
the wobble cure is a PARAMETER and a POSE-RESIDENCY decision, not a new primitive and not a
new filter (census 9, `.cell-ghost-path` filter `none`); the deck ring has 3.6px of headroom
and two rings are already under 3:1; and the hint note's design question is no longer "what
retracts it" (six acts do) but "what ages it, and may a peer's keystroke take your note away".
