# T5-W2 F2-KENKEN — THE FIFTH GAME ONTO THE FROZEN CONTRACT

**Lane** Opus, under the Fable team lead · **opened/closed** 2026-08-01 · **base** `e63af853`
+ F1's working tree · **tree** working, uncommitted — the lead commits.

The charter of record is `../wave-open.md`; the F1 pattern this lane copies is `../f1/`.

| File | What it holds |
|---|---|
| `00-before.txt` | kenken at HEAD — its 15 files, 13 by the 2.1e count, 1,324 non-test raw |
| `10-kill-list.txt` | the twin-file kill list, `wc -l` before → after, and the net |
| `20-probes.txt` | every exit probe re-derived at banking, with its command |
| `30-slot-census.md` | the 2.1b census for kenken — 8/8 slots, 17 read expressions, one named gap |
| `40-after.txt` | the gates at close, the fence diff, and the complete file list |

---

## What landed

**KenKen is a `GameSpec` and nothing else.** `src/games/kenken/spec.ts` — 86 lines — replaces a
scene, a board adapter, a declaration and their test: 535 lines gone from disk, no module
reference left behind.

- `grammar` carries what `KenKenBoard` used to hard-code. `geometry: "latin"` is the BOXLESS
  grid (`subgridSize = side`, so `HandDrawnGrid` draws one box, i.e. none), the row/column peer
  band, and the cage-blind Latin conflict derivation — the three things that board branched on.
  `requestVoice: false` and `gradeHint: false` are the two marginalia clauses it printed for
  neither: no difficulty word in the grid label, no "— you asked for" clause in the margin, no
  idle grade whisper handed to `GameBoard`. Divergence as DATA, per the wave header.
- `clues` carries the operator cages whole — `CageOverlay` + kenken's own corner-text mapping
  (`clue.ts`, F1's) + `kenkenWire`'s codec pair. One codec, two consumers: the seam that DRAWS a
  cage and the seam that TRANSMITS it are now the same object, so they cannot drift.
- `solver`, `urlCodec` and `deal` name kenken's own residue rather than mirroring it —
  `nodeBudgetForSize`, `STORAGE_KEY` and `prewarm` gained an `export` keyword each, and the
  spec reads those, so every fact has one home. `solver/useSolver.ts`'s NOTE saying `prewarm`
  had "no consumer yet" was true until this lane; F2 is the consumer, so the note dies with it.
- The table's kenken row swaps `scene` for `load` — the minimal per-game registration F1
  established — and `cards.test.ts`'s migrated-row ledger gains its fifth id.

`game.test.ts` becomes `spec.test.ts`. Its `GameDefinition<…, KenKenCage[]>` type assertion is
gone because it moved to the DECLARATION (`defineGame` constrains `TModel extends GameModel`), and
its furniture test stopped naming `CageOverlay` and hand-building props: it now mounts
`spec.clues.overlay` with `spec.clues.props`' own output — the erased pair `BoardHost` binds — so
what is proved is KENKEN'S SEAM drawing a cage, not that a component renders. 6 assertions became
10, and the operator round-trip runs through `clues.encode`/`clues.decode` rather than the wire
module directly.

Green: **341 unit executed / 31 files / 0 failed** (kenken's own share: 13) · `vue-tsc -b` 0 ·
eslint clean · prettier clean · knip no kenken rows · boundary net delta 0.

## Fences — held

```
src/games/shared/GameControlPanel.vue         — 0 changed lines
src/games/shared/GameScene.vue                — 0 changed lines
src/pencil/chrome/GameGallery/GameGallery.vue — 0 changed lines
```

Nor did this lane write one byte under `games/shared`, in `registry.ts`, in `App.vue`, or in any
other game's directory. Its whole footprint is `src/games/kenken/**` + `cards.ts` + `cards.test.ts`
(`40-after.txt` lists it).

## THE BARRIER — this lane confirms both of thermo's rows, and adds a third

**Read `../f2-thermo/20-barrier.md` first — it states the two shared defects and their cures.**
This lane reached both independently before reading it and adopts its shape verbatim rather than
proposing a second one. Restated in one line each, with kenken's confirming evidence:

1. **`App.sceneFor`'s lazy arm** (`App.vue:84`, `loader: card.scene!`) resolves `undefined` for
   every migrated row. kenken's row is now `load`-only, so selecting kenken cannot mount until
   the arm becomes `async () => shellFor(await card.load!())` — which is what App.vue's own F1
   comment says it becomes. **Until it lands, no migrated row mounts, kenken's included.**
2. **`GameShell` never binds `:clue`**, so `BoardHost.vue:140` spends `props.clue === undefined`
   and the cage overlay mounts with a required prop absent. `ClueSeam` has no member that can
   name the model field the clue lives on, so the cure is the amendment thermo raised — a fifth
   member, `from: (model) => TClue`. **kenken's line is `from: (m) => m.cages.value,`** and it is
   purely additive: `kenkenSpec.clues` is written to the table exactly as fixed at open.
3. **The clue layer's page-turn fade has lost its home** (this lane's row, small, and the same
   for futoshiki/killer). `KenKenBoard.vue:215-231` wrapped the overlay in a
   `div.kenken-clue-layer` whose only jobs were positioning (identical to `CageOverlay`'s own
   `position:absolute; inset:0; z-index:1; pointer-events:none` — so no pixel moves without it)
   and the F6 beat-1 rule `@media (prefers-reduced-motion: no-preference) { .board-leaving
   .kenken-clue-layer { opacity: 0; transition: opacity 200ms var(--ease-fadeOut) } }`. The
   wrapper is gone with the board — `KenKenPoster.vue` already mounted `CageOverlay` bare, which
   is F1's precedent — and this lane did NOT re-home the rule as a per-game wrapper component,
   because killer would need a twin of it and twins are what this wave kills.
   **The cure is already precedented on this tree:** the thermo lane re-homed the identical rule
   off its retired `.thermo-clue-layer` wrapper onto its own overlay's root SVG
   (`ThermoTube.vue:110-116`). KenKen cannot copy that move because its overlay is the SHARED
   `CageOverlay`, which killer also mounts. So the same rule wants the same home — one rule, both
   cage games, in the component that owns the class:
   ```css
   /* src/games/shared/CageOverlay.vue — F6 beat 1, moved off the retired per-game wrappers
      onto this SVG, same property, same beat (the ThermoTube.vue:110 precedent, verbatim).
      Inert on the posters, which have no leaving state. */
   @media (prefers-reduced-motion: no-preference) {
     .board-leaving .cage-overlay {
       opacity: 0;
       transition: opacity 200ms var(--ease-fadeOut);
     }
   }
   ```
   **Disclosed as a behaviour delta, not a pixel one:** the static board is byte-identical
   without the wrapper (`CageOverlay`'s own root already carries `position:absolute; inset:0;
   z-index:1; pointer-events:none`, and the wrapper had no other effect), and no golden covers
   the page-turn. Grepped: **zero assertions anywhere in `src/**` or `e2e/**` name
   `.kenken-clue-layer`** — the class was a CSS hook only.

## Deferred, with named causes

- **The V1-STUB codec does not die here.** The charter's F2 line says it should, and this lane
  measured the proof it always could (`20-probes.txt` §6: the three stub tails are 28 lines,
  21 byte-identical, the three empty bodies identical in all three). But killing it means
  writing the real `?board=` permalink for kenken, which (a) needs the ONE `shared/persistence.ts`
  that does not exist yet and cannot be written from inside `src/games/kenken/`, and (b) IS the
  wave's single disclosed behaviour break — wave-open 2.4d, an **owner ratification row**, gated
  at §5.3. A lane that shipped it would have spent the owner's ratification without asking.
  It belongs to 2.4/F3 with the one persistence module. The killer lane deferred it identically.
- **`solver.nodeBudget` is a spec-internal read**, not a shell read — the same honest gap F1
  recorded for sudoku, collected at F3 when `createSolverClient` lands.
- **kenken's 5 boundary rows stay** (all `@games/futoshiki/*`: the `Difficulty` type ×4 and the
  Latin technique engine ×1). Net delta 0 — `game.ts` carried one of the five and `spec.ts`
  carries the same one. They are 2.5's rows, and they go green when those two surfaces move to
  `games/shared`.

## For the lead

1. The barrier's three rows above. Rows 1 and 2 are **blocking for every migrated game**; row 3
   is this lane's, small, and cosmetic-on-page-turn.
2. `productionSlotReads`: kenken banks **8/8 slots, 17 read expressions** (13 shell-side, 4
   table-side) — the same shape sudoku banked. Four of five games are in.
3. The unit figure on this shared worktree is **341/31 files**, not attributable to one lane;
   kenken's own is **13**. Whichever number the seal cites should say which it is.
