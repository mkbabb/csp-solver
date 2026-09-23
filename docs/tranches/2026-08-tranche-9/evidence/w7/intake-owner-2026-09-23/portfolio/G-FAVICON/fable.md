# G-FAVICON · fable — A SCRAP OF THE PAGE

Designer: Fable 5.1 (frontend-design skill invoked; two passes: plan → tell review → spec).
Designed against MAIN `1d0dc4fd`, the product the owner audited on :3001. Ground: `census/favicon/README.md`
+ `instruments/favicon-census-summary.tsv` + `stroke-per-size.json` + `wordmark-readings.json` (every
main-tree number below is the census's, cited), the marks file (T9-M22), W7 §12 (idiom refinement: "colors,
animations … brought to the design language"), R6 §1.1 the stroke substrate (HandDrawnOutline radius 0 —
"square corners … the auto border-radius read was deleted as geometric, out of family"; HandwrittenGlyph
"ZERO live filters (G2.4 ruled C)"; the wordmark row), pencilConfig `:300–330` (the icon ruling: "Icons were a
uniform ±1.25-unit nudge … never a tooth"; glyph/icon filters DELETED on the owner's word), registry-v0 §10
CTRL-FACE's type law ("Fraunces is what the sheet came printed with, Patrick Hand is what a pencil put
there"), registry-v5 §1 (no family owns the surface — the marks file says so), pass-6 CHAIR-RULINGS Addendum A
(A.5.3 existence is not visibility; A.5.7 two-photograph minima), the source at `public/favicon.svg`,
`index.html:15`, `index.css:134–135, 311, 363–364`, `HandwrittenGlyph.vue:88–90, 302–314`,
`HandwrittenLogo.vue:414–422`, `glyphPaths.ts:1–30`, `public/_headers:137–145`.

One AUDITION was run in this lane (numbers marked *aud*): the candidate SVG and the shipped one rastered
through sharp/librsvg (the census's own PNG-cost engine, `shoot.mjs` in the scratchpad), read with the
census's skeleton instrument (`an2.py`'s `skel`, copied verbatim as `fable-skel-instrument.py` beside this
file). It is the `<img>`-path proxy the census itself flags as gap 1 — NOT a browser's tab rasteriser, not
Safari. It grounds the geometry claims; the prototype lane re-reads every number on both engines. The
audition's SVG is `fable-icon.svg` and its one crop is
`fable-audition-librsvg-light-and-dark-16-32-48px-shipped-vs-written-s-nopointer.png` (26 KB; cells left to
right: shipped 16@1 · 16@2 · 32@1 · 48@1, written-s light the same four, written-s dark the same four;
nearest-magnified).

## 0 · The thesis, in one sentence

**The favicon is a scrap torn off the page, not a badge: the page's own paper, square-cornered, with one
`s` WRITTEN on it in the board's given-digit line (monoline, round caps, 0.155 of its height, 2 px at
16 px), in the page's own ink, the paper turning over with the tab strip's scheme — no filter, no
glyph, no tile that isn't paper.**

The owner's two clauses are one reading. "Too thick" is a Black-weight display glyph blown to 90 % of a
16 px tile (census: 52 % ink, a 5.8–6.3 px spine, 2 px counter slits). "Reflect our design language more"
is the census's palette-drift table and R6's substrate: on the page, 99 % of what is drawn is a STROKE —
grid, outline, digits, marks — and the one filled thing is the wordmark. The shipped icon is the wordmark's
letter cut at the wrong optical size, under a wobble that reads as nothing in Chromium and as blur in
WebKit, on a cream that is neither paper, in an ink that is neither foreground. The house answer is not a
lighter cut of the same glyph. It is CTRL-FACE's own law applied to the tab: the wordmark is what the sheet
came printed with; the favicon is what a pencil put there.

## 1 · Numbers first (the ground the design answers)

| reading | shipped, on main (census unless *aud*) | the written s (*aud*, librsvg) | the design's target (gate) |
|---|---|---|---|
| ink fraction of the tile | 0.520–0.527 every size/engine/DPR | 0.191–0.197 | ≤ 0.25 |
| glyph box, tile units of 32 | 28.97 × 26.34 (90.5 % H, 82 % W) | 16 × 25 (78 % H, 50 % W) | ink height 24–26 of 32 |
| stroke, skeleton median @16 css px | 2.83 chromium · 3.00–4.00 webkit (geometric 2.57) | 2.00 (DPR 1 and 2) | 1.8–2.3 |
| stroke / glyph height, median · mean | 0.178 · 0.221 (spine 0.40) | 0.155–0.167 · 0.154–0.184 | 0.14–0.18 median, mean ≤ 0.19 |
| max stroke / median (the spine) | 2.26 (5.80 / 2.57) | 1.04–1.42 | ≤ 1.5 |
| given digit, the comparator | stroke 5 on a 32-unit ink height, 0.156 H; 2.13 px at the board's 23.9 px glyph box (`HandwrittenGlyph.vue:88–90`) | — | the favicon at 16 paints the board's line: 2.0 vs 2.13 px |
| counters @16 DPR1 | 2 px slits (4 px of paper in the 14.5 px column) | two open bowls, 3–4 px | centre-column valleys < 0.5 coverage, ≥ 3 device px |
| the wobble | chromium max Δ 0.036 = a no-op; WebKit fits blur σ 0.35–1.0 | no filter | 0 `<filter>`; painted ≡ geometry (mean abs Δcoverage ≤ 0.01) |
| ink · paper | `#1a1a1a` (COLORS.outlineBlack) · `#faf8f5` (hue 36°, 1.017:1 vs the page's paper) | `#0a0a0a` · `#fbfaf9` (= `--color-foreground` / `--color-background`, light) | byte-equal to index.css's resolved tokens, both themes |
| dark scheme | none (`[250,248,245]` in all 64 rows); the tile is the brightest object on a dark strip at 15.19:1 | `#edece9` on `#110f0e` (= the `.dark` tokens) | tile-on-strip ≤ 1.3:1 in its own scheme |
| tile on its own scheme's strip | light 1.06 on `#fff`; dark: none (the cream card at 11.38–15.19 on dark strips) | light 1.04 on `#fff`; dark 1.19 on `#202124` (the strip table below) | ≤ 1.3 in-scheme; stands as a card cross-scheme |
| glyph core contrast (P5 statistic) | 16.08 chromium; 15.19 WebKit @16 | 18.99 light · 16.18 dark (@16 DPR1: 16.87 · 14.21) | ≥ 14 both schemes, both engines |
| file | 1,961 B raw · 954 gz | 473 B raw · 337 gz | ≤ 600 B raw |
| estate | `/favicon.ico`, `/apple-touch-icon.png`, `/manifest.webmanifest` 404; one `<link>` | — | the ladder in §4.4, every path 200 |

Contrast on the strips, computed from the tokens (Chrome's default frames, the census's approximations):

| strip | paper-light on it | paper-dark on it | ink-light on it | ink-dark on it |
|---|---|---|---|---|
| light active `#ffffff` | 1.04 | 19.12 | 19.80 | 1.18 |
| light inactive `#dee1e6` | 1.26 | 14.58 | 15.10 | 1.11 |
| dark active `#35363a` | 11.58 | 1.58 | 1.64 | 10.22 |
| dark strip `#202124` | 15.44 | 1.19 | 1.23 | 13.63 |

Read the diagonal: in its own scheme the paper is gone (1.04–1.58) and the s floats on the strip at
10–20:1, which is how a pencil mark sits on a page. Cross-scheme (a light bookmark list under a dark OS,
Safari's white tab-overview card if it ignores the query) the paper stands as a card and the s is on IT at
16–19:1. There is no cell where the ink is on a ground it cannot be read on — which is the failure the
"no tile" arm (§7 ballot 2) has in two cells (1.11–1.18).

## 2 · Pass one: the plan (tokens · type · layout · principles)

**Colour (four values, none new — every one is an index.css token copied byte-for-byte, because a favicon
is its own document and cannot read the page's custom properties; the gate makes the copy honest):**

| token in the SVG | value | is |
|---|---|---|
| `--paper` light | `#fbfaf9` | `--color-background: hsl(48 15% 98%)` = rgb(251,250,249) (`index.css:134`) |
| `--ink` light | `#0a0a0a` | `--color-foreground: hsl(0 0% 3.9%)` (`index.css:135`) — the wordmark's painted rgb(10,10,10) |
| `--paper` dark | `#110f0e` | `.dark --color-background: hsl(24 8% 6%)` = rgb(17,15,14) (`index.css:363`) |
| `--ink` dark | `#edece9` | `.dark --color-foreground: hsl(48 10% 92%)` = rgb(237,236,233) (`index.css:364`) |

No user-ink blue: the name is a GIVEN. Givens write in `--color-foreground` at stroke 5; the user's hand
writes at 4.5 in blue (`HandwrittenGlyph.vue:82–90`). The product's name is a clue on the sheet, not the
player's entry.

**Type:** none. There is no typeface in the icon. The s is a path in the digits' hand (open stroke,
`fill="none"`, `stroke-linecap="round"`, `stroke-linejoin="round"` — `HandwrittenGlyph.vue:308–313`
verbatim), with the digits' contract from `glyphPaths.ts:5–12`: one command structure (M C C C), real
hand variation (a lean, a bottom bowl larger than the top, as a hand writes an s). The Fraunces path dies.

**Layout (one object, one law across every size):**

```
 32 ─────────────────┐   paper, square corners, full-bleed (rx 0)
 │   ·  ╭──╮  ·      │   the s: ink box 16 W × 26 H of 32, centred,
 │   ·  ╰──╮  ·      │   margins 3 top/bottom (1.5 px at 16, 17 px at 180),
 │   ·  ╭──╯  ·      │   8 left/right; stroke 4 (0.154 of the ink height);
 │   ·  ╰──╯  ·      │   round caps; nothing else on the paper
 └───────────────────┘
```
Centred on both axes (a monogram is centred; a digit sits centred in its cell, `.glyph-svg` inset 0 /
margin auto). The same SVG serves 16, 32, 48 and the touch icon: the s is a line, so the browser's own
raster at each size IS the size-specific cut — no hinted 16 px variant is drawn, and the gate's worst cell
(16 px DPR1) is framed first (§5 G-F2).

**Principles:**
1. Written, not printed. The tab carries the pencil's s, at the given digit's line weight. The wordmark
   stays Fraunces on the page; the two are the sheet and the hand, CTRL-FACE's pair.
2. The paper is the page's paper. Both themes. It dissolves into a strip of its own scheme and stands as a
   card in the other; it is never a third colour.
3. Nothing at icon scale that only exists (A.5.3). No filter (G2.4's ruling, re-proven by the census: a
   no-op in one engine, blur in the other), no tooth, no frame, no rounded corners (R6 §1.1: square is the
   house), no second glyph.
4. One geometry, one law, every size. PNGs are rasters of the SVG and a gate says so.

## 3 · Pass two: the tell review

- *A serif monogram in a rounded tile.* This is the commonest favicon on the web and it is what ships. The
  plan's first cut kept `rx 6` out of habit; R6 §1.1 says the house's box has square corners and the deleted
  auto-radius was "geometric, out of family". **Changed: rx 0, the clipPath deleted.** iOS rounds the touch
  icon itself; Chrome shows the square scrap, which at 1.04–1.58:1 in-scheme is not seen anyway — its
  shape matters only cross-scheme, where a square paper card is the house's card.
- *A lighter cut of the same glyph* (Fraunces at opsz 52, wght ~600) was the obvious "less thick" answer.
  Rejected as the default, kept as a ballot arm (§7): the census shows opsz alone buys 9–12 %; weight would
  buy the rest but leaves a filled serif glyph on a tile — the tell — and touches none of "our design
  language", which on the page is stroke, paper and graphite. Framed so the owner sees both.
- *A miniature board* (a 3×3 grid, one digit) is the product's most characteristic object and was
  considered. At 16 px it is 4 one-pixel lines fusing with a 2 px digit — existence without visibility.
  Cut (Chanel's accessory).
- *A wobble scaled properly* (the wordmark's 0.96 em wavelength at 0.029 em peak, not the shipped 34× /
  1/14) was considered for the 180 px touch icon only. Cut: G2.4's ruling is that icon-scale filters never
  read as a tooth; the design has one geometry for every size and the hand's waver is IN the path (the
  bowls are not symmetric), which is how the outline carries its grain (R6 §1.1, `gridPaths §Grain bake`).
- *Motion.* None, and none is pretended: SVG favicons are frozen at their first frame in the tab and the
  theme flip is the browser's own re-raster. The MOTION ladder is untouched (π); no rung, no literal.
- *Copy.* The icon carries no words. The manifest carries "sudoku" twice and the og description verbatim
  (already M16-swept at `index.html:31`), so `check-copy-register` has nothing new to read.

## 4 · The spec

### 4.1 The s (the memorable thing)

`public/icon.svg` — the whole file, the audition's bytes (473 B raw, 337 gz):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <style>
    :root{--paper:#fbfaf9;--ink:#0a0a0a}
    @media (prefers-color-scheme:dark){:root{--paper:#110f0e;--ink:#edece9}}
    rect{fill:var(--paper)} path{stroke:var(--ink)}
  </style>
  <rect width="32" height="32" fill="#fbfaf9"/>
  <path d="M22,8.6 C21,4.6 12,4.2 11,9.4 C10.2,14.4 21.6,15.6 22,21 C22.4,27 12.4,28.6 10,24.6"
        fill="none" stroke="#0a0a0a" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

(The presentation attributes are the light arm for a rasteriser with no CSS; the `<style>` overrides them
in both schemes. The audition file omits the attributes; the prototype adds them and G-F1 reads both.)

- ONE open path, M C C C: the top bowl (terminal at top-right, over the top, down the left), the spine
  (lower-left to lower-right, the diagonal of a hand's s), the bottom bowl (round to the bottom-left
  terminal). The hand: a lean of ~4° (top terminal at x 22, bottom at x 10), the bottom bowl 1.2× the top
  (a written s is bottom-heavy; a typeset one is nearly even), terminals cut short of the bowls' line so
  the apertures stay open at 2 px.
- Stroke 4 tile units on an ink height of 26 → 0.154 H; at 16 px 2.0 px, 32 px 4.0, 48 px 6.0, 180 px
  22.5. Round caps and joins (the digits'). Ink box 16 × 26, centred: x 8–24, y 3–29.
- No filter, no clip, no `<title>` (no reader reaches it in a tab; the manifest names the app).
- States: one. A favicon has no hover, focus, pressed or disabled. Its only axis is the strip's scheme
  (§4.8).

### 4.2 The paper

A full-bleed square `rect` in `--paper`. In-scheme it is 1.04–1.58:1 against Chrome's strips (gone); cross-
scheme it is 11.6–19.1:1 (a card). The page's tooth (`index.css:311`, turbulence at 0.18) is NOT carried:
at 16 px it does not exist visibly and at 180 px it is a filter, which principle 3 forbids; the touch icon
is flat paper by design and says so here so nobody "adds the texture back" as a cure.

### 4.3 Tokens

The four values in §2, in the SVG's `<style>` as `--paper`/`--ink`. They are COPIES and the born-RED gate
(§5 G-F1) parses `index.css`'s `--color-background`/`--color-foreground` for `:root` and `.dark`,
resolves `hsl()` to 8-bit sRGB, and asserts byte-equality with the SVG's literals — the same discipline as
the two-layer easing rule (byte-identical control points on both sides, one gate). The manifest's
`background_color`/`theme_color` and the two `theme-color` metas read the same four.

### 4.4 The estate (what `index.html` links, what `public/` holds)

| path | bytes (est., census §"priced"; a monoline compresses smaller) | why |
|---|---|---|
| `/icon.svg` | 473 raw | the tab, every SVG-capable engine; RENAMED from `favicon.svg` — Chrome's favicon store outlives the HTTP cache (census: the reliable bust is the href) |
| `/favicon.ico` (16 + 32) | ~1–2 KB | the default probe (feed readers, unfurlers, old engines); today 404 |
| `/icon-32.png` | < 674 | `<link rel="icon" type="image/png" sizes="32x32">` for engines without SVG favicons |
| `/apple-touch-icon.png` 180 | < 2.6 KB | iOS home screen / favourites / tab overview; full-bleed paper, iOS rounds it; today 404 and requested by default |
| `/icon-192.png`, `/icon-512.png` | < 2.9 / < 7.4 KB | manifest, `purpose: "any"` (maskable is a gap, §8) |
| `/manifest.webmanifest` | ~300 B | `name`/`short_name` "sudoku", `description` = the og string verbatim, `background_color` paper-light, `theme_color` paper-light, `display: "standalone"`, `icons` the two above; CSP: `manifest-src` falls to `default-src 'self'` (census) — no `_headers` change; `.webmanifest` gets a `Content-Type: application/manifest+json` line only if the edge does not already send it (the lane curls it) |
| `<meta name="theme-color">` × 2 | ~150 B | `media="(prefers-color-scheme: light)"` `#fbfaf9` · dark `#110f0e` |

`index.html` head, after `<title>`:
```html
<link rel="icon" href="/icon.svg" type="image/svg+xml" />
<link rel="icon" href="/icon-32.png" type="image/png" sizes="32x32" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<link rel="manifest" href="/manifest.webmanifest" />
<meta name="theme-color" media="(prefers-color-scheme: light)" content="#fbfaf9" />
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#110f0e" />
```
No `mask-icon` (deprecated; near-zero value, census). The PNGs and the ICO are COMMITTED bytes produced by
`scripts/icons.mjs` (sharp, already a devDependency: `package.json`; the census's `hires.mjs`/`cost.mjs`
are its ancestors) from `icon.svg`'s light arm; `npm run icons -- --check` re-rasters and diffs, and CI
runs the check (G-F1's idempotence clause). Nothing in `src/` changes: the favicon is not in the
document, `filterBudget 9` cannot move, π on every page surface.

### 4.5 Copy (M16)

None in the icon. Manifest strings: `sudoku`, `sudoku`, and `five pencil puzzles: sudoku, futoshiki,
thermo, killer, and kenken. play alone or with friends on a shared board.` — the head's own sentence,
unchanged. No dash of any kind. `check-copy-register` bare passes by construction; the lane runs it.

### 4.6 Motion

None. The tab freezes an SVG favicon at its first frame (Chromium runs neither SMIL nor CSS animation
there); the scheme flip is the browser's own re-raster, a cut in every regime including PRM. No
`MOTION` rung is consumed, no literal is minted, `pencilConfig.ts` is byte-unchanged — π. If a future
mark asks the favicon to move (a solved-board mark in the tab, say), it is a JS `<link>` href swap on
the board's own `sequence` beat and a new charter row, not this one.

### 4.7 Desktop and phone

- Desktop: the tab at 16 css px (DPR 1 and 2), the bookmark bar and history at 16, the tab-search and
  new-tab tiles at 32–48. One SVG; the gate frames 16@1 both engines both schemes FIRST (the worst cell:
  a 2 px round-capped line on a 16-grid).
- Phone: iOS home screen and Safari favourites read `apple-touch-icon.png` (180, square paper; iOS masks
  the corners); the tab overview shows the favicon at ~24; Android's tab strip reads the SVG or the manifest
  192/512 for add-to-home. Coarse pointer changes nothing (no hit target exists), so no hasTouch row —
  the phone rows are the touch icon's frames on a simulated iOS home-screen ground (light and dark
  wallpapers are unmeasurable; the lane frames the PNG on `#ffffff` and `#000000` and prints both contrasts).

### 4.8 Light and dark

`@media (prefers-color-scheme: dark)` inside the SVG turns the paper over: `#110f0e` under `#edece9`.
The favicon follows the STRIP's scheme (the OS's), not the page's `.dark` class — correct, because the
icon lives on the strip: a light page in a dark OS still sits in a dark tab strip, and the s must read
there (13.6:1), not against a paper it is not on. The `theme-color` metas likewise key on the OS scheme
(a static head cannot know the toggle); the cross-case (page toggled against the OS) is a crossing row
for the toggle's owner (§6, row 9) and a stated gap (§8). Chromium and Firefox honour the query in the
tab; Safari's tab path is unwitnessed (census gap 3, M19) — Safari falls to the light arm, which is
legible on every Safari surface (white cards, light strips) at 15–20:1.

### 4.9 What DIES

1. `feTurbulence` + `feDisplacementMap` (`favicon.svg:3–6`): a 0.057 px displacement at a 0.81 px
   wavelength — a no-op in Chromium (max Δ 0.036), blur in WebKit (σ 0.35–1.0). G2.4's icon ruling
   applied to the last icon that still carried a filter.
2. The Fraunces wght-900 opsz-9 path (`:14`, 1.9 KB): the axis default, not the wordmark's pinned opsz 52,
   and a filled display glyph at 52 % ink. The written s replaces it.
3. The `rx 6` tile and its `clipPath` (`:7–11`): rounded corners are out of family (R6 §1.1).
4. The literals `#1a1a1a` (`COLORS.outlineBlack`, a config colour, not the page's ink) and `#faf8f5`
   (a hue-36° cream that is 1.017:1 from the paper and follows no theme).
5. The `/favicon.svg` href (`index.html:15`): renamed so returning tabs re-fetch.
6. Four 404s at the live edge (`/favicon.ico`, `/apple-touch-icon.png`, `-precomposed`,
   `/manifest.webmanifest`).

## 5 · Born-RED gates (RED on main by construction; GREEN on the tree; both engines where painted)

| id | instrument | RED on main because | GREEN when |
|---|---|---|---|
| G-F1 source | `scripts/check-favicon.mjs` (bare node; CI lane `lint:icons`) | `favicon.svg` has a `<filter>`, a `clip-path`, `rx`, a filled `<path>`, literals ≠ tokens, no dark `@media`; `index.html` lacks the four links + two metas; no PNG/ICO/manifest exists | every clause holds on `icon.svg`; `--paper`/`--ink` ×2 byte-equal to index.css's resolved tokens; stroke-width ÷ (path bbox height + stroke) ∈ [0.145, 0.165]; `icons.mjs --check` re-rasters byte-identical (sharp pinned; the check compares decoded pixels, not PNG bytes, if sharp's encoder differs across platforms — the lane decides and says which) |
| G-F2 painted stroke | the census's `shoot.mjs` + `an2.py` `skel`, re-run on the tree: chromium + webkit · DPR 1/2 · 16/32/48/180 · `emulateMedia({colorScheme})` light and dark · two bare photographs each (A.5.7, Δ 0 asserted) | shipped skeleton median @16 2.83–4.00, stroke/H 0.178–0.207 median, spine/median 2.26 | @16 median ∈ [1.8, 2.3] css px both DPR; stroke/H median ∈ [0.14, 0.18] at 32/48/180; max/median ≤ 1.5; ink fraction ≤ 0.25 |
| G-F3 counters | `an2.py` `counters` (centre-column profile, `find_peaks`) @16 DPR1 both engines | shipped valleys are 2 px slits (4 px of paper in the column) | two valleys < 0.5 coverage, each ≥ 3 device px at DPR1 |
| G-F4 no blur | the census's blur-fit (shipped vs geometry raster, `blurfit`) | WebKit σ 0.35–1.0 | σ = 0 both engines (the shipped IS the geometry; mean abs Δcoverage ≤ 0.01) |
| G-F5 scheme | painted tile vs strip and glyph core vs strip, both schemes, the four strip values | the tile is `[250,248,245]` in all 64 rows; on `#202124` 15.19:1 | tile-on-strip ≤ 1.3 in its own scheme (light on `#fff`, dark on `#202124`); glyph core median ≥ 14 vs paper both schemes; glyph vs own-scheme strip ≥ 10 |
| G-F6 estate | curl of the built dist served locally (and the live edge after deploy): `/icon.svg`, `/favicon.ico`, `/icon-32.png`, `/apple-touch-icon.png`, `/manifest.webmanifest`, `/icon-192.png`, `/icon-512.png` | four 404s today | all 200 with the right `Content-Type`; manifest parses, `icons[]` resolves |
| π-1 | `filterBudget` census, goldens 4/4, `lint:copy` bare, `lint:motion` | — | unmoved (the favicon is outside the document; `src/` diff empty, `pencilConfig.ts` byte-identical) |

Evidence caps: numbers and text first; ≤ 4 crops per lane, each named engine · theme · size · pointer
(the census's f1 contact-sheet form with the shipped as control is crop 1; 16@1 light+dark both engines is
crop 2; the touch icon on white and black is crop 3; the ballot pair is crop 4).

## 6 · Charter rows for pass 7 (owning family: MINT — no family owns the surface)

The adjudicator mints **ICO-SCRAP** ("a scrap of the page"), one lane, the smallest in the wave: three
files in `public/`, six lines in `index.html`, one script, one gate. Placed under W7 §12 (idiom
refinement — "colors, animations … brought to the design language"); its type ruling is CTRL-FACE's
(printed/written) and its ink and paper are ACC-FIVE's/PAL-WALK's tokens by reference, not by edit.

1. `public/icon.svg` per §4.1 (the audition's path verbatim, presentation attributes added), `favicon.svg`
   deleted; G-F1 clauses 1–6 born-RED on the control.
2. `scripts/icons.mjs` (sharp) writes `icon-32.png`, `apple-touch-icon.png` (180), `icon-192.png`,
   `icon-512.png`, `favicon.ico` (16+32) from the light arm; `--check` mode; committed bytes; the
   idempotence clause of G-F1 and its cross-platform decision stated.
3. `public/manifest.webmanifest` + the two `theme-color` metas + the four `<link>`s (§4.4); G-F6 on the
   local dist; `_headers` touched only if the manifest's Content-Type is wrong at the edge (curl it).
4. G-F2–G-F5 re-run on the tree with the census's instruments, both engines, both schemes, two
   photographs per cell; the fringe statistic (`keyed_frac_under3`) PRINTED as a rate beside the core
   median, not gated — a monoline has more edge per ink than a Black glyph (*aud*: 0.36 vs 0.23 @16 DPR1)
   and that is the design, not a defect.
5. The ballot pair (§7) BUILT on the tree: arm P as `icon-printed.svg` (never linked), framed in crop 4's
   two-photograph form with the shipped as control.
6. Safari: state the unwitnessed cells (M19: no `open -a Safari`, no osascript) as rows in the return —
   whether Safari's tab shows `icon.svg`, whether it honours the in-SVG query — and the light-arm fallback
   reasoning (§4.8) as the design's answer until the owner's own Safari re-look.
7. The 16×16 DPR1 cell framed FIRST in both engines; if the round-capped 2 px line reads grey on either
   engine's tab path, the one lawful cure is the stroke rung 4 → 4.5 (0.173 H, still under the wordmark's
   0.178 median and the shipped 0.20) — never a filter, never a hinted second glyph; say which rung shipped.
8. Crossing (W8, the seal): `npm run deploy` carries the new paths; the post-deploy pass curls G-F6 at
   the live edge and reads the etag change on `/icon.svg`.
9. Crossing (MOT-VERB, `DarkModeToggle.vue`'s owner): OPTION, framed not defaulted — on flip, set
   `meta[name=theme-color]`'s content to the page's paper so Safari/Android chrome follows the toggle, not
   the OS. One line, no motion, `src/`; it is the toggle family's row because that file is theirs.

## 7 · The ballots (the owner's, at the re-look; both arms built, framed on one contact sheet)

**T9-B-FAV-1 · the s's hand.** One variable: which s.
- Arm W (DEFAULT): WRITTEN — this spec's monoline s at the given-digit line (0.154 H, 2 px @16).
- Arm P: PRINTED, LIGHTER — the wordmark's own Fraunces at the pinned opsz 52, weight cut to land the
  skeleton median in the same band (the lane finds the wght, ~500–600; the census's opsz-52 at 900 is
  4.58 median @32 → still 0.162 H, so weight is the lever). Same paper, same ink, same square, no filter.
- Cost of P, stated: a filled serif glyph in a square is the web's default favicon; it answers "too thick"
  and not "our design language". Cost of W: at 16 px DPR1 a 2 px line antialiases to grey where a Black
  glyph stays black; the 16@1 crop is the owner's decider.
- Firing default on silence: W.

**T9-B-FAV-2 · the dark paper.** One variable: whether the dark scheme has a tile.
- Arm T (DEFAULT): paper both schemes (`#110f0e` under `#edece9`): dissolves in a dark strip (1.19–1.58),
  stands as a dark card on any light surface that ignores the query.
- Arm N: no paper in dark — transparent, ink only. Lighter, purer; but light ink on a white bookmark list
  or a Safari card is 1.11–1.18:1 — invisible — and Safari is exactly the surface nobody can witness here.
- Firing default on silence: T.

## 8 · Gaps and risks (a gap is a gap)

- **Every number here is a proxy.** The census read the `<img>` path in two headless engines; this lane's
  audition read librsvg. Neither is Chrome's favicon service or Safari's icon database. The 2.0 px line at
  16 DPR1 is the claim most exposed: the tab rasteriser may snap or blur it differently. Row 7 is the cure
  path; the owner's tab is the instrument of record.
- **Safari is unwitnessed** (M19): whether it displays SVG favicons at all on the owner's version, whether
  it honours the in-SVG scheme query, and what its tab overview paints. The light arm is designed to be
  legible everywhere as the fallback; that is an argument, not a reading.
- **The scheme mismatch.** OS-light with the page toggled dark (or the reverse) shows a light favicon in a
  light strip over a dark page — correct for the strip, unexpected for the eye. No favicon can follow a page
  class without JS; row 9 offers the meta half; the icon half would be a `<link>` href swap in `App.vue`
  on the toggle (a mechanic W2 did not land, so not in this spec; the owner may ask for it).
- **Maskable Android icons** need the safe zone (inner 80 %); the s at 78 % height sits on its edge. The
  manifest ships `purpose: "any"`; a maskable variant with a wider margin is a second raster of the same
  SVG (one transform) if the owner wants add-to-home on Android to crop cleanly.
- **The fringe rate rises.** `keyed_frac_under3` at 16 DPR1 reads 0.36 for the written s against 0.23
  shipped (*aud*): more antialiased edge per pixel of ink. It is the nature of a line; it is printed, not
  gated, and the core median (16.9 light / 14.2 dark @16 DPR1, *aud*) is the contrast claim.
- **Cross-platform PNG idempotence** (sharp's libvips builds can differ by a byte in PNG encoding): G-F1's
  check should compare decoded pixels if bytes differ across the owner's box and the runner; row 2 says so.
- **The chosen path is one designer's hand.** The digits carry 2–3 variants each; the icon carries one.
  Whether the lean and the bowl ratio read as a hand or as a wobbly font at 32–48 px is the owner's call at
  the re-look; the lane may frame two sibling variants (same M C C C structure) beside it without a ballot.
- Nothing here retires T9-M22. The owner disposes at the re-look.
