// run: node xentry-coverage.mjs --port 4256 --cpu 4 --vp desk --windows 3
// REFUTER instrument: entry-chunk executed-at-board-ready + marker-region coverage, WITHOUT sourcemaps
// (the lane's module-map.mjs/coverage-attrib.mjs need the deleted scratch-dist maps). Ranges are folded
// with ALL counts kept -- filtering to count>0 first reads every chunk 100% used, since functions[0] is
// the whole-script wrapper and it always ran.
import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
const require_ = createRequire('/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json')
const { chromium } = require_('playwright')
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : d }
const PORT = arg('port', '4256'), CPU = Number(arg('cpu', '4')), VP = arg('vp', 'desk'), N = Number(arg('windows', '3'))
const URL_ = `http://127.0.0.1:${PORT}/?game=sudoku`
const DIST = '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/dist/assets/index-9rZPzI5DEcpe.js'
const SRC = readFileSync(DIST, 'utf8')
const VIEWPORTS = { desk: { viewport: { width: 1280, height: 800 } }, mobile: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, hasTouch: true, isMobile: true } }
const INIT = `window.__A2={ready:null};(function(){function vis(el){if(!el)return false;const s=getComputedStyle(el);if(s.display==='none'||s.visibility==='hidden')return false;const r=el.getBoundingClientRect();return r.width>0&&r.height>0}
function tick(){if(window.__A2.ready===null){const bg=Array.prototype.find.call(document.querySelectorAll('.board-group'),vis);if(bg){const c=bg.querySelector('.board-cells .game-cell');if(c){const r=c.getBoundingClientRect();if(r.width>0&&r.height>0){requestAnimationFrame(function(){window.__A2.ready=performance.now()});return}}}}requestAnimationFrame(tick)}requestAnimationFrame(tick)})();`

const MARKERS = [
  ['gallery:game-gallery', 'game-gallery'],
  ['gallery:staging-band', 'staging-band'],
  ['gallery:gallery-card', 'gallery-card'],
  ['gallery:carousel', 'carousel'],
  ['technique', 'technique'],
  ['board:board-cells', 'board-cells'],
]
const WINDOW = 3000 // chars either side of the marker
const spans = []
for (const [name, lit] of MARKERS) {
  let at = SRC.indexOf(lit)
  let k = 0
  while (at >= 0 && k < 4) {
    spans.push({ name: name + '#' + k, s: Math.max(0, at - WINDOW), e: Math.min(SRC.length, at + WINDOW) })
    at = SRC.indexOf(lit, at + 1); k++
  }
}
const disjoint = (ranges) => {
  const points = []
  for (const r of ranges) { points.push({ off: r.startOffset, type: 0, r }); points.push({ off: r.endOffset, type: 1, r }) }
  points.sort((a, b) => a.off - b.off || b.type - a.type || (a.type ? a.r.startOffset - b.r.startOffset : b.r.endOffset - a.r.endOffset))
  const hit = [], out = []
  let lastOff = 0
  for (const p of points) {
    if (hit.length && lastOff < p.off && hit[hit.length - 1].count > 0) {
      const last = out[out.length - 1]
      if (last && last.end === lastOff) last.end = p.off
      else out.push({ start: lastOff, end: p.off })
    }
    lastOff = p.off
    if (p.type === 0) hit.push(p.r); else hit.splice(hit.indexOf(p.r), 1)
  }
  return out
}
const overlap = (used, s, e) => used.reduce((a, u) => a + Math.max(0, Math.min(u.end, e) - Math.max(u.start, s)), 0)

const b = await chromium.launch()
for (let w = 0; w < N; w++) {
  const ctx = await b.newContext(VIEWPORTS[VP])
  const page = await ctx.newPage()
  await page.addInitScript(INIT)
  const cdp = await ctx.newCDPSession(page)
  await cdp.send('Network.enable'); await cdp.send('Network.setCacheDisabled', { cacheDisabled: true })
  await cdp.send('Profiler.enable'); await cdp.send('Runtime.enable')
  const urls = new Map()
  cdp.on('Debugger.scriptParsed', (e) => urls.set(e.scriptId, e.url))
  await cdp.send('Debugger.enable')
  await cdp.send('Profiler.startPreciseCoverage', { callCount: false, detailed: true })
  if (CPU > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU })
  await page.goto(URL_, { waitUntil: 'commit' })
  await page.waitForFunction('window.__A2.ready !== null', null, { timeout: 60000 })
  const ready = await page.evaluate('window.__A2.ready')
  const cov = await cdp.send('Profiler.takePreciseCoverage')
  await cdp.send('Profiler.stopPreciseCoverage')
  const entry = cov.result.find((r) => (r.url || urls.get(r.scriptId) || '').includes('index-9rZPzI5DEcpe.js'))
  if (!entry) { console.log(JSON.stringify({ window: w, err: 'entry chunk not in coverage' })); await ctx.close(); continue }
  const ranges = entry.functions.flatMap((f) => f.ranges)
  const used = disjoint(ranges)
  const usedBytes = used.reduce((a, r) => a + (r.end - r.start), 0)
  const rows = spans.map((sp) => ({ n: sp.name, len: sp.e - sp.s, used: overlap(used, sp.s, sp.e) }))
  console.log(JSON.stringify({ window: w, cpu: CPU, vp: VP, ready: Math.round(ready * 10) / 10, chunkChars: SRC.length, usedBytes, pct: +(100 * usedBytes / SRC.length).toFixed(1), regions: rows, load: (await import('node:child_process')).execSync('sysctl -n vm.loadavg').toString().trim() }))
  await ctx.close()
}
await b.close()
