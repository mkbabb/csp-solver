// run: node wasm-when.mjs --port 4251 --cpu 4 [--deal] [--dwell 6000]
// Answers: is the solver Worker spawned / the wasm fetched on BOOT, or only on the first DEAL?
// Logs every network request (CDP Network.requestWillBeSent, workers included via auto-attach)
// with ms-since-navigationStart, through board-ready, then a dwell, then optionally a deal click.
import { createRequire } from 'node:module'
const require_ = createRequire('/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json')
const { chromium } = require_('playwright')
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : d }
const PORT = arg('port', '4251'), CPU = Number(arg('cpu', '4')), DWELL = Number(arg('dwell', '6000'))
const DEAL = process.argv.includes('--deal')
const URL_ = `http://127.0.0.1:${PORT}/?game=sudoku`
const INIT = `window.__A2={ready:null};(function(){function vis(el){if(!el)return false;const s=getComputedStyle(el);if(s.display==='none'||s.visibility==='hidden')return false;const r=el.getBoundingClientRect();return r.width>0&&r.height>0}
function tick(){if(window.__A2.ready===null){const bg=Array.prototype.find.call(document.querySelectorAll('.board-group'),vis);if(bg){const c=bg.querySelector('.board-cells .game-cell');if(c){const r=c.getBoundingClientRect();if(r.width>0&&r.height>0){requestAnimationFrame(function(){window.__A2.ready=performance.now()});return}}}}requestAnimationFrame(tick)}requestAnimationFrame(tick)})();`

const run = async () => {
  const browser = await chromium.launch()
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } })
  const page = await ctx.newPage()
  await page.addInitScript(INIT)
  const log = []
  let t0 = 0
  page.on('request', (r) => log.push({ t: Math.round(Date.now() - t0), phase: 'req', url: r.url().split('/').pop(), type: r.resourceType() }))
  page.on('worker', (w) => log.push({ t: Math.round(Date.now() - t0), phase: 'worker-created', url: w.url().split('/').pop() }))
  ctx.on('request', () => {})
  const cdp = await ctx.newCDPSession(page)
  await cdp.send('Network.enable')
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true })
  await cdp.send('Target.setAutoAttach', { autoAttach: true, waitForDebuggerOnStart: false, flatten: true })
  cdp.on('Network.requestWillBeSent', (e) => log.push({ t: Math.round(Date.now() - t0), phase: 'cdp-req', url: e.request.url.split('/').pop() }))
  if (CPU > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU })
  t0 = Date.now()
  await page.goto(URL_, { waitUntil: 'commit' })
  await page.waitForFunction('window.__A2.ready !== null', null, { timeout: 60000 })
  log.push({ t: Math.round(Date.now() - t0), phase: 'BOARD-READY', ready: await page.evaluate('window.__A2.ready') })
  await page.waitForTimeout(DWELL)
  log.push({ t: Math.round(Date.now() - t0), phase: 'DWELL-END' })
  if (DEAL) {
    const btn = page.locator('button', { hasText: /deal/i }).first()
    if (await btn.count()) { await btn.click({ force: true }); log.push({ t: Math.round(Date.now() - t0), phase: 'DEAL-CLICK' }) }
    else log.push({ t: Math.round(Date.now() - t0), phase: 'DEAL-BUTTON-NOT-FOUND' })
    await page.waitForTimeout(6000)
    log.push({ t: Math.round(Date.now() - t0), phase: 'POST-DEAL-END' })
  }
  await browser.close()
  for (const l of log) console.log(JSON.stringify(l))
}
run().catch((e) => { console.error('INSTRUMENT FAILURE', e); process.exit(3) })
