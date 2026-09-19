import { ref, type Ref } from "vue";

/**
 * WHICH BOARD THE ROOM IS ON — a module-level singleton, the `useLiveFace` /
 * `useControlsDrawer` pattern (T9-W7 PLR-PLACE).
 *
 * The seating chart draws the board's own frame at 96px, so it needs the board's side and its
 * box root. Neither is app-level state: `useGameState` is a per-game factory and the head's
 * mark is mounted beside `@mbabb`, two component trees away from it. The session knows the raw
 * selector size (`z` on the epoch) but only inside a room, and the chart must be able to draw
 * an empty board solo.
 *
 * So the one site that already holds both numbers hands them over — `BoardHost`, the single
 * cell-mount site for all five games, which computes `subgridSize` from the grammar. One write
 * per board, no prop drill, and a chart that follows a size commit without asking anybody.
 */
const shape = ref<{ size: number; subgrid: number }>({ size: 9, subgrid: 3 });

export function setBoardShape(size: number, subgrid: number): void {
  if (shape.value.size === size && shape.value.subgrid === subgrid) return;
  shape.value = { size, subgrid };
}

export function useBoardShape(): Readonly<Ref<{ size: number; subgrid: number }>> {
  return shape;
}
