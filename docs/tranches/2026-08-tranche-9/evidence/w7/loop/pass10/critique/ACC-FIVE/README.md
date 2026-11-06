# ACC-FIVE · pass 10 · critique (§3 accent)

Critic, not the author. The number is mine (LAWS P8 §C). Scratch: `.claude/t9-scratch/work/pass10/crit-ACC-FIVE/`
(archives each `git init`-ed; the run tree = `git archive e4ea2820 web/frontend` + its own `.git` + the lane
worktree's `node_modules` symlinked; a private vite/vitest cacheDir). Ports: tree dev :4236, control preview :4258
(`w7-control`, `index-CubiZsMVSwTc.js`, CSS `index-CMaYSiPKVidg.css`). Nothing of mine touched the lane's worktree,
main's `src/e2e/scripts`, or the control tree; git ran only through temporary index files and in my own archives.

## 0 · Numbers first, gaps first

**THE §8.1 ROW IS NOT CLOSED BY CLASS.** The cure keys the stall's-remainder exclusion on a PER-TWEEN flag (`held`)
while the window it guards (`ticks`) is PAGE-GLOBAL. A front that did not see the stall reads the remainder into the
window. Born-RED on the bank's own blob `f67c70ee`, literal bounds, in one run beside its negative control:

| critic row (`instruments/crit.remainder.test.CRITIC.ts`) | cure `f67c70ee` | first-tick-only `c0fbe399` | pass 9 `458bb26f` | pass 8 `eeb58de2` |
|---|---|---|---|---|
| SOLO: warm 30 Hz page; a front started at a long task's END (1 ms partial), then the 6 ms remainder | **RED**: travel 1.0/6.0/**17.0 ×13**/12.0, ends frame **16** (bound 11) | RED | RED | GREEN |
| TWO TWEENS: W runs through the stall (held, its remainder excluded), C starts at the task's end | **RED**: C 17.0 ×13, frame 16 | RED | RED | GREEN |
| NEGATIVE CONTROL: C started EARLY in the task (140 ms partial, held) | GREEN | RED | RED | GREEN |

The negative control is GREEN only where the remainder clause exists, so the clause is live, and the two reds are
the class it does not reach: the exclusion keys on what the TWEEN saw, the statistic on what the PAGE saw. The
product's commonest start is exactly this shape (a user action's long commit flushes a watcher that calls
`start()` at the task's end). The same two reds read on the WAVE result tree `b4596539` (gridPaths `d15e5bdf`).
Real-engine reach is UNPROVEN: the remainder is a timer-clock artefact (headless; the D10 print's 6–9 ms), and the
driven vsync-stamped clock cannot make one. The lane's cure is for the same artefact, so the class is the lane's.

**Re-derived (the lane's own numbers, my run):**
- Unit born-RED, one run per arm (`logs/unit.*.log`, 17:31:29–17:31:37, load 8.5): cure 61/61 of the lane's rows +
  `crit.partial30` (pass-9 critic verbatim) GREEN; pass-9 file 15 red of the lane's (= the lane's 15); pass-8 file 7
  red (= 7); first-tick-only 1 red (= 1). Exact agreement with `logs/unit-r1.log`.
- The bank: `pass10.diff` sha1 `fb306ac6…` 214,749 B and `pass10.delta.on-WAVE.diff` `16bc1b97…` 24,891 B (shasum);
  replay `74a2b5d9 + homes.diff (07257854) → ac862f1e + pass10.diff → e4ea2820` reproduced through a temporary index,
  and the lane worktree's own temporary-index cut reads `e4ea2820`; pass 9's `2d13eaf1 + homes.on-WAVE.diff →
  3e88e122`, and `3e88e122 → e4ea2820` is exactly the 3-path advance (+262/−15). Homes by sha: the 20 banked paths and
  the 13 home paths are disjoint (no residual home edit). On-WAVE: `954bbbab + homes.on-WAVE.diff → 8c46d9de` (the
  declared base) `+ delta → b4596539`, both reproduced.
- Browser rows: §3.

**Gaps (exact, carried into the return):** §5.

## 1 · The bank, re-derived (my archives, each with its own `.git`; every line prints its git dir and path count)

| check | git dir | paths | exit |
|---|---|---|---|
| `pass10.diff` on `74a2b5d9` (archive) | `<S>/arc/74a2b5d9/.git` | 20 | **0** |
| `pass10.diff` on s13-s7-s3 `2f11714f` (archive) | `<S>/arc/2f11714f/.git` | 20 | 1 (48 errors: the tree already carries FIVE's pass-9 paths — expected, the full bank is not the route there) |
| `pass10.diff` on the WAVE `954bbbab` | `<S>/arc/954bbbab/.git` | 20 | 1 (48 errors, same reason) |
| `pass10.delta.on-WAVE.diff` on `954bbbab` | `<S>/arc/954bbbab/.git` | 3 | **0** |
| delta on the DECLARED base `8c46d9de` | `<S>/arc/8c46d9de/.git` | 3 | **0** |
| delta on s13-s7-s3 `2f11714f` | `<S>/arc/2f11714f/.git` | 3 | **0** |
| delta on `74a2b5d9` (negative: not its base) | `<S>/arc/74a2b5d9/.git` | 3 | 1 (5 errors) |
| temporary index: `954bbbab + homes.on-WAVE → 8c46d9de + delta → b4596539` | lane worktree git dir, `GIT_INDEX_FILE` under `<S>` | — | **0**, both tree ids reproduced |

`<S>` = my durable scratch. Grep of both banks: `scratchpad` 0, `/private/tmp` 0, `/tmp/` 0, `.claude/t9-scratch` 0,
`acc5` 0, `docs/` 0 (no instrument imported from docs). The 20 banked paths and homes v3's 13 are disjoint. The bank
is honest; the route the README names is the route that applies. Declared: the temporary-index cut wrote blobs
into the shared object store (the fold's declared class).

**The on-WAVE delta RUN, not only checked** (the lane's own gap 8): `b4596539`'s `web/frontend` archived with its own
`.git`, vitest chunked (`logs/unit-wave-run.log`, 17:31:51–17:32:16, load 8.2): `src/pencil` 21 files / 217 tests,
**2 red = my two critic rows only** (the lane's 61 and `crit.partial30` GREEN on the WAVE's gridPaths `d15e5bdf`);
`src/composables` 16/16; `src/games/shared` 4 red of 511 — `useSession` F1/U3/U5 and `BoardHost.authors` ring-ink —
which read **identically on the bare WAVE `954bbbab`** (`logs/arc-wave-shared.log`, exit 1, 4 red): the §11 union
contradictions CHAIR §9 names, not FIVE's. The delta's three paths do not reach them.

## 2 · Constraints

- **M16** (`lint:copy`, check-copy-register): exit 0, "0 em/en dashes and 0 unadmitted jargon". `lint:motion` 0 (37
  specs). `lint:sleep` 0 on the tree (`logs/lint-sleep.log`). eslint on the three advance files 0.
- **filterBudget 9**: `src/pencil/config/filterBudget.ts` is not in either bank; the only filter bytes the bank
  moves are the `.sparkle-icon` drop-shadow's colour (a CSS filter value through `--sparkle-glow-soft/strong`, count
  unchanged). No census row is owed by the advance (its three paths are logic, a unit file, a spec).
- **@property**: 0 occurrences in `pass10.diff`.
- **π vs `74a2b5d9`: CITED, NOT RE-DERIVED, AND PAYLOAD-BLIND.** The lane's π (1044 nodes, 1 difference) is read on
  ONE payload — five cells by `encodeSudoku`, no user entry, no progress trace, no gallery, no poster, no peer. The
  bank moves two tokens (`--color-user-ink` #2563eb → #026fc4 / dark #60a5fa → #47a7ff; `--color-progress-ink`
  #8b5cf6 → #a27803 / dark #7c3aed → #7e6a17) named in **15 non-test product files** beside `index.css` (`GameBoard`,
  `PosterBoard`, `gameCell.css`, `GameControlPanel`, `BoardHost`, `defineGame`, `playerIdentity`, `useJoinWash`,
  `useSession`, `useStagingBridge`, `GameCard`, `GameGallery`, `GameGallery/types`, `HandwrittenGlyph`,
  `HandDrawnGrid`), and the π payload paints none of them (that is why it reads 0 differing nodes
  for two moved tokens). A π that cannot see the consumers of the bytes it moves cannot find the undeclared pixel:
  the token half of π is UNREAD. Not my re-derivation either (no build of mine), so π stays a lane claim.
- **AA from painted bytes: UNREAD a third pass** (the lane says so). Row 8's dark border 2.768 < 3 stands
  un-re-derived; on the user-ink/progress-ink consumers above, nothing painted has been read by anyone since pass 8.

## 4 · The chair's pick and the §8.1 row, judged

**PICK 6 (the ride; row 1 gates every pass-10 blob of frontGate/frontTween): MET IN LETTER, NOT IN CLASS.**
- Met: the partial first tick is cured at the primitive (`first` → `panelFrameMs(…, partial)`); partial-start rows
  sit beside the stall-run rows in one describe; `crit.partial30` GREEN 6/6 on the bank's blob, RED on pass 9's; the
  pass-8 negative reds the stall run in the same run (my §0 re-derivation agrees with the lane's counts exactly);
  the stall-run rows' self-cited `stepMs + 1` re-typed as the literal 18 (LAWS P9 §F). It landed first (a 3-path
  advance on pass 9's tree), and the cure blob `f67c70ee` is what a consumer can take by sha.
- Not met by class: the statistic is a MINIMUM over a page-global window, and its guard is per-tween. Every door by
  which ONE sub-frame interval reaches `ticks` pins a slow panel at the step for 32 frames. The lane closed two doors
  it found (the tween's own partial; the remainder after a tick the SAME tween held) and declared a third (a short
  tick after a healthy one). My rows open a fourth it claimed closed: the remainder seen by a tween that did not see
  the stall (§0, RED on the cure, the negative GREEN). That is the class cure the checklist names: cured for its
  plants, OPEN for its class. A frame-keyed `held` (set by whichever tween read the stall, keyed on `tickAt`) or a
  statistic that one outlier cannot move (a low quantile; a reading admitted only after k agreeing ticks) would
  close it; neither is mine to cut.
- Cost declared and checked: the cure adds one tick at the step on a fresh 30 Hz page (five, not four). The
  D10-partial30 arms still end on frame 10–11.

**The §8.1 row's four parts.**
1. *The first-tick exclusion*: landed (above). Class residue OPEN (above).
2. *crit.partial30 GREEN beside the stall-run rows*: MET, re-derived (§0).
3. *The healthy-travel clause*: GATED on D10-stallrun as `min(dt, 17) − slack` and on D10-partial30 as `dt − 1` per
   whole 30 Hz frame from the fifth step. On D10-stallrun it is a 60 Hz clause that cannot see a 30 Hz half-speed
   front (min(dt, 17) = 17 lets a 33 ms frame travel 16) and is blind in headless chromium to any cap above ~8.3 ms
   (the lane's own `healthy-slow` GREEN there): the clause that carries the class is D10-partial30's. Its
   disjunct-specific plant (`slowed` alone, frames ≤ 11) was never run by the lane — `healthy-slow` reds both
   disjuncts at once (frame 15). Mine: §3, plant `slow95`.
4. *FLOOR_SHARE ±ε*: the knob is real (`G10_FLOOR_SHARE`), the held share printed per consumer, the at-R rate form
   gated as `rateform`. The ε pair brackets the HELD share (0.92 G / 0.95 R chromium; 0.92 G / 0.97 R WebKit), not
   the shipped 0.9: it measures the constant's slack (+0.021 WebKit, +0.024 chromium at load 9–15), which is thin
   and unread above load ~15. The fitted literals are not in registry §9 (LAWS P9 §E) — the lane says so.

## 6 · Replay

Scratch run tree = `git archive e4ea2820 web/frontend` (from the lane worktree's git dir) + `git init` + the lane
worktree's `node_modules` and `csp-solver` symlinked; WAVE run tree = the same from `b4596539`; apply-check archives
= `git archive` of `74a2b5d9`, `2f11714f`, `954bbbab`, `8c46d9de`, each `git init`-ed. Unit: copy
`instruments/crit.remainder.test.CRITIC.ts` to `src/pencil/grid/crit.remainder.test.ts` and pass 9's
`crit.partial30.test.CRITIC.ts` to `src/pencil/grid/crit.partial30.test.ts`; `instruments/unit.sh` (arms by blob
from the shared store: `f67c70ee` cure, `c0fbe399` first-tick-only, `458bb26f` pass 9, `eeb58de2` pass 8),
`instruments/unit-wave.sh`. Browser: `instruments/serve.sh` (run as a held background job — guarded kills a server
whose caller exits), `battery.sh <engine>` then `battery2.sh <engine>`, each row one `guarded` call through `run.sh`
(`--exclusive webkit` for WebKit), config `.crit5.pw.config.ts` in the run tree (workers 1, retries 0). Plants:
`instruments/plant-heavy.diff` (the lane's, re-minted on `f67c70ee`, bytes `od -c`-checked), `plant-slow95.diff`
(mine: whole 30 Hz frames travel 0.95 of their capped dt, the `slowed` disjunct alone).

## 3 · Browser rows, my run (tree dev :4236 = `e4ea2820`'s `web/frontend`, control preview :4258 `index-CubiZsMVSwTc.js`)

Each row is one `guarded` call (`run.sh`); each re-queues for the browser pool (6 machine-wide), so rows are spaced
by the queue, not by me. Zone inuse and the 1-minute load are printed per row in `logs/battery-<engine>.log`.

### 3.1 Chromium

| row | arm (`gridPaths.ts` blob) | exit | reading | load · inuse |
|---|---|---|---|---|
| D10-partial30 | cure `f67c70ee` | **0** | 5/5 arms; frames **8/8/8/8/9**; every step 32.6–33.3 from the FIRST (window warm at arm start); 0 slowed | 10.9→6.6 · 15,760 |
| D10-stallrun (5) | cure | **0** | 17.0 ×5 (dt 142/158/150/150/150), cap 18.00, margin 1.000; 39 healthy, 0 under min(dt,17)−1 | 6.6 · 15,776 |
| D10-partial30 | pass 9 `458bb26f` | **1** | **4/5 arms RED**: off 2 27.2/33 (frame 11), off 6 23.1 (12), off 15 17.9 (14), off 27 **17.0 ×13 (frame 15)**; off −1 GREEN (first tick 33.4, a whole frame) | 6.8→6.3 · 15,776 |

**A precondition the row does not pin.** My cure run read every arm on a WARM window (33 ms from the first step,
frame 8–9); my pass-9 run, and the lane's cure run, read a COLD one (17 ×3–4 at the step first, frame 10–11). The
1500 ms warm-up lets the app's own boot fronts feed `ticks` or not; the row neither prints the window's fill at arm
start nor fixes it. The born-RED holds either way (a read partial pins a warm window as surely as a cold one), but
the cost the lane declares (five ticks at the step) is exercised only by chance, and frame ≤ 11 has a 2–3 frame
margin on a warm window that the README's "frames 10/10/10/10/11" does not show.

| row (cont., chromium) | arm | exit | reading | load · inuse |
|---|---|---|---|---|
| D10-stallrun (5) | pass 8 `eeb58de2` | **1** | 17.0 ×4 then **149.6** (margin −131.6) — the lane's 149.3 reproduced | 7.0→9.7 · 15,716 |
| G10 driven 125 Hz | cure | **0** | 7/7 clauses GREEN; held gauge 0.9416 · tally **0.9337** · join 0.9841, margin **+0.0337** (lane +0.0333) | 9.3→10.2 · 15,766 |
| G10, plant `heavy-commit` (18 ms per commit, re-minted on `f67c70ee`, `od -c` checked) | blob `0cdf4f77` | **1** | **`rateform` RED ALONE**, six clauses GREEN; tally **39.4/s** held **0.6309** (lane 40.3 / 0.6456); gauge 53.0–53.6, join 50.8, all under the at-R floor 56.3 | 10.2→9.6 · 15,811 |
| D10-partial30, MY plant `slow95` (whole 30 Hz frames travel 0.95 of their capped dt) | blob `a9f2e27e` | **1** | every arm ends on frame **11** (the frame clause GREEN, at its bound) and **5/5 slowed** (31.7 of 33.3): the `slowed` disjunct reds ALONE — the healthy-travel clause is live by itself | 17.8→16.2 · 15,966 |
| control `74a2b5d9` :4258, whole `front-rate.spec.ts` | `index-CubiZsMVSwTc.js` | 1 | 4 failed: G10 (join poll `toBeGreaterThan`), and three `Failed to fetch dynamically imported module …/src/pencil/grid/gridPaths.ts` — dev-only, SKIP by law, as the lane says | 16 · 15,966 |

Every plant restore printed `RESTORED-BYTE-EQUAL` (`logs/battery-chromium.log`). The `slow95` row also shows the
frame bound's slack: a 5 % slowing of every whole frame still ends on frame 11, so `frames ≤ 11` alone would pass a
front that is 5 % slow throughout; it is the `slowed` disjunct that holds the class.
Cosmetic, carried: the G10 detail lines still label the at-R form "(printed)" though it is now gated.

### 3.2 WebKit (each row its own `guarded --exclusive webkit`, 18:13–18:18; load 9.0–14.0; inuse 15,966–16,023)

| row | arm | exit | reading |
|---|---|---|---|
| **D10-partial30** | **cure `f67c70ee`** | **1 — RED, 4 of 4 runs** | run 1: off −1 RED; rep2: off 6, off 27 RED; rep3: off −1, off 27 RED; rep4: off 2 RED. Every red arm is a **34 ms frame that travelled 33.0** (frames end on 10–11; the cap is the window's minimum, 33, on WebKit's whole-ms grid of 33/34) |
| D10-stallrun (5) | cure | **0** | 17.0 ×5 (dt 152–156), margin 1.000; 39 healthy, worst shortfall 2.00, 0 under min(dt,17)−1 |
| D10-partial30 | pass 9 `458bb26f` | **1** | **5/5 arms RED**: travel 29/24/20/**17.0 ×13**/32, frames 10/12/13/**15**/10 |
| D10-stallrun (5) | pass 8 `eeb58de2` | **1** | 17.0 ×3, 18.0, then **153.0** (margin −135.0) |
| D10-partial30, plant `slow95` | `a9f2e27e` | **1** | frames 11 ×5 (frame clause GREEN), 5/5 slowed (31.3 of 33): the disjunct alone |
| control :4258 whole spec | `index-CubiZsMVSwTc.js` | 1 | dev-only, SKIP by law |
| G10 / G10-heavy | — | NOT RUN | trimmed for the WebKit queue; the lane's WebKit G10 ×5 and heavy-commit stay ITS reading, cited not re-derived |

**FINDING — the healthy-travel clause sits ON WebKit's clock quantum, and the cure slows healthy frames there.**
WebKit's driven 30 Hz stamps are whole milliseconds: dts of 33 and 34. The window minimum is 33, so every healthy
34 ms frame travels 33: the shortfall is exactly 1.000, the clause's slack is 1 (`travel < dt − 1`), and float
round-off in `e × 240` decides each one. The lane read 5/5 GREEN once; I read 0 clean of 4 runs (1–2 arms each). Two
defects in one reading:
1. *The gate*: its bound equals the engine's own jitter (LAWS P9 §F, the time clause unseparable by ±ε). It is a
   coin flip in WebKit, not a verdict; the lane's WebKit GREEN was luck.
2. *The product*: `frontTween`'s doc says "a healthy frame at any refresh rate is never slowed". On a whole-ms clock
   a MINIMUM statistic slows every frame longer than the shortest by the difference — here ~1 ms of every third
   frame (~1 %). Small, but the claim is false as written, and the row that should carry it cannot tell 1.0 from 0.99.

## 5 · Gaps (exact) and the number

1. **D10-partial30 is RED on the cure in WebKit, 4 of 4 runs** (§3.2): the healthy-travel bound `dt − 1` equals
   WebKit's whole-ms quantum, and the window minimum caps every 34 ms frame at 33. The gate must move its clock or
   declare itself decorative (LAWS P9 §F), and `frontTween`'s "never slowed" claim is false by the jitter on a
   whole-ms clock. The lane's WebKit 5/5 GREEN did not reproduce.
2. **Row 1's class is OPEN** (§0, §4): the stall's-remainder guard is per tween over a page-global window; a front
   started at a long task's end reads the remainder and halves a 30 Hz page's fronts (unit born-RED on `f67c70ee`,
   frame 16 vs 11, negative GREEN in the same run; the same on the WAVE tree). Plus the lane's own declared door (a
   short tick after a healthy one). A minimum over 32 is moved by ONE outlier from any door: the statistic, not the
   doors, is the class. Real-engine reach of the remainder doors is unproven (timer-clock artefact).
3. **D10-partial30 does not pin its precondition**: the window's fill at arm start (warm → frame 8–9, every step
   whole; cold → 17 ×4 then whole, frame 10–11) depends on the boot fronts during a fixed 1500 ms warm-up; it is
   neither printed nor fixed, so the declared cost row is exercised by chance.
4. **π is payload-blind to the two moved tokens** (§2): 15 non-test consumers of `--color-user-ink` /
   `--color-progress-ink`, none painted on the one payload; the token half of π is UNREAD. Not re-derived by me.
5. **AA from painted bytes UNREAD a third pass**; R4's drivers (g5, g9, tg, r21) not re-banked; rows 6/8/9/12/21
   unread; B-G5-DEPTH 25 % and G9 behind no gate; G5 unread in the four regimes (the lane's own gap, standing).
6. R5: the flush lag unattributed; row 20's upper edge (49–52 vs delivered 59–60/s) not reconciled with the chair.
7. The rate form's margin over 0.9 is thin (+0.034 chromium mine, +0.021 WebKit the lane's), read only at load 6–15;
   the ε pair brackets the held share, not the constant; the fitted literals (11, 33.333 − 1e-6, 17, 18, the share
   pair, the `dt − 1` slack) are not in registry §9 with their cells (LAWS P9 §E).
8. D10-stallrun's healthy clause is a 60 Hz clause (min(dt, 17)) and blind in headless chromium above an ~8.3 ms
   cap; the class rides D10-partial30 alone, which is gap 1's flaky row in WebKit.
9. Not re-derived by me: WebKit G10 ×5 and its heavy-commit witness (trimmed for the queue), π, the lane's static
   battery beyond M16 / lint:motion / lint:sleep / eslint on three files, the lane's clause-sabotage plants sabA–E
   (their arms' effect reproduced through the four blobs, not plant by plant).

**What the pass earned** (re-derived by me): the partial first tick cured at the primitive with partial-start rows
beside the stall-run rows, `crit.partial30` GREEN, both negatives red their own class in one run (unit; and driven:
pass 9 RED 4/5 chromium, 5/5 WebKit; pass 8 RED on the stall run 149.6 / 153.0); D10-stallrun GREEN both engines;
the G10 product-cost witness live (heavy-commit reds `rateform` alone, chromium); the healthy-travel disjunct live by
itself (`slow95`, both engines); the bank and every route honest, the on-WAVE delta RUN green on its own rows.

**Number: 81** (pass 9: 80). Up for row 1's letter, rows 2–3 and an honest bank; held down by a cure that reds its
own driven row in WebKit 4/4, a class still open by its statistic, and π/AA unread on the moved tokens.
**Verdict: ADVANCE.** Pick 6 MET in letter: consumers may take `f67c70ee` by sha (strictly better than `458bb26f` on
every row read here), each shipping `crit.remainder` beside `crit.partial30`. Earliest 100: pass 12.

## 7 · Incidents (self-declared)

1. Two servers first launched with `nohup … &` inside a script that exited: `guarded` killed both ("caller died")
   within seconds; relaunched as held background jobs. Nothing ran against them.
2. One foreground `until` wait (≤ 85 s, 17:38–17:40), against the stall law; afterwards waits were bare
   `time.sleep(≤ 88)` calls between reads (no loop), declared as such.
3. The WebKit chain was stopped by me (my own process, pid 60702) and relaunched with the G10 rows trimmed; nothing
   had run in it.
4. Plants swapped `gridPaths.ts` in MY scratch tree only; every restore printed `RESTORED-BYTE-EQUAL`; the tree ends
   on `f67c70ee`. Temporary-index cuts wrote blobs into the shared object store (declared class).
5. Servers stopped by recorded PID with cwd checked (tree 44411/44462 and control 44520/44568, 18:18); no foreign
   listener touched; no git on main or in the control tree; no commit, ref, stash or push.
