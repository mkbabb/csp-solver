# ACC-FIVE · pass 7 prototype

The five-crayon accent (§3 §4 §12 leader). The pass-6 diff was advanced in place in
`.claude/worktrees/wf_f72f3b5a-83a-41` at `74a2b5d9`. Nothing was committed.

- **Tree:** vite dev on 4236. No dist was built this pass. The tree's `dist/` (`index-DCleUxXAr4B4.js`) is left over from pass 6, and only the @property census read it.
- **Control:** `w7-control` preview on 4237 (`index-CubiZsMVSwTc.js`, `74a2b5d9`).
- **Main-HEAD `c31a92b9`:** a `git archive` scratch tree on dev 4241, used for the boot read only.
- **Plants:**
  - 4238 serves the tree with `FRONT_MIN_MS` → 0.
  - 4239 serves the tree with the pass-6 gate compare.
  - 4242 serves the tree with `REVEAL_ON_HAND = true`.
- **Box load:** declared on every G10 row. It was 9–25 through the final batteries and 23–61 earlier.

## Gaps first

1. **G10 is gated on the FRAME clock, and the DOM clock still dips.** The per-burst minimum is read between the frames the re-cuts belong to, which is the chair's "rAF timestamp" (A.6). In the final battery b11:
   - The frame clock reads chromium 16.0–16.9 ms and WebKit 17.0 ms. That is 0 red in 12 of 12 gated runs.
   - The DOM clock is printed beside it and reads 15.4–17.1 ms on chromium. On WebKit it reads **12.0 ms once**: the tally in gated6, whose flush lag varied 0–8 ms within the burst.
   - b10 also dipped once, to 15.2 ms (chromium tally).

   So the clause holds on the gate's clock, not at the DOM. If the chair reads the DOM, it reds 1 of 6 WebKit runs.
2. **The whole-millisecond floor has an unmeasured 60 Hz price.** On a 1 ms clock the gate asks for 17 ms, not 16. A true 60 Hz WebKit panel that reads 16 swallows that frame. This shim ran at 52.6 Hz in WebKit (clock60: 39.0–40.0/s), so the true 60 Hz cost is unread.
3. **Two consumer timings moved, and neither is photographed:**
   - **The join** is written on the next frame, before it paints, instead of in the render's flush (`HandDrawnGrid.vue`). That is one frame of latency, and its visual effect was never measured on a painted frame.
   - **The tally's forced start write is gone.** The draw-in's first frame writes the start instead. Until then the strokes keep their last state, for up to one frame plus the window. This was not photographed either.
4. **G5 at the new 25 % default:**
   - **G4 (the tail slices) reds** in the same 6 DPR 1 cells as the control's black (slice 12 at 2.18–4.48), so it is structural and printed, not gated.
   - **G2 and G3 are green in 16/16 cells.** At 30 %, G3 fails one cell: WebKit DPR 1 light hover reads 0.413 against a bound of 0.412.
   - **The chair's TAIL12 plant is a no-op on this subject.** `glyph-pop.mjs` takes its Range over the element's contents, and those contents include the hidden outline svg: the run reads [-2, 57.1] px, so the cut at 50.0 falls past the last glyph. Every TAIL12 number equals the default arm's to 3 decimals. The ONE copy was left unedited.
   - **The lane's own text-run TAIL12 reds 14/16.** The two holes are chromium DPR 1 dark rest and hover, where G3 reads 0.241 and 0.259 against a bound of 0.272.
   - **25 % mixes the word nearly to the foreground.** Chroma falls from 0.165 at the pass-6 default of 85 % to 0.050 (ballot B-G5-DEPTH).
5. **The third ground's border stays under 3:1 in dark:** `#7e6a17` reads 2.768 against the control's 2.441. The line drops from 3.303 to 3.069, and the paper rises from 3.351 to 3.606 (stated, not cured).
6. **ROW B print:** the default is now `display: none`, so print loses the whole trace. The gold-ink arm reads 3.844 light and 11.669 dark, against the control's 4.24 and 3.191 (ballot B-PRINT).
7. **G9 has two unexercised or blind plants:**
   - The TALLY plant is unexercised: a pinned `?board=` is never graded, so the tally inks 0 strokes.
   - The SPARK plant moves the term only 0.06–0.49 pp. That is an area-share blind spot: a HOLE.
8. **Row 21's arm, as built, reaches every reveal on its branch:** the deal's wave, a hint's write-in and the solver's. That is T9-B26's declared delta, and only a typed digit keeps the wall clock.
   - Row 5's 0-encode law is not on this tree, so "WebKit's number survives row 5" is unread.
   - The two frames are different deals. A `?board=` payload restores without the wave (`useGameState.ts:940`), so one payload cannot be pinned.
9. **Row 20's clause is only partly exported.** `MOTION.hand.stepMs` is exported, and fill and tally read it through `frontTween`. The join's wash (`useJoinWash`'s sequence) and the grid's boot draw-in do not; the boot draw-in is not this family's file.
10. **Boot meet (chromium, n=2):** the tree's tally front starts at 488–490 ms, against 326–362 ms on the control and 376–407 ms on main. The subjects differ in kind: the tree reads a painted rect, while the others read a stroke dash offset. The ~130 ms is unexplained. WebKit's boot is stall-dominated: the ruling held 1243 ms in one tree run.
11. **The painted rows read the tree's dev server against the control's built preview.** These are third ground, G5, ROW B, G9 and row 21. Dev serves whole fonts, not the letter-exact subsets, so G5's glyph population may move on a dist.
12. **Leader duty, G10 on SIX's and GRAPHITE's trees:** not printed. They re-take the cure by sha in parallel this pass.
13. **Inherited failures, unchanged:**
    - filter-census dark fails the same 4 rows on the tree and the control (`crayon-heart.idle ⟨saturate(0.85)⟩`). Light is 12/12.
    - The law probe (R1–R3) was not re-run this pass.
14. **The spec's frame attribution has a residual race.** It wraps `window.setTimeout` and posts a MessageChannel message per frame. A worker message queued before that post could still read as the frame. This was not observed in b9–b11 ("n of N outside a frame" is printed on every row).
15. **The pass-7 delta does not apply to the integrated tree** (`74a2b5d9 + s13-s7-s3`) at three files' context. The rebased `pass7.delta.on-s13-s7-s3.diff` is a three-way merge with two conflicts resolved:
    - the integrator's `// policy: rate` tag is kept on the derived const;
    - `MOTION.rungs.note` is kept as the fill's duration.

    It applies at 0 and `vue-tsc -b` is 0.

## Numbers

### Row 1 · A.6 at `frontGate`

**The cure.** The gate's changes:

- The window is `FRONT_MIN_MS = MOTION.hand.stepMs − 1 = 16`. On a clock that has only read whole milliseconds it asks for 17.
- A forced write inside the window is owed, never landed inside it. It is timed from where the last re-cut LANDED.
- A frame's write passes its frame's rAF time (`at`), and the gate compares on that.
- `frontTween` hands `at` to `onProgress` and to `onComplete`.
- `rearm` cancels only. The window holds across runs.

Hand these shas to SIX and GRAPHITE (sha1 / git blob):

| file | sha1 | git blob |
|---|---|---|
| `gridPaths.ts` | `8cfe6cb23b46` | `028b9b8bb121` |
| `HandDrawnGrid.vue` | `ba28359e9c40` | `dad6f6af40a6` |
| `DifficultyTally.vue` | `6edac563e47f` | `db2a922c3a16` |
| `pencilConfig.ts` | `7a8bcfabd31d` | `cfa1fac68f72` |
| `e2e/front-rate.spec.ts` | `27172a6c463e` | `4bab708a3f44` |

**The 15/16 units** (`gridPaths.poseFronts.test.ts`, 15 tests, clean 15/15):

| clock | swallowed | commits |
|---|---|---|
| fine | 15 ms | 16 ms |
| whole ms | 16 | 17 |
| frames | 15.6 ms apart | 16.0 |

- An end that comes 15.5 ms after the last re-cut's frame is owed.
- An owed end waits for the landing.
- A 150 ms stall advances the tween by 17 ms.

Nine plants each RED (`logs/unit-plants.txt`):

| plant | what it plants |
|---|---|
| grainless | no whole-ms floor |
| force-now | forced writes land immediately |
| uncapped | tween clock not capped |
| rearm-resets | rearm resets the window |
| request-anchored | owed end timed from the request |
| pass6-compare | the pass-6 gate compare |
| wall-clock | frame writes timed on the wall |
| tween-wall-at | tween passes the wall time |
| tween-end-wall | tween end passes the wall time |

**G10, final battery b11** (`logs/g10-battery-b11.txt`; gridPaths `8cfe6cb23b46`, spec `27172a6c463e`; 6 per engine; load 9.2–19.9):

| rows | chromium | webkit |
|---|---|---|
| gated ×6 | **0 red**. 125.0–128.2 Hz. Frame min 16.0–16.9 ms, DOM min 15.4–17.1. Gauge 49.1–53.9, tally 45.5–50.5, join 46.7–53.5 /s | **0 red**. 125.0 Hz. Frame min 17.0, DOM min 12.0–18.0. Gauge 44.4–50.0, tally 44.9–46.7, join 43.7–47.0 /s |
| `FRONT_MIN_MS` → 0 | 1: 125.9 / 126.3 / 125.2 /s | 1: 125.5 / 121.7 / 125.2 /s |
| pass-6 compare | 1: gauge frame gap 8.0 ms | 1: 8.0 ms |
| CLOCK=60 | 1: precondition 62.9 Hz | 1: 52.6 Hz |
| DEAL=EASY | 1: witness (inked 1 after 6 deals) | 1 |
| CLOCK=60 · pass-6 | 1: precondition | 1 |

**History: how the cure was found.** Every battery ran 6 per engine plus the plants; earlier batteries are in the scratch pad.

| battery | clock | chromium | webkit | what it showed |
|---|---|---|---|---|
| b4 | DOM | 6/6 | **4/6**: tally DOM 13.0, 15.0 | flush lag 0–8 ms |
| b5 | frame, wall-timed gate | **5/6**: gauge 15.3 | 6/6 | |
| b6 | frame, frame-timed tween writes | **4/6**: 15.1, 15.3 | 6/6 | an owed end's timer was read as the pump's frame |
| b9 | spec attributes frames by task | 6/6 | **4/6**: tally 14.0, join 15.0 | forced start and join were wall-timed in the flush |
| b10 | as b11, before prettier | 6/6 | 6/6 | |
| b11 | final | 6/6 | 6/6 | |

### Row 2 · INTAKE-23 row 20

- `MOTION.hand.stepMs: 17` lives in `pencilConfig.ts`. `FRONT_MIN_MS` derives from it, and `frontTween` caps each tick at it.
- The boot meet was read post-paint with the chair's `painted-frames.mjs` `record` (`instruments/p7-boot-meet.mjs`, `logs/boot-meet.log`, `?size=3&difficulty=HARD`, 2 runs). The ruling is `path.frame-line` stroke-dashoffset; the tally is the first inked stroke.

| engine | tree meet | control meet | main `c31a92b9` meet |
|---|---|---|---|
| chromium | 59.5 / 41.7 ms (tally 490 / 488 ms on) | 97.6 / 119.2 (362 / 326) | 127.2 / 115.7 (376 / 407) |
| webkit | 340.0 / 0.0 | 0.0 / 0.0 | 242.0 / 322.0 |

- On chromium the ruling holds 97–124 ms twice in every tree.
- WebKit's boot is stall-bound on all three trees: the tree's r0 ruling held 1243 ms.

### Row 3 · G5 on the full statistic (`instruments/p7-g5-depth.mjs`, the chair's `glyph-pop.mjs`)

The bound is the control's fraction in the same cell + 0.05. The search at the 85 % default (`logs/g5-depth-search.log`):

| depth | result |
|---|---|
| 85 | fails G2 at DPR 1 light: 3.838 / 3.715 chromium, 3.789 / 3.686 webkit |
| 30 | fails G3 in one cell: 0.413 > 0.412 |
| **25** | the first depth where G2 and G3 pass in all 16 cells (the default is now 25 %) |

At 25 % (`logs/g5-depth-def25.log`):

- Medians read 6.41–15.80.
- G4 reds only in the control's own 6 cells.

Plants on the 25 % default, per 16 cells:

| plant | red | how |
|---|---|---|
| EMPTY | 16/16 | G1 |
| FAINT30 | 16/16 | G1–G3 |
| the chair's TAIL35 | 16/16 | |
| the chair's TAIL12 | **6/16**, all via G4, the control's cells | a no-op; see gap 4 |
| the lane's text-run TAIL35 | 16/16 | |
| the lane's text-run TAIL12 | **14/16** | |

### Row 4 · ROW B print (`instruments/p7-rowb-print.mjs`, `logs/rowb-print.log`; line ground, footprint cov ≥ 0.5)

| arm | chromium light | chromium dark | webkit light | webkit dark |
|---|---|---|---|---|
| **none (default)** | 0 px | 0 px | 0 px | 0 px |
| gold ink (`arms/rowB-goldink-print.arm.diff`) | 3.844 (under 3: 0.127) | 11.669 (0) | 3.844 (0.127) | 11.669 (0) |
| control violet | 4.24 (0.096) | 3.191 (0.205) | 4.251 (0.108) | 3.191 (0.174) |

WebKit prints the control's trace over 12,392 px against chromium's 3,206 (3.9×; four pose copies is inferred, not proven).

### Row 5 · the dark ink on the third ground, PAINTED (`instruments/p7-third-ground-paint.mjs`, `logs/third-ground-paint.log`)

Both engines and DPR 1/2 read identical medians. Each cell is line / border / paper.

| ink | dark medians | on the border, under the control's 2.441 |
|---|---|---|
| `#79650f` (pass 6) | 3.303 / 2.572 / 3.351 | |
| `#7b6713` | 3.207 / 2.649 / 3.452 | |
| **`#7e6a17` (adopted)** | **3.069 / 2.768 / 3.606** | 0.039–0.076 |
| `#806c1a` | 2.982 / 2.849 / 3.712 | (the line falls under 3) |
| `#836e1d` | 2.886 / 2.944 / 3.835 | |
| control violet | 3.139 / 2.441 / 3.139 | |
| light `#a27803` | 3.236 / 3.217 / 3.856 | control 2.876 / 3.177 / 3.76 |

`e2e/progress-corridor.spec.ts` passes 8/8 in both engines, including the three born-REDs per scheme. Its title now names the border floor.

### Row 6 · G9's exclusion with its plants (`instruments/p7-g9-plant.mjs`, `logs/g9-plant.log`; ceiling 12 %)

- **The re-cut:** the Level section rect is excluded, 933–1115 px.

| arm | dark | light |
|---|---|---|
| tree, re-cut | **9.37–9.48 %** | 5.5–5.52 % |
| tree, un-cut | 15.78–15.98 % | |
| + TRACE green | **34.0 %: RED** | 20.55–20.61 %: RED |
| + TALLY | unmoved (0 strokes) | unmoved |
| + SPARK violet | 9.72–9.97 %: HOLE | |
| control | 34.51 % / 61.83 % | 20.73 % / 45.27 % |

### Row 7 · INTAKE-23 row 21: the reveal arm, BUILT, OFF

The arm is behind `const REVEAL_ON_HAND = false` (`HandwrittenGlyph.vue`). Flipping it is `arms/row21-reveal-on-hand.arm.diff`, which passes `git apply --check`.

It was read post-paint (MessageChannel after each rAF) on fresh EASY deals, over 3 runs, with arm (a) on 4236 and arm (b′) on 4242. The stall plant is one 240 ms busy block, 250 ms after first ink (`instruments/p7-reveal-arm.mjs`, `logs/row21-reveal-arm.log`).

| cell | (a) wall clock | (b′) hand clock |
|---|---|---|
| chromium clean | 197–205 painted, worst Δ 0.8–0.9 %, 1531–1545 ms | 199–207, 0.8–0.9 %, 1528–1534 ms |
| webkit clean | 139–150, 1.3–2.2 % | 134–145, 1.7–2.7 % |
| chromium + stall | 168–174 painted, **worst Δ 19.1–19.5 %** | 196–205, **1.4 %**, window +215 ms |
| webkit + stall | 118–125, **20.6–20.9 %** | 137–146, **2.0–2.4 %**, window +244–411 ms |

**Frames** (chromium · light · 1280×800 · fine · DPR 2, the first frame after the stall):

- `frames/p7-row21-reveal-arm-a-first-frame-after-240ms-stall-chromium-light-1280x800-fine-dpr2.png` (82,724 B): the wave jumps whole.
- `frames/p7-row21-reveal-arm-b-first-frame-after-240ms-stall-chromium-light-1280x800-fine-dpr2.png` (69,942 B): glyphs mid-stroke.

Both are new rows and retire no pass-6 crop. The kept pass-6 frame, `p6-1-section-fork-gold-violet-graphite-light-chromium-1280x800-fine.png`, stands.

### Row 8 · apply checks

| patch | base | exit |
|---|---|---|
| `pass7.cum.diff` (18 files, +2281/−162) | `74a2b5d9` | 0 |
| `pass7.delta.diff` (10 files, +591/−139) | `74a2b5d9 + pass6.diff` | 0 |
| `pass7.delta.diff` | `74a2b5d9 + s13-s7-s3.diff` | **1** (context in `pencilConfig.ts:192`, `HandDrawnGrid.vue:13`, `gridPaths.ts:534`) |
| `pass7.delta.on-s13-s7-s3.diff` | `74a2b5d9 + s13-s7-s3.diff` | 0, and `vue-tsc -b` 0 |

## Pre-return battery (bare; tree · control)

`logs/pre-return-battery.txt`:

| check | tree | control |
|---|---|---|
| `vue-tsc -b` (snapshots) | 0 | 0 |
| `typecheck:e2e` | 0 | not run |
| vitest | 0: 70 files, 849 tests | 0: 68 files, 830 tests |
| lint:ink / catch / theme-selectors / theme-tokens / lanes / sleep / motion / copy / live-regions | 0 | 0 |
| tdz-probe | 0 | 0 |
| test:e2e:projects | 0: 36 specs, 565 tests | 0: 34 specs, 547 tests |
| test:e2e:retries, test:support-floor | 0 | 0 |
| check-property-block (+ self-test) | 0 / 0 | 0 / 0 |
| `eslint .` | 0 | 0 |
| `npm run lint` | 1 then 0 after `prettier --write` on 4 src files (line wrapping) | 0 |
| knip | 0 | 0 |
| filter-census light / dark | 0 / 1 (4 inherited) | 0 / 1 (the same 4) |
| progress-corridor (both engines) | 8/8 | n/a |

- **filterBudget:** unchanged.
- **@property:** none added.

## Replay route

- **In place.** The pass-6 diff stood in the tree at open: 12 tracked files +910/−151 plus 5 untracked files of 908 lines, which is 17 files +1818/−151 and matches BANKED.txt.
- **At return:** 13 tracked files +1099/−162 plus 5 untracked files of 1182 lines, which is 18 files +2281/−162.
- **Consistency:** `pass7.cum.diff` equals `pass6.diff` + `pass7.delta.diff` by construction: the delta is a diff against 74a2b5d9 + pass6.diff, and both apply at 0.

## Incidents

1. **An unkeyed kill.** A kill pattern was not keyed to this worktree: `ps | grep "[f]ront-rate.spec" | xargs kill`. Only PAL-WALK's runs were live, and none were front-rate, so nothing else was hit. Every later kill was by PID, with the cwd checked first.
2. **Ports.** 4237 (the control), 4238–4239 (plants), 4241 (main-HEAD) and 4242 (arms) were taken because each was free at bind. 4237 is SIX's charter port and 4238 is LIVE's.
3. **The spec was edited while a battery ran, twice.** b7 and b8 were killed by PID and their rows discarded.
4. **b7's first launch used `&` inside a foreground call.** The bash was orphaned and then killed by PID.
5. **A partial scratch tree was moved, not deleted.** The first `s13` apply tree lacked `.github`, so it was moved to the scratchpad trash; no `rm` was used.
