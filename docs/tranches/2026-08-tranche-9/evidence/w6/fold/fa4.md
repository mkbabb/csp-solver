# FA4 — PRESENCE SAID ON A CLOCK (W3 §3.7, landed in W6 substrate). 2026-09-17

Handoff landed: `evidence/w3/handoffs/3C-3.md` (marked SPENT).
Handoff raised: `evidence/w6/handoffs/fold-FA4-1.md` (`relay.ts`'s copy of the retired lie).

## The law

- `HEARTBEAT_MS = 15000` — every live page re-announces `hi`, whether or not anything happened.
- `PRESENCE_EXPIRY_MS = 45000` — three misses. A peer silent that long leaves `present` and
  **never** leaves `known`, so their digits keep their colour and their name.
- ONE constant for both expiries: the cursor ghost (`armCursorExpiry`) now reads
  `PRESENCE_EXPIRY_MS` too, so a ghost and a row can never expire at two different numbers.
- The stamp is ANY traffic (`onPeer(id, true)`, which both arms call on every frame), never
  `cur` alone — the handoff's own warning, and the third and fourth unit rows hold it.

## The one departure from the handoff's letter

3C-3 put the beat inside `relayWire`, beside the socket's own announce. It is armed in
`useSession.joinSession` instead, and the argument is in the code (`useSession.ts`, the
`PRESENCE, SAID ON A CLOCK` section):

1. an arm-side beat is written TWICE — `relayWire` and `localWire` — two clocks judged by one
   expiry, free to drift from each other and from it;
2. the arm the whole e2e battery drives is the local one, so a relay-only beat would leave every
   page on that arm evicted at 45s while looking cured;
3. presence is the session's claim; the socket's re-announce on open is about a GAP, not a
   pulse, and it stays exactly where it was.

`useSession.parity.test.ts` carries the note: there is no arm asymmetry to assert, and what the
seam already proves is that both arms carry four repeated `hi` frames to the same seats in the
same order — an arm that deduplicated an announce would read as a room emptying.

## What it costs, stated

`onMessage`'s `hi` arm answers every announce with an `st` from the lowest-id holder, so a beat
draws one board back. Worst case is the relay's own measured frame, 9,401 B: (N−1) × 9.4 kB per
15s, ~1.9 kB/s at four players, far less on a board actually being played. Bought with it: the
one repair this transport never had — no ack, no gap detection, no anti-entropy
(`relayWire.ts`, "A LOST OP IS LOST FOREVER") — now a full reconciliation every 15s.

## Born RED, banked

| File | Row | At HEAD | Cured |
| --- | --- | --- | --- |
| `fa4-born-red-units.txt` | a peer silent past the expiry leaves the roster | **RED** | green |
| `fa4-born-red-units.txt` | this page says it is here on a clock, beat carries nothing | **RED** | green |
| `fa4-born-red-units.txt` | a peer that keeps beating never leaves | GREEN at head (guard) | green |
| `fa4-born-red-units.txt` | a peer that says nothing but `cur` is still at the table | GREEN at head (guard) | green |
| `fa4-born-red-e2e.txt` | `e2e/presence.spec.ts`, chromium + webkit | **RED** (roster 3, expected 2) | `fa4-green-e2e.txt`, 2 passed |

Head reading: `Test Files 1 failed (1) · Tests 2 failed | 28 passed (30)`. The two guard rows are
banked AS GREEN — at head nothing pruned anything, which is the lie itself; they hold the cure's
SHAPE (the cursor-clock trap), not its arrival.

The e2e born-RED ran against an ABLATION of the two cure lines (the tree is shared with other
lanes mid-fold, and the ablation restores exactly the behaviour every other lane's spec was
written against). The cured file was banked to the scratchpad first and restored after; the
final tree carries no ablation (`grep -c ABLATED` → 0).

## The instrument caught itself lying — read this before touching the spec

The FIRST ablated run passed its prune assertion on a tree where nothing prunes. Forensics
(`fa4-hmr-forensics.txt`): at t+45s both survivors' rosters fell 3 → 2 **and** page b's
append-only frame bank fell 6 → 4. An append-only array cannot lose entries — those were new
documents. The dev server had full-reloaded both pages (any save in this shared tree does it),
and two pages rejoining a room they still hold `?s=` for read as a pruned roster.

So `presence.spec.ts` routes the HMR socket nowhere and counts boots in `sessionStorage`, which
SURVIVES a reload: a document that comes back by any other route reds the row. A 75-second
window that any editor save can restart measures the editor, not the session.

## Gates at lane end

| Gate | Exit |
| --- | --- |
| `npx vue-tsc --noEmit` | 0 |
| `npm run typecheck:e2e` | 0 |
| `npx eslint` (5 touched files) | 0 |
| `npx prettier --check --config .prettierrc.json` (4 src files) | 0 |
| `node scripts/check-copy-register.mjs` | 0 |
| `node scripts/check-sleep-lint.mjs` | 0 (the one fixed wait carries its `sleep-ok`) |
| `node scripts/check-motion-contract.mjs` | 1 — **not this lane's**, see below |
| fence units (session + wire + parity + stress) | 4 files, 40 tests, all pass |
| `npx vitest run` (whole estate) | `Test Files 1 failed | 65 passed (66)` — **not this lane's** |
| `e2e/presence.spec.ts` both engines | 2 passed |
| `e2e/multiplayer.spec.ts` both engines | 34 passed, 2 skipped (the opt-in real-relay rows) |

## Two reds that are not this lane's

1. **`npx vitest run`** — 3 failures, all in `src/pencil/chrome/GameGallery/GameGallery.a11y.test.ts`
   (guard utterance, focus return, one-string copy: `'choose keep, or deal.'` vs
   `'deal a new board?'`). That subsystem is mid-flight from another lane (modified `.vue` +
   untracked new test files). FA4 touches nothing under `src/pencil/`.
2. **`check-motion-contract.mjs`** — 2 failures, both other lanes' new specs:
   `spoken-controls.spec.ts` carries NO `PRM:` declaration, and
   `follow-still-authorship.spec.ts`'s declaration is unparseable (`PRM: live, for
   'session-substrate.spec.ts''s own reason — …`; the grammar admits only `frozen — <cite>` or
   `live, because <reason>`). `presence.spec.ts` declares `frozen` and routes it.

## Count moves (for the Restamp lane — nothing stamped was hand-edited)

- NEW spec file `web/frontend/e2e/presence.spec.ts`, 1 test × 2 engines → SPEC_MANIFEST +
  `check-pw-projects.mjs`'s census.
- `+4` unit tests in `src/games/shared/useSession.test.ts` (estate live census 810 executed at
  this tree, 807 passing + 3 other-lane reds).
