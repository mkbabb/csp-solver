# PASS-3 SYNTHESIS · PLR-COUNT · The tally is the mark

§11 (icon · lobby) · M14. Synthesized 2026-09-18 from `../research/PLR-COUNT/README.md` (the
fold-conflict map, `ink-weight.mjs`, the two unrun CI gates, both engines) against
`pass2/synthesize/PLR-COUNT.md`, `pass2/critique/PLR-COUNT.md` (gaps 1–16), `pass3/CHAIR-RULINGS.md`
and `PLR-SELF.md` §3 (the seated substrate). Read-only on the product; this proposes; U-10. Base
`74a2b5d9`; pass-2 lines cite worktree -53.

F1 side: the BOARD KEEPS YOUR BLUE (`useSession.ts:537` untouched in THIS family's diff); the
substrate carries both arms behind one const (PLR-SELF §7.1), so this family's route is the NO arm
of the same switch — framed, not folded (chair §6.8). I2 stays RED by ruling on this route.

Re-planned as tokens/type/layout/principles and reviewed against the tells at this base. What moved:

1. **This family's diff is the CENTRE only** (chair §6.9/§6.12): `useTallyStrokes.ts`,
   `PlayerTally.vue`, the row's stroke inside the seated sheet, two pencilConfig constants,
   `DifficultyTally.vue`'s consumption, `e2e/player-tally.spec.ts`, `pixels.mjs`. Every substrate
   hunk it carried in pass 2 is STRIPPED and named (§7).
2. **The 5↔6 swap is priced and the numeral takes the raise.** Measured: N=5 paints 1416.95 px²,
   N=6 paints 206.79 — 85.4% less, and 33% less than N=1 (309.28). One more person made the control
   the lightest it ever is. The written count moves from `--type-subheading` (20.352) to
   `--type-heading` (25.888, +62% area, absorbed by `.pt-mark`'s 36px floor); the gate is a FLOOR at
   the threshold, `ink(6) ≥ ink(1)`, and the strip N=1/3/5/6 goes to the owner with the table (U-10).
   The stroke bed is refused (it breaks the one-threshold doctrine); "declare it intended" is the
   owner's to say, not this lane's.
3. **The short phone names two people, not one.** ROWS.short = 2 today yields `slice(0, 1)` + `and
   2 more` at N=3 (gap 4). The foot DIES in the short regime: two named rows, the state line carries
   N. +3.1px of lap in a regime where 11/11 lapped taps already dismiss. Option (c) — the foot dies
   everywhere — is refused on the number: it narrows the tall phone's clearance to 0.9px.
4. **The crossing watch keys on the ID SET, not the count** (a defect no prior pass named): a
   simultaneous depart+arrive left `drawn` unchanged, the newcomer inherited the departed person's
   reveal, and the `draws` map was keyed by index while the pose was keyed by person. `draws` is
   keyed by `id`; the watch diffs `ids`.
5. **Two CI gates join the family battery before anything else**: `npx knip` (EXIT 1 on the pass-2
   diff: `LOBBY_SAMPLES`, `tall`, `tallyFrames` unused exports) and `check-pw-projects.mjs` (EXIT 1:
   `player-tally.spec.ts` not in `SPEC_MANIFEST`). Neither was in pass 2's ten-gate battery; both
   are CI's (ci.yml:1203).

---

## 1 · Tokens

Substrate tokens as PLR-SELF §1 (ground, edge, quiet, ring, tap floor, `--head-rule`). This family's
own:

| role | token | light | dark |
|---|---|---|---|
| solo stroke | `--color-pencil-graphite` at `stroke-opacity 0.95` | 12.48:1 | 10.95:1 |
| your stroke · your row stroke · the written count | `--color-user-ink` | #2563eb (4.96 page · 4.579 at 0.95 on the sheet) | #60a5fa (7.52 · 6.849) |
| a peer's stroke · a peer's row stroke | `inkFor(k[peer])` at 0.95 | worst 4.771 (index 4 on background) | worst 8.579 |
| register names | `--color-pencil-graphite` | 14.651 on the opaque sheet | 12.163 |
| state line · qualifier · foot | `--ink-press-quiet` on the opaque popover | 5.236 | 6.099 |

`--tap-floor` on `.pt-mark` is written `var(--tap-floor, 2.75rem)` at PlayerTally.vue:240/:251 —
gap 10 — with BOTH laws cited beside it (index.css:825-827: the fallback IS the shipped literal, a
static declaration on `.page-root`; CHAIR §6.5 is scoped to MEASURED tokens published from TS). Gap
8's note that the token sits under a media query is wrong: the probe read `documentElement`, not
`.page-root`.

Stroke geometry inherits `DifficultyTally.vue:339-347`: width 3.2 units, opacity 0.95, round caps;
2.618px painted at 36px; chroma core 0.089–0.113 (colour survives the size).

Demand on PAL-WALK, unmovable inside this family (gap 16, handed): pairwise painted separation from
N=3 is 12.7° webkit / 13.3° chromium because self at h263 sits beside index 2 at h275; the first
five indices want ≥30°. `instruments/pixels.mjs` and the walk index go with it. Earned-100% is
unreachable here until it lands, and this return says so rather than rounding up.

## 2 · Type

| surface | face | rung | weight | resolved |
|---|---|---|---|---|
| the written count (N ≥ 6) | Patrick Hand | `--type-heading` 1.618rem | 500 | 25.888 (was 20.352) |
| state line | Patrick Hand | `--type-tag` | 500 | 14.048 / 14 coarse |
| row name | Patrick Hand | `--type-small` | 400 | 16 |
| qualifier · `and N more` | Patrick Hand | `--type-tag` | 400 | 14.048 / 14 |

Line-height 1.35 declared on the sheet (substrate). Digits in the cut; woff2 4,312 B.

## 3 · Components

### 3.1 The head wrapper — PLR-SELF §3.1, landed once; this family STRIPS its copy

Including `claimHeadDisclosure` (this family's five-line graft, now the substrate's) and CH-70.

### 3.2 The mark — `PlayerTally` (this family's centre)

`<button data-player-mark :aria-label="stateLine" :aria-expanded :aria-controls @click.stop="toggle"
@pointerdown.prevent>` padded `0 0.618rem`, `min-width: var(--tap-floor, 2.75rem)`, `min-height:
36px` (44 coarse). NO `@keydown.enter`, NO wrapper `@keydown.esc` (the window owner is the
substrate's).

Strokes: one upright per person in ARRIVAL order, self first, pitch 13 units, y 9→35, drawn by
`useTallyStrokes` (`generateLineBoilFrames` with baked grain, four poses opacity-swapped on the shared
beat; zero live filters). **The pose is the PERSON's**: seed = `11 + 12 · (fnv(id) % 97)`,
`:key="p.id"`, geometry at one local origin with the slot as a transform.

| N | drawn | width (390 coarse, measured) | colour | painted ink px² (chromium, pass 2 strip) |
|---|---|---|---|---|
| 1 | one stroke | 44 (floor; wants 30.41) | graphite | 309.28 |
| 2 | two | 44 (floor; wants 41.05) | self blue, peer ink | |
| 3 · 4 · 5 | N | 51.66 · 62.28 · 72.92 | as above | 839.01 · · 1416.95 |
| ≥ 6 | the count written: `6` … `16`, `--type-heading` | 44 | `--color-user-ink` | 206.79 at 20.352 → the prototype measures at 25.888; FLOOR: ≥ 309.28 |

The head line never steps (mark 36 tall at every N; 25.888 sits inside it). The 5↔6 swap is
same-frame; the width change (72.92 → 44) moves no neighbour (`@mbabb` and the sun are fixed) —
declared in the motion table.

**The set rule (gap 4's sibling, the defect found this pass):**

```
const ids = computed(() => people.value.slice(0, TALLY_MAX).map(p => p.id));
watch(ids, (now, was) => {
  const gone = was.filter(id => !now.includes(id)); gone.forEach(id => draws.delete(id));
  const fresh = now.filter(id => !was?.includes(id));
  if (fresh.length) drawIn(fresh); else settle(now);
}, { flush: 'post' });
```

`draws: Map<string, SequenceHandle>` keyed by `id` (useTallyStrokes.ts:99 was `Map<number, …>`).
A departure from six to five re-draws nothing; a middle `bye` slides no surviving stroke's `d`; a
depart+arrive in one tick draws exactly the newcomer.

SOLO — carried as two arms for the owner (gap 5, U-10). **A·KEEP (default)**: `people =
players.length ? players : SOLO` — the mark is permanent on every playing board, one graphite
stroke, `.corner-left` 75.53 → 119.53 on every solo board, one new tab stop, the register's solo
row. M14's own words lean here: "coloured WHEN a session is live" presupposes an icon present and
uncoloured otherwise, and graphite is the estate's uncoloured. **B·GATE-ON-A-ROOM**: the mark
mounts only with `roomId`; the head grows and shrinks with the wire; an icon never seen
uncoloured. Both built behind one const, both framed.

Hover (fine): solo stroke 0.95 → 1; a coloured stroke does not change. Focus ring as the substrate.
PRM: the draw-in snaps to inked.

```
phone 390 coarse, the head (free band 250.47 after @mbabb):
┌──────────────────────────────────────────────────────────┐
│ @mbabb   |                                            ☀  │  N=1  44  graphite   309 px²
│ 0   75.5 | | |                                  326  390 │  N=3  51.66          839
│          | | | | |                                       │  N=5  72.92          1417
│          6                                               │  N≥6  44  the count at --type-heading; floor ≥ 309
└──────────────────────────────────────────────────────────┘
```

### 3.3 The register — the seated sheet with this family's row

The furniture is PLR-SELF §3.3 (padding, edge, `line-height: 1.35`, row `min-height: 1.4rem`,
`gap: 0`, the height law `H = 36 + S + 5.6 + 22.4r + (1.6 + S)m`). This family's pass-2 law
(`58.965 + 23.6r + 20.565m`) is superseded and its three residuals travel with the MOVED row
(PLR-SELF §3.3). The 22px `.pl-row-mark` sits inside the 22.4 floor — the row is 22.40 in both
regimes, which is what the pass-2 box could not say.

```
┌────────────────────────── 256 ──────────────────────────┐
│  3 players                                              │   state · quiet · EVERYONE
│  |  crucial-chameleon  you                              │   stroke in blue · name graphite
│  |  shiny-duck                                          │   stroke in ITS ink, 4.4×22, still
│  |  colorful-wasp  26 seconds ago                       │   qualifier in the row's gap
└─────────────────────────────────────────────────────────┘   tall N=16: 4 rows + `and 12 more`
                                                              short N=3: 2 rows, NO foot
```

Row: the same upright at row scale (`tallyPose0`, 4.4×22, no beat in the sheet) in that person's
ink · name graphite · qualifier quiet. Names never clip (124.9 < 224).

Rows: `ROWS = { tall: TALLY_MAX (5), short: 2 }` on the substrate's `(min-height: 800px)` MQL.
**Tall**: state + ≤5 rows, or state + 4 + `and N more`. **Short**: state + `min(N, 2)` rows, NO
foot (the state line carries N). Predicted heights (coarse): short N=3 → H(2,0) = 105.3 (was
103.0 with 1 row + foot; +2.3 of lap at 664, every lapped tap dismisses); tall N=16 → H(4,1) =
170.6, clears 221.73 by 7.1.

Counting, declared once for THIS family: everyone at this board — glyph, strokes, name, rows and
foot all count everyone; the name is `1 player` / `N players`, digits ⊆ the accessible name
(2.5.3 by construction). This is the incompatible route against PLR-SELF/PLR-PLACE's "others"
base; the agglomerator decides, this spec does not merge.

Qualifiers, keys, focus, Escape, PRM, bounds: the substrate's (PLR-SELF §3.3, §3.6, §3.8). Gap 7
(the AT-unreachable register) closes under the leader's keyboard-open focus move; this family
lands no tab stop of its own.

### 3.4 The well and the seam — the substrate's; STRIPPED here

Gaps 1 and 2 close by the substrate KEEPING `.player-row { color }` (this family's pass-2 deletion
was tidy-up, not design; it reds join-language:97/:165) and by the substrate's `join-language-prm`
re-cut. Nothing in this diff touches `GameControlPanel.vue`'s players compartment.

Gap 15 (the deck's count) is OWNED at HEAD: `GameGallery.vue:217-222` renders `1 other player` /
`${peers} other players` on the drag guard, cited by R6 law 32. The deck has no mark (G12). Closed
by citation.

### 3.5 Speech

The six-node playing roll in the MEASURED order (substrate G6); the deck +1 (not +2 — measured).
The label mutates; M19.

## 4 · Copy

`player` (prefixed by 1) · `players` (prefixed by N) · `you` · `seconds ago` (prefixed by N) ·
`and` … `more`. Static halves in the substrate's `LOBBY_COPY`; this family adds its two count
halves to the same table (one table, discovered by `COPY_TABLE_NAME`). No em dash, no first person,
no `j`/`x`/comma/colon.

## 5 · Motion

| event | what moves | duration · curve · home |
|---|---|---|
| a person arrives (N ≤ 5) | their stroke draws in via `stroke-dashoffset` over `pathLength=100` | `DRAW_IN_PRESETS.glyph.duration` · easeOutCubic on `createSequenceSubscription`; stagger `MOTION.tallyStaggerMs: 90` (pencilConfig, two consumers: `DifficultyTally`, `PlayerTally`) · PRM snaps |
| a person leaves | their stroke unmounts; the others `settle` | none |
| the strokes at rest | the shared boil beat, four baked poses | `BOIL_CONFIG.intervalMs` via `beatsFor`; `BOIL_CONFIG.tallyBoil: 0.6` |
| 5 → 6 and 6 → 5 | same-frame swap; width 72.92 ↔ 44 moves no neighbour | none (declared) |
| the sheet | the substrate's 150ms | inherited |

One moment: the stroke's draw-in on the same `join` the board's 1180ms wash rides.

## 6 · Desktop and mobile, light and dark

Desk 1280 fine: mark at (75.53,12), 36 tall inside the 39.75 row; sheet at (0,51.75), opaque, laps
the board's top-left (the substrate's CH-71 census counts it). Phone coarse 844 (`hasTouch: true`
declared): mark 44×44…72.92 at (75.53,0); sheet at (0,44), 5 rows, bottom 216.5 < 221.73. Phone
664: 2 rows, no foot; lap == law ±4; every lapped tap dismisses. Dark: peers L 0.8 (worst 8.58 at
0.95), self #60a5fa (6.849 at 0.95 on the sheet), graphite 10.95; quiet 6.099.

---

## 7 · Plan (this family's files ONLY; the strip list is the return's)

1. `pencilConfig.ts` — `BOIL_CONFIG.tallyBoil: 0.6`, `MOTION.tallyStaggerMs: 90` (the values
   DifficultyTally.vue:76-77 shipped).
2. `useTallyStrokes.ts` — extracted; `draws: Map<string, SequenceHandle>`; `tallyFrames` and `tall`
   UN-EXPORTED (knip); `DifficultyTally.vue` consumes it (G13 guards the refactor: 20 `d` values).
3. `PlayerTally.vue` — `TALLY_MAX = 5`; the chunk dies; person-keyed seed; the ID-SET watch;
   `@pointerdown.prevent`; NO Enter/esc handlers; `.pt-count` at `--type-heading`; `var(--tap-floor,
   2.75rem)` with both citations; SOLO arms A/B behind one const; `stateLine` = `1 player` / `N
   players`.
4. `PlayerLobby.vue` — this family's ROW content only (`.pl-row-mark` stroke at row scale) and the
   short-regime foot rule; `LOBBY_SAMPLES` DELETED (knip; the e2e drives real rooms).
5. `e2e/player-tally.spec.ts` (`PRM:` line + `emulateMedia` in the file) + `instruments/pixels.mjs`
   promoted; `check-pw-projects.mjs` SPEC_MANIFEST gains `player-tally.spec.ts`, its webkit Tab row
   declared per-row (check 4).
6. **STRIPPED from the pass-2 replay, resolved toward the fold** (the return names each):
   `check-copy-register.mjs` (+937 conflict; `COPY_SOURCES` dies), `check-font-coverage.mjs` (+34;
   `what fits`, `paperNoteCopy` kept), `AttributionCard.vue`, `useHoverCard.ts` (the graft is the
   substrate's now), `App.vue`, `GameControlPanel.vue`'s roster hunk, `useSession.ts` (`lastHeard`,
   `PRESENCE_QUIET_MS`), `useJoinWash.ts`, `join-language.spec.ts`, `join-language-prm.spec.ts`,
   `multiplayer.spec.ts`, `liveRegions.test.ts`, the sheet's furniture.
7. Reported MOVED: coupling-16's height graft (PLR-SELF carries the row; this family's residuals
   173.93/173.88, 173.80/173.75, 103.00/102.97 are the evidence). r0 I3 (MOVED, substrate).

Dies: the sixth stroke and the chunk; `N other players` on THIS surface; the short regime's foot;
the index-keyed `draws`; `LOBBY_SAMPLES`; the exports `tall`/`tallyFrames`; the wrapper Escape;
`.pt-count`'s subheading rung.

## 8 · Prototype brief

Fresh worktree from `74a2b5d9`; replay worktree -53's diff (`filesTouched` from
`pass2/critique/PLR-COUNT.md`), STRIP §7.6 before building, take the substrate from PLR-SELF's
worktree (copy the files in PLR-SELF §7 if `git` is refused; state the route). Serve on
127.0.0.1:4242 `--strictPort` with a private `cacheDir` scratch `.mts`; HEAD control server on the
next free port in 4230–4249; scratch PW config, CWD `web/frontend`, `createRequire` in every `.mjs`
instrument (never `NODE_PATH`). `?wire=local` pair for N=2–3; driven `st` frames for N=5, 6, 16
(real walk indices; peers answer the ack — the `hi`-into-the-void harness law). Every phone arm
`hasTouch: true` with the regime witnessed. Kill every server before returning.

Frames (≤4, ≤150 KB): (1) the head strip N=1/3/5/6 at 390 coarse light, with the ink table printed
under it — the owner's 5↔6 frame (U-10); (2) the desk register open over the board, the card NOT
painting (the pass-1 defect's negative); (3) phone 664 coarse at N=3 — two named rows, no foot;
(4) N=3 dark 1280.

Censuses: filterBudget on the BUILT dist with the tally boiling and the sheet open, both engines,
both regimes (settled 9); `pixels.mjs` runs == N for 1…5; `ink-weight.mjs` on the new strip at
N=1/6; `ground.mjs` on the opaque sheet at N=16; r0 `hue-census.probe.ts` copied and re-pointed
(29 rows byte-identical); heading census byte for byte; r0 I3 through the diff; I2 RED by ruling on
this route; I4/I5/family law bare.

Numbers that mean success: runs == N (1…5), 1 run at N ≥ 6 · **ink(N=6) at 25.888 ≥ ink(N=1) =
309.28 px² chromium / 272.62 webkit** (the floor) · every stroke ≥ 3:1 at 0.95 on four grounds
(worst 4.771) · width table to 0.01 (44 · 44 · 51.66 · 62.28 · 72.92 · 44) · 44×44 coarse with the
40px negative control · 5↔6: no re-draw on 6→5 (dashoffset never leaves 0 on a surviving stroke) ·
a middle `bye` moves no surviving `d` · **a depart+arrive in one tick draws the newcomer** (the
watch fires; `draws` has the new id, not the old) · glyph digits == the name's digits at every N ·
short phone N=3: `.pl-row` count 2, `.pl-more` count 0, sheet H == law ±1 · tall N=16: 4 + `and 12
more` · `.pl-more`/`.pl-state` ≥ 4.5:1 on the opaque ground with the wordmark under it · mouse press
sends no `cur`, the cell keeps focus · keys contract off `el.focus()` both engines (the substrate's
G8 shape) · no mark at `?view=gallery` on either platform · 81 cells 0 bindings after a self write,
≥1 after a peer write (`authorInk` 0/0/1) · G13: 20 `d` values byte-identical to the HEAD control
(`.dt-pose .dt-stroke`), the three candidate movers named (`tallyBoil`, `tallyStaggerMs`, wobble key
order) · G4 peer half via `expect.poll(() => digitAt(…))` + `writeFast` (multiplayer.spec.ts:406-416,
:565-595's route) on BOTH engines — never `bringToFront` · `26 seconds ago` via
`page.clock.setFixedTime` within one beat (the substrate's G16) · filters 9→9 on the dist · regions
6 in order, deck +1 · woff2 4,312 B · `lint:copy` 0 · **`npx knip` EXIT 0** · **`node
scripts/check-pw-projects.mjs` EXIT 0** with the floors restamped only if a live count moved ·
`join-language`/`-prm`/`multiplayer`/`access`/`follow-still` GREEN as one background shell script,
log polled.

## 9 · Born-RED gates (`e2e/player-tally.spec.ts` unless noted; substrate gates inherited from PLR-SELF §9)

| id | asserts | at HEAD |
|---|---|---|
| r0 I3 (MOVED, substrate) | `[data-lobby]:visible` 1 of 2 after a press; button `/player/` | RED |
| G1 runs | painted runs == N for 1…5, 1 at N ≥ 6, both engines, both themes | RED |
| G2 stroke-contrast | ≥ 3:1 at 0.95 on four grounds | RED |
| G3 width | the measured table; N ≥ 6 == 44 | RED |
| G4 binding | `authorInk` 0/0/1 across no-write / self-write / peer-write; peer half by `expect.poll` on both engines | RED (tautology today; webkit half unread in pass 2) |
| G5 filter-census (dist) | 9 with the tally boiling + sheet open | extended |
| G7 one-base | glyph text ⊆ accessible name; name == `N players`; rows == N (≤5) or 4 + foot == N tall; `min(N,2)` and no foot short | RED |
| G8 three-bounds | the substrate's law with THIS family's row sets; short-phone `.pl-more` == 0 | RED |
| G9 crossing | 6→5 re-draws nothing; a `bye` slides no stroke; **depart+arrive in one tick draws exactly the newcomer** | RED (the count watch never fires) |
| G10 seam | mouse press: no `cur`, cell keeps focus | RED |
| G11 keys | the substrate's contract off `el.focus()` both engines; Tab chromium, webkit skipped loudly (declared per row) | RED |
| G12 pre-game | no `[data-player-mark]` at `?view=gallery`, both platforms | RED |
| G13 tally-shared | 20 `.dt-pose .dt-stroke` `d` values byte-identical vs the HEAD control `74a2b5d9` | never run in pass 2 |
| G14 sheet-AA | `.pl-more`, `.pl-state`, `.pl-qualifier` ≥ 4.5:1 on the opaque ground over the wordmark | RED (4.166) |
| G15 M19-whole | focus unmoved, sheet shut, label mutated on a third join | RED |
| G16 ink-floor | coverage-weighted ink at N=6 ≥ ink at N=1, both engines (`ink-weight.mjs`) | RED (206.79 < 309.28) |
| G17 solo-arm | A: mark mounted solo, one graphite stroke, `1 player`; B: no mark without `roomId` — one const flips them, both green on their arm | RED |
| G18 knip · manifest (`lint:knip`, `check-pw-projects`) | EXIT 0 / EXIT 0 | RED on the pass-2 diff |

Handed on by design, not unfixed: the family law (PAL-WALK); T7-W2 A4 (disposed by the leader,
PLR-SELF §3.6, inherited); the substrate's I4/I5.
