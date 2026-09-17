# T9-W3 — THE SPOKEN PRODUCT

The accessibility tree made to agree with the visible truth. Registry family F13
(verified: V1 confirmed 4/5 P0-P1 claims outright, adjusted the fifth upward), plus
the two user-visible apotheosis gaps (DISPOSITIONS §3 N4). Every cure is a mechanism,
not a patch — the third occurrence of the live-region class gets the class idiom, not
a third local fix.

## 3.1 The occlusion law (the P0)

The portrait controls sheet occludes 81/81 board cells and the grid stays tabbable
and AX-visible. The cure ALREADY EXISTS ONE FILE OVER (V1): `.play-controls` carries
`inert` under `ribbonCovered` (GameControlPanel.vue:558/:1148) beside the estate's own
written rule (":1145-1146 — a control painted out end to end must not answer"). Extend
the same rule to the board: when the risen sheet covers the scene, the covered region
is `inert`. One mechanism, every viewport class it covers (V1/B1 measured 81/81 at
390×844, 63/81 at 768×1024, 46/81 at 820×1180).

- Born-RED: the covered-cells probe (B1's `covered.mjs`) lands as an e2e row — Tab
  from the risen sheet must not reach a covered cell; a keystroke must not land on
  one. RED at HEAD by measurement.
- Interaction with W1: under B7's default (givens inviolable) the worst harm dies in
  W1; this row cures the remaining harm — ANY invisible write, given or not.

**ADJUSTED (chair ruling, T9 W3+W6 seal, 2026-09-17) — the occlusion figures, the metric
that produces them, and the shape of the cure.** Appended under the freeze law; the lines
above stay legible. They are inherited rather than measured, and at the seal three figure
sets were loose in the estate (`../evidence/w3/prove/PROVE-RECORD.md` findings 3 and 4):
this spec's 81/63/46, `e2e/spoken-controls.spec.ts`'s header at 59–62/47–46/40–42, and the
prove lane's geometric census of fullyUnderSheet 81/54/45 beside centreUnderSheet 81/63/54.

**The metric of record is CENTRE-UNDER-SHEET, and it is GEOMETRIC** — a cell counts as
covered when its own centre lies inside the risen sheet's rect. It is what this spec's
original 81 and 63 were measuring. Re-derived at the seal tree rather than carried
(`../evidence/w3/seal/S1-27-census-rederived-both-engines.txt`), it reproduces the prove
lane exactly and to the cell, **identically on both engines**, at 390×844 / 768×1024 /
820×1180:

| pose | centreUnderSheet | fullyUnderSheet | clearOfSheet | focusable, sheet shut | focusable, sheet up |
| --- | --- | --- | --- | --- | --- |
| 390×844 | **81/81** | 81 | 0 | 81/81 | 0/81 |
| 768×1024 | **63/81** | 54 | 18 | 81/81 | 0/81 |
| 820×1180 | **54/81** | 45 | 27 | 81/81 | 0/81 |

Only the third pose moves against this spec's header (46 → 54). fullyUnderSheet is retired
as a stricter geometry answering a different question.

**Why three sets existed, named so the next census does not repeat it.** The
`spoken-controls.spec.ts` range (59–62 / 47–46 / 40–42) has two defects compounded. First,
it was taken before the grid finished sizing: a census that skips zero-width cells counts
about a third of the board, which this seal reproduced by accident and then fixed with a
poll for 81 laid-out cells. Second, it hit-tested `document.elementFromPoint`, and `inert`
removes an element from hit-testing — so on a CURED tree that predicate calls all 81 cells
covered at every pose, both engines (`centreHitTestCovered` in the banked census; the prove
lane's own control reads `inertIsBox: false`). A premise satisfied by the cure it is meant
to be independent of is not a premise. `e2e/spoken-controls.spec.ts`'s census was moved to
the geometric predicate in the same commit, given a sheet-SHUT control of its own, and that
control was plant-proved RED 4/4 against a census that answers "covered" unconditionally
(`../evidence/w3/seal/S1-31-probe-census-lies-RED.txt`).

**The mechanism is MODAL — the metric is geometric, the CURE is not.** The sentence above says "the covered region is
`inert`"; what ships inerts the WHOLE grid (`GameBoard.vue`, `:inert="boardCovered ||
undefined"`), so cells geometrically clear of the risen sheet lose focusability with it —
18 of 81 at 768×1024, 27 of 81 at 820×1180. That is the decision, not an over-reach: one
predicate, modal semantics, because a half-covered cell is ambiguous and the tab is the
sheet's only route out. `GameBoard.occlusion.test.ts` already pins the corollary the modal
reading requires — the `inert` lands on the GRID and never on the shell, so a covered board
can still speak.

**The P0 is unmoved, and the cure is measured.** The row rests on the focusable column,
which never depended on the coverage census: **81 of 81** cells took focus at every pose —
that is the defect — and with the cure landed the same sweep reads **0 of 81** at every
pose, both engines (same banked census). The cure's born-RED is at
`../evidence/w3/seal/S1-16-probe-write-assertion-alone-RED.txt`: with the `inert` ablated a
keystroke writes `5` into a covered cell, 4/4, both engines, both poses.
`../evidence/w3/handoffs/fold-FA5-1.md` raised the stale-figures half and is SPENT here.

## 3.2 Focus returns on every gallery exit (P1, adjusted)

Seven of seven exit paths that begin with focus in the deck land it on `<body>`
(V1 measured; the set includes `d`-to-deal). App.vue contains zero focus calls; the
gallery focuses on mount (:787) and never returns. The guard ribbon already does this
correctly inside the deck (:755 retire → viewport) — generalize its idiom: the deck
records what held focus at entry and hands it back on unmount, whatever the exit verb.
The V1 exception is law, not a bug: an Escape taken with focus OUTSIDE the deck (the
window-scoped listener) must NOT steal focus back.

- Born-RED: e2e rows per exit verb (escape / enter-same / enter-other / g / d), each
  asserting `document.activeElement` after exit.

## 3.3 Authorship speaks true (P1)

"Row 1, column 1, your entry 4, written by naked-narwhal" — false authorship,
self-contradicting, and PINNED by the unit gate (DigitCell.attribution.test.ts:69).
The name assembly (useGameCell.ts:121-122) gains the authorship branch: a peer's cell
speaks the peer ("naked-narwhal's entry 4"), yours stays "your entry". The pinning
test is re-cut to assert the truth — the gate that enshrines a defect is itself a
defect (F5's lesson at the unit scale).

## 3.4 The live-region class idiom (P1, third occurrence)

Three regions in the players well are born-populated and/or unmounted-with-content, so
they never speak: `players-status` (:902), `players-empty` (:985), and V1's extension
`players-roster` (role="log", :926-931 — the 0→1 case; T7-W2 cured only 1→2). The
gallery already carries the cured pattern (GameGallery.vue:39-41/:418-421: persistent
region, content swapped in). Third occurrence = the CLASS gets the idiom: a shared
`useLiveRegion` (or equivalent) that is BORN EMPTY, PERSISTS across the state it
narrates, and receives content after mount. All five sites (three well + two gallery)
converge on it; the local patches die.

- Born-RED: unit rows driving each region's state transition and asserting an
  utterance-visible mutation (content arrives INTO a mounted region).
- W5 rider: a static police for the class (`aria-live` under `v-if` with non-empty
  initial content) so a fourth occurrence cannot land quiet.

## 3.5 Deals and forced fills announce (P1)

`freshBoardCopy()` returns `""` since T8-W6 deleted the board caption; fill-forced
routes through a progressbar value change no AT announces (V1: zero utterances for
eleven cells appearing). The status channel exists and works (solve/clear/hint speak).
Deal announces plainly ("new board — 9 by 9, easy"); fill-forced announces its count.
Copy through the M16 register; strings enter the zone-grammar census.

## 3.6 The copy act reaches AT (P2)

`copyAct`'s outcome is invisible to AT and its failure sentence unreachable; for
1600ms the accessible name ("Link copied") contradicts the visible sublabel
("Share"). Route the outcome through the status region; name and label agree at every
beat.

## 3.7 Small truths (P2/P3)

- Guard-arm double-speak: one utterance, not two (drop the redundant channel;
  the alertdialog's name is the survivor).
- Phone head focus order: DOM order follows visual order (mobile-attribution's
  placement), desktop and phone consistent.
- The deck's focus ring rides the FOCUSED CARD, not the clipping viewport (the
  correctness half; its look is W7 §6).
- Presence-timeout roster truth + coarse-pointer attribution affordance (apotheosis
  gaps, N4): the roster row stops lying past the 45s expiry; touch users get a
  visible attribution surface (mechanism here, look with W7).

## Gate spine

- Born-RED AX probes for §3.1–§3.5, each red at HEAD by measurement before any cure
  lands (the defects are all live — V1/B1 measured every one on the deployed edge).
- The e2e count pins move: run the doc gates in the same commit (the T8.1 trap).
- π identity on all visual goldens — this wave speaks; it does not repaint. Any pixel
  a cure moves (focus ring, attribution affordance) declares a DELTA and lands with W7.
