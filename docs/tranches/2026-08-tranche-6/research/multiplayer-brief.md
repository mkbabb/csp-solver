# Multiplayer — the adjudicated brief (Mark 13)

**Decision: Design 2 (minimal-delta) wins, with five grafts from Design 1 and two of Design 2's own
structures killed as ornament.** No CRDT, no new wasm, no server, no trie. An author-stamped op wire
over trystero's serverless WebRTC, per-cell Lamport-LWW convergence, the existing undo log as the
per-player ledger, and player color as a per-cell rebind of `--color-user-ink`.

Every seam below was read in the tree before ruling — no phantom paths survived.

---

## 1. Why Design 2 wins

Design 2's four claimed seams all verify against the actual files, with exact line citations:

| Seam | Claim | Verified |
|---|---|---|
| The ledger | `useUndoHistory.ts` — `pushEntry` single choke (L161), `replayUndo`/`replayRedo` dispatcher (L218/241), E9 r2 §1-2 trie rejection in the header (L25-30), cap 200 | ✓ exact |
| The color seam | `HandwrittenGlyph.vue:82-86` — `strokeColor = isSolved ? url(#solver-ink) : isGivenOriginal ? var(--color-foreground) : var(--color-user-ink, #2563eb)` | ✓ exact |
| The bootstrap | `persistence.ts` — `resolveInitialState` with `"url-board"` source (L398), `writeShareUrl` (L322) | ✓ |
| The overlay layer | `GameBoard.vue:791` `<slot name="overlay" />`; `BoardHost.vue:242` `<template v-if="spec.clues" #overlay>` | ✓ |

Decisive: the color mechanism. Design 2 proved on the built dist (probe screenshot
`scratchpad/t6-research/author-ink-probe.png`) that setting `--color-user-ink` per cell re-inks the
handwritten glyph with **zero component changes** — the var is already the stroke. Design 1's
alternative (an `authorTone` prop threaded through `HandwrittenGlyph` + `DigitCell`) touches two
shipped components to do the same thing. One `:style` binding at `BoardHost.vue:208`
(`<component :is="spec.furniture.cell">` — the single cell-mount site for all five games) beats it
outright.

Design 2 also brought measured numbers from real tarballs (on disk in `scratchpad/sizecheck/`:
trystero 0.25.3, @trystero-p2p/core, @trystero-p2p/nostr, @noble/secp256k1,
unique-names-generator 4.7.1), the BroadcastChannel test double, and the state-message board sync
that double-serves late joiners.

## 2. Grafts from Design 1 (each earned)

1. **CSP `_headers` change, same-commit.** `public/_headers:109` ships
   `connect-src 'self'` — this blocks the WSS signaling connections (Nostr relays and BT trackers
   alike) in production. Design 2 missed it entirely; it is production-blocking. `connect-src`
   gains `wss:`. The estate's own rule (lessons-from-t2-t4): a ruling lands with its enforcing
   config in the same commit, verified on the deployed edge.
2. **No structural rewrite of the undo spine.** Design 2's `undoIndex` → per-entry
   `undone` + `redoIds` restructure (and the fork-truncate deletion) is killed. Design 1's model is
   strictly smaller: **remote ops never enter the local stack** — they apply through the existing
   replay effects (`applyCellValue`, `setMarkSlot`) and are done. The local log stays exactly what
   it is today: MY ops, index-cursored. Solo behavior is bit-identical by construction, every
   `canUndo`/`undoDepth`/`isDirty` consumer untouched. Cost: one skip-and-consume guard (§3a).
3. **Zero new color tokens.** Design 2's eight `--player-ink-0..7` hexes are killed. The estate
   already ships four AA-gated ink tiers with dark-mode wax aliases (`index.css` L169-181 light,
   L364-369 dark: gold/red/green/orange). Player palette = `--color-user-ink` blue + those four =
   five inks, all pre-gated for contrast in both themes, zero new CSS.
4. **Nostr strategy as default.** It is trystero 0.25.x's own default, the relay set is hundreds
   deep vs. the dwindling public BT-WSS tracker pool, and it is the strategy actually measured from
   tarballs on disk (22.3 KB gz incl. @noble/secp256k1). Design 2's torrent number has no tarball
   behind it. The 4-method transport interface keeps the swap a one-word config change.
5. **The room cap = the crayon count.** Five inks, soft cap 5; a sixth player cycles inks and the
   slug name disambiguates.

## 3. Mechanism

### (a) Ledger — `useUndoHistory` extended, not restructured
- Entries gain optional `author?: string` and `lamport?: number` (absent ⇒ solo, zero cost).
- One effect at the single choke: `onEntry?: (entry) => void` fires after `pushEntry` — the entire
  local op stream (value/mark/batch) broadcasts from one seam, no per-callsite plumbing.
- **The no-clobber guard** (~5 lines in `undo()`): before replaying a `value` entry, if
  `values[pos] !== entry.next` the cell has moved on (a peer overwrote it) — skip and consume the
  entry rather than resurrect `prev` over a teammate's digit. Same check per-delta in `batch`.
  **Born-RED test mandatory** — this is the one place a plausible implementation is silently wrong.
- Remote ops NEVER push onto the stack. Undo/redo are per-player: you undo your moves.
- Epoch rule: any `state` application (deal/clear/solve/join — §3c) calls the existing
  `clearUndo()` on every peer. Undo never crosses an epoch; the whole class of
  board-entry divergence dies in one line. Solo path: unchanged.

### (b) Convergence — Lamport-LWW per cell, six lines, no library
Board state is `pos → digit` over a fixed index set; cells never move, so there is no sequence-CRDT
problem to buy. Per-cell clock `Record<pos, [lamport, author]>`; apply an op iff
`op.lamport > c[0] || (op.lamport === c[0] && op.author > c[1])`. Commutative, idempotent,
convergent. Rejected with numbers: @automerge/automerge-wasm = 2,127,414 B wasm — 17.6× the shipped
`csp_solver_wasm_bg.wasm` (121,137 B, verified on disk) and 16.7× the 127,500 B CI band; ywasm
~900 KB; yjs pure-JS costs more in Vue-ref mirroring glue than this whole protocol. A purpose-built
trie crate re-litigates the adjudication `useUndoHistory.ts:25-30` already records. **Wasm and the
CI band are untouched.**

### (c) Wire — four message kinds over trystero (nostr strategy)
- `hello {name, colorIdx?}` — identity is derived (§3e), this is just presence.
- `op {kind: value|mark|batch, …, author, lamport, gen}` — mismatched-gen ops drop (the same
  stale-drop rule `boardGeneration` already enforces locally).
- `state {values, givens…, clock, gen}` — ~1 KB for 9×9. Sent by the lowest peer id on
  `onPeerJoin` (late joiner), and broadcast by whoever executes deal/clear/solve. Board ops never
  cross the wire as pool entries — the pool stays purely local. Guarded by the existing two-tap
  dirty confirm. Late-join hardening: re-request on a 2 s no-reply timeout.
- `cur {pos}` — ephemeral, throttled 80 ms (`useThrottleFn`, @vueuse/core ^14.3.0 incumbent),
  never ledgered (cut 2).

Transport is a 4-method interface `{send, onMessage, onPeer, leave}` with two impls:
`trysteroTransport` (dynamic `import()` — **solo players pay zero bytes**) and `channelTransport`
(`BroadcastChannel(roomId)`, ~15 lines — the Playwright test double and the same-device second tab;
real P2P in CI is a flake machine, this isn't).

Session singleton follows the `useStagingBridge.ts` register-a-source pattern (verified L86-100):
`useGameState` registers `{applyRemote, snapshot, restore, clock}` on mount, clears on unmount. One
live board ever, one slot.

### (d) Bootstrap — the permalink IS the session
`?board=<blob>&s=<room>`: the existing codec carries the puzzle (round-trip-guarded, `url-board`
source restores it today); `s` is ~12 base36 chars of room id = the entire capability. "Share into
a live session" = the existing `shareBoard()` + one `.set("s", …)`. `App.vue`'s param-strip array
(L175: `["board","size","difficulty","board_size"]`) gains `"s"` — a session is board-bound, game
switch leaves it.

### (e) Identity — derived, never negotiated
`identityFor(peerId, roster)`: slug = `uniqueNamesGenerator({dictionaries:[adjectives, animals],
seed: hash(peerId)})` → "brave-otter" (hash = the FNV-1a already in `useUndoHistory.ts:107`,
exported); ink = rank in the roster sorted by `(joined, peerId)`, next-free-slot on collision, mod
5 — deterministic on every peer, zero negotiation traffic, an early peer never loses its ink to a
late joiner.

### (f) The color story, owned
- **given** = graphite `--color-foreground` — the page's ink, authored by nobody.
- **machine** = `url(#solver-ink)` rainbow — solve/fill/hint. UNTOUCHED, and stays the one
  non-human ink: no player is ever assigned rainbow, so the two vocabularies never compete. A
  peer's Solve reads as machine ink everywhere.
- **player** = `--color-user-ink`, rebound per authored cell to one of the five inks
  (`--color-user-ink` blue self-tier + `--color-green-ink`/`--color-orange-ink`/`--color-red-ink`/
  `--color-gold-ink` — light AA tiers, dark wax aliases, both already gated). Solo: no session, no
  binding, incumbent blue, zero delta.
- Implementation: `authorInk` computed (`cellAuthor × roster`) + ONE binding at `BoardHost.vue:208`:
  `:style="authorInk[pos] ? {'--color-user-ink': authorInk[pos]} : undefined"`. `DigitCell` is
  single-root with no `inheritAttrs:false` (verified) — the style falls through. Five games, one
  line.
- Print stays true black: `.glyph-svg path { stroke:#000 !important }` inside `@layer base`
  (`index.css` ~L827) beats the inline var — verified present. Add the missing `forced-colors`
  twin line in the same block.

### (g) Cursors — cut 2
`PresenceOverlay.vue` in the `#overlay` slot beside the clue layer (move the `v-if="spec.clues"`
from the template onto the clue component — 1 line in BoardHost). Percent geometry per the
futoshiki `CaretOverlay` pattern: `aria-hidden`, `pointer-events:none`, one stroked rect + name tag
per remote peer in that peer's ink. Cursor position taps the existing `@cell-focus` chain in
BoardHost's cell template (1 line). 81 cells never learn about presence.

### (h) The players section
A fourth `tray-well` in `GameControlPanel.vue` on the verified zone grammar (`HandDrawnOutline
:pose="0"` + `SheetWashiLabel anchor="tag"`, exactly as new-game/pencils/teacher's at L455/612/654)
— so it appears in the desktop rail AND the portrait drawer for free. Solo: one "play together"
button on the `ShareIcon` grammar (mints room id, writes `?board=&s=`, copies via the incumbent
share callback). In session: one row per peer — ink swatch, slug, "(you)" — plus "leave". Copy
states the trust model plainly: *anyone with this link can write on this board.*

## 4. Files (exact, with per-file change notes)

| File | Change | ~LOC |
|---|---|---|
| `web/frontend/src/games/shared/useSession.ts` | NEW — transport interface + trystero/BroadcastChannel impls, room lifecycle, roster, lamport + per-cell clock, 4-message wire, applyRemote routing into existing effects, register/clear source | +190 |
| `web/frontend/src/games/shared/playerIdentity.ts` | NEW — slug via unique-names-generator (seed = FNV-1a of peerId), deterministic ink rank over sorted roster, the 5-ink var list | +35 |
| `web/frontend/src/games/shared/PresenceOverlay.vue` | NEW (cut 2) — percent-geometry cursor rects + name tags, aria-hidden | +75 |
| `web/frontend/src/games/shared/useUndoHistory.ts` | `+author?/lamport?` on entries, `onEntry?` effect after `pushEntry`, no-clobber skip-and-consume in `undo()`; export `hashBlob`; NO structural change | +15 |
| `web/frontend/src/games/shared/useGameState.ts` | `cellAuthor` record (written on local+remote value ops, cleared on generation bump), `authorInk` computed, `applyRemote`, session source registration, `shareSession()` beside `shareBoard()`, epoch-clear on `state` apply | +45 |
| `web/frontend/src/games/shared/BoardHost.vue` | the one `:style` author-ink binding on the cell component; overlay `v-if` moved onto the clue component; `@cell-focus` chain tap (cut 2) | +8 |
| `web/frontend/src/games/shared/GameShell.vue` | hand session roster/verbs to the panel; PresenceOverlay wiring (cut 2) | +10 |
| `web/frontend/src/games/shared/GameControlPanel.vue` | the fourth tray-well: "players" washi label, solo share button / in-session roster + leave | +60 |
| `web/frontend/src/games/shared/persistence.ts` | `?s=` read on `resolveInitialState` (`session: string\|null`), optional session id on `writeShareUrl` | +15 |
| `web/frontend/src/games/shared/defineGame.ts` | `GameModel` gains `authorInk` ReadRef | +2 |
| `web/frontend/src/App.vue` | `"s"` joins the param-strip array (L175) | +1 |
| `web/frontend/src/assets/index.css` | NO new tokens; one `forced-colors` stroke guard beside the print rule | +2 |
| `web/frontend/public/_headers` | `connect-src 'self'` → `connect-src 'self' wss:` (L109) — SAME COMMIT as the feature, verified on the deployed edge | ±1 |
| `web/frontend/package.json` | `trystero ^0.25.3`, `unique-names-generator ^4.7.1` (pinned — last publish 2022; fallback = 64 inline words) | +2 |
| `web/frontend/src/games/shared/useUndoHistory.test.ts` | author stamp, no-clobber skip (born-RED), cap-200 under mixed traffic | +60 |
| `web/frontend/src/games/shared/useSession.test.ts` | NEW — LWW convergence under shuffled order across two replicas; identity determinism + collision | +70 |
| `web/frontend/e2e/multiplayer.spec.ts` | NEW — two pages, ONE context, BroadcastChannel transport, built dist; asserts solo boot loads no trystero chunk | +60 |

**Total: ~+460 product / ~+190 tests. Deletions: none required.** Deps: 2, both lazy-chunked
(nostr strategy measured 22.3 KB gz incl. crypto; animals+adjectives dicts ~6 KB gz tree-shaken —
verify the tree-shake at build, the package is old CJS-era). Wasm, CI band, solver: untouched.

## 5. MVP cut

**Cut 1 — ships first (2-player same-board sync, in color).** useSession with `hello`/`op`/`state`
over lazy trystero-nostr + the BroadcastChannel double; `?s=` bootstrap; author-stamped value ops +
LWW clock; no-clobber undo guard; epoch-clear rule; players tray-well (roster/invite/leave);
author-ink digits (the color rides free — authorship is on every op and the binding is one line);
`_headers` wss:. N-peer works by transport nature; tuned and tested at 2.
**Cut 2 — presence.** `cur` messages + PresenceOverlay; peer-leave grace; state re-request timeout
hardening; the deal-in-session confirm copy.
**Cut 3 — endurance.** Snapshot-role migration off the lowest peer, reconnect backoff, marks-share
toggle (marks stay private in cuts 1-2), ink cycling past 5, strategy fallback config.

## 6. Visual verification (the standard of proof)

Two Playwright pages in ONE browser context (BroadcastChannel; separate contexts don't share the
channel) against the built dist at `localhost:4248`, then a trystero smoke across two real browser
profiles against the deployed edge (CSP proof). Screenshots to `scratchpad/t6-research/`, baselines
`d1-board-desktop.png` / `mobile-board.png`:

1. Desktop 1440×900, solo — players well shows "play together" in the tray-well grammar (compare
   eyebrow/outline against the pencils well).
2. A deals 9×9 MEDIUM, invites; B opens the URL — identical board, no deal flash; well shows two
   roster rows, ink swatches, slugs, "(you)".
3. A types a digit — LOOK in B: the glyph draws in A's assigned ink, not B's, not rainbow. B types —
   LOOK in A. Crop the board both sides.
4. A presses undo on a cell B has since overwritten — A's undo skips (no-clobber); B's digit stands.
5. A deals mid-session — both boards follow; BOTH undo stacks empty (epoch rule).
6. Solve in either — rainbow in BOTH pages (machine ink never claimed by a player).
7. Repeat 1-3 in DARK (wax-alias inks) — all five inks legible at glyph weight on the dark paper.
8. Portrait 390×844 — players well inside the controls drawer, same grammar, no horizontal scroll.
9. Print preview on a session board — glyphs true black (the `@layer base` rule beating the inline
   var).
10. Solo boot network log — no trystero chunk (the lazy-load guard).
11. Edge smoke: two devices on sudoku.babb.dev post-deploy — join succeeds (proves `wss:` CSP).

## 7. Risks

- **Undo under concurrency** — the no-clobber guard is the one silently-wrong-able spot; born-RED
  before implementation (graft of D2's own discipline).
- **CSP** — the `wss:` grant must land same-commit and be verified on the deployed edge, not dev
  (D2 missed it; the estate's ruling-with-config rule applies).
- **Relay availability** — public Nostr relays can be blocked/slow; a failed join must surface
  through the incumbent `SolverErrorNote` paper-note grammar, never a silent dead room. Custom
  relay list is a config escape hatch.
- **Trust model** — the link is the whole capability; no eviction, no identity. Honest for a
  puzzle; the well's copy says so.
- **Late-joiner race** — lowest-peer snapshot role can vanish mid-join; cut 1 carries the 2 s
  re-request, migration proper is cut 3. `hello` racing an early `op`: roster rows tolerate a
  nameless peer for a beat rather than dropping ops.
- **iOS Safari** — WebRTC data channels are supported, but WebKit is this estate's chronic surprise
  class (T4 record); an E8-style two-device smoke gates any iOS claim.
- **unique-names-generator staleness** — frozen word list, pinned; 64-word inline fallback if the
  tree-shake fails at build measurement.
- **No JS byte gate in CI** — the e2e no-trystero-chunk-on-solo-boot assertion is the guard;
  cheaper and more honest than a new byte band.

## 8. Open questions for the owner

1. Deal inside a live session: any player (behind the two-tap dirty confirm) or host-only? Brief
   assumes any-player; host-only is a one-line gate in the well.
2. Marks: private (cuts 1-2, recommended — they're personal notes) with a shared toggle in cut 3?
3. `?s=` on leave: strip (clean-URL preference) or retain for reload-rejoin? Brief assumes strip.

---

## AUDIT RIDER (2026-08-02 — overrides the body where they conflict)

1. **`e2e/zone-grammar.spec.ts` joins the files table** — the fourth tray-well reds
   the census three ways (`:68` tape-rank, `:121` count-3, `:125` rank array) plus
   the per-well walks (`:146/:291/:317`). Same commit as the well: census goes to
   four with "players" in rank position, and the walks gain the players row.
2. **The players well ships its mark-4 hint tape** — controls establishes tapes on
   the other three wells; consistency admits no hole.
3. **Font-census pricing**: solo boot (the census state) shows only the static
   "play together" string — price it against the ledger; generated slugs never
   appear in a census frame. `CAGE_LABEL`-class instability doesn't arise in cut 1.
4. **Comment truth**: `_headers:57` documents `connect-src 'self'` as "the frontend
   solves in-browser" — retire it in the same commit that grants `wss:`.
5. **`unique-names-generator ^4.7.1` stays** (the owner's words: "a standard slug
   lib"); the 64-word inline fallback note dies.
6. **§8 gains the trie veto as a priced owner question**: veto restores the literal
   trie at its cost — a bespoke persistent-structure ledger the estate already
   rejected once (`useUndoHistory.ts:25–30`), a new module with no library arm, and
   re-derivation of undo/redo semantics atop it.

---

## AUDIT RIDER 2 (2026-08-02 — the owner's 16+ order; overrides body and rider 1 where they conflict)

The owner: "plan to handle at least 16+ players, though within reason. KISS."

1. **No player cap anywhere in code.** The 5-player cap dies with its reason (see 3).
2. **Mesh sizing stands for 16+**: board ops are bytes at human pace; the mesh arm's
   practical ceiling is connection setup (~16–24 peers), and the DO-relay fallback
   is also the scale arm beyond it (star topology). No code change — the room just
   isn't capped.
3. **Player ink = one formula, not the crayon tiers**: remote player i gets
   `oklch(L C (i × 137.5deg))` with L/C fixed per theme band so contrast clears
   AA by construction for any N; you keep `--color-user-ink`. The crayon tiers
   return to difficulty alone — §3f's tier assignment is struck, and the
   chip-vs-digit coincidence (rider-1 era) is retired rather than watched.
4. **Roster growth**: the players well wraps and scrolls past a handful of rows
   (max-height + overflow, incumbent well idiom) — 16 rows must not stretch the
   card.
5. **Slug dedupe on join**: two-component animal names collide rarely but not
   never at 16 — on collision, re-roll (one loop, no numbering suffix).
6. **Cursor slice note**: at 16 peers, cursor broadcasts throttle (rAF-coalesced or
   ~80ms, whichever the slice's incumbent idiom prefers). MVP cut 1 is unaffected.

---

## T6.1 RIDER (post-close, the owner's order — overrides body and both riders)

1. **§7's "relay availability" risk is CLOSED, not mitigated.** The public relay
   list is ABROGATED. `web/relay/` ships the NIP-01 subset trystero speaks on a
   hibernating Durable Object beside the Pages deployment, and `relayConfig.urls`
   is the one config word the seam promised. There is no fallback list, by
   election: 47–66 s first contact is not a fallback. Measured on the local rig —
   socket open 5–7 ms, first contact 57–322 ms (4 of 5 runs; the fifth 7.1 s on
   trystero's 5,333 ms announce interval), digit 1–31 ms, prune 1–3 ms.
2. **CSP narrows with it.** `connect-src 'self' wss:` → `'self'` plus the named
   relay origin. The scheme-wide grant existed because a rotating public list has
   no origin to name; one operator has one.
3. **The well says "connecting…"** while the wire isn't carrying or the room hasn't
   answered, and draws no roster until it has. A page that OPENED the table is at it
   as soon as the socket opens; a page that followed a link waits for the room,
   which is the state that used to be invisible.
4. **§6's verification list gains its honest arm**: the relay arm is probed against
   `wrangler dev` on :4245 with two SEPARATE browser contexts (a BroadcastChannel
   cannot cross one), which is the proof the localWire e2e deliberately cannot give.
5. **The trie veto (§8/rider-1 §6) is declined at its price**: the op ledger carries
   20,000 ops from 16 authors, adversarially interleaved, to byte-identical
   convergence across six replicas — `src/games/shared/useSession.stress.test.ts`.
