# 3C — THE PANEL SPEAKS (T9-W3 §3.1, §3.5, §3.6, §3.7)

> **RESIDUE SPENT 2026-09-17, by the chair fold (lane FA3).** §3.5's finding 3 named one honest
> limit — "a sweep that forces exactly one square is silent… the act-sourced count wants a model
> field" — and that field now exists. `useGameState.fillForced` writes `lastFill`
> (`{ count, stamp }`, the squares the sweep actually INKED, stamped so two equal sweeps are two
> acts); `GameModel` publishes it (`defineGame.ts`), `BoardHost` hands it down, and
> `GameBoard.vue`'s voice watches THAT. All three inferences die with it — the generation clause,
> the idle-solve clause and the size≥2 clause — and the singular is speakable:
> "1 square filled" / "N squares filled". Born-RED 8 rows across two files
> (`fold/FA3-3C-lastFill-born-RED.txt`), 20/20 green after
> (`fold/FA3-3C-lastFill-CURED.txt`); `e2e/spoken-controls.spec.ts`'s own "a forced fill says how
> many squares it filled" stays green on the real path, both engines. Nothing else in this record
> is superseded.

The P0 cured with the rule the estate had already written down, two silences given a channel
that draws nothing, and a name that stopped contradicting the word beside it. Zero pixels move,
measured against an instrument proved able to see a move.

## §3.1 — the occlusion law, extended to the paper (the P0)

`.play-controls` has carried `inert` under `ribbonCovered` since T7-W2, with the rule in prose
one line above it: **a control painted out end to end must not stay in the tab order or in the
AX tree.** It was applied to a four-button ribbon and not to the 81-cell board the same sheet
covers. The cure is that same rule, at the grid.

Measured at HEAD on this tree, both engines, sheet up (`panel-census-head.txt`):

| pose | covered / 81 chromium | covered / 81 webkit | focusable cells |
| --- | --- | --- | --- |
| 390×844 | 59 | 62 | **81** |
| 768×1024 | 47 | 46 | **81** |
| 820×1180 | 40 | 42 | **81** |

Sheet shut, 0 covered at all three — the instrument's own control. A Tab walk started inside the
risen sheet landed on **20** covered cells (`panel-born-red-e2e.txt`), and `.focus()` on a
covered empty cell took focus every time.

`GameBoard.vue`'s grid takes `:inert="boardCovered || undefined"`, on
`mobileDock && !drawerInert`. Three things about that predicate are load-bearing and each is
written at its site:

- **`mobileDock`, not `portraitDock`** — one predicate for every viewport class the sheet has,
  which since T9-W2 §2.2 is both orientations. It is deliberately NOT the same predicate as the
  panel's `ribbonCovered`, which stays portrait-gated for the reason the panel states: outside
  portrait the play verbs sit INSIDE the case the sheet carries, and an inert row there would be
  a live drawer's own undo button, deleted. Two regions, two coverage conditions, one rule.
- **`drawerInert`, not `drawerOpen`** — the panel's reason verbatim: the sheet covers the paper
  through the opening and closing glides too, and a half-covered board is the same defect
  measured mid-flight.
- **the GRID, never the shell** — the shell also holds the margin's status region and the
  board's own voice, and a deal made FROM the risen sheet (which is where Deal lives on the
  dock) must not be announced into a subtree no assistive technology reads. Pinned by its own
  unit row.

`undefined` and not `false`, so the attribute is ABSENT at rest — the estate's `GameCard.vue`
idiom verbatim, and what keeps every committed DOM snapshot byte-identical off the dock. That
half is the one a browser row would never notice, so it is the one the unit layer pins.

## §3.5 — the deal and the forced fill, spoken where they draw nothing

`freshBoardCopy` has returned `""` on every ordinary deal since T8-W6 M16 deleted the board
caption, and that is CORRECT: the caption was the mark's screenshotted exemplar and
`GameBoard.receipt.test.ts` guards its return "in either direction". What nobody priced is that
the deletion left no other channel, so a board arrived, changed under the reader, and was
announced by nobody.

**The caption does not come back.** The sentence goes to a second region — `.board-voice`,
`sr-only`, on 3A's `useLiveRegion` idiom — so the margin keeps saying nothing and the reader
gets told. Two regions rather than two tenants of one, for the reason the paper note is not the
margin: the margin is the page on the PUZZLE (hint, verdict, wipe); this is the page on the
BOARD (one arrived; this many squares were filled in for you).

Three findings that only came out of making it work, each now a row:

1. **Neither existing arm could carry it.** The givens 0→N watch fires on the first board only
   (a re-deal clears and refills inside one flush, so `prev` is the old count and never 0), and
   the generation arm returns early on any board that prints givens because its whole subject is
   the no-givens family's wipe receipt. A sudoku re-deal reached NEITHER. That is how "the deal
   is silent" survived every gate the margin has: the margin was right to stay blank, and
   nothing else was listening. The voice takes its own watch on the generation bump and reads
   the ACT off `dealt` — T7-W7's own discriminator, minted for exactly this ambiguity.
2. **A repeat is still an arrival.** Two easy boards dealt in a row produce the identical
   sentence, and writing a region the string it already holds is not a mutation — the §3.4 class
   arriving through repetition rather than through birth. The idiom's third clause answers it:
   the region empties first and writes on the next flush.
3. **The fill's count is read off the reveal wave.** `animatingCells` IS the sweep
   (`fillForced` hands it exactly the empties it inked), so three clauses separate it from the
   ref's three other writers: same generation (excludes the deal), `solveState` idle (excludes
   the solve, whose verdict the margin speaks), and more than one cell (a one-cell reveal is the
   hint's shape, and the hint speaks in the margin). The honest limit: a sweep that forces
   exactly one square is silent. The act-sourced count wants a model field, and that seam is
   written down rather than guessed at.

`BoardHost.vue` and `useGameState.ts` are UNTOUCHED, and that is the answer rather than a gap:
the deal names itself with `gridLabel`, which is already the grid's own accessible name, so the
arrival is named by the string the board is named by instead of a second description that can
drift from it. `freshBoardCopy` keeps its one surviving job (the corrupt-link sentence, which is
ink because it is news a reader cannot get anywhere else) and its `""` pin stays green.

Copy is M16-plain and `check-copy-register.mjs` passes: "new board. 9 by 9 sudoku, easy" —
two sentences rather than the spec's example em dash, which the register bans outright.

## §3.6 — the copy act reaches AT, and the name stops contradicting the label

Two defects, one root: the outcome was DRAWN and never SPOKEN. The washi and the sublabel are
both `aria-hidden`, so the only thing a screen reader could learn was the accessible NAME —
which flipped to "Link copied" for 1600ms while the sublabel under the same glyph still read
"Share". Two readers of one button, two answers. The FAILURE sentence, the one that matters
most and the one nobody exercises by accident, was unreachable by AT altogether.

One region and one predicate:

- `.copy-status`, one `role="status"` on the shared idiom, written by both acts (a reader
  presses one at a time; two regions would be two places to look).
- the name now rides `saysCoarse`, the SAME gate the sublabel rides, so name and label are one
  string source and cannot disagree by construction. Fine pointer: both hold the verb and the
  region does the talking. Coarse: both flip together. The failure sentence is not lost with the
  flip — it is what the region speaks, in full, at both pointer classes.

`GameControlPanel.test.ts`'s row "the accessible name still tracks the outcome at a fine
pointer" WAS the gate that enshrined the defect, and its own comment gave the reason: the name
is never drawn so it cannot be a second copy of anything, and a fine-pointer reader would
otherwise lose the outcome. The first half was false in fact; the second stopped being true the
moment the region landed. Re-cut into the two claims that are actually the design.

## §3.7 — three rows, three handoffs, and each says why

None of the three is in this lane's fence, and two of the three the fence mis-assigns to the
panel. Written down with the literal text to land rather than half-landed:

- **3C-2 · guard-arm double-speak** — it is `GameGallery.vue`'s destructive-work guard, not the
  panel's two-tap arm (that one is already single-voiced: the "sure?" sublabel is
  `aria-hidden` and only the name speaks). The alert region recites the alertdialog's own name
  and description back at a reader standing inside the dialog. The cure trims the region to the
  verbs; `e2e/a11y.spec.ts`'s `guardAnnounced` helper must move in the same commit or three rows
  red.
- **3C-3 · presence-timeout roster truth** — needs a heartbeat that does not exist.
  `useSession.ts:830` and `relayWire.ts:39` both write the lie down and name its owner. The
  existing 45s timer is a CURSOR clock armed by `cur` frames, so pruning the roster on it would
  evict a present, motionless reader — a row that lies about a live page in place of one that
  lies about a dead one.
- **3C-4 · coarse-pointer attribution** — it PAINTS, in a wave whose π law says it does not.
  The AX route already exists (the cell's own name, corrected by 3B this wave); what a touch
  reader lacks is a sighted affordance, which is W7 §6's. The seam is one fallback in
  `GameBoard.vue` and it is written out.

## π LAW — measured, and the instrument proved sighted

`panel-pi-ablation.txt`. The pre-cure DOM is reconstructed in the same browser, same paint: the
two `sr-only` regions are removed and the `inert` stripped, and rects are keyed by a STAMPED id
rather than by array index (an index compare scores every element after a removal as moved —
the first attempt did exactly that and read 219–847 phantom moves).

| pose | rects | no-op drift | ablated | **moved** | scrollHeight |
| --- | --- | --- | --- | --- | --- |
| desk 1280×800 | 1,178 | 0 | 2 | **0** | 800 → 800 |
| dock 390×844, sheet shut | 1,138 | 0 | 2 | **0** | 844 → 844 |
| dock 390×844, sheet up | 1,138 | 0 | 3 | **0** | 844 → 844 |

Both engines, all three states. The NEGATIVE CONTROL is a planted 10px margin on
`.board-margin`, which the same instrument counts as **3 moved rects on the desk and 578–671 on
the dock** — so a zero is a measurement, not a blindness. Committed goldens re-run unchanged
(`panel-goldens.txt`, 4/4) and `visual-regression` is 24/24. **No DELTA to declare. No golden
re-baselined.**

## Born-RED, and the ablations for what came after

- `panel-born-red-e2e.txt` — the lane's own spec against the PRE-CURE tree: **13 failed, 1
  skipped, 0 passed**, both engines. Every row red on a mechanism, each carrying its own control
  inside the run (the occlusion rows prove the probe finds the board LIVE with the sheet shut
  before asserting it dead with the sheet up).
- `panel-ablation-units.txt` — the unit rows were authored after the cure, so each is proved by
  removing the cure from the CURED tree: the grid's `inert` (1 red), the deal announce (3), the
  fill count (1), the un-gated name (1), the copy region (1) — then restored, 3 files / 50 rows
  green. Every ablation reds exactly the rows that pin it and nothing else.
- `panel-cured-green-e2e.txt` — 13 passed, 1 skipped, exit 0. The skip is
  `playwright.config.ts`'s recorded PW-WebKit clipboard-permission gap, cited at its own site.

## Greens, and the nine reds that are handoff 3C-1

`panel-unit-battery.txt`: **64 files / 790 rows**, zero failures. `panel-vue-tsc.txt`: exit 0.
eslint and prettier clean on all five src files (e2e untouched by prettier — it is in
`.prettierignore`). `check-copy-register.mjs` exit 0. `check-live-regions.mjs` exit 0, now **10
regions declared, 0 born speaking**.

`panel-e2e-blast-radius.txt`: 211 passed, **9 failed** — and the nine are exactly handoff 3C-1's
three seams, twice-engined where the file runs in both. `board-covisibility`, `drawer`,
`zone-grammar`, `a11y`, `viewport-law`, `sudoku-interaction`, `access`, `affordances` all green.

Two of those three specs open the dock sheet and then TAP A BOARD CELL — a gesture no reader can
make, because the finger lands on the sheet. They passed only because the covered board was
still live, which is the P0. The third focuses a covered cell on purpose and says so in its own
comment. All three are gates written against the defect.

**A note for the chair on the record.** The first full-suite run of this lane was taken while
another lane's edit to `GameGallery.vue` was mid-flight — the dev server served a tree whose
gallery threw `ReferenceError: Can't find variable: onBeforeUnmount` at setup, and 18 rows fell
out across `multiplayer`, `join-language`, `session-substrate`, `spoken-gallery` and more. That
run is not banked and none of those failures are this lane's. The re-run against the settled
tree is what `panel-e2e-blast-radius.txt` holds, and it reproduces at exactly nine.

## Counts the chair restamps

- unit test FILES +1 (`src/games/shared/GameBoard.occlusion.test.ts`); this lane's rows: +13
  net (occlusion 3, receipt 7, panel +4/−1). Observed totals at lane end: 64 files / 790 rows.
- e2e FILES +1 (`e2e/spoken-controls.spec.ts`), **7 rows per project** — 14 executed, 13 passed,
  1 skipped (the recorded WebKit clipboard gap).
- live regions declared 8 → 10 (3A's figure, moved by this lane's two).
