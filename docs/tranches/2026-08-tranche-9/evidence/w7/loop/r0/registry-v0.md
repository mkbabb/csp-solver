# T9-W7 round zero · REGISTRY v0 (families by design idea)

Adjudicator: Fable 5.1, the thrice protocol's third instance. Inputs: `T9-W7-design.md`,
the seven census lanes under `r0/` (R1 controls · R2 accent · R3 marks · R4 transitions ·
R5 player mark · R6 idiom/history · R7 owner's eye), `portfolio-fable.md` (14 families)
and `portfolio-opus.md` (16 families). The frontend-design skill was invoked first; its
default-detection list is the rewording detector used in §2 below.

Round zero is read-only on the product. This file and `charters/<id>.md` are the only
writes. The adjudicator's current favourite per section is NOT in this file (it is
withheld from pass-1 researchers, who receive their charter alone).

## 0 · How the registry was cut

- A FAMILY is a design idea: two routes sharing a MECHANISM share a family, and the
  point where they part becomes that family's pass-1 research variable.
- Merges name the survivor and what it took from each hand (§3).
- RETIRED only for a rewording (of the incumbent or of a sibling) or a banked-constraint
  violation, with the constraint named (§4). BLOCKED for a family stalled at a missing
  primitive as hard as the problem: none this round.
- Several incompatible routes stay ALIVE per section; the loop cross-pollinates only
  after independent development.
- Per-player COLOUR was pulled out of both portfolios' §11 and §3 families into its own
  sub-section (§11c/§12): the walk-vs-bounded-set question is orthogonal to what the
  head mark IS and to what the interactive accents are made of, and both portfolios
  had smeared it across three families each.

Thirty proposals in → 22 families out: 21 ALIVE, 1 RETIRED, 0 BLOCKED, 0 BANKED.
Nine merges (§3).

## 1 · The registry

Ports are the pass-1 lane's dev server (127.0.0.1, 4230–4260 band; the r0 lanes' ports
are released). Evidence for pass 1 lands under `evidence/w7/loop/r1/<id>/`.

### §10 · THE CONTROLS SYSTEM (§1 §2 §8 §14 §15 inside; M01 M03 M04 M05 M12 M13)

| id | name | centre | from | status | incompatible with | port |
|---|---|---|---|---|---|---|
| CTRL-TAPE | The taped case | the washi tape is the one heading voice; rank is WHERE the tape is stuck (astride the compartment's edge = group, flat inside = row); the card stays a pencil case of drawn compartments; the stroke ladder is the delineation | fable CTRL-A | ALIVE | CTRL-RULE, CTRL-TABS, CTRL-COST, CTRL-FACE | 4230 |
| CTRL-RULE | The ruled page | the compartment dies; delineation is one drawn graphite rule between groups; every group name in one voice at one fixed rung at every viewport; nothing nested, nothing hidden; acts are the only boxed things; the bar's border is one drawn top rule. Research fork: the name ABOVE its content on its rule (section header, push-sticky) or BESIDE it in a left margin column (sticky moot) | both (fable CTRL-B + opus CTRL-A) | ALIVE | CTRL-TAPE, CTRL-TABS, CTRL-COST | 4231 |
| CTRL-TABS | The index tabs | the card stops scrolling; compartments become index tabs on the card's edge, one tray face-up, the heading IS the tab, the bar is the tray's floor drawn as one piece with the lid; one tablist on every platform. Research fork: tab drawn in the drawer tongue's idiom vs the washi tape promoted; desk tabs on the top edge vs down the rail's left flank | both (fable CTRL-C + opus CTRL-B) | ALIVE | CTRL-TAPE, CTRL-RULE, CTRL-COST | 4232 |
| CTRL-COST | The consequence ladder | the card is ordered and drawn by what an act COSTS (looking · writing · starting over); weight tracks consequence; the heaviest tier is laid out at its armed size so the confirm is a word swap with zero reflow; the bar is answered by deletion | opus CTRL-C | ALIVE | CTRL-TAPE, CTRL-RULE, CTRL-TABS | 4233 |
| CTRL-FACE | Printed and written | a type law with zero geometry: Fraunces is what the sheet came printed with (every group name, the act verbs), Patrick Hand is what a pencil put there (every value, sublabel, tally, slug, note, digit); the face, not the size, is the hierarchy device; composable under any structure | opus CTRL-D | ALIVE | CTRL-TAPE (its voice is the tape in the hand) | 4234 |

### §3 §4 §12 · THE ACCENT FAMILY (M07; the fill meter's hue rides it)

| id | name | centre | from | status | incompatible with | port |
|---|---|---|---|---|---|---|
| ACC-SIX | The sixth crayon | the wheel's 122.8° hole already holds three things; NAME the sixth colour there (the hex is in the tree: dark progress-ink ≡ light solver-ink-2 #7c3aed) and bring every homeless accent home — blue-ink from crayon-blue for your hand, the focus ring's dark arm, the sparkle literals tokenised, the meter as the answer's measure. Research fork: the sixth as WAX (a crayon with an ink tier) or as the declared ANSWER material | both (opus ACC-A + fable ACC-B) | ALIVE | ACC-FIVE, ACC-GRAPHITE | 4235 |
| ACC-FIVE | Five crayons, no sixth | every interactive accent is an alias into the five crayons within 5°, contrast bought by lightness alone; the violet dies; your pen is crayon-blue's ink tier; progress is gold and the trace becomes the solved frame at 100% | fable ACC-A | ALIVE | ACC-SIX, ACC-GRAPHITE | 4236 |
| ACC-GRAPHITE | Graphite for state | colour means one thing — who or what made this mark; every UI state (focus, selection, hover, progress, armed) is graphite on the ink-press ramp; your own digits are graphite on a solo board and take a room ink only when another hand is present | opus ACC-B | ALIVE | ACC-SIX, ACC-FIVE, MRK-ABS (its author's own reading: an achromatic still ring needs liveness or a wash to be findable; re-test, don't trust) | 4237 |

### §5 §6 · THE MARKS (wobble law · focus rings)

| id | name | centre | from | status | incompatible with | port |
|---|---|---|---|---|---|---|
| MRK-LIVE | The living mark | the library's proportional law is right; what the ring lacks is LIFE — a four-pose stack on the ACTIVE cell only, on the shared beat; liveness is the state axis (living = under the reader's hand); off the board ONE drawn ring idiom, the house ghost as an SVG ring on whatever has focus | both (fable MRK-A + opus MARK-A) | ALIVE | MRK-ABS, MRK-WASH | 4238 |
| MRK-ABS | One visible hand | a reader judges wander in screen px; the law is an absolute band (the grid's own [0.722, 2.886]px σ) reached by length-compensated roughness; still; the wash gains geometry; focus is a GRADED set by law: the house hand on the board, one designed token rect everywhere off it, the UA default nowhere | opus MARK-B (+ fable MRK-B's token-ring arm) | ALIVE | MRK-LIVE, MRK-WASH | 4239 |
| MRK-WASH | The wash | selection is laid over the page, not drawn on it: a crayon wash on the selected cell, no edge, so the wobble law never applies; wash = where a hand is, ring = where an eye is, line = structure; a focused control takes a wax ground | opus MARK-C | ALIVE | MRK-LIVE, MRK-ABS | 4240 |
| MRK-STILL | The frozen hand | the ring holds still by ruling, proportional as today, grain baked into its stroke; one token rect off the board | fable MRK-B | RETIRED (§4) | — | — |

### §11 · THE PLAYER MARK (icon · lobby; M14) — what the mark IS

| id | name | centre | from | status | incompatible with | port |
|---|---|---|---|---|---|---|
| PLR-SELF | Your mark, in your ink | the mark is YOU — one object in your room ink (your written name, or a drawn crayon stub; the form is the research fork); pressed, it opens a small sheet in the @mbabb card's pose listing everyone in their inks; F1 ruled: your page paints you the colour the room paints you, so colour on your own mark means someone else is here; user-ink becomes the solo ink | both (opus PLR-A + fable PLR-A) | ALIVE | PLR-COUNT, PLR-PLACE | 4241 |
| PLR-COUNT | The tally | the mark is a COUNT drawn as objects — one stroke per person, each in that person's ink (the product already draws `dealt ⊪`); solo = one graphite stroke, always present; F1 ruled the other way: colour is a room-relative label on the mark and lobby, the board keeps your blue | both (opus PLR-B + fable PLR-B's mark) | ALIVE | PLR-SELF, PLR-PLACE | 4242 |
| PLR-PLACE | The seating chart | presence is a PLACE: a 24×24 miniature of the board's own frame with a dot per peer at their `cur` cell; the lobby is the miniature at readable size with names beside it; solo = an empty frame | opus PLR-C | ALIVE | PLR-SELF, PLR-COUNT | 4243 |

### §11c §12 · THE PER-PLAYER COLOUR SYSTEM (the accent law's peer exception)

| id | name | centre | from | status | incompatible with | port |
|---|---|---|---|---|---|---|
| PAL-WALK | The walk over open arcs | the colour stays an uncapped golden-angle walk, but over the arcs the house has not reserved, at the wax's chroma; you join it when a room exists | fable (ACC-A/PLR-A's peer arm) + opus (ACC-B's unbounded walk) | ALIVE | PAL-TIN | 4244 |
| PAL-TIN | The tin | the palette is a finite designed object — N named pencils cut into the wheel's gaps, never an anchor, allocated in order; running out is a DESIGNED state (a second axis tells sharers apart: a lightness step on the second lap, or a drawn under-mark the lobby names) | both (opus ACC-C + fable PLR-B's palette + opus ACC-A's 12-from-anchors variant) | ALIVE | PAL-WALK | 4245 |

### §13 · THE TRANSITION GRAMMAR (M02 M09's design half; §12's drawer curve)

| id | name | centre | from | status | incompatible with | port |
|---|---|---|---|---|---|---|
| MOT-LADDER | The duration ladder | MOTION gains a short closed set of named LENGTHS; every transition reads a rung; one publisher to CSS; GLIDE_MS comes home; `transition: all` banned; the three PRM-less files armed. Research fork: rungs = the shipped owner-ruled numbers named, or quantised to the 125ms beat with 520/440 as cited exceptions | both (fable MOT-A + opus MOTN-A) | ALIVE | MOT-VERB, MOT-DERIVE | 4246 |
| MOT-VERB | The pencil verbs | motion is named by what a hand does on paper: a closed set of verbs each owning its whole tuple (ms · curve · properties · fill · PRM arm); a duration is a consequence of the verb. Research fork: four verbs or six; the dark toggle is the closed-set test; the note's missing exit is a verb with no implementation | both (fable MOT-B + opus MOTN-B) | ALIVE | MOT-LADDER, MOT-DERIVE | 4247 |
| MOT-DERIVE | Distance and material | nobody chooses a duration: ms = base + travel ÷ speed(material); the FLIP primitives already compute travel and throw it away; the owner's 520 is re-derived, not re-opened | opus MOTN-C | ALIVE | MOT-LADDER, MOT-VERB | 4248 |

### §7 · THE NOTE'S LIFE

| id | name | centre | from | status | incompatible with | port |
|---|---|---|---|---|---|---|
| NOTE-ERASE | The eraser | a margin note is pencil and leaves by being rubbed out — the write-in's mirror; life is per kind; retraction is by the next thing that changes what the note said, with an authorship-and-cell test so a peer's digit elsewhere leaves it standing. Research fork: a clock measured from the reader's last board action, or no clock — the note only SETTLES to the quiet rung | both (fable NOTE-A + opus NOTE-A) | ALIVE | NOTE-LEDGER | 4249 |
| NOTE-LEDGER | The ledger | notes accumulate: the margin is a short column, newest at full ink, older stepping down the ink ramp, a new note pushing the oldest off; nothing an act does wipes a note; ageing by displacement | opus NOTE-B | ALIVE | NOTE-ERASE | 4250 |

## 2 · The default-detection pass (rewording detector)

Each family checked against the skill's list of generated-page tells. Nothing here
retires a family; it names the trap its charter carries.

- **Broadsheet (hairline rules · zero radius · dense columns).** CTRL-RULE flirts with
  it, and the Opus margin-column arm (`[name] | [field]` grid) is also the generic
  settings-form layout. Its charter demands the rule be pencil geometry (draw-on path,
  wobble, `--ink-press-rule`) and never a CSS hairline, and that the margin arm prove
  it is a worksheet margin and not a form label column.
- **High-contrast serif display everywhere.** CTRL-FACE spreads Fraunces 800 to eight
  names and five verbs; six small copies of the masthead's voice inside one card is the
  tell. Its charter demands the printed voice stay rare enough to read as a rank, and
  prices a lighter weight as a second woff2 subset.
- **A label above every block (the eyebrow).** CTRL-TAPE's tape astride every
  compartment is the same silhouette. It survives because the tape IS the accessible
  name (one-string law) and the house's own tape idiom, not chrome; its charter must
  show the tape earns its place by the size ratio and the drawn compartment beneath it.
- **Non-user-triggered motion.** MRK-LIVE's ring boils at 8 Hz for as long as a cell is
  selected; a selection is user-triggered, the breathing after it is not. Its charter
  carries the "stops breathing after N beats" arm as a first-class question.
  PLR-PLACE's dots moving at `cur`'s 8 Hz in the masthead is the same trap; its
  charter's first measurement is the wire's real rate and the damping.
- **The SaaS card kit · ALL-CAPS labels · middle-dot meta strings · `→` on buttons.**
  None proposed; both portfolios refused the card kit explicitly; casing is CSS-only
  lowercase by the Patrick Hand cut; no family mints a meta string.
- **"Make the titles larger and sticky" / "a cleaner card with better spacing".** Both
  portfolios refused these as the mark restated. Not in the registry.

## 3 · Merges (survivor · what it took from each hand)

1. **CTRL-RULE** ← fable CTRL-B (the ruled worksheet) + opus CTRL-A (the ruled page).
   Same mechanism: compartments retire, one drawn rule delineates, one voice at one
   fixed rung, tabs die because nothing is hidden, acts are the only boxed things, the
   bar is one drawn top rule. From Fable: the section-header push law for sticky, the
   heading ON the rule, the guard ribbon berthed in the bar's note berth as the confirm
   face, `what fits` as the caption. From Opus: the left-margin arm (name beside its
   content, sticky moot), the hairline at `--ink-press-rule` (no new ink), the in-place
   armed verb (`sure?` + `no` in the same band, zero reflow), the height kill-test. The
   name's position (above vs beside) and the confirm face are the family's pass-1
   variables.
2. **CTRL-TABS** ← fable CTRL-C (index tabs) + opus CTRL-B (tabbed divider deck). Same
   mechanism: the card stops scrolling, one tray face-up, the heading is the tab, one
   tablist on every platform. From Fable: the tongue's drawn idiom, the floor drawn as
   one piece with the lid, the desk's left-flank vertical tabs, the one-tool-home move
   (undo·redo·hint onto the tongue strip; the portrait ribbon retires). From Opus: the
   `display: contents` heading host generalised, `role=tablist` replacing four
   `aria-labelledby` wells, the four-tabs-in-358px and 44×44-per-dimension
   measurements, the "most reversible-looking, least reversible" warning.
3. **ACC-SIX** ← opus ACC-A (the sixth crayon) + fable ACC-B (three materials). Same
   mechanism: the violet is named as a sixth house colour anchored on solver-ink-2, and
   every stock accent comes home. From Opus: the plum as a wax with an ink tier, blue as
   ONE job (hand + focus, one token dies), the hex already in the tree. From Fable: the
   material reading (pens a step more saturated than wax), the meter labelled as the
   answer's measure with a whisper that ages, the kinship instrument recording its
   widened anchor set in its own file. Wax-vs-answer-material is the pass-1 variable;
   peer quantisation is handed to §11c.
4. **MRK-LIVE** ← fable MRK-A (one hand, one beat) + opus MARK-A (the still and the
   living). Same mechanism: a pose stack on the active cell on the shared beat, and one
   drawn ring idiom off the board. From Opus: liveness as the state axis, amplitude left
   proportional (the library's law is right), the "stop breathing after N beats" arm,
   the σ-over-TIME row. From Fable: the `FocusRing.vue` singleton positioned on
   `focusin`, the deck ring's 3.6px headroom binding the outset, the wash as a filled
   path on the same seed, the modality comment deleted. Fable's absolute σ rebase is
   demoted to a secondary knob the centre may not depend on.
5. **MRK-ABS** ← opus MARK-B (one visible hand) + the §6 arm of fable MRK-B (one token
   rect, `2px solid --color-focus-sketch` offset 3, both themes). The token rect is the
   "one designed token everywhere off the board" Opus's graded set names.
6. **PLR-SELF** ← opus PLR-A (the sign-in sheet) + fable PLR-A (the crayon stub and the
   roster card). Same mechanism: the mark is one object that is YOU, in your room ink,
   opening the @mbabb card's twin. From Opus: the written-name form, the F1 ruling (your
   page paints you the room's colour; user-ink = solo ink), `you` directly after the
   name, "last heard from", "and 7 more". From Fable: the crayon-stub form (graphite at
   rest, always present), the state line as the mark's accessible name, the well keeps
   invite and leave, `only you` (no `j` in the hand). Name-vs-stub and mirror-vs-move
   the roster are the pass-1 variables.
7. **PLR-COUNT** ← opus PLR-B (the tally) + fable PLR-B's mark (a stack of stubs, one
   per player, then a count). Same mechanism: the count drawn as objects, one per
   person, in their ink. From Opus: the tally (the product already draws one), F1 ruled
   as a room-relative label (the board keeps your blue), the five-second N=3 vs N=4
   read, the one-stroke 44×44 trap. From Fable: the threshold-then-count rule, the
   roster moved out of the well as the lobby. Fable PLR-B's PALETTE went to PAL-TIN.
8. **PAL-TIN** ← opus ACC-C (the tin of twelve) + fable PLR-B's palette
   (`--color-peer-1..12`, index mod 12, lightness step on lap two) + opus ACC-A's peer
   arm (12 = 6 anchors × 2 lightness bands). Same mechanism: a bounded designed set with
   an allocator. From Opus ACC-C: the reservation table, the tick under-mark as the
   sharing axis, "green pencil, two ticks" spoken plainly. From Fable: two arms per
   token, the lightness-step lap, "pens beside the anchors, never the anchors". From
   Opus ACC-A: the anchor-derived variant. Free-stick count and sharing axis are the
   pass-1 variables.
9. **MOT-LADDER** ← fable MOT-A (the duration ladder) + opus MOTN-A (everything on the
   beat). Same mechanism: a closed ladder of LENGTHS, one publisher, a lint. From Fable:
   the rung names on the shipped numbers, the `--card-step-ms` publisher precedent,
   `transition: all` banned, G7 → `--ease-fadeOut`. From Opus: write the gate FIRST and
   run it RED at HEAD, the beat as a candidate quantum, GLIDE_MS into MOTION as the
   named drawer duration, the PRM arms. Quantise-or-not is the pass-1 variable.
10. **MOT-VERB** ← fable MOT-B (four pencil verbs) + opus MOTN-B (the verb ladder).
    Same mechanism: verbs own tuples. From Fable: the DUSK verb (which answers Opus's
    own kill test), the dark toggle's eleven values collapsing to three verbs plus
    celebration keyframes, four as the minimal set. From Opus: LIFT unifying the two
    declared twins by construction, RUB OUT as §7's hole made visible, the on-paper
    assignment over R4's 35-row inventory as the first prototype. Four-vs-six is the
    pass-1 variable.
11. **NOTE-ERASE** ← fable NOTE-A (written, then quiet, then erased) + opus NOTE-A (the
    eraser). Same mechanism: a rub-out mirroring the write-in, an authorship test, life
    per kind. From Fable: the fresh/quiet settle to the 68% rung, the retraction set
    (incl. Escape to the gallery and a newer note), the cell test. From Opus: the wipe
    as the write-in reversed, life measured from the reader's last action, hint ages /
    conflict leaves with its fact / refusal ages fast, the no-text-boil check.
    Clock-or-no-clock is the pass-1 variable.

(Nine ids absorb eleven pairings because PAL-TIN and MRK-ABS each took from three or
from a split proposal.)

## 4 · Retired

- **MRK-STILL** (fable MRK-B, "the frozen hand"). RETIRED as a rewording of the
  incumbent on §5: R3/R6 already measure the ring as `wobbleRect(0.4)` geometry that is
  frozen, not straight; the family's §5 content is "keep that, add baked grain to the
  stroke", which is a move, not a centre, and it leaves R3-a RED by fiat. Stillness is
  still represented in the section by MRK-ABS and MRK-WASH, so no incompatible route was
  lost. Its §6 answer (one token rect off the board) survives inside MRK-ABS.

Nothing retired for a banked-constraint violation: both portfolios had already refused
the violators (a second BoilDivider, CSS borders on chrome, peers assigned wax, a modal
lobby, a boil on 81 cells, `transition: all`, avatar initials in a face with three
capitals).

## 5 · Cross-cutting rows every family in a section carries (no credit, no family)

Controls (§10), every CTRL family answers all eight in its own idiom:
1. VOICE — eight names, ROW 1/2/3 of `r1-controls/probe/heading-voice.spec.ts` green at
   all four cells (the phone ratio 1.0175 → ≥ 1.23; the desk's own 1.294 is the floor).
2. STICKY LAW — what a pinned name means when its group has left (R7 I3 at five states;
   the 1280 "Medium" residual).
3. BUTTONS — seven treatments → a graded set; five radii → a stated set; the hover fill
   that is 2.9 lightness points; the absent focus idiom (chromium 1px auto vs webkit 3px).
4. MOBILE TABS — size/level legible as what they are; the 0×0 inactive panel; 44×44 in
   both dimensions with a per-dimension negative control.
5. THE BAR (M04) — its edge in the house hand; the 23,585px² it lays over the players
   well (R7 I2); its sticky key missing the <1024 landscape scrollport
   (`GameControlPanel.vue:2173`).
6. THE TONGUE'S QUICK SET (§14, M13) — by use; never a guarded act without its guard;
   it must work as the landscape rescue (844×390: the tongue is the only control).
7. THE CONFIRM'S FACE (§15, M12) — three candidate idioms across the portfolios: the
   two-tap sublabel extended (`sure?` in red-ink, disarm on any other tap or 4s), the
   guard ribbon berthed in the bar's note berth, the in-place word swap in a box sized
   for its armed words (zero reflow). Every CTRL family names one and shows fill (52–57
   cells on one tap today) guarded.
8. THE 390 SEAM — the case's stroke inside the wordmark's box by 2.73/3.02px; cures
   offered: the sheet's cap, the masthead's band, the stroke weight; must clear 375 by
   two stroke widths; and the designed masthead-to-board gap nobody owns (4.4px at 900
   and at 390; 1.0px to the risen sheet).

Accent (§3/§4/§12): the four 1.4.11 ratios (ring light/dark; trace over grid-line and
over card, the dark one at 3.07 with 0.07 of headroom) re-derived on every hue move; the
print and forced-colors arms; the focus ring's missing dark arm; the sparkle's two inline
literals; the meter's asymmetric overhang (FRAME_Y_PAD 0) and its absence at 0%.

Marks (§5/§6): filterBudget 9/9/9 with the ghost's own filter `none`; DOM residency
(+3 not +N²); the deck ring's 3.6px headroom; the two 2.70:1 rings; forced-colors keeps
a real outline; the false modality comment at `gameCell.css:243`.

Player mark (§11): the head's free band (250.5px at 390 beside a 75.5px trigger); W3's
one-region law; `only you` not `just you`; no invented "connected" fact; M19 — a peer
arriving never moves focus or opens a surface.

Motion (§13): the exit fold's dead board mover (`App.vue:447 restoreBoardAnims`
finishing the host's own animation) is a MECHANISM row, assumed cured before any curve
is judged; the two-layer easing rule; the drawer's owner-ruled curve and its scope fence.

Copy (§9, B1 — not a family, both hands agree): `the solver finishes the board` →
`fills in the whole board`; `solver's answer N` → `answer N` (completing clue / entry /
answer); the `candidates` caption → `what fits`. Each strikes its ADMITTED row in the
same commit, and the third widens `check-copy-register.mjs` to computed accessible names
(the gate is blind to `useGameCell.ts:153`). Every recut prices its woff2 subset.

## 6 · Couplings across sections (state them; do not resolve them in pass 1)

- ACC-GRAPHITE needs a findable achromatic ring: its author names MRK-LIVE or MRK-WASH.
  ACC-GRAPHITE and PLR-SELF agree on F1 (colour on your own hand means someone else is
  here); ACC-FIVE/ACC-SIX's blue-ink and PLR-COUNT/PLR-PLACE's "the board keeps your
  blue" agree with each other.
- PAL-WALK and PAL-TIN both clear a RESERVED set that the accent family defines; each
  charter states the anchor set it cleared (five crayons or six).
- PAL-TIN cuts new hues into the wheel; under ACC-FIVE they must be pens beside the
  anchors (never a crayon, law 21), under ACC-SIX the sixth anchor is reserved too.
- MOT-VERB's RUB OUT and NOTE-ERASE's wipe are one animation seen from two sections.
- CTRL-FACE composes under CTRL-RULE, CTRL-TABS and CTRL-COST; it cannot compose under
  CTRL-TAPE (the tape in the hand IS that family's voice).
- CTRL-TABS retires the portrait ribbon; §14's quick set then carries the whole tool
  home on every mobile pose.

## 7 · Pass-1 plan (suggested batching for the orchestrator; ≤8 lanes per pass, 5–6 per batch)

Three cheap kills first, each decided by one instrument that already exists:
CTRL-FACE (one stylesheet vs R1's RED heading-voice spec), MOT-DERIVE (arithmetic over
`r4-probe3.json`, no code), MRK-ABS (one dpr3 crop).

- Batch 1: CTRL-FACE · MOT-DERIVE · MRK-ABS · CTRL-TAPE · CTRL-RULE · CTRL-TABS
- Batch 2: CTRL-COST · ACC-SIX · ACC-FIVE · ACC-GRAPHITE · MRK-LIVE · MRK-WASH
- Batch 3: PLR-SELF · PLR-COUNT · PLR-PLACE · PAL-WALK · PAL-TIN
- Batch 4: MOT-LADDER · MOT-VERB · NOTE-ERASE · NOTE-LEDGER

Each lane receives its charter alone (`charters/<id>.md`); no sibling, no favourite.
Instruments to reuse unchanged: R1 `heading-voice.spec.ts`; R7 I2/I3/I4; R2
`accent-kinship.probe.ts` (recording any widened EXCEPTED/anchor set in its own file);
R3 `wobble.probe.ts` / `budget.probe.ts` / `marks2.probe.ts`; R5 I1–I5; R4 i1–i3.

## 8 · Evidence-policy state after this write

No frames banked by the adjudicator. The w7 bucket stands at ~555 KB of images against
the 2 MiB cap (R7's 411 KB is the largest lane). Pass-1 lanes bank few crops and cite each.
