# T8-W3 · APOTHEOSIS — M1 · M11 · M12 · M13 · M14

Adjudication of lane1-substrate.md vs lane2-experience.md, at master `d5655d9b`.
This document is the implementation's law. Register note: em-dashes below are record
register; **product copy quoted in this doc obeys M16** (plain English, no em dash ever).

**Verification, not inheritance** — every load-bearing claim re-checked against source:

- Size-desync (L1 §1.8): TRUE — `snapshotBoard` (useGameState.ts:433) carries no size;
  `restoreBoardState` (759) never touches `solverSize`. Code-proven as claimed.
- Trapdoor (L2 §1): TRUE — `clearSessionSource → leaveSession()` (useSession.ts:337/340);
  `"s"` in `setGame`'s strip list with its T6-mark-13 rationale comment (App.vue:186–189).
- Relay-untouched: TRUE — the relay speaks ONE nostr kind (constant 20411, relay.ts:17–22),
  the client `Kind` rides *inside* the content envelope, and the relay stores nothing
  ("no stored events", relay.ts:220). A new client kind never touches `web/relay/`.
- Flush hole (both lanes): TRUE — `queueSave` debounces (useGameState.ts:977); the three
  `onUnmounted` hooks (304/327/942) clear sources, none flushes `saveBoardState` (836).
- `live` latch (L2 row H): TRUE — truthy at 377/431/488, false only in `leaveSession` (515);
  a socket drop never clears it.
- Trace layer, `--edge` spacers + `align-self: stretch` hazard, ghost tiers 5/7/9, invite
  verb's `v-if="!session.roomId.value"`, `readPersistedBoard`'s parse-then-discard,
  `PosterBoard`'s `values` prop at pose 0, dirty-only `guardSub`: all TRUE at their cites.
- Identity is per-connection today: relayWire mints `r-${hex(12)}` per open
  (relayWire.ts:69), localWire per page (useSession.ts:206); `teardown` wipes `known` +
  `inkCursor` (509–517). A rejoin today is a stranger — cured by the owner's extension
  (§2.9), and the ledger's own shapes make the cure nearly free.

---

## §1 · THE RULINGS

The chair's read holds: **lane 1's spine and lane 2's casting compose.** Lane 1 owns the
session/wire/data substrate; lane 2 owns every visible surface — deck geometry, stills as
felt continuity, the join/leave language, the ghost's form, the tape. Three genuine
conflicts, ruled:

### 1a · M13 switch semantics — TABLE-FOLLOWS, ribbon-consented (lane 1 spine + lane 2 gate)

**Ruling: the whole table follows the switcher — one table, one worksheet, symmetric.**
A game switch is a board-replacing act, and board-replacing acts already have complete wire
semantics (`st`, epoch LWW, adoption). The alternative decides nothing the estate hasn't
already decided; FOLLOW is the only ruling under which every matrix row falls to shipped
machinery. Put to the owner as BAL-T8-1 and **RESOLVED — Option A, the owner's word,
2026-08-03** (§5). The matrix finalizes on table-follows.

**Where the matrices disagree, named row by row:**

1. **The core row** — L1 #1/#2 (peers FOLLOW) vs L2 C (guarded leave, switcher evicted).
   Genuine, taste-laden — framed as BAL-T8-1 and resolved by the owner: table-follows.
2. **L2 has no size row** — L1 #10's mid-session size-desync is absent from L2's matrix
   entirely. A gap, not a disagreement; L1's cure ships (semantics-independent — a
   size-changing Deal in a session corrupts peers under EITHER arm).
3. **Consent** — L1 offers "one session line" on the ribbon; L2 arms the ribbon
   *regardless of `dirty`* whenever in a session. **L2 wins**: a clean board in a shared
   room is still a room you're about to act on. Composed: the ribbon arms in-session
   always, with FOLLOW copy (matrix row 1).
4. **`bye` on switch** — L1 #8 (no `bye`; wire survives) vs L2 C (leave fires the full
   leave animation). Downstream of the semantics: under FOLLOW, no `bye`, roster never
   flickers; L2's leave language fires only for real leaves — which *protects* M14's
   vocabulary from dilution.
5. **Ghost expiry** — L1 accepts a dead-page ghost until relay close (its gap §7.4);
   L2 gives a 45s local expiry. **L2 wins**; composed into `cur` (§2.2).
6. **Debounce numbers** — L1's per-id min-gap 4000ms vs L2's boot-suppression 1200ms +
   coalesce 400ms. Not exclusive; composed under one owner (§1c).
7. **Wire verb** — L1 `cur {p,e,ea}` vs L2 `sel {p}` + 120ms limit + 45s expiry. One verb.
   L1's payload wins (the epoch stamp is the staleness discriminant; `{p}` alone can't
   drop a cursor aimed at a dead board). Name: `cur`. L2's rate limit and expiry ride it.
8. **Preview feed** — L1's read-at-deck-open `previewFor(id)` vs L2's boot-swept widened
   ledger. **L1's read policy wins** (a boot cache goes stale the moment a FOLLOW or a
   play session writes disk; lazily-read disk can't lie), **L2's parser-reuse wins** —
   `previewFor` widens `readPersistedBoard`'s existing parse instead of minting a codec.
   The ledger row keeps its two booleans.
9. **Player icon** — L1 "derivable animal glyph" vs L2 "the swatch is the icon." **L2
   wins, committed**: no drawn icon; the swatch dot + slug in their ink.
10. **L1 rows L2 lacks** (return-switch #3, concurrent #4, stale-link #6, deck-follow #12,
    seam race #14): all enter the FINAL matrix. **L2 rows L1 lacks** (same-game reselect D,
    deal-in-session E, leaver's-digits F, empty-room G, socket-drop H, PRM J, coalesce K,
    no-host L, deck-roster A): all enter. Neither matrix was complete; the union is.

**The losing arm's best point, preserved:** lane 2's trapdoor framing is the better *story*
of the defect, and its ribbon is the consent instrument the FOLLOW default still needs —
nobody should drag four people to kenken silently, even legally. The ribbon survives with
FOLLOW copy, arming in-session regardless of `dirty`.

### 1b · Preview × geometry — NO CONFLICT; lane 2 owns geometry, lane 1's numbers survive it

Lane 2's spread (3 slots ≥64rem, 5 slots ≥113rem, depth-graded flanks) puts at most
**1 live face + 4 truthful posters** on screen — which is *exactly* lane 1's measured worst
case: four full posters 14.7ms mount / 1,056 nodes; deck ≈1,650 nodes, static, zero
steady-state paint. Depth grade (`scale`/`opacity`) is compositor-channel; node count is
scale-invariant. The numbers survive whole. Lane 2's geometry ships as specified: `--edge: 0`
at ≥64rem (kills D1's manufactured air AND retires the `align-self: stretch` scrollWidth
hazard from the desk), odd-slot rungs only (the 4-slot rung declined on probe evidence,
recorded so nobody re-proposes it), depth table 1.00/0.94/0.88 · 1.00/0.78/0.58. The
non-centred active card is lane 2's deliberate T7-W7 reversal — one CSS line, reversible at
the owner's re-look (§4).

### 1c · Timing/debounce — ONE OWNER: `useJoinWash`, lane 1's shape holding lane 2's policy

**Ruling: policy-as-data in one composable (lane 1's shape); the numbers and rules are
lane 2's (better reasoned — boot suppression is the insight a trailing debounce can't
express), plus lane 1's per-id min-gap as the anti-flap rule.** The session stamps `at` and
emits events; `useJoinWash` owns every number; lane C tunes without touching the wire.
Beat tables: lane 2's J1–J5 / L1–L3 verbatim (§2.6). J4's 260ms hold is the audition knob.

---

## §2 · THE UNIFIED SPEC

### 2.1 Data model deltas

| where | delta |
|---|---|
| `useSession.ts` | `st` payload gains `g` (mountedGameId at publish), `z` (raw selector size), `k` (id → ink index, departed ids included). Epoch shape unchanged; ops stay 7-field. |
| `useSession.ts` | `cellAuthors: ComputedRef<Record<string, {slug, self}>>` off `ledger.clock` + `known`; `onSessionEvent(cb)` join/leave stream (`{type, id, slug, ink, at}`); `peerCursors: Ref<Record<string, number\|null>>`. |
| `useSession.ts` | ink adoption: on `st`, rebind `known[id].ink = inkFor(k[id])`, continue `inkCursor` from `max(k)+1`. Cross-page ink truth + departed-author naming. ~600B at 16 players vs the 65,536B frame cap. |
| `useStagingBridge.ts` | `stageBoardFollow(g, z, blob)` / consume — the `stageHandoff` idiom, id-keyed one-shot. `previewFor(id): PreviewBoard\|null` — lazy disk read at deck open + warp, via `readPersistedBoard`'s widened parse (values/givens/clue no longer discarded). Ledger row keeps its booleans. |
| `useGameState.ts` | consume follow-blob before localStorage restore; `flushSave()` exported; `onUnmounted(saveBoardState)`; size ref registered on the session source; cursor send at focus seam. |
| `defineGame.ts` | `cellAuthors` read-contract field (the `authorInk` precedent: one prop, five games). `authorInk` itself untouched. |
| `useSession.ts` | `live` follows the socket (drops on close, restores on re-`hi`) — the latch dies. |
| `playerIdentity.ts` + `useSession.ts` + `relayWire.ts` | durable identity (§2.9): one localStorage map `room id → {peer id, at}` (bounded, pruned at write); `joinSession(room)` reads it — or persists the fresh mint — and hands the id to the wire; both wires take the id as a parameter and stop minting internally. `SessionEvent.type` widens to `"join" \| "rejoin" \| "leave"`. |

### 2.2 Wire deltas (relay untouched — verified, §0)

```ts
export type Kind = "hi" | "op" | "st" | "cur";   // useSession.ts:155
// cur: { p: number|null, e: number, ea: string }
```

`cur` — throttled 120ms leading+trailing (~8Hz); `p: null` on blur/deck-open ("they've
looked away"); stale-epoch frames drop (same discriminant as ops); per-id clear on leave,
wholesale clear on epoch change; **45s local expiry** per silent peer (covers the
dead-page ghost; the roster-row lie remains open, §4). Never enters the ledger, never
rides `st`. `web/relay/` sees only kind-20411 envelopes and stores nothing: **no relay
lane exists in this wave.**

Inbound `st` rule (the FOLLOW): `g`/`z` match → adopt in place (shipped path). Mismatch —
game, size, or both, one mechanism — → `stageBoardFollow(g, z, blob)`, then the registered
game follower: `setGame(g, { cut: view === "gallery" })`. The incoming mount consumes the
staged blob instead of its localStorage restore, adopts clock + epoch, counts it `adopted`
(no echo). `registerGameFollower(f)` — App registers at boot; games/shared never imports App.

Session outlives the scene: `clearSessionSource` stops calling `leaveSession()`; `"s"`
leaves `setGame`'s strip list; `leaveSession()` (players-well verb, pagehide) keeps the
whole teardown. Null-source seam frames drop by design; the re-register `hi` repairs.

### 2.3 Component casts (lane 2's casting, on lane 1's data)

| surface | cast |
|---|---|
| Deck geometry | `--edge: 0` ≥64rem; `--deck-slots: 3`, 5 at ≥113rem (1808px); `--d` depth grade per slot off `poseFor(i)`'s shape; phone keeps the 78vw peek deck untouched. |
| Card faces | active+current = live teleported board (unchanged); saved board = TRUE STILL (`previewFor` → `values`/`clue` props on the five `*Poster.vue`, canned arrays as never-played fallback); the fold's substitution becomes invisible because the still is true. |
| Join/leave | the second trace stack in `HandDrawnGrid` — same generator, own `baseSeed`, stroked in the peer's ink; travels with the board through the Teleport (a join during deck-browse rings the active card's face; board parked/hidden → caption-swatch draw-in fallback). |
| Roster | crib-fold `0fr→1fr` row open; `ink-write-in` name; bounded at 7.5rem (five rows, then log); invite verb returns in an empty room; alone-state said out loud. No drawn icon — the swatch is the icon; deck echo = swatch dots on the active card's caption. |
| Attribution | ONE board-level `SheetWashiLabel`, peer ink via the cell's existing `--color-user-ink` rebinding, mounted only in-session over the hovered attributed cell; coarse pointers get the aria-label suffix `", written by brave-otter"` (named asymmetry, not papered over). |
| Ghost | tier 4 of `.cell-ghost-path`: stroke `var(--color-user-ink)` width 4, opacity 0.55, fill 0.04, `ghost-draw-on` 180ms, jumps (never tweens), loses to tiers 2/3 by cascade. A ring, not a wash. |
| Guard ribbon | arms in-session regardless of `dirty`; FOLLOW copy (row 1); return-switch sub-line names the LWW price in plain English. |

### 2.4 What dies (both death lists, merged)

1. `clearSessionSource → leaveSession()` (useSession.ts:337–341) — the board-bound coupling.
2. `"s"` in `setGame`'s strip list + its rationale comment (App.vue:186–189).
3. The leading slot of manufactured air — `--edge → 0px` at ≥64rem (D1 whole).
4. The desk's `align-self: stretch` scrollWidth hazard (T4-P1 class leaves the desk; stays on the phone).
5. The binary flank depth (`scale(0.9)/0.62` for every flank).
6. Canned faces as the ONLY face — demoted to never-played fallback.
7. `readPersistedBoard`'s discard of `values`/`givenCells` — the parse is kept, lazily.
8. The silent session eviction — the trapdoor, dissolved (§2.8).
9. The invite verb's disappearance in-room (`GameControlPanel.vue:854`).
10. `live`'s latch (useSession.ts:290).
11. The 4-slot rung — never built, declined on probe evidence, recorded here.
12. Dirty-only ribbon arming — in-session, the ribbon always arms.

Rows 1–2 are the FOLLOW ruling's deletions; the declined switcher-steps-out arm would
have kept them, with the ribbon's `leave` performing them explicitly (§5).

### 2.5 M13 — THE MATRIX, FINAL

Preamble, stated once: **there is no host** — `holdsTheBoard` is recomputed per-newcomer
(lowest id, useSession.ts:384); the `starter` only opens the first epoch. The mark's
"host switches" framing has no referent in the code (L2 row L, adopted). A switch is a
board-replacing act; the table follows it.

| # | case | ruling | the switcher / you | the peers |
|---|---|---|---|---|
| 1 | select a DIFFERENT game, peers on the board | ribbon arms (in-session, `dirty` irrelevant): "switch this shared board to kenken? 3 other players will follow." [keep]/[switch]. On switch: new mount publishes `st{g,z,b,c,k}`; peers FOLLOW | page-turn into the new game, room intact, `?s=` rides | page-turn (cut if deck open) + notice "⟨slug⟩ switched to kenken"; roster unchanged — nobody joined or left |
| 2 | any peer switches | identical — the protocol is symmetric | same | same |
| 3 | return to the earlier game | table-wide switch; the returner's SAVED board publishes as the new epoch | ribbon sub-line names the price: "your saved board replaces the one on the table" | their table copy is replaced (LWW); their own disk copies survive |
| 4 | 2+ switch "at once" | concurrent epochs race; `newer([l,a])` total-orders, author tie-break | the loser is switched again to the winner's game, ≤1 `st` round-trip | converged with them |
| 5 | browsing the deck | no wire traffic; scene stays mounted (`v-show` + Teleport), session intact | your ghost goes quiet (`cur: null`) — reads as "looked away" | nothing, and that's right — browsing isn't an act |
| 6 | a joiner arrives during your browse | join lands on the live board; the trace rings the active card's face (Teleport, free) | trace on the card; board parked/hidden → caption-swatch draw-in fallback | ordinary join |
| 7 | joiner on a stale link (table has switched game/size) | boots the link's game, `hi` → `st{g,z}` → FOLLOWS | — | an ordinary join; the joiner page-turns to the table's actual game |
| 8 | undo across a switch | NEVER crosses: per-mount log (cap 200), epoch adoption clears (both shipped) | undo/redo read disabled-empty after any switch | same |
| 9 | `bye` semantics | a switch sends NO `bye`; `bye` fires only on the leave verb + pagehide; relay `announceLeave` still covers crashed sockets | wire survives the seam | roster never flickers on a switch |
| 10 | reconnect mid-switch | backoff → `hi` on reopen → `st{g,z}` → adopt or FOLLOW | lands wherever the table now is | — |
| 11 | size commit mid-session (found defect D-1) | `z` mismatch rides FOLLOW: same-game remount at the published size, blob staged | — | remount + adopt; today they silently corrupt (256 cells into a 9×9 model) |
| 12 | ghost across a switch | `cur` epoch-stamped: stale drops; wholesale clear on epoch change | ghosts vanish at the seam, reappear as peers focus | same |
| 13 | deck open when the table switches | FOLLOW with `cut` — the live center face swaps under the open deck | deck stays open; flank stills (disk truth) untouched | — |
| 14 | peer writes while you browse | applied to the live board (source registered throughout) | digits appear in the live center face, writer's ink | — |
| 15 | select the SAME game | `setGame` early-returns (App.vue:174) — session, `?s=`, marks intact | back onto the shared board | nothing |
| 16 | DEAL in a session | works (new epoch, shipped); ribbon arms regardless of `dirty`: "deal a new board? it replaces the board for 3 other players." Peer-side redeal draw-in in dealer's ink = ELECTION, not required | consent, then deal | board replaced with an explanation (and optionally a draw-in) |
| 17 | a peer leaves | row folds (L1–L3); their digits STAY in their ink (`known` retains, shipped); the tape still names them (`k` carries departed ids to joiners) | their handwriting stays on the board — said, not hidden | — |
| 18 | the room empties to you | invite verb returns (`v-if` cure); the well says you're alone | re-invitable, honestly alone | — |
| 19 | your socket drops | `live` follows the socket; the well says so; ops stop silently vanishing behind a green light | honest disconnect | your row survives until `announceLeave` (shipped arm) |
| 20 | two joins at once | ONE trace, last joiner's ink; every roster row lands (`role="log"`) | — | — |
| 21 | joiner's `hi` during the switch seam (source null) | unanswered for the seam; the incoming mount's publish / re-register `hi` repairs | — | joiner holds "connecting" ~hundreds of ms, then adopts — never a wrong board |
| 22 | PRM, any row | every form in §2.7 — reachable, static, no motion | same | same |
| 23 | you leave (verb, tab close) and later return to the room by its link | the binding (§2.9) hands `joinSession` your persisted id — you ARE slug x again | same name, same ink (`k[id]` never reassigned), your old digits still yours: the clock keys the same id, so `cellAuthors` continuity is automatic | no duplicate row — `known[id]` was retained, your row returns; THE RETURN plays (§2.6), not the arrival |
| 24 | rejoin against an expired table (the DO hibernated away; everyone gone) | the `hi` finds nobody; a fresh epoch opens — plainly, a fresh join | you keep your name — the binding is yours, not the room's grant; the board is your saved one | — |
| 25 | "someone else holds your color" on rejoin | impossible by construction: ink is a function of your id's index in `k`, entries are never reassigned, newcomers extend from `max(k)+1`, and your id IS the binding — nobody else can arrive as it | — | — |
| 26 | a FOLLOW vs the leave/join beats | NO beat fires on a FOLLOW — the table moving together is neither a leave nor an arrival; the roster hasn't changed (row 9) | — | — |

### 2.6 Beat tables — FINAL (lane 2 verbatim; owner knob marked)

**JOIN — one `createSequenceSubscription({durationMs: 1180})`:**

| # | window | moment | mechanism | curve |
|---|---|---|---|---|
| J1 | 0–320 | the well makes room (`0fr→1fr`) | crib fold | `--ease-glassGlide` |
| J2 | 140–520 | the name writes itself, inked | `ink-write-in` | `--ease-drawOn` |
| J3 | 200–720 | the board takes their colour (dash 1000→0) | join-trace stack | `easeOutCubic` |
| J4 | 720–980 | it holds, complete | — | — · **AUDITION: 260ms is a reading of "briefly"** |
| J5 | 980–1180 | it lets go (`stroke-opacity` →0, dash never retracts) | same handle's tail | `--ease-fadeOut` |

**LEAVE — 740ms, muted (opacity ceiling 0.45) + reversed (order inverts: board first, then name):**

| # | window | moment | curve |
|---|---|---|---|
| L1 | 0–420 | the ring retreats to its corner, at 0.45 | `--ease-accelIn` |
| L2 | 260–520 | the name goes quiet (`--ink-press-quiet`) | `--ease-standard` |
| L3 | 420–740 | the well closes (`1fr→0fr`) | `--ease-glassGlide` |

**THE RETURN — a rejoin (matrix row 23), the join's shape in the player's existing ink,
lighter — a return, not an arrival:**

| # | window | moment | curve |
|---|---|---|---|
| R1 | 0–280 | their row returns (the fold reopens) | `--ease-glassGlide` |
| R2 | 120–440 | the name rewrites, their existing ink | `--ease-drawOn` |
| R3 | 180–620 | the ring draws at 0.65 opacity ceiling — no hold; a return isn't news | `easeOutCubic` |
| R4 | 620–880 | it lets go | `--ease-fadeOut` |

Detection is free: a join whose id `known` already holds IS a rejoin
(`SessionEvent.type: "rejoin"`). One handle, same wash rules. A FOLLOW fires no beat at
all (row 26).

**`useJoinWash` — the one owner of every number:**

1. BOOT SUPPRESSION, 1200ms — peers discovered within 1200ms of the wire carrying aren't
   arrivals, they're the room you walked into; no trace.
2. COALESCE, 400ms trailing — one trace, last joiner's ink; roster rows never coalesce
   (a log's office is that every entry lands).
3. PER-ID MIN-GAP, 4000ms — a flapping peer (reconnect churn) can't strobe the ring.
4. ONE HANDLE, EVER — a join mid-flight `stop()`s and restarts in the new ink;
   supersede-silently (the `useFlipGlide` discipline). Never two rings.

### 2.7 PRM forms

| moment | form |
|---|---|
| deck spread / depth grade | static; snaps (`transition: none` already declared) |
| FOLLOW page-turn | same-frame cut (`setGame` already branches on `reducedMotion`) |
| join trace | never renders — progress 0 mounts nothing (HandDrawnGrid.vue:426; note: the stack is PINNED to pose 0 at the win for the bow-out — the join stack must respect the same idiom) |
| well / name / leave | lands at `1fr` / lands written / removed same-frame |
| ghost tier 4 | lands drawn (`ghost-draw-on` already PRM-governed) |
| tape / ribbon | already static / already same-frame |

Nothing enrols a perpetual subscriber, nothing mints a filter — census stays 9; idle
raster writes stay zero. The trace is grain-baked geometry with no `filter=`.

### 2.8 The two found defects — cures

**D-1 · mid-session size desync (lane 1, code-proven).** Born-RED first: two `?wire=local`
pages, one commits a size-changing Deal, assert board dimensions agree — RED today
(§0-verified), GREEN under `z` + FOLLOW. Semantics-independent: needed under either arm.

**D-2 · the trapdoor (lane 2, code-proven) — dissolved by design, not guarded.** With
deletions §2.4-1/2, no eviction path exists to fall through: a switch keeps the wire, keeps
`?s=`, sends no `bye`. The only exits from a room are the players-well leave verb and
pagehide — both explicit, both animated (§2.6). The ribbon converts what remains (dragging
peers along) into consent. The declined arm would only have *guarded* the trapdoor — armed
ribbon, honest eviction, leave animation — curing the silence but keeping the floor.

**D-3 · the 300ms flush hole (both lanes, independently).** `flushSave()` at
`moveLiveBoard(null)` + `onUnmounted(saveBoardState)`. Born-RED: write, warp within 300ms,
read the flank still — stale today, true after.

### 2.9 Identity and session persistence — the owner's extension (resolved, 2026-08-03)

The owner's word, verbatim: *"the table follows, and your slug name and session should be
preserved, such that if you switch back to a game as slug x, you rejoin that active
session."*

**The binding.** One localStorage map, `room id → {peer id, at}`, written at first join,
pruned bounded at write (most-recent-few; the constant is the implementation's).
`joinSession(room)` reads the entry — or persists the fresh mint — and hands the id to the
wire: `createRelayWire(room, id)` and the local wire alike take it as a parameter and stop
minting internally. Keyed by session id, survives reload; reclaim is deterministic — read
the map, pass the id.

**Why the rejoiner IS the same author, by construction.** Everything downstream is already
a pure function of the id: the slug (`slugFor` is pure in the id), the ink (`k[id]` — an
`st`-carried index that is never reassigned), authorship (`ledger.clock` keys authors by
id, so `cellAuthors` continuity is automatic), and the roster (`mint` is guarded on
`known[id]`, which retains departed peers — the row returns, never duplicates). No
negotiation, no new wire field beyond §2.1's `k`. Hue drift and color theft are impossible
because identity is the binding, not a lease (matrix rows 23–25).

**Session survival across navigation.** Within a page, the FOLLOW carries it — a switch
never drops the wire. Across reload, tab close, or a URL hop, `?s=` rides (deletion
§2.4-2) and the binding makes the rejoin arrive as slug x. A bare visit with no `?s=`
does not auto-rejoin — the room id arrives by link or history; joining a shared board
unbidden wasn't the ask (§4).

---

## §3 · WORK ORDERS — three fenced Opus lanes

No file appears in two lanes. Order: **A lands first**; B and C then run in parallel
(each consumes A's exports; neither touches A's files). `web/relay/` has no lane — verified
unneeded (§2.2).

### LANE A — the substrate (~330 LOC)

**Files:** `useSession.ts`, `useStagingBridge.ts`, `useGameState.ts`, `App.vue`,
`defineGame.ts`, `playerIdentity.ts`, `relayWire.ts` (the id parameter, ~10 — client
wire only; `web/relay/` still untouched).
**Work:** `st{g,z,k}` + FOLLOW + `registerGameFollower` + `adopted` bookkeeping; decouple
`clearSessionSource`; un-strip `"s"` (+ delete the rationale comment); `cur` kind
(120ms throttle, `peerCursors`, epoch drop, 45s expiry, null-on-blur); `k` ink adoption;
`cellAuthors` + `onSessionEvent` (with `"rejoin"` — a join whose id `known` holds);
`stageBoardFollow`/consume; `previewFor(id)` (widen `readPersistedBoard`'s parse, lazy
read); `flushSave` + unmount flush; `live` follows the socket; `defineGame` read-contract
field; App follower registration; the §2.9 identity binding (store in `playerIdentity.ts`,
both wires take the id).
**Gates:** born-RED D-1 (local-wire e2e, size commit, dimensions agree); born-RED D-3
(write → warp <300ms → flank truth); unit in `useSession.test.ts` — FOLLOW/adopt parity,
one-shot staging (mis-routed arm dies at first mount), `k` adoption idempotence + cursor
continuation, `cur` epoch-drop + expiry, `live` drop/restore, rejoin reclaims id/slug/ink
with no duplicate roster row, expired-room rejoin = fresh join keeping the name;
local-wire e2e: two pages, one switches, the other lands on the new game with the board
adopted; leave then rejoin, same slug + authorship intact.

### LANE B — the deck (~135 LOC)

**Files:** `pencil/chrome/GameGallery/GameGallery.vue`, `GameCard.vue`,
`useCarouselGlide.ts`, the five `games/*/[G]Poster.vue`.
**Work:** `--edge: 0` ≥64rem (phone spacers stay); `--deck-slots` 3 → 5 @113rem; `--d`
depth grade (1.00/0.94/0.88 · 1.00/0.78/0.58 — re-derive absolutes at implementation, L2
§10.3); true-still plumb (`previewFor` → card → poster `values`/`clue`, canned fallback);
ribbon: in-session arming + FOLLOW copy + row-3 LWW sub-line (M16-checked: plain English,
no em dash, counts not feelings); caption swatch row (deck roster echo, reads
`session.players`).
**Gates:** geometry acceptance = the probe table re-run both engines (every index shows
`--deck-slots` cards; `maxScroll` = 5·slot−frame at 3-slot, 0 at 5-slot); D-3's born-RED
goes GREEN here (needs A's flush — the cross-lane dependency, stated); stills unit: saved
board renders, never-played renders canned, no beat enrolment (pose stays 0); visual pass
on the real surface; ladder position recorded for the owner's re-look (U-10 — no closure).

### LANE C — the language (~195 LOC)

**Files:** `pencil/grid/HandDrawnGrid/HandDrawnGrid.vue`, `GameControlPanel.vue`,
`gameCell.css`, `BoardHost.vue`, `DigitCell.vue`, `GameBoard.vue`, NEW
`games/shared/useJoinWash.ts`.
**Work:** the join-trace second stack (own `baseSeed`, ink var, the pinned-pose-0 win
idiom respected); `useJoinWash` (§2.6 rules 1–4, all numbers here); beat tables J1–J5 /
L1–L3 + THE RETURN R1–R4 (keyed off `"rejoin"`); well-expand CSS + `ink-write-in` name;
invite-verb cure + alone state; ghost tier 4 (CSS + `peerCursors` render in
`DigitCell`/`useGameCell`); attribution tape (board-level `SheetWashiLabel` in
`GameBoard`, session-gated, `cellAuthors` via `BoardHost` pass-through) + the aria suffix.
**Gates:** unit (fake timers — deterministic): boot suppression, coalesce, min-gap,
single-flight supersede; PRM assertions: trace layer absent at progress 0, ghost lands
drawn, name lands written; **MUST-LOOK before seal — two rings on one board** (fill trace
+ join trace share the frame rect; lane 2's named biggest visual risk; fallback = the
subgrid lines, a different picture requiring re-adjudication); J4 hold auditioned by eye
at the preview; filter census stays 9.

---

## §4 · OPEN GAPS

- **Presence timeout** (socket open behind a dead page) — unowned, cut-2 (relayWire.ts
  header). The 45s `cur` expiry cures the frozen ghost; the roster row still lies.
- **Two-rings legibility** — gated MUST-LOOK in lane C; the fallback changes the picture.
- **Trace inside a folded card** — stroke 8 at `--live-fit` ~0.4 is a ~3.2px ring; may
  need a counter-scale (unbudgeted; lane C measures before building).
- **Non-centred active card** — lane 2's taste reversal of T7-W7. One CSS line; the
  owner's eye at re-look is the court.
- **Coarse-pointer attribution** — aria-only; a sighted touch user gets nothing. No
  gesture to spend (long-press is the peek). Named, not papered.
- **5-up snap machinery idles** at `maxScroll 0` — harmless; stand-down branch declined
  for now (parsimony).
- **Peer-ink contrast** on a folded, scaled face — the `--peer-ink-l` band wasn't
  measured against that geometry.
- **`k` extension races** — two pages minting the same ink index converge next `st`;
  a brief two-peers-one-hue frame is accepted.
- **Peer-side redeal draw-in** (row 16) — election, not requirement; may be one meaning
  too many for one ring.
- **e2e drives `localWire` only** — the relay arm is visual-on-the-live-edge per O-12;
  this wave leans on that harder than most.
- **Bare-visit auto-rejoin declined** (§2.9) — a visit with no `?s=` doesn't rejoin a
  room unbidden; the room id arrives by link or history. If the owner wants stronger
  re-entry (a "rejoin your table" affordance on a bare visit), that's a new mark, cheap
  on this binding.
- **The binding's prune constant** (how many rooms, how stale) is the implementation's;
  the spec binds only that it's bounded and pruned at write.

---

## §5 · BAL-T8-1 — RESOLVED: the table follows (owner, 2026-08-03, verbatim "Option A")

**The ruling.** A game switch replaces the table's worksheet and every page follows,
through the same sync machinery every write rides — the session is the table, the game is
the worksheet on it. The room, roster, and link all survive the switch; nobody is ever
silently evicted; every edge case is decided by the epoch machinery that already ships.
The M13 matrix (§2.5) is FINAL on these semantics. The design's case, for the record:
M13 asks to "define ALL edge cases when a user switches gallery items" — FOLLOW is the
only semantics under which every case reduces to shipped, already-converging machinery
(22 rows fall to one rule); M12's "state persists between gallery switches" extends
naturally to the *session* persisting too; M14 defines join/leave as the animated
vocabulary of people arriving and departing, and only under FOLLOW does that vocabulary
fire exclusively for real arrivals and departures. The protocol also already grants any
peer board-replacing power (a Deal in a session, shipped); denying a switch the same
power would manufacture an asymmetry between two board-replacing acts.

**The declined alternative, on record — SWITCHER-STEPS-OUT.** A switch as a personal act:
the switcher leaves the room (full leave animation, consent ribbon), the table plays on
without them, the room stays pinned to one game, returning means re-joining by link.
Declined by the owner's word. **The one-branch reopening path, priced:** the FOLLOW
consumer becomes `leaveSession()` before `setGame` (~95% of the substrate survives —
lane 1's priced claim); deletions §2.4-1/2 revert, the ribbon's `leave` arm performing
them explicitly; matrix rows 3/4/7/13 collapse into leave-and-rejoin; `bye` fires on
switch and M14's leave plays for it; ribbon copy becomes "you will leave this shared
board. 3 other players are on it." The `z` size cure, `cur`, `k`, stills, geometry, and
the whole animation language would ship unchanged. Nothing in lanes A/B/C waits on
anything — the ruling is resolved and the lanes build it as written.

**Extension — the owner's word, same day, verbatim:** *"the table follows, and your slug
name and session should be preserved, such that if you switch back to a game as slug x,
you rejoin that active session."* Resolved ruling, not a ballot. Folded as §2.9 (the
identity binding and why the rejoiner is the same author by construction), matrix rows
23–26 (rejoin, expiry, the color-collision impossibility, no beat on a FOLLOW), and
THE RETURN beat form (§2.6). The identity survives navigation; the ink survives the
identity; the authorship was never in question — the clock already keys it by id.
