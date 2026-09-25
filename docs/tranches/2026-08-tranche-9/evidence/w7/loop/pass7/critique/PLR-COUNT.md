# PASS-7 CRITIQUE · PLR-COUNT · the tally in the head (§11)

Adversarial. I didn't write the charter or the prototype. Work tree `.claude/worktrees/wf_f72f3b5a-83a-52`,
base and π control `74a2b5d9`. At my start and at my return, the tree's temp-index diff against `74a2b5d9` was
sha1 **`5596d639c4f0`**, and it is `cmp`-identical to the banked `pass7/prototype/PLR-COUNT/pass7.diff`. The
battery sha1s the lane cites are the files on disk: `PlayerMark.vue` `fcd3aa8819f3`, `player-tally.spec.ts`
`255b10a1bca2`, `player-mark.spec.ts` `45d3bfef356d`, `PlayerLobby.vue` `2660643c4586`. Every plant I made was
restored and sha1-checked (`restored=OK` on every line).

**VERDICT: ADVANCE · convergence 89 % (pass 6: 87).**

The pass closes the pass-6 rows in substance. Arm (c)'s promise is restated, and its loss is printed at every
count. The name has one referent. G14 reads the whole glyph population with G1–G4 and six in-run plants. G16
reads every count from 6 to 16. The `T9-R6` sites are gone. SELF's cures came in by sha. I re-ran the whole spec
files, G14, G16, the pass-6 TAIL12 file plant, π and the filters, and every number reproduces.

Three things hold the number:
- **G4, the new TAIL clause, can't see a fade at the HEAD of a line.** A file plant that fades the first 12 % of each
  quiet line to 25 % α takes the `1` off `16 players`. It's GREEN on the landed G14 in 6 of 8 cell×engine runs,
  including chromium's dark DPR 2 cell, the one cell that gates G2.
- **G16 doesn't pin the peer id**, although LAWS P6 §C requires it. The "unexplained" spread of `one` that holds
  the light plant's margin at 5 % is the seed of a random id.
- **The B-FORK ballot is framed only at six.** Arm (c)'s restated losses, and (a)'s thinnest numeral, live at 7–16.

## 0 · Gaps first (each closable, numbers attached)

1. **G4 is blind to a fade at the head of a line. The gate is cured for its plants, not for its class.** A
   window's reading is its **p95**, so a window reds only when about 95 % of its pixels are faded. The first
   window holds the `1` of `16` and the left edge of the `6`, which isn't faded, so its p95 stays at the
   declared ink (5.16 light, 6.04 dark). TAIL passes the test because the `s` of `players` fills the last
   window by itself. G4 was fitted in-lane on TAIL plants only (incident 4).
   - **File plant HEAD12F** (`PlayerLobby.vue`: `.pl-state`/`.pl-more` masked to 25 % over their first 6 px, which
     is 11.7 % / 9.7 % of the run, and `.pl-qual` over its first 2 px, 11.6 % of `you`), landed row
     `player-tally.spec.ts -g 'quiet lines paint 4.5:1'`, both engines (`readings/file-breaks.txt`):
     - **GREEN 6 of 8**: chromium light DPR 1, light DPR 2, dark DPR 1 and **dark DPR 2 (the G2-gated cell)**;
       WebKit light DPR 1 and dark DPR 1.
     - The two reds are WebKit light DPR 2 and dark DPR 2, both on **G3 alone at the bound's edge**: 0.541 against
       0.538, and 0.464 against 0.451.
   - **The same plant in-run** (the lane's own Range-keyed `tailPlant`, cut to [0, 0.12], scored by the landed
     `breaches()` as if shipped; `readings/g14-plants-as-shipped.txt`) is GREEN on all three lines in dark DPR 1
     ×2 engines, light DPR 1 ×2, and chromium dark DPR 2. Chromium dark DPR 2 `.pl-state` reads median 5.575,
     fraction 0.431, and every window 6.04. **The plant is visible** (see `hl-stack`, below): `16 players` paints
     as a ghost `1` before a full `6`.
   - The lane's in-run "plant is SEEN" clause never sees this, because no HEAD plant is in its list. X1b keeps the
     head and fades the rest.
   - **Closable:** read the windows at a LOW quantile of their own core, not at p95 of the window. For example,
     the median of the pixels whose R coverage is ≥ 0.5 in that window, or p50 of the window's top-half by R. Or
     key the windows on glyph boxes (a Range per character) rather than on x-columns. Then ship HEAD12 and a MID20
     plant in-run beside TAIL12/35, with the file-form HEAD12F red in all 8 runs.
2. **G16 breaks LAWS P6 §C (the peer id pinned), and that's the whole of its "unexplained" residual.** `one` is the
   room's self row. Its stroke is seeded by `seedFor(r.id)` (`PlayerMark.vue:100`, 97 poses), and the spec
   doesn't pin `session-identity-v1`, so every run draws a random id.
   - Parking the pose fixes the pose index, not the stroke.
   - My reading (`readings/g16-one-by-peer-id.txt`; 1280×800 DPR 2 PRM, poses k = 1…4, the landed D) with
     **`p-0000000b0b0b` pinned twice gives the same numbers to the hundredth**: light chromium [59.61, 60.98,
     61.65, 60.53], dark [58.46, 59.83, 60.48, 59.40].
   - `p-000000000001` reads [62.36, 62.70, 63.48, 61.78], and `p-00000000abcd` [62.67, 60.28, 61.19, 62.72].
   - Two random ids read [61.55 … 63.80] and [60.23 … 63.57].
   - The lane's 59.05–64.06 "across runs with the pose fixed" is this spread. `five` moves with its peers' ids
     too: 228.52 in the lane's run, 231.23 in mine. Under (c), `five` is the bar.
   - **Closable:** pin B's id (and the four peers' ids) in G16 through `session-identity-v1`, then re-derive the
     light plant's margin on the pinned `one`. Pinned, it's 56.35 against 59.61, 5.5 %, deterministic, so a false
     red can't occur by draw. Print the margin at seven.
3. **B-FORK is framed only at six, and the restated losses live at 7–16.** The ballot now names (c)'s loss: the
   ink falls at 6 of 10 steps, the ink per person at 9 of 10, and the head is 97–109 px against 44. It also names
   (a)'s: seven, the thinnest numeral, is ×1.16–1.19 of one stroke. But the one frame (pass-6 crop 1) shows
   N = 6, where none of those is visible. LAWS P6 §C says a ballot arm is FRAMED where it differs from both other
   arms. At sixteen, (c) is `IIIII+11` at 106 px, and (a) and (b) are a `16` at two rungs.
   - The lane's return also says the three arms "paint identical pixels at six". That's false: crop 1 shows `6` at
     title, `6` at heading, and `IIIII+1`. The README's wording is correct: the pixels are unchanged since pass 6.
   - **Closable:** replace crop 1 with one crop of the three arms at N = 16 on one payload, pinned ids, quantized,
     naming crop 1 as its retiree. Or state in the ballot that the loss is numeric only, and the chair accepts it.
4. **Carried, the estate's (declared by the lane, verified here, not the lane's to cure):**
   - G2 is gated in one cell of four (dark DPR 2). The control's caption fails the other three, which are T9-R8.
     My re-run: light DPR 1 2.296–2.323 / 2.385–2.532, light DPR 2 `.pl-qual` 4.335 / 4.262, dark DPR 1 4.081–4.377
     / 3.46–3.66.
   - G3's bounds are the lane's own shipped reading + 0.05. HEAD12F's two reds sit 0.003 and 0.013 inside them,
     which is how thin the only clause that saw it is.
   - G4 at light DPR 1 is relative only (0.4 × p95 = 2.06).
   - G4 is a port with lane-fitted parameters, not the chair's instrument (the LAWS §I objection, shared with SELF).
5. **Sensitivity, not a law breach:** TAIL08 (the last 8 %, under one window's 12.5 %) is GREEN as shipped in
   chromium light DPR 2 on all three lines and in dark DPR 2 on all three. The law names 12 % and 35 %, and both
   red. Gap 1's cure covers this too.
6. **SELF's four pass-7 defects are in this tree by sha** (leader's rows): the `board.left <= rowsStart` disjunct
   (712×800 coarse: 4 rows over 8 cells), WebKit's `clickOwed` debt never forgiven, the four-band row light-only,
   the desk lap of 4 quoted 2–3.
7. **Check 8 RED**: `test:e2e:projects` exits 1, live **275 / 272** against floors 214 / 212, band 234 / 232
   (reproduced; control 0). The +3 are SELF's rows. The chair restamps.
8. **The undefined-token census** (chair's copy): tree exit 1 with **2 bare `--tap-floor`** plus the STALE
   `--refuse-dur`. The control exits 1 on the STALE row only, with 0 bare. The A.3-admitted copy reads tree 0 bare,
   1 STALE, GREEN net. This is inherited as ruled (A.3), not cured in code.
9. **A string that's never painted sits in the font corpus.** `LOBBY_COPY.plus` is aria-only, but
   `check-font-coverage` now lists `0 plus 0` as rendered copy. It's harmless (the glyphs are in the cut, and it
   stays 46 cp / 4,312 B), but the corpus now claims a painted string that nothing paints. Closable by an aria-only
   exemption in the corpus reader, or a comment row.

## 1 · Servers, dist identity, payloads

| port | what | verified |
|---|---|---|
| 4242 | the work tree, dev | two-line config in `<scratchpad>/plrc7crit/`, cacheDir outside the root |
| 4245 | **my own build** of the work tree (config, cacheDir and outDir in the scratchpad) | **`index-BsTWsJhxgpOo.js`, 43 files**: the lane's cited identity reproduces |
| 4244 | the control dist `w7-control` | served `index-CubiZsMVSwTc.js`; never edited, built or git-touched |

The π and filter reads use `?board=ATMuNTMwMDcw…MDc5` (FACE's critic's payload, the chair's README), and the givens
read back through the aria-label corpus give 30 = 30 = 30 in all 8 cells. Listeners 82901 / 82844 / 82874 and npx
82770 / 82769 / 82771 were killed by recorded PID, and the three ports read free at return.

## 2 · What I re-ran myself (both engines)

| claim | prototype | my re-run | |
|---|---|---|---|
| `player-tally.spec.ts`, whole file | 45 / 1 skip / 0 | **45 passed / 1 skipped (WebKit Tab) / 0 failed, exit 0** (load 27–48) | REPRODUCES |
| `player-mark.spec.ts`, whole file | 30 / 0 | **exit 0** | REPRODUCES |
| G16 (a) ink at N = 6…16 | light ch 88.47 / 74.40 / 114.32 / … / 156.60; falls 6→7, 8→9, 10→11, 12→13, 13→14, 15→16 | **identical to 0.01 at every N, both themes, both engines**; the same six falls. `one` = 63.43 (poses 62.00–63.43) against the lane's 59.27 (59.27–64.06): gap 2 | REPRODUCES except `one` |
| G14 medians, 4 cells | light DPR 2 4.657 / 4.725 · `.pl-qual` 4.335 / 4.262 · dark DPR 2 5.944 / 5.868 … | light DPR 2 **4.657 / 4.725**, `.pl-qual` **4.335 / 4.262**, `.pl-more` 4.657 / **4.461** · dark DPR 2 **5.944 / 5.868**, `.pl-qual` 5.868 / 5.792 · dark DPR 1 4.081–4.377 / 3.46–3.66 · light DPR 1 2.218–2.323 / 2.385–2.532 | REPRODUCES |
| pass-6 TAIL12 as a FILE plant | RED 8/8 | **RED 8/8** (`readings/file-breaks.txt`) | REPRODUCES |
| arm (c) cured · pass-6 name · `:294` + G7 | green ×2 · RED ×2 | cured: **`:294` 2/2 green, G7 2/2 green**; P6NAME: **`:294` RED 2/2, G7 RED 2/2**; my MISCOUNT (`5 players, 5 plus 4` for nine): **RED 2/2 on both** (`Expected "9 players, 5 plus 4"`) | REPRODUCES, and the row sees a miscount |
| π whole-DOM, dist vs dist | "not re-run" | **mine, 8 cells** (2 themes × 1280×800 fine / 390×844 coarse × 2 engines): noise arm (control vs control) **0 rows in 8/8**. Rows 1093 → 1157 (1053 → 1117). **Every delta row lies under the head**: `corner-left`, `mobile-attribution`, `head-sheet`, `player-mark`, `player-lobby`, the new wrapper `div.flex.items-center > .attribution-disclosure`, or `ul.players-roster.sr-only` (display flex → block, a 1×1 box, claimed at pass 6). **0 unclaimed rows** | π HOLDS at rest, both engines |
| filterBudget, built dists | tree = control | **tree = control in 16/16**: computed `filter` ≠ none 25 light / 27 dark, 24 `url()`, 5 visible, 15 `<filter>` elements, shut and after one head press, both engines. The estate's 9/11 isn't this census either (as the lane says) | REPRODUCES (tree = control) |
| identity | `index-BsTWsJhxgpOo.js`, 43 files | my build: **the same** | REPRODUCES |

## 3 · Break tests (the pass-6 plant FIRST, then mine)

| plant | row | result |
|---|---|---|
| **TAIL12** (pass-6 critic, file: the box's last 12 % at 25 %) | G14, all 8 runs | **RED 8/8** |
| **HEAD6px** (file: the first 6 px of every quiet line at 25 %; 35 % of `you`) | G14 | RED 8/8, **all via `.pl-qual`** (6 px is a third of `you`) |
| **HEAD12F** (file: the first ~12 % of each line at 25 %) | G14 | **GREEN 6/8**; RED only WebKit light / dark DPR 2 on G3 by 0.003 / 0.013 (gap 1) |
| in-run FADE80 · FADE65 · OPA70 (the chair's FADE80/65, not in the lane's list) | `breaches()` as shipped | **RED in every cell and engine** (G3 or G2) |
| in-run MID20 (40–60 % of the run at 25 %) | as shipped | RED in every cell and engine (G4 or G3) |
| in-run HEAD12 | as shipped | GREEN on ≥ 1 line in 8 of 8 runs; all three lines GREEN in 5 (gap 1) |
| in-run TAIL08 (sensitivity) | as shipped | GREEN on some line in 8/8 (gap 5) |
| arm (c) P6NAME · MISCOUNT | `:294`, G7 | RED 2/2 each, both rows |

## 4 · Constraints

| constraint | reading |
|---|---|
| M16 | `check-copy-register` bare **0** (0 dashes, 0 unadmitted); `lint:copy` 0. One new string, `N plus M`, aria-only |
| filterBudget | tree = control, 16/16 (§2). The pass adds no filter |
| π vs `74a2b5d9` | whole-DOM, computed paint + tag + rect, noise arm 0, every delta in the head (§2). The open sheet is the family's claimed surface and wasn't censused against the control, which has no such sheet |
| AA from painted bytes | reproduces (§2). G2 is gated at dark DPR 2 only (T9-R8). G4's head blindness is gap 1 |
| @property | `check-property-block` tree **0**, control 0 |
| undefined-token census | chair's copy: tree 1 (2 bare `--tap-floor` + STALE), control 1 (STALE only). Admitted copy: tree 0 bare, GREEN net (gap 8) |
| W2's landed mechanics | untouched outside the head (π) |
| decided history (r0 / R6) | no row moved this pass. r0 I3 stays MOVED as pass 5's PROPOSED spec, not re-run |
| ballot law (§2.9) | one payload per frame (pass-6 frames), but B-FORK is framed at six only (gap 3). The ids in crop 1 are fixed (`b1-0..4`, `b1-self`) |
| peer id pinned (P6 §C) | **RED for G16** (gap 2). G14's lines carry no slug |
| one referent (P6 §E) | **closed**: cured name green, pass-6 name red, a miscount red |
| monotone over the whole range (P6 §E) | **closed**: G16 reads 6…16, and the falls are printed and named in the ballot |

## 5 · Checklist

| item | hit |
|---|---|
| gates that cannot fail | G4 cannot fail on a HEAD fade in 6/8 runs (gap 1); the lane named its "seen" list and it holds no head plant |
| the elegant-reduction trap | G4 "the TAIL clause": cut for the tail, and the head is "the hard part" left out (gap 1) |
| the constraint it forgot | P6 §C, the peer id pinned in a §11 painted row (gap 2) |
| unverified gestalt | B-FORK's restated losses aren't framed where they live (gap 3) |
| the pixel it moves that it did not declare (π) | clear (§2) |
| legacy alias · masked fallback · consumer-less substrate · circularity | clear. `countOf` now reads the first number, and the miscount plant proves it can still fail. G3's self-stamped bound is declared and LAWS-lawful until the estate stamps. `plus` has a consumer (the name), though the font corpus counts it as painted (gap 9) |
| the generic default | clear: hand-drawn strokes, a drawn plus, no cards, eyebrows or arrows |
| M16 · filterBudget · @property · W2 | clear |

## 6 · Strengths

1. **Arm (c) is priced honestly.** The false promise is struck from source, spec and ballot. The per-step table
   is printed at every count, and G16 now asserts a bar (6/5 × five) that (c) meets at every N, with its plant
   under the bar at every N.
2. **One referent is real and born-RED.** The cured name greens both rows ×2, the pass-6 name reds both ×2, and
   a miscount I planted reds both ×2.
3. **G14 on the whole population is a far stronger row than pass 6's.** FAINT30, FADE65/80, OPA70, MID20, TAIL12,
   TAIL35, EMPTY, X1b and X2w all red as shipped regressions, in every cell and engine. EMPTY can no longer hide
   behind `min(4.5, 0)`.
4. **The substrate replay is exact.** The bank is the tree, the dist identity rebuilds, and π and the filters equal
   the control outside the head.
5. **The lane read its own statistic against the control's** and declined to gate G2 where the control fails it,
   citing T9-R8 by name, rather than bending the floor.

## 7 · Convergence: 89 %

Every pass-6 row is closed or declared. What holds the number: G4 can't see a faded leading digit, the one gap
here that ships blind; G16 leaves the peer id as a live variable, against LAWS P6 §C; and the B-FORK frame shows
none of the restated losses. None is a missing primitive: each is a closable cut of a row that already exists.
Open gaps aren't zero, so the streak stays 0.

## 8 · Cross-pollination

- **Every windowed or sliced glyph gate** (the chair's `glyph-pop.mjs` G4 at 16 single columns; SELF's state line;
  ERASE/LEDGER's rungs; FACE's chip): a p95 per window is blind to a fade covering less than ~95 % of the window.
  Ship a HEAD plant beside TAIL, since a leading digit is the costliest glyph to lose. **The chair's instrument
  inherits this**: its G4 is p95 per column too.
- **Every §11 / §11c ink row that reads a stroke** (SELF's solo stroke, PLACE, WALK's swatch): the stroke is
  seeded by the peer id, so pin `session-identity-v1`. Otherwise the stroke is a 97-pose variable, and "pose
  parked" doesn't park it.
- **Every restated ballot:** frame the arm where its stated loss lives, not where the arms were first compared.

## 9 · Pre-return battery (bare, tree / control)

| gate | tree | control |
|---|---|---|
| check-copy-register (bare) · lint:copy · test:font-coverage · lint:sleep · lint:theme-tokens · lint:lanes · `npm run lint` (prettier) | **0 each** | (lane: 0 each) |
| test:e2e:projects (check-pw-projects) | **1** (check 8 only, 275 / 272) | (lane: 0) |
| check-property-block (source) | 0 | **0** |
| undefined-token census, chair's copy | 1 (2 bare + STALE) | **1** (STALE) |
| undefined-token census, A.3 copy | 1 (0 bare + STALE, GREEN net) | — |
| eslint (the pass-7 touched product files; not `eslint .`, my scratch sat in a dot-dir) | **0** | — |
| lint:bands · lint:verbs | not on `74a2b5d9` | same |

Not run by me: `vue-tsc -b`, `typecheck:e2e`, vitest (the lane's 830 / 0 on an archive is cited, not re-run),
`ledger-diff --verify-cites`. I grepped `T9-R6` in `e2e/`: 0.

## 10 · Incidents (mine)

1. **My first HEAD crop probe (`crit7c`) overlapped the tail of my critic G14 run** (two browsers). Both are
   paint readings, and no timing row is involved.
2. **My first seed probe titled its tests with `Math.random()`**, so the workers couldn't find them and 24 red on
   "test not found". I re-cut it with indexed titles and re-ran it. The cited readings are the second run.
3. **My first HEAD12F literal broke the runner** (a heredoc double-escape: SyntaxError, no file touched). I
   repaired it and re-ran. `PlayerLobby.vue` read `2660643c4586` before and after every plant.
4. File plants (HEAD6px, TAIL12, HEAD12F on `PlayerLobby.vue`; three arm flips on `PlayerMark.vue`) edited product
   files under HMR, one job at a time, and were restored by copy with sha1 verified. The tree's diff sha1 at my
   return is `5596d639c4f0`, the same as the bank's.
5. **The box ran at 1-min load 27 → 751 → 88** (a sibling spike during my G14 and file-plant runs). There is no
   timing row here.
6. No `rm`, no `git clean`, no git in the control. My scratch dir `web/frontend/.plrc7crit/` was `mv`ed to
   `<scratchpad>/trash-plrc7crit-1/`. The work tree's `git status` at return is **18 M + 5 ??**, the lane's,
   unchanged.

Instruments are in `critique/PLR-COUNT/instruments/`: the critic specs as diffs against the landed file, plus
`pi7.spec.ts`, `filt7.spec.ts`, `breaks.py`, `arms.py`, `run1.sh`, `run2.sh` and the configs. The classified
readings are in `readings/`. No crop and no raw JSON is banked. The HEAD12 stack (`hl-stack.png`) stays in the
scratchpad: it's a critic's witness, not a ballot pair.
