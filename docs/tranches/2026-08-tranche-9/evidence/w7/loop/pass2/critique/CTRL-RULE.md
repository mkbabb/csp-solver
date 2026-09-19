# T9-W7 · pass 2 · CRITIQUE · CTRL-RULE — the ruled page, arm (b)

Adversarial critic. Did not write the spec or the prototype. Read the diff in
`.claude/worktrees/wf_8630d340-e56-29`, looked at all four frames, and re-ran five measurements
on my own server (`127.0.0.1:4234`, private `cacheDir`, killed on return, both engines).
Everything I banked is under `pass2/critique/CTRL-RULE/` — `instruments/pin-census.mjs`,
`instruments/pi-900-and-fold.mjs`, `instruments/orphan-field.mjs`, `readings/*.json`. No crops.
Nothing written under `loop/r0/` or `loop/pass1/`.

**CONVERGENCE: 64%. VERDICT: ADVANCE.**

The prototype runs, on the real surface, in both engines, and its record is the most honest in
the pass — twelve gaps named before I asked. But its HEADLINE gate does not measure what it
says, its central structural claim is false as built, and one of its own deltas contradicts the
sentence it was made in. None of that is a rewording or a constraint violation, and the family
has a live route. It advances with the fork named and the rows below closed.

---

## 1 · What I re-measured, and what it says

### 1.1 THE PORT STILL PINS, AND THE PREDICATE CANNOT SEE IT (the pass's first row)

The spec says: *"Nothing pins… the class invariant is satisfied by having no sticky surface in
the port"* (§0 principle 2), and *"2.4.11 is answered structurally: no sticky or fixed surface
remains inside the port"* (§2.6). The prototype banks `pins 0 · violations 0` at 5 states × 7
cells × 2 engines and labels the predicate VACUOUS *because nothing pins*.

The predicate is `card.querySelectorAll("*")` filtered on `getComputedStyle(el).position`
(`prototype/CTRL-RULE/instruments/census.mjs:150`). **A pseudo-element is not in that set.**
`scene.css:355` ships `.controls-card::before { position: sticky; top: calc(-1 * --card-pad-t);
z-index: 30; background: linear-gradient(to bottom, var(--color-card) …) }`, opacity 0 → **1**
under `[data-fold-above]`. It is a sticky surface **with a ground**, inside the scrollport, and
no DOM query can return it. `pins 0` is a property of the instrument.

Measured (`readings/pin-census-proto.json`, `readings/pi-900-and-fold.json`), light, both
engines, after the sheet settled:

| cell / state | the band | worst control inside it |
|---|---|---|
| 390×844 dock, scrollTop 200 | top 225.64, h 38, opacity 1 | `Deal` **0.271** (chromium) / **0.258** (webkit) |
| 1280×800 desk, scrollTop 200 | top 140.94, h 52, opacity 1 | `Medium` **1.000** (chromium) / **0.944** (webkit) |
| 1280×800 desk, scrollTop max | same | `Normal` **1.000** / **1.000** |

That is the family's own arithmetic (coverage of a control by a pinned box) aimed at the surface
it forgot, and at the desk it returns the same shape of number the family banked as HEAD's
defect (`Ask` 100% at desk 350).

And it is **paint, not only geometry**. The band resolves to
`linear-gradient(rgb(253,253,252) 20px, rgba(0,0,0,0))` over `bandH 52` with `--card-pad-t: 20px`
— i.e. **solid card for the first 20px**, then a fade over 32. Screenshotting the `Medium` chip's
own rect with the band armed and again with `.controls-card::before { opacity: 0 }` forced:
**meanAbsDelta 9.34 (chromium) / 12.91 (webkit), maxAbsDelta 132** over 7,752 pixels. The chip's
glyphs are being washed by a card-coloured ground.

This does not by itself red 2.4.11 (a partial fade is not "entirely hidden"), and the sentinel is
W2's own landed mechanic which the family correctly KEPT. What is wrong is the claim and the
gate: arm (b)'s whole case against arm (a) is *nothing in the port pins*, and something in the
port pins. **Closable**: extend the predicate to `getComputedStyle(el, "::before"|"::after")`,
re-run at HEAD (it will read the same band, so the row is a CONTROL, not a new defect), and
re-word the spec's §0.2/§2.6 from "no sticky surface" to the true claim — "no sticky surface the
card AUTHORS; W2's fold sentinel stands and is measured at X".

### 1.2 A THIRD OCCLUDER, ALSO OUTSIDE THE FILTER — the confirm ribbon

`ConfirmRibbon.vue:113-127`: `position: absolute; bottom: 100%; z-index: 70; background:
var(--color-card); width: max-content; max-width: min(20rem, 92%)`. The predicate filters
`sticky|fixed`, so an **absolute opaque box over live controls** is invisible to it too. The
prototype's gap 8 names the float and calls it transient; **frame 3 shows worse than a float** —
the ribbon is narrow and centred on the armed verb, so the `checking` row survives on both
flanks and the crop reads as one line: `keep  [clear]  ff   Ask   Live`. The confirm's answers
and a live chip row share a visual baseline. That is a legibility defect the "three channels"
argument does not reach.

**Closable**: measure the ribbon's ∩ with every control at the armed state and either take the
foot's full width or ink a separation that is not the deleted 8% ground.

### 1.3 THE "ONE FACE" CLAIM IS CONTRADICTED INSIDE ITS OWN DIFF

`GameGallery.vue` diff comment: *"the 8% ground dies here AND in the card's ribbon, ONE COMMIT,
because the two ribbons are ONE FACE and a house that asks the same question twice must ask it in
one voice."* In the same pass:

- the card's `keep` was made **bare** (deltas, §6) while the gallery's `keep` stays
  **HandDrawnOutline**. Two faces, one commit.
- `ConfirmRibbon.vue:180` — *"THE FLOOR IN BOTH DIMENSIONS — the gallery's `min-height` alone
  measured `keep` 39 × 44"* — adds `min-inline-size` **to the card only**.
  `GameGallery.vue:1475-1476` still reads `.guard-face { min-height: 44px }` and nothing else.

So the family's own born-RED gate ("the ribbon's verbs ≥ 44 in BOTH dimensions; the gallery's
`keep` 39×44 today") is proven on the card's instance and **left red on the instance the gate
cites**. The 44×44 row is banked as met; on the estate's other ribbon it is not met, and the
diff that names the defect walks past it. **Closable in one line** (`min-inline-size` on
`.guard-face`) plus a measured row for the gallery ribbon.

### 1.4 THE RULE'S 3:1 IS PHASE-DEPENDENT AND SAMPLED AT TWO PHASES

The family's own evidence proves the fragility and then does not bound it. Same generator, same
ink, same component, 390×844 chromium (`readings/bar-stroke-sweep.txt`, `bar-seed-sweep.txt`):

| where | y | stroke 2 | stroke 3 |
|---|---|---|---|
| a card rule | 302.83 | **3.530** | — |
| the foot's rule | 766.03 | **2.413** | **3.330** |

Fifteen seeds at the foot all land 2.41–2.59, so it is the sub-pixel phase, not the hand. The
shipped answer is a stroke rung for the foot (3.330 — **0.330** over the floor). But the card's
seven rules were read for ink at **two cells only** (390×844, 1280×800) while the R1 census runs
**seven** (900×500, 320×568, 844×390, 375×812, 430×932 unread for ink), and `y` — the quantity
that set 2.413 vs 3.530 — moves with every one of them. Dark was never read at all. The gate as
landed does not bound the property the sweep just demonstrated is unstable.

**Closable**: run `rule-ink.mjs` at all seven cells and in dark; if any lands under 3.0, the
finding is the one the spec already anticipated (the 55% ramp cannot draw this line) and it goes
to the chair.

### 1.5 A COMPONENT'S JUSTIFYING NUMBERS DO NOT MATCH ITS EVIDENCE FILE

`RuledLine.vue`'s shipped comment: *"1.8 — chromium **2.366** at 390 / **2.909** at 1280, webkit
3.021."* `readings/rule-ink-shipped.txt`, the same lane, the same session:
`390x844/chromium/1.8 | WORST **2.946**` and `1280x800/chromium/1.8 | WORST **2.946**`. The
README (§3) quotes a third pair ("2.946–2.983"). Two of the three disagree with the bank. The
conclusion (1.8 fails chromium, 2.0 ships) is unaffected; the file that will outlive this pass
carries numbers the bank does not support. **Closable**: re-derive at citation.

### 1.6 THE ROW W2's PIN EXISTED FOR IS NOT MEASURED — I MEASURED IT

The family retires W2 §2.6's sticky section tag and answers *what am I looking at?* with the
margin. The margin answers it **only while the name is on screen**. Frame 2's caption reads
"each name beside its own field"; frame 2 itself shows `Medium` and `Hard` under the eye with
`level` gone off the top. Nobody gated it.

`instruments/orphan-field.mjs` — an ORPHANED FIELD is a group with ≥33% of its field readable in
the port and **no** part of its name on screen. Swept at ~12 scroll states per cell, both
engines (`readings/orphan-field.json`):

| cell | orphan states | which |
|---|---|---|
| 390×844 dock | **0 / 9** (chromium) · **0 / 9** (webkit) | — |
| 1280×800 desk | **4 / 14** · **4 / 13** | `Size` at scrollTop 70–105, `Level` at 210–245 |

The phone is clean — the margin genuinely works where the groups are short. **At the rail ~29%
of scroll states orphan a field in both engines.** That is the harm the pin prevented, quantified
for the first time in this family, and it belongs beside gap 1 when the chair rules the fork. It
is also the honest form of the U-10 question: the rail is where the form tell is thinnest AND
where the margin stops answering.

### 1.7 TWO BRIEF CENSUSES ARE NEITHER RUN NOR REPORTED AS GAPS

The prototype brief names *"R6 `law-probe` COPY (L1 = 9, L5 + R3 re-aimed); hue census COPY (29
rows)"*. `readings/` holds neither, and the README's twelve gaps do not mention them. The two
that matter here:

- **L5** — *"one box grammar: a drawn frame is HandDrawnOutline… read: guard verbs wear
  HandDrawnOutline: true"*. Arm (b) makes `keep` bare, so the law's READ changes and the row is
  a MOVED row the family owes, not a silence. (Bare is not a CSS border, so I read the law as
  intact — but the probe, not a critic, is what says so.)
- **R3** — *"the mobile floating controls bar wears a drawn edge in the house hand"*, RED at
  HEAD. The foot's drawn top rule plausibly flips it GREEN. That is a **win the family did not
  bank** because it did not run the probe.

`L1` (filter exactly 9) is unread by the lane's own admission (gap 10) and stays open.

### 1.8 What I checked and found SOUND

- **AA on both themes, re-derived from the resolved tokens** (`pin-census-proto.json`), not
  taken on trust. Composited over the card: `--ring-ink` **3.701** light / **4.678** dark (the
  lane derived 3.72 / 4.66 — agrees to ±0.02); `--color-muted-foreground` **4.659** light /
  **7.681** dark (the seven names are 25.888px/800 → large text, 3:1; the 20px chips at rest need
  4.5 and get 4.659 — thin, but met); `--color-red-ink` **4.990** / **6.303**, matching registry
  §6.4; `--color-foreground` 19.451. `--ink-press-rule` composited 3.543 light / 4.356 dark.
  Nothing in the palette is asserted where it could be computed. A byte-level read of the painted
  ring band remains unbanked (the lane says so).
- **M16** — `check-copy-register` exit 0 bare, with the `candidates` ADMITTED row struck together
  with the string that earned it. `check-font-coverage`, `check-theme-selectors`,
  `check-ink-pressure`, `check-motion-contract`, `check-live-regions` all exit 0 bare, re-run by
  me in the prototype worktree.
- **Pi on the gallery — I tried to break it and could not.** The diff's `typography.css` arm
  (`--type-option` 22 → 20) is live at **768–1023.98 only**, and the lane's pi census ran at 390
  and 1280 — both outside the band it moved. `--type-option` is read by `OptionSelector.vue:106`,
  which `StagingBand.vue` and `GameCard.vue` also mount. So I read the gallery inside the band:
  at 900×500 and 844×390 and 1280×800, both engines, the gallery chip is **16px / padding-inline
  10.4px / width 49.59 — identical at all three** (`readings/pi-900-and-fold.json`), because
  `StagingBand.vue:292` overrides `.ctrl-btn { font-size: 1rem }`. Pi holds, including at the
  cell the lane never visited. The gap should still be closed by running the census there.
- **The lane's gap 6 is a stale record, not a defect.** `.staging-axis-label` reads
  **16px at both 390 and 1280 in both engines**, box-left 17.59 / 384.00, padding 0 / 12,
  `.section-heading` 16 / left — my readings match the lane's exactly. `StagingBand.vue` is
  untouched by the diff and the label's rung (`--type-group-title` / `.section-heading`) is
  restored byte-for-byte, so nothing in the diff is on that path. The brief's "14/16" is the
  figure that is wrong. **Δ 0.00 is claimable once the brief's row is corrected.**
- **The ring-scope finding is real and load-bearing.** A `:focus-visible` rule written in the
  panel's scoped block compiles to `…[data-v-<panel>]` and can never match an `OptionSelector`
  chip; moving it to `scene.css` is what takes the census from 14 unringed to 21/21. That is the
  kind of defect only a build-and-measure lane finds.
- **The height ledger is the first arm of this family to pay for itself**: 683/540 at 390×844
  against HEAD's 699/628 and arm (a)'s 999; 952/531 at 1280 against 1142/608.
- **`RP_SEEDS` is a sweep result, and the σ band is met** with worst headroom 0.160.
- **The probe defect the lane found and cured** (typing into the first `:not([readonly])` cell
  reads `present: false` on some deals; it nearly banked "WebKit cannot be put in a coarse
  context") is exactly the control-group discipline the campaign's lessons ask for.

---

## 2 · Failure-mode checklist

| item | hit? |
|---|---|
| vacuous convergence | **HIT** — "occlusion 0 at every state" is vacuous for the wrong reason (§1.1) |
| spec-cites-itself | clear |
| gates that cannot fail | **HIT** — the occlusion predicate cannot return a pseudo-element or an absolute box (§1.1, §1.2); the width half of the tap-floor control is vacuous (the lane labels it, credit) |
| the elegant-reduction trap | **HIT, partial** — "nothing pins" reduces the invariant away and leaves the orphaned field at the rail unhandled and unmeasured (§1.6) |
| legacy aliases | clear — `.head-pin`, `--rp-head-h`, `--action-bar-h`, `[data-under-bar]`, the tabs and the wells are deleted, not renamed |
| masked fallbacks | **HIT, declared** — `--card-foot-h, 0px` kept and `--sheet-chrome` written as a constant; both are argued in the open per chair §7, and both leave spec §2.9 unmet |
| unverified gestalt | **HIT** — frame 2's caption ("each name beside its own field") is contradicted by frame 2 (§1.6); frame 3's ribbon is not the clean "in the foot's row" the README describes (§1.2) |
| consumer-less substrate | near-miss — `.washi-tag`'s sticky block survives with no consumer in the card; `StagingBand`/`GameCard` still mount `anchor="tag"`, so it is not dead |
| the generic default | clear — no cream+serif+terracotta, no all-caps eyebrows, no → on links; the margin + hand-ruled line is a real subject |
| the pixel it moves that it did not declare (pi) | **CLEAR, verified** — including at 900×500 and 844×390, the band the diff actually moved (§1.8) |
| the constraint it forgot | **HIT** — R6's law-probe copy and the hue census were briefed, not run, not declared (§1.7); the rule's ink is unread at five of seven census cells and in dark (§1.4) |

---

## 3 · The exact open gaps

1. `.controls-card::before` is a sticky `--color-card` ground inside the scrollport and the
   occlusion predicate cannot enumerate a pseudo-element, so `pins 0` is the instrument's number,
   not the page's: extend the predicate to `::before`/`::after`, re-run at HEAD as a control, and
   re-word §0.2/§2.6 to the claim the page can carry.
2. At 1280×800 with the fold armed, a chip lies 1.000 (chromium) / 0.944 (webkit) inside that
   band at scrollTop 200 and its pixels move mean 9.34 / 12.91 (max 132) when the band is
   disarmed — bound that obscuration or state it as the decided W2 cue it is.
3. `ConfirmRibbon` is `position: absolute; z-index: 70; background: var(--color-card)` and is
   outside the predicate's `sticky|fixed` filter: measure its ∩ with every control while armed.
4. Frame 3 shows the armed ribbon interleaved with the `checking` row (`keep [clear] ff Ask
   Live` on one visual line) — give the confirm the foot's full width or a separation that is not
   the deleted 8% ground.
5. The gallery's `.guard-face` still carries `min-height: 44px` alone, so `keep` stays 39×44 —
   the exact number the family's own born-RED gate cites — while the card's instance is cured:
   land `min-inline-size` on both in one commit and measure the gallery ribbon.
6. The card's `keep` is bare and the gallery's `keep` is `HandDrawnOutline`, inside a diff whose
   comment says the two ribbons are one face: make them one face or strike the sentence.
7. The rule's painted worst column is read at two of the R1 census's seven cells and never in
   dark, while the foot's own sweep proves the reading is sub-pixel-phase dependent (2.413 at
   y 766 against 3.530 at y 302): run `rule-ink.mjs` at all seven cells and both themes.
8. `RuledLine.vue`'s shipped comment cites 1.8 chromium at 2.366 / 2.909 where
   `rule-ink-shipped.txt` reads 2.946 / 2.946 — re-derive the numbers at their citation.
9. The R6 law-probe COPY (L1 = 9, L5's changed read now that `keep` is bare, R3 which the foot's
   drawn rule may flip GREEN) and the 29-row hue census COPY were briefed and are neither banked
   nor declared — run both and report L5 and R3 as MOVED rows.
10. At the 1280 rail, 4 of 14 (chromium) / 4 of 13 (webkit) sampled scroll states leave a field
    ≥33% readable with its name entirely off screen (`Size` 70–105, `Level` 210–245): the harm
    W2 §2.6's pin prevented has no gate in this family — mint one, born-RED, and put the number
    in front of the chair with the fork.
11. Arm (b) retires W2 §2.6's sticky section tag (`viewport-law.spec.ts:575` and `:610` RED) and
    the charter says W2's landed mechanics are designed ON — the chair/owner rules the fork; the
    lane cannot.
12. The 844×390 seam reads −120.87 / −121.30 against a ≥8px gate that the family listed as its
    own: it is HEAD's `--sheet-chrome: 4rem` landscape arm and needs a W2 layout ruling.
13. `--sheet-chrome` is shipped as the constant 12.6rem rather than consumed from W2 §2.5's
    publisher (spec §2.9 unmet, honestly declared) and `--card-foot-h, 0px` keeps the fallback
    the spec said would die.
14. `filterBudget` 9 and goldens 4/4 are unread — no `vite build` ran in this lane.
15. The six e2e specs ran chromium-only: 22 failed / 19 passed of 41, every failure addressing
    deleted grammar; the webkit half is unrun and the 22 are re-aim work nobody has costed.
16. `confirmWindowMs` (2500) is newly wired with no measured row for the lapse path.
17. The ring's painted ratio is derived, not read from bytes; my independent composite agrees
    (3.701 / 4.678) but a screenshot read of the outline band is still unbanked, and the dock's
    ring stays an authored declaration.
18. `.rp-name`'s 320-cell rung is set by a `:deep()` from the panel into `RuledGroup`'s own
    class — move both into `RuledGroup`.
19. I4 (fill/solve write 0 on first tap) stays RED pending W1 §1.5 — correctly reported, never
    claimed; it is not this family's to close.

---

## 4 · Strengths worth keeping whatever the chair rules

- A running prototype on the real surface in both engines, with a kill-verified server and a
  diff that stands for the agglomerator.
- The most honest record in the pass: twelve gaps named unprompted, two DECLARED DEVIATIONS
  argued in the return rather than buried in the diff, and a "reported, not claimed" discipline
  applied to the 320 cell, R7 I3, I4 and the gallery's fifth reading.
- The height ledger is a real win: 683 against HEAD's 699 and arm (a)'s 999.
- The scoped-`:focus-visible` finding (a ring written in a scoped block cannot match a child
  component's chip) is a general defect class this estate will meet again.
- The stroke and the seeds are sweep results with the sweeps banked; the token was NOT re-pitched
  for one consumer.
- The probe-defect cure (a random deal made the arm's predicate false; WebKit was nearly libelled)
  is the control group working.
- One voice, one rung, one ink across seven names, 3 → 1 and 2/6 → 7/7 at every cell.

## 5 · Cross-pollination

- **The pseudo-element blind spot** belongs to every §10 lane's occlusion predicate and to
  W3's 2.4.11 work: `querySelectorAll` + `position` misses `::before`/`::after`, and this estate
  paints two of its scroll cues that way.
- **The scoped-`:focus-visible` trap** (`…:focus-visible[data-v-x]` can never match a child
  component's control) goes to every family consuming `--ring-ink` under chair §6.1.
- **The sub-pixel phase finding** — a 2px stroke at an unlucky `y` reads 2.4:1 where the same
  stroke reads 3.5:1 elsewhere — goes to every family drawing thin lines (MOT-LADDER, CTRL-TAPE,
  the marks families' rims).
- **The ORPHANED FIELD instrument** (`orphan-field.mjs`) is the honest measure of what a pinned
  name buys and should be run against CTRL-TAPE and against HEAD, whichever arm wins.
- **The per-dimension tap-floor control with its vacuous half labelled** is the shape every floor
  gate in the wave should take.
- **`min-inline-size` + `min-height` as one pairing** is the estate-wide cure for the 39×44 class,
  and the gallery is still carrying it.

---

## 6 · Addendum — the critic's own reproduction (second sitting, port 4235)

The session that wrote §§1–5 was walled. This sitting re-opened the file, re-derived every
load-bearing claim from the tree rather than from the prose above, and **re-ran the headline
census on a second server of its own** (`127.0.0.1:4235`, private `cacheDir`
`.vite-cache-crit2`, `vite.repro.config.mjs` banked beside this file, killed on return).

### 6.1 The pin census reproduces to the digit, both engines, all four cells

`readings/pin-census-repro.json` against `readings/pin-census-proto.json` — independent server,
independent browser launches, same instrument:

| cell / state | PROTO (4234) | REPRO (4235) |
|---|---|---|
| chromium 390×844, fold_200 | `Deal` **0.271**, band h 38 | `Deal` **0.271**, band h 38 |
| webkit 390×844, fold_200 | `Deal` **0.258**, band h 38 | `Deal` **0.258**, band h 38 |
| chromium 1280×800, fold_200 | `Medium` **1.000**, band h 52 | `Medium` **1.000**, band h 52 |
| webkit 1280×800, fold_200 | `Medium` **0.944**, band h 52 | `Medium` **0.944**, band h 52 |
| both engines 1280×800, fold_max | `Normal` **1.000** | `Normal` **1.000** |

Gap 1 and gap 2 are not a one-session artefact.

### 6.2 The blind spot is confirmed at the source, and BOUNDED

`prototype/CTRL-RULE/instruments/census.mjs:150` is `card.querySelectorAll("*")` filtered on
`getComputedStyle(el).position` — no second argument, so no pseudo-element can enter the set
(`:290`'s filter is the same shape). `scene.css:358` is the only `position: sticky` left in the
file and it is the `::before`; `:537`'s `position: fixed` is the sheet itself, the card's
ancestor, **outside** the scrollport. So the correction to §0.2/§2.6 is exactly one surface, and
gap 1 is closable in the narrow form: the card authors no sticky ELEMENT, and W2's fold sentinel
— a pseudo-element the family correctly kept — pins.

### 6.3 AA re-derived arithmetically, not re-read

`--ring-ink` light: `hsl(0 0% 3.9%)` → rgb(10,10,10) at 50% over card rgb(253,253,252) composites
to rgb(131.5,131.5,131); against the card that is **3.701:1** by the WCAG formula computed here
from first principles. The lane derived 3.72, §1.8 read 3.701, this sitting computes 3.701. Dark
tokens read `--color-foreground` rgb(237,236,233) on card rgb(19,18,17), `--color-red-ink`
`#ff5c7c`, `--ink-press-rule` 55% of hsl(48 10% 80%) — the values §1.8's ratios were taken on.

### 6.4 The two gate scripts are honest, and their new extractors are LIVE

Chair §7 forbids re-wording a gate to pass, so both modified scripts were read whole.
`check-copy-register.mjs` strikes the `candidates` ADMITTED row **together with the string that
earned it** (the caption is now the group name `what fits`), and the file's own rule — an
ADMITTED row whose string no longer trips the lexicon FAILS — means the strike was compulsory,
not convenient. `check-font-coverage.mjs` replaces `zoneRowLabels` with `ruledGroupNames` and
adds `confirmLines`, and **adds** strings without narrowing the cut.

Dry-run here against the panel: `ruledGroupNames` → **5** (`new game`, `marks`, `what fits`,
`checking`, `players`; `Size`/`Level` arrive via `specHeadings`), `confirmLines` → **2**
(`start a new board?`/`deal`, `clear the board?`/`clear`). Both derive halves match real call
sites. This closes what would otherwise have been a gap.

### 6.5 The frames were looked at, and two captions are contradicted by their own pixels

Frame 2 (`2-rail-1280-light.png`), captioned *"nothing pinned, each name beside its own field"*:
`Hard` sits under the eye with `level` gone off the top (gap 10, visible), and `Medium` above it
is **visibly washed pale** by the sticky card-coloured band (gap 1/2, visible). One crop carries
both defects the census found.

Frame 3 (`3-ribbon-390.png`), captioned *"the confirm in the foot's row"*: the crop reads
`keep  [clear]   ff   Ask   Live` on one visual line — the confirm's two answers and the live
`checking` row share a baseline, exactly as §1.2 argued from the CSS.

### 6.6 One gap this sitting adds

**Gap 20.** `check-font-coverage`'s faces union a `derive` with a literal `strings` list, so
`exit 0` cannot distinguish a live extractor from one that matches nothing — the precise blind
read the file's own §3 comment exists to refuse. `confirmLines`' regex requires `line:` before
`verb:`, both double-quoted literals; a later caller that swaps the keys or interpolates a
string contributes silently nothing while the gate stays green on the literals. Closable in one
line: assert a non-zero (or expected) match count per extractor.

**The verdict is unchanged: ADVANCE at 63%** — §§1–5's nineteen gaps stand, all of them
reproduced or re-derived here, plus gap 20.
