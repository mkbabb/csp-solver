# design-union — THE STORYBOOK-GLASS UNION SPEC (Pass 2.5)

**Agent**: union-design (Fable + frontend-design plugin, skill loaded) · 2026-07-04
**Mode**: spec only, read-only against both trees. Every parameter grounded in source (file:line), a measured number, or a cited research finding. Builds WITH `pass2/design-refinement.md` (the pure-pencil spec), never against it — every pure-pencil rule stands unless a line here explicitly extends it.

**Binding constraints inherited**:
- Kill-gate composition rules (`pass25/fusion-tech-killgate.md §4`, rules 1–6) are hard architectural law, not preferences.
- The grain-static-overlay −72.9% RasterTask win (`synthesis-pass2.md` prototype 9) must not regress.
- The hand-drawn soul — wobbly pencil grid, paper grain, crayon palette, hand-glyph digits, orange-sun mascot — is non-negotiable. The union is judged on evidence against pure pencil; pure pencil remains a valid end-state.

**Verdict up front**: the union is viable only as **stationery, not glassmorphism** — and under that fiction it produces exactly **one pane of true glass in the whole shipped app**, held-only, never persistent. Everything else translucent is paper-family (vellum, washi). The research is unambiguous that persistent glass chrome over a hand-drawn world has zero SOTA precedent (`handdrawn-games-sota.md §3`); this spec therefore never ships one.

---

## 1. The fiction — stationery, not glassmorphism

### 1.1 The material story

`design-refinement.md §preamble` names the world: *the app is a page in a child's puzzle book. Nothing arrives from outside the page.* The union extends the camera one step back without breaking that law: **the workbook lies open on a desk, and the desk holds real classroom stationery.** Translucent things may now rest ON the page — but only objects a child or teacher would actually put on a workbook page:

| Material | The real object | Optics (deriving every token in §2) | Where it lands |
|---|---|---|---|
| **Vellum** | a sheet of tracing paper laid on the desk beside the puzzle | milky (white-biased alpha), **zero blur** — a sheet in *contact* with what's under it diffuses almost nothing; translucency without refraction | ControlPanel card, AttributionCard hover-card |
| **Washi** | translucent tinted paper tape holding things down | tinted alpha (crayon hue), zero blur, torn ends | tooltips, corner-tape garnish |
| **Laminate** | the teacher's laminated answer key, briefly held over your page | nearly clear (low milk), **blur 8px** + slight color-deepening (gloss makes construction paper read wetter), specular catch-light along the top edge; **exists only while held** | the hold-to-peek answer key (§3 row 9 — the flagship) |
| **Foil sticker** | the gold-star sticker (stickers are glossy laminated objects) | one 400 ms specular sweep, no backdrop sampling | the celebration's beat-2 close (§4.3) |

Each material maps onto one of the four sanctioned physical metaphors the SOTA hunt found (`handdrawn-games-sota.md §3` table): vellum/washi = the washi/translucent-paper-family precedent; the laminate = the owner's own laminated-worksheet device, scoped per the report's strongest recommendation as an **Okami-style quasi-mode** (press-and-hold, snaps back on release — `§2 Okami`, `§4 rec 3`); the sticker gleam is snow-globe-family "sealed and made precious," shrunk to a one-shot accent. The vitrine metaphor is deliberately *not* used (no settings modal exists to need it; if one ever does, it's pre-approved vocabulary).

### 1.2 Rules derived from the fiction (each rule is physics, and each happens to be the perf-safe choice)

1. **Blur comes from lift, never from material.** Optical diffusion through a translucent sheet grows with object-to-sheet distance. A sheet lying in contact (vellum panel) gets `backdrop-filter`-free alpha compositing; only a *lifted* sheet (the laminate, held above the page) earns blur. Consequence: the shipped app contains **exactly one `backdrop-filter` surface, and it's transient**. This is also glass-ui's own precedent — its dock is "purely a translucent plate … admitting backdrop pixels through" at **blur radius 0px** (`DESIGN.md §N7 dock-blur audit`; `glass.css` retired the dock blur chain entirely), so "blur-0 glass" is in-family, not a cop-out.
2. **The page is never translucent.** The board wrapper (`SudokuBoard.vue:104` — `bg-card cartoon-shadow-md`) stays opaque construction paper. You can't see the desk through your workbook page.
3. **When the teacher lays the key over your page, the page holds still.** The board's boil freezes while the laminate is held (§4.2's hold contract). Diegetically: you stop writing when someone covers your work. Technically: the kill-gate measured that the overlap tax is scheduled by the boil tick itself (`fusion-tech-killgate.md §4 rule 3` — the cost "scales with the boil tick's own cadence… that is what schedules new compositor frames"), so a frozen page should make glass-over-board approach free. §7's gates require measuring this, not assuming it.
4. **Sheets don't celebrate.** Real tracing paper doesn't cheer. Union surfaces hold still during the 3-beat celebration (§4.3); only the sticker gleams, once, because foil actually does.
5. **Anything that can't name its stationery object is cut.** The SOTA report's own standard (`§3` bottom line): if a union element can't say which physical object it's simulating, it's contrived and gets reported as such. This rule is the Pass-3 fiction-integrity criterion (§8).
6. **The code speaks stationery, not glass.** Component/token names are `Sheet*`/`--sheet-*`, never `glass-*` — which both keeps the fiction in the artifact and sidesteps the U7 vocabulary collision and the U3 `:root` token collision (`glass-ui-union-seams.md §3.2`) by construction.

### 1.3 The out-list (named, so nobody re-litigates by accident)

- **No `@import "@mkbabb/glass-ui/styles"`, ever** — it's a single non-purgeable 411,400 B raw / 114,392 B gzip stylesheet (measured, `glass-ui-union-seams.md U2`) against the sudoku app's entire 7.51 KiB-gzip CSS, and it collides on `--color-card`/`--color-foreground`/`--color-destructive`/`--radius` at `:root` (U3). Recipes are hand-ported and renamed, or not used.
- **No glass-ui JS imports at all** — Card and HoverPopover import `reka-ui` (`Card.vue:3`, `HoverPopover.vue:4-9`), which prototype 11 excised as dead weight; importing zero components resolves the U5 tension by construction rather than by coordination.
- **No aurora, no photographic backdrops** (§2.5). No persistent glass panel anywhere (`handdrawn-games-sota.md §4` risk 4). No glass over or under the grid outside the held laminate. No `GlassDock`/`Configurator`/`HoverPopover` adoption (`seams §1.6` — they solve problems this app doesn't have; dock alone is 19,284 B gzip). No glass-ui `DarkModeToggle` (U6 — the mascot is the single most storybook-coded element in the app). No lucide icons on any union surface (`seams §3.4` house rule). No Plus Jakarta Sans / √φ type ladder import (§2.4).
- **The iOS-7 caution stands** (`handdrawn-games-sota.md §3` row 1): glass historically appears as paper metaphors *die*. Every union element must read as the paper world acquiring a new object, never as the app acquiring a new material system.

---

## 2. Token mapping

### 2.1 glass-ui tiers → the sheet ladder

Authoritative glass-ui source values (read from `glass-ui/src/styles/tokens/glass.css`, current tree — note `DESIGN.md`'s own §Glass Surfaces table is stale against it, blur 12/16/24 px + saturate 1.05/1.4/1.5 vs the actual 8/13/13 px + 1.4/1.6; a fourth instance of the U9 doc-drift pattern, and the kill-gate's reconstruction `blur(8px) saturate(1.4)` matches the *source*, which is what its measurements bench):

| glass-ui rung (source values) | Sheet rung | Material recipe (light arm) | Blur | Fiction |
|---|---|---|---|---|
| wash (α .30, blur 1px, sat 1.4) | — unused | the page itself IS the ambient backdrop; a 0.30 veil over paper has no object to be | — | — |
| quiet (α .50, blur 8px, sat 1.4) | **`--sheet-washi`** | `color-mix(in srgb, <crayon var> 22%, hsl(0 0% 100% / 0.55))`; tooltips use the neutral arm `color-mix(in srgb, var(--color-foreground) 6%, hsl(0 0% 100% / 0.82))` | **0** | tinted paper tape |
| resting (α .65, blur 8px, sat 1.4) | **`--sheet-vellum`** (contact) | `background: color-mix(in srgb, var(--color-card) 72%, transparent)`; own fiber layer (§2.2); contact shadow `0 1px 2px color-mix(in srgb, var(--color-foreground) 6%, transparent)`; border `1px solid color-mix(in srgb, var(--color-foreground) 8%, transparent)` | **0** | tracing paper lying on the desk |
| floating (α .80, blur 13px, sat 1.6) | **`--sheet-vellum-lifted`** | vellum at α .80 + lift shadow `0 4px 12px color-mix(in srgb, var(--color-foreground) 12%, transparent)` + 1px translateY on open | **0** | the same sheet, picked up an inch |
| overlay (α .95, blur 13px, sat 1.6) | **`--sheet-laminate`** | milk gradient `linear-gradient(165deg, hsl(0 0% 100%/0.22), hsl(0 0% 100%/0.10) 38%, hsl(0 0% 100%/0.16))`; `backdrop-filter: blur(8px) saturate(1.12)`; catch-light `inset 0 0.5px 0 0 hsl(0 0% 100% / 0.30)`; cast `4px 6px 0` foreground-8% (house cartoon-cast family, `index.css:107-123`) + lift `0 6px 20px` foreground-14% | **8px, held-only** | the laminated answer key |

Derivation notes, parameter by parameter:
- **Alpha inverts on the top rung by physics, not taste.** glass-ui's ladder is alpha-monotonic (0.30→0.95) because its overlay must *occlude* modal-under-modal content. Our laminate is the most *transparent* sheet (milk ≈ 0.10–0.22) because a real laminated key is clear plastic — you must see your own penciled board through it, dimmed and slightly blurred, with the key's printed answers sharp on top. That inversion is the visual thesis of the whole union.
- **Blur 8px is the benched number, reused.** It's glass-ui's unified resting material (`glass.css` BG.W-GLASS-BLUR-PEER — dock, button, default Card all resolve `blur(8px)`) and the exact radius `fusion-tech-killgate.md §1` reconstructed and measured. Don't invent a new radius; inherit the one with data behind it.
- **Saturate 1.12, not 1.4.** Over a near-achromatic cream page, 1.4 just yellows the noise. glass-ui's own AX.W52 D19 comment concedes "real liquid glass concentrates light ~1.1–1.2×; the prior 1.4–1.5× over-juiced." 1.12 also matches the real phenomenon being simulated: lamination slightly deepens construction-paper color.
- **The oklab plate-tint recipe** (`ladder.css` `--glass-plate-tinted: color-mix(in oklab, var(--glass-bg-rung), var(--glass-tint-source) var(--glass-tint-strength))`) is adopted as a *shape* for the washi tint mix only; at rest strength the mix is a no-op, exactly glass-ui's discipline.
- **In-app precedent**: `AttributionCard.vue:74-76` already ships `background: color-mix(in srgb, var(--color-popover) 80%, transparent)` with `backdrop-filter: none` **explicitly** — the app independently invented vellum-lifted before this spec named it. The union formalizes what the app already reached for.

Dark arms (rule from `design-refinement.md §3.2` — hue-locked, lightness up, crayons glow at night; plus glass-ui's dark-denser convention):
- vellum: α .72 → **.80**; contact shadow foreground-6% → hsl-white-based 8%.
- vellum-lifted: α .80 → **.86**.
- washi: white base drops to `hsl(0 0% 100% / 0.14)` over the dark slate; tint share rises 22% → 30% (the tape's wax glows, the milk recedes).
- laminate: milk 0.22/0.10/0.16 → **0.12/0.06/0.10**; catch-light 0.30 → **0.38** — the one place dark mode gets *more* glass, because gloss reads by reflection and reflections read at night (a lamp glint; it also rhymes with the moon-and-stars register of `DarkModeToggle.vue:63-87`).

### 2.2 Paper-texture tokens × pencilConfig grain

- **The page**: `--paper-clean-texture` (feTurbulence 0.9/oct 3 baked to a 60×60 data-URI, opacity 0.18 light / 0.04 dark — `index.css:55,93`) is untouched. It's a static raster, which both glass-ui's history (`paper.css:10-18`, feTurbulence-as-primary rejected twice as "disgusting metallic") and the kill-gate's side-finding (glass-ui's grain is "a static pre-decoded bitmap, never an feTurbulence filter") independently bless — U8's convergence.
- **Vellum's own fiber**: a `::after` layer reusing the *existing* `--paper-clean-texture` data-URI at opacity **0.10 light / 0.03 dark** (the `design-refinement.md §2.4` overlay ratio), `mix-blend-mode: multiply` light / `screen` dark — the same asymmetric blend law both codebases already run (`pencilConfig.ts:130,135`; glass-ui `paper.css` blend-law block). Not `background-attachment: fixed` — the sheet's fiber moves with the sheet, the page's fiber stays with the page; that parallax IS the two-sheets read. Moiré risk between the two 60px tiles is flip-test-arbitrated (§7.4); the fallback is dropping the panel's own fiber layer, and the optional refinement is hand-porting glass-ui's directional crossed-fiber weave (`paper.css:62-84` — three `repeating-linear-gradient` bands, periods 2.8/3.5/7 px over a 140px tile, warm oklch stops, mean C≈0.045) renamed `--sheet-fiber`, since real vellum has visible fiber *direction* where paper tooth is isotropic.
- **`grain-static` and the boil frames**: untouched, in any arrangement. The union adds **zero** live-filter regions and never places any sheet inside the grid's filtered groups (`HandDrawnGrid.vue:95`). Kill-gate rule 6 is law: no `backdrop-filter: url(#grain-static)` ever (Chromium-only; WebKit bug 245510).
- **STROKE_GRAIN vs sheet fiber vocabulary**: per U7, one glossary line ships in the code — *grain* = displacement filter on strokes; *tooth/fiber* = static raster on surfaces; *boil* = frame-cycling geometry.

### 2.3 Crayon palette as the color source of truth

Zero new hexes — the `design-refinement.md §3.4` rule extends to every sheet token:

| Sheet token | Resolves to | Fiction |
|---|---|---|
| `--sheet-milk` | `hsl(0 0% 100%)` at the per-rung alphas above (white already lives in `YOSHI_COLORS.heart.highlight`, `pencilConfig.ts:19`) | the sheet's own body |
| `--sheet-ink-edge` | `color-mix` of `var(--color-foreground)` (8%/10%/14% per rung) | pencil-drawn edge of the sheet |
| washi tints | `var(--color-crayon-blue)` (tape garnish), `var(--color-crayon-orange)` (accent tape), foreground-neutral (tooltips) | the tape aisle |
| laminate key digits | `--color-teacher-red` (= `--color-crayon-rose`, `design-refinement.md §3.4`) | the printed answer key — red, as real answer keys are |
| sticker gleam | `#FDE68A` terminal stop (already the sun-sparkle/rainbow terminus, `SvgFilters.vue:156-162` / `--color-gold-star` accent) → white at the sweep crest | gold foil |

Deliberate distinction, kept loud: **peeking ≠ solving.** The laminate's answers are the teacher's *printed* red key; pressing Solve still writes the solver's sparkle-rainbow ink into *your* page. Two inks, two fictions, per the `design-refinement.md` ink taxonomy (printed clues / student ballpoint / solver rainbow / teacher red).

### 2.4 Typography — where each system rules

- **The hand voices rule everything readable.** Fraunces (display/headings — `ControlPanel.vue:302`), Patrick Hand (marginalia, tooltips, the laminate's "answer key" tab label — `index.css:203-206`), Fira Code (mono attribution). The hand-glyph registry (`glyphPaths.ts`/`glyphRegistry.ts`) rules **all digits everywhere, including on the laminate** — the key's answers are the same glyph bank, stroked `--color-teacher-red`, opacity 0.9, **without** the per-glyph `grain-static` filter (printed, not penciled — and cheaper: zero new filter regions).
- **The √φ ladder is rejected as surface, respected as sanity-check.** glass-ui's 11-stop scale + Plus Jakarta Sans/Fira Code `@font-face` machinery (`DESIGN.md §Typography`) solves a docs-site problem this app doesn't have; `seams §1.8` already found no seam worth pursuing. The union adds exactly one new text size (the laminate tab: Patrick Hand 1.1 rem, the marginalia rung from `design-refinement.md §4.3`) — no ladder needed for one rung. Existing sizes are not retrofitted to φ (section-heading's 1.125→1.5 rem step is 1.333, not 1.272; it stays).

### 2.5 Dark mode — paper-night, not aurora

**Paper-night wins, unambiguously.** Justification, since the mandate asks for one:
1. Aurora is a kinetic photographic backdrop (glass-ui's `--z-background` canvas layer). It would replace the paper world wholesale — the definitive "glass is what happened after we stopped caring about the paper" failure (`handdrawn-games-sota.md §3`, iOS-7 row).
2. Blur *wants* a photographic backdrop ("a `backdrop-filter: blur(12px)` over a flat cream sudoku grid blurs nothing interesting" — `seams §1.1`). Adopting aurora to justify blur is the tail wagging the dog; the union's answer is less blur, not more backdrop.
3. The dark identity already exists and is spec'd: warm brown slate `hsl(24 8% 6%)` (`index.css:60`), grain whispering at 0.04 (`design-refinement.md §2.4` — "dark mode is a slate, not a photocopy"), crayons glowing (hue-locked, L +7…+13, `§3.2`), moon-and-stars mascot. The union's only dark-mode delta is §2.1's arms — denser sheets, brighter catch-light.

---

## 3. Component mapping table

Soul surfaces (grid, glyphs, mascot) stay hand-drawn; the union lives in chrome, panels, elevation, and one held overlay — exactly the mandate's default, and no evidence surfaced to move it.

| # | Surface | Pure-pencil (as-built / design-refinement) | Union treatment | glass-ui primitive employed | Verdict + reasoning |
|---|---|---|---|---|---|
| 1 | **Board frame + wrapper** (`SudokuBoard.vue:104` `bg-card cartoon-shadow-md`; `HandDrawnGrid.vue`) | opaque card, wobbly grid, 4 pre-baked grain layers (prototype 9) | **None.** The page is never translucent (§1.2 rule 2) | none | **SOUL — untouched.** Any treatment here is the "glass pasted onto a crayon drawing" failure by definition |
| 2 | **Cells + glyphs** (`SudokuCell.vue`, `HandwrittenGlyph.vue`) | ghost wobbleRect hover, pencil-sketch focus ring (`design-refinement.md §4.2`), hand-glyph digits | **None.** No hover-glass over cells | none | **SOUL — untouched.** Kill-gate rule 2 prices any persistent overlap at ~20–50%/frame; SOTA has zero precedent; the pencil focus ring already spec'd is better |
| 3 | **ControlPanel card** (desktop `App.vue:85-101`, mobile `:65-82`; `HandDrawnOutline` boil rect + opaque `bg-card`) | opaque card + boiling outline + stroke-light/dark filter on content (`ControlPanel.vue:52,307`) | **`--sheet-vellum` (contact)**: card bg → 72% translucent milk, own fiber `::after`, contact shadow; boiling outline, divider, icons, headings all unchanged on top | ladder concept only (resting rung, blur deleted), hand-ported + renamed | **DEFT.** It's tracing paper laid beside the puzzle with the teacher's tools on it. Beside the grid = the kill-gate's one measured-free arrangement (`union-beside-wc` 7.39 ms/f vs baseline 7.77 — indistinguishable), and with blur 0 it's free on *every* metric even though it contains its own boiling children (outline + divider), which a backdrop-filter here would have taxed (the `union-inside` condition, 11.36 ms/f) |
| 4 | **Tooltips** (`ControlPanel.vue:368-389` — solid `--color-primary` dark pill) | solid pill, Patrick Hand, hover-only (focus gap flagged `design-refinement.md §4.4`) | **`--sheet-washi` label**: neutral washi scrap, foreground ink, torn ends (seeded 6-point `clip-path` jitter, `mulberry32(pos)`), −1.5°…+1.5° seeded rotation; gains `:focus-visible` per the pure spec | quiet-rung alpha concept | **DEFT.** The solid dark pill is arguably the most generic-app pixel in the panel today; a taped label is more in-world than the thing it replaces. Tiny, static, blur-0 |
| 5 | **Dice / eraser / solve buttons** (`ControlPanel.vue:338-366`, grain-static + wobble-celestial hover) | pencil icons, scale 0.93 press | **None** (buttons). The union does not touch press physics — glass-ui's §L3 0.96 squish stays unadopted; 0.93 at `:active` is already in-family | none | **PENCIL.** Working, characterful, small-area-filter compliant (`design-refinement.md §1.5` rule). Re-skinning them buys nothing |
| 6 | **DarkModeToggle celestial** (`DarkModeToggle.vue` — 5-hex sun, moon, boil ×3, 240s rays) | the mascot; palette → config per `design-refinement.md §3.3.4` | **None visually.** One portable *pattern*: an opt-in long-press "eclipse" register (≥1.2 s hold → slow ~1.6 s cross-fade wrapping the existing 800 ms page-turn, `:180-208`) — interaction shape only, zero artwork change | long-press register pattern from glass-ui's toggle (U6's single portable idea) | **PENCIL (swap = cleanest CONTRIVED in the inventory, per U6).** glass-ui's toggle is a generic geometric icon-morph; adopting it would delete the mascot |
| 7 | **AttributionCard hover-card** (`AttributionCard.vue:68-90` — already 80% alpha, `backdrop-filter: none`) | translucent popover (accidental proto-vellum), interactive-nesting fix owed (`design-refinement.md §4.4`) | **`--sheet-vellum-lifted`**: formalize α .80, add lift shadow + 2px translateY settle on open (220 ms easeOutCubic), fiber layer, real `<button>` semantics | floating-rung concept, blur clamped to **0** (transient + possible board overlap on small viewports — cheaper to never blur than to guard geometry) | **DEFT.** The app already invented this surface; the union names it and gives it the sheet's physical details |
| 8 | **FilterTuner** (dev chrome, `import.meta.env.DEV`-gated, 0 prod bytes per prototype 11) | plain dev panel | **`--sheet-laminate` reskin, blur licensed freely** — it IS a technician's laminated cheat-sheet, and it never ships | full six-layer composite recipe (hand-ported) | **DEFT (and free).** Doubles as the laminate material's live testbed |
| 9 | **NEW — the answer-key laminate** (flagship; no pure-pencil equivalent) | — (pure pencil has no peek affordance; Solve writes permanently) | **Hold-to-peek**: press-and-hold Solve ≥350 ms (or press `K` to toggle — motor-a11y alternative; `Esc` closes) → the board freezes (§4.2), a board-shaped laminate lays down over it (280 ms), the solution renders as printed teacher-red glyphs over their cells; release → 200 ms lift-away, page resumes, **your entries untouched** | overlay-rung register: `blur(8px) saturate(1.12)` (the benched resting radius), catch-light, oklab tint shape | **DEFT — conditionally, and this is the union's load-bearing novelty.** It's the owner's laminated-worksheet metaphor made *functional* (Baba-Is-You north star: the glass DOES what the real object does — an answer key you hold over your page to check, not copy). Okami quasi-mode precedent (`handdrawn-games-sota.md §4` rec 3: "temporary and diegetically justified… rather than persistent chrome"). Conditions: the §4.2 freeze contract + §7.4's re-bench gate (kill-gate rule 4 forbids assuming overlap cost away) + the §8 flip test. If it reads contrived in Pass 3, it dies and the union's case collapses to rows 3/4/7 — a much weaker, but still coherent, partial adoption |
| 10 | **Error note card / marginalia** (`design-refinement.md §5.2, §4.3`) | opaque paper note, `HandDrawnOutline`, Patrick Hand, `role="alert"` | **None.** A note pinned to the page is paper, not glass; keep the pure spec verbatim. (Optional P3: one washi tape strip "pinning" the note's top edge) | none | **PENCIL.** The two error fictions (teacher-red vs paper note) are already exactly right |
| 11 | **Future dock / configurator chassis** | n/a | **Not adopted.** If the app ever grows a multi-panel shell, the sheet ladder is its material vocabulary; GlassDock/Configurator stay unimported (`seams §1.6`: 19,284 B gzip dock for a problem that doesn't exist; FilterTuner already covers Configurator's job) | none | **CONTRIVED today** — chrome without a consumer |
| 12 | **Celebration + murmur** (`design-refinement.md §1.3` — 3 beats, ≤3.2 s, one scheduler timeline) | the centerpiece of the pure spec | beats 1–3 **unchanged**; one union accent: the **sticker gleam** (§4.3) | none (a CSS mask sweep, no backdrop sampling) | **PENCIL + one foil accent.** A snow-globe glass moment here would fight the finished celebration spec; restraint is the union's re-expression (§1.2 rule 4) |

House rule riding the whole table (`seams §3.4`): any icon slot on a union surface takes a hand-drawn glyph, never a lucide default.

---

## 4. Motion unification

### 4.1 One rAF discipline, zero new regimes

`seams §3.3` counts three rAF regimes (pencil-boil's singleton, glass-ui's per-instance `useRAFLoop`, prototype 10's app-local batch scheduler). **The union introduces no fourth**: every union motion is a CSS one-shot (transition/animation) riding the compositor; the only union JS is hold-state bookkeeping. The unified scheduler (prototype 10, folding into pencil-boil 0.5.0 with the centralized PRM gate per `synthesis-pass2.md §3.3.2`) remains the sole owner of ticking motion, and gains one small API the union needs:

- **`scheduler.acquireHold(reason: string)` / `releaseHold(reason)`** — a hold pauses Band A/B subscribers (grid boil, divider, celestial, murmur) exactly like the visibility gate, freezing frames *in place* (subscriber refs simply stop advancing — no snap to frame 0). The laminate acquires `'answer-key'` on pointerdown, releases 200 ms after pointerup (when the lift-out finishes). PRM and visibility remain scheduler-centralized per prototype 10's design; hold is a third gate input to the same mux. Murmur (beat 3) rides the scheduler already, so it freezes for free.

glass-ui's springs are CSS `linear()` easing tokens (`DESIGN.md §Easing`) — no JS, no chains — but they're still **not adopted**: `design-refinement.md §1.1`'s easing ledger has four house curves and a "no new beziers without a ledger entry" rule. The union's answer is zero new entries:

| Union motion | Band (`§1.1`) | Duration | Easing (house ledger) |
|---|---|---|---|
| Laminate lay-down (opacity 0→1, scale 1.02→1) | C (one-shot) | 280 ms | `cubic-bezier(0.34,1.56,0.64,1)` — the *physical flourish* curve (page-turn's own, `DarkModeToggle.vue:180-208`) |
| Laminate lift-away | C | 200 ms | `easeInCubic` — leaving the page is fast and careless (the erase-family asymmetry, `§1.2` canon) |
| Key digits fade-in on laminate | C | 150 ms flat opacity, **no draw-in, no stagger** | linear — the key is pre-printed; it doesn't animate being written, which is both diegetically right and free |
| Hover-card settle (translateY 2px→0) | C | 220 ms | `easeOutCubic` — arriving onto the page |
| Sticker gleam (mask-position sweep) | D tail | 400 ms, plays once | linear (a light sweep, not a gesture) |
| Washi/vellum at rest | — | static | — (§1.2 rule 4: sheets don't tick; nothing ambient is added to Bands A/B) |

The 350 ms hold-threshold on Solve (distinguishing click-to-solve from hold-to-peek) sits in the Band-C envelope and below the 400–500 ms button one-shots (`ControlPanel.vue:84-86`), so a normal click's release always lands before peek engages.

### 4.2 The hold contract (the laminate's full lifecycle)

1. `pointerdown` on Solve (or `keydown K`): start 350 ms timer. Under 350 ms → normal solve click on release, nothing union happens.
2. At 350 ms: `acquireHold('answer-key')` — boil freezes in place — then mount the laminate and play lay-down (280 ms). Marginalia (`role="status"`, `design-refinement.md §4.3` voice) announces "peeking at the answer key." Solution source: one POST `/board/solve` against the board's *original givens* (`useSudoku`'s `originalGivenCells`), cached per `boardGeneration` — always satisfiable (boards derive from solution banks), never mutates `values`.
3. Held: page perfectly still; laminate perfectly still; the only live pixels are the user's cursor. (A real held sheet doesn't wobble the page under it.)
4. Release (`pointerup`/`Esc`/`K`): lift-away 200 ms → unmount → `releaseHold` → boil resumes mid-cadence.
5. Guards: peek disabled while `solveState === 'solving'` and during celebration beats 1–2; no scrim (the room doesn't dim when a teacher lays a sheet on your desk — and it avoids any second stacked surface, kill-gate rule 5's no-nested-backdrop-filter hard stop).

### 4.3 The 3-beat gold-star celebration, re-expressed

Beats 1–3 ship **verbatim** from `design-refinement.md §1.3` — board-normalized reveal wave (`clamp(round(1200/blanks), 4, 24)` ms/cell), one diagonal two-cycle flourish as a single scheduler `sequence` subscriber, classroom murmur at ≤1 wiggle/2.5 s. The union adds exactly one frame-level accent and one rule:

- **The sticker gleam** (new, P2): at beat-2's crest (~t=3.0 s, inside the ≤3.2 s cap), if the marginalia's gold-star garnish is on screen, a single 400 ms diagonal specular sweep crosses it — a `linear-gradient(105deg, transparent 40%, hsl(0 0% 100%/0.85) 50%, transparent 60%)` mask layer animated by `mask-position` (compositor-cheap, zero backdrop sampling, zero raster ticks). Fiction: gold-star stickers are foil; foil gleams once when the light catches it. PRM: off entirely.
- **The stillness rule** (§1.2 rule 4): vellum/washi surfaces do not pulse, glow, or lift during any beat. The page celebrates; the stationery watches.

### 4.4 PRM tiers (extends `design-refinement.md §1.6`'s table — one reactive source, scheduler-centralized)

| Union state | Full motion | PRM equivalent |
|---|---|---|
| Laminate lay-down / lift | 280 ms flourish in, 200 ms out | 150 ms opacity in/out, no scale |
| Board freeze under hold | freeze-in-place | already frozen (PRM ambient = off) — hold is a no-op |
| Key digits | 150 ms fade | instant |
| Hover-card settle | 220 ms translate+fade | opacity-only (already the card's shipped fallback style) |
| Sticker gleam | one 400 ms sweep | **off** |
| Eclipse long-press (P3) | 1.6 s cross-fade | 200 ms opacity crossfade (the toggle's existing PRM arm, `DarkModeToggle.vue:239-249`) |

`prefers-reduced-transparency` (glass-ui §L5's bracket, adopted with one deliberate divergence): every sheet α→1 (vellum panel becomes today's opaque card — the fallback IS pure pencil), `backdrop-filter`→none, catch-light off — but **fiber/tooth layers stay**, diverging from glass-ui's "retire the grain with the blur" rule, because in glass-ui grain exists to sell refraction while here the tooth is the paper itself (opaque construction paper still has tooth; it's the app's baseline aesthetic on every opaque surface today). `prefers-contrast: more`: sheet α→1 + border ink 8%→30%, composing with the pure spec's stroke-opacity raises (`design-refinement.md §4.4`).

---

## 5. Perf envelope

### 5.1 Kill-gate rules applied per surface

Binding source: `fusion-tech-killgate.md §3-4`. Measured anchors: no-overlap steady state 7.39–7.77 ms/frame mean (range 6.60–8.60) on PipelineReporter; overlap conditions 9.17–11.66 ms/frame (~20–50% tax, ~65–80 ms/s at the 6.7 Hz boil cadence); RasterTask flat 0.00 in all 18 fixed-architecture trials; promotion hints don't buy back overlap (rule 4).

| Surface | backdrop-filter | Overlap class vs boiling geometry | New per-tick raster sources | Verdict under the rules |
|---|---|---|---|---|
| Vellum ControlPanel | none | beside (desktop) / below (mobile); contains its own boiling outline+divider — which is precisely why blur is banned here (would be the measured `union-inside` class, +~47%) | 0 (static bg + static `::after` fiber) | free on both metrics by construction; strictly cheaper than any glass tier |
| Washi tooltips / tapes | none | beside, tiny, transient | 0 (one paint per show) | free |
| Vellum-lifted hover-card | none | possible transient overlap on small viewports → blur permanently 0 rather than geometry-guarded | 0 | free |
| Sticker gleam | none | on its own element, mask-position animation | 0 (compositor mask transform) | free; obeys glass-ui §L7's own paint-cost fence (one-shot, never steady-state) |
| **Laminate (held)** | `blur(8px) saturate(1.12)` | **deliberate full board overlap — the one licensed exception**, under the freeze contract | 0 raster (backdrop-filter is compositor-resident, kill-gate §2); compositor cost bounded to (a) the 280/200 ms lay/lift windows (glass-ui §L7: "backdrop-blur ENGAGE is gated to a one-shot overlay-pull window, never a loop") and (b) ~zero steady-held cost *hypothesized* because the frozen boil schedules no new frames (rule 3's cadence-tied cost model) — **hypothesis, gated in §7.4, never assumed** | conditional: ships only if the frozen-hold bench clears |
| FilterTuner laminate | free use | dev-only, 0 prod bytes | dev-only | out of budget scope |

Hard prohibitions restated as build-time lint/greps (§7.5): no nested backdrop-filter anywhere (rule 5 — Safari double-blur correctness, harder than perf); no SVG filter as backdrop-filter input (rule 6); no persistent backdrop-filter element in prod (`grep` for `backdrop-filter` in shipped CSS must find only the laminate class + the PRT/`@supports` arms).

### 5.2 Budgets (numbers, not vibes)

- **RasterTask during steady state**: Δ = 0 vs the prototype-9 shipped tree (same harness, same 6 s window). The −72.9% win is structurally unregressable by glass (18-trial evidence) — the budget exists to catch *accidental* new live filters, not glass.
- **PipelineReporter steady state** (any union surface visible, laminate not held): ≤ **8.6 ms/frame** (the no-overlap group's measured max; means should sit ~7.4–7.8).
- **PipelineReporter while laminate held** (boil frozen): ≤ **8.5 ms/frame** mean across n=3 (baseline mean +10%); expected near `glass-solo`'s idle (0 events between input frames). Fail → the laminate ships PRT-style opaque (α .97 card) or dies.
- **Bundle**: union CSS ≤ **+4 KB gzip** over the current 7.51 KiB-gzip stylesheet; union JS ≤ **+2.5 KB gzip**; `@mkbabb/glass-ui` absent from `package.json` (hard gate). Context: the rejected wholesale import is 114,392 B gzip CSS alone (U2).
- **DOM**: laminate ≤ ~1 element + ≤ blankCount glyph `<svg>`s, mounted only while held; sheets add ≤ 2 pseudo-layers each.

---

## 6. M4 re-decision under the union — mascot/celestial ownership

**Decision: app-local, unchanged — the union *strengthens* the park rather than reopening it.**

- The D7/synthesis park stands on its own terms: `useCelestialSun()` still has no second consumer (bbnf-buddy uses glass-ui's generic toggle directly; fourier-analysis's touchpoint is a one-shot dev baker — `synthesis-pass2.md D7`), and a consumer-count-of-one abstraction is the anti-pattern the audit condemns.
- The seams report's sharper frame (`glass-ui-union-seams.md §4.3`) is adopted as the standing fence: **the primitive level clears the shared-library bar, the composed-mascot level does not.** `useLineBoil` has ≥2 real consumers today (sudoku + glass-ui's HandMark via `useHandMark.ts:21`) and already lives in pencil-boil — proven convergence point. The pressure-varying stroke body (perfect-freehand-style, `ink.ts`/`brush.ts:13-19`) is the next primitive that clears the same bar (both HandMark and the sudoku glyph/grid render path would consume it; Cuphead's line-weight-taper evidence independently marks it load-bearing, `handdrawn-games-sota.md §1`) — it belongs in **pencil-boil 0.6.0+**, not glass-ui, not app-local. glass-ui's `useRAFLoop.ts:229-250` reactive-PRM shape hands to the pencil-boil 0.5.0 release train as reference implementation (seams handoff, already booked).
- **What the union adds to the calculus**: this spec imports zero glass-ui JS and swaps zero artwork — so no new consumer relationship forms in either direction. glass-ui's toggle remains the wrong register for a mascot (U6), and even the maximal union here never wanted it. If even the union doesn't move the mascot toward glass-ui, nothing will; the only event that reopens M4 is a second *real* consumer of the composed sun (e.g., a future mkbabb site adopting the celestial mark as identity). Until then: palette → `YOSHI_COLORS.celestial` per `design-refinement.md §3.3.4` (the config-hygiene prerequisite ships regardless), composable parked spec-ready.

---

## 7. The prototype build brief

### 7.1 Scope — exact surfaces (worktree-isolated; primary tree and glass-ui stay read-only)

| Priority | Deliverable | New/changed files (target topology per prototype 11) |
|---|---|---|
| P1 | Sheet token block (`--sheet-*`, light+dark+PRT+contrast arms) | `src/assets/index.css` `@theme` extension (~60 lines); glossary comment (U7) |
| P1 | Vellum ControlPanel card | `App.vue:67,87` card classes → `sheet-vellum`; no ControlPanel internals change |
| P1 | Washi tooltip | `ControlPanel.vue` tooltip block (`:368-389`) → `SheetWashiLabel.vue` (~50 lines, `skin/components/sheet/`) |
| P1 | **Answer-key laminate** | `skin/components/sheet/AnswerKeyLaminate.vue` (~180 lines: hold logic, freeze acquire/release, glyph layout from `cellRects`, a11y); `SudokuBoard.vue` mounts it as a sibling **after** the cells layer (never inside `HandDrawnGrid`'s filtered groups); `useSudoku.ts` gains `peekSolution()` (cached per `boardGeneration`, original-givens solve); scheduler hold API (app-local `boilScheduler.ts` interim; folds into pencil-boil 0.5.0's centralized gate) |
| P2 | Vellum-lifted AttributionCard formalization + real `<button>` semantics | `AttributionCard.vue` styles (~20 lines) |
| P2 | Sticker gleam | celebration timeline tail (rides prototype 10's `sequence` subscriber; CSS-only accent) |
| P3 | Washi corner tapes on ControlPanel; washi pin on the §5.2 note card; eclipse long-press register | garnish, only after P1/P2 gates pass |
| dev | FilterTuner laminate reskin | `FilterTuner.vue` styles; zero prod bytes |

### 7.2 Exact glass-ui imports

**npm imports: none.** Subpath JS imports: **none** (resolves U5's reka-ui tension by construction; makes U4's peer-floor sequencing moot for this prototype — landing order vs the keyframes5/pencil-boil train is only a worktree-hygiene concern, see §7.6). Hand-ported *recipe text*, renamed on port (the `seams §2.3` "steal the recipe, not the dependency" path, each ≤25 lines):
- six-layer composite shape from `ladder.css` `.glass-resting`/`.glass-overlay` → `--sheet-laminate` (§2.1 values);
- `--glass-material-rim` catch-light idea → `--sheet-rim: inset 0 0.5px 0 0 hsl(0 0% 100% / <0.30|0.38>)`;
- oklab plate-tint mix shape → washi tint;
- (optional, flip-test-gated) `paper.css:62-84` crossed-fiber weave → `--sheet-fiber`.
Dark-variant selectors are re-authored against sudoku's `@custom-variant dark (&:is(.dark *))` (`index.css:3`), never copied verbatim (glass-ui's `:where(.dark, .dark *)` spelling differs — `seams §2.4`). The port is a frozen snapshot by design; glass-ui churn does not flow (stated tradeoff, `seams §2.3`).

### 7.3 Exact token values (the single source for the build)

```css
/* ── §SHEET — stationery ladder (union). Glossary: grain=stroke displacement
   filter · tooth/fiber=static surface raster · boil=frame-cycled geometry. ── */
--sheet-vellum-bg: color-mix(in srgb, var(--color-card) 72%, transparent);        /* dark: 80% */
--sheet-vellum-lifted-bg: color-mix(in srgb, var(--color-card) 80%, transparent); /* dark: 86% */
--sheet-fiber-opacity: 0.10;                                                      /* dark: 0.03 */
--sheet-ink-edge: color-mix(in srgb, var(--color-foreground) 8%, transparent);    /* lifted 12%, laminate 10% */
--sheet-contact-shadow: 0 1px 2px color-mix(in srgb, var(--color-foreground) 6%, transparent);
--sheet-lift-shadow: 0 4px 12px color-mix(in srgb, var(--color-foreground) 12%, transparent);
--sheet-washi-neutral: color-mix(in srgb, var(--color-foreground) 6%, hsl(0 0% 100% / 0.82));
--sheet-washi-blue: color-mix(in srgb, var(--color-crayon-blue) 22%, hsl(0 0% 100% / 0.55));
--sheet-laminate-milk: linear-gradient(165deg, hsl(0 0% 100%/.22), hsl(0 0% 100%/.10) 38%, hsl(0 0% 100%/.16));
                                              /* dark: .12/.06/.10 */
--sheet-laminate-blur: blur(8px) saturate(1.12);   /* the benched radius; PRT: none */
--sheet-rim: inset 0 0.5px 0 0 hsl(0 0% 100% / 0.30);   /* dark: 0.38 */
--sheet-laminate-cast: 4px 6px 0 color-mix(in srgb, var(--color-foreground) 8%, transparent),
                       0 6px 20px color-mix(in srgb, var(--color-foreground) 14%, transparent);
--sheet-key-ink: var(--color-teacher-red);          /* = --color-crayon-rose */
/* Motion (house ledger, no new curves): lay 280ms cubic-bezier(.34,1.56,.64,1);
   lift 200ms easeInCubic; hover settle 220ms easeOutCubic; key fade 150ms;
   gleam 400ms linear ×1; hold threshold 350ms; hold release lag 200ms. */
```

### 7.4 Acceptance gates

1. **Hand-drawn-soul flip test** (the mandate's own bar): 5-second side-by-side exposure, pure vs union, light+dark — a Yoshi's-Story-native observer must still read the union as a storybook page *and* must be able to name each translucent element's physical object unprompted-with-a-list (washi/vellum/laminate/sticker). Any element that draws a "that's an app panel" read is cut individually (§1.2 rule 5).
2. **SSIM on unchanged (soul) surfaces**: board-interior crop and mascot crop, pure vs union builds, ≥ **0.99** at 1× and 2× DPR, light+dark, idle state (stricter than the 0.98 gate `design-refinement.md §2.2` uses for *intentional* grain changes — these crops are supposed to be untouched; residual budget is AA noise only). DOM-parity assert on `HandDrawnGrid`/`HandwrittenGlyph`/`DarkModeToggle` subtrees (byte-identical rendered structure).
3. **Perf** (fusion-bench harness, extended): (a) steady-state union: RasterTask = 0.00, PipelineReporter ≤ 8.6 ms/frame; (b) **new `glass=over-frozen` condition** — laminate-over-board with the boil timer stopped, n=3: mean ≤ 8.5 ms/frame (rule-4 discipline: measured, not assumed); (c) lay/lift transient: no `Scheduler::BeginFrameDropped` deltas vs baseline.
4. **Bundle**: CSS ≤ +4 KB gzip, JS ≤ +2.5 KB gzip, `@mkbabb/glass-ui` absent from `package.json`, `grep -r "backdrop-filter" dist/assets/*.css` finds only the laminate class + its PRT/`@supports` arms.
5. **A11y sweep**: PRT arm renders (α→1 everywhere — must be pixel-close to pure pencil); PRM arm per §4.4 table; `prefers-contrast: more` arm; keyboard peek (`K`/`Esc`) + marginalia announcement; laminate key digits at cell scale clear WCAG large-text 3:1 (teacher-red on milk-over-cream ≈ 4.0:1 — passes large, note in report); Safari + Chromium paired capture for the laminate (glass-ui §L7's paired-engine discipline; `-webkit-backdrop-filter` authored).
6. **Fiction audit**: every shipped translucent element names its object in a one-line code comment; reviewer greps `--sheet-` consumers against the §1.1 table.

### 7.5 Side-by-side deliverable spec

- **Live**: one build with `?skin=union` / `?skin=pencil` query flag (default pencil), so Pass-3 critics and the owner flip in situ.
- **Stills**: 2×2×2 matrix — {pure, union} × {light, dark} × {idle, laminate-held} = 8 captures at 1280×900 + board-crop pairs for the SSIM gate.
- **Motion**: two ≤6 s clips — laminate lay/hold/lift cycle; celebration beats 1–3 with the sticker gleam.
- **Numbers sheet**: the §5.2 budget table filled in with measured values, trace files alongside (fusion-bench conventions).

### 7.6 Sequencing

Build in an isolated worktree against the integrated frontend stack (post-prototype-8 keyframes 5.1.0, post-prototype-11 `sudoku/`/`skin/` topology — the sheet components are skin-side and must respect the ESLint boundary; no `@sudoku/*` imports except the laminate's mount point, which is domain-side in `SudokuBoard.vue` by design). The scheduler hold API lands app-locally in `boilScheduler.ts` for the prototype and is flagged into the pencil-boil 0.5.0 centralized-gate spec (one more reason the gate lives at the scheduler, corroborating prototype 10's D-feedback). U4's peer-floor ordering is moot (zero glass-ui imports), but don't land before the keyframes/lockfile heal — the worktree would inherit the broken-install state prototypes 8/11 both hit.

---

## 8. Verdict framework for Pass 3

Union vs pure-pencil is decided on these six axes — critique agents attack, the owner ratifies. Pure pencil is the incumbent; the union must win on evidence, not novelty-for-novelty.

| Axis | Instrument | Union passes if | Union fails if |
|---|---|---|---|
| **Soul preservation** (veto axis) | flip test (§7.4.1) + SSIM ≥ 0.99 soul crops + DOM parity | untrained read remains "storybook page"; grid/glyphs/mascot bit-stable | any soul surface changed, or the page reads "app over drawing" — instant kill, no partial credit |
| **Fiction integrity** | the §1.1 naming audit | every translucent element names its real object and behaves like it (laminate lifts away; tape stays put; sheets don't celebrate) | any element only justifiable as "it looks nice" — the owner's own contrived standard (`handdrawn-games-sota.md §3`) |
| **Novelty with function** | the answer-key laminate specifically | peek is something pure pencil *doesn't have* and users plausibly want (check without spoiling — your entries survive), and the held-glass moment feels like the teacher's desk | peek reads as a gimmick or the laminate as decoration → strip to partial adoption (rows 3/4/7: vellum panel + washi tooltip + hover-card), and ask honestly whether ~translucency alone justifies any union at all |
| **Perf** | §5.2 budgets, fusion-bench re-runs | all budgets green incl. the frozen-hold bench | any RasterTask regression (auto-kill) or frozen-hold > budget (laminate → opaque fallback or cut) |
| **A11y** | §7.4.5 sweep | PRT arm ≈ pure pencil; PRM/contrast/keyboard all covered; no contrast floor broken on translucent grounds | any bracket unhandled — glass that only works for default-settings users is contrived by definition |
| **Maintenance surface** | diff stats + dep audit | ≤ ~450 new LOC, ~15 tokens, **zero new dependencies**, frozen recipes with no upstream churn exposure (U2/U9: glass-ui iterates fast and its own docs lag — a snapshot is safer than a subscription) | dependency creep, `glass-*` vocabulary leaking into code, or any pressure toward the wholesale styles import |

**Decision shapes available to the owner**: adopt-full (all P1/P2) · adopt-partial (named rows; the laminate is severable) · reject-to-pure-pencil (the incumbent stays a complete, spec'd, valid end-state — `design-refinement.md` needs nothing from this document). A partial adoption keeping only blur-0 sheets is explicitly honorable: it would mean the evidence supported translucent *paper* and not glass, which is itself a finding the research predicted (`handdrawn-games-sota.md §3`: the strongest precedents were paper-family, not glass).

---

## Findings ledger (this beat)

| # | Class | Finding |
|---|---|---|
| UD1 | design | The union's viable shape is stationery with **one transient pane of glass** (the held laminate); every persistent surface is blur-0 paper-family. Derived jointly from the SOTA precedent gap, the kill-gate's overlap tax, and the fiction — three independent lines converge on the same architecture. |
| UD2 | evidence | glass-ui's own dock ships blur-radius **0px** as a legitimate translucent plate (`DESIGN.md §N7`), and `AttributionCard.vue:74-76` already ships an 80%-alpha, explicitly `backdrop-filter: none` popover — both systems independently pre-validated the blur-0 sheet register. |
| UD3 | doc-drift | glass-ui `DESIGN.md §Glass Surfaces` tier table (blur 12/16/24 px, saturate 1.05/1.4/1.5) is stale against `tokens/glass.css` (8/8/13/13 px, 1.4/1.6, post BA.W-GLASS-CAL + BG.W-GLASS-BLUR-PEER). Fourth U9-class instance; this spec binds to source values, which are also what the kill-gate benched. |
| UD4 | perf-hypothesis | "Frozen boil ⇒ held glass-over-board approaches free" is *derived* from the kill-gate's cadence-tied cost model (rule 3) but **not yet measured** — gated at §7.4.3b, never assumed. |
| UD5 | scope | The celebration, error states, a11y patterns, and all soul surfaces need nothing from the union; `design-refinement.md` remains self-sufficient. The union is severable at every joint. |

## Handoffs

- **Pass-2.5 synthesizer / Pass-3 planner**: §8 is the critique target list; UD4 is the one open empirical question; the laminate is the designated attack surface.
- **Prototype 10 / pencil-boil 0.5.0**: the `acquireHold/releaseHold` gate input (§4.1) joins PRM+visibility in the centralized scheduler gate — third corroboration that the gate belongs at the scheduler, not per-hook.
- **fusion-bench owner**: add the `glass=over-frozen` condition (§7.4.3b) before the prototype lands.
- **Owner**: the §8 decision shapes; and rule §1.2.1's stance — "one pane of glass in the whole app, and only while you hold it" — is the sentence to judge the whole union by.
