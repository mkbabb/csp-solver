# PAL-TIN · pass-3 SYNTHESIS — the tin held, the tally leaves the cell on its own number, the tape priced

Section §11c the per-player colour system · §12 · the live incompatible route. Synthesized from
the pass-3 research (`../research/PAL-TIN/README.md`, `probe/grounds.mjs` → `readings/grounds.txt`),
the chair's rulings (§6.6, §6.4, §6.5, §6.9, §6.11, §7), the pass-2 synthesis and critique,
PAL-WALK's pass-3 research (the ring's lightness axis, the resolved-value census, the ring's
missing words) and r0's ground (R5, R6). Bound by the frontend-design two-pass method.
Read-only on the product; U-10 holds; nothing here is closed.

## 0 · The design plan, and the review against the tells

**Tokens.** The five sticks, two arms, ten hexes, exactly as pass 2 cut them at L 0.440 / 0.650.
Ten more declarations this pass: each stick's RING arm, the same hue at the ring's own lightness
(`--peer-ring-l`, the section's scalar, PAL-WALK's mechanism grafted), because the ring at the
chair's α 0.55 reads 2.437 light / 2.280 dark and only lightness can buy it back without
touching §6's file. **Type · layout.** Unchanged. **Copy.** None minted. **Motion.** None new.

**Principles.** (1) A finite designed palette; running out is a designed state, and where it
runs out is said by a mark that has room to be drawn. (2) The board says WHICH pencil by
colour; the words say WHO (the fold's `authorNameAt`, and the tape on both pointers since
3C-4). (3) Nothing is drawn inside a cell that the cell cannot hold at every board size the
estate ships. (4) The roster is the legend, and it changes only when the tin runs out.
(5) Lightness, not hue, separates a player from the machine at night (stated once at the
section).

**Tells checked, and what the review changed.** No avatar, initial, dot or flag; none of the ten
hexes is a stock set. Changed on review, on the number: (a) the in-cell tally is cut. Counting
all four tenants (laminate 91 %, ring outer + wobble, the grid line's intrusion, the mark's own
round cap) the drawable band is 2.67 px at the best 9×9 desk cell, 0.43 px on the board's last
row, NEGATIVE at every 16×16 arm, and every pass-2 clearance figure was `getBBox`, which excludes
the stroke. A mark that fits one cell in three at one board size is decoration the spec must
not claim. (b) The margin variant prices out identically (6.75 cell-%, 2.67 px, negative at
16×16) and is not taken. (c) The lap moves to the two surfaces that have room and already name
the author: the roster row and the attribution tape (109.59 × 33.58 px), and it appears ONLY
when a stick is shared — a room of five or fewer is byte-identical to HEAD on both surfaces.
(d) The ring's alpha is §6's; the ring's lightness is this section's.

## 1 · The spec

### 1.1 The tokens — five sticks and their rings

```
                     digit, light L 0.440          digit, dark L 0.650          ring arms (--peer-ring-l 0.32 / 0.79, chromaAt at that L, cap 0.215)
--color-peer-1  amber  #853900  h 48.4  C 0.119    #e06600  h 48.7  C 0.175    --color-peer-1-ring: light / dark, derived by the tin script
--color-peer-2  green  #455c00  h 124.6 C 0.110    #799f00  h 124.7 C 0.163    --color-peer-2-ring
--color-peer-3  teal   #005f63  h 200.6 C 0.075    #00a3aa  h 200.3 C 0.111    --color-peer-3-ring
--color-peer-4  violet #3e32c5  h 276.6 C 0.215    #747eff  h 276.2 C 0.188    --color-peer-4-ring
--color-peer-5  pink   #8b0081  h 332.2 C 0.198    #d64fc8  h 332.1 C 0.215    --color-peer-5-ring
```

The ring hexes are printed by the same script that prints the sticks (`probe/final.mjs`'s
successor in the prototype dir), authored into `index.css` as hex, and `check-peer-tin`
verifies each ring arm is its stick's hue (±1°, the 8-bit round trip) at `--peer-ring-l` with
the chroma sRGB holds there. Ten declarations is the tin's price for what the walk pays with
one scalar; the comment says so.

Measured at `74a2b5d9` (`readings/grounds.txt`), the digit:

| ground | light worst | dark worst | floor |
|---|---|---|---|
| `--color-background` | 7.163 (teal) | 5.293 (pink) | 4.5 |
| `--color-card` (r2's toll ground) | 7.305 | 5.191 | 4.5 |
| **the attribution tape** `--sheet-washi-neutral` | 6.513 | **2.977** (pink) — HEAD's own blue reads **4.232** | 4.5 below 1544 px (REPORTED, estate row) |
| **the hint laminate** (teacher-red 15 % over paper) | 5.797 | **4.403** (3.764 at `prefers-contrast: more`) | 4.5 (REPORTED) |
| ring vs its own 4 % fill at α 0.55, digit ink | 2.437 | 2.280 | 3.0 — RED, the reason for the ring arms |
| … at α 0.65 / 0.80 (§6's candidates, stated not built) | 3.005 / 4.210 | 2.757 / 3.632 | the §6.6 answer: the tin's digit ink survives on opacity alone only at 0.80 |

The ring arms are priced by the prototype (the research did not solve the tin's ring band; the
walk's scalar 0.32 / 0.79 is the starting point and the pin rule is the same: lightest light /
darkest dark that clears 3.0 PAINTED with ≥ 0.10 headroom, never raised later to pass).
Expected from the walk's table at the tin's hues: ≥ 3.1 both arms; teal (C 0.075 at the digit
band) is the stick that pays most chroma at the ring band and its ring chroma is reported.

### 1.2 The allocator — unchanged, one claim re-stated

```
stick = index % 5     lap = floor(index / 5)     tally = min(5, lap)     seedFor(peerId) = parseInt(hashBlob(peerId).slice(0, 8), 16)
inkFor(index) → { "--color-user-ink": "var(--color-peer-{stick+1})", "--color-peer-cursor-ink": "var(--color-peer-{stick+1}-ring)" }
```

The capacity sentence, corrected: **five tell apart at a glance on the board; from the sixth
player on, the roster and the tape say which of two sharing a stick wrote it, and the slug
always does.** "Thirty board-distinguishable players" is retired with its number (2.67 px). The
cursor ring carries the stick and not the lap: two players a lap apart share a ring colour —
stated in the module header, and the section's spoken clause (`{slug} is here`, PAL-WALK §1.6,
landed once by the leader) is the cursor's second channel here too.

### 1.3 The tally, two homes with room — the memorable thing, and only when the tin runs out

`PlayerTick.vue` keeps ONE mode, the row mode: `DifficultyTally.vue:66-77`'s gate-five hand
(viewBox 76×44, four uprights, the binding slash) cropped to the line box, frozen pose (frame
`[0]` of `generateLineBoilFrames`, no beat, no filter, census 9), `stroke="var(--color-user-ink)"`
as a presentation attribute, `aria-hidden`. Mounted only when `tallyFor(index) ≥ 1`. The cell
mode dies: `DigitCell.vue`'s `:author-ticks` prop, `.glyph-tick`, the `boardSize` stroke law and
the corner geometry are deleted with the number in the commit.

| home | where | geometry | when |
|---|---|---|---|
| roster row | INSIDE `.player-name` as a trailing inline `<svg>` after the slug (`GameControlPanel.vue:1157`), so `.player-name { flex: 1 1 auto }` (`:1775`, the B1b fold) is untouched and the `you` pill does not move — pass 2's `0 1 auto` and its 156 px die | height `1em` of the row's line box (desk 18.95 px → ~14 px, phone 16.42 px → ~12 px), gap `0.35em` after the word, stroke 1.5 px painted | `p.lap ≥ 1` |
| attribution tape | after the slug in `SheetWashiLabel.vue`'s label, same component, same size rule | `--type-small` line box (16 px at 1280) → 12–14 px tally, 1.5 px stroke | `authorLap ≥ 1` (a new sibling of `authorInk`, `useSession.ts:402`) |

At ≤ 5 players both surfaces are byte-identical to HEAD (π row, both engines, children of the
row measured, never the `<li>`). The roster tick's seed is `seedFor(p.id)`; the tape's is the
same id, so the two homes draw the same hand for the same person.

Print / forced colours: `index.css:926` and `:948` widen from `.glyph-svg path` to
`.glyph-svg path, .roster-tick path` (the tape is `aria-hidden` and screen-only; its tick
inherits the tape's own print rule). The un-widened negative control reads the ink.

### 1.4 The wire rule — the section's, landed once by the leader

Identical text to PAL-WALK §1.4 (`adoptInk(k, from === e[1])`, `fresh` before the epoch write,
publish agrees nothing, the doc says AGREED, U1–U8). PAL-TIN carries no copy of it; `Player.lap`
and `authorLap` are its two additions beside the rule. The session-start stamp goes through
the declared accessor `writtenPositions: () => number[]` on `SessionSource` (`useSession.ts:219`,
implemented beside `useGameState.ts:376` off `values` and `originalGivenCells`), so nothing
parses `snapshot()`'s `unknown`. F1: YES, both arms buildable and framed (chair §6.8).

### 1.5 The gate — `lint:tin`, in CI, reading source text

`scripts/check-peer-tin.mjs` (sibling of `check-ink-pressure.mjs`): resolves `index.css` per
arm by brace-matched block with `var()` aliases followed and `hsl()` parsed (PAL-WALK's
resolved-value rung, one instrument for the section); parses `TIN` from `playerIdentity.ts` AS
TEXT (module-private; exporting it mints a consumer-less export that `knip` reds). Rows: 1a hue
≥ 12° over the resolved 19 within the arm; 1b OKLab ΔE ≥ 0.075 vs the cell nine AND the ratio
to the best-five-berth ceiling re-derived in the same run (floor pinned by the prototype's
reading); 2 pairwise ≥ 0.10; 3 hex identity, five sticks AND five rings per arm, a missing one
RED (a missing `--color-peer-N` silently inherits the incumbent blue today); 3b each ring arm is
its stick's hue at `--peer-ring-l`; four negative controls under `--self-test` in CI's own
invocation. `.github/workflows/ci.yml` gains the step beside `lint:ink` (`:942-944`'s shape:
comment block, name, working-directory, run). Born-RED at HEAD (no tin), RED against pass 1's
tokens (1b 0.046).

### 1.6 Copy

None minted. The roster is the legend; the tape already says the name; the ring's clause is
the leader's. `lint:copy` reads spoken copy by name since `5f8e1a7b`; nothing here enters it.

### 1.7 Motion

| moment | numbers | home |
|---|---|---|
| the roster tick | rides the name's write-in (J2 140–520 ms, `--ease-glassGlide`); no draw-in of its own | existing |
| the tape tick | appears with the tape, frozen; the tape's own show/hide | existing |
| your digits take your stick | SNAP on the join trace's first frame (1180 ms at 0.95) | `useJoinWash.WASH` |
| the peer cursor ring | 180 ms `--ease-ghostDraw`, α 0.55 untouched | `gameCell.css` (§6's) |
| PRM | nothing tweens that did not already | — |

`DRAW_IN_PRESETS.tally` is still landed for `DifficultyTally.vue:77`'s literal 90 (law 4,
net-zero literals) and nothing else consumes it; the comment says so.

### 1.8 Both platforms, both themes

| surface | desk 1280 | phone 390 | dark |
|---|---|---|---|
| board digit | the stick; no in-cell mark at any size | same | the dark arms |
| peer cursor ring | the stick's ring arm, width 4, α 0.55 | same; priced on `--color-popover` once | ring arm dark |
| roster row | 18.95 px row, tick ~14 px inside the name, only at lap ≥ 1 | 16.42 px row, ~12 px | same |
| attribution tape | slug + tick at `--type-small` on washi | on every pointer since 3C-4 | REPORTED 2.977 (pink) / HEAD 4.232 |

### 1.9 Couplings

- **The tape is an estate row** (HEAD's own ink fails it at night); the tin reports its worst
  and proposes, under `instruments/`, the cure it does not land: the label in `--color-foreground`
  with the stick as a 2 px rule under the slug (text AA by construction, the stick a non-text
  boundary at 3:1). The fold's 3C-4 owns the surface.
- **Chair §6.9**: `.player-swatch` re-points once under PLR-SELF; no hunk here.
- **Chair §6.11**: `.cell-because` untouched; with the cell tick gone the laminate has no new
  tenant. The dark laminate's 4.403 is a REPORTED row.
- **R6 L6**: RED (`/137\.5/`, `/0\.11/`, two `--peer-ink-l` arms all gone); the re-pointed
  law-probe diff under `instruments/`, MOVED with the 12-stick min ΔE 0.024 that repeals the
  "no cap" clause, folded into PAL-WALK's L6 row; law 21 re-cited `index.css:153-162`. Law 22's
  formula half is the ballot (B-TIN-1). Law 23 knowingly excepted.
- **domNodes 1234 → 1235**: the one-line probe (`style[data-vite-dev-id*=PlayerTick]`) — 1 in
  dev, 0 in a built preview; a dev-wire artefact (T9-R1's species), closed without a design change.
- **PLR-COUNT's ≥ 30° over the first six**: met by construction (self in the tin).

## 2 · Plan — files, order, what dies

1. `index.css:153-162, :370-375` — the ten sticks (pass 2's) + the ten ring arms; `--peer-ink-l`
   retires; the comment says the band mechanism and the ring's price.
2. `playerIdentity.ts` — `inkFor` emits the two keys; `lapFor`, `tallyFor`, `seedFor`; the
   header re-cut (five at a glance; the tally's two homes; the cursor shares a stick).
3. `scripts/check-peer-tin.mjs` + `package.json` `lint:tin --self-test` + `ci.yml` step.
4. `useSession.ts` — `Player.lap`, `authorLap`; `writtenPositions` on `SessionSource`;
   `useGameState.ts:376` implements it. The wire rule is the leader's diff.
5. `PlayerTick.vue` — row mode only; `GameControlPanel.vue:1157` mounts it inside `.player-name`;
   `SheetWashiLabel.vue` mounts it after the slug when `authorLap ≥ 1` (`GameBoard.vue:1093`
   passes it with `hoveredAuthor`). `DigitCell.vue`'s `:author-ticks`, `.glyph-tick`, the
   corner geometry, the `boardSize` stroke law: deleted.
6. `BoardHost.vue:66-79` reads the second key (the leader's hunk, replayed).
7. `index.css:926, :948` widened to `.roster-tick path`.
8. `e2e/peer-tin.spec.ts` (`PRM:` declared) — the rows in §4; `pencilConfig DRAW_IN_PRESETS.tally`
   + `DifficultyTally.vue:77`.
9. MOVED rows and instrument diffs under `pass3/prototype/PAL-TIN/instruments/`.

**Dies:** the in-cell tick and its stroke law, the corner geometry, "30 board-distinguishable",
`.player-name { flex: 0 1 auto }`, `p.id.length` as a seed, `--peer-ink-l`, the ring's 0.80
hunk, the scratch spec's gates. **Does not die:** the five hues and their bands, `IDENTITY_CAP`,
`.player-swatch`, `.cell-because`, `gameCell.css` entire, `join-language-prm:153`, the roster's
fold animations, the join wash.

## 3 · Prototype brief

Replay the pass-2 worktree's diff (`wf_8630d340-e56-58`, 18 M + 2 new) onto a fresh worktree
off `74a2b5d9`; hunks that conflict with the fold's files resolve toward the fold and are named
(`GameControlPanel.vue`, `DigitCell.vue`, `BoardHost.vue` are the fold's); drop the
`gameCell.css` hunk; apply §2. Dev server 127.0.0.1:4245 `--strictPort` via a private-cacheDir
vite config; HEAD control `74a2b5d9` on the next free port; scratch Playwright config, no
`webServer`; chromium + webkit; two-context rigs; dark via the product's key on a rAF. Batteries
as shell scripts, >90 s backgrounded. KILL both servers; the band reads empty.

Prove, numbers first:

1. `node scripts/check-peer-tin.mjs` bare exit 0 printing 1a ≥ 13.7°, 1b ≥ 0.082 / 0.100 with
   the ceiling and ratio, 2 ≥ 0.116, 3 ten sticks + ten rings, 3b each ring's hue within 1° of
   its stick; `--self-test` exit 0 with four controls RED; against HEAD's `index.css` exit 2;
   `ci.yml` step present (grep).
2. **The ring PAINTED** (`isTheRing`, dpr3, both engines, both arms), worst stick vs own fill at
   the ring arms; the pin rule applied; α read off the cascade = 0.55; `join-language-prm:153`
   GREEN; teal's ring chroma reported; the ring on `--color-popover` reported.
3. AA on the engine's bytes: ten arms × four grounds ≥ 4.5 (expected 7.163 / 5.191 worst), the
   tape and laminate REPORTED beside HEAD's own reading.
4. **Zero in-cell marks**: `.glyph-tick` count 0 on a 7-player board both engines, and the
   number that killed it re-read once on the surface (the drawable band at 9×9 desk / 16×16
   phone, ink box not `getBBox`).
5. **The two homes at seven**: roster 7 rows, 5 swatch colours, 2 ticks each inside `.player-name`
   (tick left edge − slug right edge ≤ 0.4 em), `you` pill x unchanged vs the 5-player roster
   (π on the row's children, both widths); the tape on a shared-stick digit shows slug + tick,
   on an unshared one shows the slug only; tape byte-identical to HEAD at ≤ 5.
6. Painted tick stroke 1.5 ± 0.2 px at desk and phone rows (dpr3 columns).
7. The wire (leader's units replayed) + the room of one on the real surface + solo fingerprint
   on a seeded board, zero `.roster-tick`, leave path.
8. Print / forced: roster tick `rgb(0,0,0)` / `CanvasText` through the widened selector; the
   un-widened control reads the ink.
9. Censuses: filterBudget 9 with a 16-player roster mounted; wobble σ unchanged; goldens 4/4
   against the built dist (a move is a STOP, never a re-mint); accent-kinship copied/re-pointed
   ≥ 4.5 over the five; hue-census re-cut prints five + five; copy register 0; knip clean;
   `--peer-ink-l` zero references; the dev-style probe reads 1 dev / 0 preview.
10. **Crops, at most four, ≤150 KB:** (i) the roster at seven, light, two ticks against their
    words and the `you` pill where it was; (ii) the tape over a shared-stick digit, dark, with
    its 2.977 reading in the caption; (iii) a dark board with two sticks and a peer ring at the
    ring arm beside HEAD's ring; (iv) the amber-beside-amber pair with the tape open, light.

Success in one sentence: five inks two steps clear of the machine at night, a ring that is the
same stick pressed harder and legal at the ruled alpha, the tally drawn only where it fits and
only when the tin runs out, a room of five byte-identical to today.

## 4 · Born-RED gates this family lands with

| gate | file | HEAD | after |
|---|---|---|---|
| tin: 1a ≥ 12° · 1b ≥ 0.075 + ratio · 2 ≥ 0.10 · 3 five sticks + five rings per arm · 3b ring hue = stick hue · four controls | `scripts/check-peer-tin.mjs` (`lint:tin`, ci.yml) | RED | GREEN |
| ring PAINTED ≥ 3.0 worst stick vs own fill, both arms, α read off the cascade (0.55) | `e2e/peer-tin.spec.ts` | RED 2.437 / 2.280 | GREEN ≥ 3.1 |
| `.glyph-tick` count 0 on a 7-player board (the cell mark is dead by number; a revert reds) | `e2e/peer-tin.spec.ts` | RED (pass-2 tree) / GREEN (HEAD) | GREEN |
| roster tick inside `.player-name` only at lap ≥ 1; `you` pill x unchanged vs 5 players; tape slug + tick only when shared | `e2e/peer-tin.spec.ts` | RED | GREEN |
| tape and roster byte-identical to HEAD at ≤ 5 players (π, row children) | `e2e/peer-tin.spec.ts` | GREEN | GREEN |
| `writtenPositions` declared on `SessionSource`; a caller parsing `snapshot()` fails to type | `useSession.test.ts` / vue-tsc | RED | GREEN |
| 30 distinct `(stick, tally)` on the ROSTER; `tallyFor(30) === tallyFor(25)` | `playerIdentity.test` | RED | GREEN |
| the roster tick prints black / `CanvasText`, un-widened control reads the ink | `e2e/peer-tin.spec.ts` | n.a. | GREEN |
| AA ten arms × four grounds ≥ 4.5 on engine bytes; tape + laminate REPORTED | `e2e/peer-tin.spec.ts` | n.a. | GREEN / reported |
| U1–U8 (the leader's) · solo fingerprint · the room of one | shared | as PAL-WALK | GREEN |
| R6 L6 MOVED (folds into PAL-WALK's row); law 21 re-cited | r0 MOVED row | RED | MOVED |
| filterBudget 9 · goldens 4/4 · copy 0 · knip · motion contract · `--peer-ink-l` 0 refs | existing | GREEN | GREEN |

## 5 · What this family asks the owner (U-10)

- **B-TIN-1**, law 22's formula half: a designed tin of five, the lap said by the roster and
  the tape rather than by the cell. The price of the walk is PAL-WALK's own table (four legible,
  eight side by side); the price of the tin is that the board alone tells five apart and the
  sixth needs a hover or the roster.
- **B-TIN-2**, the sixth player: system (the tick appears when the tin runs out) or bug (cap the
  room). The corner cure is withdrawn on its number; the two homes are the cure.
- **B-TIN-3** is closed by the fold: the tick sits against the word inside the name; a tally
  column is no longer offered.

## 6 · Risks carried forward

1. The ring arms are unsolved for the tin's hues until step 2 runs; teal (C 0.075) may fall
   under the census's 0.06 at the ring band as the walk's palest hand does. Reported, not hidden.
2. The dark tape at 2.977 is the tin's worst reading on any surface and it is a surface the
   fold just pushed onto phones; HEAD fails it too. An estate row either way.
3. Ten more declarations widen the identity gate's surface; a missing ring arm inherits the
   digit ink through `gameCell.css`'s fallback and the ring reads 2.280 again — gate 3 covers it.
4. The goldens with twenty moved declarations are a STOP if they move (chair §6.4).
5. The tape's tick is on an `aria-hidden` hover surface; the AT channel is the accessible
   name's slug, which does not say the lap — by design (the slug is unique).
6. Relay arm and a real device untested; W8 §8.3 is where the phone roster tick becomes evidence.
