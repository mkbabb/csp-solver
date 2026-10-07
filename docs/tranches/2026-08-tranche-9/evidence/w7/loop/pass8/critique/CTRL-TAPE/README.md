# CTRL-TAPE · pass-8 adversarial critique (§10 controls: the tape, the foot)

I wrote neither the charter nor the prototype. Every number below that isn't credited to the lane I took on
2026-09-25, 20:24–20:45, in chromium and WebKit, on servers I started and stopped. Box load (1-min) ran
49–108 (107.54 at open, 49.02 at the build, 62.15 at the π read).

**Verdict: ADVANCE. Convergence 86 % (up from 85).**

- **What advanced.** The foot gate is keyed on elements now. All 43 of pass 7's plants red, and so do the eight
  regime blind spots I tried (a 1920 desk, 2 dppx, reduced motion, more contrast, a portrait iPad, the dark
  scheme, a 1000 px-tall screen, forced colours). The behavioural row is real: I reproduced it to the hundredth
  in both engines. Row 20 is closed on every arm, and G3 is 0 px at 1440 with its F1 plant at 103.7 px. The lapse
  unit rows pass 38/38, the bank reproduces byte for byte, and π, the filter budget, M16 and `@property` all hold.
- **What holds the number down.**
  1. **The new column clause is cured for its plants, not for the class.** It is the fifth pass of this class,
     and the first for the column's own clause. `.controls-card { overflow-y: visible }` or `overflow-y: clip`,
     a vacuous cap, or a top margin each revert the seam's effect with the gate GREEN. Each puts the verbs
     243–597 px below the viewport in both engines.
  2. **Three siblings escape the gate and the behavioural row together.** On paint they move the tape to the
     case's TOP, or collapse its frame, at the rail in both engines.
  3. **Graft 3 asks on a board the player never wrote on.** After a Deal with no player ink, a fine pointer's
     Solve asks, in both engines. That goes against T9-M12's own precondition, and the lane's new comment says
     the reverse.
  4. **Row 5 is named, but attributed to someone else's design.** The dashed ring is TAPE's own pass-4 ring,
     and the control has none.
  5. **keys-crib's 844×390 G3 cell cannot fail.** A swallowed `load()` timeout reads as "NAMED absent".

The rig:

- **Tree.** `git archive a6dc0c53`, built myself with a private cacheDir. It reproduced **`index-DsvO0RL8r_bB.js`**
  / `index-C6DCWDyewgP3.css`, served on **:4230**.
- **Merged.** `git archive dc781cd5`, built the same way. It reproduced **`index-DnfQ4D5OcO50.js`** /
  `index-3l5Mtxqm0Z8U.css`, served on :4230 after the tree server was stopped.
- **Control.** `w7-control`'s pre-built **`index-CubiZsMVSwTc.js`**, on **:4252**. It was never edited, built or
  git-touched.
- **Clean-up.** Every listener was stopped by recorded PID after its cwd and wrapper were checked (tree
  30830/30770, merged 61144/61100, control 30856/30772). Both ports read free at the end. Everything I wrote
  outside this directory went to `<scratchpad>/crit-tape8/`. No `rm` ran, and I banked no frame (0 B headroom).

## 0 · Gaps first (exact)

| # | gap | evidence (mine) |
|---|---|---|
| G1 | **Clause 9, the column, is cured for its plants.** `check-tape-foot` is GREEN, on the tree AND the merged tree, under four one-line reverts of the seam's EFFECT. <br>• **C1** `@media (min-width:1024px){.controls-card{overflow-y:visible}}` and **C7** `overflow-y: clip`: the card stops being a scrollport, so its automatic minimum becomes its content. `scene.css`'s own comment names the precondition ("a scrollport's automatic minimum is 0"), and no clause holds it. <br>• **C6** `.drawer-case{max-height:999rem}`: a cap that caps nothing. <br>• **C9** `.card-foot{margin-top:100vh}`. <br>On paint, every one of them puts the foot entirely below the viewport, both engines: 1280×800 verbs at 1043.5–1397.5 against vh 800, 390×844 at 1104.9–1214.2 against 844. F1's class exactly. | `readings/breaks8-tree.txt`, `breaks8-merged.txt`, `escapes-behavioural.txt` |
| G2 | **Three siblings escape BOTH witnesses (gate GREEN, `footBottom` holds) and still move paint.** <br>• **C4** `.card-foot{order:-1}`: the tape moves to the case's TOP, verbs 202.88 against 690.06 clean. Both engines hold at 1280; chromium also holds at the dock; WebKit's dock reds for an unrelated reason. <br>• **C14** `.drawer-case{padding-bottom:100vh}`: the case runs 44–844 against vh 800, and the foot sits at its top. It holds in chromium at both cells and in WebKit at the dock. <br>• **C12** `.action-bar{height:0}`: the frame collapses to a band above the verbs, which hang below it (verbs 746.09 against a bar box of 683.67–692.45). It holds at 1280 in both engines. <br>`footBottom` checks the frame's own box and the viewport. Nothing asks that the bar is the case's LAST child, or that the verbs sit inside their frame. | `readings/escapes-behavioural.txt`; I looked at `webkit-C4`, `chromium-C12` (not banked) |
| G3 | **Template-level hides pass the gate.** `v-show="false"` or the `hidden` attribute on `#card-foot`, and `:disabled="true"` on the bar's Teleport, are all GREEN. The first two blank the foot on paint (T4 is RED in the behavioural row, where it's local only; O-12 means CI has only the gate). Also GREEN: `@apply overflow-hidden` inside `.card-foot`, and `.card-foot{height:0}`/`padding-top:100vh`. That makes 14 of 39 real siblings GREEN (P7 moves no paint and P13 is the harmless control; neither is counted). | `readings/breaks8-tree.txt` |
| G4 | **Graft 3's nag.** 1440×900, fine pointer, `hasTouch: false`, both engines: **Deal → Solve with no player ink ASKS** ("fill in the whole board? keep / solve"), and the board stays 20 empty. After a page load, Solve fills on one click. The control solves on one click in all three arms. <br>• T9-M12 says "input a value … then attempt a destructive action", and a dealt board has no input. The new comment at `GameControlPanel.vue:629–634` says "a pristine board has nothing to ask about"; the tree asks on exactly that board. <br>• The M12 fine row's negative uses a PAGE-LOAD board, so it cannot see this. No unit row can either, because `isDirty` is a prop. <br>• The lane routes the cure ("player-written since the deal") to the chair as a ruling. That is the elegant-reduction trap: the hard half is deferred. | `readings/graft3.txt` |
| G5 | **Row 5 (the foot ring) is OPEN.** The loss is named, but the claim beside it is false: "the cure (a solid ring) is the estate ring's form, not the tape's". <br>• `outline: 2px dashed var(--ring-ink)` at `GameControlPanel.vue:2395` is TAPE's own pass-4 ring (its comment cites `pass4/prototype/CTRL-TAPE/readings/r4-ring.json`). `74a2b5d9` carries no `2px dashed` at all. <br>• The cure was in the lane's remit, and it neither took the cure nor set it as an owner ballot. Chair ruling 7 asks for "the dash as the design's cost FOR THE OWNER". <br>• I didn't re-read the station-1 numbers; the lane's RED stands, and nobody claims it green. | source grep, tree vs control |
| G6 | **keys-crib's 844×390 G3 cell is a masked fallback that cannot fail.** `await load(page, …).catch(() => undefined)`, and `load()` waits 20 s for the `i` to show. So at 844×390 the 20 s timeout is swallowed and the cell passes "NAMED absent" (20.4/21.2 s, both engines). A load failure of ANY cause reads the same way. "keys-crib whole 16/16" counts these 2 vacuous greens. Cure: assert the page loaded and that `mobile` holds at the cell, and do not swallow the load. | `readings/keys-crib-merged.txt`, `keys-crib.spec.ts:315–322` |
| G7 | **The lane did not report π, the filter census or `@property`,** and LAWS/registry-v7 §8.1 refuse a return without π and AA. I read them myself (§1). They hold, so this is a return-contract gap, not a paint one. | README of the prototype (no π row) |
| G8 | **The merged tree carries two `docs/` imports, both in s10's files, not TAPE's:** `e2e/face-law.spec.ts:1837` → `pass7/prototype/CTRL-FACE/instruments/edge-bands.mjs` and `scripts/check-font-coverage.mjs:970` → `…/CTRL-FACE/instruments/shape-census.mjs`. Either one reds the fold (LAWS §C), and the lane's merged-tree readings don't declare them. This is FACE's row, handed to the chair. | grep on `dc781cd5` |
| G9 | **The gate depends on unratified library clauses.** `param-carried` and five others live in the tree's copy of `scripts/shape-census.mjs`, not in the chair's home. I verified that the PROPOSED diff equals the tree's library delta line for line. Without it the gate reds 8 UNRESOLVED on s10 (the lane's reading). The fold must take `shape-census.TAPE-clauses.PROPOSED.diff` first. | `diff` of homes vs tree library |
| G10 | **Row-20 numbers are misreported: chromium's minimum is 4.0 css, not 4.5.** The chromium arms read shipped 4.0 / 4.33 / 4.5 / 4.67 css and the 0.625rem arm 2.0 / 2.33 / 2.5 / 2.67 (390×844@2 is the minimum). The lane printed only "4.5 / 4.67" and "2.5 / 2.67". So the 0.625rem arm sits at exactly 2.0 css in BOTH engines. The verdict, CLOSED, stands. | `readings/foot-rows-tree.txt` |
| carried | Declared by the lane, and I confirm them: INTAKE-22 row 23 is OPEN on the letter (no `tool-strip.spec.ts`), and rows 19 and 21 weren't re-read. `test:e2e:projects` is red on the FLOOR BAND (WGATE's restamp), `check-doc-truth` is red 6 (4 count drifts, 2 environment), and `face-law.spec.ts:1941` is a TS2339 on s10. The census still reds bare (3 findings); its A.3 row is a draft, and the chair mints the id. The zone-grammar T9-M18 row at `:457` still decodes PNGs in-page (a base row, not a fork). | — |

## 1 · What I re-ran (both engines unless named)

| row | lane's claim | critic | verdict |
|---|---|---|---|
| bank | tree a6dc0c53; pass8.diff 676,019 B sha1 d8e58cf3, 41 files +12,145/−735 | temp-index write-tree **a6dc0c53**; diff **676,019 B d8e58cf3**, **41 files +12,145/−735**; delta vs 711834e8 21 files +8,580/−1,009 | reproduced |
| apply | 0 on 74a2b5d9, 711834e8, s10 | fresh archives: pass8 on 74a2b5d9 **0**; delta on 711834e8 **0**; on-s10 on 7f149a7f **0**; replay of pass8.diff = my tree archive (`diff -rq` empty) | reproduced |
| dist | tree `index-DsvO0RL8r_bB.js`; merged `index-DnfQ4D5OcO50.js` | both rebuilt from archives, identical names; served JS verified by hash on every port | reproduced |
| **pass-7 plant FIRST** (the gate the charter re-cut) | 29 siblings RED | pass-7 critic's `breaks7.mjs` unchanged: **K 0/14 GREEN, S/F 0/29 GREEN** (F1–F4 → clause 9; S9a–e → script; S10 → PEN; S14/S16 → SEAT) | reproduced |
| gate live · self-test · sabotage | 0 · 93 · 10/10 | live **0** (tree, merged); `--self-test` **93 red, exit 0**; `--sabotage-battery` **10/10**, bites 15/3/15/8/1/1/5/29/10/6, exit 0 | reproduced |
| **new siblings** (mine, 41) | — | tree **15/41 GREEN**, merged **15/41 GREEN** (same list): G1–G3 | NEW RED |
| row 2 painted bottom, 4 cells | dock 758.25–839.5, verbs 829.77; land 294.75–382.5; 1440 685.75–764.5; 1280 620.75–699.5 | whole group **16/16 passed** (8 foot-bottom + 8 inset). Clean: chromium dock 758.25–839.5 foot 765.23–844 verbs 829.61; webkit dock foot –844.16 verbs 829.77; land 294.75–382.5 both; 1440 686.75–765 (c) / 685.75–764.5 (w); 1280 621.25–699.5 (c) / 620.75–699.5 (w). S10/S2/S14/F1 red in-run every cell | reproduced to the hundredth |
| row 20, every arm | chromium 4.5/4.67 & 2.5/2.67; webkit 4.0–5.0 & 2.0–3.0 | chromium CDP 34: shipped **4.0 / 4.33 / 4.5 / 4.67**, 0.625rem **2.0 / 2.33 / 2.5 / 2.67**, NEG 818 > 810 (red); webkit flat phone: shipped 4.5 / 4.33 / 4.5 / 4.0, 0.625rem 2.5 / 2.33 / 2.5 / **2.0** | CLOSED; G10 |
| row 4 G3, merged | 1440 0 px/42 f, F1 103.73/103.67 | **0 px/42 f open, 0 close, in-rAF 0/0; F1 103.73 (c) / 103.67 (w); back 0/0**; keys-crib 16/16 | reproduced; the 844 cell is G6 |
| row 6 lapse unit | 38/38 | `GameControlPanel.test.ts` **38/38** on the archive | reproduced |
| graft 3 | asks after a Deal (declared for the chair) | tree: A load→Solve fills on one click; **B Deal→Solve asks, board kept 20 empty**; C Deal→digit→Solve asks. Control: one click in A, B and C. Both engines | G4 |
| π outside the case vs `74a2b5d9` (pass-7 critic's ancestry-keyed whole-DOM probe, PINNED_GIVENS `0:5,2:8,11:3,18:6,20:9`) | not reported | **rect 0, paint 0 at 12 cells** (rail1440 / dock390 shut / coarse1280 × light/dark × 2 engines), n 772, 1 tag (the declared wrapper); ctl-vs-ctl 0/0/0 | holds (G7) |
| filterBudget (`filter-census.spec.ts` on the built dist, both projects) | not reported | tree **12/12, exit 0**; control **12/12, exit 0** | holds |
| M16 (`check-copy-register` bare) | lint:copy 0 | tree **0**, control **0**, merged **0** | holds |
| `@property` (pass-6 `check-property-block`, source + served) | not reported | tree **GREEN** (served `index-DsvO0RL8r_bB.js`; 46 registrations vs control 42, the four new `--case-offset`/`--masthead-foot`/`--pin-band`/`--sheet-chrome` `inherits: true`); control GREEN | holds |
| instruments by product path | relative, no `docs/` | tree: `zone-grammar` → `./lib/paint-lib.mjs`; gate → `./shape-census.mjs`; e2e/lib ×5 **byte-equal to homes.diff** (a1d8adeb); library = homes + the PROPOSED diff exactly. merged: keys-crib → `./lib/postpaint.mjs`. **No `docs/` import on the tree**; two on the merged tree (G8) | holds on the tree |
| AA | ring red at station 1 (declared) | the ring's red not re-read. No new painted text on the tree (graft 3 is script) | G5 |
| check-evidence-policy (repo root, bare) | — | **PASS, exit 0**, after this critique's text banked | holds |

## 2 · The class, again

- **The element keying is the real advance.** Pass 7's 29 siblings and 14 K-plants all red. So do regime-gated
  breaks in media the regime set never samples (≥1600 px, 2 dppx, reduced motion, more contrast, forced colours,
  portrait tablet, dark scheme, min-height 1000). The gate reads a site in an unsampled context instead of
  dropping it.
- **What is still unheld is the column's own preconditions.** `flex-shrink` and `flex` are keyed. The two things
  that actually let the card give the foot its height are not:
  - the card being a SCROLL CONTAINER (`overflow-y: auto`), which zeroes its automatic minimum;
  - the cap having a VALUE.
- **The behavioural row checks the frame against its own box.** It never checks the tape against the case. A
  foot moved to the case's top (`order`, `column-reverse` is red but `order` is not, or the case's padding) keeps
  every predicate green.
- **Cure, and it's small:**
  1. Clause 9 requires `.controls-card`'s `overflow-y` ∈ {auto, scroll} in every regime where the case caps.
  2. It whitelists the cap's VALUE (the `100dvh`/`min()` form) or reads it through `lengthPx` ≤ vh.
  3. It refuses `order`, `margin-block`/`padding-block-start` on the foot, and `padding-block` on the case.
  4. The behavioural row adds `foot.bottom ≥ case.bottom − 1`, which puts the tape at the case's foot.
  5. It adds `verbsBottom ≤ ink.bottom`, which keeps the verbs inside their frame.
  6. The gate reads `v-show`, `hidden` and a Teleport's `disabled` on the chain.
- **Plants.** Ship C1/C4/C6/C7/C9/C12/C14/T4/T5/T6 as plants.

## 3 · Checklist

- **Vacuous convergence.** G6: the 844 cell cannot fail.
- **Gates that cannot fail.** The clause sabotage passes 10/10. The class is still open (G1–G3).
- **The elegant-reduction trap.** G4 hands the "narrower dirty" to the chair.
- **Masked fallbacks.** G6 again: `.catch(() => undefined)`.
- **Unverified gestalt.** The surface is photographed only by me, and not banked. The lane banked no frame, and
  its rows are paint reads, which I accept for gate work.
- **π.** Holds (§1).
- **Constraints.** AA ring RED, named (G5). The filterBudget holds, and so do M16 and `@property`.
- **Instruments.** No `docs/` import on the tree. The merged tree's two are FACE's (G8).
- **Numbers not re-derived.** Two are misprinted in the lane's favour (G10), and the verdict is unchanged.

## Replay

- **Gate.** From the lane's `web/frontend`: `FE=$PWD node <this>/instruments/breaks8.mjs`, and the pass-7 set
  `pass7/critique/CTRL-TAPE/instruments/breaks7.mjs`.
- **Behavioural escapes.** Copy `instruments/crit8-escapes.spec.ts` (it extracts the lane's own `frameInk` /
  `FOOT_GEOM` / `footSettled` / `footBottom`, zone-grammar :680–754 and :844–863) into an archive's
  `web/frontend/e2e-crit8/` with `lib/paint-lib.mjs` beside it. Then run
  `CRIT8_E2E=./e2e-crit8 CRIT8_BASE=… npx playwright test --config crit8-pw.config.ts`.
- **Graft 3.** `node instruments/graft3-probe.mjs <label> <base>`.
- **π.** `node instruments/critic-pi8.mjs <tree> <control>`.
- **`@property`.** `node instruments/check-property-block.p6copy.mjs --fe … --served …`.
- **Filter census.** `PLAYWRIGHT_BASE_URL=… npx playwright test --config playwright-throttle.config.ts --project filter-census-chromium --project filter-census-webkit`.

## Incidents (mine)

- **One read-only `git status --short` in the lane's worktree** (the critic's sanctioned tree; it can refresh
  stat data in the index). All my cuts used `GIT_INDEX_FILE` under the scratchpad.
- **The first filter-census launch used the default config and found no tests** (the census lives in the
  throttle config). I re-ran it on the right config, and the exit codes above are from that run.
- **The first control `@property` run redded STAMP,** because my scratch control archive has no dist. I re-ran it
  with `--dist` pointed at `w7-control`'s pre-built dist, read-only.
- The 20 s timeout at keys-crib's 844×390 is the spec's own (G6), not a stall.
