# G-BAR · opus — the strip is a drawn tray, and it covers what slides behind it

**Mark:** T9-M18, "This needs to have a border in some way" (frame `marks/m18-tool-strip-no-border.png`),
which is T9-M04 said again by the owner. The owner disposes at the re-look (U-10). Nothing here retires the mark.
**Against:** MAIN `1e6cfbbf`, the product the owner audited. Main's `src/` wasn't touched. The design was
applied at runtime in a Playwright page on this lane's own dev server (127.0.0.1:4257, `--strictPort`,
private cacheDir `web/frontend/.owner-intake/gbar-opus/`, killed by recorded PIDs 35947 listener / 35918
npx; the owner's 3001 was never touched). The frame is drawn by the product's own generator
(`generateRectBoilFrames`, imported from the served `/src/pencil/grid/gridPaths.ts` with
`HandDrawnOutline`'s exact arguments), so every painted number below is the real path.
**Method:** frontend-design, two passes (plan, then a review against the tell list and the brief, then the spec).
**Output:** pass-5 charter rows for the owning families (§8). The loop's prototypes were context, not the design.
**Instrument:** `opus-probe/probe.mjs` (DPR 2, both engines, both themes, HEAD and DESIGN arms in fresh
contexts, the dock sheet settled by polling, `hasTouch` coarse rows with the regime witnessed:
`pointer: coarse` true, `hover` false, `maxTouchPoints` 1).

---

## 0 · The memorable thing

**The tool strip becomes the case's one boxed tray, drawn with the tab's pen.**

The strip gets a closed `HandDrawnOutline` frame at stroke 2.5 / outset 3. That's exactly the
`DrawerTab`'s pair (`DrawerTab.vue:65`). The case has two parts you can always reach: the tab that
opens it and the strip that acts from it. Both are drawn with one pen. The frame is also a cover. The
brackets in the owner's frame aren't an edge. They're the wells' own strokes leaking round a slab
that has none (census §2: the wells' 4 px outset against a slab exactly the content width). With the
tray in place, what scrolls behind the strip goes *behind* it and doesn't show round it.

One sentence for the owner: the strip is boxed like everything else in the case, with the tab's line
weight, and nothing peeks out around it.

---

## 1 · Ground: HEAD against the design arm, painted, both engines

Cells: 1280×800 fine · 1280×800 `hasTouch` · 390×844 `hasTouch` · 430×932 `hasTouch`, light and dark,
chromium and webkit. Readings are device pixels at DPR 2 unless marked css.

| reading | HEAD (main) | DESIGN (final arm, `probe.mjs`) |
|---|---|---|
| the strip's own edge, coverage of each side's run (frame shown vs hidden, differential) | no edge: the bar's top 3 px band holds 0–9 ink px of 736–1496 (census §2) | **1.00 / 1.00 / 1.00 / 1.00** (top, bottom, left, right) in every cell, both engines, both themes |
| frame stroke core contrast on painted bytes (median · min) | — | light **17.78 · 4.73** chromium, **17.61 · 5.16** webkit; dark **14.20 · 5.71** / **14.31 · 5.86** |
| leak: flank columns (content edge to 8 px out) over the bar and 60 px of skirt, wells' outlines shown vs hidden | **766–783 px per flank** on the rail (1280 fine), **487–515** on the dock | **0 / 0** in all 8 scrolling cells (rail fine, dock 390, both engines, both themes) |
| scroll end: daylight between the last well's bottom-stroke ink and the frame's top-stroke ink (min over columns, css) | — (no frame) | **8.0–10.0** in every cell; box gap **15.94–16.00** |
| frame's lowest ink above the viewport bottom, dock (css) | — | **3.00** chromium · **2.50–3.00** webkit (Playwright supplies no inset) |
| the `i`'s ring contrast, painted median (rail fine) | CSS ring at `--ink-press-rule`: **3.26 / 4.11** chromium L/D, **3.53 / 4.36** webkit | drawn ring at `currentColor`: **4.73 / 5.55** chromium, **4.66 / 5.57** webkit |
| board rect · masthead rect | — | **identical** to HEAD in all 12 cells |
| bar height | 64.81 rail · 66.77 dock | **64.81 · 66.77** (unchanged) |
| verbs' top | 634.03 rail · 777.63 dock (chromium) | **−2.00** rail · **−6.00** dock (declared, §4.6) |
| card `scrollHeight` | 1142 / 1143 rail · 699 dock · 675 / 676 at 430 | **+8** rail · **+12** dock and 430 |
| 430×932 case | top 256.84, h 675.16, no overflow | top **244.84**, h **687.16**, still no overflow (the case grows 12 px upward) |

Three drafts failed on the way, and each failure is now a gate's negative control (§5):

- **Draft 1** used a 6 px cover on the bar only. The crop showed the second well's side stroke
  running on *below* the bar through the skirt, because `::after` spans the content width only. At
  6 px the flank also kept 1–18 px over the bar's height (the wells' corner overshoot reaches past
  6 px). The final arm uses 8 px (`0.5rem`) and extends the fade and the skirt too, and reads 0.
- **Draft 2** used `margin-top: 0.5rem` everywhere. The dock's wrap is a block (`mobile-control-panel`),
  so that margin collapsed into the well's 8 px. The box gap stayed 7.94–8.00 and ink daylight fell
  to **0.5–1.5 css**: the two drawn frames touched. The final arm gives the dock 1rem, and it
  collapses to 16.
- **An all-round `box-shadow` spread** was ruled out by arithmetic before it was built. At scroll end
  the last well's bottom stroke sits 2.5 px above to 2.65 px below the bar's top edge
  (8 px box gap − outset 4 − wobble 1.5…6.65). A 6 px spread would erase that stroke entirely at the
  rest pose of every card that doesn't overflow. The cover is **side-only**.

---

## 2 · Pass 1: the plan

**Subject.** A pencil case (the drawer), its compartments (the wells, each a `HandDrawnOutline`
at 1.5 with a washi tape name), its tab (2.5 / 3), and a strip of four verbs with an `i`, pinned to
the case's foot. The owner's job for the strip is to act from anywhere in a long case. The owner's
complaint is that it reads as nothing: a paper-coloured slab.

**Palette.** No new colour. The frame strokes in `currentColor`, which is the card's text ink:
`--color-foreground` rgb(10,10,10) on `--color-card` rgb(253,253,252) in light, and rgb(237,236,233) on
rgb(19,18,17) in dark, at the component's stroke-opacity 0.95. The cover is `--color-card`.
Crayons, rainbow and peer walk don't enter (L19–L21).

**Type.** Untouched. The verbs keep `--type-verb` and the `i` keeps `--type-small`. Nothing is added,
and no rendered string changes, so the font subset holds (law 30).

**Layout.**

```
DESK RAIL (≥1024, fine)                          PHONE DOCK (390×844, coarse)
 ┊ case stroke (3) ┊                             ┌ screen edge ─────────────────────────┐
 ┊ ┌ well (1.5) ──────────────┐ ┊                │ ┌ well (1.5) ────────────────────────┐ │
 ┊ │ …                        │ ┊                │ │ Off   Ask   Live                   │ │
 ┊ └──────────────────────────┘ ┊                │ └────────────────────────────────────┘ │
 ┊        16 px box gap          ┊                │        16 px box gap                  │
 ┊ ╔ tray (2.5 / outset 3) ═════╗ ┊                │ ╔ tray (2.5 / 3) ════════════════════╗ │
 ┊ ║ clear  fill  solve  share (i)║ ┊              │ ║ clear   fill   solve   share       ║ │
 ┊ ╚══════════════════════════╝ ┊                │ ╚════════════════════════════════════╝ │
 ┊   berth for hover notes       ┊                │   max(10 px, safe-area inset)          │
 ┊ └ case foot, 56 px below ─────┘                └──────────────────────────────────────┘
```

Centred as it ships (`space-evenly` verbs, the `i` in its trailing track). The tray takes the
content width. Its drawn line sits 3 px outside it, the same line the wells' strokes run down.

**Principles.**
1. *A box's weight is its reach.* The case is 3, the always-reachable chrome (the tab and now the
   strip) is 2.5, a compartment is 1.5. That's three weights the estate already draws, named once.
2. *The edge is honest.* A drawn frame that content leaks round isn't an edge. The frame and its
   cover are one change.
3. *Furniture doesn't move.* The frame is a pose (`:pose="0"`). It doesn't boil, draw itself on,
   or react to hover.

## 3 · Pass 1 review against the tell list and the brief (what changed, and why)

- **Top rule alone** (the first idea, and the closest to any "sticky footer" default). It was
  revised to a closed box. On the dock the case's side and bottom strokes are off the viewport
  (census §2: svg −4…394 at 390), so a rule would leave the strip's sides and foot unbounded against
  the glass. A rule doesn't answer the brackets the owner saw either, because they're side strokes.
  And every other compartment in the card is a closed drawn box, so one grammar (W7 §10: "desktop
  and mobile the same grammar") means the strip is one too.
- **A washi name ("tools")** was rejected. The four verbs name themselves under their icons. A tape
  would be the "label above content" tell, new copy (subset re-cut, law 30), and a fifth tape voice
  in a card whose tape voice is already contested (§10 heading work).
- **A draw-on reveal** when the drawer opens was rejected. That's non-user-triggered motion on every
  open, for furniture. The case's own glide already carries the frame.
- **A heavier 3 px frame** (matching the case) was rejected. Two 3 px lines 24 px apart on the rail
  read as a double case edge. 2.5 is an existing rank, not a new literal.
- **A CSS border** was never a candidate (L5 / law 37). The census's one CSS border in the strip,
  the `i` ring, is cut at the same time (§4.3). Leaving it would put two hands in one strip.
- **Generic-kit check.** No new radius, shadow, gradient, hue, label or icon. The only shadow is
  card-on-card and paints no contrast. It's a cover, not an edge (chair's row, §8).

---

## 4 · The spec

### 4.1 Tokens (values, homes)

| token / prop | value | home | why this value |
|---|---|---|---|
| frame | `HandDrawnOutline :stroke-width="2.5" :outset="3" :radius="0" :pose="0"` | `GameControlPanel.vue`, inside `.action-bar` | the `DrawerTab` pair; `:pose` → pruned, one node, no beat, no filter (the wells' pattern) |
| frame box | `position: absolute; inset: 0` wrapper (the frame measures the bar's padding box) | same | keeps the bar's grid, the verbs' boxes and the notes' containing block where they are. CTRL-TAPE's pass-3 "two drawn frames painting nothing without `inset: 0`" is this rule |
| `--strip-cover` | `0.5rem` | declared on `.action-bar` (inherited by its `::before`/`::after`), consumed bare | covers the wells' side strokes plus their corner overshoot (6 px left 1–18 px, 8 px leaves 0). A spelled constant, not a measured token, so not an `@property` |
| flank cover | `box-shadow: calc(-1 * var(--strip-cover)) 0 0 0 var(--color-card), var(--strip-cover) 0 0 0 var(--color-card)` | `.action-bar`, **inside** the existing sticky media block (`GameControlPanel.vue:2181`) | side-only: covers the flanks at full bar height and adds nothing above or below (§1, the spread that was ruled out) |
| fade and skirt reach | `.action-bar::before, .action-bar::after { inset-inline: calc(-1 * var(--strip-cover)) }` | same sticky block | the skirt covered the content width only, so the leak ran on below the bar (draft 1) |
| bar padding | `padding-block: 0.275rem` (was `0.4rem 0.15rem`) | `.action-bar` | same 0.55rem sum, so the bar's height is unchanged (64.81 / 66.77 measured). The verbs sit optically centred in a box that now shows its asymmetry |
| gap above the strip | rail `margin-top: 0.5rem` (flex, adds to the well's 0.5rem) · dock `.mobile-control-panel > .action-bar { margin-top: 1rem }` (block, collapses with it) | `.action-bar` | two drawn frames need outset + excursion on both sides. That's 16 px box gap, measured 15.94–16.00, ink daylight 8–10 css |
| dock foot | `padding-bottom: max(0.625rem, env(safe-area-inset-bottom))` on the dock card | `scene.css`, the portrait dock's `.controls-card` rule (overrides `py-1.5`'s bottom) | the frame's bottom ink reaches 6.51 css below the bar. The old 6 px would clip it. 10 leaves 2.5–3.0 css. `env()` is the chair's §6.1 row, and a UA value isn't a `var()` fallback |
| `i` ring | `.info-glyph` `border` and `border-radius` **deleted**. `HandDrawnOutline :stroke-width="1.5" :outset="0" :radius="14" :pose="0"` inside it | `GameControlPanel.vue:2320–2358` | a well's weight, subordinate to the tray. The generator clamps r to half the box, so it's a hand-drawn circle (radius 13.11–14.55 measured off the path, no NaN). It strokes `currentColor`, so rest = `--ink-press-quiet` and open/hover = foreground, from the rules that already write `color` |

No `@property` is added. `--strip-cover` isn't measured. The measured tokens this touches
(`--card-pad-b`, `--action-bar-h`) keep their publisher. See G-BAR-8 for the one defect this found in it.

### 4.2 Components

- **StripFrame**, the only new instance: one `HandDrawnOutline` in the bar's template as its last
  child, `aria-hidden` (the component already does this), `pointer-events: none` (already does).
  It isn't a new component. It uses the house's one box grammar, as the wells and the tab do.
- **The cover**, three declarations on the bar and its two pseudos. All three read `--strip-cover`.
  Re-cut the wells' outset and re-cut this: noted at both ends, and G-BAR-2 catches the drift.
- **The drawn `i` ring**, a second posed instance, 28×28.

### 4.3 States

| state | the tray | measured / by construction |
|---|---|---|
| rest, content under it (`data-fold-below`) | frame drawn. The 2 rem fade dissolves content toward it, now across the flanks too | leak 0 / 0, all scrolling cells |
| scroll end, or a card that doesn't overflow (430×932) | frame drawn with 16 px of paper between it and the last well | daylight 8–10 css |
| hover on a verb (fine) | the verb's ink lift only. The frame has no hover (law 14: it isn't a control) | unchanged rules |
| a verb armed (`sure?`) or the §15 confirm in the verb row | inside the frame, and the frame doesn't change | re-bakes only if the bar's box changes (ResizeObserver) |
| key list opened by the `i` (G-INFO's arm puts it in the strip) | the frame grows with the bar's box and re-bakes once | coupling row, §8 |
| focus-visible on a verb | the verb's own ring (law 39), inside the frame | **unmeasured**, G-BAR-10 |
| loading / disabled | unchanged | — |
| drawer shut | goes with the case (the drawer glide) | — |
| <1024 landscape, bar in flow | frame drawn. No cover (the shadows and pseudo reach live in the sticky block only) | **unmeasured**, G-BAR-11 |
| PRM · reduced transparency · contrast more | identical: static, opaque, nothing to cut | by construction |
| forced colours | the UA drops `box-shadow`, so the flank leak comes back and the frame goes to CanvasText | accepted, stated |

### 4.4 Copy (M16)

None added, none changed. The `i` keeps "what the keys do", and each verb's name, `aria-label` and
utterance stay as they are (law 33). `check-copy-register` on main is **exit 0** (0 dashes, 0
unadmitted jargon, lexicon 25), and this spec leaves its corpus untouched.

### 4.5 Motion

**No motion of its own and no new rung.** The frame is a pose. It arrives and leaves inside the
case's move, `MOTION.curves.drawerGlide` = `cubic-bezier(0.32, 0.72, 0, 1)` @ 520 ms (R6 L1), and
the ratified pose isn't re-timed. The fade keeps its shipped 150 ms, which this spec doesn't own.
Under PRM there's nothing to cut. A draw-on was considered and refused (§3).

### 4.6 Desktop and phone, light and dark

- **Rail, fine and coarse (1280×800):** the tray is 284.22 / 292.31 × 64.81 fine (chromium / webkit)
  and 184 × 64.81 coarse. Its ink reaches 4.39–5.00 css out at the sides, 5.64–6.34 above and
  5.35–6.55 below. That falls inside the 56 px skirt, where the hover notes berth. A note lying over
  the bottom stroke is tape across a drawn line, as a well's `tag` straddles its own edge. The case
  stroke stays 24 px out. Declared deltas: verbs −2.00 px (the symmetric padding), `scrollHeight` +8.
- **Dock (390×844, 430×932):** the tray is 374 × 66.77. Side ink reaches 4.5–5.0 css out, inside the
  8 px card padding with 3 px of glass to spare. The bottom ink is 2.5–3.0 css above the viewport
  bottom with Playwright's zero inset, and on an iPhone it sits above the home indicator via `env()`.
  Declared deltas: verbs −6.00, `scrollHeight` +12, the case at 430×932 grows 12 px upward (top
  256.84 → 244.84). `--action-bar-h` 73 → 77 on a landed tree (ceil(66.77 + 10)).
- **Light and dark:** one token set. The frame is the card's ink in both. Contrast is in §1.

---

## 5 · Gates it lands with (born RED on `1e6cfbbf`, each with its negative control)

| id | row | HEAD | DESIGN | negative control |
|---|---|---|---|---|
| G-BAR-1 | the strip's own drawn ink covers ≥ 0.98 of each side's run (differential: frame shown vs hidden, DPR 2), 1280×800 fine and coarse, 390×844 and 430×932 `hasTouch`, both engines, both themes | RED (no frame; top band ≤ 0.8 % ink) | 1.00 ×4 sides, every cell | frame `v-if` false → 0 |
| G-BAR-2 | **no leak**: flank columns from content edge to 8 px out, over [bar top, min(card bottom, bar bottom + 60)], wells' outlines shown vs hidden, Δ = 0 px | RED 487–783 per flank | 0 / 0, 8 cells | cover 0.375rem and no skirt reach (draft 1) → 1–18 px over the bar and a visible below-bar stroke |
| G-BAR-3 | **frames don't cross**: scroll-end ink daylight between the last well and the tray ≥ 4 css in every column; box gap ≥ 15.9 | n/a (RED by construction: the frame would sit 8 px from the well) | 8.0–10.0 · 15.94–16.00 | dock `margin-top: 0.5rem` (draft 2) → 0.5–1.5 |
| G-BAR-4 | non-text contrast on painted bytes, ink = \|L_paper − L\| (CTRL-RULE's dark-column cure): frame core median ≥ 3:1, and the `i` ring median ≥ 3:1, both themes, both engines | ring 3.26–4.36 | frame 14.20–17.78 · ring 4.66–5.57 | the ring at `--ink-press-rule` reproduces HEAD's 3.26 |
| G-BAR-5 | **foot clearance**: the frame's lowest ink ≥ 2 css above the viewport bottom on the dock; source gate `env(safe-area-inset-bottom)` in the dock card's bottom-padding rule; one RUNSHEET line (chair's) that reads the tray's bottom stroke against the home indicator on the real iPhone | RED (no `env()` term, census §2) | 2.5–3.0 | 6 px pad → the frame's 6.51 excursion clips (arithmetic; build and read it) |
| G-BAR-6 | L5 in source: the `.action-bar` template subtree carries a `HandDrawnOutline`, **and** no `border` declaration in the `.action-bar` / `.action-verbs` / `.info-btn` / `.info-glyph` rules | RED (and the ring's `border: 1.5px solid` is live) | GREEN | a `border` put back on `.info-glyph` → RED |
| G-BAR-7 | π: board and masthead rects identical, bar height identical, `.tray-well` frames' computed paint and paths identical, against the HEAD control, both engines. Declared DELTAs only: verbs' y, `scrollHeight`, 430's case top, dock `--action-bar-h` | — | board and masthead identical in 12/12 | a goldens row framing the card is a declared DELTA, not a re-mint |
| G-BAR-8 | **publisher**: `--card-pad-b` equals the card's computed `padding-bottom` after the padding changes without the bar resizing (`env()` changes on rotation) | RED, found here: the injected 10 px pad read `--card-pad-b` **6px**, because the observer watches the bar only | cure: the publisher also observes the card | the pad changed post-load |
| G-BAR-9 | `filterBudget` exactly 9, both engines, both regimes; union raster area ±2 %; beat subscribers unchanged | GREEN | GREEN on a landed tree **(to read)**. By construction: a posed outline mints one filterless path | a frame without `:pose` enrols the beat → the subscriber count moves |
| G-BAR-10 | each verb's focus-visible ring lies inside the frame's inner edge with 0 overlap on its ink (`paintedExtent` differential) | — | **unmeasured** | — |
| G-BAR-11 | <1024 landscape (844×390, 812×375 `hasTouch`): computed `box-shadow` none on the in-flow bar; the frame's bottom ink ≥ 2 css clear of the play-tools row | — | **unmeasured** | — |

G-BAR-1…5 are ready as `opus-probe/probe.mjs` readings. The gate file ports them to the estate's e2e
with their controls. G-BAR-6 is a source check. The r0 probe's own R3 regex reads the `.action-bar {…}`
CSS block for `border|HandDrawnOutline`, **so a CSS border would turn R3 green**. The re-aim in
G-BAR-6's form is PROPOSED to the chair, since r0 is frozen.

---

## 6 · What dies

- The strip as a colour-matched slab. The comment at `GameControlPanel.vue:2097–2102` is
  re-written to say the strip is a tray.
- The wells' 4 px leak round the strip, meaning the m18 brackets (census §2's flank-ink row).
- `.info-glyph`'s `border: 1.5px solid var(--ink-press-rule)` and `border-radius: 50%`, and the two
  `border-color` lines in the open and hover rules. `color` alone now drives the ring.
- The bar's `padding-block: 0.4rem 0.15rem` asymmetry.
- The dock card's 6 px bottom (`py-1.5`'s lower half), replaced by `max(0.625rem, env(safe-area-inset-bottom))`.
- CTRL-COST's deletion arm, already dead by the owner's word. This spec doesn't argue it again.
- Refused: a CSS border, a top rule alone, a name tape, a draw-on, a 3 px frame.

---

## 7 · Risks and gaps (a gap is a gap)

1. **Not a prototype.** Everything was injected at runtime. The real Vue instance (ResizeObserver
   bake, `useId`, SSR-free mount order) is unbuilt. There's no dist, no e2e, no goldens, and no
   `filterBudget` census on a landed tree.
2. **G-BAR-10 and G-BAR-11 are unmeasured.** The landscape in-flow arm could put the frame's bottom
   ink on the play tools.
3. **The 430×932 case grows 12 px upward.** The board's rect doesn't move, but the sheet's top does.
   Whether it laps anything at 390×664 or in short-landscape isn't measured (PLR-PLACE's lap class).
4. **Two margins keyed by regime** (0.5rem flex, 1rem block) is a hand-coupled pair. G-BAR-3 guards
   it both ways, but a critic will call it a pair.
5. **`--strip-cover` couples to the wells' `:outset="4"`** through the component boundary. It's
   noted at both ends and G-BAR-2 catches drift, but it isn't derived.
6. **Real iPhone:** the `env()` foot is unmeasured on device, and so is the home-indicator overlap.
7. **The `i` ring's look is G-INFO's surface too.** If G-INFO drops or moves the `i`, the ring row
   goes with it, but the no-CSS-border clause stays.
8. **The owner may read "border" as a plain line.** Frames of both forms go to the re-look (U-10).
9. **Crude filter counter.** The probe's filter count (computed `filter` or attribute) swings 21–27 on
   HEAD alone across cells because of load timing. It isn't the census and isn't cited as evidence.
10. **The DEV `fx` disc** sits on `share` in crop c2 (dev only, census §2). It isn't in dist.

---

## 8 · Pass-5 charter rows (owning families; the owner disposes)

- **CTRL-TAPE / CTRL-RULE (the B8 default's movers, bar → `#card-foot`).** The tray goes with the bar as
  its child, with the same props. In the foot arm nothing scrolls under the bar (TAPE's I2: the bar
  covers nothing), so **the cover's three declarations are deleted there**. G-BAR-2 still runs and
  reads 0 by construction. G-BAR-3 re-reads between the scrollport's last visible well and the foot's
  tray (the port clips the well's stroke, so measure it). The foot's `padding-bottom:
  max(<foot pad>, env())` needs ≥ 6.51 + 2 css of room under the tray: RULE's 0.15rem (2.4 px) clips
  the frame. RULE's drawn top rule (3 px) and this closed tray (2.5) are **two frames of one ballot**.
  Build both on one encoded `?board=` payload (the chair's 2026-09-19 addendum).
- **CTRL-FACE (§10 leader).** Adopt the weight ladder as the card's stated hierarchy: case 3 ·
  reachable chrome 2.5 · compartment 1.5 · ring 1.5, written once where §10's hierarchy law lives.
  Carry G-BAR-7's π rows into the leader's census.
- **G-INFO.** Whatever the `i` opens inside the strip lies inside the tray, and the frame re-bakes on
  the bar's box. The `i`'s ring is drawn (§4.1) or the `i` goes. No CSS border survives in the strip either way.
- **G-PANEL (M17).** The dock's +12 px is priced here. M17's dock deal-row re-budget (117.77 px at 7 %
  ink, census §1b) is where it's paid back.
- **Chair's rows.** (a) G-BAR-6's R3 re-aim, PROPOSED (r0 frozen). (b) One RUNSHEET line for G-BAR-5.
  (c) A ruling that a card-coloured, zero-blur, side-offset `box-shadow` is a cover, not an edge, so
  L5 doesn't read it as a border (it paints no contrast against its own card). If the chair refuses
  it, the fallback is the foot arm, where no cover is needed.

---

## 9 · Evidence (three crops, each ≤ 25 KB; the probe)

| file | engine · theme · viewport · pointer | shows |
|---|---|---|
| `opus-c1-design-leakpose-chromium-dark-1280x800-fine.png` (15.1 KB) | chromium · dark · 1280×800 · fine (mouse) | m18's pose with the tray: the second well scrolled under the strip, with no brackets beside it or below it. HEAD's twin is the census's `c3` |
| `opus-c2-design-leakpose-chromium-light-390x844-coarse.png` (15.3 KB) | chromium · light · 390×844 · coarse (`hasTouch`) | the dock tray at the leak pose, with the `players` well under it covered. The DEV `fx` disc is on `share` (dev only). HEAD's twin is the census's `c4` |
| `opus-c3-design-end-chromium-light-1280x800-fine.png` (12.3 KB) | chromium · light · 1280×800 · fine (mouse) | scroll end: 16 px of paper between the `players` well and the tray, and the drawn `i` ring |
| `opus-probe/probe.mjs` · `vite.gbar-opus.mts` | — | the instrument (HEAD and DESIGN arms, the injection, the four differential readings). Raw JSON summarised above, not banked |
