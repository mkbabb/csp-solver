# CH-69 — the mechanism, named

**Lane:** T9-W6 substrate · **Date:** 2026-08-28 · **Estate:** `csp-solver/` only

## One sentence

`solver/gac.rs` built the Régin residual graph with unmatched edges oriented
var→val and matched edges val→var, then seeded its free-vertex walk with the
**free values** — which have no out-arc at all in that orientation — so the
"even alternating path from a free vertex" rescue never ran, and every unmatched
edge to a matched value outside its variable's SCC was pruned even when an
alternative maximum matching supported it.

## Why the estate lived with it for four tranches

The over-prune cannot bite a **square** scope: one where the live value universe
is exactly as large as the participant count, so a maximum matching covers every
value and no free vertex exists. Every all-different the engine shipped until
Killer is square:

| scope | participants | live values | free values |
|---|---|---|---|
| sudoku / futoshiki / thermo row, column, box | 9 − k unassigned | 9 − k (the assigned singletons' values are excluded from the graph) | 0 |
| a Killer **cage** (2–4 cells) | up to 4 | up to 9 | up to 5 |

So the defect entered the estate with the cage all-different (`puzzles/killer/csp.rs`
adds one `AllDifferent` per cage of ≥2 cells) and stayed invisible to the whole
sudoku-shaped test battery. `AllDifferentExcept` and the assignment builder are
value-slack by construction and were exposed too.

Two further facts kept it hidden. The `Pruning::None` control that seemed to
exonerate the propagators proves nothing: GAC rides inside
`AllDifferent::revise_impl`, which the AC-3 **root** fixpoint calls regardless of
the search-time pruning mode. And the failure is a silent over-prune, not a
crash — the solver returns a confident, well-formed zero.

## The shape, minimal

Three variables `A={1,2} B={1,3} C={1,4}`; nothing here is prunable, since every
value sits in some solution. Take the maximum matching `A-1, B-3, C-4`; value 2
is free. Edge `(B,1)` should survive: `A` shifts onto the free 2 and releases 1.
The walk that proves it is `2 → A → 1` — a free value, the unmatched edge into
its variable, then that variable's matched edge out. In the shipped orientation
node 2's residual row is empty, the walk dies at the seed, `SCC(B) ≠ SCC(1)`, and
1 is removed from both `B` and `C`.

Banked pre-cure, `tests/gac_kernel_beats.rs::p7`: **2,013 of 3,676** satisfiable
random slack-bearing scopes disagreed with the brute-force support.

## The cure

`solver/gac.rs`, at the reachability section. The two kinds of free vertex need
the residual graph the two ways round and one graph cannot serve both:

* a path out of a free **variable** (the sentinel variant's escape) leaves each
  variable on an unmatched edge — it runs along `res_adj` and justifies the edges
  leaving a reachable VARIABLE;
* a path out of a free **value** enters each variable on an unmatched edge and
  leaves on the matched one — it runs along the **transpose** and justifies the
  edges entering a reachable VALUE.

So: keep the existing walk for free variables but read it at the variable end,
and add the transposed walk for free values. `Csr::transpose_of`
(`solver/gac/matching.rs`) builds the reversed graph by counting sort into pooled
scratch, and is built **only when a free value exists** — a square scope, i.e.
the whole sudoku hot path, pays exactly nothing and its pruning is unchanged
byte for byte. SCCs are orientation-invariant, so Tarjan still runs on `res_adj`
alone.

The keep-test becomes `same SCC || val_reach[value] || reachable[variable]`.

## The cure is the real criterion, not blanket over-keeping

Keeping edges is always the *safe* direction, so a cure that merely keeps more
would flip the repro while leaving the propagator weak. `p7` asserts equality
with the brute-force support in **both** directions across 4,000 random scopes:
no supported value pruned (soundness) **and** no unsupported value kept
(completeness). Régin GAC is domain-complete for all-different, and post-cure it
is again, exactly.

## Blast radius

`AllDifferent` (killer cages, and any future slack-bearing scope),
`AllDifferentExcept`, and the assignment/LAP builder that rides it. Sudoku,
futoshiki, and thermo are untouched — their scopes are square, the transpose is
never built, and `p5_bnb_node_counts_frozen` (the re-baseline lock) still holds
its frozen counts.
