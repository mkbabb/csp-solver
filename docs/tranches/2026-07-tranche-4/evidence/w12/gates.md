# T4-W12 · Lane V — adversarial verification (the ratify-me sheaf)

Trust-nothing re-measurement of Waves A/B/C/D on the combined working tree (W12 ⊕ W13-in-flight).
Port **4789** (self-served `vite preview` over my own `vite build` dist); `:3000`/`:3001` never
touched; goldens re-baselined NOTHING; temp mirror config (`playwright.verify.config.ts`) + preview
killed after. Base = T4-W11 sealed HEAD `38d3f223`.

**VERDICT: PASS.** Every π/DELTA gate is green under my own measurement. Two records below are NOT
gate-reds: (a) two flaky specs UNEDITED by W12 that pass on retry — one carries a stale pre-existing
assertion from T4-WM; (b) Wave C's three honestly-disclosed §choreography deviations for the ballot.

---

## The π/DELTA table — re-measured (spec §gates)

| Claim | My measurement | Verdict |
|---|---|---|
| Entry fold ≤1 board raster | `c-entry-paint-trace.json`: `boardLayoutW=0` for all 70 samples (`distinctBoardStates:[0]` — board cut from render, the CENTER CARD carries the throw); card scale `1.884→1.0`, `maxUpwardStep 0`, peak at frame 0 (no rest flash) | **GREEN** |
| Idle gallery paint-bounded (soul gate) | `gallery-idle-paints.json`: center **8 beats/s / 80 mut**, flanks **0/0**, `layoutCount_delta 0`. Confirmed BY CONSTRUCTION: `GameGallery.vue:78` holds the ONE `useBeatFrame`, feeds `:pose` to the active card only; flanks get pose 0 + `inert`; `PosterBoard.vue` never calls `useBeatFrame`/`useBoilBeat` | **GREEN** |
| Snap glide monotone, glass curve | `snap-glide-trace.json`: peak `338px@10.7ms → 0`, `maxUpwardStep 0`, `minTx 0` (zero overshoot), `cubic-bezier(0.32,0.72,0,1)`, 440ms band | **GREEN** |
| Game-agnostic drop-in | `third-game-drop-in.diff`: 3 files — 2 NEW `games/demo/{DemoPoster,DemoScene}.vue` + a SINGLE registry.ts hunk **entirely inside the `GAMES[]` literal**. Zero edits to App.vue/GameGallery/pencil/shared | **GREEN** |
| Mid-game guard fires only dirty+different | `gallery-guard.spec.ts` (all 6 pass vs my dist): dirty+different arms ribbon → Leave abandons/Keep dismisses; pristine+different & dirty+same switch free. `useGameState.ts` reuses the ONE `isDirty` (`undoDepth>0`), no parallel bool | **GREEN** |
| Mobile 375 | `gallery-375.png` — one ~80vw card + neighbor peek + pips (π banked) | **GREEN** |
| PRM cut | `c-prm-entry-trace.json` `runningAnims:0`, gallery same-frame; the fold degrades to Wave B's cut | **GREEN** |
| A11y | `gallery.spec.ts` passes (listbox roles/labels/focus/pips); `sr-announcement-log.json` (`sudoku, 1 of 2` → clamp/Home/End); keyboard select drives the recut `futoshiki.spec` | **GREEN** |
| **useFlipGlide safety (THE NAMED RISK)** | **`drawer.spec.ts` UNEDITED** (not in `git diff`); darwin goldens **4/4 byte-for-π vs my dist**, zero re-baseline. `logo-light` golden passes despite the dropdown retirement (wordmark pixels unchanged) | **GREEN** |

## Covenant + soul gates (grep + structural)

- **No second animation brain** — no `keyframes.js`, no tween lib imported. Fold + nav step ride the extracted `useFlipGlide` / the drawer's FLIP grammar; chime is a one-shot pencil-boil `sequence`. **GREEN**
- **One live board** — `App.vue:321` board `v-show="view==='playing'"` (mounted, state preserved); exactly one scene `v-if` (`SudokuGame`/`FutoshikiGame`); gallery cards are posters. Never a second live scene. **GREEN**
- **pencil ↛ games** — `grep` of `src/pencil/**` finds ZERO `@games`/games imports; `eslint .` exit 0. `useFlipGlide` (games/shared) consumed only by App.vue + useControlsDrawer (both outside pencil/**). **GREEN**
- **No router / modal / audio** — no `vue-router`; no `confirm()`/`<dialog>`/`showModal`/`aria-modal` (only comments naming what it is NOT); no `Audio`/`AudioContext`. `?view=`/`?game=` via `replaceState`. **GREEN**

## Battery (combined tree, my run)

| gate | result |
|---|---|
| `vue-tsc -b --force` | exit **0** |
| `eslint .` | exit **0** |
| `knip` | exit **0** |
| `prettier --check src/` | exit **0** (all matched files) |
| `vitest run` | **307 passed / 29 files** |
| `vite build` | exit **0** (poster chunks present; registry now consumed, no longer tree-shaken) |
| default e2e (`:4789`, mirror config, webServer stripped) | **77 total: 75 pass + 2 flaky→pass on retry** (see below); all 15 gallery/guard specs green |
| darwin goldens (`:4789`, `test:golden`) | **4/4 byte-for-π**, zero re-baseline |

## Cross-wave (W13 concurrent)

- `git diff --stat` cleanly split: `csp-solver/**` + `wasm/src/lib.rs` = W13; `web/frontend/**` = W12. No W12 file touches `csp-solver/**` or `games/{thermo,kenken,killer}/`.
- `GAMES[]` = `[sudokuCard, futoshikiCard]` only — W12 added NO rows; additive/mergeable for W13's final lane.
- All `thermo`/`kenken`/`killer` refs in FE src live inside W13's own untracked dirs (+ a contract stub in the shared `registry.test.ts`). W12 didn't touch W13's dirs.

---

## Records for the Team-lead (NOT gate-reds)

1. **Two flaky specs, UNEDITED by W12, pass on isolated retry** (`affordances.spec.ts` roving-tabindex; `visual-regression.spec.ts:402`). On the retry both passed (17/17). Analogous to the documented logo-light full-suite flake.
   - **Latent pre-existing red (file a fix, not W12's):** `visual-regression.spec.ts:456` asserts a baked pose `src` matches `^data:image/png`, but `rasterPose.ts` (committed at **T4-WM**, in the W11 base, NOT in W12's diff) retired the synchronous `toDataURL` path for `URL.createObjectURL`/`toBlob` — poses now bake to `blob:` URLs. The assertion is stale; it only passes when the async bake is still in-flight (the `<svg>` branch). A future lane should update the assertion. Orthogonal to W12.

2. **Wave C's three disclosed §choreography deviations** (covenant intact, spec-fidelity gaps → ballot / a Fable fold-build lane):
   - The center card's face is the **poster + a cut**, NOT the live board relocated via Teleport with the game swap redrawn under the small card ("the hidden seam"). A **marked board loses its marks visually at the center during the gallery** (pristine is faithful). Needs a live-center-slot rearchitecture.
   - **Beat 2 "the deal"** (flanks draw-IN via `DRAW_IN_PRESETS.gridFrame` staggered `sequence` subscribers) — not built; flanks appear with the Wave-B mount.
   - **Beat 0 "chrome leaves"** — folded into the cut, not a discrete 200ms beat.
   - `useCarouselGlide` does NOT consume `useFlipGlide` (spec §8) — the `pencil ↛ games` boundary (a soul gate) wins; the inline pencil-local track glide stays. Correct trade, disclosed.

## Ratify-me sheaf (compile into the ballot, x4 §12)

1. **Wordmark opens the gallery; retire the dropdown** — DONE (default yes). `useGameMenu.ts` deleted, `logo-light` golden byte-for-π, knip clean.
2. **Mid-game guard ribbon** — DONE (default light-guard on dirty+different). Reuses WU's `isDirty`; ribbon not modal. KISS fallback = never-ask (one gate flip in `attemptSelect`).
3. **Snap chime visual-only, no audio** — CONFIRMED (no sound engine added).
4. **Card-step glide ~440ms** — DONE, `MOTION.cardStepMs=440`, RATIFY-ME annotated; trace monotone/zero-overshoot.
5. **[V-raised] The live-center-face / hidden-seam / the deal** — the marquee "board IS a card among cards, marks preserved" is approximated (poster+cut). Owner call: ship the approximation (pristine-faithful) now + schedule the live-slot build, or hold W12 for it.

---

## V3 — completion verdict (independent verification of C2's live-face choreography)

**VERDICT: PASS.** C2's three disclosed Wave-C deviations are now SPEC-TRUE under my own
measurement, and every covenant/soul/named-risk gate stays green. Trust-nothing re-measured on my
OWN `npx vite build` dist (W13's rust prebuild skipped, plain vite build), self-served `vite preview`
on **:4986**; temp mirror config (`playwright.w12v3.config.ts`) + capture spec (`__w12v3_capture.spec.ts`)
DELETED after; `playwright-report/`/`test-results/` removed; goldens re-baselined NOTHING; `:4986` killed;
`:3000`/`:3001`/`:4985`(C2's) never touched. Base HEAD `38d3f223`. Captures at `captures/v3-*`.

### 1. THE FOLD — live marked center face, one board, undo survives (`captures/v3-1-liveface.json` + `v3-center-face.png`)

| claim | my measurement | verdict |
|---|---|---|
| center face IS the live marked board | mark a sudoku cell (blue user-ink `7`, stamped `data-v3mark`) → open → the stamped cell rode INTO `.live-face-fit`: `markedCellInFace true`, `markSurvivedToCenter true`, `liveSudokuCellsInFace 81`. **`v3-center-face.png`: the full 9×9 live board at center, the blue `7` legible** | **GREEN** |
| ONE board instance in the DOM | `peekHostCount 1`; flank card `#gallery-card-1`: `flankHasLiveBoard false`, `flankHasInputs false`, `flankHasPoster true` (a poster, never a second board) | **GREEN** |
| Worker/undo state survives the round-trip | gallery → Esc(cancel) → `boardHome true`, `peekHostCount 1`, `markStillThere true`; then Undo: stamped cell `"7" → ""` (`undoWorked.before "7"`, `markCellValueAfterUndo ""`) — history depth preserved through the teleport | **GREEN** |

### 2. THE BEATS — chrome-leave, ≤1 raster fold, self-removing deal (`v3-3-entry-trace.json`, `v3-2-idle-deal.json`)

| beat | my measurement | verdict |
|---|---|---|
| BEAT 0 chrome-leave present | `chromeLeaveSeen true` (my rAF sampler caught `html.gallery-leaving` in the entry window) | **GREEN** |
| BEAT 1 fold, ≤1 board raster (transform-only) | `distinctLayoutWidths [640]`, `layoutLandedOnce true` (130 samples) — the board's LAYOUT width is CONSTANT through the fold; scale `1 → 0.475`, `maxUpwardScaleStep 0` (monotone, zero overshoot, glass curve). The crit kill holds under my trace | **GREEN** |
| BEAT 2 the deal fires once + self-removes | `dealChannelRunningAfterSettle 0` (the `.game-card-deal` channel is empty after settle — no steady-state subscriber); flank `0/0` running + `0` mutations/750ms | **GREEN** |
| EXIT guard gates dirty+different first | `gallery-guard.spec` 6/6 vs my dist: dirty+different arms the ribbon (Leave abandons+switches / Keep dismisses); pristine+different & same-game switch free — the guard intercepts BEFORE the seam | **GREEN** |

### 3. THE SOUL GATES — re-measured

| gate | my measurement | verdict |
|---|---|---|
| idle gallery flanks 0 paints/s, center on the one beat | `v3-2`: flank `flankRunningStart/End 0/0`, `flankMutations750ms 0`; whole-gallery running anims `8` = `centerRunning 8`, `nonCenterRunningAfterSettle 0` — ONLY the one live center board boils, the flank paints nothing | **GREEN** |
| PRM 0 tween frames + projection off | `v3-4-prm.json`: `maxGalleryRunningAnims 0`, `liveBoardProjectedIntoDeck false`, `galleryLeavingActive false`, `galleryPresent true` — the entry collapses to the same-frame poster grid, the animated board never parents under the deck | **GREEN** |
| `drawer.spec` UNEDITED green + darwin goldens 4/4 byte-π | `git diff drawer.spec.ts` = 0 lines (unedited); it runs green inside the default suite; `test:golden` 4/4 pass + `check-golden-bytes.mjs` PASS; `git status e2e/goldens/` empty (zero re-baseline) | **GREEN** |
| pencil ↛ games | `grep -E "^\s*import .* from '@games\|.*games/'" src/pencil/**` → ZERO real imports (the two hits are COMMENTS naming the boundary); `eslint .` exit 0 — the live-face crosses as an emitted DOM element + numeric props, no games import smuggled into pencil via the slot projection | **GREEN** |

### 4. THE SUITES — my run (all vs my :4986 dist)

| gate | result |
|---|---|
| `vue-tsc -b --force` | exit **0** |
| `eslint .` | exit **0** |
| `knip` | exit **0** |
| `prettier --check src/` | exit **0** |
| `vitest run` | **307 passed / 29 files** |
| `npx vite build` | exit **0** (wasm from node_modules; W13's rust prebuild skipped) |
| default e2e (`:4986`, temp mirror config, webServer stripped) | **77 passed** (63 default incl. the truth-recut `visual-regression` + 8 gallery + 6 gallery-guard) — zero flake this run |
| darwin goldens (`:4986`, `test:golden`) | **4/4 byte-for-π**, zero re-baseline |
| WU seams | undo through the gallery round-trip preserved (§1); guard dirty two-tap (Leave/Keep) live in `gallery-guard` 6/6 |

**visual-regression.spec.ts:456 truth-recut — verified vs the SHIPPED blob.** Behavioral diff (quote/reflow
normalized): the ONLY semantic change is `expect(p.src).toMatch(/^data:image\/png/)` → `/^blob:/` (+ its
explaining comment). `src/pencil/composables/rasterPose.ts` bakes poses via `URL.createObjectURL(await …toBlob())`
(a `blob:` handle, never `data:image/png`) — the recut matches the shipped T4-WM bake; behavior and nothing else
changed in that spec. Passes green.

### 5. Cross-wave hygiene (git diff scoped)

- Tracked `web/frontend/**` diff touches only W12 files (App/GameScene/scene.css/pencilConfig/HandDrawnOutline/registry/… + the recut). The `csp-solver/**` + `wasm/src/lib.rs` diffs are rust — W13's, not a frontend lane's.
- `registry.ts` `GAMES[] = [sudokuCard, futoshikiCard]` — NO thermo/kenken/killer rows added by C2; additive/mergeable for W13's final lane. C2 touched no `games/{thermo,kenken,killer}/` (those stay W13's untracked dirs).

### The three deviations — closed under my measurement

The c-fold record's three §choreography gaps V flagged are now BUILT, not approximated: (1) the **live center
face** — one board, reparented via Teleport, the blue-ink `7` legible at center, state surviving the round-trip;
(2) the **deal** — finite, self-removing, zero steady-state flank cost; (3) **beat 0 chrome-leave** — a discrete
band my sampler caught. `useCarouselGlide` still does NOT consume `useFlipGlide` (spec §8) — the `pencil ↛ games`
soul gate wins, exactly as disclosed, and eslint confirms the boundary held through the slot projection. Every
covenant/soul/named-risk gate is green under my own measurement. **PASS.**
