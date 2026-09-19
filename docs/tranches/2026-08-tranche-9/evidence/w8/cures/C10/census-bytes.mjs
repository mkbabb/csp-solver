// run: node census-bytes.mjs <distDir>   — raw + brotli(q11) + gzip bytes per dist file, JSONL to stdout
import { readdirSync, statSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { brotliCompressSync, gzipSync, constants } from 'node:zlib'
const dist = process.argv[2] || 'dist'
const walk = (d, base = '') => readdirSync(d, { withFileTypes: true }).flatMap(e =>
  e.isDirectory() ? walk(join(d, e.name), base + e.name + '/') : [base + e.name])
for (const f of walk(dist).sort()) {
  const buf = readFileSync(join(dist, f))
  const br = brotliCompressSync(buf, { params: { [constants.BROTLI_PARAM_QUALITY]: 11 } }).length
  const gz = gzipSync(buf, { level: 9 }).length
  console.log(JSON.stringify({ file: f, raw: buf.length, brotli: br, gzip: gz }))
}
