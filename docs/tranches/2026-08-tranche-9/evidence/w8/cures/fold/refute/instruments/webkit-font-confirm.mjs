// run: node webkit-font-confirm.mjs --port 4251 [--engine webkit|chromium]
// Confirms, from the DRIVER's own request stream (not the page's resource timing), how many times
// each woff2 subset is actually requested on a cold boot, and prints the engine's longtask support.
import { createRequire } from 'node:module'
const require_ = createRequire('/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w8-fold/web/frontend/package.json')
const pw = require_('playwright')
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d }
const ENGINE = arg('engine', 'webkit')
const b = await pw[ENGINE].launch()
const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } })
const page = await ctx.newPage()
const reqs = []
page.on('request', (r) => reqs.push(r.url().split('/').pop()))
page.on('response', (r) => { const u = r.url().split('/').pop(); if (u.endsWith('.woff2')) reqs.push('RESP:' + u + ':' + r.status()) })
await page.goto(`http://127.0.0.1:${arg('port', '4251')}/?game=sudoku`, { waitUntil: 'load' })
await page.waitForTimeout(3000)
const sup = await page.evaluate("PerformanceObserver.supportedEntryTypes ? PerformanceObserver.supportedEntryTypes.join(',') : 'NONE'")
const bodies = await page.evaluate("performance.getEntriesByType('resource').filter(e=>e.name.endsWith('.woff2')).map(e=>({n:e.name.split('/').pop(),i:e.initiatorType,x:e.transferSize,s:Math.round(e.startTime)}))")
await b.close()
const counts = {}
for (const r of reqs.filter((x) => x.endsWith('.woff2'))) counts[r] = (counts[r] || 0) + 1
console.log(JSON.stringify({ engine: ENGINE, driverRequestCounts: counts, responses: reqs.filter(x => x.startsWith('RESP:')), supportedEntryTypes: sup, resourceTiming: bodies }, null, 1))
