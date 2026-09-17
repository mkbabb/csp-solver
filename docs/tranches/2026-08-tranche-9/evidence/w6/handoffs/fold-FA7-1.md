> **SPENT 2026-09-17, by the chair seal (lane S1).** Same three rows, same file: cured by landing fold-FA2-1's re-cut predicate and one-string row — the ribbon's `Choose keep, or <verb>.` is the intended copy, so the gate moved and `GameGallery.vue` did not (`../../w3/seal/S1-01`…`S1-07`).

> **NOT LANDED 2026-09-17** — same three rows as fold-FA2-1 (w3), same file, same fence problem: `src/pencil/chrome/GameGallery/GameGallery.a11y.test.ts` is outside the Restamp lane's fence. Confirmed still RED at the fold close, and confirmed NOT FA7's: the open question this file raises (is the new alert copy intended?) is answered YES by FA2's landing of 3C-2 — the ribbon now says `Choose keep, or deal.` on purpose, so the cure is the unit twin re-cut in fold-FA2-1, not a revert.

# fold-FA7-1 — `GameGallery.a11y.test.ts` is RED at the fold tree: the guard's alert copy moved and its rows did not

Out of lane FA7's fence twice over — `GameGallery.a11y.test.ts` and `GameGallery.vue` both belong
to another lane — and it is the ONLY red in the unit battery, so it will be the first thing the
chair's own run shows.

## The state, measured

`npx vitest run` from `web/frontend` at the fold tree:

```
Test Files  1 failed | 65 passed (66)
     Tests  3 failed | 807 passed (810)
```

The one failing FILE is `src/pencil/chrome/GameGallery/GameGallery.a11y.test.ts`. Read the "Test
Files" line, not "Tests" — three rows, one file.

**It is NOT this lane's.** Verified by ablation: with `useCarouselGlide.ts` restored to its
pristine copy (`git show HEAD:…`) and nothing else changed, the same file fails the same three
rows, `3 failed | 14 passed (17)`.

## The three rows and what each one says

1. `the destructive-work guard speaks — 3.2 > arming utters the guard's own name into an
   ASSERTIVE region` (`:126`)
   `the armed guard was never announced; live regions said ["sudoku, 1 of 2. 3 easy, new
   game","Choose keep, or switch."]`
2. `the destructive-work guard speaks — 3.2 > returns focus to the listbox when the ribbon
   retires` (`:195`) — `expected true to be false`
3. `ONE name, drawn and spoken — the one-string rule > the utterance is built from that same
   name, so copy can never drift out of it` (`:244`)
   `expected 'choose keep, or deal.' to contain 'deal a new board?'`

## The seam

Row 3 names it exactly. The rows assert the ONE-STRING RULE: the alert region's utterance must
CONTAIN the ribbon's drawn title, so the spoken name and the drawn name cannot drift apart. At
this tree `.guard-note-title` still draws `deal a new board?` / `switch this shared board to
futoshiki?` (`GameGallery.deck.test.ts`'s M13 rows pass on exactly those strings), while the
`role="alert"` region now says `Choose keep, or deal.` / `Choose keep, or switch.` — a sentence
about the CHOICE rather than the name.

So the drawn half and the spoken half of the ribbon are now two different sentences, and rows 1
and 3 are the rule catching it. Row 2 is the focus-return arm on the same ribbon and rides the
same change.

## What this handoff does NOT decide

Whether the new alert copy is the intended W3 product copy (in which case the three rows want
re-cutting against it, and the one-string rule wants re-stating over whatever the new pair is) or
whether the utterance lost the name by accident (in which case `GameGallery.vue` is what moves).
Both halves are outside this fence and the answer is the owning lane's. What is certain is that
the two halves disagree TODAY and the gate is telling the truth about it.

Whoever takes it: `check-live-regions.mjs` and the M16 copy register both have opinions about the
alert's text, so land the decision with its policed form in the same commit.
