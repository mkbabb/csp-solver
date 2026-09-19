# PASS-2 SYNTHESIS · MRK-ABS · One visible hand

Section §5 wobble law · §6 focus rings (registry-v1 conv 62, ADVANCE). Synthesizer: Fable
5.1. Inputs: `../research/MRK-ABS/README.md` (17 sections, closed forms checked against pass
1's DOM readings to 3 dp), `../CHAIR-RULINGS.md`, the pass-1 synthesis and critique, the r0
R3/R6 censuses, the owner's frames. Read-only on the product. The frontend-design two-pass
method was followed: plan → tell review → spec. The five forks the research named are each
decided below with the number that decides them.

---

## 0 · Plan, then the tell review

**Tokens.** Colour: `--color-focus-sketch` light `#3a7bc4` (crayon-blue's ink tier, kept) and
its dark arm `var(--color-crayon-blue)` = `#6aabeb` (an alias, zero new hex, law 23; the
crayon's own dark arm, law 18). Painted: token 4.29 card / 4.19 page light, 7.70 / 7.86 dark;
board ring 3.62 light / 6.44 dark at 0.9, ~3.68 / ~6.52 at 0.95. Grounds `--color-card`,
`--color-background`. Geometry, ONE frozen constant set exported from `pencilConfig.ts`:

```
RING_GEOMETRY = Object.freeze({
  wanderUnits: 5.4,   // maxDisplace in ghost units — the invariant IN the geometry, size-free
  inset: 0.86,        // the ring is drawn at 0.86 × cellSize, centred: a mark INSIDE the square
  kW4: 0.4430,        // shape constant of the DECLARED window W4 (four edges, middle 80%, pooled)
})
```

CSS pair, authored once: `--focus-ring: 2px solid var(--color-focus-sketch)`,
`--focus-offset: 3px`.

**Type.** None. No rendered string; the woff2 subsets are untouched.

**Layout.** Two surfaces, one hand, and the board's mark moves INSIDE its square:

```
  ON THE BOARD (drawn, static)                OFF THE BOARD (the token)
  ┌───────┬───────┬───────┐                   ┌────────────────────────────┐
  │       │       │       │  the rule is      │   ┌──────────────────┐     │  2px solid, offset
  │       │ ,---. │       │  the box edge;    │   │ [ normal ] chip  │     │  3, one blue per
  │       │( 5   )│       │  the ring sits    │   └──────────────────┘     │  theme, same-frame,
  │       │ `---' │       │  0.78px clear of  │      the only ring off     │  square corners
  ├───────┼───────┼───────┤  it at 16×16,     │      the board             │  (an outline traces
  │       │       │       │  5.5px at 4×4     └────────────────────────────┘  its element's own
  └───────┴───────┴───────┘  (one f, three boards)                            radius, never mints)
```

**Principles.** (1) The wander is a constant in the geometry (`maxDisplace = σ/k` is EXACTLY
size-free), so one number serves every board and σ is a statistic of a window, declared in the
gate. (2) The ring never enters the neighbour's cell AND never shares ink with the rule: the
guard scores the neighbour (boundary C) and the inset keeps the ring off the rule's band
(boundary B ≥ 0) — because in dark the two inks read 1.86:1 where they meet. (3) Off the board
there is one focus colour per theme, one width, one offset, arriving in the same frame, and
the browser's ring appears nowhere. (4) An outline traces its element's own `border-radius`; a
focus rule may not mint one. The memorable thing per surface: on the board, a hand-drawn mark
INSIDE a ruled square where a redrawn square used to sit; off it, one blue ring in the whole
product.

**Tell review.** The generic answers are the Tailwind ring (`outline: 2px solid #2563eb`,
offset 2, on `*:focus-visible`), a per-size roughness table, and a "make it round on focus"
radius. Departures, each for a reason in the record: the ink is the crayon's ink tier (9.6°
and 0.084 chroma from the stock blue); the offset is 3 because the tongue's `HandDrawnOutline
:outset` is 3; the board is exempt because its page is drawn; the per-size table is refused
(one constant, one deleted branch); and the inset is not decoration — it is the only lever of
nine priced that clears the rule at 16×16 (stroke 7→5 fails at −0.868 px, σ at the band floor
fails at −0.944, both together −0.455; `f ≤ 0.911` is the first GREEN). What the mirror removed
this pass: the fade (two class strings), the two minted radii, the reactive constants no tuner
can move, and the "spread 4.2%" comment.

---

## 1 · §5 · the wobble law (spec, pass-2 delta)

### 1.1 The law, re-derived from the geometry

> The ring's wander is one number in ghost units: `maxDisplace = RING_GEOMETRY.wanderUnits =
> 5.4`, exactly, at every board size (`roughness = wanderUnits / (0.015 × f × cellSize)` makes
> the library's `roughness × len × 0.015` collapse to the constant). The ring is drawn at `f =
> 0.86` of the cell, centred. σ is a statistic of a WINDOW: on W4 (all four edges, the middle
> 80% of each, residual to the nominal line, pooled) it is `5.4 × 0.4430 = 2.392` units, and
> the gate says so.

Why W4 and not r0's W1: W1 (arc 0.02–0.22, chord residual) has CV 34.6%, W4 has 14.3%; both
were reproduced to 3 dp offline from the library alone. The pass-1 "spread" (6.14% on W1) is
sampling error of a CV-35% statistic at n = 16/81/256, not a defect; on W4 it is 1.54%. One
window for the fit AND the verdict, or G-ABS-2 is circular — so the grid's own σ is re-taken
on W4 in the same commit and the ratio row is re-based against it (r0's R3-a reported MOVED;
diff proposed under `instruments/`). The seeds are fixed (`seed + 500 + pos × 7`), so the gate
is deterministic — born-RED and born-STABLE.

### 1.2 The inset, and what it buys (both boundaries, 1280×800)

| f | A (nominal box) | B (rule's inner ink) | C (neighbour) | inset px 4×4 / 9×9 / 16×16 |
|---|---|---|---|---|
| 1.00 (pass 1) | +0.233 | **−1.357 RED** | +1.823 | 0 / 0 / 0 |
| 0.911 | +1.593 | +0.003 | — | minimum GREEN |
| 0.90 | +1.761 | +0.171 | — | 3.96 / 2.72 / 1.53 |
| **0.86** | +2.373 | **+0.783 GREEN** | — | **5.55 / 3.81 / 2.14** |

Phone (393×699, 16×16): B at f = 1.00 reads −0.779; at 0.86 ≈ +0.45 px (ARITHMETIC: 1.60 units
× 365/1300) — GREEN. The guard is renamed to what it scores: **MA-N, no ring enters the
neighbour** (boundary C, ceiling board 26) plus **MA-R, the ring never shares ink with the
rule** (boundary B ≥ 0 at every board to 16, both viewports). The old MA-C scored a line the
rule had already crossed by 1.59 px before the ring moved; it could not fail on the thing the
owner's frame shows (the blue ring sitting on the dark rule, `r0/r3-marks/frames/
ring-on-grid.png`). The 0.90 lever is banked as the alternate crop for the owner (U-10): 0.86
is shipped because at 16×16 0.78 px is the first margin that reads as air rather than as a
seam, and at 4×4 a 5.5 px inset on a 159 px cell is what a ring drawn around a digit by hand
looks like.

### 1.3 The dark adjacency, the reason the inset is not optional

Where the ring's ink lands on the rule's ink: light 4.11:1, dark **1.86:1** (alias); ring
painted over the rule 3.08 / 1.49. The formal 1.4.11 verdict is against paper (6.44 dark) and
passes; the reader's verdict at 16×16 at night is that the ring dissolves into the rule for
the 1.36 px they share. Under the inset the two marks never meet, so the sentence in the law
is "the ring sits inside the rule" rather than "the ring may touch the rule".

### 1.4 The one deleted line, priced exactly

`gridPaths.ts:52 const cellSegments = boardSize >= 16 ? 2 : 4` → `4`. Resident `d` bytes at
16×16: **58,761 B → 114,263 B** (57.4 → 111.6 KiB), once per deal into the LRU. Segments 6
(212,050 B) refused: the spread gain in the geometry is 0.

### 1.5 States on the board (unchanged in structure)

| tier | trigger | paint | motion |
|---|---|---|---|
| 1 hover | pointer, no focus | graphite 5 / 0.65 / fill 0.06 | none |
| 2 selection | `input:focus-visible`, every pointer | `--color-focus-sketch`, stroke 7, **0.95** (MRK-WASH graft: +0.06 painted, no clearance cost), fill 0.08 | `ghost-draw-on 180ms var(--ease-ghostDraw) backwards` (unchanged) |
| 3 conflict | `.is-invalid` | teacher-red, unchanged | unchanged |
| 4 peer cursor | `.is-peer-cursor` | peer ink 4 / 0.55 / dashed, unchanged | unchanged |

Every tier rides the inset geometry — the hover sketch, the conflict and the peer's cursor
become marks inside the square too. `.cell-peer` stays a CSS box at 7%: its edge reads 1.08 /
1.10 from painted bytes; R3-a's wash clause is struck (`instruments/r3a-wash-clause.diff`, the
r0 row MOVED). The chair's §6.11: this family's dark alias moves gate 2 by −0.03 dark, 0.00
light, no verdict changes; the binding arm is LIGHT (2.04 at 50%, 3.74 at 100%) and the row is
MRK-LIVE's to carry (one 0.70 rim value clears both themes).

### 1.6 The constants' home (fork 5)

A frozen module const (`RING_GEOMETRY`) exported from `pencilConfig.ts`, imported by
`gridPaths.ts`. It DELETES: two `BoilConfig` interface fields, two `DEFAULT_BOIL_CONFIG`
entries, the reactivity edge (no tuner slider reads them, and the geometry is inside
`useBoilCache(["cellRects", …])` where a mutation could never reach a dealt board anyway),
and a type obligation on every future `BoilConfig` literal. The LRU key stays as is — the
constants are frozen, so no key term is needed.

### 1.7 The three comments, rewritten from measurement

- `pencilConfig.ts`: "the wander is size-free by construction (maxDisplace = σ/k exactly);
  W4 σ reads 2.4007 / 2.3784 / 2.4154 at the product's seeds (spread 1.54%), 2.3922 at n=4096".
- `pencilConfig.ts`: "against the grid rule's own W4 σ at n = 16/48/96 — re-taken in the same
  window in the same commit; ratios quoted from that run", never r0's n=1 row (which printed
  9×9's 1.443 in 4×4's slot).
- `gridPaths.ts`: "58,761 B → 114,263 B at 16×16 (57.4 → 111.6 KiB)".
- `pencilConfig.ts`: the clearance names its boundaries — "B +0.783 px at 16×16 desktop
  (+0.45 phone), C +1.8 px; the law's ceiling is board 16 on A, board 26 on C".

---

## 2 · §6 · focus rings (spec, pass-2 delta)

### 2.1 The graded law

> ON the board, focus wears the house hand (tier 2). OFF it, focus wears the token: `2px
> solid var(--color-focus-sketch)` at `outline-offset: 3px`, per theme, arriving in the same
> frame, tracing its element's own corners. The browser's own ring appears nowhere. One
> system because they share the ink (the crayon's ink tier and its dark arm), the rank (≥3:1
> on every ground the product paints) and the rule that nothing else is blue on touch.

### 2.2 The token, authored once (unchanged from pass 1, proven by negative control)

```css
@layer base {                                  /* replaces `outline-ring/50` at index.css:445 */
  :root { --focus-ring: 2px solid var(--color-focus-sketch); --focus-offset: 3px; }
  :focus-visible { outline: var(--focus-ring); outline-offset: var(--focus-offset); }
  .cell-native-input:focus-visible,            /* the board keeps the hand */
  .gallery-viewport:focus-visible { outline: none; }   /* spoken-gallery §3.7: one owner */
  @media (forced-colors: active) { :focus-visible { outline-color: Highlight; } }
}
.dark { --color-focus-sketch: var(--color-crayon-blue); }   /* #6aabeb, an alias, law 23 */
```

(0,1,0) inside `@layer base`: every bespoke geometry rule still wins (the (0,4,0) sweep buried
the toggle's ring to zero painted px). Nothing is registered with `@property`: the estate has
zero `@property` rules and no JS reads this token; registering `--color-focus-sketch` as
`<color>` would make it interpolable — adding a transition on the property this family is
removing one from. The `index.css:219` comment is rewritten to the painted numbers above and
names its dark arm's reading (R6 law-probe R1 goes GREEN on this route as worded).

### 2.3 The fade, cured at its two carriers (fork 3)

Tailwind v4's `transition-colors` lists `outline-color`; CSS cannot subtract a property. The
carriers are exactly two shipped stops (`.ctrl-btn`, `OptionSelector.vue:52`, 150 ms;
`.attribution-trigger`, `AttributionCard.vue:45`, 200 ms) plus two DEV-only. Cure: both class
strings become `transition-[color,background-color]` (the chip's hover lift is kept; a bare
`transition-none` would kill it). No new constant, nothing in `MOTION` — the covenant's
preferred shape. G-ABS-4 then says "one colour, same-frame" and names
`instruments/arrival.probe.ts` (first sample already the token, both engines, every stop).
Pass 1's `GameControlPanel.vue:190` blame is withdrawn: that utility is on a section heading.

### 2.4 The radius law (fork 4)

> An outline traces its element's own `border-radius`; a focus rule may not mint one.

Two rules mint one: `HandwrittenLogo.vue:547` (0.35 rem; the trigger has no base radius) and
`GameCard.vue:439` (0.5 rem; `.game-card` has no base radius, and `.live-face-slot` is
`overflow: hidden; border-radius: inherit`, so focusing the deck rounds the projected live
board's clip corners by 8 px — an undeclared pixel). Both DIE. The house draws square corners
(HandDrawnOutline radius 0; the auto-radius read was deleted as out of family), so the deck's
ring goes square and the live-face clip stops changing on focus. Declared DELTA: the focused
deck card's ring corners 8 px → 0 and the live board's clip no longer rounds on focus; one
crop, and the note that the goldens are blind to an 8 px corner at `maxDiffPixelRatio 0.02`
(the chair's §6.2 thin-line reasoning), so the crop is the evidence, not the golden.

### 2.5 The bespoke rules, disposed (pass-2 readings)

| rule | measured (ring band) | under the law |
|---|---|---|
| `HandwrittenLogo.vue:544` | **2.70 / 2.69**, RED both engines | DELETED (with its radius); token 4.19 light / 7.86 dark |
| `DrawerTab.vue:151` dashed | 4.48 / 4.42, green; 16–25/44 samples change (a dashed ring declares itself) | DELETED; token, same offset 3 — one idiom |
| `GameCard.vue:436` `.game-card.is-center` | **2.69** RED; reach 6, air 9.59, headroom 3.59 (HEAD, now measured) | REWRITTEN to the token pair (published by `aria-activedescendant`); reach 5, headroom **4.59**, WHOLE; radius deleted |
| `StagingBand.vue:431` `.staging-face` | 3.14 light / 3.97 dark (webkit 3.18 / 4.00) — already clears | REWRITTEN to the token pair — an IDIOM row, not a contrast row; the face keeps carrying the ring |
| `GameGallery.vue:1450` `.guard-face` | byte-identical declaration; unreached by any automation in two passes | REWRITTEN to the token pair; the prototype MUST arm it once by hand (digit → wordmark → arrow to another game → Enter) |
| `DarkModeToggle.vue:740` | offset **54 px desk / 12 px phone** — a RANGE | colour only → `var(--focus-ring)`; the ornament offset is W2 §2.4's and stays, declared as a range |
| UA stops (`.ctrl-btn`, `.icon-btn`, `.info-btn`, `.attribution-trigger`, masthead links) | chromium 3.67–3.72, **webkit 2.15** (band instrument; r0's figure recovered) | covered by the base rule; `outline-style: auto` appears nowhere |

G-ABS-3's red set, precisely: every UA stop in WebKit (2.15), the wordmark (2.70), the deck card
(2.69). The dashed tongue and the two faces are in the cure for one hand, not for the floor.

### 2.6 The instrument (graft to every family claiming a ring number)

RING BAND, banked at `../research/MRK-ABS/instruments/ring-band.probe.ts`: sample the
outline's own painted band (four strips on the band's mid-line, 11 points along the middle 60%
of each side); keep samples with ΔRGB > 12 between unfocused and focused; ink = median of the
CHANGED samples, ground = the same pixels before; a row is the ring only if the ink matches the
computed `outline-color` composited over the measured ground at its own alpha within ΔRGB ≤ 24.
The annulus form returns the washi tooltip on `.info-btn` (18.10 / 17.61) and 1.04 on a clipped
deck card; both fixes are non-optional.

### 2.7 Mobile

The token is 2 px at every viewport. Dock sheet open (settle ≥ 700 ms; `.drawer-case`
`overflow: visible`, real clipper `.controls-card` `overflow: auto`): 22 focusables, 18
Tab-reachable, 3 `display: none` (no zero-size hazard); tightest ordinary control clears the
clipper by 8.39 px against the token's 5. The full-width sticky `.icon-btn` overruns its clipper
by 32.2 px at HEAD — W2's mechanic; named in the gate as the one declared clip, never asserted
WHOLE. Tongue in its portrait-shut berth `[289,540,92,48]` takes the token (measured, chromium).
Two DEV-only stops (`.tuner-toggle`, DebugToggle) are subtracted BY NAME from every census
taken on a dev server, or the census runs on a built preview after W8 §8.1 returns dist.

### 2.8 Copy and motion

No copy. No motion minted and one removed: the token ring arrives same-frame (the fade is
cured at its carriers); the board keeps `ghost-draw-on 180ms`. PRM identical. Nothing enters
`MOTION`. `RING_GEOMETRY` is geometry, not time, and lives beside `BOIL_CONFIG`, not in it.

---

## 3 · Plan (files, order, what dies)

Start from the pass-1 worktree's diff (`git -C .claude/worktrees/wf_e58b4764-0fc-36 diff`, 10
files, +112/−27), replayed into a FRESH worktree off HEAD; the pass-1 worktree is the record.

1. `pencilConfig.ts` — `ringSigmaUnits`/`ringK` OUT of `BoilConfig`/`DEFAULT_BOIL_CONFIG`;
   `export const RING_GEOMETRY = Object.freeze({ wanderUnits: 5.4, inset: 0.86, kW4: 0.4430 })`
   with the §1.7 comments (window named, boundaries named, ceiling named).
2. `gridPaths.ts:41-70` — `cellSegments = 4`; the rect at `(x + (1−f)/2·cellSize, y + …,
   f·cellSize, f·cellSize)`; `roughness = wanderUnits / (0.015 × f × cellSize)`; the bytes
   comment corrected. LRU key unchanged.
3. `index.css` — `:445` sweep dies; the `@layer base` block; `.dark` alias; `:219` comment
   rewritten with the dark arm's reading.
4. `OptionSelector.vue:52`, `AttributionCard.vue:45` — `transition-[color,background-color]`.
5. `HandwrittenLogo.vue:544`, `DrawerTab.vue:151` — DELETED (the logo's radius with it).
6. `GameCard.vue:436` (radius deleted), `StagingBand.vue:431`, `GameGallery.vue:1450`,
   `DarkModeToggle.vue:740` — rewritten to `var(--focus-ring)` / `var(--focus-offset)` (the
   toggle keeps its ornament offset).
7. `gameCell.css:242-244` comment replaced (pass 1); tier 2 stroke-opacity 0.9 → 0.95.
8. Gates (§5) in the same commit; the grid's W4 σ re-taken in the same commit.
9. `r0/r3-marks` rows R3-a (window, wash clause) reported MOVED via diffs under
   `pass2/synthesize/MRK-ABS/instruments/` — never written in r0.
10. Dist-bound suites after W8 §8.1 returns dist — sequenced, not skipped.

Dies: one board-size branch; two focus rules and two minted radii; the `outline-ring/50`
sweep; two reactive constants and their interface fields; one 150 ms and one 200 ms
outline fade; the false modality comment, the false dark-mode comment, three false numbers.
Nothing new is mounted.

---

## 4 · Prototype brief (pass 2)

**Build.** Fresh worktree off HEAD; `git apply --3way` the pass-1 diff; then the §3 delta
(~30 lines net). Serve from `<worktree>/web/frontend` on **127.0.0.1:4239** (`--strictPort`;
next free in 4230–4249 if taken) with a two-line scratch vite config under
`pass2/prototype/MRK-ABS/` spreading the worktree's `vite.config.ts` with `cacheDir:
'<worktree>/.vite-cache'`. TRAP (this lane's pass-2 research hit it): vite resolves the scratch
config's plugin imports from the config file's nearest `node_modules` — symlink
`node_modules` beside the config to `<worktree>/web/frontend/node_modules`, or the server
never boots. Scratch playwright config from `../research/MRK-ABS/probe/pw.config.ts`
re-pointed. Deck route is `?view=gallery` (a URL-truth param; there is no router). Kill the
server and delete `.vite-cache/` before returning.

**Crops (≤4, ≤150 KB, dpr3, cited):** (1) one focused cell with its four neighbours at 16×16,
1280×800, DARK, chromium, at f = 0.86 beside `r0/r3-marks/frames/ring-on-grid.png` at the same
scale — the lozenge cured, the two inks apart; (2) the same cell at f = 0.90 (the alternate
lever for U-10); (3) the deck's centre card focused, light, webkit — square corners, the
token, the live face's clip unchanged; (4) the armed `.guard-face` focused, dark — the one
surface no automation has reached. Everything else is a number.

**Censuses to re-run (copied and re-pointed, never in r0):** `hue-census.mjs` (the alias must
appear as an alias row; diff against `hue-census-HEAD.txt` otherwise byte-identical);
`law-probe.mjs` (R1 GREEN on this route; L1 9); the r0 wobble probe on W4 at 4×4/9×9/16×16 —
the RING and the GRID in the same window, n = all cells / all rules; `budget.probe.ts` 9/9/9,
ghosts 16/81/256, every ghost `filter: none`; the r0 heading census unchanged;
`check-copy-register.mjs` 0/0; `lint:theme-tokens`, `lint:theme-selectors`, `lint:ink`,
`lint:motion` green.

**Measure (both engines unless stated):** `probe/k-window.mjs` on the prototype's seeds (W4
σ per board ±5% of 2.392; n = 4096 unit at ±0.5%); `probe/clearance.mjs` at f = 0.86 on B and
C, desktop AND phone (B ≥ 0 for 256/256 at 16×16); a DOM-vs-library identity test (the
focused cell's resident `d` equals `wobbleRect` recomputed offline, same seed — "pose 0 IS
the shipped artifact"); `probe/adjacency.mjs` re-run under the inset (the two bands disjoint
at 16×16 both themes — the 1.86 reading becomes moot, not passed); `instruments/
ring-band.probe.ts` on every tab stop × two themes (≥ 3:1; `isTheRing` true on every authored
stop); `instruments/arrival.probe.ts` on every stop (first sample = token); the deck at
`?view=gallery` (reach 5, headroom 4.59, WHOLE, one owner, viewport `outline-style: none`;
`.live-face-slot` corner radius identical focused vs blurred); the dock sheet open at 393×699
after 700 ms (every stop WHOLE against `.controls-card` EXCEPT the sticky `.icon-btn` by name);
the toggle's ring painted > 0 px at 1280 and 393; the phone frame trace on a quiet box only
(load < 2) with the PRM control; `spoken-gallery.spec.ts` 16/16 (its `ringOwner` helper reads
the token's outline — untouched on this route), `access.spec.ts` 2.1/2.2/2.3, `a11y.spec.ts`
3.5, the forced-colors arm.

**Success is:** W4 σ 2.392 ±5% at all three boards and ±0.5% at n=4096; B ≥ +0.78 px desktop
and ≥ +0.4 px phone at 16×16, 256/256; DOM `d` = library `d` for every focused cell sampled;
every stop ≥ 3:1 from the ring band, both engines, both themes (expected 4.19–4.29 light,
7.70–7.86 dark; board 3.68 / 6.52); arrival same-frame on 11/11 shipped stops; one outline
colour per theme in the tab order, `auto` nowhere; deck headroom 4.59, WHOLE, square; the
guard face measured on a live surface; 9/9/9 and 16/81/256; hue census alias-only delta;
the suites green; dist suites green once W8 §8.1 returns.

---

## 5 · Born-RED gates this family lands with

- **G-ABS-1 the ring and the rule in one window** — ring W4 σ ÷ grid W4 σ at the same size
  and viewport, all cells / all rules, ∈ [0.5, 2.0] at 4×4 / 9×9 / 16×16. RED at HEAD (ring
  0.146 / 0.073 / 0.067 on r0's window; re-based to W4 in the same commit, the r0 row MOVED).
- **G-ABS-2 one constant, its window in the sentence** — W4 σ per board within ±5% of `5.4 ×
  kW4 = 2.392` at the product's seeds, AND a unit on the primitive (n = 4096, ±0.5%). RED at
  HEAD (segments 2 at 16×16: a 30% split) and deterministic (fixed seeds).
- **G-ABS-3 focus contrast from the ring's own band** — every tab stop ≥ 3:1 (SC 2.4.13's
  change-of-state ratio, cited as such), chromium + webkit, light + dark, `isTheRing` true on
  every authored stop. RED at HEAD: WebKit UA 2.15 on every UA stop, wordmark 2.70, deck 2.69.
- **G-ABS-4 one colour, same-frame** — every `:focus-visible` stop and the deck card compute
  the same outline colour per theme, `outline-style: auto` nowhere, and `arrival.probe.ts`
  reads the token at its FIRST sample on every shipped stop. RED at HEAD (five colours, seven
  `auto`; RED on the pass-1 build at `.ctrl-btn` 150 ms and `.attribution-trigger` 250 ms).
- **G-ABS-5 the dark arm** — `.dark` computes `--color-focus-sketch` = `--color-crayon-blue`
  (an alias row in the hue census, zero new hex). RED at HEAD.
- **G-ABS-6 MA-R, the ring never shares ink with the rule** — at 16×16, both viewports, both
  themes, the ring's painted band and the rule's are disjoint (boundary B ≥ 0) for every cell.
  RED at HEAD and RED on the pass-1 build (−1.357 px desktop, −0.779 phone).
- **G-ABS-7 MA-N, no ring enters the neighbour** — boundary C ≥ 0 for every cell at every
  shipped board (the guard that names the hazard it scores). GREEN at HEAD by 1.823 px at
  16×16; kept as the ceiling's witness (board 26).
- **G-ABS-8 pose 0 is the shipped artifact** — the focused cell's resident `d` equals
  `wobbleRect` recomputed offline with the same seed and `RING_GEOMETRY`. RED at HEAD
  (`cellSegments` differs, `f` differs).
- **G-ABS-9 a focus rule mints no radius** — a source grep for `border-radius` inside any
  `:focus-visible` block returns 0, AND `.live-face-slot`'s computed `border-radius` is
  identical with the deck focused and blurred. RED at HEAD (2 rules; 0 → 8 px on focus).
- **G-ABS-10 the constants cannot be mutated** — `RING_GEOMETRY` is frozen and `BoilConfig`
  has no `ringSigmaUnits`/`ringK` (a `tsc` obligation and a grep). RED on the pass-1 build.
- **G-ABS-11 the dock sheet, opened** — at 393×699 with the sheet settled ≥ 700 ms, every
  Tab-reachable stop's ring is WHOLE against `.controls-card` EXCEPT the full-width sticky
  `.icon-btn`, named as W2's declared clip. RED at HEAD (UA ring; the token untested there).
- Guards that must stay green: 9/9/9 and ghosts 16/81/256; toggle ring painted > 0 px both
  engines and both viewports; spoken-gallery §3.7 one owner + WHOLE (reach 5, headroom 4.59);
  forced-colors outline solid; phone trace 0 > 33 ms on a quiet box; copy 0/0; heading census
  unchanged; hue census delta = the alias row only.

MOVED, not re-cut: r0 R3-a (window; wash clause), diffs banked under `instruments/`. OPEN by
design: the dist-bound run (after W8 §8.1); the quiet-box trace (a condition). U-10: the
owner sees crops 1–4 at the re-look; 0.86 vs 0.90 is the one question put in front of them.

## 6 · Coupling with MRK-LIVE, stated for the agglomerator

INCOMPATIBLE on two axes, not merged here: (i) the token — this route a dark alias (the crayon
follows the crayon into the night, laws 18/23; R1 GREEN as worded; spread 4.52); MRK-LIVE one
value (spread 1.04; R1 MOVED). Both clear 3:1 everywhere; the choice is constancy vs kinship,
and §6's leader states the principle. (ii) geometry — this route insets the ring to 0.86 and
pins segments 4; MRK-LIVE keeps pose 0 at the cell's edge byte-identical to
`generateCellRects`. The inset is gratable onto MRK-LIVE's pose stack (`generateRectBoilFrames`
takes the same inset rect and pose 0 becomes the inset rect's output byte for byte); the
living swap is NOT gratable onto this route without its `:has` cure and the +3 population.
What binds both whichever wins: the dark ring-on-rule adjacency is under 3:1 for either ink
(1.86 alias measured; `#3a7bc4` ≈ 2.8 by arithmetic, unmeasured), and only the inset keeps the
two inks apart at 16×16. The chrome ring is where the routes differ most cheaply: this route
is a CSS outline token (0 components, 0 paths); MRK-LIVE's is a drawn `FocusRing` (one
component, four poses). The agglomerator can take either chrome with either board.
