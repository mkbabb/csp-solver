# Multiplayer

Two or more pages write on one board. This page is the whole of how: the session client
(`web/frontend/src/games/shared/useSession.ts` and its transports) and the relay
(`web/relay/relay.ts`, one hibernating Cloudflare Durable Object) documented as one protocol
across the seam, so the truth can't split into two hand-synced halves. Every claim cites its
symbol. Measured figures carry their source—`docs/tranches/2026-08-tranche-6/CLOSE.md` is the
record of record for the T6-era probes—and the load-bearing invariants are held by
`scripts/check-doc-truth.mjs` rows that re-derive them from this tree on every run.

## The shape

A session is a room named in the URL. Each page keeps its own whole copy of the board and
speaks one WebSocket to one relay—a star, not a mesh: no ICE, no NAT class, no per-pair
setup, one ordered reliable stream per page (`relayWire.ts` header). Cell writes travel as
author-stamped ops; whole boards travel as epochs; convergence is a last-writer rule per
cell. There's no authoritative copy anywhere: the relay verifies shape, fans out, and stores
nothing (`relay.ts` §NO PERSISTENCE), so the board lives only in the pages holding it.

No player cap exists anywhere in the tree. Ops are bytes at human pace, and the only ceiling
is one object's fanout, which a puzzle's traffic doesn't approach (`useSession.ts` header).

Undo stays per-player—you undo your moves. A peer's write applies through the same effects
an undo replay uses and never enters your stack (`useSession.ts` §REMOTE OPS,
`useUndoHistory.ts` no-clobber guard). An undo is still a move the room sees: the replay
effects announce through `useGameState.ts:noteWrite`, so the digit leaves both boards and
redo restores it on both.

## The arithmetic

A stamp is `[lamport, author]` (`useSession.ts:Stamp`). The order is total—the author id
breaks every tie—so every page decides the same winner whatever order the ops arrive in:
commutative and idempotent, which is convergence. The whole rule is `useSession.ts:wins`: a
write takes a cell iff its stamp is newer than the one the cell holds.

Every op in the room passes through `useSession.ts:admit`, the ledger's one decision. It
merges the lamport clock first and unconditionally—a page that ignored the clock of a write
it rejects would mint its next stamp behind the room and lose a cell it should have won—then
rules `applied`, `stale` (an older write or an older board: drop), or `ahead` (a write
against a board this page hasn't got: ask for that board). `admit` and its minting sibling
`mintOp` are pure over the ledger—no wire, no Vue, no board—which is what lets the stress
suite drive the shipped functions rather than a re-implementation.

## The epoch

The epoch is `[lamport, author]` stamped by whoever last published a board, riding the same
merged clock as everything else (`useSession.ts:publishBoard`). It's the one number two
pages can agree on—`boardGeneration` is a per-page counter and means nothing across the
wire—and it decides whether an op is even about the board this page is looking at. An op
from another epoch drops, and with it the whole class of "a digit from the old board lands
on the new one."

Every board-replacing act opens a new epoch: a deal, a clear, a solve, an undone deal, a
size commit. Board swaps never cross as ops—a deal is a new board, not 81 writes—and the
fresh board has no authored cells, so the clock empties with it. Any player may deal, with
no confirm; that's the shipped and ratified behavior
(`docs/tranches/2026-08-tranche-7/DISPOSITIONS.md` BAL-15). Adopting a board off the wire
clears the local undo log (`useGameState.ts:sessionSource.restore`): undo never crosses an
epoch, so "my undo restores a board nobody else has" dies in one line.

## The wire

Five messages cross it—`hi`, `op`, `st`, `cur`, `bye`—and each earns its keep:

- `hi` — "I'm here, and I don't have the board." Answered with a presence ack, plus the
  board itself from whichever peer holds the lowest id (`useSession.ts:holdsTheBoard`—every
  page computes the same answer, so exactly one snapshot is sent). It's also the
  re-request: a page that hears an op stamped with an epoch it doesn't hold asks with the
  same word, so a gap closes itself without a second protocol.
- `op` — one cell write, `{p, v, s, l, a, e, ea}` (`useSession.ts:toWire`): position,
  value, solved bit, the `[lamport, author]` stamp, and the epoch it's written against.
- `st` — the whole board plus its clock and epoch (`useSession.ts:sendState`). Sent to a
  joiner, and broadcast by whoever deals, clears, or solves.
- `cur` — the focused cell, or null for none (`useSession.ts:noteFocus`, T8-W3). Debounced
  to 120 ms leading-and-trailing and epoch-stamped so a cursor aimed at the old board drops
  with its epoch; a peer's entry expires after 45 s of silence, clears when that peer
  leaves, and clears wholesale on a deal—a stale ghost never haunts a fresh board.
- `bye` — the departure word. Said by a page on `pagehide` (both arms), and by the relay
  on `webSocketClose` for the page that never got to say it (`relay.ts:announceLeave`,
  T7-W4)—without it, a crashed tab lingered on every roster forever, because both arms
  derive presence from traffic and an absence produces no traffic.

The wire carries JSON and nothing else—no binary framing to version (`useSession.ts:Msg`).
Sizes, measured on the shipped shapes
(`docs/tranches/2026-08-tranche-7/evidence/w4/frame-sizes.txt`): a REQ is 72 B, an `op`
frame 364 B, an ordinary `st` about 616 B of content, and the worst `st` this app can
produce—a 9×9 with every cell inked, nine corner and nine centre marks on all 81, plus the
killer/kenken cage furniture—9,401 B on the wire.

## Marks — private per-op, public per-epoch

The precise truth, because the shorthand "notes are personal" is only half of it. A mark
gesture never crosses the wire as an op: `useGameState.ts:onEntry` forwards `value` and
`batch` entries to `noteWrite` and holds `mark` entries back, so your pencil notes stay
yours while you write them. But the epoch snapshot is board *and* marks—
`useGameState.ts:sessionSource.snapshot` returns `{b, m}`—so a joiner adopts the
board-holder's marks with the board, and every deal, clear, or solve pushes the publisher's
marks over every peer's.

That is the shipped contract, and it stands by the owner's election: marks stay
per-epoch-public exactly as this page states (`DISPOSITIONS.md` BAL-14, which joined the
marks-sharing question with this very contradiction). Live marks-sharing per-op was the
other arm and wasn't built.

## Identity and ink

Both derived, neither negotiated—a name and a colour cost no wire traffic and no round
trip (`playerIdentity.ts`).

A slug is `adjective-animal` off the peer id, deterministic, so every page reads the same
name for the same peer. The id goes through the estate's FNV-1a first
(`playerIdentity.ts:slugFor`): the library's own string-seed path folds a long random id
into a 128-name space—measured, over 20,000 seeds—where sixteen players collide better than
half the time; hashed numeric seeds don't. The dictionaries are filtered to what the
hand-drawn font subset can draw (`playerIdentity.ts:WRITEABLE`, `^[a-ik-wyz]+$`—no `j`, no
`x`): 1,145 of 1,202 adjectives and 345 of 355 animals survive, which is 395,025 names,
re-derived from the shipped dictionaries 2026-08-03. A taken name re-rolls off the next
seed rather than growing a suffix—a slug is a word you can say out loud.

Ink is one formula and one binding (`playerIdentity.ts:inkFor`): each peer's cells rebind
`--color-user-ink` to `oklch(var(--peer-ink-l) 0.11 hue)` with hue = i × 137.5° % 360—the
golden-angle walk, which spreads any number of players as far apart around the wheel as a
sequence can. `--peer-ink-l` is 0.5 on paper and 0.8 at night
(`web/frontend/src/assets/index.css`), and the band is what makes the contrast claim
structural rather than a table of hand-checked hexes: measured over 40 indices, the worst
walk position reads 5.26:1 against the light ground and 9.56:1 against the dark card
(`index.css` `--peer-ink-l` block). You keep the incumbent blue—nothing is bound on your
own cells, so a solo board is byte-identical to the one that shipped. The ink cursor walks
from where the roster last stopped, so an early peer never re-inks because a late one
arrived; departures leave the roster but keep their colour, because their digits are still
on the board (`useSession.ts:known`).

## The transport seam

What a transport owes the session is four members: `selfId`, `send`, `leave`, and
`carrying`—a promise that resolves when the arm is actually carrying, which is what the
"connecting…" line waits on (`useSession.ts:Wire`). Everything above the seam is
arm-agnostic, and two arms sit behind it:

- **`relayWire`** (`relayWire.ts`)—the shipped arm, speaking NIP-01 straight to our relay.
  It's `import()`ed at join, so a page playing alone pays zero bytes for it; the e2e
  asserts that absence on solo boot.
- **`localWire`** (`useSession.ts:localWire`)—`BroadcastChannel`, same device, no network.
  Dev-only: the `?wire=local` opt-in sits behind `import.meta.env.DEV`, a build folds the
  whole arm out of the bundle, and the prod-shake gate (`npm run test:prod-shake`) holds
  the fold against the emitted bundle. It
  exists because two Playwright pages in one browser context share the channel—the e2e
  battery drives it, since a relay in CI is a flake machine—and because a copied invite
  link carrying the param once seated two people at two tables, each seeing one player
  (T7-W4; the DEV gate is the cure).

The parity suite holds the seam's whole claim—both arms hand the same script to the same
handlers (`useSession.parity.test.ts`).

A socket that drops walks a reconnect ladder of 250, 500, 1000, 2000, 4000 ms and stays at
4000 forever—the repetition is the cap, so a table left open overnight comes back without
having walked itself out to a ten-minute retry (`relayWire.ts:RETRY_MS`).

A send with nowhere to go is dropped, not queued, and it's safe exactly here: every message
is either idempotent presence, re-said on every reopen, or a stamped op whose loss the next
`st` repairs—the reopen's `hi` is already the re-request, and the room answers it with the
whole board (`relayWire.ts:send`).

## The relay

`web/relay/relay.ts` is 299 lines, 154 of them code—648 across `relay.test.ts`, `relay.ts`,
and `wrangler.toml` (re-derived 2026-08-03; the doc-truth row re-counts on every run). It
serves `relayWire.ts` directly; the trystero client it was first written under left at
T6.2, and what remains is the NIP-01 subset a shared board needs:

- `["EVENT", ev]` — publish. Answered `["OK", id, true, ""]`, then fanned out to every
  other socket whose filter matches (`relay.ts:fanout`)—never echoed to the sender.
- `["REQ", subId, …filters]` — subscribe. Answered `["EOSE", subId]` at once: there is no
  history to walk, because nothing is stored.
- `["CLOSE", subId]` — drop the subscription. Anything else draws a `["NOTICE", …]`.

The shipped client publishes one constant kind, 20411, on one topic,
`sudoku-babb-dev/${room}`, carried on the `x` tag (`relayWire.ts:EVENT_KIND`,
`relay.test.ts:EVENT_KIND`—the pair is gate-asserted equal). NIP-01 reserves 20000–29999
as the ephemeral range, which is the whole truth about a cell write in flight: the relay
keeps nothing, and a page that missed one asks for the board rather than for the event
again. The shipped filter is `{kinds, "#x"}` with no `since`; the `since`/`until` arms of
`relay.ts:matches` stay as documented NIP-01 conformance—inclusive bounds, per the spec—not
as the live path. The event's `content` is the app's own `{kind, data, from, to}` envelope
carrying the board; `pubkey` is the throwaway per-page id the client reads as `from`.

A frame over 64 KiB is refused before the parse with `["OK", "", false, "invalid: frame
too large"]` (`relay.ts:MAX_FRAME`)—about 7× the worst `st` the app can produce, so
nothing legitimate comes near it, and without the cap a 5 MB frame was acked and fanned
whole, once per subscriber (born-RED at
`docs/tranches/2026-08-tranche-7/evidence/w4/u1-u2-born-red.txt`, T7-W4).

Hibernation is the bill. `state.acceptWebSocket` hands each socket to the runtime: between
messages the object is evicted from memory and bills no duration, while the sockets stay
open across the eviction (`relay.ts:Relay.fetch`). A socket's memory therefore can't live
in a field—its subscriptions and, once it has published, the envelope it publishes under
ride `serializeAttachment`, which survives the eviction (`relay.ts:Attachment`; a live
socket spends 172 B of the 16 KiB attachment ceiling, 1.05%, per
`evidence/w4/frame-sizes.txt`). That envelope is what lets the relay say `bye` for a
socket that closes without one (`relay.ts:announceLeave`): no payload is read to do it,
and a page that said its own `bye` first costs nothing—the client's leave handler is
idempotent.

One instance, named `"relay"`, serves every room (`relay.ts:default fetch`). Room
separation is already the `#x` filter, so a per-room object would buy isolation the filter
provides and spend a cold start to do it; if a room ever needs its own object, the upgrade
is `idFromName(room)` at that one call site and the protocol doesn't move.

## Trust, and what it rests on

The link is the whole capability. `?s=` is twelve base36 characters minted at
`useSession.ts:startSession`, written into the address bar synchronously so the copied
link is whole the instant it's copied—and knowing the room id is what it means to be at
the table. The well says so where the link is made: "anyone with this link can write on
this board" (`GameControlPanel.vue` `.players-note`).

No accounts, no signatures. The relay checks shape only (`relay.ts:isEvent`): Schnorr over
a keypair the page mints at load would authenticate nobody, so it isn't bought. Ids are
throwaway—`relayWire.ts` mints `r-` plus twelve hex characters per page—and the roster is
whoever traffic says is present.

The CSP is the second lock, and it's a pair with the client. The page's `connect-src`
grants exactly one socket origin: `wss://sudoku-relay.mkbabb.workers.dev`
(`web/frontend/public/_headers`). That string is also the build-time default in
`useSession.ts:RELAY_URLS`—a module-private const, overridable per-build by the
`VITE_RELAY_URL` env read, which is the whole configuration surface—and its first label is
`wrangler.toml:name` (`"sudoku-relay"`), which is what makes the Worker deploy to that
hostname. Three files, one string, one commit: a deploy that trues one without the others
is a socket blocked on the edge and nowhere else, and the `relay-origin-pair` doc-truth row
holds the triple equal on every run. A list of one is what a relay you operate means—no
redundancy shuffle, no slowest-of-five, no stranger's queue.

The relay itself stays open by election (`DISPOSITIONS.md` BAL-16): no origin allowlist and
no rate limit, so a stranger who learns a room id can write in it—which is the same trust
statement the well makes. The frame cap and the close-announce are the accepted hardening.

## The affordance

Alone, the players well shows a single act—"invite someone to write on this board with
you"—which mints the room, writes `?s=`, joins, and copies the whole link in one press
(`GameControlPanel.vue:inviteAct`). In a session the well shows who's
here, each name written in the colour their digits carry, you first, then everyone in the
order this page met them (`useSession.ts:session.players`).

"connecting…" is honest, not decorative (`useSession.ts:joinSession`). Open your own table
and you're at it as soon as the wire carries—being alone at a table you opened is not a
failure to connect. Follow someone's link and you're connecting until the room answers,
because a table nobody is sitting at is exactly what you're waiting to learn. Leaving
drops the wire, the roster, and the `?s=` parameter—a link to a room you've left is an
invitation to an empty table (`useSession.ts:leaveSession`).

## What it doesn't do

- **No persistence.** The relay stores nothing; the board lives in the pages. Everyone
  leaves, the board is wherever their URLs and `localStorage` put it—the room itself is gone.
- **No history replay.** A page that missed writes asks for the whole board; individual
  events are never re-served.
- **No send queue.** Offline sends drop; the reopen's `hi` pulls the current board.
- **No accounts, no signatures, no moderation**—the link is the capability (above).
- **No presence timeout.** A peer whose socket *closes* is announced by the relay; a peer
  whose socket stays open while the page behind it is dead lingers on the roster until the
  room is left. The honest fix is a relay-side timeout, flagged in `relayWire.ts`'s header
  and not smuggled.
- **No live cursors** (`DISPOSITIONS.md` BAL-13—not built) and **no per-op marks-sharing**
  (BAL-14—marks are per-epoch-public, stated above).
- **No player cap and no room cap**—the star's fanout is the only ceiling.

## How it's proved

Layered, from the pure rule outward:

- **The rule.** `useSession.test.ts` holds `wins`/`admit`; `useSession.stress.test.ts` is
  the large run the trie veto was declined on—20,000 ops from 16 authors with colliding
  lamports, five shuffled delivery orders, one op in eight delivered twice, and 4,000 ops
  from two dead epochs, driven through the *shipped* `admit`/`mintOp`. Six replicas finish
  byte-identical on board and clock; the flood is 20,000 writes over 81 cells, and the
  clock stays the size of the board, never the history. The suite asserts throughput only
  as a floor—a unit lane measures whatever runner it lands on; CLOSE.md banks 7.0 M
  admits/sec on the close runner. The braid row holds the undo spine mid-flood: the cap
  holds at 200, and the stress file's `UNDO_CAP` is gate-asserted equal to the shipped
  `useUndoHistory.ts:UNDO_CAP`.
- **The seam.** `useSession.parity.test.ts` runs the same script through both arms into
  the same handlers; `relayWire.test.ts` holds the shipped arm's framing.
- **The relay.** `npx vitest run --root ../relay` drives `relay.ts:matches` and the whole
  NIP-01 walk with no Cloudflare runtime: fanout, room isolation, the attachment budget,
  and the two T7-W4 cures—the close-announce and the frame cap—both born-RED
  (`evidence/w4/u1-u2-born-red.txt`: cures stripped, suite red; cures present, green).
- **The e2e.** `web/frontend/e2e/multiplayer.spec.ts`, both engines, driven over the local
  arm: solo boot pays no transport bytes; the invite seats two pages at one table; digits
  cross in their author's ink; last writer wins on both pages; undo skips a taken cell;
  an undo propagates and redo restores it; a deal is an epoch both boards follow; four
  pages contend one cell; a player leaves mid-flood; a joiner mid-game adopts the board
  and syncs both ways; three hundred ops as fast as the wire takes them converge; a reload
  returns to the same table; two phone-sized pages share a board. One opt-in row drives
  the real relay with `RTCPeerConnection` deleted, proving the arm needs no peer
  connection at all.
- **Production.** CLOSE.md's probes on the live site: first contact 596 ms at T6.1 and
  602 ms cold-boot-inclusive over the direct arm at T6.2, digits crossing at 15/24 ms,
  undo and redo propagating at 1 ms, boards converged whole—against the 47–66 s the
  abrogated public relays measured.

## Operating it

The relay carries no package.json and no node_modules; the two tools it needs are already
`web/frontend` devDependencies (`wrangler.toml` header):

```bash
cd web/relay    && ../frontend/node_modules/.bin/wrangler dev --port 4245   # local relay
cd web/frontend && npx vitest run --root ../relay                           # the relay rows
cd web/relay    && ../frontend/node_modules/.bin/wrangler deploy            # deploy
```

`wrangler dev` needs no account and no token; `deploy` needs both and is owner-authorized
per deploy. Wrangler runs under node 22—node 26 segfaults it (CLOSE.md, T6.1 addendum).
`VITE_RELAY_URL` points the frontend's build at a local `wrangler dev` or a re-hostnamed
deployment through the same seam the production default uses, so the probe rig and the
deploy never drift into different code. If the hostname ever moves, all three files of the
origin triple move in the same commit (see Trust). For relay-free two-tab play, the dev
server honors `?wire=local`; a production build has already folded that arm away.

The Durable Object is SQLite-backed as a free-plan eligibility condition, not a storage
choice—it stores nothing (`wrangler.toml` migrations comment). No route and no custom
domain are committed on purpose: the `*.workers.dev` hostname is the surface the CSP and
`RELAY_URLS` name, and a route in the file would be a DNS claim the file can't verify.

## The declined roads

- **No CRDT.** The board is `pos → digit` over a fixed index set—cells never move, so
  there's no sequence to reconcile, just a last-writer rule per cell, which is six lines
  (`useSession.ts:wins`). The alternative was priced at the veto: the automerge wasm build
  weighs 2,127,414 B against the estate's 127,500 B lean-solver band (`useSession.ts`
  header)—the arithmetic was never close.
- **The trie veto.** A bespoke persistent-trie ledger was declined at T6.1 on the
  condition the stress file pays (CLOSE.md, election 1): the shipped ledger proven at
  scale—20,000 ops from 16 authors, six replicas byte-identical—rather than asserted. The
  literal trie still restores at its priced cost on the owner's word.
- **The abrogated public relays.** T6 first signalled over public Nostr relays: 47–66
  seconds to first contact on strangers' machines carrying strangers' traffic (CLOSE.md).
  T6.1 abrogated the list, shipped `web/relay`, and narrowed the scheme-wide `wss:` CSP
  grant the list had forced down to the one named origin.
- **The WebRTC arm.** Through T6.1 the relay carried only signalling and the board rode
  peer data channels; trystero left at T6.2 with the connections it existed to negotiate
  (CLOSE.md banks the deletion at −22.4 kB gz). The two measured failure modes are the
  autopsy in `relayWire.ts`'s header: a pair that can't raise a channel never formed a
  table while the relay socket beside it sat healthy and idle, and a lost op was lost
  forever—no ack, no gap detection, `admit` orders what arrives and says nothing about
  what doesn't. The cure was to stop needing the peer connection: the ops ride the same
  frames the signalling already did.
