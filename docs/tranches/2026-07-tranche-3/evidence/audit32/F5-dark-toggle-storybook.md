# F5 — Dark-toggle storybook transition (sun ↔ moon)

Design lane, Fable, frontend-design skill invoked. Read-only; deliverable is audited knowledge + a motion spec for tranche-III authoring. Browser extension was unavailable this session, so every claim below is code-cited (no live capture; owner-shots reviewed for context only — none show the toggle mid-transition).

All paths relative to `web/frontend/` unless noted. The component: `src/pencil/celestial/DarkModeToggle.vue` (the sole file in `pencil/celestial/`, per pass-1 `R5-fe-structure-audit.md:52`). Mounted once at `src/App.vue:150` inside `.corner-right`.

---

## 1. How the swap animates today

### Structure
Both icons are always-rendered sibling SVGs, absolutely stacked inside a 5rem round button (`DarkModeToggle.vue:8–89, 156–191`). The swap is a pure CSS class flip: `is-active` moves between `.toggle-sun` and `.toggle-moon` when `isDark` flips (`:4, :11, :56`). `isDark` comes from vueuse `useDark` via the global `useTheme()` (`src/composables/useTheme.ts:4–12`, `disableTransition: false` at `:9`) — the `html.dark` class flips **instantly on click** (`handleToggle` → `toggleDark()`, `DarkModeToggle.vue:150–152`).

### The transition itself (`DarkModeToggle.vue:193–221`)
Identical for both icons, both directions:

| state | transform | opacity | transitions |
|---|---|---|---|
| inactive (rest + exit target) | `translateX(-50%) rotate(-270deg) scale(0.1)` | 0 | opacity 800ms `cubic-bezier(0.4,0,0.2,1)` **delay 100ms**; transform 800ms `cubic-bezier(0.34,1.56,0.64,1)` |
| active (entry target) | `translateX(0) rotate(0) scale(1)` | 1 | opacity 300ms (no delay); transform 800ms spring |

So on click: the outgoing body spins −270°, shrinks to 10%, slides **left**, fading over 800ms (fade onset +100ms); the incoming body un-spins from −270° **also from the left**, popping in with the spring's overshoot, fully opaque by 300ms. The comments call it a "dramatic page-turn" (`:193, :208`).

### Ledger conformance (good news)
- The spring `cubic-bezier(0.34,1.56,0.64,1)` **is** the sanctioned `MOTION.easings.spring` curve, whose stated role literally includes "theme page-turn" (`src/pencil/config/pencilConfig.ts:57`).
- 800ms is on the Band-D ledger by name: "theme page-turn 800 ms" (`pencilConfig.ts:22–23`).
- Ambient life is correctly gated: star boil (~8fps), sun-sparkle boil (~8fps), sun-ray boil (800ms tick, Band B) start/stop on `[isDark, reducedMotion]` (`DarkModeToggle.vue:110–126`); CSS pauses all keyframes on the inactive icon (`:224–227`). Cadences match Band A/B (`pencilConfig.ts:15–18`).
- PRM: transitions collapse to `opacity 200ms ease`, `transform: none !important`; rays/breathe/twinkle killed (`DarkModeToggle.vue:252–275`); `useBoilFrame`/`start()` self-gate on PRM in the library (`node_modules/@mkbabb/pencil-boil/src/vue.ts:382`).

### Defects (the case for improvement)

**D1 — No celestial story.** Exit target and entry origin are the *same* pose: `translateX(-50%) rotate(-270deg) scale(0.1)` (`DarkModeToggle.vue:196, :211`). Sun and moon both vanish into and emerge from the same leftward spiral. There is no horizon, no set, no rise — the day/night metaphor the mascots beg for is unrealized. At scale 0.1 with a 100ms-delayed fade, the −270° "drama" is mostly invisible; what the eye gets is a smeared crossfade with a pop at the end.

**D2 — Simultaneity, not sequence.** Both transitions fire on the same frame (one class flip, one CSS engine). For ~300ms both icons sit near-opaque stacked on each other (incoming reaches opacity 1 at 300ms; outgoing hasn't meaningfully faded until past ~400ms given the 100ms delay + 800ms curve) — a double-exposure muddle, the opposite of storybook beats. Storybook = one thing happens, *then* the next.

**D3 — The world flips before the mascot moves.** `toggleDark()` swaps `html.dark` instantly; `index.css` transitions almost nothing on theme (`transition: stroke 500ms` at `src/assets/index.css:302`, `box-shadow 500ms` at `:310` — background/ink snap). So the page is already night while the sun is still leaving. Causality is inverted: in a storybook the world darkens *because* the sun set.

**D4 — Mid-exit soul drop.** `:filter` binds `wobble-celestial` only on the *active* icon (`DarkModeToggle.vue:14, :59`), so at the instant of the flip the outgoing mascot loses its hand-drawn wobble and exits as a clean vector for its whole 800ms departure. Its boil frames also freeze at flip (`watch` at `:123–126`). The dying sun is the *one* moment everyone watches, and it's the one moment the pencil soul is off.

**D5 — Stars are welded to the moon.** The three wobble star polygons and dot stars live inside the moon SVG (`DarkModeToggle.vue:74–87`), so they rigid-body in with the crescent. Stars igniting *after* moonrise is the cheapest, most beloved storybook beat there is, and it's currently free-ridden away.

---

## 2. Motion spec — "Set and Rise" (recommended)

One Band-D choreographed sequence (`pencilConfig.ts:21–23`: finite, completion-emitting, PRM-substitutable), total crest ≈ **1.25s**, well under the 3.2s Band-D cap. The button's `border-radius: 50%` (`DarkModeToggle.vue:163`) plus `overflow: hidden` becomes the **horizon porthole** — bodies set below the bottom rim and rise from it.

### Beats

| beat | window | actor | motion | curve (ledger role) |
|---|---|---|---|---|
| 0 · anticipation | 0–120ms | button | scale 1→0.94→1 squash | Band-C micro (`pencilConfig.ts:20`); spring |
| 1 · SET | 0–420ms | outgoing body | `translateY(0→58%) rotate(0→−28deg) scale(1→0.9)`, opacity 1→0 over the last 30% (clipped by the porthole anyway) | `easeInCubic` — the `erase` curve, role "leave the page" (`pencilConfig.ts:53`) |
| 2 · DUSK | crossover at ~360ms | the page | `html.dark` flips **here**, not at click; `body`/paper get a one-shot 350ms background-color/color ease (scoped — body + sheet only, not `*`) | Band-C one-shot |
| 3 · RISE | 360–940ms | incoming body | `translateY(58%→0) rotate(+22deg→0) scale(0.9→1)` with overshoot | `spring` — role "physical flourish: theme page-turn" (`pencilConfig.ts:57`) |
| 4 · IGNITE | 940–1250ms | stars/sparkles | 3 wobble stars pop 0→1 staggered +0/+80/+160ms; dot stars fade 150ms; moon's inner-stroke detail (`DarkModeToggle.vue:68–71`) draws on 350ms | `pop` back-out for stars (`pencilConfig.ts:55`); `drawOn` easeOutCubic for the stroke (`pencilConfig.ts:51`) |

Reverse direction (dawn) is the mirror: moon sets, page lightens at crossover, sun rises, sparkle diamonds + ray-spin ignite last.

### What carries it (pencil-boil facilities)

- **Sequencing**: one `createSequenceSubscription` per beat on the shared rAF chain — the celebration's subscriber kind (`pencil-boil/src/vue.ts:350–395`): imperative, finite, self-unsubscribing, `delayMs` for onsets, `onComplete` chaining beat 1 → theme flip → beat 3. This keeps the choreography on the *one* scheduler (chains=1 covenant) instead of racing CSS transitions against `setTimeout`. The transforms themselves may remain CSS transitions keyed by phase classes; the sequence subscribers own the *clock* (phase flips + theme flip + `onComplete`).
- **Deferred theme flip**: the component holds a local visual phase; `toggleDark()` is invoked at beat-2 crossover from beat-1's `onComplete`. `aria-label`/`aria-pressed` update at click (state is truthful immediately; only paint is choreographed).
- **Star ignite**: three `createSequenceSubscription`s with `delayMs` 0/80/160 driving scale via `onProgress`, or plain CSS `transition-delay` on a phase class — either is house-legal; the sequence route emits completion for the boil handoff.
- **Draw-on garnish**: `createStrokeDrawIn` on the crescent's inner-stroke path (`pencil-boil/src/vue.ts:410–450`) — 350ms, `easeOutCubic`, PRM-inert by construction (settles instantly under PRM, `vue.ts:428–433`).
- **Boil handoff (fixes D4)**: bind `wobble-celestial` on *both* icons for the transition window (the small-area filter rule caps at logo size; the toggle is explicitly at-or-below the ceiling, `pencilConfig.ts:29–32`), and move `startStarBoil()` from the `isDark` watch to beat-3 `onComplete` — the outgoing body keeps its wobble to the horizon; the stars start twinkling only once lit. After settle, drop the inactive icon to `visibility: hidden` so the second live filter region costs nothing at rest.

### Band accounting
Whole sequence: Band D (1.25s ≤ 3.2s, finite, completion-emitting). Per-beat one-shots: Band C (120–580ms, user-triggered — dead-band exempt per `pencilConfig.ts:25–27`). No new ambient cadence introduced; no new easing — all four house curves used in their ledgered roles, which is itself a small delight: the toggle becomes the one gesture that speaks the entire motion vocabulary.

### PRM variant
Exactly today's shape, kept: no transforms, single 200ms opacity crossfade (`DarkModeToggle.vue:252–262` already does this), stars appear *with* the moon (no stagger), `toggleDark()` fires immediately at click (no deferred flip — a delayed theme change under PRM is a bug, not a kindness), page colors snap (the scoped dusk ease is wrapped in `@media (prefers-reduced-motion: no-preference)`). All sequence subscribers no-op under PRM at the library gate (`vue.ts:382`); `createStrokeDrawIn` paints the settled stroke and fires `onComplete` synchronously (`vue.ts:428–433`), so the beat chain still completes and the theme still flips.

---

## 3. Alternatives considered

### Alt A — "Eclipse wipe"
The moon slides in laterally and occludes the sun (a hand-drawn eclipse); the page darkens in proportion to coverage (`onProgress` driving the dusk ease); totality = theme flip; the moon settles, stars ignite. Dawn is the moon sliding off to reveal the sun.
**Soul judgment**: genuinely enchanting on paper and mechanically cheap (one translateX + a progress-coupled color ease — the progress-coupling is the star trick here). But it misreads the fable: an eclipse is an *event*, rare and slightly ominous — not the daily, domestic rhythm of dusk and dawn that a bedtime-storybook world runs on. And practically, the crescent (`DarkModeToggle.vue:63–65`) is a poor occluder — its bite exposes the sun behind it mid-wipe, forcing either a full-disc moon variant (new asset, off-model) or a visible cheat. **Runner-up**; the progress-coupled dusk is worth stealing into the primary spec (beat 2 could ease with beat 1's raw progress rather than a fixed onset).

### Alt B — "Page-flip proper"
Take the code comment ("dramatic page-turn", `DarkModeToggle.vue:193`) literally: the toggle is a little paper card; day flips over to night via `rotateY 0→−90°` (easeInCubic) / swap / `−90→0` (spring), with a skew for paper bend and a shadow sweep.
**Soul judgment**: **rejected**. The pencil world is resolutely flat — grain, wobble, boil, zero perspective anywhere in `src/pencil/`. A 3D card flip imports app-chrome physics (Material/iOS flashcard trope), precisely the generic gesture this skin exists to refuse. The "storybook" isn't pages-as-UI-objects; it's the *illustration* living. The sun setting **is** the page turning.

### Why "Set and Rise" wins
It's the only choreography where the mechanism *is* the metaphor: body sets → world dims → body rises → lights come on. It fixes all five defects (D1 horizon, D2 sequence, D3 causality, D4 wobble continuity, D5 star stagger), spends nothing new (four ledgered curves, existing filter, existing scheduler primitives, existing SVG assets — only the stars want an independent phase class), and it upgrades the toggle from a control into the product's smallest complete story.

---

## 4. Tranche-III work items (for the authoring pass)

1. Rebuild `DarkModeToggle.vue`'s transition CSS: replace the shared leftward-spiral pose (`:196, :211`) with set-below/rise-from-horizon poses + `overflow: hidden` porthole; phase classes driven by `createSequenceSubscription` chain; defer `toggleDark()` to the crossover.
2. Filter continuity: `wobble-celestial` on both icons during the window; `visibility: hidden` at rest for the inactive one (fixes D4 with no steady-state cost).
3. Move `startStarBoil()`/`startSunBoil()` onset from the `isDark` watch (`:123–126`) to rise-`onComplete` (keep the PRM re-assert semantics the watch documents at `:118–122`).
4. Scoped dusk ease in `index.css` (body + sheet background/color, ~350ms, `no-preference`-gated) — the only page-level addition; conforms to the existing 500ms stroke/box-shadow precedent (`index.css:302, :310`).
5. Ledger update: `pencilConfig.ts:22–23`'s Band-D entry "theme page-turn 800 ms" becomes "theme set-and-rise ≈1.25 s"; no new easing rows.
6. This dovetails with the already-booked `useCelestialSun()` M4 lift + celestial palette consumption (`pencilConfig.ts:83–92`) — the rebuild is the natural moment to rewire the template onto `YOSHI_COLORS.celestial`.
