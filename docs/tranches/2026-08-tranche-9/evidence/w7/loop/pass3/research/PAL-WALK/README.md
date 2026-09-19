# PAL-WALK — PASS-3 RESEARCH (§11c the per-player colour system)

Read-only lane. **No product file touched, no dev server started, no port held (4244 free), zero
crops banked.** Every figure below is a `file:line` fact from the working tree at **`74a2b5d9`**
(the new base) or arithmetic over that tree, re-derived by this lane's own instruments — not
carried from pass 1 or pass 2.

    calc/measure3.mjs          → readings/measure3.json            the census, arcs, walk, ΔE, AA, capacity, §3 sweep
    calc/ring3.mjs             → readings/ring3.json               the §6.6 ring row on every axis the ladder has
    calc/head-vs-walk-ring.mjs → readings/head-vs-walk-ring.json   π for the ring: HEAD's palette vs the walk's
                               → readings/ring3-lightness-escape.json, readings/ring-band-at-055.json

The charter's `evidence/w7/loop/r3/PAL-WALK/` is this directory. Read first: the chair's pass-3
rulings, then the charter. **§6.6 supersedes charter rows 1, 2 and (in part) 3.**

---

## 0 · The three facts that reset this pass before any design

**(a) The chair's §6.6 inverts the ring row.** The charter says hand `gameCell.css:234` 0.55 →
0.80 to §6 and cure `join-language-prm:153` under §6's ruling. The chair rules the other way:
PAL-WALK **ships the ring at HEAD's 0.55**, carries no `gameCell.css` hunk, keeps `:153` green,
and *states which of §6's candidate values its palette survives on*. Rows 1–2 close by deletion;
row 3 survives (`peer-walk.spec` must still read the value off the cascade — it will read 0.55).

**(b) The base moved and the replay is free.** `git diff --stat a8fee1f5..74a2b5d9 -- web/frontend`
is 16 files, and **not one of them is a file PAL-WALK's pass-2 diff touches.** The fold took
`BoardHost.vue`, `DigitCell.vue`, `GameBoard.vue`, `GameControlPanel.vue`, `useGameCell.ts`,
`classifyError.ts`, `check-copy-register.mjs`, `check-font-coverage.mjs`, three e2e specs and two
new unit files. The pass-2 diff takes `index.css`, `gameCell.css`, `playerIdentity.ts`,
`useSession.ts`, `useGameState.ts`, `useSession.test.ts`, `HandDrawnGrid.vue`,
`multiplayer.spec.ts`, `package.json`, `check-pw-projects.mjs`, `ci.yml` + two new files.
**Zero intersection: the replay is a clean apply, no hunk re-cut for the fold's cure.** The two
citations the module makes into fold-touched files both still hold at `74a2b5d9`:
`BoardHost.vue:73` is still `const ink = inkOf.get(id)?.["--color-user-ink"];` and
`HandwrittenGlyph.vue:85` is still `return "var(--color-user-ink, #2563eb)";`.
The copy gate at the new base: **137 files, 0 em dashes, 0 jargon, 0 admitted, lexicon 25, exit 0.**

**(c) The fold gave the DIGIT a spoken channel and left the RING without one.** `BoardHost.vue:84-115`
now computes `cellAuthors` and `authorNameAt(pos)` — "a peer's slug for the cell's accessible name"
— so *who wrote this digit* is now said in words on every pointer. `is-peer-cursor` has no such
channel: it is a class (`DigitCell.vue:212`) bound from `peerCursorInk` (`BoardHost.vue:315`) and
nothing else. Grep over `src/` + `e2e/` for `is-peer-cursor` returns exactly 12 hits: four CSS
rules (`gameCell.css:225`, `:229`, `:323`, `:339`) and the sheet's own header line `:13`, one class
binding (`DigitCell.vue:212`), one prop (`BoardHost.vue:315`) and five test references —
**no aria, no live region, no accessible-name clause anywhere.** The peer cursor is now the one
peer surface in the estate carried by colour alone, and it is the surface whose 1.4.11 reading
fails (§2). That is a new coupling row this pass owns; PLR-PLACE's "NO INK, NO DOT" graft is its
statement of principle.

---

## 1 · The walk re-derived — a THIRD independent implementation, and it reproduces

`calc/measure3.mjs` is this lane's own parse, OKLab, gamut bisection, ΔE and WCAG. Against the
critic's independent census and the prototype's painted bytes:

| row | this lane | pass-2 critic (painted, both engines) |
|---|---|---|
| reserved arcs | `[0,27.1616] [51.1659,108.7459] [133.985,178.6121] [236.3332,275.8809] [279.7172,306.5712] [333.0184,360]` | identical to the module's `RESERVED_ARCS` constant |
| SPAN · STEP | **137.2481° · 52.4241°** | 137.25 / 52.42 ✓ |
| nearest house ink, light | **0.07164** at i=112 vs `--color-solver-ink-3` | 0.07164 at i=112 ✓ |
| nearest house ink, dark | **0.07088** at i=0 vs `--color-crayon-rose` | 0.07088 at i=0 ✓ |
| hands under the reference | **5 light / 3 dark** | 5 / 3 ✓ |
| AA worst light (background/card/popover) | **7.110 / 7.251 / 7.175** all i=35 | 7.098 / 7.270 / 7.164 ✓ |
| AA worst dark | **5.312 / 5.210 / 5.262** all i=115 | 5.310 / 5.197 / 5.270 ✓ |
| selection wash (8% crayon-blue over card) | **6.680 light / 4.660 dark** | 6.69 / 4.61–4.71 ✓ |
| peer-vs-peer at N=8 | **0.02286 light / 0.02260 dark** | 0.0229 / 0.0226 ✓ |
| chroma min/median/max/mean · at cap | **0.07490 / 0.10470 / 0.215 / 0.12434 · 10 of 144** | 0.0749 / 0.1047 / 0.215 / 0.1243 · 10 ✓ |
| min hue gap · duplicate hues | **0.69° · 0** | 0.69° · 0 ✓ |

The colour law is converged. Nothing below disputes it.

### 1a · Charter row 12 — 0.0764, re-derived AT THE CITATION

`index.css` and the module header both say the closest hand keeps "the distance the house's own
two nearest crayons keep from each other (0.0764)". Re-derived:

| pair | ΔE(OK) |
|---|---|
| **crayons only, light arm: `--color-crayon-orange` vs `--color-crayon-gold`** | **0.076410** |
| crayons only, dark arm: the same pair | **0.060481** |
| any two chromatic tokens, light (`--color-solver-ink-5` vs `--color-gold-ink`) | 0.023636 |
| any two chromatic tokens, dark (`--color-orange-ink` vs `--color-gold-ink`) | 0.041993 |
| aliases that are the SAME colour under two names (light) | `--color-teacher-red` ≡ `--color-crayon-rose`, ΔE **0** |

So the cited 0.0764 is **exact and it is the light arm's crayon pair**, and the sentence needs
three words it does not have: *light-arm crayons*. At night the same pair is **0.0605** — and the
walk's dark worst (0.0709) is then ABOVE the reference, not below it. The honest form is one
sentence with both arms in it. The wider claim ("the house's own inks") is false by a factor of
three: two chromatic tokens sit at ΔE 0.0236.

### 1b · Charter row 14 — the 2.9× chroma spread, and whether a floor hand is a colour

Spread **0.0749 → 0.215, ratio 2.8706**, min at **i=38** (not i=4 — that was pass 1's walk),
median 0.1047, 10 of 144 at the cap.

Priced against the family's own test of what a colour is (the census's `CHROMA_FLOOR = 0.06`):
the floor hand sits at **1.248 ×** the threshold the gate uses to call a declaration chromatic.
Its distance from a pure neutral of the same lightness is ΔE **0.0751 light / 0.0748 dark** —
*i.e. the palest hand is as far from grey as the house's two nearest crayons are from each other*.
That is the sentence the module header should carry: **the floor hand is a colour by the same
measure the family uses to decide what counts as one, and by no more than that.** The
`--peer-ring-l` recommendation in §2 must not spend that margin (it does, at α 0.55 — see below).

---

## 2 · THE RING ROW — §6.6's question answered, and a regression nobody has reported

### 2a · The survival table (`calc/ring3.mjs`)

The tier-4 rule paints, on the cell's own ground: `fill` = ink at 0.04 (`gameCell.css:231`),
`stroke` = ink at ALPHA (`gameCell.css:234`). 1.4.11 asks a non-text boundary for 3:1 against
adjacent colour, and a ring has two adjacent colours — its own fill inside, the card outside.
Both priced, over all 144 hands, both arms, at the walk's band (0.44 / 0.65):

| α | light worst (vs own fill) | light under 3:1 | dark worst | dark under 3:1 |
|---|---|---|---|---|
| **0.55 — the chair's ruled ship value** | **2.541** (i=61) | **112 / 144** | **2.360** (i=115) | **144 / 144** |
| 0.60 | 2.810 | 87 | 2.579 | 144 |
| 0.65 — tier 1's hover alpha | 3.116 | **0** | 2.817 | 57 |
| 0.64 | 3.051 | **0** | 2.768 | 57 |
| 0.68 | 3.319 | 0 | 2.969 | 27 |
| **0.69 — the lowest α clearing BOTH arms** | **3.391** | 0 | **3.021** | **0** |
| 0.70 | 3.465 | 0 | 3.074 | 0 |
| 0.80 — pass 2's value | 4.318 | 0 | 3.644 | 0 |

**The answer §6.6 asks for: this palette survives at α ≥ 0.69 on the opacity axis and at nothing
below it.** At 0.65 — the value that would preserve T8-W3 M1's rank exactly — the dark arm fails
for 57 of 144 hands.

### 2b · The mechanism of the M1 collision, measured

| tier | ink | width | α | vs own fill (light / dark) | vs card |
|---|---|---|---|---|---|
| 1 hover | `--color-pencil-graphite` → `--grid-line-color` | 5 | 0.65 | **4.545 / 5.318** | 4.763 / 5.632 |
| 2 focus | `--color-focus-sketch` #3a7bc4 (no dark arm) | 7 | 0.90 | 3.330 / 3.484 | **3.618** / 3.697 |
| 4 peer | the walk's hand | 4 | 0.55 | **2.541 / 2.360** | 2.599 / 2.367 |

Tier 1 clears 3:1 at 0.65 because graphite is a **luminance extreme** at both bands (near-black on
paper, near-white at night). A mid-lightness chromatic hand cannot reach that at the same alpha.
So T8-W3 M1's "lighter than yours on every axis" was written about a graphite ring and reads
across to a colour ring as if alpha were the perceptual variable. It is not. **The peer ring is
the only tier in the estate under 3:1, in both arms, at HEAD's own value.**
(Re-derived at its citation: `index.css:219` claims #3A7BC4 "blends to 3.60:1" over the card at
stroke-opacity 0.9 — this lane reads **3.618**. The comment is right, and it is a vs-CARD number;
against its own 8% fill the same ring reads 3.330.)

### 2c · THE REGRESSION — π for the ring, and it is the finding of this lane

`calc/head-vs-walk-ring.mjs`. The ring at α 0.55, HEAD's incumbent palette (L 0.5 / 0.8, flat
C 0.11, 137.5° walk) against §11c's (L 0.44 / 0.65, `chromaAt`, arc walk), 144 hands:

| palette | light worst · under 3:1 | dark worst · under 3:1 |
|---|---|---|
| **HEAD (incumbent)** | 2.264 · **144 / 144** | **3.591 · 0 / 144** |
| **WALK (§11c)** | 2.541 · **112 / 144** | **2.360 · 144 / 144** |

The light arm's 1.4.11 failure is **pre-existing and the walk improves it** (32 hands recovered).
**The dark arm was compliant at HEAD for every index and the walk breaks it for every index.**
Pass 2's `gameCell.css` comment ("0.55 … failed 1.4.11 for every index: composited on paper the
ring reads 2.28:1") is a light-arm sentence, and it silently omits that the value it was replacing
was fine at night before this band lowered it. **This is a born-RED row §11c owns — not §6's.**
Under the chair's ruling PAL-WALK ships 0.55 and therefore ships this regression unless it cures it
on an axis of its own.

### 2d · The cure that is §11c's own, and it needs no `gameCell.css` hunk

T8-W3 M1 ranks three axes: stroke-width, stroke-opacity, fill-opacity. It does not rank
**lightness** — and lightness is the axis this family already owns (`--peer-ink-l`,
`index.css:162` / `:375`). Give the RING its own band. Solved (`readings/ring-band-at-055.json`,
`readings/ring3-lightness-escape.json`): the ring keeps the hand's hue and takes whatever chroma
sRGB holds at the ring's lightness.

| α | ring band (light / dark) | worst vs fill | worst vs card | min ring chroma | M1 rank |
|---|---|---|---|---|---|
| **0.55** (chair-ruled) | **0.34 / 0.77** | 3.051 / 3.219 | 3.113 / 3.234 | **0.0580** / 0.1178 | intact |
| 0.55 | 0.32 / 0.79 | 3.165 / 3.409 | 3.227 / 3.427 | 0.0546 / 0.1067 | intact |
| 0.64 (still < tier 1's 0.65) | **0.40 / 0.72** | 3.344 / 3.390 | 3.437 / 3.428 | **0.0681** / 0.1224 | intact |
| 0.64 | 0.38 / 0.75 | 3.501 / 3.698 | 3.596 / 3.742 | 0.0647 / 0.1275 | intact |

**Route A — chair-literal, zero gameCell.css, `:153` stays green.** α stays 0.55; the module emits
a second key and `index.css` gains one scalar `--peer-ring-l: 0.34` / `0.77`. Clears 3:1 for all
144 in both arms. **Price, stated:** the palest hand's ring falls to chroma **0.0580** — *under
the 0.06 the family's own census uses to decide what is a colour*. A ring the gate would not
admit as chromatic is a real cost, and §1b's margin is exactly what pays for it.

**Route B — one hundredth of alpha, handed to §6 as a proposal, not a hunk.** α 0.64 (< tier 1's
0.65, so M1's ladder is intact on every axis it ranks: 4 < 5, 0.64 < 0.65, 0.04 < 0.06) with the
ring band 0.40 / 0.72: 3.344 / 3.390 with ~0.35 of headroom and both ring chromas above the
census floor. `join-language-prm:153` would move 0.55 → 0.64, which the chair reserves to §6 —
so Route B is written into the return as §6's option with its numbers, and built nowhere.

**The wiring cost of a ring band is one key, and it is already the shape the estate uses.**
`BoardHost.vue:73` extracts exactly one key (`ink["--color-user-ink"]`) and rebinds it as
`--color-peer-cursor-ink` — so a three-key ink breaks the cursor (pass-2 research measured this).
The ring band does **not** need a third key on the digit's record: `inkFor` returns
`{"--color-user-ink": …, "--color-peer-cursor-ink": "oklch(var(--peer-ring-l) C H)"}` and
`BoardHost.vue:66-79` reads the *second* key instead of re-deriving the first. One extra string
per player, one new scalar with two arms, both the same mechanism `--peer-ink-l` already proves.
`gameCell.css:230-232`'s `var(--color-peer-cursor-ink, var(--color-user-ink))` fallback still
covers the unbound case unchanged.

### 2e · Charter row 3 — `peer-walk.spec.ts:194` (the spec that restates what it measures)

Confirmed at the pass-2 worktree: `const ringOpacity = 0.8;` (`:194`) and `paint(cardCss,
inks[hand.i], 0.04)` (`:198`) — neither read off `.game-cell.is-peer-cursor .cell-ghost-path`.
Under §6.6 the row is unchanged in substance and simpler in fact: read `strokeOpacity` and
`fillOpacity` through `getComputedStyle` on a real cell; the gate then prices **0.55** and must
therefore **assert the true reading, not 3:1** — i.e. it reports the ring's contrast and the
count under 3, and the 3:1 assertion moves to whatever value §6 and this lane's own ring band
land on. A gate that asserts 3:1 against a ring shipped at 0.55 is born dead.

---

## 3 · The gate's next rung: DISCOVER BY RESOLVED VALUE, not by literal syntax

Pass 2's correction was *find the reserved set by chroma, never by a list of names*. This lane's
own instrument bit three times on the rung below it, and `scripts/check-peer-arcs.mjs` (the landed
tier 1, `:92` `HEX_DECLS`) has all three:

| defect | what the gate cannot see | at HEAD | direction |
|---|---|---|---|
| **`var()` aliases** | `--color-teacher-red: var(--color-crayon-rose)` (`index.css:212`), `--color-gold-star: var(--color-crayon-gold)` (`:215`), `--color-pencil-graphite: var(--grid-line-color)` (`:223`) | benign — all three alias tokens whose own hues are already reserved | **UNSAFE**: re-point one alias at a new hex and the walk is green-lit on top of it |
| **`hsl()` declarations** | every non-hex colour in the sheet | benign — 0 chromatic `hsl()` at HEAD (highest non-chromatic chroma **0.00285**, lowest chromatic **0.0956**: the canyon is 33× wide, not a knife edge) | **UNSAFE** for any future hsl-authored accent |
| **no arm scoping** | the gate reads the whole file, `@media print` (`:894`) and `@media (forced-colors: active)` (`:946`) included | benign — both arms are achromatic there (`--color-user-ink: #000` at `:935`) | **SAFE** (a union over arms over-reserves) |

The alias defect is not hypothetical for the *reader* either: resolving the dark arm with only the
dark block's own aliases keeps the LIGHT value for four tokens, moving `--color-gold-ink`'s dark
hue by **12.88°** (82.35 → 95.23) and `--color-orange-ink`'s by **7.58°**. This lane read a dark
peer ring against a *print* graphite before it brace-matched the `.dark` block. Both mistakes are
banked in `calc/measure3.mjs`'s own comments as the instrument's record.

**The sentence for the module and the gate:** *a name is not a colour, a var is not a colour, and
a block is not an arm.*

---

## 4 · The self-binding half — three charter rows closed by reading the code

### 4a · Row 6 — `authored()` and the invite's `?board=` digits: THE CRITIC'S HOLE DOES NOT EXIST

`persistence.ts:207-209`: *"Synthesize a persisted board from a decoded `?board=` — **non-zero
cells become the givens** (a share says 'solve THIS configuration')."* And `useGameState.ts`'s
`authored()` filters `!originalGivenCells.value.has(key)`. **A page opening an invite link claims
nothing: every digit the link carries is a given by construction, and `authored()` excludes
givens.** The pass-2 critique reasoned from the filter without reading the decoder.

The window that *is* real, and it is much smaller: digits the joiner types **locally, between
page load and the first `st` they accept**. Their fate is already decided by the code —
`useSession.ts:762` replaces `ledger.clock` **wholesale** on any `st` with a newer epoch, and the
same handler calls `source.restore` — so the joiner's `[0, self]` stamps and the board they were
about to describe are replaced together. The stamps are meaningful only for **the page that holds
the newest epoch**, which is the room-starter, which is exactly who they are for. Nothing else
survives, and nothing else should. The row closes with **one unit** (a `[0, self]` stamp is
cleared by a newer-epoch `st`) and one sentence in the doc; it does not need a measured window.

### 4b · Rows 7 & 8 — `adoptInk`'s doc vs its code, and agreed-beats-`k`

The doc says an `st` from a non-author *"cannot move the ones it has"*; the code is
`const index = inkAgreed.has(id) ? inkIndex[id] : Math.trunc(raw);` — it moves any id **not yet
agreed**. PAL-TIN's critic found the same hole from the other side. The cheap and true repair is
the doc: **AGREED**. The code's behaviour is correct and wanted (a non-author `st` is the only
way a page learns an unmet id's index; refusing it would leave a peer who left before you sat
down uncoloured), so the sentence moves, not the branch. Row 8 is the same set seen forward:
once agreed, `inkIndex[id]` beats `k` for the same author's later epochs because `fresh`
(`useSession.ts` `const fresh = e[1] !== ledger.epoch[1]`) only clears on an **author** change.
Both are one-line doc edits plus one unit each, in the file that already has `bootPage` /
`hear` / `stFrame`.

### 4c · Row 5 — the unit battery, measured as absent

`grep -c` over the pass-2 `useSession.test.ts`: `authored` **0**, `bindSelfInk` **0**,
`roomHasOthers` **0**, `mint(` **0**, `inkAgreed` **0**, `adoptInk` **0**. The critique's finding
reproduces exactly. These are module-private so the units go through the public surface, which
the file's own harness already provides.

---

## 5 · Zero headroom and §3's renames (charter rows 9, 10, 11)

`calc/measure3.mjs`'s `section3Sweep` drops one hypothetical chromatic token at each of 360
integer hues, re-derives the arcs, re-walks 144, and asks what reds:

| tier-3 assertion | met at HEAD | degrees of the wheel that RED it |
|---|---|---|
| `nearest.dE >= 0.07` | 0.0709 dark (0.0009 of room) | **0 of 360** |
| `underReference <= 5` | exactly 5 light | **94 of 360 (26%)** |

**Safe span: 266°.** So the row the lane owes is precise rather than anxious: the ΔE floor is
robust to a sibling's new token everywhere on the wheel; the *count* assertion is not, and a
quarter of the wheel breaks it. The cure is PAL-TIN's grafted gate shape — **an absolute floor
AND a ratio to a ceiling re-derived from the same file in the same run**: assert
`nearest.dE >= 0.07` (absolute, proven robust) and `underReference` as a **ratio to the count the
house's own chromatic tokens produce among themselves**, re-derived in the same run, rather than a
literal 5. A sibling that lands a token then moves both sides of the comparison and the gate holds.

Row 10 (the capacity rows are upper bounds, `near(8) < 0.05`): state the direction in the row.
The honest pin is `expect(near8).toBeLessThan(0.05)` **plus** a comment naming it a ceiling and
the sentence "an improvement edits this line upward, and that is the point". Measured capacity,
this lane's own (closest pair in a room of N, light / dark): N=2 **0.25269 / 0.25320**, N=3 and
N=4 **0.07576 / 0.07623** (the closest pair of four is already among the first three), N=5
0.02644 / 0.02685, N=8 **0.02286 / 0.02260**, N=12 0.00840 / 0.01043, N=16 **0.00840 / 0.00897**
— reproducing the critic's painted 0.0758/0.0762, 0.0229/0.0226 and 0.0084/0.0090 to the digit.
Largest room whose closest pair still clears a floor: **0.0764 → 2 hands · 0.05 → 4 · 0.02 → 9**,
both arms identical. Note the shape the row must state: **N=3 and N=4 are the same number**, so
"four hands" costs nothing over three, and the fall is between four and five (0.0758 → 0.0264).

Row 11 (tier 1's check 2 re-implements the walk, `STEP = 0.5` leaves it green): the module cannot
be imported from node (`playerIdentity.ts:18` imports `./useUndoHistory` extensionless; measured
in pass 2). Cheapest honest form: **check 2 declares itself a decoy** — rename it to what it
proves (*the arcs' complement is non-empty and a golden step over it produces no duplicate*) and
move the law to tier 2, which already carries it and already reds on `STEP = 0.5`.

---

## 6 · Surfaces, tokens and primitives — the concrete list a spec needs

### Tokens this family touches (all anchors at `74a2b5d9`)

| token | light | dark | where |
|---|---|---|---|
| `--peer-ink-l` | `0.5` → **0.44** | `0.8` → **0.65** | `index.css:162` / `:375` |
| `--peer-ring-l` (**proposed, new**) | **0.34** (Route A) / 0.40 (Route B) | **0.77** / 0.72 | beside `--peer-ink-l`, same two-arm form |
| `--color-user-ink` | `#2563eb` | `#60a5fa` | `index.css:151` / `:372`; `#000` in print/forced-colors at `:935` |
| `--color-peer-cursor-ink` | bound inline only | — | `BoardHost.vue:78`; consumed `gameCell.css:230,232` |

### Surfaces the ink is painted on

| surface | file:line | how the ink arrives |
|---|---|---|
| every board cell's digit | `BoardHost.vue:311-312` ← `authorInk` (`useSession.ts:402-413`) | `:style` record; the glyph strokes `var(--color-user-ink, #2563eb)` at `HandwrittenGlyph.vue:85` |
| the peer-cursor ring | `BoardHost.vue:66-79`, **`:73`** | extracts ONE key, rebinds `--color-peer-cursor-ink` |
| the roster row + slug | `GameControlPanel.vue:1153`, `:1171`, colour at `:1673` | `:style="p.ink"` / `"r.ink"` |
| the roster swatch | `GameControlPanel.vue:1689-1694` | `background: var(--color-user-ink)`, `aria-hidden` |
| the washi tape · the deck posters | `GameBoard.vue` tape, `PosterBoard.vue:204` | pass-through `authorInk` |
| **the cell's accessible name (NEW at the fold)** | `BoardHost.vue:96-115` `cellAuthors` / `authorNameAt` | the digit's author, spoken — the ring has no equivalent |

### Primitives to reuse, named

| primitive | where | use |
|---|---|---|
| `newer` / `wins` total order | `useSession.ts:98`, `:106` | the ink agreement's epoch scoping — mint no new order |
| `bootPage` / `hear` / `stFrame` | `useSession.test.ts:185`, `:224`, `:235` | every unit §4c asks for |
| `chromaAt` gamut bisection | pass-2 `playerIdentity.ts` | re-used unchanged for the RING's own band at its own L |
| `intoArc` | pass-2 `playerIdentity.ts` | the printed string IS the mechanism; keep |
| `seedFor(peerId)` hoisted | PAL-TIN, `playerIdentity.ts:53` (worktree `-58`) | GRAFT: kills `p.id.length` as a seed; `slugFor` calls it at `:57` |
| the gate shape: absolute floor AND re-derived ratio | PAL-TIN (registry §3.19) | GRAFT: the cure for §5's 94° |
| the RING BAND `isTheRing` sampler | MRK-ABS's critic (registry §3.9) | GRAFT: ink = median of CHANGED samples, verified against computed style — the only honest way to read a 4px ring |
| the 1.4.11 painted-line law | ACC-FIVE's critic (registry §3.11) | GRAFT: `hsl(0 0% 15%)` = (38,38,38) **paints (49,49,49)** — every token-arithmetic ring number in §2 OVER-reports; the prototype must re-read painted and keep headroom |
| the luminance AA sampler | PLR-SELF (`PLR-SELF.md:185-187`) | GRAFT: darkest-byte by WCAG luminance, not most-chromatic-pixel — cures the critic's own i=1/i=35 caveat |
| the LIGHTNESS-NOT-HUE finding | PAL-TIN (registry §3.19) | GRAFT: stated once at the section; it is also the mechanism of §2d |
| the print / forced-colours ground | `index.css:894`, `:935`, `:946` | already proven: a room prints in one ink |

---

## 7 · Sketches

**(a) The ladder as 1.4.11 reads it — the collision, and where the ring band lands.**

```
 contrast vs the ring's own fill, worst of 144, DARK arm
 6 ┤                                   ╭── tier 1 hover  (graphite, α .65)   5.318
 5 ┤                                   │
 4 ┤                      ╭── tier 2 focus (#3a7bc4, α .90)                  3.484
 3 ┤═══════════════════ 1.4.11 floor ══╪═══════════════════════════════════  3.000
   │   peer ring, α .55, band .65      │   ▲ 2.360  ── 144/144 UNDER
 2 ┤   ●────────────────────────────────   │
   │                                       ╰─ peer ring, α .55, RING band .77 → 3.219
 1 ┤                                          (M1's rank untouched: 4<5, .55<.65, .04<.06)
   └────────────────────────────────────────────────────────────────────────
      HEAD's band (L .8) read 3.591 here.  §11c's band is what broke it.
```

**(b) Where the walk actually lives, and what §3 can do to the count assertion.**

```
   0°────27.2  51.2────────108.7  134.0────178.6   236.3──275.9 279.7─306.6  333.0──360°
   ██████▒▒▒▒▒▒██████████████▒▒▒▒▒██████████▒▒▒▒▒▒▒▒██████████░██████████▒▒▒▒▒██████
   rose/red     orange·gold·ink    green·teal        blue·focus  violet      solver-1
   ██ reserved — the landed gate sees 29 HEX declarations (17 light, 12 dark); resolving the
      three var() aliases gives 19 + 19. Both fold to the SAME 6 arcs at ±13°.   ▒▒ OPEN, 137.25°
   step 52.42° of ARCLENGTH ─ 144 hands, min gap 0.69°, 0 duplicates

   a 30th chromatic token dropped anywhere in the wheel:
     nearest ≥ 0.07   ████████████████████████████████████████  360/360 survive
     underRef ≤ 5     ███████████████████████████░░░░░░░░░░░░░  266/360 survive (94 RED)
```

**(c) The two channels a peer now has, and the one the ring does not.**

```
   the DIGIT someone wrote                    the CELL someone points at
   ┌────────────┐                             ┌────────────┐
   │     7      │  colour  → authorInk        │     ⌐  ¬   │  colour  → peer-cursor ink
   │            │  words   → "brave-otter,    │            │  words   → ✗ nothing
   └────────────┘            cell 4 3"        └ ⌊      ⌋ ──┘            (5 CSS rules, 1 class,
     BoardHost.vue:96-115 (the W7 fold)         gameCell.css:229-241     no aria, no live region)
     ──────────── two channels ────────────     ─────── one channel, and it is the one under 3:1
```

---

## 8 · Risks, ranked

1. **Route A spends §1b's whole margin.** At α 0.55 the light ring band must reach L 0.34, and the
   palest hand's ring falls to chroma 0.0580 — under the family's own 0.06. A gate that calls a
   declaration chromatic above 0.06 would not call that ring a colour. Either the recommendation
   states it plainly as the price of the chair's ruling, or Route B goes to §6. **Do not hide it.**
2. **Every number in §2 is token arithmetic and ACC-FIVE's law says it over-reports.** A 4px
   antialiased stroke never reaches its token. The prototype must re-read the ring with MRK-ABS's
   `isTheRing` sampler on painted bytes, both engines, and the band must be chosen with headroom
   for the shortfall — not at 3.001.
3. **The dark-arm ring regression is §11c's, and it lands in the fold whatever §6 rules.** If the
   lane ships 0.55 with no ring band, the tranche ships a surface that was 1.4.11-compliant at
   night and is not. That is a LEDGER row, not a gap.
4. **Zero headroom, still.** `nearest` 0.0709 against 0.07 is 0.0009. §5 shows the floor survives
   §3; it does not show it survives a *band* change. Any move to `--peer-ink-l` re-opens it.
5. **A second ink key is a second extraction site.** `BoardHost.vue:73` is the file the fold just
   touched (+23 lines). The ring-band route changes which key that line reads; the pass-3 diff
   must re-read the fold's version, not the pass-2 one.
6. **Four and eight hands are still unphotographed (U-10).** The owner's question is a picture and
   there is no picture. Two crops, both themes, four hands and eight — and the frame must show the
   floor hand (i=38) beside a cap hand, because §1b's sentence is what the owner is ruling on.
7. **The relay arm and the phone cell are still unmeasured**, and the ring band is a *rendering*
   change: the phone's dock sheet is `--color-popover` ground (5.262 dark), which no ring row has
   been priced against.
8. **`peer-walk.spec` cannot assert 3:1 at a 0.55 ship value.** Writing that assertion is how this
   family ships a born-dead gate; the gate reports the reading and asserts what actually holds.
