// run: node ablate-templates.mjs --port 4251 --engine chromium --cpu 4 --vp desk --windows 5 [--ablate]
// READ-ONLY ablation: the dist is never touched. With --ablate the driver intercepts the
// sudoku template-bank chunk and answers with a byte-small module carrying the SAME exports and
// the SAME tier table, with empty board arrays. That is the shape a `tierSource`-only split would
// ship on a livegen deal (the default 9x9 tier), so the pair prices the bank's boot cost.
// Interleaved base/ablated per the rig's instrument law; median of the clean windows reported.
import { createRequire } from 'node:module'
const require_ = createRequire('/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json')
const pw = require_('playwright')
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : d }
const PORT = arg('port', '4251'), ENGINE = arg('engine', 'chromium'), CPU = Number(arg('cpu', '4')), VP = arg('vp', 'desk'), N = Number(arg('windows', '5'))
const URL_ = `http://127.0.0.1:${PORT}/?game=sudoku`
const VIEWPORTS = { desk: { viewport: { width: 1280, height: 800 } }, mobile: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, hasTouch: true, isMobile: true } }
const STUB = `var n={2:{easy:[],medium:[],hard:[]},3:{easy:[],medium:[],hard:[]},4:{easy:[],medium:[],hard:[]}},i={2:{easy:"livegen",medium:"livegen",hard:"livegen"},3:{easy:"livegen",medium:"livegen",hard:"bank"},4:{easy:"bank",medium:"bank",hard:"bank"}};function d(e,a){const r=i[e];if(!r)throw new Error("sudoku: no tier declared for size "+e);return r[a]}export{n as TEMPLATE_BANK,d as tierSource};`
const INIT = `window.__A2={ready:null};(function(){function vis(el){if(!el)return false;const s=getComputedStyle(el);if(s.display==='none'||s.visibility==='hidden')return false;const r=el.getBoundingClientRect();return r.width>0&&r.height>0}
function tick(){if(window.__A2.ready===null){const bg=Array.prototype.find.call(document.querySelectorAll('.board-group'),vis);if(bg){const c=bg.querySelector('.board-cells .game-cell');if(c){const r=c.getBoundingClientRect();if(r.width>0&&r.height>0){requestAnimationFrame(function(){window.__A2.ready=performance.now()});return}}}}requestAnimationFrame(tick)}requestAnimationFrame(tick)})();`

const one = async (browser, ablate) => {
  const ctx = await browser.newContext(VIEWPORTS[VP])
  const page = await ctx.newPage()
  await page.addInitScript(INIT)
  if (ablate)
    await page.route('**/templates-LkXzF59FZu96.js', (r) =>
      r.fulfill({ status: 200, contentType: 'text/javascript', body: STUB }))
  if (ENGINE === 'chromium') {
    const cdp = await ctx.newCDPSession(page)
    await cdp.send('Network.enable')
    await cdp.send('Network.setCacheDisabled', { cacheDisabled: true })
    if (CPU > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU })
  }
  await page.goto(URL_, { waitUntil: 'commit' })
  await page.waitForFunction('window.__A2.ready !== null', null, { timeout: 60000 })
  const ready = await page.evaluate('window.__A2.ready')
  const tpl = await page.evaluate("(performance.getEntriesByType('resource').find(e=>e.name.includes('templates-'))||{}) && (()=>{const e=performance.getEntriesByType('resource').find(x=>x.name.includes('templates-'));return e?{s:Math.round(e.startTime),e:Math.round(e.responseEnd),x:e.transferSize}:null})()")
  await ctx.close()
  return { ablate, ready, tpl }
}
const b = await pw[ENGINE].launch()
const rows = []
for (let i = 0; i < N; i++) { rows.push(await one(b, false)); rows.push(await one(b, true)) }
await b.close()
const med = (a) => { const s = [...a].sort((x, y) => x - y); return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2 }
for (const r of rows) console.log(JSON.stringify({ engine: ENGINE, cpu: CPU, vp: VP, cache: 'cold', ...r }))
const base = rows.filter((r) => !r.ablate).map((r) => r.ready), abl = rows.filter((r) => r.ablate).map((r) => r.ready)
console.error(`base median board-ready ${med(base).toFixed(1)} ms (n=${base.length}) · bank-stubbed ${med(abl).toFixed(1)} ms (n=${abl.length}) · delta ${(med(base) - med(abl)).toFixed(1)} ms`)
