// run: node coverage-attrib.mjs --port 4251 --cpu 4 --vp desk [--net fast3g] [--out cov.json]
// CDP Profiler.startPreciseCoverage (detailed) + CSS.startRuleUsageTracking, stopped AT board-ready.
// Folds the executed byte ranges onto the SOURCE MODULES via the scratch-dist sourcemaps, so the
// output is "per source module: shipped bytes vs executed-by-board-ready bytes" = the freight table.
import { createRequire } from 'node:module'
import { readFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
const HERE = dirname(fileURLToPath(import.meta.url))
const require_ = createRequire('/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json')
const { chromium } = require_('playwright')

const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : d }
const PORT = arg('port', '4251'), CPU = Number(arg('cpu', '4')), VP = arg('vp', 'desk'), NET = arg('net', 'none')
const URL_ = `http://127.0.0.1:${PORT}/?game=sudoku`
const SCRATCH = arg('maps', join(HERE, 'scratch-dist')).startsWith('/') ? join(arg('maps', ''), 'assets') : join(HERE, arg('maps', 'scratch-dist'), 'assets')
const VIEWPORTS = {
  desk: { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 },
  mobile: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, hasTouch: true, isMobile: true },
}
const FAST3G = { offline: false, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8, latency: 150 }

// ── sourcemap → per-character source index for a chunk ──────────────────────
const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
const CH = new Map([...B64].map((c, i) => [c, i]))
function vlq(seg) {
  const nums = []; let i = 0
  while (i < seg.length) {
    let result = 0, shift = 0, cont = 1, digit
    do { digit = CH.get(seg[i++]); cont = digit & 32; result += (digit & 31) << shift; shift += 5 } while (cont)
    nums.push(result & 1 ? -(result >> 1) : result >> 1)
  }
  return nums
}
/** ownerAt: Int32Array over the chunk's characters; value = index into `sources` (-1 unmapped). */
function ownerIndex(chunkFile) {
  const text = readFileSync(join(SCRATCH, chunkFile), 'utf8')
  const map = JSON.parse(readFileSync(join(SCRATCH, chunkFile + '.map'), 'utf8'))
  const owner = new Int32Array(text.length).fill(-1)
  // character offset of the start of each line
  const lineStart = [0]
  for (let i = 0; i < text.length; i++) if (text[i] === '\n') lineStart.push(i + 1)
  let srcIdx = 0, line = 0
  for (const lineSegs of map.mappings.split(';')) {
    let genCol = 0
    const segs = []
    if (lineSegs) for (const s of lineSegs.split(',')) {
      const n = vlq(s); genCol += n[0]; if (n.length >= 4) srcIdx += n[1]
      segs.push({ col: genCol, src: n.length >= 4 ? srcIdx : -1 })
    }
    const base = lineStart[line] ?? text.length
    const lineEnd = (lineStart[line + 1] ?? text.length + 1) - 1
    for (let si = 0; si < segs.length; si++) {
      const s = base + segs[si].col
      const e = si + 1 < segs.length ? base + segs[si + 1].col : lineEnd
      for (let p = Math.max(0, s); p < Math.min(e, text.length); p++) owner[p] = segs[si].src
    }
    line++
  }
  return { owner, sources: map.sources.map((s) => s.replace(/^(\.\.\/)+/, '')), len: text.length }
}

// ── puppeteer's convertToDisjointRanges over V8 precise coverage ────────────
function disjoint(nested) {
  const points = []
  for (const r of nested) { points.push({ offset: r.startOffset, type: 0, range: r }); points.push({ offset: r.endOffset, type: 1, range: r }) }
  points.sort((a, b) => {
    if (a.offset !== b.offset) return a.offset - b.offset
    if (a.type !== b.type) return b.type - a.type
    const al = a.range.endOffset - a.range.startOffset, bl = b.range.endOffset - b.range.startOffset
    return a.type === 0 ? bl - al : al - bl
  })
  const stack = [], out = []
  let last = 0
  for (const p of points) {
    if (stack.length && last < p.offset && stack[stack.length - 1] > 0) {
      const tail = out[out.length - 1]
      if (tail && tail.end === last) tail.end = p.offset
      else out.push({ start: last, end: p.offset })
    }
    last = p.offset
    if (p.type === 0) stack.push(p.range.count); else stack.pop()
  }
  return out.filter((r) => r.end - r.start > 1)
}

const INIT = `window.__A2={ready:null};(function(){function vis(el){if(!el)return false;const s=getComputedStyle(el);if(s.display==='none'||s.visibility==='hidden')return false;const r=el.getBoundingClientRect();return r.width>0&&r.height>0}
function tick(){if(window.__A2.ready===null){const bg=Array.prototype.find.call(document.querySelectorAll('.board-group'),vis);if(bg){const c=bg.querySelector('.board-cells .game-cell');if(c){const r=c.getBoundingClientRect();if(r.width>0&&r.height>0){requestAnimationFrame(function(){window.__A2.ready=performance.now()});return}}}}requestAnimationFrame(tick)}requestAnimationFrame(tick)})();`

const run = async () => {
  const browser = await chromium.launch()
  const ctx = await browser.newContext(VIEWPORTS[VP])
  const page = await ctx.newPage()
  await page.addInitScript(INIT)
  const cdp = await ctx.newCDPSession(page)
  const scripts = new Map()
  cdp.on('Debugger.scriptParsed', (e) => scripts.set(e.scriptId, e.url))
  await cdp.send('Network.enable')
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true })
  await cdp.send('Debugger.enable')
  await cdp.send('Profiler.enable')
  await cdp.send('Profiler.startPreciseCoverage', { callCount: false, detailed: true })
  await cdp.send('DOM.enable')
  await cdp.send('CSS.enable')
  await cdp.send('CSS.startRuleUsageTracking')
  if (CPU > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU })
  if (NET === 'fast3g') await cdp.send('Network.emulateNetworkConditions', FAST3G)
  await page.goto(URL_, { waitUntil: 'commit' })
  await page.waitForFunction('window.__A2.ready !== null', null, { timeout: 90000 })
  const ready = await page.evaluate('window.__A2.ready')
  const cov = await cdp.send('Profiler.takePreciseCoverage')
  const css = await cdp.send('CSS.stopRuleUsageTracking')
  await browser.close()

  const out = { ready, regime: { engine: 'chromium', cpu: CPU, net: NET, cache: 'cold', vp: VP }, chunks: [], modules: [], css: {} }
  const modAgg = new Map()
  for (const entry of cov.result) {
    const url = (scripts.get(entry.scriptId) || entry.url || '').split('/').pop()
    if (!url || !url.endsWith('.js')) continue
    if (!existsSync(join(SCRATCH, url + '.map'))) continue
    const { owner, sources, len } = ownerIndex(url)
    const ranges = disjoint(entry.functions.flatMap((f) => f.ranges))
    const used = new Uint8Array(len)
    let usedTotal = 0
    for (const r of ranges) for (let p = r.start; p < Math.min(r.end, len); p++) if (!used[p]) { used[p] = 1; usedTotal++ }
    const per = new Map()
    for (let p = 0; p < len; p++) {
      const s = owner[p] === -1 ? '<unmapped>' : sources[owner[p]]
      const e = per.get(s) || { shipped: 0, executed: 0 }
      e.shipped++; if (used[p]) e.executed++
      per.set(s, e)
    }
    out.chunks.push({ chunk: url, shipped: len, executed: usedTotal })
    for (const [s, e] of per) {
      const k = url + '::' + s
      modAgg.set(k, { chunk: url, source: s, shipped: e.shipped, executed: e.executed })
    }
  }
  out.modules = [...modAgg.values()].sort((a, b) => b.shipped - a.shipped)
  // CSS rule usage
  const byStyleSheet = new Map()
  for (const r of css.ruleUsage) {
    const e = byStyleSheet.get(r.styleSheetId) || { used: 0, total: 0 }
    const n = r.endOffset - r.startOffset
    e.total += n; if (r.used) e.used += n
    byStyleSheet.set(r.styleSheetId, e)
  }
  out.css = { sheets: [...byStyleSheet.values()], rules: css.ruleUsage.length, usedRules: css.ruleUsage.filter((r) => r.used).length }
  const outFile = arg('out', null)
  if (outFile) (await import('node:fs')).writeFileSync(outFile, JSON.stringify(out, null, 0))
  console.log(JSON.stringify({ ready: out.ready, regime: out.regime, chunks: out.chunks, css: out.css }))
  for (const m of out.modules.slice(0, 40))
    console.error(`${String(m.shipped).padStart(7)} ${String(m.executed).padStart(7)} ${((100 * m.executed) / m.shipped).toFixed(0).padStart(4)}%  ${m.chunk}  ${m.source}`)
}
run().catch((e) => { console.error('INSTRUMENT FAILURE', e); process.exit(3) })
