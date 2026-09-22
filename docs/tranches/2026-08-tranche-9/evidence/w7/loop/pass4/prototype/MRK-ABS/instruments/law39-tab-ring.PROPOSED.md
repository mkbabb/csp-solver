# Law 39 — the tab's dashed ring: REVERTED in the tree, deletion carried as PROPOSED

pass4 CHAIR-RULINGS §1.3 refused the pass-3 deletion of `.drawer-tab:focus-visible { outline: 2px
dashed currentColor; outline-offset: 3px }` as a lane's edit. The work tree carries law 39's form
again (byte-identical to `74a2b5d9`). The deletion is `law39-tab-ring-deletion.PROPOSED.diff`
(applies cleanly to the work tree, `git apply --check`); what replaces the dashed form under it is
the base token: `2px solid var(--ring-ink)` at `--focus-offset` 3px.

## Painted AA, both forms, same pixels, same run (`../logs/census-one-*.json`, home route, 1280×800,
fine pointer, keyboard modality; band read along each side's normal; ink must BE the computed
outline colour). WORST sample / samples under 3:1 of those that read as the ring.

| engine · theme | law 39 dashed `currentColor` | PROPOSED token form |
|---|---|---|
| chromium · light | 1.04 · 4/24 | 1.25 · 2/14 |
| chromium · dark | 1.26 · 2/23 | 2.17 · 2/17 |
| webkit · light | 3.38 · 0/23 | 3.88 · 0/14 |
| webkit · dark | 1.09 · 11/29 | 3.51 · 0/14 |

Left side: 0 samples in every arm (the board occludes it; pass-2's gap 1). A second run of the same
instrument read the token form at 2.43 / 4.34 (chromium light / dark) — the tab's ground moves
between runs (it rides the board's boiling edge), so the worst sample is not stable to ±0.1 here.

Reading: neither form clears 3:1 at every sample. The dashed near-black / near-white ink loses
where it crosses the board's own frame and the tab's drawn edge (same-luminance ink under it);
the token form loses fewer samples in three of four arms. That is the chair's (and §6's leader's)
evidence for the law-39 row, not this lane's ruling. The ring opacity §6's leader names is 0.95
(MRK-LIVE pass-4 README §1.9–1.10); the board-ring ledger in `index.css` is read at it.
