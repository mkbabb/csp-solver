import { encodeSudoku } from "../../e2e/wire";
// The pinned board: the estate's own codec (e2e/wire.ts, CODEC_VERSION 1 + "3.<81 base-36 cells>"),
// the same 71 givens pass 4 used. The payload string is PRINTED into every reading.
// prettier-ignore
const SOLVED_9 = [5,3,4,6,7,8,9,1,2,6,7,2,1,9,5,3,4,8,1,9,8,3,4,2,5,6,7,8,5,9,7,6,1,4,2,3,4,2,6,8,5,3,7,9,1,7,1,3,9,2,4,8,5,6,9,6,1,5,3,7,2,8,4,2,8,7,4,1,9,6,3,5,3,4,5,2,8,6,1,7,9];
const BLANKS = new Set([0, 4, 10, 22, 36, 40, 55, 61, 73, 80]);
export const PAYLOAD = encodeSudoku(3, Object.fromEntries(SOLVED_9.map((v, i) => [i, BLANKS.has(i) ? 0 : v])), 81);
export const PINNED_URL = `/?game=sudoku&board=${PAYLOAD}`;
