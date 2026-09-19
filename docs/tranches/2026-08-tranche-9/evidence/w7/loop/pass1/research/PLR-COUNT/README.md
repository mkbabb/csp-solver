# PLR-COUNT — THE TALLY (T9-W7 pass 1, RESEARCH)

Family: the player mark is a COUNT drawn as objects — one stroke per person, each in that
person's ink. §11 · §12 · M14 (resolving M08). Lane port 127.0.0.1:4242. Read-only on the
product: every prototype is a `page.evaluate` overlay over the live head, drawn with the
product's OWN geometry and the product's OWN ink formula. Nothing in `src/`, `e2e/` or
`scripts/` was touched, and no product file was patched, not even in a worktree.

Every number below is re-derived on THIS tree (2026-09-17, W7/W8 lanes uncommitted), at its
own viewport, in BOTH engines. Where a figure moved against R5's census, §7 says so.

| file | what it is |
|---|---|
| `probe/proto.spec.ts` | P1–P7: geometry, the 44 floor, contrast, the strips, I3, the register, F1, `k[self]`, identity |
| `probe/proto2.spec.ts` | P8 the head's own chroma · P9 the rooms half of the cap · P10 crops |
| `probe/proto3.spec.ts` | P10b the two-colour frame |
| `probe/pw.config.ts` | the scratch config (copy of `playwright.config.ts`, no `webServer`, baseURL :4242) |
| `probe/pixels.mjs` | the painted-byte reader (sharp): runs, gaps, core OKLCH per mark |
| `proto/proto-overlay.ts` | the overlay itself — the three objects, the register, N as a knob |
| `data/` | every reading, both engines |
| `frames/` | three crops, 113 KB total |

---

## 1 · The substrate, verified (file:line)

**THE TALLY IS ALREADY DRAWN.** `src/games/shared/DifficultyTally.vue` is a gate-five tally in
the house hand, mounted at `GameControlPanel.vue:894` with `label="dealt"` — the owner's own
`dealt ⊪`. The family does not invent an object; it re-aims one that already ships.

- `DifficultyTally.vue:68-75` — viewBox **76 × 44**; four uprights at x **11 / 24 / 37 / 50**
  (pitch **13**), y **9 → 35**; the fifth is the binding diagonal **(6,37) → (55,7)**;
  per-stroke seeds 11 / 23 / 37 / 53 / 71.
- `:76-77` — `TALLY_BOIL = 0.6` viewBox units, `DRAW_STAGGER_MS = 90`.
- `:84-97` — `generateLineBoilFrames(x1,y1,x2,y2,{roughness:0.95,segments:4,seed,jagged:true},
  0.6, BOIL_CONFIG.frameCount, grain)` (`src/pencil/grid/gridPaths.ts:380-410`).
- `:81` — grain = `FILTER_PRESETS["grain-static"].grain` = `{baseFrequency 0.04, numOctaves 3,
  scale 2.5, seed 2}` (`pencilConfig.ts:329-333`), **baked into the point IR**, not a live
  filter. `gridPaths.ts:397` claims "no caller passes `grain` today" — this one does.
- `:116-119` — `useBeatFrame(heldFrameCount(() => BOIL_CONFIG.frameCount), beatsFor(...))`:
  the SHARED boil beat, ref-counted, enrolling no new scheduler subscriber.
- `:135-161` — draw-in on `createSequenceSubscription` + `easeOutCubic` +
  `DRAW_IN_PRESETS.glyph.duration`, stroke-dashoffset over `pathLength="100"`; PRM snaps inked
  (`:142`, `:178-183`).
- `:339-347` — inked **stroke-width 3.2, stroke-opacity 0.95**; ghost 2 / 0.24; `:350-355`
  the ungraded placeholder 2 / 0.32 dashed. `:316-321` — `.dt-marks { height: 1.9em }`.
- `:198-203` — `role="img"` + `aria-label`, **no tabindex** (a11y r1 L12 removed it).
- `techniqueVoice.ts:114` `TALLY_TOTAL = 5`; `:190` the name is the count and only the count
  (`level 3 of 5`) — the M16 ruling this family inherits verbatim.

Rest of the substrate, unchanged from R5 and re-read here: `playerIdentity.ts:68-70` `inkFor`;
`:98` `IDENTITY_CAP = 8`; `:135-148` `writeStore` prunes rooms by `at` desc and live by
`slice(-8)`; `:183-194` `claimIdentity`. `useSession.ts:537` self `ink: {}`.
`GameControlPanel.vue:1124-1131` the roster `role="log"`, `:1139-1170` the rows with
`:style="p.ink"`. `AttributionCard.vue` `.corner-left`/`.mobile-attribution`
`position: fixed; top: var(--head-rule); left: 0; z-index: 40`; `.hover-card` `min-width 16rem`,
`padding 1rem`, `border 2px` at 30%, `border-radius 1rem`, popover at 80%. `App.vue:961`
`--tap-floor: 2.75rem`. `index.css:88-97` Patrick Hand's 46-codepoint cut.

**The product's own tally, measured live** (both engines, both widths, identical):
box **52.48 × 30.39** px, **0.6907 px per viewBox unit**, so its inked stroke paints at
**2.21 px** in `rgb(38, 38, 38)`. The family's "2–3px coloured stroke" is not a new regime —
it is the regime the product already draws in, in graphite.

---

## 2 · The head, measured

Re-derives R5 F14 to the hundredth, both engines:

| | phone 390×844 | desk 1280×800 |
|---|---|---|
| @mbabb trigger | **75.53 × 39.75** at (0, 0) | 75.53 × 39.75 at (0, 12) |
| sun | x 326, w 64 | x 1072, w 208 |
| **free band** | **250.47 px** | 996.47 px |

The mark's scale, mounted at `left = trigger.right + 8`:

| svg height | px/unit | stroke (plain) | stroke (stub) |
|---|---|---|---|
| 30 px | 0.6818 | **2.182 px** | 4.432 px |
| 36 px | 0.8182 | **2.618 px** | 5.318 px |
| 44 px | 1.0000 | 3.200 px | 6.500 px |

**The 44 floor holds in both dimensions**, both widths, both engines: armed **44 × 44**
(`min-width` and `min-height` both on `--tap-floor`); the per-dimension negative control
(`min-*: 40px`) reads **40 × 40** and fails both. `data/p1-floor-*.json`.

---

## 3 · The three objects, and what the painted bytes say

Three objects were drawn, not two — the charter's `stroke` (the gate-five, with the binding
diagonal), a `plain` control (the same upright, chunked by a GAP at five instead of a strike),
and `stub` (a 16-unit nub at stroke-width 6.5). Strips of N = 1…12 at dpr3, both engines, both
themes, read back with sharp (`probe/pixels.mjs`, `data/pixels-all.json`).

**The count.** Runs = separated ink columns — the machine's own count of objects.

| object | runs vs N (1…12) | intra gap | chunk gap |
|---|---|---|---|
| plain | **= N, every row, both engines, both themes** | 19–21 device px | 51–55 device px |
| stroke (gate) | **1 at N=5 · 2 at N=10** — the gate fuses | — | 37–50 |
| stub | = N, every row | **6–10 device px** | 26 |

The gate's merged blob is **126–128 device px** (42 CSS px) wide. `frames/strips-*.png`.

**The colour.** Painted core, converted to OKLCH off the bitmap:

- core chroma **0.0887 … 0.1130** against the nominal **0.11** — at 2.18 px, both engines,
  both themes. The thinnest reading (0.0887) is the gate's diagonal, which is the only stroke
  drawn off-axis.
- contrast at the DRAWN opacity (0.95), canvas read-back on four grounds, both engines
  identical: **light worst 4.771** (index 4, on `--color-background`), **dark worst 8.579**
  (index 0, on `--color-card`). At full opacity: 5.260 / 9.504. Graphite: 12.479 / 12.781
  light, 10.953 / 10.745 dark.

**The kill condition on colour is CLEARED.** Colour survives at 2.18 px, in bytes, on both
engines. It clears 1.4.11's 3:1 by 1.59× at its worst and AA 4.5:1 by 0.271.

**The hue distance is what degrades**, and it degrades with N, not with size — minimum
pairwise painted hue separation: 138.8° at 2 · 55.3° at 4 · **30.9° at 6** · 20.4° at 9 ·
**18.9° at 12**. R5 F2 puts 16 at 12.5°. The COUNT never depends on this; ATTRIBUTION does.

---

## 4 · What the family got wrong, in its own numbers

**4.1 — THE STRIKE IS NOT A PERSON.** The fifth mark in a gate-five is a diagonal across the
other four. Under "one stroke per person, each in that person's ink", the fifth player owns no
object of their own: they are a slash laid over four other people's marks, and they interrupt
all four (`frames/objects-390-light.png`, row 2). The bitmap agrees — the gate reads as ONE
run, not five. The gate is a MAGNITUDE idiom, which is exactly the job `DifficultyTally` does
and exactly the job a roll call does not. Five people are a set; a difficulty tier is a
quantity. The family's own primitive is the wrong half of itself.

**4.2 — THE TALLY OUTGROWS THE HEAD.** Button width in the phone's 250.47 px band, h = 36:

| N | 1 | 3 | 5 | 6 | 8 | 10 | 12 | 16 |
|---|---|---|---|---|---|---|---|---|
| plain | 44 | 52.81 | 74.08 | 95.36 | 116.63 | 137.91 | 183.94 | **236.28** |
| gate | 44 | 52.81 | 67.53 | 87.17 | 108.45 | 123.17 | 167.58 | 211.73 |
| stub | 44 | 47.91 | 65.91 | 81.45 | 99.45 | 117.45 | 156.13 | 197.81 |

At 16 the plain tally eats **94.3%** of the band the head has left after @mbabb. At 12, 73.4%.
The written count cannot be a decoration added past a threshold — it has to REPLACE the marks.
The last width that leaves the head room to breathe is **N ≤ 6** (95.36 px, 38% of the band).

**4.3 — TWO COLOURS, ONE PERSON, ONE PAGE.** Measured, not argued
(`frames/two-colour-390-light.png`): the digit I wrote paints `rgb(37, 99, 235)` — OKLCH
h **262.9°** — and the room's `k` hands me index **0**, so my own mark paints
`oklch(0.5 0.11 0)` — h **0.0°**. **97.1° apart**, both in the page's left column, ~250 px
apart vertically, with nothing on the page connecting them. Both engines, `data/p7-kself-*.json`.
A reader who has just written a blue 3 and looks up at a rose mark has no route from one to the
other. This is the F1 ruling's price and it is real.

**4.4 — THE HEAD IS NOT A NEUTRAL GROUND.** New to this lane: the band the mark would join
already carries **12 chromatic tokens**, all warm — the celestial's golds and oranges
(h 46.5 … 100.8) and the logo's roses (h 2.8 … 14.7). Five of the first sixteen peer indices
land within 12° of one of them:

| peer | h | collides with | Δ |
|---|---|---|---|
| **0** | 0.0 | `#ffb3c6` (logo rose) | **2.8°** |
| 0 | 0.0 | `#8f3a50` | 6.6° |
| 3 | 52.5 | `#e88845` (sun) | **0.6°** |
| 6 | 105.0 | `#fff4aa` (sun core) | 4.2° |
| 8 | 20.0 | `#ff4d6d` | 5.3° |
| 11 | 72.5 | `#d99a10` (sun ray) | 6.2° |

Index 0 is the index the room hands the FIRST player — which, on your own page, is you. So the
family's default first mark is 2.8° from the logo's own rose, in the same 40 px band. R5's F4
counted the BOARD's 29 reserved inks; this is a second, disjoint set the mark's own surface
adds. `data/proto2.log` P8.

**4.5 — THE ACCESSIBLE NAME AND THE INSTRUMENT ARE COUPLED.** I3's locator is
`/player|lobby|who.s (here|on this board)/i`. The charter's proposed name, `3 on this board`,
matches **none** of it: **0 candidates, both engines**. `1 player on this board` greens I3
with 1 candidate. The count in plain words must carry the word `player`, or I3 must be
re-cut — and re-cutting an instrument to fit a cure is the thing this loop does not do.

---

## 5 · The instruments, before and after

| id | what it asserts | HEAD | under this lane's overlay |
|---|---|---|---|
| I1 `instruments-family-law.mjs` | no peer ink within 12° of a reserved ink in the first 16 | **RED**, exit 1, **37 collisions** (re-run bare on this tree, `data/family-law-HEAD.txt`) | **still RED** — the family consumes the palette, it does not design it (charter §8). It ADDS the head's 12 tokens to the set that must be cleared. |
| I2 a player's own swatch is the room's colour | **RED** — `rgb(37,99,235)` vs `oklch(0.5 0.11 137.5)`, both engines | **stays RED by ruling.** F1 is ruled the other way: the board keeps `--color-user-ink`. The mark and the register carry the room-relative label. I2 as written asserts the ruling this family declined; it is not this family's row to green. |
| I3 a player mark in the head opens a lobby | **RED** — 0 candidates | **GREEN**, both engines: 1 candidate, box **x 83.52 / y 12 / 44 × 44**, press opens `[data-lobby]`. GREEN only with `N player(s) on this board` as the name (§4.5). |
| I4 an agreed ink index survives a rival `st` | **RED** — 137.5° → 327.5° on one page | **unchanged.** The register SPEAKS to it: §6. |
| I5 a live claim is never re-issued | **RED** — `collided: true` | **re-derived RED**, both engines, `data/p7-identity-*.json`. |

**New reading on the rooms half of the cap.** `writeStore` (`playerIdentity.ts:135-148`) sorts
rooms by `at` descending and keeps 8. At sub-millisecond claim speed every `at` ties, the sort
is stable, and the prune drops the **NEWEST** room rather than the oldest: nine rooms claimed in
one tick left room-0 bound and `back === first` (`evicted: false`, both engines). R5's F5
measured eviction across real navigations, where `at` actually separates. Both are true; the
scope is the difference, and a register that tells a reader "your seat was given away" must not
be driven off a millisecond.

**Font.** Every string this family mints is inside Patrick Hand's 46-codepoint cut
(`index.css:88-97`): `you`, `last heard from a moment ago`, `a moment ago`, `2 minutes ago`,
`and 4 more`, and the digits `0-9` (U+0030-0039 is in the cut, so a written count is free).
**Zero woff2 re-cut.** `node scripts/check-font-coverage.mjs` is green at HEAD (46 codepoints,
4312 B). One casualty: **`just you` is undrawable** — `j` is U+006A, and the cut runs
U+0061-0069 then U+006B-0077. The solo state gets no word, or a different word.

**π.** The object is grain-BAKED pose siblings, opacity-swapped on the shared beat — the
identical mechanism `DifficultyTally` ships. Zero live filters, so `filterBudget` stays 9 by
construction, not by permission.

---

## 6 · The register (the lobby), measured

The @mbabb card's pose, reused whole. N = 3 and N = 16, both engines:

| | card | rows | row height | `you` gap | bottom |
|---|---|---|---|---|---|
| N = 3 | 256 × **121.92** | 3 | 18.95 | **8 px** | 180.9 of 800 |
| N = 16 | 256 × **368.31** | 16 | 18.95 | 8 px | **427.3** of 800 |

Sixteen people fit in one card with **no scroll inside a scroll** — R5's F9 (six rows behind
`max-height: 7.5rem`) and F8 (the roster 111 px below a phone's fold) both dissolve, because
the surface is a head popover rather than a well inside the card inside the sheet. F10 dissolves
too: `you` sits **8 px** from the name it qualifies instead of ~145 px.

**What it says when identity is lost.** The register must not invent an ack the wire does not
carry (R5 §4). Three honest sentences, all derivable from `hi`/`st`/`cur`:

- *your ink moved* (I4) — `adoptInk` rebound you. The register is the only surface that can say
  so, because the board cannot: `k` is the room's, and the room changed its mind.
- *you came back as someone new* (I5 / F5) — a fresh id means a fresh slug and a fresh index.
  The honest line names the old slug beside the new one; there is nothing else to say.
- *last heard from* against the 45 s expiry (`useSession.ts:616,624`) — never a connected dot.

**Speech.** The roster's `role="log"` moves with the register (mirror, not duplicate); the
count is the mark's accessible name; no second polite region says what `players-status` and
`players-alone` already say (R5 F12, W3 §3.4). A peer arriving moves nothing and opens nothing
(M19) — the arrival is an addition to a log a reader's AT is already watching.

---

## 7 · Where numbers moved

- **Contrast at the DRAWN opacity is new.** R5's F3 (5.22/5.35 light, 9.71/9.50 dark) is at
  full opacity over all 144. At the tally's shipped `stroke-opacity: 0.95` over the first 16:
  **4.771 / 4.887 light, 8.579 / 8.734 dark**. Still clear of both floors; the drop is 0.49
  light and 0.93 dark and it must be re-derived at 16, not at 144.
- **@mbabb geometry and the 250.5 px band re-derive exactly** (75.53 × 39.75, 250.47).
- **The family law is unmoved**: 37 collisions, exit 1, same rows.
- **I5 is unmoved**: `collided: true`, both engines.
- **The rooms half** is scope-corrected, not contradicted (§5).
- **F1 is unmoved and the board is byte-identical solo vs in a room**: 81 cells, **0 with an
  ink binding**, first glyph `rgb(10,10,10)`, `--color-user-ink` `#2563eb` in both states, both
  engines (`data/p6-f1-*.json`). Nothing this family proposes touches a cell.

---

## 8 · Sketches

**A — the mark in the head (the recommendation): plain strokes, chunked at five, a number past six.**

```
 phone 390, head band 250.47px free after @mbabb
 ┌──────────────────────────────────────────────────────────────┐
 │ @mbabb   │ │ │            ← N=3, 52.81px, one stroke each,   │
 │ 75.5×39.8  ▲ ▲ ▲             2.618px wide, in that person's  │
 │          rose grn blu        ink, 44×44 trigger              │
 │                                                    ☀ 64×64   │
 └──────────────────────────────────────────────────────────────┘
   N=1 solo   │             graphite. always present, same meaning.
   N=5        │ │ │ │ │     one chunk, 74.08px
   N=6        │ │ │ │ │  │  chunk + 1, 95.36px  ← last width that fits
   N=7+       │ │ │ │ │  7   the chunk holds, the rest is a number
```

**B — what the gate-five actually draws, and why it dies here.**

```
   the product's dealt ⊪ (DifficultyTally)      the family's five people
   ┌───────────────────────┐                    ┌───────────────────────┐
   │  dealt  │ │ │ │╱      │  one hand,         │   │ │ │ │╱           │
   │         graphite      │  one magnitude     │  rose grn blu gld     │
   └───────────────────────┘                    │        ╲ teal ╱       │
   5 strokes = tier 5                           └───────────────────────┘
   the diagonal binds YOUR OWN four             the diagonal is PERSON 5
                                                laid across persons 1-4.
   bitmap: 1 run at N=5 (126-128 device px).    person 5 owns no object.
```

**C — the register, hung off `--head-rule` in the @mbabb card's pose.**

```
 ┌ 256 ───────────────────────────┐   N=3  → 121.92 tall
 │ │ tragic-mockingbird   you     │   N=16 → 368.31 tall, bottom 427 of 800
 │ │ brave-otter                  │   row 18.95px · `you` 8px off the name
 │ │ quiet-heron                  │   names graphite 4.5:1 · marks 3:1 at 0.95
 │                                │   role="log" MOVES here (not a second one)
 │ last heard from a moment ago   │   every glyph inside the hand's 46-char cut
 └────────────────────────────────┘   2px border @30% · radius 16 · popover 80%
```

---

## 9 · Recommendation — **ADJUST**

The idea holds and the object is already in the product; two of its three named parts do not
survive their own measurements.

**KEEP.** The mark is a count drawn as objects, one per person, each in that person's ink,
drawn as a wobbled path off `generateLineBoilFrames` with grain baked into the geometry — the
same call `DifficultyTally.vue:84-97` makes. Zero live filters, the shared beat, the shared
draw-in, PRM inherited. Solo is ONE graphite stroke: always present, always the same meaning,
byte-identical to today's board because it binds nothing on a cell. The register is the @mbabb
card's pose, and it holds sixteen people with no scroll inside a scroll while dissolving R5's
F8, F9 and F10 at once.

**DROP THE FIVE-BAR STRIKE.** It is the one part of the idea that came from the product rather
than from the problem, and it is the wrong half of the product: `dealt ⊪` measures a magnitude
in one hand, and this measures a set of people in N hands. At five the strike stops being a
person's stroke and becomes a slash across four other people's strokes — and the painted bytes
fuse the group into a single 126-128 px run, so the object the reader counts is no longer the
object a person owns. **Chunk with a gap instead** (19-21 device px within, 51-55 between): the
plain control counts clean at every N from 1 to 12, both engines, both themes.

**MOVE THE WRITTEN COUNT DOWN TO SIX, AND MAKE IT REPLACE.** The band leaves 250.47 px; at
N = 16 the marks want 236.28 of it. Past six, the mark is one chunk and a number — the chunk
carries the idiom, the number carries the truth, and the head stops growing.

**THE TWO OPEN QUESTIONS GO UP, NOT AWAY.** (1) You are blue on the board and 97.1° away on
your own mark; that is the F1 ruling's price, it is measured, and it is a ballot, not a
detail — the cheapest honest mitigation is that the register names you (`you`, 8 px off your
name) rather than that the mark argue it. (2) The head is not a neutral ground: 12 warm
tokens, and five of the first sixteen peer indices sit inside 12° of one, index 0 at 2.8° from
the logo's rose. The palette families own the walk; this family's demand on them is now
specific — **N inks that clear the 29 board tokens AND the head's 12, at 2.18 px, with the
first index not landing in the logo.**

Nothing closes here (U-10).
