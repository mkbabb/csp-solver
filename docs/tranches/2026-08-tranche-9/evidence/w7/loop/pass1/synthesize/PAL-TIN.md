# PAL-TIN · pass-1 SYNTHESIS — five inks and the tick

Section §11c the per-player colour system · §3's peer exception · §12. Synthesized from the
pass-1 research at `../research/PAL-TIN/` (verdict ADJUST, large) and the r0 ground (R2,
R5, R6). Nothing here is closed; U-10 holds. Read-only on the product.

## 0 · The design plan, and the review against the tells

**Tokens.** Five named inks, two arms each, ten hexes, cut into the wheel's open arcs and
checked by two gates (the 12° anchor law and a ΔE ≥ 0.10 separation law). No twelfth
stick exists on this paper (min ΔE 0.024); no sixth (0.091). The sharing axis is not a
colour: it is a drawn tally tick.
**Type.** Unchanged.
**Layout.** Unchanged, plus one element: the tick, after the slug on the row and under the
digit on the board.
**Principles.** (1) A finite designed palette; running out is a designed state. (2) The
roster row is the legend: the same drawn tick beside the name and under the digit, so
nothing needs a sentence. (3) Solo is byte-identical. (4) The tick strokes the same ink
var the glyph does, and the print and forced-colours rules widen by one selector to reach
it (the glyph svg is `contain: paint` at 65% of the cell, so the tick cannot live inside it).

**Tells checked.** Stock categorical palette: none of the ten hexes is a Tailwind hex; the
light arms sit at ink lightness (L ≈ 0.5) on graphite paper, not chip lightness; each is
named in plain English in the token file. Avatars, initials, presence dots, cursor flags:
none. Changed on review: the charter's lobby line "green pencil, two ticks" is dropped as
the default. "pencils" already names the marks well in this product (the washi tag), a
second meaning is a tell, and the comma is not in the hand's cut. The roster row carries
the tick and IS the legend. A sentence survives only as an owner option (§1.6).

## 1 · The spec

### 1.1 The tokens

```
:root                                   .dark
--color-peer-1: #b24f00  amber  48.5°   #ff9a62      5.02 / 5.14 · 9.15 / 8.96
--color-peer-2: #5f7d00  green 124.5°   #a0c942      4.56 / 4.67 · 9.95 / 9.74
--color-peer-3: #008086  teal  200.4°   #00d0d9      4.55 / 4.66 · 10.04 / 9.82
--color-peer-4: #5a61ce  violet 276.4°  #a4b1ff      4.99 / 5.11 · 9.39 / 9.19
--color-peer-5: #a5439a  pink  332.4°   #f48ce6      5.21 / 5.33 · 8.87 / 8.68
```
(contrast on `--color-background` / `--color-card`, light · dark, engine bytes both
engines; worst 4.55:1 light, 8.68:1 dark; min pairwise ΔE 0.145 light / 0.139 dark; mean
chroma 0.142; every stick ≥ 13.5° from all 29 reserved inks, the margin that 8-bit
quantisation needs.)

Placed in `index.css` beside `--peer-ink-l` (`:155-162`) under the same comment block, with
the `.dark` arms at `:370-375`. `--peer-ink-l` RETIRES with its last consumer. The dark
arms sit in the PEER band (L ≈ 0.80), not the crayon step (+0.06…0.10): a player's ink is
ink, not wax; the incumbent user-ink already moves +0.168 at night. This rules the
charter's "dark arms under the crayon law" against, and says so.

Law 23 (a state token aliases a crayon, zero new hexes) is knowingly excepted: presence is
one of the two jobs R2 §3 found genuinely need a hue the wheel cannot supply. Law 22
(T6 mark 13: "a formula, not a palette; no cap") is HALF re-litigated: the no-cap half
survives (5 × N is uncapped); the formula half is what this family asks the owner to
overturn. That is the ballot.

### 1.2 The allocator

```
stick = index % 5        ticks = floor(index / 5)
inkFor(index) → { "--color-user-ink": "var(--color-peer-{stick+1})" }
Player.lap  = ticks      (a second field beside ink; nothing new on the wire, k already carries the index)
```

Tin order, never a golden angle. A late joiner takes the next stick; the sixth player
takes amber again with one tick. The lap number IS the tick count.

### 1.3 The tick — the memorable thing on the board

A tally stroke in the deal counter's own hand (`DifficultyTally.vue`'s gate-five geometry:
uprights 1–4, the fifth a binding slash), drawn as a SIBLING svg of the glyph in
`DigitCell.vue` (`<svg class="glyph-tick" aria-hidden>` beside the `.cell-ghost` div at
`:409-424`), stroking `var(--color-user-ink)` so it is the ink by the one existing binding,
seeded off the cell position like the cell ghost (`wobbleLine`, frozen: no beat, no
filter). It cannot live inside `.glyph-svg`: that svg is `viewBox 0 0 40 56` at 65% of the
cell with `contain: paint` (`HandwrittenGlyph.vue:319-331`), so anything under the
baseline is clipped. The print and forced-colours rules at `index.css:926` and `:948`
widen from `.glyph-svg path` to `.glyph-svg path, .glyph-tick path` — one selector, two
places, and the tick then prints black and yields to `CanvasText` exactly as the digit does.

Geometry, in cell units: the glyph occupies the middle 65%, so the lower 17.5% band is the
tick's. Tick height 12% of the cell, stroke-width 3% of the cell width (min 1px), centred
horizontally, its foot 3% above the cell's bottom edge; ticks at 7% spacing; five = four
plus the slash (the research's dpr3 crop at 9×9 used 10px tall, stroke 1.6, `bottom: 3px`).
At 16×16 on a phone the cell is ≈ 22px and the tick ≈ 3px: the prototype measures at dpr3
whether it reads; if it does not, the roster alone tells 16×16 sharers apart on a phone,
and the spec says so. Beyond lap 5 (the 26th player) the drawn tally holds at five and the
roster keeps counting; that is beyond reason.

`aria-hidden`: the cell's accessible name already names the author by slug; a spoken tick
would be W3's second-region defect wearing a picture.

Mounted only when `ticks ≥ 1`. Solo: `ticks 0`, nothing mounted, byte-identical.

### 1.4 The roster row is the legend

`swatch · slug · tick(s) · you` — the tick after the slug, in the row's ink, the same drawn
strokes at row height (14px tall, stroke 2, round caps), `aria-hidden`. A sighted reader
who sees an amber `7` with one tick on the board and an amber row with one tick in the
roster has been told who wrote it without a word. The `you` qualifier's berth is
PLR-PLACE's row and is not moved here.

### 1.5 You join

`k[self]` binds your stick on your own page when a room exists. Three sites, one
condition, identical to PAL-WALK's: `useSession.ts:537` (mint), `:556` (adoptInk), `:406`
(authorInk's self-skip), gated on `roomId`, never on self. Solo binds nothing.

**Rider, same commit:** the `adoptInk` guard (never rewrite an index this page already
holds; `useSession.ts:554`). With five inks a rival `st` re-inking the room is a person
going from green to pink in front of you, not an invisible hue jump; this spec refuses to
land without the guard.

### 1.6 Copy

None minted by default; the roster is the legend. Owner option (U-10), one sentence in the
players well's polite `players-status` region, spoken once when the first sharer arrives:
`six or more players share a colour and get a tick` — every letter is in the hand's cut
(a–i, k–w, y, z; no comma, no `j`, no `x`), zero woff2 re-cut, one `check-copy-register`
row. Not spoken by default because it narrates the UI, which M16 says to delete.

### 1.7 Motion

- The tick on a digit draws in with the digit: `pencil-draw-on`, `DRAW_IN_PRESETS.glyph`
  duration 350ms, `--ease-drawOn`, and the tally's 90ms stagger after the digit's stroke.
  That 90 is `DifficultyTally.vue:77`'s local literal today; it moves to
  `pencilConfig DRAW_IN_PRESETS.tally = { duration: 350, stagger: 90 }` and the tally reads
  it from there (one constant, two consumers, net-zero literals; the covenant honoured).
- The roster tick draws with the name's write-in (J2, 140–520ms on `--ease-glassGlide`),
  no timing of its own.
- Your digits take your stick when the room opens: a SNAP on the join trace's first frame
  (1180ms at 0.95), no stroke tween. PRM: snap everywhere; the tick appears inked.
- The peer cursor ring keeps its 180ms `--ease-ghostDraw` draw-on.

### 1.8 The four surfaces, states, both platforms, both themes

| surface | the design | states |
|---|---|---|
| board digit | stick ink + tick under the digit | peer bound; you in a room bound; solo nothing |
| roster row | swatch + slug + tick, all in the ink | arriving / returning / leaving, existing |
| peer cursor ring | `gameCell.css:236` stroke-opacity **0.55 → 0.80** (3.20:1 worst on the tin, four grounds, both themes; 0.75 is the negative control at 2.95) | drawn on 180ms, unchanged |
| join trace | 0.95 join passes (4.17+); 0.65 / 0.45 declared transient decoration | unchanged |

Phone (390): row 19px, tick 14px inside the row's line-height 1.35, swatch 11.2px; 16×16
cells ≈ 22px so the tick is ≈ 5px tall at stroke ≈ 1px, measured at dpr3. Dark: the dark
arms, same geometry.

## 2 · Plan — files, order, what dies

1. `web/frontend/scripts/check-peer-tin.mjs` (NEW gate, from
   `research/PAL-TIN/probe/instruments-family-law-tin.mjs`, reading the PRODUCT `index.css`
   instead of the proto file): gate 1 every stick ≥ 12° from all 29 reserved inks; gate 2
   min pairwise ΔE ≥ 0.10 per arm; gate 3 no stick is a reserved ink. Born-RED at HEAD (no
   tin). Wired into `npm run check`.
2. `web/frontend/src/assets/index.css:155-162, :370-375` — ten declarations; `--peer-ink-l`
   retires; the comment block rewritten to the measured numbers.
3. `web/frontend/src/games/shared/playerIdentity.ts:62-70` — `inkFor` → the table +
   `lapFor`; header re-cut.
4. `web/frontend/src/games/shared/useSession.ts:406, :537, :554-556` — self binding on
   `roomId`; `adoptInk` guard; `Player.lap`; `authorLap` computed beside `authorInk`.
5. `web/frontend/src/games/shared/BoardHost.vue` (the single cell-mount site) → `:ticks`
   prop → `DigitCell.vue` mounts `<svg class="glyph-tick">` beside the ghost when
   `ticks ≥ 1`; `index.css:926, :948` widen to `.glyph-svg path, .glyph-tick path`;
   `GameControlPanel.vue:1148-1152` the row's tick after `.player-name`.
6. `web/frontend/src/pencil/config/pencilConfig.ts` `DRAW_IN_PRESETS.tally`;
   `DifficultyTally.vue:77` reads it.
7. `web/frontend/src/games/shared/gameCell.css:236` — 0.80.
8. Tests pinning the walk's string (`useSession.test.ts:127-132, :338`, `useJoinWash.test.ts`,
   `useStagingBridge.test.ts`, `posters.test.ts`) re-pinned to `var(--color-peer-N)`.

**Dies:** the 137.5° walk, `--peer-ink-l`, self's `ink: {}` in a room, the ring's 0.55,
the tally's local stagger literal. **Does not die:** the one-binding mechanism,
IDENTITY_CAP, the roster's fold animations, the join wash.

**Couplings:** under ACC-SIX a sixth anchor re-runs gate 1; the stick with least room is
violet (13.5° off user-ink) and is the one that moves. If ACC-FIVE makes user-ink kin to
crayon-blue, gate 1 re-runs and the answer is still five (retiring user-ink from the
reserved set changed nothing, measured).

## 3 · Prototype brief

Throwaway worktree under the scratchpad (never committed), steps 2–7 as a `.diff` banked
under `pass1/prototype/PAL-TIN/proto/`. Dev server `npx vite --host 127.0.0.1 --port 4245
--strictPort`; scratch Playwright config on that port; chromium + webkit, light + dark.

Prove, in this order:

1. **The gates run bare** (a pipe eats the exit code): `check-peer-tin.mjs` exit 0 on the
   landed tokens; the r0 `instruments-family-law.mjs` re-pointed at the table exits 0.
2. **AA on the engine's bytes**: five sticks × four grounds × two engines, declared and
   painted agreeing byte-for-byte; worst ≥ 4.5:1 (research: 4.55 light / 8.68 dark).
3. **Ring 3:1**: peer ring at 0.80 over card and background, both themes, worst ≥ 3.0
   (research: 3.20; born-RED at HEAD 2.13–2.29).
4. **Solo byte-identical**: the r5 fingerprint identical before/after, both engines, AND
   `document.querySelectorAll('.glyph-svg .tick').length === 0`.
5. **The sixteen-person roster** in the product's own component (the research's T2 rig):
   5 distinct painted swatches, 11 rows with a tick, every row 19px; the tick's box inside
   the row's line box on both platforms (390 and 1280).
6. **The tick on a digit**, both engines, dpr3, 9×9 AND 16×16: the `.glyph-tick` sits
   wholly inside the cell's lower 17.5% band (no overlap with the glyph box, measured),
   strokes the ink, and under print emulation reads `rgb(0,0,0)` and under
   `forced-colors: active` `CanvasText` through the widened selector; a negative control
   with the selector un-widened must read the ink (proving the rule is load-bearing).
7. **I2 both directions** GREEN; I4 GREEN after the guard; I3 stays RED (not claimed); I5
   per engine.
8. **filterBudget** 9 (r3 `budget.probe.ts`) with a 16-player board mounted; the wobble
   probe's ring σ unchanged (the tick is frozen geometry, not in the ring's band); goldens
   4/4 unmoved solo; r2 `accent-kinship.probe.ts` toll row over the five.
9. **The draw-in**: the tick's stroke-dashoffset settles 90ms after the digit's; PRM snaps.

Frames (≤150 KB each, few): (a) dpr3 board crop, two adjacent cells, amber and amber-with-
one-tick, light; (b) the roster at sixteen, light, showing the SAME tick beside the names
(the legend claim); (c) the 16×16 tick at dpr3, dark. Three crops, ~80 KB.

Success in one sentence: sixteen people, five inks, every one of them tellable from every
other by ink or by tick, with nothing spoken and the census at 9.

## 4 · Born-RED gates this family lands with

| gate | file | HEAD | after |
|---|---|---|---|
| tin: anchor law + separation ΔE ≥ 0.10 + no stick is an anchor | `scripts/check-peer-tin.mjs` (new) | RED (no tin; the walk reads 37) | GREEN exit 0 |
| peer ring ≥ 3:1 at the DRAWN opacity | new e2e row | RED 2.13–2.29 | GREEN 3.20 |
| I2 own swatch = room's colour | r5 `instruments.spec.ts` | RED | GREEN |
| I4 index survives a rival `st` | r5 `instruments.spec.ts` | RED | GREEN |
| the tick prints black and yields to forced colours | new row (print + forced-colors emulation, with the un-widened negative control) | n/a (no tick) | GREEN via the widened selector |
| solo fingerprint + zero ticks mounted | r5 probe promoted | GREEN | GREEN (regression) |
| AA five × four grounds, engine bytes | new row | n/a | GREEN ≥ 4.55 |
| filterBudget 9 · goldens 4/4 · no timing literal outside pencilConfig | existing | GREEN | GREEN |

## 5 · What this family asks the owner (U-10)

Two questions. First, law 22's formula half: does a player's colour become a designed
palette of five with a drawn sharing mark, uncapped by the tick? Second, does the sixth
player carrying a tick read as a system or as a bug? The research says sharing has to be
GOOD, not rare, and the design answers with the roster as legend; if the owner wants a
sentence, §1.6 has it priced. If the owner rules that sixteen must be sixteen HUES, no
palette on this paper delivers it (the whole wheel tops out at six) and the honest answer
is this one or PAL-WALK's eight.
