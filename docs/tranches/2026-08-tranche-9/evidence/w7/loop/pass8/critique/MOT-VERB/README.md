# MOT-VERB · pass-8 critique (§13, the pencil verbs)

Critic: an adversarial non-author. Subject: bank `8c12b15c` (the §13 tree `.claude/worktrees/wf_f72f3b5a-83a-59`, base and π control `74a2b5d9`). Pass 7 read **83**. **Pass 8: 85. Verdict: ADVANCE.**

**The un-clipped frame LANDED at `8c12b15c`**, and at `77345798` on the union. I re-derived it in paint, in both engines, on five rigs and both themes, with the control and a fresh plant beside it. GRAPHITE's unblock condition (i) holds.

Transcripts: `logs/rows.txt` (every row below, with the load line). Replay scripts: `instruments/`. Box load was 11–18 (1-min) across every browser row.

## 1 · Gaps first (open at this critique)

1. **The PROPOSED postpaint key does NOT reproduce its self-test.**
   - I ran `node e2e/lib/postpaint.mjs --self-test` on the bank archive (the ONE copy with `postpaint.kpaint.PROPOSED.diff` landed) at load 14–16. It exits **1 in chromium and 1 in WebKit**. The lane's return says "exit 0 both engines".
   - The HEAVY clean mover reds under the NEW key 1/2 in each engine:
     - chromium r2: kPaint 0, F1 ct 29.6, 177.6 px
     - WebKit r1: ct 31, 186 px. WebKit's rAF-time key is the same frame there.
   - The key the lane's GA1 chromium 20/20 rests on is therefore unproven. The HEAVY plant is not deterministic: WebKit r2 reads ct 31 with c 0.
   - The chair must NOT fold this diff into `homes.diff` as banked (LAWS §I: an extension lands with a plant that holds). **RED.**
2. **GA1 in WebKit is green by TOLERANCE, not by construction. The flush lag is systematic.**
   - Frame 1 carries a started clock on **every** WebKit run. I read ct 11–21 ms on 12/12 GREEN runs (×3 per cell). The lane's own 32 WebKit rows read 16–33 ms on its greens and 23–90 ms on its reds.
   - F1 is a 3 px position tolerance, so a green or a red depends on whether the curve's foot has moved yet at that clock:
     - ct 33 reads c 0 (GREEN)
     - ct 23 reads 21.76 px (RED)
   - The CI clause is RELATIVE to frame 1, so a constant one-frame offset is invisible to it. Chromium reads ct 0 on 6/6.
   - So the chair's "flush lag" is not 5/20. It is 20/20 at the clock and 5/20 at the pixel.
   - No clause reads frame 1's own ct. A one-frame skip plant (~16 ms) was never planted; WebKit passes that skip at baseline. The product cause is unattributed and uncured. **RED** (the lane's gap 1, sharpened).
3. **The rate gate's floor is looser than LAWS P7 §F, and pass 7's plant passes its 60 Hz arm.**
   - The R clause is ruling ≤ 1.2 × native, a pace floor of 0.833. The law is ≥ 0.9.
   - Pass 7's flat-17 ms clock (`p7clock`, built out of tree) reads:

     | engine | 60 Hz arm | 30 Hz arm |
     |---|---|---|
     | chromium | **1.12×**: GREEN at 1.2, RED at the law's 1/0.9 = 1.11 | 2.13× (RED) |
     | WebKit (its "60" is 50 Hz) | **1.20×**: 2386 vs 1990 ms, GREEN by 0.001 | 2.31× (RED) |

   - The WebKit shim arms run at 50/25 Hz, not 60/30. **RED against the law's number.**
4. **The painted rate row cannot see the defect M20 cured.**
   - My `wall` plant (`clock += dt`: the wall clock, no step cap, the pre-M20 teleport) passes `boot-hand.spec.ts` **GREEN in both engines at all three rates**:
     - chromium: ruling 1998/1982/1981 ms, 101/98/90 %/s
     - WebKit: 1988/1979/1978 ms
   - The stall half is held only by the unit rows (the same plant reds 5/10 of `bootHand.test.ts`).
   - No painted row injects a lost frame, and the printed "worst %/s" is not gated. Row 1's per-tier caps (7.8/16.3/27.1 %) restated as %/s are still unmet (the lane's gap 8).
   - LAWS P7 §F(iii) asks for a behavioural row beside every source law. **RED.**
5. **`frame-halfstroke.spec.ts` hand-rolls a second painted-depth reader.**
   - The ONE `e2e/lib/edge-bands.mjs` owns the depth statistic: B3's "Σ |gON−gOFF| / |gINK−gOFF| per station".
   - The spec computes the same statistic in its own `depth()`/`cov()`, with its own ink estimate (the strongest 1 % step). It imports only `onOff`/`grey`/`median` from paint-lib.
   - The frame's relative clause (F1: t/b ≥ 0.85 × sides) is a shape edge-bands does not read. By LAWS §I, that is a PROPOSED clause on the ONE copy with its plant, never a lane-local reader.
   - The numbers are sound (§2). The reader is a fork after batch 0. **RED under §I** (re-cut through `fourBands` + a PROPOSED relative-band clause).
6. **G-HINGE holds CONSISTENCY, not the crossing.**
   - `MOTION.hinge.dark 0.343 / light 0.249` are typed constants. G-HINGE proves delay = round(dusk × fraction), and that the dusk curve is the one typed at derivation. Nothing re-derives the fraction from paint.
   - A retune to any fraction, with its delay re-typed, is its "lawful" negative-negative.
   - The only painted evidence of the hinge instant is the lane's own B23 frame: the user 5 at **1.97:1** at +122 ms, where the default loses.
   - Row 7's §2.11 painted gate over all inks is UNBUILT. The hinge's correctness claim cites itself. **OPEN.**
7. **The owner's rows are UNBUILT for a second consecutive pass.** INTAKE-23 rows 2, 3, 4, 10, 11, 12, 13, 15, plus T9-B24 and T9-B26. The charter's row 9 says "no deferral": each built as both arms or declared with the number it DIES on. The lane re-cites the intake's pre-existing numbers (G-D9 0.34 em, R 32/34, the band p95 25–29) as "unbuilt", which is a deferral, not a death. **OPEN** (U-10).
8. **Rows 7, 10, 11, 12, 13, 14 and T9-B25's frame: NOT RUN.**
   - Row 10: the stack-open move, the late-deal regime, G-D12.
   - Row 11: INTAKE-22 rows 31/32/34/36/41, and chromium's 34 ms clause. NOT met.
   - Row 12: no fourth-pass row-37 candidate.
   - Row 13: T9-B22, and pass-7 charter rows 7–9.
   - Row 14: whole-DOM P7-π, goldens 4/4, the dark-boot census, ink-rub-out's consumer, 11-vs-9.
   - v7 §8.2 row 17: T9-B25 is still unframed.
   - Row 16 was not framed mid-flip. **OPEN.**
9. **The price the owner pays is unchanged in kind.** Digits at 2.57–2.69 s in chromium and 2.66–3.06 s in WebKit (my runs), against the control's 0.28–0.63 s. The 30 Hz cliff is cured; T9-B25's default remains a ~2.1 s ruling before any digit. It is the owner's ballot and still unframed.
10. **The on-union delta carries this tree's `census.stamp.json`**, and the union reds FLOOR BAND 3 (inherited 4). The lane declared it and I did not re-derive it. The restamp is the fold's (the lane's gap 9).

## 2 · What I re-derived (numbers first)

### 2.1 The un-clipped frame (row 8; GRAPHITE's unblock)

**Setup.** I built a clean `git archive 8c12b15c` out of tree with a private cacheDir: `index-paO7tVLM_11M.js` / `index-DHs860g5jK_C.css`, **49** `@property` served. That is identical to the lane's identity, and the served identity was checked on :4247. The control is the shared read-only tree on :4250 (`index-CubiZsMVSwTc.js`). I ran `frame-halfstroke.spec.ts` whole, per engine. The value is min(t, b) ÷ mean(sides).

| rig (span dpx) | tree chromium L/D | tree WebKit L/D | control chromium L/D | control WebKit L/D | critic plant `ypad3` chromium L/D | `ypad3` WebKit L/D |
|---|---|---|---|---|---|---|
| desk 1280×800 fine DPR1 (636) | 1.008 / 1.008 | 1.000 / 0.999 | 0.430 / 0.430 | 0.449 / 0.449 | 0.683 / 0.682 | 0.699 / 0.699 |
| phone 390×844 coarse DPR2 (724) | 1.001 / 1.001 | 1.000 / 1.000 | 0.445 / 0.445 | 0.451 / 0.433 | 0.707 / 0.686 | 0.693 / 0.693 |
| 768×1024 coarse DPR1 (668) | 0.999 / 0.999 | 0.999 / 0.999 | 0.430 / 0.430 | 0.434 / 0.445 | 0.679 / 0.679 | 0.696 / 0.696 |
| 1024×768 coarse DPR1 (604) | 1.002 / 1.002 | 1.000 / 0.999 | 0.414 / 0.414 | 0.445 / 0.444 | 0.690 / 0.690 | 0.683 / 0.694 |
| 1280×800 coarse DPR1 (636) | 1.008 / 1.008 | 0.999 / 1.000 | 0.430 / 0.430 | 0.447 / 0.447 | 0.683 / 0.705 | 0.684 / 0.684 |
| exit | 0 (12/12) | 0 (12/12) | 1 (born-RED 10/10) | 1 (born-RED 10/10) | 1 (RED 10/10) | 1 (RED 10/10) |

- **The in-run clip plant reds on the tree:** 0.780 desk and 0.765 phone in chromium; 0.698 and 0.683 in WebKit.
- **The critic's source plant.** `FRAME_Y_PAD = 3` (a quarter of the stroke clipped) reds every rig in both engines. The gate discriminates a source regression and not only a CSS clip.
- **Tolerance declared.** F1 at 0.85 passes a ≤ ~15 % clip by construction.
- **Depths, chromium desk.** Tree: t 7.70, b 7.76, sides 7.64, against a 7.63 px stroke. Control: t 3.28, b 4.00.
- **One discrepancy with the lane.** My control chromium reads 0.414–0.445. The lane's control column reads 0.435–0.450, and its union-base column holds exactly my control's figures. That is run-to-run variance on a red arm, and immaterial to the verdict.
- **π probe** (`instruments/pi-top.mts`: chromium 1280×800 light, r1c1 selected, tree vs control): the selection box sits inside the moved frame. There is no spill above the top line. That is one surface only; whole-DOM π remains unrun (gap 8).
- **Apply checks, re-run through temp indexes** (`GIT_INDEX_FILE`):
  - `pass8.diff` (908,088 B, sha1 a10c6bdd32a7) on `74a2b5d9`: **0**, writes `8c12b15c`.
  - `pass8.delta.diff` (76,965 B, 74617d8f2f6d) on `547b50d5`: **0**, writes `8c12b15c`.
  - `pass8.delta.on-s13-s7-s3.diff` (77,031 B, 71081ea346a1) on `caa4898a`: **0**, writes `77345798`.
  - `--shortstat` 76 files +17924/−361. All confirmed.
- **Unit row.** `gridPaths.frame.test.ts` + `bootHand.test.ts`: 16/16 on the archive.

### 2.2 The hand as a rate (rows 2–3), `boot-hand.spec.ts`, tree

| engine · display (observed) | ruling ms | digits (wave) ms | worst %/s | bakes in ruling | ×native |
|---|---|---|---|---|---|
| chromium native (7.9) | 2098 | 2574 | 102 | 0/56 | 1 |
| chromium 60 (17.0) | 2123 | 2657 | 98 | 0/56 | 1.012 |
| chromium 30 (36.6) | 2142 | 2694 | 91 | 0/56 | 1.021 |
| WebKit native (10.0) | 2092 | 2765 | 101 | 0/40 | 1 |
| WebKit "60" (21.0 = 48 Hz) | 2020 | 2661 | 97 | 0/40 | 0.966 |
| WebKit "30" (40.0 = 25 Hz) | 2264 | 3055 | 93 | 0/40 | 1.082 |

- **Verdict:** GREEN in both engines. This reproduces the lane's table within 1–4 %.
- **Plants, each built out of tree from the archive with one asserted replacement:**
  - `p7clock` (pass 7's plant, run on the re-cut gate): chromium R 2.13× at 30 Hz but **1.12× at 60 Hz, green**. WebKit R 2.31× at 30 Hz but **1.20× at "60" (50 Hz), green**.
  - `wall` (the critic's): **GREEN both engines** (gap 4).
- WebKit's "30" arm is 25 Hz, above `maxStepMs` 34. The hand runs at 34/40 = 85 % there by design: 1.082× in my run.

### 2.3 GA1 (row 1), `fold-verb.spec.ts`, tree

- **Chromium ×1, 6/6 passed.** F1 ct 0 c 0 on 4/4 cells, CI off 0. PLANT skip RED (ct 150, 142.93 px). PLANT f2 RED (off 150). The rAF-time key reds 3/4 cells on the same frames (ct 13.5–28.1).
- **WebKit ×3, 18/18 passed.** F1 green at **ct 11–21** on 12/12. PLANT skip RED 3/3. PLANT f2 RED 3/3 (off 150). Pass 7's cannot-fail f2 is CLOSED in WebKit.
- The WebKit frame-1 clock is gap 2.

### 2.4 Gates, browserless (clause sabotage, §2.5)

- **`lint:bands --self-test` in the tree: exit 0.** In a `git archive` it exits 1, because B6 needs `74a2b5d9` reachable. Its `--sabotage-battery` in an archive therefore "reds" every clause for the wrong reason. Read the battery in a clone only.
- **G-HINGE sabotage, in the tree, exit 1 each:**
  - `hinge-derive`: 4 plants go green
  - `hinge-curve`: 1
  - `hinge-present`: 1

  That is 3/3.
- **`shape-census --self-test`:** 95/95, clauses planted 43/43. **`--sabotage-battery`:** 43/43, exit 0. The VERB rows X15/X15b, X16/X16b, X17 and X18 are each "ok".
- **knip** on the archive: exit 0.

### 2.5 Constraints

- **Instrument imports.** Every one is a relative product path:
  - `frame-halfstroke` → `./lib/paint-lib.mjs`
  - `boot-hand` and `fold-verb` → `./lib/postpaint.mjs`
  - `check-motion-bands` and `check-theme-tokens` → `./shape-census.mjs`

  There is no `docs/` import in `e2e/`, `scripts/` or `src/`.
- **The tree's instrument bytes against `homes.diff`** (sha a1d8adeb, applied to `74a2b5d9` → `bd437751`): `paint-lib`, `glyph-pop`, `edge-bands` and `rest-probes` are identical. `postpaint` differs by +36/−4 (VERB's PROPOSED, gap 1). `shape-census` differs by +84/−11 (LADDER's, declared).
- **@property:** 49 served = 49 clean (the §2.17 law holds). There is no scratch under the tree's `web/frontend/` (only `.prettierignore`/`.prettierrc.json`), and untracked files are product files only.
- **M16:** no user-visible string was added.
- **AA:** no text surface moved.
- **filterBudget:** no filter-bearing byte moved (read by diff; the census was not re-run: gap 8).
- **Ballot pair** (T9-B23 at +122 ms, 12,007 B): the one variable is `VITE_INK_AT_FLIP` on one payload. The caption names engine, theme, viewport, pointer, DPR and payload. It retires the +100 ms crop, at +290 B of headroom. The frame shows the loss the caption states: the hinge arm's paper is mid-grey rgb(112,111,110) with light ink on it, and the sheet's paper is near-black. Checked against the frame.

## 3 · The number

**85 (from 83).**

**Earned (+):**
- The un-clipped frame is landed and painted-proven on both trees, five rigs, both engines and both themes, with a control, an in-run plant and a critic source plant all red.
- Pass 7's cannot-fail f2 is closed in WebKit.
- The 30 Hz cliff is cured (2.13–2.31× → 1.02–1.08×).
- Shipped gates now reference `afterRuling`, `holdRuling`, `stacksResident` and `ink-hinge`, with 3/3 clause sabotage.
- The census's six shapes go through the ONE library.
- The clean dist is re-stamped.
- B23 is framed at the losing instant.
- knip is cured.

**Withheld (−):**
- The PROPOSED key's self-test does not reproduce: exit 1 in both engines.
- WebKit's frame-1 clock is systematically 11–33 ms, passed by tolerance.
- The rate floor is 0.833 against the law's 0.9, and pass 7's plant passes the 60 Hz arm in both engines.
- The painted rate row passes the wall-clock hand.
- A forked depth reader (§I).
- G-HINGE is self-cited.
- The owner's ten rows and five charter rows are unbuilt or unrun, a second pass running.

The section is not at 100 and cannot be before these close.

## 4 · Incidents (self-declared)

1. My first `--sabotage-battery` of `lint:bands` ran in a `git archive` (B6 needs git). It is VOID, and I re-ran the three G-HINGE clauses in the tree, which is read-only for the script (its only write is the `--bank` mode).
2. My first π probe failed at import (`e2e/wire.ts` resolves `src/lib/base64url` without a TS loader). I re-ran it on a default deal, so the probe's payload is a random deal and its cell r1c1 differs between the arms (a given 3 on the control, empty on the tree).
3. `pass7`'s plant was run on the re-cut gate after the tree's clean rows, not before them. The order is declared; each ran on its own dist.
4. Servers:
   - I started :4247 (wrapper 37387, then each swap's own) and :4250 (wrapper 37389, listener 37525), recorded their PIDs, checked their cwd, and killed only those.
   - Ports 4247/4250 were free at open.
   - No sibling listener was touched.
5. There was no `rm`, no commit, and no git in the control tree. Every git read went through `GIT_INDEX_FILE` temp indexes. Scratch is at `<scratchpad>/verbcrit8/`.
6. Box load was 11–18 across the browser rows (lower than the lane's 18–41; timing rows are comparable only as ratios).
