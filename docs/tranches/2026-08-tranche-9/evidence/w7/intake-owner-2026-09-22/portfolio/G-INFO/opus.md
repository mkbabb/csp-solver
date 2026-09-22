# G-INFO · opus — the key list opens inside the strip

**Mark:** T9-M16, "The 'i' button clicking does not properly scroll the panel". Owner's words, U-10:
the owner disposes at the re-look, and nothing here retires the mark.
**Against:** MAIN `1e6cfbbf`, the product the owner audited. Main's `src/` wasn't touched: the design
was applied by moving DOM in a Playwright page on this lane's own dev server (127.0.0.1:4259,
`--strictPort`, private cacheDir, killed by recorded PIDs 99360 listener / 99326 npx).
**Method:** frontend-design, two passes (plan → review against the tell list → specify).
**Output:** pass-5 charter rows for the owning families (§8). No family's prototype was read as the design.

---

## 0 · The memorable thing

**Press "i" and the key list rises out of the strip, right above the "i". The panel doesn't
scroll, the strip doesn't move, and the "i" stays under the pointer.**

M16's defect is a scroll that can't land: one `scrollIntoView` aimed at a 0 px box, against a
scroll range that's about to grow, with the growth landing under an opaque sticky bar (census
§mechanism). This design doesn't time the scroll better. It moves the list to where the eye
already is, so the scroll has no job left. The scroll case (W2 §2.3) comes back in one sentence:
**the "i" never scrolls the panel, and the panel's scroll range grows by exactly what the open
list covers.** So everything under the list stays reachable, by wheel and by Tab.

---

## 1 · Ground: HEAD vs the design's placement, measured on main

Instrument: `opus-probe/probe.mjs` (rAF sampler over 1.2 s after a real pointer click, DPR 2,
`scrollIntoView` counted). The "strip" arm moves `#keys-fold` into `.action-bar` as its first
grid row (`grid-column: 1 / -1`) and turns off HEAD's scroll. Both arms run on the same page
build. Cells: chromium and webkit · 1280×800, 1440×900, 1280×720 light · 1280×800 dark · 1280×800
PRM light · scrolled to top and to end. That's 20 cells per arm, plus 3 repeats of webkit
1280×800 for the frame rates.

| reading (every cell, both engines) | HEAD (main) | strip arm |
|---|---|---|
| crib `<dl>` visible fraction after the press | **0.001–0.004** (reproduces census) | **1.000** in 20/20 |
| panel scrollTop Δ from the top | **+534 / +504 / +614** (chromium), **+535 / +505 / +615** (webkit), to the OLD max | **0.00** |
| panel scrollTop Δ from the end | 0.00 (list still under the bar) | **0.00** |
| `scrollIntoView` calls per press | 1 | 1, neutralised in the probe; the design deletes it (§6) |
| verbs + "i" rect Δ, from the top | 0.00 | **0.00** (the strip grows upward from a pinned bottom) |
| verbs + "i" rect Δ, from the end | 0.12 / 0.19 / 0.15 / 0.36 | same numbers, HEAD's own sticky settle, not the design's |
| card width (π) | 324.22 · 330 (chromium) / 332.31 · 338 (webkit) | **identical to the hundredth**: the crib's max-content still sizes the rail from inside the bar |
| board left (π) | 131.89 · 193 · 171.89 / 127.84 · 189 · 167.84 | **identical** |
| bar height closed → open | 64.81 → 64.81 | 64.81 → **166.61** (chromium) / **170.61** (webkit) at 1280; 65.16 → 168.89 / 172.81 at 1440 |
| `scroll-padding-bottom` (= `--action-bar-h`) | 121 → 121 | 121 → **223** (chromium) / **227** (webkit): the existing publisher follows |
| Tab walk over the card body with the list open: focusables whose box enters the bar | 0/16 | **0/16**. Ablation: with the publisher blinded, **6/16**. The publisher is load-bearing. |
| PRM | the only pose where HEAD works (scrolls to the new max, 1.000) | 1.000, scrollTop 0.00, settle 7–59 ms (a cut) |

**Painted AA** (`opus-probe/aa.mjs`: crops at DPR 2, background = the modal pixel, ink = the
luminance extreme and the median of the ink pixels; strip arm, list open, 1280×800):

| element | light (chromium / webkit) | dark (chromium / webkit) | floor |
|---|---|---|---|
| list words (`dd`, `--ink-press-quiet` on `--color-card`) | 5.16 / 5.24 | 5.96 / 6.07 | 4.5 ✓ |
| key caps (`kbd` edge, `--ink-press-rule`), median | 3.53 / 3.53 | 4.35 / 4.36 | 3.0 non-text ✓ |
| verb sublabels (`--color-muted-foreground`) | 4.66 / 4.66 | 7.68 / 7.68 | 4.5 ✓ |
| the "i" glyph, open (`--color-foreground`) | 19.45 / 19.45 | 15.84 / 15.84 | ✓ |

Grounds painted: `#fdfdfc` light and `#131211` dark, the bar's own slab, so the list sits on the
same paper it sat on before. No colour moves.

**Frame rate while the list opens** (webkit 1280×800 light, 200 ms rung; per press; median frame
10 ms headless):

| arm | presses | frames > 16.7 ms (min / **med** / max) | frames > 25 ms | longest frame (med) |
|---|---|---|---|---|
| HEAD (grows unseen under the bar) | 16 | 0 / **3** / 7 | 0 / 0 / 1 | 22 ms |
| strip, in-flow grow (M2 below) | 16 | 3 / **8** / 10 | 1 / 2 / 6 | 37 ms |
| strip, grow with the height publisher blinded | 6 | 1 / 9 / 11 | 0 / 1 / 6 | 30 ms |
| strip, one layout step + transform slide (M1, partial) | 6 | 1 / **3** / 25* | 1 / 1 / 13* | 39 ms |

\* one outlier press (181 ms frame, 420 ms settle), not attributed. Chromium: one long frame per
press in every arm (it's the click frame), so the rate reads flat there.

Reading: the in-flow grow is correct but about **2.7× HEAD's long-frame rate in WebKit**. The
publisher isn't the cause (blinding it doesn't lower the rate). What remains is the sticky bar
re-laying out and repainting every frame. The transform slide gets back to HEAD's rate, but my
probe of it is PARTIAL. It didn't split the grounds or move the fade (§4), so its picture isn't
the design's. That's why §4 ranks the slide first and gates the choice.

---

## 2 · Plan (pass 1)

- **Subject.** The desk rail's tool strip in a hand-drawn sketchbook sudoku. The reader is a
  keyboard player at a fine pointer who wants the shortcuts. The page's job is to show what the
  keys do, where the reader is already looking, and move nothing else.
- **Colour.** No new colour. Paper `--color-card` (#fdfdfc / #131211 painted). List ink
  `--ink-press-quiet`, key-cap edge `--ink-press-rule`, sublabel `--color-muted-foreground`, open
  state `--color-foreground`.
- **Type.** One face: Patrick Hand (`--font-hand`). List rows at `--type-caption`, sublabel at
  `--type-verb` (= caption), the "i" glyph sized to the verbs' glyph rank `--icon-verb` (30 px desk).
- **Layout.** The list is the strip's upper leaf. It's in flow, spans the strip's full width,
  and opens upward from a strip whose bottom never moves. Content is left-aligned in the list's
  existing two columns. The strip stays centred on the card's spine.
- **Principles.** (1) The answer arrives at the question: no travel for the eye, none for the
  pointer. (2) One move, one clock. (3) Nothing the mark doesn't name moves by a pixel (π).

### Review against the brief and the tell list (and what it changed)

- *First instinct: time the scroll better* (`transitionend`, or aim at the final height). That's
  the census's fallback. **Cut.** It's still two moves (the grow, then a ~102 px jump) under M09,
  and it keeps the list in a scroll body where the B8 default would strand it behind a foot (the
  census's own point).
- *Second instinct: a popover above the "i".* **Cut.** An out-of-flow layer covers live controls,
  which is CTRL-RULE's ribbon lesson (4 controls at 1.000). It also drops the list's max-content,
  which sizes the rail. Measured: the in-flow form holds card width and board left to the hundredth.
- *A hairline between list and verbs.* **Cut** (Chanel). The key caps already group the list, and
  a rule that separates reference from acts is decoration the strip's future drawn edge (M18) does
  better.
- *A label over the list* ("Keyboard shortcuts" as visible text). **Cut.** It's the eyebrow tell,
  and a11y 3.4 needs exactly one node named that, which is the `<dl>`'s `aria-label`.
- *Keeping the "i" ring.* **Cut** (§3 Row B). It's the strip's only CSS border, against L5 / law
  37, and the census row says the ring and M18's edge must be cut together.
- Nothing here is ALL-CAPS, eyebrowed, dot-joined, arrowed or monospaced. The list's `⌘/Ctrl` slash
  is existing content, not chrome.

---

## 3 · The spec

### Row A · placement: the list lives in the strip (the M16 cure)

```
CLOSED (desk rail, fine pointer)          OPEN
│ …wells scrolling…               │       │ …wells (102 px now under the strip, still scrollable) │
│ ░░░░ fade 2rem (only if more) ░░ │       │ ░░░░ fade rides the list's top edge ░░░░              │
├──────────── strip ───────────────┤       │  (K) peek          (G) games                          │
│   ⌫     ▦     ✓     ⋖      i     │       │  (H) hint          (P) pencil                         │
│ clear  fill solve share   keys   │       │  (D) deal          (⌘/Ctrl)(Z) undo                   │
└──────────────────────────────────┘       │  (⌘/Ctrl)(⇧)(Z) redo                                  │
                                           ├──── strip ────  (verbs and "i" Δ 0.00) ──────────────┤
                                           │   ⌫     ▦     ✓     ⋖      i                          │
                                           │ clear  fill solve share   keys  ← ink darkens,       │
                                           └───────────────────────────  underline drawn ─────────┘
```

- `#keys-fold` leaves the card body (`GameControlPanel.vue:1219–1227`) and becomes `.action-bar`'s
  **first child**: grid row 1, `grid-column: 1 / -1`. The verbs take row 2.
- Everything the fold's comment defends stays: it stays in flow; it's clipped by `clip-path`,
  never `overflow: hidden` and never `display: none` (a11y 3.4 `innerText` in WebKit); its
  two-column max-content still sizes the rail (measured π above).
- **Sticky arm (main today).** The bar is `sticky; bottom: 0`, so it grows upward and the verbs
  stay pinned. The scroll range grows by the list's height and `scroll-padding-bottom` follows
  through the existing `--action-bar-h` publisher.
- **B8 foot arm (the firing default, chair pass-4 §3).** The list travels with the bar into
  `#card-foot`. The foot grows upward and the scroll body shrinks by the same height. Nothing
  here changes the arm: in either arm the list is part of the strip. The §6.1 inset
  (`padding-bottom: max(pad, env(safe-area-inset-bottom))`) sits below the verbs and the list
  never touches it.
- `toggleKeys()` becomes `keysOpen = !keysOpen` and nothing more. No `nextTick`, no scroll.

### Row B · the "i" in the verbs' grammar (separable; the adjudicator can take A without B)

- The "i" moves from its trailing grid track into `.action-verbs` as a **fifth `.icon-btn`**. Its
  glyph is the letter "i" in `--font-hand`, set in the `--icon-verb` box (30 px desk). Its
  sublabel is **"Keys"** (source casing, like "Clear"; it renders the way its siblings do).
  Seeded hover note in the berth: **"what each key does"** (seed 89, beside 23 / 43 / 37 / 71).
- **Its CSS ring dies** (`border: 1.5px solid var(--ink-press-rule); border-radius: 50%`,
  `:2328–2340`). The strip then holds no CSS border, which lets M18's drawn edge be the strip's
  one hand (L5 / law 37). MRK-ABS's G-ABS-3 red on `.info-btn` dark (2.92) loses its subject.
- **States.**
  - rest: glyph and sublabel at the verbs' muted ink (4.66 / 7.68 painted on siblings)
  - hover: the berth note, the same `.group` seam as its siblings
  - focus: the verbs' existing focus ring (law 39's forms, unchanged)
  - open (`aria-expanded="true"`): glyph and sublabel at `--color-foreground` (19.45 / 15.84),
    plus the house's seeded scribble underline (`scribbleUnderline.ts`, the selected-chip mark)
    under "keys". That's a non-colour cue for 1.4.1; HEAD's cue is colour only.
  - PRM: identical states.
  - coarse rail and dock: absent. The existing `(hover: hover) and (pointer: fine)` gate and
    `v-if="!mobile"` are kept, so a touch reader gets four verbs as today.
- **Width** (arithmetic, not painted): five 46 px boxes = 230 px. That fits 259.59 (1024 fine)
  with 4.93 px per `space-evenly` gap, and 268.22 (1280) with 6.37. HEAD's four verbs have 10.4 px.
  This row spends density. The gate is in §5.
- **Name:** `aria-label="what the keys do"`, unchanged. Never "keyboard shortcuts", because
  a11y 3.4 needs exactly one node answering to that, and it's the `<dl>`.

### Row C · the edge contract with M18 (a coupling, not M18's design)

- **Whatever drawn edge M18 lands frames the verbs row, whose height never changes.** The list
  rises above that edge's top stroke, on the strip's own paper.
- Reason, from the source: `HandDrawnOutline` re-bakes on every ResizeObserver callback
  (`HandDrawnOutline.vue:54–60, 110–124`). Its grain is sampled by arc length `t` around a ring
  that starts at the top-left (`gridPaths.ts:144–160`, `bakeGrainPoints`). So a frame that grows
  in height shifts `t` along its right, bottom and left sides every frame. The grain would crawl
  for the length of the rung, with about 12 re-bakes × `frameCount` poses. A fixed-height frame
  re-bakes zero times when the list opens. Gate: the edge path's `d` is byte-identical closed and
  open.
- **The slab must cover the wells' 4 px outset along the list's flanks too.** Crops c1 and c2 show
  the census's leak (`HandDrawnOutline :outset="4"`) painting brackets beside the open list. The
  flank grows from 64.81 to 166.61 px, so M18's slab-width row (content edge −4) lands with or
  before Row A, or Row A makes the leak 2.6× taller.

### Tokens (no new token, no new hex, no new filter)

| token | value | role |
|---|---|---|
| `--color-card` | painted #fdfdfc / #131211 | the list's ground (the strip's slab) |
| `--ink-press-quiet` | graphite 68 % (index.css:262) | list words, 5.16–6.07 painted |
| `--ink-press-rule` | graphite 55 % (index.css:257) | key-cap edges, 3.53 / 4.35 |
| `--color-muted-foreground` | theme | "keys" sublabel at rest |
| `--color-foreground` | hsl(0 0% 3.9%) / hsl(48 10% 92%) | open state |
| `--type-caption` · `--type-verb` | clamp(0.75rem, …, 1rem) | list rows · sublabel |
| `--icon-verb` | 30 px desk | the "i" glyph box |
| `--action-bar-h` | measured: 121 → 223 / 227 at 1280 | scroll-padding; already published |
| `MOTION.rungs.leave` | 200 ms (`--motion-leave` once MOT-LADDER's publisher lands; on main the literal at `:2291`) | the open and close clock |
| `--ease-drawOn` | cubic-bezier(0.33, 1, 0.68, 1) | the curve, unchanged |

The FLIP distance is measured at the press and fed straight into WAAPI keyframes. It isn't a CSS
token, so the `@property` law doesn't apply. The `--action-bar-h` publisher's `var(…, 0px)`
fallback at `scene.css:264` is pre-existing @property debt that belongs to CTRL-TAPE's
registration block, and this row doesn't widen it.

---

## 4 · Motion: one picture, one clock, two mechanisms ranked

**The picture.** The list rises out from behind the strip. Its paper covers the content as it
rises, the 2rem fade rides its top edge, and the verbs and the "i" don't move. Closing plays the
same picture in reverse on the same rung. PRM is a cut.

**Home:** `pencilConfig MOTION.rungs.leave` (200 ms). That's the rung MOT-LADDER's pass-3 bank
already assigns to this exact site (`.legend-fold :: grid-template-rows: 200`). The curve stays
`--ease-drawOn`, so this row re-times and re-curves nothing. Whether the site becomes MOT-VERB's
`layDown` (the glass curve) is MOT-VERB's row, not this one. A rung isn't a licence to re-time.

- **M1 (preferred): one layout step, then a transform.** At the press, the fold snaps 0fr → 1fr
  with no transition, so the strip's box takes its final height in one layout. On the same frame,
  a two-node FLIP runs on the rung: the list's ground (`.legend-fold > div`, carrying
  `background: var(--color-card)`) goes `translateY(H)` → 0, and the fade goes `translateY(H)` → 0.
  H is the measured height step.
  - The strip's opaque paint must be confined to the verbs band so the newly-allocated band shows
    the content until the ground slides over it. Otherwise the content is wiped in one frame,
    which is the discontinuity M09 forbids.
  - The verbs row paints above the ground (z) so the list emerges from behind it.
  - The fade can ride as the ground's own pseudo, or through WAAPI `pseudoElement: '::before'`.
    Engine support for the latter in WebKit is unverified, a gap. The ground's pseudo needs the
    fold's clip to extend 2rem upward (`clip-path: inset(-2rem 0 0 0)`) while the closed box
    still clips the `<dl>`.
  - Close runs the FLIP in reverse and then collapses the layout in one step, where it's invisible.
  - The house's FLIP engine is `useFlipGlide`. It's reused, not re-authored.
  - Measured partially: WebKit long-frame rate at HEAD's (3 / press, median of 6). The ground
    split and the fade move were not built.
- **M2 (fallback, fully measured): the in-flow grow.** `grid-template-rows 0fr → 1fr` on the
  rung. The picture is exactly right for free: the fold's top edge IS the rising edge, and the
  bar's `::before` is anchored to it. But it costs 8 long frames per press against HEAD's 3 in
  WebKit.

**Gate G6 chooses:** WebKit frames over 16.7 ms per open ≤ HEAD's median + 1 over ≥ 8 presses. M2
reads RED today (8 vs 3). M1 has to prove it with the grounds split and the fade riding.

---

## 5 · Gates: land with Row A; born RED on main unless marked

"Both engines" = chromium + webkit. "Desk cells" = 1280×800, 1440×900, 1280×720, fine pointer,
light + dark, from the top AND from the end, pointer click AND keyboard Enter.

| # | gate | main (1e6cfbbf) | design (strip arm) |
|---|---|---|---|
| G1 | crib `<dl>` visible fraction after the press ≥ 0.99 (card box ∩ not under the verbs row) | **RED 0.001–0.004** | 1.000 |
| G2 | panel scrollTop Δ across the press = 0.00 ± 0.5, and `scrollIntoView` calls per press = 0 | **RED** +504…+615; 1 call | 0.00; the deletion makes it 0 |
| G3 | "i" and verbs rect Δ ≤ 0.5 px on every frame of the rung (the pointer's target never moves) | guard (0.00–0.36 ✓) | 0.00–0.36 ✓ |
| G4 | π: card width and board left identical to HEAD at the desk cells, 1024×768 and 1728×1117 fine (±0.01) | control | identical at 1280/1440/720 both engines; **1024, 1728 unmeasured** |
| G5 | reachability with the list open: Tab walk over the card body, 0 focusables whose box enters the strip; `scroll-padding-bottom` = published strip height ± 1 | guard (0/16) | 0/16; negative control (publisher blinded) 6/16 ✓ |
| G6 | motion rate: WebKit frames > 16.7 ms per open ≤ HEAD median + 1 (n ≥ 8); the list's leading edge monotone (no reversal > 0.5 px); settle ≤ rung + 2 frames; PRM settles in ≤ 1 frame with 0 intermediate heights | control 3 | **M2 RED 8**; M1 3 (partial) |
| G7 | source: no `scrollIntoView` in `toggleKeys`; the comment at `:143–146` rewritten; `#keys-fold` is a child of `.action-bar` | **RED** | lands with the row |
| G8 | L5 in the strip: 0 CSS borders on `.action-bar` descendants other than `kbd` (pre-existing, §7); `.info-glyph` border-width 0 | **RED** (1.5 px ring) | Row B |
| G9 | coarse / phone π: 1280×800 `hasTouch` rail and 390×844 · 430×932 dock, bar height, verbs rects, computed paint + tags identical to HEAD (the fold is a 0 px row there) | control | **unmeasured** |
| G10 | a11y 3.4 row (`e2e/a11y.spec.ts:505`) green both engines: exactly one node named /keyboard shortcuts/, k g h p d in its `innerText`, not stripped | green | must stay green (the fold's clip unchanged) |
| G11 | painted AA from bytes, both themes, both engines: list words ≥ 4.5, key caps ≥ 3.0, "keys" ≥ 4.5 at rest and open | green | 5.16–6.07 · 3.53–4.36 · 4.66 / 7.68 |
| G12 | M18 edge stillness: the drawn edge's path `d` byte-identical closed vs open (0 re-bakes on open) | n/a on main (no edge) | lands with M18's edge |
| G13 | Row B density: minimum gap between verb boxes ≥ 4 px at 1024×768 fine; no hover note overlaps a verb box | control 10.4 px | arithmetic 4.93 px, **unmeasured** |
| G14 | M16 copy: `npm run lint:copy` bare exit 0 with "Keys" / "what each key does" | n/a | owed |
| G15 | filterBudget census = 9 (the list and the underline mint no filter) | 9 | owed |

The e2e home for G1/G2/G5 is `e2e/` under the §10 leader: one spec, both engines, with its
negative control. On main, G1 reds at 0.001–0.004. That's the born-RED the census already names.

---

## 6 · What dies

1. `toggleKeys()`'s `nextTick → scrollIntoView({ block: "nearest", behavior: "smooth" })`
   (`GameControlPanel.vue:148–156`). The whole scroll goes.
2. The comment `:143–146` ("the fold rides into the scrollport as it opens"), false in 24/24
   census cells.
3. `#keys-fold` as the card body's last in-flow sibling (`:1219–1227`). It moves into `.action-bar`.
4. `.legend-fold`'s `transition: grid-template-rows 200ms` (`:2287–2296`) under M1. It survives
   only if G6 picks M2.
5. The "i" ring: `.info-glyph { border: 1.5px …; border-radius: 50% }` and the
   `[aria-expanded] .info-glyph { border-color }` rule (`:2328–2345`), with Row B.
6. `.action-bar`'s `grid-template-columns: 1fr auto` trailing track, with Row B.
7. `KeyboardLegend.vue:63`'s comment "It sits ABOVE the action bar now" is re-worded to "inside
   the strip, above the verbs".
8. **Not built, named dead:** the census's minimum cure (scroll after `transitionend`, or aim at
   the final height). It's two moves, and it strands the list behind a B8 foot.

---

## 7 · Risks and gaps (a gap is a gap)

- **M1 isn't fully prototyped.** The slide probe kept the bar's opaque ground whole, so content
  under the new band was wiped in one frame, and the fade didn't ride. Its frame rate (3 / press)
  is for a different picture. WebKit support for WAAPI `pseudoElement` is unverified.
- **M2 fails G6 in WebKit** (8 vs 3 long frames per open), unattributed beyond "not the publisher".
- **One unattributed outlier** (181 ms frame) in the slide arm.
- **Unmeasured:**
  - 1024×768 and 1728×1117 π
  - the coarse rail / dock π (G9)
  - Row B's rendered widths and hover-note collisions (G13)
  - `dist` / preview. It's dev server only, though the mechanism is script and CSS.
  - real Safari / iOS (M19: no osascript)
- **Row A makes the wells' 4 px outset leak 2.6× taller** until M18's slab-cover row lands (crops
  c1, c2). That's a coupling, and the order matters.
- **The open list covers ~102–106 px of the card.** At 1280×720 that's the strip at ~167 px of
  the scrollport while it's open. Content stays reachable (G5), and it's session-transient by
  design, but the Deal verb (M17's row) is covered when the list is open at scrollTop 0.
- **`kbd` key caps keep their 1.5 px CSS borders.** That's pre-existing content, not strip
  chrome. Whether L5 reaches them is the chair's row, and it isn't proposed here.
- **Touch readers get no "i" and no list.** That's the census's reading. The owner's words don't
  ask for it, and it isn't proposed.
- **Theme was read at 1280×800 only**, for dark and PRM.

---

## 8 · Pass-5 charter rows (owning families)

- **CTRL-FACE (§10 leader):**
  - Row A: the placement, the deletions 1–3 and 7, and gates G1, G2, G3, G4, G5, G7, G10, G11 as
    one e2e spec with a negative control
  - Row B if adjudicated: G8, G13, G14
  - the M1/M2 choice under G6
- **CTRL-TAPE / CTRL-RULE (the B8-default carriers):** the list travels with the bar into
  `#card-foot`. G1–G5 re-read in the foot arm. §6.1's inset row unaffected.
- **M18's edge owner (the B8 carrier's drawn edge):** Row C. The edge frames the fixed-height
  verbs row (G12), and the slab covers the wells' outset along the list's flanks, landed with or
  before Row A.
- **MOT-LADDER / MOT-VERB:** the site's rung (`leave`, 200) and curve are carried unchanged. The
  verb assignment and the FLIP's home in `useFlipGlide` are theirs to name, with no re-time.
- **MRK-ABS:** G-ABS-3's `.info-btn` dark row changes subject when the ring dies (Row B). Its
  replacement reads the open "i" at 15.84 painted.
- **Chair:** whether L5 reaches the `kbd` caps. The order of M18's slab-cover row relative to
  Row A.

**Evidence:**
- `opus-c1-strip-arm-open-chromium-light-1280x800-fine.png` (chromium · light · 1280×800 · fine,
  list open from the top, the wells' outset leak visible beside it)
- `opus-c2-strip-arm-open-webkit-dark-1280x800-fine.png` (webkit · dark · 1280×800 · fine, open
  from the end)
- `opus-probe/`: the probe scripts
- the raw per-frame JSON stays in `web/frontend/.owner-intake/ginfo-opus/` (not banked)
