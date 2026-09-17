# S2 — THE RECORD'S LAST LIES (2026-09-17)

Five prose/number seams across four files, each one measured before it was written down. Gates
at lane end: `s2-gates-lane-end.txt` (every one exit 0).

## 1. `docs/tranches/LEDGER.md:87` — CH-19's bound, 571 → 576 (`fold-FA5-3.md`, SPENT)

`check-doc-truth` was **1 RED / 41 GREEN** at lane open, the single RED being `index-css-bound`
(`s2-doc-truth-before.txt`). It is **0 RED / 42 GREEN** at lane end (`s2-doc-truth-after.txt`).

The row now pins 576 and carries the dated RESTAMP note the handoff specified, with **one clause
added** beyond the handoff's literal text, and it is worth naming why. The handoff said "only the
number moves", but the row's own breach-split sentence — `head 1,172 = 571 code + 510 comment +
91 blank`, and the `+167 CODE (+41.3%), +176 COMMENT (+52.7%)` above it — was copied from the
same table head that carries the `-5`. Restamping the bound alone would have left the row
contradicting itself inside one cell, which is the exact disease the row exists to prosecute. The
note therefore states the censused split too: head is **576 code + 505 comment + 91 blank**,
which reads `+172 CODE / +171 COMMENT / +21 blank` on the close's 404 / 334 / 70. Those figures
are the gate's own derived line, not a re-derivation of this lane's.

The TOTAL (1,172, `+364`), the eight named landings, the WHY-NOT-A-DISTILL paragraph, the three
triggers and the verdict are untouched, per the handoff.

`ledger-diff --assert-state` stays **GREEN, exit 0** across the edit (`s2-ledger-diff-after.txt`):
FREEZE clean, 4 open rows current under all eight arms.

## 2. `RELAY_URLS` — three live cites of a symbol that no longer exists

Landed, all three, singular:

| seam | now reads |
| --- | --- |
| `docs/multiplayer.md:257` | ``useSession.ts:RELAY_URL``—a module-private const |
| `docs/multiplayer.md:366` | the surface the CSP and `RELAY_URL` name |
| `web/frontend/public/_headers:69` | this origin is `RELAY_URL` in useSession.ts |

Each sentence was re-read rather than substituted into. "A module-private const" stays true —
`useSession.ts:91` declares `const RELAY_URL = import.meta.env.VITE_RELAY_URL || "wss://…"` at
module scope, unexported. ":366"'s plural verb still governs two subjects ("the CSP and
`RELAY_URL` **name**"). `_headers:69` drops one character in an 89–97-column ragged comment
block, so no re-wrap.

**One sentence deliberately NOT touched.** `docs/multiplayer.md:262` reads "The list is one entry
long because we operate the relay". That is the CSP `connect-src` grant's list, not the retired
array, and the source keeps the same register two levels down — `useSession.ts:83`: "One entry,
because a list of one is what a relay you operate means". It survives the rename intact.

**The verify grep does not reach zero, and three hits remain, all adjudicated.** Two are in a
SEALED T7 wave spec and one is the rename's own record inside the gate. Neither is a live cite
and neither is in this fence — handed over whole at `../handoffs/seal-S2-1.md`, with the
mechanical question already answered by a reversible probe (`s2-t7-freeze-probe.txt`: FREEZE
clean and doc-truth 0 RED / 42 GREEN with the rename planted, file restored byte-for-byte,
sha256 `3221fbd6…` before and after). Only the records question is left, and it is the chair's.

## 3. `web/relay/relay.ts:250-254` — the third copy of the presence lie (`fold-FA4-1.md`, SPENT)

The comment booked a cure to a cut that never came ("that one wants a presence timeout —
cut-2's, not this"). It now records the cure and where it lives. **Verified at the tree before
the words were written**, not taken from the handoff:

- the 15s beat — `relayWire.ts` header, "every live page re-announces `hi` on a 15s beat and a
  peer silent past 45s";
- the 45s expiry — `useSession.ts:624`, `const PRESENCE_EXPIRY_MS = 45000`, the same constant
  read by the roster (`:634`) and the ghost cursor (`:953`);
- "this file has no memory of one to deduplicate against" — `fa4-relay-verification.md`'s read of
  the EVENT path, re-checked: no id cache, no per-pubkey throttle, `att.who` written only when
  the pubkey changes.

Comment only; no executable line moved. `tsc -p . --noEmit` 0, `eslint .` 0, pinned
`prettier --check` 0.

## 4. `web/frontend/scripts/tdz-probe.mjs:136` — the eager row (`fold-FA5-2.md`, SPENT)

`detail` now reads "at most the **main-chunk row** may hold one", matching the arm-(c) comment
at `:123-125` that 6A-3 already re-cut. `--self-test` exit 0, 0 cycle edges, negative control RED
as required (`s2-tdz-probe-selftest.txt`).

## Two hunks in `relay.ts`'s diff are NOT this lane's

`git diff web/relay/relay.ts` shows three hunks. Only the middle one (the comment at `:250-254`)
is S2's. The other two — the `if (!Array.isArray(msg))` return wrapped at `:199-200` and the
`interface Env.RELAY` member list wrapped at `:292-295` — are pure prettier rewraps that were
already in the working tree when this lane opened, landed by the W6 lane that put `web/relay`
under gates (it dropped in the untracked `web/relay/eslint.config.mjs` and `tsconfig.json`
alongside them).

Proven rather than assumed: `HEAD:web/relay/relay.ts` **fails** the pinned
`prettier --check` (exit 1) while the working tree passes it (exit 0), so the rewraps are the
`--write` that made the new gate green. Reverting them would red it. This lane made one Edit to
this file and it was the comment.

## Out of fence, observed, NOT touched

`check-evidence-policy.mjs` is **RED, exit 1**, and was red before this lane opened. 20 breaches
— 18 oversized PNGs under `evidence/w3/gallery-pi/` and the per-wave caps on w3 (4,135,716 B) and
w6 (3,855,113 B) against a 2,097,152 B ceiling. The proof it is not S2's: the gate's own header
reads `582 png, 45,012,307 B … 20 breaches` both at lane end and in the copy FA5 banked before
this lane existed (`../fold/FA5-evidence-policy-after.txt`) — identical. S2 banked `.md`/`.txt`
only, which this gate does not weigh, and no breach names an S2 file. Owner is whoever banked
the gallery-pi crops; the gate's own instruction is to recrop, never to raise a cap.

It was also nearly missed the way the estate's trap says it would: `check-evidence-policy | tail`
reports `EXIT=0`, because the pipe hands back `tail`'s status. Run bare.

`npm run lint` (prettier over `src/ scripts/ ../../scripts/ ../relay/`) is RED at this tree on
**one file that is not this lane's**: `src/pencil/chrome/GameGallery/GameGallery.a11y.test.ts`,
modified in the working tree by a sibling lane and left prettier-dirty. Both files this lane
touched under that gate — `../relay/relay.ts` and `scripts/tdz-probe.mjs` — pass the pinned
check. Whoever owns that file owes it a `--write`.
