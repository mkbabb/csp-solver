# F5 — THE PROPORTION LEDGER · RESEARCH DOSSIER (pass 1)

Lane: RESEARCH. Charter: `charter-f5.md`. Read-only against
`/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend`.
Every number below is either quoted from source (file:line) or derived by arithmetic from
declared CSS (labelled DERIVED). No dev server was touched; no DOM was measured live.

Method note on contrast: the AA figures below were recomputed from the token hexes/HSLs in
`src/assets/index.css` with the WCAG 2.x relative-luminance formula. The method reproduces
the estate's own recorded numbers to ±0.01 — graphite@68% → 5.23 light / 6.06 dark (matches
`GameControlPanel.vue:960-961` verbatim), crayon-rose → 4.10 on card (file records 4.11,
`index.css:169`), red-ink → 4.98 (file records 4.98), dark rose → 6.32 (file records 6.32).
The ledger is therefore trustworthy for the new rungs derived here.

---

## Q1 — Audit the current uniformity with numbers

### Q1a · `section-heading` heads six stanzas identically — CONFIRMED (count), rung MISNAMED

Six `section-heading` renders per panel instance, and **each game mounts two panel instances**
(mobile card + desktop rail, `GameScene.vue:80-105`), so twelve per page:

| # | heading | site |
|---|---|---|
| 1 | New game | `GameControlPanel.vue:337` (mobile), `:539` (desktop) |
| 2 | Size | `:349` (tab) / `:369` (plain) / `:544` |
| 3 | Difficulty | same loop, section 2 |
| 4 | Marks | `PencilModeToggle.vue:36` |
| 5 | Check | `AssistSettings.vue:61` |
| 6 | Candidates | `AssistSettings.vue:77` |

The register, `typography.css:251-268`:

```
.section-heading {            font-size: var(--type-subheading);   /* 1.272rem = 20.35px */
@media (min-width: 768px) { .section-heading { font-size: var(--type-heading); } }  /* 1.618rem = 25.89px */
```

**The charter's "√φ eyebrow — `--type-subheading` 1.272rem" is the NARROW arm only.** Every
desktop/drawer instance (the drawer exists ≥1024 only, `useControlsDrawer.ts:295`) renders at
`--type-heading` **1.618rem = 25.89px — the φ rung, not √φ**. It also flips
`text-align: center → left` and gains `padding-left: 0.75rem` at md. Any rank table written
against 1.272rem describes a surface no drawer user sees.

Font is `var(--font-display)` (Fraunces) at **weight 800** — `typography.css:255` records this
as "a deliberate pencil override (heavier than glass-ui's heading 700 — the wax pressed hard)".
So all six stanzas share the heaviest weight in the estate.

### Q1b · "all six option rows at the same 1.375rem/1.25rem" — FIVE rows, and two different arms

`OptionSelector.vue:35-38`:

```
mobile  ? 'text-[1rem] md:text-[1.375rem]'
        : 'text-[1.375rem] md:py-0.5 md:text-left md:text-[1.25rem]',
```

Five `OptionSelector` mounts per panel, not six: Size, Difficulty (from
`sections`), Marks, Check, Candidates. All five games declare **exactly two** sections
(`sudoku/game.ts:29-45`, `futoshiki/game.ts:31`, `thermo/game.ts:35`, `killer/game.ts:36`,
`kenken/game.ts:38`), so `sections.length === 2` universally and `showTabs` is always true
(`GameControlPanel.vue:127`).

Rendered rungs: desktop arm **22px** (<768) → **20px** (≥768); mobile arm **16px** (<768) →
**22px** (≥768). Both panels are always in the DOM, so at 1440px the page carries `.ctrl-btn`
at *both* 20px and 22px simultaneously.

`.ctrl-btn` font is hard-coded `"Fira Code", monospace` (`OptionSelector.vue:67`) — a literal
family string, not `var(--font-mono)`, so it is off-token.

Button counts (from the option constants): Size 3 (sudoku/thermo/killer), 4 (futoshiki),
3 (kenken); Difficulty 3; Marks 3; Check 3; Candidates 2 →
**14 `.ctrl-btn` per panel (15 futoshiki), 28 per page.**

### Q1c · Icons "all sit at 26–28px" — CONFIRMED, and the whole verb system fits in ONE √φ rung

Every literal `:size` in the panel (`GameControlPanel.vue`, both regimes):

| px | icons |
|---|---|
| 28 | DiceIcon `:396`/`:570`, EraserIcon `:449`/`:621`, SolveIcon `:478`/`:654` |
| 26 | FillForcedIcon `:464`/`:638`, ShareIcon `:487`/`:665`, UndoIcon `:504`/`:685`, RedoIcon `:513`/`:694`, HintIcon `:522`/`:703` |
| 22 | ScribbleLoader (the loading swap only) `:475`/`:651` |

Three distinct stops. **28/22 = 1.273 — the entire eight-verb icon system spans exactly one
√φ rung**, and the commit verb (Deal, 28) shares its top stop with Eraser and Solve. That is
the sharpest single number for problem 1.

### Q1d · Deal's LABEL is the smallest text in the panel

`.deal-btn .icon-sublabel { display: block }` (`GameControlPanel.vue:767-769`) — Deal is the
only icon verb whose name shows on a fine pointer. That name renders at
`.icon-sublabel { font-size: var(--type-caption) }` (`:857`) = **14.38px @1440** (DERIVED from
`clamp(0.75rem, 0.71rem + 0.21vw, 1rem)`), in Patrick Hand, at `--color-muted-foreground`.

So the commit verb of the staged zone is: a 28px die (bottom of a 22–28 band) + a 14.38px
caption label — beneath the 20px option lists it commits and 11.5px beneath their 25.89px
headings. **The rank inversion is measurable at 1.8× against the headings.**

### Q1e · The rank table, argued from frequency × consequence

Frequency = per-session acts; consequence = what an errant tap costs. Both are read off the
shipped code, not asserted: the two-tap arm exists *only* on Deal and Clear
(`GameControlPanel.vue:259-274`, `:293-308`, dirty-gated on coarse), which is the estate's own
recorded judgement of which verbs are destructive.

| rank | control | frequency | consequence | evidence |
|---|---|---|---|---|
| **1** | **Deal** | once per board | commits staged size/difficulty, replaces the board; coarse two-tap armed | `:259-274`; re-homed out of the action row for "spatial prophylaxis" `:440`, `:747` |
| **1** | **Clear** | rare | wipes the board; coarse two-tap armed; undo-recoverable (U1) | `:293-308` |
| **2** | Size, Difficulty | once per board, staged | provisional — "wipe nothing (arm-not-live)" | `:331-334` |
| **2** | Marks (Normal/Corner/Center) | many times per board | changes what a keystroke means — the only *play-cadence* mode | `PencilModeToggle.vue:2-8` |
| **2** | Undo / Redo / Hint | many per board | recoverable, coarse-only row | `:497-525`, `.play-controls` coarse-gated `:916-928` |
| **3** | Solve, Fill, Share | ≤1 per board | Solve ends the board; Share is inert | `:458-489` |
| **3** | **Check** (Off/Ask/Live) | set-once, then re-tap to re-arm | preference; default Ask | `AssistSettings.vue:33-37,57-59` |
| **3** | **Candidates** (Off/On) | set-once | preference; default Off, "the NYT clutter lesson" | `AssistSettings.vue:38-41,73-74` |
| **4** | KeyboardLegend, drawer tab, heading-value | ambient | none | `KeyboardLegend.vue`, `DrawerTab.vue` |

Note the charter's own example holds, with a caveat: Check is rank 3 *by frequency*, but its
re-tap **is** the on-demand check trigger — `AssistSettings.vue:19-21` and
`GameControlPanel.vue:98-100` both record that `errorCheckMode` stays a manual prop+emit
because "OptionSelector emits on every click and re-tapping 'Ask' re-arms the on-demand
snapshot — defineModel's hasChanged guard would swallow that re-emit, killing the re-check."
**Demoting Check to a caption-tier row must not shrink its tap target below the 44px floor,
because that row is also a repeated action, not only a preference.**

---

## Q2 — Design the ladder as tokens: what the token layer actually offers

### Q2a · The √φ file is not "half-built" — it is 17 rungs with THREE live consumers

`typography.css` declares 17 size rungs (`:27-47`), 7 leadings, 7 trackings, and **21
`@utility` semantic registers** (`:75-236`). Measured consumption:

- **`@utility` classes: ZERO consumers.** `grep` for `text-title|text-heading|text-subheading|
  text-prose|text-body|text-small|text-caption|text-micro|text-admin-label|text-mono-*|
  text-display*` across `src/**`, `index.html`, and `e2e/**` returns nothing outside
  `typography.css` itself. `index.css:98-100` says so in its own voice: "text-body/text-prose/
  text-title/etc., all zero-consumer utilities today".
- **Size rungs consumed via `var()` outside typography.css — only five, and only the bottom
  five:** `--type-caption` (9 real sites), `--type-body` (4), `--type-small` (3),
  `--type-micro` (1, dev-only), `--type-admin-label` (2, dev-only).
- **`--type-subheading` / `--type-heading` have exactly one consumer each: `.section-heading`.**
- **`--type-title`, `--type-prose`, and all seven `--type-display-*` have ZERO consumers.**

So the live rendered ladder in the whole app is: caption (12→16px) · small (14→20px) ·
body (16→22px) · [`.ctrl-btn` 20/22px hardcoded] · subheading 20.35 · heading 25.89 ·
[viewBox geometry: card wordmark 48u, logo 52u]. **Everything at or above `--type-title`
(32.93px) is unused.** F5 would be the first consumer of the top half of its own ladder — which
is genuinely available headroom, and the strongest argument the family has.

### Q2b · The ink-pressure channel is NEARLY EXHAUSTED — and it runs the wrong way

The charter cites `heading-value`'s 68% graphite (`GameControlPanel.vue:955-967`) as the
precedent. Recomputed ledger, all on `--color-card`:

| tone | light | dark |
|---|---|---|
| `--color-foreground` | 19.41 | 15.84 |
| graphite 100% | 14.78 | 12.03 |
| graphite 85% | 9.19 | 8.90 |
| graphite 80% | 7.76 | 7.99 |
| graphite 75% | 6.57 | 7.14 |
| **graphite 68% (shipped `heading-value`)** | **5.23** | **6.06** |
| graphite 60% (rejected, T4-W10 gate 1) | 4.09 | 4.97 |
| **`--color-muted-foreground` (every rank-3 heading today)** | **4.65** | **7.69** |
| muted 85% | 3.49 | 5.85 |

Two consequences the charter does not anticipate:

1. **`--color-muted-foreground` sits 0.15 above the AA floor in light mode (4.65:1). It cannot
   be lightened at all.** Any `--affordance-4` defined as "muted, one pressure step down" is
   born failing. The muted ramp dies immediately: muted@85% = 3.49:1.
2. **The shipped "quiet" pressure token (graphite 68% = 5.23) is LOUDER than the shipped
   "normal" heading tone (muted-foreground = 4.65).** The estate's pressure channel is
   currently inverted. A real pressure ladder must be re-based on the **graphite** ramp —
   e.g. 100 / 85 / 75 / 68 (14.78 / 9.19 / 6.57 / 5.23 light; 12.03 / 8.90 / 7.14 / 6.06 dark)
   — which yields four AA-clean steps in both themes and retires `text-muted-foreground` from
   the heading role entirely. That is a token-layer change of ~8 lines and it is the single
   best-supported move in the charter.

### Q2c · Two existing pressure/ink steps are already sub-AA — the ledger F5 must "respect" has holes

- `KeyboardLegend.vue:56-60` — legend text at **graphite 55% = 3.53:1 light / 4.36:1 dark**,
  at `--type-caption` size. Below AA 4.5:1 in **both** themes. `:97-100` — the `kbd` borders at
  graphite 40% = **2.36:1 light / 2.87:1 dark**, below the WCAG 1.4.11 3:1 non-text floor.
- `GameControlPanel.vue:864-867` — `.icon-sublabel.is-armed` writes the confirm ("sure?") in
  `var(--color-crayon-rose)` = **4.10:1 on `--color-card`**, sub-AA in light. The estate already
  minted the fix for exactly this hue: `--color-red-ink` #d02a52 = 4.98:1 (`index.css:163`), and
  used it for the difficulty heading (`GameControlPanel.vue:786-788`). The sublabel path was
  never converted. **This sits on the Deal control F5 promotes to rank 1.**

Formalizing pressure as a rank channel canonizes these unless the ladder is derived from the
68% floor upward and these three sites are corrected in the same pass. That is a ~4-line fix
and a defensible scope addition for a token family.

### Q2d · Icon-size stops: there is no token layer for them

All eight icon sizes are template literals (`:size="28"` / `"26"` / `"22"`).
`pencilConfig.ts` has `PENCIL` stroke widths (`:6-13`), `MOTION`, `BOIL_CONFIG`,
`DRAW_IN_PRESETS`, `GLYPH_ANIM`, `CELEBRATION` — **no icon-size table, and no spacing table.**
There is no `--space-*`, `--rhythm-*`, `--stack-*`, or `--unit-*` custom property anywhere in
`src/**` (grep: zero hits). Both the icon-stop ladder and the rhythm unit are greenfield.

---

## Q3 — Deal at rank 1: does the die survive 2×?

### Q3a · No baked pose is involved — CONFIRMED

`DiceIcon.vue` is a plain inline SVG: `:width="size ?? 28" :height="size ?? 28"
viewBox="0 0 24 24"` (`:6-13`), two `<g transform="rotate(…)">` groups of `<rect>` + `<circle>`,
`stroke="currentColor" stroke-width="1.8"`. No `rasterPose` / `useRasterStack` / pose-stack
machinery, no `filter=` attribute. The pose-bake surfaces are elsewhere
(`HandwrittenLogo` `image.logo-pose-bmp`, `DarkModeToggle`, `BoilDivider`'s grain-hoist —
`pencilConfig.ts:236-253`). **Mark 4's raster pinning does not reach DiceIcon.**

`HandDrawnOutline` (the panel card's frame) is also raster-free: it re-derives four *path*
poses from a ResizeObserver (`HandDrawnOutline.vue:50-101`), so a panel that grows or shrinks
costs one geometry re-derivation, not a bitmap re-bake.

### Q3b · But the stroke system does NOT survive 2× — and the charter's "pure prop/CSS change" is false

`stroke-width="1.8"` is in viewBox user units on a 24-unit box, and there is no
`vector-effect="non-scaling-stroke"` anywhere in the file. Rendered stroke (DERIVED):

| `:size` | rendered stroke |
|---|---|
| 28 (today) | 2.10px |
| 48 | 3.60px |
| 56 | 4.20px |

At 56px the die's line is **4.20px — heavier than `PENCIL.gridSubgrid.strokeWidth` (4) and
1.68× `PENCIL.gridCell` (2.5)** (`pencilConfig.ts:9-10`). A pencil die drawn with a heavier
line than the board's subgrid is a soul defect, not a scale defect. `DiceIcon` exposes only
`{ size?, playing? }` (`:2`) — **a `strokeWidth` prop must be added**, so the change is a
component edit (+2 lines), not the "pure prop/CSS change" the charter claims. Compensating
stroke for a constant 2.1px screen line at 56px = 1.8 × 28/56 = **0.9 user units**.

### Q3c · The grain envelope Deal rides is documented as derived for 20–32px icons — and 2× leaves it

`.icon-btn { filter: url(#grain-static) }` (`GameControlPanel.vue:816`). `grain-static` is
`feTurbulence baseFrequency 0.04 / feDisplacementMap scale 2.5` (`pencilConfig.ts:254-258`),
emitted with **no `primitiveUnits`** (`SvgFilters.vue:49-62`), so both are `userSpaceOnUse`:
a literal **2.5px displacement at a 25px wavelength**, size-invariant.

`pencilConfig.ts:264-266` states the constraint outright: *"grain-static stays byte-untouched —
the grid's 1000-unit space, glyphs, and **20–32px icons** depend on its values (crit-forensics
HOLD)."* A 48–56px Deal button leaves that band: the grain's relative energy halves (2.5px over
a 56px die vs a 28px die), and the wavelength goes from ~1.1× to ~0.45× the icon's own size.
This is the exact inverse of the recorded `grain-outline` unit bug (`pencilConfig.ts:262-273`:
"grain-static's userSpaceOnUse units render LITERAL there … 3.8× the BEFORE screen energy").
The HOLD forbids retuning `grain-static`, so the honest fix is a **new static preset**
(`grain-deal`, scale ≈ 2.5 × 56/28 = 5.0, baseFrequency ≈ 0.04 × 28/56 = 0.02, by the
a2-boil-outline derivation) — a new *static* def, which mark 4 permits (nothing live, rasters
once), but which **contradicts the charter's "Mark 4: zero interaction — no new drawn surfaces
at all (its virtue)"** and its "near-zero component surgery" claim.

---

## Q4 — Check/Candidates at rank 3: cost, and what the demotion buys

`AssistSettings.vue` is 91 LOC: two identical stanzas (`:60-71`, `:75-89`), each
`div.flex.flex-col.items-center.gap-1.md:items-stretch` + `h2.section-heading` +
`OptionSelector`. Byte-for-byte the same shape as `PencilModeToggle.vue:32-46` and the
`sections` loop at `GameControlPanel.vue:542-556`. Collapsing the two into one caption-tier row
under a hairline is a template restructure of ~20 lines with a **net LOC reduction**.

**The OptionSelector `size` variant is the wrong axis.** `mobile` is *already* a size variant in
effect (16/22px vs 22/20px), and the class binding at `:34-41` is already a nested ternary on
`mobile` × `selected`. A third boolean makes it 2×2×2. The parsimonious realization: replace the
two arbitrary-value arms with `font-size: var(--ctrl-size, …)` in the scoped block and let the
*consumer* set the rung — **−2 template lines, +~6 CSS lines**, no new prop, and it retires the
last two `text-[…]` arbitrary values in the file. (It also fixes the off-token
`font-family: "Fira Code", monospace` at `:67` → `var(--font-mono)`, 1 line.)

### What the demotion is worth, in pixels

`scene.css:29-46` records the measurement that bounds this whole family:

```
/* T4-W8 seal: the assist rows grew the card past the sheet (936px against an 800px
   viewport — … redding six e2e specs, the drawer's never-above-the-sheet contract,
   and the logo golden in one stroke). Cap the card … and let the card's CONTENT scroll. */
.controls-card { max-height: calc(min(42rem, 85vw, 100dvh - 10rem) - 2rem); overflow-y: auto; }
```

Cap (DERIVED): at 1440×900 → `min(672, 1224, 740) − 32` = **640px**; at 1280×800 →
`min(672, 1088, 640) − 32` = **608px**. Recorded content height with the assist rows: **936px**.
My independent CSS arithmetic for the same stack lands at ~915px, i.e. the estimate is faithful
within 2%.

Per-stanza content heights (DERIVED, desktop ≥1024, fine pointer, 1440px):

| stanza | height |
|---|---|
| New game heading (31.1 + 5.6 mb) | 36.7 |
| Size (31.1 + 4 + 3×38) | 149.1 |
| `hr.my-3` | 25 |
| Difficulty | 149.1 |
| Deal row (mt 9.6 + 54.4) | 64.0 |
| peek divider (`my-2` 16 + 14) | 30.0 |
| Marks | 149.1 |
| **Check** | **149.1** |
| **Candidates (2 buttons)** | **111.1** |
| action row (`.icon-btn` 44²) | 44.0 |
| KeyboardLegend | ~40 |

**Demoting Check + Candidates to one shared caption row (~44px, tap-floor-bound) recovers
≈216px** — the largest single reclamation available anywhere in the panel, and it comes with
zero e2e cost (see Q7). Promoting Deal to rank 1 spends ~40px of it. Net ≈ −176px → ~760px,
**still above the 608–640px cap**. So: F5's ledger materially shortens the drawer but does
**not** un-scroll it. Any claim that it does is unsupported.

---

## Q5 — The rhythm unit: there is no unit, and the top-level column has NO gap

Complete spacing inventory of the controls surfaces (`GameControlPanel.vue`,
`AssistSettings.vue`, `PencilModeToggle.vue`, `OptionSelector.vue`, `GameScene.vue`):

Tailwind utilities: `gap-1` ×4 (0.25rem) · `gap-2` (0.5) · `mt-3` (0.75) · `my-3` (0.75) ·
`my-2` (0.5) · `px-3` (0.75) · `px-2` (0.5) · `py-1.5` ×2 (0.375) · `py-0.5` (0.125) · `p-5` (1.25)

CSS literals: `margin-bottom: 0.35rem` (`:743`) · `margin-top: 0.6rem` (`:751`) ·
`gap: 0.15rem` ×2 (`:759`, `:881`) · `padding: 0.3rem 0.85rem` (`:764`) ·
`padding: 0.3rem 0.5rem` (`:886`) · `padding-block: 1rem` (`:876`) · `gap: 1rem` (`:925`) ·
`margin-top: 0.35rem` (`:926`) · `gap: 0.05rem` (`:945`) · `padding: 0.25rem 0` +
`gap: 0.25rem` (`OptionSelector.vue:108-113`)

**Distinct magnitudes: 13** — 0.05, 0.125, 0.15, 0.25, 0.3, 0.35, 0.375, 0.5, 0.6, 0.75, 0.85,
1, 1.25 rem. Their greatest common divisor is **0.025rem = 0.4px**; there is no multiple family,
i.e. **no rhythm unit exists**. (Plus the fixed 2.75rem tap floor and scene gaps 1.25 / 2 / 3.5rem.)

And the load-bearing one-liner: `GameControlPanel.vue:529` —
`class="control-panel-wrap flex flex-col items-center md:items-stretch"` — **the desktop
panel's top-level column declares no `gap` at all.** Every zone break between Marks / assists /
actions / play tools / legend is 0px; the only real separators are the divider's `my-2` (8px
each side) and incidental margins. This is the "spatial rhythm off" defect in one attribute.

A 0.25rem (4px) base unit fits nine of the thirteen values as clean multiples (0.25/0.5/0.75/
1/1.25 = 1,2,3,4,5u); the outliers are the four decorative micro-gaps (0.05, 0.15, 0.35, 0.6)
and `py-1.5`/`py-0.5`. Zone break at 3u (0.75rem), intra-stanza at 1u (0.25rem) is arithmetically
compatible with everything already shipped.

---

## Q6 — One ledger, three surfaces: the picker and mobile

### Q6a · The picker's name is viewBox geometry — it is NOT re-settable by a type token

`GameCard.vue:393-401`:

```
.card-wordmark { font-family: var(--font-display); font-weight: 900;
  /* viewBox geometry, not a type rung (the logo's convention): user units in the
     60-unit box, baseline y=46. The rendered size rides the SVG height above. */
  font-size: 48px; }
```

The rendered size is set by `.game-card-name { height: 1.9rem }` (`:386-391`) with
`preserveAspectRatio="xMidYMid meet"` on a `0 0 W 60` box (`:80-83`), so scale = 30.4/60 =
0.5067 → **rendered wordmark ≈ 24.3px, constant across all game names** (the width term
`max(120, len*34+12)` grows with the name, so `meet` stays height-bound). Beneath it,
`.game-card-range { font-size: var(--type-body, 1rem) }` (`:415-421`) = **18.6px @1440**.

**Name/range ratio = 1.31 at 1440, and 24.3/22 = 1.10 at the body clamp ceiling.** One √φ rung
at best, collapsing to nothing on wide viewports — the measured proof of problem 7's flatness.
Pips are `0.55rem = 8.8px` circles with a 2px border (`GameGallery.vue:486-497`).

The re-set channel for the picker is therefore an **SVG height rung** (`1.9rem`), not a type
token. `HandwrittenLogo.vue:390-394` records the estate's standing refusal to put these on the
ladder: *"a rem/clamp rung would couple glyph metrics to root font-size / viewport width and
clip the fixed box. Deliberately off-token."* And the logo carries its **own fourth ladder** —
`--logo-height: 3.9 / 4.452 / 5.724 / 6.996rem` at <360 / base / ≥640 / ≥1024
(`:293`, `:312`, `:416`, `:423`), documented at `:290-292` as *"One golden rung up (×√φ, 1.272)
from the shipped 3.5/4.5/5.5rem ladder"*. So "one ledger" already competes with three parallel
scales: `--type-*`, the logo's rem×√φ ladder, and viewBox user units. F5 can honestly claim
**three surfaces, two channels** — type rungs for text, height rungs for SVG wordmarks — but not
one ledger.

### Q6b · Mobile: the tall card, and what demotion buys there

`GameScene.vue:80-86` — the stacked regime is one `HandDrawnOutline` + `div.bg-card.px-2.py-1.5`
holding the whole panel; `.mobile-board-width { width: min(42rem, calc(100vw - 1.5rem)) }`
(`scene.css:120-122`) = **366px at a 390px iPhone**. No `max-height`, no `overflow`, so the
mobile card is unbounded page scroll — the charter's problem 6, confirmed structurally.

Mobile stanza heights (DERIVED, coarse pointer, 390px; every `.ctrl-btn` and
`.mobile-heading-btn` floored at 2.75rem = 44px by `index.css:679-686`):

New game heading ~30 · tab row 44 · options row 52 · Deal 53.6 · peek surface 46
(`padding-block: 1rem` ×2 + 14px divider) · Marks 80.4 · **Check 80.4** · **Candidates 80.4** ·
action row ~52 · play tools ~58 → **≈ 616px of card content** below the board.

**Demoting Check + Candidates to one caption row costs ~44px instead of ~169px → ≈125px saved,
about 20% of the mobile card.** Real, and achieved purely by demotion, exactly as the charter
claims. But note the floor: on coarse pointers every option button is 44px tall regardless of
font size (`index.css:679-686`), so **a rank-3 font demotion buys nothing on mobile by itself** —
the saving comes entirely from collapsing two stanzas into one row (killing one heading + one
44px row), not from the type rung. The charter's "the tall card gets shorter through demotion"
is true only in the structural sense.

---

## Q7 — Blast radius: goldens, e2e, budgets

**Goldens: ZERO at risk.** `e2e/goldens/` holds 8 PNGs = 4 subjects × 2 platforms:
`cell-light`, `grid-corner-light`, `logo-light`, `toggle-crest-dark`. None is the control panel,
the assist rows, the Deal button, or a gallery card. F5 touches no golden subject. (The logo
ladder is untouched; `HandwrittenLogo.vue:305-312` records that the <360 rung step was chosen
precisely so "no capture/golden at those widths moves".)

**e2e assertions that constrain F5 (only three):**

1. `visual-regression.spec.ts:150-153` —
   `.ctrl-btn` **first** `fontSize >= 19`. The first `.ctrl-btn` in DOM order is the *mobile*
   panel's Size selector (`GameScene.vue:80` precedes `:93`), which renders at 22px ≥768. Safe
   *because Size stays rank 2* — but a rank-3 demotion applied to the wrong selector, or a
   DOM-order change, reds this. Load-bearing.
2. `mobile-affordances.spec.ts:182-184`, `:284`, `mobile-platform.spec.ts:311`, `drawer.spec.ts:47-48`
   — 44×44 floors. Deal growing is safe; a demoted Check/Candidates row must keep 44px.
3. `mobile-affordances.spec.ts:352`, `:367` —
   `dealBtn.locator(".icon-sublabel")` must read `"Deal"` / `"sure?"`. **The class name
   `.icon-sublabel` is load-bearing**; promoting Deal's label to a display register must keep
   that class, not replace it.

**Zero e2e or unit references to the Check / Candidates / Marks / New-game headings** (grep over
`e2e/*.spec.ts` for their text and aria-labels returns nothing). The demotion is free.

**Budgets.**
- Distinct rendered type sizes in the whole controls system: **5** (25.89 · 22 · 20 · 16.4 · 14.38),
  with 20 of 22 text controls on just two of them.
- Distinct icon stops: **3** (22 · 26 · 28), total span 1.27× = one √φ rung.
- Distinct spacing magnitudes: **13**, no common unit.
- Available unused rungs above the live ladder: **`--type-title` + 7 `--type-display-*` = 8**, all
  zero-consumer.
- Available AA-clean graphite pressure steps: **4** (100 / 85 / 75 / 68).

**LOC estimate for the full F5 realization** (files, lines touched):
`typography.css` +35 (ladder tokens + rhythm unit + 3 `@layer components` classes) ·
`GameControlPanel.vue` ~14 touched (2× DiceIcon size+stroke, `.deal-btn`, `.deal-row`,
`.new-game-heading`, `.icon-sublabel` tone, top-level `gap`) ·
`AssistSettings.vue` ~20 restructured, **net −5** ·
`OptionSelector.vue` −2/+7 (`--ctrl-size` + `var(--font-mono)`) ·
`DiceIcon.vue` +2 (`strokeWidth` prop) ·
`GameCard.vue` 2 (`.game-card-name` height, `.game-card-range` rung) ·
`GameGallery.vue` 1 (`.gallery-pip`) ·
`pencilConfig.ts` +8 *if* the `grain-deal` preset is needed (Q3c).
**≈ 90 lines touched, ≈ +45 net, 8 files, 0 new components, 0 new live filters.** The parsimony
claim survives; the "near-zero component surgery" claim needs the DiceIcon prop and possibly the
grain preset.

---

## MEASUREMENTS

| quantity | value | source |
|---|---|---|
| `.section-heading` renders per panel | 6 | `GameControlPanel.vue:337,349,369,539,544`; `PencilModeToggle.vue:36`; `AssistSettings.vue:61,77` |
| panels per page | 2 (mobile + desktop, both in DOM) | `GameScene.vue:80-105` |
| `.section-heading` px | 20.35 (<768) → **25.89 (≥768)** | `typography.css:251-268`; DERIVED from 1.272/1.618rem |
| `.section-heading` weight | 800 Fraunces caps, `tracking-caps` 0.1em | `typography.css:253-258` |
| `OptionSelector` mounts per panel | 5 | Size, Difficulty, Marks, Check, Candidates |
| `.ctrl-btn` px, desktop arm | 22 (<768) → **20 (≥768)** | `OptionSelector.vue:37` |
| `.ctrl-btn` px, mobile arm | 16 (<768) → 22 (≥768) | `OptionSelector.vue:36` |
| `.ctrl-btn` per panel | 14 (15 futoshiki) | option constants; 3+3+3+3+2 |
| sections per game | **2, all five games** | `*/game.ts` `options:` |
| icon stops | 22 · 26 · 28 px (span 1.273 = √φ) | `GameControlPanel.vue:396-703` |
| DiceIcon size / stroke | 28px, `stroke-width="1.8"` on a 24-unit box → 2.10px rendered | `DiceIcon.vue:7-8,21` |
| DiceIcon stroke @48 / @56 | 3.60px / 4.20px (no `non-scaling-stroke`) | DERIVED |
| `PENCIL` stroke refs | gridCell 2.5, gridSubgrid 4, gridFrame 6 | `pencilConfig.ts:9-11` |
| `.icon-sublabel` px | `--type-caption` = 12 (390px) → 14.38 (1440) → 16 (≥1920) | `GameControlPanel.vue:857`; DERIVED from clamp |
| `.icon-btn` box, fine | 44×44 (2.75rem) | `GameControlPanel.vue:808-809` |
| `.icon-btn` box, coarse | column, min 44×44, `padding .3rem .5rem` | `:879-887` |
| `grain-static` params | baseFreq 0.04, scale 2.5, seed 2, `userSpaceOnUse` | `pencilConfig.ts:257`; `SvgFilters.vue:49-62` |
| documented grain-static icon band | **20–32px** ("crit-forensics HOLD") | `pencilConfig.ts:264-266` |
| `.controls-card` cap | `min(42rem,85vw,100dvh−10rem) − 2rem` → 640px @1440×900, 608px @1280×800 | `scene.css:41-46`; DERIVED |
| recorded panel content height | **936px** (with assist rows, @800px viewport) | `scene.css:29-31` |
| my independent DERIVED total | ~915px (within 2% of the record) | Q4 table |
| Check + Candidates stanzas, desktop | 149.1 + 111.1 = **260.2px** → ~44px demoted = **≈216px recovered** | DERIVED |
| Check + Candidates stanzas, mobile | 80.4 + 80.4 = **160.8px** → ~44px = **≈125px recovered (~20% of card)** | DERIVED |
| mobile card content | ≈616px; width `min(42rem,100vw−1.5rem)` = 366px @390 | DERIVED; `scene.css:120-122` |
| card wordmark rendered | ≈24.3px (48u × 30.4/60), constant per name | `GameCard.vue:80-83,386-398`; DERIVED |
| card range rung | `--type-body` = 16 → 18.6 (1440) → 22px | `GameCard.vue:417` |
| card name/range ratio | **1.31 @1440, 1.10 at the clamp ceiling** | DERIVED |
| gallery pip | 0.55rem = 8.8px circle, 2px border, gap 0.6rem | `GameGallery.vue:480-497` |
| logo height ladder | 3.9 / 4.452 / 5.724 / 6.996rem (×√φ off 3.5/4.5/5.5) | `HandwrittenLogo.vue:290-293,312,416,423` |
| `--type-*` size rungs declared | 17 | `typography.css:27-47` |
| `@utility` semantic registers declared | 21 | `typography.css:75-236` |
| `@utility` register consumers | **0** | grep `src`+`index.html`+`e2e` |
| size rungs with real consumers | 5 (caption 9 · body 4 · small 3 · micro 1 · admin-label 2) | grep excl. `typography.css` |
| `--type-title` / `--type-prose` / `--type-display-*` consumers | **0** | grep |
| distinct spacing magnitudes | **13**, GCD 0.025rem (no unit) | Q5 |
| top-level panel column `gap` | **none declared** | `GameControlPanel.vue:529` |
| graphite AA steps (light / dark on card) | 100 → 14.78/12.03 · 85 → 9.19/8.90 · 75 → 6.57/7.14 · 68 → 5.23/6.06 · 60 → 4.09/4.97 | recomputed; 68% matches `GameControlPanel.vue:960-961` |
| `--color-muted-foreground` on card | **4.65 light** / 7.69 dark | recomputed |
| `KeyboardLegend` text @ graphite 55% | **3.53 light / 4.36 dark — sub-AA both themes** | `KeyboardLegend.vue:56-60`; recomputed |
| `KeyboardLegend` kbd border @ 40% | **2.36 / 2.87 — under the 3:1 non-text floor** | `:97-100`; recomputed |
| `.icon-sublabel.is-armed` (crayon-rose) | **4.10 on card — sub-AA light** | `GameControlPanel.vue:864-867`; recomputed (file records 4.11) |
| goldens | 8 PNG = 4 subjects × 2 platforms; **0 involve F5's surfaces** | `e2e/goldens/` |
| e2e assertions constraining F5 | 3 (`.ctrl-btn` ≥19px · 44px floors · `.icon-sublabel` text) | Q7 |
| e2e/unit refs to Check/Candidates/Marks headings | **0** | grep |
| F5 LOC estimate | ≈90 touched, ≈+45 net, 8 files, 0 new components | Q7 |

---

## CONTRADICTIONS — what the charter assumes that the code refutes

1. **"the √φ eyebrow — `--type-subheading` 1.272rem"** — that is the <768 arm only. Every
   drawer-regime instance (≥1024) renders `--type-heading` **1.618rem / 25.89px**, the φ rung
   (`typography.css:261-268`). The charter's audit numbers describe a surface the drawer never
   shows.
2. **"all six option rows at the same 1.375rem/1.25rem"** — there are **five** rows (all five
   games declare exactly two sections), and the mobile panel's arm is **1rem/1.375rem**, not
   1.375/1.25 (`OptionSelector.vue:36-37`). Both arms are simultaneously in the DOM.
3. **"~7 near-identical stanzas"** — 6 headings, 5 selectors.
4. **"Deal at rank 1 … pure prop/CSS change"** — `DiceIcon` has no `strokeWidth` prop
   (`DiceIcon.vue:2`) and no `vector-effect="non-scaling-stroke"`, so 2× doubles the rendered
   stroke to 4.20px — heavier than `PENCIL.gridSubgrid` (4). A component edit is required.
5. **"Mark 4: zero interaction — no new drawn surfaces at all (its virtue)"** — half true. No
   pose bake touches DiceIcon (confirmed). But `.icon-btn` carries
   `filter: url(#grain-static)` (`GameControlPanel.vue:816`), and `pencilConfig.ts:264-266`
   records the preset's values as **derived for and held at 20–32px icons**. A 48–56px Deal
   leaves that band, and the HOLD forbids retuning the preset — so the honest realization needs
   a new (static) `grain-deal` preset, i.e. F5 does touch the filter layer.
6. **"the `heading-value`'s 68% graphite precedent … formalize it" / "Respect the AA ledger"** —
   the ledger has three live holes, one of them on Deal itself: `KeyboardLegend` text at graphite
   55% = 3.53:1 light (sub-AA), its `kbd` borders at 40% = 2.36:1 (under 3:1), and
   `.icon-sublabel.is-armed` in raw `--color-crayon-rose` = 4.10:1 (sub-AA light) when
   `--color-red-ink` 4.98:1 already exists for that hue. Formalizing pressure canonizes the
   failures unless these are fixed in the same pass.
7. **"map `--affordance-1..4` to the existing √φ rungs (`--type-title`/`--type-body`/
   `--type-caption`)"** — `--type-title` has **zero** consumers, as do all 21 `@utility`
   registers and every rung above `--type-heading`. The mapping is not "onto existing rungs" in
   any lived sense; F5 would be the first consumer of the ladder's top half. (Read favourably
   this is the family's best asset — but the charter should not describe it as re-using
   established registers.)
8. **"a base unit and multiples … zone breaks get 2–3 units and intra-stanza gets 1"** — the
   desktop panel's top-level column declares **no gap at all** (`GameControlPanel.vue:529`), so
   there is nothing to re-set: the zone-break spacing must be *created*, not re-proportioned.
   The 13 shipped magnitudes have GCD 0.4px, i.e. no unit exists to build from.
9. **"Apply the same ladder to the picker (card name > range caption > pips) — one ledger,
   three surfaces"** — the card name is **viewBox geometry**, off-token by recorded doctrine
   (`GameCard.vue:395-397`, `HandwrittenLogo.vue:390-394`), and its rendered size rides an SVG
   `height`. There are three parallel scales in the estate (`--type-*`, the logo's rem×√φ
   ladder, viewBox user units). F5 can deliver one ledger over **two channels**, not one.
10. **"mobile re-set (the tall card gets shorter through demotion)"** — true structurally, false
    typographically: on coarse pointers every option button is floored at 44px by
    `index.css:679-686`, so a font demotion alone saves **0px** on mobile. The ~125px comes
    entirely from collapsing two stanzas into one row.
11. **Unstated but load-bearing:** the drawer panel **already overflows and scrolls** in the row
    regime (936px recorded against a 608–640px cap, `scene.css:29-46`). F5's net effect is
    ≈−176px → ~760px: a large improvement that still does not clear the cap. The family must not
    be sold as fixing the panel's height.
12. **Not a contradiction, a note on Check:** `AssistSettings.vue:19-21` and
    `GameControlPanel.vue:98-100` both record that re-tapping "Ask" **is** the on-demand check
    trigger (the same-value re-emit is load-bearing). Check is a set-once *preference* by
    frequency but a repeatable *action* by mechanism — its demoted row must keep a 44px target
    and must not be made visually inert.

---

## OPEN QUESTIONS

1. **Does rank 1 mean the die, or the die + a display-register label?** The rank-1 mass could
   come from the label alone (`--type-title` 32.93px in Fraunces on the sublabel) with the die
   held at 28–32px — which sidesteps both the stroke-scale problem (Q3b) and the grain band
   (Q3c) entirely. That variant is strictly cheaper and needs a CRITIQUE-lane read.
2. **Is `--color-muted-foreground` retired from the heading role?** The graphite-based pressure
   ladder (Q2b) implies yes for all six headings. That is a visible tone shift on every stanza
   and probably needs an owner ruling, not a lane decision.
3. **Rhythm unit: 0.25rem (fits 9/13 shipped values) or 0.375rem (fits `py-1.5`, the
   OptionSelector's own padding)?** Both are defensible; the choice determines whether
   OptionSelector's internals are re-set or grandfathered.
4. **Does the `grain-deal` preset need minting at all**, or does a rank-1 Deal capped at 32px
   stay inside the documented 20–32px band? 32px is the band's own ceiling — worth testing 32
   before 48–56.
5. **Picker: change `.game-card-name` height (1.9rem) or the range rung?** Dropping range from
   `--type-body` to `--type-small` widens the ratio to 24.3/16.4 = 1.48 at 1440 with a one-line
   change and no SVG geometry touched. Cheaper than raising the name; needs an eye.
6. **Where do the affordance tokens live?** `typography.css` is in `src/assets` (global, outside
   both `pencil/**` and `games/**`), so the eslint `pencil↛games` boundary
   (`eslint.config.js:39-46`) is untroubled. But the icon-size stops arguably belong in
   `pencilConfig.ts` beside `PENCIL` — which splits the ladder across two files. One home or two?
7. **Not investigated:** whether the 22px `ScribbleLoader` swap inside the Solve button
   (`GameControlPanel.vue:473-478`) causes a layout jump if the icon stops are re-ranked; and
   whether `DifficultyTally` / `MarginNote` / `SolverErrorNote` (caption/body consumers) should
   join the ledger or stay as ambient annotation.
