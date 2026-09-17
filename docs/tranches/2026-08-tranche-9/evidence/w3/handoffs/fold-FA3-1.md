> **RECORD ONLY 2026-09-17** — a fence correction, not a seam: it documents FA3's hunk-for-hunk crossing into GameBoard.vue + BoardHost.vue (the fence mis-assigned the fill-forced count to GameControlPanel.vue). Nothing is owed to a later lane; kept as the record of the crossing and its revert path.

# fold-FA3-1 — FENCE CORRECTION: the fill-forced count seam is `GameBoard.vue` + `BoardHost.vue`, not `GameControlPanel.vue`

**From** the chair fold, lane FA3 (item 2, the 3C residue).
**Status** the work LANDED. This is not a request — it is the record of the one place the lane's
written fence and the seam it was told to cure do not line up, written down so the chair can
revert two named hunks if it disagrees rather than discovering the crossing in a diff.

## The fence as issued, and what is actually there

> YOUR FENCE: … `web/frontend/src/games/shared/defineGame.ts` + `useGameState.ts` +
> `GameControlPanel.vue` (ONLY the fill-forced count seam)
> LAND: … the model records the fill act's own count (lastFill), the panel's announce reads THAT,
> the size≥2 exclusion dies.

The announce is not in the panel. `GameControlPanel.vue` has no model: it `emit`s
`(e: "fill-forced")` (`:166`), `GameShell.vue:183` turns that into `model.fillForced()`, and the
count never comes back to the panel. The sentence and the `size < 2` exclusion the fence names
live in **`GameBoard.vue`**, in the `animatingCells` watch (pre-cure `:848-858`), reading a prop
that **`BoardHost.vue`** maps off the model. Lane 3C's own record predicted this shape of error:
"None of the three is in this lane's fence, and two of the three **the fence mis-assigns to the
panel**" (`panel-3C.md` §3.7).

So the seam is four files, and only two of them were named:

| file | in the issued fence | in the seam |
| --- | --- | --- |
| `src/games/shared/useGameState.ts` | yes | yes — writes `lastFill` in `fillForced()` |
| `src/games/shared/defineGame.ts` | yes | yes — `GameModel.lastFill` read contract |
| `src/games/shared/BoardHost.vue` | **no** | yes — one line, `:last-fill="model.lastFill.value"` |
| `src/games/shared/GameBoard.vue` | **no** | yes — the prop and the watch that speaks |
| `src/games/shared/GameControlPanel.vue` | yes | **no** — nothing in it touches the count |

`GameControlPanel.vue` was NOT edited by this lane. (It was used as the plant site for handoff
3A-3 §2's plant-proof and restored byte-identical — `diff -q` clean; see
`fold/FA3-3A3-jargon-arm-plant-proof.txt`.)

## What crossed, exactly

Two hunks, both single-purpose, nothing else in either file touched:

`src/games/shared/BoardHost.vue` — one line added to the `<GameBoard>` binding, directly under
`:animating-cells`:

```vue
    :last-fill="model.lastFill.value"
```

`src/games/shared/GameBoard.vue` — one optional prop added under `animatingCells`:

```ts
  /** T9-W3 §3.5 — the forced sweep's own count, stamped, straight off the model. Optional so
   *  a surface that never sweeps (a mount with no fill act) hands nothing rather than a zero. */
  lastFill?: { count: number; stamp: number } | null;
```

and the `animatingCells` watch replaced by the act-sourced one (the comment block above it
rewritten to say why), plus the deletion of the now-dead `let lastGenerationSeen`:

```ts
watch(
  () => props.lastFill,
  (fill) => {
    if (!mounted || !fill) return;
    announce(`${fill.count} ${fill.count === 1 ? "square" : "squares"} filled`);
  },
);
```

## Why it was landed rather than handed back

Handing it back would have left item 2 entirely undone — the chair's instruction is explicit
("Land it", with a born-RED spec for the announce), and the instruction's own words name an edit
to the announce site ("the size≥2 exclusion dies") that exists only in `GameBoard.vue`. The
scoping clause the fence carries is **"ONLY the fill-forced count seam"**, and that is the
boundary this lane held to: nothing outside the count seam was touched in either unnamed file,
and the file the fence named but the seam does not contain was left alone.

## To revert, if the chair rules otherwise

`git checkout -- web/frontend/src/games/shared/BoardHost.vue` puts the binding back, and the
`GameBoard.vue` hunk is the one watch block plus one prop. Reverting either one alone reds
`src/games/shared/GameBoard.receipt.test.ts`'s three `lastFill` rows; the model half
(`useGameState.ts` + `defineGame.ts` + `useGameState.fill.test.ts`) stands on its own and stays
green either way.
