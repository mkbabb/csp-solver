// The payload for band.crit.ts (ACC-GRAPHITE's critic's lib.ts, unchanged): a 9×9 board with 30
// givens in a fixed pattern, encoded with the app's own codec. Place band.crit.ts, band-lib.ts and
// band-stat.mjs in <work>/web/frontend/.<lane>/ so `../e2e/wire` resolves to the tree's codec.
import { encodeSudoku } from "../e2e/wire";
export function solution(size: number, i: number) { const n = size * size, r = Math.floor(i / n), c = i % n; return ((r * size + Math.floor(r / size) + c) % n) + 1; }
export function mintBoard(size: number, givens: number) { const n = size * size, total = n * n, cells: Record<number, number> = {}; for (let i = 0; i < total; i++) if ((i * 37) % total < givens) cells[i] = solution(size, i); return encodeSudoku(size, cells, total); }
