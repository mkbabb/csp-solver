// C07a MECHANISM LAB — why does WebKit issue a second full 200 for a preloaded font?
//
// Serves the FROZEN dist-base tree from its own ephemeral 127.0.0.1 port (never the
// 4250-4260 band, never :3000), rewriting only the <head>'s font preload hints and the
// Cache-Control it answers /assets/* with, then counts woff2 requests off the DRIVER's
// stream exactly as attribution/A2/webkit-font-confirm.mjs does.
//
// run: node font-lab.mjs --variant <v0|v1|v2|v3|v4|v5> --cache <nocache|immutable> [--engine webkit|chromium] [--reps 1]
//
// variants (applied to dist-base/index.html, nothing else moves):
//   v0  as built: <link rel=preload as=font type=font/woff2 crossorigin href=...>, AFTER the stylesheet
//   v1  same, with `type` dropped
//   v2  same, with crossorigin="anonymous" written out
//   v3  same, moved BEFORE the stylesheet link
//   v4  no preloads at all (the REFUTED engine-blind strip, as a control only)
//   v6  as built, but WITHOUT `crossorigin` (the preload then sends no Origin header, like
//       the @font-face load itself does in both engines) -- C07a's cure shape
//   v7  v6 with `type` dropped as well
//   v5  as built, but the three @font-face rules hoisted into an inline <style> in the head
//
// cache: what /assets/* answers with.
//   nocache    Cache-Control: no-cache   — what `vite preview` (sirv) sends; the 8.1 regime
//   immutable  Cache-Control: public, max-age=31536000, immutable — what public/_headers
//              puts on the live CF edge
import { createServer } from 'node:http'
import { readFileSync, existsSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'
import { createRequire } from 'node:module'

const require_ = createRequire(
  '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json',
)
const pw = require_('playwright')

const arg = (k, d) => {
  const i = process.argv.indexOf('--' + k)
  return i > 0 ? process.argv[i + 1] : d
}
const ROOT = arg(
  'root',
  '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w8-wasm/web/frontend/dist-base',
)
const VARIANT = arg('variant', 'v0')
const CACHE = arg('cache', 'nocache')
const ENGINE = arg('engine', 'webkit')
const REPS = Number(arg('reps', '1'))

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

/** The three @font-face blocks, lifted verbatim out of the built stylesheet. */
function fontFaceRules() {
  const css = readFileSync(
    join(ROOT, 'assets', 'index-BMuoFtzKf9_k.css'),
    'utf8',
  )
  return (css.match(/@font-face\{[^}]*\}/g) || []).join('')
}

function shapeHead(html) {
  const links = html.match(PRELOAD_RE) || []
  const bare = links.map((l) => l.trim())
  if (VARIANT === 'v0') return html
  if (VARIANT === 'v4') return html.replace(PRELOAD_RE, '')
  if (VARIANT === 'v1')
    return html.replace(PRELOAD_RE, (m) => m.replace(' type="font/woff2"', ''))
  if (VARIANT === 'v2')
    return html.replace(PRELOAD_RE, (m) => m.replace(' crossorigin ', ' crossorigin="anonymous" '))
  if (VARIANT === 'v3') {
    const stripped = html.replace(PRELOAD_RE, '')
    return stripped.replace(
      /<link rel="stylesheet"[^>]*>/,
      (m) => bare.join('\n    ') + '\n    ' + m,
    )
  }
  if (VARIANT === 'v6')
    return html.replace(PRELOAD_RE, (m) => m.replace(' crossorigin ', ' '))
  if (VARIANT === 'v7')
    return html.replace(PRELOAD_RE, (m) => m.replace(' crossorigin ', ' ').replace(' type="font/woff2"', ''))
  if (VARIANT === 'v5')
    return html.replace('</head>', `<style>${fontFaceRules()}</style>\n  </head>`)
  throw new Error('unknown variant ' + VARIANT)
}

const server = createServer((req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1')
  let p = decodeURIComponent(url.pathname)
  if (p === '/' || !existsSync(join(ROOT, p)) || statSync(join(ROOT, p)).isDirectory())
    p = '/index.html'
  const file = join(ROOT, p)
  if (!existsSync(file)) {
    res.writeHead(404)
    return res.end('nope')
  }
  const ext = extname(file)
  const headers = { 'Content-Type': TYPES[ext] || 'application/octet-stream' }
  if (p.startsWith('/assets/'))
    headers['Cache-Control'] =
      CACHE === 'immutable' ? 'public, max-age=31536000, immutable' : 'no-cache'
  else headers['Cache-Control'] = 'no-cache'
  // Response-shape ablations. `--serve preview` reproduces what `vite preview` (sirv +
  // vite's own cors middleware) actually answers with; the individual flags take that
  // apart one header at a time.
  const SERVE = arg('serve', 'plain')
  const has = (f) => process.argv.includes('--' + f)
  if (SERVE === 'preview' || has('vary')) res.setHeader('Vary', 'Origin')
  if (SERVE === 'preview' || has('etag')) {
    const st = statSync(file)
    res.setHeader('ETag', `W/"${st.size}-${st.mtimeMs}"`)
    res.setHeader('Last-Modified', st.mtime.toUTCString())
  }
  if (SERVE !== 'preview' && !has('noacao')) headers['Access-Control-Allow-Origin'] = '*'
  if (has('acao')) headers['Access-Control-Allow-Origin'] = '*'
  if (ext === '.html') {
    const body = shapeHead(readFileSync(file, 'utf8'))
    headers['Content-Length'] = Buffer.byteLength(body)
    res.writeHead(200, headers)
    return res.end(body)
  }
  const body = readFileSync(file)
  headers['Content-Length'] = body.length
  res.writeHead(200, headers)
  res.end(body)
})

await new Promise((r) => server.listen(0, '127.0.0.1', r))
const port = server.address().port

const out = []
for (let rep = 0; rep < REPS; rep++) {
  const b = await pw[ENGINE].launch()
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } })
  const page = await ctx.newPage()
  const reqs = []
  const seen = []
  page.on('request', (r) => reqs.push(r.url().split('/').pop()))
  page.on('response', (r) => {
    const u = r.url().split('/').pop()
    if (u.endsWith('.woff2')) seen.push(u.split('-subset')[0] + ':' + r.status())
  })
  await page.goto(`http://127.0.0.1:${port}/?game=sudoku`, { waitUntil: 'load' })
  await page.waitForTimeout(3000)
  const rt = await page.evaluate(
    "performance.getEntriesByType('resource').filter(e=>e.name.endsWith('.woff2')).map(e=>e.name.split('/').pop().split('-subset')[0]+'|'+e.initiatorType+'|'+e.transferSize+'|'+Math.round(e.startTime))",
  )
  await b.close()
  const counts = {}
  for (const r of reqs.filter((x) => x.endsWith('.woff2'))) {
    const k = r.split('-subset')[0]
    counts[k] = (counts[k] || 0) + 1
  }
  out.push({
    rep,
    engine: ENGINE,
    variant: VARIANT,
    cache: CACHE,
    total: Object.values(counts).reduce((a, c) => a + c, 0),
    counts,
    responses: seen,
    resourceTiming: rt,
  })
}
await new Promise((r) => server.close(r))
for (const o of out) console.log(JSON.stringify(o))
