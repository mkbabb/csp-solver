# T9-W9 — THE RUNTIME

What the product does on every frame, every deal and every peer message, made cheap at the
mechanism. Drafted 2026-11-05 on the owner's order ("KISS and use the better solution. NO
hacks or workarounds, ever.") from three read-only audits of the tree after pass 10's
integrations: the toggle and rendering, the solver, and multiplayer. One owner mark opens
it: the first dark-mode click is slow, and later clicks are fast. Another rides along: on
click, 1Password offers a verification code over a sudoku cell.

**THE LAWS.** W8's QUALITY LAW binds every row: animation is never thinned, shortened or
filtered away for speed. π identity holds on every golden, `filterBudget` stays 9, and a
cure that would change a pixel ships only through the soul-gate SSIM check with its DELTA
declared. Every row is born-RED on its own number and closes when that number moves. Each
row takes the mechanism cure. The workarounds the audits offered are named below and
refused, each with the reason it loses.

## 9.1 The design runtime (track D)

**The mark.** The first flip into a theme bakes that theme's bitmaps inside the Bloom. W8
measured it at 1,103.5 ms click→settle, 8 bakes (B2). W8's cure, C02 (pre-warm the other
theme at idle), moved the number but did not land. Its idle encodes redded GATE A, worsened
TBT at mobile dpr 3 by +111.5 ms, and needed a library build the lockfile could not supply
(`evidence/w8/cures/FOLD-MANIFEST.md` §3.1). That failure is the evidence: a pre-warm pays
the bake earlier, when the cure is to stop baking per theme. MOT-VERB found the cure for the
grid. The poses bake COVERAGE, and the page paints `--grid-line-color` through a CSS mask,
so one stack serves both themes and a flip swaps no bitmap. It sits in the pass-10 WAVE tree
(`HandDrawnGrid.vue`, cacheKey `grid-${size}-${subgrid}`). VERB cures the chromium cold flip
and leaves WebKit's: 2–10 frames over 34 ms, dS up to 0.44 against 0.08
(`evidence/w7/intake-owner-2026-09-23/census/toggle/README.md`).

- **D1 · the wordmark bakes coverage.** `HandwrittenLogo.vue` keeps
  `logo-${label}-${d|l}-${vbWidth}`. It takes the grid's mechanism, with no new idiom: a
  coverage stack, the ink painted through the mask, the theme term gone from the key. After
  D1, a flip in either direction bakes **0**, both surfaces, both engines. C02's family closes
  by mechanism: no idle warm, no census amendment, no trade.
- **D2 · the gallery's underlines bake coverage.** `scribbleUnderline.ts:46` caches by seed
  AND colour, so each card's first flip mints and decodes a new data URI (`GameCard.vue:119`).
  Key it by seed alone and paint the colour through the same mask.
- **D3 · the live toggle stops re-running its turbulence per frame.** `filter="url(#wobble-celestial)"`
  wraps `.warp` with the transform inside the filter's input (`DarkModeToggle.vue:24, 119,
  797–817`), so `feTurbulence` + `feDisplacementMap` re-execute on every frame of the ~1.1 s
  gesture. The noise is frozen per pose (seeded, user space), so it is one image: bake it once
  as the pose tile and feed it through `feImage`, with `feDisplacementMap` unchanged. Same
  displacement field, same pixels. The filter count holds (one primitive replaces one).
  Refused: moving the transform outside the filter. It is cheaper, but it changes how the
  wobble rides the body, so it is a different look, not the same look made faster.
- **D4 · the hidden celestial body waits for idle.** Both `sunRaster` and `moonRaster` open at
  the font gate (`DarkModeToggle.vue:569–582`), so the boot pays 16 encodes for one visible
  body. The inactive body takes `cssSize` 0 until `requestIdleCallback`. Its `<img>` tags are
  decoded there with `img.decode()`, the platform's own API for an image that must paint on
  its first visible frame. That is a quarter of the boot's encodes off the critical path, for
  something nobody can see.
- **D5 · blankness is checked where it happens.** The WebKit defect `rasterPose.ts:199–203`
  guards is a boot-time SVG→canvas raster that comes back blank for poses 1..n. Today the
  guard finds it downstream: it decodes each object URL AGAIN and reads it back on a probe
  canvas (`posePaints`, `:371–414`), on every bake, in every engine. The pixels already exist
  on pencil-boil's capture canvas before `toBlob`. Check them there and re-raster that pose in
  place. The admission's first term (every handle decodes before the swap) stays, because it
  cures the unmount frame. The second decode and the readback die. Refused: scoping the old
  check to "WebKit during boot". That sniffs the engine and keeps the redundant decode
  everywhere else.
- **D6 · one class instead of a stylesheet swap per flip.** vueuse's `disableTransition`
  inserts `*{transition:none}`, forces a style read and removes the sheet
  (`useTheme.ts:35`): two whole-page invalidations per click. Replace it with one rule,
  `html.theme-flip *{transition:none!important}`, set in `handleToggle`
  (`DarkModeToggle.vue:674`) and cleared on the next frame. The specificity that lets the
  toggle's own transitions and the five dusk grounds win is unchanged.
- **D7 · the library stops ticking what nobody reads.** Each `useRasterStack` subscribes a
  `useLineBoil` that drives a `pose` none of the four consumers reads (pencil-boil
  `vue.js:511`): four ref writes at 8 Hz for nothing. The raster stack gets no boil of its own,
  and a consumer that wants the beat composes `useBeatFrame`, as the grid and logo already do.
  Library-level, published as a pencil-boil minor, lockfile resolving the published version
  (C02's failure 2 is the law here: no arm measured on an unpublished pack).
- **D8 · only the showing body holds layers.** `.rest-pose { will-change: opacity }` promotes
  both celestial stacks (`DarkModeToggle.vue:944`), and the grid at native DPR holds about
  26 MB of decoded masks. Promote the active stack only. D4's decode keeps the other ready.

**Not booked, with reason.** The audit's "hand the canvas over instead of a PNG" does not
survive D1: a CSS mask needs a URL, so the encode stays and only the redundant decode goes
(D5). Bundle and beat-flush rows: the entry chunk (194.5 KB) is already split where it pays,
and the 20 beat watchers are each cheap. Neither is booked unless a price says otherwise.

## 9.2 The solver (track S)

W4 leashed the P0 (a deal worker apart from the resident one, `DEAL_LEASH_MS` 30 s) and banked
thermo 16×16 MEDIUM/HARD (`thermo/data/templates.ts`, 32 records). Live 16×16 HARD still prices
at 3.6 s median and **53.9 s** worst, past its own leash. The cause is cost per check, not the
dig's walk. **Byte-identity law:** S1–S3, S5 and S6 change no deal. For every family, size,
tier and seed in the W4 harness, the shipped deal is byte-identical before and after, and the
native/wasm same-seed check holds.

- **S1 · uniqueness without rediscovery.** `puzzles/class.rs:247–262` proves a hole unique
  with `solve_candidate(.., 2)`, which must find the known solution again before it can search
  for a second. `class.rs:56–61` names this as where 16×16 HARD spends its time. Use
  `solve_excluding(board, idx, saved)` instead: remove the saved value from cell `idx`, then
  ask for one solution. "None, with the search closed" is exactly "unique". Exhaustion stays
  NOT-PROVEN under W4's law (`CandidateOutcome::Exhausted`). The answer no longer depends on
  variable order, which frees S7.
- **S2 · the ordering constraint goes native.** `add_less_than` builds a boxed `LambdaConstraint`
  with a `format!` label (`csp.rs:85–98`). `revise_binary_default` allocates `vec![None;
  vars.len()]` per revise, with up to d² dynamic calls (`constraint/traits.rs:68–122`).
  Thermo tubes, futoshiki (`futoshiki/csp.rs:140`) and KenKen `−`/`÷`
  (`kenken/csp.rs:149,165`) ride it. Add `LessThan` to `ConstraintEnum` with bound-mask
  pruning: x keeps the values below max(y), and y keeps the values above min(x). Retire the
  lambda path for these callers whole (no dual path). The default revise reuses one buffer,
  and the `String` label dies.
- **S3 · givens apply in one pass.** `solve_with_given` runs `given.iter().any(..)` inside a
  givens × neighbours loop (`csp/solve.rs`), about 1M steps per 16×16 candidate, ×256
  candidates per deal. `ac3_full` runs next and does the same work. Delete the step.
- **S4 · the bank retires.** With S1–S3 landed, price live 16×16 HARD on production inputs
  against W4's per-family ceiling. At or under it, the thermo bank is deleted with its wasm
  surface, `TIER_SOURCE` routing and the per-deal 10,267-cell copy (`useThermo.ts`). Every
  thermo deal is then live and unbounded in variety. Over it, the row stays RED and the bank
  stays as it is. Refused: dealing the bank through rotations and reflections. That decorates
  a structure whose cure is its deletion.
- **S5 · the GAC cache survives a long session.** Constraint ids come from one process-wide
  counter, and ids ≥ 8192 are never cached (`solver/gac.rs:51–55, 70, 240, 289`). Every
  call builds a fresh CSP (`wasm/src/thermo.rs:207, 258`), so after about 150–300 calls every
  GAC run starts cold. Number ids within each CSP.
- **S6 · the node does no work twice.** `search.rs` `is_valid` re-checks every fully assigned
  constraint that AC-3 has already made consistent. `AllDifferent::check_impl` collects a
  fresh `Vec` per call. Under `Ac3`, propagation is the check. `debug_assert!` keeps the full
  check in every test build, and the check that remains is a u32 bitmask.
- **S7 · uniqueness proofs learn.** FailFirst ties go to stack order, and `Mrv`'s weights are
  fixed at 1.0 (`ordering.rs`, `csp.rs:125`). Apply dom/wdeg to S1's exclusion solves only.
  Their answer is order-independent, so deals stay byte-identical. The solve that builds the
  seed grid keeps today's order, because first-solution trajectory is the documented contract.
- **S8 · cages prune by content, not bounds.** `CageSum` uses min/max bounds alone, and
  `cell_bounds` loops instead of reading bits. `CageProduct` is O(k²) per pass
  (`constraint/cage.rs`). Killer: the digit sets each (cage size, sum) admits, built at
  runtime so the wasm stays flat, pruned against the cage's all-different. KenKen: the
  target's true divisors. Both: bounds from `trailing_zeros`/`leading_zeros`. This changes
  node counts, not solution sets. Deals stay byte-identical because the uniqueness verdicts
  are unchanged.
- **S9 · the trail saves domains, not values.** `variable.rs` `prune` pushes a 16-byte entry
  per pruned value, and `ac3_from_variable` trails every variable in scope on any change. For
  bitset domains, save the 128-bit domain once per variable per depth, on its first change.
  This is the row with real risk, because the trail is shared by every domain type. A
  property test replays the old trail and the new one over the W4 harness and requires
  identical domains at every backtrack.

**The size band is part of every row.** The local pkg is 123,336 B, and the runner adds about
2.2 KB against the 127,500 B fail line. S2 and S3 should shrink it, and S1, S5–S8 cost under
about 1 KB together. The band's CI lane prices every commit. **Not booked:** SIMD (domains are
`u128`, which wasm32 already splits into two i64s), and pre-dealing the next puzzle (needless
once deals are sub-second, and a CPU and battery cost on phones). The latter returns only if
S4's price says deals are still felt.

## 9.3 Multiplayer (track M)

The ledger is a last-writer-wins map, one stamp per cell (`useSession.ts:122–150`). It is
bounded by the cell count and ships whole to a joiner as one snapshot, with nothing replayed.
The relay writes no Durable Object storage per move (`relay.ts:209–221`), and hibernation is
used correctly (`:182`). The defects are in delivery, fanout and render.

- **M1 · a reconnected peer converges.** `send` drops every frame sent while the socket is not
  open (`relayWire.ts:205–208`), and a same-epoch snapshot is ignored (`useSession.ts:760`).
  Ops missed or made during a gap are lost both ways until the next deal. This is a
  correctness defect, and it leads the track. Queue outbound ops while the socket is down and
  flush them on open. Merge a same-epoch snapshot cell by cell under the existing `wins()`
  rule, the one `admit` already applies. Born-RED: drop one peer's socket mid-sequence, make
  moves on both sides, reconnect, and both boards must be equal.
- **M2 · heartbeats carry a digest, not the board.** Each 15 s heartbeat (`:847`) draws an ack
  from every peer (`:742`) and a full snapshot, up to 9.4 KB, from the holder (`:743`). The
  relay does not route `to` (`relay.ts:276–287`), so every frame reaches the whole room and
  every receiver discards it. Tag the beat, answer it with nothing, and carry a clock digest
  so the holder sends a snapshot only on a mismatch, which M1's merge then heals.
- **M3 · one changed cell patches one cell.** Every op rewrites `ledger.clock`, which rebuilds
  `authorInk` and `cellAuthors` over all cells (`useSession.ts:402–432`). That rebuilds
  BoardHost's `cellAuthors` (`BoardHost.vue:96`) and App's `bankAuthorInk` watch
  (`App.vue:790`). Every cursor frame copies `peerCursors` (`:753`). The cell loop spreads a
  fresh `:style` per cell (`BoardHost.vue:311–314`), so all 81–256 cells patch, at up to about
  8 Hz per peer. Keep per-cell state in a keyed `shallowRef` map patched by key, give style
  objects stable identity, and pass the peer colour as a scalar prop. One event, one cell.
- **M4 · a sweep is one frame.** Fill loops `noteWrite` per cell (`useGameState.ts:324`), each
  with an ack, a fanout and a separate render flush on every peer. Add one batch frame
  (`{o:[[p,v,s,l]…], a, e, ea}`), applied in one tick, as one well-formed case beside the
  single op (`relayWire.ts:119`).
- **M5 · one Durable Object per room.** `idFromName("relay")` (`relay.ts:323`) puts every room
  on one object, so fanout deserializes every socket's attachment and filter-matches every
  frame. That is O(all sockets everywhere), and every room's traffic travels to one location,
  likely part of the ~600 ms contact. Use `idFromName(room)`, with the room on the URL. The
  relay and Pages deploy together behind W5's relay gate. The old shared-object path is
  deleted, not kept as a fallback.
- **M6 · a dead socket is noticed.** Reconnects happen only on `onclose` (`relayWire.ts:263`),
  so a slept phone or a dropped NAT holds a dead-open socket indefinitely. The relay already
  answers every frame with `["OK"]`, which the client discards: make that the pong. A
  heartbeat with no OK inside 5 s closes and reconnects, and `online` and
  `visibilitychange` reconnect at once. Where M2's beat goes quiet, it still draws the
  relay's OK, so nothing new is sent.
- **M7 · backoff with jitter.** `RETRY_MS` is a fixed `[250…4000]` (`relayWire.ts:67`), and
  `attempt` resets on open (`:215`), so after a Worker deploy every client returns at 250 ms
  together, and a flapping socket retries at 250 ms forever. Use full jitter, and reset only
  after 5 s up.
- **M8 · a joiner is never stranded.** The holder is the lowest id present (`useSession.ts:685`).
  A peer whose page is dead but whose socket is open stays on the roster until the 45 s expiry
  (`:624`), and nobody answers the joiner. With M6, the dead peer leaves inside about 5 s. On
  top of that, the joiner repeats its hello after 1.5 s without a snapshot, and the next-ranked
  peer answers. Worst wait: about 2 s against 45.
- **M9 · setup runs in parallel, and frames carry no dead weight.** `joinSession` awaits
  `import("./playerIdentity")` (`:808`), then `import("./relayWire")` (`:291`), in series.
  A frame carries a 64-hex id and a `from` that repeats `pubkey`, and it is JSON-encoded twice
  (`relayWire.ts:186–197`): 364 B per op. `sendState` serializes three times (`:697`). Load
  both imports with `Promise.all`, shorten the id, drop `from` (the relay's departure envelope
  takes `pubkey`, `relay.ts:269`), and encode once. JSON stays, because binary is not worth
  it at this traffic.

## 9.4 The cell is not a credential field (row R1)

Each cell is a transparent `<input type=text inputmode=numeric pattern=[0-9]* maxlength=2|3>`
(`DigitCell.vue:237–247`). That is a one-time-code field's exact shape, and nothing says
otherwise, so 1Password offers the owner's TOTP on a click. The shape is load-bearing
(`DigitCell.test.ts`: it raises the iOS digit pad and bounds the entry), so the field keeps
it and declares what it is not. `autocomplete="off"` is the standard's word. `data-1p-ignore`,
`data-lpignore="true"` and `data-bwignore` are the three managers' documented opt-outs.
Born-RED: a `DigitCell.test.ts` assertion on all four, and the owner's re-look in Safari with
1Password (U-10).

## DAG

Track S lives in `csp-solver/`, outside the pass fence. It may develop in its own worktree
while W7 runs, and it lands after W7's fold, because a new wasm pkg moves every lane's build.
Tracks D and M and row R1 touch `web/frontend/src` and `web/relay`, so they open at W7's fold.
D rides on the folded tree, whose grid already carries VERB's coverage mask, and D1 extends
that mechanism. Inside D: D1 → D2 (one mechanism, the second surface). D7 is a library
release, landing before any row that measures on it. Inside M: M1 → M2 (the digest heals
through M1's merge), M6 → M8, and M5 with its relay deploy. WGATE reads W9's prices.

## Gate spine

- **Track D**, born-RED on W8's instruments (`attribution/A5/toggle-probe.mjs`,
  `A6/toggle-and-trace.mjs`, `perf-rig/ci-subset.mjs` unmodified):
  - N1 bakes = 0 on every flip, both surfaces, both engines.
  - The first-flip delta sits inside N2's spread, in both engines, at chromium 1×/4×/6× desk
    dpr 2, 4× mobile dpr 3, and WebKit desk and mobile. Cold, warm and booted-dark are all
    read.
  - The toggle census's WebKit cold flip comes in under its 0.08 dS gate, with no frame over
    34 ms.
  - Boot encodes go 16 → 8 (D4). GATE A, TBT(3000) and `boardDrawnMs` stay unmoved or better.
    `filterBudget` stays 9, and π holds on every golden.
  - D3's frames read soul-gate SSIM-equal to today's, at the same seeds.
- **Track S**, on W4's harness against the shipped artifact:
  - The byte-identity law holds for every seed, family, size and tier.
  - Live 16×16 HARD p50 and worst are read against W4's ceiling, which is S4's verdict.
  - Node counts per row are read before and after.
  - The GAC cache-hit rate holds at call 1 and at call 1,000.
  - S9's trail-replay property test passes.
  - The wasm stays inside its band, and rust/py/unit floors are restamped at WGATE.
- **Track M**:
  - M1's divergence test, born-RED.
  - Bytes per 15 s at 2/4/8 peers, before and after (M2, M9).
  - Cells patched per remote op and per cursor frame = 1 (M3).
  - One frame per Fill (M4).
  - Contact time, before and after (M5, M9), on the deployed relay, identifiable by
    revision (WGATE).
  - Half-open detection ≤ 5 s (M6), and a joiner's worst wait ≤ 2 s (M8).
- **Row R1**: the unit assertion, then the owner's re-look.
- Evidence under `evidence/w9/`: text first, with frames inside policy caps.
