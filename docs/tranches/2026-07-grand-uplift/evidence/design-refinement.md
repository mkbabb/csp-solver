# design-refinement — Pass 2 (pencil-aesthetic refinement spec)

**Agent**: design-refinement (Fable + frontend-design plugin, skill loaded) · **Pass 2, grand tranche development** · 2026-07-04
**Mode**: read-only against the primary tree; spec only, no code. Every parameter below is grounded in the current source (file:line) or derived from it with the derivation shown.

**Design stance (binding, restated).** REFINE, never replace. The Yoshi's-Story storybook identity — wobbly pencil grid, paper grain, crayon palette, hand-glyph digits, orange-sun mascot — is the soul of the app (`docs/grand-audit-2026-06-02.md:9`, aesthetic guardrail). Everything below deepens that identity: the celebration gets *more* storybook, the a11y gets expressed *in* pencil, the error states become paper moments. Zero glass-ui. All shared skin motion routes to `@mkbabb/pencil-boil` per the guardrail and synthesis §3.3.

**The organizing metaphor** (already latent in the code, now made explicit): the app is a page in a child's puzzle book. The grid is drawn in graphite, clues are printed ink, the user writes in blue ballpoint (`--color-user-ink`, `index.css:43`), the solver writes in rainbow sparkle (`SvgFilters.vue:156-162`), and the *teacher grades in red pencil*. Every new state — focus, error, loading, celebration — is spec'd as something that could physically happen on that page: a sketch ring, a red circle, a thinking scribble, a gold-star moment. Nothing arrives from outside the page (no toasts, no spinners, no glass).

---

## 0. Motion vocabulary as-built (baseline the spec refines)

| Mechanism | Cadence | Evidence |
|---|---|---|
| Grid line boil (path swap, 4 frames) | 150 ms (~6.7 fps, "on fours") | `pencilConfig.ts:83-89`, `HandDrawnGrid.vue:33-36` |
| Boil amplitudes: frame/subgrid/cell | 1.2 / 0.6 / 0.3 viewBox units | `pencilConfig.ts:86-88` |
| Grid draw-in (3 tiers, staggered+jittered) | 350/280/200 ms, stagger 30/25/10, jitter ±20/±25/±15, delays 0/150/300, easeOutCubic | `pencilConfig.ts:168-170`, `usePathAnimation.ts:57-82` |
| Grid erase | 150 ms easeInCubic, 4 ms/path stagger | `usePathAnimation.ts:115-121` |
| Glyph draw-in | 350 ms easeOutCubic | `pencilConfig.ts:171`, `HandwrittenGlyph.vue:88-91` |
| Glyph auto-wiggle (solved cells) | 2500 ms ±400 jitter, phase 0–2500, infinite alternate, per-cell rAF | `pencilConfig.ts:179`, `HandwrittenGlyph.vue:62-77`, `glyphAnimations.ts:66-73` |
| Glyph hover wiggle | 600 ms | `pencilConfig.ts:180` |
| Cell reveal | 300 ms cubic-bezier(0.68,−0.55,0.265,1.55), 15 ms/cell noise stagger | `index.css:176-187`, `SudokuBoard.vue:63` |
| Filter wobble: logo / celestial / heart | 550 / 160 / 170 ms setAttribute ticks | `pencilConfig.ts:109-126`, `SvgFilters.vue:38-45` |
| Celestial path boil: stars+sparkles / rays | 125 ms (~8 fps, `useLineBoil(4)` default) / 800 ms | `DarkModeToggle.vue:101-107` |
| Star twinkle (CSS steps) | 2 / 2.5 / 1.8 s, `steps(5,end)` | `DarkModeToggle.vue:264-286` |
| Sun breathe / ray spin | 6 s pulse ±3% / 240 s rotation | `DarkModeToggle.vue:216-236` |
| Logo reveal | 1.2 s clip-path, cubic-bezier(0.22,1,0.36,1) | `HandwrittenLogo.vue:47-53` |
| Theme toggle page-turn | 800 ms cubic-bezier(0.34,1.56,0.64,1) transform + 300/800 ms opacity | `DarkModeToggle.vue:180-208` |
| Dice / eraser / solve button one-shots | 500 / 400 / 500 ms | `ControlPanel.vue:84-86,443-456` |
| Scribble-underline burst on selection | 5 frames × 120 ms, then settle | `ControlPanel.vue:20-35` |
| Solve feedback | grid stroke transition 500 ms; failure shake 0.6 s ±4 px | `index.css:141-173` |

This vocabulary is *good*. The refinement work is (a) naming its implicit rules so new motion can't drift off-model, (b) replacing its one genuinely unintentional passage — the infinite post-solve wiggle swarm — with a designed celebration, and (c) extending it into the states that today have no in-world expression (focus, error, loading, empty).

---

## 1. Motion language spec

### 1.1 Cadence bands (formalized rule, new `MOTION` section in pencilConfig)

The existing intervals cluster into two ambient bands with a deliberate dead zone between:

- **Band A — stop-motion ambient**: 125–170 ms/tick (6–8 fps). Members today: grid boil 150, celestial wobble 160, heart wobble 170, star/sparkle boil 125, selection burst 120. **Rule**: any always-on hand-drawn jitter lives here. Values quantize to a 25 ms grid ({125, 150, 175}) once the unified scheduler (synthesis prototype 10) owns the clock — one master rAF, per-subscriber tick multiples, so co-prime intervals stop producing near-coincident double-paints.
- **Band B — lazy ambient**: 550–800 ms/tick. Members: logo wobble 550, sun-ray shape cycle 800. **Rule**: reserved for large or peripheral elements where 6–8 fps would pull the eye.
- **Dead band (intentional)**: nothing ambient may tick between 175 and 550 ms — a ~3 fps loop reads as jank, not stop-motion.
- **Band C — responsive one-shots**: 120–600 ms, user-triggered, finite. Hover wiggle 600, button anims 400–500, tooltip fade 150, ghost rect instant (opacity toggle, `SudokuCell.vue:146-152` — keep instant; cursor-tracking latency matters more than a fade).
- **Band D — choreographed sequences**: 150 ms–3.2 s composed timelines (draw-in ~800 ms total, erase ~150 ms + 4 ms·i, logo 1.2 s, celebration ≤3.2 s cap, §1.3). Always finite, always emitting a completion event, always PRM-substitutable (§1.6).

**Easing house style** (extracted from use): `easeOutCubic` for anything drawing *onto* the page; `easeInCubic` for anything leaving it (erase, `usePathAnimation.ts:119`); the back-out bounce `cubic-bezier(0.68,−0.55,0.265,1.55)` reserved for *pop* arrivals (cell reveal); the springy `cubic-bezier(0.34,1.56,0.64,1)` reserved for *physical* flourishes (theme page-turn). New motion picks from these four; no new beziers without a ledger entry.

### 1.2 Draw-in choreography (keep, with two corrections)

The three-tier grid draw-in (frame → subgrid → cell, overlapping delays 0/150/300 ms, seeded jitter `mulberry32(77)`, `usePathAnimation.ts:55`) is the signature intro and stays parameter-identical. Corrections:

1. **Dead presets pruned or wired**: `DRAW_IN_PRESETS.solveCell` (500/120) and `.logo` (1800/280) have zero consumers (grep across `src/` — only gridFrame/gridSubgrid/gridCell/glyph are referenced: `usePathAnimation.ts:58-60`, `HandwrittenGlyph.vue:89-96`). The logo actually reveals via a 1.2 s clip-path wipe (`HandwrittenLogo.vue:47-53`), which `ANIMATION.md:56` mis-documents as an 1800 ms stroke draw. Decision: delete both presets; the celebration spec (§1.3) defines its own timing block rather than resurrecting `solveCell`. (If the logo ever gets true stroke draw-in — it'd be lovely with Fraunces at 900 weight — re-add deliberately.)
2. **Erase/draw asymmetry is canon**: erasing at 150 ms + 4 ms stagger vs drawing at ~800 ms total is the right pencil physics (erasing is fast and careless, drawing is deliberate). Keep; document the ratio (~5:1) as intentional so nobody "fixes" it.

### 1.3 Solve celebration — "the gold-star moment" (the centerpiece of this spec)

**Today**: on solve success, every newly-filled cell draws in (noise stagger 15 ms/cell, `SudokuBoard.vue:63`), then each starts an *infinite* auto-wiggle (`HandwrittenGlyph.vue:95-99` → `glyphAnimations.ts:69` `iterationCount: Infinity`) on its own rAF chain — up to ~144–256 chains on a 16×16 (sota-svg-anim-perf F2, fe-glyph-anim §3). It's chaotic (unphased, unbounded), it never resolves, and it costs forever. The grid recolor to green (500 ms) is the only orchestrated part.

**Design intent**: a celebration is a *moment*, not a state. It should crest and settle — like a class cheering, then going back to quiet reading. Three beats, one timeline, finite, total ≤3.2 s:

**Beat 1 — the reveal wave (0 → ~1.35 s).** Keep the noise-shuffled draw-in exactly as-is per cell (300 ms `cell-reveal` pop + 350 ms glyph stroke draw-in, sparkle-rainbow ink), but make the stagger *board-normalized*: `stagger_ms = clamp(round(1200 / blankCount), 4, 24)`. Today's fixed 15 ms/cell gives ~0.75 s on a 9×9 (~50 blanks) but ~3 s on a full 16×16 (~200 blanks) — the wave outstays its welcome exactly when the board is most impressive. Normalized: reveal window ≈1.2 s at every size (9×9 → 24 ms/cell, 16×16 → 6 ms/cell). Grid recolor to crayon-green (existing 500 ms stroke transition, `index.css:142-153`) starts at t=0 so the page "warms" under the wave.

**Beat 2 — the flourish wave (~1.5 → ~3.1 s).** After a 150 ms breath, one diagonal wave sweeps the board: each solved cell plays **exactly two** wiggle cycles (variant swap, 600 ms/cycle — the existing `hoverWiggleDuration`, `pencilConfig.ts:180`) with onset delay `(row + col) × wavefront_ms`, where `wavefront_ms = round(500 / (2·N − 2))` so the front crosses any board in ~500 ms (9×9 → 31 ms; 16×16 → 17 ms). Optionally each cell pairs the wiggle with one scale pulse 1.0 → 1.06 → 1.0 over 300 ms (the reveal bezier) as the front passes — the cells "do the wave," Yoshi-style. Given/user cells don't move — only the solver's rainbow ink celebrates; the user's own writing stays dignified. Implementation constraint (this is what the unified scheduler enables): the whole beat is **one** timeline subscriber with per-cell phase offsets computed once from `(row, col)` — zero per-cell `Animation` instances, vs today's 144–256.

**Beat 3 — settle into murmur (>3.1 s, steady state).** All glyphs freeze on their base variant (dasharray cleaned — fe-glyph-anim §2's fix is prerequisite, else the dash-gap defect becomes visible at rest). Ambient replacement for the infinite swarm: a **classroom murmur** — the shared scheduler wakes *one* solved cell per 2.5 s window (seeded `mulberry32(boardGeneration × 31 + windowIndex)` so replays are deterministic), playing a single 600 ms wiggle cycle. Duty cycle at 16×16: 1 concurrent wiggle vs 256 — a >99% reduction with the board still visibly *alive* if you watch it. On any user edit, murmur skips that window (the page is being written on).

**Optional accent (P3)**: if the celestial toggle is on-screen, the sun (light) / moon (dark) does one 800 ms beam pulse — the existing `gentle-pulse` amplitude raised for one cycle (scale 0.97–1.03 → 0.95–1.10) on the existing springy bezier — then resumes its 6 s breathe. One pulse, not a loop.

**Consecutive solves** are idempotent today (`useSudoku.ts:127-138` fills only blanks); a re-solve with zero new cells should skip beats 1–2 and play only the grid recolor — no empty fanfare.

### 1.4 Failure — "the teacher's red pencil"

**Today**: grid strokes → red + 0.6 s shake + red-tinted shadow (`index.css:155-166`), and `solveState='failed'` conflates "your entries conflict" with network failure (`useSudoku.ts:140-142`, synthesis F5). The shake + recolor stay (they're good — the page flinches). Additions, all gated on the typed-error split landing (network errors go to §5.2's note card, *never* the red pencil — the teacher only grades actual work):

1. **Red-pencil circle marks.** The domain layer can locate conflicts locally (duplicate in row/col/box — pure derivation over `values`, belongs in `sudoku/`). The skin draws a hand-drawn ellipse around each conflicting cell: seeded 2-pass wobble ellipse (same generation family as `ghostPath` / `wobbleRect`, `gridPaths.ts` cellRects), stroke `--color-crayon-rose`, width 6, opacity 0.85, drawn on via dashoffset over 450 ms easeOutCubic, 80 ms stagger between marks, **max 5 marks** (a real teacher circles the first few mistakes, not all of them; also bounds cost). Marks erase (200 ms dashoffset out, easeInCubic) the moment the user edits any marked cell.
2. **Marginalia** (§4.3): "not quite — check row 4" in Patrick Hand, crayon-rose, from the same aria-live region that announces it to AT. Row picked from the first conflict.
3. Shake stays 0.6 s ±4 px but is suppressed under PRM (§1.6); recolor + marks carry the meaning without motion.

### 1.5 Idle vs active states

- **Idle (board open, no interaction)**: Band A/B ambient only — grid boil, logo wobble, celestial boil, murmur (§1.3 beat 3). Nothing else moves. All ambient motion pauses on hidden tab (uniform, via the one scheduler — closes `SvgFilters.vue`'s missing visibility gate, fe-boil-pipeline F1).
- **Active (hover/focus)**: cell ghost rect (instant), hover wiggle 600 ms (non-solved cells only, `HandwrittenGlyph.vue:134`), selector ghost underline, `wobble-heart`/`wobble-celestial` hover filters (`ControlPanel.vue:334-357`, `OptionSelector.vue:54-56`). These stay within the documented small-area filter envelope (sota-svg-anim-perf F6) — **rule: no `wobble-*` filter ever targets an element larger than the logo**.
- **Working (loading)**: §5.1. Board input disabled with `cursor: progress`; ambient boil continues (the page doesn't freeze while the solver thinks).

### 1.6 PRM tiers (reduced-motion equivalents, per state)

One reactive source — pencil-boil's `usePrefersReducedMotion()` once exported (synthesis §3.3 release train), replacing the four frozen-snapshot reimplementations (`SvgFilters.vue:16-18`, `useReducedMotion.ts`, pencil-boil `vue.ts:118`, global CSS). Mid-session flips take effect immediately (M2). The global CSS clamp (`index.css:211-216`) stays as backstop.

| State | Full motion | PRM equivalent |
|---|---|---|
| Ambient (boil, wobble, twinkle, murmur) | Bands A/B | **Off entirely** — frames freeze on frame 0 |
| Grid draw-in / erase | 3-tier choreography | Instant show/hide (already implemented: `usePathAnimation.ts:40-46,100-106`) |
| Cell reveal + glyph draw-in | pop + stroke draw | 150 ms opacity fade, no scale, no dash animation |
| Celebration | 3 beats | Grid recolor only (500 ms *color* transition — color change is not motion) + instant glyph reveal + marginalia text |
| Failure | shake + recolor + drawn marks | recolor + marks appear instantly (no draw-on) + marginalia |
| Theme toggle | 800 ms page-turn | 200 ms opacity crossfade (already implemented, `DarkModeToggle.vue:239-249`) |
| Loading scribble (§5.1) | draw/erase loop | static scribble glyph + "solving…" marginalia text |
| Logo | 1.2 s clip wipe | instant (already implemented, `HandwrittenLogo.vue:64-69`) |

---

## 2. Texture / grain system spec (grain-overlay hoist compatibility)

### 2.1 The two grain scales (formalize, don't merge)

The skin already runs two textures at two frequencies, and they're doing different jobs:

- **PAPER_TOOTH** — the page itself: `feTurbulence baseFrequency=0.9, numOctaves=3` rasterized in a 60×60 data-URI tile, opacity **0.18 light / 0.04 dark** (`index.css:55,93`), tiled over `body` with `background-attachment: fixed`. Zero runtime cost. Untouched by the hoist.
- **STROKE_GRAIN** — the pencil's tooth on each stroke: `grain-static` = `feTurbulence fractalNoise 0.04/oct 3/seed 2` → `feDisplacementMap scale 2.5`, margin 5% (`pencilConfig.ts:104-108`). This is the one being hoisted (synthesis §3.3 item 3, prototype 9): it currently wraps the boil-cycling grid `<g>` (`HandDrawnGrid.vue:95`) and re-rasterizes the full board every 150 ms tick for parameters that never change.

### 2.2 Hoist design — preferred shape: **bake the grain into the boil frames** (geometric, zero-filter)

`grain-static` on the grid is *displacement*, not overlay — it chatters stroke edges. A plain textured overlay can't reproduce that, so visual parity demands the displacement move into the geometry that's already pre-computed per frame (`generateGridBoilFrames`, `gridPaths.ts:202-295`):

- **Resample** each grid line at **8 viewBox-unit steps** (noise wavelength = 1/0.04 = 25 units; 8-unit sampling is ~3× Nyquist for that field). A 1000-unit line → ~125 points.
- **Displace** each sample by a seeded value-noise field: amplitude **±1.25 units** (= feDisplacementMap scale 2.5 / 2, matching the filter's peak-to-peak), wavelength 25 units, 3 octaves, persistence 0.5, seed 2 (keep the canonical seed so the character is stable). Generator: `mulberry32`-backed value noise in pencil-boil (natural sibling to `useBoilFrames()` in the release train).
- Frames are generated once per structural tuple and LRU-cached exactly as today (`gridPaths.ts:31-41`) — cost moves from every-tick raster to one-time generation. Estimated string growth: 9×9 = 17 elements × 4 frames × ~125 pts ≈ 8.5 K points total — fine for a cached one-time build.
- The `<g>` filter attribute is then **dropped entirely** for the grid; per-tick cost becomes pure path repaint.

**Fallback shape** (if the flip-test fails, below): static full-board overlay `<rect>` carrying `grain-static` in a *sibling* layer (never sharing a paint group with animating geometry), blend **multiply in light / screen in dark** — mirroring the existing `stroke-light`/`stroke-dark` blendMode convention (`pencilConfig.ts:130,135`). This yields tooth-over-everything rather than edge chatter; acceptable but visibly softer, hence second choice.

**Parity gate** (adopts prototype 9's metric): static-frame pixel diff of hoisted vs current at 2× DPR — SSIM ≥ 0.98 — plus a human side-by-side flip test at 2× zoom on the frame tier (thickest stroke, most visible chatter). Per-tier verdicts allowed: if only the frame tier fails the flip test, the frame keeps geometric grain at a denser 6-unit resample while subgrid/cell use 8.

### 2.3 What keeps its filter

- **Glyphs**: per-glyph `grain-static` (`HandwrittenGlyph.vue:205`) stays — 40×56 viewBox regions, repaint only on that glyph's own geometry change; squarely inside the small-area envelope. (Wiggle variant swaps do retrigger it, but murmur mode (§1.3) makes that ≤1 glyph at a time instead of 256.)
- **Icons/buttons/divider**: `grain-static` on `.icon-btn` (`ControlPanel.vue:350`) and the boil divider (`ControlPanel.vue:168,257`) stay — the divider is small (1000×16 viewBox band) and the hoist decision is board-scoped. If the divider's 6.7 fps + filter shows up in prototype 9's trace, bake its grain the same geometric way (it's already frame-generated: `generateLineBoilFrames`, `ControlPanel.vue:38-44`).
- **wobble-\*** and **stroke-\*** presets: untouched (small-area, and stroke-light/dark are static).

### 2.4 Dark-mode grain

Displacement is color-agnostic — the geometric bake behaves identically in both themes (a genuine advantage over the overlay fallback, which needs the multiply/screen fork). Paper tooth stays asymmetric by design: 0.18 vs 0.04 opacity — dark mode is a *slate*, not a photocopy of the light page; grain whispers there. If the overlay fallback ships, its opacities follow the same ratio: overlay alpha ≈ 0.10 light / 0.03 dark, tuned at the parity gate.

---

## 3. Crayon palette tokens (formalized)

### 3.1 Inventory — every color in the skin, by owner

| Family | Values (light → dark) | Where | Role |
|---|---|---|---|
| Crayon ramp | green `#2DC653→#3DD968`, orange `#F4A236→#F5B35C`, rose `#E8315B→#FF5C7C`, blue `#4A90D9→#6AABEB` | `index.css:46-49,86-89` | difficulty labels, accents |
| Difficulty ramp (near-duplicate!) | easy `hsl(142 71% 45%)→hsl(142 71% 35%)`, medium `hsl(45 93% 47%)→…37%`, hard `hsl(0 84% 60%)→hsl(0 62% 40%)` | `index.css:38-40,80-82` | solve-feedback grid strokes |
| Ink | foreground `hsl(0 0% 3.9%)→hsl(48 10% 92%)`; user-ink `#2563eb→#60a5fa`; grid graphite `hsl(0 0% 15%)→hsl(48 10% 80%)` | `index.css:18,43,52,84,91` | printed clues / student pen / pencil lines |
| Sparkle rainbow | `#f9a8d4, #c4b5fd, #93c5fd, #6ee7b7, #fde68a` | `SvgFilters.vue:156-162` | solver's ink |
| Celestial (hardcoded in template!) | sun `#E88845/#D16A32/#F09855/#F0B030/#FDE68A`; moon `#FFF4AA/#E5C74D/#FFFFFF` | `DarkModeToggle.vue:20-49,63-87` | mascot |
| YOSHI_COLORS | outlineBlack `#1a1a1a`; heart `#FF4D6D/#C9184A/#FFB3C6`; apple/banana/grapes/leaf/vine = stock Tailwind red-500/amber-400/violet-500/green-500/green-600 | `pencilConfig.ts:17-26` | decoratives (mostly dying with the F1 excision) |

### 3.2 The Yoshi's-Story saturation logic (measured, now a rule)

Converting the crayon ramp to HSL exposes the dark-mode transform actually in use:

| Token | Light | Dark | Δ |
|---|---|---|---|
| green | hsl(135, 63%, 48%) | hsl(137, 67%, 55%) | H +2°, S +4, **L +7** |
| orange | hsl(34, 90%, 58%) | hsl(34, 88%, 66%) | H 0, S −2, **L +8** |
| rose | hsl(346, 80%, 55%) | hsl(348, 100%, 68%) | H +2°, S +20, **L +13** |
| blue | hsl(211, 65%, 57%) | hsl(210, 76%, 67%) | H −1°, S +11, **L +10** |

**Rule (codify in the token layer)**: dark variants preserve hue (±3°), raise lightness +7…+13, and let saturation *rise* as needed to hold perceived chroma on the dark ground — i.e., in OKLCH terms, **constant-chroma, L +0.06…0.10, hue-locked**. Crayons don't desaturate at night; the paper darkens and the wax glows. This is the opposite of the typical "muted dark mode" default and it's exactly why the app reads as storybook in both themes — write it down so no future token gets the generic treatment.

The base (light) crayon logic: saturated mid-tones (S 63–90%, L 48–58%) on a warm off-white (`hsl(48 15% 98%)`), outlines in near-black `#1a1a1a` — flat poster color inside dark hand-drawn outlines, never gradients (the sparkle-rainbow is the single sanctioned gradient, reserved for the solver's "magic ink").

### 3.3 Token consolidation (P2 — the palette has drifted into duplicates)

1. **Difficulty ≙ crayon — merge the ramps.** `--color-easy/medium/hard` are a parallel, *non-identical* green/orange/red set. Worse, the solve-feedback is internally split: success grid strokes use `--color-easy` hsl(142 71% 45%) while the success shadow hardcodes literal crayon-green rgba(45,198,83,…) = `#2DC653` (`index.css:148-151`), and the failure shadow hardcodes crayon-rose rgba(232,49,91,…) (`index.css:158-161`) while failure strokes use `--color-hard`. Two greens and two reds on screen in the same moment. **Spec**: `--color-easy → var(--color-crayon-green)`, `--color-medium → var(--color-crayon-orange)`, `--color-hard → var(--color-crayon-rose)`; shadows reference the same vars via color-mix. One green, one red, everywhere.
2. **Two blues are intentional — name them.** `--color-user-ink` (#2563eb, the student's ballpoint) vs `--color-crayon-blue` (#4A90D9, the crayon accent) serve different fictions. Keep both; document roles so they don't get "unified" by accident.
3. **Three reds → one.** `--color-destructive` hsl(0 84.2% 60.2%) (`index.css:31`) is a shadcn leftover with the abandoned scaffold (synthesis F2); alias to crayon-rose or delete with the scaffold.
4. **Celestial hexes move to config.** The 8 sun/moon hexes hardcoded in `DarkModeToggle.vue` join `YOSHI_COLORS.celestial` (`pencilConfig.ts`) — prerequisite for the M4 `useCelestialSun()` lift into pencil-boil (the mascot can't ship to the shared lib with its palette welded into one consumer's template).
5. **YOSHI_COLORS fruit entries** (Tailwind stock hexes) die with the dead decorative subtree (synthesis F1); `heart` survives (CrayonHeart is live in AttributionCard). `outlineBlack` is the real keeper — promote it to `--color-pencil-graphite` beside `--grid-line-color`.

### 3.4 Semantic state tokens (all in-world)

| Token | Light / dark | Fiction | Used by |
|---|---|---|---|
| `--color-pencil-graphite` | hsl(0 0% 15%) / hsl(48 10% 80%) (= existing `--grid-line-color`) | the pencil | grid, ghost ring, hover sketch |
| `--color-user-ink` | #2563eb / #60a5fa (existing) | student's ballpoint | user glyphs |
| `--color-teacher-red` | = `--color-crayon-rose` | teacher's red pencil | failure strokes/shadow, conflict circles, error marginalia, `aria-invalid` |
| `--color-gold-star` | = `--color-crayon-green` for strokes; `#FDE68A` (already the sun-sparkle/rainbow terminal stop) for star accents | gold-star sticker | success strokes/shadow, celebration accents |
| `--color-focus-sketch` | = `--color-crayon-blue` | teacher underlines where to look | keyboard focus ring (§4.2) |

No new hexes anywhere in this table — every state color is an alias into the existing crayon system. That's the point: the states join the world instead of importing Bootstrap semantics.

---

## 4. Hand-drawn a11y patterns (semantics bolted *in*, not on)

Adopts fe-components-audit §2/§11 as the semantic baseline (P1: zero ARIA on the board; unlabeled inputs; visual-only state) and specs the *visual* half so the fixes deepen the aesthetic instead of arriving as browser defaults.

### 4.1 ARIA grid + roving tabindex

- Semantics per fe-components-audit §2 verbatim: `role="grid"` + `aria-label` ("9 by 9 sudoku board, medium") + `aria-rowcount/colcount` on `.board-cells` (`SudokuBoard.vue:117`); `role="gridcell"` + `aria-rowindex/colindex` on the cell wrapper; computed `aria-label` per input ("Row 3, column 4, given clue 7" / "…, your entry 5" / "…, solver's answer 2" / "…, empty") — pure derivations from props the components already hold, enriched by the `cellKind` discriminated prop (fe-components-audit §12).
- **Roving tabindex (new here)**: today all `boardSize²` inputs are Tab stops — 256 presses to cross a 16×16. Spec the ARIA grid keyboard pattern: one Tab stop for the whole board; Arrow keys move cell focus; Home/End → row ends; Ctrl+Home → cell 1; typing a digit writes (existing `handleInput` semantics unchanged, `SudokuCell.vue:50-71`); Backspace/Delete clears (existing, `:73-80`). Focused cell carries `tabindex="0"`, all others `−1`.
- Board container announces solve results via the marginalia live region (§4.3), not per-cell.

### 4.2 The pencil-sketch focus ring

The machinery already exists — the ghost wobbleRect shows on hover *and* focus (`isActive = isHovered || isFocused`, `SudokuCell.vue:29`) — but keyboard focus is currently indistinguishable from hover, plus a generic 1px outline (`index.css:190-195`). Spec — three ghost-path tiers, same `ghostPath` geometry, different pencil pressure:

| State | Stroke | Width | Opacity | Fill | Extra |
|---|---|---|---|---|---|
| Hover | `--color-pencil-graphite` | 5 | 0.65 | graphite 0.06 | instant (current values, `SudokuCell.vue:154-163`) |
| `:focus-visible` (keyboard) | `--color-focus-sketch` (crayon-blue) | 7 | 0.9 | crayon-blue 0.08 | 180 ms dashoffset draw-on, easeOutCubic — the ring is *sketched* when focus arrives; instant under PRM |
| `aria-invalid` (conflict) | `--color-teacher-red` | 6 | 0.85 | none | the §1.4 circle mark doubles as the invalid indicator |

Contrast check: crayon-blue #4A90D9 on the cream ground hsl(48 15% 98%) ≈ 3.3:1, `#6AABEB` on hsl(24 8% 6%) ≈ 8:1 — both clear WCAG 2.4.13's 3:1 for focus indicators, and width 7 in a cell-sized viewBox far exceeds the area minimum. Keep a `outline: 2px solid transparent` on the focused input so `forced-colors` (Windows High Contrast) paints its own visible ring where SVG strokes may be ignored. Delete the generic `index.css:190-195` block once this lands.

### 4.3 Marginalia — the status voice of the page

One element, bottom-left margin below the board: Patrick Hand (`--font` utility exists, `index.css:203-206`), 1–1.1 rem, `role="status" aria-live="polite"`. It *is* the live region — sighted users and AT read the same handwriting:

- Solve success: "solved it!" in crayon-green (+ optional tiny hand-drawn star from the SolveIcon sparkle family).
- Failure: "not quite — check row 4" in teacher-red.
- Loading >2.5 s: "still sharpening the pencil…" in graphite.
- Board loaded: "a fresh 9×9, medium" (also fixes the silent randomize).

Text writes in with a 250 ms clip-path wipe (the logo's own reveal mechanic, `HandwrittenLogo.vue:47-53`, shortened); instant under PRM. Network errors do NOT go here — they get `role="alert"` in the note card (§5.2); the marginalia voice is the page commenting on the *puzzle*, never on infrastructure.

### 4.4 Remaining semantic fixes, in-aesthetic

- **OptionSelector** (`OptionSelector.vue:28-45`): `role="radiogroup"` + `aria-checked` per fe-components-audit §11.5 — the scribble underline *is* the selected-state visual and needs no change; the semantics just catch up with it. The 5-frame underline burst on change (`ControlPanel.vue:20-35`) is the perfect selection-confirm micro-moment; keep.
- **Tooltips on keyboard focus**: `.group:hover .tooltip` (`ControlPanel.vue:387-389`) gains `:focus-visible` within — same hand-lettered tooltip, now reachable without a mouse.
- **Logo**: `aria-level="1"` on the `role="heading"` svg (`HandwrittenLogo.vue:28`) — the wordmark is the page title.
- **Decorative svgs** (`DiceIcon`, `SolveIcon`, `DarkModeToggle` inner svgs): `aria-hidden="true"` — parents already carry labels (`ControlPanel.vue:179,187,197`).
- **AttributionCard** interactive nesting → real `<button>` per fe-components-audit §3; visual unchanged.
- **`prefers-contrast: more`**: raise cell-line stroke-opacity 0.7 → 0.9 and subgrid 0.9 → 1.0 (`HandDrawnGrid.vue:116,129`), and suppress glyph grain displacement (text-adjacent legibility) — the wobble geometry stays, the pencil just presses harder.

---

## 5. Empty / loading / error states as storybook moments

### 5.1 Loading — the thinking scribble

**Today**: a stock Tailwind `animate-spin` arc (`ControlPanel.vue:199,292`) — the one visibly off-world element in the whole app. Replace with a **pencil thinking-scribble**: a seeded 3-loop scribble path (24×24 viewBox, generated by the `scribbleUnderline.ts` family generator, roughness ≈ `PENCIL.gridCell` 0.3), animated by dashoffset — draw 450 ms easeInOutCubic → hold 100 ms → erase 350 ms easeInCubic → 100 ms gap; 1000 ms cycle, looping while `loading`. It's what you doodle while thinking. PRM: static scribble at 0.6 opacity + "solving…" marginalia.

**Timing tiers** (so the scribble never flashes on fast solves — the Rust solver returns most boards in milliseconds):
- 0–150 ms: nothing (no flash).
- >150 ms: button scribble replaces the solve icon; board inputs disabled, `cursor: progress`; ambient boil continues.
- >2.5 s: marginalia "still sharpening the pencil…".
- Client timeout (share the server's 30 s constant per synthesis F5): → §5.2 with the timeout variant.

### 5.2 Error — the paper note

`errorMessage` is currently assigned and rendered nowhere (grep: zero consumers outside `useSudoku.ts`; synthesis F5). Spec: a small **hand-drawn note card** sliding in below the board — `HandDrawnOutline` wrapper (exists, stroke-width 3), `bg-card`, `cartoon-shadow-sm`, Patrick Hand text, `role="alert"`:

- Network/API failure: "couldn't reach the solver." + a hand-drawn *try again* button (icon-btn style).
- Timeout: "this one's a real head-scratcher — the solver gave up at 30 seconds."
- Entry: 250 ms translateY(8 px)→0 + fade, easeOutCubic; PRM: fade only. Dismiss on retry or next successful action.

The card is honest and plain — the storybook dressing is the *paper*, not purple copy. Critically, this splits the two failure fictions: wrong answer = teacher's red pencil on the board (§1.4); broken infrastructure = a note pinned to the page. Today both collapse into `solveState='failed'` and the user is told their answer is wrong when the network hiccuped.

### 5.3 Empty / cleared

The erase-then-redraw cycle on clear (via `boardGeneration`, `SudokuBoard.vue:85-95`) is already the right moment and stays. Optional garnish (P3): 3–5 graphite eraser-crumb specks scattering-fading 400 ms after clear, timed to the existing `eraserScrub` button animation (400 ms, `ControlPanel.vue:443-456`). Marginalia: "a fresh page." No further empty-state chrome — an empty sudoku grid is not an error, it's an invitation.

---

## 6. Component-level notes, mapped to the target `src/` topology

Mapping uses fe-architecture §4's two-layer tree (adopted by synthesis §3.3): `sudoku/` (domain) and `skin/` (pencil).

| Target location | Design-refinement notes (this spec) |
|---|---|
| `skin/config/pencilConfig.ts` | New sections: `MOTION` (cadence bands §1.1 + the four house easings), `CELEBRATION` (stagger clamp, wavefront, murmur window, mark params — §§1.3-1.4), `GRAIN` (resample step 8, amplitude ±1.25, wavelength 25 — §2.2). Delete dead `DRAW_IN_PRESETS.solveCell/.logo` (§1.2). Absorb celestial hexes into `YOSHI_COLORS.celestial`; add `--color-pencil-graphite`/state aliases (§3.4). Prune fruit entries with the F1 excision. |
| `skin/components/grid/HandDrawnGrid.vue` + `gridPaths.ts` | Grain bake into boil frames (§2.2); drop the group filter (`:95`); `will-change: transform` measure-first per sota-svg F4. Draw-in/erase params unchanged. |
| `skin/components/glyph/HandwrittenGlyph.vue` (+ `glyphAnimations.ts`, registry) | Loses per-cell infinite wiggle ownership: draw-in + hover wiggle stay local; celebration/murmur participation becomes phase data consumed from the shared timeline (§1.3). Takes single `cellKind` prop (fe-components-audit §12). Dasharray cleanup + build-time lengths (fe-glyph-anim §2/§5) are prerequisites for beat 3's clean freeze. Keeps its small-area grain filter (§2.3). |
| `skin/components/chrome/DarkModeToggle.vue` | Celestial palette → config (§3.3.4); one-shot beam pulse hook (§1.3 accent); fix the stale "50s" comment vs the actual 240 s spin (`:216-219`); `aria-hidden` on inner svgs. Filter application is *already* theme-conditional (`:14,59`) — see §7.4. |
| `skin/components/chrome/BoilDivider.vue` (new, per fe-architecture §3.1) | Extracts `ControlPanel.vue:16-52,157-171,246-260`; divider grain follows the board's hoist verdict (§2.3). |
| `skin/components/chrome/OptionSelector.vue` | radiogroup + `aria-checked` (§4.4); scribble underline unchanged; selection burst stays 5×120 ms. |
| `skin/components/chrome/ScribbleLoader.vue` (new) | §5.1's thinking scribble — generated from `scribbleUnderline.ts`'s family, exported as the app-wide loading primitive (replaces both `animate-spin` sites). |
| `skin/components/chrome/MarginNote.vue` (new) | §4.3 marginalia live region + §5.2 note card variant (`role="status"` vs `role="alert"` prop). Patrick Hand, clip-path write-in. |
| `sudoku/components/SudokuBoard/SudokuBoard.vue` | ARIA grid attrs + roving-tabindex keyboard controller (§4.1); board-normalized reveal stagger (§1.3 beat 1: `clamp(round(1200/blanks), 4, 24)` replaces the fixed 15 at `:63`); celebration *trigger* lives here (domain event → one skin timeline), conflict detection (§1.4) computed here and passed as marks. |
| `sudoku/components/SudokuBoard/SudokuCell.vue` | Ghost-tier focus ring (§4.2); `gridcell` semantics + computed label; `aria-invalid` wiring; delete generic focus CSS (`index.css:189-195`). |
| `sudoku/components/ControlPanel/ControlPanel.vue` | Swaps spinner for `ScribbleLoader`; tooltip `:focus-visible`; single reactive mount per fe-components-audit §4. |
| `sudoku/composables/useSudoku.ts` / `useApi.ts` | Typed `ApiError` split (synthesis F5) is the gate for §1.4 vs §5.2's two fictions; client timeout shares the 30 s server constant; `errorMessage` finally gets its consumer (`MarginNote`). |
| `@mkbabb/pencil-boil` (release train) | `usePrefersReducedMotion()` export; unified scheduler with subscriber kinds (frame / filter-param / **sequence** — the celebration timeline is the new kind); `useBoilFrames()` cache; value-noise generator for the grain bake (§2.2); `useCelestialSun()` per M4. |

**Dependency ordering**: the celebration (§1.3) requires the unified scheduler (prototype 10) + keyframes.js 5.x migration (prototype 8) + glyph dasharray/length fixes; the grain spec (§2) is prototype 9's design target; the a11y specs (§4) and state specs (§5) are independent and can land first.

---

## 7. Config/doc drift ledger (found while grounding this spec)

1. **`DRAW_IN_PRESETS.solveCell` and `.logo` are dead config** — zero consumers (grep; only gridFrame/gridSubgrid/gridCell/glyph referenced at `usePathAnimation.ts:58-60`, `HandwrittenGlyph.vue:89-96`). `ANIMATION.md:55-56` documents both as live. P3, delete with §1.2.
2. **`web/frontend/CLAUDE.md:134` documents `subgridBoil (0.8), cellBoil (0.5)`** — actual defaults are 0.6/0.3 (`pencilConfig.ts:87-88`). `ANIMATION.md:32` documents grain-static scale 3.5 (actual 2.5, `pencilConfig.ts:107`) and `:33` wobble-logo 450 ms (actual 550, `pencilConfig.ts:113`). Feeds the G6 docs rewrite; the spec above uses the *source* values throughout.
3. **`DarkModeToggle.vue:216` comment says "50s full rotation"; the keyframe is 240 s** (`:219`). `web/frontend/CLAUDE.md:39` repeats 50 s against a phantom `SpiralSun.vue`. P3 comment fix.
4. **fe-boil-pipeline F6 appears stale against the current tree**: it claims sun and moon *both always* reference `wobble-celestial`; the working tree applies the filter conditionally per theme (`:filter="!isDark ? 'url(#wobble-celestial)' : undefined"`, `DarkModeToggle.vue:14,59`), matching `ANIMATION.md:100`'s documented "conditional filter application," and CSS pauses animations on the inactive icon (`:210-214`). The inactive-icon filter cost F6 describes doesn't exist as written — the pass-2 plan should drop or re-verify that item rather than budget a fix for it.

---

## 8. Findings ledger (severity per Pass-1 framing)

| # | Sev | Class | Anchor | Finding → design answer |
|---|---|---|---|---|
| D1 | P1 | motion/perf/design | `HandwrittenGlyph.vue:95-99`, `glyphAnimations.ts:69` | Post-solve state is an unbounded, unphased, infinite wiggle swarm (up to 256 rAF chains) — replaced by the finite 3-beat gold-star celebration + murmur idle (§1.3), one scheduler timeline, ≤3.2 s crest, ≥99% steady-state duty-cycle cut. |
| D2 | P1 | a11y/design | `SudokuBoard.vue:117`, `SudokuCell.vue:88-108`, `index.css:189-195` | Board a11y absent and the only focus affordance is a generic 1px outline — ARIA grid + roving tabindex + three-tier pencil-sketch ghost ring, contrast-verified (§4.1-4.2). |
| D3 | P1 | UX/design | `useSudoku.ts:140-142`, `ControlPanel.vue:199,292`, errorMessage (0 consumers) | No rendered error/loading/status language; network failure masquerades as a wrong answer; the spinner is off-world — teacher-red-pencil failure vs paper-note error split, thinking-scribble loader with timing tiers, marginalia live region (§§1.4, 4.3, 5). |
| D4 | P2 | tokens | `index.css:38-49,80-89,148-161`, `SvgFilters.vue:156-162`, `DarkModeToggle.vue:20-87` | Palette drift: duplicate difficulty/crayon ramps, mixed hardcoded/var solve-feedback colors, three reds, template-welded celestial hexes — consolidated token system + measured dark-mode saturation rule (§3). |
| D5 | P2 | texture | `HandDrawnGrid.vue:95`, `pencilConfig.ts:104-108` | Grain hoist needs a *parity* spec, not just a perf fix — geometric grain bake (resample 8 units, ±1.25 amplitude, wavelength 25) with SSIM ≥ 0.98 + flip-test gate, overlay fallback with multiply/screen theme fork (§2). |
| D6 | P2 | motion-system | `pencilConfig.ts` (whole) | Cadence/easing rules are implicit — formalized bands A–D, dead band 175–550 ms, four house easings, small-area filter rule (§1.1, §1.5). |
| D7 | P3 | drift | §7 items 1–4 | Dead presets, doc/comment drift, one stale pass-1 finding (F6) — cheap deletions plus one plan correction. |
| D8 | P3 | garnish | §1.3 accent, §5.3 | Sun beam pulse, eraser crumbs — optional, only after P1/P2 land. |

## Handoffs

- **Prototype 9 (`grain-static-overlay`)**: §2.2 is its design target — the geometric-bake shape and the SSIM/flip-test acceptance gate; report back per-tier verdicts.
- **Prototype 10 (`unified-boil-scheduler`)**: the celebration timeline is its third subscriber kind (`sequence`) and its acceptance demo — "1 rAF chain on a solved 16×16" should be measured *during* beat 2, the worst case.
- **Prototype 8 (`keyframes5-migration`)** + fe-glyph-anim §2/§5: dasharray cleanup and build-time glyph lengths are hard prerequisites for celebration beat 3 (frozen glyphs would otherwise expose the dash-gap defect at rest).
- **pencil-boil release train**: value-noise generator (§2.2), `usePrefersReducedMotion()` (§1.6), scheduler kinds (§1.3), celestial palette/`useCelestialSun` (§3.3.4, M4).
- **Pass-2 planner**: drop/re-verify fe-boil-pipeline F6 (§7.4) before budgeting its fix.
- **api-error-taxonomy (prototype 14)**: §5.2's two error fictions consume the typed `ApiError`; copy strings above are the frontend's rendering of that taxonomy.
