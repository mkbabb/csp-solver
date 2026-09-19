# PASS-2 PROTOTYPE · MRK-LIVE · The living mark

It RUNS. The §3 delta is source in a fresh worktree off HEAD `a8fee1f5`, served on
`127.0.0.1:4238`, and every number below was taken off that server in BOTH engines unless the
row says otherwise. Nothing was measured from an injected overlay: pass 1 injected its cures,
pass 2 shipped them.

- Worktree: `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-36`
  (branch `worktree-wf_8630d340-e56-36`, base `a8fee1f5`). Uncommitted, by instruction.
- Probes `probe/` · logs `logs/` · frames `frames/` · re-pointed r0 instruments `instruments/`.
- Configs: `probe/vite.scratch.config.ts` (private `cacheDir`), `probe/pw.config.ts` (the lane's
  own), `probe/pw.estate.config.ts` (the estate's default minus webServer/globalSetup, at 4238).

## 0 · The replay

`git -C` into the pass-1 worktree is refused by this session's worktree isolation, so the
pass-1 diff was replayed FILE BY FILE (`diff -rq` over `web/frontend`, then `cp`). That is
identical to `git apply --3way` here and the identity was proved, not assumed: `git diff
--name-only aab67b92 a8fee1f5 -- web/frontend` is EMPTY — HEAD moved by docs alone since the
pass-1 base, so no hunk could have conflicted.

Carried: 16 modified files (+279/−88) plus the untracked `FocusRing.vue` (222 lines) — the
pass-1 README's own figures to the byte. `vue-tsc --noEmit` exit 0 on the replay before any
pass-2 edit.

## 1 · The gates

| gate | law | pass 1 | pass 2 |
|---|---|---|---|
| G-LIVE-8 | the living mark turns off nothing else | RED (0 at poses 1–3) | **GREEN** conflict / peer-cursor / hover each `opacity 1` at poses 0,1,2,3; living swap `1,0,0,0 → 0,1,0,0 → 0,0,1,0 → 0,0,0,1`. Identical in both engines |
| G-LIVE-2 | 4 swaps, `1,2,3,0`, last in [375,500], 0 after, PRM 0 | GREEN | **GREEN** chromium first 81ms last 456ms · webkit first 12ms last 381ms; sequence `1,2,3,0`; 0 swaps after 800ms through 3.8s; final pose 0; PRM 0 swaps both engines |
| G-LIVE-5 | every stop ≥3:1 from painted bytes, board stop included | RED at HEAD | **GREEN** board ring vs cell 3.97 light / 3.99–4.00 dark; vs its OWN 0.08 fill **3.62 light / 3.69 dark** at stroke-opacity 0.95 (spec predicted 3.61 / 3.73; dark is 0.04 under, inside the ±0.05 band) |
| G-LIVE-3 | one ring owner, ≥9 stops, bands disjoint ≥1px | RED on pass 1 (1.5px overlap) | **GREEN** 10 stops, exactly one `.focus-ring` each, max error **0.00px**; `.staging-btn` gap **1.25px**, `.guard-keep` **1.25px**, `.guard-leave` **1.00px**, `.drawer-tab` **1.00px** (measured at 393×699 where the tongue exists) |
| G-LIVE-9 | no stop is unmarked | RED on pass 1 (0 rings) | **GREEN** attribute removed + scrollport focused → **1** ring, on `gallery-card-0`, framing error 0.00px, both engines |
| G-LIVE-10 | the ring rings a verb | RED on pass 1 (35,130px² on the container) | **GREEN** `activeElement` is `.guard-btn.guard-keep`; ring **2,740px²** (webkit 2,741) against the verb's 1,663px² box — 1.65×, under the 2× ceiling and under the 3,200px² cap. The ribbon is 35,130px² and is no longer the owner |
| G-LIVE-4 | position bounded in TIME | RED on pass 1 (120Hz landing) | **GREEN** 0.00px after a 240px scroll and 1280→1024; **0** writes per 900ms idle; a real ArrowRight landing travels **352px**, last write **452ms** (webkit 455/468), lands **0.00px** off |
| G-LIVE-11 | the laminate yields | RED at HEAD (13.10 L\*; 2.20/2.50) | **GREEN** selected because-cell ground reads its own selection's L\* to **ΔL\* 0.00** both themes both engines (light 95.58 vs 95.58, dark 9.52 vs 9.52); computed `background: rgba(0,0,0,0)`; rim `color(srgb … / 0.7)`; the one-ground unit test lands (2 new rows) |
| G-LIVE-12 | the seventh rule is gone | RED at HEAD (grep 1) | **GREEN** grep 0 for the rule (two comment mentions re-worded so the grep reads the RULE, not the word); focused cell computes `outline-style: none`, `background: rgba(0,0,0,0)`, `border-radius: 0px` |
| G-LIVE-6 | forced colors + its negative control | RED as first written | **GREEN, and the control fires**: 8/8 stops `outline-style: solid` under forced-colors; with a raised (0,4,0) suppression, **0/8** — the arm CAN go to zero. Chromium only (PW-WebKit does not emulate forced-colors; the row says so rather than claiming parity) |
| G-LIVE-13 | the walk evicts nothing | RED on pass 1 | **GREEN** as a unit test: 30 `generateCellFrames` bakes later the board's `cellRects` is the SAME object; the memo holds two entries; pose 0 is `generateCellRects`' own string |
| G-LIVE-7 | cadence truth | GREEN in pass 1 | **GREEN** zero occurrences of `6.7` in `pencilConfig.ts` |
| G-LIVE-1 | σ over time inside the grid's band | GREEN in pass 1 | **CARRIED, not re-measured** — see gap 1 |

Guards, all green: filter budget **9 / 9 / 9** at 4×4/9×9/16×16, population **19 / 84 / 259**
against r0's 16 / 81 / 256 (exactly **+3**, never +N²), every ghost path `filter: none`;
σ-over-space **0.138 / 0.092 / 0.077**, byte-identical to r0 (the ONLY field that moved in the
whole wobble bank is `found: 1 → 4`, the living cell's three new siblings — σ, maxDev, chord,
scale and `d0` are the same characters); hue census **byte-identical** to
`hue-census-HEAD.txt`; `law-probe.mjs` output byte-identical to `law-probe-HEAD.txt` (no
standing law broken; R1 still RED as worded — MOVED, below); `lint:motion` 34 specs each
declaring its motion; `lint:copy` **0 dashes / 0 unadmitted jargon**; peer-wash population
7 / 20 / 39, unchanged by the one-ground `v-if`.

Suites: `vue-tsc --noEmit` exit 0 · vitest **67 files / 815 tests, all pass** · the estate's own
e2e against this server, both engines: `spoken-gallery` 16, `gallery-guard` 14, `a11y` 30,
`access` 12 — **72 passed, 0 failed**.

## 2 · What the pass-2 delta is

18 files, +400/−113, plus `FocusRing.vue` and one new test file. Over pass 1:

1. `gameCell.css` — the swap re-gated on `.game-cell:has(input:focus-visible)`; tier 2
   stroke-opacity 0.9 → 0.95; the laminate's body yields under selection and under a peer
   cursor, its rim rises to 70%, and the `prefers-contrast` arm presses it back to 100%.
2. `DigitCell.vue` — `.cell-peer` gated `isPeer && !isPeerCursor && !isBecause`, with two unit
   rows.
3. `gridPaths.ts` — `generateCellFrames` leaves the shared cap-24 LRU for a module-local
   two-entry memo, with `gridPaths.test.ts` (3 rows) as its gate.
4. `FocusRing.vue` — the settle bound is a DURATION against `MOTION.boardFoldMs`; the four
   poses key on `{w, h, outset}` instead of the DOMRect; an EXEMPT owner with no
   activedescendant falls through to the first `[role="option"]` rather than to null.
5. `GameGallery.vue` — arming focuses `.guard-btn.guard-keep`; `.gallery-guard:focus { outline:
   none }` dies; `.guard-btn` declares `--focus-ring-outset: 5.5px`. `StagingBand.vue` 5.5,
   `DrawerTab.vue` 6.5. `GameGallery.a11y.test.ts` moves in the same diff (the arming row now
   names the verb; the Tab-cycle row starts one step later because focus already sits on it).
6. `index.css` — the `:219` comment carries BOTH readings and says "one value on purpose";
   the seventh focus rule is deleted.

**One deviation from the spec's own code block, and it is the safer half.** §1.2 gates all
three swap rules on `:has(input:focus-visible)`. The `:nth-of-type(n + 2)` HIDE rule is left
ungated here: it can only ever match a sibling pose, which only the living cell is ever given,
and leaving it unconditional means the extra poses stay hidden through any tick where focus and
the `cellFrames` prop disagree. Gated, that tick paints four stacked rings. Fewer characters
and a smaller blast radius; the law is still in the two rules that decide which pose paints.

## 3 · The frames (4 crops, 144.5 KB total, cited)

| file | what | KB |
|---|---|---|
| `1-living-pose2-conflict-peer-light-chromium.png` | the living cell at pose 2 between a conflicting and a peer-cursor neighbour, 9×9 light, dpr3 — the one frame that shows the swap reaching nothing else | 23.7 |
| `2-staging-ring-outset55-dark-webkit.png` | `.staging-btn` focused, the ring's band 1.25px outside the drawn frame's, dark webkit, dpr3 | 15.5 |
| `3-armed-ring-on-keep-leave-pose2-light-chromium.png` | the armed ribbon: the ring on `keep`, `leave` pinned at pose 2 — the U-10 frame, dpr3 | 59.4 |
| `4-dock-open-chip-focused-393-webkit.png` | the dock sheet open (settled 1,100ms) with a chip focused, 393×699 webkit | 45.9 |

Crop 4 rides dpr2, not dpr3: at dpr3 that one crop passes the 150 KB cap by itself and it is the
optional frame. Named rather than silently shrunk. Crop 3's pose is pinned by toggling the same
`.is-active` class the beat toggles, on the same nodes — no geometry is touched by the pinning.

## 4 · The rows the spec asked for, in numbers

**The armed verb (U-10).** Sampled from the CLICK, not after it. Chromium: `leave` steps
0 → 1 at 106ms → 2 at 232ms → 3 at 356ms → 0 at 482ms. WebKit: 82 / 206 / 326 / 445ms. `keep`
holds pose 0 for the whole window in both. The cost the spec named is confirmed at the DOM:
`keep` is PRUNED (3 of its 4 pose groups `display: none`), `leave` is EXPANDED (all four
`display: inline`, each carrying `will-change: opacity`) for the ribbon's life.

**Mobile.** At 393×699 the tongue is real: box 92×48, outset 6.5, ring ON it to 0.00px, ring
band [5.25, 7.75] against the frame's [1.75, 4.25] — **1.00px** of air, `z-index: 70`. With the
dock open and settled (≥1,100ms), 19 focusables in `.controls-card`: the tightest ORDINARY
control is `.mobile-heading-btn` at **29.19px** (webkit 29.16) against a 4.25px reach; four
`.icon-btn`s sit at exactly **8.39px**, still whole; and `.icon-btn.invite-btn` — the sticky
full-width one — overruns its clipper by **32.20px** (webkit 32.05). That is W2's mechanic,
named here, never asserted WHOLE.

**The deck's masked fallback.** Attribute removed, scrollport focused: one ring, on
`gallery-card-0`, 0.00px. Pass 1 read zero rings on the same route.

**R6 law-probe R1: MOVED.** The probe reads `index.css` for a `.dark` declaration of
`--color-focus-sketch` and reds when there is none. There is none, on purpose, and the rebase
is banked at `../../research/MRK-LIVE/instruments/R6-R1-rebase.diff`. The row is reported MOVED,
never re-cut in place: this run's `law-probe.mjs` output is byte-identical to r0's.

## 5 · Gaps, honestly

1. **G-LIVE-1 (σ over time) is CARRIED from pass 1, not re-measured this pass.** The argument
   that it cannot have moved is strong — `generateRectBoilFrames` and `generateCellFrames`'
   geometry are untouched (only the memo around them changed), and `gridPaths.test.ts` pins
   pose 0 to `generateCellRects`' own string — but an argument is not a measurement, and this
   row was measured in pass 1 and is not measured here.
2. **G-LIVE-6 has no landed home.** The estate has NO forced-colors spec today; the gate and
   its negative control live in `probe/p2proto.probe.ts` (test J), not in `e2e/`. Landing it
   (a new spec, declaring its motion for `lint:motion`) is an execution row, not a pass-2 one.
3. **The dist-bound suites have not run** — `visual-golden`, `filter-census`,
   `wordmark-integrity`, `theme-bake-freshness`, `theme-quadrants`, `throttled-void` all need a
   built dist, and W8 §8.1 holds `dist` fixed. Sequenced, not skipped. **No π claim is made.**
4. **The WebKit 16×16 phone trace was not taken.** Its precondition is a quiet box and this one
   ran three playwright processes and a dev server for the whole session. Pass 1's reading
   (living 2/8/0/0 long frames against a PRM control of 0/2/1/0) stands as the last word, and
   it wanted a quiet box then too. Nothing is banked here rather than bank a bad number.
5. **The deck's goldens will move by 2.5px of ring** at `.staging-btn` and the ribbon. Declared
   in the spec, not re-minted here — a golden re-mint needs a built dist (gap 3).
6. **`logs/G-LIVE-*.json` are not mine.** They are the killed first pass-2 batch's partial bank
   (timestamps 01:49–04:49), left where they fell. Every row in this README cites a file this
   run wrote: `A-`, `B-`, `C-`, `D-`, `E-`, `F-`, `G-`, `H-`, `I-`, `J-`, `L-`, `M-`, `N-`,
   `P-`, `budget-`, `wobble-`.
7. **The spoken-gallery ballot is still open.** Pass 1's re-base (default **(a)**, both forms
   read) is carried unchanged and its 16 rows are green on it. Nothing here resolves the W3
   wave's ownership of that instrument.
8. **`--ring-ink` is untouched** (the chair's §6.1 pass-3 row) and the unselected because-cell's
   2.04 / 2.44 rim is named, not cured — a pre-existing row older than this wave.
