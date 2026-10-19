# PROPOSED to the ONE glyph-pop (not banked) · `g5tol`

`glyph-pop.g5tol.diff` (on homes v2's `e2e/lib/glyph-pop.mjs` + `.d.mts`; `git apply --check` 0 on `74a2b5d9` +
`homes.diff`). The chair folds or strikes; this lane's bank does not depend on it.

- **The need.** Under `glyphGate({ control })` G3 is anchored and G4 tolerates the control's low columns one by one
  (`g4tol`), but G5 has no tolerance: where the control's own glyphs read under the floor (T9-R8, the hand's tag rung
  at light DPR 1), a consumer can only print G5 whole, which blinds it to a regression on that line.
- **The clause.** `glyphPopulation(…, { g5tolerate })` takes the CONTROL's `glyphCores`; glyph k under the floor is
  tolerated only where the control's glyph k is under the floor too AND this read is no worse than the control's by more
  than `G5_EPS` (0.05). By VALUE, never by index alone. `glyphGate({ control })` passes `control.glyphCores`;
  `GlyphControl` gains `glyphCores`; reads carry `g5Tolerated`. `GLYPH_CLAUSES` += `g5tol`.
- **The plant (self-test row, `#g-long`, both schemes, DPR 1 and 2):** HEAD12 read as the control (its leading glyphs
  low) → the same plant on the tree is tolerated (GREEN on G5, 5 glyphs tolerated); against the unplanted control → G5
  RED; a DEEPER fade of the same glyphs (8 % α) against the planted control → G5 RED (the by-value clause; an
  index tolerance would pass it).
- **Born-RED / sabotage:** `GLYPH_SABOTAGE=g5tol` reds the row (the tolerated read reds G5, which is homes v2's
  behaviour today).
