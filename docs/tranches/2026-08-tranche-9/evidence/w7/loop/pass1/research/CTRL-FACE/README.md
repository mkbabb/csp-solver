# CTRL-FACE — pass 1 (RESEARCH) · printed and written

One semantic law for the two faces: **Fraunces is what the sheet came PRINTED with, Patrick
Hand is what a PENCIL put there**. §10 with §1 §2 §8 inside it; marks M01 M03 M05. Zero
geometry is the claim, and this lane's job was to test it.

Everything below was measured on THIS tree (HEAD `7b0610cc` + the working tree's uncommitted
W3/W6/W7 evidence) on 2026-09-17, chromium and webkit, light and dark, at five cells. No product
file was written. The prototype is an injected stylesheet served by a proxy in front of the
lane's own dev server on `127.0.0.1:4234`; the estate's default Playwright config was never
invoked.

**Verdict: ADJUST.** The face law greens the §1 instrument's two rows it owns, at every cell, in
both engines, and it does it without a single number moving — but four of its own premises are
false on this tree, and two of them are load-bearing. Details in §9.

---

## 1. Substrate, verified (file:line)

| the charter said | what is actually there |
|---|---|
| `typography.css:98-100` — W2's "THE NUMBERS ARE W7'S … W7 re-cuts them HERE" | **CONFIRMED** at `src/assets/typography.css:97-99`. |
| `:106-170` the role tokens + "the two `@utility` families for the faces" | **HALF TRUE.** The role tokens are at `typography.css:119-125` (`--type-act/verb/tool/tag/group-title`), the heading's md arm at `:133-137`, `--type-option`'s three width arms at `:145-168`. There is **no `@utility` family for either face**: the registers at `:177-338` are `text-display-*` (`--font-display`), `text-title/heading/…` (`--font-text`) and `text-mono-*` (`--font-mono`). The comment at `:250` still says "the text register (--font-text ← Fraunces)" and `index.css:129-131` has dropped Fraunces from `--font-text` — that header is stale. |
| the seam makes the voice "one right-hand side per role" | **FALSE for the FACE.** The role tokens carry SIZE only. Face is set per site: `GameControlPanel.vue:1611,1660,1780,1796,2011,2035,2329,2405` (`var(--font-hand)`), `:1437,2375` (`var(--font-display)`), `typography.css:366-374` (`.section-heading`) — and one hardcoded literal, **`OptionSelector.vue:105` `font-family: "Fira Code", monospace`**, unreachable from any token. A face law needs a `--face-printed` / `--face-written` seam that does not exist yet. |
| `index.css:15` + P1-W3 ruling B2, Patrick Hand's capitals are {C,R,S} | **CONFIRMED** from the file's own cmap: `index.css:89-97`, and the cut read directly at `readings/subset-price.txt`. |
| `GameControlPanel.vue:826, :789` the two Fraunces `<h2>`s | `:826` (desk `<h2>`) **CONFIRMED**; the dock's head is `:795-807` (`button.mobile-heading-btn > span.section-heading`), wrapped by the `<h2>` at `:789`. |
| `:2414-2418` the tab head's underline | **CONFIRMED**, `.mobile-heading-btn .section-heading.is-active { text-decoration: underline; 2px; offset 4px }`. |
| `OptionSelector.vue:123-126, :62-73` the seeded scribble | `:62-73` **CONFIRMED** (the two data-URI scribbles); the `.selected-item` background rule is at **`:123-126`** — correct. |
| `OptionSelector.vue:188-191` the tier tint on `level` | **WRONG FILE.** It is `GameControlPanel.vue:185-191` (`activeColorClass` → `headingClass`); `OptionSelector.vue` is 160 lines long. |
| `SheetWashiLabel.vue:164-181` the sticky tag | **CONFIRMED** (`:164-181` is the `.washi-tag` rule, its margin arithmetic at `:171-174`; the pull/give-back covenant and its "net flow height is zero" clause are at `:145-163`). |
| the masthead is Fraunces 800 lowercase at the wordmark's size | **CONFIRMED and measured: 52px at every cell** (`readings/full/*.json` `masthead.wordmarkPx`), box 382×112 at the desk, 243×71 at the dock. |

---

## 2. The prototype

`proto/` holds six sheets; `probe/inject-proxy.mjs` splices any comma-separated list of them into
the served HTML.

| sheet | what it is |
|---|---|
| `core-face-law.css` | the law: names + act verbs → printed, option values → written, the tab head's underline retired |
| `ratio-title-up.css` | §1's ratio by raising the NUMERATOR — `--type-group-title: var(--type-heading)` at every width |
| `ratio-option-down.css` | §1's ratio by lowering the DENOMINATOR — `--type-option: 0.98275rem` (15.72px) under 768 |
| `acts-stay-written.css` | the narrow law: the printed face marks the eight NOUNS and nothing else |
| `printed-weight-light.css` | the shouting mitigation at weight 500 |
| `tape-future-in-flow.css` | the tape's futures 1 and 3, as a flow cost |
| `bar-edge-css-probe.css` | I2's chrome half as a CSS border — a measurement, **not** the cure (R6 law 37) |

**The delivery seam is itself a finding.** `heading-voice.spec.ts` injects nothing and exposes
only `PLAYWRIGHT_BASE_URL`, so the overlay is SERVED, not injected, and the instrument runs
byte-identical (`md5 9f3f07e2de9aa25a22dbfb259225e32a`, verified against r0's copy). The first
run failed for a reason worth banking: Vite's dev server appends every component's CSS to
`document.head` at module-eval time, so a `<style>` spliced into the served HTML sits EARLIER in
the document and loses every specificity TIE. `font-weight` and `text-transform` landed;
`font-family` and `font-size` did not, because `.zone-row-label[data-v-…]` (0,2,0) ties
`.controls-card .zone-row-label` (0,2,0). The proxy now re-appends the overlay on every head
mutation, so the prototype wins on document order and never on `!important` — which would have
hidden exactly this class of collision from the spec that follows.

---

## 3. THE STYLESHEET — R1's instrument, unchanged, at four cells

`probe/heading-voice.spec.ts` is r0's file verbatim. Both engines, desk-1280×800 and dock-390×844.

| arm | ROW 1 · one voice | ROW 2 · one rank | ROW 3 · the name outranks |
|---|---|---|---|
| **control** (r0's born-RED, reproduced) | **RED** — 3 voices | RED — 2 of 8 | desk 1.2945 GREEN · dock **1.0175 RED** |
| **A** face law only | **GREEN — 1 voice, both cells** | RED — 2 of 8 | desk GREEN · dock **1.0175 RED** |
| **B** + title up | **GREEN** | RED — 2 of 8 | **GREEN both cells (1.2945)** |
| **C** + option down | **GREEN** | RED — 2 of 8 | **GREEN both cells (1.2945)** |
| **B-light500** | **GREEN** | RED — 2 of 8 | **GREEN both cells** |
| **D** names printed, acts written, title up | **GREEN** | RED — 2 of 8 | **GREEN both cells** |

Runs at `readings/heading-voice-*.txt`.

**What the sheet cannot do.** ROW 2 is `docHeadings === names.length`, and six of the eight names
are `<span>`s reached only through `aria-labelledby` (`SheetWashiLabel` tag anchor ×4,
`.zone-row-label` ×2). No stylesheet mints an `<h3>`. That half is W3's and this family does not
touch it — it stays RED under every arm, which is the honest reading and not a failure of the
face law.

**Arm A is the family's real claim and it holds**: the FACE alone takes three voices to one
without moving a single number, at both cells, in both engines.

---

## 4. THE RATIO — and why "it costs nothing" is false

`--type-group-title` = 20.352px (<768) / 25.888px (≥768); `--type-option` = 20 / 22 / 20 by width
arm. The measured ratios, all arms, `readings/face-census-summary.json`:

| cell | control | arm B (title up) | arm C (option down) |
|---|---|---|---|
| desk 1280×800 | 1.2945 | 1.2945 | 1.2945 |
| dock 390×844 | **1.0175** | **1.2945** | **1.2945** |
| rail 1440×900 | 1.2945 | 1.2945 | 1.2945 |
| **landscape 900×500** | **1.1768** | **1.1768** | **1.1768** |

**The 900×500 cell fails the family's own floor under every arm.** `--type-option` is 22px in the
768–1023 band and `--type-group-title` is 25.888px there, so the ratio is 1.1768 — below the
instrument's 1.23 and far below 1.294. `heading-voice.spec.ts` only runs desk and dock, so it
never sees it. A third right-hand side is required: either the 768–1023 option arm drops to
≤ 21.05px (1.23) / 20.0px (1.294), or the title rises to ≥ 27.06px there.

**What M01 loses on arm C.** The phone chip goes **20.00 → 15.72px**, which undoes W2 §2.6's own
lift (16 → 20px, the mark's cure) and lands **0.28px BELOW the 16px the phone shipped before the
owner wrote M01**. The W2 comment at `typography.css:97-99` calls ≥14px "the mechanism's floor",
so 15.72 clears the floor and violates the mark. Arm C is the arm the family's idea names and it
is the arm that should die.

**Arm B costs nothing in type and something in ink**: the dock's title rises 20.35 → 25.888px
(+27%) — which is M03's verbatim ask ("the section titles need to be larger") satisfied by
arithmetic — and leaves M01's chip untouched at 20px.

---

## 5. THE FONT — the cut, priced from the files

`document.fonts.check()` is not a coverage oracle: it answered "nothing missing" for every
string in both faces, including `p` against a Fraunces cut whose `unicode-range` has no U+0070.
So the price comes from the woff2 cmaps, read directly (`probe/subset-price.mjs`,
`readings/subset-price.txt`), and the fallback is proved by ADVANCE (`probe/ransom.mjs`).

**The cut today:** Fraunces 14,636 B / 30 codepoints (` `, `B C D L M N S`, `a–i`, `k–o`, `r–w`,
`y z`) · Patrick Hand 4,312 B / 46 codepoints (static) · Fira Code 3,624 B / 22 codepoints.

| register under the law | codepoints needed | MISSING |
|---|---|---|
| the eight group names, rendered lowercase | 20 | **1 — `p` (U+0070)** |
| the eight group names, authored | 22 | 1 — `p` |
| the ten act verbs, rendered lowercase | 18 | 1 — `p` |
| the ten act verbs, AUTHORED (the gate's both-cases rule) | 22 | **6 — F H P R U p** |
| the act transients (`sure?` `copied!` `couldn't copy`) | 17 | **4 — `!` `'` `?` `p`** |
| every option value in Patrick Hand, AUTHORED | 31 | **7 — A E H L M N O** |
| every option value, rendered lowercase | 25 | **0** |

**The ransom note is real and measured.** At 25.888px/800, `p` advances **17.022px** under
`"Fraunces", Georgia, serif` and **17.022px** under `Georgia, serif` — identical to three
decimals, both engines — while every other letter of "pencils" differs (`e` 14.137 vs 14.798, `n`
17.193 vs 17.856, `i` 8.721 vs 9.149). The `p` in **pencils** and **players** paints Georgia at
weight 800, i.e. synthetic bold on a fallback serif mid-word: the exact P1-W3 defect the coverage
gate exists to prevent.

**And the gate cannot see it.** `scripts/check-font-coverage.mjs` binds a face to a corpus group
by a hardcoded `where` label (`:165`, `:178`, `:204`, `:224`, `:235`); every `derive` extractor
(`:94-129`) reads an AUTHORED construct — `heading:` in the spec files, `name:`/`label:` in
`cards.ts`, static `text=` on `<SheetWashiLabel>`, the text of a `.zone-row-label` — and **not one
of them knows which face a selector renders in**. The only `font-family` the script reads is the
`@font-face` block, for the unicode-range (`:385`). Run at HEAD with the overlay live it reports
`font coverage OK` (`readings/font-coverage-HEAD.txt`). A face re-point is therefore invisible to
the gate, which is the T8 ransom-note trap re-armed in the other direction. **Any cure must land
the corpus change in the same commit as the CSS**, and the corpus must grow a face-per-selector
assertion or the next re-point is invisible again.

**The bytes, measured not estimated.** `pyftsubset` round-trips the shipped Fraunces file
byte-for-byte (14,636 → 14,636 B), so the recipe is reproducible and leave-one-out gives the true
marginal cost of a glyph in this file: **160–712 B, mean 481 B**, and for `p`'s bowl-and-stem
relatives (`b` 416, `d` 460, `o` 380) **mean 419 B**.

| the law asks for | Fraunces delta | new total |
|---|---|---|
| the eight names only (+`p`) | **≈ +420 B (+2.9%)** | ~15.1 KB |
| + the act verbs' authored capitals (F H P R U) | ≈ +2.4 KB (+16%) | ~17.0 KB |
| + the act transients (`!` `'` `?`) | ≈ +1.4 KB more | ~18.4 KB |

Patrick Hand's marginal capital is **≈ 79 B** (C 72, R 72, S 92), so the seven capitals the option
values need if they are NOT lowercased cost **≈ +551 B (+12.8%)**, 4,312 → ~4,863 B. Lowercasing
them costs zero bytes and is R6 law 29's own path.

**THE SHOUTING MITIGATION IS FREE, and the charter's price for it is wrong.** `fraunces-subset.woff2`
is a LIVE variable font: `fvar` declares `opsz 9..144` and **`wght 100..900`**, with `gvar`
(14,664 B uncompressed) and `avar`/`HVAR`/`STAT` already paid for. Measured in both engines, the
advance of "level" at 20px walks **100 → 40.953 · 300 → 42.299 · 500 → 44.318 · 700 → 46.337 ·
800 → 47.010 · 900 → 47.683** — monotonic, identical chromium and webkit. A lighter printed rank
is **one number and zero bytes**; it is not a second subset. (Arm `B-light500` narrows the tape
6.75px and changes nothing else.)

Also worth banking: `.washi-tag`'s `font-weight: 500` (`SheetWashiLabel.vue:176`) asks a STATIC
400-only face for a weight it does not have, so two of R1's "three voices" — Patrick Hand 500 and
Patrick Hand 400 — paint the same ink. The census's three voices are three by computed style and
two-and-a-half by paint.

---

## 6. THE TAPE — the research variable, answered

The three futures, measured (`readings/face-census-summary.json`, dock-390×844, both engines
agree to the hundredth):

| future | net flow height per tape | card scrollHeight @ dock | second literal? | still reads as a name? |
|---|---|---|---|---|
| today | **+1.61px** | 699 | — | yes (14px hand on tape) |
| **2 — the printed name set ON the tape** | **−4.04px** | **646 (−53)** | **no** | yes, and at rank |
| **1 — tape as decoration beside a printed name** | **+31.06px** | **806 (+107)** | only if the `aria-labelledby` id does not move with the name | yes |
| **3 — tape retired to hover/center** | **+31.06px** | **806 (+107)** | same | yes |

Futures 1 and 3 have ONE flow cost because they are the same move — the name enters the flow as a
bare printed word and the tape either survives beside it as ornament or does not. That cost is
**+29.45px per well, ×4 wells**, on a card that is already 534px past its fold at the desk and
459px at 900×500: measured, the desk card goes 1142 → 1302 and 900×500 goes 743 → 872.

**Future 2 is the only one that keeps the one-string law untouched** (the tape IS the
`aria-labelledby` target; nothing moves, nothing is minted) **and the only one that keeps the card
from growing.** It is the answer.

**But future 2 is not free either, and this is the family's first false premise.**
`SheetWashiLabel.vue:171-174`'s pull is `calc(-1.5em - 0.04rem - lift)` — em-relative, so it scales
with the font exactly as the file's comment at `:157-160` promises — while the give-back
`calc(lift - gap)` is NOT. So a type re-cut moves the tape's net flow contribution by **5.65px per
tape**, and the covenant the file will not spend (`visual-regression` test 10, **0.23px** of iPad
headroom) is exceeded 24-fold. And the tape's box goes **64.53×23.25 → 147.90×35.43** — 2.29× wider
— which at 390×844 **collides with the `size` tab head by 758.1px² (52.08 × 14.56)** in chromium
and 757.4px² in webkit, where the control overlaps by **0**. See
`frames/frameB-sheet-names-390x844-dark-afterD.png` against `…-before.png`.

---

## 7. THE MASTHEAD, THE UNDERLINE, THE BOX LAW, COMPOSABILITY

**The masthead.** The wordmark is 52px at every cell and the printed names are 25.888px, so the
ratio is **2.009** — the wordmark is exactly twice its own echo. Two things besides size keep it
the wordmark: it is not live text at all (`HandwrittenLogo` is a four-pose `wobble-logo` raster
stack, R6 §1.3) and it BOILS, while R6 law 13 forbids text from ever boiling. So the honest answer
to "size alone?" is **no — size 2.009× plus the only boiling word on the page.**

**But the count is the kill condition, and under the charter's own law the family fails it.**
Printed nodes visible on ONE screen, arm B, measured:

| cell | printed names | printed acts | total |
|---|---|---|---|
| desk 1280×800 | 5 | 5 | **10** |
| **dock 390×844, sheet up** | 8 | 10 | **18** |
| rail 1440×900 | 6 | 5 | **11** |
| landscape 900×500 | 3 | 1 | 4 |

Eighteen Fraunces-800 nodes on a 390×844 screen, in four sizes of one face (52 / 25.89 / 16 / 14),
is not a RANK — it is a typeface. `frames/masthead-vs-names-1280x800-light-afterD.png` shows the
flattening at the desk: "sudoku", "new game" and "size" are one voice a factor of two apart.

**Arm D is the defence and it works.** Drop the act verbs back to the hand, so the printed face
marks the eight NOUNS of the sheet and nothing else: the dock count falls **18 → 8**, the desk
**10 → 5**, the Fraunces re-cut falls from six glyphs to one, and the display face is never asked
for `!` `'` `?`. Arm D still greens ROW 1 and ROW 3 at all four cells (`readings/heading-voice-armD-names-only.txt`).

**The underline.** `.mobile-heading-btn .section-heading.is-active`'s `text-decoration` goes
`underline` → `none` at every mobile cell, both engines, and the option chip's seeded scribble is
untouched. **The defect it creates:** the underline was the tab row's ONLY explicit mark of which
tab is open. What remains is the presence/absence of the closed tab's value word
(`heading-value`, UI-12) and `aria-expanded`. The crop shows it: after the retirement, "size" and
"level" differ only by ink (muted vs the tier crayon, which is the SELECTED VALUE's colour and not
an openness signal) and by "easy" sitting under the shut one. A cure must give the open tab a mark
that is not a second underline grammar.

**The `level` tint.** Keep it. It is not a fourth axis in one voice — it is the SAME axis the
selected chip already writes in (`activeColorClass`, `GameControlPanel.vue:185-191`), so the
heading and its chosen value are one colour and the heading's tint is a readout, not decoration.
Measured it costs nothing in contrast: `.section-heading` reads **4.66:1 light / 7.68:1 dark** in
both control and arm.

**The box law.** Under "printed never boxed, written never boxed, only acts boxed" the census's
seven treatments sort: `.icon-btn` family (deal/clear/fill/solve/share/undo/redo/hint/invite) = ACTS,
boxed, radius 8px; `.info-glyph` = an act (it discloses), the estate's only drawn control border,
radius 50%; `.ctrl-btn` = WRITTEN, so its 6px radius and its box retire and it keeps the scribble;
`.mobile-heading-btn` = PRINTED, already radius 0 and borderless, unchanged; `.washi-tag` /
`.zone-row-label` = PRINTED, and the tape is paper rather than a box; `.peek-chip` = an act, boxed;
`.players-leave` = an act in text, unboxed today. The radii that remain: **8px (acts) and 50% (the
info glyph)** — five radii become two. **The bar** is R7 I2's chrome half: a drawn edge greens
`ownChrome` (measured: `border 1px` → `ownChrome=true`), but a CSS border violates R6 law 37 and
the lawful edge is `HandDrawnOutline :pose="0"`, which is a component change. **I2 as a whole is
not reachable from this family** — its second half is the bar's 88.9% burial of the players well,
which is geometry.

**Composability.** The same sheet ran at the shut dock, the open dock, the desk rail (1280 and
1440) and 900×500, both engines, light and dark: 140 rows in
`readings/face-census-summary.json`, no layout fact consumed anywhere — the sheet names
`.controls-card`, four selectors and three role tokens and asks nothing of a box. The one cell
that breaks is 900×500, and it breaks on the RATIO (§4), not on the law.

---

## 8. Instruments, before and after

| instrument | at HEAD (control) | under the face law | note |
|---|---|---|---|
| `heading-voice.spec.ts` ROW 1 | RED, 3 voices, 4/4 cells | **GREEN, 1 voice, 4/4 cells** | arm A onward |
| ROW 2 | RED, 2 of 8 | RED, 2 of 8 | W3's half; no stylesheet can move it |
| ROW 3 | dock 1.0175 RED | **GREEN 1.2945 both cells** | arms B/C/D |
| R7 **I1** (1440×900) | RED — `3 voices: 14.384\|Patrick Hand\|500 · 25.888\|Fraunces\|800 · 14.384\|Patrick Hand\|400` | **GREEN — `1 voices: 25.888px\|Fraunces\|800`** | r0's reading reproduced exactly |
| R7 **I2** chrome half | `ownChrome=false` | `ownChrome=false`; with the CSS-border probe **`true`** | the instrument responds; the cure is a component |
| R7 **I2** burial half | `worst group coverage 88.9% (players)` | **15.7%** (arm D) — still > 5% | an unintended, large geometry move |
| `check-font-coverage.mjs` | `font coverage OK`, exit 0 | **`font coverage OK`, exit 0 — and it is wrong** | the gate cannot see a face re-point (§5) |
| `access.spec.ts` 2.3 resolver | light min **4.66**, dark min **6.05** | light min **4.66**, dark min **7.68** | no row crosses 4.5 in either arm |
| the 44px tap floor | narrowest chip **48.02×44** (chromium) / 48.63×44 (webkit) | **44.00×44** both engines, both mobile cells | see below |
| live-filter nodes (relative control) | 24 | 24, every arm and cell | the family mints none; the budget's own census is `filterBudget.ts`'s 9 |

**The tap floor holds and the family spends all of its headroom.** `index.css:847-849` gives
`.ctrl-btn` `min-width: var(--tap-floor, 2.75rem)` under coarse. Patrick Hand's advance for
"normal" at 20px is **51.56px against Fira Code's 61.56px** — 16.2% narrower at the same
font-size (x-height is unchanged: 9.60 vs 9.20 by the "n" ascent, so the chips read the same
height and measure narrower). "off", "on" and "4×4" therefore fall from 48.02–60.00px onto the
floor at exactly **44.00×44.00**. Per-dimension negative control: the desk's chips read 130.52
wide × **38** tall, below 44 in height, under a fine pointer where the floor does not apply — the
same reading in control and every arm, so the probe can tell a floor that applies from one that
does not. **Nothing crosses; the margin goes to zero.**

**The seeded scribble degrades, and this is the family's second false premise.**
`OptionSelector.vue:74,81` sets `--scribble-width: ${label.length + 1}ch`. A `ch` is the advance of
"0", which is the same for every glyph in Fira Code and is not in Patrick Hand, so the mark's
length stops tracking the word:

| chip | content width → scribble width (control) | overrun | under the law | overrun |
|---|---|---|---|---|
| `9×9` | 36.00 → 48.01 | 1.334 | 24.48 → 35.84 | **1.464** |
| `Normal` | 72.02 → 84.01 | 1.166 | 51.56 → 62.72 | 1.216 |
| `Ask` | 36.02 → 48.01 | 1.333 | 23.84 → 35.84 | **1.503** |

The scribble under "ask" would run half the word's length past it. The cure is one line — derive
the width from the measured text, not from a character count — and it belongs in the same slice.

---

## 9. Kill conditions, met or cleared

1. **"Fraunces 800 at 14–20px reads as shouting; defend the count."** **MET on the full law** —
   18 printed nodes on one 390×844 screen in four sizes of one face. **CLEARED on arm D** — the
   printed face marks the eight group names and nothing else: 8 at the dock, 5 at the desk, one
   size, one rung. That is a rank.
2. **"A lighter weight is a second woff2 subset and its bytes are the price."** **REFUTED by the
   file.** `wght 100..900` is a live axis with `gvar` already shipped; the interpolation is
   measured in both engines. Zero bytes.
3. **"A data tint on a printed name."** **CLEARED.** The tint is the selected chip's own colour,
   not a fourth axis, and it measures 4.66:1 light / 7.68:1 dark. Keep it.
4. **"The tape's new job must not mint a second literal."** **CLEARED by future 2** and only by
   future 2; futures 1 and 3 either mint one or must carry the `aria-labelledby` id across, and
   both cost +107px of card height at the dock.
5. **"This family moves NO geometry."** **FALSE, three times, all measured.** The tape's box
   doubles and collides with the `size` tab head by **758px²** at 390; the tape's net flow
   contribution moves **5.65px** per tape against a 0.23px iPad covenant; the card's scrollHeight
   moves **699 → 646** at the dock, **743 → 711** at 900×500, and I2's burial reading moves
   **88.9% → 15.7%**. None of it is in the sheet — all of it is `em`-relative and `min-content`
   arithmetic downstream of a font-size the sheet does re-point.
6. **"§1 resolves without picking a number."** **TRUE for ROW 1, FALSE for ROW 3.** A ratio is a
   number; the face cannot green it. And the number that is picked has to be picked three times,
   because 900×500 is a third arm nobody has measured.

---

## 10. Recommendation — ADJUST

**DEVELOP the law, on arm D, with four amendments.** The centre is sound and it is the cheapest
thing in the wave: one semantic rule takes R1's born-RED ROW 1 from three voices to one at every
cell in both engines, and R7's I1 from RED to GREEN, with no number moved — that is a real result
and no other family in this wave gets it for a stylesheet. But the family as chartered overreaches
in four places and each has a measured price.

*One* — **the act verbs stay WRITTEN.** PRINTED is the sheet's eight NOUNS; WRITTEN is every value
and every verb, because a verb is something a hand does. This is the only defence of the rank that
survives its own count (18 → 8 on the dock), it drops the Fraunces re-cut from six glyphs to one
(≈ +420 B instead of ≈ +3.8 KB), and it never asks a display face for `sure?`.

*Two* — **the ratio rises, it never falls, and it is picked three times.** Arm C dies: 15.72px is
below the size the phone shipped before M01 was written. Arm B's single right-hand side
(`--type-group-title: var(--type-heading)`) greens the dock; the 768–1023 band needs its own
(option ≤ 20.0px, or the title ≥ 27.06px there) or the law is false at 900×500 and the instrument
never looks.

*Three* — **the font work lands in the same commit as the CSS, and the gate learns about faces.**
One glyph (`p`, ≈ 420 B by leave-one-out on the shipped file) and a corpus that binds a selector to
a face. Without the second half, `check-font-coverage.mjs` reports `OK` while `pencils` and
`players` paint their `p` in Georgia at weight 800 — proved here by advance, both engines.

*Four* — **the family must carry its three geometry consequences, because they are its own.** The
tape's give-back goes em-relative (`SheetWashiLabel.vue:171-174`), the tape at 25.888px must not
straddle the tab-head row (758px² today), and `--scribble-width` derives from measured text rather
than a `ch` count. None is a layout redesign; each is one declaration, and each is invisible until
someone re-points a font-size — which is precisely what this family is for.

What this family should NOT claim: ROW 2 (W3's), I2's burial half (geometry), and the bar's drawn
edge (a `HandDrawnOutline :pose="0"` component change, not a token). U-10: nothing here closes.

---

## 11. Sketches

**A · the law, as a seam the tree does not have yet.** Today the size indirection exists and the
face indirection does not; the law is the second column.

```
  SITE                      SIZE (exists, W2 §2.6)         FACE (does not exist)
  ------------------------  -----------------------------  --------------------------
  .section-heading      ──> --type-group-title ──> rung    var(--font-display)   <┐
  .washi-tag (tag)      ──> --type-tag         ──> rung    var(--font-hand)       │ 8 sites,
  .zone-row-label       ──> --type-tag         ──> rung    var(--font-hand)       │ 3 answers
  .ctrl-btn             ──> --type-option      ──> literal "Fira Code" HARDCODED <┘

  THE LAW                                        ┌─ --face-printed : Fraunces ── the sheet's
  .section-heading  ─┐                           │                               eight NOUNS
  .washi-tag (tag)   ├─ --type-group-title ──────┤
  .zone-row-label   ─┘                           │
  .ctrl-btn         ─┐                           └─ --face-written : Patrick Hand ── every
  .icon-sublabel     ├─ --type-option/verb/act ─────────────────────────  value and verb
  .heading-value    ─┘
```

**B · arm D at the dock, and the three things the sheet moves that it did not mean to.**

```
   390 × 844, sheet up                              measured, both engines
  ┌────────────────────────────────────────┐
  │ ░░new game░░                           │ ◄── tape 64.5×23.3 → 147.9×35.4 (2.29× wider)
  │ ▒▒▒▒▒▒▒▒                               │     and it now overlaps the head below by
  │   size              level              │ ◄── 758.1 px²  (control: 0)
  │                     easy               │
  │      4×4    9×9    16×16               │ ◄── chips 16.2% narrower in the hand face;
  │             ‿‿‿                        │     "off"/"on" land on the 44px floor exactly
  │             └── scribble runs 1.46× the │     (48.02 → 44.00, zero headroom left)
  │                 word it underlines      │
  ├────────────────────────────────────────┤
  │  ⊙ deal            dealt |||            │
  └────────────────────────────────────────┘
      card scrollHeight 699 → 646 px        ◄── the tape's give-back is not em-relative,
      net flow per tape +1.61 → −4.04 px        so a type re-cut moves flow by 5.65 px
                                                against a 0.23 px iPad covenant
```

**C · the rank, counted. The left column is the charter's law; the right is arm D.**

```
  FULL LAW (names + acts printed)          NARROW LAW (names printed, acts written)
  dock 390×844, sheet up                   dock 390×844, sheet up

  52px  sudoku            ← wordmark       52px  sudoku            ← wordmark
  25.9  new game                           25.9  new game
  25.9  size  level                        25.9  size  level
  25.9  pencils  marks  candidates          25.9  pencils  marks  candidates
  25.9  checking  players                  25.9  checking  players
  16    deal  peek                         ────────────────────────────────────
  14    clear fill solve share             (the verbs stay in the hand)
  14    undo redo hint play
  ─────────────────────────                 8 printed nodes · ONE size · one rung
  18 printed nodes · FOUR sizes             Fraunces re-cut: +1 glyph (p) ≈ +420 B
  Fraunces re-cut: +6 glyphs ≈ +2.4 KB      the masthead is 2.009× its echo and is
  the masthead is one of eighteen           the only word on the page that boils
```

---

## Files

```
probe/heading-voice.spec.ts   r0's instrument, byte-identical (md5 9f3f07e2de9aa25a22dbfb259225e32a)
probe/pw.config.ts            scratch config, no webServer, baseURL 4234
probe/inject-proxy.mjs        the overlay delivery seam (+ the head-order keeper)
probe/face-census.spec.ts     the census: voices, ratios, boxes, coverage, contrast, tap floors
probe/subset-price.mjs        the cmap diff and the fvar read
probe/collide.mjs             the tape-vs-tab-head overlap and the per-face metrics
probe/ransom.mjs              the advance proof that `p` paints Georgia
probe/i1-i2.mjs               R7's I1 and I2 bodies, re-run (BASE parameterised; 4247 is held)
probe/crops.mjs               the three crops
proto/*.css                   the seven overlay sheets
readings/                     every run, plus `full/` (five un-distilled census dumps)
frames/                       3 crops, 120 KB total
```

Run: `npx vite --host 127.0.0.1 --port 4234 --strictPort` from `web/frontend`, then
`ARM="proto/core-face-law.css,proto/ratio-title-up.css,proto/acts-stay-written.css" UPSTREAM=4234
PORT=4235 node probe/inject-proxy.mjs`, then the specs with
`PLAYWRIGHT_BASE_URL=http://127.0.0.1:4235`.
