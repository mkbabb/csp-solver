# PAL-TIN · pass-2 SYNTHESIS — the tin, bands moved, the wire ruled, the gate honest

Section §11c the per-player colour system · §3's peer exception · §12. Synthesized from the
pass-2 research at `../research/PAL-TIN/` (twelve sections, every row a number), the pass-1
critique (16 gaps), the chair's rulings (`../CHAIR-RULINGS.md`) and r0's ground (R5, R6). Bound
by the frontend-design two-pass method: plan → review against the tells → then specify.
Read-only on the product; U-10 holds; nothing here is closed.

Own arithmetic this pass (banked beside this file, `PAL-TIN/probe/`, output `PAL-TIN/tokens.txt`):
the research's band sweep held every stick at the sRGB CEILING, which is not the tin's rule.
`final.mjs` re-derives the token table at the tin's own chroma cap; the numbers below are its.

## 0 · The design plan, and the review against the tells

**Tokens.** Five named inks, two arms each, ten hexes. Same five HUES pass 1 cut (amber 48°,
green 125°, teal 201°, violet 277°, pink 332°). What moves is the BAND: light L 0.545 → 0.440,
dark L 0.780 → 0.650. Chroma rule: `C = min(0.215, chromaAt(L, h))`, where 0.215 is
`--color-user-ink`'s own chroma; a stick is never louder than the ink it replaces. The sharing
axis is still not a colour; it is the drawn tally tick, now in the cell's lower-left corner.
**Type.** Unchanged.
**Layout.** Unchanged, plus the tick: after the slug on the roster row (against the word, not at
the row's edge), and in the lower-left band of the cell under a digit.
**Principles.** (1) A finite designed palette; running out is a designed state (30 board-
distinguishable players, then the roster). (2) The roster row is the legend: one component, two
homes, no sentence. (3) Solo is byte-identical. (4) The ink is a presentation attribute
everywhere it paints, so print and forced colours win by construction. (5) Lightness, not hue,
is what separates a player from the machine at night: the solver's dark rainbow is five pastels
at L 0.81–0.92, and the players sit two steps below it.

**Tells checked, and what the review changed.** No avatar, no initial, no presence dot, no cursor
flag, no stock categorical set (none of the ten hexes is a Tailwind hex; every stick is at ink
lightness on graphite paper). Changed on review, all three by measurement rather than taste:
(a) pass 1's dark band was reasoned by analogy ("the peer band, not the crayon step") and never
measured against the rainbow; measured, it puts the players IN the pastel band and no hue
assignment separates them, so the band moves; (b) pass 1's light violet was held at C 0.166 for
restraint, but the estate's own blue is 0.215 and solver-ink-2 is 0.247, so 0.166 was a chip
lightness argument applied to chroma, and the cap is now the incumbent's own; (c) the centred
tally under a `1` reads as the numeral's stem (a 3%-wide upright 3.25% of a cell off a 9.75%-wide
digit), so the tally takes the corner, which is where a hand annotates a cell anyway.

## 1 · The spec

### 1.1 The wire rule comes first, and it is not a colour question

Measured both engines (`research/PAL-TIN/out/r1-three-page-*.json`): under the pass-1 rider a
joiner that answers a stranger's `hi` while holding a board it dealt itself marks ITS OWN index
agreed on publish and then refuses the true author, ending with two ambers and no tick on the
last-arrived screen. `from === d.ea` on the adopt side is necessary and not sufficient.

THE ONE RULE for `useSession.ts` (shared with PAL-WALK, whose §3a found the other half):

> An index is AGREED when, and only when, it arrives in an `st` whose SENDER IS THE EPOCH'S
> AUTHOR. A page's own publish agrees nothing. An agreement is made under an epoch and dies with
> it: a newer epoch by a different author clears the set before adoption.

Landing shape, HEAD line numbers:
- `adoptInk(k, authoritative: boolean)` at `:547-568`. For each id: if `!authoritative &&
  inkAgreed.has(id)` keep the held index; else write it; if `authoritative`, `inkAgreed.add(id)`.
- The `st` arm at `:754-763`: `const fresh = e[1] !== ledger.epoch[1]` read BEFORE
  `ledger.epoch = e`; `if (fresh) inkAgreed.clear()`; then `adoptInk(d.k ?? {}, from === e[1])`.
- `sendState` (`:689-716`) keeps publishing `k` and marks nothing. Teardown clears the set.
- Convergence: non-authors adopt-and-agree the author's `k`; the author never adopts from
  anyone, so its own index stays provisional and yields to a newer epoch by `newer()`'s
  `[lamport, author]` tie-break (`:98`). No second order enters the file.

Units, in the existing `bootPage`/`hear`/`stFrame` harness (`useSession.test.ts:185-235`,
`from` is already `hear`'s third argument):
- **U1 (born-RED at HEAD):** author's `st` names self 3; a non-author's later `st` names self 7;
  green is 3. HEAD reads 7 (last heard wins); this is r5's I4 as a unit.
- **U2 (RED at the pass-1 rider, GREEN at HEAD, kept as the over-reach guard):** the page
  publishes once as its own epoch's author, hears a non-author's `st` naming self 7, then the
  author's naming self 3; green is 3.
- **U3 (PAL-WALK's, RED at the pass-1 rider):** two epochs from two authors; after both,
  `new Set(players.map(p => p.ink["--color-user-ink"])).size === players.length`.

OWNER OF THE ROW: this is `useSession`'s row whichever palette wins; it lands ONCE. PAL-TIN
proposes itself as the carrier because it is the section leader; the chair names the owner the
way §6.1 named the focus token's. The three units and the rule text are identical in both specs
on purpose.

### 1.2 The tokens

```
                light (L 0.440)                      dark (L 0.650)
--color-peer-1  #853900  amber  h 48.4  C 0.119*     #e06600  h 48.7  C 0.175*
--color-peer-2  #455c00  green  h 124.6 C 0.110*     #799f00  h 124.7 C 0.163*
--color-peer-3  #005f63  teal   h 200.6 C 0.075*     #00a3aa  h 200.3 C 0.111*
--color-peer-4  #3e32c5  violet h 276.6 C 0.215      #747eff  h 276.2 C 0.188*
--color-peer-5  #8b0081  pink   h 332.2 C 0.198*     #d64fc8  h 332.1 C 0.215
                                          * = sits ON chromaAt(L, h), the gamut's own ceiling
```

Measured on the arithmetic (`tokens.txt`; the prototype paints it):

| arm | worst AA (bg / card) | worst ΔE to a CELL ink | min pairwise ΔE | ring at 0.80 vs its own 4% fill, worst |
|---|---|---|---|---|
| light | 7.15 / 7.32 (teal) | **0.082** (violet vs solver-ink-3) | 0.116 (green/teal) | 4.37 (green) |
| dark | 5.29 / 5.18 (pink) | **0.100** (violet vs user-ink) | 0.172 (green/teal) | 3.63 (pink) |

Against pass 1: light AA 4.55 → 7.15, dark 8.68 → 5.18 (0.68 of margin, re-measured on bytes
by the prototype, risk 1); worst cell ΔE 0.067 → 0.082 light, **0.046 → 0.100 dark**; the
painted light ring 3.084 → ~4.4 composited (the band move fixes the ring's 2.7% margin too).

Placed in `index.css` beside `--peer-ink-l` (`:155-162`, which RETIRES with its last consumer)
and in `.dark` at `:370-375`. The comment block says WHY the bands are where they are, in one
sentence each: the light band sits one step under the solver's light inks (L 0.50–0.55) and the
estate's own blue (0.546); the dark band sits two steps under the solver's pastels (0.81–0.92)
and one under the estate's own dark blue (0.714), because ten inks at one lightness on one grid
cannot be told apart by hue at the chroma sRGB holds there. The comment cites `tokens.txt`.

Law 23 (a state token aliases a crayon) is knowingly excepted, as pass 1 said. Law 22's formula
half is the ballot (B-TIN-1). Law 21 ("the three ink families never compete") is true in degrees
and was false in ΔE at HEAD and at the pass-1 tin; at these bands it is true in both, and the
law's metric wants naming (a decided-history row, not this family's to rule).

### 1.3 The allocator (unchanged from pass 1, one export added)

```
stick = index % 5        lap = floor(index / 5)        tally = min(5, lap)
inkFor(index) → { "--color-user-ink": "var(--color-peer-{stick+1})" }
lapFor(index) → lap      tallyFor(index) → tally       seedFor(peerId) → parseInt(hashBlob(peerId).slice(0, 8), 16)
```

`seedFor` is `slugFor`'s own first line hoisted (`playerIdentity.ts`), consumed by `slugFor`
and by the roster tick; the cell tick keeps the cell position as its seed. `tallyFor` is what
`PlayerTick` draws; the drawn states are {0,1,2,3,4,gate-of-five}, so the board tells **30**
players apart (5 inks × 6 states); index 30 is the first true board collision and the roster
separates it by slug. `IDENTITY_CAP = 8` is the identity STORE's prune bound and is unrelated;
the comment says so once.

### 1.4 The tick, in the corner — the memorable thing on the board

The deal counter's own gate-five tally (`DifficultyTally.vue:69-74` geometry, the same wobbled
hand), one component `PlayerTick.vue`, two homes, frozen (no beat, no filter, census 9).

Geometry in hundredths of the cell. The glyph box is the middle 65%; the lower band y 82.5–100
is the tick's. **The tally grows from a fixed LEFT edge, never about the centre**: uprights at
`x = 12 + i × 7` (i = 0…3), y 85 → 97; the gate-five slash from (8, 98) to (37, 84). A single
upright therefore sits at x 12, which is 34.75 cell-% from a drawn `1`'s centre (46.75) and
2.9% clear of the widest numeral's left ink edge (the `4` at 28.9); the y gap under every
numeral stays 11.8–14.4% (research §4). The corner adds no new tenant collision: the
`.cell-because` rim (2px inset, ~3.2% of a 62px cell) and the invalid ring already share the
lower edge with the centred tally; the left edge at x 8 is 7.4% clear of them. One measured
frame confirms it (prototype step 6).

**Stroke width follows the board**, no new mechanism: `strokeWidth = 3 × boardSize / 9` in the
100-unit box, off the `boardSize` prop `DigitCell.vue:31` already declares and `:400` passes.
Painted width is then `boardWidth / 300` at every size: 1.85px on a 556px 9×9, 1.21px on a
362px 16×16 phone (3.6 device px at dpr3). The roster-only fallback at 16×16 on a phone is
STATED here, not in a footnote: if the device pass (W8 §8.3) reads the corner tick under 1
device px, the roster is the legend at that size and the board mark is decoration.
`vector-effect: non-scaling-stroke` + `cqw` is the estate's general answer and is not taken
(a containment change on 81–256 cells is a π question for the census lane).

Row home: `viewBox "4 83 36 16"` (the same coordinates cropped to the row's 14px line box;
the desk row measures 18.95px, the phone row 16.42px). Ink: `stroke="var(--color-user-ink)"` as
a presentation attribute on every path; `index.css:926` and `:948` widen from `.glyph-svg path`
to `.glyph-svg path, .glyph-tick path, .roster-tick path`. `aria-hidden` in both homes.

Mounted only when `tallyFor(index) ≥ 1`. Solo mounts nothing.

### 1.5 The roster row is the legend

`swatch · slug · tick · you` with the tick AGAINST THE WORD: `.player-name { flex: 0 1 auto }`
(`GameControlPanel.vue:1769`, one token; `min-width: 0` + ellipsis still truncate a long slug;
`.player-swatch` is already `flex: 0 0 auto`). This is B-TIN-3's default; the right-aligned
tally column is the owner's alternative (today's draw, easier to COUNT, weaker as a legend).
The `.player-swatch` stays (chair §7: the instruments read it). Roster tick seed `seedFor(p.id)`.
The `you` qualifier's berth is PLR-PLACE's row and is not moved here.

### 1.6 You join — and your own board is one colour

Your stick binds on your own page when the ROOM EXISTS, which is `Object.keys(known).length > 1`
(a second id is known), never at the invite press. PAL-WALK §3b's finding binds here too:
`noteWrite` returns before `mintOp` when there is no wire, so solo writes have no clock entry
and `authorInk` cannot ink them, which would leave the pre-invite half of your own board blue
and the post-invite half amber. Cure at the one seam a session starts: when `roomId` goes
non-null, every user entry the source already holds and the clock does not name is stamped
`[0, selfId]`. That is honest (you wrote them; peers' `cellAuthors` then names you rather than
nobody) and it costs one loop. Solo stays byte-identical: `roomId === null` binds nothing,
mounts nothing, stamps nothing.

**F1, stated:** PAL-TIN is on the YES side (your own hand takes a stick in a room). registry-v1
§6.3 books both PAL-* on the "keep the board blue" side; that booking is wrong for this family
and the return says so. Your own digits carry your own ticks (critique gap 9), for F1's own
reason: if your row shows amber with one tick and your digits show amber with none, the legend
is false on your own board. The `adoptInk` rider is §1.1.

### 1.7 Copy

None minted. The roster is the legend. The owner option stands as pass 1 priced it (one
sentence in `players-status`, every letter in the hand's cut, one register row), off by default.

### 1.8 Motion — home, curve, duration

| moment | verb | numbers | home |
|---|---|---|---|
| the tick draws under a digit | `pencil-draw-on`, `pathLength="1"` | 350ms a stroke, 90ms stagger, first stroke 90ms behind the digit; `--ease-drawOn` | `pencilConfig DRAW_IN_PRESETS.tally = { duration: 350, stagger: 90 }`; `DifficultyTally.vue:77`'s literal dies and reads it (net-zero literals, law 4) |
| the roster tick | rides the name's write-in (J2 140–520ms, `--ease-glassGlide`) | none of its own | existing |
| your digits take your stick | SNAP on the join trace's first frame at the ARRIVAL (1180ms at 0.95) | no tween on 81 paths | `useJoinWash.WASH`, existing |
| the peer cursor ring | drawn on 180ms `--ease-ghostDraw`, `stroke-opacity` 0.55 → **0.80** | one number, one owner (the §11c substrate row) | `gameCell.css:234` |
| PRM | the tick appears inked; the snap is the same snap | — | the primitive's own arm |

No `MOTION.curves` entry is minted: the tick's curve is the CSS layer's `--ease-drawOn` and its
durations are draw-in presets, which is the two-layer partition (law 3) applied, not dodged.

### 1.9 Both platforms, both themes

| surface | desk 1280 | phone 390 | dark |
|---|---|---|---|
| board digit | stick ink, corner tick 1.85px painted at 9×9 | 9×9 tick 1.3px; 16×16 1.21px (fallback stated) | the dark arms, same geometry |
| roster row | 18.95px row, 14px tick against the word | 16.42px row, tick inside the line box | same |
| peer cursor ring | 0.80, composited 4.37 worst vs own fill | same | 3.63 worst vs own fill (painted by the prototype) |
| join ring / progress trace | the retrace offset stays load-bearing: violet vs `--color-progress-ink` ΔE 0.177 light / 0.137 dark; `HandDrawnGrid.vue:601`'s comment names the VIOLET and INDEX 3 in the same commit as the tokens | | |

### 1.10 Couplings, priced at the moved bands

- **ACC-FIVE** (user-ink → `#026fc4`/`#47a7ff`, h 251): the violet's nearest light anchor
  becomes solver-ink-3 at 0.082 regardless; dark improves past 0.113. Cleared.
- **ACC-SIX** (the answer's violet NAMED, three rungs; the dark rung `#c4b5fd` WAS the 0.046
  collision): at dark L 0.65 the same violet reads ≥ 0.113 from `#c4b5fd`. Cleared by the band,
  not by moving the hue (the violet's window is 251–293, optimum h 272, worth 0.006).
- **The reserved set moves under this wave.** The gate resolves the set from `index.css` on
  every run (§2 step 1), never from a name list, so a rename cannot hide an anchor.
- **PLR-COUNT's ≥30° over the first six**: under the tin self IS in the tin, so N=3 is 75.9° /
  ΔE 0.145 light, N=5 55.6° / 0.145. Met by construction; the numbers, not the claim, go back.

## 2 · Plan — files, order, what dies

1. `useSession.ts:547-568, :754-763, :689-716` — §1.1, with U1/U2/U3 in `useSession.test.ts`.
   Lands ONCE for the section (chair to name the owner).
2. `scripts/check-peer-tin.mjs` re-cut per `research/PAL-TIN/instruments/check-peer-tin-recut.md`:
   resolve `var()` aliases and `hsl()` per ARM; gate 1a hue ≥ 12° over the RESOLVED 19 within
   the arm (expected 13.75 / 13.87); gate 1b OKLab ΔE against the CELL 9 within the arm,
   **absolute floor 0.075** (expected 0.082 / 0.100; pass 1's 0.046 and any HEAD-band tin fail)
   AND the ratio to the best-five-berth ceiling re-derived in the same run, printed, its floor
   pinned by the prototype's reading; gate 2 pairwise ≥ 0.10 (expected 0.116 / 0.172); gate 3
   hex identity; four negative controls under `--self-test`; the gamut-ceiling row and the
   8-bit row printed (0.000°, a table is authored in bytes). Born-RED at HEAD. Run bare.
3. `index.css:155-162, :370-375` — the ten declarations of §1.2; `--peer-ink-l` retires; the
   comment says the band mechanism.
4. `playerIdentity.ts` — `inkFor` → the table; `lapFor`, `tallyFor`, `seedFor` exported;
   `slugFor` consumes `seedFor`; header re-cut to the measured numbers and the 30.
5. `useSession.ts` — self binding on `known > 1`; the clock stamp at session start; `Player.lap`;
   `authorLap` beside `authorInk`.
6. `PlayerTick.vue` (from the pass-1 worktree diff) — corner geometry, `boardSize` stroke, `seed`
   from `seedFor` in row mode; `DigitCell.vue` mounts it beside the ghost when `tallyFor ≥ 1`;
   `index.css:926, :948` widened; `GameControlPanel.vue:1148-1152` the row's tick after
   `.player-name`, `:1769` `flex: 0 1 auto`.
7. `pencilConfig.ts DRAW_IN_PRESETS.tally`; `DifficultyTally.vue:77` reads it.
8. `gameCell.css:234` — 0.80 (the substrate row, once).
9. `HandDrawnGrid.vue:601` — the comment names the violet and index 3.
10. Tests pinning the walk string re-pinned (`useSession.test.ts:127-132, :338`,
    `useJoinWash.test.ts`, `useStagingBridge.test.ts`, `posters.test.ts`); a four-line unit
    over `tallyFor`: 30 distinct `(stick, tally)` pairs over indices 0–29, `tallyFor(30) ===
    tallyFor(25)`.
11. MOVED rows: `r0/r6-idiom-history/hue-census.mjs` tail reads the player tokens out of
    `index.css` (`research/PAL-TIN/instruments/hue-census-recut.diff`, runnable; the instrument
    writes nothing, stdout only); `e2e/multiplayer.spec.ts:190, :218` comments ("the incumbent
    blue") re-worded, assertions untouched.

**Dies:** the 137.5° walk, `--peer-ink-l`, self's `ink: {}` in a room, the ring's 0.55, the
tally's local stagger literal, the centred tally, `p.id.length` as a seed, the publish-side
agreement. **Does not die:** the one-binding mechanism, `IDENTITY_CAP`, `.player-swatch`, the
roster's fold animations, the join wash, `BoardHost.vue:73`'s single-key extraction (the ink
record stays one key).

## 3 · Prototype brief

Replay the pass-1 diff (`pass1/prototype/PAL-TIN/proto/PAL-TIN-tracked.diff` + `proto/new/`)
into a FRESH worktree off `a8fee1f5` (the pass-1 worktree is the record; `git diff --stat
aab67b92 a8fee1f5 -- web/` is empty, nothing to rebase), then apply §2. Dev server on
127.0.0.1:4245 (`--strictPort`, next free in 4230–4249 if taken) through a two-line scratch
vite config with a private `cacheDir` in the evidence dir; scratch Playwright config, no
`webServer`; chromium + webkit; dark driven through the product's own key
(`localStorage["sudoku-color-scheme"]`, settled on a rAF after the class write, not a wait).
KILL the server before returning. Two-context rigs only (one context shares
`session-identity-v1` and the second page believes it is the author).

Prove, numbers first, in this order:

1. **The wire.** `npx vitest run` bare: U1 RED at HEAD and GREEN after; U2 RED against the
   pass-1 rider (replay it on a scratch copy) and GREEN after; U3 GREEN. Then the research's
   three-page rig (`research/PAL-TIN/probe/tin2.spec.ts`, copied and re-pointed) on the real
   surface, both engines: B ends on index 3, one amber, `duplicateInks: 0`, `refusedTheAuthor:
   false`. Success is the three fields.
2. **The gate, bare.** `node scripts/check-peer-tin.mjs` exit 0 printing 1a ≥ 13.7°, 1b ≥ 0.082
   / 0.100 with the ceiling and the ratio; `--self-test` exit 0 with all four controls RED;
   against HEAD's `index.css` exit 2; against the pass-1 tokens gate 1b RED at 0.046.
3. **AA on the engine's bytes**, ten arms × two grounds × two engines, declared = painted
   byte-for-byte; worst ≥ 4.5 (expected 7.15 light, **5.18 dark**, the number the band move
   spent margin on).
4. **The ring off PAINTED pixels** (`research/PAL-TIN/probe` r2 rig re-pointed), worst stick
   over four grounds against the ring's OWN 4% fill, both engines, both themes, dpr3: ≥ 3.0
   (expected ≥ 4.3 light, ≥ 3.6 dark). Retire "3.20" everywhere.
5. **Solo byte-identical**: the r5 fingerprint on a SEEDED board (the critique's flake), zero
   `.glyph-tick`, zero `.roster-tick`, both engines; the leave path back to solo bytes.
6. **The corner tick under a 1, a 4 and a 7**, 9×9 dpr3, real key presses: `getBBox` of the
   tick vs the glyph, zero overlap; the single upright's centre ≥ 30 cell-% off the `1`'s
   centre; one crop (≤150 KB) of amber `1` beside amber `1` with one tick, light. Then the same
   cell with `.cell-because` armed and with the invalid ring: the tick's box does not touch the
   rim (a number; a crop only if it does).
7. **The stroke follows the board**: painted width at 9×9 desk, 9×9 phone, 16×16 phone (dpr3
   pixel columns): 1.85 / 1.30 / 1.21 ± 0.1 CSS px. One crop of the 16×16 phone tick, dark.
8. **Sixteen at the table** (the research's T2 rig): 16 rows, 5 painted swatches, 11 ticks,
   every tick against its word (tick left edge − name right edge ≤ 0.4rem), both widths.
   One crop of the roster at sixteen, light: the legend claim.
9. **The one-person room**: write a digit, press invite, write a second: BOTH strokes read
   `#2563eb`; a peer arrives: both snap to the stick on the join trace's first frame, and
   the peer's page names both cells as yours.
10. **Censuses**: filterBudget 9 with a 16-player board mounted (r3 `budget.probe.ts`); wobble
    probe's ring σ unchanged; goldens 4/4 against the built dist; r2 `accent-kinship.probe.ts`
    COPIED and `OUT` re-pointed first, toll row over the five sticks ≥ 4.5; the re-cut r6
    hue-census prints the five with L/C/h; `check-copy-register` exit 0 (no string minted);
    knip clean, `--peer-ink-l` zero references.
11. **Print and forced colours**: tick and digit `rgb(0,0,0)` / `CanvasText` through the
    widened selector, with the un-widened negative control reading the ink.

Four crops at most (steps 6, 7, 8, and one dark board with two sticks and a tick), each ≤150 KB.

Success in one sentence: sixteen people, five inks two steps clear of the machine's at night,
every one tellable from every other by ink or by a corner tick that never reads as a stem,
nothing spoken, the room converging on the author's word, the census at 9.

## 4 · Born-RED gates this family lands with

| gate | file | HEAD | after |
|---|---|---|---|
| U1 agreed index survives a non-author's rival `st` | `useSession.test.ts` | RED | GREEN |
| U2 a joiner's own publish agrees nothing | `useSession.test.ts` | GREEN (RED at pass-1 rider) | GREEN |
| U3 no two known ids share an ink string across two epochs | `useSession.test.ts` | GREEN (RED at pass-1 rider) | GREEN |
| tin: 1a degrees ≥ 12 (resolved, per arm) · 1b ΔE ≥ 0.075 vs CELL 9 + ratio printed · 2 pairwise ≥ 0.10 · 3 no stick is an anchor · four negative controls | `scripts/check-peer-tin.mjs` | RED (no tin) | GREEN |
| ring ≥ 3:1 off painted pixels vs its own 4% fill, worst of five × four grounds | new e2e row | RED 2.13 light | GREEN ≥ 3.6 |
| the tick never overlaps the glyph box; single upright ≥ 30 cell-% off a `1`'s centre | new e2e row | n/a | GREEN |
| painted stroke = boardWidth/300 ± 0.1 at three board sizes | new e2e row | n/a | GREEN |
| the tick prints black and yields to forced colours (with the un-widened control) | new e2e row | n/a | GREEN |
| solo fingerprint on a seeded board + zero ticks + leave path | r5 probe promoted | GREEN | GREEN |
| one hand, one colour in the one-person room | new e2e row | RED (pass-1 rider: two colours) | GREEN |
| 30 distinct `(stick, tally)` states; `tallyFor(30) === tallyFor(25)` | `playerIdentity.test` | n/a | GREEN |
| AA ten arms × four grounds on engine bytes ≥ 4.5 | new row | n/a | GREEN 5.18+ |
| filterBudget 9 · goldens 4/4 · copy register 0 · knip clean · no timing literal outside pencilConfig | existing | GREEN | GREEN |

## 5 · What this family asks the owner (U-10), unchanged in substance, now with numbers

- **B-TIN-1**, law 22's formula half: a designed tin of five with a drawn sharing mark. The price
  of the walk at HEAD's bands, painted: 32/40 indices within ΔE 0.10 of a reserved ink in light,
  40/40 in dark. (PAL-WALK's own pass-2 spec now moves its bands too; the comparison at the
  re-look is between two banded designs, and the agglomerator holds both numbers.)
- **B-TIN-2**, the sixth player's tick: system or bug, with the corner cure beside it (a single
  upright is now 34.75 cell-% off a `1`'s stem, not 3.25).
- **B-TIN-3**, the roster tick against the word (default here) or a tally column.

## 6 · Risks carried forward

1. Dark AA margin is 0.68, not 4.0; every dark reading is re-measured on bytes (step 3).
2. The ratio gate's ceiling at the moved bands is unmeasured; the prototype prints it and the
   floor is pinned from that reading, never raised later to pass.
3. The clock stamp at session start is a substrate change in the same file as the wire rule;
   it wants one look at how `source` exposes user entries before it is landed.
4. No real device; W8 §8.3 is where the 16×16 phone tick becomes evidence.
5. The relay arm is untested (every rig is `?wire=local`); one relay run is a row, not a gate.
6. The pink at dark L 0.65 is the AA floor (5.18); a lower band is not available to it.

Evidence this lane adds: `PAL-TIN/probe/{color.mjs (copied from the research lane), tokens.mjs,
violet-cap.mjs, final.mjs}`, `PAL-TIN/tokens.txt`. No server, no port, no crop.
