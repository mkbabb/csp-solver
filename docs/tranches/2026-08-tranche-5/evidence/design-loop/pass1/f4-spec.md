# F4 — THE DEALER'S RITUAL · SPEC (pass 1 synthesis)

Charter: `charter-f4.md` · Dossier: `f4-research.md` · All paths relative to
`/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend`.

## Center, restated post-research

A new game is one transaction and it lives in the picker: each card carries its staging
(size/difficulty chips in the caption margin) and a Deal stamp as its dominant act. The drawer's
staged zone deletes. The re-deal — the app's most frequent verb — gets a quiet board-margin strip
that never opens the gallery, because Balatro's proportionality law cuts both ways: ceremony for
the game switch, near-zero feedback cost for the routine re-deal (Q6/M15: 1240ms of fold
choreography is disqualifying for "same game, harder").

**The card has two verbs.** Body/Enter = *visit* — non-destructive, restores what was (today's
exact semantics, no-op cut included). Stamp/`d` = *deal* — destructive, fresh board at staged
settings. This split is what dissolves every guard contradiction below.

## Decisions (each research contradiction resolved)

**D1 — schema, not model (kills C1+C5).** `range` dies (5 producers, 1 consumer, 0 tests — M20).
`GameDefinition.options: (model) => ControlSection[]` ALSO dies — its only consumer was the
drawer's staged zone. The registry gains **static** staging data, no live model required:

```ts
// registry.ts — replaces `range`
staging: StagingAxis[]
// StagingAxis = { key: string; label: string; quick?: boolean;   // quick ⇒ shown on the re-deal strip
//                 options: { value: number|string; label: string; colorClass?: string }[];
//                 default: number|string }
```

Five producers rewritten from each game's existing option constants (sudoku `label:"Size"`,
futoshiki/kenken `label:"Board Size"` — fixing C1's mis-naming). Pencil-local structural twin in
`GameGallery/types.ts` (the documented `GalleryCard` trick, ~12 LOC). `OptionSelector` is already
pencil (`src/pencil/chrome/OptionSelector/`) — the card imports it directly, no boundary issue.

**D2 — the staging bridge (C5's state-ownership move, priced).** New
`src/games/shared/useStagingBridge.ts` (~55 LOC, on the `useDirtyBoard.ts` register/identity-clear
pattern): the mounted game registers `{ id, read(): {size, difficulty}, applyAndDeal(staged) }`;
a module-level one-shot handoff `setPending(id, staged)` / `consumePending(id)` covers the four
unmounted lazy games. Registration + consumption wire **once** in `useGameState.ts` (~15 LOC at
setup: if a pending handoff matches, set `pendingSize`/`difficulty`, `deal()`), so all five games
inherit for free. No second `useGameState` is ever constructed; no per-game URL surgery — each
game's existing `syncToUrl` (`useGameState.ts:801`) writes the URL after the deal, and `App.vue`'s
param-strip on switch stays untouched. Picker chips are transient refs seeded from
`staging[].default`, overlaid with `bridge.read()` for the current card (App does the overlay —
pencil never imports games; values in via props, intents out via emits, the existing grammar).

**D3 — one confirm idiom per verb (kills C2, keeps the spec green).** The guard ribbon stays
switch-only — `gallery-guard.spec.ts:139` ships **unmodified**. The deal verb confirms via the
drawer's two-tap arm (`GameControlPanel.vue:256-274` machinery — 2.5s window, aria swap, "sure?"
sublabel), **ported and un-fenced from `isCoarse`** so fine-pointer desktop is protected too
(replacing the peek-divider's dissolved spatial prophylaxis). The same arm guards the stamp and the
margin strip. Not a second confirm — a port of the existing one, widened to all pointers.

**D4 — the re-deal strip (Q6, the deciding question).** New
`src/games/shared/RedealStrip.vue` (~85 LOC) rendered by `GameScene.vue` (shared — wire once) into
`GameBoard.vue`'s `.board-margin` via a new named slot (`:748`, ~6 LOC): `pointer-events:auto` on
itself (the `SolverErrorNote` idiom, `:808-810`); ≥1024 it rides the existing absolute z-50
overlay under the board square, <1024 in flow above the controls card. Content: the `quick: true`
axis (difficulty) as a compact `OptionSelector` row + a small deal button (the 28px `DiceIcon` +
"deal again" sublabel — the demoted drawer Deal, re-homed at its proportional weight). Chip write +
`applyAndDeal` — zero fold choreography, board deal beats only. Desktop "same game, harder" stays
**2 taps** (chip → deal; +1 arm when dirty), mobile drops to **2** from 3-4 and loses the scroll.
This makes the picker staging serve first-entry + game-switch only — per open Q4, that's correct,
not a shrinkage.

**D5 — snap-invariant card box (kills C6).** The staging band renders on **all five cards**;
non-active cards get `inert` + `visibility:hidden` (box reserved, no paint, no AT). Card height is
snap-invariant ⇒ `HandDrawnOutline`'s ResizeObserver (`:53-59, 83-98`) never re-bakes on snap.
The active band fades in on snap settle (opacity only — never height). Prototype instruments the
regen count: **0 per snap** is the gate.

**D6 — the two hazards.** Every staging control and the stamp carry their own `@click.stop`
(guard-ribbon precedent, `GameGallery.vue:384,391`) — chip taps must not bubble to `onCardClick`.
Keyboard: `d` on the gallery viewport = stamp press for the centered card (arm semantics
identical, aria-live announces "sure?"); Enter/Space stays *visit*; no collision with global `g`.
The stamp is a real `<button>` in the caption, tabbable, following the ribbon precedent.

**D7 — C7 inherited knowingly.** Difficulty stays a live-write in the model, size stays pending;
the picker and strip treat both as provisional-until-deal because `applyAndDeal` writes both then
deals — no new staging buffer, the `useGameState.ts:471-479` seam untouched, documented in the
bridge's header comment.

**D8 — honest claims (C3/C4).** Mobile card shortens −31% (~500→~345px) and still scrolls — F4
claims the fold, the thumb-native swipe staging, and the −44% desktop drawer, not "halves". No
in-drawer "new game" door — `enterGallery` already has three (C4).

## The card, drawn

`.game-card-caption` (below the face — no live-face contention, `GameCard.vue:320-325`):

1. Name SVG + scribble underline (as-is).
2. Two axis rows: heading in the existing `--type-subheading` register + `OptionSelector` in
   mobile `options-row` grammar (gap 0.25rem, px-3 py-1.5, text-[1rem]) — both rows ≈213px, fit
   the 244.5px face width at 375 (M12). Crayon difficulty tints ride `colorClass`; the three
   `.crayon-*` classes move from `GameControlPanel.vue:775-791` into the card's style block —
   **AA re-verify against `--color-card`** (open Q7, prototype checklist).
3. The Deal stamp: full-caption-width `<button>`, min-height 56px, framed by
   `HandDrawnOutline :pose="pose"` (the card's own beat pose — zero new enrolments, zero bakes,
   M23), Fraunces display "Deal" + `DiceIcon` at 40px, washi tilt via `SheetWashiLabel` grammar.
   Armed state swaps the sublabel to "sure?" for the 2.5s window.

Card 340→~535px, column ~604px — fits 375×667 with ~60px slack (M13); the sim measurement is a
prototype gate, with the size-row→stepper collapse as the named fallback.

**Motion (existing tokens only).** Same-game deal from picker: stamp confirm → `emit('deal')` →
App `unfoldToBoard` (520ms `boardFoldMs`) → `applyAndDeal` → board deal beats (base 218ms,
stagger 90 — M16). Cross-game: `setPending` → `setGame(id, {cut:true})` → mount consumes → deals.
Strip re-deal: no view change, deal beats only. No new durations, no new curves.

## Change inventory

| file | change | LOC |
|---|---|---|
| `src/games/registry.ts` | `range`→`staging` (type + 5 producers); DELETE `options` slot | −40 |
| `src/games/{sudoku,futoshiki,thermo,killer,kenken}/game.ts` | `options:` blocks (17×5) → static `staging` data | −35 |
| `src/games/shared/GameControlPanel.vue` | staged-zone excision per M2 (template `:331-405`,`:530-580`; script incl. `sections` prop, `onDeal`, tab-toggle; style incl. `.new-game-zone`,`.deal-*`,`.crayon-*` move) | −324 |
| `src/games/sudoku/ControlPanel/` + test | DELETE (relay dies with the prop) | −213 |
| `src/games/futoshiki/ControlPanel/` + test | DELETE | −206 |
| `SudokuGame/FutoshikiGame/ThermoGame/KillerGame/KenkenGame.vue` | drop `sections` computeds/props | −25 |
| `src/games/shared/useStagingBridge.ts` | NEW — register/read/applyAndDeal + one-shot handoff | +55 |
| `src/games/shared/useGameState.ts` | register on bridge; consume pending at setup | +15 |
| `src/pencil/chrome/GameGallery/types.ts` | pencil twin of `StagingAxis` | +12 |
| `src/pencil/chrome/GameGallery/GameCard.vue` | staging band (2 rows + stamp), flank reservation, `@click.stop`s, crayon css | +145 |
| `src/pencil/chrome/GameGallery/GameGallery.vue` | `d` key, `deal` emit, chip-state refs | +25 |
| `src/App.vue` | `onGalleryDeal` (same-game vs handoff), staging overlay for current card | +30 |
| `src/games/shared/RedealStrip.vue` | NEW — quick axis + deal, ported arm | +85 |
| `src/games/shared/GameBoard.vue` | `#margin` slot in `.board-margin` | +6 |
| `src/games/shared/GameScene.vue` | mount RedealStrip | +10 |
| e2e: 7 `Deal a new board` call sites (M21) | mechanical re-point to strip/stamp | ~0 |
| e2e: new `gallery-deal.spec.ts` | stamp arm, strip arm, `d` key, chip no-bubble | +60 |

**Net ≈ −400 LOC** (deletions ~843, adds ~443). `gallery-guard.spec.ts` untouched.
Better than the dossier's −440 base case on the registry side: `options` deletes rather than moves.

## Prototype slice (ordered — built to falsify the center)

**Slice 1 (the falsifier): the staged card, sudoku, current-game path only.**
Staging band on all five cards (static schema; flanks `inert`+`visibility:hidden`); chips wired to
local refs; Deal stamp with the ported arm + `d` key; stub bridge on the mounted sudoku
(`applyAndDeal`); same-game deal-from-picker end-to-end. Measured on desktop Safari + the booted
`perf-rig-iphone16` sim at 375×667 (never the dev ports — built dist only).
**Falsifiers:** (a) gallery column overflows 667px → stepper fallback or family re-scopes;
(b) any `HandDrawnOutline` regen on snap (instrumented counter) → the reservation failed and the
family's card-staging center is Safari-hostile; (c) chip taps leak to `select` and exit the
gallery; (d) the two-verb card fails a blind read (stamp mistaken for the card's select act).
**Slice 2 (only if 1 survives):** RedealStrip in the margin host, both regimes — low-risk
(existing host, existing pointer-events idiom), but it's the anti-regression half of the verdict.

## Family success test

- **T1 taps** — "same game, harder": desktop ≤2 taps + zero fold choreography; mobile ≤2 and no
  scroll gesture (beats M19 in both regimes; the strip is the proof).
- **T2 snap cost** — 0 outline pose-path regenerations per snap after mount, Safari, instrumented.
- **T3 fit** — no gallery vertical scroll at 375×667 with the band live (sim-measured, not arithmetic).
- **T4 guard** — `gallery-guard.spec.ts` green unmodified; dirty deal never fires unarmed on any
  pointer (stamp + strip specs); exactly two confirm idioms, one per verb (ribbon=switch, arm=deal).
- **T5 drawer** — desktop 25→14 rows (~853→~495px); mobile card ~500→~345px, measured.
- **T6 mark 4** — zero new live-filter surfaces, zero new bakes (grep `filter:` in the diff; only
  the hover-fenced wobble may appear).
- **T7 parsimony** — net ≤ −350 LOC at PR, with both per-game ControlPanel wrappers deleted.
- **T8 a11y** — aria-expanded/inert/listbox contracts hold; the arm state is announced
  (aria-live polite); stamp and strip are tabbable buttons with truthful labels.
