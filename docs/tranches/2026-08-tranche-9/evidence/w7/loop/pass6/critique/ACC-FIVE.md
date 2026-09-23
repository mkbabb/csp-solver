# ACC-FIVE: pass-6 adversarial critique

Family: the five-crayon accent (§3 §4 §12, section leader, owner of `poseFronts` / `frontGate`).
Base and π control: `74a2b5d9`. Work tree: `.claude/worktrees/wf_f72f3b5a-83a-41`. I did not write to it.
Its `git status` at my return shows the prototype's 12 M + 5 ?? only. `shasum -c` passed on the four
product files I served before and after.

Critic's servers:
- `:4241` work-tree dev (scratch config, cacheDir in scratch)
- `:4243` a scratch COPY of the work tree with `FRONT_MIN_MS` 16 → 0 (the ablation lived only in the copy)
- `:4242` the shared control dist, verified by `index-CubiZsMVSwTc.js`
- `:4248` my build of the work tree. It is `index-C5Zf5Lmyo66Y.js`, which is the prototype's post-edit identity, reproduced byte for byte by name.

All four were killed by their listener PIDs (26805, 26808, 26817, 30763) and their npx parents. All four ports read free afterwards. The scratch configs are moved to `<scratchpad>/trash-acc5crit6-1/`.

The host ran at load 37 → 305 during my runs (other projects included).

**CONVERGENCE: 84 %, EARNED (from 83). VERDICT: ADVANCE.**

The pass-6 delta is small and real. Against the chair's `pass5.diff` applied on a clean archive, it is:
- index.css: 43 changed lines
- GameGallery.vue: 34
- HandDrawnGrid.vue: 39
- GameBoard.vue: 16
- check-ink-pressure.mjs: 5
- front-rate.spec.ts: 111
- progress-corridor.spec.ts: 76
- the new `e2e/rate-clock.ts`

Three things hold the number:
1. **The re-cut G10, the leader's MUST 1, reds the LANDED tree in WebKit in 4 of 7 of my runs.** Three runs failed on the rate (63.1 and 64.8 twice), and one failed because the gauge never re-cut. The re-cut is not a flake of load alone. I measured two mechanisms:
   - `frontGate`'s `force` end-write lands 5.9–9.5 ms after the last gated commit.
   - WebKit's 1 ms-coarsened `performance.now()` admits 14–15 ms gaps through a 16 ms gate.
2. **G5 cures only the median.** The glyph-text fraction bound fails in BOTH themes, and the README's "structural for any chromatic red" is refuted by two planted arms.
3. **ROW B's firing default loses to the control** on the same painted statistic (print 1.08 vs 4.24 / 3.191).

---

## 1 · Measurements I re-ran (my servers, both engines)

### 1.1 G10: the re-cut, its negative controls, and the landed tree's reliability

`BASE=… CLOCK=… npx playwright test front-rate.spec.ts` (the lane's own file, unmodified), both
engines, one batch (`logs/g10-battery.log`, `logs/run2.log`):

| arm | chromium | webkit |
|---|---|---|
| gated · driven 125 Hz | **0** (55.5 / 51.0 / 50.4 /s; tally 10.22 d/frame) | **1**: "gauge never re-cut" (`.progress-trace` nodes 0; the three hints never filled a cell) |
| gated · driven, re-run ×2 | not re-run | re1 **0** (57.7 / 53.8 / 52.1) · re2 **1**: gauge **64.8/s** against the budget |
| ablated (`FRONT_MIN_MS` 0) · driven | **1** (125.6 / 126.6 / 125.0) | **1** (126.7 / 125.5 / 122.6) |
| gated · CLOCK=60 | **1** (precondition, 59.9 Hz) | **1** (precondition, 30.3 Hz) |
| ablated · CLOCK=60 · PRECOND=0 (the hole) | 0 (60.0 / 62.2 / 61.3) | 0 (30.6 / 30.2 / 30.4) |

The negative controls reproduce. The driven ablation reds by rate in both engines. The 60 Hz clock
reds on the precondition. The hole reappears only with the precondition switched off.

**The gated tree does not pass reliably, and I proved why.** `instruments/front-rate-gaps.CRITIC.spec.ts`
is the landed spec plus one print per burst of its inter-commit gaps. It ran 4× per engine on the
gated tree (`logs/run4.log`):

| run | webkit | chromium |
|---|---|---|
| #1 | 0 · gaps of 15 ms inside every burst | 0 · tally ends on **8.3 ms**, join on **8.5 ms** |
| #2 | **1 · gauge 63.1/s** · first gap 14 ms, join ends on **7 ms** | 0 · gauge ends on **7.6 ms**, join on **5.9 ms** |
| #3 | **1 · gauge 64.8/s** · gauge ends on **9 ms**, join on **8 ms** | 0 · tally bursts on 8.1 / **9.5 ms** |
| #4 | 0 · 15 ms gaps in every consumer | 0 · join ends on **6.4 ms** |

There are two mechanisms, both in the primitive, and neither comes from the instrument:

1. **The forced end is outside the budget.** `onComplete: () => fillGate.write(to, true)` (HandDrawnGrid.vue:197) and the join's `write(to, to >= 1 …)` commit regardless of the gate. So in 7 of 8 runs at least one consumer's burst ENDS on a 5.9–9.5 ms gap. The unit test pins that as a feature ("forces the end"). The comment "≤62.5 re-cuts per second at any refresh rate" (gridPaths.ts:537) is therefore false as written.
2. **WebKit's `performance.now()` resolution is 1 ms.** Every WebKit gap prints as an integer, and `now − last < 16` lets 15.x ms (printed 14–15) through. Each WebKit burst carries 2–4 such gaps. Chromium's clock is fine-grained, and its 23–24 ms skips pull the average down, which is why only WebKit reds.

The prototype's own gated WebKit readings (60.2 / 56.4 / 58.7) sat 2.3/s under the line. A
15-frame burst with one forced 9 ms end and three 15 ms gaps crosses it.

Tally over my 7 gated-driven WebKit runs: **3 pass, 4 red** (three on rate, one on no gauge
re-cut). Chromium: **5 of 5 pass**.

The row fails loudly rather than passing a broken tree, so it is not vacuous. It is also not a shippable gate: it reds the design it is meant to hold.

### 1.2 The corridor: the third ground, reproduced

`progress-corridor.spec.ts` whole, on my build `:4248`: **8/8 chromium (1.7 min), 8/8 webkit (1.1 min)**.
This includes the BORDER row and its born-RED (`#a87e13` light, `#756106` dark).

The arithmetic from the painted grounds reproduces the lane's painted numbers to the third decimal
(`logs/dark-window.log`):

| ink | line | paper | border |
|---|---|---|---|
| `#a27803` light | 3.236 | 3.949 | 3.217 |
| `#a87e13` light | 3.505 | 3.646 | **2.970** |
| `#79650f` dark | 3.303 | 3.280 | **2.572** |
| `#756106` dark | 3.505 | 3.091 | **2.424** (the born-RED clears HEAD's 2.441 floor by only 0.017) |

The light cure is sound. The dark ink was NOT re-searched for the third ground (§3.4).

### 1.3 G5: the leave verb, re-read, with two planted deeper arms

`instruments/g5-deeper-arms.CRITIC.mjs` is the lane's `p6-g5-verb.mjs` plus two arms planted by
style. The arms are the same OKLab mix at 70 % and 55 % red-ink. The run used DPR 1, a fresh
payload `ATMuNjA4MTIz…` (61 givens, read back on both arms), and served `:4248` against `:4242`
(`logs/g5-critic.log`).

The lane's tree reproduces to the thousandth on a different payload: 5.493 / 5.248 chromium light, 5.663 / 5.406 webkit, dark 7.047 / 5.603 and 6.715 / 5.422.

Fraction of glyph pixels under 4.5 at HOVER (median in brackets):

| cell | tree (85 %) | mix 70 % | mix 55 % | control (black) |
|---|---|---|---|---|
| chromium light | 0.408 (5.248) | 0.299 (6.554) | 0.194 (8.001) | 0.069 (15.245) |
| webkit light | 0.399 (5.406) | 0.291 (6.821) | 0.216 (8.479) | 0.061 (16.084) |
| chromium dark | **0.297** (5.603) | 0.201 (6.447) | 0.134 (7.363) | **0** (12.079) |
| webkit dark | **0.372** (5.422) | 0.214 (6.55) | 0.119 (7.599) | **0.006** (12.417) |

What this shows:
- **The fraction is not structural.** It falls monotonically with the ink's depth: 0.408 → 0.299 → 0.194 at chromium light hover. So "any chromatic red at this weight" (README gap 1) is false; the lane built one arm and asserted the rest.
- **The bound fails in DARK too, which the README never states.** At DPR 1 hover, dark reads 0.297 / 0.372 against the control's 0 / 0.006.
- **The gate as the lane runs it is the median alone.** LAWS P5 and chair A.4 make the gate the median AND the fraction bounded by the control's plus slack. Dropping the second clause re-words the gate to pass.

### 1.4 The rest, re-run bare (tree | control `74a2b5d9`)

| gate | tree | control |
|---|---|---|
| `check-copy-register` (M16) | 0 (0 dashes, 0 unadmitted) | 0 |
| `lint:lanes`, `lint:theme-tokens`, `lint:sleep` (36 specs) | 0, 0, 0 | 0, 0, 0 |
| `test:e2e:projects`, `check-pw-projects` (565 tests) | 0, 0 | 0, 0 |
| `npm run lint` (the SCOPED prettier: `src/ scripts/ ../../scripts/ ../relay/`) | 0 | 0 |
| `eslint .` | 0 | 0 |
| `check-ink-pressure`, `check-theme-tokens` | 0, 0 | 0, 0 |
| `check-property-block` (chair's copy) | 0 (source 0 registrations) | 0 |
| undefined-token census (chair's copy) | 1 = 0 findings + the ONE declared STALE `--refuse-dur` row (A.1 ruling 4 → GREEN) | 1, the same row |
| `filter-census` on my build, light | 12/12 | 12/12 |
| `filter-census` on my build, dark | 4 failed, all `crayon-heart.idle ⟨saturate(0.85)⟩` (inherited, the fold's first pick) | 4 failed, identical |

The rows I did not re-run keep the prototype's numbers: vue-tsc, knip, unit 70 files / 841, ROW B
and C, π, G3, G9 and the join born-RED. I read every one of their logs:
- ROW B/C: `readings/rows-bc-final-summary.txt` has all twelve forced cells and all 24 print cells.
- π: `logs/pi.log`, expanded key by key, shows only claimed selectors (trace ×4, pen `path` ×5, sparkle, the guard face's colour, ground and outline).
- Join born-RED: 2/2 → 2 failed per engine, with the per-frame sampler.

`gridPaths.poseFronts.test.ts`: the six row bodies are byte-identical to GRAPHITE's `-40` (I diffed
lines 34–87 against 26–79). GRAPHITE's header comment ("exercised against the estate's OWN
generators, not a hand-written string") is false against those same bodies, and FIVE's corrected
header is the one to fold.

## 2 · What holds

- **The G10 re-cut is the right shape.** It drives its own 125 Hz clock, the ≥ 93.75 Hz precondition reds a 60 Hz clock in both engines, the interleave is witnessed (d/frame > 4, and DEAL=EASY reds it at 4.00 / 3.79), and every reading prints before any assertion. The pass-5 hole reproduces only with PRECOND=0. MUST 1's *born-RED* is closed; its *green* is not (§3.1).
- **The third ground is a real find.** The wrapper's 2 px border sits under the trace's outer overhang, and the pass-2..5 gold read 2.970 there. The light token moved to the balanced point of all three grounds (3.236 / 3.949 / 3.217). The corridor gained a BORDER row that reds a two-ground ink, and it reproduces 8/8 in both engines.
- **ROW C's default is now the arm that clears 3:1 painted** and beats the control on the line. Chromium light reads 3.236 with 0.152 under 3, against the control's 2.876 with 0.641. The CanvasText arm stays buildable (`arms/rowC-canvastext.arm.diff` applies with `--check`).
- **FORK A's caption is corrected, and the ringFront born-RED is banked in-batch** in both engines.
- **One progressbar contract.** `aria-valuenow` is the percent with its 0–100 range, and SIX's count rides `aria-valuetext`.
- **Constraints are clean.**
  - M16 exits 0.
  - filterBudget is unmoved: the tree equals the control in both themes.
  - No `@property`, no `--ring-ink`, no undefined token.
  - π touches claimed surfaces only.
  - W2's mechanics are untouched.
  - No r0 row moved (R1–R3 are RED on the tree and the control alike).

## 3 · What is NOT converged (closable sentences, numbers attached)

### 3.1 G10 reds the landed tree in WebKit, 4 of 7 runs: the primitive's budget has two holes

The forced end commits 5.9–9.5 ms after the last gated write (7 of 8 runs), and WebKit's 1 ms
`performance.now()` admits 14–15 ms gaps. So gated WebKit reads 63.1 and 64.8/s against 62.5 in
3 of 7 runs, and 1 more run found no gauge re-cut at all.

**To close,** do both of these:
- Make `frontGate` hold the budget including the end. Defer a forced write to `last + FRONT_MIN_MS` (one rAF later) instead of committing it inside the window, and compare against the rAF timestamp or `FRONT_MIN_MS − 1` so a 1 ms-clamped clock cannot pass 15 ms.
- Run the gated row ≥ 5× per engine in one batch with 0 reds. `front-rate-gaps.CRITIC.spec.ts` should print min gap ≥ 15.5 ms on every burst.

The `FRONT_MIN_MS 0` ablation must still red in the same batch. The "gauge never re-cut" red (the hints did not fill) needs its hint press polled to a filled cell before the join.

### 3.2 G5: the fraction clause is dropped, fails in both themes, and "structural" is false

At DPR 1 hover the tree reads 0.408 / 0.399 light and 0.297 / 0.372 dark, against the control's
0.069 / 0.061 and 0 / 0.006. Planted deeper arms (70 %: 0.299 / 0.291 / 0.201 / 0.214; 55 %:
0.194 / 0.216 / 0.134 / 0.119) show the fraction is a function of depth.

**To close,** do both of these:
- Gate the full §2.11 statistic (median ≥ 4.5 AND fraction ≤ control + a stated slack), and state the dark fraction in the ballot.
- Search the mix down, for example 40 % and 30 %, to the first depth whose fraction meets the bound, or show none does while it still reads red. Then either make that the default or restate G5 as the owner's trade with both numbers.

A firing default that fails the gate's second clause may not fire (LAWS P5).

### 3.3 ROW B's firing default loses to the control on the same painted statistic

In print the trace settles to `rgb(0,0,0)` on a `rgb(0,0,0)` frame: painted 1.08 over 100 % of its
footprint, off-frame 0. HEAD's violet prints at 4.24 light and 3.191 dark. The default "graphite
print" makes the gauge invisible on paper, where the control shows it. That is the pass-5 ROW C
disease moved to print.

**To close,** do one of two things:
- flip the default to a print arm that reads ≥ 3:1 against the printed frame; or
- restate the arm honestly as "no gauge in print". That means `display: none` on the print layer, not a stroke that paints and cannot be seen, which is a drawn thing whose existence is not visibility. Its ballot row then names the control's 4.24 / 3.191 as the loss.

### 3.4 The dark ink was not re-searched for the third ground

The light token moved to the three-ground balance point. The dark stayed at the two-ground
midpoint (`#79650f`, line 3.303 / paper 3.280 / border 2.572).

At the same hue and chroma (94.5°, C 0.100), `#7e6a17` reads 3.069 / 3.529 / **2.768** (arithmetic
from the painted grounds, which matched painted to the third decimal on all four inks here). That
buys +0.196 on the border against −0.234 of line margin. The gate floors the dark border at HEAD's
2.441, so the lane's byte passes a floor it could beat by 0.33.

**To close,** paint the balanced dark byte in the corridor, both engines, and pick with both rows
printed, or say why line margin outranks the border. The "no ink clears 3:1" statement (best 2.914)
stands.

### 3.5 G9 dark is RED and its proposed re-cut has no negative control

Dark reads 15.46–17.55 % against the 12 % ceiling (light 8.85–10.66 %). The 140° bin is HEAD's
EASY-green heading, and it is identical on the control.

Excluding the difficulty chrome is a gate re-word unless it ships with a plant that still reds it:
for example, a planted off-family accent on the family's own surface (the trace, the tally or the
sparkle) that raises the term above 12 % with the chrome excluded. Until the chair rules with that
plant, G9 dark is an open red.

### 3.6 Smaller rows (one line each)

- **The corridor's test title** still says "clears 3:1 against both its painted grounds" while it asserts THREE grounds and holds the dark border to 2.441, not 3:1. Retitle it.
- **The shipped spec carries off switches** (`PRECOND=0`, `DEAL`, `CLOCK=60`). They are fine as demonstrations, but `PRECOND=0` greens a broken tree on a 60 Hz host. Move the hole arm to the critic instrument, or gate the knob behind a named negative-control project.
- **A swallowed wait:** `waitForSelector('.difficulty-tally.is-ungraded').catch(() => {})` lets the re-deal loop read the previous board's tally. The printed `inked` can be stale (the witness takes the max over all bursts, so the verdict survives).
- **A comment that is false on this tree:** HandDrawnGrid's `fillLine` comment says the sentence is "the one the page draws". This tree draws no count; SIX's tree does.
- **Masked defaults:** `fillable` defaults to 1 and `filled` to 0, so a mount without counts announces "0 of 1 on the board". Make both props required. GameBoard is the one consumer.
- **The carried rows were struck by name, which the charter allows:** goldens (pinned to HEAD's violet by design), R6 (subject absent from the diff), R3 (no roughness, wobble or seed change), and F1 (`SELF_TAKES_A_HAND` not on this tree). They are struck for this lane, not closed for the section.

## 4 · Checklist hits

- **Gates that cannot fail:** none new. G10's born-REDs all red. The corridor's BORDER plant reds.
- **The opposite defect, a gate that fails a correct tree:** G10 gated WebKit, 4 of 7 (§3.1).
- **Re-wording a gate to pass:** G5 drops the §2.11 fraction clause (§3.2). The G9 exclusion is proposed without its plant (§3.5).
- **The constraint it forgot:** LAWS P5 "a firing default must not lose to the control on the same painted statistic". Both ROW B (1.08 vs 4.24 / 3.191, §3.3) and G5's fraction clause (§3.2) miss it.
- **"Search the feasible window before minting or refusing":** the dark ink was not re-searched for the third ground (§3.4).
- **Elegant reduction:** "one gate, ≤ 62.5 re-cuts per second" is true only up to the forced end and the engine's clock resolution (§3.1).
- **Masked fallback:** "0 of 1 on the board" (§3.6).
- **Not hit:**
  - vacuous convergence (every headline I re-ran reproduced to the digit)
  - spec-cites-itself
  - legacy aliases
  - consumer-less substrate
  - the generic default
  - undeclared π
  - M16
  - filterBudget
  - @property
  - the undefined-token census
  - W2's mechanics
  - unverified gestalt (I looked at both section-fork crops: one payload, captions untruncated, and graphite's band ratio struck with its cause named)

## 5 · Verdict: ADVANCE at 84

- **Not BLOCK:** each open row is one primitive fix (a deferred end write and a clamp-proof compare), one ink search, one print arm, or one gate clause. No primitive as hard as the problem is missing.
- **Not RETIRE:** nothing is a rewording of another family's idea, and no constraint is violated in the shipped paint, apart from the ballots' defaults, which are dispositions.
- **Up one, not more:** MUST 2 (ROW C) is closed. MUST 3 (G5) is half closed. MUST 1 (G10) is re-cut correctly but reds its own tree in WebKit, and the leader's gate is the section's rate primitive.

**MUSTs for pass 7:**
1. `frontGate` holds the budget through its forced end and on a 1 ms clock, with the gated row 0-red over ≥ 5 runs per engine (§3.1).
2. G5 gated on the full statistic, with the depth search run (§3.2).
3. ROW B's default either restated as "no gauge in print" or flipped (§3.3).

## 6 · Cross-pollination

1. **Every rate gate in the estate** (LADDER, VERB, the §10 dock, SIX, GRAPHITE): a `force` or `rearm` path is a write outside the budget. Print the burst's min gap, and read WebKit's `performance.now()` as 1 ms-quantised. A 16 ms gate on WebKit admits 15.x ms. `front-rate-gaps.CRITIC.spec.ts` is the probe.
2. **Every glyph-text row** (the T9-R6 estate row, NOTE-ERASE, PLR-SELF, TIN's name ink): the fraction under 4.5 moves with ink depth. Plant a deeper and a shallower arm before calling a fraction "structural".
3. **Every multi-ground corridor** (ACC-SIX's balanced rung, TIN, WALK): when a new ground is found, re-balance BOTH themes. A floor keyed to HEAD's reading is a floor, not a search.
4. **Every print or forced-colours arm:** an ink that paints on its own ground at 1.08 is invisibility by paint. Say `display: none`, or the arm loses to the control.

## 7 · Incidents, self-declared

1. My pre-return battery wrote its per-row temp logs under the scratchpad (`acc5crit6/logs/bt-*`). An early draft pointed them at `/tmp`, and I corrected that before its first run. Nothing was written outside the scratchpad or `pass6/critique/ACC-FIVE/`.
2. The battery ran its read-only node gates in the control tree (`npm run -s lint:*`, `eslint .`, `prettier --check`, `check-*`, the chair's two censuses). I ran no git, build or write there. `check-property-block`'s served stamp read the WORK tree's stale `dist/` (19 Sep, `index-DCleUxXAr4B4.js`). The source clause is the gate and read 0; the stamp is not cited.
3. `:4244` was taken by another lane between my scan and my bind (strictPort refused). My first tree-dist preview died there (pid 29226), and I rebound on `:4248`. Ports 4240 and 4244–4247 are other lanes' and were not touched.
4. Load reached 305 (other projects' builds and servers). The G10 gated WebKit reds happened across load 90–300. The gap mechanisms in §1.1 are clock and primitive facts, not load, and they are printed per gap.
5. `pw-out` is shared across my runs, so the first WebKit red's error-context was overwritten before I read it. That red (no gauge re-cut) is therefore a reading without a page snapshot.

Evidence: `pass6/critique/ACC-FIVE/{instruments,logs}` (about 76 KB, text only, no images, no raw JSON).
