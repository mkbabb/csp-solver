# T8-W3 · lane 1 — SUBSTRATE-FIRST (M11 · M12 · M13 · M14 · M1)

Design doc, no implementation. Competing lane: experience-first; chair adjudicates.

**Probe provenance.** Rig: chromium (Playwright), vite dev at `127.0.0.1:4253`, 1280×900,
tree = master `d152a6a9` plus the in-flight W1/W2 lane edits (dirty:
`GameGallery.vue`-adjacent spec + perf-rig files — none of the measured subtrees are
fenced to those lanes' changes). Probes: `scratchpad/probe-substrate.mjs`,
`scratchpad/probe-poster.mjs`. Every number below is from those runs or a cited banked
evidence file; the two claims proved by code-reading rather than rig are marked
**code-proven**.

---

## 0 · The center

One sentence: **the session is the table, the game is the worksheet on it, and the epoch
— the one number the room already agrees on — names the worksheet.** Everything M11–M14
and M1 ask for is then a *read* of state that already exists or a small widening of the
one convergence rule that already ships:

- M12's live previews are **disk-truth stills** — the five persisted boards, already on
  disk under five keys, rendered through the shipped `PosterBoard` instead of five canned
  arrays. Measured: a full 81-glyph truthful poster is 264 nodes and re-renders in 1.9 ms.
- M13's whole matrix collapses to **one rule applied per row**: a game switch is a
  board-replacing act, and board-replacing acts already have wire semantics (`st`, the
  epoch, LWW adoption). No new message kind for switching. No host/guest asymmetry,
  because the protocol has none.
- M1's "who wrote it" is **already in the ledger** — `ledger.clock[pos][1]` is the author
  id and `known[id]` holds slug + ink. The hover needs a 10-line computed, not a feature.
- M14's join/leave animation data is the session's existing `onPeer` seam, exposed as a
  typed event stream with the debounce fields the animation lane needs.

What this lane refuses to build is the point: no second live renderer, no rasterize-on-
switch pipeline, no CRDT purchase, no per-game room multiplexing. The four module
singletons that assume ONE live board (`useDirtyBoard`, `useSession`'s source slot,
`useStagingBridge`, the drawer registration) all keep their one slot.

---

## 1 · What IS the state — the facts that decide

Surveyed whole: `useGameState.ts`, `useSession.ts`, `relayWire.ts`, `playerIdentity.ts`,
`useStagingBridge.ts`, `persistence.ts`, `useUndoHistory.ts`, `cards.ts`, `App.vue`,
`GameScene.vue`, `GameCard.vue`, `PosterBoard.vue`, `web/relay/relay.ts`.

1. **A game's persistent state is a per-game localStorage blob** (`createPersistence`,
   five keys, one codec), written debounced-300 ms at every mutation
   (`useGameState.queueSave`), restored at mount. M12's "state persists and saves between
   gallery switches" is **already true** at the state layer — what lies is the *preview*.
2. **The cross-game ledger exists** (`useStagingBridge`: settings + `board`/`userMoves`
   flags, live row from the mounted game, cold-start backfill reading the five keys
   without mounting a game). The backfill is the precedent that reading another game's
   board off disk is legal and cheap — measured 0.003 ms for a full key sweep + parse.
3. **A session is a wire + a ledger + a roster**, board-bound today: `clearSessionSource`
   calls `leaveSession()` (useSession.ts:337–341) and `setGame` strips `?s=`
   (App.vue:186–189), so a game switch IS a leave. That coupling is the one thing this
   design deletes.
4. **The epoch `[lamport, author]` is the only number two pages agree on**
   (useSession.ts header). Board-replacing acts publish `st` (board + clock + epoch);
   ops from another epoch drop or trigger a `hi` re-request. This machinery is the whole
   of the switch semantics — it just doesn't carry *which game* yet.
5. **One live board ever** — the scene stays mounted under the deck (`v-show`,
   App.vue:729), teleported into the center card's face (`useLiveFace`). The undo log is
   per-mount, in-memory, cap 200 (`UNDO_CAP`, useUndoHistory.ts:52), cleared by epoch
   adoption (useSession restore → `clearUndo`). So: **the cap is per mounted model, not
   per board; a switch destroys the log; an adoption clears it** — both already ruled.
6. **Attribution half-exists**: `authorInk` (useSession.ts:320) rebinds
   `--color-user-ink` per peer-authored cell, consumed at BoardHost:238. **Ghost cursors
   do not exist** — nothing on the wire carries focus; the `peerCells`/`is-peer` names in
   GameBoard are the same-unit highlight, not multiplayer.
7. **Ink is arrival-order, per page** (`mint()` walks `inkCursor`) — two pages can show
   the same peer in different hues today. Slugs are id-derived and converge; inks don't.
8. **Found hole (code-proven): a mid-session size commit desyncs the room.** The board
   blob (`snapshotBoard`, useGameState.ts:433–442) carries no size and
   `restoreBoardState` (759–780) never touches `solverSize`, so a peer adopting an `st`
   published after a size-changing Deal restores a 256-cell values map into a 9×9 model.
   Two mouths: the live peer, and any later joiner off the stale `?board=` link. The
   substrate below closes it as a side effect of carrying the game id.

---

## 2 · The substrate

### 2.1 The epoch names its worksheet — `st` gains `g` and `z`

The `st` message widens by two fields; no new message kind, no epoch-shape change:

```ts
// useSession.ts — the st payload
{ b: Json,                    // board blob (unchanged)
  c: Record<string, Stamp>,   // clock (unchanged)
  e: number, ea: string,      // epoch (unchanged)
  g: string,                  // NEW — mountedGameId() at publish time
  z: number,                  // NEW — the game's raw selector size (solverSize)
  k: Record<string, number> } // NEW — peer id → ink index (see 2.3)
```

`publishBoard()` and `sendState()` read `g` from `mountedGameId()` (the staging bridge
already exports it — no new truth, no App plumbing) and `z` from a ref the board
registers on its session source. Ops stay 7-field: the epoch discriminates them, so a
cell write never needs to say which game it's about.

**Inbound rule** (the FOLLOW): on `st` with `newer(e, ledger.epoch)`:

- `g === mountedGameId() && z === solverSize` → adopt in place (shipped path, unchanged).
- otherwise → **follow**: stage the blob as an id-keyed one-shot
  (`stageBoardFollow(g, z, blob)` on the staging bridge — the exact `stageHandoff`
  idiom), then call the registered *game follower* (2.2). The incoming mount consumes
  the staged blob INSTEAD of its localStorage restore, adopts clock + epoch, and counts
  it `adopted` so its own generation bump doesn't echo a rival epoch. A same-game
  size-only mismatch rides the same path — one mechanism for game, size, or both, which
  is what closes hole §1.8.

### 2.2 The session outlives the scene

Three deletions/moves, all in named files:

- `clearSessionSource` **stops calling `leaveSession()`** (useSession.ts:337–341). A
  null source is now a tolerated state: `sendState`/`applyValue` already guard on it,
  dropped inbound frames during the seam are repaired by the `hi` the incoming mount's
  re-register sends (the shipped reconnect grammar — `hi` is already the re-request).
- App.vue `setGame` **drops `"s"` from its strip list** (line 188) — the room id rides
  the switch, because the room now survives it.
- `leaveSession()` (the players-well verb, pagehide) keeps the whole teardown including
  the `?s=` strip — leaving is still leaving.

One registration, the estate's own idiom (`registerDirtySource` pattern):

```ts
// useSession.ts — App registers at boot; games/shared never imports App
export function registerGameFollower(
  f: (game: string, z: number, blob: unknown) => void,
): void;
```

App's follower: `stageBoardFollow(g, z, blob); setGame(g, { cut: view === "gallery" })`
— the page-turn plays for a playing-view peer; a peer holding the deck open gets the cut
(the live center face swaps to the new game's card; the deck stays).

### 2.3 Ink converges — `k` on the `st`

Today each page walks the golden angle in its own arrival order, so "the green digits"
is a sentence that can be false on the other screen (§1.7). The epoch holder's
assignment ships as `k` (id → ink index, including departed ids from `known`); an
adopting page rebinds `known[id].ink = inkFor(k[id])` and continues its cursor from
`max(k)+1`. Newly met peers extend; ties between concurrent extensions converge at the
next `st` exactly as cells do. Cost at 16 players ≈ 600 B on a message whose measured
worst case is 9,401 B against a 65,536 B frame cap (relay.ts:171) — nowhere near.

This also fixes M1 for joiners: a cell authored by a peer who left before you arrived
has a clock entry and, with `k`, a stable ink + a derivable slug (`slugFor` is pure in
the id) — the hover can name the departed.

### 2.4 The wire's fourth word — `cur`

Ghost cursors need peer focus state; nothing carries it. One new client-side kind —
relay untouched (it fans out content-agnostically; kind 20411 ephemeral, nothing stored):

```ts
export type Kind = "hi" | "op" | "st" | "cur";
// cur payload
{ p: number | null,          // focused cell, null = no focus (blur / deck open)
  e: number, ea: string }    // epoch stamp — a cursor against another board drops
```

Sent throttled leading+trailing at ~8 Hz from the board's `onCellFocus`/focusout; held
in `peerCursors: Ref<Record<string, number | null>>`; cleared per id on leave, wholesale
on epoch change. Frame ≈ 300 B with NIP-01 envelope; worst case (8 players sweeping
simultaneously) ≈ 19 KB/s ingress at the DO, transient, ephemeral — inside the relay's
stated cost model. Rendering (a ghost outline in the peer's ink on the cell box,
`aria-hidden`) is lane-2's language; the substrate hands it the map and the ink.

### 2.5 The truthful preview feed

```ts
// useStagingBridge.ts — deck-open read, id-keyed; null = no saved board (canned face)
export interface PreviewBoard {
  boardSize: number;          // side length (derived via the card's own size math)
  subgridSize: number;        // boxed: root; latin: boardSize (PosterBoard's contract)
  values: Record<string, number>;
  clue?: unknown;             // the persisted clue field, game-vocabulary opaque
}
export function previewFor(id: string): PreviewBoard | null;
```

Read at deck open and at warp (when a face becomes a flank) — not reactively streamed:
while the deck is open the only board that changes is the mounted one, and that one is
the LIVE teleported face, never a poster. One race exists and gets a one-line cure: the
debounced 300 ms persist can trail a write when the live face detaches at warp, so
`useGameState` exposes `flushSave()` and App calls it in `moveLiveBoard(null)`'s path.

The five `*Poster.vue` components take optional `values`/`clue` props, defaulting to
their canned arrays (the fresh-install face survives); each renders its own saved clue
furniture through the overlay it already owns. `GameCard` feeds `previewFor(card.id)`
through a prop. Under the one-table rule (§4) flank previews never receive wire traffic
— disk is always their truth — which is the substrate consequence that makes M12 cheap.

### 2.6 M1 / M14 data contracts

```ts
// useSession.ts
export const cellAuthors: ComputedRef<Record<string, { slug: string; self: boolean }>>;
// join/leave stream — subscribe API, no ring to grow (registerX idiom)
export interface SessionEvent {
  type: "join" | "leave";
  id: string; slug: string;
  ink: Record<string, string>;   // the oklch var rebinding, playerIdentity's own shape
  at: number;                    // performance.now() at receipt
}
export function onSessionEvent(cb: (e: SessionEvent) => void): () => void;
```

- **M14 board wash**: a `useJoinWash` consumer holds the debounce policy as data —
  per-id min-gap (proposed 4,000 ms), one wash in flight, queue coalesced, leave = the
  same event muted + reversed. The session stamps `at`; the policy lives in ONE
  composable so lane 2 tunes numbers without touching the wire.
- **M14 controls expand / player icon**: the roster (`session.players`) already carries
  slug + ink + order; the icon is derivable from the slug's animal word — no wire field.
- **M1 hover**: `GameModel` gains `cellAuthors` (defineGame.ts read contract + one
  BoardHost pass-through), mirroring exactly how `authorInk` crossed at T6 (one prop,
  five games). `authorInk` itself is untouched — style binding and naming stay separate
  consumers of the same clock.

---

## 3 · The preview mechanism — candidates, measured

Baseline (this rig): live board host, dealt 9×9, playing view: **526 nodes / 118 svg /
137 path**. Today's deck: **1,184 nodes** total — live center card 596, canned flank
posters 90–150 each. Heap: 19.30 MB playing → 20.99 MB deck open (+1.69 MB).

| candidate | measured / derived cost | verdict |
|---|---|---|
| **A · truthful stills** — saved-board values through `PosterBoard`, one live center face (shipped teleport) | full 81-glyph 9×9 poster: **264 nodes / 82 svg, 4.9 ms mount**; single-cell patch **p50 0.30 ms**, whole-board swap **p50 1.9 ms / max 7 ms**; four full posters at once: **14.7 ms mount, 1,056 nodes**; zero animations at rest (pose 0, no beat enrolment, `grain-static` is a reference to an existing filter def — census unchanged) | **RULED IN** |
| B · N−1 dormant live renderers (beat-frozen `GameShell`s, keep-alive) | 5 × 526 ≈ 2,600 nodes of *board* alone; each model = its own undo pool + marks + watchers; heap: a futoshiki boot reads 25.92 MB vs sudoku's 19.30 (chunk + model, split not isolated — stated as such); the killer is structural: **four singletons assume one live slot** (`useDirtyBoard`, session source, staging source, drawer registration) and each grid mounts the 4-layer grain hoist — N× the T4-P1 filter discipline | dead |
| C · snapshot-on-switch (rasterize the leaving board) | a bake pipeline whose staleness begins at the first post-switch write; and the estate's open M6 family — the logo's recurring low-res bake — is precisely the "bitmap of live vector" disease; adds a pipeline, deletes nothing | dead |
| D · read-only mini-board component (new renderer distinct from board AND poster) | duplicates `PosterBoard`, which already IS the read-only mini-board with a values prop — a second one is the parallel-map disease (`gameRegistry`, T5-W2) | dead |

Worst-case deck under A: live center 596 + four *full* truthful posters ≈ 1,650 nodes —
+~470 over today's canned deck, static, no steady-state paint. M11's "more than two
cards" spends node count, not animation budget; at five-full-visible the deck stays
under half the total document's measured 1,730. The re-render path (a saved board
changing while the deck is open) exists only for the live game, which is never a poster
— so A's patch numbers above are ceiling, not steady spend.

---

## 4 · M13 — the matrix, complete

**The standing rule, stated once:** there is no host — the protocol is symmetric, the
`starter` only opens the first epoch. A game switch is a board-replacing act: it opens a
new epoch that names its game (`g`) and size (`z`), and **the whole table follows**,
exactly as a deal already drags every page to the new board. The alternative
(switcher-leaves) is today's shipped behavior and remains a one-branch fallback
(`leaveSession()` before `setGame`) — the substrate makes either cheap, but this lane
commits: one table, one worksheet, because it is the only ruling under which every row
below is decided by machinery that already exists. The dirty-switch guard ribbon gains
one session line ("everyone follows" — plain-English copy per M16, no em dash).

| # | case | ruling | why | what the other side sees |
|---|---|---|---|---|
| 1 | any player switches game mid-session, peers on the board | switcher's new mount publishes `st{g,z,b,c,k}`; peers FOLLOW (staged blob → remount → adopt) | a switch is a board-replacing act; those already converge by epoch | page-turn (or cut, if deck open) into the new game + one notice line ("⟨slug⟩ turned to kenken"); roster unchanged — nobody joined or left |
| 2 | peer switches while the others stay | identical to #1 — symmetry is the protocol's | no host exists; a deal already works this way | same as #1 |
| 3 | switcher returns to the earlier game | another table-wide switch; the returning page restores its SAVED board for that game and publishes it as the new epoch | the epoch rule: the published board wins, clocks reset | page-turn back; the board is the switcher's saved one, not each peer's own memory of it — the LWW price, stated |
| 4 | 2+ pages switch "at once" | concurrent epochs race; `newer([l,a])` picks ONE winner on every page — total order, author tie-break | the shipped convergence rule, unchanged | the losing switcher gets switched again to the winner's game; converged ≤1 `st` round-trip |
| 5 | a joiner arrives while a player browses the deck | works today, ruled and kept: the scene stays mounted under `v-show`, source registered, `holdsTheBoard` answers | gallery browsing is invisible to the room — no wire traffic | joiner lands on the live board; the browsing player sees the join in the live center face + roster |
| 6 | a joiner arrives on a stale link (table has since switched game/size) | joiner boots the link's game, sends `hi`, receives `st{g,z}` → FOLLOWS | same machinery as #1 — a joiner is just a very late follower | joiner page-turns into the table's actual game; peers see an ordinary join |
| 7 | undo spine across a switch | undo NEVER crosses a switch: the log is per-mount and in-memory (cap 200 per model, §1.5), and epoch adoption clears it (shipped) | the epoch rule already rules it; a cross-game undo would restore a board nobody holds | undo/redo verbs read disabled-empty after any switch, both sides |
| 8 | relay `bye`: switch vs leave | a switch sends **no** `bye` — the wire survives the seam; `bye` fires only on `leaveSession()` (players-well verb) and `pagehide`; the relay still speaks it for crashed sockets (`announceLeave`) | presence is people-at-the-table, and a switch changes the worksheet, not the people | roster never flickers on a switch |
| 9 | reconnection during a switch | `relayWire` backoff → `hi` on reopen → the room answers `st{g,z}` → adopt or FOLLOW | `hi` is already the universal re-request; reconnect and stale-join are one case | the reconnected page lands wherever the table now is |
| 10 | size commit mid-session (the §1.8 hole) | `z` mismatch rides the FOLLOW path — a same-game re-mount at the published size, blob staged | the blob carries no size and `restoreBoardState` can't re-dimension (code-proven); one mechanism for game/size/both | peers re-mount to the new size and adopt; today they'd silently corrupt |
| 11 | ghost cursors across a switch | `cur` frames carry the epoch stamp; a stale-epoch cursor drops; `peerCursors` wholesale-clears on epoch change | same discriminant as ops — no second staleness rule | ghosts vanish at the seam, reappear as peers focus the new board |
| 12 | a page holding the deck open when the table switches | FOLLOW applies with `cut` — the mounted game changes under the deck; the live center face moves to the new game's card; deck stays open | the deck is a view, not a mode; the session doesn't wait on it | their center card swaps to the new game, live; flanks (disk-truth) untouched |
| 13 | peer writes arriving while you browse the deck | applied to the live board (source registered throughout, §1.5); visible in the center face | shipped behavior, now stated as a ruling | digits appear in the live face in the writer's ink |
| 14 | the 2-page seam race: a joiner's `hi` lands while the ONLY other page is mid-seam (source null) | the `hi` goes unanswered for the seam's duration; the incoming mount's own publish (or its re-register `hi`) closes the gap | `sendState` guards on null source by design; the repair is the ordinary publish | joiner holds "connecting…" for the seam (~hundreds of ms), then adopts — never a wrong board |

---

## 5 · LOC ledger + what dies

| piece | file(s) | est. LOC |
|---|---|---|
| `st` gains `g`/`z`/`k`; FOLLOW branch; `registerGameFollower`; ink-index adoption; `adopted` bookkeeping | `useSession.ts` | +85 |
| `Kind` widens to `"cur"`; throttle + `peerCursors`; epoch-stamped drop | `useSession.ts` (+2 type-only in wires) | +45 |
| `cellAuthors` + `onSessionEvent` stream | `useSession.ts` | +30 |
| `stageBoardFollow`/`consumeBoardFollow`; `previewFor(id)` disk read | `useStagingBridge.ts` | +55 |
| consume follow-blob before init; `flushSave()`; size ref on session source; cursor send at focus seam | `useGameState.ts` | +30 |
| follower registration; `"s"` un-stripped; flush at live-face detach; guard session line | `App.vue` | +15 |
| optional `values`/`clue` props, saved-clue overlay | 5 × `*Poster.vue` | +75 |
| preview prop plumb (deck → card → poster) | `GameCard.vue`, `GameGallery.vue` | +20 |
| `cellAuthors` read-contract field + pass-through; ghost cell render hook | `defineGame.ts`, `BoardHost.vue`, `DigitCell.vue` | +45 |
| `useJoinWash` (debounce policy as data) | new, `games/shared` | +30 |
| **net new** | | **≈ 430** |

**Dies** (small in lines, load-bearing in shape): `clearSessionSource → leaveSession()`
(the board-bound-session coupling, useSession.ts:337–341); `"s"` in `setGame`'s strip
list + its rationale comment (App.vue:186–189). Honest accounting: this design deletes
~15 LOC. Its parsimony is what it declines to mint — no new message kind for switching,
no second renderer, no snapshot pipeline, no per-game rooms, no rewrite of the four
one-slot singletons — and one dead class: the entire "which board is the room on"
family (incl. §1.8's silent size corruption) closes under a rule that already exists.
Tests ride the existing seams: `admit`/FOLLOW parity in `useSession.test`, a
born-RED for #10 (two `?wire=local` pages, size commit, board dimensions disagree —
red today by §1.8, green under `z`).

---

## 6 · Failure-mode self-critique

- **Vacuous convergence** — the risk that "the table follows" is agreed because it's
  cheap, not because it's right. Countered: the alternative semantics (switcher leaves)
  is explicitly priced (one branch) and the choice is argued (§4 preamble), not assumed.
  If the owner rules the other way, ~95% of this substrate survives — only the FOLLOW
  consumer changes.
- **Gates that can't fail** — the preview numbers were measured on posters that CAN
  fail visibly (a truthful poster showing a stale board). The stated stale window is the
  300 ms persist debounce at warp; `flushSave()` is the cure and a test can force the
  race (write, warp within 300 ms, read the flank).
- **Elegant reduction hiding the hard part** — the hard part is the FOLLOW seam: a lazy
  game's chunk resolving while `st`s and `op`s keep arriving. Not hand-waved: frames in
  the null-source gap DROP by design and are repaired by the re-register `hi` (§2.2),
  the staged blob is id-keyed one-shot (a mis-routed arm dies at first mount — the
  shipped handoff guarantee), and the `adopted` counter prevents the echo. Row #14 states
  the one genuinely unanswered window and its bound.
- **Masked fallbacks** — the canned poster arrays remain as the no-saved-board face.
  That's a stated default, not a silent fallback: `previewFor` returns `null`, the card
  renders canned; nothing pretends disk truth it doesn't have.
- **Consumer-less substrate** — every new field has a named consumer: `g`/`z` → FOLLOW;
  `k` → cross-page ink truth + departed-author hover; `cur` → ghosts; events → wash;
  `cellAuthors` → hover; `previewFor` → flank faces. Nothing ships "for later."

---

## 7 · Open gaps, exactly

1. **The one-table ruling is a semantics ballot** — my commitment, the owner's call.
   The switcher-leaves alternative is one branch on this substrate.
2. **Dormant-renderer heap split not isolated**: 19.30 → 25.92 MB across game boots
   bundles chunk + model (dev server, unminified). Candidate B dies on the structural
   argument regardless; the number is corroborating, not load-bearing.
3. **Ghost-cursor render cost unmeasured** — the substrate is specified, the DOM cost
   (one absolutely-positioned outline per present peer, ≤16) is estimated trivial but
   not probed; lane 2 owns the surface and should measure its own paint.
4. **Presence timeout** (socket open behind a dead page) remains cut-2, per
   `relayWire.ts`'s own header — this design neither cures nor worsens it; a ghost
   cursor from a dead-but-open page persists until the relay's close fires.
5. **`k` extension races**: two pages meeting different newcomers concurrently can mint
   the same ink index until the next `st` converges them — bounded by one round-trip,
   same as cells, but a brief two-peers-one-hue frame is possible and accepted.
6. **Row #3's LWW price** (the returning switcher's saved board overwrites peers' own
   saved boards for that game *on the table* — their local disk copies survive) should
   be said in the guard copy; wording is lane 2's.
7. **M11 card-count geometry** (how many of five render at which viewport) is lane 2's;
   this lane's contribution is the cost table (§3) proving five-truthful-visible is
   affordable.
