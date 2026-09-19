# T9-W7 · pass 1 · SYNTHESIZE · CTRL-TABS — the index tabs

Section §10 (§1 §2 §8 §14 §15 inside) · marks M01 M03 M04 M05 M12 M13
Synthesizer: Fable 5.1. Read-only on the product. Inputs: the pass-1 research record
(`../research/CTRL-TABS/README.md`, `probe/*.json`, three crops), r0 R1/R6/R7, the owner's
frames, `T9-W7-design.md`, the charter. Nothing closes here (U-10).

Verdict carried in: ADJUST, three mandatory adjustments each a number — (i) the desk loses
the top edge (flank tabs, rail width pinned), (ii) the fit is bought by evictions (ribbon,
divider, deal row) with filterBudget re-cut 9 → 5 same commit, (iii) the reach claim
restated. This spec lands all three.

---

## 0 · The design plan, then the tell review

**Subject.** A pencil case with index tabs: four tongues on the case's edge, one tray face
up, the acts drawn as the tray's floor in one piece with the lid. The tongue is the estate's
own object (`DrawerTab.vue`); the family multiplies it by four and makes the card stop
scrolling.

**Tokens.**

| token | light | dark | job |
|---|---|---|---|
| `--color-card` | ≈ #FDFDFB | #131211 | every tongue and the tray |
| `--color-foreground` | #0A0A0A | ≈ #EDEBE7 | the raised tab's word, chosen chips |
| `--ink-press-quiet` | graphite 68% (≈ #6B6B6A on card) | ≈ #94928C | the unraised tab's word — 5.24:1 light / 6.01:1 dark painted, at FULL ground opacity |
| `--color-muted-foreground` | #737373 | ≈ #A8A69F | verbs on the floor, row captions |
| `--color-red-ink` | #D02A52 | #FF5C7C | the destructive verb when the ribbon holds the floor |
| `--ring-ink` | fg 50% mix | same | the shared authored ring (the gallery ribbon's, at 50%) |

Zero new hexes. Law for the spec, not a value: **one dimming, never two** — the ground holds
at opacity 1 and the word takes the quiet rung, or the ground dims and the word stays
foreground. Both at once measured 2.75:1.

**Type.** Patrick Hand for every tab word and row caption at φ (`--type-name` 1.618rem =
25.888px; ratio 1.294 over the 20px chip, headroom over the 1.23 floor that the 24.60 rung did
not have) · w600 (the tongue's weight) · lowercase · **letter-spacing 0** (a declared
departure from the tongue's 0.06em: tracked, four words need 378.72px against 374 at 390 and
359 at 375; untracked at 25.89 they need 352.0 and fit both). Fira Code chips at 20px, one
number every width. Fraunces leaves the card.

**Layout.** Phone/landscape: a horizontal strip of four tongues on the case's top edge, the
raised one omitting its bottom edge and continuous with the tray; the tray below; the floor
under the tray as one drawn piece with the lid. Desk: the same four tongues down the rail's
LEFT flank in vertical writing-mode, facing the board; the rail's width pinned; a fifth tab
`keys` on the desk only.

```
  PHONE 390×844                              DESK 1280×800 (rail pinned at 324.22)
  ┌─────────┐╔═════════╗┌─────────┐┌───────┐   ╔══╗
  │new game │║ pencils ║│checking ││players│   ║ne║┌──────────────────────┐
  └─────────┘║         ║└─────────┘└───────┘   ║w ║│ size  4×4 9×9 16×16  │
  ┌──────────╝         ╚────────────────────┐  ║ga║│ level Easy Med Hard  │
  │  marks     Normal   Corner   Center     │  ║me║│                      │
  │  what fits Off  On                      │  ╚══╝│       [deal] dealt ⊪ │
  ├─────────────────────────────────────────┤  ┌──┐│                      │
  │ deal  clear  fill  solve  share  [peek] │  │pe│└──────────────────────┘
  └─────────────────────────────────────────┘  │nc│═══════════════════════
     board edge: [undo][redo][hint]  [controls]  └──┘ clear fill solve share i
```

**Principles.** (1) The heading IS the tab: one string, the document heading, the tray's
name. (2) Nothing scrolls. (3) EDGE (tab) · INSIDE (row) · FLOOR (act) is the whole hierarchy.
(4) One tool home: undo · redo · hint on the board's edge on every mobile pose. (5) The
memorable thing is the raised tongue running unbroken into its tray; everything else is quiet.

**The tell review.** (a) Hidden navigation (NN/g ~20% worse discoverability): this is the
idea, not a bug, and the spec says plainly what a reader loses (§7). (b) Four tongues reading
as four drawers: bounded by forbidding the tuck and the vertical writing-mode on the phone
strip, and by the seams (three touching siblings at ~100×44, a 25.89px word; the drawer's
tongue is 92×48, 8px tucked, a 16px word). (c) "Tabs" as the generic app-kit component
(a pill row, a coloured underline): refused — no underline, no pill, no fill; the raised
state is a MISSING EDGE, which is what a physical tab does. (d) Motion: the tray swap is a
same-frame display change (W2's shipped one-panel mechanic); nothing slides. Revised from my
first plan: I had the tab word at the 24.60 floor; the research's "zero headroom" finding
moved it to the desk's own φ rung, and I re-checked the strip width at that rung (352.0 of
374 / 359).

---

## 1 · Tokens the family mints or re-points

```css
/* typography.css */
:root {
  --type-name: var(--type-heading);       /* 25.888px — the tab word and the row caption */
  --type-group-title: var(--type-name);   /* size / level, now row captions inside `new game` */
}
/* DELETE :133-137; --type-option 768–1023 arm 22 → 20 (one chip number). */

/* index.css */
:root { --ring-ink: color-mix(in srgb, var(--color-foreground) 50%, transparent); }

/* GameControlPanel.vue — the four sticky-tag terms RETIRE with the tape-as-name:
   --washi-tag-lift / -gap / -inset / -top and the data-under-bar dissolve. */
```

Radii: **0** on drawn things except the tongue's one-sided `0.75rem` (the shipped
`DrawerTab` radius, the tab's outer corners only); **0.5rem** on invisible hit boxes.
Stroke ladder: case **3** · tab, lid and floor **2.5** (one piece) · act face **2**.

---

## 2 · Components and states

### 2.1 The strip (`role="tablist"`, accessible name `controls`)

Four tabs at 390: `new game` · `pencils` · `checking` · `players`, each an `<h2
class="tab-head" style="display:contents"><button role="tab">` (the shipped
`.mobile-heading-head` host generalised; ROW 2 counts the tab words). `size` and `level` are
rows INSIDE `new game`, each an `<h3 display:contents>` caption (closes ROW 2's 4/6 → 6/6).

| state | drawn form | word | ground |
|---|---|---|---|
| **raised** (selected) | `HandDrawnOutline :pose="0" :stroke-width="2.5" :outset="3"` with the BOTTOM EDGE OMITTED (a three-sided path), continuous with the tray's lid | `--color-foreground` w600 | `--color-card`, opacity 1 |
| **at rest** | the same four-sided outline, no tuck | `--ink-press-quiet` | `--color-card`, opacity 1 |
| hover (`hover:hover`) | — | ink lift quiet → foreground, 150ms | — |
| focus | `--ring-ink` 2px solid, offset 4 (rides the tab's face) | | |
| size | ≥ **44×44** both dimensions; measured 104.45 / 79.91 / 94.39 / 83.25 × 44 at 390 with 4px seams; `min-inline-size` AND `min-height` from `--tap-floor` | | |

Keyboard: roving tabindex (one `tabindex="0"`), Left/Right (Up/Down on the desk flank) move
and ACTIVATE (automatic activation is lawful because every tray stays in the DOM, APG), Home/
End. Tray panels: `role="tabpanel" aria-labelledby=<tab>`; the three not face-up are
`inert` + `display: none` (measured: 9 tabbables in hidden trays, 0 focusable). The ariaSnapshot
is the APG shape verbatim: `tablist "controls"` → four `heading[level=2] > tab`, one
`[selected]`.

Phone strip: horizontal, `writing-mode: horizontal-tb`, NO tuck (forbidden by spec). Desk:
`writing-mode: vertical-rl` down the rail's left flank, tabs 100.77 / 75.70 / 90.19 / 79.05
tall × 48 deep, plus `keys` (the `i` crib as a fifth tab, desk only; five need 436.50 of 608).

### 2.2 The tray

One `.tray` face up: `HandDrawnOutline :pose="0" :stroke-width="2.5"`, its lid sharing the
raised tab's path (ONE path: tab + lid + sides + floor line, so the continuity is geometry,
not alignment). Rows inside: `<h3>` caption in the hand at `--type-name`, quiet ink, left;
chips centred at 20px Fira; the chosen chip's seeded scribble unchanged. Tallest trays at the
binding cell 900×500: `pencils` 121.97, `new game` 120.38 in a 284 cap (residue 214.35 → the
evictions below make it fit: the strip 44 + tray ≤122 + floor 66.77 + margins = 282).

The desk card takes `min-height` equal to the flank strip's length (measured 378.72 at 24.60;
re-measure at 25.89) so a short tray (`checking`, `players`) never lets the card fall below
the strip — the case stops changing height as you switch tabs, declared.

### 2.3 The floor (the bar, M04) — one piece with the lid

`deal · clear · fill · solve · share · peek` in one row (299.83 of 374 at 390), drawn as the
tray's floor at 2.5, the same path as the lid. The deal row leaves `new game` (its tally
`dealt ⊪` rides beside the die on the floor). Coverage: **0.0000** at the owner's pose, both
engines (there is no second group on screen to bury; I2 greens structurally). Sticky is
moot: nothing scrolls. `--action-bar-h`, `scroll-padding-bottom` and the sticky key retire.
Faces: ACT = pose-0 at 2 on the floor's verbs (glyph + Patrick Hand word at `--type-verb`),
`peek` a bare washi chip as shipped, the `i` retires into the `keys` tab on the desk.

### 2.4 One tool home (§14, M13) — the board-edge strip

`undo · redo · hint · controls` on the board's edge on EVERY mobile pose (portrait bottom
edge, landscape right flank): four tongues under one outline at 2.5, each ≥44×44, the
`controls` tongue as shipped. Free edge measured: 274 (390), 259 (375), 314 (430), 248
(900×500), 274 (844×390); three 44px targets need 132. `#fold-tools` / `.play-controls` and
its Teleport berth RETIRE; at 844×390 undo/redo/hint go from no home at all to 0 taps.
`access.spec.ts:341`'s `toHaveCount(4)` re-aims at the edge strip in the same commit.
Second-toolbar fence: it IS the toolbar — the ONE toolbar, in the tongue's idiom; the ribbon
that duplicated it is gone.

### 2.5 The confirm (§15, M12) — the ribbon takes the floor's row

While a destructive verb is armed, the guard ribbon (the house's one confirm) occupies the
FLOOR's row (66.77px at 390 — the strip's 44 cannot hold it: the face needs ~84–90px in
its gallery form, so the floor form is one line: `clear the board?` · `keep` · `clear`, verbs
≥44×44 both dimensions). `keep` returns the floor and restores focus to the armed verb (M19).
One mechanism for deal · clear · fill · solve; the in-place `sure?` retires. W1 §1.5 owns the
arming (not in the tree; Fill wrote 56 cells). The gallery ribbon's live geometry did not
reproduce in the research (`guard-face.json` null) — owed to the prototype.

### 2.6 The rail's width (the desk's one kill, and its cure)

Every in-card horizontal arm walks the desk board (−30.12 top edge; −26.00 absolute flank
with padding; −205 in-flow flank) into two committed goldens with 0.23px of headroom. The
rail is shrink-to-fit; the cure is to PIN it: `inline-size: 324.22px` at 1280 / 330 at 1440
(today's measured widths), the flank strip `position: absolute; left: 0` inside it and the
tray column narrowed to 276.22. **A W2 layout mechanic** this family does not own — named as
its hardest dependency; without it the family has no lawful desk berth.

### 2.7 The 390 seam

`--sheet-chrome: max(12.6rem, calc(var(--masthead-foot) + 8px))`; the card no longer scrolls so
its height is fixed by the tallest tray, and the sheet's cap is derived after that.

---

## 3 · Copy (M16; lowercase by CSS; no j, no x)

| site | string |
|---|---|
| tabs | `new game` · `pencils` · `checking` · `players` (+ `keys`, desk only — a NEW rendered string, priced) |
| rows | `size` · `level` · `marks` · `what fits` |
| floor | `deal` · `clear` · `fill` · `solve` · `share` · `peek` |
| edge strip | `undo` · `redo` · `hint` · `controls` |
| confirm | `clear the board?` · `start a new board?` · `fill in the sure cells?` · `fill in the whole board?` — `keep` and the verb |

`node scripts/check-font-coverage.mjs` before any of `keys` or the confirm lines ship;
`candidates` → `what fits` strikes its ADMITTED row.

---

## 4 · Motion

| verb | what | duration | curve | home |
|---|---|---|---|---|
| tray swap | display change on tab activation | **0** (same frame; W2's shipped mechanic) | — | — |
| ink lift | tab word quiet → foreground on hover | 150ms | `--ease-standard` | `MOTION.inkLiftMs: 150` |
| ribbon | the confirm replacing the floor row | 240ms | `--ease-glassGlide` | `MOTION.ribbonMs: 240` |
| the tongue's de-tilt | unchanged on the `controls` tongue only | 150ms | as shipped | — |

No tween on the raised edge: the omitted bottom edge is a path swap on activation. PRM: the
ribbon appears in place. Nothing moves unbidden.

---

## 5 · Plan — files, order, what dies

1. `typography.css` — `--type-name`; delete :133-137; the 22px arm → 20.
2. `filterBudget.ts` — **FIRST**, in the same commit as the divider's retirement: the
   `.boil-divider-wrap g.boil-pose` row (count 4) deleted; `FILTER_BUDGET_TOTAL` 9 → **5**;
   `FILTER_BUDGET_UNION_AREA` re-cut from the runner census. Exact-match both directions:
   a retirement reds CI unless the allowlist moves with it.
3. `GameControlPanel.vue` — the tablist (four `<h2 display:contents> > button[role=tab]`),
   roving tabindex (~40 lines), four `tabpanel`s with `inert`; **DELETE** `.peek-hold-surface`
   + `<BoilDivider />` (`:923`), the four `.tray-well` frames and the four `--washi-tag-*`
   terms, `.mobile-heading-row` / `showTabs` / `.heading-value` / the CSS underline
   (`:2414-2418`), the `.action-bar` sticky arm + `--action-bar-h` publisher, the `sure?`
   arms (`:506-567`, when W1 §1.5 lands), `.info-glyph`'s border; the floor as the tray's
   path; `keys` tab (desk) hosting `.legend-fold`.
4. `scene.css` / `GameScene.vue` — `#fold-tools` and its Teleport berth retire (`:394`,
   `:551-560`); `scroll-padding-bottom` (`:250-264`) retires; the rail's `inline-size`
   pinned (W2 row); `--sheet-chrome` derivation.
5. `DrawerTab.vue` — the edge strip: four tongues under one outline, one law, the portrait
   and landscape berths as shipped.
6. The ribbon shared from `GameGallery.vue`, floor-row form, `min-inline-size` on verbs.
7. `e2e/access.spec.ts:341` — `toHaveCount(4)` re-aimed at `.edge-strip button`;
   `e2e/zone-grammar.spec.ts` — the per-dimension floor row over every tab; the goldens re-run
   (expect byte-identical with the rail pinned).
8. `pencilConfig.ts` — `MOTION.inkLiftMs`, `MOTION.ribbonMs`. `check-font-coverage.mjs` /
   `check-copy-register.mjs` ledgers.

Dies (the eight orphaned surfaces, named): `#fold-tools` and its Teleport; the `portraitDock`
Teleport block; `ribbonCovered` + its `:inert`; W2 §2.6's sticky tag and its four terms and
the `data-under-bar` dissolve; `.peek-hold-surface` and the ONE `BoilDivider`; the bar's
sticky arm + `--action-bar-h` + `scroll-padding-bottom`; the mobile heading row and `showTabs`;
`access.spec.ts:341` as written. Stays: the dock and sheet mechanics (the sheet still rises);
the tongue's berths; the tap-floor token; the chips' scribble.

---

## 6 · Prototype brief

Build: `../research/CTRL-TABS/proto/overlay.mjs` (`build({arm:'a', trim:true})`) promoted to
a source patch in a throwaway worktree — the tablist with roving tabindex, the raised tab as
a three-sided path continuous with the tray, the floor with six acts, the edge strip with
undo/redo/hint, `inert` hidden trays, the desk flank in vertical-rl with the rail pinned, the
one-dimming rule, the word at 25.89 untracked, `filterBudget` re-cut to 5, the ribbon in the
floor row. Dev server in the 4230 band; scratch config; both engines; settle 700ms. Any minted
row copies the donor's `data-v-*` scope attribute (the research's trap).

Screenshots: (1) 390×844 dark sheet-up — strip, raised `pencils` running into its tray, the
floor as one piece (beside Frame B); (2) 900×500 light — one tray inside 284, the edge strip on
the right flank holding undo; (3) 1280×800 light — flank tabs, rail pinned, the board's left
edge at its golden x; (4) the ribbon in the floor row at 390, verbs 44×44.

Censuses unchanged: R1 `heading-voice.spec.ts` (+ 900×500); R7 I2/I3 (I3 becomes vacuous — no
sticky tape exists — and is labelled so, not claimed) / I4; `access.spec.ts` 2.1/2.2/2.3 with
:341 re-aimed; R6 `law-probe` L1 (now 5, re-cut) L5; `filter-census.spec.ts` at the new
allowlist; the goldens `cell-light` / `grid-corner-light`; `a11y.spec.ts`'s tablist rows.

Success: `scrollHeight ≤ clientHeight` with every tray face-up at 390×844, 375×812, 430×932,
900×500, 844×390, 1280×800, both engines; voices 1, headings 6/6, ratio 1.294 at desk/dock/
900×500; every tab and edge-strip target ≥44 both dimensions with the per-dimension control;
unraised word ≥4.5:1 painted (expect 5.24 / 6.01); I2 coverage 0.0000; hidden-tray
focusables 0; ariaSnapshot = the APG shape; undo reachable at 0 taps at 844×390 and 900×500;
board x at 1280/1440 within 0.5px of HEAD (goldens unmoved); filter census exactly 5; ribbon
verbs 44×44; seam ≥6px at 375/390/430.

---

## 7 · The reach claim, restated honestly (and what a reader loses)

From the playing view at 390: undo/redo/hint 0 taps (unchanged; at 844×390 they go from no
home to 0); `level` 3 → 2; `size`, `deal`, and the floor's acts 2; marks, what fits, checking
and play/invite **2 → 3** (open + tab + chip) unless the last tab is remembered; peek 0 → 2.
"Every option row in ≤2 taps" is unsatisfiable with four tabs. Mitigations in the spec: the
strip REMEMBERS the last raised tab per session (`sessionStorage`, a per-viewer convenience,
wrapped in try/catch, the card renders without it), and the deal row on the floor removes the
one act a reader takes most between rounds from behind any tab. What the desk reader loses:
the at-a-glance read of five settings and their values; under tabs they see one tray and four
words. That is the idea, and it is what the re-look will react to first (U-10 disposes).

---

## 8 · Gates the family lands with

Born-RED at HEAD: NO SCROLL at six cells (699/628, 743/284, 743/302, 1142/608 today); a
`role="tablist"` present in the card (none in the estate); R1 ROW 1/2/3 at four cells +
900×500; tab targets ≥44 per dimension (`.mobile-heading-btn` has no `min-width` today);
undo/redo/hint reachable at 0 taps at 844×390 and 900×500 (no home today); I2 coverage
(88.9% → 0.0); the authored ring ≥3:1 (webkit 2.15 today); the seam at 390 (−2.73 → ≥6); the
one-dimming contrast row (the naive prototype's 2.75:1 is the negative control). I4 stays
RED until W1 §1.5 lands and is reported beside.
Guards (must hold): filter census EXACTLY the re-cut 5 and the union area; the goldens
`cell-light` / `grid-corner-light` byte-identical (the rail pinned); the masthead-to-board gap;
`access.spec.ts` 2.1/2.2 with :341 re-aimed; the hue census 29 rows; M16 0 unadmitted; the
tongue's own tuck and berths unmoved (the strip forbids the tuck on tabs, the `controls`
tongue keeps it).
