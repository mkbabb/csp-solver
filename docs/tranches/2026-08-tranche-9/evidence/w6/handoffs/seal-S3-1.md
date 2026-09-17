# SEAL-S3-1 → `docs/tranches/2026-08-tranche-9/waves/T9-W6-substrate.md` §6.3 — the decision landed, the accounting it implied did not

> **SPENT 2026-09-17, by the chair.** The NOTE landed verbatim under §6.3's second bullet in `T9-W6-substrate.md` (dated, freeze-law form).

Lane S3 closed P-2: `multiplayer.spec.ts`'s `T62_REAL_RELAY` row is now declared in
`HOLDOUTS` as an env-gated row and subtracted from BOTH engines' live census
(`scripts/check-pw-projects.mjs`, green + self-tested + plant-proven, evidence at
`evidence/w6/seal/s3-*`). **Nothing is blocked.** This handoff exists because one sealed
record now under-describes what §6.3 decided, and a sealed record takes a dated note rather
than a silent rewrite.

## The seam

`docs/tranches/2026-08-tranche-9/waves/T9-W6-substrate.md`, §6.3, the second bullet:

```
- **`multiplayer.spec.ts:924`** (V4-adjusted) — an opt-in env gate
  (`T62_REAL_RELAY=1`), deliberate and documented, set nowhere. DECIDED: it stays an
  opt-in chair instrument, AND the WGATE production pass runs it once against the
  real relay (the composition it alone proves: relay-direct, RTCPeerConnection
  deleted) — banked with frames per the evidence law.
```

Two things the bullet does not say, both true at the time it was written:

1. **The row was counted as LIVE coverage in both engines' census while it ran in neither.**
   Deciding a row stays parked is only half the decision; the other half is that the floors
   stop counting it. §6.3 made the first half and the gate kept counting, which is the exact
   disease the QUARANTINES table's own comment names — "any future park must say so here or
   the floors will count silence as coverage" — and that table was empty.
2. **The line cite is stale.** `:924` (V4-adjusted) is now `:953` for the skip, `:950` for the
   row it guards.

## The note, if the chair wants the words

> **NOTE 2026-09-17 (T9-W3+W6 seal, lane S3).** The decision stands unchanged. What it did not
> carry, and now does: the row is DECLARED in `check-pw-projects.mjs`'s `HOLDOUTS` as an
> env-gated row (`env: "T62_REAL_RELAY"`, `engines: []`) and subtracted from BOTH engines' live
> census, because a row that lists and asserts nothing is coverage the floors were counting.
> Live falls 238→237 chromium and 236→235 webkit against floors 214/212 — both satisfied, no
> restamp owed (`--restamp --dry` moves 0 of 11 floors). Check 4's anti-growth clause now
> covers the env form, so the next one cannot arrive unannounced. Cite: the skip is at
> `multiplayer.spec.ts:953`, the row it guards opens at `:950`.

## Why it was not landed here

S3's fence is `scripts/check-pw-projects.mjs` and its self-test fixtures. The wave spec is a
sealed formation record, and the seal lane does not edit one — the chair does, with a date on
it.

## Also closed in fence, reported so it is not mistaken for drift

Beyond the handoff's P-3 (the share-truth audition read "9 passed / 1 skipped"; the banked file
says "1 failed … 9 passed" and never says "skipped"), two row-grain cites in the same table
were adrift and were re-derived against the tree — `share-truth` `:58-74` → `:68-74`,
`spoken-controls` `:242` → `:284`, both verbatim in `evidence/w6/seal/s3-cites-rederived.txt`.
No clause in the gate checks a line number, so those rot in silence; if the chair wants that
class closed mechanically rather than by hand, it is a separate wave's work and this is the
second campaign it has come up.
