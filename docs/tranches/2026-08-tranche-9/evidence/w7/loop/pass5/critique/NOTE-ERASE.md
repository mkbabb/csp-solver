# NOTE-ERASE · pass-5 CRITIQUE

I'm the critic. I didn't write the charter, the spec or the prototype. The base and π control is `74a2b5d9`.

I rebuilt the lane's tree myself, with the vite config and cacheDir kept in scratch outside the tree. The rebuild is **byte-identical to the tree's own dist, `index-B5bclKNTuHnj.js`** (43 files, `diff -r` empty), so every row below reads the FINAL tree, not the lane's probe-time `aW5mm…`. I served it on `:4246`. The shared control dist `index-CubiZsMVSwTc.js` was on `:4247`, and a dead-hook dist `index-DudLmXPPysdv.js` was on `:4248`. I verified each port by its asset hash.

Payload for every row: the lane's codec payload `ATMuNTMw…MDc5` (the classic easy 9×9, 30 givens). Every page asserted the dealt given-set before it read anything.

Readings are in `critique/NOTE-ERASE/logs/`. Instruments are in `critique/NOTE-ERASE/instruments/`. I banked no crops.

**Convergence: 90 % (held at the re-audit, §0). Verdict: ADVANCE.**

This pass cured pass 4's three structural reds:
- **G5** now reds the mint act.
- **The honest clock** is specificity-proof.
- **The estate** carries a real browser row for the mechanism.

I reproduced all three and pushed each one further than the lane did. What's still open is narrower:
- G5 is VALUE-blind.
- G16's only CI-running half is text-keyed and stays green on a dead hook.
- The static `@property` registration is ungated on this tree.
- The whole-DOM π finds a sub-pixel move of W2's drawer tab that the lane's four-selector π couldn't see.
- The parked record still paints nothing.
- The settled rung costs the AA tail at DPR 2.
- The `2lh` seating and ARM C don't exist on any tree.

---

## 0 · Re-audit (2026-09-23, same critic stage, resumed)

The first critic run (2026-09-22, 19:27–19:35) wrote this file and died before it returned. I resumed it: audited the disk, didn't redo it, and re-ran four rows of my own. Readings are in `critique/NOTE-ERASE/logs-r2/` and instruments in `instruments/r2-*`.

**Tree integrity first.** The first run's break-tests left `index.css`, `pencilConfig.ts` and `MarginNote.vue` with mtimes after the lane's README (19:29 and 19:32), so I rebuilt the tree from scratch (config and cacheDir outside the tree). The rebuild is **`diff -r` identical to the tree's dist, `index-B5bclKNTuHnj.js`**. Every restore held, and the tree at return is product files only.

| row (both engines unless stated) | result |
|---|---|
| **R2-1 · G5, break-tests** (`r2-break-g5.log`, cfg restored by sha1 `ec263af6`) | mint `erase: 125` → **RED** (reproduces the lane). RETUNE `whisper 150→125` → GREEN 11/11. **SWAP whisper↔dusk (the rub-out now spends 350 ms)** → GREEN 11/11. RETUNE `step 440→1` → GREEN 11/11. **G5 is a key-set gate and blind to every value.** |
| **R2-2 · the "exit gate reds" sentence** (`pencilConfig.ts`): a **no-publisher dist** (`publishMotionRungs();` commented out in `main.ts`, built `index-rDNFsnQN1BD6.js`, `main.ts` restored by sha1 `67203be9`) | the drop-clock row **RED, exit 1**, both engines: `animationDuration` `Expected > 0, Received 0` (`r2-e2e-nopub.log`). The same row on the tree dist: **2/2, exit 0**. **The sentence is TRUE** (charter row 5, closed). |
| **R2-3 · the clock, re-run on B5bcl** with a NEW adversary: longhand `transition-property: all !important; transition-duration: 800ms !important` on `html body #app .margin-note .margin-note-ink.note-leave-active`, (1,4,2) | hook: **0s · 156.7 / 155 ms**. BLOCKED at source: **0.8s · 817.4 / 816 ms**. Every other adversary reproduces within 5 ms (hook 151–159 ms, all `important`; BLOCKED p110 360.5 / 369, p110-imp 361.1 / 365, p210-imp 614 / 618, delay-imp 926.2 / 926). BLOCKED settled p110-imp read 0.35s but dropped at **189.6 / 186 ms**. That's the first run's own incident again: the leave landed while the settle's dusk tween was still running, and its `transitionend` resolved Vue's wait early. That arm isn't a control. |
| **R2-4 · whole-DOM π at 812×375 coarse** (never run before) and 844×390 coarse, hasTouch witnessed (`coarse: [true, true]`), 1,051 elements in each arm, control-vs-control in the same run (`logs-r2/critic5r2-pi-*.json`) | **812×375 at rest:** strip 21.98 vs 20.80 (+1.18, the lane's number). **`button.drawer-tab` y 159.69 vs 159.09 (+0.60)**, `p.board-voice` +1.19, docH +1. That's 22 deltas against a floor of 1 (logo clip), identical on both engines. **844×390 at rest:** the tab is +0.64 (167.23 vs 166.59) and the strip 22.09 vs 20.80 (+1.29), reproducing the first run. **After first speech** HEAD's tab moves to 159.67 / 167.22, within 0.02 of the tree's. The tab's rest position is therefore **the same F-ERASE-1 fork expressed on W2's control**: ARM 1 lowers it at rest, ARM 2 jumps it ~0.6 px on first speech. It isn't declared in the README or in the ballot row, at either landscape cell. |
| **R2-5 · M16 and prettier, bare** | `check-copy-register` exit 0 (0 dashes, 0 unadmitted, lexicon 25). `prettier --check` over the diff's product files: exit 0. `lint:theme-tokens`: exit 0. |

**Estate incident (declared, not ERASE's).** `scripts/check-evidence-policy.mjs`, run bare at the re-audit, exits **1**: the w7 wave holds 3,316,209 B of PNG against the 2,097,152 B cap. ERASE's two crops total 10,298 B, and this critique banked no PNG. The breach belongs to the chair's sweep.

What the re-audit changes: gap 4 widens to both landscape cells, and the ballot row has to carry the tab. Gap 1 hardens: a whisper↔dusk swap, which doubles the verb's length, passes both the unit and the e2e row (350 < 500). Charter row 5's sentence moves from unverified to closed. **O-12 applies to gap 2:** CI is browserless, so the shipping drop-clock row is a LOCAL instrument. The only CI gate on the hook is still the text half that a dead hook passes.

---

## 1 · Re-measured, both engines, on the final dist

### A · The honest clock: five adversaries, with the hook BLOCKED at the source as the negative control

The negative control is an init script that patches `CSSStyleDeclaration.prototype.setProperty` to drop exactly the hook's write. That's different from the lane's form, which removes the write in a MutationObserver after it lands. Readings: `logs/critic-clock-*.json` and `logs/critic-settled-*.json`.

| plant (leave) | hook: td · node absent (chromium / webkit) | BLOCKED: td · absent (chromium / webkit) |
|---|---|---|
| none · fresh | 0s · 152.2 / 154 | 0s · 155.6 / 188 |
| `#app .margin-note-ink` (1,1,0) 350 ms · fresh | 0s · 158.3 / 154 | **0.35s · 362.4 / 367** |
| (1,1,0) `!important` · fresh | 0s · 160.8 / 153 | **0.35s · 357.4 / 362** |
| **(1,2,0) `!important` 600 ms** · fresh (mine) | 0s · 163.1 / 158 | **0.6s · 612.6 / 616** |
| **DELAY adversary** `10ms … 900ms` `!important` · fresh (mine) | 0s · 158.7 / 161 | **0.01s · 925 / 928** |
| none · settled, held 800 ms | 0s · 152.9 / 153 | **0.35s · 370.6 / 361** |
| none · settled, held 0 ms | 0s · 149 / 151 | 0.35s · 344.9 / 327 |

- The inline write reads `none` with priority `important` in every hook arm.
- `animation-duration` reads `0.15s, 0.15s` in every arm.
- The bound is the author origin, as claimed. I went past the charter here: the delay adversary and the (1,2,0) plant both lose.

**My own incident.** In my first settled run the BLOCKED arm read 0.35s but the node dropped at 186 / 179 ms. The settle's dusk tween was still in flight, and its `transitionend` resolved Vue's wait early. I re-ran with the hold controlled (the rows above). The 800 ms hold is the clean control. The 0 ms hold shows that a mid-tween leave drops early even without the hook.

### B · The shipping row, broken WITHOUT deleting the hook (`logs/e2e-deadhook.log`, `logs/e1–e4.log`)

| run | result |
|---|---|
| E1 · `affordances.spec.ts` WHOLE, tree dist, both engines | **26/26, exit 0** |
| E2 · the drop-clock row on a DEAD-HOOK dist. `if (el) return;` is inserted as `stopTheClock`'s first line, so every string the unit greps is intact. | **2 failed, exit 1**, `Expected "0s" / Received "1s"` on both engines |
| E3 · the tree's spec on the control dist | 24 passed / 2 failed, exit 1 (the new row reds at HEAD) |
| E4 · the control's OWN spec on the control dist | **24/24, exit 0** |

The SFC was restored by sha1 after the dead-hook build. The scratch dir was moved out of the tree for that build.

### C · π over EVERY element under `#app`, with control-vs-control in the same run (`logs/critic-pi-*.json`)

This probe is not four selectors: 1,092 elements at 1280 and 1,051 at 844×390, the same count in both arms. Properties read per element:
- tag and rect
- `color`, `background-color`, `opacity`, `transform`, `filter`
- `visibility`, `clip-path`, font, `min-height`

| cell · state | tree vs control | control vs control (noise) |
|---|---|---|
| 1280×800 fine · empty | 4: strip `min-height` 23.6288 vs 20.8, the strip and board-margin rects (+2.83), logo clip (noise) | 1 (logo clip) / 5 webkit |
| 1280×800 fine · fresh+400 ms | 4: `min-height`, rects +0.02, and **`.margin-note-ink` color `oklab(… / 0.72)` vs `rgb(38,38,38)`**. That's the claimed settle mid-tween: the lane's π keyed `.margin-note`, never the ink, so its "paint delta empty" sentence couldn't see its own settle. | 0 |
| **844×390 coarse · empty** (pointer coarse witnessed on both arms) | **22 / 24**. The column grows +1.29, and **`button.drawer-tab` (W2's tab) sits +0.64 px lower (y 167.23 vs 166.59)** along with its tongue, text, outline and four boil poses. `p.board-voice` is +1.29. docH +1. | 1 / 5 (logo clip, boil-pose swaps; the drawer tab doesn't appear) |
| 844×390 coarse · fresh | 2: `min-height` and the settle colour (webkit 24 rects at +0.03: HEAD's strip reads 22.06) | 6 / 8 boil-pose swaps |

**The strip reproduces.** At rest it's +2.83 at 1280 and +1.29 at 844×390, the same in both engines.

**The undeclared move.** W2's drawer tab moves 0.64 px at rest in the landscape cell on both engines. It's sub-pixel. It isn't in the README, which says "board · controls · `.margin-note` = 0" and "W2: … π reads 0 on `.controls-card`". Both statements are true, and both are silent on the tab, because the probe never read it.

### D · Painted AA with the sensitivity row, DPR 1 AND DPR 2 (`logs/critic-aa-*.json`)

This uses the lane's statistic, copied with its OUT re-pointed. The colour is polled until stable before each read.

| arm | core median ch / wk | worst column at ≥50 % of median mass, ch / wk | fraction of columns < 4.5, ch / wk |
|---|---|---|---|
| tree settled · light · DPR 1 | **5.17 / 5.17** | 1.69 / 1.76 | 0.385 / 0.431 |
| tree settled · dark · DPR 1 | **6.07 / 6.13** | 1.94 / 1.91 | 0.349 / 0.349 |
| HEAD fresh · light · DPR 1 | 14.52 / 14.52 | 1.80 / 1.84 | 0.358 / 0.312 |
| HEAD fresh · dark · DPR 1 | 12.25 / 12.25 | 2.87 / 2.74 | 0.257 / 0.291 |
| **tree settled · light · DPR 2** | 5.17 / 5.17 | **1.80 / 1.95** | 0.344 / 0.349 |
| **HEAD fresh · light · DPR 2** | 14.52 / 14.52 | **2.76 / 4.49** | 0.307 / 0.298 |
| **tree settled · dark · DPR 2** | 6.07 / 6.13 | **2.71 / 2.73** | 0.294 / 0.311 |
| **HEAD fresh · dark · DPR 2** | 12.25 / 12.25 | **4.58 / 6.79** | 0.266 / 0.274 |

- **The lane's painted numbers reproduce to the hundredth:** 5.17, 6.07 and 6.13.
- **Two readings the lane didn't have.** First, HEAD's own full-graphite line reads 26–36 % of columns under 4.5 at both DPRs. The per-column fraction doesn't separate glyph text from a defect, so it's a statistic problem for the wave, not ERASE's.
- Second, the settle's cost shows up in the tail at DPR 2. The worst ≥50 %-mass column falls:
  - light: from 2.76 / 4.49 to 1.80 / 1.95
  - dark: from 4.58 / 6.79 to 2.71 / 2.73
- The median has 0.67 of headroom over 4.5 in light.
- (My "tree fresh" rows read `age settled`: the stable-colour poll outlasted the 1000 ms settle, so I struck them. The HEAD rows are the fresh line.)

### E · The filter budget (`logs/critic-filter-*.json`)

This counts the painted computed-`filter` population at 1280 on the 9×9 payload, at load and with the hint armed:

| | chromium | webkit |
|---|---|---|
| light | tree 8 = control 8 | tree 8 = control 8 |
| dark | tree 9 = control 9 | tree 9 = control 9 |

The dark 9 includes HEAD's `svg.crayon-heart.idle saturate(0.85)`, which is ACC-SIX's born-RED under chair §1.4. The budget didn't grow.

### F · Units, lints and the battery, each gate bare (`logs/battery.log`)

The tree is compared against a `git archive 74a2b5d9` in scratch. All of these read **tree 0 · control 0**:
- `lint:lanes` (control first read 2 because my archive lacked `.github`; re-run 0, which was my defect)
- `lint:theme-tokens`, `lint:sleep`, `test:e2e:projects`, `check-pw-projects`
- `eslint .`, `npm run lint` (prettier)
- `lint:copy`, `check-copy-register` bare (0 dashes, 0 unadmitted, lexicon 25)
- `lint:motion`, `lint:ink`, `check-ink-pressure`, `vue-tsc --noEmit`

`vitest src/pencil` reads **9 files / 84 tests** (the lane's chunk). The whole spec file is covered in B above.

The undefined-token census over `MarginNote.vue`'s 18 `var()` names:
- Fifteen are declared in static CSS.
- The three rungs (`note`, `whisper`, `dusk`) resolve through a static `@property` (initial 0ms) plus the runtime publisher.
- None is undefined.

---

## 2 · Every gate I tried to break (`logs/break.log`; every edit restored and sha1-verified)

| gate | break | result |
|---|---|---|
| **G5** (the rung SET) | RETUNE `whisper 150 → 125` in §7's graft. That's a ladder row §7 may not write; under the escape-VALUE law a RETUNE is a row. | **GREEN, 11/11.** The e2e row stays green too (0.125s > 0, < 500 ms). |
| G5 | RETUNE `rise 520 → 600` (T9-B11's other arm, which is the owner's call) | **GREEN, 11/11** |
| **G16 static half** (the only CI half) | the dead hook: text intact, `if (el) return;` | **GREEN, 11/11.** Only the browser row sees it (B · E2), and CI is browserless (O-12). |
| **@property registration** | delete `@property --motion-rise` | unit 11/11, `check-theme-tokens` 0, `check-motion-contract` 0: **nothing reds** |
| @property registration | delete `@property --motion-whisper` (the rung the verb spends) | **nothing reds**. The e2e row stays green while the publisher is present. |
| **@property law (brace-nested RED)** | nest all seven blocks inside `:root{}` | **nothing reds on this tree.** The LAWS' brace-nested RED is §13's B3, which isn't in this diff. |
| the drop-clock e2e row | the dead hook (above) | **RED, both engines.** It's real. |
| my PROPOSED behavioural G16 | the dead hook | jsdom + `@vue/test-utils` with the Transition UNSTUBBED is **green on the tree (1/1)** and **RED on the dead hook**, while the lane's file stays 11/11 green in the same run (`logs/feas.log`, `logs/feas2.log`). That proves a CI-runnable behavioural gate exists. See `instruments/g16-behavioural.PROPOSED.test.ts`. |

I didn't re-run the mint (`erase: 125`). By reading, it's the same `toEqual` over keys, and the lane's `readings/g5-break.log` shows it RED.

---

## 3 · Open gaps (each closable, numbers attached)

1. **G5 is value-blind.** Retuning `whisper` to 125 or `rise` to 600, retuning `step` to 1, or SWAPPING whisper↔dusk (the rub-out on 350 ms; the re-audit's rows) all keep the unit file 11/11 green, and the e2e row's `< 500 ms` admits the swap. The fix: assert `MOTION.rungs` deep-equals §13's banked map `{whisper:150, leave:200, note:250, dusk:350, step:440, throw:520, rise:520}` (`MOT-VERB/pass4.diff:5547-5600`, verified). Ship it with the retune as its born-RED in the same batch.
2. **G16's CI half is text-keyed.** A dead hook with its strings intact keeps `marginNote.motion.test.ts` 11/11 green. Under O-12 the drop-clock e2e row never runs in CI, so on the CI surface the hook is ungated. Land the behavioural unit (VTU mount, `stubs: {transition: false}`, the leaving span's inline `transition` reads `none|important`) beside the text rows. It's proven red on the dead hook in this critique.
3. **The static `@property` registration is ungated on this tree.** Deleting `--motion-whisper`'s or `--motion-rise`'s block, or nesting all seven inside `:root{}`, reds nothing: not the unit, not `check-theme-tokens`, not `check-motion-contract`. Two ways to close it:
   - cite §13's B3 as the fold's gate by file:row, or
   - land `check-theme-tokens`' PROPOSED "static and complete" row with the nest and a deletion as its negative controls.
4. **Undeclared π on W2's tab.** At 844×390 coarse, at rest, `button.drawer-tab` is +0.64 px in y and `p.board-voice` is +1.29, on both engines. Control-vs-control is 0 on those elements.
   - Declare both in F-ERASE-1's landscape row, AT BOTH landscape cells. The re-audit ran 812×375: the tab is +0.60 px (159.69 vs 159.09) and the voice +1.19, both engines, against a floor of 1. After first speech HEAD's tab lands within 0.02 of the tree's, so it's the fork, not a defect. It still has to be declared.
   - Widen the lane's π instrument to every element, with the control-vs-control floor in the same run (LAWS P4).
5. **F-ERASE-2 is uncured.** The parked record's box is 612 px of pure paper, and `elementFromPoint` returns the paper. §10's arm 2 (the strip inside the fold's clip) has to be built and read before the pair exists.
6. **The settled rung's AA tail at DPR 2.** The worst ≥50 %-mass column falls from 2.76 / 4.49 to 1.80 / 1.95 in light and from 4.58 / 6.79 to 2.71 / 2.73 in dark. HEAD's full-graphite line fails the per-column fraction at 26–36 %, so the wave has to name a glyph-text statistic first. Then the settled rung (median 5.17, 0.67 of headroom) is read against it, and DPR 3 is read.
7. **The graft carries four consumer-less rungs**: `leave`, `step`, `throw` and `rise`, each with 0 `var()` consumers on this tree. It also carries the `chromeLeaveMs` / `rungs.leave` alias. This pass grew it by `rise` plus a seventh `@property`. It retires only in §13's fold commit, and that row has to be written into the fold's checklist, not only this README.
8. **The `2lh` seating is arithmetic.** The derived second line is +20.8 px at 390 and +23.63 at 1280, against ACC-SIX's measured 27.2 px at 393×699: a 6.4 px disagreement. It's unbuilt until LEDGER seats it.
9. **§7's rest-state question has no frames.** ARM C is unbuilt, which is LEDGER's batch 2. The leader's read (HOLD) is stated as a read.
10. **The §13 fold is rehearsed for the unit gates only.** `MarginNote.vue` conflicts in two places:
    - the write-in line moved to `.note-enter-active`
    - `--verb-rubOut-ease … backwards` vs this rule's no-fill `--ease-accelIn`

    Both stay open for the batch-6 rehearsal.
11. **F-ERASE-1's frame can't show its own fork.** It's 2.83 px at 1:1. The owner needs a magnified crop or a measured overlay, or the ballot goes as numbers only and says so.
12. **Not re-run by me:** the peer room's `becauseMember`, the solve act, PRM, the repeat's hole, and the board-voice hole (which the lane also didn't re-run). vitest `src/games` and `src/composables` ran in the background; see the return.

---

## 4 · The checklist

- **Gates that can't fail:**
  - G5 on a retune (gap 1)
  - G16's CI half on a dead hook (gap 2)
  - the registration and nesting (gap 3)
- **The pixel it moves that it didn't declare:** W2's drawer tab, +0.64 px at 844×390 rest (gap 4).
- **Consumer-less substrate:** `rise` was minted this pass with 0 consumers, which makes four (gap 7).
- **Legacy alias:** `chromeLeaveMs` / `rungs.leave` (carried).
- **The constraint it forgot:** the @property law's brace-nested RED is absent on the tree that carries the block (gap 3).
- **Unverified gestalt:** F-ERASE-1 is sub-perceptual (gap 11).
- **Spec-cites-itself:** `LADDER_13` is a hand copy of §13's set with no mechanical link. I verified it equal. It moves at §13's fold by design.
- **Clear:**
  - M16 (0 unadmitted)
  - filterBudget: tree = control, both themes, both engines
  - R6: no colour minted
  - W2's mechanics: no W2 file touched; the tab shift is layout inheritance
  - the generic default: no new visual idiom

---

## 5 · Strengths (proven, not asserted)

- **The clock is origin-bounded.** It holds against (1,1,0), (1,1,0) `!important`, (1,2,0) `!important` 600 ms and a 900 ms delay adversary. The hook reads 146.8–163.1 ms on both engines. With the hook blocked at the source, the same adversaries read 357–928 ms.
- **The shipping e2e row is non-vacuous.** It's green on the final dist, and it reds on a dead hook that the unit can't see.
- **G5 is now a gate on the act the charter named.** The lane found G7's twin defect by running it on a fold rehearsal and re-cut it to behaviour.
- **The rebuild reproduces the tree's dist byte-for-byte.** The painted AA reproduces to the hundredth on both engines.
- **The lane declared its own inherited prettier red** from pass 4.

## 6 · Cross-pollination

- **Every `<Transition>` whose leaving node can carry a transition** (App.vue's gallery fade, GameGallery's guard ribbon, §13's verbs) could take the `@before-leave` inline-`!important` clock. It's specificity-proof and costs one write.
- **Every Transition hook** could take the jsdom + VTU unstubbed-Transition unit as its CI half.
- **Every π probe** (all sections) could use the whole-DOM paint diff with its control-vs-control floor. It found a W2 move that a selector list missed.
- **For the AA statistic** (ACC-\*, PAL-\*, the chair): HEAD's full-graphite hand text fails the per-column fraction at 26–36 % at DPR 1 and 2. The statistic needs a glyph form before any painted-text row gates on it.
- **For §13:** G5 becomes a value map, and T9-B11's `rise` decision moves it in the fold commit.
