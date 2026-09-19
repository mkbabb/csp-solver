# PAL-WALK — THE WALK OVER OPEN ARCS (T9-W7 pass 1, RESEARCH)

Section §11c the per-player colour system · §3's peer exception · §12. Lane port 4244.
Read-only on the product: every colour change below is a Playwright `addStyleTag` overlay on a
live page. Nothing under `src/`, `e2e/` or `scripts/` was touched, nothing was committed.

**RECOMMENDATION: ADJUST, and the adjustment is large enough that the family's own second half
must be dropped.** The arcs work. The wax chroma does not, and it takes the arcs down with it.
The numbers are in §3 and §4; the one-paragraph verdict is §9.

---

## 1 · What the tree actually says (verified, file:line)

| claim in the charter | on this tree |
|---|---|
| `playerIdentity.ts:64-70` `inkFor` = `oklch(var(--peer-ink-l) 0.11 (i×137.5)%360)` | **true** — `playerIdentity.ts:68-70`, one line, one binding |
| `:12` the shipped header quotes 5.26/9.56 over 40 | **true** — `playerIdentity.ts:12` |
| `:78` "never reassigned" — true of mint, false of `adoptInk` | **true** — `playerIdentity.ts:78-79` vs `useSession.ts:554` |
| `:98` `IDENTITY_CAP = 8` | **true** — `playerIdentity.ts:98`, pruning both halves at `:137-143` |
| `index.css` `--peer-ink-l` two arms | **true** — `:162` (0.5) and `:375` (0.8) |
| `useSession.ts:537` self `ink: {}` | **true**, and there is a **second** self-skip the charter does not name: `useSession.ts:406` (`authorInk` `if (author === selfId.value) continue;`) and a third at `:556` (`adoptInk`). **k[self] is a three-site change, not one.** |
| `useSession.ts:553` `adoptInk` unguarded | **true** at `:554` (`inkIndex[id] = index`), inside the `st` arm at `:763` which runs **above** `source.restore` at `:782` |
| `gameCell.css:229-241` cursor ring stroke-opacity 0.55, fill 0.04 | **true** — `gameCell.css:225-241`, stroke-width 4, `--color-peer-cursor-ink` with `--color-user-ink` as fallback |
| `HandDrawnGrid.vue:493-512` the join trace at 0.95/0.65/0.45 | **true** — `:493-512`, `stroke="var(--color-user-ink)"`, stroke-width 8, nothing mounted at `joinProgress === 0` |
| `index.css:164-169` the crayon dark law | **true**, and it is the wax's law, not the peers' |
| the reserved set is 29 hexes | **true** — 17 in `:root`, 12 in `.dark`; `derive-HEAD.txt` §1 lists every one with its hue |

Two more that bear on the design and were not in the brief:

- **The print and forced-colours twins outrank any peer ink.** `index.css:925-936` (print) and
  `:946-952` (forced-colors) are `@layer base` rules on `.glyph-svg path`. Measured under the
  overlay: print `rgb(0,0,0)`, forced-colours `rgb(0,0,0)`, both engines (`probe/p3-*.txt`).
  A layered `!important` beats an unlayered one, so even an `!important` overlay cannot reach
  them. **k[self] is safe in both modes by construction.**
- **`peerCursors` is keyed by the SENDER** (`useSession.ts:751`, the `cur` arm writes
  `peerCursors.value[from]`), so self never enters it. Giving self an ink cannot mint a ghost
  ring on your own cell — but `BoardHost.vue:73-76`'s `if (!ink) continue` stops being the
  "skip self" guard its comment half-implies and becomes only the "row has gone" guard.

---

## 2 · The reserved set, the arcs, and the anchor set cleared

Derived, not chosen, by `proto/arcWalk.mjs` (reads `index.css` at run time with the r0
instrument's own regex) and printed by `proto/derive.mjs` → `derive-HEAD.txt`.

- **Chroma**: the mean crayon chroma re-derived from the five light wax hexes
  `#2dc653 #f4a236 #e8315b #4a90d9 #c99a2e` = **0.1658** → the charter's 0.166. Confirmed.
- **Guard**: the family law's own `MIN_SEP = 12°`, used as the arc half-width. The prototype
  builds at **12.25°** — the law plus 0.25° of numerical margin, because a walk built at exactly
  12 sits on the law's boundary and a float that lands at 11.9999 reds its own instrument.

**The six merged reserved arcs, 212.8° total (not the charter's ~205°):**

    [  0.0,  26.2]  26.2   rose / red-ink / teacher-red
    [ 52.2, 107.7]  55.6   orange / gold / solver-ink-5, both themes
    [135.0, 177.6]  42.6   green / green-ink / solver-ink-4
    [237.3, 274.9]  37.5   crayon-blue / focus-sketch / YOUR blue / solver-ink-3
    [280.7, 305.6]  24.9   progress-ink / solver-ink-2
    [334.0, 360.0]  26.0   solver-ink-1

**The open arc is 147.2° at guard 12 (144.75° at 12.25), not ~155°** — and it is **five disjoint
arcs**, one of which is a 5.8° sliver between progress-ink and your blue that no index of the
first sixteen ever reaches (`sweep-HEAD.txt` §E).

**The anchor set cleared**: the five crayons and every tier the accent law names — `crayon-{green,
orange,rose,blue,gold}` both themes, `{gold,red,green,orange}-ink` (light only; dark aliases them
onto the wax), `--color-user-ink` both themes, `--color-focus-sketch`, `--color-progress-ink` both
themes, `--color-solver-ink-1..5` both themes. `--color-teacher-red` and `--color-gold-star` are
`var()` aliases and carry no hex of their own. **Re-derivation is automatic**: the module reads the
file, so a hex that moves moves the arcs. §7 prices the two ways the set can move.

---

## 3 · The step — and the charter's stated form is the one that dies first

The charter says "the hue steps by 137.5° modulo the open arc". Taken literally, 137.5° of
arclength on a 147.2° circle is a **9.7° backward crawl**, not a golden-angle walk:

| variant | min separation over 4 / 8 / 16 / 24 / 40 (requested hue) |
|---|---|
| literal `137.5 mod OPEN` | **9.75 · 9.75 · 1.03 · 1.03 · 1.03** |
| golden FRACTION of the open arc (`OPEN / φ²` = 55.29°) | 21.48 · 13.28 · **5.07** · 3.13 · 1.94 |

Everything downstream uses the scaled variant, which is the only honest reconstruction of "a
golden-angle walk on a shorter circle". **The charter's literal form is refuted on its own
arithmetic and must not be carried into the spec.**

**And the number the family was told to face is not the number.** The charter predicted ~9° at 16
players from ~155° of wheel. 9.2° is the EVEN-SPLIT ceiling of a 147.2° arc (147.2/16) — a value a
quantised palette could reach and a walk cannot. A golden walk's minimum gap over the first 16 is
`OPEN × 0.03472`, which on 147.2° is **5.11°**, measured 5.07°. The family must face **5.1°, not
9°** — and then §4 takes even that away.

---

## 4 · The engine's bytes — where the family dies

Canvas read-back, 144 indices, four grounds, both engines, both themes
(`probe/palwalk.spec.ts` → `probe/p1-*.txt`, `probe/bytes-*.json`). The shipped walk runs through
the identical code as the control, so nothing inherited is reported as caused.

### 4.1 Contrast holds; the margin narrows

| | arc walk @ 0.166 | shipped @ 0.110 (control) |
|---|---|---|
| light vs `--color-background` | **4.73:1** | 5.22:1 |
| light vs `--color-card` | **4.85:1** | 5.35:1 |
| dark vs `--color-background` | **8.65:1** | 9.71:1 |
| dark vs `--color-card` | **8.46:1** | 9.50:1 |

0/144 under AA 4.5:1 on all four grounds, both engines. The family clears AA — with 0.23 of
headroom in light where the incumbent has 0.72.

### 4.2 The gamut does not hold the wax chroma, and the engine rotates the hue to say so

| | arc walk @ 0.166 | shipped @ 0.110 |
|---|---|---|
| engine gamut-mapped, light | **95/144** | 38/144 |
| engine gamut-mapped, dark | **102/144** | 14/144 |
| mean chroma actually painted, light | **0.1335** (min 0.0907 — *below* today's 0.110) | 0.1070 |
| max hue shift over the first 16, light | **15.33°** | 4.41° |
| mean hue shift over the first 16, light | 5.39° | 0.60° |

Identical to two decimals in chromium and webkit. Prior art names the mechanism: browsers clip
channels rather than reduce chroma, and clipping shifts hue. **Only 44/144 hues can hold 0.166 at
L 0.5 and 39/144 at L 0.8** (`ceiling-and-ring.txt`, exact bisection on the gamut test). So
"peers at the wax's chroma" is delivered on under a third of the wheel and is *flatter than today*
at its worst.

### 4.3 The law is GREEN as requested and RED as painted

`probe/family-law-arcwalk.mjs` (the r0 law, same MIN_SEP, same regex, same exit code, walk read
from this family's source) — `i1-both.txt`:

    HEAD, r0 instrument unchanged .................. RED, 37 collisions, exit 1
    arc walk, requested hues, first 16 ............. GREEN, closest approach 12.25°, exit 0
    (also GREEN over 24 and 40 — the construction does not decay with room size)

`probe/painted-law.mjs` re-runs the same law on the hue the ENGINE PAINTED — `painted-law.txt`:

    arc walk, PAINTED hues, light .................. RED, 14 collisions, both engines
    arc walk, PAINTED hues, dark ................... RED, 1 collision, both engines

The worst of them is the exact collision the family exists to prevent: **index 2 requests 236.2°
and is painted 248.03°, which is 1.30° from `--color-crayon-blue` (dark) and 3.39° from
`--color-crayon-blue` (light)**. Index 15 lands 4.69° from the same wax. A walk constructed to sit
12.25° clear of every reserved ink is pushed back inside by the engine's own gamut mapping,
*because of the chroma the same family chose*.

Control: the shipped walk's painted law reads 36 collisions where its requested law reads 37 —
the rotation at 0.110 is small enough not to matter. **The rotation is the chroma's, not the
engine's.**

### 4.4 Separation, painted

| room | arc walk painted (light) | arc walk painted (dark) | shipped painted (light) |
|---|---|---|---|
| 4 | 13.73° | 25.03° | 52.5° |
| 8 | 9.56° | 5.10° | 32.5° |
| 16 | **3.39°** | **2.38°** | 12.21° |
| 24 | 1.24° | 1.21° | — |

**The room size the walk honestly serves** (`room-size-and-risk.txt`, painted bytes, the family
law's own 12° floor applied peer-to-peer): **7 players.** At 9° it is still 7–8. The shipped
full-circle walk serves **20 (light) / 21 (dark)** at the same floor. The family trades twenty
legible peers for seven.

### 4.5 The crops

- `frames/board-minsep-dpr3-light.png` (15.8 KB, dpr3, chromium) — two digits in adjacent cells at
  the minimum-separation pair (indices 2 and 15, painted 3.39° apart): `4` written by you in your
  room ink, `6` written by a peer. **They are the same blue.** The overlay forced the two local
  peers onto that exact pair so the crop is the worst case, not a sample.
- `frames/roster-minsep-light.png` (16.5 KB) — the same pair in the roster. Two rows, one colour
  system (no Tailwind blue beside a generated oklch — §5 item 7 is answered), and the same blue
  twice. F10's orphaned `you` at the far edge is visible and is PLR-PLACE's, not this lane's.

### 4.6 3:1 at the drawn pressures — an INHERITED failure this family did not cause

| drawn at | arc walk light | shipped light | arc walk dark | shipped dark |
|---|---|---|---|---|
| cursor ring 0.55 | **2.22 / 2.25 — 144/144 under 3:1** | **2.28 / 2.31 — 144/144 under** | 3.54 / 3.36 pass | 3.60 / 3.66 pass |
| join trace 0.95 (join) | 4.32 / 4.42 pass | 4.74 / 4.85 pass | 8.29 pass | 8.73 pass |
| join trace 0.65 (rejoin) | 2.63 — 91/144 under | 2.74 — 130-144/144 under | 4.50 pass | 4.61 pass |
| join trace 0.45 (leave) | 1.91 — 144/144 under | 1.94 — 144/144 under | 2.76 — ~100/144 under | 2.81 — ~135/144 under |

**R5's F3 read 0/144 under the 3:1 non-text floor because it read the ink OPAQUE.** Priced at the
opacity it is actually drawn at, the peer cursor ring fails WCAG 1.4.11 in light mode for every
index, today, at HEAD, in both engines. So do the rejoin and leave washes. This is a P0 the wave
owns and PAL-WALK inherits; the family moves it by 0.06 (2.28 → 2.22), which is noise beside the
failure itself.

Its cure is one token and does not need this family: at L 0.5, stroke-opacity **0.70 reaches
3.05:1** (0.55 → 2.31, 0.85 → 4.05); holding 0.55 would need the band at L 0.30
(`ceiling-and-ring.txt`). Either is a decision for §3/§12, not a colour-system change.

---

## 5 · The eight questions, answered

1. **THE RESERVED SET** — §2. 29 hexes, six merged arcs, 212.8° reserved, 147.2° open (144.75 at
   the 12.25 build guard), five arcs, narrowest 5.8°. Anchor set stated; re-derivation automatic.
2. **THE FAMILY LAW** — GREEN by construction on requested hues over 16, 24 and 40; **RED on
   painted bytes** (14 light / 1 dark). solver-ink-5 (0.2°), your-blue (0.4°) and teacher-red
   (5.8°) are gone by construction — and crayon-blue comes back at 1.30° by gamut mapping.
3. **SEPARATION** — 4: 13.73° · 8: 9.56° · 16: **3.39°** · 24: 1.24° (painted, light). The walk
   honestly serves **7**. The crop shows the 16-player pair; they are one colour.
4. **AA** — 4.73 / 4.85 light, 8.65 / 8.46 dark, 0/144 under 4.5:1, both engines. Gamut: 95/144
   light and 102/144 dark are mapped; 44/144 (light) and 39/144 (dark) hues can hold 0.166; byte
   duplicates 5/144 light and 9/144 dark, **0 within the first 16**.
5. **3:1** — §4.6. Ring fails in light at 0.55 for the family AND for the incumbent. Trace passes
   at its 0.95 ceiling and fails at 0.65/0.45, for the family AND the incumbent.
6. **YOU JOIN** — solo is **byte-identical**, both engines: 0 elements carrying a
   `--color-user-ink` declaration, root ink `#2563eb`, cell ink `#2563eb`, glyph stroke
   `rgb(10,10,10)` — identical strings before and after the overlay (`probe/p3-*.txt`). In a room:
   A's own row and A's own cells resolve `oklch(0.5 0.166 26.41deg)` while the peer's cell keeps
   `oklch(0.5 0.166 180.91deg)`. `--color-user-ink` becomes the room ink on your own page and stays
   `#2563eb` solo. Print `rgb(0,0,0)`, forced-colours `rgb(0,0,0)` — both survive.
7. **THE ROSTER** — one system in the list, measured: both rows resolve `oklch(…)`, neither
   resolves `rgb(37,99,235)`. **I2 GREEN under the overlay, both directions, both engines**
   (A's own swatch = what B paints for A, and B's = what A paints for B).
8. **THE SUBSTRATE'S OWN BOUNDS** — §6.

---

## 6 · What the palette inherits, and the one new exposure it opens

Named, not cured (F5/F6 are the multiplayer seam's).

- **F5 eviction** (`playerIdentity.ts:98,137-143`) — a ninth room evicts a binding; you come back
  with a new id, so a new slug AND a new ink index. Re-derived today: I5 RED on webkit
  (`collided: true`), **GREEN on chromium in this run** — where r0 recorded RED on both. One run,
  not a refutation; the row is non-deterministic on chromium and the record should say so.
- **F6 `adoptInk` before belief** (`useSession.ts:554` inside the `st` arm at `:763`, above
  `source.restore` at `:782`) — re-derived today, both engines: index 1 → 6, 137.5° → 327.5°, on
  one page only. I4 RED.
- **THE NEW EXPOSURE.** Today your own digits are the one thing on the board that never changes
  colour, because nothing is bound on them. `k[self]` ends that: with self bound, F6 re-inks **your
  own handwriting** on a frame the board later refuses, and F5 re-inks it on a return. This family
  does not create F5/F6 — it removes the accident that was shielding you from them. Any spec that
  binds k[self] must land beside a guard on `adoptInk`, or say out loud that your digits may change
  colour mid-game.
- **What it costs to build**: three sites, not one — `useSession.ts:537` (`mint`), `:556`
  (`adoptInk`) and `:406` (`authorInk`'s self-skip), plus a `roomId` condition so solo stays
  byte-identical. `--color-user-ink` has **24 consumer sites** (R2 §6); binding it at a document
  level would re-ink the gallery dot (`GameCard.vue:620`), the cell-name anchor
  (`GameBoard.vue:1213`) and the poster stills — the binding must stay per-element, exactly where
  `authorInk` already puts it.
- **I3 stays RED** (0 candidates, both engines, re-derived today). PAL-WALK adds no chrome; the
  head's mark is PLR-PLACE's row and this lane does not claim it.
- **No rendered string is minted**, so no woff2 re-cut and no `check-font-coverage` price.
  `filterBudget` is untouched — the ink is a var rebinding, not a filter. W3's live regions,
  M19 and the 44px floor are unaffected.

---

## 7 · The reserved set moves — priced

`room-size-and-risk.txt`. Requested-hue separations at the 12.25° build guard:

| scenario | hues | OPEN | sep@8 | sep@16 |
|---|---|---|---|---|
| HEAD | 29 | 144.7° | 13.05° | 4.99° |
| §3 lands: `user-ink` and `progress-ink` go kin | 25 | 146.0° | 21.31° | 8.14° |
| **a sixth anchor anywhere in the two wide arcs** | 30 | **120.2°** | 10.84° | 4.14° |
| if the solver rainbow were not reserved | 19 | 189.3° | 17.07° | 6.52° |

Two readings. The kill condition "a walk that clears five anchors may not clear six" is **real and
priced: a sixth anchor costs 24.5° of open wheel**. And the apparent windfall from §3's proposal is
mostly luck — the reliable floor is `OPEN × 0.03472` either way (146.0 × 0.03472 = 5.07°); the
8.14° is an accident of where the arcs happen to fall between two walk points, and an accident is
not a design guarantee.

---

## 8 · Sketches

**A — the wheel as the tree actually cuts it** (212.8° reserved, 147.2° open, five arcs)

    0°        26°      52°            108°   135°        178°              237°  275° 281°   306°      334°  360°
    ├─RESERVED─┼──open──┼───RESERVED───┼─open─┼──RESERVED──┼──── open ──────┼RESV─┼op┼─RESV─┼── open ──┼─RESV─┤
      rose      26.0     orange/gold    27.2   green/s4     59.7 (7 of 16    blue  5.8 prog   28.4       s1
      red-ink            solver-5              solver-4     land here)       focus  ^ solver-2
                                                                             YOU    the sliver nobody reaches

**B — what the engine does to it at C 0.166** (light, the pair the crop shows)

    requested   i=2  ──────────────► 236.2°        i=15 ──────────────► 231.2°     (4.99° apart)
                        gamut map ↓ 11.8°                  gamut map ↓ 13.4°
    painted     i=2  ──────────────► 248.0°        i=15 ──────────────► 244.6°     (3.39° apart)
                                        ▲                      ▲
                                        └── crayon-blue 249.3° ─┘   the arc was supposed to hold 12°

**C — the binding, three sites and one condition**

    mint()          ink = self && !room ? {} : inkFor(k[self])     useSession.ts:537
    adoptInk()      same condition, same shape                     useSession.ts:556
    authorInk       drop the self `continue` when a room exists    useSession.ts:406
                          │
                          └─► .player-row :style   ─┐
                              cell :style           ├─► --color-user-ink (per element, never :root)
                              join trace :style     ─┘
    solo            nothing bound anywhere  →  #2563eb, byte-identical (measured)
    print / forced  @layer base outranks all of it  →  #000 (measured)

---

## 9 · Verdict

**ADJUST — keep the arcs, drop the wax chroma, and state the room size out loud.** Three of the
family's four claims survive contact with the tree. The reserved-arc construction is sound, derives
itself from `index.css`, and makes the r0 family law GREEN over 16, 24 and 40 indices where HEAD is
RED 37 times — no peer is ever a crayon, a verdict, the machine or you, and that is worth having.
`k[self]` is real: solo stays byte-identical to the byte, the room board binds your own ink, I2
goes GREEN in both directions in both engines, and print and forced-colours are untouched because
`@layer base` outranks any binding. What does not survive is chroma 0.166. The band cannot hold it
— 95 of 144 hues in light and 102 in dark are gamut-mapped, only 44 can reach it at L 0.5, the mean
chroma actually painted is 0.134 and its worst is flatter than today's 0.110 — and the mapping
rotates hue by up to 15.33°, which walks index 2 back to 1.30° from crayon-blue and makes the
PAINTED law RED 14 times. The chroma destroys the arcs. Two numbers must also be corrected in
public: the open arc is **147.2°, not 155°**, and a golden walk's minimum over 16 is **5.1°
requested and 3.39° painted, not 9°** — 9.2° is the even-split ceiling a quantised palette could
reach and a walk cannot. At the family law's own 12° floor the arc walk honestly serves **seven
players**, against the incumbent's twenty; the dpr3 crop shows the 16-player pair as one blue in
adjacent cells. So the spec this family can support is: **the arc walk, at a PER-HUE chroma of
`min(0.166, the in-gamut ceiling)`** — which keeps hue exact (no rotation, so the constructed law
is the painted law), lifts the mean chroma from 0.110 to 0.134 and *improves* light contrast to
5.37/5.50 (`perhue-cap.txt`, and it improves the full-circle walk too, so it is worth taking even
if the arcs are killed) — **plus an honest stated capacity of seven to eight peers, above which the
walk repeats a hue rather than pretends**. If the owner's "16+ within reason" is binding, the arcs
cannot be had at 16 and this family must yield the 16-player case to a quantised sibling; if seven
is enough for a shared worksheet, the arcs are the better colour. Either way the peer cursor ring
is failing 1.4.11 in light at HEAD, for every index, and that is the wave's to fix.

---

## 10 · How to replay

    # dev server (lane port)
    cd web/frontend && npx vite --host 127.0.0.1 --port 4244 --strictPort

    # the arithmetic (run bare — a pipe eats the exit code)
    cd <this dir>/proto && node derive.mjs && node sweep.mjs && node ceiling-and-ring.mjs
    node room-size-and-risk.mjs && node perhue-cap.mjs

    # the law, HEAD and arc walk
    node ../../../r0/r5-player-mark/instruments-family-law.mjs   # RED 37, exit 1
    node <this dir>/probe/family-law-arcwalk.mjs                 # GREEN, exit 0
    node <this dir>/probe/painted-law.mjs                        # RED on painted bytes

    # the engine (copy probe/*.spec.ts + proto/walk.json to a scratch dir with
    # web/frontend/node_modules symlinked; configs in probe/)
    cd web/frontend && npx playwright test --config <scratch>/palwalk.config.ts
    npx playwright test --config <scratch>/ceiling.config.ts
    npx playwright test --config <scratch>/crops.config.ts --project=chromium

Caveat on method: the canvas 2D context is sRGB, so the read-back is the sRGB truth. On a P3
display CSS may paint wider and the gamut-mapping counts would fall. r0's census used the same
method, so the two are comparable; a P3 arm is a real open question for a later pass.

## 11 · Files

| file | what |
|---|---|
| `proto/arcWalk.mjs` | the family's source — reserved set, arcs, walk, colour maths |
| `proto/derive.mjs` → `derive-HEAD.txt` | the reserved set, the arcs, both step variants, gamut, contrast, the first sixteen |
| `proto/sweep.mjs` → `sweep-HEAD.txt` | guard / per-theme / chroma sweeps + the shipped-walk control |
| `proto/ceiling-and-ring.mjs` → `ceiling-and-ring.txt` | exact per-hue gamut ceilings; what 3:1 costs the ring |
| `proto/room-size-and-risk.mjs` → `room-size-and-risk.txt` | the honest room size; the reserved set moving |
| `proto/perhue-cap.mjs` → `perhue-cap.txt` | the per-hue cap on the full-circle walk |
| `proto/walk.json` | the walk table the probes read |
| `probe/family-law-arcwalk.mjs` → `i1-both.txt` | I1 re-run, HEAD and arc walk |
| `probe/painted-law.mjs` → `painted-law.txt` | the law on painted bytes |
| `probe/painted-control.mjs` → `painted-control.txt` | the shipped walk's own rotation (control) |
| `probe/palwalk.spec.ts` + `palwalk.config.ts` | P1/P2 bytes, P3 the live overlay |
| `probe/chroma-ceiling.spec.ts` | P5 the engine's chroma sweep and ceiling |
| `probe/crops.spec.ts` | P4 the two crops |
| `probe/bytes-*.json`, `ceiling-*.json`, `p1-*.txt`, `p3-*.txt`, `p5-*.txt` | raw engine readings |
| `frames/board-minsep-dpr3-light.png`, `frames/roster-minsep-light.png` | 32.3 KB total |

The overlays are in `probe/palwalk.spec.ts` (`overlayCss`) and `probe/crops.spec.ts` (`overlay`) —
attribute-matched CSS on the inline ink string plus one `body:has(.players-leave)` rule for
`k[self]`. Replayable as they stand; no source patch, no worktree.
