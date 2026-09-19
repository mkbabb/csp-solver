# r0 R3-a — MOVED, not re-cut

T9-W7 pass 3 · MRK-ABS prototype. Nothing under `loop/r0/` was written. This file, and the
instrument beside it (`../probe/p3-k-window.mjs`), are the proposal; the r0 row stands as
banked until the wave folds.

## The row that moves

`r0/r3-marks/R3-census.md:55-57` and `:72-76` report σ under **window W1**: the chord between
the first and last sampled point of ONE path, RMS perpendicular residual, `n = 1` rule
(`probe/wobble.probe.ts:11`, `:42`, `:91`). Under W1 the census reads, in CSS px:

| board | grid σ (W1) | ring σ (W1) | grid ÷ ring |
|---|---|---|---|
| 4×4 | 1.031 | 0.138 | 7.5 |
| 9×9 | 1.443 | 0.092 | 15.7 |
| 16×16 | 0.631 | 0.077 | 8.2 |

## Why it moves, and to what

Two defects in W1, both of measurement and neither of the finding:

1. **The chord is not the line.** A wobbled rule's own chord tilts with its endpoints, so the
   residual is taken off a line the generator never drew. W4 takes the residual off each edge's
   NOMINAL coordinate — the line the generator was given.
2. **`n = 1`.** One rule is one draw of a random variable whose inter-rule spread on this board
   is itself `[0.437, 2.287]` (`R3-census.md:55-57`, `:72-76`). W4 pools every rule the board
   draws (n = 6 / 16 / 30 at 4×4 / 9×9 / 16×16, cell and subgrid) and all four edges of a ring.

**W4**: every edge, the middle 80% of its own arc, residual to that edge's nominal line, pooled;
ring and rule taken in ONE run of ONE instrument so the ratio is a ratio.

Read on the prototype (`../logs/k-window.txt`, board units):

| board | ring σ | rule σ | ratio (units) | ratio (px) |
|---|---|---|---|---|
| 4×4 | 2.4004 | 2.8101 | 0.854 | 0.657 |
| 9×9 | 2.3777 | 2.6320 | 0.903 | 0.695 |
| 16×16 | 2.4148 | 2.8265 | 0.854 | 0.657 |

The px ratio differs from the unit ratio because the ghost renders at `boardPx/1300` and the
grid at `boardPx/1000` — the 1.3 squeeze, which W1 never had to name because it never compared
the two in one window.

## The wash clause

`R3-census.md`'s fourth row reads the peer wash as "σ = 0 (CSS box)". That is not a reading of
the same quantity: the wash has no stroked edge, so it has no residual to take. The row is
proposed as **not applicable** rather than as a zero — a zero invites the inference that the
wash is a CAD artifact the wave should cure, and it is a filled box by design.

## What does NOT move

The finding. At HEAD the ring reads 7.9× below the grid's own band under W1 and 0.146 / 0.073 /
0.067 of the rule's σ under W4 — quieter under either window, in both engines. The cure the
census names is the cure the wave built.
