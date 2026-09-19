// C07a — the SERVER-SHAPE interleave.
//
// What it is: `refute/A2/xablate.mjs --mode nopreload` with exactly two changes, both stated.
//   1. the board-ready INIT script is copied BYTE-IDENTICAL from that file (the one W8
//      definition: a visible `.board-group` + a non-zero `.board-cells .game-cell` rect + one rAF);
//   2. the pages are served by THIS file's own ephemeral 127.0.0.1 server instead of
//      `vite preview`, so the response headers can be set to either of two shapes:
//        --serve preview  Vary: Origin · ETag/Last-Modified · Cache-Control: no-cache
//                         (what `vite preview` answers /assets/* with — the 8.1 regime)
//        --serve edge     Access-Control-Allow-Origin: * · Cache-Control: public,
//                         max-age=31536000, immutable · NO Vary
//                         (what sudoku.babb.dev answers, curl'd 2026-09-17, banked in
//                          raw/live-edge-headers.txt)
//      The bytes served are dist-base's, unmodified, in both shapes.
// The ablation arm is xablate's own: the three `<link rel="preload" as="font">` tags removed
// from the HTML. Arms alternate b,c,b,c inside one browser so host drift cancels.
//
// run: node C07a-serve-interleave.mjs --engine webkit|chromium --serve preview|edge
//      [--cpu 4] [--vp desk|mobile] [--windows 5] [--net none|fast3g]
import { createServer } from 'node:http'
import { readFileSync, existsSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'
import { createRequire } from 'node:module'
import { execSync } from 'node:child_process'

const require_ = createRequire(
  '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w8-fold/web/frontend/package.json',
)
const pw = require_('playwright')
const arg = (k, d) => {
  const i = process.argv.indexOf('--' + k)
  return i > 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--')
    ? process.argv[i + 1]
    : d
}
const ROOT = arg(
  'root',
  '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w8-fold/web/frontend/dist',
)
const ENGINE = arg('engine', 'webkit')
const SERVE = arg('serve', 'edge')
const CPU = Number(arg('cpu', '1'))
const VP = arg('vp', 'desk')
const N = Number(arg('windows', '5'))
const NET = arg('net', 'none')

const FAST3G = {
  offline: false,
  downloadThroughput: (1.6 * 1024 * 1024) / 8,
  uploadThroughput: (750 * 1024) / 8,
  latency: 150,
}
const VIEWPORTS = {
  desk: { viewport: { width: 1280, height: 800 } },
  mobile: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, hasTouch: true, isMobile: true },
}
// BYTE-IDENTICAL to refute/A2/xablate.mjs's INIT.
const INIT = `window.__A2={ready:null};(function(){function vis(el){if(!el)return false;const s=getComputedStyle(el);if(s.display==='none'||s.visibility==='hidden')return false;const r=el.getBoundingClientRect();return r.width>0&&r.height>0}
function tick(){if(window.__A2.ready===null){const bg=Array.prototype.find.call(document.querySelectorAll('.board-group'),vis);if(bg){const c=bg.querySelector('.board-cells .game-cell');if(c){const r=c.getBoundingClientRect();if(r.width>0&&r.height>0){requestAnimationFrame(function(){window.__A2.ready=performance.now()});return}}}}requestAnimationFrame(tick)}requestAnimationFrame(tick)})();`

const TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.woff2': 'font/woff2',
  '.wasm': 'application/wasm',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
}
const PRELOAD_RE = /\n?\s*<link rel="preload" as="font"[^>]*>/g

let STRIP = false
const server = createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname)
  if (p === '/' || !existsSync(join(ROOT, p)) || statSync(join(ROOT, p)).isDirectory())
    p = '/index.html'
  const file = join(ROOT, p)
  if (!existsSync(file)) {
    res.writeHead(404)
    return res.end('nope')
  }
  const ext = extname(file)
  const h = { 'Content-Type': TYPES[ext] || 'application/octet-stream' }
  if (SERVE === 'preview') {
    h['Vary'] = 'Origin'
    const st = statSync(file)
    h['ETag'] = `W/"${st.size}-${st.mtimeMs}"`
    h['Last-Modified'] = st.mtime.toUTCString()
    h['Cache-Control'] = 'no-cache'
  } else {
    h['Access-Control-Allow-Origin'] = '*'
    h['Cache-Control'] = p.startsWith('/assets/')
      ? 'public, max-age=31536000, immutable'
      : 'public, max-age=0, must-revalidate'
  }
  // --fontabort (server-side): the ablate arm's faces simply are not served. Same ablation
  // as xablate.mjs --mode fontabort, without the driver's route interception.
  if (STRIP && process.argv.includes('--fontabort') && ext === '.woff2') {
    res.writeHead(404, { 'Content-Type': 'text/plain' })
    return res.end('absent')
  }
  const raw = ext === '.html' ? readFileSync(file, 'utf8') : readFileSync(file)
  const body =
    ext === '.html' && STRIP && !process.argv.includes('--fontabort')
      ? raw.replace(PRELOAD_RE, '')
      : raw
  h['Content-Length'] = Buffer.byteLength(body)
  res.writeHead(200, h)
  res.end(body)
})
await new Promise((r) => server.listen(0, '127.0.0.1', r))
const PORT = server.address().port
const URL_ = `http://127.0.0.1:${PORT}/?game=sudoku`

// `--serve external --port <p>`: measure against a server already running (a `vite preview`),
// stripping the hints the way xablate.mjs does — through page.route on the document — so the
// only thing that changes between this mode and the two shapes above is WHO SERVES.
const EXTERNAL = SERVE === 'external' ? `http://127.0.0.1:${arg('port', '4254')}/?game=sudoku` : null

const one = async (browser, ablate) => {
  STRIP = ablate
  const ctx = await browser.newContext(VIEWPORTS[VP])
  const page = await ctx.newPage()
  // --nullroute: the ablate arm registers a route for a pattern NOTHING requests. Nothing is
  // intercepted, nothing is changed; only the registration differs between the arms.
  if (ablate && process.argv.includes('--nullroute'))
    await page.route('**/__c07a_never_requested__*', (r) => r.abort())
  if (EXTERNAL && ablate && !process.argv.includes('--nullroute'))
    await page.route(/\/(\?.*)?$/, async (r) => {
      const res = await r.fetch()
      const html = await res.text()
      await r.fulfill({
        status: 200,
        contentType: 'text/html',
        // --routecontrol: route the document and hand it back UNCHANGED. If the ablate arm
        // still reads faster, the win belongs to the interception, not to the hints.
        body: process.argv.includes('--routecontrol')
          ? html
          : html.replace(/<link rel="preload" as="font"[^>]*>/g, ''),
      })
    })
  const woff = []
  page.on('request', (r) => {
    const u = r.url()
    if (u.endsWith('.woff2')) woff.push(u.split('/').pop().split('-subset')[0])
  })
  await page.addInitScript(INIT)
  if (ENGINE === 'chromium') {
    const cdp = await ctx.newCDPSession(page)
    await cdp.send('Network.enable')
    if (CPU > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU })
    if (NET === 'fast3g') await cdp.send('Network.emulateNetworkConditions', FAST3G)
  }
  await page.goto(EXTERNAL || URL_, { waitUntil: 'commit' })
  await page.waitForFunction('window.__A2.ready !== null', null, { timeout: 60000 })
  const ready = await page.evaluate('window.__A2.ready')
  const bytes = await page.evaluate(
    "performance.getEntriesByType('resource').filter(e=>e.name.endsWith('.woff2')).reduce((a,e)=>a+(e.transferSize||0),0)",
  )
  // when the faces actually arrive, and when the font gate that re-bakes opens
  const fontTimes = await page.evaluate(
    "performance.getEntriesByType('resource').filter(e=>e.name.endsWith('.woff2')).map(e=>e.name.split('/').pop().split('-subset')[0]+'|'+e.initiatorType+'|'+Math.round(e.startTime)+'|'+Math.round(e.responseEnd))",
  )
  const fontsReadyMs = await page.evaluate(
    "new Promise(res=>{const t0=performance.now();if(document.fonts.status==='loaded')return res(Math.round(performance.now()));document.fonts.ready.then(()=>res(Math.round(performance.now())))})",
  )
  await page.waitForTimeout(500)
  await ctx.close()
  const counts = {}
  for (const k of woff) counts[k] = (counts[k] || 0) + 1
  return {
    ablate,
    ready: Math.round(ready * 10) / 10,
    woff2Requests: woff.length,
    perSubset: counts,
    fontBytes: bytes,
    fontTimes,
    fontsReadyMs,
  }
}

const loadStart = execSync('sysctl -n vm.loadavg').toString().trim()
const b = await pw[ENGINE].launch()
const rows = []
for (let w = 0; w < N; w++) {
  rows.push(await one(b, false))
  rows.push(await one(b, true))
}
await b.close()
await new Promise((r) => server.close(r))
const loadEnd = execSync('sysctl -n vm.loadavg').toString().trim()
const med = (a) => {
  const s = [...a].sort((x, y) => x - y)
  return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2
}
for (const r of rows)
  console.log(
    JSON.stringify({ engine: ENGINE, serve: SERVE, cpu: CPU, net: NET, vp: VP, cache: 'cold', loadStart, ...r }),
  )
const hints = rows.filter((r) => !r.ablate).map((r) => r.ready)
const strip = rows.filter((r) => r.ablate).map((r) => r.ready)
console.error(
  `serve=${SERVE} ${ENGINE} ${CPU}x ${VP} net=${NET} — hints ${med(hints).toFixed(1)} ms ` +
    `[${Math.min(...hints)}–${Math.max(...hints)}] (n=${hints.length}) · stripped ${med(strip).toFixed(1)} ms ` +
    `[${Math.min(...strip)}–${Math.max(...strip)}] (n=${strip.length}) · delta ${(med(strip) - med(hints)).toFixed(1)} ms ` +
    `(stripped − hints) · woff2 hints ${rows.filter((r) => !r.ablate).map((r) => r.woff2Requests).join('/')} ` +
    `stripped ${rows.filter((r) => r.ablate).map((r) => r.woff2Requests).join('/')} · load ${loadStart} → ${loadEnd}`,
)
