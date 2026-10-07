# ACC-FIVE · pass-8 adversarial critique

I'm the critic. I didn't write the charter, the spec or the prototype. Base and π control: `74a2b5d9`.
Work tree `.claude/worktrees/wf_f72f3b5a-83a-41`: I read it through temporary indexes (`GIT_INDEX_FILE`) and served
it read-only. I never ran git in the control tree, never wrote into the work tree, and never used `rm`.

**Convergence: 85 (+1 from 84). Verdict: ADVANCE.**

The three primitive cures the chair asked for all land, and I reproduced each one on my own servers, in both
engines, with the pass-7 plant run first:
- **The 60 Hz WebKit panel is cured.** It commits 120 of 120 frames at 60.0/s. The pass-7 file reads 40.2/s.
- **G10 has a floor clause.**
- **The tally no longer flashes.** It reads 0 of 10 in both engines; the pass-7 tally reads 6 of 11 and 4 of 10.
- **The on-union delta applies and is the lane's own cut.**

The number rises by one, not more, because the pass repeats the pattern that held pass 7:
- **The 30 Hz cure carries a hidden cost.** From the fifth consecutive stall, D10 stops capping (§2.1).
- **The floor clause as shipped reds on box load, not on the gate.** It went red in 3 of my 7 driven runs, and every one
  of those runs was delivered-GREEN (§1.2).
- **Row 3's named mechanism isn't gated.** Deleting the start write leaves the flash row green in both engines (§2.2).
- **G10's clause-sabotage battery was not run.** Four of its six clauses have no plant that reds them alone (§2.3).
- **G5, G9, AA, π and row 21 live only in the session scratchpad** (§2.4).

## 0 · Gaps first (exact, open at pass 8)

1. **D10 is uncapped by a run of stalls. This is a pass-8 regression that no gate on the tree sees.**
   - `panelFrameMs` takes the median of the last nine one-per-frame ticks. After 12 healthy 60 Hz frames, 1 to 4
     consecutive 150 ms stalls each travel 17 ms, which is capped.
   - From the **5th** stall on, each one travels **150 ms**: the front lands where the wall clock says.
     - n=5: 17/17/17/17/**150**
     - n=6: …/**150/150**
     - n=9: 17×4 then **150×5**
     - Log: `logs/probe-stallrun.txt`; the probe is `instruments/crit.stallrun.test.CRITIC.ts`.
   - The code comment says "one lost frame does not move it". Five in nine moves it.
   - The unit rows test 1 stall, 2 boot stalls and 61 fronts in one frame, never a run of stalls.
   - Pass 7's constant cap had no such hole. The lane's own DEAL=EASY run "dropped 58/73 vsyncs at boot", which is
     exactly the regime where this happens.
   - A cure that keeps 30 Hz: key the cap on the SHORTEST recent tick. A panel's frame is its minimum interval, and
     stalls only lengthen intervals. A row with ≥5 consecutive stalls is its born-RED.
2. **The G10 floor clause (row 2) reds on page stalls, not on the gate.** The tree reds in 3 of my 7 driven runs, every one
   with the A.6-delivered floor GREEN:

   | run | engine | load | burst | floor | A.6-delivered |
   |---|---|---|---|---|---|
   | HZ=60 | chromium | 211–253 | tally 53.7/s | 54.0 | 52.6 |
   | HZ=60 | WebKit | 253–241 | tally 47.1/s | 52.9 | 42.4 |
   | 125 Hz | chromium | 45 | gauge 56.2/s | 56.25 | 50.6 |

   - The gate at 125 Hz has 0.04/s of margin.
   - The lane read 1 red in 30 runs at load 14–92.
   - P6's "a rate gate proves its cure on ≥5 runs per engine" is not met at 60 Hz WebKit: the lane got 4/5 and I got
     1/2 red.
   - The formula also contradicts A.6 at 75, 90, 100, 144 and 165 Hz. I re-derived that arithmetic, and the served gate
     reaches A.6's best at every one of those rates in both engines. **That contradiction is the chair's to rule on**,
     and the lane correctly refused to re-word the gate.
3. **Row 3's specified cure is ungated.** My plant `nostart` deletes `gate.write(0, true)` from `runDrawIn`
   (`instruments/plant-nostart.diff`).
   - The flash row reads **0/10 chromium and 0/10 WebKit**, exit 0 in both.
   - The `shown` ref (the class committed with the reveal) cures the flash alone.
   - The forced start write is the one pass 7 removed on A.6's DOM-clock grounds. It is back, and no row proves it is
     needed.
   - DOM tally minimum on nostart vs the tree at 125 Hz: 10.4/12.0 vs 13.4/13.0 ms. That is one run each, so it neither
     proves nor clears it as a cause of the flush lag.
   - Either gate the start write, with a row that reds without it, or delete it.
4. **The clause-sabotage battery (registry-v7 §2.5 (ii)) is unrun for G10.**
   - The lane printed a per-clause table but never deleted a clause. I derived what deletion would show from its own
     plant log (`pass8/prototype/ACC-FIVE/logs/g10-battery-and-plants.txt`):
     - `ceiling` is red only under `pablate`, which also reds `gap`. `pceil155` is GREEN (the lane's hole).
     - `clock` (CLOCK=60) and `interleave` (DEAL=EASY) each red together with `floor`, per the lane's table.
     - `seen` has no plant.
     - `gap`'s only unique plant, `pgap8`, reds in chromium only.
   - So deleting `ceiling`, `clock`, `interleave` or `seen` leaves every plant red, and the self-test cannot red.
     **Four of six clauses are unproven.** Only `floor` (pslow49, both engines) and `gap` (chromium) are proven.
5. **Rows 6, 8, 9, 12, π and row 21 were read by scratch drivers that neither land nor bank.**
   - The drivers are `five8s/tools/web/frontend/.acc5r/{g5,g9,tg,pi,r21}.mjs`, in the session scratchpad.
   - The evidence dir holds their logs, not their source, and the tree has no G5/G9 spec. The replay route therefore
     points at a volatile directory, and the 2026-09-18 reboot already wiped one scratchpad.
   - No landed gate holds B-G5-DEPTH's 25 % or G9 at the fold.
   - Their imports ARE relative product paths: `../e2e/lib/*` through a symlink to the tree's `e2e/`, byte-equal to
     the homes.
6. **G5 reads only `reducedMotion: 'reduce'` at fine pointer with no contrast preference.** LAWS P7 §E(i) needs the
   verdict under `no-preference`, `pointer: coarse` and `prefers-contrast: more` too, both themes, with plants in the
   arms it doesn't emulate. The driver also hides the guard's outline svg with an injected `visibility: hidden`, so the
   photograph is of a surface the product never paints.
7. **The DOM clock reds 10/10 runs per engine at 125 and 60 Hz.**
   - This is THE FLUSH LAG, named as the law asks, and it regressed from pass 7's 2/11 in WebKit.
   - My runs agree: DOM<15.5 in every 60 and 125 Hz run, both engines. Minimums were 5.4 and 6.6 ms chromium, 9.0 ms
     WebKit.
   - The frame clock holds: ≥15.5 chromium, 16.0 WebKit.
8. **Row 21's 0-encode condition is unread** (the lane says so). **Row 20's bar is not met.** My HZ=60 WebKit run 1 put
   the tally at 47.1/s, under 49. The upper edge of 49–52 is exceeded everywhere.
9. **The dark border is still 2.768 < 3** (control 2.441). The loss is kept in ROW B's caption, which the charter allows.
   I did not re-derive this number.
10. **`tally-flash.spec.ts` depends on the PROPOSED `len:` subject in `e2e/lib/postpaint.mjs`.** If the chair doesn't
    fold that extension, the row cannot run. The lane declared this. The extension ships with a plant (`len:#grow`
    SEEN, `ruled:#grow` EMPTY), which I did not re-run.
11. **The boot hand (`bootHand.ts`, union only) still reads 30 Hz as a stall.** That is VERB's coupling row, declared.

## 1 · What I re-derived (my servers, both engines)

Servers:
- `:4236` the work tree, vite dev, config `crit-acc5/dev-tree.mts` with a private cacheDir outside the project.
- `:4251` the shared control dist, preview, identity verified as `index-CubiZsMVSwTc.js`.
- Plants were served one at a time on `:4236` from `git archive c3a863f7` copies with ONE edit each.

Both ports were free at open. I killed only my own recorded PIDs, after a cwd check (`logs/chainB.log`).
Box load was **28–253** across the run, because other lanes were on the box. Every row below carries its load.

### 1.1 Row 1: the 60 Hz panel (`logs/tpanel.log`, `logs/p7g-panel.log`, `logs/p7g-60.log`)

| arm | chromium | WebKit (engine clock whole-ms) |
|---|---|---|
| tree, G10-panel 60 Hz whole-ms | 120/120, **60.0/s**, min 16.00 | 120/120, **60.0/s**, min 16.00 |
| tree, 30 Hz whole-ms / 125 Hz / 240 Hz | 30.0 / 62.5 / 60.0 | 30.0 / 62.5 / 60.0 |
| tree, 75/90/100/144/165 Hz | 37.5/45.0/50.0/48.0/55.0 = A.6's best, "UNREACHABLE under A.6" | same |
| **pass-7 `gridPaths.ts` plant (first)**, panel | 60.0/s GREEN (fine clock, by construction) | **80/120, 40.2/s RED**; 125 Hz 41.7/s |
| **pass-7 plant**, driven HZ=60 | — | **RED**: gauge 38.5–40.0, tally 39.9, join 40.0/s (load 71–65) |

Reproduced to the digit. The pass-7 plant is blind in chromium by construction.

### 1.2 Driven G10 on the tree (`logs/t60.log`, `logs/t30.log`, `logs/t125.log`)

| row | chromium | WebKit | load |
|---|---|---|---|
| HZ=60 r1 | **exit 1**: floor, tally 53.7 < 54.0 (delivered 52.6) | **exit 1**: floor, tally 47.1 < 52.9 (delivered 42.4) | 211–253 |
| HZ=60 r2 | exit 0: 60.0/60.0/60.0; frame min 15.9, DOM min 5.4 | exit 0: tally 58.8; frame min 16.0, DOM min 15.0 | 241–170 |
| HZ=30 | exit 0: 29.9–30.1/s; frame min 32.0, DOM min 28.9 | exit 0: 30.0–30.5/s; frame min 29.0, DOM min 23.0 | 170–112 |
| 125 Hz | **exit 1**: gauge 56.2 < 56.25 (delivered 50.6) | exit 0: tally 62.0; frame min 16.0, DOM 13.0 | 45–40 |

The frame clock held ≥15.5 ms in every run. The DOM clock went under 15.5 in every 60 and 125 Hz run.

### 1.3 Row 3: the tally flash (`logs/tflash.log`, `logs/kflash.log`, `logs/p7t-flash.log`, `logs/nostart-flash.log`)

| arm | chromium | WebKit |
|---|---|---|
| tree | **0 of 10** (15 acts), exit 0 | **0 of 10** (18 acts), exit 0 |
| control `74a2b5d9` (preview dist) | 0 of 10, exit 0 | 0 of 11, exit 0 |
| **pass-7 `DifficultyTally.vue` plant (first)** | **6 of 11 RED** | **4 of 10 RED** |
| critic plant `nostart` (start write deleted) | **0 of 10 GREEN** | **0 of 10 GREEN** |

### 1.4 Bank and apply (re-derived through temporary indexes)

- **The tree.** The work tree's write-tree is `c3a863f79c94db736347ad74cc99c56656a217e0` = BANKED.txt, re-read unchanged at
  the end.
- **The interdiff.** `74a2b5d9` + `pass7.diff` (sha1 d8edfa85) gives `6b92ba6d`, and adding `homes.diff` (sha1 a1d8adeb)
  gives `ccfeec92`. The interdiff from there to the tree is **byte-equal to `pass8.delta.diff`**: 71,029 B, 10 files,
  +749/−91. I read the product hunks whole: `gridPaths.ts`, `DifficultyTally.vue`, `HandDrawnGrid.vue`, both specs,
  `rate-clock.ts` and `postpaint.mjs`.
- **The apply checks:**
  - `pass8.diff` on `74a2b5d9`: **0**, and it lands on `c3a863f7`.
  - `pass8.cum.on-s13-s7-s3.diff` on the union `98454964`: **0**.
  - The delta on the bare union: **1**, because `postpaint.mjs` is absent there, as declared.
  - The delta on `1f8a729a` (union + homes.on): **0**, landing on `ef4d93c3` = BANKED.txt.
  - All sha1s match BANKED.txt.

## 2 · The defects, with the mechanism

### 2.1 D10 under a run of stalls
`frontTween` caps each tick at `max(stepMs, panelFrameMs)`. `panelFrameMs` is the median of nine ticks, so it becomes the
stall length once five of the nine are stalls, and the cap then passes the whole stall through. The design goal is to
tell a slow panel from lost frames, and a median cannot do that across a run. A minimum over a window can: a 30 Hz
panel still reads 33 ms, and a jank run still reads the healthy frame.

### 2.2 The start write
In `DifficultyTally.vue`, `strokeState` now reads `shown`, and `at()` sets `shown` in the same commit as the reveal. The
class therefore can't precede the draw-in, whether or not the start is forced from the flush. The flash row proves
`shown`. It does not prove the forced start.

### 2.3 G10 clause map (from the lane's own plant log)

| clause | plant that reds it | reds another clause too? | deletion-proof |
|---|---|---|---|
| seen | — | — | **no** |
| clock | CLOCK=60 | floor (lane's table) | **no** |
| interleave | DEAL=EASY | floor (lane's table) | **no** |
| ceiling | pablate | gap | **no** (pceil155 GREEN) |
| gap | pgap8 | — (chromium; WebKit GREEN) | chromium only |
| floor | pslow49, p7g at 60 Hz in WebKit | — | yes |

### 2.4 The unbanked drivers
`g5.mjs`, `g9.mjs`, `tg.mjs`, `pi.mjs` and `r21.mjs` exist only in `<scratchpad>/five8s/tools/web/frontend/.acc5r/`. Their
logs are in the prototype's `logs/`, and the numbers the return cites trace to those logs. I did not re-run them, so rows
6, 7, 8, 9, 12, π and 21 are **the lane's numbers, not re-derived here**.

## 3 · Constraints

- **Instrument imports:**
  - `front-rate.spec.ts` → `./rate-clock`.
  - `tally-flash.spec.ts` → `./lib/postpaint.mjs`.
  - `progress-corridor.spec.ts` → `./lib/paint-lib.mjs`.
  - No `docs/` import anywhere in `e2e/` or `scripts/` (grep: 0 hits). `applyTailText` is gone from
    `e2e/`, `scripts/` and `src/`.
  - The one extension to the ONE copy (`len:`) is marked PROPOSED, with its plant.
- **filterBudget, M16, property-block, π:** I did not re-run these. The lane reports census light 6/6 = control, dark
  2 fails = control (inherited crayon-heart; the union clears it 8/8), `lint:copy` 0, property-block 0, and π 1 diff on
  a claimed surface (the sparkle glow's drop-shadow).
- **AA:** from the lane only. Light gold 3.236/3.217/3.856; dark 3.069/**2.768**/3.606 (control 2.441 border).
- **Frames and evidence:** 0 PNG banked by the lane or by me, so 0 B of the 151,826 B headroom is spent.
  `check-evidence-policy` exits **0** (PASS), run bare at 12:14.
- **Charter row-by-row (my reading):**
  - Row 1: CLOSED.
  - Row 2: shipped, but flaky and contradicted (chair).
  - Row 3: outcome CLOSED, mechanism ungated.
  - Row 4: named, not cured.
  - Row 5: CLOSED.
  - Row 6: closed on an unbanked, single-regime driver.
  - Row 7: written.
  - Row 8: loss kept.
  - Row 9: closed on an unbanked driver; the required props landed.
  - Row 10: numbers only; the law is unread.
  - Row 11: OPEN.
  - Row 12: printed.

## 4 · Incidents (mine)

- **The box ran at load 171–253** during the first 60 Hz rows, because of other lanes' work. Those rows carry the
  load, and two of the three floor reds sit inside it.
- **I ran vitest once, on a scratch archive (`crit-acc5/probe`), with a private cacheDir.** The probe file lives only
  there and in `instruments/`.
- **Plant archives carry a `node_modules` symlink to main's.** No install was run, and nothing was written to main's
  `node_modules`.
- **One `sleep 45` was refused by the harness.** I switched to background until-loops and Monitor.

## 5 · Replay

- **Scripts:** `instruments/serve.CRITIC.sh`, `run.CRITIC.sh`, `chainA.CRITIC.sh` (panel → HZ=60×2 → HZ=30 → flash tree
  → flash control) and `chainB.CRITIC.sh` (p7g → p7t → nostart → tree 125 Hz). The playwright config lives in the scratch
  `cfg/`, with a `node_modules` symlink and `testDir` = the tree's `e2e/`.
- **Plant `p7g`:** the tree archive with `git show 6b92ba6d:web/frontend/src/pencil/grid/gridPaths.ts`.
- **Plant `p7t`:** the same for `DifficultyTally.vue`.
- **Plant `nostart`:** `instruments/plant-nostart.diff`.
- **Stall probe:** `npx vitest run --config vitest.crit.mts src/pencil/grid/crit.stallrun.test.ts` on a
  `git archive c3a863f7` copy.
