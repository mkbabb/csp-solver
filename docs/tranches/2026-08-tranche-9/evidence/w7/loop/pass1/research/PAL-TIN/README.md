# PAL-TIN · pass 1 (RESEARCH) — THE TIN

T9-W7 §11c the per-player colour system · §3's peer exception · §12.
Lane port 127.0.0.1:4245. Read-only on the product: nothing in `src/`, `e2e/` or `scripts/`
was touched. Every colour below was derived by a probe in `probe/` off `index.css`'s own
bytes and then read back out of the ENGINE (chromium + webkit, both themes) in `out/live-probe.txt`.

**Verdict: ADJUST — and the adjustment is large.** The idea's centre survives and is proved.
Its arithmetic does not. A tin of twelve does not exist on this product's papers, and no
second COLOUR axis can carry sharing. What the numbers cut is a tin of **five**, with the
sharing axis moved off colour entirely and onto the drawn tick. Details in §8.

---

## 1 · Substrate verified on this tree (file:line)

| claim | where | measured here |
|---|---|---|
| the walk is one formula, one binding | `playerIdentity.ts:68-70` | `oklch(var(--peer-ink-l) 0.11 {(i×137.5)%360}deg)`; the probe reads step and chroma out of the file, never retypes them |
| the band | `index.css:162` / `index.css:374` | `--peer-ink-l` 0.5 light, 0.8 dark. A **+0.300** jump |
| every id takes an index, self included; self binds nothing | `useSession.ts:533-538` | `inkIndex[id] ?? inkCursor++`; `ink: id === selfId ? {} : inkFor(index)` |
| an agreed index IS reassignable | `useSession.ts:547-568` | `adoptInk` writes `inkIndex[id] = index` unguarded |
| the identity cap has teeth | `playerIdentity.ts:98,142` | `IDENTITY_CAP = 8`, pruned at every write, both halves |
| the cursor ring's drawn pressure | `gameCell.css:229-241` | `stroke-opacity: 0.55`, `fill-opacity: 0.04`, stroke-width 4 |
| the join trace's drawn pressures | `HandDrawnGrid.vue:493-512` + `useJoinWash.WASH` | 0.95 join / 0.65 rejoin / 0.45 leave, stroke-width 8, nothing mounted at rest |
| the roster row carries the ink | `GameControlPanel.vue:1140-1160` | `:style="p.ink"` on the `<li>`; swatch and name both inherit |
| the tally idiom already exists | `DifficultyTally.vue:1-80` | four uprights + a binding slash, 76×44 viewBox, `TALLY_BOIL 0.6`, grain-BAKED poses, opacity-swapped on the shared beat — **no live filter** |
| print and forced-colors already beat the player ink | `index.css:930-951` | `@layer base` outranks the glyph's `stroke` presentation attribute; forced-colors gets `CanvasText` |
| the hand's cut | `index.css:94-96` | U+0020-0021, U+0027, U+002D-002E, U+0030-0039, U+003F, C R S, a-i, k-w, y-z, ×, —, … |

Re-derived and **moved from the r0 census**: nothing. R5's F1–F14 all reproduce. Two numbers
this lane adds that r0 did not take:

- **the crayon dark law, measured on the crayons** (`out/tin-arms.txt` §F): green +0.055,
  orange +0.036, rose +0.084, blue +0.083, gold **+0.121** (and Δh 11.6°), user-ink **+0.168**
  (Δh 8.3°), progress-ink **−0.064**. Law 18's letter ("+0.06…0.10") is obeyed by three of
  five crayons. The peer band's +0.300 is not a crayon step and never claimed to be.
- **the drawn pressures were never priced.** R5's F3 reads contrast OPAQUE. At the opacity the
  ring and the trace are actually drawn at, the standing estate **fails** the 1.4.11 3:1 floor:
  see §4.

---

## 2 · The wheel, measured — and why twelve sticks do not exist

`probe/tin-cut.mjs`, `probe/tin-arms.mjs` → `out/tin-cut.txt`, `out/tin-arms.txt`.

Every one of the 29 reserved inks blocks ±12° (the r0 instrument's own floor). What is left:

```
FORBIDDEN 212.7deg (59% of the wheel) · FREE 147.3deg in 5 arcs
   26.2 …  52.1   26.0deg
  107.8 … 134.9   27.2deg
  177.7 … 237.3   59.7deg   ← forty percent of all the room there is, and it is ONE cyan
  274.9 … 280.7    5.9deg
  305.6 … 334.0   28.5deg
```

Twelve sticks fit **by hue** (min inter-stick gap 14.8°). They do not fit **by eye**. Five of
the twelve land in the 177.7–237.3° arc and come out as five teals:

```
peer-5 #00816e · peer-6 #00817f · peer-7 #007f8c · peer-8 #007e9c · peer-9 #007aaf
        ΔE(5,6) 0.027   ΔE(6,7) 0.024   ΔE(7,8) 0.027
```

Min pairwise ΔE over the twelve: **0.024** light, 0.043 dark; **13 of 66 pairs under ΔE 0.10**.
Two players are the same colour. Hue degrees measure the distance to an ANCHOR; ΔE measures
whether two PEOPLE look like two people, and only the second one is what M14 asked for.

**The size sweep** (`probe/tin-size.mjs` → `out/tin-size.txt`), one pinned band, chroma capped
at the crayon mean, ΔE 0.10 floor:

| n | min hue gap | light min ΔE | dark min ΔE | verdict |
|---|---|---|---|---|
| 4 | 89.9° | 0.168 | 0.193 | tells apart |
| **5** | **59.0°** | **0.144** | **0.145** | **tells apart** |
| 6 | 51.4° | 0.091 | 0.113 | too close |
| 8 | 28.3° | 0.050 | 0.068 | too close |
| 12 | 14.8° | 0.024 | 0.034 | too close |
| 16 | 8.8° | 0.021 | 0.026 | too close |

**The control that makes this a product fact rather than a family fact**
(`probe/tin-ceiling.mjs` → `out/tin-ceiling.txt`): delete the family law entirely, give a
palette the WHOLE wheel, and the ceiling is **six** (n=6 → 0.111/0.134; n=7 → 0.099 light).
The 12° law costs exactly one stick. Twelve distinguishable player colours do not exist on
`hsl(48 15% 98%)` paper at AA 4.5:1 — for this family or any other. Retiring `--color-user-ink`
from the reserved set (every player draws from the tin, so nobody writes in blue-600 any more)
widens the arc and changes the answer by **nothing**: still five (`probe/tin-size-nouser.mjs`).

---

## 3 · The three forks, answered

`probe/tin-forks.mjs` → `out/tin-forks.txt`; `probe/tin-final.mjs` → `out/tin-final.txt`.

### (c) DERIVATION — six hues × two lightness bands beats twelve cuts, then dies anyway

| arrangement | theme | worst AA | min ΔE | pairs <0.10 |
|---|---|---|---|---|
| twelve cuts, one band | light | 4.50 | 0.024 | 13/66 |
| six hues × 2 bands (0.10) | light | 4.50 | **0.074** | 4/66 |
| twelve cuts, one band | dark | 6.40 | 0.043 | 7/66 |
| six hues × 2 bands (0.10) | dark | 6.48 | **0.006** | 1/66 |

Three times better separated in light, and **collapsed in dark**: when the arm's lightness is
chosen to maximise chroma, both bands converge on the same L and the pair becomes one colour
(ΔE 0.006). Pinning the bands instead of deriving them fixes that (light 0.545/0.415, dark
0.720/0.860 → min ΔE 0.070/0.072) — but see (b), which kills the whole construction.

### (b) THE SHARING AXIS — a colour step cannot carry sharing. Measured, not argued.

State the law the arm has to pass: **a pencil and its own second lap must be nearer to each
other than either is to any OTHER pencil.** Otherwise the 13th player does not read as "the
1st, a shade off"; they read as a stranger.

| free sticks | the tin's own min inter-stick ΔE | step 0.06 | step 0.10 | step 0.14 |
|---|---|---|---|---|
| 12 | 0.024 | own 0.059 / other 0.061 — FAILS | own 0.098 / other 0.098 — FAILS | own 0.139 / other 0.138 — FAILS |
| 6 | 0.091 | own 0.059 / other 0.099 — holds | own 0.098 / other 0.121 — FAILS | own 0.139 / other 0.152 — FAILS |

On the pinned six-hue tin the clustering law **breaks on 5 of 6 pencils**, worst margin
−0.064 light and −0.087 dark. A CHROMA step instead of a lightness step breaks on 3 of 6,
worst margin −0.026, and costs the palette its saturation (mean C 0.106 against the crayons'
0.166). Both directions were tried; both fail on this paper.

The reason is structural and worth writing down: **at AA 4.5:1 on a near-white paper the usable
ink volume is a thin shell.** Any second lightness band pushes toward a corner where the
chroma ceiling collapses and hues converge. A step big enough to see is bigger than the gap
between two different pencils. The lightness step is DEAD.

### (a) FREE STICKS — the honest number is five, and exhaustion is early

`out/tin-forks.txt`. Twelve free would put the first sharer at player 13 — still short of
"16+ within reason", and the twelve are not distinguishable anyway. Five free puts the first
sharer at player **6**. That is the number the family has to own, and it is why the sharing
axis has to be good rather than a fallback.

---

## 4 · AA, read back off the engine — and the floor the estate already fails

`out/live-probe.txt` (T1, chromium + webkit, both themes, four grounds, canvas read-back;
declared and painted agree byte-for-byte in both engines).

**THE TIN OF FIVE**, the margined cut (`probe/tin-five-margin.mjs`, `proto/tin-tokens.css`):

| # | name | hue | light hex | bg | card | dark hex | bg | card |
|---|---|---|---|---|---|---|---|---|
| 1 | amber | 48.5 | `#b24f00` | 5.02 | 5.14 | `#ff9a62` | 9.15 | 8.96 |
| 2 | green | 124.5 | `#5f7d00` | 4.56 | 4.67 | `#a0c942` | 9.95 | 9.74 |
| 3 | teal | 200.4 | `#008086` | 4.55 | 4.66 | `#00d0d9` | 10.04 | 9.82 |
| 4 | violet | 276.4 | `#5a61ce` | 4.99 | 5.11 | `#a4b1ff` | 9.39 | 9.19 |
| 5 | pink | 332.4 | `#a5439a` | 5.21 | 5.33 | `#f48ce6` | 8.87 | 8.68 |

Worst case named: **4.55:1** (teal, light, on `--color-background`) and **8.68:1** (pink, dark,
on `--color-card`). 0/5 under AA in either theme, both engines. Min pairwise ΔE 0.145 light /
0.139 dark. Mean chroma 0.142 — above the walk's 0.11, still under the crayons' 0.166.

**THE 3:1 NON-TEXT FLOOR AT THE DRAWN PRESSURES — the estate fails it today, and the tin does not fix it.**

| | light @0.55 (ring) | dark @0.55 | light @0.95 | @0.65 | @0.45 |
|---|---|---|---|---|---|
| the walk at HEAD (first 16) | **2.29:1 — 16/16 under** | 3.64 PASS | 4.77 PASS | 2.75 FAIL | 1.94 FAIL |
| the tin of five | **2.13:1 — 5/5 under** | 3.40 PASS | 4.17 PASS | — | — |

This is a **standing estate defect, not the family's**, and it is the first time it has been
measured: R5's F3 priced the ink opaque. The cure is not in the palette. Driving the light arm
dark enough to clear 3:1 at 0.55 is possible (`out/tin-arms.txt`, the AA+RING arm: every stick
clears 3.00–3.04) but costs the tin its colour — mean chroma falls to **0.107**, below the walk
it replaces, and the pairs under ΔE 0.10 rise from 13/66 to 18/66. **Recommend curing the
ring's pressure, not the palette's chroma**: `gameCell.css:236` `stroke-opacity: 0.55` → **0.80**
takes the whole tin to **3.20:1** worst, both themes, four grounds, with the colours above
intact — and 0.75 is the negative control at **2.95:1**, still under. (Sweep at the foot of
`out/tin-final.txt`.) That is a one-line change in the family's own section and it belongs in
the spec.

---

## 5 · The instruments

`out/instruments.txt`. **Trap re-confirmed** (memory's own): `node gate.mjs | tail` prints RED
and exits 0. Every gate below was run bare for its exit code.

| instrument | reading |
|---|---|
| `r0/r5-player-mark/instruments-family-law.mjs`, **unchanged** | RED, **37 collisions**, exit 1 — unmoved on this tree |
| `probe/instruments-family-law-tin.mjs` on the TWELVE-stick tin | gate 1 RED (7), gate 2 RED (**20 pairs**), exit 1 |
| same, on the SIX-stick tin | gate 1 GREEN, gate 2 **RED** (teal↔blue ΔE 0.091), exit 1 |
| same, on the FIVE-stick tin (`proto/tin-tokens.css`) | gate 1 **GREEN**, gate 2 **GREEN** (worst 0.139), anchor test GREEN, **exit 0** |
| `scripts/check-font-coverage.mjs` (read-only) | OK — 2 faces, 46 hand codepoints |

The new instrument is the r0 one's sibling, not its rewrite: same 29 inks, same `index.css`,
same 12°, and it reads a TABLE where the original reads a FORMULA. It adds **gate 2, the
separation law**, because the r0 gate only ever asked about anchors and the anchor question is
the one this family passes trivially. Gate 2 is born-RED against the charter's own twelve and
GREEN against five — that is the whole finding in one exit code.

**The r0 Playwright rows.** I3 (a mark in the head's left corner) is not this family's surface —
PAL-TIN is a palette, and greening I3 would mean designing another family's mark under cover of
an overlay. It stays RED here and is stated as such. I2 is ruled by F1: a tin does not by itself
make your own page paint you the room's colour; that needs `useSession.ts:537`'s `ink: {}` to
become conditional on a live room (§6). I4 and I5 are substrate rows the family SPEAKS to (§7),
not rows it cures.

---

## 6 · You join, and solo stays byte-identical

- `mint()` already takes an index for **you** (`useSession.ts:533`) and already puts it on the
  wire in `k`, so the room already agrees which pencil is yours. Nothing new on the wire.
- Solo byte-identity is `ink: {}` at `useSession.ts:537` and the `author === selfId` skip at
  `useSession.ts:405`. **A tin does not break it; taking your own pencil does.** The gate has
  to be the ROOM, not the player: bind self's ink only when `session.roomId` is non-null.
  Stated plainly so the synthesizer cannot miss it — "YOU take a pencil too" is a change to
  two lines in `useSession`, and its guard is `roomId`, not `self`.
- **Print and forced-colors cost nothing.** `index.css:930-951` already beats the per-cell ink
  from inside `@layer base`, so a shared board prints true black and a high-contrast reader
  gets `CanvasText`, whatever the tin says. **But the TICK needs its own pair of rules** — it
  is a second SVG and no existing selector reaches it. Under print the ticks become the only
  surviving distinction between two sharers, which is strictly better than HEAD (where print
  collapses every peer to one black).

---

## 7 · The allocator, in plain sentences

```
stick  = index % 5          ticks = floor(index / 5)
```

Tin order. No golden angle, no randomness, and the lap number IS the tick count — one
arithmetic, two visible facts. Measured live over a scripted 16-id roster, both engines, both
themes (`out/live-probe.txt` T2): **5 distinct painted swatches over 16 people, 11 sharers,
11 rows carrying a tick**, every row 19px, the roster's own component and its own scoped CSS.

The three questions the charter asks, each in one sentence a person could read:

- **a late joiner** — takes the next pencil in the tin, and once the tin is out, the next
  pencil again with one more tick. *"you're the green pencil with one tick."*
- **a rival `st` (F6)** — `adoptInk` (`useSession.ts:553`) writes the index unguarded and runs
  ABOVE `source.restore`, so a frame whose board is later refused has already re-inked the
  room. *"the board everyone is still playing on decides the colours, so once in a while
  somebody's pencil changes."* **This costs the family more than it costs the walk**: at HEAD a
  re-ink is a 190° hue jump nobody is watching; with five pencils it is a person going from
  green to pink in front of you. The family should ask for `adoptInk` to be guarded (never
  reassign an index already agreed locally) as a substrate row in the multiplayer seam.
- **an evicted binding (F5)** — `IDENTITY_CAP = 8` (`playerIdentity.ts:98,142`) evicts the
  least-recent room, so you return as a new id with a new index. *"come back to a board you
  left a long while ago and you may be handed a different pencil. the writing you already did
  keeps the old one."*

---

## 8 · The shape the numbers cut

```
  THE WHEEL                              THE ROW, AT SIXTEEN PEOPLE
  (reserved arcs hatched, sticks ·)      (five pencils, the tick is the second axis)

        0°                                 ● brave-otter        you
    ////////\\\\                           ● tragic-mockingbird
  //            · amber 48.5°              ● keen-heron
 //                \                       ● wild-lemur
 /                  \\ green 124.5°        ● olden-marten
|////                 |                    ● swift-vole        |
| teal 200.4° ·       |                    ● bold-finch        |
 \\\\\               /                     ● quiet-ibis        |
  \\      · violet  /                      ● merry-stoat       |
   \\  276.4°     //                       ● handy-newt        |
     \\\ · pink  //                        ● sober-crane       ||
        332.4°                             ● lively-shrew      ||
                                           ● noble-tern        ||
  free 147.3° of 360 · five fit            ● hardy-vole        ||
  the sixth is 0.091 ΔE from the           ● clever-wren       ||
  fifth, and that is two people            ● windy-owl         |||
  who look the same
```

```
  THE TICK ON A DIGIT                      WHAT THE LOBBY SAYS
  (dpr3, the deal counter's hand)          (M16, and every letter in the hand's cut)

   ┌──────┬──────┬──────┐                  you're the green pencil
   │  7   │  3   │  5   │                  green pencil and one tick
   │      │      │  |   │                  green pencil and two ticks
   └──────┴──────┴──────┘
     amber  green  amber                   NOT "green pencil, two ticks" —
            (no    (one                    U+002C is NOT in patrickhand-subset
            tick)  tick)                   (index.css:94-96). A comma here mints
                                           a ransom note. Say "and".
```

---

## 9 · Cost, honestly

- **Tokens**: 5 × 2 arms = **10 declarations**, not the charter's seven new hue-locked tiers.
- **`check-ink-pressure`**: **does not govern this.** Its three scopes (light/dark/print) gate
  the GRAPHITE ramp, one armed sublabel and the SHIP4 census; a peer ink is on none of them.
  The pricing a tin needs is a NEW gate — `probe/instruments-family-law-tin.mjs` is it, and it
  reads the token file rather than a formula, so it keeps telling the truth when the tin moves.
- **The consumer map is one line**, and this is the estate's own gift: `inkFor` is the sole
  producer, `--color-user-ink` the sole binding. The re-cut touches `playerIdentity.ts:68-70`
  and nothing else in the render path.
- **Four test files pin the walk's exact string** and break on a table:
  `useSession.test.ts:127-132` and `:338`, `useJoinWash.test.ts`, `useStagingBridge.test.ts`,
  `posters.test.ts`. That is the true code cost and it is bookkeeping, not risk.
- **The tick** is a new drawn mark. Reuse, do not invent: `DifficultyTally.vue`'s stroke
  (`TALLY_BOIL 0.6`, grain-baked poses, `generateLineBoilFrames`, opacity-swapped on the shared
  beat). `filterBudget` stays 9 by construction — the tally adds no live filter and neither
  does this. The tick is `aria-hidden`: the cell's accessible name already names the author
  (R5's measured `Row 1, column 4, tragic-mockingbird's entry 7`), and the roster row already
  carries the slug, so a tick that spoke would be W3's second-region defect wearing a picture.

---

## 10 · Kill conditions

| condition | reading |
|---|---|
| exhaustion arrives early against "16+ within reason" unless twelve are free | **MET, and worse than stated.** Twelve free do not exist; five do, so the first sharer is player 6. The family's answer must be that sharing is good, not that it is rare. |
| the second lap must be distinguishable | **MET — the lightness step is dead.** The clustering law breaks on 5/6 pencils (worst margin −0.064 light, −0.087 dark); a chroma step breaks on 3/6. No colour axis carries sharing on this paper. |
| a tick on a DIGIT must clear the wobble law and the cell's accessible name | **CLEARED.** The tally's own pre-baked stroke satisfies the wobble law with no new filter; `aria-hidden` plus the existing author name satisfies a11y. Drawn and read back at dpr3 both engines (`frames/tick-on-a-digit-dpr3.png`). |
| five crayons or six | **Five assumed** (`--color-crayon-{green,orange,rose,blue,gold}`), and it does not matter: the instrument reads all 29 reserved hexes from `index.css`, so a sixth crayon simply re-runs the gate. If §3's accent law adds an arc, the stick that moves is **violet (276.4°)** — it sits 13.5° off `user-ink` and has the least room of the five. |
| the family law green by construction | **CLEARED** for five, and note it is *not* the binding constraint. ΔE is. |

---

## 10b · Prior art (background only — the verdict above came off this tree)

The categorical-palette literature caps a distinguishable set near six to eight and then says
to reach for SHAPE or TEXTURE rather than more hues; the ceiling past that is reported as
cognitive (subitizing) rather than perceptual, which is why a bigger palette does not buy a
bigger room. That is the same shape this lane measured on this product's papers (six on the
whole wheel, five under the family law), arrived at independently, and it is the same cure —
the tick is the texture axis the literature points at. Cited as corroboration only; every
number in this record is re-derived on this tree.

- <https://www.y42.com/blog/color-rules-data-visualization>
- <https://arxiv.org/pdf/2508.17460>
- <https://arxiv.org/pdf/2103.06084>
- <http://vrl.cs.brown.edu/color>

---

## 11 · Recommendation

**ADJUST.** The family's centre is right and now proved: the palette IS a finite designed
object, running out IS a designed state, and the allocator IS tin order. What the measurements
take away is the number twelve and the second colour axis, and they take both away on the
product's own bytes rather than on argument. Cut the tin to **five** — `#b24f00 #5f7d00
#008086 #5a61ce #a5439a` light, `#ff9a62 #a0c942 #00d0d9 #a4b1ff #f48ce6` dark, worst AA
4.55:1 / 8.68:1 on four grounds in both engines, min ΔE 0.145 / 0.139, both gates green by
construction — and move sharing onto the drawn tick, which is the estate's own tally idiom, is
free of the filter budget, survives print and forced-colors where colour does not, and scales
without a cap so the owner's "16+ within reason" is answered by 5 × N rather than by a bigger
tin. Two things must ride the spec or the cure is half: the cursor ring's `stroke-opacity`
0.55 → 0.80 (the 3:1 floor the whole estate fails today, measured here for the first time), and
a guard on `adoptInk` so a rival frame cannot change a person's pencil in front of the room.
Say it without a comma.

---

## 12 · Files

`probe/` — `tin-cut.mjs` (the first cut), `tin-arms.mjs` (capacity, ΔE, the drawn pressures,
the incumbent control, the crayon dark law), `tin-forks.mjs` (the three forks priced),
`tin-widen.mjs` (two widening levers, both refuted), `tin-final.mjs` (pinned bands, both
sharing axes), `tin-size.mjs` / `tin-ceiling.mjs` / `tin-size-nouser.mjs` (the size sweeps),
`tin-five.mjs` / `tin-five-margin.mjs` (the tin as cut), `instruments-family-law-tin.mjs` (the
two-gate instrument), `paltin.config.ts` (the scratch Playwright config — a copy of
`playwright.config.ts` with `webServer` dropped and `baseURL` 127.0.0.1:4245; it runs from the
scratchpad beside the spec, which is the only place `@playwright/test` resolves).

`proto/` — `tin-tokens.css` (five, the recommendation), `tin-tokens-six.css`,
`tin-tokens-twelve.css` (the charter's own, kept so the instrument can go on reddening on it).
The live spec is `scratchpad/paltin/tin.spec.ts`; it patches nothing on disk — `page.evaluate`
clones the real roster row and sets `--color-user-ink` inline, exactly as `:style="p.ink"` does.

`out/` — every run's stdout. `frames/` — two crops, 61.5 KB total:
`roster-16-five-pencils-light.png` (25.4 KB, cited §7: sixteen people, five pencils, eleven
ticks, the product's own component) and `tick-on-a-digit-dpr3.png` (36.1 KB, cited §8 and §10:
the tick under a written digit at dpr3, chromium).
