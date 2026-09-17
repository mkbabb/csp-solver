// run: node xablate.mjs --port 4256 --mode css2x|jspad|fontabort --engine chromium|webkit --cpu 4 --vp desk --windows 5
// REFUTER instrument (T9-W8 §8.1 lane A2 refute). Read-only route interception; the dist is never touched.
import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
const require_ = createRequire('/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json')
const pw = require_('playwright')
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : d }
const PORT = arg('port', '4256'), MODE = arg('mode', 'css2x'), ENGINE = arg('engine', 'chromium')
const CPU = Number(arg('cpu', '4')), VP = arg('vp', 'desk'), N = Number(arg('windows', '5')), NET = arg('net', 'none')
const FAST3G = { offline: false, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8, latency: 150 }
const URL_ = `http://127.0.0.1:${PORT}/?game=sudoku`
const DIST = '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/dist/assets/'
const VIEWPORTS = { desk: { viewport: { width: 1280, height: 800 } }, mobile: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, hasTouch: true, isMobile: true } }
const INIT = `window.__A2={ready:null};(function(){function vis(el){if(!el)return false;const s=getComputedStyle(el);if(s.display==='none'||s.visibility==='hidden')return false;const r=el.getBoundingClientRect();return r.width>0&&r.height>0}
function tick(){if(window.__A2.ready===null){const bg=Array.prototype.find.call(document.querySelectorAll('.board-group'),vis);if(bg){const c=bg.querySelector('.board-cells .game-cell');if(c){const r=c.getBoundingClientRect();if(r.width>0&&r.height>0){requestAnimationFrame(function(){window.__A2.ready=performance.now()});return}}}}requestAnimationFrame(tick)}requestAnimationFrame(tick)})();`

const CSS = readFileSync(DIST + 'index-BMuoFtzKf9_k.css', 'utf8')
const JS = readFileSync(DIST + 'index-9rZPzI5DEcpe.js', 'utf8')
let pad = ''
let i = 0
while (pad.length < 102000) { pad += `\nfunction __a2pad${i}(a,b,c){const q=a*${i % 97}+b;if(q>c){return{k:"pad${i}",v:q-c}}return{k:"pad${i}",v:c-q}}`; i++ }
const JS_PADDED = JS + pad
const CSS_2X = CSS + '\n' + CSS

const one = async (browser, ablate) => {
  const ctx = await browser.newContext(VIEWPORTS[VP])
  const page = await ctx.newPage()
  await page.addInitScript(INIT)
  if (ablate) {
    if (MODE === 'css2x') await page.route('**/index-BMuoFtzKf9_k.css', (r) => r.fulfill({ status: 200, contentType: 'text/css', body: CSS_2X }))
    if (MODE === 'jspad') await page.route('**/index-9rZPzI5DEcpe.js', (r) => r.fulfill({ status: 200, contentType: 'text/javascript', body: JS_PADDED }))
    if (MODE === 'fontabort') await page.route('**/*.woff2', (r) => r.abort())
    if (MODE === 'nopreload' || MODE === 'noworkerpreload')
      await page.route(/\/(\?.*)?$/, async (r) => {
        const res = await r.fetch()
        const html = await res.text()
        const body =
          MODE === 'nopreload'
            ? html.replace(/<link rel="preload" as="font"[^>]*>/g, '')
            : html.replace(/<link rel="modulepreload"[^>]*solver\.worker[^>]*>/g, '')
        await r.fulfill({ status: 200, contentType: 'text/html', body })
      })
  }
  if (ENGINE === 'chromium') {
    const cdp = await ctx.newCDPSession(page)
    await cdp.send('Network.enable')
    await cdp.send('Network.setCacheDisabled', { cacheDisabled: true })
    if (CPU > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU })
    if (NET === 'fast3g') await cdp.send('Network.emulateNetworkConditions', FAST3G)
  }
  await page.goto(URL_, { waitUntil: 'commit' })
  await page.waitForFunction('window.__A2.ready !== null', null, { timeout: 60000 })
  const ready = await page.evaluate('window.__A2.ready')
  const fcp = await page.evaluate("(performance.getEntriesByName('first-contentful-paint')[0]||{}).startTime||null")
  const bytes = await page.evaluate("performance.getEntriesByType('resource').reduce((a,e)=>a+(e.transferSize||0),0)")
  await ctx.close()
  return { ablate, ready: Math.round(ready * 10) / 10, fcp: fcp === null ? null : Math.round(fcp), bytes }
}
const b = await pw[ENGINE].launch()
const rows = []
for (let w = 0; w < N; w++) { rows.push(await one(b, false)); rows.push(await one(b, true)) }
await b.close()
const med = (a) => { const s = [...a].sort((x, y) => x - y); return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2 }
const load = (await import('node:child_process')).execSync('sysctl -n vm.loadavg').toString().trim()
for (const r of rows) console.log(JSON.stringify({ mode: MODE, engine: ENGINE, cpu: CPU, net: NET, vp: VP, cache: 'cold', load, ...r }))
const base = rows.filter((r) => !r.ablate).map((r) => r.ready), abl = rows.filter((r) => r.ablate).map((r) => r.ready)
console.error(`${MODE} ${ENGINE} ${CPU}x ${VP} — base ${med(base).toFixed(1)} ms (n=${base.length}) · ablated ${med(abl).toFixed(1)} ms (n=${abl.length}) · delta ${(med(abl) - med(base)).toFixed(1)} ms (ablated − base) · load ${load}`)
