# T4-W12 · Wave B — the carousel shell (STATIC, no board⇄card transform yet)

Base HEAD `38d3f223` (T4-W11 sealed), atop Wave A's registry card face + posters (in tree).
Port 4786. Spec §carousel grammar + §state machine + §sub-wave B. The FOLD/unfold FLIP is
Wave C; the snap chime + guard ribbon + dropdown retirement are Wave D. Open/close here is the
PRM same-frame cut **for everyone** (the static cut).

## Footprint (3 edits + 6 new files — additive, mergeable)

```
 M src/App.vue                                    mount GameGallery when view==='gallery'; `g` entry; setGame `{cut}` flag
 M src/pencil/config/pencilConfig.ts              + MOTION.cardStepMs (440) — the card-step band, lands IN pencilConfig (covenant)
 M src/pencil/grid/HandDrawnOutline.vue           + optional `:pose` prop — driven-frame, enrols NO beat (backward-compatible)
?? src/games/shared/useGameGallery.ts             the module-level view state machine (view/snappedIndex/enteredFrom + ?view)
?? src/games/shared/useGameGallery.test.ts        +6 state-machine asserts (transitions, snap clamp, ?view truth)
?? src/pencil/chrome/GameGallery/GameGallery.vue  the carousel shell — props GalleryCard[]; emits @snap/@select/@cancel
?? src/pencil/chrome/GameGallery/GameCard.vue     one HandDrawnOutline paper card — poster face + wordmark + range + boil-when-centered
?? src/pencil/chrome/GameGallery/useCarouselGlide.ts  scroll-snap (touch) + glass-curve FLIP (keyboard) + JS edge spacers
?? src/pencil/chrome/GameGallery/types.ts         GalleryCard — pencil-LOCAL type (pencil imports NOTHING from games/**)
?? e2e/gallery.spec.ts                            8 specs, hand-matched to drawer.spec register
```

`registry.ts` UNTOUCHED (Wave A minted `GameCard`/`GAMES`; App.vue now consumes them — the seam
Wave A left tree-shaken is wired in HERE). No `csp-solver/**` / W13-dir edits.

## Architecture — how the covenant + soul gates are honoured

- **No second animation brain.** The keyboard/button step is a classic FLIP on WAAPI (the
  drawer's engine, inline for Wave B — Wave C extracts `useFlipGlide` and this consumes it), on
  the ONE glass curve `MOTION.curves.drawerGlide`, one clock, `fill:none` to the rest pose.
  Touch rides native `scroll-snap-type: x mandatory` inertia. No keyframes lib, no new tween.
- **Only ONE live board.** The playing board stays MOUNTED under the gallery (`v-show`, not
  `v-if`) — state preserved across open/cancel; the gallery cards are all posters in Wave B. On
  select, App.vue cuts to the chosen game (`setGame(id, {cut:true})`).
- **THE SOUL GATE (sharpest).** GameGallery holds the ONE `useBeatFrame` enrolment and feeds the
  live pose to the CENTERED card's `HandDrawnOutline :pose` only; every flank gets pose 0
  (frozen) + `inert`. No card enrols a beat of its own. Verified below: center 8.0 beats/s,
  flanks 0, layoutΔ 0. The `HandDrawnOutline :pose` prop is the enabling change — supplied →
  driven + enrols nothing (the PosterBoard discipline); absent → enrols the beat exactly as
  before (every existing consumer byte-unchanged, goldens 4/4 byte-for-π).
- **No router / no modal / no audio.** `?view=gallery` via `replaceState` + boot parse (the
  `parseGame` pattern); the gallery is a view over the one app. Esc cancels (no modal).
- **pencil ↛ games.** `GalleryCard` is a pencil-local type; the poster arrives as a loader thunk
  (`card.poster()`, a value). `eslint .` exit 0 — the boundary holds. App.vue (outside pencil/**)
  reads `GAMES` and passes it in; the choice returns via `@select`.

## A11y — listbox-over-carousel (W3C APG)

DOM focus on the track container (`role=listbox`, `aria-roledescription=carousel`, `tabindex=0`);
the snapped card tracked by `aria-activedescendant` (no roving-tabindex collision with a board
grid). `←/→`(+`↑/↓`) step · `Home/End` first/last · `Enter/Space` select · `Esc` cancel. Cards
`role=option aria-selected aria-label="sudoku, 1 of 2"`; off-center cards `inert`; a polite live
region announces each snap. SR log: `sr-announcement-log.json` (open→`sudoku, 1 of 2`, →→
`futoshiki, 2 of 2`, clamp holds, Home/End correct).

## Gates — π / DELTA (captures/ · self-served :4786, never :3001)

| Claim | Result |
|---|---|
| **Idle gallery paint-bounded (soul gate)** | `gallery-idle-paints.json`: center **8.0 beats/s / 80 mutations**, flank **0 / 0**, layoutΔ **0** → PASS (only the centered card boils; flanks frozen) |
| Snap glide monotone, no overshoot, glass curve | `snap-glide-trace.json`: easing `cubic-bezier(0.32,0.72,0,1)`, tx **337→0 monotone**, `scrollLeft` written **once** (`[0,352]` — never tweened) |
| Snap step (π) | `snap-step-filmstrip-{0..4}.png` — sudoku-centered → futoshiki-centered, pip inks across |
| Idle gallery (π, both themes) | `gallery-settled.png` · `gallery-settled-dark.png` (currentColor flips) |
| A11y focus ring | `gallery-focus-ring.png` (listbox `:focus-visible`, post-ArrowRight) |
| Mobile 375 | `gallery-375.png` — one card ~78vw + neighbor peek + pips |
| PRM cut | `gallery-prm.png` · `prm-entry-trace.json`: **0 tween frames**, gallery same-frame |

## Battery (all vs YOUR dist / clean tree)

| gate | result |
|---|---|
| `vue-tsc -b --force` | exit **0** |
| `test:unit` | **290 passed / 25 files** (W11/Wave-A baseline + my 6 `useGameGallery` asserts; the rest are concurrent lanes' tests in the shared tree) |
| `lint:eslint` | exit **0** (`pencil/** ↛ games/**` holds — GalleryCard is pencil-local; poster is a prop thunk) |
| `lint:knip` | exit **0** (all new modules reachable from App.vue) |
| `prettier --check src/` | exit **0** |
| `build` (`npm run build`, incl. wasm) | exit **0** (registry now rides the main chunk — App consumes GAMES; sudoku eager / futoshiki lazy preserved; posters stay lazy chunks) |
| default e2e (`:4786`, temp `playwright.w12b.config.ts`, webServer stripped) | **71 passed** (63 default UNEDITED + 8 new gallery specs) |
| darwin goldens (`:4786`, `test:golden`) | **4/4 passed** — cell-light, grid-corner-light, logo-light, toggle-crest-dark **byte-for-π** (the HandDrawnOutline `:pose` change is a strict no-op for beat-driven consumers) |

Temp `playwright.w12b.config.ts` deleted; `test-results/` removed; `:4786` preview killed;
`:3000`/`:3001` never touched; goldens re-baselined NOTHING. No commit (team lead commits).

## Design pass (Fable · DesignSync invoked)

`DesignSync.list_projects` → `[]` (no design-system project to sync to — same as Wave A; the sync
path is inapplicable). The pass ran as a rendered visual review on the self-served preview:
HandDrawnOutline-framed paper worksheets, the centered card full-scale + boil-alive (frame boils
on the shared beat), flanks `scale(0.9)`/`opacity(0.62)`/frozen, lowercase wordmark `<text>` +
Patrick Hand range sub-line, graphite page pips (snapped one inked). Both themes (currentColor
flips), coarse+fine (no hover states by construction), PRM-safe (cut + frozen beat).

## Notes for downstream

- **Ratify-me 1/4 (card-step ~440ms):** landed as `MOTION.cardStepMs = 440`, inside the glass band.
- **Wave C seam:** the board stays mounted (`v-show`) so its rect is readable for the fold; App's
  `setGame(id,{cut})` is the same-frame stand-in the FLIP unfold + hidden seam replace. `?game=`
  and the page-turn stay App's; the gallery owns only `?view`.
- **Cross-wave:** `GAMES[]` edits stay additive for W13's rows; I appended nothing to it (I only
  READ it). W13's rust broke the wasm prebuild transiently mid-run (its new thermo/cage files) —
  recovered; the final `npm run build` is green against the stabilized tree.
