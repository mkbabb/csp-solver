"""Per-game feature packages, one directory per game.

Each game owns its `router.py` (thin HTTP layer), `service.py`
(orchestration), and `models.py` (request/response schemas) end-to-end, so
a new game is added as one directory without touching another's files. The
seam mirrors the frontend's `src/games/{sudoku,futoshiki}` layout.
"""
