# PAL-WALK · pass-2 SYNTHESIS — the walk over open arcs, the law split from the capacity, the band moved

Section §11c the per-player colour system · §3's peer exception · §12. Synthesized from the
pass-2 research at `../research/PAL-WALK/` (nine findings, three MOVED rows), the pass-1
critique (14 gaps), the chair's rulings and r0's ground (R2, R5, R6). Bound by the
frontend-design two-pass method. Read-only on the product; U-10 holds.

Own arithmetic this pass (`PAL-WALK/probe/band-walk.mjs`, output `PAL-WALK/band-walk.txt`):
the arc walk re-built from pass 1's own constants (guard 13°, six reserved arcs, `STEP =
OPEN/φ²` = 52.42° over 137.23°) and priced at PAL-TIN's band move. The result changes the
family's bill and is the one new thing this synthesis adds.

## 0 · The design plan, and the review against the tells

**Tokens.** No new hex. One formula: a golden walk over the arcs `index.css` has not spent, at
the largest chroma sRGB holds at both bands, capped at `--color-user-ink`'s own 0.215.
`--peer-ink-l` stays a two-arm scalar and MOVES: 0.5 → 0.44 light, 0.8 → 0.65 dark.
**Type.** Unchanged. **Layout.** Unchanged.
**Principles.** (1) A LAW and a CAPACITY are two questions: the law (no hand within 13° of a
reserved hue, and, now, no hand closer in ΔE to a reserved ink than the house's two nearest
crayons are to each other) is hard, cheap and true; the capacity (how many hands read as how
many people) is a curve the walk cannot move, and the module says the honest sentence.
(2) What is constructed is what is painted; the gate asks the MODULE, never re-derives its own
walk. (3) Solo is byte-identical, and so is the one-person room. (4) The reserved set is
discovered by chroma, never enumerated by name.

**Tells checked, and what the review changed.** No avatar, initial, dot, flag or stock set; the
one tell the incumbent carries (you a Tailwind blue beside generated peers) is cured by binding
self in a room. Changed on review: (a) pass 1 fused peer-vs-token and peer-vs-peer into one 12°
number, and the research showed the promise fails in ΔE for a majority of the walk (75/144
light, 100/144 dark closer to a token than 0.0764); measured here, the BAND is the lever
nobody pulled for the walk either: at L 0.44 / 0.65 those counts are **5/144 and 1/144**;
(b) the two-var chroma fallback is WITHDRAWN (it breaks `BoardHost.vue:73`'s single-key
extraction into the wrong colour, and at the moved bands the one-string chroma reads 0.1242
mean at cap 0.215, which is what the fallback was buying); (c) the 0.5° hue-exactness gate is
RETIRED by deletion with its reason; (d) the roster no longer recolours at the invite press.

## 1 · The spec

### 1.1 The walk (pass 1's mechanism, held)

```
RESERVED = every declaration in index.css whose OKLCH chroma > 0.06, resolved per arm,
           each claiming ±13° (12° law + 1° for the 8-bit round trip, measured 0.96° max)
OPEN     = the complement (HEAD: five arcs, 137.23°)
STEP     = OPEN × (3 − √5) / 2 = 52.42°            t(i) = (i × STEP) mod OPEN
h(i)     = the hue at arclength t(i) along the open arcs in order
C(h)     = min(0.215, chromaAt(h, L_light), chromaAt(h, L_dark))      one string, both themes
ink      = oklch(var(--peer-ink-l) C(h) h deg)
```

The arcs are a constant in `playerIdentity.ts` that tier 1 re-derives from the sheet every run
(§1.6). Nothing is edited by hand.

### 1.2 The band — the lever, measured on the walk

`--peer-ink-l: 0.44` (`index.css:162`) and `0.65` (`:375`). Arithmetic over 144 indices, the
arc walk at cap 0.215 (`band-walk.txt`; the prototype paints it):

| | pass 1 (0.50 / 0.80) | moved (0.44 / 0.65) |
|---|---|---|
| hands closer to a reserved ink than the house's crayon reference 0.0764, light | 75 / 144 | **5 / 144** |
| same, dark | 100 / 144 | **1 / 144** (i=0 vs crayon-rose, 0.0709) |
| worst of the first eight, light / dark | 0.0315 (i=1, solver-4) / 0.0333 (i=2, solver-3) | **0.0788 / 0.0709** |
| worst of 144, light / dark | 0.0272 / 0.0271 | **0.0716 / 0.0709** |
| peer-vs-peer N=3 / 4 / 8 / 16, light | 0.0877 / 0.0413 / 0.0237 / 0.0110 | 0.0741 / **0.0741** / 0.0212 / 0.0082 |
| worst AA, light / dark | 5.45 / 9.31 | **7.10 / 5.20** |
| mean chroma | 0.1138 | 0.1242 (0.1149 at cap 0.166) |

Read: the LAW becomes true in ΔE, not only in degrees (worst-of-144 rises 2.6×, to within
0.005 of the crayon reference); the first four hands separate 0.041 → 0.074 (four people, not
three); the eighth and beyond do not move (0.021, the capacity curve); light AA rises, dark
falls to 5.20 with 0.70 of margin. The first six at the moved bands: 27.2° `#9e000d`/`#e8594f`,
181.8° `#006056`/`#529f93`, 234.2° `#005a7d`/`#5198bf`, 47.2° `#863800`/`#cb764a`, 201.8°
`#005e64`/`#529da3`, 320.6° `#820097`/`#c659dc`.

The `index.css` comment says the mechanism once: the dark pastels of the solver sit at L
0.81–0.92 and the estate's own dark blue at 0.714; a walk at 0.80 lived among them, and at
0.65 it sits a step under all of them. Graft, credited: PAL-TIN's band sweep found it for the
tin; this lane priced it for the walk.

### 1.3 Capacity, stated in the module header and nowhere in the product

> Four hands read as four people. Eight are distinguishable side by side and not identifiable
> apart. Sixteen is one colour said sixteen times.

At the house reference (0.0764): 3 hands hold (N=4 is 0.074, a hair under). At 0.05: 4. At
0.02: 8. The landed unit test asserts the PAINTED figures the prototype measures, never
"eight" on requested hues (critique gap 6). If the owner's "16+ within reason" binds on
distinguishability, this family yields the palette to PAL-TIN's tick and what survives is
§1.2's band, `chromaAt`, the ring at 0.80, the wire rule and the painted-byte method.

### 1.4 The wire rule — identical text to PAL-TIN §1.1, lands once

> An index is AGREED when, and only when, it arrives in an `st` whose SENDER IS THE EPOCH'S
> AUTHOR. A page's own publish agrees nothing. An agreement is made under an epoch and dies
> with it: a newer epoch by a different author clears the set before adoption.

`adoptInk(k, authoritative = from === e[1])` at `useSession.ts:547-568`; in the `st` arm
(`:754-763`) read `fresh = e[1] !== ledger.epoch[1]` before the epoch is written and clear
`inkAgreed` when fresh; `sendState` marks nothing; teardown clears. `newer()` (`:98`) is the
only order. Units U1/U2/U3 as PAL-TIN §1.1 lists them (`bootPage`/`hear`/`stFrame`,
`useSession.test.ts:185-235`); U3 (no two known ids share an ink string) is this family's.
Owner: the chair names one carrier for the section.

### 1.5 You join — when the room exists, and one hand is one colour

Self takes the walk only when a SECOND id is known (`Object.keys(known).length > 1`), never at
the invite press; the board re-inks at the arrival, one event, explained by the join trace
that already fires (1180ms at 0.95). The solo-era cells (no clock entry, `noteWrite:897`
returns before `mintOp`) are stamped `[0, selfId]` at the one seam a session starts, so your
own board is never two colours of your own hand. Solo (`roomId === null`) binds nothing.

**F1, stated:** PAL-WALK is on the YES side (self takes a room colour). registry-v1 §6.3 books
it on the "keep the board blue" side; the booking is wrong for this family and the two halves
of the diff (the walk; the self binding) stay separable so an owner re-look that keeps the
blue leaves the walk intact.

### 1.6 The gate, tiered — because node cannot import the module

| tier | home | proves | negative control |
|---|---|---|---|
| 1 | `scripts/check-peer-arcs.mjs`, `lint:arcs` (node, CI lane) | every declaration in `index.css` with chroma > 0.06 lies inside a declared arc; the arcs constant agrees with the sheet | `--self-test`: move a hex → RED; **rename a chromatic token** → RED (under ACC-SIX's rename the pass-1 gate green-lit a hand 0.47° from `--color-answer-pale`) |
| 2 | `useSession.test.ts` (vitest; `inkFor` is already imported at `:127`) | the MODULE's emitted hues clear every arc over 144; U3; the two-author race converges | `STEP = 0.5` must RED |
| 3 | `e2e/` beside the arcs gate (local instrument, O-12) | the PAINTED bytes clear every arc over the first 16/24/40 both themes; peer-vs-token ΔE over 144 ≥ 0.07 both arms; AA over four grounds; the ring at its drawn opacity against its own 4% fill | the 0.55 ring (2.31 light, 144/144 under) |

**Retired:** the ±0.5° hue-exactness gate (the 8-bit round trip alone is 0.96°); deleted with
its reason in the commit, never loosened.

### 1.7 The four surfaces, states, both platforms, both themes

| surface | the design | states |
|---|---|---|
| board digit | glyph stroke = the ink, unchanged mechanism; every hand its own hue, none a crayon, none within a crayon's distance of the machine | peer: bound; you in a room of two or more: bound; you alone or solo: nothing |
| roster row | swatch + slug in the ink; your row joins the system only when someone else is here (no recolour at the invite press) | arriving 320 / returning 280 / leaving 320+420 hold, existing |
| peer cursor ring | `gameCell.css:234` stroke-opacity 0.55 → **0.80**; width 4 and fill 0.04 unchanged | drawn on 180ms `--ease-ghostDraw`, unchanged |
| join trace | stroke 8, 0.95 join / 0.65 rejoin / 0.45 leave, declared transient decoration | unchanged |

The ring's distinction from your focus ring is NOT width alone (research correction): the focus
ink `--color-focus-sketch` h 253.28° sits inside reserved arc [236.3°, 275.9°], so the law
guarantees ≥ 13° of hue on top of 3px and 0.10 of opacity, and the two rings never co-paint
(`gameCell.css:218-220`). The record carries a hue + width table and one ring crop per theme,
not a side-by-side of two states that cannot coexist. Expected ring at the moved bands: higher
in light (darker ink over paper), lower in dark; the prototype paints the worst of 144 against
the ring's own 4% fill, both themes.

Phone (390): row 16.42px, swatch 11.2px, colour viewport-independent. Dark: the same hues at L
0.65, the same chroma string.

### 1.8 Copy

None minted. A continuous hue cannot be named in plain words; the slug is the name.

### 1.9 Motion

No new verb, no new constant, `pencilConfig MOTION` untouched (law 3's partition; nothing here
is a curve or a duration). One moment: when the second id arrives, your digits SNAP to your
room ink on the join trace's first frame (1180ms at 0.95, `useJoinWash.WASH`); no stroke tween
on 81 paths. PRM: the same snap.

### 1.10 Couplings

- **The reserved set moves under this wave** (ACC-FIVE renames user-ink; ACC-SIX names four
  answer tokens). Tier 1 by chroma is the cure; a rename cannot hide a hue. One extra reserved
  hue at 192° takes the open span 137° → 111° and the room at 12° from 8 to 6: the walk is
  hostage to §3 and says so.
- **PLR-COUNT's ≥ 30° over the first six**: met at N=3 (52.7°, from HEAD's 12.7°), missed from
  N=4 (19.35°). The number goes back, not the claim.
- **PAL-TIN**: the band lever is shared; the wire rule is shared; the ring number is shared.
  What is not shared is the axis: a tin of five with a tick, or a walk of many at four-people
  legibility. The agglomerator holds both bills at the same bands.
- **R6 law 22 / law-probe L6** (MOVED): re-cut to "a formula, not a palette; a golden step over
  the arcs `index.css` has not spent, at the largest chroma sRGB holds at both bands", L6
  asserting a formula and no hexes, with its own negative control (a literal hue table in a
  scratch copy must RED). **accent-kinship.probe.ts** (MOVED): `OUT` re-pointed, the walk read
  from the module in page context, never re-written by hand.

## 2 · Plan — files, order, what dies

1. `useSession.ts` — §1.4 (once for the section) and §1.5's `known > 1` binding + clock stamp;
   `useSession.test.ts` U1/U2/U3 + the painted-capacity re-pin.
2. `scripts/check-peer-arcs.mjs` — tier 1 by chroma threshold; rename self-test; the 0.5° gate
   deleted; tier-2 rows into `useSession.test.ts`; tier-3 spec into `e2e/`.
3. `index.css:162, :375` — `--peer-ink-l` 0.44 / 0.65; the comment re-cut to the mechanism and
   the measured numbers.
4. `playerIdentity.ts` — cap 0.215; header re-cut (the honest sentence, the painted numbers).
5. `gameCell.css:234` — 0.80 (once for the section).
6. MOVED rows: R6 law 22 + L6; `accent-kinship.probe.ts`; `e2e/multiplayer.spec.ts:190, :218`
   comments; `HandDrawnGrid.vue:601`'s comment re-derived for the arc walk (which index now
   lands nearest `--color-progress-ink`, and at what ΔE).

**Dies:** the flat 0.11, the 137.5° step, self's `ink: {}` in a room, the ring's 0.55, the
roster recolour at the invite press, the two-var fallback, the 0.5° gate, the name-list regex.
**Does not die:** `--peer-ink-l`, the one-binding mechanism, `IDENTITY_CAP`, `.player-swatch`,
`BoardHost.vue:73`'s single-key extraction.

## 3 · Prototype brief

Replay `pass1/prototype/PAL-WALK/proto/palwalk.diff` into a FRESH worktree off `a8fee1f5`
(the pass-1 worktree is the record; the diff is against product-current source), apply §2.
Dev server 127.0.0.1:4244 (`--strictPort`, next free if taken) through a two-line scratch vite
config with a private `cacheDir`; scratch Playwright config, no `webServer`; chromium + webkit;
dark through the product's own key, settled on a rAF. KILL the server before returning.

Prove, numbers first:

1. **Tier 1 bare**: `node scripts/check-peer-arcs.mjs` exit 0; `--self-test` exit 0 with the
   moved-hex AND the renamed-token controls RED; the pass-1 gate against ACC-SIX's diff (scratch
   copy) reproduced GREEN, the re-cut RED.
2. **Tier 2**: `npx vitest run` bare; `STEP = 0.5` in a scratch copy reds the arc row; U1 RED
   at HEAD, GREEN after; U2/U3 GREEN.
3. **The law, painted, both arms**: canvas read-back of 144 indices at the moved bands, four
   grounds; 0 collisions over the first 16/24/40; peer-vs-token ΔE worst of 144 ≥ 0.070 both
   arms (expected 0.0716 / 0.0709); hands under 0.0764: ≤ 5 light, ≤ 1 dark. Report the
   nearest token per arm.
4. **AA**: worst of 144 × 4 grounds ≥ 4.5 (expected 7.10 light, **5.20 dark**); the four worst
   named; mean painted chroma reported (expected 0.124).
5. **Capacity, painted**: peer-vs-peer at N=3/4/8/16 both arms (expected 0.074 / 0.074 / 0.021
   / 0.008); the header's sentence and the unit re-pinned to these.
6. **The ring off painted pixels**, worst of 144 against its own 4% fill, both themes, both
   engines, dpr3: ≥ 3.0. One crop per theme of the ring alone (two crops, ≤150 KB each).
7. **The one-person room**: write, invite, write; both strokes `#2563eb`; roster row NOT
   recoloured; a peer arrives: both cells snap to the walk ink on the join trace's first frame.
8. **Solo fingerprint on a seeded board** identical before/after; the leave path back to solo.
9. **Censuses**: filterBudget 9; goldens 4/4 against the built dist; r2 `accent-kinship` COPIED
   and re-pointed, toll row ≥ 4.5 over 40 from the module's own inks; the re-cut L6 GREEN and
   its negative control RED; `check-copy-register` exit 0.
10. One crop of the closest pair among the first four in adjacent cells, light (the 0.074
    case, honestly shown). Three crops total.

Success in one sentence: a walk that never runs out, whose every hand now sits as far from the
machine's inks as the house's own crayons sit from each other, four people legible at a glance,
the gate asking the module and the sheet rather than itself.

## 4 · Born-RED gates this family lands with

| gate | file | HEAD | after |
|---|---|---|---|
| tier 1: every chromatic declaration inside a declared arc; moved-hex and renamed-token controls | `scripts/check-peer-arcs.mjs` | RED (no arcs) | GREEN |
| tier 2: the module's 144 hues clear every arc; `STEP = 0.5` reds | `useSession.test.ts` | RED | GREEN |
| U1 agreed index survives a non-author's rival `st` | `useSession.test.ts` | RED | GREEN |
| U3 no two known ids share an ink string across two epochs | `useSession.test.ts` | GREEN (RED at pass-1 rider) | GREEN |
| painted law over 16/24/40 both themes; peer-vs-token ΔE worst-of-144 ≥ 0.070 | `e2e/` | RED 37 (HEAD walk) · RED 0.027 | GREEN 0 · ≥ 0.070 |
| ring ≥ 3:1 off painted pixels vs its own 4% fill, worst of 144 | `e2e/` | RED 2.31 light | GREEN |
| one hand, one colour in the one-person room; no roster recolour at the invite press | `e2e/` | RED (pass-1 diff) | GREEN |
| solo fingerprint on a seeded board + leave path | r5 probe promoted | GREEN | GREEN |
| AA 144 × 4 grounds on engine bytes | `e2e/` | GREEN | GREEN (5.20+) |
| R6 L6 re-cut: a formula and no hexes, with its literal-table control | `r0` MOVED row | GREEN | GREEN (control RED) |
| filterBudget 9 · goldens 4/4 · copy register 0 | existing | GREEN | GREEN |

## 5 · What this family asks the owner (U-10)

One question, re-priced: is four people legible at a glance, and eight side by side, enough
for a worksheet? If yes, this is the colour: hue exact, richer than today (0.124 vs 0.110), a
band clear of the machine's inks in both themes, you inside the system when someone else is
here. If sixteen must read as sixteen, the arcs cannot do it and PAL-TIN's tick must. The two
families are not mergeable on this axis; what rides either answer is the band, `chromaAt`, the
ring at 0.80, the wire rule and the tiered gate.

## 6 · Risks carried forward

1. The moved bands are arithmetic here, painted nowhere yet; every figure in §1.2 is the
   prototype's to confirm on bytes, both engines.
2. Dark AA falls to 5.20 (0.70 of margin) and the dark ring falls with the band; step 6 reads
   the worst of 144, not one hand.
3. The reserved set moves under §3's ruling; tier 1 by chroma survives a rename, but the arcs
   and the room re-derive and the room can drop to 6.
4. The clock stamp at session start is a substrate change in `useSession`; it wants one look
   at how `source` exposes user entries.
5. The relay arm is untested; one relay run is a row, not a gate.
6. `BoardHost.vue:73` stays a single-key extraction on purpose; any future multi-key ink breaks
   it into the wrong colour with no gate to catch it, which is why the fallback is withdrawn
   rather than deferred.

Evidence this lane adds: `PAL-WALK/probe/{color.mjs (copied from the PAL-TIN research lane),
band-walk.mjs}`, `PAL-WALK/band-walk.txt`. No server, no port, no crop.
