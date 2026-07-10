# T3-W10 — Design: sky + page

**The gold that step-3 brought down to the page now gets its origin story in the sky — the dark toggle becomes "set and rise," the game switch becomes a page-turn, the celestial bodies read at size, and the dropdown frame finally registers to its card at every host including 375.** Where W9 stamps gold onto the finished page, W10 tells the light's causality: the sun sets *then* the world dims *then* the moon rises *then* the stars ignite; the pencil erases this exercise *then* draws the next. Two of the owner's four design findings live here (dark-toggle SVG + storybook transition, game-switch choreography), plus F4's slight pass and F1's registration fix. **G10 satisfied this wave's live-re-probe dependency** — every premise below entered authoring live-verified.

**Dependencies**: ← W9 (the gold tokens the sky consumes are truthed there); **G10 dependency SATISFIED** (F4/F5/F6 code-inferred claims verified against the live instance, R-9). **Effort**: L.

---

## Scope

### F5 — "Set and Rise" (the dark toggle, G10 D1–D5 live-verified)

Today's swap is a leftward-spiral crossfade with no story: exit target and entry origin are the *same* pose (`translateX(-50%) rotate(-270deg) scale(0.1)`, `DarkModeToggle.vue:196,211`), both transitions fire on one frame (~300ms double-exposure — G10 measured max co-opacity **0.93 at 269ms**, both >0.5 for ~247ms), the world flips before the mascot moves (`html.dark` lands on the following microtask ~4ms — G10's correction to F5's "instantly on click"), the outgoing icon loses its wobble mid-fade (filter only on the active icon), and the stars are welded inside the moon SVG.

One Band-D choreographed sequence, total crest **≈1.25s** (well under the 3.2s cap). The button's `border-radius:50%` + `overflow:hidden` becomes the **horizon porthole** — bodies set below the rim and rise from it.

| beat | window | actor | motion | curve (ledger role) |
|---|---|---|---|---|
| 0 · anticipation | 0–120ms | button | scale 1→0.94→1 squash | Band-C micro; spring |
| 1 · SET | 0–420ms | outgoing | `translateY(0→58%) rotate(0→−28deg) scale(1→0.9)`, opacity fades last 30% | `easeInCubic` (the `erase` curve, "leave the page") |
| 2 · DUSK | crossover ~360ms | the page | `html.dark` flips **here**, not at click; body + sheet get a one-shot ~350ms color ease (scoped, `no-preference`-gated) | Band-C one-shot |
| 3 · RISE | 360–940ms | incoming | `translateY(58%→0) rotate(+22deg→0) scale(0.9→1)` overshoot | `spring` ("physical flourish: theme page-turn") |
| 4 · IGNITE | 940–1250ms | stars/sparkles | 3 wobble stars pop staggered +0/+80/+160ms; dot stars fade 150ms; crescent inner stroke draws on 350ms | `pop` back-out; `drawOn` easeOutCubic |

- **Mechanism**: one `createSequenceSubscription` per beat on the shared rAF chain (the celebration's subscriber kind, `pencil-boil/src/vue.ts:350-395`) owns the *clock* — phase flips + the deferred theme flip + `onComplete` chaining beat-1 → theme flip → beat-3; the transforms stay CSS transitions keyed by phase classes. `toggleDark()` fires at the beat-2 crossover from beat-1's `onComplete`; `aria-label`/`aria-pressed` update at **click** (state truthful immediately, only paint choreographed).
- **Filter continuity (fixes D4)**: bind `wobble-celestial` on **both** icons for the transition window (the toggle is at/below the small-area filter ceiling, `pencilConfig.ts:29-32`); after settle drop the inactive icon to `visibility:hidden` so the second live filter region costs nothing at rest. **Move `startStarBoil()`/`startSunBoil()` onset** from the `isDark` watch (`:123-126`) to rise-`onComplete` — the outgoing body keeps its wobble to the horizon; stars twinkle only once lit.
- **Scoped dusk ease** in `index.css` (body + sheet background/color, ~350ms, `@media (prefers-reduced-motion: no-preference)`) — the only page-level addition, conforming to the existing 500ms stroke/box-shadow precedent (`:302,310`).
- **Ledger update**: `pencilConfig.ts:22-23`'s Band-D "theme page-turn 800 ms" → "theme set-and-rise ≈1.25 s"; **no new easing** — all four house curves in their ledgered roles (the toggle becomes the one gesture that speaks the whole motion vocabulary).
- **PRM variant** (kept, exactly today's shape): no transforms, single 200ms opacity crossfade (`DarkModeToggle.vue:252-262`), stars appear *with* the moon (no stagger), **`toggleDark()` fires immediately at click** (a delayed theme change under PRM is a bug, not a kindness), page colors snap. Sequence subscribers no-op at the library gate (`vue.ts:382`); `createStrokeDrawIn` paints settled + fires `onComplete` synchronously, so the chain still completes and the theme still flips.

### F4 — slight pass, MINUS M4 (G10 §1 live-verified; K43)

At-size legibility + path nicks, all slight (no redesign). **M4 is DROPPED** — G10 refuted it as stated (`html.dark` lands ~4ms after click, body has no color transition → paper snaps dark frame-1; the incoming moon never sits on light paper; the moon-on-light exposure exists only dawn-direction, outgoing, smaller/briefer — and F4 already marked it optional).

- **W1** — +1 unit on the two primary outlines: sun disc `stroke-width 5→6` (`DarkModeToggle.vue:30`), moon crescent `6→7` (`:65`) — +0.4px at 5rem, +1px at 13rem; closes the register gap to the Fraunces-900 wordmark without leaving crayon territory.
- **S1** — the spiral reads as the letter "G" at 5rem/4rem (the sw-10 stroke fuses coil gaps + the inner start segment bars): trim the terminal to curl not bar (`M100,102`, tighter first curl `C105,93 116,96 117,107`; end the outer coil short `…132,78`; sw 10→9).
- **S2** — spiral contrast 1.17:1 (nearly tonal): deepen one step in-family `#F0B030 → #DF9A1E`. **S3** — sparkle diamonds sub-pixel invisible: stroke `1.5→3` + deepen `#F0B030 → #D99A10`.
- **M1** — lower horn blunt (banana not crescent, the single highest-value edit): extend the outer terminus + pull the return's first control inward (`C55,185 118,192 160,143 C122,162 70,145 60,95`, `:64`). **M2** — cracked upper tip: move the detail stroke down + thin (`M72,52 …`, sw 4→3.5, `:68-70`; nudge the closing control `65,40→66,42`). **M3** — white dot stars are chromatic strays: recolor `#FFFFFF → #FFF4AA` (`:85-87`) so the star field is one temperature.
- **F4-F1 filter-on-both-icons** — folds into F5's D4 fix (bind unconditionally; the inactive icon is opacity-0 with paused CSS animations, so steady-state cost is nil). **S4/M4 optional** (S4 lumpy-circle disc; M4 dead). **S5** = a one-line pencil-boil upstream edit (`generateSunRays` inset `outerR-5 → outerR-8`) — ships with the next patch version, not a repo change.

### Celestial palette rewire — primitives only (G3, M4 composable stays PARKED)

The star's duplicated hexes (`CelebrationStar.vue:109-111`) rewire to `YOSHI_COLORS.celestial.sun.sparkle`/`rays` — one family, one source (F8 §2.2). **The `useCelestialSun()` M4 lift stays parked** — G3 confirmed the supply side healthy (primitives exported + consumed, the composable deliberately unadopted; the gate correctly unfired both sides, no action). This wave rewires the *template onto* the celestial palette (the natural moment during the F5 rebuild), it does **not** land the parked composable.

### F6 — page-turn game switch (G10 §3 live-verified incl. throttled void)

Conceit: the two games are exercises in the same graded workbook; a switch is the pencil erasing this exercise and drawing the next — not a page reload, not a router transition. Today it's an unchoreographed hard cut (G10: menu + scene detach at t=6ms same frame, blank paper t=6-20ms, futoshiki mounts t=20ms, no erase beat). One Band-D sequence, **≈1.05s**.

| beat | what | duration | easing | mechanism |
|---|---|---|---|---|
| 0 | menu close (NEW leave motion, fixes D1) | 120–150ms | ease-out reverse of `logo-menu-in` | CSS `@keyframes` |
| 1 | grid erase (the EXISTING `animateErase`, merely unrouted today) | ~250ms | easeInCubic | pencil-boil `sequence` |
| 1 | controls/glyphs fade-out | 200ms | easeInCubic | CSS |
| 2 | seam — `v-if` flip on the erase's `animationComplete` | 0 | — | App phase state |
| 3 | grid draw-in (as shipped) | ~800ms | easeOutCubic | pencil-boil `sequence` |
| 3 | controls fade-in (+150ms delay) | 250ms | easeOutCubic | CSS |

- **D1 menu-leave**: the 120–150ms leave makes I2's `HandwrittenLogo.vue:94` comment ("the menu-close motion already carries the swap") true instead of aspirational — today close is a same-frame pop.
- **D2 `animatingCells` clear on switch-away**: Sudoku's `useSudoku()` survives the switch (`App.vue:65`), so on switch-back the stale `animatingCells` set + fresh DOM replays the full cell reveal wave (G10: 24 cells, 24 running animations, on a remount with no new puzzle) — the exact "reads as a page reload" failure I2 fixed for the wordmark, still live on the board. One line in `setGame`'s path (or a `boardGeneration`-freshness check).
- **D3 chunk preload on menu-open**: `import('@games/futoshiki/FutoshikiGame.vue')` fired from `toggle` — by selection time it's cached, killing the void structurally. **G10 dramatized D3**: under CDP throttle (30 KB/s, 500ms latency) the first futoshiki select shows the wordmark over pure empty paper with no loader for 150–3000ms (`first-select-void-400ms.png`); locally the void is ~14ms (invisible — why it survived). Fallback if cold: hold blank paper ≤300ms then `ScribbleLoader` (exists), never a spinner. **This shot is the W7 e2e gate exhibit** (assert a loader or mounted shell within N ms of select under throttle — the D3 gate lives in W7's e2e sweep).
- **keyframes.js re-adoption — CLOSED-REJECT, recorded** (F6 §3, G3 source-verified): the R8 excision stands, and pencil-boil `sequence` + CSS already carry the whole feature (both animated halves exist as `sequence` subscribers on the one chain — erase is merely unrouted). keyframes.js 5.2.0 is genuinely standalone now (no reka-ui/glass-ui in its chain), but what it buys — spring physics core, RAFPlayback loops, runtime CSS parsing — **has no site in this transition or this skin**: the pencil canon bans per-cell RAFPlayback (`pencilConfig.ts:271`), glyph draw-in was *deliberately migrated off* keyframes.js to a `sequence` subscriber (`glyphAnimations.ts:5`), and the skin's only two springs are CSS beziers. Re-adoption = a second animation brain + a runtime CSS parser to run 2 fades + 2 existing sequences, re-splitting the one clock W8/W12 unified. **WAAPI as a third leg is rejected for the same reason** (a third timing authority for zero capability gain). Re-entry is a **capability gap** (numeric path morphing / spring physics — `glyphPaths.ts:7`'s dormant affordance), never a version number.
- **PRM**: every constituent is already gated (draw-in/erase short-circuit via `showInstant`, logo skips its wipe); the orchestrator must **also skip the beat-1 hold under PRM** so the swap stays a same-frame cut (a PRM user waiting 250ms for an invisible animation is a regression).

### F1 — px-native dropdown frame, every host incl. 375 (pixel-measured lane)

The `HandDrawnOutline` frame floats ~5–6px off the logo-menu card on all sides (F1: measured 5.11–5.79px outset; UI-1: worst at 375 dark, where the outer white rectangle floats clear of the dark card and the board reads through the gap). Root cause is **two coordinate systems** — the SVG outsets a fixed 6px (`HandDrawnOutline.vue:86-90`) but insets the path a proportional 8 viewBox units of a 1000-unit box (`:14-15,40`), so registration only holds at one host size, and the popover is its smallest host by 3–4×.

- **Px-native geometry — registration by construction**: generate the path in a viewBox equal to the measured px box + `2·outset` (`outset` a prop, default 0), pad the rect by that same `outset` — one number, one coordinate system. Drop the fixed `inset:-6px/+12px` CSS and `preserveAspectRatio="none"` (scale becomes 1:1, so `vector-effect: non-scaling-stroke` and the anisotropic-wobble side effect both vanish). HandDrawnOutline already measures its host (`useResizeObserver`, `:21-27`); boil frames already regenerate on resize — no new cost.
- **Radius-aware wobble rect**: teach `generateRectBoilFrames` a `radius` param (shorten sides by `r`, join with jittered arc-sampled polylines, in-family with the jagged aesthetic); HandwrittenLogo passes the card's own radius (`border-radius:0.75rem`, `:278`) — single token, no duplicated literal. Fixes the square-frame-inside-rounded-card double-edge read.
- **One-edge ownership**: the wobble frame *is* the drawn edge — provide a **border-less elevation variant** (shadow without `cartoon-shadow-md`'s `border:2px solid`, `index.css:241-248`) for outlined hosts; the 8px hard shadow stays (correct storybook grammar — the shadow lies beneath the lifted sheet, outside the drawn edge).
- **R5 transform truthing**: `cartoon-shadow-md`'s `transform:translateY(-2px)` (`index.css:248`) is silently dead on the menu card (the `logo-menu-in` animation fills forward at `translateY(0)`, `:283,328-337`) but alive on non-animated hosts — fold the −2px into `logo-menu-in`'s `to` keyframe, or drop it for animated hosts; make declared and rendered lift agree.
- **Blast radius**: every HandDrawnOutline host floats somewhat (a ~400px error note ~2.7px); px-native geometry tightens all uniformly — **verify each host visually after the change, at 375 specifically** (UI-1's scaling defect), picking per-host `outset` where a hair of air is wanted. Hosts: `App.vue:208,232`, both `SolverErrorNote`s, `FutoshikiGame.vue:122,144`, the logo menu. PRM unaffected (boil cadence is pencil-boil's, `logo-menu-in` PRM-disabled `:356-367`).

## Gates

Verbatim from the reconciliation (§2 DAG, T3-W10):

| Gate | Value |
|---|---|
| Headline | PRM variants exercised; band ledger updated (800 ms→≈1.25 s row); F1 verified at 375; page-turn ≈1.05 s traced |

Component checks:

| Gate | Value |
|---|---|
| F5 set-and-rise | crest ≈1.25s (Band-D, finite); theme flip deferred to the crossover; PRM immediate-flip + 200ms crossfade; no new easing row |
| F4 slight pass | W1/S1–S3/M1–M3 landed at 5rem/13rem; M4 absent (K43); filter bound on both icons; no silhouette/palette-family change |
| F6 page-turn | ≈1.05s traced; erase→seam→draw routed; D1 menu-leave real, D2 no reveal-wave replay on switch-back, D3 chunk preloaded on menu-open; the throttled-void exhibit gates in W7's e2e |
| F1 registration | frame hugs the border box at every host **including 375** (UI-1 reproduction cleared); radius agrees; R5 lift declared==rendered |
| keyframes.js | the CLOSED-REJECT recorded with its re-entry criterion (capability gap, not a version) — no dependency added |

## Seeds

- [`audit32/F5-dark-toggle-storybook.md`](../evidence/audit32/F5-dark-toggle-storybook.md) — the current transition table, D1–D5, the Set-and-Rise beat spec, the pencil-boil facilities, the PRM variant, the rejected alternatives (Alt-A eclipse, Alt-B 3D flip), the six work items (§4).
- [`audit32/F6-game-switch-transition.md`](../evidence/audit32/F6-game-switch-transition.md) — the traced switch path, the choreography spec, the library decision table (pencil-boil ADOPT / keyframes.js REJECT / WAAPI not-needed), the defect ledger D1–D4.
- [`audit32/f4-darkmode-toggle-svgs.md`](../evidence/audit32/f4-darkmode-toggle-svgs.md) — W1/S1–S5/M1–M4 with path-level specs + the harness renders; the contrast appendix.
- [`audit32/design-f1-dropdown-border.md`](../evidence/audit32/design-f1-dropdown-border.md) — the quantified symptom, R1–R5 root causes, the idiomatic four-step fix spec, the blast-radius note.
- [`pass3/G10-design-reprobe.md`](../evidence/pass3/G10-design-reprobe.md) §1–3/§6 — F4/F5/F6 live-verified, the M4 refutation (K43), the F5-D3 microtask wording, the F6 throttled-void exhibit, the `:3000`/HMR mechanism.
- [`pass3/G3-pencil-boil-pin.md`](../evidence/pass3/G3-pencil-boil-pin.md) — the keyframes.js source-verified covenant, the M4 supply confirmation (composable parked), pencil-boil pinned at `106a5a2`.

## Residual risks

- **Every premise is live-verified (G10) — what remains is execution + the PRM/band gates.** No spec row collapsed in the re-probe; the one refuted row (M4) was already optional and is dropped.
- **M4 is re-arguable only against the dawn direction** (K43): the outgoing shrinking crescent past ~230ms does sit briefly on lightening paper — smaller and briefer than F4 implied; if a dawn-only stroke-deepen is wanted it re-enters against that direction, not the refuted incoming-moon claim.
- **The F5 rebuild couples the theme-flip clock to the sequence chain** — the deferred `toggleDark()` must fire from beat-1's `onComplete` *and* under PRM must fire at click; the two paths are the load-bearing correctness (a theme that never flips because a sequence didn't complete is the failure mode — the library gate paints settled + fires `onComplete` synchronously under PRM, which is why the chain still completes).
- **F6's orchestrator is ~20 lines of App phase state** (or `<Transition mode="out-in">` awaiting the erase) — bespoke but trivial; the risk is a PRM regression (the beat-1 hold must skip) and the `animatingCells` clear landing on the right path (switch-away, not every remount).
- **F1's px-native change touches every HandDrawnOutline host** — the fix tightens all uniformly, but per-host `outset` tuning is a visual pass; 375 is the acceptance case (the worst reproduction), desktop is necessary-not-sufficient.
