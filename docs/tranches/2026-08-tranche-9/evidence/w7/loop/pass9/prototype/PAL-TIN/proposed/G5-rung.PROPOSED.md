# PROPOSED (for the chair) · G5 under the T9-R8 rung, or a control-anchored G5

Filed by PAL-TIN pass 9. This is not code: it asks for a ruling, and no lane re-words a gate to pass (LAWS P7 §F).

## What happened

Homes v2's `glyph-pop.mjs` adds `G5core`. Each glyph's interior is read at p50, against
`lim = max(3.0, sliceRatio × the run's own core p95)`. PAL-TIN's §2b ran green under homes v1.

Under v2, every chromium DPR 1 product row and every name-arm row of §2b reds on G5, in both themes. WebKit DPR 1 is
GREEN. The full reading is in `../readings/btape-g5-head-on-head.txt`.

## Why this is the T9-R8 class and not a product loss

**The bound is relative to the ink's own strength.** A stronger ink raises its own G5 bar:

- The tree's dark name arms have core 2.9–3.5. They red glyphs at a `lim` of 4.6–5.2.
- HEAD's weaker inks have core 2.7–3.4. They clear the 3.00 floor on the same label.

**The reds are shared with HEAD.** Painted on its OWN label at chromium DPR 1, HEAD reds G5 in:

- 15 of 15 light rows;
- 5 of 5 dark rows at cell 8;
- 3 of 5 dark rows at cell 11 (where the tree is green 5 of 5).

**Exactly one row reds the tree while HEAD clears:** dark cell 12, pink (tree 2.941 red, HEAD i=4 2.986 ok). It is the
same pink loss B-TAPE already names on the core median (−0.045).

## Ask (one of)

- **(a) Extend the T9-R8 rung to G5 at chromium DPR 1.** The condition is the one G2 carries: G5 is excused only where
  HEAD's same-index ink, painted on HEAD's own label, also reds G5. Under that rule, dark cell 12 pink stays RED.
- **(b) Give G5 a control-anchored tolerance in the ONE library, as `g4tol` does for G4.** A glyph is tolerated only
  when the control's read of the same payload holds that glyph low. The plant is the COMB at 25 % on one glyph
  (`#g-long` G0COMB_a25), which must stay RED with the tolerance on.
