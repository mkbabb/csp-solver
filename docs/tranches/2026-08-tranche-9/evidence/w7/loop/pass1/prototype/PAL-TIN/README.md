# PAL-TIN · pass-1 PROTOTYPE — it runs

The spec's steps 2–7 are LANDED and MEASURED in a throwaway worktree
(`.claude/worktrees/wf_e58b4764-0fc-50`, branch `worktree-wf_e58b4764-0fc-50`, off `aab67b92`,
never committed). Dev server `127.0.0.1:4245` (this lane's port), scratch Playwright config,
chromium + webkit, light + dark, dpr3 where the brief asks. Nothing was run on the main tree
but the evidence writes.

Success, in the one sentence the brief asked for: **sixteen people, five inks, every one
tellable from every other by ink or by tick, nothing spoken, census 9** — measured 16 rows / 5
painted swatches / 11 ticks, worst AA 4.545:1, ring 3.20:1, filter census 9, both engines.

## 1 · The gates, run BARE (a pipe eats the exit code)

| gate | command | exit | reading |
|---|---|---|---|
| tin, at HEAD (born-RED) | `node scripts/check-peer-tin.mjs` on HEAD's `index.css` | **2** | `INSTRUMENT BROKEN (tin): 0 light sticks and 0 dark` |
| tin, on the landed tokens | `node scripts/check-peer-tin.mjs` | **0** | gate 1 GREEN nearest anchor **13.3°** · gate 2 GREEN worst pair **ΔE 0.139** · gate 3 GREEN |
| tin, negative control | `--self-test` (a sixth stick 0.002 off amber) | **0** | gate 2 goes **RED, 2 pairs** — the gate can be shown failing |
| units | `npx vitest run` | **0** | **Test Files 66 passed (66) · Tests 810 passed (810)** (the trap: read "Test Files") |
| types | `npx vue-tsc -b --force` | **0** | clean |
| build | `npx vite build` | **0** | 490ms; the built CSS carries `.glyph-tick path{stroke:#000!important}` |
| goldens | `PLAYWRIGHT_BASE_URL=…:4245 playwright test --config playwright-golden.config.ts` against the BUILT dist | **0** | **4/4 unmoved** (logo, toggle crest, given glyph, grid corner) |
| copy register | `node scripts/check-copy-register.mjs --self-test` | **0** | 0 em dashes, 0 unadmitted jargon — **this family mints no string** |
| ink pressure · theme selectors · theme tokens · motion contract · live regions · prettier | each bare | **0** | all GREEN (`--color-peer-*` are all named, so `check-theme-tokens` counts none dead) |

## 2 · AA on the engine's own bytes — P1, both engines

Declared = painted **byte-for-byte, 10/10, both engines** (canvas read-back vs the engine's own
`getComputedStyle` resolution of `var(--color-peer-N)`).

| stick | light | bg | card | dark | bg | card |
|---|---|---|---|---|---|---|
| peer-1 amber | `#b24f00` | 5.022 | 5.143 | `#ff9a62` | 9.149 | 8.955 |
| peer-2 green | `#5f7d00` | 4.557 | 4.668 | `#a0c942` | 9.948 | 9.737 |
| peer-3 teal | `#008086` | **4.545** | 4.655 | `#00d0d9` | 10.036 | 9.823 |
| peer-4 violet | `#5a61ce` | 4.991 | 5.112 | `#a4b1ff` | 9.387 | 9.188 |
| peer-5 pink | `#a5439a` | 5.206 | 5.332 | `#f48ce6` | 8.867 | **8.679** |

Worst **4.545:1** light / **8.679:1** dark, identical in chromium and webkit. (The research said
4.55 / 8.68 — the same numbers to the rounding.)

## 3 · The ring at its DRAWN pressure — P2

The rule that actually paints reads `stroke-opacity: 0.8` off a live `.is-peer-cursor` cell.
Composited on the engine, five sticks × two grounds × two themes:

| pressure | worst | verdict |
|---|---|---|
| **0.80** (landed) | **3.200** | passes 1.4.11's 3:1 |
| 0.75 (negative control) | 2.916 / 2.917 | under |
| 0.55 (HEAD's) | 2.115 | under — the standing estate defect, re-derived |

## 4 · Solo, and π — P3 + the two-server census

- Solo mounts **zero `.glyph-tick`** and **zero `.roster-tick`**; `--color-user-ink` is the
  incumbent `#2563eb`; glyph stroke `rgb(10, 10, 10)`. Both engines.
- π: the SAME census run on port 4245 against HEAD and against the prototype (the port was
  swapped, not the tree). Every named surface — board, card, action bar, logo, tally, first and
  last cell — **rect delta 0.00 in both engines**; live filters 9 = 9; cells 81 = 81; glyph paths
  62 = 62; tokens identical.
- ONE delta: DOM elements **1234 (HEAD) → 1235 (proto)**, and the extra element is a `<style>`
  node — vite dev's injection of `PlayerTick.vue`'s scoped CSS, identified by its own text
  (`logs/hist-*.json`). A build folds it into the one stylesheet, and the golden run against the
  built dist is 4/4, so the solo surface is unmoved in production bytes.

## 5 · Sixteen at the table — P4

| platform | rows | distinct painted swatches | rows with a tick | row height | tick inside the line box |
|---|---|---|---|---|---|
| 1280×800 | **16** | **5** | **11** | 18.95px | yes (14px tick box) |
| 390×844 (dock open) | **16** | **5** | **11** | **16.42px** | yes |

Both engines identical. The roster is the product's own component driven by the product's own
presence path (fifteen peers say `hi` on the room's channel; the page answers each with `st`).

**A spec correction:** §1.8 says "phone row 19px". Measured, the phone row is **16.42px** and the
desk row is 18.95px. The 14px tick still sits inside the phone row's line box, so the design
holds — the number in the spec does not.

**Where the tick actually lands.** §1.4 says "swatch · slug · tick(s) · you". In the row's own
flex the name grows, so the tick is pushed to the row's RIGHT edge and the ticks form an aligned
tally column rather than sitting hard after each slug (`frames/roster-sixteen-light.png`). It
reads well — a column of tallies is easier to count than a ragged one — but it is not what the
spec's dot-list says, and the adjudicator should pick: keep the column, or `flex: 0 1 auto` on
`.player-name` to bring the mark up against the word.

## 6 · The tick on a digit — P5, dpr3, both engines

| board | cell | strokes | tick height | in the lower 17.5% band | overlaps the glyph box | stroke |
|---|---|---|---|---|---|---|
| 9×9 @1280 | 74.22px | 1 | **12.05% of the cell** | yes | **no** | `rgb(178, 79, 0)` = the ink |
| 16×16 @1280 | 46px | 1 | 12.05% | yes | no | the ink |

**Print and forced colours, with the negative control:**

| mode | `.glyph-tick path` | un-widened control | the digit |
|---|---|---|---|
| `media: print` | **rgb(0, 0, 0)** | rgb(178, 79, 0) | rgb(0, 0, 0) |
| `forced-colors: active` | **rgb(0, 0, 0)** (CanvasText) | rgb(178, 79, 0) | rgb(0, 0, 0) |

The control is a clone of the tick carrying a class no rule reaches; it keeps the player's
colour in both modes, which is what makes `index.css:926/:948`'s one-word widening load-bearing
rather than decorative. Both engines.

**A DEFECT THE MEASUREMENT FOUND, AND ITS CURE.** The tick's ink was first written as scoped CSS
(`.glyph-tick path { stroke: var(--color-user-ink) }`). Print was fine (that rule carries
`!important`) but **forced colours kept the player's hue**: an unlayered scoped SFC rule outranks
`@layer base`, where the forced-colours rule lives. The cure is the glyph's own mechanism — the
ink moves to a `stroke` PRESENTATION ATTRIBUTE (`HandwrittenGlyph.vue:310` does exactly this), and
a presentation attribute loses to any rule. Re-measured GREEN above. The spec should say so: the
tick's ink is an attribute, not a declaration.

**The pair, which is the whole design in one crop** (`frames/two-cells-amber-and-tick-light.png`):
two adjacent cells, `--color-user-ink` `#b24f00` on BOTH (you are index 0, the sixth player is
index 5), one tick on theirs and none on yours.

## 7 · 16×16 on a phone — P8, the case the spec flagged

390×844, dpr3, 16×16: cell **22.63px**, the tick's drawn height **2.73px CSS (8.2 device px)**,
its painted stroke **0.68px CSS (≈2 device px** — `stroke-width: 3` is in the svg's 100-unit box,
so it scales with the cell). Both engines. `frames/tick-16x16-phone-dpr3.png` is the crop.

Honest verdict: it is **present and in-band but hairline** — lighter than the grid rule beside it.
The spec's own geometry line says "stroke 3% of cell width (min 1px)"; **the min-1px floor is not
implemented**, and cannot be in user units. Two ways out for the agglomerator, neither taken here:
(a) accept the spec's stated fallback — at 16×16 on a phone the roster is the legend and the
board tick is decoration; (b) plumb a cell-size custom property and set
`vector-effect: non-scaling-stroke` with `stroke-width: max(1px, calc(var(--cell) * 0.03))`,
which is new plumbing and was refused at prototype stage.

## 8 · The draw-in — P6

`.pencil-draw-on`, the estate's own primitive, with the numbers read from
`DRAW_IN_PRESETS.tally`: animation `pencil-draw-on`, **duration 0.35s**, **delay 0.09s**
(runtime timing: `delay 90`, `duration 350`), easing `cubic-bezier(0.33, 1, 0.68, 1)` =
`--ease-drawOn`, fill `both`. Under `reducedMotion: reduce` the computed `animation-name` is
**`none`** — the primitive's own reduce arm, inherited, no second rule. Both engines.
No scheduler subscriber is enrolled and no timing literal is left in a component: the 90 moved
out of `DifficultyTally.vue:77` into `pencilConfig`, where the tally now reads it too.

## 9 · The census, the wobble, the accents — P7 + re-pointed r0 instruments

| instrument | reading on the prototype | r0's HEAD figure |
|---|---|---|
| filter census with a **16-player board and 6 ticks mounted** (P7, the budget's own counting rule) | **9** | 9 |
| r3 `budget.probe.ts` re-pointed (4×4 / 9×9 / 16×16) | **9 / 9 / 9**, PASSED | 9 |
| r3 `wobble.probe.ts` ring σ / grid σ | **0.092px / 1.443px** | 0.092 / 1.443 — unmoved (the row stays RED; PAL-TIN does not claim it) |
| r6 `hue-census.mjs` re-pointed at the prototype's `index.css` | **byte-identical diff** vs `hue-census-HEAD.txt` | no incumbent accent moved |
| the tin's own kinship | nearest reserved anchor **13.3°**, min pairwise **ΔE 0.139** | — |

## 10 · The r5 instruments

| row | before the fix | after | note |
|---|---|---|---|
| **I2** own swatch = the room's colour | RED (self amber, room green) | **GREEN both engines** — `rgb(178,79,0)` = `rgb(178,79,0)` | see below |
| **I3** a player mark in the head's left corner | RED | **RED, stated** | not this family's surface |
| **I4** an agreed index survives a rival `st` | RED at HEAD | **GREEN both engines** — a rival frame shifting every index by +5 moves nothing | the adoptInk guard |
| **I5** a live claim is never re-issued | GREEN | **GREEN both engines** | substrate row, unmoved |

**The second defect the measurement found.** The rider's first cut marked every index agreed on
`sendState`. But EVERY page answers a newcomer's `hi` with a snapshot, so both sides of a
two-page table froze their own arrival order and never agreed at all — I2 went red on exactly
that. The fix is one condition: indices are agreed only when this page published `k` **for a
board it dealt** (`ledger.epoch[1] === wire.selfId`), or when it adopted them off the room. I4
still green, I2 now green.

## 11 · Frames — 4, 74 KB total, each cited

| file | KB | cited |
|---|---|---|
| `two-cells-amber-and-tick-light.png` | 9.8 | §6 — two adjacent cells, one pencil, one tick, dpr3 light |
| `roster-sixteen-light.png` | 12.2 | §5 — the well scrolled to the sharers (it caps at 7.5rem): the same mark, one per lap, beside the names |
| `tick-16x16-dark.png` | 39.5 | §6 — 16×16 at dpr3, dark arms |
| `tick-16x16-phone-dpr3.png` | 12.3 | §7 — the hairline case, 390 wide |

## 12 · Every gap, honestly

1. **The min-1px stroke floor is not implemented** (§7). At 16×16 on a phone the mark is
   0.68px wide. Named, priced, not cured.
2. **The heading-voice instrument was not a usable control.** Re-pointed at this lane's server it
   collected only row captions (4 nodes, one voice, rank H3) where r0's HEAD run collected staged
   eyebrows and compartment tapes — a rig-state difference (which compartments are open), not a
   product one. A cross-check against another HEAD-ish server read Fraunces/H2 like r0. PAL-TIN
   touches no heading and the card's rect is π-identical, so the row is orthogonal; it is
   reported as NOT RE-DERIVED rather than as a number.
3. **The r6 hue census's tail is now stale prose.** Its last block prints "player walk
   (playerIdentity.inkFor, hue = i × 137.5)" from a hardcoded literal. The walk is dead; that
   instrument needs re-cutting if the tin lands. (Its measured rows are unaffected — the diff is
   byte-identical.)
4. **The dark-arm AA and the ring were measured by compositing on the engine's canvas**, not by
   sampling the ring's own painted pixels off a screenshot. The stroke-opacity that feeds the
   composite IS read off the live element, so the input is the product's; the compositing
   arithmetic is the probe's.
5. **The 16-person roster is driven by fake peers on the room's BroadcastChannel**, not by
   sixteen real pages. Every line it exercises is product code (presence → `mint` → `k` → `st` →
   `adoptInk` → the roster's own component), but no relay is involved and the ids are synthetic.
6. **`lap > 5` is untested.** The 26th player is beyond the rig; the code holds the drawn tally at
   five by construction (`Math.min(5, …)`).
7. **`--peer-ink-l` retires, and `lint:knip` was not run** — the dead-code lane is unmeasured here.
8. **The tick's seed in the roster is `p.id.length`**, which is a weak decorrelator (most peer
   ids are the same length, so every row's tick wobbles alike). Cosmetic; named.
9. **No real device.** Everything is Playwright's chromium and webkit on this machine; the phone
   is a 390×844 viewport at dpr3, not a phone (W8's owner-run real-iOS pass is where that lives).
10. **The `st` rig makes this page the lowest id** (`zz…` peers) so it always holds the board. A
    room where the page is NOT the board holder exercises a different `sendState` path; I2/I4
    cover it in the two-real-page rig, the 16-person rig does not.

## 13 · Where things are

- prototype worktree: `.claude/worktrees/wf_e58b4764-0fc-50` (uncommitted; read it with
  `git -C … diff --stat`)
- the diff: `proto/PAL-TIN-tracked.diff` + `proto/PAL-TIN.diffstat.txt`; the two new files are
  copied whole under `proto/new/`
- probes: `probe/tin-proto.spec.ts` (P1–P7), `probe/p8.spec.ts`, `probe/pi.spec.ts`,
  `probe/histogram.mjs`, and the two scratch configs
- readings: `readings/*.json` (one per row per engine) · logs: `logs/*.txt`
