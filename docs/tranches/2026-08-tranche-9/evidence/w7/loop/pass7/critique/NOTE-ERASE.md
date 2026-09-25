# NOTE-ERASE · pass-7 CRITIQUE

I'm the critic. I didn't write the charter, the spec or the prototype. Base and π control: `74a2b5d9`.

**Convergence: 90 (held). Verdict: ADVANCE.**

The two-axis clock is real on this tree. I re-ran it with eight adversaries, four of them new, and every one holds the node at 148–186 ms in both engines, where the plant holds it at 909–1216 ms. T9-R8 reproduces to the thousandth, and the re-shoot is lawful. Three holes hold the number:

1. **The pass-7 hook breaks the merged note's SWAP.** On the union, a record pushed into line two leaves line one as `note-swap`, with `animation: none`. Vue's `getTransitionInfo` reads `animation-duration` and never `animation-name`. `stopTheClock` now writes `150ms !important` on every leave, so Vue waits out a fallback timer on an animation that doesn't exist.
   - Node lifetime goes from 8.2–13.1 ms (union as integrated) to 156.9–165.7 ms (union + U1 + carry), both engines.
   - The new line's write-in is delayed by the same amount (out-in).
   - The sentence paints twice (line one and line two) for 16–20 frames instead of 2.
   - Every gate is green: union units 575/575, the drop-clock row (it reads only `note-leave`), all lints.
2. **The registration row is cured for its plants, not for the class.** A `.pcss` sheet ships `@property --motion-whisper { inherits: false }` into the served CSS with the row at 0. A split-name `CSS.registerProperty` is also 0 on the row. The row is also a second hand-rolled reader (LAWS §I).
3. **Rows still open:**
   - the `2lh` seat isn't landed
   - F-ERASE-2's arm 2 isn't framed
   - line two's clock is unmeasured on the union
   - the 1280 fine panel isn't re-shot
   - the four consumer-less rungs still stand on this tree

## 0 · Setup (all mine, in scratch; the lane's work tree was never touched)

- **The diff.** I cut it through a temporary index: 17 files +1658/−81, 107,061 B, sha1 `d77243bf1424…`, tree `4518da97`. Every figure equals the lane's.
- **The pass-7 delta** over the bank (`e1893db9`) is 4 files +400/−84: `MarginNote.vue`, `marginNote.motion.test.ts`, `affordances.spec.ts`, `check-theme-tokens.mjs`. The `MarginNote.vue` sha1 is `bf9b9e55eab8` on the work tree and on my copy.
- **Builds.** I rebuilt from `git archive` copies with a cacheDir outside the root:
  - tree → `index-CNyQnHaWLGEi.js`, the lane's identity reproduced
  - union (`74a2b5d9 + s13-s7-s3.diff`) → `index-C4rwyft5SG8y.js`, the integrator's HOLD identity reproduced
  - union + `pass7-delta.U1.diff` + `union-carry.PROPOSED.diff` → `index-B6mPe1IcFLAX.js`, with `MarginNote.vue` sha1 `0dcf60ab43488be9094d7544d043afe8e7568d35` (= the lane's)
- **Servers.**

  | port | what | served |
  |---|---|---|
  | :4244 | tree | its own identity |
  | :4245 | control `w7-control` | `index-CubiZsMVSwTc.js` |
  | :4246 | union | its own identity |
  | :4247 | union + delta + carry | its own identity |

  Each was verified by its asset hash, then killed by recorded PID (listeners 64582/64728/64901/64998 and their wrappers). All four ports read free afterwards.
- **Box load.** 1-min load 42–58, with 384 sibling node/playwright/vitest processes. Every timing number below is a loaded-box reading.
- **Payloads.**
  - the classic easy 9×9 (`ATMuNTMwMDcw…MDc5`), read back through values and the aria-label corpus
  - the drop-clock rows use the spec's own `CONFLICT_BOARD`

## 1 · Re-measured (both engines)

### A · The pass-6 plant first: the clock on BOTH axes (`logs/clock.txt`; `instruments/clock.probe.ts`)

The plant is IN-PAGE, on the same dist in the same run: an init script drops the hook's `animation-duration` and `animation-delay` writes, which is pass 6's hook. Node-gone ms at 1280 fine.

| adversary | tree cr · wk | plant cr · wk |
|---|---|---|
| none | 165.6 · 175 | 167 · 150 |
| `.margin-note{--motion-whisper:900ms}` | 160.1 · 157 | **912.3 · 928** |
| `animation-duration:900ms !important` | 161.2 · 184 | **915.9 · 926** |
| `animation-delay:750ms !important` | 159.4 · 155 | **914.3 · 922** |
| **new:** `@layer` `duration 900ms !important` + `delay 300ms !important` | 161 · 155 | **1216.2 · 1193** |
| **new:** `animation: ink-rub-out 900ms linear 200ms !important` | 160.1 · 148 | **1102.7 · 1126** |
| **new:** `:root{--motion-whisper:900ms !important}` | 159.6 · 178 | **909.1 · 910** |
| **new:** `animation-iteration-count: 6 !important` | 164.2 · 186 | 161.7 · 187 (not an attack: Vue's timer reads duration only) |

On the tree, the leaving node reads `animation-duration 0.15s` and `animation-delay 0s` under every adversary. The lane's table reproduces to within the box's noise, and my four extra adversaries hold too.

**VTU plants** (scratch copy):
- the delay write deleted: exit 1 (2 failed / 11 passed)
- the duration written without `important`: exit 1 (2 failed / 11 passed, incl. the PRM row)

The unit row can fail.

### B · NEW: the swap on the union (`logs/swap.txt`; `instruments/swap.probe.ts`)

This is the HOLD default, 1280 fine, ×3 runs per engine per arm. The script asks, answers (the record is held), then asks again, so `setMargin` pushes the record to line two and `leaveName()` returns `note-swap`.

| arm | leaving node computed | node lifetime (ms) cr · wk | new line one appears after (ms) | frames with the sentence on BOTH lines, old span visible |
|---|---|---|---|---|
| union as integrated (`C4rwyft5SG8y`) | `animation-name none`, `duration 0s`, inline `transition:none!important` | 8.2 / 13.1 / 8.3 · 10 / 13 / 13 | = lifetime | 2 · 2 |
| union + delta + carry (`B6mPe1IcFLAX`) | `animation-name none`, **`duration 0.15s`**, inline `animation-duration:150ms!important; animation-delay:0s!important; transition:none!important` | **165.7 / 156.9 / 161.1 · 161 / 162 / 160** | = lifetime | **20 · 16–17** |

- **Mechanism.** `runtime-dom.esm-bundler.js:318–346` computes `animationTimeout` from `animation-delay` + `animation-duration` and never reads `animation-name`. `whenTransitionEnds` then waits on an `animationend` that can't fire, and falls through at `timeout + 1`.
- **The design it breaks.** The union's own comment at `MarginNote.vue` (`.note-swap-leave-active`) says: "A sentence displacing another is NOT an exit … a rub-out here would paint it twice. Out of flow for the one frame it lingers." It now lingers ~160 ms, painted.
- **This is the default path.** HOLD pushes a record whenever a sentence displaces it (`GameBoard.vue:893–894`).
- **Every gate is green on the defect:**
  - union + delta + carry units: `src/pencil` + `src/games/shared`, 49 files / 575 tests, exit 0
  - the drop-clock row only reads `.note-leave-active`
- **Declared limit.** Lifetime is a DOM fact (MutationObserver + `performance.now`). The frame counts are an in-rAF DOM reading, not the painted-frame recorder. The painted count is owed.
- **Scope.** On the tree alone there's no swap, so the tree is unaffected. The defect lives only where the section ships.

### C · T9-R8, the settled rung (`logs/glyph.txt`; the lane's probe copied, ports re-pointed; the chair's `glyph-pop.mjs`)

1280 fine, DPR 1. The fresh line equals the control in every cell.

| cell | control: text · whole pop | settled: text med/frac · pop med/frac | G2 |
|---|---|---|---|
| cr light | 14.517 · 4.534/0.498 | 5.172/0.458 · **2.563/0.675** | RED |
| cr dark | 11.656 · 8.93/0.324 | 5.857/0.272 · 4.668/0.472 | ok |
| wk light | 11.419 · 5.194/0.468 | **4.357**/0.515 · **2.866/0.691** | RED |
| wk dark | 11.41 · 7.4/0.375 | 5.691/0.315 · **4.099/0.543** | RED |

- Every number reproduces the lane's to the thousandth.
- FAINT30, TAIL12, TAIL35 and EMPTY are RED in all four cells.
- I didn't re-run DPR 2.

### D · The registration row (`logs/registration-plants.txt`; plants on a scratch copy, each restored)

- **Clean and the lane's plants.** Exit 0; its 10 in-file plants are RED; a second `typography.css` registration reds (1).
- **My plants.** Both engines honour an uppercase `@PROPERTY` and an escaped name as registrations (`instruments/atrule.mjs`).

| plant | ctt row | cpb source | cpb served (built) |
|---|---|---|---|
| `@PROPERTY --motion-whisper{inherits:false}` | 0 | 0 | 0: the bundler drops it (served 49 = 49), inert |
| `@property --motion-whisp\65r{…}` | 0 | 1 (C6) | inert |
| **`src/assets/*.pcss` (inherits:false) imported from `main.ts`** | **0** | **0** | **1: served `--motion-whisper{inherits:false}` SHIPS** |
| **split-name `registerProperty({name: W})`** | **0** | 1 (C4) | — |
| joined-name `["--mo","tion-whisper"].join("")` | 0 | 1 (C4) | — |

- The walk keeps `.css|vue|ts|tsx|js|mjs` and misses Vite's native CSS languages (`.pcss`, `.postcss`).
- The script clause wants the literal `--motion-` within 240 chars of `registerProperty`.
- Only the chair's `check-property-block --dist` sees the `.pcss` case. CI is browserless, and that instrument isn't on this tree.

### E · Apply checks (my own, fresh archives)

| patch | fresh `74a2b5d9` | union `74a2b5d9 + s13-s7-s3.diff` |
|---|---|---|
| full diff | 0 | — |
| pass-7 delta −U3 | — | **1** (`MarginNote.vue:124`) |
| `pass7-delta.U1.diff` | — | 0 |
| `union-carry.PROPOSED.diff` (after U1) | — | 0 |

All as the lane reported.

### F · Constraints and battery (bare; the tree = an archive + the full diff; the control = an archive of `74a2b5d9`; `logs/battery.txt`)

| gate | tree | control |
|---|---|---|
| lint:lanes | 0 (the first read was 2: my archive lacked `.github`; re-run 0) | 0 |
| lint:theme-tokens · lint:sleep · lint:motion · lint:copy · lint:ink | 0 each | 0 each |
| test:e2e:projects · check-pw-projects · check-copy-register (M16) | 0 · 0 · 0 | 0 · 0 · 0 |
| `eslint .` · `npm run lint` (prettier) | 0 · 0 | 0 · 0 |
| check-property-block: source+dist / served :4244 / --self-test | 0 / 0 / 0 | — |
| undefined-token census (FE=tree / control) | 1 / 1: the declared STALE `--refuse-dur` only; TIMING 0, other 0 | same |
| vitest `src/pencil` + `src/games/shared` | 44 files / 523 tests, 0 failed | — |

The pass-7 battery names two more gates. `lint:bands` and `lint:verbs` don't exist at `74a2b5d9` or on this tree.

**Constraints:**
- **filterBudget:** 9 `filter:` declarations and 5 `url(#` in JS, tree = control. That's static; the dist differs from pass 6 only in the block rule.
- **@property law:** `check-property-block` 0 on this tree.
- **R6 and r0:** nothing moved.
- **W2:** no file touched.
- **π of the `lh` seat:** I didn't re-run it (the lane's read was tree vs the pass-6 dist, not `74a2b5d9`).

## 2 · The frame (I looked at it)

`f1-TB-LEDGER-union-…-dpr2-at-0.5.png` (65,199 B). Rows are HOLD/AGE/STEP/TINT. Columns: chromium light +100 ms / P1 rest / P2 rest; chromium dark P1 rest; webkit light +100 ms / P1 rest; webkit dark P1 rest.

What's right:
- One payload, and one variable (`LEDGER_FULFILLED`).
- It's on the integrated tree, with a WebKit panel and dark.
- At rest HOLD = STEP = TINT in the note's ink. HOLD's +100 ms full graphite vs TINT's α 0.68 is visible.
- The ballot names HOLD's loss (4.357).
- It retires pass-6 f1 and f2 by name.

What's wrong:
- **It pictures the union AS INTEGRATED, not union + this pass's delta.** The delta adds §1B's 160 ms double-paint to every displacement, which is HOLD's own push and AGE/STEP's P2. The frame is at rest, so it can't see it.
- The ballot as framed hides a cost the fold would ship.
- F-ERASE-2 arm 2 is numbers only. LAWS P6 §C says an arm is framed where it differs.

## 3 · Open gaps (each closable, numbers attached)

1. **The swap regression on the union.** `stopTheClock` must write no duration when the leave's computed `animation-name` is `none`, or write `0s` there, or the swap must be fenced by name. Numbers: 156.9–165.7 ms (cr) and 160–162 ms (wk) against 8.2–13.1 ms, with 16–20 double-painted frames against 2.
   - Close it: add a SWAP leg to the drop-clock row: node lifetime < one whisper and ≤ 2 frames with the sentence on both lines, read post-paint.
   - Its negative is the U1 hook as landed.
2. **The registration row misses `.pcss`/`.postcss` sheets.** A served `--motion-whisper{inherits:false}` ships with the row at 0.
   - Close it: walk every Vite CSS language.
   - Replace the 240-char literal window with the chair's C4 shape (any `registerProperty(` in code).
   - Re-point the reader at the landed shape-census library at the fold.
3. **The `2lh` seat is not landed.** The tree reserves `1lh`, and a second in-flow line costs +18/+19 px (desk) and +22/+23 px (landscape), pass-6 numbers not re-measured.
   - Close it: land `2lh` with the docH cost re-measured, or ballot 1lh vs 2lh on one payload with the cost in the caption.
4. **T9-R8.** The settled rung fails the whole-population floor in 3/4 DPR-1 cells (2.563 / 2.866 / 4.099) where the control clears (4.534 / 5.194 / 7.4). It's cited and bounded; it's the estate's cure. HOLD, the default, pays it at rest.
5. **Line two's clock on the union.** Close it: measure the `note-previous` leave in a browser under the four adversaries, plus the swap leg of gap 1.
6. **F-ERASE-2 arm 2 isn't framed.** Its price: −13.52 px (1280) and −13.32 px (1440), and the parked text reads whole-pop 2.48–2.80 < 4.5. Frame both arms on one payload, or the chair re-frames the ballot.
7. **The T9-B-LEDGER frame shows the union as integrated, not union + delta.** Re-shoot after gap 1 is cured, or state in the caption that the pass-7 delta changes the push. The 1280 fine panel isn't re-shot.
8. **The four consumer-less rungs (leave/step/throw/rise) and the `chromeLeaveMs` alias (`App.vue:639`) still stand on this tree.** The registration row REQUIRES the four. They're dead or consumed on the union only.
9. **−U3/−U2 of the delta fail `git apply --check` on the union** at the `stopTheClock` hunk. Only −U1 applies.
10. **Untested adversaries:** user-origin and UA-origin `!important`, and `animation-name:none !important`. They're a sentence.
11. **The `lh` seat is pinned by SPELLING.** The VTU row reads the first `.margin-note-block{…}` text.
    - The chair's `reserve-law.mjs` is RED R1 on this tree (no voice site). It's GREEN only on the union + delta.
    - Close it: land the SHAPE row on the tree the section ships, with its E1/E2/E2b/E3/E4 plants.

## 4 · Checklist

- **The pixel it moves that it did not declare (π):** the union's swap, 160 ms of double paint per push (gap 1).
- **A gate that reads one subject name:** the drop-clock row reads `note-leave` only, so the hook's effect on `note-swap` is invisible (gap 1).
- **A gate cured for its plants, not the class:** `.pcss` and split-name emitters (gap 2). The hand-rolled reader is a row against LAWS §I.
- **Consumer-less substrate and the legacy alias:** on this tree (gap 8).
- **The constraint it forgot:** painted AA at rest (T9-R8, estate-booked; HOLD carries it).
- **Unverified gestalt:** arm 2 is unframed; the ballot frame predates the delta (gaps 6 and 7).
- **Spec-cites-itself (mild, as in pass 6):** the e2e reads `MOTION.rungs.whisper`/`.note` off the subject. G5's literal map backs it.
- **Clear:**
  - M16
  - filterBudget (static 9 = 9)
  - the @property law on this tree
  - the census (the declared STALE row only)
  - W2
  - R6
  - no generic default
  - the rebuild identity-reproduced

## 5 · Strengths (proven)

- The two-axis clock holds against eight author adversaries in both engines at 148–186 ms. The in-page plant reds six of them at 909–1216 ms, same dist and same run, including four adversaries the lane never tried: `@layer` important, a shorthand with delay, `:root !important`, and iteration count.
- The VTU row reds without the delay write and without `important`.
- T9-R8 reproduces to the thousandth, per cell, with all four text plants RED. The settle comment now states the per-engine/DPR numbers honestly.
- The T9-B-LEDGER re-shoot is a lawful pair on the integrated tree, both engines and both themes, and it names HOLD's loss.
- The union rows the lane found are real:
  - `check-font-coverage` RED ×5 on the union as integrated
  - the reserve law R4
- The lane's bank arithmetic is exact: sha1, bytes, tree and apply exits all reproduce.

## 6 · Cross-pollination

- **Every `@before-leave` clock that writes `animation-duration` inline** has to respect the leave's own `animation: none`. Vue reads the duration, not the name, so a fenced clock turns a zero-length leave into a timer. This applies to any estate `<Transition>` with a `name` switch (MOT-VERB, CTRL-FACE's bar).
- **Every source registration census** (MOT-LADDER, the chair's library) walks Vite's CSS languages: `.pcss`, `.postcss`, and any preprocessor the config admits.
- **NOTE-LEDGER:** its pass-7 delta lands after this one on the union, so it inherits gap 1. The swap is its push.

## Incidents (mine)

- My first battery read `lint:lanes` 2 on the tree copy because the archive lacked `.github`. I added it and re-ran: 0.
- My first `check-property-block` run passed a non-existent `--dist` and threw. I re-ran it with the built dist.
- My first vitest invocation used the deprecated `--cache.dir` and exited 1 before running a test. I re-ran it with `--no-cache`.
- Plants ran on `<scratchpad>/erasecrit7/plant`, never the lane's tree. Each plant file was restored by copy, and the `MarginNote.vue` sha1 was verified back to `bf9b9e55`. The planted `.pcss` and `.ts` files were `mv`'d to scratch (no `rm`).
- No git ran in the control tree. The lane's work tree `git status` reads the same 17 entries before and after.
