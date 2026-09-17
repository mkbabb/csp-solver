# T9-W3 lane 3B — AUTHORSHIP SPEAKS TRUE (§3.3)

The cell's accessible name claimed two hands wrote one digit, and the unit gate held it there.
One branch moved; the gate was re-cut to the truth.

## The defect, stated exactly

`authorName` is a **peer's** slug and only ever that — `BoardHost.authorNameAt` (BoardHost.vue:91-94)
returns `""` for your own cells (`a.self`) and for the unauthored. It arrived at the name as a
TAIL through `ariaSuffix`, so it never touched the core clause that already claimed the writing
hand:

```
DigitCell.vue:131-134   ariaSuffix: () => [constraintLabel, authorName ? `written by ${authorName}` : ""]…
useGameCell.ts:127      core = `your entry ${glyphChar}`        ← said whatever the author was
```

Measured at HEAD (`DigitCell.attribution.test.ts`, mounted cell, no stylesheet needed):

| cell | name at HEAD | true? |
| --- | --- | --- |
| peer's digit | `Row 2, column 3, your entry 4, written by brave-otter` | no — two hands, one digit |
| peer's digit + clue | `…, your entry 4, greater than the cell to the right, written by keen-lynx` | no |
| solver's answer, peer asked | `…, solver's answer 4, written by brave-otter` | no — the solver wrote it |
| printed clue, peer in the ledger | `…, given clue 4, written by brave-otter` | no — nobody wrote a clue |
| emptied cell, stamp survives | `…, empty, written by brave-otter` | no — no digit to own |

The last three were not in the charter's sentence and are the same defect: `ariaSuffix` cannot
see `cellKind`, so the tail landed on every kind. A clue and a revealed cell both keep a ledger
stamp (`mintOp` stamps an erase and a solve alike, useSession.ts:155-165), so all five rows are
reachable in a live session.

## Where the branch lives, and why

**In the assembly (`useGameCell.ts`), not the suffix.** Authorship is a property of the core —
the core IS the clause that says whose digit this is — and the core is the only place that knows
`cellKind`. Putting it in the suffix means two sites deciding one sentence, with the suffix
blind to the kind the core just named; that is how the contradiction was born in the first place.

So the core branches once, on the one kind that claims a player's hand:

```ts
case "user":
  core = props.authorName
    ? `${props.authorName}'s entry ${glyphChar.value}`
    : `your entry ${glyphChar.value}`;
```

and the other kinds take no authorship clause at all, because each already names a different
hand truthfully:

- `given` — a printed clue was written by nobody.
- `solved` — the solver wrote it, and the digit visibly wears `#solver-ink`
  (HandwrittenGlyph.vue:83, which outranks the author's `--color-user-ink` rebinding), so the
  name and the paint now agree. Whoever ASKED for the reveal is an event, not authorship.
- `empty` — an erase keeps the ledger stamp and leaves nothing to attribute.

`ariaSuffix` goes back to the one clause it was cut for (the clue vocabulary), so the seam is
`() => props.constraintLabel` and the authorship half of it is gone rather than duplicated.
`GameCellProps` gains `authorName?: string` — the shared intersection, not per-game furniture
(all five games mount `DigitCell`), and DigitCell's props object is already a structural
superset, so the pass-through needed no wiring.

## The sentences now

| cell | name |
| --- | --- |
| your digit | `Row 2, column 3, your entry 4` (unchanged) |
| peer's digit | `Row 2, column 3, brave-otter's entry 4` |
| peer's digit + clue | `Row 2, column 3, keen-lynx's entry 4, greater than the cell to the right` |
| solver's answer | `Row 2, column 3, solver's answer 4` |
| printed clue | `Row 2, column 3, given clue 4` |
| emptied cell | `Row 2, column 3, empty` |

M16 register: plain English, no dash of any kind (pinned as a row), no jargon, no machine name.
`check-copy-register.mjs` green — 0 dashes, 0 unadmitted jargon, and nothing new admitted.

## The gate that enshrined the defect

`DigitCell.attribution.test.ts`'s attribution block pinned the false string verbatim at :70 and
:85. Re-cut to the rule rather than the string: **the name names ONE hand, truly.** Eight rows
where there were four — the peer possessive, the "never two hands" negative pin, the order pin,
and one row per kind that must stay unauthored (solved / given / emptied).

## Born-RED, then green

Run bare from `web/frontend`; the verdict line is **Test Files**.

| step | file | verdict |
| --- | --- | --- |
| baseline, pristine gate | `authorship-baseline-head.txt` | 1 passed · 8 tests — the defect green at HEAD |
| re-cut assertions, UNCURED source | `authorship-born-red.txt` | **1 failed · 6 failed / 6 passed** |
| after the cure | `authorship-cured-green.txt` | 1 passed · 12 tests |
| full unit battery | `authorship-unit-battery.txt` | **60 passed (60) · 758 passed (758)** |
| `vue-tsc --noEmit` | `authorship-vue-tsc.txt` | exit 0 |
| e2e regression, both engines | `authorship-e2e-a11y-both-engines.txt` | **30 passed** |

The six reds are the six new/changed assertions, each printing the false sentence it was
measured against — no fabricated red, and the two rows that were already true
(`your entry 4`, the no-dash register row) stayed green through the cure.

The e2e run is a REGRESSION proof, not a cure proof: every e2e board is solo, so `authorName` is
`""` and the names are byte-identical by construction (`e2e/a11y.spec.ts` keys on
`aria-label*="your entry"` at :125/:229 and the value regex at :579 — all solo, all unmoved).
It ran under a scratchpad twin of `playwright.config.ts` (`webServer` dropped, `baseURL` at a
vite dev server on 127.0.0.1:4237, the lane's band; :3000 never touched), the W2 lane's own
idiom. The config was deleted at the lane's end and the server torn down.

## What no gate in the estate can see yet

No e2e row exercises a peer-authored cell's accessible name — `multiplayer.spec.ts` asserts
button names only. §3.3 asks for the assembly branch and the re-cut unit pin, and both landed;
the live row is a residue, out of this lane's fence (`e2e/` is not in it).

## The residue this cure exposes

`GameBoard.vue`'s attribution tape still names a peer over a SOLVED cell (`hoveredAuthor`,
:489-495, gates on `!a.self` and nothing else) while the glyph wears solver ink and the name now
says `solver's answer 4`. Before this cure the name agreed with the tape by being false in the
same way; now the tape is alone. It is a visible surface, so it moves pixels and belongs to the
chair — handoff `handoffs/3B-1.md`, with the seam and both candidate cures.

## Counts

- FE unit: **+4 rows from this lane** (`DigitCell.attribution.test.ts` 8 → 12), 0 new files. The
  battery read **758 executed / 60 files** at this lane's end, with sibling lanes' in-flight
  edits also in the tree, so 758 is not this lane's number alone. `check-unit-count.mjs` green:
  floor 661, band owes 645 on 758 — no restamp needed by this lane; the chair restamps at the
  fold via the W5 mechanism.
- e2e: **no change** (no spec file touched).
- π: **no pixel moved.** No golden touched, no stylesheet touched, no template node added or
  removed; the change is one string in an `aria-label`.

## Post-wall re-verification

The lane was resumed after a session wall. The arm ran first — `git status --porcelain` plus this
evidence dir — and found the three fence files already cured and the whole chain already banked,
so nothing was redone. The tree was re-measured instead, to prove the cure still holds now that
three sibling lanes' edits sit in it uncommitted (3A's `App.vue`/`GameControlPanel.vue`/
`GameGallery.vue`, 3D's `useLiveRegion` plus three new test files, W4/W6's specs and wire).

| check | verdict |
| --- | --- |
| `npx vitest run --silent` | **63 files passed (63) · 773 passed (773)** |
| `npx vue-tsc --noEmit` | exit 0 |
| `node scripts/check-copy-register.mjs` | exit 0 — 0 dashes, 0 unadmitted jargon |

758 → 773 and 60 → 63 files are lane 3D's new files, not this lane's; this lane's own count is
still the +4 rows in `DigitCell.attribution.test.ts`. The wiring was re-traced end to end and the
claim the cure rests on holds at its source: `BoardHost.authorNameAt` (:91-94) returns a slug only
for `!a.self`, so `authorName` is a peer's and only ever a peer's.

The e2e row was deliberately NOT re-run. It is a regression proof (every e2e board is solo, so
the names are byte-identical by construction), and the tree now carries three other lanes'
uncommitted work, so a red would be ambiguous as to author. The banked run was taken on a tree
carrying this lane's cure, which is the measurement this lane owes. Full detail:
`authorship-reverify-post-wall.txt`.
