# T9-W7 round zero — the OPUS portfolio

Author: opus lane. Read-only on the product. Sixteen families across seven subjects,
each with one architectural centre, its substrate, what it refuses that its siblings
allow, the smallest runnable prototype that would prove or kill it, and its risk.

The censuses (R1–R7) are the ground. Every number cited below is theirs, re-derived on
this tree, with its viewport. Nothing here is a mechanism proposal: W2 already landed
the sticky, the dock and the board-edge tongue, and this wave designs the VOICE on top
of them.

---

## 0. The reading that organises the portfolio

Three facts from the censuses decide more than any taste question:

1. **The card has no box grammar — it has five.** Five corner radii (0 / 6 / 8 / 12 /
   50%), exactly one drawn border in the whole card (`.info-glyph`, 1.5px
   `--ink-press-rule`), four tray-wells stroked at 1.5 and a case at 3, and a floating
   bar with no edge at all that sits on 89.6% of the `players` group (R7). M04 is not
   "the bar needs a border" — it is "the card needs to decide what a box means."
2. **Two typefaces are already doing two jobs and nobody wrote the law down.** Fraunces
   800 lowercase names two of eight groups; Patrick Hand names the other six AND writes
   every option value, every sublabel, every slug and the tally. The face is currently
   chosen by history. It could be chosen by meaning.
3. **Colour in this product means four different things at once.** Wax = difficulty,
   rainbow = the machine's answers, peer walk = who wrote it, and then a stock Tailwind
   blue for your hand, a second stock blue 9.6° away for focus, a violet for progress
   and a crayon green for an active heading. Eleven of twenty-two inks are verbatim
   Tailwind; zero of the five crayons are (R2). The hand-cut palette is the one the
   player never touches.

Every controls family answers (1), every accent family answers (3), and CTRL-D is (2)
raised to a law.

---

## 1. THE CONTROLS SYSTEM — §10 with §1, §2, §8, §14, §15 inside it

Four families. They differ in what carries structure: **drawn rules and a margin**
(A), **disclosure** (B), **consequence** (C), **typeface semantics** (D).

### CTRL-A — THE RULED PAGE

**Centre.** The controls are one ruled worksheet page, not a stack of boxes. Structure
is carried by a single graphite hairline between bands and a left margin column that
holds every group name. Nothing nests.

**Substrate.** One rule token (`--ink-press-rule`, 55%, 3.53:1 light — already AA for
non-text and already the `.info-glyph` weight, so no new ink). A two-column grid on
the card: `[name] clamp(88px, 22%, 132px) [field] 1fr`. The four `.tray-well`
`HandDrawnOutline`s retire; the case keeps its stroke 3. The washi tape stops being a
name and goes back to being a note — the one thing tape is for.

**Decomposition.** Card = case stroke (3) → bands separated by one rule (1.5 →
hairline) → each band = `name | field`. The name is set once, at one rung, in the
margin; it never moves, never pins, never dissolves, because it is beside its own
content instead of above it. §8's mobile tabs disappear: with a margin column, `size`
and `level` are two bands, not two tabs, and the 0×0 hidden panel dies with them. §2's
button system grades by fill and rank, not by border: option chips are bare words with
the seeded scribble underline for chosen; acts are the only boxed things, boxed with
`HandDrawnOutline :pose="0"` at stroke 2 (zero filters, the guard-ribbon precedent).
§14: the tongue carries the three acts the margin can't reach mid-play — `hint`,
`fill`, and the marks mode — never `deal` or `clear`. §15: the armed verb's box stays
the same box; the word inside it changes to `sure?` and a bare `no` appears beside it
inside the same band, so nothing reflows and no surface appears from nowhere.

**Rejects (what siblings allow).** Nested drawn boxes. A group name that scrolls. Any
group name above its content. The washi tape as a heading. B's disclosure — every
group is visible at once, always.

**First prototype.** A static page under this lane's evidence dir that renders one
game's real control set in the ruled grammar at 390×844 and 1280×800, served on
127.0.0.1:4243 and measured by a scratch Playwright config: (a) group-title ÷ option
size ≥ 1.294 at both cells, (b) box-grammar count == 1 (the case) + 1 (the act
outline), (c) zero group names at visFrac < 1.0 at any scroll offset, (d) total
content height vs scrollport at 390×844 and 900×500 — the family dies if the margin
column costs more height than the wells it removed.

**Risk.** The margin column costs horizontal room the desk rail (324px measured, R7)
may not have; at 390 a 88px margin leaves 278px of field for `easy medium hard` at
20px. If the margin has to collapse on the phone, the family collapses into CTRL-D and
should be merged rather than shipped half.

```
 1280 desk rail                              390 dock
 ┌─ case, stroke 3 ───────────────────┐      ┌────────────────────────┐
 │ new game │ ⌈deal⌉        dealt ⊪   │      │ new game│⌈deal⌉ dealt ⊪ │
 │          │ size   4  [9]  16       │      │         │size  4 [9] 16 │
 │          │ level  easy [medium] hd │      │         │level easy[md] │
 │ ─────────┼───────────────────────  │      │─────────┼───────────────│
 │ pencils  │ marks  [normal] cnr ctr │      │ pencils │marks [normal] │
 │          │ what fits   [off]  on   │      │         │what fits [off]│
 │ ─────────┼───────────────────────  │      │─────────┼───────────────│
 │ checking │ off  [ask]  live        │      │checking │ off [ask] live│
 │ ─────────┼───────────────────────  │      │─────────┼───────────────│
 │ players  │ ⌈play together⌉         │      │players  │⌈play together⌉│
 └────────────────────────────────────┘      └────────────────────────┘
   clear   fill   solve   share  ← the bar: one drawn TOP rule, same hairline
```

### CTRL-B — THE TABBED DIVIDER DECK

**Centre.** The card is a tabbed file divider: the four washi tapes are promoted to
real tabs on the card's top edge, one compartment is face-up at a time, and the card
never scrolls. The overflow (43% of the desk card, 58% of the landscape card below the
fold — R1) is cured by not showing everything.

**Substrate.** `SheetWashiLabel` re-anchored to the case's top edge as a tab strip;
the existing `display: contents` heading host the mobile tabs already use
(GameControlPanel.vue:786-793) generalised to all four, so the tab IS the document
heading and the one-string law holds (the tape's literal is already the well's
accessible name). `role="tablist"` / `role="tab"` / `role="tabpanel"` replaces four
`aria-labelledby` wells. One voice by construction: there is exactly one kind of group
name, and it is a tab.

**Decomposition.** Case → tab strip (sticky by being the card's top edge, not by
`position: sticky`) → one panel. §1 is answered by promotion, not by sizing: the tab
takes `--type-group-title` at both widths, selected at full ink, unselected at the 68%
quiet rung, and the tape's ±1.5° rotation is kept only on the selected tab (the one
that is "pulled out"). §8 stops being a special mobile case — the phone and the desk
run the same tablist, which is B6's "one grammar desktop and mobile" taken literally.
§2: inside one panel there is room for the act to be a real drawn button and the
options to be bare words; four treatments fall to two. §14: because the card is now
two taps deep, the tongue must carry the between-moves set — `hint`, `fill`, marks
mode — or the family fails its own cost test. §15: the armed verb takes over its
panel's footer line, with `sure?` and `no` at act rank.

**Rejects.** Seeing every compartment at once. Scrolling as navigation. The desk's
at-a-glance whole. A tape that lies flat on a surface (tabs stick out or they are not
tabs).

**First prototype.** Patch the live app from outside via Playwright
`addStyleTag`/`evaluate` on 127.0.0.1:4244 (no product file touched): hide all but one
`.tray-well`, float the four tapes to the case's top edge, and measure — (a) card
scrollHeight ≤ scrollport at 390×844, 900×500 AND 1280×800, (b) every act reachable in
≤ 2 taps from the playing view, (c) tab targets ≥ 44×44 in BOTH dimensions with a
per-dimension negative control (the `.mobile-heading-btn` 44×44 trap, R1), (d) the
44px floor against four tabs in 366px of paper width.

**Risk.** Four tabs × 44px minimum = 176px plus seams in a 358px row: it fits at 390
and does not fit if a fifth compartment is ever added. And the desk rail's whole value
today is that a player sees the state of every setting at once; hiding three of four is
the most reversible-looking and least reversible decision in this portfolio.

```
   ╱new game╲  ╱pencils╲  ╱checking╲  ╱players╲     ← tapes as tabs, selected pulled out
 ┌──────────┴──────────────────────────────────┐
 │                                             │
 │    ⌈ deal ⌉                      dealt ⊪    │
 │                                             │
 │    size    4      [9]      16               │
 │    level   easy  [medium]  hard             │
 │                                             │
 └─────────────────────────────────────────────┘
      clear    fill    solve    share
```

### CTRL-C — THE CONSEQUENCE LADDER

**Centre.** The card is ordered and drawn by **what an act costs**, not by topic. Three
tiers: things that change only what you see, things that change the board and can be
undone, things that throw the board away. Weight tracks consequence, and the confirm is
not a face that appears — it is a state the heaviest tier is already shaped for.

**Substrate.** Three band names replace five compartment names (so §1's "one voice for
eight names" becomes "one voice for three", and the eight-node census collapses at the
source). Weight ladder: tier 1 = bare word, no box, chosen marked by the seeded
scribble; tier 2 = `HandDrawnOutline :pose="0"` stroke 2; tier 3 = the same outline at
stroke 2.5 (the guard ribbon's own leave-verb weight, GameGallery.vue:1450 — already
owner-passed twice) plus a reserved second line inside the band.

**Decomposition.** `looking` (marks · what fits · checking · size · level — none of
them touch a written digit) → `writing` (hint · fill · undo · redo — all undoable on
W1's widened spine) → `starting over` (deal · clear — both guarded). The bar stops
being a floating strip of unlike things: `clear` leaves it for tier 3, `fill` and
`solve` go to tier 2, `share` is not an act on the board at all and moves to the
players band. That is M04 answered by deletion — there is no orphan bar left to give a
border to. §15 is the family's centre, not an appendix: tier 3's controls are laid out
at their ARMED size from the start, so arming swaps words inside a box that never
moves, and M12's "simply, without contrivance" is satisfied by nothing appearing.
§14: the tongue carries tier-2 acts only — never a tier-3 act, by law.

**Rejects.** Topic grouping. Five compartments. A confirm that appears (a ribbon, a
sheet, a dialog, anything that reflows). A destructive verb one tap from a tool.

**First prototype.** A static page rendering the three tiers with a live arm/disarm on
`deal` and `clear`, at 390×844, plus a probe that asserts (a) zero layout shift between
resting and armed (`getBoundingClientRect` on the band before/after, Δ == 0 on all four
sides), (b) every tier-3 act writes nothing on the first tap on a dirty board (R7's I4,
which is RED at HEAD for `fill`), (c) the card's content height falls below the
scrollport at 900×500 (58% below the fold at HEAD).

**Risk.** It re-sorts a taxonomy the owner has been reading for four tranches. `size`
and `level` sitting under `looking` is arguably a lie — changing level deals a new
board in some flows — and if it does, tier 1 has to shed them and the family's three
clean tiers become four.

```
  looking                                      (nothing on the board moves)
      marks       [normal]  corner  center
      what fits   [off]  on
      checking     off  [ask]  live
      size         4  [9]  16
      level        easy  [medium]  hard
  ─────────────────────────────────────────────
  writing                                      (undo puts it back)
      ⌈ hint ⌉   ⌈ fill ⌉   ⌈ undo ⌉   ⌈ redo ⌉
  ─────────────────────────────────────────────
  starting over                                (asks first)
      ⌈ deal ⌉            ⌈ clear ⌉            ← boxes sized for the armed words
      ⌈ deal — sure? ⌉ no                      ← armed: same box, same place
```

### CTRL-D — PRINTED AND WRITTEN

**Centre.** A single semantic law for the two faces, applied estate-wide: **Fraunces is
what the sheet came printed with; Patrick Hand is what a pencil put there.** Size stops
being the hierarchy device; the face is.

**Substrate.** Zero geometry moves. The change is which `@utility` a node reads, plus
one right-hand side per role token — the seam W2 §2.6 landed precisely for this
(`--type-act` / `--type-verb` / `--type-tool` / `--type-tag` / `--type-group-title`,
typography.css:106-170, all computed-identical today so the re-point is one block).

**Decomposition.** Printed (Fraunces 800 lowercase): every group name (all eight, one
voice, one rung), the act verbs, the board's own printed furniture. Written (Patrick
Hand): every option VALUE, every sublabel, the tally, the slug, margin notes, the
solver's answers, your digits. The law resolves §1 without picking a number: the
group name is Fraunces and the option under it is Patrick Hand, so they are never
confusable even where the phone's ratio is 1.0175 — and then the ratio is set to the
desk's own shipped 1.294 as a floor because it costs nothing to keep. It resolves §8:
`size` and `level` are printed names, so they take the printed face and the underline
idiom dies — the chosen OPTION keeps the seeded hand-drawn scribble (a pencil mark
belongs under a pencilled word), and the CAD-straight `text-decoration` underline 40px
above it retires. It resolves the four-tapes-dissolve problem by making the name legible
at a glance even at 20px. §2 rides along: a printed word is never boxed, a written word
is never boxed, and the ONLY boxed things are acts — which is also M04's answer (the
bar holds acts, so the bar is drawn; the wells hold settings, so they are not).

**Rejects.** Hierarchy by size. Three voices. The tape as a name-carrier. A chosen
option marked by a CAD underline. Any new geometry at all — this family explicitly
refuses A's rules, B's tabs and C's re-sort, and can be adopted UNDER any of them.

**First prototype.** The cheapest in the portfolio, and the one that kills fastest: a
Playwright run on the live dev server that injects one stylesheet re-pointing the five
role tokens and the two `@utility` families, screenshots the same four crops the owner's
Frames A/B show, and runs R1's `heading-voice.spec.ts` unchanged — ROW 1 (one voice
tuple) and ROW 3 (ratio ≥ 1.23) must go GREEN at all four cells with no other change.
Plus `node scripts/check-font-coverage.mjs`: the Fraunces subset is cut from RENDERED
text, so moving six names into Fraunces is a font re-cut and the prototype must price it
in the same run.

**Risk.** Fraunces 800 lowercase at 14–20px is a display cut doing caption work; it may
read as shouting in a compartment tape and it will cost woff2 bytes for six new strings.
And the wordmark is Fraunces 800 lowercase — six small copies of the masthead's own
voice inside the card may flatten the masthead. Mitigation to test in the same run: a
lighter Fraunces weight for group names, which the ransom-note law makes a second subset.

```
  FRAUNCES 800 lowercase  →  printed on the sheet
      group names (all 8)     acts: deal · clear · fill · solve · share
  PATRICK HAND            →  written on the sheet
      option values           sublabels · tally · slug · margin notes · digits

  --type-group-title : --type-subheading (<768) / --type-heading (≥768)   20.35 / 25.89
  --type-option      : held at ≤ title ÷ 1.294 at every arm              15.7 / 20.0
  chosen option      : the seeded scribble (OptionSelector.vue:123-126), one idiom
  text-decoration underline on a tab head : RETIRED
```

---

## 2. THE ACCENT FAMILY — §3 + §4 + §12

Three families: **grow the wheel** (A), **shrink what colour means** (B), **make the
palette a finite object with an allocator** (C).

### ACC-A — THE SIXTH CRAYON

**Centre.** The wheel has one hole (122.8° between crayon-blue 251.4° and crayon-rose
14.2°) and three separate things already reach into it (progress-ink 292.7°, solver
stop 2, the hardcoded sparkle glow). Cut a sixth wax stick there, name it, and bring
every homeless accent home to a crayon.

**Substrate.** One new crayon (a plum/violet wax near 293°, which is where
`--color-progress-ink` and `--color-solver-ink-2` already sit — so the hex may not even
be new: dark progress-ink #7c3aed IS light solver-ink-2 #7c3aed, byte-identical, R6).
Then the existing pattern applied without invention: `--color-blue-ink` derived from
crayon-blue for your hand (replacing stock Tailwind blue-600, 11.5° off family);
`--color-focus-sketch` gains the dark arm its own comment already claims; the sparkle's
two inline `rgba(196,181,253,…)` literals become the token.

**Decomposition.** Six wax sticks → each with its darkened hue-locked INK tier where it
must carry text (the move `red-ink`/`green-ink`/`orange-ink` already model, ±5° hue
lock). Jobs: green/orange/rose = difficulty · gold = done · rose = wrong · blue = your
hand AND focus (they are the same job — the thing you are touching — so the 9.6° gap
closes to 0 and one of the two tokens dies) · plum = progress and the solver's second
stop. The peer walk QUANTISES onto 12 hues derived as the six crayons × two lightness
bands, cycling; the 13th player re-uses hue 1 and is distinguished by §11's second axis.

**Rejects.** Any stock Tailwind hex on a surface the player touches. An unbounded hue
walk. Two blues. B's refusal to name a colour for progress.

**First prototype.** A scratch stylesheet injected over the live app that re-points
seven tokens, then R2's `accent-kinship.probe.ts` run unchanged: rows 1/2/4 must go
GREEN (every accent within KIN_DEG 5° of an anchor, the ring in the family ink, no
off-token literal) while row 5 (the tolls) stays GREEN. Plus a re-derivation of all
four 1.4.11 ratios named in R2's constraint — board ring light/dark, progress trace over
`--grid-line-color` and over `--color-card` (the dark one has 0.07 of headroom) — and
the AA worst case over the new 12-hue peer set by canvas read-back, not arithmetic.

**Risk.** A sixth crayon is a sixth thing the reader must learn, and the dark-mode crayon
law (preserve hue ±3°, raise L, let chroma rise) has to be satisfied by a violet over a
warm-dark paper without it reading as the solver. If the plum ends up within 5° of
solver stop 2 by construction, the progress trace and a revealed answer become the same
colour — which is exactly the lie ACC-A is trying to fix elsewhere.

```
   crayon wheel, after
        14° rose   (wrong · hard)
        34° orange (medium)
       135° green  (easy)
       251° blue   (your hand · focus — ONE job, ONE ink)
       293° plum   (progress · solver stop 2)         ← the sixth, filling the hole
       ~85° gold   (done)
   peers: 12 hues = 6 anchors × 2 lightness bands, cycling
   retired: --color-user-ink (stock blue-600) · the second blue · both sparkle literals
```

### ACC-B — GRAPHITE FOR STATE, COLOUR FOR AUTHORSHIP

**Centre.** Refuse to grow the wheel. Colour in this product means exactly one thing —
**who or what made this mark** — and every UI state is carried by graphite: ink
pressure, stroke weight, dash, hatch, and the drawn mark's own form.

**Substrate.** The `--ink-press-*` ramp (already 55% / 68%, already gated by
`check-ink-pressure.mjs` in three scopes) plus stroke weight and the existing drawn
primitives. No new hexes anywhere.

**Decomposition.** Chromatic, and nothing else is: the five crayons (difficulty — the
puzzle's own property), the solver rainbow (the machine wrote it), teacher-red (it is
wrong), gold (it is done), the peer inks (a person wrote it). Achromatic, all of it:
focus (the house ring at rule pressure, heavier stroke), selection, the fill meter (it
retraces the board's OWN frame, so it should be the board's own ink at a heavier
pressure — which also answers §4's "does it keep a hue of its own": no, it distinguishes
itself by FORM, and the overhang at FRAME_Y_PAD 0 becomes the form to fix), hover,
disabled, progress, the armed guard. `--color-user-ink` retires: your own digits are
graphite in a solo board (which is what a pencil does) and take your room ink only when
there is another hand present — so colour on the board MEANS "more than one of us is
here".

**Rejects.** A sixth crayon. A named colour for progress, focus, hover or any state. A
blue for your own hand on a solo board. C's finite tin — the peer walk can stay
unbounded here precisely because nothing else competes for the wheel.

**First prototype.** Inject a stylesheet that (a) sets the fill trace to
`--ink-press-quiet` at stroke 8 and the focus ring to the same ramp, (b) removes
`--color-user-ink` from the 24 sites by re-pointing the token to `currentColor`
graphite. Then measure the thing that decides it: R2's pixel census re-run under the
same band and chroma floor — off-family chromatic content on touch must fall from
14.52% (light) / 20.81% (dark) toward the resting figure, and the four 1.4.11 ratios
must hold for a now-achromatic ring (graphite on `--color-card` is ~5:1 light — it
PASSES more comfortably than the blue it replaces, which is the family's strongest
argument). Kill condition: if the achromatic focus ring is not findable on a board full
of graphite rules in a blind five-second look, the family dies there.

**Risk.** The board is already almost entirely graphite; an achromatic focus ring on a
graphite grid is the hardest thing in this portfolio to make findable, and R3's census
says the ring's problem is that it does not read as different from the grid. ACC-B
doubles down on exactly that. It needs MARK-A's liveness or MARK-C's wash to survive.

```
   CHROMATIC (5 jobs, all of them authorship or verdict)
     wax     green orange rose      the puzzle's difficulty
     rainbow 5 stops                the machine wrote this
     rose    teacher-red            this is wrong
     gold                           this is done
     peers   the walk               a person wrote this
   ACHROMATIC (everything else, on the --ink-press ramp)
     focus · selection · hover · progress · disabled · armed
   retired: --color-user-ink · --color-focus-sketch · --color-progress-ink
            · both sparkle literals
```

### ACC-C — THE TIN OF TWELVE

**Centre.** The palette is a physical object — a tin of coloured pencils with a fixed
number of sticks — and running out is a designed state, not a failure. Colour is
ALLOCATED, visibly, and when the tin is empty two people share a pencil and are told
apart by a second mark rather than a 2.5°-apart hue.

**Substrate.** Twelve named wax sticks (the five crayons + seven cut into the wheel's
gaps, each hue-locked to an AA-cleared ink tier), a reservation table (5 reserved for
difficulty, 1 for done, 1 for wrong, 5 free for players), and an allocator that hands a
free stick to each arriving peer in tin order — not by golden angle.

**Decomposition.** The six reserved sticks never go to a player, which by construction
kills all 37 collisions R5 measured inside a room of 16 (index 11 at 0.2° from the
solver's fifth ink; index 15 at 0.4° from your own blue). Players 1–5 get a stick.
Player 6+ shares a stick and is distinguished by a drawn under-mark on their digits
(one tick, two ticks — the tally idiom the deal counter already uses). The lobby says
so in plain words: "green pencil" / "green pencil, two ticks". §12's peer cursor ring
and join wash draw from the same stick at the same reduced pressure they already use.

**Rejects.** A formula. An unbounded hue walk. Hue as the only discriminator. A colour
system the reader cannot name out loud.

**First prototype.** `instruments-family-law.mjs` (R5's, which is RED at HEAD with 37
collisions) re-run against a tin file: zero collisions is a pass by construction, so the
prototype's real job is the AA re-derivation — canvas read-back of all 12 sticks on
`--color-background` AND `--color-card`, light AND dark (four grounds, R5's constraint),
plus the 3:1 non-text floor at the cursor ring's actual 0.55 stroke opacity. Second
half: render a 16-person roster with 5 sticks and 11 tick-marked sharers and ask whether
the sharing reads as a system or as a bug.

**Risk.** Exhaustion at five is early for the owner's "16+ within reason", and the tick
mark is a second thing to learn. The honest version of this family may be a tin of
twelve free sticks (not five), which requires cutting seven new hue-locked ink tiers and
re-pricing `check-ink-pressure` — real work, and the reason the prototype must measure
before the palette is drawn.

---

## 3. THE MARKS — §5 wobble + §6 focus rings

Three families. The axis each one moves: **liveness** (A), **amplitude** (B), **the
tool** (C).

### MARK-A — THE STILL AND THE LIVING

**Centre.** The library's law is right and the census's complaint is wrong about its
cause. `maxDisplace = roughness × len × 0.015` is a real hand: a short mark wanders
less because a short stroke wanders less. The ring's σ of 0.092px is correct. What the
ring lacks is not amplitude but LIFE — the grid breathes at 4 poses / 150ms and the ring
is one frozen path. So the house law becomes: **wobble is proportional; liveness is the
state axis.** A mark that is alive is a mark the reader is touching.

**Substrate.** `boilRectFrames` / `perturbPointsClosed` (already in `gridPaths.ts`), the
shared beat (`BOIL_CONFIG` 4 frames / 150ms — never a second cadence), and a pose stack
mounted on the ACTIVE cell only (1 stack, 4 paths, mounts and unmounts with selection —
never 1,024 paths at 16×16).

**Decomposition.** Still: every resting mark. Living: the focused cell's ring, the armed
destructive verb's box, the boiling grid. Focus becomes one idiom estate-wide — the
house ghost drawn as an SVG ring, on controls as on cells — and it is recognisable not
by its colour but because it is the only thing moving under the reader's hand. The two
rings under 3:1 (`.logo-trigger` and the deck card, both 2.70:1) take the house ring at
the ramp's rule pressure, which clears the floor without spending the deck's 3.6px of
headroom. Forced-colors keeps its real `outline` (gameCell.css:348-356, unmoved).

**Rejects.** Absolute σ bands. Raising roughness on short marks (roughness ~2.36 at cell
scale is a scribble, R3's own arithmetic). A second beat. A boil on anything at rest.

**First prototype.** Patch `ghostPath` from outside to a 4-pose stack on the active cell,
on the shared beat, and run R3's three gates as they stand: `budget.probe.ts` must read
9/9/9 with ghost filter `none` at 4×4, 9×9 and 16×16; the DOM census must read +3 paths,
not +N²; `wobble.probe.ts` gains one row it does not have — σ over TIME on the ring,
which must become non-zero while σ over SPACE stays at 0.092. Frame trace on the phone
(393×699 dpr3) during arrow-key traversal: mounting and unmounting a 4-path stack on
every keypress is the cost that kills this family if it costs one long frame.

**Risk.** A ring that boils under the reader's own cursor on every arrow press is
motion answering an action — welcome — but at 8Hz forever while the cell is selected it
is ambient motion the reader did not ask for, which the design brief's own restraint
rule refuses. The prototype must include a "does it stop breathing after N beats" arm.

### MARK-B — ONE VISIBLE HAND

**Centre.** A reader judges wander in screen pixels, not in fractions of an edge. So the
house law is an ABSOLUTE band — the grid's own measured [0.722, 2.886]px σ — and short
marks are drawn with more roughness to reach it. Every mark on the page wanders the same
visible amount because one hand drew them all.

**Substrate.** A length-compensated roughness: `roughness = targetSigma / (len × 0.015 ×
k)`, computed per mark from the mark's own measured length, so the call site names a
target in px and the library's proportional law is satisfied underneath. No new
primitive, no new beat, nothing boils that did not boil before.

**Decomposition.** Every drawn mark declares a target σ in px from a three-rung band:
frame 1.145 · rule 1.443 · mark 1.443 (all measured, R3). The ring reaches the mark
rung. The peer wash gains geometry for the first time (it is a CSS box today) and is
drawn as a filled path on the existing ghost seed at the same target. Focus becomes a
GRADED set, stated as a law rather than an accident: the house hand on the board (where
the page is drawn), ONE designed drawn token everywhere off it, and the browser default
nowhere.

**Rejects.** Proportional roughness. A boiling ring. Liveness as a state axis. A single
focus idiom across board and chrome.

**First prototype.** A static SVG page rendering the ring at the three board sizes with
compensated roughness, screenshotted at dpr3 and measured by R3's `wobble.probe.ts`
sigma fit: ring σ must land inside [0.722, 2.886] at 4×4, 9×9 AND 16×16 — the length law
(ratios 7.5 / 15.7 / 8.2, R3) means one constant cannot serve all three, and the family
dies if the compensation needs a per-size table. Then the eye test that decides it: the
dpr3 crop beside `frames/ring-on-grid.png` at the same scale — a 111-unit edge carrying
1.443px of σ is a visible scribble, and the question is whether it reads as a hand or as
damage.

**Risk.** The cell ring is a 111-unit edge; forcing 1.443px of wander onto it produces
displacement of roughly 1.3% of the edge against the grid rule's 0.15%. It will almost
certainly read as a shaky box rather than a drawn one. This family is here because it is
the honest opposite of A, and its prototype is designed to kill it fast.

### MARK-C — THE MARK IS A DIFFERENT TOOL

**Centre.** Refuse to draw the selection as a line at all. Selection is not something
you write on the page — it is something you lay over it. The house already has that
vocabulary: wax, tape, laminate. So the selected cell is a CRAYON WASH, not a ring, and
the wobble law never applies to it because a wash has no edge.

**Substrate.** `gameCell.css`'s existing tier-2 ghost replaced by a filled path on the
same seed at low opacity with a soft wax edge (pre-baked, zero filters); the peer wash
stays a wash, which retroactively makes it correct rather than an exception; the
peer-cursor RING keeps being a ring, which preserves the decided ranking (a ring is
lighter than a wash, gameCell.css:229-241) and now carries meaning: **a wash is where a
hand is, a ring is where an eye is.**

**Decomposition.** Board marks: wash = attention (yours, or a peer's), ring = gaze, line
= structure (the grid, the frame). Chrome focus: the same law, so a focused control gets
a wax ground rather than an outline — which is also the answer to R1's "no authored
focus ring" absence and to the 2.9-point hover fill that is invisible (`.icon-btn:hover`
paints hsl(48 8% 96.1%) over hsl(48 12% 99%)). Forced-colors keeps a real outline, as
it must.

**Rejects.** An outline as the selection mark. The wobble law applied to fills. A's
liveness and B's amplitude alike — both are arguments about a line this family does not
draw.

**First prototype.** Inject a wash over the tier-2 ring on the live board and measure the
one thing that decides it: 1.4.11 at 3:1 for a FILL is measured differently from a
stroke — sample the composited pixels of the washed cell against its unwashed neighbour
in both themes, both engines, and against the 7% crayon-blue unit wash that is already
on screen at the same time (gameCell.css:120-300). If selection and unit-wash are not
separable at a glance, the family dies. Second arm: `a11y.spec.ts:536` (a dealt board
publishes zero unnamed image nodes) and the forced-colors arm, both unmoved.

**Risk.** The board already washes cells for the unit (7% crayon-blue) and for a peer.
Adding a third wash makes three overlapping translucent grounds on one cell, and the
composite is where this fails. It may need the washes to be mutually exclusive, which is
a rule about state and not about drawing.

```
   A   grid ~~~~~~   ring ────   → ring ~~~~ AND both breathing on one beat
   B   grid ~~~~~~   ring ────   → ring ~~~~~~  (same visible σ, still frozen)
   C   grid ~~~~~~   ring ────   → grid ~~~~~~  and the cell is FILLED, no ring
```

---

## 4. THE PLAYER MARK — §11 icon + lobby + per-player colour

Three families. What the top-left mark IS: **a name** (A), **a count drawn as an
object** (B), **a place** (C). They also take opposite rulings on F1 (whose colour is
your colour).

### PLR-A — THE SIGN-IN SHEET

**Centre.** You write your name at the top of a worksheet. The mark is not an icon — it
is your name, written in your ink, in the hand, under @mbabb. Pressing it opens a sheet
with everyone's name on it, each in their own ink. A name written in a colour needs no
swatch.

**Substrate.** The slug already exists and is already spoken ("tragic-mockingbird's
entry 7", R5 F12); its short form (the animal alone) is 5–11 characters in Patrick Hand,
which the head's 250.5px free band holds (R5 F14). The lobby is the @mbabb card's twin
geometry — 256×151 popover hung off `--head-rule` at `left: 0`, 2px border at 30%, the
one existing precedent for a small opening surface in that corner
(AttributionCard.vue:129-189). The roster's `role="log"` is reused, not duplicated: the
lobby IS the roster's visible form, and the players well loses its list and keeps its
acts (which honours M14's "controls stay in controls" exactly).

**Decomposition.** Resting solo: your name in graphite. In a room: your name in your
room ink — this family rules F1 as **your page paints you the colour the room paints
you**, so colour arriving on your own name MEANS someone else is here, and
`--color-user-ink` becomes the solo ink only (a solo board stays byte-identical, which
the constraint requires). The lobby: a small ruled sheet, names left-aligned in their
inks, the `you` marker directly after your own name (curing the orphaned qualifier 145px
adrift, R5 F10), and one plain line at the foot — "last heard from" against the 45s
expiry, never a connected dot, because the wire carries no such fact. 16+ names: the
sheet grows to a column cap and then compresses to "and 7 more", which is a count and
not a scroll inside a scroll inside a sheet.

**Rejects.** An abstract person glyph. A colour swatch chip. A row grammar of
swatch·name·gap·marker. B's count-first reading. Keeping blue for your own hand in a
room.

**First prototype.** R5's I2 and I3 are already written and RED at HEAD. Render the mark
and the lobby as a static overlay injected over the live head at 390×844 and 1280×800,
then: I3 must pass (a named control at x<200, y<120 whose press opens a lobby), I2 must
pass (your own swatch/ink is the room's colour for you, on both pages of a live `?wire=
local` pair), and the lowercase law must hold — Patrick Hand ships no `j` and no `x`, so
the prototype runs `scripts/check-font-coverage.mjs` over the rendered slug set (the
`/^[a-ik-wyz]+$/` filter already guarantees it; the prototype proves the lobby's own
copy does too).

**Risk.** Two names in the head's left corner (@mbabb and yours) is two authorship claims
in one place, and the masthead is the product's quietest surface. If the animal slug at
14px reads as clutter beside @mbabb, the family needs the name to appear only in a room
— which makes the solo resting state empty, and an indication nobody ever sees at rest
is one nobody learns.

```
  head, in a room of 3                lobby (pressed)
  ┌──────────────────┐                ┌─ 256×151, hung off --head-rule ──┐
  │ @mbabb           │                │  mockingbird    you              │
  │ mockingbird      │  ← your ink    │  parsnip                         │
  └──────────────────┘                │  heron                           │
       ↑ graphite when solo           │                                  │
                                      │  last heard from heron, just now │
                                      └──────────────────────────────────┘
```

### PLR-B — THE TALLY

**Centre.** The mark is a COUNT, drawn as an object, readable without reading. The
product already draws tallies — `dealt ⊪` in the owner's own Frame B — so presence is a
tally of strokes, one stroke per person, each in that person's ink, struck through at
five. Two people is two strokes; you never have to read a number.

**Substrate.** The existing tally glyph vocabulary, drawn as a path (so it wobbles like
everything else and costs zero filters); each stroke inked from the peer map. The lobby
is the attendance register: the same small hung sheet, a ruled list, names in graphite
with a coloured stroke beside each.

**Decomposition.** Resting solo: one graphite stroke — the mark is always present, always
means the same thing, and is legible from the first session, which is B's argument
against A. In a room: N strokes in N inks. Past 10: five-bar groups plus a written count
("⊪⊪ 12"). This family rules F1 the OTHER way: colour is a room-relative LABEL that lives
on the mark and in the lobby, and the board keeps `--color-user-ink` for your own hand —
so nothing re-binds under a player mid-session and the 24 `--color-user-ink` sites are
untouched. §12's peer chrome is unchanged.

**Rejects.** Text as the indication. A name in the masthead. Colour re-binding on the
board. A lobby that must be read to be understood at a glance.

**First prototype.** Draw the tally at 1, 2, 3, 5, 8 and 12 people at 390 and 1280, dpr3,
and measure: (a) each stroke's own 1.4.11 ratio at its drawn opacity on `--color-card`,
all four grounds; (b) the 44×44 tap floor on a mark whose natural width at N=1 is one
stroke (this is the family's real constraint — a one-stroke target needs an invisible
44px box, and R1's `.mobile-heading-btn` 44×44 trap says the negative control must be
per-dimension); (c) a five-second blind read at N=3 vs N=4 — a tally that is miscounted
at a glance is a count that lies.

**Risk.** A tally stroke is 2–3px wide; a 2–3px wide mark in a player's ink is the
smallest chromatic object in the product, and R5's contrast floors were derived for
digits. Colour may simply not survive at that size, in which case the strokes go graphite
and the colour system loses its indication — which is most of M14.

```
   solo        ▏                  (graphite)
   two         ▏▏                 (two inks)
   five        ⊮                  (struck through)
   twelve      ⊮⊮ 12
```

### PLR-C — THE SEATING CHART

**Centre.** Presence is a PLACE, not a name or a number. The mark is a miniature of the
board with a coloured dot where each person is looking; the lobby is that miniature at
readable size with the names beside it. The wire already carries it (`cur`), and "looked
away" is already spoken.

**Substrate.** A 24×24 drawn miniature of the board's own frame (the same `wobbleRect`
seed at a small scale, zero filters), one dot per peer at their `cur` cell. The lobby is
the same miniature at ~96px with a name list.

**Decomposition.** Solo: an empty miniature — honest, and it teaches the reader what the
mark is before anyone arrives. In a room: dots. The lobby answers "who is here" and
"where are they" in one object, which is the only family that makes the lobby worth
opening twice. F1: colour is positional here, so the board keeps your blue and the chart
carries the room colours (same ruling as B, different reason).

**Rejects.** A roster as the primary form. A name in the masthead. A lobby that says only
who.

**First prototype.** Two live pages on `?wire=local`, one arrowing around; render the
miniature and measure the thing that decides it: **motion the reader did not ask for.**
`cur` updates at up to 8Hz; a dot that moves 8 times a second in the masthead is
ambient motion, which the restraint law refuses. Measure the actual update rate on the
wire over 60s of ordinary play, then decide the damping (quantise to the shared 125ms
beat, or move only on a settled cell). If the honest damping makes the dots effectively
static, the family collapses into B.

**Risk.** It shows a fact that is true but private — where someone is looking — in the
most persistent surface on the page, and at 24px the dots are sub-3:1 by construction. It
is the most interesting and the least likely of the three.

---

## 5. THE TRANSITION GRAMMAR — §13

Three families. What a duration IS: **a count of beats** (A), **a property of a verb**
(B), **a consequence of distance** (C).

### MOTN-A — EVERYTHING ON THE BEAT

**Centre.** The product already has a heartbeat — the boil beat, 125ms, ~8Hz, shared,
published, and the one cadence the estate has ever ruled on. Every duration in the
estate is a whole number of beats. Nothing tweens off the beat.

**Substrate.** `MOTION.bands` in `pencilConfig`, defined as beat multiples:
`tick` 1×125 · `note` 2×250 · `step` 3×375 · `throw` 4×500 · `settle` 6×750. One new
static gate, `check-motion-bands.mjs`, in the shape of the estate's existing static
gates: every `transition`/`animation` duration in `src/**/*.{vue,css}` must resolve to a
band var or be in a named ADMITTED list with its ruling cited.

**Decomposition.** The 35 distinct literals (77 declarations, R7) collapse onto five
bands. The two-layer partition holds unchanged: TS consumers read `MOTION.bands`, style
consumers read `--dur-*` published from the same source, byte-identical, the way the
glass curve already lives in both. The drawer's 520 is the ONE declared exception with
the owner's T3-W13 audit-4 ruling cited beside it (`GLIDE_MS = 520` moves from a module
literal into `MOTION` as `drawerGlideMs`, which is R4's open question answered). The dusk
(350ms bare `ease`, the exact surface M09 names) becomes `step` on `--ease-glassGlide`.
The three unarmed transitions get PRM arms.

**Rejects.** A literal duration anywhere. A second cadence. B's semantic naming — a band
is a length, and what it is used for is the call site's business.

**First prototype.** Write `check-motion-bands.mjs` FIRST and run it at HEAD: it must be
RED with the count R7 measured (35 distinct literals against 4 named). Then a scratch
stylesheet that re-points the 16 incidental transitions (R4's i2 list, verbatim with
file:lines) onto bands, and R4's `i2-incidental-transition-census.mjs` re-run: 39
declarations, 39 with a token, 0 incidental. Frame trace unchanged at 390×844 against a
built dist — a quantisation that costs a long frame has bought nothing.

**Risk.** 520 is not a beat multiple (4.16 beats) and the owner ruled it. Either the
ladder carries a permanent exception at its most-used value — which weakens the law
every time someone reads it — or the drawer moves to 500 and re-opens an owner ruling
this wave has no standing to re-open.

### MOTN-B — THE VERB LADDER

**Centre.** Motion is named by what it DOES, not by how long it takes. A closed set of
six physical verbs, each owning its whole tuple (duration, curve, properties, fill, PRM
arm), and every animation in the product must name one. A duration is a consequence of
the verb, never a number a call site picks.

**Substrate.** `MOTION.verbs` in `pencilConfig` — one object per verb, consumed by JS
directly and published to CSS as a custom-property set. The `check-motion-contract.mjs`
gate widens from the PRM declaration to "every declaration names a verb".

**Decomposition.** The six: **lay down** (something arrives on the page — a note, a
ribbon, a tape) · **lift** (it leaves — the chrome-leave and the deck's dissolve become
ONE verb, which answers R4's declared-twins-on-two-curves defect by construction) ·
**turn** (the deck's card step) · **slide** (the drawer, the one owner-ruled curve and
duration, scope-fenced as it already is) · **write in** (the note's 250ms
`--ease-noteWrite`) · **rub out** (the note's missing exit — §7's hole shows up here as a
verb with no implementation, which is the family's strongest argument). Everything else
in the estate must name one of the six or be refused.

**Rejects.** Naming bands by length. A curve shared across unrelated verbs (the glass
curve currently serves six durations and at least three unrelated jobs). A transition
that names nothing.

**First prototype.** Take R4's inventory table (35 named transitions across gallery /
drawer / dark toggle / margin furniture, already banked with name·trigger·duration·
curve·properties·HOME·PRM) and assign each row a verb on paper. The family proves itself
if every row takes exactly one verb and no row needs a seventh; it dies if the dark
toggle, the boil beat or the celebration need verbs of their own. Then the runnable
half: implement `lift` as one tuple, inject it over both twins (chrome-leave and deck
dissolve) and confirm the two now ride one curve at one duration with R4's animate-hook
probe.

**Risk.** Six verbs is a taxonomy, and taxonomies grow. The dark toggle is the test case:
it is not a lay-down, a lift, a turn, a slide, a write or a rub-out — it is a change of
light over the whole page, and if it needs a seventh verb the closed set was never closed.

### MOTN-C — DISTANCE AND MATERIAL

**Centre.** Nobody chooses a duration. A duration is derived from how far the thing
travels and what it is made of: `ms = base + px / speed`, one speed per material. Paper
glides at one rate, tape lifts at another, and a longer throw takes longer because it is
longer.

**Substrate.** Two or three material constants in `MOTION` (`paperSpeed`, `tapeSpeed`,
`baseMs`) and a `durationFor(materialKey, travelPx)` helper consumed by the FLIP
primitives, which already compute travel at gesture onset (`useFlipGlide`,
`useControlsDrawer` — the numbers are in hand and currently thrown away).

**Decomposition.** The drawer's dock throw (628px measured) and the desk's shorter
reciprocal throw stop sharing a number — which is R4's open question ("does the dock
inherit the desk's 520?") answered without a second ruling. The deck's card step derives
from its own travel. The dusk has no travel, so it is not on this system at all and takes
a stated constant, honestly declared as the one non-derived duration. The owner's 520 is
re-derived: `paperSpeed` is SET so that the desk's measured travel lands on 520, which
honours the ruling instead of re-opening it — the family's neatest property.

**Rejects.** Fixed durations. A band ladder. A verb taxonomy. Per-surface tuning of any
kind.

**First prototype.** Compute, on paper first, from R4's banked keyframes (`r4-probe3.json`
has every `Element.prototype.animate` call with target, keyframes and options at 390×844
and 1440×900): solve `paperSpeed` from the desk drawer's travel and 520ms, then predict
the dock's duration and the card step's. If the predicted card step lands far from the
owner-ruled 440, the model is wrong and the family dies on arithmetic before any code is
written. If it lands close, implement `durationFor` behind the drawer's glide on a
scratch branch of the probe and frame-trace both poses.

**Risk.** Two ruled durations (520 drawer, 440 card step) must both fall out of one speed
constant, and they almost certainly will not. The family then needs two materials, and
two materials chosen to fit two numbers is a formula that has learned the answer — the
worst kind of system, because it looks derived and is not.

---

## 6. THE NOTE'S LIFE — §7

Two families: **the note is erased** (A), **the note is filed** (B).

### NOTE-A — THE ERASER

**Centre.** A margin note is pencil, and pencil leaves by being rubbed out. The note has
a life measured from the reader's last board action; when it ends, it erases — a short
wipe from the end of the line backward, leaving a residue at the quiet rung for one beat
and then nothing.

**Substrate.** `MarginNote.vue`'s existing `ink-write-in` (250ms, `--ease-noteWrite`,
`backwards`) gets its mirror, `ink-rub-out`, on the same curve reversed; the life is a
band from §13 (`settle`, or whatever the chosen motion family names). PRM: the wipe
collapses to a same-frame removal, like every other named gesture.

**Decomposition.** A note's life is its own: a HINT note ages (it is advice, and advice
goes stale), a CONFLICT verdict does not (it is a fact about the board and leaves when the
fact does), a refusal note ages fast (it is a response to one act). Ageing is measured
from the reader's last action, not from the note's birth, so a note does not vanish while
the reader is staring at it. The peer-digit wipe (R3's undesigned retraction — a peer's
keystroke nulls YOUR hint note via `applyCellValue`) becomes an authorship test: a note
about your square is retracted by your acts, and a peer writing elsewhere leaves it
standing.

**Rejects.** A dismiss control (a hand-drawn page does not get an ✕, and a 44px target for
a note is chrome the note does not deserve). Instant removal. A note that outlives the
board it commented on.

**First prototype.** R3's `marks.probe.ts` and `marks2.probe.ts` are already written and
GREEN as censuses; the family needs two new rows, both born-RED at HEAD: (a) a hint note
is gone N beats after the last board action (HEAD: opacity 1.000 after 30s idle), (b) a
peer's digit in another cell leaves YOUR note standing (HEAD: it is wiped). Implement the
wipe over the live note by injection and frame-trace it — a 250ms opacity+clip wipe on a
text node must not boil the text (the no-text-boil law is absolute).

**Risk.** Ageing removes information the reader may still want, and "measured from the
last action" means a note dies during a long think — which is exactly when a hint is most
useful. The band has to be generous, and a generous band is indistinguishable from the
current behaviour on most sessions, which makes the family hard to prove.

### NOTE-B — THE MARGIN IS A LEDGER

**Centre.** Notes are not retracted; they accumulate. The margin holds the last three
notes as a short column — newest at full ink, older ones stepping down the `--ink-press`
ramp — and a new note pushes the oldest off. Nothing an act does can wipe a note, because
a note is a record of something that happened.

**Substrate.** The existing `MarginNote` multiplied into a fixed-height stack with a
three-rung ink ramp (the ramp exists: rule 55%, quiet 68%, full). The falsy-arm
retraction sites in `useGameState` (five of them, R3) stop nulling and start pushing.

**Decomposition.** Every note joins the column: hints, conflicts, refusals, "the board is
clear", "solved it!". Ordering is temporal, so the board's history is legible in the
margin — which is what the margin of a worked problem actually looks like. The peer-wipe
defect dies by construction (a peer's digit ADDS a line, it does not remove one), and
§7's "what ages a note" is answered by displacement rather than by a timer.

**Rejects.** Ageing by time. Retraction by act. A single-note margin. A note that
disappears without something taking its place.

**First prototype.** Render three stacked notes at 390×844 and 1280×800 and measure the
one thing that decides it: **height.** The margin's note berth is a fixed band under the
board (W2 §2.5 moved the invite verb's note into the card's one note berth precisely
because the scrollport could not hold it); three lines of 16px Patrick Hand is ~63px of
board-adjacent vertical space on a phone whose board is already 366px wide in an 844px
viewport. If the stack does not fit without moving the board, the family is dead at 390
and survives only on the desk — which is a split grammar, and B6 fired against split
grammars.

**Risk.** It converts a quiet marginal whisper into a running log, which is more text on
a page whose personality is drawn, not written. And the three-rung ramp means the oldest
note sits at the rule rung (3.53:1), below AA for text — so the stack is two notes, not
three, and two notes may not be a ledger.

---

## 7. §9 / B1 — the copy recuts (candidates, not a family)

Both strings carry the machine's name into the product's face; M16's own law is the
default disposition. Each candidate is priced: a rendered-string change re-cuts the
letter-exact woff2 subsets (`scripts/check-font-coverage.mjs` is the standing guard), and
an ADMITTED entry reds when its string leaves the tree, so the recut and the lexicon
strike land in one commit.

| site | ships today | candidate | alternate | note |
|---|---|---|---|---|
| `GameControlPanel.vue:1297` — the Solve verb's hover tape | "the solver finishes the board" | **"fills in the whole board"** | "finishes the board for you" | The tape describes the ACT, so it takes the act's own voice: the button says `solve`, the tape says what solving does. Drops the agent noun entirely rather than renaming it. No new letters outside the existing subset (all lowercase, no `j`/`x`). |
| `useGameCell.ts:153` — the computed `:aria-label` on a solved cell | `solver's answer ${n}` | **`answer ${n}`** | `filled-in answer ${n}` | Completes the set the estate already speaks: clue N (given) · entry N (yours) · **answer N** (revealed). The one-name law holds — nothing visible carries this string, so there is no drawn word to keep in step. |

Rider, flagged by R6 and worth taking in the same commit because it is the third member
of the same set: the `candidates` row caption (`GameControlPanel.vue:980`, currently
ADMITTED) → **"what fits"**. It is the only remaining admitted jargon hit, and striking
its lexicon entry with the recut is what the ADMITTED mechanism is for.

**The gate defect that must land with the recuts.** `check-copy-register.mjs:213-243`
reads four shapes — template text, static rendered attributes, `COPY_KEYS` object
literals and `NARRATION_CALLS` — and `solver's answer N` is none of them: it is assembled
in a `computed()` and bound as `:aria-label`, so the gate reports clean on a string B1
names by name (R6). Recutting the string without widening the corpus leaves the next one
invisible. The corpus widening is part of the recut, not a follow-up.

---

## 8. What was considered and refused

Round zero's failure mode is rewordings posing as families. These were written down and
cut, with the reason:

- **"Make the section titles larger and properly sticky."** The mark restated. It picks a
  number without a law, and every controls family above must answer it as a consequence.
- **"A cleaner controls card with better spacing and a clearer visual hierarchy."** The
  generic card-kit answer — identical radii, one shadow, more padding. It is what a
  generated page produces for any card, and the census already says the defect is five box
  grammars, not insufficient air.
- **CTRL "the margin rail" — every frequent act on the board's four edges.** Genuinely
  orthogonal and genuinely out of scope: it proposes new mechanics, and W2's landed
  tongue/dock/sticky are the fence this wave designs on top of.
- **ACC "add a semantic state palette (success / warning / danger)."** The default, and
  forbidden by decided history — `--color-easy/medium/hard` were killed at T5-W2 2.3 for
  being a third name for a colour that already has two.
- **ACC "desaturate the violet so it reads as neutral."** Violates the crayon dark law
  outright (dark variants preserve hue, raise lightness, let chroma RISE) and is a value
  tweak, not a centre.
- **MARK "give the ring a dashed outline" / "add a soft glow."** The first is MARK-B at
  lower amplitude — a reword. The second is a shadow on a page whose whole idiom is drawn
  geometry, and it would read as the SaaS card's grey shadow.
- **MARK "boil every cell's ring."** Merged into MARK-A with the active-cell-only
  constraint: 1,024 paths at 16×16 is not a design choice, it is the same family with the
  DOM census ignored.
- **PLR "avatar circles with initials."** The default. Also impossible in the hand:
  Patrick Hand's cut declares {C, R, S} as its only capitals, so an initial paints its
  glyph in the system fallback.
- **PLR "the mark toggles a who-wrote-what pass on the board, with no lobby."** Refuses
  M14's plain word ("clicking it will display the lobby with players thereof"). Cut on the
  owner's text, not on its merits.
- **PLR tally-vs-pencil-fan as two families.** Same mechanism — the count drawn as an
  object — differing only in which object. Merged into PLR-B, which takes the tally
  because the product already draws one (`dealt ⊪`, the owner's own Frame B).
- **MOTN "standardise on `transition: all 200ms ease`."** The default, and one such
  declaration is already live and demonstrably tweening `visibility` during an unrelated
  drawer gesture (`GameControlPanel.vue:2082`).
- **MOTN "adopt a standard easing set (material / ease-in-out)."** Generic, and the estate
  has one owner-ruled glass curve with a scope fence. Re-auditioning it is allowed; doing
  it by importing someone else's ladder is not.
- **NOTE "add an ✕ to dismiss."** Chrome on a drawn page, a 44px target the note does not
  earn, and it answers "how does it go" with "the reader does it", which is the question
  restated.
- **§1 "one heading voice" and "the tape becomes a heading" as two families.** One
  mechanism — re-point `--type-group-title` and re-host the tape. Merged into CTRL-D,
  where the choice of face is the law and the size falls out of it.

---

## 9. Notes for the adjudicator

**The families are not all mutually exclusive, and the compatible pairs are the
portfolio's real product.** CTRL-D is a type law with no geometry, so it composes under
CTRL-A, CTRL-B or CTRL-C; A, B and C exclude each other. ACC-B (graphite for state)
needs MARK-A (liveness) or MARK-C (the wash) to survive its own focus-ring problem, and is
incompatible with ACC-A. PLR-A rules F1 one way; PLR-B and PLR-C rule it the other, and
whichever wins constrains ACC-A's peer quantisation and ACC-C's tin size.

**Three cheap kills, worth running before any drawing.** CTRL-D's prototype is one
injected stylesheet against an instrument that already exists and is already RED. MOTN-C
dies or survives on arithmetic from JSON already banked, with no code at all. MARK-B is
designed to be killed by one dpr3 crop. Spending round one on those three buys the most
information per hour in this portfolio.

**Two things every family must carry and none of them get credit for.** filterBudget
stays at 9 by exact match in both directions, and `FILTER_BUDGET_UNION_AREA` may not grow
— so every drawn mark proposed here is pre-baked geometry or a pose swap. And the 44px
floor is two-dimensional with a per-dimension negative control, because `.mobile-heading-
btn` measures exactly 44×44 today by accident of the height floor.

**One number that should embarrass every family into being better.** The masthead clears
the board by 4.4px at 900 wide and by the same 4.4px at 390×844, and it clears the risen
sheet by 1.0px (R7). Three passes by arithmetic. Nothing in this portfolio designs that
gap, and something should.
