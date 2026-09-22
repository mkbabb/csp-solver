# G-BAR · fable — the lip: the strip is the pencil case's one compartment that never scrolls

T9-M18, "This needs to have a border in some way" (T9-M04 restated on the pass-4 product; ballot
T9-B8's deletion arm is dead). Designed against MAIN `1e6cfbbf` from the panel-bar census
(`../../census/panel-bar/README.md` §2 + `summary.json`, the M18 rows of 24 cells), the info census
read for the `i` coupling, the motion census not at all. No server was run by this lane and no port
was named for it; every number below is the census's or arithmetic on the census's measured parts,
and each says which. The owner disposes at the re-look (U-10). The frame is the ≥1024 fine rail
(m18 shows the `i`, which exists only there); the chair's intake row names the dock too (the bar's
edge is the only drawn edge at the bottom of the phone), so both are designed and both are gated.

## 0 · The thesis

**The tool strip becomes the fifth compartment of the pencil case — the one that never scrolls. It
wears the wells' own drawn frame (`HandDrawnOutline` stroke 1.5 · outset 4 · radius 3 · pose 0), its
side strokes on the same x as the compartments above it, in the card's foot outside the scrollport, so
the compartments dissolve DOWN INTO the lip through the fade instead of leaking AROUND a slab. Nothing
on the strip is a CSS border any more, the `i`'s ring included.**

What the owner's eye read in m18 is not a missing border so much as a broken one: two brackets either
side of the strip, which the census proved are the wells' side strokes (drawn 4 px outside their
boxes) passing beside a bar whose opaque slab is exactly the content width (§2: flank ink 88–151 px
per 7 px column, every scrolling cell, both engines, both themes). The strip has an edge on this tree
and the edge is somebody else's. The house has exactly one drawn-edge answer (R6 law 37 / L5), and
the card already applies it four times at one rung — `new game`, `pencils`, `checking`, `players` are
all `HandDrawnOutline :stroke-width="1.5" :outset="4" :radius="3" :pose="0"`
(`GameControlPanel.vue:761–765, 940, 1005, 1040`). The strip is a fifth thing in the same case; it
takes the same frame. What makes it the strip and not a well is its PLACE (the foot, fixed) and its
silence (no tape: the verbs name themselves) — identity from position, not from weight.

## 1 · Plan (tokens · type · layout · principles), then the tell review

**Colour — nothing new.** Paper `--color-card` (light `hsl(48 12% 99%)` / dark `hsl(24 6% 7%)`);
the lip's stroke is what every well's stroke is, `currentColor` at `stroke-opacity 0.95`
(`HandDrawnOutline.vue:159–160`) resolving to `--color-foreground` (light `hsl(0 0% 3.9%)` ≈ 18:1,
dark `hsl(48 10% 92%)` ≈ 15:1 on paper by arithmetic; the census read no painted AA on this strip —
gate G8 reads it); the verbs' words at `--color-muted-foreground` (index.css's own ledger: 4.646
light / 7.689 dark, declared not painted); the `i`'s glyph at `--ink-press-quiet`, its keycap stroke
at `--ink-press-rule` (55 %: 3.53 / 4.36, the ≥3:1 non-text rung). No accent hue enters (§3 untouched).

**Type — unchanged, by design.** `Clear · Fill · Solve · Share` at `--type-verb` (= `--type-caption`,
`typography.css:121`), glyphs at `--icon-verb` (30 / 32 coarse, `index.css:868/878`), the `i` at
`--type-small` in `--font-hand`. M18 is a border mark; a border that changes the type it borders is
two marks.

**Layout — the card is a scrollport over a fixed compartment.**

```
rail ≥1024 fine (chromium 324.22 wide; content 284.22)        dock 390×844 coarse (content 374)
┌ drawer case · stroke 3 / outset 4 ─────────────┐             ┌ case, strokes off-screen ─────┐
│ ┌ card-body · scrolls · p-5, gutter right ────┐ │             │ ┌ card-body · px-2 pt-1.5 ─┐ │
│ │ ┌ new game ─────────────────┐ (1.5/4/3)     │ │             │ │ ┌ new game …            │ │
│ │ └───────────────────────────┘               │ │             │ │ …  players  (scrolls)   │ │
│ │ ┌ pencils …                 ┐               │ │             │ │  ░░░ 2rem fade ░░░░░░░░  │ │
│ │  ░░░░░░░░ 2rem fade ░░░░░░░░  ← body's edge │ │             │ └────────────────────────┘ │
│ └─────────────────────────────────────────────┘ │             │  ┌ lip · 1.5/4/3 ────────┐  │
│   ┌ lip · 1.5 / 4 / 3 · pose 0 ──────────────┐  │  same x as  │  │ clear fill solve share │  │
│   │  clear    fill    solve    share      [i] │  │  the wells  │  └────────────────────────┘  │
│   └───────────────────────────────────────────┘  │             │   max(0.5rem, safe-area)     │
│         3.5rem note berth (rail only)            │             └─────────────────────────────┘
└─────────────────────────────────────────────────┘
```

The verbs stay `space-evenly` on the lip's spine, the `i` its trailing grid track (`1fr auto`),
left-to-right as today. The lip's box IS today's `.action-bar` box (284.22 × 64.81 rail fine ·
184 × 64.81 rail coarse · 374 × 66.77 at 390 · 414 × 66.77 at 430, census §2) — the frame is drawn
4 px outside it, so its strokes land at content ±4, which is where every well's strokes already are.

**Principles.** (1) One box grammar, one rung: the card has two stroke weights today (case 3, wells
1.5) and gains none. (2) The edge covers what it should and nothing else: with the strip out of the
scrollport there is no band beside it a well can enter, so the leak cannot recur by construction.
(3) The stack keeps its rhythm: at the end of scroll the last well's bottom stroke sits 8 px above the
lip's top stroke — the same daylight two consecutive wells keep (`margin-block: 0.5rem`, `:1502`).
(4) Nothing moves that the mark did not name, and each thing that does is priced below (§5).

**Tell review.** The generic answer to "this needs a border" is `border-top: 1px solid` — a toolbar
hairline, the iOS tab-bar divider; unlawful here (law 37) and, drawn or not, a RULE reads as a
divider between two regions, when the owner's frame shows a strip that is its own region with its
sides open. The second generic answer is a full box at a heavier weight to make the strip "important";
that mints a third rung and makes the verbs shout over `deal`, the card's one primary act. What I
removed on review: a washi tag naming the lip (`tools`) — an eyebrow over four words that already
name themselves, and CTRL-TAPE's voice to spend; and a drawn ring for the `i` at radius 14 — a second
corner grammar on the card for one 28 px node, when the thing the `i` opens is a crib of keycaps.

## 2 · Components and states

| component | form | states | notes |
|---|---|---|---|
| `#card-foot` | the card's second grid row (`grid-template-rows: minmax(0, 1fr) auto`), in flow, never sticky; carries the card's inline padding (rail `1.25rem`; dock `0.5rem`) and the bottom band (rail `3.5rem`, the note berth; dock `max(0.5rem, env(safe-area-inset-bottom))`, chair §6.1); `margin-top: calc(var(--outline-outset) * 2)` read off the lip's own container, no literal | — | the wells' strokes are clipped at the body's content-bottom edge 4 px above the lip's top stroke; the fade is opaque at that edge, so nothing severed is ever visible |
| `.tool-lip` (= `HandDrawnOutline` wrapping `.action-bar`) | `:stroke-width="1.5" :outset="4" :radius="3" :pose="0"` — the four props of `.tray-well`, `:762–765`; posed → one node, pruned, no beat, no layer, no filter | none: a pose-0 frame is still | worn at EVERY regime (rail fine · rail coarse · dock · landscape <1024); its box moves to the foot only where the card is a scrollport (rail + portrait dock, the same two keys `:2181` restates) |
| `.action-bar` (the strip itself) | `position: relative`, the note berth's containing block, `grid 1fr auto`, `padding-block: 0.4rem 0.15rem` — unchanged | `[data-fold-below]` no longer on this element | loses `position: sticky / bottom: 0 / z-index: 60`, `::before`, `::after`, and the `--action-bar-h` / `--card-pad-b` publishers (§8) |
| `.card-body::after` (the fade, moved) | `position: sticky; bottom: 0; height: 2rem; margin-top: -2rem; pointer-events: none; background: linear-gradient(to top, var(--color-card), transparent); opacity: 0` → `1` under `[data-fold-below]` — the bottom twin of `.controls-card::before` (scene.css:308–325), spanning the body's PADDING box so the wells' strokes at content −4 are inside it (today's fade is the bar's, content-wide — that is the leak's second cause) | 150 ms opacity, PRM snap | `publishFold` keeps publishing `data-fold-below` from the body's scroll box; unchanged formula |
| `.info-btn` (the `i`) | 32×32 hit box; the glyph box 28×28 becomes a drawn keycap: `HandDrawnOutline :stroke-width="1.5" :outset="0" :radius="3" :pose="0"` at `color: var(--ink-press-rule)`, the glyph `i` at `--ink-press-quiet` | `aria-expanded="true"` and hover (`hover: hover`): keycap stroke and glyph → `--color-foreground` (the two properties `:2342` already writes); `:focus-visible` the estate's ring, untouched | fine rail only (`:2315`); the CSS `border` + `border-radius: 50%` at `:2328–2329` die; a key that opens the keys |
| hover notes (rail) | children of the verbs, `top: 100%` of the strip, `margin-top: 0.1rem` — unchanged | 150 ms, `.group:hover` | the note now lies ASTRIDE the lip's bottom stroke (the stroke at +4, the note from +1.6), which is the tag's own pose on every well's top stroke: one tape grammar, two edges |
| coarse rail 1280×800 `hasTouch` | lip 184 × 64.81, no `i` (track collapses) | — | π on everything but the lip's own paint |
| landscape <1024 (844×390) | the card is in flow; the lip wraps the strip in place with `margin-block: 0.5rem` (a well's) | — | +8 px of flow above the strip, priced in §5 |

### 2.1 The geometry, stated once

- Lip box = content width × the strip's own height; strokes at content ±4 (x) and box ±4 (y);
  the stroke's outer edge at ±(4 + 0.75 + 0.45) = ±5.2 px (`outlineBoilPx` 0.45, `pencilConfig.ts:278`).
- Rail: the foot's padding-inline `1.25rem` equals the card's `p-5`; the body keeps `padding-right:
  calc(1.25rem − var(--card-gutter))` + `scrollbar-gutter: stable` (scene.css:352–356) so its content
  edge and the foot's content edge are the same x on both sides. The lip's right stroke and the
  wells' right stroke share one x: |Δx| ≤ 0.5 px (G3).
- Dock: foot padding-inline `0.5rem` (= `px-2`), bottom `max(0.5rem, env(safe-area-inset-bottom))`.
  The strip's bottom rises from 6 px to 8 px above the card's edge: the stroke's outer edge then
  sits 2.8 px inside the clip (at 6 px it would be 0.8 px, and the card's `rounded-lg` corner would
  cut the frame's corner: the corner point at (4, 2) from the card's corner lies 7.2 px from the
  8 px radius's centre — inside by 0.8 px; at (4, 4) it lies 5.66 px — clear). This is the one
  named move on the dock (§5).
- Daylight at the end of scroll: the last well's bottom stroke is 4 px above the body's content edge
  (margin 8 − outset 4); the lip's top stroke is 4 px below it (margin-top 2·outset); 8 px between
  strokes — the inter-well rhythm (G4).

## 3 · Motion — no new clock

- **The lip has no motion.** Pose 0: one static path per frame, no beat enrolment, no draw-on, no
  hover. It is drawn once at mount and stays drawn. Nothing to time, so nothing to re-time.
- **The fade keeps its window:** `transition: opacity 150ms`, the washi's window, today a `<style>`
  literal at `GameControlPanel.vue:2139` under `(prefers-reduced-motion: no-preference)`. It moves
  with the fade to `.card-body::after` and is NOT re-timed; MOT-LADDER's pass-5 `--motion-*`
  publisher names the 150 rung and the literal dies then, not here. Its easing is the UA default
  (`ease`) today and stays so — an easing row is MOT-VERB's, not a border's. PRM: no transition (a
  cut), the band paints instantly, on or off. Home: `pencilConfig.ts` `MOTION` when LADDER lands the
  rung; until then the moved literal is cited to this row.
- **On the dock the lip rides the sheet.** `MOTION.curves.drawerGlide` `cubic-bezier(0.32, 0.72,
  0, 1)` @ 520 ms, R6 law 1 — the case's mover, untouched; the foot is inside the case.
- **The `i`'s press** is instant today (`:2342` has no transition) and stays instant.

## 4 · Copy (M16 register, `check-copy-register` bare)

Nothing is written. `Clear · Fill · Solve · Share`, `sure?`, the four hover notes, `aria-label="what
the keys do"` — all unchanged. No tag over the lip (§1's review). No em dash, no metaphor, no name
for the strip in the UI; the word "lip" lives in this file and in a class name, never on the sheet.

## 5 · Desktop and phone · light and dark — what moves, priced

| cell | today (census §2) | designed | Δ (named) |
|---|---|---|---|
| 1280×800 fine, chromium / webkit | bar 284.22 / 292.31 × 64.81, 56 above card bottom, borderless; flank ink 100/91 · 88–142 | lip 284.22 / 292.31 × 64.81 in the foot, strokes at content ±4; flank ink 0 | the strip's own pixels only; the card 324.22 / 332.31 and the board's x identical (G7) |
| 1440×900 fine | 290 / 298 × 65.16 | same form | none but the lip |
| 1024×768 fine | content 275.59 | lip 275.59 wide | none but the lip |
| 1280×800 coarse (iPad rail) | 184 × 64.81, `i` `display:none`; webkit reads the card 591 tall vs 608 (census gap, unattributed) | lip 184 × 64.81 | none but the lip; the 591/608 gap is inherited, not this row's |
| 390×844 coarse | bar 374 × 66.77, bottom 6.00 above the viewport; `players` leaks L4/R4 | lip 374 × 66.77, box bottom 8 px above the card edge; bottom stroke 4 px; leak 0 | the strip rises 2 px (the card is capped at 628, so the card's box and the board do not move) |
| 430×932 coarse | 414 × 66.77; card uncapped (675/675) | same | the card grows 2 px; the sheet is bottom-anchored, so the board must read identical (G7 reads it) |
| 844×390 landscape | strip in flow, siblings below | lip in place, `margin-block: 0.5rem` | +8 px above the strip; the cell already overflows the viewport on HEAD (registry-v3 §1 TABS's critic: undo/redo/hint at y 1055–1180) — nothing reachable changes; W2 §2.2 governs the cell |

**Light and dark:** every ink is a token that resolves per theme; the lip's stroke is the wells'
stroke; the keycap's is the `rule` rung. The census read no geometry change across themes and this
design adds no theme-conditional rule. AA is READ from painted bytes at 2× in both themes (G8), not
asserted from the table. `prefers-contrast: more` / reduced-transparency (law 44): the fade is an
opaque-to-transparent gradient of the card's own paper over the card's own content, not a sheet;
nothing shows through it that is not already the card.

## 6 · The fallback (if the foot slips a pass): the lip in place

If `#card-foot` does not exist when M18 lands, the strip stays sticky in the scrollport and takes
the same frame with one change: the slab widens by the wells' reach so their strokes die under it.
`.action-bar { margin-inline: calc(-2 * var(--outline-outset)); padding-inline: calc(2 *
var(--outline-outset)) }` (−8 / +8), the lip at `:outset="0"` around the widened slab — stroke at
content −8, 4 px proud of the wells (a tray's lip is proud of its compartments; the alignment thesis
is spent). The `::before` fade widens with the slab (it is `inset: auto 0 100% 0`) and covers the
strokes' band. Everything W2/T6 landed stays: skirt, publisher, `scroll-padding-bottom`, z 60. Same
gates G1/G2/G6/G8/G9; G3 becomes "lip stroke at content −8 ± 0.5", G4 does not apply. Declared gap: it
keeps the crib under an opaque bar (M16 stays a timing defect) and keeps three measured tokens alive
for one band. It is the cure for the mark, not the design.

## 7 · Ballots (the owner's, at the re-look)

1. **The lip's rung.** Default 1.5 (the wells' — the strip is a compartment). Alternative 3 (the
   case's — the strip is the case's floor). Both frames on the 1280×800 fine rail and the 390×844
   dock, both themes.
2. **The `i`.** Default the drawn keycap (radius 3, the card's one corner rung; matches the `kbd`s it
   opens). Alternative G-INFO's drawn circle (radius 14). On a 2× crop, closed and pressed.
3. **The dock's foot band.** Default `max(0.5rem, env(safe-area-inset-bottom))` (the strip rises
   2 px). Alternative `max(0.375rem, env(…))` keeps today's 6 px if the crop shows the corner clean
   at 0.8 px of clearance.

## 8 · What DIES

- `GameControlPanel.vue:2181–2197` — `position: sticky; bottom: 0; z-index: 60` and the T7-W7
  occlusion comment (the ladder "≤1 < 30 < 35 < 50 < 60" loses its top rung; `SheetWashiLabel`'s 50
  note is re-cut to say so).
- `:2123–2143` — `.action-bar::before` (→ `.card-body::after`, the top sentinel's twin) and its
  150 ms literal (moves, un-retimed).
- `:2198–2232` — the skirt `::after` and its whole comment; `:588–628`'s `--card-pad-b` /
  `--action-bar-h` publisher arm (one ResizeObserver reader fewer); `scene.css:264`
  `scroll-padding-bottom: var(--action-bar-h, 0px)` → `2rem` (the fade's own height, static, the
  twin of `scroll-padding-top: 2.4rem` at `:298`) — a `var()` fallback dies with it.
- `:2328–2329` — `.info-glyph`'s `border: 1.5px solid` + `border-radius: 50%` (→ the keycap).
- `scene.css:156`'s `padding-bottom: 3.5rem` and `GameScene.vue:196`'s `p-5` / `px-2 py-1.5` are
  SPLIT, not deleted: inline + top to the body, inline + bottom to the foot, one commit, both ends
  noted (W2's refusal of a spelled constant in a second file is honoured by reading `p-5` in both).
- `OptionSelector.vue:175`'s stale premise is G-PANEL's row, not this one's; nothing else in the card
  is touched.

## 9 · Born-RED gates (on main `1e6cfbbf`; each names its reading at HEAD)

| # | gate | reads on main |
|---|---|---|
| G1 | R6 row R3 (the r0 probe's, the chair's open row): the strip's edge is a `HandDrawnOutline` path in the rendered DOM — a `path[stroke-width="1.5"]` inside the strip's frame, present at rail fine 1280×800 / 1024×768 / 1440×900, rail coarse 1280×800 `hasTouch`, dock 390×844 / 430×932 `hasTouch`, landscape 844×390 `hasTouch`, both engines; computed `border-*-width` 0 on `.action-bar` | RED: no path; the bar is a colour-matched slab (census §2) |
| G2 | the flank leak (the census's own instrument, `probe.mjs`): at the leak pose (a well's top stroke crossing the body's bottom edge) the ink in both 7 px columns beside the lip over its height PLUS the 2 px band above its top stroke = 0, both engines, both themes, every scrolling cell | RED: 88–151 px per column |
| G3 | alignment: the painted centroid of the lip's left and right side strokes vs the nearest well's, |Δx| ≤ 0.5 px both sides, both engines, rail fine + coarse + dock 390 (`paintedExtent`, CTRL-FACE's instrument) | RED: no lip |
| G4 | rhythm: scrolled to the end, daylight between the last well's bottom stroke and the lip's top stroke = 8 ± 0.75 px (rail fine 1280×800; dock 430×932 which does not scroll) | RED: form absent |
| G5 | the foot on the inset (chair §6.1): `env(safe-area-inset-bottom)` present in the foot's source rule; computed `padding-bottom` = 8 px both engines at 390×844 `hasTouch`; one RUNSHEET line (`evidence/w8/device/RUNSHEET.md`) reads the lip's bottom stroke above the home indicator on the real iPhone | RED: no `env()` in any product rule (census §2) |
| G6 | two hands: computed `border-width` 0 on `.info-glyph`, the lip and the strip; the keycap's drawn path present at 1.5; the crib's 7 `kbd` on G-INFO's named exemption (its ballot 2) | RED: 1.5 px CSS ring |
| G7 | π identity vs the HEAD control: card 324.22 / 332.31 and board-left ± 0.5 at 1280×800 (chromium / webkit); board rect and masthead identical at 390×844 and 430×932; the deck untouched; every cell's tags + computed paint properties identical outside the strip's own box, its frame band (±5.2 px) and the two NAMED deltas (dock strip +2 px up; landscape +8 px) | identity gate (GREEN on main by definition; RED if the split moves the card or the board) |
| G8 | AA from painted bytes at 2×, both themes: lip stroke ≥ 3:1, keycap stroke ≥ 3:1 closed and pressed, sublabels ≥ 4.5:1 on paper and under the fade at its opaque end | UNREAD on main (census §4 names the gap) |
| G9 | filter census 9/9 on the served dist, both engines; `.outline-svg.is-pruned` on the lip and the keycap (one node each, zero promoted layers) | identity |
| G10 | keyboard: `scroll-padding-bottom: 2rem` on the body; a Tab walk through the card lands every focused control's rect fully above the fade band, both engines, 1280×800 + 390×844 | RED once `--action-bar-h` dies unless the static 2rem lands the same commit (today 86 px measured) |
| G11 | the note berth (W2 §2.5's census, re-run): each rail hover note lies in the foot's bottom band, its top ≤ 5 px below the lip's bottom stroke; no note covers a control at any scroll offset | identity, must survive the move |
| G12 | `check-copy-register` bare; `lint:motion`; `ledger-diff --verify-cites` | identity |
| G13 | `grep -c 'action-bar-h\|card-pad-b'` in `src/` = 0; `grep -c 'env(safe-area-inset-bottom)'` in product css ≥ 1 | RED: 12 hits / 0 hits |

## 10 · Row owners (pass-5 charter)

- **CTRL-TAPE / CTRL-RULE (B8's default, the `#card-foot` movers):** the split (body + foot, the
  padding halves, the fade's move, `scroll-padding-bottom: 2rem`), the lip at the wells' four props,
  G1–G5, G7, G10–G13. TAPE's existing `--safe-b` row is G5 as written; RULE's "one drawn top rule"
  sentence is answered by ballot 1 (a full frame at 1.5; the rule form is not proposed).
- **CTRL-FACE (§10 leader):** the keycap `i` (G6, G8), the `paintedExtent` reads (G3, G8).
- **G-INFO's lid** is the same node: the crib as the foot's first child inside this lip. The two
  designs compose without a second frame; whichever lands first, the other adds no edge.
- **MOT-LADDER:** the 150 rung for the moved fade literal; nothing else here is theirs.
- **Chair's row:** the landscape cell's +8 px and the dock's +2 px are this design's named costs;
  if either is refused, ballot 3's alternative keeps the dock at 6 px, and the landscape lip may take
  `margin-top: 0` at the cost of a double stroke against the last well (rejected here, framed there).

## 11 · Gaps (this lane's own)

- No prototype, no server, no port: every geometry number is the census's box arithmetic plus the
  outline's documented offsets (outset 4, stroke 1.5, boil 0.45). The split's π cost on the rail card
  width (webkit's 332.31 vs chromium's 324.22 is itself unattributed in the census) is G7's to read.
- The 28 px keycap at 2× is unseen; ballot 2 exists because of that.
- The end-of-scroll rhythm (8 px) assumes the last well's `margin-bottom: 0.5rem` is not collapsed by
  the body's flex column — it is a flex item today (`.control-panel-wrap` is flex-col), so margins
  do not collapse; if the split changes that container, G4 catches it.
- AA numbers are the ledger's declared ratios, not painted reads; G8 is the read.
- The real-device safe-area overlap is unmeasured (Playwright supplies no inset); G5's RUNSHEET line
  is the read.
- The owner's word is "a border in some way"; this design says "a compartment". If the re-look wants
  a rule and not a box, CTRL-RULE's drawn top rule is the lawful second form; it is not framed here.
