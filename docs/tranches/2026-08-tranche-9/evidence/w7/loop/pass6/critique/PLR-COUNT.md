# PASS-6 CRITIQUE · PLR-COUNT · the tally in the head (§11)

Adversarial. I didn't write the charter or the prototype. Work tree `.claude/worktrees/wf_f72f3b5a-83a-52`,
base and π control `74a2b5d9`. At my start and at my return the tree's temp-index diff against `74a2b5d9`
was sha1 **`5bca6d65f203`**, `cmp`-identical to the banked `pass6/prototype/PLR-COUNT/tree-at-return.diff`.
Every plant I made was restored and sha1-checked (`restored=OK` on every line).

**VERDICT: ADVANCE · convergence 87 % (pass 5: 85).**

The pass-5 rows are closed in substance. X1b now reds the landed G14 row 6/6, X2w reds it 4/4, F1's pair is one
variable (measured here, not by eye), frames 1–3 sit on one payload, `reveal` is gone, and the wrapper is
declared. What holds the number is arm (c) and one statistic. Arm (c)'s design promise, "the ink never falls
as the room grows", is false at six of ten steps past six. Its name reads `and 11 more` over a sheet that says
`and 12 more`. G14's median can't see a tail fade of 12 % in light or 35 % in dark.

## 0 · Gaps first (each closable, numbers attached)

1. **Arm (c)'s monotone promise holds at one step and fails at the rest.** The source comment (`PlayerMark.vue`,
   SIX_ARM block) says "so the ink never falls as the room grows". G16's (c) clause says "the ink per person
   never falls". The gate samples only six against five. I read ink at N = 1…16 with G16's own `inkOf` and one
   normaliser, under (c), both engines, both themes (`readings/crit-B-ink-per-N.txt`):
   - **The absolute ink FALLS at 7→8, 8→9, 10→11, 11→12, 13→14 and 15→16**, in all four series. Light chromium:
     291.37 → 288.50 → 279.60; 294.23 → 285.66 → 278.41; 299.85 → 282.41; 342.04 → 320.52 (−6.3 %). Dark and
     WebKit have the same six drops.
   - **The ink per person falls at every step from six on:** 45.8 → 41.6 → 36.1 → 31.1 → 29.4 → 26.0 → 23.2 →
     23.1 → 20.2 → 22.8 → 20.0 (light chromium; WebKit 44.7 → 19.3). At seven the clause's own bar
     (7/6 × 274.82 = 320.6) reds on 291.37.
   - The ballot says "(c) 1.332, monotone". Strike "monotone". **Closable:** strike the claim from the comment,
     the spec and the ballot, or cut G16 (c) at every N in 6…16 with a bar the arm meets. As designed, nothing
     meets it: a written remainder's digit ink doesn't grow with the count (`11` is lighter than `10`).
2. **Arm (c)'s name breaks the one-population law, not only the leader's row.** Under (c) at 16 the mark is named
   `5 players and 11 more`, and its own sheet reads `16 players` … `and 12 more`, both engines. At 9 the name is
   `5 players and 4 more` and the sheet's foot is `and 5 more`. `LOBBY_COPY.more` carries two referents in one
   head: past five strokes in the name, past four rows in the sheet. A screen-reader user hears "and 11 more",
   opens the sheet and reads "and 12 more". That's why `player-mark.spec.ts:291` reds ×2 (reproduced:
   `Expected "9 players" / Received "5 players and 4 more"`). The lane's gap 1 names the red row but not the
   collision. **Closable:** give (c) a name whose count is the state line and which still contains the written
   remainder (a new string: M16 plus the font cut), or mark (c) FAILING the one-population law on the ballot.
3. **G14's median has a blind band, and the fraction that would see it isn't bounded.** The median sits at the
   declared ink's full-coverage value (5.159 light, 6.021/6.099 dark) because more than half the glyph core is
   solid ink. A fade on the tail stays under the median. With `readings/crit-A-tail-fade.txt` (the landed
   `glyphText`, verbatim; the last f of each line's TEXT at 25 % alpha):
   - **light DPR 2:** chromium holds all three lines at f = 0.10 and `.pl-state` at 0.20. WebKit's `.pl-qual`
     reds at 0.10.
   - **dark DPR 2:** all three lines hold at f = **0.40** in both engines (medians 5.38–5.87). At 0.50,
     `.pl-more` still holds in both, and `.pl-qual` holds in WebKit.
   - **dark DPR 1:** holds at 0.30 in chromium and 0.20 in WebKit.
   - As file breaks against the LANDED row: **TAIL12** (last 12 % of each box at 25 %) is **GREEN in 5 of 6 gated
     cells**. **TAILD35** (last 35 % in dark) is **GREEN 2/2** (`readings/breaks.txt`).
   - The fraction under 4.5 moves (dark DPR 2: 0.078 → 0.435 at f = 0.4, ×5.6), but it's printed, not gated.
     LAWS P5 and v5 §2.11 say "STATED and bounded by the control's own fraction + slack". The chair made the
     bound the estate's (A.4). But this family's re-cut exists to see a fade (pass-5 gap 1), and it still can't
     see a third of a line.
   - **Closable:** gate the fraction per cell at the control-plus-slack bound once the estate stamps it. Until
     then, gate it at the shipped reading + 0.05 (light DPR 2 ≤ 0.47, dark DPR 2 ≤ 0.14), with TAIL12 and
     TAILD35 as in-run negatives.
4. **G16's floor reads six, and seven is the thinnest numeral.** Under (a), light, the ink is one 62.72 · six
   88.47 (×1.41) · **seven 74.40 (×1.19)** · nine 82.19; WebKit's seven is 73.56. The floor holds at every N in
   6…16 in both themes, but the row gates the second-weakest glyph. **Closable:** read N = 7 beside six, with the
   heading plant at seven as its negative.
5. **G16's light negative control has about 5 % of margin.** The plant reads 56.35 against one's 59.47 in my run
   and 62.45 in the lane's; pass 5 measured `one` drifting ±4.5 % with the pose index. A low draw of `one` reads
   the plant as "not lighter" and reds the row falsely (a false red, not a false green). **Closable:** park the
   pose (PRM is on, but the solo stroke's pose index still varies) or take the median of three reads of `one`.
6. **The X1b "seen" check is vacuous in the ungated cell.** In light DPR 1 the shipped median already fails (2.66–3.08),
   so `every(holds) === false` is true with or without the plant. The cell isn't gated, so nothing ships blind,
   but the row prints a "plant seen" that saw nothing. **Closable:** assert the plant moves the median below the
   shipped median by a margin, in every cell.
7. **The loop-local id sits in test source.** `player-tally.spec.ts:583`, `:586` and the annotation at `:738` cite
   `T9-R6`, which `docs/tranches/LEDGER.md` already assigns to W8's build-identity trap. Pass6/CHAIR A.4 books the
   re-point at the fold. This is a fold row, not the lane's error; it's listed so the fold finds three test-source
   sites.
8. **The leader's pass-6 substrate defects are now in this tree too** (replayed whole). They're the leader's rows,
   and COUNT carries them:
   - the one-axis `board.left <= rowsStart` proxy (768×1024 coarse: 4 rows over 3 cells);
   - the key goes stale on a resize while the sheet is open;
   - WebKit sends a touch's click with `pointerType: "mouse"`, so `onClick`'s guard keys on a value WebKit doesn't send;
   - a tap on a row sends focus to BODY and shuts the sheet.
9. **Carried and declared, unchanged:**
   - light DPR 1 fails the median itself (2.658 / 2.864 `.pl-state`; T9-R6, the estate's);
   - dark DPR 1's fraction is 0.21–0.38 against the control caption's 0.03–0.04 (T9-R6 widened);
   - B-16 is invisible in dark (the heading rung clears one stroke there);
   - `check-pw-projects` check 8 is RED (272 / 269 vs 214 / 212, control 0; the chair restamps);
   - the census exits 1 from the admitted `--tap-floor` row plus the STALE `--refuse-dur` (0 bare, net GREEN under A.1 r4);
   - room rows are dev-vs-dev (W8 §8.3); real iOS (M19);
   - `--ring-ink` is `currentColor`; the dark filter count is 11 (the chair's `crayon-heart` pick);
   - the tally seed space is 97 poses (a product fact, reported, not cured);
   - LEAVE-WHILE-PENDING can't reach a stagger-pending key from the wire.

## 1 · Servers, dist identity, payloads

| port | what | verified |
|---|---|---|
| 4242 | the work tree, dev | two-line config in `<scratchpad>/plrcount6crit/`, own cacheDir, outside the tree |
| 4236 | **my own build** of the work tree (config and outDir outside the tree, built BEFORE any scratch sat in it) | **`index-DRG60JbTV5cI.js`, 43 files**. The lane's cited identity reproduces |
| 4237 | the control dist `w7-control` | served `index-CubiZsMVSwTc.js`; never edited, built or git-touched |

Listeners 87860 / 87864 / 87890 were killed by recorded PID, and the three ports read free at return. The π
reads mint `?board=` from the control's deal (`ATMuMDMwODk2MDIw…`) and read the givens back through the
aria-label corpus: identical on all three reads in 16/16.

## 2 · What I re-ran myself (both engines)

| claim | prototype | my re-run | |
|---|---|---|---|
| `player-tally.spec.ts`, the whole file | ch 23/0/0 · wk 22 + 1 skip | **45 passed / 1 skipped (WebKit Tab) / 0 failed, exit 0** | REPRODUCES |
| `player-mark.spec.ts`, the whole file (the leader's rows on this tree) | green | **24 / 0 / 0, exit 0** | REPRODUCES |
| G14 medians, 4 cells | light DPR 2 5.159 · dark DPR 2 6.021 / 6.099 · dark DPR 1 5.21–5.74 · light DPR 1 2.66–3.08 | light DPR 2 **5.159 / 5.159–5.009** (fraction 0.363–0.45) · dark DPR 2 **6.021 / 6.099** (0.078–0.09) · dark DPR 1 **5.353–5.739 / 5.212–5.353** (0.21–0.38) · light DPR 1 **2.658–3.082 / 2.864–2.974**. Photograph 1 = photograph 2 in every cell | REPRODUCES |
| G16 (a), both themes | light 62.45 / 230.47 / 88.47 / 56.35 · dark 61.53 / 272.5 / 124.42 / 39.58 | light **59.47 / 228.27 / 88.47 / 56.35** ch, 59.43 / 228.08 / 87.57 / 55.57 wk · dark **59.8 / 270.34 / 124.42 / 39.58** ch, 62.44 / 269.06 / 120.84 / 40.29 wk | six and plant REPRODUCE; `one` drifts −5 % (gap 5) |
| arm (c) width | 72.92 / 97.06 / 97.38 / 98.61 / 97.16 / 108.66 / 106.45 | the same to 0.01 in both engines, plus 7 → 99.78, 8 → 99.27, 11 → 97.98, 12 → 100.47, 13 → 98.88 | REPRODUCES (wider table) |
| G7 2.5.3 under (c) | green ×2 | every name 6…16 is `5 players and {N−5} more` and contains the written remainder | REPRODUCES, but see gap 2 |
| LEAVE-WHILE-PENDING and L1 | L1 reds ×2 | shipped: rises 0 / 0, lands 0 / 0. **L1: RED ×2** (rises 1 / 1) | REPRODUCES |
| π WHOLE-DOM, dist vs dist | noise 0, 78 rows claimed | **my** dist vs the control: **noise 0 in 16/16**, 78 rows per reading, the DECLARED wrapper paint-neutral 16/16. The property deltas are only `corner-left`/`mobile-attribution` (rect, display), both `.hover-card`s (border 2 → 0, padding 16 → 18) and `ul.players-roster` (display, rect) | REPRODUCES |
| filterBudget, built dist | light 9/9/9, dark 11/11/11 = control | light **9/9/9** vs control 9/9, dark **11/11/11** vs 11/11, both engines, identity read in-page | REPRODUCES |
| F1 frame 3 | "read by eye, not region-diffed" | **region-diffed here:** 729 px change, all inside self's stroke (max \|d\| 265); strokes 2–5 change 0 px; outside the strokes 0 px | the one variable is PROVEN |
| Vue's `:global()` claim (pass-5 X2 unwitnessed) | printed | `compileStyle`: `:global(.dark) .pl-state{…}` → `.dark{…}`; `.dark .pl-state{…}` → `.dark .pl-state[data-v-abc]{…}` | CONFIRMED; my predecessor's X2 was blind, not the gate |

## 3 · Break tests (the pass-5 plants FIRST, then mine)

Each plant edits one product file, the LANDED row runs in both engines on dev, and the file is restored and
sha1-checked (`readings/breaks.txt`, `instruments/breaks.py`).

| plant | row | result |
|---|---|---|
| **X1b** (pass 5): mask after 1.2em to 25 % | G14, the 3 gated cells | **RED 6/6** (`.pl-state core median`) |
| **X2w** (the witnessed X2): dark quiet lines `rgb(70,68,66)` | G14 dark | **RED 4/4** |
| **TAIL12** (mine): the last 12 % of each line box at 25 % | G14, gated cells | **GREEN 5/6.** Only WebKit light DPR 2 `.pl-qual` reds (gap 3) |
| **TAILD35** (mine): the last 35 % in dark | G14 dark DPR 2 | **GREEN 2/2** (gap 3) |
| **L1**: `forget` without `stop()` | LEAVE-WHILE-PENDING | **RED 2/2** |
| **arm (c)** flipped | `player-mark.spec.ts:291` | **RED 2/2** (`"9 players"` vs `"5 players and 4 more"`) |
| **arm (c)** flipped | ink at N = 1…16 (a reading; no landed row reaches it) | six drops per series (gap 1) |

## 4 · Constraints

| constraint | reading |
|---|---|
| M16 | `check-copy-register` bare **0** (0 dashes, 0 unadmitted); `lint:copy` 0 / 0. Arm (c)'s name joins two existing lines, so no new string |
| filterBudget | 9 light on MY built dist, both engines = control; dark 11 = control (inherited). 0 filters in the mark or sheet |
| π vs `74a2b5d9` | whole-DOM, computed paint + tag + rect, with an in-run noise arm, driven shut and open: every delta is claimed (§2) |
| AA from painted bytes | light and dark at DPR 1 and 2 (§2). Median ≥ 4.5 in the gated cells; the fraction isn't bounded (gap 3); light DPR 1 fails (T9-R6) |
| @property | `check-property-block` on the tree **0**, GREEN. The tree registers nothing new |
| undefined-token census | the chair's copy: exit 1 (2 bare `--tap-floor` + 1 STALE). The lane's admitted copy: **0 bare**, 1 STALE declared, net GREEN under A.1 r4 |
| W2's landed mechanics | untouched outside the head. `ul.players-roster` display flex → block, a 1×1 sr-only box, claimed |
| decided history (r0 / R6) | r0 I3 MOVED as a PROPOSED spec (pass 5), not re-run. R6 L5 is cured by the leader's HeadSheet. The lane minted no new MOVED row |
| ballot law (§2.9) | frames 1–3: one payload, fixed ids. Frame 1's five crop is byte-identical across arms (lane). Frame 3 is proven one-variable here. Frame 2 carries the wordmark's lower edge identically in both arms (declared) |

## 5 · Checklist

| item | hit |
|---|---|
| gates that cannot fail | G14's median can't see a 12 % (light) or 35 % (dark) tail fade (gap 3). G16 (c)'s monotone clause samples one step of eleven (gap 1). The X1b "seen" check is vacuous in the ungated cell (gap 6) |
| the elegant-reduction trap | "the ink never falls as the room grows" and "ink per person never falls" are proven at six and false at every step after it (gap 1) |
| legacy alias / one copy, two meanings | `LOBBY_COPY.more` means "past five strokes" in (c)'s name and "past four rows" in the sheet: `and 11 more` over `and 12 more` (gap 2) |
| the constraint it forgot | the one-population law on arm (c) (gap 2) |
| unverified gestalt | cleared. The F1 pair is now measured. Frame 1 has the five crop identical across arms. Frames are chromium-only, with the WebKit numbers printed |
| π · filterBudget · M16 · @property · undefined tokens · W2 | clear (§4) |
| vacuous convergence · circularity · masked fallback · consumer-less substrate · the generic default | clear. `reveal` is gone. The strokes, numeral and plus are hand-drawn: no cards, eyebrows or arrows |

## 6 · Strengths

1. **The re-cut is real where pass 5 said it wasn't.** The glyph-coverage population is the right key: `n` is
   identical under every plant (808/279/880), so a fade can't leave the population, and X1b reds 6/6.
2. **The lane caught my predecessor's blind plant.** `:global(.dark) .pl-state` compiles to `.dark {}`. The pass-5 X2
   never painted, and the lane showed it with `compileStyle` and shipped the witnessed X2w, which reds 4/4.
   Confirmed here.
3. **The LEAVE-WHILE-PENDING row is a true born-RED.** It reads the dash per frame, L1 reds it in both engines, and
   the row says honestly what it can't reach (a stagger-pending key).
4. **The fork is priced per arm.** G7, G3 and G16 read `SIX_ARM` from source. (c)'s 2.5.3 is lawful under G7, its
   width table is stated (and reproduces to 0.01), and (b)'s light red is the ballot's stated price.
5. **Every identity reproduces.** The dist rebuilds to `index-DRG60JbTV5cI.js` (43 files). The tree diff is
   byte-identical to the bank. π, filters and both whole spec files match to the thousandth where they're
   deterministic.

## 7 · Convergence: 87 %

Seven of the eight pass-5 rows are closed. What holds the number:
- arm (c) makes a promise it keeps at one step of eleven;
- arm (c)'s name contradicts its own sheet;
- G14's median can't see a tail fade under the half-line;
- G16's floor and plant are thin where they sample.

Arm (c) is the owner's to keep or drop, and the fraction bound is the estate's to stamp. Neither is a missing
primitive. This isn't zero gaps, so the streak stays 0.

## 8 · Cross-pollination

- **Every monotone or "never falls" clause** (ACC-FIVE's tally, ACC-SIX's count, any `*_ARM` that writes a
  remainder): sample the WHOLE range the design names, never the one step that sees the plant. A written digit's
  ink isn't monotone in its value.
- **Every glyph-text median gate** (SELF's state line, ERASE's rung, LEDGER's TINT line, RULE's foot rule): a
  tail-fade plant (the last 12 % / 35 % of the TEXT at 25 %) is the estate's negative for the fraction clause.
  X1b (a head-kept fade) is too strong to test a median.
- **Every name composed from existing copy lines** (§11, §10's labels): a reused line keeps its old referent in the
  reader's ear. Read the composed name against every other line on the same surface.
- **The fold (A.4):** `T9-R6` appears at three test-source sites in `player-tally.spec.ts` (583, 586, 738).

## 9 · Pre-return battery (bare, tree / control)

| gate | tree | control |
|---|---|---|
| lint:sleep · lint:lanes · lint:theme-tokens · lint:copy · `npm run lint` (the scoped prettier form) | 0 each | 0 each |
| `eslint .` (after my scratch was moved out) | **0** | **0** |
| test:e2e:projects · check-pw-projects | **1 · 1** (check 8 only: 272 / 269 vs 214 / 212, declared, the chair's) | 0 · 0 |
| check-copy-register (bare) | 0 | (lane: 0) |
| check-property-block | 0 | (instruments lane: 0) |
| typecheck e2e (`vue-tsc -p tsconfig.e2e.json --noEmit`) | 0 | not run |
| lint:sleep + `getAttribute` (the PROPOSED regex, a copy moved out after) | 1 (`viewport-law.spec.ts:111` only) | (lane: 1, same site) |

## 10 · Incidents (mine)

1. My first `eslint .` read **1** on the tree: five errors, all in my own `.plrc6crit/crit6.spec.ts` (unused copied
   helpers). ESLint lints dot-dirs. I moved the dir to `<scratchpad>/plrcount6crit/trash-plrc6crit-1/` and re-ran:
   **0**. The cited reading is the second.
2. My first critic-spec assembly was off by one line (a header line shifted the copy range), and the file failed
   to parse. I re-cut it before any row ran.
3. The arm flips and file plants edited product files under the running dev server (HMR). They ran one at a time,
   and never beside a dev reading of the same surface. The π and filter runs read the built dists, which HMR
   doesn't touch. Every file was restored and sha1-checked: `PlayerMark.vue` 8eeb0a2fa22b, `PlayerLobby.vue`
   2660643c4586, `useTallyStrokes.ts` d9f5bced6fd8.
4. No `rm` anywhere. Scratch is under `<scratchpad>/plrcount6crit/`. The lint:sleep copy and the lane dir were
   `mv`ed to `trash-plrc6crit-1/`. The control tree was served and never git-touched. The work tree's `git status`
   at return is the lane's 23 entries, unchanged.
5. The box ran at load 24–30 (sibling workflows).

Instruments (copies): `critique/PLR-COUNT/instruments/` (`crit6.spec.ts`, whose helpers are copied verbatim from
the landed spec; `breaks.py`; `arm-run.py`; `battery.sh`; the configs). Classified readings: `readings/`. No crops
and no raw JSON are banked.
