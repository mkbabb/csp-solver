# MRK-WASH · pass 1 (CRITIQUE) — the wash does not survive its own prototype

Adversarial read. I did not write the spec or the prototype. Everything below was re-measured on
the prototype's own worktree, served fresh on `:4241` from
`.claude/worktrees/wf_e58b4764-0fc-45/web/frontend`, chromium and webkit, light and dark, at
1280×800 with `reducedMotion: reduce`. Probes, logs and two frames beside this file at
`critique/MRK-WASH/` (96 KB).

**Convergence: 55%. Verdict: BANK.**

Bank two cheap, measured product changes and one wave-level finding. Retire the wash as a design.
The family's named thesis is refuted by its own numbers, its mechanism is unearned against an
ablation it did not run, its headline gate cannot fail on the axis it moved, and the one picture
that would show the thing it promises was never taken.

---

## 1 · What I reproduced, and it holds

The lane's digit curve is **exact**. My own eroded-glyph-core estimator, written from the gate's
description rather than from its code, returns the lane's figures to the hundredth
(`logs/profile.json`):

| `--wash-a` | 0.08 | 0.10 | 0.12 |
|---|---|---|---|
| chromium-light | **4.58** | 4.45 | 4.30 |
| webkit-light | **4.56** | 4.42 | 4.30 |
| chromium-dark | 6.56 | 6.36 | 6.14 |
| webkit-dark | 6.56 | 6.36 | 6.15 |

So G-WASH-3 is genuinely RED at the spec's 0.12 and RED at the spec's own §1.5 fallback of 0.10.
The refutation of the sampler-artefact hypothesis is sound, and I confirm it twice over: in my run
the eroded core and its darkest half agree to the hundredth in all twelve readings, which is what
a uniform stroke interior looks like. **The lane was right about the digit, and right to ship 0.08.**

I also add the number that makes it decisive, which the lane did not take (`logs/baseline.mjs` run):

> The entered digit reads **5.08:1 bare** in light — with no selection on the cell at all — and
> **7.36:1 bare** in dark. HEAD's existing 0.08 body already spends **0.50** of that in light.
> Against a 4.5 floor, the total light headroom is 0.58 of a ratio point and the body the tree
> already ships eats 86% of it.

A family whose name is THE WASH has, in light, **no room to move its wash at all**. That is not a
tuning problem. It is the family's thesis meeting the tree.

---

## 2 · THE ABLATION THE LANE DID NOT RUN — the mechanism is unearned

The spec states outright that "the rim's ratio is set by OPACITY not width (rim3@0.95 beats
rim7@0.90), so width and floor are separable" — and then ships `paint-order: stroke`, a 3-unit
rim, a renamed keyframe and three custom properties. It never runs the arm that its own sentence
implies: **HEAD's geometry with the opacity alone moved.**

I ran it. Four arms, one session, one deal, one set of pixels, reloading between arms so no
injected sheet stacks (`probe/ablate.mjs`, `logs/ablate.json`). The lane's own top-2%-of-changed-
pixels estimator, reimplemented:

| arm | ch-light | ch-dark | wk-light | wk-dark |
|---|---|---|---|---|
| **A** PROTO `paint-order:stroke` rim 3 @ 0.95 | 3.93 | 3.98 | 3.92 | 4.00 |
| **B** HEAD `paint-order:normal` ring 7 @ 0.90 | 3.68 | 3.76 | 3.69 | 3.76 |
| **C** ABLATE `paint-order:normal` ring 7 @ **0.95** | **3.97** | **3.99** | **3.97** | **4.00** |
| **D** ABLATE `paint-order:normal` rim 3 @ 0.95 | 3.92 | 3.99 | 3.93 | 3.99 |

**Arm C ties or beats the prototype four-for-four.** Arm C is HEAD with `stroke-opacity: 0.9`
changed to `0.95` — two characters, no `paint-order`, no rim narrowing, no `--wash-a`, no
`--wash-rim-w`, no `wash-fill-in`. Arm D shows the narrowing alone is likewise inert.

The family's entire measured gain on its headline gate — 3.68 → 3.97 — is **the opacity scalar**.
Everything else in the tier-2 rewrite is unearned by the gate that justifies it.

## 3 · G-WASH-1 CANNOT FAIL ON THE AXIS THE FAMILY MOVED

`isolate()` reports the median of the **2% most-changed pixels**. On any anti-aliased line whose
peak pixel sits at alpha 0.95, that estimator returns ~3.9 regardless of how wide the line is. It
is blind to width — and width is precisely what this family changed (7 units → 3, a visible mark
of ~2.2 CSS px down to ~0.95, and 0.43 px on the phone).

Two estimators that are not blind to it, over the same differenced pixels (`logs/ablate.json`),
reading the rim band's most-changed decile rather than its most-changed 2%:

| arm | ch-light | ch-dark | wk-light | wk-dark |
|---|---|---|---|---|
| **A** PROTO rim 3 | **2.76** | 3.15 | **2.53** | **2.79** |
| **B** HEAD ring 7 @ 0.90 | 3.63 | 3.72 | 3.63 | 3.71 |
| **C** ABLATE ring 7 @ 0.95 | 3.92 | 3.99 | 3.92 | 3.99 |

On a band-integrating read the prototype's hairline falls **below 3:1 in three of four**
engine × theme combinations, while both wide-ring arms clear it comfortably. And counting raw CSS
pixels that reach 3:1 on a scanline through the left rim (`logs/profile.json`), the prototype
contributes 3–4 where HEAD contributes 5 and the ablation 5–6.

I am not asserting the prototype fails 1.4.11 — SC 1.4.11 sets no minimum width, and the peak-pixel
reading is defensible. I am asserting that **the gate the family chose is the one estimator that
cannot see the change the family made**, that it happens to reward the one scalar the family could
have moved without the rewrite, and that a second, equally defensible estimator inverts the result.
A gate with that property has not adjudicated anything.

(Caveat on my own instrument, stated so it can be checked: my scanline profile is confounded by the
wobbled graphite grid rule at the cell edge, which reads 5.45–10.83:1 against paper in every arm
identically. The peak figures in `profile.json` are the grid, not the mark. Only the differenced
`ablate.json` numbers above are clean, because they count only pixels that changed on focus.)

## 4 · THE FAMILY SHIPS NO WASH

`--wash-a` ships at **0.08**. HEAD's `fill-opacity` is **0.08**. The body is unchanged in effect,
and the lane says so plainly. What is left is a rim tweak wearing the name of a fill.

And the tokens are not tokens. Counted across the whole tree:

- `--wash-a` — defined once (`gameCell.css:258`), read once (`:263`), in the **same rule block**,
  never overridden anywhere. A literal with a comment attached.
- `--wash-rim-w` — defined once (`:259`), read once (`:265`), same block, never overridden. Same.
- `--wash-rim-o` — defined once, read once, **and overridden at `:368`** under
  `prefers-contrast: more`. This one earns its indirection. It is the only one that does.

`wash-fill-in` is `ghost-draw-on` plus one declaration in its from-frame; the tree now carries two
near-duplicate 180 ms keyframes on the same easing where an added `fill-opacity: 0` to the existing
one would have done. `ghost-draw-on` does survive with a live consumer at `:243`, so nothing is
dead — but nothing is gained either.

## 5 · THE PICTURE THAT WAS NEVER TAKEN — and what it shows

**All four of the prototype's cited frames show an EMPTY selected cell.** The family's memorable
line is "the selected cell is a patch of crayon with a **digit** written on it." Its contested gate
is the digit read through the body. Neither state appears in any banked frame. The gestalt is
asserted and measured; it is not seen.

I shot it (`frames/digit-in-selection-{light-chromium,dark-webkit}.png`, 5.7 KB + 6.7 KB), and it
carries a finding the spec never names:

> **The player's entered digit is blue.** The glyph is an SVG path stroked `rgb(37,99,235)` in
> light and `rgb(96,165,250)` in dark. The wash — body and rim both — is `#3a7bc4`,
> `rgb(58,123,196)`. They are near neighbours in hue. The **givens are black** and are untouched
> by the wash.

So the selection ground tints with the same crayon the player writes in, and it degrades **only the
digits the player entered themselves** — exactly the marks they are reading back to check their own
work. The luminance half of that collision is what G-WASH-3 measures. The hue half is unmeasured,
unnamed, and it is the half a reader actually experiences. "A patch of crayon with a digit written
on it" is true in a way the spec did not intend: the patch and the digit are the same crayon.

## 6 · Constraints, checked

| constraint | result |
|---|---|
| **M16 plain copy** | GREEN. `npm run lint:copy` exit **0** bare, 0 em/en dashes, 0 unadmitted jargon; no string minted. Note: the lane's record cites `check-copy-register` as the command — `npm run check-copy-register` exits **1**, no such script. The gate is real, the citation is not. |
| **R6 decided history** | GREEN. Zero hex literals on any added line of the diff (`git diff -U0 | grep '^+'`). `index.css` untouched. Ink stays `--color-focus-sketch`. |
| **filterBudget 9** | Unmoved by the family — the diff adds no filter. But **G-WASH-5's 9-light/11-dark is not confirmed**: my independent live-filter count reads **8 light / 9 dark**, both engines (`logs/constraints.json`). Different instrument, different absolutes. The lane concedes it never ran the estate's `filter-census.spec.ts` because that spec asserts against built dist. Nobody has reproduced 9/11 on the gate's own instrument. |
| **AA both themes** | Computed above. Digit 4.58/4.56 light, 6.56 dark at the shipped alpha. Rim 3.92–4.00 on the lane's estimator, **2.53–3.15 on a band estimator in 3 of 4**. |
| **π on unclaimed surfaces** | GREEN by construction and by inspection. Every CSS change is paint-only (`paint-order`, `fill`, `stroke`, `animation`); the `v-if` removes an `absolute inset-0 pointer-events-none` div, which cannot move layout. The lane's byte-identical rect census is consistent with the diff. |
| **W2's landed mechanics** | GREEN. The diff is entirely inside the board cell. Sticky tag, dock, bottom tab and tap-floor token are untouched. |
| **`prefers-contrast: more`** | GREEN, verified myself: `strokeOpacity 1`, `fillOpacity 0.08`, `paintOrder stroke`, `animationName none`, all four engine × theme (`logs/constraints.json`). |
| **one ground per cell (DOM)** | On a plain board with a cell selected: `peerWash 20`, `doubleGround 0`, `selfPeer 0`, both engines both themes. The selected cell is correctly excluded from its own peer set (`techniqueAdapter.ts:122`, `other !== cell`). |
| **types / units** | `vue-tsc -b` exit 0. `DigitCell.test.ts` + `DigitCell.attribution.test.ts` = **43 passed** — and see below. |

### The new law has no gate

43 DigitCell tests pass, and **not one of them would notice if the new `v-if` were reverted.**
A grep for any test mounting `isPeer` together with `isPeerCursor` or `isBecause` returns nothing.
The existing tests assert only `isPeer: true → .cell-peer exists`, which the gated version still
satisfies because the two new props default undefined. The plan's step 5 says "gates in the same
commit: red before step 1, green after 2" — for the one-ground rule, the only gate that exists is
an e2e probe in a throwaway worktree. Nothing that ships enforces it.

---

## 7 · Checklist hits

- **Gates that cannot fail** — G-WASH-1's 2%-percentile estimator is blind to mark width, the one
  axis this family moved (§3).
- **The elegant-reduction trap** — the mechanism is unearned: two characters at HEAD tie or beat it
  four-for-four (§2).
- **Legacy alias** — `--wash-a: 0.08` is HEAD's `fill-opacity: 0.08` under a new name, and the
  family is named after it (§4).
- **Consumer-less substrate** — `--wash-a` and `--wash-rim-w` are each defined and read once inside
  the same block and never overridden (§4).
- **Unverified gestalt** — no banked frame shows the selected cell with a digit in it, which is both
  the memorable claim and the contested gate (§5).
- **The constraint it forgot** — the entry ink is the wash's own hue; the givens are not; the spec
  reads neither (§5).
- **Spec-cites-itself circularity** — §1.1 says the rim carries the mark, §1.4 scores G-WASH-4 on
  the body, and exit (1) asks the wave to restate the gate so the rim scores instead. A family that
  may rewrite its gate when the gate goes red has not been gated.
- **Masked fallback** — §1.5's "if <4.5 in light, drop to 0.10" is the default that hides the
  unhandled case. Measured, 0.10 reads 4.45 and does not clear. The chain terminates at 0.08, which
  is HEAD, which is "change nothing."
- **"And then the hard part"** — the lane names it honestly and it is the whole design: in light no
  pair of alphas greens G-WASH-3 and G-WASH-4 together while the unit wash stays visible.

**Not hit, and worth saying:** the generic default (nothing templated here), π (clean), W2's
mechanics (untouched), R6 (clean), M16 (clean). The measurement craft is genuinely strong — the
paired interleaved frame trace, the same-session HEAD control by overlay, the erosion estimator and
the honest carrying of G-WASH-4 and R3-a as RED are all better practice than most of this loop.

## 8 · Strengths worth keeping

1. The digit finding, reproduced independently to the hundredth, plus the bare-headroom number:
   **5.08 light / 7.36 dark against a 4.5 floor, of which HEAD's existing body already spends 0.50.**
   That is a wave-level budget every board-ground family spends from, and it was not on the record.
2. `stroke-opacity: 0.9 → 0.95` on the existing ring: **+0.29 of a ratio point, four-for-four, for
   two characters**, with the mark's visible width preserved. Cheap, measured, take it.
3. The one-ground `v-if` — the rank at the binding. Greens G-WASH-2 outright, costs nothing.
4. Refusing to pass by a hundredth. The lane had a configuration that greened chromium and called
   the 0.01 WebKit miss a coin rather than a design. That is the right instinct.
5. Carrying R3-a RED with its reading instead of rescoring it silently.

## 9 · Open gaps

1. Run the arm "HEAD's 7-unit ring at `stroke-opacity: 0.95`, `paint-order` unchanged" against the
   prototype four-for-four on one deal and one session; if it ties or wins, strike `paint-order:
   stroke`, `--wash-a` and `--wash-rim-w` from the diff and ship the scalar alone.
2. Re-score G-WASH-1 on an estimator that integrates the mark's whole painted band rather than the
   median of its 2% most-changed pixels, and state the minimum visible mark width in CSS px that
   clears 3:1 on it at 9×9 desk, 9×9 phone and 16×16.
3. Shoot and cite the selected cell **with a digit in it**, both engines, both themes.
4. Name in the spec that the digit under test is the player's own entry ink (`#2563eb` light,
   `#60a5fa` dark), that the wash `#3a7bc4` is its near neighbour in hue, and that the givens are
   black and unaffected; then read the entry-against-ground separation on something other than
   luminance.
5. Rule whether the hint laminate is a ground or a layer; if a ground, extend the `v-if` so it
   cannot compose with your own selection (measured 13.10 L\* against 5.90 clean).
6. Land a unit test for the one-ground rule — today the suite is green because the law is untested.
7. Re-derive G-WASH-5's 9-light/11-dark on the estate's own `filter-census.spec.ts` against a built
   dist under `playwright-throttle.config.ts` in both emulated schemes; the dev-server instruments
   disagree (mine reads 8/9).
8. Read the rim's contrast at 16×16, where its visible width falls below the phone's 0.43 px.
9. Repeat every contrast figure on a second deal and a second board size; all of them come from one
   seed at `?size=3&difficulty=EASY`.
10. Decide G-WASH-4 by ruling, not by tuning: score the mark not the body, quiet the unit wash, or
    rule the 45.9 px cell digit large-scale text under 1.4.3.
11. Assign the dark unit wash out-reading the dark selection body (margin −1.00) to an owner; the
    family surfaced it and disowned it in the same breath.
12. §6 is empty. The cut-out (solid `--color-focus-sketch` at 85%, label flipped to
    `--color-card`) is a ballot row with nothing built or measured behind it.

## 10 · Verdict — BANK

Not ADVANCE: the thesis is dead by the family's own measurements, and the two things worth keeping
are not this family's design — they are a scalar at HEAD and a `v-if`.

Not RETIRE: the yield is real, measured on both engines, and some of it is wave-level.

**BANK.** Take into the wave: (a) `stroke-opacity: 0.95` on HEAD's existing ring, pending gap 1's
ablation and gap 2's honest estimator; (b) the one-ground `v-if` with a unit test; (c) the digit
headroom budget as a standing constraint on every family that tints a cell ground. Retire "the
wash" as a design — the selected cell already had the only body the light theme can afford, and the
family's own prototype is what proved it.

---

### Files

- `critique/MRK-WASH/probe/ablate.mjs` — the four-arm ablation, two estimators, both engines
- `critique/MRK-WASH/probe/profile.mjs` — the rim as a pixel profile + the digit re-read at 0.08/0.10/0.12
- `critique/MRK-WASH/probe/constraints.mjs` — filter census both schemes, the one-ground DOM rule, `prefers-contrast`
- `critique/MRK-WASH/probe/baseline.mjs` — the digit with and without the wash under it
- `critique/MRK-WASH/probe/ink2.mjs` — the rendered inks of entry, wash and grid
- `critique/MRK-WASH/logs/{ablate,profile,constraints}.json`
- `critique/MRK-WASH/frames/digit-in-selection-{light-chromium,dark-webkit}.png`

To re-run: symlink `web/frontend/node_modules` into `probe/`, add `{"type":"module"}` as
`probe/package.json`, serve the prototype worktree on `:4241`, `node probe/<name>.mjs`.
