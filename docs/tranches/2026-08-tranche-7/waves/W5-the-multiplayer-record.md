# W5 — THE MULTIPLAYER RECORD (owner ask 3)

"Documentation of our client and serverless multiplayer technology." One page,
`docs/multiplayer.md`, covering the session client and the Durable Object relay as one
truth across the seam — and curing the 25 contradictions the current comments and READMEs
already carry, in the same commit, so the estate does not ship two truths.

## Placement

`docs/multiplayer.md`, linked from both READMEs, plus same-commit edits to `README.md` and
`web/frontend/README.md`. The argument is the estate's own shape: `docs/*.md` is the
depth-homing convention (`README.md:46` states it) and is auto-swept by `check-doc-truth.mjs`
(`:96-107`), so the page inherits the precepts-leak, version, and figure sweeps for free. A
`web/relay/README.md` would be the estate's first published surface with zero gate coverage,
and `web/relay` declines packagehood on purpose (`wrangler.toml:6-12`). One page keeps the
protocol — defined client-side and relay-side — from splitting across two hand-synced files,
which is the failure mode the contradiction list below already demonstrates.

## The skeleton (14 sections, every claim cited)

The shape and the arithmetic — LWW `[lamport, author]`, the epoch, per-cell convergence,
the hi/op/st/bye grammar, identity and ink, the transport seam and its two arms, the relay's
verbs and hibernation, trust and the CSP pair, the affordance, what it does not do, how it is
proved, operating it, and the declined roads (no CRDT, the trie veto, the abrogated public
relays). The full section list with per-claim `file:line` sources and STABLE/RE-DERIVE/GATE
flags is banked in the audit's doc-skeleton output; the wave adopts it verbatim.

**Numbers that must be re-derived or stamped at write time**, never pinned: first contact
596/602ms, digit sync, undo/redo 1ms, the abrogated 47–66s, 7.0M admits/sec, the contrast
figures, the name-space counts, the trystero and automerge byte deltas — every one is
runner-dependent or measures something no longer in the tree.

## The ten doc-truth rows (land with the page)

Ordered by value; each derives from the tree at run time in the gate's idiom:

1. **`relay-origin-pair`** — the CSP `connect-src` origin, `useSession.ts`'s `RELAY_URLS`
   default, and `wrangler.toml`'s `name` are one string. The estate's most load-bearing
   unenforced invariant (stated as prose only at `CLOSE.md:55-58`).
2. **`retired-arm-clean`** — no dep, no doc, and **no comment in `web/relay`** names trystero
   as the live client. This one row converts the whole trystero-header contradiction class
   (C1–C4, C9, C10) from a prose fix into a standing gate.
3. `multiplayer-wire-verbs` — exactly hi/op/st/bye, no fifth word.
4. `relay-event-kind` — every 5-digit kind the doc quotes equals `EVENT_KIND` (20411).
5. `slug-space-figures` — the writeable-dictionary counts, re-read from the filter regex.
6. `peer-ink-formula` — golden angle, chroma, both lightness values.
7. `session-stress-constants` — 20k ops · 16 authors · 81 cells · cap 200.
8. `relay-loc` — the relay's line count in band (fixes `useSession.ts:40`'s "~150 lines" — it is 219/127).
9. `relay-backoff-ladder` — the retry ladder matches the array.
10. `multiplayer-md-sections` — the page carries the wire, relay, and trust sections (so a future edit cannot silently delete the capability section).

## The 25 contradictions to cure same-commit

All one root cause on the relay side: `relay.ts` and `wrangler.toml` have exactly one commit
(`ccbc20bb`, T6.1) and were never re-read when T6.2 replaced their client. The load-bearing ones:

- **C1–C10 (relay header):** `relay.ts:11-26` describes trystero's nostr strategy, `strToNum(topic)+20000` kinds, 250-topic batches, and WebRTC offer/answer payloads — all dead since T6.2. The shipped client sends a constant kind 20411, one topic, no `since`, and the payload is the board. Rewrite the header to the real consumer; keep the `since`/`until` filter arms as documented NIP-01 conformance, not the live path. Rename `relay.test.ts`'s `trysteroFilter` fixture.
- **C11–C16 (the READMEs):** root `README.md:3` "no server ever touches a puzzle" and
  `web/frontend/README.md:174` "zero server dependency" are false — the relay fans out whole-board
  `st` frames; the frontend README is entirely silent on the session subsystem. True them.
- **C20 (the substantive one):** the marks-privacy contract is half-true. `useGameState.ts:277`
  says marks stay private; but `sessionSource.snapshot` is `{board, marks}` (`:313`), so a
  joiner adopts the board-holder's marks and every deal/clear/solve pushes the publisher's
  marks over every peer's. Marks are private per-op, public per-epoch. The doc must state this
  precisely, the comment must stop saying "private" unqualified, **and this becomes an owner
  election** (Q-2) — feature or bug.
- **C18/C19:** "~150 lines" is 219/127; three disagreeing byte figures for the trystero
  deletion (−23.2 / −22.4 / "~2 kB") — carry one with its evidence or none.
- **C24 (evidence-phantom):** `relayWire.ts:6` cites `evidence/t6.2/realtime/`, which does not
  exist — T6 was process-lite, so the measured numbers live only in `CLOSE.md` prose. Either
  bank the surviving rig logs under an `evidence/` directory or attribute every T6.2 number to
  `CLOSE.md` as the record of record. (Also a `check-evidence-policy.mjs` exposure.)

## Acceptance

`docs/multiplayer.md` written in the estate register (voice anchors banked in the audit output),
every claim cited, the ten doc-truth rows landed and green, the 25 contradictions cured in the
same commit, C20 raised to the owner as an election, the evidence-phantom citation resolved.
The doc-truth gate green at its new, larger row count.
