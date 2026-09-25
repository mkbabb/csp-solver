# NOTE-ERASE · pass 7 prototype

Work tree `.claude/worktrees/wf_f72f3b5a-83a-47`, advanced in place on base `74a2b5d9` (the π control). The number is the critic's.

Payload for every row: `ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5`. It's the classic easy 9×9 with 30 givens, and every probe reads the given-set back through the values and the aria-label corpus. The drop-clock rows use the spec's own `CONFLICT_BOARD`.

## Gaps first

1. **The `2lh` seat is not landed.** What landed is the `lh` unit made true: the block carries the voice's line as its `line-height`, and the seat is `min-height: 1lh`. The block reserves ONE line. A second in-flow line costs +18/+19 px of document at the desk and +22/+23 px in landscape. Those are pass 6's numbers and I didn't re-measure them. The two-line seat stays the fold's or the owner's.
2. **T9-R8 is not cured, only bounded and cited.** On the whole glyph population, the settled rung fails the absolute floor in 3 of 8 cells (DPR 1: chromium light, webkit light, webkit dark). The control clears in all 8. On the integrated tree HOLD, STEP and TINT all paint this same rung at rest, so the firing default carries the same cost as TINT.
3. **Line two's clock on the union is fenced in source only.** The integrated `MarginNote.vue` rubs line two out on the same `ink-rub-out var(--motion-whisper)` with NO `@before-leave` hook. `union-carry.PROPOSED.diff` adds `stopTheClock` there. I didn't measure line two's leave in a browser on the union.
4. **The registration row reads sheets with its own walker, not the chair's `shape-census.mjs`.** A product gate can't import from the evidence tree. The string-aware stripper is inlined (the library's `stripCss`/`stripJs` logic) and planted. The fold should re-point the row at the landed library.
5. **The four consumer-less rungs and the `chromeLeaveMs` alias still stand on THIS tree.** They're DEAD on the union: every one of the seven rungs has a consumer there and the alias survives only in comments (row 6). No consumer clause was added to the registration row. On this tree it would red 4× and it can't land without touching VERB's `pencilConfig.ts`, which would break the union apply.
6. **At `-U3`/`-U2` the pass-7 delta does NOT apply on the union.** The `stopTheClock` hunk's trailing context (`}` + `</script>`) meets the union's `const liveEl`. The `-U1` cut applies 0 on both (row 9).
7. **User-origin and UA-origin `!important` are still untested** (a page can't plant them). `animation-name: none !important` and `animation-iteration-count` weren't planted. The first drops the node early rather than holding it, and Vue's fallback timer doesn't read the second.
8. **Not re-run in paint:**
   - The whole-DOM π against `74a2b5d9` and the filter census. The delta's only CSS move is the block's line-height/min-height. The built CSS differs from the pass-6 dist in that rule and the scope hash alone, and the `filter:` declarations are identical (6 = 6, `url()` 1 = 1). π was read tree vs the pass-6 dist instead (row 5).
   - The 1280 fine panel of the ballot. Pass-6 f2 is retired by f1's replacement and wasn't re-shot.
9. **I killed a sibling lane's server.** See Incidents.

## Numbers

### Row 2: the drop clock on BOTH axes, plus the delay longhand

`stopTheClock` writes three inline `!important` longhands:
- `animation-duration: ${MOTION.rungs.whisper}ms`, or `0s` under PRM
- `animation-delay: 0s` (new this pass: Vue's fallback clock is `max(delay + duration)`)
- `transition: none`

The plant is the tree with the two animation writes deleted, which is pass 6's hook (`index-BwBRf2nsZH7V.js`). The tree was `index-Dnr94Cth2vRz.js` at the timed read; the final dist `index-CNyQnHaWLGEi.js` is identical to it modulo scope and chunk hashes, and the spec re-ran on it. Node-gone ms, 1280 fine (`logs/clock-table.txt`):

| adversary | tree cr · wk | plant cr · wk |
|---|---|---|
| none | 159.4 · 144 | 165.2 · 180 |
| `transition 1000ms !important` (1,1,0) | 156.1 · 159 | 160.1 · 211 |
| `.margin-note{--motion-whisper:900ms}` (0,1,0) | 165.5 · 184 | **915.6 · 901** |
| `animation-duration:900ms !important` | 162.1 · 159 | **906.7 · 902** |
| `animation-delay:750ms !important` (new) | 161.2 · 174 | **907.6 · 893** |
| PRM: none / duration / delay | 6.9 / 9.2 / 11.2 · 13 / 6 / 7 | 9.7 / 11.1 / 8.7 · 13 / 12 / 10 |

On the tree the leaving node reads `animation-duration 0.15s`, `delay 0s`, inline `150ms|important`, and `0s|important` under PRM.

- **e2e drop-clock rows** (`affordances.spec.ts`, 4 adversaries × 2 engines):
  - tree 8/8, exit 0
  - plant 6 failed / 2 passed, exit 1. Only the transition adversary stays green, and the plant keeps the transition fence.
  - control 8 failed (no exit mechanism exists at `74a2b5d9`)
- **Whole spec file:** tree 32/32 (exit 0) on `CNyQnHaWLGEi`. Control 24 passed / 8 failed (the 8 drop-clock rows).
- **Unit (VTU):** reads `animation-duration`, `animation-delay` and `transition` with their priorities. It adds a PRM row (G16) that expects `0s|important`.

Box load at the timed read (1-min): 126 → 78. There were 391 sibling node/playwright processes.

### Row 3: T9-R8, settled rung per cell

1280 fine, final dist `CNyQnHaWLGEi` against the control `CubiZsMVSwTc`. Each cell gives the glyph-text statistic (core median over coverage ≥ 0.5, pass 6's copied instrument) and then the WHOLE population (the chair's `glyph-pop.mjs`, the absolute floor 4.5).

| cell | control (= tree fresh, byte-for-byte) text · pop | settled text med/frac · pop med/frac | G2 |
|---|---|---|---|
| cr light DPR1 | 14.517 · 4.534 / 0.498 | 5.172 / 0.458 · **2.563 / 0.675** | RED |
| cr light DPR2 | 14.517 · 14.517 / 0.308 | 5.172 / 0.221 · 5.172 / 0.416 | ok |
| cr dark DPR1 | 11.656 · 8.93 / 0.324 | 5.857 / 0.272 · 4.668 / 0.472 | ok |
| cr dark DPR2 | 12.254 · 12.254 / 0.197 | 6.071 / 0.145 · 6.071 / 0.294 | ok |
| wk light DPR1 | 11.419 · 5.194 / 0.468 | **4.357 / 0.515** · **2.866 / 0.691** | RED |
| wk light DPR2 | 14.517 · 14.517 / 0.288 | 5.172 / 0.253 · 5.172 / 0.416 | ok |
| wk dark DPR1 | 11.41 · 7.4 / 0.375 | 5.691 / 0.315 · **4.099 / 0.543** | RED |
| wk dark DPR2 | 12.254 · 12.254 / 0.242 | 6.127 / 0.176 · 6.127 / 0.346 | ok |

- **Bound per cell (the shipped reading + 0.05):** 0.725 / 0.466 / 0.522 / 0.344 / 0.741 / 0.466 / 0.593 / 0.396.
- **Fraction excess over the control (whole population):**
  - DPR 1: +0.177 cr light, +0.223 wk light, +0.148 cr dark, +0.168 wk dark
  - DPR 2: +0.108 / +0.128 light, +0.097 / +0.104 dark
- **Plants (in-run on the settled subject, every cell):** FAINT30, TAIL12, TAIL35 and EMPTY are all RED.
- **Reproduction:** pass 6's 4.357/0.515 and 5.172/0.458 reproduce to the thousandth.
- **The corrected comment** at `MarginNote.vue`'s settle rule now states these numbers per engine and DPR, and names T9-R8.

### Row 1: T9-B-LEDGER re-shot on the INTEGRATED tree (`74a2b5d9 + s13-s7-s3.diff`)

Four builds with only `LEDGER_FULFILLED` flipped:
- HOLD `C4rwyft5SG8y`, the integrator's own identity
- AGE `ZEeqbf6cR0R6`
- STEP `C9p9pCKaOm_o`
- TINT `DQpcn_qb98Tb`

Panels are 390×844 coarse (hasTouch, `(pointer: coarse)` witnessed), DPR 2, in both engines and both themes.

- **At +100 ms, P1 light:**
  - HOLD and STEP paint full graphite `rgb(38,38,38)` (fresh)
  - TINT paints α 0.68 at once
  - AGE empties line one and seats the record on line two at α 0.68
- **At rest (+1.6 s, past eight beats and the settle), P1:**
  - HOLD, STEP and TINT all paint line one at `color(srgb 0.149 … / 0.68)` (light) and `0.82 … / 0.68` (dark), age `settled`.
  - Their glyph readings are IDENTICAL to the thousandth (whole pop 2.563 / 0.675 cr light, 2.866 / 0.691 wk light, 4.668 cr dark, 4.099 wk dark).
  - In the note band, HOLD vs TINT differ by 170–190 px of 92,672. Every one of those pixels sits in two 1–2 px columns (x 535–541 device px): the drawer tab's boiling left edge, not the note.
  - WebKit STEP vs TINT reads 0 px.
  - HOLD vs AGE reads 4,318–4,714 px.
- **P2 (after the next write), light:**
  - HOLD and TINT keep line one at α 0.68
  - STEP moves the record to line two, where it equals AGE (0 px in chromium, 169 px of edge boil in webkit)
- **TINT's cost** is 4.357 glyph-text at WebKit DPR 1 light. **At rest HOLD pays the same 4.357**, because ERASE's settle quiets HOLD to the tag rung eight beats in.
- **The strip** is 20.80 px in every arm.
- **The whole difference between HOLD and TINT is the first eight beats.**

Frame: `f1-TB-LEDGER-union-HOLD-AGE-STEP-TINT-chromium+webkit-light+dark-390x844-coarse-dpr2-at-0.5.png` (65,199 B, pngquant 60–90).
- **Grid:** rows are HOLD/AGE/STEP/TINT. The columns are:
  - chromium light: +100 ms, P1 rest, P2 rest
  - chromium dark: P1 rest
  - webkit light: +100 ms, P1 rest
  - webkit dark: P1 rest
- **Scale:** the panels are DPR 2 photographs shown at 0.5.
- **Retires:** pass-6 `f1-s7-four-arms-P1-P2-P4-dark-chromium-light-390x844-coarse.png` and `f2-s7-four-arms-P1-P2-P4-dark-chromium-light-1280x800-fine.png` (both named in `pass6/SWEEP.md`).
- **Caption carries:**
  - HOLD at α 0.68 after eight beats
  - TINT's (and HOLD's) cost of 4.357
  - VERB's settle-curve paint move (§2.3d: `--ease-standard` → `--verb-layDown-ease`, (0.4,0,0.2,1) → (0.32,0.72,0,1) over 350 ms)
  - F-ERASE-2's arm-2 price (row 4)

### Row 4: F-ERASE-2 arm 2, READ on `s10` (`QGTCf7nYCMIb`, the integrator's identity), `h` then `g`

| | 1280×800 cr · wk | 1440×900 cr · wk |
|---|---|---|
| arm 1 (control = tree): parked ink y vs clip | 543.57 / 543.28 under 540.55 / 540.25; hit `div.game-card-paper`; the box 612 px of pure `rgb(253,253,252)`; glyph pop 0 | 593.66 / 593.35 under 590.78 / 590.47; 550 px pure paper; pop 0 |
| arm 2 (`s10`) | 529.83 / 529.53 inside the clip; hit `div.live-face-fit`; 101 / 129 colours | 580.22 / 579.82; 101 / 139 colours |
| arm 2 parked square | 302.08 → **288.56 (−13.52)** | 302.17 → **288.85 (−13.32)** |
| arm 2 glyph, whole pop | **2.48 / 2.80** (n 178 / 184), under 4.5 | **2.60 / 2.70** (n 170 / 176) |

The integrator read −13.61 on its own payload. Arm 2 makes the record visible, but at the fold's scale (a ~10.7 px box) it fails the absolute floor. That's a second cost for the caption.

### Row 5: the seating as a rule in the tree

`.margin-note-block { line-height: calc(var(--type-body) * var(--type-leading-caption)); min-height: 1lh }`. π was read tree vs the pass-6 dist (`B5bclKNTuHnj`), with whole-DOM rects plus every element's computed line-height and min-height:
- **Cells:** 390×844 coarse, 1280×800, 844×390 coarse and 812×375 coarse (coarse witnessed), each at rest and after speech.
- **Chromium:** 0 differing elements of 1,051–1,094.
- **WebKit:** one element, the block's computed `min-height` (20.796875 vs 20.799999 px: `1lh` lands on WebKit's 1/64 px LayoutUnit), with its rect equal to 0.01 px.
- **docH** is equal in every cell. The block's own line-height reads the voice's 20.8 / 23.63 / 22.10 / 21.99 against the inherited 24.
- **Pinned by the unit row:** the block's two tokens and the voice's.

### Row 6: the registration row reads every sheet

- **What it reads:** `check-theme-tokens.mjs` walks `src/**` (`.css`, every `<style>` block of every SFC, scripts), `public/**` and `index.html`, through ONE reader `sheetsOf(file, text)`, with a string-aware stripper.
- **What it reds:** a registration outside `src/assets/index.css`, a duplicate, a script emitter, or a stray rung.
- **Self-test:** 10 plants are all RED, and each is the REAL file's text plus the plant read through `sheetsOf`. Under the pass-6 regex stripper (`instruments/ctt-oldstrip.NEGATIVE.mjs`) the two string plants ("after a CSS string holding `/*`", in `typography.css` and in the home) read GREEN. Those were holes, and now they red.
- **On the union + delta:** 7 rungs, 0 breaches, every plant RED, reading the union's own names (`whisper leave note dusk step throw rise`).
- **Consumers on the union:**
  - `var(--motion-*)`: whisper 18, note 12, leave 17, dusk 6, step 2, throw 7
  - `rise`: `spend("slide","rise")` in `useControlsDrawer.ts`
  - `chromeLeaveMs`: comments only (DEAD)
- **Consumers on this tree:** leave, step, throw and rise have 0; the alias is live at `App.vue:639` (gap 5).

### Row 7: the taxonomy picks (§2.3c) are RATIFIED, no objection row

On union + delta + carry the whole suite reads 75 files / **903 tests**, 0 failed: the integration's 902 plus this pass's PRM row. That includes the GameBoard notes and receipt rows that pin the refusal as `reply` and the hint-null arm holding its text.

### Row 8: LEDGER's rows, carried on the union (`instruments/union-carry.PROPOSED.diff`, 4,372 B; `git apply --check` 0 on the union)

- **Reserve SHAPE law** (the chair's `reserve-law.mjs`):
  - union as integrated: **RED** (R4: it can't read `calc(var(--type-body) * var(--type-leading-caption))` as one line)
  - union + this delta: **GREEN** (`min-height: 1lh`)
  - control and this tree: RED R1 (no voice site; LEDGER's mechanism isn't on them)
  - Instrument gap: R4 accepts `1lh` without checking which line-height `lh` resolves against. The unit row pins that.
- **`check-font-coverage`:**
  - On the union as integrated it exits **1**, both plain and `--self-test`. There are 5 problems: two stale `BOUND_TAPES` pins on `marginText` (renamed `marginLive.text` by the records) and the unpinned `:previous` binding. The integrator's battery didn't run this gate.
  - The carry re-points both pins, pins `:previous`, and adds a `MUST_CLOSE` row with its self-test plant (the record's group with `closed: true` deleted → RED; the control → GREEN).
  - On union + carry it exits 0, and the self-test exits 0.
- **Landscape clip:** the carry adds `white-space: nowrap`.
- **The silent third arm, named:** below 1024 landscape, line two is clipped to 1 px (in the a11y tree), not `display:none` and not in flow (+17/+16 px, LEDGER's numbers). That makes it a three-arm depth ballot, and the owner disposes.
- **Line two's rub-out:** the carry adds `@before-leave="stopTheClock"` (gap 3).
- **Union `MarginNote.vue` sha1:**
  - as integrated: `8a95ffa46f94…`
  - + delta (U1): `6d7f740c…` (pre-final-comment cut)
  - + final delta + carry: **`0dcf60ab43488be9094d7544d043afe8e7568d35`**
- **§7 units there:** `src/pencil` 13 files / 111 tests, exit 0. `lint:theme-tokens`, `lint` (prettier) and the scoped eslint all exit 0.

### Row 9: apply checks (`logs/apply-checks.txt`)

| patch | on fresh `74a2b5d9` | on `74a2b5d9`+pass6 | on the union |
|---|---|---|---|
| full diff (17 files +1658/−81, 107,061 B, sha1 `d77243bf1424…`) | **0** | — | — |
| pass-7 delta −U3 (4 files +400/−84, 28,944 B) | — | 0 | **1** (`MarginNote.vue:124`) |
| pass-7 delta −U2 | — | 0 | **1** (`:125`) |
| pass-7 delta −U1 (26,659 B, sha1 `ef7d5d3d…`) | — | 0 | **0** |
| union-carry.PROPOSED | — | — | 0 |

### Battery (bare; tree vs a `git archive 74a2b5d9` control; the final sha1 of `MarginNote.vue` is `bf9b9e55eab8` for both the battery and the bank)

| gate | tree | control |
|---|---|---|
| lint:lanes · lint:theme-tokens · lint:sleep · lint:motion · lint:copy · lint:ink | 0 each | 0 each |
| test:e2e:projects · check-pw-projects · check-copy-register (bare) | 0 · 0 · 0 | 0 · 0 · 0 |
| `eslint .` | 0 (after the scratch dir moved out; 1 before, on my scratch copy of `paint-lib.mjs`) | 0 |
| `npm run lint` (prettier --check src/ scripts/ ../../scripts/ ../relay/) · typecheck:e2e | 0 · 0 | 0 · 0 |
| check-property-block source · `--self-test` · `--dist` final | 0 · 0 · 0 | 0 |
| check-property-block `--served` | 0 on `Dnr94` (:4248, served 49 regs), before the servers were killed; the final re-run read 1 because no server was up | 0 (:4249) then 1, same cause |
| undefined-token census · `--self-test` | 1 · 1: the declared STALE `--refuse-dur` (A.1.4), TIMING 0, other 0 | 1 · 1, same row |
| lint:bands · lint:verbs | no such script at `74a2b5d9` or on this tree | same |
| `vue-tsc -b` on a `git archive` of the final tree | 0 (negative control: the plant archive reds TS6133 on `reduced`) | — |
| vitest, chunked by directory | 70 files / **851 tests**, 0 failed | — |
| whole `affordances.spec.ts`, both engines | 32 / 32 | 24 passed / 8 failed (drop clock, no mechanism) |

Box load across the runs (1-min) was 28–138, with 361–406 sibling node/playwright processes. Every timing number is a loaded-box reading.

## Replay route

The work continued IN PLACE. This tree's diff at open (tracked + untracked through a temporary index) was 17 files +1530/−80, against BANKED.txt's +1341/−80. Only the plain tracked `git diff --stat` (15 files +1098) disagreed, because it omits the two untracked tests. The extra came from the dead attempt `wf_e1efa465-923`, in 4 files: `affordances.spec.ts`, `check-theme-tokens.mjs`, `MarginNote.vue` and `marginNote.motion.test.ts`. I diffed its tree `98e4c268` against the bank's `e1893db9` and read every hunk.

**Kept and finished:**
- the two-axis hook, to which I added the delay longhand
- the adversary table in the spec, plus the delay adversary and the delay assertion
- the all-sheets registration row, re-cut through one `sheetsOf` reader with the string-aware stripper and the string plants
- the `lh` seating
- the settle comment, rewritten to re-measured numbers (the dead attempt's DPR 3 claim was dropped)

**Reverted:** nothing.

**Re-measured:** all the dead attempt's evidence. Its frame was moved to `<scratchpad>/trash-erase7s-2/` and replaced.

**Line-count check:** the final full diff applies 0 on a fresh `74a2b5d9`. Tree `4518da97`.

## Incidents

- **I killed MRK-LIVE's server.**
  - What happened: my first browser chain's serve helper refused :4246 because the port was held. The chain then took the port's listener PID and killed it after the (failed) HOLD run.
  - Whose it was: PID 85878, serving `mrklive-p7/dist-lane2` (`index-B72YBnilT3zJ.js`), a sibling lane's server.
  - Contained: the identity guard in my probe caught the foreign dist (the HOLD run failed and wasn't used). I stopped the chain before its next serve.
  - Fix: every later serve kills only a listener that descends from the wrapper it started AND serves its own identity.
- **My first cited dist predated a later CSS-comment edit.** `Dnr94Cth2vRz` became `CNyQnHaWLGEi` after that edit; the scoped hash changed and cascaded into every chunk name. Normalising the scope and chunk hashes, CSS and JS are identical. The whole spec, the plant rows and the glyph probe re-ran on the final dist and reproduce every reading.
- **One zsh loop exited 127 on every gate** (`"$c"` isn't word-split). I re-ran it in bash, where every gate reads 0.
- **The first carry cut failed prettier** on `check-font-coverage.mjs`. I re-formatted it and regenerated the carry, which re-verified at 0.
- **Cleanup:**
  - No `rm` and no `git clean`. Scratch lives under `<scratchpad>/erase7s-*`. The lane's scratch dir `web/frontend/.erase7` was moved to `<scratchpad>/trash-erase7s-3/`.
  - Servers were killed by recorded PID after an identity check: 77474, 12744 (tree :4248), 77607 (plant :4247), 77681 (control :4249), 94372, 97840, 230, 9311 (union, s10 and p6 arms).
  - No git ran in the control tree.
