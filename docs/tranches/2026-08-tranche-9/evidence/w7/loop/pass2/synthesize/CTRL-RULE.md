# T9-W7 · pass 2 · SYNTHESIZE · CTRL-RULE — the ruled page, arm (b)

Section §10 (§1 §2 §8 §14 §15 inside) · marks M01 M03 M04 M05 M12 M13 · pass-1 60, the fork
REOPENED by the chair. Synthesizer: Fable 5.1. Read-only on the product. Inputs: `CHAIR-RULINGS.md`,
the pass-1 spec (arm (a)), the pass-1 critique (the pinned head cuts `Normal` 38.8%; 733 in 540;
the rule 2.451 light; the gallery +12.00), the pass-2 research record
(`../research/CTRL-RULE/README.md`, `readings/armb-budget.json`, `lever-sweep.json`,
`occlusion-and-ring.json`), registry-v1, r0 R6/R7, the owner's frames. Nothing closes here (U-10).

Arm (a) is dead on its own invariant. This is arm (b): the name lives in the MARGIN, beside its
field, and nothing in the card pins. It is a separate route from CTRL-TAPE and stays separate.

---

## 0 · The plan, then the tell review

**Subject.** A worksheet page ruled by hand: a margin column on the left where the page came
PRINTED with the group's name, a wide field on the right where the pencil chooses, one graphite
rule under each group running the full width. Not a form. The difference is measurable and the
spec states it.

**Tokens.** No new hex. One new LENGTH token (`--rp-margin`). `--ring-ink` consumed (chair §6.1).

| token | light | dark | job |
|---|---|---|---|
| `--color-card` | ≈ #FDFDFB | #131211 | the page |
| `--color-foreground` | #0A0A0A | ≈ #EDEBE7 | chosen chips, act words, the confirm's sentence |
| `--color-muted-foreground` | #737373 | ≈ #A8A69F | EVERY name (one ink; the crayon leaves the name and lives on the chosen chip), the verbs at rest |
| `--ink-press-rule` | graphite 55% | same | THE RULE |
| `--color-red-ink` | #D02A52 (4.99 on bare card) | #FF5C7C (6.30) | the destructive answer's word, on BARE card (registry §6.4) |
| `--ring-ink` (consumed) | fg 50% | fg 50% | 21 desk / 19 dock controls, 2px solid, offset 4 |
| `--rp-margin` | `7.6rem` (121.6px ≥ 121.47, `checking` at φ) | | the margin column |

**Type.** Fraunces 800 lowercase at φ (`--type-heading` 25.888px) for the seven names—what the page
came printed with. Patrick Hand for the pencil's words (verbs, tally, notes, the confirm). Fira
Code at 20px for every chip at every width (M01's phone number, held; the 768–1023 arm 22 → 20).
Ratio 1.2945 everywhere. A name WRAPS AT ITS SPACE inside the margin (`new game`, `what fits`);
the margin is sized to the longest UNBREAKABLE word, never to the longest name.

**Layout, one sentence.** Each group is one row of a two-column grid—`[margin 121.6] [8] [field
1fr]`—the name top-left in the margin, the chips left-aligned in the field on the same first
baseline, a full-bleed hand-drawn rule under the row; the field wraps when it must; the bar is the
case's foot below the page.

```
 390×844 (374 available)                          1280×800 rail (324 wide)
 ┌──────────┬─┬──────────────────────────┐        ┌──────────┬─┬──────────────┐
 │ size     │ │ [4×4] [9×9] [16×16]      │        │ size     │ │ [4×4]        │
 │╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌ rule σ≈1.05 ╌╌╌╌╌╌╌╌╌╌╌│        │          │ │ [9×9]        │  the rail's field
 │ level    │ │ [Easy] [Medium] [Hard]   │        │          │ │ [16×16]      │  stacks as HEAD's
 │╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌│        │╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌│  does (one per line)
 │ new      │ │ ╔══════╗                 │        │ level    │ │ [Easy] …     │
 │ game     │ │ ║ deal ║  dealt ⊪        │        …
 │╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌│
 │ marks    │ │ [Normal] [Corner]        │  ← the ONE wrap at 390: +27.00 on the card
 │          │ │ [Center]                 │
 │╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌│
 │ what     │ │ [Off] [On]               │
 │ fits     │ │                          │
 │╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌│
 │ checking │ │ [Off] [Ask] [Live]       │  ← 121.47: the word that sizes the margin
 │╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌│
 │ players  │ │ [play together] [share]  │
 │          │ │ the roster line · leave  │
 ├──────────┴─┴──────────────────────────┤  the card ENDS
 │ #card-foot  [clear] [fill] [solve] [share] (i)   ← outside the port, one drawn top rule
 └───────────────────────────────────────┘
```

**Principles.** (1) One voice, one rung, one ink, one rule. (2) Nothing pins: the name rides its
row, so the class invariant ("a sticky surface with a ground never paints over a control") is
satisfied by having no sticky surface in the port. (3) Nothing hidden: the tabs die; `level` is a
row like the others. (4) Boxes mean consequence. (5) The memorable thing is the printed name in the
margin beside a hand-ruled line; everything else is quiet.

**The tell review.** (a) THE FORM TELL is real: `[label] | [field]` is the settings-form column,
and the pass-1 research banked the crop that reads as one at 1280. What separates a worksheet's
margin from a form's label column, stated so the prototype can be judged against it: the name is
display type at φ and 800 (a form label is body weight, small); the rule runs the FULL width under
both columns (a form's rule, if any, is under the field); the name and the first chip share a
BASELINE (a form label is vertically centred against its field); the field is left-aligned to a
margin, not right-aligned to a label. If the crop still reads as a form to a fresh reader, that
reading goes to the owner (U-10), not into the spec. (b) The gallery already ships this geometry
at 1.00 label:chip (StagingBand): prior art for the GEOMETRY, refused for the VOICE—the RATIO is
the law (≥1.23), the RUNG is the surface's, which is StagingBand.vue:303-306's own comment turned
around. The two read as cousins, not twins, on purpose. (c) Broadsheet hairlines: the rule is
`wobbleLine` at σ≈1.05 inside the grid's band, never a CSS hairline; one column; zero radius only
on drawn things. (d) Motion: the rules draw on once at mount; nothing else moves unbidden. (e)
One revision from review: my first plan kept `level`'s crayon ink on the name (pass 1's "data
inside one voice"). The critic measured THREE inks in the build; one ink is the review's cut, the
crayon lives on the chosen chip where it is data.

---

## 1 · Tokens the family re-points

```css
/* GameControlPanel.vue — the page */
.control-panel-wrap { --rp-margin: 7.6rem; }                /* 121.6px ≥ 'checking' 121.47 @ φ */
@media (max-width: 374.98px) { .control-panel-wrap { --rp-margin: 6.4rem; } } /* 320–374: the
   margin holds 'checking' at √φ (95.5px); the NAME drops one rung on the narrowest cells only,
   declared (ratio 1.0175 there: the 1.23 law is asserted at ≥375, and the 320 cell is reported
   beside it, not claimed) */

/* typography.css */
/* :149-153 the 768–1023 arm of --type-option: 1.375rem → 1.25rem. ONE chip number. */
/* :124, :135, :366-382 UNTOUCHED: the card's names take their own class `.rp-name` reading
   --type-heading directly, so `.section-heading` and `--type-group-title` become StagingBand's
   alone and the gallery is Δ 0.00 by construction. */

/* OptionSelector.vue:52 — chips in the CARD only */
.controls-card .ctrl-btn { padding-inline: 0.5rem; }         /* px-3 → 8px; the gallery keeps its
                                                                0.65rem override (pi) */
```

Stroke ladder: case **3** · destructive act face **2.5** · act box **2** · the rule **1.8 or 2.0**
(§2.2 picks by measurement, never thinner than 1.8). Radii: 0 on drawn things; 0.5rem on invisible
hit boxes.

---

## 2 · Components and states

### 2.1 The name (seven) — `<h2 class="rp-name">`

| property | value |
|---|---|
| element | `<h2 class="rp-name">` in the margin cell; the row is `<section role="group" aria-labelledby>` |
| face · size · weight · transform | Fraunces · `--type-heading` 25.888 · 800 · lowercase (CSS) |
| leading | 1.2 (31.06px line; two lines = 62.13 inside a ≥70.59 group: free) |
| ink | `--color-muted-foreground`, all seven; `level`'s crayon leaves the name |
| wrap | `overflow-wrap: normal` — wraps at spaces only; the margin is the longest word |
| align | `align-self: start`; first baseline shared with the field's first chip (`align-items: first baseline` on the row) |
| position | static. NOTHING in the card is sticky |

Names: `size · level · new game · marks · what fits · checking · players`. `pencils` dies (a name
over two names). `new game` names the deal group.

### 2.2 The rule — one static path per group, seeds PINNED

`wobbleLine(0, h/2, W, h/2, { roughness: 0.4, segments: 8, seed })` from `@mkbabb/pencil-boil`
(`path.d.ts:38`), one `<path>` in an inline `<svg class="rp-rule">` spanning BOTH columns,
`pathLength="1"`, `pencil-draw-on`, `stroke: var(--ink-press-rule)`. Two rows the critique
opened, answered without re-wording either gate:

- **σ per rule inside [0.722, 2.886].** Two of pass 1's eight seeds read 0.549/0.555. The cure is
  to PICK SEEDS: the prototype sweeps seeds 1–64 at chord 284.67 and pins seven whose σ lies in
  the band with ≥0.1 of headroom each side, as a `RP_SEEDS` constant with the sweep banked. The
  per-rule gate stands as written.
- **Painted worst-sample ≥ 3.0:1 in light.** Pass 1 read medians 3.53 and worst columns 2.451
  at 1.6px/55%. The prototype sweeps stroke 1.8 / 2.0 at the token's 55% (the token is
  `check-ink-pressure`'s ramp and is NOT moved for one consumer) and ships the THINNEST that
  clears the worst column in light, both engines, on the pinned seeds. The gate stands as
  written; if 2.0 does not clear it either, the rule takes `--color-muted-foreground` (4.66) and
  the record says the 55% ramp cannot draw a 1-ish px line to 3:1 — a finding for the chair.

The incumbent hairline (`.staged-section + .staged-section`), every `.tray-well` frame and the
mobile tab row die. `BoilDivider` ×1 stays (the peek hold surface). Filter census 9, `url()` 24.

### 2.3 The field — `.rp-field`, wraps by law

`display: flex; flex-wrap: wrap; gap: 0.45rem; justify-content: flex-start`. THE FIELD WRAPS WHEN
IT MUST is a property of every field, not a marks exception: at 390 with 8px chip padding only
`marks` wraps (305.22 > 244.53), `level` clears by +14.13, the rest fit. Cost +27.00 on the card
(the row's own padding absorbs 24 of the 51.19). StagingBand's `nowrap` is that surface's
measuring discipline and is not borrowed; the card's is stated here so a critic reads it as a
law and not a leak. Chips: Fira 20, the seeded scribble under the chosen, the seeded ghost on hover.

### 2.4 The button system (pass 1 §2.4 stands)

ACT boxed (`deal · clear · fill · solve · share · play together`) at pose-0 stroke 2, destructive
at 2.5, NO ground (§6.4; the 8% face dies here and in the gallery ribbon, one commit). WORD bare
(`undo · redo · hint · peek · leave · i`). CHIP. Focus: `--ring-ink` 2px solid offset 4 on
`.controls-card :is(button, [tabindex="0"]):focus-visible` — all 21 desk / 19 dock controls,
including every chip and the `i` whisper. The dock ring is `authored declaration + painted bytes
at the desk`; the rig cannot read a coarse `:focus-visible` and the gate says so.

### 2.5 The tabs die (§8) — unchanged from pass 1

### 2.6 The bar — the case's foot (graft 1; W2 layout row)

`#card-foot` outside the scrollport, the cap less `--card-foot-h` in both regimes, one drawn top
rule (this family's own generator, seed pinned, the same stroke as §2.2). `padding-bottom: 3.5rem`
KEPT (the note berth). `--action-bar-h`, the sticky key at GCP:2173, the skirt,
`scroll-padding-bottom` and `[data-under-bar]` (selector + writer) retire together;
`check-theme-selectors` exit 0. `scroll-padding-top: 2.4rem` stays (W2's; harmless; nothing pins).
2.4.11 is answered structurally: no sticky or fixed surface remains inside the port, so no focus
can land under one.

### 2.7 The confirm (§15) — the ribbon in the foot's row

While a destructive verb is armed the foot's row holds the house's one confirm in its floor form:
`clear the board?` · `keep` (bare, foreground 19.45:1) · `clear` (boxed 2.5, `--color-red-ink` on
BARE card 4.99 / 6.30). Three channels (the sentence names the act; one verb is drawn, one is
not; one is red), the CTRL-TABS pass-2 proof that no mix percentage can make a ground a cue. Both
verbs ≥ 44×44 both dimensions (`min-inline-size` AND `min-height` from `--tap-floor`; the negative
control is `zone-grammar.spec.ts:495-507`'s shape, grafted). `keep` restores focus to the armed
verb. `GameGallery.vue:1035-1060`'s ribbon reads the same face. One mechanism for deal · clear ·
fill · solve; W1 §1.5 owns the arming; the fine-pointer desk ASKS too (M12 is pointer-agnostic).
r0 L5 (greps `guard-btn guard-keep` + HandDrawnOutline) and R3 are MOVED (§5).

### 2.8 The quick set (§14) — graft 8

The shipped `undo · redo · hint` row teleported to the tongue's flank in landscape; portrait
refused on the measured 274px edge. No other set is built (registry §3.8).

### 2.9 The seam — CONSUMED, not minted

`--sheet-chrome: max(12rem, calc(var(--masthead-foot) + 8px - var(--case-offset)))` in both
arms, no fallback, publisher on the wordmark: CTRL-TAPE's pass-2 §1.5 / W2 §2.5's row. This
family's own `--masthead-foot` / `--card-foot-h` / `--rp-head-h` fallbacks (the 430 RED was its
own mint masking its own missing publisher) DIE; `--rp-head-h` dies with the head.

---

## 3 · Copy (M16; lowercase by CSS)

| site | string |
|---|---|
| names | `size · level · new game · marks · what fits · checking · players` |
| confirm | `clear the board?` · `start a new board?` · `fill in the sure cells?` · `fill in the whole board?` — `keep` and the verb |
| quick set | `undo · redo` (shipped) |

`players` needs Fraunces `p`: index.css:66-75 `U+006B-006F` → `U+006B-0070` and the woff2 re-cut
per the P5 recipe (instancer SOFT=0 WONK=1, pyftsubset; ≈ +488 B, the byte figure banked with the
commit). Renaming the band to dodge a glyph is refused (the circularity the chair struck).
`candidates` → `what fits` strikes its ADMITTED row; `zone-grammar.spec.ts:64-68`/`:82-85` are
MOVED rows re-cut in the same commit.

---

## 4 · Motion

| verb | what | duration | curve | home |
|---|---|---|---|---|
| draw on | seven rules + the foot's rule at mount, once | 260ms, delay (seed % 7) × 22ms | `--ease-drawOn` | `MOTION.ruleDrawMs: 260` |
| ink lift | muted → foreground on hover | 150ms | `--ease-standard` | `MOTION.inkLiftMs: 150` |
| ribbon | the confirm into the foot's row | 240ms | `--ease-glassGlide` | `MOTION.ribbonMs: 240` |
| confirm window | disarm timer | 2500ms | — | `MOTION.confirmWindowMs: 2500` (the section's one number) |

PRM: draw-on to `--draw-opacity`; the ribbon appears in place. Nothing pins, nothing releases.

---

## 5 · Plan — files, order, what dies

Replay `wf_e58b4764-0fc-38`'s diff into a fresh worktree, then REMOVE arm (a)'s head machinery
(`.head-pin`, the release box + spacer, `--rp-head-h`, `scroll-margin-top`) before building:

1. `GameControlPanel.vue` — the seven rows as `[h2.rp-name] [rp-field]` grids; `--rp-margin`;
   `.rp-rule` with `RP_SEEDS`; DELETE the tabs, the hairline, the well frames, `.info-glyph`'s
   border, the `.icon-btn:hover` ground, the sticky key + `--action-bar-h` publisher; the
   `data-under-bar` writer; the ring rule; the confirm's floor form.
2. `OptionSelector.vue` — `.controls-card .ctrl-btn { padding-inline: 0.5rem }` scoped.
3. `GameScene.vue` / `scene.css` — `#card-foot` (graft 1); cap less `--card-foot-h` both regimes;
   `scroll-padding-bottom` retired; `padding-bottom: 3.5rem` KEPT; `--sheet-chrome` consumed
   from W2 §2.5's row (TAPE's publisher).
4. `SheetWashiLabel.vue:190` — `[data-under-bar]` rule DELETED with its writer.
5. `GameGallery.vue:1459` — `.guard-leave .guard-face` loses the 8% ground; the two ribbons stay
   one face.
6. `typography.css` — the 22px arm → 20 ONLY. `index.css` — the Fraunces range `U+006B-0070` +
   the re-cut woff2.
7. `pencilConfig.ts` — `ruleDrawMs`, `inkLiftMs`, `ribbonMs`, `confirmWindowMs`.
8. `GameControlPanel.test.ts:264-444` — the seven rows re-cut to the ruled grammar; the 22 e2e
   hits across six specs (zone-grammar 12, viewport-law 4, font-census 2, access 2,
   join-language 1, `share-truth.spec.ts:54`) re-aimed; `check-copy-register` /
   `check-font-coverage` (`ruledGroupNames` extractor kept) ledgers.
9. Instruments as PROPOSED DIFFS under `pass2/prototype/CTRL-RULE/instruments/`: the occlusion
   predicate (`research/CTRL-RULE/instruments/occlusion-and-ring.mjs`) scoped to EVERY
   sticky/fixed surface in the card with the `pin.contains(ctl)` guard, born-RED at HEAD (the bar
   takes `play` 100% at dock scrollTop 0; `Ask` 100% at desk 350); r0 `law-probe.mjs` R3 and L5
   copies re-aimed (MOVED); a per-rule σ row and a worst-column contrast row.

Dies: the compartments; the tape as a NAME (the tape keeps the hover explications, the `center`
tape, the foot's note); the hairline; the tabs; `pencils`; the head and every pin; the 8% ground;
the info ring; the accent hover fill; this family's three masked fallbacks. Stays: every W2
mechanic; `BoilDivider` ×1; the note berth; filterBudget 9.

---

## 6 · Prototype brief

Build steps 1–9 in the fresh worktree; server `127.0.0.1:4231 --strictPort` (next free if held)
with a private `cacheDir`; scratch Playwright config; both engines; settle ≥700ms; the goldens and
`filter-census` off `npx vite build` in the worktree, previewed on a lane port,
`PLAYWRIGHT_BASE_URL` set.

**Crops (≤4):** (1) 390×844 dark, sheet up: seven margin names on hand-ruled lines, `marks`
wrapped, the boxed `deal`, the foot below the card's end — beside Frame B; (2) 1280×800 light rail
at scrollTop 0.5 — nothing pinned, the name of the group under the eye in its margin, beside
pass 1's `armb-margin-column-1280.png` (the form-tell control); (3) 390×844 the ribbon in the
foot's row, `keep` bare and `clear` boxed in red on bare card; (4) 320×568 — the narrowest cell
with `--rp-margin` at its short arm, reported not claimed.

**Censuses:** R1 `heading-voice.spec.ts` (+900×500); R7 I2 (clipped coverage) / I3 (VACUOUS here—
nothing pins—labelled so, not claimed) / I4; `access.spec.ts` 2.1/2.2/2.3; R3's wobble method on
the seven rules (σ per rule); R6 `law-probe` COPY (L1 = 9, L5 + R3 re-aimed); hue census COPY
(29 rows); the gallery pi census at 390 AND 1280 (`.staging-axis-label` glyph x 17.59/396.00,
font 14/16, padding 0/12 — five readings Δ 0.00); the occlusion predicate at 5 states × 3 cells ×
2 engines; the ring census (21 desk ringed / 21; dock reported as authored); the tap-floor gate
with the estate's own negative control (zone-grammar :426-515 shape); the unit battery and the
six e2e specs BARE; `check-theme-selectors`, `check-copy-register`, `check-font-coverage` BARE.

**Success:** voices 1; headings 7/7; ratio 1.2945 at ≥375 (320 reported); σ per rule ∈ [0.722,
2.886] on `RP_SEEDS`; worst painted column ≥ 3.0:1 light both engines at the shipped stroke;
occlusion 0 at every state, every sticky surface (there are none in the port; the foot is outside);
bar coverage 0.00; `level` at 2 taps; dock 390×844 scrollHeight ≤ 740 (HEAD 699 + 27 wrap + the
rules' 7×~10 − the tabs' death − the wells' padding; the prototype reports the ledger at four
cells against HEAD's 699/628 · 1142/608 · 743/284 — never against arm (a)'s 999); ring ≥ 3:1 on
bare card both themes at the desk (expect 3.67 / 4.70) on ALL 21; ribbon verbs ≥ 44×44 with the
firing control; seam ≥ 8px at 375/390/430/844×390; gallery Δ 0.00 ×5; filter 9; goldens 4/4;
`check-font-coverage` exit 0 with the `p` re-cut's byte delta banked; M16 0 unadmitted.

---

## 7 · The height ledger (paid in the open, against HEAD)

| arm (b) at 390×844 | px |
|---|---|
| HEAD scrollHeight | 699 (port 628) |
| the names ride their rows (0 per group) | 0 |
| seven rules at ~1.8px + 0.3rem margins each | +~50 |
| the `marks` wrap | +27 |
| the tabs die: `level`'s three chips laid down | +44 |
| the four well frames + paddings die | −~90 (pass 1 measured 122 incl. hairline) |
| the deal group inline (die + sublabel + tally on one row) | −~80 |
| the bar leaves the port (cap less `--card-foot-h`; the port shrinks by the foot) | 0 on scrollHeight; −67 on the port |
| **target** | **≤ 740 in a ~561 port; reported, four cells** |

---

## 8 · Gates the family lands with

Born-RED at HEAD: R1 ROW 1/2/3 at four cells + 900×500 (3 voices → 1; 2/6 headings → 7/7;
1.0175 dock → 1.2945); the OCCLUSION PREDICATE scoped to every sticky/fixed surface with the
self-containment guard (HEAD: `play` 100% at dock 0, `Ask` 100% at desk 350, `Hard` 13%) → 0;
the rule's σ per rule (a CSS hairline is σ 0) and its worst-column ≥ 3.0 row; `level` reachable
in 2 taps (3 today); the ribbon's verbs ≥ 44 per dimension with a FIRING negative control (the
gallery's `keep` 39×44 today); the ring on ALL 21 desk controls ≥ 3:1 (14 unringed at 2.147 in
WebKit today); the destructive answer's word ≥ 4.5:1 light on BARE card (the ribbon's 8% face
reads 4.20 today); the bar's coverage 0.00 (0.874 dock today); the seam ≥ 8px in both arms; the
`p` glyph (`check-font-coverage` RED on `players` today); I4 reported RED until W1 §1.5.
Guards (GREEN at HEAD, must hold): filter 9 exact; `FILTER_BUDGET_UNION_AREA` ±2%; goldens 4/4;
the gallery's five readings Δ 0.00 at 390 and 1280; masthead-to-board gap; no `[role=dialog]` in
the card; `check-theme-selectors` exit 0; M16 0 unadmitted; M01's 20px chip at 390 coarse (a row
that NAMES M01, so a lane that shaves the chip reds).
