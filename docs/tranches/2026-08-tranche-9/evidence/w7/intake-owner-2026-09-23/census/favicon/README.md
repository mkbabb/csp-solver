# census:favicon — T9-M22 "the favicon s, which is a bit too thick and needs to reflect our design language more"

Main tree `1d0dc4fd` (src/public/index.html byte-identical to HEAD, `git diff --stat` empty), read-only.
Two servers on 127.0.0.1:4252, one after the other, each killed by recorded PID and the port read free:
a scratch `http.server` for the favicon strip page (PID 99170), then vite dev on the main tree for the
wordmark (listener 4394, npx 4370; config `instruments/vite-census-favicon.mts`, cacheDir in the lane's
scratchpad, not the tree). No Safari, no osascript. Owner's :3001 untouched. Instruments under
`instruments/`; the 64-row raster census is summarised in `instruments/favicon-census-summary.tsv`.

## Numbers first

**What ships.** `public/favicon.svg` (1,961 B raw, 954 gzip, 844 br) is one filled glyph — **Fraunces
wght 900 at opsz 9**, the axis minimum and the heaviest, widest caption master. The path matches the
subset's own `s` at `{wght 900, opsz 9}` coordinate for coordinate (half-scale, y flipped; the file adds
no-op `L` segments). The wordmark paints the same face at **opsz 52**, pinned
(`HandwrittenLogo.vue:422`). The glyph sits under an `feTurbulence`+`feDisplacementMap` wobble, ink
`#1a1a1a` on a flat `#faf8f5` rounded tile (rx 6 of 32). `index.html:15` is the only icon link. No
dark variant, no PNG, no touch icon, no manifest.

**Occupancy (geometry, 1024 px render, tile units of 32).** The glyph box is 28.97 × 26.34, so it fills
**90.5 % of the tile's height and 82 % of its width**. Ink covers **52.2–52.7 % of the tile** at every
size, engine and DPR (0.520–0.527). The same s cut at opsz 52 covers 0.471–0.480 (−9 %).

**Stroke weight.** The metric is 2 × the distance transform along the skeleton of the ≥ 50 %-coverage
ink, in CSS px. "area/len" is ink area over skeleton length.

| size | geometric median / mean / spine max | painted chromium DPR1 · DPR2 (median / mean / max) | painted webkit DPR1 · DPR2 |
|---|---|---|---|
| 16 | 2.57 / 3.21 / 5.80 | 2.83/3.56/6.32 · 2.83/3.49/6.32 | 4.00/3.64/6.00 · 3.00/3.37/5.83 |
| 32 | 5.15 / 6.41 / 11.60 (area/len 7.56) | 5.66/6.98/12.65 · 5.52/6.71/11.66 | 5.66/6.81/12.00 · 5.00/6.57/11.66 |
| 48 | 7.72 / 9.62 / 17.4 | 8.00/9.93/17.20 · 8.00/9.80/17.69 | 8.12/9.98/17.20 · 8.00/9.68/17.49 |
| 180 | 28.95 / 36.07 / 65.2 | 27.86/33.93/64.50 · 26.31/32.16/65.51 | 29.53/36.61/65.30 · 27.86/35.37/65.07 |

As a fraction of the glyph's own height, the stroke is **0.178 median, 0.221 mean, 0.40 at the spine**.
At 16 px the counters are 2 px slits: 4 px of paper in the 14.5 px centre column at DPR1, and 9–11
device px at DPR2. They stay open in both engines (valley coverage 0.000–0.027).

**Against the house hand, at like size.** Photographed on the page (1280×800, both engines, both
themes, DPR 1 and 2, baked pose stack, `sudoku`). The wordmark box is 111.92 CSS px tall and its `s`
is 49–52 px. At its own size the s strokes read median 8.25–8.94, mean 10.66–11.31, area/len
11.80–13.00. **Scaled to the favicon's 32 px ink height** (×0.557–0.591) the s reads:

| reading at 32 px | median | mean | area/len | stroke/height median · mean |
|---|---|---|---|---|
| favicon.svg (opsz 9, geometry) | 5.15 | 6.41 | 7.56 | 0.178 · 0.221 |
| same s at opsz 52 (geometry) | 4.58 | 5.86 | 6.90 | 0.162 · 0.207 |
| wordmark s as painted, 8 cells | 4.76–5.29 | 5.94–6.69 | 6.58–7.68 | 0.164–0.183 · 0.205–0.231 |

**"Too thick" isn't a departure from the wordmark's proportion.** The favicon sits inside the
wordmark's painted band on every reading. Its opsz-9 cut is 12 % heavier at the median (10 % per glyph height) and 9 % heavier
at the mean than the opsz the wordmark pins. The wordmark's own wobble bake re-thickens it back to
parity. The thickness is **absolute, at tab size**: a Black-weight display glyph blown up to fill 90 % of
a 16 px tile, with a 5.8–6.3 px spine and 52 % ink. The house **pencil** line is monoline. A given digit is
stroke 5 on a 32-unit ink height, **0.156 H** (user ink 4.5, 0.141 H; `HandwrittenGlyph.vue:88-90`,
viewBox 40×56 at `:302`). It paints 2.13 px at the board's 23.9 px glyph box. Against that line the
favicon's mean is 1.4× and its spine 2.6×.

**The wobble at 16 px** (shipped vs the same file with `filter` removed, same engine and size):

| engine · DPR | px changed | mean abs Δcoverage · max | edge-gradient ratio | best-fit Gaussian σ (device px), rmse best vs 0 | reads as |
|---|---|---|---|---|---|
| chromium · 1 | 2.3 % | 0.0066 · 0.036 | 0.991 | 0 (0.0091 = 0.0091) | nothing — a no-op |
| chromium · 2 | 1.5 % | 0.0057 · 0.036 | 0.992 | 0 | nothing |
| webkit · 1 | 53.9 % | 0.0512 · 0.251 | 0.945 | 0.35 (0.0552 vs 0.0764) | **blur** |
| webkit · 2 | 54.4 % | 0.0793 · 0.496 | 0.908 | 1.0 (0.0751 vs 0.1304) | **blur** |

Chromium's max Δ is 0.036 at 16, 32 and 48 alike. It first reads as edge texture only at 180 (2 % of
pixels, gradient ratio 1.015–1.022). WebKit fits blur at every size: σ 0.35–0.5 at DPR1 and 1.0 at DPR2,
with rmse falling 28–55 % against the unfiltered raster. Its glyph core median drops 16.08 → 15.19.
**In neither engine does the displacement read as pencil texture at tab size.**

**Contrast.** Flat, ink `#1a1a1a` on the tile is **16.42:1**. Glyph-keyed painted (P5 statistic,
two bare photographs each, both byte-identical, Δ 0): the core median is 16.08 in chromium at every size
and 15.19 in WebKit at 16 px (16.08 at 32 and up). The keyed fraction under 3.0 at 16 px DPR1 is 0.202
in chromium and 0.291–0.295 in WebKit (AA fringe; WebKit's is blur-widened). Under 4.5 it's 0.289 and
0.382–0.385. The tile against the tab (Chrome's default strip values, approximated):

| strip | tile on strip | the tile reads |
|---|---|---|
| light active `#ffffff` | 1.06:1 | gone — the glyph floats |
| light inactive `#dee1e6` | 1.24:1 | a faint card |
| dark active `#35363a` | 11.38:1 | **a bright cream card** |
| dark strip `#202124` | 15.19:1 | **the brightest object on the strip** |

The painted tile is `[250,248,245]` in all 64 rows: `prefers-color-scheme` changes nothing, because the
file has no `@media`. Dropping the tile in dark would leave ink `#1a1a1a` at 1.08–1.44:1 on the strip.
A dark variant has to invert, not drop.

**Palette drift.** The favicon's ink `#1a1a1a` is `COLORS.outlineBlack` (`pencilConfig.ts:27`), not the
page's `--color-foreground` `hsl(0 0% 3.9%)` = `#0a0a0a` (`index.css:135`), which paints the wordmark at
`rgb(10,10,10)`. The tile `#faf8f5` (hue ≈ 36°) is not the page's paper `hsl(48 15% 98%)`, painted
`rgb(251,250,249)` (`index.css:134`); tile vs paper is 1.017:1. Dark paper is `rgb(17,15,14)` with ink
`rgb(237,236,233)` (`index.css:363-364`), and nothing in the favicon follows it. The page paper carries
a turbulence tooth (`index.css:311`, opacity 0.18); the tile is flat.

## The mechanism, file:line

- `public/favicon.svg:3-6`: the wobble is written in the glyph's own 1,000-per-em path units, because
  the `filter` sits on the `<g transform="… scale(0.056751)">` (`:13`) and primitives default to
  userSpaceOnUse. `baseFrequency 0.035` gives a wavelength of **0.0286 em**, and `scale 4` gives a peak
  displacement of **0.002 em**. That's 0.057 CSS px at a 16 px tile, with a 0.81 px wavelength. The
  wordmark's wobble (`pencilConfig.ts:349-361`: 0.02 / scale 3 on the 60-unit box, em 52) is a
  **0.96 em** wavelength at **0.029 em** peak. The favicon's noise is 34× the frequency and 1/14 the
  amplitude of the wordmark's. It isn't the wordmark's wobble scaled down. It's sub-pixel noise that
  Chromium rounds away and WebKit's filter pass smears into blur.
- `public/favicon.svg:14`: the glyph is the variable font's default instance (opsz 9 = `fvar` default,
  wght 900 = default). The favicon was cut from the default, not from the opsz the wordmark pins
  (`HandwrittenLogo.vue:414-422`).
- `public/favicon.svg:13`: `translate(1.10,29.71) scale(0.056751)` puts a 56.75-unit em in a 32-unit
  tile. The margins are 1.5 units top and bottom and 2.8 left and right: 0.75 px and 1.4 px at 16.
- `public/favicon.svg:11` and `:14`: the tile and ink literals, not the page's tokens (above).
- `index.html:15`: the one `<link rel="icon" type="image/svg+xml">`. No `media`, `sizes`, `apple-touch-icon`
  or `manifest` link.
- `public/_headers:137-145`: the `/*` stanza is the only one the favicon matches, and it carries no
  Cache-Control. The live edge answers `public, max-age=14400, must-revalidate`, etag
  `ea3b5b34…` (curl today, and W8 A3's `edge-live.jsonl:10`). Chrome's favicon store is keyed by page URL
  and outlives the HTTP cache. A redesign under the same href can sit stale in returning users' tabs, so
  renaming the file is the reliable bust.

## What the estate lacks, priced

Live edge, today: `/favicon.ico`, `/apple-touch-icon.png`, `/apple-touch-icon-precomposed.png` and
`/manifest.webmanifest` all answer **404** (78 B text/html). PNG sizes are sharp/librsvg rasters of
today's file (tile made full-bleed for the touch and manifest sizes), palette PNG, then truecolor.

| missing | what it buys | cost |
|---|---|---|
| dark-scheme variant | a dark tile with light ink in dark tab strips. Today the cream card is 11.4–15.2:1 against the strip | +150–250 B `@media (prefers-color-scheme: dark)` `<style>` inside the same SVG (0 requests; Chromium and Firefox honour it in the tab), or a second SVG plus `media` on the link (+1 request, matching scheme only). Safari's tab path for either is unwitnessed |
| apple-touch-icon 180 | iOS home screen, Safari favourites and tab overview. Today iOS shows a letter monogram or a screenshot, and requests the 404 path by default | 2,587 B palette / 6,562 B truecolor, plus one `<link>`. Must be full-bleed square (iOS masks the corners), so the rx 6 tile can't be reused as is |
| PNG ladder 16/32 (+ `/favicon.ico`) | engines and tools without SVG-favicon support, plus the default `/favicon.ico` probe (feed readers, some unfurlers) | 399 / 674 B palette (655 / 1,277 truecolor). An ICO holding 16+32 is about 1–2 KB |
| web manifest + 192/512 | Android add-to-home and install. `theme_color` / `background_color` for the splash | ~300 B JSON + 2,850 B (192) + 7,348 B (512) palette (7,046 / 21,647 truecolor), plus `<link rel=manifest>`. `manifest-src` falls to `default-src 'self'`, so no CSP change. `.webmanifest` may want a Content-Type line in `_headers` |
| mask-icon | legacy Safari pinned tabs (deprecated since Safari 12, which uses the favicon) | ~1 KB monochrome SVG plus one link. Near-zero value today |
| `theme-color` meta, light/dark | tints Safari's and Android's chrome to the paper | 2 `<meta>` with `media`, ~150 B |

## Crops (3 of 4)

- `f1-contact-sheet-…png`: chromium and webkit · DPR 1 and 2 · light-active (`#fff`) and dark strip
  (`#202124`) · 16/32/48 px · fine pointer. Nearest-magnified per cell (magnification varies by cell).
- `f2-weight-at-32-…png`: chromium · light · DPR2 · fine. favicon.svg at 32 | the same s at opsz 52 |
  the wordmark's s from the page, scaled to the same ink height.
- `f3-wobble-at-16-…png`: chromium and webkit · light-active · DPR1 · fine · 16 px ×10. Shipped vs
  filter removed. Chromium's pair is indistinguishable and WebKit's shipped cell is visibly softer.

## Gaps (a gap is a gap)

1. **Not the browsers' tab rasteriser.** Every reading is the `<img>` path at the tab's CSS size and
   DPR. Chrome and Safari rasterise the favicon through their own favicon pipeline (Chrome's favicon
   service, Safari's icon database), and neither is witnessed. Safari's tab isn't witnessed at all
   (M19). WebKit headless's `<img>` path is a proxy.
2. **Tab-strip colours are approximations** of Chrome's default light and dark frames, not photographs
   of a real strip. Safari and Firefox strips are unmeasured.
3. **Whether Safari shows `favicon.svg` in a tab at all**, and whether it honours an in-SVG
   `prefers-color-scheme`, is unverified here. The dark-variant row's Safari column is empty.
4. **The WebKit blur's cause is unnamed.** The raster fits σ 0.35–1.0, but whether WebKit renders the
   filter at a reduced filter resolution or resamples the filter region is a hypothesis, not a reading.
5. **The stroke metric is quantised at 16 px** (EDT on a 16×16 binary; median 2.83 painted vs 2.57
   geometric). Read the geometric column for the claim.
6. **The pencil-line comparator is from geometry** (stroke 5 over a 32-unit ink bbox), not a painted
   digit read with the same skeleton instrument.
7. **PNG costs are librsvg rasters of today's design.** A redesigned glyph (monoline, lighter) will
   compress differently, most likely smaller.
8. **The 1.06–1.24:1 tile-on-light-strip reading has no gate.** Whether the tile edge must read on light
   strips is a design question for the owning family, not a finding.
9. **No family owns the surface** (the marks file says so). The row goes to the adjudicator to place or
   mint.
