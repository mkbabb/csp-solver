// run: node module-map.mjs <chunk.js> [--json]   — attributes a built chunk's bytes to source modules via its .map
// Zero-dep VLQ decode. A generated segment owns bytes from its column to the next segment's
// column (last segment on a line runs to end-of-line + the newline). Unmapped prefix = "<unmapped>".
import { readFileSync } from 'node:fs'
import { brotliCompressSync, constants } from 'node:zlib'

const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
const CH = new Map([...B64].map((c, i) => [c, i]))

function decodeLine(seg) {
  // returns array of [genCol, srcIdx?] with srcIdx relative-decoded by caller state
  const out = []
  let i = 0
  const nums = []
  while (i < seg.length) {
    let result = 0,
      shift = 0,
      cont = 1,
      digit
    do {
      digit = CH.get(seg[i++])
      if (digit === undefined) throw new Error('bad vlq char ' + seg[i - 1])
      cont = digit & 32
      result += (digit & 31) << shift
      shift += 5
    } while (cont)
    const neg = result & 1
    result >>= 1
    nums.push(neg ? (result === 0 ? -0x80000000 : -result) : result)
  }
  return nums
}

export function attribute(chunkPath) {
  const code = readFileSync(chunkPath)
  const map = JSON.parse(readFileSync(chunkPath + '.map', 'utf8'))
  const text = code.toString('utf8')
  const lines = text.split('\n')
  const lineBytes = lines.map((l) => Buffer.byteLength(l, 'utf8'))
  // decode mappings into per-line segment lists of {col, src}
  const perLine = []
  let srcIdx = 0
  for (const lineSegs of map.mappings.split(';')) {
    const segs = []
    let genCol = 0
    if (lineSegs) {
      for (const s of lineSegs.split(',')) {
        const n = decodeLine(s)
        genCol += n[0]
        if (n.length >= 4) srcIdx += n[1]
        segs.push({ col: genCol, src: n.length >= 4 ? srcIdx : null })
      }
    }
    perLine.push(segs)
  }
  const bySource = new Map()
  const add = (k, v) => bySource.set(k, (bySource.get(k) || 0) + v)
  for (let li = 0; li < lines.length; li++) {
    const segs = perLine[li] || []
    const len = lineBytes[li] + (li < lines.length - 1 ? 1 : 0)
    if (!segs.length) {
      add('<unmapped>', len)
      continue
    }
    if (segs[0].col > 0) add('<unmapped>', Math.min(segs[0].col, len))
    for (let si = 0; si < segs.length; si++) {
      const start = segs[si].col
      const end = si + 1 < segs.length ? segs[si + 1].col : len
      const n = Math.max(0, Math.min(end, len) - Math.min(start, len))
      const name = segs[si].src === null ? '<unmapped>' : map.sources[segs[si].src] || '<unknown>'
      add(name, n)
    }
  }
  return { total: code.length, bySource }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const chunk = process.argv[2]
  const { total, bySource } = attribute(chunk)
  const rows = [...bySource.entries()]
    .map(([src, bytes]) => ({ src: src.replace(/^(\.\.\/)+/, ''), bytes }))
    .sort((a, b) => b.bytes - a.bytes)
  const brTotal = brotliCompressSync(readFileSync(chunk), {
    params: { [constants.BROTLI_PARAM_QUALITY]: 11 },
  }).length
  if (process.argv.includes('--json')) {
    for (const r of rows)
      console.log(JSON.stringify({ chunk: chunk.split('/').pop(), ...r, brShare: Math.round((r.bytes / total) * brTotal) }))
  } else {
    console.log(`# ${chunk.split('/').pop()} — ${total} B raw, ${brTotal} B brotli`)
    for (const r of rows)
      console.log(String(r.bytes).padStart(8), String(Math.round((r.bytes / total) * brTotal)).padStart(7), r.src)
  }
}
