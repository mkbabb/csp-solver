# TAB-PEN · pass 8 prototype (§12, the tab's pen)

The section's number stands at **74** (pass 7's critic). Pass 8's number is the critic's, not this lane's.

**Bank** (`pass8.diff`, BANKED.txt): tree `41f2351a` on base `1d0dc4fd` (the §2.16b waiver). 362,228 B, sha1 `30c53f52`, `17 files changed, 8210 insertions(+), 20 deletions(-)`, **0 `src/` paths**.
- `git apply --check`: **0** on a fresh `1d0dc4fd` and **0** on a fresh `74a2b5d9`.
- Applied on `1d0dc4fd`, all 16 surviving paths are `cmp`-equal to the tree, and `favicon.svg` is absent.
- The bank carries `homes.diff` `a1d8adeb` (7 paths, byte-equal) plus this family's delta.
- The delta alone is `pass8.delta.minus-homes.diff`: 68,930 B, sha1 `45a19644`, `10 files changed, 1524 insertions(+), 19 deletions(-)`.
  - It applies **0** on `74a2b5d9` + `pass7/integrate/s13-s7-s3.diff` + `pass8/instruments/homes.on-s13-s7-s3.diff`.
  - On that tree, `lint:favicon` reads a–e GREEN (exit 0) and its self-test is 69/69 as required (exit 0).
  - The whole bank refuses there by construction (`e2e/lib/*: already exists`). That is the fold collision, resolved by the home.

## Gaps first

1. **Row 8's premise is refuted on the number.** The home's glyph-pop does not red FADE80: it is **GREEN in 16/24 tree cells**, and FADE65 is GREEN in 5/24.
   - Column scaling cannot red a uniform fade, because G4's limit is 0.4 × the faded read's own p95.
   - At the home's per-payload slack of 0.05, G3 does not reach it either. Pass 7's 4/24 was read at a slack of 0.02 with the lane's own reader, now deleted.
   - The faded medians read 6.37–10.92, above the absolute 4.5 floor. By the probe's own rule (G2 ABSOLUTE, never relative to an in-run photo), that is legal paint, not a blind reader.
   - The instruments lane recalibrated its fixture to 5.10:1 for the same reason. No PROPOSED clause is offered, since a relative floor would break the law G2 is written under.
   - The CI gate holds the fade class at the source (opacity attributes off the allowlist `a.attr`, alpha inks `c.opaque`, a later faint rule `c.delta`, an unresolvable `var()`).
2. **Row 29's second non-author reading is OPEN.** This lane is the author and cannot give it. It is the pass-8 critic's, on the kept frames `pass7/prototype/TAB-PEN/p7-f1-…` (48 DPR 2) and `p7-f3-…` (180 photographed).
3. **Arm B carries a new painted cost through the home.** B's clean read reds **G4 in WebKit at 16 DPR 1**: the round cap's right-edge column reads p95 **1.67** light and **1.85** dark, against a limit of 7.60/6.47. W and H read clean GREEN in all 16 of their cells. Main reds the same class in 6 of its 8 cells (its born-RED). This goes into T9-B28's caption.
4. **Whole-DOM π was not re-run this pass.** It is carried on byte identity:
   - the dist's JS/CSS are the clean main build's (`index-ChSrVSqM0j8q.js` / `index-DSV8hl9eUGyP.css`);
   - `icon.svg` and the PNG keep their pass-7 sha256s (`856c8ad5…`/`b07f52f9…`);
   - pass 7 read 0 deltas fine/coarse/dark-boot in both engines on these bytes.

   The filter census (9 · 14 · 11 = main = `74a2b5d9`) is carried the same way. Row 28 is therefore HELD at pass 7's reading, not re-claimed.
5. **The gate grew to 1,405 lines after prettier** (748 at pass 7), because the plant table expands one block per plant (69 plants). The self-test takes 3.3 s at box load ~20. The sabotage battery takes about 3 min by hand and does not run in CI.
6. **The library reads 22 UNRESOLVED sites per token.** They are computed object keys (`[sizeField]`, TS index signatures) and the probe's unfoldable `cssText`, with none a `setProperty`.
   - The gate reds an unresolved `setProperty` (plant C12) and PRINTS the rest as a count: 44 on the tree, 30 on the union.
   - That is a choice of scope stated here. A strict reading (red every `?` site) reds the real tree 44 times.
7. **M19 is whole.** Every painted number is headless Playwright `<img>` emulation. Unwitnessed: Chrome's favicon service and its real strips, Safari's tab (does it take `icon.svg`, does it honour the in-SVG dark query, its overview), iOS's web-clip mask on the 180 PNG, Android without a manifest, and Firefox tabs.
8. **Row 30 (the ladder) collides with row 1's cure.** A ladder `<link rel="icon" sizes="32x32" href="/icon-32.png">` reds `e.link-icon` (exactly one `rel~=icon`) by construction. The ladder, when it lands, must re-cut clause e to one link per (type, sizes), with the SVG the only `image/svg+xml`.

## The C-table (the pass-7 critic's plants on disk; `logs/born-red-critic-plants-old-vs-new.txt`)

The born-RED ran on THIS tree's bytes. The old gate is the pass-7 bank applied on a fresh `1d0dc4fd` (sha1 `6f899ba6`); the new gate is sha1 `fd3ef080`. Its negative control, the new gate on the same clean base, read a–e GREEN with exit 0 in the same run.

| plant | pass-7 gate | pass-8 gate | the reading |
|---|---|---|---|
| C1 five pen lines (near-solid) | GREEN 0 | **RED de** | `d.mass` 0.420 ∉ [0.18, 0.32]; `d.arm`; tie mean \|Δ\| 0.2317, IoU 0.4706 |
| C2 four-bar PNG, cov ~0.23 | GREEN 0 | **RED e** | tie 0.3250 / 0.2414 |
| C3 the letter Z | GREEN 0 | **RED de** | `d.arm`; tie 0.1819 / 0.4117 (the critic's "a source gate can't judge it": the arm table now can) |
| C4 stroke-width 5 without its const | RED d | **RED de** | `d.arm`, `d.window` 0.200 ∉ [0.15, 0.17], tie 0.0617 / 0.7858. **With `WIDTH = 5` it is GREEN** (flip below) |
| C5 H's path, W's PNG | GREEN 0 | **RED de** | `d.arm`; tie 0.0376 / 0.8512 (in memory with `ARM = "H"`: `e.png-tie` alone) |
| C6 both links commented | GREEN 0 | **RED e** | 0 uncommented `rel~=icon`, 0 `apple-touch-icon` |
| C7 a second `rel=icon` | GREEN 0 | **RED e** | 2 uncommented `rel~=icon` (`/icon.svg`, `/thick.svg`) |
| C8 a second `@theme` paper, after | RED ce | **RED ce** | `c.conflict` + `c.tokens` + `e.png-paper` |
| C9 the same, sorting BEFORE | GREEN 0 | **RED ce** | the same three, whatever the walk order (a conflicting token resolves to nothing) |
| C10 a `.dark` SFC ink | RED c | **RED c** | `c.conflict` + `c.tokens` |

Main's archive under the new gate: **35 failures**, a–e RED, exit 1 (`logs/gate-on-main-1d0dc4fd.txt`).

## The gate, re-cut (`scripts/check-favicon.mjs`, sha1 `fd3ef080`)

- **One library, no second reader.**
  - Links go through `exactlyOneLink`/`htmlLinks` (comments stripped, entities decoded, `rel` a token list).
  - Tokens go through `tokenSites` + `tokens` + `tokenConflicts`. `@theme` reads as `:root`, which is what Tailwind v4 emits. A placed site outside `:root`/`.dark` is RED, and two placed sites that disagree are RED.
  - The pass-7 private `tokenSites` is deleted, and so is the pass-7 vendored census (`scripts/shape-census.mjs` sha1 `8203e7ed` moved to `trash-tabpen8-1`).
  - Imports are `./shape-census.mjs` and `./icons.mjs`, relative, at product paths.
- **The analytic raster.** The path is flattened (curves at 24 steps), stroked as a union of capsules (round caps and joins), 180 px at 4 × 4 samples a pixel, and memoised.
  - `d.mass` holds the path's own ink mass in [0.18, 0.32].
  - `e.png-tie` holds the PNG to it by per-pixel coverage in the encoded channels: mean |Δ| ≤ 0.02 and IoU@0.5 ≥ 0.97.
  - The shipped pair reads **mass 0.2295, mean |Δ| 0.0010, IoU 0.9942**. The header's "a PNG that isn't the s reds on content" is now true (C1, C2, C3, C5, E5).
- **The arm table** (`scripts/icons.mjs`) holds `ARM` (T9-B27: `W` | `H`) and `WIDTH` (T9-B28: `4` | `5`), `WINDOWS = {4: [0.15, 0.17], 5: [0.19, 0.21]}`, and `PEN`.
  - `sharp` loads only when the file runs as a script, so the gate imports the table browserlessly.
  - `d.arm` holds the shipped path and stroke-width to `PEN[ARM]`/`WIDTH`, and `d.window` is keyed to `WIDTH`.
  - Arm P (a Fraunces outline) is not a pen line: **choosing P re-cuts clause b**, and the caption says so.
- **Self-test: 69 plants (61 RED + 8 NN), exit 0, 3.3 s** (`logs/lint-favicon-selftest-final.txt`). Each plant names the check ids it must fire. The new plants are:
  - C1, C1m (the block entered in the table: `d.mass` alone bites), C2, C3, C5, C6, C7, C7b (a second touch icon), C7c (`shortcut icon`), C7d (`rel="&#105;con"`), C8–C15;
  - S1–S17, one per check the first sabotage run found un-bitten;
  - NN3 (a decoy link inside an HTML comment), NN4 (an agreeing second `@theme`), NN5 (arm B by its const), NN6 (arm H by its const), NN7 (a PNG rastered from the path), NN8 (an entity-spelled href).
- **Clause-sabotage battery (`--sabotage-battery`, LAWS P7 §F (ii)): 54/54 BITE, exit 0**, on gate sha1 `fd3ef080` (`logs/sabotage-battery.txt`). That is 47 gate checks, each switched off alone, plus 7 library clauses via `sabotage()`: `html-comment`, `one-link`, `token-conflict`, `tok-sites`, `at-own`, `collect-walk`, `decode`.
  - Its first run read **37/54** (`logs/sabotage-battery-run1-17-holes.txt`). Seventeen checks inherited from pass 6/7 had no plant biting them alone (`a.dupe`, `a.root`, `a.ns`, `a.paper-xy`, `b.fill`, `b.cap`, `b.join`, `b.context`, `b.bytes`, `d.unreadable`, `d.extent`, `d.centre`, `e.icon-file`, `e.png-file`, `e.prov-png`, `e.png-size`, `e.png-opaque`).
  - S1–S17 close them.

## The arm table (charter row 4; each flip rastered by the real `sharp` on a scratch copy, then gated)

| arm | the edit | svg sha256 | PNG | mass | tie mean \|Δ\| / IoU | `icons --check` | gate |
|---|---|---|---|---|---|---|---|
| **W, 4 (default, shipped)** | — | `856c8ad5` 496 B | 2,473 B `b07f52f9` | 0.2295 | 0.0010 / 0.9942 | 0 | 0 |
| H, 4 | `ARM = "H"` | `e0edd782` | 2,470 B | 0.2388 | 0.0011 / 0.9936 | 0 | 0 |
| W, 5 (T9-B28 arm B) | `WIDTH = 5` | `b41ada6a` | 2,515 B | 0.2908 | 0.0010 / 0.9972 | 0 | 0 |
| P | not a const | — | — | — | — | — | re-cuts clause b |
| P′ | — | — | — | — | — | — | **DEAD** (below) |

`npm run icons` on the tree rewrote `icon.svg` and the PNG byte-identically (`856c8ad5…`/`b07f52f9…`) and the sidecar with `"width": 4` added. `icons --check` read 0.

**P′, declared dead on the number (row 29).** The wordmark's hand is `wobble-logo` (`pencilConfig.ts`): baseFrequency 0.02 (λ = 50 u), displacement scale 3 (peak ≤ ±1.5 u), on Fraunces 900 at 52 px.
- The s's x-height is 511/1000 em on the opsz-9 outline (main's favicon path) = 26.6 u, so λ/H = 1.9: less than one period crosses the glyph, which makes it a bend, not a grain.
- The peak is ≤ 5.6 % of the glyph. On the tab's ~12 device px s at 16 DPR 1 that is ≤ 0.68 px, under the pixel quantum. For any x-height from 20 to 30 u, the peak is 0.6–0.9 px and λ/H is 1.7–2.5.
- The wordmark's other half is its boil (4 poses at 550 ms), which a static icon cannot carry.
- So P′ at the tab is P, whose fringe (0.379 / 0.341, pass 7) already loses to main, W and H.

## T9-B28's losses, named (row 5; LAWS §G)

At 16 DPR 1 chromium light, on the pass-7 statistic (critic-reproduced), the fraction under 4.5 against main's 0.289 (50) is:
- **W (A = 4, the default) 0.375 (33), a loss of 0.086**;
- **H 0.302 (26), a loss of 0.013**;
- B 0.352 (37).

The same fraction through the **home's glyph-pop**, which reads stable pixels only:

| 16 DPR 1 | chromium light | chromium dark | WebKit light | WebKit dark |
|---|---|---|---|---|
| main | 0.293 (174) | 0.293 | 0.411 (209) | 0.411 |
| **W** | **0.375** (88) | 0.341 | 0.389 | 0.352 |
| H | 0.326 (89) | 0.273 | 0.300 | 0.292 |
| B | 0.358 (106) | 0.305 | 0.360 (clean **RED G4**) | 0.351 (clean **RED G4**) |

G1 vs clause c is ruled (pass8 CHAIR-RULINGS §2.8): **G1 stands**. The cost stays in T9-B28's caption: the tile on Chrome's dark-active strip `#35363a` reads **1.58:1**, against main's 11.38. This diff does not argue it.

## The painted witness through the home (row 8; `logs/glyph-pop-home-favicon-32cells.txt`)

The driver imported `../e2e/lib/glyph-pop.mjs` and `../e2e/lib/paint-lib.mjs` from the tree's own lane dir `.tabpen8/`, which has since moved out. It read `glyphGate` with `img: {ng}`, the arm's paper twin as the OFF sheet, `textRun: false`, and a per-payload bound. The cells were 16 DPR 1 and 32 DPR 2, light (`#ffffff`) and dark (`#202124`) strips, both engines, arms W, H, B and main.
- **Clean:** W and H GREEN 16/16. B GREEN 6/8 (WebKit 16 DPR 1 reds G4 at 1.67/1.85; gap 3). Main RED 6/8, G4 at its terminals (the control's born-RED).
- **Columns scale to the ink span:** 10 (W/H), 12 (B) and 13 (main) at 16 DPR 1; 13, 14 and 18–19 at 32 DPR 2.
- **Plants on the 24 tree cells:** FAINT30, TAIL12, TAIL35, HEAD12 and EMPTY are RED **24/24**; FADE65 is RED 19/24; **FADE80 is RED 8/24** (gap 1).
- The medians (AA, painted) read 9.34–14.16 at 16 DPR 1 and 16.18–18.99 at 32 DPR 2. Every G2 is GREEN.
- Box load: 13.96 → 23.56.

## The estate, the dist, π (the two dists named)

- **Tree dist against main's clean build (`1d0dc4fd`):** 48 files against 47. **45 are byte-identical**, including `index-ChSrVSqM0j8q.js` and `index-DSV8hl9eUGyP.css`. `index.html` differs by 2 link lines; the tree adds `icon.svg` and `apple-touch-icon.png` and drops `favicon.svg`.
- **Tree dist against the control's (`74a2b5d9`, `index-CubiZsMVSwTc.js`, 43 files):** it differs by the W8 fold's chunk hashes. That is the waiver's base, not this family's.
- **Served CSS (LAWS P7 §B):** the CSS served on :4240 equals the clean main build byte for byte. `e2e/lib/*` and the gate's strings mint no utility, so there is no contamination.
- **G-TAB-4** (vite preview, tree :4240 and control :4252, identity by hash):

  | path | tree | control |
  |---|---|---|
  | `/icon.svg` | 200 `image/svg+xml` 496 B `856c8ad5` | `text/html` |
  | `/apple-touch-icon.png` | 200 `image/png` 2,473 B `b07f52f9` | `text/html` |
  | `/favicon.svg` | 200 `text/html` (the SPA fallback) | 200 `image/svg+xml` 1,961 B |

- **Tile, painted** (row 24; `logs/tile-painted.txt`): `<img>` at 16 DPR 1 reads (251,250,249) light and (17,15,14) dark, in chromium and WebKit.
- **π and the filter census:** HELD at pass 7 on byte identity (gap 4). `src/` is empty, so `pencilConfig.ts` and `filterBudget` are untouched.

## The pre-return battery (bare; tree = fresh `1d0dc4fd` + the bank, control = fresh `1d0dc4fd`)

| gate | tree | control |
|---|---|---|
| `lint:favicon` | 0 | 1 (absent) |
| `lint:lanes` · `lint:theme-tokens` · `lint:sleep` · `lint:motion` | 0 · 0 · 0 · 0 | 0 · 0 · 0 · 0 |
| `lint:theme-selectors` · `lint:catch` · `lint:ink` · `lint:copy` | 0 · 0 · 0 · 0 | 0 · 0 · 0 · 0 |
| `check-copy-register` bare (M16; no UI string added) | 0 | 0 |
| `test:e2e:projects` (= `check-pw-projects --self-test`) | 0 | 0 |
| `eslint . --max-warnings 0` | 0 | 0 |
| `npm run lint` (prettier) | 0 | 0 |
| `lint:knip` (the homes' entry list, one copy) | 0 | 0 |
| `typecheck:node` · `typecheck:e2e` · `vue-tsc -b` (archive) | 0 · 0 · 0 | 0 · 0 · 0 |
| `shape-census.mjs --self-test` (the home: 92/92, clauses planted 40/40) | 0 | 1 (absent) |
| vitest, chunked by dir | pencil 8/73 · composables 3/16 · probe 1/17 · games 57/741 = **69 files / 847 tests**, 0 each | — (`src/` identical) |
| `check-property-block` · `lint:bands` · `lint:verbs` | not on this base (they are the union's) | — |
| `check-evidence-policy` (main) | PASS, exit 0 (no frame added) | — |

Box load across the battery: 15.61–30.55 (1-min). No timing row is claimed.

## INTAKE-23 §4, by number

- **22 CLOSED.** The gate reads a–e GREEN on the tree and 35 failures on main's archive (exit 1).
- **23 CLOSED.**
  - The 7 old plants and the intake's 8 escapes (P1–P6, E1–E8) are RED in the self-test, and C6/C7 are RED.
  - The sabotage battery reads 54/54.
  - The sidecar is written by `icons.mjs`, not by rewriting its own source.
- **24 CLOSED.**
  - Every arm was run: source (placement, conflict, fallback) and painted tile, both engines.
  - C9's walk-order hole is closed.
  - A palette move at any placed site reds c, whether it is a conflict (E19, C8, C9, C15) or an unplaced site (C11).
- **25 CLOSED as numbers.** The loss is named with both statistics (above). The window is keyed to `WIDTH`, so it no longer pre-decides B. G1 is ruled.
- **26 CLOSED.**
  - The PNG is tied to the path (tie 0.0010 / 0.9942), served 200 `image/png`, with both shas matching.
  - The photograph is pass 7's, of the byte-identical PNG (`b07f52f9`). Not re-shot.
- **27 CLOSED.** The self-test and the `ci.yml` step (comment now 61 + 8, with the battery named) are in place. Preview content types were re-read this pass.
- **28 HELD** at pass 7 (whole-DOM π not re-run; gap 4). `src/` is empty and the dist diff is 2 lines + 3 files.
- **29 PARTLY.**
  - H and B are each one const, built and gated.
  - P′ is declared dead on the number.
  - The second non-author reading at 48 and 180 is OPEN (the critic's).
- **30 OPEN by its own terms.** It was re-looked: the collision with `e.link-icon` is named (gap 8).
- **31 STATED (M19, gap 7).** The owner's real-tab look is below.
- **36 (the palette watch row) is the fold's CI row for every palette family.**
  - `lint:favicon` c reds a move of either token at a second placed site (conflict) and at any unplaced site.
  - On `74a2b5d9` + `s13-s7-s3` + the homes + this delta, the gate reads GREEN: the union moves neither token.

**The theme-color OPTION (§2.16, row 31's crossing)** is framed, not defaulted. It is VERB's, built OFF on VERB's tree (settled read only, mid-flip owed). This tree ships no `meta[name=theme-color]`, and nothing here changes that.

## RUNSHEET line (the owner's real-tab look; M19)

After the deploy that carries this pen:
- Open sudoku.babb.dev in Chrome, with the OS set light and then dark, reading the tab's s against the active and background strips at 100 % zoom.
- Open it in Safari: the tab bar and the tab overview. Does it show `/icon.svg` or its own monogram, and does it follow the dark query?
- Add it to the iOS home screen and read the 180 touch icon under the mask.
- Say which hand (T9-B27: W | H) and which width (T9-B28: 4 | 5) you want. Each is one const in `scripts/icons.mjs`.

## Instruments (every import relative, at product paths)

- `scripts/check-favicon.mjs` → `./shape-census.mjs`, `./icons.mjs`.
- `.tabpen8/favicon-glyph8.mjs`, the lane driver (moved out; copy in `instruments/`) → `../e2e/lib/glyph-pop.mjs`, `../e2e/lib/paint-lib.mjs`.
- No `docs/` import anywhere in `e2e/` or `scripts/`.
- Scratch copies in `instruments/`, each read whole with no delete line:
  - `crit-plants.p8.mjs` is the pass-7 critic's script with MAIN and the plant dir re-pointed;
  - `battery.sh` and `vitest-chunks.sh`;
  - `tile.mjs`, a one-pixel read.

## Frames

None. **Headroom spent: 0 B** of ruling 18's 151,826 B. Pass 7's three crops stand as the ballot frames: p7-f1 (W|H|P at 16 DPR 1 ×4 and 48 DPR 2), p7-f2 (main|A|B), and p7-f3 (the 180 PNG, W|H). Arm B's WebKit G4 cost is a number, not a frame.

## Replay route

The work advanced in place. At open, the tree read tree `f114b075`, sha1 `f5bdbd76`, `12 files changed, 1748 insertions(+), 19 deletions(-)`, through a temporary index (`GIT_INDEX_FILE`), which equals BANKED.txt. No difference was declared.

1. The vendored `scripts/shape-census.mjs` was moved to trash. `knip.json` was restored to base (my own hunk). `homes.diff` `a1d8adeb` was applied: `--check` 0, apply 0, 6 files `cmp`-equal to the chair's extraction.
2. The pass-7 gate on the home library read 26/26 + 2/2, exit 0 (`logs/open-pass7-gate-on-home-library.txt`).
3. `icons.mjs` got the arm table and a lazy `sharp`. `check-favicon.mjs` was re-cut. The `.gitignore` comment was corrected: it now reads "the committed public PNGs", naming both. The `ci.yml` comment was updated.
4. Prettier, then the battery, then the bank.

## Incidents (self-declared)

1. **STALL LAW.** The first sabotage battery ran in the foreground with a 120 s timeout. The harness moved it to the background, and I stopped it by PID (28526/28524) after a cwd check. It was slow (21.7 s a self-test) because the library re-scanned the tree per plant; the cure is the per-file cache (3.3 s).
2. **A battery on an edited tree (LAWS P7 §B), twice.**
   - I regenerated the sidecar (`npm run icons`) while sabotage run 1 was in flight.
   - I edited the gate (S-plants) while the first on-disk born-RED ran.

   Both readings are superseded: the battery re-ran on frozen bytes (`fd3ef080`, 54/54) and the born-RED re-ran on the final bytes.
3. The "(whole bank on the union: 0)" in my shell transcript is `head`'s exit (a pipe). git's refusal is shown by its error lines.
4. My scratch vite configs (`.vite-tabpen8-*.mts`, private cacheDirs in the scratchpad) sat inside the scratch archives. They were moved to `trash-tabpen8-2` before `eslint .`/knip ran there.
5. **Servers.** Tree :4240 (listener 81047, wrapper 81006, cwd the scratch archive) and control :4252 (listener 81070, wrapper 81007, cwd `w7-control`, identity `index-CubiZsMVSwTc.js`). Both were killed by recorded PID after an ancestry check, and both ports read free.
6. No `rm`, no git in the control tree, no install, no commit, no Safari or osascript. Scratch sits under `<scratchpad>/tabpen-p8/`, and the discards sit in `trash-tabpen8-{1,2,3}`.
