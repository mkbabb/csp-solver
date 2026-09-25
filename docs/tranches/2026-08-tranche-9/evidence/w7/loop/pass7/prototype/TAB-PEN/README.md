# TAB-PEN · pass 7 prototype (§12, the tab's pen)

**Base waiver (pass7/CHAIR-RULINGS §2, registry-v6 §2.16b):** this tree is on main's product (`1d0dc4fd`; main `a45cacb5`/`c31a92b9` carry the same `web/`). `src/` diff is EMPTY. π against main: **0 paint deltas**, chromium and WebKit, light and dark, fine and coarse, dark boot included. Filter census **9 · 14 · 11** (boot-dark 11 · 16 · 9) against main's dist AND against `74a2b5d9`'s control dist (`index-CubiZsMVSwTc.js`), both engines. cacheDir and build outDir were OUTSIDE the git root (the session scratchpad). The bank applies on a fresh `74a2b5d9` (exit 0).

Worktree `.claude/worktrees/wf_b6676cd9-8c6-17`. It advanced in place: the pass-6 diff was already on the tree and nothing was replayed. Before the first edit, the tree read 9 files +474/−18 and sha1 `4504d670`, byte-identical to `pass6/prototype/TAB-PEN/pass6.diff` (checked through a temp index; plain `git diff --stat` shows 4 files because the rest are untracked). Nothing is committed. The number is the critic's.

## Numbers

| row | tree | control | verdict |
|---|---|---|---|
| G-TAB-1 `lint:favicon` (CI) | a b c d e GREEN; self-test **26/26 plants RED**, **2/2 negative-negatives GREEN**, exit 0 | `--root` main: **34 failures**, every clause RED, exit 1 (the script doesn't exist on main, exit 1) | GREEN |
| the critic's 8 escapes, sidecar re-stamped with both shas | **8/8 RED** (E1 b · E2 c · E3 a · E4 b · E5 e · E6 a · E7 a · E8 b); the unplanted copy GREEN, exit 0 | intake: 8/8 GREEN | CURED for the class (below) |
| the critic's script run verbatim (the pass-6 plant FIRST) | 8/8 exit 1 (partly on the stale sidecar, which is why the re-stamped run is the record) | — | — |
| the flip to arm H (`ARM = "H"`, `npm run icons`) | gate 5/5 GREEN, self-test 26/26 + 2/2, `icons --check` 0, svg 510 B | — | H is one const away |
| coverage [0.18, 0.32] | W 0.225–0.230 · H 0.236–0.239 | main 0.520–0.527 | PASS |
| stroke/H, a TAB-SIZE LEGIBILITY window [0.15, 0.17], against the painted digits **0.103–0.115** and the wordmark's skeleton median **0.171** | W 0.164–0.172 (median 0.167, 44/48 cells) · H 0.163–0.167 (48/48) | main 0.161–0.195 | window, not "the digit's line"; the census's **0.156 is struck** (INTAKE-23 §0.4: wrong at the source, 5/32 where the 5 spans 40 units) |
| apertures at 16 DPR 1 | W [3, 3] · H [3, 3] | [2, 2] | at the floor, no slack |
| tile under light / dark | (251,250,249) / (17,15,14), both engines, every arm | (250,248,245) under both | PASS |
| core median, 16 DPR 1 light (ch / wk) | W 17.90 / 18.25 · H **18.52 / 18.25** | 16.08 / 15.19 | PASS |
| WebKit core within 0.5 of chromium | W Δ 0.36 / 0.35 · H Δ 0.26 / 0.28 | 0.89 | PASS |
| two photographs per cell | Δ 0 in all 1,920 | — | — |
| G-TAB-4 estate (`vite preview`, served bytes) | `/icon.svg` 200 `image/svg+xml` 496 B, sha256 `856c8ad5…` = sidecar · `/apple-touch-icon.png` 200 `image/png` 2,473 B, sha256 `b07f52f9…` = sidecar · `/favicon.svg` 200 **`text/html`** (the SPA fallback; the 404 is CF Pages', W8 row 35) | main: 200 html · 200 html · 200 `image/svg+xml` 1,961 B | GREEN |
| dist diff, tree vs main (fresh builds) | `index.html` 2 link lines, +`icon.svg`, +`apple-touch-icon.png`, −`favicon.svg`; all 44 other files byte-identical (`index-ChSrVSqM0j8q.js` both); tree dist == the pass-6 dist byte for byte | — | π by construction |

### T9-B28's loss, named (LAWS P6 §G; the ballot's caption)

**At 16 DPR 1 in chromium light, the default A's sub-4.5 fringe rate is 0.375 against main's 0.289 (count 33 vs 50).** The count halves and the rate rises: the default loses to the control on the rate in that one cell. Every arm on the same payload (the cell photographs, light-active `#ffffff` / dark-strip `#202124`):

| 16 DPR 1 | chromium light | WebKit light | chromium dark | WebKit dark |
|---|---|---|---|---|
| main (the control) | 0.289 (50) | 0.385 (77) | 0.289 (50) | 0.382 (76) |
| **A = 4 (W, default)** | **0.375 (33)** | 0.360 (31) | 0.326 (28) | 0.337 (29) |
| B = 5 | 0.352 (37) | 0.360 (40) | 0.298 (31) | 0.339 (37) |
| H (the hand, stroke 4) | **0.302 (26)** | **0.276 (24)** | **0.247 (21)** | **0.250 (21)** |
| P (Fraunces opsz 52 wght 550) | 0.379 (33) | 0.341 (30) | 0.282 (24) | 0.295 (26) |

A also moves ink 0.52 → 0.23, the LARGER departure. B (0.28–0.29) is nearer "a bit". B's stroke/H is 0.196–0.236 against the digits' painted 0.11 and A's 0.167, and its upper aperture closes to 2 px ([2, 3]). H is the only arm whose chromium-light rate comes within 0.013 of main's while its count halves (26 vs 50). **H still loses to main on that one rate, by 0.013.** In the other three cells, H beats main. Main's dark cells are its cream tile on a dark strip (it has no dark variant).

### B-TAB-H, stated plainly (registry-v6 §9's loop name; INTAKE-23 §5 wrote "T9-B27", which registry-v6 gives to MOT-LADDER's ratchet, so the collision is the chair's)

The question the frame asks: **a letter tile or a hand?** W is a smooth, symmetric monoline S. At 180 it reads as a rounded-sans letter tile, the critic's "browser fallback". H is the same box, pen, paper and ink, with the 5's grammar borrowed: a short down-tick into a flat top stroke tilted by 0.4 u, which is one hard join (94.5°); control points sit 0.1–0.6 u off W's symmetric ones; there's no filter; 510 B. P is the wordmark's Fraunces (serif monogram). Each arm's own rows, with no labels derived from another arm:

| arm | coverage | skeleton max/median @32,180 | stroke/H @32–180 | apertures @16 | core @16 light ch/wk | frac<4.5 @16 light ch/wk |
|---|---|---|---|---|---|---|
| W | 0.225–0.230 | 1.04–1.12 | 0.164–0.172 | [3, 3] | 17.90 / 18.25 | 0.375 / 0.360 |
| H | 0.236–0.239 | 1.20–1.41 (the hard join widens the skeleton at its corner) | 0.163–0.167 | [3, 3] | 18.52 / 18.25 | 0.302 / 0.276 |
| P | 0.222–0.229 | 2.17–2.55 (a contrast serif) | 0.118–0.125 | [3, 4] | 14.70 / 15.26 | 0.379 / 0.341 |

H's max/median is above W's 1.25 window. That window is a monoline's signature (the critic's §4), so it's printed, not ruled. Arm H is built behind one const (`scripts/icons.mjs` `ARM`); `npm run icons` writes the SVG, the PNG and the sidecar, and the gate reads them.

### The touch icon, PHOTOGRAPHED (INTAKE-23 row 26)

The 180 × 180 PNG as `<img>` at 180 CSS px, chromium and WebKit, DPR 1 and 2, on `#ffffff` and `#000000`:
- **The photograph equals the PNG's decoded pixels, max Δ 0, both engines** (DPR 1).
- Paper (251,250,249), darkest ink (10,10,10), ink/paper **18.99:1**.
- Paper on white **1.04:1**: on a white home screen the square paper vanishes, iOS masks the corners anyway.
- Paper on black **20.14:1**.
- Coverage 0.233 (W) / 0.242 (H).

**Vendored:** sha256 `b07f52f9…` sits in `scripts/icons.provenance.json` beside `icon.svg`'s `856c8ad5…`. CI never rasters (sharp is miniflare's transitive; `icons.mjs` is NOT-A-LANE). The gate also decodes the PNG itself (zlib, no rasteriser), so a PNG that isn't the s reds on CONTENT whatever the sidecar says (E5).

### The glyph-population probe on the tab (the chair's `glyph-pop.mjs`, extended PROPOSED: `off` + `IMG_PLANTS`)

ON = the arm's SVG, OFF = its paper-only twin (`content: url(<arm>-ng.svg)`), pixel for pixel. 16 px DPR 1 and 32 px DPR 2, light/dark, both engines, arms W H B main.
- **Clean: 24/24 tree-arm cells GREEN** (median ≥ 9.3, pop 87–1,320).
- **Main's clean read is RED at 16 DPR 1 on G4 in both engines** (a slice core of 3.17–3.93 at its terminals). That's the control's born-RED.
- Run 1 (the chair's 16 columns, slack 0.05) found HOLES:
  - TAIL12 read GREEN at 16 DPR 1. The ink spans ~10 device px, so 16 columns hold fewer than 8 px each and G4 is blind.
  - FADE65/80 read GREEN in 14 cells.
- Run 2 (**8 columns at 16 DPR 1, stated**; slack 0.02): **every FAINT30/TAIL12/TAIL35/EMPTY plant RED** in every cell.
- **FADE80 stays GREEN in 4 of 24 tree cells** (WebKit dark: H at 16, and W/H/B at 32 DPR 2). An 80 % dark pen on its paper stays ≥ 10:1 in the core and moves the fraction under 0.02.
- That hole is the PAINTED witness's. The CI gate holds the fade class at the source: opacity attributes are off the allowlist (P5), alpha inks by ΔE (E10), cascade inks (E2), unresolvable `var()` (E18).

## G-TAB-1 re-cut on the SHAPE law (charter row 1; INTAKE-23 row 23)

`check-favicon.mjs` now reads the markup against an allowlist. Exactly one each of svg/style/rect/path; no comment/entity/PI; no attribute outside the allowlist; viewBox `0 0 32 32`; the rect at 0,0 covering 32 × 32; the rect painted before the path.

The `<style>` body is read with the estate's ONE shape-census library (`scripts/shape-census.mjs`, byte-identical to MOT-LADDER's landed copy, sha1 `8203e7ed`):
- only `rect{fill}` / `path{stroke}`, at the top level or in `@media (prefers-color-scheme: dark)`;
- no other at-rule, selector, property or `!important`;
- every `<style>` block is read.

The paint is resolved per scheme through the cascade: attributes first, then every rule in source order, last wins. Every colour goes through the ONE parser and is scored by **ΔE ≤ 0.5, opaque**, never by spelling.

The page's tokens are read at EVERY site they're declared (src CSS, SFC styles, public CSS, index.html, script writes). A site outside `@theme`/`.dark` is RED. That's row 36's palette watch as a plant (E19).

The sidecar replaces `icons.mjs` rewriting its own source. The PNG is decoded and checked on content.

The 26 plants, and the clause each reds:
- the 7 old ones: P1 abcd · P2 c · P3 bd · P4 c · P5 a (was b: the attribute is now off the allowlist) · P5b c · P6 e;
- the critic's E1–E8;
- 11 new ones:
  - E9, the light rule after `@media` (dark ink on dark paper): c
  - E10, alpha ink `#0a0a0a26`: c
  - E11, `style=`: a
  - E12, a second `<style>`: ab
  - E13, paper over pen: a
  - E14, `@import`: b
  - E15, `*{}`: b
  - E16, `!important`: b
  - E17, a comment: a
  - E18, `var(--x, faint)`: c
  - E19, a palette `:root` site: c.

Negative-negatives: NN1 `rgb(10 10 10)` stays GREEN (ΔE 0), NN2 a decoy rule inside a CSS comment stays GREEN.

## G1 against clause c (charter row 5; INTAKE-23 §0.7g), one clause survives

**Clause c survives; G1 is struck as mis-specified, and its cost stays named.**
- Clause c binds the paper to the page token, the design-language half of M22.
- The dark token `#110f0e` has luminance 0.005. To sit ≤ 1.3 from Chrome's dark-active strip `#35363a`, the tile would need 0.016–0.035, which isn't the page's paper.
- The cost, printed on the number: **tile on `#35363a` 1.58:1**, a visible dark square on Chrome's dark active tab. Main's cream square reads 11.38 there.
- The other three strips: #fff 1.04 · #dee1e6 1.26 · #202124 1.19.
- This is the lane applying §0.7g. The chair may reverse it.

## Rows (INTAKE-23 §4, by number) and the charter's

- **22 the pen: CLOSED.** G-TAB-1 GREEN on the tree; main 34 failures.
- **23 hardened: CLOSED.** 8/8 escapes RED with the sidecar re-stamped; the 7 old plants RED; clean GREEN; 11 more plants plus 2 NN; the sidecar replaces the self-rewrite.
- **24 the paper: CLOSED.**
  - Tile (17,15,14) / (251,250,249), both engines.
  - Core 14.8–19.0.
  - A palette move at a new site reds c (E19). A move at `@theme`/`.dark` itself reds c against the literal.
- **25 the weight, the loss named: CLOSED as numbers.** See the tables above. The 4.5 rung stays refused (the intake's reading, not re-run).
- **26 the touch icon: CLOSED.** 200 `image/png`, IHDR 180, both shas match; photographed both engines, Δ 0, contrasts printed.
- **27 self-test + estate: CLOSED.** The `ci.yml` step sits beside `lint:theme-tokens`, and its comment is updated to the 26 plants. Preview content types are above.
- **28 π and budgets: CLOSED.**
  - 0 deltas fine/coarse/dark-boot in both engines; the floor is 0; only-here = the new `<link>` ×3.
  - Filter 9 · 14 · 11 = main = `74a2b5d9`.
  - Dist diff: 2 lines + 2 files (−1).
  - `src/` is empty, so `pencilConfig.ts` is untouched.
- **29 ballot frames: PARTLY.**
  - H is built and framed beside W and P at 16 DPR 1 and 48 DPR 2 (f1), and at 180 photographed (f3, W and H).
  - A/B are framed on f2 with main.
  - P carries its own rows.
  - The siblings (Fable 16×25, Opus 23×22) are measured in the rollup, not framed.
  - **P′ (the wordmark's grain edge baked into the outline) is NOT built.**
  - **The non-author "generic letter tile" reading at 48/180 is the critic's gate and is OPEN.**
- **30 the ladder: OPEN by the row's own terms.** It comes after the owner disposes the hand.
- **31 Safari, stated: OPEN (M19).** Every painted number here is headless Playwright `<img>`, an emulation. Unwitnessed:
  - Chrome's favicon service and its real tab strips (the four strip colours are the census's approximations);
  - Safari's tab: does it show `icon.svg`, and does it honour the in-SVG query; its overview;
  - iOS's web-clip mask on the 180 PNG;
  - Android without a manifest;
  - Firefox tabs.

  The light arm is the no-CSS fallback (presentation attributes = light tokens), which is the design's answer until the owner's re-look.
- **Charter row 8 (theme-color, INTAKE-23 row 16 ↔ row 31):** built once, on VERB's tree, cited here, not re-built. `pass7/prototype/MOT-VERB/README.md:122`: arm on, 1 meta whose content equals the painted body background on every state, both engines, both boot schemes, 12/12; default 0 metas. VERB read it settled, not mid-flip (its gap 11).
- **Charter row 10:**
  - `git apply --check` 0 on fresh `74a2b5d9` and fresh `1d0dc4fd`.
  - The hunk list is `.github/workflows/ci.yml`, `.gitignore`, `web/frontend/{index.html, knip.json, package.json, public/*, scripts/*}`: zero `src/` paths.
  - The prompt's premise is "main `a45cacb5`"; main's `web/` is the same bytes at `1d0dc4fd`/`a45cacb5`/`c31a92b9` (`git diff --stat` empty).

## Pre-return battery (bare; tree = fresh `1d0dc4fd` + the draft bank, control = a full `git archive` of main `c31a92b9`)

| gate | tree | control |
|---|---|---|
| `lint:favicon` | 0 | 1 (absent on main) |
| `lint:lanes` · `lint:theme-tokens` · `lint:sleep` · `test:e2e:projects` | 0 · 0 · 0 · 0 | 0 · 0 · 0 · 0 |
| `lint:copy` · `check-copy-register` bare | 0 · 0 (0 em/en dashes, 0 unadmitted) | 0 · 0 |
| `lint:motion` (35 specs) · `lint:theme-selectors` · `lint:catch` | 0 · 0 · 0 | 0 · 0 · 0 |
| `eslint .` · `npm run lint` (prettier `src/ scripts/ ../../scripts/ ../relay/`) | 0 · 0 | 0 · 0 |
| `lint:knip` | **1 → 0** (14 unused exports of `shape-census.mjs`, cured by LADDER's knip entry, same commit) | 0 |
| `typecheck:node` · `vue-tsc -b` (on the archive, never the worktree) | 0 · 0 | 0 · 0 |
| `check-property-block` source · served (tree :4240 `index-ChSrVSqM0j8q.js`, main :4247) | 0 · 0 | 0 · 0 |
| vitest, chunked by dir | **69 files / 847 tests passed** (pencil 8/73 · composables 3/16 · probe 1/17 · games 57/741) | — (`src/` identical) |
| `lint:bands` · `lint:verbs` | not on this base (they're §13's, `74a2b5d9` + LADDER) | — |

**Final-sha battery** (`pass7.diff` sha1 `f5bdbd76…` at start and at end, equal to the bank): favicon, lanes, knip, eslint, prettier, theme-tokens, sleep, e2e:projects, copy bare and `icons --check` all exit 0 (`logs/final-sha-battery.txt`).

**Box load:** the π runs 9.3 → 35.9 (1-min), the battery 27.9 → 31.2 with 301 node/playwright/vitest processes, the glyph runs 20.5 → 23.6. No timing row is claimed in this lane: every reading is a static paint or a source read.

## Frames (3, all replacements, quantized pngquant 60–90; 37,484 B against 46,884 B retired, net −9,400 B)

1. `p7-f1-B-TAB-H-W-H-P-16dpr1x4-48dpr2-chromium-webkit-light-active-dark-strip-pointer-na-retires-intake-c4.png` (17,012 B) · chromium and WebKit · light (`#ffffff`) and dark (`#202124` strip) · 16 px at DPR 1 (×4 nearest) and 48 px at DPR 2 · pointer n/a (a tab icon has none) · payload: the three arm SVGs, one variable (the pen's grammar/face) · **retires `intake-owner-2026-09-23/prototype/G-FAVICON/c4-ballot-pairs-…png`** (30,529 B).
2. `p7-f2-T9-B28-main-A4-B5-16dpr1x5-…-retires-intake-c2.png` (13,151 B) · both engines, both schemes · 16 px DPR 1 ×5 nearest · main | A = 4 | B = 5, one variable (`stroke-width`), the fringe table above as its caption · **retires `…/c2-decider-…png`** (12,177 B).
3. `p7-f3-touch-icon-180-W-H-on-white-black-chromium-over-webkit-dpr1-pointer-na-retires-intake-c3.png` (7,321 B) · the 180 PNG photographed, chromium over WebKit, DPR 1, W | H on white and black · **retires `…/c3-apple-touch-icon-…-librsvg-…png`** (4,178 B).

**The wave was already over its cap when I opened** (`check-evidence-policy`: w7 2,279,337 B > 2,097,152). This lane nets −9,400 B once the chair moves the three retirees (no `rm` in a lane).

## Gaps (a gap is a gap)

1. **"Design language" is still asserted, not judged.** H is the lane's own drawing. Whether it reads as the house hand or as a W with a serif at 48/180 is the non-author's call (row 29 open).
2. **H loses to main on the chromium-light fringe rate by 0.013** (0.302 vs 0.289). W loses by 0.086.
3. **G1 is struck by the lane applying §0.7g**, with the visible dark square named (1.58). It's the chair's to ratify.
4. **P′ unbuilt**; the siblings are measured but not framed.
5. **FADE80 is GREEN in 4/24 painted cells.** G4 at 16 DPR 1 needs 8 columns, a parameter this lane chose; that choice goes to the chair's instrument row.
6. **The fold collides on two paths**, both LADDER's same act, identical in substance:
   - `scripts/shape-census.mjs` is a byte-identical add;
   - `knip.json:84` is the same entry, with a comment naming this importer.

   The fold keeps one of each.
7. **`check-favicon.mjs` is 748 lines after prettier.** The PNG decoder (~75), the markup reader, and 28 self-test rows spelled out one per plant. A smaller gate would drop the content check, which is E5's cure.
8. **M19:** no real browser favicon path was witnessed, and Chrome's strip colours are approximations.
9. **The worktree still carries the intake prototyper's untracked `.gfav-scratch/` and a `docs/…/intake-owner-2026-09-23/` copy**, so `git status` is not product-only. Neither is mine. Both are the chair's to move (no `rm`).

## Replay route

In place. The pass-6 diff was on the tree (verified byte-identical to its bank before any edit). The pass-7 delta: `scripts/check-favicon.mjs` re-cut, `scripts/icons.mjs` (ARM const, sidecar), `+scripts/icons.provenance.json`, `+scripts/shape-census.mjs` (MOT-LADDER's copy, sha1 `8203e7ed`, extracted from `pass7/prototype/MOT-LADDER/pass7-ladder.diff`), `knip.json` entry, and the `ci.yml` comment. `icon.svg` and `apple-touch-icon.png` were regenerated by `icons.mjs` **byte-identical** (sha256 `856c8ad5…` / `b07f52f9…`). Cumulative bank: `pass7.diff` + `BANKED.txt` (12 files +1748/−19, sha1 `f5bdbd76`).

## Incidents (self-declared)

1. **A heredoc of mine held backticks.** The shell ran one of them (`tail`), which hung on stdin for ~2 minutes as a background task. I killed it by PID (49253, then its shells 49252/49247). No file was harmed: `glyph-pop.mjs` was re-copied from the chair's original through a script file, and `paint-lib.mjs` is byte-identical.
2. **The first main build failed**: `sudoku-templates` needs `csp-solver/data`, which the `web/frontend`-only archive lacked. I archived it too and the rebuild exited 0.
3. **Glyph-population run 1 had holes** (TAIL12, FADE65/80). They're reported above, with run 2's parameters stated rather than silently replacing run 1 (both logs banked).
4. **Servers were killed by recorded PID**: listeners 44236 (:4240 tree), 44233 (:4247 main), 44245 (:4248 control `index-CubiZsMVSwTc.js`); npx 44157/44159/44161. All three ports read free.
5. No `rm`, no git in the control tree, no install, no Safari/osascript. All scratch sits under `<scratchpad>/tabpen-p7/`.
