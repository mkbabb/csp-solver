# r0 R1 — MOVED (MRK-ABS, pass 4)

Nothing under `loop/r0/` was written. The proposal is `../probe/law-probe.R1-moved.mjs`: a copy
of r0's `law-probe.mjs` with two changes only — the subject path (`FE=<tree>/web/frontend`) and
the R1 row. Every other row is verbatim.

## The row

- r0 (frozen): *every chromatic token that paints in BOTH themes carries a dark arm* — born-RED
  on `--color-focus-sketch`, reason: "its own comment claims 'Dark mode keeps crayon-blue'".
- Moved to MRK-LIVE's rebased wording (pass-4 README §1.10), which the chair accepted as the
  token's value (pass4 CHAIR-RULINGS §1.3): *`--color-focus-sketch` is declared once, at :root,
  with no theme arm; its comment states the painted reading it was chosen on and names which
  figures are arithmetic.* The check: one declaration, none after `.dark`, and the declaration's
  comment contains `painted`, a named statistic (`worst`|`median`), and `arithmetic`.

## Readings (the same run of the same copy)

| tree | moved R1 | r0's R1 as written |
|---|---|---|
| control `74a2b5d9` (`w7-control`) | **RED** — 1 declaration; comment: painted false, statistic false, arithmetic false | RED |
| prototype (this tree) | **GREEN** — 1 declaration, not in `.dark`; painted, statistic, arithmetic all true | RED |
| the two-value ballot arm (`two-value-ballot-arm.PROPOSED.diff` applied to a scratch copy) | **RED** — 2 declarations, one in `.dark` | **GREEN** |

The two wordings split exactly on the owner's ballot: r0's sentence wants the dark arm, LIVE's
forbids it. Whichever arm the owner picks, one of the two sentences is the law that retires.
Logs: `../logs/law-probe-R1moved-control-74a2b5d9.txt`, `../logs/law-probe-R1moved-proto.txt`.
