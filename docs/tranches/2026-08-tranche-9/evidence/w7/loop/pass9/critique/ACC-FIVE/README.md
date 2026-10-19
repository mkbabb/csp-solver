# ACC-FIVE · pass 9 · critique (§3 accent)

Critic, not the author. The number is mine (LAWS P8 §C). Base and π control `74a2b5d9`. Tree served on `:4236` (a
`git archive` of the lane's bank tree `2d13eaf1` under my durable scratch, node_modules symlinked, private cacheDir);
control `w7-control` dist on `:4258` (`index-CubiZsMVSwTc.js`, read by curl at open). Both started by me and killed by
recorded PID after a cwd check. Box load printed per row; every timing row opened under 120.

## 0 · Numbers first

- **Pass-9 number: 80 (↓5 from 85). Verdict: ADVANCE**, with row 1 RE-OPENED. The cure the batch gate asked for landed as
  written (window minimum + stall-run rows, re-derived GREEN, born-RED on the pass-8 file in both engines), but it re-opens
  the 30 Hz class the observed cap was minted to cure. The window holds tween ticks, every tween's FIRST tick is a partial
  frame (pencil-boil stamps `startTime = performance.now()` at `start()`), and one partial under `stepMs` pins
  `Math.min(window)` below `stepMs` for the next 32 front frames — idle time never ages it out.
  - Unit probe (`instruments/crit.partial30.test.CRITIC.ts`): tree **6 of 6 RED** (a 240 ms front started 2/5/9/12/16 ms
    into a 30 Hz frame ends on frame **15**, the constant-17 cap's number); the pass-8 file (median of nine) **7 of 7 GREEN**;
    the whole-frame negative control GREEN on both (frame 10).
  - Driven row (`instruments/crit5-partial30.spec.ts`, the rate-clock's DRIVEN clock at 30 Hz, the served tree's own
    `frontTween`): tree frame **11/14/15** with **10/10, 13/13, 13/13, 14/14** 30 Hz frames travelling 17.0–24.0 ms of 33;
    the pass-8 file frame **10** in all four arms (both engines, offsets 6 and 15 ms), every frame after the fourth
    travelling the whole 33.0–33.3. Even a start INSIDE a frame (offset −1) reads 23.0 ms of travel per frame in WebKit:
    a stale partial from the page's load tweens was still in the window 1.5 s later.
- **Re-derived, both engines** (my servers, my runs): D10-stallrun 5 and 9 stalls exit 0, travel 17.0 ×n, margin 1.000 ms;
  born-RED on c3a863f7's gridPaths.ts (§2). G10-panel 13/13 streams met at 0.9 × A.6's best, margins +2.995 to +6.250/s;
  `G10_PANEL_SHARE=1.01` exit 1, all 13 streams RED by −0.300 to −0.625/s. Every number agrees with the lane's.
- **The bank reproduces**: `pass9.diff` sha1 `ef3325cd…`, 637,487 B, applies 0 on `74a2b5d9` → `2d13eaf1` (= the tree's
  temporary-index cut, 33 paths); `pass9.delta.on-WAVE.diff` sha1 `2017beb6…`, 26,920 B, apply --check 0 on `acde977b`
  (→ `ff4cac9f`), on bare WAVE `acb9c08e` and on s13-s7-s3 `f1c9c3fe`. homes v2 by sha: `homes.diff` `1f70cfda` on
  `74a2b5d9` → `d17813ba`, `homes.on-WAVE.diff` `a0f8e6f3` on `acb9c08e` → `acde977b`; `git diff d17813ba 2d13eaf1` over
  the 13 home paths is EMPTY (no residual home edit). Both banks grep 0 for scratchpad, `/private/tmp`, `/tmp/`,
  `.claude/t9-scratch` and `+++ …/.` paths.
- **The advance** (`c3a863f7` → `2d13eaf1`, 19 paths, +3,454/−217): 13 of them are homes v2. The product delta is two files:
  `gridPaths.ts` (median of 9 → minimum of 32, +18/−13 incl. comments) and `DifficultyTally.vue` (one call deleted). The
  rest is spec/unit text (`front-rate.spec.ts` +122, `gridPaths.poseFronts.test.ts` +70, `node.d.ts` +5, two
  `@ts-expect-error` lines).

## 1 · Row 1 (the batch gate): LANDED as asked, and the class it re-opens

**Met as the chair worded it.** `panelFrameMs` is `Math.min` over the last 32 one-per-frame ticks; the stall-run unit rows
(n = 1, 4, 5, 9, the 31/32 cliff, the 60 → 30 Hz cost) and the driven `D10-stallrun` row are in the tree and on the union
delta (`ff4cac9f`'s `panelFrameMs` is byte-equal in body to the tree's). I re-ran the unit rows on the tree (all GREEN) and on
c3a863f7's `gridPaths.ts` (4 of the lane's 6 rows RED: n = 5, n = 9, the cliff, 60 → 30; n = 1 and n = 4 are GREEN on the
pass-8 file, as they must be). The by-sha ride of `frontGate`/`frontTween` is lawful under CHAIR §6 from here. **It should not
be taken yet** (§1.1).

**The re-derived driven row** (`logs/d10-*.log`):

| arm | chromium | WebKit | load (1-min, start–end) |
|---|---|---|---|
| tree, 5 stalls | exit 0: travel 17.0 ×5, cap 18.00, margin 1.000 ms, shortest healthy tick 6.7 | exit 0: 17.0 ×5, margin 1.000, shortest 6.0 | 76.2–75.2 / 75.2–72.8 |
| tree, 9 stalls | exit 0: 17.0 ×9, margin 1.000 | exit 0: 17.0 ×9, margin 1.000 | 72.8–74.4 / 74.4–70.6 |
| born-RED: c3a863f7's gridPaths.ts served | **exit 1**: 17.0 ×4 then **149.9**, margin −131.9 | **exit 1**: 17.0 ×4 then **150.0**, margin −132.0 | 68.0–65.5 / 65.5–73.6 |
| control `74a2b5d9` dist :4258 | exit 1: `Failed to fetch dynamically imported module …/src/pencil/grid/gridPaths.ts` | exit 1: `Importing a module script failed` | 73.6–74.3 / 74.3–75.4 |

Restored byte-equal by `cmp` at 12:06:14. The lane's threshold (±0.1 ms) and vacuity plants were not re-run by me; the margin
of exactly 1.000 ms on every clean arm is the slack itself (travel = stepMs exactly), so the ±ε pair is what pins it, and
its numbers stand as the lane's.

### 1.1 THE HOLE: a partial first tick pins the minimum, and a 30 Hz panel runs at half speed (the pass-7 class, back)

`frontTween` feeds `panelFrameMs` the tween's own `dt = t − prev`, with `prev = 0` at `start()`; pencil-boil 0.12.0 stamps
`startTime = performance.now()` in `start()` (dist/index.js:700). A front started BETWEEN frames — a watcher, an input
handler, the tally's `runDrawIn` — gets a first tick of 0 < dt < one frame. The one-reading-a-frame key admits it whenever
no other tween ticked first in that frame (any front starting from idle). Under the median of nine it was one outlier; under
the minimum of 32 it IS the panel: the cap `max(stepMs, min)` falls to `stepMs` = 17 for the next 32 FRONT frames, and the
window only advances when a front ticks, so an idle page never ages it out. Partials are not the only short ticks: the
D10 row's own print, "shortest healthy tick 6.0–9.0 ms" between consecutive frames of a 60 Hz page (my re-read: 6.0–6.9),
shows the engines deliver sub-frame intervals too. Each one, at any refresh rate, sets the cap to `stepMs` for 32 front
frames; at 60 Hz that is harmless, at 30 Hz it halves the front.

**Unit probe** (`instruments/crit.partial30.test.CRITIC.ts`, `instruments/unit.sh`, `logs/unit.*.log`; box 49.1 → 57.3):

| arm | the five partial-start rows (first tick 2/5/9/12/16 ms, then 30 Hz frames) | 2nd front 12 frames after a 5 ms-partial front | whole-frame negative control |
|---|---|---|---|
| tree (`458bb26f`) | **RED 5 of 5**: the 240 ms front ends on frame **15** (≤ 11 asked) | **RED**: frame 15 | GREEN, frame 10 |
| pass-8 file (`eeb58de2`, median of 9) | GREEN 5 of 5 | GREEN | GREEN, frame 10 |

Frame 15 is the constant-17 cap's number, the one the tree's own 30 Hz unit row cites as the pre-cure state ("at a constant
17 ms cap it took 15 frames").

**Driven row, both engines** (`instruments/crit5-partial30.spec.ts`, `instruments/b1.sh`, `logs/p30-*.log`): the rate-clock's
`DRIVEN_CLOCK` at 30 Hz (the ONE library's clock, imported by relative product path `./rate-clock`), the served tree's own
`frontTween` from `/src`, a 240 ms front started `off` ms after a frame (`off = −1`: inside the frame's callback). Gate: the
front ends by frame 11 (the 30 Hz cure's own unit number is 10). Every arm a fresh page.

| arm | chromium | WebKit | load (1-min) |
|---|---|---|---|
| tree, off 6 | exit 0 but slowed: first tick 23.5 → **every 33 ms frame travels 23.5** (10/10), frame 11 | **exit 1**: travel **17.0** ×10 then 24.0, frame **14** (13/13 frames short) | 51.7–55.4 / 55.4–57.8 |
| tree, off 15 | **exit 1**: travel 17.0–17.7 per 33 ms frame (13/13), frame **14** | **exit 1**: travel 17.0 ×13, frame **15** (14/14) | 57.8–56.4 / 56.4–59.2 |
| tree, off −1 (in-frame start) | exit 0: travel 32.0 per 33–34 ms frame, frame 8 | exit 0 but slowed: **travel 23.0 per 33 ms frame** (10/10), frame 11 — a stale short tick from the page's load fronts, still in the window after 1.5 s idle | 59.2 / 59.2 |
| pass-8 file (median of 9), off 6 | exit 0: 17.0 ×3 then **33.3** per frame, frame 10 | exit 0: 17.0 ×3 then **33.0**, frame 10 | 58.9–63.8 / 63.8–68.4 |
| pass-8 file, off 15 | exit 0: 17.0 ×3 then 33.3, frame 10 | exit 0: 17.0 ×3 then 33.0, frame 10 | 68.4 / 68.4–65.2 |
| control `74a2b5d9` :4258 | exit 1 (no `/src`; `frontTween` does not exist at 74a2b5d9) | exit 1, the same | 65.2–62.5 / 62.5–71.6 |

Restored byte-equal by `cmp` at 12:04:49. **Reading:** on a 30 Hz panel the tree's fronts run at 51–71 % of the panel's
travel in 5 of 6 tree arms (both engines; the sixth at 97 %), and the pass-8 file runs them whole after its four
unknown-panel frames in 4 of 4. My gate (frame ≤ 11) reds 3 of the 6 tree arms; a per-frame clause (travel ≥ dt − 1 after
the fifth tick) would red 6 of 6 and 0 of 4 on the pass-8 file.
The cure for the stall-run hole re-opens the 30 Hz hole, which is the reason the observed cap exists (pass 7: VERB's hand at
4.7 s; pass 8: FIVE's "a 30 Hz panel is not a stall" row). **No landed row sees it:** the 30 Hz unit row feeds whole frames
from t = 0; the 60 → 30 row feeds whole 60 Hz frames; `D10-stallrun` runs at 60 Hz and PRINTS "worst healthy shortfall"
without gating it; G10's 30 Hz rows count commits per second, and a half-speed front still commits on every frame. This is
the class law (registry-v8 §2.12): the gate is cured for its plants (runs of 150 ms stalls) and not for its class (any
short tick moves a minimum; any long run moves a median). A statistic that survives both needs both rows: e.g. the minimum
over ticks that follow a tick of the same tween (drop each tween's first `dt`), or a low quantile with the 30 Hz and
partial-start rows beside the stall-run rows. That is the lane's to cut; neither is proven here.

## 2 · Rows 2 + 3 (CHAIR §6's floor): the panel row MEETS it; the driven row gates a floor the defect can lower

**G10-panel, re-derived both engines** (`logs/panel-*.log`, load 70.6–68.3): 13/13 streams met at 0.9 × A.6's best, exit 0
both engines — 60 Hz 120/120 = 60.0/s (+6.010 whole-ms, +6.000 fine), 30 Hz 30.0 (+2.995/+3.000), 120 Hz 60.0 (+6.010),
125 Hz 62.5 (+6.250 ×2), 75/90/100/144/165 Hz = 37.5/45.0/50.0/48.0/55.0 (+3.750/+4.500/+5.000/+4.800/+5.500), min gap
≥ 16.00 ms. Threshold plant `G10_PANEL_SHARE=1.01`: exit 1 both engines, all 13 streams RED by −0.300 to −0.625/s. The
lane's table reproduces to the digit. CHAIR §6 is met on this row: the floor is 0.9 × R / ⌈15.5 · R / 1000⌉, gated.

**G10 driven, the floor's FORM.** The chair's floor is "0.9 × the A.6-deliverable best at R"; LAWS P8 §D reads it "on the
A.6-delivered form … with the box's own rate and load printed beside". The lane GATES the delivered form (A.6's optimum over
the ticks the clock actually delivered inside each burst) and only PRINTS the rate form (0.9 × the best at R = 56.25/s at
125 Hz). That reconciles row 2 (box stalls no longer red the gate). It also means the gated floor is computed from the
very frames a slow product drops.

**Plant `heavy-commit`** (`instruments/plant-heavy-commit.diff`, one edit in `frontGate`'s `land`: an 18 ms busy-wait after
every `commit(v)`; bytes verified with `od -c`; served in the tree, restored byte-equal at 12:08:36; `logs/g10-heavy.log`):

| arm, HZ = 125 | chromium | WebKit | load |
|---|---|---|---|
| tree (clean) | exit 0; gauge 59.5/60.2/58.3, tally 59.2, join 61.5/s; 43 vsyncs dropped by the pump; rate form GREEN | exit 1 once (§5 incident: `seen` and `interleave` RED, "tally never re-cut"); re-read ×3 exit 0, tally 56.6/59.4/60.2/s | 77.9–66.0 / 66.0–51.2; re-reads 44.2–79.0 |
| **heavy-commit** | **exit 0, all six clauses GREEN**: gauge 51.5/52.1/53.6, **tally 40.2**, join 48.1/s; **262** vsyncs dropped; gated floors 46.3/46.9/48.2, **36.2**, 43.3; rate form **RED 3/3, 1/1, 1/1** (printed only) | **exit 0, all six GREEN**: gauge 50.0/49.3/52.1, **tally 40.7**, join 46.2/s; **299** dropped; gated floors 45.0/44.4/46.9, **36.6**, 41.5; rate form RED 3/3, 1/1, 1/1 | 51.9–48.5 / 48.5–45.6 |

A product that spends 18 ms in every re-cut cuts the tally from ~59 to ~40 re-cuts a second (−32 %) at a load under 52, and
G10 is GREEN in both engines: the pump drops the frames the commits overran, the delivered optimum falls with them, and the
only witness is a print. This is the masked-fallback / control-anchored-bound class (LAWS P8 §F, COUNT's G14): a bound cut
from the same run's delivery cannot see a regression that causes the shortfall in delivery. Row 2's cure is real for the box's
stalls and blind to the product's. A clause that separates them is owed — e.g. the pump's dropped vsyncs inside a burst
bounded (clean 43 per run here, 262/299 planted), or the rate form GATED below a load of 120 with its re-read rule (the
lane's own 125 Hz read had 1 rate-form red in 30 bursts by 0.05/s, so its ε needs the threshold pair). Not proven here which.

### 2.1 The prior pass's plant FIRST on the re-cut floor (`logs/panel-p7.log`, `logs/g10-p7-60.log`, `logs/g10-tree-60.log`)

6b92ba6d's `gridPaths.ts` (pass 7's whole-ms +1) served in the tree, restored byte-equal at 12:12:33:

| row | chromium | WebKit | load |
|---|---|---|---|
| G10-panel, pass-7 file | **exit 1**: 60 Hz whole-ms 85/120 = 42.4/s, margin −11.640 | **exit 1**: 60 Hz whole-ms 80/120 = 40.2/s (−13.837), fine 60/120 = 30.0/s (−24.000) | 53.9–51.7 / 51.7 |
| G10 driven HZ=60, pass-7 file | exit 0 (fine clock: the +1 never bites) | **exit 1, floor RED alone**: gauge 15.5/s under its delivered floor; tally 41.1/s vs delivered 52.2 | 51.7–46.7 / 46.7–59.0 |
| G10 driven HZ=60, tree | exit 0; tally 60.0/s, floor 54.0 | exit 0; tally 58.8/s, delivered floor 54.0, rate form 52.9 | 60.0–80.5 / 80.5–76.4 |

The delivered form still reds the class it was born for (pass 7's whole-ms +1) in WebKit, and the panel row reds it in both
engines. The born-RED survives the re-cut. §2's hole is a different class (a product-side cost), not a loss of this one.

### 2.2 Batteries on the re-cut gates: what the lane ran, what is missing

- **D10-stallrun** (new): vacuity plant, ±0.1 ms threshold pair, born-RED — run by the lane, born-RED re-derived by me. The
  `max(stepMs, minTick)` disjunct's `minTick` arm is unreachable headless (stated, lawful under LAWS P8 §F). **Missing: any
  clause on HEALTHY travel** — the row prints "worst healthy shortfall" and gates nothing on it, which is how §1.1's 30 Hz
  regression passes every landed row.
- **G10-panel** (re-cut floor): threshold pair 0.99/1.01 — 1.01 re-derived RED both engines; born-RED (pass-7 file)
  re-derived RED both engines.
- **G10 driven** (re-cut floor, delivered form): clause battery 6/6 chromium, 5/6 WebKit (lane's; WebKit's ceiling stated
  unreachable on a whole-ms clock — the arithmetic holds: every whole-ms interval is ≤ 15 or ≥ 16 ms, so > 62.5/s needs a
  gap < 15.5). Not re-run by me. **Missing: the threshold pair on the driven floor itself.** `FLOOR_SHARE = 0.9` is a const
  with no knob and no ±ε plant (LAWS P8 §F: every re-cut gate with a numeric bound). The lane pinned the PANEL row's share,
  not the driven row's, and the driven row is the one whose floor changed form this pass.
- **The disjunct the floor dropped** (§2): the delivered form has no witness for a product-side stall; `heavy-commit` is
  GREEN on all six clauses in both engines.

## 3 · The charter's rows, judged

| row | lane's claim | my reading |
|---|---|---|
| 1 D10 under a run of stalls | CLOSED | **Met as worded; RE-OPENED by class** (§1.1): the window minimum halves a 30 Hz panel's fronts after any short tick, both engines; no landed row sees it |
| 2 floor reds on page stalls | CLOSED | **Met for the box's stalls; a new blind spot** (§2): a product-side 18 ms/commit cost is GREEN on all six clauses, both engines; driven floor has no ±ε pair |
| 3 A.6 vs the formula | CLOSED per CHAIR §6 | **CLOSED** on G10-panel (re-derived 13/13 both engines, 1.01 RED, pass-7 RED). On the driven row the chair's at-R floor is a print (§2) |
| 4 the start write | CLOSED: deleted | **CLOSED** (§3.1, re-derived) |
| 5 G10 clause battery | 6/6 cr, 5/6 wk | **Accepted** with the stated whole-ms arithmetic; not re-run |
| 6 scratch drivers | OPEN (sources lost) | **OPEN.** Rows 6/8/9/12/π/21 have no reading by anyone this pass; the pass-8 numbers were the lane's own and were never critic-derived, so they are CLAIMS. B-G5-DEPTH's 25 % and G9 are held by no gate |
| 7 G5 in four regimes | OPEN | **OPEN** (no driver; LAWS P7 §E(i)) |
| 8 flush lag | NOT attributed; cost line written | **OPEN.** One plant tried (the start write) and it did not move the lag; the charter asked for attribution or the cost line, and the cost line exists, so the row is ANSWERED-by-cost, not cured |
| 9 row 21 / row 20 / row 8 | OPEN | **OPEN.** Row 20's upper edge exceeded on every driven read (mine: tally 56.6–60.2/s at 125 Hz, 58.8–60.0 at 60 Hz, against 49–52); row 8's dark border 2.768 < 3 unread |
| 10 `len:` in postpaint | CLOSED by the chair's fold | **CLOSED** (the flash row runs unmodified on homes v2; §3.1) |
| 11 bootHand (VERB) | HANDED by sha | **HANDED, but should be HELD**: VERB taking a minimum-of-32 observer inherits §1.1; on the union `bootHand.ts` keeps its own `paceWindow` observer seeded with `stepMs` |
| 12 check 8 on the union | not re-read | **OPEN** (unread by lane and critic) |

## 4 · Constraints

- **M16**: `check-copy-register --self-test` exit 0 on the tree ("0 em/en dashes and 0 unadmitted jargon"; `logs/lint-copy.log`).
- **lint:motion**: exit 0 on the tree ("37 specs, every one declaring its motion state"; `logs/lint-motion2.log`). My first
  read was exit 1 on MY critic spec alone (no motion declaration in its head); the clean read moved both critic files out.
- **filterBudget 9, `@property`, census, T9-R6**: the advance's product delta was read whole (`gridPaths.ts` statistic +
  comments; `DifficultyTally.vue` one deleted call + comments): no filter, CSS, template, token or `@property` byte, and no
  new class string in a comment. Not re-run; nil by construction for this advance. The lane's dist-CSS comparison (6/7
  byte-identical, index CSS differing by one scope id) is the lane's.
- **π vs 74a2b5d9 and AA (painted)**: **UNREAD by lane and critic.** Static paint of the advance is nil by construction; π
  and AA of the BANK (pass 8's sparkle drop-shadow; light gold 3.236/3.217/3.856, dark 3.069/**2.768**/3.606) are pass-8
  claims whose driver is lost. The dark 2.768 < 3 stands as the lane's own number, unre-derived for a second pass.
- **Ballot pair on one payload / crops**: none this pass (0 PNG, 0 B of 120,378 B spent). No frame to look at.
- **Instruments**: every row I ran imports by relative product path (`./rate-clock`, `/src/...` served by the tree's own dev
  graph); nothing from `docs/`. The library is homes v2 applied by sha (§0).

## 5 · Incidents (mine)

1. **The unattributed WebKit red.** My first clean G10 WebKit read (125 Hz, 12:07, load 66.0–51.2) exited 1 on `seen` and
   `interleave`: "tally (.dt-stroke) never re-cut", 0 tally records with "tally inked 5", gauge and join normal. During that
   run I moved my two critic files out of and back into the served tree's `src/`/`e2e/` for the lint:motion re-read. The
   dev server's watcher saw two file events mid-run. Three re-reads, tree untouched: exit 0, tally 56.6/59.4/60.2/s. I do not
   charge it to the lane. I also cannot rule out a real 1-in-4 tally miss, and the lane's 5/5 is reproduced by me as 3/4.
2. Plants served by swapping product files in MY scratch tree (dev server, HMR); every restore printed `cmp` byte-equal
   (12:04:49, 12:06:14, 12:08:36, 12:12:33, flash at its own line). No reading cites a tree with a plant in.
3. Scratch configs `.crit5.vite.mts` / `.crit5.vitest.mts` and the critic files lived in my scratch tree only; nothing of
   mine touched the lane's worktree, main's `src/e2e/scripts`, or the control tree. Git ran only in the lane's worktree with
   temporary index files under my scratch (read-tree / apply --cached / write-tree / diff / archive); no commit, ref, stash.
4. Box: 45–80 (1-min) through every row; no row opened above 120.

## 3.1 · Row 4 re-derived: the tally flash (`logs/flash-*.log`, `instruments/b6.sh`)

| arm (`tally-flash.spec.ts`, "never paint whole") | chromium | WebKit | load (1-min) |
|---|---|---|---|
| tree (no start write) | exit 0: **0 of 10** (10 inks / 18 acts) | exit 0: **0 of 10** (11 / 15) | 72.6–63.8 / 63.8–43.7 |
| born-RED: 6b92ba6d's DifficultyTally.vue (pass 7) served | **exit 1: 6 of 10** (11 / 18) | **exit 1: 4 of 10** (10 / 18) | 41.1–65.6 / 65.6–81.5 |
| control `74a2b5d9` dist :4258 | exit 0: 0 of 10 (11 / 15) | exit 0: 0 of 10 (12 / 21) | 81.5–93.7 / 93.7–64.7 |

Restored byte-equal at 12:19:07. The lane's 0/11 + 0/10 against 8/11 + 3/10 reproduces in kind (mine 0/10 + 0/10 against
6/10 + 4/10). Deleting the start write holds; the `shown` ref carries the flash. Row 4 is CLOSED. (This is a count row;
each arm opened under 120.)

## 6 · The number

Pass 8's critic gave 85 with row 1 the fold blocker. Pass 9 landed the blocker as worded, re-derived (D10 both engines +
born-RED), closed rows 3 (panel) and 4 (flash), reproduced the bank to the tree id, and kept homes v2 clean. Against that:

- **−** the row-1 cure regresses the 30 Hz panel it exists for (§1.1; unit 6/6 RED, driven 5 of 6 arms slowed, both engines,
  pass-8 file GREEN). A cure that re-opens its own sibling class is the class law's open state, and it is the primitive
  three other families are cleared to ride by sha.
- **−** the driven floor's new form is blind to a product-side cost (§2; GREEN on six clauses at −32 % tally rate) and has
  no ±ε pair.
- **−** rows 6/7/8/9/12, π and AA are unread for a second pass; the lost drivers are an incident, not a reading.

**80. ADVANCE** (not BLOCK: the batch gate as the chair worded it is met and the bank is sound; not BANK: §1.1 has a
named, small cure the lane owns). **Earliest 100 = pass 11**: pass 10 must land a statistic that passes BOTH the stall-run
rows and the 30 Hz partial-start rows (my probe is the born-RED), a gated healthy-travel clause, the driven floor's
product-cost witness and ±ε pair, and re-derived rows 6–9/π/AA; then a clean pass.

**To the chair:** I recommend the by-sha ride of `frontGate`/`frontTween`/`panelFrameMs` (SIX, GRAPHITE, VERB's
`bootHand`) wait for the 30 Hz rows, not only the stall-run rows. CHAIR §6's condition is met in its letter. Riding now
puts §1.1 into every consumer.

## 7 · Replay

Scratch tree = `git archive 2d13eaf1 web/frontend` + `csp-solver` symlinked from the lane's worktree + main's node_modules;
serve with `instruments/serve.sh` (tree: vite dev + a private cacheDir config; control: `vite preview` in w7-control).
Unit probe: copy `instruments/crit.partial30.test.CRITIC.ts` to `src/pencil/grid/crit.partial30.test.ts` and run
`instruments/unit.sh` (swaps c3a863f7's gridPaths.ts in and out). Driven rows: `instruments/run.sh` with a playwright config
whose `testDir` is the tree's `e2e/` (workers 1, retries 0); copy `instruments/crit5-partial30.spec.ts` into `e2e/`.
Batteries `b1.sh` (30 Hz partial), `b2.sh` (D10 + panel), `b3.sh` (G10 + heavy-commit), `b5.sh` (pass-7 plant), `b6.sh`
(flash). Plants: `instruments/plant-heavy-commit.diff`, c3a863f7's gridPaths.ts, 6b92ba6d's gridPaths.ts and
DifficultyTally.vue. Logs under `logs/`.
