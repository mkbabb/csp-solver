# CTRL-COST — pass 3 RESEARCH · the ask costs nothing

Section §10 · marks M01 M03 M04 M05 M12 M13 · pass-2 critic 62, ADVANCE, two BLOCKING rows.
Read-only on every product file. Two servers, both killed at return:

| lane | tree | port | cacheDir |
|---|---|---|---|
| prototype | `.claude/worktrees/wf_8630d340-e56-30` (`a8fee1f5` + the pass-2 diff, 18 files, uncommitted) | 127.0.0.1:**4233** | `<worktree>/.vite-cache-r3` |
| **HEAD control** | MAIN at **`74a2b5d9`** (the W7 execution fold — chair §2.7/§7.4) | 127.0.0.1:**4234** | session scratchpad (nothing written into the frozen tree) |

Probes `probe/r1…r4`, readings `readings/r1…r4.json`. No crops banked: every row below is a
number. Nothing under `r0/`, `pass1/`, `pass2/` was written.

---

## 1 · THE MERGE WATCH (chair §4) — measured YES on both halves

### (a) the pin band is ONE mechanism, with two publishers

```
CTRL-TAPE   scene.css:277-280 (worktree -28)     CTRL-COST   scene.css:297-299 (worktree -30)
  --washi-tag-rung: var(--type-name);              --pin-band: calc(0.6rem + var(--cost-head-h));
  --washi-tag-h:  calc(rung * 1.2 + 0.2rem);       padding-top:        var(--pin-band);
  --pin-band: calc(0.6rem + var(--washi-tag-h));   scroll-padding-top: var(--pin-band);
  padding-top: var(--pin-band);                  GameControlPanel.vue:738-744
                                                   card.style.setProperty("--cost-head-h",
                                                     ceil(firstHead.getBoundingClientRect().height))
```

Same token NAME, same 0.6rem term, same consumer (`padding-top` on `.controls-card`), same
argument (the head pins inside the strip W2's fold sentinel already paints), same negative pull
on the pinned child (`top: calc(0.6rem - var(--pin-band))`, GCP:1460). The ONLY difference is
what supplies the pinned thing's height: TAPE DERIVES it from a type rung; COST MEASURES the
first head with the panel's resize pass. **They are one mechanism.**

The measurement says the derived publisher is the better one, and names a live defect in the
measured one (`readings/r4.json`, all four heads, both engines):

| cell | `looking` | `writing` | `starting over` | `players` | published `--cost-head-h` | card `padding-top` |
|---|---|---|---|---|---|---|
| 1280 chromium | **40.39** | 37.45 | 37.45 | 37.45 | 41px | 50.6px |
| 1280 webkit | **41.44** | 37.44 | 37.44 | 37.44 | 42px | 51.6px |
| 390 chromium | 37.45 | 37.45 | 37.45 | 37.45 | 38px | 47.6px |
| 390 webkit | 37.44 | 37.44 | 37.44 | 37.44 | 38px | 47.6px |

- The reserve is sampled from `wrapEl.querySelector(".cost-band-head")` — the FIRST head. It
  is adequate today only because the first head happens to be the tallest: at the desk
  `looking` carries a `BUTTON.info-btn` (32px) the other three do not, and it is the one that
  fixes the band. Move that button to another band and the reserve is measured at 37.45 while a
  40.39 head pins inside it — a ~3px re-run of the G16 disease, silently.
- The measured band is ENGINE-SPLIT at the desk (41 vs 42) where TAPE's closed form reads
  43.8656px everywhere.
- Every plain head is `4 + 31.0656 + 2.4 = 37.47` predicted vs **37.45/37.44** measured — the
  closed form already exists: `--cost-head-h: calc(var(--type-group-title) * 1.2 + 0.4rem)`,
  with the head's own children held to the heading's line box (CTRL-FACE's `1lh` graft;
  `.cost-band-head > * { align-self: …; max-block-size: 1lh }`) so the info button cannot move
  the band. That retires the ResizeObserver term, the boot-frame pose and the engine split in
  one line, and is what makes chair §6.5's `@property … initial-value` registration possible at
  all (a measured value has no initial value to register; a derived one does).

### (b) the two-tap is ONE mechanism, with two policies

```
CTRL-TAPE  GameControlPanel.vue:531-553      CTRL-COST  GameControlPanel.vue:587-632
  function useTwoTap(act) {                    function askingAct(verbEl, answerEl, fire) {
    armed = ref(false); timer                    armed = ref(false); timer
    press(): if (isCoarse && isDirty            press(): if (armed) { disarm(); fire() }
              && !armed) { arm; timeout }                else if (isDirty) { arm; timeout;
             else { disarm(); act() }                      nextTick(() => answerEl.focus()) }
    disarm(); onBeforeUnmount(clear)                  else fire()
  }  ×4 verbs: deal fill clear solve            disarm(): focus back to the verb
                                                leftFace(e): focusout guard
                                              }  ×2 verbs: deal clear
```

Identical state shape, identical window (`MOTION.confirmWindowMs`, 2500), identical teardown.
The differences are POLICY, not machinery, and both are design decisions that must survive a
fold rather than be dropped with it:

| | TAPE | COST |
|---|---|---|
| who asks | deal · fill · clear · solve | deal · clear (fill/solve are tier 2 and fire at once) |
| which pointer | coarse only (`isCoarse`) | every pointer (M12 is pointer-agnostic) |
| the answer | a label swap; no second control | a real `<button>` at the face's foot + the focus contract |

**Verdict for the return: one mechanism, twice.** If the chair folds, the machinery is TAPE's
one factory; COST's grafts are `.act-face`, the answer-button + its focus contract, the
berth-in-the-head, and the golden-attribution rig — and the POLICY rows (who asks, on which
pointer) go up to W1 §1.5 / U-10 rather than dying in the merge.

---

## 2 · BLOCKING ROW 1 — the WebKit second press. The mechanism is bigger than the guard.

`readings/r1.json`, four cells (both engines × 390×844 touch / 1280×800 mouse).

**A press does not focus a button in WebKit — measured on a control this family does not
touch.** After a plain click on an ordinary `.icon-btn`:

| engine | 390×844 | 1280×800 |
|---|---|---|
| chromium | `activeElement = BUTTON.icon-btn` | `BUTTON.icon-btn` |
| **webkit** | **`BODY`** | **`BODY`** |

That single fact generates every symptom the critic logged. The trace on the armed verb's
second press (capture phase on `.deal-face`, `activeElement` read at every event — pass 2
logged `armed` only):

```
WEBKIT 390×844                                        armed  activeElement
  pointerdown  .act-word.is-armed      rel NULL        true   .act-answer
  focusout     .act-answer             rel NULL        true   BODY      ← the blur goes NOWHERE
  mouseup      .act-word.is-armed                      FALSE  BODY      ← leftFace already disarmed
  click        .act-word.is-armed                      false  BODY      ← press() re-arms
  focusin      .act-answer                             true   .act-answer
CHROMIUM 390×844
  pointerdown  .act-word.is-armed      rel NULL        true   .act-answer
  focusout     .act-answer   rel .act-verb             true   BODY
  focusin      .act-verb     rel .act-answer           true   .act-verb  ← focus lands on the verb
  click        .act-word.is-armed                      true   .act-verb  ← press() FIRES
  focusout     .act-verb               rel NULL        false  BODY      ← the `:disabled` flip
```

`secondPressDealt`: chromium true / true · **webkit false / false.** The board signature is
unchanged in both WebKit cells, at the desk as well as the phone — so row 13 ("no WebKit exit
fires a tier-3 act") is confirmed for the POINTER route too, not only Shift-Tab.

**The three candidate cures, each against the measured trace:**

| # | cure | verdict on the evidence |
|---|---|---|
| (a) | `leftFace` ignores a null `relatedTarget` | WORKS, and is safe here — the two other exits still cover a genuine departure (`disarmElsewhere` on `pointerdown.capture`, GCP:671, and the 2500ms lapse). But it leaves the arm's focus move, so rows 8 (scroll) and 3 (focus) stand. |
| (b) | defer the check one frame (rAF) and read `document.activeElement` | WORKS on the ordering: the rAF resolves at t+15…25ms in both engines, always AFTER the click (webkit 5345→5362 vs click 5347; chromium 4872→4897 vs click 4873). Two frames of deferred state for one engine's bug. |
| (c) | **a POINTER arm does not move focus at all** (keyboard arms still do, with `preventScroll`) | WORKS AT SOURCE and is the only one that closes three rows at once. Measured: with nothing focused inside the face, the arming press fires **0** focusout events on the face in both WebKit cells (`armFiredFocusoutOnFace: 0`; chromium 1, from its own click-focus). No focus move → no blur → no `leftFace` → no scroll (row 8) → and the keyboard contract is untouched, because a keyboard reader IS in the focus model and a pointer reader is not. |

Recommendation for the synthesizer: **(c) as the design, (a) as the belt** — the null-related
guard stays because the pre-click blur is a wave-wide law (registry §3.5) and the next family to
move focus inside a confirm will meet it.

Background only, not the verdict: the platform behaviour is WebKit bug 229895 ("Clicking button
drops focus entirely") and 254655 ("`event.relatedTarget` is null in blur event handler when
button is clicked"); the commonly cited workaround is to force focusability with `tabindex`,
which this estate does not need if it stops moving focus on a pointer arm.

---

## 3 · BLOCKING ROW 2 — the goldens. The card has a ruler, and it is the keyboard legend.

`readings/r2.json` + `r3.json`, desk 1280×800, drawer open, both engines, both trees.

| box | HEAD `74a2b5d9` chromium | HEAD webkit | prototype (both engines) |
|---|---|---|---|
| `.controls-card` width | **324.22** | **332.31** | **365.97** |
| widest max-content inside it | `.legend-fold` → `DL.keyboard-legend` **284.22** | **292.31** | `.band-acts` **325.97** |
| board / first cell x | 131.89 | 127.84 | 111.02 |
| Δ card / Δ board vs its own engine's HEAD | — | — | **+41.75 / −20.87** (chromium) · **+33.66 / −16.82** (webkit) |

Pass 2's attribution reproduces exactly at the NEW base, and two facts are new:

1. **HEAD's own card width is engine-split by 8.09px** — because at HEAD the ruler is TEXT (the
   keyboard legend's widest row: 136.11 chromium / 140.16 webkit). The goldens are chromium-only
   (`playwright-golden.config.ts`, by omission), so the golden has only ever seen 324.22.
   *Consequence for §6.4: a card-width law written as ONE pinned literal cannot hold π on both
   engines — pinning 324.22 moves the webkit board +4.05px.* The width law that holds π on both
   engines is not a literal at all: **nothing in the card may out-measure the legend fold.**
2. **`flex-wrap` does not lower a flex container's max-content contribution** — measured, not
   reasoned: `.band-acts` already declares `flex-wrap: wrap` (GCP:1586-1592) and still prices
   325.97. Wrapping is a layout answer to an intrinsic-sizing question.

**The two boxes over the ruler, named to the element** (`readings/r3.json`):

| box | max-content chromium / webkit | over the legend by | its own arithmetic |
|---|---|---|---|
| `writing` → `.band-acts` | 325.97 / 325.97 | +41.75 / +33.66 | `.play-controls` 179.59 + fill 63.59 + solve 63.59 + 2 × 9.6 gap |
| `looking` → `.band-row` (marks) → `.ctrl-options.options-row` | 302.42 / 305.19 | +18.20 / +12.88 | 3 × `.ctrl-btn` 96.02 (96.94 wk) + 2 × 7.2 gap |

Everything else in the ladder is already under the ruler: the other three bands read 233.50 and
144.63/144.67, and the heads read 121.27–162.91.

**The cure the numbers point at (both rows, no re-mint, no token, π on both engines):**

- the acts band goes to TWO rungs — `undo · redo · hint` (179.59) and `fill · solve`
  (63.59 + 63.59 + 9.6 = 136.78). Both under 284.22. This is the desk two-row audition the
  prototype reverted unseen (its gap 9); it is now the row with an arithmetic reason.
- the options row that may wrap takes `contain: inline-size` (contribution → 0, content reflows
  inside the ruler; a chip is 96.02 ≪ 284.22 so nothing overflows). The prototype auditioned
  containment on the ACT row alone and reverted it because the next box then priced the card —
  cure both and the ruler returns to the legend.
- a born-RED row states the law it now depends on: **the card's width == the legend fold's
  max-content + the card's inline padding, both engines** — so the day a ladder row out-grows
  the legend, the gate says so instead of a golden.

Risk to declare with it: the legend fold is now load-bearing for π. If W2 or another lane
deletes or re-cuts the keyboard legend, the ruler changes and the goldens move for a reason
that has nothing to do with this family.

---

## 4 · The other fourteen rows, each with its measured fact

| # | row | measured | the concrete answer |
|---|---|---|---|
| 3 | focus drops to `<body>` after the act | chromium trace: `focusout .act-verb rel NULL` 3ms after the click, from the `:disabled="loading"` flip (9 sites, GCP:1047…1329); webkit was never focused at all | restore on settle with PLR-SELF's escape-refocus shape (`if (el.contains(document.activeElement)) el.focus()`, registry §3.16) — the estate has NO `aria-disabled` anywhere, so swapping the idiom is a new law and needs its own gate. Contract to gate: after the act settles, `document.activeElement` is inside `#controls-drawer`, both engines |
| 4 | G9′ pinned to the bare card | critic 4.693 light / 5.078 dark on the accent hover ground (AA by 0.193) | put the hover ground in the fixture: `.act-face` grounds `--color-accent` under `@media (hover: hover)` (index.css:900-906) — the gate must assert the ARMED+HOVERED state, which is the state the second press happens in |
| 5 | `MOTION.inkLiftMs` 0 consumers | `pencilConfig.ts:163` declared; 46 `150ms` literals in the worktree, 8 of them this family's (`index.css:900-901`, GCP:1656-1657/1664/1696-1697/1704) | DELETE the token. The ruled rung already exists and is the same number: `--motion-whisper: 150ms` (§2.1/§2.2; MOT-LADDER `pencilConfig.ts:231`, published by `publishMotionRungs()` from `main.ts:16`). Consume `var(--motion-whisper)` with NO fallback (§6.5). Two frees: the `visibility 0s linear var(--motion-whisper)` delay then collapses to 0ms under PRM instead of holding 150ms. Sequencing risk: the rung is NOT published in this tree (`--motion-whisper` reads empty, r1 `tokens`) — the consumer needs §13's publisher, which is exactly why §6.5 asks for `@property`+`initial-value` |
| 6 | the `starting over` berth can never hold a note | `NOTES` (GCP:441-456) has 7 rows: `looking` ×3, `writing` ×2, `players` ×2, **`starting` ×0**; `noteOf('starting')` renders at GCP:1168-1169; `check-font-coverage.mjs:189` pins all four bands in `BOUND_TAPES` | either give band 3 its two subjects (`deal`, `clear` — the verbs whose consequence a note exists to name) and pay two copy rows through `check-copy-register` + the coverage corpus, or delete the node AND the pin. A berth is absolute, so an empty head costs no height either way |
| 7 | the berthed tape's ink outside its paper | measured both engines (`r3.berth`): label 204.84 × 36.50, ink 178.93 × 37.23; ink **0.61** above / **0.12** below (chromium), **0.30** / **0.40** (webkit); `padding: 0.32px 6.4px`, `line-height: 17.56`, head 37.45, overhang below head **2.66 / 2.67** into 4px of air | restore ~1px of vertical padding: predicted 36.50 → 37.72 tall, overhang 3.88 of 4.00 — 0.12 of margin, thin. The honest alternative is one more px of head air (which costs the pin band, and therefore the seal, +1px — a DECLARED delta on top of the chair's +19.9). The tilt is 0.22° and is not the cause: the overshoot is the font's own ink box |
| 8 | arming scrolls the port | +16 / +15 / +15 / +16 px in ALL FOUR cells (`before.scrollTop` → `afterArm.scrollTop`), both engines; a re-focus of an ALREADY-visible answer from the same park scrolls 0.00 — so the scroll is the reveal-plus-focus, not the focus call alone | cure (c) above removes it for pointer arms; keyboard arms take `focus({ preventScroll: true })`. Gate: a scrollTop delta on the arm, not only the face's Δ[0,0,0,0] |
| 9 | `no` measures 56×44 | confirmed and extended: **56.00 × 44.00** at 390 (face 73.59 × 123.97, verb 56 × 67.98); **44.00 × 44.00** at the desk (face 61.59 × 110.38) — the desk answer sits EXACTLY on the 44 floor, zero headroom | one in-tree comment carries the wrong number (GCP:569); the spec/README are frozen record. State both cells, and note that M01's mobile scale raising `--tap-floor` moves a floor the desk answer is already touching |
| 10 | the README's gap 2 is false | `--sheet-chrome` exists: prototype `scene.css:505` (12rem) / `:655` (4rem); HEAD `scene.css:468` / `:597`. It reads EMPTY from `:root` and from `.controls-card` and `.drawer-case` in the open-drawer desk pose (r1/r2 `tokens`) — it is scoped to the sheet regimes | restate exactly as the charter says: the berth's clearance is this lane's arithmetic, never consumed from W2 §2.5's derivation. Chair §6.2 scopes the seam law to the portrait <1024 arm anyway |
| 11 | `GameScene.vue:191` | still says the panel publishes `--card-pad-t` / `--card-pad-b`; GCP:734 states `--card-pad-t` is DELETED and publishes only `--card-pad-b` (:730) and `--cost-head-h` (:741) | one comment |
| 12 | `no`'s description | the verb's `aria-label` is "Press again to deal a new board" (GCP:1189) AND both buttons point `aria-describedby` at the same sr-only sentence (:1191, :1219, :1225) — the verb says it twice, and the ANSWER is described by the sentence for the act it cancels | drop the describedby on the verb (its label already carries it); give the answer its own sr-only description naming what IT does. `no` alone is not a name a reader can act on |
| 13 | no WebKit exit fires the act | now measured for the POINTER route at both viewports (§2) | comes free with cure (c); the Shift-Tab leg stays chromium-only by PW-WebKit's Tab limits (registry §3.22) and must be stated, not hidden |
| 14 | the CSS claims no unit witnesses | CI is SIXTEEN BROWSERLESS LANES (O-12): `.github/workflows/ci.yml` runs vitest + the node gates (`check-ink-pressure`, `check-inline-tests`, `check-coverage-floor`, `check-prod-shake`, `check-pw-projects`, prettier, eslint, knip, three vue-tsc lanes). `test:e2e` and `test:golden` are LOCAL instruments | an e2e row re-rots silently BY LAW. The CI-enforceable witness for a CSS claim is a node gate in the estate's own idiom (`scripts/check-*.mjs --self-test`, 11 of them in package.json): assert the DECLARATIONS — `.act-answer` takes `min-height: var(--tap-floor)`, the card's `padding-top` is `var(--pin-band)`, the head's `top` is `calc(0.6rem - var(--pin-band))`, the berth's label carries vertical padding. Land the e2e row too, and say in the record that it is a local instrument |
| 15 | the unclaimed seams / the unarmed gallery π | 430×932 −20.52/−20.81 and 844×390 −120.9/−121.3 stand from pass 2; chair §6.2 rules 844×390 is reached through W2 §2.7's tab and §2.2's drawer, so the card's clientHeight there is a READING, not a red, and the lane asserts W2 §2.2's reachability probe instead. The gallery π row needs the ribbon armed: it is `.gallery-guard` with `.guard-btn` verbs, armed by an in-game deal/select (`GameGallery.vue:1035-1056`, `e2e/gallery-guard.spec.ts:126-135` shows the route) | arm it through the deal intent and read the five `.act-face` rects on both surfaces |
| 16 | the sentinels disagree | `.controls-card::after` keeps `var(--card-pad-b, 0px)` on FOUR declarations (`scene.css:341, 344, 345, 348`) while `::before` spends `var(--pin-band)` fallback-free (`:312, 315, 316, 319`); `.band-row`'s gap is NOT dead — `gap: 0.5rem` (:1530) is the phone arrangement and `.band-row-stacked { gap: 0 }` (:1566) is the desk's, two selectors, both live. The critic's "two lines later" cites `.act-face`'s own `gap: 0.15rem` (:1620), a different rule | take §6.5 for both sentinels (`@property` + `initial-value`, no fallback); report the dead-gap row as NOT REPRODUCED, with both line numbers |

Two more facts worth the synthesizer's attention, neither in the critic's list:

- **`--tap-floor` reads EMPTY off `documentElement`** and `2.75rem` off `.controls-card`
  (r1 `tokens`, all four cells) — the banked trap (registry §7.6) is live on this tree.
  `App.vue:961` declares it on the app root, not `:root`; any probe or gate that reads it from
  `document.documentElement` measures nothing and passes.
- **`--ring-ink` is minted in this tree** at `index.css:199`. Registry §2.4 gives it ONE minter
  (MRK-LIVE, §6's leader); this lane strikes its mint and consumes `var(--ring-ink, currentColor)`
  (CTRL-FACE's form) at `index.css:924` and `:931`.

---

## 5 · Surfaces, tokens and primitives the spec will name

**Files this family touches** (prototype line numbers; HEAD's differ):

| file | what |
|---|---|
| `src/games/shared/GameControlPanel.vue` | `askingAct` :587-632 · the publisher :728-760 · `disarmElsewhere` :671 · `disarmOnEscape` :683 · the three faces' markup :1162-1290 · `.cost-band-head` :1458-1470 · `.note-berth` :1490-1520 · `.band-row` :1527-1572 · `.band-acts` :1586-1592 · `.act-face`/`.act-word`/`.act-answer` :1618-1713 |
| `src/games/shared/scene.css` | the pin band :286-299 · `::before` :309-320 · `::after` :336-348 · `--sheet-chrome` :505/:655 |
| `src/assets/index.css` | `--ring-ink` mint :199 (to strike) · `.act-face` block :870-935 · the coarse floor :860-868 |
| `src/pencil/config/pencilConfig.ts` | `confirmWindowMs` :158 (real) · `inkLiftMs` :163 (to delete) |
| `src/games/shared/GameScene.vue` | the card's utilities + the stale comment :187-199 |
| `src/pencil/chrome/GameGallery/GameGallery.vue` | the ribbon's `.act-face` :1042/:1056, `.guard-btn` :1399 |
| `scripts/check-font-coverage.mjs` | `BOUND_TAPES` :178-190 (the `starting` pin) |

**Primitives to reuse, named:**

1. `useTwoTap` (TAPE, GCP:531) — the one arm factory, if the fold happens.
2. TAPE's closed-form band + boot-frame sampler (`critique/CTRL-TAPE/probe/crit2.mjs §B`) —
   the derived `--cost-head-h` above, and the `addInitScript` rAF loop that reads the FIRST
   PAINTED frame (~23ms chromium / ~116ms webkit) rather than the settled one.
3. CTRL-FACE's `align-self: flex-start` and `1lh` (registry §3.6) — the head's children held to
   the heading's line box; CHECK 6 keyed over the ELEMENT.
4. CTRL-RULE's critic's occlusion predicate — `getComputedStyle(el, '::before'|'::after')` in
   the test, because this card paints two scroll cues as pseudo-elements that
   `querySelectorAll` can never return.
5. PLR-SELF's escape-refocus rule and PLR-PLACE's critic's method (point the ESTATE's own specs
   at the lane's server with a two-line scratch PW config, `testDir '../e2e'`).
6. `MOTION.rungs` + `publishMotionRungs()` (§2.1) — `--motion-whisper` is this family's only
   motion consumer.
7. The golden-attribution rig (`prototype/CTRL-COST/probe/p2e,p2f,p2g`) and this lane's
   `r3-widest-and-berth.mjs` (per-element max-content census, floor-filtered).

**Constraints that collide:** M16 plain copy (band 3's notes, the answer's description);
filterBudget 9 (unchanged — this family adds no filter); AA on both themes INCLUDING the accent
hover ground (4.693 light is the binding number, not 4.990); π on both engines with the HEAD
control at `74a2b5d9`; chair §6.5 (no fallbacks on measured tokens) vs MOT-LADDER's byte-equal
fallbacks — §6.5 names the motion rungs explicitly, so the rungs lose their fallbacks and gain
`@property`; chair §6.4 (the card's width outranks its content); chair §6.2 (844×390 is a
reading, not a red); R6 law 39 (three ring forms — the face's ring is one of them, not a
fourth); R6 law 30 (a rendered-string change re-cuts the woff2 subset — band 3's notes would);
U-10 on every mark.

---

## 6 · Sketches

**(1) The ruler law — what the card's width is allowed to be**

```
  .controls-card  (shrink-to-fit at the desk; width = widest max-content inside)
  ┌──────────────────────── 324.22 chromium / 332.31 webkit ────────────────────────┐
  │ pad 20 ┊                     THE RULER: .legend-fold                    ┊ pad 14│
  │        ├──────────────── 284.22 / 292.31 ────────────────┤                      │
  │        │ looking   [Normal][Corner][Center]  302.42  ✗ over by 18.20     │      │
  │        │ writing   undo redo hint fill solve 325.97  ✗ over by 41.75     │      │
  │        │ ...every other box ≤ 233.50                     ✓               │      │
  └─────────────────────────────────────────────────────────────────────────────────┘
   cure:  writing → two rungs   [undo redo hint] 179.59 ✓ / [fill solve] 136.78 ✓
          looking → contain: inline-size on the wrapping options row (contribution 0)
   then:  card width unchanged per engine → board x unchanged → goldens 4/4 by construction
```

**(2) The ask, with the focus contract split by input**

```
   POINTER arm                            KEYBOARD arm
   ┌──────────────┐                       ┌──────────────┐
   │   ⚄          │                       │   ⚄          │
   │   sure?      │  focus UNMOVED        │   sure?      │  focus → no, preventScroll
   │ ┏━━━━━━━━━━┓ │  (nothing to blur;    │ ┏━━━━━━━━━━┓ │  (the second Enter lands
   │ ┃    no    ┃ │   webkit fires 0      │ ┃ ▸  no  ◂ ┃ │   on the safe answer)
   │ ┗━━━━━━━━━━┛ │   focusouts)          │ ┗━━━━━━━━━━┛ │
   └──────────────┘                       └──────────────┘
     2nd tap → press() sees armed → FIRES    2nd Enter → disarms; Shift-Tab+Enter deals
     scroll delta 0 (was +16)                scroll delta 0 (preventScroll)
   leftFace keeps a null-relatedTarget guard for the departures the other exits miss
```

**(3) The band, derived instead of sampled**

```
   --type-group-title ──┐
                        ├─→ --cost-head-h = calc(rung * 1.2 + 0.4rem)  = 37.47  (all 4 heads)
   head padding 4/2.4 ──┘                        ↑ every head's children ≤ 1lh
                        --pin-band = calc(0.6rem + --cost-head-h)      = 47.07
   .controls-card { padding-top: var(--pin-band); scroll-padding-top: var(--pin-band) }
   .cost-band-head { top: calc(0.6rem - var(--pin-band)) }        ← pins INSIDE the band
   today (sampled):  38 / 41 / 42 px  — three values, one engine split, first-head-is-tallest
                     holding by luck (the desk info-btn: looking 40.39 vs the other three 37.45)
```

---

## 7 · Risks

1. **The fold may take the machinery and drop the policy.** COST's two design decisions — the
   ask on EVERY pointer, and an answer that is a real control — are not in `useTwoTap`. If the
   merge lands as "use TAPE's factory", M12's pointer-agnostic promise and the 56×44 answer
   leave with it.
2. **The ruler is someone else's box.** Pinning π to the keyboard legend's max-content makes
   this family's goldens hostage to a legend re-cut by W2 or another §10 lane.
3. **`contain: inline-size` needs a definite container.** It is only safe while at least one
   uncontained child prices the card; contain them all and the card collapses. The born-RED row
   has to assert the ruler, not just the widths.
4. **The `--motion-whisper` consumer is cross-section.** It resolves to nothing until §13's
   publisher lands (measured empty here); without `@property`+`initial-value` a no-fallback
   consumer ships a 0ms transition rather than a loud failure.
5. **The berth's cure has 0.12px of margin.** ~1px of vertical padding fits the ink inside its
   paper at 3.88 of 4.00 — one type re-cut from crossing again. Buying head air instead moves
   the pin band, the card's height and therefore the seal.
6. **A cure that keeps a pointer arm out of the focus model weakens one contract:** a reader who
   arms by touch and then reaches for the keyboard has no focused answer to press. The window
   and `disarmElsewhere` still cover them, but the record must say so rather than imply the
   keyboard path is universal.
7. **The desk answer is exactly on the tap floor (44.00 × 44.00).** Any type or padding move
   in the face reds it, and M01 raising `--tap-floor` moves the floor under it.
8. **Both blocking cures touch files three other §10 lanes are re-cutting** (`GameControlPanel.vue`,
   `scene.css`, `index.css`); the ruler cure also re-lays the writing band, which is where
   CTRL-TAPE's `#card-foot` bar move (chair §6.3c) arrives.

## 8 · What is on disk

- `probe/vite.lane.mjs` · `probe/vite.head.mjs` — the two servers' configs (private cacheDirs).
- `probe/r1-focus-model.mjs` → `readings/r1.json` — the focus model, the traces, the boxes, the
  scroll deltas, the token reads (4 cells).
- `probe/r2-width-and-head.mjs` → `readings/r2.json` — π attribution vs the HEAD control, the
  per-child max-content ranking, the head's metrics (4 cells).
- `probe/r3-widest-and-berth.mjs` → `readings/r3.json` — the recursive max-content census
  (floor 250) and the berthed tape's ink-vs-paper (4 cells).
- `probe/r4-heads.mjs` → `readings/r4.json` — all four band heads, both engines, desk and dock.
- `readings/server.log`, `readings/server-head.log`, `readings/r*.log`.
- No crops. No instrument of r0's was run, so none was copied or MOVED by this lane.
