# FA3 — THE HEAD READS IN PAINT ORDER · THE SWEEP COUNTS ITSELF · THE REGISTER READS NARRATION

T9 W3+W6 chair fold, lane FA3, 2026-09-17. Three W3 residues, all landed, each born-RED before
its cure and each proved at the surface a reader actually meets.

## 1 · 3D-1 — the phone head is read in the order it is painted

`AttributionCard mobile` moved out of `<main> > .board-group` and into the page root, between the
desktop card and `.corner-right` (`src/App.vue:803-814`). The `ref` and the `v-show` travelled
with the tag, so `closeAll` keeps its one owner and the gallery hides the badge exactly as before.

The defect was a READING ORDER, not a pixel: the page carries zero positive tabindex, so DOM order
is tab order, and the badge that paints on a phone was declared after the toggle it paints to the
left of. A desk read left-then-right; a phone read right-then-left.

**Gate** — `e2e/spoken-gallery.spec.ts`, "the head is read in the order it is painted, at every
width". DOM order against the painted rect, never a Tab walk: Playwright's WebKit honours macOS's
default keyboard access, so Tab never lands on a `<button>` at all and a Tab-walk row would
silently assert nothing in one of the two engines. The 1280×800 control is inside the same row.

| run | engines | verdict |
| --- | --- | --- |
| `FA3-3D1-born-RED.txt` | chromium + webkit | RED at 390×844, desk control green in the same row: `disagree: the badge is not first in the DOM and does paint first` |
| `FA3-3D1-CURED-both-engines.txt` | chromium + webkit | 2 passed |
| `FA3-spoken-gallery-both-engines.txt` | chromium + webkit | 16/16 on the whole file |

**π LAW** — `FA3-3D1-pi-zero-pixels.txt`. The zero-pixel claim was re-measured, not repeated: the
same tree read twice at 390×844 (the tag reverted by hand for the first reading), 658 elements,
**0 (signature, rect) pairs changed** in both engines, `scrollHeight` 844 on both sides, every one
of thirteen named landmarks box-identical. Negative control, a planted 10px margin on
`.board-group` in the same paint: 43 (chromium) / 123 (webkit) rects moved, six landmarks. Two
false instruments were discarded on the way and both are written down in that file — an
ordinal-keyed compare that scored 375/382 phantom moves (the celestial's unclassed `<g>`s
re-numbered by an earlier declaration), and a whole-page census confounded by the random deal.
`visual-regression` 24/24, `masthead-alignment` 12/12, `mobile-affordances` 20/20 including
"attribution opens on a single tap". **NO DELTA. NO GOLDEN RE-BASELINED.**

## 2 · the 3C residue — the sweep counts itself

`panel-3C.md` §3.5 finding 3 named one honest limit: the fill count was read off `animatingCells`,
the reveal WAVE, which four acts write — so the sweep had to be fenced off from the other three by
inference, and the cheapest fence ("more than one cell, because one cell is the hint's shape") was
not a fence but a SILENCE. A sweep forcing exactly one square said nothing.

The act is the source now. `useGameState.fillForced` writes `lastFill = { count, stamp }` — the
squares the sweep actually INKED (a detector may name a filled cell; the sweep skips it), stamped
monotonically because two sweeps of equal size are two events and an unchanged value announces
nothing. `GameModel` publishes it, `BoardHost` hands it down, `GameBoard.vue`'s voice watches THAT.
All three inferences die together, and the singular becomes speakable.

M16 register: `1 square filled` / `N squares filled`. Plain words, no dash, no jargon; the
register gate is green.

| run | verdict |
| --- | --- |
| `FA3-3C-lastFill-born-RED.txt` | 2 files, **8 rows RED** against the pre-cure tree |
| `FA3-3C-lastFill-CURED.txt` | 2 files, 20/20 green |
| `FA3-e2e-blast-radius.txt` | 55 passed / 1 skipped, both engines — including `spoken-controls.spec.ts`'s own "a forced fill says how many squares it filled" on the real path |

The row that used to enshrine the silence ("a one-cell reveal is the hint's shape") was re-cut
rather than deleted: it now says the WAVE alone is not the subject, which is the claim that is
actually true.

**Fence note** — the announce is not in `GameControlPanel.vue` (which only `emit`s `fill-forced`);
it is in `GameBoard.vue`, reading a prop `BoardHost.vue` maps. Those two crossed the written fence
and the crossing is documented, hunk for hunk, in `handoffs/fold-FA3-1.md`.
`GameControlPanel.vue` was not edited.

## 3 · 3A-3 §2 — the register reads narration

`check-copy-register.mjs`'s jargon arm gained the NARRATION CALLS. The rule is the class, not the
two sites: a composable whose whole office is putting words in front of a reader renders copy, so
every string literal in its ARGUMENTS is read as copy. The census rule is `NARRATION_CALLS`
(currently `["useLiveRegion"]`), read by `rendered()` beside the template-text, rendered-attribute
and `COPY_KEYS` arms, with a paren-balanced quote-aware `callArgs` so a `)` inside a string cannot
cut the copy in half. Spoken copy is copy; an ear is a reader.

The gap was MEASURED before it was closed, which is the only reason the cure is a cure and not a
tidy:

| run | verdict |
| --- | --- |
| `FA3-3A3-jargon-arm-HEAD-BLIND.txt` | `the solver is connecting…` planted in `GameControlPanel.vue:455`'s narration → **GATE GREEN, exit 0**. It shipped past the register. |
| `FA3-3A3-jargon-arm-plant-proof.txt` | same plant, arm landed → **RED**, `GameControlPanel.vue:455 [useLiveRegion()] "solver" (the machine's name)`, exit 1; restored → GREEN exit 0; `--self-test` 18/18 exit 0 |

Five new self-test controls carry both colours: narration jargon, a narration template literal, a
narration string carrying a close paren; and the two greens — an utterance region (`useLiveRegion()`
with no source) declaring no copy at its call, and plain English surviving. The plant site was
restored byte-identical (`diff -q` clean).

§1 of that handoff — the `web/frontend/README.md:53` scripts pin, 21 → 22 `.mjs` — is the Restamp
lane's and was deliberately left alone. No README, census stamp or SPEC_MANIFEST was touched here.

## Gates at lane end (`FA3-gates.txt`, all bare)

`vue-tsc --noEmit` 0 · `npm run typecheck:e2e` 0 · eslint 0 · prettier (pinned config, src and
scripts only, never `e2e/`) 0 · `check-copy-register.mjs` 0 · `--self-test` 0 ·
`check-live-regions.mjs` 0 (10 regions, 0 born speaking).

Unit battery: **64 files passed / 1 failed (65), 802 rows passed / 3 failed (805)**. The three reds
are `GameGallery.a11y.test.ts`, lane 3C-2's guard-arm seam in flight; that file imports
`GameGallery.vue` and `types.ts` only, neither of which this lane touched, and this lane's own two
files are 20/20. Earlier in the fold the same battery also showed two `useSession.test.ts` reds and
two `vue-tsc` `TS6133`s in `useSession.ts` (lane 3C-3's presence clock, mid-wiring); both cleared
under this lane while it worked, and `vue-tsc` is exit 0 at lane end.

## Counts this lane moves (the Restamp lane owns the stamps)

- unit test FILES **+1** — `src/games/shared/useGameState.fill.test.ts`.
- unit ROWS **+7** — 5 in that file, +2 net in `GameBoard.receipt.test.ts` (3 added, 1 re-cut in
  place). Observed totals at lane end: 65 files / 805 rows.
- e2e ROWS **+1 per project** — `spoken-gallery.spec.ts` goes 7 → 8 rows, 16 executed.
- `check-copy-register.mjs` jargon self-test controls 7 → 12; the lexicon is unchanged at 25
  entries and ADMITTED is unchanged at 2.
- live regions declared: unchanged at 10.
- No README pin, `census.stamp.json` or `SPEC_MANIFEST` was touched.
