# PASS-1 SYNTHESIS · PLR-COUNT · The tally

Section §11 (icon · lobby) · §12 · M14. Synthesized 2026-09-17 from the pass-1 research
lane (`../research/PLR-COUNT/README.md`) against the r0 ground and the owner's Frame B
(`dealt ⊪`). Read-only on the product. U-10: this proposes.

Verdict carried forward: ADJUST. The object is the PLAIN STROKE (the gate fuses to one
painted run and steals the fifth person's mark; the stub's 6–10 device-px gap stops reading
as objects past ~6). The threshold is SIX, and past it the written count REPLACES the
strokes. F1 ruled COUNT's way: the board keeps `--color-user-ink`; colour on the mark and
in the register is a room-relative label.

Two decisions made in synthesis:

1. The two-colour ballot (your blue digits, your rose mark, 97.1° apart) is resolved INSIDE
   the family's own F1 ruling: your own stroke on your own page is `--color-user-ink`, the
   blue your digits already wear. The register's self row wears the same blue. On your
   neighbour's page you are their `k` ink everywhere on that page. One colour per person
   per page, which is what "the board keeps your blue" means read literally. The owner
   still disposes (U-10); the spec states the default.
2. The state line / accessible name is `no other players` / `N other players` (the
   estate's own idiom, `GameGallery.vue:219`), which greens r0's I3 without editing it.
   The research's `1 player on this board` is retired: "player" counted you, and the rows
   count everyone, so the line and the list disagreed by one.

---

## 1 · Tokens

| role | token | light | dark |
|---|---|---|---|
| solo stroke | `--color-pencil-graphite` at `stroke-opacity: 0.95` | #262626 → 12.48:1 | 10.95:1 |
| your stroke, your register row, the written count | `--color-user-ink` | #2563eb (4.96:1 page, 5.00 sheet) | #60a5fa (7.52 / 7.48) |
| a peer's stroke, a peer's register mark | `inkFor(k[peer])` at 0.95 | worst 4.771 (index 4 on background) | worst 8.579 |
| register names | `--color-pencil-graphite` | 14.65:1 on the sheet | 12.19:1 |
| state line, qualifiers, compression | `--ink-press-quiet` | 5.16:1 | 6.03:1 |
| sheet ground / edge / radius / padding / width | the @mbabb card's pose byte-for-byte | popover 80%, border 30%, 1rem, 1rem, 16rem | |
| tap floor | `--tap-floor` on the mark itself, both dimensions | 44 × 44 coarse | |

Stroke geometry inherits `DifficultyTally.vue:339-347`: `stroke-width 3.2` user units,
`stroke-opacity 0.95`, `stroke-linecap round`. At the head's scale (svg height 36 →
0.8182 px/unit) the stroke paints 2.618px and its core chroma holds 0.089–0.113 against
the nominal 0.11 — measured, so colour survives at this size.

Demand on PAL-WALK / PAL-TIN, stated exactly: N inks clearing the 29 reserved board inks
AND the head's 12 warm tokens (h 2.8–100.8) at a 2.6px stroke, with the first six indices
pairwise ≥ 30° (the mark attributes at N ≤ 6 and claims nothing past it); index 0 out of
the logo's rose (2.8° today). `--color-user-ink` itself is `--color-user-ink`'s problem
(index 15 sits 0.4° from it — the walk must skip that arc).

## 2 · Type

| surface | face | rung | weight |
|---|---|---|---|
| the written count in the head (N ≥ 7) | Patrick Hand | `--type-subheading` 1.272rem (20.35px), a fixed identity like every heading | 500 |
| state line | Patrick Hand | `--type-tag` | 500 |
| register name | Patrick Hand | `--type-small` (16 desk / 16 coarse / 14 fine-390) | 400 |
| qualifier (`you` / `26 seconds ago`), `and N more` | Patrick Hand | `--type-tag` | 400 |

All inside the shipped cut; digits U+0030–0039 present; zero re-cut (4,312 B asserted).

## 3 · Components

### 3.1 The mark — `PlayerTally`

One `<svg>` of height 36 CSS px in a `<button data-player-mark :aria-label="stateLine"
:aria-expanded :aria-controls>` padded `0.618rem 0.786rem` (the @mbabb trigger's rungs);
coarse: `min-width/min-height: var(--tap-floor)`. Uprights at pitch 13 user units, y 9→35
(`DifficultyTally`'s geometry), one per person in ARRIVAL order (self first), each drawn
with `generateLineBoilFrames(x, 9, x, 35, {roughness 0.95, segments 4, seed, jagged},
TALLY_BOIL 0.6, BOIL_CONFIG.frameCount, grain)` — grain BAKED into the pose geometry, the
four poses opacity-swapped on the shared beat (`useBeatFrame(heldFrameCount(…),
beatsFor(BOIL_CONFIG.intervalMs))`): zero live filters, 9 → 9 by construction. Seeds:
`11 + 12·i` so no two people share a wobble. Chunk gap after the fifth stroke: one extra
pitch (the plain control counts clean, runs == N, intra gap 19–21 device px, chunk gap
51–55). No diagonal, ever.

| N | drawn | width (h=36, measured) | colour |
|---|---|---|---|
| 1 (solo, or a room of one) | one stroke | 44 (the floor) | graphite |
| 2…5 | N strokes | 52.81 · 63 · 74.08 | self blue, peers in their `k` inks |
| 6 | five + gap + one | 95.36 (38% of the phone band) | as above |
| ≥ 7 | the count written: `12` | ≤ 60 | `--color-user-ink` — colour still says "live" |

The switch at 7 is a same-frame swap (no tween): the strokes unmount, the number mounts.
The number is `<text>`-free — it is the hand's own glyphs in an `<span>` beside the
(empty) svg, so it wears the type rung and needs no font-in-SVG.

Hover (fine pointers): the ink lift only — solo graphite at 0.95 → 1.0; live: no change
(a coloured stroke has nothing quieter to lift from). Focus ring: `2px dashed
currentColor`, offset 3. Under PRM: the boil is already collapsed by the estate's global
arm; the draw-in snaps.

```
phone 390 coarse, the head:
┌──────────────────────────────────────────────────────────┐
│ @mbabb   | | |                                       ☀   │  y 0…44
│ 0   75.5 ^ ^ ^                                  326  390 │
│          blue rose grn     52.81 wide, 44 tall           │
│ N=6      | | | | |  |      95.36 wide                    │
│ N=12     12                the count, in your blue       │
└──────────────────────────────────────────────────────────┘
```

### 3.2 The register — `PlayerLobby` (the sheet)

The @mbabb card's `.hover-card` pose byte-for-byte, hung off the wrapper at the PAGE's
left (x = 0; right edge 256 clears the sun), `data-lobby`, plain markup, no region role.

```
┌────────────────────────── 256 ──────────────────────────┐
│  2 other players                                        │   state · quiet
│  |  tragic-mockingbird  you                             │   stroke swatch (blue) · graphite name
│  |  literary-panda                                      │   stroke in ITS ink
│  |  opposite-heron  26 seconds ago                      │   qualifier berth
└─────────────────────────────────────────────────────────┘
```

Row: the same upright at row scale (an 18px-tall svg, one stroke, pose 0 — still, no
beat inside the sheet) in that person's ink · name in graphite · qualifier in quiet. `you`
0.35rem after the name (measured 5.6–8px, against the well's 153px). Names never clip
(longest slug 124.9px < 224).

Line budget: SIX lines on a phone (`76 + 22·6 = 208 ≤ 208.5`): state + ≤5 rows, or state
+ 4 rows + `and N more`. Desk: six until the desk board-top is measured (G8). No scroll.

Qualifier: `you` on self; `N seconds ago` on a peer whose `lastHeard` is ≥ 20 s at OPEN
(`PRESENCE_QUIET_MS`, beside `HEARTBEAT_MS`); no ticking. The foot line is dead (see
PLR-SELF §0 for the derivation; the same correction applies).

### 3.3 The well and the seam

Identical to PLR-SELF §3.3–3.4: the roster's drawing moves to the sheet as plain markup;
`.players-roster` stays mounted, `role="log"`, `sr-only`; three live regions → three. The
well drops 109 → 45. Invite and leave stay (M14).

## 4 · Copy

`no other players` · `1 other player` / `N other players` · `you` · `N seconds ago` ·
`and N more`. Five strings, the cut, M16, no first person. `just you` is undrawable (`j`)
and is not used.

## 5 · Motion

| event | what moves | duration · curve · home |
|---|---|---|
| a person arrives (N ≤ 6) | their stroke draws in via `stroke-dashoffset` over `pathLength=100` | `DRAW_IN_PRESETS.glyph.duration` · easeOutCubic on `createSequenceSubscription` (DifficultyTally's own reveal, `:135-161`); stagger `MOTION.tallyStaggerMs: 90` (MOVED into pencilConfig from `DifficultyTally.vue:77` when the composable is extracted) · PRM snaps to inked |
| a person leaves | their stroke unmounts on the room's `leave` event | no tween (the well's 740ms row-hold does not travel) |
| the strokes at rest | the shared boil beat, four baked poses | `BOIL_CONFIG.intervalMs` via `beatsFor`; `TALLY_BOIL 0.6` |
| 6 → 7 and 7 → 6 | same-frame swap | none |
| the sheet | the card's 150ms `--ease-standard` | inherited |

One choreographed moment: the stroke draws in on the same `join` event the board's wash
rides; 160ms against the wash's 1180. The boil is the house's ambient motion and is
already in the head (the sun); nothing else moves.

## 6 · Desktop and mobile, light and dark

Desk: mark at (75.5,12), 39.8 tall at fine pointers (the svg 36 + line box inside the
√φ padding), sheet at (0,51.8). Phone coarse: mark 44 × 44…95.36 at (75.5,0); sheet at
(0,44), bottom ≤ 208 + 44. Dark: peers at L 0.8 (worst 8.58:1 at 0.95), self `#60a5fa`,
graphite stroke 10.95:1. The count in dark: `#60a5fa` on ≈#110f0e, 7.52:1.

---

## 7 · Plan

1. `src/games/shared/useTallyStrokes.ts` (NEW, extracted from `DifficultyTally.vue:84-183`):
   `useTallyStrokes(strokes: {x1,y1,x2,y2,seed}[])` → `{ poses, boilFrame, reveal,
   drawIn(i) }`. `DifficultyTally.vue` consumes it (−~80 LOC there); `DRAW_STAGGER_MS` and
   `TALLY_BOIL` move to `pencilConfig` (`MOTION.tallyStaggerMs`, `BOIL_CONFIG.tallyBoil`).
   `gridPaths.ts:397`'s "no caller passes grain" comment DIES (two callers do).
2. `src/games/shared/PlayerTally.vue` — the mark (§3.1) on `useTallyStrokes` + `useHoverCard`
   + `defineExpose({ close })`. It lives in games/shared (it reads `session`), and is handed
   into the head through `AttributionCard`'s `#mark` slot (PLR-SELF §7 step 4 — the same
   wrapper change; the pencil layer never imports games).
3. `src/games/shared/PlayerLobby.vue` — the register (§3.2).
4. `src/games/shared/useSession.ts:630` — `lastHeard[id]` + `PRESENCE_QUIET_MS`. `:537`
   UNTOUCHED (self `ink: {}` — the family's F1 ruling as code).
5. `src/App.vue:802/:813` — slot the mark into both instances; `closeAll` unchanged.
6. `GameControlPanel.vue:1124-1170` — the roster → `sr-only`; the departing rows, the
   three one-shots (:1705-1760), `.player-swatch`, `max-height` DIE.
7. `e2e/player-tally.spec.ts` + `research/PLR-COUNT/probe/pixels.mjs` promoted beside it
   (the painted-run reader is the gate's instrument).

Dies: the five-bar strike (never built); the stub object; the foot line; the roster's
pixels in the well.

## 8 · Prototype brief

The §7 patch in a throwaway worktree, `npx vite --host 127.0.0.1 --port 4242 --strictPort`,
the lane's scratch config (`research/PLR-COUNT/probe/pw.config.ts`), a `?wire=local` pair
for N=2–3 and driven synthetic `st` frames for N=6, 7, 12 (real walk indices).

Screenshots: the head at N=1, 3, 6, 7 at 390 coarse light (one strip, ≤40 KB); N=3 dark
1280; the register at N=3 and N=16 on the phone. ≤8 crops.

Censuses: `filterBudget` 9 (settled) with the tally boiling and the sheet open, both
engines, both regimes; `pixels.mjs` painted runs == N for N 1…6 both engines both themes;
R6 `hue-census.mjs` 29 rows unchanged; the heading census unchanged; r0 I2/I3/I4/I5 and
the family law bare.

Numbers that mean success: I3 GREEN; I2 RED **by ruling** (the register's self swatch is
the page's blue; the instrument's premise is the ballot — recorded, not cured); I4/I5 and
the family law RED unchanged; filters 9 → 9; runs == N (1…6), 1 run at N ≥ 7 (the
number); every stroke ≥ 3:1 at 0.95 on four grounds (worst 4.771 light); mark width ≤
95.36 at every N; 44 × 44 coarse with the negative control failing; the board's 81 cells
carry 0 ink bindings solo AND in a room (the F1 ruling, as a hash); sheet right edge 256;
six-line bound on the phone; live regions 3 → 3; M19 whole (focus, sheet, `aria-label`);
woff2 4,312 B; copy gate clean; PRM: `stroke-dashoffset` 0 within one frame of a join.

## 9 · Born-RED gates

| id | asserts | at HEAD |
|---|---|---|
| r0 I3 | the head carries a `button` named `/player/` opening `[data-lobby]` | RED |
| G1 runs | painted runs == N for N 1…6 (both engines, both themes, dpr 3) | RED |
| G2 stroke-contrast | every stroke ≥ 3:1 at its drawn 0.95 on background and card, light and dark | RED (nothing drawn) |
| G3 width | the mark's box ≤ 96px at every N, and ≤ 44 + 0 at N = 1 | RED |
| G4 board-unbound | 81 cells, 0 `--color-user-ink` bindings, solo and in a room (F1 as code) | GREEN today; reds if anyone re-inks self |
| G5 filter-census | 9 with the tally + open sheet, both regimes | extended scene |
| G6 tap-floor | 44 both dimensions coarse, negative control | RED |
| G7 live-regions | 3 → 3; `.players-roster` keeps `role="log"` | RED once moved |
| G8 desk-bound | desk sheet at six lines ≤ desk board top | RED (unmeasured) |
| G9 M19-whole | focus unmoved, sheet shut, `aria-label` mutated on a third join | RED |
| G10 font-cut | coverage OK, woff2 4,312 B | GREEN by construction |
| G11 tally-shared | `DifficultyTally` renders byte-identical paths before/after the extraction (its `d` attributes hashed) | GREEN by construction; guards the refactor |
