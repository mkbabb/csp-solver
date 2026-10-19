# ACC-FIVE · pass 9 · prototype (§3 accent, batch 1)

Lane tree `.claude/worktrees/wf_f72f3b5a-83a-41` (detached `74a2b5d9`), advanced in place from the pass-8 bank plus the
dead first attempt's hunks (§8). Ports: the tree on `:4236`, my control on `:4258`, both killed by recorded PID after a
cwd check (11:52). Base and π control `74a2b5d9`. This number is the lane's, not the critic's.

## 0 · The bank

| bank | sha1 | bytes | `--shortstat` | `git apply --check` |
|---|---|---|---|---|
| `pass9.diff` (74a2b5d9 → tree `2d13eaf1`) | `ef3325cd1e64c9e316b3e095fcd2aa73b3b6c4cf` | 637,487 | 33 files changed, 12864 insertions(+), 165 deletions(-) | **0** on `74a2b5d9` (lands on `2d13eaf1`) |
| `pass9.delta.on-WAVE.diff` (WAVE+homes `acde977b` → `ff4cac9f`) | `2017beb6a059eeb653271381abea927a0d843727` | 26,920 | 5 files changed, 194 insertions(+), 48 deletions(-) | **0** on `acde977b` (WAVE + homes v2) · **0** on bare WAVE `acb9c08e` · **0** on s13-s7-s3 `f1c9c3fe` · **0** on the pass-8 bank `c3a863f7` |

- Both banks were cut through temporary indexes, `--binary`, product paths only. The tree's own diff at return re-cuts to
  `2d13eaf1`, so it equals `pass9.diff`. Grep of both banks: `scratchpad` 0, `/private/tmp` 0, `/tmp/` 0,
  `.claude/t9-scratch` 0, dot-dir paths 0.
- **The 13 home paths equal homes v2 byte for byte** (`homes.diff` `1f70cfda` → `d17813ba`). No residual home edit is in
  either bank. Every instrument is imported by relative product path: `./rate-clock`, `./lib/postpaint.mjs`,
  `./lib/paint-lib.mjs`. No `docs/` import exists.
- The on-WAVE delta was cut by a three-way apply of the pass-8-bank → tree delta onto `acde977b` (all five paths applied
  cleanly). A plain cut from `c3a863f7` failed on the union at two specs, whose `@ts-expect-error` lines the union had
  already dropped (identical change). `instruments/bank.sh` is that plain cut. The three-way step was run by hand
  (BANKED.txt).

## 0.1 · Numbers first

- **Row 1 (the fold blocker) LANDED.** `panelFrameMs` is the MINIMUM of the last 32 ticks.
  - The critic's probe reads 3 of 7 RED on the pass-8 file and 0 of 7 on the tree. The unit rows read 13/13 GREEN on the
    tree; every one of seven one-edit plants reds ≥ 2 rows, and nocap reds 13/13.
  - The driven `D10-stallrun` row is GREEN on the final bytes in both engines (5 and 9 stalls: travel 17.0 ms each, margin
    1.000 ms). It is born-RED on the pass-8 file in both engines (the 5th stall travels 148.7–150.0 ms).
  - Its battery: the vacuity plant reds the guard alone; the threshold ±0.1 ms reds and greens by ε, both engines.
- **CHAIR §6 floor LANDED.**
  - Driven G10 is gated on the A.6-delivered form: **20/20 exit 0** (5 runs × 2 engines × 125 and 60 Hz), loads 29.5–73.5.
  - G10-panel meets 0.9 × A.6's best at all 13 streams in both engines, margins +3.0 to +6.25/s. Threshold battery:
    share 0.99 GREEN, share 1.01 RED, both engines.
- **G10 clause-sabotage battery:** 6/6 isolated in chromium and 5/6 in WebKit. WebKit's ceiling is the arithmetic shadow
  of the gap clause on a whole-ms clock (§2.4).
- **Gap 4 (the start write): DELETED.** The flash row reads 0/11 and 0/10 on the tree (control 0/12 and 0/12). It is
  born-RED on the pass-7 tally at 8/11 and 3/10.
- **The flush lag is NOT attributed.** The start write does not move it. Its cost line is in §2.5.
- **Unit, final bytes:** 70 files / 875 tests GREEN (composables 16, games 741, pencil 118). `src/pencil/grid` re-run after
  the last edit: 41/41.
- **Checks on the tree:** `vue-tsc -b` 0 and `typecheck:e2e` 0. Exit 0 on `lint:copy` (M16: 0 em/en dashes, 0 jargon),
  `lint:motion`, `lint:sleep`, `lint:catch`, `lint:theme-tokens`, `lint:ink`, `test:e2e:projects` (571 tests) and
  `lint:knip`. eslint and prettier are 0 on the changed files after one cure (§8).
- **On the union `ff4cac9f`:** `lint:bands` 0, unit `src/pencil/grid` 47/47, unit `src/games/shared` 472/472, `vue-tsc -b` 0,
  `lint:motion` 0, `lint:copy` 0.
  - `typecheck:e2e` exits 2 with 9 errors, all in `zone-grammar.spec.ts`: RULE's known consumer cure, per the homes README.
  - `lint:sleep` exits 1 with 2 flags, both in `keys-crib.spec.ts:333/337`. Both are inherited from the union; my delta
    touches neither file.
- **T9-R6 (a comment as a Tailwind source):** the dist CSS of `2d13eaf1` against `c3a863f7` matches in 6 of 7 files byte
  for byte. The index CSS is 229,621 B in both and differs only by DifficultyTally's scope id. No utility was minted.
- **Evidence:** `check-evidence-policy` exit 0 (PASS) bare from the repo root; 0 PNG; 0 B of the 120,378 B headroom spent.

## 0.2 · Gaps first (open at this return, each with the number that holds it)

1. **Gap 6 / R4: the pass-8 scratch drivers are LOST.** The sources of `g5.mjs`, `g9.mjs`, `tg.mjs`, `pi.mjs` and `r21.mjs`
   lived only in the pass-8 session scratchpad, which no longer exists on this host (the 2026-10-07 reboot; a glob for
   `five8s/tools/web/frontend/.acc5r/` matches nothing). They cannot be banked, and this pass did not land them as specs.
   Rows 6, 8, 9, 12, π and row 21 have **no reading this pass**. Their pass-8 numbers were the lane's own and were never
   re-derived by the critic, so they stand as CLAIMS, not readings. No landed gate holds B-G5-DEPTH's 25 % or G9.
2. **Gap 7 (G5 in the four regimes): NOT READ.** It is blocked on gap 1, because G5 has no driver.
3. **Gap 9: row 21's 0-encode is unread on the union** (VERB's G-D2 not run), and **row 8's dark border 2.768 < 3** is not
   re-read. It stays in ROW B's caption as the pass-8 claim. Row 20's 49–52/s bar is not re-read as a bar. The driven tally
   rates this pass are 55.6–61.8/s, above 52 in every run, so the upper edge is still exceeded everywhere.
4. **Gap 8 (R5): the flush lag is NOT attributed.** The one plant tried (the start write restored) does not move it (§2.5).
   The cost line is written for INTAKE-23 row 20: the DOM minimum is 3.9–14.5 ms against the frame clock's ≥ 15.5 ms,
   20/20 runs, both engines.
5. **G10's WebKit ceiling clause is not isolable** (5 of 6 clauses in WebKit). This is stated as arithmetic in §2.4, not
   planted.
6. **The D10 row's control is not a reading.** The HEAD control is a preview dist with no `/src`, and `74a2b5d9` has no
   `frontTween`. The control's exit (1, both engines) is printed, and the born-RED is the pass-8 file served in the tree.
   The `minTick` arm of the cap is unreachable headless (healthy ticks 1.0–9.0 ms < stepMs 17), so it is stated, not planted.
7. **Gap 11: VERB's `bootHand.ts` (union only) still caps at stepMs with no panel observation.** The observer is handed by
   sha (§1); the edit is VERB's.
8. **Gap 12 (check 8 on the WAVE union): not re-read this pass.**
9. **π vs `74a2b5d9` and AA: not re-read this pass.** This pass moved no paint: one deleted call in `DifficultyTally.vue`
   (the start write) and an observer statistic in `gridPaths.ts`. No CSS, template or token changed, so the pass-8 π
   (1 diff on a claimed surface, the sparkle glow's drop-shadow) and AA (light gold 3.236/3.217/3.856, dark
   3.069/2.768/3.606) are carried as CLAIMS, unread.
10. **No crop.** 0 PNG banked, 0 B of the wave's 120,378 B headroom spent.
11. **filterBudget, the census and property-block were not re-run.** No filter, CSS or `@property` byte moved in this pass's
    delta (§0's file list).
## 1 · Row 1 (the fold blocker): the D10 cap keyed on the window MINIMUM, plus the stall-run rows

**The cure** (`web/frontend/src/pencil/grid/gridPaths.ts`, blob `458bb26f` at bank; pass 8's was `eeb58de2`): `panelFrameMs`
returns `Math.min(...ticks)` over the last `PANEL_WINDOW = 32` one-per-frame ticks (the median of nine is gone). A stall
only lengthens an interval, so a run of stalls becomes "the panel" only once it fills the whole window. Both costs are
written at the site and pinned by unit rows from both sides:
- a run of 32 consecutive stalls is read as the panel (31 capped, the 32nd travels);
- a 60 → 30 Hz drop runs at the hand's step until 32 of its frames fill the window (~1.07 s at half speed).
`PANEL_MIN_TICKS = 5` and the one-reading-per-frame key are unchanged. `frontTween`'s travel expression is byte-unchanged
(the union's `check-motion-bands.mjs` admits it by text).

### 1.1 Unit rows + the critic's probe, with the born-RED and the sabotage battery (`logs/d10-unit-battery.txt`)

Browserless; box 29.5 → 31.1 (1-min) at 11:17:24–11:17:40. Each plant is ONE edit to `gridPaths.ts` (or the exact pass-8
file), swapped in, run, restored byte-equal (`cmp` printed). The rows are the tree's six (`frontTween — a RUN of stalls`)
plus the pass-8 critic's seven-row probe `crit.stallrun.test.CRITIC.ts`, copied in for the run and moved out after.

| plant | exit | red rows | critic probe (travel per stall, ms) |
|---|---|---|---|
| **clean (the tree)** | **0** | 0 of 13 | n=1…9 all ≤ 17 |
| **p8file = c3a863f7's gridPaths.ts (THE BORN-RED)** | 1 | 7 of 13 | n=5 `17/17/17/17/150`, n=6 `…/150/150`, n=9 `17×4 then 150×5` — the critic's numbers to the digit |
| median9 (window 9 + median: the pass-8 rule as one edit) | 1 | 7 of 13 | same as p8file |
| min9 (minimum, window 9) | 1 | 4 of 13 | n=9 `17×8 then 150` (the window's own cliff) |
| median32 (median, window 32) | 1 | 2 of 13 | probe GREEN — the cliff row and the 60→30 row red it |
| win31 / win33 (the window ±1) | 1 / 1 | 2 / 2 | probe GREEN — the cliff row pins 32 from both sides |
| nocap (the cap deleted) | 1 | 13 of 13 | every stall 150 |

The critic's probe reads 3 of 7 red on the pass-8 file and 0 of 7 on the tree. The unit rows reproduce it (n = 1, 4, 5,
9) and add the cliff and the 30 Hz cost; every plant reds at least one row only the tree passes.

### 1.2 The driven row `D10-stallrun` (front-rate.spec.ts), both engines (`logs/d10-e2e-battery.txt`)

The served tree's own `frontTween` (dev graph) on the page's real rAF chain; a second rAF loop busy-waits 150 ms in N
consecutive frames after twenty healthy ones. Clauses: the vacuity guard (`stalled ≥ max(5, N)`) and the cap (every
stalled tick's travel ≤ max(stepMs, shortest healthy tick) + slack, slack 1 ms). Knobs (spec-side, env, defaults shipped):
`D10_STALLS`, `D10_STALL_MS`, `D10_SLACK`.

| arm | chromium | WebKit | load (1-min, start–end) |
|---|---|---|---|
| tree, 5 stalls | exit 0: travel 17.0 ×5, cap 18.00, margin 1.000 ms | exit 0: 17.0 ×5, margin 1.000 | 37.6–36.9 / 36.9–37.5 |
| tree, 9 stalls | exit 0: 17.0 ×9, margin 1.000 | exit 0: 17.0 ×9, margin 1.000 | 37.5–39.0 / 39.0–41.2 |
| **born-RED: c3a863f7's gridPaths.ts served** | **exit 1**: `17.0/17.0/17.0/17.0/149.9` | **exit 1**: `17.0 ×4 / 150.0` | 40.1–37.9 / 37.9–36.0 |
| born-RED, 9 stalls | exit 1, **NOT a reading**: `Execution context was destroyed` (the swap's full reload landed mid-row) | **exit 1**: `17.0 ×4 then 151/153/153/153/154` | 36.0–34.9 / 34.9–37.5 |
| vacuity plant `D10_STALL_MS=0` | exit 1 on the guard alone (0 stalled; the cap clause holds, margin 18) | exit 1, the same | 43.6–43.2 / 43.2–45.4 |
| threshold `D10_SLACK=+0.1` (bound = measured + ε) | exit 0, margin +0.100 | exit 0, margin +0.100 | 41.0–43.4 / 43.4–46.8 |
| threshold `D10_SLACK=−0.1` (bound = measured − ε) | exit 1, margin −0.100 | exit 1, margin −0.100 | 46.8–47.8 / 47.8–47.0 |
| control `74a2b5d9` dist on :4258 | exit 1: no `/src` in a preview dist (and no `frontTween` at `74a2b5d9`) — the control cannot host this row | exit 1, the same | 41.2 / 41.2–43.6 |

Every timing row opened under a 1-minute load of 120. Disjuncts: the cap is one clause (`max(stepMs, minTick)`); with
`minTick` < stepMs on every run (6.0–9.0 ms healthy ticks headless; WebKit printed 1.0–3.0 ms twice), the `minTick`
arm is unreachable on this box — stated, not planted.

**Handoff (R6 / gap 11):** the observer rides by sha from here: `gridPaths.ts` blob `458bb26ff2fac0c53ab545db574325df2b219156`
(`panelFrameMs` + `PANEL_WINDOW` + the unit rows). SIX, GRAPHITE and VERB's `bootHand` may take it now; each owes the
stall-run row on its own consumer (LAWS P8 §D). VERB's `bootHand.ts` (union only) is not edited here.

## 2 · Gaps 2 + 3 (R2): the G10 floor per CHAIR §6, gated on the A.6-delivered form

`front-rate.spec.ts` now gates every driven burst at 0.9 × the A.6-DELIVERED best (the optimum over the write
opportunities the page actually offered) and PRINTS the rate form 0.9 × (Hz / ⌈15.5 · Hz / 1000⌉) on the clock's
measured Hz, with the box's 1-min load, beside it. `G10-panel` gates every stream at 0.9 × A.6's best at R; the
"UNREACHABLE under A.6" print is struck. A.6 is not re-worded.

### 2.1 Driven G10, five runs per engine per rate (`logs/g10-125.txt`, `logs/g10-60.txt`)

| row | chromium | WebKit | load band (1-min) |
|---|---|---|---|
| 125 Hz × 5 | **5/5 exit 0**; slowest burst 56.2–61.8/s, delivered floors ≥ 50.6 GREEN | **5/5 exit 0**; slowest 57.6–62.5/s | 29.5–69.2 |
| 60 Hz × 5 | **5/5 exit 0**; every consumer 59.9–60.0/s | **5/5 exit 0**; tally slowest 55.6–60.0/s, rate form 52.9 (clock read ~58.8 Hz) | 38.4–73.5 |
| control `74a2b5d9` | exit 1 at the precondition: `__cuts.join.d` stays 0 for 15 s (no `.join-pose` re-cut on the control) — the control cannot host the row | exit 1, the same | 73.5–110.8 |

- The rate form read RED once in 30 bursts at 125 Hz (chromium run 3: gauge 56.2 < 56.25, delivered floor 50.6 GREEN, load
  53.4 → 48.5) — the critic's §0.2 case, now printed and not gated, per §6.
- The frame clock's shortest gap ≥ 15.5 ms in all 20 runs (chromium 15.5–16.7, WebKit 16.0).
- P6's ≥ 5 runs per engine: met at both rates, both engines, 20/20 exit 0.

### 2.2 G10-panel at every rate, both engines (`logs/panel.txt`)

Both engines read the same table (chromium fine clock, WebKit whole-ms): 60 Hz 120/120 = 60.0/s, margin +6.01/s; 30 Hz
30.0 (+3.00); 120 Hz 60.0 (+6.01); 125 Hz 62.5 (+6.25); **75/90/100/144/165 Hz = 37.5/45.0/50.0/48.0/55.0/s = A.6's best,
floor met with margins +3.75/+4.50/+5.00/+4.80/+5.50**; 240 Hz 60.0 (+6.00). Min gap ≥ 16.00 ms everywhere. Load 37.9–40.2.
- **Threshold battery (LAWS P8 §F):** `G10_PANEL_SHARE=0.99` exit 0 both engines (margin +0.61/s at 60 Hz);
  `G10_PANEL_SHARE=1.01` exit 1 both engines (60 Hz 60.0 < 60.6, margin −0.59/s). The gate holds A.6's best within 1 %.
- Control: exit 1 both engines (no `/src` to import from the preview dist).

### 2.3 The clause-sabotage battery, 6 of 6 (gap 5; `logs/g10-clause-battery.txt`)

Each plant is read off the row's own CLAUSES line (every clause's verdict printed before the first assertion).

| clause | plant | chromium CLAUSES | WebKit CLAUSES | load |
|---|---|---|---|---|
| seen | HandDrawnGrid's gauge write deleted (`fillGate.write` → void) | **seen RED only** | **seen RED only** | 83.6–89.5 |
| clock | `CLOCK=60` (a native 60 Hz clock under the 93.75 Hz need) | **clock RED only** | **clock RED only** | 110.8–73.8 |
| interleave | `DEAL=EASY` (the tally never draws > 4 strokes at once) | **interleave RED only** | **interleave RED only** | 73.8–57.3 |
| floor | `FRONT_MIN_MS = 49` | **floor RED only** | **floor RED only** | 81.2–93.3 |
| ceiling | first cut `FRONT_MIN_MS = 15.5`, HZ=128 | ceiling + gap RED (the gap follows MIN − 0.5 = 15.0) | ceiling + gap RED | 57.3–78.6 |
| gap | first cut `FRONT_GAP_MS = 7` + 8/24 slots | ceiling + gap RED | ceiling + gap RED | 87.7–73.6 |
| ceiling | **re-cut `ceil2`**: MIN 15.5 with the gap held at 15.5, HZ=128 | see §2.4 | see §2.4 | |
| gap | **re-cut `gap2`**: GAP 7 + 9/20 ms slots at HZ=240 (~60/s, every other gap 12.5 ms) | see §2.4 | see §2.4 | |

The CLOCK and DEAL plants red their own clause ALONE now that the floor reads the delivered form (pass 8's table had
both redding `floor` beside them on the chair's formula). Every plant row opened under 120. The clock plant's chromium
run opened at 110.8 and ended at 133.8; it is a clause verdict, not a timing verdict. The battery then waited behind a
60 s poll at 133 (11:37:11) before the next row.

### 2.4 The two re-cut plants (`logs/g10-clause-battery.txt`, 11:44:45–11:48:21)

| clause | plant | chromium | WebKit | load |
|---|---|---|---|---|
| gap | `gap2`: `FRONT_GAP_MS = 7`, slots alternate now+9 / now+20, HZ=240 | **gap RED only** (12.5 ms) | **gap RED only** (9.0 ms) | 63.1–59.4 |
| ceiling | `ceil2` at HZ=128 | GREEN (rates 57.8–61.7: jittered frames lose their slot) — vacuous, struck | GREEN, struck | 82.1–63.7 |
| ceiling | `ceil2b`: the same edit at HZ=126 (two frames = 15.87 ms) | **ceiling RED only** (gauge 63.0/s, every gap ≥ 15.6) | GREEN (57.9–58.8/s) | 57.0–38.0 |

**Result: 6 of 6 clauses isolated in chromium; 5 of 6 in WebKit.** WebKit's ceiling cannot be redded alone, and the
reason is arithmetic, not a hole: on a whole-millisecond clock an interval is 15 ms (< 15.5, the gap clause) or ≥ 16 ms
(≤ 62.5/s). So a stream over 62.5/s must hold a gap under 15.5. In WebKit, `ceiling` is the conjunction's shadow of `gap`,
and `gap` is proven there by `gap2`.

### 2.5 Gap 8 (R5), the flush lag: NOT attributed to the start write

The DOM clock still reads under 15.5 ms in every driven run while the frame clock holds:

| tally DOM min (ms) | chromium | WebKit |
|---|---|---|
| tree (no start write), 125 Hz × 5 | 8.4 / 9.0 / 14.5 / 11.6 / 12.7 | 10.0 / 12.0 / 11.0 / 8.0 / 10.0 |
| start write restored (c3a863f7's tally), 125 Hz × 2 | 12.5 / 11.8 | 14.0 / 11.0 |
| tree, 60 Hz × 5 | 3.9 / 7.5 / 8.0 / 9.0 / 7.6 | 11.0 / 9.0 / 4.0 / 4.0 / 8.0 |

The gauge and the join, which never had a start write, read DOM mins of 10.0–15.5 and 11.0–15.1 ms in the same 20 runs. The start write
does not move the lag, so it is not the plant that attributes it. **Cost line for INTAKE-23 row 20 (the fold carries it):**
the DOM-clock minimum is 3.9–14.5 ms against the frame clock's ≥ 15.5 ms in 20/20 runs both engines. The re-cut reaches the
DOM late in its frame, and that wait varies from frame to frame. The tally's 60 Hz chromium lows (3.9–9.0 ms) are the deepest.

## 3 · Gap 4 (row 3's named cure): the start write DELETED, and the row that holds it

`DifficultyTally.vue` no longer forces `gate.write(0, true)` from `runDrawIn` (the PRM / un-inked snap `gate.write(Infinity,
true)` stays). The draw-in's first FRAME commits the new ink with its reveal (`shown` rides the gate's commit), so the
A.6 reason pass 7 removed it for stands, and the pass-8 critic's `nostart` plant is now the product. What holds the
flash at 0 is `shown`; the row that reds without it is the pass-7 tally, served in the tree:

| arm (`tally-flash.spec.ts`, "never paint whole") | chromium | WebKit | load (1-min, start–end) |
|---|---|---|---|
| **tree (no start write)** | **exit 0: 0 of 11** (13 inks / 21 acts) | **exit 0: 0 of 10** (10 / 18) | 47.0–87.2 / 87.2–67.3 |
| control `74a2b5d9` (dist :4258) | exit 0: 0 of 12 (13 / 21) | exit 0: 0 of 12 (14 / 21) | 67.3–40.6 / 40.6–56.8 |
| **born-RED: 6b92ba6d's DifficultyTally.vue (pass 7) served in the tree** | **exit 1: 8 of 11** | **exit 1: 3 of 10** | 56.8–38.6 / 38.6–36.5 |

The born-RED and the tree ran in the same battery (`logs/g10b-battery.txt`), restored byte-equal at 11:27:43. The
flash row opened at load 47.0 and ended at 87.2 (chromium tree): it is a count row, not a timing verdict, and every
opening load is under 120. The `len:` subject the row reads is FOLDED in homes v2 (`e2e/lib/postpaint.mjs`, §4 of the
instruments README): gap 10 is closed by the chair's fold, and the row runs on the ONE library unmodified.

## 4 · The charter, row by row (my reading; the number is the critic's)

| row | state at this return |
|---|---|
| 1 D10 under a run of stalls | **CLOSED on the tree.** Minimum over a 32-tick window, the unit rows and the driven row both engines, born-RED on the pass-8 file, the battery (§1) |
| 2 the floor reds on page stalls | **CLOSED.** The gate reads the delivered form; 20/20 exit 0 at load ≤ 73.5; the rate form prints (1 red burst in 30, delivered GREEN) |
| 3 A.6 vs the formula | **CLOSED per CHAIR §6.** Panel floor 0.9 × A.6's best at R; "UNREACHABLE" struck; 13/13 streams met, both engines |
| 4 the start write | **CLOSED: deleted.** The flash row holds `shown` (0/11, 0/10); pass-7 born-RED 8/11, 3/10 |
| 5 G10's clause-sabotage battery | **6/6 chromium, 5/6 WebKit.** WebKit's ceiling is unreachable alone (stated) |
| 6 the scratch drivers | **OPEN: sources lost** (gap 1); rows 6/8/9/12/π/21 unread |
| 7 G5 in four regimes | **OPEN** (no driver) |
| 8 the flush lag | **NOT attributed.** The cost line is written (§2.5) |
| 9 row 21 / row 20 / row 8 | **OPEN.** Row 20's upper edge is still exceeded (55.6–61.8/s); rows 21 and 8 unread |
| 10 `len:` in the ONE postpaint | **CLOSED by the chair's fold** (homes v2 §4); the flash row runs on it |
| 11 bootHand (VERB) | **HANDED:** the observer is at blob `458bb26f`; the edit is VERB's |
| 12 check 8 on the union | not re-read |

## 5 · The batch gate (pass9/CHAIR-RULINGS §6)

FIVE's D10 cap, keyed on the window MINIMUM, has landed in the tree and on the union delta, with the stall-run rows:
- the unit rows at n = 1, 4, 5, 9, the cliff and 60→30 Hz;
- the critic's probe;
- the driven row in both engines.
`frontGate`/`frontTween`/`panelFrameMs` may now ride by sha (gridPaths.ts blob `458bb26f`). Every consumer still owes its
own stall-run row (LAWS P8 §D).

## 6 · Constraints

- filterBudget 9 is untouched: no filter byte moved. M16 0 (`lint:copy`). No new product string: the delta adds comments
  and spec text only, and no rendered copy.
- Property-block: no `@property` or CSS byte moved. Not re-run.
- π and AA: not re-read (gap 9). No paint byte moved apart from the deleted start write, whose paint effect is the
  flash row.
- No commit, commit-tree, update-ref, stash, push, deploy, publish or npm install. No git ran on main or in the control
  tree. `bbnf-lang` was not touched.

## 8 · Incidents (self-declared)

1. **The resumed tree.** The first pass-9 attempt (run `wf_bf3edb34-8c5`) died at 14:32 on 2026-10-07 in a host reboot.
   This attempt cut the tree through a temporary index first (`0cb3f258`, 34 paths) and compared it with the pass-8
   bank (`c3a863f7`, sha1 `a2323f1e`: the dead attempt's own open cut equals it byte for byte) and homes v2 (`d17813ba`):
   - all 13 home paths equal homes v2 byte for byte (homes v2 was already applied; nothing to strip);
   - beyond bank + homes, nine hunks, each read and KEPT: the `panelFrameMs` minimum (gridPaths.ts), its six unit rows,
     the start write deleted (DifficultyTally.vue), the floor gated on the A.6-delivered form plus the `D10-stallrun`
     row (front-rate.spec.ts), `node:os` declared (e2e/node.d.ts), two stale `@ts-expect-error` lines dropped (the homes
     now ship `.d.mts`), and the scratch serve config `web/frontend/.acc5p9.vite.mts` (never banked).
   - Finished on top: `deliveredRed` renamed `rateRed` (it counted the RATE form's reds), the stall row's battery knobs,
     the panel row's margin print and share knob.
   The dead attempt's numbers were not cited: every row here was re-run this session.
2. **The dead attempt's scratch.** It ran its D10 unit battery with vitest's default cache (main's `node_modules/.vite`
   through the symlink); this attempt used a private `cacheDir`. It left an empty `git init` (0 objects, no commit, no
   ref beyond HEAD's unborn branch) as a discovery ceiling in its scratch; moved to trash. Its logs, plants and archives
   are in the lane's trash dir, not cited.
3. **Two mis-set threshold plants.** The first slack plants were `D10_SLACK=−0.9` and `−1.1`, i.e. the bound moved
   to measured − 0.9 and − 1.1: both red, neither is the +ε arm (`logs/d10-e2e-misset-plants.txt`). Re-run at ±0.1.
4. **A plant swap's reload killed one row.** `d10-p8file9` chromium died on `Execution context was destroyed`: the dev
   server's full reload after the file swap landed inside the row. Not a reading; WebKit's same row read the born-RED.
5. **Plants are served by swapping the product file in the served tree** (dev server, HMR), restored byte-equal with
   `cmp` after each (every restore printed). No reading cites a tree with a plant still in.
6. **Scratch configs in the tree.** `web/frontend/.acc5p9.vite.mts` and `.acc5p9.vitest.mts` (private cacheDirs) sat in
   the tree while it ran; both are excluded from the bank and moved to the trash dir before return.
7. **The reading on an edited tree (LAWS P8 §J).** After every browser battery, eslint red the D10 row's loop
   (`else (tw.stop(), done())`, `no-unused-expressions`), and prettier re-wrapped one line of the unit file. Both were cured,
   then the D10 row was re-read on the FINAL bytes, in both engines, with its born-RED (`logs/final-bytes.txt`, 11:50:56–11:51:48):
   tree GREEN ×2 per engine, pass-8 file RED per engine. The unit file (41/41), `typecheck:e2e`, `vue-tsc -b`, eslint and
   prettier were all 0 after the cure. The G10, panel and flash readings were taken on the final bytes of their own code.
   The only spec edit after them is inside the D10 row's body.
8. **Load.** Every row opened under a 1-minute load of 120. One ended above it: the CLOCK plant's chromium run, 110.8 →
   133.8, which is a clause verdict. The battery waited behind a 60 s poll at 133 (11:37:11). The box ran 29–134 through
   the session.
9. **The first ceiling-only plant was vacuous** (`ceil2` at 128 Hz: GREEN in both engines). It was struck and re-cut at 126 Hz.
   The first ceiling and gap plants each redded two clauses, and both were re-cut (§2.4).
10. **`bank.sh`'s plain delta cut failed on the union** (two specs). It was re-cut by a three-way apply (§0). The first
    `pass9.delta.on-WAVE.diff` that `bank.sh` wrote (28,081 B) was overwritten by the banked one (26,920 B).
## 9 · Replay route

- **The tree:** `git apply --binary pass9.diff` on a clean `74a2b5d9` (or `pass9.delta.on-WAVE.diff` on the WAVE union +
  `pass9/instruments/homes.on-WAVE.diff`). node_modules = a symlink to main's; no install.
- **Servers:** the tree `npx vite --config <a scratch config: the tree's vite.config.ts + a private cacheDir> --host
  127.0.0.1 --port 4236 --strictPort` from `web/frontend`; the control `npx vite preview --config .vite-control.config.ts
  --outDir dist --host 127.0.0.1 --port 4258 --strictPort` from `w7-control/web/frontend` (served
  `index-CubiZsMVSwTc.js`, read by curl at open). Kill by recorded PID after a cwd check.
- **Unit:** `npx vitest run src/pencil/grid/gridPaths.poseFronts.test.ts -t "RUN of stalls"` (+ the critic's probe copied
  beside it as `crit.stallrun.test.ts`); plants as in `instruments/d10b.sh`.
- **Driven rows:** a playwright config with `testDir` = the tree's `e2e/`, `workers: 1`, `retries: 0`, projects chromium
  and webkit, `baseURL` from `BASE` (`instruments/pw.config.ts`); `instruments/run.sh <label> <base> <n> <spec> <grep>
  <engines> [ENV=…]` writes each run's exit to its own file and the 1-min load before and after.
  - `D10-stallrun` with `D10_STALLS`, `D10_STALL_MS`, `D10_SLACK`; `G10-panel` with `G10_PANEL_SHARE`; `G10: every`
    with `HZ`, `CLOCK`, `DEAL`; the tally flash `never paint whole`.
  - The sequences: `instruments/e2e-d10.sh` and `instruments/g10b.sh` (plants are swapped into the served tree and
    restored with `cmp`).
- **Bank:** `instruments/bank.sh` (temporary indexes in the worktree's git only; no commit, no ref, no stash).
- The instrument scripts name the lane's durable scratch (`.claude/t9-scratch/work/pass9/ACC-FIVE/`) as their root; the
  banked diffs do not (grep in §0).
