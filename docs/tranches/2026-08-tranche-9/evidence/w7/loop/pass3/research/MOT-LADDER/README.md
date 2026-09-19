# MOT-LADDER — pass-3 RESEARCH (§13 leader)

Lane: research, read-only on product files. Base: **`74a2b5d9`** (the W7 execution fold), the main
tree, nothing built and nothing committed. Every number below was measured in this lane on this
tree or read out of a banked pass-2 file with its path named. Instruments in `instruments/`,
raw output in `data/`. Zero crops banked. One server (127.0.0.1:4246, the frozen dist served
read-only by `python3 -m http.server`), killed; the band reads free.

The thirteen open rows of the charter are answered in §7 with the number each one now has.

---

## 0 · The headline, in five sentences

1. **The `throw` rung has ZERO CSS consumers at HEAD** — `data/clock-census-74a2b5d9.txt`, the
   duration histogram: 150×18, 200×14, 250×8, 500×6, 240×4, 350×4 … and **520 × 0**. That is
   why the pass-2 sabotage was invisible: the ratchet banks CSS rows, and `throw`'s only
   consumers are two TS constants.
2. **The estate's clocks are mostly NOT in CSS**: 77 clocks in 24 files live in `.ts`/`<script>`
   (19 of them a bare numeric literal), against 85 CSS duration terms. A second motion config
   object — `WASH` in `useJoinWash.ts:101` — declares "EVERY NUMBER. Tuning happens here and
   nowhere else" over 15 constants, two of which are already the ladder's numbers (520, 440).
   R6 law 4 is false at HEAD by measurement, not by drafting.
3. **The chair's no-fallback law (§6.5) is measurable, and half of it is false as written.**
   Both engines: an absent publisher with no fallback and no registration fails LOUD — the
   whole `transition:` shorthand goes invalid at computed-value time and
   `transition-property` computes **`all`**, duration `0s`. Add `@property` with a shipped
   `initial-value: 520ms` and the absence stops failing at all (`0.52s`, page looks normal).
   Register with `initial-value: 0ms` and absence reads `0s` — detectable, and the same shape
   the reduce arm uses.
4. **The exit mirror's 10.0px is stale — proven.** The wordmark's REST poses, measured on the
   frozen dist in both engines: 390×844 |Δ| **145.49 / 145.77 px**; 1440×900 **319.10 /
   324.02 px**. Those are the ENTRY's declared travels to 0.01–0.3px. The exit's 10px is not
   the geometry; at the phone the wordmark cuts.
5. **The dock's acceptance criterion exists and is monotone.** `framesOver40px` is a count and
   non-monotone in duration; the excess AREA over the same line — Σ max(0, frameΔ − 40) over
   the banked strip — falls at every pose in both engines, −20.2 % to −25.9 % where control and
   arm travel the same pixels.

---

## 1 · The surfaces and tokens this family touches, re-anchored at `74a2b5d9`

The W7 exec fold touched 13 files; **none of its hunks moved a `transition:`, an `animation:`, a
`setTimeout` or a duration** (`git diff a8fee1f5..74a2b5d9 -- web/frontend/src | grep -E
"^[-+].*(transition|animation|setTimeout|duration)"` returns only test titles). The pass-2 diff
replays onto the fold with NO semantic conflict; only line anchors move in two files.

### 1.1 The TS home

| what | site at `74a2b5d9` | note |
|---|---|---|
| `MOTION.beatMs 125` | `pencilConfig.ts:123` | cadence, EXEMPT (R6 law 7) |
| `MOTION.cardStepMs 440` | `pencilConfig.ts:150` | carries its own cite: "RATIFY-ME (T4-W12 ballot row 4) … auditioned 380/440/520" |
| `MOTION.boardFoldMs 520` | `pencilConfig.ts:157` | cite: "Board⇄card FOLD (T4-W12 Wave C)" |
| `MOTION.chromeLeaveMs 200` | `pencilConfig.ts:163` | cite: "BEAT 0 — chrome leaves (T4-W12 Wave C2 §ENTRY)" |
| `MOTION.curves.drawerGlide` | `pencilConfig.ts:182-194` | R6 laws 1–3, scope fence verbatim in the comment |
| `GLIDE_MS = 520` | `useControlsDrawer.ts:86` | cite in place: "auditioned 480/520/560 by eye at :3001 — the S3′ retune, within Band D" |
| the drawer's controller | `useControlsDrawer.ts:232-240` | "the never-never guard at 520+220" |
| `GLIDE_MS = MOTION.cardStepMs`, `SETTLE_GUARD_MS = GLIDE_MS + 200` | `useCarouselGlide.ts:27,31` | the two guards that disagree (220 vs 200) |
| `guardMs = options.settleGuardMs ?? options.durationMs + 220` | `useFlipGlide.ts:116` | the other guard |
| the fold's two movers | `App.vue:376` (`useFlipGlide({durationMs: MOTION.boardFoldMs})`), `:566-579` (`mastheadMover`), `:584-598` (`runFold`), `:639-652` (`unfoldToBoard`) | |
| the deal's derived delay | `GameGallery.vue:371` `Math.round(MOTION.boardFoldMs * 0.42)` | the delay fence's one derived coefficient |
| `--card-step-ms` publisher | `GameGallery.vue:930` (`:style`, single-quoted) · consumer `GameCard.vue:411-412` | B3's shadow publisher |

### 1.2 The CSS estate (85 duration terms, 106 terms total, 28 files)

Histogram at HEAD (`data/clock-census-74a2b5d9.txt`): 150×18 · 200×14 · 250×8 · **500×6** ·
240×4 · 350×4 · 280×3 · 320×3 · 180×2 · 300×2 · 440×2 · 120×2 · 100×2 · 2650×2 · 0×2 ·
0.01×1 (the universal PRM reset, `index.css:745`) · 160 · 260 · 340 · 380 · 400 · 600 · 800 ·
1000 · 1010 · 1200 — **and 520 × 0**.

- 28 terms carry a bare UA keyword; 27 carry no `--ease-*` and no keyword at all.
- The six 500ms rows the pass-2 spec lengthens to `throw`: `index.css:590` (stroke),
  `index.css:607` (box-shadow), `GameControlPanel.vue:2459` (`sharePop`), `DiceIcon.vue:113`,
  `SolveIcon.vue:70`, `HandDrawnGrid.vue:588` (opacity).
- The one 600ms row at HEAD is `index.css:679` `refuse-shake 0.6s linear` — whose length is
  ALSO typed in TS as `REFUSE_MS = 600` (`useGameCell.ts:184`). One number, two homes, no
  mirror: the exact defect the ladder exists to kill, and B1/B2 as scoped cannot see it.
- Six shipped Tailwind `duration-N` class attributes (`GameBoard.vue:329` duration-500,
  `GameControlPanel.vue:190` duration-250, `StagingBand.vue:154`, `AttributionCard.vue:45`,
  `OptionSelector.vue:52`, plus dev `DebugToggle.vue:29`); 7 `transition-colors` sites ride
  `--default-transition-duration` (`.15s` in the shipped dist).
- The two `gameCell.css` rows are `:35` and `:154` (`marks-fade-in 250ms ease-out backwards`,
  byte-identical) — MRK-LIVE's under chair §6.11 / registry §2.5.
- The dusk is `index.css:667`; `controls-fade-in` `scene.css:612` (250ms + 150ms delay); the
  twins `scene.css:617` and `:629` (200ms `--ease-fadeOut`); `GameControlPanel.vue:2089`
  `transition: all 200ms`; the zone disclosure `GameControlPanel.vue:2291`
  (`grid-template-rows 200ms`, the estate's one layout animation).

### 1.3 The code estate — the roster B1/B2 cannot see (77 clocks, 24 files)

Full list: `data/clock-census-74a2b5d9.txt` §CODE. The classification the ladder needs:

| class | what it is | sites (measured) |
|---|---|---|
| **TRAVEL** — a painted length, the ladder's business | WAAPI durations, draw-in presets, the wash | `useControlsDrawer.ts:86,233` · `useCarouselGlide.ts:27,31,331` · `useFlipGlide.ts:116,165,182,192` · `App.vue:376` · `usePathAnimation.ts:123,163` · `HandwrittenGlyph.vue:201,230` · `glyphAnimations.ts:58,69` · `DifficultyTally.vue:77,148` · `GameCard.vue:190` · `GameGallery.vue:377` · `AnswerKeyLaminate.vue:34,144,145` · `useGameCell.ts:184` · **`useJoinWash.ts:101-130` (15 numbers)** · `pencilConfig.ts:480-504` (`DRAW_IN_PRESETS`), `:511-513` (`GLYPH_ANIM`), `:528-563` (`CELEBRATION`) |
| **WINDOW** — a class held over a gesture, derived from a rung | `DarkModeToggle.vue:671` 400 (holds `.theme-turning` over the 350 dusk + 50), `:676` 1100 (the whole toggle character) · `App.vue:220` 900 (the seam guard) · `GameControlPanel.vue:219` `PEEK_HOLD_MS 350` | 4 |
| **CADENCE** — a beat, R6 law 7's business | `GameControlPanel.vue:96,98` `setTimeout(tick, 120)` (a 4-frame underline boil) · `useSession.ts:910` `CUR_MS = 120` ("~8 Hz") | 2, both a hand-typed near-miss of `beatMs` 125 |
| **POLICY** — a deadline, a backoff, a dwell; never painted | `relayWire.ts:67` `RETRY_MS [250,500,1000,2000,4000]` · `solver/client.ts:56` `DEAL_LEASH_MS 30_000` · `useSession.ts:616,624` 15000/45000 · `GameControlPanel.vue:323` 1600/3600, `:520,:555` 2500 · `App.vue:292` 1200 (idle warm) · `useLongPress.ts:40` 450 · `GameShell.vue:86` 1 | 12 |
| instrument false positives | type declarations and comments the regex read as clocks (`useFlipGlide.ts:88`, `usePathAnimation.ts:49-50,111-112`, `useSession.ts:499`, `solver.worker.ts:232`, `App.vue:83,114` — the async-component `delay: 300`) | 9 of 77 |

The honest §13 sentence this hands the synthesizer: **the ladder governs TRAVEL, in either
language; a WINDOW is derived from a rung and says so; a CADENCE answers to `beatMs`; POLICY
is out of scope by kind, not by file type.** That is a rule a gate can execute over both
rosters, and it is the one thing pass 2's B1/B2 could not state.

---

## 2 · The no-fallback law, measured (chair §6.5 vs the family's §2.1 graft)

`instruments/property-law-probe.mjs` → `data/property-law-probe.{txt,json}`. Eleven documents,
`page.setContent`, chromium + webkit, both regimes. **Both engines agree on every row.**

| case | shape | computed `transition-duration` | computed `transition-property` |
|---|---|---|---|
| A | publisher + byte-equal fallback (pass-2) | 0.52s | opacity |
| B | **no publisher**, fallback kept | 0.52s | opacity |
| C | **no publisher**, no fallback, unregistered | **0s** | **`all`** |
| D | **no publisher**, no fallback, `@property … initial-value: 520ms` | **0.52s** | opacity |
| E | **no publisher**, no fallback, `@property … initial-value: 0ms` | **0s** | opacity |
| F | publisher + registration(0ms) + reduce arm, under `reduce` | **0s** | opacity |
| J | publisher + registration(0ms), no-preference | 0.52s | opacity |
| I | no publisher, no fallback, `animation:` shorthand | `animation-name: none` — the gesture silently never runs |

Four consequences for the spec:

1. **The fallback shape makes a missed publish a NO-OP** (row B) — the critic's "masked
   fallbacks" row, now a measurement in both engines. B3's mirror is the only thing holding it,
   and B3 is static.
2. **The no-fallback shape's failure mode is `transition: all`** (row C) — which is also B4's
   forbidden value. One born-RED row covers both: delete the publisher, read
   `transition-property` on a rung consumer, expect `all`; B4 then reads the live cascade, not
   only the source text.
3. **`@property` with a shipped `initial-value` DEFEATS that row** (row D). The chair's sentence
   ("an absent publisher fails at computed-value time") is true only for an UNregistered
   property. If §13 takes the registration, its `initial-value` must be `0ms` (row E) — absence
   then reads as "every rung instant", which is PRM's own look: invisible to a bitmap, loud to
   B5's roster and to a `getAnimations()` read.
4. **PRM survives registration** (row F vs J): the reduce arm at `:root` still beats the
   registered initial value in both engines. PRM-as-a-value-of-the-ladder is compatible with
   §6.5; nothing in the family's centre has to move.

Estate facts that bear on it: `@property` appears **zero times in `src/`** and **42 times in the
shipped dist** (Tailwind v4's own `--tw-*` registrations, `syntax:"*"`, no initial value) — so
the at-rule already ships, survives Lightning CSS and is not a new dependency. The declared
support floor is `safari >= 16.4` (`package.json:12-16`, held by `check-support-floor.mjs`),
which is exactly the version typed `@property` landed in.

---

## 3 · The bundle, both arms priced

Measured, pass-2 prototype vs its own control (`pass2/prototype/MOT-LADDER/readings/dist-identity.json`):

```
entry CSS  93,920 → 95,517 raw  (+1,597)   18,847 → 19,004 gz  (+157)
entry JS  215,345 → 215,878 raw (+533)     73,453 → 73,669 gz  (+216)
combined                        +2,130 raw                      +373 gz
ceiling                           +400 raw                      +150 gz
```

Where the raw bytes go, from the shipped minification (`dist/assets/index-*.css`: Lightning CSS
writes `440ms` as `.44s`, and a fallback as `,.44s`):

- 59 `var(--motion-*)` positions in the prototype (`grep -ro "var(--motion-" src/` in worktree
  `-60`), every one carrying a byte-equal fallback.
- naming a literal costs ~+17 B a site (`.15s` 4 B → `var(--motion-whisper)` 21 B) ≈ **+1,000 B**
  — the ladder's GRAMMAR, unavoidable while the names are honest.
- the fallbacks cost ~5 B a site ≈ **+295 B** — the only part §6.5 strikes.
- the curve row (bare `ease` → `var(--ease-standard)`, ~+16 B × 14) ≈ **+224 B**.
- 7 `@property` registrations would cost ≈ **+525 B raw**, and gz to a fraction of it (the seven
  lines differ in one word).

| arm | raw Δ CSS | what a missed publish does | gate that catches it |
|---|---|---|---|
| 1 · fallbacks (pass 2) | +1,597 | nothing — the page is byte-identical | B3, static only |
| 2 · no fallback, no registration | ≈ +1,300 | every rung consumer becomes `transition: all 0s` | a live row: delete the publisher, read the cascade |
| 3 · no fallback + `@property` initial 0ms (§6.5) | ≈ +1,825 | every rung collapses to instant | the same live row, plus a typed token |
| 4 · CSS is the ONE home, TS reads the cascade | ≈ +1,300 CSS, **≈ 0 JS** | as arm 2 | as arm 2 |

**The ceiling is unmeetable in raw** at any arm — the grammar alone is 2.5× it — and nearly met
in gz (+157 CSS gz against a +150 ceiling). The recommendation to carry to the owner is to state
the ceiling in the units that ship (gz), and to price arm 4, which is the only one that also
deletes JS: `publishMotionRungs()` disappears, the rungs live in `index.css` beside the easings,
and TS reads `getComputedStyle(document.documentElement).getPropertyValue("--motion-throw")`.
Row F of §2 is what makes arm 4 more than a byte argument: **under reduce the cascade hands TS
`0ms`**, so the drawer, the fold and the carousel collapse to a same-frame swap without a
`reducedMotion` branch at all — the same unification the CSS half already claims. (11 TS
`reducedMotion` arms exist across 8 files; deleting any of them is a separate proof per site,
because some skip work beyond the tween.)

---

## 4 · The dock's acceptance criterion (the frames-over-40 objection, answered)

From the banked pass-2 readings (`pass2/prototype/MOT-LADDER/readings/dock-{control,after}-*.json`),
recomputed here — the probe banks a 10-frame strip of the moving window, so the area statistic is
over that strip and says so:

| pose | engine | travel px (520 / 600) | worst frame | frames >40 | **excess Σ(Δ−40)** |
|---|---|---|---|---|---|
| 768×1024 | webkit | 681.5 / 681.5 | 91.1 → 78.0 | 8 → 8 | **213.2 → 170.2 (−20.2 %)** |
| 390×844 L | webkit | 628.0 / 628.0 | 81.5 → 71.7 | 7 → 7 | **172.0 → 130.3 (−24.2 %)** |
| 390×844 D | webkit | 628.0 / 628.0 | 82.6 → 71.0 | 8 → 7 | **171.7 → 127.3 (−25.9 %)** |
| 768×1024 | chromium | 681.0 / 636.6 | 90.4 → 78.5 | 7 → 7 | 213.9 → 164.6 (−23.0 %) |
| 390×844 L | chromium | 607.5 / 628.0 | 83.3 → 72.5 | 7 → 8 | 170.6 → 132.4 (−22.4 %) |
| 844×390 | both | 302 / 302 | 38.9 → 34.3 | 0 → 0 | 0 → 0 |
| 1440×900 desk | both | 209 / 209 | 23.8 / 13.2 unchanged | 0 | 0 (clocks stay 520×4) |

The three webkit rows are the clean comparison: identical travel to 0.0px, so the arms differ
only in the clock. **The count is non-monotone in duration** (a longer gesture spends longer
above any fixed px line, so a count can rise while every jump gets smaller); **the excess area
is monotone and falls at every pose in both engines.** The sentence for the owner (U-10, the rung
ships only on the word): *at 600 the worst jump falls 11–14 % and the total distance the sheet
covers in jumps bigger than 40 px falls 20–26 %; the number of such frames is unchanged to ±1.*

---

## 5 · What 10.0px is (G-EXIT-MIRROR), answered with the geometry

`instruments/wordmark-rest-geometry.mjs` → `data/wordmark-rest-geometry.{txt,json}`. The frozen
dist on main (`dist/assets/index-9rZPzI5DEcpe.js`, built 2026-09-17 13:53 — NOT a build of
`74a2b5d9`; the masthead is untouched by the fold's copy hunks) served read-only at :4246. Both
engines, `.logo-menu`'s rect at REST in three states, no gesture in flight:

| engine | viewport | playing rest | gallery rest (boot) | gallery rest (after the `g` fold) | \|Δ\| |
|---|---|---|---|---|---|
| chromium | 390×844 | x58.14 y143.52 273.72×78.22 | x107.39 y8 175.2×58.28 | identical | **145.49** |
| webkit | 390×844 | x58.73 y143.80 272.53×77.63 | x107.83 y8 174.34×57.69 | identical | **145.77** |
| chromium | 1440×900 | x191 y39.25 425.58×118.92 | x582.31 y12 275.36×87.59 | identical | **319.10** |
| webkit | 1440×900 | x187 y39.55 423.72×118.33 | x582.98 y12 274.02×87 | identical | **324.02** |

Pass 2's movers declared: enter 145.5 / 145.8 @390 and 319.1 / 324.0 @1440; exit **10.0 / 10.0**
@390 and 316.6 / 318.5 @1440. So the ENTRY is the rest geometry to 0.01–0.3px at both poses in
both engines, the DESK exit is right to 0.8 %, and **only the phone's exit is wrong**. The 10.0
is not the wordmark's playing pose; it is what `runFold` reads in `nextTick` at 390 before the
playing layout exists (`App.vue:584-598` reads each mover's LAST rect one tick after
`applyState()`; at ≥1024 that tick is enough and at 390 it is not). Consequences: G-EXIT-MIRROR
is a REAL defect at the phone (the wordmark cuts out while the board unfolds), the row is not
"corrected with the number", and the cure is App.vue's — one more frame before the last-rect
read, or reading the last rect from the settled layout. The same signature shows on the board
host at the same pose (enter 57.6 → exit 43.9/44.2, −24 %, against 168.4 → 171.2 at the desk).

---

## 6 · A fixed-time sampler exists, and it proves the dusk in one run

`instruments/scrub-sampler-feasibility.mjs` → `data/scrub-sampler.txt`. A CSS transition is an
`Animation`; both engines return a **`CSSTransition`** from `el.getAnimations()`, accept
`pause()` and accept a written `currentTime`. Sampling `background-color` at t = 0, 35 … 350 ms:

- the method is deterministic — same t, same tree, same bytes; no rAF race, no frame budget.
- bare `ease` and `cubic-bezier(0.25, 0.1, 0.25, 1)` (the proposed `--ease-dusk`) return
  **11/11 identical samples in both engines** — e.g. t=140 `rgb(96, 96, 97)` on all four runs.
  The dusk's byte-identity stops being arithmetic and becomes a reading.

The same instrument generalises to the fifteen unframed curve swaps (charter row 8): for each
site, sample the animated property at fixed t on both arms and report max |Δ| — fifteen numbers
instead of fifteen frames, inside the crop cap by construction.

---

## 7 · The thirteen rows, each with the number it now has

| # | the row | what research hands the synthesizer |
|---|---|---|
| 1 | B6 blind at 520 | **0 CSS rows at 520 at HEAD** (§1.2). The bank cannot hold what the tree does not contain: key the ratchet on the RUNG's own value (`bank.rungs.throw = 520`, compare rung-to-rung) and let the site rows ratchet what the sites hold. Both TS consumers (`useControlsDrawer.ts:86`, `pencilConfig.ts:157`) must enter the bank through the CODE roster (§1.3) or the hole stays open. |
| 2 | PINNED is prose | the three cites already exist verbatim in source: `pencilConfig.ts:150` "RATIFY-ME (T4-W12 ballot row 4)", `:157` "(T4-W12 Wave C)", `useControlsDrawer.ts:86` "auditioned 480/520/560 … S3′". A gate can assert (a) the cite string is present at the site, (b) the site's value equals the rung, (c) the rung's docstring names the same ruling. Content, not lines. |
| 3 | B1/B2 see CSS only | the CODE roster: 77 clocks, 24 files, 19 bare literals, with a four-class fence (TRAVEL/WINDOW/CADENCE/POLICY) and 9 named instrument false positives. The two twins that prove the scope matters: `REFUSE_MS 600` ↔ `index.css:679 0.6s`; `WASH.rowArmMs 520` / `440` ↔ the drawer's and the carousel's rungs. |
| 4 | R6 ruling 1 unmoved | the exact text (`R6-census.md:75`): "The drawer's curve is `cubic-bezier(0.32, 0.72, 0, 1)` **at 520ms** — the glass family, zero overshoot." The MOVED proposal scopes the number to the DESK drawer and names the dock's rung, or it says the dock keeps `throw`. Law 2 ("that ruling is the DRAWER's") is the fence the scoping rides on. |
| 5 | the law-4 hunk | the pass-2 diff hunk verbatim keeps `(cardStepMs 440, boardFoldMs 520, chromeLeaveMs 200, the CELEBRATION budget)` inside the new row (`pass2/prototype/MOT-LADDER/instruments/R6-moved-rows.diff`). Re-cut it; and note the law is measurably FALSE at HEAD (`WASH`, `REFUSE_MS`, `LIFT_MS`, `PEEK_HOLD_MS`, `DRAW_STAGGER_MS`, `CUR_MS`, `SAMPLE_MS`, `RETRY_MS`, `DEAL_LEASH_MS`, `HEARTBEAT_MS`), so the honest row states the law's KIND scope. |
| 6 | the dock's case | §4: worst frame −11…14 %, excess area −20…26 % at matched travel, count ±1. Both statistics in the ballot; the rung ships on the owner's word. |
| 7 | the bundle | §3: four arms priced, the raw ceiling unmeetable at any of them, gz +157 against +150, and arm 4 (CSS as the one home) the only one that deletes JS. |
| 8 | fifteen curve swaps | §6's sampler: fixed-t samples of the animated property on both arms, max \|Δ\| per site. Numbers, not frames. |
| 9 | G-EXIT-MIRROR | §5: the 10.0px is stale; the true travel is 145.49/145.77 at 390×844. The defect is real and the cure is App.vue's last-rect read. |
| 10 | G-TONGUE | carried. The berth law is W2 §2.7's and lives in `DrawerTab.vue:79-227` (four berths, the 8px tuck, `z-index: -1` shut / `1` sheet-up); pass 2 measured the onset swap at 163.0/154.0 px and refuted the deferred swap at 371.7 px. A MECHANIC question for W2, not a §13 cure. |
| 11 | theme-flip identity | §6: `CSSTransition` + `pause()` + `currentTime` in both engines; `ease` ≡ `cubic-bezier(.25,.1,.25,1)` 11/11. |
| 12 | B5's CI half | O-12 (R6 law 47) makes CI browserless, so the runtime roster is a local instrument with a banked artifact. What CAN run in CI: the built CSS's own text — the publisher's reduce arm present, and no nonzero literal duration outside the admitted classes in `dist/assets/*.css`. State which half is which. |
| 13 | the ratchet key | `instruments/ratchet-key-collisions.mjs`: over the same rows, `file :: line` collides 15×, `file :: prop :: ms` 23×, `file :: term` 6×, and **`file :: selector :: term` collides 0×**. The content-anchored key needs no ordinal at all; the six `file :: term` collisions (two `gameCell.css` pairs, `scene.css`, `AttributionCard` ×2, `MarginNote`) are all separated by their selector. |
| 14 | the unrun four | `pass1/prototype/MOT-LADDER/probe/i6-standalone.mjs`; `r0/r1-controls/instruments/` and `r0/r3-marks/instruments/` hold no files (the r1 heading-voice spec and the r3 wobble probe live inside those lanes' census dirs — copy whatever the census cites and re-point `OUT`, per the frozen-record law); the 15-gesture frame trace is the pass-2 probe (`pass2/prototype/MOT-LADDER/probe/mot-ladder-runtime.mjs`) re-run on the pass-3 pair. |

---

## 8 · Sketches

### 8.1 One home, two readers — where the numbers can live

```
        ARM 1 (pass 2)                     ARM 4 (measured alternative)
   pencilConfig.MOTION.rungs            index.css @theme :root
        |            |                     --motion-whisper: 150ms  ... x7
        |            +--> publishMotionRungs()   @media reduce { :root { ...: 0ms } }
        |                   <style data-motion-rungs>      |            |
        |                        :root{--motion-*}         |            |
        v                             v                    v            v
   TS movers                  CSS consumers          CSS consumers   TS movers
   durationMs: 520            var(--motion-throw)    var(--motion-   rungMs("throw")
   + reducedMotion branch     + reduce arm           throw)          = read the cascade
                                                                     -> 0ms under reduce,
   two homes, one mirror,     one home, no mirror, no publisher JS,  no branch at all
   B3 holds them equal        PRM is one value for both readers
```

### 8.2 What a missing publisher does (measured, both engines)

```
 rule: transition: opacity var(--motion-throw[, 520ms]) var(--ease-standard);

 fallback kept ........ 0.52s   opacity     <- a deleted publisher is INVISIBLE (row B)
 no fallback .......... 0s      ALL         <- IACVT: loud, and B4's own forbidden value (C)
 no fallback + @property(initial 520ms)
                 ...... 0.52s   opacity     <- registration DEFEATS the born-RED row (D)
 no fallback + @property(initial 0ms)
                 ...... 0s      opacity     <- absence == "everything instant" (E)
 publisher + reduce arm (either shape)
                 ...... 0s      opacity     <- PRM still wins (F) ........ the family's centre
```

### 8.3 The dock band, read two ways

```
  per-frame Δ (px), 390x844, webkit, same 628px of travel
        90 |    x                      x = 520ms arm      o = 600ms arm
           |   x x                     worst 81.5 -> 71.7
        60 | x o o o                   frames >40:  7 -> 7   (a COUNT: flat)
     40 ---+-x-o-------o----------      excess area: 172.0 -> 130.3  (-24.2%)
           |x      o     o
         0 +----------------------- t
            the count cannot fall: a slower sheet spends LONGER above any fixed line.
            the area is the distance the eye sees taken in jumps, and it falls.
```

---

## 9 · Constraints this family collides with

1. **Chair §6.5 vs the family's §2.1 graft** — the byte-equal fallback (charter: "take the
   byte-equal fallback shape") and the no-fallback law are the same decision made twice, in
   opposite directions. §2's measurements say the chair's direction fails loud and the family's
   fails silent; the objection to carry (never in the diff) is that `@property` with a shipped
   initial value re-silences it, so the registration must carry `0ms`.
2. **Chair §6.11 / registry §2.5** — `gameCell.css:35` and `:154` are MRK-LIVE's. Out of this
   diff; named in the return as handed over.
3. **R6 law 7 (one shared beat)** — the widened CODE arm will surface two hand-typed 120ms
   cadences (`GameControlPanel.vue:96,98`, `useSession.ts:910`). They are `beatMs`'s business,
   not a rung's; the fence has to name them or the gate will demand a rung for a beat.
4. **R6 law 43, law 4, ruling 1** — MOVED proposals only, as diffs under
   `pass3/<stage>/MOT-LADDER/instruments/`, never re-cut in place.
5. **O-12 / R6 law 47** — the runtime half of B5 and every dock/exit reading is a LOCAL
   instrument; only the static half can ride CI.
6. **U-10** — `rise` 600, the retune of any PINNED rung, and the dusk's look close on the
   owner's re-look, not here.
7. **M16, filterBudget 9, AA both themes, π** — untouched by construction: the family's diff
   carries no colour token, no filter, and no rendered string (pass-2 critic re-verified all
   three). The fold added copy (`what fits`, `finishes the board for you`) — a §13 diff that
   renders no new string keeps `check-font-coverage` flat.
8. **W2's landed mechanics** — the tongue's berths are W2's; §13 may time them, never re-berth
   them.

---

## 10 · Risks

1. **Arm 4 is a bigger seam than it looks.** Reading the cascade for a duration costs a style
   flush; the drawer and the fold already read rects in the same phase, but the carousel's
   drag path does not. If the read lands in a gesture's hot path the cure is a module-scope
   cache invalidated by one `MediaQueryList` listener (PLR-SELF's graft) — which is a second
   mechanism, and the family's whole thesis is one.
2. **The `transition: all` failure mode is also a gate's subject.** If the publisher is deleted
   in production, B4's live arm reds — good — but a rule that legitimately animates several
   properties reads `all` too. The live row must read the property list on a NAMED consumer,
   never a census of every rule.
3. **The exit cure is App.vue's, and it moves pixels at the phone.** Fixing the 10.0 makes the
   wordmark travel 145px on every phone exit where today it cuts. That is a visible change the
   owner has not seen; it belongs in the ballot with the frames, not in a silent hunk.
4. **The CODE roster widens the gate's blast radius.** 77 sites, 12 of them POLICY, 9 of them
   instrument artefacts. A gate that reds on `HEARTBEAT_MS` will be muted by whoever meets it
   first. The fence must ship with the arm, and the admissions must be content-anchored the way
   §7 row 13 measures.
5. **`WASH` is another family's furniture.** It is §11/§12's surface (the join wash). Naming it
   in law 4 is right; re-homing its fifteen numbers in this pass is scope the section does not
   have. Propose the row, leave the numbers.
6. **The frozen dist is not `74a2b5d9`'s build.** §5's geometry was read off the dist main
   carries (`index-9rZPzI5DEcpe.js`, 2026-09-17). The prototype must re-read the two rest poses
   on its own paired build before the row is banked as π.
