# ACC-FIVE: pass-5 adversarial critique

Family: the five-crayon accent (§3 §4 §12, section leader, owner of `poseFronts` and `frontGate`).
Base and π control: `74a2b5d9`. Work tree: `.claude/worktrees/wf_f72f3b5a-83a-41`. I read it and
wrote to it only for two ablations, each restored and checked with `shasum -c OK`. At my return,
`git diff --stat` reads the prototype's own 11 files, +868 −134, plus 4 untracked files.

Critic's servers:
- work-tree dev on `:4241`
- the shared control's dist on `:4242`, identity `index-CubiZsMVSwTc.js`, verified by asset hash
- my own build of the work tree on `:4243`, identity `index-AcoLTdF9hxbp.js`, 43 files, built with the config and cacheDir outside the tree

All three were killed by listener PID (50417, 50420, 56539) and their npx parents, and 4241–4243 read FREE. `.acc5crit/` and both tree-side vite caches are deleted.

**CONVERGENCE: 83 %, EARNED. VERDICT: ADVANCE.**

The pass-5 delta is real. It is +99/−37 on the tracked files and one new spec over the chair's
`pass4.diff`, which I verified by applying the bank onto a clean `git archive 74a2b5d9` and diffing
file by file. I reproduced every headline I re-ran:
- the gated rates in all three consumers
- the three born-REDs' mechanism
- ROW B and ROW C to the digit
- G5's RED to the digit
- the corridor spec, 12/12

Four points are not earned:
1. **G10 can pass on a broken tree on any host whose animation clock is at or below 62.5 Hz.** I showed this both engines (§3.1).
2. **ROW C's firing default ships an accessibility regression against the control**, and its alternative arm is arithmetic only (§3.2).
3. **ROW B's survival fraction moves 2–3× with the board** (§3.3).
4. **FORK A's control pane is captioned with a stroke that paints nothing.** The gap was not a mystery: it is HEAD's T4-W9 bow-out, `opacity: 0` at the win (§3.4).

The carried rows from pass 3 are still carried (§3.7).

---

## 1 · Measurements I re-ran (my servers, both engines)

### 1.1 G10: the rate across three consumers, the landed tree and its born-RED

`front-rate.spec.ts` was copied verbatim into scratch with one `console.log` added, run on `:4241`,
page A at no-preference. Each cell reads worst burst, interval form, over (frames − 1) / span.

| run | gauge | tally | join | row |
|---|---|---|---|---|
| landed · chromium (native clock) | 49.8/s (12 f) | 47.9/s (17 f) | 50.2/s (26 f) | PASS |
| landed · webkit | 46.5/s (11 f) | 51.4/s (18 f) | 50.1/s (26 f) | PASS |
| landed, **HARD** deal · chromium | 50.5/s | **47.5/s (344 d / 34 f, about 10 d per frame)** | 50.5/s | PASS |
| landed, HARD · webkit | 53.3/s | 50.9/s (356 d / 36 f) | 50.5/s | PASS |
| `FRONT_MIN_MS` 16→0 · chromium native | **135.3/s** | n/a | n/a | **RED** |
| `FRONT_MIN_MS` 16→0 · webkit native | **100.4/s** | n/a | n/a | **RED** |

The gated readings match the prototype's table: 47–54/s gated, and 100–141/s ablated. The tally
the pass-4 critic read at 134.2/s is 47.5–51.4/s here.

The HARD rows are mine and they matter. The landed row deals EASY, where one tally stroke inks:
4 `d` records per frame, 17 frames. So the landed row never exercises the multi-stroke stagger that
the one-clock cure exists for. On HARD, several strokes draw at once (about 10 `d` records per
frame) and the single gate still holds. The cure is right. The shipped row just does not witness
it (§3.5).

`.progress-trace` count: 48 `d` records over 12 frames means 4 per frame, one ring. That matches
the prototype, and the pass-4 "8" does not reproduce at 1280×800.

### 1.2 G10 at a 60 Hz clock: the gate passes an ungated tree (new, §3.1)

I copied the spec with one init script added. It is a JavaScript 60 Hz panel: rAF callbacks fire
on the first native frame at or after each 16.667 ms due time. The shim measured a median tick of
16.0–16.2 ms in chromium and 19.0 ms in webkit.

| `FRONT_MIN_MS` | engine | gauge | tally | join | G10 |
|---|---|---|---|---|---|
| 16 (landed) | chromium | 29.9 | 42.1 | 44.4 | PASS |
| 16 (landed) | webkit | n/a | n/a | n/a | PASS |
| **0 (the budget deleted)** | **chromium** | **60.2** | **60.4** | **60.0** | **PASS** |
| **0 (the budget deleted)** | **webkit** | **58.0** | **61.4** | **58.4** | **PASS** |

With the budget deleted, the row passes in both engines. It reds on this box only because headless
chromium ticks at about 128 Hz and webkit at about 100 Hz. The spec's own header says so ("a
100–135 Hz headless panel re-cuts every frame"), but nothing in the row asserts it.

Instruments:
- `instruments/front-rate-60hz.CRITIC.spec.ts`
- `instruments/g10.sh`, which carried the ablation with an EXIT trap restore and `shasum -c OK`
- `logs/g10.log`

### 1.3 ROW B and ROW C re-read

I ran the prototype's instrument (`p5-rows-bc.mjs`, copied) on my prototype dist `:4243` against
the control `:4242`. I minted my own payload, `ATMuMzQ5NzE4…` (61 givens, read back on both arms),
used ten hints, and the board was not won (valuenow 25).

**ROW B (print).** It settles to `rgb(0,0,0)` in 491–499 ms in all four cells, with the frame at
`rgb(0,0,0)` 12u and the trace at 8u. The +200 ms transients were rgb(9–14, 8–10, 1–2).
Reproduced.

The painted ≥3:1 survivors, print against screen:

| | chromium/light | chromium/dark | webkit/light | webkit/dark |
|---|---|---|---|---|
| my payload | 644 / 2,230 = **29 %** | 1,348 / 2,151 = **63 %** | 1,206 / 2,600 = **46 %** | 1,161 / 1,939 = **60 %** |
| prototype's payload | 644 / 1,982 = 32 % | 659 / 1,893 = 35 % | 726 / 2,543 = 29 % | 179 / 2,205 = 8 % |

So the ballot's number moves with the board (§3.3).

**ROW C (forced colours).** Every ratio matches the prototype to the third decimal:
- trace:frame 1.388 / 1.56 / 1.388 / 13.461 and trace:paper 21 / 21 / 20.632 / 1.122 (chromium light, chromium dark, webkit light, webkit dark)
- HEAD 3.574 / 3.653
- Highlight at 1.258 / 1.022 chromium and 7.597 / 1.277 webkit
- frame→CanvasText gives 1.0

The painted ≥3:1 gauge pixels under forced colours, prototype against control:

| | prototype (on paper + on ink) | control | the loss is where |
|---|---|---|---|
| chromium/light | 1,309 | 1,613 | on ink: 670 vs 1,070 |
| chromium/dark | 1,544 | 3,299 | on ink: 613 vs 2,674 |

The loss sits where the gauge lies over the frame, which is the ratio's story told in paint.

### 1.4 FORK A's "unexplained" control pane, explained (§3.4)

I wrote `instruments/forkA-opacity.mjs`, which imports the prototype's `p5-lib.mjs`. It runs in
light with `prefers-contrast: more` witnessed true, one payload, three hints, then Solve, with the
result polled until settled.

| arm | before the win | at the win |
|---|---|---|
| prototype · chromium / webkit | `rgb(140,105,29)` opacity 1 | `rgb(140,105,29)` **opacity 1** |
| control `74a2b5d9` · chromium / webkit | `rgb(139,92,246)` opacity 1 | `rgb(139,92,246)` **opacity 0** (computed opacity 0) |

The control's index.css:598 has `.solve-success .progress-trace { opacity: 0 }`. That is T4-W9 ROW
1's bow-out: "the violet trace bows out so the gold reward owns the frame". So the control pane's
near-black band is the graphite frame alone, and its caption, "stroke rgb(139, 92, 246) · 1.548:1",
names a stroke that paints nothing.

The prototype's index.css:676 says it is "recut from T4-W9 ROW 1" (the trace now lifts to gold
instead), so the reversal is declared. The crop's caption is what is wrong.

### 1.5 G5, the leave verb, painted (the family's own RED): reproduced to the digit

`p5-g5-verb.mjs` (copied), `:4243` against `:4242`, core median at k = 0.5:

| | light rest | light hover | dark rest | dark hover |
|---|---|---|---|---|
| chromium | 4.62 (0.31 < 4.5) | **4.41 (0.541 < 4.5)** | 5.783 | 5.078 |
| webkit | 4.589 (0.329) | **4.384 (0.57)** | 5.849 | 5.078 |
| control, black verb | 14.933 / 16.724 | n/a | 13.582 / 12.761 | n/a |

Instrument caveat: the control's black verb has 14.5 % of its light core under 4.5 (antialiasing on
a hand face), so the fraction column has a floor. The median does not, and it is under 4.5 at
light hover in both engines. The RED stands.

### 1.6 The corridor spec, and the join re-cut's missing negative control

- **`progress-corridor.spec.ts` whole:** 6/6 chromium (32.6 s) and 6/6 webkit (36.0 s), so 12/12, both born-REDs included.
- **What the corridor reads:** I checked it is the FILL gauge, not the win (`corr-state.mjs`: 20 blanks, 26 presses, valuenow 65, `.solve-success` absent, stroke `rgb(168,126,19)`, 3/3 runs both engines). The row measures what it says.
- **`join-language.spec.ts` whole, chromium, landed:** 3/3 passed.
- **Negative control I added:** `joinFraction` capped at 0.99, so the ring never stands whole. **2 failed / 1 passed**, with both ring rows RED at `toBeGreaterThan(900)`. The `Z`-closure re-cut can fail. The prototype shipped the re-cut without this control (§3.6). Restored with `shasum -c OK`.

### 1.7 Battery, bare (work tree | control `74a2b5d9`)

| gate | work tree | control |
|---|---|---|
| `check-copy-register` (M16) | 0 (0 dashes, 0 unadmitted) | 0 |
| `lint:copy`, `lint:ink`, `lint:lanes`, `lint:theme-tokens` | 0 each | 0 each |
| `lint:sleep` | 0 (36 specs) | 0 (34 specs) |
| `lint:motion` | 0 (36 specs) | 0 (34 specs) |
| `test:e2e:projects` | 0 (561 tests) | 0 (547) |
| `check-pw-projects` | 0 | 0 |
| `npm run lint` (prettier) | 0 | 0 |
| `eslint .` | 0 | not re-run (prototype: 0) |

I did not re-run knip, vue-tsc, the unit suite or filter-census. Their numbers are the prototype's.

## 2 · What holds

- **The three MUSTs are closed on the surface.** MUST 1: the tally is gated, all three consumers are counted in one page, and it holds on a HARD multi-stroke deal. MUST 2: ROW B and ROW C are read settled, restated as dispositions of this family's own rules, and the frame is read in the same pass. MUST 3: FORK A's one cell is framed with a control pane.
- **The corridor's born-REDs observe the thrown text.** The NEAR control (25° in the window, iso-luminant) reds on the HUE row. That is the arm the pass-4 critic left un-demonstrated, and it is now demonstrated and re-run by me.
- **`join-language`'s `ringFront` re-cut is correct and can fail** (my ablation). The pass-4 dash reading returned 1000 on the ring's first frame.
- **One rate primitive.** `frontGate` and `FRONT_MIN_MS` live beside `poseFronts`. The tally's one-clock stagger is an equivalent re-expression: `easeOutCubic(clamp((t − i·90)/dur))` per stroke, the ghost strokes pinned at 1, PRM snapping. The `fronts` computed indexes `strokeFrames[i][f]`, identical to the old `poses[f][i]`. The memo call shape is fixed.
- **G5 is self-reported RED with painted numbers, and the code comment was corrected.** The family reported a red against itself instead of carrying 4.99.
- **Constraints are clean.**
  - M16 (bare exit 0).
  - The undefined-token census over every `var()` the family adds (11 tokens, all declared; the one `var(--motion-…)` hit is a comment).
  - No `@property`, no `--ring-ink`.
  - The diff mints no filter: `.sparkle-icon` swaps two `rgba()` values for two tokens inside the same `drop-shadow`, so filterBudget holds structurally.
  - W2's mechanics are untouched.
  - Nothing is written under `r0/` or `pass1/`–`pass4/`.

## 3 · What is NOT converged (closable sentences, numbers attached)

### 3.1 G10 cannot fail on a clock at or below 62.5 Hz: a gate whose verdict is the host's display

With `FRONT_MIN_MS` = 0, G10 passes at 60.2 / 60.4 / 60.0 in chromium and 58.0 / 61.4 / 58.4 in
webkit under a 60 Hz rAF clock. That is most displays and the usual Linux headless raster. This is
the exact defect pass 3 struck ("a gate whose number is the reviewer's display"). It has moved from
the number to the born-RED.

**To close,** do one of two things, and prove the ablation reds under a 60 Hz shim in the same batch:
- the row installs its own ≥120 Hz animation clock (an init-script rAF driver), so the ablation reds on any host; or
- the row asserts a measured in-page rAF rate ≥ 1.5 × 62.5 Hz as a precondition and fails loudly otherwise.

### 3.2 ROW C: the firing default is the arm that loses to the control, and the other arm is unpainted

The landed `@media (forced-colors: active) .progress-trace { stroke: CanvasText !important }` takes
trace:frame from HEAD's 3.574 / 3.653 down to 1.388 / 1.56. The painted on-frame ≥3:1 pixels fall
670 vs 1,070 (light) and 613 vs 2,674 (dark). So in the gauge's own cell, the forced-colours reader
loses a progress indicator HEAD gave them.

The ballot's default is "what ships", which is that regression. The alternative, keeping the
crayon, is ARITHMETIC (4.08 / 3.71, 3.66 / 3.68).

**To close:**
- paint the keep-the-crayon arm under `forced-colors: active`, both engines, both themes (ablate the rule in its own layer, read the ≥3:1 on-frame and on-paper counts);
- make the firing default the arm that clears 3:1 against BOTH grounds painted, or strike the rule;
- a regression cannot be a ballot's default.

### 3.3 ROW B's "9–33 % survives" is a payload artifact

On the same tree and the same instrument, my payload reads 29 / 63 / 46 / 60 %, and the
prototype's reads 32 / 35 / 29 / 8 %. The stable facts are these: settled `rgb(0,0,0)` at 8u on an
`rgb(0,0,0)` 12u frame (trace:frame = 1.0 wherever they overlap), and the control printing violet
(3,768 px ≥3:1, more than on screen).

**To close,** quote those and the off-frame fraction on at least two payloads, or drop the percentage.

### 3.4 FORK A: the control pane's caption is false, and the ballot has three arms, not two

At the win, the control's trace computes `opacity: 0` in both engines (§1.4). The pane shows HEAD's
bow-out, and the caption "stroke rgb(139,92,246) · 1.548:1" should read "no gauge at the win
(opacity 0)". The owner is choosing among three things:
- bow-out (HEAD)
- lift to gold-star (the default arm, 2.533 on paper under contrast:more)
- gold-ink under contrast:more (4.967)

The README's gap 3 closes on my reading.

**To close:** correct the caption in the README and the ballot row (one line). No re-shoot is needed.

### 3.5 The shipped G10 row witnesses the one-stroke tally only

On EASY, 4 `d` per frame means one inked stroke. The interleave the cure exists for (five strokes'
commits on one gate) is exercised only by my HARD run (10 `d` per frame, 47.5 / 50.9/s).

**To close,** deal a tier whose tally inks at least 3 strokes in the row, and assert `d`/frame > 4 so
the row proves it saw the stagger.

### 3.6 A re-cut gate shipped without its negative control

The `join-language` `ringFront` re-cut is a re-cut gate (§2.10 form), and the prototype banked a
READING ("the same first frame reads 0"), not a born-RED run. My `joinFraction ≤ 0.99` ablation reds
it (2 failed).

**To close,** bank that ablation, or an equivalent, as the row's negative control in the lane's own
record, same batch.

### 3.7 Carried unrun for a third pass

These rows each hold the number:
- G9, the per-anchor census
- goldens
- R6's heading census
- R3's wobble
- F1's two arms, framed
- G3's ΔL band median (still pass 3's +0.0944 / +0.3217)
- `aria-valuetext`

G5 was finally run and is RED (4.41 / 4.384 at light hover). **To close:** one palette arm (no hover
ground, a verb-only deeper red, or ink word with a red box) built and painted ≥4.5 at the core
median in both engines.

### 3.8 The section-fork crops carry a caption the record does not stand behind

- GRAPHITE's in-image "band ink 11.96:1" (chromium) against "6.694:1" (webkit) is a 1.8× engine spread that the README never mentions. The README says only "no chromatic ink".
- The captions are truncated ("valu…").

**To close,** either explain the spread or strike the graphite ratio from the image, and un-truncate
the captions (re-render only; no new crop).

### 3.9 Smaller rows

- The node CORRIDOR row still cannot fail on HEAD's violet (declared; the painted e2e governs).
- `#7D6902` survives in the comment at index.css:472.
- `HandDrawnGrid.vue`'s comment still states the arithmetic "≤74 for the join wash's longest 1,180 ms ring", while the README says the ceiling "is now a count" (25–27 re-cuts per join).
- The wave is over its image cap: `check-evidence-policy` reads **2,870,162 B > 2,097,152 B** at my read, across all lanes. This lane holds 123,014 B. The chair sweeps.

## 4 · Checklist hits

- **Gates that cannot fail:** G10 on a ≤62.5 Hz clock (§3.1), with the ablated tree green both engines.
- **The constraint it forgot:** AA under forced colours. The landed rule regresses trace:frame against the control (1.388 vs 3.574), and the ballot fires it by default (§3.2). G5 is under 4.5 at light hover (§3.7).
- **Unverified gestalt:** FORK A's control caption names a stroke that paints nothing (§3.4). GRAPHITE's in-crop ratio is unexplained (§3.8).
- **The elegant-reduction trap:** "one clock, one gate" is proven on a multi-stroke deal only by the critic (§3.5).
- **Re-cut gate without its negative control:** `ringFront` (§3.6).
- **Not hit:**
  - vacuous convergence (every headline reproduced)
  - spec-cites-itself (the corridor throw is observed)
  - legacy aliases
  - masked fallbacks
  - consumer-less substrate (`FRONT_MIN_MS` is consumed by `frontGate`, the unit row and the spec)
  - the generic default
  - undeclared π (the prototype's hidden-surface π with its control-vs-control 0/0 stands; I did not re-run it)
  - the undefined-token census
  - @property
  - M16
  - filterBudget

## 5 · Verdict: ADVANCE at 83

- **Not BLOCK:** every open row is one precondition, one painted arm, one caption, or one tier switch.
- **Not RETIRE:** the G5 red is a replayed pass-2 hunk the family can cure or drop, and ROW C is a ballot the family itself surfaced.
- **Up four from 79:** the three MUSTs and the six smaller pass-4 rows closed and reproduced.
- **Held at 83 by §3.1 and §3.2:** a leader's gate that passes on a broken tree on a 60 Hz host, and an accessibility regression proposed as a firing default.

**MUSTs for pass 6:**
1. G10's born-RED must be host-independent (§3.1), proven under the 60 Hz shim.
2. ROW C's keep-the-crayon arm painted, and the default re-set to whichever arm clears 3:1 against both grounds (§3.2).
3. G5 cured by one built, painted palette arm.

Then §3.3–§3.6 and §3.8 are one line each.

## 6 · Cross-pollination

1. **A rate gate's born-RED needs a clock above the budget.** Every rate or budget row in the wave (MOT-LADDER, MOT-VERB, the §10 dock) should prove its ablation under a 60 Hz shim, or drive its own fast clock. `instruments/front-rate-60hz.CRITIC.spec.ts` is the shim.
2. **Read computed opacity before captioning a pane with a computed stroke.** A computed stroke is not paint. FORK A's control was `opacity: 0`.
3. **A painted percentage in a ballot row is quoted on two payloads**, or it is a payload artifact (ROW B's 8 % against 60 %).
4. **A ballot's firing default must not be the arm that loses to the control on the same statistic.**
5. **A row that exists to prove an interleave must deal a state where the interleave happens,** and assert that it saw it (`d`/frame).

## 7 · Incidents, self-declared

1. My first delta extraction used `scratchpad/p4base`, a name another lane in this shared scratchpad was also using. I applied ACC-FIVE's `pass4.diff` over their tree at about 20:35:19. They re-extracted at about 20:35:55, which removed my files (the new-file hunks went missing mid-read). I cannot prove their tree carries none of my residue: their re-extraction replaced `src/`, `e2e/` and `scripts/` from the archive (mtime 18 Sep). After that I used only `scratchpad/acc5crit-p5/` and never touched `p4base` again. The owning lane should re-verify its `p4base` if it read `web/frontend/{src,e2e,scripts}` between those times.
2. The first G10 battery ran from scratch specs that could not resolve `@playwright/test`: 8 × "No tests found", no measurement. The ablation window still opened and closed with `shasum -c OK`. I re-ran with `node_modules` symlinked into scratch.
3. My lane dist was built while no ablation was live. I confirmed the minified `frontGate` reads `l-n<16`. Its identity (`index-AcoLTdF9hxbp.js`) differs from the prototype's `Cky9y17EQZU1`. I did not diff them.
4. Both work-tree ablations (`FRONT_MIN_MS` 0; `joinFraction` ≤ 0.99) were restored with `shasum -c OK` by EXIT traps. The control tree was never edited, built or git-touched. Its `build.log` and `.vite-control.config.ts` predate me.
5. The corridor and `join-language` runs used the work tree's own spec files through a scratch config in `web/frontend/.acc5crit/`, now deleted. The dev server's Tailwind scan could see that dot directory. No rate or colour reading depends on dev CSS, and every colour row here ran on dists.

Evidence: `pass5/critique/ACC-FIVE/{instruments,logs}` (60 KB, no images).
