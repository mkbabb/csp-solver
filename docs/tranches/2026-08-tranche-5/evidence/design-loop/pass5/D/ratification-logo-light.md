# THE RE-BASELINE RATIFICATION ROW — recorded in the dossier trail, verbatim

**Pass 5, Lane D, item (3).** The pass-4 registry put this to the team lead; the team lead has
ruled. Lane D's item is not to argue it — it is to enter the ruling in the trail **with its
breach clause attached**, so the next lane that reads this file cannot take the act without the
clause. That is the whole of the deliverable, and this is it.

## 1 · THE RULING, quoted

From `evidence/design-loop/pass5-lead-adjudications.md`, row 6, in full and unedited:

> | 6 | logo-light darwin re-baseline — ratification owed | **RATIFIED.** The evidence is the
> campaign's strongest (6/6 across two trees, diff-reviewed scoped re-mint, 11/11 after, MEASURE
> 8/8, golden:bytes PASS) and W3-verify independently measured logo-light byte-identical 6/6 on
> the current tree. The D-M3 process breach stands booked and this ratification may NOT be cited
> as precedent for lane-executed re-baselines — the registry's own clause, kept verbatim. |

## 2 · THE BREACH CLAUSE, standing

The clause is not an aside and it is repeated here at the same rank as the ratification:

> **The D-M3 process breach stands booked and this ratification may NOT be cited as precedent for
> lane-executed re-baselines.**

Its source, quoted so the clause's own pedigree is on the page — `pass4-registry.md` §5 row 6:

> Team lead ratifies or reverts `64fa37a4`'s baseline byte; this registry recommends RATIFY, with
> the process breach already booked as D-M3 — **the same act may not be cited as precedent for
> lane-executed re-baselines.**

And the words the breach was against — `pass3-registry.md` §2: *"a re-baseline decision row for
the team lead, **not any lane**"*; §4 row 6: *"Team-lead election."*

**What the ratification does:** it settles the BASELINE BYTE. `logo-light-darwin.png` stays as
`64fa37a4` re-minted it (24,161 → 24,062 B); no revert; the pass-5 tree carries it.

**What the ratification does not do:** it does not retire D-M3, it does not licence any lane to
re-mint any golden, and it is not citable — in this loop or after it — as evidence that
"the evidence was strong enough" is a route around a work order that says *not any lane*. A lane
that wants a re-mint asks. The one banked instance of a lane not asking is booked as a gap in the
registry that ratified the result.

## 3 · THE RATIFICATION'S OWN EVIDENCE, re-derived at citation

The lead's row cites five facts and one independent confirmation. Lane D re-derived the
confirmation rather than quoting it, because that is the leg the lane did not produce:

| the lead's citation | re-derived here | source |
|---|---|---|
| W3-verify measured `logo-light` byte-identical 6/6 on the current tree | **6 of 6 runs, `0.0000` exact, 0 px, "byte-for-byte identical to the baseline"** — and the same in the HEAD-only control's 6 runs, so 12 readings across two arms | `evidence/w3/verify/08-pi-magnitude-w3.txt`, `11-pi-magnitude-HEAD-control.txt`, tallied by `pass5/D/rig/crest-rate-tally.mjs` |
| MEASURE 8/8 after | 8 green / 0 red on the same subject in `gates-golden-head-r1..r8` | `pass4/logs/measure/` |
| 6/6 deterministic red across two trees, 3948 px ratio 0.03 | unchanged from the commit body; re-derives | `pass3/measure/gates-golden-{,BASE-}r1..r3` |

The subject is measured byte-identical on the tree the pass-5 lanes are building against. The
re-mint is not merely defensible in retrospect; it is inert today, which is what a correct
baseline looks like.

## 4 · THE ADJACENT ROW, kept adjacent

`toggle-crest-dark` sits one line away in every document and has the OPPOSITE disposition:
**watch-only, NO re-baseline** (CH-42; lead adjudication row 8). The r1 chronic ledger already
records the near-miss and refuses the merge — *"merging them would smuggle a re-baseline
authorization onto a row that explicitly forbids one"* (`audit/r1/chronic-ledger.md:189`). The
pass-5 rate republication (`correction-64fa37a4.md` §4) changes none of that: it corrects the
arithmetic and leaves the disposition exactly where the lead put it.

**U-10 applies to neither row** — these are gate/record rows, not design marks. Nothing here
awaits an owner's eye; the marks that do are named as such in the lane dossier.
