# T9-W7 pass 3 · CRITIQUE · MRK-ABS — The absolute ring

Adversarial. I did not write the spec or the prototype. Everything below that carries a number
was re-measured by me on the prototype's own worktree
(`/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-39`),
served on my own `127.0.0.1:4244` with a private `cacheDir`, both engines, and banked under
`critique/MRK-ABS/logs/`. My server is killed and the 4230–4249 band reads empty.

**CONVERGENCE: 72%. VERDICT: ADVANCE** — with the colour axis re-opened, because the sentence
this family used to close it is false.

---

## 0 · What I did

- Read the whole diff (`git -C <worktree> diff`, 13 files, +180/−66) and the return's 16
  measurements against the banked logs.
- Looked at both banked frames.
- Re-ran the pass's **decision row** myself, independently, with three arms at the same device
  pixels (`probe/crit-decision.spec.ts`), then a **colour search** the family never ran
  (`probe/crit-search.spec.ts`, `probe/crit-lightsearch.spec.ts`), both engines throughout.
- Checked the constraints by hand: M16 (`check-copy-register` on the prototype tree), the four
  lints, filterBudget, π (hue census + r0 law probe diffed against HEAD's; every `outline`
  declaration in `src` audited against the deleted `outline-ring/50`), the decided history at
  `loop/r0/r6-idiom-history/R6-census.md`, and W2's landed mechanics.

---

## 1 · What holds, verified by me

| claim | my reading |
|---|---|
| the 1.389 alias refusal (asserted with **no banked log**) | **CONFIRMED and now banked**: `1.389` worst in BOTH engines at the 16×16 dark frame crossing. `logs/decision-*.json` |
| the shipped one value at that crossing | **CONFIRMED**: 2.404 worst both engines (medians 2.436 chromium / 2.404 webkit) |
| M16 | `check-copy-register` on the prototype tree: 0 em/en dashes, 0 unadmitted jargon, lexicon 25, exit 0 |
| lints | `theme-tokens` `theme-selectors` `ink` `motion` all exit 0 on the prototype tree |
| filterBudget | `FILTER_BUDGET` sums to 9 and the diff touches no filter; r0 probe L1 GREEN on both trees |
| π · the deleted `outline-ring/50` | audited every `outline` declaration in `src`: all six are full shorthands carrying `var(--focus-ring)`, plus one `2px solid Highlight`. Nothing relied on the `*` rule's colour — **no undeclared pixel from that deletion** |
| π · hue census, r0 law probe | `diff` of the lane's HEAD and proto captures: **byte-identical**, both files |
| W2's landed mechanics | sticky tag, dock, bottom tab and `--tap-floor` untouched by the diff; G-ABS-11 names W2's one declared clip by selector |

The geometry work is the strongest thing in this pass and I could not break it. The ablation
witness (`f = 1.00, W = 5.4` → −0.788 u, the ring enters the neighbour) is a real born-RED
control run in the same instrument as the green arm, and it does what almost nothing in this
loop does: it **changes the family's own stated reason** from pass 2 (MA-R) to a proven one
(MA-N), and says so in the product's comments.

---

## 2 · THE FINDING — "no colour fixes that" is false, in both themes, in both engines

`index.css:219` now ships this sentence:

> "No colour fixes that — it is a geometry row for §5, and it is the section's, not this
> token's."

and the `.dark` block ships "Neither clears the 1.4.11 floor there, so the alias buys nothing."
The return generalises it: *"no colour available to this estate makes it legible there"* and
*"the colour axis cannot buy this pixel."*

The family measured exactly **two** values — `#3a7bc4` and `var(--color-crayon-blue)` — and
generalised to *no colour*. Both candidates sit on the **same side** of the useful direction,
and the useful direction is **opposite in the two themes**: the light frame is a dark grey
`[49,49,49]` (a *lighter* ink helps), the dark frame is a light grey `[199,197,190]` (a *darker*
ink helps). A two-value token walks both ways at once. I searched it. Worst-of-60-samples,
same instrument, same pixels, 16×16, cell 0 (frame) and cell 1 (paper):

### dark theme

| dark-arm value | frame `[199,197,190]` | paper `[19,18,17]` | |
|---|---|---|---|
| `#3a7bc4` shipped | 2.404 / 2.404 | 3.989 / 3.989 | frame **RED** |
| `crayon-blue #6aabeb` refused | 1.389 / 1.389 | — | **RED** |
| **`#2f66a8`** | **3.168 / 3.161** | **3.004 / 3.010** | **both GREEN, both engines** |
| `#2a5a96` | 3.769 / 3.720 | 2.514 / 2.549 | paper RED |
| `#24507f` | 4.396 / 4.396 | 2.151 / 2.151 | paper RED |

### light theme

| light-arm value | frame `[49,49,49]` | paper `[253,253,252]` | |
|---|---|---|---|
| `#3a7bc4` shipped | 2.812 / 2.850 | 3.927 / 3.965 | frame **RED** |
| `#3f80c9` | 2.978 / 3.050 | 3.707 / 3.713 | frame marginal (chromium 2.978) |
| **`#4285ce`** | **3.171 / 3.219** | **3.490 / 3.489** | **both GREEN, both engines** |
| `#4a90d9` (crayon-blue) | 3.642 / 3.689 | 3.084 / 3.059 | both green on the BOARD |

(chromium / webkit. Full rows: `logs/search-*.json`, `logs/lightsearch-*.json`.)

**So G-ABS-6's RED at the 16×16 frame crossing is closable on the token axis in both themes**,
and this family shipped prose declaring it unclosable there. The window is narrow — roughly
0.10–0.15 in ratio on the dark paper side — and both candidates are **new hexes**, which law 23
("a semantic state token is an alias into the crayon system, zero new hexes") disfavours. That
is a real cost and a legitimate reason to decline. It is a **completely different argument** from
the one the product now carries. The honest sentence is: *a dark arm near `#2f66a8` and a light
arm near `#4285ce` clear both board grounds in both engines; each is a new hex, and law 23 and
U-10 decide whether the estate spends them.* That sentence hands the section a **ballot**. The
shipped sentence hands it a **geometry row it may not need**.

I am not asking this family to take the token axis back — it conceded it to MRK-LIVE by design,
and chair §6.6/§6.7 seat it there. I am refusing the *reason* it conceded it with.

---

## 3 · Three numbers in the diff that no measurement supports

This family's own thesis is "the prose follows the measurement everywhere" and it deletes HEAD's
false `5.3`. It then ships three figures of its own that the logs do not carry.

1. **`index.css` dark block: "the one value 2.71:1"** at the 16×16 dark frame crossing. The
   measured worst is **2.404 / 2.404**, the medians **2.436 / 2.404**. `2.71` appears in exactly
   one file in the whole evidence dir — `logs/ma-r-table.txt:64`, a *hover-tier cell-rule
   clearance in board units*, an unrelated quantity. Same defect class as the `5.3` this diff
   was written to kill, in the comment written to replace it.
2. **`index.css:219`: "2.81 light / 2.44 dark, both engines."** Light is 2.812 chromium and
   **2.850** webkit; dark's 2.44 is **chromium's median alone** — webkit's median and both
   engines' worsts are 2.404. "Both engines" is doing work no row supports.
3. **`index.css:219`: "3.97 light and 3.99 dark"** is the *median*, while G-ABS-6 is judged on
   the *worst* (3.50 / 3.53 light, 3.55 / 3.61 dark at 9×9). G-ABS-5's "within 0.1" never names
   the statistic, so the lane used median for the comment and worst for the gate. A gate that
   the author picks the statistic for is not yet a gate.

---

## 4 · The comment is hostage to a value this family does not own

`index.css:219` asserts 3.97 / 3.99 and G-ABS-5 binds it to ±0.1. Those readings are taken at
`gameCell.css:250`'s `stroke-opacity: 0.95` — **MRK-LIVE's row** (chair §6.6), replayed here for
measurement, cited, *not owned*, and leaving this diff at the fold. Decided-history law 39 still
states the board ring at **opacity 0.9**. I measured the same pixels at 0.9:

| | 0.95 (shipped) | 0.9 (law 39) | Δ |
|---|---|---|---|
| light paper, chromium / webkit | 3.972 / 3.965 | **3.679 / 3.685** | −0.29 / −0.28 |
| dark paper, chromium / webkit | 3.989 / 3.997 | **3.763 / 3.755** | −0.23 / −0.24 |
| dark frame | 2.436 / 2.404 | 2.312 / 2.320 | −0.12 / −0.08 |

Every one of those moves is **larger than G-ABS-5's own ±0.1 tolerance**. If MRK-LIVE's 0.95
does not survive the section fold, `index.css:219`'s comment is false again the moment the fold
lands — the exact failure this family exists to prevent, re-created structurally rather than
textually. The comment must name the opacity it was read at, or G-ABS-5 must be re-stated so it
reds when the opacity moves.

---

## 5 · Two decided-history rows moved and unreported

- **r0 R1.** The prototype brief said `law-probe.COPY` with *"R1 under MRK-LIVE's rebased
  wording, reported as such."* The lane ran a **byte-identical** copy instead, so R1 reads
  **RED on the prototype's own tree** (`logs/law-probe-proto.txt`) and the return books it
  "pre-existing, not this diff." R1 is *the* law this family's token decision answers to, and
  half of R1's stated RED reason — *"its own comment claims 'Dark mode keeps crayon-blue'"* — is
  **cured by this very diff** and the unmodified probe cannot see it. R3-a was correctly reported
  MOVED under `instruments/`; R1 was not, and it is the more load-bearing of the two.
- **Law 39.** It names three estate focus forms, one of them *"2px dashed currentColor offset 3
  (the tab)"*. `DrawerTab.vue:151` deletes that form outright, and the ring ships at 0.9 → 0.95.
  The return reports against law 39 nowhere. (Chair §6.7 stands law 39 and only *names*
  ACC-GRAPHITE as its reporter — that does not exempt a lane that moves it.)

---

## 6 · Coverage: what the gates actually cover

**G-ABS-3 is stated as "every stop ≥ 3:1" and is measured on 5 of 8, RED on 1 of those 5.**
From the lane's own `logs/census-*.json`: `bandedStops: 5` in every arm.

- RED: `.info-btn`'s right band in dark, **2.92 chromium / 3.34 webkit**, ground `[212,211,208]`.
  A real WCAG 1.4.11 miss shipped in the diff, correctly named in the gaps.
- Unbanded: `.sun-moon-toggle` (offset 54 px, past the instrument's ±30 px clip — the ring is
  asserted from computed style, never from painted bytes), `.drawer-tab` (occluded sides,
  pass-2's gap 1 still open — and this is the element whose *own* law-39 form was just deleted,
  so its replacement is measured nowhere), `.cell-native-input` (the named exemption, fine).
- **The deck's centre card is not in the walk at all.** It takes the ring through
  `.gallery-viewport:focus-visible .game-card.is-center`, so it is not a focusable stop and never
  banded. Crop 3 shows exactly why that matters: the 2 px blue runs **flush inside the card's own
  heavy black drawn outline**, so the one surface the family chose to photograph is the one
  surface whose ring-on-ground ratio no row carries.

**G-ABS-4's "one colour"** is a census of the sudoku home route at 1280×800. Futoshiki, thermo,
killer and kenken were not walked. The claim is route-scoped and does not say so.

**Not executed at all:** forced-colors (the `@layer base` block mints a new
`outline-color: Highlight` rule that *nothing has painted*), the phone performance trace, the
WebKit arm of `spoken-gallery`/`access`/`a11y`, `visual-golden`. Two of four briefed crops.

---

## 7 · Failure-mode checklist

| item | verdict |
|---|---|
| vacuous convergence | **CLEAR** — gates red where they should be; two shipped RED and named |
| spec-cites-itself | **HIT (minor)** — G-ABS-2's declared 2.3922 is `wanderUnits × kW4` where `kW4 = 0.443` is this lane's own measured shape constant, checked against itself at ±5%. Honest as the version canary the lane labels it; it is not an independent gate |
| gates that cannot fail | **HIT (minor)** — G-ABS-5's "within 0.1" does not name median vs worst, and the lane used median for the comment and worst for G-ABS-6 |
| elegant-reduction trap | **CLEAR** — the roughness inversion is closed-form, not "and then the hard part" |
| legacy aliases | **CLEAR** — `kW4` and `--color-ring` genuinely die; no renamed survivor |
| masked fallbacks | **HIT (major)** — *"No colour fixes that"* masks the case the design did not search. §2 |
| unverified gestalt | **HIT** — 3 of 8 stops and the deck card unbanded; forced-colors painted by nothing; one route censused |
| consumer-less substrate | **CLEAR** — `--focus-ring`/`--focus-offset` have six call-site consumers plus the base rule |
| the generic default | **CLEAR** — no tell on the list; the mark is the house's own ink and geometry |
| π it moves and did not declare | **HIT (minor)** — law 39's dashed tab form deleted with no row; the board ring's 0.95 travels in this diff while a gate in this diff depends on it |
| the constraint it forgot | **HIT** — the decided history: R1 not re-read under its rebased wording, law 39 unreported. M16, filterBudget, AA elsewhere, W2's mechanics: **all clear, verified by me** |

---

## 8 · Strengths worth keeping whatever happens to this family

1. **The ablation witness.** `f = 1.00, W = 5.4` reading −0.788 u in the *same run* as the green
   arm turns "load-bearing" from an adjective into a measurement, and it retired the family's own
   pass-2 reason rather than defending it.
2. **The roughness inversion.** Naming the wander and solving the roughness back out makes the
   constant size-free *by construction*: 2.4004 / 2.3777 / 2.4148 across three boards, spread
   1.55%. One number, three boards, no tuning.
3. **G-ABS-8.** The DOM's resident `d` byte-identical to an offline recompute at three boards in
   both engines. Pose 0 is provably the shipped artifact, not a story about it.
4. **A gate found a defect the spec did not foresee** (`--color-ring` orphaned by the seventh
   rule's deletion) and the lane **deleted the token rather than re-wording the gate**. That is
   the discipline the wave keeps asking for.
5. **MA-R struck as a gate and banked as a table** with the crossover named at N = 14.07. A false
   law retired with the numbers that killed it, not re-worded until it passed.
6. **Two instrument bugs banked as law**, one of which (the blurred-band read) invalidates
   pass-2's banded numbers for any stop with a non-zero offset — and the lane says so against its
   own predecessor.

---

## 9 · Verdict

**ADVANCE at 72%.** Not BLOCK: there is no missing primitive as hard as the problem — I built the
missing measurement in twenty minutes and it says the primitive is a second token value. Not
RETIRE: nothing here is a rewording, and every constraint I could check (M16, filterBudget, π,
AA everywhere but the two named REDs, W2's mechanics) holds.

What stops it at 72 and not higher: the family ships **two live WCAG 1.4.11 failures** (the
16×16 frame crossing in both themes, `.info-btn`'s right band in dark), justifies the first with
a claim painted bytes refute, carries **three unsupported figures** in the prose it rewrote to be
exact, binds a gate to an opacity it does not own, and leaves the r0 row its own decision answers
to unreported and RED. The geometry is done. The voice is not.
