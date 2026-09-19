# T9-W8 §8.2 / §8.3 — THE FOLD MANIFEST

    FROZEN 2026-09-18 · the 8.2 fold record (the charters are dated 2026-09-17; this reads what landed through 2026-09-18)
    master at synthesis: 74a2b5d9 (the W7 execution fold) · the tracks' preSha: 7b0610cc · 8.1's pin: index-9rZPzI5DEcpe.js md5 fa3d1af9870916cc728de11e97f57a90

Five tracks (`w8/probe`, `w8/bake`, `w8/wasm`, `w8/app`, `w8/drawer`), each cure author →
non-author verifier → repair. Sources of record: each `cures/<id>/` directory (author record,
`verify-r*/`, `fix-r*/`), `charters/README.md` (M09, the REFUSED and REFUTED lists, the
acceptance), `attribution/ATTRIBUTION.md` (§2's born-RED budgets B1–B6). Every number below is
one of those files' and names engine · CPU · link · cache · viewport · dpr. **Every number is a
PROXY** (Playwright chromium under CDP throttle, or Playwright WebKit with no CDP, no rate, no
link, no `longtask`); no WebKit number is a Safari number; nothing here is an iOS claim; the
device closes each budget through 8.3 (M19).

**Master has not drifted on any W8 path**: `git diff --name-only 7b0610cc master` over
`web/frontend/src/pencil`, `src/App.vue`, `src/main.ts`, `vite.config.ts`, `perf-rig/`,
`scripts/check-pw-projects.mjs`, `src/games/shared/useFlipGlide.ts`, `src/games/sudoku/` is
empty—the W7 fold touched `games/shared/{BoardHost,DigitCell,GameBoard,GameControlPanel}`, the
copy gate and two e2e specs, none of which W8 opens. So every conflict named below is between
TRACKS, not against master.

**The dry run.** Every pick in §1 was cherry-picked, in the order given, onto a detached scratch
worktree at `74a2b5d9` (`.claude/worktrees/w8-foldcheck`, removed after; no branch touched,
nothing built, no `npm install`). Ten picks applied clean; the two that did not are in §3 with
the conflict hunk named.

---

## 1. THE FOLD ORDER (oldest first; one cherry-pick per row, in this order)

| # | cure | branch | sha | files (from `git show --stat`) | verdict chain | conflicts |
|---|---|---|---|---|---|---|
| 1 | **8.3** instrument | `w8/probe` | `9ddc0026` | `e2e/device-probe.spec.ts` (+163), `perf-rig/README.md` (+30), `perf-rig/ci-subset.mjs` (+283/−61), `src/main.ts` (+12), `src/probe/deviceMarks.ts` (+155), `src/probe/deviceMarks.test.ts` (+144), `src/probe/devicePaint.ts` (+810) | r1 REPAIR (1 blocking + 3) | none |
| 2 | 8.3 repair r1 | `w8/probe` | `80d61906` | `e2e/device-probe.spec.ts` (+25/−3), `scripts/check-pw-projects.mjs` (+1: SPEC_MANIFEST) | r2 ACCEPT · re-verify after restart ACCEPT | none |
|   | **→ tag `t9-w8-baseline` HERE.** HEAD + the probe and nothing else: the build the owner's first device reading is taken on (the RED). | | | | | |
| 3 | **C01** one bake round | `w8/bake` | `c98e809d` | `src/pencil/grid/HandDrawnGrid/HandDrawnGrid.vue` (+17/−1) | r1 REPAIR | none |
| 4 | C01 fix r1 | `w8/bake` | `67545682` | `DarkModeToggle.vue` (+12), `HandwrittenLogo.vue` (+7), `composables/rasterPose.ts` (+66), `HandDrawnGrid.vue` (+5/−1) | r2 REPAIR | none |
| 5 | C01 fix r2 | `w8/bake` | `854b562b` | `HandwrittenLogo.vue` (+80/−2: `warmBakeFace`), `rasterPose.ts` (+27/−15) | r3 **ACCEPT** | none; the base of every later bake pick |
| 6 | **C06** exit mover's ownership | `w8/app` | `0bf9cb0e` | `src/App.vue` (+11/−1), `src/games/shared/useFlipGlide.ts` (+10) | r1 ACCEPT (2026-09-17) · second r1 pass ACCEPT (2026-09-18, two clauses NOT CLOSABLE at load) | none; C10's `App.vue` hunks apply on top (tested) |
| 7 | **C10** slow-link bytes | `w8/app` | `83ee20b6` | `src/App.vue` (+39/−1), `games/sudoku/composables/useSudoku.ts` (+9/−1), `games/sudoku/data/templates.ts` (−21), `games/sudoku/data/tiers.ts` (new, +23), `vite.config.ts` (+91/−22) | r1 REPAIR | `vite.config.ts` shared with C07a—tested BOTH orders, both clean |
| 8 | C10 fix r1 | `w8/app` | `db43df48` | `src/App.vue` (+53/−9: `scheduleWarmGallery`) | r2 ACCEPT · r3 **ACCEPT** (5 rows, none blocking) | none |
| 9 | **C07a** preview fidelity | `w8/wasm` | `63331bfc` | `vite.config.ts` (+16: `preview: { cors: false }`) | r1 ACCEPT scoped · round 1b ACCEPT scoped—**C07 stays OPEN, B6 not GREEN** | none (see row 7) |
| 10 | **C07b** the face after first paint | `w8/bake` | `e694cc8c` | `HandwrittenLogo.vue` (+51/−1: `afterFirstPaint()`) | r1 **ACCEPT** (two prose corrections, Accept 1 of 3 clauses) | none WITHOUT C02 (tested on the chain above; its hunk is `loadBakeFace` @@ −114, outside C02's lines) |

Ten picks, six cures. What the folded tree is, in one line: the probe at the boot seam; one bake
round per surface with the wordmark waiting for its face to PAINT; the exit's board mover
surviving to its own 520 ms; the deck and the tier table out of the render-blocking chunk with
a two-condition warm; the preview server no longer sending `Vary: Origin`; the wordmark's face
acquired after `fonts.ready` + one idle slot.

### 1.1 Per-cure numbers (base → cured · regime · verifier-reproduced)

**8.3** (`8.3/README.md`, `verify-r2/VERIFY.md`, the post-restart re-verify). An instrument is
graded on what it does NOT move.

| mark | regime | base → cured | reproduced |
|---|---|---|---|
| resourceCount, no flag | chromium · 4× · unthrottled · cold (CDP) · 390×844 · dpr 3 · 5+5 | 29 → 29 (5/5 both arms) | four independent readings agree |
| transferBytes, no flag | same | 212,064 → 212,124 B (+60 B, the 141 B guard gzipped) | to the byte, four readings |
| with `?__probe=1` | same | 29 req / 212,064 B → 30 / 217,563 B (+5,499 B: `devicePaint-DYfALhM0r-4G.js`, 13,835 B) | identical, every round |
| boardReadyMs / firstBoilTickMs / tbt3000Ms / rafGapProxyTbtMs, no flag | same | every delta inside spread; boardReady sign flips −16.5 / +6.0 / +8.4 / +14.6 across four readings | no timing claim made, none exists |
| `npm run test:e2e:projects` | node gate | exit 1 (`device-probe.spec.ts: on disk, NOT in SPEC_MANIFEST`) → 0 | verifier watched it go 1 → 0 |
| GATE D amendment 1 | chromium · 4× · cold · desk 1440×900 dpr 1 vs 390×844 dpr 3 | desk 247–296 ms PASS vs mobile 987–2,040 ms PROVISIONAL (3.9×–6.9× across four banked runs; 1.81× on a host at load 77–216) | the pose gap reproduces; the RATIO does not—quote the gap, not "4.0×" |
| GATE D amendments 2, 3 | `--canary-anchor 900` / `--canary-fail chromium` | blown window dropped BY NAME (253 ms over 2, not 246 over 3); 0 graded boot rows → 2 under an instrument failure, exit still 3 | confirmed at source and by run |

**C01** (`C01/verify-r3/README.md`, the accepting round; author `fix-r2/README.md`).

| mark | regime | base → cured | note |
|---|---|---|---|
| PNG encodes, cold | chromium · 4× · Fast-3G · cold · 1280×800 · dpr 2 · 5+5 | 28 → 16 | charter ceiling ≤ 20 met |
| discarded round's blocking (row 2) | same | 1,179.5 → 0.0 ms (author 1,599.8 → 0; charter 992.8) | absolute is host load; the shape is identical |
| whole encode bill / TBT / last encode | same | 2,454 → 1,227 · 1,851 → 965 · 4,548 → 3,052 ms | all outside both spreads |
| board-ready, chromium | same | 1,448.5 → 1,464.9 (+16.4, INSIDE) | correctly withheld: no bake precedes it |
| rounds per surface | same | grid 8 · sun 8 · moon 8 · logo 4 → 4 · 4 · 4 · 4, 5/5, boxes 1272 unchanged | categorical |
| mobile dpr 3 | chromium · 4× · Fast-3G · cold · 390×844 · dpr 3 · 3+3 | encodes 28 → 16 · discarded 714.5 → 0 · bill 1,514.7 → 858.5 · TBT 1,159 → 767 | all disjoint; board-ready +24.9 inside |
| board-ready, WebKit | webkit · no CDP · cold · desk dpr 2 · 5+5 | 444 → 290 ms (author's pooled 10+10: 854.5 → 421.5) | disjoint |
| encodes / discarded / bill, WebKit | same | 20 → 16 · 275 → 0 · 629 → 417 ms | disjoint on the verifier's quieter host; the author reported NOT A MOVE at load 54–97 (2/10 base windows ran single-round) |
| the blank wordmark round (round-2's finding) | webkit | logo PNG multiset {22243, 22252, 22095, 22205} B at 762 px in 5/5, identical to base; no 3,152 B blank anywhere | CLOSED |
| stamp − condition-true (the charter's accept row) | webkit · cold · desk dpr 2 · 5+5, `cp-probe.mjs` | 473 → 144 ms (author 562 → 169) | **NOT MET** (≤ 33 ms); −329 disjoint; the remainder is the KEPT bake holding the thread—C03's row |
| warm encodes | chromium · 4× · Fast-3G · warm · desk dpr 2 · 3+3 | 28 (16–28, bimodal) → 16 | ceiling holds; delta not claimable |
| `firstBakeMs moves and the move is printed` | A6, mobile dpr 3 | **UNDEMONSTRATED**—A6 not re-run after the repair | chair decides retire vs re-read |

π: goldens 4/4, per-pose SHA-256 identical in chromium 4×, chromium 1× (the π trap, where the
base grid's two rounds are NOT byte-identical—the cure keeps the SECOND round's moment) and
WebKit; `filterBudget` 9; pose count 4; library stock 0.12.0 (`dist/vue.js` md5
`e4527557bd917949724aeca81b06ae46`, `fontGateOpen` absent).

**C06** (`C06/README.md`; `verify-r1/README.md`; `verify-r1/README-rerun-2026-09-18.md`).

| mark | regime | base → cured |
|---|---|---|
| exit `boardTravel` | chromium · 1× · warm · 1280×800 dpr 2 · 6/6 | NO TRAVEL span 0 px distinct 1 → GLIDE span 295.8–296.7 px, distinct 35–45 |
| | chromium · 4× · desk dpr 2 | 0 → 296.2–296.3 px |
| | chromium · 1× / 4× · 390×844 touch · dpr 3 | 0 → 78.0–78.2 px |
| | webkit · desk dpr 2 / mobile dpr 3 (PROXY) | 0 → 218.3–264.2 / 64.1–73.4 px |
| mover lifetime (`mover-census.mjs`) | chromium and webkit, warm | `FINISH:board-peek-host` 0.3–1.4 ms after birth → no FINISH; CANCEL at 518–531 ms (its own clock); `/520ms` on both arms; SWEEP ×4 both arms |
| step share vs the entry (control) | chromium 1× desk / mobile | 0.071 vs 0.072 · 0.071 vs 0.075 (inside the charter's band); WebKit 0.185 / 0.146 on quiet hosts, COARSER by 0.19 / 0.09 at load 100–170 (NOT CLOSABLE there) |
| exit worst frame | chromium · 4× · warm · desk dpr 2 | 66.5 → 60.2 (author), +1.5 (r1), +27 vs a +29 untouched-control drift (rerun): bracketed at zero, no gain claimed |
| T8-M7b guard | settled / in-wave | 0 runs, `armedAfter` 0, 24/24 · in-wave 67 vs 66 (Δ −1, ±1) · rerun 71 → 71 |
| animation census, exit | | 5 → 6 alive at 82–216 ms, 2 → 3 at 300–451 ms: exactly one more live animation, the board |

The transition DRAWS MORE (520 ms of board travel that never rendered). Exit grammar still
UNDEFINED—W7 §13's (intake addendum §2).

**C10** (`C10/verify-r3/VERIFY.md` accepting; `fix-r1/README.md`).

| mark | regime | base → cured |
|---|---|---|
| boot freight before board-ready | chromium · 4× · Fast-3G · cold · 1280×800 · dpr 1 · 5+5 | 177,129 B / 10 req → 164,023 / 10 (livegen roll) · 168,647 / 11 (HARD roll): **−8,174 B always** (the split, to the byte), plus the bank's 4,624–4,932 B on the two thirds of deals that roll livegen when board-ready is late enough for the bank to have landed |
| | chromium · 4× · unthrottled · cold · dpr 1 | 183,227 / 11 → 170,121 / 11 · 174,745 / 12 |
| | webkit · cold · dpr 1 (PROXY) | 210,281 / 15–16 → 197,173 / 16 · 201,813 / 17 (−13,108 median) |
| static boot graph | off disk | 405,927 raw / 113,542 br / 130,511 gz → 375,246 / 106,860 / 122,354 |
| render-blocking CSS | | 93,735 → 82,734 B raw with 1,069/1,069 braces and 1,622 semicolons IDENTICAL—**0 rules dropped**; 11,002 B moved to `GameGallery-*.css` |
| bank before ready (row 11) | 15 windows | 15/15 → 6/15 (never 0: 9×9 HARD is declared `bank`) |
| `GameGallery` chunk before ready | 15 windows | 0/15 (the fix's own risk, refuted) |
| deck chunk fetched, no intent | chromium · 4× · Fast-3G · cold · dpr 1 | start board-ready +800 → +86…+280 ms; in hand +1,550 → +290…+503 ms (a load band, not a constant) |
| **first open pressed AT board-ready (a COST, booked)** | same, 3+3 / 5+5 | +297.9 ms (author, load 12–18) · **+1,009.9 ms** (verifier r3, load 46): write it as a band ~300–1,000 ms; level at a 400 ms delay |
| board-ready | all three regimes | inside spread (+12.1 unthrottled; −35 Fast-3G; +22 WebKit)—**no readiness claim** |
| A7 first fold after the split | chromium · 4× · warm · dpr 2 | entry cycle 0 worst 117.5 → 108.7, long33 2/2, bakes 8/8/8: no long frame attributable to chunk evaluation |

**C07a** (`C07a/README.md`; `verify-r1/README-round1b.md`). Not the chartered cure—the preview
server's fidelity, plus a refutation.

| mark | regime | base → cured |
|---|---|---|
| woff2 GETs cold, WebKit, `vite preview` | webkit · no CDP · cold · 1280×800 · dpr 1 · 5+5 | 7 (2/3/2) → 4 (1/2/1), deterministic; chromium 4 → 4 (median) |
| the live edge | curl, 2026-09-18 | already 4: `access-control-allow-origin: *`, immutable, NO `Vary`—the defect was never in the product |
| ATTRIBUTION row 6's 79.0 ms | webkit, `--nullroute` control vs server-side strip | a `page.route` intercepting nothing biases WebKit board-ready −489 ms; with no route in either arm the hints are worth −2.0 ms inside a 585–937 spread: **REFUTED, instrument artifact** |
| the REFUTED engine-blind strip | chromium · 4× · cold · dpr 1 | +316.1 ms (re-refuted; the hints stay) |
| dist | | byte-identical to dist-base, 43 files, two recipes (`f705bd9e…`, `913ec5a8…`) |

**C07b** (`C07b/README.md`; `verify-r1/README.md`).

| mark | regime | base → cured |
|---|---|---|
| TBT (Σ longtask − 50) | chromium · 4× · Fast-3G · true first visit · 1280×800 · dpr 1 · 12+12 | 155.5 → 136.0 ms, cured lower in **12 of 12 interleaved pairs** (author: 151.5 → 134.0, 10/10)—say PAIRED, not disjoint: ranges overlap |
| woff2 GETs / bytes before ready | same | 4 → 3 · 23,772 → 23,472 B, 12/12 |
| woff2 wire bytes before ready, cache disabled | chromium · 4× · unthrottled · dpr 1 · 5+5 // webkit · cold · dpr 1 · 5+5 | 38,408 → 23,472 B // 61,880 → 46,944 B (−14,936 B both) |
| board-ready | chromium // webkit | −20.8 / +6.0 ms, NOT MOVES |
| the cost | webkit | first logo encode t0 182–221 → 521–577 ms (+~340): bitmaps-instead-of-live-filter, the live filter painting the page's own Fraunces, FOUT window unmoved (172–186 ms both arms) |
| the charter's Accept | | **1 of 3 clauses**: "≤ 1 per subset in both engines" NOT met (fraunces 2 on WebKit—destination-keyed cache, nine fetch shapes × two timings all read a full 14,936 B) and "WebKit board-ready −79 ms" NOT met (the 79 is C07a's artifact) |

π both engines, per-pose digests equal (chromium `151a026e 1d265c29 165aa06c 0c04acf5` … /
webkit `03a52c87 …`), encode counts equal, `test:font-coverage` 0. **Caveat for the battery**:
C07b's gates ran in a `w8-bake` worktree whose `node_modules` is a real directory carrying the
local 0.12.1 pack and whose tree carries C02 beneath it (§3.6); the fold is the first time this
hunk is typechecked on a stock-0.12.0, no-C02 tree. It applied clean; the chair's battery says
whether it builds.

---

## 2. THE NUMBERS TABLE — B1–B6 after the fold (proxies; the device sets the RED)

| id | budget | proxy RED at `7b0610cc` (ATTRIBUTION §2) | what moved, and by which cure in the fold | what still stands RED |
|---|---|---|---|---|
| **B1** | first-load readiness (`boardDrawnMs`) | 3,317 mobile dpr 3 Fast-3G cold · 2,813 unthrottled · desk dpr 1 2,698 / 2,067; 6× Fast-3G mobile never fires inside 3.6 s | **C01**: the discarded round is gone—chromium 4× Fast-3G cold desk dpr 2 encodes 28 → 16, discarded 1,179.5 → 0, TBT 1,851 → 965, last encode 4,548 → 3,052; mobile dpr 3 TBT 1,159 → 767; WebKit board-ready 444 → 290. **C07b**: boot TBT 155.5 → 136.0 paired 12/12 (desk dpr 1). **C10**: −8,174 B of boot freight (slow-link only; board-ready unmoved). **8.3**: +60 B, nothing else | `boardDrawnMs` ITSELF was not re-read on any accepted cure after its repair (C01's A6 row UNDEMONSTRATED; C11 read it warm but is held, §3.6); the kept bake still holds the thread (C01's stamp−condition 144 ms vs ≤ 33; C03 sank); B1's cold number is the device's and unread |
| **B2** | first dark-toggle latency | N1 − median(N2..N4) **1,103.5** desk dpr 2 · blocking 436 mobile dpr 3 · N1 bakes **8** | **nothing in the fold**. C02 (the only cure on this row) is NOT LANDED (§3.1); its mark reproduced −1,108.1 / 8 → 0 on a 0.12.1 tree, GATE A red | RED in full; the probe reads `firstToggleBakes: 8` on the folded tree by construction |
| **B3** | drawer open/close frame-time | NOT RED at 4× (dpr 1); RED only at 6× first gesture (49.5–59, long33 1) | **nothing in the fold**. C08 not landed (§3.4). Its first act closes ATTRIBUTION gap 15: at **dpr 3** chromium 4× first-gesture open worst 34.8 ms, long33 1, `maxConsec` 0–2; 6× 58.4; steady long33 0 in 20/20; the extra cost is RECALC (+9.3 of +15 ms), raster +1.6—G4's raster premise REFUTED at dpr 3 | M02 ("not smooth") has no proxy that reproduces it at dpr 1 or dpr 3; if the device reads clean frames too it is W7 §13's (the tongue's berth swap) |
| **B4** | gallery in/out | entry worst 57.7 (long33 1) · exit 42.5–68 · exit travel **0 px 3/3 every engine** · bakes 4 per fold, 8 first | **C06**: exit travel 0 → 296 px desk / 78 mobile chromium, 218–264 / 64–73 WebKit, 36/36; the mover reaches its own 520 ms; +1 live animation. **C10**: first fold after the split shows no chunk-evaluation frame (bakes 8/8/8, long33 2/2). C05's attribution stands as a FINDING (the "4 bakes per fold" are the CH-62 `posePaints` 24 px probe draws, 1.2–3.0 ms; the first entry's 4 real encodes are a legitimate re-key at 310–350 ms) but C05 is held (§3.5) | entry worst 57.7 (G2's steady frame) unmoved—C05 leaves it inside spread even where it lands; exit worst frame bracketed at zero; the exit's grammar undefined (W7) |
| **B5** | time-to-givens | **3,048** desk dpr 1 Fast-3G (gap 1,714); warm 485 | **nothing**. C04 not landed: 3,051.9 → 3,052.5 (+0.6), gap −15.2 inside a ≥ 100 ms spread; the duplicate GET costs **127 B**, Chromium joins the second in-flight (§3.3). C10's −8,174 B and C01's earlier thread release are the only things touching the flight's START (~2,100 ms, behind the bake burst) | 3,048 stands; row 5's "593 removable" is an artifact of `cache: "no-store"` and is struck (§6) |
| **B6** | woff2 request census | WebKit **7** GETs (2/2/3), chromium 4 (1/1/2); gate ≤ 1 per subset, fraunces ≤ 2 until C07's bake half | **C07a**: the 7 was `vite preview`'s `Vary: Origin`; the edge reads 4 already. **C07b**: the bake's fetch leaves the boot window (4 → 3 GETs before ready; chromium never reaches the server for it; WebKit still pays a full 14,936 B, later) | the gate line must be RESTATED: ≤ 1 per subset, **fraunces ≤ 2 on WebKit, 1 on chromium**, against an edge-faithful server—met on the proxy; whether real Safari hands the `fetch` the font entry is the device's |

Reading rule carried from ATTRIBUTION: rows 1, 2 and 4 share one window and are not summed;
C01 may not be credited with row 1's leg 2 nor with the stamp−condition row.

---

## 3. NOT LANDED — each with the numbers that say why

### 3.1 C02 — pre-warm the other theme's stacks at idle (`w8/bake`; verifier r1/r2/r3 all REPAIR; `C02/NOT-LANDED.md`)

The mechanism is the charter's and the mark moves hugely: chromium · 4× · Fast-3G · cold · desk
dpr 2 deltaMs **1,132.8 → 24.7** (verifier r3, 5+5), **N1 bakes 8 → 0 in 5/5**, whirl 2 → 95
frames; mobile dpr 3 854.1 → 20.9; WebKit 296 → 37 (author). It does not land on this link for
three reasons, none of them the code's:

1. **GATE A reds on the cured arm and not the base.** `perf-rig/ci-subset.mjs` unmodified,
   unthrottled, desk 1440×900 dpr 1: WebKit median long33 **1 / 1** (window worsts 35–37 ms) vs
   **0 / 0** base (18–33 ms)—FAIL, FAIL vs PASS, PASS, exits 1,1 vs 0,0 (r3); the author's own
   three runs read 0 / 1 / 5. The warm's one-pose encodes fall inside the rig's idle census
   `[boardReady+1450, boardReady+4470]`, and A5's tap lands at boardReady + 3.8 s, 650 ms before
   that census closes: there is no third placement, and slicing a pose under 33.4 ms is on the
   REFUSED list. **The ruling is the chair's**: amend the census to admit a bounded one-time warm,
   take the trade in writing (one to five 31–39 ms frames, once, on a page nobody is touching,
   against 833–1,113 ms off the first flip), or close this family—C02, C11's persistence and any
   idle memoization fall together.
2. **The lockfile cannot supply the library the arm was built from.** `package.json:71` asks
   `^0.12.0`, the lock resolves the published 0.12.0 (sha512 `gU4fYELJ…`), which has no
   `prewarm`; the measured arm was built against a local 0.12.1 pack. Round 3's `prewarmerOf`
   guard turns that into a silent no-op—"a cure whose number does not move".
3. **TBT(3000) at mobile dpr 3 is the one budget row it worsens**: 550.5 → 662 ms, DISJOINT
   +111.5 (three builds: +97, +90, +111.5)—238 ms of idle encode inside a census fixed to
   navigationStart. Repair round 1 (`5fba8e3b`, the boot-census wait) put it back inside the
   base spread (550 → 572, overlapping). Also: chromium 6× · Fast-3G · desk N1 bakes 8 → 9,
   +279 ms disjoint (one in-flight pose at a rate where the boot round outlasts the tap).

Branch state, for the chair (§6): `w8/bake` was reset to `aa2573a6`, which KEEPS C02's three
commits (`84a4ad45`, `5fba8e3b`, `aa2573a6`) beneath C05, C07b and C11. They cherry-pick clean
onto C01 (tested) and must not be picked.

### 3.2 C03 — schedule the kept bake (`w8/bake`; no commit; `C03/README.md`)

Built as a boot-bake lane queue (V2: wordmark + shown celestial · board · hidden celestial at
idle), measured in five regimes, committed as `3785819e` with π holding and every gate green,
then `git reset --hard 854b562b`. Wins: chromium · 4× · unthrottled · cold · 390×844 · dpr 3
leg 2 **896 → 532 ms**, firstBake 2,025 → 1,584, the draw-in's blocking 665 → 353 (all disjoint,
5+5); 6× unthrottled boardDrawn 2,714 → 2,112; 4× Fast-3G the wordmark's and shown celestial's
stacks −908 / −859 ms. The loss: **chromium · 6× · Fast-3G · cold · mobile dpr 3 firstBake
3,425.6 → 4,035.6 (+610) and boardDrawn 3,471 → 4,218 (+747), outside both spreads, twice
confirmed**—the charter's own must-not ("show an unbaked surface longer than today") in a regime
the charter names. The discriminator is the LINK, not the CPU. Four lane maps measured; deferring
the off-screen celestial alone moves nothing (−4 ms); board-first recovers nothing (−50). Chair
options: rule 6× · Fast-3G an out-of-scope pessimum and re-apply V2 from the evidence dir (one
commit), or re-open C03 AFTER C04 and re-read the 6× Fast-3G cell first (the lead is the wasm
window). Non-author re-run owed if re-opened.

### 3.3 C04 — single-flight the wasm (`w8/wasm`; no commit; `C04/README.md`, `C04-not-landed.patch` 28,061 B)

Mechanism confirmed (2 wasm GETs → 1, 13/13 windows, both engines) and its PRICE refuted:
chromium · 4× · Fast-3G · true first visit · 1280×800 · dpr 1, 10+10: `tGivens − tCells`
1,712.0 → 1,696.8 (−15.2), `tGivens` 3,051.9 → 3,052.5 (+0.6), inside a ~100 ms clean spread;
1× Fast-3G −8.2; WebKit +17.0; warm +5.3. The refuter priced the duplicate with
`cache: "no-store"` (744.6 vs 1,338.0 ms); the page does not use it, Chromium joins the second
GET to the first in flight, and the wire cost is **127 B** of headers plus one worker compile.
Sound, green (66 files / 814 tests), +406 B—re-land only under a bytes-and-connections charter.
The device may disagree: Safari's cache may not join; 8.3's request census settles it.

### 3.4 C08 — the drawer's first gesture and its onset/settle restyle (`w8/drawer`; no commit; `C08/README.md`)

Part B, measured: deferring the two `inert` writes out of the settle frame SPLITS one coalesced
style pass into two—chromium · 390×844 · dpr 3 · 4× · cold, n = 10 steady per arm, settle-window
restyled elements 826.5 → **994**, recalc 7.24 → **10.97 ms** (+168 elements, +3.7 ms, the wrong
way); close worst 10.35 vs 10.30, long33 0 both. Part A (pre-raster the sheet), on the charter's
own gate: NO burst at 4× dpr 3 (first-gesture worst 34.8, `maxConsec` median 1) and the premise
fails—raster carries +1.6 of the first gesture's +15 ms, recalc +9.3. No `w8/drawer-partA` was
written. Standing result: ATTRIBUTION gap 15 closed; G5 confirmed at dpr 3 to the node (`inert`
restyles 601 of 991 elements while the grid holds 415—unnarrowable in author CSS).

### 3.5 C05 — the wordmark's stack survives the view flip (`w8/bake`; `c003c1d0` + `da33cb8e` + `66e34b23`; verifier r1 and r2 both REPAIR "the cure stands; the record does not"; no r3 on disk)

**Held at this fold because it is C02's.** The cure is one reschedule inside C02's
`usePosePrewarm` (`GESTURE_QUIET_MS = chromeLeaveMs + boardFoldMs + cardStepMs` = 1,160 ms),
and what it moves is a C02-INDUCED frame: on the C02 tree the first fold's window carries a
>150 ms task in **38 of 38 base windows** (a 1,272² grid pose from C02's idle warm, released at
`BOOT_CENSUS_MS` 3,000 ms, exactly where a fold lands) and 0 of 38 cured; fps 80.9 → 108.2
(pooled n = 32, five batteries, three authors). On the folded tree there is no idle warm, so
that task does not exist and the number has nothing to move. Dry cherry-pick without C02:
**CONFLICT in `rasterPose.ts`** (the hunks sit in code C02 adds). Its Accept clauses as
chartered: clause 1 (bakes per fold 0) NOT REACHED—4 logo encodes on the first entry, a
legitimate re-key (`--logo-scale: 0.72` takes the box 382.4×111.9 → 275.4×80.6); clause 2 (worst
frame within p95) NOT REACHED—cured cycle-0 entry worst 87.5 ms; clause 3 (a label change still
bakes 4) REACHED, 9/9 both arms. G2's steady-state 57.7 ms is left inside spread. **What
survives as attribution and goes to W7 (intake addendum)**: A7's "4 bakes per direction, every
fold" counted the CH-62 `posePaints` 24 px probe `drawImage`s (1.2–3.0 ms), not encodes. Rides
with C02 if C02 re-opens; otherwise the pre-warm-the-gallery-identity design (`RECORD.md` §7)
is the cure and its number does not move here either.

### 3.6 C11 — persist the baked stacks across loads (`w8/bake`; `7c6c5bea`; verifier r1 **ACCEPT**; spike `47d7dd60` on `w8/bake-c11-spike`)

Accepted on its own track and **held at this fold because it does not apply, and would not
typecheck, without C02 + pencil-boil 0.12.1**:

- Dry cherry-pick onto the chain (after C07b) and directly onto C01: **CONFLICT in
  `HandDrawnGrid.vue`**—the `gridRaster = useRasterStack(...)` call it swaps sits below
  `gridPoseSvg`/`gridDpr`/`gridCacheKey` as C02 rewrote them (`84a4ad45`, +81 lines there);
  `DarkModeToggle.vue` and the new `bakeStore.ts` stage clean.
- `bakeStore.ts:492-502` returns an object typed `RasterStackHandle` carrying a `prewarm`
  member that calls `handle.prewarm(alt, beforePose)`. Stock 0.12.0's
  `dist/vue.d.ts:74-86` `RasterStackHandle` has `urls`, `ready`, `pose`, `rebake` and no
  `prewarm`; 0.12.1's `:120` adds it. On master's `node_modules` (0.12.0) that is an excess
  property and a missing member—`typecheck` REDs. `w8-bake`'s `node_modules` is a real
  directory carrying the local 0.12.1 pack (main's stays 0.12.0), which is why every gate on
  that track after C02 was green.
- Its numbers were taken with C02's eight idle warm encodes in BOTH arms: warm 24 → 12 encodes
  (`sun 4 · moon 4 · logo 8 · grid 8` → `logo 8 · grid 4`), `toBlob` bill 3,704.9 → 320.8 ms
  (verifier; author 10,057.9 → 1,030.9—host-hour figures, ratio 9.8–11.5×), warm boardDrawn
  **1,296.6 → 923.3**, warm TBT(3000) **485 → 62**, WebKit rAF-gap proxy 80 → 13 (chromium ·
  4× · unthrottled · warm · 390×844 · dpr 3; webkit no CDP); cold unmoved (every mark inside
  spread). Without C02 the base warm load is 16 encodes and the cured 4 (the unstored wordmark):
  the mechanism is independent, the figures are not, and no one has read them on that tree.
- Route: (i) lands with C02 + 0.12.1 (order §5) as the seventh bake pick, or (ii) the author
  rewrites it against 0.12.0 (drop the `prewarm` passthrough; re-base the `HandDrawnGrid.vue`
  hunk) and a non-author re-verifies on the folded tree. Either way F1 (`bakeStore.ts:20` says
  "4 of 24" where the census counts logo 8), F3 (key the write on the identity the library
  baked under, not the identity current when the set lands) and F4 (`rebake()`'s unrevoked
  handles on the rejected-restore path) are owed with it. F5 stands as a condition: the second
  visit pays off only if the first stayed open long enough for the idle write to land.

### 3.7 C07 as chartered; C09

C07's Accept ("≤ 1 per subset in BOTH engines … WebKit board-ready −79 ms") is met in neither
clause and both are refuted with mechanisms (C07a, C07b); B6's gate line is restated in §2.
C09 is owner config (§7), not a code cure, and nothing was measured against it in 8.2.

---

## 4. HELD FOR THE DEVICE — what waits on the owner's 8.3 reading, and what it must show

1. **Every B1–B6 RED.** No device number exists. The first line the owner pastes from
   `t9-w8-baseline` IS the RED; the second deploy's line is the cure. Nothing in `cures/` is an
   iOS claim.
2. **`probeArmedMs` on the first line**: 80–122 ms in a laptop browser; the two document-wide
   MutationObservers are unpriced on a phone. Much higher, and every other number on the line
   needs a second look before it is quoted.
3. **B1 on the phone, cold and warm, with the window ≥ 8 s** (6× Fast-3G never fired inside
   3.6 s on the proxy). What it must show against the baseline: the discarded round gone (C01)
   reads as fewer, earlier encodes and a lower blocking figure—`rafGapProxyTbtMs` is Safari's
   only blocking figure (`ltSupported: false`, `tbt3000Ms` NOT MEASURED); C07b's TBT move is a
   chromium `longtask` number with no WebKit twin.
4. **C01's `warmBakeFace` budget**: 12 tries × 16 ms sized from desktop WebKit (the face painted
   in an image document 46–85 ms after the bytes landed). If a slow link exhausts it the bake
   proceeds as HEAD does today; the reading should record how many tries were spent.
5. **B2**: `firstToggleBakes` reads 8 on the folded tree by construction; the device's N1 −
   median(N2..N4) is the shape B2 is SET from (≤ 150 ms proposed) and is what C02 would be
   re-opened against.
6. **B3**: whether M02 ("not smooth") reproduces as frames at all. Both dpr-1 and dpr-3 proxies
   read clean steady state. If the device agrees, M02 is W7 §13's whole.
7. **B4**: whether C06's 520 ms of board travel reads as the exit gliding; the WebKit step-share
   sub-clause (exit coarser than entry at load 100–170) closes on the device or a quiet host;
   whether the exit's worst frame is worse for drawing more (three proxies bracket zero).
8. **B5**: the request census alone (`getEntriesByType('resource')`, timing-free) says whether
   Safari's cache joins the second wasm GET as Chromium does. If not, C04's patch is re-chartered
   as bytes.
9. **B6**: 4 woff2 GETs expected (three preloads consumed + the bake's fetch); whether Safari,
   like Playwright WebKit, refuses to hand the `fetch` the font entry (fraunces 2) or reads 1.
   And the owner's eye on the wordmark: C07b mounts its bitmaps ~330 ms later on WebKit.
10. **C10's first-open cost** (~300–1,000 ms when the picker is pressed inside ~0.3 s of
    board-ready) on a cellular link.
11. **Low Power Mode and thermal state**: invisible to the page; banked as the owner's assertion
    (the checkbox), never a measurement. Cold vs warm likewise (Private tab vs reload).

---

## 5. THE LIBRARY RELEASE

**None is consumed by the fold order.** C01 is committed against stock 0.12.0 (`dist/vue.js`
md5 `e4527557bd917949724aeca81b06ae46`; the round-1 library twin `3db66cf` is reverted by
`93075fd`); C06, C07a, C07b, C10 and 8.3 do not open the library.

**Pending, consumed only if the chair re-opens C02 (and with it C05 and C11)**:

| field | value |
|---|---|
| repo | `mkbabb/pencil-boil` (source at `/Users/mkbabb/Programming/pencil-boil`), worktree `.claude/worktrees/pencil-boil-t9` |
| branch | `t9-w8` on `v0.12.0` (`6c5394e`) |
| commits | `93075fd` (Revert "fix(raster): the font gate holds the first round…"—the branch is v0.12.0 exactly there, `git diff v0.12.0` empty) · `617720b` feat(raster): pre-warm the cache for a state the surface has not entered (`src/vue.ts` +127/−6, `proofs/raster-stack-cache.proof.ts` +160, `CHANGELOG.md` +41, `package.json` 0.12.0 → 0.12.1) |
| version | **0.12.1**; tarball `.claude/worktrees/pencil-boil-t9-packs/mkbabb-pencil-boil-0.12.1.tgz` (38,700 B); `npm test` 265 assertions, package boundary CLEAN, three `tsc` resolutions exit 0 (author's run) |
| API delta, additive | `RasterStackHandle.prewarm(alt: RasterStackOptions, beforePose?: (pose: number) => boolean \| Promise<boolean>) → Promise<'hit' \| 'warmed' \| 'abandoned' \| 'declined'>`, plus the cap's `protect` rule (the entry the surface is RENDERING may no longer be evicted) |
| app-side consumer | `web/frontend/package.json:71` `"@mkbabb/pencil-boil": "^0.12.0"` → `^0.12.1` and `package-lock.json:1759-1762` re-resolved from the registry with its sha512—**neither is in any track's diff** |
| order | publish 0.12.1 → bump + re-lock on master (its own commit, the symlinked `node_modules` refreshed by the owner's hand, not a lane's) → GATE A ruling (§3.1) → cherry-pick C02 `84a4ad45` `5fba8e3b` `aa2573a6` (+ a repaired r3, since `feccbb04` was refused and is not on the branch) → C05 `c003c1d0` `da33cb8e` `66e34b23` → C11 `7c6c5bea` (all tested clean in that order on C01) → non-author re-verify of each on the folded tree |

Local only: never pushed, never published, no tag. Publishing is the chair's act and is NOT
owed by this manifest.

---

## 6. CHAIR ACTS

1. **Tag `t9-w8-baseline` after pick 2** (master + 8.3, nothing else)—the build the owner's RED
   is read on. Deploy it (§7.1) before any cure.
2. **The bake track's branch and worktree hygiene.** `w8/bake` carries C02's three commits under
   C05/C07b/C11 although `C02/NOT-LANDED.md` says nothing of C02 lands; pick by sha, never by
   range. `w8-bake/web/frontend/node_modules` is a REAL directory carrying the local 0.12.1 pack
   (`@mkbabb/pencil-boil/package.json` version 0.12.1)—the symlink law was broken on that
   worktree; main's is untouched at 0.12.0. Restore the symlink or delete the worktree after the
   fold; never `npm install` on main.
3. **SPEC_MANIFEST +1 is NO LONGER OWED** (landed in `80d61906`). Drop the row.
4. **Floors restamp at WGATE**, ordinary, not a rescue: `check-pw-projects` live 241 listed /
   240 chromium / 238 webkit against floors 214 / 212 on the track's base; the folded tree's
   own counts are read at the battery (master is past the W7 fold and the tracks each counted
   from a 66 files / 810 tests base—8.3 adds 1 file / 17 rows, W7 added its own). `node
   scripts/check-unit-count.mjs --restamp <report>` and `check-pw-projects.mjs --restamp`
   (`census.stamp.json`, never by hand). README test/spec counts move with them.
5. **gates.json**: no row for the 390×844 dpr-3 boot pose, so GATE D prints PROVISIONAL by
   design; add `boot.tbt.poses.mob.maxTbtMs` stamped from n ≥ 3 RUNNER readings at WGATE, or
   leave it reporting. `ci-subset.mjs` is a LOCAL instrument (O-12); no workflow runs it.
6. **Doc-truth rows (one commit at the fold, or LEDGER rows if left)**: `perf-rig/README.md:79`
   "247 vs 987, 4.0×, exactly as ATTRIBUTION §5 predicted" is one window per pose—quote the
   pose gap qualitatively or the banked range (3.9×–6.9× on four runs; 1.81× at load 77–216);
   the 8.3 return's GATE D row cites `v-gated-poses.txt` for figures that live in
   `v-canary-fail.txt:8-9`; 8.3's "all four landed in `80d61906`" is two in the commit, two in
   the evidence tree (F3 `device/RUNSHEET.md`, F4 `8.3/playwright-scratch.config.ts`); the
   `RUNSHEET.md` location under `evidence/w8/device/` (outside `cures/<id>/`) is ratified as
   the charter's own deliverable.
7. **ATTRIBUTION is FROZEN—append an ERRATA section rather than edit**: row 5's "593
   removable" → 127 B and one compile (C04); row 6's 79.0 ms and the −77.0 font-abort arm →
   REFUTED as a one-armed `page.route` artifact (C07a), with the method note that any 8.1
   WebKit ablation that routed one arm only is suspect; row 10's cure pointer → C07a (count) /
   C07b (schedule); B6's gate line → "≤ 1 per subset, fraunces ≤ 2 on WebKit, 1 on chromium,
   against an edge-faithful server"; G2's "4 bakes per direction forever" → the CH-62
   `posePaints` probe (C05 §1); C03's correction of the charter's row-1 premise (the wordmark's
   first `poseSvg` is at 313 ms, FIRST of the four surfaces, and "one encode per task with a
   frame yielded" is already structural); gap 15 CLOSED (C08's dpr-3 re-take); `A6/
   readiness-timeline.mjs`'s `.boil-frame` selector fixed at its home (ATTRIBUTION §B1 ruled
   it; the file still carries it and every lane re-inherits it).
8. **LEDGER rows**: (a) C01's two build traps—a COMMENT-ONLY edit moves the entry hash
   (`index-Byg5dfXqjLsz.js` → `index-DOFGihfY7ZtC.js` at the same 807.4 KB), and Tailwind v4
   scans every non-ignored directory so a stray scratch `--outDir` or `node_modules` copy
   inflates the CSS 93.7 → 229.0 kB and moves the hash; (b) `masthead-alignment.spec.ts:147`
   and `:194`'s NEGATIVE-CONTROL leg reads the probe on the statement after `addStyleTag` with
   no settle and receives exactly 0 under load—proven on BOTH arms by two verifiers (C01 r3, C02
   r0): a third occurrence of the negative-control-without-settle class T9-R3 booked; (c) C01
   r3's observation: `warmBakeFace`'s 192 ms budget counts TRIES, not wall clock, and the
   `img.decode()` inside carries no timeout; `openFontGate()`'s 250 ms escape sits INSIDE the
   `fonts.ready.then`; (d) C10 r3 rows 4 and 5: `app-shared` is now the third `modulepreload`
   and `solver.worker` the fourth (a watch row if C04 is ever re-landed on the same burst); the
   `advancedChunks` test's `|export-helper/` alternative is unanchored; (e) C08: `inert`
   invalidates 601 of 991 elements from a 415-element subtree; (f) C02 r3's `QUIET_MS` residue
   and GATE A trade, carried as the open ballot; (g) `presence.spec.ts:177` and
   `multiplayer.spec.ts:265` red on both arms without the relay Worker (T9-R1 already).
9. **`charters/README.md`'s order table** said "Execute C01, C02, C04 first": C01 landed, C02
   and C04 did not—note it at the head of that file or here.
10. **After the fold, one non-author refuter over the FOLDED tree**: rebuild, print dist
    identity, re-run C01's `bake-census.mjs` (chromium 4× Fast-3G cold desk dpr 2 + mobile dpr
    3), C06's `fold-geometry.mjs`, C10's `boot-freight.mjs`, C07b's `boot-freight.mjs`, goldens,
    `playwright-throttle.config.ts` (filter census 9, pose count 4) in one battery. No cure was
    measured on a tree carrying all six; C07b in particular was never typechecked without C02.

---

## 7. THE OWNER'S ROWS — exact asks

1. **Deploy authorization #1, the baseline.** After the fold's picks 1–2 and CI green on that
   commit: `scripts/ci-conclusion.sh` → `npm run deploy -- --conclusion-file` (CH-57-gated) from
   `t9-w8-baseline`. Live production is still the T8.1 build (`index-CaFRLmgODqOS.js`) and
   carries no probe. Verify from ONE response that `sudoku.babb.dev` serves the tagged entry.
2. **The ten-minute run, on the baseline**: `docs/tranches/2026-08-tranche-9/evidence/w8/device/
   RUNSHEET.md`—Private tab, `https://sudoku.babb.dev/?__probe=1`, wait 8 s, First load, Low
   Power Mode off ticked, four toggle taps ~3 s apart, three drawer taps, picker and back, Copy;
   then reload and repeat. Two lines into `evidence/w8/device/readings.jsonl`. Check
   `probeArmedMs` on the first line (80–122 ms on a laptop). This is the RED.
3. **Deploy authorization #2, the cured build**: the fold's tip after the full battery and CI
   green; the same ten-minute run; two more lines. Every budget is graded device against device.
4. **C09, the Cloudflare zone (config, not `src/`)**: (a) a **Cache Rule** making
   `/assets/*.wasm` cache-eligible (`.wasm` is not in the default cacheable-extension list;
   today `cf-cache-status: DYNAMIC` on 5/5 GETs under the same `immutable` directive every
   other `/assets/*` file HITs on)—accept = HIT with non-zero `age` on ≥ 4/5 passes of
   `attribution/A3/edge-census.sh`, TTFB inside the 88–110 ms HIT band, `index.html` still
   revalidating so a deploy is seen at once; (b) whether to hold `/` at the PoP with
   revalidation (the lane's −120…−150 ms did not survive the refuter—≈50–70 ms is the honest
   figure); (c) **the beacon switch**: CF Web Analytics injects `beacon.min.js`, the estate's CSP
   blocks it (`requestfailed: csp`)—one console violation and dead bytes in an uncacheable
   document per load; switch Web Analytics off at the zone or leave it. The CSP is not loosened;
   `_headers`' security stanza unchanged.
5. **Two rulings only the chair or the owner can make**: the GATE A idle-census trade (§3.1)
   that decides whether C02 (and C05, C11) ever land; and whether chromium 6× · Fast-3G is an
   in-scope regime (which decides C03).

---

## 8. GAPS — honestly

1. **No device number exists.** Every table above is a proxy; B1–B6's REDs are unset until §7.2.
2. **No cure was measured on the folded tree.** Each track's base was its own HEAD-as-found
   (C10's base is C06's build; C07b's is C05's on a C02 tree). The chair's battery and §6.10's
   refuter are the first reading of all six together.
3. **C07b's gates ran with the 0.12.1 pack and C02 beneath it.** Its hunk applied clean without
   either; whether it typechecks and builds there is unread.
4. **B1's own mark (`boardDrawnMs`, cold) was not re-read after C01's repair** (A6 not re-run;
   "firstBakeMs moves" UNDEMONSTRATED). The cold B1 proxy after the fold rests on C01's encode
   census, TBT and last-encode rows, not on the mark itself.
5. **C01's WebKit encodes/discarded rows read NOT A MOVE on the author's loaded host** and
   disjoint on the verifier's quieter one; the categorical per-surface census carries the claim.
   6×, chromium WARM and WebKit mobile were not re-read after C01's last repair.
6. **C06's WebKit step-share sub-clause and exit worst frame are NOT CLOSABLE at load 100–500**;
   three passes bracket zero.
7. **C10's first-open cost is a band (~300–1,000 ms), not a number**, and its Fast-3G base
   freight is host-conditional (the bank lands before ready only when ready is late enough).
8. **The task JSON reached this synthesizer truncated** (at C03's `filesTouched`); the bake,
   wasm, app and drawer verdicts above were rebuilt from the banked files, not from the harness's
   `accepted` flags. Where the two might differ (C05 has no r3 on disk; C11 is ACCEPT on its
   track but held here), this file says why.
9. **Unit and spec floors** are stated as each track counted them (66/810 base + 8.3's 1/17);
   the folded tree's counts were not run here (no build, no `npm` in a synthesizer's session).
10. **C02's `A6/toggle-and-trace.mjs` companion (436 ms first-toggle blocking at mobile dpr 3)
    was never taken** on any arm; **toggle N1 at mobile dpr 3 remains unstable** (ATTRIBUTION gap
    9) and is not quoted.
11. **The visible-ink mark** (ATTRIBUTION gap 7) is still open: C03's ~900 ms earlier
    wordmark/celestial stacks are a stack-landing time, not an ink time.
12. **The 8.3 galleryWidths question is unadjudicated**: the probe reads 20 distinct
    `.board-cells` widths on the fold TO THE PICKER and 1 TO THE BOARD, the mirror of A7's G3
    read off the projected card; `galleryWidthsNode` is carried so a reader knows which node.
    After C06 the board travels on the exit, so the device row should read > 1 in both
    directions; if it reads 1 on the way back, the instruments watch different nodes.
13. This manifest was written 2026-09-18 against a request that asked for a 2026-09-17 date; the
    verifications it cites are dated 2026-09-18, so it carries the date it was written.

## 9. The chair's fold record (2026-09-18) — `t9/w8-fold` = master `74a2b5d9` + twelve commits

Picks landed in §1's order with their shas on the fold branch: 8.3 `7b74be16` + `41549e2b` (**tag `t9-w8-baseline` = `41549e2b`**), C01 `6b1404e3` `7e1d957a` `2248acce`, C06 `edf28f64`, C10 `6dee8d1e` `cd0f29e3`, C07a `6daee84e`, C07b `ddfc704b`; then the record commit `65a1a221` (ATTRIBUTION §7 errata, charters README note, LEDGER T9-R3 third occurrence + T9-R4/R5/R6, README e2e counts 482/29/553/35, perf-rig README one window per pose) and the gate commit `4233baa2` — the TWELFTH, unlisted by §1 because the battery found it: `check-gen-latency.mjs` read `TIER_SOURCE` from `templates.ts` where C10 moved it to `tiers.ts` as a multi-line generated literal (the gate now reads `tierRel` and block literals), and `coverage-floor.json` had no scope for `src/probe` (stamped: 9.72 / 13.71 / 11.53 / 8.65 live, floors ~10 % under; `deviceMarks.ts` unit-tested, `devicePaint.ts` browser-only by construction). Both gates were RED in `fold/logs/results.tsv` (4c, 6g) and are re-stamped there as `4c2` and `6g3`, exit 0.

**The battery** (`fold/BATTERY-logs.md`, `fold/logs/`): typecheck ×4, lint ×5, gate scripts ×12, unit **69 files / 847 tests** (floor 729), dist `index-ChSrVSqM0j8q.js` · index.html md5 `f2d904213d21aad11e51df6a81cebca7` · 47 files / 823.0 KB (base `index-CubiZsMVSwTc.js`, master's), doc-truth 42/42, ledger-diff GREEN (10 open rows), evidence-policy PASS, audit 0 high, goldens 4/4, visual-regression 24/24, full e2e 473 / 5 / 4 — the five being `presence.spec.ts:177` ×2 (T9-R1) and `multiplayer.spec.ts:241/:265` (T9-R2's class; the base arm reds `:241/:320/:177` in the same run: no red is cured-only).

**The refuter** (`fold/refute/REFUTE.md`, one non-author Opus lane over the folded tree, own ports 4256/4257, private cacheDir; its build reproduced the chair's dist BYTE FOR BYTE): C01 **CONFIRMED** (cold encodes 28 → 16 in 3/3 desk dpr 2 and mobile dpr 3, discarded 978.9 → 0.0 ms, TBT 1431 → 792 desk / 978 → 533 mobile, all disjoint; WebKit board-ready 392 → 175 disjoint), C06 **CONFIRMED** (18/18 cured exit windows GLIDE, 18/18 base do not — categorical; the WebKit sub-clause closes at load 5), C10 **ADJUSTED** (−7,524 B on this tree, not the banked −8,174 "to the byte" — the base moved at the W7 fold; braces 1,036 → 1,037 from one duplicated `.font-display` utility, zero rules dropped proved two ways), C07a **CONFIRMED** (7 → 4 WebKit font GETs, same dist through two server shapes; NOTE: because `preview.cors:false` lives in `vite.config.ts`, every preview raised from the folded tree serves BOTH arms edge-faithful — C07a's number is invisible to any A/B built from this tree), C07b **CONFIRMED** (typechecks without C02, bare; fraunces GETs 2 → 1 in 11/11 cured windows; the "+~340 ms first logo encode" cost row is not a folded-tree figure — at 1× the masthead's bake mounts 3–97 ms EARLIER cured), 8.3 **ADJUSTED** (the "29 → 29 / +60 B" headline is NOT-MEASURABLE on a tree carrying C10's split: cured reads 31 / 210,936 B; the armed cost +1 request / +5,439 B reproduces; the base arm ignores the flag 3/3). **The fold's own move, read by 8.3's instrument** (chromium 4× unthrottled cold 390×844 dpr 3, 3+3): firstBakeMs 2,519–2,577 → 1,378–1,448 (−1,141 ms, disjoint) with bakeLayers 4 → 4, LCP 2,536–2,600 → 1,396–1,464, firstBoilTick 2,685–2,814 → 1,428–1,452, tbt3000 931–941 → 524–568 — manifest gap 4 closes. π: whole-tree rect census at 1280×800 / 390×844 / 820×1180, base vs cured, **0.00 px** on every surface (rect counts move by the probe's own nodes only); goldens 4/4, throttle 67/67, the cures' e2e rows 88 passed both engines. BLOCKING: none.

**Corrections of record the refuter owes the chair, taken here** (the lanes' READMEs are frozen; this section is the correction): (1) twelve commits, above; (2) C10's byte figure is re-derived per base — −7,524 B at `74a2b5d9`; (3) C10's "identical braces" does not hold (+1, the duplicated utility); (4) C07b's 14,936 B is a transferSize and 14,636 B the encodedBodySize — both right, different things; (5) C07b's cost sentence is scoped to the regime it was taken in.

Not run by law: `npm ci`; real Safari / iOS (M19). The fold onto master waits on W7 pass 3's last prototype batch starting (the loop's worktrees are cut from HEAD); then master fast-forwards to `t9/w8-fold`, the fold commit adds `evidence/w8/cures/` + `evidence/w8/device/` + W7's intake addendum, and `t9-w8-baseline` is pushed with it. The owner's rows (§7) begin at that push.
