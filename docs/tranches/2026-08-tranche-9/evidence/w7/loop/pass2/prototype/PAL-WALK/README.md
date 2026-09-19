# PAL-WALK — the walk over open arcs · pass-2 PROTOTYPE

Built and measured on the real surface, both engines, 2026-09-18. Worktree
`.claude/worktrees/wf_8630d340-e56-59`, branch `worktree-wf_8630d340-e56-59`, off `a8fee1f5`,
uncommitted diff (7 product/script/spec files + 1 new gate + 1 new spec). Dev server
127.0.0.1:4244 with a private vite `cacheDir`, preview 127.0.0.1:4248 for the built-dist rows;
both killed. Probe sources in `probe/`, the two MOVED r0 instruments in `instruments/`, numbers
in `readings/`, three crops in `frames/`.

## What the replay carried

Pass 1's diff (`../../pass1/prototype/PAL-WALK/proto/palwalk.diff`, 7 files) applied `--3way`
clean onto `a8fee1f5`; the one untracked product file pass 1 left (`scripts/check-peer-arcs.mjs`)
was copied across. `src/` then matched the pass-1 worktree byte for byte (`diff -rq`), and
`vue-tsc -b` exited 0 before any pass-2 edit. Carried: the arcs constant and the walk, the
`inkAgreed` set, the ring at 0.80, the `lint:arcs` CI lane, the `k`-adoption units. Replaced
this pass: the bands, the cap, the gate's discovery rule, the wire rule, the self binding.

## The numbers, painted

Every figure below is read off the engine's own bytes through the module the board imports
(`e2e/peer-walk.spec.ts`, tier 3; `readings/tier3-painted-law-both-engines.txt`). Chromium and
WebKit agree to the last digit except where said.

| row | light (band 0.44) | dark (band 0.65) | synthesis said |
|---|---|---|---|
| nearest house ink, worst of 144 | **0.0716** at i=112 (`--color-solver-ink-3`) | **0.0709** at i=0 (`--color-crayon-rose`) | 0.0716 / 0.0709 ✓ |
| hands under the crayon reference 0.0764 | **5/144** | **3/144** | 5 / **1** — the dark count is 3, not 1 |
| AA worst, `--color-background` | **7.10** at i=35 | **5.31** at i=115 | 7.10 / 5.20 ✓ |
| AA worst, `--color-card` | 7.27 | **5.20** | ✓ |
| AA worst, `--color-popover` | 7.16 | 5.27 | not measured before |
| AA worst, selection wash (8% blue over card) | 6.69 (webkit 6.73) | **4.61–4.71** | not measured before |
| peer-vs-peer N=3 / 4 / 8 / 16 | 0.0758 / **0.0758** / 0.0229 / 0.0084 | 0.0762 / 0.0762 / 0.0226 / 0.0090 | 0.0741 / 0.0741 / 0.0212 / 0.0082 |
| ring at 0.80 vs its own 4% fill, worst of 144 | **4.33** at i=14 | **3.63** (webkit 3.62 at i=128) | ≥ 3.0 ✓ |
| collisions over the first 16 / 24 / 40 | 0 / 0 / 0 | 0 / 0 / 0 | 0 ✓ |
| mean painted chroma | 0.1243 (arithmetic, `probe/walk-strings.mjs`) | same string | 0.1242 ✓ |

The peer-vs-peer figures are 0.0017 above the synthesis's because index 0 moved a hundredth of
a degree — see the defect the gate caught, below.

## The gate, tiered, and every control fired

`readings/born-red-battery.txt` (`probe/born-red.sh`), each control applied to a copy and the
tree restored between rows.

| row | at HEAD | after | control |
|---|---|---|---|
| tier 1 `check-peer-arcs.mjs` bare | — | **exit 0** (29 chromatic declarations → the 6 declared arcs) | — |
| tier 1 `--self-test` | — | **exit 0** | moved hex REDS · a rename is invisible to the arcs (a name is not a colour) · a renamed token still RESERVES its hue (27 hits) · an under-declared arc REDS |
| tier 2 · the module's 144 hues outside every arc | **RED** (HEAD's 137.5° walk puts index 2 at 275°, inside the blue arc) | GREEN | `STEP = 0.5` leaves this row GREEN — see the honest note below |
| tier 2 · four hands read as four people | **RED** at HEAD | GREEN | `STEP = 0.5` **REDS** it |
| U1 agreed index survives a non-author's `st` | **RED** | GREEN | — |
| U2 this page's own publish agrees nothing | **RED** | GREEN | — |
| U3 no two known ids share an ink string | **RED** | GREEN | — |
| tier 3 painted law, both engines | RED at HEAD (0.027 worst, 37 collisions — pass-1 reading) | **GREEN** | the 0.55 ring is the ring row's control |

**The rename control, reproduced honestly** (`probe/rename-control.mjs`, `probe/rename-gates.sh`).
A chromatic token renamed in both arms (`--color-solver-ink-4` → `--color-answer-pale`, hue
untouched), and the arcs re-derived the way the PASS-1 gate's own name list would: the pass-1
gate exits **0** with hand 14 sitting **0.13°** from a token the sheet still paints; the re-cut
gate exits **1** and names it. That is the critique's "0.47°" finding, at this tree's numbers.

**The `STEP = 0.5` control is honest about what it reds.** With the walk mapped over arclength,
any step keeps the hues inside the open complement by construction, so the arc row cannot red on
a step change — it reds on a broken constant (tier 1's job) or on HEAD's full-circle walk. What
`STEP = 0.5` actually destroys is the SEPARATION, and the capacity row reds on it. Both are
stated in the spec's own comments rather than papered over.

## The defect the gate caught, and the cure

Tier 2 was born RED against this family's own pass-1 walk, not only against HEAD: index 0 lands
exactly on 27.1616°, the open edge of the rose crayon's guard, and `toFixed(2)` printed 27.16 —
**0.0016° INSIDE the arc the family exists to stay out of**. The cure is in the module, not the
gate: `hueAt` now rounds INTO the open arc (`intoArc`), index 0 emits 27.17, and the unit pin
moved with it. Cost: one hundredth of a degree.

## The one-person room, the solo era, the leave path

`readings/p1-room-{chromium,webkit}.txt`, both engines identical.

- **Solo, untouched**: fingerprint IDENTICAL to HEAD r0 (`boundCount 0`, root and cell ink
  `#2563eb`, glyph stroke `rgb(10,10,10)`, no leave verb).
- **Solo, two digits written**: both strokes `rgb(37, 99, 235)`, `boundCount 0`.
- **Invite pressed, a third digit written**: all three strokes still `rgb(37, 99, 235)`, the
  roster row's swatch still `rgb(37, 99, 235)`, `boundCount 0`. **The room of one recolours
  nothing.**
- **A second id arrives**: all three strokes — including the two written BEFORE the room
  existed — snap to `oklch(0.44 0.1796 27.17)` on the join trace's frame, and B paints A's
  digits the same colour (I2 GREEN both engines). The solo-era cells are carried by the clock
  stamp at session start (`[0, selfId]`), so one hand is one colour.
- **Leave**: back to `rgb(37, 99, 235)`, `boundCount 0` — solo restored.

## Censuses and the estate

| census | reading |
|---|---|
| `vue-tsc -b` · `vue-tsc -p tsconfig.e2e.json` | 0 · 0 |
| vitest, whole battery | **66 files / 815 tests, 0 failed** (`readings/vitest-full.txt`) |
| goldens vs THIS worktree's built dist (preview :4248) | **4/4** (`readings/goldens-4of4.txt`) |
| filter census on the built dist, both engines | **12/12** — `filterBudget` exact, area and all |
| R6 law probe L1 (filter population is exactly 9) | GREEN |
| `check-copy-register --self-test` | 0 (no string minted) |
| `check-peer-arcs --self-test` · `check-motion-contract` · `check-pw-projects` · `check-lane-membership` · `check-theme-tokens` · `check-ink-pressure` | all 0 |
| `e2e/multiplayer.spec.ts`, both engines | **34 passed, 2 skipped** (the relay rows) |
| eslint · prettier (`src/`, `scripts/`) | 0 · 0 |

The new spec cost two deliberate acts, both landed in this diff: `SPEC_MANIFEST` gains
`peer-walk.spec.ts` (`check-pw-projects` red until it did) and the file declares `PRM: live`
with its reason (`check-motion-contract` red until it did).

## MOVED r0 rows

1. **R6 law 22 / law-probe L6** (`instruments/law-probe.L6-recut.mjs`). The r0 row tested the
   LITERALS `137.5` and `0.11` — a palette test wearing a formula's name, which passes a
   hand-written table and fails any better formula. Re-cut to what the law says: a step, a
   gamut-derived chroma, declared arcs, a two-arm band, and **no hex literal in the module**.
   GREEN on this tree (`hex literals: 0`); its negative control — a literal hue table spliced
   into a scratch copy — REDS it (`hex literals: 6`). `probe/l6-control.sh`.
2. **r2 `accent-kinship.probe.ts`** (`instruments/accent-kinship.probe.MOVED.ts`). `OUT` is
   re-pointed to this lane, and the peer row now reads the inks **from the module in page
   context** instead of re-writing `i × 137.5°` at 0.11 by hand — a probe that re-states the
   walk measures a colour the product no longer paints. Toll row GREEN both engines: the peer
   band's worst over 40 indices on `--color-card` reads **7.27:1** (floor 4.5); the rainbow's
   five stops 5.29–6.21. `readings/r2-exception-toll-MOVED.json`. The four §3 kinship rows that
   fail in that file are r0's own born-RED accent rows (kinship, focus ring, token estate) and
   belong to the ACC-* families; this diff does not touch them.
3. **`e2e/multiplayer.spec.ts:190,:218`** — the two comments that said you are the incumbent
   blue while everyone else walks, re-cut in place. Both rows still pass unchanged: they assert
   that the two inks DIFFER, which is truer now than when they were written.
4. **`HandDrawnGrid.vue:601`** — re-derived for the arc walk. The old note cited "index 2 lands
   at 275deg, a hand's breadth from `--color-progress-ink`"; index 2 is now 234.22°, and the
   nearest hand to the progress ink is index 10 at 308.27°, **15.55° away**
   (`probe/nearest-progress.mjs`).

## Corrections this lane owns

1. **The dark count is 3, not 1.** The synthesis's §1.2 table carried the cap-0.166 figure into
   the cap-0.215 row; its own probe output says 3, and the painted bytes say 3.
2. **The dark arm's tokens must be resolved through the CASCADE, not read from the source.** The
   first tier-3 run compared night-time hands against daytime hexes and read 0.0494 vs
   `--color-crayon-blue` — a number about nobody. Resolving every custom property through
   `getComputedStyle` gives the real 0.0709.
3. **The fourth ground is not `--color-accent`.** It is an icon-button hover fill and no node
   carrying `--color-user-ink` sits on one. The four grounds are the paper, the card, the
   popover (the phone's dock sheet) and the selection wash a digit is read against on your own
   selected cell. The accent is measured and PRINTED, not asserted: the worst dark hand reads
   **4.19:1** on it, which is a coupling for any future wave that paints a slug on an accent chip.
4. **The chroma rule finds exactly the name list's set at HEAD** — 17 light, 12 dark, 29 in all,
   and *nothing* sits between chroma 0.03 and 0.06 (`probe/chroma-census.mjs`). The threshold is
   a canyon, not a knife edge, and the arcs are unchanged by the change of rule.

## Gaps, honestly

1. **The relay arm is untested.** Everything is the `?wire=local` `BroadcastChannel` arm. The
   wire rule's three sentences are units and one local-arm e2e; a relay run is still a row.
2. **`adoptInk` grew a re-seat loop.** U3 is not free: a fresh epoch's `k` can hand an index to
   a named id while an UNNAMED id still holds it, so the unnamed hand moves to the cursor. It is
   ten lines and it is the only place the walk's one-index-one-id invariant is enforced; it
   wants a second reader.
3. **The solo-era clock stamp reaches into `useGameState`** via a new optional
   `SessionSource.authored()`. It is a filter over `values` (not a given, not solver ink), not a
   second record — but it is a substrate addition, and the synthesis's risk 4 stands.
4. **Dark's margins are thin where they are thinnest.** Selection wash 4.61 (webkit) against the
   4.5 floor, and the dark ring 3.62 against 3.0. Both hold; neither has room for a darker paper.
5. **The capacity is still the capacity.** Eight hands read 0.0229 — a third of the crayon
   reference. The header says so and the unit pins it, but no band fixes it, and this is the
   owner's question at the re-look (U-10).
6. **No phone viewport was measured this pass.** The colour is viewport-independent by
   construction and pass 1 measured the 390 row at 16.42px; this pass did not re-read it.
7. **`filterBudget` was read on the built dist and the L1 law row; the 9 was not re-counted by
   hand.** Nothing in this diff touches a filter.

## What the owner is asked (U-10)

Unchanged and re-priced: four people legible at a glance, eight distinguishable side by side,
sixteen one colour said sixteen times. If four is enough for a worksheet this is the colour —
every hand now as far from the machine's inks as the house's own crayons are from each other
(0.0716 / 0.0709 against 0.0764), richer than today (mean chroma 0.124 vs 0.110), and you are
inside the system exactly when someone else is here. If sixteen must read as sixteen, the arcs
cannot do it; the band, `chromaAt`, the ring at 0.80, the wire rule and the tiered gate ride
either answer.
