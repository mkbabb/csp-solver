// Replicates the EXACT decoder logic from useUrlState.ts (sudoku + futoshiki)
// and fuzzes it with adversarial ?board= payloads. atob/btoa are node globals.
//
// HARDENED (T3-W11 / G8-P2): both decoders now cap raw.length before atob and gate
// the size field on /^\d+$/; the futoshiki decoder additionally enforces orthogonal
// adjacency, bounds the inequality count at 2·n·(n−1), and de-dups — so the 100k-pair
// DoS blob, non-adjacent pairs, and duplicates all fail closed.

const SUDOKU_SIZES = [2, 3, 4]
const FUTO_SIZES = [4, 5, 6, 7]
const MAX_BOARD_PARAM_LEN = 4096

function fromBase64Url(s) {
  const rem = s.length % 4
  const padded = rem ? s + '='.repeat(4 - rem) : s
  return atob(padded.replace(/-/g, '+').replace(/_/g, '/'))
}
function toBase64Url(s) {
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function decodeSudoku(raw, urlSize = null, urlDifficulty = null) {
  if (!raw) return null
  if (raw.length > MAX_BOARD_PARAM_LEN) return null
  let payload
  try {
    payload = fromBase64Url(raw)
  } catch {
    return null
  }
  const dot = payload.indexOf('.')
  if (dot < 1) return null
  const sizeStr = payload.slice(0, dot)
  if (!/^\d+$/.test(sizeStr)) return null
  const size = parseInt(sizeStr, 10)
  if (!SUDOKU_SIZES.includes(size)) return null
  if (urlSize !== null && urlSize !== size) return null
  const cells = payload.slice(dot + 1)
  const totalCells = size ** 4
  if (cells.length !== totalCells) return null
  const maxVal = size ** 2
  const values = {},
    givenCells = []
  for (let i = 0; i < totalCells; i++) {
    const v = parseInt(cells[i], 36)
    if (!Number.isInteger(v) || v < 0 || v > maxVal) return null
    values[String(i)] = v
    if (v !== 0) givenCells.push(String(i))
  }
  return { size, difficulty: urlDifficulty ?? 'EASY', values, givenCells }
}

function decodeFuto(raw, urlSize = null) {
  if (!raw) return null
  if (raw.length > MAX_BOARD_PARAM_LEN) return null
  let payload
  try {
    payload = fromBase64Url(raw)
  } catch {
    return null
  }
  const parts = payload.split('.')
  if (parts.length !== 3) return null
  const [sizeStr, cells, ineqStr] = parts
  if (!/^\d+$/.test(sizeStr)) return null
  const boardSize = parseInt(sizeStr, 10)
  if (!FUTO_SIZES.includes(boardSize)) return null
  if (urlSize !== null && urlSize !== boardSize) return null
  const totalCells = boardSize ** 2
  if (cells.length !== totalCells) return null
  const values = {},
    givenCells = []
  for (let i = 0; i < totalCells; i++) {
    const v = parseInt(cells[i], 36)
    if (!Number.isInteger(v) || v < 0 || v > boardSize) return null
    values[String(i)] = v
    if (v !== 0) givenCells.push(String(i))
  }
  const inequalities = []
  if (ineqStr.length > 0) {
    const maxPairs = 2 * boardSize * (boardSize - 1)
    const seen = new Set()
    for (const pair of ineqStr.split(',')) {
      const ab = pair.split('-')
      if (ab.length !== 2) return null
      const a = parseInt(ab[0], 10),
        b = parseInt(ab[1], 10)
      if (
        !Number.isInteger(a) ||
        !Number.isInteger(b) ||
        a < 0 ||
        a >= totalCells ||
        b < 0 ||
        b >= totalCells
      )
        return null
      const adjacent =
        (Math.abs(a - b) === 1 && Math.floor(a / boardSize) === Math.floor(b / boardSize)) ||
        Math.abs(a - b) === boardSize
      if (!adjacent) return null
      const key = `${a}-${b}`
      if (seen.has(key)) return null
      seen.add(key)
      if (seen.size > maxPairs) return null
      inequalities.push([a, b])
    }
  }
  return { boardSize, values, givenCells, inequalities }
}

function run(name, fn, cases) {
  console.log('\n=== ' + name + ' ===')
  for (const [label, raw, extra] of cases) {
    let r
    const t0 = Date.now()
    try {
      r = extra ? fn(raw, ...extra) : fn(raw)
    } catch (e) {
      console.log('  [THREW!] ' + label + ': ' + e.message)
      continue
    }
    const dt = Date.now() - t0
    const polluted = {}.polluted !== undefined
    const summ =
      r === null
        ? 'null (fail-closed)'
        : 'OBJECT size=' +
          (r.size ?? r.boardSize) +
          ' givens=' +
          r.givenCells.length +
          (r.inequalities ? ' ineqs=' + r.inequalities.length : '')
    const time = dt > 5 ? '  [' + dt + 'ms]' : ''
    console.log(
      '  ' + label.padEnd(38) + ' -> ' + summ + (polluted ? '  !!PROTO POLLUTED!!' : '') + time,
    )
  }
}

const validS2 = toBase64Url('2.' + '1234'.repeat(4))
const validF4 = toBase64Url('4.' + '1'.repeat(16) + '.0-1,1-2')

// The full orthogonal adjacency set of a 4×4 (12 horizontal + 12 vertical = 24 =
// the 2·n·(n−1) cap): a legitimately fully-constrained board must still round-trip.
const adj4 = []
for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) adj4.push(`${r * 4 + c}-${r * 4 + c + 1}`)
for (let c = 0; c < 4; c++) for (let r = 0; r < 3; r++) adj4.push(`${r * 4 + c}-${(r + 1) * 4 + c}`)
const fullF4 = toBase64Url('4.' + '1'.repeat(16) + '.' + adj4.join(',')) // 24 == cap → OBJECT
const overCapF4 = toBase64Url('4.' + '1'.repeat(16) + '.' + adj4.concat('1-0').join(',')) // 25 > cap → null
const oversizedRawF4 = 'A'.repeat(MAX_BOARD_PARAM_LEN + 1) // raw.length cap → null (never atob'd)

run('SUDOKU decoder', decodeSudoku, [
  ['empty', ''],
  ['garbage base64 @@@', '@@@@@@'],
  ['non-b64 chars !!!', '!!!!'],
  ['valid size2 board', validS2],
  ['size mismatch (urlSize=3)', validS2, [3]],
  ['size 99 (invalid)', toBase64Url('99.' + '0'.repeat(6561))],
  ['size 5 (out of web range)', toBase64Url('5.' + '0'.repeat(625))],
  ['no dot separator', toBase64Url('20000')],
  ['dot at pos 0', toBase64Url('.0000')],
  ['cells too short', toBase64Url('2.12')],
  ['cells too long', toBase64Url('2.' + '1'.repeat(64))],
  ['value out of range (z=35)', toBase64Url('2.' + 'z'.repeat(16))],
  ['non-b36 cell char (dot)', toBase64Url('2.' + '.'.repeat(16))],
  ['__proto__ in size field', toBase64Url('__proto__.' + '0'.repeat(16))],
  ['negative size -2', toBase64Url('-2.' + '0'.repeat(16))],
  ['hex size 0x2', toBase64Url('0x2.' + '0'.repeat(16))],
  ['leading-zero size 02', toBase64Url('02.' + '1234'.repeat(4))],
  ['oversized 200KB blob', toBase64Url('2.' + '1'.repeat(200000))],
  ['whitespace in size', toBase64Url('  2.' + '1234'.repeat(4))],
  ['space cells payload', toBase64Url('2.' + ' '.repeat(16))],
])

run('FUTOSHIKI decoder', decodeFuto, [
  ['empty', ''],
  ['garbage', '@@@@'],
  ['valid size4 board', validF4],
  ['wrong part count (2 parts)', toBase64Url('4.' + '1'.repeat(16))],
  ['wrong part count (4 parts)', toBase64Url('4.' + '1'.repeat(16) + '.a.b')],
  ['ineq index out of range', toBase64Url('4.' + '1'.repeat(16) + '.0-99')],
  ['ineq malformed (single)', toBase64Url('4.' + '1'.repeat(16) + '.5')],
  ['ineq empty member (-5)', toBase64Url('4.' + '1'.repeat(16) + '.-5')],
  ['ineq negative', toBase64Url('4.' + '1'.repeat(16) + '.0--1')],
  ['100k inequalities (DoS?)', toBase64Url('4.' + '1'.repeat(16) + '.' + Array(100000).fill('0-1').join(','))],
  ['non-adjacent ineq 0-15', toBase64Url('4.' + '1'.repeat(16) + '.0-15')],
  ['dup inequalities', toBase64Url('4.' + '1'.repeat(16) + '.0-1,0-1,0-1')],
  ['__proto__ ineq', toBase64Url('4.' + '1'.repeat(16) + '.__proto__-1')],
  ['value>boardSize', toBase64Url('4.' + '9'.repeat(16) + '.')],
  // T3-W11 hardening proofs
  ['full 24-pair board (==cap)', fullF4],
  ['over-cap 25 pairs (>2n(n-1))', overCapF4],
  ['oversized raw >4KB (pre-atob)', oversizedRawF4],
])
console.log('\nglobal proto polluted after all runs:', {}.polluted !== undefined || [].polluted !== undefined)
