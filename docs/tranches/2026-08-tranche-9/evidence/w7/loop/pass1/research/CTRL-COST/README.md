# CTRL-COST · THE CONSEQUENCE LADDER — pass-1 research record

T9-W7 §10 with §15 at its centre (§1 §2 §8 §14 inside) · marks M01 M03 M04 M05 M12 M13.
Lane port 127.0.0.1:4233 (dev) · 127.0.0.1:4234 (the static page, repo root).
Read-only on the product: every change in this lane is an injected stylesheet, a DOM re-parent
inside the page, or a file under this directory. Nothing under `src/`, `e2e/` or `scripts/`
was touched, no worktree was cut, nothing was committed.

    TREE      7b0610cc (+ the untracked w7/w8 evidence trees)
    ENGINES   playwright chromium + webkit, headless, own scratch config (never the estate's
              default — it starts :3000)
    CELLS     desk 1280×800 fine · dock 390×844 coarse · landscape 900×500 and 844×390 coarse
              · the seam sweep at 390×844 / 375×812 / 430×932
    SETTLE    the dock sheet SLIDES — every open-sheet read is taken ≥950ms after the tap
    FRAMES    3 crops, 52 KB total, largest 31.8 KB

---

## 0 · The answer first

**DEVELOP, with two amendments and one unpaid debt.** The ladder does what it said it would:
the eight-name census collapses to four names in ONE voice at ONE rank, the §1 instrument goes
from born-RED 4/4 to GREEN 4/4, the bar's 89.6% burial of the `players` group is answered by
deletion rather than by chrome, the confirm costs **zero layout shift on four sides in both
engines at three cells**, and the desk rail's at-a-glance read improves from **2 of 5 settings
to 5 of 5**. What it does not do is shorten the card: it is **+84px at 1280, +103px at 390,
+149px at 900×500**, and at 430×932 that height walks the sheet's top edge **41px up into the
wordmark** — from +18.11px clear to −22.73px of overlap, which is M03's own seam, re-opened by
this family. The two amendments are: tier 2 must carry its own undo on every viewport (with the
sheet up the ribbon is `inert`, measured, so `fill` writes 44–56 cells and its reversal is not
one tap away), and the band names must be sticky or I3 passes vacuously. The debt is the height.

---

## 1 · The substrate, verified on this tree

| claim | verdict | cite |
|---|---|---|
| Deal/Clear arm on coarse + dirty, two-tap, 2.5s window | HOLDS | `GameControlPanel.vue:516-530` (deal), `:551-566` (clear) |
| the arm's word is `sure?` in `--color-red-ink` w600 | HOLDS | `GameControlPanel.vue:882-884, :1254-1256` · `.icon-sublabel.is-armed` at `:2049-2052` |
| W1 §1.5's general confirm has NOT executed; the two guards are T4-WU/U3's | HOLDS (r7's reading re-derived) | the arm comments at `:506-514` name T4-WU/U3; no `fill`/`solve` arm exists |
| `fill` is ONE undo entry | **HOLDS** | `useGameState.ts:777` `recordBatch(deltas)` — "one entry = one gesture = one undo", and `:743-745` states the law |
| `solve` is ONE undo entry **when it fills** | HOLDS, conditionally | `useGameState.ts:687` `recordBoard(prevBlob, …, "solve")` inside `if (cellsToAnimate.size > 0)`; a no-fill solve records nothing |
| `clear` is one undoable board entry | HOLDS | `useGameState.ts:460` `recordBoard(…, "clear")` |
| `deal` is one undoable board entry — **except across a size change** | HOLDS, and this is the asymmetry | `useGameState.ts:612` records; `:635-640` a size-CHANGING deal does `clearPersisted() → initBoard() → randomize({record:false})`, i.e. OFF-LOG |
| `size` is a staged ask everywhere | HOLDS | `pendingSize` at `useGameState.ts:220`; only `deal()` commits it (`:629-641`); the retired `watch(size)` is named dead at `:1085-1088` |
| `level` is a staged ask everywhere | HOLDS | `difficulty` is a live ref (`:221`) but is CONSUMED only at deal (`:577`); its watcher at `:1089-1091` writes the URL and nothing else |
| the gallery's card step stages too | HOLDS | `StagingBand.vue:148,163` emit `pick`; `:119` `emit("deal")` is a separate verb — its header says "the re-deal is NOT this control's job" |
| a `?s=` follow stages rather than deals | HOLDS | `useGameState.ts:1045` sets `pendingSize` on follow |
| the guard ribbon's weights: keep 2, leave 2.5 + an 8% ground, colourless | HOLDS | `GameGallery.vue:1038-1058` (the two `HandDrawnOutline :pose="0"`), CSS `:1414-1462` |
| `.action-bar`: no border, sticky at ≥1024 and portrait <1024 only, z 60, `::after` skirt | HOLDS | `GameControlPanel.vue:2096-2103` · sticky key `:2166-2180` |
| `.play-controls` is `display:none` at base, `flex` only at `(pointer: coarse)` | HOLDS | `GameControlPanel.vue:2359-2371` |
| the role tokens are one right-hand side each | HOLDS | `typography.css:119-124`, with the 768 arm at `:131-135` |

**The one thing the charter asked that the tree answers NO to.** "`fill` and `solve` on the undo
spine" is true in the source and true in the browser for `fill` (proved below). For `solve` it is
true in the source and **unproved in the browser**: on a dirty 9×9 EASY board `solve` wrote 0
cells within 2.5s in 4 of 4 cells (and r7 saw the same at a 4,000ms settle). Tier 2's claim for
`solve` therefore rests on `useGameState.ts:687` alone — a source fact, not a measured one.

---

## 2 · The instruments, before and after

### §1 · `r0/r1-controls/probe/heading-voice.spec.ts`, re-run UNCHANGED

`probe/heading-voice.spec.ts` is byte-identical to r0's (`md5 9f3f07e2…`, both files). Run on
this lane's port against HEAD: **4 cells, 4 failed** — 8 names, 3 voices, 2 of 8 document
headings, dock ratio **1.0175**. The r0 census reproduces to the hundredth.

`probe/heading-voice.ladder.spec.ts` re-asserts the SAME three rows — same selectors, same
closed set, same 1.23 floor, nothing relaxed — with the overlay applied:

    4 passed (14.8s)   ·   4 names · 1 voice (Fraunces · 25.89 · 800 · lowercase) · 4 of 4 <h2>
                           · group name 25.89px against the chip's 20px = 1.2945

**ROW 3 needs one declaration to green and this lane names it:** `--type-group-title` must take
the φ rung on the phone as well (drop the `@media (min-width: 768px)` gate at
`typography.css:131-135` and let the role resolve to `--type-heading` everywhere). Measured:
dock ratio 1.0176 → **1.2944**, at a cost of **+24px** of card height.

### R7's I2 / I3 / I4, re-run at HEAD on this port

`probe/owners-eye.instruments.4233.mjs` is r7's file with ONE line changed (`BASE` 4247→4233;
the `diff` is banked at `probe/owners-eye.port.diff` and is that single line). At HEAD:

    RED   I2  ownChrome=false (border 0px, shadow none) · worst group coverage 88.9% (players)
    RED   I3  3 violating states: new game 0.401 / 0.058 / 0.050
    RED   I4  Deal armed wrote=0 · Clear armed wrote=0 · Fill wrote 52 · Solve neither
    6 RED / 7            (banked: readings/owners-eye-at-head-4233.json)

### The same three rows under the ladder

| row | at HEAD | under the ladder | note |
|---|---|---|---|
| **I4** | Fill writes 52 unguarded | `deal` **wrote 0**, `clear` **wrote 0**, `fill` wrote 52/44/51/56 and **one press of undo restored the board exactly** (`undone: true`, 4/4 cells×engines), `solve` wrote 0 | the tier-3 arm is pointer-agnostic in the prototype: every press asks |
| **I2** | RED, 88.9% of `players` under a borderless bar | the bar is DELETED: **strips 1→0**, worst group coverage **0.889→0** (dock) and **0.083→0** (desk) | **I2 as written can never green this way** — it requires `ownChrome === true`, and a bar that is not there carries no chrome. I2′ below |
| **I3** | RED, 1 violating state at the desk in this lane's 5-state sweep (`new game` at 0.254 while `pencils` owned the view) | **0 violations — and vacuously**: with non-sticky names only 1 of 5 states has anything pinned at all | the sticky arm below is the honest test |

**I2′, proposed** (born-GREEN under the ladder, still RED at HEAD): *no strip lies over an option
group, and any strip that exists is drawn.* Vacuously true when the strip is deleted, which is
what M04 actually asks for — the owner's complaint is a borderless slab burying a compartment,
and deleting the slab removes both halves. Readings: HEAD strips 1, drawn false, coverage 0.889;
ladder strips 0, coverage 0.

**I3′, proposed**: *at every scroll state the pinned name is the name of the band that owns the
most of the scrollport.* This replaces I3's ≥50%-on-screen clause, which presumes SMALL groups:
with three bands one of them is bigger than the scrollport by construction, so a correct pin
fires the old rule. Measured over 5 scroll states, sticky band heads
(`.cost-band-head{position:sticky;top:0}` — W2 §2.6's landed mechanism on three names instead of
four tapes):

| | states with a pinned name | pinned names something else | old-I3 violations |
|---|---|---|---|
| HEAD, desk 1280 | 5/5 | 1 (`new game` while `pencils` owns the view) | 1 |
| ladder, names not sticky | **1/5** | 0 | 0 *(vacuous)* |
| ladder, names sticky | 4/5 desk · **5/5** dock | 0 desk · 1 dock | 1 desk · 0 dock |

**Residue this lane did not cure:** at the desk's bottom scroll state nothing pins, and at the
dock's bottom state `looking` is pinned while `starting over` owns the view. Three bands is
better than eight tapes (1 wrong pin → 0 at the desk) but it is not clean.

### access 2.1 / 2.2 / 2.3 and the tap floor

* **2.3 contrast**, by the estate's own compositing method (`e2e/access.spec.ts:440`) over the
  ladder's six new text surfaces: **33 samples per cell, worst 4.55:1 (dock) / 4.66:1 (desk),
  zero under 4.5**, both engines, light.
* **the armed word, from the engine's PAINTED BYTES** (screenshot clip → `sharp` raw →
  2nd/98th-percentile luminance pair): ink `rgb(208,42,82)` on paper `rgb(253,253,252)` =
  **4.99:1 light**; ink `rgb(255,92,124)` = **6.30:1 dark**. Both engines, both cells, 1,316
  pixels sampled. `rgb(208,42,82)` is `--color-red-ink` #d02a52 exactly — the word is painted in
  the token, not near it.
* **the 44px floor, per dimension, with a negative control**: at 390 coarse the ladder's faces
  and chips read **worst 44.00 × 44.00, 0 failures in either dimension**; the negative controls
  in the same run are `43×60 → wOK false` and `60×43 → hOK false`, and `44×44 → both true`. At
  1280 the chips are 38px tall and always were — the floor is `(pointer: coarse)` by law
  (`index.css` `--tap-floor`), so a fine desk is out of its scope.
* **2.2**: with the sheet up the four ribbon verbs sit inside an `[inert]` subtree at HEAD and
  under the ladder alike (4 covered tabbables, both stripped). The ladder does not regress it —
  and that same `inert` is the reason for amendment A below.

---

## 3 · THE TAXONOMY — every censused act placed, with its reason

| act / option | tier | why |
|---|---|---|
| marks (normal · corner · center) | **looking** | changes how a later write is drawn; changes nothing already on the board |
| what fits (was `candidates`) | **looking** | shows what the board already implies |
| checking (off · ask · live) | **looking** | changes when the teacher speaks, never a cell |
| size | **looking** | staged; `pendingSize` only commits at `deal` |
| level | **looking** | staged; `difficulty` is read at deal time and nowhere else |
| peek | **looking** | a held view of the key; releases to what was there |
| hint | **writing** | inks one cell through `recordHintInk` |
| fill | **writing** | one `recordBatch` = one undo |
| solve | **writing** | one `recordBoard(…,"solve")` when it fills |
| undo · redo | **writing** | the spine itself |
| deal | **starting over** | a new board; **and a size-changing deal is OFF-LOG** |
| clear | **starting over** | one board entry, but the board is gone from the eye |
| play together · share · leave | **players** | not board acts at all |

**Three or four?** **Three costs and one residue — four NAMES, one voice.** `share` and
`play together` cost the board nothing; they change who may write on it. Forcing them into
`looking` to keep the count at three would be exactly the kind of lie this family exists to
delete, so the fourth band is named `players` and takes the same rank, the same rung and the
same face as the three costs. Measured: 4 names, 1 voice, 4 of 4 `<h2>`.

**And the ladder has a crack in it that the taxonomy must state out loud.** `deal` is tier 3
because it throws the board away — but a SAME-SIZE deal is one undo entry while a SIZE-CHANGING
deal is not recorded at all (`useGameState.ts:635-640`). So one drawn button is two different
costs depending on a chip three rows above it. Either tier 3 means "not undoable" (and a
same-size deal drops to tier 2), or the arm is what defines tier 3 (and the size-changing deal
needs its own sentence). This lane recommends the second: **tier 3 = the acts that ask**, which
is the reading M12 states and the one a reader can see.

---

## 4 · ZERO REFLOW — the family's centre, measured

The mechanism: the tier-3 face's word cell is a **1×1 CSS grid holding both words**, so the cell
is as wide as the wider of them at rest and armed alike, and the answer line is
**present-but-hidden** (`visibility: hidden`, which keeps its box). Arming flips `visibility`
and nothing else.

    getBoundingClientRect on the tier-3 BAND and on BOTH faces, before and after arming

    desk-1280x800  chromium  Δ [0,0,0,0]   webkit  Δ [0,0,0,0]
    dock-390x844   chromium  Δ [0,0,0,0]   webkit  Δ [0,0,0,0]
    land-900x500   chromium  Δ [0,0,0,0]   webkit  Δ [0,0,0,0]
    per-face Δ [0,0,0,0] ×2 at every cell · card scrollHeight Δ 0 at every cell
    the static page, same probe:  Δ [0,0,0,0] and document scrollHeight Δ 0, both engines

Armed state: the `sure?` span computes `visibility: visible`, `color rgb(208,42,82)`,
`font-weight 600`, 16px; the `no` line computes `visibility: visible`. Disarm restores the band
rect exactly. The accepted grammar is kept and widened: **any other tap, or 4s, disarms** (the
product's own window is 2.5s on coarse only — the prototype arms on every pointer, because a
mouse can slip too and the card's other guard, the divider, is a desk-only affordance).

Frames: `frames/tier3-390-resting.png` (9.5 KB) and `frames/tier3-390-armed.png` (10.2 KB) —
the same box, `deal` → `sure?` + `no`, `clear` untouched beside it.

**What the reservation costs.** The face is 78.39px without it and 101.58px with it: **+23.19px,
paid ONCE**, because both tier-3 faces share one row. On a 628px dock scrollport that is 3.7%.
Re-laying the answer beside the question instead of under it recovers only 1.6px as a CSS arm —
it needs a real re-cut of the face, not a flex-direction flip, and is not worth 1.6px.

---

## 5 · HEIGHT — the debt, itemised

Content against scrollport, `.controls-card`, light, sheet settled. Both engines agree to ≤1px.

| cell | scrollport | HEAD | ladder | φ arm (ROW 3 green) |
|---|---|---|---|---|
| desk 1280×800 | 608 | **1142** | 1226 (+84) | 1226 (+84) |
| dock 390×844 | 628 | **699** | 802 (+103) | **826 (+127)** |
| land 900×500 | 284 | **743** | 892 (+149) | 892 (+149) |

Ablation, each arm the same tree minus one decision (`readings/height-arms.json`):

| what | desk | dock | land |
|---|---|---|---|
| the reserved second line | **23** | **23** | 23 |
| the three band names in the one voice | **131** | **107** | 131 |
| killing the mobile tabs (both settings visible at once) | — | **70** | 72 |
| φ on the phone (ROW 3) | — | **24** | — |

The names are the spend, and they are the point: eight names at two rungs (four of which are
tapes with net-zero flow height) become four names at φ. **There is no cheaper rung for ROW 3** —
the floor is 1.23 × the 20px chip = 24.6px, and the ladder's next rung down is 20.35px.

**And the height is not a comfort question, it is a seam.** `.drawer-case` top against the
wordmark's box, sheet settled:

| viewport | HEAD gap | ladder gap | Δ |
|---|---|---|---|
| 390×844 | +1.27 chromium / +0.98 webkit | +1.27 / +0.98 | **0.00** |
| 375×812 | +9.77 / +9.48 | +9.77 / +9.48 | **0.00** |
| 430×932 | +18.11 / +17.98 | **−22.73 / −23.02** | **−40.84 / −41.00** |

At 390 and 375 the sheet is already at its cap, so a taller card changes nothing. At 430 there is
room for the sheet to grow and it grows UPWARD into the masthead — the ladder re-opens M03's own
seam at one viewport class. **This is the finding that decides whether the family ships as drawn.**

*(The first seam probe read `.drawer-case svg.outline-svg` and reported a Δ of exactly −230.00px;
after the DOM patch that selector resolves to a different svg in document order. The corrected
instrument reads the case's own box — `probe/crops-and-seam.mjs`. The bad numbers are superseded
and named here so nobody cites them.)*

---

## 6 · THE DESK RAIL'S AT-A-GLANCE READ — the ladder's clearest win

Of the five settings, how many have their CHOSEN option wholly inside the scrollport at
`scrollTop 0` (a setting hidden behind a tab counts as not on screen):

| cell | HEAD | ladder |
|---|---|---|
| desk 1280×800 | **2 / 5** (`Normal` 0.595, `Off` 0, `Ask` 0) | **5 / 5** |
| dock 390×844 | **4 / 5** (`level` is `display: none` behind its tab) | **5 / 5** |
| land 900×500 | **1 / 5** | **4 / 5** |

Cost order puts every setting above every act, so the rail's own job — telling you the state of
the board's settings in one look — gets strictly better even as the card gets longer. The kill
condition "if cost-ordering scatters the settings' states, say so" is **CLEARED**: it gathers
them. `frames/rail-1280-ladder.png` is the pose.

---

## 7 · THE BAR DELETED, AND WHAT IT LEAVES

`clear` → tier 3, `fill`/`solve` → tier 2, `share` → beside `play together`. What `.action-bar`
was carrying besides the four verbs, and where each part goes:

| what the bar owned | where it lands |
|---|---|
| the sticky key `(min-width:1024px), (max-width:1023.98px) and (orientation:portrait)` | **dies with the node** — and with it the landscape hole (at 900×500 the bar was `position: relative`, so its verbs sat at visFrac 0 with nothing holding them) |
| `::after`, the skirt that paints the card's own `padding-bottom` (56px desk / 6px dock) | dies; nothing sticks, so nothing halts one padding above the edge |
| `::before`, the 2rem `data-fold-below` fade | **must be re-homed to the card**, not deleted: the fold cue belongs to the scrollport, not to a strip that used to sit on it |
| z-index 60, the rung that beats `SheetWashiLabel`'s 50 | dies; the pair noted at both ends (`SheetWashiLabel.vue:110-116`) can go back to its own business |
| the one note berth (`.action-bar .washi-label{top:100%}`) and `.berth-note` | **UNPAID.** Four hover tapes and the invite verb's tape were laid in the bar's reserved foot precisely because it is the one band content can never enter. Deleting the bar deletes their berth. This lane did not re-home them. |
| the `i` crib toggle | parked beside the `looking` name in the prototype; a real answer belongs with the crib it opens |

**The phone's shut-sheet pose is unchanged by the deletion**, measured: at 390×844 shut, the
reachable set is `Undo · Redo · Hint · peek` in the ribbon plus the tongue, at HEAD and under the
ladder alike. The bar was never in that pose — it lives inside the sheet.

---

## 8 · THE QUICK SET (§14/M13) AND THE LANDSCAPE RESCUE — the part this lane did NOT build

By the family's law the tongue carries **tier-2 acts only** — never a tier-3 act one tap from a
tool, which is the right rule and is exactly what W1 §1.5 would otherwise be working against. By
use that set is **undo · redo · hint**: they are the acts taken between moves, they are the three
the portrait ribbon already carries at 0 taps, and they are the three that have **no drawn
control at all** in landscape.

Measured tap counts from the playing pose, HEAD and ladder:

    390×844   undo 0 · redo 0 · hint 0 · peek 0 · deal 2 · clear 2 · fill 2 · solve 2 · share 2
    844×390   undo 2 · redo 2 · hint 2 · peek — · deal 2 · clear 2 · fill 2 · solve 2 · share 2
    hidden option rows (the `level` tab): HEAD 1 → ladder 0, so `level` drops 3 taps → 2

**The ladder alone does not rescue landscape.** Undo stays at 2 taps at 844×390 under the
overlay, because the tongue carries zero acts and this lane did not prototype the quick set.
The room exists (r0: 274px of free board edge at 390 portrait; the landscape tongue is 48×92 on
the right flank), but the claim is unbuilt and should not be scored as met.

---

## 9 · THE BAND NAMES, PRICED AS A FONT RE-CUT

`probe/band-names-price.mjs` reads both shipped subsets' cmaps with the estate gate's own walker
(lifted out of `scripts/check-font-coverage.mjs` rather than re-implemented):

    Fraunces      src/assets/fonts/fraunces-subset.woff2      14,636 B   30 codepoints
    Patrick Hand  src/assets/fonts/patrickhand-subset.woff2    4,312 B   46 codepoints

    "looking" / "writing" / "starting over"
      authored LOWERCASE                      Fraunces covered ✓   Patrick Hand covered ✓
      authored Capitalised (+ CSS lowercase)  Fraunces missing W   Patrick Hand missing L, W

**Authored lowercase, the re-cut is zero bytes.** Both cuts already hold every letter
(`aegiklnorstvw`), so the price is a corpus edit in `check-font-coverage.mjs` — swap the eight
declared names for four, keep the derivation — and no woff2 is re-generated. Authored
Capitalised it is a re-cut of both faces, and in Patrick Hand `L` and `W` are outside the
{C,R,S} cut, which is the chimera trap R6 law 29 names. The washi tapes are already authored
lowercase, so lowercase authoring is the house's existing practice for exactly these strings.
M16: `looking` / `writing` / `starting over` / `players` are four plain English words, no
jargon, no metaphor, no em dash, no machine's name.

---

## 10 · THE WEIGHT LADDER AND THE FOCUS RING

| rank | drawn form | ink | precedent |
|---|---|---|---|
| tier 1 · looking | **no box**, the bare word on its seeded scribble underline | `--color-muted-foreground`, the chosen option at full ink (level in its crayon, unchanged) | `.ctrl-btn` as it ships — border 0, radius 6 |
| tier 2 · writing | `HandDrawnOutline :pose="0"` stroke **2**, outset 2, radius 0.3rem | foreground, no ground | the guard ribbon's `keep`, `GameGallery.vue:1038-1044` |
| tier 3 · starting over | the same outline at stroke **2.5** + `color-mix(foreground 8%)` | the armed word in `--color-red-ink` | the guard ribbon's leave verb, `:1052-1058` + CSS `:1459-1461`, twice owner-passed |

Radii: one, `0.3rem`, the guard face's own — the card's five (0 · 6 · 8 · 12 · 50%) collapse to
the face's one plus the board/case radii nobody in this family touches. Hover: **ink lift on the
bare word, the 8% ground on the boxed faces only** — R6 law 14's three forms, no fourth.

**Focus ring, chosen.** The card authors none today. The ladder already spends `outline` on the
drawn edge, so the ring cannot also be an outline: it is a **two-step `box-shadow`** — 2px of
card colour then 2px of foreground — which reads as the ribbon's `2px solid color-mix(fg 45%)
offset 4` without fighting the edge. It clears the 3:1 non-text floor by construction (it is
`--color-foreground` on `--color-card`).

**One law the family must not be allowed to blur.** The gallery's guard is **colourless** (weight
plus an 8% graphite ground, and its comment says so: "a reader who can see neither stroke weight
nor colour still sees one verb marked"). The controls card's armed word is **red**. This family
keeps the red — it is measured at 4.99:1 light and 6.30:1 dark from painted bytes, and it is the
idiom the owner has accepted twice in this card — but the two confirms are then two dialects of
one house shape, and W7 should rule which is the law rather than shipping both by accident.

---

## 11 · Kill conditions

| condition | verdict |
|---|---|
| "it re-sorts a taxonomy the owner has read for four tranches" | **stands, and it is the risk that needs the owner's eye, not a number.** U-10 |
| "the desk rail's value is the at-a-glance state of every setting; if cost-ordering scatters the settings' states, say so" | **CLEARED** — 2/5 → 5/5 desk, 4/5 → 5/5 dock, 1/5 → 4/5 landscape |
| "if `level` deals a board in any flow, tier 1 is a lie and the ladder is four tiers" | **CLEARED** — staged in the card, staged in the gallery band, staged on a `?s=` follow |
| "reserving a second line spends height on every pose to save a reflow on one act; measure what it costs at 390" | **PAID AND CHEAP** — 23.19px, once, 3.7% of the dock scrollport |
| "if `solve` is not one undo away, it is not tier 2" | **SOURCE-TRUE, BROWSER-UNPROVED** — `useGameState.ts:687` records; solve wrote 0 cells in 4/4 cells, so nothing was there to undo |
| *(new, found here)* the card grows 84–149px and at 430×932 walks the sheet 41px into the wordmark | **OPEN — the family's real bill** |
| *(new, found here)* with the sheet up the ribbon is `inert`, so tier 2's reversal is not in tier 2's band | **OPEN — amendment A** |
| *(new, found here)* non-sticky band names make I3 pass vacuously | **OPEN — amendment B** |

---

## 12 · Recommendation

**DEVELOP.** The consequence ladder is the only reading of this card that answers M03, M04, M05
and M12 with one decision instead of four patches: three costs and a residue, four names in one
voice at one rank, the destructive verbs the only boxed things with weight, and a confirm that is
a word swap inside a box that provably does not move — Δ0 on four sides, both engines, three
cells, and on the static page too. It greens the §1 instrument 4/4 without relaxing a row, it
takes the bar's 89.6% burial of the `players` group to zero by deleting the bar rather than
drawing it, it proves `fill` is one press from its reversal, and it gathers the settings the desk
rail exists to show, 2/5 → 5/5.

It ships with **two amendments and one bill**. (A) Tier 2 carries `undo`/`redo` inside its own
band on EVERY viewport, not only where the ribbon is absent: with the sheet up the ribbon is
`inert`, measured, so as drawn today `fill` writes 52 cells in a band whose undo the reader
cannot reach. (B) The band heads are `position: sticky` — without it I3 passes by having nothing
to pin, and the honest law is I3′ (the pinned name is the band that owns the scrollport), which
the sticky arm reaches 4/5 at the desk and 5/5 at the dock, not yet clean. The bill is height:
+84/+103/+149px, +24 more for ROW 3's φ, and a 41px seam regression at 430×932 that lands on
M03's own pixel. Synthesis must buy that back somewhere — the candidates this lane can see are
the desk rail's caption-beside-chips arrangement (a prototype choice, not a taxonomy
requirement), the `looking` band's five rows at a coarse 44px floor, and the `--type-group-title`
rung itself. **If it cannot be bought back, the family ships at 390 and 375 and must not ship at
430 as drawn.** Nothing here closes a mark (U-10).

---

## 12b · Prior art (background only — the verdict came from the codebase)

Searched, not decisive. Four rows worth carrying into synthesis:

* **GitLab's Pajamas "Danger Zone"** groups irreversible actions into their own zone, visually
  differentiated, away from routine controls — the same move as tier 3, arrived at independently
  and from a different direction (data loss rather than cost). It also rules that where a thing
  is hard to undo, a modal is warranted; the ladder's answer is that nothing in this card is hard
  to undo except a size-changing deal, which is precisely the crack §3 names.
  <https://design.gitlab.com/usability/destructive-actions>
* **NN/g on confirmation dialogs**: the second chance stops being one once people automate the
  answer, and for less critical acts the recommendation is **undo plus an inline warning** rather
  than a dialog. That is the ladder's split stated from the outside: tier 2 is guarded by the
  spine, tier 3 by the question. <https://www.nngroup.com/articles/confirmation-dialog/>
* **And a tension the lane will not paper over**: the same source says a confirm should name the
  consequence rather than ask "are you sure?". The card's word is `sure?`, which the owner has
  passed twice and which M16 likes for being plain. A band named `starting over` sitting directly
  above the word is the cheapest way to have both — the consequence is the heading, the question
  is the word. Worth auditioning in synthesis; not a defect.
* **Smashing, on dangerous actions**: friction should be proportional to severity, and adjacency
  to routine controls is itself the hazard. The card's own existing answer to that is spatial
  (Deal sits a full divider away from the play tools, `GameControlPanel.vue:900-905`); the ladder
  replaces distance with rank, which is cheaper in a card that has no height to spend.
  <https://www.smashingmagazine.com/2024/09/how-manage-dangerous-actions-user-interfaces/>

---

## 13 · Files

    README.md                          this record
    probe/pw.config.ts                 the scratch config (baseURL 4233, both engines, no webServer)
    probe/heading-voice.spec.ts        r0's §1 instrument, byte-identical, re-run
    probe/heading-voice.ladder.spec.ts the same three rows re-asserted under the overlay
    probe/owners-eye.instruments.4233.mjs  r7's instruments, one line changed (BASE)
    probe/cost-card.mjs                control vs overlay across 3 cells × 2 engines
    probe/height-arms.mjs              the 8-arm height ablation
    probe/tier3-shape.mjs              what the reservation costs, box by box
    probe/ladder-acts.mjs              I4 + the undo proof + I2′/I3′ + the floor + contrast
    probe/sticky-taps-seam.mjs         the sticky arm, tap counts, the first (superseded) seam read
    probe/crops-and-seam.mjs           the corrected seam and the two crops
    probe/band-names-price.mjs         the woff2 price, read with the estate gate's own cmap walker
    probe/static-check.mjs             the static page's own Δ0 / floor / ratio read
    proto/cost-card.css                the overlay stylesheet (replayable)
    proto/cost-card.js                 the overlay DOM patch (replayable)
    proto/cost-card-static.html        the static page (serve the REPO ROOT on 4234)
    readings/*.json                    every number above
    frames/tier3-390-resting.png · tier3-390-armed.png · rail-1280-ladder.png
