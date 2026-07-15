# T4-W12 · Wave D — nav glide · snap chime · mobile 375 · the mid-game guard · retire the dropdown

Base HEAD `38d3f223` (T4-W11 sealed), atop Wave A (registry card face + posters), Wave B (the
static carousel shell), Wave C (the board⇄card fold) — all in tree. Port 4788. Spec §sub-wave D.
The wave that makes the carousel the SOLE game-select surface: the wordmark opens it, the dropdown
dies, a snap lands with a chime, a marked board asks before it's abandoned.

## Footprint (5 edits + 1 new + 1 delete · pencil/App/shared + e2e recuts — additive, mergeable)

```
 M src/pencil/chrome/GameGallery/GameGallery.vue   the mid-game guard gate + ribbon overlay; click-select; is-coarse class
 M src/pencil/chrome/GameGallery/GameCard.vue      the snap chime (wobble bloom + scribbleUnderline draw); pointer click-gate
 M src/pencil/chrome/HandwrittenLogo/HandwrittenLogo.vue  RETIRE the dropdown — wordmark now @open→enterGallery; wordmark render byte-for-π
 D src/pencil/chrome/HandwrittenLogo/useGameMenu.ts       the listbox state machine — DELETED (superseded by the gallery)
 M src/App.vue                                     wordmark @open=enterGallery (+preloadFutoshiki); pass :dirty/:current-id/:coarse to the gallery
 M src/games/shared/useGameState.ts                register `isDirty` into the dirty bridge (the ONE WU signal, no parallel bool)
?? src/games/shared/useDirtyBoard.ts               the mid-game guard's dirty bridge (module singleton — forwards `isDirty` to the app shell)
 M src/pencil/config/pencilConfig.ts               RATIFY-ME annotation on MOTION.cardStepMs (440 auditioned)
 M src/assets/index.css                            drop the now-dead `.logo-menu-item` coarse tap-target rule (dropdown retired)
 M e2e/{futoshiki,permalink,throttled-void}.spec.ts  RECUT the wordmark-listbox game switch → the gallery path (the sanctioned recut)
?? e2e/gallery-guard.spec.ts                       6 specs — dropdown retired, snap-chime underline, the guard truth table
```

No `csp-solver/**` / W13-dir (`games/{thermo,kenken,killer}`) edits. `GAMES[]`/`registry.ts` READ
only, never appended (kept additive for W13's rows). `HandDrawnOutline.vue`'s `:pose` (Wave B) is
consumed, not re-edited.

## 1 · Nav glide — the card-step band, RATIFY-ME flagged

The programmatic step already rides `useCarouselGlide` on the ONE glass curve
(`MOTION.curves.drawerGlide`), one clock, `fill:none` (Wave B). Wave D auditioned the duration at
:4788 (380 / 440 / 520): 380 clipped for a one-slot throw, 520 (the drawer's full-sheet ceiling)
dragged; **440ms** is the settled read. Landed as `MOTION.cardStepMs` **inside pencilConfig** (the
covenant — no timing constant outside the config bands), now carrying an explicit **RATIFY-ME**
annotation (ballot row 4).

- **DELTA** `snap-glide-trace.json`: a keyboard `→` step, 92 rAF samples of the track's
  `translateX`. Classic FLIP — an onset frame sets `translateX(dx=338px)`, then the eased glide is
  **338→0, monotone (maxUpwardStep 0.000), zero overshoot (minTx 0.000), settled at 0** on
  `cubic-bezier(0.32,0.72,0,1)`. **verdict PASS.**
- **π** `snap-step-filmstrip-{0,1}.png` — sudoku-centered → futoshiki-centered.

## 2 · The snap chime (visual-only, NO audio)

On a card BECOMING centered (the snap settle, and the entry-settle center), `GameCard` plays ONE
`GLYPH_ANIM.hoverWiggleDuration` (600ms) chime: a **wobble bloom** (a sin-envelope scale on the
frame's own promoted layer — compositor-only, no pose re-raster) + its **scribbleUnderline draws
in** left-to-right (a clip-path reveal on the eased progress). It is a single
`createSequenceSubscription` on the pencil-boil chain — **one-shot, self-removing, never
perpetual** (the soul-gate grammar; the same `sequence` kind DifficultyTally/glyph draw-ins ride).
No sound engine exists and none was added (a11y burden + scope creep).

- **π** `gallery-chime-{light,dark}.png` — the centered card carries the drawn scribble under its
  name; flanks carry none (`.game-card-underline` is `v-if="isActive"`). Both themes (ink flips via
  `useTheme`).
- **PRM**: no bloom; the underline lands drawn (reachable, static) — the shared beat is PRM-frozen
  anyway.
- e2e `gallery-guard.spec.ts` §2: the underline rides the CENTERED card only, and follows the snap
  (card-0 → card-1 on `→`).

## 3 · Mobile 375

- **π** `gallery-375.png` (375×720): one card near-fills the width (~80vw slot), the futoshiki
  neighbor peeks on the right, the scribble underline + range sub-line + the two page pips (first
  inked) read as the position tell. `gallery.spec` §8 asserts card width 240–340px + `scrollWidth >
  clientWidth` (overflow → a neighbor to swipe to).
- **`--card-w = min(78vw, 22rem)`** kept from Wave B (~11% neighbor peek each side — nearer the
  spec's "~12%" than 80vw's 10%; the desktop 22rem cap is unchanged). One card, one board: the
  stacked board folds into the single centered card on the SAME Wave-C FLIP (simpler geometry — the
  fold reads live rects, so it needs no mobile branch).
- **Coarse-pointer no-hover (`useCoarsePointer`)**: the gallery is pencil-pure (`pencil/** ↛
  games/**` — a soul gate), so it cannot import `useCoarsePointer` directly. App (the app shell)
  reads it and passes `:coarse` in as a prop; the gallery gates the centered card's click-cue
  behind `.game-gallery:not(.is-coarse)` + `@media (hover: hover) and (pointer: fine)` (the
  composable's own matchMedia query). The composable is genuinely consumed; the boundary holds.

## 4 · The mid-game guard (ratify-me default: light guard)

A **pencil-note ribbon** (NOT a modal, NOT `confirm()`) slides from the chosen card on a **dirty +
different** switch: *"leave this puzzle? / your marks aren't saved"* — keep / leave. A **pristine**
or **same-game** select switches freely.

- **`isDirty` reuse — no parallel bool.** The bridge (`useDirtyBoard.ts`, a module singleton, the
  `registerDrawerMasthead` pattern) forwards `useGameState`'s ONE `isDirty` (`undoDepth > 0`,
  T4-WU/U3) up to App via a strict mirror (`watch` immediate, nothing else feeds it). App passes
  the boolean into the pencil-pure gallery as `:dirty`. Only one live board mounts, so one slot;
  the clear is identity-guarded so a scene swap can't null the incoming source.
- **Trace — the ribbon fires ONLY on dirty+different** (`gallery-guard.spec.ts`, the truth table):
  | board | switch to | ribbon? |
  |---|---|---|
  | dirty | different (futoshiki) | **yes** — held; Leave proceeds, Keep dismisses |
  | pristine | different | no — switches freely |
  | dirty | same (sudoku) | no — pure unfold |
- **Keyboard-complete** without leaving the activedescendant model: while armed, the listbox's
  Enter = Leave, Esc = Keep, arrows = Keep + navigate; the keep/leave buttons are pointer targets.
- **π** `guard-ribbon-{light,dark}.png` — the ribbon emerging from the centered (chosen) card.
- **Rendering note (honest):** the ribbon is an overlay in `GameGallery` centered on the deck, NOT
  inside `GameCard` — the scroll viewport's `overflow-x:auto` forces `overflow-y` to clip, which
  would crop a ribbon placed below the card. Centered on the deck = from the chosen (centered) card.

## 5 · Retire the dropdown

`useGameMenu.ts` **deleted**; `HandwrittenLogo`'s `<Transition>` listbox + `logo-menu-*`
keyframes/CSS + the menu ARIA (`aria-haspopup/expanded/controls/activedescendant`) + `scribble/ghost`
underline imports + the caret `is-open` state removed; the dead global `.logo-menu-item` coarse
tap-target rule dropped from `index.css`. The wordmark button now `@click`→`emit('open')` →
App.`enterGallery` (which also `preloadFutoshiki`s on open, F6-D3). **The wordmark's rendered pixels
are byte-for-π** — only the menu (visible only when open) and non-painting ARIA were removed; the
`logo-light` golden passes unchanged (below). `knip` clean — no dead import.

- **e2e recut (the one sanctioned recut — the surface it drove is retired; each file cited):**
  - `futoshiki.spec.ts` — `switchToFutoshiki` helper: wordmark → gallery, `→` centers futoshiki,
    `Enter` selects (the listbox-over-carousel contract). Test-1 title recut.
  - `throttled-void.spec.ts` — the first-select switch → gallery path (open warms the chunk, so it
    downloads under throttle in parallel with the nav — recovery 2.4s, well under the 25s budget).
  - `permalink.spec.ts` §3 — the game-switch strip → gallery path (permalink board is pristine → no
    guard; the `setGame` cut still strips the outgoing board/size params).

## Covenant + soul gates

- **No second animation brain** — the nav step rides `useCarouselGlide` (the drawer's FLIP grammar,
  glass curve, one clock); the chime is a one-shot pencil-boil `sequence` subscriber; the ribbon
  slide is a CSS `<Transition>` (the app's card idiom, Wave B's depth transition). No keyframes.js,
  no new tween lib, no new named curve.
- **The shared beat / off-center cards enrol nothing** — the chime is a FINITE transient (settles +
  self-removes), so steady-state idle-paint is untouched: `gallery.spec` §6 (only the centered card
  boils, flanks frozen pose-0) stays green. The centered card's boil is still the ONE `useBeatFrame`
  enrolment (GameGallery); the chime writes a transform/clip-path channel, not a beat.
- **One live board** — the board stays mounted (`v-show`); the guard/chime mount no second scene.
- **No router / modal / audio** — `?view` via `replaceState` (Wave B); the guard is a ribbon, not a
  modal; the chime is graphite, not sound.
- **pencil ↛ games (eslint)** — the gallery takes `dirty`/`currentId`/`coarse`/`GAMES` as PROPS;
  `useDirtyBoard`/`useCoarsePointer` live in `games/shared` and are read by App (the shell), never
  by pencil. `eslint .` exit 0.

## Battery (all vs YOUR dist / clean tree · :4788, never :3001)

| gate | result |
|---|---|
| `vue-tsc -b --force` | exit **0** |
| `test:unit` (`vitest run`) | **307 passed / 29 files** (W11/A/B/C baseline + concurrent lanes; Wave D adds no unit surface — the gallery is e2e-tested) |
| `lint:eslint` (`eslint .`) | exit **0** (`pencil/** ↛ games/**` holds — the guard inputs cross as props) |
| `lint:knip` | exit **0** (useGameMenu deleted with no dead import; useDirtyBoard reachable from App + useGameState) |
| `prettier --check src/` | exit **0** |
| `build` (`vite build`, existing node_modules wasm — W13's in-flight rust prebuild skipped) | exit **0** |
| default e2e (`:4788`, temp `playwright.w12d.config.ts`, webServer stripped) | **77 passed** (63 default incl. the recut futoshiki/permalink + 8 gallery + 6 gallery-guard) |
| throttled-void recut (`test:e2e:throttle`, own bundled preview :4188) | **1 passed** (2.4s — void bounded, gallery path recovers well under the 25s budget) |
| darwin goldens (`:4788`, `test:golden`) | **4/4 byte-for-π** — cell-light, grid-corner-light, **logo-light** (the wordmark, unchanged by the dropdown retirement), toggle-crest-dark |

Temp `playwright.w12d.config.ts` + `__w12d_capture.spec.ts` deleted; `dist-throttle/` +
`test-results/` removed; `:4788` preview killed; `:3000` (owner's) + `:3001` never touched; goldens
re-baselined NOTHING.

## Design pass (Fable · DesignSync invoked)

`DesignSync.list_projects` → `[]` (no design-system project to sync to — same as Waves A/B/C; the
sync path is inapplicable). The pass ran as a rendered visual review on the self-served :4788
preview: the snap chime (wobble bloom + scribble underline drawing in on settle), the guard ribbon
sliding from the centered card in both themes, the 375 one-card-plus-peek regime, the monotone
glide. Both themes (ink/currentColor flips), coarse+fine (the click-cue is fine-pointer-only,
coarse gets none), PRM-safe (no bloom, the underline settles drawn; the ribbon appears same-frame).

## Ratify-me sheaf (ballot, x4 §12)

1. **Wordmark opens the gallery; retire the dropdown** — **DONE (default: yes).** One game-select
   surface; `useGameMenu` + the listbox deleted; the wordmark's `logo-light` golden byte-for-π. Cost
   is one Enter/click; the fold is the delight.
2. **The mid-game guard ribbon** — **DONE (default: light-guard on dirty+different).** Reuses WU's
   `isDirty` (no parallel bool); ribbon, not a modal. The KISS fallback stays never-ask (the
   `?board=` permalink is the recovery) — flip one gate in the gallery's `attemptSelect` if the
   ballot takes it.
3. **The snap chime is visual-only — confirm NO audio** — **CONFIRMED (default: yes).** Wobble bloom
   + scribble underline in graphite; no sound engine exists and none was added.
4. **Card-step glide duration ~440ms** — **DONE (default: within the glass band).** `MOTION.cardStepMs
   = 440`, auditioned at preview, RATIFY-ME annotated; `snap-glide-trace.json` monotone/zero-overshoot.
