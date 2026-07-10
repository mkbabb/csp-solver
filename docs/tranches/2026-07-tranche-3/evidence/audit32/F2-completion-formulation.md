# F2 — GREENFIELD: the completion formulation

Design lane (Fable, frontend-design skill invoked). Read-only audit; deliverable is formulations for tranche-III authoring. Owner shots consumed: `owner-shots/solved-star.png`, `owner-shots/heart.png`.

## 1. The current state, dissected

### 1.1 The collision (confirmed against solved-star.png)

Three elements pile into the same ~3.5rem strip below the board's left corner:

- **CelebrationStar** — absolutely positioned at `left: 0.25rem; top: calc(100% + 0.25rem)`, 3.25rem square, `z-index: 3` (`web/frontend/src/pencil/chrome/CelebrationStar.vue:126-134`). It draws on at crest (~2.65s) and *stays* (it's `v-if="visible"`, never dismissed until state leaves `solved`).
- **MarginNote** "solved it!" — the `board-margin` strip is a sibling of the board square, rendered at the same spot (`web/frontend/src/games/sudoku/SudokuBoard/SudokuBoard.vue:415-416`, comment at 411-414).
- **Stat-line** "0 backtracks — 1ms" — the line directly under the note (`SudokuBoard.vue:419`, derivation at 297-309).

In the owner shot the star occludes the letters of "solved it!" and crowds the tally. The star is an *overlay* stamped onto an *in-flow text column* — the collision is structural, not a tuning miss. Futoshiki mirrors it exactly (`FutoshikiBoard.vue:18-19,476`).

### 1.2 "Gold star" is painted green

The whole success system routes through one token — and the token lies:

```css
--color-gold-star: var(--color-crayon-green);  /* index.css:151 */
```

`solve-success` grid lines and the triple box-shadow both `color-mix` off `--color-gold-star` (`web/frontend/src/assets/index.css:300-311`); MarginNote's `gold-star` tone reads the same token (`MarginNote.vue:49-51`). The fiction says gold-star sticker; the paint says green wash. **The owner's "board turns GOLDEN rather than green" is, mechanically, a one-token truthing** — the routing already exists.

A real gold family already lives in the palette, unused for the solve: sun rays `#F0B030`, sparkle `#FDE68A` (`pencilConfig.ts:90`), moon body `#FFF4AA`, outline `#E5C74D` (`pencilConfig.ts:91`); the star itself fills `#FDE68A` / strokes `#F0B030` (`CelebrationStar.vue:109-111`).

### 1.3 Existing celebration machinery (all reusable)

- Three finite beats, ≤3.2s crest, all `sequence` subscribers or setTimeout windows (`pencilConfig.ts:267-296`): beat-1 reveal ~1.2s, beat-2 diagonal wiggle wavefront (onset 1.35s, cross 500ms, 2×600ms cycles), beat-3 murmur (one cell wiggle per 2.5s window — `pencil/composables/celebration.ts`).
- Star garnish: 350ms draw-on at 2650ms + 400ms foil gleam (`CELEBRATION.starDrawInMs/starCrestMs/gleamMs`, `pencilConfig.ts:292-295`); the gleam is a compositor-cheap mask-position sweep (`CelebrationStar.vue:144-180`). PRM: instant draw, no gleam (`CelebrationStar.vue:61-65`).
- Idempotent-re-solve guard: the star only crests when `animatingCells.size > 0` (`SudokuBoard.vue:119`).

### 1.4 Existing heart assets (confirmed = owner's heart.png)

- **CrayonHeart.vue** (`pencil/chrome/AttributionCard/CrayonHeart.vue`) — 6-layer crayon smiley: shadow lobe `#C9184A`, body `#FF4D6D` with 3.5px `#1a1a1a` outline, white highlight arc, dot eyes r=4, quadratic smile, blush ellipses `#FFB3C6`. Boiled by `#wobble-heart`. Dark mode: `opacity: 0.75; saturate(0.85)` (`CrayonHeart.vue:74-77`) — which is exactly why the owner's shot reads maroon.
- **wobble-heart filter** — `baseFrequency 0.02, numOctaves 2, scale 5, animScale 0.2, intervalMs 170` (`pencilConfig.ts:202-207`); also borrowed by ControlPanel/OptionSelector easter eggs.
- No yoshi-named assets exist (repo grep: only heart/star/celebration hits, list in lane notes).

## 2. Three formulations

All three share the non-negotiables from the brief: no modal, subtle, stars-and-gold, metadata deftly integrated, heart present, PRM honored. All ride pencil-boil `sequence` subscribers (chains=1/subscribers=10 budget) — no new schedulers, no keyframe swarms.

---

### Formulation A — "The Graded Page" (gold substrate + corner sticker)

**Composition.** Success is *gold*, wholesale: true the token —

```css
--color-gold-star: #C99A2E;              /* light: warm ochre-gold, ink-weight on paper */
.dark { --color-gold-star: #E5C74D; }    /* dark: the moon's own gold */
```

Grid lines re-ink gold through the existing 500ms stroke transition; the triple sticker-shadow follows automatically (it already `color-mix`es the token); MarginNote's "solved it!" turns gold with them. Green exits the success register entirely (it keeps its EASY-difficulty role, `index.css:130`).

The star stops being a margin squatter and becomes what its own comment claims it is — a foil sticker *pressed onto the returned worksheet*: reposition to the board's top-right corner, overlapping the frame (`top: -1.1rem; right: -0.9rem; rotate: 8deg`), same 3.25rem, same draw-on + gleam code untouched. Overlap is the sticker fiction; there's nothing under that corner to occlude.

Metadata: collapse the two margin lines into one composed graded-margin comment — gold voice + graphite tally in a single flow line:

> **solved it!** — 0 backtracks — 1ms

MarginNote grows an optional trailing `tally` slot (graphite, non-live — preserving the current deliberate "stat-line outside the live region" a11y stance, `SudokuBoard.vue:417-418`).

Heart: a small (1.5rem) CrayonHeart stamps in-flow at the end of the margin line, wiping in with the note's existing 250ms clip-path write-in (`MarginNote.vue:53-65`).

**Motion spec.** Zero new subscribers. Star crest/draw/gleam as-is; token transition covers the board; heart rides the note's CSS wipe. PRM: unchanged paths (star instant, no gleam; note un-animated).

**Soul-fit.** Highest fidelity to the graded-paper fiction — a gold star stuck on the corner of returned homework *is* the product's register. The heart is present but a garnish, not refined toward Yoshi — under-delivers on that clause of the brief.

---

### Formulation B — "Golden Hour" (gold wavefront + star scatter + heart crest)

**Composition.** The beat-2 diagonal wavefront carries gold light: as the front passes each cell, the glyph ink warms to `#F0B030` and settles back to graphite (a class toggle at wavefront onset, riding the existing flourish timing, `glyphAnimations.ts:81` + `wavefrontStepMs`). Grid lines settle gold behind it. At crest, 3–5 tiny stars (0.75–1rem) stamp at seeded deterministic positions around two board corners, 60ms stagger, one shared gleam. The heart crests last: a plush Yoshi-heart bounces in at top-center of the frame (scale 0→1.12→0.96→1, ~550ms easeOutBack), then sits quiet. Metadata: single merged margin line as in A, prefixed by an inline ★ glyph.

**Motion spec.** Glyph gold-warm = per-cell class toggle inside the existing beat-2 `sequence` windows (no added subscribers); star scatter = one `sequence` with staggered onProgress gates; heart bounce = one 550ms `sequence`. Total added crest cost ≈ 2 transient subscribers. PRM: instant gold settle, no wavefront recolor, no scatter (single static star), heart static.

**Soul-fit.** The gold-light-crossing-the-page image is genuinely lovely and the most *golden* of the three — but the star scatter flirts with confetti, the exact grammar the no-modal/subtle brief is fleeing, and the per-glyph recolor adds a new mechanism to beat 2 (more surface, more to keep inside the 3.2s cap). Medium-high fit; highest risk of reading as spectacle.

---

### Formulation C — "The Sticker and the Stamp" (heart-led, Yoshi's Story felt) — RECOMMENDED, on A's substrate

**Composition.** Built on A's gold token-truthing and merged margin line, then the heart takes the protagonist role the brief asks for:

- **The felt heart.** CrayonHeart refined toward Yoshi's Story craft language (N64 storybook: everything is fabric, felt, cardboard). Concretely: plusher lobes and a rounder bottom tip (soften the Béziers — the current `d` at `CrayonHeart.vue:31` has a near-pointed tip at `50 88`); a **stitch line** — a dashed inner stroke (`stroke-dasharray: 6 5`, ~1.5px, inset ~4 units from the outline, color `color-mix(in srgb, #1a1a1a 35%, #FF4D6D)`) — the single signature that says "sewn felt"; outline weight 3.5→4 for toy heft; bigger blush ellipses (rx 5→7); keep the dot eyes + smile exactly (they already match the owner's shot); keep `#wobble-heart` boil for the hand-made shimmer. Light body `#FF6B81`, dark keeps `#FF4D6D` under the existing dark-mode desaturation.
- **Placement + motion.** The heart bounces in at the board's **bottom-right corner** (diagonal opposite of the margin text — the collision class dies by geometry), ~2.75rem, slightly overlapping the frame like a second sticker: scale 0→1.15→0.95→1, ~550ms, felt-soft easeOutBack, onset at crest (2650ms, sharing `starCrestMs`). One blink ~1.8s after settle (eyes `scaleY 1→0.1→1`, 140ms, once) — the gentle-bounce-and-blink is the entire Yoshi vocabulary; nothing loops.
- **The star demotes to punctuation.** A 1.1em inline star glyph *inside* the margin note's text line — `★ solved it! — 0 backtracks — 1ms` — drawn as a tiny SVG with the existing gold fill/stroke pair, wiping in with the note. In flow, not overlay: the collision is impossible by construction. (Alternative within C: keep A's corner foil sticker instead of the inline star; both kill the collision. The inline star is the subtler read; the corner sticker is the stronger fiction. Owner's call — flag as an authoring decision.)
- **Beat 3 addendum.** The murmur occasionally (1-in-8 windows, seeded) wiggles the *heart* instead of a cell — the mascot breathes with the classroom. One line in `tickWindow()` (`celebration.ts:78-87`).

**Motion spec.** Heart bounce: one `sequence` subscriber, 550ms, delayed to crest. Blink: one setTimeout one-shot. Inline star: rides the note's clip-wipe, zero subscribers. Everything finite; murmur cadence unchanged. PRM: heart mounts static (no bounce, no blink), note un-animated, board gold settles via the token transition (500ms stroke transition should also gate to instant under PRM — currently `index.css:302` doesn't; note for authoring).

**Soul-fit.** Very high. The heart already closes the page in the attribution card ("made with ♥"); promoting it to the reward moment ties the two ends of the product together. Stitched felt sits squarely inside the construction-paper/crayon material family — it's the same craft table. And it's the only formulation that actually delivers every clause of the brief: gold board, star retained but disciplined, heart refined toward Yoshi, metadata in one deft line, no modal, subtle.

---

## 3. Recommendation

**C on A's substrate.** The four moves, in authoring order:

1. **True the gold token** — `--color-gold-star` gets real gold values per theme (`index.css:151` + a `.dark` override). One token; the entire success system (lines, shadow, note tone) follows. Green exits success.
2. **Kill the overlay collision by geometry** — the star leaves the margin strip: inline text-glyph in the note (subtlest) or top-right corner foil sticker (strongest fiction). Either way the `CelebrationStar` margin anchor (`CelebrationStar.vue:126-134`) is retired.
3. **Merge voice + tally** into one margin line (`solved it! — 0 backtracks — 1ms`), gold voice / graphite tally, stat text kept outside the live region as today.
4. **The felt heart** — CrayonHeart forked/refined (stitch line, plush lobes, heavier outline, bigger blush), bounce-in at bottom-right crest, single blink, murmur participation. Shared between Sudoku and Futoshiki like CelebrationStar is today (both boards mount the identical pattern — `SudokuBoard.vue:408`, `FutoshikiBoard.vue:476`).

Estimated blast radius: `index.css` (tokens + solve-success PRM gate), `CelebrationStar.vue` (reposition or inline-ification), `MarginNote.vue` (tally slot), one new `pencil/chrome/FeltHeart.vue` (or a CrayonHeart variant prop), `celebration.ts` (murmur heart hook), two board files (wiring). `CELEBRATION` config gains `heartCrestMs`/`heartBounceMs`. No new scheduler machinery; the ≤3.2s crest cap holds (heart settles ~3.2s, blink is post-crest ambient).

## 4. Evidence index

| Claim | Cite |
|---|---|
| Star overlays margin text, z-3, persists | `CelebrationStar.vue:104,126-134`; `solved-star.png` |
| gold-star token = green | `index.css:151`; `MarginNote.vue:49-51` |
| Success wash routes through one token | `index.css:297-311` |
| Gold family exists unused | `pencilConfig.ts:90-91`; `CelebrationStar.vue:109-111` |
| 3-beat budget, crest 2650ms | `pencilConfig.ts:276-296` |
| Murmur = 1 wiggle / 2.5s | `celebration.ts:70-87` |
| CrayonHeart = owner's heart.png | `CrayonHeart.vue:22-64,74-77`; `heart.png` |
| wobble-heart params | `pencilConfig.ts:202-207` |
| Futoshiki parity | `FutoshikiBoard.vue:18-19,187-202,476` |
| Idempotent re-solve guard | `SudokuBoard.vue:113-123` |
| Stat-line outside live region (keep) | `SudokuBoard.vue:417-419` |
| solve-success transition lacks PRM gate | `index.css:302,310` |
