# PAL-WALK — pass-2 adversarial critique

Non-author. 2026-09-18. Read: the chair's rulings, the synthesis, the prototype README, the
whole diff in `.claude/worktrees/wf_8630d340-e56-59`, the three frames, r0's R6 census (law 22)
and both law probes. Re-measured: the whole painted census under my own implementation, both
engines; the real glyph's own pixels at dpr3, both engines; tier 1 bare and self-test; the unit
battery; the recut L6 and L1; check-copy-register; and the estate's default e2e suite.

My instruments and readings: `PAL-WALK-probe/` (server 127.0.0.1:4241, private vite cacheDir,
killed; scratch Playwright config in the scratchpad, never the estate's default). No crop of my
own — every finding below is a number or an exit code.

**Verdict: ADVANCE, with the ring row held out of the fold.** The colour law is converged and it
survived an independent re-derivation without moving a digit. The ring row is not: it lands a
value that a landed estate gate contradicts, it contradicts the comment in its own rule block,
and the new gate that prices it cannot see it. The self-binding half has no unit at all.

**Convergence: 78%.**

---

## 1. What I reproduced, and it all reproduced

I wrote my own census (`probe.mjs` — my own token collection, my own OKLab, my own ΔE and WCAG)
and ran it against the running product in both engines. Every figure the prototype banked came
back identical:

| row | my chromium | my webkit | prototype |
|---|---|---|---|
| nearest house ink, light, worst of 144 | 0.07164 at i=112 (`--color-solver-ink-3`) | identical | 0.0716 ✓ |
| nearest house ink, dark | 0.07088 at i=0 (`--color-crayon-rose`) | identical | 0.0709 ✓ |
| hands under 0.0764 | 5 light / 3 dark | identical | 5 / 3 ✓ |
| AA worst, light: background / card / popover | 7.098 / 7.270 / 7.164 (all i=35) | identical | 7.10 / 7.27 / 7.16 ✓ |
| AA worst, dark | 5.310 / 5.197 / 5.270 (all i=115) | identical | 5.31 / 5.20 / 5.27 ✓ |
| peer-vs-peer N=3/4/8/16 light | 0.0758 / 0.0758 / 0.0229 / 0.0084 | identical | ✓ |
| peer-vs-peer dark | 0.0762 / 0.0762 / 0.0226 / 0.0090 | identical | ✓ |
| chromatic declarations → arcs | 29 → 6 at ±13° | — | 29 → 6 ✓ |

Tier 1 bare: exit 0. Tier 1 `--self-test`: exit 0, four controls fire, including the rename pair
(`1 is BLIND to a rename that moves no hue`, `2 still reserves a RENAMED token's hue (27 hits)`).
`useSession.test.ts`: 35 passed. Recut L6: GREEN. L1 (filter population exactly 9): GREEN — which
closes the prototype's own gap 7, `filterBudget` is not merely inferred. `check-copy-register
--self-test`: exit 0. The walk over 144 emits 0 duplicate hues, minimum hue gap 0.69°, chroma
min 0.0749 / median 0.1047 / max 0.215 with 10 at the cap, mean 0.12434 (the prototype's 0.1243).

The 0.0016° defect the family's own tier 2 caught in its own pass-1 walk, and cured in the module
rather than in the gate, is the best single act in this return.

## 2. THE CONFIRMED BREAK — a landed gate is RED on this tree, both engines

`e2e/join-language-prm.spec.ts:153` reads the peer-cursor ring's opacity off a real cell through
the shipped cascade and asserts it:

```
expect(parseFloat(tier.opacity)).toBeCloseTo(0.55, 2);
```

On the prototype's tree it receives **0.8**. RED in chromium and RED in webkit
(`PAL-WALK-probe/join-language-prm-RED-both-engines.txt`). I then ran the estate's whole default
suite against the worktree: **264 passed, and exactly one in-scope spec failed — this one**. (The
sweep also shows `theme-bake-freshness` ×10 and `visual-golden` ×4, which belong to the
built-dist configs my scratch config did not hold out; they are my instrument's noise, not the
diff's.) The prototype's README lists `multiplayer.spec.ts` and the new spec among its censuses
and never ran the suite that owns this row.

This is the pass-1 lesson repeating one ruling down: the value moved and the gate that pins it
did not move in the same commit.

## 3. THE DECIDED HISTORY THE RING INVERTED, and the comment that still denies it

`gameCell.css:196-205` — the tier-4 block's own header, untouched by this diff:

> LIGHTER THAN YOURS, deliberately, on every axis a tier has: stroke 4 against tier 1's graphite
> 5 (a peer presses less hard than you do), **stroke-opacity 0.55** (present, never competing),
> fill 0.04 below tier 1's 0.06.

Tier 1 (`.cell-ghost-path`, hover/base) is `stroke-opacity: 0.65`. At 0.80 the peer's ring is
**more opaque than your own hover ring**, so the T8-W3 M1 rank "lighter than yours on every axis"
is false on the opacity axis, and the block states 0.55 thirty lines above the rule that now says
0.8. Two statements of one fact in one file, which is the exact drift the family's own tier-1
gate exists to abolish. The new comment at the declaration answers only the focus tier ("keyboard
focus keeps 7 and 0.9") and never meets tier 1.

The 1.4.11 finding that motivates the raise is sound and I do not dispute it. What is unconverged
is the ruling: either the ladder's opacity rank is restated (and the sentence rewritten), or tier
1 moves with it, or the ring buys its 3:1 on an axis the ladder does not rank. Nothing in the
return chooses.

## 4. THE GATE THAT CANNOT SEE THE THING IT PRICES

`e2e/peer-walk.spec.ts:194` hardcodes the number it is measuring:

```
const ringOpacity = 0.8;
...
const fill = paint(cardCss, inks[hand.i], 0.04);
```

Neither value is read from `.game-cell.is-peer-cursor .cell-ghost-path`. Revert `gameCell.css`
to 0.55 and this gate still reports 4.33 / 3.63 and passes. The only spec in the estate that
reads the real value is the one this diff leaves RED. So after this fold the ring's 3:1 claim has
**no gate on the product at all** — it has a gate on a constant the spec restates, which is the
spec-cites-itself shape the family names in its own gate prose.

The same shape, milder, in the AA row: the selection wash is reproduced as `--color-crayon-blue`
at a hardcoded `0.08` rather than read off `.cell-peer`.

## 5. THE PROXY AND THE SURFACE — measured, not asserted

Tier 3 paints each ink as an **opaque canvas fill**. The thing a reader sees is a 4.5-unit
anti-aliased stroke. I wrote the ink onto a real cell through the product's own keyboard path,
screenshot the cell at dpr3, and took the most chromatic pixel — the stroke's own core
(`probe2.mjs`, `real-glyph-vs-canvas.txt`). Both engines agree:

| index / theme | gate's canvas AA vs card | real glyph core AA | Δ |
|---|---|---|---|
| i=115 dark (the gate's worst) | 5.20 | **4.95** chromium / 4.96 webkit | −0.25 |
| i=0 dark | 5.32 | 4.97 / 5.01 | −0.33 |
| i=112 dark | 5.53 | 5.43 / 5.37 | −0.11 |
| i=112 light | 8.16 | 7.82 / 7.77 | −0.35 |
| i=115 light | 8.59 | 8.36 / 8.51 | −0.20 |

The floor still clears. But the dark margin the return reports as 0.70 over 4.5 is **0.45** on the
glyph, no index has been read on a painted glyph across all 144, and the family's own gap 4
already says dark has no room. The honest sentence is "4.95 measured on the stroke at the gate's
worst index", not 5.20.

(One caveat I owe the lane: my chroma-max selector picks the focus sketch, not the glyph, for the
two lowest-chroma hands — i=1 and i=35 read 0.1196 for the ring against the hand's own 0.079. The
five rows above are glyph reads; the teal rows are my instrument's limit, not a defect.)

## 6. THE HALF WITH NO UNIT

`grep` over `useSession.test.ts` finds **no** occurrence of `authored`, `bindSelfInk`,
`roomHasOthers`, or the invite press. The entire self-binding half of F1 — the thing the owner is
actually being asked about — rests on one painted probe on the DEV `?wire=local` arm, and that
probe was deleted from the diff after its run. U1/U2/U3 cover the wire rule; nothing covers the
rule that decides whether your own hand is bound.

Three specific holes inside it:

- **`authored()` cannot tell your digits from the inviter's.** It filters `values` for "not a
  given, not solver ink". A page opening an invite carrying `?board=` with the inviter's
  pre-invite digits claims them, stamps them `[0, self]`, and paints them in its own ink until
  the author's `st` replaces `ledger.clock` wholesale. The window is real and nothing measures it.
- **`adoptInk`'s doc overstates its own rule.** "an `st` from anybody else … cannot move the ones
  it has" — the code moves any id that is not yet in `inkAgreed`, so two successive non-author
  frames can re-ink an unagreed hand. Either the sentence says AGREED or the code refuses.
- **An epoch's author cannot correct itself.** Once agreed, `inkIndex[id]` beats `k` for the same
  author's later epochs (`fresh` only clears on an author change). That may be right; it is
  neither stated nor tested.

## 7. The gates ship with zero headroom, and §3 is about to move the sheet

`expect(r.underReference).toBeLessThanOrEqual(5)` is met at exactly **5** light.
`expect(r.nearest.dE).toBeGreaterThanOrEqual(0.07)` is met at **0.0709** dark — 0.0009 of room.
The family's own COUPLINGS section says the reserved set moves under §3 (ACC-FIVE/ACC-SIX
renames, a 30th hue at 192° taking the room 8→6). The tier-1 arcs re-derive themselves and will
survive that; tier 3's two thresholds will not. A sibling wave landing one chromatic token reds a
gate that has nothing to do with it, with no sentence saying what the lane should then do.

Two lesser shapes in the same family:

- The capacity assertions are **upper** bounds (`near(8) < 0.05`, `near(16) < 0.02`). A later
  design that improves separation reds them. Pinning the honest number is right; pinning it as a
  ceiling means an improvement must edit the gate, and nothing says so.
- Tier 1's check 2 **re-implements** the walk instead of importing it, and the return's own
  born-red table admits `STEP = 0.5` leaves that row green. The row asserts a property of a
  formula that lives only inside the gate. Tier 2 does carry the real law (outside every ±13° arc
  implies ≥13° from every reserved hue), so the estate is covered — but check 2 is a decoy in
  the checklist's sense and should say so or import.

## 8. The claim the numbers do not quite support

`index.css` and the module header both say the closest hand keeps "the distance the house's own
two nearest crayons keep from each other (0.0764)". The measured distances are 0.0716 and
0.0709 — 6% and 7% short — and 5 light / 3 dark hands sit under the reference outright. The
parenthetical prints the true numbers, so nothing is hidden; the sentence around it still asserts
an equality the measurement denies. House law is that a claim is re-derived at its citation.

## 9. The gestalt nobody looked at

The owner's U-10 question is "do four hands read as four people". The three banked crops are two
ring shots and one **pair** of adjacent cells. Nothing in this pass shows four hands on one board,
or eight, which is the picture the sentence in the module header is asking the owner to rule on.
Related and unstated: the chroma spread across the walk is **2.9×** (min 0.0749 at i=4, median
0.1047, cap 0.215 reached by 10 of 144). Hand 1 at 0.0790 is a pale teal beside hand 0's full
red. ΔE says they are separable; nothing says whether the pale ones still read as a colour rather
than a tired grey, and no frame shows it.

## 10. Checklist, item by item

| item | verdict |
|---|---|
| vacuous convergence | mostly clear — tier 1 check 2 is the one row that cannot fail from a module change (§7) |
| spec-cites-itself circularity | **HIT** — the ring row measures a constant the spec restates (§4) |
| gates that cannot fail | **HIT** — nothing in the estate will red if `gameCell.css` returns to 0.55 (§4) |
| the elegant-reduction trap | clear — the wire rule and the walk are both finished, not deferred |
| legacy aliases | clear — the flat 0.11, the 137.5° step and the name-list regex are deleted, not renamed |
| masked fallbacks | minor — `SessionSource.authored?.()` optional means an arm that forgets it leaves the solo era uncoloured with no gate (§6) |
| unverified gestalt | **HIT** — four hands together were never looked at; the chroma spread is unreported (§9) |
| consumer-less substrate | clear — `RESERVED_ARCS` is exported and consumed by tier 2 |
| the generic default | clear |
| the pixel it moves that it did not declare | **HIT** — the ring's alpha is declared in prose and left contradicting its own block header and a landed spec (§2, §3) |
| the constraint it forgot | **HIT** — T8-W3 M1's tier ladder (§3); `join-language-prm` (§2) |
| AA both themes | clear on the canvas proxy, re-derived by me; thinner on the glyph (§5) |
| filterBudget 9 | clear — L1 GREEN on this tree, hand-verified |
| M16 | clear — `check-copy-register --self-test` exit 0, no string minted |
| π on unclaimed surfaces | clear — no geometry moves anywhere in the diff; goldens 4/4 |
| W2's landed mechanics | clear — untouched |
| the decided history at r0/R6 | law 22 / L6 MOVED honestly with a firing negative control; T8-W3 M1's ladder is the one that was moved silently |

## 11. Strengths worth carrying whatever the owner rules

1. Every painted number reproduces exactly under an independent implementation in both engines.
   That is rarer than it should be and it is the thing that earns most of the 78.
2. Finding the reserved set **by measured chroma rather than by name**, with the rename pair of
   controls, is the correct cure for the 0.47° bite and it is self-tested.
3. Resolving every token through `getComputedStyle` per arm rather than a regex over the sheet —
   and printing the wrong number it replaced (0.0494, "a number about nobody").
4. Catching a 0.0016° violation in its own pass-1 walk and curing it in the module rather than
   loosening the gate.
5. Retiring the ±0.5° hue gate by **deletion with its reason written where its replacement
   lives**, instead of loosening it to pass.
6. The band's mechanism is stated once, in the units the claim is made in, with the count it
   moves (100/144 → 3/144 dark).

## 12. What would earn the rest

Nine sentences, each closable in one diff:

1. Move `join-language-prm.spec.ts:153` to 0.8 in the same commit as `gameCell.css:234`, or the
   ring does not land.
2. Re-cut the tier-4 block header so it states the ladder that now exists, and rule explicitly on
   the opacity rank against tier 1's 0.65.
3. Make `peer-walk.spec.ts` read `strokeOpacity` and `fillOpacity` off
   `.game-cell.is-peer-cursor .cell-ghost-path` through `getComputedStyle` instead of restating
   0.8 and 0.04.
4. Read the AA row on the painted glyph for at least the worst index per arm and report 4.95,
   not 5.20, as dark's worst.
5. Unit-cover `bindSelfInk` / `roomHasOthers` / the room-of-one condition, and
   `useGameState.authored()`.
6. Decide and test what `authored()` does with an invite's baked-in digits.
7. Say AGREED in `adoptInk`'s doc, or refuse an unagreed move from a non-author.
8. State what a lane does when §3 adds a chromatic token and tier 3's 0.07 / ≤5 red.
9. Show four hands on one board, both themes, and say what the 2.9× chroma spread looks like.
