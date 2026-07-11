# T3-W10 gate record — sky + page (Fable gate lane)

Verified 2026-07-11 against the working tree at anchor `08f3ddd9` (W9) + the W10 diff
(16 modified files, uncommitted per the no-commit rule). Runtime probes: Playwright
Chromium against `vite dev` on `:3000`; probe source
`gate-probe-results.json` sits beside this record (raw JSON of every measurement).
Build gate: `npm run build` (vue-tsc -b + vite) green, `✓ built in 418ms`.

## Gate table

| Gate | Bar | Verdict |
|---|---|---|
| F5 set-and-rise | crest ≈1.25s traced; flip at crossover; PRM immediate+200ms; 10/10; no new easing | **PASS** |
| F4 slight pass | 7 edits at 5rem/13rem; M4 absent; filter on both icons; in-family | **PASS** |
| F6 page-turn | ≈1.05s traced; erase→seam→draw; D1/D2/D3; PRM cut; throttled-void green | **PASS** |
| F1 registration | hugs at every host incl. 375; radius agrees; R5 declared==rendered | **PASS** |
| keyframes.js | CLOSED-REJECT recorded; zero new deps | **PASS** |
| e2e | 34/34 green; toggle/switch specs cited | **PASS** |
| band ledger | 800ms→≈1.25s row landed | **PASS** |

## F5 — "Set and Rise"

**Crest + crossover, 10 drives** (alternating dusk/dawn; `clickTo*` in ms from the
click event; `theme-turning` ON at click marks choreography start, its removal is
`settleNow()` — the crest):

```
drive  direction          flipped  clickToThemeFlip  clickToSettle
 1     dusk (light→dark)  true     364.7             1264.1
 2     dawn (dark→light)  true     365.3             1264.7
 3     dusk               true     364.7             1264.4
 4     dawn               true     365.6             1265.4
 5     dusk               true     365.5             1265.3
 6     dawn               true     365.4             1264.3
 7     dusk               true     369.1             1267.8
 8     dawn               true     364.7             1264.9
 9     dusk               true     365.4             1265.3
10     dawn               true     369.2             1278.0
```

- **Theme flips 10/10 drives**, both directions.
- **Flip at the crossover, not at click**: `html.dark` lands 364.7–369.2ms after click
  (spec: crossover ~360ms; the ~5ms tail is rAF granularity on the beat-1 sequence
  clock). G10's baseline defect was ~4ms after click.
- **Crest 1264.1–1278.0ms ≈ 1.25s** (spec ≈1250ms = 360 SET + 580 RISE + 310 IGNITE),
  Band-D finite, well under the 3.2s cap.

**PRM variant** (context emulated `reducedMotion: reduce`):

```json
{ "clickToThemeFlipMs": 0.8, "themeTurningEverAdded": false,
  "phaseClassEverApplied": false, "iconComputedTransition": "opacity 0.2s",
  "activeIconComputedTransform": "none" }
```

`toggleDark()` fires at click (0.8ms to `html.dark` — same task, observed on the
mutation microtask); no choreography class ever touches the button across 40 rAF
samples; icons keep the single **200ms opacity crossfade** with `transform: none`.
The mid-flight-PRM-engage hazard is covered by `watch(reducedMotion)` → `settleNow()`
(DarkModeToggle.vue:229-231), which fires any owed flip — the theme can never be
stranded by a parked scheduler.

**No new easing row** — added-lines bezier inventory of the whole W10 diff:

```
1× cubic-bezier(0.22, 1, 0.36, 1)      logo-menu-out — the PRE-EXISTING logo-menu-in
                                        curve, reversed (wave beat 0: "ease-out reverse")
4× cubic-bezier(0.32, 0, 0.67, 0)      easeInCubic — SET, board/controls leave fades
1× cubic-bezier(0.33, 1, 0.68, 1)      easeOutCubic — controls fade-in (draw-on role)
2× cubic-bezier(0.34, 1.56, 0.64, 1)   spring — squash + RISE (physical flourish role)
1× cubic-bezier(0.68, -0.55, 0.265, 1.55)  pop — IGNITE star pops (back-out role)
```

The four house curves in their ledgered roles; the dusk color ease is a Band-C
one-shot `350ms ease` scoped to `html.theme-turning`, `no-preference`-gated
(index.css), conforming to the 500ms stroke/box-shadow precedent. `pencilConfig.ts`'s
diff touches only `YOSHI_COLORS.celestial` (palette), zero timing/easing rows.

**Mechanism**: one `createSequenceSubscription` per beat (seq0 squash / seq1 SET→flip
/ seq3 RISE→boil-handoff / seq4 IGNITE→settle) + `createStrokeDrawIn` for the
crescent stroke — all on the shared rAF chain; transforms stay CSS keyed by phase
classes. `ariaDark` flips at CLICK (DarkModeToggle.vue:329); D4 fixed — the incoming
body's boil onset moved from the `isDark` watch to rise-`onComplete`
(DarkModeToggle.vue:292), and `wobble-celestial` is bound **unconditionally on both
icon SVGs** (template lines 22, 78), the inactive icon parked `visibility:hidden` at
rest (the small-area filter ceiling holds — no second live filter region at rest).

## F4 — slight pass (M4 absent)

The seven edits, verbatim against the wave's path specs (DarkModeToggle.vue):

| Edit | Landed |
|---|---|
| W1 sun disc stroke 5→6 | `stroke-width="6"` (line 40) |
| W1 moon crescent 6→7 | `stroke-width="7"` (line 86) |
| S1 spiral curls-not-bars, sw 10→9, coil ends short | `d="M100,102 C105,93 116,96 117,107 … 132,78"`, `stroke-width="9"` (44-45) |
| S2 spiral #F0B030→#DF9A1E | `YOSHI_COLORS.celestial.sun.spiral: '#DF9A1E'` |
| S3 sparkle stroke 1.5→3 + #D99A10 | `stroke-width="3"` + `sun.sparkleStroke: '#D99A10'` |
| M1 lower horn tapers | `d="… C55,185 118,192 160,143 C122,162 70,145 60,95 …"` (85) |
| M2 detail down+thin, cusp eased | `d="M72,52 C52,68 47,105 55,133"`, sw 3.5, closing control `66,42` (85, 93-94) |
| M3 dot stars #FFFFFF→#FFF4AA | `moon.star: '#FFF4AA'` |

- **M4 absent** (K43 REFUTED-DROPPED): no dawn-direction or moon-on-light stroke
  deepen anywhere in the diff. S4 not taken (optional); S5 recorded as the upstream
  pencil-boil note only (template comment, no repo change).
- **Screenshots**: design-lane set `f4-{sun,moon}-{5rem,13rem}.png` + this lane's
  independent reproduction `gate-f4-*.png` (both themes, 5rem default and 13rem via
  `--toggle-size`). At 5rem the spiral reads as a curl (no "G"), sparkles legible; at
  13rem the horn tapers to a point, tip clean, star field one butter temperature.
- **In-family**: all three new hexes are one-step deepens inside the existing
  gold/butter family; silhouettes unchanged except the authored M1/M2 path edits.
- **Celestial rewire**: template consumes `YOSHI_COLORS.celestial.*` throughout;
  CelebrationStar's duplicated hexes now read `sun.sparkle`/`sun.rays` (values
  unchanged). The `useCelestialSun()` composable stays parked (no M4 lift).

## F6 — page-turn game switch

**Trace** (ms from the futoshiki select click; style-attr observer on
`stroke-dashoffset` writes for the draw-in clock):

```
board-leaving ON            3.2      beat 1 — erase + chrome fade start
menu-pop REMOVED          148.8      D1 — the 140ms leave is real (was same-frame)
board-shell REMOVED       225.9/245.1  beat 2 — the seam (erase's animationComplete)
board-shell ADDED         233.5/251.7  futoshiki mounts
last draw-in style write 1055.7      beat 3 settles — 1431 dashoffset writes
```

**Total ≈1.05s traced** (spec ≈1.05s), erase→seam→draw routed through the existing
`animateErase`/state machine (`onGridAnimComplete('hidden')` + `leaving` → `emit('erased')`,
both boards, structural twins).

- **D1**: menu leave = `logo-menu-out` 140ms (measured removal at 148.8ms), Vue
  `<Transition name="logo-menu">`, `pointer-events: none` while leaving; PRM arm sets
  `animation: none` → next-tick removal.
- **D2**: switch-back probe (sudoku → futoshiki → sudoku, sampled 600ms after
  remount): `{"revealClassCells": 0, "runningRevealAnimations": 0}` — **no
  reveal-wave replay** (`.cell-reveal-animated` count and running `cell-reveal`
  animations both zero; the persisted-board restore path lands with a clean
  `animatingCells`).
- **D3**: chunk preload fires on menu-OPEN — request log on `toggle` (via the `open`
  emit, keyboard opens included): `/src/games/futoshiki/FutoshikiGame.vue` + deps
  requested before any select. Cold fallback landed: `defineAsyncComponent` with
  `ScribbleLoader` loadingComponent at `delay: 300` (blank ≤300ms then the scribble,
  never a spinner).
- **Throttled-void spec green**: `✓ 27 e2e/throttled-void.spec.ts:35 › throttled
  first-select void recovers: loader or board-shell within budget (1.0s)` — recovery
  that measured ~13s pre-W10 under the same CDP throttle now satisfies the OR's
  loader arm inside 1.0s.
- **PRM**: `{"clickToSeamMs": 53.1, "boardLeavingEverRaised": false}` — the beat-1
  hold is skipped (`setGame` returns after `scene.value = next`), no erase class ever
  raised; the 53ms is click dispatch + Vue patch, not a choreographed hold.
- **Seam guard**: a 900ms `setTimeout` forces a late seam if the outgoing scene can't
  erase (async placeholder case) — degrade to a hard cut, never a deadlock.
- **State truthful at click**: `game` (wordmark/URL) updates in `setGame` before any
  choreography; only `scene` (the mounted exercise) waits for the seam.

**keyframes.js CLOSED-REJECT covenant recorded** — App.vue:63-71 comment block:
re-adoption would be "a second animation brain + a runtime CSS parser to run 2 fades
+ 2 existing sequences, re-splitting the clock W8/W12 unified. Re-entry is a
CAPABILITY GAP — numeric path morphing / spring physics (glyphPaths.ts's dormant
affordance) — never a version number." **Zero new deps**: `git status` shows no
package.json/package-lock.json change; `grep keyframes web/frontend/package.json
package-lock.json` → no hits.

## F1 — px-native dropdown frame

**Measurements** (path bbox vs card border box, px; positive = path outside the
card edge; frame stroke 3px + wobble roughness accounts for the sub-3px remainder —
the frame IS the drawn edge, centered on the border box):

```
                       left   top   right  bottom
1280 light  menu-card  0.68   1.37  0.68   0.67
1280 light  controls   2.49   1.79  1.15   1.90
1280 dark   menu-card  0.68   1.37  0.68   0.67
 375 light  menu-card  0.71   1.37  0.64   0.67
 375 light  attribution 0.62  2.51  0.83   2.51
 375 dark   menu-card  0.71   1.37  0.64   0.67   ← the owner-shot host
```

Every host within 0.62–2.51px at every viewport and theme — against the measured
5.11–5.79px float (worst at 375 dark, the owner shot). **The UI-1 reproduction is
cleared**: `gate-f1-375-dark-menu.png` (this lane's own capture) vs
`../owner-shots/dropdown-border.png` — the old square white frame floating clear of
the dark rounded card, board bleeding through the gap, is gone; the wobble frame now
hugs the rounded card with in-family jagged arc corners.

- **Radius agrees by construction**: `HandDrawnOutline` reads the slotted card's own
  computed `border-radius` (12px measured at every host) unless a host passes
  `radius`; `generateRectBoilFrames` grew the `radius` param — sides shortened by
  `r`, corners joined by jittered arc-sampled polylines (fresh seed per boil frame),
  `radius=0` reproduces the square frame exactly.
- **One coordinate system**: viewBox = measured px box + 2·outset (prop, default 0);
  fixed `inset:-6px` CSS, `preserveAspectRatio="none"`, and
  `vector-effect: non-scaling-stroke` all deleted — scale is 1:1, the anisotropic
  wobble is gone by construction.
- **One-edge ownership**: `.edge-outlined` variant (index.css) drops the utility's
  2px border on outlined hosts (menu card + both SolverErrorNotes); the 8px hard
  shadow stays. Dark-mode H2 hairline mix removed with the border it patched.
- **R5 declared==rendered**: `.edge-outlined` also drops the −2px lift (folding it
  into `logo-menu-in` measured as a 2px frame/card skew — the frame registers to the
  layout box); computed `transform` on the settled menu card =
  `matrix(1, 0, 0, 1, 0, 0)` (identity) at every probe point. Declared no lift,
  rendered none.

## e2e

**34/34 green** (two consecutive full runs: `34 passed (18.1s)`, `34 passed (17.4s)`).
Specs exercising the reworked DOM, cited:

- `visual-regression.spec.ts:16-25` `setDarkMode` — clicks `button.sun-moon-toggle`
  then `await expect(html).toHaveClass(/dark/, { timeout: 3000 })`: accommodates the
  deferred ~365ms flip. `:186-192` asserts the new both-icons truth —
  `svg.toggle-moon.is-active` count 1 / `svg.toggle-sun.is-active` count 0 (the
  active class carries state; presence no longer does).
- `futoshiki.spec.ts:39` wordmark listbox switch rides the full ≈1.05s page-turn
  (`expect.poll` on cell count) — green in 1.3s.
- `permalink.spec.ts:71` game switch URL hygiene — green through the seam (1.9s).
- `throttled-void.spec.ts:35` — the W7 exhibit, green at 1.0s (was ~13s recovery).

## Band ledger

`docs/animation.md` Band-D row (the ledger's one home; pencilConfig carries no
band table — its cited 22-23 region is the palette in the current file):

```diff
-… logo clip 1.2s, theme page-turn 800ms, celebration ≤3.2s |
+… logo clip 1.2s, theme set-and-rise ≈1.25 s, celebration ≤3.2s |
```

The measured 1264–1278ms crest sits on the row's ≈1.25s.

## git status classification

All 16 modified files are W10 scope, uncommitted per the gate's no-commit rule:

- **F5/F4/palette**: `pencil/celestial/DarkModeToggle.vue` (rebuild + 7 edits),
  `pencil/config/pencilConfig.ts` (celestial palette rows only),
  `pencil/chrome/CelebrationStar.vue` (gold rewire), `assets/index.css` (dusk ease +
  edge-outlined).
- **F6**: `App.vue` (orchestrator + D3 + covenant), `games/{sudoku,futoshiki}/…Game.vue`
  + `…Board.vue` (leaving/erased routing + fades), `games/shared/scene.css` (chrome
  fades), `pencil/chrome/HandwrittenLogo/HandwrittenLogo.vue` (D1 leave + open emit).
- **F1**: `pencil/grid/HandDrawnOutline.vue` (px-native), `pencil/grid/gridPaths.ts`
  (radius-aware frames), both `SolverErrorNote.vue` (edge-outlined).
- **Ledger**: `docs/animation.md` (the Band-D row).
- **Untracked**: `docs/tranches/2026-07-tranche-3/evidence/T3-W10-gate/` (this
  record + probe JSON + 15 screenshots). The design lane's stray
  `web/frontend/probe_{built,tmp}.mjs` seen at session start are already gone.

No other tree changes; no dependency, lockfile, or e2e spec modifications.
