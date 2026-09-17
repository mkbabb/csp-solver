# FA4 — does the relay forward a REPEATED `hi`? Read, not assumed. (2026-09-17)

The handoff (`evidence/w3/handoffs/3C-3.md`) makes the beat a re-send of the frame the room
already speaks, and conditions the lane on one question: **if `web/relay/relay.ts` dedupes or
rejects a repeated `hi`, that is a finding and it is cured there with a test.**

It does neither. `web/relay/relay.ts` was read whole at this tree; the EVENT path has no memory
of a frame it has already seen:

| The dedupe that could exist | What `relay.ts` actually does |
| --- | --- |
| an `id` cache / seen-set | none — nothing stores an event id anywhere (`NO PERSISTENCE`, header) |
| a per-pubkey announce throttle | none — no timestamp is kept per socket |
| a "same content, skip it" test | none — `fanout` re-evaluates `matches` per event and sends |
| a rejection of a repeat | none — every `isEvent` frame is answered `["OK", a.id, true, ""]` |

The only per-socket state the EVENT arm writes is `att.who`, and it is written **only when the
pubkey changes** (`if (att.who?.pubkey !== a.pubkey)`), so a repeat from the same page is
strictly cheaper than the first frame and is never a reason to stop.

Belt and braces from the client side: `relayWire.frame()` mints `id: hex(64)` and a fresh
`created_at` per frame, so two beats are not the same event even to a relay that did cache ids.

Size: a beat is the envelope plus `{"kind":"hi","data":{},"from":"…"}` — ~180 B against
`MAX_FRAME` 65,536.

**Verdict: no relay change is owed by this lane, and `web/relay/relay.ts` was NOT touched.**

## The one relay-side thing this lane did NOT do

`relay.ts:250-253` still carries the same sentence the cure retires — "that one wants a presence
timeout — cut-2's, not this". It is a comment, and this lane's fence admits `relay.ts` only if
the relay must forward or ack something new. It must not, so the re-cut is handed over rather
than reached for: `evidence/w6/handoffs/fold-FA4-1.md`.
