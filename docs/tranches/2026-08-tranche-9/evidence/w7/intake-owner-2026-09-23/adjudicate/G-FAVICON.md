# G-FAVICON · adjudication—the apotheosis (T9-M22)

Adjudicator: Fable 5.1, 2026-09-23. Two designs competed against MAIN `1d0dc4fd`:
`portfolio/G-FAVICON/fable.md` (A SCRAP OF THE PAGE) and `portfolio/G-FAVICON/opus.md` (THE TAB IS
WRITTEN WITH THE BOARD'S PENCIL). Ground: `census/favicon/README.md` + `instruments/favicon-census-summary.tsv`
+ `stroke-per-size.json` + `wordmark-readings.json` (read whole; every main-tree number below is the
census's unless marked ADJ), the marks file, pass-6 `CHAIR-RULINGS.md` Addendum A whole (A.5.3 existence is
not visibility, A.5.7 two-photograph minima, A.4 the §2.11 glyph-text statistic on both themes, A.4's id
trap), registry-v5 §1 (no family owns the surface), registry-v0 §10 (CTRL-FACE's printed/written law),
W7 §12, R6-census rows 30/51/52, and main's own source (`public/favicon.svg`, `index.html:15`,
`index.css:134–135, 363–364`, `HandwrittenGlyph.vue:83–90, 302–314`, `glyphPaths.ts` `"5"[0]`,
`scripts/check-theme-tokens.mjs`, `package.json`, `package-lock.json:5418`, `.github/workflows/ci.yml:988`).
No server started, no port bound, nothing outside `docs/` touched; one scratch geometry read (ADJ: a cubic
sampler over both candidate paths, `<scratchpad>/adj-fav/geo.py`, no raster). Nothing here retires T9-M22
(U-10); the owner disposes at the re-look.

## 0 · Verdict

**One thesis, twice.** Both designs answer the mark with the same object: one open monoline `s` in the
digits' pen (`fill="none"`, round caps and joins, `HandwrittenGlyph.vue:308–313`), stroke 4 of 32 = 2.00 css
px at the 16 px tab, in the page's own ink on the page's own paper, the paper turning over under
`@media (prefers-color-scheme: dark)`, no filter, the file renamed to `icon.svg` as the favicon-store bust,
the Fraunces wght-900/opsz-9 glyph and its wobble dead. That agreement is the apotheosis's spine and it
is not re-litigated. The designs part on five things, and each is ruled below:

| fork | Fable | Opus | ruling |
|---|---|---|---|
| the tile's corners | rx 0 (R6 §1.1: square is the house) | rx 6 kept ("not the complaint") | **rx 0.** R6 row 30: the auto radius "was deleted as geometric, out of family"; the rounded serif monogram is the web's default badge (the tell both reviews named); one square SVG then serves the touch icon too, where Opus needed a second rx-0 raster anyway. Fable's own audition file still carries `rx="6"` (`fable-icon.svg:7`)—the square arm was never rastered; the prototype rasters it. |
| the ink box | 16 × 25 (ADJ), 50 % × 79 %, stroke/H 0.158, aspect 0.63, unhinted at 16 (outer y 1.77–14.40 px) | 23 × 22 (ADJ), 72 % × 69 %, stroke/H 0.182, aspect 1.05, hinted (outer y 2.00–13.00 px) | **Opus's hinting law on Fable's proportion law: 20 × 24 units** (§2.1). Fable's cut is the digit's line in proportion (0.156, `HandwrittenGlyph.vue:88–90`) but lands on half pixels at 16 and reads condensed (0.63); Opus's cut lands on the grid but at 0.182 H it carries the SHIPPED glyph's own median proportion (census 0.178) and is wider than tall. Neither was measured by the other; the merge is a re-cut the lane draws. |
| the estate | the whole ladder: ico, 32 png, touch 180, 192/512, manifest, two theme-color metas, `icons.mjs --check` in CI | icon.svg + touch 180 + two links; the ladder left to the adjudicator, theme-color "admitted first" | **Opus's scope.** The mark names the s. `sharp` is NOT a devDependency (`package-lock.json:5418`: miniflare's transitive; `package.json` never names it) and the prototype can't `npm install`, so a CI raster gate is unbuildable on the tree (O-12 besides); the ladder freezes a glyph the owner hasn't disposed into five committed rasters. It's booked as a row for after the re-look (§4 row 8). theme-color is REFUSED here: a static meta keyed on the OS contradicts the page whenever the toggle disagrees with the OS, on the one chrome (Safari/Android) nobody can witness (M19); it lands only WITH the toggle follow, which is `src/` and MOT-VERB's (§4 crossing). |
| the SVG's colour form | `:root{--paper;--ink}` + `var()` in `<style>`, presentation attributes as fallback | literal colours per selector, no fallback | **Literals per selector (Opus) + the presentation attributes (Fable).** Custom properties inside a favicon add one silent failure mode on rasterisers no one has read; the light arm as `fill=`/`stroke=` attributes is the no-CSS fallback. |
| the source gate | six clauses incl. token byte-equality and stroke/H | five clauses + `--self-test` plants P1–P5 incl. FAINT INK | **Union.** Opus's plants are A.5.3 made executable and Fable's token equality and stroke/H are the two clauses Opus lacks. Opus's "parsed with `check-theme-tokens`' HSL reader" is wrong—that script has no HSL reader (its functions are `themeBody`/`declaredIn`/`corpusFiles`/`census`); the gate carries its own ten-line `hsl()`→8-bit resolver. |

Family: **TAB-PEN, minted**, under the EXISTING W7 §12 (idiom refinement: "colors, animations … brought to
the design language"), type ruling CTRL-FACE's printed/written; not Opus's new §16 (a wave section is the
chair's to mint, not the adjudicator's). One tree, the smallest diff in the wave, no file any live family
touches.

Two ballots survive (§5); Fable's T9-B-FAV-2 (no dark tile) is REFUSED as an arm a constraint forbids
(light ink at 1.11–1.18:1 on any light surface that ignores the query—"AA on both themes from painted
bytes"). Every number both designers offer is a librsvg proxy and is treated as a prediction until the
engines read it (§6).

## 1 · The census, reconciled (what the design answers)

| reading | on main (census) | the apotheosis's target (gate) |
|---|---|---|
| ink fraction of the tile | 0.520–0.527 at every size/engine/DPR | ∈ [0.18, 0.32] (ADJ predicts ≈ 0.21 for the 20 × 24 cut; Opus's 0.242, Fable's 0.183 by the same arithmetic) |
| glyph box, tile units | 28.97 × 26.34 (90.5 % H, 82 % W) | 20 × 24 outer (62.5 % W, 75 % H), centred, extrema on whole pixels at 16 |
| stroke, skeleton median @16 css px | 2.83 chromium · 3.00–4.00 webkit (geometric 2.57); spine 5.80–6.32 | 2.00 geometric; printed at 16 (EDT quantised, census gap 5), gated at 32/48/180 |
| stroke / glyph height, median | 0.178 (mean 0.221, spine 0.40); the given digit 0.156; the wordmark painted 0.164–0.183 | ∈ [0.15, 0.17] (4 / 24 = 0.167) |
| spine / median | 2.26 | ≤ 1.25 at 32 and 180 device px |
| counters @16 DPR1 | 2 px slits (4 px of paper in the centre column) | two apertures < 0.5 coverage, each ≥ 3 device px, both engines |
| the wobble | chromium max Δ 0.036 (a no-op); WebKit blur σ 0.35–1.0, core 16.08 → 15.19 | no `<filter>`; WebKit core median within 0.5 of chromium's at 16 DPR1; blurfit σ printed |
| ink · paper | `#1a1a1a` (COLORS.outlineBlack) · `#faf8f5` (hue 36°, 1.017:1 off the paper) | `#0a0a0a` · `#fbfaf9` light, `#edece9` · `#110f0e` dark—byte-equal to index.css's resolved tokens |
| dark scheme | none; `[250,248,245]` in 64/64 rows; the cream tile 15.19:1 on `#202124` | the tile paints rgb(17,15,14) under dark both engines; tile-on-own-strip ≤ 1.3 (1.19 dark / 1.04 light) |
| glyph core contrast (§2.11 statistic) | 16.08 chromium; 15.19 WebKit @16 | median ≥ 12 both themes both engines; fraction under 4.5 @16 DPR1 stated, ≤ 0.36 AND count ≤ main's 49 (Opus's proxy: 31 light / 26 dark) |
| file | 1,961 B / 954 gz | ≤ 600 B raw (both cuts 473–507) |
| estate | one `<link>`; `/apple-touch-icon.png` 404 at the edge | `/icon.svg` + `/apple-touch-icon.png` 200 on the built dist; `/favicon.svg` gone |

Two census findings both designs read correctly and the chair's intake gloss did not: "too thick" is
absolute, not a departure from the wordmark's proportion (the favicon sits INSIDE the wordmark's painted
band), and a filter cannot paint pencil at tab size (G2.4's digit ruling, re-proven: no-op in one engine,
blur in the other). The favicon's ink is a config colour, not the page's foreground; nothing follows the
theme.

## 2 · The apotheosis

### 2.1 The s (one path, the lane draws it)

The grammar is Opus's (`glyphPaths.ts`: one open `M` then cubic `C`s in stroke order; start at the
top-right terminal, over the top bowl, down a leaning spine, round a LOWER bowl wider than the upper, end
in the house 5's upturned tail, `"5"[0]` `…C18,52 10,46 10,44`). The terminals stop short of the bowls'
line (Fable) so the apertures stay open at 2 px. The box is the merge:

- outer ink box **20 W × 24 H** units of 32, centred on both axes: outer x 6–26, y 4–28 (at 16 px: x 3–13,
  y 2–14, whole pixels); the centreline's vertical extrema therefore sit at y 6 and y 26 and its horizontal
  extrema at x 8 and x 24. Aspect 0.83 (a written lowercase s), occupancy 0.625 × 0.75.
- stroke **4** units (2.00 css px at 16, 4.0 at 32, 22.5 at 180), round caps, round joins, `fill="none"`;
  stroke/H = 4/24 = **0.167**, inside the digit's window (given 0.156, the wordmark 0.164–0.183).
- ONE cut ships; the lane frames Fable's 16 × 25 and Opus's 23 × 22 beside it as siblings on crop 4 (no
  ballot; the numbers and the non-author eye decide, and the owner sees all three at the re-look).

The file, whole (the lane fills `d`; 24 px rounding rules above are the gate's clause d):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><style>rect{fill:#fbfaf9}path{stroke:#0a0a0a}@media(prefers-color-scheme:dark){rect{fill:#110f0e}path{stroke:#edece9}}</style><rect width="32" height="32" fill="#fbfaf9"/><path d="M… C… C… C…" fill="none" stroke="#0a0a0a" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
```

No `rx`, no `clipPath`, no `<filter>`, no `<title>`, no `opacity`. States: one; the only axis is the
strip's scheme. Motion: none, honestly (tabs freeze SVG favicons; the flip is the browser's re-raster, a
cut in every regime incl. PRM; no MOTION rung, no literal, `pencilConfig.ts` byte-identical).

### 2.2 The paper

Full-bleed square `rect` in `--color-background`'s painted value per scheme. In its own scheme it
dissolves into Chrome's strips (1.04 on `#fff`, 1.19 on `#202124`; Fable's table, checked from the tokens);
cross-scheme it stands as a card (14.6–19.1) with the s on it at 16–19:1. The page's turbulence tooth
(`index.css:311`) is NOT carried: invisible at 16, a filter at 180, and principle A.5.3 says a thing that
only exists is not designed. Nobody "adds the texture back" as a cure.

### 2.3 Tokens

Four values, COPIES of `index.css:134–135` (`:root`) and `:363–364` (`.dark`), held true by G-TAB-1c: the
gate resolves `hsl(48 15% 98%)` → `#fbfaf9`, `hsl(0 0% 3.9%)` → `#0a0a0a`, `hsl(24 8% 6%)` → `#110f0e`,
`hsl(48 10% 92%)` → `#edece9` with its own resolver and asserts byte-equality with the SVG's literals in
both blocks. No user-ink blue (the tab is not the player's entry). A palette move to either token re-cuts
`icon.svg` in the same commit or the gate reds (the cross-family watch row, §4).

### 2.4 The estate (this slice)

| lands | where | note |
|---|---|---|
| `public/icon.svg` | NEW | the file above; `public/favicon.svg` DELETED (the store bust is the href) |
| `public/apple-touch-icon.png` | NEW, 180 × 180 | rastered from `icon.svg`'s light arm by `scripts/icons.mjs`; square paper (iOS rounds); palette PNG ≈ 2.6–2.9 KB; committed bytes with the SVG's sha256 in the script's provenance line |
| `index.html:15` | `<link rel="icon" type="image/svg+xml" href="/icon.svg" />` + `<link rel="apple-touch-icon" href="/apple-touch-icon.png" />` | two lines |
| `scripts/icons.mjs` | NEW, local only | resolves `sharp` through `createRequire(web/frontend/package.json)` exactly as the census's `cost.mjs` did—a transitive 0.35.4 via miniflare, NOT declared; the header says so. Whether `sharp` becomes a declared devDependency is a FOLD-time decision (a lockfile change the prototype may not make) |
| `scripts/check-favicon.mjs` + `"lint:favicon"` + one ci.yml step beside `lint:theme-tokens` (:988) | NEW | G-TAB-1, browserless, with `--self-test` plants |

Not in this slice, booked (§4 row 8): `/favicon.ico` (16 + 32), `/icon-32.png`, `/manifest.webmanifest`
+ 192/512 (purpose `any`; maskable needs the inner-80 % zone and is a second transform), `mask-icon`
(deprecated, near-zero). Refused: the two `theme-color` metas (MOT-VERB's crossing, with the follow or
not at all).

### 2.5 Copy (M16)

Zero strings. No `<title>` in the SVG; the head's title and og block untouched; `check-copy-register`
bare 0 by construction and the lane runs it.

### 2.6 Desktop, phone, light, dark

Desktop: one SVG at 16 css px (DPR 1 and 2), bookmarks and history 16, tab search 32–48; the 16 × 16 DPR1
cell is framed FIRST in both engines (crop 2)—it is the design's most exposed claim. Phone: the touch icon
at 180 on `#ffffff` and `#000000` grounds (crop 3); tab overviews read the SVG; no hit target, so no
hasTouch row. Light and dark follow the STRIP's scheme (the OS), not the page's `.dark` class—correct for
the strip, and the mismatch is declared, not hidden (§6). Safari falls to the light arm if it ignores the
query, which is legible on every Safari surface (15–20:1): an argument, not a reading (M19).

## 3 · Born-RED gates (RED on main by construction; GREEN on the tree)

**G-TAB-1 · `lint:favicon`** (`scripts/check-favicon.mjs --self-test`, node, browserless, in CI's lint
lane beside `lint:theme-tokens`). Clauses, each RED on main:
- (a) no `<filter`, `feTurbulence`, `feDisplacementMap`, `clip-path`, `rx` in `public/icon.svg`
  (main: `favicon.svg:3–6, 8, 11–13`).
- (b) exactly one `<path>`: `fill="none"`, round caps and joins, `stroke-width` ∈ [3.6, 5.2] of the 32
  viewBox (the window admits ballot arm B in source; the painted window below prices it); no `opacity`,
  `stroke-opacity`, `filter` anywhere; ≤ 600 B (main: a filled outline, 1,961 B).
- (c) palette truth: the light `rect`/`path` literals AND the `@media (prefers-color-scheme: dark)` pair
  byte-equal the resolved `:root`/`.dark` `--color-background`/`--color-foreground` from
  `src/assets/index.css` (own `hsl()` resolver); ink-over-paper ≥ 7:1 per theme from the tokens (main:
  `#1a1a1a`, `#faf8f5`, no `@media`).
- (d) geometry: the exact cubic-extrema bbox of the path inflated by half the pen is within [0.55, 0.80]
  of the tile per axis, its centre within 0.5 unit of (16, 16), and stroke ÷ (bbox H + stroke) ∈ [0.15,
  0.17] (main: 0.905 H, 0.178).
- (e) hrefs: `index.html` links `/icon.svg` and `/apple-touch-icon.png`; both exist in `public/`; the
  PNG's IHDR reads 180 × 180 and `icons.mjs`'s provenance line carries `icon.svg`'s current sha256;
  `public/favicon.svg` absent (main: RED on every sub-clause).
- `--self-test` plants, each must RED its clause: P1 main's `favicon.svg` verbatim (a b c d); P2 ink
  `#1a1a1a` (c); P3 `stroke-width="6"` (b, d); P4 the `@media` block deleted (c); P5 FAINT INK,
  `stroke-opacity="0.15"` and separately ink `#e8e6e3` on the light paper ≈ 1.2:1 (b, c)—A.5.3; P6 the
  SVG edited after the PNG (e, the provenance sha). Closes at 6/6 plants RED, the clean tree GREEN.

**G-TAB-2 · the painted instrument** (local, the census's `shoot.mjs` + `an2.py`/`analyze.py` on a scratch
`http.server` on the lane's port: chromium AND webkit, DPR 1 and 2, `<img>` at 16/32/48/180, `colorScheme`
light and dark with the scheme's two strips, two bare photographs per cell, Δ stated, the minimum taken
(A.5.7); main's `favicon.svg` photographed as the control on the same page). Closes at, every cell unless
named:
- coverage ∈ [0.18, 0.32] (main 0.520–0.527);
- skeleton max ÷ median ≤ 1.25 at 32 and 180 device px (main 2.25); stroke/H median ∈ [0.15, 0.17] at
  32/48/180 (main 0.178–0.207); the 16 px skeleton PRINTED, not gated (quantised);
- two centre-column apertures < 0.5 coverage, each ≥ 3 device px at 16 DPR1, both engines (main: 2 px slits);
- the tile paints rgb(17,15,14) under dark and rgb(251,250,249) under light, both engines (main
  `[250,248,245]` 64/64); tile-on-own-strip ≤ 1.3 (main 15.19 dark);
- glyph core median ≥ 12 both themes both engines; WebKit's core median within 0.5 of chromium's at 16 DPR1
  (main Δ 0.89); the fraction under 4.5 at 16 DPR1 stated per theme, ≤ 0.36, AND the sub-4.5 keyed count
  ≤ main's on the same engine; `keyed_frac_under3` printed as a rate beside it;
- blurfit σ against the geometry raster printed both engines (expected 0; main 0.35–1.0 WebKit);
- the paper one connected region at 16 DPR1 (main: two closed counters).

**G-TAB-3 · π.** MRK-LIVE's whole-document 16-property paint census, lane dist vs control dist
(`74a2b5d9`'s product), 1280×800 fine + 390×844 coarse, both engines, both themes: 0 deltas; the `dist/`
diff limited to `index.html`'s two link lines and the two `public/` files; filter census light 9 on both
arms, dark = the control's; `src/` diff empty; `pencilConfig.ts` byte-identical; `lint:copy` bare 0;
`lint:motion`, `lint:theme-tokens`, `vue-tsc --noEmit`, `knip` unmoved (the new scripts admitted the way
the sibling `check-*.mjs` are, or knip 0 as is).

**G-TAB-4 · estate.** `vite build` then `vite preview` on the lane's port: `curl -sI` `/icon.svg` 200
`image/svg+xml`, `/apple-touch-icon.png` 200 `image/png`, `/favicon.svg` 404 (main: 200 / 404 / 200). The
live edge after deploy is W8's crossing row, not this lane's.

## 4 · Pass-7 charter rows (format: what lands · the gate · the number that closes it)

### TAB-PEN (mint; W7 §12; type ruling CTRL-FACE's; tokens ACC/PAL's by reference)

1. **The pen.** `public/icon.svg` per §2.1 (the 20 × 24 hinted cut in the 5's grammar), `favicon.svg`
   deleted, `index.html:15` re-pointed. Gate G-TAB-1 a b d e. Closes at 4/4 GREEN on the tree, 4/4 RED on
   main.
2. **The paper, both schemes.** The literal pair per block, presentation attributes as the light fallback.
   Gate G-TAB-1c + G-TAB-2's tile rows. Closes at rgb(17,15,14) under dark both engines with the core median
   ≥ 12, vs main's 64/64 cream.
3. **The weight, measured on both engines.** Gate G-TAB-2 whole. Closes at coverage ∈ [0.18, 0.32],
   max/median ≤ 1.25, stroke/H ∈ [0.15, 0.17], apertures ≥ 3 px, fraction ≤ 0.36 with count ≤ main's.
   The 16 × 16 DPR1 cell is framed FIRST; if the 2 px round-capped line reads grey on either engine's tab
   path the ONE lawful cure is the stroke rung 4 → 4.5 (0.188 H, still under main's 0.20 mean) with the
   window re-stated and the rung named—never a filter, never a hinted second glyph.
4. **The touch icon.** `apple-touch-icon.png` 180 square from the same SVG via `scripts/icons.mjs` (sharp
   resolved transitively, header says so; local `--check` re-rasters and compares decoded pixels). Gate
   G-TAB-1e + G-TAB-2 at 180. Closes at 200 on the built dist; the edge's 200 is W8's row.
5. **The self-test.** `lint:favicon --self-test` P1–P6 + the ci.yml step. Closes at 6/6 plants RED, clean
   GREEN, `check-copy-register` bare 0.
6. **π and budgets.** G-TAB-3. Closes at 0 paint deltas both engines both themes, filter census 9 = control,
   a `dist/` diff of 2 lines + 2 files.
7. **The ballot frames** (§5), both arms of both ballots BUILT on the tree (arm B one attribute; arm P a
   fontTools instance of the Fraunces subset at opsz 52—host `python3` has fontTools 4.62.1 and the census
   already cut opsz 52 from `fraunces-subset.woff2`), framed as lawful pairs on one contact sheet with main
   as control, each arm's G-TAB-2 numbers printed beside it (LAWS P5: a loss is named with both numbers).
8. **The ladder, AFTER the re-look** (not this slice): `/favicon.ico` 16+32, `/icon-32.png`,
   `/manifest.webmanifest` + 192/512 (`purpose: any`), the `<link>`s; G-TAB-4 grows a row per path.
   Lands only once the owner has disposed the hand—five committed rasters of an undisposed glyph is waste.
9. **Safari, stated.** The unwitnessed cells as rows in the return (whether Safari's tab shows `icon.svg`,
   honours the in-SVG query, what its overview paints), the light-arm fallback reasoning as the design's
   answer until the owner's own Safari re-look (M19; no `open -a`, no osascript).
10. **Sibling cuts framed** (crop 4): Fable's 16 × 25 and Opus's 23 × 22 beside the shipped cut with
    their G-TAB-2 rows; the critic (non-author) reads genericness at 16 and 32.

### Crossings

- **MOT-VERB** (`DarkModeToggle.vue`'s owner), OPTION, framed not defaulted: on flip, set
  `meta[name=theme-color]` to the page's paper so Safari/Android chrome follows the toggle, and mint the
  two static metas in the same commit. One line, no motion, `src/`; theirs because the file is theirs. If
  they decline, no theme-color ships at all.
- **W8 (the seal):** `npm run deploy` carries `/icon.svg` and `/apple-touch-icon.png`; the post-deploy pass
  curls both at the edge (200, content types) and reads the etag change; `/favicon.svg` 404 is expected.
- **Every palette-moving family (ACC-FIVE, ACC-SIX, ACC-GRAPHITE, PAL-WALK, PAL-TIN):** a diff that moves
  `:root` or `.dark` `--color-background`/`--color-foreground` re-cuts `icon.svg` in the same commit;
  `lint:favicon` (c) reds otherwise. The ruling lands with its enforcing config.

## 5 · Ballots (loop-local labels; the chair mints the T9-B ids after reading `LEDGER.md`'s roster, A.4)

**B-FAV-1 · the hand.** One variable: which s. Arm W (DEFAULT): WRITTEN—§2.1's monoline s at the digit's
line. Arm P: PRINTED, LIGHTER—the wordmark's own Fraunces at the pinned opsz 52, wght instanced so its
skeleton median at 32 lands in G-TAB-2's window (the lane finds the wght, ~500–600; if the subset can't be
instanced, opsz 52 at wght 900 from the census's `ref-opsz52.svg` with the reason stated), same paper,
same ink, same square, no filter. Cost of P: a filled serif glyph in a square is the web's default favicon
and answers "too thick" but not "our design language" as the marks file glosses it (the house hand);
its thin joins at 16 are under a pixel. Cost of W: at 16 DPR1 a 2 px line antialiases to grey where a
Black glyph stays black. Why it's the owner's: CTRL-FACE's law can be read either way—the wordmark is
PRINTED on the page, so the tab could carry the printed initial. Firing default on silence: W.

**B-FAV-2 · the pen's width.** One variable: `stroke-width`. Arm A (DEFAULT): 4 units = 2.00 px at the
tab (the board's given pen on the pixel grid; mass ≈ 0.21). Arm B: 5 units = 2.50 px ("a bit" read
literally; stroke/H 0.208, OUTSIDE the digit's window, mass ≈ 0.26). Framed at 16 and 32, light and dark
strips, one crop. Firing default on silence: A.

**REFUSED** (not a ballot): Fable's "no dark tile" arm—light ink alone reads 1.11–1.18:1 on any light
surface that ignores the query; painted AA on both themes forbids it.

## 6 · Gaps and risks (a gap is a gap)

- **Every proposal number is a proxy.** The census read the `<img>` path in two headless engines; both
  auditions read librsvg. Neither is Chrome's favicon service nor Safari's icon database. The 2.0 px line
  at 16 DPR1 is the most exposed claim; row 3 names the one cure.
- **The shipped cut is unbuilt.** The 20 × 24 merge exists as a law and an arithmetic prediction (ADJ ink
  fraction ≈ 0.21), not as a path anyone has rastered; both auditioned cuts are framed beside it so the
  re-look can't be starved if the merge disappoints.
- **Safari and Android are unwitnessed** (M19): SVG favicon support, the in-SVG query, the tab overview,
  Android's use of the touch icon without a manifest.
- **The scheme mismatch is real and declared**: the icon follows the OS, the page follows its class. The
  icon half would be a `<link>` href swap in `App.vue` on the toggle—a mechanic W2 didn't land, not in this
  spec; the owner may ask for it.
- **The fringe rate rises** (0.28 → ~0.34 at 16 DPR1 light on the proxy) while the count falls (49 → ~31):
  a line has more edge per ink than a Black glyph. Bounded both ways, printed, and the ballot tells the
  owner if arm A trips the §2.11 slack.
- **`sharp` is undeclared.** The raster script rides a transitive; a wrangler/miniflare bump can move or
  drop it. The fold decides whether to declare it (a lockfile act) or vendor the PNG with its sha only.
- **Genericness at 16.** Below 32 the hand's asymmetries are about a pixel; what carries the house at 16
  is the pen, the paper and the ink. Opus's own reading of Opus's design; row 10 gives it a non-author eye.
- **Chrome's favicon-store staleness** is the census's reading, not a witnessed stale tab; the rename is
  cheap insurance either way.
- Nothing here retires T9-M22. The owner disposes at the re-look.
