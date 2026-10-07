# Pass 8 · the chair's instruments lane · THE PRODUCT HOMES

`homes.diff` sha1 **a1d8adeb880c4e95babe8f9664310dce6d992613** · 293,298 B · `7 files changed, 6686 insertions(+), 1 deletion(-)` · tree `bd4377518434eaf907aa6536a47c8d46c6314c73` on `74a2b5d9` · `git apply --check` **0** on a fresh `git archive 74a2b5d9`, and the applied bytes equal the work tree's (7/7 `cmp`).

`homes.on-s13-s7-s3.diff` sha1 **6a8b26298abd92f626bcd92ba0cf9f0fc222ffdd** · 298,526 B · `7 files changed, 6020 insertions(+), 280 deletions(-)` · tree `1f8a729aaae04f6c25b9e12af30f1cebfafc29a9` on the union tree `984549641775952d3e341d3de2ad06950bef34d0` (`74a2b5d9` + `pass7/integrate/s13-s7-s3.diff`, applied through a temporary index) · `git apply --check` **0** on a fresh extraction of that tree. It exists because `homes.diff` refuses on the union by construction: both ADD `web/frontend/scripts/shape-census.mjs` and both edit `knip.json`'s `entry` (`apply --check` exit 1: `already exists in working directory`, `patch failed: web/frontend/knip.json:84`). On the union the library lands as a MODIFY of LADDER's copy and `knip.json` keeps the union's entry and comment and adds the four `e2e/lib` entries.

Registry-v7 §2.4, §8.0 act 5; pass8/CHAIR-RULINGS §2.7. Work tree `.claude/worktrees/w7-p8-homes`, detached at `74a2b5d9`, uncommitted. Both diffs were cut `--binary` through temporary indexes (`GIT_INDEX_FILE`), product paths only.

## What landed

| Path | Role | Imported as |
|---|---|---|
| `web/frontend/scripts/shape-census.mjs` | the ONE browserless shape-census library + `--self-test`, `--sabotage-battery`, `--self-test --lib <seed>`, `--tree <web/frontend>` | `./shape-census.mjs` from `scripts/`; `../scripts/shape-census.mjs` from `e2e/` |
| `web/frontend/e2e/lib/paint-lib.mjs` | the painted-byte reads (PNG decode, WCAG luminance, on/off photographs, text-run rects, regime cells) | `./lib/paint-lib.mjs` from a spec |
| `web/frontend/e2e/lib/glyph-pop.mjs` | the glyph-population probe + gate | `./lib/glyph-pop.mjs` |
| `web/frontend/e2e/lib/edge-bands.mjs` | the four-band edge probe + gate | `./lib/edge-bands.mjs` |
| `web/frontend/e2e/lib/postpaint.mjs` | the post-paint sampler AND the painted-frame recorder (pass-7 `painted-frames.mjs` folded in) | `./lib/postpaint.mjs` |
| `web/frontend/e2e/lib/rest-probes.mjs` | resize-at-rest, un-park, sequence guard, row focus; generic presets | `./lib/rest-probes.mjs` |
| `web/frontend/knip.json` | `entry` += the five homes (their exports stay whole; each CLI's `--self-test` is its caller) | — |

Every home imports only by relative path, `node:` builtins, or `@playwright/test`, which is this package's declared devDependency. An import probe from `web/frontend` loads all six by relative path: 67, 14, 10, 8, 19 and 8 exports, exit 0. No file under `docs/` is imported. The pass-7 copies needed `sharp` and `playwright` through `createRequire` on an absolute `package.json` path. Here `sharp` is gone: it reaches `node_modules` only through wrangler's miniflare, and knip reds an unlisted dependency. It is replaced by a PNG reader over `node:zlib`, byte-identical to `sharp(png).removeAlpha().raw()` on four Playwright screenshots (chromium and webkit, DPR 2, full frame and clip; 0 differing bytes of 11,059,200 and 193,284). The recorder decodes its photographs in a page of its own browser (`createImageBitmap` → `OffscreenCanvas`).

API changes against the pass-7 copies, for a lane re-pointing its import: paint-lib no longer exports `rgb`, `sharp` or `PAINT_REGIMES` (use `onOff` or `cellsOf`); glyph-pop keeps `applyTail`/`undoTail` as aliases of `applyMask([1 − tail, 1])`/`undoMask`; `rowTapFocus` returns `{focus, kept}` in place of a string; `analysePhotos` takes the browser first.

## Per instrument: source families, plants, exits

### 1 · `scripts/shape-census.mjs`

- **Seed.** LADDER's union copy (`pass7/integrate/s13-s7-s3.diff`), with the chair's pass-7 copy folded in. The export surface is a superset of the union's.
- **Folded PROPOSED extensions.** Each has its plant in the ONE self-test and a clause id in `CLAUSES`:
  - **FACE:** the wildcard subject `*`; `@utility`/`@theme`/`@font-face` own-declarations read as `.x`/`:root`; Tailwind arbitrary values kept whole; template-file attribution; the top-level `sfc()` scanner. The last one kills the HandwrittenLogo phantom `<style>` inside `<script>`.
  - **GRAPHITE:** `tokenSites`; Tailwind arbitrary properties and `@property` preludes as declaration sites; R1's second path, `darkArmCensus`.
  - **TIN:** regex-literal-aware `stripJs`; relative-colour syntax in `parseColor`.
  - **LIVE:** `maskedDefaults`, with case-insensitive `var(`, `${}` stems and folded concatenation.
  - **VERB:** `:is()`/`:where()` arms as alternatives; non-literal stems; computed `setProperty` names; const-carried values.
  - **SIX:** `url(${base}#${id})`; entity and CSS-escape decoding; an unresolvable tag reads UNRESOLVED; spread and computed keys in `h()`/`createVNode`; barrel aliases.
  - **WALK:** concatenated `cssText`/`setAttribute`; computed `:style` keys; `@import` chains.
  - **LADDER:** `index.html` and `public/**` in the walk; longhands; semicolon-less declarations; `Math.min`/bracket/bitwise clock reads.
  - **ERASE:** `.pcss`/`.postcss` in the walk; split-name `registerProperty`.
  - **TAPE:** ELEMENT keying (the subject compound resolved to template elements).
  - **LEDGER:** media queries EVALUATED over the regime set; `em`/`lh` resolved at the consumer; the R4 lower bound.
  - **TAB-PEN:** the HTML-comment decoy; the one-uncommented-link parse.
- **Reserve law.** The chair's `shape-plants.mjs` battery (28 rows) is re-cut to the union's `1lh` anchor and runs under `--tree`.
- **Self-test on the homes copy.** 92/92 read as the law; 40/40 clauses planted.
- **Clause-sabotage battery.** 40/40 clauses red the self-test when deleted (exit 0).
- **Born-RED on the seeds.** The union seed reads 22/92 (70 fail, exit 1). The pass-7 chair copy reads 21/92 (71 fail, exit 1).
- **`--tree`.**
  - Union: anchor PRESENT, 28/28 ok, exit 0.
  - Control (`w7-control`) and this tree (`74a2b5d9`): anchor ABSENT, 14 ok / 14 FAIL, exit 2. This is born-RED: the `1lh` seat lives on the union only.
- **Union consumers.** On the union with this copy overlaid, `lint:ink`, `lint:theme-tokens`, `lint:bands`, `test:font-coverage` and `shape/reserve-law.mjs` each exit 0, and their output is byte-identical to the seed union's. `lint:bands` needs `74a2b5d9` fetched into the scratch clone, as before.

### 2 · `e2e/lib/glyph-pop.mjs`

- **Folded.** TIN/FIVE's text-node Range (svg and hidden descendants skipped); TIN's OFF-pair compare (two ON and two OFF photographs, stable pixels only); TAB-PEN's `off` sheet and `IMG_PLANTS`; COUNT's HEAD12 plant; the column count scaled to ink span (TAB-PEN, COUNT) with half-shifted columns and G5 per-glyph windows; WALK's per-payload G3 bound (`glyphGate` refuses without `payload`).
- **New in this lane.** The column floor is 13, not 8. The aligned and half-shifted grids hold a whole column inside a 12 % end run only when 1.5/n ≤ 0.12, and at 8 a 17 px icon's TAIL12 read GREEN in WebKit at DPR 1. `--regimes all` reads every `PAINT_REGIMES` stop (LAWS P7 §E).
- **Plants.** Text: FAINT30, FADE65 and FADE80 (fill); TAIL12, TAIL35, HEAD12 and MID20 (run masks at 25 %); EMPTY. Image: FAINT30, FADE65 and FADE80 (opacity); TAIL12, TAIL35 and HEAD12; EMPTY (paper twin).
- **Self-test.** Both engines, DPR 1 and 2, light and dark:
  - chromium: clean GREEN 12/12, plants RED 92/92, exit 0.
  - webkit: clean GREEN 12/12, plants RED 92/92, exit 0.
  - The pass-7 element-Range TAIL12 reads GREEN 4/4 per engine. That is the hole the text-node run closes.
- **Control and tree.** `.section-heading`, payload `default-deal-desk`, 1280×800 DPR 1 PRM fine:
  - chromium light: median 4.659, RED G4 (column 4 at 2.63; 17 columns).
  - chromium dark: 7.681, GREEN.
  - webkit light: 4.659, GREEN.
  - webkit dark: 7.681, GREEN.
  - Plants RED 8/8 in every cell. Exits are identical on control and tree (1/0/0/0).
  - `--regimes all` on control: the three light regimes and coarse red the same G4 column; dark GREEN; plants 56/56 RED.

### 3 · `e2e/lib/edge-bands.mjs`

- **Folded.**
  - RULE: the descendant FADE15 (`{fade: 0.15}`, every painted colour of the edge and its descendants at 15 % of its own alpha, written as a stylesheet so the OFF sheet still wins), STROKE_OPACITY015, PATH_OPACITY015 and FILTER_OPACITY015, plus `INK_PLANTS(edge, 0.81)` for a relative clause.
  - FACE: the THICKNESS clause B3 (median painted depth ≥ 2 css px × 0.9, coverage-summed against the computed ink) with THIN_1PX.
  - CHAIR-RULINGS §2.7: STATION 1 estate-wide (B4: dropped-station fraction ≤ 0.02, runs and longest run printed) with DASH_1IN8. The STATION-8 pooled reading prints beside.
  - B1 is scaled to 8 css px of stations. At DPR 2 a 6 px side held 10 device stations and passed.
- **Clause-sabotage battery.** Chromium, B0–B5 off in turn: 6/6 BITE. The hidden subject, 6 px frame, fades, 1 px ring, dash and 0.81 replays turn GREEN.
- **Self-test.** Both engines, DPR 1 and 2, light and dark:
  - chromium: clean GREEN 12/12; plants 76 RED + 8 NO-OP of 84; born-RED fixtures 20/20 RED; exit 0.
  - webkit: the same counts; exit 0.
  - The NO-OPs are the stroke and path plants on the CSS outline ring. They change no paint and print as NO-OP, never as a hole.
  - The legacy root-only FADE15 reads GREEN 4/4 per engine: the hole the descendant form closes.
  - The 1-in-8 dashed frame reads RED at station 1 and GREEN under STATION-8 (4/4 per engine).
- **Control and tree.** 1280×800 DPR 1 PRM.
  - `.drawer-case`, top band, light and dark: chromium 17.359/14.619, webkit 17.197/14.619. This is pass-7's reading to the thousandth.
  - Its thickness is 3.07–4.99 px, and every band is GREEN on B2 and B3.
  - The clean read is RED on B4 in all four cells. There is one run of 16–19 stations on the top band (6.1–7.3 %), a notch; STATION-8 reads RED too.
  - All 9 plants RED in each cell.
  - `.new-game-zone` is born-RED in both engines. The bottom band is occluded by `div.action-bar` at all three poses, and top, right and left read 1.54–1.55 px painted depth: B3, the new clause, on the control.
  - Exits are identical on control and tree.

### 4 · `e2e/lib/postpaint.mjs`

- **Folded.** VERB's frame-1 keyed on the mover's first IntersectionObserver entry (reads before it DROPPED and counted); the critic's F2 plant (`F2_PLANT(sel)`); the clock identity CI gated in BOTH engines; the recorder with VERB's `--eps` and `ruled:` subject (pass-7 `painted-frames.mjs`, folded here because it has no home of its own in §2.4's list).
- **New in this lane.** Frames are stamped with the rAF time, not `performance.now()` inside the callback. WebKit stamps the IO entry with the rendering update's own time, and a mover started in the sampler's first frame keyed to frame −1 (webkit r1: `io 456, kPaint -1`).
- **Self-test.** Both engines, exit 0:
  - The RAF-mover is clean GREEN 2/2.
  - SKIP reds F1 2/2 (ct 150, centre 900 px).
  - F2 reds CI 2/2 at frame 3, because `animate()` runs inside frame 1's rAF.
  - The TASK-mover is born-RED under the keyed reader 2/2 (chromium ct 5.9–8.6, centre 35–52 px; webkit ct 6–9, centre 36–60 px). The un-keyed legacy reads GREEN 2/2: the pass-7 hole.
  - Recorder, chromium: clock 94/s. `ruled:.rl` moved 83 frames and the legacy `.rl` 0 (EMPTY). At eps 0.35 the change count was 0/96 (EMPTY); at eps 0.001 it was 93/94, GREEN; the busy 150@300 plant reads held 150.4 ms, RED, plant seen.
  - Recorder, webkit: clock 98 rAF/s; `ruled:` 61 frames vs legacy 0.
- **Control and tree.** GA1: the fold on `g` at `/?game=sudoku`, desk and phone, 2 reps. It is RED in every cell on both sides and both engines (the known control defect).
  - Keyed F1, chromium: ct 17–45 ms, centre 23–109 px.
  - Keyed F1, webkit: ct 52–93 ms, centre 30–141 px.
  - 0–2 pre-paint reads dropped.
  - The spread between control and tree on byte-identical dists is load (box 12–39).
  - `--plant skip|f2` "bite" on both sides only because the clean read is already RED. The verdict is uninformative there.

### 5 · `e2e/lib/rest-probes.mjs`

- **Folded.** The chair's pass-7 gap 6: generic presets `resize | unpark | touch | rowfocus`, every subject, state and read given on the command line. Pass-7 presets named SELF's and FACE's trees.
- **Self-test.** A LIVE and a STALE twin per mechanism. Both engines, exit 0: LIVE 5/5 GREEN; STALE 4/4 RED (UNPARK 38.39 vs 41.19 px, RESIZE rows 18 vs 17, TOUCH under RELABEL 2 toggles, ROW TAP focus BODY). WebKit's own mouse-labelled click also double-toggles the STALE guard with no plant.
- **Control and tree.** Both engines, exit 0 each:
  - Drawer resize 390×844 → 390×800 agrees with the reopen (caseH 584, board top 199/200).
  - The `.drawer-tab` tap toggles once, with and without RELABEL.

## Born-RED transcript (condensed)

| Row | Reading | Exit |
|---|---|---|
| seed union shape-census on the 92-row self-test | 22/92 | 1 |
| pass-7 chair shape-census on the same | 21/92 | 1 |
| `--tree` control / this tree (anchor absent) | 14 FAIL | 2 / 2 |
| glyph legacy element-Range TAIL12 | GREEN 8/8 (both engines) | printed |
| edge legacy root-only FADE15 · STATION-8 on a 1-in-8 dash | GREEN 8/8 · GREEN 8/8 | printed |
| postpaint un-keyed TASK-mover | GREEN 4/4 | printed |
| recorder eps 0.35 · legacy `.rl` subject | EMPTY · EMPTY | printed |
| control `.new-game-zone` edge | B2 bottom 1.00 occ `div.action-bar`, B3 1.54 px | 1 |
| control `.drawer-case` edge | B4 top notch 16–19 stations | 1 |
| control GA1 | F1 RED 8/8 per engine | 1 |

## π and AA

- **π (rect reads).** GA1 keyed F1 centre/Δw above. The rest-probe rects agree to the pixel between resize-at-rest and reopen. There were no π rows beyond these; this lane carries no product change.
- **AA (paint reads).** Glyph medians 4.659 light and 7.681 dark (`.section-heading`, both engines). Edge medians 17.359/14.619 chromium and 17.197/14.619 webkit (`.drawer-case`); `.new-game-zone` 17.779/17.614 on three bands.

## Constraints

- **Dist identity.** The tree's dist is byte-identical to the control's whole dist: 43 files, `index-CubiZsMVSwTc.js` and `index-CMaYSiPKVidg.css`, rebuilt after the last edit with a private cacheDir outside the tree.
- **Filters and frames.** `filterBudget` is untouched (no `src/` byte moved). No frames were made, and there are no lawful pairs or headroom rows.
- **Pre-return battery, bare, tree | control:**

  | Gate | Tree | Control |
  |---|---|---|
  | `eslint .` (0 warnings) | 0 | 0 |
  | `test:e2e:projects` (34 specs, 547 tests) | 0 | 0 |
  | knip | 0 | 0 |
  | prettier (`npm run lint` scope) | 0 | 0 |
  | lint:lanes | 0 | 0 |
  | lint:theme-tokens | 0 | 0 |
  | lint:ink | 0 | 0 |
  | lint:sleep | 0 | 0 |
  | lint:motion | 0 | 0 |

- **On the union with the homes overlaid.** knip, prettier, eslint (new files), lint:lanes and the five shape-census consumers each exit 0.
- **Box load.** 12.1–38.9 (1-min) across the browser battery. Other workflows were live, and every timing row above is load-bound.

## Incidents (declared)

1. **Tailwind contamination.** The first build of this tree minted 5 rules from `shape-census.mjs` comment and test-name strings (`[--tok:v]`, `[prop:v]`, `font-[Comic_Sans_MS]`, `font-[…]`, `@container`). They were re-spelled with spaces inside the brackets, and the served CSS and the whole dist then matched the control byte for byte. This is T9-R6's trap, caught before any dist was cited.
2. **Glyph fixture.** The fixture's icon ink was 12.36:1, where an 80 % or 65 % fade stays legal (6.72, and 8.55 dark), so those plants read GREEN by physics. It was recalibrated to 5.10:1. The column floor moved 8 → 13 (§2).
3. **Setup errors caught by a failing self-test before any reading was cited.**
   - The edge FADE15 first applied `!important` inline, outranking the OFF sheet, so OFF = ON; it red for the wrong reason until it moved to a keyed stylesheet.
   - The self-tests' `addInitScript` plants never ran under `setContent` (no navigation commit); they are evaluated in the page now.
   - The rest fixture's sheet covered its own toggle.
   - The root font did not reach a `16px` body.
4. **An unexplained reading.** Chromium's F2-plant run r2 reads F1 at ct 8.6 (centre 51.6 px) in 2 of 2 batteries: frame 1's post read sees frame 2's time. The plant's clause (CI at frame 3) reds as required.
5. **Process.** One self-test batch (glyph, after the column-floor change) was launched with a shell `&` rather than `run_in_background`; it completed and its exits were read. Batch A edited `edge-bands.mjs` while a run was in flight. The final battery and every figure above ran on the final bytes. The only later edit, glyph-pop's two aliases, was re-run: 0/0.
6. **Servers.** Tree 4250 (PID 24512) and control 4251 (PID 68910) were killed by PID after a cwd check. No git ran in the control tree.

## Gaps

- **B3's ink normalisation.**
  - Opacity and `filter: opacity()` above the edge root are outside the alpha chain, so a faded ancestor reads thinner.
  - A 1 px SVG stroke antialiased across two device pixels reads about 1 px only when a computed ink resolves. On the p99 fallback it can read 2.
- **Recorder eps calibration.** The in-page decode and luma replace libvips `b-w`. The eps defaults were not re-derived against sharp's greyscale (Δ median 0.0035 at eps 0.35 still reads EMPTY on the thin stroke).
- **`--tree` needs the union.** The anchor is the union's `1lh` seat. On `74a2b5d9` it exits 2 by design, until the fold lands the seat.
- **No new-rule proof on the product.** The product readings show the new clauses born-RED on the control (B3 new-game 1.54 px, B4 drawer notch, G4 heading column 2.63). Whether each is a product defect or a design cost is the owning lanes' call; this lane moved no product byte.
