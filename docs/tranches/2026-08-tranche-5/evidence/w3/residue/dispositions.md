# T5-W3 row 3.6 — THE RESIDUE: 15 of 15 dispositioned

**Source of the corpus** `evidence/audit/r1/a11y.md` §A — 15 findings, enumerated from the file
itself: **H1 H2 H3 · M4 M5 M6 M7 M8 M9 · L10 L11 L12 L13 L14 L15**. Nine are this lane's (the
residue beyond the five cure rows); six landed in the sibling lanes and are cited here so the
ledger-diff reads 15, not 9.

**One correction to the charter's arithmetic, stated rather than papered over.** T5-W3's row 3.6
reads "6 medium beyond M4-M6, 6 low". `a11y.md` carries **six mediums in total** (M4…M9), so the
residue mediums are **three** (M7, M8, M9), not six. The lows are six (L10…L15). The residue is
**9 rows**, and all nine are below. Nothing was dropped to reach that number — the count in the
charter was simply wrong about the file it cites.

---

## The ledger

| # | row | verdict | evidence |
|---|---|---|---|
| **H1** | `role="grid"` owns 81 `gridcell`s with no `row` layer | **LANDED — lane B1** (row 3.1). `BoardHost.vue` groups cells into `role="row"` wrappers at `display:contents`, N rows × N cells, `aria-rowindex` on both. 10/10 green, five boards × two engines. | `w3/b1-grid-and-census/00-README.md`, `01-3.1-3.5-green.txt`, `02-ax-tree-chromium.txt` |
| **H2** | the destructive-work guard is silent to AT | **LANDED — lane B2** (row 3.2). Announcement + `aria-modal` + focus containment on `.gallery-guard`. | `w3/b2-guard-speaks/02-units-green.txt`, `03-e2e-3.2-green.txt`, `05-e2e-gallery-guard-green.txt` |
| **H3** | the picker exposes 1 of 5 options | **LANDED — lane B3** (row 3.3). `inert` re-scoped off the option root onto `.game-card-deal`; the browser's own AX tree publishes five named options. | `w3/b3-picker/00-record.md`, `02-probe-3.3-green.txt`, `04-ax-tree-live.txt` |
| **M4** | `K` swallows Ctrl+K / Cmd+K, scoped to nothing | **LANDED — lane B4** (row 3.4). `useShortcutPolicy.ts` states the rule once at the capture phase; `stopPropagation`, never `preventDefault`. | `w3/b4-shortcuts-guarded/02-units-green.txt`, `03-e2e-3.4.txt` |
| **M5** | every filled cell announces its digit twice | **LANDED — lane B1** (row 3.5). The `HandwrittenGlyph` USAGE in `DigitCell.vue` marked decorative; 61 in-grid echoes → 0. | `w3/b1-grid-and-census/00-README.md`, `01-3.1-3.5-green.txt` |
| **M6** | 93 unnamed graphics, 81 inside the gridcells | **LANDED — lane B1 (81) + THIS LANE (the last 12).** B1 cured the per-cell ghost rings inside its fence and banked the remaining 12 as out-of-fence, by owner, with the one-line cure each. This lane closed them: `aria-hidden="true"` on the root `<svg>` of `HandDrawnOutline.vue`, `HandDrawnGrid.vue`, `BoilDivider.vue` and all eight `chrome/icons/*.vue`. **93 → 12 → 0**, both engines. | `w3/b1-grid-and-census/05-residual-census-outside-fence.md` (the routing); this lane's `01-born-red-probe-whole.txt` (12, RED) → `04-probe-whole-green.txt` (0, GREEN) |
| **M7** | the drawer moves focus like a dialog while being neither dialog nor named region | **LANDED.** `GameScene.vue` `#controls-drawer` gains `role="region"` + `aria-label="controls"` — the tab's own drawn word, so one string serves the tongue and the AT label. `aria-controls` now names something nameable; at closed-idle the rail is inert + `visibility:hidden`, so the landmark is correctly absent at rest. Measured `{role:null,label:null}` → `{role:"region",label:"controls"}`. | `07-residue-probe.txt` §m7; `05-regression-whole-suite.txt` (drawer.spec.ts green, both engines) |
| **M8** | the coarse tap-target floor is width-blind for the section tabs | **LANDED.** `index.css` — `.mobile-heading-btn` joins `.ctrl-btn` on the `min-width: 2.75rem` half of the coarse floor. The block's own note ("chips ONLY … the others are full-width or icon-sized already") was true of the other two surfaces and false of this one. Measured at 390×844 coarse: the "Size" tab **41.2 × 44 → 44 × 44**, the sole sub-44 control on the page gone; the row still fits its card (334 ≤ 350) and the document does not scroll horizontally. | `07-residue-probe.txt` §m8; `05-regression-whole-suite.txt` (zone-grammar coarse 44px-floor row + mobile-affordances green) |
| **M9** | `<h2>` nested inside `<button>` | **LANDED.** `GameControlPanel.vue` — the APG disclosure shape, inverted: the heading WRAPS the button, the inner eyebrow is a `<span>` keeping class and `aria-label`, and `.mobile-heading-head` is `display: contents` so the button stays the flex item and no pixel moves. Heading navigation keeps its stop and no longer lands inside a control. Measured at 390: **2 headings-in-buttons → 0**. | `07-residue-probe.txt` §m9mobile; unit gate in `GameControlPanel.test.ts` (born-RED, `02-units-born-red.txt`) |
| **L10** | the keyboard legend misstates redo, and omits two of the five keys | **LANDED.** `KeyboardLegend.vue` now renders `SINGLE_KEY_SHORTCUTS` instead of hand-spelling three of them (so a key cannot again be bound and advertised nowhere), and redo prints **⌘/Ctrl ⇧ Z** — the chord `GameBoard.vue:458-466` actually binds; bare Shift+Z was never reachable. This also closes the gate lane B4 measured but could not reach from its fence (`3.4 › a keyboard-shortcuts help names k, g, h, p and d` — RED at HEAD, missing `g` and `d`). | `w3/b4-shortcuts-guarded/04-help-affordance-blocked.txt` (the routing); `01-born-red-probe-whole.txt` → `04-probe-whole-green.txt`; `KeyboardLegend.test.ts` (5 rows, born-RED) |
| **L11** | five orphan `role="tooltip"` nodes float in the AX tree | **LANDED — and it re-cut a standing gate, declared loudly.** `SheetWashiLabel.vue`: the default (hover/focus) tape drops `role="tooltip"` for `aria-hidden="true"`. Nothing pointed at those five (`aria-describedby` = 0 hits estate-wide) and each one's text is its own button's `aria-label` re-spelled, so wiring five references would have bought five second recitations. Measured **5 orphan tooltips → 0**. **`e2e/zone-grammar.spec.ts:182-188` asserted the opposite** (the transient tape KEEPS the role) and one clause of it was re-cut, not relaxed: `role === null && aria-hidden === "true"` is strictly more specific than `role === "tooltip"`, the tag/persistent arms are byte-unchanged, and a `role="tooltip"` returning to either arm still reds. See §"What this lane changed outside its own files". | `07-residue-probe.txt` §l11; `SheetWashiLabel.test.ts` (6 rows, born-RED); `05-regression-whole-suite.txt` (zone-grammar 8/8 green, both engines) |
| **L12** | a dead tab stop on the difficulty tally | **LANDED (the a11y half).** `DifficultyTally.vue` drops `tabindex="0"`; the `:focus-visible` rule it drew goes with it, being unreachable. `role="img"` + the always-on `aria-label` stay — the graphic is still published to a reader browsing the card. Measured: the stop between "Deal a new board" and "Normal" is gone, and with it one of the four sub-44 coarse targets. **The parsimony half is NOT mine and is not claimed**: `TallyDescriptor.expand` is still consumer-less with 5 unit rows, and r2 §6 C4 assigns that (with the T′ collapse) to the BC wave — **routed to W4b**. | `07-residue-probe.txt` §l12; `DifficultyTally.test.ts` (4 rows, born-RED); routing per `audit/r2/design-loop-open-rows.md` §6 C4 |
| **L13** | two controls live outside every landmark, and there is no skip link | **RETIRED — with the cost stated on measurement.** The two orphans are `AttributionCard` and the corner `DarkModeToggle`, and they are the **first two of the page's 25 tab stops**: a linear-Tab user reaches them in ≤2 keystrokes and `<main>` is the third stop, so a skip link would save nobody a keystroke and landmark-jumping would reach a page that is one region. r1 scores it Low and says so in its own words ("Low harm here"). The cure is a restructure of `App.vue`'s root — **a cure lane's file this wave** (lane B4's shortcut-policy install) and the frame every W4 front re-lays. Partial credit banked, not claimed: M7's cure adds a second landmark, so the live census moved `["main"]` → `["main", "div[region]"]`. Re-audition it when W4c's carrier re-homes the chrome. | `07-residue-probe.txt` §l13 (landmarks, the four outside-`main` stops, `skipLink:false`) |
| **L14** | `role="separator"` carries a pointer-only gesture and a 95-char label | **ROUTED — W4c (MOBILE / F3), the C3 merged row.** Not retired and not mine to land: r2 §6 **C3** merges M4 + L14 + the keypad-band geometry into *one peek affordance, one accessible name, one guarded key*, owns it to the F3 wave, and requires the 296px keypad-band cell to be **re-taken against whatever control lands** — "give the peek a real focusable control or drop the separator's claim, and shorten the name". W3 landed C3's first third (M4, lane B4). Shortening the label here would pre-empt an adjudicated design row and invalidate the geometry cell it must be measured with. Unmoved by this lane and re-measured: `labelChars: 95, focusable: false`, both runs. | `audit/r2/design-loop-open-rows.md` §6 C3; `waves/T5-W4-design.md` §W4c; `07-residue-probe.txt` §l14 |
| **L15** | focus indication on the main control cluster is UA default | **RETIRED — with the cost stated on measurement.** Re-verified at source: `GameControlPanel.vue` carries **zero** `:focus-visible` rules (its two matches are comments at `:959` and `:1159`), `OptionSelector.vue` zero, against **10** files that do author a ring. And the UA ring is **not suppressed**: the four `outline: none` sites in `src/` are each scoped and each substitutes a drawn ring. So **WCAG 2.4.7 passes today** — r1 says so itself ("Not a failure; an inconsistency"). What is missing is the estate's crayon ring on ~20 stops, i.e. which ring, at what offset, in what register — a skin decision the design loop owns, and W4 may re-skin these controls but cannot regress W3's gates. No W4 row claims it (r2 §6 lists L15 among the rows with no design counterpart), so it is retired rather than routed to a row that does not exist. | `07-residue-probe.txt` §L15 (the source-level figures, and the discarded live figure, named as discarded) |

**Tally — 15/15.** Landed 6 by the sibling lanes · landed 7 by this lane (M6-residual, M7, M8,
M9, L10, L11, L12) · retired 2 (L13, L15) · routed 1 whole (L14 → W4c) and 1 half (L12's
`TallyDescriptor.expand` → W4b). No silent drops.

---

## What this lane changed outside its own files

Two spec files were edited. Neither is `e2e/a11y.spec.ts` (read-only to this lane, untouched) and
no golden was touched or re-baselined. Both edits are declared here because a wave record that
hides them is worth less than the cures.

**1. `e2e/zone-grammar.spec.ts` — one clause of the tape row (L11).** The row asserted
`role === "tooltip"` on the transient tape. r1 L11 is a live-AX finding filed *after* that row
was written, and the clause was that row's negative control, not an independent ruling: its
subject is *the permanent tape is a LABEL, not a tooltip*, and both halves of that survive
verbatim. The clause now asserts `role === null && aria-hidden === "true"` — a strictly stronger
statement about the same node, in the same direction. It was NOT weakened to make a cure pass:
the assertion still fails on the pre-cure tree, and it still fails if `role="tooltip"` returns to
either arm.

**2. `e2e/font-census.spec.ts` — two rows added to the exact-match LEDGER (L10).** The crib's new
`G` and `D` keycaps render outside the Patrick Hand cut (its only capitals are C/R/S), so the
census reddened 2/2 engines on `"G" (kbd) misses U+0047` / `"D" (kbd) misses U+0044`. **That red
was mine and is recorded as mine.** The ledger already carries a *keycap* class — K, H, P, Z,
Ctrl, ⌘, ⇧ — with the adjudicated reason "a keycap that renders in the system face still reads as
the key it names"; G and D are its 5th and 6th members under that identical reason. No new class,
no ceiling: the ledger is exact-match and a genuinely new mixed string still reds. Re-cutting the
woff2 is the owner-declined byte cost the ledger exists to stand in for (spec header `:24-26`).

---

## Gates run, whole

| gate | result |
|---|---|
| `e2e/a11y.spec.ts`, whole, both engines | **8 failed / 22 passed → 30/30 GREEN** (`01-…` → `04-…`). Row 3.6's own two stability tests were RED at lane start, on the census this lane closed. |
| unit battery | **444/444**, 41 files (428 at lane start + **16 new**: KeyboardLegend 5, SheetWashiLabel 6, DifficultyTally 4, GameControlPanel +1) |
| the 16 new units, born RED by ablation | **10 failed / 21 passed** with the four cures removed and the defects restored verbatim (`02-…`), then restored byte-for-byte from a pre-ablation copy |
| whole default e2e suite, both engines | 252 passed / 11 failed — **10 are the sibling lanes' banked out-of-fence collisions** (`gallery.spec.ts` :22/:57/:149 ×2 engines, retarget patch in `b3-picker/05-…`; `gallery-deal.spec.ts` :197/:318 ×2, `b1-…/07-…`), **1 is a load flake** (`affordances.spec.ts:155` webkit — 20/20 green re-run serially, twice). **Zero reds belong to this lane.** |
| π goldens (darwin, built dist on :4244) | **4/4, three runs of four; one intermittent breach** of `toggle-crest-dark` at ratio 0.03 vs the 0.017 soul floor, the failing member wandering on an unchanged dist. The two non-convergent surfaces, the mechanism booked in the config's own words. **Nothing re-baselined; `e2e/goldens/` untouched.** Flagged for verify to re-run π. |
| `vue-tsc -b` · prettier · eslint · `lint:boundary` · `lint:knip` · `lint:ink` | all clean |

## Files this lane touched

`src/pencil/grid/HandDrawnOutline.vue` · `src/pencil/grid/HandDrawnGrid/HandDrawnGrid.vue` ·
`src/pencil/chrome/BoilDivider.vue` · `src/pencil/chrome/icons/{Dice,Eraser,FillForced,Hint,Redo,Share,Solve,Undo}Icon.vue` ·
`src/pencil/chrome/KeyboardLegend.vue` · `src/pencil/sheet/SheetWashiLabel.vue` ·
`src/games/shared/GameScene.vue` · `src/games/shared/GameControlPanel.vue` ·
`src/games/shared/DifficultyTally.vue` · `src/assets/index.css` ·
tests: `KeyboardLegend.test.ts` · `SheetWashiLabel.test.ts` · `DifficultyTally.test.ts` ·
`GameControlPanel.test.ts` (+1 row) · `e2e/zone-grammar.spec.ts` (one clause) ·
`e2e/font-census.spec.ts` (two ledger rows).

None is a cure lane's file: the four lanes' diff is `App.vue`, `BoardHost.vue`, `DigitCell.vue`,
`GameCard.vue`, `GameGallery.vue`, `useShortcutPolicy.ts`, `e2e/a11y.spec.ts` and their tests —
re-read fresh at lane start and left alone.
