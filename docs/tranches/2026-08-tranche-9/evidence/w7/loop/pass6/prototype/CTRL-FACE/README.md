# CTRL-FACE · pass 6 prototype

Work tree `.claude/worktrees/wf_f72f3b5a-83a-33`, base `74a2b5d9`. The pass-5 diff (banked by the chair as
`pass5/prototype/CTRL-FACE/pass5.diff`) advanced in place, uncommitted. `git diff --stat` at start matched the
pass-5 README's list (22 files + 2 untracked). Final dist **`index-x0ZH4Sjqstwx.js`** (the prettier pass moved the
scope hash; the whole-file e2e estate below was read on `index-DuV3ixM3UGGf.js`, the same source bar formatting, and
face-law / keys-crib / the engine gate were re-read on the final dist). π control `74a2b5d9` = w7-control's
`index-CubiZsMVSwTc.js` on :4232, verified by hash. The pass-5 dist `index-CNVNTjZawUmM.js` was served on :4233 as
the publisher's negative arm. One payload everywhere: `?size=3&difficulty=MEDIUM&board=ATMu…MDc5`, givens read back
through the input corpus (`5300700006001950…80079`) on every arm. Readings: `readings/gates.log`,
`readings/e2e-estate.log`. Main-HEAD `1d0dc4fd` was not re-served: `git diff 1e6cfbbf 1d0dc4fd -- web/frontend/src`
is empty and `74a2b5d9..1d0dc4fd` (W8) touches none of the panel's files, so pass 5's main-HEAD readings (= the
control) stand for the mark rows.

## Gaps first

1. **G-INFO G6 (WebKit long frames per crib open) is unreadable on this box.** Load average 180–300 during every run
   (the law asks < 4). Under that load every arm, the control included, reads a median 17–18 of 60 frames > 17.5 ms.
   The row is reported, not claimed.
2. **B-1 arm A's cost at the coarse rail on WebKit: Deal falls under the fade at scrollTop 0** (588.16 vs fade 578.34,
   −9.82; chromium clears 588.50 vs 595.64). The +14.4 px band moved Deal down; WebKit's fade is 17 px higher because
   of the inherited sideways scroll (scrollW 282 ≠ clientW 218 at 1280 coarse, every arm). RULE's cure (0 sideways at
   8 cells) returns those 17 px by arithmetic (→ clears by 7.2); not on this tree. INTAKE row 11 stays open on WebKit.
3. **Arm A moves the dock at rest: +28.4 px of paper above the first well at 390** (padding 6 → 34.4), rail +14.4
   (20 → 34.4). The first dock tape no longer pins at rest. The 430×932 sheet (+22.86 in pass 5) and the dock card
   deltas were NOT re-measured after arm A. It moves TAPE's pin band and the dock card; the chair seats it.
4. **The selected level chip's glyph-text fraction under 4.5 is above the control's**: 0.273 cr / 0.302 wk against
   0.168 / 0.204 (median 4.897 both). The `keys` sublabel reads 0.398 / 0.413 with no control twin (Deal's sublabel,
   the same ink and rung, reads 0.323 / 0.323 on both trees). No slack is defined for this row; stated, not cured.
5. **`--motion-whisper` is undeclared on this tree** after striking the six rungs: the pass-6 census reds one TIMING
   slot (`GameControlPanel.vue:2775`, exit 1 with the declared STALE `--refuse-dur`). The tween is `none` (the same
   0 ms the struck registration painted). It resolves on §13's block at the fold
   (`instruments/undefined-token-census.motion-whisper.PROPOSED.md`).
6. **INTAKE row 12's before/after crops (Deal hit box 71.19 → 60; the 430×932 sheet) were not taken.** The crop budget
   went to the ballot pairs. Numbers carried.
7. **The M17 rows gate 1280 fine only for G1–G4.** G3 at the coarse rail is not a shipping row (gap 2 would red it on
   WebKit). G5 reads painted rows at 1 css px resolution at DPR 1.
8. **Two of this pass's rows are load-sensitive.** face-law webkit on the final dist read 36/41 on its first run (the
   box at load 217–328; 107 s). Three pre-existing rows timed out at 30 s. Two of the new rows failed:
   - the fold clause's walking ablation found no cut in 45 px at 1280;
   - G5-armed lost the 2.5 s arm across the read.

   A bare re-run read **41/41** (43 s). Chromium read 41/41 first time. G5-armed depends on the product's 2.5 s arm
   window, so a slow box can lapse it: that is a real fragility of the row, not noise.
9. **The whole-file estate ran on `index-DuV3ixM3UGGf.js`, not the final `x0ZH4Sjqstwx`.** The only source change
   between them is prettier formatting of `GameControlPanel.vue` and two scripts.
10. **Carried, one sentence each:**
   - CHECK 6's 18 MDN constants were not re-derived.
   - The /8 protocol has no channel.
   - ROW 2 (pencils −0.02 / −0.04) is carried RED.
   - `check-pw-projects` check 8 is RED, declared (the chair restamps). face-law grew from 34 to 41 rows.
   - The dark filter census is the chair's fold pick (the `crayon-heart` deletion).
   - G11's full π census was not run.
   - TABS' yield (the landscape flank tools, the 1024×768 floor probe) was not taken.
   - The `#1a1a1a` / `#ffffff` keys-underline literals stay: a data-URI raster no token reaches.
   - The `line` prop has no consumer under ARM A (it dies with B16).
   - The 320×568 dock's +10 px is superseded by arm A's +28.4 and was not re-read.
   - H5 (the wells' corner brackets framing the open crib) is visible in f2 and waits on TAPE/RULE's lip (INTAKE row 1's order).

## What changed this pass (product)

- **`index.css`:** the six `@property --motion-*` rungs are struck (registry §2.13), and `--pin-tape-h` is registered in the block.
- **`GameControlPanel.vue`:**
  - The bar publisher parks during the crib's rung and publishes on `transitionend`/`transitioncancel` (filtered to `grid-template-rows`, reversal-safe via `getAnimations`).
  - An unchanged value is never re-written.
  - It publishes `--pin-tape-h` (the tallest tag's painted box) before it reads the padding.
  - The content observer republishes the bar's numbers.
  - The hover note reads "what the keys do", one sentence with the aria-label.
- **`scene.css`:** B-1 arm A, `.controls-card { padding-top: calc(0.15rem + var(--pin-tape-h)) }`.
- **`check-font-coverage.mjs`:**
  - `keys` is filed in a STRICT sublabel group (a departure there is a problem).
  - CHECK 7 parses the `font:` shorthand and Tailwind `font-[…]`, with 4 in-process plants and 4 lawful forms.
- **`check-face-engine-identity.mjs`:**
  - A dist census is bound to `dist/index.html`'s names and to its freshness (dist newer than every `src/` file).
  - `KeyboardLegend.vue` is added to `STAMP_FILES`.
  - Two new self-test plants.
- **`face-law.spec.ts`:**
  - The census records `served`.
  - The ceiling table is struck for the fold law.
  - New: the walked occlusion gate, and M17 G1–G5 with plants.
- **`visual-regression.spec.ts`:** the pass-5 PROPOSED diff is landed (applied clean).

## Numbers (charter rows)

**Row 1 · W2 §2.5 @1440×900: CURED on this tree (arm A).**
- viewport-law is 14/14 in both engines (pass 5: 13/14). The control is 14/14.
- The walk (`b1-arms.mjs`, every 5 px) reads 0/37 poses covered. The control-shaped `none` arm (band 20 px) reads 13/34, worst 665.0 / 666.1 px² ("new game" over Medium at the end).
- At 390 dock: 0/15 against 8/10, worst 1357.8 / 1356.7 over the `Size` tab.
- At the 1280 coarse rail: 0/96 against 58/94, worst 1784.4 / 1780.1 over `16×16`.
- Arm B (a shorter rung while pinned), upper bound = every tape at the tag rung (17.98 px): rail 0/34, but **dock 6/10, worst 144.5 / 144.3**. The 6 px dock band is shallower than any tape the estate ships, so B cannot cure the dock.
- Mechanism found on the way: the tape's tilt makes its painted box 31.5 against offsetHeight 28. `--card-pad-t` was published stale (2.4 against 30.4) until the tape depth was published first.

**Row 2 · the walked gate** (face-law "the case-wide occlusion gate, walked", 1440 fine + 390 coarse, every 5 px, top to end, STUCK flagged):
- Tree: 0/37 · 0/15 (chromium), 0/37 · 0/16 (webkit).
- Plant (the band struck to 6 px) reds 21/31 · 8/10 (cr) and 18/31 · 8/10 (wk).
- Control born-RED: 53/102 at 1440, 3/16 at 390.
- The first plant (tapes 16 px deeper) read 0/31 on the dist. The product re-publishes the band, so it was re-cut to strike the band.

**Row 3 · the ceilings are struck.** The fold law stands in their place:
- The opaque edge (bar + skirt) may hide a name wholly or not at all, unless the rest of that name is under the fade.
- The fade dissolves.
- Any other surface reds.

Readings:
- Tree 1280: 6 names below the fold, `what fits` dissolving 96.63 %, CUT 0, novel 0.
- Tree 390: `players` dissolving 92.21 % (7.79 opaque + fade), CUT 0.
- Control: `pencils` / `marks` below at 1280; `players` dissolving 100 % at 390. GREEN.

Ablations, same run:
- The fade struck and the edge walked up 3 px at a time. The tree cuts at 0 px (390) and 3 px (1280); the control at 3 px and 24 px.
- The planted div reads 89.04 % / 100 % (novel).

The pass-5 table on arm A read 6 of 8 pairs "over" on a card with no new surface. It measured which names sit in the bar's band.

**Row 4 · the engine stamp binds the served artifact.**
- Dist census (`served.mode dist`, index-DuV3ixM3 / BhSoPY4Q): PASS, 8/8 plants bite, painted mark 32.667 / 32 @dpr3.
- The critic's scenario (6ch planted, census restamped to the planted src, dist not rebuilt): **EXIT 1**, "the served dist predates GameControlPanel.vue".
- Restored by `cp -p` → EXIT 0.
- Freshness is mtime. A revert that bumps mtime reads stale until a rebuild, which is the safe side.

**Row 5 · CHECK 7.** File plants on OptionSelector.vue, bare (sha `f312e3d30fd5` restored):
- `font: 400 1rem "Comic Sans MS"` → 1.
- `font-[Comic_Sans_MS]` class → 1.
- `font-family` literal → 1.
- The lawful `font: 400 1rem var(--face-printed)` → 0.

**Row 6 · M17 ships its gates** (face-law, final dist, both engines; each plant reds in the same run):

| row | cr | wk | plant |
|---|---|---|---|
| G1 zone | 303.28 | 303.23 | +200 pad → 500.09 |
| G2 lines | [1,1] | [1,1] | column → [3,3] |
| G3 Deal vs fade | 480.53 vs 595.64 | 480.19 vs 595.34 | deal-row +200 → 666.94 |
| G4 tape → name | 13.72 | 14.29 | `--zone-step: 0` → 0.13 / 0.70 |

G5 painted glyph bottoms |Δ| is 0.00 at 1280 fine, 1280 coarse rest, 1280 coarse armed ("sure?" held across the read) and 390 settled. The plant (dealt 3 px low) reads 3.00.

The control reds all 7 rows in both engines. The VR diff is landed: visual-regression 12/12 in both engines (pass 5: 10/12), against the control's 10/12 (8b and test 10 red on it).

G4 at 13.72 (chromium) clears its 13.6 floor by 0.12.

**Row 7 · INTAKE row 2 · `--action-bar-h` writes per crib open** (`publisher.mjs`, 8 interleaved opens):

| arm | chromium | webkit |
|---|---|---|
| tree | **1** (every open and every close) | **1** |
| pass-5 dist (negative) | 20–24 | 4–12 (the load drops frames) |
| control | 0 | 0 |

The keys-crib rows hold on the dist, 4/4 in both engines (the control is 0/4). The first parked form wrote 2 per open; the unchanged-value guard took it to 1.

**Row 8.** f2 re-shoots the crib pose on the current source (dev, both arms), and f4 carries the dist crib-open panel. H5 is declared (gap 10).

**Row 9 · T9-B14 measured.** The ring arm (`KEYS_ARM="ring"` flipped on dev, restored by sha `a8c0bcb5c437`) against the verb arm, chromium DPR 2:
- G8: card, bar and board rects are identical to the hundredth.
- Filters: 5 = 5 in the card, 24 = 24 url-filters on the page.
- Ring paint (ring-ON minus ring-OFF): core median 4.726 light / 5.554 dark, fraction under 3.0 of 0.352 / 0.283.
- The `i` is 32×32 at the bar's right edge.
- Verb spacing is 59.64 against 55.03.
- Framed in f2, 2× both themes, rest and open.

**Row 10 · the M17 ballot frames** (f3, f4; `m17-frames.mjs`, dist, both engines):

| ballot | default | alt |
|---|---|---|
| B16 | ARM A: scrollH 817 / 816 | ARM B: 997 / 997, lines 3+3 |
| B17 | beside: zone 303.28 / 303.23 | under: 342.06 / 342.19 |
| B18 | line | kept column: marks 3 lines, scrollH 907 / 907. Marks fits one line at 1280, so the ballot's own condition strikes it at this rung |
| B19 | intrinsic: min chip 42.56 | grown: 76.64 / 76.67 |
| B20 (coarse) | (a) grown 2+1 [2,2,2,1,1]: zone 411.25, Deal 588.50 / 588.16 | (b) kept column [3,3,3,1,3]: zone 513.63, Deal 690.88 / 690.53 (under the fade in both engines) |

**Row 11.** The six rungs are struck; `check-property-block --self-test` is GREEN (C1–C6 plants red).

**Row 12:**
- `keys` STRICT group: a plant deleting the call site → EXIT 1.
- One sentence per control.
- The 40 % ink plant reds every station, both trees, both engines, both themes. Dark stations drop out as insufficient ink, which counts as under.

The glyph-text table, core median / fraction under 4.5, DPR 2:

| station | tree light cr/wk | control light cr/wk | tree dark cr/wk |
|---|---|---|---|
| unselected chip | 4.659 · 0.281/0.308 | 4.659 · 0.281/0.306 | 7.681 · 0.005/0.029 |
| selected level chip | 4.897 · 0.273/0.302 | 4.897 · 0.168/0.204 | 10.233 · 0 |
| level h2 | 4.897 · 0.125/0.126 | 4.897 · 0.125/0.126 | 10.233 · 0 |
| deal sublabel | 4.659 · 0.323/0.323 | 4.659 · 0.320/0.333 | 7.681 · 0.010/0.009 |
| dealt | 5.236 · 0.305/0.300 | 5.236 · 0.303/0.303 | 6.014/6.069 · 0.068/0.077 |
| keys sublabel | 4.659 · 0.398/0.413 | absent | 7.681 · 0.022/0.024 |

A second bare photograph reproduced every tree reading. On the control, the light `level h2`'s second read (3.838 / 2.835) caught the control's 250 ms heading tween. That is an instrument note, not a finding.

**Row 13 · G6 restated:**
- Die ink-left against h2 ink-left: 1.0 cr / 1.0–1.5 wk (pass-5 reading, same markup).
- The DiceIcon's ≈3 px viewBox inset and Fraunces' side bearing are named.
- Proposed ≤ 1.5. Not earned ≤ 0.5.
- G2's ink floor is the chair's number and was not re-derived.

**Row 14.** B20 is framed (f4). Sideways scroll 282 ≠ 218 is inherited on every arm. Cite RULE's cure (0 at 8 cells).

**Seal (report only):**
- Shipped 992.94 / 992.81 (spread 0.13). The control is 1227.09 / 1227.06.
- Captions on the hand rung Δ 31.25 / 31.22.
- Test 10 as landed now carries the EXTENDED unpaid control: 1354.84 / 1354.89 > 1261, so it reds.
- The panel wrap does not include the card's padding, so arm A does not move the seal's quantity.

## INTAKE §7 rows 1–17 (tree; main-HEAD = control per the note above)

| row | status | tree / main-HEAD |
|---|---|---|
| 1 | CLOSED (sequenced after the lip) | keys-crib 4/4 both engines / 0/4 |
| 2 | CLOSED on writes; G6 unreadable (load) | 1 per open / 0 (crib not in bar); pass-5 20–24 |
| 3 | landed (pass 5) | press cure on five verbs |
| 4 | OPEN (ballot) | ring arm measured and framed; scaffold stays until B14 fires |
| 5 | CLOSED | one string "what the keys do"; lint:copy 0 |
| 6 | carried | not re-instrumented |
| 7 | CLOSED | G1 303.28 / 503.19; G3 480.53 vs 595.64; G5 0.00; G8 Δ0 (B14 read); shipping rows in face-law |
| 8 | CLOSED | one `@property --zone-step`; G4 plant 0.13 |
| 9 | landed (pass 5) | |
| 10 | OPEN | G6 1.0 / 1.5 against the proposed 1.5 |
| 11 | OPEN | B20 framed; Deal under the fade on WebKit coarse (−9.82) |
| 12 | OPEN | numbers carried, no crops |
| 13 | CLOSED | VR 12/12 / 10/12 |
| 14 | CLOSED (pass 5) | |
| 15 | CLOSED | B16–B19 in f3, B20 in f4 |
| 16 | CLOSED as a reading | glyph-text table above; the 40 % plant reds |
| 17 | CLOSED on this tree | walked gate 0 poses / control 53/102 |

## Ballots (both frames on one payload, one variable each; arms in `arms/README.md`)

- **B-1** (f1, chromium · light · 1440×900 fine scroll end + 390×844 coarse st 35).
  - none (band 20 / 6) against **A (band 34.4, the default)**.
  - B is refuted at the dock by its own upper bound (6/10 poses).
  - A costs +14.4 px rail and +28.4 px dock at rest, and puts Deal under the fade on WebKit coarse until RULE's sideways cure lands.
- **T9-B14** (f2, chromium · light + dark · 1280×800 fine · 2×, rest and open): (a) verb (default) against (b) ring.
- **T9-B16 / B17 / B18 / B19** (f3, chromium · light · 1280×800 fine).
- **T9-B20** (f4, chromium · light · 1280×800 coarse hasTouch), no default. Neither arm clears the fade on WebKit (a) or anywhere (b).
- Every masthead crop carries the sun's corner. It is parked by `reducedMotion: reduce`, and its phase is declared.

## MOVED rows (PROPOSED unless stated)

- **VR 8b and test 10's control:** re-cut and LANDED from pass 5's PROPOSED diff.
- **face-law's occlusion CEILING table:** struck for the fold law (row 3), with two ablations.
- **The walk's first plant (deeper tapes):** moved to "band struck", because the product now absorbs the old plant.
- **MRK-ABS G-ABS-3:** `.info-btn`'s ring row has no subject under arm (a). Carried.
- **r0 R3's window:** carried from pass 5 (the chair's third re-cut landed).
- **check 8:** the chair's.

## §10 integration brief (for `integrate:s10`, resolve toward FACE)

- **`index.css` [1]–[5]:**
  - Keep FACE's four clauses and out-list.
  - Keep `--card-pad-t`, `--pin-tape-h`, `--zone-step`, `--fold-tools-h`, `--strip-len`, `--head-rule`, `--pin-band`.
  - NO `--motion-*` here (struck this pass; §13's seven stand alone).
  - `check-property-block` must read 0 on the merge.
- **`typography.css`:** FACE's face tokens stand. TAPE's `--type-name` joins as an alias only if a consumer reads it.
- **`GameControlPanel.vue`:**
  - Keep the publisher block whole: parked rung, unchanged-value guard, `--pin-tape-h` published first. This keeps 1 write per open and the walked gate at 0.
  - Keep the fifth verb (B14 a).
  - Keep the line grammar.
  - RULE's tab-state deletion conflicts with FACE's heads: take FACE's and cite RULE's ballot (B13).
  - `--pin-band` (TAPE) and `--card-pad-t` / `--pin-tape-h` (FACE) must be ONE pin line. FACE's band = the pinned tape's painted depth. Re-read the walk at 1440 / 390 / 1280-coarse after the merge.
- **`scene.css`:** arm A's padding rule stands unless B-1 fires B. TAPE's foot moves the bar out of the scrollport. The fold law's `FOLD`/`FADE` surfaces then re-key to `.card-foot`: re-read row 3.
- **`SheetWashiLabel.vue`:** FACE's `font-family` declaration stays. TAPE's leading token is fine if no fallback is added.
- **`check-font-coverage.mjs`:** union both corpora, keep the STRICT sublabel group, and re-cut `fraunces-subset.woff2` ONCE from the union (FACE 14,896 B, RULE 14,912 B, both add `p`).
- **The seal:** FACE's tree ships 992.94 / 992.81. The chair stamps once from the merge (margin = spread + 0.5).

## Pre-return battery (bare; tree | control)

- **All 0 | 0:** lint:copy, lint:lanes, lint:theme-tokens, lint:theme-selectors, lint:sleep, lint:motion, lint:ink, lint:catch, lint:live-regions, test:e2e:retries, test:support-floor, test:font-coverage, lint:boundary, eslint ., vue-tsc e2e.
- **test:e2e:projects:** 1 | 0 (check 8, declared).
- **lint:face-engine:** 0 | 1 (the script is absent on the control).
- **`npm run lint` form (prettier on src/ scripts/ ../../scripts/ ../relay/):** 1 → formatted → 0 | 0.
- **vue-tsc -b:** 0.
- **check-property-block --self-test:** 0.
- **The pass-6 undefined-token census:** 1 (`--motion-whisper` + the declared STALE row, gap 5).

**The e2e estate, whole files, bare** (`readings/e2e-estate.log`), tree dist DuV3ixM3 | control, chromium / webkit:

| spec | tree (cr / wk) | control (cr / wk) | note |
|---|---|---|---|
| face-law | 40/41 · 40/41 | 11/41 · 11/41 | tree's 1 red is the walk's old plant. After the re-cut, the final dist read 41/41 cr and, on WebKit, 36/41 then 41/41 (gap 8) |
| keys-crib | 4/4 · 4/4 | 0/4 · 0/4 | final dist 4/4 · 4/4 |
| viewport-law | **14/14** · **14/14** | 14/14 · 14/14 | |
| visual-regression | **12/12** · **12/12** | 10/12 · 10/12 | |
| zone-grammar | 11/11 · 11/11 | 10/11 · 10/11 | |
| font-census | 2/2 · 2/2 | 0/2 · 0/2 | |
| access | 8/8 · 8/8 | 8/8 · 8/8 | |
| a11y | 15/15 · 15/15 | 15/15 · 15/15 | |
| share-truth | 5/5 · 4/4 + 1 skip | same | |

Vitest, chunked by directory, bare: games 57 files / 742 tests, pencil 8/73, composables 3/16. That is 68/831, all passed (`src/lib` has no test file).

## Replay route

In place. No intake diff was replayed this pass. Pass 5's `PROPOSED-visual-regression.diff` was applied with
`git apply` (237 lines; `--check` clean; the VR file went from +47/−1 to +143/−72 against `74a2b5d9`). The
e2e/face-law.spec.ts `A` index entry predates this pass and was left as found.

## Incidents

- **A foreground AA run went past 120 s** and was moved to the background by the harness (stall-law breach, self-declared).
- **One `( … ) &` inside a background job** returned early. The build and the probe still ran and were polled.
- **Three src edits were made and restored by backup** (`cp`, sha checked): the keys call-site plant, the ring-arm const flip, and the 6ch stale-dist plant (`cp -p`, mtime kept). The dist was rebuilt after the ring flip; the identity was unchanged.
- **The walk's first plant was absorbed by the product** and re-cut the same pass.
- **The load average was 180–300 throughout.**
- **Ports:** dev :4234 (pid 14440), control :4232 (14448), pass-5 dist :4233 (21050), tree dist :4236 (87551). All were killed by PID at return. Scratch `.face6/` and `.vite-cache-face6-dev/` were moved to `<scratchpad>/trash-face6/`.

## Frames (4, 155 KB total)

| frame | engine · theme · viewport · pointer | retires (pass5/SWEEP.md) |
|---|---|---|
| `frames/f1-b1-band-none-vs-armA-…png` (37 KB) | chromium · light · 1440×900 fine + 390×844 coarse | `c2-m17-dock-deal-row-head-proto-webkit-light-390x844-coarse.png` |
| `frames/f2-b14-verb-vs-ring-…png` (58 KB) | chromium · light + dark · 1280×800 fine · 2× | `c3-m16-crib-open-from-top-head-proto-chromium-light-1280x800-fine.png` |
| `frames/f3-b16-b17-b18-b19-…png` (41 KB) | chromium · light · 1280×800 fine | `c1-m17-head-armA-armB-chromium-light-1280x800-fine.png` |
| `frames/f4-b20-coarse-rail-…png` (20 KB) | chromium · light · 1280×800 coarse (+ crib-open 1280 fine) | `c4-caption-column-proto-head-chromium-light-320x568-coarse.png` |
