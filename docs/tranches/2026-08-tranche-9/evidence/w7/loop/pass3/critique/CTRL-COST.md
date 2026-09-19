# CTRL-COST — pass 3 ADVERSARIAL CRITIQUE (the consequence ladder)

Critic wrote neither the spec nor the prototype. Every numbered row below was re-measured on this
lane's own servers unless it says **[earlier lane]** or **[theirs]**.

- **Subject.** Worktree
  `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-29`,
  verified at `74a2b5d9`, uncommitted, 18 files +1,980/−1,547 plus `scripts/check-cost-face.mjs`.
- **This lane's servers.** Prototype `127.0.0.1:4237`; HEAD control `127.0.0.1:4238` served
  read-only from the MAIN tree at `74a2b5d9` (private `cacheDir`, main's `src` untouched). Both
  killed; 4237/4238 read clear. 4233/4234/4246/4247 belong to the CTRL-TAPE and CTRL-RULE critic
  lanes running concurrently and were left alone.
- **This lane's instruments.** `probe/v1-pi-phone.mjs` (π at 390×844, sheet shut, both trees),
  `probe/v2-press-aria.mjs` (the press-count row re-pressed, the armed control's SPOKEN shape, the
  painted asked word), `probe/v3-landscape-reach.mjs` (a READING of the 844×390 question),
  `probe/v4-clear-answer.mjs` (G15′ on the SECOND face). Readings under `readings/v*.json`.
- **A pass-3 critique of this same prototype already existed** (written 2026-09-18 22:22 by an
  earlier critic lane; this lane was re-dispatched). It is preserved unedited at
  `critique/CTRL-COST/critique-r1-earlier-lane.md`. Its rows are carried here only where this
  lane either reproduced them or verified their mechanism in the source; those are marked.
- Nothing under `loop/r0/`, `loop/pass1/` or `loop/pass2/` was written.

---

## 1 · WHAT IS TRUE — re-measured here

| row | this lane's reading | verdict |
|---|---|---|
| **G14′ THE PRESS-COUNT ROW** (pass 2's blocking row) | `v2`: webkit 390×844 touch, webkit 1280×800 mouse, chromium 1280×800 mouse — press 1 **arms**, focusouts on the face **0**, Δ card scrollTop **0.00**, press 2 **FIRES** (board signature changes), and the arm itself changes no signature | **CONFIRMED independently, second time.** The blocking row is dead. |
| **G6′ zero reflow** | the deal face's box between rest and armed: **Δ [0,0,0,0]** in all three cells, face scrolled into view before the press so no harness scroll contaminates it | CONFIRMED |
| **G15′ the answer, deal face** | `no` **56.00 × 44.00** at 390×844, **44.00 × 44.00** at 1280×800, `visibility: hidden` at rest and `visible` armed, accessible name `no`, own description `keeps the board` | CONFIRMED (see §2.7 for the dimension nobody declared) |
| **G15′ the answer, CLEAR face** — not in the return | `v4`: **44.00 × 44.00** webkit 390×844 AND chromium 1280×800, with the control that fires | CONFIRMED and extended — the second face clears the floor too |
| **G21 / G9′ the fence** | `v2`, painted, both engines: the asked word `sure?` `rgb(208,42,82)` on `rgb(253,253,252)` = **4.990** armed AND armed+hovered. Dark recomputed from the tokens (`#FF5C7C` on `#131211`) = **6.37** | CONFIRMED; the two-selector fence holds |
| **G16′ the derived band** | `--pin-band` computes **47.0656px** chromium / **47.065601px** webkit; `padding-top` and `scroll-padding-top` both read it; `--cost-head-h` is a `calc()` with no publisher; `.cost-band-head` is `position: sticky; top: calc(0.6rem - var(--pin-band))` | CONFIRMED |
| **G23 the node witness** | ran bare: 7 checks GREEN, and the source-text shape is genuinely falsifiable (it reads the declaration, not a parsed model) | CONFIRMED |
| **M16** | `npm run lint:copy` bare: **0 em/en dashes, 0 unadmitted, 0 ADMITTED**, self-test colours RED as required | CONFIRMED |
| **no new hex** | the diff's only new hex are ratios quoted inside comments; the 8% tier-3 ground stays retired | CONFIRMED |
| goldens 4/4, filter census 12/12 budget 9 | **[theirs]** `readings/dist.log`, off `npx vite build`'s dist in the worktree — not rebuilt here | accepted as theirs |

The prototype's four corrections against interest are real, and the third —
**`@property … inherits: false` silently re-opening G16′** — is the wave's news, not this
family's. It belongs in §10's single registration block **with its reason**.

---

## 2 · WHAT IS NOT CONVERGED

### 2.1 π MOVES THE PHONE'S MASTHEAD AND BOARD — reproduced here, both engines

The prototype's π census ran at **1280×800 only**. At **390×844 with the sheet SHUT** — a surface
this wave does not claim — `v1` reads, prototype vs the `74a2b5d9` control I served myself:

| box (390×844, sheet shut) | HEAD | prototype | Δ |
|---|---|---|---|
| `.masthead` y, webkit | 143.80 | **141.58** | **−2.22** |
| `.board-wrapper` y, webkit | 219.42 | **217.20** | **−2.22** |
| `.masthead` y, chromium | 143.52 | **141.30** | **−2.22** |
| `.board-wrapper` y, chromium | 219.73 | **217.52** | **−2.21** |
| `#fold-tools` height | 61.58 (`min-height: auto`) | **66.00** (`min-height: 66px`) | +4.42 |
| `.play-controls` box | 245.83 × 55.98 | **263.42 × 65.58** | +17.59 × +9.60 |

The mechanism is declared inside the diff — `.act-face`'s `padding: 0.32rem 0.9rem` now wraps the
three play verbs, the ribbon's row grows, and `--fold-tools-h` publishes the grown number as the
band's reserve. What is NOT declared is that the reserve **lands on the board column**: the board
and the wordmark lift 2.2px on the phone, which is the pixel class the π row exists to forbid, at
the viewport the census never opened. (Independently the same figures the earlier lane read.)

### 2.2 W2 §2.6's STICKY TAG IS DELETED FROM THE CARD — and the chair refused exactly that

`.washi-tag` falls from **12 references at HEAD to 1** in `GameControlPanel.vue` (the survivor is
a comment), the `.tray-well .washi-tag` rules and the `--washi-tag-top`/`-lift`/`-gap`/`-inset`
pins go with the wells, and `SheetWashiLabel.vue` drops `.washi-tag[data-under-bar]`. Chair
§6.3(a), on the sibling lane: *"retiring §2.6's sticky tag: REFUSED. The sticky tag is owner mark
T9-M03 … only the owner retires a mark (U-10) … the lane re-cuts to keep the pin, or returns the
fork with both frames."* CTRL-COST does neither. The mark's **intent** arguably survives in kind —
a sticky band head is a name pinned over its group — and that is a good argument, but it is an
argument for the owner's eye, and `M03` appears exactly once in the whole diff, in a comment about
the masthead seam. **No ballot, no fork, no disposition row.**

### 2.3 `.action-bar` IS DELETED — T9-M04's subject, and the sibling's route was ACCEPTED

`--action-bar-h`, `scroll-padding-bottom`, `.action-bar::before` and the bar itself go; the lane
reports law-probe row R3 **MOVED** because the class renders nowhere. R3 cites owner mark T9-M04
(2026-08-25). Chair §6.3(c) **ACCEPTED** CTRL-TAPE's route for the same furniture — move the bar
to `#card-foot` with `env(safe-area-inset-bottom)` — which is a re-home, not a deletion. Deleting
an owner mark's subject is U-10's, and no fork is carried. **[earlier lane; verified here by
grep over both trees.]**

### 2.4 CHAIR §6.5 IS OBEYED TWICE AND BROKEN ONCE IN THE SAME DIFF

`--card-pad-b` and `--pin-band` are `@property`-registered with `initial-value` and (correctly,
and this is the pass's best catch) `inherits: true`. **`--fold-tools-h` is a measured token this
same diff starts publishing from JS** (`GameControlPanel.vue:804`), consumed bare at
`scene.css:667` (`min-height: var(--fold-tools-h)`), and `grep` finds **no `@property` for it**.
The comment argues the opposite position — an invalid declaration collapses the band visibly,
which is loud — and that position may even be right, but §6.5 is a wave-wide ruling and a lane
that disagrees carries its objection **in its return**, which this one does not. **[earlier lane;
re-verified by grep here.]**

### 2.5 THE ARMED VERB SAYS THE SAME SENTENCE TWICE — new, mine

`v2`, all three cells: with the deal face armed, the verb button's accessible **name** is
`Press again to deal a new board` and its `aria-describedby` target's text is
`Press again to deal a new board` — `nameEqualsDesc: true`. A screen reader speaks the name, then
the description: the same words, twice, at the one moment the ask is supposed to be clear. The
split the design is proud of (the answer carries its own name and its own "keeps the board") is
right; the verb's half is a duplicate. Either the name stays `Deal a new board` and the
description carries the ask, or the sr-only span goes.

Related and unmeasured by anybody: **the ask is never announced to a reader who arms by pointer.**
Nothing live speaks, the name change is only heard if focus is already on the verb, and on WebKit
focus is `BODY` after a pointer arm (`focusAfterArm: "BODY"`, measured here in both WebKit cells,
which is the input split working as designed). `lint:live-regions` reads 10/0 — correct, and also
the reason there is no announcement.

### 2.6 THE CONSEQUENCE SENTENCE NEVER REACHES THE PRESS — and the cited crop shows it anyway

Band 3's two NOTES rows are the family's own thesis. `v2` reads the berth immediately after the
arm: `text: ""` at **390×844 webkit touch** and `text: ""` at **1280×800 chromium mouse-click**.
The berth is summoned by `pointerover` / `focusin:focus-visible`; a tap supplies neither, and a
click is not `:focus-visible`. So the sentence `a new board replaces this one` paints only while a
mouse hovers — never on the phone, and not at the moment of the ask on the desk.
`frames/ask-390-light-armed.png`, a cited 390 crop, shows the note anyway, because the frame
script hovered with a mouse inside a `hasTouch` context. **Unverified gestalt, on the family's own
centre.** **[earlier lane's finding; reproduced here by a different route.]**

### 2.7 THE TAP FLOOR'S WIDTH HALF IS AN ACCIDENT ON THE ANSWER — new, mine

`v4`: `.act-answer` computes `min-height: 44px` and **`min-width: auto`**. It measures 44.00 wide
on both faces at the desk — with **zero headroom**, from padding alone. `check-cost-face`'s check 1
asserts the height half only. `index.css`'s own coarse-floor block is the estate's argument
against exactly this: the min-width half exists because "a height-only rule can never reach" that
dimension. Re-cut the answer's padding or type by a pixel and `no` drops under 44 wide, silently,
on the engine half of readers — which is the failure mode G23 was written to make loud.

### 2.8 TWO FACES OF ONE TIER, TWO DIFFERENT BOXES

Same row, same top edge (`y` 600.08), 390×844 both engines: **deal 73.59 × 123.97** against
**clear 61.59 × 104.38**; at 1280×800, 110.38 against 102.38. The words `deal` and `clear` do not
share a baseline. The section ranks tier 3 by "the box at stroke 2.5" — two boxes, two sizes, no
row claiming it either way. It is visible in the lane's own cited rest and armed crops, which I
looked at. **[earlier lane noted it; measured here.]**

### 2.9 THE OCCLUSION HEADLINE HIDES ITS PREDICATE

"0 of 25 covered in EVERY cell" is true under `belowExemptBand`. The prototype's own readings
carry, in the same objects, `exempt: 3` and `exempt: 2` — **5 of the 25 reads are controls whose
centre `elementFromPoint` returns the pinned head for**, excused because the `::before` sentinel
paints solid card over exactly that strip. The exemption is geometrically sound (the sentinel is
`pointer-events: none`, and the strip is the card's own reserve). But pass 2's HEAD numbers
(71.5% / 63.3%) were computed **without** the predicate, so the comparison is not like-for-like,
and a number that is 0 only under a predicate should print the predicate's count beside it.

### 2.10 THE HARD PART IS NOT STARTED — and it is bigger than 22 rows

**Zero e2e files are touched** and the default suite was never run. Specs naming addresses this
diff deletes or re-homes, by `grep`: `viewport-law.spec.ts` and `zone-grammar.spec.ts`
(`.action-bar`), `access.spec.ts`, `font-census.spec.ts`, `zone-grammar`, `viewport-law`
(`.zone-row-label`), `mobile-affordances.spec.ts`, `viewport-law`, `board-covisibility.spec.ts`
(`#fold-tools`), and `share-truth.spec.ts` + three others on `.washi-label`. That is the
elegant-reduction trap by its own name, and the lane says so.

### 2.11 `--ring-ink` IS CONSUMED AND MINTED NOWHERE

Four rules read `var(--ring-ink, currentColor)`; no file in the tree defines the token, so every
ring in the card and in the face paints `currentColor`. The deferral to §6/MRK-LIVE is reasoned at
the seam — but the shipped appearance is a fallback nobody has looked at: no frame shows a focus
ring in either theme, and the ring around the drawn 1.5 answer box (index.css's `:is(.act-verb,
.act-answer):focus-visible` at offset −2, inside a box that is itself inside the 2.5 face) was
never checked for a double-ring. **[earlier lane; their gap 7 too.]**

### 2.12 W2 §2.2's REACHABILITY PROBE IS OWED — my reading is favourable, and is not the probe

Chair §6.2 binds every §10 lane to assert W2 §2.2's born-RED probe at 844×390. Not run. `v3`, as a
**reading** at 844×390 through the tab (`openedBy: false`, `tabbed: true`), both engines: card
`clientHeight` **302**, `scrollHeight` **891**, and all four bands' first control scrolls into the
card, lands inside its box, and hit-tests to itself. That is evidence the cued path works; it is
not the probe, and **812×375 — the other width the chair names for a deleted tab regime — was
never opened**, which matters because this design deletes the section tabs (`.mobile-heading-btn`
leaves both halves of the coarse floor).

### 2.13 SMALLER, EACH CLOSABLE

- **The resting verb word reads 4.382 on its own hover ground** (light, both engines; theirs and
  the earlier lane's agree). Inherited from HEAD's `.icon-btn:hover` — but this is the family that
  measured the fence one rank up, and the rank below it is under 4.5 with no row naming it.
- **T7-W2 A2's `inert` row** is swapped for a disabled Teleport with no disposition; the effect is
  preserved (0 focusables in the covered ribbon on both trees). Chair §6.7's rule for the sibling
  case (A4) is that a reversal needs a row. **[earlier lane.]**
- **`--motion-whisper` and the `@property` block are this lane's seats**, uncoordinated with
  CTRL-TAPE (theirs), **and so is the foot**: COST re-homes the fade to `.controls-card::after`
  spending `--card-pad-b` while TAPE lands `.card-foot` + `--card-foot-h` + `--safe-b`. The return
  names the first collision and not the second. **[earlier lane.]**
- **The ruler law has no CI witness.** G23 holds declarations; the ruler is a width, O-12 says CI
  is browserless, so the one number keeping three goldens green is held by a local probe and a
  locally-minted golden. The family's own argument for writing `check-cost-face.mjs` was not
  extended to the row that pays for it. **[earlier lane.]**
- **π's node counts differ between trees** (chromium /futoshiki 564 vs 586); the diff compares the
  intersection of ancestry paths, and the unmatched nodes are not listed. **[earlier lane.]**
- **Only chromium crops**; the webkit pair unshot; **dark and 900×500 press-count cells unrun**
  (theirs).
- **A touch-armer who reaches for the keyboard has no focused answer** — said plainly in the
  return, still unmeasured as its own row.
- **L3 stays RED and R3 is reported MOVED**; the proposed diff is banked, not applied — correct
  under the freeze, and still an open row for the chair.

---

## 3 · CHECKLIST HITS

- **the pixel it moves that it did not declare (π)** — 2.2px of masthead and board on the phone,
  both engines, reproduced (§2.1).
- **the constraint it forgot** — chair §6.5 on `--fold-tools-h` (§2.4); owner mark T9-M03's
  mechanism (§2.2); T9-M04's subject (§2.3); W2 §2.2's probe and 812×375 (§2.12); T7-W2 A2's
  disposition (§2.13).
- **unverified gestalt** — a 390 crop showing a note the 390 surface cannot summon (§2.6); no ring
  frame in either theme (§2.11); webkit unshot.
- **the elegant-reduction trap** — the e2e estate, zero files touched (§2.10).
- **gates that cannot fail** — not hit outright (`--self-test` plants seven defects and each reds
  only its own), but three soft spots: the occlusion headline reports exempted reads as clear
  (§2.9), the tap floor's width half is held by nothing (§2.7), and the ruler has no CI gate at
  all (§2.13).
- **masked fallback** — `var(--ring-ink, currentColor)` ships a ring from a token nothing mints
  (§2.11). Reasoned, which is why it is a soft hit.
- NOT hit: **vacuous convergence** (every gate has a RED at HEAD) · **spec-cites-itself** (the
  spec's own arithmetic was corrected against interest three times) · **legacy aliases**
  (`.act-face` unifies the gallery's face and the card's — one idiom on two surfaces, the old
  names die) · **consumer-less substrate** (`--motion-whisper` has eight consumers,
  `confirmWindowMs` two; `MOTION.inkLiftMs` dies at zero) · **the generic default** (drawn boxes,
  lowercase names, the house hand; no eyebrows, no arrows, no identical cards).

---

## 4 · STRENGTHS

1. **The blocking row is cured, and it now reproduces under a third party's probe.** Press it
   twice on WebKit and the board changes — 0 focusouts on the face, 0 scroll under the thumb, in
   three cells here and five in theirs. The mechanism (a pointer arm moves no focus; a keyboard
   arm focuses the safe answer with `preventScroll`; a null `relatedTarget` is not a departure) is
   named at the seam and is general.
2. **The ruler law is the pass's best engineering**, and chair §6.4 is satisfied without a re-mint:
   two over-width boxes named and cured structurally (a one-column grid of rungs, since flex-wrap
   does not lower max-content; `contain: inline-size` on a row priced by an uncontained sibling),
   and the card then measures identical to the control per engine.
3. **The derived pin band kills a sampled publisher and its observer term**, and four heads come
   out at one height on both engines.
4. **`no` is a real control on BOTH faces** — 44.00 in both dimensions at the desk with the firing
   control, own name, own description, its own drawn box at a lighter weight than the face.
5. **The node witness is an honest browserless gate**, and its shape is reusable.
6. **Three defects found by measuring rather than asserting**, one of which — the registration's
   inheritance flag — is a trap for the whole wave.

---

## 5 · CONVERGENCE — 70%, EARNED

A running prototype on the real surface in both engines, with both pass-2 blocking rows cured and
the harder one reproduced twice by lanes that did not write it. Against that: a reproduced π
regression on the phone, **two owner marks' furniture deleted without a ballot** (§2.2, §2.3), a
wave-wide ruling broken in the same diff that obeys it (§2.4), the family's own consequence copy
unreachable on the pointer class the ask was designed for (§2.6), the armed control saying its
sentence twice (§2.5), a tap floor held in one dimension of two (§2.7), and the largest remaining
piece of work not begun (§2.10). 100 needs zero open gaps; there are seventeen, five of them
constraint-class. Two points below the earlier lane's 72, for the mark-class row it did not name
and the undeclared floor dimension.

**VERDICT: ADVANCE.** No missing primitive — every gap above is a closable row inside this design,
and the merge watch's answer holds on the readings (one pin-band mechanism with two publishers,
one `useTwoTap`/`askingAct` machinery with two policies). The graft list is worth grafting, the
centre folds, and the two policy rows — the ask is pointer-agnostic, the answer is a real control —
should ride to W1 §1.5 / U-10 intact, with §2.7's width half written into the second one.

---

## 6 · CROSS-POLLINATION

1. **`@property … inherits: false` is a second silent-zero vector.** A registration decides not
   only what an ABSENT publisher yields but who can see a PRESENT one. §10's single registration
   block carries `inherits: true` with this reason, and every lane consuming a measured token on a
   descendant re-reads its own pin.
2. **The ruler law** — "nothing in the card out-measures the legend fold" — with its two cures
   (grid rungs instead of a wrapped flex row; `contain: inline-size` on a row priced by an
   uncontained sibling) closes the width question for every §10 lane without a re-mint.
3. **The input split**: a pointer arm moves no focus, a keyboard arm focuses the safe answer with
   `preventScroll`, and a null `relatedTarget` is not a departure. The general cure for every
   two-tap confirm in the estate, and the general reading of WebKit's pre-click blur.
4. **`check-cost-face.mjs`'s shape** — a browserless node gate asserting the DECLARATION a local
   geometry follows from, self-tested by planting one defect per check — is the pattern for every
   O-12 lane whose real instrument cannot run in CI. **Extend it: a floor with two dimensions
   needs two checks** (§2.7).
5. **The berth-in-the-head**: a sticky head has the same "content can never enter it" property the
   foot berth was paying 3.5rem for, beside the verb instead of five rows below it — *provided the
   summoning is not hover-only* (§2.6). Any lane grafting it inherits that question.
6. **Two frame laws for the wave.** A crop taken with a mouse inside a `hasTouch` context is not a
   phone frame and must say which pointer took it. And a headline number computed under a
   predicate prints the predicate's count beside it (§2.9).
7. **Check the armed control's spoken shape, not just its tree membership**: name and description
   being the same sentence is double-speak, and no gate in this estate reads for it (§2.5).
