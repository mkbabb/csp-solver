> **SPENT 2026-09-17, by the chair seal (lane S1).** Both seams landed verbatim in `GameGallery.a11y.test.ts`; the file reads 17 passed and the full battery `Test Files 66 passed (66)`, with the collateral row green on no edit of its own and the two `sayGuard` plants banked RED (`../seal/S1-01`…`S1-07`).

> **NOT LANDED 2026-09-17** — `src/pencil/chrome/GameGallery/GameGallery.a11y.test.ts` is outside the Restamp lane's fence too, and the three rows are STILL RED at the fold close (measured: `Test Files 1 failed | 65 passed (66) · Tests 3 failed | 807 passed (810)`). This is now BLOCKING: `check-unit-count.mjs --restamp` refuses a report that is not a clean census, so the unit floor cannot leave 661 against 810 executed (owes 689) until rows A and B below land. The literal replacement text in this file is unchanged and still applies.

# fold-FA2-1 → `web/frontend/src/pencil/chrome/GameGallery/GameGallery.a11y.test.ts` — the UNIT twin of the guard gate still demands the double-speak

**BLOCKING.** Lane FA2 landed 3C-2 (T9-W3 §3.7, the chair's TRIM ruling): the gallery's
destructive-work guard now says ONE thing into `.gallery-guard-live` — `Choose keep, or
<verb>.` — and the `alertdialog`'s name + description are the survivor. The e2e gate moved
with it (`e2e/a11y.spec.ts` `guardAnnounced` now reads the verb off `.guard-leave`, in FA2's
fence, landed). **3C-2 named only the e2e gate. There is a second, UNIT gate asserting the same
old contract, and it is out of FA2's fence.** Until the two seams below land, the unit battery
is RED: `Test Files 1 failed | 63 passed (64)`, `Tests 3 failed | 795 passed (798)`.

## The three reds, and which are real

Measured at the cured tree, `npx vitest run --silent=true
src/pencil/chrome/GameGallery/GameGallery.a11y.test.ts` → `Tests 3 failed | 14 passed (17)`:

1. `the destructive-work guard speaks — 3.2 > arming utters the guard's own name into an
   ASSERTIVE region` — REAL. Its `announced()` helper (`:104-115`) is a hand-copy of the e2e
   predicate and still keys off `aria-label`.
   `AssertionError: the armed guard was never announced; live regions said ["sudoku, 1 of 2.
   3 easy, new game","Choose keep, or switch."]`
2. `ONE name, drawn and spoken — the one-string rule > the utterance is built from that same
   name, so copy can never drift out of it` (`:240-246`) — REAL.
   `AssertionError: expected 'choose keep, or deal.' to contain 'deal a new board?'`
3. `the destructive-work guard speaks — 3.2 > returns focus to the listbox when the ribbon
   retires` (`:190-198`) — **COLLATERAL, not a contract failure.** Row 1 throws at its
   `expect(announced(w))` before reaching `w.unmount()`, so its gallery stays in the shared
   jsdom document and poisons this later row. Proof: run it alone (`-t "returns focus to the
   listbox"`) at the cured tree → `Tests 1 passed | 16 skipped`. Run it with row 1
   (`-t "the destructive-work guard speaks"`) → both red. It needs no edit; it greens when
   seam A lands.

Attribution is banked: with the utterance temporarily reverted to the pre-cure string the same
file reads `Test Files 1 passed (1) / Tests 17 passed (17)`
(`evidence/w3/fold/FA2-11-unit-attribution-pristine-utterance.txt`). All three are the cure's.

## Seam A — `GameGallery.a11y.test.ts:104-115`, the `announced()` predicate

Replace

```ts
/** The e2e helper's own predicate (a11y.spec.ts:162), re-run against the component tree: the
 *  guard is heard when a live region speaks the guard's OWN name — never a hardcoded copy. */
function announced(w: Wrapper): boolean {
  const g = guard(w);
  const key = (g.attributes("aria-label") ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/[?.!]+$/, "");
  if (!key) return false;
  return liveRegions(w).some((t) => t.toLowerCase().includes(key));
}
```

with

```ts
/** The e2e helper's own predicate (`a11y.spec.ts` `guardAnnounced` — cited by symbol, the old
 *  `:162` had drifted off it), re-run against the component tree.
 *
 *  T9-W3 §3.7 — WHICH STRING IT READS, AND WHY IT MOVED. It keyed off the guard's own
 *  `aria-label`, which is the alertdialog's NAME; requiring a live region to repeat it was the
 *  double-speak itself — the title and the stake spoken once by the region and again by the
 *  dialog the focus lands in. The region keeps the half the dialog cannot say, the choice on
 *  offer, so the predicate reads the destructive VERB the ribbon draws on `.guard-leave`. Still
 *  read off the guard, so the copy may change without touching this predicate. */
function announced(w: Wrapper): boolean {
  const verb = (guard(w).findAll(".guard-leave")[0]?.text() ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
  if (!verb) return false;
  return liveRegions(w).some((t) => t.toLowerCase().includes(verb));
}
```

`findAll(...)[0]?.text() ?? ""` rather than `get`/`find().text()`: a missing ribbon must return
`false` here, exactly as the e2e twin's `?? ''` does, not throw out of the predicate.

## Seam B — `GameGallery.a11y.test.ts:240-246`, the one-string row

Replace

```ts
  it("the utterance is built from that same name, so copy can never drift out of it", async () => {
    const w = mountGallery();
    await arm(w, "d");
    const drawn = w.get(".guard-note-title").text();
    expect(w.get('[role="alert"]').text().toLowerCase()).toContain(drawn.toLowerCase());
    w.unmount();
  });
```

with

```ts
  it("the utterance is built from the verb it draws, so copy can never drift out of it", async () => {
    const w = mountGallery();
    await arm(w, "d");
    // T9-W3 §3.7 — the one-string rule binds the NAME to the drawn heading, and the two rows
    // above still gate that as an equality. What it binds the UTTERANCE to moved: the region
    // no longer recites the heading, because the alertdialog the guard hands focus to already
    // carries it as its accessible name and saying it twice was the double-speak. The region's
    // own half is the choice on offer, so what it may never drift out of is the word printed
    // on the destructive button.
    const drawnVerb = w.get(".guard-leave").text();
    expect(drawnVerb).not.toBe("");
    expect(w.get('[role="alert"]').text().toLowerCase()).toContain(drawnVerb.toLowerCase());
    w.unmount();
  });
```

## The file-head prose that follows (same file, `:17-19`)

The head still reads "THE ONE-STRING RULE ... the ribbon's drawn heading and its accessible name
are the SAME string." That is UNCHANGED by §3.7 and needs no edit — the heading and the
`aria-label` are still one literal (`GameGallery.vue` `guardTitle`), and the two rows above seam
B still assert it character for character. Only the region's share of the rule moved.

## What a landing must show

- `npx vitest run --silent=true src/pencil/chrome/GameGallery/GameGallery.a11y.test.ts`
  → `Test Files 1 passed (1)`, 17 tests, including the collateral row 3 with no edit of its own.
- `npx vitest run --silent` → `Test Files 64 passed (64)`.
- Plant-proof for seam A, mirroring what FA2 banked for the e2e twin
  (`FA2-06`/`FA2-08`/`FA2-09`): plant `sayGuard(\`\`)` in `GameGallery.vue` → RED; plant
  `sayGuard(\`Work is at risk.\`)` → RED; restore → GREEN. **Do not use
  `sayGuard(\`${guardTitle.value} ${guardSub.value}.\`)` as the plant** — it greens, because the
  verb is a SUBSTRING of the title in all three intents ("deal" ⊂ "deal over this puzzle?",
  "leave" ⊂ "leave this puzzle?", "switch" ⊂ "switch this shared board to …?"). FA2 measured
  that and banked it (`FA2-07-plant-P2-echo-no-verb.txt`, 6 passed). It is a real limit of a
  substring predicate on this copy: the gate polices SILENCE, not the double-speak.

## The gap this leaves open, named

Nothing in the committed estate now REDS if the double-speak comes back — both gates accept a
region that recites the title, since the title contains the verb. FA2's born-RED probe is the
predicate that would catch it (`titleEchoedBy` / `stakeEchoedBy` must be empty against the
dialog's `aria-label` and its `aria-describedby` target); it ran as a scratch spec and was
deleted with the lane, its measurement banked at
`evidence/w3/fold/FA2-01-born-red.txt` (RED, both engines) and
`evidence/w3/fold/FA2-03-cured-green.txt` (GREEN, both engines). Standing it up as a committed
row is a row ADDITION, which was outside FA2's fence. Recommended home: this unit file's
`3.2` describe — the component tree has both channels in one mount and it costs a millisecond.
