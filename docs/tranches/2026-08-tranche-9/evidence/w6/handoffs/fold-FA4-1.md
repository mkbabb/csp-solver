> **SPENT 2026-09-17, by the chair seal (lane S2).** relay.ts:250-254 now records the cure and where it lives instead of booking cut-2 — verified at the tree before landing (relayWire.ts header's 15s beat, `useSession.ts:624 PRESENCE_EXPIRY_MS = 45000`, no dedupe in the EVENT path); comment only, and `tsc -p . --noEmit` / `eslint .` / pinned `prettier --check` all exit 0.

> **NOT LANDED 2026-09-17** — `web/relay/relay.ts` is outside the Restamp lane's fence. The third copy of the retired presence-timeout lie is still at :250-252; the literal replacement text in this file stands and is owed to the relay's owning lane.

# FA4-1 → `web/relay/relay.ts` — the third copy of the retired lie, one comment

Lane FA4 landed W3 §3.7 (`evidence/w3/handoffs/3C-3.md`): presence is said on a clock now — a
`hi` beat every 15s from every live page, and a peer silent past 45s leaves the roster while
staying in `known`. The handoff named the two files that had written the lie down and asked for
both to be re-cut; both were, inside FA4's fence:

- `web/frontend/src/games/shared/relayWire.ts` (header) — re-cut;
- `web/frontend/src/games/shared/useSession.ts` (the `CUR_EXPIRY_MS` note) — re-cut, and the
  constant is now `PRESENCE_EXPIRY_MS`, shared by the ghost and the roster.

There is a **third** copy, and it is outside FA4's fence. The lane's fence admits `relay.ts`
only if the relay must forward or ack something new — it must not (read whole, verdict and
evidence at `evidence/w6/fold/fa4-relay-verification.md`: no dedupe, no throttle, no rejection
of a repeated `hi`). So the comment is handed over rather than reached for.

## The seam

`web/relay/relay.ts:250-252`, inside `announceLeave`'s doc comment. Exactly:

```
   * This covers the socket that CLOSES: a crashed tab, a page navigated away, a link the
   * runtime gives up on. A peer whose socket stays open while the page behind it is dead is
   * still the roster's problem, and that one wants a presence timeout — cut-2's, not this.
```

Replace the last sentence (from "A peer whose socket stays open") with:

```
   * runtime gives up on. A peer whose socket stays open while the page behind it is dead was
   * the roster's own problem, and it got its clock at T9-W6 §3.7: every live page re-announces
   * `hi` on a 15s beat and the roster drops a peer silent past 45s (`useSession.ts`). Nothing
   * here changed for it — a repeated `hi` is an ordinary EVENT and this file has no memory of
   * one to deduplicate against.
```

Nothing else in the file moves. `relay.ts`'s gates, if it is opened: `cd web/relay && npx tsc -p
. --noEmit`, `npx eslint .`, `npx prettier --check` with the pinned config.

## Why it is worth landing rather than dropping

The lie survived two tranches precisely because it was written in three places and cured in
none, with each copy naming a cut that never came. Two copies now say the cure and its date; the
third still books an owner who no longer exists, which is the shape the whole handoff was
written against.
