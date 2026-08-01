# F2 — THE PENCIL-CASE TRAY · RESEARCH DOSSIER (pass 1)

Lane: RESEARCH. Charter: `charter-f2.md`. Read-only against
`/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend`.
Every verdict below traces to a file:line or a banked evidence row at HEAD `32198688`.

---

## Q1 — THE EXISTING OBJECT VOCABULARY (what the tray may extend)

**The icon set is 8 components, all `viewBox="0 0 24 24"`, 538 LOC total, rendered at 26–28 px.**

| file | LOC | rendered size | mechanism |
|---|---:|---:|---|
| `src/pencil/chrome/icons/DiceIcon.vue` | 148 | 28 (`GameControlPanel.vue:396,570`) | 2 rotated rects + 7 pips, `currentColor`, CSS `diceRoll` 500ms + staggered `pipPop` 200→440ms |
| `EraserIcon.vue` | 58 | 28 | one Q-curved body path + sleeve line + a 0.5-opacity "worn-edge retrace" + 2 scrub swipes + 1 crumb |
| `SolveIcon.vue` | 88 | 28 | `.sparkle-icon` overrides stroke+fill to `url(#sparkle-rainbow)` |
| `FillForcedIcon.vue` | 80 | 26 | draw-in marks on press |
| `HintIcon.vue` | 60 | 26 | — |
| `UndoIcon.vue` / `RedoIcon.vue` / `ShareIcon.vue` | 36/34/34 | 26 | plain relays |

The grammar is consistent and cheap: **stroke-only paths at `stroke-width` 1.1–1.8 in a 24-unit box,
`stroke="currentColor"`, `fill="none"` except pips/crumbs, a deliberate second "retrace" pass at
0.5 opacity for wear** (`EraserIcon.vue:34-40`). No gradients, no rasters, no per-beat writes.

**There is NO pencil object and NO pen object in the estate.** Exhaustive: `find src -iname
"*pencil*" -o -iname "*pen*"` returns only `PencilModeToggle.vue`, `usePencilMarks.ts`,
`pencilConfig.ts`, and the `src/pencil` directory. The full drawn-object roster under
`src/pencil/chrome` is 8 icons + `CrayonHeart`, `CelebrationHeart`, `CelebrationStar`,
`ScribbleLoader`, `CompletionVignette`, `MarginNote`, `HandwrittenLogo`, `SheetWashiLabel`,
`BoilDivider`, `OptionSelector` (+ `DarkModeToggle` in `celestial/`). **So the charter's "three drawn
pencils" and "the teacher's red pen" are NEW object families, not extensions.** The die is not new
(re-scale `DiceIcon`); the compartment frame is not new (`HandDrawnOutline`).

### `HandDrawnOutline.vue` — the compartment frame, already free

`src/pencil/grid/HandDrawnOutline.vue` is the cheapest surface in the app and the natural
compartment well:

- **px-native by construction** (`:12-16`): "The path is generated in a viewBox equal to the
  measured px border box padded by `outset` on every side: one number, one coordinate system, so
  the frame hugs its card at EVERY host size." So a compartment well registers at any size — no
  re-derivation per compartment.
- **The grain is baked into the geometry; there is no filter at all** (`:23-25`): "grain-outline is
  no longer a live filter here — its GrainConfig feeds the geometric bake (gridPaths.ts §Grain
  bake) and the poses render as static filterless siblings, opacity-swapped on the beat.
  Steady-state raster: zero." Soul gate on the record at `pencilConfig.ts:250-251`: **SSIM 0.996 /
  0.993 (tab), 0.993 (stroke band panel) @DPR2 settled.**
- **`:pose` opt-out already exists** (`:33-40`): a consumer that binds `:pose` "enrols NO shared
  beat" — the gallery's frozen-flank discipline, generalized. A tray compartment can therefore be
  *frozen* (pose 0, zero enrolment) or driven from one beat, by prop.
- Params: `strokeWidth` default 6, `outset` default 4, `radius` default 0 ("square, jagged
  overshoot crossings"). Existing mounts: 6 total — `DrawerTab` ×1, `GameScene` ×2 (mobile card +
  rail card), `SolverErrorNote` ×1, `GameCard` ×1, `GameGallery` ×1.

**Verdict: the compartment well should be `HandDrawnOutline` with a smaller `strokeWidth` (the cards
use 3–4) — zero new mechanism, zero raster, zero beat enrolment, and the soul gate is already
passed.** This is the single most consequential finding for F2's budget.

### `SheetWashiLabel.vue` — the compartment label, already free

`src/pencil/sheet/SheetWashiLabel.vue` (133 LOC) is "a scrap of tinted paper tape holding a name"
(`:3-4`): seeded 6-point `clip-path` torn ends + seeded ±1.5° tilt from `mulberry32(seed*2654435761
+ text.charCodeAt(0))` (`:32-49`), `background: var(--sheet-washi-neutral)`, **"Blur-0, static, one
paint per show"** (`:8`). Three modifiers already exist: `anchor="center"` (pins to the parent's own
box, `:95-103`), `persistent` (opacity 1 under `@media (pointer: coarse)`, `:121-125`), `wide`
(wraps within `max-width: 15rem`, `:108-117`).

**Verdict: `persistent` + `anchor="center"` washi IS the self-labelling compartment tag the charter
asks for, and it is already coarse-persistent — which is exactly the mobile requirement.** Current
seeds in use: 11 (Deal), 23 (Clear), 37 (Solve), 43 (fill forced), 53 (hold to peek), 71 (share) —
so a tray needs new stable seeds outside {11,23,37,43,53,71}.

### `BoilDivider.vue` — the ruled line, and the one place the perf war is still live

`src/pencil/chrome/BoilDivider.vue` is the app's **ONE remaining live-filtered pose stack**
(`:48-51`), and it carries the Safari kill switch verbatim:

> `BoilDivider.vue:42-47` — "WebKit paints SVG content unlayered — `will-change: opacity` on an
> inner `<g>` earns no compositor layer there — so each beat's opacity flip re-rasters the live
> grain-static pose through the surrounding card's filter chain: measured **~10 fps steady-state on
> desktop Safari** against the deployed edge (2026-07-15), **recovering to 98 fps** with the divider
> pinned."

`const LIVE_FILTER_FROZEN = navigator.vendor === "Apple Computer, Inc."` (`:52-53`) → pose count
collapses to 1 on Apple WebKit via `heldFrameCount`. It failed the geometric bake's soul gate at
**SSIM 0.809 vs the 0.983 gate** because it is 100% stroke (`:22-28`) — the banked reason a
stroke-only surface cannot take the free geometric path.

**Verdict for the tray: the divider is a cautionary precedent, not a template. Any tray object that
BOILS under a live filter on WebKit reproduces the 10 fps failure. The tray's objects must either
be static (no beat) or take `HandDrawnOutline`'s filterless geometric-bake path.**

### `CrayonHeart.vue` — the proof the estate renders objects, and the size→filter ladder

`src/pencil/chrome/AttributionCard/CrayonHeart.vue` (342 LOC + `heartPaths.ts`) is the estate's
existing *object with a variant family* — 4 variants (`idle`/`celebration`/`blush`/`tiny`,
`:50`), geometry hoisted to a sibling paths module, hexes imported from `YOSHI_COLORS` (`:22-23`).
It also fixes the **filter ladder by rendered size** (`:86-95`):

```
const filterUrl = computed(() => {
  if (isTiny.value) return props.size < 20 ? undefined : "url(#grain-static)";
  return "url(#wobble-heart)";
});
```
Doc: "no wobble below ~20px (scale-5 displacement shreds a 16px raster), grain-static at 20–32px"
(`:19-20`). **Directly binding on the tray:** an object below 20 px gets NO filter; 20–32 px gets
`grain-static`; only above ~32 px may it wear a wobble. A BIG die at 56–72 px therefore *may* wear
`wobble-heart`, and three small pencils at ~24 px must wear `grain-static` or nothing.

---

## Q2 — COMPARTMENT GRAMMAR AND THE STANZA STACK IT REPLACES

### What the stanza stack actually is (measured, not estimated)

The desktop drawer renders **5 heading + `OptionSelector` stanzas** and **6 `.section-heading`
nodes**:

| # | stanza | source | options |
|---|---|---|---:|
| 0 | "New game" eyebrow (heading only) | `GameControlPanel.vue:539` | — |
| 1 | Size / Board Size | `sections` v-for, `:544-556` | 3 |
| 2 | Difficulty | same v-for | 3 |
| — | Deal row (`.deal-row`, one `.icon-btn`) | `:563-579` | 1 button |
| — | `peek-hold-surface` + `BoilDivider` + washi | `:587-596` | gesture |
| 3 | Marks | `PencilModeToggle.vue:36-45` | 3 |
| 4 | Check | `AssistSettings.vue:61-70` | 3 |
| 5 | Candidates | `AssistSettings.vue:76-88` | 2 |
| — | action row: Clear · Fill · Solve · Share | `:613-673` | 4 buttons |
| — | `.play-controls`: Undo · Redo · Hint (coarse only) | `:678-706` | 3 buttons |
| — | `KeyboardLegend` (fine only, 5 rows) | `:709` | — |

Control inventory: **14 `.ctrl-btn` + 5 `.icon-btn` (fine) or 8 (coarse) + 1 gesture surface**
→ 20 interactive targets on a fine desktop, 23 on coarse.

All five stanzas share ONE register — `.section-heading` in `assets/typography.css:251-259`:
`font-family: var(--font-display)`, `font-size: var(--type-subheading)` = **1.272rem / 20.4 px**
(→ `--type-heading` **1.618rem / 25.9 px** at ≥md, `text-align: left`, `padding-left: .75rem`,
`:262-267`), `font-weight: 800`, `text-transform: uppercase`. That single shared register IS the
charter's problem-2: staging, play, and preference are typographically identical.

The only zone marks in the whole panel: the `BoilDivider` + placement, plus the `--color-*-ink`
crayon tone that the *difficulty* heading alone derives from data (`GameControlPanel.vue:133-139`
`activeColorClass`/`headingClass`, deriving from `colorClass` present on `difficultyOptions` and
absent on `sizeOptions`).

### The Deal affordance, quantified

`DiceIcon :size="28"` inside `.deal-btn` (min 44×44, `padding: .3rem .85rem`, `flex-direction:
column`, `:757-769`) + `.icon-sublabel` at `var(--type-caption)` (12→16 px) in `var(--font-hand)`.
**The commit verb's glyph is 28 px against a Difficulty heading of 25.9 px at ≥md — a ratio of
1.08:1.** The owner's read (`design-refinement-marks-2026-07-31.md:17`) is "a tiny ~24px glyph
floating over dead space, label beneath, orphaned between the difficulty list and the divider."

### How compartments could replace it — mechanism, not taste

Three realizations available at zero new machinery:

1. **A drawn tray-well** = `HandDrawnOutline :stroke-width="2" :outset="6" :pose="0"` around the
   compartment's contents. Zero raster, zero beat, px-native at any size, soul gate passed.
   `radius` can go non-zero if a well should read rounded (`HandDrawnOutline.vue:36`).
2. **A washi-taped region** = `SheetWashiLabel persistent anchor="center"` as the well's tag,
   already blur-0/static and already coarse-persistent.
3. **Ruled sub-sheets** = `BoilDivider` per compartment — **REJECT.** Each instance is a live
   `grain-static` pose stack; on Apple WebKit each is frozen to pose 0 anyway, and the two current
   instances already cost the measured Safari regression. Multiplying it is the exact anti-pattern.

**Note a structural gift**: the New-game compartment already exists as a DOM box. `.new-game-zone`
(`:733-736`) wraps `.control-panel-filtered` + `.deal-row` with `role="group"` +
`aria-labelledby=newGameId` (a per-instance `useId()`, `:241` — two panels mount per game, so ids
must stay unique). The remaining zones (Marks / Check / Candidates / actions) have NO wrapper. So
the tray adds 2–3 wrapper elements and re-parents; it invents no semantics beyond what U2 shipped.

---

## Q3 — THE CHECK INTEGRATION QUESTION (the owner's sorest point)

**Answer: yes, and the object grammar does something the segmented control structurally cannot —
but only with FOUR poses, not three.**

`useAssists.ts` is the authority. The mode is three ordinal values *plus a hidden transient*:

```
useAssists.ts:38-46
const errorCheckMode = ref<ErrorCheckMode>("on-demand");
const checkArmed = ref(false);
function setErrorCheckMode(mode) {
  errorCheckMode.value = mode;
  checkArmed.value = mode === "on-demand";   // entering OR re-tapping on-demand IS the check act
}
useAssists.ts:63
watch(values, () => (checkArmed.value = false), { deep: true });
```

1. **`checkArmed` is a real fourth state and it is INVISIBLE in today's UI.** `AssistSettings.vue`
   receives only `errorCheckMode` + `candidatesPinned` (`:22-28`). So when a board edit disarms the
   snapshot (`:63`), the segmented control shows *exactly the same pixels* as when it was armed.
   That invisibility is precisely why re-tapping "Ask" reads as a no-op and why the whole area reads
   "contrived."
2. **The load-bearing same-value re-emit exists only to work around that invisibility.**
   `GameControlPanel.vue:98-99` and `AssistSettings.vue:18-21`: "`errorCheckMode` STAYS a manual
   prop+emit (§1a #2): OptionSelector emits on every click and re-tapping 'Ask' re-arms the
   on-demand snapshot on a SAME value — defineModel's hasChanged guard would swallow that
   re-emit."
3. **A pen object maps 1:1 onto all four states, and the mapping is legible:**
   - `off` → pen away (in the case's lid / not in the tray)
   - `on-demand` + `!checkArmed` → **pen lying on the desk, capped** (the snapshot has decayed)
   - `on-demand` + `checkArmed` → **pen in hand, ink wet** (the point-in-time check is showing)
   - `live` → **pen uncapped, standing / clipped to the sheet** (continuous)

   Under that grammar "re-tap Ask to re-check" becomes *pick the pen back up* — natural **because
   the pen visibly went back down** when the edit disarmed it. The engineering weirdness stops
   being a workaround and becomes the object's own animation.
4. **The plumbing cost is one prop per scene, and the value already exists in scope.**
   `proactiveCheck = live || (on-demand && checkArmed)` (`useAssists.ts:54-58`) is already exported
   through `useGameState.ts:744-745,898-899` and already bound to the BOARD in all five scenes
   (`SudokuGame.vue:131`, `FutoshikiGame.vue:121`, `ThermoGame.vue:106`, `KillerGame.vue:96`,
   `KenKenGame.vue:95` — `:proactive-error-check=`). The panel simply needs the same value:
   **5 one-line bindings + 1 prop on `GameControlPanel` + 1 on the tray's Check compartment.**
5. **The color already exists and is AA-audited.** `--color-red-ink: #d02a52` — "teacher-red
   #E8315B hue-locked (346°), darkened to AA" (`assets/index.css:163`), contrast recorded at
   `:160` (**4.87:1 on `--color-background`**), and in dark it aliases the wax:
   `--color-red-ink: var(--color-crayon-rose)` = `#ff5c7c` (`:324,331`). It is already consumed as
   `.crayon-rose { color: var(--color-red-ink) }` in the panel (`GameControlPanel.vue:786-788`) and
   is the Hard-difficulty tone. **Watch for collision: the same rose is also the armed-confirm
   voice** (`.icon-sublabel.is-armed { color: var(--color-crayon-rose) }`, `:864-867`) **and the
   Hard difficulty heading.** Three meanings on one hue inside one card is a real risk the CRITIQUE
   pass must weigh.

**Residual risk:** `off` must not read as "broken/absent." The pen-away pose needs to be a
*deliberate* absence (an empty pen-slot in the tray with a drawn outline of where the pen goes) —
otherwise `off` reads as a missing object, not a chosen one.

---

## Q4 — WITHIN-DRAWER CHOREOGRAPHY (≤120 ms stagger inside the 520 ms glide)

### The window, exactly

`useControlsDrawer.ts:61` — `const GLIDE_MS = 520;` with the comment "520ms: the glass settle wants
a touch more breath than the dead spring's 480 (auditioned 480/520/560 by eye at :3001)".
Curve: `MOTION.curves.drawerGlide = "cubic-bezier(0.32, 0.72, 0, 1)"` (`pencilConfig.ts:185`), and
its ledger row carries a **scope fence**: "this ruling is the drawer's — no other surface re-eases
under it" (`:183-184`).

### The mechanism disambiguation (the charter offers two; only one works)

**`useFlipGlide` movers CANNOT express a stagger.** By construction:

```
useFlipGlide.ts:153-157
// One clock, literally (§3-S3): every mover pinned to the same startTime — zero
// stagger, and the FIRST painted frame already carries motion…
const clock = document.timeline.currentTime;
if (typeof clock === "number") for (const m of movers) m.anim.startTime = clock;
```
and `run()` "supersedes any in-flight glide silently" (`:81-84`, `:135-141`). Adding tray movers via
the drawer's controller would also void the drawer's own settle. **So the interior stagger must ride
`createSequenceSubscription`'s `delayMs`** — which is exactly the gallery deal-beat the charter also
names:

```
GameGallery.vue:151-169
const base = Math.round(MOTION.boardFoldMs * 0.42); // = 218 ms — after the fold has begun
const stagger = 90;                                  // outward-from-center step
… createSequenceSubscription({
     durationMs: DRAW_IN_PRESETS.gridFrame.duration,  // 350 ms
     delayMs: base + (dist - 1) * stagger,
     easing: easeOutCubic, onProgress: e => dealReveal[i] = e, onComplete: () => dealReveal[i] = 1 })
```
`GameCard.vue:213-219` maps `dealReveal` to `opacity` + `translateY((1-r)*9 px)` on its OWN wrapper,
documented as "a compositor-only channel … separate from the depth scale and the chime bloom, so the
three never fight, and it leaves no steady-state cost." **That is the template to copy verbatim.**
Budget arithmetic for the tray: 4 compartments × 40 ms step = 120 ms of stagger; with
`DRAW_IN_PRESETS.gridFrame.duration = 350` (`pencilConfig.ts:394-400`) and an onset at ~0.42 × 520
≈ 218 ms, the last compartment settles at 218 + 120 + 350 = **688 ms** — 168 ms PAST the glide.
To land inside 520 ms the onset must be ≤ 50 ms or the per-compartment duration ≤ 200 ms. **Flag
this to SYNTHESIZE: the charter's "≤120ms stagger INSIDE the 520ms window" is achievable only at a
shorter draw duration than the gallery's 350 ms.**

### The hard hazard: where a stagger may and may not be applied

`.control-panel-filtered` (`GameControlPanel.vue:719-728`) is a **3-pass `feTurbulence` +
`feDisplacementMap` chain** — `filter: v-bind(panelFilter)` = `url(#stroke-light|dark)`, whose
preset is `multiPass` with 3 passes at `baseFrequency .04 / numOctaves 4`
(`pencilConfig.ts:312-339`). Its own doc records the cost:

> "Unlayered, this 3-pass stroke filter re-rasterizes whenever the panel repaints OR MOVES — and
> H8's centered `.app-layout` moves it on every board-height change … which carried ~+125 ms of
> size-switch raster past the p3 class. Layerized, a move is a compositor offset … (**measured −57%
> switch raster** vs unlayered)."

It wraps ONLY the staged sections (opens `:538`, closes `:558`); `.deal-row` (`:563`) is a sibling.
Combined with `BoilDivider.vue:42-47` (WebKit paints SVG/filtered content unlayered):

**RULE for F2's choreography — stagger at COMPARTMENT granularity on `opacity`/`transform` of the
compartment wrapper; NEVER animate a descendant of a filtered element.** A transform on
`.control-panel-filtered` itself is safe (it is already `will-change: transform` promoted); a
transform on a chip *inside* it invalidates the 3-pass SourceGraphic every frame and reproduces the
Safari class of failure the T4-P1 campaign is chasing.

### What the drawer contents already do on open (so the tray doesn't double-fire)

Nothing on *glide* — the charter's "frozen freight" is accurate. But `scene.css:141-152` already
animates the rail on scene MOUNT: `animation: controls-fade-in 250ms var(--ease-drawOn) 150ms
backwards`, plus a 200 ms `.scene-leaving` / `html.gallery-leaving` fade-out. A tray settle must be
keyed to `drawerPhase === "opening"`, not to mount, or the two beats collide on first paint.

Also: at closed-idle the rail is `visibility: hidden` + `inert`
(`scene.css:83-89`, `useControlsDrawer.ts:324`), and visibility is restored by
`html.drawer-gesturing .scene-controls { visibility: visible }` (`scene.css:102-105`) which is armed
*before* the layout flip (`useControlsDrawer.ts:199-200`). So contents are paintable from frame 1 of
the open glide — the stagger has a valid window.

**PRM:** `toggleDrawer`'s reduced-motion branch is `applyLayout(next)` + `focusPanel()` with no
glide (`useControlsDrawer.ts:305-309`). The tray settle must land at its settled value with no tween
— `GameCard.playChime()` (`:127-133`) is the in-repo pattern (`bloom = 0; draw = 1`).

### The focus hazard the tray creates

`focusPanel()` (`useControlsDrawer.ts:284-290`) focuses **the first focusable descendant of
`.controls-card`** on every open-settle:
```
scene?.panel?.querySelector<HTMLElement>('button, select, input, textarea, a[href], [tabindex]:not([tabindex="-1"])')
```
Today that is the first Size `.ctrl-btn`. **If the tray puts the BIG DIE first in DOM order — which
"Deal as a BIG die resting in its own compartment, size/difficulty pencilled beside it" invites —
then opening the drawer parks the focus ring on a board-wipe verb, and Enter deals.** The
dirty-gated two-tap confirm (`GameControlPanel.vue:259-274`) is `isCoarse`-only, so a keyboard user
gets NO confirm. Mitigation: keep the selectors first in DOM and place the die visually first via
grid `order` — a documented pattern (`.icon-sublabel`/`.play-controls` already do CSS-only regime
work).

---

## Q5 — CONSTRAINT DISCIPLINE (mark 4): THE POSE-BAKE BUDGET

### The bake population today: exactly 3 components / 4 raster stacks

`grep -rn useRasterStack src/` → three consumers:
`HandwrittenLogo.vue:166` (1 stack), `DarkModeToggle.vue:538,544` (**2** stacks — `sunRaster`,
`moonRaster`), `HandDrawnGrid.vue:172` (1 stack). Shared helpers in
`src/pencil/composables/rasterPose.ts` (112 LOC): `readFilterDefs`, `resolveCssValue`,
`bitmapsToUrls`, `revokeUrls`, `encodeBitmap`.

The encode path is documented with real numbers (`rasterPose.ts:47-62`): "the encode runs through
`OffscreenCanvas.convertToBlob` — async, off the main thread's synchronous PNG-encode burst
(**12 poses × up to 251 ms @4× at DPR3** is what it cost)", and the URL is an object-URL handle
"not a retained **~1.3 MB** base64 string." Bitmaps are `close()`d after encode.

### THE ANSWER TO THE CHARTER'S BUDGET QUESTION: the tray can cost ZERO new pose bakes

There are **four** realization tiers in the estate, and only the top one costs a bake:

| tier | mechanism | steady-state raster | in-repo precedent |
|---|---|---|---|
| 0 | plain stroke SVG, no filter | one paint | `CrayonHeart` tiny <20 px (`:93`); `UndoIcon` etc. |
| 1 | static `filter="url(#grain-static)"`, params never written | one raster per paint | **`.icon-btn { filter: url(#grain-static) }`** (`GameControlPanel.vue:816`); `ScribbleLoader:62`; `CelebrationStar:130`; `PosterBoard:108` |
| 2 | boil via **geometric grain bake** — filterless static siblings, opacity swap | **zero** | `HandDrawnOutline` (`:23-25`, gate SSIM 0.996/0.993/0.993) |
| 3 | `useRasterStack` bitmap bake | zero after bake, but pays the bake | logo, sun, moon, grid |

**A tray built at tiers 0–2 adds ZERO `useRasterStack` bakes.** Concretely:
- compartment wells → tier 2 (`HandDrawnOutline`, `:pose="0"` frozen → not even a beat)
- BIG die (56–72 px) → tier 1 with `grain-static`, or tier 0; per the `CrayonHeart` ladder a >32 px
  object *may* wear `wobble-heart`, but that preset is already frozen at one pose
  (`CrayonHeart.vue:89-91`: "the per-beat write is retired … rastered once per appearance")
- three pencils (~24 px) → tier 1 `grain-static`, per the 20–32 px rung
- red pen, 4 poses (away / on desk / in hand / standing) → **4 static sibling `<g>`s with
  `v-if`/opacity on STATE, not on a beat.** A state swap is not a boil: it fires on user intent, so
  it re-rasters once per act, exactly like `CrayonHeart`'s `blush` variant crossfade (`:20-21`,
  "two stacked faces, opacity crossfade … a state swap, PRM-safe").

**Stated budget: 0 new raster bakes; 0 new perpetual beat enrolments; N compartment
`HandDrawnOutline` instances each holding `BOIL_CONFIG.frameCount = 4` static filterless sibling
poses (`pencilConfig.ts:209`) that never re-raster.** The only new *live* filter references are
reuses of the already-resident `#grain-static` def at tier 1 — the same class the entire icon row
already is.

### The library-level question the shared constraints demand

The geometric grain bake is **app-local and private**. `gridPaths.ts` exports only
`generateCellRects`, `generateRectBoilFrames`, `generateFrameTraceFrames`, `generateLineBoilFrames`,
`generateGridBoilFrames` (527 LOC); `bakeGrainPoints`, `grainNoise`, `grainLattice`,
`grainFrameSeed` are file-private (`:90-168`). So **rects and lines can be grain-baked today;
an arbitrary drawn object (a pencil silhouette, a pen) cannot** without either exporting
`bakeGrainPoints` (a one-word change) or pushing it into `pencil-boil`. `pencil-boil@0.9.2` already
exports the polyline kit it would compose with — `perturbPoints`, `perturbPointsClosed`,
`wobbleRect`, `wobbleLine`, `ellipsePoints`, `catmullRomToBezier`, `pointsToLinear`,
`wobbleDiamond`, `wobbleStarPolygon` (`node_modules/@mkbabb/pencil-boil/src/index.ts`).
**Recommendation to SYNTHESIZE: if any tray object needs to boil, `bakeGrainPoints` belongs in
`pencil-boil` beside `perturbPoints` — one library-level move that retires the last reason a new
drawn object would ever wear a live per-beat filter.** If nothing boils (the parsimonious read),
no change is needed at all.

---

## Q6 — MOBILE: THE SAME GRAMMAR IN A 2-COLUMN FLOW

### The box, measured

- Card width: `.mobile-board-width { width: min(42rem, calc(100vw - 1.5rem)) }` (`scene.css:120-122`)
  → **366 px at a 390 px viewport**; inner padding `px-2 py-1.5` (`GameScene.vue:82`) → **~350 px
  content**, so **~167 px per column** in a 2-column flow (after a ~16 px gap).
- Banked heights (`docs/tranches/2026-07-tranche-4/evidence/wu/u2-partition.md`): **390×844 mobile
  ≈ 472 px client / ~476 px scrollHeight, uncapped** (the page scrolls, not the card).
- Tap floor: `.icon-btn` is `min-width/min-height: 2.75rem` = **44 px** under `@media (pointer:
  coarse)` (`GameControlPanel.vue:879-887`), and `.peek-hold-surface` gets `padding-block: 1rem`
  to clear the same floor (`:875-877`).

### The measurement that constrains the whole mobile idea

`.ctrl-btn` is **monospace** — `font-family: "Fira Code", monospace` (`OptionSelector.vue:66-68`) —
at `text-[1rem]` on mobile with `px-3` (`:33,35`). So the Marks row's width is deterministic:
3 buttons × (6 chars × 0.6 em × 16 px + 24 px padding) + 2 × 4 px gap = 3 × 81.6 + 8 =
**≈ 253 px**.

**253 px does not fit in a 167 px column.** Therefore: **a 2-column mobile tray cannot host today's
3-option `OptionSelector` rows.** Either the 3-option compartments (Size, Difficulty, Marks, Check)
stay full-width and only the 2-option/object compartments pair up, or the 3-option controls become
*objects* (three pencils, a pen, three dice faces) whose targets are 44 px squares — which is
precisely what F2 proposes. **This is the strongest independent argument FOR the family: on mobile
the object grammar is not decoration, it is the only thing that fits two per row.**

### Killing the tab-toggle: the LOC prize and the height penalty

`showTabs = computed(() => props.sections.length >= 2)` (`GameControlPanel.vue:127`). **All five
shipped games declare exactly n = 2 sections** — sudoku `size`+`difficulty`
(`sudoku/ControlPanel/ControlPanel.vue:59-73`), futoshiki `boardSize`+`difficulty`
(`futoshiki/ControlPanel/ControlPanel.vue:60-74`), and thermo/killer/kenken via
`<game>.options(...)` (`thermo/game.ts:37,45`; `killer/game.ts:38,46`; `kenken/game.ts:40,48`).
So `showTabs` is **always true** and the `v-if="!showTabs"` plain-heading branch (`:365-374`) is
**dead code across the entire shipped surface**.

Deletable if `mobile-heading-row` dies — **83 LOC** in one file:

| block | lines | LOC |
|---|---|---:|
| `showTabs` computed + doc | 125–127 | 3 |
| `valueLabel()` + UI-12 doc | 140–144 | 5 |
| `expandedPanel` ref | 150 | 1 |
| `mobile-heading-row` template | 338–363 | 26 |
| n=1 plain-heading branch | 365–374 | 10 |
| CSS `.mobile-heading-row` / `-btn` / `.heading-value` / `.is-active` | 936–973 | 38 |

**But note the penalty (see CONTRADICTIONS C4): the tab-toggle is a HEIGHT-SAVING device.**
`v-show="!showTabs || expandedPanel === section.key"` (`:376`) means only ONE of the two selectors
renders at a time on mobile. Killing it renders both → mobile height goes UP. The 2-column flow must
recover more than it costs.

---

## Q7 — PRIOR ART (background only)

Thin and generic; nothing displaces a codebase verdict.

- **Procreate's brush tray**: the transferable idea is *grouping by use-case into named sets*
  (Inking / Painting / Textures) rather than a flat list; the documented *failure* is directly
  relevant to F2's inverse — "two identical slider bars for brush size and opacity" where "it's
  unclear what these bars control," i.e. **identical affordances for different ranks is the same
  defect the drawer has.** Procreate's tray is also the canonical case of *the tool you picked up
  being visibly held*.
- **Skeuomorphic object-as-control**: the pattern is documented as showing "a graphic of a light
  switch in the on or off position … the user clicks it to toggle" — state carried by the object's
  *pose*, not by a separate indicator. That is exactly the pen's 4-pose proposal, and the literature
  is explicit that the payoff is *state legibility*, which is precisely what `checkArmed`'s
  invisibility costs today.
- **Tray/compartment metaphor**: described as "a drawer where tools are neatly organized into
  compartments, each labeled with its purpose", with grouping-with-related-elements as the UX win.
- Nothing found on "take the tool out" as a documented named pattern — it appears to be
  under-documented, so the design must be argued from the estate, not cited.

Sources: [IXD@Pratt — Design Critique: Procreate](https://ixd.prattsi.org/2024/09/design-critique-procreate-app/) ·
[Procreate Handbook — Interface](https://help.procreate.com/procreate/handbook/interface-gestures/interface) ·
[LogRocket — Skeuomorphism in UX](https://blog.logrocket.com/ux-design/skeuomorphism-ux-design-examples/) ·
[Justinmind — Skeuomorphic design](https://www.justinmind.com/ui-design/skeuomorphic) ·
[Justinmind — Toggle button patterns](https://www.justinmind.com/ui-design/toggle-button-patterns-examples)

---

# MEASUREMENTS

**Vertical budget — the binding constraint on "a BIG die"**
(`docs/tranches/2026-07-tranche-4/evidence/wu/u2-partition.md` §"Controls-card height — BANKED";
corroborated at `evidence/wu/gates.md` and `evidence/w11/r2-record.md`)

| viewport | `.controls-card` clientHeight (= the cap) | content scrollHeight | over budget |
|---|---:|---:|---:|
| 1280×800 sudoku | **608 px** | **1026 px** | **+418 px (69%)** |
| 1280×800 futoshiki | 608 px | 1064 px | +456 px |
| 1440×900 sudoku | 640 px | 1028 px | +388 px |
| 1440×900 futoshiki | 640 px | 1066 px | +426 px |
| 390×844 mobile (both) | ~472 px (uncapped) | ~476 px | page scrolls |

Cap formula: `.controls-card { max-height: calc(min(42rem, 85vw, 100dvh - 10rem) - 2rem) }`
(`scene.css:41-46`), `overflow-y: auto`, `overscroll-behavior: contain`. Its seal note records what
happens if the content grows unchecked (`scene.css:29-40`): the card hit **936 px against an 800 px
viewport**, "pushed the masthead negative, the wordmark clean off-screen, and the case rose above
the sheet, redding six e2e specs, the drawer's never-above-the-sheet contract, and the logo golden
in one stroke" (root cause also recorded at `evidence/w8/m3-parity.md:133` and
`evidence/w8/gates.md:51,57`). **The drawer is already 69% over its own scroll budget. F2's net
height must be ≤ 0; the die is paid for by deletion.**

**Composition inventory (desktop drawer, one game)**
- 5 heading+`OptionSelector` stanzas; **6** rendered `.section-heading` nodes; charter says "~7"
- 14 `.ctrl-btn`, 5 `.icon-btn` (fine) / 8 (coarse), 1 `.peek-hold-surface`, 5 `KeyboardLegend` rows
- 1 `BoilDivider` + 1 washi as the only zone mark
- 2 `HandDrawnOutline` cards per scene (mobile + rail), 6 mounts app-wide

**Type + size scale** (`assets/typography.css:31-47,251-267`)
`--type-caption` clamp(0.75rem…1rem) 12→16 px · `--type-small` 14→20 px · `--type-body` 16→22 px ·
`--type-subheading` **1.272rem = 20.4 px** (√φ) · `--type-heading` **1.618rem = 25.9 px** (φ).
`.section-heading` = subheading, → heading at ≥md.
DiceIcon 28 px vs the heading it commits, 25.9 px → **1.08:1**. Icon-btn floor **44 px**.

**Motion constants** (`pencilConfig.ts`, `useControlsDrawer.ts`)
`GLIDE_MS = 520` (`useControlsDrawer.ts:61`) · `MOTION.curves.drawerGlide =
cubic-bezier(0.32, 0.72, 0, 1)` (`:185`, scope-fenced to the drawer at `:183-184`) ·
`beatMs 125` · `bands.boil 1` · `cardStepMs 440` · `boardFoldMs 520` · `chromeLeaveMs 200` ·
`BOIL_CONFIG { frameCount 4, intervalMs 150, outlineBoilPx 0.45 }` (`:208-219`) ·
`DRAW_IN_PRESETS.gridFrame { duration 350, stagger 30, jitter 20 }` (`:394-400`) ·
`GLYPH_ANIM.hoverWiggleDuration 600` (`:426-429`).
Gallery deal-beat: onset `round(520 × 0.42) = 218 ms`, step 90 ms, duration 350 ms
(`GameGallery.vue:151-158`).

**Pose-bake population**
`useRasterStack` consumers: 3 components / **4 stacks** (logo 1, toggle 2, grid 1).
`filter="url(#grain-static)"` static references: 6 sites (`GameControlPanel.vue:816`,
`SolverErrorNote.vue:96`, `ScribbleLoader.vue:62`, `CelebrationStar.vue:130`, `PosterBoard.vue:108`,
`BoilDivider.vue:79`) + `HandwrittenGlyph.vue:348` conditional.
`multiPass` (3-pass) filters: `stroke-light` / `stroke-dark`, consumed by
`.control-panel-filtered` only. Soul-gate numbers on the record: `HandDrawnOutline` geometric bake
**SSIM 0.996 / 0.993 / 0.993** @DPR2 settled; `BoilDivider` geometric bake **0.809 (FAILED**, gate
0.983 — `BoilDivider.vue:22-28`, `pencilConfig.ts:250-251`); grain hoist **0.983–0.985**
(`pencilConfig.ts:236-237`). Divider memory price: "4 poses × ~531×31 device px × 4B ≈ **0.26 MB**"
(`BoilDivider.vue:29`).

**Safari numbers already on the record**
Divider live-filtered pose flip: **~10 fps steady-state desktop Safari → 98 fps pinned**
(`BoilDivider.vue:44-47`). Panel filter layerization: **−57 % switch raster**, and unlayered cost
**~+125 ms** per size switch (`GameControlPanel.vue:721-727`).

**Test coupling (the tray's blast radius)**
- **Goldens: 8 PNGs / 4 surfaces × 2 platforms** — `cell-light`, `grid-corner-light`, `logo-light`,
  `toggle-crest-dark` (`e2e/goldens/`). **NONE covers the drawer panel.** F2 is a golden-free
  substrate.
- Panel DOM/class references across all of `e2e/`: `.icon-btn` ×4, `.ctrl-btn` ×1,
  `.peek-hold-surface` ×1, `"Deal a new board"` ×**10**. Zero references to `.deal-btn`,
  `.deal-row`, `.section-heading`, `.mobile-heading*`, `.new-game-zone`, `.heading-value`,
  `.play-controls`, `.assist-settings`, `.pencil-mode-toggle`.
- **Positional coupling:** `share-truth.spec.ts:57` → `page.locator('.controls-card
  button.icon-btn').nth(4)` with the comment at `:52-53` "the .icon-btn DOM order is now Deal ·
  Clear · Fill · Solve · Share".
- **Mover-count assertion:** `drawer.spec.ts:150` → `expect(Math.max(...midSamples.map(s =>
  s.easings.length))).toBe(4)` and `:151` every mid-glide easing must be
  `cubic-bezier(0.32, 0.72, 0, 1)`. Its collector filters to
  `target.matches('.board-peek-host, #controls-drawer, .drawer-tab') || target.matches('.masthead')`
  (`:96-103`) — **self-match only, so DESCENDANT animations inside `.controls-card` are invisible to
  it.** Safe if and only if the tray never animates the rail element itself.

**Net-LOC ledger (F2's parsimony case)**
Deletable: tab-toggle machinery **83 LOC** (`GameControlPanel.vue`, table in Q6).
Absorbable: `AssistSettings.vue` **91 LOC** + `PencilModeToggle.vue` **47 LOC** = 138 LOC of pure
heading+`OptionSelector` wrapper — both are "one grammar, not a second look" shells with zero domain
state (`AssistSettings.vue:5-8`, `PencilModeToggle.vue:6-8`); if compartments own their own labels,
these collapse into the tray.
Current sizes for reference: `GameControlPanel.vue` **1025**, `GameScene.vue` 129,
`useControlsDrawer.ts` 353, `useFlipGlide.ts` 184, `OptionSelector.vue` 114,
`HandDrawnOutline.vue` 168, `SheetWashiLabel.vue` 133, `BoilDivider.vue` 118,
`GameGallery.vue` 613, `GameCard.vue` 433, `CrayonHeart.vue` 342, icon set 538.
**Ceiling on the deletion case: 83 + 138 = 221 LOC out, against N new object components.** At the
icon set's own density (34–148 LOC each, mean 67), a red pen + a pencil + a big-die re-scale is
~150–250 LOC in. **F2 is roughly LOC-neutral, not a clear net-LOC winner** — it wins on rank
legibility, not on subtraction. State this honestly to CRITIQUE.

---

# CONTRADICTIONS

**C1 — The charter calls mark 4 "solved engineering." It is DIAGNOSED, NOT CURED at HEAD.**
Charter item 8: "every drawn/filtered surface rides the pose-bake pipeline — intrinsic = capture px,
opsz pinned, subset over all five labels … This constrains all families; it needs no lane."
The code says otherwise:
- `node_modules/@mkbabb/pencil-boil/src/raster.ts` `serializePoseSvg` still writes
  `width="${parts.width}"` where `width` is documented as "**CSS px** width of the render box — the
  SVG's intrinsic width; capture scales by dpr" (`:26`). The prescribed cure is
  *intrinsic = cssSize × dpr* (`design-refinement-marks-2026-07-31.md:20`) and it is **booked into
  T4-P1 W2/W3**, not landed (`:29`). Installed version is still **0.9.2**.
- `grep -rn opsz src/` returns exactly one hit — a comment at `assets/index.css:13`. **No
  `font-variation-settings: 'opsz' N` pin exists anywhere.**
- Git log for `src/pencil src/games` shows nothing after `fb15253d` ("Safari curve: pin the
  divider's live grain poses on Apple WebKit") touching the bake.
**Consequence for F2:** any object that goes through `useRasterStack` today inherits the measured
WebKit bilinear-upscale softness (**2.08–3.12× toggle, 3.73–5.60× logo beyond intrinsic**, softRatio
flat across dpr2→dpr3). **This does not block F2 — it is a positive argument for the tier 0–2 plan
in Q5 (never bake).** But the charter's premise that the constraint is discharged is false, and
F2's budget claim must be "zero bakes," not "bakes are safe."

**C2 — "~7 near-identical stanzas" is 5 (6 heading nodes).**
Problem brief item 2. Actual: Size, Difficulty, Marks, Check, Candidates = 5 heading +
`OptionSelector` stanzas; 6 rendered `.section-heading` nodes including the "New game" eyebrow
(`GameControlPanel.vue:539,544` · `PencilModeToggle.vue:36` · `AssistSettings.vue:61,77`). The
*diagnosis* stands; the count is off by 1–2 and any "N compartments replace 7 stanzas" arithmetic
must be restated.

**C3 — "the drawer choreography exists only ≥1024 … contents are frozen freight" is true of the
glide but not of the drawer's contents in general.**
`scene.css:141-152` already animates `.scene-controls` on scene mount
(`controls-fade-in 250ms var(--ease-drawOn) 150ms backwards`) and fades it out at 200 ms on
`.scene-leaving` / `html.gallery-leaving`. So the tray's settle is the *second* beat on that
element, not the first, and must key off `drawerPhase === "opening"` or it double-fires on mount.

**C4 — "the tab-toggle dies; compartments are self-labelling" INCREASES mobile height.**
`v-show="!showTabs || expandedPanel === section.key"` (`GameControlPanel.vue:376`) means exactly ONE
of the two staged selectors is in the mobile flow at a time. The toggle is a height device, not
just hierarchy theatre. Killing it renders both → mobile grows. The 2-column flow must recover more
than the toggle saved, and per Q6 a 3-option `OptionSelector` (~253 px) **does not fit a 167 px
column at 390 px** — so the compartments genuinely must become objects, or the charter's mobile
promise does not close.

**C5 — "Deal as a BIG die" collides with two hard couplings.**
(a) `share-truth.spec.ts:57` locates Share as `.controls-card button.icon-btn` **nth(4)**, relying
on the DOM order "Deal · Clear · Fill · Solve · Share" (`:52-53`). If the big die stops being an
`.icon-btn`, that index shifts and share-truth reds — a spec edit, not a design blocker, but it must
be on the plan. (b) The card is already **+418 px over its 608 px cap** at 1280×800; a bigger die is
only payable by deletion.

**C6 — "does Off/Ask/Live read natural as pen away / on the desk / in hand?" — the mode has FOUR
states, not three.**
`useAssists.ts:40,45,63` — `checkArmed` is a transient armed flag set by entering *or re-tapping*
`on-demand` and cleared by any board mutation. It is **not plumbed to the UI at all**
(`AssistSettings.vue:22-28` receives only `errorCheckMode` + `candidatesPinned`), which is why
re-tapping Ask looks like a no-op. A 3-pose pen under-models the state machine and would preserve
the defect. **The 4-pose pen is the actual answer, and it converts the "load-bearing same-value
re-emit" from a workaround into the object's own motion.** Cost: `proactiveCheck` is already in
scope at all five scenes (`SudokuGame.vue:131` et al.) — 5 one-line bindings + 2 props.

**C7 — the choreography "riding `useFlipGlide` movers" is mechanically impossible.**
`useFlipGlide.ts:153-157` pins every mover to one `document.timeline.currentTime` with **zero
stagger by construction**, and `run()` supersedes any in-flight glide without firing its settle
(`:81-84,135-141`). The stagger must ride `createSequenceSubscription({ delayMs })` — the
`GameGallery.vue:151-169` deal-beat, which the charter also names. Disambiguation, not a blocker.
Second-order: at the gallery's own numbers (218 ms onset + 120 ms stagger + 350 ms duration =
**688 ms**) the settle lands **168 ms past** the 520 ms window; the tray needs a shorter draw
(≤200 ms) or a near-zero onset to honour "INSIDE the existing 520ms glide window."

**C8 — "no new live-filter surfaces" is not literally the shipped rule, and the literal reading
would over-constrain F2.**
`.icon-btn { filter: url(#grain-static) }` (`GameControlPanel.vue:816`) puts a live
`feTurbulence`+`feDisplacementMap` chain on **every icon in the panel at rest**, and five more
sites do the same. It is permitted because the params are never written per beat. The shipped rule
is: **no per-beat filter parameter writes, and no animated transform on a descendant of a filtered
element** (the T3-W13 §1-P3/P4 disposition, `pencilConfig.ts:360-368`; the WebKit unlayered fact,
`BoilDivider.vue:42-47`). Restating it correctly is what lets F2's objects be tier-1
`grain-static` at zero bake cost — and it is also what forbids staggering anything *inside*
`.control-panel-filtered`'s 3-pass chain.

---

# OPEN QUESTIONS (for SYNTHESIZE / PROTOTYPE)

1. **Where does the height come from?** F2 must be ≤ 0 net on a card already +418 px over budget.
   Candidate donors, all inside F2's refusals: the 6th `.section-heading` (the "New game" eyebrow
   is redundant once a labelled well exists); the `Candidates` stanza (2 options, the lowest-rank
   control in the card, default OFF); `KeyboardLegend` (5 rows, fine-pointer only). Needs an actual
   px accounting on a built dist, not an estimate.
2. **Three meanings on one rose.** `--color-red-ink`/`--color-crayon-rose` currently means Hard
   difficulty (`sudoku/ControlPanel/constants.ts`), the armed-confirm voice
   (`GameControlPanel.vue:864-867`), and — under F2 — the teacher's pen. Does the pen need a
   distinct tone, or does the pen's *object-ness* disambiguate it from text-colour uses?
3. **Does `errorCheckMode` stay a manual prop+emit under an object?** The re-emit exists to let a
   same-value click re-arm. If the pen is a single button that cycles (`cycleErrorCheckMode` already
   exists, `useAssists.ts:47-50`) plus a distinct "pick up again" act when armed decays, the
   segmented control's every-click emit may no longer be needed — which would *simplify* a seam the
   shared constraints currently protect. Verify against `AssistSettings.vue:18-21` before touching.
4. **`focusPanel()` target.** Should the tray declare an explicit focus home (e.g. `tabindex="-1"`
   on the New-game well heading) rather than depending on DOM order? That is a one-line change to
   `useControlsDrawer.ts:284-290` and it removes the Deal-under-the-focus-ring hazard permanently —
   but it touches the four-times-owner-audited drawer module, which the charter fences.
5. **Does `bakeGrainPoints` go to `pencil-boil`?** Only needed if a tray object boils. The
   parsimonious answer is that nothing in a tray should boil (objects at rest are static; the case's
   life is the glide + the settle stagger). Confirm with CRITIQUE that a fully static tray does not
   read dead against a boiling grid.
6. **Compartment count.** The charter names three wells (New game / pencils / teacher's). That
   leaves Candidates, the action row (Clear·Fill·Solve·Share), the play tools, and the peek divider
   unassigned. Is the action row a fourth well ("the desk"), or does it stay a bare row below the
   tray? Unresolved by the charter.
7. **Two panel instances, one tray.** Each game mounts `GameControlPanel` **twice**
   (`GameScene.vue:83,103` — mobile card + rail card), which is why `newGameId` uses `useId()`
   (`:238-241`). Every new tray id/seed must be instance-scoped the same way, and any
   `createSequenceSubscription` must be started by only the *visible* instance or two staggers run
   per open.
8. **Real-Safari verification.** All Safari numbers cited here are banked from 2026-07-15 against
   the deployed edge. The T4-P1 rig (`perf-rig-iphone16`, BOOTED) is the only place F2's tray can be
   verified; no claim about the tray's iOS cost should ship unmeasured on it.
