# PAL-WALK · pass-4 prototype (§11c, the hue walk)

Work tree `.claude/worktrees/wf_308fa864-c94-1`, base and π control **`74a2b5d9`**, uncommitted.
Advanced in place from the chair's reset (pass-3 record `pass3/prototype/PAL-WALK/pass3.diff`,
re-applied 2026-09-22). Servers, all 127.0.0.1, each killed by recorded PID at return: lane dev
4244, HEAD control 4245 (`w7-control` dist, verified `index-CubiZsMVSwTc.js`), relay-arm dev 4247
(`VITE_RELAY_URL=ws://127.0.0.1:4248`), local relay 4248 (`wrangler dev` of `web/relay`), built
dist preview 4246 (verified `index-_PLR3gP2PHUZ.js`, 43 files, same count as the control).
The pass-4 number is the critic's, not this README's.

## Gaps first (what is still open, with the number that holds it)

1. **The ring clears 3.0 at its core only, and in the LIGHT arm only there.** All 576
   photographs clear 3.0 at the core (worst 3.158 light, 3.430 dark). At 90 % of the median core
   change, **107/144 light hands** (chromium; webkit 106) have a scan under 3.0 (worst 2.763).
   The dark arm has 0/144. At 50 %, 28–41 % of scans are under 3.0 in both arms, which is what
   any 1.9 px antialiased line does. The core statistic priced the pin rule. Whether §2.4's
   "paint decides" means the core or a flank percentile is the chair's call, and the price of
   the stricter one is under §Sweep (the 0.28 audition).
2. **Row 8 as written can't be photographed.** At 390×844 coarse the open dock sheet covers
   **81/81** cells (sheet top 216.0 px, card clientHeight 628), and the card paints
   `rgb(253, 253, 252)` (`--color-card`), not `--color-popover`. No peer surface in the tree
   paints on `--color-popover`: its one consumer is `AttributionCard`, the owner's credit. So
   §A's "popover" AA row prices a ground no player surface uses. It's kept, and labelled as that
   finding. What was photographed instead is the ring at 390 coarse after the sheet slid open,
   settled, slid back and settled (frame 2).
3. **F1's NO arm builds but the units hold the YES lean.** With `SELF_TAKES_A_HAND = false`,
   `vue-tsc -b` passes and the arm is framed, but U2, U7 and U8 go red (3 of 53). Firing NO means
   re-aiming three units. That's the arm's price, and it's stated rather than hidden behind a
   conditional.
4. **The same-epoch relay case isn't measured.** `newer()` is strict (`useSession.ts:98`). So if
   a non-author relays epoch *e* first, the author's own `st` for the same *e* is dropped whole,
   and the relayed `k` stands unagreed until the author publishes a newer epoch. U9 holds the
   newer-epoch case, which is what the critic named. The same-epoch case is read from code, not
   from a unit or the wire.
5. **The owner's gestalt frames are gone.** The chair's pass-3 sweep kept 0 of this family's four
   crops, and this pass's four slots went to the charter's rows. The ΔE figures stand
   (N=4 0.0758, N=5 0.0264, N=8 0.0229, N=16 0.0084 light; dark within 0.001). The four-hand and
   eight-hand pictures need re-shooting for the re-look (U-10).
6. **Tier 3 stays a local instrument (O-12).** CI now sees the arcs, the bands (check 3) and the
   rounded-bytes law (tier 2). The painted ring, the tape's CSS line (§C) and the 144 photographs
   run only locally.
7. **The comparer reads one module.** A chroma computed for `--peer-*-l` in a file other than
   `playerIdentity.ts` isn't read (the scope is stated in the gate). A second table inside the
   module *is* caught (self-test j).

## Numbers (each names its control: `74a2b5d9`)

### The charter's thirteen rows

| # | row | reading on this tree | control / negative |
|---|---|---|---|
| 1 | `check-lane-membership` | **exit 0**. `lint:arcs` is wired as a ci.yml step beside `lint:catch` | same run, step deleted: **exit 1** (`NOTHING RUNS IT`) |
| 2 | ONE publisher + comparer | `index.css` publishes; `check-peer-arcs` **check 3 BANDS AGREE** holds `DIGIT_BANDS`/`RING_BANDS` per arm and reads the module's call sites | the invited edit (`--peer-ring-l` 0.32→0.2 on the sheet alone): tier 1 **exit 1**, L6 **RED**, tier 3 §A **RED**, with the painted ring 3.417° from crayon-blue at i=57 and drift **18.258°** at i=113 (the critic's figure, reproduced). Self-test (g)(h)(i)(j) all red |
| 3 | arcs on the RING's painted bytes | §A 4b: nearest house token, painted, digit **12.906°** light / **13.048°** dark, ring **12.906°** / **13.066°** (both engines identical). Worst drift from the asked hue: digit 0.892° / 1.166°, **ring 1.695° / 1.353°**. The ±1° margin does not cover the ring, so tier 2 now holds the law on the ROUNDED bytes, both strings at both bands, in CI | tier-2 replay of the ablation (ring painted at 0.2, bisected at 0.32): **RED** (a hue rounds to 177.153°) |
| 4 | the dark tape | **CURED, and carried as a ballot (B-TAPE)**. The name on the tape is written in the ring's string (`GameBoard.vue`, one line). On the real node, relay peer: **11.707 / 5.308** (chromium i=0), 11.700 / 5.308 (webkit). §A worst of 144: **10.790 / 5.216**. Digit-string arm: 6.493 / **2.993** (§A), 7.492 / **3.065** (node). HEAD's walk on the same composited ground: 4.777 / 5.474 | §C with the line reverted: **RED** both engines (`tape name oklch(0.44 …) ≠ ring string`) |
| 5 | round-3 logs + the discriminating unit | banked: `born-red-logs/br3-{noagree,solo,reseat}.log` (U1+U5, U7+U8, U3 red). **U9** (a non-author's `st` arrives first; the author's later word must land) is added and green | `from === e[1]` → `true`: **U9 red, alone** (1 of 43) |
| 6 | goldens on a built dist | **4/4** (`test:golden`, `PLAYWRIGHT_BASE_URL` = the built preview) | no golden moved |
| 7 | filterBudget | **9** on the built dist: G3.1 (desk) and G3.3 (<1024 coarse), chromium and webkit, 12/12. `filterBudget.ts` byte-identical to `74a2b5d9` | the pass-3 `population 0` row is struck |
| 8 | 390 on popover | re-scoped (gap 2). At 390×844 `hasTouch`, with coarse/hover-none witnessed on A and B at desk: ring from the wire **3.514** (chromium) / **3.421** (webkit), 0/44 scans under 3.0 at the core, ground `.board-wrapper` | frame 2 |
| 9 | accent-kinship tape row | `instruments/accent-kinship.probe.MOVED.ts` (PROPOSED). The ground is read by `getComputedStyle` off a node wearing the tape and composited over the card; the band `var()` resolves through a node. It reads **10.78** (ring key) / 6.49 (digit key) light, which agrees with tier 3's 10.790 / 6.493 | pass 3's row read the card's 7.27. My first re-cut read 1.00 because the canvas can't parse `var()`. Both fixed |
| 10 | L6 over `--peer-ring-l` | `instruments/law-probe.L6.PROPOSED.diff` against r0's current probe (the chair's L3 included): L6 reads both tokens' two arms and holds the module tables to them. Tree: **L6 GREEN**, run exit 0 | control `74a2b5d9`: L6 **RED** (the law MOVED). Invited edit: **RED** |
| 11 | digit inside its ring | **deliberately unpriced**, and the token comment says why: 2.100 light (i=124) / 1.400 dark (i=99, webkit 1.412 at i=141). The two don't touch: the inked glyph sits **6.01 px** (chromium) / **6.23 px** (webkit) from the ring's inner edge, so 1.4.11's adjacency is fill and paper | — |
| 12 | five hands vs 144 | `WALK_SWEEP=1` photographs all 144 (the gate's comment states the scope). Result: see §Sweep | — |
| 13 | §6 candidate | the ring band survives all three alphas at the shipped band, worst of 144: **0.55 → 3.158 / 3.430**, **0.65 → 4.091 / 4.321**, **0.80 → 6.288 / 5.876** (webkit 3.450 / 4.319 / 5.920 dark). Without the band, alpha alone needs **0.63 light / 0.70 dark** (webkit 0.69), and 57/144 dark hands are under at 0.65. `join-language-prm:153` is untouched at 0.55. The section scalar stays **0.32 / 0.79** (§2.4) | — |

### A real peer on the relay (row 7)

Two browser contexts (BroadcastChannel can't cross them), with the relay-arm dev server pointed at
a local `wrangler dev` of `web/relay`. A's sockets: `ws://127.0.0.1:4248/` and the HMR socket, so
the relay carried the room. B wrote a digit, and B's cursor put the ring round it. Nothing was
seated by the probe.

| | chromium (B = i=0) | webkit (B = i=0) |
|---|---|---|
| ring string off the cell | `oklch(0.32 0.1214 27.17deg)` / `oklch(0.79 …)`: the ring's band, never the digit's | same |
| core, light / dark | **3.596 / 3.475** (Δ to computed 1.0 / 0.0) | **3.596 / 3.494** |
| scans under 3.0 at the core | 0 / 44 | 0 / 44 |
| sensitivity 50 % / 90 %, light | 2.352 (18.2 %) / 3.185 | 2.277 (27.3 %) / 3.074 |
| sensitivity 50 % / 90 %, dark | 2.059 (34.1 %) / 3.158 | 2.102 (38.6 %) / 3.070 |
| tape: label colour == ring string's computed colour | yes | yes |

These match §B's arithmetic-picked photographs (i=0: 3.596 / 3.475, the same bytes). An earlier
run dealt B i=1 in webkit: 3.215 / 3.717, tape 10.847 / 5.710.

### Tier 3 on this tree, both engines (`e2e/peer-walk.spec.ts`, 6/6 passed, dpr 3)

§A (arithmetic, 144 hands): AA background / card / popover / selection-wash **7.098 / 7.270 /
7.164 / 6.687** light (webkit wash 6.730) and **5.310 / 5.197 / 5.270 / 4.708** dark (webkit
4.614). Laminate 5.861 / 4.310 is reported. Nearest house ink ΔE 0.0716 / 0.0709; the crayon
reference, re-derived, is 0.076410 / 0.060481; 5/144 hands sit under it light (the house crowds
itself 78.9 %) and 0/144 dark (10.5 %). No byte collisions over 16/24/40. Ring worst **3.158
(i=6) / 3.430 (i=5)**, with webkit 3.450 (i=107). Min ring chroma 0.0544.

§B (photographed five hands, shipped band): core worst **3.158 (i=6) light, 3.430 (i=5) dark**,
equal to the arithmetic, with Δ to computed ≤1.4/255. Flank@50 % worst 2.019 / 1.997; mean share of
scans under 3.0 is 45.9 % / 39.1 %. @90 %: 2.763 / 3.053 (chromium), 2.765 / 3.112 (webkit).

§C (new, a real session over the local wire): the tape's name == the ring string, and it reads
**10.854 / 5.710** on the worn ground (webkit 10.847 / 5.710).

### Sweep (row 12)

`WALK_SWEEP=1`: **576 photographs** (144 hands × 2 arms × 2 engines, shipped band, 16.3 min).
Banked compactly as `readings/sweep-144.txt` (per hand: core / @90 %).

| arm · engine | core worst of 144 | under 3.0 at the core | isTheRing false | @50 % worst · mean share of scans < 3 | @90 % worst · hands with a scan < 3 |
|---|---|---|---|---|---|
| light · chromium | **3.158 (i=6)** | **0** | 0 | 2.018 · 34.4 % | 2.763 · **107/144** |
| light · webkit | **3.158 (i=6)** | **0** | 0 | 2.046 · 36.9 % | 2.765 · **106/144** |
| dark · chromium | **3.430 (i=5)** | **0** | 0 | 1.979 · 40.8 % | 3.053 · 0/144 |
| dark · webkit | **3.450 (i=60)** | **0** | 0 | 1.956 · 28.5 % | 3.080 · 0/144 |

**The five-hand inference is retired by photograph.** Every core worst equals §A's arithmetic worst
(webkit dark: 3.450 at i=60 where the arithmetic names i=107, the same value, a tie). No hand of
the 576 is under 3.0 at the core. **The stricter statistic tells a different story in one arm**:
at 90 % of the core change, 107 (chromium) / 106 (webkit) of 144 light hands have a scan under 3.0.
The dark arm has none. The pin rule's 0.10 headroom was measured at the core and does not carry
to the flank. **The price of the stricter statistic, auditioned (not shipped)**
(`readings/audition-ring-light-028.txt`, chromium, both publishers moved to 0.28 and the comparer
green, then restored and verified byte-identical): the light core worst rises to 3.399 (i=61), but
**85/144** light hands still have a scan under 3.0 at 90 % (worst 2.924). The palest ring's chroma
falls from 0.0544 to **0.0477**, both arms, since one string serves both themes. The painted hue
holds (12.644°, drift 1.802°). So a flank-percentile law can't be bought by a small move of the light
band. It needs a darker band still, or a wider stroke, which is §6's axis, not this family's. The
section ships 0.32 / 0.79 on the core statistic and carries the flank figures.

### Guards and censuses (bare, exit codes unpiped)

| gate | exit |
|---|---|
| `check-peer-arcs --self-test` (12 self-test rows) · `check-lane-membership` | 0 · 0 |
| `check-copy-register` · `--self-test` (no new rendered string this pass) | 0 · 0 |
| `check-motion-contract` · `check-pw-projects` · `lint:live-regions` | 0 · 0 · 0 |
| `check-theme-tokens` · `check-theme-selectors` · `check-ink-pressure` · `check-empty-catch` (all `--self-test`) | 0 |
| `lint:sleep` | **was 1 on the pass-3 tree** (`peer-walk.spec.ts:140`, a 320 ms settle sleep that pass 3 never ran the gate over), **0 now**: polls the draw-on's own end on the ring path |
| knip · eslint `src scripts e2e` · prettier `src scripts` | 0 · 0 · 0 |
| `vue-tsc -b` · `vue-tsc -p tsconfig.e2e.json` | 0 · 0 (and 0 on the F1 NO arm) |
| vitest, chunked | `src/games` 57 files / 757 · `src/pencil` 8 / 73 · `src/composables` 3 / 16 = **68 files / 846 tests, 0 failed** (pass 3: 68 / 844; +U9, +the rounded-bytes row). `src/lib` and the root files hold no test files, so vitest exits 1 on the empty filter |
| π (built dist vs `74a2b5d9` dist, board pinned by an encoded `?board=` payload minted from the control's deal and verified decoded on both arms) | **854 nodes, 0 one-sided, 0 paint/tag deltas, 0 rects > 0.01 px**, chromium and webkit, light and dark. Negative control head-vs-head: 0 / 0 / 0. Positive control (HEAD light vs dark): 854 paint deltas |

## What moved this pass (the diff)

`git -C .claude/worktrees/wf_308fa864-c94-1 diff --stat`: **16 modified + 2 new** (pass 3 was 14 + 2,
and `.github/workflows/ci.yml` and `GameBoard.vue` join).

- `ci.yml`: the `lint:arcs` step.
- `check-peer-arcs.mjs`: check 3, BANDS AGREE (per-arm values plus the module's call sites) and
  four self-test rows. The header says what it holds.
- `playerIdentity.ts`: `DIGIT_BANDS`/`RING_BANDS` exported and documented as a held copy. The
  rounding-budget sentence is re-derived from both strings, because "the margin is not the
  guarantee; the rounded bytes are". `seedFor` is inlined back (one caller; the graft claim struck).
- `index.css`: comments only. The invited edit names its comparer; the 3.0 is named as the core
  with the flank figure beside it; the digit-inside-ring is stated as unpriced with its gap; the
  §6 numbers are in.
- `GameBoard.vue`: the tape's name takes `var(--color-peer-cursor-ink)`, bare.
- `useSession.ts`: the F1 switch `SELF_TAKES_A_HAND` (one const, folded into `roomHasOthers`).
  `source?.writtenPositions() ?? []` is split into its two silences (null source = the scene-swap
  seam).
- `useSession.test.ts`: U9, and the rounded-bytes arc row for both strings at the module's bands.
- `e2e/peer-walk.spec.ts`: §A arc row (digit and ring) and the composited tape rows; §6
  candidates; digit-vs-ring priced; §B sensitivity row, `WALK_SWEEP` and a draw-on poll in place
  of the sleep; §C the tape off a real session.

Grafts: the pin-with-headroom rule (already in), the ring arm (already in) and `vector-effect:
non-scaling-stroke` (N/A: this family draws no inline mark) are in. PLR-SELF's substrate for the
cell name was NOT taken: there's no PLR-SELF pass-4 `substrate.diff` in this lane's reach, and the
`{slug} is here` clause stays this family's own tail in `useGameCell.ts`. Out (for others): the
resolved-value census, ratio-not-literal, the self-refusing token comment, `isTheRing` with its
sensitivity row, the runtime-token ablation (now also replayed in tier 2), and the π
positive + negative control pair.

## r0 / R6 rows MOVED (proposed, the chair lands them)

- **R6 L6**: `instruments/law-probe.L6.PROPOSED.diff` (against r0's current `law-probe.mjs`,
  L3 as the chair landed it). GREEN on this tree, RED on `74a2b5d9`, RED under the invited edit.
  Chair §1.3 folds it under this row. Law 21's cite moves to `index.css` `--peer-ink-l` /
  `--peer-ring-l` (light block `:153–210`, dark `:422–431`).
- **r2 `accent-kinship.probe.ts`**: `instruments/accent-kinship.probe.MOVED.ts` (the tape row
  re-cut; OUT re-pointed to pass 4). The run also executed §3's other four rows by an over-broad
  `-g`. They're RED on both engines. They're r0's census subjects (the accent families'), not
  read here, and their raw JSON was deleted unbanked.
- **R2** stays stale by the fold's hand (`solver's answer` → `revealed answer`), not this lane's.
  L3 now reads GREEN on both trees.

## Ballots for the owner (U-10), both frames each

- **B-TAPE (this family's).** The name on the attribution tape is written in (a) the ring's string
  [DEFAULT, shipped] or (b) the digit's string (HEAD's form on this walk). Frame 4
  `frames/4-tape-ring-vs-digit-1280-dark-chromium-fine.png`: left (a), right (b), dark, real
  peer. (a) reads 5.308 dark / 11.707 light on the real node. (b) reads **3.065 dark**, under AA,
  so (b) can't ship without a different cure. (a) costs the name some chroma (ring chroma ≥0.0544
  vs the digit's ≥0.0749).
- **F1 (chair §6.8).** Your hand takes a room colour on the second known id: (YES) [default lean]
  or (NO) you stay the incumbent blue. Frame 3 `frames/3-f1-yes-vs-no-1280-light-chromium-fine.png`:
  left YES (your 3 in the walk's i=1 teal), right NO (your 3 in `#2563eb`). The peer's 5 is in
  i=0 in both, with B's ring round it. NO costs three units (gap 3).
- **The gestalt** (carried from pass 3, pictures gone; gap 5): four hands legible, eight not.
  The ΔE fall is between four and five.

## Frames (four, 234 KB, every one a replacement)

| file | engine · theme · viewport · pointer | retires (pass-3, all swept by the chair) |
|---|---|---|
| `1-ring-relay-desk-1280-light-dark-chromium-fine.png` (36.6 KB) | chromium · light \| dark · 1280×800 dpr 3 · fine (mouse) · ring from a relay peer round its own 7 | `ring-dark-shipped-vs-head.png` |
| `2-ring-relay-390x844-light-webkit-coarse.png` (67.8 KB) | webkit · light · 390×844 dpr 3 · coarse (`hasTouch`, witnessed) · after the dock sheet's open/close, settled | `four-hands-dark.png` |
| `3-f1-yes-vs-no-1280-light-chromium-fine.png` (91.2 KB) | chromium · light · 1280×800 dpr 3 · fine · F1 YES \| NO | `four-hands-light.png` |
| `4-tape-ring-vs-digit-1280-dark-chromium-fine.png` (38.7 KB) | chromium · dark · 1280×800 dpr 3 · fine (hover) · B-TAPE (a) \| (b) | `eight-hands-light.png` |

## Incidents (self-declared)

1. **Count mismatch, declared before any edit.** The charter says "10 modified + 2 new" (pass 2's
   replay count). The tree held 14 + 2, which matches the pass-3 README's list, so the tree was
   taken as the record.
2. My first desk probe failed twice on its own defects. It polled for zero rings while `hide()`
   had moved B's ring to another cell, and it expected `var()` in a computed custom property,
   which both engines substitute. My first phone probe assumed a cell above the open sheet (0/81).
   All three were fixed before any number was taken.
3. My first r2 re-cut printed 1.00 (a canvas can't parse `var(--peer-ring-l)`), and the over-broad
   `-g` ran four foreign rows (above).
4. `lint:sleep` RED on the pass-3 tree went unreported in pass 3. It was found and cured here.
5. The critic's "HEAD 4.232 → 2.813" tape pair were uncomposited readings (the tape's alpha
   dropped). Composited over the card: the digit string reads 2.993, HEAD 5.474.
6. `wrangler dev` wrote `web/relay/.wrangler/` (git-ignored). Deleted at return.
7. The relay arm ran against a LOCAL relay, not the production Worker; nothing reached the internet.
8. `prettier --write` was run on `e2e/peer-walk.spec.ts` (this family's own untracked file; `e2e/`
   isn't prettier-ignored in this tree). No other e2e file was written.
9. The built dist (`index-_PLR3gP2PHUZ.js`) that the goldens, the filter census and π ran on was
   cut before the last three edits. All three are COMMENT-ONLY (the `index.css` token comment and
   the rounding-budget sentences in `playerIdentity.ts` and `check-peer-arcs.mjs`). After them,
   the census battery re-ran green (17/17) and the family's units read 53/53. No rebuild.
10. The tree was edited three times for measurement and restored, each checked by `cmp`: the
    born-RED battery (seven controls, restore verified file by file), the F1 NO-arm frame (switch
    flipped over HMR, restored), and the 0.28 audition (both publishers, restored).
11. My dev servers on the relay arm and on 4244 ran the SOURCE. The built preview on 4246 is the
    only built arm, and the golden, filter and π rows read it.

## The replay route

In place. No replay: the chair's 2026-09-22 reset left the pass-3 record applied
(`git checkout` + `clean` + `git apply pass3.diff`), and `git diff --stat` at start read 14 modified
+ 2 untracked, 835+/84−, which is the pass-3 README's file list. This pass advanced on top, and
`pass3.diff` is untouched.
