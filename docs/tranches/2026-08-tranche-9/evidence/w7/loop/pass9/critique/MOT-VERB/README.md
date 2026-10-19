# MOT-VERB · pass 9 CRITIQUE (§13, the motion verbs)

Non-author critic. The prototype's README is `pass9/prototype/MOT-VERB/README.md`; the number below is mine (LAWS P8 §C).
Every row was re-derived on a `git archive 2b9c277e` scratch under the lane dir `crit-MOT-VERB` of the durable scratch root
(git-inited, no commit, so Tailwind's source scan honours `.gitignore`), served on `:4246` beside the control `w7-control`
(`74a2b5d9`, `index-CubiZsMVSwTc.js`) on `:4247`. Apply checks ran through temporary indexes in the §13 worktree's repo; no
git on main or in the control tree. Instruments: `instruments/` beside this file. Transcripts: `logs/`.

## 1 · Identity and apply, re-derived (`logs/applycheck.txt`, temporary indexes, 18:23, load 26)

| read | result |
|---|---|
| bank sha1s | `pass9.diff` `c11143f7`, `pass9-verb-delta.diff` `43e27115`, `pass9.delta.on-WAVE.diff` `ee6aae2e`, `pass9.delta.on-s13-s7-s3.diff` `c40a7830`, `pass9.s13.on-WAVE.diff` `0cc0b8cb`: all equal BANKED.txt |
| `74a2b5d9` + `pass9.diff` | apply 0 → **`2b9c277e`** = BANKED.txt |
| `74a2b5d9` + LADDER `pass9-ladder.diff` (`986627cc`) | → `7b2e2839` (LADDER's cut); + `pass9-verb-delta.diff` → **`2b9c277e`** |
| the §13 worktree as it sits, `add -A` into a temporary index | **`2b9c277e`** (nothing moved since the bank) |
| `74a2b5d9` + `pass8/integrate/WAVE.diff` | → `acb9c08e` |
| `acb9c08e` + `pass9.delta.on-WAVE.diff` (bare union) | **exit 1** |
| `acb9c08e` + `homes.on-WAVE.diff` | → `acde977b`; + `pass9.delta.on-WAVE.diff` **exit 1** |
| `acde977b` + LADDER's on-WAVE delta | → `babea79d`; + `pass9.delta.on-WAVE.diff` → **`137dc91f`** |
| `acde977b` + `pass9.s13.on-WAVE.diff` (LADDER + VERB) | → **`137dc91f`** |
| `74a2b5d9` + `s13-s7-s3.diff` → `f1c9c3fe`; + `pass9.delta.on-s13-s7-s3.diff` | → **`4130a007`** |
| 13 homes paths, `2b9c277e` vs `d17813ba` (`74a2b5d9` + `homes.diff` `1f70cfda`) | **13/13 blob-equal**: homes v2 by sha, no residual home edit |
| delta paths (all three cuts) | the same 8 product paths; no home path, no `census.stamp.json`, no scratch config |
| contamination grep on the deltas | 0 (`scratchpad`, `/private/tmp`, `/tmp/`, `t9-scratch`, `+++ b/.`) |
| imports in the delta | one: `./lib/edge-bands.mjs` (relative product path); nothing from `docs/` |
| my build of `2b9c277e` (git-inited archive) | every emitted file **byte-identical** to the lane's t4 dist (`index-B7aFKR_D7Tjh.js`, `index-CWSu8UjaY2lb.css`) |

The on-WAVE delta lands only on the union + homes + LADDER; the §13 pair (`pass9.s13.on-WAVE.diff`) lands on union + homes.
That is lawful for a lane that runs second on a shared tree, and it is how the WAVE has to stack them: LADDER first.

Build incident (mine): my first build from a bare `git archive` minted a different CSS (Tailwind's auto source scan does
not honour `.gitignore` without a repo). Those four dists were trashed and rebuilt after `git init` in the scratch copy; every
row below reads the rebuilt, lane-identical bytes.

## 2 · The hand's unit rows: the plants re-run, and the critic's threshold plants (`logs/unit.tsv`, load 32–39)

`bootHand.test.ts` (15 rows) on the bank, one edit per plant (`instruments/plant.py`, every edit asserted to hit once):

| plant | what it is | exit | rows red |
|---|---|---|---|
| clean | the bank | 0 | 0 |
| `p8hand` | **the pass-8 hand first** (median, seed, cap 34) | 1 | 12 lines (4 rows) |
| `wall` | `clock += dt` | 1 | 10 lines |
| `p7clock` | pass 7's flat 17 ms | 1 | 14 lines |
| `slack3` / `slackx2` | `paceSlack` 3 / 2 | 1 / 1 | 2 / 1 rows |
| `cap37` | `maxStepMs` 42 → 37 (−ε side) | 1 | the 25 Hz pace row |
| **`cap60`** | `maxStepMs` 42 → 60 | **0** | **none** |
| **`cap100`** | `maxStepMs` 42 → 100 | **0** | **none** |
| **`window2`** | `paceWindow` 5 → 2 | **0** | **none** |
| `window50` | `paceWindow` 5 → 50 | 0 | none |

The lane's claim "the unit rows pin the cap exactly" and "the slack and the cap pinned ±ε" holds on the slack (both sides)
and on the cap's LOWER side only. The cap is unpinned upward and the window is unpinned: the stall-run rows read their bound
FROM the constant they test. "Every stall of a run shorter than the window travels one cap" takes its run length from
`MOTION.hand.paceWindow - 1`, and "a run that fills the window ... never past maxStepMs" takes its bound from
`MOTION.hand.maxStepMs`. Both cite themselves (the circularity on the checklist).

- `window2` is ACC-FIVE's stall-run trap brought back. The second 150 ms stall of a run reads a window of [150, 150] and
  travels the 42 ms cap: 2.5 frames at 60 Hz. All 15 rows stay GREEN.
- `cap100` lets every stall of a run of five or more travel 100 ms, six 60 Hz frames, and it is also GREEN.
- The painted L leg cannot see either one. Its three stalls are isolated (§3), and a painted stall travels at most the cap,
  so a 4× bound over a 16.7 ms neighbour admits anything up to ~67 ms.

So the class (a lost frame never teleports the hand, for every run) is cured for the lane's plants, not for the class
(registry-v8 §2.12): it is OPEN. Whether `lint:bands`' value roster reds these retunes is §2.1.

### 2.1 What does hold those retunes: the value roster, not a behaviour row (`logs/bands.tsv`)

`lint:bands --self-test` on the same plants (git objects read through the §13 tree's gitdir, read-only): clean exits 0.
`window2`, `cap60` and `slackx2` each exit **1** on `B2 CLOSED`, because each EXEMPT row licenses ONE value
(`MOTION.hand.paceWindow ships 2; its EXEMPT row says ms: 5`). `slackx2` also reds `B6 RATCHET`. So none of these
retunes lands SILENTLY. But the thing that holds them is a change detector on the constant's value. A reviewed retune
re-types the roster row, and then nothing behavioural reds `window2` or `cap100`. LAWS P8 §F says a gate keys the
precondition, not the property. Here it is the reverse: the property gate (the unit rows) cites the precondition. The cure
is one line per row. Type the stall-run row's run length and bound as literals (run 4 at 60 Hz; each stall ≤ 1.5 × 16.7 ms,
and ≤ 42 ms when the window is full), so that a reviewed retune has to re-type the BEHAVIOUR as well. `lint:copy` (M16) on
the tree: exit 0.

## 3 · Row 5 re-derived in paint: the frame (`frame-halfstroke.spec.ts` as banked, both engines, 5 rigs × 2 themes)

| served | engine | min ÷ deepest band, 10 cells | in-run clip plant (0.9 %) | exit | load (start/end) |
|---|---|---|---|---|---|
| tree `2b9c277e` | chromium | **0.978–0.999** | RED, 0.784 desk / 0.721 phone | **0** (12/12) | 41.4 / 33.9 |
| tree | webkit | **0.997–1.000** | RED, 0.704 / 0.709 | **0** (12/12) | 33.9 / 38.8 |
| control `74a2b5d9` | chromium | **0.439–0.463**, RED 10/10 | (red already: 0.452 / 0.451) | 1 | 38.8 / 33.1 |
| control | webkit | **0.440–0.459**, RED 10/10 | (0.440 / 0.445) | 1 | 33.1 / 27.5 |

This reproduces the lane's 0.973–1.000 against 0.440–0.465 to within 0.005. The born-RED is not vacuous: the control
reads the same `svg.hand-drawn-grid` box (636 × 636 at the desk), and its top and bottom depths are 3.4–4.4 px against
sides of 7.63. **Measurement 1 of 2 re-derived: MATCHES.**

Holes in the re-cut (§3.1 has the clip sweep):
- **`thick: want` is hand-typed.** The spec passes the frame's authored width as `thick` itself. LAWS P8 §E says "No lane
  re-parameterises `thick:` by hand — the instruments lane adds `authoredStroke` to edge-bands". CHAIR-RULINGS §7
  scopes the authored-width floor to a named roster (HandDrawnOutline on the wells and head sheets), and the board frame
  is not on it. The floor typed here (6.87 px) is STRICTER than the law's 1.80, so nothing is loosened. But it is a
  lane-chosen parameter that the ONE library does not own, so it is not a closure.
- **`relBand: 0.85` is lane-chosen** (the probe's default is 0.5). The control reds at either value. Whether the gate's
  class (a top/bottom stroke thinner than the sides) is pinned below 15 % loss is §3.1's sweep.

### 3.1 The critic's clip sweep: MY plant was vacuous, and so declared

`crit-frame.spec.ts` (a scratch copy of the banked spec, with the plant's clip read from `CV_CLIP`; every rig, light).
At a clip of 0.3 % and of 0.15 %, every cell read the CLEAN depths (chromium desk t 7.20 / b 7.36, the same as unplanted).
On the tree the frame's outer edge sits about 4 px inside the box, so a clip under ~0.6 % of the box removes no ink. It
is a positional plant, not a thinning plant. Those 4 runs (exit 1, "the gate is blind") are MY vacuous plant, not a
hole in the gate. B3's margin is the real measure of how tight the gate is: the clean top band reads 7.20 against an
authored floor of 6.87 (chromium desk), so a loss of ~0.35 px (4.6 %) of the top stroke reds it. The gate is tight. Its
floor is hand-typed (§3).

The 0.7 % clip (a real thinning) reds every rig in both engines, and every red is **B3** (chromium desk: top 6.79 <
6.87; webkit desk: 6.32). Its min ÷ deepest is 0.927–0.937 on Chromium desk, laptop and tablet 768, so **B6 at 0.85 is GREEN
there**. The gate's teeth are the hand-typed `thick:`, not the relative band. Exit 0 (5/5 plant rows red) per engine, load
22–52.

## 4 · The chair's picks for this family (CHAIR-RULINGS §9), judged

| pick | verdict | read |
|---|---|---|
| `kPaint` not folded as cut | **MET** | homes v2's postpaint blobs are in the tree unchanged (§1). The lane's re-cut, `stale-rebase`, is PROPOSED only (`PROPOSED-postpaint-stale-rebase.diff`, sha1 `37adb2cb`). No non-author run of its self-test exists yet, so it cannot fold until pass 10's batch 0 (§9: "a diff whose self-test does not reproduce in both engines on a non-author run is not folded"). |
| `census.stamp.json` struck from the delta | **MET** | 0 hits in all three delta cuts. It rides `pass9.diff` (the whole tree) only. |
| the `.mask-repeat` phantom | **MET** | the served CSS of `2b9c277e` has no `.mask-repeat` rule. `.boil-frame-bitmap` carries `mask:none 50%/contain no-repeat` and its `-webkit-` twin. |
| the five `.duration-[var(--motion-*)]` | **MET as accounted** | 4 distinct utilities are emitted once each (`throw`, `note`, `leave`, `whisper`). Each has a class-string consumer in `src/`, 6 sites in all, and none is minted from prose. The chair's "five" is not reproduced: there are 4 utilities, or 6 sites. |

## 5 · Row 1 re-derived: GA1 on the bank's library (homes v2, no PROPOSED), `fold-verb.spec.ts` as banked

| run | engine | clean cells (4) | PLANT skip (F1) | PLANT skip16 (F1ct) | PLANT f2 (CI) | exit | load |
|---|---|---|---|---|---|---|---|
| w1 | webkit | 4/4 GREEN; F1 ct 0, every 1280 frame-1 post read stale → in-RAF twin | **GREEN, "the gate is blind"** (CI off 150 is RED but not the asserted clause) | **GREEN, blind** (CI off 16) | RED (ciRed) | **1** | 35.1 |
| w2 | webkit | 4/4 GREEN, stale 1 on all 4 | **GREEN, blind** | **GREEN, blind** | RED | **1** | 30.9 |
| c1 | chromium | 4/4 GREEN, stale 0 | RED (f1red, ct 150) | RED (f1ct, ct 16) | RED | **0** (7/7) | 28.0 |

**Measurement 2 of 2 re-derived: the lane's gap 1 is CONFIRMED and it is WORSE than declared.** The lane read skip16 RED
on its one homes-v2 read ("frame 1 not stale on that run"). On mine, skip16 is blind on **2/2** WebKit runs as well. So on
the library the bank ships, the F1 clause is blind in WebKit to BOTH frame-1 plants (150 ms and one frame). Only CI's
k = 2, 3 offset sees them. The banked spec exits 1 in WebKit every time. The cure, `stale-rebase`, is PROPOSED and was
not read by anyone but its author. Per CHAIR-RULINGS §9 it cannot fold before pass 10's batch 0. Charter row 1
("GA1 then re-read 20/20 per engine ... in-run") is therefore NOT closed on the bank. It is closed only on a
lane-library hybrid that no one can ship today.

## 6 · Rows 3–4 in paint: `boot-hand.spec.ts` as banked, 1280×800, both engines (`logs/rows.txt`, load 21.5–52.5 at every row start)

| served | engine | runs | exit 0 | R pace "60" (delivered) | R pace "30" (delivered) | L max (bound 4) | reds |
|---|---|---|---|---|---|---|---|
| tree `2b9c277e` | chromium | 6 | **5/6** | 0.967–1.008 (48.1–58.5 Hz) | 0.998–1.005 (27.0–28.4 Hz) | 2.07 | **1 × S native, 4/56 bakes under the hand, ceiling 0** (run 1) |
| tree | webkit | 3 | 3/3 | 0.985–1.027 (47.6 Hz) | 0.968–1.024 (25.0–25.6 Hz) | 1.57 | none |
| control `74a2b5d9` | chromium | 1 | 0 (born-RED) | 1.036 | 1.732 (a 266 ms ruling) | **20.15** | W ×3 (wave 189–298 ms before 95 %), S (44/56 bakes), L |
| control | webkit | 1 | 0 (born-RED) | **0.724** | **0.706** | — | W ×3, S, R; **L red by its vacuity guard** (ruling 0 ms, < 2 stalls), not by a teleport |
| **`p8hand`, the pass-8 hand FIRST** | chromium | 1 | **0, GREEN** | 1.030 | 1.011 | 1.04 | none: the painted rows cannot see the stall-run trap |
| `p8hand` | webkit | 1 | **0, GREEN** | 1.030 | 0.936 | 0.96 | none |
| `wall` (`clock += dt`), L only | chromium | 1 | RED | — | — | **7.19 / 10.64 / 7.20** | L |
| `wall`, L only | webkit | 1 | RED | — | — | **12.18 / 8.45 / 11.60** | L |
| `p7clock`, R only | chromium | 2 | RED (on "30") | **0.907 GREEN** (59.5 Hz) / 0.890 RED (57.8 Hz) | 0.467 / 0.473 | — | R 30 on both runs; R 60 on 1 of 2 |
| `p7clock`, R only | webkit | 1 | RED | 0.867 (50.0 Hz) | 0.465 | — | R 60 and R 30 |

- R and L on the tree reproduce the lane's ranges (0.952–1.083, L ≤ 2.23). The wall plant reds L in both engines at
  7.2–12.2×, which matches the lane's 8.47–13.00×. Charter row 4's wall leg is **MET**.
- **Charter row 3 says "p7clock RED on every arm". It is NOT MET.** On Chromium's 60 Hz arm, pass 7's clock read pace
  **0.907, GREEN**, on one of my two runs (59.5 Hz delivered). The lane's gap 2 calls this "a red by ε". On my read it
  is a coin toss: at ~59 Hz a flat 17 ms step loses only 1–2 % against the native panel. A rate floor at 0.9 cannot
  separate a 17 ms clock from the hand on a panel delivering 59 Hz. The plant is weak there by construction, not by
  noise. The chair can rule the arm unreadable. The lane cannot call it closed.
- **The pass-8 hand (the plant charter row 3–4 re-cut against) is GREEN in paint, both engines.** This matches the lane's
  declaration. The class it was re-cut for (a RUN of stalls) is seen only by the unit rows, and §2 shows those rows cite
  `paceWindow`/`maxStepMs` themselves. So the stall-run class is held by a value roster, not by any behaviour gate.
- **Gap 9 is reproduced, not attributed.** The final bytes red S on Chromium's native arm on 1/6 of mine and 2/6 of the
  lane's: **3 of 12** across both sets, every one 4 or 8 bakes landing inside the ruling with the ceiling at 0. The lane
  saw 0/11 on earlier builds and 3/3 clean on the pass-8 bytes. The banked boot gate is not clean on the banked bytes.
  An S red means pose encodes running under the hand: the M20 D5 defect the row exists to forbid. The lane's hypothesis
  (the wordmark's later stacks, which the wait does not await) is unread.

## 7 · Constraints

- **π vs `74a2b5d9`:** this lane's served change is one CSS rule (`.boil-frame-bitmap`'s mask shorthands, plus the dropped
  `.mask-repeat`) and the hand's arithmetic. My build is byte-identical to the lane's t4, so the lane's π rows (under PRM,
  8/8 cells byte-identical to the pass-8 bytes) read the same bytes I served. **I did not re-derive π.** The live π is a
  phase sample (the lane's own t4-vs-t4 floor differs on 2/4 WebKit cells), so it decides nothing. Against the control,
  π is pass 8's movement and the lane does not claim it.
- **AA:** no template, token, string or font byte is in the delta. `lint:copy` (M16) exits 0 on the bank (mine).
- **filterBudget 9:** the delta adds no CSS or SVG filter (its only `filter` tokens are two JS `Array.filter` calls in
  the spec). Unchanged.
- **@property law:** no `@property` in the delta.
- **Ballot pair on one payload:** no frame is filed (`frames: []`). T9-B25 is unframed (charter row 9 open). The ballots
  (`paceSlack` 1.5, the theme-color option) carry no picture.
- **Frames looked at:** none exist to look at.
- **An edit to another family's gate:** the lane widened LADDER's RETUNE validator to accept a `consumer` subject, to admit
  its own row. It calls this a one-token cure and declares it. It is still a gate re-worded so the editor's own row
  passes, even if the message already prescribed the subject. LADDER's critic or the chair has to ratify it.
- **A ratio is read as a clock:** the roster reads `paceSlack` (1.5) as a "1.5 ms clock" and licenses that read with a
  RETUNE row. The roster has no type for a ratio. That is a legacy alias in the motion ledger: a ratio carried as a time.

## 8 · The charter's rows, judged

| row | state | why |
|---|---|---|
| 1 frame-1 key | **OPEN** | On the BANK (homes v2), F1 is blind in WebKit to PLANT skip AND skip16, 2/2 runs (§5), and `fold-verb.spec.ts` exits 1. The cure is PROPOSED, read by its author only, and cannot fold before pass 10's batch 0. |
| 2 flush lag | **attributed, not re-derived by me** | consistent: every WebKit 1280 cell read stale 1 with the in-RAF twin at ct 0 |
| 3 R at 0.9, p7clock red on every arm | **OPEN** | Chromium "60": p7clock GREEN 0.907 on 1 of 2 (§6) |
| 4 painted row sees M20 | **MET for the wall plant; the class is OPEN** | the pass-8 stall-run hand is GREEN in paint; the unit rows cite `paceWindow`/`maxStepMs` (`window2`, `cap60`, `cap100` all GREEN; §2) |
| 5 frame through `fourBands` | **MET in paint, with a lane parameter** | tree 0.978–1.000 vs control 0.439–0.463, both engines (§3). `thick:` is hand-typed, and it carries the gate's teeth: at a 0.7 % clip, B6 at 0.85 admits Chromium desk/laptop/tablet (0.927–0.937), and only B3 at the typed floor reds. |
| 6 G-HINGE in paint | **NOT BUILT** | |
| 7 INTAKE-23 rows 2, 3, 4, 10–13, 15, B24, B26 | **NOT BUILT: third deferral** | the charter's own text: "a third deferral is a BANK ruling on the family at v9" |
| 8 pass-8 rows 10–14 | **NOT RUN** | none re-cited |
| 9 T9-B25 | **NOT FRAMED** | the loss is read: the first digit inks at 2,523–3,296 ms on the tree (27 boot rows, both engines) against 310–696 ms on the control (6 rows) |
| 10 census stamp | **MET** | |
| 11 pre-return bare | lane's, on tree and union | mine: `lint:bands` 0, `lint:copy` 0, unit 15/15 on the bank; the union's 3 reds are the union's (lane, unread by me) |
| GRAPHITE line | **not read on the WAVE union** | the frame holds on the tree only |

## 9 · The number: **85, BANK**

The pass-9 advance is real and re-derived:
- the minimum-keyed hand (the FIVE trap closed at window 5; the wall plant RED in paint in both engines at 7–12×);
- the frame re-cut through the ONE probe (0.978–1.000 against the control's 0.439–0.463, both engines, five rigs);
- the chair's four hygiene picks met;
- a lane-identical dist.

Each gain is offset by a hole found or confirmed on the bank:
- the banked GA1 spec is red in WebKit, and F1 is blind there to both frame-1 plants;
- p7clock passes Chromium's 60 Hz arm;
- the stall-run class sits on rows that cite their own constants (`window2`/`cap100` GREEN);
- the boot gate reds S on the banked bytes 3/12;
- the frame's teeth are a hand-typed `thick:`.

The number holds at v8's **85**. It does not rise. The verdict is **BANK** on the charter's own law: INTAKE-23 rows 2, 3, 4,
10, 11, 12, 13, 15 and T9-B24/B26 are unbuilt for the third pass running (U-10, charter row 7), along with G-HINGE in paint
(row 6), the pass-8 sub-rows (row 8) and T9-B25's frame (row 9). The lane says so itself.

## 10 · Open gaps (exact)

1. **GA1 on the bank:** WebKit F1 is blind to PLANT skip and skip16 on homes v2 (2/2), and `fold-verb.spec.ts` exits 1 in
   WebKit. The cure, `PROPOSED-postpaint-stale-rebase.diff`, is author-read only. It needs a non-author self-test in both
   engines at pass 10's batch 0. Its rebase infers frame 1's clock from a later read. A seek between frame 1 and the post
   read is a disjunct it has not planted.
2. **R at 0.9 cannot red p7clock on a ~59 Hz Chromium arm** (0.907 GREEN, 1 of 2). The chair rules the arm unreadable,
   or the row gains a plant the rate floor can see.
3. **The stall-run class is self-cited in the unit rows:** `paceWindow` 5→2 and `maxStepMs` 42→60/100 are GREEN on all 15
   rows. Only `lint:bands`' value roster (B2 CLOSED) holds them. The cure is to type the run length and per-stall
   bounds as literals.
4. **The painted L leg cannot see a stall RUN** (the pass-8 hand is GREEN in both engines), nor a cap ≤ ~4 frames.
5. **The S clause reds on the banked bytes:** Chromium native, 3 of 12 runs (lane 2/6, critic 1/6), 4–8 bakes under the
   hand. Unattributed.
6. **The frame's floor is a hand-typed `thick: want` (LAWS P8 §E), and it carries the gate's teeth.** B6 at a lane-chosen
   0.85 admits a 0.7 % top clip in Chromium (0.927–0.937). The ONE library's `authoredStroke` roster does not cover the
   board frame (CHAIR-RULINGS §7).
7. **Row 16's painted leg is unread in WebKit** (lane gap 8; not re-read).
8. **INTAKE-23 rows 2, 3, 4, 10–13, 15, T9-B24, T9-B26 are unbuilt (a third deferral). G-HINGE in paint is unbuilt.
   Charter row 8's sub-rows were not run. T9-B25 is unframed.** GRAPHITE's frame is not read on the WAVE union.
9. **The edit to LADDER's RETUNE validator** (it now accepts `consumer`) needs ratification from outside this lane. The
   ratio-as-clock read of `paceSlack` is a type hole in the roster.
10. **`paceSlack` 1.5 is a fitted constant** (the ballot the owner has not seen). Pinned ±ε by the unit rows (confirmed
    by `slackx2`/`slack3` RED).

## 11 · Incidents (mine, self-declared)

1. **The first four builds came from a bare `git archive`** and minted a different CSS (Tailwind's source scan ignores
   `.gitignore` without a repo). They were trashed and rebuilt after `git init` (no commit) in the scratch copy. Every row
   reads the rebuilt, lane-identical dist.
2. **The first frame battery was void:** the scratch Playwright config sat outside a `node_modules` resolution root, so
   all 4 runs exited 1 with `ERR_MODULE_NOT_FOUND` and read nothing. The logs were moved to trash and are not cited. Those
   runs were re-done.
3. **My 0.3 % and 0.15 % clip plants were vacuous** (§3.1). They are declared, and they are not a finding against the gate.
4. **Servers ran as `run_in_background` tasks, not shell `&`.** Every PID was recorded with its cwd (`logs/pids.txt`) and
   killed by PID after a cwd check (`logs/kills.txt`). The `REFUSED` lines are the npx wrapper's child, which had already
   exited with its parent (empty cwd). No listener remains on 4246 or 4247.
5. **The lint:bands battery read git objects through the §13 tree's gitdir (`GIT_DIR`, read-only).** Apply checks used
   temporary indexes in that repo. There was no git on main or in the control tree, and no commit, stash, push,
   npm install, deploy or `rm`. Discards are in the lane's trash.
6. **The box:** the 1-minute load was 21.5–52.5 at every row start (each battery polls for < 120). No row opened above 120.

## 12 · Replay route

`instruments/`: `applycheck.sh` (§1); `build.sh <plant>…` (an archive copy with `git init`, `plant.py`, a private
cacheDir); `unit.sh <plant>…` (§2); `bands.sh <plant>…` (§2.1); `serve.sh <tag>|control` (launch as a background task),
`swap.sh` (kill by PID after a cwd check); `pw.sh`/`seq.sh` with `pw.config.mjs` (it must sit inside the archive's
`web/frontend` as `crit-pw.config.mjs`); `make-crit-frame.py` (§3.1's scratch spec). Rows: `logs/rows.txt`; exits:
`logs/exits.txt`; plants: `logs/plants.txt`, `logs/unit.tsv`, `logs/bands.tsv`.
