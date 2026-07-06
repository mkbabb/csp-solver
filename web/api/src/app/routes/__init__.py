"""Cross-cutting routes that belong to no single game.

`health` (liveness) and `config` (exposes selected `Settings` fields to the
frontend) are true global concerns, so they stay flat here rather than under
`games/` — matching the edict's "only module/global-level items in shared
dirs" carve-out.
"""
