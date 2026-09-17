// run: node cpu-profile.mjs --port 4251 --cpu 4 --vp desk --windows 3
// CDP Profiler sampling profile from navigation to board-ready, self-time aggregated by
// SOURCE MODULE (via the scratch-dist sourcemaps) and by chunk. Answers "ms on the cold path".
import { createRequire } from 'node:module'
import { readFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
const HERE = dirname(fileURLToPath(import.meta.url))
const require_ = createRequire('/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json')
const { chromium } = require_('playwright')
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : d }
const PORT = arg('port', '4251'), CPU = Number(arg('cpu', '4')), VP = arg('vp', 'desk'), N = Number(arg('windows', '3'))
const SCRATCH = join(HERE, 'scratch-dist', 'assets')
const VIEWPORTS = { desk: { viewport: { width: 1280, height: 800 } }, mobile: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, hasTouch: true, isMobile: true } }
const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
const CH = new Map([...B64].map((c, i) => [c, i]))
function vlq(seg) { const nums = []; let i = 0; while (i < seg.length) { let r = 0, s = 0, c = 1, d; do { d = CH.get(seg[i++]); c = d & 32; r += (d & 31) << s; s += 5 } while (c); nums.push(r & 1 ? -(r >> 1) : r >> 1) } return nums }
/** line -> sorted [{col, src}] for a chunk, plus its source list */
const mapCache = new Map()
function lineIndex(chunkFile) {
  if (mapCache.has(chunkFile)) return mapCache.get(chunkFile)
  if (!existsSync(join(SCRATCH, chunkFile + '.map'))) { mapCache.set(chunkFile, null); return null }
  const map = JSON.parse(readFileSync(join(SCRATCH, chunkFile + '.map'), 'utf8'))
  const lines = []
  let srcIdx = 0
  for (const seg of map.mappings.split(';')) {
    let genCol = 0
    const segs = []
    if (seg) for (const s of seg.split(',')) { const n = vlq(s); genCol += n[0]; if (n.length >= 4) srcIdx += n[1]; segs.push({ col: genCol, src: n.length >= 4 ? srcIdx : -1 }) }
    lines.push(segs)
  }
  const v = { lines, sources: map.sources.map((s) => s.replace(/^(\.\.\/)+/, '')) }
  mapCache.set(chunkFile, v)
  return v
}
function originOf(url, line, col) {
  const f = url.split('/').pop()
  const idx = lineIndex(f)
  if (!idx || !idx.lines[line]) return f + ' (unmapped)'
  const segs = idx.lines[line]
  let best = null
  for (const s of segs) { if (s.col <= col) best = s; else break }
  if (!best || best.src < 0) return f + ' (unmapped)'
  return idx.sources[best.src]
}
const INIT = `window.__A2={ready:null};(function(){function vis(el){if(!el)return false;const s=getComputedStyle(el);if(s.display==='none'||s.visibility==='hidden')return false;const r=el.getBoundingClientRect();return r.width>0&&r.height>0}
function tick(){if(window.__A2.ready===null){const bg=Array.prototype.find.call(document.querySelectorAll('.board-group'),vis);if(bg){const c=bg.querySelector('.board-cells .game-cell');if(c){const r=c.getBoundingClientRect();if(r.width>0&&r.height>0){requestAnimationFrame(function(){window.__A2.ready=performance.now()});return}}}}requestAnimationFrame(tick)}requestAnimationFrame(tick)})();`

const b = await chromium.launch()
const agg = new Map(), aggChunk = new Map()
const readies = []
for (let w = 0; w < N; w++) {
  const ctx = await b.newContext(VIEWPORTS[VP])
  const page = await ctx.newPage()
  await page.addInitScript(INIT)
  const cdp = await ctx.newCDPSession(page)
  await cdp.send('Network.enable')
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true })
  await cdp.send('Profiler.enable')
  await cdp.send('Profiler.setSamplingInterval', { interval: 100 })
  if (CPU > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU })
  await cdp.send('Profiler.start')
  await page.goto(URLOF(), { waitUntil: 'commit' })
  await page.waitForFunction('window.__A2.ready !== null', null, { timeout: 60000 })
  readies.push(await page.evaluate('window.__A2.ready'))
  const { profile } = await cdp.send('Profiler.stop')
  const byId = new Map(profile.nodes.map((n) => [n.id, n]))
  const selfCount = new Map()
  for (const id of profile.samples) selfCount.set(id, (selfCount.get(id) || 0) + 1)
  const totalSamples = profile.samples.length
  const wallUs = profile.endTime - profile.startTime
  const usPerSample = wallUs / Math.max(1, totalSamples)
  for (const [id, n] of selfCount) {
    const node = byId.get(id)
    if (!node) continue
    const cf = node.callFrame
    const url = cf.url || ''
    const chunk = url ? url.split('/').pop() : '(' + (cf.functionName || 'native') + ')'
    const ms = (n * usPerSample) / 1000
    aggChunk.set(chunk, (aggChunk.get(chunk) || 0) + ms)
    const key = url && url.includes('/assets/') ? originOf(url, cf.lineNumber, cf.columnNumber) : chunk
    agg.set(key, (agg.get(key) || 0) + ms)
  }
  await ctx.close()
}
function URLOF() { return `http://127.0.0.1:${PORT}/?game=sudoku` }
await b.close()
const med = (a) => { const s = [...a].sort((x, y) => x - y); return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2 }
console.log(JSON.stringify({ engine: 'chromium', cpu: CPU, vp: VP, cache: 'cold', windows: N, medianReadyMs: med(readies), readies }))
console.error('# self-time ms/window (mean over ' + N + ' windows), by CHUNK')
for (const [k, v] of [...aggChunk].sort((a, b) => b[1] - a[1]).slice(0, 14)) console.error((v / N).toFixed(1).padStart(8), k)
console.error('# self-time ms/window, by SOURCE MODULE')
for (const [k, v] of [...agg].sort((a, b) => b[1] - a[1]).slice(0, 28)) console.error((v / N).toFixed(1).padStart(8), k)
