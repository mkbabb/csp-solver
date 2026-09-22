# G-PANEL · fable — three lines: a name over its answers, twice, then the verb with its receipt

T9-M17, "this has a poor usage of space and needs to be re-designed." Designed against MAIN
`1e6cfbbf` from the panel-bar census (`../../census/panel-bar/README.md` + `summary.json`, 24 cells),
the info and motion censuses read for couplings only. No server was run by this lane and no port
was named for it; every number below is the census's or arithmetic on the census's measured parts,
and each says which. The owner disposes at the re-look (U-10). The frame is the ≥1024 rail (the
census's §0 correction); the phone is measured too because its deal row has the same disease.

## 0 · The thesis

**The staged zone is three lines long at every width: `size` over its row of answers, `level` over
its row of answers, and the verb with its receipt beside it on one baseline. The 503 px list at
1280×800 becomes a ≈329 px form (−35 %), Deal rises 130 px above the bar's fade, and the card
speaks ONE option grammar (the phone's `options-row`) instead of two.**

What the owner's eye read in m17 is a list: three words each on its own 268 px line with a fat gap,
a rule, three more, a rule, then a die alone on a shelf with its receipt underneath. The mechanism
is one stale arm: `OptionSelector.vue:44` lays every non-phone group as a column of full-width chips
on the premise (`:175`) that "the rail is a 165 px column". The rail's content column measures
259.59–283.69 px fine (census §1a) and the level row needs 254.4. A form fills a line before it
starts another; this design makes the chips do that, and lets a line that runs out wrap the way a
pencil would, never one word per line by decree.

## 1 · Plan (tokens · type · layout · principles), then the tell review

**Colour — nothing new.** Paper `--color-card` (light `hsl(48 12% 99%)` / dark `hsl(24 6% 7%)`);
the unselected word at `--color-muted-foreground` (light `hsl(0 0% 45.1%)` ≈ #737373 → ≈4.7:1 on
paper by arithmetic; dark `hsl(48 5% 64%)` ≈ 8.6:1 — both UNREAD from paint, gate G10); the selected
size at `--color-foreground`; the selected level at its tier's ink (`--color-green-ink` #1d7f35
4.95 · `--color-orange-ink` #a26009 4.91 · rose, the R6 L19 ink tier; dark = the wax, 10.11/10.26
declared); the rules at `--ink-press-rule` (55 % graphite); the tape unchanged. No accent hue enters
(§3's law untouched).

**Type — the roles, unchanged.** `size` / `level` read `--type-group-title` (φ 25.888 px Fraunces 800
lowercase on the rail, √φ 20.35 px below 768); the chips read `--type-option` (20 px rail · 20 px
phone coarse · 22 px 768–1023) in HEAD's face (Fira Code, 12.0 px advance — every width below is at
that face; under CTRL-FACE's hand the rows only get shorter, §10); `deal` reads `--type-act`
(`--type-small`) and `dealt` reads `--type-small` — the SAME rung, which is what lets the two words
sit on one baseline. R6 law 27: roles, never a sweep.

**Layout — the well is a form, left-ruled on the desk, centred on the phone.**

```
DESK RAIL ≥1024 fine (content 268.22 at 1280)     PHONE DOCK 390×844 coarse (content 374)
┌ new game ─────────────────────────────┐         ┌ new game ────────────────────────────┐
│                                       │         │            Size      Level           │  tabs, unchanged
│   size                                │         │                      Medium          │
│   4×4   9×9   16×16                   │         │        4×4    9×9    16×16           │  the existing row
│ ─────────────────────────────────── │         │ ───────────────────────────────────  │
│   level                               │         │        [die]                         │
│   Easy   Medium   Hard                │         │        deal      dealt ||||          │  one line, centred
│ ─────────────────────────────────── │         └──────────────────────────────────────┘
│   [die]                               │
│   deal        dealt ||||              │  one line, at the names' edge
└───────────────────────────────────────┘
      ▲ one left edge: the h2's 0.75rem = the first chip's px-3 = the die's box
```

Rail: `flex-start`; the h2's `padding-left: 0.75rem` (12 px, the ≥768 arm that exists) and the first
chip's `px-3` (12 px) put the name's ink and the first answer's ink on ONE x; the deal button takes
the same 12 px inset so the die starts the third line at that x. Phone: the heading arm is centred
below 768 and the chip row is centred already; the deal pair centres as a unit. iPad-class coarse
rail (1280×800 `hasTouch`, content 168): the chips GROW to fill their line (`flex: 1 1 auto`,
`text-align: left`) so a line that holds one chip is the 168×44 box it is today, and the deal pair
centres (the coarse arm), because at the names' inset it would wrap by 0.6 px (§7).

**Principles.** (1) One grammar: the rail's row IS the phone's `.options-row`; shrink-to-fit chips
at the 7.2 px seam. (2) A line that runs out wraps; nothing is ever one-per-line by rule. (3) The
row never sizes the card: `contain: inline-size` on the flow arm (CTRL-TABS's chair §6.4
declaration), so the crib keeps sizing the fine rail and the bar the coarse one, and the board does
not move. (4) The verb and its receipt are one line: the ask above, the answer beside the act.
(5) The rhythm ladder is monotone in rank: name→answers 4 < seam 7.2 < tape→first name 13.6 =
rule air 13.6 < section pitch. Today the smallest step on the ladder (2.19) is between the two
NAMES (census §1a); the first section gains `padding-top: var(--zone-step)`.

**Tell review.** The generic answer to "poor use of space" is a segmented control: three equal
cells, a filled active cell, a pill. That is the SaaS kit and it is also what `flex: 1 1 auto`
on the fine rail would have drawn (three 84.6 px cells with left-aligned words at 0/84.6/169);
I cut it — shrink-to-fit words at their natural pitch is what the phone already draws and what a
pencil ticks. A second generic answer is the heading BESIDE its row (a form's label column); the
arithmetic kills it at every rail rung (level 254.4 + any name > 268.22 at 1280, > 283.69 at 1728),
so the name stays above, which is the rail's own `zone-row-stacked` idiom two wells down. Removed
on review: a drawn bracket around each row (a second box inside a box; M03's delineation is the
rule between sections and it stays CTRL-RULE's), and a re-timed hover (a π delta on the live
wells' chips for no reader; MOT-LADDER's row, §6).

## 2 · Tokens (values)

| token | value | status |
|---|---|---|
| `--zone-step` | `0.85rem` (13.6 px) | NEW, static, declared once on `.new-game-zone`, consumed bare. It is the literal that already appears four times (`.staged-section + .staged-section` margin/padding, `.deal-row` margin/padding, `GameControlPanel.vue:1550,1867`) and now also the first section's `padding-top` and the deal pair's column gap. Not a measured token: no publisher, so no `@property` is owed; if §10's leader registers it in its block, the visibly-failing initial is `0px` (the rhythm collapses to the tape). |
| `--type-group-title` | φ 1.618rem ≥768 · √φ 1.272rem below | read, unchanged |
| `--type-option` | 1.25rem rail · 1.25rem phone coarse · 1.375rem 768–1023 | read, unchanged |
| `--type-act` / `--type-small` | `clamp(0.875rem, 0.8rem + 0.25vw, 1.25rem)`, 16 px at 1280 | read, unchanged; the shared rung of `deal` and `dealt` |
| `--tap-floor` | 2.75rem coarse (`index.css:834/849`) | read, unchanged; every wrapped chip clears it both ways |
| chip seam | `0.45rem` (7.2 px), `.ctrl-options { gap }` | unchanged, now both axes on the rail too (the rule already says "ONE declaration, both axes") |
| chip inset | `px-3` (12 px) | unchanged; it is the alignment device |
| `--ink-press-rule`, `--color-muted-foreground`, the three `--color-*-ink` tiers | per theme, `index.css` | read, unchanged |

## 3 · Components and states

| component | today (HEAD) | this design | states |
|---|---|---|---|
| `OptionSelector` third arm (`!mobile`, n ≠ 2) | `flex flex-col items-center md:items-stretch`: one full-width chip per line | `options-flow`: `display: flex; flex-wrap: wrap; justify-content: flex-start; contain: inline-size; gap: 0.45rem` (the gap is the existing declaration). Fine pointer: chips `flex: 0 0 auto` (shrink-to-fit, the phone's chip). `(pointer: coarse)`: chips `flex: 1 1 auto; text-align: left` | selected = bold + tier ink + scribble underline (unchanged); unselected muted + ghost on hover (unchanged, `hover: hover` fence); `aria-pressed` one per group (zone-grammar 272); focus ring = the estate's (law 39, untouched) |
| `.options-row` (phone), `.options-pair` (binary) | rows | UNTOUCHED | — |
| `.staged-section` | h2 over the column; `+` rule 0.85rem/0.85rem/1.5px | h2 over the row; the rule unchanged; `:first-of-type { padding-top: var(--zone-step) }` | — |
| `.deal-row` | grid: die+label centred, tally under it (`grid-area 2/1`, `margin-top .15rem`) | `display: flex; flex-wrap: wrap; align-items: end; column-gap: var(--zone-step); row-gap: 0.15rem`; fine ≥1024: `justify-content: flex-start; padding-left: 0.75rem`; coarse: `justify-content: center`. The tally takes `margin-bottom` = the button's own `padding-bottom` (0.5rem fine / 0.3rem coarse — the two arms `GameControlPanel.vue:1906/2076` already carry; re-cut together) so `deal` and `dealt` bottom on one line | armed: the sublabel swaps to `sure?` (5 glyphs vs 4: the pair widens ≈ 5 px; the coarse rail still holds it, 161.6 ≤ 168); pending: `ScribbleLoader` in the die's box, width unchanged; the wrap is the fallback if a rung ever runs out |
| `DifficultyTally` (`label="dealt"`) | 91 × 30.39 under the verb | beside the verb, same box; draw-in unchanged | ungraded = dashed placeholder, same width class |
| the tape, the tabs, the h2s, the rules, the bar | — | UNTOUCHED (the tape's lane and x are W2's; the rules are CTRL-RULE's; the bar is M18's) | — |

## 4 · Copy (M16 register, `check-copy-register` bare)

Nothing new is written and nothing is re-worded. `new game` · `size` · `level` · `deal` · `sure?` ·
`dealt` and the tab-arm's closed value all stand; every `aria-label` stands. The one copy FACT the
form creates is that `deal` and `dealt` now sit on one line four words apart; the alternative
(dropping the receipt's visible word) would leave an unlabeled glyph, W7 §4's own lesson, so the
default keeps it and §9 ballots it.

## 5 · Desk and phone · light and dark — the numbers (arithmetic on census parts)

**Rail 1280×800 fine, both engines** (content 268.22 / 276.31; today's zone 503.19 / 504.16):
- rows: size 60+60+84+14.4 = **218.4** (fits, 49.8 spare) · level 72+96+72+14.4 = **254.4** (fits, 13.8
  spare; 5.19 at 1024) · the live wells' groups take the same arm: checking 60+60+72+14.4 = **206.4**
  fits; marks 96+96+96+14.4 = **302.4** wraps **2+1** at every fine rung (283.69 at 1728); futoshiki's
  four-chip band 261.6 fits from 1280, wraps 3+1 at 1024 — never widens the card (§7 G8).
- heights: first section 13.6 + 31.06 + 4 + 38 = 86.66 · level 28.2 + 31.06 + 4 + 38 = 101.26 · deal
  28.2 + 71.2 (die 36 + gap 4.8 + label 14.4 + pad 16) = 99.4 · residual 41.55 (well pad + tape lane,
  = 503.19 − 461.64) → **zone ≈ 329 (−174, −35 %)**; card scrollH ≈ 968 against the 608 scrollport.
- Deal at `scrollTop 0`: today the button spans 560.47–633.27 under the bar's fade (bar top 627.64);
  the row form lifts it ≈174 px → bottom ≈ 459, **≈137 px above the fade line (595.6)**.
- ink/span per section (the census's own instrument): size span-x 0.22 → **0.81**, level 0.27 →
  **0.95**; ink 0.12/0.13 → ≥0.25 by the same area arithmetic (gate G2 reads it).
- one edge: h2 ink-left = content-left + 12 = first chip ink-left = the die's box-left.

**Rail 1024×768 fine (content 259.59):** size fits, level fits (5.19 spare), latin wraps 3+1.

**Coarse rail 1280×800 `hasTouch` (content 168; the iPad seal's cell):** size 2 lines
`[4×4|9×9]/[16×16]` (chips 80.4/80.4/168 × 44) −51.2 · checking 2 lines `[Off|Ask]/[Live]` −51.2 ·
marks and level 3 lines, boxes **168×44 byte-identical** to today · deal pair 52 + 13.6 + 91 =
**156.6 ≤ 168** (11.4 spare; centred, the coarse arm) −19.2 · rhythm +13.6 → PANEL_H ≈ 1142.38 −
108 ≈ **1034**; every tap box ≥ 44 both ways.

**Dock 390×844 / 430×932 coarse:** tabs and the chip row untouched; deal row 117.77 → ≈ 97.6 (the
70.39 button beside the 30.39 tally, 27.2 of rule air); zone 241.73 → ≈ 235 with the rhythm; the tab
arm's tape→tab step is gated (G4), not claimed (the census did not read it on the dock).

**Landscape <1024 (844×390, 812×375):** the in-flow card, tab arm; only the deal row and the rhythm
move; W2 §2.2's reach row unchanged.

**Light and dark:** no theme-conditional rule; every ink is a per-theme token; the census read no
geometry delta across themes and none is minted. AA is READ from painted bytes at 2× in both themes
(G10), never asserted from the table above.

## 6 · Motion — a rung, or nothing

- **Selection is a pose swap, 0 ms.** The scribble leaves one chip and lands on its neighbour in
  ONE frame — the estate's grammar for a drawn mark changing (`OptionSelector.vue` §THE ROW ANSWERS
  AS ONE); a row makes the swap more visible than a column did and the law is the same. PRM: nothing
  to cut. G13 traces it.
- **The regime change (column → row) is layout, never tweened.**
- **The one tween the surface owns is the chip's ink lift**, `--ease-standard`
  (`cubic-bezier(0.4, 0, 0.2, 1)`, byte-identical to Tailwind's `transition-colors` default), 150 ms
  today as the `duration-150` utility. Its home is `MOTION.chromeLeaveMs` = **200**, the ladder's rung
  inside R2's 150–250 band — read through MOT-LADDER's `--motion-*` publisher when it lands, never as
  a literal this group writes; this group does NOT re-time it alone, because the same component
  paints the live wells and a lone re-time is a computed-paint delta there for no reader.
- **The receipt's draw-in** (`DRAW_IN_PRESETS.glyph` on the sequence chain, easeOutCubic) is
  untouched; it now happens beside the verb instead of under it.

## 7 · Born-RED gates (on main `1e6cfbbf`; each names its HEAD reading)

| # | gate | reads on main |
|---|---|---|
| G1 | 1280×800 fine, both engines: the new-game zone's height ≤ **340** | RED 503.19 / 504.16 |
| G2 | per section (size, level) at 1280 fine: span-x ≥ 0.75 and ink ≥ 0.25, the census's instrument as the control (`probe.mjs`) | RED 0.22 / 0.27 · 0.12 / 0.13 |
| G3 | 1280×800 fine, `scrollTop 0`: the Deal button's border-box bottom ≤ bar top − 32 (the fade) | RED 633.27 > 595.64 |
| G4 | rhythm: tape-bottom → first `size` name-top ≥ 13.6 px at 1280 fine AND tape-bottom → tab-row top ≥ 13.6 at 390 coarse, both engines | RED 2.19 (rail); dock unread |
| G5 | one line: the tally's box intersects the button's box vertically, horizontal gap ≥ 13.6, intersection area 0, `deal`/`dealt` glyph-box bottoms within 1.5 px, both engines, 1280 fine · 1280 coarse · 390 coarse; `visual-regression:569` (receipt keeps off the verb, hover included) stays GREEN | RED (stacked) |
| G6 | one edge at 1280 fine: `|h2 ink-left − first chip ink-left| ≤ 0.5` and `|die box-left − h2 ink-left| ≤ 0.5` | RED on the die (centred today) |
| G7 | the seam: `visual-regression:707` extended to the rail's flow arm — ≥ 6 px between every neighbour pair in BOTH axes across wrapped lines, with its zero-gap negative control | GREEN today; must survive the arm |
| G8 | the row never sizes the card: card width 324.22 / 332.31 (1280), 315.59 (1024), 330 / 338 (1440) and board-left Δ 0.00 vs the HEAD control, sudoku AND futoshiki (`?board=` an ENCODED payload, chair's addendum); negative control: strip `contain: inline-size` in-page → futoshiki at 1024 widens by 2.01 | identity; the control must bite |
| G9 | coarse rail 1280×800 `hasTouch`: regime witnessed; every `.ctrl-btn` ≥ 44×44; size and checking on 2 lines, marks and level boxes 168×44 byte-identical; the deal pair unwrapped (156.6 ≤ 168); `visual-regression` test 10 PANEL_H ≤ its SEAL with the negative control EXTENDED to revert this arm (`flex-wrap: nowrap; flex-direction: column` + the pair + the divider) so the seal can still fail; the SEAL restamped on the folded tree beside TAPE's 1306 | RED as a gate (the control would no longer bite at ≈1034) |
| G10 | AA from painted bytes at 2×, both themes: an unselected chip ≥ 4.5:1 on paper, the selected level word at its ink ≥ 4.5, the `level` h2 at its ink ≥ 4.5, `dealt` ≥ 4.5 | UNREAD (the census names it) |
| G11 | π vs the HEAD control at 1280×800 · 1440×900 · 390×844 · 430×932, both engines: deck, masthead, board, grid, every tape, both captions, the bar — tags + computed paint identical; the live wells' chip ROWS are a DECLARED DELTA with before/after crops (§9 ballot 1), not a π claim | identity |
| G12 | identity battery: filter census 9/9 on the served dist; `check-copy-register` bare 0; `lint:motion` 0; zone-grammar 229 / 272 / the tab rows GREEN; goldens 4/4 | identity |
| G13 | a rAF trace across a chip press: the scribble's box moves in exactly one frame (0 intermediate poses), both engines; PRM identical | GREEN (pose swap) — identity |

## 8 · What DIES

- `OptionSelector.vue:44` — the third arm `'flex flex-col items-center md:items-stretch'` → the flow
  arm (§3). `:54`'s `md:text-left` stays (it is what the coarse rail's grown chips need).
- `OptionSelector.vue:175–177` — "The rail is a 165px column and every option in it is a full-width
  chip on its own line" → re-derived in the same commit (the chair's row): content 259.59–283.69 fine
  / 168 coarse; a row that wraps.
- `GameControlPanel.vue:1875–1885` — the deal grid (`grid-area 1/1`, `2/1`, `justify-self: center`,
  the tally's `margin-top: 0.15rem`) → the flex pair.
- The four `0.85rem` literals (`:1550–1552`, `:1867–1870`) → `var(--zone-step)`, computed-identical.
- Nothing in the tab arm, the tape, the rules, the bar, the h2s, the confirm, the crib.

## 9 · Ballots (the owner's, at the re-look) and couplings

1. **One grammar or a staged-only arm.** Default: the component's arm (the live wells' `marks`,
   `what fits` [a pair, untouched], `checking` groups become rows too — checking 1 line, marks 2+1) as a
   DECLARED delta with both frames. Alternative: a `:row` prop for the staged zone only (π holds on
   the live wells; the card keeps two grammars — the disease the census named).
2. **The receipt beside the verb** (`deal … dealt ||||` on one baseline) vs under it as today.
3. **The phone's tab arm**: both rows visible would cost ≈ +93 px on the dock (two 24.5 + 4 + 52
   stacks + a 28.2 rule against a 44 tab row + one 52 row) — default NO, the tabs stay (the census's
   dock row); the deal pair is the phone's whole gain.
4. **The marks row's 2+1 wrap** on the fine rail vs a kept column for that one group — default wrap.

Couplings: **CTRL-FACE** (leader): the widths are at HEAD's mono face; under the hand they shrink
(re-derive G1/G2/G9 at the fold). **CTRL-RULE**: the rule between sections is its 3 px / 1.4.11 row;
`--zone-step` reads the rule's air whatever the rule becomes. **CTRL-TAPE**: the tape's lane and x
unmoved; +13.6 lands BELOW the tape; test 10's seal restamp rides its merge watch. **CTRL-TABS**
(blocked): `contain: inline-size` is the chair's §6.4 declaration, cited, not the family's design.
**CTRL-COST**: `sure?` widens the pair ≈ 5 px; the coarse rail still holds it. **MOT-LADDER**: the
150 literal → the 200 rung. **W3**: the h2s stay headings; the tab arm's disclosure untouched.
**M01/M03**: no tap box shrinks under 44 on any coarse cell; no rule is deleted.

## 10 · Gaps (this lane's own; reject the optimism)

- No prototype, no server: every height is census parts summed; the 2.19 px tape→name residue is
  unattributed (half-leading, most likely) and the rhythm gate reads ≥ 13.6, not = 13.6.
- The coarse rail's deal pair has **11.4 px** of spare at HEAD's face; the wrap is the fallback and a
  wrapped pair is today's stack, which is not a regression but is not the design either.
- `deal` beside `dealt` is a real legibility risk (one letter apart, one line); ballot 2.
- The marks row's 2+1 wrap is the row grammar's honest failure at 302.4 > 283.69; it may read worse
  than the column to the owner's eye — ballot 4 exists because of that.
- AA is arithmetic on the token table (≈4.7 light for the muted chip is thin); G10 is the read.
- `contain: inline-size` is assumed to behave identically in WebKit (chair §6.4's own use is the
  precedent, not a measurement on this surface); G8's negative control is what proves the card's
  width did not move for the wrong reason.
- The dock's tape→tab step was never measured by the census; G4's dock arm may be GREEN already.
