# seal-S1-1 → `web/frontend/scripts/census.stamp.json` — the unit floor's blocker is gone, the restamp is not

> **SPENT 2026-09-17, by the chair seal (lane S5).** Restamped on a fresh 810/810 report: floor
> 661 → **729**, census 735 → 810, 57 → 66 files, 237 → 262 suites; gate re-run bare EXIT 0.
> The seam's own figure of 689 was the BAND minimum, not the derived floor — the house rule is
> `max(floor(live×0.9), ceil(live×0.85)) = max(729, 689)`, and the ratchet takes 729. No row
> addition landed after the restamp (the `GameGallery.a11y.test.ts` double-speak row this file
> cautions about was declined and stays declined). Evidence `../../w6/seal/S5-gates.txt`.

> **OPEN 2026-09-17, filed by seal lane S1** (fence: `GameGallery.a11y.test.ts`,
> `e2e/spoken-controls.spec.ts`, `waves/T9-W3-spoken-product.md`). Owed to the chair or to
> whichever lane owns the census stamp. Measured, not inferred:
> `../seal/S1-35-unit-battery-seal.txt`, `../seal/S1-37-unit-count-gate.txt`.

## What changed

PROVE-RECORD finding 6 said the restamp "cannot be taken while finding 1 stands" — finding 1
being the three RED rows in `GameGallery.a11y.test.ts`. Those rows landed green this lane
(`fold-FA2-1.md`, SPENT). The battery is now a clean census:

```
Test Files  66 passed (66)
     Tests  810 passed (810)
```

So `check-unit-count.mjs` will accept the report. It still fails, on the floor alone:

```
FE unit lane — 810 executed (810 passed / 0 failed), 0 skipped, 0 todo, over 66 files / 262 suites; floor 661
  floor stamped: 4dd9ec9c · 2026-08-28 · T9-W5 §5.2 (wave-time; the WGATE restamps)
  band: floor 661 vs 689 owed on 810 (85% of max(stamp 735, live 810))  ·  slack 23%
UNIT COUNT GATE FAILED
  · floor 661 is OUT OF BAND: 18.4% under 810 … the floor owes 689.
```

## The seam

`node scripts/check-unit-count.mjs --restamp <report>` from `web/frontend`, against a fresh
passing report. **661 → 689**, stamped census 735 → 810, 66 files. The stamp's own note says
wave-time floors are the WGATE's to restamp, so the wave label is the chair's call, not this
lane's.

## Why it is handed over rather than taken here

`scripts/census.stamp.json` is outside this lane's fence, and a floor is a number the whole
tranche reads — it should move once, in the commit that owns it, not inside a seal lane that
happened to clear its blocker. **It blocks nothing this lane landed**; every gate S1 was asked
for is green (`../seal/S1-34-gates-final.txt`).

One caution for whoever takes it: any row ADDITION landing after the restamp moves 810 again.
S1 declined one such addition for exactly this reason — see `fold-FA2-1.md`'s closing section
("the gap this leaves open"), which recommends a committed double-speak row in
`GameGallery.a11y.test.ts`'s 3.2 describe. If the chair elects that row, restamp after it, not
before.
