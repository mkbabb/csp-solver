# MEASURE — pass 3, single-tree evidence · 2026-07-31

Every figure below was taken **after the last source edit in the pass**, on **one build**, in
**one run**, against **one artifact set**. Repo `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion`,
MAIN at **`5873a920`** (F3's stage close), tree clean before and after — **nothing was committed,
nothing pushed, nothing deployed**. `npm run build` at HEAD reproduces **`index-DTLxUr3ZTp-8.js`**,
byte-hash-identical to F3's own `dist-F3head`, so the stage's dist and this one are the same
artifact.

**BASE, everywhere below, is `6800af04`** — the sealed P1 patch, the tree pass 3 landed on
(`pass3/stall/dist-head`, `index-CaReTGTNUG3O.js`). Each lane's own report compared against its
immediate predecessor; this pass reads the **whole pass-3 delta** against the seal, which is why
three numbers here differ from the numbers their lanes banked. Where they differ, the difference
is attributed at the commit, not narrated.

Contact sheet: `contact-sheet.html` (69 poses). Raw: `out/*.json|txt`, `gates-*.log`,
sim JSONL under `perf-rig/runs/m3-*` and `pass3/stall/runs/m3-*`.

---

## 0 · Rig, and what it could and could not do

| | |
|---|---|
| headless | chromium + webkit (playwright 1.61), dpr 1 for geometry / dpr 2 for ink and shots |
| static hosts | dist-head :4910 · **base `6800af04` :4911** · attribution dists :4912/:4913 |
| sim host | **`probe-server.mjs` on :4896** (ballot-server pattern: a second port, same dist off disk, rig endpoints verbatim), base twin on :4897; swapped to the stall lane's `mserver.mjs` for the `/__ev/` cells |
| device | `perf-rig-iphone16` `1B3EB33C…` — MobileSafari, iOS 19, **393×699, dpr 3, coarse, hover:none**. Booted at the top of the sim block, **shut down at its close** |
| e2e | dev server :5320 (`PLAYWRIGHT_BASE_URL` explicit — :3000 is the foreign palette-api); built-dist lane on :4188 (**verified free before the run, killed after**) |
| untouched | **:4894 / :4895 alive and never restarted**; :3000 / :3001 / :4288 never addressed |

**The one row that could NOT be taken: the soft keypad would not rise.** Details and the honest
disposition in §6.3. Everything else in the order was measured.

---

## 1 · ESTATE — green, on the committed tree, one run

```
vue-tsc --noEmit              0
vitest                        332 passed / 31 files
eslint · knip · prettier(src/) clean
test:font-coverage            28 codepoints, 13,788 B
lint:ink                      exit 0 — 4 rungs, both themes (§5.2)
e2e default                   101 / 101      PLAYWRIGHT_BASE_URL=http://127.0.0.1:5320
built-dist lane               14 / 14        PLAYWRIGHT_BASE_URL=http://127.0.0.1:4188
  filter-census 3 · wordmark-webkit 6 · theme-bake ×2 engines ×2 directions · throttled-void 1
test:golden:bytes             PASS
npm run build                 green
```

**`filter-census` and `theme-bake-freshness` are green and `filterBudget.ts` did not move.** No
commit was made this stage, so the budget-moves-only-with-a-census-re-derivation rule is not in
play.

### The goldens — the standing darwin trap, now with a matched-pairs control

Three rounds on head, three on the **base dist**, same config, same port discipline:

| subject | head `5873a920` | base `6800af04` |
|---|---|---|
| `logo-light` | ✘ ✘ ✘ — **3948 px, ratio 0.03** every run | ✘ ✘ ✘ — **3948 px, ratio 0.03** every run |
| `toggle-crest-dark` | ✓ ✓ ✓ | ✓ ✓ ✓ |
| `cell-light` | ✓ ✓ ✓ | ✓ ✓ ✓ |
| `grid-corner-light` | ✓ ✓ ✓ | ✓ ✓ ✓ |

The red is **byte-for-byte the same red on a tree that predates every pass-3 commit**, and it is
deterministic here where Lane B and F3 each recorded it as non-deterministic — which is the more
useful reading: the subject is off its darwin baseline on the seal itself. **Nothing was
re-baselined.** Routed to the standing traps ledger and the team-lead row that owns the sun-crest
clause. F3's own two movable subjects (`cell-light`, `grid-corner-light`) pass 6/6 — its §4 grid
cure holds.

---

## 2 · LANE C — the coarse-regime gates · **PART: one cell green, two RED against base**

`out/C-cells-{chromium,webkit}.json`. Every cell banks `regimeOk` from three independent
observables before a figure is recorded; **all ten cells green in both engines**, and the
negative control (phone geometry, `hasTouch` off) reports 423.88 where the real regime reports
558.39 — the witness still refuses its own numbers.

| cell | base `6800af04` | head | Δ (chromium · webkit) | Lane C banked | verdict |
|---|---|---|---|---|---|
| **coarse 390×844** | 590.94 / 590.88 | **558.39** | **−32.55 · −32.49** | −32.55 / −32.49 | **GREEN — reproduces exactly** |
| **coarse 375×812** | 590.84 / 590.78 | **579.61** | **−11.23 · −11.17** | −32.57 / −32.51 | **RED — 21.34px of the cure is gone** |
| **coarse 1280×800** | 1098.25 / 1098.16 | **1135.05** | **+36.80 · +36.86** | −27.89 / −27.83 | **RED — the sign inverted; the panel is now TALLER than base** |
| fine 1280×800 (rail) | 986.31 / 989.22 | 1033.14 / 1036.11 | +46.83 · +46.89 | −27.89 | (rail, not a coarse claim) |
| fine 390×844 NEG CTRL | 448.27 | 423.88 | −24.39 | — | control holds |

**Attributed, not narrated.** Serving Lane B's own close (`18f92c26`) and Lane A's
(`ca8bb001`) side by side (`out/attrib-BA-chromium.json`): both read **558.39 / 579.61 /
1135.05** — identical. The movement is entirely **`a2865f29`, Lane B's `.ctrl-options { gap:
0.45rem }`**, and nothing after it touched these cells. B booked the 1280 number as *"+65px of
rail scrollHeight"*; at **1280×800 coarse that surface is not the rail** — it is the iPad card,
and what grew is the panel itself. **The 375×812 cell is booked nowhere**: B asserted "the phone
card is byte-identical" on the strength of the 390 cell alone, and at 375 the narrower row wraps.

Everything else in Lane C reproduces on the final tree:

| gate | base | head | verdict |
|---|---|---|---|
| names on the card | 6, all one rank | **7 at three ranks — 3 tape / 2 eyebrow / 2 caption** | GREEN |
| `.section-heading` (eyebrow rank) | 6 | **2** (`Size`, `Difficulty`) | GREEN |
| chips with no announced selection | 14 rail / 11 phone | **0 / 0** | GREEN |
| smallest chip, coarse 390 | 43.2 chromium / 43.7 webkit | **44.0 / 44.0** | GREEN |
| panel poses, coarse 390 | 4 painted / 4 promoted | **7 painted / 4 promoted** | +3 painted, **0 new promoted** |

---

## 3 · LANE B — separation · dominance · idle · **GREEN on all three, one claim refuted as it was**

### 3.1 Chip separation — **PASS, and confirmed on glass**

`out/B-sep-{head,base}.txt`, ≥6px threshold, per group along that group's own axis.

| cell | base | head (chromium · webkit) |
|---|---|---|
| 390×844 coarse (row) | 4.00 | **7.19 · 7.19** |
| 375×812 coarse (row) | 4.00 | **7.19 · 7.19** |
| 1280×800 coarse (column) | **0.00** | **7.19 · 7.19** |
| 1440×900 fine (column) | **0.00** | **7.19 · 7.19** |
| 1024×768 fine (column) | **0.00** | **7.19 · 7.19** |

**On real MobileSafari the same 7.19 comes back** (§6.2). The base reads `null` on the device
probe rather than a number, because `.ctrl-options` is B's own class and does not exist on the
seal — an honest structural difference, not a zero.

### 3.2 Idle long-frames vs base — **PASS, no regression on either metric**

`out/B-idle.txt`, 10 s of untouched page after settle, three runs **interleaved base-head** to
split drift, 390×844 coarse.

| | long frames >50 ms | fps | painted poses | **promoted layers** |
|---|---|---|---|---|
| base `6800af04` | **0 / 0 / 0** | 133.83 | 8 | **8** |
| head | **0 / 0 / 0** | 134.00 | 11 | **8** |

Three new wells cost three painted nodes and **zero promoted layers**; Δfps +0.17, inside noise.
Pass 2's 2× idle regression is closed at the primitive and stays closed with B's seam on top.
Honest limit unchanged: headless at 133 fps is not a device — the delta is what carries, and the
device's own promoted-layer count (§6.1) says the same thing.

### 3.3 Ink dominance — **the recut reproduces, and it still refutes F1's own claim**

`out/B-dominance-head.txt`, 1280×900 light, both engines, Lane C's inkmass instrument
(`rectStable: true` on every row).

| rung | mass chromium · webkit | vs Deal |
|---|---|---|
| `difficulty` eyebrow | 682.65 · 687.21 | **3.56× · 3.53× LOUDER** |
| selected difficulty chip | 553.29 · 392.39 | 2.89× · 2.02× |
| `teacher's` tape | 286.08 · 271.94 | 1.49× · 1.40× |
| `size` eyebrow | 242.61 · 240.52 | 1.27× · 1.24× |
| `new game` tape | 224.36 · 226.41 | 1.17× · 1.16× |
| **Deal (whole button)** | **191.62 · 194.41** | 1.00× |
| Deal's die alone | 138.14 · 138.53 | density **0.22102 · 0.22165** |

**Deal ranks 8th of 13 by mass in both engines.** F1's pass-2 "dominant at 1.52–1.54×" does not
reproduce, exactly as B reported against its own base. By DENSITY the die (0.2210) still
out-inks the eyebrow it commits (0.2005) — C's finding, unchanged, with zero ink moved this pass.

Two disclosures carried forward and re-confirmed: `sel_check` and `caption_candidates` report
tight-bbox areas that diverge 5–7× between engines (6327 vs 880; 2997 vs 610.5), so their
**density** rows are not comparable and are not banked. New this run: the `sel_difficulty`
locator resolved to *"Normal"* in chromium and *"Easy"* in webkit — different WORDS, so that
row's cross-engine mass gap is instrument, not engine, and is marked rather than averaged.

---

## 4 · LANE A — the staging band + the rendered census · **GREEN**

### 4.1 The mark-4 gate of record — **zero new surfaces, area growth exactly 0**

`out/A-census.json`, built dists, base vs head, both engines, both scenes, injected-node control:

```
gallery scene   base 17 surfaces / 0 html boxes / 385,463 px²
                head 17 surfaces / 0 html boxes / 385,463 px²    ← identical, both engines
board scene     base  9 / 0 /  90,183      head  9 / 0 /  90,183 ← identical, both engines
controlFires    true in all 8 cells
```

### 4.2 The band's own cells — `out/A-band.json`, both engines, 390 / 768 / 1440

| claim | reading |
|---|---|
| band is a SIBLING of the listbox, never a control inside `role="option"` | `sibling=true`, `insideOption=false` — 6/6 cells |
| 8 tab stops, named and bound | `bandTabStops=8` — 6/6 |
| coarse floor on the band's chips | 6 chips at **52.81 × 44.0** at 390 and 768; 36 tall at fine (no floor there) |
| verbs ≥44 | **87.88 × 44.0** coarse, 87.88 × 40 fine |
| **the verb model** | `deal` carries the die (`svg` present), `resume` carries **no mark** — 6/6 cells, both engines. Icon-presence against icon-absence, visually confirmed at dpr 2 in dark and light (`shots/*-staging-band.png`) |
| `aria-keyshortcuts` | `["d","d"]` — listbox and verb |
| `81 focusables inside role="option"` | **81 on head, unchanged** — the standing Wave-C2 row, this lane's delta zero |

`gallery-deal.spec.ts` ran its **12 rows green** inside the 101-row default suite, including the
guard's own negative control (*"an untouched target board deals straight through"*).

---

## 5 · LANE D — the deal-btn box and the AA rows · **GREEN, both with live controls**

### 5.1 `.deal-btn` — `out/D-dealbox.json`, one build, both engines, both regimes

BEFORE is reproduced in-page by pinning the button back to the base block's fixed square.

| box | fine 1440×900 before → after (chromium · webkit) | coarse 393×699 |
|---|---|---|
| `.deal-btn` | 44×44 → **55.94×54.38** · 44×44 → **55.95×54.36** | 44×44 → **44×52.16** |
| its die `svg` | 28×**17.63** → **28×28** · 28×**17.64** → **28×28** | 28×**19.84** → **28×28** |
| `.control-panel-filtered` | 225×336.47 → **225×336.47** (webkit 225.03×336.44, identical) | 334×96 → **334×96** |
| `.controls-card` box | 281×640 → **281×640** | — |
| `.controls-card` **scrollHeight** | 1066 → **1076 (+10)** · same | — |

The die is square to 0.00px and back at its declared 28. **Zero wrapper growth, zero card-box
growth, +10px of scroll** — the same delta blast §2.3 booked, on a card whose absolute numbers
have since moved under C, B and F3. The booking survives the final tree.

### 5.2 The AA rows — `out/D-ink*.log`

`lint:ink` exit 0: `--ink-press-rule` 3.53 / 4.36 ≥3 · `--ink-press-quiet` 5.23 / 6.06 ≥4.5 ·
`--ink-press-firm` 5.95 / 6.66 ≥4.5 · `--color-red-ink` 4.98 / 6.32 ≥4.5, strictly increasing in
both themes. The **estate-register inversion is printed, not hidden**: `--color-muted-foreground`
4.65 light / 7.69 dark crosses the ladder between themes, booked in `index.css §INK PRESSURE`.

**The `--self-test` ownership case is falsifiable — demonstrated, not asserted.** A copy of the
script with `sources()` sabotaged to return `[]` was run against the same fixture:

```
SABOTAGED EXIT=1
  ✗ gate "ownership" did not fail on a known-bad input — it is vacuous
  ✗ ownership found 0 of the fixture's 2 reintroductions — the collector misses a spelling or an extension
```

The repo was not modified (`git status` empty before and after). Pass 2's charge is discharged.

---

## 6 · F3 — co-visibility · sheet detents · keyboard coexistence

### 6.1 The co-visibility stack — **GREEN headless AND on glass**

`out/F3-covis-{head,base}.txt`, both engines, agreeing to ≤0.03px:

| cell | base pageVh → head | band `.board-margin` | board-bottom → Deal |
|---|---|---|---|
| **390×664 THE CASE** | 1.800 → **1.705** (−0.095) | 51 → **21** | 285.34 → **229.73** (−55.61) |
| 390×844 | 1.416 → 1.341 | 51 → 21 | 285.34 → 229.73 |
| 375×812 | 1.453 → 1.401 | 51 → 21 | 285.31 → 229.70 |
| 430×932 | 1.325 → 1.258 | 51 → 21 | 285.44 → 229.83 |
| 820×1180 iPad portrait | 1.287 → 1.212 | 52 → 22 | 296.05 → 233.80 |
| **844×390 landscape** | **3.895 → 2.533**, `boardFits` **false → true** | 52 → 22 | 296.22 → 233.97 |
| 1280×800 rail | 1.050 → 1.012 | 54 → 24 (overlay) | — |
| 1440×900 rail | 1.007 → **1.000** | 55 → 24 (overlay) | — |
| 390×844 fine NEG CTRL | 1.242 → 1.177 | — | control holds |

The celebration, with its own base control (`out/F3-vignette-*.txt`): base `position: static`,
**docGrowth 109 / ctrlPush 109.18**; head `absolute`, **0 / 0**, ink landing inside the page's
right edge at every cell, both engines. Exactly F3's §3.3 numbers.

**Verdicts, stated as narrowly as the evidence allows.** Board + first tappable control on one
screen, portrait: **MET at every cell** (390×664 needs 531.98 of 664). Landscape 844×390: the
board now fits and co-visibility **misses by 9.27px** (`needChip` 399.27 against 390) — disclosed
by F3, reproduced here. The whole stack in one screen: **NOT met and not claimable — 1.705
viewports.**

The six pass-1 blockers were re-interrogated on the final tree with the failing cohort's own
profile installed (`csp-drawer-open="0"`), both engines, identical rows: B1 no drag handler
(`transform: none → none` after a full synthetic drag at 1440; no rail at 390) · B2 opener never
inside the inert node · B4 card scrolls, tail reachable (640/1076, overflow 436, `overflow-y:
auto`) · B5 wells `[new game, pencils, teacher's]`, `newGameIndex 0` · B6 2 eyebrow / 3 tape / 2
caption.

### 6.2 On glass — real MobileSafari, iPhone 16 sim, 393×699, coarse, hover:none

`stall/runs/m3-covis-{head,base}.jsonl`:

| metric | base `6800af04` | head | Δ |
|---|---|---|---|
| page in viewports | 1.711 | **1.621** | **−0.090** |
| document height | 1196 | 1133 | −63 |
| in-flow band | 51 | **21** | **−30** |
| control panel height | 589 | **557** | **−32** |
| board-bottom → Deal | 284.75 | **229.56** | **−55.19** |
| board-top → first chip | 588.17 | **536.98** | −51.19 |
| tally home | `.board-margin` | **`.deal-row` (the ticket)** | mark 6, on glass |
| vignette position | `static` | **`absolute`** | cured, on glass |
| **chip neighbour gap** | (no `.ctrl-options` on base) | **7.19** | ≥6 ✓ |
| `#controls-drawer` | absent | absent | blast §2.5, confirmed again |

The dark device shot blast §2.7 held `--sheet-washi-neutral` open for is **taken**:
`shots-sim/sim-head-dark-board.png` — every taped word reads as **tape under the word**, not the
highlighter strike RESULTS-pass-2 §3 M5 recorded. Lane C's α 0.83→0.92 cure holds on Apple glass.

### 6.3 Sheet detents — **nothing to measure, and that is the finding**

`grep -rniE "detent|snapPoint|snap-point|drag-sheet|dragSheet|vaul" src/ e2e/` returns **zero**
(the only `scroll-snap` in the tree is the carousel's, `useCarouselGlide.ts`). F3 retired the
drag sheet on evidence rather than deferring it; the tree carries no detent machinery, no sheet
transform, and below 1024 no drawer at all. The retirement is structural, verified, and costs
the estate nothing per gesture.

### 6.4 Keyboard coexistence — **NOT MEASURABLE this session. Stated, not papered over.**

The soft keypad **would not rise** on the sim: `visualViewport.height` stayed **699 → 699** on
both builds with a genuinely focused blank numeric cell (`activeIsCell: true`, `blankCells: 20`,
`inputmode="numeric"`), across four probe shapes including **pass 2's own `b-keypad.js`, verbatim**
— the instrument that measured the 296px band on this exact device. `ConnectHardwareKeyboard`
was written false and the Simulator restarted; the band stayed 0. Two consequences, both
recorded:

1. **The negative control is vacuous this session.** The injected 7-item fixed tray comes back
   **0% occluded** — because there is no band, not because the tray clears one. Pass 2's control
   returned 100% occluded, so the instrument is proven able to fail; it simply is not exercised
   here. A vacuous control is not a pass.
2. **`window.scrollTo(0, docHeight)` is reverted to 0** in this MobileSafari session while
   `scrollIntoView` works, so "Deal at maximum scroll" cannot be posed on glass either.

What CAN be said, and its exact standing: with `scrollIntoView({block:"center"})` — the only
scroll the session honours — Deal lands at bottom **374.8 head / 375.0 base** in a 699 viewport.
Against pass 2's **banked 296px band** (viewport 403) that is **+28.2px / +28.0px of clearance,
positive on both builds** — arithmetic against a banked band, **not a measured band**. The gated
number remains Lane B's headless G4 with its live control: **+109.66 chromium / +110.25 webkit at
390×844**, control reds by 187–273px at every cell. Sign agrees; magnitude is not comparable
because the two probes pose different scroll states.

**This is a rig row, not a code row**, and it is the third session in a row where the device rig
foreclosed a mandated cell (pass 2: locked screen; pass 3 stall lane: recovered; here: the
keypad). It belongs on the owner/team-lead list beside the two blind reads.

---

## 7 · THE SIM BATTERY — five scenarios, state-pinned, interleaved · **NOTHING REGRESSES**

One battery, `perf-rig/run-sim.sh`, `EXTRA='game=sudoku&size=3&difficulty=EASY&__theme=dark'`
(the pin verified on every env line: `themePinned=dark`, `htmlDark=true`, board 81 cells), three
rounds, **each round head-then-base on adjacent ports in the same minute** so the session drift
W4 §2 characterised lands on both arms.

| scenario | head median | base `6800af04` median | **Δ base** | P1-sealed | Δ sealed | gate | verdict |
|---|---|---|---|---|---|---|---|
| `idle3s` | **59.25** | 58.84 | **+0.41** | 59.62 | −0.37 | ≥59 | **PASS +0.25** |
| `deal` | 59.63 | 60.19 | −0.56 | 60.35 | −0.72 | — | — |
| `solveCelebration` | 58.15 | 58.59 | −0.44 | 57.65 | +0.50 | — | — |
| `galleryGlide` | **50.51** | 50.49 | **+0.02** | 49.25 | +1.26 | ≥49 | **PASS +1.51** |
| `themeToggle` | **53.41** | 53.43 | −0.02 | 52.01 | +1.40 | ≥45 | **PASS +8.41** |

Every window: idle 58.78/59.25/60.34 vs 58.06/58.84/59.92 · deal 59.12/59.63/60.28 vs
60.19/60.19/60.23 · solve 57.84/58.15/59.35 vs 57.36/58.59/58.90 · gallery 49.57/50.51/51.22 vs
50.47/50.49/50.83 · theme 52.99/53.41/53.81 vs 52.61/53.43/53.45. Long frames >50 ms are
identical across arms at every scenario (0/0/0 idle and deal; gallery 3–4 both; theme 2 both).

**The no-regression trap is clear on all five.** The largest adverse Δ is **−0.56 fps** (`deal`),
a fifth of the **±2.5** run-to-run spread this instrument's own idle cell established and a third
of the **~1.6 fps** sham floor W4 §2 measured on the heavy scenarios. `solveCelebration`'s −0.44
sits in the same band and its head windows straddle base's. Read the two gated PASSes with the
same discipline the seal itself demanded: none of these cells is separable from the box at ±1 fps
at n=3, and the honest statement is that **the pass-3 design work is invisible to the device's
frame budget in either direction** — which is the result the campaign wanted.

### The device census — the structural half, head vs base, same session

| | base | head |
|---|---|---|
| DOM nodes | 1064 | 1092 (+28) |
| **live `filter`** | **17 (html 0)** | **17 (html 0)** — zero new |
| **`will-change` ≠ auto** | **39** | **39** — zero new promoted layers |
| `transition: all` + duration | 1 | 1 |
| `boil-pose` nodes | 8 | 20 (+12) |
| `rest-pose` / `dt-pose` | 8 / 4 | 8 / 4 |

The +12 pose nodes are the three new wells' frame stacks; **`will-change` does not move**, and
the headless counterpart says only +3 of them paint. The pose prune holds on real WebKit — which
is the claim Lane C made structurally and Lane B made temporally, now witnessed on the device.

---

## 8 · SCREENSHOTS

`shots/` — **64 poses**: board scene · control-panel card · `.deal-btn` · gallery scene ·
staging band, each at **390 / 768 / 1440**, **light and dark**, **chromium and webkit**, dpr 2,
theme pinned before boot so no flip lands inside a capture; plus 844×390 landscape per engine per
theme. `shots-sim/` — **5 device frames** (head light/dark board + gallery, base light board) at
393×699 dpr 3. Index: `contact-sheet.html`.

What the render shows that the assertions do not: the two surviving eyebrows carry **different
crayon registers** — `size` graphite, `difficulty` green — at the same rank, in both themes and
all three viewports. It is the zone grammar's own tint, it is not a defect, and it is not
mentioned in any lane report; naming it here because the shot shows it and a rank claim that
looks like two ranks is a question for the adjudicator.

---

## 9 · DISPOSITION

| row | verdict |
|---|---|
| estate green on the final tree | **YES** — vue-tsc 0 · vitest 332/31 · e2e 101/101 · built-dist 14/14 · census + theme-bake green · budget unmoved |
| Lane C coarse gates | **PART — 390 green, 375×812 and 1280×800-coarse RED against base**, attributed to `a2865f29` |
| Lane B separation · idle · dominance | **GREEN · GREEN · GREEN** (dominance reproduces as a refutation of F1's own claim) |
| Lane A band + census | **GREEN** — 8/8 census cells identical, control fires in all 8 |
| Lane D deal-btn + AA | **GREEN**, both with live controls; the `--self-test` ownership case shown able to red |
| F3 co-visibility | **GREEN** headless and on glass; landscape co-visibility misses by 9.27px, as disclosed |
| F3 sheet detents | **GREEN by construction** — zero detent machinery in the tree |
| F3 keyboard coexistence | **NOT MEASURED** — the sim's soft keypad would not rise; the control is vacuous this session |
| sim battery, five scenarios | **PASS on all three gates, and nothing regresses base** (worst Δ −0.56 fps against a ±2.5 law) |
| goldens | `logo-light` reds **identically on base and head**, 3948 px both, 3/3 each — pre-existing, **nothing re-baselined** |
| commits | **none.** MEASURE produced evidence; the tree is byte-identical to `5873a920` |

**Open, routed, plainly:**

1. **The 375×812 and 1280×800-coarse panel regressions** (§2). Lane B bought 7.19px of separation
   at every cell and paid 21.34px at 375 and 64.69px at the iPad coarse card. The 1280 half is
   half-booked (as rail scroll, on the wrong surface); the 375 half is unbooked. Both belong to
   the adjudicator, with the price now measured on both sides.
2. **The keypad rig row** (§6.4) — the third mandated device cell in three passes to be foreclosed
   by the rig rather than by the tree.
3. **`logo-light` is off its darwin baseline on the seal itself** (§1) — not a pass-3 defect and
   not this stage's to re-baseline, but it is no longer honest to call it non-deterministic.
4. **The two eyebrows' crayon registers** (§8) — a rank claim that renders as two registers.
5. Unchanged and still owner rows: the M4 and M2 blind reads (≥4 uninstructed cold readers), and
   the landscape row regime F3 measured at 9.27px and left unbuilt.
