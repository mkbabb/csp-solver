// Settled-board soul shots, p3 method: identical injected 16x16 board, 10 shots
// per side spaced ~110ms across the 4-frame boil cycle, board clip @DPR2.
// Usage: node shots.cjs <baseURL> <label(before|after)> <theme(light|dark)> <outdir>
const { chromium } = require('playwright')
const fs = require('fs')
const path = require('path')
const { buildPersistedBoard, SETTLED_LINES, pollSettled } = require('./gate-lib.cjs')

const [base, label, theme, outdir] = process.argv.slice(2)
fs.mkdirSync(outdir, { recursive: true })

;(async () => {
  const browser = await chromium.launch()
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: theme,
  })
  const board = buildPersistedBoard(16)
  await context.addInitScript((b) => localStorage.setItem('sudoku-board-state', b), JSON.stringify(board))
  const page = await context.newPage()
  await page.goto(`${base}/?size=4&difficulty=MEDIUM`, { waitUntil: 'networkidle' })
  await pollSettled(page, SETTLED_LINES[16])
  await page.waitForTimeout(2500) // steady: draw-in + glyph reveals + fonts done

  const clip = await page.evaluate(() => {
    const svg = document.querySelector('svg.hand-drawn-grid')
    const r = svg.getBoundingClientRect()
    return { x: Math.max(0, r.x - 8), y: Math.max(0, r.y - 8), width: r.width + 16, height: r.height + 16 }
  })
  for (let i = 0; i < 10; i++) {
    await page.screenshot({ path: path.join(outdir, `settled-${label}-${String(i).padStart(2, '0')}.png`), clip })
    await page.waitForTimeout(110)
  }
  // one full-page shot for the eyes-on chrome judgment (H4/H6/H2)
  await page.screenshot({ path: path.join(outdir, `full-${label}-${theme}.png`), fullPage: false })
  console.log(`${label}/${theme}: 10 board shots + 1 full-page -> ${outdir}`)
  await browser.close()
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
