import { chromium } from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1280, height: 900 } })
p.on('console', m => { if (m.type() === 'error') console.log('CONSOLE-ERR:', m.text().slice(0,200)) })
await p.goto('http://localhost:4311/?size=3&difficulty=EASY', { waitUntil: 'networkidle' })
await p.waitForSelector('.sudoku-cell input', { timeout: 15000 })
await p.waitForTimeout(2200)
for (let i = 0; i < 40; i++) {
  await p.keyboard.press('Tab')
  const inGrid = await p.evaluate(() => document.activeElement?.tagName === 'INPUT' && !!document.activeElement.closest('.sudoku-cell'))
  if (inGrid) break
}
const before = await p.evaluate(() => document.activeElement.closest('.sudoku-cell').querySelector('input').value)
await p.keyboard.press('1')
await p.waitForTimeout(300)
const after1 = await p.evaluate(() => {
  const a = document.activeElement
  return { val: a.value, cellHasGlyph: !!a.closest('.sudoku-cell').querySelector('.handwritten-glyph, svg.glyph, [class*=glyph]') }
})
await p.keyboard.press('ArrowRight')
await p.keyboard.press('1')
await p.waitForTimeout(300)
const state = await p.evaluate(() => {
  const cells = Array.from(document.querySelectorAll('.sudoku-cell input')).slice(0, 12)
  return cells.map(i => i.value || '.').join('')
})
console.log(JSON.stringify({ before, after1, first12: state }))
const solveBtn = p.locator('button[aria-label="Solve puzzle"]:visible').first()
await solveBtn.click()
await p.waitForTimeout(6000)
const grade = await p.evaluate(() => ({
  failure: !!document.querySelector('.solve-failure'),
  success: !!document.querySelector('.solve-success'),
  invalids: document.querySelectorAll('.sudoku-cell.is-invalid').length,
  boardClass: document.querySelector('[role=grid]')?.className,
}))
console.log(JSON.stringify(grade))
await p.screenshot({ path: '.w5gate/out/debug-grade.png' })
await b.close()
