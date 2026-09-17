# T9-W7 round zero · PORTFOLIO (Fable author)

Fourteen families across six fronts, minted against the seven census returns (R1–R7) as
measured on THIS tree, 2026-09-17. Round zero is read-only on the product: nothing below has
run; each family names the smallest runnable prototype that would prove or kill it. The
Opus author's portfolio is unseen; the adjudicator merges.

The subject the designs come from: a pencil-and-paper puzzle sheet. Graphite rules that
breathe, crayon wax for state, washi tape for names, a pencil case with a tongue, a
sketchbook deck, a sun and a moon. Every family below is checked against one question:
does it make the card look MORE like that sheet, or more like a settings panel wearing a
sketch filter.

The laws every family honors without restating them: filterBudget 9 (every drawn edge is
`HandDrawnOutline :pose="0"` or pre-baked geometry, never a filter, never a second
`BoilDivider`); the one-string law (a tape IS the accessible name); Patrick Hand's cut
(lowercase, no `j`, no `x` in any new hand string); AA 4.5:1 text and 3:1 non-text on
`--color-card`, both themes; the 44px floor in both dimensions; the z-ladder re-cut whole
(1 < 30 < 35 < 50 < 60); M16 plain copy with no em dash; M19; U-10; and W2's landed
mechanics (sticky tag, dock, tongue berths) as the ground the voice is designed on.

Where a family shares a MOVE with a sibling it is said in the family's own row. Two families
sharing a move is fine; two families sharing a CENTRE is a rewording and was merged before
this file was written (see §Rejected).

---

## Front 1 · THE CONTROLS SYSTEM (§10, with §1 §2 §8 §14 §15 inside it; M01 M03 M04 M05 M12 M13)

Three centres, each answering the same eight rows: the heading voice, the sticky law, the
button system, the mobile tabs, the bar's chrome, the tongue's quick set, the confirm's
face, and the 390px wordmark seam.

### CTRL-A · THE TAPED CASE

**Centre.** The washi tape is the one heading voice, and RANK IS WHERE THE TAPE IS STUCK,
never what face it is set in: a group's tape is astride its compartment's top edge, a row's
tape lies flat inside it. The card stays a pencil case of drawn compartments; the stroke
ladder (case 3 · tongue 2.5 · well 1.5 · row rule 1px) is the delineation.

**Substrate.** `SheetWashiLabel anchor="tag"` (exists) plus a new anchor `row` (flat,
inside, left-aligned, same tuple). Tokens: `--type-tag` re-pointed to `--type-heading`
(1.618rem; `typography.css:123`) and `--type-group-title` to `--type-tag` (`:124`), so the
eight names compute to ONE tuple (Patrick Hand · 25.89px · 500 · lowercase) at every width.
`<h2>` hosts around every tape in the `display: contents` shape the mobile tab heads already
use (`GameControlPanel.vue:786-793`). `HandDrawnOutline :pose="0" :stroke-width="1.5"` for
the bar. The tongue's own focus ring (`DrawerTab.vue:151`, 2px dashed currentColor, offset 3)
promoted to the card's one focus idiom.

**Decomposition.**
1. Voice: eight names, one tuple, eight `<h2>`s (ROW 1 and ROW 2 green by construction;
   ROW 3: 25.89 / 20.00 = 1.294 on the phone, the desk's own number). Washi stays NEUTRAL
   by law, so the tier tint leaves the heading and lives on the chip alone.
2. Sticky, the half-life law: the tape's sticky containing block is a box spanning the TOP
   HALF of its well (`position: absolute; inset: 0 0 50% 0`, the tape `sticky; top: 0`
   inside it). A tape therefore unpins when its group is half gone, and no tape ever pins
   over another group's options. R7's I3 greens at all five states; the W2 residual
   ("Medium" unpainted under a pinned tape) closes with it.
3. Buttons, three treatments: BOXED (the primary act `deal`, pose-0 outline at 2.5, the
   tongue's weight; the only boxed control in the card), BARE (verbs and tools: glyph rank
   + word, no ground, no border; `.info-glyph` loses its border and `.players-leave` becomes
   a bare word), CHIP (options on the seeded scribble underline). Radii: 0 on anything
   drawn, 8px on invisible hit boxes, nothing else. Hover is the ink lift alone (the
   2.9-point fill retires). Focus: the tongue's dashed ring on every control; the board keeps
   its drawn ring.
4. Mobile tabs (§8): `size` and `level` are two row-tapes side by side under the group's
   tape. The selected tape is PRESSED (0° tilt, full ink), the other LIFTED (±1.5°, 68%
   alpha) with its value word riding its right end. The washi's own de-tilt grammar becomes
   the selected state; the CSS `text-decoration` underline dies. W2's one-panel mechanic is
   unchanged; both tapes clear 44×44.
5. Bar (M04): a fifth compartment, drawn at 1.5 like the wells, with ITS OWN FLOW HEIGHT
   reserved at the card's foot (the `scene.css` handle precedent) so it buries nothing; the
   6px skirt becomes the outline's outset; sticky in all three scrollports (the landscape key
   added to `GameControlPanel.vue:2173`).
6. Tongue quick set (§14, M13): the tongue widens to a strip of three tongues under one
   outline, `undo · redo · controls`, on the board's bottom edge in portrait (274px of free
   edge; 3×44 + seams) and vertical on the right flank in landscape, where `undo` gains its
   first home outside the sheet. Hint and peek stay in the ribbon.
7. Confirm (§15, M12): the two-tap sublabel already accepted twice (`sure?` in
   `--color-red-ink` w600, disarm on any other tap or after 4s) extended to `fill` and
   `solve`; one mechanism on W1 §1.5's arm; the gallery ribbon stays the deck's.
8. M03 air: `--sheet-chrome` (`scene.css:468`) gains the wordmark's band + 8px so the case's
   stroke clears the wordmark's box at 390 and 375 by more than two stroke widths.

**Rejects.** The Fraunces display face inside the card (B keeps it); any drawn edge on a
non-primary control; the guard ribbon inside the card (B adopts it); index tabs (C); the CSS
underline anywhere; a hover fill.

**First runnable prototype.** A Playwright `addStyleTag` overlay against a lane dev server
(127.0.0.1:42NN, 390×844 and 1280×800, both engines): re-point the two tokens,
`.section-heading { display: none }`, restyle `.mobile-heading-btn` as a tape by borrowing
`.washi-tag`'s clip-path and tilt, inject a pose-0 outline SVG around `.action-bar`, add the
half-life sticky container with a 12-line `page.evaluate` DOM patch. Re-run
`r1-controls/probe/heading-voice.spec.ts` (ROW 1/2/3) and R7's I2/I3 against the overlaid
page; bank two crops (the 390 sheet, the 1440 rail at scrollTop 500). No product file
touched.

**Risk.** A 25.9px Patrick Hand tape overhangs its well by ~22px (14 today) and pokes above
the dock card's 3.75px top clearance: the F12 clip returns unless the card's top padding or
the tape's astride ratio moves, and the desk card is shrink-to-fit with 0.23px of iPad
headroom (two committed goldens walk on 6px of width). Three tongues on one edge must not
read as a second toolbar, which is M13's own fence.

```
 ╭──[ new game ]──────────────────────╮   tape astride the edge = group (h2)
 │  [size]  4×4   9×9̲   16×16          │   flat tape inside    = row (h2, same tuple)
 │  [level] easy̲                       │   pressed 0° / lifted 1.5° = the two tabs
 │  ────────────────────────────────   │
 │      ⚄ deal          dealt |||| |   │   the one boxed act, stroke 2.5
 ╰────────────────────────────────────╯
 ╭──[ pencils ]───────────────────────╮
 │  [marks]      normal̲  corner center │
 │  [what fits]  off̲   on              │
 ╰────────────────────────────────────╯
 ╭──[ checking ]──╮  ╭──[ players ]───╮
 ╰────────────────╯  ╰────────────────╯
 ═══════ card foot reserves the bar's height ═══════
 ╭────────────────────────────────────╮   the bar: a fifth compartment, stroke 1.5
 │   clear    fill    solve    share  │
 ╰────────────────────────────────────╯
```

### CTRL-B · THE RULED WORKSHEET

**Centre.** The compartment dies; the card is a lined page. Every group is a heading sitting
ON a drawn rule, set in the estate's own display face (Fraunces 800 lowercase, the
wordmark's face) at one fixed rung on every viewport, and rank below the heading is carried
by ink weight alone. Delineation is the rule, not the box.

**Substrate.** `.section-heading`'s role `--type-group-title` re-pointed to `--type-heading`
at every width (drop the 768 arm at `typography.css:133-137`; one right-hand side). The rule
is `pencil-draw-on` geometry (`pathLength="1"`, `--draw-dur`, `--ink-press-rule`), drawn once
at mount, or a pose-0 outline clipped to its top edge. `.tray-well` outlines retire;
`SheetWashiLabel` keeps only its hover and `center` tapes. The guard ribbon
(`GameGallery.vue:1003-1065`) lifted into a shared component and berthed in the bar's one
note berth (W2 §2.5's `.berth-note` seam).

**Decomposition.**
1. Voice: eight names → SIX `<h2>`s in one tuple (Fraunces · 25.89px · 800 · lowercase):
   `size · level · marks · what fits · checking · players`. `new game` and `pencils` retire
   as names because there is no compartment to name; `deal` sits under `level` as the staged
   ask's commit. The tier ink on `level` stays as DATA, one voice two inks, deliberately.
2. Sticky, the section-header law: each group is its own containing block, its header
   `sticky; top: 0`, the next header pushes the previous off (the list grammar). No group is
   taller than ~200px, so the "5% on screen" state cannot occur; a header carries its rule
   with it.
3. Buttons: NO border anywhere, `.info-glyph` included. Grade by glyph rank + word weight:
   act (`--icon-act`, w600), verb (`--icon-verb`, w500), tool (`--icon-tool`, w400), chip
   (Fira Code + scribble). One invisible 8px radius. Selected = scribble; pressed = scale
   .93; hover = ink lift. Focus: `2px solid var(--color-focus-sketch)` offset 3 (shared with
   MRK-B).
4. Mobile tabs (§8) DIE: on the phone `size` and `level` are two stacked rule-groups like
   every other (three chips each are cheap). The 0×0 panel defect is cured by hiding
   nothing; the CSS underline dies with the tabs. `level` drops from 3 taps to 2.
5. Bar (M04): one drawn TOP RULE, no box; the bar is the page's foot margin; sticky in all
   three scrollports; the players group ends above it via reserved padding (the 89.6%
   overlap is a layout row, cured here).
6. Tongue quick set (§14): the tongue carries the pencil MODE cycle (one chip that steps
   `normal → corner → center`, showing the current word; the deepest well's most-changed
   setting) plus `hint`. Undo and redo stay in the ribbon, and the ribbon turns on in
   landscape as a vertical strip on the LEFT flank (a media-key re-cut of `scene.css:394`
   that W2 carries).
7. Confirm (§15): the guard ribbon, berthed in the bar's note berth: `clear this board?` /
   `your marks aren't saved` / `keep` · `clear`; faces pose-0 at 2 and 2.5; the destructive
   face stroked and worded in `--color-red-ink` (R2's zero-chroma finding). One mechanism
   for deal · clear · fill · solve; the two-tap sublabel retires.
8. M03 air: the masthead's own band (8px under the wordmark's box), not the sheet's cap.

**Rejects.** Boxes on chrome (A and C keep them); tapes as names; the two-tap sublabel (A
keeps it); hiding any option row on any pose; a heading rung that changes with viewport.

**First runnable prototype.** The same overlay rig: `.tray-well .outline-svg,
.washi-tag { display: none }`, the rung re-point, a `::before` rule under each heading from a
static data-URI wobble line (`scribbleUnderline.ts`'s generator, one seed per heading),
`.mobile-heading-row { display: none }` and both `OptionSelector`s shown. Re-run ROW 1/2/3,
R7's I3 at five scroll states, and `access.spec.ts` 2.1's burial census against the overlay;
bank the 1440 rail at scrollTop 500 beside R7's `p7`.

**Risk.** Six Fraunces 25.9px headings in a 324px rail add roughly 6×(26 + rule) of height to
a card already 43% below the fold; the overflow worsens unless headings sit BESIDE their
chips at ≥1024 (a two-column rule-group). The ribbon berthed under the bar covers nothing but
must be reachable while the bar's verbs are inert (`access.spec.ts` 2.2 binds).

```
 size ───────────────────────────────   Fraunces 25.9 w800 lowercase, on a drawn rule
        4×4    9×9̲    16×16
 level ──────────────────────────────   (tier ink on the word: data, not chrome)
        easy̲   medium   hard
        ⚄ deal              dealt |||| |
 marks ──────────────────────────────
        normal̲   corner   center
 what fits ──────────────────────────
        off̲   on
 checking ───────────────────────────
        off   ask̲   live
 players ────────────────────────────
        ⚇ play
 ─────────────────────────────────── ← the bar's border: one pencil-drawn top rule
   clear     fill     solve     share
        [ clear this board?  keep · clear ]   ← the ribbon, in the note berth, armed
```

### CTRL-C · THE INDEX TABS

**Centre.** The card stops scrolling. Its compartments become INDEX TABS on the card's edge,
drawn in the drawer tongue's own idiom (the tongue is the precedent), one tray shown at a
time. The heading is the tab, the acts are the tray's floor, and hierarchy is EDGE (tab)
vs INSIDE (row) vs FLOOR (act).

**Substrate.** `DrawerTab`'s tongue (HandDrawnOutline 2.5 / outset 3, `--color-card`, washi
word w600 letter-spacing .06em, one-sided radius) as a `role="tablist"` of four (APG tabs,
roving tabindex). W2's dock and sheet mechanics unchanged: the sheet still rises, inside it
nothing scrolls. The bar becomes a pose-0 outline FLOOR at 2.5 holding clear · fill · solve
· share. A row tape (`anchor="row"`, as in A) for `marks` / `what fits`, in the tab word's
tuple.

**Decomposition.**
1. Voice: four tab words + four inside names → one tuple (Patrick Hand · 25.89px · 600 ·
   lowercase · .06em, the tongue's), rank by position; tabs are `h2 > button` (the shape
   already in the tree). `size` / `level` are two rows inside `new game`, never tabs.
2. Sticky: moot. The tallest tray (`new game`: two rows + deal) is ~260px and fits every
   cell, including 900×500's 284px.
3. Buttons: TONGUE (tabs and the drawer tongue), FLOOR (the acts' drawn box), CHIP
   (scribble); tools bare. `deal` is a boxed act inside its tray (pose-0 at 2.5).
   `.info-glyph` becomes a fifth tab `keys` on the desk. Focus: the tongue's dashed ring
   everywhere off the board.
4. Mobile tabs (§8): gone as a control; the whole card is tabs, on every platform.
5. Bar (M04): the floor, drawn at 2.5 as ONE piece with the tab strip's outline (a lid and a
   floor around the open tray). Always visible; nothing to bury.
6. Tongue quick set (§14): `undo · redo · hint` move ONTO the tongue strip at the board's
   edge on every mobile pose and the portrait ribbon (`#fold-tools`) RETIRES: one tool home,
   which cures the 844×390 hole with the same move. `peek` moves to the floor beside `share`.
7. Confirm (§15): the guard ribbon replaces the tab strip's row while armed (the one
   always-visible band); `keep` returns the strip.
8. Desk: the tabs run down the rail's LEFT edge in vertical writing-mode, index tabs on a
   notebook's side, facing the board; the tongue on the board's right flank is then one of
   the same family.

**Rejects.** Any scrolling inside the card; tapes as group names; the portrait ribbon as a
second tool home; a sticky law of any kind.

**First runnable prototype.** A throwaway git worktree (never this tree): an ~80-line
template patch on `GameControlPanel.vue` wrapping each `.tray-well` in a `v-show` keyed to a
tablist of four `DrawerTab`-styled buttons, overlay CSS for the floor. Measure: (a) card
`scrollHeight ≤ clientHeight` at 390×844, 900×500, 1280×800; (b) every option row reachable
in ≤2 taps from the playing view; (c) `access.spec.ts` 2.1/2.2 against the hidden trays
(inert); bank three crops.

**Risk.** Four of five groups are hidden at rest: the formation's own "0×0 until discovered"
defect, generalised, with only the drawn tab names to argue against it. The desk rail loses
its at-a-glance read. Tabs on the rail's left flank widen the row and walk the board 3px into
`cell-light` / `grid-corner-light` (two goldens). It leaves W2's sticky mechanics with no
job, and retiring the ribbon is W2's Teleport berth: the largest mechanics debt of the three.

```
  ┌new game┐┌pencils┐┌checking┐┌players┐      tongues, stroke 2.5, one raised
 ╭───────────────────────────────────────╮
 │  [size]   4×4    9×9̲    16×16          │
 │  [level]  easy̲   medium   hard         │
 │           ⚄ deal          dealt |||| | │
 ╰───────────────────────────────────────╯
 ╭───────────────────────────────────────╮   the floor: same stroke, one piece with the lid
 │   clear     fill     solve     share  │
 ╰───────────────────────────────────────╯
   board edge, portrait:  [undo][redo][hint][controls]     one tool home
```

---

## Front 2 · THE ACCENT FAMILY (§3 · §4 the fill meter · §12 multiplayer chrome; M07)

Both families move `--color-user-ink`'s HUE to crayon-blue's; that move is shared and said
here once. They part on what the violet is, what the meter is, and what a peer's ink is made of.

### ACC-A · FIVE CRAYONS, NO SIXTH

**Centre.** Every interactive accent is an alias into the five crayons, hue-locked within 5°
(the house's own loosest lock), with contrast bought by LIGHTNESS alone. The violet dies,
your pen becomes crayon-blue's ink tier, and progress is gold because gold is earned light.

**Substrate.** `index.css` `@theme` + `.dark`: `--color-blue-ink` (crayon-blue darkened to
≥4.5:1 on `--color-card`, the exact `red-ink` move) with `--color-user-ink` aliased to it
(24 consumers untouched); `--color-progress-ink` → crayon-gold light / gold dark (ONE
consumer, `HandDrawnGrid.vue:471`); `--color-focus-sketch` gains its dark arm (crayon-blue
dark, 6.42:1, the comment made true); the sparkle glow (`GameControlPanel.vue:2081,2087`) →
`var(--color-crayon-gold)` at .3/.6; the rainbow stays the ONE declared exception; the
confirm's destructive face → `--color-red-ink`.

**Decomposition.** (1) Authorship: blue-ink, one hue with the unit wash and the ring,
separated from focus by chroma and weight (pen ~0.20 vs ring 0.13). (2) Progress: a gold
trace that BECOMES the solved frame at 100%, so the meter's form is the celebration
arriving; no label; the graphite frame is the empty gauge, so nothing renders at 0%. (3)
Focus: one hue, both themes. (4) Peers (§12): the walk keeps its formula but at the wax's
chroma 0.166 and with RESERVED ARCS skipped (rose 0–26°, orange/gold 60–100°, blue 240–275°,
violet 280–305°), so no peer is a crayon, a verdict or the machine; the join trace is the
peer's ink. (5) Chrome stays achromatic: the active heading's tint retires to the chip.

**Rejects.** A sixth crayon; any named violet; Tailwind provenance; hue carried by chrome.

**First runnable prototype.** `addStyleTag` overriding the six tokens in both themes; re-run
`r2-accent-family/probe/accent-kinship.probe.ts` (rows 1–4 must green, row 5 stays green) and
`r5-player-mark/instruments-family-law.mjs` with the arc-skip walk; canvas read-back of 144
indices on four grounds; two 330×210 board-corner crops beside R2's.

**Risk.** The dark trace over `--grid-line-color` sits at 3.07:1 today on violet; gold's dark
arm is LIGHT (L high) over a light warm-grey frame and may fall under 3:1 there. "Gold comes
to the page only when the work is done" is contradicted by a gold stripe at 5%. Blue-ink at
≥4.5:1 is darker than today's 5.08:1 blue-600, and the print (#000) and forced-colors
(CanvasText) arms must survive the alias.

### ACC-B · THREE MATERIALS (wax · pen · answer)

**Centre.** The family law is MATERIAL, not hue. Wax (the five crayons) carries state; PENS
(your hand and every peer's) are hue-kin to the wax but a step more saturated; the ANSWER
family (the rainbow and its violet) is the declared foreign ink, named as such, and the fill
meter joins it because it measures how much of the board is answered.

**Substrate.** `--color-crayon-violet` = `solver-ink-2` (#7c3aed light / #c4b5fd dark) named
once and aliased by `--color-progress-ink`, rainbow stop 2 and the sparkle glow (three sites →
one token); `--color-user-ink` re-hued to 251° at chroma ~0.21 (kin by hue, pen by chroma);
`--color-focus-sketch` dark arm; peer chroma raised 0.11 → 0.20 (the pen's) at the same
lightness band; the confirm's face in red-ink.

**Decomposition.** (1) Wax unchanged. (2) Pen: user-ink hue-locked to crayon-blue, chroma
kept high; peers at the pen's chroma, band unchanged. (3) Answer: violet named; rainbow
unchanged; the meter violet and LABELLED as the answer's: a count tape at the frame's head on
the first three fills of a session (`of the board filled` as a whisper that ages), then
quiet. (4) Roster: pens only, you and every peer the same material on every page.

**Rejects.** Killing violet; gold as progress; chroma parity between wax and pens; an
unlabeled meter.

**First runnable prototype.** Token overlay plus a scratch tape node injected at the frame's
top-right on a fill event; re-run the kinship probe with the answer family added to the
EXCEPTED set (a ruling the probe must record in its own file), plus the toll row over the new
peer chroma; crops light and dark.

**Risk.** Chroma 0.20 at L 0.5 pushes some hues out of sRGB (clipped, so two indices may
paint alike); the exception list grows from two to three, which bends the instrument's law;
a count tape is a new rendered string (font re-cut) and digits in the hand face are
unverified in the subset.

---

## Front 3 · THE MARKS (§5 wobble · §6 focus rings)

### MRK-A · ONE HAND, ONE BEAT

**Centre.** The most-watched mark breathes with the board: the selection ring is a four-pose
stack on the ACTIVE cell riding the shared `boilFrame`, its amplitude re-based to an absolute
px target so a cell edge wanders as much as a rule; and off the board there is ONE floating
hand-drawn focus ring, a single SVG node that moves to whatever has focus.

**Substrate.** `gridPaths.generateCellRects` → `perturbPointsClosed` / `boilRectFrames`
(pencil-boil, already exported, the `generateRectBoilFrames` grammar) for four poses;
roughness = 0.4 × (ruleLen / edgeLen), capped; `DigitCell` mounts the stack only on the
focused cell (`v-if="isFocused"`, 81 → 1 stack); the peer wash becomes a filled path on the
same seed (no stroke); a `FocusRing.vue` singleton (pose-0 outline geometry, outset 3, stroke
2, `--color-focus-sketch`) positioned by the focused element's rect on `focusin`, hidden
under forced-colors where a real outline stays.

**Decomposition.** (1) Amplitude: absolute target σ ≈ 1.0px at 1280, inside [0.72, 2.89].
(2) Liveness: four poses at the grid's 150ms, active cell only. (3) Wash: a filled wobble
path. (4) Focus off-board: one ring, one owner, everywhere (controls, masthead links, toggle,
deck card, tongue), replacing six bespoke rects and the UA default; the two 2.70:1 rings are
cured by the token (3.63 / 6.42); the deck ring's 3.6px headroom binds the outset. (5)
Modality: one mark for every pointer; the false comment at `gameCell.css:243` is deleted.

**Rejects.** Proportional-only amplitude; a frozen ring; per-control ring CSS; a second
cadence.

**First runnable prototype.** Worktree: ~30 lines in `gridPaths.ts` (roughness rebase) and
`DigitCell.vue` (four-pose stack on focus); `FocusRing.vue` as a ~60-line singleton mounted in
`App.vue`. Re-run R3's `wobble.probe.ts` (R3-a must green at 4/9/16), `budget.probe.ts`
(9/9/9 and DOM count 81 → 85), `marks2` R3-e (deck ring whole), focus-contrast (all ≥3:1
with the subject-count guard); one dpr3 crop beside `ring-on-grid.png`.

**Risk.** A ring that boils on a still board reads as a cursor blink, motion nobody asked
for. A floating ring lags Teleport and the sliding sheet (700ms), and a ring on every arrow
press costs a stack per keystroke at 16×16.

### MRK-B · THE FROZEN HAND

**Centre.** A mark of ATTENTION holds still while the paper breathes. The ring keeps its
hand-drawn geometry and its stillness by ruling, its wander stays proportional (same
pressure, shorter stroke), and every focus ring off the board is one designed token rect:
`2px solid var(--color-focus-sketch)`, offset 3px, both themes.

**Substrate.** `gameCell.css:245` unchanged in geometry, the stroke gaining the baked grain
via the existing pose-0 bake path (no filter); `index.css:445`'s `outline-ring/50` replaced
by a base-layer `:focus-visible` rule; the six bespoke rects deleted (the toggle keeps its
54px-offset geometry); `--color-focus-sketch`'s dark arm; the wash stays a CSS box and the
law exempts fills.

**Decomposition.** (1) R3-a is re-based to the proportional law (a band on roughness, not
on σ). (2) Grain on the ring's stroke. (3) One token ring: 3.63 light / 6.42 dark, curing
`.logo-trigger` and the deck card. (4) One mark for every pointer.

**Rejects.** Boil on the ring; absolute σ targets; a floating ring; drawn rings on chrome.

**First runnable prototype.** Overlay CSS (the token ring) plus a 6-line `gameCell.css` patch
in a worktree for the grain; re-run focus-contrast both engines (subject count ≥3), the deck
ring §3.7 row, and `wobble.probe.ts` with the proportional variant; contrast on four grounds.

**Risk.** Leaves R3-a RED as written, a law dispute the adjudicator must rule on; a geometric
rect ring on drawn chrome is what §6 was written against.

---

## Front 4 · THE PLAYER MARK (§11 icon · lobby · per-player colour; M14)

Both bind SELF to `k[self]` when a room exists (F1 cured) and bind nothing solo (byte-identical).

### PLR-A · THE CRAYON STUB AND THE ROSTER CARD

**Centre.** The mark is a small crayon stub beside `@mbabb`, coloured in YOUR room ink, and
pressed it opens the `@mbabb` card's twin listing everyone in their inks. The colour system
stays a WALK, but a walk over the arcs the house has not reserved, at the wax's chroma, and
you join it.

**Substrate.** `AttributionCard`'s pose (fixed at `--head-rule`, left 0; 256×151, popover at
80%, 2px border at 30%, radius 16) as the lobby's shell; a `PlayerMark.vue` 44×44 trigger at
x≈84 inside the phone's 250px free band; `inkFor(index)` → a walk over the allowed arcs
(skip rose 0–26°, orange/gold 60–100°, blue 240–275°, violet 280–305°; the remaining ~155°
stepped by 137.5° modulo the arc), chroma 0.166; rows: a crayon-stub swatch (one `wobbleRect`
fill) · name · `you` beside the name; a state line (`only you` / `3 here` / `connecting`);
the link with one copy act; `leave`. The well keeps invite and leave (M14: controls stay in
controls).

**Decomposition.** Mark (rest: a graphite stub, no room; live: your ink), lobby (a mirror of
the well's roster), palette (the arc walk), speech (the mark's accessible name is the state
line; the roster's `role="log"` stays the one announcer).

**Rejects.** A bounded palette; moving the well; a dot swatch; cursor positions in the
lobby; any "connected" dot.

**First runnable prototype.** Worktree: `PlayerMark` plus a copy of `AttributionCard`'s shell
with roster rows; `inkFor` patched to the arc walk. Run R5's I2/I3 (must green), I1 with the
arcs (must green over 16), canvas AA read-back over 144 arc-walk indices on four grounds; one
head-left crop open and closed.

**Risk.** Skipping ~205° leaves ~155° of wheel: at 16 players the minimum separation falls to
~9°, under the full walk's 12.5°. Two rosters say one thing twice (W3's one-region law).
`just you` is not drawable in Patrick Hand (`j`); the state line must be `only you`.

### PLR-B · THE CRAYON BOX

**Centre.** A designed BOX OF TWELVE kin crayons is the palette; the mark shows the box's used
stubs (one per player, in colour, up to four then a count), and pressed it brings the roster
ITSELF up out of the controls card, one surface moved, the well keeping only invite and leave.

**Substrate.** `--color-peer-1..12` in `index.css` (two arms each; five on the wheel's
anchors, seven interpolated between them, none inside a reserved arc); `inkFor(index)` →
`peer-(index mod 12)` with a lightness step on the second lap; the roster markup
(`GameControlPanel.vue:1086-1188`) teleported into a head popover; the mark is a stack of
stubs.

**Decomposition.** Palette (12 named), mark (stubs), lobby (the roster moved), self
(`k[self]` on every page).

**Rejects.** The golden-angle walk; an unbounded palette; a mirror roster.

**First runnable prototype.** Twelve tokens in an overlay; canvas AA over 24 indices (two
laps) on four grounds; I2/I3; Δh to the 29 reserved inks for all 12 (must clear 12°); a
stub-stack mock at 390 and 1280.

**Risk.** Cap-free by lightness step is honest only if the second lap is distinguishable (the
13th player is the 1st a shade off). Moving the roster out of the well touches three live
regions W3 just landed. No player may be assigned wax (law 21): the twelve must be pens
beside the anchors, never the anchors.

---

## Front 5 · THE TRANSITION GRAMMAR (§13; M02 M09's design half)

Both home every literal; both arm the three PRM-less files; both make G1/G7 one curve; both
name the exit fold's dead mover as a MECHANISM row (`App.vue:447 restoreBoardAnims` finishing
the host's own animation), not a curve to retune.

### MOT-A · THE DURATION LADDER

**Centre.** `MOTION` gains a named duration ladder and every shipped transition reads a
rung: `whisper 150` (tape, ink lift), `leave 200`, `note 250` (write-in), `step 440`,
`throw 520`, `dusk 350`. The dock inherits `throw`; durations reach CSS as `--motion-*` from
one publisher.

**Substrate.** `pencilConfig.ts` MOTION `{whisperMs, leaveMs, noteMs, stepMs, throwMs,
duskMs}`; a `--motion-*` publisher lifted from the `--card-step-ms` precedent
(`GameGallery.vue:930`) to the App root; `GLIDE_MS` → `MOTION.throwMs`; the 16 incidental
sites take a token; `transition: all` banned by `check-motion-contract.mjs` (R4's i2 lifted
into it); G7 → `--ease-fadeOut`; the dusk homed at 350 on `--ease-standard`.

**Decomposition.** Ladder → publisher → consumers → lint.

**Rejects.** A verb vocabulary; per-pose durations for the dock; beat quantisation.

**First runnable prototype.** Worktree patch; R4's i2 (0 incidental) and i3-B (0 homeless)
must green; the 390×844 frame trace unchanged.

**Risk.** Naming moves nothing the owner SEES; M09 is smoothness on a device. Re-homing the
dusk re-opens the P1-W3 +23.5fps cure unless its tween set stays the five narrowed selectors.

### MOT-B · FOUR PENCIL VERBS

**Centre.** Every transition is one of four acts a hand makes on paper, and each act owns
ONE curve and ONE duration pair: LAY DOWN (glass; throw 520 / step 440), LIFT (`accelIn`,
200: the erase asymmetry the laminate already proves), WRITE (`noteWrite` / `drawOn`, 250),
DUSK (`standard`, 350). A surface names its verb; incidental easings are assigned, never
retuned.

**Substrate.** `MOTION.verbs {layDown, lift, write, dusk}` each `{ms, curve}`; CSS
`--verb-*` pairs; the dark toggle's eleven values collapse to WRITE (icon swaps), LIFT (the
tuck-in), DUSK (the page), and CELEBRATION-class keyframes (squash, plush, kept); G1 and G7
both LIFT; the gallery exit's board fold plays LAY DOWN once the restore ordering is cured.

**Decomposition.** Verbs → pairs → assignment table → lint on unassigned.

**Rejects.** A size ladder without meaning; a fifth verb; the drawer re-eased.

**First runnable prototype.** Worktree: `MOTION.verbs` plus one consumer per verb (drawer =
layDown, chrome-leave = lift, margin note = write, page = dusk); i2/i3 re-run; a six-flip
theme trace at 4× to confirm the dusk's narrowed selectors keep the +23.5fps.

**Risk.** The dusk is disabled by `useTheme`'s `disableTransition`; re-enabling any page tween
is the P1-W3 cure reopened and W8 must prove it on device.

---

## Front 6 · THE NOTE'S LIFE (§7)

### NOTE-A · WRITTEN, THEN QUIET, THEN ERASED

**Centre.** A margin note lives like pencil: written in (250ms), it SETTLES to the quiet
rung after eight beats, and it is ERASED (the write-in reversed, 200ms, the erase asymmetry)
by the next thing that changes what it said: your own write, the board leaving, or a newer
note. A peer's keystroke does not take your note unless it writes the cell the note names.

**Substrate.** `MarginNote.vue`: `.margin-note-ink` gains `data-age` (fresh / quiet) and a
leave transition on `--ease-accelIn` (clip-path retreat); `GameBoard.vue:685-707`'s falsy arm
gains an authorship test (local vs `sessionSource`) and a cell test; the five null sites in
`useGameState.ts` unchanged; PRM: an opacity step only.

**Decomposition.** Three states (fresh · quiet · erased); the retraction set (local write ·
deal · clear · fill · solve · Escape to the gallery · a newer note); the survivors (dark
toggle, scroll, arrow, no-op undo, P, K, blur); ageing 8 beats → `--ink-press-quiet` 68%
(5.23:1, AA holds); the refusal note shares the grammar at a one-act life; the conflict
verdict unchanged.

**Rejects.** An explicit dismiss; a timed vanish (the note never leaves on its own); a note
that outlives its board.

**First runnable prototype.** Worktree patch (~25 lines) plus R3's hint-note probes re-run
with two new rows (a peer's digit elsewhere: stands; a peer's digit on the named cell:
erased); 30s idle → opacity 0.68.

**Risk.** The quiet rung on the phone's 16px hand face sits at the AA floor's edge; an
authorship test needs the write's SOURCE, which `applyCellValue` does not receive today (a
seam change in W1's file).

---

## §9 / B1 · copy recut candidates (not a family)

| string | candidates | preferred |
|---|---|---|
| `the solver finishes the board` (Solve hover tape) | `fills in the whole board` · `finishes every cell` · `finishes the board for you` | `fills in the whole board` (its vocabulary is already on the Fill tape beside it) |
| `candidates` (row caption, `aria-labelledby` target, 3.75rem column) | `what fits` · `possible digits` · `options` | `what fits` (the hint tape's own words shortened; no `j`/`x`; fits the column) |
| `solver's answer N` (revealed cell's accessible name, `useGameCell.ts:153`) | `answer N` · `revealed N` · `filled-in N` | `answer N` (completes clue / entry / answer) |

Every recut strikes its `ADMITTED` row in `check-copy-register.mjs` in the same commit, and
the third widens the gate's corpus to computed accessible names so the cure is visible to the
gate that missed it.

---

## Rejected formulations (rewordings or defaults, refused)

- **Tape + Fraunces both kept, sized to one ratio.** HEAD with a number changed; leaves three
  voices and two ranks. Rewording of nothing.
- **The bar's border as a CSS border.** A second box grammar (law 37); refused before it was
  drawn.
- **A second `BoilDivider` as the group rule.** Refused twice in source; 9 → 13 filters.
- **A modal lobby.** M14 says not a modal.
- **Peers quantised onto the five crayons.** Law 21: no player is assigned wax.
- **A boiling ring on all 81 cells.** 1,024 paths at 16×16; the DOM budget a filter count
  cannot see.
- **Notes stacking in the margin (last three).** A new surface on the board margin and a
  second status voice; not a lifecycle, a ledger.
- **Quick set = fill / solve.** Cheapens two acts M12 guards.
- **A shorter dock band (e.g. 400ms).** Allowed as a per-pose duration, but nothing measured
  locally convicts 520 and W8 owns the device; a number, not a centre.
- **Beat-quantised durations.** 520 is owner-ruled and is not a beat multiple.
- **A "materials" ring (MRK) as a third family.** Shared MRK-A's floating ring and MRK-B's
  token; merged into the two.
- **A tape with a crayon-coloured edge for `level`.** Washi is neutral, never a hue (law 17).

## Notes for the adjudicator

- CTRL-A and CTRL-C share the row tape and the tongue's dashed focus ring; CTRL-B and MRK-B
  share the token focus rect. Those are moves, not centres.
- The bar-over-players overlap (23,585px², R7) is cured by all three CTRL families as a
  layout row; whichever wins carries it explicitly.
- The exit fold's dead board mover is a mechanism defect (`App.vue:447`), not a design row;
  both MOT families assume it is cured before any curve is judged.
- The 390 case-stroke / wordmark seam has three cures across the CTRL families (sheet cap ·
  masthead band · stroke weight); one must land, and it must clear 375 by two stroke widths.
- Instruments to reuse unchanged in round one: R1 `heading-voice.spec.ts`, R7 I2/I3/I4, R2
  `accent-kinship.probe.ts` (with its EXCEPTED set recorded when ACC-B bends it), R3
  `wobble.probe.ts` / `budget.probe.ts` / `marks2`, R5 I1–I5, R4 i1–i3.
- Prototypes marked "worktree" run in a throwaway `git worktree`, never this tree, and their
  screenshots are crops ≤150 KB under `evidence/w7/loop/r1/`.
