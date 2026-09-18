# T9-W7 pass 2 — the chair's rulings

Made 2026-09-17 by the chair before batch 1 opens, on registry-v1 §6 and §7. Each ruling binds
every pass-2 lane; a lane that disagrees carries its objection in its return, not in its diff.
Numbers below are pass-1 readings (`pass1/critique/<id>.md`); none was re-measured here.

## §6.1 — the focus-ring token has one owner

Five families minted five answers to the focus-ring token in one pass (MRK-LIVE one value
4.19–4.38 on four grounds; MRK-ABS a dark alias of crayon-blue; ACC-FIVE a dark arm at 6.4;
ACC-SIX delete-and-replace; ACC-GRAPHITE delete).

RULING. §6 (marks) owns the token. The focus-ring row is STRUCK from every accent family's
pass-2 charter (ACC-GRAPHITE, ACC-FIVE, ACC-SIX); those lanes read the token, never write it,
and state in their return which of §6's candidate values their palette survives on. `--ring-ink`
(§3.5, the 50% foreground both themes) is CONSUMED by every §10 control lane—spent on every
control in the card, because WebKit's UA ring reads 2.147:1 on the chips—and is never re-minted;
its reconciliation with §6's token is a pass-3 row on the marks leader.

## §6.2 — FRAME_PAD is its own row

FRAME_PAD moves the frame 7.63 px on every board (ACC-FIVE declared it; ACC-SIX did not) and the
goldens are blind to it: a thin line's 7 px move sits under `maxDiffPixelRatio` 0.02.

RULING. No colour family carries the pads. FRAME_PAD is one row of its own with three parts,
landed together or not at all: one geometric assertion in viewBox units beside the bitmap
(born-RED against the move), one re-mint (darwin off a built dist, linux off the runner
artifact—never a local linux bake), one owner disposition. ACC-GRAPHITE's tally does not touch
the pads; ACC-FIVE and ACC-SIX ship their palette with FRAME_PAD at HEAD's value and cite this
ruling where their pass-1 diff moved it.

## §6.11 — the hint laminate is a ground wearing a mark

`.cell-because` (`gameCell.css:139`, node at `DigitCell.vue:273`) is one node doing two jobs: a
15% teacher-red BODY (`background`) and a 2 px inset RIM (`box-shadow`). The body is a ground—a
full-cell fill, geometrically the selection body's twin. MRK-WASH measured the two bodies
composed on your own selected cell at 13.10 L\* against 5.90 clean: the hint out-reads your
own hand on your own board, which inverts the decided rank (T8-W3 M1). The T4-W7 note that the
laminate "composes with the focus ring" was written for the ring, before the selection had a
body.

RULING. The laminate's BODY obeys the one-ground rank MRK-WASH stated—selection > peer cursor >
hint laminate > unit—and yields under the two grounds above it: on a cell that is selected or
carries a peer cursor, `.cell-because` paints NO fill. Its RIM is a mark, and stays: that is
what keeps the T4-W7 intent (the answer key still visibly points at the very cell you focused
to ask). The node is not removed—the `v-if` extension the critique proposed would take the rim
with the body—so the yield is a CSS state on the same rule that MRK-WASH's rank lives in:
`.game-cell:has(input:focus-visible) .cell-because, .game-cell.is-peer-cursor .cell-because
{ background: transparent }`.

Gates it lands with, born-RED:
1. Arm a hint, select a because-cell, read the cell's ground against bare card: HEAD reads
   13.10 L\*; green is the selection's own reading ±0.5 L\* (5.90 at HEAD's 0.08 body; re-read
   against whatever body §6's leader ships).
2. The rim on a selected because-cell reads ≥3:1 against the selection body (1.4.11); if 50%
   teacher-red fails on the 8% blue wash, the rim's opacity rises under selection the way the
   selection rim does under `prefers-contrast: more`—opacity, never width.
3. The one-ground rank has a unit test (MRK-WASH critique gap 6): `isPeer` with `isBecause` or
   a peer cursor renders no `.cell-peer`. The CSS half (body yield) is proven by gate 1 on the
   real surface, both engines.

OWNER: §6's leader (MRK-LIVE) carries the row in pass 2 with MRK-WASH's `v-if` rank and the unit
test in the same diff. MRK-ABS states in its return whether its dark alias changes gate 2's
reading. No colour family touches `.cell-because`.

## §7 — housekeeping, restated as law for every lane

- The record is frozen: nothing under `loop/r0/` or `loop/pass1/` is written. r0 instruments
  that bank to absolute r0 paths are copied and re-pointed first; an instrument whose SUBJECT a
  design moved is proposed as a diff under `pass2/<stage>/<id>/instruments/` and the r0 row is
  reported MOVED. No gate is re-worded to pass.
- Every dev server takes a private vite `cacheDir` (a scratch config that spreads the estate's,
  never a committed `vite.config.ts` change), binds 127.0.0.1 on the lane's charter port in
  4230–4249 with `--strictPort`, and is killed before the lane returns.
- At most four cited crops ≤150 KB per family per pass. Numbers and text first.
- Pass-1 prototypes are replayed from their pass-1 worktree diffs into fresh worktrees; the
  pass-1 worktrees are the pass-1 record and are not edited.
- The `.player-swatch` stays until the instruments that read it are re-pointed in the same diff
  (§6.8). filterBudget is EXACTLY 9 to R6 law 9 / L1; a lane that moves it re-cuts both in the
  same diff or ships a red instrument (§6.9).
