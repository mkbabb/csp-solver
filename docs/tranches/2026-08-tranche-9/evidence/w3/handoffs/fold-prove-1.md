> **SPENT 2026-09-17, by the chair seal (lane S1).** The value-based `firstEmptyCell` and the keystroke rows landed in `e2e/spoken-controls.spec.ts` — a write with the sheet SHUT, silence with it UP — green on both engines at both poses over three consecutive runs, with the cure ablated reading `a keystroke wrote into a covered cell` 4/4 (`../seal/S1-08`…`S1-18`).

# fold-prove-1 → `web/frontend/e2e/spoken-controls.spec.ts` — the §3.1 helper reads a class no cell carries

> **OPEN 2026-09-17, filed by the non-author PROVE lane (fence: `evidence/w3/prove/` only).**
> Owed to the chair or to whichever lane owns `e2e/spoken-controls.spec.ts`. Measured, not
> inferred: `prove2-independent-probes.txt`, the `[§3.1 …] census=` lines.

## The defect

`firstEmptyCell` picks the cell the §3.1 keystroke row drives:

```ts
/** The first cell with no printed digit — the one a stray keystroke would actually write to. */
async function firstEmptyCell(page: Page): Promise<number> {
  return page.evaluate(() => {
    const cells = [...document.querySelectorAll<HTMLElement>('.board-cells .game-cell')];
    return cells.findIndex((c) => !c.classList.contains('is-given'));
  });
}
```

`is-given` is a PROP passed to the child glyph (`DigitCell.vue:394`, `:is-given="isGiven"`),
never a class on `.game-cell`. Measured on the live page, chromium and webkit, 390×844 and
768×1024:

```
[§3.1 390x844]  census={"cells":81,"withIsGivenClass":0,"emptyByValue":20,"firstEmptyByClass":0,"firstEmptyByValue":1}
[§3.1 768x1024] census={"cells":81,"withIsGivenClass":0,"emptyByValue":20,"firstEmptyByClass":0,"firstEmptyByValue":4}
```

So the predicate is true of every cell, the helper answers `0` on every board, and cell 0 is
usually a GIVEN. The row survives today because what it asserts is FOCUS (`activeInGrid`) and
it carries a sheet-shut control that would red if the instrument went blind. But the contract
in the comment is false, and the failure mode it hides is the expensive one: cell 0's write is
refused by W1's B7 whatever the sheet is doing, so the moment this row grows a keystroke
assertion it scores green against a board with no cure at all.

## The replacement text

Read the emptiness off the input's own value — the same thing the reader sees, and the same
predicate this lane's probe used to find index 1 and index 4 above.

```ts
/** The first cell with no printed digit — the one a stray keystroke would actually write to.
 *  Read off the INPUT'S VALUE, not off a class: `is-given` is a prop on the child glyph
 *  (`DigitCell.vue:394`) and no `.game-cell` ever carries it as a class, so a class filter is
 *  true of all 81 cells and answers 0 on every board (measured both engines,
 *  evidence/w3/prove/PROVE-RECORD.md finding 2). */
async function firstEmptyCell(page: Page): Promise<number> {
  return page.evaluate(() => {
    const cells = [...document.querySelectorAll<HTMLElement>('.board-cells .game-cell')];
    return cells.findIndex(
      (c) => !(c.querySelector('.cell-native-input') as HTMLInputElement | null)?.value,
    );
  });
}
```

Prettier is never run on `e2e/`; the block above is hand-formatted to the file's single-quote
style. `npm run typecheck:e2e` covers it.

## The row that should exist beside it

The §3.1 row asserts focus and stops. The keystroke half — "a keystroke must not WRITE" — is
proven today only by this lane's scratchpad probe, and by the prior prove session's
`prove-occlusion-fresh.txt` (`RISEN write … "wrote":false` against a sheet-shut control that
wrote). Landing the two lines that type into the cell and re-read its value would put that
claim in the estate rather than in the evidence directory:

```ts
      await page.keyboard.type('5');
      const after = await page.evaluate((i) => {
        const cells = [...document.querySelectorAll<HTMLElement>('.board-cells .game-cell')];
        return cells[i]?.querySelector<HTMLInputElement>('.cell-native-input')?.value ?? null;
      }, idx);
      expect(after, 'a keystroke wrote into a covered cell').toBe('');
```

Measured green at head, both engines, both viewports, with the shut-sheet control writing `5`
and clearing before the sheet rises.
