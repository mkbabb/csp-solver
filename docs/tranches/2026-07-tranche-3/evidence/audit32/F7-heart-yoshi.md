# F7 — the HEART + Yoshi's Story language

Design lane (Fable, frontend-design skill invoked). Read-only audit; deliverable is variant specs for tranche-III authoring. Owner shot consumed: `owner-shots/heart.png` — a rosy crimson smiley heart on dark ground (dot eyes, curved smile, white highlight, maroon-shifted). Coordinates with `audit32/F2-completion-formulation.md` (Formulation C, "The Sticker and the Stamp") — this report supplies the path/filter-level geometry F2 left abstract.

## 1. Heart asset inventory — every touchpoint in the repo

Repo-wide grep (`grep -rniE 'heart' web/frontend/src --include='*.vue' --include='*.ts' --include='*.css'` + a `♥/❤/&hearts;` sweep + `public/`): **one drawn heart, one filter, one palette entry, five consumers, zero hearts elsewhere** (no unicode hearts, nothing in `public/`, no favicon heart).

### 1.1 CrayonHeart.vue — the sole drawn heart

`web/frontend/src/pencil/chrome/AttributionCard/CrayonHeart.vue` — 100×100 viewBox, six layers, all inside `<g filter="url(#wobble-heart)">` (line 22):

| # | Layer | Geometry | Paint | Cite |
|---|---|---|---|---|
| 1 | Shadow lobe (offset +3,+3) | `M53 91 C 18 63, 11 38, 21 21 C 31 5, 51 15, 53 28 C 55 15, 75 5, 85 21 C 95 38, 88 63, 53 91 Z` | fill `#C9184A` | :24-27 |
| 2 | Body | `M50 88 C 15 60, 8 35, 18 18 C 28 2, 48 12, 50 25 C 52 12, 72 2, 82 18 C 92 35, 85 60, 50 88 Z` | fill `#FF4D6D`, stroke `#1a1a1a` 3.5 round-join | :30-36 |
| 3 | Highlight | arc `M 25 25 C 20 35, 25 45, 30 50` (white, 4, round-cap) + dot circle (35,20) r3 | `#FFF` | :39-46 |
| 4 | Eyes | circles (38,40) r4 / (62,40) r4 | `#1a1a1a` | :49-50 |
| 5 | Smile | `M 35 55 Q 50 70, 65 55`, stroke 4 round-cap | `#1a1a1a` | :53-59 |
| 6 | Blush | ellipses (28,48) rx5 ry3 / (72,48) rx5 ry3, opacity 0.8 | `#FFB3C6` | :62-63 |

Dark mode dims the whole thing: `.crayon-heart:is(.dark *) { opacity: 0.75; filter: saturate(0.85) }` (:74-77) — **this is exactly why the owner's shot reads maroon**. Note the dark rule's `filter:` *replaces* nothing (the wobble is on the inner `<g>`) so boil survives, but the rosy body is deliberately muted.

Geometric reading: the bottom tip converges to a near-point at `50 88` (both C-curves terminate there); the lobes are already plump. The face sits high (eyes y=40, smile apex y=70). This is ~90% of the owner's heart.png already.

### 1.2 The wobble-heart filter

- Preset: `'wobble-heart': { margin: 10, wobble: { baseFrequency: 0.02, numOctaves: 2, scale: 5, offsets: [0.01,-0.02,0.02,-0.01], animScale: 0.2, intervalMs: 170 } }` — `pencil/config/pencilConfig.ts:202-207`. The most energetic of the three wobbles (celestial animScale 0.15/160ms, logo 0.1/550ms; :190-201).
- Rendered by `pencil/chrome/SvgFilters.vue:93-115`: single `feTurbulence type="turbulence"` + `feDisplacementMap scale=5`, `filterUnits="objectBoundingBox"`, region ±10%. Boiled by `useFilterParamBoil` on the unified rAF chain — **PRM-reactive and visibility-paused centrally** (SvgFilters.vue:13-19).
- Live-tunable via `pencil/dev/FilterTuner.vue` (:25 labels it 'Heart', :60 preview).

### 1.3 The palette

`YOSHI_COLORS.heart: { fill: '#FF4D6D', shadow: '#C9184A', highlight: '#fff', blush: '#FFB3C6' }` — `pencilConfig.ts:76`. **Yoshi's Story is already the named design language of this config section** (`// ── Yoshi's Story color palette` at :72), with fruit/flower/leaf/vine families and `PENCIL.fruitOutline { strokeWidth: 4, roughness: 1.0 }` (:64). NOTE: CrayonHeart.vue hard-codes the hexes rather than importing `YOSHI_COLORS.heart` — a truthing item for authoring.

### 1.4 Consumers (5)

| Consumer | Use | Cite |
|---|---|---|
| AttributionCard | `<CrayonHeart :size="32" />` beside "@mbabb" | `AttributionCard/AttributionCard.vue:2,50` |
| Sudoku ControlPanel | `.section-heading:hover { filter: url(#wobble-heart) }` easter egg | `games/sudoku/ControlPanel/ControlPanel.vue:371` |
| Futoshiki ControlPanel | same hover easter egg | `games/futoshiki/ControlPanel/ControlPanel.vue:265` |
| OptionSelector | `.ctrl-btn:hover { filter: url(#wobble-heart) }` | `pencil/chrome/OptionSelector/OptionSelector.vue:55` |
| FilterTuner (dev) | preview surface | `pencil/dev/FilterTuner.vue:25,60` |

Coupling caution: the filter is **shared state** — retuning `wobble-heart` for a bigger celebration heart retunes three hover easter eggs simultaneously. Variants below therefore keep the preset untouched.

### 1.5 Adjacent grammar (reusable, not heart-specific)

- `#storybook-texture` — fractalNoise 0.6 / 3 octaves / scale 3.5 (`SvgFilters.vue:163-167`): a high-frequency edge-tooth used by the celestial mascot — the closest thing we have to "felt nap" without a literal texture.
- `#grain-static` — the pencil tooth (`pencilConfig.ts:185-189`); CelebrationStar rides it (`CelebrationStar.vue:115`).
- CelebrationStar mechanics — stroke-dashoffset draw-on (350ms at crest 2650ms), one-shot mask-position foil gleam, PRM = instant + no gleam (`CelebrationStar.vue:52-90,144-180`; `CELEBRATION` at `pencilConfig.ts:292-295`).

## 2. Yoshi's Story — the researched language

Sources: [Wikipedia — Yoshi's Story](https://en.wikipedia.org/wiki/Yoshi's_Story), [Super Mario Wiki — Heart Fruit](https://www.mariowiki.com/Heart_Fruit), [Super Mario Wiki — Heart (Yoshi's Story)](https://www.mariowiki.com/Heart_(Yoshi's_Story)), [The Boar — Crafting Yoshi's Worlds](https://theboar.org/2019/05/yoshi-game-aesthetics/), [Nintendo Life review](https://www.nintendolife.com/reviews/n64/yoshis-story).

- **Materials.** A pop-up storybook whose pages are built from craft-store stock: cardboard, fabrics/felt, plastic, wood — "wafer-thin forests, denim clouds and inflatable plastic islands." Everything reads as *cut, sewn, or folded*, never rendered.
- **The Heart Fruit.** "A large, heart-shaped red fruit with a smiley face on it with a small green stem extending from the top" — eating it makes a Yoshi Super Happy. **The owner's heart.png is the Heart Fruit minus the stem**; CrayonHeart is already its crayon translation.
- **The Smile Meter.** One flower mascot expressing state through its face — full-health red big-smile, mid-health yellow slight-smile, drained blue frown. Precedent: *a single mascot with an expression family*, exactly the variant architecture below.
- **Motion.** Toys bob and squash; nothing snaps. The vocabulary is a soft settle (overshoot-and-recover), a blink, a bounce — finite, gentle, then still.

**Translation rule (inspiration, not imitation).** Our grammar renders material through *stroke behavior*, not texture bitmaps: felt = plush silhouette + stitch-dash inner stroke + turbulence tooth; craft heft = heavier outline; life = blink/squash on transforms only. No photographic felt, no drop-shadow depth, no gradients beyond the existing highlight.

## 3. The variant family — four hearts, one geometry

### 3.0 Shared substrate

- **Plush body path** (the one geometry change; felt toys have no needle points — round the tip with a closing quadratic):
  `M46 85 C 14 59, 7 35, 17 18 C 27 3, 47 13, 50 26 C 53 13, 73 3, 83 18 C 93 35, 86 59, 54 85 Q 50 89, 46 85 Z`
  Shadow lobe = same path, `transform="translate(3 3)"` (replacing today's hand-offset twin at CrayonHeart.vue:25 — one path, two uses).
- **Stitch line** (the single "sewn felt" signature): the plush path re-used, `fill="none"`, inset via `transform="translate(7 7) scale(0.86)"`, `stroke-width="1.5"`, `stroke-dasharray="6 5"`, `stroke-linecap="round"`, stroke `color-mix(in srgb, #1a1a1a 35%, #FF4D6D)` (computed constant; SVG attrs can't color-mix — bake `#8f3a50`-ish at build).
- **Outline weight** 3.5 → 4 (matches `PENCIL.fruitOutline.strokeWidth`, `pencilConfig.ts:64` — the heart *is* a fruit; the config already agrees).
- **Palette truthing**: all hexes import from `YOSHI_COLORS.heart` (+ new `stitch`, `stem` entries); stem/leaf greens from `YOSHI_COLORS.leaf/vine` (:81-82).
- **Component shape**: one `CrayonHeart.vue` with `variant?: 'idle' | 'celebration' | 'blush' | 'tiny'` (default `idle`), geometry constants colocated (`heartPaths.ts` beside it). Not four files — the Smile Meter precedent is one mascot, many faces.

### 3.1 Variant `idle` — the attribution keeper (current home, refined)

Where: `AttributionCard.vue:50`, size 32-40.
Spec: plush body + shadow, stitch line, existing highlight arc + dot (:39-46 unchanged), eyes r4, smile `Q 50 70`, blush rx5. Filter `#wobble-heart` as today. Dark mode keeps `:74-77` dimming — the attribution corner is ambient, muted is correct there.
Delta from today: plush tip, stitch, outline 4, palette import. Nothing moves.

### 3.2 Variant `celebration` — the Heart Fruit (primary home: F2's completion formulation)

Where: board bottom-right corner at crest, ~2.75rem, shared Sudoku/Futoshiki like CelebrationStar today (`SudokuBoard.vue:408`, `FutoshikiBoard.vue:476`) — per F2 Formulation C step 4.
Spec, additive over `idle`:
- **Stem + leaf** — the earned Heart Fruit tell, reserved for the reward moment: stem `M 50 12 C 49 7, 51 4, 53 2` stroke `#16a34a` width 4 round-cap; leaf `M 53 6 Q 61 2, 65 8 Q 59 12, 53 8 Z` fill `#22c55e`, stroke `#1a1a1a` 2.5. (Extends above viewBox top: bump viewBox to `0 -4 100 104` for this variant only, or draw stem inside y≥2 as specced.)
- **Blush** grows rx 5→7 (it's the happy face).
- **Bounce-in**: one `createSequenceSubscription` (~550ms, `delayMs: CELEBRATION.starCrestMs`), transform-only on the *host wrapper* (never the filtered `<g>` — keeps the ±10% filter region honest): scale 0 → 1.12 with squash `scale(1.15, 0.92)` at the overshoot frame → `scale(0.97, 1.02)` → 1. The reciprocal-axis squash is the entire Yoshi bounce.
- **Blink**: one setTimeout ~1.8s post-settle; eyes grouped `<g class="eyes">`, `transform: scaleY(0.1)` for 140ms with `transform-origin: 50px 40px`, once.
- **Murmur participation**: 1-in-8 seeded windows wiggle the heart instead of a cell (`pencil/composables/celebration.ts:78-87` hook) — per F2 §C.
- **Dark mode exception**: the reward heart does *not* inherit the attribution dimming — stays `#FF4D6D` rosy; only the blush deepens (`#FFB3C6` → `color-mix` toward shadow). The owner's maroon read is an idle-register artifact, wrong for the crest.
- Filter: `#wobble-heart` unchanged (scale-5 displacement at 2.75rem is proportionally *calmer* than at 2rem — objectBoundingBox units).
- PRM: mounts static at scale 1, no bounce, no blink; murmur already PRM-gated by the scheduler (`SvgFilters.vue:16-19` pattern; CelebrationStar precedent :61-65).

### 3.3 Variant `blush` — the wink (hover/easter-egg register)

Where: AttributionCard trigger hover / focus-visible (the "made by" corner earns a flirt); optionally the future hold-to-peek affordance. NOT on ControlPanel headings — those keep their text-only wobble easter egg (:371/:265), which is a different joke.
Spec: two stacked face `<g>`s inside the one SVG, opacity cross-faded 240ms ease (a state swap — no filter re-raster, no motion, PRM-safe by construction):
- Face A = idle face.
- Face B: left eye → wink arc `M 34 40 Q 38 44, 42 40` stroke `#1a1a1a` 4 round-cap (right eye stays r4); smile deepens `M 35 55 Q 50 73, 65 55`; blush rx 5→7, opacity 0.8→1.
Trigger: `.group:hover .face-b, .group:focus-visible .face-b { opacity: 1 }` on the card trigger.

### 3.4 Variant `tiny` — the margin punctuation (~1-1.25rem)

Where: end of F2's merged margin line (`solved it! — 0 backtracks — 1ms ♥`), wiping in with MarginNote's existing 250ms clip-path write-in (F2 Formulation A, heart clause); any future inline use.
Spec — legibility by subtraction at 16-20px raster:
- Layers kept: body (plush path) + outline, eyes, smile, blush. Dropped: shadow lobe, stitch, highlight arc+dot (sub-pixel noise at this size).
- Optical re-weights: outline 4→5.5, eyes r4→5.5, smile stroke 4→5.5 and shallower `Q 50 66`.
- Filter: **none below ~20px, `#grain-static` at 20-32px** — `wobble-heart`'s scale-5 displacement shreds a 16px raster (objectBoundingBox displacement is proportionally violent on small elements; same reason grid cells run cellBoil 0.3 vs frame 1.2, `pencilConfig.ts:150-156`).
- Dark mode: inherit the idle dimming (it sits in graphite margin text).

## 4. Authoring notes / risks

1. **Filter sharing** — never retune the `wobble-heart` preset for a variant; three hover easter eggs ride it (§1.4). New energy needs = new preset id.
2. **Transforms outside the filter** — all bounce/squash/blink transforms go on the host element or unfiltered inner groups; scaling the filtered `<g>` itself risks region clipping at the +15% overshoot (region is ±10%, `pencilConfig.ts:204`).
3. **Hex truthing** — CrayonHeart currently duplicates `YOSHI_COLORS.heart` as literals (§1.3); the variant refactor is the natural moment to import.
4. **`CELEBRATION` config additions** — `heartCrestMs`, `heartBounceMs`, `heartBlinkDelayMs` beside the star's trio (`pencilConfig.ts:292-295`), per F2's blast-radius estimate.
5. **Subscriber budget** — celebration adds 1 transient `sequence` (bounce) + 1 setTimeout (blink); murmur cadence unchanged. Inside the chains=1/subscribers=10 envelope.
6. **F2 coordination** — variant `celebration` *is* F2's "FeltHeart"; F2's open owner decision (inline star vs corner foil sticker) is orthogonal to this spec — the heart takes bottom-right either way.

## 5. Evidence index

| Claim | Cite |
|---|---|
| Six-layer heart, exact paths | `pencil/chrome/AttributionCard/CrayonHeart.vue:22-64` |
| Dark-mode maroon read | `CrayonHeart.vue:74-77`; `owner-shots/heart.png` |
| wobble-heart params, hottest wobble | `pencilConfig.ts:190-207` |
| Filter renderer + central PRM gates | `pencil/chrome/SvgFilters.vue:13-19,93-115` |
| YOSHI_COLORS already named for Yoshi's Story | `pencilConfig.ts:72-93` |
| fruitOutline strokeWidth 4 | `pencilConfig.ts:64` |
| Five consumers | §1.4 table cites |
| storybook-texture felt-tooth | `SvgFilters.vue:163-167` |
| Star crest mechanics to rhyme with | `CelebrationStar.vue:52-90,144-180`; `pencilConfig.ts:292-295` |
| Heart Fruit = smiley heart + green stem | mariowiki.com/Heart_Fruit (search-verified quote) |
| Craft materials: cardboard/fabric/felt/denim/plastic | en.wikipedia.org/wiki/Yoshi's_Story; theboar.org 2019; nintendolife.com review |
| Smile Meter expression-family precedent | strategywiki.org Yoshi's Story/Gameplay (search-verified) |
| No hearts outside src | `grep -rni heart public index.html package.json` → no hits; `ls public` |
