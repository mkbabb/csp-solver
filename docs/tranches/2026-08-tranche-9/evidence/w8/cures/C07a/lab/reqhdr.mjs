// C07a: dump the REQUEST headers WebKit sends for each woff2, preload vs @font-face.
import { createServer } from 'node:http'
import { readFileSync, existsSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'
import { createRequire } from 'node:module'
const require_ = createRequire('/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json')
const pw = require_('playwright')
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d }
const ROOT = '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w8-wasm/web/frontend/dist-base'
const ENGINE = arg('engine', 'webkit')
const VARY = !process.argv.includes('--novary')
const T = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.woff2':'font/woff2', '.wasm':'application/wasm', '.svg':'image/svg+xml', '.png':'image/png', '.json':'application/json', '.ico':'image/x-icon' }
const log = []
const server = createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname)
  if (p === '/' || !existsSync(join(ROOT, p)) || statSync(join(ROOT, p)).isDirectory()) p = '/index.html'
  const f = join(ROOT, p)
  if (!existsSync(f)) { res.writeHead(404); return res.end() }
  if (p.endsWith('.woff2')) log.push({ file: p.split('/').pop().split('-subset')[0], headers: req.headers })
  const h = { 'Content-Type': T[extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-cache' }
  if (VARY) h['Vary'] = 'Origin'
  const body = readFileSync(f); h['Content-Length'] = body.length
  res.writeHead(200, h); res.end(body)
})
await new Promise((r) => server.listen(0, '127.0.0.1', r))
const b = await pw[ENGINE].launch()
const page = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage()
await page.goto(`http://127.0.0.1:${server.address().port}/?game=sudoku`, { waitUntil: 'load' })
await page.waitForTimeout(3000)
await b.close(); await new Promise((r) => server.close(r))
for (const e of log) console.log(e.file, JSON.stringify({ origin: e.headers.origin ?? null, sfd: e.headers['sec-fetch-dest'] ?? null, accept: e.headers.accept ?? null, referer: e.headers.referer ?? null, cc: e.headers['cache-control'] ?? null }))
