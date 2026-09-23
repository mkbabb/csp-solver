# PAL-TIN · pass-5 prototype (§11c, the tin; PAL-WALK leads)

Work tree `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-2`,
base and π control **`74a2b5d9`**, nothing committed. **17 files changed, +616/−82, plus 3 untracked**
(`e2e/peer-tin.spec.ts` 679 lines, `scripts/check-peer-tin.mjs` 909, `src/pencil/glyph/PlayerTick.vue` 127).
Pass 4 was 19 files +611/−83: `pencilConfig.ts`, `DifficultyTally.vue` and `e2e/node.d.ts` left the diff
(reverted to base, byte-identical); `scripts/check-pw-projects.mjs` joined it (+1 line, the manifest).

**Replay route: none, in place.** At start `git diff --stat` read 19 M + 3 untracked, which matched the
pass-4 README file for file and the chair's `pass4.diff`. No apply, no merge, so no line-count check was owed.

Payload on every browser row: `?board=ATMuMzkx…YxMDYx` (PAL-WALK's, minted with the app's codec from the
control's deal; decodes to `39167842.24..3.6.8678....3.1869273...593142864.2856917.63591.4.5.746289.924783.61`).
Every row that opens a board asserts that decode (π, the spec's `boot`, the frames, the crossing).

Servers, all 127.0.0.1, killed by recorded PID at return: 4245 lane dev (cacheDir
`<work>/.vite-cache-paltin5-dev`, deleted), 4246 the `w7-control` dist (verified `index-CubiZsMVSwTc.js`),
4247 the control tree in dev, read-only, cacheDir in the scratchpad, no HMR (room rows), 4248 this tree's dist.
4237 and 4239–4244 were siblings' and were left alone.

The pass-5 number is the critic's.

## Gaps first

1. **The dark tape name is under 4.5 painted, and the cure is the paper, not the ink.** With the name in the
   ring arm the ink reads **5.111–5.872** on the tape's flat paper (asserted, §2). Painted over the grid line
   and the given under the translucent washi it reads **3.921** worst chromium / **3.926** webkit (peer-5),
   with 183–199 px per arm under 4.5 in chromium and 467–542 in webkit (peer-3 is clean). §2b asserts the
   non-text floor 3.0 and prints the rest. The lift is PAL-WALK's B-TAPE arm (the washi laid on the card),
   which this tree doesn't take: it's a ballot and an estate row (chair §1.4), not this family's to land.
2. **W2 §2.5 is RED on both arms and unchanged.** The tape covers 3 interactive cells (2 in the top-row flip)
   on this tree and on the control, both engines. Numbers under row 9. It's the fold's surface or T9-R5.
3. **The sixteen-player census**: see row 7. It's an estate row, not this family's.
4. **The lap-1 tally still reads as a pipe.** Frame 2 shows it beside its word in both engines. The crop
   answers nothing; it's for the owner's eye.
5. **L6 moves on this tree and the section has one L6.** WALK's re-cut reads RED here by design (it is the
   walk's law). A tin-arm re-cut is PROPOSED beside it; the fold keeps one.
6. **Goldens weren't re-run.** π reads 0 deltas built against built at two cells, both themes, both engines
   (below), and the critic's pass-4 goldens were 4/4. This pass's product moves are two ring-arm values and
   one tape `color` line, both in a room, none on a solo golden's surface. That's an argument, not a run.
7. **F1's switch name vs WALK's.** This tree reads `?selfink=0` (`selfTakesAStick()`); WALK exports
   `SELF_TAKES_A_HAND`; PLR-SELF's substrate has `SELF_TAKES_ROOM_INK`. Three spellings of one ballot. The
   fold picks one.
8. **The relay and a real device** remain W8 §8.3's.

## Numbers (control `74a2b5d9`)

### The charter's rows

| # | row | reading on this tree | control / negative |
|---|---|---|---|
| 1 | `lint:theme-tokens` + `test:e2e:projects` | **both exit 0.** `--peer-ring-l` is deleted from both arms of index.css (a table has no scalar to publish; nothing on the page consumed it). The pair moves into the gate as `RING_PAIR = { light: 0.295, dark: 0.79 }` and gate 4b holds every ring arm's OKLab L within ±0.005 of it. `peer-tin.spec.ts` is in SPEC_MANIFEST (35 specs, 561 resolved tests) | control 0 / 0 (34 specs, 547). Break-test B2 (index.css grows `--peer-ring-l` again): `lint:tin` 1 and `lint:theme-tokens` 1, restored sha1-equal |
| 2 | GATE 4 re-cut | Takes WALK's check 4 shape: reads 248 `.css/.vue/.ts/.mts` files under `src/` and `e2e/`, with comments stripped. It reds on any second publisher, whether it agrees or disagrees: a `--color-peer-N[-ring]` or `--peer-*-l` declared outside index.css (CSS rule, quoted style key, `setProperty`); a band literal under a ring/band/peer/hand name; a hex table under a peer/ring/hand/player name; a tin hex spelled in code. In index.css it checks each token once per arm and no `--peer-*-l`. The line prints the COUNT of spelled hexes now (0), not a literal. **On its first run it found this family's own spec** (`WALK_RING`, five hexes) | Self-test: **16 controls**, each proved by ADDING a finding over the baseline (a tree already red can't pass a control by being red): A1, A2, A4, A5, A6, B1, B2, a spec `setProperty`, a spelled hex, 4b (ring arm moved L +0.02), plus the six gate-1–3b controls. A consumer and a comment leave the count unmoved. On the TREE (edit, run bare, restore sha1): A1 exit 1 · A6 exit 1 · B2 exit 1 · restored 0 |
| 3 | THE RING under §2.4 | The dark ring arms are re-cut to **L 0.79** (the section's pair; the light arms were already 0.295): `#ff9f6b #9ecf00 #00d4dd #a8b5ff #ff87f0`. The rule is the same `min(0.215, chromaAt(L,h))`, and gate 3b's worst hue is 0.879°. §1 is re-cut to the section statistic: each arm's photograph is ring-OFF / ON / OFF, the core is pixels ≥ 50 % of the most-moved, boil noise is dropped, and it asserts **median ≥ 3.10** on all five arms in both themes. **Its negative control is in the same run**: the stick's own lightness in the same ring must read < 3.0 (min 2.450 light, 2.266 dark). The old arithmetic §1 and the max-pixel §1b are deleted, along with the WALK_RING arm. Table below | Break-test (a): light arms at L 0.32 → §1 **RED both engines** (peer-2 median **3.024**, the critic's figure to the digit), `lint:tin` 4b RED; restored sha1-equal, green |
| 4 | AA on the tape | The name is written in the RING ARM (`GameBoard.vue`: `color: var(--color-peer-cursor-ink)`, the same line WALK's tree carries). §2 asserts the ring arm vs the tape's flat paper ≥ 4.5: light 11.875–13.089, dark **5.111–5.872** (the stick on the same paper: 2.977–3.494; HEAD's own blue 4.231). §2b is WALK's painted-text instrument: text-transparent OFF shot, noise shot, Range clip, sensitivity row. It covers five arms × 3 cells × 2 themes. Light painted 7.960–8.866, 0 px < 4.5. Dark painted worst 3.921 ch / 3.926 wk, asserted ≥ 3.0 and the rest printed (gap 1) | Break-test (b): name back in the stick → §2b **RED both engines** (painted worst **2.662**, and the spec ≠ ring), restored sha1-equal |
| 5 | F1 on one payload + `?selfink=0` unit | Frame 1: a real two-page `?wire=local` room, A writes 11/14 and B writes 12/16 (solved digits), the same cells in both arms, and B's cursor is on 16 in both. The one variable is `&selfink=0` on A's URL (the invite keeps it: read back `0`). YES: A's digits `rgb(133,57,0)` (`--color-peer-1`); NO: `rgb(37,99,235)` (house blue); B's `rgb(69,92,0)` in both. The same in both engines. **Unit landed**: `useSession.test.ts` "F1's NO arm" runs both arms in one test (each is the other's control) | Break-test (c): switch welded true → the unit **RED**, restored sha1-equal, green |
| 6 | residue | `DRAW_IN_PRESETS.tally` hoist **reverted**: `pencilConfig.ts` and `DifficultyTally.vue` are byte-identical to base, so the stale consumer list is true again. The ci.yml block now says six gates and sixteen controls, counted against the baseline | — |
| 7 | struck row, density, sixteen | `.glyph-tick 0` is **deleted** from the spec (it was `0 === 0`). The ring is read at **dpr 1/2/3, both engines** (table). The sixteen census is in the row below the ring table | — |
| 8 | the lap-1 tally | Frame 2: the sixth player's row, the tick beside its word, both engines. One stroke, w 31.59 × h 14.05, gap 4.9 px after the slug, stroke `rgb(133,57,0)`. It reads as a pipe | Owner's eye (U-10) |
| 9 | W2 §2.5 | Crossings are clipped to every clipping ancestor and the viewport. It is unshared authors, the same three cells on both arms. Tree: **3 / 3 / 2** interactive cells under the tape (cells 11, 12, top-row 8), chromium 4,364.19 / 4,364.19 / 3,384.88 px², webkit 3,019.26 / 3,019.26 / 2,686.39. Control: **3 / 3 / 2**, chromium 4,214.62 / 4,214.62 / 3,326.69, webkit 3,758.61 / 3,758.61 / 3,101.94. The count doesn't move; the area follows the SLUG, which is random per peer id and is the uncontrolled variable (tape width 128.18 vs 122.11 ch, 90.82 vs 108.99 wk). The tally's +41.6 px (pass 4) was not re-measured | the chair's class row |
| 10 | the PNG decoder | **Deleted.** The spec decodes a screenshot with the browser that took it (`drawImage` → `getImageData`, WALK's form). The 60 lines, the `node:zlib` import and `e2e/node.d.ts`'s declaration are gone. There's nothing left for a test to cover | — |

### THE RING, core median (all five arms; ring-off subtracted; worst arm shown)

| engine · dpr | light worst (arm) median · p30 · <3.0 | dark worst (arm) median · p30 · <3.0 | the stick in the same ring, min |
|---|---|---|---|
| chromium 1 | peer-2 **3.163** · 2.472 · 41.7 % | peer-5 **3.279** · 2.589 · 40.0 % | 2.450 / 2.266 |
| chromium 2 | peer-2 **3.163** · 3.163 · 21.5 % | peer-5 **3.279** · 3.279 · 19.4 % | 2.450 / 2.266 |
| chromium 3 | peer-2 **3.163** · 3.163 · 13.5 % | peer-5 **3.279** · 3.279 · 12.5 % | 2.450 / 2.266 |
| webkit 1 | peer-2 **3.133** · 2.543 · 39.1 % | peer-5 **3.277** · 2.718 · 37.1 % | 2.450 / 2.274 |
| webkit 2 | peer-2 **3.133** · 3.133 · 23.8 % | peer-5 **3.277** · 3.277 · 18.9 % | 2.450 / 2.274 |
| webkit 3 | peer-2 **3.133** · 3.133 · 15.3 % | peer-5 **3.277** · 3.277 · 14.0 % | 2.450 / 2.274 |

Full medians (every dpr, chromium): light 3.283 / 3.163 / 3.171 / 3.718 / 3.591 and dark 3.380 / 3.615 /
3.573 / 3.441 / 3.279. The sensitivity row at 50/70/90/100 % is printed per arm in
`readings/ring-core-dpr123-both-engines.txt`. The median doesn't move with density; the p30 and the share
under 3.0 do, and at dpr 1 the p30 is 2.47–2.72. That's the stroke's fringe, the same as WALK's (2.444–2.749).
**The §2.4 pair read on this tree:** light 0.295 → 3.133 webkit / 3.163 chromium; dark 0.79 → 3.277 /
3.279. Both clear 3.10 in both engines. WALK's reading of this tree at the old dark 0.775 was 3.125/3.127.

### The sixteen-player census (estate row)

Sixteen pages in one context on `?wire=local` (dev, chromium, one run): after a 151 s poll every page's roster
read **15, 15, … 15; converged 0/16**. It's the same n−1 shape pass 4 found at 9/10/12/16 (every page is one
row short). The tin is not the subject (the roster's `hi`/snapshot convergence is). It goes to the chair again
with this number and wasn't chased further.

### π, BUILT vs BUILT (`readings/pi-built-vs-built.txt`)

The prototype dist is `index-BTCGPGfzWmgp.js` (43 files, `data-vite-dev-id` 0). It was built from a clean
`git archive 74a2b5d9` plus this tree's diff, OUTSIDE the work tree (its `src/` is `diff -rq`-identical), so
no scratch was a Tailwind source. The control is the `w7-control` dist `index-CubiZsMVSwTc.js` (43 files).
The census covers every `body *` node × 22 computed paint properties + tag + rect.

| cell | regime (witnessed, both arms) | light | dark | control-vs-control | planted 1 px letter-spacing |
|---|---|---|---|---|---|
| desk 1280×800 FINE | coarse false, hover true | **0** / 1155 nodes | **0** | 0 | 81 |
| phone 390×844 COARSE (`hasTouch`) | coarse true, hover false | **0** / 1115 nodes | **0** | 0 | 81 |

The same in both engines. The roster at five (dev arms, `?wire=local`, colour/stroke/fill excluded because the
palette is the claim) reads **0 deltas** over 22 nodes in both engines.

### The filter census

The estate's `filter-census.spec.ts` against BOTH built dists (light, the spec's regime): prototype **6/6
chromium, 6/6 webkit**; control 6/6, 6/6 (G3.1 census equals `filterBudget.ts` exactly, G3.3 coarse, G3.5
hover both regimes, G3.2 both rows). The tree adds no filter. The DARK arm is ACC-SIX's born-RED (chair §1.4)
and was not run here.

## Ballots for the owner (U-10), both frames on one payload

- **F1** (chair §6.8, the section's lean YES): your digits take a stick once a second player is known (YES)
  or stay the house blue (NO, `?selfink=0`). Frame 1: chromium on the top row, webkit on the bottom, YES on
  the left and NO on the right. The one variable is the switch; the board, cells, writers, B's cursor and A's
  parked focus are held. Look at cells 11 and 14 (the 5 and the 9): amber vs blue. B's 1 and 7 are green in
  both.
- **The lap-1 tally** (row 8): frame 2, the sixth player's row. It isn't a pair. It's the pose the owner is
  asked about: does one upright read as "the second amber" or as a separator? The section's fork (five sticks
  vs the walk) is WALK's frame 4 on the same payload; this tree adds nothing to it.
- **B-TAPE** (WALK's): this tree answers the INK half. Frame 3 shows the dark tape over a grid line with the
  name in the stick (left, `rgb(121,159,0)`) and in the ring arm (right, `rgb(158,207,0)`), one hover on one
  cell, with the binding the only variable. The PAPER half (translucent vs laid on the card) is WALK's pair.

## Frames (3, 63,745 B; each a replacement)

| file | engine · theme · viewport · pointer | retires (pass4/SWEEP.md) |
|---|---|---|
| `frames/1-f1-yes-vs-no-1280-light-chromium-webkit-fine.png` (53,529 B) | chromium (top) + webkit (bottom) · light · 1280×800 dpr 2, scaled 42 % · fine. Every pair is within one engine | `prototype/PAL-TIN/f1-yes-self-takes-a-stick-light.png` and `prototype/PAL-TIN/f1-no-self-in-house-ink-light.png` |
| `frames/2-tally-lap1-beside-its-word-1280-light-chromium-webkit-fine.png` (2,296 B) | chromium (top) + webkit (bottom) · light · 1280×800 dpr 2 · fine. The slug differs by engine (a random peer id), which is uncontrolled and not a pair | `prototype/PAL-TIN/roster-seven-tallies-light.png` (WALK's frame 4 also names it; the chair picks) |
| `frames/3-tape-name-stick-vs-ring-arm-1280-dark-chromium-fine.png` (7,920 B) | chromium · dark · 1280×800 dpr 2 · fine (hover on cell 12). The webkit pair was shot, reads the same bytes (`121,159,0` vs `158,207,0`) and isn't banked | `prototype/PAL-TIN/tape-tick-dark.png` |

## Battery (registry-v4 §2.11), each bare, tree beside control

| row | tree | control `74a2b5d9` (clean archive) |
|---|---|---|
| lint:lanes · lint:theme-tokens · lint:sleep | 0 · **0** · 0 | 0 · 0 · 0 |
| test:e2e:projects · check-pw-projects (check 8 FLOOR BAND ✓) | **0** · 0 (35 specs, 561 tests) | 0 · 0 (34 specs, 547) |
| `eslint .` · `prettier --check` | 0 · 0 | 0 · 0 |
| lint:tin (--self-test, 16 controls) · check-peer-tin bare | 0 · 0 | 1 · 1 (the script isn't at base: module not found) |
| check-copy-register bare · lint:copy | 0 (0 dashes, 0 unadmitted, lexicon 25) · 0 | 0 · 0 |
| lint:motion · lint:theme-selectors · lint:ink · lint:catch · lint:live-regions · lint:tdz · test:e2e:retries · lint:boundary | all 0 | all 0 |
| typecheck:e2e · knip · `npm audit --audit-level=high` | 0 · 0 · 0 | 0 · 0 · 0 |

No inherited red. The battery ran on the tree AFTER the scratch left it (`readings/battery.txt`).

`e2e/peer-tin.spec.ts`, WHOLE file, dpr 1 (the estate's density): **7/7 chromium (30.5 s), 7/7 webkit
(52.4 s)**. §1 and §2/§2b were also run at dpr 2 in both engines (3/3 each), and §1 at dpr 1 and 3.
vue-tsc 0. typecheck:e2e 0. vitest chunked: `src/games` 57 files / 748, `src/pencil` 8 / 73,
`src/composables` 3 / 16 = **68 files / 837, 0 failed** (+1 on pass 4: the F1 unit). The `src/lib` chunk
has no test files (vitest exit 1, "no test files"). That's a chunking artifact, not a red.

## r0 / R6 rows

- **L6 MOVED** (unchanged from pass 4): r0's probe reads L6 `GREEN RED` here (`golden-angle walk: false`),
  GREEN on the control. WALK's pass-5 L6 PROPOSED reads RED here too (`--peer-ring-l arms: none`). That's
  its law, the walk's. The **tin arm** is `instruments/law-probe.L6.TIN.PROPOSED.diff`: a table with a gate,
  ring arms at the pair, read as a VALUE from gate 4b's `RING_PAIR`. It reads GREEN here, RED on the control
  (no tin) and RED on a plant (the pair set to 0.775). See `readings/law-probe-L6-TIN-recut.txt`. The fold
  keeps one of the two L6 rows.
- L1–L5 GREEN on both trees. R1/R2/R3 born-RED on both (not this family's). Probe exit 1 on the tree (L6),
  0 on the control.
- L3 spent (the chair's pass-4 act). The hue-census tail travels with L6.

## Incidents (self-declared)

1. **My runner's first density call ran nothing.** `for eng in ${ENGINES:-chromium webkit}` doesn't
   word-split in zsh, so Playwright was handed `--project "chromium webkit"` and exited 1. I caught it from
   the log, fixed it (`${=ENGINES…}`) and re-ran. No number came from the dead call.
2. **The first GATE 4 self-test was weak.** The controls were judged by "the gate is red", on a baseline
   that was already red (WALK_RING), so every control "passed" trivially. They're now judged by COUNT over
   the baseline, and the baseline is green.
3. **`typecheck:e2e` went red once** on `png: Buffer` (the e2e project declares `Buffer` as a value only).
   It's typed structurally now and exits 0.
4. **A frame looked identical by eye.** The stick-vs-ring tape pair downscaled to what looked like the same
   green. The bytes differ (743 px at `121,159,0` vs `158,207,0`), and the caption states the colours.
5. **The crossing's tape width varies with the slug.** The peer id is random per run, so tree-vs-control
   area differs by the slug. The crossed-cell COUNT is the claim.
6. **Scratch.** The `.paltin5/` configs, instruments and logs, and `.vite-cache-paltin5-dev` at the work tree
   root, lived in the tree during the pass. Both are deleted, and `git status` is product files only (below).
   The dist was built outside the tree.
7. **The control tree in dev** (4247) was served from an external config with its cacheDir in the
   scratchpad and no HMR. Its `git status` was not touched by me (read below).
8. **The wave's image cap is RED, and I added 63,745 B to it.** `scripts/check-evidence-policy.mjs` on main,
   run bare, exits 1: per-wave 3,048,219 B against 2,097,152 B. It was already over before this lane (WALK
   declared 2.77 MB). The chair sweeps pass 5 at its fold; my three crops are the only images here.
9. **The sixteen census took the box for ~4 minutes** (16 dev pages) and ran once, in chromium only.

## What moved this pass (product)

- `src/assets/index.css`: `--peer-ring-l` deleted (both arms); the dark ring arms re-cut to L 0.79; the
  comments re-cut to the pair.
- `src/games/shared/GameBoard.vue`: the tape's name is `var(--color-peer-cursor-ink)` (the ring arm).
- `scripts/check-peer-tin.mjs`: GATE 4 re-cut (4a one publisher over src/+e2e/, agree or disagree; 4b the
  pair); controls counted against the baseline; 16 controls.
- `scripts/check-pw-projects.mjs`: `peer-tin.spec.ts` in SPEC_MANIFEST.
- `e2e/peer-tin.spec.ts`: payload-pinned; §1 re-cut to the core statistic with its in-run negative control;
  §2 asserts the ring arm on the tape's paper; §2b the painted name (new); the tripwire, the arithmetic §1,
  the max-pixel §1b, WALK_RING and the PNG decoder deleted.
- `src/games/shared/useSession.test.ts`: the F1 NO-arm unit.
- `.github/workflows/ci.yml`: the block's comment.
- Reverted to base: `pencilConfig.ts`, `DifficultyTally.vue`, `e2e/node.d.ts`.
