# CTRL-FACE · pass 7 prototype

Work tree `.claude/worktrees/wf_f72f3b5a-83a-33`, base `74a2b5d9`, advanced IN PLACE on the pass-6 diff (uncommitted).
At open, `git diff --stat` read 23 files +3,953/−354 plus 2 untracked (keys-crib.spec.ts 209 lines, check-face-engine-identity.mjs
349 lines) = 25 files +4,511/−354, 365,758 B: BANKED.txt's shortstat and byte count exactly (the sha1 differs only by the order
the untracked files were appended to the patch; content diffed line-for-line against `pass6.diff`, no hunk differs).

- Tree dist **`index-CtWTXdOHS29Y.js`** (rebuilt after the last `src/` edit; the build's own content stamp `ee2b1e36…`
  equals the tree's STAMP_FILES digest). Served :4234 (listener pid 49631).
- π control `74a2b5d9` = w7-control `index-CubiZsMVSwTc.js`, :4235 (pid 49633), verified by hash.
- Integrated §10 tree `74a2b5d9 + pass6/integrate/s10.diff` built from a scratch archive: **`index-QGTCf7nYCMIb.js`**
  (the integrator's recorded stamp, reproduced), :4236 (pid 88141).
- `s10e` = `74a2b5d9 + s10.diff + pass7-delta.diff + s10-only.PROPOSED.diff`: `index-C_oT0SyoT7iH.js`, :4238 (pid 22893).
  (:4237 was held by CTRL-TAPE's `tape7-s10p` preview, pid 95633: never touched.)
- One payload on every row: `?size=3&difficulty=MEDIUM&board=ATMu…MDc5` (M17's), givens read back `530070000600195000…`
  through the input corpus on every arm that asserts it.
- **Box load 19–175 (1-min) through the pass; 40–60 on the timing rows; 60–100 sibling node/playwright/WebKit processes.** The law
  asks < 4. Every timing number below is a loaded-box reading.

## Gaps first

1. **G6 (charter row 2) is a stated cost, not a green.** The crib's copy is NOT on the first painted frame (it is a 200 ms
   `0fr → 1fr` fold). Post-paint, 5 runs per engine: the first moved frame lands **+12.9…+34.8 ms** after the click in chromium
   (photo clock, 95 photos/s) and **+28…+46 ms** in WebKit (subject track; WebKit photographs are 21/s, a coarse witness);
   motion 207–254 ms; max rAF gap during the open **16.9–27.4 ms** chromium, **15–20 ms** WebKit (1 frame > 17.5 ms on 1 of 5
   WebKit opens). Load 40–60. The recorder's `busy:150@40` plant reds chromium 2/2 (held 104–120 ms) but in WebKit it ran BEFORE
   the fold started and shows only as latency (+195/+197 ms against +28…+46): the recorder's held clause cannot see a stall that
   delays a start. A latency clause with that plant as its negative is owed; not built.
2. **Row 9 (the §2.6 settle row exercising `pencils`) stays a declared reading.** On the merged tree `pencils` is unreachable at
   both cells: rail 1440×900 needs scrollTop 413.6 of max 185; drawer 375×667 well 120.0 px < the row's minimum. `new game` reads
   lag 0 at both. Not re-cut (the cells are W2's).
3. **The union `@property` block is RED C2 (two blocks in one home).** Naive union (`s10e` + `s13-s7-s3`'s stylesheet hunks,
   two unrelated conflicts resolved by hand): 19 registrations, 19 unique names (FACE's 11 at index.css:205–266, LADDER's 7 rungs
   + `--live-fit` at 644–683), but in TWO blocks. Merging them is the fold's act. Each tree alone reads GREEN (below).
4. **The paint rows import the chair's libraries from THIS evidence dir** (`T9_EDGE_BANDS`, `T9_SHAPE_CENSUS` env override,
   absolute default path). CI would red CHECK 7 loudly ("the shape-census library is not at …"). The product home of
   `pass7/instruments` is the fold's; until then these two rows run on this box only.
5. **Three PROPOSED extensions to the chair's instruments** (the ONE copy is not edited; the extended copies are here with their
   diffs): `edge-bands.mjs` gains `off` (an outline ring is not an element: edge-OFF is `outline-color: transparent`) and
   `window` (a DASHED ring's gap is its drawing; a station is the max over 4·DPR+1 columns). `shape-census.mjs` gains the `*`
   wildcard subject, reads `@utility`/`@font-face` own declarations (the chair's copy dropped every declaration inside an
   at-rule body: typography.css's twelve `@utility` families never reached any law), splits Tailwind classes without cutting
   `font-[…]` arbitrary values, and keeps `file` on template sites (it was nulled). The chair's own battery on the extended
   copy: 19/19 plants RED, NN GREEN, self-test 24/24 (same as the chair's copy).
6. **`--motion-whisper` still reds the undefined-token census on this tree** (TIMING, `GameControlPanel.vue:2786`), net +1 vs
   the control. The pass-6 return's "0 ms, as before" is corrected: **250 ms on `74a2b5d9` (`duration-250`) → 0 ms here until
   §13's block lands.** Resolves at the §13 fold; not re-cured locally.
7. **T9-R8 (the selected chip's glyph fraction 0.273/0.302 vs the control's 0.164/0.204)** is cited to the ledger row, not
   re-cured, not re-measured this pass.
8. **The sideways range is hidden, not removed.** `scrollWidth` still reads 282 ≠ `clientWidth` 218 (the hover notes still
   overhang); `overflow-x: hidden` takes the scrollbar and user range away. A note shown at the card's right edge was already
   clipped there and still is.
9. **keys-crib G3 has no in-file plant.** It is GREEN post-paint on both trees (0.00–0.31 px here, 0.02 px on the merged tree
   where the in-rAF read said 5.9–30.8). The plant that reds it (the parked cap: 50.91 px) is the integrator's, not in the file.
10. **The π census reads ZERO outside the claim, and by construction it does not see the card.** `instruments/pi-paint.mjs`
    (tree :4234 vs control :4235, plus control vs control as the floor and a `.hand-drawn-grid { opacity: .98 }` plant),
    1280×800 fine · 1280×800 coarse · 390×844 coarse × light/dark, both engines: **paintΔ 0 · rectΔ 0 · missing 0 on 855/855
    and 877/877 nodes, every cell; floor 0 everywhere; the plant reds 1/1 on every cell** (`readings/pi-paint.log`). The card's
    own change is measured on its own rows (row 3: WebKit's fade +17.00 at the coarse rail).
11. **Carried, one line each:** the `.face7/` scratch moved out before return; CHECK 6's MDN constants; the /8 protocol; ROW 2
    pencils −0.02 (chromium) on the tape row; `check-pw-projects` check 8 (the chair's restamp); `lint:bands`/`lint:verbs` absent
    on this tree and the control (MOT's, §13); vite.config.ts not prettier-clean on the control either (out of `npm run lint`'s
    scope); H5.

## Numbers (charter rows)

**Row 1 · the ring reads PAINT on four bands.** `face-law` "the rings, by keyboard" now photographs every ring site ring-ON
against ring-OFF (`outline-color: transparent`) with the chair's `fourBands` (per-band core median ≥ 3.0; empty band RED) and
reds X1 and FAINT15 in the same run. The CLI (`instruments/ring-bands.mjs`) over every cell:

| arm | cells | clean t/r/b/l | X1 opacity 0 | FAINT15 | X6 bottom erased |
|---|---|---|---|---|---|
| tree, both engines | 1280 fine chip + selected chip × light/dark × DPR 1/2; 390 coarse heading + chip × light/dark | **4.286–4.289 on all four bands, every cell** | 1.00 ×4, RED | 1.151–1.207, RED | bottom 1.00, RED (top-only reads GREEN) |
| control 74a2b5d9 | same | chromium light 3.74/3.74/3.74/**1.00**, dark 1.20; WebKit 1.00 ×4 (no ring painted) | RED | RED | RED |

In-spec, whole face-law both engines: `.tray-well .ctrl-btn` and `.mobile-heading-btn` 4.289 ×4 (light), X1 1.00, FAINT15 1.205–1.207.

**Row 2 · G6.** Gap 1.

**Row 3 · INTAKE row 11, the coarse rail.** Deal bottom vs the fade at scrollTop 0 (`instruments/coarse-deal.mjs`, hasTouch):

| cell | tree before (pass 6) cr / wk | **tree now** cr / wk | merged `s10` cr / wk | control cr / wk |
|---|---|---|---|---|
| 1280×800 | +7.14 / **−9.81** | +7.14 / **+7.19** | +42.95 / +26.00 | −67.22 / −84.19 |
| 1440×900 | +38.39 / +21.47 | +38.39 / +38.47 | +74.55 / +57.61 | −35.98 / −52.91 |

The cause: `overflow-y: auto` computes `overflow-x` to auto; the `.washi-wide` hover notes (15rem) overhang the 218 px card by
64 px on every arm; WebKit's classic 17 px sideways bar lifted the bar's fade. Cure: a file-end rule, `.controls-card
{ overflow-x: hidden }` at ≥ 1024. On the merged tree the foot already clears it (TAPE's foot takes the bar out of the port and the
fade becomes the card's own `::after` sentinel): **the `.drawer-case` re-aim reaches it; RULE's sideways cure is not needed there.**
New shipping row "M17 G3 at the coarse rail" (1280×800 and 1440×900 hasTouch), both engines, both trees: G3's own plant reds
everywhere (Deal 774.56–809.03); the sideways-range plant reds where the bar sits in the card (WebKit 1280: fade back to 578.34).

**Row 4 · the park has an exit.** `toggleKeys` un-parks one rAF later when the fold carries no animation.

| read | chromium | webkit |
|---|---|---|
| chair's `rest-probes --preset unpark`, two presses, root 18 px (tree) | **132 = 132 GREEN** (pass 6: 121 vs 132) | **132 = 132 GREEN** |
| same, one press (tree) | 244 = 244 | 244 = 244 |
| keys-crib e2e, cure (`--pin-tape-h`) — tree / merged `s10e` | 36 = 36 / 36 = 36 | 36 = 36 / 36 = 36 |
| keys-crib e2e, PLANT (a rung that never ends) — tree / `s10e` | stale 32 vs 36 (reds as asserted) | same |
| unit, cure / PLANT; negative (exit stubbed out, sha restored `2ebd7376`) | 2/2; the cure arm reds `'' ≠ '0px'` | — |

**Row 5 · the three reader-less lengths.** `--card-pad-x` (0 readers, 0 writers) struck from the block on both trees.
On the merged tree `s10-only.PROPOSED.diff` strikes `put("--action-bar-h")`, `put("--card-pad-t")` and `@property --card-pad-t`
(their last readers left with the bar), and re-keys keys-crib's annotation to `--card-foot-h`. On THIS tree both keep their
readers (`scroll-padding-bottom`, the top sentinel, `--washi-tag-top`), so that hunk cannot apply here by subject.
face-law §11 now reads `--pin-tape-h` in `--card-pad-t`'s seat and a row-published unregistered control, on both trees.
Undefined-token census: my names absent from the finding list on tree, `s10`, control; totals tree 1 (whisper) · `s10` 3
(whisper + `--tap-floor` ×2, TAPE's) · control 0; STALE `--refuse-dur` on all three.
`check-property-block`: tree 12 source registrations, 63 served, GREEN (+ self-test GREEN); `s10e` 11, GREEN, served;
control 0, GREEN.

**Row 6 · `face-law:774–788`.** The tape row's exclusion now reads the painted stack (`elementsFromPoint` at the tape's centre
reaches `.action-bar` or `#card-foot`) instead of `[data-under-bar]`. Same-run plant: the old flag + opacity 0 on a tape
nothing covers: flag says excused (true), paint says not (false). Tree: `players` excused (the bar is over it); merged: 4/4
tapes painted (`players` 4.00/0.74 cr, 4.33/1.73 wk).

**Row 7 · CHECK 7 on the SHAPE law.** Re-cut on the shape-census library (the wildcard subject). 69 sites read on this tree
(pass 6's parser: 46 reachable, the twelve `@utility` families invisible). Tree GREEN (0 findings). In-process plants, every
one RED: literal · shorthand · **var-led shorthand** · `font: var(--x)` to a literal · a token alias to a literal · `@utility`
body · `!important` in a media block · **template `style=`** · **`:style` object** · `:style` quoted key · **`font-serif`** ·
`font-[…]` · `.style.fontFamily` · `setProperty` · a computed key · `public/` stylesheet · `index.html` `<style>`. Lawful forms
green (`font: inherit`, size + token, var-led + token, `font-[600] font-[var(--face-written)] font-mono`, an `@font-face`
descriptor). Born-RED on planted scratch copies: **pass-7 exit 1 / pass-6 exit 0** for the var-led shorthand, `style=`,
`:style`, `font-serif` and an `@utility` literal (5/5).
**The stamp binds CONTENT.** The build's `face-stamp` plugin writes `{js, stamp}` beside the census (outside `dist/`, nothing
ships); the gate compares both. The critic's scenario on a scratch copy (6ch planted, the pre-build mtime restored with
`touch -r`, census restamped to the planted src): **pass-7 exit 1 ("built from other bytes") / pass-6 exit 0.** Self-test 11/11
bite (3 new: other bytes, other js, no stamp).

**Row 8 · the seal, post-paint (report only).** PANEL_H at 1280×800 hasTouch + isMobile, default route:

| arm | chromium DPR 1 / 2 | webkit DPR 1 / 2 |
|---|---|---|
| tree | 992.94 / 992.94 | 992.81 / **993.81** |
| integrated `s10` | **928.13 / 928.13** | **928.00 / 929.00** |
| control 74a2b5d9 | 1227.09 / 1227.09 | 1227.06 / 1228.06 |

WebKit DPR 2 reads +1.00 on every arm (a rounding of the engine, not of a tree). `const SEAL = 1261` untouched.

**Row 9.** Gap 2.

**Row 10 · frames and ballots.** One replacement crop (below). **T9-B20: firing default (a) grown 2+1.** It now clears the fade
in both engines at the coarse rail (+7.14 / +7.19); (b) the kept column puts Deal under the fade in both (690.88 / 690.53 vs
595.64, pass 6). **The default's loss, named:** `16×16` orphaned on its own line, [2,2,2,1,1], so the one-line law (G2) fails at
the coarse rail under (a). B18's kept column stays struck by its own condition (marks fits one line at 1280; framed once, pass 6
f3, swept to history per `pass6/SWEEP.md`).

**Row 11 · apply checks.** `pass7-delta.diff` (48,357 B, 9 files, +612/−164, sha1 `94b5e600`): `git apply --check` **0 on
`74a2b5d9 + pass6.diff`** and **0 on `74a2b5d9 + s10.diff`**. The one hunk set that cannot apply on this tree by subject is
`s10-only.PROPOSED.diff` (2,734 B, sha1 `4fea3a84`), which applies on `74a2b5d9 + s10 + pass7-delta`. The sideways cure was
moved to the file's end for exactly this reason (at the cap's own block the two trees' context differs).

**Row 12 · INTAKE-22 §7 rows 1–17** (tree; main-HEAD = the control for these files, per pass 6's `git diff 1e6cfbbf 1d0dc4fd --
web/frontend/src` = empty):

| row | status | pass-7 number |
|---|---|---|
| 1 | CLOSED | keys-crib 19/19 hit · scrollTop Δ 0 · 0 scrollIntoView · drift ≤ 0.31 px post-paint, both engines, both trees |
| 2 | writes CLOSED; G6 OPEN as a stated cost | un-park 132 = 132; first painted move +13…+46 ms (gap 1) |
| 3 | landed (pass 5) | — |
| 4 | OPEN (ballot T9-B14) | unchanged |
| 5 | CLOSED | "what the keys do"; check-copy-register 0 bare |
| 6 | carried | not re-instrumented |
| 7 | CLOSED | face-law M17 G1–G5 green both engines; G3 now also at the coarse rail |
| 8 | CLOSED | one `@property --zone-step`; §11 row green |
| 9 | landed | — |
| 10 | OPEN | G6 die 1.0 / 1.5 (pass 6 reading) |
| 11 | **CLOSED on this tree** | WebKit 1280 coarse −9.81 → **+7.19**; merged +26.00 |
| 12 | **CLOSED (crop taken)** | Deal hit box 71.19 → 60; 430×932 case top 256.84 → 233.72 (+23.12 taller), tab 208.84 → 185.72 |
| 13 | CLOSED | visual-regression 12/12 both engines |
| 14 | CLOSED (pass 5) | — |
| 15 | CLOSED | pass 6 f3 (history) |
| 16 | CLOSED as a reading | T9-R8 cited |
| 17 | CLOSED | walked gate in face-law, 43/43 both engines |

Row 29's FACE half (the `.drawer-case` re-aim) is `s10` seam 5; measured above (row 3).

## What changed this pass (product)

- `GameControlPanel.vue`: `toggleKeys` un-parks one rAF later when the fold carries no animation (+11 lines).
- `scene.css`: `.controls-card { overflow-x: hidden }` at ≥ 1024, its own rule at the file's end.
- `index.css`: `@property --card-pad-x` struck.
- `vite.config.ts`: `faceStamp()` writes `.face-engine/dist-stamp.json` (`{js, stamp}`) at build; nothing enters `dist/`.
- `check-face-engine-identity.mjs`: a dist census is bound by content (the sidecar) instead of mtime; 3 self-test plants.
- `check-font-coverage.mjs`: CHECK 7 re-cut on the shape-census library with 17 plants and 5 lawful forms.
- `face-law.spec.ts`: ring paint (four bands + X1/FAINT15), tape-exclusion re-aim + plant, §11 re-key, the rendered-law negative
  POLLED to its effect (pass-6 critic §2.6: it read 0 off-law once on WebKit), coarse-rail G3.
- `keys-crib.spec.ts`: the sampler reads post-paint (a MessageChannel task from the rAF); the un-park row with its plant.
- `GameControlPanel.test.ts`: the un-park unit, cure + plant.

## Pre-return battery (bare; tree | control 74a2b5d9)

| check | tree | control |
|---|---|---|
| lint:lanes · lint:theme-tokens · lint:theme-selectors · lint:sleep · lint:motion · lint:copy · lint:ink · lint:catch · lint:live-regions | 0 | 0 |
| test:font-coverage (CHECK 7 re-cut) · test:support-floor · check-copy-register bare | 0 | 0 |
| lint:face-engine (--self-test, 11/11 bite) | 0 | absent |
| test:e2e:projects / check-pw-projects | **1** (check 8 FLOOR BAND, the chair's restamp; declared) | 0 |
| lint:bands · lint:verbs | absent (npm exit 1) | absent |
| eslint . | 0 after `.face7/` moved out (1 before: a var of mine, fixed) | 0 |
| npm run lint (prettier --check src/ scripts/ ../../scripts/ ../relay/) | 0 (after `--write` on my files) | 0 |
| vue-tsc -b (on a `git archive` + pass6 + pass7 delta) | 0 | — |
| check-property-block source + served :4234 | 0 (12 / 63) | 0 |
| vitest, by directory | games 57/744 · pencil 8/73 · composables 3/16 = **68 files / 833** (src/lib: no test files) | — |
| face-law whole file | **43/43 cr · 43/43 wk** (load 113–121) | — |
| keys-crib whole file | 6/6 · 6/6 | — |
| viewport-law · visual-regression | 14/14 · 12/12, both engines | — |
| on `s10e`: face-law · keys-crib · viewport-law | 42/42 · 6/6 · 16/16, both engines | — |
| filter-census + theme-quadrants (built dist, the preview config's specs) | 20/20 · 20/20 | 20/20 · 20/20 |
| π paint census (`readings/pi-paint.log`) | Δ 0 every cell, both engines; plant 1/1 | floor 0 |

## Frames (1, 19,433 B, pngquant 60–90)

| frame | engine · theme · viewport · pointer · DPR · payload | retires |
|---|---|---|
| `frames/p7-f1-m12-trades-control-vs-tree-…-retires-f1-b1-band-none-vs-armA.png` | chromium · light · 1280×800 fine (row a, Deal's hit box outlined) + 430×932 coarse sheet open (row b) · DPR 1 · M17 payload | `pass6/prototype/CTRL-FACE/frames/f1-b1-band-none-vs-armA-chromium-light-1440x900-fine+390x844-coarse-retires-c2-m17-dock-deal-row.png` (36,991 B) |

Left = control 74a2b5d9, right = tree. Retiring f1 takes B-1's only frame to history (B-1 is seated as the one pin line on `s10`).

## MOVED rows (PROPOSED unless stated)

- face-law §11's host names (`--card-pad-t` → `--pin-tape-h`; the unregistered control → a row-published name): LANDED here.
- face-law's tape exclusion (attribute → painted stack): LANDED.
- keys-crib's G3 sampler (in-rAF → post-paint): LANDED; it reds nothing it did not red before on this tree, and it turns the
  merged tree's 8/8 instrument red green (painted 0.02 px).
- The chair's `edge-bands.mjs` and `shape-census.mjs`: PROPOSED extensions (gap 5).
- No r0 row moved.

## MRK-ABS D0 (graft)

The page's rings sit at `outline-offset: 3px` (chip and heading); the deck is not on this page's claimed surface. D0 (the deck
ring at offset 0) is not carried here; it is the deck owners' row.

## Replay route

In place. No diff was replayed onto this tree. The pass-7 change is `pass7-delta.diff` (tree minus `pass6.diff`, cut through a
scratch archive of `74a2b5d9 + pass6.diff`, product paths only). The merged-tree reads were served from scratch archives
(`74a2b5d9 + s10.diff`; `+ pass7-delta + s10-only`), each `git init`-ed there, never in a worktree.

## Incidents

- **Port 4237 was held** by CTRL-TAPE's preview (pid 95633). My `--strictPort` launch failed there and moved to 4238; the foreign
  server was never touched.
- **`--project chromium <spec>`** swallowed the spec paths as project names on the first two runs (exit 1, nothing ran); the
  runner now passes `--project=<name>`.
- **The first eslint read 1**: an unused variable of mine in CHECK 7, removed.
- **The first face-law WebKit runs read 41/43**: the coarse-rail sideways plant didn't red at 1440 (it cleared by 21.47 even with
  the bar in pass 6) and, on the merged tree, not at 1280 either (the foot clears by 26); the plant is now scoped to where it was
  red. The rendered-law negative control read 0 once more, and is now polled.
- **One src edit was planted and restored in place** (the un-park exit stubbed to `false` for the unit's negative), restored by
  `cp`, sha1 `2ebd73761242…` before and after.
- **A `sleep 30` chain was refused by the harness** and replaced by a poll.
- **`git reset --hard HEAD~1` and `git checkout -- .` ran only inside my own scratch archives** (never a worktree, never main).
- No `rm`. Scratch lives under `<scratchpad>/face7-*`; `.face7/` in the work tree is moved to `<scratchpad>/trash-face7/` before
  return. Servers killed by recorded PID: 49631/49571 (:4234), 49633/49572 (:4235), 88141/88099 (:4236),
  22893/22841 (:4238); :4237 (95633, TAPE's) left running.
- **The first built-spec run found no tests**: filter-census and theme-quadrants are ignored by the default config (they ride the
  preview config); re-run under a scratch config with `testIgnore: []`.
