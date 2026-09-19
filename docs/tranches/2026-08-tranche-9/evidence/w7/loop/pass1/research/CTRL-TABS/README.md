# CTRL-TABS · pass 1 (RESEARCH) — THE INDEX TABS

Family: the card stops scrolling; its compartments become index tabs on the card's edge, one
tray face-up, the heading IS the tab, the bar is the tray's floor. §10 with §1 §2 §8 §14 §15
inside it · marks M01 M03 M04 M05 M12 M13.

    TREE      7b0610cc + the uncommitted lane work in the working tree. READ-ONLY on the
              product: no file under `web/frontend/` was touched, no worktree was needed.
              Everything here is `addStyleTag` + `page.evaluate`.
    SERVERS   npx vite --host 127.0.0.1 --port 4232 --strictPort  (this lane)
              npx vite --host 127.0.0.1 --port 4247 --strictPort  (so r0's owners-eye
              instruments, which hardcode 4247, could be re-run UNCHANGED)
    ENGINES   playwright chromium + webkit, headless, own scripts and own config
              (`probe/pw.config.ts`). Never the estate's default. No Safari, no osascript,
              no :3000. M19 clean.
    CELLS     390×844 · 375×812 · 430×932 · 900×500 · 844×390 · 1280×800 · 1440×900,
              light and dark where the claim is a colour one
    SETTLE    every open-sheet read is ≥950 ms after the tap — the sheet SLIDES
    VERDICT   **ADJUST.** The centre holds on measurement; two of its clauses do not, and one
              kill condition is met outright. See §8.

---

## 1 · Substrate, verified on this tree

| claim in the charter | on this tree |
|---|---|
| `DrawerTab.vue:76,:151-154,:13-40` the tongue | HOLDS. `HandDrawnOutline :stroke-width="2.5" :outset="3"` at `:65`; one-sided radius `0 0.75rem 0.75rem 0` at `:128`; washi word `--type-small` w600 `letter-spacing: 0.06em` at `:133-145`; focus ring `2px dashed currentColor` offset 3 at `:151-154`; four berths at `:110`, `:171`, `:203`, `:262` |
| `SheetWashiLabel.vue` `anchor="tag"`, tilt, clip-path | HOLDS. The tag is sticky and in flow with a net flow height of zero — the three terms live at `GameControlPanel.vue:1484-1486` (`--washi-tag-lift: 3px`, `--washi-tag-gap: 0.1rem`, `--washi-tag-inset: 0.35rem`) and `:1500` (`--washi-tag-top`), not at `SheetWashiLabel.vue:171-173`. **What replaces the zero-flow construction once the tape is a tab: nothing — the tape leaves the tray entirely.** The strip is a real 44px flex row in the card's own flow (measured `strip 374×44` at 390), so the lift/gap/inset triple and the `data-under-bar` dissolve retire with it |
| `GameControlPanel.vue:786-793` the `display: contents` heading host | HOLDS, and it generalises: `<h2 class="mobile-heading-head">` wrapping `<button class="mobile-heading-btn">` at `:792-795`. Four `<h2 style="display:contents">` wrappers over four `role="tab"` buttons published the APG tree exactly (`probe/i2-spoken.json`) |
| the four wells at `:769, :952, :1006, :1042` | HOLDS — four `aria-labelledby` `role="group"` tray-wells, each named by its own `SheetWashiLabel` |
| `:1382-1430` `#fold-tools`, portrait only | HOLDS. `.fold-tools` is `display: none` outside portrait (`scene.css:394`, turned on at `:551`); measured 366×61.58 at 390×844 and **0×0 at 900×500 and 844×390** |
| `scene.css:466` the landscape dock, `:468` `--sheet-chrome` | HOLDS with a correction: `--sheet-chrome` is **12rem at 900×500**, not 4rem. The 4rem arm (`scene.css:596-598`) needs `max-height: 500px` AND `min-aspect-ratio: 2/1`; 900×500 is 1.80. Card cap = 500 − 192 − 24 = **284px**, as the charter says, but by the 12rem arm |
| the card gives 284px at 900×500 | **CONFIRMED, measured**: `.controls-card` clientHeight 284 at 900×500; 302 at 844×390 (there the 4rem arm does fire); 628 at 390×844; 608 at 1280×800 |
| `e2e/access.spec.ts` 2.1/2.2, `a11y.spec.ts` tablist rows | 2.1/2.2 exist and are as described. **There are no tablist rows anywhere in the estate**: `grep -rn 'role="tab' src/ e2e/` returns nothing. This family mints the estate's first tablist |

**The overflow the family exists to cure, re-derived** (`probe/readings.json`):

| cell | card scrollHeight / clientHeight | below the fold |
|---|---|---|
| 390×844 | 699 / 628 | 71px (10.2%) |
| 900×500 | 743 / 284 | 459px (61.8%) |
| 844×390 | 743 / 302 | 441px (59.4%) |
| 1280×800 | 1142 / 608 | 534px (46.8%) |

The formation's "43% desk / 58% landscape" moves to **46.8% / 61.8%** on this tree.

---

## 2 · What the card actually spends (`probe/residue.json`)

The first cut of the prototype hid three trays and the card still would not fit at 900×500.
Naming the residue is what made the family work, so it is the record's first table.

At 900×500, `checking` alone face-up, everything else shipped:

    card pad                  12.00   (6 top + 6 bottom)
    .control-panel-wrap mt    12.00
    .peek-hold-surface        46.00   the zone-separator BoilDivider
    .action-bar               66.77
    .play-controls            61.58   (55.98 + 5.60 mt) — IN the card outside portrait
    tray margins              16.00
    ─────────────────────────────────
    residue                  214.35   against a 284px card: 69.6px left for a tray

The family's own moves take three of those rows out — the tools leave for the board's edge, the
divider retires with the zones it separated, the deal verb lands on the floor — and that is the
whole of why it fits. **The fit is not bought by the tabs; it is bought by the evictions.** A
synthesizer that keeps the ribbon or the divider and adds tabs has a card that still scrolls.

---

## 3 · (1) NO SCROLL — GREEN at every cell, both engines

`probe/fit.probe.mjs` → `fit.json`, and `greened.probe.mjs` → `greened.json` (the same run with
ROW 1/2/3 satisfied, below). `scrollHeight ≤ clientHeight` with each tray face-up:

| cell | client | new game | pencils | checking | players | verdict |
|---|---|---|---|---|---|---|
| 390×844 | 628 | 118.38 | 153.78 | 66.38 | 70.36 | FIT ×4 |
| 375×812 | 596 | 118.38 | 153.78 | 66.38 | 70.36 | FIT ×4 |
| 430×932 | 675 | 118.38 | 119.97 | 66.38 | 70.36 | FIT ×4 |
| 900×500 | **284** | 120.38 | 121.97 | 67.38 | 70.36 | FIT ×4 |
| 844×390 | 302 | 120.38 | 121.97 | 67.38 | 70.36 | FIT ×4 |
| 1280×800 | 608 | 322.75 | 233.97 | 142.75 | 66.41 | FIT ×4 |

chromium and webkit agree to the hundredth at every cell.

**The tallest tray, named.** Not `new game`. At the binding cell (900×500) it is **`pencils` at
121.97px**; `new game` is 120.38. The charter's estimate ("`new game`, two rows + deal, ~260px")
is a **pessimistic guess that does not survive the eviction of the deal row** — with `deal` on
the floor and size/level in the estate's own `.zone-row` shape, `new game` is 120.38px, and the
two-row tray that sets the ceiling is `pencils` (marks + candidates, each with a caption and a
hint tape). On the desk the tallest is `new game` at 322.75, in a 608px card.

**One prototype trap worth banking.** `.zone-row` lives in a `<style scoped>` block. A row minted
by `document.createElement` without the component's `data-v-…` hash gets none of it: the row
computed `display: block`, the caption fell to its own line, and each row cost **24px more**
(`new game` 168.38 instead of 120.38, which put 900×500 over by 36). The overlay now copies the
scope attributes off a donor `.zone-row` (`proto/overlay.mjs`). Any later overlay that mints
estate markup must do the same or it will measure a card that does not exist.

**Sticky is moot — proved at 900×500.** With one tray face-up the card's content is 282px in a
284px scrollport, so `maxScroll` is 0 and nothing can scroll out from under a pinned tape. R7's
I3 (a pinned tape naming a group under half on screen) is unreachable by construction, not cured
by a rule. That is the strongest single thing this family does for M03's "properly sticky".

---

## 4 · (2) THE TAB — the fork resolves on a number, and it is not the one the charter expected

### The rank the law demands

R1 ROW 3: a group name must clear the option chip it captions by **1.23×**. The chip computes
20.00px on the phone and on the desk, 22.00px at 900×500, so the tab word's floor is
**24.60px** (27.06px at 900×500). The tab word at the washi tag's own rung (`--type-tag`, 14px)
scores **0.70** — ROW 3 lands *further* from the law than HEAD's 1.0175.

### What fits at that rung (`probe/rank-vs-row.json`, both engines identical)

Four words `new game · pencils · checking · players`, 8px of padding a tab, 4px seams:

| cell | strip width | need, 0.06em tracked | need, untracked | five tabs (`keys`) |
|---|---|---|---|---|
| 390×844 | 374 | **378.72 (over 4.72)** | 334.45 (fits) | 386.34 (over 12.34) |
| 375×812 | 359 | **378.72 (over 19.72)** | 334.45 (fits) | 386.34 (over 27.34) |
| 430×932 | 414 | 378.72 (fits) | 334.45 (fits) | 386.34 (fits) |
| 900×500 | 884 | 412.19 (fits) | 363.50 (fits) | 419.38 (fits) |
| **1280×800** | **284.22** | **378.72 (over 94.50)** | **334.45 (over 50.23)** | hopeless |

Two-line tabs (the longest single word sets the column) need 334.86 — fits the phone, still
**over the desk's 284.22 by 50.64**.

So: **the tab word must drop the hand's 0.06em tracking to fit 390 and 375** (a declared
departure from the tongue's own spelling at `DrawerTab.vue:138`), and **the fifth tab `keys`
does not fit the phone's row at the ROW-3 rung at all** — it is desk-only, which is what the
charter proposed, and now it is a measurement rather than a preference.

### The desk: the top edge FAILS, the flank passes the rank and fails the goldens

`probe/board-walk.json`, 1280×800 and 1440×900, both engines, before/after:

| desk arm | card width | board Δx |
|---|---|---|
| tabs across the top edge | 324.22 → 384.45 (+60.23) | **−30.12px** |
| the same, with the strip fenced to `width:100%` and `min-width:0` tabs | 324.22 → 384.45 (+60.23) | **−30.12px** |
| tabs down the left flank, in flow | 324.22 → 734.23 (+410.01) | **−205.00px** |
| tabs down the left flank, `position: absolute` + `padding-left` (`flank-fenced.json`) | 324.22 → 376.22 (+52.00) | **−26.00px** |

**KILL CONDITION 3 IS MET, by two orders of magnitude over the 3px the goldens tolerate.** And
the fence does not work: the desk card is the rail's *shrink-to-fit* box, so a strip's
min-content, a tab's `min-width`, and even `padding-left` on the wrap all contribute intrinsic
width. `webkit` walks 23–27px where chromium walks 26–30px, so the two engines would also
disagree about where the board is.

The only desk shape left is to stop the rail being shrink-to-fit — pin the card's width at
today's 324.22 (1280) / 330.00 (1440) and let the flank take its 48px out of the *content*
column, which drops the tray's width to 276.22 and re-wraps every chip row. That is a layout
mechanic, which is W2's, and it is a real cost this family owes the wave in writing.

One more flank finding: the vertical strip at the ROW-3 rung is **378.72px long** (four tabs:
104.88 · 80.84 · 96.81 · 84.19, + 3 seams) and the desk card is content-sized up to 608. With
`checking` or `players` face-up the card shrinks below the strip and **the card scrolls again**
(measured: over by 73 and 153 at 1280×800). A flank strip therefore requires the card to take a
`min-height` of the strip's own length. That is a defensible decision — the case stops changing
height as you switch tabs — but it must be declared, not discovered.

### The tap floor, with a per-dimension negative control

`probe/variant.json`. Every tab at every cell, both engines: ≥44 in **both** dimensions
(e.g. 390×844: 104.45×44 · 79.91×44 · 94.39×44 · 83.25×44; the vertical flank: 48×100.77 ·
48×75.70 · 48×90.19 · 48×79.05). The row is not vacuous — forcing one tab to `height: 40px`
catches exactly one row on the H arm, and forcing another to `width: 40px` catches exactly one
on the W arm, at every cell and in both engines (`negH=1 negW=1`, 20 cells).

### The quiet rung's contrast — a defect the prototype found in itself

Painted bytes, canvas read-back over the tab word's own box, modal ground against the extreme
ink pixel (`probe/variant.probe.mjs`, `painted()`):

| tab | light | dark |
|---|---|---|
| unselected, word at `--ink-press-quiet` **on a 0.68-opacity tab** | **2.75** | **3.37 / 3.44** |
| unselected, word at `--ink-press-quiet`, tab at full opacity | **5.24** | **6.01 / 6.07** |
| selected, `--color-foreground` | 19.45 | 15.84 |

**One dimming, never two.** The quiet rung and a dimmed tab ground compound to ~46% effective
ink and fail AA. The spec must state it: the unselected tab either dims its GROUND and keeps
`--color-foreground` on the word, or keeps the ground and writes the word at
`--ink-press-quiet`. Not both.

---

## 5 · (3) VOICE and (5) HIDDEN TRAYS — the instruments, before and after

### R1's §1 instrument, re-run UNCHANGED against this lane's server

`evidence/w7/loop/r0/r1-controls/probe/heading-voice.spec.ts`, r0's own config, this tree:
**4 cells, 4 failed** — 8 names, **3 voices**, **2/8** document headings, dock ratio **1.0175**.
Byte-identical to `born-red-head.txt`. The born-RED control reproduces.

### The same three rows under the overlay (`probe/heading-voice-under-overlay.spec.ts`, `greened.json`)

| row | at HEAD | first overlay (tab at `--type-tag`) | greened overlay |
|---|---|---|---|
| ROW 1 · one voice | 3 | 2 | **1 — GREEN** |
| ROW 2 · every name a document heading | 2/8 | 0/6 | **4/6** |
| ROW 3 · name ÷ option ≥ 1.23 | 1.0175 | **0.70** | **1.23 — GREEN, at the floor exactly** |

ROW 1 greens only when the tab word and the row caption share family, size, weight and transform
— which is this family's own claim stated as type: hierarchy is **EDGE (tab) vs INSIDE (row) vs
FLOOR (act)**, carried by position and ink, never by size. The cost is that the row captions rise
14 → 24.60px with the tabs, and that cost is already inside every height in §3.

ROW 2's residue is two rows, not four: the four tab words are `<h2>`s (the `display: contents`
host at `GameControlPanel.vue:786-793`, generalised); the two row captions inside `new game` are
still bare spans. One `<h3 style="display:contents">` per row caption closes it. Not prototyped
— named, with its shape.

ROW 3 lands on **1.23 exactly**, which is zero headroom against a soft floor. The spec should
take the desk's own φ rung (25.89px, ratio 1.294) rather than the floor; measured, four
untracked words at 25.89 need 352.0 against 374 at 390 and 359 at 375, so it still fits.

### What a screen reader hears at the strip (`probe/i2-spoken.json`, `ariaSnapshot`, both engines)

    - tablist "controls":
      - heading "new game" [level=2]:
        - tab "new game" [selected]
      - heading "pencils" [level=2]:
        - tab "pencils"
      - heading "checking" [level=2]:
        - tab "checking"
      - heading "players" [level=2]:
        - tab "players"

Four `aria-labelledby` wells become four `tabpanel`s named by their tab, the visible word and the
accessible name are the same string by construction (the one-string law, law 33, holds without a
second literal), roving tabindex publishes exactly one `tabindex="0"`, and APG's arrow/Home/End
contract is 22 lines of the overlay.

### The three hidden trays

`inert` on the three not face-up. Across every cell and both engines: **9 tabbables in the hidden
trays, 0 focusable** (`fit.json`, `hiddenTrayFocusable: 0`) — `el.focus()` is attempted on each
and `document.activeElement` never lands. access 2.1's "no control focuses into a ≥96% burial"
and 2.2's "no covered control stays tabbable" are satisfied by construction: an inert control
leaves both censuses, which is the same mechanism `GameCard.vue`'s `:inert="!isActive"` already
uses and the same one access 2.2 was written to reward.

### I2 and I4, re-run UNCHANGED on :4247

`evidence/w7/loop/r0/r7-owners-eye/instruments/owners-eye.instruments.mjs`, this tree:
**6 RED / 7**, matching `readings-at-head.json` — I2 `ownChrome=false`, worst group coverage
**88.9%** (`players`); I4 Deal armed, Clear armed, **Fill wrote 56 cells**, Solve neither.

Under the overlay, at the owner's own pose (390×844 dark, sheet settled), I2's coverage arm
measured with I2's own geometry: **worst group coverage 0.0000** against 0.8892 at HEAD
(chromium; webkit 0.8894 → 0.0000). **I2 greens**, and it greens for a structural reason rather
than a z-index one: the bar is the floor of a tray that is the only tray on screen, so there is
no second group under it. The chrome half of I2 is satisfied by a drawn top edge; the prototype
used a CSS border as a stand-in and the spec owes it `HandDrawnOutline :pose="0"` (law 37).

---

## 6 · (4) REACH, (6) THE FLOOR, (7) ONE TOOL HOME, (8) CONFIRM

### (4) REACH — the family fails its own requirement, by arithmetic

From the playing view at 390×844, sheet shut:

| act | today | under this family |
|---|---|---|
| undo · redo · hint | 0 | **0** (the board-edge strip) |
| peek | 0 | 2 (the floor) — **regressed** |
| size · level | 2 / **3** | **2** (face-up tray) — level improves |
| deal · clear · fill · solve · share | 2 | 2 (the floor) |
| marks · candidates | 2 | **3** (open + tab + chip) — regressed |
| checking | 2 | **3** — regressed |
| play / invite | 2 | **3** — regressed |

One act improves (`level`, 3 → 2, the §8 defect this family deletes outright); four regress by
one tap. **"Every option row reachable in ≤2 taps" is unsatisfiable with four tabs** — only the
face-up tray's options are two taps away, and that is the cost of the idea, not a flaw in the
prototype. The honest mitigations are a remembered last tab (the cost is paid once per session)
or fewer compartments. Both are the synthesizer's to choose; neither makes the table above go
away.

### (6) THE FLOOR — green, with its stroke stated

The bar carries `clear · fill · solve · share` plus the evicted `deal` and `peek` — six acts,
spending 299.83 of 374 at 390 (`fit.json`, `floor.spend`; six targets, five at 48×57.98 and `peek` at 59.83×44), one row, no wrap. Nothing is buried
(I2 = 0.0000). Its stroke must be **2.5** against the case's 3 and the wells' 1.5, which is the
ladder R1 measured and this family keeps: case 3 > tab strip and floor 2.5 > nothing, because
the wells' 1.5 retires with the wells (the tray is the tab's panel, not a box inside a box).
Crop: `frames/c1-strip-and-tray-390x844-chromium-dark.png` — the strip, the raised `pencils`
tongue continuous with its tray, and the floor as one drawn piece.

### (7) ONE TOOL HOME — green at every mobile pose

The board's free edge beside the tongue (`probe/variant.json`, `toolHome`), sheet shut:

| cell | axis | paper edge | tongue | free | three 44px targets need 132 |
|---|---|---|---|---|---|
| 390×844 | bottom | 366 | 92 | **274** | fits, 142 for seams |
| 375×812 | bottom | 351 | 92 | **259** | fits, 127 |
| 430×932 | bottom | 406 | 92 | **314** | fits, 182 |
| 900×500 | right flank | 340 | 92 | **248** | fits, 116 |
| 844×390 | right flank | 366 | 92 | **274** | fits, 142 |
| 1280×800 | right flank | 640 | 92 | **548** | fits, 416 |

M13's hardest cell is cured by the same move: at 844×390 `#fold-tools` is 0×0 and
`.play-controls` sits at y 1070.61 — off screen inside a fixed sheet — so undo, redo and hint
have **no home at all** today; on the strip they are at 0 taps in both landscapes. The strip does
not read as a second toolbar because it is the tongue's own idiom repeated (one drawn tongue per
tool, the same 2.5 stroke, the same washi word) rather than a new bar with a ground.

`#fold-tools` (366×61.58 at 390) and its Teleport berth retire. **Named orphans, all of them:**

1. `#fold-tools` / `.fold-tools` — `scene.css:394` (the `display: none` default) and `:551-560`
   (the portrait row) — the Teleport berth and its composed-row comment.
2. The `Teleport defer to="#fold-tools" :disabled="!portraitDock"` at `GameControlPanel.vue`'s
   play-tools block, with the `defer` finding the comment records.
3. `ribbonCovered` and its `:inert` on `.play-controls` (T7-W2 A2) — no ribbon, no cover.
4. W2 §2.6's **sticky washi tag**: 4 tags compute `position: sticky` today (`i2-spoken.json`,
   `stickyTags: 4`); under tabs the tape is not the name and the scrollport cannot take it away.
   `--washi-tag-lift/-gap/-inset/-top` (`GameControlPanel.vue:1484-1500`) and the
   `data-under-bar` dissolve go with it.
5. `.peek-hold-surface` and **the estate's ONE `BoilDivider`** (`GameControlPanel.vue:923`).
   This is the expensive one: the divider owns **4 of the 9 rows** in `filterBudget.ts:112-123`,
   and that budget is exact-match **in both directions** — its own header says "A new filter
   surface reds CI even when an old one retires". Retiring the divider takes the census 9 → 5 and
   reds `filter-census` unless `filterBudget.ts` and `FILTER_BUDGET_UNION_AREA` are re-cut in the
   same commit. A budget that can only be cut downward with a ruling is a ruling this family owes.
6. `.action-bar`'s sticky arm and `--action-bar-h` / `scroll-padding-bottom`
   (`scene.css:250-264`) — a card that does not scroll has nothing to stick to and nothing to
   scroll-pad. W2 §2.5's note berth stays (the bar is still the one positioned ancestor).
7. `.mobile-heading-row` / `.mobile-heading-btn` / `.heading-value` and the `showTabs` branch
   (`GameControlPanel.vue:781-812`) — §8's own subject, deleted rather than cured.
8. **`e2e/access.spec.ts:341`** asserts `expect(page.locator(".play-controls button")).toHaveCount(4)`
   as its not-vacuous control. Measured under the overlay: **3** (peek moved to the floor). That
   row must be re-aimed at the strip in the same commit, or the cure reds a gate that was written
   to reward it.

### (8) CONFIRM and the 390 seam

I4 is RED at HEAD on this tree (Fill writes 56 cells on one tap) and **W1.1 is still not in the
tree**, so there is no arming to dress. What can be priced is the FACE. The house ribbon's verbs
are bare hit targets wrapping a `.guard-face` at `--type-body` / line-height 1 / padding
`0.32rem 0.9rem`, with `min-height: 44px` on coarse (`GameGallery.vue` CSS, the block at
`:1395-1465`). So the two verbs alone need 44px and the title + sub lines need ~40 more:
**~84–90px against a 44px tab-strip row.** "The ribbon replaces the strip row" therefore means
either the strip's row grows while armed (a 44 → ~88px band, which moves the tray under it) or
the ribbon takes the **floor's** row instead (66.77px at 390, closer, and the floor is where the
destructive verbs now live). The second is the shape this lane would put to the adjudicator. The
lane's attempt to drive the live gallery ribbon for its real box did not reproduce
(`probe/guard-face.json`, all four cells null) — that measurement is owed to pass 2.

The 390 seam (case stroke vs wordmark, −2.73/−3.02px) is untouched by this family: the strip
lands *inside* the card, and the sheet's top edge is where it was. No cure chosen, no cure
needed here; it stays with the family that owns the case.

---

## 7 · The fork, answered

**(a) the drawer tongue's idiom vs (b) the washi tape promoted.** Both were driven on the same
DOM with only the skin swapped (`proto/overlay.mjs`, `.proto-arm-tongue` / `.proto-arm-tape`),
so every number in §3–§5 is common to them. The separating facts:

- A tape lying flat on a surface is not a tab. Arm (b) has to pull the selected tape **out** of
  the plane to read as chosen, and the only pull-out the house owns is the washi's own ±1.5°
  tilt — which is a *seed-stable decoration*, not a state. Using it as the selected state makes
  the tilt mean two things at once, and it leaves the unselected tapes flat, i.e. not tabs. Arm
  (b) also cannot carry the continuity the idea's centre rests on: a tape cannot be continuous
  with the tray beneath it, because the tape has no bottom edge to omit.
- Arm (a)'s risk is that four tongues read as four drawers. Measured, that risk is bounded by
  one number: the drawer's tongue is **92×48 with 8px of tuck and a word at 16px w600**; a tab is
  **~100×44 with no tuck, a word at 24.60px, and three siblings touching it**. Four boxes in a
  touching row with one raised is the index-tab gestalt, not four drawers — but the spec must
  forbid the tuck and the vertical writing-mode on the strip, or the resemblance becomes real.
  `frames/c1-…` is the read at 390.
- **Arm (a) wins on the evidence available in pass 1.** Arm (b) is not refuted on a number; it is
  refuted on the house's own law 17 (washi is neutral tinted paper) plus the absence of any
  drawn edge to be continuous with. Pass 2 should still draw (b) once at the ROW-3 rung before
  the fork closes.

**Top edge vs the rail's left flank on the desk.** The flank wins, and not on taste: four tab
words at the rank ROW 3 demands need **378.72px** and the desk's strip is **284.22px** — the top
edge cannot hold them at any tracking (over by 94.50 tracked, 50.23 untracked, 50.64 as two-line
tabs). Down the flank the constraint becomes the card's height (608), where the same four tabs
need 378.72 and a fifth (`keys`) needs 436.50 — both fit with room. `frames/c3-…` is the read.
The flank's price is §4's two rows: the rail must stop being shrink-to-fit, and the card must
take a min-height equal to the strip.

---

## 8 · Kill conditions, and the recommendation

| kill condition | verdict |
|---|---|
| four of five groups hidden at rest — "0×0 until discovered" generalised | **MET, and it is the idea.** A reader loses the at-a-glance read of every setting: today a desk reader sees `size · level · marks · candidates · checking` and their chosen values in one glance; under tabs they see one tray and four words. The drawn tab names are the only argument, and they are a real one at 24.60px — but four regressed tap counts (§6) are the price in numbers |
| a fifth compartment does not fit in 358px at 44px per tab | **MET on the phone at the ROW-3 rung**: five words need 386.34 against 374 (390) and 359 (375). `keys` is desk-only, on the flank, where five need 436.50 in 608 |
| tabs on the rail's left flank widen the row and walk the board 3px into `cell-light` / `grid-corner-light` | **MET, catastrophically**: −26px fenced, −205px in flow, −30px even on the top edge. Every in-card horizontal space contributes to a shrink-to-fit rail. Cure exists (pin the rail's width) but it is a W2 mechanic |
| the W2 mechanics orphaned | **EIGHT surfaces, enumerated in §6**, one of which (the BoilDivider) moves the live-filter census 9 → 5 against an exact-match-both-directions budget, and one of which (access 2.2's count-4 control) reds a gate the cure was written to satisfy |
| arm (b) must show a flat tape is not a tab | **NOT SHOWN.** Arm (b) is refused on the idiom, not on a number |
| arm (a) must show four tongues do not read as four drawers | **SHOWN, conditionally**: the tuck and the vertical writing-mode must not come with the idiom |

### Recommendation — ADJUST

The centre survives contact with the tree, and it survives it decisively where it matters most:
**the card stops scrolling at every cell in both engines, one tray face-up, with the tallest tray
measured** — and it does so while greening ROW 1 and ROW 3 of the born-RED heading instrument and
R7's I2, and while closing the estate's worst reach hole (undo at 844×390). No other approach in
this wave has to clear a 284px card; this one does, with 12px to spare.

Three adjustments are not optional, and each is a number rather than a taste. **First, the desk
loses the top edge**: four tab words at the rank the law demands need 378.72px against a 284.22px
rail, so the desk's tabs go down the left flank in vertical writing-mode, and the rail must stop
being shrink-to-fit or the board walks 26–30px into two committed goldens. **Second, the fit is
bought by evictions, not by tabs** — the ribbon, the divider and the deal row must all leave, and
the divider's departure re-cuts `filterBudget.ts` from 9 rows to 5 in the same commit or CI reds
in the direction nobody guards. **Third, the reach requirement must be restated**: four tabs mean
three compartments are one tap further away than today, and the family should own that in writing
rather than claim ≤2 taps it cannot deliver.

What would kill it in pass 2: a ruling that the rail's width may not be pinned (the desk then has
no lawful tab berth at the required rank), or an owner who reads the four hidden trays as a loss
rather than a hierarchy. Neither is a measurement this lane can take. U-10: nothing closes here.

---

## 9 · Files

| path | what it is |
|---|---|
| `probe/pw.config.ts` | the scratch config — no `webServer`, no `globalSetup`, baseURL 4232, both engines |
| `probe/ctrl-tabs.probe.mjs` → `readings.json` | baseline geometry + the first overlay, 4 cells × 2 engines |
| `probe/residue.probe.mjs` → `residue.json` | every pixel the card spends that is not a tray |
| `probe/tray-and-strip.probe.mjs` → `tray-and-strip.json` | the `new game` tray decomposed; the board's free edge, 6 cells |
| `probe/fit.probe.mjs` → `fit.json` | (1) NO SCROLL under the full prototype; tab boxes; hidden-tray focus; painted contrast |
| `probe/variant.probe.mjs` → `variant.json` | undimmed contrast; the per-dimension negative control; the tool-home edge |
| `probe/rank-vs-row.probe.mjs` → `rank-vs-row.json` | the ROW-3 rung swept against the strip, horizontal and vertical |
| `probe/greened.probe.mjs` → `greened.json` | ROW 1/2/3 satisfied *and* the fit re-measured, both desk arms |
| `probe/board-walk.probe.mjs` → `board-walk.json` | kill condition 3, three arms, 1280 and 1440 |
| `probe/flank-fenced.probe.mjs` → `flank-fenced.json` | the absolutely-positioned flank; why the fence fails |
| `probe/i2-spoken.probe.mjs` → `i2-spoken.json` | I2 under the overlay; the AX tree; the orphan census |
| `probe/guard-face.probe.mjs` → `guard-face.json` | §15's face — did NOT reproduce; owed to pass 2 |
| `probe/heading-voice-under-overlay.spec.ts` | R1 ROW 1/2/3, same reader and thresholds, after the overlay |
| `proto/overlay.mjs` | the prototype itself: `CSS` + `build({arm, trim})`, replayable |
| `frames/c1-strip-and-tray-390x844-chromium-dark.png` | 31.7 KB — the strip, the raised tongue continuous with its tray, the floor (§6) |
| `frames/c2-strip-900x500-chromium-light.png` | 33.7 KB — the binding cell, one tray in 284px (§3) |
| `frames/c3-rail-flank-1280x800-chromium-light.png` | 34.3 KB — the desk's flank tabs in vertical writing-mode (§7) |

Re-run: `npx vite --host 127.0.0.1 --port 4232 --strictPort` from `web/frontend`, then
`node probe/<name>.probe.mjs`. For the spec:
`NODE_PATH=$PWD/node_modules PLAYWRIGHT_BASE_URL=http://127.0.0.1:4232 npx playwright test --config=<this dir>/probe/pw.config.ts`.

---

## 10 · Sketches (measured, not schematic — every number is from §3–§6)

**S1 · the phone, 390×844, sheet up.** Strip 374×44; four tabs 104.45 · 79.91 · 94.39 · 83.25,
seams 4; the raised tab omits its bottom edge and is continuous with the tray; the floor is the
tray's own foot at stroke 2.5. Card 628, content 495 → no scroll.

    ┌──────────────────────────────────────────────┐ card top, case stroke 3
    │ ┌─────────┐╔═════════╗┌──────────┐┌────────┐ │  strip 44px
    │ │new game │║ pencils ║│ checking ││players │ │  word 24.60px, tracking 0
    │ └─────────╝║         ╚└──────────┘└────────┘ │  selected: no bottom edge
    │ ┌──────────╨──────────────────────────────┐  │
    │ │ marks       Normal   Corner   Center    │  │  tray 153.78 · stroke 2.5
    │ │ candidates  Off      On                 │  │  row caption 24.60px, quiet ink
    │ └─────────────────────────────────────────┘  │
    │ ══════════════════════════════════════════   │  FLOOR, 2.5, one piece with the lid
    │  deal  clear  fill  solve  share   [peek]    │  6 acts, 299.83 of 374
    └──────────────────────────────────────────────┘
       board edge, shut: [undo][redo][hint]  [controls]   ← 274px free, 132 needed

**S2 · the binding cell, 900×500, sheet up.** `--sheet-chrome` 12rem → card 284. Every tray fits;
`pencils` is the tallest at 121.97. `#fold-tools` is 0×0 here, so the strip is undo's only home.

    ┌───────────────────────────────────────────────────────────────┐ 900 wide
    │ ┌────────────┐╔════════════╗┌────────────┐┌────────────┐      │ 44
    │ │  new game  │║  pencils   ║│  checking  ││  players   │      │ tabs 227/211/220/213
    │ └────────────╝║            ╚└────────────┘└────────────┘      │
    │ ┌─────────────╨──────────────────────────────────────────┐    │ 121.97
    │ │ marks  Normal Corner Center │ candidates  Off  On      │    │
    │ └────────────────────────────────────────────────────────┘    │
    │ ══════════════════════════════════════════════════════════    │ 66.77
    │   deal   clear   fill   solve   share   [peek]                │
    └───────────────────────────────────────────────────────────────┘ 284 total, 282 used

**S3 · the desk, 1280×800 — the flank, because the top edge cannot hold the words.** Four tabs
need 378.72px; the top edge has 284.22, the flank has 608. Vertical writing-mode, one-sided
radius on the left, the raised tab continuous with the tray.

           ╔═╗
    ┌──────╢n╟──────────────────────────┐   card, width PINNED at 324.22
    │┌──┐  ║e║  ┌───────────────────────┐│   (unpinned it walks the board 26–30px)
    ││p │  ║w║  │ size    4×4  9×9  16×16││
    ││e │  ╚═╝  │ level   Easy Med  Hard ││   tray 322.75 in 608
    ││n │       │                        ││
    │└──┘┌──┐   │        [deal]  dealt ●●││
    │    │c │   └────────────────────────┘│
    │    └──┘                             │   strip 378.72 long → the card takes a
    │    ┌──┐   ════════════════════════  │   min-height of the strip, or a short
    │    │p │    clear fill solve share i │   tray lets the strip overflow (+73, +153)
    │    └──┘                             │
    └─────────────────────────────────────┘
      ↑ new game · pencils · checking · players, 100.77 / 75.70 / 90.19 / 79.05 tall,
        48 deep — and `keys` as a fifth needs 436.50 of the 608 available.

---

## 11 · Prior art (background only — the verdict above comes from the codebase)

- **WAI-ARIA APG, Tabs pattern.** Roving tabindex is the named technique: the active tab carries
  `tabindex="0"`, every other `tabindex="-1"`. The overlay implements it verbatim and publishes
  exactly one zero (`probe/i2-spoken.json`). APG recommends MANUAL activation (Space/Enter/click)
  *unless* every panel's content is already in the DOM, in which case AUTOMATIC activation on
  focus is admissible. Under this family all four trays are in the DOM the whole time — only
  `display` and `inert` change — so **automatic activation is the lawful choice here**, and it is
  also the one that makes arrow-key browsing of the compartments feel like flipping index tabs.
  <https://www.w3.org/WAI/ARIA/apg/patterns/tabs/> ·
  <https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/>
- **NN/g, "Tabs, Used Right" and the hidden-navigation work.** Two findings bear directly on the
  kill condition in §8. (a) Unselected tabs that fade too far into the background stop reading as
  options at all — which is the same defect this lane measured as a number: at 0.68 ground × the
  0.68 quiet rung the unselected tab word painted **2.75:1**, and the cure is one dimming rather
  than two. (b) Hidden navigation measures ~20% worse on discoverability than visible or
  partially visible navigation — the honest external counterweight to "four of five groups hidden
  at rest". Short labels are their other recommendation, and this family's four are already
  short; it is the RANK the house's own ROW 3 demands (24.60px) that makes them wide.
  <https://www.nngroup.com/articles/tabs-used-right/> ·
  <https://www.nngroup.com/articles/hamburger-menus/>
- **Baymard, "Avoid Horizontal Tabs" (product pages).** Their finding is that expanded or
  collapsed sections beat horizontal tabs on content discovery. It is worth reading against this
  family precisely because the product's CURRENT shape is the collapsed-sections one and the
  owner's marks are complaints about it — so the external result and the owner's eye disagree,
  and U-10 settles that, not a citation. <https://baymard.com/blog/avoid-horizontal-tabs>
