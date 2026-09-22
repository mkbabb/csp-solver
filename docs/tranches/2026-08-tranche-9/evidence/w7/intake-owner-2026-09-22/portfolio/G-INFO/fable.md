# G-INFO · fable — the keys are written on the inside of the lid

T9-M16, "The 'i' button clicking does not properly scroll the panel." Designed against MAIN
`1e6cfbbf` from the info census (`../../census/info/README.md`, 24/24 desk cells reproduced) and the
panel-bar census (`../../census/panel-bar/README.md`). No server was run by this lane; every number
below is the census's or arithmetic on it, and says which. The owner disposes at the re-look (U-10).

## 0 · The thesis

**Press the "i" and the lid lifts: the key crib unfolds INSIDE the bar's drawn edge, directly above
the verbs where the eye already is, and the panel above gives up the height. Nothing scrolls.**

The mark's sentence is "does not properly scroll". The census proved why: the scroll is issued once,
before the crib has a height, against a range that is about to grow, and what grows lands under an
opaque sticky bar (0.001–0.004 of the crib visible in every cell, both engines). A better-timed scroll
cures the defect and keeps the shape that caused it: a note at the far end of a scrolling body,
behind the strip that holds its own button. The design half of M16 is where the crib LIVES. It lives
with its "i". Once the bar moves to the card's foot (T9-B8's firing default, chair pass-4 §3) and
wears its edge (M18), the foot is a lid, the crib is what's written on the underside of it, and M16
stops being a timing problem: the reader looks at the "i", presses it, and the crib opens under the
same gaze, one move, on one clock. That is also the only form the census's own constraint allows: the
crib must not cover a live control (CTRL-RULE's ribbon defect at 1.000 over four controls), so an
out-of-flow popover is dead; in flow, at the foot, is the lawful place.

## 1 · Plan (tokens · type · layout · principles), then the tell review

**Colour — nothing new.** Paper `--color-card` (light `hsl(48 12% 99%)` / dark `hsl(24 6% 7%)`); the
crib's words at `--ink-press-quiet` (68 % graphite: 5.23 light / 6.06 dark, the AA caption rung); the
keycaps' and the ring's strokes at `--ink-press-rule` (55 %: 3.53 / 4.36, the ≥3:1 non-text rung); the
pressed "i" at `--color-foreground`; the lid's stroke in `--color-pencil-graphite` like every drawn
frame in the card. No accent hue anywhere in this surface (§3's accent-family law untouched).

**Type — one hand.** The crib stays Patrick Hand (`--font-hand`) at `--type-caption`, the "i" glyph
at `--type-small`; CTRL-FACE's law says a pencil wrote every note and value, and a crib is a note.
No Fraunces enters the lid (the verbs' sublabels are the strip's own business, M18's row).

**Layout — the card is a scrollport over a lid.** Desk rail ≥1024 px, fine pointer only (the crib
and the "i" are keyboard things; coarse surfaces keep neither, by the estate's own design):

```
┌ drawer case ───────────────────────────┐
│ ┌ scrollport (minmax(0,1fr)) ────────┐ │
│ │ new game · pencils · checking ·    │ │   the body scrolls; its bottom edge keeps the
│ │ players … (dissolves at the edge)  │ │   2rem fade, published by data-fold-below
│ └────────────────────────────────────┘ │
│ ┌ lid = #card-foot, drawn 3/4 ───────┐ │
│ │ K peek         G games             │ │ ┐ the crib: 2-col dl, opens 0fr→1fr
│ │ H hint         P pencil            │ │ │ inside the lid, ABOVE the verbs
│ │ D deal         ⌘/Ctrl Z undo       │ │ │ (≈94–100 px, the census's dl h)
│ │ ⌘/Ctrl ⇧ Z redo                    │ │ ┘
│ │  clear    fill    solve   share  (i)│ │   the verbs, then the drawn "i" ring
│ └────────────────────────────────────┘ │
└────────────────────────────────────────┘
```

Left-aligned crib in its existing two columns; the "i" stays the trailing grid track (`1fr auto`).
The lid is one `HandDrawnOutline` (strokeWidth 3 / outset 4 / `:pose="0"`, the guard ribbon's rung,
R6 row 48 + law 37) around BOTH the crib and the verbs, so the crib never has an edge of its own: it
is inside the strip's edge, which is M18's edge. Opening adds no second frame, no rule, no tape.

**Principles.** (1) The thing you open appears where you opened it. (2) One drawn hand per strip: the
"i"'s CSS ring and the lid's edge are cut together (the census's "two hands in one strip" row).
(3) The crib is in flow and clipped by `clip-path`, never `overflow: hidden`, never `display: none`
(a11y 3.4's webkit `innerText` law, `GameControlPanel.vue:1210–1218`) — and its max-content still
sizes the rail. (4) No scroll is issued by the press. Ever.

**Tell review.** The generic answer to "the scroll doesn't work" is to fix the scroll (the fallback,
§6, exists and is named as a fallback). The generic answer to "a keyboard legend" is a `?` popover or
a modal; both are out of flow and unlawful here. The drawn lid isn't a card-kit affordance, it's the
house's one box grammar applied to the one box in the card that had none. What I removed on review:
a visible "keys" tape over the crib (an eyebrow, and CTRL-TAPE's voice to spend, not mine — a ballot
in §7) and an Escape-closes arm (a new mechanic the mark doesn't demand).

## 2 · Components and states

| component | closed | opening | open | notes |
|---|---|---|---|---|
| `#card-foot` (the lid) | drawn frame 3/4 pose 0 around the verbs + "i"; height = verbs row | grows by the crib's height on the ONE clock (§3); the scrollport row shrinks the same px the same frame (grid `minmax(0,1fr) auto`, no second transition) | frame around crib + verbs; `padding-bottom: max(<own pad>, env(safe-area-inset-bottom))` (chair §6.1, coupled to TAPE/RULE) | the lid's slab spans content-edge −4 so no well stroke leaks round it; with the bar out of the scrollport the leak dies structurally (panel-bar §2) |
| `.legend-fold` (the crib) | `grid-template-rows: 0fr`, `clip-path: inset(0)`, in flow, first child of the lid | `0fr → 1fr` | `1fr`; `<dl>` 2 columns, gap `0.15rem 0.75rem`, margin-bottom `0.5rem` — unchanged | PRM: `transition: none` (a cut) — unchanged |
| `.info-btn` (the "i") | 32×32 hit box, drawn ring 28 px (§2.1), glyph `i` at `--ink-press-quiet`, stroke `--ink-press-rule` | — | `aria-expanded="true"`: glyph and stroke → `--color-foreground` (the two properties the pressed rule already writes, `:2342`) | hover (fine, `hover: hover`) = the same lift; `:focus-visible` = the estate's ring, untouched; `aria-controls="keys-fold"` resolves to the fold inside the lid |
| coarse rail 1280×800 `hasTouch`, dock 390/430 | no "i" (`display:none` / `v-if`), no crib | — | — | π identity: zero DOM and zero paint delta from this design on any coarse cell |

### 2.1 The ring, cut with the edge

The "i"'s ring is today `border: 1.5px solid var(--ink-press-rule); border-radius: 50%` (`:2328`) —
the strip's only edge, and a CSS one. Under law 37 the lid's edge is drawn, so the ring becomes drawn
the same day: `HandDrawnOutline :stroke-width="1.5" :outset="2" :radius="14" :pose="0"` on a 28 px
glyph box (posed frames enrol no beat and mint no filter; filterBudget stays 9). Pressed/hover state
= the frame's stroke takes `currentColor`, the glyph `--color-foreground`. If the 28 px drawn circle
reads as a blob at 2× (a real risk, §8), the second lawful form is a seeded SVG circle path in
`scribbleUnderline.ts`'s grammar (mulberry32, stroke 1.5) — a drawn mark either way, never a border.
The adjudicator picks on a crop; both are one node, zero filters.

## 3 · Motion — one clock, one rung

- **Verb:** the lid lifts. `grid-template-rows 0fr → 1fr` on `.legend-fold`, `var(--ease-drawOn)`
  (`cubic-bezier(0.33, 1, 0.68, 1)`, the fold's ratified curve — not re-eased), duration
  **`MOTION.chromeLeaveMs` = 200 ms**, the ladder's 200 rung (the fold already runs 200 as a `<style>`
  literal, `:2291`; the literal dies, the rung is read — MOT-LADDER's `--motion-*` publisher names it
  in pass 5; no new number, no new curve). Home: `pencilConfig.ts` `MOTION`.
- **The scrollport's shrink is not a second animation.** It's the grid's `1fr` row following the
  lid's `auto` row inside the same transition frame. One property tweens; one box grows, one shrinks.
  Trace gate G3 measures exactly that: the lid's top edge is a monotone curve with no discontinuity.
- **No scroll.** `toggleKeys()` flips `keysOpen` and nothing else. `scrollTop` Δ = 0 from the top and
  from the end (G2). The fade at the scrollport's bottom edge (`data-fold-below`) keeps saying
  whether anything is under it.
- **PRM is a cut:** the fold's `transition: none` arm stays; the crib is full height on the press
  frame (the census's ablation 1 is exactly this pose: 1.000 visible, 0 px under the bar).
- **Close** is the same clock reversed; the scrollport grows back; no scroll is issued on close either.

## 4 · Copy (M16 register, `check-copy-register` bare)

Nothing new is written. `aria-label="what the keys do"` stays; the `<dl>`'s `aria-label="Keyboard
shortcuts"` stays; rows `peek · games · hint · pencil · deal · undo · redo` render the policy's own
table. No heading is added over the crib (see §7 ballot 1). No em dash, no metaphor, no machine name.

## 5 · Desktop and phone · light and dark

- **Desk fine, ≥1024 (the mark's surface):** the whole of §2. Height budget (arithmetic on the census):
  crib ≈ 102–108 px incl. margin (chromium 101.8 / webkit 105.8 at 1280×800). Scrollport with the crib
  open: 1280×800 608 → ≈ 502; 1280×720 ≈ 528 → ≈ 422; 1024×768 576 → ≈ 468; 1440×900 640 → ≈ 534.
  Floor gate G10: ≥ 400 px at every fine desk rung ≥ 1024×768.
- **Desk coarse (iPad rail), dock 390×844 / 430×932, landscape <1024:** no "i", no crib, unchanged.
  The lid's own move to the foot on the dock is TAPE/RULE's M18 row; G-INFO adds nothing there.
- **Light and dark:** every ink is a ladder token that resolves per theme (`--ink-press-*` are
  color-mixed from the theme's graphite); the lid's frame stroke is the card's frame ink. The census
  read no geometry change across themes; this design has no theme-conditional rule. AA is READ from
  painted bytes at 2× in both themes (G5), not asserted from the computed table.

## 6 · The fallback (if pass 5 does not land the foot): the minimum cure, declared as a fallback

If `#card-foot` doesn't exist when M16's fix lands, the crib stays in the scroll body and the press
aims at the crib's FINAL height on the same frame: read `fold.firstElementChild.scrollHeight` (the
inner box keeps its own height at `0fr`), then `card.scrollBy({ top: <that>, behavior: "smooth" })`
in the press's `nextTick` — or scroll on `transitionend` filtered to `grid-template-rows`. Acceptance
= the census's counterfactual c3: crib visible 1.000, bottom ≥ 0 px above the bar's top, both
engines, from the top and from the end, pointer and Enter; PRM instant. **Declared gap:** the smooth
scroll's UA clock (207–406 ms measured) and the 200 ms grow are two clocks; under M09 that's a
defined-enough single gesture only because they start on one frame and end within a beat of each
other, not a designed one. It's the cure for the defect, not the design; the lid is the design.

## 7 · Ballots (the owner's, at the re-look)

1. **A visible name over the crib?** Default NO (the "i" is its heading; a tape would be an eyebrow
   and CTRL-TAPE's voice). If the owner wants one: the word `keys` in the tape hand.
2. **The keycaps' 1.5 px CSS borders (`KeyboardLegend.vue`, 7 `kbd`).** They are the crib's
   keycaps, not chrome, and law 37 is about chrome; default KEEP with a named exemption in the
   two-hands gate (G6). Alternative: drawn keycaps at `strokeWidth 1.5` — seven posed frames, zero
   filters, ~7 nodes.
3. **The ring's form** (§2.1): drawn `HandDrawnOutline` circle vs a seeded SVG path. On a 2× crop.

## 8 · What DIES

- `GameControlPanel.vue:150–155` — the `nextTick → scrollIntoView({ block: "nearest" })` and
  `:143–146`'s comment ("the fold rides into the scrollport as it opens" — false 24/24).
- `:2328–2330` — the `.info-glyph` CSS border + `border-radius: 50%` (→ a drawn ring).
- `:2291` — the `200ms` literal (→ the rung).
- `:1219–1227` — the fold as the last child of the scroll body (→ the lid's first child).
- With the bar in the foot (TAPE/RULE's row, coupled): `scroll-padding-bottom: var(--action-bar-h,
  0px)` (`scene.css:264`) loses its reason and its `var()` fallback with it; the `::after` skirt
  (`:2228`) dies; the `::before` fade moves to the scrollport's bottom edge.

## 9 · Born-RED gates (on main `1e6cfbbf`; each names its reading at HEAD)

| # | gate | reads on main |
|---|---|---|
| G1 | e2e, both engines, 1280×800 · 1024×768 · 1440×900 fine, from the top and from the end, pointer click and keyboard Enter: ≤ 700 ms after the press the crib `<dl>`'s painted-visible fraction ≥ 0.99 (`paintedExtent`, CTRL-FACE's instrument — not rects) and its bottom ≥ 0 px above the verbs' row top | RED: 0.001–0.004 (census) |
| G2 | no scroll: `scrollTop` Δ = 0 on press from the top and from the end; the scrollport's `clientHeight` shrinks by the crib's height ± 0.5 px, both engines | RED: Δ 102–108 from the top; form absent |
| G3 | one clock: a rAF trace of the lid's top edge from press to settle — monotone, max per-frame step ≤ 1.35× the drawOn curve's predicted step at that frame, settle ≤ 200 ms + 2 frames; under `reduce` exactly 1 frame | RED: no lid |
| G4 | π identity vs the HEAD control: card width 324.22 / 332.31 (chromium / webkit, 1280×800) and board-left ± 0.5; every coarse cell (390×844, 430×932, 1280×800 `hasTouch`): zero delta in the strip's tags + computed paint properties | identity gate (GREEN on main by definition; RED if the lid drops the crib's max-content) |
| G5 | AA from painted bytes at 2×, both themes: crib `dd` text ≥ 4.5:1, keycap strokes ≥ 3:1, the "i" ring stroke ≥ 3:1 closed and pressed | UNREAD on main (the census names this gap) |
| G6 | two-hands census: computed `border-*-width` 0 on `.info-glyph`, the lid and the strip; the crib's 7 `kbd` on a named exemption list with a reason (ballot 2) | RED: 1.5 px on the ring |
| G7 | filter census 9/9 on the served dist, both engines | identity |
| G8 | `check-copy-register` bare | identity |
| G9 | a11y 3.4: `.keyboard-legend` `innerText` non-empty in webkit while CLOSED; `aria-controls` resolves | identity (must survive the move) |
| G10 | scrollport floor: with the crib open, the scrollport `clientHeight` ≥ 400 px at every fine desk rung ≥ 1024×768, both engines | RED: form absent |

## 10 · Row owners (pass-5 charter)

- **CTRL-FACE (§10 leader) + CTRL-TAPE / CTRL-RULE (B8's default, the `#card-foot` movers):** the
  lid form — crib first child of the foot, inside the drawn edge, the grid `minmax(0,1fr) auto` card;
  G1/G2/G4/G6/G10. The ring's cut rides M18's edge row.
- **MOT-VERB / MOT-LADDER:** the 200 rung read from `MOTION` (the literal's death), the one-clock
  trace G3, PRM's cut.
- **Chair's row:** M16 is a desk mark; the coarse "i" question is not in the owner's words and is
  not proposed. The fallback (§6) is booked only if the foot slips a pass.

## 11 · Gaps (this lane's own)

- No prototype, no server: the lid's π cost (does `#card-foot`'s in-flow max-content size the rail
  exactly as the scroll-body fold did? the estate's own comment says a `v-show`/absolute form costs
  ~48 px and walks the board 24 px) is arithmetic, not paint. G4 is the check.
- The 28 px drawn circle is unseen at 2×; ballot 3 exists because of that.
- AA numbers are the ladder's declared ratios (5.23/6.06, 3.53/4.36), not painted reads; G5 is the
  read.
- Heights are census parts summed (crib 93.8–99.7 + 8 margin); the settled lid height on a built
  tree is unmeasured.
- The owner's sentence says "scroll"; this design says "no scroll". If the owner's re-look wants the
  panel to move, §6 is the form that honours the word.
