# T4-W13 · lane REG — the parked `GAMES[]` rows (exact literals + posters, ready to paste)

Base HEAD `38d3f223` (T4-W11 sealed). Port 4888. The three Thermo/Killer/KenKen `GameCard`
rows are **PARKED, not landed** — with a hard reason, banked below verbatim so the joint seal
pastes them in one hunk.

## Why parked (the FLAG — a joint-seal seam, not a contract redraw)

The `GAMES[]` rows CANNOT land build-clean in this lane. Two verified blockers, both downstream
of REG's registration footprint:

1. **The three scene components do not exist.** A `GameCard.scene` is `() => Promise<Component>`;
   the natural targets are `@games/thermo/ThermoGame.vue`, `@games/killer/KillerGame.vue`,
   `@games/kenken/KenKenGame.vue` (+ their `*Board.vue`). **None exist** — the T/K/N game lanes
   ALL explicitly deferred them (`w13/{t-thermo,k-killer,n-kenken}.md` §SCOPE, verbatim: *"The
   mountable scene/board … is NOT built this lane … the scene wiring + the `GAMES[]` registry
   row are W12's carousel seam ('App-level switch smoke rides the joint seal')"*). `grep -rn
   'ThermoGame\|KillerGame\|KenKenGame\|ThermoBoard\|KillerBoard\|KenKenBoard' src/` → **empty**.
   A `GAMES` row whose `scene` dynamically imports a non-existent module breaks BOTH required
   gates: `vue-tsc` (`Cannot find module`) and `vite build` (`Could not resolve` — Vite resolves
   a static-string dynamic import at build time to cut the chunk). So the rows are unbuildable
   until the scenes exist.

2. **App.vue's mount never consumes `card.scene()` — and extending it is W12's exclusive seam.**
   W12 has already wired `GAMES` into `App.vue` (`import { GAMES } from "@games/registry"`,
   `<GameGallery :cards="GAMES" …>`), but ONLY to render the gallery card FACES (posters). The
   live game MOUNT is still a hardcoded two-game switch: `type GameId = "sudoku" | "futoshiki"`,
   `setGame(val) { const next = val === "futoshiki" ? "futoshiki" : "sudoku"; … }` (anything not
   `futoshiki` routes to `sudoku`), `<SudokuGame v-if="scene === 'sudoku'">` /
   `<FutoshikiGame v-if="scene === 'futoshiki'">`. `card.scene()` is dead in the app. For a third
   game to MOUNT, `App.vue`'s `GameId` union + `setGame` routing + the `v-if` scenes must change
   (or fold into a generic `card.scene()` mount) — and **`App.vue` is W12's exclusive territory
   (the cross-wave seam: "You must NOT edit App.vue")**. Building scenes + adding rows WITHOUT
   that App.vue change ships unreachable lazy chunks (a select routes to sudoku) — a dead path
   the tranche's M2 forbids ("no dead paths, no masking fallbacks").

**This is not a `defineGame`/`GameCard` contract defect** (no `games/shared/**` edit is wanted —
the contract is drawn right; all five `game.ts` declarations type-check against it). It is an
**integration seam**: the mount path (per-game scenes + `App.vue` routing via `card.scene()`) is
a joint-seal deliverable no lane closed. REG authors what it owns (these rows + posters) and
banks them paste-ready; the joint seal drops them once the scenes + the App.vue mount land.

## The paste (registry.ts — a single additive hunk inside `GAMES`, + 3 imports)

Re-read `registry.ts` at paste time (W12 owns it). Additive imports at the top (kenken's own
selector constants; sudoku's `sizeOptions` is already imported for `sudokuCard`):

```ts
import { sizeOptions as kenkenSizeOptions } from "@games/kenken/ControlPanel/constants";
```

Append inside the `GAMES` array literal (after `futoshikiCard`), every row LAZY (sudoku stays
the one eager game). Thermo/Killer reuse the already-imported sudoku `sizeOptions` for `range`
(they ARE Sudoku variants); KenKen uses its own 4/5/6 band:

```ts
  {
    id: "thermo",
    name: "thermo",
    range: { label: "size", levels: sizeOptions.map((o) => o.label) },
    poster: () => import("@games/thermo/ThermoPoster.vue").then((m) => m.default),
    scene: () => import("@games/thermo/ThermoGame.vue").then((m) => m.default),
  },
  {
    id: "killer",
    name: "killer",
    range: { label: "size", levels: sizeOptions.map((o) => o.label) },
    poster: () => import("@games/killer/KillerPoster.vue").then((m) => m.default),
    scene: () => import("@games/killer/KillerGame.vue").then((m) => m.default),
  },
  {
    id: "kenken",
    name: "kenken",
    range: { label: "size", levels: kenkenSizeOptions.map((o) => o.label) },
    poster: () => import("@games/kenken/KenKenPoster.vue").then((m) => m.default),
    scene: () => import("@games/kenken/KenKenGame.vue").then((m) => m.default),
  },
```

Ids `thermo`/`killer`/`kenken` match the `game.ts` registration-by-convention (loose `id: string`
per the W12 drop-in seam — zero `gameRegistry` edit). Every row is lazy → the poster + scene
download only on select; sudoku's eager asymmetry is preserved (P4 #4).

## The posters (ready to drop — build-clean, self-contained, knip-safe once the rows reference them)

Each mirrors `SudokuPoster.vue`/`FutoshikiPoster.vue` (a-cards.md): a canned still on the shared
`PosterBoard` + the game's OWN furniture component in the `#overlay` slot (reused directly —
the furniture is prop-driven, static-jitter, PRM-safe, `aria-hidden` by construction). They are
NOT dropped in-tree by this lane: without their `GAMES` row (parked) they would be knip orphans,
reddening the required `lint:knip` gate. They land WITH the rows at the joint seal.

### `web/frontend/src/games/thermo/ThermoPoster.vue`

```vue
<script setup lang="ts">
/**
 * ThermoPoster — Thermo-Sudoku's static carousel face (T4-W13, the a-cards.md pattern).
 *
 * A canned 9×9 snapshot on the game-agnostic `PosterBoard` (3×3 bands) + a few thermometers
 * inked over it via the game's own `ThermoTube` furniture (static, PRM-safe, aria-hidden) in
 * the overlay slot. A flank-card still — never the live board (no Worker, no solver, no beat).
 */
import PosterBoard from "@games/shared/PosterBoard.vue";
import ThermoTube from "./ThermoTube/ThermoTube.vue";
import type { ThermoLine } from "./types";

const N = 9;

// A sparse recognizable worksheet (thermos do the work, so few givens); row-major pos → value.
const values: Record<string, number> = {
  "4": 7,
  "13": 9,
  "22": 6,
  "40": 5,
  "58": 2,
  "76": 7,
};

// Thermometers on orthogonally-adjacent ascending runs (bulb → tip cell indices) — spread so
// horizontal and vertical tubes both read on the still.
const THERMOMETERS: ThermoLine[] = [
  [0, 1, 2, 3],
  [9, 18, 27],
  [80, 79, 78, 77],
  [42, 43, 44],
  [36, 45, 54],
];
</script>

<template>
  <PosterBoard :board-size="N" :subgrid-size="3" :values="values">
    <template #overlay>
      <ThermoTube :thermometers="THERMOMETERS" :board-size="N" />
    </template>
  </PosterBoard>
</template>
```

### `web/frontend/src/games/killer/KillerPoster.vue`

```vue
<script setup lang="ts">
/**
 * KillerPoster — Killer-Sudoku's static carousel face (T4-W13, the a-cards.md pattern).
 *
 * A canned 9×9 snapshot on `PosterBoard` (3×3 bands) + dotted cage boundaries with corner sums,
 * inked via the game's own `KillerCage` furniture (static, PRM-safe, aria-hidden) in the overlay
 * slot. A flank-card still — never the live board.
 */
import PosterBoard from "@games/shared/PosterBoard.vue";
import KillerCage from "./KillerCage/KillerCage.vue";
import type { KillerCage as KillerCageClue } from "./types";

const N = 9;

// A few givens — Killer reads as mostly-open; the cages carry the puzzle.
const values: Record<string, number> = { "40": 5, "20": 8, "60": 2 };

// Contiguous cages (smallest cell is the corner the sum prints in). A partial partition — a
// still, not a dealt board — spread so horizontal, vertical, and L-shaped cages all read.
const CAGES: KillerCageClue[] = [
  { sum: 15, cells: [0, 1, 9] },
  { sum: 8, cells: [2, 3] },
  { sum: 17, cells: [4, 5, 6] },
  { sum: 9, cells: [7, 8] },
  { sum: 12, cells: [10, 11] },
  { sum: 20, cells: [18, 19, 27] },
  { sum: 14, cells: [72, 73, 74] },
  { sum: 7, cells: [79, 80] },
];
</script>

<template>
  <PosterBoard :board-size="N" :subgrid-size="3" :values="values">
    <template #overlay>
      <KillerCage :cages="CAGES" :board-size="N" />
    </template>
  </PosterBoard>
</template>
```

### `web/frontend/src/games/kenken/KenKenPoster.vue`

```vue
<script setup lang="ts">
/**
 * KenKenPoster — KenKen / Calcudoku's static carousel face (T4-W13, the a-cards.md pattern).
 *
 * A canned 6×6 snapshot on `PosterBoard` with the BOXLESS Latin geometry (subgrid-size =
 * boardSize → no interior box lines), cages-only (KenKen prints no givens), the operator-cage
 * outlines + `"12×"`-style corner targets inked via the game's own `KenKenCage` furniture
 * (static, PRM-safe, aria-hidden) in the overlay slot. A flank-card still — never the live board.
 */
import PosterBoard from "@games/shared/PosterBoard.vue";
import KenKenCage from "./KenKenCage/KenKenCage.vue";
import type { KenKenCage as KenKenCageClue } from "./types";

const N = 6;

// Cages-only (classic KenKen), a full contiguous partition of the 6×6 — every operator kind
// (+, −, ×, ÷) and a singleton "given" cage all read on the still.
const CAGES: KenKenCageClue[] = [
  { op: "×", target: 12, cells: [0, 1] },
  { op: "+", target: 9, cells: [2, 3, 4] },
  { op: "-", target: 3, cells: [5, 11] },
  { op: "÷", target: 2, cells: [6, 12] },
  { op: "+", target: 8, cells: [7, 8] },
  { op: "×", target: 20, cells: [9, 10] },
  { op: "-", target: 1, cells: [13, 14] },
  { op: "+", target: 11, cells: [15, 16, 17] },
  { op: "+", target: 3, cells: [18] },
  { op: "×", target: 30, cells: [19, 20] },
  { op: "÷", target: 3, cells: [21, 27] },
  { op: "-", target: 2, cells: [22, 23] },
  { op: "×", target: 8, cells: [24, 25] },
  { op: "+", target: 7, cells: [26, 32] },
  { op: "-", target: 4, cells: [28, 29] },
  { op: "+", target: 15, cells: [30, 31] },
  { op: "+", target: 12, cells: [33, 34, 35] },
];
</script>

<template>
  <PosterBoard :board-size="N" :subgrid-size="N" :values="{}">
    <template #overlay>
      <KenKenCage :cages="CAGES" :board-size="N" />
    </template>
  </PosterBoard>
</template>
```

## The joint-seal checklist (what unblocks the paste)

The parked rows become landable when — and only when — all of:

1. `ThermoGame.vue` + `ThermoBoard.vue`, `KillerGame.vue` + `KillerBoard.vue`, `KenKenGame.vue` +
   `KenKenBoard.vue` exist (thin `GameScene`/`GameBoard` consumers — the T/K/N game lanes'
   explicitly-deferred scene wiring). Their `#overlay` mounts the same furniture the posters reuse.
2. `App.vue` (W12's seam) mounts the selected game via `card.scene()` — or its `GameId` union +
   `setGame` routing + scene `v-if` blocks extend to the five ids — so a gallery select of
   thermo/killer/kenken actually mounts, not falls through to sudoku.
3. The three posters above are dropped into the game dirs (they become knip-non-orphan the instant
   their `GAMES` row references them via the `poster` loader).

Then paste the imports + rows above, re-read-at-edit-time, and the FE battery + a gallery-select
App-level smoke close the seam.
