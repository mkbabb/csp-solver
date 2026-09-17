# R5 — THE PLAYER MARK'S SUBSTRATE (T9-W7 round zero)

Census lane R5: identity, colour, presence, the lobby. Read-only on the product. Every
number below is re-derived on THIS tree (2026-09-17, W3/W6 uncommitted in the worktree);
where the formation census (registry F18, 2026-08-10) is stale, §6 says so.

Instruments and probes in this directory:

| file | what it is |
|---|---|
| `instruments-family-law.mjs` | born-RED node instrument — the accent-family law over the walk. Exit 1 at HEAD. |
| `instruments.spec.ts` | born-RED Playwright instruments I2/I3/I4/I5. All four RED, both engines. |
| `probe.spec.ts` | the read-only census probe (roster, board ink, cursor, join wash, heartbeat, expiry, the 8-bound, the head's geometry). |
| `ink-census.mjs` / `ink-census.txt` | the walk's arithmetic: cycle, separation, contrast, the collision set. |
| `engine-vs-maths.txt` | the engine's own painted bytes for all 144 indices vs the arithmetic. |
| `frames/` | two crops, 29.9 KB total. |

Run off the estate: a scratch config (copy of `playwright.config.ts`, no `webServer`,
`baseURL` 127.0.0.1:4231) against `npx vite --host 127.0.0.1 --port 4231 --strictPort`.
Nothing in `src/`, `e2e/` or `scripts/` was touched.

---

## 1 · The substrate, end to end

**Identity.** `playerIdentity.claimIdentity(room)` mints or reclaims `p-<12 hex>` per room
(`playerIdentity.ts:183-194`). Two halves: a durable `localStorage` map
`session-identity-v1` = `{rooms: room → {id, at}, live: string[]}`, and a per-tab
`sessionStorage` map `room → id` that makes a reload continuous. `IDENTITY_CAP = 8`
(`playerIdentity.ts:98`) prunes BOTH halves at every write.

**The name.** `slugFor(peerId, taken)` (`playerIdentity.ts:49-60`) hashes the id with the
estate's FNV-1a and hands a NUMBER to `unique-names-generator`; a taken slug re-rolls off
the next salt. The dictionaries are filtered to what the pencil can draw
(`/^[a-ik-wyz]+$/` — no `j`, no `x`). Re-derived at HEAD: **1145/1202 adjectives ·
345/355 animals · 395,025 names**.

**The colour.** `inkFor(index)` (`playerIdentity.ts:68-70`) is one line:

```
--color-user-ink: oklch(var(--peer-ink-l) 0.11 {(index × 137.5) % 360}deg)
```

`--peer-ink-l` is 0.5 on paper (`index.css:162`) and 0.8 at night (`index.css:375`).

**The index.** `mint()` (`useSession.ts:525-539`) takes `inkIndex[id] ?? inkCursor++`.
Every id takes one, **your own included** — but `ink` is `{}` for self (line 537), so your
cells and your roster row bind nothing and fall through to `--color-user-ink`.
`adoptInk(k)` (`useSession.ts:547-568`) rebinds from the epoch holder's assignment and
continues the cursor from `max + 1`. `k` rides every `st` (line 712).

**Where the colour lands.** `authorInk` (`useSession.ts:402-411`) → one `:style` at
`BoardHost`'s single cell-mount site, five games. `cellAuthors` (422-432) → the naming
half; measured accessible name: `Row 1, column 4, tragic-mockingbird's entry 7`.
`peerCursors` (349) → `BoardHost.peerCursorInk` (66-80) → `--color-peer-cursor-ink`, drawn
by `gameCell.css:225-241` (ghost tier 4: stroke 4, stroke-opacity 0.55, fill-opacity 0.04,
sketched on over 180ms, never tweened between cells).

**Presence.** `HEARTBEAT_MS = 15000`, `PRESENCE_EXPIRY_MS = 45000`
(`useSession.ts:616, 624`), armed on ANY traffic (`armPresenceExpiry`, 630-635) — the beat
is `hi`, not a fifth kind. Measured on a live two-page room: 8 `hi` + 8 `st` in a 34,000ms
window, inter-beat gap **15,000ms** (14,694 + 306). A silenced page left the roster
**42,276ms** after its last frame stopped (last traffic ~2.7s earlier ⇒ 45s), and the well
spoke `you're the only one on this board.`

**The wire.** `Kind = hi | op | st | cur` plus `bye` out of band (`useSession.ts:179`).
`st` = `{b, c, e, ea, g, z, k}`. Measured `st` for a 9×9 EASY board with two ids in `k`:
**1,033 B** (relay `MAX_FRAME` 65,536 — `web/relay/relay.ts:172`).

**The well.** `GameControlPanel.vue:1033-1202` — a `HandDrawnOutline` well tagged `players`
(washi seed 67) with the hint tape as its `aria-describedby` (seed 61), the invite button
(`v-if="!session.roomId.value || aloneInRoom"`), three live regions, and `leave`. Styles
1642-1826: roster `max-height: 7.5rem`, row in `--font-hand` at `--type-tag`, swatch a
0.7rem circle on `--color-user-ink`. Measured: well 284.2 × 66.4 solo → 284.2 × 88.5 with
two rows; row 19–20px; swatch 11.2px; name 14.048px.

**The invite.** `copyAct` (`GameControlPanel.vue:303-366`) written once, called twice;
`inviteAct` (381) calls `useGameState.shareSession` (`useGameState.ts:1016-1019`) =
`startSession()` + `shareBoard()`. `?s=` is written synchronously, so the href is whole
before the clipboard is touched. Copy: `Play` / `copied!` / `couldn't copy`, with one
`role="status"` channel for both acts (T9-W3 §3.6).

**The join wash.** `useJoinWash.WASH` owns every number (join 1180ms/0.95, rejoin
880ms/0.65, leave 740ms/0.45; boot-suppress 1200, coalesce 400, per-id gap 4000). Measured
live past the suppression window: `beats` 0 → 1, `traceOpacity` 0.95, `traceInk` the
arriving peer's, **4 join poses / 1 active**, stroke-width 8px, dash mid-draw 888.99. The
roster's half is three CSS one-shots (`GameControlPanel.vue:1705-1760`); a joining row was
caught mid-fold at 5.2px of its 19px.

**The @mbabb mark.** `src/pencil/chrome/AttributionCard/AttributionCard.vue`, mounted twice
in `App.vue` (802 desktop `.corner-left`, 813 mobile `.mobile-attribution`, `v-show`
playing). Both poses `position: fixed; top: var(--head-rule); left: 0`. Measured, both
engines: trigger **75.5 × 39.8** at (0, 12) desktop / (0, 0) phone, Fira Code 14px; the card
**256 × 151** at (0, 51.8), popover at 80%, 2px border at 30%, radius 16px, padding 16px.
The head's other corner: sun 208 × 208 at x=1072 (vw 1280); 64 × 64 at x=326 (vw 390) — so
a phone's head has a **250.5px free band** between the mark and the sun.

---

## 2 · Findings

**F1 — a player's colour is a PAGE's colour, not a player's.** Every page paints itself
`--color-user-ink` and everyone else from the walk. Measured, both engines: the same player
is `rgb(37, 99, 235)` on their own screen and `oklch(0.5 0.11 0)` on their neighbour's. In a
room of N, N people are simultaneously "the blue one", each on their own screen. M14's
"each player should have a unique colour" is false at HEAD — and it is false in the one
place the mark puts it, the top-left, where you look at YOURSELF.

**F2 — the walk's cycle is 144, and a room of 16 is already dense.** `hue = (i × 137.5) % 360`
yields exactly 144 distinct hues and repeats at i = 144. Minimum separation: 52.5° over the
first 4, 32.5° over 8, **12.5° over 16**, 5.0° over 40, 2.5° over the whole cycle.

**F3 — the contrast claim holds, and it holds wider than it says.** Read back off a 2D canvas
in both engines (the only honest read: both serialise `color` back as the `oklch()` it was
written as), all 144 indices, both themes:

| | vs `--color-background` | vs `--color-card` |
|---|---|---|
| light, `--peer-ink-l` 0.5 | worst **5.22:1** | worst **5.35:1** |
| dark, `--peer-ink-l` 0.8 | worst **9.71:1** | worst **9.50:1** |

0/144 under AA 4.5:1; 0/144 under the 1.4.11 3:1 non-text floor. Engine vs arithmetic:
0/144 mismatched light, 9/144 at ±1 byte dark. `playerIdentity.ts`'s header quotes
"worst 5.26:1 light, 9.56:1 dark, measured over 40 indices" — right to two figures, and
understating its own scope.

**F4 — the family law is broken 37 times inside a realistic room.** Reading the 29 reserved
ink hexes straight out of `index.css`, **11 of the first 16 peer indices** land within 12°
of an ink that shares their surface:

| peer index | hue | collides with | Δ |
|---|---|---|---|
| 11 | 72.5° | `--color-solver-ink-5` #92600a | **0.2°** |
| 11 | 72.5° | `--color-crayon-orange` (dark) #f5b35c | 0.7° |
| 15 | 262.5° | `--color-user-ink` #2563eb — YOUR OWN INK | **0.4°** |
| 15 | 262.5° | `--color-solver-ink-3` #2059c8 | 0.6° |
| 0 | 0° | `--color-solver-ink-1` #c2286e | 1.0° |
| 13 | 347.5° | `--color-solver-ink-1` (dark) #f9a8d4 | 1.5° |
| 10 | 295° | `--color-solver-ink-2` / `--color-progress-ink` | 1.4–2.3° |
| 8 | 20° | `--color-teacher-red` #e8315b, `--color-red-ink` | 5.8–7.8° |
| 11 | 72.5° | `--color-crayon-orange` #f4a236 | 3.8° |
| 7 | 242.5° | `--color-crayon-blue` (dark) #6aabeb | 6.8° |
| 9 | 157.5° | `--color-solver-ink-4` (dark) #6ee7b7 | 7.5° |

Only indices **2, 4, 5, 12, 14** are clean. The worst pairs are not decorative neighbours:
index 11 and solver-ink-5 differ by 0.2° of hue, 0.000 of chroma and 0.03 of lightness —
a peer's digits and the solver's answers, on the same board, in the same colour. Index 8 is
a peer writing in the teacher's red. Index 15 is a peer writing in YOUR blue.

**F5 — the 8-bound has two teeth, and one of them bites.** Measured in both engines:

- *rooms*: a 9th room evicts the least-recent binding. Returning to room-0 minted a NEW id
  (`p-971a…` → `p-b49b…`) — new slug, new ink index, and the cells you already wrote stay
  keyed to the id you lost.
- *live claims*: `store.live.slice(-8)` silently drops the FIRST live page's claim when a
  9th page claims. A tenth page then opening that first page's room is handed **the live
  id**: measured `collided: true`. Two pages under one peer id filter each other out as
  self — `playerIdentity.ts`'s own "a room of one, twice", by the guard rather than despite
  it.

**F6 — an agreed ink index is reassignable, and it is reassigned before the board is
believed.** `adoptInk` writes `inkIndex[id] = index` unguarded, and `onMessage`'s `st` arm
runs it ABOVE `source.restore` — so a frame whose board is later refused has already
re-inked the room. Measured with a rival `st` (a newer epoch, a shifted `k` — exactly the
frame a peer publishes when it deals before adopting): a peer's ink moved index 1 (137.5°)
→ index 6 (327.5°) on one page while their own page kept index 1. `playerIdentity.ts`'s
claim — "the index is never reassigned … which is the whole of why a rejoiner cannot arrive
to find somebody else in their colour" — is true of `mint` and false of `adoptInk`.

**F7 — presence is real now, and priced.** Beat 15,000ms on the wire; roster drop at ~45s of
silence; `st` 1,033 B for a played 9×9. At two players the beat costs ~4 `st` per 15s. The
`useSession` header's worst case (9,401 B) is the empty-board ceiling, not the measured
board.

**F8 — the roster is off-screen on a phone.** 390 × 664, dock OPEN: the players well's
invite verb sits at **y = 775**, 111px below the fold, inside the sheet's own scroll. Dock
closed: y = 1223. So "who is here" costs a tab, a scroll, and knowing the well exists.

**F9 — the roster reads six rows.** `max-height: 120px` over a measured 20px row. The
owner's "16+ players within reason" puts 10 rows behind a scroll inside a well behind a
scroll inside a sheet.

**F10 — the self marker is orphaned in its own row.** Measured: swatch 11.2px at x=853.9,
name box x=871.5 w=227 (`flex: 1 1 auto`), `you` at x=1104.9 w=17.2 — the qualifier sits at
the far edge of a 284px well, roughly 145px of empty box from the name it qualifies
(`frames/players-well-3up-light.png`).

**F11 — the tag overhangs by 14.0px.** `.washi-tag`'s top is 14.0px above the well's own
top edge. That is the pose, and it is the pose that clipped off the case edge in the owner's
Frame B.

**F12 — the indication already speaks (W3 landed).** `players-status` (polite, unconditional
region, conditional sentence), `players-roster` (`role="log"`, polite,
`aria-label="who's on this board"`, focusable only when non-empty), `players-alone`
(sr-only polite). Measured utterance: `you're the only one on this board.` A lobby inherits
this idiom; it must not mint a second region saying the same thing.

---

## 3 · Constraints a design must honour

1. **AA on four grounds.** Every per-player colour clears 4.5:1 on `--color-background`
   AND `--color-card`, light AND dark. Today's floors: 5.22 / 5.35 light, 9.71 / 9.50 dark,
   over all 144. Re-derive on the engine's painted bytes, not on hex arithmetic.
2. **3:1 non-text** for the swatch, the peer-cursor ring and the join trace (WCAG 1.4.11) —
   priced AT the opacity each is drawn at (the cursor ring runs stroke-opacity 0.55).
3. **The collision set.** A per-player colour must be distinguishable from all 29 reserved
   inks in `index.css`, both themes: `--color-user-ink`, `--color-focus-sketch`,
   `--color-crayon-{green,orange,rose,blue,gold}`, `--color-{green,orange,gold,red}-ink`,
   `--color-teacher-red`, `--color-gold-star`, `--color-progress-ink`,
   `--color-solver-ink-1..5`. R2 owns the family law; this is the set it must clear.
4. **π.** `filterBudget` stays 9. The join trace is grain-BAKED (4 poses, opacity-swapped,
   unmounted at `progress === 0`); a lobby may not mint a live filter.
5. **Solo stays byte-identical.** Your own cells bind nothing today. Whatever fixes F1 must
   not put a style binding on a solo board.
6. **The pencil's cut.** `patrickhand-subset.woff2` has no `j` and no `x`. Any lobby copy in
   `--font-hand` obeys the same cut the slug dictionary does.
7. **M16.** Plain product copy. The well's existing voice is the register: "share this board
   and everyone writes on the same grid", "you're the only one on this board.", "leave".
   No jargon, no em dashes, no machine's name.
8. **M19.** A peer arriving is a REMOTE event; it may never move the reader's focus or open
   a surface over their board. The lobby opens on the reader's press.
9. **W3's idiom rides it.** `role="log"` for additions, one polite region for the state, one
   `role="status"` for act outcomes. No second region for a thing already spoken.
10. **No player cap.** The room is uncapped by design; the lobby holds 16+ without growing
    the card and without a scroll inside a scroll.
11. **The wire pays.** Anything the lobby shows about a peer must already be derivable from
    `hi` / `st` / `cur` — id, slug, ink index (`k`), cursor, epoch's `g`/`z`. A new fact is a
    new message kind and a relay question.
12. **Decided history.** Multiplayer CONTROLS stay in controls (M14, the owner's word). The
    mark is the indication and the lobby; it is not a second controls surface.

---

## 4 · What a lobby must show — from what the session already knows

| the question | the source at HEAD |
|---|---|
| who is here | `session.players` — self first, then arrival order |
| their colour | `Player.ink`; the room-agreed index is `k` on the `st` |
| which one is me | `Player.self` |
| am I at the table | `session.live` + `session.roomId` → connecting / alone / N here |
| who just arrived, and is it a return | `onSessionEvent` — `join` \| `rejoin` \| `leave`, with slug, ink, `at` |
| who just left | `known` retains departures; `useJoinWash.departing` holds the row 740ms |
| where they're looking | `peerCursors` — `pos`, or `null` said out loud for "looked away" |
| what they wrote | `cellAuthors` — already spoken in each cell's accessible name |
| the room's link | `?s=` — `readSessionParam()`; the invite act copies `location.href` |
| leave | `leaveSession()` (drops the wire AND the param) |
| which board we're on | `g` (game) and `z` (size) on the epoch |

**What it must NOT pretend to know**: there is no ack, no delivery proof, no latency, no
per-peer connection state (both arms derive presence from traffic), no typing signal, no
avatar. A lobby that shows a green "connected" dot per peer is inventing a fact the wire
does not carry; what it may honestly show is "last heard from" against the 45s expiry.

**The sketch** (content, not chrome): a head-left mark that is grey when solo and carries
the room's colour when live; pressed, a small surface in the house hand — one line of state
(`3 here` / `just you` / `connecting…`), a row per player (colour · name · `you` beside the
name, not at the far edge), the link as selectable text with one copy act, and `leave`. The
nearest existing idiom is the @mbabb card itself: 256 × 151, popover at 80%, 2px border at
30%, radius 16px, hung off `--head-rule` at `left: 0` — a card that already opens on press
from exactly this corner, in exactly this pose, at both widths.

---

## 5 · Born-RED instruments

| id | file | asserts | HEAD |
|---|---|---|---|
| I1 | `instruments-family-law.mjs` | no peer ink in the first 16 indices within 12° of a reserved ink (both read from source) | **RED** — exit 1, 37 collisions |
| I2 | `instruments.spec.ts` | a player's own swatch is the colour the room paints for them | **RED** — `rgb(37,99,235)` vs `oklch(0.5 0.11 0)`, both engines |
| I3 | `instruments.spec.ts` | a player mark lives in the head's left corner and opens a lobby | **RED** — 0 candidates, both engines |
| I4 | `instruments.spec.ts` | an agreed ink index survives a rival assignment | **RED** — 137.5° → 327.5° on one page only, both engines |
| I5 | `instruments.spec.ts` | a live identity claim is never re-issued to a second page | **RED** — `collided: true`, both engines |

Trap banked while writing them: `node instrument.mjs | tee log` reports the TEE's exit code,
not the instrument's. Run gates bare.

Second trap: the two pages in a room publish MIRRORED `k` maps (each with its own id at 0),
so an instrument that "swaps" whichever `st` landed last can reproduce the other page's
assignment exactly and pass while proving nothing. I4 shifts by 5 instead — every id onto an
index neither page has ever held.

---

## 6 · What moved since the formation census (registry F18, 2026-08-10)

- **Presence did not exist.** The 15s beat and the 45s expiry are T9-W6 §3.7 (2026-09-17).
  At formation the roster lied about any page whose socket stayed open behind it, and two
  files said so in their headers. Both notes are now the cure's.
- **The three live regions were `v-if`'d.** T9-W3 §3.4 made the regions unconditional and
  the sentences conditional; the 0→1 case (the first person at the table) was never spoken
  before it.
- **The invite verb's note moved.** T9-W2 §2.5 took its tape out of the scrollport and into
  the card's one note berth; at formation it covered 68.4% of the checking well's `Live`
  option in both engines.
- **The copy outcome now speaks.** T9-W3 §3.6 put both acts on one `role="status"` channel
  and put the accessible NAME on the sublabel's own gate.
- **The mobile @mbabb instance was re-ordered in the DOM.** T9-W3 §3.7 — the head now tabs
  left-then-right on both platforms. Its PIXELS did not move (both poses are `fixed`).
- **Unchanged since formation**: the walk, the band, `IDENTITY_CAP`, `adoptInk`, the roster
  markup's shape, the join-wash numbers, and the @mbabb card's geometry. Every F above that
  names one of those is a formation-era fact re-measured, not a regression.
