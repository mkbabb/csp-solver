# T9-W7 · pass 3 · PROTOTYPE · CTRL-RULE — the margin column, arm (b), THE PIN KEPT

Worktree `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-28`,
branch `wf_f72f3b5a-83a-28`, cut from **`74a2b5d9`**. Uncommitted diff — 12 files modified,
4 untracked (3 components + the lane's playwright config). The π control is a **pristine
`74a2b5d9` tree** (`git archive 74a2b5d9` into the scratchpad, node_modules symlinked), served
read-only on `:4232`; the prototype on `:4231`. Both `--strictPort`, both `127.0.0.1`, both with
private `cacheDir`s, both killed before this return. Build used a THIRD cacheDir.

## 0 · THE REPLAY, and the route it had to take

`git` aimed at the pass-2 worktree is refused by this session's isolation, both as `cd` and as
`-C`. The chair's §"The base moved" names that case: **replayed by copying the changed files**,
classified first. Route taken, and how the file list was derived without trusting a memory:
every file differing between the two trees was compared against `git show a8fee1f5:<path>` —
identical means the fold moved it, different means pass 2 did.

| | files | route |
|---|---|---|
| pass-2 modified, fold-untouched | 9 | straight copy |
| pass-2 NEW | 3 (`RuledGroup` `RuledLine` `ConfirmRibbon`) | straight copy |
| fold-only | 10 | left at `74a2b5d9` |
| **collided** | **4** | 3-way `git merge-file`, resolved TOWARD the fold |

The four collisions and how each resolved:

- `check-copy-register.mjs` — **nothing to re-apply.** Pass 2's whole delta was striking the
  `candidates` ADMITTED row; the fold (B1b) already struck it AND the `the solver finishes the
  board` row. `ADMITTED` is empty at `74a2b5d9` and stays empty. The pass-2 hunk is SUPERSEDED.
- `check-font-coverage.mjs` — 2 conflicts. The fold's `paperNoteCopy` extractor and its
  `.error-note-text` face entry are KEPT (law); pass 2's `ruledGroupNames` replaces
  `zoneRowLabels` and `confirmLines` replaces the row-caption face, because the design deletes
  `.zone-row-label`. The fold's `what fits` cure survives as the GROUP NAME.
- `GameControlPanel.vue` — 3 conflicts. Two are the fold's `candidates → what fits` caption
  inside the zone pass 2 replaced with `<RuledGroup>`; resolved to pass 2's structure, and the
  fold's copy is intact because the group is literally named `what fits`. The third was a
  merge misalignment (`info-glyph` against the Solve button); resolved to pass 2, and the
  fold's tape cure **`the solver finishes the board` → `finishes the board for you`** was
  re-applied by hand at :1297. It had been silently reverted by the replay.
- `GameControlPanel.test.ts` — 1 conflict, the fold's `.zone-row-label` row against pass 2's
  ruled-group row. Resolved to pass 2 (the selector is deleted by the design).

`vue-tsc --noEmit -p tsconfig.json` **exit 0** after the replay and after the advance.

## 1 · WHAT PASS 3 CHANGED, and what each change is answering

1. **THE PIN IS BACK, IN THE MARGIN** (`RuledGroup.vue`). `.rp-name { position: sticky; top: 0;
   z-index: 31; align-self: start }`. Chair §6.3(a) refused "nothing pins"; the orphan reading
   is the defect to cure, not the reason to retire T9-M03.
2. **`top: 0`, NOT `var(--card-pad-t)` — the spec's premise measured false.** A sticky offset
   resolves against the scrollport's PADDING box, and the card's padding box already begins
   `--card-pad-t` below the case edge. `top: var(--card-pad-t)` pinned at TWICE the inset:
   `Level` held at y 180.94 against a resting flow position of 163.34, and `size` was pushed
   17.6 px DOWN from its own rest at scrollTop 0. `top: 0` resolves to 160.94 — the resting
   inset to the pixel, which is why the gate reads Δ **0.000** rather than a tolerance.
3. **The ribbon is the foot's full width** (`ConfirmRibbon.vue` `inset-inline: 0`; `max-width`,
   `--guard-x`, `translateX(-50%)` and the whole mount-time clamp deleted — two
   `getBoundingClientRect` reads, a `getComputedStyle` parse and a nested `Math.max`, gone).
4. **One face, WEIGHT-RANKED.** `keep` takes `HandDrawnOutline` at 1.5 against the verb's 2.5.
   Pass 2's bare `keep` contradicted its own diff (it kept the gallery's drawn) and making the
   gallery's bare flips R6 L5 RED at 422 vs 400.
5. **Three minted durations DELETED** (`pencilConfig.ts`): `ruleDrawMs` 260, `inkLiftMs` 150,
   `ribbonMs` 240 — each within 10–15 ms of a rung. The rules and the ribbon now spend
   `--motion-note`, the ink lift `--motion-whisper`. `confirmWindowMs` 2500 survives: it is a
   HOLD, not motion. The `motionVars` publisher and its two bindings are deleted with them.
6. **`, 0px` struck** at `scene.css:138` and `:582`, against an `@property` registration.
7. **RuledLine's 1.8 row struck** — "2.366 / 2.909" appears nowhere in the bank; the comment now
   names its population at every citation.

### Two provisional publishers, declared loudly, both deletions at the fold

- `@property --card-pad-t / --card-foot-h` (index.css) is **CTRL-TAPE's block** under §6.5. It is
  replicated here so the strike could be MEASURED at pass 3 instead of deferred to a family that
  has not landed. TAPE's block supersedes it.
- `--motion-whisper: 150ms; --motion-note: 250ms` is **MOT-LADDER's**. Same disposition: if the
  ladder's values differ, the ladder wins and these rules change duration, nothing else.

## 2 · THE ROWS, measured

All at `74a2b5d9`-based trees, light unless stated, sheet settled ≥950 ms before any read.

### ROW A · no orphaned field · ROW B · no stale name (I3's successor, RUN)

| arm | 1280×800 | 390×844 | 320×568 | engines |
|---|---|---|---|---|
| **the pin (shipped)** | **0 / 13** | **0 / 8** | **0 / 13** | chromium + webkit |
| ablation `align-self: stretch` | **4 / 13** | 0 / 8 | **2 / 13** | both |
| ablation `position: static` (arm (b) as built) | **4 / 13** | 0 / 8 | **3 / 13** | both |
| the spec's ablation `align-items: stretch` | 0 / 13 | 0 / 8 | 0 / 13 | both |

ROW B is **0 stale** in every arm and cell — the name cannot leave its grid area, so it holds by
construction. Pinned-top Δ **0.000 px** over every held read, both engines, all three cells.

**Two corrections the spec owes.** (a) `align-items: stretch` is a VACUOUS ablation: `.rp-name`
carries its own `align-self`, which outranks the container's `align-items`, so the injected rule
never reaches the item. The true travel ablation is `align-self: stretch`. (b) Even that arm
read GREEN until the instrument stopped measuring the name's BORDER BOX: a stretched `<h2>` has
a box as tall as its field and ink only at the top of it, so a box-based `nameVis` reports a
name on screen that has scrolled away. `nameVis` is now the TEXT RANGE's box; the pin's top is
still read off the border box, because that is what sticky positions. Both fixes are in
`instruments/name-truth.mjs` with the reason on the line.

**HEAD is not a control for ROW A and the return says so.** `74a2b5d9` has no
`[data-ruled-group]`, so the row is VACUOUS there, not green. The honest control is the
`position: static` arm above — the same tree with the pin deleted — and it reproduces the
research's 4-of-14 in kind at 4 of 13.

### The name-over-control predicate, pseudo-elements included

**0.000** at 5 scroll states × 3 cells × 2 engines. The HEAD control reads **1.000** (a sticky
surface wholly covering a control) at every cell, both engines.

Two instrument cures were needed for that 0.000 to be worth anything:
- `::before` / `::after` are read with `getComputedStyle(el, pe)`. Pass 2's `querySelectorAll("*")`
  could not see W2's fold sentinel, which is a sticky pseudo-element WITH a ground — its
  `pins 0` was a property of the instrument, exactly as the critique said.
- **every surface is CLIPPED to its scrollport before it is intersected.** Unclipped, `players`'s
  name reads 0.473 of `Clear the board` at 1280 — purely because its box extends 67 px past a
  scrollport that clips it while the bar lives below in `#card-foot`. A predicate about
  occlusion has to measure what paints. Both numbers are banked.

### R1 · the heading voice

| | voices naming a group | ruled names | one voice? | name/chip ratio |
|---|---|---|---|---|
| HEAD `74a2b5d9` | **3** at 1280, **4** at 900/390/375/320 | 0 | — | n/a |
| prototype | **1** at all five cells | **7 / 7** | yes | **1.2944** |

Both engines identical. ROW 3 clears its 1.23 floor at 1280 / 900 / 390 / 375 — **and fails at
320×568, reading 1.0176.** The spec claims the ratio only "≥375", so 320 is outside the claim,
but it is the same failure shape pass 2 had at 900×500 and it is reported, not buried: the
margin's short arm drops the name a rung and the chip does not follow.

### The gallery, π

**11 rows, 0 differing, worst |Δ| 0.00 px** — prototype against the `74a2b5d9` control, at 390
and 1280, in BOTH engines. The card's names read `--type-heading` through their own `.rp-name`
rather than `.section-heading` / `--type-group-title`, so this is Δ 0 by construction.

### The tap floor

0 verbs under 44 px in either dimension at 390 / 375 / 320 (coarse), both engines. The 15 short
faces at 1280 / 900 are fine-pointer chips, which the floor does not govern.

### The mechanical gates, in the worktree

| gate | result |
|---|---|
| `vue-tsc --noEmit` | **exit 0** |
| `vitest run` | **68 files / 831 tests, 0 failed** |
| `check-font-coverage` | **exit 0** — Fraunces **31 codepoints, 14,912 B** (was 30 / 14,636 → **+276 B**, not the +260 banked) |
| `check-copy-register --self-test` | **exit 0** — 0 unadmitted jargon, **0 ADMITTED** |
| `check-motion-contract --self-test` | **exit 0** — 34 specs |
| `check-theme-selectors --self-test` | **exit 0** |
| `check-ink-pressure --self-test` | **exit 0** |
| `check-live-regions --self-test` | **exit 0** |
| `vite build` | **exit 0**, 409 ms |

## 3 · THE GAPS — every one of them

1. **THE RULE'S CONTRAST GATE IS UNMET, and the incumbent's citation is the wrong quantity.**
   Worst PAINTED column, over the line's body (cap columns excluded, count reported), 7 rules ×
   4 sub-pixel phases:
   `chromium light 1.638 · webkit light 1.651 · chromium dark 1.639 · webkit dark 1.356`.
   σ is inside R3's band — `sigmaMin 0.681 · sigmaMax 2.302` against [0.722, 2.886] (the min
   dips 0.041 under at webkit light) — so the line IS drawn, not a hairline. What fails is the
   ink. Measured analytically at the source: the stroke resolves to
   `color(srgb 0.15 0.15 0.15 / 0.55)` over card `rgb(253,253,252)`, which composites to **3.547:1
   at FULL pixel coverage**. That is the number RuledLine's comment and pass 2's bank call
   "3.437–3.53 on all seven rules" — **it is the token's arithmetic, not a painted read.** A 2 px
   anti-aliased wobble at a sub-pixel y never fully covers a device-pixel column, so the painted
   worst is ~1.6. The spec's own conditional remedy (the rule takes `--color-muted-foreground`,
   ideal 4.65:1) is **UNRUN** — and on this arithmetic it is unlikely to reach 3.0 painted
   either. This is the pass's biggest open row and it belongs to the agglomerator.
2. **The dark sweep is 1 read of 28.** The clip-bounds guard skipped 27 crops. Instrument gap.
3. **THE CONFIRM RIBBON IS UNARMED AND EVERY §15 NUMBER IS UNRUN.** `armGuard` requires
   `isCoarse && props.isDirty`; three attempts to dirty the board from the instrument
   (class guesses, then `[role="gridcell"] input.cell-native-input` with `fill` + keypress) left
   `isDirty` false, and press 1 fell straight through to `clearNow` (`boardStillDirty: false`
   after the press). So: ribbon width vs foot width, ∩ with live controls, the 1.5/2.5 computed
   strokes, the red word's 4.5:1 on bare card, the ≥44 floor on the ribbon's own verbs, the
   press-count row, and the 2500 ms lapse — **all UNRUN**. The code is written and type-checks;
   only the measurement is missing. The estate's own `gallery-deal.spec.ts` arms this guard, so
   the next pass should borrow its fixture rather than re-derive one.
4. **Crop 2 is therefore the foot WITHOUT the confirm** (`2-confirm-390-dark-fullwidth.png`) —
   it is labelled for what it is, not what it was meant to be.
5. **The 22 e2e re-aims are NOT done, and the bare run prices what that costs.** Default
   suite, chromium, against this lane's own server, no re-aims applied:

   | tree | failed | passed |
   |---|---|---|
   | prototype `:4231` | **42** | 195 |

   The control run did not finish inside this lane's window, so the split between
   box-reds and design-reds is UNMEASURED — the whole 42 is reported as one number.

   The named re-aims still to write: `access.spec.ts:255`, `font-census.spec.ts:231/344`,
   `join-language.spec.ts:134`, `viewport-law.spec.ts:287/396/575/610`, and nine rows in
   `zone-grammar.spec.ts` — every one reading `.zone-row-label` / `.tray-well` /
   `.section-heading` inside the card. The full log is banked at
   `readings/e2e-bare-proto-chromium.log`.
6. **`useTwoTap` is CTRL-TAPE's and is not consumed here** — this arm keeps its own `armGuard`.
   The chair's §4 merge watch (COST → TAPE folds only if both lanes measure the pin band and
   `useTwoTap` as ONE mechanism) is therefore **not satisfied from this side**.
7. **R6's law probes, the hue census, R7's I2/I4, the filter census off the built dist, the
   goldens, W2 §2.2 reachability at 844×390 and 812×375, and the R3 re-aim to the bar's subtree
   are UNRUN.** The build exists (`dist/assets/index-C_dO8_hWqaek.js`, 216.83 kB) and a preview
   was never served against it. Time, not obstacle.
8. **The pinned name's baseline is no longer the chips'.** `align-self: start` is what buys the
   pin its travel, and it costs the `align-items: first baseline` relation the pass-2 design
   argued for in `RuledGroup`'s header. Unmeasured, unreconciled in the prose.
9. **`--card-pad-t` is no longer consumed by this family** now that the pin reads `top: 0` — the
   "cite then strike" chain for that token rests on `scene.css`'s `--card-foot-h` alone.

## 4 · FILES

Worktree: `src/games/shared/{RuledGroup,RuledLine,ConfirmRibbon,GameControlPanel,GameScene}.vue`,
`src/games/shared/{scene.css,GameControlPanel.test.ts}`,
`src/assets/{index.css,typography.css,fonts/fraunces-subset.woff2}`,
`src/pencil/{config/pencilConfig.ts,chrome/GameGallery/GameGallery.vue,chrome/OptionSelector/OptionSelector.vue,sheet/SheetWashiLabel.vue}`,
`scripts/check-font-coverage.mjs`, `playwright.lane.config.ts`.

Evidence: `instruments/` (name-truth · face-census · rule-sweep · ribbon-row · frames · the three
configs), `readings/` (every JSON above), `frames/` (3 crops, 56 KB total, each ≤27 KB).
