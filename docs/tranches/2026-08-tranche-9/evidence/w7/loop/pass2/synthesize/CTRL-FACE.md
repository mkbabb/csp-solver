# CTRL-FACE — pass 2 SYNTHESIZE · printed and written

§10 with §1 §2 §8 inside · marks M01 M03 M05 · composes under RULE/COST, never TAPE.
Verdict on the pass-2 research: TAKEN WHOLE. Every number below is the research's
(`../research/CTRL-FACE/README.md`, both engines, 2026-09-17) or pass 1's reproduced by
the critic; nothing here was re-measured, and nothing here closes (U-10).

Read first: the chair's rulings (`../CHAIR-RULINGS.md` §6.1 `--ring-ink` consumed never
minted; §7 housekeeping), the pass-1 spec and critique (`../../pass1/synthesize/CTRL-FACE.md`,
`../../pass1/critique/CTRL-FACE.md`), the owner's Frame B (`marks/m03-controls-open-iphone.png`).

---

## 0. The two-pass method (frontend-design, invoked)

### 0.1 The plan, compact

**Subject.** A pencil case for a hand-drawn sudoku. The controls card is a printed sheet the
reader has written on. One reader, on a phone in the dark (Frame B) or at a desk rail. The
design's one job on this surface: the eight compartment names read as the sheet's own
printing; everything under them reads as the reader's hand. Hierarchy is a FACE, not a size
table. Pass 2 adds the second half of that sentence: **the law is the card's, and the card
pays for it** — it never leaks to a surface that shares a class.

**Colour.** No new hex. Zero chromatic tokens minted; the family re-points which existing ink
a word wears. `--color-foreground` (light `hsl(0 0% 3.9%)` / dark `hsl(48 10% 92%)`) the
printed press · `--color-muted-foreground` (4.646 light / 7.689 dark on card) a shut
compartment's name and an unselected chip · `--ink-press-quiet` 68% graphite (5.23 / 6.06) the
shut tab's written value · the crayon inks (`--color-green-ink #1d7f35` 4.95 · `--color-orange-ink
#a26009` 4.91 · `--color-red-ink #d02a52` 4.99; dark 10.11 / 10.26 / 6.32) the level readout ·
`--sheet-washi-neutral` the tape's ground, untouched · `--ring-ink` (foreground 50%, §3.5)
CONSUMED on every control the family re-faces, never written here (chair §6.1).

**Type.** Three named faces, each a one-line alias of a `--font-*` token the estate already
ships. Sites read a FACE the way W2 made them read a ROLE: one token, at the site.
- `--face-printed: var(--font-display)` — Fraunces 800, lowercase, `--type-tracking-wide`, ONE
  rung `--type-heading` (25.888px) at every width. The eight names, and only those:
  new game · size · level · pencils · marks · candidates · checking · players.
- `--face-written: var(--font-hand)` — Patrick Hand 400, lowercase by CSS. Every value (the
  card's chips, the shut tab's value word) and every verb (already there).
- `--face-mono: var(--font-mono)` — Fira Code, the face `OptionSelector` ships as its OWN
  default, so the one literal in the estate becomes a token with zero visual change and the
  gallery's chips stay byte-identical.

**Layout.** None minted. The card, the wells, the tape's sticky lane, the tab row, the bar: W2's,
untouched. The family's ONE geometry is the tab row's headroom on the dock (≤ 0.5rem, the
pass-1 cap, now spent where it costs nothing at the sealed cell). The first well returns to
HEAD's 0.35rem. The tape buys its own room with its LEADING, which is free in flow because the
pull reads `1lh`.

```
  DOCK 390×844, sheet up (dark)                   RAIL 1280×800 (light)
  ┌╌ new game ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┐  printed on   ┌╌ new game ╌╌╌╌╌╌╌╌┐
  │                                │  tape, 25.89 │ size               │ ← printed 25.89/800, fg
  │   size          level          │  leading 1.05│   4×4   9×9   16×16 │ ← written 20/400, hand
  │                 easy  ← written│              │ level              │ ← printed, crayon
  │   4×4   9×9   16×16            │              │   easy medium hard  │
  │          ~~~                   │              └────────────────────┘
  ├╌ pencils ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┤
  │  marks     normal corner center│  ← caption printed 25.89, beside its row (free on the dock)
  │ candidates       off    on     │
  ├╌ checking ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┤  ← tape paper clears `candidates` ink by +1.0 worst case

  GALLERY ?view=gallery — π. Tape Patrick Hand 14/500 64.00×19.63; chips Fira Code 16;
  band 136.00/199.94; first card y 149.41/147.88. Identical to HEAD to 0.00px, both cells.
```

Alignment as shipped: centred stanzas on the dock, left-aligned names on the rail, the tape the
one asymmetry (`SheetWashiLabel.vue:135-140`).

**Principles.**
1. Face is the rank. Printed = a name; written = a value or a verb. Never a third register in the card.
2. The law lives at the CONSUMER, never at the shared component. `SheetWashiLabel` and
   `OptionSelector` keep HEAD's own face; `GameControlPanel` re-faces what it owns, at the
   selector the estate already uses for that (`:1523`).
3. A covenant is written in the unit that cannot go stale: the pull is `1lh`, not a variable
   with a fallback.
4. The bill is named or not paid: the seal is re-priced in the test's own precedent form, with
   the ablation table, naming M03 as the purchase.
5. The gate learns the scope: FACE_SITES is keyed by exact selector, an undeclared face home is
   RED, a law with no home is RED, and the gallery has a π cell in every census.

### 0.2 The review against the tells

- **Generic answer to "make the section titles larger"** would be a size bump on the h2s. This
  spec moves the size of two nodes on the dock (the h2s, 20.35 → 25.888) and zero on the desk;
  what changes is which FACE six other names wear. Not the default.
- **High-contrast serif display everywhere** (the registry's own tell for this family): eight
  nouns, one rung, one weight; every verb stays in the hand. The count is gated (≤ 8 printed
  nodes on any screen). The wordmark stays the only boiling word at 2.009× its echo.
- **Accenting one word**: `level`'s crayon is the selected value's own ink, a readout, AA both
  themes; it moves to wherever the value is shown, never sits on a title as a tint.
- **Eyebrow labels above content**: the tape is the compartment's name and the
  `aria-labelledby` target (one-string law). Nothing new above anything.
- **Two underline grammars 40px apart**: the CAD underline dies; openness is ink pressure.
- **Motion**: no entrance, no hover choreography. One 150ms ink transition on a tab switch on
  the estate's own curve; the scribble is a pose-swap. Nothing boils.
- **The pass-1 tell I add to the list — "the law reaches a surface it does not claim"**: a shared
  class re-faced at the component moved the gallery 7.43px and re-faced its chips undeclared.
  Revised: scoped at the consumer, measured 0.00px on both gallery cells, both engines.
- **The pin lever** (free clearance, 7.38px of tape above a scrollport's case edge) is the exact
  disease Frame B shows (the deal tape shorn at the case). Rejected on the owner's own frame.

---

## 1. THE SPEC

### 1.1 Tokens (`typography.css`, one new block beside the role tokens; `:root`, unlayered)

```css
/* ── THE FACE LAW (T9-W7 CTRL-FACE) — printed, written, mono ────────────────
   PRINTED is what the sheet came printed with: the eight group names, only those.
   WRITTEN is what a pencil put there: every value and every verb.
   MONO is OptionSelector's own default, kept so the deck's chips are unmoved.
   A site reads ONE face token, at the site (CHECK 6 reds a literal and a --font-* home). */
:root {
  --face-printed: var(--font-display);  /* Fraunces */
  --face-written: var(--font-hand);     /* Patrick Hand */
  --face-mono: var(--font-mono);        /* Fira Code */
  --printed-weight: 800;                /* fvar wght 100..900 live in the shipped cut */
  --printed-ink: var(--color-foreground);
}
```

Role re-cut, same file (the whole of the family's "size" work, unchanged from pass 1):

| token | HEAD | spec | what dies |
|---|---|---|---|
| `--type-group-title` | `--type-subheading` (<768) / `--type-heading` (≥768) | `var(--type-heading)` at every width | the `@media (min-width: 768px)` arm at `typography.css:133-137` |
| `--type-option` | 20 / 22 (768–1023) / 16 (<768 fine) / 20 (<768 coarse) | `1.25rem` at every width | the three arms at `:149-168` |

Consequence: name/option = 25.888/20 = **1.2945 at every cell**. The 768–1023 chip goes 22 →
20 (declared; the height gate names it, §4.10). The gallery's chips are pinned at 1rem by
`StagingBand.vue:291` and do not move.

`--washi-tag-lh` (pass 1) is NEVER MINTED. The pull reads `1lh` (§1.3).

### 1.2 The sites — the law at the consumer

Compiled specificity is the mechanism, not source order: `GameControlPanel`'s scoped
`.tray-well :deep(.x)` compiles to `.tray-well[data-v-g] .x` (0,3,0), which beats
`SheetWashiLabel`'s `.washi-tag[data-v-s]` and `OptionSelector`'s `.ctrl-btn[data-v-o]` (0,2,0)
and every layered Tailwind utility, deterministically. The estate ships this idiom at the same
selector already (`GameControlPanel.vue:1523`, `z-index: 35`). All five `OptionSelector`s in the
card sit under a `.tray-well` (`:761 :940 :998 :1033`), so one hook covers every chip.

| site | file | HEAD | spec |
|---|---|---|---|
| `.section-heading` | typography.css:366-374 | `var(--font-display)`, 800 | `font-family: var(--face-printed); font-weight: var(--printed-weight)`. Colour NOT set here (the template's classes carry it; `--printed-ink`'s one consumer is the caption). |
| `.washi-tag` | SheetWashiLabel.vue:164-181 | inherits the hand from `.washi-label:98`; `--type-tag`; 500; `line-height: 1.5`; pull `-1.5em` | **declares** `font-family: var(--face-written)` (zero change; the gate can now see it); rung, weight, leading as HEAD; **the pull becomes `calc(-1lh - 0.04rem - var(--washi-tag-lift, 0px))`** |
| `.tray-well :deep(.washi-tag)` | GameControlPanel.vue (beside `:1523`) | — | `font-family: var(--face-printed); font-size: var(--type-group-title); font-weight: var(--printed-weight); line-height: var(--type-leading-display)` (1.05) |
| `.zone-row-label` | GameControlPanel.vue:1608-1618 | hand, `--type-tag`, 1.1, `--ink-press-quiet` | `font-family: var(--face-printed); font-size: var(--type-group-title); font-weight: var(--printed-weight); line-height: var(--type-leading-heading); text-transform: lowercase; color: var(--printed-ink)` |
| `.ctrl-btn` | OptionSelector.vue:105 | `"Fira Code", monospace` LITERAL | `font-family: var(--face-mono)` — the literal dies, nothing paints differently |
| `.tray-well :deep(.ctrl-btn)` | GameControlPanel.vue | — | `font-family: var(--face-written); font-weight: 400; text-transform: lowercase` (outranks the template's `font-bold`; the gallery keeps its true 300–700 Fira Code bold) |
| `.tray-well :deep(.ctrl-word)` | GameControlPanel.vue | — | `background-size: 120% 8px` (the mark priced off the rendered hand word; §1.3) |
| `.heading-value` | GameControlPanel.vue:2404-2413 | hand, `--type-tag`, transform none | `font-family: var(--face-written)` (explicit) + `text-transform: lowercase`; quiet ink hoisted into `@layer components` so the unlayered `.crayon-*` outranks it |
| `.icon-sublabel`, `.peek-chip-word`, `.players-leave` | — | hand | unchanged (verbs are written) |
| the gallery: `StagingBand.vue:130` tape, `:143 :158` chips, `:140 :154` labels | — | hand 14/500 · Fira Code 16 · hand 16/800 | **UNTOUCHED, and gated π** (§4.9) |

Casing is CSS only (R6 law 28): `selectors.ts` keeps `Easy`, `4×4`. `.ctrl-btn`'s `text-transform`
is set ONLY at the controls' hook, so the gallery keeps `Easy Medium Hard`.

### 1.3 Components and states

**The compartment tape (`SheetWashiLabel anchor="tag"` under `.tray-well`) — the memorable thing
on the dock.** Printed ON the tape at the desk's rank. Torn edge, ±1.5° seeded tilt, neutral
washi, sticky lane, `data-under-bar` dissolve: as shipped. States: laid · pinned · dissolving
(150ms, existing). Three arithmetic facts, all measured:

- **The pull is `1lh`.** `margin-top: calc(-1lh - 0.04rem - var(--washi-tag-lift, 0px))`; the
  give-back unchanged. No consumer sets anything; it resolves under `line-height: normal`; error
  0.02px (1/64 layout unit) against the ±0.25 covenant; flow cost 0.00–0.02px at six leadings
  1.2 → 0.9, both engines. Support: `lh` shipped Chrome 109 / Safari 16.4 / Firefox 120, inside
  the declared floor (`package.json:12-18`, held by `scripts/check-support-floor.mjs`).
- **The tape's leading is `--type-leading-display` (1.05)** — the ladder's own display leading,
  read at the controls' hook. Paper 31.54px over 22.02px of ink. It costs 0.00 in flow and buys
  3.88px of room at BOTH collisions: tab head −6.79 → **−2.87** (the tab row pays the rest,
  below); `checking` paper over a worst-case `candidates` descender −2.88 → **+1.00**; over the
  rendered word +3.13 → **+7.0**. Interpolated from the research's sweep (1.1 → −4.17, 1.0 →
  −1.59 at the head; 25.888 × 0.15 = 3.88px); the prototype reads it exactly. If either engine
  reads the worst-case arm under +0.5, the fallback is `line-height: 1` (+2.30 worst case, tab
  head −1.59) — a literal, declared, never a variable.
- **The first well returns to HEAD's `0.35rem`** (`GameControlPanel.vue:1514-1516`). Pass 1's
  1.5rem dies with its 18.41px. The rail's first tape stays unpinned at rest (top ≥ case edge;
  +0.54 at 0.35rem before the leading, ~+4.4 after — the prototype asserts it at 1280 and 1440).

The pin (`--washi-tag-top`) is NOT spent: −0.6rem buys the clearance and puts 7.38px of a pinned
tape above a scrollport's case edge (`scene.css`), the residue W2 §2.3 cured and Frame B shows.

**The tab row (`.mobile-heading-row`, <1024) — the memorable thing on the phone.** Two printed
names side by side; openness is ink pressure. ONE geometry: `padding-top: 0.35rem` (5.6px) on
`.mobile-heading-row` — tape ∩ tab head −2.87 → **+2.73** at 390×844 / 375×812 / 430×932 /
900×500. The row exists only under `mobile`, so the sealed 1280-row cell pays 0.00; the dock card
pays 5.6 (§1.8). Within the pass-1 cap (≤ 0.5rem), now spent where it is free.

| state | `.section-heading` | `.heading-value` (only while shut) |
|---|---|---|
| open, no crayon (`size`) | `--color-foreground` | — |
| open, crayon (`level`) | the tier's ink class (as the desk h2) | — |
| shut | `--color-muted-foreground` (4.659 light / 7.681 dark) | the value word, lowercase hand at `--type-tag`; the tier's ink if the section has one, else `--ink-press-quiet` (5.23 / 6.06) |
| shut + hover (fine pointer) | `--color-foreground` (the existing lift `:2444`, fenced to `[aria-expanded="false"]`) | unchanged |
| open + hover | no change (law 14: inert text takes no affordance) | — |
| focus-visible (the button) | `2px dashed var(--ring-ink)`, offset 3 (law 39's tab form; the token CONSUMED, chair §6.1) | — |

ONE DIMMING (CTRL-TABS graft): the button's ground holds at opacity 1 and the WORD takes the
quiet rung; never both. `.mobile-heading-btn .section-heading.is-active` (`:2414-2418`) DIES.
Template (`GameControlPanel.vue:795-812`), two bindings as pass 1:
`:class="[expandedPanel === section.key ? headingClass(section) : 'text-muted-foreground']"` and
`<span v-if="expandedPanel !== section.key" class="heading-value" :class="activeColorClass(section)">`.
The desk h2 (`:826`) keeps `headingClass`; its non-crayon arm becomes `text-foreground` (the one
desk DELTA: `size` muted → foreground).

**The option chip (`.ctrl-btn` under `.tray-well`).** Written, 20px, lowercase, 400 in every
state. Selected = ink (foreground or the tier's) + the seeded scribble; unselected = muted;
hover (fine) = ink lift + ghost; selected hover = the scribble's next pose (hard swap).
`min-width`/`min-height: var(--tap-floor)` under coarse as today (44.00 exactly on the narrowest,
zero headroom, gated). `:focus-visible`: `2px dashed var(--ring-ink)` offset 3 — consumed, because
WebKit's UA ring reads 2.147:1 on these chips (CTRL-RULE/TABS, chair §6.1).

The scribble is priced off the RENDERED word, and the gallery keeps HEAD's arithmetic:
```
<button class="ctrl-btn rounded-md px-3 pt-1.5 pb-0 …"><span class="ctrl-word">{{ opt.label }}</span></button>

/* OptionSelector.vue — HEAD's mark, moved from the button onto the word */
.ctrl-word { display: inline-block; padding-bottom: 6px; background-repeat: no-repeat;
             background-position: left bottom; }
[aria-pressed="true"] .ctrl-word { background-image: var(--scribble-underline);
                                   background-size: var(--scribble-width, 4ch) 8px; }
@media (hover: hover) {
  [aria-pressed="false"]:hover .ctrl-word { background-image: var(--ghost-underline); background-size: var(--ghost-width, 4ch) 8px; }
  [aria-pressed="true"]:hover  .ctrl-word { background-image: var(--scribble-underline-hover, var(--scribble-underline)); }
}
/* GameControlPanel.vue — the consumer that changed the face pays for the mark */
.tray-well :deep(.ctrl-word) { background-size: 120% 8px; }
```
`--scribble-width`/`--ghost-width` (`${label.length + 1}ch`, `:74 :81`) LIVE — they are the
gallery's mark and the reason its scribble is byte-identical. On the card the hand word's overrun
reads 1.176–1.228 (band 1.10–1.30, Fira Code's own 1.17–1.33). The chip's box height is
byte-identical to HEAD (the 6px moves, it does not change). `rounded-md` stays: a radius on
nothing paints nothing, and touching it moves the gallery's DOM for no pixel.

**The row caption (`.zone-row-label`).** Printed at the rung, full press, right-aligned in its
`flex: 0 0 3.75rem` lane (min-content wins: `candidates` 148.08px, one line, no wrap, 201.92px of
chip row left at 390 / 186.92 at 375, both engines). On the rail the caption sits OVER its row
(`:1624`) and costs its line box — that is the whole iPad bill (§1.8).

**The desk h2s.** Byte-identical in face, size, weight, transform. `size` muted → foreground.

**What stays written and untouched.** Every act verb and sublabel, the tally, the roster, the
margin note, the tooltip tapes (which still ask 600 of a 400 face — pre-existing, ledgered, not
this family's site), the digits. The bar, the strokes, the tongue: W2's.

### 1.4 Copy (M16)

Zero strings minted, zero authored strings changed. Rendered casing changes by CSS on the CARD
only: `easy medium hard normal corner center off ask live on 4×4 9×9 16×16` in the hand; the
eight names lowercase in Fraunces. The gallery renders `Easy Medium Hard` exactly as HEAD.
`aria-label`s and spoken names untouched (one-name law). The lowercase authoring is a COPY RULING
the owner disposes (charter); carried as one.

### 1.5 The font (same commit as the CSS)

- `fraunces-subset.woff2`: +`p` (U+0070) — `pencils`, `players`. Measured +260 B (14,636 →
  14,896), cmap 31, `fvar` intact. `index.css` `unicode-range` gains `U+0070`; the ledger comment
  gains the row. Ransom proof by ADVANCE: `p` at 25.888/800 reads 16.714 (chromium) / 16.719
  (webkit) under the stack vs 17.022 / 17.027 under Georgia; 0 `fellBack`.
- `patrickhand-subset.woff2`: +`A E H L M N O` (+584 B, 4,312 → 4,896, 46 → 53 cp). The option
  values enter the hand's corpus and the coverage gate's both-cases rule wants the AUTHORED
  initials (`Easy` stays `Easy` in `selectors.ts`, law 28). DECLARED: the bill is +844 B gross,
  self-hosted 22,572 → 23,416 (+3.7%), not pass 1's +420.
- Fira Code: NO re-cut. Under scope the gallery still renders its whole repertoire; the
  "recoverable" 3,624 B is not recoverable and the spec says so. Its `@font-face` comment loses
  "every OptionSelector … label" and gains "the deck's staging chips, the byline, the mono
  registers".
- `scripts/check-font-coverage.mjs` (the pass-1 diff, amended):
  1. corpus: Fraunces gains `washiTags` (`<SheetWashiLabel anchor="tag" text="…">` under
     `GameControlPanel.vue` ONLY — the extractor takes a `files` filter; the gallery's `new game`
     stays in the hand's corpus) and `zoneRowLabels`; Patrick Hand gains `optionLabels` with
     `where: ".tray-well .ctrl-btn + .heading-value"`, `transform: "lowercase"`; Fira Code keeps
     `optionLabels` for `where: ".staging-axis .ctrl-btn"` (authored case).
  2. **CHECK 6 re-cut** (§4.2): `FACE_SITES` keyed by EXACT selector text; first token must match
     `/^--face-/`; every block declaring `font-family` on a listed class must be a key
     (undeclared home = RED); a key with no block = RED (a law with no home).

### 1.6 Motion

No constant minted. Tab-switch ink: `transition: color` on the head and the value word at the
ladder's shortest rung — the 150ms the chips (`duration-150`) and the tape's dissolve already
ride — on `--ease-standard` (index.css:326, "show-hide fade"). Home: `pencilConfig.ts`
`MOTION` through MOT-LADDER's publisher; this family CONSUMES the rung it publishes (if the
ladder names it `--dur-*`, the site reads that token; the head's `duration-250` dies so the row
and its chips answer in one window). The scribble is a pose-swap, never a tween. PRM: the ladder
zeroes the rung at `:root`, so the switch is same-frame; nothing else moves. Nothing boils (law
13); filterBudget stays EXACTLY 9 (chair §7).

### 1.7 Themes and contrast (pass-1 paint read-back over 160 nodes; the estate's resolver re-reads)

| surface | light | dark |
|---|---|---|
| printed name, bare (foreground on card) | 19.451 | 15.839 |
| printed name on tape (16 readings) | 11.006 – 17.362 | 9.122 – 10.284 |
| shut tab name (muted) | **4.659** | 7.681 |
| level readout (crayon inks) | 4.95 / 4.91 / 4.99 | 10.11 / 10.26 / 6.32 |
| shut value word, no crayon (quiet) | 5.23 | 6.06 |
| chips unselected (muted, 20px) | 4.659 | 7.681 |
| gallery (π) | as HEAD | as HEAD |

All ≥ 4.5 both themes. The printed names ARE large text (≥ 18.66px bold) and the floor is held
at 4.5 anyway, so `access.spec.ts:540-541`'s comment is re-worded (§4.6).

### 1.8 The bill — priced, and paid where it is paid

1280×800 coarse (the sealed cell, `visual-regression.spec.ts:790-871`, SEAL 1227.5):

| term | px | how it is paid |
|---|---|---|
| the four tapes re-faced | **0.00** | the `1lh` pull |
| the tape's leading 1.2 → 1.05 | **0.00** | free vertically (1258.47 / 1258.34 at every leading) |
| the first well 1.5rem → 0.35rem | **−18.41** | handed back; the leading + the tab row buy the clearance |
| the tab row's 0.35rem | **0.00** | the row does not exist in the row regime |
| the two captions at the printed rung | **+31.25** | **M03's own purchase — the seal is re-priced** |
| shipped | **1258.47 chromium / 1258.34 webkit** | |

**THE THIRD RE-PRICE, in the test's own form.** `SEAL = 1261` (= shipped + the same 2.6px of
engine slack T6 gave; equivalently 1227.5 + 31.25 + 2.25). The comment carries this table and
names the purchase: the owner's M03 ("the section titles need to be larger"), the one-voice law,
two row captions on the rail that sit OVER their rows and cost their line boxes. A second
negative control lands beside the existing one: revert the two captions to the hand rung in-page
and the card must FALL by ≥ 28px (proves the seal bought a face, not slack). The existing control
(un-pair the options, re-double the divider) still breaks 1261 by > 30. Composition: this row is
HEAD's structure wearing the law; RULE (margin column) and COST (band heads) price their own
height against the same seal and re-price it themselves if they win.

Card heights the prototype must reproduce (scrollHeight, ±1): dock 390×844 **~683** (677 + 5.6;
HEAD 699); 900×500 **~745** (739 + 5.6; HEAD 743); 1280 fine **~1174** (pass 1's 1192 − 18.41;
HEAD 1142); iPad coarse **1258.47 / 1258.34**. Pass 1's ~646 was stale and is retired.

### 1.9 What this family hands the structures it composes under

- **CTRL-RULE arm (b)**: the printed rung at the margin — RULE measured its column floor
  (`checking` 121.47px at 25.89/800) against THIS rung; the face tokens and CHECK 6 land as-is;
  the seal row is RULE's to re-price for its own layout.
- **CTRL-COST**: band heads at 25.888 Fraunces 800 at every width (COST already consumes the
  rung with ROW 3 deleted); the chip law, the ring, and the `.ctrl-word` mark land under any
  head; `--face-*` tokens as the head's declaration.
- **CTRL-TAPE**: INCOMPATIBLE and kept separate. TAPE promotes the tape to a block `<h2>` (which
  is what moved the deck 12.00px) and reserves a pin band; this family keeps the tape a span in
  flow with a `1lh` pull and moves the deck 0.00. The agglomerator decides; nothing merged here.
- **Every §10 family**: the shared-class discipline as a gate (`shared-class-census.mjs`,
  banked): any edit to `.section-heading` / `.washi-tag` / `.ctrl-btn` censuses `StagingBand` and
  `GameCard` render consumers before claiming π.

### 1.10 What this family does not claim

ROW 2 of the heading instrument (document rank — W3's; no stylesheet mints an `<h3>`); R7 I2
(the bar's drawn edge, a component); the box law beyond the chip; the `candidates` caption's WORD
(R6 §4.1 / B1 #2, RULE's `what fits`); the gallery (π, gated, the owner may extend the law there
at the re-look — the estate's own comment at `StagingBand.vue:126-129` says the slip and the well
"read as one system", and that tension is banked as OPEN, not disposed).

---

## 2. THE PLAN (files, order, what dies)

Replay the pass-1 worktree diff (`../../pass1/prototype/CTRL-FACE/proto/ctrl-face.diff`) into a
FRESH worktree (chair §7: pass-1 worktrees are the record), then apply these deltas in order:

1. **Font + gate first, one commit with the CSS.** Fraunces +`p`, Patrick Hand +`A E H L M N O`
   (the pass-1 cuts, byte-identical); `index.css` unicode-ranges + the ledger comments (Fira
   Code's comment re-worded, NOT re-cut); `check-font-coverage.mjs`: the `files` filter on
   `washiTags`, the split `optionLabels` corpora, CHECK 6 re-cut (§4.2). Run bare: RED at HEAD.
2. `typography.css`: the FACE LAW block gains `--face-mono`; `--type-group-title` →
   `var(--type-heading)`; `--type-option: 1.25rem`; DELETE `:133-137` and `:149-168`;
   `.section-heading` reads `--face-printed` / `--printed-weight`; the stale `:250` header corrected.
3. `SheetWashiLabel.vue:164-181`: `.washi-tag` DECLARES `font-family: var(--face-written)`; the
   pull becomes `calc(-1lh - 0.04rem - var(--washi-tag-lift, 0px))`; rung/weight/leading stay
   HEAD's; **pass 1's printed face, `--type-group-title` rung and `var(--washi-tag-lh, 1.5)` are
   REVERTED here**. The covenant comment (`:156-160`) rewritten: the pull reads the tape's own
   used leading through `lh`, so a consumer may re-cut the leading and the covenant holds by the
   unit, not by a variable; `:135-140` gains "in the controls card the tape is printed at the
   group rank; on the deck it stays the hand's".
4. `GameControlPanel.vue`: beside `:1523`, `.tray-well :deep(.washi-tag)` gains the printed face,
   rung, weight and `line-height: var(--type-leading-display)`; `.tray-well :deep(.ctrl-btn)` and
   `.tray-well :deep(.ctrl-word)` (§1.3); `.tray-well:first-child` BACK to `0.35rem`;
   `.mobile-heading-row { padding-top: 0.35rem }` with its comment (the number, the cell it costs,
   the cell it does not); `.zone-row-label` printed; `.heading-value` explicit face + lowercase +
   layered quiet ink; the two tab-row bindings; the desk h2's non-crayon arm → `text-foreground`;
   DELETE the `.is-active` underline (`:2414-2418`); hover lift fenced to `[aria-expanded="false"]`;
   `:focus-visible` on the tab button and the chips reads `--ring-ink`; `duration-250` → the
   ladder's 150 rung. `--washi-tag-lh` on `.tray-well` (pass 1) DIES.
5. `OptionSelector.vue`: `.ctrl-btn { font-family: var(--face-mono) }` (the literal dies);
   template: `py-1.5` → `pt-1.5 pb-0`, the label wrapped in `.ctrl-word`; the mark rules move
   onto `.ctrl-word` reading `var(--scribble-width, 4ch)` / `var(--ghost-width, 4ch)` exactly as
   HEAD; `font-bold`, `rounded-md`, the two `ch` variables STAY (pass 1 deleted them; reverted —
   they are the gallery's).
6. Gates (§4): `visual-regression.spec.ts:821` SEAL → 1261 with the table and the second negative
   control; `access.spec.ts:439` four targets + the comment; `font-census.spec.ts` the eleven
   retired rows with the reason ON the rows (pass 1's diff, kept); `zone-grammar.spec.ts` the
   `:has(.ctrl-word:text-is())` re-aim (kept); the r0 heading-voice copy gains the 900×500 and
   gallery cells; `r2-face.spec.ts` / `r2-flow.spec.ts` (the covenant-on-the-consumer and INK
   gates) promoted from `probe/` into `e2e/` as `face-law.spec.ts`; the chip-height gate names
   the 768–1023 re-cut.
7. Evidence: numbers first; ≤ 4 crops (§3); the shared-class census output; the coverage run;
   the goldens' report off the dist.

Dies: 2 media-query blocks (typography.css), 1 literal font-family, 1 CAD underline, pass 1's
`--washi-tag-lh` + its fallback, pass 1's 1.5rem first well, pass 1's re-facing of
`SheetWashiLabel`'s own rule. Lives on purpose: `--scribble-width`/`--ghost-width`, `font-bold`,
`rounded-md` (the gallery's). Net src LOC: pass 1 was +222/−111; this pass removes more of pass 1
than it adds (the scope rules are ~14 lines; the reverted lines are ~30).

---

## 3. THE PROTOTYPE BRIEF

**Where.** A fresh `git worktree` under the scratchpad, pass-1 diff replayed, `node_modules`
symlinked. Two servers, both on `127.0.0.1:4234` (next free in 4230–4249 if held; 4235 is
foreign), never at once, each with the two-line scratch vite config (`cacheDir` private,
`.vite-cache/` locally excluded): (a) `npx vite --config <scratch> --host 127.0.0.1 --port 4234
--strictPort` for the censuses; (b) `npx vite build` then `npx vite preview --host 127.0.0.1
--port 4234 --strictPort` for the goldens and the dist-bound reads. A HEAD control from `git
archive HEAD` served the same way for every π delta (the paired-read discipline). Scratch
playwright config (no webServer, no globalSetup, baseURL the port). Both engines. The sheet
slides: settle ≥ 700ms before reading an open dock. KILL every server before returning.

**Build.** Plan steps 1–6 as a `.diff` banked under `pass2/prototype/CTRL-FACE/proto/`. Also:
grep the BUILT css for `-1lh` (Lightning CSS must pass the unit through; if it lowers or drops it,
RED with the built declaration quoted — no fallback is written).

**Poses (≤ 4 crops ≤ 150 KB, both engines shot, one banked per pose; cite each):**
1. Dock 390×844 DARK, sheet up, `size` open: the new game well and the top of pencils — the
   printed tape at leading 1.05 over the tab row with its 0.35rem headroom (the memorable thing).
2. Dock 390×844 LIGHT, scrolled so the `checking` tape sits over `candidates`: the ink gate's
   pair, the light dock nobody framed.
3. Rail 1280×800 light: `new game` on tape over `size` at full press — the U-10 frame re-asked
   at the new leading; the owner disposes.
4. (Only if any gallery number moves by > 0.25px) gallery 390×844 dark beside the critic's
   pass-1 frame. Expected: NOT banked, because every number is 0.00.

**Censuses, and the numbers that mean success (every cell × both engines):**
- r0 `r1-controls/probe/heading-voice.spec.ts` — COPIED, OUT re-pointed to this lane — desk
  1280×800 + dock 390×844 + **900×500** + **`?view=gallery` as a π cell**: ROW 1 = `1 voices:
  Fraunces · 25.89 · 800 · lowercase`, n=8 at the three card cells; ROW 3 = 1.2945 at all three;
  the gallery cell reads tape `Patrick Hand · 14 · 500`, labels `Patrick Hand · 16 · 800`, chips
  `Fira Code · 16` — HEAD's, byte-exact; ROW 2 stays RED 2-of-8, recorded not claimed. Proposed
  as a diff under `pass2/prototype/CTRL-FACE/instruments/`; r0 row reported MOVED (subject moved).
- r0 `r7-owners-eye` I1 at 1440×900: `1 voices`.
- r0 `r2-accent-family` hue census — COPIED, OUT re-pointed — delta 0 (the family mints no colour);
  one line in the README proves it. The wobble probe is NOT run: the family touches no board mark
  (stated, not skipped silently).
- `probe/shared-class-census.mjs` on `SheetWashiLabel`, `OptionSelector`, `.section-heading`:
  3 / 2 / 3 consumers as banked; every consumer outside `GameControlPanel` reads HEAD's face.
- **Gallery π** (`?view=gallery`, 390×844 + 1280×800, HEAD control paired): band 199.94 / 136.00;
  first card y 147.88 / 149.41; tape paint 64.00×19.63; sudoku size row 167.96, level row 196.77,
  futoshiki size row 198.36; `16×16` 68.78; every chip's face/rung/weight/casing; the selected
  chip's scribble bbox — **all |Δ| ≤ 0.25px vs HEAD**, tape/labels/chips face identical.
- **Tape covenant ON THE CONSUMER** (`r2-flow.spec.ts`): per `.tray-well` tape, box-with-tape −
  box-with-`display:none` ∈ [−0.25, +0.25] at dock 390/375/430, 900×500, 1280, 1440; the gallery
  cell asserts HEAD's reading (21.0 ± 0.25) as π, never zero.
- **INK gate** (`r2-face.spec.ts` §D, canvas metrics in the node's computed font): `checking`
  paper top − `candidates` own ink bottom ≥ +2.0 (expect ~+7.0); − worst-case descender
  (`pgjqy`, 6.34) ≥ +0.5 (expect +1.00); `players` paper never enters `live`/`off`'s word box.
- **Tab head**: tape ∩ tab head = 0px² with daylight ≥ +2.0 at 390×844, 375×812, 430×932, 900×500
  (expect +2.73). The rail's first tape unpinned at rest at 1280 and 1440 (top ≥ case edge).
- **The seal**: `visual-regression` test 10 at 1280×800 coarse ≤ 1261 (expect 1258.47 / 1258.34);
  both negative controls break it (the second: captions to the hand rung → falls ≥ 28).
- **Printed count**: ≤ 8 printed nodes on any screen, one computed size, one weight (expect 7–8
  dock, 3 at 900×500, 4–5 desk).
- `node scripts/check-font-coverage.mjs` bare: CHECK 6 RED at HEAD (the literal, the two moved
  sites, `p` ×2, an unlisted home if any), GREEN on the diff; cmaps 31 / 53; bytes 14,896 / 4,896;
  Fira Code unchanged 3,624.
- **Ransom advance**: no glyph of a printed name advances identically under the Fraunces stack
  and under Georgia alone (`p` 16.714 vs 17.022).
- **Chip metrics**: every card `.ctrl-btn` computes `Patrick Hand · 20 · 400 · lowercase`; height
  == HEAD ± 0.5 at every cell EXCEPT the 768–1023 stacked card where it == HEAD − 1 ± 0.5 (the
  declared rung); overrun ∈ [1.10, 1.30] on the card AND on the gallery.
- `e2e/zone-grammar.spec.ts` 44px floor both dimensions + negative control: every chip and both
  tab heads ≥ 44×44 at 390×844 and 900×500 coarse (expect 44.00 exactly on the narrowest).
- `e2e/access.spec.ts` 2.3 with the four new targets: min ≥ 4.5 light and dark (expect 4.659 /
  6.06); `--ring-ink` on every chip and tab head ≥ 3:1 against card (read §6's value, report only).
- `e2e/font-census.spec.ts`: both arms green with the eleven retired rows; the backward arm
  proves no row went stale.
- `e2e/filter-census`: live filters EXACTLY 9, union area unmoved.
- **Goldens off the dist**: `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4234 npx playwright test
  --config playwright-golden.config.ts` → 4/4 unmoved (none sees the card or the gallery; the π
  defence there is the geometry above, and the README says so).
- `vue-tsc`, `vitest run` (Test Files AND Tests counts), `lint:copy` (0 dashes, 0 strings minted),
  `lint:ink`, `lint:motion`, `eslint`, `prettier --check` — all bare, exit codes read unpiped.

---

## 4. BORN-RED GATES (red at HEAD unless marked FENCE; green with the slice)

1. **heading-voice ROW 1 + ROW 3** at desk, dock and 900×500 (HEAD: 3 voices; 1.0175 / 1.1768).
2. **CHECK 6 re-cut** — FACE_SITES keyed by exact selector; first token `/^--face-/`; an
   undeclared home RED; a law with no home RED. HEAD reds on the `.ctrl-btn` literal, on
   `.washi-tag` declaring no face, on `.zone-row-label`'s hand, on `p` ×2.
3. **Printed count** ≤ 8 on any screen, one size, one weight (HEAD: 2 printed, 6 in the hand).
4. **Ransom advance** for every printed name's glyphs (HEAD paints `pencils`' `p` in Georgia).
5. **The seal re-priced** (1261) WITH its second negative control: captions to the hand rung
   must drop the card ≥ 28px (at HEAD the ablation moves 0 → RED).
6. **CONTRAST_TARGETS** + `.section-heading`, `.heading-value`, `.zone-row-label`, `.washi-tag`
   under `.controls-card`; floor 4.5; the `:540-541` comment re-worded (at HEAD `.washi-tag` and
   `.heading-value` are not in the list → the row is RED by construction: n rises 4 → 8 sites).
7. **Hand weight**: every card `.ctrl-btn` and `.heading-value` computes 400 (HEAD: selected chips 700).
8. **Scribble overrun** ∈ [1.10, 1.30] for every painted chip on the card (HEAD in the hand: 1.46–1.50).
9. **Gallery π cell** — FENCE (green at HEAD, RED at the pass-1 build: 150.83 / 214.77): tape,
   two labels, six chips, band, first card y, scribble bbox all |Δ| ≤ 0.25 vs HEAD.
10. **Chip height** == HEAD ± 0.5 at every cell, == HEAD − 1 at 768–1023 (names the re-cut).
11. **Tape covenant on the consumer** — FENCE at the card (HEAD −0.01..−0.05; RED under any
    re-cut that strands the pull), π on the gallery (21.0 ± 0.25).
12. **INK gate**, both arms — FENCE at HEAD, RED at the pass-1 build (−2.88 worst case).
13. **Tab head daylight** ≥ +2.0 at four mobile cells — RED at the pass-1 build with the first
    well returned (−6.79), green with the leading + the row's headroom.
14. **`1lh` survives the build** — the built css contains the unit (RED if the toolchain lowers it).
15. Standing, re-run bare: tap floor 44×44 + negative control; filter census 9; font-census both
    arms; goldens 4/4 off the dist; lint:copy / ink / motion; support floor.

---

## 5. Open for the critic and the owner (stated, not softened)

- **The third re-price.** 1261 is M03's price for two captions on the rail; the alternative that
  keeps 1227.5 is the captions in the hand at 14px — HEAD's third voice, the census complaint
  itself. The spec picks the law and pays with the table; the owner's re-look decides whether
  two 25.89px captions beside a chip row read as one voice or one shout (U-10; pose 2 and 3).
- **Leading 1.05 on a washi tape** hugs its word (31.54 paper over 22.02 ink). A design claim,
  zero flow, banked in pose 1. If the eye wants 1.2 back, the price is the pin (rejected) or the
  well's margin (+6.4 at the iPad).
- **Two clearances under 3px**: worst-case descender +1.00, tab head +2.73. Both measured by
  interpolation here; the prototype reads them exactly, and the fallback (`line-height: 1`,
  +2.30 / then +4.0) is written down.
- **The gallery tension.** `StagingBand.vue:126-129` says the slip and the staged well "read as
  one system". Under scope they no longer share a face. The law could be extended to the deck at
  the re-look as its own declared row (band +14.83, first card −7.43, a frame, a golden) — the
  owner's, not this pass's.
- **`--ring-ink`'s value** is §6's (MRK-LIVE); this family reads it and reports the chips'
  ratio on both themes, never sets it.
