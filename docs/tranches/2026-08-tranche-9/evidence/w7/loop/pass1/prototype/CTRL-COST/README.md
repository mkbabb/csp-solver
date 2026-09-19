# CTRL-COST · THE CONSEQUENCE LADDER — pass-1 PROTOTYPE record

Built, served and measured. Steps 1–6 of the spec's plan are in the product files of a
throwaway worktree; nothing is committed anywhere.

    WORKTREE   /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_e58b4764-0fc-40
    BRANCH     worktree-wf_e58b4764-0fc-40  (cut at aab67b92; `git diff --stat` = 13 files,
               1,003 insertions, 1,363 deletions — the family DELETES 360 lines net)
    SERVED     vite 127.0.0.1:4233 --strictPort, from the worktree
    ENGINES    playwright chromium + webkit, headless, the lane's own scratch config
               (`probe/pw.config.ts` — never the estate's default, which starts :3000)
    CELLS      desk 1280×800 fine and coarse · dock 390×844 · landscape 900×500 and 844×390
               · the seam sweep 390×844 / 375×812 / 430×932
    SETTLE     every open-sheet read is ≥950ms after the tab tap — the sheet SLIDES
    FRAMES     9 crops, 332 KB total, largest 62 KB

---

## 0 · The answer first

**It runs, and the ladder's centre holds on the real surface.** Four names in one voice at one
rank, four `<h2>`-named groups, the bar gone with its 89% burial of `players`, the sticky pin
correct at every scroll state in both cells, `fill` one reachable press from its reversal in
EVERY pose including the risen dock sheet, and the ask that does not move the box — Δ [0,0,0,0]
on the band and both faces with the second answer visible, both engines, three cells. The card
is SHORTER than HEAD at the desk (789 against 1,142), not taller.

**Three rows are RED, and two of them are the family's own doing.**

1. **G9, light.** The asking face's 8% ground is what breaks the token promise it was written
   under: `--color-red-ink` is 4.99:1 over `--color-card`, but over the mixed paper the word
   actually sits on it measures **4.22:1** — under the floor, both engines. Two one-declaration
   cures are priced in painted bytes below; the chair picks (U-10).
2. **G12.** `players` needs a **`p`** the Fraunces cut does not hold. The research's zero-byte
   finding covered `looking` / `writing` / `starting over` — the fourth name was minted in
   synthesis and never priced. The gate REDs today.
3. **G7 at 430×932.** −20.52 / −20.81px: the risen case's top edge cuts through the wordmark.
   Confirmed as the research described it, and the frame shows it.

And one unbuilt piece of work that is not a number: **the card's unit battery is not re-cut.**
15 of its 34 tests address the deleted grammar and fail. "And then the hard part" is exactly
that file.

---

## 1 · The gates, at their numbers

| gate | measured | verdict |
|---|---|---|
| **G1** r0 `heading-voice.spec.ts`, md5 `9f3f07e2de9aa25a22dbfb259225e32a` (byte-identical) | **4 passed** · names 4 (`looking` `writing` `starting over` `players`) · voices 1 (`Fraunces · 25.89 · 800 · lowercase`) · document headings 4/4 · 25.89 / 20 = **1.2945** desk AND dock | **GREEN 4/4** |
| **G2** semantic hardening | 4 `[role=group]`, every one named by an `<h2>`, one voice tuple, both engines, three cells | **GREEN 4 / 1 / 4** |
| **G3** I2′ | strips **0**, worst group coverage **0** (desk · dock · land, both engines) | **GREEN** |
| **G4** I3′ | 5 scroll states × desk and dock × both engines: **0 violations, 0 vacuous states** | **GREEN** (see the caveat in §3) |
| **G5** the ladder's acts | `fill` wrote **19–20** cells in 8/8 cells; its undo is **present, not inert, hit-testable, and lives in the `writing` band** in every pose incl. the risen sheet; **one press restored the board string exactly, 8/8**. `deal`/`clear` on a dirty coarse board: **wrote 0**, armed with **two** visible answers (`sure?` `rgb(208,42,82)` w600 + `no`), aria → `Press again to …`, a press on `no` disarms — 6/6 coarse cells. `solve`: **81 cells** at the fine desk (both engines) and **1** at the coarse desk, each restored exactly by ONE undo | **GREEN where solve writes** — see §4 |
| **G6** the confirm moves nothing | band Δ **[0,0,0,0]**, `deal` face Δ **[0,0,0,0]**, `clear` face Δ **[0,0,0,0]**, card scrollHeight Δ **0**, on the arm AND the disarm, with `no` visible — 1280×800 (coarse and fine) / 390×844 / 900×500, both engines | **GREEN** |
| **G7** the seam | 390×844 **+3.48 / +3.20** · 375×812 **+11.98 / +11.69** · 430×932 **−20.52 / −20.81** | **RED at 430** |
| **G8** height ceilings | desk **789** (port 608, ceiling 1182) · dock **744** (port 628, ceiling 760) · landscape 900×500 **749** (port 284, ceiling 820) | **GREEN, all three** |
| **G9** painted-bytes contrast | band name **19.45** / 15.84 · caption **4.66** / 7.68 · `no` **16.45** / 13.29 · asked word **4.22** / 5.29 (light / dark, both engines agree to 0.07) | **RED on the asked word, light** |
| **G10** the tap floor | 390 coarse: **28 targets, 0 failures**, worst **46 × 44**; negative controls 43×60 → wOK false, 60×43 → hOK false, 44×44 → both true | **GREEN** |
| **G11** the π guards | `FILTER_BUDGET` rows sum to **9** (r0 law probe L1) · DOM `<filter>` population **15**, the same nine budget rows' pose variants as at HEAD · hue census **byte-identical** to r0's `hue-census-HEAD.txt` · wobble probe grid σ **1.443** frame **1.145** ring **0.092** wash **0** — identical to r0's HEAD reading to the thousandth, both engines · the estate's four goldens are `cell`, `grid-corner`, `logo`, `toggle-crest` — **this family draws none of them** | **GREEN** |
| **G12** `check-font-coverage.mjs` | **FAILED: `Fraunces · .section-heading: "players" misses "p"`**; both subsets byte-unchanged (14,636 / 4,312) | **RED** |
| **G13** `check-copy-register.mjs` | 0 em/en dashes · 0 unadmitted · **0 admitted** (both B1 rows struck with their strings) · exit 0 | **GREEN** |

Typecheck and units, in the worktree: **`vue-tsc --noEmit` exit 0**; `vitest run` **Test Files 1
failed | 65 passed (66)**, **Tests 15 failed | 795 passed (810)** — every failure in
`GameControlPanel.test.ts`, every one of them an address of the deleted grammar (§5).

---

## 2 · The frames, each cited

| frame | what it shows |
|---|---|
| `rail-1280-ladder.png` | the desk rail at scrollTop 0: five settings with their chosen chips on screen (5/5), the divider, and `writing` drawing undo · redo bare beside hint · fill · solve boxed |
| `starting-over-rest-chromium-light.png` / `-armed-chromium-light.png` | the same box, `deal` → `sure?` with `no` under it. Nothing moves: the rects say Δ0 and the pair says it to the eye |
| `starting-over-rest-chromium-dark.png` / `-armed-chromium-dark.png` | the same pair at night — the red is `#ff5c7c` there, measured 5.29:1 |
| `starting-over-armed-webkit-light.png` | the same arm in the other engine |
| `ribbon-hint-boxed.png` | Ruling 2's audition: the shut pose's ribbon, `undo` and `redo` bare, `hint` boxed, peek beside it |
| `seam-430x932-chromium.png` | G7's RED, drawn: the risen case's top edge through the middle of the wordmark |
| `players-ransom-note.png` | the G12 RED. The word draws — the fallback serif's `p` is close enough that the EYE misses it, which is why the gate is the instrument that catches it |

---

## 3 · What the instruments cost to get right (four traps, all banked)

* **The r0 spec's own base URL.** `heading-voice.spec.ts` builds its context with
  `process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4231"` — the config's `baseURL` never
  reaches it. Run without the variable it measured **another live lane's server on 4231** and
  printed a green 4/4 for a card this prototype does not draw (4 `.zone-row-label` names in
  Patrick Hand at 25.89/600, a shape that exists nowhere in this tree). Every number in G1 above
  is from a run with `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4233`.
* **The board's digits are the native inputs' values.** `[role="gridcell"]` carries no text at
  all — the ink is drawn SVG — so a board string read off `innerText` OR `textContent` reports
  every act as writing nothing. Two runs of `acts.mjs` said `fill wrote 0` while the inputs went
  `9,_,6,_,4,_` → `9,3,6,8,4,5`. `.cell-native-input` is the estate's own surface
  (`e2e/access.spec.ts:311`).
* **Scroll first, then read.** A click helper that scrolls the face into view AFTER the "before"
  rect is taken reports a 229px reflow that is the scroll. G6's Δ0 is from a probe that scrolls,
  settles 250ms, reads, presses, reads.
* **A scrollport is its PADDING box.** A sticky head's `top: 0` parks it at the CONTENT edge, so
  a pin test that compares against the border box finds nothing pinned anywhere and prints
  "5 vacuous states" over a pin that is working perfectly.

**The I3′ caveat, stated because the green is real but lightly earned.** The card now scrolls
only 181px at the desk and 116px at the dock, and `looking` owns the largest share of the
scrollport at all five states in both cells. So the sweep is 5/5 correct and never sees a
handover: the instrument is green and is not yet stressed. A card with a longer `players` band
(a full room) is where I3′ earns its keep.

---

## 4 · `solve` — measured where it writes, and a question for the substrate

At the fine desk `solve` writes **81** cells and ONE undo restores the board string exactly, in
both engines: the research's "source-true, browser-unproved" row is now **proved in the browser**.
At the coarse desk it wrote **1** and undid exactly. At the dock and at 900×500 it wrote **0**
within a 6s settle (the poll holds a 5s floor under the "stable for 1s" rule precisely because a
1.25s exit reported a working solve as a dead one). A solve that writes nothing records nothing
(`useGameState.ts:687` is inside `if (cellsToAnimate.size > 0)`), so the undo row is N/A there
rather than failed.

The open question is not the ladder's: **why does `solve` no-op on the dock and in landscape on
a board where `fill` has just written 20 cells?** Banked for the chair with the readings
(`readings/acts.json`), not smoothed.

---

## 5 · The unit battery — the unbuilt half

`src/games/shared/GameControlPanel.test.ts`: **15 failed / 19 passed**. Every failure addresses
the grammar the ladder deletes —

* `four wells, each a group named by its own visible tape` · `six co-equal eyebrows become two`
  · `the mobile tab is a heading WRAPPING a button` · `the mobile tabs / the desktop staged rail:
  drawn === announced` · `the checking well says one thing` · the `.zone-row-label` row
* `renders tappable undo / redo / hint buttons … IN the fold band` and `renders a Fill button …`
  (the fold's row is empty while the sheet is up by design — amendment A's own mechanism)
* the four copy-act rows, which address `.action-verbs button.icon-btn` — the deleted bar's row
* `a still press — and a hand's own 4px tremor — still peeks`, which fails in jsdom while **the
  gesture itself works on the real surface**: measured, the laminate mounts and takes `.is-shown`
  under a 700ms hold on the divider and lifts on release, both engines (`readings/census.json`,
  `peek`). The row needs re-addressing, not the recognizer.

Re-cutting that file is real work and this pass did not do it. It is the honest cost of the
template re-cut and it belongs in the ruling.

---

## 6 · G9's RED, with both cures priced (painted bytes, 390 light, both engines)

| arm | asked word | `no` |
|---|---|---|
| **as specced** (8% ground under both words) | **4.22** | 16.45 |
| **A · the ground clears while the face ASKS** | **4.99** | 19.45 |
| **B · the ground at 4% everywhere** | **4.57** | 17.83 |

A hits the token's own promised number exactly, and costs the spec one sentence (§3.4's "the red
is the only signal that changes when the face arms" becomes two signals — the red arrives and the
weight steps back). B keeps that sentence and clears by 0.07, which is not a margin. Neither is
applied; the product in this worktree draws the spec as written.

**One cure IS applied**, because it is a caption's ink and not the family's centre: `.act-answer`
takes `--color-foreground` instead of `--color-muted-foreground`. Muted over the tier-3 ground
measured **3.94:1** — under the floor on the one caption in this card a reader PRESSES. Full ink
over the same ground is **16.45:1**. The change is one declaration with its measurement in the
comment.

---

## 7 · Findings the family does not own

* **`players` costs one glyph.** The Fraunces cut holds 30 codepoints —
  `B C D L M N S a b c d e f g h i k l m n o r s t u v w y z` plus space. No `p`. Two exits: a
  re-cut of `fraunces-subset.woff2` (the source TTFs are NOT in this tree, so the byte price
  cannot be measured here — the T2 recipe's vendored `Fraunces-VF.ttf` is gone), or a fourth name
  the cut already draws (`together` and `guests` both check out, letter by letter). This is a
  copy ruling, so it is the chair's.
* **`--type-group-title` is not the card's alone.** Deleting the 768 arm re-ranks every
  `.section-heading` below 768, and the GALLERY's staging axis labels are `.section-heading`
  too (`StagingBand.vue:140,154`). Measured: the role now resolves to `1.618rem` at 390 as well
  as at 1280 (it was `1.272rem` below 768). The spec priced +24px of card height and did not
  price the gallery.
* **The 430 seam is the cap, not the card.** `.drawer-case` top is pinned at 216 at all three
  widths — that is `--sheet-chrome: 12rem` — while the wordmark's foot moves with the viewport
  (212.52 at 390, 204.02 at 375, **236.52** at 430). The card would have to lose ~21px at 430, or
  the cap has to be derived from the masthead's foot. W2's number, exactly as the spec says.
* **r0's own probes need two amendments after this family lands.** `law-probe.mjs` L3 asserts
  `admitted === 2` — it reds the moment its own cure lands (the real gate, run bare, is GREEN:
  0 em dashes, 0 unadmitted, 0 admitted). And R3 ("the bar wears a drawn edge") reds forever
  against a deleted bar — the same species as I2 → I2′, and it wants the same treatment.

---

## 8 · What is NOT measured here

* The golden battery was not run (it needs a built dist). It is stated rather than measured that
  the four goldens are board cell, grid corner, wordmark and toggle crest and that this diff
  draws none of them — so the spec's anticipated "controls card golden DELTA" has no subject.
* Step 7 (the e2e re-cut: `zone-grammar.spec.ts`'s tab rows, `access.spec.ts`'s
  `.zone-row-label` address, `font-census.spec.ts`'s caption read) and step 8 (the landscape
  quick set) are NOT built. Landscape tap counts therefore stand at **2 presses for every act
  including undo** at 844×390 — measured, both engines, and exactly what the spec predicted for
  an unbuilt step 8.
* The gallery's guard ribbon was not exercised in a room; the `.guard-face` → `.act-face` move
  was verified structurally (the outline is a direct child of `.guard-btn`, which is what the
  hoisted `:is(.guard-btn, .icon-btn):hover > .act-face` rule requires) and by typecheck, not by
  a live hover.

---

## 9 · Tap counts from the playing pose (`readings/taps.json`)

`reach` = presses to get to the control, `presses` = reach + the act's own press. Both engines
agree exactly.

| pose | undo · redo · hint · peek | fill · solve · deal · clear · share |
|---|---|---|
| 390×844 (sheet shut) | reach 0, **1 press** | reach 1, **2 presses** |
| 844×390 | reach 1, **2 presses** | reach 1, **2 presses** |

---

## 10 · Files

    README.md                     this record
    probe/pw.config.ts            the lane's scratch config (baseURL 4233, both engines, no webServer)
    probe/heading-voice.spec.ts   r0's §1 instrument, byte-identical (md5 9f3f07e2…)
    probe/census.mjs              names/voices/ranks · I2′ · I3′ · heights · tap floor · filters · the peek
    probe/acts.mjs                G5 the acts + the undo proof · G6 zero reflow · the tap counts
    probe/seam-contrast-crops.mjs G7 the seam · G9 painted-bytes contrast · the crops
    probe/contrast-cures.mjs      G9's RED with cures A and B priced in painted bytes
    probe/gallery-rung.mjs        the ROW-3 deletion's reach beyond this card
    probe/wobble.probe.spec.ts    R3's wobble probe, byte-identical but for the filename
                                  (playwright's testMatch); run it with a `node_modules` symlink
                                  and `{"type":"module"}` beside it, PLAYWRIGHT_BASE_URL=…:4233
    readings/census.json · acts.json · zero-reflow.json · taps.json ·
    readings/seam-contrast-crops.json · contrast-cures.json ·
    readings/heading-voice-4233.txt · law-probe-proto.txt · wobble-run.txt
    frames/*.png                  the nine crops above
