# CTRL-TABS pass 2 · RESEARCH — instruments proposed MOVED

Four r0 rows whose SUBJECT this family moves. `loop/r0/` is frozen: nothing here edits it, and
each row below is a proposal with its own falsifiability note. The r0 rows are reported MOVED,
never re-cut in place, and no gate is re-worded to pass.

| r0 row | where it lives | why it moves | proposal |
|---|---|---|---|
| R6 `law-probe` **L1** | `r0/r6-idiom-history/law-probe.mjs:51` | `total === 9` is a literal; §10 retires the estate's one `BoilDivider` (its own trigger (a)) and the sum goes to 5 | `law-probe-L1-L3.moved.mjs` — rows agree with `FILTER_BUDGET_TOTAL` **and** the total never rises past 9 |
| R6 `law-probe` **L3** | same file, `:82` | `ADMITTED.length === 2` counts the ledger; the family strikes the `candidates` row with the copy it excused | same file — the gate's own exit + 0 unadmitted + 0 em dashes, plus a (currently UNPROVEN) staleness arm |
| R6-census §2 **law 9** | `r0/r6-idiom-history/R6-census.md:86` | the prose half of L1: "the live-filter population is EXACTLY 9" | re-word to "exactly the declared total, and never more than the 9 the T4-P1 cure left" — in the SAME diff as L1 (chair §7) |
| R7 **I3** | `r0/r7-owners-eye/instruments/owners-eye.instruments.mjs` | asserts a *pinned compartment tape* names a group ≥50% on screen at every scroll state; under the tabs there are no tapes and nothing scrolls | §2 below — a re-cut that CAN fail |
| R1 `heading-voice.spec.ts` **ROW 2** | `r0/r1-controls/probe/heading-voice.spec.ts:107` | `docHeadings === names.length` is RELATIVE: deleting names greens it | §3 below — assert the POPULATION too |

Run the law probe against either tree:

    FE=<repo>/web/frontend node law-probe-L1-L3.moved.mjs                       # HEAD: 2 GREEN
    FE=<repo>/.claude/worktrees/wf_e58b4764-0fc-39/web/frontend node …          # cure: 2 GREEN

Controls run this pass: L1′ **fires** (a synthetic `count: 6` row takes the sum to 15 → RED).
L3′'s staleness arm **does not fire** and says so in its own header — a `src/**` grep reads
`candidates` as an identifier, so the arm must ride `check-copy-register.mjs`'s rendered corpus
before it is believed. A control that does not fire is reported, not left green.

## 2 · R7 I3, re-cut — "the name of what you are reading is on screen"

I3's LAW is M03's: a group's name must be readable beside the group. Its MECHANISM (a sticky
tape over a scrollport) is what the family retires, so the row cannot be run as written. The
re-cut keeps the law and changes the measured subject:

```
  I3′ · for EVERY tab, on every measured cell: with that tray face up,
       (a) the tab word's box is ≥ 50% inside the card's client box, AND
       (b) the face-up tray's own content box is ≥ 50% inside it.
       No scroll states to sweep — the card does not scroll — so the sweep is over TABS.
```

Falsifiable, and it reds today: at **320×480 and 360×400** the card is capped below its
content (`readings/short-end.json`) and (b) fails. It also reds if a later cure lets the strip
scroll out, which is the defect I3 was written for. Report beside it, as this family's own
number, that I3-as-written is VACUOUS under the tabs — not cleared.

## 3 · R1 heading-voice ROW 2, re-cut — the population is half the law

As written, ROW 2 asserts `docHeadings === names.length`, so a card that names FEWER groups
greens it. At HEAD the selector set finds 8 names (2 + 4 + 2) and 2 headings; under the tabs the
same law reads over 4 tab words (and the re-aimed set adds 2 row captions). The population moved
from 8 to 4 and ROW 2 cannot see it.

```
  ROW 2′ · every group name is a document heading  (unchanged)
  ROW 2″ · the card names EVERY option group it holds:
           names.length === (the number of OptionSelector roots in the card, hidden trays
           included) + (the number of trays that hold no option group)
```

`names.length` must be counted over ALL trays, not just the face-up one, or the law is satisfied
by hiding groups. Today's card holds 5 option groups (size · level · marks · what fits ·
checking) and one group-less tray (players), so the right-hand side is 6. Under the desk's fifth
tab it is 7. Deriving the count from the DOM rather than spelling it keeps the row from learning
a literal, and it reds the moment a group loses its name.
