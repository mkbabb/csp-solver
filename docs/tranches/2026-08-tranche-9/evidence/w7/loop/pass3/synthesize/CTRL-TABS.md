# T9-W7 · pass 3 · SYNTHESIZE · CTRL-TABS — the tabbed case

Section §10 (§1 §2 §8 §14 §15 inside) · marks M01 M03 M04 M05 M10 M12 M13 · pass-2 72.
Synthesizer: Fable 5.1 (frontend-design invoked). Read-only on the product. Inputs:
`../CHAIR-RULINGS.md` (§6.3b the two ballots, §6.2, §6.5), the pass-2 spec
(`../../pass2/synthesize/CTRL-TABS.md`, STANDS where not amended), the pass-3 research
(`../research/CTRL-TABS/README.md`, `readings/head-74a2b5d9.json`, `head-812x375-landscape.json`,
`stale-classes.txt`), registry-v2, r0 R6/R7, the owner's frames C/D. Base `74a2b5d9`.
A SEPARATE route. Nothing closes (U-10).

Three of the pass-2 reds are arithmetic and the research derived each: the tongue's tuck (one
declaration hung from the wrong edge), the short-end law (a retired 12.6rem arm), and the desk
pin (no closed form exists, so the pin is the wrong instrument). This pass removes the rail pin
as an ASK by moving the strip to an edge where the card's width never enters the question.

---

## 0 · The plan re-read, then the tell review

**Subject, unchanged.** A pencil case with four index tabs on its edge, one tray face up, the
acts drawn as the tray's floor in one piece with its lid. Nothing scrolls.

**Tokens.** No new hex. `--ring-ink` consumed `var(--ring-ink, currentColor)` (this lane's
mint STRUCK, §2.4). `--sheet-chrome`, `--card-pad-t/b`, `--tap-floor`, `--washi-tag-rung`
CITED from TAPE's §6.5 block; `--vv-height, 100dvh` keeps its defended fallback (declared
exception, this lane's finding). ONE new length token: `--edge-strip-h` (40px = tongue 48 −
tuck 8), the berth on BOTH edges that carry a strip.

| token | light | dark | job |
|---|---|---|---|
| `--color-card` | #FDFDFC | #131211 | every tongue and the tray |
| `--color-foreground` | #0A0A0A | #EDEBE7 | the raised tab's word, `keep`, `deal` |
| `--ink-press-quiet` | fg 68% (5.24) | (6.05) | the unraised tab's word at FULL ground opacity (one dimming) |
| `--color-muted-foreground` | #737373 (4.66) | #A8A69F | the floor's verbs, row captions |
| `--color-red-ink` | #D02A52 (4.99 bare card) | #FF5C7C (6.30) | the destructive answer's word |
| `--edge-strip-h` | 40px | | the strip's in-flow berth (= protrusion) |

**Type.** Patrick Hand `--type-name` (25.888) 600 lowercase for tab words and captions; Fira
Code 20 chips; `deal` at `--type-act` foreground; verbs `--type-verb` muted.

**Layout, one sentence.** ONE LAW, THREE EDGES (`protrusion = size − tuck`): the four section
tabs sit on the CASE's TOP EDGE inside a padding berth on BOTH platforms (the raised one runs
into its tray by geometry), the play strip (`undo · redo · hint · controls`) sits on the
BOARD's bottom edge in portrait (tucked −6.00 as HEAD's tongue is) and stays the flank tongue
in landscape and at the desk, and the card keeps HEAD's intrinsic width at every viewport.

```
 PHONE 390×844                                 DESK 1280×800 — the case's top berth = --edge-strip-h
 ┌─────────┐╔═════════╗┌─────────┐┌───────┐    board 640 │ 3.5rem │ ┌───┐╔═══╗┌───┐┌───┐┌───┐
 │new game │║ pencils ║│checking ││players│              │ tongue │ │new│║pen║│chk││ply││key│  ← tabs' TOPS on the
 └─────────┘║         ╚═══════════════════╗              │(HEAD's,│ └───┘║   ╚══════════════╗   board's top line;
 ┌──────────╝  the lid omits [x0,x1]      │              │ centred│ ┌────╝  tray             │   nothing paints in
 │  marks     normal corner center        │              │ on the │ │  marks   what fits     │   the masthead zone
 │  what fits off on                      │              │ board's│ ├────────────────────────┤
 ├────────────────────────────────────────┤              │ flank) │ │ deal · dealt ⊪         │  ← floor row 1
 │ deal dealt⊪ clear fill solve share peek│              │        │ │ clear fill solve share │  ← floor row 2 (by law)
 └────────────────────────────────────────┘                        └────────────────────────┘
 board edge:  (undo)(redo)(hint)(controls)   tuck −6.00, berth 40 → board +20.00 DECLARED
```

**Principles.** (1) The heading IS the tab. (2) Nothing scrolls, and the limit is a derived
law (§1.3). (3) EDGE · INSIDE · FLOOR. (4) One tool home. (5) The memorable thing: the raised
tongue running unbroken into its tray, by geometry.

**The tell review.** (a) The first draft took the research's no-pin route — the flank strip in
the 3.5rem gap. The review measured it against the estate: the drawer tongue lives in that
gap at `translateY(-50%)` on the board's flank (DrawerTab.vue desk arm), spanning
[mid−46, mid+46]; a 216px strip (4 × 48 + 3 × 8) cannot clear it above at 1024×600 (166px
available) nor below (the case ends at ~490), and the card's right flank has 2px of room at
1024. Struck. The strip goes on the case's top edge in a padding berth — the same edge as the
phone (ONE idiom, both platforms), the card's width intrinsic (π by construction at 1024–1600),
and the decided law "no frame paints the case above the board's top or in the masthead zone"
(scene.css:160-172) kept because the berth is inside the case. (b) App-kit tabs refused as
before: the raised state is a missing edge. (c) The confirm follows the section's face (TAPE
§2.5): both answers drawn 1.5/2.5, red on bare card — L5 holds, the gallery's `keep` keeps its
outline. (d) `.act-face`'s hover ground is fenced off the destructive word (registry §3.12).
(e) Motion: same-frame tray swap; the ribbon on the ladder's `note` rung; nothing unbidden.

---

## 1 · The rows, each derived

### 1.1 The tuck — one declaration, hung from the right edge

```css
/* DrawerTab.vue :176 — hang the tongue from the BERTH'S TOP, not from 100% of a berth that grew */
.drawer-tab.is-edge { top: calc(-1 * var(--tongue-tuck, 0.5rem)); }   /* --tongue-tuck: a declared CSS constant, 8px */
/* GameBoard.vue #board-edge — the berth IS the protrusion */
#board-edge { height: var(--edge-strip-h); }                            /* 48 − 8 = 40 */
```

`#board-edge` sits +2.00 under `.board-wrapper`'s bottom at every portrait cell, both engines,
so tongue.top = paper.bottom − 6.00 (HEAD's own number; board-covisibility.spec.ts:440-520
holds [−8.5, −4] and banked −6.00) and tongue.bottom == berth.bottom exactly. Rejected with
reasons: `margin-bottom: 40px` (collapses against `.board-margin`'s 0.4rem → +16.8, not +20);
`padding-bottom` (an absolute child's containing block is the padding box — moves the tongue
exactly as height did). The flow gain 40 halves into the centred block: the board moves
**+20.00, DECLARED**, and the centring arm IMPROVES (offCentre 19.27 chromium / 19.58 webkit
→ ~0.7 at 390×844 and 390×664) — measured at both rungs, not assumed.

### 1.2 The desk strip — the case's top berth, no pin (chair §6.3b's refused pin disappears)

```css
@media (min-width: 1024px) { .drawer-case { padding-top: var(--edge-strip-h); } }  /* the berth */
.tab-strip { position: absolute; top: 0; left: var(--card-pad-x); height: 48px; }   /* tabs' TOPS at the case's top */
```

The card keeps HEAD's width (315.59 / 324.22 / 327.09 / 330.00 / 335.47 at 1024–1600); the
board's x moves 0.00 by construction at every desk rung; the 1280-minted goldens never move.
Cost: the desk card is 40px shorter (cap `calc(min(42rem, 85vw, 100dvh − 10rem) − 2rem −
40px)`): at 800 tall 568 against ~420 of content; at 1024×600 the reading is 368 against ~420
(reported as the shortest desk's overflow, the short-end law's desk arm, §1.3). A fifth tab
`keys` on the desk as pass 2. The tray's lid `gap` and the raised tab's `omit` as pass 2 §2.1.

### 1.3 The short-end law, re-cut from the measured chrome

`vh − clientHeight` = 216.00 exactly in portrait (chrome 12rem 192 + 24) and 88.00 in short
landscape (4rem 64 + 24), both engines; 430×932 does not bind (maxH 716 > content 675). The
gate asserts `scrollHeight === clientHeight` (fits) and DERIVES its boundary: fits ⟺ content ≤
vh − 216 (portrait) / vh − 88 (landscape); with 304 of content, fits at vh ≥ 520 and overflows
by 20 at 360×500 (the law's number, both sides). Pass 2's 512/12 and `vh − 234` were artefacts
of a retired `max(12.6rem, …)` arm and are struck; HEAD carries a flat 12rem and this family
CONSUMES TAPE's portrait derivation with the landscape arm at `4rem` (chair §6.2). 844×390 is a
302px budget (287 at 812×375) against 268 of landscape content: fits with 34/19 to spare;
the +8px of card height is a declared delta to the masthead's owner.

### 1.4 W2 §2.2's reachability — a GUARD to hold, not a born-RED to build

`viewport-law.spec.ts:195` runs at 844×390 AND 812×375 and is GREEN at HEAD with `.drawer-tab`
visible ([597,166.6,48,92] / [573.5,159.09,48,92]) as the cued entry; its header's "RED at
HEAD" is pre-W2 text, re-written. Chair §6.3(b)'s condition for deleting `#fold-tools` is met
at HEAD and must be kept met: renaming `.drawer-tab` or dropping the landscape flank pose
takes the condition down. The ONE remaining ballot (retire `#fold-tools` + the sticky tag's
four terms, because a card that does not scroll has nothing to stick to) is ASKED with both
frames; the DECLARED FALLBACK is BUILT first: `#fold-tools` stays, the board's edge strip
duplicates its acts, and the return says so. Default stated: the strip.

### 1.5 The join's four silences — a unit, then a browser row

vitest over `openRing`/`generateRectBoilFrames`: the cut path does not end in `Z`; the gapped
side carries no point inside [x0, x1]; each fallback (hi ≤ lo, gap outside the side, !crossed)
returns the CLOSED ring it declares; `radius !== 0` THROWS in dev instead of dropping the cut.
The browser half: `.tab.is-raised::after` computes `none`; the open feet land within the
stroke's width (2.5) of the lid's line at 390×844 and at the desk.

### 1.6 The divider's deletion — four things, one commit

`BoilDivider.vue` (one importer, GCP:65), the BEAT_DRIVEN row (filterBudget.ts:109-124; the
surface leaving is retirement trigger (c)), R6 law 9 / L1 (population EXACTLY 9 → 5, as a
PROPOSED diff with its firing negative control) and BOTH union arms (coarse 6673 → re-derived
from a BUILT dist; row 45572 re-derived too — pass 2 carried it on the 2% tolerance) land
together. Plus: `url(#` inside `.tray[inert]` = 0 (hidden trays are INSIDE the census).

### 1.7 §13 owns every duration this family minted

`inkLiftMs` → `var(--motion-whisper)` (consume, never a second 150); `ribbonMs: 240` → the
`note` rung (250; a 240 literal is what the ladder refuses); `outcomeHoldMs: 1600` keeps its
literal in MOTION (a hold, the delay fence); `confirmWindowMs: 2500` is consumed only by
`useTwoTap` (TAPE lands it) — its LAPSE is the behaviour to gate: focus does not silently return
to the armed verb, and a subsequent Enter does not re-arm (COST measured the defect).

---

## 2 · Components and states (pass 2 §2 stands; the deltas)

| component | pass-2 | pass-3 delta |
|---|---|---|
| the strip (`role="tablist"`), the raised edge by geometry | omit/gap props, `::after` dies | DESK: on the case's top edge in the `--edge-strip-h` berth (no flank, no pin); PHONE: unchanged |
| the tray | rows as `<h3>` captions, chips Fira 20 | unchanged |
| the floor | phone one row; desk two rows by law | unchanged |
| the live regions | split then hoisted | unchanged |
| the confirm | keep bare / clear boxed | BOTH drawn 1.5/2.5 (the section's face); `.act-face` hover ground fenced off the destructive word; press count explicit |
| one tool home (§14) | edge strip + 40.78 declared | the tuck derived (−6.00), berth = 40, board +20.00 declared, centring improves; fallback built |
| the rail pin | W2's ruling, asked | GONE — no ask; the card is intrinsic at every width |
| the short end | `vh − 234`, 512/12 | `scrollHeight === clientHeight` with the derived boundary (vh − 216 / vh − 88) |
| focus | `--ring-ink` 2px solid offset 4 | `var(--ring-ink, currentColor)`; contrast re-read off what lands (§6.6 is MRK-LIVE's) |

## 3 · Copy (M16; lowercase by CSS)

Tabs `new game · pencils · checking · players` (+ `keys` desk); rows `size · level · marks ·
what fits`; floor `deal · clear · fill · solve · share · peek`; edge `undo · redo · hint ·
controls`; confirm lines as pass 1; `copied` / `failed` on the share word for `outcomeHoldMs`.
`peek`/`keep` in a `TAB_WORD`-shaped constant so `check-font-coverage` READS them. Zero new
strings; ADMITTED stays empty; the copy-gate replay resolves toward the fold (B1b kept).

## 4 · Motion

| verb | what | duration | curve | home |
|---|---|---|---|---|
| tray swap / raised edge | display + path swap | 0 | — | — |
| ink lift | tab word quiet → foreground | `var(--motion-whisper)` 150 | `--ease-standard` | §13's ladder |
| ribbon | the confirm taking the floor's row | `var(--motion-note)` 250 | `--ease-glassGlide` | §13's ladder |
| confirm window | disarm timer | 2500 | — | `MOTION.confirmWindowMs` (a hold) |
| outcome hold | `copied` on the share word | 1600 | — | `MOTION.outcomeHoldMs` (a hold) |

PRM: the ribbon appears in place; the rungs read 0ms. Desk and phone one grammar; light/dark by
tokens.

---

## 5 · Plan — files, order, what dies

Replay `-35` onto a worktree from `74a2b5d9` (five overlapping files: the two gate scripts
toward the fold; GCP +13, GameBoard +56, the test +4 toward the fold), then:
1. `filterBudget.ts` FIRST with the divider's retirement: 9 → 5; both union arms from a BUILT
   dist; L1 proposed diff; the `[inert]` row.
2. `HandDrawnOutline.vue` / `gridPaths` — `omit`, `gap`; the unit gates (§1.5).
3. `DrawerTab.vue` — `.is-edge` hung from the berth's top; `--tongue-tuck` declared.
4. `GameBoard.vue` — `#board-edge { height: var(--edge-strip-h) }`.
5. `scene.css` / `GameScene.vue` — the desk berth `padding-top: var(--edge-strip-h)`; the card's
   desk cap less 40; `#fold-tools` retirement ONLY on the owner's word (the fallback built);
   portrait seam consumed from TAPE, landscape `4rem`; the five `, 0px` struck AFTER the block.
6. `GameControlPanel.vue` — the tablist on the top edge both platforms; `::after` patch deleted;
   the confirm's face (TAPE §2.5) with the press-count row; the desk floor's two rows; roster
   split + hoist; `--sheet-chrome` own arm DELETED; `--ring-ink` consumed.
7. `GameGallery.vue` — the 8% ground stays dead; `keep`'s outline UNTOUCHED (L5).
8. `typography.css` — `--type-name`; `--type-group-title` retired; the 22px arm → 20.
9. `pencilConfig.ts` — `inkLiftMs` NOT minted; `ribbonMs` NOT minted; `outcomeHoldMs` named;
   `confirmWindowMs` consumed by TAPE's factory.
10. Tests — the 22 bodies across 8 files (`readings/stale-classes.txt`) re-aimed; the
    board-covisibility edge lock kept at [−8.5, −4] (it reads −6.00 here); `viewport-law:195`'s
    header re-written; the unit gates; `check-font-coverage` constants.

Dies: `.peek-hold-surface` + the ONE `BoilDivider`; the `::after` patch; the 8% ground; the
peek chip's ground; the `+17.6` seam arm; `--type-group-title`; the rail pin (never built
again); the 240/260 literals. On the owner's word only: `#fold-tools` and the sticky tag's
four terms. Stays: the dock and sheet mechanics; the tongue's berths and its −6.00; the
tap-floor token; the chips' scribble; `--vv-height`'s fallback.

---

## 6 · Prototype brief

Worktree from `74a2b5d9`; `127.0.0.1:4232 --strictPort`, private `cacheDir`; the HEAD control
on the next free band port (named); scratch Playwright config; both engines; settle ≥700ms
(this lane used 950); `npx vite build` in the worktree → preview → filter-census via the
throttle config with `PLAYWRIGHT_BASE_URL`, and the goldens; servers killed before return.

**Crops (≤4):** (1) 390×844 dark, sheet up: `pencils` raised and running into its tray, the
floor one piece — beside Frame B; (2) 390×844 light, the board's bottom edge: four tongues
tucked −6.00 in their berth beside HEAD's single tongue (the +20 declared, seen); (3) 1280×800
light: the five tabs on the case's top edge with their tops on the board's top line, the card
at HEAD's width beside the HEAD control (π, seen). Fourth: the confirm in the floor, only if the
section's face is not already crop-banked by TAPE.

**Censuses:** R1 heading-voice (+900×500); R7 I2 (0.0000) / I3 (vacuous — nothing scrolls;
labelled) / I4 (RED until W1 §1.5); the tuck at five portrait cells both engines (−6.00 ± 0.5;
tongue.bottom == berth.bottom ± 0.05); the centring arm at 390×844 and 390×664 (offCentre before
/ after, both rungs); the desk band 1024/1280/1360/1440/1600 vs the control (card width Δ 0.00,
board x Δ 0.00) and THROUGH THE GLIDE (no frame paints a tab over the board; both engines);
the short-end law (fits at 360×560, overflow 20 ± 1 at 360×500, `scrollHeight === clientHeight`
at 390/375/430); 844×390 + 812×375: W2 §2.2 GREEN, clientHeight 302/287 reported, landscape
content fits; the join unit gates + `::after` none + feet within 2.5; the guard contrast (4.99 /
6.30; stroke 1.5/2.5; density ≥ 1.5×; armed + hovered ≥ 4.5 with the fence); `getByRole('log')`
= 1 tray down; R6 law-probe COPY (L1′ = 5 proposed, L3 the chair's RED reported, L5 GREEN, R3);
hue census COPY (29); `filter-census` 12/12 off the dist at 5 + both union arms re-derived;
tab/edge targets ≥ 44 per dimension with the firing control; the gallery π (Δ 0.00 ×5); TAPE's
registration/publisher rows cited and run; `check-font-coverage` with `keep`/`peek` derived;
the unit battery and the 22 re-aimed bodies BARE; goldens 4/4 (`cell-light`/`grid-corner-light`
crop the board; any move is a DELTA row).

**Success:** tuck −6.00 ×5 cells; berth == protrusion; board +20.00 declared with the centring
win; desk Δ 0.00 ×5 rungs through the glide; no scroll at six cells + the 360×500 overflow 20 ±
1; reachability GREEN ×2; `::after` none; unit gates GREEN with the throw; filter 5 + union;
C2 4.99/6.30 with the weight channel; log 1/1; goldens 4/4; M16 0.

---

## 7 · Gates the family lands with

Born-RED at HEAD: NO SCROLL at six cells (699/628 today) with the derived boundary; the tuck's
closed form (tongue.top = paper.bottom − 6.00 AND tongue.bottom == berth.bottom — the second
half RED at HEAD where the berth is 0); the centring arm improved (offCentre ≤ 2px at both
rungs; HEAD 19.27/19.58); the desk band Δ 0.00 vs the control through the glide (RED under any
pin); `role="tablist"`; R1 ROW 1/2/3; tab targets ≥ 44 per dimension; undo/redo/hint at 0 taps
at 844×390 and 900×500 (on the owner's word for the strip; the fallback reports the duplication);
I2 0.0; the one-dimming row; the weight-ranked confirm (stroke 1.5/2.5, red word ≥ 4.5 on bare
card, hovered ≥ 4.5); the press-count row; `getByRole('log')` = 1 tray down; the raised edge
with zero `::after`; the join's four unit rows + the `radius !== 0` throw; `url(#` in
`.tray[inert]` = 0; the lapse row (no silent refocus, no re-arm); I4 RED reported.
Guards: filter EXACTLY 5 + both union arms from a built dist (the L1 diff proposed); goldens
4/4; W2 §2.2's reachability at 844×390 + 812×375 (a guard — renaming `.drawer-tab` reds it);
board-covisibility's [−8.5, −4]; the masthead-to-board gap; the tongue's flank pose at the desk
and in landscape unmoved; `--vv-height`'s fallback present; hue 29; M16 0; the gallery Δ 0.00.

TO THE CHAIR / OWNER (U-10): ONE ballot remains (retire `#fold-tools` + the sticky tag's terms,
with the fallback BUILT and both frames); the rail pin is withdrawn as an ask; `confirmWindowMs`
is W1 §1.5's dependency; the ribbon's 240 lands on `note` 250 unless a measured reason says
otherwise.
