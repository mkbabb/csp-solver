# CTRL-COST — pass 3 ADVERSARIAL CRITIQUE (the consequence ladder)

Critic did not write the spec or the prototype. Everything below that carries a number was
re-measured by this lane unless it says otherwise; the prototype's own readings are cited as
theirs and named as such.

- Subject: worktree `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-29` (cut from `74a2b5d9`, uncommitted, 18 files +1,980/−1,547 + `scripts/check-cost-face.mjs`).
- Critic's servers: prototype `127.0.0.1:4241`, HEAD control `127.0.0.1:4242` served from the
  MAIN tree at **`74a2b5d9`** (read-only, private `cacheDir` in the scratchpad — main's `src` was
  not touched). Both killed; the band reads clear of this lane.
- Critic's instruments: `probe/c1-desk.mjs` (ruler · heads · four-state painted contrast ·
  occlusion sweep · answer box · filters), `probe/c2-press.mjs` (the press-count row, written
  from scratch), `probe/c3-ring-note.mjs` (the focused ring; the note on a coarse pointer),
  `probe/c4-inert.mjs` (T7-W2 A2's `inert` row and the ribbon's reserve, both trees).
  Readings under `readings/`. No file under `loop/r0/`, `loop/pass1/` or `loop/pass2/` written.

---

## 1 · WHAT IS TRUE — re-measured, not accepted

| row | critic's reading | verdict |
|---|---|---|
| **G14′ the press-count row** | `c2-press`: webkit 390×844 touch, webkit 1280×800 mouse, chromium 390×844 — press 1 **arms**, focusouts on the face **0**, Δ scrollTop **0.00**, press 2 **FIRES** (board signature changes), face disarmed after | **CONFIRMED, independently.** Pass 2's blocking row is dead. |
| **G6′ zero reflow** | same runs, band scrolled into view FIRST so no harness scroll contaminates it: deal face Δ **[0,0,0,0]**, clear face Δ **[0,0,0,0]**, card scrollTop Δ **0** | CONFIRMED |
| **G15′ the answer** | `no` = **56.00 × 44.00** at 390×844, **44.00 × 44.00** at 1280×800, both engines; `min-height: 44px`; ARIA snapshot reads `button "Press again to deal a new board"` + `button "no"`, own `aria-describedby` | CONFIRMED |
| **G20 THE RULER** | prototype vs the HEAD control I served myself: card **324.22 / 324.22** chromium, **332.31 / 332.31** webkit; board x **129.89 / 129.89** and **125.84 / 125.84** — \|Δ\| **0.00** on both engines; over-ruler children 0 (the two my sweep flags are an `<svg>` with no intrinsic inline size and an `.sr-only` span, neither of which participates) | CONFIRMED — the card measures byte-identical to `74a2b5d9` per engine |
| **G16′ four heads one height** | **37.44 / 37.44 / 37.44 / 37.44**, both engines; `--pin-band` computes **47.0656px**, `padding-top` and `scroll-padding-top` both read it; `--cost-head-h` is a `calc()`, no publisher | CONFIRMED |
| the occlusion cure itself | my sweep (no exemption): HEAD covers **1 / 2 / 3 / 3 / 2** controls at scrollTop 0/58/116/200/302; the prototype covers **0 / 0 / 3 / 0 / 2** | the cure is REAL at 0 and 58 — see §2.5 for what the other cells are |
| **G21 / G9′ the asked word** | 4 states × 2 engines, painted: **4.990** light in rest, rest-hovered, armed and **armed+hovered**; **6.303** dark | CONFIRMED, the fence holds |
| **G23 the node witness** | ran it: 7 checks GREEN, `--self-test` mints 7 plants and each REDs **its own check and only its own** | CONFIRMED — a gate that can be shown failing |
| bare gates | `lint:cost-face` OK · `lint:copy` 0/0/0 ADMITTED · `lint:live-regions` 10/0 · `lint:theme-selectors` OK · `lint:motion` OK (34 specs) · `check-font-coverage` exit 0 · `vitest src/games/shared` exit 0 | CONFIRMED |
| no new hex | the only hex the diff adds are two ratios quoted inside comments (`#D02A52`, `#737373`); the 8% tier-3 ground stays retired | CONFIRMED |
| the focused ring | `.act-answer` while `:focus-visible`: **2px solid, offset −2**, both engines | CONFIRMED (see gap 7 for what is around it) |

Four corrections against interest in the prototype's own return are real and each is
load-bearing; the third — **`@property … inherits: false` silently re-opening G16′** — is the
wave's news, not this family's, and belongs in §10's single registration block with its reason.

---

## 2 · WHAT IS NOT CONVERGED

### 2.1 π IS NOT IDENTITY AT 390×844 — MEASURED, BOTH ENGINES, REPRODUCIBLE

The π census ran at **1280×800 only**, sheet shut, light, five routes. At **390×844 with the
sheet SHUT** — a surface this wave does not claim — the page moves against `74a2b5d9`:

| box (sheet shut, 390×844) | HEAD `74a2b5d9` | prototype | Δ |
|---|---|---|---|
| masthead y, webkit | 143.80 | **141.58** | **−2.22** |
| board-wrapper y, webkit | 219.42 | **217.20** | **−2.22** |
| masthead y, chromium | 143.52 | **141.30** | **−2.22** |
| board-wrapper y, chromium | 219.73 | **217.52** | **−2.21** |
| `.fold-tools` height | 61.58 (`min-height: auto`) | **66** (`min-height: 66px`) | +4.42 |
| `.play-controls` box | 245.83 × 55.98 | **263.42 × 65.58** | +17.59 × +9.60 |

(`readings/c4-*-390x844*.json`; the webkit cell was run twice and reproduces to 0.00.) The
mechanism is declared inside the diff — `.act-face`'s `padding: 0.32rem 0.9rem` now wraps the
three play verbs, so the ribbon's own row grows, and `--fold-tools-h` publishes the grown number
as the band's reserve. What is NOT declared is that the reserve lands **on the board column**:
the masthead and the board lift 2.2px on the phone, the exact class of pixel the π row exists to
forbid, and the census never looked at the viewport where it happens.

### 2.2 THE BAND-3 NOTES NEVER REACH A PHONE — and a cited frame shows them there

The two new copy rows are the family's own thesis ("say the cost before they press"). Measured
(`readings/c3-*.json`): at **390×844 webkit touch**, tapping `deal` arms the face
(`armedAfterTap: true`) and the berth stays **empty** — `text: ""`, `is-shown: false`,
`opacity: 0`. At **1280×800 chromium** the same press paints `a new board replaces this one`.
The berth is summoned by `pointerover` / `focusin:focus-visible`, and a thumb supplies neither.
`frames/ask-390-light-armed.png` — a cited 390 crop — shows the note anyway, because the frame
script hovered with a mouse inside a `hasTouch` context. That is a gestalt asserted on a surface
that cannot produce it.

### 2.3 T7-W2 A2's `inert` ROW IS DELETED WITHOUT A DISPOSITION

`readings/c4-*`: at HEAD, with the sheet up, `.play-controls` carries `inert` (`toolsHasInertAttr
true`, inside `#fold-tools`). In the prototype the attribute is gone; the Teleport is disabled
instead and the row rides into the card (`toolsInCard true`). **The effect is preserved** — the
covered ribbon holds 0 focusables in both trees, and a read 120 ms into the slide already shows
the row inside the card, so no transitional exposure was observed here. But the chair's own rule
for the sibling case (§6.7, T7-W2 A4: "a reversal needs a disposition") is unmet: a P0-era a11y
cure's mechanism is swapped and no row says why A2's reason no longer holds.

### 2.4 `.action-bar` IS DELETED — AND R3 IS OWNER MARK T9-M04'S SUBJECT

The law probe's R3 reads *"the mobile floating controls bar wears a drawn edge in the house
hand — cite T9-M04 (owner 2026-08-25)"*. This design deletes the bar, its `--action-bar-h`, its
`scroll-padding-bottom` and its `::before`, and the lane reports R3 **MOVED** on the ground that
the class renders nowhere. Retiring a mark is the owner's (U-10; the chair refused exactly this
for the sticky tag at §6.3(a)), and the sibling lane's chair-**ACCEPTED** route (§6.3(c)) MOVES
the bar to `#card-foot` with `env(safe-area-inset-bottom)` rather than deleting it. No ballot and
no fork with both frames is carried for the owner.

### 2.5 THE OCCLUSION HEADLINE HIDES ITS EXEMPTION

The return says "0 of 25 covered in EVERY cell … Pass 2's HEAD readings were 71.5% / 63.3%". My
sweep, written without an exemption, finds **3 controls covered at scrollTop 116 and 2 at 302,
both engines** — exactly the prototype's own `exempt: 3` and `exempt: 2` in the same cells
(`prototype/readings/r3-*.json`). The exemption is geometrically defensible (the `::before`
sentinel paints solid card for exactly `--pin-band` px, which is the strip `belowExemptBand`
excuses), and it is declared in the probe's header — but it is not in the headline, and the
pass-2 comparison is not like-for-like. A number that is 0 only under a predicate should print
the predicate's count beside it.

### 2.6 CHAIR §6.5 IS OBEYED TWICE AND BROKEN ONCE, IN THE SAME DIFF

`--card-pad-b` and `--pin-band` are registered with `initial-value` and `inherits: true`, bare
`var()` at every consumer — correct. **`--fold-tools-h` is a measured token this same diff starts
publishing from JS, consumed bare at `scene.css` `min-height: var(--fold-tools-h)`, and it is not
registered.** The comment argues for the opposite behaviour ("an absent publisher makes the
declaration invalid and the band collapses visibly, which is loud"), which is a position — but
§6.5 is a wave-wide ruling and the lane's return does not carry the objection.

### 2.7 `--ring-ink` IS CONSUMED AND MINTED NOWHERE

Four rules read `var(--ring-ink, currentColor)` and no file in the tree defines the token, so
every ring in the card and the face paints `currentColor` (measured `rgb(10,10,10)` on the
answer). The deferral to §6/MRK-LIVE is reasoned, but the shipped appearance is a fallback
nobody has looked at: no frame shows a focus ring in either theme, and the fallback's own
contrast is unmeasured.

### 2.8 THE HARD PART IS NOT STARTED

The return says it: the 22 e2e re-aims are unwritten and the default suite was never run. Six
spec files name addresses this diff deletes — `e2e/access.spec.ts`, `e2e/board-covisibility.spec.ts`,
`e2e/font-census.spec.ts`, `e2e/mobile-affordances.spec.ts`, `e2e/viewport-law.spec.ts`,
`e2e/zone-grammar.spec.ts`. That is the elegant-reduction trap by the checklist's own name.

### 2.9 THE RULER LAW HAS NO CI WITNESS

G23 holds the declarations; the ruler is a width, and CI is sixteen browserless lanes (O-12), so
the one number that keeps three goldens green — "nothing in the card out-measures the legend
fold" — is enforced by a local probe and by a golden minted off a local dist. The next child
with a wider `max-content` moves the card, reds the goldens on someone's laptop, and CI says
nothing. The family's own argument for writing `check-cost-face.mjs` applies to this row and was
not extended to it.

### 2.10 SMALLER, EACH CLOSABLE

- **The resting verb word is 4.382 on its own hover ground** (light, both engines; their `r3`
  reads the same). It is inherited — HEAD's `.icon-btn:hover` paints `--color-accent` under a
  `--color-muted-foreground` sublabel at 16px/400 — but this is the family that measured the
  fence, and the word one rank below the asked word sits under 4.5 with no row naming it.
- **π's node counts differ between trees** (chromium /futoshiki 564 vs 586; webkit /kenken 636 vs
  710) and the diff compares the intersection of ancestry paths. The uncompared nodes are not
  listed, so "0 structural boxes moved" is a statement about the boxes that matched.
- **The two faces in one band are visibly different heights** — the cited crops show `deal` at
  123.97 against a shorter `clear`. No row claims it either way; it reads as unintended.
- **Only chromium crops**; the webkit pair is unshot (theirs).
- **Dark and 900×500 press-count cells** not run (theirs).
- **The bottom edge collides with CTRL-TAPE and the return does not name it**: COST deletes the
  bar and re-homes the foot fade to `.controls-card::after` spending `--card-pad-b`; TAPE lands
  `.card-foot` + `--card-foot-h` + `--safe-b`. `--motion-whisper` and the `@property` block are
  named as uncoordinated seats; these two are not.
- **W2 §2.2's reachability probe is not run** (chair §6.2 binds every §10 lane at 844×390), and
  812×375 — the other width the chair names for a deleted tab regime — was never opened.

---

## 3 · CHECKLIST HITS

- **unverified gestalt** — the 390 armed crop shows a note the 390 surface cannot summon (§2.2);
  no frame of a focus ring in either theme (§2.7); webkit unshot.
- **the pixel it moves that it did not declare (π)** — 2.2px of masthead and board on the phone,
  both engines (§2.1).
- **the constraint it forgot** — chair §6.5 on `--fold-tools-h` (§2.6); T7-W2 A2's disposition
  (§2.3); owner mark T9-M04's subject (§2.4); W2 §2.2's probe (§2.10).
- **the elegant-reduction trap** — the e2e estate (§2.8).
- **gates that cannot fail** — not hit outright: `check-cost-face --self-test` is genuinely
  falsifiable and the occlusion exemption is sound; but the occlusion headline reports the
  exempted cells as clear (§2.5), and the ruler has no CI gate at all (§2.9).
- **masked fallback** — `var(--ring-ink, currentColor)` ships a ring from a token nothing mints
  (§2.7).
- NOT hit: vacuous convergence · spec-cites-itself (the spec's own numbers were corrected
  against interest three times) · legacy aliases (`.act-face` unifies the gallery's face and the
  card's — one idiom, two surfaces) · consumer-less substrate (`--motion-whisper` has eight
  consumers, `confirmWindowMs` two; `MOTION.inkLiftMs` dies at zero) · the generic default (the
  estate's own faces, lowercase names, drawn boxes, no eyebrows or arrows).

---

## 4 · STRENGTHS

1. **The blocking row is cured and it reproduces under a probe that did not come from this
   family.** Press it twice on WebKit and the board changes, with 0 focusouts on the face and 0
   scroll under the thumb, in three cells.
2. **The ruler law is the pass's best piece of engineering.** Two over-width boxes named and
   cured structurally (a one-column grid of rungs; `contain: inline-size`), and the card then
   measures identical to the control per engine — no golden re-mint, which is what chair §6.4
   asked for, verified against a HEAD server this lane started itself.
3. **The derived pin band kills a sampled publisher and an observer term**, and four heads come
   out at one height on both engines.
4. **`no` is a real control** — own name, own description, 44 in both dimensions with the firing
   control, a 2px ring at −2 while focus-visible, and the arm still moves nothing ([0,0,0,0]).
5. **The node witness is an honest gate**: seven checks, seven plants, each RED only on its own.
6. **Three defects found by measuring rather than asserting**, including one — the registration's
   inheritance flag — that is a trap for the whole wave.

---

## 5 · CONVERGENCE — 72%, EARNED

Running prototype on the real surface, both engines, with the two pass-2 blocking rows cured and
independently reproduced: that is most of the way. Against it: one measured π regression on the
phone, an owner mark's subject deleted without a ballot, a P0-era a11y mechanism swapped without
a disposition, a wave-wide ruling broken in the same diff that obeys it twice, the family's own
consequence copy unreachable on the surface the ask was designed for, and the largest remaining
piece of work not begun. 100 requires zero open gaps; there are sixteen, four of them
constraint-class.

**VERDICT: ADVANCE.** No missing primitive — every gap above is a closable row inside this
design, and the merge watch's answer (one pin-band mechanism, one `useTwoTap`/`askingAct`
machinery with two policies) holds up on the readings. The graft list is worth grafting; the
centre folds; the two policy rows (pointer-agnostic ask, `no` as a real control) should ride to
W1 §1.5 / U-10 intact.

---

## 6 · CROSS-POLLINATION

1. **`@property … inherits: false` is a second silent-zero vector.** A registration decides not
   only what an absent publisher yields but who can see a present one. §10's single registration
   block should carry `inherits: true` with this reason, and every lane consuming a measured
   token on a descendant should re-read its own pin.
2. **The ruler law** — "nothing in the card out-measures the legend fold", with the two cures
   (`grid` rungs instead of a wrapped flex row, whose max-content is still the sum; `contain:
   inline-size` on a row priced by an uncontained sibling) — closes the width question for every
   §10 lane without a re-mint.
3. **A POINTER ARM MOVES NO FOCUS; a keyboard arm focuses the safe answer with
   `preventScroll`.** This input split is the general cure for every two-tap confirm in the
   estate, and the null-`relatedTarget` belt is the general reading of WebKit's pre-click blur.
4. **`scripts/check-cost-face.mjs`'s shape** — a browserless node gate that asserts the
   DECLARATION a local geometry follows from, self-tested by planting one defect per check — is
   the pattern for every O-12 lane whose real instrument cannot run in CI.
5. **The berth-in-the-head**: a sticky head is the same "content can never enter it" property the
   foot berth was paying 3.5rem for, beside the verb rather than five rows below it.
6. **A frame taken with a mouse in a `hasTouch` context is not a phone frame.** Worth a line in
   the wave's frame discipline: crops of a hover-summoned surface must say which pointer took
   them.
