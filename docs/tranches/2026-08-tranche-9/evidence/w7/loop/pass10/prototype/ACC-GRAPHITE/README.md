# Pass 10 · ACC-GRAPHITE · the prototyper's bank (§3, batch 2)

Lane `ACC-GRAPHITE`, 2026-11-02 19:17–. Work tree `wf_f72f3b5a-83a-40` (74a2b5d9), advanced in place. Durable scratch: the lane's own pass-10 directory (never /tmp). Ports 4235 (tree) / 4254 (control, the pre-built `index-CubiZsMVSwTc.js`). Not the critic: every number below is the author's until a non-author re-derives it.

## Numbers first

### Row 1 (CHAIR pick 1): all six rigs, both engines, on the pass-9 WAVE `954bbbab`

The tree read is `954bbbab` + homes v3's on-WAVE step (`0723d508`, tree `8c46d9de`) + `pass10.delta.on-WAVE.diff` + the one-line arm flip `RING_ARM = "graphite"` (the WAVE ships the owner's blue arm; the flip is the reader's plant, `od -c`-verified, never banked, the WAVE9-read form). Build `index-BkzF3wJejISl.js`, served CSS **115,719 B** (= A13's faithful build; the banked source rebuilds as `index-B-HJEDCezeHq.js`, byte-identical up to GameBoard.vue's scope id, incident 5), scratch archive with its own `.git`, private cacheDir, `VITE_BASE_URL=/`. Instrument: `bandc.crit.ts` f256121a + `band-stat.mjs` d2e2d620 + `band-lib.ts` 424b3e98 (the WAVE9 reader's rig copy, byte-equal), `GATE=1 STAT=tb`, DPR 1, light, PRM reduce. Exit read bare from the file `band.sh` writes.

| rig (board dpx) | chromium | WebKit | control chromium / WebKit |
|---|---|---|---|
| desk 1280×800 (636) | 1.377 | 1.426 | 0.545 / 0.543 RED |
| phone 393×699 coarse (365, small) | **1.427** (was 1.392) | **1.391** (was 1.371) | 0.521 / 0.229 RED |
| tablet 768×1024 coarse (668) | 1.386 | 1.381 | 0.528 / 0.531 RED |
| tabletL 1024×768 coarse (604) | 1.430 | 1.434 | 0.580 / 0.568 RED |
| deskcoarse 1280×800 coarse (636) | 1.377 | 1.426 | 0.545 / 0.543 RED |
| **phone812 812×375 coarse (347, small)** | **1.402** (was **1.349 RED**) | **1.427** (was 1.390) | 0.076 / 0.083 RED |
| desk1440 (668), desknarrow (492): the lane's two extra rigs | 1.386, 1.439 | 1.381, 1.440 | 0.528, 0.391 / 0.531, 0.556 RED |
| **exit** | **0**, 8 passed (19:32:17→19:33:42, load 8.79→12.17, inuse 16,507→16,601) | **0**, 8 passed (queued for the machine-wide lock 19:33:42→~20:03, run →20:04:52, load 12.17→10.23, inuse 16,601→16,891) | — |

**ROW 1 IS MET: six of six rigs inside [1.35, 1.45] in BOTH engines (eight of eight with the lane's two extras), both controls RED in the same runs, on the pass-9 WAVE.** The six-rig span: chromium 1.377–1.430, WebKit 1.381–1.434; the nearest bound is the ceiling at WebKit tabletL (0.016) and the floor at chromium desk (0.027). Per-engine keys (LAWS P9): WebKit phone812 reads 1.427 against chromium's 1.402, WebKit phone 1.391 against 1.427, WebKit desk 1.426 against 1.377.

**The cure is one literal**: the small raster's second pass 12 → **13** units (`gameCell.css`, the graphite arm's `[data-raster="small"]` rule; the same literal on the 74a2b5d9 tree). Only the two small rigs move; the four large rigs read the WAVE9 numbers to the thousandth.

**The sweep that chose it** (chromium, the two small rigs, same rig and control, WAVE + homes v3 + flip):

| second pass (units) | phone812 347 dpx (band top/bottom) | phone 365 dpx | build |
|---|---|---|---|
| 12 (the WAVE) | 1.349 RED (5.317 / 5.471) | 1.392 | WAVE9-read `index-BLqcm25kmWGd.js` (cited, not re-read) |
| 12.5 | **1.349 RED** (5.317 / 5.527: the top band rasterises as 12's) | 1.416 | `index-kflq8jvM9mm7.js`, CSS 115,721 B, exit 1 |
| **13** | **1.402** (5.564 / 5.527) | **1.427** | `index-CtXFnRfomOCp.js`, CSS 115,719 B, exit 0 (8/8) |

12.5 is the declared negative: the band is quantised at the device pixel, so half a unit buys nothing at 347 dpx. 13 holds both small rigs with 0.048 and 0.023 of margin below the ceiling in chromium.

### The 74a2b5d9 tree's own band (the lane tree `7674feb8`, GRAPHITE shipped by default, no flip)

Build `index-D-11OvPzYUqI.js`, served CSS 97,491 B (the worktree's own `.git` marker; private cacheDir). Chromium, the same rig, 20:11:57 (queued for a browser slot to ~20:37) → 20:38:09, load 8.05→7.50, inuse 17,041→119,970, exit **0**, 8 passed: desk 1.376 · desk1440 1.385 · phone **1.424** · **phone812 1.399** · desknarrow 1.438 · tablet 1.385 · tabletL 1.430 · deskcoarse 1.376; the control RED 0.076–0.580 in the same run. **WebKit on this tree: UNREAD** (the job was withdrawn by PID while it waited for the machine-wide lock, held by another session's 88-minute `attslot` job; it would have held a browser slot idle, LAWS P9 §B). Pass 8's 1.370–1.435 stands for WebKit there.

## Gaps first (every charter row, in its order)

| row | state at bank | the number that holds it |
|---|---|---|
| **1 · six rigs, both engines, on `954bbbab`** (the fold blocker) | **MET** | chromium 6/6 (8/8) inside, exit 0, phone812 1.349 → 1.402; WebKit 6/6 (8/8) inside, exit 0, phone812 1.390 → 1.427, phone 1.371 → 1.391; the controls RED in both |
| 2 · G2's class (X6, half-clip 0.8 %, re-clip 0.4 %) through edge-bands B7 | **PARTIAL** (chromium only) | X6 reds the library's four-band read (its two sides 0 / 0.7 px against 5.2–8.5) at desk and 347 dpx, where G2 reads it as clean; the FRAME half-clip 0.8 % reds G2 at the four large rigs (1.479–1.589) and NOT at 347/365 dpx (1.411 / 1.449: the frame's top/bottom moves ≤ 0.07 px there); the 0.4 % re-clip moves chromium ≤ 0.003 (frame Δ ≤ 0.02 px), declared below the band's resolution. WebKit's plant column unread |
| 3 · the band row at its product home (`e2e/`) | **OPEN** | no product spec landed (see §R2 below for why and the scratch read that stands in) |
| 4 · 16×16 reds; 347/450 dpx; 366–379 dpx | **OPEN** (read on both trees, cause unread) | on the WAVE + delta + flip, chromium, 16×16 (`mintBoard(4, 100)`, cell 31): desk **1.759**, phone **1.669**, phone812 **1.454**, tabletL **1.784** RED; tablet (740 dpx) 1.410 inside; exit 1, the controls RED 0.083–0.625. Both sides read thick (desk 13.21 / 13.08 px against 9×9's 10.22 / 10.44), so it is not a one-sided fusion. **The 74a2b5d9 tree reads the same** on the same payload (20:45, exit 1): desk 1.763, phone 1.680, phone812 1.451, tabletL 1.789 RED, tablet 1.409, so the red is the arm's, not the union's. Pass 9's 74a2b5d9 read (desk 1.419, phone 1.622) does not reproduce at desk on this payload (focused cell 31, the last column of row 1); the payload and cell pass 9 used are not on file here, so the two are not one reading. Cause unread; WebKit's 16×16 column UNREAD (the lock). 347 dpx at 9×9: CURED (row 1). 450 dpx: not re-read. 366–379 dpx: unread |
| 5 · R7 whole on final bytes (π, AA, census, goldens, G1/G1b/G4/G10, print, forced colours, property-block, the regime matrix) | **OPEN** | not run this pass: the batch's browser time went to row 1 behind the machine-wide WebKit queue |
| 6 · the other four games' rings; ring-to-glyph clearance | **OPEN** | unread |
| 7 · B-TALLY-16 on the union | **OPEN** (caption carried) | unbuilt a third pass; the tally stays on the 74a2b5d9 tree only |
| 8 · hygiene | **CURED** (four of five) | stale gameCell.css comment cured; `window.devicePixelRatio` → `useDevicePixelRatio()` (reactive); `BOARD_VIEWBOX_SIZE`/`BOARD_GHOST_SEED` exported from `gridPaths.ts` and read by GameBoard and useGameCell (the 1000/42 literals gone); span count reconciled to twelve in `boardRaster.ts`; the `index.css` focus-sketch cite: on the 74a2b5d9 tree the only mention is the §6 disposal note (line 225, accurate history), and on the WAVE the token is LIVE (§5/§6), so there is nothing stale to cure |
| 9 · LADDER's `selectorOf` class | **HANDED** | homes v3 carries `selectorKey` (shape-census `selector-key`, the instruments lane's re-key); `check-motion-bands`' consumer line is MOT-LADDER's |
| 10 · lint:bands in a clone; the index-form reconcile | PARTIAL | lint:bands read on the WAVE scratch (its own `.git`) beside the clean WAVE; the bank's tree ids are cut through a temporary index and stated with the form (below) |
| pick 6 · `crit.partial30` as GRAPHITE's own unit row | **SHIPPED on the WAVE delta, RED 6/6 as FIVE's** | `src/pencil/grid/gridPaths.partial30.test.ts` on WAVE + homes v3 + delta: 6 failed / 1 passed (the whole-frame negative control GREEN, frame 10); the five partial-start rows and the second-front row end on frame 15 > 11. The 74a2b5d9 tree has no `frontTween` (pass-8 `frontGate` only), so the row is not on `pass10.diff` |
| pick 17 · SMALL_RASTER_DPX's caption | **WRITTEN** (§Ballot caption below) | the cliff's unread span named; the cells it flips priced |

## The ballot caption (CHAIR pick 17): SMALL_RASTER_DPX = 375, a fitted constant

> **SMALL_RASTER_DPX = 375** (`boardRaster.ts`; GRAPHITE's knob, carried in the band's ballot caption). A board
> spanning fewer device pixels than this takes the second pass at **13** units; at or above it, **15**. It is
> FITTED, not derived: the band is quantised at the device pixel (12.5 rasterises as 12 at 347 dpx), so no
> formula carries a unit count across spans. **Read**: 347 dpx (812×375 coarse) and 365 dpx (393×699 coarse)
> on 13 — chromium 1.402 / 1.427, WebKit 1.427 / 1.391; 380 dpx and up on 15 — 1.377–1.439 at the six read spans
> (pass 9 and this pass). **Unread: 366–379 dpx** (the cliff's span), in both engines, on both unit counts.
> **The cells it flips** (9×9, the boards that exist at those spans): moving it to ≤ 365 puts the 393×699
> phone on 15 (pass 9: 1.47–1.50, RED both engines); moving it into 366–379 flips no read rig (none sits
> there); moving it to ≥ 381 puts the 380-dpx rig on 13 (unread). ±1 around 375 flips no read cell, which is
> the honest statement of how little the reading pins it. At 16×16 the predicate is the same and the band is
> RED at desk, phone, 347 dpx and tabletL on this count (row 4), on both trees.

## R1 · G2's class through the ONE library (scratch read; not a gate yet)

`ring4.crit.ts` (scratch, in the WAVE copy's `.g10-band/`, never banked) imports `../../e2e/lib/edge-bands.mjs`
(`fourBands`, B7) and `../../e2e/lib/rest-probes.mjs` (`atRest`) by relative product path. Frame = the board's
α50 width per side (ON−OFF with `.grid-ink` and the grid svg hidden); ring = the focused cell's band per side
(ON−OFF with its two passes hidden). Chromium, WAVE final (`index-BkzF3wJejISl.js`), 19:35:29→19:43:22, load
10.82→31.57, inuse 16,667→16,670, exit 0 (2 passed: desk, phone812).

| rig | arm | frame t/r/b/l | ring t/r/b/l | ring / frame(t,b) | sides / ring(t,b) (window [0.9, 1.1]) |
|---|---|---|---|---|---|
| desk | tree | 4.755 / 7.031 / 4.037 / 3.491 | 8.760 / 9.363 / 8.500 / 7.865 | 1.79–2.13 | 1.015 / 1.085 / 0.985 / **0.911** GREEN |
| desk | tree + **X6** | — | 8.500 / **0** / 8.500 / **0** | — | **RED right, left** |
| desk | control | 3.267 / 7.054 / 3.971 / 3.500 | 3.404 / 3.336 / 3.346 / 3.592 | 0.92–0.99 | GREEN (a uniform thin ring) |
| phone812 | tree | 4.136 / 4.134 / 4.266 / 4.105 | 5.337 / 5.707 / 5.788 / 5.366 | 1.27–1.38 | 0.959 / 1.026 / 1.041 / 0.965 GREEN |
| phone812 | tree + **X6** | — | 5.235 / **0.699** / 5.667 / **0** | — | **RED right, left** |
| phone812 | control | 1.955 / 4.143 / 2.072 / 4.106 | 2.105 / 1.971 / 1.899 / 1.866 | 0.93–1.05 | GREEN |

What it shows, and what it does not:
- **X6 is no longer blind** to a four-band read: both its missing sides read 0 (or 0.7) against a top/bottom
  of 5.2–8.5 px, RED by any window. G2 (top/bottom only) read it identical to clean at pass 9.
- **B7's ON−OFF width is not G2's statistic.** Against the frame it reads 1.79–2.13 at desk and 1.27–1.38 at
  347 dpx where G2 reads 1.377 and 1.402: ON−OFF drops the grid line under the band and the frame's strip
  clips the stroke unevenly (desk frame left 3.49 against right 7.03). The window [1.35, 1.45] does not
  transfer; a product row on B7 against the frame would red the clean tree. So **R2 stays OPEN**: the product
  home needs G2's statistic (`band-stat`'s runs) folded into the library by the instruments lane, which this
  lane did not file as a PROPOSED diff this pass (no plant and born-RED could be run on it inside the batch).
- The **relative** form (each side within [0.9, 1.1] of the ring's own top/bottom mean, the library
  self-test's literal) holds the clean tree on both rigs and reds X6 on both; it is a SHAPE bound scaled by the
  subject (LAWS P9 §F) and carries the magnitude only through G2, so it is offered as the class read beside G2,
  never as a gate on its own. Desk left 0.911 sits 0.011 inside: a thin margin, declared.
- The frame plants HALF08 / RECLIP04 moved B7's frame read (desk 4.396 → 3.000 / 4.388) and are read on G2
  below, where the window is G2's.

## The browserless battery (bare exits, the WAVE scratch beside the clean WAVE + homes v3)

Every script run through `guarded --light`, its exit written to a file and read bare. "clean" = `954bbbab` + homes v3 (`8c46d9de`) in its own `git init`-ed archive; "tree" = the same + `pass10.delta.on-WAVE.diff`.

| row | tree | clean | reading |
|---|---|---|---|
| `vue-tsc -b` | 0 | — | the 74a2b5d9 tree also 0 |
| `typecheck:e2e` | 0 | 0 | |
| `lint:sleep` | 1 | 1 | the three union-born findings (`count-yield:302`, `note-reserve:305/:357`, SIX's and LEDGER's per CHAIR §21); none GRAPHITE's. The 74a2b5d9 tree: 0 |
| `lint:bands` | 1 | 1 | **B13 ARITHMETIC 2 is HOMES-v3-BORN**: bare `954bbbab` reads B13 ✓; `954bbbab` + `homes.on-WAVE.diff` alone reds it (`MarginNote.vue:314`, `gridPaths.ts:737`), the tree reds the same two (`:742`, shifted by this delta's five-line insert). B2's NEGATIVE-NEGATIVE and B11 red equally on both. A homes row owed to the instruments lane, never re-keyed here |
| `lint:verbs` | 1 | 1 | equal (`PlayerLobby.vue:142/143`, union-born) |
| `lint:theme-tokens` | 2 | 2 | equal (the wash-reach CONTROL rows, union-born) |
| `lint:motion` | 1 | 1 | equal |
| `lint:copy` (M16) | 0 | 0 | no new product string: the delta adds comments, test names and two constants |
| `lint:theme-selectors`, `lint:ink`, `lint:catch`, `lint:boundary`, `lint:knip` | 0 | 0 | |
| `prettier --check` on the touched files | clean after `--write` (src only, never e2e/) | — | |
| unit: `boardRaster.test.ts` | 4/4 | — | both trees |
| unit: `gridPaths.partial30.test.ts` (crit.partial30) | **6 failed / 1 passed** | — | FIVE's row 1; the negative control GREEN |
| unit (74a2b5d9 tree): `gridPaths.tally.test.ts`, `gridPaths.frame.test.ts` | 6/6, 6/6 | — | |

`lint:bands` and `lint:verbs` do not exist on 74a2b5d9; the 74a2b5d9 tree's present lints (`sleep`, `copy`, `theme-tokens`, `motion`, `ink`) read 0.

## The bank (LAWS P8 §K + P9)

`BANKED.txt` beside this file carries every line; the essentials:

- **Open state agreed**: the tree cut through a temporary index at open read `df9999af` / sha1 `457a7984` / 600,007 B / 37 files, `pass9.diff` byte for byte.
- **Homes v3 applied by sha first** (`homes.on-WAVE.diff` `0723d508`, `--3way` into a temporary index, rc 0); all 13 home paths blob-equal to `74a2b5d9` + `homes.diff` (`07257854`) = `ac862f1e`. No residual home edit; no import from docs/.
- **`pass10.diff`**: declared base **`ac862f1e`** (74a2b5d9 + homes v3; the bank carries no second copy of the homes, LAWS P9 §A) → lane tree **`7674feb8`**; 164,468 B, sha1 **`aded94f9`**, 24 files +2,406/−198. Checks: on `74a2b5d9` **0**, on `ac862f1e` **0**, on the WAVE `954bbbab` **1** (the 74a2b5d9 arm's tally, pen and palette rows collide with the union, as at passes 8 and 9; the union route is the on-WAVE delta). Replay re-derived: `ac862f1e` + `pass10.diff` = `7674feb8`.
- **`pass10.delta.on-WAVE.diff`**: declared base **`8c46d9de`** (`954bbbab` + homes v3) → **`2e5a1b73`**; 11,096 B, sha1 **`5b12eec0`**, 6 files +105/−12 (GameBoard.vue, boardRaster.ts, gameCell.css, useGameCell.ts, gridPaths.ts, gridPaths.partial30.test.ts). Checks: on the bare WAVE `954bbbab` **0**, on `8c46d9de` **0**, applied for real there → `2e5a1b73`, equal to the lane's cut. The section's integrated tree IS the WAVE (the prompt), so the two rows are the section's.
- Every check ran on a fresh `git archive` with its own `git init` (gitdirs `chk74/.git`, `chkW/.git` printed in BANKED.txt); the bare-WAVE rows through a temporary index (`--cached`).
- Greps: `scratchpad|/private/tmp|/tmp/|.claude/t9-scratch` 0 and 0; dot-path `+++` 0 and 0.
- Not committed; the tree's diff at return = product paths only (the scratch vite config moved to the lane's trash before the cut).

## Replay route

1. `git archive 74a2b5d9` → `git init` → `git apply homes.diff` (`07257854`) → `git apply pass10.diff` = `7674feb8` (the 74a2b5d9 arm; GRAPHITE ships by default there).
2. `954bbbab` (74a2b5d9 + `pass9/integrate/WAVE.diff` `b3725e4f`) → `homes.on-WAVE.diff` (`0723d508`) = `8c46d9de` → `pass10.delta.on-WAVE.diff` = `2e5a1b73` (the union route). Row 1 reads it with the one-line flip `RING_ARM = "graphite"` in `pencilConfig.ts` (the reader's plant, never banked; the WAVE ships the owner's blue arm, U-10).

## Incidents (self-declared)

0. **The kernel zone leak ARMED at 20:28:52** (reap-orphans: `data.kalloc.1024` growing 30.2/s; inuse 16,375 at open, 131,207 at 20:38, far under 8M). Every browser row opened under 8M. Reported per the guard's instruction; the owner decides on the reboot.

1. **The 12.5 arm, queued and withdrawn.** The 12.5 build's WebKit band was chained behind its chromium run; chromium read phone812 1.349 (12.5 rasterises as 12), so the WebKit job was killed by its recorded guarded PID while it still waited for the machine-wide lock. It never launched a browser.
2. **The 16×16 chromium job withdrawn once.** Queued for a browser slot when the row-1 WebKit run took the lock; killed by PID while queued (no children) so the lane never ran two browser runs at once; re-run after.
3. **Heavy slots held by preview servers.** Each `vite preview` holds one of five machine-wide heavy slots for its `--timeout`. The lane's tree server was stopped and restarted three times (12.5 → 13 → the final build → the 74a2b5d9 build), each restart re-queued behind other lanes' servers (19:27 → 19:32:17 the longest). Queue time is declared, not a stall.
4. **A partial hygiene apply.** The hygiene script edited the 74a2b5d9 tree's `gridPaths.ts`, then asserted on GameBoard's import line (the 74a2b5d9 tree imports `generateCellRects` alone). The script was made idempotent and re-run on both trees; the constants appear exactly once in each (`grep -c` 2 = the two exports).
5. **`prettier --write` after the final build.** GameBoard.vue, useGameCell.ts and the partial30 test were re-formatted (whitespace and line breaks only) after `index-BkzF3wJejISl.js` was built and read. The banked source is the formatted one. The rebuild from the banked source (trap-guarded flip, `od -c`-verified, reverted) reads **`index-B-HJEDCezeHq.js`**, CSS 115,719 B, NOT the read hash: `@vitejs/plugin-vue` keys a production scope id on the SFC's source text, so GameBoard.vue's id moved `672e8971` → `dc434cd8`. Normalising that id and the content-hashed chunk names, all 32 emitted files of the two builds are byte-identical (sha1 sets equal), so row 1's reading carries to the banked bytes by construction (an attribute rename paints nothing). The 74a2b5d9 build `index-D-11OvPzYUqI.js` was cut after the format and is the banked bytes.
6. **Temporary-index objects in the shared store.** The homes-equality and replay checks wrote trees through temporary indexes in the worktree, so their blobs and trees (`ac862f1e`, `7674feb8`) sit in MAIN's object store (declared, as the §3/§4 and §13 folds did).
7. **The scratch spec is not a product row.** `ring4.crit.ts` and `band16.crit.ts` live in the WAVE copy's `.g10-band/` (scratch, never banked). They import the ONE library by relative product path; `band16` is `bandc.crit.ts` with the board size and the givens read from the environment and the cell index keyed on the board's own width.
8. **lint:bands B13 red on the clean union + homes v3** (not this lane's): found by reading the battery against bare `954bbbab` as well as `8c46d9de`.

## Instruments, by path

- `bandc.crit.ts` (f256121a), `band-stat.mjs` (d2e2d620), `band-lib.ts` (424b3e98): the WAVE9 reader's rig copy, scratch, `.g10-band/spec/` in the WAVE copy.
- `e2e/lib/edge-bands.mjs` (`fourBands`, B7) and `e2e/lib/rest-probes.mjs` (`atRest`), homes v3, imported by relative product path from the scratch `ring4.crit.ts`.
- `scripts/check-motion-bands.mjs`, `check-sleep-lint.mjs`, `check-pencil-verbs.mjs`, `check-copy-register.mjs`, `check-theme-tokens.mjs`, `check-theme-selectors.mjs`, `check-motion-contract.mjs`, `check-ink-pressure.mjs`, `check-empty-catch.mjs`, knip, the boundary eslint config, `typecheck:e2e`: the WAVE's own, run in both scratch copies.
- No crop shot this pass (0 B of the 102,698 B headroom spent): numbers first, and the frames the charter names belong to rows 5–6, unread.
