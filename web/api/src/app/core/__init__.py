"""Cross-cutting, app-global concerns shared by every game package.

Per the backend colocation manifest (§3.4): `core/` holds only the
module/global-level items the recursive-colocation edict explicitly
carves out of per-game packages — centralized `Settings`, the split
thread-pool `Executors`, the one JSON error envelope + taxonomy, and the
shared `slowapi` `Limiter`. Nothing puzzle-specific lives here.
"""
