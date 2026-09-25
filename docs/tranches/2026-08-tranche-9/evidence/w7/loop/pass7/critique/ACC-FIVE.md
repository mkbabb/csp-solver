# ACC-FIVE: pass-7 adversarial critique

Family: the five-crayon accent (§3 §4 §12 leader; owner of `frontGate` / `frontTween` / `poseFronts`).
Base and π control: `74a2b5d9`. Work tree: `.claude/worktrees/wf_f72f3b5a-83a-41`, which I read and served and never wrote.
The bank is faithful: `pass7.cum.diff` applied to a `git archive 74a2b5d9` reproduces all 18 tree files byte for byte (0 differ).

Critic's servers:
- `:4243` tree dev (scratch config, private cacheDir)
- `:4244` the shared control dist, verified `index-CubiZsMVSwTc.js`
- `:4245` a scratch copy of the tree holding plants (ablation, then slow-49, then floor-16, one at a time)
- `:4246` my build of the tree, `index-CzQcbCEKbykO.js`

Box load: 4 at open, 15–38 during the batteries (declared on every timing row).

**CONVERGENCE: 84 %, HELD (pass 6: 84). VERDICT: ADVANCE.**

The three pass-6 MUSTs each close on their own gate, and I reproduced each to the digit:
- A.6 is 0 red on the frame clock.
- G5 is on the full statistic.
- ROW B is `display: none` with its loss named.

The cure paid for them with three new defects that no gate in the tree can see:
1. **WebKit's whole-millisecond floor drops one frame in three on a true 60 Hz panel.** The rate falls from 60 to 40.2/s on a 17/33 ms cadence, where the pass-6 floor and the control both run 60/s. It also takes every WebKit gated rate below INTAKE-23 row 20's own closing condition.
2. **Removing the tally's forced start write makes the tally flash.** New strokes paint WHOLE before they draw in: 4 of 11 tier-changing inks on the tree, 0 of 7 on the control.
3. **The lane's two new frames break the frames law.** They retire no crop, are not a lawful pair, and push the w7 wave over its 2 MB cap: `check-evidence-policy` exits 1.

Closes offset by regressions of equal weight: the number holds.

---

## 1 · Measurements I re-ran (my servers, both engines)

### 1.1 G10 gated ×5 per engine, plus the ablation (`logs/g10-gated5x2-ablated.txt`)

The lane's own spec and `rate-clock.ts`, byte for byte (`instruments/g10-battery.CRITIC.sh`), on tree `gridPaths` sha1 `8cfe6cb23b46`, driven at 125 Hz. Load 15.8–23.5.

| run | chromium: exit · gauge / tally / join per s · min FRAME gap (DOM) | webkit: exit · gauge / tally / join · min FRAME gap (DOM) |
|---|---|---|
| gated1 | 0 · 51.9 / 47.4 / 51.2 · 16.0 (15.9) | 0 · 46.0 / 42.4 / 43.6 · 17.0 (16.0) |
| gated2 | 0 · 52.1 / 47.0 / 49.4 · 16.0 (16.0) | 0 · 48.5 / 45.6 / 45.4 · 17.0 (**15.0**) |
| gated3 | 0 · 52.8 / 49.4 / 47.4 · 16.0 (15.8) | 0 · 44.8 / 43.5 / 44.4 · 17.0 (16.0) |
| gated4 | 0 · 50.0 / 46.8 / 47.5 · 16.0 (15.5) | 0 · 47.4 / 43.3 / 46.4 · 17.0 (16.0) |
| gated5 | 0 · 55.9 / 48.7 / 47.1 · 16.0 (15.8) | 0 · 47.6 / 44.3 / 46.0 · 17.0 (16.0) |
| `FRONT_MIN_MS` → 0 | **1** · 124.8 / 126.1 / … · 4.4–6.8 | **1** · 125.5 / 124.1 / … · 5.0–7.0 |

- **On the frame clock, A.6 is cured.** 10 of 10 gated runs pass, the frame minimum is ≥ 16.0 in chromium and 17.0 in WebKit, and the ablation reds in both engines in the same batch. This reproduces the prototype's b11 12/12.
- **On the DOM clock, WebKit's tally reads 15.0 ms in gated2**, under the 15.5 clause. With the prototype's 12.0 ms (b11 gated6), the DOM clock reds **2 of 11** WebKit runs.
- **Pass 7 moved the spec's gap clause from the DOM to the frame.** The chair's A.6 names the rAF timestamp for the PRODUCT's comparison; which clock the ≥ 15.5 ms ROW reads is unruled. Under the driven clock the "frame" is a `setTimeout` pump, not a paint, so neither clock is the painted one. That is the chair's row.

### 1.2 G10 cannot fail slow: plant `FRONT_MIN_MS = 49` (`instruments/plant-slow49.diff`, `logs/g10-slow49-plant.txt`)

The plant is served on `:4245`, driven at 125 Hz.

| engine | exit | gauge / tally / join, per s | min gaps |
|---|---|---|---|
| chromium | **0** | 18.8 / 18.5 / 18.4 | 49.1–53.8 ms |
| webkit | **0** | 18.3 / 17.8 / 18.0 | 52 ms |

A front 3.4× slower than the tree's passes G10 in both engines. The row bounds the rate from above only, so the cost in §1.3 is invisible to every gate on the tree.

### 1.3 The whole-ms floor at 60 Hz, priced (`instruments/gate60.CRITIC.mjs`, `logs/gate60.txt`)

The probe loads the SERVED tree's own `frontGate` (the vite module, no copy) into each engine and drives it three ways:
- **(A)** a true 60 Hz frame stream (k·16.667 ms) on the engine's whole-ms grain;
- **(C)** the same stream through `frontTween`'s own `at` arithmetic;
- **(B)** the engine's native rAF for 2 s.

| arm | chromium (grain: fine) | webkit (grain: whole ms) |
|---|---|---|
| (A) 60 Hz, whole-ms stamps | 60.0/s, gaps 16/17 | **40.2/s, gaps 17 ×40 / 33 ×39** |
| (C) 60 Hz through the tween's `at` | 60.0/s | **40.0/s** (17/33) |
| (B) native rAF | 128–133 Hz → 48.7–49.6/s | 100 Hz → 48.5–48.7/s |
| **floor-16 plant (the pass-6 floor, no +1), (A)** | — | **60.0/s** |

On a whole-ms clock at 60 Hz, gaps read 17, 17, 16. The +1 ms floor swallows every 16 (a true 16.67 ms), so the front re-cuts at 40/s on a 17/33 ms stutter. The control and the pass-6 floor both run 60/s. The theoretical case the +1 guards (a reading of 16 that is really 15.x) cannot occur on a vsync-quantised panel. So the lane's gap 2 ("the cost is unread") is now read: every front on a 60 Hz Safari panel loses a third of its frames.

### 1.4 The tally's re-ink, post-paint (`instruments/tally-flash.CRITIC.mjs`, `logs/tally-flash.txt`)

The probe reads post-paint (a MessageChannel task from each rAF) the inked strokes' count and summed visible length. A FLASH is a frame, before the draw-in's first ≤ 30 % frame, that shows the NEW inked count at ≥ 90 % of its settled length. Acts: fresh loads (HARD/EASY alternating) and in-app re-deals. Load 23–39.

| engine | tree | control `74a2b5d9` |
|---|---|---|
| chromium | **3 of 6** tier-changing inks flash (1–2 frames, 2.6–5.7 ms before the draw-in empties); smoke run 2 of 2 | 0 of 4 |
| webkit | **1 of 5** (1 frame) | 0 of 3 |

The control resets `reveal[i] = 0` in the same flush that inks the stroke. The tree removed its forced start write (prototype delta), so a new tier's strokes keep `reveal = 1` (whole) until the draw-in's first gated frame. That makes the lane's gap 3 ("not photographed") a measured π regression on a claimed surface, against the control.

My first cut of this probe keyed on `.is-ungraded`, which a re-deal never shows. It read 0 of 0, vacuous, and was discarded unbanked; this is incident 2.

### 1.5 G5 on the full statistic, re-run (`logs/g5-rerun-summary.txt`)

This is the prototype's `p7-g5-depth.mjs` on the chair's `glyph-pop.mjs`, freshly minted payload, DEF 25, 16 cells.

- **Reproduces to the digit.** G2 and G3 are green 16/16, and the medians read 6.41–15.80.
- **G4 reds in the same 6 DPR 1 cells on the tree and the control:**
  - chromium light rest and hover;
  - webkit light rest and hover;
  - webkit dark rest and hover.
- **Plants on the default arm:**
  - EMPTY 16/16, FAINT30 16/16, the chair's TAIL35 16/16;
  - the chair's TAIL12 6/16, and only via the inherited G4: a no-op, its numbers equal to the default arm's;
  - the lane's text-run TAIL35 16/16;
  - the lane's text-run TAIL12 **14/16**, with holes at chromium DPR 1 dark rest (0.241 vs bound 0.272) and hover (0.259 vs 0.272).
- **Margins are thin:** webkit DPR 1 light hover reads 0.404 against 0.412, chromium DPR 1 light hover 0.406 against 0.418.

### 1.6 Constraints, bare (`logs/battery.txt`, `logs/filter-census-tree-dist.txt`)

- **M16:** `check-copy-register` exits 0 (0 dashes, 0 unadmitted). The lint set (`lint:ink/lanes/theme-tokens/theme-selectors/sleep/motion/catch/live-regions`, `test:e2e:projects`), `npm run lint` (scoped prettier) and `eslint .` all exit 0. The unit file is 15/15.
- **filterBudget, on my build `index-CzQcbCEKbykO.js`:** light 6/6 in both engines. Dark reds 2 rows in both engines, both the inherited `svg.crayon-heart.idle ⟨saturate(0.85)⟩` (the chair's ratified fold pick). The family adds no filter.
- **@property:** `check-property-block` exits 0 (source registers 0; served 42, one block per home). No `--ring-ink` is touched.
- **Undefined-token census:** exit 1 on the tree AND on a `git archive 74a2b5d9`, the same single STALE row (A.1 ruling 4). No bare `var()` in a timing slot.
- **Apply:**
  - `pass7.cum.diff` on 74a2b5d9: 0.
  - `pass7.delta.diff` on 74a2b5d9 + pass6.diff: 0.
  - `pass7.delta.on-s13-s7-s3.diff` on the integrated tree: 0.
  - The raw delta on the integrated tree FAILS, at `pencilConfig.ts:192`, `HandDrawnGrid.vue:13` and `gridPaths.ts:534`.
- **The evidence gate:** `node scripts/check-evidence-policy.mjs` on main exits **1**, at 2,248,187 B against the 2,097,152 B wave cap. The w7 tracked PNGs total 1,939,675 B, so the headroom at the pass-7 open was 157,477 B. FIVE's two frames are 152,666 B of it (97 %), and without them the wave reads 2,095,521 B, a PASS.

I looked at both frames. They are two DIFFERENT boards (different digits; arm (a) has 3/8/4…, arm (b′) has 1/2/6…), so they are not one payload.

---

## 2 · What holds

- **A.6's defect is cured at the primitive,** on the clock the chair named for the comparison. My runs:
  - 0 red in 10 of 10 gated runs; the ablation reds in both engines in the same batch.
  - The 15/16 unit exists and can fail: 15/15 clean, and nine plants each red, the pass-6 compare among them.
- **The gate code is honest about its two clocks.** An owed forced write is timed from the LANDING, never from the request, and `rearm` cancels only.
- **G5 now gates median AND fraction,** searched down to the first depth that meets both. The EMPTY/FAINT/TAIL plants run in-run. The chair's TAIL12 blindness on this subject is FOUND and named, not hidden.
- **ROW B's default is honest.** The trace does not print (`display: none`), and the ballot names the loss (4.24 / 3.191 vs 0 px). The gold arm is built and applies (`--check` 0).
- **The third ground is PAINTED,** in both engines at DPR 1 and 2, the walk across five inks printed and the loss stated: border 2.768 < 3, against the control's 2.441.
- **G9's exclusion ships with an off-family plant** that reds in the same run (TRACE green: 34.0 % dark, 20.6 % light).
- **Row 21's arm is built OFF behind one const** and measured post-paint: a worst per-frame Δ of 1.4–2.4 % against 19.1–20.9 % under a 240 ms stall.
- **The constraints are clean:** M16, filterBudget (the family adds nothing), @property, the undefined-token census, and W2's mechanics untouched.
- **The return is candid:** 15 gaps first, 5 incidents, the bank verified byte for byte.

## 3 · What is NOT converged (closable sentences, numbers attached)

1. **The whole-ms +1 costs a third of every front's frames on a true 60 Hz WebKit panel.** `frontGate` commits 40.2/s on a 17/33 ms cadence, against 60.0/s for the floor-16 plant and the control. Close it by dropping the +1 on the frame clock, where readings are vsync-quantised, or by keying the window on frame count. Then add a G10 row on a 60 Hz whole-ms stream asserting ≥ 59/s, with the +1 as its born-RED.
2. **G10 has no lower bound.** `FRONT_MIN_MS = 49` passes in both engines at 17.8–18.8/s. Close it with a floor clause on every consumer's burst (for example ≥ 0.9 × min(panel Hz, 62.5)), shipped with the slow-49 plant as its negative.
3. **INTAKE-23 row 20 is OPEN by its own closing condition.** Its bar is "gated rates 49–52/s unchanged both engines":
   - WebKit reads gauge 44.8–48.5, tally 42.4–45.6 and join 43.6–46.4 in 5 of 5 of my runs; the prototype's b11 read 43.7–50.0.
   - Chromium's tally reads 46.8–49.4 and its join 47.1–51.2.
   - The boot hand does not read `MOTION.hand.stepMs` (the prototype's gap 9).

   Close it with the rates restored (item 1 is most of it) and the boot draw-in reading the export, or the chair re-cutting the bar.
4. **The tally flashes.** New strokes paint whole for 1–2 frames before drawing in, in 4 of 11 tier-changing inks (chromium 3/6, webkit 1/5), against the control's 0 of 7. Close it by writing the draw-in's start in `runDrawIn`'s own flush, in the frame that inks the stroke, as the control does. Pay for it inside the window (owed when early), and re-run `tally-flash.CRITIC.mjs` to 0 of ≥ 10 in both engines.
5. **The two row-21 frames breach the frames law.** They retire no pass-6 crop, they are two different deals (not a lawful pair; T9-B26's own text says "on one payload, or (a) fires unframed-against"), and they take the wave to 2,248,187 B > 2,097,152. Close it by un-banking both and stating the arm's numbers in text, or by finding a pinnable deal (a seed) so that one payload frames both arms and a pass-6 crop is retired by name.
6. **The ≥ 15.5 ms clause's clock is the lane's own choice.** The DOM clock reds 2 of 11 WebKit runs (15.0 and 12.0 ms). Close it with a chair ruling that names the row's clock, and state that the driven-clock "frame" is not a paint.
7. **G5's tail clause is blind in 2 of 16 cells.** The text-run TAIL12 is GREEN at chromium DPR 1 dark rest and hover. The chair's TAIL12 is a no-op on this subject: its Range spans the hidden svg, run [-2, 57.1] against glyphs [14.4, 40.7]. Close it with a PROPOSED diff to the ONE `glyph-pop.mjs` that takes the Range over text nodes. The lane's `applyTailText` is a second hand-rolled plant, a LAWS §I row. Then show TAIL12 red 16/16.
8. **The 25 % default nearly deletes the verb's mark.** Chroma is 0.050 against 0.165 at pass 6's 85 %, and OKLab L moves +0.105 light / −0.06 dark from `keep`'s ink (the lane's own arithmetic, `GameGallery.vue` comment). Meanwhile pass 6 removed the control's 8 % ground, which was the one non-colour cue. For a reader who sees no colour, the tree marks `leave` by stroke weight alone, where the control marked it by weight and ground. B-G5-DEPTH must say the ground is gone.
9. **Leader duty:** G10 on SIX's and GRAPHITE's trees is not printed, and the cure they re-take by sha carries item 1's 60 Hz cost into both.
10. **The third ground's dark border reads 2.768 < 3.** The loss is stated, not cured, so it stays open.
11. **G9:** the TALLY plant is unexercised (0 strokes on a pinned board), and the SPARK plant is a hole (it moves the term 0.06–0.49 pp).
12. **Carried from pass 6 §3.6:** `filled`/`fillable` still default to 0/1 (`HandDrawnGrid.vue:104`), so a mount without counts announces "0 of 1 on the board".
13. **Row 21, "ship only if WebKit's number survives row 5's 0-encode law",** is unread: row 5 is not on this tree.

## 4 · Checklist hits

- **The pixel it moves that it did not declare (π):** the tally's re-ink flash (4/11 against 0/7), and every front's 60 Hz WebKit cadence (60/s even → 40/s at 17/33).
- **A gate that cannot fail (in one direction):** G10 passes a front at 18/s in both engines.
- **The elegant-reduction trap:** "≤ 62.5 re-cuts per second at any refresh rate" plus "a healthy frame at any refresh rate ≥ 60 Hz is never slowed" (the `frontTween` docstring). The gate slows a 60 Hz WebKit panel by a third.
- **The constraint it forgot:** the frames law (a pass-7 crop is a REPLACEMENT naming the pass-6 crop it retires; a crop is banked only for a lawful pair on one payload), which breaks the evidence cap; and INTAKE-23 row 20's own closing bar.
- **Spec-cites-itself (partial):** the gap clause moved to the clock the product now times on. It is independent of the product's `at` value, since it reads the driven pump's timestamp, so it is not strictly circular, but it was chosen by the lane that needed it green.
- **LAWS §I:** a second hand-rolled TAIL plant instead of a PROPOSED diff to the ONE glyph-pop.
- **Masked fallback (carried):** "0 of 1 on the board".
- **Not hit:**
  - vacuous convergence (every headline I re-ran reproduced: G10 on the frame clock, G5 to the digit, filter census, apply checks, the bank);
  - legacy aliases;
  - consumer-less substrate (`REVEAL_ON_HAND` is a declared ballot const, one consumer);
  - the generic default;
  - M16;
  - filterBudget;
  - @property;
  - the undefined-token census;
  - W2's mechanics;
  - the decided history. No r0 row is claimed moved; the law probe was not re-run by the lane or by me.

## 5 · Verdict: ADVANCE at 84 (held)

- **Not BLOCK:** every open row is a one-line change (drop the +1 on the frame clock; write the start in the inking flush) or a gate clause and plant (a floor, a text-node Range). No missing primitive is as hard as the problem.
- **Not RETIRE:** there is no rewording and no constraint violation in shipped paint. The frames breach is record-keeping, curable by un-banking.
- **Held, not risen:** MUSTs 1–3 are closed on their gates, but MUST 1's cure fails row 20's bar in both engines and costs 60 Hz WebKit a third of its frames, and the delta adds one π regression and one evidence-law breach.

**MUSTs for pass 8:**
1. `frontGate` commits ≥ 59/s on a 60 Hz whole-ms stream, and G10 gains a floor clause with the slow plant red.
2. The tally flash is at 0, both engines.
3. Row 21's frames are un-banked or re-shot as a lawful pair that retires a crop.

## 6 · Cross-pollination

1. **ACC-SIX and ACC-GRAPHITE (they re-take `frontGate` by sha):** do not take the whole-ms +1 without the 60 Hz row. `gate60.CRITIC.mjs` runs against any served tree's module in about 10 s.
2. **Every rate gate in the estate** (LADDER, VERB, the §10 dock): an upper bound alone passes a front slowed to 18/s. Ship a floor clause with a slow plant.
3. **The chair's `glyph-pop.mjs`:** the TAIL plant's Range must skip svg and hidden descendants. The tail is otherwise blind on any subject with a drawn outline (`HandDrawnOutline` strokes `currentColor` inside many buttons).
4. **Every consumer that moved its first write out of the inking flush** (a "forced start removed" or "deferred to the next frame" edit): read post-paint for a whole-then-empty frame. The join ring's rAF deferral (prototype gap 3) is the same shape and is unmeasured.

## 7 · Incidents, self-declared

1. **A prior incarnation of this critic lane died mid-run** (about 22:03, 2026-09-23). It left three servers alive on 4243/4244/4245 and a G10 battery banked in `<scratchpad>/acc5crit7/`. I adopted them. Their PIDs were recorded in `<scratchpad>/acc5crit7/pids/`, their identities were re-verified (control asset hash; tree `gridPaths` sha1 unchanged, no tree file newer than the build), and they were killed by PID at return. The G10 table in §1.1 is that incarnation's run on the same sha, which I read whole and did not re-run.
2. **My first tally probe (v1) was vacuous** (0 of 0, it keyed on `.is-ungraded`). I killed it by PID (88408, 1481) and moved it to `<scratchpad>/trash-acc5crit7/` unbanked; v2 is the banked instrument.
3. **A zsh word-splitting slip** wrote four misnamed empty logs. They were moved to trash, and the runner was re-written in bash.
4. **The plant tree on `:4245` held three plants in sequence:** ablate (the prior incarnation's), slow-49, then floor-16. Every row names the plant's sha1 or file.
5. The first `tally-flash` launch used a detached `nohup … &` rather than `run_in_background`, and was killed by PID.
6. Ports 4243–4246 were free of other lanes at bind. 4236–4242 were not touched.
7. `rm` was never invoked. Scratch lives in `<scratchpad>/acc5crit7/`, and the worktree's `.acc5crit7/` PW config is moved to `<scratchpad>/trash-acc5crit7/`.

Evidence: `pass7/critique/ACC-FIVE/{instruments,logs}` (text only, no images, raw JSON summarised).
Replay:
- serve the tree with `<scratchpad>/acc5crit7/dev-tree.mts` and the control with its `.vite-control.config.ts`;
- `instruments/g10-battery.CRITIC.sh` (MODE gated|slow);
- `node instruments/gate60.CRITIC.mjs <engine> <tree>`;
- `node instruments/tally-flash.CRITIC.mjs <engine> <base> 3`;
- the prototype's `p7-g5-depth.mjs <tree> <control> <out> 25 25`.
