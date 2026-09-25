# PAL-WALK · pass 7 prototype

The work tree is `.claude/worktrees/wf_308fa864-c94-1`. Its base is `74a2b5d9` plus `pass6.diff`, advanced in place: no replay, no reset, no clean.

The pass-7 delta is `pass7-delta.diff`: six files, +580/−188, sha1 `2e7dedf0`. The full diff has 18 files, 4,219 lines, 213,484 B, sha1 `dae6094f`. It passes `git apply --check` onto a fresh `74a2b5d9` archive with exit 0, and the applied archive is byte-EQUAL to the tree.

The tree's `git status` shows product files only. `.palwalk7/` was moved to the lane's scratch `trash-palwalk7/`, and both servers (4244 tree, 4245 control) were killed by PID.

## Gaps first

1. **Row 3, light half: open, priced, not landed.** Chromium DPR 1 cell 8 by day reads core 4.124 (`…0b0b`) and 5.440 (`…002e`), against the control's 2.718 and 3.051.
   - The dark half is cured: 4.891 and 5.185, against the control's 4.086 and 4.241.
   - The light cure, from `readings/name-l-sweep.txt`:

     | name L by day | core, `…0b0b` cell 8 | clears 4.5? |
     |---|---|---|
     | 0.25 | 4.484 | no |
     | 0.22 | 4.767 | yes |
     | 0.18 | 5.069 | yes |

   - Its cost, from `readings/delta-e.txt`: `NAME_BANDS [0.22, 0.86]` takes the name's minimum pairwise ΔE from 0.1253 to 0.1126 at N=2 and from 0.0528 to 0.0373 at N=3 (light). The dark arm falls too, because chroma is bisected at the pair.
   - It also breaks the unit's `NAME_BANDS[0] == RING_BANDS[0]` (the ring's band by day).
   - The gate says so in the stamp table rather than hiding it. That key's core floor is 0.9 × 4.124, not 4.5.
   - Ballot T9-B-PW7-1.
2. **WebKit fill fades are void, stated.** WebKit doesn't paint `-webkit-text-fill-color: color-mix(… 80 %)` as a fade on this label. Its core is 0.998–1.000 of the clean one at DPR 2/3, and 0.919–0.982 at DPR 1.
   - At 65 % the core is 0.957–0.980 at DPR 2/3 and 0.814–0.925 at DPR 1.
   - So FADE65/FADE80 (and their `v` twins) are PRINTED in WebKit with their core ratio, and REQUIRED in chromium. In the final run WebKit still reds 13 of its 20 printed readings at DPR 1 and 4 at DPR 2.
   - FAINT30 (both spellings), TAIL12, TAIL35 and EMPTY are required in both engines.
   - The chair's `glyph-pop.mjs` reads the same hole on the control.
3. **The name's colour costs.** The name is now a third string, bisected at [0.295, 0.86]. Its chroma is below the ring's for 53 of 144 hands; the worst ratio is 0.625 (hand 0: 0.1207 → 0.0756).
   - Minimum pairwise ΔE_ok at N=4 is 0.0274 by day and 0.0271 at night. The ring is 0.0514/0.0510, the digit 0.0758/0.0762, and HEAD's one string 0.0991/0.0988.
   - TIN's five sticks read 0.1162, and its dark names 0.0983.
   - The walk's names beat HEAD's for contrast in every cell measured and lose to it for separation from N=3 up. TIN's separation law isn't landed here, so gate 2 is unchanged.
4. **Undefined-token census reds on the tree (1), and the control reds (1) on its declared STALE row.** The tree's new red is `GameBoard.vue:1245 --color-peer-name-ink`, the tape spreading the author's whole `inkFor` record inline.
   - `instruments/undefined-token-census.name-row.PROPOSED.diff` adds the INHERITED row `--color-peer-name-ink :: games/shared/playerIdentity.ts -> games/shared/GameBoard.vue`.
   - With that row the tree reads 0 bare var()s and 1 stale (the same declared STALE `--refuse-dur` row the control carries). The self-test exits 1 on the tree, the control and the proposal alike, all on that pre-existing STALE row.
   - Proposed, not applied: the census is the chair's instrument.
5. **Check 4 is still this lane's own reader** (`check-peer-arcs.mjs`), not the chair's library: the §I tension carries over. §C likewise re-implements glyph-pop's G1–G4 in the spec rather than importing `instruments/glyph-pop.mjs` (the e2e tsconfig doesn't reach evidence/). Both are ballots, not silent forks.
6. **Name keys ride on the cells with no consumer there.** `inkFor` returns three strings. The board host spreads the whole record onto every authored cell, but only the tape reads `--color-peer-name-ink`, so each cell carries one inert custom property. It's harmless, and it's stated.
7. **No dist was built this pass**, so there's no served filter census for tree against control. `check-property-block`'s served clause read the stale main dist it finds, which doesn't prove anything for this tree.
8. **`lint:bands` and `lint:verbs` don't exist** at `74a2b5d9` or on this tree. Both exit 1 on both sides with npm's missing-script error.
9. **Frames: two crops, not four.** The wave sits at 2,095,521 of 2,097,152 B after them (1,631 B headroom).

## Numbers

### Row 1 · §C on the whole glyph population, absolute floor

Spec `e2e/peer-walk.spec.ts`, sha1 `456f7210`. Evidence: `readings/section-c-gate.txt`.

**Tree:**

| engine · DPR | exit | clean rows | required plants red | holes |
|---|---|---|---|---|
| chromium 1 / 2 / 3 | 0 / 0 / 0 | 16/16 GREEN each | 36/36 each | 0 |
| webkit 1 / 2 / 3 | 0 / 0 / 0 | 16/16 GREEN each | 20/20 each | 0 |

- The 16 clean rows are 2 pinned payloads (`p-0000000b0b0b` "quickest-rodent", `p-00000000002e` "quintessential-guineafowl") × 4 cells (11/12/14 with a given above, 8 on the top row) × 2 themes.
- Every chromium FADE65/FADE80 (and `v`) reds, and so do TAIL12, TAIL35, EMPTY and FAINT30 in both engines.

**Control:** the same §C reading `--color-user-ink` on a `74a2b5d9` archive, plants off.

- Exit 1 in all six configs, with 0 of 16 clean rows GREEN in each.
- The ABSOLUTE red is by day. HEAD's name colour against its own paper is 3.382 (chromium) and 3.418 (WebKit), under 4.5 in every light row.
- At night, HEAD reds only against this tree's stamps (for example, core 5.928 < 6.374 at chromium DPR 2). The absolute floor alone would pass it at night.

**How the floors work.** They're stamped from this tree's read, per engine · DPR · theme · cell kind, as `SHIPPED`:

- core ≥ 4.5 wherever the stamp or the control clears 4.5, and ≥ 0.9 × stamp everywhere
- population median ≥ 4.5 wherever the stamp clears it, and ≥ 0.9 × stamp
- fraction under 4.5 ≤ stamp + 0.05
- G4 at the chair's max(3.0, 0.4 × whole p95), unmoved
- CURE (spec colour against the painted ground) ≥ 4.5

**Incident, cured.** An offline replay of the stamps showed a false G4 red on chromium DPR 1 light top. I took the p95 off the maximum slice rather than the whole population, and the real gate reads it GREEN (the whole p95 is 7.812, so the limit is 3.12, under slice 4.2). A per-key tail stamp was written and then removed as unneeded. G4 isn't moved.

### Row 2 · B-TAPE: the name's ink bound to TIN's L 0.86 at night

The in-run control is HEAD's ink on the same label, same hover and same page. Dark, cell 11, `…0b0b`, as core / population median:

| arm | chromium DPR 2 | WebKit DPR 2 |
|---|---|---|
| name, walk L 0.86 | **7.192 / 6.610** | **7.192 / 7.192** |
| HEAD ink `oklch(0.8 0.11 137.5)` | 5.991 / 5.542 | 5.991 / 5.991 |
| ring string L 0.79 (pass 6) | 5.691 / 5.248 | 5.691 / 5.691 |

- The name beats HEAD in every measured cell, DPR and engine at night (the rows are in `section-c-gate.txt`).
- The PAPER reading (translucent washi under the name at 0.86) now has a CURE minimum of 5.509 (chromium) and 5.515 (WebKit), where pass 6's 0.79 read 4.374.
- So the paper arm of B-TAPE is occlusion-only now; the name clears on either paper. It's printed, not required.

**Sweep at night, WebKit DPR 1, core:**

| name L | core |
|---|---|
| 0.82 | 6.253 |
| 0.84 | 6.655 |
| 0.86 | 7.121 (the stamp's own read, not the sweep) |
| 0.90 | 8.075 |

At chromium DPR 1 cell 8, only 0.84 and up clears 4.5 (0.82 reads 4.369), which is why 0.86 was picked.

### Row 3 · chromium DPR 1 cell 8

- Dark: cured, as in gaps above.
- Light: open, gap 1.

### Row 4 · check 4 on SHAPE

`readings/check4-attacks.txt`. Each attack was planted on the real tree, run bare, and restored (`instruments/check4-attacks.sh`).

| attack | exit |
|---|---|
| clean | 0 |
| K1 `public/peer.css` second band publisher | 1 |
| T1 Tailwind candidate in `public/404.html` | 1 |
| K12 `--color-user-ink` aliased in `gameCell.css` | 1 |
| K12b a fourth `--color-user-ink` in `index.css` | 1 |
| S1 `.json` ink table | 1 |
| S2 `.tsx` write | 1 |
| S3 computed property name | 1 |
| N4 name site rebound to `pair[1]` | 1 |
| N1 name band sheet-only 0.79 vs module 0.86 (check 3) | 1 |
| green control (test fixture + public consumer + literal `setProperty`) | 0 |
| clean after | 0 |

- `--self-test` exits 0 with 65 ✓. It now carries N1–N3, K1/K1b, K12/K12b/K12c, N4–N6, S1 `.json`, S2 `.tsx`, S3/S3b computed, and a green control.
- The Vite cacheDir sat outside the root throughout, in the lane's scratch.

### Row 5 · L6 in WALK's form, shape-keyed

The proposal is `instruments/law-probe.PROPOSED.mjs`; its diff against r0 is `law-probe.L6.PROPOSED.diff`, 201 lines. Readings are in `readings/l6-plants.txt`.

- **Behavioural half:** `inkFor`'s 289 indices are re-derived from `RESERVED_ARCS` and the gamut bisection.
- **Shape half:** the pair's arms are read off the sheet by selector shape, and stray arms red.

| plant | exit |
|---|---|
| clean | 0 |
| LA1 `.dark .game-cell` arm | 1 |
| LA2 `html.dark` arm | 1 |
| LA3 `.board-cells` light arm | 1 |
| LA4 fixed oklch table behind `inkFor` (867 strings off the walk) | 1 |
| P6 light 0.32 | 1 |
| P6 dark 0.775 | 1 |
| P6 alias arm | 1 |
| name chroma at the ring's table (105 off) | 1 |
| name band sheet-only (155 off) | 1 |
| clean after | 0 |

- The tree reads GREEN.
- The control and TIN read RED: the formula can't be read there (no `RESERVED_ARCS`). TIN's pair itself is true (0.294–0.296 / 0.790–0.791).

### Row 6 · frames

The rooms have pinned ids with B = `p-0000000b0b0b`. The screenshotting page drops its focus caret (`FRAME_BLUR`), so no row, column or box band paints; the peers keep focus on cell 40, below the clip. Both crops are pngquant-quantized PNGs, never JPEG.

1. `frames/2-btape-head-ring-name-translucent-1280-dark-chromium+webkit-fine-dpr2-retires-p6-2-tape-card-vs-translucent.png` (7,605 B, pngquant 40–70)
   - It retires the pass-6 `2-tape-card-vs-translucent-1280-dark-chromium-fine-dpr3.png`, and with it the SWEEP-deleted pass-5 `2-tape-translucent-vs-card-1280-dark-chromium-fine.png`.
   - Rows, top to bottom: chromium HEAD ink · ring 0.79 · name 0.86 · name on translucent paper; then WebKit HEAD · name 0.86 · translucent.
   - It's a one-variable proof. Pixels changed from HEAD to ring: 2,342 inside the label, OUTSIDE 0. From ring to name: 2,349 inside, OUTSIDE 0. Name against name-again: 0. WebKit reads 2,248 / 2,252 / 0 / 0 on the same pairs.
2. `frames/3-gestalt-room-eight-vs-four-no-focus-1280-light-chromium+webkit-fine-dpr1-retires-p6-3-gestalt-room-eight-vs-four.png` (8,520 B, pngquant 60–90)
   - It re-shoots the SWEEP-deleted pass-6 `3-gestalt-room-eight-vs-four-1280-light-chromium-fine-dpr2.png`, which had an undeclared focus-band variable.
   - Rows: chromium room of 8 · room of 4 · WebKit room of 8 · room of 4, cropped to row 3.
   - Between the 8-room and the 4-room: chromium 1,278 px differ and WebKit 1,305 px. The bounding box is y 164–204 and x 246–470, the four columns of cells 21–24 only. Those are the four inks that differ between the rooms (hands 4–7 against hands 0–3 re-walked); nothing else moved.
   - The banded and unbanded shots differ by 15,956 px, all inside x 221–432 (the old band's column and box).

### Row 7 · self-test extensions

`.json` (S1), `.tsx` (S2) and computed-key sites (S3 `setProperty(expr)`, S3b `style[expr] =` including `(el.style as any)[k]`) each red as required inside `--self-test`, and on the real tree as the attacks above.

### Leader duty · pairwise ΔE, both palettes

`readings/delta-e.txt` holds the minimum over the first N hands for every string at both bands, the full pairwise 8×8 per string per theme, each hand's C@h, TIN's sticks, HEAD's one string, and the price of a lower light name band.

Minimum pairwise ΔE_ok:

| string | L (day/night) | N=2 | N=3 | N=4 | N=5 | N=8 | N=16 |
|---|---|---|---|---|---|---|---|
| digit | 0.44 | 0.2527 | 0.0758 | 0.0758 | 0.0264 | 0.0229 | 0.0084 |
| digit | 0.65 | 0.2532 | 0.0762 | 0.0762 | 0.0268 | 0.0226 | 0.0090 |
| ring | 0.295 | 0.1702 | 0.0528 | 0.0514 | 0.0182 | 0.0144 | 0.0073 |
| ring | 0.79 | 0.1712 | 0.0510 | 0.0510 | 0.0170 | 0.0143 | 0.0057 |
| name | 0.295 | 0.1253 | 0.0528 | 0.0274 | 0.0182 | 0.0144 | 0.0073 |
| name | 0.86 | 0.1255 | 0.0513 | 0.0271 | 0.0194 | 0.0139 | 0.0057 |
| HEAD | 0.5 | 0.2055 | 0.1477 | 0.0991 | 0.0896 | 0.0602 | 0.0234 |
| HEAD | 0.8 | 0.2069 | 0.1438 | 0.0988 | 0.0975 | 0.0593 | 0.0239 |

### Pre-return battery

Bare, tree against a `git archive 74a2b5d9` control with `.github` and `scripts`. Evidence: `readings/battery-and-apply.txt`.

| gate | tree | control |
|---|---|---|
| lint:lanes · lint:theme-tokens · lint:sleep | 0 · 0 · 0 | 0 · 0 · 0 |
| lint:bands · lint:verbs | 1 · 1 (no such script) | 1 · 1 |
| test:e2e:projects · check-pw-projects | 0 · 0 | 0 · 0 |
| lint:arcs · check-peer-arcs bare | 0 · 0 | 1 · 1 (no such file at `74a2b5d9`) |
| lint:copy · check-copy-register | 0 · 0 | 0 · 0 |
| lint:theme-selectors · lint:ink · lint:motion · lint:live-regions · lint:boundary | 0 each | 0 each |
| check-property-block (pass6 copy) | 0 | 0 |
| undefined-token census (pass6 copy) | **1** (gap 4, PROPOSED row) | 1 (declared STALE) |
| `eslint .` · `npm run lint` | 0 · 0 | 0 · 0 |

- The first battery read `eslint .` = 1 on the tree. Both errors were in `.palwalk7/` scratch specs; after the move it reads 0.
- vue-tsc on a copy of the final tree: `-b` exits 0, and `-p tsconfig.e2e.json` exits 0 (the first run read 2, one TS2339 in the spec, cured).
- vitest by directory on the final tree, all exit 0:
  - `src/games`: 57 files, 760 tests
  - `src/pencil`: 8 files, 73 tests
  - `src/composables`: 3 files, 16 tests

## Replay route

In place: the lane advanced its own pass-6 tree. The pass-7 delta was measured against `74a2b5d9 + pass6.diff`: pass6.diff applies to a fresh archive with exit 0, and `diff -ruN` against the tree gives six files. The full diff applies to a fresh `74a2b5d9` with exit 0, and the result is byte-EQUAL to the tree.

## Incidents

1. **A unit plant on the tree while the frozen dev server ran.** `playerIdentity.ts` was planted with the name bisected at `RING_BANDS` (the born-RED of the new unit: 2 failed, i=23 at L 0.86 rounds into an arc) on the tree itself, then restored sha1-equal. No served reading could differ: B's index 1 has the same chroma under both tables.
2. **The chair-instrument driver first read cell 2**, which is a given. It was re-pointed to cells 11 and 8 and chromium was re-run. Only the re-run is banked.
3. **The offline stamp replay's false G4** (row 1). Nothing shipped on it.
4. **Box load ran at 17–57 (1-minute average) throughout.** No workflow stalls. Every gate is a paint reading, not a timing.

## Moved rows (PROPOSED, never applied)

- **r0 law-probe L6** → `instruments/law-probe.L6.PROPOSED.diff`: WALK's formula form plus the shape-keyed pair. The r2 kinship check wasn't re-run against it.
- **pass6 undefined-token census INHERITED** → `instruments/undefined-token-census.name-row.PROPOSED.diff`, the tape's row moved from cursor-ink to name-ink.
