// Idle re-trace, verify-28 template: settled board, 30 s trace, no interaction.
// Quotes renderer-main busy% + dropped frames (trace PipelineReporter) and an
// in-page rAF gap counter (frames whose delta exceeds 1.5x the vsync interval).
// Usage: node idle-trace.cjs <baseURL> <outfile.json> [dpr]
const { chromium } = require('playwright')
const fs = require('fs')
const { buildPersistedBoard, SETTLED_LINES, pollSettled, analyzeTrace, TRACE_CATEGORIES } = require('./gate-lib.cjs')

const [base, outfile, dprStr] = process.argv.slice(2)
const dpr = Number(dprStr || 2)

;(async () => {
  const browser = await chromium.launch()
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: dpr,
    colorScheme: 'light',
  })
  const board = buildPersistedBoard(16)
  await context.addInitScript((b) => localStorage.setItem('sudoku-board-state', b), JSON.stringify(board))
  const page = await context.newPage()
  await page.goto(`${base}/?size=4&difficulty=MEDIUM`, { waitUntil: 'networkidle' })
  await pollSettled(page, SETTLED_LINES[16])
  await page.waitForTimeout(2000) // steady state, all one-shots done

  // In-page rAF gap counter armed for the trace window
  await page.evaluate(() => {
    window.__rafStats = { frames: 0, gaps15: 0, gaps2x: 0, maxGapMs: 0, intervals: [] }
    let last = performance.now()
    // estimate vsync over first 20 frames, then count gaps
    function tick(now) {
      const d = now - last
      last = now
      const s = window.__rafStats
      s.frames++
      s.intervals.push(d)
      if (s.intervals.length > 20) {
        const sorted = [...s.intervals].sort((a, b) => a - b)
        const median = sorted[Math.floor(sorted.length / 2)]
        if (d > 1.5 * median) s.gaps15++
        if (d > 2 * median) s.gaps2x++
      }
      if (d > s.maxGapMs && s.frames > 2) s.maxGapMs = d
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  })

  await browser.startTracing(page, { path: outfile, screenshots: false, categories: TRACE_CATEGORIES })
  await page.waitForTimeout(30000)
  await browser.stopTracing()
  const rafStats = await page.evaluate(() => {
    const s = window.__rafStats
    const sorted = [...s.intervals].sort((a, b) => a - b)
    return {
      frames: s.frames,
      gaps15: s.gaps15,
      gaps2x: s.gaps2x,
      maxGapMs: Math.round(s.maxGapMs * 10) / 10,
      medianIntervalMs: Math.round(sorted[Math.floor(sorted.length / 2)] * 100) / 100,
    }
  })

  const analysis = analyzeTrace(outfile, fs)
  const result = { base, dpr, windowMs: 30000, raf: rafStats, ...analysis }
  fs.writeFileSync(outfile.replace(/\.json$/, '.summary.json'), JSON.stringify(result, null, 2))
  console.log(JSON.stringify(result))
  await browser.close()
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
