# T9-W7 · pass 3 · RESEARCH · CTRL-TAPE — the taped case (§10 leader)

What a synthesizer needs to write the pass-3 spec for this family, read off the tree at
`74a2b5d9` (the W7 execution fold, master HEAD) and off the pass-2 worktree
`.claude/worktrees/wf_8630d340-e56-28` (21 files, 1563+/619−, uncommitted, still standing).

Every number below is either **(pass 2)** — a reading from `pass2/prototype/CTRL-TAPE/README.md`
or `pass2/critique/CTRL-TAPE.md`, cited and NOT re-measured here — or **(mine)**, measured in
this lane. One instrument was written and run: `probe/r3-atproperty.mjs`, readings at
`readings/r3-atproperty.json`. No dev server was started by this lane; no product file was
touched; the band reads as I found it.

Read the chair's rulings first (`pass3/CHAIR-RULINGS.md`): §6.1, §6.2, §6.3(c) and §6.5 have
already decided four of the fourteen rows, and two of them decide them differently from the way
the charter's prose reads.

---

## 1 · The base moved, and the replay is four hunks, not twenty-one

`74a2b5d9` is a docs-only commit; the picks it records reached master through its ancestors
(`f3bbb3af`…`4b3b19b3`). Against `a8fee1f5` the fold moves **16 files under `web/frontend`**.
The intersection with this family's 21 is **five files**, and only two carry a real merge:

| file | pass-2 delta | the fold's delta (`git diff a8fee1f5 74a2b5d9`) | resolution |
|---|---|---|---|
| `scripts/check-copy-register.mjs` | −12 (strikes the `candidates` admission) | +937/−… (G17: the discovery grammar) and B1b strikes the same admission | **DROP the pass-2 hunk.** `ADMITTED` at HEAD is **empty** (`scripts/check-copy-register.mjs:180-190`) with a comment naming both strikes. The lane's cure already landed. |
| `scripts/check-font-coverage.mjs` | ±40 (the `.section-heading` face move; `candidates`→`what fits`) | ±34 (adds `paperNoteCopy`; `candidates`→`what fits`; the Solve tape string) | **RE-CUT by hand.** Both edits land in the same `FACES` table. The fold's `what fits` row and the new `paperNoteCopy` extractor are law; the pass-2 hunk re-applies only the `.section-heading` MOVE (delete the Fraunces group at `:161-172` as it now stands, add the Patrick-Hand group with `strings: ["size","board size","level"]`). |
| `src/games/shared/GameControlPanel.vue` | ±1222 | ±13 at three sites: the pencils comment (`:947`), `candidates`→`what fits` **with its own comment block** (`:978-987`), the Solve tape `finishes the board for you` (`:1301-1305`) | **Resolve toward the fold** — keep the fold's comment prose verbatim, re-apply pass 2's structure around it. Pass 2 made the same caption change independently; the strings agree, the comments do not. |
| `src/games/shared/GameControlPanel.test.ts` | ±49 | ±4 (`what fits` in the `.zone-row-label` row) | trivial; keep the fold's row, re-apply pass 2's two re-cut rows. |
| `e2e/zone-grammar.spec.ts` | ±130 | ±4 (the caption census reads `what fits`) | trivial; same. |

Not in the intersection, and therefore free: `App.vue`, `index.css`, `typography.css`,
`scene.css`, `GameScene.vue`, `DrawerTab.vue`, `SheetWashiLabel.vue(+test)`, the five `spec.ts`
files, `pencilConfig.ts`, `viewport-law.spec.ts`, `visual-regression.spec.ts`.

**The fold also lands a cousin of one of this lane's grafts.** `GameBoard.vue:470-482` now clears
a stale coarse pointer on `focusout` (pick 3C-4b) with a comment that reads the engines' focus
ordering explicitly. That is the estate's OWN precedent for the WebKit `focusout` law the charter
grafts from CTRL-COST — cite it rather than arguing the class from scratch.

---

## 2 · The fourteen rows, as the chair left them

Four are no longer open questions. Read this table before the charter's §1-14 prose.

| row | the charter's ask | after CHAIR-RULINGS |
|---|---|---|
| 1 seal | carry both priced arms, build what the chair names | **DECIDED (§6.1).** The tranche pays §2.5. The seal **restamps by the measured +19.9 as a declared delta**, W2's row cited; the 412.4px² lever stays refused. The work is: re-measure the shipped figure on THIS tree, re-run the six-term ablation, restamp `const SEAL` and write the delta. |
| 2 crossing | name the reference line, re-take 4 wells × 3 cells | **DECIDED (§6.1).** The line **is the painted path's bbox top of the tape's own `<path>`**; the `−3.47` is struck. The work is one instrumented re-take with the line stated in the file. |
| 3 no-fallback chain | assert `--masthead-foot` non-empty px AND the card's `max-height` ≠ `none`, born-RED | **RE-SHAPED by §6.5** — see §4 below. With the registration the chair orders, `max-height` can never be `none` again, so that assertion becomes vacuous the moment the cure lands. The row has to be re-aimed at the VALUE, not the validity. |
| 4 first painted frame | publish before first paint, or `@property` + initial value | **DECIDED (§6.5): `@property`,** and §10's leader lands the registration once for the wave. Measured behaviour in §4. |
| 5 bar row's offsets | sweep §2.5b's five, or state the tolerance | open. `zone-grammar.spec.ts:372` sweeps `[0,0.5,1]`; `viewport-law.spec.ts:948,981` sweeps `[0,0.25,0.5,0.75,1]`. The assertion is `Math.round(covers) === 0` at `:348,385`. |
| 6 844×390 | both arms priced, the chair rules | **DECIDED (§6.2).** W2 §2.2 governs the cell; the seam law is scoped to the portrait `<1024` arm. The card's clientHeight is a **reading**, not a red, and the lane asserts the **existing** reachability row instead. |
| 7 flush foot | spend `env(safe-area-inset-bottom)` | **CONDITION OF §6.3(c)** — the bar's move to `#card-foot` is accepted only with it. Recipe in §5. |
| 8 WebKit desk staleness | a third clock, or prove the row can't reach a spending regime | open. The second arm is the cheap one and it is nearly written already (`App.vue:377-388`): `--sheet-chrome` is declared only inside `@media (max-width: 1023.98px)` (`scene.css:556`) and its landscape twin (`:689`), so no DESK rung reads it. Turn that sentence into an assertion. |
| 9 L3 | also assert the ledger did not grow | open, and the floor is now **0** (HEAD's `ADMITTED` is empty). |
| 10 dead face | delete `.section-heading { font-family: var(--font-display) }` | open; `src/assets/typography.css:378-386`, inside `@layer components`. |
| 11 R7 I2/I3/I4 | re-run on this prototype | open; the instruments are read and mapped in §7 — **two of the three need re-aiming and one of those looks GREEN for the right reason**. |
| 12 U-10 fresh reader | another lane scores /8 | open; orchestrator's to schedule. |
| 13 §2.5b vs a HEAD tree | run the landed sweep against a HEAD control | open; the control commit is **`74a2b5d9`** (§2.7/§7). |
| 14 goldens + filter census | run both against a dist built in the worktree | open. `playwright-golden.config.ts` (`testMatch: /visual-golden\.spec\.ts$/`, `snapshotPathTemplate` `{testDir}/goldens/{arg}-{platform}{ext}`, 4 darwin goldens) and `e2e/filter-census.spec.ts`. §6.4 forbids a re-mint inside the loop. |

---

## 3 · The surfaces and tokens this family touches (file:line, at the pass-2 worktree)

**The publishers (three, all `ResizeObserver`):**

| token | published at | on | consumers | fallback today |
|---|---|---|---|---|
| `--masthead-foot` | `src/App.vue:363-370` (`publishMastheadFoot`, off `svg.handwritten-logo`'s rect) | `documentElement` | `scene.css:556`, `:689` | **none** (deliberate) |
| `--case-offset` | `src/games/shared/GameScene.vue:110-120` (the case's own `.drawer-case > .outline-svg … path`) | `documentElement` | `scene.css:556`, `:689` | **none** (deliberate) |
| `--card-foot-h` | `GameControlPanel.vue:661-664` | `.controls-card` | `scene.css:134`, `:600` | `, 0px` — inert |
| `--card-pad-x` | `GameControlPanel.vue:665` | `.controls-card` | `scene.css:292` | `, 0px` — inert |
| `--card-pad-b` | `GameControlPanel.vue:670` | `.controls-card` | `scene.css:369`, `:372` | `, 0px` — near-inert |
| `--card-pad-t` | `GameControlPanel.vue:677` | `.controls-card` | `GameControlPanel.vue:1693`, `scene.css:339`, `:342` | `, 0px` — **NOT inert** |

> **A row the critique did not book.** `--washi-tag-top: calc(0.6rem - var(--card-pad-t, 0px))`
> (`GameControlPanel.vue:1693`) is what cancels the pin band so the tape reaches the case edge
> from INSIDE it (`scene.css:265-266`). With the publisher absent the fallback resolves the pin
> to `0.6rem` from the CONTENT box — the tape lands a full band (43.87 **(pass 2)**) lower, on
> live controls, which is exactly the §2.5 disease the band was built to close. The critic
> cleared `--card-pad-x, 0px` and `--card-foot-h, 0px` as "inert-when-absent, correctly kept";
> `--card-pad-t, 0px` is in the same sentence and is not inert. It belongs in the §6.5 sweep.

**The derived seam:** `scene.css:556` `--sheet-chrome: max(12rem, calc(var(--masthead-foot) + 8px
- var(--case-offset)))` (portrait `<1024`), `:689` the same with a `4rem` floor (landscape
`≤500` tall, `≥2:1`). Consumers: `.scene-controls { max-height: calc(100dvh - var(--sheet-chrome)) }`
(`:562`) and `.controls-card { max-height: calc(100dvh - var(--sheet-chrome) - 1.5rem - var(--card-foot-h, 0px)) }`
(`:600`).

**The band, one number and three readers:** `scene.css:277-280`
(`--washi-tag-rung: var(--type-name)` → `--washi-tag-h: calc(rung * 1.2 + 0.2rem)` →
`--pin-band: calc(0.6rem + --washi-tag-h)` → `padding-top`), the well's hang at
`GameControlPanel.vue:1708-1711`, the pin's cancel at `:1693`.

**The foot:** `GameScene.vue:234` (`<div id="card-foot" class="card-foot">`), `scene.css:291-293`
(`padding-inline: var(--card-pad-x, 0px)` — **and nothing else; no bottom padding, no inset**),
the `Teleport defer to="#card-foot"` at `GameControlPanel.vue:1358`, the bar's own drawn edge
(`HandDrawnOutline.bar-frame`, `:stroke-width 1.5`, `:outset 4`, `:pose 0`) at `:1370-1377` with
its rule at `:2386-2395`.

**The voice:** `typography.css:120-135` (`--type-name: var(--type-heading)`, `--type-group-title:
var(--type-name)`), `:378-386` `.section-heading` **still declaring `font-family: var(--font-display)`**
inside `@layer components` while `GameControlPanel.vue:1845`'s scoped rule overrides it to the
hand — the dead face of row 10.

**The ring:** `src/assets/index.css:276` (`--ring-ink`, minted by this lane as the §6.1 stopgap)
and its one consumer `GameControlPanel.vue:2238`. **Registry §2.4 gives the mint to MRK-LIVE**;
this lane keeps the consumption as `var(--ring-ink, currentColor)` and strikes its own mint in the
same diff, or the wave gets two minters.

**The seal:** `e2e/visual-regression.spec.ts:847` `const SEAL = 1283.5` with the pricing comment
at `:818-846` (pass 2 restamped it from 1227.5 there).

---

## 4 · `@property`, measured — and the contradiction inside §6.5

§6.5 asks for two things at once: register every measured token with an `initial-value`, AND let
an absent publisher "fail at computed-value time … caught by a born-RED row that deletes the
publisher". **Those cannot both be true of one token**, and the way out is a gate, not a paint.
Measured on `about:blank` with the estate's chain shape in isolation, both engines, no dev server
(`probe/r3-atproperty.mjs`, `readings/r3-atproperty.json`, viewport 390×844) **(mine)**:

| case | publisher | `--masthead-foot` computes to | `.card` `max-height` |
|---|---|---|---|
| **bare** (today's chain) | absent | `""` | **`none`** — chromium and webkit |
| bare | present | `117.75px` | `628px` / `627.999939px` |
| bare | junk (`banana`) | `banana` | **`none`** — the junk poisons the chain |
| **registered** `syntax:"<length>"; inherits:true; initial-value:0px` | absent | **`0px`** | **`628px`** / `627.999939px` |
| registered | present | `117.75px` | `628px` |
| registered | junk | **`0px`** (the bad declaration is ignored) | `628px` |
| **registered with `initial-value: 12rem`** | absent | `""` | **`none`** |

Four facts fall out, and each is a spec decision:

1. **The registration does rescue the boot frame, on both engines.** `CSS.registerProperty` and
   `@property` are live in both (`supportsAtProperty: true`), and the estate's browserslist
   already licenses it (`package.json`: `safari >= 16.4`, `chrome >= 111`). The pipeline is
   proven too — **the shipped dist already carries 42 `@property` rules** (Tailwind v4's
   `--tw-*`, e.g. `@property --tw-border-style{syntax:"*";inherits:false;initial-value:solid}` in
   `web/frontend/dist/assets/index-BMuoFtzKf9_k.css`), so `minify: 'esbuild'` with no
   lightningcss and no postcss keeps the at-rule.
2. **And it reinstates exactly the masked fallback pass 2 struck.** With `initial-value: 0px` the
   un-published seam resolves to `max(12rem, 8px)` = the 12rem constant the derivation replaced,
   which `scene.css:552-554` calls a fallback that "could only LIE". The cure for row 4 buys the
   defect of row 3 back. Say so in the spec and put the loudness in the gate: **assert the
   published value, not the validity** — at `<1024`, after settle, `--masthead-foot` ≠ its
   initial value and `--sheet-chrome` ≠ `12rem`; born-RED by deleting the publisher.
3. **A junk publish stops being contagious.** Registered, a malformed `setProperty` is dropped
   and the token keeps its initial value; unregistered, `banana` propagates and kills the cap.
   That is a real robustness gain and it is free.
4. **A botched registration fails silently and looks exactly like no registration.**
   `initial-value` must be computationally independent, so `12rem` invalidates the whole rule —
   and the computed value goes back to `""` with nothing to see. The detector is one line and it
   is engine-independent: **an unset REGISTERED property computes to its initial value; an unset
   unregistered one computes to `""`**. The registration row asserts non-empty; then the
   publisher row asserts ≠ initial.

Two consequences worth spending a sentence on in the spec:

- **Register the derived token too, if the gates want numbers.** `--sheet-chrome` computes to its
  unresolved token text (`"max(12rem, calc(117.75px + 8px - -6.18px))"`) because it is itself
  unregistered; register it `<length>` and `getComputedStyle(...).getPropertyValue('--sheet-chrome')`
  returns a px string the seam law can be asserted on directly, instead of re-derived in JS.
- **A registered `<length>` becomes animatable.** Anything that transitions `all` over an element
  carrying these tokens would now interpolate them. Worth one grep before the diff lands.

The 628px figure is the probe's arithmetic (844 − 192 − 24), not an estate reading — do not carry
it into a spec as a cell number.

**On row 4's evidence itself:** the critic's boot sampler is an `addInitScript` rAF loop, and rAF
callbacks run BEFORE the resize-observation steps inside one frame's update-the-rendering. A rAF
sample reading `max-height: none` is therefore consistent with a first PAINT that already carried
the cap. The claim "the uncapped pose is the first painted frame" needs a paint-anchored clock —
a `PerformanceObserver` on `paint` (FCP) timestamp against the time the cap first computes — or
it needs restating as "the first rAF-visible state". This does not change what the chair ordered;
it changes what the pass-3 return may claim.

---

## 5 · Primitives to reuse (named, with where they live)

- **`env()` proven by the AUTHORED RULE, the estate's own idiom.** `e2e/mobile-platform.spec.ts:188-222`
  walks `document.styleSheets` and asserts `rule.style.paddingRight.includes('safe-area-inset')`,
  because "env() resolves to 0 on non-notched Chromium". `index.html:11-12` carries
  `viewport-fit=cover`, so the inset is real on a device; `App.vue:943,994,1055`,
  `scene.css:483` and `AttributionCard.vue:136` are the shipped spends. **The foot's cure should
  do better than the authored-rule read**, and it can, with no test hook in product code: declare
  a mirror at `:root` (`--safe-b: env(safe-area-inset-bottom, 0px)`), spend it on `.card-foot`
  (`padding-bottom: calc(<floor> + var(--safe-b))`), and let the instrument override the MIRROR
  (`documentElement.style.setProperty('--safe-b','34px')`) and assert the foot's box grows 34.00
  and the fifth compartment's verbs lift off the viewport edge. Born-RED by reverting to flush.
  `scene.css:291-293` is the whole of `.card-foot` today, so the edit is additive.
- **CTRL-COST's WebKit focus law** (`pass2/critique/CTRL-COST.md:30-62`): WebKit's `focusout` on
  the next `pointerdown` carries `relatedTarget: null`, so `leftFace`'s `!(to instanceof Node)`
  branch disarms and the second press never deals. Cure shapes named there: ignore a `null`
  `relatedTarget`, re-check `document.activeElement` next frame, or do not move focus for a
  pointer-originated arm. The estate's own instance of the same ordering is
  `GameBoard.vue:470-482` (fold pick 3C-4b). The gate is "press twice, then read the BOARD",
  both engines — the record's existing evidence arms on both and fires on one.
  `.act-face` is CTRL-COST's rename of `.guard-face` (`GameGallery.vue:1414` at HEAD);
  `useTwoTap` does **not** exist at HEAD — it is CTRL-COST's worktree (`-30`, port 4233).
- **CTRL-RULE's critic's occlusion predicate** (`pass2/critique/CTRL-RULE/instruments/`,
  `orphan-field.mjs`, `pin-census.mjs`): `getComputedStyle(el, '::before')` in the predicate,
  because the estate paints two scroll cues as pseudo-elements that `querySelectorAll` can never
  return. Relevant here: the top sentinel (`scene.css:339-342`) and the bottom one (`:369-372`)
  are both pseudo-elements over the card's clip edges.
- **CTRL-FACE's `align-self: flex-start`** — 10.47px of clearance for 0.00px of flow — is
  **already taken** in this build: `GameControlPanel.vue:1838-1850` declares it on
  `.zone-row-label, .section-heading` (the same block that moves the face to `--font-hand` at
  `:1845`). The graft is a confirmation, not a new edit; the return should say so with the
  clearance number rather than re-take it. The caption column is a measured 3.75rem = 60px that
  `candidates` cleared at 48.8px and `what fits` is shorter than (the fold's own comment,
  `GameControlPanel.vue:978-987`), so the collision CTRL-FACE's row is about does not arise here
  — state that with the number.
- **PLR-PLACE's method:** point the estate's own specs at this lane's server with a two-line
  scratch PW config inside the package (copy `playwright.config.ts`, drop `webServer`, set
  `baseURL`) — never the default, which starts `:3000`.
- **`HandDrawnOutline`** (`src/pencil/grid/HandDrawnOutline.vue:136,149`): root is
  `div.outline-container`, the drawn svg inside it is `svg.outline-svg`. `:pose="0"` is pre-baked
  geometry — no live filter, so the census does not move.
- **The consumer-declared rung** (registry §3.1) is this family's own graft OUT: keep it exactly
  as it is (`scene.css:277` declares, `SheetWashiLabel.vue:220` falls back to `--type-tag`).

---

## 6 · The numbers a pass-3 spec has to hit

All **(pass 2)** unless marked. They are the ones a re-measure has to reproduce or explain.

| quantity | value | where it came from |
|---|---|---|
| `--pin-band`, every cell, both engines | 43.8656px | critic CONFIRMED |
| tape ∩ control at rest, 4 wells × 5 cells | 0.00px² | critic CONFIRMED |
| bar ∩ visible control, chromium | 0.00px²; webkit residue ≤ 68.41px² ≈ 0.23px of height at fractional offsets | prototype + critic |
| the seal at 1280×800 coarse | 1303.44 / 1303.31 against `SEAL = 1283.5` → **+19.94 / +19.81** | both |
| the refused lever | −42.81px on the seal, and tape ∩ control 0.00 → **412.4px²** (`checking ∩ Off`, 1440×900) / 360.3 (seal cell) | prototype |
| the crossing, painted-path-bbox line (the chair's line) | rail 34.63 / 25.43 / 22.85 / 20.68 · iPad coarse 34.79 / 25.46 / 22.80 / 20.58 · dock 26.09 / 23.15 / 20.98 / 21.05 | **critic** — these are the numbers the re-take must reproduce |
| the seam, sheet up, five cells | 32.15/31.82 · 31.80/32.17 · 32.20/31.84 · 98.92/98.19 · 32.20/32.05, all ≥ 8.00 | prototype |
| `--case-offset` | −6.18 to −10.23 (negative: the stroke sits ABOVE the sheet's box) | prototype |
| publisher absent at 390×844 | cap 523.77 → `none`; clientHeight 524 → 809; `.scene-controls` top 253.47 → −31.77 (wk −32.00) | critic |
| boot window (rAF-visible) | ~23ms chromium / ~116ms webkit | critic — see §4's caveat |
| 844×390 | derived arm: card 72.3 (clientH 72, scrollH 809); `4rem` arm: 235px card, seam −130.50 | both — now a **reading** under §6.2 |
| the foot's edge | `foot.bottom == innerHeight` at 844/844, 500/500, 390/390 | critic |
| WebKit desk staleness | −16.41 / −16.58 at the two DESK rungs, where `--sheet-chrome` is inert | prototype |
| the ring | 3.72 light / 4.68 dark on three grounds; Deal 18.83 / 14.99 | critic CONFIRMED |
| the voice | one tape rung, 25.888px, every cell; 8/8 headings; ratio 25.89/20 = 1.2945 at three cells | both |
| deck π | five readings Δ 0.00, AX headings 1 — **but against `a8fee1f5`**; pass 3's control is `74a2b5d9` | critic |
| `ADMITTED` at HEAD | **0** (`check-copy-register.mjs:180-190`) | **(mine)** |
| `@property` rules already in the shipped dist | **42** | **(mine)** |

---

## 7 · Instruments: what to copy, what to re-point, what to re-aim

The record is frozen; every r0 instrument is copied into `pass3/<stage>/CTRL-TAPE/` and
re-pointed before it runs (its `OUT` **and** its `BASE` port — r0's default is `127.0.0.1:4247`,
inside the lane band).

**R7's three rows** (`r0/r7-owners-eye/instruments/owners-eye.instruments.mjs`):

- **I2** (`:81-117`, webkit, dock) — `own` is `borderTopWidth > 0 || outlineStyle !== none ||
  boxShadow !== none || bar.querySelector(':scope > .outline-container, :scope > svg.outline-svg')`,
  and coverage is the worst `.tray-well` ∩ `.action-bar` fraction, threshold `< 0.05`.
  **On this prototype both terms should pass for the right reason**: `.bar-frame` IS a
  `HandDrawnOutline`, whose root carries `.outline-container` as a direct child of `.action-bar`
  (`GameControlPanel.vue:1370`), and the bar is out of the scrollport so the fraction is 0.000.
  M04's own word is "a proper border" — the drawn edge is the answer to term 1 and the berth is
  the answer to term 2. Run it; do not re-aim it. **(mine: read, not run.)**
- **I3** (`:119-154`, webkit, 1440×900) — skips a tag as "not pinned" when `b.top > scb.top + 30`.
  The arithmetic still works on this build **and it is worth stating why**: `--washi-tag-top:
  calc(0.6rem - var(--card-pad-t, 0px))` cancels the band, so a pinned tape lands ≈ card.top +
  9.6px, inside the 30px window. Had the pin not cancelled, the 43.87 band would have pushed
  every tape past the threshold and I3 would have read "no violating state" **vacuously**. State
  the margin in the return; if the design moves the cancel, re-aim the detector at the band and
  report I3 MOVED.
- **I4** (`:156-203`) — addresses `.action-bar .action-verbs button` and `.deal-row button`; both
  survive the Teleport (`GameControlPanel.vue:1361,1381,947`), so the selectors hold. The r0
  note stands: clear `localStorage` per case or `isDirty` reads false and a guard that exists
  does not arm.

**L3** (`pass2/prototype/CTRL-TAPE/instruments/law-probe-p2.mjs`, the re-aimed row): pass 2 reads
only `check-copy-register`'s exit. The critic's ask is one clause — assert the ledger did not grow
— and the floor at `74a2b5d9` is **0**. Born-RED by planting a synthetic admission.

**§2.5b** lives in the worktree at `e2e/viewport-law.spec.ts:846-1000` (five offsets, an in-run
negative control at 2452.5px² **(pass 2)**). §6.2's reachability row already exists at
`e2e/viewport-law.spec.ts:173-262` and already runs at **844×390 and 812×375** — the chair's ask
is to assert it, not to write it.

**The race to know about before running anything in `visual-regression.spec.ts`:** ledger row
**T9-R3** (`docs/tranches/LEDGER.md:66`) — that spec's in-page negative controls re-measure before
the injected rule lands (a fixed 120ms wait; a settle satisfied by two pre-injection reads), so
the seal row reds **under contention as a race, not a regression**. The cure is W5's gate estate
and lands when no lane shares the main tree. A red there is diagnosed before it is believed.

---

## 8 · Sketches

**A · the case, and the one thing outside the port** (portrait, sheet up)

```
   wordmark ink  ─────────────────────────  ← --masthead-foot (App.vue:363, no fallback)
        │  seam ≥ 8.00 by construction (measured 31.80 @390)
        │  --sheet-chrome = max(12rem, foot + 8 − case-offset)      scene.css:556
   ┌────┴──────── .drawer-case ───────────────────────────────┐  ← case-offset is NEGATIVE
   │ ╔═ .controls-card (the scrollport) ════════════════════╗ │     (−6.18…−10.23): the drawn
   │ ║  ░░░ --pin-band 43.87 = 0.6rem + tag-h ░░░░░░░░░░░░  ║ │     stroke sits ABOVE the box
   │ ║  ┌─[new game]─────────┐  ← pinned tape lives INSIDE  ║ │
   │ ║  │  9×9  16×16        │    the band; §2.5's exempt    ║ │
   │ ║  └────────────────────┘    line is the same number    ║ │
   │ ║  ┌─[pencils]──────────┐                               ║ │
   │ ║  │  marks · what fits │                               ║ │  max-height:
   │ ║  └────────────────────┘                               ║ │  100dvh − chrome − 1.5rem
   │ ╚═══════════════════════════════════════════════════════╝ │        − --card-foot-h
   │ ┌ #card-foot ─ the FIFTH compartment, NOT in the port ──┐ │  scene.css:600
   │ │ .bar-frame (HandDrawnOutline :pose=0) ▏clear fill … ▕ │ │  ← M04 term 1 = this edge
   │ └───────────────────────────────────────────────────────┘ │  ← M04 term 2 = this box
   └───────────────────────────────────────────────────────────┘
   ▲ foot.bottom == innerHeight  ← the flush edge §6.3(c) makes a condition
```

**B · the two failure shapes of one chain** (measured, §4)

```
  TODAY (no registration, no fallback)        WITH @property … initial-value: 0px
  publisher absent                             publisher absent
    --masthead-foot  →  ""                       --masthead-foot  →  "0px"
    --sheet-chrome   →  ""   (IACVT)             --sheet-chrome   →  max(12rem, 8px) = 192
    max-height       →  none                     max-height       →  a real cap
    card 524 → 809, sheet top −31.77             card capped, nothing painted wrong
    LOUD, and nothing asserts it                 SILENT, and the 12rem constant is back
                                               ⇒ the loudness moves into the GATE:
                                                 <1024 · after settle · foot ≠ initial
                                                 · chrome ≠ 12rem · born-RED by deleting
                                                   the publisher
  junk publish ("banana")                      junk publish
    token = banana → chain dies                  declaration dropped, cap holds
```

**C · the safe-area cure with no test hook in product code**

```
  :root      { --safe-b: env(safe-area-inset-bottom, 0px); }        ← the mirror
  .card-foot { padding-bottom: calc(<floor> + var(--safe-b)); }     ← scene.css:291

  instrument:  root.style.setProperty('--safe-b','34px')
               foot.height  +34.00   ·  verbs.bottom  −34.00  ·  foot.bottom unchanged
  born-RED:    revert to the flush foot → both deltas read 0.00
  and still:   the authored rule carries `safe-area-inset-bottom`  (mobile-platform.spec.ts:188)
```

---

## 9 · Risks, in the order they are likely to bite

1. **The §6.5 registration is the wave's row, not this family's**, and it lands in
   `index.css` — a file every §-lane's diff touches. Landing it once means landing it with the
   list of tokens the other lanes consume (`--pin-band`, `--card-pad-t`, `--washi-tag-rung`, the
   motion rungs of MOT-LADDER's publisher). A registration that names only this family's four is
   a half-row the next lane re-opens.
2. **The registration hides the very defect row 3 was written to catch** (§4.2). If the born-RED
   row is not re-aimed in the same commit, the pass ships a cure whose gate can no longer fail —
   the checklist's own subtlest item, and this family was already hit once by it (the bar row's
   three offsets).
3. **`initial-value` must be absolute.** `12rem` silently un-registers the property and the
   estate reads exactly like today (**mine**, both engines). Assert the registration took.
4. **The seal restamp is a gate constant moving for the second time in two passes.** It is
   authorized (§6.1), but it has to be re-measured on THIS tree with the six-term ablation re-run
   — not carried over from 1303.44 — and the delta declared with W2's row cited. A restamp that
   cites pass 2's number is a re-worded gate.
5. **T9-R3's race** sits in the same spec as the seal (§7).
6. **The font-coverage gate is blind to a CSS-only face swap** (the pass-2 comment says so at
   `check-font-coverage.mjs:224-243`): it binds a string to a face by a hand-written `where`.
   Row 10 deletes the dead Fraunces declaration — and the gate would not have noticed either way.
   The `.section-heading` strings were re-authored lowercase in the five `spec.ts` files to fit
   Patrick Hand's `{C,R,S}` capitals; that is a COPY change riding a face move and it is the
   T8 ransom-note trap's near miss. It needs to stay declared as a copy ruling for U-10, and the
   five `spec.ts` edits must survive the replay (the fold does not touch them).
7. **π's control commit is `74a2b5d9`, not `a8fee1f5`.** Every deck reading in the pass-2 record
   is a pass-2 reading; the fold moved one rect in the estate (B1's Solve tape, 16.52 chromium /
   17.85 webkit, per the fold's own census) and that rect is on a surface this family renders.
8. **`--ring-ink` has two would-be minters** (this lane's `index.css:276` and MRK-LIVE's). Strike
   this one in the diff that consumes `var(--ring-ink, currentColor)`, or the wave lands a
   duplicate declaration and the §6.1 reconciliation row has two homes.
9. **The bar's move is still W2's mechanic**, accepted under §6.3(c) with the safe-area condition.
   If the inset cure is not built, the acceptance lapses and the whole `#card-foot` berth — which
   is what closes M04 term 2 by construction — goes back to being an ask.
10. **The `4rem` landscape arm is still in the diff** (`scene.css:689`). §6.2 scopes the seam law
    to portrait; leaving the derivation in the landscape arm keeps a 72.3px card that the chair
    has now said is not a red but is also not something to ship without saying so. Decide the arm
    explicitly, with the reachability row green at both landscape cells.

## 10 · What this lane did not do

No dev server was started (the charter's 4230 is free as I found it); no product file was read
into a diff; no crop was banked (numbers carried everything); nothing under `r0/`, `pass1/` or
`pass2/` was written. The boot-frame ordering question (§4, last paragraph) is raised with its
mechanism and left unmeasured — it needs a paint-anchored clock on a served page, which is the
prototyper's instrument, not this lane's.
