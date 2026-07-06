# games/futoshiki — planned skeleton (W10 fills)

Reserved by W7's topology (fe-colocation-manifest §1.3): W10 lands
`types.ts`, `FutoshikiBoard/` (with `FutoshikiCell/` and sibling
`FutoshikiCaret/`), `ControlPanel/`, and `composables/` here with zero
further renaming. Games never import each other; the ESLint boundary
(sudoku↛futoshiki, futoshiki↛sudoku) is already enforced.
