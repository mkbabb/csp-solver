// Minimal static server for the gate builds — correct wasm MIME + optional CSP
// header (mirrors public/_headers so violations actually enforce in-browser).
const http = require('http')
const fs = require('fs')
const path = require('path')

const [dir, portStr, cspFlag] = process.argv.slice(2)
const port = Number(portStr)
const CSP =
  "default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: https://avatars.githubusercontent.com; connect-src 'self' https://api.sudoku.babb.dev; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'"

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.wasm': 'application/wasm',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
}

http
  .createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname)
    let file = path.join(dir, p)
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(dir, 'index.html')
    const ext = path.extname(file)
    res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream')
    if (cspFlag === 'csp') res.setHeader('Content-Security-Policy', CSP)
    fs.createReadStream(file).pipe(res)
  })
  .listen(port, () => console.log(`serving ${dir} on :${port} csp=${cspFlag === 'csp'}`))
