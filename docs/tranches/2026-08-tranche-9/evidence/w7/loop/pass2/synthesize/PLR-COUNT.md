# PASS-2 SYNTHESIS · PLR-COUNT · The tally

§11 (icon · lobby) · §12 · M14. Synthesized 2026-09-18 from `../research/PLR-COUNT/README.md`
(r2 / r2b / r2c / graft / ground.mjs, both engines) against the pass-1 record, `CHAIR-RULINGS.md`
and R6. Read-only on the product. U-10: this proposes. F1 side stated: the BOARD KEEPS YOUR BLUE
(`useSession.ts:537` untouched); colour on the mark and in the register is a room-relative label.
I2 stays RED by ruling.

Planned as tokens/type/layout/principles and reviewed against the tells before writing. What
moved:

1. **ONE counting base: everyone at this board.** Glyph, strokes, name, rows and foot all count
   everyone. The name is `1 player` / `N players` — it carries the glyph's digits (2.5.3
   satisfied by construction), matches r0 I3's `/player/` at every N, and every codepoint is in
   the cut. `N other players` dies here (it is right in the deck, where the sentence is about
   the others who follow you).
2. **ONE threshold: `TALLY_MAX = 5`.** The mark draws up to five strokes and the tall sheet lists
   up to five rows; at six the number replaces the strokes AND the sheet compresses to four plus
   `and 2 more`. The chunk gap (five + gap + one) dies with the sixth stroke — two numbers on one
   object became one.
3. **The register's ground is OPAQUE** (`--color-popover`), the law-44 arm promoted for the
   lobby; the foot's 4.166:1 and the state line's luck go with it; the ink ramp is untouched
   (R6 law 24). Declared delta for U-10; the `@mbabb` card is untouched.
4. **The disclosure graft lands ONCE** (PLR-SELF's `.attribution-disclosure` + `#mark` slot +
   `headDisclosures`), measured on this lane's rig: card hidden on mark hover, lobby alone on
   press, the card's pose unmoved.
5. **The seam and the sheet's dismissal** are the section's rows: `@pointerdown.prevent` on the
   mark (no `cur` on a press, the cell keeps focus, both engines); the lobby's `@click.stop`
   dies; Escape is window-bound (the wrapper `@keydown.esc` at PlayerTally.vue:105 never hears a
   mouse-opened sheet on WebKit).

---

## 1 · Tokens

| role | token | light | dark |
|---|---|---|---|
| solo stroke | `--color-pencil-graphite` at `stroke-opacity 0.95` | #262626 → 12.48:1 | 10.95:1 |
| your stroke · your row mark · the written count | `--color-user-ink` | #2563eb (4.96:1 page) | #60a5fa (7.52:1) |
| a peer's stroke · a peer's row mark | `inkFor(k[peer])` at 0.95 | worst 4.771 (index 4 on background) | worst 8.579 |
| register names | `--color-pencil-graphite` | 14.65:1 on the opaque sheet | 12.19:1 |
| state line, qualifier, foot | `--ink-press-quiet` on the OPAQUE popover | 5.206:1 | 6.099:1 |
| sheet ground | `var(--color-popover)` opaque | ≈#fcfbf9 | ≈#121110 |
| sheet edge / radius / padding / width | the `@mbabb` pose: `2px` border at 30% · `1rem` · `1rem` · `16rem` | | |
| focus ring | `2px dashed currentColor` offset 3 (DrawerTab's form; §6's chrome token when it ships) | | |
| tap floor | `--tap-floor` on the mark, both dimensions | 44×44 coarse | |

Stroke geometry inherits `DifficultyTally.vue:339-347`: width 3.2 units, opacity 0.95, round
caps; 2.618px painted at 36px; chroma core 0.089–0.113 (measured — colour survives the size).

Demand on PAL-TIN (with `pixels.mjs` and the number): pairwise painted separation from N=3 is
12.7° because self at h263 sits beside index 2 at h275; the first five indices want ≥30°;
index 0 out of the logo's rose. 100% is unreachable inside this family until that lands.

## 2 · Type

| surface | face | rung | weight |
|---|---|---|---|
| the written count (N ≥ 6) | Patrick Hand | `--type-subheading` 1.272rem (20.35px) | 500 |
| state line | Patrick Hand | `--type-tag` | 500 |
| row name | Patrick Hand | `--type-small` | 400 |
| qualifier, `and N more` | Patrick Hand | `--type-tag` | 400 |

M01: rows take the raise; state/qualifier/foot do not (the six-line budget holds 12.4px, a
three-line raise spends 16.2). Digits in the cut; woff2 4,312 B.

## 3 · Components

### 3.1 The head wrapper — as PLR-SELF §3.1, landed once

The slot gated to `view === 'playing'` on both instances (the pre-game asymmetry — desk 1
visible / phone 0 — is decided: no mark at `?view=gallery`). `.attribution-trigger`'s Enter
handler deleted (CH-70).

### 3.2 The mark — `PlayerTally`

`<button data-player-mark :aria-label="stateLine" :aria-expanded :aria-controls
@click.stop="toggle" @pointerdown.prevent>` padded `0 0.618rem`, `min-width: var(--tap-floor)`,
`min-height: 36px` (44 coarse). NO `@keydown.enter`, NO wrapper `@keydown.esc`.

Strokes: one upright per person in ARRIVAL order, self first, pitch 13 units, y 9→35, drawn by
`useTallyStrokes` (`generateLineBoilFrames` with baked grain, four poses opacity-swapped on the
shared beat; zero live filters, 9 by construction). **The pose is keyed to the PERSON**: seed =
`11 + 12 · (fnv(id) % 97)` and `:key="p.id"`, so a middle departure removes one stroke and slides
no one's wobble (measured today: h52.5 and h190 slid a pitch left while the shapes stayed).

| N | drawn | width (390 coarse, measured) | colour |
|---|---|---|---|
| 1 | one stroke | 44 (floor; wants 30.41) | graphite |
| 2 | two | 44 (floor; wants 41.05) | self blue, peer ink |
| 3 · 4 · 5 | N | 51.66 · 62.28 · 72.92 | as above |
| ≥ 6 | the count written: `6` … `16` | 44 | `--color-user-ink` |

The head line never steps (mark 36 tall at every N, row 39.75). The 5↔6 swap is same-frame; the
width change (72.92 → 44) moves no neighbour (`@mbabb` and the sun are fixed) — declared, so the
motion table has a row for it.

Set rule (the crossing bug): `watch(drawn, (now, was) => { if (!now) return; if (!was || now <
was) settle(range(0, now)); else drawIn(range(was, now)); })`. `settle` exists
(useTallyStrokes.ts:109); a departure from six to five re-draws nothing.

Hover (fine): solo stroke 0.95 → 1 (measured); a coloured stroke does not change. Focus ring
as §1. PRM: the draw-in snaps to inked.

```
phone 390 coarse, the head (free band 250.47 after @mbabb):
┌──────────────────────────────────────────────────────────┐
│ @mbabb   |                                            ☀  │  N=1  44  graphite
│ 0   75.5 | | |                                  326  390 │  N=3  51.66
│          | | | | |                                       │  N=5  72.92 = 29.1% of the band
│          6                                               │  N≥6  44  the count, in your blue
└──────────────────────────────────────────────────────────┘
```

### 3.3 The register — `PlayerLobby`

The `@mbabb` pose with an OPAQUE ground, `data-lobby`, plain markup, no role, no live region,
NO `@click.stop` (a tap on the sheet dismisses; zero focusable elements inside).

```
┌────────────────────────── 256 ──────────────────────────┐
│  3 players                                              │   state · quiet   (everyone)
│  |  crucial-chameleon  you                              │   stroke in blue · name graphite
│  |  shiny-duck                                          │   stroke in ITS ink
│  |  colorful-wasp  26 seconds ago                       │   qualifier in the row's gap
└─────────────────────────────────────────────────────────┘   at N=16: 4 rows + `and 12 more`
```

Row: the same upright at row scale (`tallyPose0`, 4.4×22px, still — no beat in the sheet) in
that person's ink · name graphite · qualifier quiet. Names never clip (124.9 < 224).

Rows: `ROWS = { tall: TALLY_MAX (5), short: 2 }` on `(min-height: 800px)`. Tall: state + ≤5 rows
or state + 4 + `and N more`; short: state + ≤2 or state + 1 + foot. Height law
`H(r, m) = 58.95 + 23.6r + 20.55m` (re-derives to 0.02px).

Qualifiers stamped at OPEN (`openedAt`): `you` on self; `N seconds ago` past
`PRESENCE_QUIET_MS`; compressed peers get none.

Keys: Space/Enter toggle (one native click); Escape window-bound while open (one owner,
`defaultPrevented` honoured, GameGallery.vue:696-721's paragraph); the mark's `@focusout`
closes.

Bounds, three: sun (256 < 326 / 1072, hard); wordmark (covered while open, opaque — declared;
one tap uncovers); board (desk laps 4 of 81 structurally — booked U-10 with 4 / 0 / 21 cells;
phone 844 tall clears by 3.98px; phone 664 short laps by the law; every lapped-cell tap
dismisses and hits no control).

### 3.4 The well and the seam

As PLR-SELF §3.4: roster sr-only with `role="log"`, one-shots die, `.player-swatch` STAYS
sr-only until join-language:175 / multiplayer:193 / :580 and r0 I2'/I4' are re-pointed at
`[data-lobby] .pl-row .pl-row-mark path` (stroke) in one diff — the re-point needs a gesture
(press, settle ~700ms) and reads a stroke, priced. `useJoinWash`'s roster half dies;
join-language-prm:97 re-aimed. G4 re-aimed at `authorInk` (0 / 0 / 1 across no-write,
self-write, peer-write, with `cellAuthors` 0 / 1 / 2) so an empty room fails it.

### 3.5 Speech

The six-node playing roll in order (+2 on the deck), pinned in G6. The label mutates; M19.

## 4 · Copy

`1 player` · `N players` · `you` · `N seconds ago` · `and N more`. Five strings as `LOBBY_COPY`
(one constant for the font derive and the copy-register `COPY_SOURCES` arm). No em dash, no
first person, no `j`/`x`/comma/colon.

## 5 · Motion

| event | what moves | duration · curve · home |
|---|---|---|
| a person arrives (N ≤ 5) | their stroke draws in via `stroke-dashoffset` over `pathLength=100` | `DRAW_IN_PRESETS.glyph.duration` · easeOutCubic on `createSequenceSubscription`; stagger `MOTION.tallyStaggerMs: 90` (pencilConfig, two consumers) · PRM snaps |
| a person leaves | their stroke unmounts; the others `settle` | none |
| the strokes at rest | the shared boil beat, four baked poses | `BOIL_CONFIG.intervalMs` via `beatsFor`; `BOIL_CONFIG.tallyBoil: 0.6` |
| 5 → 6 and 6 → 5 | same-frame swap; width 72.92 ↔ 44 moves no neighbour | none (declared) |
| the sheet | 150ms `--ease-standard`, `.hover-card` verbatim | inherited; MOT-LADDER's rung if named |

One moment: the stroke's 160ms draw-in on the same `join` the board's 1180ms wash rides.

## 6 · Desktop and mobile, light and dark

Desk: mark at (75.5,12), 39.75 tall; sheet at (0,51.75), opaque, laps the board's top-left
(4 of 81) — declared. Phone coarse 844: mark 44×44…72.92 at (75.5,0); sheet at (0,44), 5 rows,
bottom 217.75 < 221.73. Phone 664: 2 rows; lap == law; tap dismisses. Dark: peers L 0.8 (worst
8.58 at 0.95), self #60a5fa (7.52 on the sheet), graphite 10.95; quiet 6.099.

---

## 7 · Plan

1. `useTallyStrokes.ts` (extracted; `DifficultyTally` consumes it — G11 guards the refactor);
   `MOTION.tallyStaggerMs`, `BOIL_CONFIG.tallyBoil` in pencilConfig.
2. `PlayerTally.vue` — `TALLY_MAX = 5`; chunk dies; person-keyed seed; the crossing watch;
   `@pointerdown.prevent`; delete `:114` Enter and `:105` esc; window Escape; `@focusout`;
   `stateLine` = `1 player` / `N players`.
3. `PlayerLobby.vue` — opaque ground; delete `@click.stop`; `ROWS` on the height MQL;
   `LOBBY_COPY`.
4. `AttributionCard.vue` + `useHoverCard.ts` — PLR-SELF's graft whole (once for §11); CH-70.
5. `useSession.ts:630` `lastHeard` + `PRESENCE_QUIET_MS`; `:537` UNTOUCHED.
6. `App.vue:802/:813` — `<template #mark v-if="view === 'playing'">`.
7. `GameControlPanel.vue` — roster sr-only; one-shots die; swatch stays (named);
   `useJoinWash.ts` roster half dies; liveRegions.test:209/:221 re-cut; join-language-prm:97
   re-aimed.
8. `e2e/player-tally.spec.ts` (`PRM:` line) + `pixels.mjs` promoted; `check-font-coverage`
   `lobbyStrings` derive; `check-copy-register` `COPY_SOURCES` arm.
9. r0 I2'/I4' (`instruments/i2-i4-repointed.spec.ts`) and I3 `:visible` — MOVED; LEDGER CH-70
   + the stolen-cells row for the incumbent card.

Dies: the sixth stroke and the chunk; `N other players` on this surface; the 80% lobby ground;
the wrapper Escape; the roster's pixels; the 740ms hold.

## 8 · Prototype brief

Replay `wf_e58b4764-0fc-47`'s diff into a fresh worktree, apply §7, serve on 127.0.0.1:4242
(scratch `.mts` config, private cacheDir), scratch PW config; `?wire=local` pair for N=2–3;
driven `st` frames for N=5, 6, 16 (real walk indices; peers must answer the ack).

Frames (≤4): the head strip N=1/3/5/6 at 390 coarse light; the desk register open over the board
with the card NOT painting (the pass-1 defect's negative); phone 664 at N=16 (head `16`, first
line `16 players`, `and 12 more` on the opaque ground); N=3 dark 1280.

Censuses: filterBudget 9 settled with the tally boiling and the sheet open, both engines, both
regimes; `pixels.mjs` runs == N for 1…5; `ground.mjs` on the opaque sheet at N=16; R6
`hue-census.mjs` copied and re-pointed (29 rows); heading census (r0 reading byte for byte);
r0 I3 through the diff; I2' RED by ruling; I4', I5, family law RED unchanged.

Numbers that mean success: runs == N (1…5), 1 run at N ≥ 6; every stroke ≥3:1 at 0.95 on four
grounds (worst 4.771); width table to 0.01 (44 · 44 · 51.66 · 62.28 · 72.92 · 44); 44×44 coarse
with the negative control; 5↔6 swap: no re-draw on 6→5 (dashoffset never leaves 0 on any
surviving stroke); a middle `bye` moves no surviving stroke's `d`; glyph digits == the name's
digits at every N (2.5.3); name == `${N} players`; `.pl-more` ≥4.5:1 on the opaque ground with
the wordmark under it (both themes); a mouse press sends no `cur` and the cell keeps focus;
keys contract off `el.focus()` both engines, Tab route chromium; Escape closes after a MOUSE
press on WEBKIT (today false); no mark at `?view=gallery` on either platform; 81 cells 0
bindings after a self write and ≥1 after a peer write; filters 9→9; sheet right edge 256;
tall-phone bottom < grid top; lap == law on 664; regions 6 in order; woff2 4,312 B; copy 0.

## 9 · Born-RED gates

| id | asserts | at HEAD |
|---|---|---|
| r0 I3 (MOVED) | `[data-lobby]:visible` 1 of 2 after a press; button `/player/` | RED |
| r0 I2'/I4' (MOVED) | row-mark stroke == room ink / survives a rival `st` | RED by ruling / RED |
| G1 runs | painted runs == N for 1…5, both engines, both themes | RED |
| G2 stroke-contrast | ≥3:1 at 0.95 on four grounds | RED |
| G3 width | the measured table at every N; N ≥ 6 == 44 | RED |
| G4 binding | `authorInk` 0/0/1 across no-write / self-write / peer-write | RED (tautology today) |
| G5 filter-census | 9 with the tally boiling + sheet open | extended |
| G6 live-regions | six-node roll in order; deck +2 | RED |
| G7 one-base | glyph text ⊆ accessible name; name == `N players`; rows == N (≤5) or 4 + foot == N | RED |
| G8 three-bounds | sun; tall phone clears; short phone / desk lap == law ±4 and every lapped tap dismisses | RED |
| G9 crossing | 6→5 re-draws nothing; a `bye` slides no stroke | RED |
| G10 seam | mouse press: no `cur`, cell keeps focus | RED |
| G11 keys | Space/Enter/Escape off `el.focus()` both engines; Escape after a mouse press on webkit; Tab chromium, webkit skipped loudly | RED |
| G12 pre-game | no `[data-player-mark]` at `?view=gallery`, both platforms | RED |
| G13 tally-shared | `DifficultyTally` paths byte-identical before/after the extraction | GREEN by construction |
| G14 sheet-AA | `.pl-more`, `.pl-state`, `.pl-qualifier` ≥4.5:1 on the opaque ground over the wordmark | RED (4.166) |
| G15 M19-whole | focus unmoved, sheet shut, label mutated on a third join | RED |
