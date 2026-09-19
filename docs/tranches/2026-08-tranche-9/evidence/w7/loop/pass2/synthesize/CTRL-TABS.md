# T9-W7 · pass 2 · SYNTHESIZE · CTRL-TABS — the index tabs

Section §10 (§1 §2 §8 §14 §15 inside) · marks M01 M03 M04 M05 M12 M13 · pass-1 62 with a BLOCKING
CONDITION. Synthesizer: Fable 5.1. Read-only on the product. Inputs: `CHAIR-RULINGS.md`, the
pass-1 spec, the pass-1 critique (4.20 light; 40.78px undeclared; live regions dead in a hidden
tray; 32 estate rows; two W2 rulings), the pass-2 research record
(`../research/CTRL-TABS/README.md`, `readings/guard-solve.json`, `guard-surface.json`,
`regions-floor-seam.json`, `short-end.json`, `drop-attribution.json`,
`filter-census-built-dist.txt`), registry-v1, r0 R6/R7, the owner's frames. Nothing closes here
(U-10).

**The blocking condition is CLEARED on the real surface**: dropping the 8% face takes the
destructive verb to 4.99 light / 6.30 dark in both engines at zero geometric cost, and the
marked/bare redundancy MOVES from a ground that can never carry it (the AA-safe and the 3:1-visible
bands are disjoint in both themes at every mix) to the drawn box the ribbon already paints per
verb (19.41 / 15.84). The family does not retire.

---

## 0 · The plan re-read, then the tell review

**Subject, unchanged.** A pencil case with four index tabs on its edge, one tray face up, the acts
drawn as the tray's floor in one piece with its lid. Nothing scrolls.

**Tokens.** No new hex. The 8% face RETIRES. `--ring-ink` consumed (chair §6.1). `--type-group-
title` RETIRED (zero glyph movement, proved by cascade).

| token | light | dark | job |
|---|---|---|---|
| `--color-card` | ≈ #FDFDFB | #131211 | every tongue and the tray |
| `--color-foreground` | #0A0A0A | ≈ #EDEBE7 | the raised tab's word, `keep`, `deal`'s word |
| `--ink-press-quiet` | graphite 68% (5.24) | (6.05) | the unraised tab's word, at FULL ground opacity (one dimming) |
| `--color-muted-foreground` | #737373 (4.66) | ≈ #A8A69F | the floor's four verbs, row captions |
| `--color-red-ink` | #D02A52 (4.99 on bare card) | #FF5C7C (6.30) | the destructive answer's word |
| `--ring-ink` (consumed) | fg 50% | fg 50% | every control in the card |

**Type.** Patrick Hand at `--type-name` (25.888) · 600 · lowercase · letter-spacing 0 for the tab
words and row captions; Fira Code 20 for chips. Fraunces leaves the card. The floor's rungs: `deal`
at `--type-act` (16 at 390 coarse) in FOREGROUND; the four verbs at `--type-verb` (14) muted; peek
a bare word at `--type-verb` muted (its chip ground dies).

**Layout, one sentence.** Phone: a strip of four tongues on the case's top edge, the raised one
continuous with its tray by GEOMETRY (one path omits its bottom, the lid omits the span beneath),
the tray below, the floor as one piece with the lid; desk: the same four tongues down the rail's
left flank with the rail's width pinned (W2's ruling, asked) and a fifth tab `keys`.

```
 PHONE 390×844                                     DESK 1280×800 (rail pinned 324.22)
 ┌─────────┐╔═════════╗┌─────────┐┌───────┐         ╔══╗
 │new game │║ pencils ║│checking ││players│         ║ne║┌──────────────────────┐
 └─────────┘║         ╚═══════════════════╗         ║w ║│ size  4×4 9×9 16×16  │
 ┌──────────╝  ← the lid omits [x0,x1]     │        ║ga║│ level Easy Med Hard  │
 │  marks     [Normal] [Corner] [Center]   │        ║me║│                      │
 │  what fits [Off] [On]                   │        ╚══╝│       [deal] dealt ⊪ │
 ├─────────────────────────────────────────┤        ┌──┐└──────────────────────┘
 │ [deal] dealt⊪ [clear] [fill] [solve] [share] peek│  │pe│ row 1: [deal] dealt ⊪
 └─────────────────────────────────────────┘        │nc│ row 2: [clear][fill][solve][share] (i)
   board edge: (undo)(redo)(hint) (controls)        └──┘ ← the desk floor is TWO rows BY LAW
```

**Principles.** (1) The heading IS the tab. (2) Nothing scrolls above vh 530 portrait / 348
landscape, and the limit is gated. (3) EDGE · INSIDE · FLOOR is the whole hierarchy. (4) One tool
home. (5) The memorable thing is the raised tongue running unbroken into its tray, now held by
geometry rather than by two fills agreeing.

**The tell review.** (a) Hidden navigation: the idea; §7's reach claim stands. (b) The app-kit tab
(pill, underline, fill): refused; the raised state is a missing edge. (c) The confirm's red-on-
tint was the generic "danger button" and it failed AA; cut to red on bare card with the box as
the non-colour channel. (d) Motion: the tray swap is same-frame; nothing slides. (e) Revised from
pass 1 after review: the `::after` fill patch across the join is exactly "two surfaces agreeing
on a fill", the kind of accident a `prefers-contrast: more` regime exposes; pass 2 owes the one-
path form and this spec builds it (§2.1).

---

## 1 · Tokens the family re-points

```css
/* typography.css */
:root { --type-name: var(--type-heading); }                  /* the tab word and the row caption */
/* DELETE --type-group-title (:124, :135) and `.section-heading { font-size: … }` (:373) ONLY;
   keep the class (StagingBand needs its family/weight/casing/tracking). Measured: zero glyph
   moves — StagingBand's unlayered --type-small override always won. */
/* :149-153 the 22px arm → 20 (the gallery paints 16 in both arms; pi). */

/* index.css */
/* --ring-ink CONSUMED. The 8% .guard-face ground DELETED (GameControlPanel.vue:2071 AND
   GameGallery.vue:1459, one commit). */

/* GameControlPanel.vue — the four sticky-tag terms retire WITH W2's ruling (§8), never before. */
```

Stroke ladder: case **3** · tab, lid, floor **2.5** (one weight, one piece) · act face **2** ·
destructive act face **2.5**. Radii: 0 on drawn things except the tongue's shipped one-sided
0.75rem; 0.5rem on invisible hit boxes.

---

## 2 · Components and states

### 2.1 The strip (`role="tablist"` "controls") — the raised edge as GEOMETRY

`HandDrawnOutline` gains two props, both pre-baked geometry (no filter, no beat): `omit:
"top" | "bottom" | …` skips one side's segments in the pose path; `gap: [x0, x1]` leaves the span
between two x's open on the omitted-side's opposite edge (the lid). The raised tab draws with
`omit="bottom"`; the tray draws with `gap="[tab.left, tab.right]"` on its top edge. The two paths
meet at the tab's corners within the stroke's own width; the `::after` card-coloured patch
(GCP:1352) DIES; `prefers-contrast: more` and an opaque-sheet regime hold by construction.

| state | drawn form | word | ground |
|---|---|---|---|
| raised | pose-0 at 2.5, `omit="bottom"` | `--color-foreground` 600 | card, opacity 1 |
| at rest | pose-0 at 2.5, four sides | `--ink-press-quiet` | card, opacity 1 (ONE dimming) |
| hover (`hover:hover`) | — | ink lift 150ms | — |
| focus | `--ring-ink` 2px solid, offset 4 | | |
| size | ≥ 44×44 both dimensions, `min-inline-size` + `min-height` from `--tap-floor` | | |

Keyboard and ARIA as pass 1 (roving tabindex, automatic activation, `tabpanel`s). Hidden trays:
`inert` + `visibility: hidden` in one grid cell (the SHIPPED mechanism; the comment at :208 is
rewritten from `display: none`). The coupling is WRITTEN DOWN at the rule: this one declaration
holds the 0.00px card-height invariant, removes the tray from the a11y tree (hence §2.4), and
keeps the tray INSIDE `filter-census`'s count (visibility:hidden counts; display:none does not).

### 2.2 The tray — unchanged (rows as `<h3>` captions at `--type-name` quiet, chips Fira 20)

### 2.3 The floor — one piece with the lid; the desk floor is TWO ROWS by law

Phone 390: `deal · dealt ⊪ · clear · fill · solve · share · peek` in one row (374 × 79.17).
Desk 1280 (rail 232.22): **row 1 `deal · dealt ⊪`, row 2 `clear · fill · solve · share · (i)`**
— the reading order is chosen, not fallen into: the new-game act alone with its tally, the four
board acts beneath. `peek` is coarse-only (a hold) and does not draw on the desk. Ballot A (the
rail pin) is voted WITH this cost attached.

Ink: `deal` `--type-act` foreground (the declared primary reads as one: 19.45); the four verbs
`--type-verb` muted (4.66); `peek` bare word muted (its 17.36 chip dies — the floor's loudest
thing was its least consequential); `solve`'s blue tick unchanged (board content law 20 is not
touched). Faces: ACT pose-0 at 2 on the verbs, `deal` at 2 (it asks via the ribbon; weight marks
the answer, not the rest verb).

### 2.4 The live regions — split, then hoisted (W3's landed idiom)

The three roster nodes are DUAL-PURPOSE (pixels + voice). Split: the visible roster line, list
and "alone" line stay in the tray as plain `<p>`/`<ul>` (pixels, no `aria-live`, no `role=log`);
their VOICE moves to the panel root beside `.copy-status` (GCP:1154, the sr-only `role=status`
berth): `.roster-voice` (`role=log`) and `.roster-status` (`aria-live=polite`), fed by the same
computed strings. `getByRole('log')` = 1 with the tray DOWN. `access.spec.ts` 2.3 carries BOTH
halves: the test raises the `players` tab first (re-aim) AND asserts the region announces with
the tab down (product). `check-live-regions`: regions born empty, none born speaking.

### 2.5 The confirm (§15) — C2: red on bare card, one verb boxed, one bare

While a destructive verb is armed the floor's row holds `clear the board?` · `keep` (bare word,
foreground 19.45) · `clear` (pose-0 at 2.5, `--color-red-ink` on BARE card, 4.99 / 6.30). Three
independent channels; remove any one and the ask still reads (the greyscale luminance gap between
the two words is 2.51:1 in dark — under 3:1 — so the box/no-box difference is the load-bearing
non-colour cue, measured). C4 (a 4% face, 4.59 by 0.09) and C5 (bare card and nothing else) are
REFUSED in writing with those numbers. The gallery's ribbon (`GameGallery.vue:1035-1060`) takes
the same face in the same commit: one confirm, two files. Verbs ≥ 44×44 per dimension
(45.33×44 / 47.98×44 measured; `min-inline-size` present). `keep` returns focus to the armed verb.
Arming: `useTwoTap` (graft 2) with CTRL-COST's keyboard law (Escape disarms with a conditional
stop; focus moves to `keep` on arm so a second Enter never acts); W1 §1.5 owns the mechanism.

### 2.6 One tool home (§14) — the edge strip, and the 40.78px DECLARED

`undo · redo · hint · controls` as tongues on the board's bottom edge (portrait) / right flank
(landscape), tucked 8px, each ≥ 44×44. The 40.78px board drop is NOT `--sheet-chrome`'s (0.00px,
measured): the playing block is centred and `#fold-tools`' 55.98 + 20 gap = 75.98 of flow left
below the board halves into 40.78 (5.58 residual owed to a HEAD arm the prototype stands). The
spec's choice: the strip gets an IN-FLOW BERTH under the board equal to its protrusion
(`--edge-strip-h: 40px` = 48 − 8 tuck), so the tongues have a home rather than floating in a gap,
and the board moves **+20px, declared**, with a before/after crop and the portrait goldens re-run
(expect `cell-light` / `grid-corner-light` unmoved: they crop the board, not the page; any move is
a DELTA row). Fallback if W2 declines retiring `#fold-tools` (§8): the fold stays, the board stays,
the strip's acts duplicate the fold's — and the family says so.

### 2.7 The rail pin — W2's ruling, asked (unchanged from pass 1 §2.6)

### 2.8 The short end — a two-number law, gated

`clientHeight = vh − 234` at every width 320–390 (`--sheet-chrome` 12rem 192 + 1.5rem 24 + the
outline's outset; the family's +17.6 `max(12.6rem, …)` arm DIES — it bought a vacuous seam gate and
moved nothing). Against 296 of content: **PORTRAIT FITS AT vh ≥ 512; LANDSCAPE (4rem chrome, 260
tray) AT vh ≥ 348.** Gate: at 360×560 the card does not scroll (both engines); at 360×500 it
overflows by exactly 12 ± 1 (the law's number, not only its green side). The seam is CONSUMED
from W2 §2.5's derivation (CTRL-TAPE pass-2 §1.5), no own arm, no own fallback.

---

## 3 · Copy (M16; lowercase by CSS)

Tabs `new game · pencils · checking · players` (+ `keys`, desk only, priced); rows `size · level ·
marks · what fits`; floor `deal · clear · fill · solve · share · peek`; edge `undo · redo · hint ·
controls`; confirm lines as pass 1. `peek`'s and `keep`'s strings get a `TAB_WORD`-shaped constant
so `check-font-coverage` READS them (the DEPARTURES bucket cannot red; two of eleven strings were
asserted, now derived). The copy-act outcome: the floor's `share` word cell is a 1×1 grid (graft 3)
that shows `copied` / `failed` for `MOTION.outcomeHoldMs` (the shipped sublabel's literal, named)
so the visible outcome the five copy-act rows read is not lost; the spoken path stays
`.copy-status`.

---

## 4 · Motion

| verb | what | duration | curve | home |
|---|---|---|---|---|
| tray swap | display change | 0 | — | — |
| ink lift | tab word quiet → foreground | 150ms | `--ease-standard` | `MOTION.inkLiftMs: 150` |
| ribbon | the confirm taking the floor's row | 240ms | `--ease-glassGlide` | `MOTION.ribbonMs: 240` |
| confirm window | disarm timer | 2500ms | — | `MOTION.confirmWindowMs: 2500` |
| outcome hold | `copied` on the share word | as shipped, named | — | `MOTION.outcomeHoldMs` |
| the raised edge | path swap on activation | 0 | — | — |

PRM: the ribbon appears in place. Nothing moves unbidden.

---

## 5 · Plan — files, order, what dies

Replay `wf_e58b4764-0fc-39`'s diff into a fresh worktree; then:

1. `filterBudget.ts` FIRST, same commit as the divider's retirement: total 9 → **5**, union area
   coarse **5702** from the BUILT-DIST census (`filter-census-built-dist.txt`); R6 law 9 / L1
   re-cut as a PROPOSED DIFF (`instruments/law-probe-L1-L3.moved.mjs`, L1′ with its firing
   negative control) — chair §6.9; plus a new row: `url(#` inside `.tray[inert]` = 0 (the hidden
   trays are inside the count).
2. `HandDrawnOutline.vue` — `omit` and `gap` props; `gridPaths` side-segment skip.
3. `GameControlPanel.vue` — the tablist; the raised tab `omit="bottom"`, the tray `gap`; the
   `::after` patch DELETED; the comment at :208; the 8% ground DELETED; the confirm's floor form;
   the desk floor's two rows; the ink rungs; the roster split (pixels stay) + `.roster-voice` /
   `.roster-status` at the root; the ring reads `--ring-ink`; `--sheet-chrome` arm DELETED.
4. `GameGallery.vue:1459` — the ground DELETED (one confirm).
5. `typography.css` — `--type-name`; `--type-group-title` + `.section-heading{font-size}` retired;
   the 22px arm → 20.
6. `scene.css` / `GameScene.vue` — `--edge-strip-h` berth; `#fold-tools` retirement and the rail
   pin ONLY on W2's word (§8); `--sheet-chrome` consumed.
7. `DrawerTab.vue` — the edge strip (four tongues, one outline).
8. `pencilConfig.ts` — `inkLiftMs`, `ribbonMs`, `confirmWindowMs`, `outcomeHoldMs`.
9. Tests: the 23 unit failures re-aimed (the play tools' assertions move to the edge strip's own
   test; the copy-act rows read the share word cell); `access.spec.ts:341` → the edge strip;
   `access` 2.3 both halves; `zone-grammar`'s per-dimension floor over every tab; goldens off the
   worktree dist; `check-font-coverage` constants for `keep`/`peek`.

Dies: `#fold-tools` + its Teleport (on W2's word); the sticky tag's four terms + `data-under-bar`
(on W2's word); `.peek-hold-surface` + the ONE `BoilDivider`; the bar's sticky arm +
`--action-bar-h` + `scroll-padding-bottom`; the mobile heading row; the `::after` patch; the 8%
ground; the peek chip's ground; the `+17.6` seam arm; `--type-group-title`. Stays: the dock and
sheet mechanics; the tongue's berths; the tap-floor token; the chips' scribble.

---

## 6 · Prototype brief

Server `127.0.0.1:4232 --strictPort` (next free if held), private `cacheDir`, scratch Playwright
config; both engines; settle ≥700ms; `npx vite build` in the worktree → preview on a lane port →
`filter-census` via the estate's throttle config with `PLAYWRIGHT_BASE_URL`, and the goldens.
Any minted row copies the donor's `data-v-*` scope attribute.

**Crops (≤4):** (1) 390×844 dark, sheet up: `pencils` raised and running into its tray by geometry,
the floor as one piece — beside Frame B and pass 1's `f1`; (2) 390×844 light, the ribbon in the
floor's row: `keep` bare, `clear` boxed in red on bare card; (3) 1280×800 light: flank tabs, the
two-row floor with `deal · dealt` above the four verbs, the rail pinned; (4) 390×844 shut, the
board and the edge strip in its berth, beside HEAD (the +20px declared).

**Censuses:** R1 `heading-voice.spec.ts` (+900×500); R7 I2 (0.0000) / I3 (vacuous, labelled) /
I4; `access.spec.ts` 2.1/2.2/2.3 (both halves) with :341 re-aimed; `getByRole('log')` = 1 with
the tray down, both engines; the guard contrast (C2: 4.99 / 6.30 both engines; greyscale gap
3.90 / 2.51 reported; box 19.41 / 15.84); R6 `law-probe` COPY with L1′/L3′ MOVED (5, and the
gate's exit), L5, R3 re-aimed; hue census COPY (29); `filter-census` 12/12 off the dist at 5 /
5702; the NO-SCROLL gate at six cells + the short-end law at 360×560 (fits) and 360×500 (+12 ± 1);
the board's y at 390/375 (HEAD vs build, +20.00 declared; the 5.58 residual read on a HEAD arm);
the desk board's left edge at 1280/1440 (|Δ| ≤ 0.05); the gallery pi at 390/1280 (Δ 0.00);
tab/edge-strip targets ≥ 44 per dimension with the estate's firing control; `check-font-coverage`
with `keep`/`peek` derived; the unit battery and the re-aimed specs BARE.

**Success:** every row at its number; the raised edge has NO `::after`; `getByRole('log')` 1/1 tray
down; C2 4.99/6.30; filter 5 exact + union 5702; no scroll at the six cells; vh ≥ 512 portrait and
the 360×500 overflow at 12 ± 1; board +20.00 declared with the crop; goldens 4/4 unmoved (or a
DELTA row); ring on every control; M16 0 unadmitted.

---

## 7 · The reach claim — as pass 1 §7 (honest; U-10 disposes)

---

## 8 · Two W2 ballots, ASKED not taken

1. **The rail pin** (`inline-size` 324.22 at 1280 / 330 at 1440, the flank strip absolute): a
   NEW layout mechanic; built and proven (|Δ| 0.00 / 0.05 on the goldens' subject); its cost is
   the desk floor's two rows (§2.3), attached to the ballot.
2. **Retiring `#fold-tools` and W2 §2.6's sticky tag** with its four terms and the dissolve: a
   LANDED mechanic. The reason is structural (a card that does not scroll has nothing to stick
   to). If declined, §2.6's fallback holds and the family reports the duplication.

---

## 9 · Gates the family lands with

Born-RED at HEAD: NO SCROLL at six cells (699/628 today); the short-end law (fits at 360×560,
overflows 12 ± 1 at 360×500); `role="tablist"` present; R1 ROW 1/2/3; tab targets ≥ 44 per
dimension (`.mobile-heading-btn` has no `min-width` today); undo/redo/hint at 0 taps at 844×390
and 900×500; I2 coverage 0.0 (88.9% today); the one-dimming row (2.75:1 negative control); the
guard's word ≥ 4.5 light with the box ≥ 3:1 as the non-colour channel (4.20 and 1.19 on the
pass-1 tree; 16.38 + 1.19 at HEAD's gallery); `getByRole('log')` = 1 with the tray down (0 on the
pass-1 tree); the raised edge with zero `::after` (a computed-style row: `.tab.is-raised::after`
content `none`); `url(#` inside `.tray[inert]` = 0; the seam consumed (≥ 8 at 390/375/430/844×390);
I4 RED until W1 §1.5, reported beside.
Guards: filter census EXACTLY 5 + union 5702 off a built dist; goldens `cell-light` /
`grid-corner-light` byte-identical (the rail pinned); the board's y at 390/375 = HEAD + 20.00
(declared) and the desk edge |Δ| ≤ 0.05; masthead-to-board gap; `access` 2.1/2.2; hue 29; M16 0;
the tongue's own tuck and berths unmoved; the gallery Δ 0.00.
