# PAL-WALK · pass-6 prototype (§11c, the hue walk; the palette's leader)

The work tree is `.claude/worktrees/wf_308fa864-c94-1`. Base and π control are **`74a2b5d9`**, and the work is uncommitted.

**Replay route: in place, no replay.** At the start, `git diff --stat` read 16 files modified, +1068/−89, plus 2 untracked. That matches the pass-5 README
and the chair's `pass5/prototype/PAL-WALK/pass5.diff`. It now reads **16 files modified, +1072/−89, plus 2 untracked**:
`e2e/peer-walk.spec.ts` at 1,110 lines and `scripts/check-peer-arcs.mjs` at 1,137.

Pass 6 touched four files:

- `e2e/peer-walk.spec.ts`
- `scripts/check-peer-arcs.mjs`
- `src/games/shared/BoardHost.authors.test.ts`
- `src/games/shared/useSession.test.ts`

No product source moved. The shipped bytes are unchanged, too: the dist rebuilt from a clean archive is **byte-identical** to pass 5's
`index-iqdYCvIZwvfI.js` (43 files, `diff -rq`).

These are the servers I ran, all on 127.0.0.1. Each was killed by its recorded listener PID:

- 4244: the lane's dev server, watcher-free (`vite.frozen.mts`), restarted after each plant.
- 4245: the HEAD control dist, `index-CubiZsMVSwTc.js`, previewed. The control tree was not built, edited or git-touched.
- 4246: the control at `74a2b5d9` in dev, served from a `git archive` copy with node_modules symlinked.
- 4247: PAL-TIN's tree `c94-2` in dev, read-only, with the cache outside it.
- 4240: my rebuilt dist, `index-iqdYCvIZwvfI.js`.

The pass-6 number is the critic's.

## Gaps first

1. **The §C instrument's last red was the board's frame boil, and the cure is in the instrument.** The product is unchanged.
   The second bare photograph dropped the transients: WebKit cell 8 had read 1.21–3.0 on one to three pixels per run. Then two more classes survived.
   - **The ABBA frame.** At WebKit's top-row flip, the tilted tape's bounding box overhangs its paper onto the board frame's stroke. A frame variant that
     swaps between ink→bare and swaps back between bare2→again survives both noise pairs. Batch 2 went red on runs 9 and 10 this way:
     (759.3,205.9) over violet, reading 3.005, and (765.8,205.2) over gray, reading 3.721.
   - **The same corner, inside the line rule.** The on-the-ink-line rule (residual > 24 dropped) cured those two. Batch 3 then went red on run 2 at
     (764.3,206.2), reading 1.121: one pixel at coverage 0.22. The name's colour and the stroke are both dark there, so the residual was 21.3 and the rule
     admitted it.

   The cure is that §C's two pages are now **frozen at the test** (`emulateMedia({ reducedMotion: "reduce" })` before goto; MRK-LIVE's graft). The tape, its
   paper and the name aren't motion-gated, and the file's `PRM:` head says so (lint:motion green). After the freeze, every photograph in the batch read
   **noise 0 · off the ink line 0**, so the second bare shot and the line rule now stand as guards that fire on nothing.

   The charter's "if the dark ground is real paint, cure it in the product" does not apply. Every dark pixel was the frame, not the name's ground:
   `diag` runs found 0 off-paper glyph pixels in stable runs.
2. **The pass-5 "5.604 chromium / 5.691 webkit" is two SLUGS, not two engines.**
   - With B's peer id pinned, one payload reads one number in both engines. `quickest-rodent` reads 5.691 in both.
   - `quintessential-guineafowl` reads 5.604 in chromium and 5.691 in webkit. The row is restated per payload and per engine below.
   - A seeded `Math.random` pinned the slug in chromium only, because WebKit's boot draws a varying count first. The pin is now the product's own per-tab identity map.
3. **The glyph-text statistic is printed, not asserted.** That is the painted glyph pixel against its own ground, core median at ≥ 50 % coverage.
   - It is the estate's row (pass-6 chair rulings §1.4/A.4), and at dpr 1 in chromium it moves with the slug's letters: dark 4.01–4.82 over the slugs read.
   - The control's own name reads 4.078–4.241 there.
   - At dpr 3 the core median is 5.629–5.691 dark and 11.891 light on this tree, in both engines.
4. **TIN's `?selfink` still reads the URL** on its own tree (`c94-2`, `useSession.ts:680`). PLR-SELF's pass-6 substrate names `SELF_TAKES_A_HAND` (7 hits, 0
   `SELF_TAKES_ROOM_INK`), and so does this tree, so two of the three publishers now agree. Re-pointing TIN's switch is TIN's or the fold's job. I read its tree and did not write to it.
5. **The DARK filter census is red on the control too.** Tree and control both exit 1, in both engines, on exactly `svg.crayon-heart.idle saturate(0.85)` ×2
   (G3.1, G3.3). The red is inherited: the chair's `crayon-heart` deletion is not in `74a2b5d9`, so neither tree carries it. LIGHT reads 6/6 on both.
6. **Check 4 claims declarations, not every expression.** Two attacks stay green on purpose:
   - **X3:** a computed name through `setProperty` (`["--color-peer", "cursor-ink"].join("-")`).
   - **X7:** a consumer rebinding a stroke to the ink, which is out of the claim.

   There is also C8: a 3-digit hex can't be told apart from the walk. 447 of the 576 walked inks have a 3-digit neighbour within the copy tolerance (ΔE_ok 0.02).
   So clause (vi) prices 3-digit literals and does not red them. Nearest 0.0000, median 0.0143, worst 0.0279.
7. **The frames are chromium only.** Each is a real room on one payload, but I didn't shoot a WebKit twin. The numbers behind every frame are both engines.
8. **Tier 3 stays a local instrument (O-12).** CI sees check 1/3/4 (`lint:arcs`) and the tier-2 units, not the photographs.
9. **The cured undefined-token census reds this tree on the tape's name.** It flags `GameBoard.vue:1246`, where `color: var(--color-peer-cursor-ink)` is bare.
   The ink is BoardHost's style object, spread inline on `.attribution-tape`, which is the pass-4 ruling that it is consumed bare.
   - I filed the fourth ledger row in the chair's A.3 form: `instruments/undefined-token-census.tape-row.PROPOSED.diff`.
   - It reads LIVE here (0 bare) and STALE on the control, as a declared row should (`readings/census-tape-row.txt`).
   - I did not apply it. The integrator carries it.

## Numbers (control `74a2b5d9`, board payload `ATMuMzkx…YxMDYx`, B's id pinned)

Every browser row loads ONE encoded board. Both arms assert its decode:
`39167842.24..3.6.8678....3.1869273...593142864.2856917.63591.4.5.746289.924783.61`. The tape's name is B's slug, so every name row also states B's id:

- **p-0000000b0b0b → `quickest-rodent`**, 15 letters.
- **p-00000000002e → `quintessential-guineafowl`**, 25 letters.

B's id is pinned through the product's own `session-identity-v1` map, keyed by the room the link names.

### Row 1 · §C, the born-RED and its negative in ONE batch

This is batch 4, `instruments/bornred6-final.sh`. The spec sha is `a79bc215…` and `GameBoard.vue` is `14ae9702…`. Each plant was restored sha1-equal, and the listener was restarted after each one.

| arm | chromium dpr 3 | webkit dpr 3 | reading |
|---|---|---|---|
| (a) paper back to translucent | **RED** | **RED** | dark cell 11: **4.359** (240/4,673 px < 4.5) / **4.364** (237/4,168), at (307.7,165.4) / (304.7,166.2), ground rgb(81,78,76), the grid line under the paper |
| (b) `-webkit-text-fill-color: transparent` | **RED** | **RED** | "the name paints": core 0 px of a 4 % floor |
| (c) the label's `opacity: 1` → `0` | **RED** | **RED** | "the name paints": 0 px |
| negative, whole file, webkit dpr 3 ×**10** | — | **10/10 green** | dark 5.691 · light 11.891 on both payloads, **0 px < 4.5**, **noise 0 · off the ink line 0** in every run |
| negative, whole file, chromium dpr 3 ×3 | **3/3 green** | — | dark 5.691 / 5.604 · light 11.891 / 11.793 (quickest / quintessential), 0 px, noise 0 |
| negative, whole file, dpr 1 and dpr 2 | green, green | green, green | the same spec-vs-ground numbers at every density. Noise is 0, except chromium dpr 1 at 24–25 px, which were dropped |

**The WebKit top-row flip (cell 8) reads 11.891 light / 5.691 dark in all ten runs.** Per-row detail is in `readings/bornred-batch4.txt`.
**The glyph-text statistic, printed:**

- dpr 3, core median: dark 5.691 (webkit), 5.629–5.691 (chromium); light 11.891–11.899.
- dpr 3, fraction of core under 4.5: 0.028–0.145.
- dpr 1 chromium: dark 4.010–4.769, fraction 0.44–0.75. That is gap 3.

**What was chased, in order (the incidents, as numbers):**

- **Batch 2 (live motion, second bare shot):** WebKit runs 9 and 10 red at light cell 8, 3.005 and 3.721 (ABBA frame, off paper).
- **Batch 3 (+ the ink-line rule):** WebKit run 2 red at 1.121, 1 px, coverage 0.22, at (764.3,206.2), ground rgb(56,52,65) in both bare shots. I stopped it at run 4.
- **Batch 4 (+ frozen at the test):** the table above.

### Row 2 · check 4 ONE PUBLISHER, re-cut by rule (tier 1, `scripts/check-peer-arcs.mjs`)

- **(v): any declaration outside the admitted sites reds, whatever its value.** It covers `--color-peer-*`, templated names included, and `setProperty(TOKEN, …)`.
  - Three sites are admitted, each bound to the one value it may carry: `playerIdentity.ts` → `pair[1]`, `BoardHost.vue` → `ink`, `e2e/peer-walk.spec.ts` → `ink`.
  - Each must appear exactly once.
  - It reads `src/` and `e2e/` (css|vue|ts|mts|js|mjs|html) plus **`index.html`**. `index.css` skips (ii)–(iv) and not (v).
- **The Tailwind mint.** A `[--color-peer-…:…]` candidate anywhere Tailwind scans compiles into the shipped CSS. The whole frontend is walked, except
  node_modules, dist and dot-dirs. This lane found it by minting one: a self-test string in this script shipped a 62 B rule (dist
  `index-CEdHn5zBavob.js`). The plant is now joined at runtime, and the rebuilt dist is byte-identical to pass 5's.
- **(vi): the literal-copy census.** It walks 144 hands × digit/ring × both arms = **576 inks** and prices every colour literal in the estate against them.
  A copy within ΔE_ok 0.02 reds. The nearest estate literal is `pencilConfig.ts` sun outline `#D16A32` at 0.0227.
- **Self-test: 48 rows ✓, exit 0 bare.** It carries X1, X6, X2, TIN's C1–C11 and my own nine, with a consumer plus a comment as the green control.
- **On the TREE** (plant, run bare, restore by sha1; `readings/check4-tree-attacks.txt`; clean tree exit 0):

| exit 1 | exit 0 (declared) |
|---|---|
| X1 `var(--color-foreground)` in gameCell.css · X2 `:root{--peer-ring-l:.2}` in index.html · X4 · X5 Tailwind `[--peer-ring-l:0.2]` · X6 `color-mix()` · X8 · X9 · C1 scalar `RING_L = 0.32` · C2 nested `{ringL:{light,dark}}` · C4 templated `setProperty` · C7 `.js` · C7b `.mjs` · C10 inline style · S1 publisher re-valued · S2 spec seat literal · M1 index.css ink · M2 README mint · M3 script mint · L1 `#00352e` gameCell.css · L2 `#95c6bd` index.html · L3 `#006056ff` ThermoTube.vue | X3 computed name (contrived) · X7 a consumer |

The re-cut found three of this family's own sites: `CAPTURE_BAND` and the §A HEAD comparator (`headBand`/`headInks`, both deleted), and BoardHost.authors.test's
regex literal (now a DOM read of `--color-peer-cursor-ink`).

### Row 3 · B-TAPE's dark number, per payload and per engine (dpr 3, spec vs painted ground, min over four cells)

| tree · paper | payload | chromium dark / light | webkit dark / light | px < 4.5 |
|---|---|---|---|---|
| **WALK, card-laid washi (this tree)** | quickest-rodent | **5.691** / 11.891 | **5.691** / 11.891 | 0 |
| | quintessential-guineafowl | **5.604** / 11.793 | **5.691** / 11.891 | 0 |
| WALK, translucent paper (plant a, this batch) | quickest-rodent | 4.359 / 7.938 | 4.364 / 8.021 | 240 / 237, over the grid line, ground rgb(81,78,76) |
| HEAD `74a2b5d9` (its own name ink) | both | 4.589 / **3.382** | 4.594 / **3.418** | dark 0 · light 2,837–4,379 |
| PAL-TIN `c94-2` | quickest-rodent | 4.473 / 8.029 | 4.478 / 8.113 | dark 118–2,521 |

The HEAD light name (3.382/3.418) is read at cell 11, where the name crosses a given under translucent paper.

Two readings are **not restated as paint**, because they sit at the flip corner where live-motion runs photographed the frame boil:

- HEAD's WebKit cell 8 at 1.545, and 1.503 at dpr 2 cell 14.
- TIN's WebKit dark cell 8 at 3.258.

The HEAD and TIN rows were read under live motion, before §C was frozen.

**Frame 2's caption (the occlusion reading, the pass-5 critic's):**

- The covered given shows through the translucent arm (a) only at ≤ 18 % contrast.
- The card arm (b) adds no measurable occlusion: 4.3–15.3 % against HEAD's 8.6–15.4 %.
- The re-shot frame's one-variable proof is printed under Frames.

### Row 4 · F1's switch is ONE

- `SELF_TAKES_A_HAND` is exported from `useSession.ts:561`, and the units read it (`useSession.test.ts:3/523/796`).
- PLR-SELF's pass-6 substrate now carries the same name and has struck `SELF_TAKES_ROOM_INK`.
- **Priced**, with `git apply --reject` of `pass6/prototype/PLR-SELF/substrate.diff` against an archive of this tree: **8 of 60 hunks reject**.
  - `useSession.ts` ×3: the `SELF_TAKES_A_HAND` const block and its two `ink:` call sites. Both trees declare the one switch, so the fold keeps one copy.
  - `BoardHost.vue` ×1: the self-row guard in `peerCursorInk`.
  - `useSession.test.ts` ×2, `multiplayer.spec.ts` ×1, `check-pw-projects.mjs` ×1: context drift.
  - Every other file applies clean, index.css included.

### Row 5 · L6, ONE landing (`instruments/law-probe.L6.PROPOSED.diff`, 101 lines; `readings/law-probe-L6.txt`)

- **The pair half** reads every ring arm per theme block of `index.css`: the `--peer-ring-l` number, `--color-peer-*ring*` and `--color-peer-cursor-ink` colours.
  It **computes each arm's OKLab L** against {light 0.295, dark 0.79} at a tolerance of 0.005. Light blocks are `@theme` + `:root`, and dark is `.dark`.
- **The formula half** is pass 5's.

| tree / plant | formula | pair | L6 |
|---|---|---|---|
| this tree | true | true (0.295 / 0.790) | **GREEN**, exit 0 |
| control `74a2b5d9` | false | false (no ring arm) | RED, exit 1 |
| PAL-TIN `c94-2` | false (palette) | **true**, arms computed 0.294–0.296 / 0.790–0.791 | RED |
| plant: light arm 0.32 in index.css | true | false | RED |
| plant: dark arm 0.775 | true | false | RED |
| plant: an alias arm (`--color-peer-cursor-ink`) in index.css | true | false (unreadable) | RED |
| plant: TIN stick 2's ring lifted to 0.340 | false | false | RED |

TIN's own L6 is struck in favour of this one. The chair lands it.

### Row 6 · frames (real rooms, one payload)

Three crops, all under 150 KB. Frame 1 (F1 YES | NO, pass 5's `1-f1-yes-vs-no-1280-light-chromium-fine.png`) stands as a real two-page room and is not re-shot.

Every frame is shot the same way (`instruments/frames6.spec.ts` + `frame6.sh`):

- REAL pages in one `?wire=local` context, joined through the product's invite verb.
- Each page runs `emulateMedia({ reducedMotion: "reduce" })` before goto, so the boil is PARKED. Frame 2's boil pose is held that way, not declared.
- The payload is `ATMuMzkx…YxMDYx`, asserted decoded on every page.
- The eight cells 11/12/14/16/21/22/23/24 are written round-robin by the room's pages, with the solved digits.
- Page 0 (the starter, "you") is photographed.

The table below uses each crop's own name.

| frame | pair (the one variable) | engine · theme · viewport · pointer | retires |
|---|---|---|---|
| `frames/2-tape-card-vs-translucent-1280-dark-chromium-fine-dpr3.png` | B writes cell 12 under a given, and A hovers it at night. The two arms are ONE inline `background` on the label (b: none, the tree's card-laid washi; a: `var(--sheet-washi-neutral)`, pass 4's translucent paper), in one page under one hover. **One-variable proof: 1,589 px changed inside the label, 0 outside it; (b) against (b) again, 0 outside.** The occlusion reading is the pass-5 critic's (above). The covered given's "6" shows through (a); in (b) only its top, above the paper, is visible. | chromium · dark · 1280×800 · fine · dpr 3 | pass 5 `2-tape-translucent-vs-card-1280-dark-chromium-fine.png`; pass 4 SWEEP `4-tape-ring-vs-digit-1280-dark-chromium-fine.png` |
| `frames/3-gestalt-room-eight-vs-four-1280-light-chromium-fine-dpr2.png` | A room of EIGHT pages (one cell each, walk i = 0..7) above a room of FOUR (two cells each, i = 0..3), on this tree. The per-cell inks were read off the DOM (`--color-user-ink`). N = 4 is 27.17°/181.79°/234.22°/47.19°; N = 8 adds 201.82°/320.64°/124.79°/221.84° (L 0.44) | chromium · light · 1280×800 · fine · dpr 2 | pass 5 `3-gestalt-four-vs-eight-1280-light-chromium-fine.png` (composed per cell, swept) |
| `frames/4-fork-tin-room-vs-walk-room-1280-light-chromium-fine-dpr2.png` | The section fork. PAL-TIN's tree (`c94-2`, served read-only) in a real room of four, sticks `#853900 #455c00 #005f63 #3e32c5`, above this tree's room of four, walk i = 0..3. The same cells and digits, and the same writer per cell | chromium · light · 1280×800 · fine · dpr 2 | pass 5 `4-fork-tin-four-sticks-vs-walk-four-hands-1280-light-chromium-fine.png` (composed per cell, swept) |

**Declared, not variables of the pairs:**

- The board frame's violet top stroke is drawn to a different length in frames 3/4. It is the frame, not a cell.
- The blue focus box sits on the last cell page 0 wrote: 21 in a room of four, 11 in a room of eight.
- The tape's slug in frame 2 (`ethnic-cricket`) is unpinned. Both arms are one page, so the word is common to the pair.

### Row 7 · the DARK filter census and r2 accent-kinship

- **Filter census** (`instruments/filter.sh`, the spec's own test on each server):

| | chromium | webkit |
|---|---|---|
| tree DARK | exit 1 (2 failed / 4 passed) | exit 1 (2 / 4) |
| control DARK | exit 1 (2 / 4) | exit 1 (2 / 4) |
| tree LIGHT | 6 passed | 6 passed |
| control LIGHT | 6 passed | 6 passed |

  Both reds are `svg.crayon-heart.idle saturate(0.85)` (G3.1, G3.3), identical on the control. This tree adds no filter.
- **r2 accent-kinship, MOVED probe, re-run once** (`instruments/kin.sh`, dpr 1, both engines):

  Payload: none. r2's probe deals its own board, and the rows it reads are tokens and chrome; the only field that differs between runs is the focused cell's accessible label.

| row | tree (chromium / webkit) | control `74a2b5d9` (chromium / webkit) |
|---|---|---|
| the tape row (`peerOnTape`, ring key / digit key) | **11.84 / 6.49** · **11.84 / 6.49** | 17.37 / 4.79 · 17.36 / 4.78 |
| `peerWorst` over 40 peers | 7.27 | 5.36 |
| kinship light / dark (6/15 rows not kin) | RED | RED (byte-identical JSON) |
| focus ring in the house ink | RED | RED (identical but for the cell label) |
| no chromatic accent outside the token estate | RED (the `drop-shadow(rgba(196,181,253,.3))` glow) | RED (identical) |
| exceptions pay their a11y toll | green | green |

  **MOVED: the tape row only.** The pass-4 reading was 10.78 / 6.49 at the old 0.32 ring. The pair's 0.295 darkens the ring, so the light tape reads 11.84.
  That agrees with tier 3's §C light 11.793–11.891. The four red rows are r0's census subjects and identical on both trees, so this family moves none of them.
  The probe is pass 4's `instruments/accent-kinship.probe.MOVED.ts` with `OUT` re-pointed to a scratch dir per arm. The JSON was read and not banked.

### Row 8 · payloads

Every browser row above names its board payload and, for the name, B's id and slug. The frames use one payload per pair.

## The dark washi-tape class: one estate row, two cures (leader duty, registry §2.7)

| cure | what it moves | dark | light |
|---|---|---|---|
| **The ESTATE cure (this family)**: the tape's washi is laid on the card, one tape, landing with §10's fold under the tape anchor | the PAPER | 5.604–5.691 (both engines, both payloads), 0 px < 4.5 | 11.793–11.891 |
| **The section's second row (PAL-TIN)**: the INK is the variable for its sticks, binding the name to L ≥ 0.83 with HEAD's ink as the in-run control | the INK | TIN tree today 4.473/4.478, 118–2,521 px < 4.5 | 8.029/8.113 |
| HEAD `74a2b5d9`, its own name | — | 4.589/4.594, 0 px | **3.382/3.418**, 2,837–4,379 px < 4.5 at cell 11 |

## The ring pair and the section fork (leader duty)

- The pair stays **0.295 / 0.79**, published once in `index.css`; law 21's cite is unchanged.
- TIN's tree now computes the same pair, 0.294–0.296 / 0.790–0.791 on all five arms (L6's pair half, above).
- The fork's ring numbers at the pair are pass 5's and are not re-measured: light 3.133 WALK vs 3.133 TIN; dark 0.79 at 3.341–3.344 vs TIN's shipped 0.775 at 3.125–3.127.
- `join-language-prm:153` stays 0.55.

## r0 / R6 rows MOVED (PROPOSED, never applied)

- **L6:** the PROPOSED diff is amended (pair half computed from index.css; plants as negatives). TIN's L6 is struck.
- **Law 21's cite:** unchanged at 0.295/0.79. TIN's tree now reads the same pair.
- **r2 accent-kinship:** re-run once (row 7).
- **The undefined-token census ledger:** a fourth INHERITED row, `--color-peer-cursor-ink :: games/shared/BoardHost.vue -> games/shared/GameBoard.vue`, PROPOSED (gap 9).
- **R2:** stale. Its HEAD comparator is deleted from this spec, and its figure is superseded by §C's pinned payloads.

## Pre-return battery (bare; the control's exits beside)

Run after `.palwalk6/` moved out, on the tree as it returns (`instruments/battery6.sh`, each gate unpiped, one log each; `readings/battery.tsv`).
The control column is the `74a2b5d9` archive.

| gate | tree | control |
|---|---|---|
| lint:lanes · lint:theme-tokens · lint:sleep · test:e2e:projects · check-pw-projects | 0 · 0 · 0 · 0 · 0 | 0 · 0 · 0 · 0 · 0 |
| **lint:arcs** (`check-peer-arcs.mjs --self-test`, 48 ✓) | **0** | 1 (the script is absent at base) |
| lint:copy · check-copy-register · **lint:motion** (35 specs; §C's per-test freeze) | 0 · 0 · 0 | 0 · 0 · 0 |
| lint:theme-selectors · lint:ink · lint:catch · lint:live-regions | 0 · 0 · 0 · 0 | 0 · 0 · 0 · 0 |
| check-property-block (pass-6 instrument) | 0 | 0 |
| **undefined-token-census** (pass-6 instrument) | **1**: the STALE `--refuse-dur` row (declared, A.1 ruling 4) **plus** `GameBoard.vue:1246 --color-peer-cursor-ink`. With `instruments/undefined-token-census.tape-row.PROPOSED.diff` it reads 0 bare, 1 stale, the control's own reading | 1: the STALE `--refuse-dur` row. With the PROPOSED row, 2 stale, the new row STALE as A.3 requires |
| knip · npm run lint (prettier) · eslint . | 0 · 0 · 0 | 0 · 0 · 0 |
| vitest `src/games` · `src/pencil` · `src/composables` | 57 files / **759** · 8 / 73 · 3 / 16, all exit 0 | — |
| vue-tsc -b · vue-tsc -p tsconfig.e2e.json | 0 · 0 | — |

## Incidents

- **No `rm`.** Scratch was `mv`ed to `<scratchpad>/trash-palwalk6`, and `.palwalk6/` was moved out before return.
- **I edited a running script** (`bornred6.sh`). I killed its parent by PID. The planned log-name parameter never took effect, so plant logs are named per script copy (br6*, fin2*, fin3*, fin4*).
- **Plant (c), first cut, was void.** `opacity: 0` sat before the rule's own `opacity: 1`. It was re-cut to replace it.
- **Seeding `Math.random` pinned the slug in chromium only.** Replaced by pinning B's id.
- **Batches 1–3 were stopped or red** (listed under Row 1). Batch 3 was stopped with TaskStop, which also took down the 4244 listener it had
  started. I restarted it and recorded the new PID.
- **My own self-test string minted a Tailwind rule into the dist** (+62 B). This is the origin of check 4's mint clause.
- **CSS `?raw` comes back empty under vitest's default `css.include: []`.** A unit literal-copy row read nothing, and I deleted it. The census lives in the gate.
- **Control and TIN served in dev with external configs.** The configs lived under `.palwalk6/`, with caches outside both trees.
- **Load:** the box ran at load 34–96 through the batches.
