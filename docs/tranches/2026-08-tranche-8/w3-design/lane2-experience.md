# T8-W3 · lane 2 — EXPERIENCE-FIRST

Marks M1, M11, M12, M13, M14. Design only; no implementation, no source touched.
Every number below is either measured on the real surface at `d152a6a9` (probes named inline)
or cited to the line that already carries it.

---

## §0 · THE CENTER

**The estate already contains every mechanism these five marks need. The design's job is
casting, not construction.**

Seven shipped, gated mechanisms do the whole of M1/M11–M14:

| the moment | the mechanism that already renders it |
|---|---|
| the board takes a player's colour | the progress trace — `HandDrawnGrid.vue:437-443` |
| a name arrives | `ink-write-in` — `index.css:1072-1079` |
| a compartment grows without reflow | the crib fold `0fr→1fr` — `GameControlPanel.vue:922` |
| a name appears on hover | `SheetWashiLabel` — `pencil/sheet/SheetWashiLabel.vue` |
| a selection ring sketches itself on | `ghost-draw-on` + the 3 ghost tiers — `gameCell.css:189-249` |
| a finite animation with zero rest cost | `createSequenceSubscription` — `pencil-boil/dist/vue.d.ts:104` |
| what's saved in a game I'm not playing | the cross-game ledger — `useStagingBridge.ts:129-245` |

The net new substrate in this whole design is **one wire verb (`sel`) and one widened ledger
field**. Everything else is a rebinding, a cast, or a deletion. That's the argument I'd put
against a lane that wants a presence layer, a preview-model abstraction, or a session state
machine: the moments don't need them, and the estate's own rulings say a mechanism nobody
reads is a lie about where a number comes from (`pencilConfig.ts:6-12`).

---

## §1 · WHAT THE PROBE FOUND (the measured ground)

Probe: `playwright` over the built `dist` served at `127.0.0.1:4230`, chromium + webkit,
`?view=gallery`, every snap index, seven widths. Scripts in the session scratchpad.

### M11 is two independent defects, and neither is "the frame is too narrow"

T7-W7 already made the frame **three slots** at ≥64rem (`GameGallery.vue:889-899`). It still
shows two. Measured, both engines:

| width | frame | idx0 | idx1 | idx2 | idx3 | idx4 |
|---|---|---|---|---|---|---|
| 1280 | 1056 | **2** | 3 | 3 | 3 | **2** |
| 1920 | 1056 | **2** | 3 | 3 | 3 | **2** |

**D1 — THE END POSE.** `--edge` is `(frame − slot) / 2`, which at a 3-slot frame is exactly
**one whole slot** (measured 352px at 1280). At index 0 the frame's left third is manufactured
air. Sudoku is index 0 *and* the eager default game, so **the deck the owner opens is always
the two-card pose.** T7-W7's own comment calls that gap a feature ("the end poses read as the
deck's beginning"); the owner read it as the mark. Both end poses fail; three of five indices
were never the complaint.

**D2 — THE CAP.** The frame is `calc(var(--card-w) * 3)` with `--card-w` capped at 22rem, so it
never exceeds **1056px**. At 1920 that is 432px of dead air *per side* while two of five games
sit off-screen. Measured `airL 432` at 1920.

### M12 is not "the previews are stale". They are canned.

Every flank face is `PosterBoard` fed **hard-coded givens** from the game's `*Poster.vue` — "a
still photograph of a board, never a live model" (`PosterBoard.vue:41-43`). Only the *active*
card of the *current* game shows the real board, and only because the one live board is
teleported into it (`useLiveFace.ts`, `GameScene.vue:91`).

So the deck tells the truth in **words** and lies in the **picture**: `sublineFor`
(`GameGallery.vue:384-392`) correctly reads "9×9 hard · dealt" off the ledger while the face
under it shows a board nobody has ever played. That is exactly the m6 screenshot.

The persistence half of M12 mostly works already: `createPersistence` restores from
localStorage on remount (`persistence.ts:434-442`), and `setGame` strips the URL params that
would out-rank it (`App.vue:188-189`). One real hole — **there is no unmount flush.**
`queueSave` debounces 300ms (`useGameState.ts:977-983`) and nothing calls `saveBoardState` on
teardown, so a switch within 300ms of a keystroke loses it from disk *and* from the still.

### M13's central fact

`setGame` deletes `s` from the URL (`App.vue:188`) and the outgoing scene's unmount runs
`clearSessionSource` → `leaveSession` → `teardown` → `wire.leave()` → `bye`
(`useSession.ts:337-341`, `relayWire.ts:160-166`).

**Switching games silently evicts you from the room and destroys your way back.** The mid-game
guard ribbon never fires for it — that ribbon is armed on `dirty`, which is about *your marks*
(`GameGallery.vue:319`), and says nothing about the four other people on the board.

The gallery is therefore a trapdoor: **browsing is safe** (the scene stays mounted, the board is
teleported not unmounted, so the session survives), **choosing is fatal**, and nothing on screen
distinguishes them.

---

## §2 · M11 — THE SPREAD

The deck's own fiction is "a spread of paper worksheets dealt onto a desk"
(`GameGallery.vue:6`). A spread doesn't slide itself so the sheet you're reading sits dead
centre when it's the first sheet. Its left edge rests against the desk.

### The three moves

**Move 1 — the ends rest flush.** `--edge: 0px` at ≥64rem. The leading slot of air goes; the
clamp in `targetScrollLeft` (`useCarouselGlide.ts:140`) already does the right thing once the
manufactured air stops defeating it. The phone keeps its spacers — the 78vw peek deck is a
one-card frame by design and the neighbour-peek *is* its swipe affordance.

This also deletes the estate's most-scarred declaration on the desk. The `align-self: stretch`
spacer cure (`GameGallery.vue:846-854`, the T4-P1 KENKEN-REACHABILITY class) exists because
WebKit omits a zero-*area* box from `scrollWidth`. With zero-*width* spacers the desk has no
scrollWidth contribution to lose. Measured: `maxScroll 704` at 1280 in **both** engines, which
is exactly `5 slots − frame`. The hazard class leaves the desk.

**Move 2 — the frame grows by whole ODD slots.** 3, then 5. Not 4.

I tested 4 and it fails, on the estate's own rule. With 5 cards in a 4-slot frame, centring
index 2 puts `scrollLeft` at **half a slot** (176px), so every card straddles the frame edge.
Measured at 1456 and 1512, both engines: `shown 5 whole 3`. Odd counts put `scrollLeft` on a
whole multiple of the slot at every index, so edges can only land on slot boundaries. That is
T7-W7's ruling, and the probe re-derived it rather than reciting it. **The 4-slot rung is
declined on evidence.**

```
--card-w:     min(22rem, calc((100vw - 3rem) / 3))   /* unchanged: the 3-up floor */
--deck-slots: 3
@media (min-width: 113rem) { --deck-slots: 5 }        /* 1808px = 5×352 + 48 */
.gallery-viewport { width: calc(var(--card-w) * var(--deck-slots)) }
```

**Move 3 — depth grades by distance.** Today every flank is `scale(0.9) / opacity 0.62`
(`GameCard.vue:335-336`), so with three or five cards up, `d=2` looks identical to `d=1` and
the spread reads flat. A flank at 0.62 is barely "seen", which is half the owner's complaint.

| distance | scale | opacity |
|---|---|---|
| 0 (active) | 1.00 | 1.00 |
| 1 | 0.94 | 0.78 |
| 2+ | 0.88 | 0.58 |

The far end lands where today's single flank already sits, so nothing gets dimmer than it is
now and the near flank gets **brighter**. One custom property `--d` per slot, set from
`Math.abs(i - activeIndex)` — the gallery already computes exactly this shape in `poseFor(i)`
(`GameGallery.vue:170-172`). Compositor channels only, on the transition `.game-card` already
declares (`--card-step-ms` + `--ease-glassGlide`, `GameCard.vue:338-341`). No new machinery.

### The measured result

| width | slots | card | frame | air/side | cards at EVERY index | centre face |
|---|---|---|---|---|---|---|
| 1024 | 3 | 325 | 976 | 24 | **3** | 271px |
| 1280 | 3 | 352 | 1056 | 112 | **3** | 297px |
| 1808 | 5 | 352 | 1760 | 24 | **5** | 297px |
| 1920 | 5 | 352 | 1760 | 80 | **5** | 297px |

Chromium and WebKit agree cell for cell. Centre face 297px against today's 304 — a 2% cost for
a whole extra card. Dead air at 1920: 432 → 80 per side.

At 5 slots `maxScroll` is **0**: the deck stops being a carousel and becomes a spread. Every
game is one click away, the arrows move the highlight without moving the track, and the pips
become a position tell for a deck that no longer has positions to hide.

**Mobile is untouched.** 390/430 keep the 78vw peek deck. A phone shows one card and a sliver;
that's the right answer there and the mark is a desk mark.

### What the active card loses

It stops always being centred. At index 0 it sits at the frame's left, at index 4 at the right.
I take that trade deliberately, and it's the one place this lane reverses a ruling on felt
grounds: **"which one is chosen" is the depth grammar's job, not position's.** The active card
is the one at full scale and full ink with a live board in its face and a scribble under its
name; the three around it are visibly quieter. Position is what tells you where you are in the
deck, which is the pips' job and the live region's.

---

## §3 · M12 — THE FACE IS THE BOARD

**A card's face shows the board that is actually saved there.**

Not a live model — a **true still**. `PosterBoard` already takes `values: Record<string, number>`
and renders it filterless at pose 0, enrolling nothing (`PosterBoard.vue:16-21`). The
constraint that produced it ("only ONE live board mounts at any instant") is about *models* —
Worker, solver, reactivity — not about *pixels*. A still of a real board costs exactly what a
still of a canned board costs.

The data is already being read and thrown away. `readPersistedBoard`
(`useStagingBridge.ts:216-245`) parses `values` and `givenCells` off each game's blob at boot
and keeps **two booleans**. Widen the ledger row to carry the map and the given set, and the
poster becomes true with **zero new I/O** — `backfillLedger` already sweeps all five keys once
at boot (`App.vue:630`).

| the card | its face |
|---|---|
| active + current game | the LIVE board, teleported (unchanged) |
| any game with a saved board | a TRUE STILL of that board, its givens and its marks |
| a game never played | the canned poster (honest: an example of the game) + the `range` line |

### Why this isn't a nicety — the fold depends on it

`unfoldToBoard` reads the chosen card's rect and unfolds the live board from it
(`App.vue:592-606`). At the instant of the swap the still and the live board occupy the same
pixels. **If the still is true, the substitution is invisible and the picture simply starts
accepting your pencil. If the still is canned, the fold is a visible lie correcting itself.**

That is the felt continuity M12 is really asking for. Today you pick killer, trust a sub-line
that says "in progress", and watch a strange board become your board. With true stills you see
your half-solved cages *in the deck, before you commit*, and the click changes nothing about the
picture — only who's allowed to write on it.

**Required cure, named:** flush `saveBoardState()` on scene unmount. Without it the still can be
up to 300ms stale and a fast switch loses a keystroke from disk. This is a persistence defect
that M12 merely makes visible.

---

## §4 · M14 — JOIN AND LEAVE

The owner's words: *"controls expand + draw the player in; the board draws in briefly with the
joining player's color (debounced); leaving is the same muted + reversed."*

### The mechanism, and it is already on the board

`HandDrawnGrid` carries a **progress trace**: a filterless, grain-baked sibling of the frame
ring, generated by `generateFrameTraceFrames` at the same rect, seed, roughness and boil as the
grid's own frame so it *retraces the graphite in registration* (`gridPaths.ts:352-358`,
`HandDrawnGrid.vue:68-92`). It is stroked `var(--color-progress-ink)` — a CSS var — with
`pathLength="1000"`, `stroke-dasharray="1000 1000"` and `strokeDashoffset = 1000 × (1 − progress)`
(`HandDrawnGrid.vue:437-443`). At progress 0 it renders **nothing at all** (`v-for … : []`,
`HandDrawnGrid.vue:426`). Zero steady-state raster, compositor-only opacity swap on the shared
beat, no filter minted.

**The board already knows how to draw its own edge in a named colour, from 0 to 1, at zero rest
cost.** "The board draws in briefly with the joining player's color" is that mechanism with the
ink rebound and the progress driven by a one-shot instead of the fill fraction.

The join trace is a **second** stack, not a commandeering of the first: `:progress` is the live
fill gauge (`GameBoard.vue:744`) and is in use whenever the board isn't empty. Same generator,
different `baseSeed` — a second hand tracing the same rectangle. That's the estate's own
retrace idiom, the one `scribbleUnderline`'s selected state uses (a double-stroke offset second
pass, `scribbleUnderline.ts:69-79`).

And because the trace lives *inside* `HandDrawnGrid`, it travels with the board through the
gallery Teleport. **A join that lands while you're browsing the deck draws its ring around the
active card's face.** Nothing extra is needed for that; it falls out.

### THE JOIN — one `sequence` handle, 1180ms

| # | window | the moment | what moves | mechanism | curve |
|---|---|---|---|---|---|
| J1 | 0–320 | the well makes room | the new roster `<li>` `grid-template-rows` 0fr→1fr | the crib fold, `GameControlPanel.vue:922` | `--ease-glassGlide` |
| J2 | 140–520 | their name writes itself | `clip-path: inset(0 100% 0 0)` → `inset(0)` on `.player-name`, inked by `p.ink` | `ink-write-in`, `index.css:1072` | `--ease-drawOn` |
| J3 | 200–720 | the board takes their colour | join-trace `strokeDashoffset` 1000→0, clockwise from top-left | the trace grammar, `HandDrawnGrid.vue:437-443` | `easeOutCubic` |
| J4 | 720–980 | it holds | nothing moves; the ring stands complete in their ink | — | — |
| J5 | 980–1180 | it lets go | `stroke-opacity` 0.95→0 (the dash never retracts) | same handle's tail | `--ease-fadeOut` |

One `createSequenceSubscription({ durationMs: 1180 })`, one clock, self-removing, zero cost at
rest. J1's row-open is a CSS transition on the mounting `<li>` and rides no subscriber.

**Owner knob: J4's hold.** "Briefly" is the owner's word and 260ms is my reading of it. This is
the number to audition.

The ring completes before it fades because a *completed* ring is the moment — someone is here,
all the way round the board. Un-drawing it would be the leave.

### THE LEAVE — muted, reversed, and shorter

| # | window | the moment | what moves | curve |
|---|---|---|---|---|
| L1 | 0–420 | the board lets their colour go | join-trace `strokeDashoffset` 0→1000 — the ring **retreats** to the corner it started from, at `stroke-opacity` 0.45 | `--ease-accelIn` |
| L2 | 260–520 | their name goes quiet | `.player-name` colour → `--ink-press-quiet` | `--ease-standard` |
| L3 | 420–740 | the well closes | `grid-template-rows` 1fr→0fr | `--ease-glassGlide` |

740ms against the join's 1180. **Muted** = opacity ceiling 0.45, not 0.95. **Reversed** = the
dash un-draws, and the *order* inverts too: on a join the name arrives before the board says so;
on a leave the board says so before the name goes. An arrival is news; a departure is a
settling.

The departing player keeps their ink. `known` deliberately retains every peer it has ever seen
so their digits keep their colour after they go (`useSession.ts:281-283`). **Their handwriting
stays on the board.** That is already true and it is the loveliest thing in the feature; the
design's job is to stop hiding it. The attribution tape on a departed peer's digit still reads
their slug (§5).

### Debounce, stated as three rules

1. **BOOT SUPPRESSION.** No trace for any peer discovered within **1200ms** of the wire
   carrying. Those aren't arrivals — they're the room you walked into. Every page `hi`s and acks
   on entry (`useSession.ts:432-435`), so joining a room of four fires four `onPeer` calls inside
   one round trip (596ms measured to first contact, T6.1). Without this rule, joining a busy
   board is a strobe. A trailing debounce alone cannot make this distinction; only the clock can.
2. **COALESCE, 400ms trailing.** Joins inside the window produce **one** trace, in the last
   joiner's ink. Roster rows are *not* coalesced — the well is `role="log"`
   (`GameControlPanel.vue:897`) and a log's whole office is that every entry lands.
3. **ONE HANDLE, EVER.** A join while a trace is in flight `stop()`s it and restarts in the new
   ink. `SequenceHandle.stop()` never throws in any phase, and supersede-silently is the
   estate's own discipline for a re-run mid-flight (`useFlipGlide.ts:158-159`). Never two rings.

### The controls expanding

`.players-roster` is `max-height: 7.5rem; overflow-y: auto` (`GameControlPanel.vue:1284-1292`) —
five rows read at a glance, the rest scroll. So the well's growth is **bounded at five rows**
(~20px each, ~100px total) and the sixth join opens no box at all; its row just lands in the
log. The card cannot walk off the page however many people turn up. That bound already ships;
the design only asks that the growth *glide* instead of snapping.

### The player icon

The owner floated "potentially a player icon". **The swatch is the icon.** `.player-swatch`
already exists — a dot in their ink (`GameControlPanel.vue:903`). A drawn animal would need 345
drawings, or one generic glyph that says nothing about which animal you are. The slug written in
their own colour is how this estate names a thing, and it scales to any roster with zero art.
I commit against a drawn icon.

Where the roster can't be seen — in the deck, with the drawer faded out at BEAT 0 — the swatches
ride the active card's caption as a row of ink dots beside the sub-line. Same span, same style,
one card, no new component. A join adds a dot; that's the deck's version of J1.

---

## §5 · M1 — ATTRIBUTION AND THE GHOST

### Hovering a written cell

**One washi tape, board-level, in their ink.**

`SheetWashiLabel` is the estate's answer to "show me the name of the thing I'm pointing at": a
scrap of tinted paper tape, Patrick Hand, seeded torn ends and ±1.5° tilt, blur-0, **one paint
per show**, revealed on hover *and* `:focus-visible` (`SheetWashiLabel.vue:1-10`). The icon
buttons already wear it (`GameControlPanel.vue:865`).

- **Text** — the author's slug, off `ledger.clock[pos][1]` → `known[author].slug`.
- **Ink** — the cell already carries that peer's `--color-user-ink` rebinding via `authorInk`
  (`BoardHost.vue:238`, `useSession.ts:320-329`). Set `color: var(--color-user-ink)` on the tape
  and the writing comes out in their colour with **zero new plumbing**.
- **One instance, not 81.** Board-level, absolutely positioned over the hovered cell, mounted
  only inside a session (`v-if="session.roomId"`) and only while the pointer is on an
  attributed cell. `useGameCell` already owns `isHovered` (`DigitCell.vue:183-184`). Solo play
  mounts nothing; a session at rest mounts nothing.
- **Cell box, measured:** 74.2px at 1280, 40.2px at 390.

**Coarse pointers get no hover** — the estate's standing rule, and a long-press is already the
peek gesture (`useLongPress`). Touch attribution rides the accessible name instead:
`useGameCell`'s `ariaLabel` gains `", written by brave-otter"`. One string, honest, and it is the
only answer that doesn't collide with a shipped gesture. Named as a real asymmetry, not papered
over.

### The ghost cursor — tier 4

**A ghost selection in a pencil world is a lighter hand's ring.** The estate has already
answered this three times and the fourth answer is the same answer.

`.cell-ghost-path` is a wobbled per-cell rect that **sketches itself on** over 180ms
(`stroke-dashoffset 1→0` at `pathLength="1"`, `ghost-draw-on`, `gameCell.css:214-223`) in three
tiers separated by colour and stroke weight: graphite hover at width 5, crayon-blue focus at 7,
teacher-red conflict at 9 (`gameCell.css:189-249`).

**Tier 4 — a peer's selection:**

| property | value | why |
|---|---|---|
| `stroke` | `var(--color-user-ink)` rebound to their hue | one formula, `playerIdentity.ts:68-70` |
| `stroke-width` | 4 | *lighter* than tier 1's graphite — a peer presses less hard than you do |
| `stroke-opacity` | 0.55 | present, never competing |
| `fill-opacity` | 0.04 | below tier 1's 0.06 |
| draw-on | `ghost-draw-on 180ms var(--ease-ghostDraw)` | the same 180ms sketch, verbatim |

It loses every shared property to tiers 2 and 3 by specificity, exactly as tier 3 loses to tier
2 (`gameCell.css:226-229`). **Your own focus and your own conflicts always out-rank a peer's
ghost.** That precedence falls straight out of the existing cascade design; nothing new decides
it.

**It is a ring, not a wash.** A fill would collide with `.cell-peer` — the crayon-blue 7% wash
that marks *your* selection's row/column/box reach (`gameCell.css:123-125`). That wash belongs
to your own selection and must never be confused with someone else's position.

**It does not tween between cells.** The ghost jumps and redraws its 180ms sketch. The estate
chose that for its own ghost ("instant show/hide for cursor-tracking responsiveness",
`gameCell.css:174`) and it is right here for a stronger reason: **a tweened cursor is a mouse
pointer, and there are no mouse pointers in a pencil world.** Someone's pencil is on this square
or that one.

### The one new wire verb

Selection isn't on the wire today. A ghost cursor with no wire is a ghost of nothing, so this is
the design's single piece of new substrate and I'd rather name it than smuggle it:

**`sel` — a fourth `Kind`.** One field `{ p }`. Rate-limited to one per **120ms** per page (a
held arrow key otherwise emits ~30/s). Ephemeral: never enters the ledger, never rides `st`,
dropped on epoch mismatch like any other op (`useSession.ts:128-136`). ~8 bytes. A peer's ghost
expires locally after **45s** of silence from that peer, which also covers the open-socket-behind-
a-dead-page case the transport flags as unowned (`relayWire.ts:38-40`).

---

## §6 · M13 — THE MATRIX, AS EXPERIENCES

Every cell gets a felt answer, not a state answer.

| # | the act | what YOU see | what the PEER sees | verdict |
|---|---|---|---|---|
| A | you open the deck, in a session | the board folds into the active card carrying everyone's coloured digits. Today the roster fades out with the drawer and you can't see who's at the table while deciding to leave it. **Cure:** the roster's swatches ride the active card's caption. | nothing — and that's right, browsing isn't an act. Your ghost goes quiet, which reads exactly as "they've looked away". | **cure** |
| B | you step/warp the deck | the deck glides; your session is intact (nothing unmounts) | nothing | ok |
| C | **you select a DIFFERENT game** | today: silent eviction, `?s=` gone, no way back. **Cure:** the guard ribbon arms *regardless of `dirty`* — a clean board in a shared room is still a board you're walking away from. Sub-line names the people. | the leave animation (§4), not a row that blinks out | **CRITICAL** |
| D | you select the SAME game | `setGame` early-returns (`App.vue:174-177`); session, `?s=` and marks all intact. You drop back onto the shared board with everyone's digits where they were. | nothing | ok |
| E | you DEAL in a session | it works — `boardGeneration` → `publishBoard` → new epoch, board broadcast (`useGameState.ts:332`, `useSession.ts:541-550`). But the ribbon only weighs *your* marks, so a clean-board deal wipes five boards with no prompt. **Cure:** in a session a deal always arms; sub-line says how many boards it replaces. | their board is replaced under them with no explanation. **Cure:** the incoming `st` lands as a redeal — the board's own `animateDrawIn` — with the dealer's ink on the trace at low amplitude. *Election, not a requirement.* | **cure** |
| F | a peer leaves | their row leaves; **their digits stay, in their colour** (`useSession.ts:281-283`). The attribution tape still names them. | — | ok + say it |
| G | the room empties to just you | the well shows one row and `live` never goes false, so nothing says you're alone. Worse: `v-if="!session.roomId"` (`GameControlPanel.vue:854`) hides the invite verb once you're in a room, so **an empty room offers no way to re-invite.** **Cure:** both. | — | **cure** |
| H | your socket drops | `relayWire` retries with backoff and re-`hi`s (`relayWire.ts:143-148`), but `live` latches true and never clears (`useSession.ts:290`), so a mid-session disconnect is **invisible**. Ops silently drop. **Cure:** `live` follows the socket. | your row survives until the relay's `announceLeave` fires on `webSocketClose` — that arm works. | **cure** |
| I | a peer joins while you're in the deck | the join trace draws around the **active card's face** — the trace travels with the board through the Teleport, free. If the active card is a *different* game the board is parked and hidden, so the trace plays where nobody can see it. **Cure:** fall back to the caption swatch drawing in on the same 0→1. | — | ok + fallback |
| J | PRM, any of the above | the trace never renders (progress stays 0 → the layer mounts nothing). The row opens at `1fr` same-frame; the name lands written; the ghost lands drawn. Reachable, static, no motion. | same | ok |
| K | two peers join at once | one trace, last joiner's ink; both rows land (§4 rules 1–3) | — | **rule** |
| L | "the host switches games" | there is **no host**. `holdsTheBoard` is recomputed per-newcomer as the lowest id in the room (`useSession.ts:384-386`), so there is no role to lose. The mark's framing doesn't match the code's shape, and the chair should know that. | — | **no-op** |

### The one that matters most, drawn

**C — you select a different game while three people are on the board.**

The ribbon already exists, already handles two intents, already speaks through an assertive
region, already contains focus, already has `keep` and `leave` (`GameGallery.vue:694-761`). It
needs one more stake and one more arming condition.

> **leave this puzzle?**
> you'll leave this shared board. 3 other players are on it.
>                    [ keep ]   [ leave ]

Copy checked against M16: no em dash, no metaphor ("the table" is out, "shared board" is in),
no meta language, plain English, and it names a countable fact rather than a feeling.

`keep` returns you to the deck with the room intact. `leave` does what it says — and the peers
get §4's leave animation rather than a row that blinks out of existence.

---

## §7 · WHAT DIES

| what | where | why |
|---|---|---|
| the leading slot of air on the desk | `GameGallery.vue:846-860` (`--edge` → `0px` at ≥64rem) | it is D1, the whole of the end-pose defect |
| the desk's `align-self: stretch` scrollWidth hazard | same | zero-width spacers have no scrollWidth to lose; stays on the phone |
| the binary flank depth | `GameCard.vue:335-336` | `d=2` cannot look like `d=1` in a 5-up spread |
| canned faces as the ONLY face | the five `*Poster.vue` `values` | they become the fallback for a game never played |
| the ledger's discard of `values`/`givenCells` | `useStagingBridge.ts:230-244` | it already reads them |
| the silent session eviction | `App.vue:186-189` | it grows a ribbon |
| the invite verb's disappearance in-room | `GameControlPanel.vue:854` | an empty room must be re-invitable |
| `live`'s latch | `useSession.ts:290` | a disconnect that says nothing |
| the 4-slot rung | never built | declined on the probe's evidence, recorded so nobody re-proposes it |

---

## §8 · LOC, PER PIECE

Estimates are net, source only, excluding tests.

| piece | LOC | shape |
|---|---|---|
| M11 deck geometry (3 moves) | **~25** | CSS in `GameGallery.vue` + one `depthFor(i)` + one `--d` binding |
| M12 true stills | **~45** | widen `StagedLedgerEntry`, keep what `readPersistedBoard` already parses, one `values`/`givens` pass-through to `GameCard` → `PosterBoard` |
| M12 unmount flush | **~4** | `onUnmounted(saveBoardState)` in `useGameState` |
| M14 join/leave trace | **~70** | a second trace stack in `HandDrawnGrid` (~25, the generator is reused) + one debounce/coalesce module (~45) |
| M14 well expand + name write | **~20** | CSS only, two existing keyframes |
| M14 deck swatch row | **~15** | the existing `.player-swatch` span on the card caption |
| M1 attribution tape | **~35** | one board-level `SheetWashiLabel` + hovered-author derivation + the aria-name suffix |
| M1 ghost tier 4 | **~18** | CSS tier + one `peerSelections` map read |
| M1 `sel` wire verb | **~30** | one `Kind`, one rate limiter, one 45s expiry |
| M13 ribbon stake + arming | **~25** | `guardSub` branch, `attemptSelect`/`attemptDeal` conditions, copy |
| M13 `live` follows the socket + empty-room cures | **~20** | `useSession` + the well's two `v-if`s |
| **total** | **~307** | |

Roughly a third of that is CSS and about a fifth is deletion.

---

## §9 · PRM — EVERY MOMENT'S INSTANT-CUT FORM

| moment | PRM form |
|---|---|
| deck spread | already static; graded depth snaps (`GameCard.vue:487-492` already declares `transition: none`) |
| join trace | never renders — progress stays 0 and the layer mounts nothing (`HandDrawnGrid.vue:426`) |
| well expand | lands at `1fr` same-frame |
| name write | lands written (the `ink-write-in` PRM rule, `index.css:948-951`) |
| leave | row is removed same-frame; no retreat, no fade |
| ghost tier 4 | lands drawn — `ghost-draw-on` is already PRM-governed (`gameCell.css:277-290`) |
| attribution tape | already static, blur-0, one paint per show |
| guard ribbon | already collapses to a same-frame appear (`GameGallery.vue:1075-1085`) |

**No animation in this design boils.** Every moving thing is one finite `sequence` handle or one
CSS transition. Nothing enrols a perpetual `frame` subscriber, nothing mints a filter — the
census stays at 9 (`filterBudget.ts`, four rows, exact-match both directions) because the trace
is grain-baked geometry with no `filter=` at all, which is precisely why it was built that way.
Idle raster writes stay zero: the trace layer is unmounted at rest and the depth grade is a
compositor channel.

---

## §10 · FAILURE-MODE SELF-CRITIQUE

My charter's named trap is **unverified gestalt**. Where I'm asserting feel without a probe:

1. **Every timing in §4 is unprobed.** The bands come from the estate's own ledger (350 draw-in,
   440 card step, 520 fold, 600 chime) and the shape from the Bloom, but J4's 260ms hold —
   the literal reading of the owner's "briefly" — is a guess. Needs an eye at the preview. This
   is the design's largest soft spot and it is exactly the kind of number T3-W13 auditioned by
   eye at :3001 rather than reasoned about.
2. **I have never looked at two rings on one board.** The fill trace (violet, seed 42) and the
   join trace (peer ink, different seed) share the frame rect. I argued
   registration-close-but-distinct from the double-stroke retrace precedent. I did not render it.
   **This is my biggest visual risk.** If it reads muddy the fallback is the subgrid lines rather
   than the frame ring, which is a different picture and a different design.
3. **The graded-depth opacities in §2 are intent, not measurement.** My probe read
   0.92/0.74/0.56 against the intended 1.00/0.78/0.58 because the injected `!important` raced the
   card's own 440ms transition mid-settle. The *ratio* is demonstrated; the absolute values are
   not. Re-derive at implementation.
4. **The washi tape over a 40px cell is unmeasured.** "brave-otter" at caption size is ~70px
   against a 40.2px cell at 390px width. Placement and overflow need real measurement, and the
   `wide` prop may not be the right instrument.
5. **The non-centred active card is the one ruling I reverse on taste.** T7-W7 chose centring
   deliberately. My argument is that the depth grammar carries "chosen" and position carries
   "where", but the owner's eye is the only court and I should be overruled cheaply if it reads
   wrong. The move is one CSS line, so reversal is cheap by construction.
6. **The 5-up spread at ≥1808 is measured for geometry, not for behaviour.** `maxScroll 0` means
   the arrows move the highlight while the track holds still. That's correct and I believe it
   feels right, but I have not driven it.
7. **`sel` is real new substrate and I own the count.** One wire verb, one rate limiter, one
   expiry. Everything else in this design is a rebinding or a deletion; this is not.
8. **I did not probe the join trace inside a gallery card.** I reasoned it from the Teleport
   (the trace is inside `HandDrawnGrid`, which is inside `.board-peek-host`, which is what
   travels). The reasoning is sound but the fold also scales the board by `--live-fit`, and a
   stroke at width 8 inside a 0.4 scale is a 3.2px ring. It may need a counter-scale, which
   would be new machinery I have not budgeted.

---

## §11 · OPEN GAPS

- **Presence timeout for a socket that stays open behind a dead page.** Flagged as unowned in
  `relayWire.ts:38-40` ("cut-2's, not this"). A ghost cursor makes it newly visible: a frozen
  ring on a cell forever. The 45s local expiry (§5) covers the *symptom*; the roster row still
  lies. Not cured here.
- **The e2e battery drives `localWire`** (`?wire=local`, DEV-only) because a relay in CI is a
  flake machine (`useSession.ts:41-43`). Every M13/M14 moment is therefore provable on the local
  arm and *only* visually verifiable on the relay. O-12 already says validation is visual on the
  live edge; this design leans on that harder than most.
- **Coarse-pointer attribution has no visual form.** Routed to the accessible name. Honest, but
  a sighted touch user gets nothing, and I don't have a gesture to spend.
- **Same-game deal in a session** (cell E) — the peer-side redeal is filed as an election, not a
  requirement. It may be the right place to spend the trace a third time, or it may be one
  meaning too many for one ring.
- **Whether 5-up should still snap at all.** At `maxScroll 0` scroll-snap has nothing to snap.
  Harmless, but the `scroll-snap-type: x mandatory` / `--edge` / `recomputeEdges` machinery is
  then running for a deck that cannot move. Possibly a whole path that should stand down at
  `--deck-slots: 5`, possibly not worth the branch.
- **`--peer-ink-l` on a card face.** The band is measured for contrast on `--color-background`
  and `--color-card` (`index.css:150-159`). A still inside a gallery card sits on `.bg-card`, so
  it's covered — but the *trace ring* at 0.95 opacity on a folded, scaled board face is a
  geometry the band was never measured against.

---

## §12 · THE ARGUMENT

A substrate-first lane will want to build the right abstractions: a presence layer, a preview
model, a session state machine. Those are the correct shapes if the moments need shapes.

They don't. Read the marks as moments and each one lands on something already shipped, already
gated, already measured:

- *the board draws in their colour* → **the trace layer already draws the board's edge in a
  named colour from 0 to 1 at zero rest cost, and travels with the board into the deck.**
- *hover shows who wrote it* → **the tape already shows a name on hover, and the cell already
  carries that peer's ink.**
- *a ghost selection* → **the ghost already sketches itself on in three tiers; a peer is the
  fourth.**
- *controls expand and draw the player in* → **the crib fold already grows a box without
  reflowing, `ink-write-in` already writes a name left to right, and the roster already bounds
  its own growth at five rows.**
- *previews are the actual state* → **the ledger already reads every game's saved board at boot
  and throws the values away.**
- *more than two cards* → **the frame is already three slots; one declaration of manufactured
  air is why you see two.**

The estate's own lesson list says a ruling lands with its enforcing config in the same commit,
and that a mechanism nobody reads is a lie about where a number comes from. The inverse holds
too: **a mechanism seven surfaces already read is where the eighth moment belongs.** This design
adds one wire verb, widens one ledger row, and deletes nine things. That's the case.
