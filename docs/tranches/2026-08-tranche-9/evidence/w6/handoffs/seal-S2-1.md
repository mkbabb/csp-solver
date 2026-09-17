# seal-S2-1 → the `RELAY_URLS` residue outside S2's fence: two lines in a SEALED T7 wave spec

> **SPENT 2026-09-17, by the chair.** Disposition 2: a dated note at the head of `docs/tranches/2026-08-tranche-7/waves/W5-the-multiplayer-record.md` names the rename once and covers both lines; no sealed body line moved; `check-doc-truth.mjs:1114` keeps the old name as the rename's own record. The honest verify form is "three, all adjudicated".

Lane S2 landed the three LIVE cites its fence named — `docs/multiplayer.md:257`, `:366` and
`web/frontend/public/_headers:69` all read `RELAY_URL` now, and the sentences were re-read so the
grammar holds (`a module-private const` stays true: `useSession.ts:91` declares
`const RELAY_URL = import.meta.env.VITE_RELAY_URL || "wss://sudoku-relay.mkbabb.workers.dev"`,
module scope, not exported).

The lane's verify grep was specified to reach **zero**. It reaches **three**, and none of the
three is a live cite this lane could land. They are adjudicated below; two of them want a
decision that is not S2's to make.

```
$ git grep -nI 'RELAY_URLS' -- . ':(exclude)docs/tranches/*/evidence/**' ':(exclude)docs/tranches/LEDGER.md'
docs/tranches/2026-08-tranche-7/waves/W5-the-multiplayer-record.md:45
docs/tranches/2026-08-tranche-7/waves/W5-the-multiplayer-record.md:79
scripts/check-doc-truth.mjs:1114
```

## `scripts/check-doc-truth.mjs:1114` — NOT a seam, and it must keep the old name

```js
 * T9-W6 §6.1 renamed the client's constant `RELAY_URLS` (a one-element array whose
 * only read was `[0]`) to `RELAY_URL`, a string. The read below moved with it in the
 * same commit — a gate that parses a name is a gate the rename must carry.
```

This is the rename's own record. It names `RELAY_URLS` in order to say what was renamed, and
striking the name would delete the only in-tree explanation of why `deriveRelayOrigin`'s regex
reads `const RELAY_URL\s*=`. **No action. It should be excluded from any future form of this
grep by name**, the way the verify line already excludes `evidence/**` and the LEDGER.

## The seam — `docs/tranches/2026-08-tranche-7/waves/W5-the-multiplayer-record.md:45` and `:79`

```
45:1. **`relay-origin-pair`** — the CSP `connect-src` origin, `useSession.ts`'s `RELAY_URLS`
46:   default, and `wrangler.toml`'s `name` are one string.

79:  `RELAY_URLS` const plus a build-time env read. `relay-origin-pair` gates the invariant; the
```

Both were TRUE when written (2026-08-03): `RELAY_URLS` was the landed symbol for the whole of
T7, and `:79` is the C21 row — `spec-symbol-phantom`, the row that prosecutes docs for naming a
symbol that does not exist. It now names one itself, one tranche later, which is the joke the
chair should get to decide about rather than have decided for it.

S2 does not reach it, on two grounds: it is outside this lane's fence, and it is a **sealed**
tranche record (`docs/tranches/2026-08-tranche-7` — `evidence/wgate/close-record.md`), which
this seal's law says takes a dated note or a CORRECTION block, never a silent rewrite.

## The mechanical question is answered, so only the records question is left

Probed reversibly and banked at `../seal/s2-t7-freeze-probe.txt`: both occurrences renamed in
place, gates run, file restored byte-for-byte (sha256
`3221fbd6cf53974a8a748223c228efc60c80e123f673f42601a47a3708247502` before **and** after).

- `ledger-diff --assert-state` — **GREEN, exit 0**, FREEZE clean, T7 still 145 audited rows / 11
  corpus files / 0 orphan. The FREEZE arm audits row ids, not symbol names, so it does not bite
  on this edit either way.
- `check-doc-truth` — **0 RED / 42 GREEN** planted, same as restored. No row reads this file.

So nothing enforces the choice and nothing breaks on it. The three dispositions, priced:

1. **Leave both lines.** Defensible on the freeze law alone: a sealed wave spec is tranche-time
   truth, the rename is recorded at `check-doc-truth.mjs:1114` and in W6's record, and a reader
   who meets `RELAY_URLS` in a T7 document is reading T7. Costs: the grep never reaches zero, so
   the next lane re-adjudicates this from scratch.
2. **A dated note at the file's head**, naming the rename once and covering both lines — the
   house form, and the one this lane would pick. One block, no line in the body moves.
3. **Rename both and date the correction.** Cleanest grep, but it edits a sealed body, which is
   the act the freeze law exists to refuse.

## For whoever takes it

If disposition 2 or 3 lands, the verify grep still wants `scripts/check-doc-truth.mjs` excluded
by name before it can be stated as `→ zero`, per the first section. If disposition 1 lands, the
grep's target is **three, all adjudicated**, and that is the honest form of the check.
