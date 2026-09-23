# G-FAVICON · Opus · the tab mark (T9-M22)

The owner's words: "the favicon s, which is a bit too thick and needs to reflect our design language
more." Designed against MAIN `1d0dc4fd` (product `74a2b5d9`), grounded in `census/favicon/README.md`.
This is a design with one scratch audition behind it, not a prototype: no source moved, no server bound,
no port used. The audition rasters are **librsvg (sharp), not a browser engine**. I ran the same recipe
on HEAD's `favicon.svg` and it lands on the census's Chromium DPR1 row (coverage 0.524 vs 0.521, core
median 16.16 vs 16.08, fraction under 4.5 0.280 vs 0.289), so it's a fair like-for-like proxy. It
doesn't stand in for either engine's `<img>` path or either browser's tab rasteriser (§12). The
frontend-design skill's two passes were run: plan, review against the tells, then specify.

## 0 · The memorable thing

**The tab is written with the board's pencil.** The s is one open monoline stroke with round caps and
round joins, `fill: none`, which is the exact pen `HandwrittenGlyph.vue:302-310` writes every digit with.
It paints **2.00 CSS px** in a 16 px tab, the board's given-digit pen (2.13 px at 1280×800, census)
rounded to the tab's pixel grid. It's written in the page's own ink on the page's own paper, and it
turns to the dark paper when the browser is dark. There's no filter and no type outline. The hand is in
the path, not in a noise field.

Everything else below is the floor under that one line.

## 1 · What the census says the owner saw

- **"Too thick" is absolute, at tab size, not a proportion.** Today's glyph is Fraunces **wght 900 at
  opsz 9**, the heaviest and widest master. It's blown up to fill **90.5 % of the tile's height** and
  covers **52 % of the tile** with ink. The stroke has a **5.8–6.3 px spine at 16 px** (0.40 of glyph
  height) against a 2.57 px median. Against the house pencil line, its mean is 1.4× and its spine 2.6×.
  Its proportion sits inside the wordmark's painted band. The wordmark is a 112 px masthead, so the
  same proportion reads as weight at 16 px.
- **"Our design language" is missing in four places.**
  1. The only pencil gesture is an `feDisplacementMap` at 34× the wordmark's frequency and 1/14 of its
     amplitude. Chromium rounds it away (Δcoverage max 0.036). WebKit smears it into **blur** (σ
     0.35–1.0 device px, core contrast 16.08 → 15.19).
  2. The ink `#1a1a1a` and the tile `#faf8f5` are literals, not the page's `#0a0a0a` / `#fbfaf9`.
  3. There's no dark variant. The cream tile is **the brightest object on a dark strip** (15.19:1).
  4. The paper doesn't turn at all: `[250,248,245]` in all 64 rows.
- **The decided history already ruled this class.** The digits carry **zero live filters**, because "the
  bake could not reproduce the tooth at glyph scale and SSIM ranked unfiltered closer than baked in all
  four engine×theme cells" (R6-census, `HandwrittenGlyph`, G2.4 ruled C). A 16 px tab glyph is below
  glyph scale. The favicon's filter breaks a law the house already holds.

## 2 · Pass 1: the plan, and what the review changed

**Palette (no new colour; four of the page's own tokens, painted values).**

| role | light | dark | source (`src/assets/index.css`) |
|---|---|---|---|
| paper (tile) | `#fbfaf9` | `#110f0e` | `--color-background` `hsl(48 15% 98%)` :134 / `.dark` `hsl(24 8% 6%)` :363 |
| ink (the pen) | `#0a0a0a` | `#edece9` | `--color-foreground` `hsl(0 0% 3.9%)` :135 / `.dark` `hsl(48 10% 92%)` :364 |

The ink is the given digit's ink (`HandwrittenGlyph.vue:83`, `var(--color-foreground)`). Graphite
(`--grid-line-color`, `#262626`) was considered and dropped, because the pen writes digits in the
foreground, not in the grid's graphite. One ink per pen.

**Type.** None. The tab mark isn't set in a face any more. It's written.

**Layout.** One 32-unit tile, `rx 6` (today's radius, kept: it isn't the complaint). One stroke, centred
optically. The ink box is **23 × 22 units (72 % × 69 %)**, down from 29 × 26.3 (82 % × 90.5 %).

**Principles.** (1) The pen is the digits' pen: monoline, round caps, round joins, no fill. (2) The hand
is in the geometry: the path is asymmetric (lower bowl wider than the upper), the spine leans, and the
tail ends in the house 5's upturn (`glyphPaths.ts` "5"[0]: `…C18,52 10,46 10,44`). (3) There are no
filters at tab size (R6 G2.4). (4) The tile is the page's paper in both themes. (5) Whole pixels at the
tab: the pen and every extremum sit on the 16 px grid.

**Review against the brief and the tells: four first ideas I rejected, and why.**

1. *Re-cut the Fraunces s at the wordmark's opsz 52, or at a lighter wght.* Rejected. opsz 52 is only
   **−12 % at the median** (census) and keeps the 0.40 spine. A lighter wght keeps the serif's contrast,
   and its thin joins fall under 1 px at 16 (unbuilt; the adjudicator can price it). Either way the tab
   stays a typeset letter. The owner asked for the pencil.
2. *Keep the wobble, re-scaled to the wordmark's frequency and amplitude.* Rejected. At 16 px the
   wordmark's 0.029 em peak is **0.46 px**, still below one pixel, and WebKit still blurs any filtered
   favicon (census: σ at every size). A filter can't paint pencil at tab size. A hand-drawn path can.
3. *An s written inside a hand-drawn board cell (a box around the letter).* Rejected: Chanel's
   accessory. At 16 px a frame eats about 3 px of the 16 and fights the s for the same pixels. The cell
   is the board's. The tab only needs the pen.
4. *My first stroke (4.26 units, unhinted, a tall S).* The review caught two problems. It read as a
   capital S in a stock rounded sans, and 34 % of its keyed pixels were fringe. The cut is squat with
   lowercase proportions, and its pen and extrema are hinted to whole pixels at 16 (4.00 units; top
   `y 6`, bottom `y 24`, upper-left `x 10`, lower-right `x 26`). That brought the fringe fraction down
   0.366 → 0.341 in light and 0.310 → 0.286 in dark (librsvg, 16 px).

## 3 · Tokens (values; the file is its own home)

An SVG favicon is a standalone document. It can't read the page's custom properties, so the four
colours are **copies held true by a gate** (§8 G-TAB-1c). They don't get a second home: a lane that
moves `--color-background` or `--color-foreground` re-cuts `icon.svg` in the same commit, or the gate
reds.

| token | value | note |
|---|---|---|
| pen width | `4` (of 32) = **2.00 CSS px** in a 16 px tab at any DPR | the board's given pen is 2.13 px at 1280×800; rounded to the tab's pixel grid |
| caps / joins | `round` / `round` | `HandwrittenGlyph.vue:308-309` |
| ink box | 23 × 22 units, centred (painted centroid 0.515 x / 0.517 y) | 72 % × 69 % of the tile |
| tile | 32 × 32, `rx 6` | today's radius |
| light | paper `#fbfaf9`, ink `#0a0a0a` | 18.99:1 painted core |
| dark (`@media (prefers-color-scheme: dark)`) | paper `#110f0e`, ink `#edece9` | 16.18:1 painted core |
| touch icon | 180 × 180, **`rx 0`** full-bleed paper, light only | iOS masks the corners itself |

**The file, whole (507 B raw, 354 B gzip; today's is 1,961 / 954):**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><style>rect{fill:#fbfaf9}path{stroke:#0a0a0a}@media(prefers-color-scheme:dark){rect{fill:#110f0e}path{stroke:#edece9}}</style><rect width="32" height="32" rx="6"/><path d="M24.4,10.2 C24.2,7.6 21.4,6 17.8,6 C13,6 10,7.8 10,10.5 C10,13.3 13.2,14.1 16.8,14.8 C22,15.8 26,17.1 26,19.9 C26,22.8 21.6,24 16.6,24 C11.8,24 8.4,22.6 7.1,20.2 C6.8,19.8 6.9,19.3 7.5,18.9" fill="none" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
```

The path is in the glyph grammar (`glyphPaths.ts`: one open `M` then cubic `C`s, drawn in stroke
order). It starts at the top-right terminal, runs over the top bowl, down the leaning spine, round the
wider lower bowl, and ends in the 5's upturn. Because it's in that grammar, a later `"s"` entry in
`glyphPaths` can reuse it verbatim (not in scope).

## 4 · Components and states

| piece | what lands | states |
|---|---|---|
| `public/icon.svg` (NEW) | the file above | light (default) · dark (`@media`). Nothing else: no hover, no animation |
| `public/favicon.svg` | **DELETED** | — |
| `public/apple-touch-icon.png` (NEW) | 180 × 180 raster of the same path, `rx 0`, light paper; palette PNG **2,858 B** (my librsvg render) | light only (§5) |
| `index.html:15` | `<link rel="icon" type="image/svg+xml" href="/icon.svg" />` plus `<link rel="apple-touch-icon" href="/apple-touch-icon.png" />` | — |

**Why rename rather than overwrite.** Chrome's favicon store is keyed by page URL and outlives the HTTP
cache (census, `_headers:137-145`, edge `max-age=14400`). The same href could sit stale in the owner's
own tab at the re-look. A new path is the one reliable cache bust, and it costs nothing.

**Scheme mismatch, both ways (why the tile stays).** The in-SVG `@media` follows the browser's colour
scheme, and the tab strip may not agree with it (a dark browser theme on a light OS). With a tile, the
ink always sits on its own paper at ≥ 16:1, so the mismatch is just a visible card:

| strip | light icon | dark icon |
|---|---|---|
| light active `#ffffff` | tile 1.04:1, the s floats | a dark card, s 16.2:1 on it |
| dark strip `#202124` | a cream card (today's look, not a regression) | tile **1.19:1**, the s floats at **13.6:1** vs the strip |

Dropping the tile would put ink on the strip itself, and a mismatch would then paint dark ink on a dark
strip. The census says a dark variant has to invert, not drop. The tile is what makes the inversion
safe.

## 5 · Phone and desktop · light and dark

- **Desktop** (Chrome, Firefox, Safari tabs, bookmarks, history). One SVG at 16 CSS px; DPR 2 rasters
  it at 32 device px from the same vector, so the pen is 2.00 CSS px on every display. Light and dark
  come from the one file.
- **Phone.** The home screen, Safari favourites and the share sheet read `apple-touch-icon.png`, where
  iOS shows a monogram or a screenshot today (census: `/apple-touch-icon.png` answers 404). At 180 px
  the hand is legible: the upturned tail, the leaning spine and the unequal bowls (crop c1, column 4).
  Tab overviews read the SVG.
- **Dark on phone.** The touch icon is light paper only. iOS web clips have no dark variant hook I can
  witness (§12), and a light paper square is the page's own first paint.
- **PRM, pointer class.** Neither applies. The mark doesn't move and can't be touched. Pointer is
  n/a on every crop.

## 6 · Copy (M16)

**Zero new strings.** `<title>sudoku</title>` and the `og:` block are untouched. The SVG carries no
`<title>` (a favicon's name is the page's title). `check-copy-register` runs bare and must read 0 new
findings.

## 7 · Motion

**None, by design.** The mark is still. An animated favicon (SMIL or a script-swapped href) would be a
perpetual repaint in the browser's chrome that serves nobody, and a boil in the tab would compete with
the page's own. **No MOTION rung is consumed and no literal is minted.** The ratified drawer curve, the
boil beat and every band are untouched. PRM has nothing to cut.

## 8 · Born-RED gates it lands with

**G-TAB-1 · `lint:favicon` (node, browserless, CI).** Per O-12, CI is browserless, so this is a
source gate: `scripts/check-favicon.mjs --self-test`, one line in the ci.yml lint lane beside
`lint:theme-tokens`. It needs no raster dependency (sharp is only transitive, via miniflare).
- (a) No `<filter`, `feTurbulence`, `feDisplacementMap` or `clip-path` in `public/icon.svg`. **HEAD RED**
  (`favicon.svg:3-6,12-13`).
- (b) Exactly one `<path>`: `fill="none"`, `stroke-linecap="round"`, `stroke-linejoin="round"`,
  `stroke-width` ∈ [3.6, 4.4] of the 32 viewBox. No `opacity`, `stroke-opacity` or `filter` anywhere.
  **HEAD RED** (a filled outline, no stroke).
- (c) Palette truth. The light `rect`/`path` colours equal the painted hex of `:root`'s
  `--color-background`/`--color-foreground`. An `@media (prefers-color-scheme: dark)` block exists and
  its colours equal `.dark`'s pair, parsed from `src/assets/index.css` with `check-theme-tokens`' HSL
  reader. The ink-over-paper ratio computed from those tokens is ≥ 7:1 in each theme. **HEAD RED**
  (`#1a1a1a`, `#faf8f5`, no `@media`).
- (d) Occupancy. The exact cubic-extrema bbox of the path, inflated by half the pen, is within
  [0.62, 0.80] of the tile on each axis. **HEAD RED** (0.905 height).
- (e) Hrefs. `index.html` links `/icon.svg` and `/apple-touch-icon.png`, both exist in `public/`, the
  PNG's IHDR is 180 × 180, and `public/favicon.svg` is absent. **HEAD RED.**
- **Self-test plants (each must RED its clause):** P1 HEAD's `favicon.svg` verbatim → a, b, c, d · P2
  ink `#1a1a1a` → c · P3 `stroke-width="6"` → b · P4 `@media` block deleted → c · **P5 FAINT INK**
  (`stroke-opacity="0.15"`, and separately ink `#e8e6e3` on the light paper, about 1.2:1) → b and c.
  P5 carries Addendum A.5's law 3: existence isn't visibility. A pen at 1.2:1 must not pass.

**G-TAB-2 · the painted instrument (local, not CI; two engines × both themes).** The census's own
recipe (`census/favicon/instruments/shoot.mjs` + `analyze.py`): the `<img>` path at 16 CSS (DPR 1 and
2), 32, 48 and 180; `colorScheme` emulated light and dark; **two bare photographs per cell, the minimum
of the two**, byte-identity stated. HEAD and the lane each photograph their own file on one strip page.

| row | closes at | HEAD (census) | the proposal (librsvg proxy) |
|---|---|---|---|
| ink coverage of the tile | ∈ [0.20, 0.32] every cell | 0.520–0.527 **RED** | 0.250–0.254 light · 0.248–0.252 dark |
| monoline: skeleton max ÷ median at 32 and 180 device px | ≤ 1.25 | 2.25 / 2.25 **RED** (11.60/5.15) | 1.12 / 1.05 (4.47/4.00, 4.16/3.98) |
| dark scheme paints the dark paper | tile = `rgb(17,15,14)` under dark | `[250,248,245]` in 64/64 **RED** | `#110f0e` |
| WebKit ≡ Chromium (no filter blur) | glyph core median Δ ≤ 0.5 at 16 DPR1 | 15.19 vs 16.08, Δ 0.89 **RED** | unfiltered by construction; to read |
| glyph-text statistic (§2.11), core median | ≥ 12 both themes | 16.08 | 17.82 light · 15.17 dark (16 px) |
| same, fraction under 4.5 at 16 DPR1 | **stated**; ≤ 0.36 **and** the absolute count of sub-4.5 keyed pixels ≤ HEAD's | 0.289 chromium · 0.382–0.385 webkit | **0.341 light** (31 of 91 px) · 0.286 dark (26/91); HEAD on the same proxy 0.280 (49 of 175) |
| paper stays one region at 16 DPR1 (nothing fills in) | 1 connected background region | two 2 px counter slits | 1 (an open stroke has no closed counter) |

**The fraction row is a trade, and I'm stating it rather than hiding it.** A thinner line has more edge
per unit of ink. So the *fraction* of fringe pixels rises (0.280 → 0.341 in light on the proxy) while
the *count* of fringe pixels falls (49 → 31), because there's half the ink. The gate bounds both. The
whole-pixel hinting is what keeps the fraction under the ceiling; the unhinted cut read 0.366.

**G-TAB-3 · π.** The favicon is never painted in the document. The lane shows a paint-property census
(MRK-LIVE's 16-property, whole-document form) of lane dist against HEAD dist with **0 deltas**, both
engines and both themes. The `dist/` diff is limited to `index.html`'s two `<link>` lines and the three
`public/` files. The filter census holds: light 9 on both arms, dark equal to the control's. The
favicon's filter was never in the document, so deleting it moves neither number, and nothing grows.

**G-TAB-4 · copy.** `check-copy-register` bare: 0 new findings.

## 9 · Pass-7 charter rows

No family owns the surface (the marks file says so). **I propose minting `TAB-PEN`**, a one-section
family under a new **W7 §16 "The tab mark" (T9-M22)**, one lane, one tree. The whole diff lives in
`public/`, `index.html`, one script, one `package.json` line and one ci.yml line, and **touches no file
any live family's tree touches**. It can land as a clean fold pick at any point in the stack, so it
doesn't need to wait on the §10 hand merge. The format is: what the lane lands · the gate · the number
that closes it.

**TAB-PEN (mint)**
1. **The pen.** Land `public/icon.svg` as §3's file, delete `public/favicon.svg`, and re-point
   `index.html:15`. Gate: G-TAB-1 (a)(b)(d)(e) GREEN on the lane and RED on HEAD. Closes at 4/4 GREEN ·
   4/4 RED on HEAD.
2. **The paper in both themes.** The `@media` block with the painted token pair. Gate: G-TAB-1 (c) plus
   G-TAB-2's dark row, both engines. Closes at the tile `rgb(17,15,14)` under dark with a core median
   ≥ 12, versus HEAD's 64/64 cream.
3. **The weight, measured.** Gate: G-TAB-2's coverage, monoline and glyph-text rows in Chromium and
   WebKit, DPR 1 and 2, 16/32/48/180, two photographs each, minimum of the two. Closes at coverage
   ∈ [0.20, 0.32], max/median ≤ 1.25, the fraction ≤ 0.36 with a count ≤ HEAD's (this proxy's numbers
   are predictions until the engines read them).
4. **The touch icon.** `public/apple-touch-icon.png`, 180, `rx 0`, rendered from the same path. Its
   provenance (the render command and the SVG's sha) goes in the lane README. Gate: G-TAB-1 (e) plus
   G-TAB-2 at 180. Closes when the edge answers 200 on `/apple-touch-icon.png` (404 today) after the
   next deploy, which is an owner row.
5. **The self-test.** `lint:favicon --self-test` with plants P1–P5, each RED on its clause, and the
   ci.yml line. Closes at 5/5 plants RED, the clean file GREEN, and `check-copy-register` 0.
6. **π and budgets.** G-TAB-3. Closes at 0 paint deltas both engines both themes, filter census 9 =
   control, and a `dist/` diff of 2 lines plus 3 files.
7. **The ballot frames** (§10). A lawful pair on the owner's surface: both arms at 16 and 32 device px,
   light and dark strips, one crop, only the pen width differing between them.

**Cross-family watch row (every family that moves the palette: ACC-FIVE, ACC-SIX, ACC-GRAPHITE,
PAL-*).** A diff that changes `:root` or `.dark` `--color-background`/`--color-foreground` re-cuts
`public/icon.svg` in the same commit. `lint:favicon` (c) reds otherwise. This follows the house rule
that a ruling lands with its enforcing config.

## 10 · Ballots (U-10; loop-local labels, the chair mints ids)

- **B-TAB-1 · the pen's width.** Arm A: **4.0 units = 2.00 px at the tab** (the firing default: the
  board's pen on the tab's pixel grid, mass 0.25). Arm B: **5.0 = 2.50 px** ("a bit" read literally:
  median parity with HEAD's 5.15, only the spine and the mass fall; mass about 0.31, which is arithmetic
  and unbuilt). Framed per charter row 7. The owner disposes at the re-look.
- **Scope, for the adjudicator rather than the owner.** I left out `/favicon.ico`, the PNG 16/32 ladder,
  a web manifest with 192/512, `mask-icon` and `theme-color`. The mark names the s, not the estate. The
  census prices each one (about 1–2 KB ICO; manifest about 10 KB palette). `theme-color` is the one
  I'd admit first, because it tints Safari's and Android's chrome to the paper, which is design
  language. It's still outside M22's words.

## 11 · What DIES

- `public/favicon.svg` whole, 1,961 B: the Fraunces **wght 900 / opsz 9** filled outline, the
  `feTurbulence`+`feDisplacementMap` wobble (a no-op in Chromium, blur in WebKit), the redundant
  `clipPath`, and the `#1a1a1a`/`#faf8f5` literals that drifted from the page's tokens.
- The idea that a filter makes a pencil at tab size, already ruled for the digits (R6, G2.4 C). It now
  holds for the tab too, and `lint:favicon` (a) enforces it.
- The single scheme-blind icon link. It becomes one scheme-aware SVG plus the touch icon.

## 12 · Gaps (a gap is a gap)

1. **No browser engine read this design.** Every proposal number is librsvg via sharp. The recipe
   reproduces HEAD's Chromium DPR1 census row to within 0.01 on coverage and core, but WebKit's
   `<img>` path, and both browsers' real tab rasterisers, are unread (census gap 1 carries over). TAB-PEN
   row 3 is where they get read.
2. **In-SVG `prefers-color-scheme` in the tab** is unwitnessed. I believe Chromium and Firefox honour
   it in favicons, but I haven't read that on this box. Safari's tab isn't witnessed at all, whether
   it shows `icon.svg` or honours the `@media` (M19: no Safari, no osascript). The touch icon is
   Safari's raster fallback for favourites. Whether it also covers Safari's tab is unverified.
3. **Android.** Whether Chrome for Android uses the SVG, the touch icon or neither for its tab switcher
   and home screen (without a manifest) is unwitnessed.
4. **The fringe fraction worsens** (0.280 → 0.341 in light on the proxy) even though the fringe count
   falls. If the chair reads §2.11's "control + slack" as the fraction alone, arm A fails it at any
   slack under 0.061, and the ballot must say so to the owner.
5. **Genericness at 16 px.** Below 32 px the hand's asymmetries (the tail's upturn, the lean, the
   unequal bowls) come to about a pixel, so at 16 the mark reads as a clean monoline s. What carries
   the house language at 16 is the pen's weight and caps, the paper and the ink. The hand shows from
   32 up (crop c1). This is my own reading of my own design, and it needs a non-author eye.
6. **The touch icon has no dark arm,** and whether iOS darkens web-clip icons in its dark home-screen
   mode is unwitnessed.
7. **The PNG can drift from the SVG in CI.** G-TAB-1 checks the PNG's size and presence, not its
   pixels, because CI is browserless with no raster dependency. The lane README's provenance line plus
   a local re-render diff is the only check.
8. **The rename's cache-bust claim** rests on the census's reading of Chrome's favicon store, not on a
   witnessed stale tab.

## Crop (1 of 4 allowed)

- `opus-c1-head-vs-pen-librsvg-light-dark-tile16-32-48-180-pointer-na.png` (21.6 KB). **Renderer
  librsvg (sharp), not a browser engine.** Rows: HEAD `favicon.svg` on the light-inactive strip
  `#dee1e6` · the proposal (light) on `#dee1e6` · the proposal (dark scheme) on the dark strip
  `#202124`. Columns: tile 16 (×8, nearest) · 32 (×4) · 48 · 180 (downscaled to 128). Viewport n/a (a
  tile, not a page) · pointer n/a. One payload: the same path in every proposal cell. HEAD and the
  proposal differ in everything the mark names (weight, filter, palette, dark), so this is a
  before/after pair, not a ballot pair. The ballot pair is TAB-PEN row 7.
