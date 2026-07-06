"""Shared `slowapi` `Limiter` instance.

Split into its own module so both `main.py` (which registers it on
`app.state` and wires the exception handler) and the game router modules
(which apply `@limiter.limit(...)` to individual routes) can import it
without an `app.main` <-> `app.games.sudoku.router` import cycle.
"""

from __future__ import annotations

from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
