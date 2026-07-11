# T3-W12 — Owner-audit addendum: the drawer, the re-cuts, the settled page

**The owner audited the live mid-wave tree (2026-07-11, :3001) and returned six verdicts — and this wave answers all six: the completion moment finally gets room (the grade moves into the teacher's margin, and the settled page learns to idle), the controls-card outline gets its BEFORE presence back without giving up W10's registration win, the dark toggle is re-cut to the before-shaped whirl with Yoshi's-Story energy folded in, the sun's spiral reverts to its bright coil, the board's corner barb is rounded off, and the controls become a drawer that tucks under the board — the page's one new piece of furniture.** The owner's verdicts overrule wave content where they conflict; W10's uncommitted tree is dispositioned deliverable-by-deliverable in the register (README §3a) before this wave opens. Authored from the addendum loop — 4 forensic/design lanes + 2 adversarial critiques against the owner's 5 screenshots, both kill-lists folded — at **90%, every sub-100 row an in-wave gate**.

**Dependencies**: ← the W10 disposition register (README §3a — the orchestrator executes KEEP/REVERT/RE-CUT against W10's tree first; this wave's re-cuts assume the register applied) · ← W11 (sequential, NOT parallel — the drawer re-homes the very card W11's UI-4/5/9 rows label, and UI-6's inert/visibility discipline is this wave's a11y floor). **Effort**: L (the drawer is the centerpiece).

---

## Provenance — the addendum loop

Owner audit 2026-07-11 at `:3001` against the mid-wave tree (W9 committed `08f3ddd9`, W10 running uncommitted); shots banked at [`evidence/owner-audit-2/`](../evidence/owner-audit-2/). Loop: 4 research lanes produced (a1 completion+perf, a2 boil/outline, a3 toggle+spiral, a4 artifact) + 2 adversarial critiques (crit-design 61%, crit-forensics 94%); two mandated lanes (a5 drawer, a6 attribution) were **not produced** — a6's attribution table was independently reconstructed by crit-forensics from the W9→tree diffs and is adopted as the interim baseline; a5's drawer spec is authored **in this wave file** against crit-design's recorded hazards. Reports at [`evidence/addendum/`](../evidence/addendum/). Both kill-lists are folded below (S1 revert killed, the R1 1024–1279 rung re-docked, the stale `App.vue:118` cite fixed to `:129`, `path.ts:88`→`:89`, no vector-effect stroke claims, no board-size tweens).

| row | grounding | pct |
|---|---|---|
| completion re-formulation (R1, rung-corrected) | live-probed geometry + owner shot reproduced; the corrected corner-press rung is unprobed | 92 |
| solved-page perf rows | 6 traces + elimination ladder; targets re-run at the gate | 92 |
| boil/outline fix | fix-spec injected live, near-pixel match to the W9 reconstruction | 98 |
| toggle re-cut | both states code-traced verbatim (crit-confirmed); beats gate in-wave — no live mid-flight capture existed | 90 |
| spiral revert | contrast re-derived independently to three decimals, twice | 100 |
| corner artifact | byte-identical repro at W9; fix one attribute | 98 |
| **the drawer** | authored here, zero lane prototype — hazards folded by construction; the full live pass IS the gate | 65 |
| attribution register | crit-forensics' diff-reconstructed table, adopted interim (a6 uncertified) | 88 |

**Convergence 90** (723/8, floored). Every sub-100 row executes in-wave: the rung, the perf targets, the beat table, and above all the drawer are gate-verified live at this wave's close.

---

## Scope

Anchors cite the tree as read 2026-07-11 (HEAD `08f3ddd9`, W10 uncommitted); `tree:N` = the uncommitted `DarkModeToggle.vue` (586 lines). Line drift is expected once the register executes — the anchors name the code, not the integer.

### 1 — The completion re-formulation: the grade in the margin (owner finding 1a)

> "the star and heart area is still preposterous — too small, occludes the bottom of the page, messes up the flow of the page."

The forensics (a1, crit-confirmed): the ≥lg completion block is an absolute overlay at `top:100%` under a height-capped board (`SudokuBoard.vue:573–581`, cap `lg:max-w-[calc(100dvh-10rem)]` `:138`) that leaves **23px** of viewport below the board — the 52px block lands 37.6px past the fold, the verdict line clips mid-glyph, and solving turns the fitted `h-screen` page (`App.vue:129`) into a scrollable one (scrollHeight 843 > 806). The star is 8% of the board edge, the heart 6.8% — the gold moment's entire visual mass is a caption cluster at three disconnected corners. W9's probes graded the pieces; nobody graded the moment against the masthead it answers to.

**R1 — the critique-surviving formulation.** The completion block becomes a **margin vignette in the left column** — the true teacher's margin, ~255px wide at 1440 and empty today — anchored at the board's optical upper third, tilted −4°:

- the foil star at **6.5–7rem** (real grading-sticker scale — the draw-on + gleam finally read),
- "solved it!" beneath it in the hand at ~2rem,
- the tally folded into ONE line under the voice ("0 backtracks — 1ms", caption rung) — two text rungs total,
- the heart stays the board's corner sticker, rises to **3.5rem**, shifts to `bottom:-0.4rem` — crowning the corner, not grazing the fold.

Nothing renders below the board on the gold path → no fold overflow, no scroll, no occlusion. The strip survives solely for graphite/teacher-red/error states (transient, one line — those fit the 23px gap). Motion unchanged by construction: draw-on/gleam/bounce/blink/murmur all live on wrapper transforms and dashoffset — only the anchor moves; zero new subscribers. A11y unchanged: MarginNote's live region keeps its DOM home; the vignette is `aria-hidden` decoration.

**Rungs (crit-corrected):** ≥1280 the full left-margin vignette; 1024–1279 it docks as a corner-press sticker over the board's **top-RIGHT** frame (crit-design kill #2 — the top-left dock collided with finding 5's corner AND live top-left digits); <1024 (stacked) in flow, centered between board and controls, star at 4.5rem. **Drawer interplay:** the vignette anchors to the board *wrapper* so it travels with the board's drawer transform (§6); where drawer-open compresses the left margin below the vignette's width (<~1360), it takes the corner-press rung early.

**Derive the presence from state** (a1's side finding): `celebrating` is edge-triggered (`state === 'solved' && prev !== 'solved'`, `SudokuBoard.vue:189–198`) — any remount while solved drops star + heart while the gold note persists. Derive from state, not the transition, so the composition survives remounts.

### 2 — The settled page learns to idle (owner finding 1b)

> "And the performance is god awful on this page."

Attribution (a1's six traces + elimination ladder, crit-confirmed-by-method): the settled page paints **every frame** — 1355 commits/1372 paints per 11.4s, ~50/s of them full-viewport — solved and unsolved alike. **The celebration is NOT the cost.** The dominant painter is the glyph boils (hiding `.board-cells` halves paints, −85% GPU, −50% main-thread): ~45 independent path-`d` swaps/s land an invalidation in nearly every 8ms frame, each dirtying a feTurbulence-filtered path inside the un-promoted scrolling layer. Second: the `star-twinkle` CSS animations on SVG children recalc style every frame (120/s → 38/s when paused). Third: the toggle's moon (~25 paints/s). Dev inflates the JS share (dev runtime, HMR mid-wave, idle FilterTuner `App.vue:29–31`) — but the paint/raster/GPU regime ships as-is.

The rows (all spec'd by a1, kill-list-clean):

| row | mechanism | anchor |
|---|---|---|
| **P1 — quantize the boil beat** | all boil subscribers swap on one shared beat window (~8Hz) so invalidations coalesce into ~8 dirty frames/s and the pipeline gets idle frames — a scheduler-level alignment, not a retune | `pencilConfig.ts` MOTION cadence bands |
| **P2 — fence the damage** | `contain: paint` (or a promoted layer) on `.board-wrapper` so a glyph swap dirties a 646px layer, not the viewport — **verify against the heart/vignette/drawer-tab overhangs** (`overflow: visible` currently needed); same treatment for the toggle's celestial | `SudokuBoard.vue:534–538` (`contain: layout style` — paint is the missing one) |
| **P3 — step the twinkles** | `steps()` timing or a longer period on `star-twinkle`, or move the opacity to a compositable wrapper — kills the per-frame recalc | toggle celestial |
| **P4 — scope `transition-all`** | `transition-all duration-500` on the board wrapper exists for the gold/red shadow only — scope to `box-shadow 500ms`; `all` volunteers every future property change (including §6's transforms) into 500ms tweens | `SudokuBoard.vue:143`; `index.css:352–363` |
| **P5 — state-derived `celebrating`** | §1's side finding, filed as the perf-adjacent correctness row | `SudokuBoard.vue:189–198` |

R1 itself is a perf fix: it removes the page's one scroll — and scrolling is this page's worst act (full-page filter re-raster under a 100-paints/s regime).

### 3 — The outline's stroke presence, registration kept (owner finding 2)

> "the boiling is too hairline and the outline was changed herein."

Three regressions stacked, all W10-F1's px-native coordinate shift reinterpreting **absolute user units** as literal pixels (a2, crit-forensics 10/10 legs confirmed; the stroke-width never changed — "hairline" is filter erosion plus long-wavelength waver, NOT a vector-effect artifact, which is a no-op at 1:1): grain displacement 0.65→2.5px (3.8×), grain wavelength 6.6→25px, frame boil 0.31→1.2px, air 3.9→0px, corners square-overshot→clean quarter-arcs. Side wobble and stroke width survived exactly (length-proportional, pencil-boil `path.ts:89`).

**The fix spec (a2, live-validated to near-pixel match — `evidence/addendum/a2-shots/`):**

1. **Dedicated `grain-outline` preset** (new `DEFAULT_PRESETS` row, `pencilConfig.ts:144`): `{ baseFrequency: 0.13, numOctaves: 3, scale: 0.75, seed: 2 }`, margin 5; `HandDrawnOutline`'s path binds `url(#grain-outline)`. **Do NOT retune the shared `grain-static`** (crit-forensics HOLD — grid, glyphs, and 20–32px icons depend on it).
2. **`outset` default 0 → 4** — restores the ~4px air; same px coordinate system, registration unaffected.
3. **Corners back to square**: `radius` defaults 0, delete the auto border-radius read (`HandDrawnOutline.vue:31–38`) — the r=0 branch is bit-identical to W9's square overshot crossings. Keep the `radius` prop + arc machinery for future opt-in; any opt-in floors the arc jitter at `max(roughness·r·0.06, 0.75px)` AND pins arc endpoints to the side endpoints per frame (a4's adjacent flag: the fresh per-frame arc seed drifts off the pinned sides — a per-frame corner shimmer, moot at the default but a trap for the opt-in).
4. **Own boil constant**: `BOIL_CONFIG.outlineBoilPx: 0.45` replaces the grid's `frameBoil` 1.2 (viewBox units by its own comment — a unit bug once px-native).
5. **Unchanged**: px-native viewBox + resize-observer measurement (the W10 registration win the owner's F1 finding originally demanded), stroke 3/0.95, roughness 0.5/segments 6/seed 77/jagged, 4 frames @150ms.

This adjudicates W1 (toggle outline +1): the hairline verdict is the controls card's `HandDrawnOutline` — a2 reproduced it there and matched the fix there; the toggle isn't implicated. W1 KEEPS (register §3a).

### 4 — The toggle re-cut: before-shaped, Yoshi energy (owner findings 3+4)

> "the storybook animation of the darkmode toggle was completely ruined. It should act as yoshi's story and be closer to how it was BEFORE." · "the contrast of the sun's spiral is awful and should be as it was before."

W10's Set-and-Rise (5 serialized beats, 4 sequence clocks, ≈1.25s, deferred theme flip, porthole clip) is **cut wholesale** — the stage goes empty mid-gesture, the deferred flip reads as input lag, the whirl is gone, and ~130 lines of phase machinery replaced what CSS transitions did alone (a3, crit-confirmed against both states). Base = the BEFORE shape verbatim (`git show 08f3ddd9:…/DarkModeToggle.vue` — the 800ms simultaneous whirl-crossfade, flip-at-click, the spring `cubic-bezier(0.34,1.56,0.64,1)`); Yoshi's-Story energy added only where it adds life. **The double-exposure was the charm, not the bug.**

**The beat table (both directions symmetric; crest ~950ms):**

| t (ms) | beat | motion | source |
|---|---|---|---|
| 0 | **CLICK** | `toggleDark()` fires — theme, aria, paint all truthful at click; `html.theme-turning` on for ~400ms (body + sheets ease colors 350ms instead of snapping, `index.css:379–390` re-anchored to click) | BEFORE + W10's dusk ease |
| 0–120 | **SQUASH** | button anticipation squash (scale 1→0.94→1, spring) — OVERLAPS the whirl, never precedes it | W10 keep, overlapped |
| 0–800 | **WHIRL OUT** | outgoing: transform 800ms spring → `translateX(-50%) rotate(-270deg) scale(0.1)`; opacity 800ms delay 100ms | BEFORE verbatim (before:194–199) |
| 0–800 | **WHIRL IN** | incoming: the mirror — parked pose → identity on the same spring; opacity in 300ms; both bodies on stage together, the stage is never empty | BEFORE verbatim (before:201–206) |
| ~500/580/660 | **STAR POP** | stars/sparkles suppressed for the whirl's first ~500ms, then pop staggered +0/+80/+160ms (scale 0.2→1, 150ms `pop` back-out) — landing during the body's overshoot; pure CSS `transition-delay` off `.is-active`, no clock | W10's ignite, folded in |
| ~800–950 | **PLUSH LAND** | incoming settles with one squash-bounce tail (scaleX 1.05/scaleY 0.95 → 1, ~150ms) as the spring resolves — the moon lands like a plush toy; a whirl-in keyframe animation (rotation+scale+tail one track) | new, the one addition |

**Implementation contract**: `handleToggle()` returns to near-BEFORE size — flip + squash class + one ~800ms cleanup (`is-leaving` class, cleared on `animationend`); no `createSequenceSubscription`, no `pendingFlip`, no `visualDark`/`ariaDark` split, no `settleNow()` (re-click mid-flight just retargets — CSS transitions do this for free); no `overflow: hidden` in any state; cut the crescent-detail `createStrokeDrawIn` (illegible at scale 0.1→1 mid-whirl — the stroke is simply present); KEEP rest-state `visibility: hidden` on the parked icon + the unconditional `wobble-celestial` binding (the whirling outgoing body keeps its wobble; at rest the hidden icon's filter region costs nothing); KEEP W10's PRM variant exactly (immediate flip, 200ms opacity crossfade, no transforms, stars with the moon). **Band ledger**: `docs/animation.md`'s Band-D row reverts "theme set-and-rise ≈1.25 s" → "theme page-turn ~950 ms".

**The spiral (finding 4)**: S2 REVERTS verbatim — `pencilConfig.ts:47` `spiral: '#DF9A1E'` → `'#F0B030'` (keep the key; tree:45 consumes it). Measured (a3, crit re-derived independently): S2 *lowered* the metric its own rationale invoked — #F0B030 vs disc #F09855 = **1.175**, #DF9A1E = **1.063**; the carrier was the yellow-on-orange hue pop, which the deepening killed. **S1 (geometry) KEEPS** — crit-design kill #1: the owner's word was "contrast," which licenses the color revert and nothing more; the recut coil + sw 9 stand unless the owner names geometry. No celebration-side effect (`rays`/`sparkle` untouched).

### 5 — The corner barb (owner finding 5)

> "a strange artifact in the top left corner of the board."

**Pre-existing, committed — W10 is innocent** (a4, byte-identical repro at `08f3ddd9`; `HandDrawnGrid.vue` has an empty diff). The board frame is the grid frame-line, the only *closed* path in the grid: `stroke-linecap="round"` but **no `stroke-linejoin`** → SVG default `miter`, and the four independently-seeded sides never share a corner point — at the `M`-start/`Z`-close vertex the ≈(1.17, 1.03) endpoint mismatch extrudes a mitered barb.

**Fix**: `stroke-linejoin="round"` on both frame-line paths — `HandDrawnGrid.vue:143–150` (transition layer) and `:193–200` (steady layer). Round join collapses the barb into a soft nub that reads hand-drawn; open subgrid/cell lines need nothing. The secondary fix (pin side endpoints to true rect corners in `gridPaths.ts:194–199`) is recorded optional — it alters board character and isn't required once the linejoin lands.

### 6 — THE DRAWER (owner finding 6, NEW feature — the centerpiece)

> "controls function as a drawer that slides underneath the board, with the board and logo centering and growing bigger to accommodate this — smoothly and fully animated. The drawer should be a small drawer element on the side of the board that pulls out from under the board and shifts it leftward."

**The conceit.** The page is a desk; the board is the worksheet; the controls card is the **pencil case tucked under the sheet**. Open (today's reading posture): the drawer sits at the board's right flank, board offset left. Closed: the drawer slides *under* the board sheet, and board + wordmark take the page's true axis and grow — the worksheet gets the whole desk. A small hand-drawn pull-tab stays at the board's right edge, the tongue of the tucked case.

**Geometry (≥1024 row regime only — the regime rule below).** Drawer panel = the existing controls card (~251px) + air, ~17rem travel. Open: board center sits left of the page axis by half the drawer's width (~136px at 1440). Closed: board + masthead center on the page axis; the board's height allowance loosens one step (`lg:max-w-[calc(100dvh-10rem)]` → `-9rem` in the closed regime, `SudokuBoard.vue:137–139`) and the wordmark scales ~1.05 — both grow, both center, per the verdict. Exact rems are execution-tunable; the gate is geometric (below).

**Choreography (Band-D user-triggered one-shot, ~480ms).** The drawer slides beneath the board (z-order: page < drawer < board sheet — the board's opaque paper covers the travel), easeOutCubic; the board + masthead ride ONE transform (translateX + scale) on the `spring` curve — the same physical flourish the toggle speaks. **Binding perf constraint (crit-design kill #4, finding-1 reconciliation): the filtered board's SIZE is never tweened.** The move is transform-only on a layer promoted for the gesture's duration (`will-change: transform` applied at gesture start, removed at settle); the true layout step (cap swap + real centering) lands in ONE frame at `transitionend` — one re-raster at settle, zero per-frame filter re-raster. §2's P2 fence must not clip the tab (the tab lives outside `.board-wrapper`'s containment).

**The tab + state.**

- The tab is a `HandDrawnOutline`-framed tongue at the board's right edge, **≥44×88px**, washi label ("controls") persistent on coarse pointers — the W11 UI-4/5 affordance grammar, inherited not reinvented.
- **Default OPEN, persisted** (`localStorage`) — primary controls are never hidden by default; tucking away is the owner's gesture, remembered. The margin voice hints once on first close ("your pencil case is under the board").
- Keyboard shortcuts (Cmd/Ctrl+Z, Shift+Z, K-peek) work with the drawer closed — the drawer hides the card, not the capabilities.

**A11y contract (crit-design hazard 3, cleared by construction):**

- Tab = `<button aria-expanded aria-controls="controls-drawer">`, Enter/Space operable; Escape closes from within the drawer.
- On open, focus moves to the drawer's first control; on close, focus returns to the tab.
- Closed drawer is `inert` + `visibility: hidden` after the slide — **no invisible tab stops** (W11's UI-6 lesson applied at birth, not retrofitted).
- PRM: no slide, no scale — same-frame swap of the two layout states (≤150ms opacity at most), the size step immediate.

**The regime rule (crit-design hazard 1, ruled):** the drawer exists at **≥1024 only**. Below 1024 the layout stacks and the controls stay in flow exactly as today — a *defined no-op*, not a silent break; there is no leftward room and nothing to shift into. A touch bottom-sheet variant is an explicit non-goal this wave (re-entry criterion: the owner asks for it on touch). 1280+ is the acceptance band; 1024–1279 works with modest growth (height-capped).

**Completion interplay:** §1's vignette anchors to the board wrapper and travels with the drawer transform; below ~1360 drawer-open it takes the corner-press top-right rung. Solved-state drawer toggling must not drop the celebration (§2 P5's state-derived `celebrating` is the guard).

## Gates

Authored at the addendum (no reconciliation row exists for W12); each row anchors to the owner's verbatim verdict it must clear.

| Gate | Value |
|---|---|
| Headline | all six owner verdicts re-probed live at the gate: gold path renders nothing below the fold (scrollHeight ≤ viewport, solved); outline matches the W9 reconstruction shots; toggle crest ~950ms, stage never empty, flip at click; spiral reads `#F0B030`; no TL barb; the drawer opens/closes at ~480ms with zero per-frame board re-raster |

Component checks:

| Gate | Owner verbatim anchor | Value |
|---|---|---|
| completion | "too small, occludes the bottom, messes up the flow" | star ≥6.5rem in the ≥1280 vignette; solved scrollHeight ≤ viewport at 1440×806; one text rung + one caption rung; heart at 3.5rem crowning the corner; corner-press rung docks top-RIGHT; celebration survives a solved-state remount |
| settled perf | "the performance is god awful on this page" | re-trace 10s settled (solved + unsolved) against the a1 baseline: paints/s ≤ ⅓ of the 112/s baseline, ~0 full-viewport paints steady-state, idle frames present; `transition-all` gone; twinkle recalc gone from the per-frame profile |
| outline | "boiling too hairline, outline changed herein" | live card matches `a2-shots/live-controls-card-fixspec.png` (grain-outline 0.13/0.75, outset 4, radius 0, outlineBoilPx 0.45); registration still px-native at every host incl. 375 (the W10-F1 win re-verified); `grain-static` byte-unchanged |
| toggle | "act as yoshi's story, closer to how it was BEFORE" | beat table traced: crest ~950ms, both bodies co-visible mid-gesture (max co-opacity > 0.5), theme flips at click (≤1 frame), star pop staggered, plush-land tail present; PRM = immediate flip + 200ms crossfade; band ledger row reads ~950ms |
| spiral | "contrast … as it was before" | `pencilConfig.ts` `spiral: '#F0B030'`; S1 geometry untouched by the revert; celebration `rays`/`sparkle` untouched |
| artifact | "strange artifact in the top left corner" | both frame paths carry `stroke-linejoin="round"`; TL corner renders a soft nub at DPR 2 zoom (vs `evidence/addendum/tl-zoom.png`) |
| drawer | "slides underneath the board … centering and growing bigger … smoothly and fully animated … pulls out from under the board and shifts it leftward" | open↔close traced: transform-only tween (no width/height/layout mutation mid-gesture in the trace), one layout step at settle, board edge grows ≥24px closed vs open at 1440×900; tab ≥44px + `aria-expanded` + focus order + `inert` closed; <1024 = today's stacked flow byte-for-byte; PRM same-frame swap; state persists across reload |

## Seeds

- [`evidence/owner-audit-2/`](../evidence/owner-audit-2/) — the five owner shots (completion-area, boil-hairline, sun-spiral, board-artifact, controls-drawer-context), the audit of record.
- [`evidence/addendum/a1-completion-perf.md`](../evidence/addendum/a1-completion-perf.md) — the geometry table, the fold arithmetic, R1/R2/R3, the six-trace elimination ladder, the five perf rows; exhibits `a1-solved-1440.png` / `a1-completion-live.png`.
- [`evidence/addendum/a2-boil-outline.md`](../evidence/addendum/a2-boil-outline.md) — the regime-shift quantification (3.8× erosion), the five-point fix spec, the live near-pixel validation set (`a2-shots/`).
- [`evidence/addendum/a3-toggle-recut.md`](../evidence/addendum/a3-toggle-recut.md) — the BEFORE trace, the five ruin findings, the beat table, the F4 per-edit disposition, the spiral contrast table.
- [`evidence/addendum/a4-artifact.md`](../evidence/addendum/a4-artifact.md) — the miter-barb proof (endpoint mismatch ≈(1.17, 1.03)), W10 innocence, the linejoin fix; exhibits `tl-zoom.png`/`tl-crop.png`.
- [`evidence/addendum/crit-design.md`](../evidence/addendum/crit-design.md) — the design kill-list (S1 scope, the R1 rung, the board-size-tween ban, the drawer hazards this wave's §6 clears) + the 61% arithmetic.
- [`evidence/addendum/crit-forensics.md`](../evidence/addendum/crit-forensics.md) — the 17-deduction re-derivation (94%), the reconstructed attribution table (the a6 interim baseline), the grain-static HOLD.

## Residual risks

- **The drawer shipped spec-first, prototype-never** — the one owner feature authored without a live lane (a5 was never produced). The hazards are folded by construction (regime rule, transform-only move, the a11y contract), but ~480ms/17rem/scale-1.05 are authored numbers, not probed ones; the gate's live trace is where they're earned. Budget the visual pass accordingly — this is the wave's L.
- **W10 may commit mid-addendum** — every `tree:N` cite is against the uncommitted 586-line `DarkModeToggle.vue` as read 2026-07-11; the disposition register (README §3a) executes against whatever state W10's workflow leaves. If W10 lands committed, the register's REVERT/RE-CUT rows become ordinary edits on a committed base — the content is identical, only the git mechanics change.
- **P2's paint fence vs the overhangs** — `contain: paint` on `.board-wrapper` clips the heart's corner overhang, the vignette, and anything else `overflow: visible` carries; the fence may need a restructure (overhang elements hoisted out of the fenced layer) rather than one declaration. The gate measures the outcome (viewport-damage elimination), not the mechanism.
- **The perf baseline was dev, mid-wave** — the "god awful" superlative rode HMR bursts and the dev runtime on top of a real paint regime. The gate re-traces on the same dev server for like-for-like; the paint/raster rows are prod-real, the JS share isn't.
- **The toggle re-cut deletes ~130 lines of W10 machinery** the same wave W10's register keeps its neighbors (palette rewire, PRM variant, rest-state visibility) — the re-cut must extract the keeps cleanly from the cut choreography; a3's salvage list is the checklist.
- **S1 stands on the critique's narrow reading of "contrast"** — if the owner meant the spiral as a gestalt, the geometry revert re-enters as a one-line follow-up (the before path + sw 10 are in `08f3ddd9`); the S2 revert is unaffected either way.
- **W11-before-W12 is load-bearing** — the drawer re-homes the card W11 labels (UI-4/5/9) and inherits its affordance grammar; running W12 first would have W11 editing a moved surface. WGATE's recert waits on W12.
