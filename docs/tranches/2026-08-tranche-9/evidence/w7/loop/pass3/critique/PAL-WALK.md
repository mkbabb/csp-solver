# PAL-WALK — pass-3 adversarial critique

Written by the pass-3 critic, who wrote neither the spec nor the prototype. Every number below
that is not attributed to the lane was taken by this critic on its own servers: the prototype
worktree `wf_308fa864-c94-1` served at `127.0.0.1:4238` and the HEAD control `74a2b5d9` (the main
tree, `src` clean) at `127.0.0.1:4239`, chromium + webkit, dpr 3, both arms. Instruments and raw
readings: `pass3/critique/PAL-WALK-probe/`. Both servers killed; the 4230–4249 band reads empty.

**Verdict: ADVANCE. Convergence: 72%.**

---

## 1 · What reproduced

Independently, on this critic's own run, to three decimals, from the product's own module through
the page's own canvas at the bands the live sheet serves:

| reading | lane | critic (chromium) | critic (webkit) |
|---|---|---|---|
| ring worst of 144 vs own 4% fill, light, band 0.32, α 0.55 | 3.158 @ i=6 | **3.158 @ i=6** | **3.158 @ i=6** |
| ring worst, dark, band 0.79 | 3.430 @ i=5 (wk 3.450 @ i=107) | **3.430 @ i=5** | **3.450 @ i=107** |
| ring on `--color-popover` | 3.111 / 3.438 | **3.111 / 3.438** | same |
| min painted ring chroma | 0.0544 / 0.0545 | **0.05439 / 0.05455** | same |
| AA digit worst of 144 — background / card / popover, light | 7.098 / 7.270 / 7.164 | **7.098 / 7.270 / 7.164** | same |
| the same, dark | 5.310 / 5.197 / 5.270 | **5.310 / 5.197 / 5.270** | same |
| tape (`--sheet-washi-neutral`) | 6.321 / 2.813 | **6.321 / 2.813** | same |
| ring geometry off the cascade | α 0.55, fill 0.04, width 4 | same | same |

**π independently confirmed.** 375 classed rects on the solo page, prototype vs the named control
`74a2b5d9`: **worst |Δ| 0px, 0 one-sided, chromium and webkit, light and dark**
(`pi-census.txt`). A head-vs-head negative control was run first and is why that number is
believable — an unclassed hand-drawn `<path>` is re-seeded per load and, keyed by occurrence,
reads 979px of pure noise against the *same tree* (`pi-noise-control.txt`). Any π census in this
wave that counts bare `<path>` elements is measuring the boil, not the layout.

Other strengths, earned rather than asserted:

- **The pin rule fired.** 0.34 was *refused* at 3.035 painted for having 0.035 of headroom; 0.32
  taken at 3.158. A selection rule that rejected a candidate is not a decoration.
- **The gate's own defects were caught by the gate's own battery** — the first tier-3 cut wrote
  the token it then asserted on, and the first sampler read depth-of-change (the boil's strokes)
  rather than the line. Both named in the README and cured; the shipped band now comes off the
  cascade, which this critic verified by reading it there.
- **The literal 5 is dead.** The under-count is a ratio to the house's own crayon reference
  re-derived in the same run and in the same arm (0.076410 light / 0.060481 dark) — the charter
  named the literal as rot and the lane removed it rather than re-wording it.
- **The resolved-value census is a real discovery**: 35 chromatic declarations where the hex-only
  rule saw 29, six of them live `var()` aliases wholly outside the old count.
- `check-copy-register` 0 / 0 admissions / lexicon 26, re-run here. `check-peer-arcs` bare exit 0,
  re-run here. `useSession.test.ts` + `BoardHost.authors.test.ts` 51/51 green, re-run here.

---

## 2 · What did not converge

### 2.1 The gate runs nowhere in CI — and the estate's own census says so (BLOCKING for 100%)

`node scripts/check-lane-membership.mjs` **REDS on this tree**, run by this critic:

```
• [1 UNCLAIMED SCRIPT] web/frontend/scripts/check-peer-arcs.mjs — NO CI LANE names it and it
  declares nothing. It runs nowhere, so its green means nothing and its red would never be seen.
```

`lint:arcs` exists in `package.json`; no `ci.yml` step calls it. That is precisely the `lint:tdz`
shape the lane-membership law (T7-W6) was written to close, and the class is on its third bite.
Compounding it: tier 3 is a Playwright spec, and CI is browserless by standing ruling O-12. So of
the family's three tiers, tier 2 is the only one a CI lane will ever run. The lane's banked
`censuses.txt` lists fourteen gates at 0 and does not list this one.

### 2.2 The band is written twice and held together by nothing — measured, not argued (BLOCKING)

`playerIdentity.ts` bisects every chroma against hardcoded literals:

```ts
const DIGIT_BANDS = [0.44, 0.65] as const;
const RING_BANDS  = [0.32, 0.79] as const;
```

`index.css` declares the same four numbers as `--peer-ink-l` / `--peer-ring-l`. No CI-reachable
gate reads both: tier 1 never looks at the bands, tier 2 hardcodes `[0.44, 0.65]` and its golden
strings, the re-cut L6 law probe reads only `--peer-ink-l arms: 2`, and tier 3 — the one instrument
that *does* read the band off the cascade — does not run in CI (§2.1).

And the sheet's comment **invites the edit**: *"A later hand may darken the light arm or lighten
the dark one."* This critic took the invitation at runtime, read-only, and photographed the result:

| `--peer-ring-l` moved on the sheet | min painted ring chroma | max painted hue drift from the hue the module asked for |
|---|---|---|
| shipped 0.32 (light) | 0.0544 | **1.695°** @ i=80 |
| moved 0.20 (light) | 0.0356 | **18.258°** @ i=113 |
| shipped 0.79 (dark) | 0.0545 | 1.353° @ i=88 |
| moved 0.92 (dark) | 0.0461 | **18.065°** @ i=99 |

18° of hue is the exact catastrophe `playerIdentity.ts`'s own header names — *"clipping SHIFTS HUE
… makes the law this file is built on false in the painted bytes"* — reintroduced through a
duplicated literal, on an edit the neighbouring comment says is allowed, with nothing in CI to
see it. The primitive that closes it is small (one publisher: derive the bands from the sheet, or
a gate that reads both files and compares), which is why this is ADVANCE and not BLOCK.

### 2.3 The ring's painted hue is never held to the arcs

At the **shipped** band the ring already drifts up to **1.695°** (light) / **1.353°** (dark) from
the hue the module emitted. The module's header sizes the ±13° guard on a measured rounding budget
of **0.87°** — *"an ink at this chroma rounds to a byte triple whose hue is up to 0.87° off"* —
and that sentence was measured on the *digit*. The ring is a lower-chroma string (0.054 vs the
digit's 0.12+), so it rounds worse, and tier 3's arc row reads `inks` (the digits) only. The
family's central law is unasserted on the one surface this pass adds. The measured 1.695° still
sits inside the 13° guard, so this is a hole in the gate, not a live violation — today.

### 2.4 AA on both themes: the walk moved a text ratio down to 2.813:1

Reproduced here: the peer digit on the fold's washi tape (`--sheet-washi-neutral`), worst of 144,
**dark arm, 2.813:1** against a 4.5 floor — where HEAD's own ink on the same ground reads 4.232.
The surface was already under AA; this design deepens it by 1.42 because it lowered the dark band
0.80 → 0.65. The lane reports it as an estate LEDGER candidate on the fold's 3C-4 surface. That
disposition may well be right, but the number moved under this family's hand and the charter binds
every design to AA on both themes, so the row is this lane's to carry to the owner (U-10), not to
hand to the estate unlabelled.

### 2.5 Two born-RED rows read GREEN in the banked log, and round 3 is not banked

`readings/born-red.txt` is round 2's output and it says, in the lane's own words:

```
every st is authoritative (no wire rule)   GREEN — no unit holds it
self binds on the FIRST id                 GREEN — no unit holds it
```

The return explains both as controls aimed at the wrong branch and says rounds 2 and 3 re-aimed
and *"all three logs are banked"*. `readings/` holds one born-RED log. Round 3's re-aimed verdicts
(`br3-noagree.log`, `br3-solo.log`, `br3-reseat.log`) exist only as claims. Worse, the re-aim
changes the subject: `adoptInk(k, false)` proves the *set* matters, not the *rule*. The
discriminating case for `from === e[1]` — a **non-author's `st` arriving before the author's**,
where the correct rule lets the author's later word win and "first speaker wins" does not — is
held by no unit in this tree, which is why flipping the predicate to `true` changes nothing.

### 2.6 Rows the lane declared, which this critic confirms are still open

- **Goldens were not run.** The charter makes a golden move a STOP; the prototype's dist was never
  built this pass, so 4/4 is carried, not proven.
- **filterBudget was not counted.** `readings/censuses.txt` banks `--- filterBudget population ---
  0` for a row whose passing value is 9. A banked `0` reads like a measurement and is not one.
- **No peer on the wire.** Every ring number, the lane's and this critic's, comes from a probe that
  seats `.is-peer-cursor` and the var by hand. The relay arm is untested; everything is
  `?wire=local`.
- **No phone.** The popover ground is priced by arithmetic only; no 390-wide board was photographed
  and the dock sheet's 700 ms settle was never exercised.
- **The proposed accent-kinship tape row is wrong as written** — it reads 7.27, the card's number,
  because `--sheet-washi-neutral` is a `color-mix()` its `parseCss` cannot resolve. A MOVED
  instrument diff that returns the wrong ground is worse than no diff.
- **Five hands photographed, 144 inferred.** The worst photographed equals the worst arithmetic to
  three decimals in both arms, which is good evidence and is still inference.
- **`seedFor`** is a private helper with one caller. Calling it "PAL-TIN's seam, grafted" claims a
  primitive this surface has no second consumer for.

### 2.7 One adjacency the design creates and never prices

The peer's digit sits *inside* the peer's ring: same hue, two bands. Worst of 144, measured here:
**2.100:1 light** (i=124), **1.400:1 dark** (i=99). Nothing requires 3:1 between a glyph and the
ring around it, and this is not a violation — but it is the one new adjacency the second key
invents, and the family prices every other one.

### 2.8 The gestalt is asserted where only the owner can rule

*"Four hands read as four people; the fall is between four and five."* The ΔE table is honest
(N=3 and N=4 both 0.0758) and the banked light frame shows two of the four as near-neighbour
teals. This is a fork for the owner's eye under U-10, and the return states it as a finding.

---

## 3 · Checklist

| item | verdict |
|---|---|
| vacuous convergence | clear — every claim carries a number and a control |
| spec-cites-itself | clear — tier 3 reads the cascade and the module, not the spec |
| **gates that cannot fail** | **HIT — §2.1 (no CI lane) and §2.2 (the band pair is ungated)** |
| the elegant-reduction trap | **HIT (mild) — §2.6, goldens and filterBudget carried, not run** |
| legacy aliases | clear — the old flat-chroma walk is gone, not renamed |
| **masked fallbacks** | **HIT (mild) — `source?.writtenPositions() ?? []` makes "no source" and "no writes" the same silence, which the accessor's own doc says it declared `writtenPositions` to avoid** |
| **unverified gestalt** | **HIT — §2.8, and five hands photographed of 144 (§2.6)** |
| consumer-less substrate | **HIT (mild) — `seedFor`, §2.6** |
| the generic default | clear — nothing here is cream/serif/terracotta; the walk is the estate's own wheel |
| **the pixel it moves that it did not declare** | clear — π 0px over 375 rects, both engines, both arms, against the named control |
| **the constraint it forgot** | **HIT — AA dark on the tape ground moved 4.232 → 2.813 (§2.4); the ring's painted hue unheld to the arcs (§2.3)** |
| M16 / filterBudget / W2 mechanics / decided history | M16 clear (lint:copy 0, lexicon 26); filterBudget **unmeasured**; W2's mechanics untouched; R6 L6 re-cut GREEN but does not read the new scalar; R2 correctly reported stale by the fold's hand |

---

## 4 · Open gaps, each a sentence that closes it

1. Wire `lint:arcs` into a CI step beside `lint:ink`/`lint:catch` (or declare `NOT-A-LANE:` with a
   reason and a cite) so `check-lane-membership.mjs` stops reding on this tree.
2. Make the sheet the single publisher of the two bands — or add a CI-reachable check that reads
   `--peer-ink-l`/`--peer-ring-l` out of `index.css` and reds when they differ from
   `DIGIT_BANDS`/`RING_BANDS` — with a born-RED control that moves the token and watches the
   painted hue drift past 13°.
3. Assert the arcs on the RING's painted bytes as well as the digit's, and re-derive the header's
   0.87° rounding budget from the ring's own chroma (measured 1.695° light / 1.353° dark).
4. Carry the dark tape ground (2.813:1 worst of 144, moved from HEAD's 4.232) to the owner as this
   family's ballot row under U-10, or cure it, rather than booking it to the estate.
5. Bank round 3's three born-RED logs, and add the unit the wire rule actually needs: a
   non-author's `st` arriving BEFORE the author's, where "first speaker wins" gives the wrong ink.
6. Build the prototype's dist once and run the goldens 4/4 against it, since a move is a STOP.
7. Count the live filters against a built dist and replace the banked `filterBudget population 0`
   with the census's own 9.
8. Seat one ring from a real peer on the relay (two pages, one room) and re-read the same ring
   bytes, so the painted numbers stop depending on a probe that sets the class itself.
9. Photograph one 390-wide board with the ring on the dock sheet's popover ground, settled past
   the sheet's ~700 ms slide.
10. Fix the proposed accent-kinship tape row to read the ground off a node that wears the tape
    (`getComputedStyle`), since `color-mix()` defeats its `parseCss` and it currently returns the
    card's 7.27.
11. Extend the re-cut L6 law probe to read `--peer-ring-l`'s two arms, so the wave's newest scalar
    is inside the law it MOVED.
12. Price the digit-inside-ring adjacency (2.100 light / 1.400 dark, worst of 144) or state in the
    token comment that it is deliberately unpriced.
13. Photograph enough of the 144 to retire the five-hand inference, or state the inference in the
    gate's comment as the gate's own scope.

---

## 5 · Cross-pollination

- **The resolved-value census** (hex + `hsl()` + `var()` aliases followed, per-arm by brace-matched
  `.dark` block, `@media print`/`forced-colors` carved out). It found six live aliases the hex-only
  rule never saw. Every token gate in this wave should read values, not source text.
- **A count held as a RATIO to the house's own re-derived reference**, not as a literal ceiling.
  A literal measures the estate's weather; PAL-TIN has this shape and the ACC-* and PLR-* gates
  want it.
- **A token that carries its own selection rule and its own refusal** — *"the lightest light arm /
  darkest dark arm that clears 3.0 PAINTED with ≥0.10 headroom, never raised later to pass"* — with
  the rejected candidate's number in the comment. That is the right form for every measured token
  §6.5 registers.
- **`isTheRing`**: find the line by a perpendicular scan at the half-stroke centreline, verify the
  median against the cascade's own computed composite, and decode the PNG in the browser that took
  it. Any thin-line contrast claim in this wave (MRK-*, ACC-FIVE's painted-line law) should use it
  rather than depth-of-change sampling.
- **The runtime-token ablation** used in §2.2: move the published scalar on the root at runtime and
  watch the painted hue/ratio drift. It is a three-line, read-only born-RED for any design that
  duplicates a CSS scalar in TypeScript.
- **The π negative control**: run the census head-against-head first. On this product an unclassed
  hand-drawn `<path>` is re-seeded per load and will read ~1000px of noise; filter to classed
  elements and the floor is 0px.
