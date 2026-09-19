# PASS-2 CHARTER · PLR-PLACE · The seating chart

Section: §11 the player mark (icon · lobby) · §12 · M14
Lane port: 127.0.0.1:4243 (`--strictPort`; next free in 4230–4249 if held; private vite `cacheDir`)
Worktree: `.claude/worktrees/wf_e58b4764-0fc-48` (your pass-1 diff stands; nothing committed)
Evidence dir: `docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/<stage>/PLR-PLACE/`
Pass-1 record: `pass1/critique/PLR-PLACE.md` (read `logs/critic2/3/5-*.json` first: `.chart-self` absent under every real press), `pass1/prototype/PLR-PLACE/README.md`

## The task

Pass 2 of the T9-W7 loop for ONE family, under a RETIRE TRIGGER. Close the rows below on
the real surface, both engines, through REAL presses (never `el.click()` inside
`page.evaluate`). Do not design around any other family; do not close a mark (U-10).

## The retire trigger

The family's memorable thing is the reader's own seat on the chart. Under a real press it
does not exist: opening the sign takes focus off the grid, `GameBoard.vue:474–476` calls
`noteFocus(null)`, `useSession.ts:986` nulls `selfCursor`, and `.chart-self` is absent in
every arm both engines—and the same seam publishes `cur {p:null}` so every peer's ghost of
you goes 1→0 the instant you look at your own chart. By the end of pass 2 the self ring
must paint under a real press in both engines WITHOUT the sheet's opening publishing a
null cursor to the room, or the family RETIRES: a seating chart that cannot show the
reader's own seat is the peers' chart, which is PLR-COUNT's register with dots.

## The idea (unchanged)

Presence is a PLACE: a miniature of the board's own frame with a dot per peer at their
`cur` cell; the lobby is the miniature at readable size with names beside it; solo = an
empty frame. What held under the critic: dots/frame/subgrid ≥3:1 on an independent byte
decode, filterBudget 9 in four scenes, pi 0.00 on twelve selectors both engines,
`WASH.placeSettleMs` 469.8→2.9 moves/min, `useBoardShape` as a clean seam.

## What pass 2 must close

1. The trigger above: a self position that survives leaving the grid; G2's ring arm
   re-run through a real press; every chart crop re-taken through a real press.
2. **Enter does not open the sheet** (`@keydown.enter.stop=toggle` beside the native
   click); delete the handler; add an Enter arm to r0 I3 and G6 (both pressed with the
   mouse only).
3. **The sheet has no exit but an outside click**: no Escape, no close on focus-leave, 0
   focusable elements, no role or accessible name. Give it Escape and close-on-focus-leave
   or write the reason it has neither.
4. **G8 fails its own ±4px band and is recorded MEASURED**: the SOLO sheet (zero rows) is
   85.1px over the grid at 390×664 and 73.3px over the board group at 390×844. Re-cut as
   viewport-height × row-count with a band the design holds.
5. **At 390×664 the solo sheet steals 12 of 81 cells' taps** and a tap there does nothing
   (`@click.stop` swallows it without dismissing). The phone arm needs a dismissal a reader
   can find from inside the sheet.
6. **AA on the phone's real ground** (`--color-popover` at 80% over the wordmark and the
   board's digits): measure dots, rules and names there, or make the phone arm opaque.
7. **PlayerLobby's `inkFor ?? var(--color-user-ink)`** paints an unknown peer in YOUR blue.
   Replace the fallback with something that cannot collide.
8. **Attribution past four is a declaration**: state what a reader at N=15 does with
   fifteen dots and four names, or change the mechanism.
9. **Two head disclosures open at once, overlapping 151 of 169.1px**: take PLR-SELF's
   `headDisclosures` registry.
10. **The declared 150ms sheet transition is unimplemented** (v-if mounts same-frame):
    implement or delete the motion row.
11. **Three e2e sites read `.player-swatch`** (join-language:175, multiplayer:193/:580)—
    see the coupling. **`useJoinWash`'s `arriving`/`departing`/`rowArmMs`** have no
    product reader; prune or name.
12. **The lobby's drawn strings match no `check-font-coverage` derive**: add a lobby
    derive with the cut. **The 16×16 arm** (pitch 6px, r 2.5) screenshotted and measured
    or withdrawn.
13. **G1's webkit miss (40.6 vs ≤40)**: cure with the settle (800ms reads identically on
    the SLOW arm), never by moving the gate.
14. **`shown`/`hidden` beside `Off`/`On`**: one register is wrong; propose which.
15. **The +32.83px phone controls-card delta did not reproduce drawer-shut**: re-run
    drawer-open and drawer-shut and declare which condition owns it.

## Grafts to take

- PLR-SELF's head-disclosure registry (written, next door).
- PLR-COUNT's `useTallyStrokes` if a dot ever becomes a stroke; the SET RULE.
- The cells-stolen probe (elementFromPoint over each covered cell + "does a tap dismiss")
  is YOURS to bank for every overlay that lands on the board.
- The programmatic-click trap is YOURS to hand on: every W7 paint rig that opens with
  `el.click()` in `page.evaluate` measures a state no reader can reach.

## Couplings to state, not resolve

You are on F1's "the board keeps your blue" side. `.player-swatch`: you deleted it and
PLR-SELF kept it; the section settles it once in pass 2 (the swatch stays until the
instruments are re-pointed in the same diff)—state your side.

## Constraints that bind

M16; filterBudget 9 exact with the sign and the open chart; AA both themes on the real
ground; pi on unclaimed surfaces (webkit arm of the rect census too); R6 at `r0/`; W2's
landed mechanics (the sheet ignores the dock/bottom-tab grammar while covering the
board—say so); settle the dock ~700ms; M19. Text-first, ≤4 crops ≤150 KB. `r0/`
read-only; re-point any r0 probe's `OUT` first.
