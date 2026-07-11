/**
 * BOARD_CELLS_CLASS — every board's cell-grid container MUST carry this class: the
 * answer-key laminate's `inset:0` overlay aligns to this container, and the shell's
 * leave/erase opacity beat targets it. Bound on both boards from this single source.
 * (The K-peek keydown no longer exempts `.board-cells` — UI-7(a) made K toggle from the
 * cell resting state too, since a focused cell IS the roving-tabindex's normal home.)
 */
export const BOARD_CELLS_CLASS = "board-cells";
