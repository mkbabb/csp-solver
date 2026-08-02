# games/futoshiki

The second game (W10, owner-committed): 4x4-7x7 Latin squares with printed
inequality carets. Same shape as `games/sudoku` — the ONE solver spine
(`@games/shared/solver/client` over the one Worker; `dim` is the board SIDE here, a Latin
family, never sudoku's subgrid root), own control panel; no `Difficulty` (v1 ships one high-density tier). Carets are `aria-hidden`
decoration — the constraint folds into both adjacent cells' labels.
Never imports `games/sudoku/**` (ESLint-enforced).
