# F4 — THE DEALER'S RITUAL · RESEARCH DOSSIER (pass 1)

Charter: `scratchpad/design-loop/charter-f4.md`. Read-only against
`/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend`. Every verdict below
traces to a cited line. Prior art is background only.

---

## Q1 — THE TRANSACTION AS BUILT

**Confirmed in full.** The gallery emits an id and nothing else; staging lives in the drawer.

`GameGallery.vue:216-224` — select carries a bare id:

```
function attemptSelect() {
  const card = props.cards[activeIndex.value];
  if (props.dirty && props.currentId != null && card.id !== props.currentId) {
    guardIndex.value = activeIndex.value; // arm the ribbon on the chosen card
    return;
  }
  emit("select", card.id);
}
```

`App.vue:344-349` — the id round-trips to `setGame`, no staging crosses:

```
function onGallerySelect(id: string) {
  unfoldToBoard(() => {
    select();                    // view → playing, `?view` cleared
    setGame(id, { cut: true });  // same-frame cut to the chosen game — the seam
  });
}
```

**Staged zone**: `GameControlPanel.vue:335` (mobile) / `:533-537` (desktop), `role="group"`
`aria-labelledby` a `useId()` (`:241`); the sections arrive as a prop (`:91-92`); Deal is
`.deal-row`/`.deal-btn` at `:389-404` / `:563-579` — a 28px `DiceIcon` + `.icon-sublabel`
(`:396`, `:570`). Problem-brief item 1 verified verbatim.

**Sections supplied per-game**: two routes, both live.
- `sudoku/ControlPanel/ControlPanel.vue:59-75` and `futoshiki`'s twin — a thin `computed<ControlSection[]>` wrapper component.
- `thermo`/`killer`/`kenken` skip the wrapper entirely: `KillerGame.vue:34`
  `const sections = computed<ControlSection[]>(() => killerGame.options(killer));` — the
  registry contract's own `options` slot. **This is the load-bearing precedent for F4** (see Q2).

**URL params**: charter claim confirmed. `App.vue:129-130`

```
for (const key of ["board", "size", "difficulty", "board_size"])
  url.searchParams.delete(key);
```

and `sudoku/composables/useUrlState.ts:39-52` parses `?size=` + `?difficulty=` back with
`VALID_SIZES`/`VALID_DIFFICULTIES` validation. The staging axes already have URL truth.

**Fold choreography** — the ready-made stage, confirmed with numbers
(`pencilConfig.ts:142,149,155`): `cardStepMs: 440`, `boardFoldMs: 520`, `chromeLeaveMs: 200`.
BEAT 0 = `App.vue:322-326` (`html.gallery-leaving`, 200ms); BEAT 1 = `App.vue:268-280`
(`foldCtl.run`, flipTransform of the live board into the face); BEAT 2 = `GameGallery.vue:143-170`
(`startDeal`, `base = round(boardFoldMs * 0.42)` = 218ms, `stagger = 90`, outward from center).
Round-trip choreography cost of one picker visit: **200 + 520 = 720ms in, 520ms out = 1240ms**.

**One asymmetry the charter does not name**: size is *staged*, difficulty is *live*.
`SudokuGame.vue:157-168` binds `:size="sudoku.pendingSize.value"` but
`:difficulty="sudoku.difficulty.value"` writing straight back to `sudoku.difficulty.value`.
`useGameState.ts:471-479`:

```
async function deal() {
  if (pendingSize.value !== solverSize.value) {
    solverSize.value = pendingSize.value;
    domain.clearPersisted();
    initBoard();
    await randomize({ record: false });
  } else { await randomize(); }
}
```

So "staged zone" is half-true today: only `pendingSize` is genuinely provisional. Difficulty is a
live write that only *takes effect* at the next `randomize()`. F4 inherits this seam intact —
useful, because it means difficulty needs no staging buffer, only a home.

---

## Q2 — THE REGISTRY QUESTION

**The charter's parsimony jewel is half a jewel.** `range` is genuinely dead, and genuinely
reshapeable — but it cannot become a control without new data.

`range` census: **5 producers, 1 consumer, 0 tests.**
- Producers: `registry.ts:165,176,188,197,206` — all five `range: { label: "size", levels: <opts>.map((o) => o.label) }`.
- Type: `registry.ts:153` and its pencil-local twin `GameGallery/types.ts:20`.
- Sole consumer: `GameCard.vue:85-88` →

```
const rangeLine = computed(() => {
  const { label, levels } = props.card.range;
  return levels.length ? `${label} · ${levels.join(" / ")}` : label;
});
```

rendered at `GameCard.vue:276` as `<span class="game-card-range">`. No e2e or unit assertion
touches `game-card-range` or `rangeLine` (grep clean). **Free to reshape.**

What `range` lacks to be a control: (a) `value`s — `.map(o => o.label)` throws them away;
(b) `selected`; (c) `onChange`; (d) **the whole difficulty axis** — every card hardcodes
`label: "size"`, and difficulty appears in no card row. (e) The label lies for two games:
futoshiki and kenken's own heading is `"Board Size"` (`futoshiki/game.ts:37`, `kenken/game.ts:41`)
but their card says `"size"`.

**The real registry seam already exists and is better**: `GameDefinition.options`,
`registry.ts:101` — `options: (model: TBoard) => ControlSection[]`, declared per game at
`sudoku/game.ts:29-45`, `kenken/game.ts:38-53`, etc. **17 LOC each, identical shape across all
five games** (measured). This is the staging schema the charter asks for — it is already on the
registry, already the drop-in contract, already consumed directly by three of five scenes.

**But it takes a live model, and that is F4's hardest engineering wall.** `sudoku/game.ts:35-36`:

```
selected: m.pendingSize.value,
onChange: (v) => (m.pendingSize.value = v as number),
```

`m` is `ReturnType<typeof useSudoku>` — and `useSudoku` is a **plain factory, not a singleton**
(`useSudoku.ts:42` `export function useSudoku() { const api = useSolver(); const initial = resolveInitialState(); ... }`).
Consequences:
1. **A non-current card has no model.** Only one scene mounts (`App.vue:418`
   `<component :is="sceneFor(scene)">`), and four of five games are lazy chunks
   (`registry.ts:180,190,199,208`). Calling `options(model())` in the picker for a flank would
   construct a *second* `useGameState` machine — its own `resolveInitialState()`, its own
   `queueSave()` persist watcher, its own `useSolver`. (The Worker itself is lazy —
   `shared/solver/transport.ts:72` `ensureWorker()` — so no Worker spawns, but the state machine
   and its localStorage writer do.)
2. **The picker cannot reach the mounted scene's model.** There is no bridge for it. The existing
   module bridges cover only: `useLiveFace` (36 LOC), `useDirtyBoard` (48 LOC), `useControlsDrawer`,
   `useGameGallery`. A staging bridge would be a fifth, modelled on `useDirtyBoard.ts:28-33`
   (`registerDirtySource` + identity-guarded clear) — ~50 LOC, cheap and idiomatic.
3. **The eslint boundary bites the type, not the data.** `eslint.config.js:36-46`
   `pencilMayNotImportGames` blocks `@games/**` from `src/pencil/**`. `ControlSection` is declared
   in `games/shared/GameControlPanel.vue:11-25`, so `GameCard`/`GalleryCard` must carry a
   **pencil-local structural twin** — exactly the trick `GameGallery/types.ts:3-11` already
   documents for `GalleryCard` vs the registry's `GameCard`. Precedent exists; cost is ~10 LOC.

**Verdict**: the schema route is `options(model)` + a staging bridge for the current game, and a
picker-local provisional store for the other four (handed to the game at mount). The `range`
caption is the right *slot* to overwrite and the wrong *data* to reuse.

---

## Q3 — THE CARD-MARGIN STAGING (geometry + soul gate + live face)

**Geometry.** `GameGallery.vue:420` `--card-w: min(78vw, 22rem)` → **352px max, 292.5px at a
375-wide viewport**. Slot padding `0.6rem` each side (`:477`) → card box **273.3px at 375**.
`.game-card-paper` padding `0.9rem 0.9rem 1.05rem` (`GameCard.vue:362`) → face width **244.5px**;
face is `aspect-ratio: 1/1` (`:370`). Caption band today: name SVG `height: 1.9rem` (30.4px, `:387`)
+ underline 8px (`:407`) + `.game-card-range` at `--type-body` (16→22px, `:417`). Card total ≈ **340px**.

Fitting the two sudoku selectors in mobile `options-row` grammar (`OptionSelector.vue:108-113`,
`gap: 0.25rem`, buttons `px-3 py-1.5 text-[1rem]`): `4×4 / 9×9 / 16×16` ≈ 213px;
`Easy / Medium / Hard` ≈ 214px. **Both fit inside 273px with room.** Two headings
(`--type-subheading` 20.4px × 1.2 = 24.5px, `typography.css:251-259`) + two rows ≈ **+125px**;
a Deal stamp at the card's own scale ≈ **+70px**. Card grows **340 → ~535px**. Gallery viewport
adds `padding-block: 1.5rem` (`GameGallery.vue:433`) and the pip row (`:486`, 0.55rem + 1.25rem gap).
Total column ≈ **604px**. Fits iPhone 16 (852) comfortably; **tight at 375×667** (iPhone SE) with
~60px of slack. Flag for the prototype lane, not a blocker.

**Soul gate — clean.** `GameCard.vue:230` `:inert="!isActive || undefined"` and `:44`
`isActive` already isolate the centered card; `GameGallery.vue:99-101` `poseFor(i)` feeds the one
`useBeatFrame` pose to center and `0` to flanks. Staging rendered under `v-if="isActive"` inherits
the gate for free — the same pattern the snap underline already uses (`GameCard.vue:270-275`
`v-if="isActive"`).

**Live face — no collision.** The live board mounts inside `.game-card-face` as
`.live-face-slot { position: absolute; inset: 0 }` (`GameCard.vue:320-325`); staging belongs in
`.game-card-caption` (`:256`, a sibling *below* the face). The projected board is
`pointer-events: none` (`GameScene.vue:119-123`) and its pull-tab is display:none there (`:126-128`).
So staging can coexist with `isLive` on the same card with zero geometry contention.

**Two real wiring hazards found:**

1. **Click bubbling.** `GameCard.vue:231` `@click.stop="onCardClick"` on the card root; `:182-184`
   `onCardClick()` emits `select` when `isActive && !guard`. `.stop` halts propagation *outward*,
   not inward — so an `OptionSelector` button click inside the caption **bubbles to `onCardClick`
   and exits the gallery** as well as changing the option. Every staging control needs its own
   `@click.stop` (the guard-ribbon buttons already do this: `GameGallery.vue:384,391`
   `@click.stop`).
2. **Snap re-bakes the outline.** `HandDrawnOutline.vue:53-59` observes its own box with
   `useResizeObserver`, and `:83-98` recomputes `generateRectBoilFrames(...)` from `width`/`height`
   on every change. Mounting staging only on the centered card makes **card height snap-dependent**,
   so every snap regenerates `BOIL_CONFIG.frameCount = 4` (`pencilConfig.ts:209`) grain-baked pose
   paths for *two* cards (the arriving centre and the departing one) plus a layout pass — precisely
   the class of work T4-P1 is chasing off Safari. **Mitigation is a design constraint, not a patch:
   reserve the staging band's height on every card** (render it on flanks too, `inert` +
   `opacity: 0`), so the card box is snap-invariant and the outline never re-bakes.

**Mark 4 — F4 is unusually clean, and this is its strongest engineering finding.**
Every piece it needs is already pose-baked or filterless:
- `HandDrawnOutline` accepts an externally-driven `:pose` (`:33-40`) and renders `frameCount`
  static filterless siblings, opacity-swapped (`:112-138`, `.boil-pose` at `:160-167`) — grain
  baked into geometry (`:79-82`, `FILTER_PRESETS["grain-outline"].grain`). **A Deal stamp framed in
  `HandDrawnOutline :pose="pose"` adds zero beat enrolments and zero new bakes.**
- `SheetWashiLabel` is static: seeded `clip-path` + tilt, `blur-0`, no filter (`:1-10, 66-87`).
- `OptionSelector`'s underline is a cached data-URI background (`scribbleUnderline`, 85 LOC), and
  its **only** live filter is `.ctrl-btn:hover { filter: url(#wobble-heart) }` **fenced to
  `@media (hover: hover)`** (`OptionSelector.vue:75-79`) — structurally unreachable on coarse
  Safari/iOS. The bake machinery for anything genuinely drawn is `pencil/composables/rasterPose.ts`
  (`readFilterDefs`/`bitmapsToUrls`, off-main-thread `convertToBlob`, `:64-72`).

---

## Q4 — THE MID-GAME GUARD (charter assumption **contradicted**)

The charter says: *"the mid-game guard (`guardIndex`, the keep/leave ribbon) already gates dirty
switches — dealing from the picker must ride the same guard, not grow a second confirm."*

**The guard as built is structurally same-game-exempt, and a green e2e spec locks that in.**

`GameGallery.vue:219` — the arm condition:

```
if (props.dirty && props.currentId != null && card.id !== props.currentId) {
```

`card.id !== props.currentId` is the gate. A dirty **same-game** select emits straight through.
Downstream it is a documented no-op — `App.vue:117-120`:

```
if (next === game.value) {
  if (opts?.cut) scene.value = next; // re-select the same game from the gallery: no-op cut
  return;
}
```

So **today, "open the picker and pick your own game" is a free look**: unfold, no swap, no seam,
board untouched. F4 converts that identical gesture into a board wipe.

And `e2e/gallery-guard.spec.ts:139-152` asserts exactly this:

```
test('guard: selecting the same game never asks, even when the board is dirty', ...
  await dirtyTheBoard(page);
  await viewport.press('Enter');
  await expect(page.locator('.gallery-guard')).toHaveCount(0);
```

**Consequences F4 must own:**
- The guard's condition must widen (`dirty && (differentGame || isDeal)`), which **turns
  `gallery-guard.spec.ts:139` red** — a deliberate contract change, not a regression.
- OR the drawer's existing coarse two-tap arm travels with Deal. That machinery is
  `GameControlPanel.vue:256-274` (`isCoarse && props.isDirty && !dealArmed` → 2.5s window,
  aria swap, `"sure?"` sublabel) and is asserted by
  `e2e/mobile-affordances.spec.ts:340-360`. Moving it is a port, not a second confirm — this is
  the parsimonious answer.
- Either way the **Deal stamp must be a distinct hit target from the card body**, else Enter
  (`GameGallery.vue:269-274` → `attemptSelect`) and a body tap both become destructive. The
  keyboard contract needs a second verb on the centered card, which the listbox model
  (`aria-activedescendant`, `:328`) does not natively supply.

---

## Q5 — THE DRAWER AFTERWARD (measured)

### Control inventory, desktop drawer, fine pointer, sudoku (13 controls / 25 rows)

Note: the desktop `OptionSelector` renders **vertically** — `flex flex-col items-center
md:items-stretch` (`OptionSelector.vue:28`) — so each option is its own row.

| | zone | element | rows |
|---|---|---|---|
| 1 | staged | `New game` eyebrow h2 (`:539`) | 1 |
| 2 | staged | `Size` h2 + 3 option buttons (`:543-555`) | 4 |
| 3 | staged | `<hr>` between sections (`:541`) | 1 |
| 4 | staged | `Difficulty` h2 + 3 option buttons | 4 |
| 5 | staged | Deal button (`:564-578`) | 1 |
| 6 | live | peek divider + washi (`:587-596`) | 1 |
| 7 | live | `Marks` h2 + 3 (`PencilModeToggle.vue`) | 4 |
| 8 | live | `Check` h2 + 3 (`AssistSettings.vue:60-71`) | 4 |
| 9 | live | `Candidates` h2 + 2 (`:75-88`) | 3 |
| 10 | live | action row — Clear/Fill/Solve/Share (`:613-673`) | 1 |
| 11 | live | play-controls — Undo/Redo/Hint, `display:none` on fine (`:916-928`) | 0 |
| 12 | live | KeyboardLegend, fine-only (`:709`) | 1 |

**Exiled by F4: rows 1-5 = 11 of 25 rows (44%).** Remaining: 14 rows.
Problem-brief item 2's "~7 near-identical stanzas" resolves to **5 heading+OptionSelector stanzas
(Size, Difficulty, Marks, Check, Candidates) + 1 eyebrow** — F4 removes **2 of the 5 stanzas**.

**Height estimate ≥768** (`--type-heading` 25.9px × 1.2 = 31.1; option `text-[1.25rem]` +
`md:py-0.5` ≈ 28px; `.controls-card p-5` = 40px):
staged ≈ 3 headings (93) + 6 options (168) + hr with `my-3` (25) + Deal ≈ 56 + margins 16 = **~358px**;
live ≈ 3 headings (93) + 8 options (224) + gaps 16 + divider `my-2` 18 + action row 44 + legend ~60
= **~455px**. Card ≈ **853px → ~495px** after exile: **−42%**.

### Mobile — the charter's mark-3 claim is overstated

`GameScene.vue:80` mounts the stacked card in `.mobile-board-width`, `scene.css:120-122`
`width: min(42rem, calc(100vw - 1.5rem))`.

**The mobile tab-toggle already does most of the compressing F4 would claim credit for.**
`GameControlPanel.vue:127` `showTabs = sections.length >= 2`, and `:376`
`v-show="!showTabs || expandedPanel === section.key"` — so **only one of the two staged sections is
ever visibly rendered on mobile**. The mobile staged footprint is therefore:
eyebrow (24.5) + tab row (~36) + one `options-row` (~38) + Deal (~56) + margins ≈ **~155px**.

Mobile live zone ≈ divider with coarse `padding-block: 1rem` (`:874-877`, ~34) +
3 × (heading 24.5 + row 38) = 188 + action row with sublabels ~56 + play-controls ~56 = **~334px**.
Card ≈ **490px + 12px padding ≈ 500px → ~345px** after exile: **−31%, not "halves".**

**Does the mobile card stop scrolling? No.** At 375×667: masthead + attribution ≈ 90px, board
≈ 360px, `.board-margin` in flow (`GameBoard.vue:812-820`) ≈ 30px, `.app-layout` gap `1.25rem`
(`scene.css:129`) = 20px, controls card 345px → **~845px against 667px of viewport**. The exile is
a real 31% cut and the card still scrolls. Charter mark-3 needs restating as "shortens", not "halves".

### Net-LOC (F4's strongest parsimony case, conditional)

Deletion side, measured:

| file | LOC | note |
|---|---|---|
| `GameControlPanel.vue` staged-zone excision | **~324** | 126 template (`:331-405` = 75, `:530-580` = 51) + ~110 script (`ControlSection` block `:1-26`, `triggerBoil` `:53-72`, `showTabs` `:125-127`, the four section helpers `:129-148`, `expandedPanel` `:150`, `newGameId` `:238-241`, `dealAnimating` `:245`, `onDeal` `:250-274`, the `sections` prop, the `deal` emit) + ~88 style (`.new-game-zone` `:730-736`, `.new-game-heading` `:738-744`, `.deal-row` `:746-752`, `.deal-btn` `:754-768`, `.crayon-*` `:775-791`, `.mobile-heading-*`/`.heading-value` `:936-973`) |
| `sudoku/ControlPanel/ControlPanel.vue` + test | **99 + 114** | pure relay once sections exile; `thermo`/`killer`/`kenken` already prove the wrapper is unnecessary (`KillerGame.vue:34`) |
| `futoshiki/ControlPanel/ControlPanel.vue` + test | **100 + 106** | same |
| **total deletable** | **~743** | |

Add side (estimate): pencil-local staging type (~12) + a staging bridge on the `useDirtyBoard`
pattern (~50) + two `OptionSelector` mounts + reserved band in `GameCard.vue` (~60) + a Deal-stamp
component in the card's grammar (~90) + the board-margin re-deal affordance (~60) + the widened
guard/ported arm (~30) ≈ **~300**. `game.ts`'s five `options:` blocks (5 × 17 = **85 LOC**) *move*,
they don't delete.

**Net ≈ −440 LOC.** Conditional on the two per-game `ControlPanel.vue` wrappers actually dying —
that's 419 of the 743, over half the win.

---

## Q6 — THE FAILURE MODE (the question that decides the family)

Charter: *"does mid-game re-deal ('same game, harder') now cost open-gallery + deal — more taps
than today's drawer Deal? This question decides the family."*

**Answer: yes on desktop, no on mobile. F4 must ship a board-margin re-deal affordance or it
regresses the app's most frequent verb.**

Today, "same game, harder":

| regime | path | taps | nav cost |
|---|---|---|---|
| ≥1024, drawer **open** (the default — `useControlsDrawer.ts:66-72` `readStored()` returns true unless `"0"`) | Difficulty option → Deal | **2** | 0 |
| ≥1024, drawer closed | tab → Difficulty → Deal | 3 | 520ms glide |
| <1024 (no drawer — `useControlsDrawer.ts:16-18` "the drawer exists at ≥1024 ONLY") | scroll → `Difficulty` tab (`:340-362`) → `Hard` → Deal, **+1 if dirty on coarse** (`:260`) | **3-4** | 1 scroll gesture |

F4's picker path (same for every regime):

wordmark (`App.vue:409` `@open="enterGallery"`) → the current game is **already centered**
(`App.vue:325` `openGallery(game.value)`; `useGameGallery.ts:66-71` `snappedIndex = indexOfId(fromId)`)
→ difficulty on the card → Deal stamp = **3 taps + 1240ms of choreography** (720ms in, 520ms out).

**Verdict**: desktop-with-drawer-open regresses **2 → 3 taps** *and* adds 1240ms of animation and a
full view change to a routine act. Mobile improves **4 → 3** and kills the scroll. So F4 is a clear
mobile win and a desktop regression on the one verb users hit most.

**The shortcut the charter asks for — the host already exists with a precedent.**
`GameBoard.vue:748` `<div class="board-margin">`, styled `GameBoard.vue:812-831`:

```
.board-margin { margin-top: 0.4rem; ... pointer-events: none; }
@media (min-width: 1024px) {
  .board-margin { position: absolute; top: 100%; inset-inline: 0.25rem; z-index: 50; }
}
```

At ≥1024 it is an **absolute overlay anchored to the board square, z-50, zero layout cost** — the
exact geometry a re-deal affordance wants. The strip is `pointer-events: none` and the comment at
`:808-810` names the precedent: *"the error card re-enables them on itself"* (`SolverErrorNote`,
`GameBoard.vue:761-766`). So a margin re-deal affordance is a sibling in an existing host with an
existing pointer-events idiom — and at <1024 the same strip is in flow, so it rides the board on
mobile too.

`enterGallery` is already reachable three ways — wordmark (`App.vue:409`), `g`
(`App.vue:358-367`), `?view=gallery` (`useGameGallery.ts:44-50`) — so the gallery route needs no
new door; only the *bypass* does.

---

## Q7 — PRIOR ART (background)

- **NYT Games** — the redesign put all games, archives and packs in one place, and game cards
  reflect progress the moment you start; **Pips is the first NYT game with per-entry difficulty
  (easy/medium/hard, three puzzles daily)** — i.e. difficulty-at-entry is a live, shipped pattern,
  but chosen *after* the card, not on its face.
- **Balatro** — the transferable law is *feedback proportional to significance*: short,
  meaning-driven animation; high-intensity effects reserved for high-impact events; card movement
  carries simulated inertia with magnetic damping on snap. Read against Q6: a **1240ms ritual for a
  routine re-deal inverts this law** — the ceremony belongs on the *game switch*, not the re-deal.
- **Tarot-spread UIs** — digital spreads automate shuffle/cut/deal while enforcing sequential stage
  completion; the commit moment splits into two patterns (place face-up as you go vs. lay all down
  then reveal). One case study reports real friction in "pick a card" — decision anxiety at the
  selection step, which argues for the staging being *pre-filled and quiet* (it is: `pendingSize`
  and `difficulty` both carry a current value), never an empty form gating the deal.
- Solitaire/Apple News+ entry flows: not substantiated in this pass; carry to pass 2 if the
  prototype lane needs the deal-cadence reference.

Sources: [Creative Review — NYT Games](https://www.creativereview.co.uk/new-york-times-games-wordle-crossplay-design-jonathan-knight/) ·
[Balatro design analysis](https://medium.com/@yyh19971004/balatro-design-analysis-visual-packaging-and-interactive-feedback-cc6fa6a65370) ·
[Balatro art direction](https://halabaojia.com/collection/20260212-balatro-visual-design-analysis/) ·
[Tarotsmith spreads](https://tarotsmith.com/spreads/) ·
[Tarot app case study](https://www.adamdouglaspatterson.com/lxd-case-study)

---

## MEASUREMENTS

| # | quantity | value | source |
|---|---|---|---|
| M1 | `GameControlPanel.vue` total LOC | **1025** | `wc -l` |
| M2 | staged-zone excision from the shell | **~324 LOC** (126 tpl + 110 script + 88 style) | line ranges in Q5 |
| M3 | per-game panel wrappers deletable | **419 LOC** (sudoku 99+114, futoshiki 100+106) | `wc -l` |
| M4 | total deletable / added / **net** | 743 / ~300 / **≈ −440 LOC** | Q5 |
| M5 | `game.ts` `options:` block, each game | **17 LOC × 5 = 85** (moves, not deletes) | `awk` over the five `game.ts` |
| M6 | drawer control rows, desktop fine, sudoku | **25 total; 11 exiled (44%); 14 remain** | Q5 table |
| M7 | drawer content height, desktop | **~853px → ~495px (−42%)** | Q5 arithmetic |
| M8 | mobile controls-card height | **~500px → ~345px (−31%)** | Q5 arithmetic |
| M9 | mobile card still scrolls at 375×667 | **yes — ~845px of content vs 667px** | Q5 |
| M10 | heading+OptionSelector stanzas | **5** (Size, Difficulty, Marks, Check, Candidates); F4 removes **2** | Q5 |
| M11 | card slot width | `min(78vw, 22rem)` = **352px cap / 292.5px @375** | `GameGallery.vue:420` |
| M12 | card box / face width @375 | **273.3px / 244.5px** | `GameCard.vue:362,370` + `:477` |
| M13 | card height with staging | **~340px → ~535px**; column ~604px | Q3 |
| M14 | Deal affordance today | **28px `DiceIcon`** + caption sublabel | `GameControlPanel.vue:396,570` |
| M15 | choreography per picker round-trip | **1240ms** (200 chromeLeave + 520 fold in + 520 unfold) | `pencilConfig.ts:149,155` |
| M16 | deal-stagger constants | base = `round(520 × 0.42)` = **218ms**, stagger **90ms** outward | `GameGallery.vue:151-152` |
| M17 | `cardStepMs` (depth transition) | **440ms** | `pencilConfig.ts:142` |
| M18 | `BOIL_CONFIG.frameCount` / `intervalMs` | **4** / **150ms** (~6.7fps) | `pencilConfig.ts:209-210` |
| M19 | re-deal taps: today vs F4 | desktop-open **2 → 3**; mobile **3-4 → 3** | Q6 table |
| M20 | `range` census | **5 producers, 1 consumer, 0 tests** | Q2 |
| M21 | e2e specs asserting the drawer Deal selector | **7 call sites across 5 spec files** (`visual-regression` ×4, `futoshiki`, `sudoku-interaction`, `permalink` ×2, `mobile-affordances`) + 2 unit specs (`sudoku`/`futoshiki` `ControlPanel.test.ts`) | grep `Deal a new board` |
| M22 | existing module bridges (the pattern to copy) | **4** — `useLiveFace` 36, `useDirtyBoard` 48, `useControlsDrawer` 353, `useGameGallery` 103 | `wc -l` |
| M23 | pencil pieces needing **zero** new bakes | `HandDrawnOutline` (`:pose` + 4 filterless pose siblings), `SheetWashiLabel` (static clip-path), `OptionSelector` (data-URI underline; only filter is hover-fenced) | Q3 |

---

## CONTRADICTIONS

**C1 — "the dead caption becoming the live control is the family's parsimony jewel: the data's
already there." Half false.** `range.levels` is `<sizeOptions>.map(o => o.label)`
(`registry.ts:165`) — **labels only**. No `value`, no `selected`, no `onChange`, and **no
difficulty axis anywhere on a card row**; all five cards hardcode `label: "size"`, which even
mis-names futoshiki's and kenken's own `"Board Size"` heading (`futoshiki/game.ts:37`,
`kenken/game.ts:41`). The caption *is* free to overwrite (1 consumer, 0 tests — M20), but the
control's data must come from `GameDefinition.options` (`registry.ts:101`), not from `range`.

**C2 — "dealing from the picker must ride the same guard, not grow a second confirm." The guard
cannot cover it, and a green spec forbids the fix.** The arm condition requires a *different*
game: `GameGallery.vue:219` `card.id !== props.currentId`. A dirty same-game select emits straight
through and `App.vue:117-120` treats it as a **documented no-op cut** — today that gesture is a
free look at your own board. `e2e/gallery-guard.spec.ts:139-152` asserts
`.gallery-guard` count 0 for exactly "dirty + same game". F4 must either turn that spec red
(widen the guard) or **port** the drawer's coarse two-tap arm (`GameControlPanel.vue:256-274`,
asserted by `e2e/mobile-affordances.spec.ts:340-360`) onto the stamp. The port is the
parsimonious reading of "not a second confirm" — but it is coarse-only, so **fine-pointer desktop
gets no protection at all** for a destructive act that today lives a full peek-divider away from
the play tools ("spatial prophylaxis", `GameControlPanel.vue:582-586`). F4 dissolves that
prophylaxis by construction and must replace it.

**C3 — "mobile gains most: the tall card halves." Overstated: −31%, and the card still scrolls.**
The mobile tab-toggle already renders only ONE of the two staged sections
(`GameControlPanel.vue:127` + `:376` `v-show`), so the staged zone's mobile footprint is ~155px of
a ~500px card (M8). Post-exile the stacked column is still ~845px against 667px at 375×667 (M9).
The compression F4 would claim is already banked by the tab-toggle it deletes.

**C4 — "the drawer's staged zone dissolves to a 'new game' shortcut that opens the gallery" — that
door already exists three times over.** `enterGallery` is reachable from the wordmark
(`App.vue:409`), the `g` key (`App.vue:358-367`), and `?view=gallery` (`useGameGallery.ts:44-50`).
A fourth in-drawer door adds a control to the surface F4 is subtracting from. The affordance the
family actually needs is the **opposite**: a re-deal *bypass* that never opens the gallery (Q6).

**C5 — the staging schema needs a live model, and the model is not reachable.** `options` is
`(model: TBoard) => ControlSection[]` (`registry.ts:101`) over `m.pendingSize` / `m.difficulty`
(`sudoku/game.ts:35-43`), and `useSudoku` is a **plain factory** (`useSudoku.ts:42`), not a
singleton — no bridge exposes the mounted scene's instance, and four of five games are unmounted
lazy chunks (`registry.ts:180-208`). Calling `options(model())` in the picker constructs a second
`useGameState` with its own `resolveInitialState()` + `queueSave()` persist watcher. The charter
reads the registry move as a data reshape; it is a **state-ownership relocation** — staging must
move out of the per-game model into a picker-owned provisional store handed to the game at mount.
This is the family's largest unpriced item.

**C6 — a mark-4-adjacent hazard the charter does not anticipate.** `HandDrawnOutline` re-derives
its `frameCount = 4` grain-baked pose paths whenever its box resizes
(`HandDrawnOutline.vue:53-59, 83-98`). Mounting staging on the centered card only makes card
height snap-dependent, so **every snap triggers a layout + a 2-card path regeneration** — new
per-gesture work on the exact surface T4-P1 is curing. Fix is a constraint, not a patch: reserve
the staging band on all five cards (`inert` + `opacity: 0` on flanks) so the box is snap-invariant.

**C7 — minor: "staging" is already asymmetric.** Only `pendingSize` is provisional; difficulty is
a live write (`SudokuGame.vue:161,168`; `useGameState.ts:471-479`). The charter's "size/difficulty
pencilled in the card's margin" implies one staging mode for two axes that behave differently
today. Harmless if inherited knowingly; a bug source if the family assumes both are pending.

---

## OPEN QUESTIONS (for SYNTHESIZE/PROTOTYPE)

1. **Does the Deal stamp get its own hit target, and what is its keyboard verb?** The listbox
   contract (`aria-activedescendant`, `GameGallery.vue:328`) gives the centered card exactly one
   activation (`Enter`/`Space` → `attemptSelect`, `:269-274`). A second destructive verb on the
   same card needs a key (`d`? `Shift+Enter`?) that does not collide with the global `g`
   (`App.vue:358-367`) and does not break the APG listbox reading.
2. **Where does provisional staging live between picker visits?** Picker-local store, `?size=`/
   `?difficulty=` URL round-trip (already validated — `useUrlState.ts:39-52`), or a fifth module
   bridge? The URL route is the most parsimonious and already has the codec.
3. **What happens on the four non-current cards?** Their staging has no model. Show the current
   defaults from the registry constants (read-only until selected), or make the picker the owner
   for all five? The latter is cleaner and larger.
4. **Does the re-deal margin affordance make F4's picker-staging redundant on desktop?** If the
   bypass carries difficulty too, the card staging serves only first-entry and game-switch — which
   is arguably correct (Balatro's proportionality law) but shrinks the family's claimed mark-1
   coverage.
5. **The 375×667 fit** (M13: ~604px column in 667px). Needs a real measurement on the booted
   `perf-rig-iphone16` sim, not arithmetic — and a decision on whether the size row collapses to a
   stepper at the narrowest rung.
6. **Cost of the 7 e2e + 2 unit Deal call sites** (M21). All target
   `.controls-card button[aria-label="Deal a new board"]`; F4 re-homes that button, so every one
   is a mechanical re-point plus `gallery-guard.spec.ts:139` as a genuine contract change.
7. **Does the `crayon-*` difficulty-tone derivation survive the move?** `activeColorClass` reads
   `colorClass` off the selected option (`GameControlPanel.vue:133-139`) and the three tints are
   AA-corrected ink tiers (`:775-791`). In the card that logic has to re-land in pencil, where
   `colorClass` arrives as an opaque string — fine structurally, but the AA ledger
   (`assets/index.css`) must be re-verified against `--color-card` inside the card face.
