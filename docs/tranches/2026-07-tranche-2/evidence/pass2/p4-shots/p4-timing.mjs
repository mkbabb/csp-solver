// P4 — propagateSudoku latency, wasm-in-node (same binary the worker runs).
// Boards: Al Escargot (hardest named 9×9), a bank 9×9-hard template puzzle,
// and a bank 16×16-medium template puzzle.
import { readFile, readdir } from 'node:fs/promises'
import init, { propagateSudoku, solveSudoku } from '@mkbabb/csp-solver-wasm'

const pkgDir = new URL('../../csp-solver/wasm/pkg/', import.meta.url)
const bytes = await readFile(new URL('csp_solver_wasm_bg.wasm', pkgDir))
await init({ module_or_path: bytes })

const ESCARGOT =
  '100007090030020008009600500005300900010080002600004000300000010040000007007000300'
const esc = Uint32Array.from(ESCARGOT, (c) => Number(c))

async function bankPuzzle(n, diff) {
  const dir = `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/csp-solver/data/sudoku_puzzles/${n}/${diff}/`
  const f = (await readdir(dir)).find((x) => x.endsWith('.json'))
  const t = JSON.parse(await readFile(dir + f, 'utf8'))
  const m = n * n
  const board = new Uint32Array(m * m)
  for (const [k, v] of Object.entries(t.puzzle ?? t.solution)) board[Number(k)] = v
  return board
}

function bench(name, board, n, iters = 200) {
  // warm
  for (let i = 0; i < 20; i++) propagateSudoku(board, n)
  const times = []
  for (let i = 0; i < iters; i++) {
    const t0 = performance.now()
    propagateSudoku(board, n)
    times.push(performance.now() - t0)
  }
  times.sort((a, b) => a - b)
  const p50 = times[Math.floor(iters * 0.5)]
  const p95 = times[Math.floor(iters * 0.95)]
  console.log(`${name}: p50 ${p50.toFixed(3)} ms, p95 ${p95.toFixed(3)} ms (${iters} iters)`)
}

bench('9x9 Al Escargot propagate', esc, 3)
const hard9 = await bankPuzzle(3, 'hard')
bench('9x9 bank-hard propagate', hard9, 3)
const med16 = await bankPuzzle(4, 'medium')
bench('16x16 bank-medium propagate', med16, 4)

// reference: full solve on the same boards
const t0 = performance.now()
solveSudoku(esc, 3, 1, undefined).free()
console.log(`9x9 Al Escargot full solve (single shot): ${(performance.now() - t0).toFixed(2)} ms`)
