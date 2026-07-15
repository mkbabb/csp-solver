# T4-W12 · Lane C2 — the live center face (Wave C's three deviations, driven to spec)

Base HEAD `38d3f223` (T4-W11 sealed), atop Waves A–D + V (all in tree). Port **4985** (self-served
`vite preview` over my own `npx vite build` dist — W13's in-flight rust prebuild skipped, exactly as
Wave D). `:3000`/`:3001`/`:4885` (W13's) never touched. Temp mirror config `playwright.w12c2.config.ts`
+ `__w12c2_capture.spec.ts` deleted after; `playwright-report/` (gitignored) removed; goldens
re-baselined NOTHING. This lane closes the c-fold record's three disclosed §choreography deviations
WITHOUT disturbing the green covenant/soul gates.

## Footprint (1 new + 7 edits — additive, mergeable; ZERO W13 footprint)

```
?? src/games/shared/useLiveFace.ts            the live-face bridge singleton (faceTarget ref)    NEW
 M src/games/shared/GameScene.vue             .board-peek-host wrapped in <Teleport :to=faceTarget>
                                              (+ .in-live-face pose) — the board REPARENTS into the face
 M src/pencil/chrome/GameGallery/GameCard.vue :live face-slot vs poster; @face-mount(el); the deal entrance
 M src/pencil/chrome/GameGallery/GameGallery.vue liveIndex + isLive; the DEAL sequence; @live-face relay
 M src/App.vue                                onLiveFace (teleport + fit + fold); beat-0 chrome-leave; the seam
 M src/games/shared/scene.css                 html.gallery-leaving — beat 0 (chrome fades, board holds)
 M src/pencil/config/pencilConfig.ts          + MOTION.chromeLeaveMs (200) — beat-0 band, IN pencilConfig
 M e2e/visual-regression.spec.ts:456          the TRUTH-RECUT (stale data:image/png → blob:)
```

`registry.ts` GAMES[] = `[sudokuCard, futoshikiCard]` — READ only, no rows added. No `csp-solver/**`,
no `games/{thermo,kenken,killer}/`, no `useFlipGlide.ts`/`useControlsDrawer.ts`/`useCarouselGlide.ts`/
`useGameGallery.ts` edits (the drawer byte-π stays untouched; the fold rides the extracted engine as-is).

---

## The architecture — ONE instance, reparented; the boundary held

The spec wants the center card's face to BE the live board (marks preserved), not a poster + a cut.
The board is a big filtered grid with a Worker, solve state, and user marks — it must not re-mount.

- **`GameScene` wraps `.board-peek-host` in `<Teleport :to="faceTarget" :disabled="!faceTarget">`.**
  Teleport moves DOM, not vnodes — the component instance never re-mounts, so the Worker/state/marks
  survive the relocation. Disabled (faceTarget null) it renders in place → the playing view, the
  drawer, and every golden see byte-identical home DOM (a disabled Teleport is a strict no-op).
- **`useLiveFace` is the bridge singleton** (the `useDirtyBoard`/`registerDrawerScene` pattern): App
  sets `faceTarget`, `GameScene` consumes it. One scene mounts at a time → one `.board-peek-host` →
  one Teleport → ONE live board on the page, ever.
- **The boundary (pencil ↛ games) holds.** The teleport target is a bare `.live-face-fit` `<div>` the
  gallery card renders and emits UP as a DOM element (`@face-mount` → `@live-face`); App teleports the
  board's subtree into it. Pencil imports nothing from games — the projected CONTENT belongs to App's
  context, the gallery only positions the slot. `eslint .` exit 0.
- **The fit is a COMPOSITOR scale.** `.live-face-fit` carries `scale(--live-fit)` (App measures
  `faceW/boardW` post-teleport, pre-paint), so a full board shrinks into the face box while its LAYOUT
  size never changes — the board keeps its playing-view raster and only travels. This is the crit kill,
  extended: the board's layout size is never tweened.
- **`isLive(i)` = the current game's card AND centered AND non-PRM.** Navigating to a different game
  reverts the card to its static poster (only one live board; a flank is always a poster). Under PRM
  the projection is OFF — the entry collapses to Wave B's same-frame poster grid, and no in-board
  animation is ever parented under the gallery (the reason test 7 stays green — below).

---

## The four beats — driven to spec

1. **§ENTRY live-face + BEAT 1 (the fold).** `onLiveFace` teleports the board into the face, fits it,
   and folds it: `flipTransform(fullPose, faceSlot)` makes the (now face-sized) board LOOK full at its
   old position, then it glides to identity on the ONE glass curve — only the transform channel tweens.
2. **BEAT 0 (chrome leaves).** Entry adds `html.gallery-leaving` for `MOTION.chromeLeaveMs` (200ms):
   the controls/drawer fade on the EXISTING scene-leaving fade while the **board HOLDS — it never
   erases** — THEN `openGallery` mounts the deck and the fold begins.
3. **BEAT 2 (the deal).** On an interactive entry the flanks draw IN — one-shot `createSequenceSubscription`
   subscribers (`DRAW_IN_PRESETS.gridFrame`), staggered outward from center, `dealReveal` 0→1 mapped to a
   compositor opacity + lift on the card's own `.game-card-deal` channel. Finite, self-removing, zero
   steady-state cost. The center card folds (never deals); deep-link/PRM land settled.
4. **§EXIT the hidden seam.** A different-game select parks the board home, then `setGame({cut})` swaps
   the game/scene refs while the board is small (the page-turn seam, under the paper); the new board
   FLIPs UP from the small card pose to full. Same-game select = a pure unfold, no seam. **Wave D's
   guard ribbon still gates dirty+different BEFORE the seam** (unchanged).
5. **PRM** collapses every beat to the same-frame cut (no chrome-leave, no fold, no deal, no projection).

---

## DELTA / π (captures/ · self-served :4985)

| Claim | Result |
|---|---|
| **≤1 board raster through the full entry** (the board now TRAVELS) | `c2-entry-crit-kill.json`: `distinctLayoutWidths [640]`, `layoutLandedOnce true` (111 samples) — the board's LAYOUT width is CONSTANT through the fold; the fit + fold are transforms. Scale `1.000 → 0.475`, `maxUpwardStep 0` (monotone, zero overshoot, glass curve). **The crit kill holds: transform-only, layout landed once.** |
| **Marks visible at center** (the V-flagged gap) | `c2-marks-at-center.png` — the center card's face IS the live board, the typed `7` in blue user-ink legible; `markSurvivedToCenter true`. `c2-settled-gallery.png`: center = live board (full-scale, boiling frame), flank = static futoshiki poster (scale 0.9, dim, frozen). |
| **Soul gate holds with a live center** | `c2-idle-flank-paints.json`: flank active pose `0 → 0` over 750ms (`flankFrozen true`), `flankRunningAnimations 0`. Center boils (allowed, the one live surface); the flank paints nothing. |
| **BEAT 0 — chrome leaves, board holds** | `c2-beat0.json`: `hookOn true`, controls opacity `1 → 0` (`controlsFaded true`), `boardErasing false`, `boardGridPresent true`, `galleryYet false`, `hookClearedAfterOpen true`. `c2-beat0-chrome-leaving.png` — board intact, controls faded. |
| **BEAT 2 — the deal** | `c2-deal.json`: flank opacity `0 → (min 0) → 1` (`roseFromHidden true`). `c2-entry-{0,130,260,390,520,700}.png` — the fold + the flank dealing in. |
| **§EXIT the hidden seam** | `c2-seam.json`: `landedGame futoshiki`, `galleryGone true`. `c2-seam-guard.png` (guard BEFORE the seam) → `c2-seam-{40,160,320,520}.png` → `c2-seam-settled.png` (the full futoshiki scene). Dirty+different: guard gates first, Leave → the swap under the small card → unfold. |

## The named risk / covenant gates — UNDISTURBED

| gate | result |
|---|---|
| `gallery.spec` + `gallery-guard.spec` (14), **UNEDITED**, vs my dist | **14/14 passed** — incl. §6 soul gate (`#gallery-card-0 .boil-pose.is-active` count 1: the live board's grid uses `.boil-frame-layer`, never `.boil-pose`, and carries no `HandDrawnOutline`, so the frame count is untouched) and §7 PRM cut (0 gallery animations — the PRM projection-off keeps the animated board out of the deck) |
| `drawer.spec` (in the default suite) + darwin goldens (4) | **green · 4/4 byte-for-π** — `useFlipGlide`/`useControlsDrawer` untouched; the fold reuses the extracted engine; the playing view (Teleport disabled) is byte-identical, so the settled goldens are pixel-untouched |
| **TRUTH-RECUT** `visual-regression.spec.ts:456` | now asserts `/^blob:/` (was `/^data:image\/png/`) — matches the SHIPPED T4-WM `rasterPose.ts` object-URL bake; the file passes green (was V's flagged latent pre-existing red) |

## Battery (all vs YOUR dist / clean tree · :4985)

| gate | result |
|---|---|
| `vue-tsc -b --force` | exit **0** |
| `eslint .` | exit **0** (`pencil/** ↛ games/**` holds — the live-face crosses as an emitted DOM element + numeric props; `useLiveFace` is a games/shared consumer read by App + GameScene) |
| `knip` | exit **0** |
| `prettier --check src/` | exit **0** |
| `vitest run` | **307 passed / 29 files** (Wave-D baseline UNEDITED — the fold adds no unit surface) |
| `npx vite build` | exit **0** (wasm from node_modules; W13's rust prebuild skipped) |
| default e2e (`:4985`, temp mirror config, webServer stripped) | **77 passed** (63 default incl. the truth-recut visual-regression + 8 gallery + 6 gallery-guard) |
| darwin goldens (`:4985`) | **4/4 byte-for-π**, zero re-baseline |

## Design pass (Fable · DesignSync invoked)

`DesignSync.list_projects` → `[]` (no design-system project to sync to — same as Waves A–D; the sync
path is inapplicable). The pass ran as a rendered visual review on the self-served :4985 preview: the
marked sudoku board folding into the center card with its blue user mark legible, the futoshiki flank
dealing in, the depth (center full/boiling, flank scale-0.9/dim/frozen-poster), the beat-0 controls fade
with the board holding, and the different-game seam (guard → swap-under-small-card → full futoshiki).
Both themes inherit from Wave B (the fold is a transform overlay); PRM lands the static poster grid.

## For the ledger

- The c-fold record's three deviations are now BUILT, not approximated: (1) the live center face via
  Teleport (marks preserved, one instance), (2) the deal via `sequence` subscribers, (3) beat 0 a
  discrete 200ms chrome-leave. The spec §8 "`useCarouselGlide` consumes `useFlipGlide`" remains NOT
  done by design — the `pencil ↛ games` boundary (a soul gate) wins, exactly as c-fold disclosed.
- PRM shows the static poster grid (no live projection) — a deliberate reduced-motion degradation that
  keeps the animated board out of the deck (test 7's "0 gallery animations" invariant). The
  marks-visible/fold gates are the non-PRM path (the fold is a non-PRM beat by construction).
- No commit (team lead commits).
