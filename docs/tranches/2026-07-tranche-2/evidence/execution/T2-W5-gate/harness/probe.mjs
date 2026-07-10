import { chromium } from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1280, height: 900 } })
await p.goto('http://localhost:3000/?size=3&difficulty=EASY', { waitUntil: 'networkidle' })
await p.waitForSelector('path.grid-line', { timeout: 15000 })
await p.waitForTimeout(2500)
const info = await p.evaluate(() => {
  const btns = Array.from(document.querySelectorAll('button')).map(b => (b.getAttribute('aria-label') || b.textContent.trim()).slice(0, 40)).filter(Boolean)
  const grid = document.querySelector('[role=grid]')
  const cell = document.querySelector('.sudoku-cell')
  const input = cell ? cell.querySelector('input') : null
  return {
    buttons: btns.slice(0, 30),
    gridAttrs: grid ? { rows: grid.getAttribute('aria-rowcount'), label: grid.getAttribute('aria-label') } : null,
    cellClass: cell ? cell.className : null,
    hasInput: !!input,
    gridLines: document.querySelectorAll('path.grid-line').length,
    htmlClass: document.documentElement.className,
    ghostPath: !!document.querySelector('.cell-ghost-path'),
    selects: Array.from(document.querySelectorAll('[role=listbox],[role=combobox],select')).map(e => e.getAttribute('aria-label')),
  }
})
console.log(JSON.stringify(info, null, 2))
await b.close()
