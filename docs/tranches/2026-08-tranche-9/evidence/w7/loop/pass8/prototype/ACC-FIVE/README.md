# ACC-FIVE · pass 8 · prototype return (attempt 4, resumed)

Tree `.claude/worktrees/wf_f72f3b5a-83a-41` on `74a2b5d9`. Port 4236 (lane), 4251 (control, `index-CubiZsMVSwTc.js`).
Box load across the chain: **13.98–91.74** (74 playwright runs, 11:16–12:05). Every number below was re-measured
by this attempt; nothing from the three dead attempts is cited. No frame banked: **0 B of the wave's 151,826 B
headroom spent**.

## 0 · Gaps first

1. **The chair's floor formula and A.6 contradict on five real panel rates.** A.6 (no two re-cut frames closer
   than 15.5 ms) caps a panel at `Hz / ⌈15.5·Hz/1000⌉`. The charter's floor `0.9 × min(Hz, 62.5) = 56.25` is then
   unreachable by ANY A.6 gate at **75 Hz (37.5/s), 90 (45.0), 100 (50.0), 144 (48.0), 165 (55.0)**. It holds at
   30, 60, 120, 125, 240. Served `frontGate`, exact streams, both engines (G10-panel): the gate reaches A.6's best
   at every rate. Those five rows are gated at `0.9 × A.6's best` and print the chair's verdict as `UNREACHABLE
   under A.6`. Not re-worded to pass. **This is the chair's ruling to make:** A.6's 15.5 ms or the formula.
   The pass-7 claim that the formula "is exact wherever two frames clear A.6 (≤ 129 Hz)" was false, and I've
   corrected it in the unit file.
2. **The DOM clock reds in 10/10 runs per engine** at 125 and 60 Hz (DOM min 6.0 ms WebKit, 6.4 chromium). At
   30 Hz it's 0/5 chromium and 2/5 WebKit. **Named defect: THE FLUSH LAG.** A re-cut's `d` reaches the DOM after
   the rest of its frame's work, and that wait varies frame to frame: 0.2–3.3 ms chromium and 1–21 ms WebKit. A
   pair's DOM gap is its frame gap minus the lag difference, for example frames 17362→17378 (16.0) at lags
   6.0/1.0 give DOM 11.0. **This regressed from pass 7's 2/11 WebKit.** Cure 1 lands commits on consecutive
   16 ms frames with no +1 of slack, so every lag jitter reaches the DOM. Not cured: A.6 binds the frame clock
   (§2.4), and the frame clock holds in every run (frame min 15.5 chromium, 16.0 WebKit).
3. **One WebKit burst sits under 49/s:** t60 r2 tally 47.6/s at load 90.9–91.7. Its A.6-delivered floor was 42.8,
   so the page offered too few frames and the gate kept every one. It still reds the chair's clause (1/5 WebKit
   HZ=60 runs). DEAL=EASY reds the chair's floor on the boot-time tally burst in both engines (54.3 chromium /
   52.2 WebKit; delivered 48.9/47.0 GREEN; the pump dropped 58/73 vsyncs at boot).
4. **INTAKE-23 row 20 is not met as written.** Its bar says gated rates stay "49–52/s unchanged". They ROSE:
   WebKit reads 60.1–62.5/s at 125 Hz and 55.6–60.1 at 60 Hz, with 49/50 bursts ≥ 49 and none inside 49–52. The
   lower edge holds (bar the one burst above). The upper edge is exceeded, and the budget's own ceiling of
   62.5 still holds. The chair reads which edge binds.
5. **Row 21's 0-encode condition is UNREAD.** The encode count under the wave is VERB's G-D2 instrument and was
   not run on the union. The stall here is PLANTED. OPEN on the law's own condition.
6. **Row 8's dark border is NOT cured:** 2.768 < 3 against the control's 2.441, identical on tree and union,
   both engines, DPR 1/2. The loss stays in ROW B's caption as that number.
7. **Surface holes, named.** Each plant reds its unit row. `pceil155` (FRONT_MIN_MS 14.5) is GREEN on G10 in both
   engines: no timer-driven clock can see a 14.5 ms slot, and 1000 Hz is out of reach once nested-timer clamping
   kicks in. `pgap8` (FRONT_GAP_MS 8) is RED in chromium (8.0 ms) and GREEN in WebKit on this run. The G10
   `seen` clause has no plant.
8. **The union's `lint:bands` reds on my `FRONT_GAP_MS = FRONT_MIN_MS − 0.5`** (B13 ARITHMETIC). The cure is an
   ADMITTED_ARITH row (`expr "FRONT_MIN_MS - 0.5"`, `ms 15.5`) carried in the on-union delta only, since the script
   is absent at `74a2b5d9`. With the row: exit 0. Plant `ms: 15`: exit 1 ("the row licenses ONE value").
9. **The boot hand still reads 30 Hz as a stall.** On the union, `bootHand.ts:24` caps at `MOTION.hand.stepMs`
   with no panel observation. `frontTween` now observes the panel; the boot hand doesn't. That's VERB's row
   (registry §6 coupling), not changed here.

## 1 · The resumed tree: what I found, what I kept

Before touching anything I took the tree through a temporary index (`GIT_INDEX_FILE`, write-tree `a7c34ec6`, 31
files incl. `.acc5-p8/` scratch). Then I rebuilt the pass-7 bank (`74a2b5d9` + `pass7.diff` → `6b92ba6d` = BANKED.txt's
tree, sha1 `d8edfa85`), and bank + `homes.diff` (sha1 `a1d8adeb` = README's) → `ccfeec92`. The dead attempts had
applied homes.diff and left 15 files of edits beyond it (847+/91−). Their product tree was `7dbce330`, the one the
last attempt's battery ran on. Per hunk:

| hunk | decision |
|---|---|
| `gridPaths.ts` grid gate: slot per FRONT_MIN_MS + `FRONT_GAP_MS = FRONT_MIN_MS − 0.5` on frames; the +1 only on WALL writes; `panelFrameMs` (median of nine one-per-frame ticks, stepMs until five) in `frontTween` | KEPT (rows 1, 2, LAWS P7 §F 30 Hz) |
| `DifficultyTally.vue` `gate.write(0, true)` in `runDrawIn`'s flush + `shown` ref committed with the reveal | KEPT (row 3) |
| `HandDrawnGrid.vue` `filled`/`fillable` REQUIRED, no 0/1 default | KEPT (row 9) |
| `rate-clock.ts` driven clock stamped on its vsync grid (`STAMP=wall` keeps pass 6), per-callback guard, `HZ` env | KEPT (the floor is only attainable on a clock that is a panel) |
| `front-rate.spec.ts` floor clause, both clocks printed, clause table, G10-panel | KEPT + FINISHED (below) |
| `tally-flash.spec.ts` (product home of the pass-7 critic) + `check-pw-projects` manifest row | KEPT |
| `progress-corridor.spec.ts` own `lum`/`ratio` → the ONE `paint-lib` | KEPT (LAWS §I) |
| `e2e/lib/postpaint.mjs` `len:` subject + its self-test plant | KEPT, **PROPOSED** to the ONE copy (`instruments/postpaint-len.PROPOSED.diff`, byte-equal to the tree's hunk); the chair may strip it from the fold |
| unit rows (`gridPaths.poseFronts.test.ts` +229) | KEPT + FINISHED |

Finished this attempt, before any battery ran:
- The unit cadence block: I corrected the false "≤ 129 Hz" claim and added 75/90/100/165/240 Hz rows. Each is
  gated at `0.9 × A.6 best`, plus an A.6-best attainment assert. Result: 35/35.
- `front-rate.spec.ts` G10-panel: the same five rates plus 240 Hz. Each row prints A.6's best and the chair's
  verdict, and the gate is `min(chair, A.6 best)`.

The battery ran on an UNEDITED tree. The START and AB-DONE sha1s of `gridPaths.ts`, `DifficultyTally.vue` and
`front-rate.spec.ts` are equal (`2d7b7192`, `7e149208`, `181572c9`).

## 2 · Charter rows

| # | row | verdict | the number |
|---|---|---|---|
| 1 | drop the +1 on the frame clock; 60 Hz whole-ms ≥ 59/s; 60 AND 30 Hz beside 125; WebKit > 49 | **CLOSED on the panel; one WebKit burst under 49 (gap 3)** | G10-panel 60 Hz whole-ms **120/120 frames, 60.0/s** both engines. Born-RED `plus1u` (+1 back on the frame clock) WebKit **40.2/s** (80/120), `plus1` (pass-7 file) 40.2/s; chromium GREEN by construction (fine clock). Driven G10 WebKit: 125 Hz 60.1–62.5/s (5/5 exit 0), 60 Hz 47.6–60.1/s (4/5), 30 Hz 29.9–30.1/s (5/5). Chromium: 57.8–62.5 / 57.7–60.1 / 30.0–30.1/s, 15/15 exit 0 |
| 2 | G10 floor ≥ 0.9 × min(Hz, 62.5), slow-49 RED in-run | **CLOSED at 30/60/120/125/240 Hz; CONTRADICTED by A.6 at 75/90/100/144/165 Hz (gap 1)** | `pslow49` RED floor both engines, **17.6–18.0/s**; unit 15/35 red. G10-panel prints the five unreachable rates |
| 3 | tally start in `runDrawIn`'s flush; 0 of ≥ 10 whole-frame strokes both engines | **CLOSED** | `tally-flash.spec.ts` tree **0/12 chromium, 0/10 WebKit**; union **0/10, 0/12**. Plant `tally7` (the pass-7 file) **7/10, 5/11 RED**. Count-clause sabotage (`MAX_ACTS 2`) exit 1 ("only 3 tier-changing inks were read") |
| 4 | A.6 on the FRAME clock, DOM printed, DOM red ≥ 2/10 named | **frame clock HOLDS; DOM defect NAMED, not cured (gap 2)** | frame min ≥ 15.5 chromium / 16.0 WebKit in every gated run; DOM < 15.5 in 10/10 per engine (125+60 Hz). Clause as restated: "every burst's shortest gap between re-cut FRAMES ≥ 15.5 ms (rAF timestamp); the DOM gap printed, with the pair and both lags" |
| 5 | all three cures on THE UNION; `on-s13-s7-s3` cut; `stepMs` one key | **CLOSED** | on-union delta applies 0 on `1f8a729a` (union + `homes.on`); 4 merges 0 conflicts, line counts exact. The union's `lint:bands` row rides it (gap 8). Union G10: 125 Hz 2/2 per engine exit 0 (chromium 59.2–62.3, WebKit 60.2–61.7), 60 Hz 1/1 exit 0, 30 Hz 1/1 exit 0, panel exit 0, flash 0/10 · 0/12. **`MOTION.hand.stepMs`:** my tree (base `74a2b5d9`) has no `bootHand.ts`, so its boot draw-in reads no stepMs. On the union `bootHand.ts:24` reads the ONE key (`pencilConfig.ts:496`, 17), and `FRONT_MIN_MS = stepMs − 1` on both |
| 6 | G5 tail via the ONE glyph-pop, TAIL12 on text nodes, HEAD plant, the 2/16 blind cells | **CLOSED** | clean **16/16 GREEN**. FAINT30, FADE65, FADE80, **TAIL12 16/16**, TAIL35, **HEAD12 16/16**, MID20, EMPTY each **RED 16/16**, incl. the pass-7 blind cells (chromium DPR1 dark rest/hover). No `applyTailText` anywhere in `e2e/`, `scripts/`, `src/`. One payload minted off the control (61 givens) |
| 7 | B-G5-DEPTH hidden cost | **WRITTEN** | 25 % default: the leave verb's ink reads OKLab chroma **0.0499 light / 0.0502 dark**, from the computed `oklab(0.2498 0.0485 0.0117)` / `oklab(0.8816 0.0484 0.0136)`. The control's ink is `rgb(10,10,10)` (chroma 0) on the 8 % ground pass 6 removed. **The default's loss: `leave` is marked by stroke weight and 0.05 of chroma, where the control used weight + a ground.** A reader who sees no colour gets weight alone |
| 8 | dark border 2.768 vs 2.441 | **NOT cured, loss kept (gap 6)** | tree = union: dark BORDER **2.768** (control 2.441), LINE 3.069 (3.139), PAPER 3.606 (3.139); light 3.217 / 3.236 / 3.856 (control 3.177 / 2.876 / 3.760) |
| 9 | G9 TALLY exercised, SPARK closed; "0 of 1 on the board" | **CLOSED** | Fresh HARD deals, tally inked 1–2. **TALLY RED on its own surface 4/4** (100 % vs clean 0 %). **SPARK closed by G9b** (the glow alone: 98.81–100 % vs 0 %) 4/4. TRACE 4/4. G9 as read (viewport, never re-cut): tree 9.73–22.14 % (2 of 4 cells over 12 %), control 23.24–62.95 % (4/4 over). Arms are separate deals: numbers only. `filled`/`fillable` REQUIRED: a mount without counts is a type error (vue-tsc -b exit 0, so every mount passes both) |
| 10 | row 21: 0-encode law READ; OFF arm post-paint on ONE deal, or numbers only | **numbers only; the law's condition UNREAD (gap 5)** | `r21.mjs` through the ONE postpaint recorder (`len:` subject), fresh EASY deal each run. Under a 240 ms stall, worst single-read rise in drawn glyph length: **(a) shipped OFF: 19.4–20.6 % chromium, 19.6–21.9 % WebKit · (b′) ON: 1.4 % chromium, 1.5–1.6 % WebKit**. Clean: 0.8–0.9 / 1.5–1.8 % both arms. (b′)'s wave window **+208–217 ms chromium, +247–264 ms WebKit**. 3 runs × arm × engine. 0 B spent |
| 11 | row 20 at its own bar in WebKit | **see gap 4** | 49/50 WebKit bursts ≥ 49/s, 0 inside 49–52 |
| 12 | the gold's AA on the union | **PRINTED** | `#a27803`/dark `rgb(126,106,23)` on the union, painted, both engines, DPR 1/2: **light LINE 3.236 · BORDER 3.217 · PAPER 3.856; dark LINE 3.069 · BORDER 2.768 · PAPER 3.606** (medians). Control violet: light 2.876 / 3.177 / 3.760, dark 3.139 / 2.441 / 3.139 |

## 3 · Born-REDs and the clause-sabotage battery (LAWS P7 §F (ii))

G10 (driven 125 Hz unless named), one run per engine, same batch as the clean runs:

| plant | seen | clock | interleave | ceiling | gap | floor |
|---|---|---|---|---|---|---|
| `pablate` FRONT_MIN_MS 0 | G | G | G | **RED** 125.0/s both | **RED** 7.2–8.0 | G |
| `pgap8` FRONT_GAP_MS 8 | G | G | G | G | **RED** chromium 8.0 · G WebKit (hole on this run) | G |
| `pslow49` FRONT_MIN_MS 49 | G | G | G | G | G | **RED** 17.6–18.0 |
| `pplus1u` +1 on frames, HZ=60 | G | G | G | G | G | **RED** WebKit 39.8–42.1 · G chromium |
| `pplus1` pass-7 file, HZ=60 / 125 | G | G | G | G | G | **RED** WebKit 37.6–42.0 / 40.8–41.7; chromium 51.4 (1/3 bursts) at 60 |
| `pceil155` FRONT_MIN 14.5, GAP 14.5 | G | G | G | **G (hole)** | G | G |
| CLOCK=60 shim | G | **RED** 59.9 / 58.8 Hz | G | G | G | RED |
| DEAL=EASY | G | G | **RED** 4.00 d/frame | G | G | RED (tally, gap 3) |
| STAMP=wall (the pass-6 pump) | G | G | G | G | G | **RED 4/4** (48.3–58.3/s; delivered G) |
| `seen` | no plant (hole) | | | | | |

G10-panel: `plus1u` and `plus1` RED in WebKit, 60 Hz whole-ms 40.2/s. Chromium is GREEN by construction.
Unit (`gridPaths.poseFronts.test.ts`, 35 rows, clean 35/35): `plus1u` 7 red · `warm1` 2 · `slow49` 15 · `ablate` 9 ·
`gap8` 7 · `ceil155` 5 · `tick1` 1. Union `lint:bands`: without the row exit 1, with exit 0, `ms 15` plant exit 1.
`postpaint.mjs --self-test` with the PROPOSED `len:`: exit 0 both engines. `len:#grow` moved 59 frames and is
SEEN; `ruled:#grow` moved 0 and is EMPTY (the hole it closes).

## 4 · π, AA, constraints

- **π** (whole-DOM, `pi.mjs`, one payload, 1280×800 fine PRM, both engines × light/dark, tree dist vs `74a2b5d9`):
  1155 nodes both arms, 0 only-control, 0 only-tree. **1 difference, on a CLAIMED surface:** the sparkle glow's
  `drop-shadow` is violet on the control and gold on the tree (the section's ink). The in-run floor plant
  (`.section-heading` letter-spacing) is seen in all four cells (2 diffs).
- **AA**: rows 8 and 12 (painted, `tg.mjs` through `paint-lib`). A caveat: WebKit's control LINE footprint is
  9,580 px at DPR1 against the tree's 1,568. The control's dashed re-stroke paints wider than the tree's
  geometry-cut front, so the populations differ in size.
- **filterBudget** (built dist): light 6/6 both engines, tree = control. Dark 2 failed in both engines, tree =
  control, byte-identical red body (`svg.crayon-heart.idle ⟨saturate(0.85)⟩` ×2 unclaimed). That red is
  inherited; its ratified deletion rides `s13-s7-s3`. Union (built): light 8/8 and dark 8/8 in both
  engines. The union's crayon-heart deletion clears the inherited dark red.
- **M16**: `lint:copy` exit 0 on tree, union and control. No new product strings.
- **Dist identity**: tree `index-CmdVcGMKKM-6.js` + `index-zQfWBdL5jkCU.css`, union `index-hVhXTkUyJYPW.js`, both
  built OUT OF TREE (`git archive` scratch). The served CSS equals the build byte for byte on both.

## 5 · The pre-return battery (bare; tree · control `74a2b5d9` · union+delta)

| gate | tree | control | union |
|---|---|---|---|
| vue-tsc -b | 0 | 0 | 0 |
| typecheck:e2e | 0 | 0 | 0 |
| vitest src/pencil | 0 (112) | 0 (73) | 0 (142) |
| vitest src/composables | 0 (16) | 0 (16) | 0 (16) |
| vitest src/games | 0 (741) | 0 (741) | 0 (777) |
| lint:ink · catch · theme-selectors · theme-tokens · lanes · sleep · motion · copy · live-regions · tdz | 0 | 0 | 0 |
| lint:bands | 1 (script absent at base) | 1 (same) | 0 with the row (1 without; union-before 0) |
| lint:verbs | 1 (absent) | 1 (absent) | 0 |
| test:e2e:projects (check-pw-projects) | 0 | 0 | 1, **inherited**: union-before exits 1 on the same 4 OUT-OF-BAND rows |
| test:e2e:retries · test:support-floor | 0 | 0 | 0 |
| npm run lint (prettier) | 0 | 0 | 0 |
| lint:knip | 0 | 0 | 0 |
| eslint . --max-warnings 0 | 0 | 0 | 0 |
| check-property-block (source + dist + served) | 0 | 0 (with `--dist`; 1 without, an invocation miss) | — |
| check-property-block --self-test | 0 | — | — |
| front-rate.spec.ts (whole file: G10 + G10-panel) | §2, §3 | — | §2 row 5 |
| tally-flash.spec.ts | 0 both | — | 0 both |
| progress-corridor.spec.ts (whole file, built dist) | 0 (8/8 both engines) | 1 (8/8 fail both engines at a precondition: the control's gauge reads `0.95` where the spec expects `1`; the spec is this family's gate on its own ink, and its born-REDs never reach their message on HEAD) | — |
| filter-census.spec.ts | §4 | §4 | §4 |

## 6 · The bank

- tree at bank (write-tree over product paths, scratch excluded) **`c3a863f79c94db736347ad74cc99c56656a217e0`**
- `pass8.diff` on `74a2b5d9`: **486,711 B**, sha1 `a2323f1ecee129cb7e8e7285aceef1265071da1d`, **26 files changed,
  9627 insertions(+), 165 deletions(-)**. `git apply --check` on a fresh `git archive 74a2b5d9`: **0**.
- `pass8.delta.diff` on `ccfeec92` (= `74a2b5d9` + pass7 + homes): 71,029 B, sha1 `6900c518…`, 10 files +749/−91. Check **0**.
- `pass8.delta.on-s13-s7-s3.diff` on `1f8a729a` (= union `98454964` + `homes.on-s13-s7-s3`): 71,842 B, sha1
  `728912ca1d1dafc17e1f251db7cea2ff7a35b6b2`, 11 files +755/−91 (incl. the union-only `check-motion-bands.mjs` row).
  Check **0**. On the bare union `98454964` it exits 1: `e2e/lib/postpaint.mjs` doesn't exist there until homes land.
- `pass8.cum.on-s13-s7-s3.diff` on `98454964` (homes.on + this delta): 367,355 B, sha1 `fc96aa03…`, 17 files. Check **0**.
- Union + delta tree `ef4d93c3f0af44870d856bc2ddccdf3f5bd32de6`.
- After the scratch moved out, the tree re-reads `c3a863f7` (unchanged since the bank), and `git status` shows
  product paths only. `check-evidence-policy` exits 0 (PASS). The lane banked no PNG. `BANKED.txt` sits beside.

**Instruments, by relative product path.** `e2e/front-rate.spec.ts` → `./rate-clock`.
`e2e/tally-flash.spec.ts` → `./lib/postpaint.mjs`. `e2e/progress-corridor.spec.ts` → `./lib/paint-lib.mjs`. The
scratch drivers (`g5`, `g9`, `tg`, `r21`) import `../e2e/lib/{glyph-pop,paint-lib,postpaint}.mjs` from the
tree. Nothing in `e2e/` or `scripts/` imports from `docs/` (grep: 0).

## 7 · Replay route

1. `git archive 74a2b5d9 | tar -x`, then `git apply pass8.diff`. On the union: `98454964` +
   `pass8.cum.on-s13-s7-s3.diff`.
2. The chain's scripts live in the session scratchpad `five8s/` (`master.sh` → `prep.sh`, `lints.sh`, `tsc2.sh`,
   `final.sh` → `battery.sh`, `plants.sh`, `post.sh`; then `bank.sh`, `fcu.sh`, `corr.sh`). Plants are copies
   of the tree archive with one sed or python edit each (`prep.sh`), served in turn on 4236.
3. G10: `BASE=<url> [HZ=60|30] [STAMP=wall] [CLOCK=60] [DEAL=EASY] npx playwright test e2e/front-rate.spec.ts
   --grep "G10: every"`. The panel: `--grep G10-panel`. The flash: `e2e/tally-flash.spec.ts`.
4. Text logs are in `logs/`: `g10-battery-and-plants.txt` (every run), `g10-aggregate.txt`, `unit-plants.txt`, the
   lint and tsc tables, `bank.txt`, `g5/g9/tg-*/pi/r21-*`, the bands and projects pairs.

## 8 · Incidents (self-declared)

- **Resumed from three dead attempts.** Their evidence is not cited. Their scratch `five8r/` is kept, not reused
  for numbers; this attempt ran fresh in `five8s/`.
- **The control on 4251 was still up.** The chair said it stopped the servers, but the listener `93706`
  (wrapper `92897`) was the dead attempt's own. I checked it against its recorded PIDs, its cwd (`w7-control`)
  and its identity (`index-CubiZsMVSwTc.js`), then adopted it as this lane's control and killed it at return.
- **My first union filter-census run died.** It never read a census: the scratch config outside the package
  couldn't resolve `@playwright/test`. I re-ran it with the config inside the union archive (`fcu.sh`).
- **My first property-block run on the control reds on invocation.** It had no `--dist`; with the control's
  `dist/` passed (read only), it exits 0.
- One typo'd redirect to `/tmp/x` failed as "is a directory" and wrote nothing.
- The scratch `web/frontend/.acc5-p8/` (playwright configs + the sabotage spec) was moved out to
  `<scratchpad>/trash-acc5-p8-4/` before return. No `rm` of any form.
