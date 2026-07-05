# `games/futoshiki/` — planned skeleton (W10 fills this)

This directory is the **reserved home** for the Futoshiki game layer. It is intentionally
empty of code as of W7 (frontend topology): W7's job was to land the `pencil/` + `games/`
topology so Futoshiki targets these paths with **zero further renaming** (the F8 forcing
function, answered proactively). W10 (Futoshiki) fills it in.

Planned structure (per `fe-colocation-manifest.md §1.3`; not yet built):

```
games/futoshiki/
├── types.ts                              # own shape — board_size, NO Difficulty, inequalities
├── FutoshikiBoard/
│   ├── FutoshikiBoard.vue                # ~90% of SudokuBoard.vue; reuses @pencil/grid/gridPaths
│   ├── FutoshikiCell/
│   │   └── FutoshikiCell.vue
│   └── FutoshikiCaret/
│       └── FutoshikiCaret.vue            # sibling to FutoshikiCell/, wraps @pencil/glyph
├── ControlPanel/
│   ├── ControlPanel.vue                  # own file — games never import each other
│   └── constants.ts                      # board_size options only, no difficulty
└── composables/
    ├── useFutoshiki.ts
    ├── useApi.ts                         # own endpoints (GET /futoshiki/random/{board_size})
    └── useUrlState.ts
```

Boundary rules already enforced (`eslint.config.js`): `games/futoshiki/**` must not import
`games/sudoku/**` (and vice-versa); both may import `@pencil/*`, never the reverse.
