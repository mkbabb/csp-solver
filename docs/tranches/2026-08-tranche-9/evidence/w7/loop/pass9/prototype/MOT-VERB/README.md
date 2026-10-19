# MOT-VERB · pass 9 PROTOTYPE (§13, batch 3, ran SECOND on the one §13 tree)

Tree `.claude/worktrees/wf_f72f3b5a-83a-59`, advanced in place after MOT-LADDER. At open its temporary-index
write-tree was **`7b2e2839`**, LADDER's pass-9 cut (`pass9/prototype/MOT-LADDER/pass9-ladder.txt`) to the byte: no
difference to declare. Homes v2 was already landed by LADDER: the tree's 13 home paths equal `74a2b5d9 + homes.diff`
(sha1 `1f70cfda`, temporary index → `d17813ba`) with an empty diff, so VERB's pass-8 `kPaint` PROPOSED and its hand-rolled
`postpaint.d.mts`/`paint-lib.d.mts` are gone from the tree (CHAIR-RULINGS §9: not folded as cut). This pass's one
library extension is filed as **PROPOSED** (`PROPOSED-postpaint-stale-rebase.diff`), not banked.

The number is the critic's. This README holds the lane's readings; transcripts are under `logs/`, replay scripts under
`instruments/`.

## Numbers first

- **GA1 (row 1):** 20/20 clean cells GREEN per engine (F1 ct 0, c ≤ 0.03 px; CI off 0.0), PLANT skip / skip16 / f2
  RED 5/5 each per engine, with the PROPOSED `stale-rebase` on homes v2. On homes v2 alone WebKit's skip row is GREEN
  (the hole, §1.2).
- **The flush lag (row 2):** WebKit's frame-1 post read is stale on 20/20 folds (Chromium 0/20); frame 1 paints at ct 0,
  proven on the in-rAF clock identity (offset 0.0 ms at k = 2, 3 on 20/20). The 11–33 ms was the read.
- **R (row 3):** pace at the law's 0.9 — tree t3 0.993–1.014 at the four delivered arms (Chromium 54.6/27.0 Hz, WebKit
  47.6/25.0 Hz); final bytes t4 ×6 0.952–1.083 on 23 of 24 arm reads, **0.848** on one (a WebKit run whose stack wait
  hit its ceiling and held a 174 ms frame, gap 9); pass 7's clock RED on all four (0.899 / 0.470 / 0.842 / 0.449).
- **L (row 4):** a lost frame moves the ruling ≤ 1.61× its neighbours' step on t3 and ≤ 2.23× on t4 ×6 (36 stalls); the wall clock 8.47–13.00× on
  5 of 6 stalls, RED in both engines; unit rows 15/15 with 12 one-edit plants each RED, the slack and the cap pinned ±ε.
- **Frame (row 5):** min ÷ deepest band 0.973–1.000 at five rigs × two themes × two engines through the ONE probe;
  the control 0.440–0.465 (RED 20/20); the clip plant 0.698–0.807 RED.
- **Bank:** tree `2b9c277e`; `pass9.diff` 1,078,172 B (80 files, +21,594 / −361), `apply --check` 0 on `74a2b5d9`;
  `pass9.delta.on-WAVE.diff` 0 on `babea79d` (union + homes + LADDER) → `137dc91f`; `pass9.s13.on-WAVE.diff` 0 on
  `acde977b` → `137dc91f`.
- **Final bytes (t4), ×6 per engine:** boot exit 0 on 4/6 Chromium and 5/6 WebKit (gap 9); GA1 7/7 per engine;
  π under PRM 8/8 cells byte-identical to the pass-8 bytes.
- **Unit:** `vue-tsc -b` 0, `typecheck:e2e` 0, vitest 741 + 101 + 16 = **858** passing (games / pencil / composables).

## 0 · Gaps first (open at this return)

1. **GA1's WebKit plant rows are RED on the bank's library.** Homes v2's `stale` cure substitutes the IN-RAF read for a
   stale post read. The fold's mover is held paused and started by a write in a rAF the product registers AFTER the
   sampler's, so that in-rAF read is taken before the write: PLANT skip (frame 1 painted at ct 150) read **ct 0, GREEN**
   in WebKit on homes v2. The cure is `stale-rebase` (§1.2), PROPOSED to the home with its unit row U5 and its born-RED;
   on the bank (homes v2) `fold-verb.spec.ts` exits 1 in WebKit whenever frame 1's post read is stale (the skip row:
   2 of 2 reads; skip16 red on its one read where frame 1 was not stale). The chair folds or strikes; no CI lane runs
   the spec (O-12).
2. **R at the law's 0.9 is a hair from the bound on Chromium's 60 Hz arm.** The re-cut hand reads pace 1.001–1.008 there
   (green by 0.10); pass 7's flat-17 ms plant reads **0.899** (red by 0.001). The 60 Hz shim delivers 54.6–58.1 Hz on a
   7.8 ms panel, so `p7clock`'s loss there is 1–2 %: a red by ε, not a robust one. WebKit's arms (50/25 Hz) red it by
   0.058 and 0.451.
3. **L's bound (4×) does not pin a 3× stall cap.** The wall clock reds every stall in both engines (8.5–13.0×); the
   `cap3x` plant (a lost frame may travel 3 caps) reds 1 of 3 stalls in Chromium and 0 of 3 in WebKit (2.59–3.93×). The
   per-frame neighbour step is a noisy denominator on an eased stroke. The unit rows pin the cap exactly (§2.2); the
   painted row pins the teleport, not the cap.
4. **`paceSlack` 1.5 is a fitted constant** (LAWS P8 §E): it is the smallest slack that carries Chromium's shimmed
   60 Hz alternation (15.6/23.4 ms, ratio 1.5) whole, pinned by unit plants at 1.49 (red) and 1.51 (red). It is a
   ballot variable the owner has not seen; the R row prints its arm rates.
5. **INTAKE-23 rows 2, 3, 4, 10, 11, 12, 13, 15 and T9-B24/T9-B26 are not built this pass** (U-10, a third deferral):
   §5 gives each its state and the number it holds at. Row 16 is built (pass 8) and READ this pass (§5.1).
6. **G-HINGE in paint (charter row 6) is not built.** The hinge's correctness claim still cites the typed fractions and
   the B23 frame.
7. **Charter row 8's sub-rows** (the stack-open move, the late-deal regime, G-D12, INTAKE-22 31/32/34/36/41, row 37,
   T9-B22, whole-DOM π on the WAVE union, goldens 4/4, the dark-boot census, ink-rub-out's consumer, 11-vs-9): not run
   this pass, each listed in §5 with the reason.
8. **Row 16's painted leg is unread in WebKit** (§5.1): the 1×1 clip reads `#000000` on both arms, the instrument's fault.
   Chromium reads meta = body = painted on 7/7 flips with the option built.
9. **The final bytes are not clean on every boot run** (§2.3, t4 ×6): Chromium 4/6 (two **S** reds on the native arm,
   4/56 and 8/56 bakes inside the ruling, ceiling 0) and WebKit 5/6 (one **R** red, 0.848, on a run whose stack wait hit
   its ceiling and held a 174 ms frame). The pass-8 bytes read S clean 3/3 at the same hour, earlier tree builds 0/11.
   The hand's edit is not on the wait's path and the first-stroke times match (472–612 ms on every arm), so the lane
   does not claim the S reds for the edit or clear it of them: the attribution needs ≥ 20 runs per arm, not run.

## 1 · Rows 1–2: the frame-1 key and the flush lag (the fold blocker)

### 1.1 The flush lag, ATTRIBUTED: it was the read, not the paint

- Homes v2's postpaint (the chair's `key-inraf` + `stale` + `F1ct`, which replaced VERB's `kPaint` as cut) prints, per
  post read, the timeline AT the read (`tlNow`). On the tree, WebKit's frame-1 post read is **stale on 20/20 fold runs**
  (`tlNow` ≠ the frame's `tl`): the MessageChannel task queued from frame 1's rAF runs after frame 2's timeline update,
  because frame 1 is the fold's heavy first frame (the reparent's layout and paint). The pass-8 critic's "ct 11–33 ms at
  frame 1" is that stale read: the next frame's clock. Chromium's frame-1 post read is stale on 0/20.
- The product's frame 1 is at ct 0, proven on the clock identity rather than on the stale read: the in-rAF arm reads
  ct(frame k) = tl(k) − tl(frame 1) with offset 0.0 ms at k = 2 and 3 on 20/20 WebKit runs, so `startTime` = tl(frame 1)
  and frame 1 painted at ct 0. Mechanism named: `useFlipGlide.run({ holdFirstFrame })` pauses the movers at hold time 0
  and writes `startTime = document.timeline.currentTime` in the next rAF; nothing writes after the first paint.
- The DOM clock beside the frame clock (ruling 4): every row prints `stale n` (post reads whose `tlNow` moved) beside
  the frame clock. Tree, ×5 per cell: WebKit stale 1–5 per run with frame 1 stale on 20/20; Chromium 0 on 20/20.

### 1.2 The hole the stale cure opened, and `stale-rebase` (PROPOSED)

- A stale post read is replaced by its in-rAF twin. The fold's twin is read in the SAMPLER's rAF, which runs before the
  product's start write in the same frame, so it holds the paused mover at ct 0 whatever the write was. On homes v2,
  PLANT skip (every `startTime` write 150 ms early) reads **frame 1 ct 0, c 0: GREEN** in WebKit; only CI reds it
  (off 150 at k = 2, 3). PLANT skip16 is the same shape.
- The cure (`PROPOSED-postpaint-stale-rebase.diff`, 5,068 B, `git apply --check` 0 on homes v2's tree `d17813ba`): the
  sampler records `playbackRate`; a stale RUNNING post read carries its own clock back, ct − (tlNow − tl) × rate, with
  the twin's position. Clause `stale-rebase` joins `PP_CLAUSES`; unit row **U5** (the fold's shape: a stale frame-1
  post read beside a paused twin) is RED (a hole) with the clause deleted and OK with it; U2 still reads GREEN (rebased
  ct −1, within 4 ms).

### 1.3 GA1 re-read (`fold-verb.spec.ts`, 4 cells, PLANT skip / skip16 / f2 in-run; the ×5 rows on build t1 `index-CSD1PvRGHFeo.js`, before the hand edit, which the fold does not read; the homes-v2 rows on the final build t3 `index-xRKsh6PGKl3n.js`)

| library | engine | clean cells | PLANT skip (F1) | PLANT skip16 (F1ct) | PLANT f2 (CI) | exit | load |
|---|---|---|---|---|---|---|---|
| homes v2 + PROPOSED `stale-rebase`, ×5 | chromium | **20/20 GREEN**, F1 ct 0 c 0 | 5/5 RED, ct 150 | 5/5 RED, ct 16 | 5/5 RED, off 150 | 0 (35/35) | 14.8–16.3 |
| homes v2 + PROPOSED `stale-rebase`, ×5 | webkit | **20/20 GREEN**, F1 ct 0 (rebased; c 0–0.03) | 5/5 RED, ct 150 | 5/5 RED, ct 16 | 5/5 RED, off 150 | 0 (35/35) | 18.2–19.5 |
| homes v2 (the bank's library), ×1 | webkit | 4/4 GREEN | **GREEN: ct 0, stale 5** (the hole) | RED (frame 1 not stale on that run) | RED | **1** | 53.4–53.9 |
| homes v2, ×1 | chromium | 4/4 GREEN | RED | RED | RED | 0 | 53.4–53.9 |
| homes v2 + PROPOSED, final bytes t4 `index-B7aFKR_D7Tjh.js`, ×1 | chromium | 4/4 GREEN, ct 0 c 0 | RED, ct 150 | RED, ct 16 | RED, off 150 | 0 (7/7) | 35.1–39.2 |
| homes v2 + PROPOSED, t4, ×1 | webkit | 4/4 GREEN, ct 0 (stale 1–2, rebased) | RED, ct 150 | RED, ct 16 | RED, off 150 | 0 (7/7) | 35.1–39.0 |
| homes v2, first read at open, ×1 | webkit | 4/4 GREEN | **GREEN: ct 0, stale 4** | (row not yet in the spec) | RED | 1 | 36.8–40.4 |

- `fold-verb.spec.ts` gains the skip16 negative (one frame early: the critic's WebKit frame-1 clock as a plant), which must
  red F1ct. On the bank's library WebKit's skip row reds only when frame 1's post read is not stale; with
  `stale-rebase` it reds 10/10.

### 1.4 The PROPOSED library's own self-test (charter row 1: ≥ 6 consecutive runs per engine, the load printed)

`node e2e/lib/postpaint.mjs --self-test --engine <e>` on homes v2 + `stale-rebase` (unit U1–U5, the sampler ×3 reps:
RAF and EASED clean movers, PLANT skip / f2 / from40 / skip16, the TASK-mover born-RED; the recorder rows):

| engine | runs | exits | load at each start | sabotage battery (one clause off, the self-test must red) |
|---|---|---|---|---|
| chromium | 6 consecutive | **0 0 0 0 0 0** | 115.9 / 90.2 / 69.9 / 47.7 / 45.4 / 37.8 | **6/6** (F1, F1ct, CI, key-inraf, stale, stale-rebase), exit 0, load 29.1 |
| webkit | 6 consecutive | **0 0 0 0 0 0** | 29.1 / 25.2 / 24.6 / 23.2 / 22.7 / 19.4 | **6/6**, exit 0, load 19.8 |

- Clean movers GREEN 36/36 per engine; every plant RED in every rep; no `← a hole` line in any run. Chromium's fixture
  frames read a stale post read 3–6 times per run, each rebased and GREEN (clean) or RED (skip16: rebased ct 16).
- Born-RED of the clause: `POSTPAINT_SABOTAGE=stale-rebase` reds U5 alone (a hole: "a stale frame 1 reads its pre-write
  twin"), exit 3, both engines.

## 2 · Rows 3–4: the hand is a rate at the law's 0.9, and a lost frame never teleports it

### 2.1 The product change (ACC-FIVE's graft, LAWS P8 §D)

`bootHand.ts` `pace()` keyed on the window MEDIAN (pass 8: the FIVE critic's trap; the third consecutive stall of five
traveled the cap). It now keys on the window MINIMUM: a frame may move the hand at most
`min(max(shortest × paceSlack, stepMs), maxStepMs)`, with no seed (the first frame is observed). `MOTION.hand`:
`maxStepMs` 34 → **42** (one 24 Hz frame: the 0.9 floor holds down to 21.4 Hz; at 34 WebKit's 25 Hz arm reads 0.85 by
construction), **`paceSlack: 1.5`** new (a fitted ratio, gap 4). `check-motion-bands.mjs`: the three hand rows restated,
`hand.paceSlack` added as NOT A LENGTH, the one ADMITTED_ARITH row replaced by two (the allowance `Math.max(shortest ×
paceSlack, stepMs)` and its cap `Math.min(floored, maxStepMs)`, one statement per line: prettier's wrap of the one-line
form hid the cap's operand from B13's line reader, which reds the first and calls the old row STALE), and one consumer RETUNE row
(the seed's second `stepMs` read left; the roster reads the gained `paceSlack` as a 1.5 ms clock). The RETUNE validator
accepted `rung | key | ts` as a subject but not `consumer`, the subject `consumerRatchet`'s own message prescribes; one
clause now accepts `consumer` (a one-token cure on LADDER's gate, declared). `lint:bands` exit 0.

### 2.2 Unit rows (`bootHand.test.ts`, 15/15 on the tree) and the one-edit plant battery (`instruments/unit-plants.py`, re-run on the final bytes)

| plant | exit | rows red |
|---|---|---|
| clean | 0 | 0 |
| pass-8 hand (median + seed + cap 34), the born-RED | 1 | 4 (25 Hz pace, stall-run ×2, one-frame stall) |
| `median` (minimum → median) | 1 | 3 |
| `noslack` | 1 | 5 (incl. the 15.6/23.4 jitter row) |
| `nofloor` | 1 | 1 (the 4/12 ms jitter row) |
| `nocap` | 1 | 3 |
| `window1` | 1 | 3 |
| `wall` (`clock += dt`) | 1 | 5 |
| `cap34` / `cap37.9` / **`cap38`** | 1 / 1 / **0** | the 25 Hz row's bound 0.95 sits at 38 exactly: −ε reds, the edge passes |
| `slack1.49` / `slack1.51` | 1 / 1 | the jitter row / the ≤ 1.5-frame stall row: the slack is pinned on both sides |

### 2.3 The painted rows (`boot-hand.spec.ts`, 1280×800, tree t3 `index-xRKsh6PGKl3n.js`, load 28–66 at every row)

R is the pace at each arm (native ruling ÷ arm ruling), floor 0.9, the arm named at the rate it DELIVERS. L is the ruled
step on the frame after each injected 120 ms stall over the larger of its four neighbours' steps, bound 4.

| build | engine | R "60" (delivered) | R "30" (delivered) | L per stall | exit |
|---|---|---|---|---|---|
| **tree t3** | chromium | 1.001 (54.6 Hz) | 1.014 (27.0 Hz) | 1.35 / 1.45 / 1.26 | **0** |
| **tree t3** | webkit | 0.993 (47.6 Hz) | 1.004 (25.0 Hz) | 1.61 / 0.85 / 1.03 | **0** |
| `p7clock` (pass 7's flat 17 ms) | chromium | **0.899** (58.1) | **0.470** | 2.24 / 1.32 / 1.51 | 1 |
| `p7clock` | webkit | **0.842** (50.0) | **0.449** (25.0) | 1.57 / 0.99 / 0.80 | 1 |
| `wall` (`clock += dt`) | chromium | 1.002 | 1.007 | 3.66 / **13.00** / **9.62** | 1 |
| `wall` | webkit | 0.997 | 1.001 | **11.68** / **8.47** / **12.04** | 1 |
| `cap3x` (a lost frame travels 3 caps) | chromium | 1.008 | 1.013 | **5.20** / 3.52 / 3.82 | 1 |
| `cap3x` | webkit | 0.998 | 1.002 | 2.66 / 2.59 / 3.93 | **0** (gap 3) |
| `cap1p5x` | chromium / webkit | 1.004 / 1.029 | 1.004 / 0.996 | ≤ 2.40 | 0 / 0 |
| `slack1` (no slack: the minimum alone) | chromium | **0.899** (57.1) | 0.942 | ≤ 2.27 | 1 |
| `slack1` | webkit | 0.932 | 0.915 | ≤ 1.19 | 0 |
| pass-8 hand (median) | chromium / webkit | 0.991 / 1.081 | 0.979 / 0.986 | ≤ 0.97 | 0 / 0 |

**The final bytes, t4 `index-B7aFKR_D7Tjh.js` (the bank's hand), ×6 per engine, load 44–63 at every row:**

| engine | exit 0 | R "60" pace (delivered) | R "30" pace (delivered) | L max (bound 4) | the reds |
|---|---|---|---|---|---|
| chromium | **4/6** | 0.996–1.006 (56.2–58.8 Hz) | 0.998–1.014 (26.8–28.6 Hz) | 2.23 (12/12 runs ≤ 2.23 across both engines) | 2 × **S** on the native arm: 4/56 and 8/56 pose bakes landed inside the ruling, ceiling 0 |
| webkit | **5/6** | 0.963–1.009 on 5; **0.848** on 1 (47.6 Hz) | 0.952–1.083 (25.0 Hz) | 1.38 | 1 × **R** (and S): the 60 Hz arm's wait hit its ceiling (`data-hand-ceiling` 1) and held one frame 174 ms; ruling 2,524 vs native 2,141 ms |

- R and L hold on every run but one. The one R red is a run whose stack wait timed out and whose main thread held a
  174 ms frame inside the ruling: the minimum-keyed hand does not make a stall's time back (that is L), so a held frame
  lengthens the ruling by its interval less one cap. Gap 9 (§0).
- **S reds on Chromium's native arm 2 of 6 on t4, against 0 of 11 earlier Chromium logs** (t2, t3 ×3 and seven hand plants,
  loads 29–96). The hand's edit does not touch the wait (`stacksResident` gates the first stroke; the pace keys only
  frames after it); the bakes that land come in whole four-pose stacks (4, 8). The lane's hypothesis, not read: they are the wordmark's
  stacks after its first, which the wait does not await. Attribution read on the pass-8 bytes at the same hour (§2.3a); gap 9.

- The wall clock's lost frame lands at 42–63 %/s against the M20 hand's 2–10 %/s on the same frames; %/s is printed,
  the per-frame ratio is the gate (a wall hand keeps its running rate across a stall by definition).
- The pass-8 hand is GREEN on every painted row: three isolated stalls cannot show the stall-RUN trap. Only the unit
  rows see it (§2.2), declared.
- The no-slack minimum read **0.898** at load 96 and **0.899** at load 31 on Chromium's 60 Hz arm (two runs, two builds):
  the slack's painted born-RED.

## 3 · Row 5: `frame-halfstroke.spec.ts` re-cut through the ONE probe

- The private `depth()`/`cov()` reader and its strongest-1 % ink estimate are deleted; the spec imports `fourBands` and
  `fmt` from `./lib/edge-bands.mjs` (homes v2). Subject `svg.hand-drawn-grid` (its box is the frame's square on both
  trees: 636 × 636 at 1280×800), edge list `svg.hand-drawn-grid, .grid-ink` (the masked HTML ink here, the svg
  `<image>` ink on `74a2b5d9`), OFF sheet unchanged, strip 8 px out to one px short of the first inner rule.
- The pass-8 clauses map onto the probe's own: **F1 → B6** at `relBand` 0.85 (every band ≥ 0.85 × the deepest; the
  chair's B6 default is 0.5, so the frame passes the spec's own number, not a lane-chosen one) and **F2 → B3** at the
  frame's AUTHORED stroke (12 units × the scale) × 0.9 (pass9/CHAIR-RULINGS §7; SELF's `authoredStroke` roster is not in
  homes v2, so the spec passes the authored width as `thick`). B2 and B4 run at the probe's defaults.
- No PROPOSED edge-bands clause is needed: homes v2 landed B6 (FACE's relative band) with its `#f-uneven` plant.
- The first re-cut keyed the subject on `.grid-ink`, which `74a2b5d9` does not have: the control "red" 12/12 on a missing
  node, a vacuous born-RED. Re-keyed on the svg (both trees); the rows below are the re-keyed spec's.

| rig | tree chromium L / D (min ÷ deepest) | tree webkit L / D | depth t/b/l/r vs stroke (chromium light) |
|---|---|---|---|
| desk 1280×800 fine DPR1 | 0.985 / 0.973 | 0.997 / 0.999 | 7.35 / 7.36 / 7.25 / 7.26 vs 7.63 |
| phone 390×844 coarse DPR2 | 0.993 / 0.995 | 0.998 / 0.998 | 4.13 / 4.10 / 4.12 / 4.12 vs 4.34 |
| 768×1024 coarse DPR1 | 0.997 / 0.997 | 0.997 / 0.999 | 7.60 / 7.60 / 7.61 / 7.62 vs 8.02 |
| 1024×768 coarse DPR1 | 0.999 / 0.999 | 0.999 / 0.999 | 6.89 / 6.89 / 6.88 / 6.89 vs 7.25 |
| 1280×800 coarse DPR1 | 0.973 / 0.985 | 0.999 / 0.999 | 7.36 / 7.16 / 7.25 / 7.25 vs 7.63 |

- **Born-RED on the control** (`:4247`, `74a2b5d9`, the re-keyed spec): Chromium 10/10 clean cells RED at min ÷ deepest
  0.448–0.465, WebKit 10/10 RED at 0.440–0.457 (top and bottom at about half the sides: desk chromium t 3.56 b 4.39 vs
  sides 7.64). Tree exits 0 (12/12) in both engines; control exits 1 in both (the two PLANT rows pass there: the
  control is already red). Load 52–116 across the four runs (a paint row, no timing clause).
- B3's margin is thin and printed: the shallowest band reads 0.94–0.95 of the authored stroke (desk 7.15–7.36 against
  7.63; floor 6.87). The in-run PLANT (the ink clipped 0.9 % top and bottom) reds B6 and B3: chromium desk 0.807, phone
  0.701; WebKit desk 0.698.

## 4 · The chair's hygiene picks, dist identity, π and AA

### 4.1 `.mask-repeat` (T9-R6, the phantom utility) — CURED

- Tailwind minted `.mask-repeat{-webkit-mask-repeat:repeat;mask-repeat:repeat}` from the `mask-repeat: no-repeat`
  declaration in `HandDrawnGrid.vue`'s scoped sheet (the `.boil-frame-bitmap` rule); no template carries the class.
- Cure: the six mask longhands become the two shorthands `mask: center / contain no-repeat` and its `-webkit-` twin (the
  inline `mask-image` the template binds still wins: it is inline). Served CSS against LADDER's clean build of the same
  tree before the edit (`index-DHs860g5jK_C.css`): exactly two differences, the `.boil-frame-bitmap` rule (now
  `-webkit-mask:none 50%/contain no-repeat;mask:none 50%/contain no-repeat`, scoped hash re-minted) and **`.mask-repeat`
  gone**. The six other emitted stylesheets are byte-identical. No utility is minted by this pass's prose: t1 → t3 (the
  hand's comments and the new `paceSlack` doc) moved **0** bytes of served CSS.
- Paint: the frame rows (§3) and the π row (§4.4) read the masked bitmaps on the new rule.

### 4.2 The five `.duration-[var(--motion-*)]` — accounted, not phantom

They are four distinct utilities, each with a `src/` consumer this tree's rung migration wrote (a class string on the element,
never prose; each is a diff line against `74a2b5d9`): `--motion-throw` (`GameBoard.vue:330`, a class constant bound to the board), `--motion-note`
(`GameControlPanel.vue:191`, `StagingBand.vue:154`), `--motion-leave` (`AttributionCard.vue:45`, `DebugToggle.vue:29`),
`--motion-whisper` (`OptionSelector.vue:52`). Six sites, four utilities, each consumed. They are not re-spelled: a
re-spelling would move six transition durations onto scoped CSS for no paint change. If the chair's count of five means
the union's served list, the sixth site is DebugToggle (DEV-gated).

### 4.3 `census.stamp.json` (charter row 10)

Struck from the on-WAVE delta: this pass's delta does not touch it, and the on-WAVE cut carries no stamp (the restamp is
the WAVE's). `check-pw-projects` on the tree exits **0** with the pass-8 stamp (FLOOR BAND ✓; 39 specs, 601 tests) after
this pass's two new rows (fold-verb's skip16, boot-hand's L). The pass-8 stamp rides `pass9.diff` (the whole tree) only.

### 4.4 The control's rows, π and AA

- **The control's boot rows** (`:4247`, `74a2b5d9`, `boot-hand.spec.ts`, load 18.6–19.8): exit 1 in both engines, born-RED
  on W and S as banked: Chromium's wave inks at 412–433 ms, 180–185 ms before its ruling reaches 95 %, with 44/56 bakes
  inside a 461 ms ruling; WebKit's at 646–659 ms with a ruling of 88 ms. L on the control: Chromium **10.56×** on one
  stall (54.5 % of the ruling in one frame, the M20 defect), RED; WebKit GREEN (one stall landed inside an 88 ms ruling,
  3.41×). The T9-B25 loss is these numbers against the tree's 2,680–3,508 ms (§5).
- **π (the served change: one CSS rule, the hand's arithmetic).** `instruments/spec/pi-rest.spec.ts` photographs the board at
  rest on two served builds (one payload, 71 givens), four cells (desk/phone × light/dark), both engines.
  - **Under PRM, final bytes t4 against the pass-8 bytes (LADDER's `dist-bt`): 8/8 cells byte-IDENTICAL, 0 px**; the
    t4-against-t4 floor 8/8 IDENTICAL. The masked element is not a vacuous subject: `instruments/spec/mask-probe.spec.ts`
    reads all four `.boil-frame-bitmap` with a blob mask, `no-repeat` / `contain` / `50% 50%` from the shorthand in both
    engines, one pose at effective opacity 1.000 (636×636), PRM and live.
  - **Live (the boil swaps poses at rest), a phase sample, not a verdict:** t3 against `dist-bt` differed on 3 of 4 cells
    per engine, t4 against `dist-bt` on 2 of 4, and WHICH cells differ moves between runs (Chromium desk light 0 px on
    t3 and 18,342 px on t4) while the counts recur to the pixel (WebKit phone light 52,635 on both reads): a few
    discrete poses, photographed at different beats. The live t4-against-t4 floor (one build against itself): 0 px on 4/4
    cells in Chromium, and **2 of 4 cells differing in WebKit (24,386 and 54,377 px)**, the live photograph's own noise.
  - Against the control `74a2b5d9`, t3 differs on 33–87 k px (pass 8's own movement, not this pass's).
- **AA:** no text surface moved (no template, token or font byte in the delta); `lint:copy` (M16) exit 0 on the tree,
  no user-visible string added. **filterBudget:** no filter-bearing byte moved (the mask rule is not a filter); 9.

## 5 · Leader duties: the INTAKE-23 table (rows 1–16), charter rows 6–9, and the GRAPHITE line

Every row below that says NOT BUILT is a THIRD deferral (U-10). The lane does not dress any as a death: no arm of rows
2, 3, 4, 10, 11, 12, 13, 15 or T9-B24/T9-B26 was built or run this pass, so none is killed on a number. The chair's
BANK ruling on the family at v9 is the law's consequence and the lane does not argue it.

| INTAKE-23 row | state at this return | the number it holds at (source) |
|---|---|---|
| 1 · M20 D1 the hand | **advanced** (§2): minimum-keyed pace, slack 1.5, cap 42 | R 0.993–1.014 t3; t4 ×6 0.952–1.083 on 23/24, 0.848 on 1; L ≤ 2.23 |
| 2 · M20 D2 the layer, both arms | NOT BUILT | intake: band p95 25–29 (tree chromium), not re-read |
| 3 · M20 D3 the point | NOT BUILT | intake: tip/body 1.33–1.60, not re-read |
| 4 · M20 D4 the rubbing | NOT BUILT | intake: span 0.34 em vs ≥ 0.376 em, not re-read |
| 5 · M20 D5 the order and the bakes | held from pass 8, **not clean on t4** | S clause 0 bakes in the ruling on every tree row through t3 and on the pass-8 bytes 3/3; on t4 Chromium native 4/56 and 8/56 on 2 of 6, WebKit's wait hit its ceiling once (gap 9) |
| 6 · M20 D6 `.scene-ruling` | not touched this pass | — |
| 7 · M20 D7 the recorder | the ONE recorder is the chair's (homes v2) | — |
| 8 · M20 D15 the wave waits | held | W clause GREEN on every tree boot row; digits (wave onset) 2,680–3,508 ms from navigation through t3; t4 ×6 2,665–4,384 ms (48 rows; the top is gap 9's ceiling run) |
| 9 · M21-1 the hinge | typed; G-HINGE 3/3 clause sabotage holds in `lint:bands` | painted crossing NOT BUILT (charter row 6) |
| 10 · M21-2 / T9-B24 the Bloom's score | NOT BUILT | intake: R 32/34 settle, not re-read |
| 11 · M21-3 the boil | NOT BUILT | intake: chromium hand-off 1.00/1.44 RED, not re-read |
| 12 · M21-4 the settle | NOT BUILT | intake: R 32/34, not re-read |
| 13 · M21-5 the fence and the PRM cut | NOT BUILT | intake: WebKit sticky 1.08, not re-read |
| 14 · M21 π on the §13 tree | π read for THIS pass's served change only (§4.4) | whole-DOM π on the WAVE union NOT RUN |
| 15 · M21-a/M21-b WebKit cost | NOT BUILT | intake: 382–665 ms max frame cold WebKit, not re-read |
| 16 · M22 theme-color OPTION | **built (pass 8) and READ this pass** (§5.1) | — |

- **Charter row 6 (G-HINGE in paint):** not built. **Row 7:** as the table. **Row 8** (the stack-open move, the late-deal
  regime, G-D12, INTAKE-22 rows 31/32/34/36/41 and chromium's 34 ms, row 37's candidate, T9-B22, goldens 4/4, the
  dark-boot census, ink-rub-out's consumer, 11-vs-9): none run this pass; struck for this pass with that reason (the
  lane's time went to rows 1–5), none re-cited as a reading.
- **Row 9 (T9-B25):** NOT FRAMED. The recorder can see it; the lane did not build the pair. The loss stands as read on
  this pass's boot rows: the first given digit inks 2,680–3,508 ms after navigation on the tree (14 boot rows, both
  engines; 2,665–4,384 ms on t4's 48), against the control's read in §4.4.
- **ACC-GRAPHITE:** the frame holds on the tree at min ÷ deepest band 0.985–1.000 at the five rigs (both themes, both
  engines; §3). It was NOT read on the WAVE union this pass; GRAPHITE's own row 1 owns the union read.

### 5.1 Row 16 READ (`instruments/spec/theme-color.spec.ts`, 1280×800, seven flips from light, load 47–60)

On every flip the probe reads `meta[name=theme-color]`'s content, the computed body background, and the painted page
(a 1×1 screenshot at the viewport's corner), all normalised through one canvas.

| arm | engine | metas | content = body | content = painted | exit |
|---|---|---|---|---|---|
| (b) `VITE_THEME_COLOR=on` build | chromium | 1 on 7/7 flips | 7/7 (`#fbfaf9` light, `#110f0e` dark) | **7/7 EQUAL** | **0** |
| (b) | webkit | 1 on 7/7 | 7/7 | painted `#000000` on 7/7 | 1 |
| (a) the tree (option off, the default) | chromium | **0** on 7/7 | — (no meta) | body = painted 7/7 | 0 |
| (a) | webkit | 0 on 7/7 | — | painted `#000000` on 7/7 | 0 |

- The option, when built, tracks the painted paper on every flip in Chromium; the default ships no meta (the option is
  OFF as pass 8 cut it; the owner turns it on or leaves it).
- **WebKit's painted read is void, the instrument's and not the page's:** it reads `#000000` on every flip of BOTH arms,
  including arm (a), which has no meta and whose body is `#fbfaf9`/`#110f0e`. A 1×1 WebKit clip decodes as zero alpha
  through this probe. WebKit's row is held at content = body (7/7), and the painted leg is a gap (§0 row 8).

## 6 · The bank (LAWS P8 §K; every line from `BANKED.txt`, re-cut at return through temporary indexes)

- **Tree `2b9c277e`** (74a2b5d9 + this pass), equal to the §13 tree's own write-tree at return (`logs/finalize.txt`).
  The two home files are homes v2's blobs (`7629992e`, `f5778ce6`), restored in the work tree before the cut: the
  PROPOSED `stale-rebase` lives only in `PROPOSED-postpaint-stale-rebase.diff`. The scratch vite config was moved to the
  lane's trash before the cut; the tree's 80 changed paths are product paths.
- `pass9.diff` (`--binary`, on `74a2b5d9`): **1,078,172 B**, sha1 `c11143f7`, 80 files, +21,594 / −361; `apply --check`
  **0** on `74a2b5d9` → `2b9c277e`.
- `pass9-verb-delta.diff` (this lane's pass 9 on LADDER's cut `7b2e2839`): **36,644 B**, sha1 `43e27115`, 8 files,
  +246 / −116; **0** on `7b2e2839` → `2b9c277e`. A plain check exits **1** on the §13 section tree `f1c9c3fe` and on
  `2250db29` (neighbouring context from other sections); `--3way` merges both cleanly (0 unmerged), cut as
  `pass9.delta.on-s13-s7-s3.diff` (36,641 B, sha1 `c40a7830`), **0** on `f1c9c3fe` → `4130a007`.
- **On the WAVE union:** this delta lands after LADDER's. `pass9.delta.on-WAVE.diff` is cut on `babea79d` (the union
  `acb9c08e` + `homes.on-WAVE.diff` + LADDER's on-WAVE delta): **36,620 B**, sha1 `ee6aae2e`, 8 files +246 / −116,
  **0** on `babea79d` → **`137dc91f`**; it exits **1** on `acde977b` and on `acb9c08e` alone (LADDER's context). The
  section's one delta on the union + homes v2 is `pass9.s13.on-WAVE.diff` (LADDER's + this lane's, 73,778 B, sha1
  `0cc0b8cb`, 8 files +872 / −148): **0** on `acde977b` → `137dc91f`. On the union the hand constants have one other
  reader, FIVE's fronts, which read `stepMs` only (unchanged at 17).
- `census.stamp.json`: in `pass9.diff` (the tree) only; in no delta.
- Contamination grep (`scratchpad`, `/private/tmp`, `/tmp/`, `.claude/t9-scratch`, `+++` dot-paths): every delta **0**.
  `pass9.diff` has 2 inherited hits, neither this lane's: `+++ b/.github/workflows/ci.yml` (a product dot-dir) and the
  literal `ROOT: "/tmp/lawful-copy"` in `check-motion-bands.mjs` (LADDER's self-test fixture string).
- The pre-return battery on the tree's final bytes and on the on-WAVE tree `137dc91f`: §6.1.

### 6.1 The pre-return battery, BARE, each exit from its own file (`logs/tree.tsv`, `union.tsv`, `unionbase.tsv`, `control.tsv`)

| gate | tree final bytes (`2b9c277e`) | on-WAVE `137dc91f` | union base `babea79d` (no VERB) | control `74a2b5d9` |
|---|---|---|---|---|
| lint:eslint, lint:knip, lint, test:font-coverage, lint:ink, lint:catch, lint:theme-selectors, lint:tdz, lint:lanes, lint:motion, lint:copy, lint:live-regions, test:support-floor, test:e2e:projects, lint:boundary, check-pw-projects, eslint --max-warnings 0 | 0 (17/17) | 0 (17/17) | not run | 0 (17/17) |
| lint:bands | **0** | **0** | not run | 1 (the pass's rows absent at base) |
| lint:verbs | **0** | **0** | not run | 1 (absent at base) |
| lint:theme-tokens | 0 | **1** | **1**, the same 2 bare `--tap-floor` (`ConfirmRibbon.vue:140–141`, T9-R10) | 0 |
| lint:sleep | 0 | **1** | **1**, the same 2 sites (`keys-crib.spec.ts:333/337`) | 0 |
| vitest `src/pencil` | 0 (101) | 0 (160) | — | — |
| vue-tsc -b / typecheck:e2e | 0 / 0 (on homes v2, restored) | — / **2** | — / **2**, the same 9 errors (`zone-grammar.spec.ts`) | — |

The on-WAVE tree's three reds are the union's, read identically on `babea79d` without this lane's delta; none touches
the 8 files of the delta. `lint:bands` on the on-WAVE tree reads B6's history through the §13 tree's gitdir (read-only).

## 7 · Replay route

All scripts are in `instruments/` (copies of the lane's durable-scratch `bin/`); each writes its exit to a file.
1. `git apply --binary pass9.diff` on `74a2b5d9` (or `pass9-verb-delta.diff` on LADDER's cut `7b2e2839`); to read the
   PROPOSED library, apply `PROPOSED-postpaint-stale-rebase.diff` on top (homes v2's `postpaint.mjs` / `.d.mts`).
2. `build.sh <tag>` (a private cacheDir via a scratch config next to `vite.config.ts`, never banked); `build-plants.py`
   builds the tree and the six hand plants (`wall`, `p7clock`, `cap3x`, `cap1p5x`, `slack1`, `pass8hand`), restoring the
   tree byte-for-byte after each (asserted).
3. Serve with `serve.sh` / `swap.sh` (`:4246` the tree, `:4247` the control `w7-control`, PIDs in `pids.txt`).
4. Rows: `pw.sh <tag> <port> <engine> <spec-regex>` with `pw.config.mjs`; batteries `boot-battery.sh`,
   `stage2.sh` … `stage6.sh` (t4: boot/GA1/π, the ×5 boot re-read, the mask probe, live π, the pass-8-bytes boot rows), `rows.sh`; unit `unit.sh` and `unit-plants.py`; postpaint `pp-selftest.sh`; the
   pre-return `prereturn.sh <arm> <fe> [GIT_DIR]`; the bank `bank.sh`.
5. Scratch probes (never banked): `pi-rest.spec.ts` (π at rest, two served builds; PRM unless `PI_PRM=0`),
   `theme-color.spec.ts` (row 16; `ROW16_ARM=b` gates meta = painted), `mask-probe.spec.ts` (the masked element's
   computed mask and effective opacity).
6. Return: `finalize.sh` (kill this lane's listeners by recorded PID after a cwd check, restore homes v2, trash the
   scratch config, `bank.sh`, tree write-tree = banked tree), then `prereturn.sh tree …` and `union.sh`, `digest.sh`.

## 8 · Incidents (self-declared)

1. **Shell `&` for the servers.** `serve.sh`, `swap.sh` and `stage3.sh` start `vite preview` under `nohup … &` (LAWS P8
   §J "the shell `&`"); every listener's PID, wrapper and cwd are in `logs/pids.txt`, and each was killed by PID after a
   cwd check (`logs/pids.txt`).
2. **One git read in main's working tree.** The PROPOSED diff was first cut with `git diff --no-index` run in the lane's
   durable scratch, which sits inside main's working tree, so git discovered main's repository (read-only: `--no-index`
   compares two directories and reads no index). Every other git command ran in the §13 tree through temporary indexes
   (`GIT_INDEX_FILE`), plus `git archive 74a2b5d9` from the §13 tree for the control battery.
3. **A vacuous born-RED, caught.** The first `frame-halfstroke` re-cut keyed `.grid-ink`, absent at `74a2b5d9`: the
   control exited 1 on 12/12 by a null node. Re-keyed on the svg; the vacuous rows are kept in `logs/` and not cited.
4. **The first hand cut (t2: minimum, no slack) red R on Chromium's 60 Hz arm** (0.898 at load 96). Read as a finding,
   not a flake: the slack was added and the no-slack build kept as the plant `slack1` (0.899 again at load 31).
5. **The R threshold plant +ε passed once.** `BOOT_R_FLOOR=1.05` on the tree: Chromium RED (pace 1.003/0.996), WebKit
   GREEN (1.060/1.070) because that run's NATIVE arm was itself slow (2,146 ms, a 59 ms held frame). R is relative to the
   same run's native read; a slow native arm loosens it. Declared (gap 2's sibling).
6. **Load.** The 1-min load read 14.8–96 at row starts; no row opened above 120 (every battery polls for < 120). The
   t2 boot row at 96 is cited as the slack's born-RED only.
7. **Prettier re-shaped the pace line after the rows were read.** `prettier --write` on `bootHand.ts` wrapped the one
   pace expression across lines; `lint:bands`' B13 reader then saw a partial expression and a STALE admitted row (exit 1).
   The expression was split into two statements (`floored`, then the cap) with one admitted row each; `lint:bands` 0.
   Same arithmetic, new bytes: the unit plants were re-run on them (same 12 reds), the build re-cut as t4
   (`index-B7aFKR_D7Tjh.js`), and boot, GA1 and π re-read on t4 (§2.3, §1.3, §4.4).
8. **The first bank was cut before that edit** (tree `b2cac6dc`) and the section's combined on-WAVE diff was cut by hand
   outside `bank.sh`. Both re-cut at return by `bank.sh`, which now cuts `pass9.s13.on-WAVE.diff` too; §6 cites only
   the re-cut.
9. No commit, no stash, no push, no npm install, no deploy, no `rm` (discards moved to the lane's `trash/`).
