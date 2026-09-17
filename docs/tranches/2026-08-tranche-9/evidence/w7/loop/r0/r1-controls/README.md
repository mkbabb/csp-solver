# T9-W7 round zero · lane R1 — THE CONTROLS ESTATE

The census the portfolio designs against: every heading voice, every button treatment, the
card's chrome, the mobile tabs and the quick-action inventory, measured on THIS tree
(uncommitted W3/W6 work included) at 1280×800 · 390×844 · 900×500, chromium and webkit.

Round zero is read-only on the product. Nothing under `src/`, `e2e/` or `scripts/` was
touched. The probes live in `probe/` and run against a lane dev server on 127.0.0.1:4231 with
their own config; the estate's default config is never invoked.

**Re-derivation note.** The formation census (registry F18, 2026-08-10) predates W1–W6. Every
number below is re-measured at HEAD `4686436f` + the working tree, and each row says where it
moved. Type sizes are now FLUID (W2 §2.6 routed every control label through a role token), so a
figure without its viewport is meaningless — the formation's "14.4px" was a 1440 reading and is
14.05px at 1280, 14.00px at 390.

## Files

| file | what it holds |
|---|---|
| `census-{cell}-{engine}.json` | the full census: headings, buttons, chrome, mobile tabs, option groups, act inventory, tokens |
| `chrome2-{cell}-{engine}.json` | the shut dock, the drawn stroke, the focus idiom |
| `born-red-head.txt` | the §1 instrument's RED at HEAD — 4 cells, 4 failed, 0 passed |
| `structural-map-390x844.txt` · `structural-map-1280x800.txt` | the card's DOM outline with boxes |
| `m03-case-stroke-cuts-wordmark-390x844-chromium.png` | the case's drawn top stroke at the wordmark's foot (24.0 KB) |
| `m08-mobile-tabs-390x844-chromium.png` | the tabs, the two underline idioms, heading == option size (12.4 KB) |
| `m04-bar-no-border-390x844-chromium.png` | the floating bar, borderless, between two drawn strokes (24.7 KB) |
| `probe/` | `pw.config.ts`, `census.spec.ts`, `chrome2.spec.ts`, `heading-voice.spec.ts` |

Run: `cd web/frontend && NODE_PATH=$PWD/node_modules npx playwright test --config=<probe>/pw.config.ts`
with `npx vite --host 127.0.0.1 --port 4231 --strictPort` up.

---

## (a) THE HEADING CENSUS — three voices, two ranks, five-for-five

Eight nodes name a control group. They speak in **three** voices and hold **two** document
ranks. Both engines agree to the hundredth.

| name | node | voice @1280 | voice @390 | document rank |
|---|---|---|---|---|
| size | `h2 > span.section-heading` | Fraunces · 25.89 · 800 · lowercase | Fraunces · 20.35 · 800 · lowercase | `<h2>` |
| level | `h2 > span.section-heading` | Fraunces · 25.89 · 800 · lowercase · **crayon-green** | same | `<h2>` |
| new game | `span.washi-tag` | Patrick Hand · 14.05 · 500 · lowercase | Patrick Hand · 14.00 · 500 · lowercase | — (`aria-labelledby` only) |
| pencils | `span.washi-tag` | ″ | ″ | — |
| checking | `span.washi-tag` | ″ | ″ | — |
| players | `span.washi-tag` | ″ | ″ | — |
| marks | `span.zone-row-label` | Patrick Hand · 14.05 · **400** · **none** · 68% α | Patrick Hand · 14.00 · 400 · none | — |
| candidates | `span.zone-row-label` | ″ | ″ | — |

Five option groups (size · level · marks · candidates · checking) carry three of these voices.
The `checking` group is named by its well's tape and has no caption of its own; `marks` and
`candidates` share one well and each carries a caption. **Ink is a fourth axis inside one
voice**: `size` writes at `--color-muted-foreground` and `level` writes in the selected tier's
crayon, so one typographic voice already paints two ways by DATA.

**The rank that moved and the rank that didn't.** The formation counted "only two are document
headings" and that is unmoved: 2 of 8. What moved is the SIZE mechanism — W2 §2.6 gave the
heading a role (`--type-group-title`) with two arms (√φ 20.35px under 768, φ 25.89px above), so
W7 re-points one right-hand side rather than sweeping call sites.

**M03's mark as a number.** At 390×844 the group heading computes to **20.35px** and the option
chip it captions computes to **20.00px** — a ratio of **1.018**. The desk ships **1.294**
(25.89/20). On the phone the title and the words under it are one size; that is "the section
titles need to be larger" in arithmetic, and `m08-mobile-tabs-390x844-chromium.png` is the
picture of it.

### The born-RED instrument

`probe/heading-voice.spec.ts` — three soft rows, run at desk and dock, both engines. **4 cells,
4 failed, 0 passed** (`born-red-head.txt`):

- ROW 1 · ONE VOICE — `["Fraunces · 25.89 · 800 · lowercase", "Patrick Hand · 14.05 · 500 ·
  lowercase", "Patrick Hand · 14.05 · 400 · none"]` → expected 1, received **3**. RED at both
  cells, both engines.
- ROW 2 · ONE RANK — expected 8, received **2**. RED at both cells, both engines.
- ROW 3 · THE NAME OUTRANKS WHAT IT NAMES — floor 1.23 (the desk's own 1.294 less 5%).
  Dock: **1.0175** RED. Desk: 1.294 GREEN — correctly, since the law is the product's own
  desk behaviour, not a new taste.

The instrument states the law and nothing about the answer, so any portfolio design can green
it. It asserts on computed values, so a re-point of `--type-group-title` greens ROW 3 without
this file learning a literal.

---

## (b) THE BUTTON CENSUS — seven treatments, five radii, five "this one is on" idioms

Counted as distinct (border · radius · fill · family · size-role · selected idiom) tuples.
The formation said "four in the card + three on the toolbar"; measured at HEAD it is **six in
the card + the tongue beside it**, and the toolbar's three became **two** because W2 §2.7 moved
the tongue out of the ribbon onto the board's edge.

| # | treatment | selector | border | radius | fill | face · rung | hover | active | selected idiom |
|---|---|---|---|---|---|---|---|---|---|
| 1 | **option row** | `.ctrl-btn` | **none** (0px) | 6px | transparent | Fira Code · `--type-option` 20/22px | fine only: ink→fg + seeded GHOST underline; selected chip redraws one boil pose | — | bold 700 + crayon/fg ink + **hand-drawn seeded scribble underline** (data-URI, 8px, `label.length+1`ch) |
| 2 | **primary act** | `.icon-btn.deal-btn` | **none** | 8px | transparent | glyph `--icon-act` 36/40px + Patrick Hand `--type-act` 16px | bg→`--color-accent`, ink→fg | `scale(.93)` | none — transient: sublabel → "sure?" in `--color-red-ink` w600 |
| 3 | **icon verb / tool** | `.icon-btn` | **none** | 8px | transparent | glyph `--icon-verb` 30/32px (bar) or `--icon-tool` 26/30px (fold) + Patrick Hand `--type-verb` 14.05/14px | same | `scale(.93)` | none |
| 4 | **info whisper** | `.info-btn > .info-glyph` | **1.5px solid `--ink-press-rule`** (the card's ONLY drawn control border) | **50%** | transparent | Patrick Hand `--type-small` | ink→fg, border→currentColor | — | `aria-expanded` → ink + border lift |
| 5 | **text link** | `.players-leave` | none | 0 | none | Patrick Hand `--type-tag` | ink→fg, 150ms | — | `text-decoration: underline`, offset 3px |
| 6 | **tab head** (<1024) | `.mobile-heading-btn` | none | **0px** | transparent | Fraunces `--type-group-title` + a Patrick Hand 14px value sublabel | fine only: ink→fg | — | **straight CSS `underline`, thickness 2px, offset 4px** |
| 7 | **washi word chip** | `.icon-btn.peek-chip` | none | 8px (button) / **6-point clip-path** (chip) | `--sheet-washi-neutral` | Patrick Hand `--type-small` 16px, transform **none** | — | `opacity .7` | — |
| — | **the tongue** | `.drawer-tab` | `HandDrawnOutline` stroke **2.5** | 12px on two corners | `--color-card` | Patrick Hand `--type-small` 16px **w600**, `letter-spacing: 0.06em` (a hand-spelled literal, not a token) | washi de-tilts 1.4°→0°, 150ms ease-out | — | `aria-expanded` |

**Two underlines, forty pixels apart, both meaning "selected."** The tab head's is a CSS
`text-decoration` — σ 0.00px, CAD-straight; the option chip beneath it is a seeded
hand-drawn scribble that boils on change. `m08-mobile-tabs-390x844-chromium.png` frames both in
one crop. This is §5's wobble law meeting §2's button system at the same node, and it is the
sharpest single inconsistency the lane measured.

**The hover fill is very nearly nothing.** `.icon-btn:hover` paints `--color-accent` =
`hsl(48 8% 96.1%)` over `--color-card` = `hsl(48 12% 99%)` — a **2.9-point lightness step** at a
4-point chroma drop. The measured hover affordance on the card's verbs is therefore the ink
shift alone; the fill is within a hair of invisible in light mode.

**Sublabel casing splits.** `.icon-sublabel` is `text-transform: lowercase` (the Patrick Hand
chimera cure — its cut declares only {C,R,S} as capitals). `.peek-chip-word` and
`.heading-value` are `transform: none` beside it, both in the same face at the same rung.

**Focus.** Measured by `.focus()` on the desk, both engines: **no control in the card authors a
focus ring.** Every one falls to the UA's `outline: auto`, which the two engines draw
differently — chromium `1px auto`, webkit `3px auto`, colour `oklab(0.1445 … / 0.5)` in both.
The one authored ring in the estate is `.drawer-tab`'s **`2px dashed currentColor`, offset 3px**.
§6's census, from this lane's side: the card has no focus idiom to redesign — it has an absence.

---

## (c) THE CHROME

**The case vs the wordmark (M03).** The sheet's drawn frame is `.outline-svg`, outset −4px,
`stroke-width: 3`, `rgb(10,10,10)` — so its painted band at 390×844 lies in **y ∈ [212, 215]**
while the wordmark's rendered bitmap box ends at **214.73** (chromium) / **215.02** (webkit).
The stroke's band is INSIDE the wordmark's box; measured overlap at the outer boxes is
**2.73px / 3.02px**. `m03-case-stroke-cuts-wordmark-390x844-chromium.png` shows the line running
along the wordmark's foot — in this deal it grazes the baseline rather than crossing a glyph,
which is the honest reading of this cell; the owner's Frame B shows the crossing on the device.
Rung by rung, both engines, sheet up:

| viewport | stroke top − wordmark box bottom |
|---|---|
| 390×844 | **−2.73** / **−3.02** (overlap) |
| 375×812 | +5.77 / +5.48 |
| 430×932 | +14.11 / +13.48 |
| 900×500 | +104.42 / +104.42 |

So the collision is a ≤390-class reading and 375 clears it by less than two stroke-widths. This
is the same class as `DrawerTab`'s ≤400 rule (the tongue over the wordmark's last letter,
T7-W7) — third bite.

**The deal well's tag clip (F12 residue): CURED, measured.** The tag is in flow and sticky since
W2 §2.3. At every cell, both engines, `visFrac 1.0`; the tag's top sits **3.75px BELOW** the
card's top edge on the dock and 11.26px below it on the desk. Nothing is shorn. Frame B's defect
is gone.

**The floating bar's border (M04): CONFIRMED ABSENT.** `.action-bar` at 390×844 computes
`border: 0px`, `border-radius: 0px`, `box-shadow: none`, `background: var(--color-card)`. Its
only edges are a `::before` 2rem gradient (gated on `data-fold-below`) and a `::after` skirt —
**56px tall on the desk, 6px on the dock**, because the dock's card carries `py-1.5` and the
desk's `p-5` with a 56px note berth. The bar is a colour plane between two OTHER components'
drawn strokes (`m04-bar-no-border-390x844-chromium.png`). It is the only major surface in the
card with no drawn edge.

**…and below 1024 in LANDSCAPE the bar is not sticky at all.** Measured at 900×500 sheet-up:
`.action-bar` computes `position: relative`, `z-index: auto`, `::after` height `auto` /
transparent. `scene.css`'s sticky key is `(min-width: 1024px), (max-width: 1023.98px) and
(orientation: portrait)` — written when there were two scrollports; W2 §2.2 made the landscape
dock a third. Consequence, measured: the card is 284px tall over ~675px of content, and
**clear · fill · solve · share sit at visFrac 0 with no bar to hold them**.

**The tab's idiom (M10).** One component, three poses, all measured:

| pose | box | z | tongue radius | writing-mode | tuck |
|---|---|---|---|---|---|
| desk ≥1024, open | 48×92 right flank | −1 | `0 12px 12px 0` | vertical-rl | 8px under the paper |
| <1024 landscape, shut | 48×92 right flank | −1 | `0 12px 12px 0` | vertical-rl | 8px |
| <1024 portrait, shut | **92×48 board bottom-right** | −1 | `0 0 12px 12px` | horizontal-tb | **−6px** (tucked under the paper) |
| <1024 either, sheet up | 92×48 (44×92 at ≤400) | 1 | `12px 12px 0 0` | horizontal-tb / vertical-rl at ≤400 | — |

Same `HandDrawnOutline` stroke 2.5, same `--color-card` tongue, same washi text. **W2 §2.7's
cure landed**: the formation's stranded chip stood 54.8px below the paper at 390/375/430; the
tongue now tucks −6px under it. M10's LOOK obligation is therefore largely already met — what
remains for W7 is the quick set it carries (M13), which is empty.

**Five corner radii in one card**: 0px (bar · tab heads · `.info-btn` box) · 6px (`.ctrl-btn`) ·
8px (`.icon-btn`, the dock card) · 12px (the desk card, the tongue) · 50% (`.info-glyph`).

**Three drawn stroke weights, and they are a clean ladder**: the case at **3**, the tongue at
**2.5**, all four wells at **1.5**, every one of them stroked `rgb(10,10,10)` at outset −4px.
The "subordinate by weight" law holds exactly; the wells are identical to each other and differ
from the case by weight alone, never by ink. (Corrected in place: the census JSON's
`chrome.wells[].strokeWidth` and `chrome.case.strokeWidth` read the FIRST descendant `<svg>`,
which for the deal and players wells is the `DiceIcon` / `InviteIcon` in the slot —
`HandDrawnOutline` renders `<slot />` before its own `.outline-svg`. Re-measured against
`:scope > .outline-svg`; the 1.8/1.9 in those fields are icon strokes and must not be cited.)

---

## (d) THE MOBILE TABS (§8) — remeasured post-W2

| reading | 390×844 | 900×500 | moved since formation? |
|---|---|---|---|
| row box | 358×44 | 868×45.86 | — |
| tab boxes | `size` 44×44 · `level` 50.38×44 | 64.08×45.86 · 75.73×45.86 | — |
| border / fill / radius | **0px none · transparent · 0px** | same | unmoved |
| active affordance | `text-decoration: underline`, 2px, offset 4px | same | unmoved |
| inactive affordance | none but the value word | same | unmoved |
| inactive panel's options | `display: none`, box **0×0**, 3 options | same | **UNMOVED — the formation's "0×0 until discovered" survives W2** |
| tap floor | `min-height: 44px` from the shared coarse rule; **no `min-width`** — `size` is exactly 44 wide because the floor forced it | 64.08 wide | — |

Three type treatments inside one control: the head (Fraunces 20.35px w800 lowercase, muted or
crayon), the value (Patrick Hand 14px w400 **transform none**, 68% α), and the option chips it
reveals (Fira Code 20px). At 900×500 the two tabs sit 307px apart in an 868px row
(`justify-content: space-evenly`) — two words alone in a wide band, with nothing drawn to say
they are a pair or that one is chosen.

---

## (e) QUICK ACTIONS (§14) — the inventory, with tap counts

**What the mobile toolbar carries today.** `#fold-tools` at 390×844 holds exactly four acts, all
at `visFrac 1.0` with the sheet shut, all reachable at **0 taps**:

| act | box |
|---|---|
| Undo | 46×55.98 |
| Redo | 46×55.98 |
| Hint | 46×55.98 |
| peek | 59.83×44 |

**The `controls` tab carries zero acts.** M13 has nothing to close on.

**At 900×500 the ribbon does not exist.** `.fold-tools` is `display: none` outside portrait, so
`#fold-tools` measures 0×0 and holds nothing. With the sheet shut, the complete reachable
control set on a landscape phone is: the celestial toggle (44×44), the wordmark/gallery trigger,
the attribution card, the board's cells, and the `controls` tongue. **Undo, redo, hint and peek
are all inside a sheet whose bar does not stick and whose content runs 391px past its fold.**

**Everything else, by tap count from the playing view (390×844, sheet shut):**

| act | taps | note |
|---|---|---|
| undo · redo · hint · peek | **0** | in the ribbon |
| size 4×4 / 9×9 / 16×16 | 2 | open + tap |
| deal | 2 (3 if the board is dirty) | the two-tap arm, W1 §1.5 |
| marks Normal / Corner / Center | 2 | the well sits at y 538 of a 628px sheet |
| candidates Off / On | 2 | |
| checking Off / Ask / Live | 2 | |
| play (invite) | 2 | |
| clear | 2 (3 if dirty) | |
| fill · solve · share | 2 | |
| **level Easy / Medium / Hard** | **3** | open + switch tab + tap — the options are `display: none` until the tab is pressed |
| the `i` crib | ∞ | `v-if="!mobile"`; no coarse surface reaches it |

**Room on the board's edge.** At 390 the board's paper is 366px wide and the shut tongue spends
92 of it, leaving **274px** of bottom edge unoccupied — about five 44px targets plus their
seams, or two plus a wider tongue.

**The natural candidates, put as a question rather than a decision (U-10).** By use: the acts a
reader takes BETWEEN moves without wanting the whole case — `fill`, `solve` (both 2 taps, both
play-adjacent, neither destructive), and the pencil MODE (the most-changed setting mid-play, and
the one whose well is the deepest in the sheet). By cost: in LANDSCAPE the four ribbon verbs
themselves become quick-set candidates, because nothing else carries them there. `clear` and
`deal` are the two the wave should NOT put a tap away — M12 arms them precisely because they are
destructive, and a quick set that makes a guarded act cheaper works against W1 §1.5.

---

## The structural map

`structural-map-390x844.txt` and `structural-map-1280x800.txt` hold the card's DOM outline with
every box. The design roles, top to bottom:

```
.controls-card                    THE CASE'S INTERIOR — the one scrollport (desk 1066px of
                                  content in 608; dock 675 in 628; landscape ~675 in 284)
└ .control-panel-wrap             the estate; --font-display, optical sizing
  ├ .tray-well.new-game-zone      COMPARTMENT 1 · THE STAGED ASK (stroke 1.5)
  │ ├ .washi-tag "new game"       the well's NAME — sticky, in flow, IS the accessible name
  │ ├ .control-panel-filtered     structural hook only; carries no paint since P1-W3
  │ │ ├ .mobile-heading-row       <1024: the two tab heads (h2 > button, display:contents)
  │ │ │  └ .section-heading       VOICE 1 + .heading-value VOICE 3′
  │ │ ├ .staged-section           ≥1024: heading + its selector, ruled apart by 1.5px
  │ │ └ .ctrl-options             TREATMENT 1 · the option row (one shown at <1024)
  │ └ .deal-row                   THE COMMIT — ruled off by 1.5px; verb row 1, receipt row 2
  │   ├ .icon-btn.deal-btn        TREATMENT 2 · the card's one primary act
  │   └ .difficulty-tally         the deal's RECEIPT (role=img)
  ├ .peek-hold-surface            THE ZONE RULE (role=separator) — hold-to-peek on the desk,
  │                               stood down on the dock (the peek chip carries the gesture)
  ├ .tray-well "pencils"          COMPARTMENT 2 · two ideas, two captioned rows (stroke 1.5)
  │ ├ .zone-row-label             VOICE 3 · the row caption (the only 68%-α name)
  │ ├ .zone-hint                  the explication tape — hover/`:has(:focus-visible)` only
  │ └ .ctrl-options ×2            marks · candidates (candidates is the estate's ONE binary)
  ├ .tray-well "checking"         COMPARTMENT 3 · one idea, named by its tape alone
  ├ .tray-well "players"          COMPARTMENT 4 · the invite verb + three live regions
  │ └ .icon-btn.invite-btn        TREATMENT 3 · full-width on the dock (358×56)
  ├ .legend-fold                  ≥1024 only · the crib, 0fr↔1fr, clip-path (sizes the rail)
  ├ .action-bar                   THE FLOATING BAR — no border (M04); sticky at ≥1024 and on
  │ │                             the portrait dock ONLY; z 60; ::before fade + ::after skirt
  │ ├ .action-verbs               TREATMENT 3 ×4 · clear · fill · solve · share
  │ ├ .info-btn                   TREATMENT 4 · fine-pointer only
  │ └ .berth-note                 the invite verb's note, laid in the bar's reserved foot
  └ .copy-status                  sr-only role=status

#fold-tools                       THE MOBILE TOOLBAR — PORTRAIT ONLY, Teleport berth
└ .play-controls                  undo · redo · hint (TREATMENT 3) + peek (TREATMENT 7)

.drawer-tab                       THE TONGUE — one instance, three berths, stroke 2.5
```

---

## What R1 hands the portfolio

1. A heading system must answer **eight names in one voice and one rank**, keep the crayon tier
   as DATA, and put the phone's title above the words it captions (the born-RED rows).
2. A button system must answer **seven treatments, five radii, five selected-idioms and two
   underline grammars** — and must decide whether the estate's ONE drawn control border
   (`.info-glyph`) is the seed of the system or its last exception.
3. The card needs a **focus idiom**, because it has none: the only authored ring in the estate
   is the tongue's dashed one, and the two engines draw different defaults everywhere else.
4. The bar's chrome (M04) and the case/wordmark seam (M03) are the two chrome rows with owner
   marks on them; both are measured above and both are cheap in CSS.
5. Two structural rows the design must answer even though their mechanism is W2's: the landscape
   dock's **non-sticky bar**, and the **empty quick set** on a tongue that has 274px of board
   edge beside it.

**`fx` in the bar frame is the DEV filter tuner** (`App.vue`'s `import.meta.env.DEV` gate) — it
is absent from production builds and is not a product defect.
