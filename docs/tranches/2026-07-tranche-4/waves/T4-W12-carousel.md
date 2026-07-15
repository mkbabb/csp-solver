# T4-W12 — The carousel (a sketchbook, not a store)

**The board folds into a card among cards — the game-select screen becomes a spread of paper worksheets dealt onto a desk, and a third game is a data row, not a code fork.** The choreography is not new grammar: it is the fusion of two house grammars already shipped — the drawer's classic-FLIP-on-WAAPI glass glide (the board *scales into a card*) and the page-turn's `sequence`/draw-in beats (the sibling cards *deal onto the desk*, the game seam hides under the folded card). The one genuinely new architecture is a **game registry** — and the app must clear that bar anyway for a third game. Everything downstream reads the registry, so game #3 is a `GameCard` row, nothing else. The card contract **consumes W11's `defineGame`** — the carousel does not re-declare game identity, it reads the contract W11 minted. Owner test, verbatim: *this must feel like leafing through a sketchbook, not a store.*

**Dependencies**: ← W11 (the card contract consumes `defineGame`; the registry is W11's `games/registry.ts`, the carousel reads it, never re-literals `GameId`), ← W2 (the golden + paint-trace runner every choreography beat's π/DELTA cites). Parallel to W13 on the `W11 → {W12, W13}` arm. Feeds W14 (the retired dropdown + the new gallery surface are documented there). **Effort**: L. **Fable** — frontend-design skill invoked; every capture on a **self-served preview port, never the owner's :3001** (hard rule).

---

## The house ledger this wave is bound by (x4 §1, studied at anchor)

Two grammars are load-bearing; the carousel reuses both rather than inventing a third.

- **Grammar A — the page-turn** (`App.vue:52-126`, `games/shared/scene.css:115-143`): a game switch is *erase → seam → draw-in*, all on the ONE pencil-boil rAF chain as one-shot `sequence` subscribers. Two refs split intent from paint: `game` (selected, truthful at click) vs `scene` (mounted, flips at the seam, `App.vue:68-71`). The **seam** (`App.vue:106-114`) is where the `v-if` flips — the paper never changes, only the ink swaps. **The covenant** (`App.vue:60-67`): no second animation brain; re-adopting keyframes.js is a rejected capability-gap fix.
- **Grammar B — the drawer glide** (`games/shared/useControlsDrawer.ts:156-298`, `scene.css:29-87`): classic FLIP on WAAPI on ONE glass curve `cubic-bezier(0.32, 0.72, 0, 1)` @520ms (`pencilConfig.ts` `MOTION.curves.drawerGlide`), one clock (all movers pinned to one `startTime`, `:267-268`), zero stagger. **The crit kill, kept** (`:222-228`): the filtered board's *layout size* is never tweened — it transform-`scale()`s (`hostScale = firstH.width / lastH.width`); exactly one raster per gesture. Mid-glide re-click retargets via `anim.reverse()` (`:300-313`).
- **The idle-paint soul gate** (`pencil/composables/boilBeat.ts`, `pencilConfig.ts`): every perpetual boil derives its frame from ONE shared beat counter via `useBeatFrame(count, beatsPer)`, ref-counted, PRM-frozen, tab-parked. **Any card that boils MUST enrol through this beat; off-center cards MUST enrol nothing (frozen on pose 0)** — else the gallery re-introduces the N-sparse-writers disease T3 eliminated. This is the sharpest acceptance gate.
- **The architecture boundary** (`App.vue:11-16`): pencil never imports games; the id + option list arrive as props, the choice returns via `@select`. `GameGallery.vue` takes `GameCard[]` and emits `@select`; it imports nothing from `games/**` (eslint-enforced).
- **No router**: URL truth is `?game=` via `history.replaceState` (`App.vue:80-88`); zero `vue-router`. The gallery is a **view over the same app**, not a route.

---

## The game-agnostic card contract — over W11's `defineGame` (x4 §4)

Today games are hardcoded: `App.vue:35-39` literals `gameOptions` and `type GameId = 'sudoku' | 'futoshiki'`; per-game `v-if`; futoshiki lazy, sudoku eager. W11 already replaced that literal with `defineGame` + `games/registry.ts`. This wave adds the **card face** of the same registry — `GameCard` is derived from the `defineGame` entry, not a parallel declaration:

```ts
// games/registry.ts (W11's file) — the card contract extends the game contract, one source
export interface GameCard {
  id: string                                  // URL token + stable id; drives ?game=, aria, keys
  name: string                                // lowercase wordmark register; rendered as live <text>
  glyph?: Component                           // optional bespoke name glyph; absent → wordmark <text>
  range: { label: string; levels: string[] } // sub-label: difficulty/size, per game's own vocabulary
  poster: () => Promise<Component>            // static, non-interactive, boil-alive poster of the game
  scene: () => Promise<Component>             // the playable scene loader (defineGame's mount target)
  eager?: boolean                             // default game rides the main chunk (sudoku); others lazy
}
export const GAMES: readonly GameCard[] = [sudokuCard, futoshikiCard] // game #3 drops in HERE, nowhere else
```

**The drop-in contract:** a third game is complete when it (1) pushes one `GameCard` to `GAMES`, (2) ships a `poster` (a static mini-board — the board renderer read-only with a canned givens snapshot), (3) ships a `scene` loader. **No edit to `App.vue`, `GameGallery.vue`, or any pencil file.** That invariant is Wave A's born-RED gate.

**Poster vs live face:** on the desk, the **center** card's face is the *live current board* (state preserved); **flanking** cards show their static `poster`. On select, the chosen game's `scene()` mounts for real. Only one live board on the page at any instant — the perf floor holds.

---

## The transform choreography — board ⇄ card among cards (x4 §5)

Built entirely from Grammar A + Grammar B; **no new animation brain** (the covenant).

### ENTRY — the live board folds INTO the center card (open gallery)

Trigger: the wordmark button (§ disposition) or keyboard `g`. Engine: the drawer's FLIP, generalized to a `useFlipGlide` primitive (the named risk, below).

1. **Beat 0 — chrome leaves.** The scene's controls/drawer fade out on the existing `scene-leaving` beat (`scene.css:122-134`, 200ms). The board does **not** erase — we fold it, not discard it (the one departure from the page-turn: no erase beat on entry).
2. **Beat 1 — the fold (FLIP).** Read FIRST rect of `.board-peek-host`; land the gallery layout class ONCE; read LAST rect = the board's slot as the center card face. `useFlipGlide` transform-`scale()`s + translates full pose → card-face pose on the glass curve @520ms, `composite:replace, fill:none`, one clock. **The board's layout size is never tweened** (the crit kill) — one raster. The center card's `HandDrawnOutline` frame is already drawn around it (the frame is the card, the board its face).
3. **Beat 2 — the deal.** Flanking cards (other games' posters) **draw IN** — `DRAW_IN_PRESETS.gridFrame` as one-shot `sequence` subscribers, staggered outward from center (±1, then ±2…). `backwards` fill (never `both`, per `controls-fade-in`, `scene.css:118-126`) so a finished card can't pin itself lit. Reads as dealing worksheets onto the desk.
4. **Beat 3 — settle.** Clear finished anims (no layout, no re-raster — drawer settle discipline). The center card snaps + takes focus + its boil wakes (one wobble bloom). `useGameGallery` writes `?view=gallery`. **Idle steady state: only the center card enrols the shared beat; flanks frozen pose-0.**

PRM: no fold, no deal — same-frame cut to the settled gallery grid (mirrors `App.vue:91-94`).

### EXIT — the chosen card unfolds back to a full board (select)

Reciprocal; the page-turn seam re-enters. Beat 0: non-chosen cards draw OUT / fade, staggered inward. **Beat 1 — the seam, hidden under the card:** if the chosen game differs from the one entered from, the swap happens *here* — the center card's face redraws for the new game (`scene` mounts, `game`/`scene` refs flip, `App.vue:106-114`) while it is still small and paper-framed. Invisible: paper unchanged, only the sketch on it changes. Beat 2: `useFlipGlide` maps card-face → full board pose (FLIP reversed). Beat 3: chrome returns (`controls-fade-in`); `?view` cleared, `?game=chosen` set. Selecting the **same** game = a pure unfold, no seam, no swap. Mid-glide reversal rides `anim.reverse()`.

---

## The carousel grammar — paper, boil-alive, glass glide, snap (x4 §6)

- **Cards** are `HandDrawnOutline`-framed paper sheets (`cartoon-shadow-md edge-outlined bg-card`, the app's card idiom). Face = `poster` (flank) or live board (center). Below: the name (wordmark `<text>`) + `range.label` sub-line (`Patrick Hand` register).
- **Depth without paint:** center card full scale/boil; flanks `scale(~0.9)`, `opacity ~0.62`, **frozen pose 0** (zero beat enrolment). Depth is a static transform, not an animation.
- **The per-snap "chime" (visual):** on snap settle, the newly-centered card plays ONE `hoverWiggleDuration` (600ms) wobble bloom + draws its `scribbleUnderline` under the name. One-shot `sequence`, not perpetual — the Wii chime, in graphite. **No audio** (the app has no sound engine; adding one is scope creep + an a11y burden).
- **Navigation glide:** programmatic steps animate the track transform via `useCarouselGlide` (the `useFlipGlide` engine) on the glass curve, one clock, monotone, **zero overshoot** (the spring is dead here too). Card-step band ~440ms (auditioned by eye at the local preview).
- **Snap points:** `scroll-snap-type: x mandatory` for touch/trackpad inertia; keyboard/button steps set the transform via WAAPI then let snap pin at settle (CSS `scroll-behavior` can't take the custom curve — same reason the drawer is WAAPI not CSS transition).
- **Progress tell:** a row of hand-drawn **page pips** (graphite dots, the snapped one inked solid) beneath — the sketchbook page-number, doubling as the mobile position indicator.

---

## Entry/exit state machine — URL truth + the mid-game guard (x4 §7)

`games/shared/useGameGallery.ts` — a module-level singleton (the `useControlsDrawer` pattern).

```
view: 'playing' | 'gallery'   (default 'playing')
snappedIndex: number          (centered card)
enteredFrom: GameCard.id       (the fold-from / cancel target)
openGallery()  playing → gallery   (§ENTRY fold; snappedIndex = current game)
snapTo(i)      gallery              (glide; updates aria-activedescendant + live region)
select(id)     gallery → playing   (§EXIT unfold; ?game=id if changed, else pure unfold; GUARD below)
cancel()       gallery → playing   (unfold back to enteredFrom, no swap; Esc)
```

**URL:** `?view=gallery` added on open, cleared on select/cancel; `?game=` on a changed select (`replaceState`, `App.vue:80-88`). Deep-link to `?view=gallery` lands in the carousel (parse at boot like `parseGame`, `App.vue:40-44`). No router.

**The mid-game guard** (owner's explicit question: *abandoning a half-solved board asks?*). Today the app strips `?board=`/marks on any switch with **zero** guard (`App.vue:86-87`) — silent loss. Idiomatic default: same game → no guard; a **different** game while the board is **dirty** (`overriddenCells` non-empty or a solve in flight) → a **light pencil-note ribbon** slides from the chosen card (*"leave this puzzle? your marks aren't saved"* — keep / leave). **NOT a blocking `confirm()`, NOT a modal** (owner banned modals, T3-8b). A **pristine** board switches freely. This adds friction the app doesn't have today — a **ratify-me default**; the KISS fallback is never-ask (the share `?board=` permalink is the recovery).

---

## Component / state architecture (x4 §8) — additive except two edits

```
games/registry.ts (W11)                    GameCard face over defineGame — game #3 drops in here     EXTEND
games/shared/useGameGallery.ts             the state-machine singleton                                NEW
games/shared/useFlipGlide.ts               the FLIP-on-WAAPI primitive, EXTRACTED from                NEW  ← the named risk
                                           useControlsDrawer's mover engine (:156-313); the drawer
                                           AND the gallery entry ride ONE proven engine
pencil/chrome/GameGallery/GameGallery.vue  the carousel shell — props GameCard[]; emits @select       NEW
                                           (imports NOTHING from games/**)
pencil/chrome/GameGallery/GameCard.vue     one paper card: HandDrawnOutline + <slot> face + name +    NEW
                                           range sub-line + boil-alive (beat only when snapped)
pencil/chrome/GameGallery/useCarouselGlide.ts  track glide (uses useFlipGlide) + scroll-snap          NEW
games/{sudoku,futoshiki}/*Poster.vue       each game's static poster face (read-only mini board)      NEW ×2
App.vue                                     mount GameGallery when view==='gallery'; own the           EDIT
                                            board⇄card FLIP orchestration (reuses useFlipGlide)
HandwrittenLogo/useGameMenu.ts + listbox   RETIRE (superseded by the gallery)                          DELETE
```

**The distillation win (named risk):** extracting `useFlipGlide` collapses the drawer's bespoke mover engine and the gallery's entry transform into ONE primitive — fewer lines, one clock discipline, one place the crit "never tween filtered layout size" rule lives. **This is the wave's risk row:** the drawer is the four-times-owner-audited surface; the extraction must reproduce the drawer's glide byte-for-π (its e2e `drawer.spec` easing + goldens are unedited) *before* the gallery consumes the same primitive. Land the extraction as a no-behavior-change refactor of the drawer first (drawer goldens green), then build the gallery on it.

---

## Keyboard · touch · PRM · mobile 375 (x4 §10)

- **Keyboard** (listbox-over-carousel, APG-cited): DOM focus on the track container; `aria-activedescendant` points at the snapped card (dodges the board grid's roving-tabindex collision). `←/→` step · `Enter`/`Space` select · `Home`/`End` first/last · `Esc` cancel. Container `aria-roledescription`, cards `role="option" aria-selected aria-label="sudoku, 1 of 2"`, live region announces the snapped card `polite`.
- **Touch:** horizontal `scroll-snap-type: x mandatory`, native inertia. Off-screen cards `inert` — **the same nodes frozen-pose-0 (perf). One rule, two payoffs** (the a11y-correct "only the snapped slide is interactive" IS the perf-correct "only the snapped card boils").
- **PRM** (mirror every existing branch): entry/exit same-frame cut; navigation `scroll-behavior: auto`, instant snap; no wobble bloom (the shared beat is PRM-frozen anyway). Everything reachable, nothing moves.
- **Mobile 375:** one card per viewport + ~12% peek of each neighbor (swipe discoverability), card `width: min(80vw, …)`, name + range beneath, the page-pips row as the position tell. Entry: the centered stacked board folds up into the single centered card (same FLIP, simpler geometry). No hover states (coarse pointer, `useCoarsePointer`).

---

## Sub-waves (born RED) — the carousel builds in four (x4 §12)

- **Wave A — the registry card face + drop-in.** Extend `games/registry.ts` (`GameCard` over W11's `defineGame`); port sudoku (eager) + futoshiki (lazy) as cards; the two `Poster` components. **RED gate:** a stub third card appears selectable **with zero edits outside `GAMES[]`**; import-graph gate `pencil/** ↛ games/**` holds.
- **Wave B — the carousel shell (static, no transform).** `GameGallery.vue` + `GameCard.vue` + `useGameGallery` + `useCarouselGlide` + `?view=gallery`; scroll-snap; full listbox a11y; the page-pips. **RED gate:** keyboard-only select works; aria/SR announcements correct; **off-center cards 0 idle paints** (DELTA); off-screen `inert`.
- **Wave C — the board⇄card transform.** Extract `useFlipGlide` from the drawer engine (the named risk — drawer goldens green first); wire entry fold + deal + settle and exit unfold + hidden seam, reusing it. **RED gate:** entry filmstrip; **≤1 board re-raster** (DELTA); glass curve monotone; PRM same-frame cut; mid-glide reverse velocity-plausible.
- **Wave D — navigation glide + snap chime + mobile 375 + mid-game guard + retire the dropdown.** The per-snap wobble bloom + scribble underline; the 375 regime; the guard ribbon; delete `useGameMenu`/`logo-menu-pop`, point the wordmark at `openGallery`. **RED gate:** snap-step filmstrip; `gallery-375.png`; guard fires only on dirty+different; the dropdown gone with no dead imports (knip clean).

---

## Gates — π / DELTA on every choreography beat (x4 §11)

Every row born RED where the feature is absent today (there is no gallery at HEAD — the whole surface is RED). π = still capture; DELTA = motion/paint trace. **Capture on a self-served preview port, never :3001.**

| Claim | π (screenshot) | DELTA (trace) |
|---|---|---|
| Entry fold is ONE board raster | `gallery-entry-filmstrip.png` (0/130/260/390/520ms) | `entry-paint-trace.json`: ≤1 board re-raster; idle paints → 0 at settle |
| Idle gallery is paint-bounded | `gallery-settled.png` | `gallery-idle-paints.json`: only the center card boils (shared-beat cadence); flanks 0 paints/s |
| Snap glide monotone, no overshoot | `snap-step-filmstrip.png` (keyboard →) | `snap-glide-trace.json`: transform monotone on the glass curve |
| Game-agnostic drop-in | `third-game-card.png` (stub card, throwaway worktree) | diff-of-record: **zero edits outside `GAMES[]`** |
| Mid-game guard fires correctly | `guard-ribbon.png` | trace: ribbon on dirty+different only; absent on pristine/same |
| Mobile 375 | `gallery-375.png` (one card + neighbor peek + pips) | — |
| PRM cut | `gallery-prm.png` | `prm-entry-trace.json`: 0 tween frames |
| A11y | `gallery-focus-ring.png` | keyboard-only walkthrough + SR announcement log (`sudoku, 1 of 2`) |
| **useFlipGlide safety (the risk)** | drawer goldens byte-for-π after the extraction | `drawer.spec` easing green, unedited — the extraction is a no-behavior-change refactor before the gallery consumes it |

Component gates: `vue-tsc -b` exit 0; `eslint .` exit 0 (the `pencil/** ↛ games/**` boundary holds); `knip` clean (the retired dropdown leaves no dead imports); the full 44 e2e + the new gallery specs green.

---

## Ratify-me rows (compile into the ballot, x4 §12)

1. **Wordmark opens the gallery; retire the dropdown** [default: yes] vs keep the dropdown for the binary. One game-select surface (no dual paths); the fold IS the delight the owner asked for, cost is one Enter.
2. **The mid-game guard ribbon** [default: light-guard on dirty+different] vs never-ask (the permalink is the recovery).
3. **The snap "chime" is visual-only** (wobble bloom + underline); **confirm no audio** [default: yes, no audio].
4. **Card-step glide duration ~440ms** [audition at preview; default within the glass band].

---

## Seeds

- `x/x4-carousel-select.md` — the full spec: the two-grammar fusion (§1), the Wii-Shop reference + carousel a11y (§2, W3C APG + Chrome 2025), the sketchbook thesis + owner test (§3), the `GameCard`/`GAMES` contract + drop-in invariant (§4), the entry/exit choreography beat-by-beat (§5), the carousel grammar (§6), the state machine + mid-game guard (§7), the component architecture + the `useFlipGlide` M10 win (§8), the dropdown disposition (§9), keyboard/touch/PRM/375 (§10), the π/DELTA table (§11), the four sub-waves + ratify-me rows (§12).
- `x/x6-distillation.md` — `useFlipGlide` as the M10 distillation (one engine for drawer + gallery); the game-agnostic dividend (a third game inherits the shell/drawer/marks/transport/completion/generator for free).
- W11 (this tranche) — `defineGame` + `games/registry.ts`, the contract `GameCard` extends; the retired `GameId` literal.
- Live anchors at HEAD 65425697: `App.vue:35-39` (literal gameOptions/GameId — retired by W11), `:52-126` (page-turn), `:60-67` (the covenant), `:80-88` (URL truth), `:86-87` (zero-guard strip), `useControlsDrawer.ts:156-313` (the FLIP engine `useFlipGlide` extracts from), `:222-228` (the never-tween-layout-size crit kill).

## Residual risks

- **`useFlipGlide` extraction is the wave's named risk** — the drawer is the four-times-owner-audited surface; the extraction must reproduce its glide exactly (drawer goldens byte-for-π, `drawer.spec` easing unedited) *before* the gallery rides the same primitive. Land it as a no-behavior-change refactor first; if the drawer goldens shift, the gallery does not build until they are restored.
- **The idle-paint soul gate is the sharpest acceptance bar** — a flank card that enrols the shared beat re-introduces the N-sparse-writers disease T3 killed. The `gallery-idle-paints.json` DELTA (flanks 0 paints/s) is the gate; frozen-pose-0 is not optional decoration.
- **The mid-game guard is a ratify-me default, not settled** — it adds friction the app lacks today; the owner asked only that it be *considered*. Authoring specs the light ribbon but the ballot may take never-ask (permalink recovery). Neither is a modal.
- **Only one live board on the page at any instant** — the poster/live-face split is load-bearing for the perf floor; a design that mounts multiple live scenes to "preview" flanks breaks it. Flanks are static posters, always.
- **Cross-lane: a third game's solver is a backend question** — Wave A makes the *frontend* game-agnostic regardless; a new game becomes "register the card + ship poster/scene" once its `PuzzleClass` exists (W11/W13). The frontend drop-in does not wait on the solver.
- **Captures never touch :3001** — every π/DELTA is taken on a self-served preview port; the owner's instance is untouched (hard rule).

## Execution record (2026-07-15)

Workflow `wf_ed235bd2-c11` (A → B → C → D → V, all-Fable implementation, no walls) + the completion pair `wf_d8753e75-fb0` (C2 → V3, launched on the team-lead ruling that Wave C's disclosed choreography deviations were a COMPLETION, not a ballot) + the joint pair `wf_7f48b00f-a06` (J1 → JV) shared with W13. **Final verdicts: V PASS, V3 PASS, JV PASS.**

| Gate | Born-RED | Close |
|---|---|---|
| the card contract | hardcoded `gameOptions` + `GameId` literal | `GameCard` over W11's `defineGame` in `games/registry.ts` + `GAMES[]` (one source; loose `id: string` = the drop-in seam); posters over a game-agnostic `PosterBoard.vue` (frozen pose-0 by construction, a latent `:pose` prop as the gallery's enrolment hook) |
| drop-in | no third game selectable | throwaway-worktree proof: a stub game selectable with ZERO edits outside `GAMES[]` (diff-of-record = one hunk + two new files); made real at J1 — thermo/killer/kenken landed as three rows, zero shell/gallery/App edits beyond the one mount fold |
| the shell | no gallery | `GameGallery`/`GameCard` (pencil-pure — props `GameCard[]`, emits; imports nothing from games) + `useGameGallery` singleton (`?view=gallery` truth) + `useCarouselGlide` (scroll-snap touch + WAAPI keyboard steps on the glass curve); APG listbox-over-carousel a11y (activedescendant, "sudoku, 1 of 5", polite live region, off-screen inert); page pips |
| **the named risk** | — | `useFlipGlide` extracted from the drawer's mover engine as a no-behavior-change refactor — **drawer.spec UNEDITED green + darwin goldens byte-π proven BEFORE the gallery consumed it, and re-proven at V, V3, and JV**; the crit kill (never tween filtered layout size) lives in the primitive; the drawer shed 47 lines |
| the fold (spec-true at C2) | Wave C shipped poster+cut | live-board-as-center-face via `<Teleport>` — ONE component instance (Worker/marks/undo-depth survive the round-trip, V3-proven with a stamped cell); beat-0 chrome-leave (200 ms, the board holds) · beat-1 fold (layout constant, scale 1→0.475 monotone, ≤1 raster) · beat-2 the deal (one-shot staggered draw-ins, self-removing) · the hidden seam (park → `setGame({cut})` → the new board FLIPs up from the small pose — filmstrip-proven no mid-screen cut); the boundary held via `@face-mount` DOM-element emission |
| the soul gate | — | ONE `useBeatFrame` enrolment in the gallery, driven into the center card only (`HandDrawnOutline` gained a backward-compatible `:pose` prop); flanks frozen pose-0 + inert — 0 paints/s measured at B, V, V3, and JV (with five cards); one live board ever |
| the desk | — | 440 ms card-step (auditioned 380/440/520; `MOTION.cardStepMs`, RATIFY-ME); the snap chime = one 600 ms wobble bloom + scribbleUnderline, one-shot, visual-only (NO audio, confirmed); mobile 375 = one ~78 vw card + ~11% peek + pips; the mid-game guard RIBBON (no modal) on dirty+different only — `isDirty` reused from WU's spine via a `useDirtyBoard` bridge, truth-table 6/6 |
| the retirement | the dropdown was the only game-select surface | `useGameMenu` + listbox + menu keyframes DELETED; the wordmark opens the gallery (preloads scenes); knip clean; the wordmark's pixels byte-π (logo golden unchanged); three specs recut to the gallery path — the one sanctioned recut, cited per file |
| the mount fold (J1) | App.vue hardcoded two-game union | registry-driven: `sceneFor(id)` memoized over `GAMES[].scene()` (eager sudoku static, the rest `defineAsyncComponent`); the page-turn seam, `?game=` truth, guard, PRM preserved byte-for-byte; `GameId` widened to string at the boundary (the W11 KEY precedent) |
| suites | — | battery 0s · unit 307/29 · default e2e **77** (63 + 8 gallery + 6 guard, incl. the sanctioned recuts + C2's `visual-regression:456` truth-recut data:→blob:) · darwin goldens 4/4 byte-π at every verify, zero re-baselines · WU/W8 seams live through gallery round-trips |

**Ratify-me sheaf (B5)**: card-step 440 ms · the light mid-game guard default (never-ask is the KISS fallback, one gate to flip) · visual-only chime / no audio · wordmark-opens-gallery + dropdown retirement (default yes) · **the PRM degradation (RATIFIED at seal)**: a PRM deck shows the static poster grid, not the live projection — required by the zero-animation invariant (the live board carries ~61 glyph draw-ons). Deviations ledgered: `useCarouselGlide` does NOT consume `useFlipGlide` (the pencil↛games boundary correctly wins §8); the guard ribbon renders as a deck-centered overlay (the scroll viewport clips an in-card ribbon).
