# CTRL-FACE — pass 1 SYNTHESIZE · printed and written

§10 with §1 §2 §8 inside it · marks M01 M03 M05 · verdict on the research: ADJUST, taken whole.
The spec below is arm D (names printed, acts written, title up) with the research's four
amendments folded in and two of its open defects designed rather than deferred: the tab row's
open mark and the tape's room. Nothing here closes (U-10).

Read first: `../research/CTRL-FACE/README.md` (the numbers), `../../r0/r6-idiom-history/R6-census.md`
(the laws), `../../r0/r1-controls/README.md` (the census), the owner's Frame B
(`../../../../marks/m03-controls-open-iphone.png`).

---

## 0. The two-pass method (frontend-design, invoked)

### 0.1 The plan, compact

**Subject.** A pencil case for a hand-drawn sudoku: a printed sheet that a pencil has written on.
The audience is one reader on a phone in the dark (Frame B) and the same reader at a desk rail.
The design's one job on this surface: make the eight compartment NAMES read as the sheet's own
printing and everything under them read as the reader's hand, so hierarchy is a FACE and never
a size table.

**Colour.** No new hex. The family spends zero chromatic tokens; it re-points which existing ink
a name wears:
- `--color-foreground` · light `hsl(0 0% 3.9%)` / dark `hsl(48 10% 92%)` — the printed press
- `--color-muted-foreground` · light `hsl(0 0% 45.1%)` (4.646:1 on card) / dark `hsl(48 5% 64%)` (7.689:1) — a shut compartment's name
- `--color-green-ink` `#1d7f35` (4.95:1) · `--color-orange-ink` `#a26009` (4.91:1) · `--color-red-ink` `#d02a52` (4.99:1); dark collapses each into its crayon (10.11 / 10.26 / 6.32:1) — the LEVEL readout, wherever the value is shown
- `--ink-press-quiet` 68% graphite (5.23 light / 6.06 dark) — the shut tab's written value when it has no crayon
- `--sheet-washi-neutral` — the tape's ground, both arms, untouched

**Type.** Two faces, named by who put the word there:
- `--face-printed: var(--font-display)` — Fraunces, `--printed-weight: 800`, lowercase, `--type-tracking-wide`, ONE rung `--type-group-title` = `--type-heading` (25.888px) at every width. The eight nouns: new game · size · level · pencils · marks · candidates · checking · players. Nothing else.
- `--face-written: var(--font-hand)` — Patrick Hand 400, lowercase by CSS. Every value (the chips, the shut tab's value word) and every verb (already there: deal · clear · fill · solve · share · undo · redo · hint · peek · play). Fira Code leaves the controls estate.
- `--type-option: 1.25rem` (20px) at every width — the three arms die.

**Layout.** None minted. The card, the wells, the tape's sticky lane, the tab row, the bar: all W2's, all untouched. Alignment stays as shipped (centred stanzas on the dock, left-aligned names on the rail). The family's only geometry is consequence-repair: the tape's leading variable and the first well's top margin, priced by measurement.

```
  DOCK 390×844, sheet up                        RAIL 1280×800
  ┌ new game ─────────────────────────┐        ┌ new game ──────────┐
  │   size          level             │        │ size               │  ← printed, 25.9/800, fg
  │                 easy   ← written  │        │   4×4  9×9  16×16  │  ← written, 20, hand
  │   4×4   9×9   16×16               │        │ level              │  ← printed, crayon readout
  │          ~~~                      │        │   easy medium hard │
  ├ pencils ──────────────────────────┤        ├ pencils ───────────┤
  │  marks     normal corner center   │        │ marks              │
  │            ~~~~~~                 │        │   normal corner … │
```
Open tab: the name at full press (`size` foreground; `level` its crayon ink), no value word.
Shut tab: the name muted, its value written beneath in the hand, in its own crayon if it has one.

**Principles.**
1. Face is the rank. A printed word is a name; a written word is a value or a verb. Never a third register in the card.
2. Rare enough to be a rank: ≤ 8 printed nodes on any screen, one size, one weight.
3. One right-hand side per role, zero width arms: the type is rotation-invariant.
4. A consequence the family causes, the family cures in the same slice (tape flow, tape room, scribble length, faux bold).
5. The gate learns what the CSS knows: a face-per-selector assertion lands with the CSS.

### 0.2 The review against the tells

- **High-contrast serif display everywhere** (the registry's own tell for this family): the charter printed 18 nodes in four sizes on one phone screen. Revised: eight nouns, one size, verbs stay in the hand. The masthead stays the only boiling word and sits at 2.009× its echo. The count is the defence and it is gated.
- **Accenting one word in a headline**: the `level` crayon looks like this tell. It is not decoration; it is the selected value's own ink, a readout, and it measures AA both themes. Kept, and moved to wherever the VALUE is shown (the shut tab's value word), so it never reads as a tint on a title.
- **Eyebrow labels above content**: the tape astride each well is the house's compartment name and the `aria-labelledby` target (one-string law). It stays because it is the name, not chrome. Nothing new above anything.
- **Two underline grammars 40px apart**: the CAD underline dies. The replacement is ink pressure, not a second mark.
- **Generic default check**: a generic answer to "make the section titles larger" is a size bump on the h2s. This spec's answer moves the size of exactly two nodes on the dock (the h2s, 20.35 → 25.888) and ZERO on the desk; what changes is which face six other names wear. Not the default.
- **Motion**: no entrance, no hover choreography. One ink transition on a tab switch on the estate's existing 150ms, and the scribble's hard pose-swap, both already in the house.

---

## 1. THE SPEC

### 1.1 Tokens (typography.css, one new block; `:root`, unlayered, beside the role tokens)

```css
/* ── THE FACE LAW (T9-W7 CTRL-FACE) — printed and written ──────────────────
   PRINTED is what the sheet came printed with: the eight group names, and only
   those. WRITTEN is what a pencil put there: every value and every verb.
   The sites read a FACE the way they read a ROLE (W2 §2.6): one token each. */
:root {
  --face-printed: var(--font-display);  /* Fraunces — the wordmark's own face */
  --face-written: var(--font-hand);     /* Patrick Hand */
  --printed-weight: 800;                /* fvar wght 100..900 is live in the
                                           shipped subset; a lighter rank is one
                                           number and zero bytes */
  --printed-ink: var(--color-foreground);
}
```

Role re-cut, same file (the whole of the family's "size" work):

| token | HEAD | spec | what dies |
|---|---|---|---|
| `--type-group-title` | `--type-subheading` (<768) / `--type-heading` (≥768) | `var(--type-heading)` at every width | the `@media (min-width: 768px)` arm at `typography.css:133-137` |
| `--type-option` | 20 / 22 (768–1023) / 16 (<768 fine) / 20 (<768 coarse) | `1.25rem` at every width | the three arm blocks at `:149-168` |

Measured consequence (research §4): title/option = 25.888/20 = **1.2945 at every cell** incl.
900×500 (was 1.1768 there, unseen by any instrument). The 768–1023 chip goes 22 → 20px; that
literal was `md:text-[1.375rem]` moved verbatim, never a ruling, and 20 is the rail's own chip.
The phone chip stays at M01's 20px. The phone title rises 20.35 → 25.888 (+27%), which is M03's
"larger" by arithmetic and the desk's own number.

### 1.2 The sites (each reads one face token; no shared selector rule, so no cascade tie)

The research banked the trap: a rule in `@layer components` LOSES a specificity tie to a scoped
component sheet, silently dropping `font-family`. So the law is applied AT the site, one token
per site, exactly as W2 applied the rungs.

| site | file | HEAD | spec |
|---|---|---|---|
| `.section-heading` | typography.css:366-374 | `font-family: var(--font-display)`, weight 800 | `font-family: var(--face-printed); font-weight: var(--printed-weight); color: var(--printed-ink)` (colour was never set here; the crayon class outranks it as today) |
| `.washi-tag` | SheetWashiLabel.vue:164-181 | hand, `--type-tag`, 500, `line-height: 1.5` | `font-family: var(--face-printed); font-size: var(--type-group-title); font-weight: var(--printed-weight); line-height: var(--washi-tag-lh, 1.5)`; ink stays `--color-foreground` (the tape's own) |
| `.zone-row-label` | GameControlPanel.vue:1608-1618 | hand, `--type-tag`, 400, `--ink-press-quiet` | `font-family: var(--face-printed); font-size: var(--type-group-title); font-weight: var(--printed-weight); text-transform: lowercase; line-height: var(--type-leading-heading); color: var(--printed-ink)` |
| `.ctrl-btn` | OptionSelector.vue:104-107 | `"Fira Code", monospace` literal | `font-family: var(--face-written); font-weight: 400; text-transform: lowercase` |
| `.heading-value` | GameControlPanel.vue:2404-2413 | hand, `--type-tag`, transform none | + `text-transform: lowercase` (its "Easy" paints an E in the cursive fallback today; the hand's cut holds C R S only) |
| `.icon-sublabel`, `.peek-chip-word`, `.players-leave` | — | hand | **unchanged** (verbs are written; the research's arm D) |

Casing is CSS only (R6 law 28): `selectors.ts` keeps `Easy`, `4×4`; nothing authored changes.

### 1.3 Components and states

**The compartment tape (`SheetWashiLabel anchor="tag"`) — the memorable thing on the dock.**
The name is printed ON the tape at the desk's rank (future 2, the only future that keeps the
one-string law and shrinks the card). Torn edge, ±1.5° seeded tilt, neutral washi, sticky lane,
`data-under-bar` dissolve: all as shipped. States: laid (always), pinned (sticky at the case
edge), dissolving (150ms opacity, existing). Two arithmetic repairs so it moves NO flow:
- `--washi-tag-lh: var(--type-leading-heading)` (1.2) set by `.tray-well`, and the pull reads it: `margin-top: calc(-1em * var(--washi-tag-lh, 1.5) - 0.04rem - var(--washi-tag-lift, 0px))`. The give-back is unchanged. Net flow height stays zero BY ARITHMETIC at any font-size, which is the file's own covenant (`:145-163`) made true for a re-cut. The research's 5.65px drift was the overlay setting leading 1.2 against a literal `-1.5em` pull.
- The tape's box grows 23.25 → ~31.7px tall (25.888 × 1.2 + 0.64) and ~65 → ~148px wide at 390. The 758px² collision with the `size` head is the STICKY PIN pushing a taller tape down at `scrollTop 0` (its natural top is above the scrollport; `--washi-tag-top` pins it lower). The first well's room is priced in `GameControlPanel.vue:1500-1506` (`.tray-well:first-child { margin-top: 0.35rem }`) and that is the ONE number the family may re-price, by the measured shortfall, ≤ 0.5rem. Expected order: +4px (half the height growth) against 3.75px of spare at HEAD.

**The tab row (`.mobile-heading-row`, <1024) — the memorable thing on the phone.**
Two printed names side by side. Openness is PRESSURE, the house's own word for ink:

| state | `.section-heading` | `.heading-value` (only while shut) |
|---|---|---|
| open, no crayon (`size`) | `--printed-ink` (foreground) | — |
| open, crayon (`level`) | the tier's ink class (`crayon-green` → `--color-green-ink`), as the desk h2 | — |
| shut | `--color-muted-foreground` | the value word, lowercase hand at `--type-tag`; ink = the tier's ink class if the section has one, else `--ink-press-quiet` |
| shut + hover (fine pointer only) | `--color-foreground` (the existing lift, `:2444`, now fenced to `[aria-expanded="false"]`) | unchanged |
| open + hover | no change (a repeat press is a no-op; law 14: inert text takes no affordance) | — |
| focus-visible | the estate's `2px dashed currentColor`, offset 3 (the tongue's ring, `DrawerTab`) on the button | — |

`.mobile-heading-btn .section-heading.is-active { text-decoration … }` (`:2414-2418`) DIES.
The crayon follows the value: on the open tab it sits on the name (the desk's own reading), on
the shut tab it sits on the written value word. One rule, both platforms: a printed name is at
full press; a shut compartment's name is muted. The desk's `size` h2 goes muted → foreground
under the same rule (declared DELTA; its ink was `text-muted-foreground` by `headingClass`).

Template change (GameControlPanel.vue:795-812), three bindings:
```
:class="[expandedPanel === section.key ? headingClass(section) : 'text-muted-foreground', …]"
<span v-if="expandedPanel !== section.key" class="heading-value" :class="activeColorClass(section)">
```
and `.heading-value`'s quiet colour moves into `@layer components` so the unlayered `.crayon-*`
rule outranks it — the mechanism `index.css:460` already documents for the heading. The desk
h2 (`:826`) keeps `headingClass` but its non-crayon arm becomes `text-foreground`.

**The option chip (`.ctrl-btn`).** Written, 20px, lowercase, weight 400 in every state.
`font-bold` leaves the template: Patrick Hand ships one weight and 700 is synthetic bold in
both engines, which is the P1-W3 defect class (a synthesized face). Selected = ink (foreground or
the tier's ink) + the seeded scribble; unselected = `--color-muted-foreground`; hover (fine) =
ink lift + ghost underline; selected hover = the scribble's next pose (hard swap). `rounded-md`
leaves the template too (no fill, no border: a radius on nothing; box law says written is never
boxed). Boxes: `min-width`/`min-height: var(--tap-floor)` under coarse as today; the narrowest
chips land on 44.00 exactly (research §8), nothing crosses.

The scribble's length derives from the rendered word, not a character count:
```
<button class="ctrl-btn pt-1.5 pb-0 px-3 …"><span class="ctrl-word">{{ opt.label }}</span></button>
.ctrl-word { display: inline-block; padding-bottom: 6px; background-repeat: no-repeat;
             background-position: left bottom; }
[aria-pressed="true"] .ctrl-word { background-image: var(--scribble-underline);
                                   background-size: calc(100% + 6px) 8px; }
@media (hover: hover) { [aria-pressed="false"]:hover .ctrl-word { background-image: var(--ghost-underline); background-size: calc(100% + 6px) 8px; }
                        [aria-pressed="true"]:hover .ctrl-word { background-image: var(--scribble-underline-hover, var(--scribble-underline)); } }
```
`--scribble-width` / `--ghost-width` (`:74`, `:81`) die. The pencil runs 6px past every word,
the same overshoot on `on` and on `normal`; measured overrun target 1.10–1.30 (Fira Code's own
range was 1.17–1.33). The button's 6px bottom padding moves onto the span so the chip's box
height is byte-identical to HEAD (gated).

**The row caption (`.zone-row-label`).** Printed at the rung, full press, right-aligned in its
`flex: 0 0 3.75rem` lane (a floor; min-content wins). At 390 the research measured the lane at
87px under the law. Not a layout change by this family; the prototype crops both captioned rows
at 390 and 375 and reports the chip row's remaining width and whether `candidates` wraps. If it
wraps, the cure belongs to R6 §4.1's `what fits` recut (B1 #2, another lane), not to this spec.

**The desk h2s (`size`, `level`).** Byte-identical in face, size, weight, transform. `size`'s
ink muted → foreground (the one desk DELTA). `level` unchanged.

**What stays written and untouched.** Every act verb and sublabel (deal, clear, fill, solve,
share, undo, redo, hint, peek, play, `sure?`, `copied!`), the tally, the roster, the margin
note, the tooltips, the digits. The bar, the wells' strokes, the tongue: not this family's.

### 1.4 Copy (M16)

Zero strings minted, zero authored strings changed. Rendered casing changes by CSS only:
`Easy medium hard normal corner center off ask live on 4×4 9×9 16×16` render lowercase in the
hand; the eight names render lowercase in Fraunces (six of them already did in the hand).
`aria-label`s and spoken names are untouched (one-name law).

### 1.5 The font (lands in the SAME commit as the CSS)

- `fraunces-subset.woff2`: +`p` (U+0070) — the only letter the eight names need that the cut lacks. Recipe = the estate's own (T8 close-record: upstream variable TTF, instancer SOFT=0 WONK=1, pyftsubset, both cases per the gate's rule); measured marginal ≈ +420 B → ~15,056 B. `index.css:72-74` `unicode-range` gains `U+0070`; the `@font-face` comment gains the row. The `@font-face` for Fira Code keeps its file (the byline still reads it) and its comment loses "every OptionSelector … label".
- Patrick Hand: nothing. Every option value rendered lowercase is inside the cut (research §5, 0 missing). `j` and `x` never appear.
- `scripts/check-font-coverage.mjs`:
  1. Fraunces corpus gains `{ where: ".washi-tag (the compartment names)", transform: "lowercase", derive: ["washiTags"], strings: ["new game","pencils","checking","players"] }` (new extractor: `<SheetWashiLabel anchor="tag" text="…">`) and `{ where: ".zone-row-label", transform: "lowercase", derive: ["zoneRowLabels"], strings: ["marks","candidates"] }` — the latter MOVES out of the Patrick Hand corpus.
  2. Patrick Hand corpus gains `{ where: ".ctrl-btn + .heading-value (option values)", transform: "lowercase", derive: ["optionLabels"] }` — a new extractor over `label: "…"` in `src/games/shared/selectors.ts` and the three option consts in `GameControlPanel.vue`.
  3. **Check 4, the face law**: a `FACE_SITES` map `{".section-heading":"Fraunces", ".washi-tag":"Fraunces", ".zone-row-label":"Fraunces", ".ctrl-btn":"Patrick Hand", ".heading-value":"Patrick Hand", ".icon-sublabel":"Patrick Hand"}`; for each, the script finds the selector's rule block in `src/**/*.{css,vue}` and asserts its `font-family` resolves through `--face-printed`/`--face-written`/`--font-display`/`--font-hand` to that family, and REDS on a literal family string at any site. Born-RED at HEAD on `.ctrl-btn` (the literal) and on the two sites whose face moves.
- `e2e/font-census.spec.ts` (the rendered-page mixed-face ledger): the two `p` words are the rows it would mint; after the re-cut the ledger is unchanged (exact match).

### 1.6 Motion

No new constant. Tab-switch ink: `transition: color 150ms var(--ease-standard)` on the head and
the value word (the head's `duration-250` becomes the chips' own 150, so the row and its chips
answer in one window; CSS-layer consumers read `--ease-*` per the two-layer rule, `pencilConfig`
`MOTION.curves` untouched). The scribble is a pose-swap, never a tween. The tape's dissolve is
its own 150ms. PRM: colour transitions are permitted under the estate's arm; nothing else moves.
Nothing boils (law 13); the wordmark stays the only boiling word.

### 1.7 Themes and contrast (index.css's measured ledger; the prototype re-reads from paint)

| surface | light | dark |
|---|---|---|
| printed name, bare (`--printed-ink` on card) | foreground ≈ 19:1 | ≈ 16:1 |
| printed name on tape (foreground on washi) | ≥ 4.5 (research: min 4.66 across all names) | ≥ 7.68 |
| shut tab name (muted) | 4.646 | 7.689 |
| level readout (green/orange/rose ink) | 4.95 / 4.91 / 4.99 | 10.11 / 10.26 / 6.32 |
| shut value word, no crayon (quiet) | 5.23 | 6.06 |
| chips unselected (muted, 20px) | 4.646 | 7.689 |

All ≥ 4.5 text AA in both themes; printed names are large text besides (≥ 18.66px bold).

### 1.8 What this family does not claim

ROW 2 of the heading instrument (document rank — W3's; no stylesheet mints an `<h3>`); R7 I2
(the bar's drawn edge is `HandDrawnOutline :pose="0"`, a component; its burial half is
geometry); the box law beyond the chip's dead radius; the `candidates` caption's word.

---

## 2. THE PLAN (files, order, what dies)

1. **Font first, gate second, CSS third — one commit.** Re-cut `fraunces-subset.woff2` (+p); `index.css` unicode-range + comment; `check-font-coverage.mjs` corpus moves + `optionLabels`/`washiTags` extractors + check 4. Run it: RED at HEAD's CSS (check 4), GREEN once step 3 lands.
2. `typography.css`: the FACE LAW block; `--type-group-title` → `var(--type-heading)`; `--type-option: 1.25rem`; DELETE `:133-137` and `:149-168`; `.section-heading` reads `--face-printed` / `--printed-weight`; the stale `:250` header (`--font-text ← Fraunces`) corrected to Georgia while the file is open.
3. `SheetWashiLabel.vue:164-181`: `.washi-tag` reads the printed face/rung/weight; `line-height: var(--washi-tag-lh, 1.5)`; the pull reads `calc(-1em * var(--washi-tag-lh, 1.5) …)`; the covenant comment gains the sentence "the pull reads the tag's own leading".
4. `GameControlPanel.vue`: `.tray-well` sets `--washi-tag-lh: var(--type-leading-heading)`; `.zone-row-label` reads the printed face/rung/weight/ink; `.heading-value` lowercase + layered quiet ink; template bindings (§1.3); the desk h2's non-crayon arm → `text-foreground`; DELETE the `.is-active` underline (`:2414-2418`); hover lift fenced to `[aria-expanded="false"]`; `:first-child` margin re-priced ONLY if the collision gate demands it.
5. `OptionSelector.vue`: `.ctrl-btn` reads `--face-written`, weight 400, lowercase; template drops `font-bold`, `rounded-md`, `py-1.5` → `pt-1.5 pb-0`; the `.ctrl-word` span carries the marks; `--scribble-width`/`--ghost-width` DIE; the two hover rules re-target the span.
6. Gates (§4) land in the same slice; `heading-voice.spec.ts` gains its 900×500 cell.
7. Evidence: DELTA crops (dock sheet 390 dark, rail 1280 light, 900×500), the census JSON, the coverage run, ≤ 4 crops ≤ 150 KB each.

Dies: 2 media-query blocks (typography.css), 1 literal font-family, 1 CAD underline, 2 ch-count
variables, `font-bold` + `rounded-md` on chips, `.washi-tag`'s 500 ask of a 400 face. Net LOC
negative.

---

## 3. THE PROTOTYPE BRIEF

**Where.** A throwaway `git worktree` under the scratchpad (never the main tree; never commit).
`node_modules` symlinked from `web/frontend`. Dev server `npx vite --host 127.0.0.1 --port 4234
--strictPort` (next free in 4230–4249 if taken). Scratch Playwright config (copy, drop
`webServer`/`globalSetup`, `baseURL` = the port). Both engines. The sheet slides: settle 700ms+
before reading an open dock.

**Build.** Steps 1–5 of the plan as a `.diff` banked under `pass1/prototype/CTRL-FACE/proto/`.
If `pyftsubset` or the upstream TTF is unavailable in the lane, prototype the `p` by
`unicode-range` alone is NOT acceptable (the letter would still paint Georgia); instead bank the
recipe and report the ransom probe RED with the byte figure, and everything else GREEN.

**Poses (crops, both engines; dark for the dock, light for the rail; ≤ 4 files):**
1. Dock 390×844 dark, sheet up, `size` open: the new-game well — tape, tab row, chips, scribble.
2. Same cell, `level` open (the crayon on the name; `size` shut with `9×9` written beneath).
3. Rail 1280×800 light: the masthead and the card's first two wells in one crop (the flattening question, re-asked with foreground names).
4. 900×500 sheet up: the ratio cell nobody measured.

**Censuses to re-run unchanged, and the numbers that mean success:**
- `r0/r1-controls/probe/heading-voice.spec.ts` at desk + dock (+ the 900×500 cell added beside it): ROW 1 = 1 voice (`Fraunces · 25.89 · 800 · lowercase`) at every cell; ROW 3 ≥ 1.23 at every cell (expect 1.2945 ×3); ROW 2 stays RED 2-of-8 and is recorded, not claimed.
- `r0/r7-owners-eye` I1 at 1440×900: `1 voices`.
- `research/CTRL-FACE/probe/face-census.spec.ts`: printed-node count ≤ 8 at every cell (expect 8 dock / 5 desk / 6 rail / ≤ 4 landscape); tape ∩ tab-head = **0 px²** at 390×844, 375×812, 430×932; tape ∩ any control = 0; net flow per tape |Δ vs HEAD| ≤ 0.25px at every cell; card `scrollHeight` reported (expect ≈ 646 dock, ≈ 711 at 900×500, ± the first-well repricing).
- `research/CTRL-FACE/probe/ransom.mjs`: every glyph of `pencils` and `players` advances differently under `"Fraunces", Georgia` vs `Georgia` (the `p` at 25.888/800 must NOT read 17.022 twice).
- `node scripts/check-font-coverage.mjs`: check 4 RED against HEAD's CSS, GREEN against the diff; the cmap holds U+0070; file size reported (expect ≈ 15.06 KB).
- `research/CTRL-FACE/probe/collide.mjs` chip metrics: every `.ctrl-btn` computes `Patrick Hand · 20 · 400`; every chip's HEIGHT equals HEAD's ± 0.5px; the scribble overrun (background-size ÷ word width) ∈ [1.10, 1.30] for every chip at 390-coarse and 1280.
- `e2e/zone-grammar.spec.ts` "44px floor in BOTH dimensions" + the per-dimension negative control: every chip and both tab heads ≥ 44×44 at 390×844 and 900×500 coarse.
- `e2e/access.spec.ts` 2.3 resolver on every printed name, the shut tab head, the shut value word, the chips: min ≥ 4.5 light and dark (expect ≥ 4.646 / ≥ 6.06).
- `e2e/font-census.spec.ts`: ledger exact-match unchanged (no new mixed-face row).
- Live-filter count 9 (`filterBudget` exact) and `FILTER_BUDGET_UNION_AREA` unmoved.
- `e2e/visual-regression` goldens: 4/4 unmoved outside the declared DELTAs (the controls card on the dock and the rail; the desk `size` h2's ink).
- Tab-row state: with `level` open, `.section-heading[level]` computes the tier's ink and `size`'s computes muted-foreground; with `size` open, `size` computes foreground and the `level` VALUE word computes the tier's ink; `text-decoration-line: none` on both heads at every mobile cell.
- The captioned rows at 390 and 375: `.zone-row-label` box and the chip row's remaining width reported; `candidates` wraps or not, both engines (a finding for pass 2, not a gate).

---

## 4. BORN-RED GATES (each red at HEAD, green with the slice)

1. `heading-voice.spec.ts` ROW 1 + ROW 3 at desk, dock AND 900×500 (the third cell is new and RED at HEAD: 1.1768).
2. `check-font-coverage.mjs` check 4 — face per site; RED at HEAD on the `.ctrl-btn` literal and the two moved sites.
3. Printed-count: ≤ 8 printed nodes on any screen, one computed size, one weight (RED at HEAD by construction: HEAD has 2 printed names and 6 in the hand, i.e. ROW 1 is the same red).
4. Tape geometry: tape ∩ tab-head = 0 px² at 390/375/430 AND net flow |Δ| ≤ 0.25px per tape at every cell (GREEN at HEAD, RED under the naive re-cut — a regression fence that reds the moment anyone re-points a font-size without the leading variable).
5. Scribble overrun ∈ [1.10, 1.30] for every chip (RED at HEAD in the hand face: 1.46–1.50; HEAD's Fira Code reads 1.17–1.33, so the band is the incumbent's own).
6. Hand-weight: every `.ctrl-btn` and `.heading-value` computes `font-weight: 400` (RED at HEAD: selected chips ask 700 of a static face).
7. Ransom advance: no glyph of a printed name advances identically under the Fraunces stack and under `Georgia` alone (RED the moment `pencils` is printed without the re-cut).
8. Standing, re-run: tap floor 44×44 with negative control; access 2.3 ≥ 4.5 both themes; filter census 9; font-census ledger exact; goldens 4/4 outside declared DELTAs.

---

## 5. Open for the critic (not softened, stated)

- **Full press on bare names.** The spec puts every printed name at `--color-foreground`; the desk `size` h2 changes muted → foreground. The one-token alternative is `--printed-ink: var(--color-muted-foreground)` for bare names with the dock's open tab as the sole foreground exception; that keeps the desk byte-identical but splits the rule by platform. Owner's re-look decides (U-10); the spec picks the single rule.
- **The 768–1023 chip 22 → 20.** The only way to make ROW 3 true at 900×500 without a heading off the √φ ladder. The tablet loses 2px of chip; the rotation-invariant type is the gain.
- **The caption lane at 390.** Two 25.9px captions beside chip rows; measured card height falls, but `candidates` at the rung may wrap or crowd the row. The prototype reports; if it wraps, the cure is the caption's WORD (R6 §4.1), which is another lane's.
- **The tooltip tapes ask weight 600 of a 400 face** (`SheetWashiLabel.vue:100`) — pre-existing faux bold, outside this family's sites; ledgered, not claimed.
