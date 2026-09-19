# ACC-GRAPHITE — pass-3 CRITIQUE (adversarial, non-author)

Critic: Opus 5, 2026-09-18. Base `74a2b5d9`. I did not write the spec or the prototype.
Read in order: `../CHAIR-RULINGS.md`, `../synthesize/ACC-GRAPHITE.md`, `../prototype/ACC-GRAPHITE/README.md`,
the worktree's `git diff` (18 files, +879/−194, plus `lawA.test.ts` untracked), the four banked frames.

Re-run by me, on my own server (`:4243`, prototype worktree, private `cacheDir`, killed and refused
at the end; scratch vite/playwright configs and `crit-scratch/` removed, `git status` byte-identical
to the prototype's): four painted scans × 2 engines × 2 rigs, a clearance scan × 2 engines × 2 rigs,
a one-row painted-ratio scan × 2 engines × 2 rigs, the frame's declared widths off the DOM, five
gate scripts bare. Readings under `critique/ACC-GRAPHITE/readings/`, one frame under `frames-crit/`.
Total 68 KB.

**Convergence: 62%. Verdict: ADVANCE.**

---

## 1 · What I reproduced, and it holds

| claim | prototype | my reading |
|---|---|---|
| ghost `<svg>` scale | 0.48916 / 0.28071 px per u | **0.48927 / 0.28071**, both engines, identical |
| outer + inner stroke | 12 u + 12 u, inset 10 | **12 px + 12 px** declared, `.cell-ghost-retrace` `display: block` at focus, `none` unfocused |
| the fill | `none` | **`none`**, 8 arms |
| own-space band | 10.761 / 6.176 px | **10.764 / 6.176 px** |
| the frame's declaration | 12 board u × 0.636 | **`grid-line frame-line` `stroke-width: 12px`, viewBox 1000, box 636 → 7.632 px**, read off the DOM |
| LAW A, ratio form | 3 → 3, 20 → 20 | **three different deals, four arms**: valuenow 30 % → **17** subpaths (writable 56), 28 % → **16**, 26 % → **12** (writable 46). `k = round(written·slots/writable)` reproduces on every one |
| the tally's declaration | no dash, no `pathLength`, pose 0.968 | **`stroke-dasharray: none`, `pathLength: null`, `matrix(0.968,0,0,0.968,0,0)`, `linecap: butt`, `stroke rgb(38,38,38)`** |
| gates bare | ink 0, copy 0, theme 0, motion 0 | **all 0**; the grounds block prints with the tie cited; copy-register **0 unadmitted** (M16 clean) |

**AA, computed here, not taken from the file.** Light: graphite `#262626` on card `hsl(48 12% 99%)`
= `#fdfdfc` → **14.83:1** (spec 14.87). Dark: `#d1cfc7` on `hsl(24 6% 7%)` → **12.03:1** (spec 11.99).
Graphite digit over the 6 % wash: **13.25:1** light, **10.80:1** dark. No mark this family paints is
near a floor in either theme. `filterBudget` is a deletion, not a growth. W2's landed mechanics are
untouched — no `scene.css`, dock, tab or sticky-tag file is in the diff.

**Closed a gate the prototype left open — G3's clearance.** Vertical scan of every column of the
board's top edge, 20 written, light, both engines:

| | columns | tick columns | gap median | gap min | negative |
|---|---|---|---|---|---|
| desk chromium | 636 | 431 | **+4.00 px** | +2.00 | **0** |
| desk webkit | 636 | 432 | **+4.00 px** | +3.00 | **0** |
| phone chromium | 365 | 426 | **+2.33 px** | +0.33 | **0** |

Above the gate's floors (≥ +1.5 desk / ≥ +1.0 phone) and above the spec's own prediction (+2.1 / +1.3).
11–15 columns per rig read as one ink run ≥ 11 px (tick and rule not separated by the scan) — named,
not a red. **G3's clearance clause: GREEN, measured here.**

---

## 2 · The central number does not survive the instrument its own gate names

G2: *"painted band / painted frame ∈ [1.35, 1.45] at both rigs"*. The spec predicts **≈ 1.37 ± 0.03**
painted. The prototype reports **1.410** — which is `(22 × 0.48927) / (12 × 0.636)`, declared width
over declared width across two coordinate spaces. That is arithmetic. It is not a painted ratio, and
the prototype says so in its gaps ("the PAINTED band run was not measured").

I measured both terms **on one screenshot row, one luminance threshold, one pass**
(`readings/painted-ratio-onerow.json`), through the focused cell's centre, from outside the left
frame to outside the right:

| | painted frame | painted band | **ratio** |
|---|---|---|---|
| desk chromium | 7.00 px | 11.00 px | **1.571** |
| desk webkit | 7.00 px | 11.00 px | **1.571** |
| phone chromium | 4.00 px | 6.00 px | **1.500** |
| phone webkit | 4.00 px | 6.33 px | **1.583** |

The two absolute-floor clauses hold (10–11 ≥ 10.0 desk; 6.0–6.33 ≥ 5.7 phone). The ratio clause does
not, at either rig, in either engine, by 0.05–0.13. The gap is the frame's `stroke-opacity: 0.95`
and the band's round-linejoin skirt at `opacity: 1` — real, systematic, and exactly the term the spec
waved at ("painted, with HEAD's own measured skirt"). **G2's ratio clause: RED, measured here.**

This does not refute the design; it refutes the number the design is stated in. The family has to
either re-derive the window painted-over-painted and declare it, or thin the band. It cannot do both
things it currently does — quote a painted window and satisfy it with declared arithmetic.

---

## 3 · The gestalt the frames actually show

**The band paints as ONE run.** Every one of my eight row scans returns a single contiguous ink run
for the band (10–11 px desk, 6 px phone) with no interior paper: the two 12 u passes overlap by 2 u
by construction, so there is no seam to see. The sentence the family is built on — *a pencil pressed
twice, one heavy band whose inner and outer edges wander independently* — is legible in `gridPaths.ts`
and invisible in the pixels. G2b (edge correlation 0.269 vs 1.000) is a number about the generators
and was **not run**. A reader cannot tell this band from a single 22-unit stroke, and no instrument in
the pass says otherwise.

**The chip came back solid.** `frames/crop3-phone-light-focus-{chromium,webkit}.png`, both engines,
reads as a heavy black rounded square with a window knocked out of it. My numbers say why: at 393 the
band takes **6.0 px on each side of a 40.55 px cell — 29.6 % of the cell's width** — leaving a 22.3 px
clear window, with only **3.67 px of paper** between the band's outer edge and the neighbouring grid
line. Deleting the 0.08 fill moved the chip from tinted to solid; it did not remove it. §10 asks the
owner the right question, and the artifacts as banked lean against the answer the spec wants.

**The tally reads as a dashed rule.** My frame — `frames-crit/tally-top-desk-light-chromium.png`,
desk light, 20 written, 17 ticks at 64 % duty, 6 px thick, 4 px above a 7 px rule — is a second,
dashed rule parallel to the first. That is the disease the spec names for the form it rejected
("at 4×4 … the tally reads as a dashed rule") and does not price for the form it shipped. Crop 2 —
16×16 at k = 24, the Law-A frame, in the brief — was never banked, and no frame exists at 4×4, where
the duty falls to 4.5 % (45 u of ink on a 990 u pitch) and the same mark becomes four isolated dashes
around a whole frame. LAW A holds the INK constant across board sizes; the GESTALT is not constant and
has been screenshotted at exactly one board size.

---

## 4 · Two things the diff does that the spec does not declare

**`--color-user-ink` is re-bound in both themes.** `index.css:150` `#2563eb` → `var(--color-pencil-graphite)`
and `:388` `#60a5fa` → the same. §8's dies table names **four** hexes; the diff retires **six**. The
file plan (§12 item 2) lists the ground token, progress-ink, crayon-blue, focus-sketch — never this.
The token table says `--color-user-ink` "stays". Confirmed live: `--color-user-ink: hsl(0 0% 15%)` on
the root, identical to `--grid-line-color` and `--color-pencil-graphite`. Twenty-four consumer sites
and `.user-marks` (also moved to graphite, its `prefers-contrast: more` arm deleted) change colour on
a **solo** board, which is the common case. The design may well want this — §6's sentence needs it —
but it is a wave-scale ink move riding in undeclared, and the R2 census's MOVED rows do not carry it.

**A chair ruling is applied where it says proposed, and the return says otherwise.** Chair §6.11:
the `visual-regression.spec.ts` change ships "as a PROPOSED diff under its evidence dir, **not
applied**". `git diff -- e2e/visual-regression.spec.ts` in the worktree is non-empty. Worse, the
applied form is **not** the banked proposal: it asserts `expect(crayonVars.blue).toBe("")` — pinning
the estate's own spec to this family's arm, which the banked proposal's own comment forbids in
writing ("Asserting its ABSENCE here would pin this spec to one family's arm"). README §8 states the
instruments are "unapplied, per chair §6.11". One `git checkout` closes it.

---

## 5 · Gates that cannot fail, and a constant nobody measures

**G-WASH's byte-identity clause is the token compared with itself.** The probe reads `.cell-peer`'s
computed background and a probe element carrying `color-mix(graphite 6%)`, then asserts they match.
`.cell-peer`'s declaration *is* `var(--ground-wash-unit)` *is* that mix. It cannot fail while the
token exists. The clause beside it — "0 sub-unit-opacity nodes" — is **GREEN at HEAD**, which the spec
states, so it is a gate that could only ever fail for a design nobody proposed; the honest claim is
the counterfactual and the prototype says so. What is unmeasured is the thing that matters: graphite
at 6 % over the card is a **1.12:1 achromatic step** (1.26:1 under `prefers-contrast: more` —
computed here), where HEAD's crayon-blue at 7 % carried a hue cue as well. The selection's reach is
the faintest it has ever been and no number in this pass says whether a reader sees it.

**G8 is a source edit with no run anywhere.** `FILTER_BUDGET_UNION_AREA` 45,572 → 44,642 and
6,673 → 5,743 is read by exactly one consumer, `e2e/filter-census.spec.ts`. O-12 makes CI browserless,
so nothing in the gate estate checks it; the prototype did not run the census either. A constant whose
docstring says "the measured union" — a docstring that narrates the last tranche's version of this
same mistake — is unmeasured for the second tranche running.

**The authorship value figure is stale.** §5 cites 1.19:1 "re-derived at citation". `#262626` against
`#0a0a0a` computes **1.31:1** here. Either number is below use, which is why the seam properly rests
on 1.33× weight — but the citation was not re-derived.

---

## 6 · What is still unmeasured

Nine of fourteen gates are unrun or partial, by the prototype's own count: **G0** (the section's
five segment arms × 2 engines × 2 dprs), **G1/G1b** (the hue census, solo and with a peer — the
in-probe arm returned `{}` on a selector that does not exist), **accent-kinship** with the proposed
anchors, **G2's painted rank** over 8 cells, **G2b** and **R3** σ, **G4's** deck +3.9 % and
`cell-light`'s declared diff px, **G6's** R5 I2 e2e, **G9's** ring / tally / tape print rows and the
forced-colours row (inconclusive under programmatic focus), **G10's** webkit arm.

π is exact on **geometry** (0 of 6,764 boxes moved, both engines, +81 declared nodes) and **unmeasured
on ink**: a rect census cannot see colour, and this diff moves ink on `--color-user-ink`'s 24 sites,
`.user-marks`, `.cell-peer`, tier 2, tier 2×3, the tally and the join ring. No golden ran, including
the one the spec declares as moving.

---

## 7 · Verdict

**ADVANCE.** Nothing here is a rewording and no primitive is missing — `posePoints`/`poseLengths`/
`poseFronts`/`tickMarksAlong` are seated and consumed, the ground gate is a real clone with three
non-vacuous self-tests, the flag keeps both F1 arms a build away, and the family's two structural
laws (the ratio form, the cut front) reproduce under an instrument I wrote. The discipline is largely
good: the prototype carried its objection to the synthesis's ground rank in its return rather than
smoothing it into the diff, and it named its own gaps accurately.

It is not converged. The band's stated ratio fails the instrument its gate names; the pressed-twice
reading and the tally's form are asserted where the frames read against them; an undeclared
wave-scale ink move and a broken chair ruling ride in the diff; and the ink half of π, the segment
row, the census and the rank are all still to come. **62%.**
