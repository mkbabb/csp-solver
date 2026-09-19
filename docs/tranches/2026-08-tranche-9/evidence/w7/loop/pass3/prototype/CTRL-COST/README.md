# CTRL-COST — pass 3 PROTOTYPE (the consequence ladder)

**RUNNING on the real surface, both engines.** Worktree
`/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-29`,
branch `wf_f72f3b5a-83a-29`, cut from **`74a2b5d9`** (the W7 execution fold). Uncommitted —
`git -C <worktree> diff --stat` reads 18 files, +1,980 / −1,547, plus one untracked file
(`web/frontend/scripts/check-cost-face.mjs`). Lane server `127.0.0.1:4233`, HEAD control
`127.0.0.1:4234` (both `--strictPort`, private `cacheDir`, **killed before return**).

## 0 · THE REPLAY, and what it carried

`git -C <pass-2 worktree>` and `cd` into it are both REFUSED by this session's worktree
isolation, so the chair's stated fallback was taken: **the pass-2 tree was differenced against
an export of `a8fee1f5` and each changed file three-way merged onto `74a2b5d9`** (`diff3 -m`,
driven by a small node script). Route declared. 18 files carried:

| resolution | files |
|---|---|
| straight copy (the fold did not touch them) | `index.css`, `typography.css`, `scene.css`, `GameScene.vue`, `GameGallery.vue`, `pencilConfig.ts`, `SheetWashiLabel.vue`, the five `spec.ts`, `fonts/LICENSES.md`, `fraunces-subset.woff2` |
| merged toward the FOLD (chair: the fold is law) | `check-font-coverage.mjs`, `GameControlPanel.test.ts`, `GameControlPanel.vue` |
| **DROPPED — subsumed by the fold** | `check-copy-register.mjs` |

Three hunks were re-cut for the fold and are named:

1. **`check-copy-register.mjs` is HEAD's.** Pass 2's whole delta was emptying `ADMITTED`; the
   fold already struck both entries at B1/B1b and left the reasons as comments. Pass 2's version
   would have DELETED the fold's own 937-line discovery grammar. The fold's file stands unchanged.
2. **The solve tape reads `finishes the board for you`**, not pass 2's `fills in the whole
   board`. Same ruling, two wordings; the fold's shipped, so the corpus declares the fold's.
3. **`check-font-coverage.mjs` keeps BOTH sides** — pass 2's `bandNames` / `bandRowCaptions` /
   `bandNotes` / `askWords` extractors and the fold's `paperNoteCopy` extractor and
   `.error-note-text` face. `zoneRowLabels` retires with `.zone-row-label`; the fold's assertion
   on that class follows the CAPTION into `.band-row-caption`.

`vue-tsc --noEmit -p tsconfig.json` **exit 0** on the replayed tree before any pass-3 edit.

## 1 · THE GATES, each at its number

| gate | row | HEAD `74a2b5d9` | here |
|---|---|---|---|
| **G14′** | **THE PRESS-COUNT ROW** — press 1 arms, **0 focusouts on the face**, Δ scrollTop **0.00**, **press 2 FIRES** (board signature changes); keyboard Enter arms with focus on `no`, second Enter disarms board unchanged, Escape disarms and the sheet stays | RED (no asking face; WebKit never fired at pass 2) | **GREEN ×5 cells** — chromium/webkit × 390×844 touch, 1280×800 mouse, + chromium 844×390 |
| **G5″** | a tier-3 press on a dirty board writes 0 and arms on BOTH pointer classes | RED (the desk deals at once) | GREEN (`arms true` at 1280×800 mouse, both engines) |
| **G6′** | zero reflow with the `no` foot visible | RED | **GREEN — Δ [0,0,0,0]** on both faces, `scrollHeight` Δ 0, 5 cells, 2 engines |
| **G15′** | `no` in the a11y tree, drawn 1.5 inside the 2.5 face, ≥44 per dimension **with the firing control** | RED | **GREEN — 56.00 × 44.00 at 390 / 844, 44.00 × 44.00 at the desk** (face 73.59 × 123.97) |
| **G16′** | pinned head covers 0 below the exempt line; band == 0.6rem + derived head; four heads one height | RED (sampled 38/41/42, head 40.39) | **GREEN — occlusion 0/25 at scrollTop 0·58·116·200·350, both engines, 4 viewports; heads 37.44/37.44/37.44/37.44; band 47.066 = 9.6 + 37.47** |
| **G20** | **THE RULER** — card width == legend max-content + padding per engine; board x \|Δ\| ≤ 0.05 vs `74a2b5d9`; no child max-content > ruler | RED on pass 2's tree (+41.75) | **GREEN — card 324.22 chromium / 332.31 webkit, identical to HEAD's; board x 129.89 / 125.84, \|Δ\| 0.00; over-ruler children 0** |
| **G21** | armed AND hovered destructive word ≥ 4.5 light (the fence) | RED (4.693) | **GREEN — 4.99 light / 6.303 dark in ALL four states**, both engines |
| **G22** | the berth's ink ⊂ its label box; head 37.45 ± 0.05 | RED (0.61 over) | **GREEN — ink inside by 0.02–0.35 top, 0.29–0.57 bottom**, 2 engines × 4 viewports; head 37.44 |
| **G23** | `check-cost-face --self-test`, the browserless node witness | **RED (6/6 checks, 7 failures)** | **GREEN, 7 checks + 7 planted defects each REDding its own check** |
| **G9′** | asked word ≥ 4.5 light on bare card | RED (4.20 on the 8% ground at pass 1) | **GREEN — 4.99** |
| **G12′** | `check-font-coverage` exit 0 with `players` in Fraunces + the two band-3 notes | RED | **GREEN — Fraunces 14,636 → 14,948 B (+312), 31 codepoints; Patrick Hand 4,312 B, 31 declared strings, each derived** |

**Guards.** filter census **12/12 PASS off the built dist, budget exactly 9** (the law probe's
L1 reads 9 too) · **goldens 4/4 PASS off the built dist, NO re-mint** · live regions **10
declared / 0 born speaking** · `check-theme-selectors` OK · `lint:motion` OK (34 specs) ·
`lint:copy` **0 em-dashes, 0 unadmitted, 0 admitted** · prettier **all files clean** · **vitest
68 files / 836 tests, all pass** · `vue-tsc` exit 0 · **L5 GREEN** · hue census 29 token rows
unchanged (no new hex; the accent family and the eight player hues read as at HEAD).

**π.** Every box OUTSIDE the controls card, keyed by ancestry path, on five routes × two
engines: **0 structural boxes moved, maxΔ 0.00**. The only deltas are `.game-cell > svg > path`
poses, seeded per deal — the board's own boil, not a layout claim — and the goldens, the
estate's own instrument for that surface, are 4/4 green.

## 2 · WHAT PASS 3 FOUND THAT THE SPEC DID NOT

Four corrections against interest, each measured:

1. **The spec's pin-band arithmetic was wrong.** It predicts `43.05 ± 0.05` for
   `0.6rem + head`. 0.6rem is 9.6px and the head is 37.45, so the band is **47.05**; measured
   **47.066**. The FORM is right, the printed sum was not.
2. **`padding-block: 0.5px` does not close the berth.** It left the ink **0.41 over the top**
   (chromium) / 0.15–0.21 (webkit) — pass 2's defect with a smaller number. **1px** clears every
   engine × width cell with ~0.5 to spare. Shipped at 1px; the spec's number is corrected.
3. **`@property … inherits: false` silently re-opened G16′.** `--pin-band` is declared on
   `.controls-card` and CONSUMED on `.cost-band-head`, a descendant, so a non-inherited
   registration handed every head its INITIAL `0px`: the head pinned at 197.11–234.55 against an
   exempt line at 187.52 and `elementFromPoint` returned it at three size chips — pass 2's cured
   defect, back, silently, introduced by the registration meant to make absence loud.
   `inherits: true` on both tokens, reasoned at the registration. **This is chair §6.5's own trap
   from the other side: a registration decides not only what an ABSENT publisher yields but who
   can see a PRESENT one.** §10's leader should carry this into the single block.
4. **The fence needed a second selector.** `.act-face[data-armed] { background: none }` left the
   asked word at 4.693: the face was transparent and the accent a reader saw was
   `.icon-btn:hover`'s, on the VERB BUTTON INSIDE the face. `.act-face[data-armed]
   .act-verb:hover` closes it; the node gate's check 7 is that measurement.

The spec's board-x figures (131.89 / 127.84) read **129.89 / 125.84** on BOTH trees at
`74a2b5d9`; the Δ against the control is what the gate asserts, and it is 0.00.

## 3 · THE DIFF

`index.css` — the `--ring-ink` mint STRUCK (consumers `var(--ring-ink, currentColor)`, a
deliberate fallback, reasoned at the seam: absence there has a correct answer, unlike a measured
token's); `--motion-whisper: 150ms` seated (§13's rung, here so the lane builds standalone); the
eight `150ms` literals consume it. `scene.css` — `--cost-head-h` DERIVED
(`calc(var(--type-group-title) * 1.2 + 0.4rem)`), the four `, 0px` fallbacks struck, both
measured tokens `@property`-registered with `inherits: true`. `GameControlPanel.vue` — the
input-split focus contract and the null-`relatedTarget` belt; the drawn `no` at 1.5 in a
`.act-answer-box`; the armed face's two-selector fence; heads held to `1lh`;
`.band-acts-rungs` (a ONE-COLUMN grid, so the band prices at the wider rung 179.59 rather than
the sum 325.97) + `.act-rung`; `contain: inline-size` on the options row; the berth's 1px; band
3's two NOTES rows; the `aria-describedby` SPLIT (the answer carries its own name and its own
"keeps the board"); GCP:569's stale 73.59×44 corrected; the observer's `--cost-head-h` term
DELETED. `pencilConfig.ts` — `MOTION.inkLiftMs` deleted (0 consumers). `GameScene.vue:187-199` —
the false `--card-pad-t` comment re-written. `scripts/check-cost-face.mjs` + `package.json`'s
`lint:cost-face` — the node witness.

## 4 · GAPS, honestly

1. **W2 §2.2's reachability probe is NOT run.** The chair scopes 844×390 to it and this lane does
   not hold its source. What IS measured at 844×390: the press-count row GREEN (chromium), card
   `clientHeight` **302**, occlusion 0/25, asked word 4.99, berth ink inside (both engines for the
   ink and occlusion cells, chromium only for the press count). **The reachability assertion is
   owed and this lane does not claim it.**
2. **The 22 e2e re-aims are NOT written, and the default suite was not run at all.**
   `.deal-face`, `.act-answer`, `.act-answer-box`, `.band-row-caption` and `.act-rung` are new
   addresses; any spec naming `.zone-row-label` or `.action-bar` will red. This is the largest
   remaining piece of work and it is not started.
3. **L3 is RED and that is the chair's wave-wide row**, carried forward as a PROPOSED diff
   (`instruments/law-probe.PROPOSED.diff`): the probe pins `admitted === 2`, so it reds because
   the debt was PAID — and at `74a2b5d9` it now reads `1` because its `since:` regex also counts
   the self-test's synthetic fixture. R3 is reported **MOVED** — its subject (`.action-bar`) is
   deleted by this design, so it prints a cure-less RED about a class nobody renders. R1/R2 stay
   RED and are not this family's. **Nothing under `loop/r0/`, `loop/pass1/` or `loop/pass2/` was
   written; both instruments this lane ran are re-pointed COPIES.**
4. **Only chromium crops.** Three cited frames, all chromium; the webkit pair is unshot. Every
   NUMBER is both engines.
5. **The dark-mode and 900×500 press-count cells are not run** — the ink/occlusion probe covers
   those viewports, the press-count does not.
6. **`--motion-whisper` and the `@property` block are this lane's seats, not §13's / §10's.**
   Both are declared to move at the fold and neither is coordinated with TAPE yet; if TAPE lands
   its own, these are duplicate declarations to strike.
7. **The `no` button's `:focus-visible` ring** is `index.css`'s `:is(.act-verb, .act-answer)`
   rule at offset −2, and it was NOT checked for a double-ring against the new drawn 1.5 box
   around it.
8. **The heading-voice census was not re-run as a spec.** Four `<h2>.section-heading` names in
   one voice is asserted by the unit row (`GameControlPanel.test.ts`, 40 tests green), not by
   r0's Playwright probe.

## 5 · THE MERGE WATCH (chair §4), answered from this side

**YES on both halves, measured on this tree.** The pin band is ONE mechanism with two
publishers — TAPE derives from a type rung, COST sampled a head, and the sample is the defect
(38/41/42, engine-split, order-dependent); pass 3 kills the sampled publisher, so what is left is
TAPE's closed form. `useTwoTap` and `askingAct` are one machinery (armed ref, one timer,
`confirmWindowMs`, fire-on-second-press, teardown) with two POLICIES.

**GRAFT LIST:** `.act-face` + the drawn `no` at 1.5 inside 2.5 · the input-split focus contract
and the null-`relatedTarget` belt · the berth-in-the-head at 1px · the ruler law + its probe
(`probe/r2-width-and-head.mjs`) · the derived band (COST's sampled publisher dies) ·
`scripts/check-cost-face.mjs`.

**POLICY ROWS THAT MUST NOT DIE (→ W1 §1.5 / U-10):** (i) the ask is POINTER-AGNOSTIC — M12 says
"any destructive action", and the desk asks too (measured: `arms true` at 1280×800 mouse, both
engines); (ii) the answer is a REAL control — `no`, ≥44 per dimension, in the a11y tree, with its
own accessible name and its own description — not a name swap alone.

## 6 · FRAMES (3, chromium, ≤150 KB each)

- `frames/ask-390-light-rest.png` / `ask-390-light-armed.png` — the same box, `sure?` in
  `--color-red-ink` on bare card, the drawn `no` at 1.5 inside the 2.5 face, nothing moved.
- `frames/ask-390-dark-armed.png` — `#FF5C7C` on bare card.
- `frames/ruler-rungs-1280.png` — the `writing` band's two rungs at HEAD's card width.

## 7 · INSTRUMENTS AND READINGS

`probe/r1-focus-model.mjs` (the press-count row) · `probe/r2-width-and-head.mjs` (the ruler,
four heads, `--cost-head-h` read back) · `probe/r3-ink-berth-occlusion.mjs` (painted contrast in
four states, the berth's ink by Range, the occlusion sweep with `belowExemptBand`) ·
`probe/pi-rects.mjs` + `probe/pi-diff.mjs` (π) · `probe/frames.mjs` ·
`probe/occl-detail.mjs` (the one-off that named the `inherits: false` defect).
`instruments/hue-census.COPY.mjs` and `instruments/law-probe.COPY.mjs` are r0's, COPIED and
re-pointed at this worktree; `instruments/law-probe.PROPOSED.diff` is the two MOVED rows.
Readings under `readings/`; gate logs `gate-battery.log`, `dist.log` (build + goldens + filter
census), `vitest.log`, `pi.log`, `final.log`.
