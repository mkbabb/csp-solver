# R6 — THE HOUSE IDIOM AND ITS DECIDED HISTORY

Round-zero census lane of T9-W7. Read-only on the product; every number below was
re-derived on THIS tree (uncommitted W3/W6 work in flight) rather than carried from the
formation census (`evidence/formation/registry.md` F18, 2026-08-10), and where a figure
moved the row says so.

Instruments banked beside this file:

| file | what it is | reading at HEAD |
|---|---|---|
| `law-probe.mjs` → `law-probe-HEAD.txt` | nine standing design laws asserted against the tree; three born-RED | 6 GREEN, 3 RED, exit 0 |
| `hue-census.mjs` → `hue-census-HEAD.txt` | every chromatic token to OKLCH, both regimes, plus the player walk | 29 rows |
| `r6-idiom.probe.ts` → `browser-probe-both-engines.txt` | M20 re-measure, the heading census, the token read, the live-filter population | 8 probes, chromium + webkit |

The browser probe ran against a scratch config on 127.0.0.1:4241 (`npx vite --port 4241
--strictPort`), never the estate's default config. No frames banked: every claim here is a
number or a source cite, which is cheaper and harder to argue with.

---

## 1. THE PRIMITIVES — what the house draws with

Each row is the visual signature a proposal has to be checked for kinship against.

### 1.1 The stroke substrate

| primitive | file | signature |
|---|---|---|
| `HandDrawnOutline` | `src/pencil/grid/HandDrawnOutline.vue` | THE one box grammar. px-native geometry (viewBox = measured border box + `outset`), default `strokeWidth 6` / `outset 4` / `radius 0` (square corners, jagged overshoot crossings — the auto border-radius read was deleted as "geometric, out of family"). Grain BAKED into the pose geometry (`gridPaths §Grain bake`), so it mints no filter. `:pose` present → renders that frame and enrols NO beat; absent → enrols the shared beat. |
| `HandDrawnGrid` | `src/pencil/grid/HandDrawnGrid/` | The board. 4 boil frames at 150ms ("shooting on fours"), `frameBoil 1.2` / `subgridBoil 0.6` / `cellBoil 0.3` in a 1000-unit viewBox. Baked to an `<image>` pose stack; the four live-fallback poses sit `display: none`. |
| cell ghost rect | `gridPaths.generateCellRects` | `wobbleRect(roughness 0.4, segments 4 — 2 at ≥16, jagged: true)`, seeded `42 + 500 + pos*7`. **Hand-drawn but FROZEN**: one path per cell, no frame index, no beat. See §4 §5 below — this sharpens the census's "CAD-precise" claim. |
| `BoilDivider` | `src/pencil/chrome/BoilDivider.vue` | The ruled line. The budget's SOLE beat-driven exception: 4 poses × `url(#grain-static)`, Apple-frozen at pose 0. Its bake FAILED its soul gate at SSIM 0.809 (a 100%-stroke thin line). **One instance in the whole product** (`GameControlPanel.vue:923`, the peek hold surface). |
| `pencil-draw-on` | `assets/index.css` | The global stroke primitive: `pathLength="1"`, `--draw-dur` / `--draw-delay` / `--draw-opacity`, `--ease-drawOn`. Every write-in in the estate rides it (answer key, margin note, icons). |
| `mulberry32` seeds | `@mkbabb/pencil-boil` | Every hand-drawn irregularity is SEEDED and stable: washi tear + tilt (`seed*2654435761 + text.charCodeAt(0)`), scribble underline (`seed*7+31`), cell rects, glyph variants. Nothing in this house is randomly wobbled at paint time. |

### 1.2 The sheet family

| primitive | file | signature |
|---|---|---|
| `SheetWashiLabel` | `src/pencil/sheet/SheetWashiLabel.vue` | Tinted translucent paper tape. `--sheet-washi-neutral` (NEUTRAL — a color-mix of `--color-foreground` 6% into white/dark, redefined per theme, never a hue). Patrick Hand, seeded six-point torn-edge `clip-path`, seeded ±1.5° tilt, blur-0, one paint per show, 150ms opacity. Four anchors: default (hover/focus tooltip, `aria-hidden`), `center` (on the ruled line), `tag` (the compartment's own name, astride its top-left edge, always laid down, `text-transform: lowercase`, `--type-tag`, weight 500), `persistent` (coarse pointers). `z-index: 50` — paired with `.action-bar`'s 60; re-cut them together. Since T9-W2 the tag is `position: sticky` and IN FLOW with a net flow height of zero. |
| `AnswerKeyLaminate` | `src/pencil/sheet/AnswerKeyLaminate.vue` | The clear laminate. Blur-0 (OD-1 no-glass build). Lay-down 280ms on `--ease-glassGlide`; lift-away 200ms on `--ease-accelIn` (the erase-family asymmetry). Teacher-red per-glyph write-in at 180ms with a size-derived stagger bucket. Goes OPAQUE (construction paper) under `prefers-reduced-transparency` or `prefers-contrast: more`, and then prints the COMPLETE key. |

### 1.3 The chrome

| primitive | file | signature |
|---|---|---|
| guard ribbon | `GameGallery.vue:997-1065`, CSS `:1328-1508` | The house's one confirm. `role="alertdialog"`, `aria-modal`, anchored to the ARMED CARD's centre (`--guard-x`), 240ms slide on `--ease-glassGlide`, `translate(-50%, -0.75rem)` + opacity. The note: `HandDrawnOutline` frame at `strokeWidth 3 / outset 4` + `cartoon-shadow-md edge-outlined bg-popover`, Patrick Hand at `--type-body`, a title line and a muted sub-line. The verbs are BARE hit targets (zero padding, no border, no ground) wrapping a `.guard-face` that takes `HandDrawnOutline :pose="0"` — keep at `strokeWidth 2`, the destructive verb at `2.5` plus an 8% graphite ground. Hover grounds on `--color-accent`, `(hover: hover)` only; focus ring rides the FACE at `2px solid color-mix(foreground 45%)`, `outline-offset: 4px`; coarse `min-height: 44px`. |
| `DrawerTab` | `src/games/shared/DrawerTab.vue` | The pencil case's tongue. `HandDrawnOutline :stroke-width="2.5" :outset="3"`, a `--color-card` tongue with a one-sided 0.75rem radius, and a VERTICAL washi word ("controls") on `--sheet-washi-neutral` with its own hand-cut `clip-path` and a 1.4° tilt that straightens to 0° on hover over 150ms. ONE LAW, FOUR BERTHS (T9-W2 §2.7): desk + short-landscape 48×92 right flank; portrait shut 92×48 at the board's bottom-right, tucked 8px under the paper at `z-index: -1`; sheet-up 92×48 on the case's top-right at `z-index: 1`; ≤400 sheet-up 44×92 back on the vertical axis. Focus ring: `2px dashed currentColor`, offset 3. |
| `DarkModeToggle` | `src/pencil/celestial/DarkModeToggle.vue` | Sun + moon, viewBox 200, `url(#wobble-celestial)` on TWO live bodies (gesture-scoped `.is-turning`); at rest the parked pose stacks. Cadence bands `sun: 2` (4Hz) and `moon: 1.5` (5.33Hz) — the T6 mark-11 halvings. Palette `MASCOT_COLORS.celestial`. Gesture animations (`toggle-squash`, `plush-land`) are class-scoped and dropped on completion. |
| `HandwrittenLogo` | `src/pencil/chrome/HandwrittenLogo/HandwrittenLogo.vue` | The wordmark. A `wobble-logo` FOUR-pose stack (`baseDef: false` — no live base def), revealed by a 1.2s clip-path wipe, baked through `useRasterStack`. Its capture box must be the LAYOUT box (CH-67: `contentRect`, never `getBoundingClientRect`, which carries ancestor transforms — the ×3.6 over-bake and the 0.2955 quarter-res wordmark). |
| `HandwrittenGlyph` | `src/pencil/glyph/HandwrittenGlyph.vue` | The digits. ZERO live filters (G2.4 ruled C — the bake could not reproduce the tooth at glyph scale and SSIM ranked unfiltered closer than baked in all four engine×theme cells). Seeded variant per position. Strokes with `--color-user-ink`, which is the single binding the peer-ink formula rebinds. One hover wiggle reaches chrome at all: the wordmark's caret. |
| `OptionSelector` | `src/pencil/chrome/OptionSelector/` | The one segmented control. Chips at `--type-option` (20px desk / 22px 768-1023 / 20px phone-coarse). The selected/hover marks are SEEDED DATA-URI underlines (`scribbleUnderline.ts`, mulberry32, 3-4 quadratic segments, stroke 1.2-2.0) — drawn marks, never filters. |
| `MarginNote` | `src/pencil/chrome/MarginNote.vue` | The page's status voice. One always-mounted `role="status"`, hand-lettered, 250ms clip-path write-in, three tones (graphite / teacher-red / gold-star). Comments on the PUZZLE only; infrastructure goes to the assertive note card. |
| `rasterPose` | `src/pencil/composables/rasterPose.ts` | The bake seam. A captured pose is drawn in a DETACHED blob with no page `<defs>` and no cascade, so the filter is inlined and colours are resolved to literals off the live DOM. |

### 1.4 The action bar (M04's subject)

`.action-bar` (`GameControlPanel.vue:2096`) is `position: relative` (sticky at ≥1024 and at
<1024 portrait), `background: var(--color-card)`, `grid-template-columns: 1fr auto`, a 2rem
`::before` fade that paints only while `data-fold-below`, and a `::after` skirt the height of
the card's own padding. **It declares no border and no drawn outline.** The owner's M04 is
literally true on this tree — the bar is a colour-matched slab distinguished from the card
only by what scrolls under it.

---

## 2. THE LAW LIST — the decided history, one line each

Standing rulings that a W7 proposal may not re-litigate. Each is stated as a law with its
cite; the ones marked ✓ are asserted by `law-probe.mjs`.

### Motion

1. **The drawer's curve is `cubic-bezier(0.32, 0.72, 0, 1)` at 520ms — the glass family, zero overshoot.** The spring `(0.34, 1.56, 0.64, 1)` DIED for the drawer. Owner audit 4, 2026-07-11; `pencilConfig MOTION.curves.drawerGlide`. ✓ (L2)
2. **That ruling is the DRAWER's — "no other surface re-eases under it."** Same cite, the scope fence verbatim.
3. **The easing family is a two-layer partition by consumer, never by curve.** TS `MOTION.curves` for JS/`v-bind`; CSS `--ease-*` for `<style>` blocks. The glass curve lives in both, byte-identical. T4-W10. ✓ (L2)
4. **No timing constant outside `pencilConfig`** (`cardStepMs 440`, `boardFoldMs 520`, `chromeLeaveMs 200`, the CELEBRATION budget). T4-W12's wave covenant.
5. **The celebration is a moment, ≤3.2s crest.** Star crest 2650, heart crest 2650, cap held at 3.19s.
6. **Every verb in the motion vocabulary fills `backwards`, never `forwards`/`both`** — a retained transform keeps WebKit's promotion alive. T6 marks 14/15; the exceptions are enumerated in `FILL_ALLOWLIST`.
7. **Every perpetual boil derives its frame index from ONE shared beat (125ms, ~8Hz).** `boilBeat.ts`; cadences quantize to whole beats.
8. **Celestial cadence: sun ÷2, moon ÷1.5.** T6 mark 11, the owner's measured read.

### Filters and paint

9. **The live-filter population is EXACTLY 9, exact-match in both directions, both engines, both regimes, hovered and at rest.** `filterBudget.ts`; the T4-P1 filter-deletion cure. Re-measured on the dev tree at 1280×800 chromium: **9**, rows matching the allowlist. ✓ (L1)
10. **Per-cell filters: ZERO. HTML-box reference filters: ZERO. Beat-driven: ZERO with one Apple-frozen exception (the divider's four poses).** Same cite.
11. **A second `BoilDivider` is REFUSED** — it mounts four live `url(#grain-static)` poses and takes the census 9 → 13. The refusal is written twice in `GameControlPanel.vue` (:1541, :1855) and it is what makes the group rule a 1.5px `--ink-press-rule` border instead of a drawn line. T6-R03.
12. **The union raster AREA is gated too, not only the count** — row 45572 px², coarse 6673 px², ±2% (not a growth allowance). One counted surface growing is the half a count cannot see.
13. **NO TEXT BOILS — ever, at rest or on hover.** Boil is for drawn geometry and for the drawn marks text wears. `pencilConfig §THE HOVER GRAMMAR` R1; gated by `filter-census G3.5`.
14. **Every interactive text surface takes EXACTLY ONE hover affordance; inert text takes none.** Three forms and no fourth: ink lift (bare word) · a drawn mark (chips) · a ground (BOXED controls only — a ground under a bare word is a fourth form). All fenced in `@media (hover: hover)`. R2, promoted to a gate on its next bite.
15. **A bake's capture box is the LAYOUT box (`contentRect`), never a transformed client rect.** CH-67, T8-W4.
16. **The release fold may only ADD, never subtract; capture band [0.99, 1.5].** CH-67's class invariant, re-counted at every WGATE.

### Colour

17. **Washi is NEUTRAL tinted paper — one token, two theme arms, never a hue.** `--sheet-washi-neutral`; T5 design-union §7.3. ✓ (L4)
18. **Crayons do not desaturate at night.** Dark variants preserve hue ±3°, raise lightness +7…+13 (OKLCH L +0.06…0.10) and let saturation RISE. Never give a crayon the muted-dark treatment.
19. **Wax for strokes/washes/fills; hue-locked darkened INK for verdict TEXT.** Every crayon fails AA as light-mode text; the ink tier is the same hue darkened to ≥4.5:1.
20. **The solver rainbow is BOARD CONTENT ONLY — never chrome, never a metadata tone.** UI-10, T3-W9 F8 §3.2.
21. **The three ink families never compete: crayon = difficulty · rainbow = revealed answers · peer walk = players.** No player is ever assigned wax or a rainbow stop. `index.css:154-161`.
22. **A player's ink is a FORMULA, not a palette: `oklch(var(--peer-ink-l) 0.11 (i×137.5°))`, `--peer-ink-l` 0.5 light / 0.8 dark.** No palette to exhaust, no player cap; worst contrast 5.26:1 light and 9.56:1 dark over 40 indices. T6 mark 13, `playerIdentity.ts`. ✓ (L6)
23. **A semantic state token is an alias into the crayon system, zero new hexes** (`--color-teacher-red`, `--color-gold-star`, `--color-pencil-graphite`). design-refinement §3.4. The three chromatic tokens that break it are named in §3 below.
24. **Ink pressure is a named ramp, not an open-coded `color-mix`** (`--ink-press-rule` 55%, `--ink-press-quiet` 68%); `check-ink-pressure` prints the rank in both themes.
25. **Gold is earned light** — it lives in the sky and comes to the page only when the work is done. T3-W9 F8 §2.

### Type and copy

26. **The ladder is √φ (1.272); a heading is an identity (fixed rem), a control is a clamp.** `typography.css`.
27. **The controls estate reads a ROLE, and the role reads a rung** — `--type-act` / `--type-verb` / `--type-tool` / `--type-tag` / `--type-group-title`, plus `--type-option`'s three width arms. T9-W2 §2.6 landed the seam computed-identical precisely so W7's voice is one right-hand side per role, never a sweep of call sites. **This is W7 §1's and §10's cheapest lever and it already exists.**
28. **Casing is CSS and only CSS** (`.section-heading { text-transform: lowercase }`); the source strings keep their own capitals.
29. **Lower case is the only chimera-free path through Patrick Hand** — its uppercase subset is {C,R,S}. F5's shared finding; the washi tag is lowercase for this reason as much as for rank.
30. **A rendered-string change mints a font ransom note** — the woff2 subsets are letter-exact. Any new product copy re-cuts the subset (T8 trap; `playerIdentity.ts` already filters its dictionaries to `[a-ik-wyz]`, no `j`, no `x`).
31. **M16, PERMANENT: plain English only. No jargon, no metaphor, no meta-language, no contrivance, and never an em dash.** Owner 2026-08-03; gated by `check-copy-register.mjs` (dash arm + jargon lexicon of 25 entries + a closed-both-ways admission ledger). ✓ (L3)
32. **Counts, not feelings** — "3 other players", never "several". `GameGallery.vue:219`.
33. **ONE NAME per act: the drawn word, the `aria-label` and the spoken utterance are one literal.** T5-W3 §3.2, the guard-names row.
34. **A tape that is always laid down is a LABEL, not a tooltip** — it drops `role="tooltip"` and becomes the `aria-labelledby` target. T4-P1 F1 order 4.
35. **The marginalia comments on the puzzle; infrastructure speaks in the assertive note.** `MarginNote.vue`.
36. **No first person anywhere.** T6-R10; verified zero in every template.

### Form and a11y

37. **One box grammar: a drawn frame is `HandDrawnOutline`, never a CSS border on chrome.** T8-W1 M4 took the guard ribbon's verbs into it at `:pose="0"` — one static path per frame, no beat, no layer, no filter. That is the template for any new drawn edge. ✓ (L5)
38. **The 44px tap floor, now a token** (`--tap-floor: 2.75rem`), declared once at the shared `(pointer: coarse)` rule. BC5-G5.
39. **Focus rings are non-negotiable and visible** — the estate's forms are `2px dashed currentColor` offset 3 (the tab), `2px solid color-mix(foreground 45%)` offset 4 (the ribbon's face), and the board's drawn `--color-focus-sketch` ring at stroke-width 7 / opacity 0.9 drawn on over 180ms.
40. **A container that passes pointers through hands them back at the control** (`.board-margin`, `SolverErrorNote`, `AttributionCard`, `DrawerTab`, the celestial). The estate's standing shape.
41. **Never `confirm()`** — the ribbon is drawn, dismissible and its own thing.
42. **SELECT is non-destructive** (persistence is real, T8-proved); selection stays unguarded. Nuance honoured in M12.
43. **PRM is a real arm, not an afterthought**: the glide collapses to a same-frame swap, the ribbon appears without sliding, the laminate drops its transform, the celebration binds durations as CSS custom properties with zero timers.
44. **`prefers-reduced-transparency` / `prefers-contrast: more` turn every sheet OPAQUE** — the fallback IS pure pencil, and a surface that shows content through it must then render the complete content.
45. **M19, PERMANENT: zero focus theft.** No `safaridriver`/Safari.app on the owner's desktop; headless and background channels only.
46. **U-10: a mark closes ONLY on the owner's re-look.** The record states ladder position, never closure.
47. **O-12: CI is sixteen browserless lanes; the Playwright estate is a LOCAL instrument; deployment validation is visual.**
48. **Capture-or-it-didn't-happen binds FORWARD from T9's gate** (B5); the evidence-policy cap is 2 MB for this wave and a banked dist ships as a `.tar.gz` with an md5 manifest or the record says "testimony, artifact not banked".

---

## 3. THE MEASURED CENSUS — where the numbers moved

### 3.1 M20 re-measured — CURED on this tree, both engines

Dark, `?game=sudoku`, settled. Boxes are `.masthead` against `.board-cells`.

| viewport | aspect | masthead `position` | wordmark box | grid top | vertical overlap |
|---|---|---|---|---|---|
| 900×676 | 1.33 | `static` (in flow) | top 16, 275.16→624.83, bottom **114.58** | **114.58** | **0.00px** |
| 900×500 | 1.80 | `static` (in flow) | top 16, bottom **114.58** | **114.58** | **0.00px** |
| 900×450 | 2.00 | `absolute` (the dock fires) | 204.10→245.90, left 16→171.66 | grid left 307 | horizontal clearance **135.34px** |

WebKit agrees to the sub-pixel (114.58 → 113.98; clearance 135.92). The 2/1 aspect gate is
the switch, exactly as the T8.1 cure describes; the wordmark's bottom edge IS the grid's top
edge in the fallback band, which is the "graze is the pose" reading, at 0.00 rather than 0.66.
**M20 does not re-open. It is CURED-PENDING-RE-LOOK and the mechanism holds at 900px dark.**

### 3.2 The heading census — three voices, TWO size ranks

Measured 1280×800, desk, drawer open, chromium (webkit identical to the hundredth):

| voice | selector | family | size | weight | transform | tracking | ground | count |
|---|---|---|---|---|---|---|---|---|
| document heading | `h2.section-heading` | Fraunces | **25.888px** (φ = 1.618rem) | 800 | lowercase | 0.6472px | bare | 2 (size, level) |
| compartment tape | `.washi-tag` | Patrick Hand | **14.048px** | 500 | lowercase | 0.3512px | washi tape, ±1.5° | 4 (new game, pencils, checking, players) |
| row caption | `.zone-row-label` | Patrick Hand | **14.048px** | 400 | none | 0.3512px | bare, **68% alpha** | 2 (marks, candidates) |

**Moved since formation.** F18 read 25.9 / 14.4 / 14.4 — those are the 1440 readings of the
same clamps; at 1280 they resolve to 25.888 / 14.048 / 14.048. The structure is unmoved: five
OptionSelector rows wearing three voices (size + level under Fraunces h2s; marks + candidates
under 68% Patrick Hand spans; checking under its washi tag alone, with no row caption at all).
The sharper statement is that there are three VOICES but only **two size ranks**, and the
14.048 rank is doing two different jobs — one at full ink on tape, one at 68% on paper.

Also measured: only **one of four** washi tags is painted at the default desk scroll offset;
the other three carry `opacity: 0` from the `data-under-bar` dissolve, because their wells sit
below the scrollport. That is the mechanism working, not a defect — but it means four of the
five group names are invisible until the reader scrolls, which is exactly the hierarchy
complaint M03/M05 make.

Note also that the two h2s do not share a colour: "size" is `rgb(115,115,115)` (muted) and
"level" is `rgb(162,96,9)` (`--color-orange-ink`, the difficulty crayon's ink tier). One voice,
two inks, by the difficulty-heading ruling — worth keeping deliberately, or retiring
deliberately, but not by accident.

### 3.3 The accent family — re-derived, and the "15°" does not reproduce

OKLCH, from `hue-census-HEAD.txt`:

| token | regime | hex | L | C | h |
|---|---|---|---|---|---|
| `--color-user-ink` | light | #2563eb | 0.546 | **0.215** | **262.9** |
| `--color-focus-sketch` | light | #3a7bc4 | 0.576 | 0.131 | **253.3** |
| `--color-crayon-blue` | light | #4a90d9 | 0.641 | 0.131 | 251.4 |
| `--color-progress-ink` | light | #8b5cf6 | 0.606 | 0.219 | **292.7** |
| `--color-progress-ink` | dark | #7c3aed | 0.541 | 0.247 | 293.0 |
| `--color-solver-ink-2` | light | #7c3aed | 0.541 | 0.247 | **293.0** |

Four facts the census owes W7 §3 and §4:

1. **The two blues are 9.6° apart in OKLCH (9.5° in HSL), not 15°.** The formation figure does
   not reproduce on this tree. They differ far more in CHROMA (0.215 vs 0.131) than in hue —
   the local player's ink is a saturated stock blue, the focus ring a muted crayon-derived one.
2. **The violet is NOT foreign.** `--color-progress-ink` in dark mode is `#7c3aed`, which is
   **byte-identical to `--color-solver-ink-2` in light mode** — the fill meter's ink is the
   solver rainbow's violet stop with the themes crossed. §4's "its hue joins §3's family" has
   an existing anchor: the violet is already in the house, it is simply not NAMED as kin.
3. **`--color-user-ink` #2563eb is the one genuine stock accent** — Tailwind blue-600, no crayon
   derivation, no hue lock to anything in the palette, and the comment above it says nothing
   about where it came from. Its dark arm #60a5fa is Tailwind blue-400.
4. **`--color-focus-sketch` has NO dark arm** (`law-probe R1`, born-RED). It is declared once in
   `:root` and its own comment claims "Dark mode keeps crayon-blue (5.3:1, comfortable)" — false
   on this tree. Both consumers (`gameCell.css:246,248`) write
   `var(--color-focus-sketch, var(--color-crayon-blue))`, and the fallback can never fire
   because the var is always defined. Measured: the keyboard focus ring paints #3a7bc4 at night
   (4.29:1 opaque on `--color-card`, ~3.9:1 at its 0.9 stroke opacity, so still over the 3:1
   non-text floor) where the record says it paints #6aabeb (7.70:1). A record defect, not an a11y
   P0 — and the exact shape §6 has to decide before it redesigns the ring.

**The player walk against the same circle.** `hue = i × 137.5°` at C 0.110 puts player 0 at
h 0.0 (rose/teacher-red territory, `--color-crayon-rose` sits at 14.2), player 2 at 275.0
(between user-ink 262.9 and progress-ink 292.7) and player 7 at 242.5 (beside crayon-blue
251.4). The walk clears AA by construction, but it does NOT clear the semantic palette — §11's
per-player colour system inherits a real question, stated in §5 below.

### 3.4 The filter population, on this tree

Dev server, 1280×800, chromium, settled 2.5s: **total 9**, and the rows match the allowlist
(2 crayon-heart `g`, 2 toggle bodies, 4 divider poses, 1 sparkle drop-shadow). `filterBudget`'s
own rows sum to 9 (`law-probe L1`). **π holds; the budget is a wall W7 designs inside.**

---

## 4. B1 — the two admitted strings, and the third the gate cannot see

`node scripts/check-copy-register.mjs` at HEAD: 137 files, **0 em dashes, 2 jargon hits, both
ADMITTED, 0 unadmitted**, lexicon 25 entries.

| # | string | site | what it is | why it trips |
|---|---|---|---|---|
| 1 | `the solver finishes the board` | `GameControlPanel.vue:1297` | the Solve button's hover tape (`SheetWashiLabel text=`, fine pointers only) | "solver" — the machine's name |
| 2 | `candidates` | `GameControlPanel.vue:980` | the row caption over the on/off toggle whose own hint tape reads "show every digit that still fits in a cell" | solver vocabulary for what a player calls a pencil mark |
| 3 | `solver's answer ${n}` | **`useGameCell.ts:153`** | the accessible NAME of a revealed cell — `Row 2, column 3, solver's answer 4` | the machine's name, **and the gate cannot see it** |

**Row 3 is B1's second half and it is invisible to the gate** (`law-probe R2`, born-RED). The
jargon arm reads template text, STATIC rendered attributes, `COPY_KEYS` object literals and
`NARRATION_CALLS`. Row 3 is a `computed()` assembling a string that becomes a bound
`:aria-label` — none of those four shapes. It is not admitted either, so the admission ledger
does not carry it, which means the gate reports clean on a string the ballot names by name.
This is the same class the gate's own header describes (the `<style>` mask that blanked 103KB):
a census that says "scanned N files" while a surface sits outside it. **Cure the copy and the
corpus in one commit**, or the next string like it is invisible again.

### 4.1 Copy recut candidates for the loop (M16 register)

Not rulings — candidates, for the thrice protocol to audition and the owner to dispose (U-10).

**#1 — the Solve tape.** The register test: would a player say it? The tape's job is to say
what the button does to the board, not who does it.

| candidate | note |
|---|---|
| `fills in the whole board` | plainest; parallel to the Fill tape's "fill the cells that have only one digit left"; says the consequence, names nobody |
| `finishes the board for you` | keeps the incumbent's shape, drops the machine; "for you" carries the "this is not your work" beat the solver-ink already says visually |
| `finishes every cell` | tightest; "every cell" is the board's own vocabulary (row, column, box, cell) |

Preference: **`fills in the whole board`** — it is the only one whose vocabulary is already on
the neighbouring tape, which is the parallelism the button strip lacks today.

**#2 — the `candidates` caption.** The caption must be a NAME (it is the `aria-labelledby`
target for the row) and it must fit the 3.75rem caption column measured at `GameControlPanel`
:1556 (48.8px at 390, 54px at 1023). Its hint tape already says the plain sentence.

| candidate | width risk | note |
|---|---|---|
| `hints` | none | shortest, but collides with the Hint verb in the play row — two different acts, one word. Refuse. |
| `possible digits` | wraps at 390 | most literal; says exactly what the toggle shows |
| `what fits` | none | the hint tape's own words ("every digit that still fits in a cell"), compressed; reads as a question the board answers |
| `options` | none | plain, but generic enough to read as UI chrome rather than as the board's own word |

Preference: **`what fits`** — it is the hint tape's sentence shortened rather than a new coinage,
it fits the caption column at every width the branch mounts at, and it does not collide with
`hint`. Second choice `possible digits`, which needs the column re-measured.

**#3 — the revealed cell's accessible name.** Today: `Row 2, column 3, solver's answer 4`. The
siblings are `given clue 4`, `your entry 4`, `brave-otter's entry 4` — three plain names and
one machine name. The parallel candidates: **`filled-in 4`**, **`revealed 4`**, or
**`answer 4`**. Preference: **`answer 4`** — it completes the set (clue / entry / answer), it is
one word per hand, and it is what the ink already says.

**Every recut takes `check-copy-register.mjs` with it**: strike the matching `ADMITTED` entry in
the same commit (the ledger reds when its string leaves the tree), and for #3 widen the arm's
corpus so the cure is visible to the gate that was supposed to catch it.

### 4.2 Everything else that names the machine or a technique

Swept over `src/**` templates, rendered attributes and copy constants. **The three rows above
are the whole rendered surface.** Every other `solver` / `worker` / `engine` / technique-name hit
in `src/` is in a comment, a type name, an import path, a test title or an engine identifier:

- `techniqueVoice.ts` `TechniqueId`s are the literal strings `naked-single` / `hidden-single`,
  kept as ENGINE identifiers by explicit T8-W6 ruling; the nine proper names were deleted from
  the rendered register in the same wave and the hint note now reads `only 4 fits here`.
- `conflicts.ts:21` states the rule the product speaks by: "the vocabulary is the BOARD's, never
  the solver's: row, column, box".
- `usePencilMarks.ts` / `useUserMarks.ts` describe the marks as "the solver's propagated domains"
  in JSDoc only.
- `App.vue:141` records that "CSP Solver" was already removed from the document title under M16.

---

## 5. WHAT THIS CENSUS HANDS THE LOOP

Stated as questions, because round zero proposes nothing.

1. **§1/§10 (heading voice).** The role seam already exists (`--type-group-title` and four
   siblings, T9-W2 §2.6, computed-identical by construction). Is the law "one voice at one rung
   for all five groups", or "two ranks — compartment vs row — stated deliberately"? And does the
   checking well, which has a tag and no row caption, get a caption or does the tag become the
   caption everywhere?
2. **§1 (the tag's visibility).** Four of five group names are dissolved at the default desk
   scroll offset. Is the sticky tag the right carrier for a group NAME, or does the name want a
   rank the scrollport cannot take away?
3. **§2/§10 (the bar).** M04's border: the house has exactly one drawn-edge answer
   (`HandDrawnOutline :pose="0"`, the guard ribbon's own move) and it costs zero filters. Does
   the bar take a drawn top edge, or a full drawn box, and does the desk take the same?
4. **§3 (the accent family).** Three decisions, not one: does `--color-user-ink` stay a stock
   blue or become crayon-derived like the focus ring; does the focus ring get its missing dark
   arm (and at which hue); and is the violet NAMED as the rainbow's second stop rather than
   re-invented?
5. **§4 (the fill meter).** Its hue is already in the family (`solver-ink-2`) — is the meter's
   problem therefore placement and label rather than colour?
6. **§5 (the wobble law).** The census's "CAD-precise" reading needs restating: the ghost ring
   is `wobbleRect(roughness 0.4, jagged: true)` — hand-drawn geometry that enrols NO beat. So the
   ring's σ over TIME is zero while the grid's is not. Is the cure a variant stack on the ring
   (which must cost zero filters — the poses carry baked grain, per the guard-ribbon precedent),
   or is a frozen hand-drawn ring already in family and the census's number a measure of
   stillness rather than straightness?
7. **§11 (the player mark).** The colour SYSTEM already exists and is a formula, not a palette.
   Two questions remain: does the LOCAL player join the walk (today they keep `--color-user-ink`
   and nothing is bound on their cells), and what happens when the walk hands a player h 0.0,
   which is the teacher's red and the conflict tone? The golden angle is the right mechanism; the
   reserved arcs are the design question.
8. **§13 (the transition grammar).** `MOTION` holds four durations and ONE named curve; the CSS
   layer holds ten `--ease-*`. The gallery's in/out rides `cardStepMs 440` / `boardFoldMs 520` /
   `chromeLeaveMs 200` on the drawer's glass curve. Writing "defined animations" into MOTION means
   NAMING what is already there plus whatever is incidental — the census for that is the
   `grep -rc "var(--ease-"` the easing ledger already describes.
9. **§15 (the confirm's face).** The guard ribbon's face is fully specified above and has been
   through two owner passes. The open question is not what it looks like but where it ANCHORS when
   the armed thing is a verb in the controls card rather than a card in the deck.
