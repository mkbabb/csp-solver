# G-PANEL · adjudication—the apotheosis for T9-M17 (the new-game panel)

Adjudicator: Fable 5.1, 2026-09-22. Inputs: `portfolio/G-PANEL/fable.md`, `portfolio/G-PANEL/opus.md`,
the panel-bar census (`census/panel-bar/README.md` + `summary.json`, 24 cells, both engines × both
themes), the owner's frames `marks/m17-*.png` / `m18-*.png`, `design-marks-2026-09-22.md`,
`loop/pass4/registry-v4.md` §10 (CTRL-FACE leads at 84; CTRL-COST RETIRED into CTRL-TAPE; CTRL-TABS
BANKED at 57), `loop/pass4/CHAIR-RULINGS.md` (+ the `?board=` addendum), `loop/pass4/charters/LAWS.md`,
`loop/pass4/charters/CTRL-FACE.md` row 13 (the M17 row this file rewrites), R6 laws 1–4/9/11/14/27/37/
38/39/43, and the source on main `1e6cfbbf`: `OptionSelector.vue` whole, `GameControlPanel.vue`
:761–905 / :1534–1560 / :1837–1912 / :2041–2085, `typography.css` :120–166 / :366–384,
`DifficultyTally.vue` :293–325, `visual-regression.spec.ts` tests 8b (:569) · seam (:707) · 10 (:790),
`zone-grammar.spec.ts` row names. No server was run by this lane, no port bound, nothing killed;
every height below is arithmetic on the census's measured parts and says so. U-10: the owner
disposes at the re-look; nothing here retires the mark.

## 0 · Verdict

**The two designs are ONE layout in two hands.** Both replace `OptionSelector.vue:44`'s column arm
with a wrapping, left-ruled, inline-size-contained line of intrinsic chips; both put the verb and
its receipt on one line; both keep every string, every rung, every ink, the tape, the tabs, the
rules and the bar; both default to the component-wide arm with a staged-only prop as the π-strict
alternative. They part on five points, and the apotheosis takes each on a measurement or a law:

| point | fable | opus | taken | why |
|---|---|---|---|---|
| coarse-rail chips (168 column) | grow to fill the line (`flex: 1 1 auto`, `text-align: left`) | intrinsic (72–96 wide) | **fable** | M01 is the owner's "larger targets": a thumb's box on the coarse rail never shrinks; a line holding one chip is today's 168×44 byte-identical; `md:text-left` (`:54`) already keeps the scribble under the word (opus's own objection to grown chips was centred text, which the rail never has) |
| tape → first name | 13.6 (`--zone-step`, the rule's air; `padding-top` on the first section) | 5.01 literal so the step reads ≥ 7.0 | **fable** | the 2.19 residue is unattributed (half-leading, most likely) and moves with CTRL-FACE's face; a 5.01 literal derived from it flaps at the fold. 13.6 puts the compartment-name → section-name step at section rank, the ladder monotone 4 < 7.2 < 13.6; the constant already exists as four literals, so a token with six consumers is the opposite of ceremony |
| the deal row on the rail | flush-left fine, centred coarse | flush-left both pointers | **opus** | one rule per arm: the RAIL is left-ruled at every pointer, the DOCK is spine-centred. Fable's centred coarse pair is a third arm for no reader |
| the deal row on the dock | the pair centred as a unit | `1fr auto 1fr`, verb on the spine, receipt in the right track, contained | **opus** | the T6 mark-6/8 comment (`:1839`) is decided history: a centred flex pair slides the verb ~43–52 px off the spine its chips centre on. Opus keeps the die's x π on the dock (only the receipt moves) and the right track holds the tally at 390 and 320 (137.4 / 102.4 ≥ 91) |
| one baseline | `align-items: end` + tally `margin-bottom` = the button's own `padding-bottom` (two arms kept in step) | `align-items: last baseline` | **opus, with fable's as the declared fallback** | one declaration says what the design means (two words on one baseline); it is engine-unwitnessed on a `<button>` column-flex, so G5 reads glyph-box bottoms ≤ 1.5 px in both engines and the fallback lands if either engine misses |

One graft neither wrote: **the deal button's gutter becomes the chip's inset** (`padding-inline:
0.75rem` on `.icon-btn.deal-btn` at every pointer; fine rail today 1.1rem, coarse 0.5rem). Fable's
"one edge" aligned the die's BOX to the words' ink (the box is invisible; the die sits 17.6 px right
of the words); opus put the row at the content edge (the die 5.6 px right of the words). With one
inset for the h2 (`typography.css:380`), the chip (`px-3`) and the die, the die's INK starts the
third line at the names' x with no negative margin and no third number. It is a declared delta on
the verb's box (72.78 → ≈61.6 wide fine; 56 → 60 coarse/dock) and it is what makes the coarse rail's
pair fit with room (§3).

**Refused, with the law:** a segmented control or a justified fine row (both tell reviews; the
scribble is `background-position: left bottom` on the content box, law 14's one affordance); the
heading beside its row (dead by arithmetic at every rail rung: level 254.4 + any name > 283.69); a
drawn bracket per row (R6 L11: a second `BoilDivider` takes the census 9 → 13; L37: a drawn edge is
`HandDrawnOutline`, and a second box inside the well is M03's delineation done twice); tabs on the
rail (the mark is about wasting room, not lacking it; §8 is CTRL-TABS's banked row); a re-timed hover
(the chip's 150 ms is MOT-LADDER's rung and FACE's charter row 9 already owns the PRM cut); any
height tween on a band or wrap change (M09: a tween inside a scrollport drags the sticky tape and
the fade through layout—a CUT, full motion and PRM alike); fable's ballot 3 (both tab rows on the
dock) is struck as a ballot—both designs keep the tabs, and the row is §8's.

## 1 · The arithmetic, reconciled (why 329 and 295 are the same design)

HEAD 1280×800 fine, chromium: zone **503.19** = size 163.44 + level 178.03 + deal 120.17 +
**41.55 residual**. The residual HOLDS the two `.staged-section + .staged-section` / `.deal-row`
`margin-top`s (2 × 13.6 = 27.2) plus 14.35 of well pad and tape lane. Fable's section figures use
28.2 (margin AND padding) and then add the 41.55 back, so its 329 double-counts 27.2; opus's 294.66
counts padding + border only (14.6) and takes a 5.01 rhythm. Corrected to one accounting:

| part | HEAD | apotheosis (arith) | Δ |
|---|---|---|---|
| size section (pad-top 13.6 NEW + h2 31.06 + 4 + one 38 line) | 163.44 | **86.66** | −76.78 |
| level section (13.6 + border ≈1 + 31.06 + 4 + 38) | 178.03 | **87.66** | −90.37 |
| deal row (14.6 + the verb 72.78; the tally beside it) | 120.17 | **87.38** | −32.79 (T6 mark 8's own +32.79 returned) |
| residual (margins 27.2 + well pad/tape lane 14.35) | 41.55 | 41.55 | 0 |
| **zone** | **503.19 / 504.16 wk** | **≈303.3** (−39.7 %) | −199.9 |

Opus + 8.59 (13.6 − 5.01) = 303.25; fable − 27.2 (the double count) + 1.58 (72.78 measured-derived
vs its 71.2) = 303.3. The verb's border-box bottom at `scrollTop 0`: 633.27 − 76.78 − 90.37 − 2.19
+ 13.6 ≈ **≈464**, the fade line 595.64 → ≈132 px clear (both designs' 457–459 differ only by the
rhythm arm). The `.deal-btn`'s height is derived from the census (120.17 − 14.6 − 2.4 − 30.39 =
72.78), not from its parts.

**G1 is set at ≤ 320, not fable's 340**: a half-cure that rows the chips and leaves the receipt
stacked reads 86.66 + 87.66 + 120.17 + 41.55 = **336.0**, which 340 would green. 320 REDs it and
leaves 17 px for engine drift and the face.

## 2 · The apotheosis (spec)

### 2.1 Tokens

| token | value | status |
|---|---|---|
| `--zone-step` | `0.85rem` (13.6 px) | NEW static length, §10's; REGISTERED in the leader's one `@property` block (first static stylesheet, `syntax: "<length>"`, `inherits: true`, `initial-value: 0px`—visibly failing: the tape crowds `size` and G4 reds); the value declared once, consumed bare at six sites: `.staged-section + .staged-section` margin/padding, `.deal-row` margin/padding (four literals today at `GameControlPanel.vue:1551–1552/1869–1870`), the first section's `padding-top`, nothing else. The discriminator reads the INHERITED value against the ancestor stated (LAWS P4). |
| chip seam `0.45rem` (7.2) | `.ctrl-options { gap }` (`OptionSelector.vue:165`) | unchanged; now both axes on the rail's line AND the deal pair's `column-gap` (the verb and its receipt are row neighbours; the seam is the row-neighbour step) |
| chip inset `px-3` (12) · h2 `padding-left: 0.75rem` (`typography.css:380`) | 12 | unchanged; the deal button's `padding-inline` joins them (§2.4) |
| `--type-group-title` · `--type-option` · `--type-act`=`--type-small` · `--type-tool` (the sublabel) · `--tap-floor` | as `typography.css` / `index.css:834/849` | read, unchanged (law 27) |
| every ink (`--color-muted-foreground`, the three `--color-*-ink` tiers, `--ink-press-rule`, `--ink-press-quiet`) | per theme | read, unchanged; AA is a READ (G10) |

No colour, no rung, no string, no border, no filter, no timing is minted.

### 2.2 The line arm (`OptionSelector.vue`)

The third arm `'flex flex-col items-center md:items-stretch'` (`:44`) → `options-line`:

```css
.options-line {
  display: flex;
  flex-wrap: wrap;             /* a line that runs out wraps; nothing is one-per-line by decree */
  justify-content: flex-start; /* left-ruled; every wrapped line starts at the first line's x */
  contain: inline-size;        /* chair §6.4: contributes 0 to the rail's max-content; the board can't walk */
}
.options-line > .ctrl-btn { flex: 0 0 auto; }              /* fine: the word + 24, the phone's chip */
@media (pointer: coarse) {
  .options-line > .ctrl-btn { flex: 1 1 auto; }            /* coarse rail: a line holding one chip is today's 168×44 */
}
```

`md:py-0.5 md:text-left` (`:54`) stays (the grown coarse chip needs `text-left` for the scribble);
`md:items-stretch` on the chip dies (a stretched chip in a row has no meaning). `.options-row`
(phone/deck) and `.options-pair` (the binary) UNTOUCHED. States unchanged: selected = bold + tier
ink + scribble, `aria-pressed` one per group (zone-grammar :272), ghost under `(hover: hover)`,
law 39's ring. The `:175–177` premise ("the rail is a 165px column") is re-derived in the same
commit with the six measured widths 259.59 · 268.22 · 271.25 · 274 · 276.31 · 283.69 fine / 168 coarse.

Scope: **ARM A** (default) is the component's—the live wells' `checking` (206.4, one line) and
`marks` (302.4, wraps 2+1 at every fine rung at HEAD's face) take the line too, a DECLARED delta with
before/after frames; **ARM B** is the same class behind one boolean prop (`line`) passed by the
staged zone only, the live wells byte-identical. Both built behind one const; ballot 1.

### 2.3 Rhythm (`.staged-section`)

`.staged-section:first-of-type { padding-top: var(--zone-step); }`—the air is taken BELOW the tape,
inside the section, so the tape's three terms (`--washi-tag-lift` 3px, `--washi-tag-gap` 0px,
`--washi-tag-inset`) and its lane law are untouched (CTRL-TAPE's). h2 → first chip stays 4.00
(`gap-1`). The rule between sections (1.5px `--ink-press-rule`, 0.85rem each side) is CTRL-RULE's and
is unchanged in form; it reads `--zone-step` for its air. Ladder after: 4.00 (name → values) < 7.2
(seam, both axes) < 13.6 (tape → first name = rule air = deal-row air) < section pitch.

### 2.4 The deal row

Rail (`!mobile`, both pointers):

```css
.deal-row {
  display: flex;
  flex-wrap: wrap;                 /* a column too narrow for the pair drops the receipt beneath: today's pose, never an overflow */
  justify-content: flex-start;     /* the die starts the third line at the names' x */
  align-items: last baseline;      /* `Deal` and `dealt` on one baseline (fallback: `end` + tally margin-bottom = the button's padding-bottom, if G5 misses in either engine) */
  column-gap: 0.45rem;             /* the seam */
  row-gap: 0.15rem;                /* the receipt's existing margin-top, if it wraps */
  contain: inline-size;            /* the pair adds nothing to the rail's max-content */
  /* margin-top / padding-top / border-top: → var(--zone-step), computed-identical */
}
.icon-btn.deal-btn { padding-inline: 0.75rem; }   /* the chip's inset, every pointer: one edge for h2 · chip · die INK */
```

Dock (`.mobile-control-panel .deal-row`): `display: grid; grid-template-columns: 1fr auto 1fr;
column-gap: 0.45rem; align-items: last baseline; contain: inline-size;` the verb in column 2 (the
well's spine, π on its x), the tally in column 3 `justify-self: start`. Right track at 390 =
(374 − 60 − 14.4)/2 = 149.8 ≥ 91; at 320: 114.8 ≥ 91.

The grid at `:1875–1885` (`grid-area 1/1` · `2/1` · `justify-self: center` · the tally's
`margin-top: 0.15rem`) dies; the `:1839–1856` "TWO ROWS, ONE AXIS" stanza is re-derived to one
paragraph: the shared cell was cramped, the `1fr` mirroring walked the board, and the cure is
separate tracks plus containment. The chair books the T6-mark-8 reversal (a moved law is the chair's
row). States: rest · armed (`sure?` swaps in place; the receipt has its own track on the dock and
its own flex item on the rail) · pending (`ScribbleLoader` 30 px in the die's box) · dealing · no
receipt (the verb alone: on the spine on the dock, at the left edge on the rail). DOM order verb →
receipt = reading order = focus order.

### 2.5 Copy · motion · theme

M16: no string changes (`new game · size · level · Deal · sure? · dealt`, every `aria-label`);
`check-copy-register` bare 0; no new glyph enters a subset (L30). Motion: selection stays a 0 ms pose
swap (§THE ROW ANSWERS AS ONE); the regime change is layout, never tweened; the chip's
`transition-colors duration-150` is NOT re-timed here—its rung is MOT-LADDER's publisher and its PRM
cut is FACE's charter row 9 (G13 reads both); the receipt's draw-in unchanged; the drawer's
`cubic-bezier(0.32, 0.72, 0, 1)` @ 520 ms untouched (R6 L1). Theme: no theme-conditional rule; the
census read no geometry delta across themes and none is minted; AA is READ from painted bytes at 2×
in both themes (G10), never asserted from the token table (≈4.7:1 light for the muted chip is thin).

## 3 · The numbers (arith on census parts; the first prototype's readings replace every one)

| cell | HEAD (measured) | apotheosis |
|---|---|---|
| 1280×800 fine · zone | 503.19 / 504.16 | **≈303.3** (§1) |
| 1280×800 fine · rows | size 3 lines · level 3 lines | size 218.4 / level 254.4 on ONE line (49.8 / 13.8 spare); span-x 0.22 / 0.27 → ≈0.81 / ≈0.95 |
| 1024×768 fine (259.59) | 3 / 3 | size ✓ · level ✓ (5.19 spare) · futoshiki latin 261.6 wraps **3+1 (−2.01)**, named |
| 1280×800 fine · Deal at scrollTop 0 | 560.47–633.27 under the fade (595.64) | bottom **≈464**, ≈132 clear; the next well's tape expected above the fade (a read, G3b) |
| 1280×800 fine · card scrollH | 1142 | ≈942 (ARM B) · ≈806 (ARM A: checking −90.4, marks −45.2) |
| 1280×800 coarse (168) · size | 3 × 168×44 | **2 lines** `[4×4 9×9]` 80.4 each grown / `[16×16]` 168 — −51.2 |
| 1280×800 coarse · level, marks | 3 × 168×44 | 3 lines, boxes **168×44 byte-identical** (72 + 7.2 + 96 > 168 in every pairing) |
| 1280×800 coarse · deal pair | stacked, 113.77 | 60 + 7.2 + 91 = **158.2 ≤ 168** (9.8 spare); armed `sure?` ≈ +5 → 163.2 (4.8 spare); row 14.6 + ≈66.4 ≈ 81 (−32.8) |
| 1280×800 coarse · zone / PANEL_H | 532.78 / 1142.38 | ≈462.5 / ≈1072 (ARM B) · ≈1021 (ARM A) |
| 390×844 coarse · deal row / zone / case | 117.77 / 241.73 / 699 vs 628 | **≈85** / ≈209 / ≈666 vs 628 (**≈38 still under the fold**, named, not cured here) |
| 430×932 coarse | no overflow | no overflow |
| < 1024 tabs · chip row · tape · bar | as census §1b | π (only `.deal-row` moves: a declared delta) |
| rail card width · board-left | 324.22/332.31 · Δ 0 | π by construction (containment), G8 reads it |

Every width is at HEAD's mono face (Fira Code, 12.0 px advance). Under CTRL-FACE's hand (COST's
graft "the face is the button's air", `padding: 0` on a chip holding a drawn face) every row gets
SHORTER: marks 3 × 72 + 14.4 = 230.4 fits one line at every fine rung (ballot 3 goes moot) and the
coarse rail's level band wraps 2 lines (`[Easy Medium]` 127.2 / `[Hard]`); the "one edge" inset then
moves from `px-3` to the row—re-derived at the fold, not claimed.

## 4 · The prototype brief (the smallest runnable build that proves it on the surface)

**Tree.** A fresh worktree off main `1e6cfbbf` (`git worktree add <repo>/.claude/worktrees/intake-g-panel
1e6cfbbf`; node_modules symlinked from the main tree; main's `src/`, `e2e/`, `scripts/`, `.github/` are
`chmod a-w`—a refused write on main is the guard, never a permission to change). Dev server
`127.0.0.1:<the port the orchestrator names in 4250–4260>` `--strictPort`, a two-line `.mts` scratch
config with `cacheDir: '<tree>/.vite-cache-g-panel'`; the HEAD control = the chair's read-only
`.claude/worktrees/w7-control` served with `vite preview` over its pre-built dist (`index-CubiZsMVSwTc.js`,
verified by hash) on the next named port, AND a dev-mode control from the same tree for dev-vs-dev
rows (LAWS P4: both arms in one rendering mode). Re-scan the band before binding; kill by recorded
PID; 3000/3001 and 4230–4249 never touched. Scratch under `<tree>/web/frontend/.g-panel/`, deleted at
return; `git status` at return = product files.

**Build, in this order (each step a measured commit on the worktree, none pushed):**
1. `--zone-step` in the `@property` block + the six consumers (computed-identical: G4 reads 2.19 → 13.6 as the only move).
2. `.options-line` (§2.2) behind `const LINE_SCOPE: 'component' | 'staged'` with the `line` prop; re-derive `:175`.
3. `.deal-row` rail arm + dock arm (§2.4) + the button's `padding-inline`; re-derive `:1839–1856`.
4. Instruments: copy `census/panel-bar/probe.mjs` with OUT re-pointed (the same span-x/ink instrument reads G2); the re-aimed test 8b and the extended seam row and test 10's extended negative control as PROPOSED diffs under `<evidence>/instruments/` (LAWS: an instrument whose subject moved is a PROPOSED diff, reported MOVED); a `?board=` payload minted with `persistence.ts:190–201` for sudoku 9×9 and one for futoshiki, stated in every π row.
5. Build the dist in the worktree (scratch cacheDir outside the tree), then the identity battery (G12) on the SERVED dist.

**Poses to frame, both engines, DPR 2, ≤150 KB, at most FOUR crops:** (i) m17's pose before/after,
chromium · light · 1280×800 · fine, `scrollTop 0` (the ballot pair: one payload, one variable); (ii)
ARM A's live-well delta (checking one line, marks 2+1), webkit · dark · 1280×800 · fine; (iii) the
coarse rail, chromium · light · 1280×800 · `hasTouch` (the regime witnessed in-page first), armed
`sure?` beside the receipt; (iv) the dock deal row, webkit · light · 390×844 · coarse, the sheet
polled to its ~700 ms settle. Ballot frames for 2 (beside vs under) and 4 (intrinsic vs grown fine
chips) are the same cell as (i), each pair differing by one variable.

**The numbers that mean success:** every G1–G10 row GREEN on both engines with its plant biting; G11
identical on every unnamed surface with the four deltas DECLARED; G12 exit 0 bare with the control's
exit codes beside; the coarse rail's pair unwrapped at rest AND armed; PANEL_H shipped/reverted
reported beside 1227.5 with the stamp left to the chair (FACE charter row 7).

**Stall law:** playwright chunked by project, background with a log polled at ~60 s; no foreground
timeout above 120 s; raw per-frame/per-cell JSON summarised (min/median/max, the discontinuity), never
banked whole.

## 5 · Born-RED gates (on main `1e6cfbbf`; each names its HEAD reading and its plant)

| # | gate | HEAD | plant / negative control |
|---|---|---|---|
| G1 | 1280×800 fine, both engines: `.new-game-zone` height ≤ **320** | RED 503.19 / 504.16 (expected ≈303) | +200 px margin on the zone must red; a stacked receipt (336.0) must red |
| G2 | one question, one line: distinct chip-top values per staged group = 1 at fine 1024/1280/1366/1440/1512/1728 (latin at 1024 = 2, named); span-x ≥ 0.75 and ink ≥ 0.25 per section at 1280 on the census's own instrument | RED 3/3 lines · 0.22/0.27 · 0.12/0.13 | re-inject `flex-direction: column` on the line: it must red |
| G3 | 1280×800 fine, `scrollTop 0`: the verb's border-box bottom ≤ bar top − 32 (the fade); **G3b** the next well's tape fully above the fade line (computed opacity 1, not `data-under-bar`) | RED 633.27 > 595.64 · RED (R6 §3.2, 1 of 4 tapes painted) | the same 200 px plant |
| G4 | rhythm, both engines, 1280 fine AND 1280 coarse: tape-bottom → first h2 top ≥ 13.6; h2 → first chip 4.00 ± 0.3; seam 7.2 ± 0.3; the three reads monotone | RED 2.19 | `--zone-step: 0px` (the registered initial) must red; an invalid value on the well must read the ancestor's 13.6 (the inherited-value discriminator) |
| G5 | one line: `Deal` sublabel glyph-box bottom vs `dealt` glyph-box bottom |Δ| ≤ 1.5; horizontal clearance ≥ 7.2; box intersection 0; at 1280 fine · 1280 coarse (rest AND armed) · 390 coarse (settled); test 8b re-aimed horizontally (PROPOSED diff) with its growth control | RED (stacked, Δ ≈ 32) | grow the verb 120 px on hover: the clearance read must red; if `last baseline` misses ≥ 1.5 in either engine, the `end` + margin fallback lands and the miss is banked |
| G6 | one edge at 1280 fine and 1280 coarse: |h2 ink-left − first chip ink-left| ≤ 0.5; |die INK-left − h2 ink-left| ≤ 0.5; every wrapped line's first chip at the first line's x ± 0.5 | words GREEN today (12 = 12); die RED (centred; ink at +17.6 from the content edge under fable's box rule) | `justify-content: center` on the line must red; `padding-inline: 1.1rem` restored must red |
| G7 | `visual-regression:707` extended to the line: ≥ 6 px between every neighbour pair in BOTH axes across wrapped lines, every group, both engines | GREEN today; must survive the arm | the file's own zero-gap control |
| G8 | the row never sizes the card: card width vs the HEAD control (dev-vs-dev, one encoded `?board=` each for sudoku and futoshiki) at 1024/1280/1440 fine and 1280 coarse |Δ| ≤ 0.01; board-left Δ 0.00; `scrollWidth === clientWidth` on the card at every desk cell and the coarse rail (CTRL-RULE's graft: the tally overhang class) | identity (main 0) | strip `contain: inline-size` from BOTH `.options-line` and `.deal-row` in-page: the coarse rail must widen (size 218.4 > 168) and futoshiki at 1024 by 2.01 |
| G9 | coarse rail 1280×800 `hasTouch`: regime witnessed (`coarse · row · rail`); every `.ctrl-btn` ≥ 44 × 44; size 2 lines, checking (ARM A) 2 lines; level and marks boxes 168×44 byte-identical; the deal pair unwrapped at rest and armed (158.2 / 163.2 ≤ 168 by arithmetic—a READ); test 10's PANEL_H shipped and reverted with the control EXTENDED (`.options-line { flex-direction: column; flex-wrap: nowrap }` + the deal grid + the pair + the divider) so the seal can still fail, both numbers REPORTED beside main's 1227.5; the stamp is the chair's one act at the fold | RED as a gate: at ≈1021–1072 the unextended control (+≈85) no longer breaks 1227.5 | the extension itself; if armed wraps, the wrap is today's stack and is banked as the gap it is |
| G10 | AA from painted bytes at 2×, both themes: an unselected chip on paper, the selected `level` word at its tier ink, the `level` h2, `dealt`, the `Deal` sublabel, each ≥ 4.5:1 (the ring-differencing method, FACE's critic's) | UNREAD on main | a 40 % ink plant must red |
| G11 | π vs the HEAD control at 1280×800 · 1440×900 · 390×844 · 430×932, both engines, one payload, one rendering mode: deck, masthead, board, grid, every tape, both captions, the bar, the tabs, the phone chip row—tags + computed paint + rects identical; DECLARED deltas with crops: the staged rows (rail), the deal row (every cell), the verb's gutter (fine 1.1 → 0.75rem), the live wells' rows (ARM A) | identity | the census's own controls; a head-vs-head negative control first |
| G12 | identity battery on the SERVED dist, bare, with the control's exit codes: filter census 9/9 both regimes both themes; union raster area ±2 %; `check-copy-register` 0; `lint:motion` 0; `lint:lanes`, `lint:theme-tokens`, `lint:sleep`, `check-pw-projects`, `eslint .`, `prettier --check`; `zone-grammar.spec.ts` WHOLE (rows :229 headings, :272 aria-pressed, :428 pair floor, :550 coarse card); goldens 4/4; the `-1lh` guard; `check-font-coverage` unchanged; `vue-tsc`; the unit suite ("Tests") | identity | the gates' own self-tests |
| G13 | a rAF trace across a chip press: the scribble's box moves in exactly one frame, both engines; under PRM the chip's `color` transition reads 0 ms (FACE row 9's read, cited not re-cut) | pose swap GREEN · PRM RED on main (150 ms runs under `reduce`) | `transition: color 150ms` re-injected under PRM must red |

## 6 · Ballots (the owner's, at the re-look; both arms built and framed on one payload)

1. **One grammar or a staged-only line.** ARM A (default): the component's arm—`checking` one
   line, `marks` 2+1 at HEAD's face—a declared delta on two wells the frame does not show, both
   frames up. ARM B: the `line` prop on the staged zone only; the live wells byte-identical; the
   card keeps two rail grammars (the M05 disease the §10 fold exists to cure).
2. **The receipt beside the verb** on one baseline (default; `Deal … dealt |||` one line, the ink
   gap ≥ 19 px at every cell by the button's own gutter) vs **under it** as today (T6 mark 8's pose;
   the zone then reads ≈336 at 1280 fine and the dock's deal row stays 117.77).
3. **The marks row's 2+1 wrap** (default) vs **a kept column** for that one group—CONDITIONAL: the
   ballot exists only if the marks band still wraps at the fold's face (under FACE's padding-0 chips,
   230.4 fits every fine rung and the row is struck).
4. **Fine-rail chip boxes: intrinsic** (word + 24, 60–96 × 38, the phone's chip; default) vs
   **grown to fill the line** (the coarse rule at every pointer: three ≈84.6 px cells, words left,
   scribble under the word)—M01's "larger targets" is the owner's, and the fine hit box shrinks from
   268.22 × 38 under the default; both frames at chromium · light · 1280×800 · fine.

Not ballots: the dock's tabs (both designs keep them; §8 is CTRL-TABS's banked row); the verb's
gutter (a declared delta); the dock's spine form (decided history honoured).

## 7 · Owning families (registry-v4 §10) and their pass-5 rows

- **CTRL-FACE (§10 leader, 84)—carries M17.** Charter row 13 is REWRITTEN by this file: build the
  apotheosis (§2) behind `LINE_SCOPE` with ballots 1–4 framed; `--zone-step` in its one `@property`
  block; G1–G13; re-derive `:175` and `:1839–1856`; re-derive every width under its own face at the
  fold (marks/level/coarse-level rows); its charter row 9 (the PRM cut at the chip) is G13's second
  read. Four crops as §4.
- **CTRL-TAPE (78; COST retired into it)**—the tape lane and its three terms untouched (the air is
  taken below the tape; G4 reads tape → h2, never the terms); test 10's seal is ONE stamp at the fold
  on its merge watch (FACE reports, nobody stamps); COST's grafts that bind here: "the face is the
  button's air" on every chip (the inset moves to the row when it lands), `check-cost-face`'s
  N-plants shape for G6/G9's controls.
- **CTRL-RULE (68)**—the rule between sections keeps its form (3 px / 1.4.11 is its row); `--zone-step`
  is the rule's air by name; its critic's `scrollWidth === clientWidth` graft is G8's second clause
  (the tally beside the verb is exactly the overhang class its tree hit).
- **MOT-LADDER (§13)**—the chip's 150 ms is its rung (`chromeLeaveMs` 200, R2's band) through the
  `--motion-*` publisher, never a literal this group writes; coupling only.
- **W3**—the h2s stay headings (zone-grammar :229); the tab arm's disclosure untouched.
- **The chair**—books the T6-mark-8 reversal (a moved law is the chair's row); rules ARM A vs B for
  the fold if the owner does not; stamps the seal once.

## 8 · Gaps (a gap is a gap)

- No prototype, no rendered height: every number in §1/§3 is measured parts summed; the first
  prototype's readings replace them. The 2.19 residue is unattributed.
- The coarse rail's deal pair has **4.8 px** of spare when armed (163.2 ≤ 168) at HEAD's face and a
  `sure?` width that is estimated (+5), not measured; the coarse-rail verb's width (≈60 after the
  gutter) is derived from the dock's 56, not measured on the rail.
- `align-items: last baseline` on a column-flex `<button>` and `contain: inline-size` on WebKit are
  unwitnessed on this surface (CTRL-TABS's tree is the only precedent for the latter); G5's fallback
  and G8's control are what prove them.
- The coarse rail's level band stays three lines at HEAD's face; the cure is CTRL-FACE's face, not
  this row's.
- The futoshiki latin band wraps 3+1 at 1024 fine (−2.01); `Center` orphans under ARM A at HEAD's face.
- The phone case still overflows ≈38 px at 390×844 after the deal row is re-budgeted.
- Test 10's seal: at ≈1021 (ARM A) / ≈1072 (ARM B) the shipped reading clears 1227.5 by 155–206 px, and
  even the EXTENDED control (the pair + divider ≈85 plus the line arm + deal row ≈70–120 reverted)
  lands at ≈1226–1227 by arithmetic—on the seal, not past it. The row reads RED or GREEN by a pixel
  until the chair's single stamp; the lane reports both numbers and stamps nothing.
- AA has been read from painted bytes by nobody on this surface; ≈4.7:1 light for the muted chip is thin.
- The owner's ≈369 px card width does not reproduce (315.59–339.69 across six fine rungs, census §4).
- G3b (the next well's tape above the fade) is expected by arithmetic (zone bottom ≈478 + divider
  ≈60 → tape ≈530–553 < 595.6), not derived from a read divider height.
- Fable's ballot 3 and the tabs are struck as ballots on the §8 ownership, which is the chair's call to
  confirm.
