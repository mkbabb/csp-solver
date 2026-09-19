# NOTE-LEDGER · pass-2 PROTOTYPE — what runs, and what it measures

A RUNNING build on the real surface, both engines. Worktree
`.claude/worktrees/wf_8630d340-e56-47`, branch `worktree-wf_8630d340-e56-47`, uncommitted diff.
Server: `npx vite --config probe/vite.scratch.config.mts --host 127.0.0.1 --port 4249
--strictPort` (private `cacheDir`), killed before this lane returned.

The pass-1 build was replayed by file (the `git -C` route into
`wf_e58b4764-0fc-54` is refused by worktree isolation, so the five changed files were compared
and copied: `GameBoard.vue`, `MarginNote.vue`, `pencilConfig.ts`,
`GameBoard.receipt.test.ts`, `GameBoard.notes.test.ts`; the pass-1 tree holds no untracked
product file). Pass 2 then cut the tier, the strike, the exit, the rung and the gate on top.

## THE ONE DECISION, measured

`--type-caption` on line two, painted, both engines, all eight rigs:

| claim | pass-1 build | this build | gate |
|---|---|---|---|
| longest record at 360 coarse | 216.63 px in 228 (**4.99 %**) | **191.92 px (15.82 %)** | L10-W ≥10 % — **GREEN** |
| line-two box, phone | 20.80 px | **18.19 px** | — |
| desk pair, size step at 1280 | none (both 18.176 px) | **18.176 → 14.048 px** | frames/C1 |
| ink outside its box at 1024 + 162 px tally | 6.53 px | **0.00 px**, `flex-wrap: wrap` kept, block 24 px | L14 — **GREEN** |
| painted contrast, line two | — | **5.19 : 1 light / 6.12 : 1 dark** over `--color-background` | L7 — **GREEN** |
| ellipsis on the phone | — | never fires (`scrollWidth − clientWidth = 0` on every rig) | — |

The 99-string sweep names the same longest string everywhere:
`D goes nowhere else in this column` (191.92 px caption / 216.63 px body at 360; 192.48 /
246.00 at 1280). Headroom 15.82 % at 360, 25.61 % at 390, 69.13 % at 1024, 69.54 % at 1280.

## THE GATES, as this build reports them

| gate | verdict | the number |
|---|---|---|
| L1 accumulation | GREEN | 2nd record → 1st readable in `.margin-note-previous`, both engines |
| L2 the peer row | GREEN | a digit elsewhere leaves both lines: `only 4 fits here` stands (chromium cell 76, webkit cell 80) |
| L3 the board | GREEN | board `y` identical at depth 0/1/2 on all 8 rigs × 2 themes × 2 engines (390: 221.73 / 221.73 / 221.73) |
| L4 the fold | GREEN | `scrollHeight` 800/800/800 at 1280, 768/768/768 at 1024, 844/844/844 at 390 |
| L5 the model half | GREEN | three records in → exactly one `<p class="margin-note-previous">` out, the oldest absent from the DOM |
| **L5 the clearance half** | **RED** | **1.81 px** on all four phone rigs, both engines (floor 6.0) — see below |
| L6 one region | GREEN | exactly 1 `role=status`; 0 `aria-hidden` in the strip; `ariaSnapshot` = `- status: …` + `- paragraph: …` |
| L7 the rung | GREEN | `gateNote` lands, 5.19/6.12, **17 discovered consumers** ⊇ the pinned rows, `--self-test` green with 3 new negative controls |
| L8 the caption law | GREEN | the deal row and its **givens twin** (givenCells {0,5,9}, two-deep column, generation bump → both `""`) |
| L9 records only | GREEN | a conflict never lands in line two; a solve empties both |
| L10-W the width | GREEN | 15.82 % at 360 coarse (was 4.99 %) |
| L11 the strike | GREEN | referent write → struck at either depth; elsewhere → both stand; a refusal is never struck |
| L12 the stutter | GREEN | both clauses, pinned in `GameBoard.receipt.test.ts` |
| L13 the exit | GREEN on the ink, **AMBER on the letter of "same frame"** | computed `ink-rub-out, ink-rub-out-fade` `0.15s, 0.15s` on `--ease-accelIn`, `position: absolute`, `transition: 0s`; board rect unmoved (221.73 → 221.73). Counted in frames (`logs/L13-frames-*.json`): **PRM off → gone at frame 20 / 165 ms (chromium), frame 10 / 161 ms (webkit)**; **PRM on → `animationDuration` `0s` and gone at frame 3 — 20 ms chromium, 46 ms webkit**. No ink moves under PRM; the node outlives the frame by two, which is Vue's `nextFrame` + resolve tick, not a computed duration hanging |
| L14 the tally's berth | GREEN | 0.00 px outside, `wrap` kept, `scrollHeight` 768 |

## THE ONE RED, and its arithmetic

The spec predicted ribbon clearance **4.80 → 7.40 px**. Measured on this build: **1.81 px**,
identical on 360×740, 390×844, 393×699 and 390×664, chromium and webkit.

The arithmetic is exact and leaves nothing to interpret. On every phone rig the gap between the
strip's foot and `#fold-tools`'s top is **20.00 px** (390×844: strip bottom 614.92, ribbon top
634.92). Line two's own box is 18.19 px, so it eats all but 1.81 of it. At the pass-1 BODY tier
the same foot sits at 635.72 — i.e. **0.80 px INSIDE the ribbon**. So the tier bought exactly
the +2.61 px the spec derived; the berth it was spent in is 6.0 px smaller than the spec
believed, and the floor is not met.

Two arms, neither of them this pass's one decision, both for the re-look:
1. the strip gains 4.2 px of air below it (a W2 row — the strip's pose is W2's);
2. line two's leading drops from `--type-leading-caption` 1.3 to ~1.0, which breaks the tally
   mirror the whole decision rests on.

The honest reading is that the tier moved the number the right way by the predicted amount and
does not on its own clear a floor written against a berth that is not there.

## The push and the exit, both engines

| | 390×844 | 1280×800 |
|---|---|---|
| from | `translate(0, −18.1875px) scale(1.142857)` | `translate(−132.25px, 1.36px) scale(1.293850)` |
| duration / easing / fill | 250 ms · `cubic-bezier(0.22, 1, 0.36, 1)` · `backwards` | same |
| at rest | `transform: none` on both lines | same |
| glyph filter | `none` × 2 | `none` × 2 |
| PRM | duration `0` | duration `0` |

dx at 1280 is **−132.25 px**, the spec's declared number to the hundredth. The scale is read off
the two elements at runtime rather than written down, so §10's re-floor of `--type-caption`
cannot make it lie.

**The curve reads faster than the brief assumed.** At t = 125 ms (half the rung, paused at
birth and verified `playState: "paused"`, `currentTime: 125`) the mover is at
`matrix(1.00552, 0, 0, 1.00552, 0, −0.702)` — **96.1 % arrived**. `--ease-noteWrite` is an
expo-out; "half-way down, half-way shrunk" happens near t ≈ 30 ms, not 125. `frames/C3` is what
t = 125 ms actually looks like on this curve.

## Censuses re-run against this build

| instrument | reading | row |
|---|---|---|
| `budget.probe.ts` R3-h | `liveFilterTotal` **9** at 4×4, 9×9 and 16×16 | UNMOVED (R6 law 9 / L1) |
| `wobble.probe.ts` R3-a | grid σ **1.443** · frame σ **1.145** · ring σ **0.092** · band 0.722–2.886 · `ringInBand: false` | **byte-identical to r0**; the red is §6's, pre-existing |
| `marks.probe.ts` R3-d | ten acts, **all ten identical to r0** | subject **MOVED**, readings unmoved — `instruments/R3-d-MOVED.md` carries the proposed two-act diff (the census cannot tell the cure from the disease) |
| `marks2.probe.ts` R3-g | five acts, all identical to r0 | UNMOVED |
| `marks.probe.ts` R3-b | RED | UNMOVED — pre-existing, the focus-ring census the chair moved to §6 (§6.1). This family touches no ring |
| `heading-voice` | RED, "8 control groups in 3 voices" | UNMOVED — r0 says three voices, two ranks; §1/§10's row, not this one |
| `e2e/board-covisibility.spec.ts` | **8/8 green**, including "the strip below the board is one reserved line — no more, and no less" | the control that proves the out-of-flow berth adds no line |
| `check-ink-pressure --self-test` | green, 3 new negative controls (`note-rung`, `note-consumer`, `note-discovery`) | MOVED (gains `gateNote`) |
| `check-copy-register` | green | UNMOVED — no string minted |
| `check-font-coverage` | green | UNMOVED — **and green for the wrong reason**, see below |
| `check-live-regions` | 10 declared, **0 born speaking** | UNMOVED (the brief's "6" does not match what the gate prints at HEAD either) |
| `vitest run src/` | **66 files / 820 tests, all passing** | — |
| `vue-tsc --noEmit -p tsconfig.json` | clean, exit 0, empty output | — |
| `eslint` on the three touched product files | clean | — |

## The wave row this family can only declare

`frames/C2` shows it: at 360 coarse dark the longest record's leading **D** paints in a serif
italic fallback, not Patrick Hand. A B D E F G are outside the hand's cut, `check-font-coverage`
is green because its `where` is hand-written, and the string is landed. R6 law 30, broken by
copy, not by this family. If the subset is re-cut every width number above moves DOWN.

## Frames (4, 54 KB total)

1. `C1-1280-desk-pair-light-chromium.png` — the size step at the desk. **Read the sizes, not the
   colour**: the staging helper rewrote the two texts and not the tone, so line one paints in
   the refusal's teacher-red rather than the graphite the spec's pose names. The 18.176 → 14.048
   step is the claim and it is visible.
2. `C2-360-coarse-dark-longest-chromium.png` — the longest 16×16 record on line two at 360
   coarse dark, ransom glyph visible and declared.
3. `C3-390-push-t125-chromium.png` — the push paused at t = 125 ms (96.1 % arrived; see above).
4. `C4-390-grade-leaves-chromium.png` — the grade-leaves pose: a blank body rung over a quiet
   caption one, the block's `min-height` holding the geometry.

## What this build does NOT close

- **The clearance.** 1.81 px against a 6.0 px floor, above.
- **The landscape ballot is still depth ONE** and still a pose-dependent depth (B6's
  split-grammar row, the owner disposes). Measured here: at 844×390 the strip's top is at
  y 388.39 — the spec's number to the hundredth — its foot at 410.48, `#fold-tools` is 0×0, and
  the first painted box below is `.control-panel-filtered` at 419.19: **8.71 px**, against the
  spec's declared 8.70. At 900×500 the honest figure is **45.92 px** (strip foot 482.66, panel
  529.19), not the 6.50 the spec carried.
- **`scrollHeight` at 844×390 goes 409 → 410** between an empty strip and a spoken one. Line two
  is `display: none` there, so the 1 px is line ONE's text arriving, not the ledger's; it is the
  same 1 px at HEAD. Stated because the L4 row reads "invariant" and this rig is not.
- **The desk `dy` is 1.36 px, not 0.00.** The spec derived dy top-to-top; the FLIP anchors on
  `bottom` because `transform-origin` is `0 100%`, and the two lines' bottoms differ by 1.36 px
  at 1280 (1.17 webkit). One rung, unchanged.
- **The copy arm is not shipped** (U-10): `only 4 fits in row 4 column 7` / `the answer was 4`.
  The strike ships; the owner disposes at the re-look.
- **Goldens are OWED at WGATE's rebuild.** No `npm run build` was run — W8 §8.1 has the dist
  frozen at `index-9rZPzI5DEcpe.js`. DELTA declared: none.
- **A gate of my own that did not run, caught late.** The first typecheck in this lane was
  `vue-tsc --noEmit -p tsconfig.app.json`, and there is no `tsconfig.app.json` in this repo —
  `TS5058`, and the shell's exit came from the `tail` after it, so it read green. The real run
  is `-p tsconfig.json` and it is clean, but the near-miss is the trap worth banking: **a check
  whose exit code you read off a pipe is not a check** (the estate already knows this one as
  `cmd | tail` eating the status; this is the same bite through `;`).
- **The probe estate lives at `web/frontend/.ledger-probe/`** in the worktree — untracked, so it
  is absent from `git diff --stat`. It is there rather than beside the evidence because
  `@playwright/test` will not resolve from `docs/`. Copies of everything are banked under
  `probe/` and `instruments/r0-copies/`.
- **One unexplained observation.** Under PRM the `Element.animate` hook records **two** pushes
  where the non-PRM run records one (`logs/A5-prm-*.json`, both engines). Both carry
  `duration: 0`, so nothing paints twice, and `marginPrevious` ends holding one record. I could
  not account for the second call inside this pass and I am not going to invent a reason for it.
