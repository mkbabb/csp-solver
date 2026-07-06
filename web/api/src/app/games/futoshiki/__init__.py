"""Futoshiki game package — skeleton only, W10-gated.

Intentionally empty of router/service/models: Futoshiki's API surface
(mirroring `games/sudoku/{router,service,models}.py`) lands in W10 once the
Rust `puzzles/futoshiki/generate.rs` uniqueness-checking generator is built.
The package exists now so W10 adds one directory's worth of files without
touching `games/sudoku/` — the whole point of the per-game colocation seam.
"""
