# games/futoshiki

The second game (W10, owner-committed): 4x4-7x7 Latin squares with printed
inequality carets. Same shape as `games/sudoku` — own Worker solve path
(`solver.worker.ts` + `useSolver`, `board_size` on the wire, never `size`),
own control panel; no `Difficulty` (v1 ships one high-density tier). Carets are `aria-hidden`
decoration — the constraint folds into both adjacent cells' labels.
Never imports `games/sudoku/**` (ESLint-enforced).
