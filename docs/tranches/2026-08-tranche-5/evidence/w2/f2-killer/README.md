# T5-W2 F2 — KILLER ON THE FROZEN CONTRACT

**Lane** Opus, under the Fable team lead · **opened/closed** 2026-08-01 · **base** F1's tree
(`baae148b` + F1's working diff) · **tree** working, uncommitted — the lead commits.

The charter of record is `../wave-open.md`; the template is `../f1/` and the post-F1 sudoku
game dir. This directory is F2-killer's evidence:

| File | What it holds |
|---|---|
| `00-before.txt` | killer at F1's tree — 14 files, 1,241 raw, its `@games/registry` edges |
| `10-kill-list.txt` | the twin-file kill list, `wc -l` before/after, the residue exports |
| `20-probes.txt` | the exit probes re-derived here, incl. the V1-STUB tail's SHA proof |
| `30-after.txt` | unit / types / prettier / eslint on this tree, with the concurrency caveat |

---

## What landed

**Killer has no scene, no board and no declaration. It has a spec.**

- `games/killer/spec.ts` — the union `GameSpec`, seven slots plus the clue seam whole.
  `grammar` says *boxed* and the shell derives from that one word what `KillerBoard` spent 264
  lines restating: the √n tick count, the box peer band, the boxed conflict derivation, the
  B-0 request clause, the UI-13 whisper. `clues` carries the ONE divergence the twin files
  existed for.
- `games/killer/spec.test.ts` — `game.test.ts`'s successor, 8 cases against 5.
- **Dead:** `KillerGame.vue` (145), `KillerBoard.vue` (264), `game.ts` (54), `game.test.ts`
  (91). **−554 raw**; the dir goes 1,241 → 887 and 12 → 10 non-test files.
- `games/cards.ts` — killer's row swaps `scene` for `load`, the F1 pattern.

**One codec, two consumers.** `clues.encode/decode` names `killerWire`'s length-prefixed cage
buffer — the pair the Worker already speaks. The seam that DRAWS a cage and the seam that
TRANSMITS one can no longer drift, and 2.4's shared permalink inherits a codec that is already
proven rather than a fifth one written for it.

**Three residue exports, no new modules.** `nodeBudgetForSize` (useKiller), `STORAGE_KEY`
(killerUrlState) and `prewarm` (solver/useSolver) were already written and already correct;
they were module-private. The spec NAMES them, so killer's node-budget table, its board key and
its worker warm each still have exactly one home. `prewarm` is the F1 `SolverSpec` amendment
landing on its second game: killer never had one (its `useSolver` said so in a comment where the
export belonged), so a lazy game now warms its wasm on its own mount instead of at first deal.

## Fences — held

```
src/games/shared/GameControlPanel.vue          — 0 changed lines
src/games/shared/GameScene.vue                 — 0 changed lines
src/pencil/chrome/GameGallery/GameGallery.vue  — 0 changed lines
```

And the lead's F2 freeze, held whole: this lane wrote **nothing** under `games/shared`, nothing
in the gallery, nothing in `registry.ts`, nothing in `App.vue`, and nothing in another game's
directory. Its entire diff is `src/games/killer/**` plus killer's row in `cards.ts` and the two
assertions in `cards.test.ts` that row obliges.

## π — not taken

The charter puts the π gate after the barrier, in F3. No build, no playwright, no goldens, no
preview server; `:3000`/`:3001`/`:4288` untouched, no `:4188` opened. What this lane can say
about pixels it says by construction, and the derivation is in `20-probes.txt`: every render
input `KillerBoard` computed is re-derived identically by `BoardHost` from `geometry: "boxed"`
— `subgridSize` (`size` ≡ `√(size²)`), `conflictsFn`, `peersFn`, `gridLabel`'s difficulty word
(`DIFFICULTY_WORD[d]` ≡ `d.toLowerCase()` on all three tiers), `freshBoardCopy`, `idleGradeHint`
— and the laminate's sub-grid root likewise. **One exception, and it is a real pixel: see
AMENDMENT 2.**

## Slot census — 8/8, with one gap recorded rather than papered

| Slot | Read by | Count |
|---|---|---|
| `id` | `App.shellFor` displayName · `cards.test` id ⇄ row identity | 2 |
| `model` | `GameShell:56`, the one instantiation at mount | 1 |
| `grammar` | `BoardHost` ×6 (subgrid · label · conflicts · peers · announce · hint) + the cell's `geometry` prop + `GameShell.laminateSubgrid` | 8 |
| `clues` | `BoardHost` overlay `v-if` · `:is` · `clueProps` | 3 |
| `furniture.cell` | `BoardHost` `#cells` | 1 |
| `solver.nodeBudget` | killer's own domain slot in `useKiller` | 1 |
| `solver.prewarm` | `GameShell` first idle tick | 1 |
| `urlCodec.key` | `cards.test` cross-check — **0 production reads** | 0 |
| `deal.options` | `GameShell.sections` → `GameControlPanel` | 1 |

**The gap, named.** `urlCodec.key` has no production consumer for a LAZY row. Sudoku's card can
name its spec's key because sudoku is eager; killer's cannot without dragging the spec (and its
model, and its solver client) into the main chunk — the same measured reason `poster` lives on
the row. So killer's key is spelled in `cards.ts` and owned in `killerUrlState.ts`, and the new
universal assertion in `cards.test.ts` (`spec.urlCodec.key === card.persistKey`, every migrated
row) is what keeps the two from drifting until 2.4's shared persistence gives the slot a real
reader. This is F1's `solver.nodeBudget` gap in a second dress, and it closes at the same step.

---

## FOR THE LEAD — three amendments the BARRIER owes, and one blocked row

F1's grammar was that a lane RAISES what the shared surface owes and the lead lands it (F1 §3,
the clue-conflict seam). These are raised the same way. **Every one of them is needed by all
four clue lanes, not by killer alone** — which is precisely why they belong at the barrier and
not in any lane's diff.

### AMENDMENT 1 — the clue VALUE never reaches `BoardHost`. (blocks mount)

`BoardHost:34-37` declares `clue?: unknown` and `:139-141` computes
`spec.clues.props(props.clue, boardSize)`. **`GameShell:145-153` never binds it.** Sudoku's
`clues` is `null`, so the branch is dead on the proof game and F1 could not have caught it. For
killer, `props.clue` is `undefined` and `cageFigures(undefined)` throws at mount.

The lane will not paper this: a defensive `?? []` in `clues.props` would be exactly the masking
fallback the wave's own law forbids, and it would ship a board that silently draws no cages.

**Proposed cure — one field on the seam, and `BoardHost.clue` dies:**

```ts
// defineGame.ts, ClueSeam<TClue>
/** where this game's live clue sits on its own model — the seam already knows. */
read: (model: TModel) => TClue;
```
```ts
// BoardHost.vue — the prop and its `clue?: unknown` declaration both go
const clueProps = computed(() =>
  props.spec.clues
    ? props.spec.clues.props(props.spec.clues.read(props.model), boardSize.value)
    : null,
);
```

Killer's line is `read: (m) => m.cages.value` — one expression, in its spec, where killer already
says what its clue IS. `read` belongs on the SEAM rather than as a `clue` slot on `GameModel`
because the four games name their clue differently (`cages`, `inequalities`, `lines`, `cages`),
and a shell-side rename would be the config-flag disease under another spelling.

### AMENDMENT 2 — the clue layer's leave fade has no home. (the one moved pixel)

F6 beat 1: on a page-turn the clue furniture leaves WITH the grid. `GameBoard:855-857`'s shared
rule covers `.board-cells`, `.board-margin` and `.completion-vignette` only — the `#overlay`
slot is their SIBLING, so each of the four boards carried its own copy in its own scope (at F1's
tree: `KillerBoard:259`, `ThermoBoard:250`, `KenKenBoard:227`, `FutoshikiBoard:313`), all four
byte-alike but for the class name. `BoardHost` renders the overlay bare, so all four copies die
with the boards and nothing replaces them: **the cages would stop fading out on a game switch.**

That is a moved pixel, and by §3 a moved pixel is a defect. It is also a clean 4 → 1:

```vue
<!-- BoardHost.vue -->
<template v-if="spec.clues" #overlay>
  <div class="clue-layer" aria-hidden="true">
    <component :is="spec.clues.overlay" v-bind="clueProps ?? {}" />
  </div>
</template>
```
```css
.clue-layer { position: absolute; inset: 0; z-index: 1; pointer-events: none; }
@media (prefers-reduced-motion: no-preference) {
  .board-leaving .clue-layer { opacity: 0; transition: opacity 200ms var(--ease-fadeOut); }
}
```

The wrapper's four static declarations are byte-for-byte the dead `.killer-clue-layer` rule and
duplicate what `CageOverlay`'s own root already sets, so the resting frame does not move; only
the leave beat is restored. The `aria-hidden` also moves up from `KillerBoard`'s wrapper, where
it was.

### AMENDMENT 3 — `App.sceneFor` has no `load` arm for a LAZY migrated row.

`App.vue:84` is `loader: card.scene!`. A migrated lazy row has `scene === undefined`, so
selecting killer today hands `defineAsyncComponent` an undefined loader. F1's own comment at
`:81-83` names the cure verbatim — `loader: async () => shellFor(await card.load())` — and
`preloadScenes` at `:211` already reads `(card.scene ?? card.load)!`, so the warm path needs
nothing. One edit, five games, and the two-arm union collapses when the last lane lands.

**Between this lane's close and that edit, killer does not mount.** Declared, bounded to the
lead's own barrier, and gone before VERIFY — the interim the F1 pattern anticipated when it wrote
that comment.

### FOR THE LEAD 4 — a trap worth a class invariant, hit twice in one hour

`vue-tsc` rejects `mount(CageOverlay, { props: seam.props(...) })`: `ClueSeam.props` returns
`Record<string, unknown>` by contract — that erasure is the whole point of `v-bind` on a
`:is` — and it is not assignable to a CONCRETE component's props. This lane hit it and cured it
by mounting the way the board does, off the erased pair (`mount(seam.overlay, { props:
seam.props(...) })`), which is a stronger claim as well as a typing one. The kenken lane hit the
identical error three times in the same window (`kenken/spec.test.ts:83,108,113`) and has since
cured it — `vue-tsc` is clean there as of this close. **Second occurrence ⇒ the class invariant
is owed:** a clue-seam test that names its overlay concretely is testing a component, not a seam.
Worth one line in the F3/VERIFY checklist rather than a third diagnosis.

---

## BLOCKED — "the V1-STUB codec dies, one persistence serves all five"

**Not executed. It is not executable from a lane whose fences freeze `games/shared`, and it
should not be executed here even if it were.** Three reasons, each checkable:

1. **There is no shared persistence to serve five games.** F1 created `games/shared/selectors.ts`
   but no `persistence.ts`; the wave-open §1.1 urlCodec row assigns that module to the step that
   also universalizes `?board=`. Writing it from the killer lane means writing into the frozen
   shared surface, and three-way with the other F2 lanes.
2. **Even the narrow reading — delete killer's three empty no-ops — needs a shared type change.**
   `useGameState`'s domain slot declares `syncToUrl`, `persist`, `clearPersisted`,
   `dropBoardParam` and `writeShareUrl` as REQUIRED (`useGameState.ts:147-155`, no `?`). Killer
   cannot stop passing them until that interface says they are optional.
3. **The behaviour it implies is an OWNER RATIFICATION row, and it is not F2's.** wave-open 2.4d
   is the wave's single disclosed behaviour break — thermo/killer/kenken gain a real permalink
   and the v0 ratchet dies — gated at §1.4.1 and §5.3. Landing a real `?board=` for killer alone,
   ahead of the ratification and ahead of the shared codec, would mint a codec variant to be
   rewritten days later. F1 set the precedent in the other direction: sudoku's `useUrlState.ts`
   is still standing, and sudoku's residue is listed as "model, **codec**, technique, selectors,
   solver, poster, templates".

**What the lane banked instead is the proof, measured so 2.4 does not have to re-derive it**
(`20-probes.txt`): the three stubs' code tail — `boardLink: "absent"` + `dropBoardParam` +
`writeShareUrl` — hashes **`bf9135dc36d6` ×3, byte-identical**. The fourth member, `syncToUrl`,
diverges in a PARAMETER NAME alone (kenken `_boardSize`, thermo/killer `_size`) — no body, no
behaviour. The axis always could collapse; it collapses at 2.4, with the owner's word.

## Test delta, itemised

```
− killer/game.test.ts   (whole file, 5 cases) — its GameDefinition type assertion moved to the
                          DECLARATION: defineGame constrains TModel extends GameModel, so a
                          killer model that failed the shell's read contract could not be
                          written. Its three runtime claims are re-derived below.
+ killer/spec.test.ts   (whole file, 8 cases)
    · every slot the shell reads, present and of its kind         (new)
    · the clue seam is furniture + a codec, never a boolean       (was "declares the clue furniture")
    · a size + difficulty section over the live model             (kept, + the bands are the card's)
    · the board's key on disk has one source                      (new)
    · the node budget scales off the RAW selector size            (new)
    · the seam DRAWS a dotted boundary + corner sums              (was: called cageFigures directly —
                                                                   now through overlay ∘ props, one
                                                                   link longer, the board's own path)
    · nothing for an empty cage set                               (kept)
    · the seam's own wire codec round-trips losslessly            (was: killerWire directly)
  cards.test.ts stays 7 cases; two gained assertions —
    · the migrated roster grows by this lane's id
    · spec.urlCodec.key === card.persistKey, EVERY migrated row (the lazy row's drift guard)
```
