// Size-switch trace, verify-28 "size" scenario per p3.md: settled 9x9 -> click
// 16x16, 1280x900 DPR2 light, headless chromium. One run per invocation.
// Usage: node trace-size.cjs <baseURL> <outfile.json> [dpr]
const { chromium } = require('playwright')
const fs = require('fs')
const path = require('path')
const { buildPersistedBoard, SETTLED_LINES, pollSettled, analyzeTrace, TRACE_CATEGORIES } = require('./gate-lib.cjs')

const [base, outfile, dprStr] = process.argv.slice(2)

;(async () => {
  const browser = await chromium.launch()
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: Number(dprStr || 2),
    colorScheme: 'light',
  })
  const board = buildPersistedBoard(9)
  await context.addInitScript((b) => localStorage.setItem('sudoku-board-state', b), JSON.stringify(board))
  const page = await context.newPage()
  await page.goto(`${base}/?size=3&difficulty=MEDIUM`, { waitUntil: 'networkidle' })
  await pollSettled(page, SETTLED_LINES[9])
  await page.waitForTimeout(1200) // fully settled steady state

  await browser.startTracing(page, { path: outfile, screenshots: false, categories: TRACE_CATEGORIES })
  const t0 = Date.now()
  const btn = page.locator('button:visible', { hasText: '16×16' }).first()
  await btn.click()
  const settle = await pollSettled(page, SETTLED_LINES[16])
  await page.waitForTimeout(300)
  await browser.stopTracing()
  const cycleMs = Date.now() - t0

  const analysis = analyzeTrace(outfile, fs)
  const result = { base, cycleMs, settled: settle.settled, settleMs: settle.ms, ...analysis }
  fs.writeFileSync(outfile.replace(/\.json$/, '.summary.json'), JSON.stringify(result, null, 2))
  console.log(JSON.stringify({ ...result, outfile: path.basename(outfile) }))
  await browser.close()
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
