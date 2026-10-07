# PASS-8 CRITIQUE · PLR-COUNT · the count mark (§11)

Adversarial. I didn't write the charter or the prototype. Work tree `.claude/worktrees/wf_f72f3b5a-83a-52`, base and π
control `74a2b5d9`. At my open and at my close the tree's temp-index write-tree (`GIT_INDEX_FILE`, `web/frontend`)
was **`de3b278d`**, and its `--binary` diff against `74a2b5d9` is **`cmp`-identical to the bank** `pass8.diff`
(553,669 B, sha1 `f3335bf58b33`). Every plant I made was restored and sha1-checked (`restored=OK` 5/5, plus the
font-corpus plant). No git ran in the control or a sibling's tree. No `rm`.

**VERDICT: ADVANCE · convergence 89 % (pass 7: 89). Held, not risen.**

The pass closes five rows in substance, and every number I re-derived reproduces to the hundredth. That includes
the pinned stroke, the ink table, HEAD12F 8/8, and the widest board. But G14, the family's AA gate, now **can't
fail on a shipped regression that fades a whole quiet line**:
- A 20 % opacity fade shipped in `PlayerLobby.vue` (every pixel of every quiet line under 4.5:1) is **GREEN in all
  four light cells, both engines**.
- A 1 px comb fade (the median falls from 4.66 to 1.38) is **GREEN in 4 of 8 runs**.
- The pass's new clause, G5, has **no bite in its own run**: with G5 deleted the row stays GREEN 8/8.

Pass 7's stamped G3 bound (≈ 0.54 at light DPR 2) would have seen the opacity fade, since that fade puts the
fraction under 4.5 at 1.000. The row's closures are real, and so is this loss of gate power. The number holds.

## 0 · Gaps first (each closable, numbers attached)

1. **G14 cannot fail on a whole-line fade shipped in the product (vacuous regression gate in the three T9-R8
   cells).** G3 is cut from the same run's clean read. G4's tolerated set is that clean read's own low columns, so
   `gated(clean, clean)` can never add a G4 column: G4 **can't red on the shipped surface at all** (spec
   `:737–748`). G2 is gated in one cell of four. What remains is G5's absolute 3.0 per-glyph core and G1. File
   plants on `PlayerLobby.vue`, G14 as landed (`readings/g14-critic.txt`):
   - **OPA80F** (`.pl-state, .pl-qual, .pl-more { opacity: 0.8 }`):
     - **Row GREEN 4/8**: chromium and WebKit, light DPR 1 and light DPR 2.
     - The clean verdict is GREEN in **6/8**. dark DPR 1 reds only because an in-run FADE80 plant goes unseen
       (incidental), and dark DPR 2 reds on G2.
     - The fraction under 4.5 is **1.000 on every line in every cell**, against a bound of **1.050**.
     - Light DPR 2 median 4.657 → **3.204** (chromium) and 4.725 → 3.246 (WebKit). Glyph cores 3.42–3.48, which
       clear the 3.0 floor.
   - **FADE80F** (the chair's FADE80 as a file edit): clean verdict GREEN 6/8. The row reds 8/8 **only** because
     the in-run FADE80 plant then writes the same value and is unseen, so a gate artefact is doing the work.
   - **Closable:** anchor G14 to the CONTROL, not to itself. Per cell and line, read the control's fraction
     under 4.5 on the same payload, and bound the tree at that fraction + slack. It's T9-R8-compatible: the
     control's own failure is the ceiling, never 4.5. Ship OPA80F as a file plant that must red in 8/8.
2. **The window statistic is still p95, one level finer: G5 is blind to a fade over < ~95 % of a GLYPH.**
   - **COMB** (`repeating-linear-gradient` 1 px stripes at 25 % α, half of every glyph) takes the median to
     **1.377 light / 1.448 dark in every cell**, with glyph cores 5.16 / 6.04 intact.
   - Row **GREEN 4/8**: chromium light DPR 2, chromium dark DPR 1, WebKit light DPR 2, WebKit dark DPR 1. The
     reds are G2 at dark DPR 2 ×2, and G5 on the `1` at light DPR 1 ×2, where the stripe happens to cover the
     narrow `1`.
   - Charter row 1 asked for "the window statistic re-cut so a fade over < ~95 % of a window is seen". It is
     closed for HEAD12F, not for its class.
   - **Closable** in the ONE copy (a PROPOSED diff with COMB as its plant): read each glyph window at a low
     quantile of its inked core (for example p50 of pixels with coverage ≥ 0.5), or add a per-line clause on
     the median against the control's median.
3. **G5 fails the clause-sabotage battery (LAWS P7 §F(ii)).** C5 (`gated()` drops G5) → **GREEN 8/8, exit 0**.
   Every in-run TEXT_PLANT is also seen by G2, G3 or G4, so the in-run self-test can't tell whether G5 exists. The
   prototype ran C1, C2 and C3 but not the pass's key new clause. G5's only proven work is on a FILE plant
   (HEAD12F). **Closable:** an in-run plant only G5 sees (a single-glyph fade, for example the leading digit at
   25 %, `{ mask: [0, 1/len] }` keyed to one character) that must red with G5 on and go GREEN with G5 off.
4. **G3's bound can exceed 1.** A clean fraction ≥ 0.95 makes `fracUnder + 0.05` ≥ 1.0, and every file plant
   reads bound 1.050, so G3 can't fire by construction. It's harmless on the clean tree (0.33–0.82). This is the
   instruments lane's row, cited.
5. **The G4 tolerance rule is a verdict override in the lane's reader, and the PROPOSED diff wasn't filed.**
   LAWS P7 §I says a lane that needs a shape the library doesn't read "extends the ONE copy in a PROPOSED diff
   with the plant". The spec re-scores the probe's G4 locally (`lowsOf` parses the probe's `why` strings). Its
   return names the cure (movedRows) but banks no diff under `pass8/prototype/PLR-COUNT/instruments/`. It's not a
   fork of the probe's code, but it is a second verdict. Combined with gap 1, it makes G4 inert on the shipped
   surface.
6. **`e2e/lib/glyph-pop.d.mts` lands in the chair's home from a lane.** It's declaration only, and the non-player
   exports are typed `unknown`. It's needed for `typecheck:e2e`, and the homes ship no types. That's a
   coordination row for the instruments lane (with SELF's `edge-bands.d.mts`), not a fork.
7. **B-FORK's frame is at N = 6 and N = 16, and (a)'s own loss lives at 7.** The thinnest numeral is ×1.16–1.19
   of one stroke, and the charter named "one N in 7–16" for it. (c)'s loss at 16 is framed (`IIIII+11`, 106 px),
   (b)'s light loss at 6 is framed, and (a)'s is numeric only. The ballot prints it, so it's acceptable if the
   chair rules the loss numeric-only. I LOOKED at the frame: it shows `6`/`6`/`IIIII+1` and `16`/`16`/`IIIII+11`
   as captioned, and the pass-7 "identical pixels" claim is correctly struck.
8. **The font-corpus exemption is by name, with no usage witness.** `LOBBY_ARIA_ONLY = ["plus"]` drops the key
   from the painted corpus. Nothing pins that `LOBBY_COPY.plus` reaches only `:aria-label`, and a future
   `{{ markName }}` paint would leave the corpus silently. It's the shape law's (iii) behavioural pair, small.
   Today it's true: `plus` is consumed only by `markName` (`PlayerMark.vue:137`), bound at `:454`
   `:aria-label`.
9. **Carried, declared, verified:**
   - Check 8 RED: live **284 / 281** against floors 214 / 212, `check-pw-projects` exit 1 on the tree
     (reproduced). This is the fold's.
   - T9-R8: G2 printed in 3 of 4 cells.
   - Two bare `--tap-floor` (SELF's), cited to pick 12.
   - π whole-DOM and the filter census are not re-read by either of us. The `src` delta over pass 7 is
     `PlayerMark.vue`'s script-only `fit()` and tap-debt code (read by me hunk by hunk: no template or style
     byte). It moves the OPEN sheet's `short` decision, never the shut rest pose, so the pass-7 critic's π
     (noise 0, every delta in the head) stands for the rest pose. The open sheet is SELF's claimed surface.

## 1 · What I re-derived (dev `:4242` on the tree, control `:4250` = `index-CubiZsMVSwTc.js`; box load 28–44)

| claim | prototype | my run | |
|---|---|---|---|
| G16 pinned `one`, poses 1–4 | ch L [59.61, 60.98, 61.65, 60.53] · D [58.46, 59.83, 60.48, 59.40]; wk L [59.20, 60.86, 61.40, 60.33] · D [58.51, 60.16, 60.70, 59.63] | **identical to 0.01, all four series** | REPRODUCES |
| G16 five · margins | 226.49/261.95 ch, 225.06/261.40 wk; light margin 5.47 %/6.13 % at six, 19.7/20.5 % at seven | **226.49 / 261.95 · 225.06 / 261.40; 0.0547 / 0.0613, 0.1969 / 0.2052; dark 0.323 / 0.3114** | REPRODUCES |
| G16 ink (a) light ch, N 6–16 | 88.47 … 156.60, six falls | **88.47 74.40 114.32 82.19 175.57 136.17 167.08 161.28 145.16 172.87 156.60**; falls 6→7, 8→9, 10→11, 12→13, 13→14, 15→16 in all four series | REPRODUCES |
| G14 clean medians | light DPR 2 4.657 / 4.725, `.pl-qual` 4.335 / 4.262, `.pl-more` 4.657 / 4.461; dark DPR 2 5.944 / 5.868 | **identical**; every in-run plant SEEN in 8/8; G14 + G16 12/12 passed, exit 0 | REPRODUCES |
| HEAD12F (pass-7 plant, run FIRST) | RED 8/8, G5 on `1` / `a`, 1.38 / 1.45 | **RED 8/8**: clean verdict G5 on `1` (`.pl-state`) and `a` (`.pl-more`), 1.38 light / 1.45 dark, all 8. The first assertion thrown is `HEAD12_a25 on .pl-qual is seen` (the in-run plant is masked by the file's) | REPRODUCES |
| widest board, 16×16 | 10/10; mark 44.84×44 (36 at desk); laps 0; sheet 1/11 · 4/0 · 4/18 · 4/9 · 4/12; negative 2–9 | **10/10 exit 0, the same numbers both engines**, negative laps 9/9/9/4/2 | REPRODUCES |
| font corpus plant (exemption emptied) | RED 1 | **exit 1** (`renders "0 plus 0" and the corpus does not hold it`); restored `b43ef0575119`, exit 0 | REPRODUCES |
| `check-font-coverage` · `check-copy-register` · `eslint` (3 pass-8 files, `--max-warnings 0`) · `check-pw-projects` | 0 · 0 · 0 · 1 | **0 · 0 · 0 · 1** (284 / 281) | REPRODUCES |
| bank | `apply --check` 0 on `74a2b5d9`; delta 0 on `74a2b5d9 + pass7 + homes` | **0 · 0** (fresh `git archive`s); tree diff `cmp` = bank | REPRODUCES |
| homes | 7/7 = `homes.diff` `a1d8adeb` | **7/7 `cmp` EQ**; imports `./lib/glyph-pop.mjs`, `./lib/edge-bands.mjs`; **0** `docs/` imports in `e2e/` or `scripts/` | REPRODUCES |

## 2 · Break and clause-sabotage battery (`instruments/crit-breaks.py`, one file edited per job, restored by copy)

| plant | kind | row verdict | clean verdict | reads |
|---|---|---|---|---|
| HEAD12F | file, pass-7 critic | RED 8/8 | RED 8/8 (G5) | §1 |
| **OPA80F** | file, mine | **GREEN 4/8** (all light) | **GREEN 6/8** | frac 1.000, bound 1.050; median L2 3.20 / 3.25 |
| **FADE80F** | file, mine | RED 8/8 | **GREEN 6/8** | reds by the in-run plant going unseen, not by the gate |
| **COMB** | file, mine | **GREEN 4/8** | GREEN 4/8 | median 1.377 / 1.448, glyph cores 5.16 / 6.04 |
| **C5 · G5 never gated** | clause sabotage, mine | **GREEN 8/8, exit 0** | — | G5 has no in-run bite |

The prototype's C1/C3 (RED 7/8) and C2 (GREEN 2/2) aren't re-run. C2's no-bite is declared (its gap 3).

## 3 · Constraints

| constraint | reading |
|---|---|
| AA from painted bytes | reproduces clean (§1), but it's **not a regression gate in 3 of 4 cells** (gaps 1–3) |
| instruments by relative product path | **clean**. No fork of the probe's code, but a local verdict override (gap 5) |
| π vs `74a2b5d9` | not re-read. The delta is script-only (gap 9) |
| filterBudget 9 | no filter or style byte in the delta (read); census not re-run |
| M16 | `check-copy-register` 0; no new painted string |
| @property | the prototype's 43 vs 42 (SELF's `--head-rule`); not re-derived here |
| ballot pair on one payload | one payload, `SIX_ARM` the only column variable, sha-restored; the frame LOOKED at and matches its caption (gap 7) |
| peer id pinned (P7 §C) | **closed**: read back, reproduces to the hundredth |

## 4 · Incidents (mine)

- The battery script was edited (the OPA80F job appended) while its first process ran. The running process held
  its jobs in memory, so no plant changed mid-run. OPA80F ran as a separate invocation after `BREAKS-DONE`.
- One foreground wait hit the 115 s tool limit and was moved to the background by the harness. It was a wait
  loop, not a battery.
- The servers were mine (dev 2944 / npx 2865, control 3087 / npx 3049). I killed them by PID after a cwd check,
  and both ports read free. The lane dir `web/frontend/.plrc8crit/` was `mv`'d to
  `<scratchpad>/trash-plrc8crit-1/`, and the tree write-tree at close is `de3b278d` (= bank).
- Box load was 28–46 across the runs. No timing row is read.

## 5 · Replay

1. Serve the tree on `:4242` (a scratch `vite.dev.mts` with a private cacheDir).
2. Run `npx playwright test -c <lane>/pw.config.ts player-tally.spec.ts -g "quiet lines paint 4.5:1|every count from six"`.
3. Run `python3 instruments/crit-breaks.py HEAD12F-p7file FADE80F-file COMB-file C5-G5-never-gated OPA80F-file`.
4. Classify with `instruments/g14c.py <log>`.
