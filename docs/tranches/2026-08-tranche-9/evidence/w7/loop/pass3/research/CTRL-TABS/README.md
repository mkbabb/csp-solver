# CTRL-TABS · pass 3 · RESEARCH — the tuck is −6 by law, and the pin has no closed form

Researcher: Opus 5. Read-only on the product; no product file touched, no ablation injected.
Base: MAIN at **`74a2b5d9`** (the W7 execution fold). Server `127.0.0.1:4232 --strictPort`,
private `cacheDir` in the session scratchpad (`instruments/vite.head.mts`), killed before this
file was written; the band reads empty on 4232. Both engines, headless playwright, own scripts
(`instruments/probe-head.mjs`, `instruments/probe-land812.mjs`; readings under `readings/`).
Nothing closes here (U-10). No crops: every claim below is a number or a source cite.

    THE THREE FINDINGS THAT CHANGE THE SPEC
    1. The charter's `−8` gate is the CSS literal, not the law. `#board-edge` sits +2.00px
       under the paper at EVERY portrait cell in BOTH engines, so the shipped tuck is
       **−6.00**, and `board-covisibility.spec.ts:440-520` already gates it at [−8.5, −4]
       with −6.00 banked. The pass-2 tree's +34 REDS that lock — a seventh estate spec the
       critique did not name, and it reds on a NUMBER, not a selector.
    2. The desk pin has no closed form. The card's width is a max-content of hand-set text at
       a FLUID size (`--type-small` = clamp(0.875rem, 0.8rem + 0.25vw, 1.25rem)), and
       ∂card/∂type reads 13.48 / 14.35 / 14.55 / 13.68 px-per-px across the four spans — not a
       constant, so no `calc()` reproduces 1024→1600 to 0.5px. The pin is the wrong instrument:
       the flank strip belongs in the 3.5rem gap the estate already keeps for a tongue, and
       then the card's width is HEAD's at every width and Δ is 0.00 BY CONSTRUCTION.
    3. 844×390 is not a seam problem, it is a 302px budget. `vh − clientHeight` is **88.00**
       exactly at both short-landscape cells (chrome 4rem + 1.5rem), so the tray budget is
       302 at 844×390 and **287 at 812×375** — and the pass-2 tree's landscape content is 268.
       It already fits, with 34 / 19 to spare. Chair §6.2 asks for a reading; the reading is
       comfortable.

---

## 1 · The surfaces and the tokens, with their lines

| surface | file:line (at `74a2b5d9`) | what this family does to it |
|---|---|---|
| the tongue's pose | `src/games/shared/DrawerTab.vue:171-189` (`top: calc(100% - 0.5rem)`) | the ONE declaration that lost the tuck — re-cut, §3.1 |
| the tongue's berth | `src/games/shared/GameBoard.vue:1123` + `:1195-1199` (`.board-edge`, `position: relative; width: 100%; height: 0`) | gains `--edge-strip-h`; the height is what moved the tongue |
| the strip's shell law | `GameBoard.vue:1217-1224` (`pointer-events: none` on `.board-shell` below 1024, taken back on `.board-wrapper`) | any new tongue in this berth inherits the pass-through and must take its events back |
| the rail / card | `scene.css:129-158` (cap + note berth), `:250-265` (`scroll-padding-bottom`), `:297-299`, `:308-327` (the fold sentinel), `:351-370` (the 6px gutter out of `p-5`) | the desk pin question, §3.2 |
| the gap the flank can live in | `scene.css:168-172` — `.app-layout { gap: 3.5rem }`, "air for the 48px tongue between sheet and case" | the no-pin route's berth |
| the sheet + its chrome | `scene.css:466-541` (`--sheet-chrome: 12rem`, `max-height: calc(100dvh - var(--sheet-chrome))`), `:511-515` (card `− 1.5rem`), `:595-599` (short landscape `4rem`) | the short-end law, §3.3 |
| the portrait ribbon | `scene.css:543-558` (`.fold-tools`), `GameScene.vue:149`, `GameControlPanel.vue:1389` (`<Teleport defer to="#fold-tools">`) | ballot B's subject |
| the card's own estate | `GameControlPanel.vue:761` (`.tray-well.new-game-zone`), `:908-934` (`.peek-hold-surface` + `<BoilDivider/>` at `:923`), `:940` / `:1005` / `:1040` (the three wells), `:1245` (`.action-bar`), `:1426-1435` (`.peek-chip`), `:781-800` (`.mobile-heading-row`) | the trays, the floor, the tabs |
| the divider | `src/pencil/chrome/BoilDivider.vue` (120 lines) + its ONE importer `GameControlPanel.vue:65`/`:923` | deleted, §3.4 |
| the budget | `src/pencil/config/filterBudget.ts:109-124` (the divider's row), `:184` TOTAL 9, `:211-216` union `row 45572 / coarse 6673` | 9 → 5, and the union re-derived |
| the ring | `src/assets/index.css` — **`--ring-ink` does not exist at HEAD** (grep: 0 hits in `src/`) | strike the mint, consume (registry §2.4) |
| the durations | `src/pencil/config/pencilConfig.ts` `MOTION` (`chromeLeaveMs: 200` at `:161`) | §13's ladder owns these, §5.3 |
| the copy gates | `scripts/check-font-coverage.mjs:114+` (`EXTRACT`), `:232+` (`FACES`); `scripts/check-copy-register.mjs` (the fold rewrote 937 lines) | the replay's real conflict, §6 |

Tokens this family consumes and does not own: `--sheet-chrome`, `--card-pad-t`, `--card-pad-b`,
`--action-bar-h` (published by `GameControlPanel.vue:621-638` from measured boxes), `--tap-floor`
(`App.vue:961`), `--board-col` (`scene.css:410`), `--toggle-size`, `--vv-height`
(`useKeyboardViewport.ts:147`), `--washi-tag-rung` (CTRL-TAPE's consumer-declared rung),
`--ring-ink` (MRK-LIVE's mint), the `--motion-*` rungs (MOT-LADDER's publisher).
**There is no `@property` in `src/` at HEAD** — chair §6.5's registration is entirely new estate
work, landed once by §10's leader (CTRL-TAPE), cited here.

---

## 2 · The numbers, measured at HEAD (`readings/head-74a2b5d9.json`, `readings/head-812x375-landscape.json`)

### 2.1 The tuck — one number, five cells, two engines

| cell | `.board-wrapper`.bottom | `#board-edge`.y (h) | `.drawer-tab` box | δ = edge−paper | **tuck = tongue.top − paper.bottom** |
|---|---|---|---|---|---|
| 390×844 cx / wk | 585.73 / 585.42 | 587.73 / 587.42 (0) | 92×48 @ x 286 | **+2.00** | **−6.00** |
| 375×812 | 562.23 / 561.92 | 564.23 / 563.92 (0) | 92×48 @ 271 | +2.00 | **−6.00** |
| 430×932 | 649.73 / 649.42 | 651.73 / 651.42 (0) | 92×48 @ 326 | +2.00 | **−6.00** |
| 360×560 | 424.31 / 424.02 | 426.31 / 426.02 (0) | 92×48 @ 256 | +2.00 | **−6.00** |
| 360×500 | 411.39 / 410.80 | 413.39 / 412.80 (0) | 92×48 @ 256 | +2.00 | **−6.00** |
| 844×390 (flank) | 380.00 | 382.00 (0) | 48×92 @ [597, 166.59] | +2.00 | n/a (right flank) |

The estate says why in its own words: "`top: calc(100% - 0.5rem)` is the 8px tuck, less the 2px
the wrapper's rect sits above its own flow box" (`e2e/board-covisibility.spec.ts:462-465`). Board
y at HEAD: 219.73/219.42 · 211.23/210.92 · 243.73/243.42 · 88.31/88.02 · 75.39/74.80.

### 2.2 The desk band — the card's width and what drives it

| vw | card w (cx / wk) | card clientW | content col | `--type-small` resolves | ∂card/∂type over the span |
|---|---|---|---|---|---|
| 1024 | 315.59 / 315.59 | 310 | 276 | 15.36 | — |
| 1280 | **324.22 / 324.31** | 318 | 284 | 16.00 | 13.48 |
| 1360 | **327.09 / 327.13** | 321 | 287 | 16.20 | 14.35 |
| 1440 | 330.00 / 330.00 | 324 | 290 | 16.40 | 14.55 |
| 1600 | 335.47 / 335.47 | 329 | 295 | 16.80 | 13.68 |

Card padding is `20px` left / `14px` right (the 6px gutter taken out of `p-5`, `scene.css:351-356`).
The board's x with the drawer SHUT is exactly `(vw − 640)/2` = 192 · 320 · 360 · 400 · 480 (the
board's cap is `min(42rem, 85vw, 100dvh − 10rem)` = 640 at 800 tall). With the drawer OPEN the row
is `board + 3.5rem + card`, centred, so **∂(board x)/∂(card w) = −1/2** — which is precisely the
critic's +1.44 at 1360 and +2.73 at 1600 against the pin's −2.87 and −5.47. The arithmetic closes.

### 2.3 The short end — a closed form, and the landscape budget

| cell | `--sheet-chrome` | card clientH | **vh − clientH** | card scrollH (HEAD content) | over |
|---|---|---|---|---|---|
| 390×844 | 12rem | 628 | **216.00** | 699 | 71 |
| 375×812 | 12rem | 596 | **216.00** | 699 | 103 |
| 360×560 | 12rem | 344 | **216.00** | 699 | 355 |
| 360×500 | 12rem | 284 | **216.00** | 699 | 415 |
| 430×932 | 12rem | 675.16 / 675.66 | 257 / 256 | 675 | **0 — the cap does not bind** |
| 844×390 | 4rem | 302 | **88.00** | 743 | 441 |
| 812×375 | 4rem | 287 | **88.00** | 743 | 456 |

    clientHeight = min(content, vh − chrome − 24)      chrome = 192 portrait · 64 short landscape
    fits  ⟺  content ≤ vh − 216  (portrait)  /  content ≤ vh − 88  (short landscape)

Both engines identical. 430×932 is the row that kills the pass-2 spelling: where content fits, the
cap is not the height, so the gate must assert `scrollHeight === clientHeight` (no scroll) and
derive its boundary, never assert `clientHeight === vh − 216`. With the pass-2 tree's 304 of
portrait content: fits at **vh ≥ 520**, overflow at 360×500 = 304 − 284 = **20** — the prototype's
measured 20, and the spec's 512/12 are both artefacts of the retired `max(12.6rem, …)` arm
(`--sheet-chrome` is a flat `12rem` at `scene.css:468` today; the pass-2 research's 209.6 is a
stale tree's reading).

### 2.4 W2 §2.2's reachability at HEAD (chair §6.2) — GREEN on the tongue alone

| cell | `.drawer-tab` visible | its box | `.fold-tools` | `.drawer-handle` | deal / level in first screen | docScrollH |
|---|---|---|---|---|---|---|
| 844×390 | **true** (both engines) | [597, 166.6, 48, 92] | 0×0 | 0×0 @ y 390 | false / false | 409 vs innerH 390 |
| 812×375 | **true** (both engines) | [573.5, 159.09, 48, 92] | 0×0 | 0×0 @ y 375 | false / false | 394 vs innerH 375 |

`viewport-law.spec.ts:195` is the probe the chair names, and it already exists — its `cued`
predicate is `deal ∨ level ∨ any opener visible`, and the landscape flank tongue carries it. The
row's own header still says "RED at HEAD"; that text is pre-W2 and the row is green now. This is a
GUARD to hold, not a born-RED to build: any re-cut that renames `.drawer-tab`, or that drops the
landscape flank pose, takes the chair's own condition down with it.

---

## 3 · The blocking rows, each with a derivation

### 3.1 The tuck — hang the tongue from the berth's TOP, and the berth is the protrusion

The defect is one line of arithmetic. `DrawerTab.vue:176` poses the shut portrait tongue at
`top: calc(100% - 0.5rem)` — `100%` of the berth — and the pass-2 diff gave the berth a height
(`.board-edge { height: 40px }`, `GameBoard.vue` hunk), so `100%` went 0 → 40 and the tongue went
with it. Both halves are right on their own; they cannot both be written against the same edge.

    HEAD          berth.top = paper.bottom + 2 ; berth.h = 0 → tongue.top = berth.top − 8 = paper.bottom − 6
    pass-2 tree   berth.h = 40                  → tongue.top = berth.top + 40 − 8 = paper.bottom + 34
    THE CURE      tongue hangs from the berth's TOP:  top: calc(-1 * var(--tongue-tuck, 0.5rem))
                  → tongue.top = berth.top − 8 = paper.bottom − 6.00   (HEAD's number, unmoved)
                  berth.h = tongue.h − tuck = 48 − 8 = 40
                  → tongue.bottom = berth.top + 40 = berth.bottom      (the berth EXACTLY holds the strip)

Two born-RED rows fall out, both closed-form and both engine-independent: `tuck = −6.00 ± 0.5` at
390/375/430 (and the estate's own [−8.5, −4] lock stays green), and `|tongue.bottom −
berth.bottom| ≤ 0.5`. The second is the one the pass-2 return could not have passed: it says the
berth is the protrusion rather than a number that happens to be 40.

The rejected alternative is worth stating so it is not re-tried: `height: 0; margin-bottom: 40px`
also keeps `100%` at zero, but `.board-margin`'s `margin-top: 0.4rem` currently COLLAPSES through
the zero-box berth (`GameBoard.vue:1119-1122` says so), so the flow gain would be 40 − 6.4 = 33.6
and the board would move +16.8, not +20. Padding is worse: an absolutely-positioned child's
containing block is the PADDING box, so `padding-bottom` moves the tongue exactly as `height` did.

**The cost buys something.** The board moves +20.00 (40px of flow, halved by the centred playing
block) — pass 2 measured exactly that. At HEAD the board's cells sit **19.27 chromium / 19.58
webkit** ABOVE the viewport's middle at 390×844 with 50.64 of slack, and the same pair at 390×664
with 39.84 (`board-covisibility.spec.ts:474-479`). Moving down 20 takes `offCentre` to ≈0.7 at
both rungs: the berth does not spend the centring arm, it very nearly closes it. The prototype
lane measures this rather than assuming it, at both of that lock's rungs.

### 3.2 The desk pin — there is no closed form, so stop pinning

Chair §6.3(b) refuses two literals and asks for one derived token. The measurement says a derived
token does not exist: the card's intrinsic width is the max-content of hand-set text whose size is
`clamp(0.875rem, 0.8rem + 0.25vw, 1.25rem)`, and the slope ∂card/∂type reads 13.48 / 14.35 / 14.55
/ 13.68 over the four spans of §2.2 — glyph advances quantise per size, and different rows win
max-content at different sizes. A single `calc()` fitted at 1280 over-reads 1600 by ~3px; the 0.5px
gate would red on its own token.

So ask what the pin is FOR. It exists because the flank strip eats a 3rem + 6px lane out of the
card's own column (pass-2 §2.1), which would grow the card and walk the board. Take the strip OUT
of the card's box and the reason goes with it:

- `.app-layout` already keeps **`gap: 3.5rem`** at ≥1024, and its own comment says what for: "air
  for the 48px tongue between sheet and case" (`scene.css:168-172`). A 48-wide flank tab tucked 8px
  under the card's left edge protrudes 40 into a 56px berth — **16px of clearance** to the board's
  sheet, and the identical `protrusion = width − tuck` law as §3.1's bottom edge. It is the
  estate's own sentence, unchanged: ONE LAW, THREE EDGES (`DrawerTab.vue:13-36`).
- The card's width is then HEAD's at every viewport, so the desk π row is **Δ 0.00 by
  construction** at 1024/1280/1360/1440/1600 rather than by a pin that only holds at two of them,
  the 1280-minted goldens never move, and **W2 ballot A is not needed at all** — one of the two
  asks the chair was handed goes away instead of being ruled.

Risks to price in the spec: the flank tabs ride `.scene-controls`, so they travel with the case's
glide (they are inside it already); at the closed-desk pose the case parks at `right: 3rem` with
`visibility: hidden`, so a tab hanging left of the card must not re-enter the page's own gutter
(measure `tab.left ≥ 0` at 1024, the narrowest rung); and the tuck is a negative-z fiction that
needs a stacking context, which `.board-peek-host { z-index: 20 }` provides on the desk
(`scene.css:174-176`) but which the CASE side must provide for itself.

### 3.3 The short end and 844×390 — re-cut from the measured law, and read the budget

§2.3 gives the closed form. Three gate rows, all derived:

1. NO SCROLL at the six cells: `scrollHeight === clientHeight` (HEAD reds 699/628 at 390×844 —
   re-measured here, byte-equal to pass 2's).
2. THE LAW: `vh − clientHeight === chrome + 24` wherever the cap binds (216 portrait / 88 short
   landscape), asserted at 360×500 where it must, and NOT asserted at 430×932 where the cap does
   not bind.
3. THE BOUNDARY: content + 216 ≤ vh, gated either side (fits at 360×560 · overflows by exactly
   `content − 284` at 360×500).

For 844×390 the chair has already ruled the seam out of scope and asked for a reading. The reading
is **302px of card at 844×390 and 287px at 812×375**, both engines, and the pass-2 tree's landscape
content is 268 — it fits with 34 and 19 to spare. The family's contribution to the seam (+8px of
card height) is stated as a declared delta to the masthead's owner and nothing more.

### 3.4 The divider, the budget, and the three silent fallbacks

`BoilDivider.vue` has exactly one importer at HEAD (`GameControlPanel.vue:65`, mounted at `:923`
inside `.peek-hold-surface`), and it is the budget's SOLE beat-driven row (4 poses,
`filterBudget.ts:109-124`) — the row whose own retirement trigger names only "a better bake" or "a
Chromium red". Deleting the surface is trigger (c) and the component, the row, the union figure and
R6 law 9 / L1 all move in that one commit or `filter-census` reds on a retirement (the allowlist is
exact-match in both directions). Pass 2 re-derived `coarse` 6673 → 5702 and kept `row` 45572 on the
2% tolerance; both figures must come off a BUILT dist, which is the estate's own route
(`playwright-throttle.config.ts` with `PLAYWRIGHT_BASE_URL` suppressing its build+preview).

The join's fallbacks are real and silent, and the cheapest born-RED for them is a UNIT, not a
browser row: `gridPaths.openRing` returns `undefined` on `hi <= lo`, on a gap outside the side, and
on `!crossed`, and `generateRectBoilFrames` honours `cuts` only at `radius === 0` — four ways for
the ring to re-close with nothing red. A vitest over the generator asserts (a) a cut path does not
end in `Z`, (b) the gapped side carries no point inside `[x0, x1]`, (c) each fallback condition
returns the CLOSED ring, declared; and the `radius !== 0` case becomes a dev-time throw rather than
a silent drop (NOTE-ERASE's graft: origin required, the default dies, the type error is the gate).
The browser half then only owns what a unit cannot see: `.tab.is-raised::after` computes `none`,
and the tab's open feet land within the stroke's width of the lid's line at 390×844 and at the desk
flank.

---

## 4 · Primitives to reuse, by name

| primitive | where | why this family wants it |
|---|---|---|
| `HandDrawnOutline` + `gridPaths.generateRectBoilFrames` | `src/pencil/grid/` | THE box grammar; `RectCuts`/`openRing` is already built on it (pass-2 diff) — no new component |
| the tuck fiction (`z-index: -1` under a stacking context) | `DrawerTab.vue:76-102`, `scene.css:227-248`, `GameBoard.vue:1201-1224` | the bottom-edge strip and the desk flank are the SAME pose at two rotations |
| `#board-edge` / `#fold-tools` / `#drawer-handle` berth discipline | `GameBoard.vue:1113-1123` | "a berth with a box is a box every regime pays for" — and §3.1 is what happens when one gets a box |
| `Teleport defer` between berths on one state | `GameScene.vue:136-138`, `GameControlPanel.vue:1389` | one component, one `aria-controls`, three poses |
| `SheetWashiLabel` + the consumer-declared rung `--washi-tag-rung` | CTRL-TAPE's graft (registry §3.1) | any tape this family keeps declares its rung on the consumer, which is why deck π reads 0.00 |
| the boot-frame sampler | `pass2/critique/CTRL-TAPE/probe/crit2.mjs §B` | an `addInitScript` rAF loop: the FIRST painted frame is the uncapped pose (~23ms cx / ~116ms wk) — any token this family publishes from a ResizeObserver owes this row |
| `.act-face` (one drawn face: box, hover ground, ring, coarse floor) | CTRL-COST, registry §3.5 | one face declaration for card + gallery — WITH the warning in §5.4 |
| the WebKit pre-click blur row | CTRL-COST's critic, registry §3.5 | every verb that moves focus when it arms gets a press-twice-read-the-BOARD row in both engines |
| the pseudo-element occlusion predicate + the scoped-`:focus-visible` trap | CTRL-RULE's critic, registry §3.3/§3.4 | the card paints two scroll cues as pseudo-elements; a ring authored in a scoped block compiles to `:focus-visible[data-v-x]` and cannot reach a child's chip |
| the estate's own specs at the lane's server | PLR-PLACE's critic, registry §3.18 | a two-line scratch PW config with `testDir '../e2e'` — this is how §6's 22 rows get counted |
| `useTwoTap`'s window, `PEEK_HOLD_MS` / `PEEK_SLOP_PX` | `GameControlPanel.vue:219-220` | the estate's precedent for a gesture constant living AT its recognizer |

---

## 5 · What this family collides with

### 5.1 The chair's rulings (`pass3/CHAIR-RULINGS.md`)

- **§6.2** — the seam law is scoped to portrait <1024. At 844×390 assert W2 §2.2's reachability
  probe (it exists, §2.4) and report the card's clientHeight as a reading (302 / 287).
- **§6.3(b)** — `#fold-tools`' deletion is lawful only with that probe green at 844×390 AND
  812×375 in both engines with the tab as the cued entry; the two-literal pin is refused; the
  declared fallback is BUILT before the ballot is written, and the return states the default.
- **§6.4** — the card's width outranks its content; act faces shrink-wrap (`min-width: 0`). No
  golden is re-minted inside the loop.
- **§6.5** — measured tokens get `@property` with `initial-value`, published before first paint;
  `, 0px` fallbacks are struck. This family CONSUMES (`--sheet-chrome`, `--card-pad-t`,
  `--action-bar-h`, `--tap-floor`) and CITES; §10's leader (CTRL-TAPE) lands the registration.
  One honest tension to carry: `--vv-height, 100dvh` at `scene.css:473` has a load-bearing
  fallback by its own comment ("an unpublished anchor is still a defined pose").
- **§6.1 / registry §2.4** — `--ring-ink` has one minter (MRK-LIVE, §6's leader). Strike the mint
  at `index.css` and consume `var(--ring-ink, currentColor)`.
- **§7** — numbers first, ≤4 crops ≤150 KB, private cacheDir, HEAD control named by commit,
  batteries as shell scripts in the background, the port band empty at the fold.

### 5.2 The estate's landed mechanics (W2), which are not this family's to re-cut

The dock, the sheet, the sticky tag (owner mark T9-M03, chair §6.3(a): only the owner retires a
mark), the bottom tab, the tap-floor token. `#fold-tools` and the rail pin are ASKS, and §3.2
removes the need for the second one.

### 5.3 §13's ladder owns every duration

Registry §2.1/§2.2 rule ONE ladder — whisper 150 · leave 200 · note 250 · dusk 350 · step 440 ·
throw 520 — published as `--motion-*` by `publishMotionRungs()`. The pass-2 diff mints four flat
`MOTION` keys instead:

| pass-2 key | value | what §13's law says |
|---|---|---|
| `inkLiftMs` | 150 | this IS `--motion-whisper`. Consume the rung; do not mint a second 150 |
| `ribbonMs` | 240 | a travel with no rung. `note` (250) is 10ms away; a 240 literal is what the ladder exists to refuse |
| `confirmWindowMs` | 2500 | not travel, so the delay fence keeps its literal — and it has NO consumer (`useTwoTap` does not exist in `src/` at HEAD). Hold it out of the hub, or land the consumer |
| `outcomeHoldMs` | 1600 | a hold, not travel: keeps its literal, but say so in the fence's words |

CTRL-COST measured what the 2500 window actually does when it lapses: focus moves silently back to
the armed verb, and a subsequent Enter RE-ARMS (`pass2/critique/CTRL-COST.md:96-98`). If the window
is consumed, that behaviour is the row to gate, not the number.

### 5.4 The guard's ground

The blocking condition was cured by deleting the 8% face; `.act-face` grounds on `--color-accent`
under a fine pointer, and CTRL-COST's critic measured the armed-AND-HOVERED state at **4.693 light
/ 5.078 dark** — AA by 0.193. Registry §3.12 is the section ruling: red on BARE card, the drawn box
stroking `currentColor`, the hover selector fenced inside `@media (hover: hover)`. Taking `.act-face`
for the guard means taking its hover ground into the gate's fixture, or fencing it off the
destructive word.

---

## 6 · The estate's own specs — 22 test bodies, mapped

Static census over `e2e/*.spec.ts` at `74a2b5d9` (`instruments/` has the one-liner that produced it):

| spec | test bodies at risk (line) | the classes they address |
|---|---|---|
| `zone-grammar.spec.ts` | :55 · :129 · :181 · :229 · :361 · :593 · :671 + file scope | `.tray-well`, `.section-heading`, `.washi-tag`, `.peek-hold-surface` |
| `viewport-law.spec.ts` | :195 (**the chair's reachability row**) · :396 (§2.5 tape/interactive) · :720 (M01 baseline) · :798 (§2.3 baseline) | `#fold-tools`, `.washi-tag`, `.tray-well`, `.play-controls` |
| `board-covisibility.spec.ts` | :254 · :397 (**carries the −6.00 edge lock at :440-520**) | `#fold-tools`, `.play-controls`, and the TUCK NUMBER |
| `mobile-affordances.spec.ts` | :184 · :233 · :339 | `#fold-tools`, `.peek-hold-surface` |
| `access.spec.ts` | :255 · :328 | `.play-controls` |
| `join-language.spec.ts` | :134 | `.tray-well` |
| `visual-regression.spec.ts` | :790 | `.peek-hold-surface` |
| `filter-census.spec.ts` | :320 (G3.3, **built-dist config**) | `.washi-tag` |

Seven of the eight run in the default suite; `filter-census` rides `playwright-throttle.config.ts`.
The route (registry §3.18, §3.22): serve the worktree on the lane port, copy `playwright.config.ts`
into `<worktree>/web/frontend/` with `webServer` dropped and `baseURL` set (a config under `docs/`
cannot resolve `@playwright/test`; ESM ignores `NODE_PATH`, so a probe script imports the estate's
install by absolute path — this lane's own probes do exactly that).

**The row the pass-2 critique missed**: `board-covisibility.spec.ts`'s edge lock reds on the
prototype tree not because a selector moved but because `tuck` is +34 where the lock demands
[−8.5, −4]. It is the one estate assertion that already tests this family's memorable object.

## 6.1 · The replay onto `74a2b5d9` — five files, one of them expensive

`git diff a8fee1f5 74a2b5d9` touches 16 files under `web/frontend`; the pass-2 diff (16 files,
+1,704 / −1,476) overlaps on five:

| file | fold's delta | what the replay owes |
|---|---|---|
| `scripts/check-copy-register.mjs` | **+937** (the G17 discovery grammar) | the pass-2 hunk is a 15-line struck admission — re-cut onto the new file, keep the fold's grammar |
| `scripts/check-font-coverage.mjs` | +34 (`paperNoteCopy` extractor, `.error-note-text` face, `"finishes the board for you"`, `"what fits"`) | the pass-2 hunk adds `tabWords` / `bareWords` / `guardLines` extractors to the SAME `EXTRACT` object and a new FACE; both survive, merged |
| `src/games/shared/GameControlPanel.vue` | +13 (`candidates` → `what fits`, B1b's solve tape) | the pass-2 diff rewrites 2,493 lines of this file — the fold's two copy strings are LAW and win |
| `src/games/shared/GameBoard.vue` | +56 (`hoveredPos` reads the focused cell; the `@media not all and (hover:hover)` block deleted) | the pass-2 hunk is a new `.board-edge` rule in the style block, ~28 lines below the fold's own; no textual conflict, but §3.1 re-cuts it anyway |
| `src/games/shared/GameControlPanel.test.ts` | +4 | trivial |

---

## 7 · Sketches

### 7.1 The bottom edge, with the law written on it (390×844, portrait coarse)

```
            .board-wrapper (the paper)                    numbers, both engines
   ┌───────────────────────────────────────────┐
   │                                           │
   │              the board                    │
   │                                           │
   └───────────────────────────────────────────┘  ← paper.bottom          585.73
        ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌ +2.00 ╌╌╌╌╌╌╌╌╌╌  #board-edge.top       587.73
   ┌──────────┬──────────┬──────────┬──────────┐
   │   undo   │   redo   │   hint   │ controls │  ← the strip, 48 tall
   │          │          │          │          │     tongue.top = berth.top − 8
   └──────────┴──────────┴──────────┴──────────┘  ← tongue.bottom == berth.bottom
                                                     berth.h = 48 − 8 = 40

   tuck = tongue.top − paper.bottom = −6.00        (board-covisibility's [−8.5, −4])
   flow = 40  →  the centred playing block moves the board +20.00, declared
   WRONG (pass 2): berth.h = 40 AND top: calc(100% − 0.5rem)  →  tuck +34
```

### 7.2 The desk flank, without a pin (1280×800, drawer open)

```
        board (640)            gap 3.5rem = 56        .controls-card (HEAD's own width)
  ┌───────────────────────┐ │←──────56──────→│ ┌────────────────────────────┐
  │                       │ │                │ │  size   4×4  9×9  16×16    │
  │                       │ │        ┌───────┼─┤  level  easy med hard      │
  │        the paper      │ │        │ new   │ │                            │
  │                       │ │        │ game  ├─┤       [deal]  dealt ⊪      │
  │                       │ │        └───────┼─┤                            │
  │                       │ │        ┌───────┼─┤  clear  fill  solve  share │
  └───────────────────────┘ │        │pencils│ │                            │
                            │        └───────┼─└────────────────────────────┘
                            │←─ 40 out ─→│←8→│  tuck under the card's own edge
                                              ↑ 16px of clearance to the sheet

  card w = HEAD's at every viewport → Δ 0.00 at 1024/1280/1360/1440/1600 BY CONSTRUCTION
  (the pinned arm instead: 324.22 at ≥1024 / 330 at ≥1440 → the board walks 1.44 and 2.73)
```

### 7.3 The join, and the four ways it re-closes in silence

```
   the raised tab          omit="bottom"          ← path ENDS WITHOUT Z
   ┌─────────┐
   │ pencils │                                    feet land on the lid's own line
   └─ ─ ─ ─ ─┘ ← no bottom                        |foot.y − lid.y| ≤ strokeWidth (2.5)
   ═══════╗   ╔═══════════════════════            the lid, gap=[tab.left, tab.right]
          ╚═══╝ ← the hole is the tab's mouth      no lid point inside [x0, x1]

   openRing → undefined (the CLOSED ring is drawn, nothing reds) when:
     · hi <= lo          · the gap falls outside the side     · !crossed
   generateRectBoilFrames drops cuts whenever radius !== 0, silently.
   → the unit gate asserts all four; radius !== 0 becomes a throw, not a drop.
```

---

## 8 · Risks, in the order they can sink the family

1. **The tuck gate written at −8 reds a healthy tree.** The charter's number is the CSS literal;
   the estate's is −6.00 at five cells in two engines, with `board-covisibility.spec.ts:462-479`
   holding [−8.5, −4] and the comment explaining the 2px. A gate at exactly −8 would ask the
   design to move the tongue off the line the estate has drawn it on since W2.
2. **The no-pin route is a layout change in W2's territory.** Moving the flank strip into
   `.app-layout`'s gap touches nothing W2 owns by declaration, but the gap's 3.5rem is the DRAWER's
   air; if the case's glide or the parked pose puts the strip over the board at any frame, the row
   dies. Measure at 1024 (the narrowest desk rung) and through the glide, both engines.
3. **`--ring-ink`'s value is not this family's.** Pass 2 measured 3.72:1 on foreground@50%. MRK-LIVE
   mints the token and §6 rules the opacity rank; the ring's contrast number must be re-read off
   whatever lands, against 1.4.11's 3:1, not restated.
4. **The budget's two arms.** `coarse` 6673 → 5702 is measured; `row` 45572 is carried on a 2%
   tolerance. Both must come off a BUILT dist in the commit that deletes the divider, or the
   exact-match allowlist reds in the direction nobody guards.
5. **`visibility: hidden` trays are inside the census.** `filter-census.spec.ts:38-41` counts them;
   the hidden trays carry no filter today, and the moment one does the budget grows by three
   invisibly. The mechanism belongs in `filterBudget.ts` where the count is declared.
6. **The copy-gate replay.** The fold rewrote `check-copy-register.mjs` by 937 lines and re-cut two
   strings the pass-2 FACES table asserts (`candidates` → `what fits`, `the solver finishes the
   board` → `finishes the board for you`). A replay that takes the pass-2 file wholesale silently
   reverts B1b.
7. **The 2500ms window moves focus.** If `confirmWindowMs` is consumed rather than held out, the
   lapse hands focus back to the armed verb and the next Enter re-arms (COST's measurement). A
   duration with a consumer is a behaviour, and this one has a defect attached.
8. **WebKit's pre-click blur** on every verb that moves focus when it arms — the graft exists
   because COST's second press never dealt. The guard's `keep`/`clear` pair is exactly that shape.
9. **The dock sheet slides**: settle ≥700ms (this lane used 950ms) before any open-sheet box is
   read, or the card's height is measured mid-travel.

---

## 9 · Housekeeping

- Servers: one, `127.0.0.1:4232` (MAIN `74a2b5d9`, private cacheDir in the scratchpad), **killed**;
  `lsof` on 4232 is empty. 4231 and 4234 were held by sibling lanes and were not touched.
- Instruments: `instruments/vite.head.mts`, `instruments/probe-head.mjs`,
  `instruments/probe-land812.mjs`. Readings: `readings/head-74a2b5d9.json` (55 KB),
  `readings/head-812x375-landscape.json`. Logs: `logs/probe-head.log`.
- Nothing under `r0/`, `pass1/` or `pass2/` was written; no r0 instrument was re-run in place.
- No crops banked (0 of the 4 allowed): every row above is a number or a cite.
