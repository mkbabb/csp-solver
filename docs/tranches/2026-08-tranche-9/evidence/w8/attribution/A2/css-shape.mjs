// run: node css-shape.mjs <built.css>  — top-level at-rule / dark-block byte census of the render-blocking sheet
import { readFileSync } from 'node:fs'
import { brotliCompressSync, constants } from 'node:zlib'
const css = readFileSync(process.argv[2], 'utf8')
const br = (s) => brotliCompressSync(Buffer.from(s), { params: { [constants.BROTLI_PARAM_QUALITY]: 11 } }).length
// walk top-level blocks by brace depth
const blocks = []
let depth = 0, start = 0
for (let i = 0; i < css.length; i++) {
  const c = css[i]
  if (c === '{') { if (depth === 0) start = i; depth++ }
  else if (c === '}') { depth--; if (depth === 0) { let h = css.lastIndexOf('}', start); let h2 = css.lastIndexOf(';', start); const from = Math.max(h, h2) + 1; blocks.push({ sel: css.slice(from, start).trim().replace(/\s+/g, ' '), bytes: i + 1 - from, body: css.slice(from, i + 1) }) } }
}
const agg = new Map()
const bucket = (sel) => {
  if (/^@media[^{]*prefers-color-scheme:\s*dark/.test(sel)) return '@media prefers-color-scheme: dark'
  if (/^@media[^{]*prefers-reduced-motion/.test(sel)) return '@media prefers-reduced-motion'
  if (/^@media/.test(sel)) return '@media (other — viewport/print/etc)'
  if (/^@supports/.test(sel)) return '@supports'
  if (/^@font-face/.test(sel)) return '@font-face'
  if (/^@keyframes/.test(sel)) return '@keyframes'
  if (/^@layer/.test(sel)) return '@layer'
  if (/^:root|^html/.test(sel)) return ':root / html (tokens)'
  if (/\.dark\b|\[data-theme/.test(sel)) return '.dark / [data-theme] selectors'
  return 'plain rules'
}
for (const b of blocks) { const k = bucket(b.sel); const e = agg.get(k) || { bytes: 0, n: 0, br: 0 }; e.bytes += b.bytes; e.n++; e.br += 0; agg.set(k, e) }
// brotli by concatenated bucket (approximate; brotli of the whole sheet reported for scale)
const cat = new Map()
for (const b of blocks) { const k = bucket(b.sel); cat.set(k, (cat.get(k) || '') + b.body) }
console.log(`# ${process.argv[2].split('/').pop()} — ${css.length} B raw, ${br(css)} B brotli, ${blocks.length} top-level blocks`)
for (const [k, v] of [...agg].sort((a, b) => b[1].bytes - a[1].bytes))
  console.log(String(v.bytes).padStart(7), String(br(cat.get(k))).padStart(7), String(v.n).padStart(5), ' ', k)
// every dark-scoped byte, however it is spelled
const darkBytes = blocks.filter(b => /prefers-color-scheme:\s*dark/.test(b.sel) || /\.dark\b|\[data-theme="dark"\]/.test(b.sel)).reduce((a, b) => a + b.bytes, 0)
const darkInline = (css.match(/\.dark\s/g) || []).length
console.log(`DARK-SCOPED top-level bytes: ${darkBytes} (${((100 * darkBytes) / css.length).toFixed(1)}% of the sheet); '.dark ' occurrences anywhere: ${darkInline}`)
