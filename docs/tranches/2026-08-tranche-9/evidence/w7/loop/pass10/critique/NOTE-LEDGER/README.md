# NOTE-LEDGER · pass 10 · CRITIQUE (§7 the note's ledger, batch 2)

The critic did not write the charter or the prototype. Base and π control `74a2b5d9`. Ports: tree `127.0.0.1:4249`,
control `127.0.0.1:4248`. Every scratch archive, log, plant and build sits in the critic's durable scratch dir (the
owner's 2026-10-06 rule), each archive `git init`-ed before any apply. Nothing here is banked; nothing was committed to
main, the lane tree or the control tree. The number is the critic's and is in §0.

## 0 · Verdict and gaps first

**87 (92 → 87; union 86), ADVANCE.** The full verdict is §9, the control §9a, WebKit (UNREAD) §9b. Gaps G1–G7 are
numbered in the order the evidence below proves them. G3 (the gap-10 cure regresses the caption law, tree and union)
and G7 (the bank's CI lint:ink exits 1 and costs ~20×) weigh most.

## 1 · The bank, re-derived (every apply in an archive with its own `.git`; the git dir printed per line)

| step | git dir | paths | rc | tree |
|---|---|---|---|---|
| `git archive 74a2b5d9` (fresh `git init`) | `<scratch>/base/.git` | — | — | `243fbf57` (= 74a2b5d9's tree minus its one gitlink; the lane's archive tree is the same) |
| + `instruments/homes.diff` (sha1 `07257854`) | `ac-A/.git` | 13 | 0 | `7e0d4236` |
| + `prototype/NOTE-LEDGER/pass10.diff` (sha1 `86ad0272`, 163,253 B, 15 files) | `ac-A/.git` | 15 | 0 | **`b91ac674`** = BANKED.txt |
| `pass10.diff` `--check` on bare `74a2b5d9` | `ac-A0/.git` | 15 | **0** | |
| `pass10.delta.on-WAVE.diff` `--check` on bare `74a2b5d9` | `ac-A1/.git` | 5 | 1 (expected, WAVE-cut) | |
| + `pass9/integrate/s13-s7-s3.diff` (sha1 `280bd910`) | `ac-S13/.git` | 108 | 0 | `e33d791d` |
| → `pass10.delta.on-WAVE.diff` `--check` on s13-s7-s3 | `ac-S13/.git` | 5 | **0** | |
| → `pass10.diff` `--check` on s13-s7-s3 | `ac-S13b/.git` | 15 | 1 (a 74a2b5d9 cut; the delta is the s13 route) | |
| + `pass9/integrate/WAVE.diff` (sha1 `b3725e4f`) | `ac-WV/.git` | 187 | 0 | `044284b5` |
| → `pass10.delta.on-WAVE.diff` `--check` on the bare WAVE | `ac-WV/.git` | 5 | **0** | |
| WAVE + `homes.on-WAVE.diff` (`0723d508`) | `ac-U/.git` | 10 | 0 | `72b7ad67` |
| + NOTE-ERASE `pass10.delta.on-WAVE.diff` (`d2a2752c`) | `ac-U/.git` | 4 | 0 | **`a0be129a`** (the declared base) |
| + this delta (`39ccf2ba`, 28,200 B, 5 files) | `ac-U/.git` | 5 | 0 | **`05ed6ead`** = BANKED.txt |

- **The work tree is the bank.** Through a temporary index the lane tree reads 28 changed paths; every one is
  `cmp`-equal to `74a2b5d9 + homes.diff + pass10.diff` (0 differ). Its own tree id (`b19c3162`) differs from `b91ac674`
  only by HEAD's gitlink, which `git archive` drops.
- **Homes v3 by sha, residual 0.** The 13 home paths and the 15 bank paths share no path; the bank carries no home.
- **The interdiff over the pass-9 bank** (`ffae10c5` applied → `39176c61`, compared path by path) is the 5 files
  BANKED.txt names: `e2e/note-reserve.spec.ts` +80/−20, `scripts/check-font-coverage.mjs` +54/−3,
  `scripts/check-ink-pressure.mjs` +34/−196, `src/games/shared/GameBoard.notes.test.ts` +18/−0,
  `src/games/shared/GameBoard.vue` +11/−4. Re-derived to the line.
- **Scratch greps**: the two banks and the PROPOSED read 0 for `scratchpad`, `/private/tmp`, `/tmp/`,
  `.claude/t9-scratch`; 0 dot-dir `+++` paths.
- **Record defect (G1): the lane's README §4 names a superseded bank.** It cites `pass10.diff` `52e3e45b` (163,028 B,
  +2,664) and the delta `fc93e446` (27,975 B, +195) → `e2a16d2d`. The files on disk are `86ad0272` / `39ccf2ba` →
  `05ed6ead`, which is what BANKED.txt and the return say. The README's replay section is stale by one re-cut.
- **Record defect (G2): the tree's REST=SPOKEN rows were read on a build that is not the bank.** The lane's tree dist
  `index-KD4Vrhm9tM1C.js` was built at 19:22, before the gap-10 cure landed in `GameBoard.vue`: its JS carries no
  `sort().join(",")` (the givens key), and GameBoard's scope id is `data-v-f1be30d4`. The bank builds to
  **`index-CV0eibVJWPsn.js`** (critic build, from `ac-A` with its own `.git`; CSS 7 files, `index-h50yp6MLm77t.css`
  95,591 B; GameBoard `data-v-ad0896e0`). The union's build `index-Civp23kUC8a7.js` does carry the key. The tree
  column in the lane's §1 row 2 and §2 is therefore a reading of an unbanked tree; the critic's tree rows (§4) are on
  the bank's own build.

## 2 · Gap 10's cure trades a one-flush hole for an unbounded one (G3, the class cure)

The cure replaces the flush memory with `spokeFor`, the givens' **cell set** the 0→N arm spoke for, cleared only when
the generation arm next runs. The key names cells, not an arrival: a later deal whose givens sit on the same cells
reads as "the same arrival", and nothing bounds the memory's lifetime. The critic's plant (unit, the lane's own
harness, `once()` = BoardHost's copy shape): the first board lands (sentence), a hint speaks (`only 4 fits here`),
then a re-deal on the same cells with its generation bump. The caption law says the deal empties line one.

| tree | `GameBoard.notes.test.ts` + the critic's two rows | g10x (same cells) | g10y (other cells, negative control) |
|---|---|---|---|
| pass-10 bank (`74a2b5d9 + pass10.diff`, `GameBoard.vue` `cmp`-equal to the bank) | **exit 1**, 1 failed / 21 | **RED**: `the re-deal empties the live line: expected 'only 4 fits here' to be ''` | GREEN |
| pass-9 bank (`ffae10c5` applied) | exit 0, 20 / 20 | GREEN | GREEN |

vitest single file, `guarded --light`, maxWorkers 2, 1.48 s. The hint survives a re-deal over a board nobody has
seen: the exact species pass 9's ledger measured (`logs/deal-chromium.json`: "that's a given clue" / "only 1 fits
here" survived a re-deal), re-opened by the cure, RED on pass 10 and GREEN on pass 9. Whether the product reaches it
depends on the deal: sudoku deals from `TEMPLATE_BANK[n][tier]` (20 dug boards per tier), and the crate applies "a random
symmetry transform" (`csp-solver/src/puzzles/sudoku/generate.rs:195`), so a same-cells re-deal on sudoku needs the
identity transform on the same template: reachable, but rare. The critic didn't prove it in paint, so the row is a
unit-level class hole that weighs on the number as a regression of the caption law's harness, not as a painted
defect. Either way, the lane's
own test (`the late bump is the same arrival`) and g10x are the same props shape apart from the Set's identity and
an intervening hint: a key on the cell set can't tell them apart. A cure keyed on the arrival itself (a counter
bumped by the 0→N arm, or the Set's identity) would.

## 3 · Rows 1/2/6 at source: C1–C6 re-derived, and the class read with siblings (G4, the denylist)

lint:ink BARE (`node scripts/check-ink-pressure.mjs`, `guarded --light`), on `74a2b5d9 + pass10.diff + homes.diff`
(every bank and home path `cmp`-equal to the work tree), one rule appended to `MarginNote.vue`'s `<style scoped>`
per row, the file restored `cmp`-equal after the battery (20:40:21). 11–14 s a read; load 8.7 → 9.6.

| plant (one rule on `.margin-note-ink` unless named) | lint:ink | reading |
|---|---|---|
| clean | 0 | |
| C1 `padding-block: 6px` | 1 | R4 390×844 reserve 20.8 < line 32.8 |
| C2 `font-size: 30px` | 1 | < 39 |
| C3 `.margin-note:has(.margin-note-ink){padding-top:8px}` | 1 | < 28.8 |
| **C4** `.margin-note-block > p > span{margin-top:10px}` | **0 — MISS** | (the lane's own finding: the homes' renderless parent) |
| C5 `vertical-align: 12px` | 1 | < 29.6 |
| C6 `line-height: 2.2` | 1 | < 35.2 |
| **S1** `border-block: 6px solid transparent` | **0 — MISS** | the ink is `display: inline-block` (MarginNote.vue:310), so its border grows the line box like C1's padding |
| **S2** `font: 30px/1.2 serif` (the shorthand of C2 + C6) | **0 — MISS** | C2's longhand reds; its shorthand reads clean |
| S3 `::after{content:"";display:inline-block;height:40px}` | 1 | < 42.4 |
| **S4** `display:inline-block; min-height: 44px` | **0 — MISS** | |
| **S5** `zoom: 1.6` | **0 — MISS** | |
| **S7** `.margin-note-block:has(.margin-note-ink){padding-bottom:8px}` (C3 one wrapper over) | **0 — MISS** | C3 reds only on `.margin-note` |
| S8 `padding-top: 12px` (C1's longhand) | 1 | < 32.8 |
| S9 `font-size: 1.9em` | 1 | < 39.52 |

Born-RED side, same sitting: the pass-9 bank (`ffae10c5` applied) reads clean 0 and **C1 0** (the hole the pass-9
critic found). C1–C6 reproduce the lane's 5/6 exactly. But the gate is cured for its six plants and not for their class: five of
eight one-rule siblings read 0 (S1, S2, S4, S5, S7). Two of them (S2, S7) are a spelling or one element away from a
row the lane reds. That is LAWS P9 §F's denylist: the reserve read admits growth by property name, not by the line
box the voice's subtree paints. registry-v8 §2.12 makes the class OPEN. In paint: the critic's second chromium run
(§4) reads these siblings on the bank's build.

**G3 on the union.** The same two rows on the union archive (`05ed6ead` = WAVE + homes v3 + ERASE10 + this delta;
the delta's GameBoard.vue is the lane's hand port): **exit 1, g10x RED** (`expected 'only 4 fits here' to be ''`),
g10y GREEN. With the delta reverted (`a0be129a`, ERASE's flush memory): **exit 0, 20/20**. So the delta brings the
hole onto the union too. The test file was restored `cmp`-equal and the archive re-read `05ed6ead`.

**lint:sleep (pick 21), re-derived.** Born-RED in the same sitting: the pass-9 bank (`ffae10c5` applied) reads
`--self-test` **exit 1** on `note-reserve.spec.ts:305` and `:357`. On the bank (`ac-A`): `--self-test` **exit 0** ("no fixed-duration wait precedes
a one-shot assertion on a live surface across 35 specs"), 4 s. On the union `05ed6ead`: **exit 1**, one red only:
`count-yield.spec.ts:302` (SIX's 500 ms in `across()`). LEDGER's `:305`/`:357` are gone on both. Pick 21 is met for
LEDGER's half. The union stays red on SIX's half, which isn't this lane's row.

**Row 5, MUST_CLOSE by reach, re-derived** (`test:font-coverage` on `ac-A`): `--self-test` **exit 0** (NARROW 1
finding, CONTROL pinned 2, tree 0); `FONT_SABOTAGE=reach` **exit 1** (`BAD … NARROW: 0 finding(s)`, pin 2 unmoved);
bare 0. That's born-RED through the pin, not the vacuity row: MET. On the union `05ed6ead`: `--self-test` **exit 1**, NARROW 1
finding, and the red is `BoardHost.vue <component :is="spec.furniture.cell"> binds cursor-name, cell-frames past its pin's
bind set`. That's the WAVE's own red, which the lane reads present without the delta. The critic didn't read the
no-delta side. The union's notes + MarginNote unit files: 21/21, exit 0. The critic's spelling plant (all five GameBoard.vue `setMargin("…")` call sites re-quoted to single quotes, the reach
set's own regex keyed on double quotes): `--self-test` **exit 1**, `CONTROL — the flags and the tree as they stand: 4
finding(s)` BAD. The spelling doesn't slip through, because the tree's own coverage reds. File restored `cmp`-equal. No gap.

**M16** (`lint:copy --self-test`): exit 0 on the bank. **filterBudget**: no `<filter>` added anywhere in `src/`
(count equal to `74a2b5d9`). **@property**: the bank adds `@property --motion-*` registrations (pass-9 content,
§13's stub). This pass doesn't touch them, and the pass-9 critic's tree breach (cpb 1/1/1, on-WAVE 0/0/1) wasn't
re-read: carried, charter gap 8.

## 4 · Row 2 in paint: REST=SPOKEN on the bank's own build, the lane's window against a fixed 3.5 s tail (G5, G6)

**Rig.** Tree = the critic's build of `ac-A` (`74a2b5d9 + homes.diff + pass10.diff`, own `.git`), `index-CV0eibVJWPsn.js`,
CSS 7 files (`index-h50yp6MLm77t.css` 95,591 B served 200), `vite preview` on :4249 under `guarded --timeout 90`
(recorded PID, cwd checked). The spec is the critic's superset `note-crit10.spec.ts` (sha1 `1bc57015`, scratch only, never
banked). The lane's file is unchanged except for three things. (1) The sampler keeps running to 3.5 s after the
keypress. The lane's verdict is computed on its own frames (`laneN`, the frames it had when `heightAtRest` + `settle`
closed), and the critic's is computed on the whole 3.5 s. (2) Three critic arms: **c8css**
`.board-shell:has(.margin-note-ink){margin-top:12px;transition:margin-top 0s 2s}` (a growth whose clock is a running
transition on an ancestor, outside the strip's `getAnimations({subtree})`), **c8js** (a MutationObserver sets
`.board-margin` `padding-bottom:12px` 2.0 s after the sentence appears: a JS-clocked growth, no animation at all), and
**docOnly** `body:has(.margin-note-ink)::after{display:block;height:2000px}` (grows the page; strip and board
untouched). (3) The disjunct-sabotage verdicts, printed per row with the lane's `still()` re-evaluated with each
clause zeroed (`noDoc`, `noStrip`, `noBoard`). Chromium, workers 1, one browser, a context per cell. **4 failed / 3
passed, exit 1 (4.3 min)**. The 4 failures are the 4 `rest = spoken` tests, failing only on c8css/c8js, the lane's
gate reading them still. Load 8.63 → 8.47, zone inuse 106,590 → 186,266 (zone leak ARMED by the reaper at 20:28:52,
slope ~100/s, under 8M).

**The lane's own arms reproduce exactly on the bank's build** (chromium):

| cell | clean (light, dark) | double | c7 (moved frames) | edge-in / edge-out |
|---|---|---|---|---|
| 390×844 | s 0.00 b 0.00 d 0 over 104/103 | 14.39 b 7.20 | 12.00 b 6.00 (30, 30) | 0.39 still / 0.59 moved |
| 844×390 | 0.00 / 0.00 / 0 | 15.30 d 16 | 12.00 d 12 (31, 31) | 0.39 d 1 / 0.59 d 1 |
| 360×800 | 0.00 / 0.00 / 0 | 14.39 b 7.19 | 12.00 b 6.00 (31, 31) | 0.39 / 0.59 |
| 1280×800 | 0.00 / 0.00 / 0 | 16.34 d 11 | 11.98 d 6 (30, 30) | 0.38 / 0.58 |

The lane's window is 102–105 frames. The clean page stays still over the whole 3.5 s too (421 frames, 0.00/0.00/0 in
all 8). The row's clean reading is real.

**G5: the window closes on the strip's own animations, so a growth on any other clock passes** (chromium, every
cell, both themes):

| arm | lane window: frames · s / b / d | lane verdict | 3.5 s: s / b / d · moved | critic verdict |
|---|---|---|---|---|
| c8css 390×844 (L, D) | 102–103 · 0 / 0 / 0 | **still (GREEN)** | 0 / **6.00** / 0 | moved |
| c8css 844×390 | 103–104 · 0 / 0 / 0 | **still** | 0 / **12.00** / **12** | moved |
| c8css 360×800 | 103 · 0 / 0 / 0 | **still** | 0 / **6.00** / 0 | moved |
| c8css 1280×800 | 103 · 0 / 0 / 0 | **still** | 0 / **6.00** / 1 | moved |
| c8js 390×844 | 103–104 · 0 / 0 / 0 | **still** | **12.00** / 6.00 / 0 · 180 frames | moved |
| c8js 844×390 | 103–104 · 0 / 0 / 0 | **still** | **12.00** / 0 / 12 · 180 | moved |
| c8js 360×800 | 103–104 · 0 / 0 / 0 | **still** | **12.00** / 6.00 / 0 · 180 | moved |
| c8js 1280×800 | 103 · 0 / 0 / 0 | **still** | **12.00** / 0 / 6 · 180 | moved |

16 of 16 cell-theme readings: the board or the strip moves 6–12 px after the sentence, and the row reads still. The lane
declared this in its §0 ("a non-WAAPI growth starting after the strip rests"). Declared isn't closed: the gate's
window is the subject's own rest (LAWS P9 §F, "a bound that scales with its subject"), and the union carries a JS clock
on the voice (ERASE's drop clock writes line two after its rung; the critic did not census every timer). The pass-9 critic's fixed 2.5 s window would have
caught c8js and c8css at ≤ 0.5 s after the text. The row needs a fixed floor on the window (≥ the longest product clock
on the voice + one rung), or a document-wide `getAnimations()` plus a timer census, with c8css/c8js as in-run
negatives.

**G6: two of the row's three disjuncts have no plant in the lane's battery** (LAWS P9 §F, a plant per disjunct).
Across all 32 lane-arm readings, `noDoc` equals the verdict in every row, and so does `noBoard`. Deleting the docH
clause or the boardTop clause flips no arm. Only `noStrip` flips (double, c7 and edge-out at 844×390 and 1280).
The lane's README calls docH "born-RED in-run where the page scrolls", but every arm that moves docH (`double`,
`c7`, the edges) runs with `doc: null`, so the clause isn't evaluated where it would bite. The critic's docOnly
plant shows the clause works when it's planted (d 1,980–2,000, strip/board 0, `noDoc` → still in all 4 cells). The
clause can fail, and the lane's battery never makes it. No arm reds through the board alone inside the window,
in either battery.

## 5 · The PROPOSED `renderless` and row 3's cost (G7, the bank ships lint:ink red)

**PROPOSED-homes-renderless.diff** (sha1 `1d44c587`, 2,694 B) on `ac-A0` (= the bank + homes v3, own `.git`):
`--check` 0, applied 0. lint:ink bare with C4: **1** (R4 390×844 reserve 20.8 < 30.8). With S7: 0. With S1: 0.
With S2: 0. `shape-census --self-test`: exit 0, **157/157, clauses planted 101/101** (3 s).
`SHAPE_SABOTAGE=renderless --self-test`: **exit 1, 156/157**, the one FAIL being R1. `shape-census.mjs` and
`MarginNote.vue` were restored `cmp`-equal to the bank. `--sabotage-battery`: **exit 0, 101/101 clauses red the self-test when deleted** (13 s). The lane's numbers reproduce.
The PROPOSED's tag disjunct keys `attrs.has("tag")`. The critic didn't read whether a bound `:tag` counts, and
`<Teleport>` isn't in its list. Neither has a row (unplanted, low weight). The PROPOSED cures C4 and no
sibling (S1, S2, S4, S5, S7 stay 0; §3).

**The bank's lint:ink is RED in CI as banked.** CI's `frontend` job (`.github/workflows/ci.yml`, `timeout-minutes:
20`) runs `npm run lint:ink` = `check-ink-pressure.mjs --self-test`. The self-test fails when any reserve plant reads
GREEN, and the critic's bare read of the C4 plant on the bank's own bytes is 0 (§3). So the self-test's C4 row is
vacuous and lint:ink exits 1 on the bank until a homes fold the bank doesn't carry lands. That's the lane's own
reading (exit 1), re-derived here by construction from the C4 bare read, not by re-running the 1,301 s self-test. A
bank whose CI gate is red until a sibling lane's PROPOSED folds is not shippable as banked: the C4 plant row should
ride with the PROPOSED, or the PROPOSED is a precondition named in the replay route as a hard step, not an optional
"for C4 at source" line.

**Cost.** The lane's self-test took 1,301 s, against the charter's 2 × 64 s = 128 s, and against CI's 20-minute job
budget, which also has to cover `npm ci`, vue-tsc, eslint, knip, prettier and the other self-tests. The critic's bare
lint:ink reads 11–14 s per pass (15 reads, §3). The self-test runs clean + ~50 plants + the library-clause battery,
so even at the bare cost it sits at hundreds of seconds. The 1,301 s itself wasn't re-run (it would hold a heavy slot
22 minutes on a saturated box). The charter's row 3 bar (≤ 2× of 64 s) is RED on the lane's reading and on the
critic's arithmetic. LAWS P9 §I: batch 0 refuses a diff whose self-test exceeds 120 s. The collapse onto the ONE
reader moved the cost into CI's lint:ink instead of curing it. **G7: the bank makes CI's `lint:ink` step ~20× slower
and exit 1.**

## 6 · The chair's picks and the batch gate, judged

| pick / gate | the lane's return | the critic's reading | judged |
|---|---|---|---|
| **PICK 21** lint:sleep `note-reserve.spec.ts:305/:357` | cured on `heightAtRest`/`atRest`, born-RED 1 → 0 | bank `--self-test` exit 0, no LEDGER row on the union (§3 addendum). The two waits are now the library's, which is the cure the law names. But the same move put the row's whole verdict window on `heightAtRest` (G5) | **MET** (the sleep). The window it bought is G5 |
| **PICK 4** G-LIFE: the seat governs, one write on the hint path 4/4 both engines on the union, beside SIX's re-authored row | "NOT RE-READ by me", carried from v9 | not read by the critic either (SIX's row and the union's count spec are SIX's lane's to serve; the critic's slots went to §7's own rows) | **NOT MET this pass** (carried, unread) |
| **Pick 13** `spoken-gallery:254` | untouched | owned by ablation at pass 10's s13 integrator; MOT-LADDER holds it until then. Not this lane's to close at batch 2 | **N/A at this batch** (open at s13) |
| **§8.1 row**: C1–C6's class at the reserve arm | 5/6 + PROPOSED for C4 | 5/6 reproduce; 5 of 8 one-rule siblings read 0 (§3) | **NOT MET** (the class is open) |
| **§8.1 row**: the whole-window sampler bounding docH | landed | the window is the strip's own rest: c8css/c8js GREEN 16/16 (G5); docH and boardTop have no plant in the battery (G6) | **PARTLY** (the sampler is real for growth on the strip's own animations, and docH is asserted. The window and two disjuncts are open) |
| **§8.1 row**: RECT at the count-laid pose with SIX (G-ABS) | NOT READ | not read | **NOT MET** |
| **Batch gate**: count-yield 4/4 on the union | not read (SIX's) | not read by this critic | **UNREAD** (SIX/GRAPHITE's) |
| **Batch gate**: GRAPHITE's six-rig read or BANK | not read (GRAPHITE's) | not read | **UNREAD** (GRAPHITE's) |

## 7 · The rows neither the lane nor the critic read (charter "what pass 10 must close")

- **Row 3 / charter 3**: the ONE reader's cost (G7). The 6/6 literal deletions on the ONE reader weren't re-run by
  the lane or the critic.
- **Row 7 / charter 5**: T9-B-LEDGER's frame isn't re-cut. No crop was shot, so the critic has **no frame to look
  at**, and 0 B of the 102,698 B headroom was spent. STEP is struck to numbers in the caption text only. CHAIR §16
  ("no caption lands without its reshoot") makes the struck-STEP caption a caption without a reshoot: the frame
  stays OPEN.
- **Row 8 / charter 6**: the 2lh seat wasn't re-measured by a non-author, the ballot is unframed, and the berth
  isn't booked.
- **Row 10 / charter 7**: glyph-text through glyph-pop at its home, the 8/8 union cell-runs and pop-49 weren't run.
- **Row 9 / charter 9**: ERASE's running fence rides by sha (`d2a2752c`), but its class plants weren't read at ≥ 5
  runs per engine on 2f11714f or 954bbbab.
- **Row 11's @property half**: the pass-9 tree breach wasn't re-read.
- **§8.1 RECT at the count-laid pose; PICK 4's one write**: not read (§6).
- **Gap 12 by a non-author**: the critic re-derived lint:sleep, font-coverage (self-test, reach sabotage, bare),
  lint:copy (M16), lint:ink bare ×15, the gap-10 unit file on three trees, and the REST=SPOKEN row in chromium. The critic
  also re-ran, on `ac-A` (the bank + homes, `guarded --light`): `vue-tsc -b` **0** (8 s), `typecheck:e2e` **0**, eslint
  on the five interdiff files **0**, prettier `--check` on the four non-e2e ones **0**, knip **0**, vitest `MarginNote.test.ts` + `GameBoard.receipt.test.ts` + `GameBoard.notes.test.ts` **0** (52/52 =
  2 + 31 + 19, the lane's counts). The full unit
  battery, chunked by directory (`guarded --light`, maxWorkers 2, while the browser rows queued): composables **16/16**,
  pencil **75/75**, games **762/762** (57 files, 27 s), all exit 0. That's **853/853**, the lane's count, re-derived.
  (`--light` on a directory chunk is a declared stretch of "quick command": 6–27 s each.)
- **The machine law in the banked spec**: `note-reserve.spec.ts` closes its contexts with a bare `await
  ctx.close()` (lines 222, 256, 445) and has no `finally`, so a hard `expect` (`r.rested`) before the close
  leaves the context to the browser's teardown. Low weight, but the law says a `finally`.

## 8 · The critic's incidents, self-declared

1. **A `git commit` in a scratch archive (LAWS P8 §A: never commit anywhere, a scratch repo included).** The first
   `base` archive's setup ran `git init && git add -A && git commit`. It touched only that archive's own `.git`
   (main, the lane tree and the control tree weren't touched). That `.git` was moved to `trash/` at once and the
   archive re-`init`-ed with no commit. Every later tree id is from `git write-tree` on an index, and every touched-path
   count is a diff against the base tree `243fbf57`.
2. **The first chromium launch read nothing**: the scratch spec dir had no `package.json` with `"type": "module"`, so
   `./lib/rest-probes.mjs` (it uses `import.meta`) failed to load ("No tests found", exit 1). Fixed, relaunched; the
   failed log and its exit file are in `trash/`.
3. **Temporary-index blobs**: hashing the lane tree (`GIT_INDEX_FILE` in the scratch dir, `git add -A web/frontend`)
   wrote blobs into the shared object store. No ref moved; same class as the §3/§4 folds' declared blobs.
4. **A `node_modules` symlink entered the union archive's index** (`git add -A` takes a symlink named `node_modules`;
   the archive read `aa2cde99`/`861638ee`). It was dropped from the index (`git rm --cached`) and the archive re-read
   **`05ed6ead`**. The symlink is a build convenience and never left the scratch dir.
5. **The control server never got a heavy slot** (`guarded` queue head from 20:34; all five heavy slots were held by
   long-lived servers: value.js, gregg, a sibling's control preview from `w7-control` (pid 55631, not ours, not
   touched), ACC-GRAPHITE's scratch server, and the critic's own tree server). The control server got its slot at
   about 20:48. Its chromium column is §9a, and its WebKit column is UNREAD (§9b). The lane's control reading (`index-CubiZsMVSwTc.js`, chromium 7 failed, exit 1) is
   cited as the lane's, not re-derived.
6. **The kernel zone leak was ARMED** at 20:28:52 by the reaper (slope 30–105/s). inuse was 36,211 → 216,621 across
   this sitting, so every browser row opened far under 8M. The guard's message asks that it be reported: the owner
   decides on the reboot.

## 3b · G4 in paint: the five siblings lint:ink reads 0 all move the strip (chromium, the bank's build)

`note-crit10c.spec.ts` (sha1 `b5ef9b77`; the §4 superset plus the five siblings, each scoped like the lane's
`DOUBLE`, light only, `ARMS_ONLY` filtering to clean + siblings) on :4249 `index-CV0eibVJWPsn.js`. **4 passed, exit 0
(2.3 min)**: every sibling reads moved in every cell, and clean reads still in both themes. Load 11.47, zone inuse
236,197. Max |Δ| over the lane's own window (frames 102–104):

| plant (lint:ink at source) | 390×844 | 844×390 | 360×800 | 1280×800 |
|---|---|---|---|---|
| S1 `border-block: 6px solid transparent` (0) | s **12.00** b 6.00 | s **12.00** d 12 | s **12.00** b 6.00 | s **11.98** d 6 |
| S2 `font: 30px/1.2 serif` (0) | **15.20** b 7.61 | **13.91** d 14 | **15.20** b 7.59 | **12.38** d 7 |
| S4 `display:inline-block; min-height: 44px` (0) | **23.20** b 11.61 | **21.91** d 22 | **23.20** b 11.59 | **20.38** d 15 |
| S5 `zoom: 1.6` (0) | **12.47** b 6.23 | **13.27** d 14 | **12.47** b 6.23 | **14.17** d 9 |
| S7 `.margin-note-block:has(.margin-note-ink){padding-bottom:8px}` (0) | **8.00** b 4.00 | **8.00** d 8 | **8.00** b 4.00 | **7.98** d 2 |

Every sibling paints +8 to +23 px on first speech, and lint:ink reads 0 for all five at source. The e2e row catches
them, but CI is browserless (O-12), so lint:ink is CI's only reserve arm, and there the class is as open as pass 9
left it, by five fresh spellings. The charter's row 1 asked for the voice's "box-growing properties" read on the
descendants and the ancestor chain. The tree reads a property list, which is the denylist species LAWS P9 §F names.
WebKit: §9.

## 9 · The number: 87 (92 → 87; union 86), ADVANCE

**What is real** (re-derived by the critic). The bank is byte-exact and apply-checks on every tree it claims. Homes v3
is applied by sha with residual 0. The clean page is still across a whole 3.5 s window in all 8 chromium cell-theme
readings, docH included, on the bank's own build. C1–C6 read 5/6 at source. Pick 21's sleeps are gone (lint:sleep 0
on the bank). MUST_CLOSE is keyed on reach, born-RED through the pin, and the spelling plant reds. The PROPOSED
`renderless` reproduces (157/157, sabotage 156/157) and cures C4. Gap 12 is now non-author for the unit battery (853/853), vue-tsc,
typecheck:e2e, eslint, prettier, knip and M16.

**What the critic proved open:**

| gap | what | weight |
|---|---|---|
| **G3** | the gap-10 cure keys the arrival on the givens' cell set with an unbounded lifetime: g10x RED on the bank and on the union (a hint survives a same-cells re-deal), GREEN on pass 9 and on the union without the delta. A regression of the caption law's harness, introduced by this delta | −2 |
| **G7** | the bank's CI `lint:ink` (`--self-test`) exits 1 as banked (the C4 row, until a sibling's PROPOSED folds) and costs ~1,301 s in a 20-minute `frontend` job. Row 3's ≤ 128 s bar is RED by ~10× | −1.5 |
| **G4** | the class at CI's only reserve arm is open: 7 of 13 one-rule siblings read lint:ink 0 (S1 border-block and its longhand border-top, S2 the `font` shorthand, `font-size: larger`, S4 min-height, S5 zoom, S7 the `:has()` pad one wrapper over). The five painted move +8 to +23 px in every chromium cell, on the tree, the control and the union's source. A property denylist, not the voice's line box | −1 |
| **G5** | REST=SPOKEN's window is the strip's own rest: c8css (an ancestor's delayed transition) and c8js (a JS-clocked +12 px) read still 16/16 while the board/strip move 6–12 px inside 3.5 s | −0.5 |
| **G6** | docH and boardTop have no plant in the lane's battery: `noDoc` and `noBoard` equal the verdict on all 32 lane-arm readings (the critic's docOnly shows docH can bite) | (inside G5's weight) |
| G1, G2 | the README's §4 names a superseded bank (`52e3e45b`/`fc93e446`); the tree's spoken rows were read on a pre-cure build (`index-KD4Vrhm9tM1C.js`, not the bank's `index-CV0eibVJWPsn.js`) | record; no number, the rows reproduce on the bank |
| carried | rows 7 (no frame; CHAIR §16), 8, 10, 9 (≥ 5 runs/engine), RECT at the count-laid pose, PICK 4's one write, @property's tree breach, the lane's WebKit column | held at pass 9's price |

The union is 86, one under the tree: it carries G3 through the hand port, its lint:sleep is red (SIX's `:302`, not
LEDGER's), and ERASE's fence rides by sha into a §7 whose own critic holds row 1's class open (NOTE-ERASE 89).

**Verdict: ADVANCE.** The family's idea holds in paint, and the work is a real step: four of thirteen pass-9 gaps
closed and reproduced. But the bank can't fold as banked (G7). It needs the renderless fold as a hard step, or
C4's plant row moved to ride with it. G3 must be re-keyed on the arrival itself before any union reads it. Pass 11
owes: a class read of the line box (not a property list) with S1/S2/S4/S5/S7 as plants; a window with a fixed floor
and c8css/c8js as in-run negatives; a plant per disjunct (docOnly, a board-only plant inside the window); the arrival
key with g10x as the born-RED; lint:ink's self-test inside 128 s; and rows 7/8/10/RECT/PICK 4 read in both engines.
§7's leader is the higher of this 87 and ERASE's 89, so ERASE leads §7 on the number at this pass.

## 10 · π, AA and the constraints

- **π (vs `74a2b5d9`)**: the pass-10 interdiff's only product-source change is GameBoard.vue's script (+11/−4, the
  arrival key). No CSS rule moved. The served CSS differs from the lane's pre-cure build only by GameBoard's scope
  hash (`data-v-f1be30d4` → `data-v-ad0896e0`, the hash of the changed SFC). The painted π of the cumulative bank is
  pass 9's (the control's empty voice paints at 0 height; its clean spoken strip moves at 844×390 and 1280). Those
  are the lane's control readings, not re-derived: the critic's control column is in §9's addendum. The one
  behavioural pixel this pass moves undeclared is G3's: the hint's sentence left standing over a same-cells re-deal.
- **AA**: no ink, colour or opacity token changed this pass, so AA from painted bytes stands on pass 9's reading
  (not re-read).
- **filterBudget 9**: no `<filter>` added. **M16**: lint:copy exit 0, and no product string added. **@property**:
  carried (§3 addendum).
- **Frames**: none filed by the lane, none shot by the critic. 0 B of the 102,698 B headroom spent.
- **Instruments, by relative product path**: `web/frontend/scripts/check-ink-pressure.mjs` (lint:ink),
  `web/frontend/scripts/shape-census.mjs` (homes v3, + the PROPOSED on a scratch copy),
  `web/frontend/scripts/check-font-coverage.mjs`, `web/frontend/scripts/check-sleep-lint.mjs`,
  `web/frontend/scripts/check-copy-register.mjs`, `web/frontend/e2e/lib/rest-probes.mjs` (`heightAtRest`, `atRest`,
  imported by the critic's spec copies by relative path through a `lib` link to the bank's own `e2e/lib`),
  `web/frontend/e2e/note-reserve.spec.ts` (the lane's, read as the base of the critic's three scratch supersets
  `note-crit10.spec.ts` `1bc57015`, `note-crit10b.spec.ts`, `note-crit10c.spec.ts` `b5ef9b77`; none banked, none
  under docs/). No instrument was imported from docs/.

**G4 on the union** (`05ed6ead`, lint:ink bare, the same one-rule plants on the union's `MarginNote.vue`, restored
`cmp`-equal): clean 0 · C1 **1** (< 32.8) · S1 **0** · S2 **0** · S5 **0** · S4 **0** · S7 **0** · **C4 0** (the renderless
PROPOSED isn't on the union's homes either). The class hole rides to the union unchanged.

**G4, five more spellings at source** (the bank, lint:ink bare, the same overlay discipline, restored `cmp`-equal):
`margin-block: 6px` **1** · `height: 40px` **1** · `padding: 6px 0` **1** · **`border-top: 8px solid transparent` 0** ·
**`font-size: larger` 0**. S1's longhand and C2's keyword form read clean too, so the reader keys spellings, not the
box. These two weren't painted. The ink is `inline-block`, so both grow its box by construction, but the paint
reading is owed.

## 9a · The control beside the battery (chromium; the critic's own read)

The critic's control server got a heavy slot at about 20:48 (queued from 20:34) on :4248, cwd `w7-control/web/frontend`,
`index-CubiZsMVSwTc.js` asserted before the run, PID ancestry checked to the critic's wrapper. The same superset
spec (`note-crit10c.spec.ts` `b5ef9b77`, every arm), `-g "rest = spoken"`: **4 failed, exit 1** (load 13.04 → 15.46, zone
inuse 236,197 → 410,716). On the control:

- **π reproduces**: clean moves at 844×390 (s 1.30, d 1, 104/105 frames) and 1280 (s 2.81) in both themes, and holds
  0.00 at 390/360. That's the lane's control reading to the hundredth, and it's what the tree cures.
- **c7 is vacuous on the control** (0.00 in every cell). The control's ink has no enter class, as the lane says.
- c8css/c8js: the lane's window reads them as the clean arm reads (still at 390/360). They move the board +6 / strip
  +12 in the 3.5 s tail there too.
- The siblings move the control as well (S1 +12.00 at 390/360, +13.30 at 844, +14.81 at 1280, the control's own +1.30
  / +2.81 included), and docOnly reads d 1,981–2,000.

The tree's verdicts are therefore not control-anchored: every hole in §3b/§4 reads the same way on the control. They
are holes in the gate, not regressions of the tree.

## 9b · WebKit: UNREAD (the queue), and the close

- **WebKit, every browser row: UNREAD.** One `--exclusive webkit` run covering tree and control (two projects,
  `note-crit10c.spec.ts`, every arm) was queued at 21:04:10. At 21:05:15 it still had 2 browser-pool tickets ahead
  of it, then the machine-wide webkit lock: held by pid 14411 (a sibling lane in this repo, started about 21:02),
  with glass-ui's pid 18968 waiting on it since about 20:24. The critic withdrew it (never started). Zone inuse
  424,833 (under 8M, leak ARMED), load 14.09. No reboot is needed, only the queue. Every number in §3b, §4 and §9a is
  **chromium only**, and so is the lane's. §7's REST=SPOKEN, the siblings' paint and G5/G6 owe their WebKit column.
- **Servers**: :4249 (listener 37577, wrapper 37511) and :4248 (listener 75321, wrapper 37815) were stopped by
  recorded PID at 21:05:22, after checking cwd, served identity and ancestry. At return nothing listens on :4248 or
  :4249, and no process of the critic's scratch dir is alive.
- **Main / lane tree / control tree**: no write, no git. The lane tree was read through a temporary index only.
- **Scratch**: every archive (`base`, `ac-A`, `ac-A0`, `ac-A1`, `ac-P9`, `ac-S13`, `ac-S13b`, `ac-WV`, `ac-U`), log,
  plant, spec copy and build sits in the critic's durable scratch dir (`<scratch>`, per the owner's 2026-10-06 rule).
  Discards went to its `trash/`.
