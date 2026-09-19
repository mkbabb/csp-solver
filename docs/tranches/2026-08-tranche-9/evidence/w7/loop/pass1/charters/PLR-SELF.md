# PASS-2 CHARTER · PLR-SELF · Your mark, in your ink

Section: §11 the player mark (icon · lobby) · §12 · M14
Lane port: 127.0.0.1:4241 (`--strictPort`; next free in 4230–4249 if held; private vite `cacheDir`)
Worktree: `.claude/worktrees/wf_e58b4764-0fc-46` (your pass-1 diff stands; nothing committed)
Evidence dir: `docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/<stage>/PLR-SELF/`
Pass-1 record: `pass1/critique/PLR-SELF.md`, `pass1/prototype/PLR-SELF/README.md`

## The task

Pass 2 of the T9-W7 loop for ONE family. Close the rows below on the real surface, both
engines, with instruments that can fail—a KEYBOARD gate first; take the grafts; re-run
every gate bare. Do not design around any other family; do not close a mark (U-10).

## The idea (unchanged)

The mark is YOU—one object in your room ink (your pass-1 build is the drawn crayon
STUB, graphite at rest, always present); pressed, it opens a small sheet in the @mbabb
card's pose listing everyone in their inks; F1: your page paints you the colour the room
paints you, so colour on your own mark means someone else is here. The central claim
reproduces cold (mark colour == self row ink == stub fill == `oklch(0.5 0.11 0)`, both
engines); AA is earned off the compositor; the head-disclosure registry is a real
primitive; the roster loses its pixels and keeps its office.

## What pass 2 must close

1. **Enter does not operate the mark in either direction** (`@keydown.enter.stop="toggle"`
   on a `<button>` whose native Enter already fires click: one Enter toggles twice, nets
   zero; Space opens; Enter while open leaves it open). Delete the handler; the click
   contract carries it. **Escape does not dismiss** and nothing listens
   (`App.vue:773 onGlobalKeydown` handles only `g`). Bind it. **A born-RED keyboard gate
   beside G3**: Tab reaches the mark, Enter opens, Enter closes, Escape closes, focus
   stays on the mark. No gate in §9 touched a key, which is why 2.1 and 2.2 were green.
2. **The hover lift erases the family's one sentence**: `.player-mark:hover` is declared
   after `.is-live` at equal specificity, so a live mark under a fine pointer paints
   graphite (measured rgb(38,38,38) hovered, `oklch(0.5 0.11 0)` the instant the pointer
   parks away)—off exactly when a mouse user reaches for it. The lift stops being `color`
   on a live mark, or the inversion is stated and accepted. Then ONE CROP with the pointer
   parked off a live mark and the sheet open, so a reader can see the mark and the self
   row are one colour (no pass-1 frame shows it).
3. **The gallery deck's self swatch moves undeclared**: `.game-card-swatch`
   (GameCard.vue:363) binds `session?.players`, so F1 repaints your own dot from #2563eb
   to the walk ink (measured `oklch(0.5 0.11 0)` on the gallery with a room). G1 hashed 24
   cells on a SOLO board. Declare with a frame or scope.
4. **"Live regions: three, as before" is false** (HEAD and the prototype both measure SIX:
   margin-note, board-voice, players-status, players-roster, players-alone, copy-status)
   and it ships in a product comment and in spec §3.4. Reconcile; G6 pins the six-node
   ROLL, not a count derived from the tree under test.
5. **Substrate orphaned**: `useJoinWash`'s `arriving`/`departing` have zero product readers
   after the roster's choreography dies (join-language-prm.spec.ts now asserts an absence
   vacuously) while the 740ms hold and the classification still run. Prune or name the
   reader.
6. **BoardHost.vue:75's `if (!ink) continue`** was the belt excluding SELF from the
   peer-cursor ghost; self's ink is now always defined; nothing breaks only because
   `peerCursors` is keyed by the wire's `from`. Re-state the guard by id or retire the
   comment.
7. **The copy register never read your copy** (all five strings are script-side or a bound
   `:aria-label`). Hand-check against the 46-codepoint cut and propose the jargon arm that
   reads computed strings (MOVED, under `instruments/`).
8. **G8 refuted, no successor**: re-cut to the two measured bounds—sheet clears the sun
   (256 < 326), phone sheet clears the board (209.3 < 221.7). **r0's I3 cannot pass or fail**
   (two AttributionCard instances → two `[data-lobby]`): propose `:visible` in the
   instrument or one lobby for two marks; choose and say which.
9. **Two unit rows** (liveRegions.test.ts:209, :221) re-cut in the cure's commit; the five
   roster-touching e2e specs run.
10. **The 400ms presence ink is proven at its endpoints only**: a mid-flight sample or a
    trace. **The coarse six-line budget has 12.4px of headroom** against the board: state
    what M01's raise-a-rung spends.
11. **The palette demand** (index 0, which the host always wears, 1.0° from
    `--color-solver-ink-1`; 37 collisions): hand it to PAL-TIN's charter row with the
    number and take whatever lands.

## Grafts to take

- PLR-COUNT's `useTallyStrokes` if the stub is ever a stroke; the SET RULE (re-arming one
  member never un-draws another).
- PLR-PLACE's critic: the FOCUSOUT SEAM—`GameBoard.onGridFocusout → noteFocus(null)` means
  pressing your mark tells the room you looked away and erases your own cursor. Measure it
  on your mark (both engines) and cure it or book it as a substrate row for all three.
- PLR-COUNT's critic: a translucent popover inherits the page as its ground—measure your
  sheet's text against the wordmark bleed (rgb 204 light / 61 dark), not the modal paper.
- ACC-FIVE's 40-index peer-hue sweep against every reserved arc, when it lands.
- The Enter double-toggle is estate-wide (AttributionCard carries it, masked by its
  focus-open): write it as a chronic-ledger row.

## Couplings to state, not resolve

You are on F1's "colour on your own hand means someone else is here" side, with
ACC-GRAPHITE. `.player-swatch`: you kept it (the instruments read the colour off it);
COUNT and PLACE deleted it. The section settles it once in pass 2: the swatch stays until
the instruments are re-pointed in the same diff—state your side.

## Constraints that bind

M16 (`only you`, never `just you`; no invented "connected" fact); filterBudget 9 exact with
the sheet open; AA both themes on the sheet's real ground; pi on unclaimed surfaces (the
gallery swatch is one); R6 at `r0/`; W2's landed mechanics; settle the dock ~700ms; M19
(a peer arriving never moves focus or opens a surface—G7 stays). Text-first, ≤4 crops
≤150 KB. `r0/` read-only; re-point any r0 probe's `OUT` first.
