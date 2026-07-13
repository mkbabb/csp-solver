/**
 * Board-size options for the (pencil-side) OptionSelector — own file, not shared with
 * Sudoku's ControlPanel (games never import each other). Futoshiki ships NO difficulty
 * options (F3): the single high-density tier is the whole v1 vocabulary, so there is
 * only one selector here where Sudoku has two.
 *
 * Values are the board side length directly (4..7) — `board_size`, never the subgrid
 * `size` Sudoku's options carry (F5).
 */
export const boardSizeOptions = [
  { value: 4, label: "4×4" },
  { value: 5, label: "5×5" },
  { value: 6, label: "6×6" },
  { value: 7, label: "7×7" },
];
