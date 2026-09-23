# PAL-TIN · pass-6 prototype (§11c, the tin; PAL-WALK leads)

Work tree `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-2`.
Base and π control are **`74a2b5d9`**. Nothing is committed.

- The tree reads **17 files changed, +659/−82, plus 3 untracked**: `e2e/peer-tin.spec.ts` (802 lines),
  `scripts/check-peer-tin.mjs` (1,123) and `src/pencil/glyph/PlayerTick.vue` (127, unchanged).
- Pass 6 moved 8 files against the chair's `pass5.diff`: `index.css`, `playerIdentity.ts`, `GameBoard.vue`,
  `useSession.ts`, `useSession.test.ts`, `check-peer-tin.mjs`, `peer-tin.spec.ts` and `ci.yml`.

**Replay route: none, in place.** At the start, `git diff --stat` read 17 M +616/−82 plus 3 untracked. That matched the
pass-5 README file for file. I applied the chair's `pass5.diff` to a clean archive of `74a2b5d9`, and every file of
the pass-6 delta above diffs against that applied tree. No merge was made, so no line-count check was owed.

**Payload** on every browser row is `?board=ATMuMzkx…YxMDYx`. Every row asserts its decode:
`39167842.24..3.6.8678....3.1869273...593142864.2856917.63591.4.5.746289.924783.61`.

**Servers.** All ran on 127.0.0.1, and all were killed by recorded PID. Ports 4245–4248 read empty at return.

- **4245**: the lane's dev server. It had no watcher and ran with cacheDir `<scratchpad>/paltin6-cache/c94-2-dev`.
  It was restarted after the edit to L 0.86 and after each plant. Its PIDs were 1474, then 20186, then 54283/67442
  during the plants, then 69416.
- **4246**: the `w7-control` dist, verified as `index-CubiZsMVSwTc.js`.
- **4247**: this tree's dist, `index-BWeqCUo3HML5.js`.
- **4248**: a clean `git archive 74a2b5d9` in dev (room rows), with its cacheDir in the scratchpad.

I never git-touched the control tree. The pass-6 number is the critic's.

## Gaps first

1. **The glyph-text median at DPR 1 on the flipped top-row tape is under 4.5 for every ink, HEAD's included.** Chromium cell 8:
   - HEAD dark reads 3.916, and the name arms read 4.233–4.560.
   - HEAD light reads 2.832, and the name arms read 4.395–5.399.
   - At DPR 2 in both engines, and in WebKit at DPR 1, every name arm clears 4.5.

   So §2b asserts **glyph median ≥ min(4.5, HEAD's on the same cell, slug and run)** and a **fraction ≤ HEAD's + 0.05**.
   The strict statistic (spec vs painted ground, 0 px under 4.5) is asserted on every cell at every DPR.

   That is a lane's reading of LAWS P5 ("stated and bounded by the control's"). The chair may call it a re-wording. The
   raster limit belongs to the hand face (WALK's gap 3, the estate row), not to the ink.
2. **The first cut, at L 0.84, lost to HEAD on that same statistic.** At DPR 1 chromium cell 8 dark, pink read 4.005
   against HEAD's 4.099, with a fraction of 0.708 against 0.640.
   - That red is why the dark name arm is **L 0.86**, not the critic's 0.83.
   - It costs chroma. Amber drops to C 0.084 (peach), violet to 0.069 (lavender), and the min pairwise ΔE of the name arms is 0.098.
   - Superseded run: `readings/s2b-chromium-dpr2-L084-superseded.txt`. The DPR-1 failure lines are quoted in its head.
3. **A THIRD arm is a cost.** It adds ten declarations (five dark hexes and five light aliases of the ring arm), a third inline var on every inked cell, and gate rows.
   - The alternative is the chair's row: raise the dark ring pair to 0.86 so that ring = name. Priced below, it lifts the ring median about +0.7.
   - The fold keeps one.
4. **GATE 4's copy radius sits in a narrow window.** `COPY_DE` is 0.03.
   - The critic's drifted plants (C3/C5/C11, arms at L 0.32) sit at ΔE 0.025–0.027, so the closing sentence's "ΔE 0.02" would have let three of the eleven through.
   - The nearest innocent estate literal is the sun outline `#D16A32` at **0.0315**, and the gate prints it every run.
   - A future literal between 0.03 and 0.0315 of a player's stick reds by design.
   - Two shapes are claimed as declarations only, not as every expression: X3 (a computed name through `.join`) and a
     consumer. hsl() is parsed; `color(srgb …)` literals are not.
5. **L6 is WALK's.** Its pair half reads this tree's ring arms at 0.294–0.296 / 0.790–0.791 (true), and the 0.32 plant reds it.
   - Its formula half is false here by design, which is the section fork, so L6 reads RED on this tree.
   - WALK's L6 does not read the NAME arms. Their lightness is held by `lint:tin` 4b alone.
6. **The two F1 units that assumed YES now follow the switch.** Under NO, the index adoption in "a joiner's own
   publish agrees nothing" is not observable on your own row. That row is vacuous under NO, and the NO arm is proven only by
   "F1 is ONE switch" and by vue-tsc 0.
7. **Frame 1 (F1) stands from pass 5, shot with the URL arm (`&selfink=0`), which is now struck.** The NO arm is now the const. Both reach
   `withSelfInk`'s one branch, so the frame is the same code path. That is an argument, not a re-shoot.
8. **The frames are one composite.** One pass-6 crop holds four within-engine pairs. The slug is random per run, so it
   differs by engine (`key-cougar` / `foolish-vicuna`); every pair is within one engine.
9. **These estate and owner rows are handed on, not closed** (charter row 9):
   - **W2 §2.5.** 3/3/2 cells under the tape on both arms (pass-5 reading, not re-run). Cured by TAPE's clipped predicate
     (0/101 vs HEAD's 48/101) at the §10 fold, per chair §1.4 T9-R5, a loop-local label (A.4).
   - **The roster at sixteen** converges n−1: 15 on every page, 0/16 (pass-5 reading, one chromium run). That is the chair's row, not re-run.
   - **The lap-1 tally reads as a pipe.** On the tape in the frame below it is "key-cougar |"; it is the owner's eye.
   - **The DARK filter census** is red on both dists (next table). The cause is `svg.crayon-heart.idle saturate(0.85)`, inherited;
     the chair's deletion is a fold pick and is not in `74a2b5d9`.
   - **The relay and a real device** are W8 §8.3's.
   - **Goldens** were not re-run. π reads 0 built against built instead.
10. **The wave's image cap is RED on main.** `check-evidence-policy` reads 3,343,409 B against 2,097,152 B, bare exit 1. This lane adds 22,989 B.

## Numbers (control `74a2b5d9`)

### Row 1–2 · the dark name ink, painted (the gate cannot fail → re-cut with its negatives in the same run)

The name arms at night are `#ffc1a1 #b2e705 #00edf7 #c4ceff #ffb4f3` (L 0.86, each at its stick's hue, `min(0.215, chromaAt)`).
By day the name arm is the ring arm by alias.

**The feasible window.** The window is derived from the painted ground: the grid line under the washi paints rgb(81,78,76), Y 0.077.
That puts a name at Y ≥ 0.522 for 4.5. The arithmetic reproduces every measured number to the third decimal:

| ink | Y | arithmetic | measured |
|---|---|---|---|
| HEAD | 0.51 | 4.589 | 4.589 |
| ring pink | 0.45 | 3.92 | 3.921 |
| name pink | 0.604 | 5.139 | 5.139 |

**§2b** is room of six, B = page 6 = stick 1, lap 1 (so the tape carries a tick). Cells 11, 12 and the top-row 8, both themes. The one variable is the label's
`--color-user-ink`. The rows, in order, are:

- **HEAD**, the in-run control: `oklch(0.8|0.5 0.11 137.5)`.
- **The negatives**: dark ×5 is the pass-5 ring arm, and light ×5 is the stick.
- **The five name arms.**
- **The product's own binding**, asserted to be a name arm.

| dpr · engine | dark names: spec vs painted ground, worst (px < 4.5) | HEAD dark | dark negative (ring arm) worst | light names worst | HEAD light · light negative (stick) worst | exit |
|---|---|---|---|---|---|---|
| 1 · chromium | **5.139** (0 px, every cell) | 4.589 / 4.594 (0 px) | **3.921** (22–70 px per arm-cell; teal 0) | 7.960 (0 px) | 3.382 · **4.364** | 0 (7/7 whole file, 54.5 s) |
| 1 · webkit | **5.145** (0) | 4.594 (0) | **3.926** (22–67 px; teal 0) | 8.043 (0) | 3.418 · 4.410 | 0 (7/7 whole file) |
| 2 · chromium | **5.139** (0) | 4.589 (0) | 3.921 (72–209 px) | 7.960 (0) | 3.382 · 4.364 | 0 (51.1 s) |
| 2 · webkit | **5.145** (0) | 4.594 (0) | 3.926 (130–203 px) | 8.043 (0) | 3.418 · 4.410 | 0 (1.2 m) |

**The glyph-text statistic** is the core median at ≥ 50 % coverage, with the fraction under 4.5:

- DPR 2, dark names: chromium 6.1–7.0 (15–21 %), webkit about the same. HEAD reads 5.8–5.9 (21–23 %).
- DPR 2, light names: 11.9–13.1 (9–14 %). HEAD reads 5.07 (39–42 %).
- DPR 1, top row: gap 1.

**Noise** was 0 in every row. The second bare photograph was taken, and any pixel the two bare shots disagree on was dropped.

**Born-RED, same batch, this tree, both engines** (`readings/bornred.txt`; each plant restored sha1-equal, server restarted):

| plant | `lint:tin` bare | §2b chromium / webkit | reads |
|---|---|---|---|
| (a) dark name arms set to the ring arms (the pass-5 binding) | **1** (5 × 4b) | **1 / 1** | name peer-1 4.097, 39 px; peer-2 4.473; peer-4 4.213; glyph fraction over HEAD + 0.05 |
| (b) `hoveredAuthor` spreads the record as-is (the tape back in the stick) | 0 (not its subject) | **1 / 1** | "the tape's name is one of the five name arms" |
| restored | 0 | — | — |

### Row 3 · the tally tick on the tape, painted (stick 5 lap 1 covered by rebinding the one variable)

The tick is photographed ON / OFF / OFF / ON. Pixels either pair disagrees on are dropped. The core is ≥ 50 % of the most-moved pixel, read against its own ground.

| engine · dpr | dark name arms, core median (% < 3) | dark: stick 5, the pass-5 binding | light names | X1 opacity 0 · X2 stroke transparent · FAINT 0.15 |
|---|---|---|---|---|
| chromium 1 | 6.710–7.419 (0 %) | **2.982 (100 % < 3)** | 11.9–13.1 | no paint · no paint · **1.397** |
| webkit 1 | 4.595–4.963 (0 %) | **2.270 (100 %)** | 5.99–7.55 | no paint · no paint · **1.277** |
| chromium 2 / webkit 2 | 6.23–6.96 / 6.71–7.42 | 2.982 / 2.982 | 11.9–13.1 | no paint · no paint · 1.37–1.39 |

- **The assertion:** every name arm paints (top > 24, core > 4 px) with a core median ≥ 3.0.
- **The plants:** each must fail that assertion, and all three do.
- **The mechanism:** `hoveredAuthor` rebinds the anchor's `--color-user-ink` to the name arm. The label and `PlayerTick.vue:95` already
  read that var, so `GameBoard.vue`'s tape rule is back to HEAD's `color: var(--color-user-ink)`.
  `PlayerTick.vue` did not move. The roster tick still strokes the stick on the card: AA ≥ 5.178 (§2).

### Row 4 · GATE 4, re-cut on the COLOUR (`scripts/check-peer-tin.mjs`)

4a reads 249 files: `.css/.vue/.ts/.mts/.js/.mjs/.html` under `src/` and `e2e/`, plus `index.html`, with comments stripped. It reds on:

- any colour literal (hex 3/4/6/8, `rgb[a]`, `hsl[a]`, `oklch`) within **ΔE_ok 0.03** of any of the 30 published arms, whatever the name;
- a declared or templated peer token (`setProperty(\`--color-peer-${i}…\`)`, a computed key);
- a table of ≥ 2 colours under a peer/ring/hand/player/tin/stick name;
- a lightness-shaped identifier or nested key (`RING_L`, `ringL`, `peerInkLightness`…) bound to a number in (0, 1].

4b holds the rings at 0.295 / 0.79 and the names at 0.295 / 0.86.

**The critic's own `g4attack.sh`, run FIRST.** Its two delete calls became `mv`. It ran on an rsync copy of this tree:

- baseline exit **0**;
- A1, A2, A6 and **C1–C11**: every one exits **1**;
- C12 exits 0. Its plant is now the product line; the equivalent plant is born-RED (b) above.

**The plants on the TREE** (plant, run bare, restore):

- clean 0;
- C1, C2, C3, C4b, C4c, C5, C6, C7, C8, C9, C10, C11 and a name arm in `index.html`: every one exits **1**;
- clean 0, restored sha1-equal.

**`--self-test`** (`lint:tin`) has **34 controls**, each proved by adding a finding over a green baseline. It includes C1–C11, C4c, a new-colour
table under a player name, a name arm in `index.html`, name-arm gate 3/3b/4b controls and the ring ones. One green control also passes:
a consumer, a comment, a ternary with a minted name in VALUE position, and the spec's own `setProperty("--color-user-ink", …)` shape. Exit 0.

**Incident.** My first minted-token rule redded this family's own spec, a ternary
`` `var(--color-peer-${k}-ring)` : `` . The tree-plant run read "clean before exit 1", and I caught it there. The rule is now keyed on a template that
STARTS with `--color-peer-${`, and the green control carries the ternary.

### Row 5 · L6 (`readings/law-probe-r0-and-L6.txt`)

TIN's `law-probe.L6.TIN.PROPOSED.diff` is **struck by name**; the section keeps WALK's. I ran WALK's PROPOSED L6 unchanged:

| arm | pair | formula | L6 |
|---|---|---|---|
| this tree | true (0.294–0.296 / 0.790–0.791) | false | RED |
| **plant: the light ring arms at L 0.32 in `index.css`** | **false** (0.319–0.342) | false | RED |

r0's own probe (main's copy, the third R3 re-cut, FE re-pointed by env):

- tree: L1–L5 GREEN, **L6 MOVED** (GREEN → RED: `golden-angle walk: false`), R1/R2/R3 born-RED, exit 1;
- control: L1–L6 GREEN, R1/R2/R3 RED, exit 0.

L3 is spent.

### Row 6 · the light name, framed and argued

The light name arm is the ring arm, `rgb(75,29,0)` for amber and `rgb(36,50,0)` for green. Painted on the tape it reads 7.960–8.866 with 0 px under.
The alternatives on the same cells:

- the stick: 4.364–5.144, with 117–188 px under for green and teal;
- HEAD's ink: 3.382 / 3.418, with 43–332 px under.

The rationale is now in `index.css` (the name-arm comment in the light block) and `GameBoard.vue`'s tape rule; pass 5 argued only the dark case.
The frame is below.

### Row 7 · F1's switch

`export const SELF_TAKES_A_HAND: boolean = true` is in `useSession.ts`, next to `withSelfInk`, its one consumer. `?selfink` and
`selfTakesAStick()` are **struck**; `grep -r selfink src e2e scripts` returns 0.

**The files:** `useSession.ts` (the const) and `useSession.test.ts` (it imports the const). The F1 unit is re-cut to follow it, and so are the two units that hard-coded YES.

**Both arms:**

- YES: file 37/37;
- NO (the const planted false): vue-tsc -b 0 and file **37/37**;
- before the two units were re-cut, NO read 2 failed / 35.

### Row 8 · the battery (`readings/battery.txt`, each BARE, tree after the scratch left it | clean archive of `74a2b5d9`)

| row | tree | control |
|---|---|---|
| lint:lanes · lint:theme-tokens · lint:sleep | 0 · 0 · 0 | 0 (with `.github` in the archive) · 0 · 0 |
| test:e2e:projects · check-pw-projects | 0 · 0 | 0 · 0 |
| `eslint .` · **`npm run lint`** (CI's scoped prettier) | 0 · 0 | 0 · 0 |
| **bare `npx prettier --check .`** | **1** (68 files: the same 35 non-dist files as the control + 33 in the tree's ignored `dist/`) | **1** (35) — inherited, none of this family's |
| lint:tin · check-peer-tin bare | 0 · 0 | 1 · 1 (script absent at base) |
| check-copy-register bare · lint:copy | 0 (0 dashes, 0 unadmitted, lexicon 25) · 0 | 0 · 0 |
| lint:motion · theme-selectors · ink · catch · live-regions · tdz · e2e retries · boundary | all 0 | all 0 |
| typecheck:e2e · knip · `npm audit --audit-level=high` | 0 · 0 · 0 | 0 · 0 · 0 |
| vue-tsc -b | 0 | — |
| vitest chunked (games · pencil · composables) | 57/748 · 8/73 · 3/16 = **68 files / 837, 0 failed**; `useSession.test.ts` re-ran 37/37 after its last edit | — |
| undefined-token census (`pass6/instruments`) | 0 bare + 1 STALE (`--refuse-dur`, declared per A.1.4) | the same |
| check-property-block --self-test | 0 | 0 |

`peer-tin.spec.ts` ran as the WHOLE file at DPR 1: **7/7 chromium (54.5 s), 7/7 webkit**. §2b also ran at DPR 2 in both engines, green.

### π, BUILT vs BUILT (`readings/pi-built-vs-built.txt`)

The prototype dist is `index-BWeqCUo3HML5.js`: 43 files, 912 KB, `data-vite-dev-id` 0. It was built from a clean archive plus the diff OUTSIDE the tree,
and its src matches the tree except `useSession.test.ts`, which is not bundled. The control dist is `index-CubiZsMVSwTc.js`.

| cell (regime witnessed) | light | dark | ctl-vs-ctl | planted letter-spacing |
|---|---|---|---|---|
| desk 1280×800 FINE (coarse false, hover true) | 0 / 1155 | 0 | 0 | 81 |
| phone 390×844 COARSE `hasTouch` (coarse true, hover false) | 0 / 1115 | 0 | 0 | 81 |

The table holds in both engines. The roster at five (dev, colour excluded) reads 0 deltas over 22 nodes in both engines.

### Filter census, BUILT, both themes (`readings/filter-census-built.txt`)

| scheme | tree chromium / webkit | control chromium / webkit |
|---|---|---|
| light | 6/6 · 6/6 | 6/6 · 6/6 |
| dark | 4/6 · 4/6 (G3.1, G3.3: `crayon-heart saturate(0.85)`) | 4/6 · 4/6, identical — inherited |

### The chair's row, priced (`readings/ring-at-name-arm-0.86-chair-row.txt`)

The question is what raising the dark ring pair to 0.86 would buy, so that the ring arm and the name arm are one. I read §1's ring statistic with the name arms seated as the ring, at DPR 1:

- **dark core median**: 3.988–4.258 chromium and 3.993–4.258 webkit, with 23–29 % of pixels under 3;
- **today's 0.79**: 3.279–3.620;
- **light**: unchanged.

It would delete five declarations and the third key. It would also move the §2.4 pair, and that is not this lane's to land.

## Ballots for the owner (U-10), both frames on one payload

- **F1** (pass-5 frame 1, kept in SWEEP): `SELF_TAKES_A_HAND` YES | NO. Gap 7 covers the frame's URL arm.
- **B-TAPE, the ink half, with the lap-1 tally in both arms:**
  - Frame: `frames/1-b-tape-ink-and-lap1-tally-ring-or-stick-vs-name-arm-1280-dark-light-chromium-webkit-fine-dpr2.png` (22,989 B, pngquant).
  - Layout: rows 1–2 are chromium (dark, light), rows 3–4 webkit (dark, light). The LEFT column is the incumbent and the RIGHT is the name arm.
  - The shot: one room of six, B writes cell 11 (a given above), one hover. The one variable per pair is the label's `--color-user-ink`, which moves the name and the tick together.
  - Dark: ring arm `rgb(255,159,107)` | name arm `rgb(255,193,161)`. Light: stick `rgb(133,57,0)` | name arm `rgb(75,29,0)`.
  - Retires `prototype/PAL-TIN/frames/3-tape-name-stick-vs-ring-arm-1280-dark-chromium-fine.png` and
    `prototype/PAL-TIN/frames/2-tally-lap1-beside-its-word-1280-light-chromium-webkit-fine.png` (both swept in `pass5/SWEEP.md`).
  - I looked at it. The light name reads near-black olive-brown against the amber stick. The dark name is a paler peach than the ring arm. The single upright after the slug reads as a `|` in every panel.
- **The chair's row:** a third arm (this tree) or the dark ring pair raised to 0.86 (priced above).

## r0 / R6 rows

- **L6 MOVED** (tree GREEN→RED). TIN's PROPOSED L6 is struck, and WALK's PROPOSED L6 is the one landing. It was run here with its 0.32 plant.
- L1–L5 are GREEN on both arms. L3 is spent. R1/R2/R3 are born-RED on both.

## Incidents (self-declared)

1. **The first §2b run went red on the instrument, not the product.** The label's override was set on the ANCHOR, and Vue re-patched
   `--color-user-ink` on a session re-render mid-row (expected pink, received amber). The override now sits on the label, whose inline style carries no such key.
2. **The L 0.84 cut shipped to one run before the DPR-1 whole file redded it.** The dark name arms moved to 0.86, and a
   running WebKit job on the 0.84 server was stopped (TaskStop). No number from it is cited.
3. **The first control battery ran `lint:lanes` against an archive without `.github`**, which exits 2 by design. It was re-run with `.github` and exits 0.
4. **The first build from the archive failed** because it was missing `csp-solver/data` (the templates plugin). The data was added from the same commit, and it rebuilt clean.
5. **A command carried the text of the critic's two delete calls inside a python replacement string.** Nothing was deleted, and no call was held. I note it under the no-rm law.
6. **`vue-tsc -b` wrote its build info through the shared `node_modules` symlink,** which is main's. That is a cache, as every lane's is.
7. **Scratch.** `.paltin6/` (configs, scratch specs, logs) lived in `web/frontend/` during the pass and was `mv`ed to
   `<scratchpad>/trash-paltin6-5/`. Plant files went to `trash-paltin6-{1..4}`, and the dist was built outside the tree.
   `git status` at return lists the 17 M + 3 ?? product files only.

## What moved this pass (product)

- `src/assets/index.css`: five `--color-peer-N-name` per theme. By day each is an alias of the ring arm; at night they are L 0.86 hexes. The comments argue both themes.
- `src/games/shared/playerIdentity.ts`: `TIN_NAME` and a third key `--color-peer-name-ink` in `inkFor`.
- `src/games/shared/GameBoard.vue`: `hoveredAuthor` binds the anchor's `--color-user-ink` to the name arm, and the tape rule is back to HEAD's line.
- `src/games/shared/useSession.ts`: `SELF_TAKES_A_HAND` replaces `?selfink`.
- `scripts/check-peer-tin.mjs`: name arms in gates 3/3b/4b, GATE 4a on the colour, and 34 controls. `ci.yml`'s comment was updated.
- `e2e/peer-tin.spec.ts`: §2 reads the name arm, and §2b is re-cut. It asserts 4.5 on text, uses HEAD as the in-run control and the pass-5 binding as the in-run negative, takes a second bare photograph, and adds the glyph statistic, the painted tick and the X1/X2/FAINT plants.
- `src/games/shared/useSession.test.ts`: the units follow the switch.
