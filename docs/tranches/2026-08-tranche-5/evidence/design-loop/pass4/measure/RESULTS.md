# MEASURE — pass 4, single-tree evidence · 2026-08-01

Every figure below was taken **after the last source edit in the pass**, on **one build**, against
**one artifact set**. Repo `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion`, MAIN
at **`52ef014a`** (F3's stage close, ≥ `5873a920`), tree clean before and after — **nothing was
committed, nothing pushed, nothing deployed**. `npm run build` at HEAD reproduces
**`index-6v9S84SRo2al.js`**, md5 `dc6424524ce09d0cc9e4865c561beeac`, **byte-identical to F3's own
`dist-F3head`**, so the stage's dist and this one are the same artifact.

**BASE, wherever a delta is against the seal, is `6800af04`** — the sealed P1 patch
(`pass3/stall/dist-head`, `index-CaReTGTNUG3O.js`), re-served and re-measured in THIS session
rather than quoted. Where a cure needs its predecessor instead, the arm is the **pass-3 close**
(`3969f512`, `pass4/dist-F3base`, `index-DHaSmfrTPFf0.js`) — the tree the defect shipped on.

Raw: `rig/out-*.json`, `logs/measure/*.log`, `logs/measure/device*.jsonl`,
`logs/measure/m4-bat-*.jsonl`. Shots: `shots/` (117) + `shots-sim/` (5).

---

## 0 · THE DEPLOY GATE — pass3-registry §5, row by row, verbatim

| §5 row | verdict | the number it rests on |
|---|---|---|
| **iPad coarse card ≤ 1098.25** | **PASS** | **1067.86** chromium / **1067.83** webkit at 1280×800-coarse; the seal re-measured this session reads 1098.25 / 1098.16 → **−30.39 / −30.33**. `regimeOk` from three observables in every cell |
| **A1 ribbon closed with its failing e2e cell** | **PASS** | the guard fires on glass (real MobileSafari, sub-line `your marks aren't saved`) and NOT on a pristine board; the born-RED **reproduced by MEASURE**: the pass-3 shape restored reds `gallery-deal.spec.ts:318` **alone**, 1 failed / 16 passed, 17/17 on restore |
| **`d4e8e41e`'s boot path attributed on JavaScriptCore** | **PASS** | THIS build on `perf-rig-iphone16`, iOS 19, Version/19.0 Mobile: `booted true · cells 81 · ctrlBtns 14 · headings ["Size","Difficulty"] · dealFound true · boardChanged true · errors [] · 2009 ms`, trap installed in `<head>` ahead of the module script |
| **tally line restored or ruled** | **PASS** | exactly **1 paint at every width**, both engines — `strip` at 390/375/430/820/1023/1279, `vignette` at 1440. The pass-3 close reads **0 at all six sub-1280 cells**, and its probe is shown able to see a paint on that same build |
| **landscape rung priced or reverted** | **PASS (priced, not reverted)** | 844×390 cell **40.22px**, exactly the phone's own portrait cell; the pass-3 close reads 25.11. Priced against the seal (board did not fit at all) and against the ladder. Its disclosed cost re-measured: fold overflow **90.58 chromium / 89.98 webkit** (F3 banked 88.58) |
| **deploy ONLY via `npm run deploy`, owner-authorized** | **HELD** | nothing was deployed, no `wrangler` invocation, no `npm run deploy`; production is untouched at CF deployment `f1adfca5`. This row is the owner's at cut time, not a measurement |
| *(the standing mandate)* **the sealed P1 state must not regress** | **PASS, with one disclosure** | every geometry cell is at or under the seal (below); all three gated sim scenarios pass. **Disclosure**: against the seal's OWN build in the same session all five scenarios read 0.43–1.18 fps low — each inside the ±2.5 law, the sign uniform. §7 |

---

## 1 · ESTATE — green, on the committed tree, one run each

```
vue-tsc --noEmit               0
vitest                         332 passed / 31 files      ← F3's dossier says 32 files; it is 31
eslint · knip · prettier(src/) clean
test:font-coverage             2 faces — Fraunces 28 cp/13,788 B · Patrick Hand 46 cp/4,312 B
lint:ink --self-test           exit 0 — 3 rungs × 3 scopes + red-ink + washi tape, 6 gates self-proved
test:golden:bytes              PASS
e2e default                    115 / 115    PLAYWRIGHT_BASE_URL=http://127.0.0.1:5322 (dev server)
built-dist lane                17 / 17      PLAYWRIGHT_BASE_URL=http://127.0.0.1:4188 (THIS dist)
  filter-census 6 (G3.1 · G3.2 ×2 · G3.3 coarse · G3.5 ×2 hovered) · wordmark-webkit 6 ·
  theme-bake-freshness ×2 engines ×2 directions · throttled-void 1
goldens                        4 / 4 on EIGHT consecutive runs (§8)
npm run build                  green
```

**The rendered filter census in its hover-aware form is green on the built dist, both regimes**
(G3.5 board + picker), and **theme-bake-freshness is green in both engines and both directions** —
order cell 8, closed. `filterBudget.ts` did not move; MEASURE committed nothing, so the
budget-moves-only-with-a-re-derivation rule is not in play.

**One inherited red does NOT reproduce.** F3 banked `114/115` with
`gallery-deal.spec.ts:432` ("a same-game deal issued BEFORE the scene mounts") failing on a vite
**preview**, attributed to Lane A and reproduced on the base tree through the same preview. On the
**dev server** that row passes, here, 3/3 (115/115 in the full suite and 17/17 in two focused runs).
The row is a preview-timing artifact of the lazy-chunk hold, not a tree defect — which is the
narrower and truer statement than either lane made.

---

## 2 · THE FULL COARSE TABLE, republished from THIS build

`rig/cells.mjs` (stage BC's instrument, unmodified), off `dist-head`, both engines, every cell
banking `regimeOk` from three independent observables before a figure is recorded — **all five
cells green in both engines** on both arms, and the fine-390 negative control holds.

| cell | P1 seal (re-measured) | **pass-4 HEAD** | **Δ vs seal** | webkit | pass-3 HEAD |
|---|---|---|---|---|---|
| **1280×800 coarse — the iPad card** | **1098.25** | **1067.86** | **−30.39 ✓** | 1067.83 (−30.33) | 1135.05 (+36.80) |
| **375×812 coarse** | 590.84 | **579.61** | **−11.23** | 579.61 | 579.61 |
| **390×844 coarse** | 590.94 | **558.39** | **−32.55** | 558.39 | 558.39 |
| **1440×900 fine (rail)** | 987.77 | **974.94** | **−12.83** | 974.80 | 1036.13 |
| 390×844 fine — NEG CTRL | 448.27 | 423.88 | −24.39 | 423.86 | 423.88 |

`minGap` is **7.19 at every cell in both engines**; the seal reads 4.00 on the phone rows and
**0.00** on both column rows. Deal's keypad headroom at the two phone cells: **+110.05 / +131.08**
chromium, +109.64 / +130.67 webkit — BC's figures to 0.00px.

**Both of BC's payments are visible in the budget, not just in the total.** At 1280-coarse the
binary now measures `n=2 · axis=row · 78.95×44 · groupH 44` under `.ctrl-options.options-pair`
against the seal's `n=2 · axis=column · groupH 88`; and `.peek-hold-surface` carries
`mt=0px mb=0px` against the seal's `8px/8px`. 44 + 16 = the 60px of the 64.8px seam bill, and the
card ends 30.39 under the bar it had to clear.

**C's republished 375 row reproduces as republished**: −11.23, not the −32.57 pass 3 banked. The
claim that survives measurement is **−32.55 at 390 only**.

---

## 3 · THE CO-VISIBILITY STACK, on the final tree

`rig/covis.mjs` (F3's instrument, extended with the rendered CELL box), three arms, both engines
agreeing to ≤0.03px.

| cell | pageVh seal → **head** | band | board | **cell px** | co-visible |
|---|---|---|---|---|---|
| **390×664 THE CASE** | 1.800 → **1.705** | 51 → **21 flow** | 366 | **40.22** | YES (needs 531.98 of 664) |
| 390×844 | 1.416 → 1.341 | 51 → 21 | 366 | 40.22 | YES |
| 375×812 | 1.453 → 1.401 | 51 → 21 | 351 | 38.55 | YES |
| 430×932 | 1.325 → 1.258 | 51 → 21 | 406 | 44.66 | YES |
| 820×1180 iPad P | 1.287 → 1.212 | 52 → 22 | 672 | 74.22 | YES |
| **844×390 landscape** | **3.895 → 2.882** (`boardFits` false → **true**) | 52 → 22 | 230 → **366** | 25.11 → **40.22** | no, both arms |
| 926×428 landscape | 3.551 → 2.720 | 53 → 22 | 268 → **404** | 29.33 → **44.44** | no, both arms |
| 1280×800 rail | 1.050 → 1.012 | 54 → 24 ovl | 640 | 70.66 | YES |
| 1440×900 rail | 1.007 → **1.000** | 55 → 24 ovl | 672 | 74.22 | YES |
| 390×844 fine NEG CTRL | 1.242 → 1.177 | — | 366 | 40.22 | control holds |

Every portrait cell is byte-identical between the pass-3 close and head except the landscape pair —
F3 moved what it said it moved and nothing else. **The whole stack is still 1.705 viewports at
390×664, and is still not claimable.** The tally's home reads `control-panel` (the ticket) on head
against `board-margin` on the seal, at every cell — mark 6, on the final tree.

### The landscape rung, priced (order cell 5)

The shipped cap buys **40.22px**, the same cell that phone draws in portrait — a rotation now costs
nothing per cell, which is the property the rung's renamed gate asserts. Against the estate's 44px
floor the cell is 3.78 short at 844×390 and **44.44 at 926×428**, so the floor is reachable where
the device allows; that floor is `.ctrl-btn`'s coarse min-height (measured 44/45 in the same cells)
and has never bound a board cell.

**Its disclosed cost re-measured, and one number corrected.** F3 banked an 88.58px fold overflow;
this build reads **90.58 chromium / 89.98 webkit** (board bottom 480.58 in a 390 viewport, chrome
above the board 114.58). Same finding, 2px off its banked figure. The pass-3 close overflowed by
**−45.42** — i.e. sat whole above the fold, as F3 said, on a 25.11px cell.

---

## 4 · THE SUB-1280 TALLY RULING (order cell 4)

`rig/tally.mjs` — a real solve at seven widths, both engines, paints counted with the area
intersected against **every clipping ancestor** (the sr-only pattern leaves the child's rect at full
size; a naive width read scores the exact defect as a pass).

| width | head paints | where | pass-3 close (`3969f512`) |
|---|---|---|---|
| 390×664 · 375×812 · 430×932 · 820×1180 · 1023×800 · 1279×800 | **1** each | `strip` | **0** each |
| 1440×900 | **1** | `vignette` | 1 (`vignette`) |

Both engines, identical. The string is `0 backtracks — 1ms`.

**The control, and its honest limit.** On head the in-place plant is seen (2 where 1 is demanded)
at every cell. On the pass-3 close the same plant reads 0 — correctly, because the host it lands in
is the clipped strip, which is the defect itself. So that arm's control was re-run where it has
range: an UNCLIPPED plant on the same page, same build, is seen **1/1 in both engines**
(`tally-p3close-unclipped-control.log`). The 0 is a measurement, not a blindness.

---

## 5 · A1's GUARD, ON GLASS (order cell 2)

`perf-rig-iphone16`, MobileSafari, iOS 19, **393×699, dpr 3, coarse, hover:none**,
`index-6v9S84SRo2al.js`, one page life, three transactions driven through the app's own wiring
(`logs/measure/device-ribbon.jsonl`). The deck is walked by the listbox's own contract — 4 presses,
each awaiting its `aria-activedescendant` before the next.

| transaction | reading |
|---|---|
| **CONTROL** — pristine sudoku → deal kenken | ribbon **not shown**, dealt through, `game=kenken` |
| **THE ROW** — dirty sudoku → deal kenken | ribbon **SHOWN**, `aria-label="Deal a new board?"`, sub-line **`your marks aren't saved`**, keep + leave present, the picker **held**; confirming deals through to kenken |
| **SAME-GAME** — the picker on the game already mounted, size chip moved to 5×5 | staged pair landed: **16 → 25 cells**; the scene root's stamp **survived** (`.board-peek-host[data-scene-probe="1"]` = 1) — the bridge, not a remount |
| errors | **`[]`**, with the trap installed ahead of the module script |

**MEASURE re-ran Lane A's born-RED rather than quoting it.** `destroysWork` restored to the pass-3
shape (`props.dirty && card.id === props.currentId`), whole spec re-run against the dev server:

```
1 failed
  gallery-deal.spec.ts:318 › guard: a cross-game deal ABANDONS the mounted board —
                             dirty sudoku, clean target, ribbon
16 passed
```

Exactly that row and nothing else; restored, **17 passed**; `git status` empty before and after.

**One probe defect, found in the headless dry run and named because it travels**: kenken deals a
board of BLANK cells (its clues are cages, not givens), so a given-fingerprint compares equal to
itself across a re-deal and scores a dropped pair as a pass. The same-game row is therefore posed on
the staged SIZE, which reports both halves at once. It is the class of defect Lane D caught in its
own dry run, on a different family.

---

## 6 · THE BOOT ATTRIBUTION, RE-TAKEN ON THIS BUILD (order cell 3)

```
perf-rig-iphone16 · iOS 19 · AppleWebKit/605.1.15 · Version/19.0 Mobile
393×699 dpr3 · pointer:coarse · hover:none · index-6v9S84SRo2al.js
booted true · cells 81 · ctrlBtns 14 · headings ["Size","Difficulty"]
dealFound true · boardChanged true · errors [] · 2009 ms
```

`headings` and `ctrlBtns` are the hand copy `d4e8e41e` created, rendered; `boardChanged` is one Deal
through the panel's own wiring. Lane D's closure holds on a tree five commits newer than the one it
was taken on.

On glass, in the same session: `panelH 556.89 · band 21 in flow · square 369 · cell 40.55 ·
doc 1133 · pageVh 1.621 · tally home = the ticket`.

### The device filter census — and a rig-state trap worth naming

| arm | spec-rule (`display` ≠ none) | device rule | rows |
|---|---|---|---|
| head, **fresh origin** | **9** | **13** | the budget's own members, exactly |
| pass-3 close, fresh origin | 9 | 13 | identical |
| head, **origin reused by my earlier probe runs** | 11 | 15 | **+2 `svg.crayon-heart.idle`** |

The +2 is the attribution's hearts, resident from a previous page life on that origin's persisted
state — **not the tree**. On a clean origin head reads 9/13, which agrees to the unit with Lane D's
device figures and with the shipped budget (G3.3 asserts 9/9 at 393×699 and is green here). Banked
because a census that moves with the rig's own history is exactly how a budget row goes quietly
wrong, and the settled re-read (+4s, unchanged) rules out a mid-swap count.

---

## 7 · THE SIM BATTERY — five scenarios, state-pinned, interleaved, **n=5**

One battery, `perf-rig/run-sim.sh`, `EXTRA='game=sudoku&size=3&difficulty=EASY&__theme=dark'` (pin
verified on every env line: `themePinned=dark`, `htmlDark=true`), **five rounds, each round
head-then-base on adjacent ports in the same minute** so the session drift lands on both arms. The
base arm is the seal's own build, served beside head — not a quoted number.

| scenario | head median | base `6800af04` median | **Δ base** | P1-sealed (banked) | Δ sealed | gate | verdict |
|---|---|---|---|---|---|---|---|
| `idle3s` | **59.04** | 59.66 | −0.62 | 59.62 | −0.58 | ≥59 | **PASS +0.04** |
| `deal` | 59.66 | 60.23 | −0.57 | 60.35 | −0.69 | — | — |
| `solveCelebration` | 58.34 | 58.88 | −0.54 | 57.65 | **+0.69** | — | — |
| `galleryGlide` | **49.59** | 50.02 | −0.43 | 49.25 | +0.34 | ≥49 | **PASS +0.59** |
| `themeToggle` | **51.56** | 52.74 | −1.18 | 52.01 | −0.45 | ≥45 | **PASS +6.56** |

Head windows: idle 56.55/59.04/58.02/59.63/59.86 · deal 54.51/59.69/59.69/59.66/59.63 · solve
58.60/58.34/58.08/58.63/58.12 · gallery 49.17/49.59/49.59/49.98/49.98 · theme
51.58/51.44/51.59/51.56/49.74. **Round 1 of the head arm carried 4 front re-asserts** (the rig's own
focus-churn warning) and is the low outlier in three scenarios; it is kept in the median, not
dropped. Long frames >50 ms: idle 0 both arms after r1 · deal 0/0 · solve 0/0 · gallery **3–4 head
vs 3 base** · theme **2–3 head vs 2 base**.

**All three gates hold and no scenario regresses the banked seal by more than 0.69 fps.** Two things
must be said with it, because neither is visible in a verdict column:

1. **The idle gate clears by 0.04 fps.** At n=5 against a ±2.5 run-to-run law — and a head idle arm
   that itself spans 3.31 fps — that is not separable from the box. It is a pass, and it is a pass
   with no margin to report.
2. **The in-session sign is uniform**: all five scenarios read low against the seal's own build in
   the same minute, −0.43 to −1.18. Each magnitude is a fifth to a half of the instrument's spread,
   so no single cell is a finding; five of five in one direction is worth the adjudicator's eye and
   is not something an average would show.

### The device census, structural half, same session

| | seal `6800af04` | head |
|---|---|---|
| DOM nodes | 1064 | 1090 (+26) |
| **live `filter`** (gallery scene, battery's own rule) | **17** | **17** — zero new |
| **`will-change` ≠ auto** | **39** | **39** — zero new promoted layers |
| `transition: all` + duration | 1 | 1 |
| `boil-pose` / `rest-pose` / `dt-pose` | 8 / 8 / 4 | 20 / 8 / 4 |

Twelve more pose nodes, **zero new promoted layers and zero new filtered surfaces** — the pose prune
holds on real WebKit at the pass-4 close exactly as it did at the pass-3 close.

---

## 8 · GOLDENS — eight consecutive runs, nothing re-baselined

`logo-light` · `toggle-crest-dark` · `cell-light` · `grid-corner-light`: **4 passed on every one of
8 runs** against the built dist (3 before the device block, 5 after it). Nothing was re-baselined by
MEASURE.

That is a third reading of the flake row, and it disagrees with both lanes' rates rather than
confirming either: Lane D read `toggle-crest-dark` **4 red / 11**, F3 read **5 red / 14** (with a
no-op control arm reding 3/14), MEASURE reads **0 red / 8**. The three sets are the same subject on
the same host on the same day, so the subject is load- and session-sensitive, which is what the
sun-crest clause already says about it. **It stays a team-lead row and it must not be re-baselined
on any of these three rates.** `logo-light` is green post-remint, 8/8, and `test:golden:bytes` PASSes
at the re-minted size.

---

## 9 · SHOTS (order cell 9)

`shots/` — **117 poses**: board · panel-card · deal-btn · **deal-row (the ticket + receipt)** ·
gallery · staging-band, each at **390 / 768 / 1440**, **light and dark**, **chromium and webkit**,
dpr 2, theme pinned before boot; plus **844×390 landscape** (viewport and full-page) per engine per
theme; plus the three journey poses no URL can pose — **guard-ribbon** (dirty → cross-game deal),
**solved-tally**, **check-status** — at 390 and 1440, both engines, both themes.
`shots-sim/` — **5 device frames** at 393×699 dpr 3.

Two honest gaps in the artifact set, stated rather than filled:

- `1440-solved-tally` crops 1 of 4 (the vignette meta clip fails in three cells); the pose is
  witnessed by `1440-solved-page` in all four.
- The device frames are **dark-theme only**. `__theme=light` did not override the origin's persisted
  dark preference after the battery pinned it, and the board they show is the battery's solved one.
  A rig limit, disclosed; the ordered theme matrix is the headless one above, which is complete.

**What the render shows that no assertion does.** Two things, one carried and one new:

- Carried from pass 3 §8, still true on this build and still unaddressed: the two surviving eyebrows
  sit at one rank in two crayon registers, `size` graphite and `difficulty` green, in both themes,
  at all three viewports, and on the device frame. A rank claim that renders as two registers.
- New, off the ribbon crop: the guard is `role="alertdialog"` with `aria-label="Deal a new board?"`
  while the drawn heading reads **`deal over this puzzle?`** — two strings for one surface, at the
  picker rank, inside this pass's headline cure. Stage BC spent a gate this pass on exactly that
  property one rank down (*"the accessible name and the drawn one are one string"*, scoped to the
  zone tapes). Not a violation — an alertdialog may carry its own label and the sub-line is what
  names the risk — but the estate has a stated principle and its most destructive confirmation
  departs from it. An adjudicator row, not a defect row.

---

## 10 · DISPOSITION

| row | verdict |
|---|---|
| deploy gate, all six §5 rows | **5 PASS · 1 HELD (the owner's own deploy row)** |
| the seal must not regress | **PASS** — every geometry cell at or under the seal; three sim gates hold; uniform-sign disclosure at §7 |
| estate at HEAD | **GREEN** — vue-tsc 0 · vitest 332/31 · e2e 115/115 · built-dist 17/17 · census (hover-aware) + theme-bake green · lint:ink 0 · golden-bytes PASS |
| iPad card (cell 1) | **1067.86 / 1067.83 — 30.39 under the bar** |
| A1 on glass + born-RED (cell 2) | **CLOSED** — fires, does not over-fire, confirms through; the RED reproduced by a non-author |
| boot attribution (cell 3) | **CLOSED on this build** — booted, dealt, `errors: []` |
| tally ruling (cell 4) | **CLOSED** — 1 paint at seven widths, 0 on the tree it shipped broken |
| landscape rung (cell 5) | **PRICED** — 40.22 = portrait parity; overflow re-reads 90.58/89.98 vs F3's 88.58 |
| coarse table + covis (cell 6) | **REPUBLISHED from this build** — §2, §3 |
| sim battery (cell 7) | **PASS on all three gates**, worst Δ vs the seal's own build −1.18 fps |
| census + theme-bake (cell 8) | **GREEN** — hover-aware in both regimes, bake fresh in both engines and directions |
| shots (cell 9) | **117 + 5**, two gaps disclosed |
| commits | **none.** MEASURE produced evidence; the tree is byte-identical to `52ef014a` |

**Open, routed, plainly:**

1. **The idle gate's 0.04 fps of margin and the uniform in-session sign** (§7). Not a regression by
   any gate the campaign has written; not nothing either. The adjudicator's, with n=5 windows
   printed.
2. **F3's 88.58 reads 90.58 / 89.98** (§3). The finding stands; the figure is 2px off.
3. **`toggle-crest-dark`: three rates, three lanes, one day** (§8) — 0/8 here. Team-lead row,
   unchanged; no re-baseline on any of them.
4. **The two eyebrows' crayon registers** (§9) — third pass carrying it, now visible on glass.
   Beside it, new this pass: **the guard's two names** (`alertdialog` label vs drawn heading, §9).
5. **The device census moves with rig state** (§6) — an instrument row for whoever takes the next
   device census: measure on a fresh origin or measure the rig's history.
6. **F3's `114/115` does not reproduce on the dev server** (§1) — the row is a preview artifact, not
   Lane A's defect. Worth correcting in the registry, because it was routed as a lane row.
7. Unchanged owner rows: M4/M2 blind reads · the keypad rig row · E8 device smoke · the 2 dependabot
   highs · `lint:ink` now IN CI (Lane D closed it this pass).
