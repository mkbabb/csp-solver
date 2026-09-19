// C07a — serve the FROZEN dist-base with the headers sudoku.babb.dev actually answers with
// (raw/live-edge-headers.txt): Access-Control-Allow-Origin: *, /assets/* immutable, NO `Vary`.
// `vite preview` differs in exactly one header that matters, `Vary: Origin`.
// run: node edge-serve.mjs --port 4255 [--vary]   (--vary re-adds the preview's header)
import { createServer } from 'node:http'
import { readFileSync, existsSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d }
const ROOT = arg('root', '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w8-wasm/web/frontend/dist-base')
const T = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.woff2':'font/woff2', '.wasm':'application/wasm', '.svg':'image/svg+xml', '.png':'image/png', '.json':'application/json', '.ico':'image/x-icon' }
createServer((req, res) => {
  if (req.url.endsWith('.woff2')) console.error('HIT ' + req.url.split('/').pop().split('-')[0] + ' origin=' + (req.headers.origin || '-') + ' dest=' + (req.headers['sec-fetch-dest'] || '-'))
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname)
  if (p === '/' || !existsSync(join(ROOT, p)) || statSync(join(ROOT, p)).isDirectory()) p = '/index.html'
  const f = join(ROOT, p)
  if (!existsSync(f)) { res.writeHead(404); return res.end() }
  const h = {
    'Content-Type': T[extname(f)] || 'application/octet-stream',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': p.startsWith('/assets/') ? 'public, max-age=31536000, immutable' : 'public, max-age=0, must-revalidate',
  }
  if (process.argv.includes('--vary')) h['Vary'] = 'Origin'
  const body = readFileSync(f)
  h['Content-Length'] = body.length
  res.writeHead(200, h)
  res.end(body)
}).listen(Number(arg('port', '4255')), '127.0.0.1', () => console.log('edge-serve on', arg('port', '4255')))
