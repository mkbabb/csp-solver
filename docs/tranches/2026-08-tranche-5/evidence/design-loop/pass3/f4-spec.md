# F4 — THE DEALER'S RITUAL · SPEC, RE-CUT FOR PASS 3

Supersedes `pass1/f4-spec.md` and the claims of `pass2/laneA-report.md`. Every number below is
measured on **one tree** — MAIN at `ca8bb001`, one build, one run — or it is struck. Struck
claims stay on the page with their refutation; nothing is quietly dropped.

---

## 0 · THE CENTER, AS THE STANDING RULING LEFT IT

The picker owns the **cross-game switch**. The everyday same-game re-deal lives in the **drawer**
and this family does not try to win it back — Lane A's own T1 measurement falsified that half
(2 taps in the drawer against 3 + a 1240ms fold in the picker), and the pass-2 registry banked
the falsification as a ruling.

So the slip's job is narrow and stateable in one line: **the card names the game, the slip names
the board, and one act carries both.**

---

## 1 · STRUCK CLAIMS

| claim | where it lived | why it is dead |
|---|---|---|
| "a shipped WebKit carousel defect — opening the picker while playing kenken centers thermo, in production, today" | `pass2/laneA-report.md` §4b, open item 3 | **RESULTS M5**: it does not reproduce on real MobileSafari. It is a Playwright-WebKit artefact — the programmatic glide races headless WebKit's own scroll-snap and `syncFromScroll` wins with a stale index. Standing traps ledger, not a product defect. This lane's own shot rig carries a bounded corrective loop and says so at the site (`rigA/shots.mjs`), because stepping blind would have shot the wrong card and blamed the band. |
| "the CSS reservation prevents a card-to-card shift" | pass-2 §4c | Measured at 0px of prevented shift; the content height is already card-invariant. The reserve is a cheap guarantee, not a cure. **Kept, restated as a guarantee.** |
| "the chips visibly snap to the saved board on `resume`" | the pass-3 work order's own second branch | The write happens, but `select` unmounts the deck in the same handler, so on the everyday path it **never paints**. Sold instead on the branch that IS delivered: the divergence is *printed* on the verb before the click. The snap earns its two lines only on the guard-armed path, where the band survives the click. Stated at the site and in the spec row. |
| "`board` flag counts user moves, not givens" | the work order, item 3 | Half-adopted, and the deviation is deliberate: **one flag cannot carry both truths.** `board` keeps the `canRestore`-isomorphic meaning (the `resume`/`start` verb needs "is there a board"); a second field `userMoves` carries the user-moves truth (the guard needs "is there work"). Two fields, two names, both gated. |
| "`canRestore` consults the ledger" | the work order, item 3 | **Not adopted.** `canRestore` is the game's own authoritative read of its own persisted board; the ledger is a cache derived *from* that. Wiring the cache into the authority inverts the dependency and gives the falsity a second place to live. `canRestore` gains exactly one clause — `!staged` — so a picker handoff is never dealt on top of a resurrected board. |

---

## 2 · THE FOUR BLOCKERS, CLOSED

### B1 · The target-board guard
`attemptDeal` consults **the TARGET id's ledger row** (`board && userMoves`), never `props.dirty`.
The pass-2 shape gated on the MOUNTED board, so a cross-game deal consulted the wrong ledger
entirely. The `d` hotkey calls the same `attemptDeal`, so it reaches the same ribbon; a bare `d`
cannot destroy a board. `aria-keyshortcuts="d"` on the listbox and on the verb — never rendered
ink, which would be a lie on touch. A no-ledger fallback arm (`props.dirty && same id`) can only
ever ADD a confirmation.

**GATE-1**: patched back to `props.dirty`, `gallery-deal.spec.ts` reds exactly its two guard rows
and nothing else. The gate also has a negative control of its own — an untouched target board
(givens only) deals straight through — so it is not asserting a constant.

### B2 · The safe verb, fused
- `saved.board === false` → **`start`**, and `start` **deals the staged pair**. With nothing to
  restore, the chips are the whole instruction; this is the branch that honours them outright.
- `saved.board === true` → **`resume`**, which restores the saved board and **prints the saved
  pair on the verb** — in ink (`.staging-sub`) and in `aria-label` — the moment the chips diverge
  from it. It is no longer silent, which was the defect.
- The picks are per-open component state, so a divergence **cannot outlive one visit** to the
  picker: every fresh open re-seeds the chips from the ledger. Gated as its own row.

### B3 · Cold-start truth
`backfillLedger(GAMES)` at boot, once: five `getItem` + `JSON.parse` of boards already on disk.
Missing rows only — the mounted game's live publish always wins over the debounced persist behind
it. Reads both persisted size field names (`size` / `boardSize`). At boot rather than on gallery
open because `?view=gallery` is a real entry and a deep link would otherwise render the deck
before the truth existed.

`userMoves` = non-zero cells that are not givens. Published live on
`[pendingSize, difficulty, boardGeneration, undoDepth]` — the exact set of instants either board
fact can change — with one O(cells) scan each time and no second deep `values` watch.

### B4 · Mark 4, by the RENDERED census
The hover filter the band's `OptionSelector`s were importing **no longer exists** — P1-W3 deleted
`.ctrl-btn:hover { filter: url(#wobble-heart) }` at source. The band inherits a chip with no
`url(#…)` on any state. Proven, not asserted:

| build · scene · engine | surfaces | HTML boxes | union raster area | control fires |
|---|---|---|---|---|
| base · gallery · chromium | 17 | 0 | 385,463 px² | ✓ |
| **treat · gallery · chromium** | **17** | **0** | **385,463 px²** | ✓ |
| base · gallery · webkit | 17 | 0 | 385,463 px² | ✓ |
| **treat · gallery · webkit** | **17** | **0** | **385,463 px²** | ✓ |
| base · board · both | 9 | 0 | 90,183 px² | ✓ |
| **treat · board · both** | **9** | **0** | **90,183 px²** | ✓ |

**Zero new filtered surfaces. Area growth exactly 0.** Built dist both sides (base = `dist-Bfinal`
at `18f92c26`), same counting rule as `filter-census.spec.ts` (own computed `filter` ≠ none AND
own computed `display` ≠ none), negative control = an injected filtered node, which fires in all
eight cells. Rig: `rigA/census.mjs`; raw: `rigA/census.json`.

The shipped `filter-census.spec.ts` censuses the **board** scene only, so for a picker surface it
is blind in precisely the way the grep was. That gap is banked as an infra row (§5) with the
derived population already in hand.

---

## 3 · THE VERB MODEL, DECIDED STRUCTURALLY

The M4 blind read has **no cold readers** and was not faked. The verb model is therefore settled on
structure, and the structural bar is the one the order names: *the destructive act must be visually
distinct AND ribbon-guarded.*

**Distinct** — `deal` carries the estate's own **die** (`DiceIcon`, the same mark the drawer's Deal
button has always worn) plus the guard ribbon's heavier ink. The safe verb carries **no mark at
all**. A glyph against no glyph survives greyscale, a small crop, a low-res render, and a reader
who can see neither border weight nor colour. Pass 2 rested this distinction on border weight
alone, which none of those four conditions preserve. **No new ink vocabulary was minted.**

**Guarded** — every path to a destructive deal (tap, `d`, and the ribbon's own confirm) runs
through `attemptDeal`, which arms the ribbon off the target's ledger row.

**Owner row, banked**: the M4 blind read itself — ≥4 uninstructed readers, captioned-free crops of
`shots-A/*-band-{start,resume,diverged}.png`, asked only "which of these two words will replace
your board?". Nothing in this lane grades it.

---

## 4 · WHAT IT COSTS

```
+1,703 / −16 over three commits (ca8bb001..7ad0f821^)
  useStagingBridge.ts   255 lines · ~143 code · 88 comment
  StagingBand.vue       300 lines · ~216 code · 59 comment
  gallery-deal.spec.ts  392 lines (12 rows)
  useStagingBridge.test 270 lines (17 rows)
bundle  index-*.js  230,913 → 238,351 B raw (+7,438) · 84,579 → 86,958 B gzip (+2,379)
```

662 of the 1,703 lines are tests. There is **no offsetting deletion** and none is claimed: the
drawer's staged zone stays, because §0's ruling is what keeps it.

---

## 5 · OPEN, BANKED HONESTLY

1. **The M4 blind read** — §3. Owner row; needs cold readers.
2. **The gallery-regime filter census is not a permanent gate.** The population is derived and in
   hand (17 surfaces = the board scene's 9 + `svg.handwritten-logo g.logo-pose` ×4 +
   `svg.poster-grid g` ×4; 0 HTML boxes; 385,463 px²). Folding it into `filterBudget.ts` +
   `filter-census.spec.ts` is a Lane-D-shaped infra ship, not a picker lane's, and the budget file
   did not need to move for this lane — the board population is byte-identical.
3. **81 board inputs live inside `role="option"`** — Wave C2's live-face projection teleports the
   ONE live board (and its drawer tab) into the centered card. Shipped, pre-existing, nobody's.
   This lane's own delta is **zero**, and the gate says so in that scope, with the reason at the
   site.
4. **Crayon tints dropped from the band's difficulty chips.** `colorClass` is scoped inside
   `GameControlPanel.vue`; adopting it needs the AA re-verify against `--color-card`. The band
   ships monochrome deliberately.
5. **Sudoku's first-deal difficulty is `randomDifficulty()`**, so its registry `default` is a
   staging seed, not a prediction. Unreachable in practice — sudoku is eager and always has a
   ledger row before the picker can open.
6. **The everyday re-deal's permanent home** is still the adjudicator's residue row (registry §2),
   and the drawer's staged zone stays until it is drawn.
