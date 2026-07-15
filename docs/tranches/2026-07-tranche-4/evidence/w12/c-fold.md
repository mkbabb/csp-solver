# T4-W12 · Wave C — the board⇄card transform (THE WAVE'S NAMED RISK)

Base HEAD `38d3f223` (T4-W11 sealed), atop Wave A (registry card face + posters) + Wave B
(the static carousel shell) — both in tree. Port 4787. Spec §choreography + §sub-wave C.
The named risk: extract `useFlipGlide` from the drawer's mover engine as a NO-behavior-change
refactor, PROVE the drawer byte-for-π, THEN build the fold on the same proven primitive.

## Footprint (1 new + 3 edits — additive, mergeable)

```
?? src/games/shared/useFlipGlide.ts        the FLIP-on-WAAPI mover engine, EXTRACTED from     NEW  ← the named risk
                                           useControlsDrawer (:156-318). One glass curve, one
                                           clock, composite:replace/fill:none, anim.reverse()
                                           retarget, and THE CRIT KILL (flipTransform: the
                                           filtered box's LAYOUT size is never tweened) live HERE.
 M src/games/shared/useControlsDrawer.ts   rewired onto useFlipGlide — the drawer keeps its DOMAIN
                                           (which elements, their FLIP deltas, onSettle side-effects);
                                           the MECHANICS moved out. NET −47 lines (72+/119−).
 M src/App.vue                             owns the board⇄card FLIP orchestration (§8) on the SAME
                                           primitive: enterGallery fold + unfoldToBoard exit; PRM→cut.
 M src/pencil/config/pencilConfig.ts       + MOTION.boardFoldMs (520) — the board-fold band, lands IN
                                           pencilConfig per the covenant (no timing const outside it).
```

No `csp-solver/**` / W13-dir edits. `games/registry.ts`, `GameGallery.vue`, `GameCard.vue`,
`useCarouselGlide.ts`, `useGameGallery.ts` UNTOUCHED — the fold is layered OVER Wave B, not into it.

---

## Step 1 — the extraction (the named risk), PROVEN FIRST

`useFlipGlide(options)` is the drawer's glide engine, verbatim, as a module-safe factory
(no lifecycle hooks — the drawer is a module singleton). It owns the animation MECHANICS; the
caller owns WHICH elements move and the settle side-effects (`onSettle`):

- **`run(movers)`** — one WAAPI animation per mover, explicit `[from,to]` keyframes,
  `composite:replace`/`fill:none`, ALL pinned to `document.timeline.currentTime` (one clock,
  zero stagger, no pending-start dead frame); wires `finished → settle` + the never-never guard.
- **`reverse()`** — mid-glide retarget by `anim.reverse()` (velocity-plausible, zero new keyframes).
- **`settle()`** — cancel + clear inline origins + bump the generation token, then `onSettle`.
- **`flipTransform(first, last)`** — THE CRIT KILL: `translate(centerΔ) scale(first.w/last.w)`.
  The element's LAYOUT rests at its FINAL size; the transform scales it to look like FIRST, so it
  rasters ONCE and only the transform channel tweens. **Byte-identical to the drawer's old host
  string.**

The drawer's `glide()` now reads its rects, lands the layout ONCE, builds a `FlipMover[]` (host via
`flipTransform`; rail/tab/masthead keep their bespoke strings byte-for-byte), and calls
`glideCtl.run(specs)`. `settleNow()` stays a thin hoisted delegator so the disposer's earlier
closure keeps its call site; `retarget()` → `glideCtl.reverse()`; the domain settle (demote layers,
`applyLayout(targetOpen)`, land idle, focus panel) is the `onSettle` closure.

### THE PROOF (the risk row — the gallery did not build until this was green)

| gate | result |
|---|---|
| `drawer.spec` (6 specs), **UNEDITED**, vs my dist | **6/6 passed** — incl. spec 2's mid-glide assertion: four movers (sheet/case/tab/masthead), ALL on `cubic-bezier(0.32,0.72,0,1)`, ONE clock (`easings.length===4`), layout ONCE at onset, railL monotone-in + zero-overshoot, board grows ≥24px + centers |
| darwin goldens (4), vs my dist | **4/4 byte-for-π** — cell-light, grid-corner-light, logo-light, toggle-crest-dark (the settled surfaces are pixel-untouched — the extraction changes only glide mechanics) |
| `vue-tsc -b --force` · `eslint` (both files) | exit **0** · clean |

The distillation win the spec predicted: the drawer shed **47 lines**, one clock discipline, and
the crit kill now lives in ONE place both consumers read.

---

## Step 2 — the board⇄card fold, on the proven primitive

App owns the orchestration (§8). The seam that keeps it ADDITIVE + non-breaking: **every
view/URL/game state transition fires SYNCHRONOUSLY, byte-for-byte as Wave B** (open/select/cancel +
setGame); the FLIP is layered as a **purely-visual overlay** on the already-correct DOM. So a
missing rect or PRM degrades to Wave B's same-frame cut, and no assertion on state/visibility can
see mid-glide pixels — hence 71/71 e2e + the 8 gallery specs stay green untouched.

- **ENTRY (`g` / open):** read `.board-peek-host` FIRST rect (the board's full pose) → `openGallery`
  (view flips, board `v-show`-hidden) → in **`nextTick` (the pre-paint microtask, so the board pose
  is on-screen from frame ONE — no rest flash)** read the center card's LAST rect and
  `foldCtl.run` it from `flipTransform(board, card)` → identity. The center card scales DOWN from
  the board's full pose to its slot on the glass curve @520ms.
- **EXIT (select / cancel):** read the chosen card's rect BEFORE the gallery unmounts, apply state
  (select + setGame cut — the game swap is the seam, under the still-small card), then FLIP the
  freshly-mounted `.board-peek-host` UP from that card pose to full. Reciprocal, ONE engine.
- **PRM:** the fold never runs — Wave B's same-frame cut is the PRM branch, both directions.

### DELTA / π (captures/ · self-served :4787, never :3001)

| Claim | Result |
|---|---|
| **Entry fold ≤1 board raster + monotone glass curve** | `c-entry-paint-trace.json`: center-card scale **1.884 → 1.000, monotone (maxUpwardStep 0.0000), zero overshoot, peak at frame 0** (no rest-pose flash); the board's `offsetWidth` = **0 for the whole fold** (`distinctBoardStates:[0]` — the board cut OUT of the render tree, **0 board rasters**; the CARD's transform carries the entire throw). Settle: 0 running fold anims. |
| Entry filmstrip (π) | `c-entry-filmstrip-{0..4}.png` + `c-entry-settled.png` — the board-pose card shrinking to its slot |
| **Exit unfold monotone** | `c-exit-unfold-trace.json`: board scale **0.540 → 1.000, monotone up (maxDownwardStep 0.0000), no overshoot** |
| **PRM cut (0 tween frames)** | `c-prm-entry-trace.json`: `runningAnims:0`, gallery present same-frame → PASS; `c-prm-entry.png` |

### HONEST deviations from the spec's §choreography (for the ballot / a follow-up build lane)

The fold is a REAL FLIP on the proven primitive, PRM-safe, crit-kill-clean — but three beats are
approximated, not built, to keep the change additive over Wave B's pencil-pure gallery (rearchitecting
it risked the soul-gate `gallery.spec` "only the centered card boils" test):

1. **Live-board-as-center-face / "one live board" / the hidden seam** — NOT built. The spec wants the
   center card's face to BECOME the live board (marks preserved) and the board-peek-host itself to be
   the FLIP mover, with the game swap redrawing *under* the small card. My design instead animates the
   center **card** (Wave B's poster) and **cuts** the board to hidden — so the center face stays the
   poster and the swap is `setGame`'s cut, not a FLIP-covered redraw. Visually faithful for a pristine
   board (poster ≈ board); a marked board loses its marks at the center during the gallery. **This needs
   the GameGallery live-center-slot rearchitecture (a `#center-face` slot filled from App.vue, the board
   relocated via Teleport with instance persistence) + browser iteration — a Fable build lane.**
2. **Beat 2 "the deal"** (flanks draw IN via `DRAW_IN_PRESETS.gridFrame` one-shot `sequence`
   subscribers, staggered outward) — NOT built; the flanks appear with Wave B's card mount. The
   `createSequenceSubscription` seam is identified (`DifficultyTally.vue:131` is the pattern).
3. **Beat 0 "chrome leaves"** (the 200ms `scene-leaving` fade) — folded into the cut; not a discrete beat.

The engine + the fold/unfold motion + the crit kill + PRM are done and proven; the above are the
delta rows for ratify/Wave-D.

---

## Covenant + soul gates

- **No second animation brain** — the fold rides the EXTRACTED drawer engine (`useFlipGlide`); no
  keyframes.js, no new tween lib. One glass curve (`MOTION.curves.drawerGlide`), one clock.
- **The crit kill** — `flipTransform`; the board's layout size is never tweened (proven: 0 board
  rasters on entry; a transform-only scale on exit).
- **One live board** — the board stays MOUNTED (`v-show`) across open/cancel; the fold never mounts a
  second scene. (The center face is the poster in this cut, not a second live board — see deviation 1.)
- **No router / modal / audio** — `?view` via `replaceState` (Wave B); Esc cancels; no sound.
- **pencil ↛ games (eslint)** — `useFlipGlide` lives in `games/shared`, so the drawer + **App.vue**
  (the app shell) consume it; **pencil's `useCarouselGlide` does NOT** — importing `games/shared` from
  `pencil/**` would RED the boundary. The spec §8's "useCarouselGlide uses useFlipGlide" is therefore
  NOT done: the boundary (a soul gate) wins, and Wave B's inline track glide (same rules, pencil-local)
  stays. Noted for the ledger.
- **Timing** — the fold band `MOTION.boardFoldMs = 520` lands IN pencilConfig (no App-local literal).

## Battery (all vs YOUR dist / clean tree)

| gate | result |
|---|---|
| `vue-tsc -b --force` | exit **0** |
| `test:unit` | **290 passed / 25 files** (Wave-B baseline UNEDITED — the fold adds no unit surface) |
| `lint:eslint` | exit **0** (`pencil/** ↛ games/**` holds; `useFlipGlide` is a games/shared consumer) |
| `lint:knip` | exit **0** |
| `prettier --check src/` | exit **0** |
| `build` | exit **0** (wasm current @12:19; `vue-tsc -b && vite build`) |
| default e2e (`:4787`, temp `playwright.w12c.config.ts`, webServer stripped) | **71 passed** (63 default + 8 gallery, all UNEDITED) |
| darwin goldens (`:4787`) | **4/4 byte-for-π** (twice — post-extraction, then post-fold) |

Temp `playwright.w12c.config.ts` + `__w12c_fold_capture.spec.ts` deleted; `test-results/` removed;
`:4787` preview killed; `:3000` (owner's) + `:3001` never touched; goldens re-baselined NOTHING.
No commit (team lead commits).

## Design pass (Fable · DesignSync invoked)

`DesignSync.list_projects` → `[]` (no design-system project to sync to — same as A/B; the sync path
is inapplicable). The pass ran as a rendered visual review on the self-served preview: the board-pose
center card shrinking to its slot on the glass curve (the filmstrip), the reciprocal board grow on exit
(trace), the PRM same-frame cut. Both themes inherited from Wave B (the fold is a transform overlay —
theme-agnostic); coarse+fine identical (no hover in the fold); PRM cut.

## For downstream (Wave D / a Fable fold-build lane)

- The proven `useFlipGlide` is the engine for D's `useCarouselGlide` refactor ONLY IF that composable
  moves out of `pencil/**` (else the boundary reds it) — otherwise leave it inline.
- Deviations 1–3 above are the remaining §choreography build: the live-center-slot + Teleport, the
  `sequence`-subscriber deal, the discrete chrome-leave beat.
- `MOTION.boardFoldMs` (520) is the fold band; `MOTION.cardStepMs` (440, Wave B) the nav step.
