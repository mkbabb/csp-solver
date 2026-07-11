/**
 * BOARD_CELLS_CLASS — every board's cell-grid container MUST carry this class or the
 * K-peek focus-exemption silently breaks: `useAnswerKeyPeek`'s keydown guard matches
 * `.board-cells` to skip the roving-tabindex cell-input resting state, and the answer-key
 * laminate's `inset:0` overlay aligns to this container. Bound on both boards and
 * consumed by the peek guard from this single source.
 */
export const BOARD_CELLS_CLASS = 'board-cells'
