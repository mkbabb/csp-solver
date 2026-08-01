# F4 "dealer's ritual" — PROTOTYPE MANIFEST (pass 1, slice 1 + slice 2)

Spec: `../f4-spec.md` · Charter: `../../charter-f4.md` · Built read-only against
`/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend` (nothing in the
project tree was touched; no dev server, no ports).

Everything below is either **RUNS** (executed, with numbers) or **SPEC-ONLY** (written out as real
code but not executed). No pseudocode anywhere.

---

## 1 · Verdict up front

| falsifier (spec §prototype slice) | verdict | evidence |
|---|---|---|
| (a) gallery column overflows 667px | **SURVIVES** | column **597.8px** at 375×667, `verticalOverflow: false`, ~69px slack; 612.8px at 393×852 |
| (b) any `HandDrawnOutline` regen on snap | **SURVIVES** | **0 bakes per snap**, 8–9 snaps × 3 regimes, real WebKit 26.5 |
| (c) chip taps leak to `select` | **SURVIVES** | real pointer tap on a difficulty chip → `selects 0`, `chipLeaks 0`, picker still open |
| (d) two-verb blind read | **NOT HEADLESS-DECIDABLE** — screenshots handed to CRITIQUE; one real defect found (flank void, §5.1) |
| T7 parsimony (net ≤ −350 LOC) | **FAILS AS BUILT**: **+14 gross**, **−139 code-only** (§4) |

Slice 1 survives its three measurable falsifiers. The family's *cost* claim does not: F4 is
LOC-neutral, not −400.

---

## 2 · Artifacts

### 2.1 Real code — `code/` (SPEC-ONLY: written in full against the real files, never applied)

`code/current/<file>` is a verbatim copy at HEAD; `code/f4/<file>` is the same file with the change
applied; `code/diff/<file>.diff` is `diff -u` between them. Every path below is relative to
`web/frontend/src`.

| artifact | real target | net LOC | what it is |
|---|---|---|---|
| `f4/types.ts` | `pencil/chrome/GameGallery/types.ts` | +21 | pencil twin of `StagingAxis`; `range` dies (D1) |
| `f4/registry.ts` | `games/registry.ts` | +57 | `range`→**static** `staging: StagingAxis[]` (5 producers, `quick` on difficulty); `GameDefinition.options` **deleted**; `ControlSection` import gone (D1) |
| `f4/sudoku.game.ts` | `games/sudoku/game.ts` | −14 | the 17-line `options:` block deleted (the twin for the other four) |
| `f4/useStagingBridge.ts` | `games/shared/useStagingBridge.ts` **NEW** | +103 | register/read/`applyAndDeal` + the TTL'd one-shot handoff + the quick-axis publish seam (D2) |
| `f4/useGameState.ts` | `games/shared/useGameState.ts` | +38 | consumes the handoff **before** init (seeds size/difficulty, suppresses `canRestore`) + registers the staging source (D2/D7) |
| `f4/GameCard.vue` | `pencil/chrome/GameGallery/GameCard.vue` | +238 | the staging band on all five cards (`inert`+`visibility:hidden` flanks), two axis rows, the Deal stamp in the card's own `:pose`, per-control `@click.stop` (D3/D5/D6) |
| `f4/GameGallery.vue` | `pencil/chrome/GameGallery/GameGallery.vue` | +90 | chip state, `deal` emit, the ported two-tap arm **un-fenced from `isCoarse`**, `d` key, Escape-disarms (D3/D6) |
| `f4/App.vue` | `App.vue` | +45 | `onGalleryDeal` (same-game vs handoff), `stagedSeed` overlay, quick-axis publish |
| `f4/GameControlPanel.vue` | `games/shared/GameControlPanel.vue` | **−332** | the staged zone excised: `ControlSection`, `sections` prop, tab-toggle, `onDeal`+arm, `deal` emit, `.new-game-zone`/`.deal-*`/`.crayon-*`/`.mobile-heading-*` styles |
| `f4/SudokuGame.vue` | `games/sudoku/SudokuGame.vue` | −3 | mounts the shared shell directly (the per-game relay is deleted) |
| `f4/RedealStrip.vue` | `games/shared/RedealStrip.vue` **NEW** | +177 | quick axis + demoted dice, the ported arm, `pointer-events:auto` (D4) |
| `f4/GameBoard.vue` | `games/shared/GameBoard.vue` | +8 | renders `RedealStrip` in `.board-margin` — **no slot, no per-game edit** (§5.6) |
| `f4/GameScene.vue` | `games/shared/GameScene.vue` | +3 | hides the strip on the live card face (the `DrawerTab` precedent) |
| `f4/index.css.crayon.hunk.css` | `assets/index.css` (`@layer components`) | +31 | the `.crayon-*` tints get ONE global home (§5.3) |

### 2.2 Runnable mocks — `mock/` (**RUNS**)

| file | how to run | what it is |
|---|---|---|
| `mock/f4-slice1.html` (67.6 kB, self-contained) | open in any browser, or `node measure/measure.mjs` | the staged picker card, five cards, real tokens/fonts/CSS, instrumented HandDrawnOutline. Query flags: `?band=0` (pre-F4 card), `?dirty=1` (dirty board), `?theme=dark|light`, `?hud=0`. Keys `← →` snap · `Enter` visit · `d` deal · `Esc` disarm. `window.__f4.measure()` returns every number in §3. |
| `mock/f4-slice2-panel.html` (54.5 kB, self-contained) | open in a browser, or `node measure/measure-panel.mjs` | the T5 bench: mobile controls card BEFORE/AFTER, desktop rail BEFORE/AFTER, and the `RedealStrip` in a board margin. `window.__f4panel.measure()`. |
| `mock/*.tpl.html` + `mock/build_mock.py` | `python3 build_mock.py` | the sources; the builder inlines the three real woff2 subsets (17,236 B) as data URIs so each mock is one portable file. |

Fonts, tokens, type ladder, `.cartoon-shadow-md`, `.edge-outlined`, `.game-card*`, `.gallery-*`,
`.ctrl-btn`/`.options-row`/`.selected-item`, `.section-heading`, `.icon-btn`/`.icon-sublabel`,
`.board-margin` are all **lifted verbatim** from the project. The HandDrawnOutline is
re-implemented in ~60 lines of JS keeping the one contract the falsifier needs: a `ResizeObserver`
on the host content box regenerates `BOIL_CONFIG.frameCount` (4) pre-baked pose paths, and every
regeneration is counted.

### 2.3 Measurement — `measure/` (**RUNS**)

| file | how | output |
|---|---|---|
| `measure/measure.mjs` | `node measure/measure.mjs` (Playwright **WebKit 26.5** from the project's own `node_modules`) | `results.json`, `shot-<regime>-{band,noband,dark}.png` at 375×667 (hasTouch), 393×852, 1440×900 |
| `measure/measure-panel.mjs` | `node measure/measure-panel.mjs` | `results-panel.json`, `shot-panel-*.png` at 375 coarse + 1440 fine |

**The iPhone 16 sim was NOT used: `perf-rig-iphone16` is `Shutdown`** (`xcrun simctl list devices
booted` → empty). Measurements are real WebKit (the same engine as iOS Safari) at iPhone-16
viewports with `hasTouch/isMobile` + DSF 3. The sim run remains an owner/CRITIQUE row.

---

## 3 · Measured numbers

### 3.1 Slice 1 — the staged card (WebKit 26.5, light theme unless noted)

| metric | 375×667 (touch) | 393×852 (touch) | 1440×900 (fine) |
|---|---|---|---|
| card height, band live | **488.0px** | 502.6px | 547.8px |
| card height, pre-F4 (`?band=0`) | 318.8px | 331.6px | 384.5px |
| delta | **+53.1%** | +51.6% | +42.5% |
| gallery column height | **597.8px** | 612.8px | 662.8px |
| vertical overflow | **false** | false | false |
| horizontal overflow | false | false | false |
| card / paper / face width | 273.4 / 273.4 / 244.6px | — | — |
| stamp box | **55.8 × 243.5px** | 55.7 × 257.4px | 55.8 × 302.7px |
| size row: content vs available | 184.8 / 184.8px (fits) | 184.8 | 184.8 |
| difficulty row: content vs available | **213.5 / 213.5px** (fits, 0 slack) | 213.4 | 213.5 |
| chip min tap box | **35.8 × 35.8px** | 35.8 | 35.8 |
| outline instances | 10 (5 card frames + 5 stamp frames) | 10 | 10 |
| pose bakes at end of mount | **10** (today: 5) | 10 | 10 |
| **pose bakes per snap** | **[0,0,0,0,0,0,0,0]** | [0,0,0,0,0,0,0,0] | [0,0,0,0,0,0,0,0,0] |
| chip tap → selects / leaks | 1 → **0 / 0** | 0 / 0 | 0 / 0 |
| pristine stamp press | deals at once | same | same |
| dirty 1st press | `arms 1`, sub `"sure?"`, aria `"Press again to deal a new sudoku board"`, announce `"deal a new sudoku board? press again to confirm"` | same | **same (fine pointer armed too — D3's un-fencing verified)** |
| dirty 2nd press | deals `{id:"sudoku", staged:{size:3, difficulty:"HARD"}}` | same | same |
| `d` key on the viewport | deals, `selects 0` | same | same |
| flanks: `inert` / band `inert` / band hidden | 4/4 true | true | true |
| stamp is a tabbable `<button>` | true | true | true |

The spec's arithmetic (M12/M13: rows ≈213px, card 340→~535, column ~604) lands: difficulty row
**213.5px** into a **244.6px** face, column **597.8px** vs the spec's ~604.

### 3.2 T5 — the drawer after the excision (measured on the bench)

| | rows (DOM) | height | delta |
|---|---|---|---|
| mobile controls card @375 coarse, BEFORE | 15 | **728.1px** | |
| mobile controls card @375 coarse, AFTER | 9 | **504.4px** | **−30.7%** (−223.7px) |
| desktop rail @1440 fine, BEFORE | 15 | **867.4 / 864.2px** | |
| desktop rail @1440 fine, AFTER | 9 | **520.4 / 472.0px** | **−40.0% / −45.4%** |
| `RedealStrip` in the margin @375 | — | **48.1px** tall, 317px wide, min tap 36px | |

Counting rule for "rows": every `.section-heading`, `.options-row`, `.mobile-heading-row`,
`.deal-row`, `.action-row`, `.play-controls`, `.peek-hold-surface` in the subtree. The spec's
"25→14 rows" counts differently (chips individually, probably); the **percentages** are the
transferable numbers, and the mobile one matches the spec's −31% claim almost exactly. Named
approximations in the bench: the `filter: url(#stroke-light)` on `.control-panel-filtered` is
dropped (paint, not layout), icons are same-box placeholders, `BoilDivider` is its real 14px
hairline box, `KeyboardLegend` is omitted from **both** desktop variants (so the delta is intact).
The spec's ABSOLUTE figures (~500→~345 mobile, ~853→~495 desktop) understate the mobile card by
~228px; the desktop absolute is within ~4%.

### 3.3 T6 — mark 4

`grep '^+' code/diff/*.diff | grep 'filter:'` → **0**. Zero new live-filter surfaces, zero new
bake enrolments (the stamp rides the gallery's ONE beat via `:pose`). The mount-time bake count
does rise **5 → 10** (each card's stamp frame bakes once); steady-state raster is unchanged
(opacity swap on the centered card's two frames).

### 3.4 Font coverage (mark 4, verified by unicode-range inspection, not `fonts.check()`)

- Fraunces subset = `space B D S a c d e f h i k l o r t u y z`. The stamp's **"Deal"** is fully
  covered (D, e, a, l). **Uppercase `I Z E F C U L T Y M …` are NOT** — so today's uppercase
  `.section-heading` ("SIZE", "DIFFICULTY", "MARKS", "CHECK") already renders in the Georgia
  fallback. That's why the band's axis labels are **lowercase Patrick Hand** (`size`,
  `board size`, `difficulty` — every glyph inside that subset), not `.section-heading`.
- Chip labels (`Easy Medium Hard 4×4 9×9 16×16`) and `sure?` / `deal again` are fully covered by
  the Fira Code / Patrick Hand subsets. **No new glyph coverage is needed anywhere in F4.**
- Caveat recorded because it is a trap: `document.fonts.check()` returns `true` even for runs no
  `@font-face` claims (it ignores uncovered codepoints), so it cannot be used as a subset probe.

---

## 4 · LOC accounting (honest, and it contradicts the spec)

Measured rows come from the diffs in `code/diff/`; projected rows are priced from their measured
twin (the four remaining `game.ts` files are line-identical in shape to `sudoku.game.ts`, etc.).

| row | gross net | code-only net |
|---|---|---|
| MEASURED App.vue | +45 | +28 |
| MEASURED GameBoard.vue | +8 | +4 |
| MEASURED GameCard.vue | +238 | +184 |
| MEASURED GameControlPanel.vue | −332 | −267 |
| MEASURED GameGallery.vue | +90 | +58 |
| MEASURED GameScene.vue | +3 | +3 |
| MEASURED SudokuGame.vue | −3 | −6 |
| MEASURED registry.ts | +57 | +40 |
| MEASURED sudoku/game.ts | −14 | −19 |
| MEASURED GameGallery/types.ts | +21 | +7 |
| MEASURED useGameState.ts | +38 | +23 |
| MEASURED useStagingBridge.ts (new) | +103 | +46 |
| MEASURED RedealStrip.vue (new) | +177 | +128 |
| MEASURED index.css crayon hunk (new) | +31 | +14 |
| MEASURED delete sudoku/ControlPanel.vue + test | −213 | −160 |
| MEASURED delete futoshiki/ControlPanel.vue + test | −206 | −159 |
| PROJECTED 4× game.ts (futoshiki/thermo/killer/kenken) | −56 | −76 |
| PROJECTED FutoshikiGame.vue | −3 | −6 |
| PROJECTED 3× thermo/killer/kenken scenes | −18 | −15 |
| PROJECTED registry.test.ts | −12 | −12 |
| PROJECTED e2e/gallery-deal.spec.ts (new) | +60 | +46 |
| PROJECTED e2e 10× "Deal a new board" re-points | 0 | 0 |
| **TOTAL** | **+14** | **−139** |

Where the spec's −400 went:

1. `registry.ts` **+57, not −40** (a +97 swing). Static staging data (5 bands × 2 axes with
   labels/defaults) is much longer than the one-line `range` it replaces. The `options`-slot
   deletion is real but small.
2. The two new components come in **+140 over** the estimate (bridge 103 vs 55, strip 177 vs 85) —
   both at the estate's documentation density, which is the register the repo actually keeps.
3. `GameCard.vue` **+238 vs +145**: two axis rows + the stamp + the flank reservation + the
   chip-boil burst + the a11y line, in the project's comment register.
4. Unpriced rows the spec missed: the `index.css` crayon hunk (+31) and `registry.test.ts` (−12).

`GameControlPanel.vue` **beat** its estimate (−332 vs −324), and the `game.ts` row beat it too
(−70 vs −35). The deletion half of the family is real; the addition half was under-priced ~2×.

---

## 5 · Findings the prototype forced (each one changes the spec)

1. **The flank void (new, visual).** D5's reserved band is correct for the bake gate and it leaves
   a large EMPTY area on every flank card (visible in `shot-desktop-safari-1440x900-band.png`).
   Nothing paints there by construction — that is the point — so the cure cannot be "draw
   something faint" (that breaks the soul gate). Options: accept it (flanks are 0.9-scaled, 0.62
   opacity, mostly cropped), or shrink the reservation with the spec's own named fallback
   (size row → stepper). CRITIQUE owns the call.
2. **Chip tap targets are 35.8px, under the 44px coarse floor** — on the card AND in the strip.
   Inherited, not new (`.ctrl-btn` never got the coarse padding that `.icon-btn` has), but F4 makes
   chips the PRIMARY staging control on touch, so it stops being someone else's problem. One rule
   inside `OptionSelector.vue` fixes every consumer: `@media (pointer: coarse) { .ctrl-btn {
   min-height: 44px } }` (+3 LOC, verify the card height budget after — it has 69px of slack).
3. **`.crayon-*` has never tinted an option chip.** The rules are scoped inside
   `GameControlPanel.vue`, so they only ever reached that component's own `<h2>`; the `colorClass`
   on `difficultyOptions` has been inert inside `OptionSelector` all along
   (`grep -rn "crayon-green" src` → no global definition). F4 has two chip consumers, so the tint
   moves to one global home (`code/f4/index.css.crayon.hunk.css`). Consequence to flag to the
   owner: difficulty chips **gain** a colour they did not have. AA holds on `--color-card`
   (green-ink 4.95 · orange-ink 4.91 · red-ink 4.98; dark aliases the wax ≥10:1) — open Q7 closed.
4. **The spec's M20 is wrong: `range` HAS tests.** `registry.test.ts:142,143,164`, plus three more
   for the `options` slot (`:54-66`, `:108`). Priced above (−12).
5. **The strip's axis data has no legal path in the spec.** `games/shared/**` may not import a
   concrete game (eslint shared-floor rule), and `registry → game.ts → composables → shared` is a
   real cycle, so `RedealStrip` cannot read the registry. Implemented cure: **App publishes the
   `quick` axis into the bridge** (`setQuickAxis`, +6 LOC in the bridge, +3 in App) — App is
   already the one legitimate registry consumer.
6. **The spec's slice-2 hosting doesn't work.** `GameBoard` is nested inside each game's board
   adapter, so a `#margin` slot filled from `GameScene` would need threading through five
   adapters. `GameBoard` renders `RedealStrip` itself (+8 LOC, zero per-game edits), the strip
   self-suppresses when the bridge has no axis/source (posters, tests, pre-publish mounts), and
   `GameScene` hides it on the live card face by extending the existing `.drawer-tab` rule.
7. **The handoff must SEED, not deal.** Registering the source and calling `applyAndDeal` at setup
   double-dispatches against `useGameState`'s own mount deal. The diff consumes the one-shot
   **before** the init block (writes `solverSize`/`pendingSize`/`difficulty`) and ANDs `canRestore`
   with `!handoff` — one solver dispatch, and a staged deal never resurrects the board just left.
   The one-shot carries a 10s TTL so a failed scene chunk can't mis-seed a later board with
   another game's size.
8. **`boil-frame` must not be wired to the live pose** on the card. `OptionSelector` mints a
   scribble data-URI per `(seed, boilFrame)`; feeding the 150ms beat would mint a fresh raster
   every beat — a new live paint surface. The diff uses the drawer's bounded 4-frame burst on chip
   tap and 0 at rest.
9. **T1 is only half-verified.** Desktop/mobile "same game, harder" = **2 taps, 0ms of fold
   choreography** by construction (chip → deal on the strip; +1 press when dirty). Whether the
   48.1px strip is above the fold at 375×667 in the real app is **unmeasured** — it needs the
   built app, not a mock. CRITIQUE/owner row.

---

## 6 · What is NOT built

- `e2e/gallery-deal.spec.ts` (stamp arm, strip arm, `d` key, chip-no-bubble): SPEC-ONLY, priced
  +60/+46.
- The four remaining `game.ts` files, `FutoshikiGame.vue`, the three lazy scenes, `registry.test.ts`:
  SPEC-ONLY, priced from their measured twins (§4); each is the same mechanical edit as the one
  written out.
- `gallery-guard.spec.ts`: **untouched by design** — the diff leaves `attemptSelect` and the ribbon
  byte-identical (verify in `code/diff/GameGallery.vue.diff`).
- The `perf-rig-iphone16` sim run (sim is Shutdown) and any real-app measurement (no dev server was
  started, per the lane's constraint).
