// P4 engine-domains pencil-marks spike — round-trip + rendering verification.
// Drives the built preview (port 4741) with Playwright:
//   1. loads a fresh 9×9 MEDIUM board, waits for marks to land
//   2. cross-checks every rendered mark set against naive peer elimination
//      (AC-3+GAC marks must be a SUBSET of the naive candidate set)
//   3. types a candidate into an empty cell → asserts the cell's marks are
//      replaced by the glyph AND every empty peer loses that candidate
//   4. types a row conflict → asserts ALL marks vanish (UNSAT path)
//   5. clears the conflict → asserts marks return
//   6. screenshots along the way (light, zoom, dark, 4×4)
import { chromium } from '@playwright/test'

const BASE = 'http://localhost:4741/'
const SHOTS = process.env.SHOTS_DIR
if (!SHOTS) throw new Error('SHOTS_DIR required')

const results = []
function check(name, ok, detail = '') {
  results.push({ name, ok, detail })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`)
}

async function readCells(page) {
  return page.evaluate(() => {
    const cells = [...document.querySelectorAll('.board-cells [role="gridcell"]')]
    return cells.map((c) => {
      const input = c.querySelector('input')
      const value = input && input.value ? parseInt(input.value, 10) : 0
      const slots = [...c.querySelectorAll('.mark-slot')]
      const marks = slots.map((s, i) => (s.querySelector('svg') ? i + 1 : 0)).filter(Boolean)
      return { value, marks }
    })
  })
}

function naiveCandidates(cells, i, bs, n) {
  const row = Math.floor(i / bs)
  const col = i % bs
  const seen = new Set()
  for (let k = 0; k < bs; k++) {
    seen.add(cells[row * bs + k].value)
    seen.add(cells[k * bs + col].value)
  }
  const br = Math.floor(row / n) * n
  const bc = Math.floor(col / n) * n
  for (let dr = 0; dr < n; dr++)
    for (let dc = 0; dc < n; dc++) seen.add(cells[(br + dr) * bs + (bc + dc)].value)
  const cand = []
  for (let v = 1; v <= bs; v++) if (!seen.has(v)) cand.push(v)
  return cand
}

const browser = await chromium.launch()
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 2,
})
const page = await ctx.newPage()
page.on('pageerror', (e) => console.log('PAGE ERROR:', e.message))
page.on('console', (m) => {
  if (m.type() === 'error' || m.type() === 'warning') console.log(`CONSOLE ${m.type()}:`, m.text())
})

await page.goto(BASE + '?size=3&difficulty=HARD')
// board auto-randomizes on load; marks land after debounce + worker round-trip
await page.waitForSelector('.board-cells .pencil-marks', { timeout: 15000 })
await page.waitForTimeout(1800) // grid draw-in settles

const bs = 9
const n = 3

// Templates vary per load (Date.now() seed); many collapse to all-singleton
// domains under root GAC (the spoiler finding — see the report). Re-roll via
// the Randomize dice until a board keeps multi-candidate cells.
let cells = await readCells(page)
for (let roll = 0; roll < 12; roll++) {
  cells = await readCells(page)
  if (cells.some((c) => c.value === 0 && c.marks.length >= 2)) break
  console.log(`roll ${roll}: all-singleton board (spoiler case) — re-rolling`)
  await page.locator('.controls-card button[aria-label="Randomize board"]').first().click()
  await page.waitForTimeout(1200)
  await page.waitForSelector('.board-cells .pencil-marks', { timeout: 15000 })
}

// ── 2. correctness: marks ⊆ naive peer elimination ──────────────────
const marked = cells.filter((c) => c.value === 0 && c.marks.length > 0)
check('marks render on empty cells', marked.length > 10, `${marked.length} marked cells`)

let subsetOk = true
let tighter = 0
const offenders = []
cells.forEach((c, i) => {
  if (c.value !== 0 || c.marks.length === 0) return
  const naive = naiveCandidates(cells, i, bs, n)
  if (!c.marks.every((v) => naive.includes(v))) {
    subsetOk = false
    offenders.push({ i, marks: c.marks, naive })
  }
  if (c.marks.length < naive.length) tighter++
})
check(
  'every mark set ⊆ naive peer elimination',
  subsetOk,
  offenders.length ? JSON.stringify(offenders.slice(0, 3)) : `${marked.length} cells checked, ${tighter} strictly tighter than naive`,
)

const board = page.locator('.board-wrapper').first()
await board.screenshot({ path: `${SHOTS}/01-board-9x9-light.png` })
const bb = await board.boundingBox()
await page.screenshot({
  path: `${SHOTS}/02-zoom-subgrid.png`,
  clip: { x: bb.x, y: bb.y, width: bb.width / 2.6, height: bb.height / 2.6 },
})

// ── 3. entry narrows peers ───────────────────────────────────────────
cells = await readCells(page) // re-read: reveal animation may have re-rendered
console.log(
  'mark-count distribution:',
  JSON.stringify(
    cells.reduce((acc, c) => ((acc[c.marks.length] = (acc[c.marks.length] ?? 0) + 1), acc), {}),
  ),
)
const target = cells.findIndex((c) => c.value === 0 && c.marks.length >= 2)
if (target === -1) throw new Error('no empty cell with >=2 marks found')
const typed = cells[target].marks[0]
await page.locator('.board-cells [role="gridcell"]').nth(target).click()
await page.keyboard.type(String(typed))
await page.waitForTimeout(700) // 150ms debounce + round-trip + fade

cells = await readCells(page)
check('typed cell shows glyph, drops marks', cells[target].value === typed && cells[target].marks.length === 0)

const row = Math.floor(target / bs)
const col = target % bs
const br = Math.floor(row / n) * n
const bc = Math.floor(col / n) * n
let peersNarrowed = true
cells.forEach((c, i) => {
  if (i === target || c.value !== 0 || c.marks.length === 0) return
  const r = Math.floor(i / bs)
  const cl = i % bs
  const isPeer =
    r === row || cl === col || (Math.floor(r / n) * n === br && Math.floor(cl / n) * n === bc)
  if (isPeer && c.marks.includes(typed)) peersNarrowed = false
})
check(`peers of typed cell no longer offer ${typed}`, peersNarrowed)
await board.screenshot({ path: `${SHOTS}/03-after-entry.png` })

// ── 4. UNSAT clears all marks ────────────────────────────────────────
// place the SAME value in another empty cell of the same row → contradiction
const conflictPos = cells.findIndex(
  (c, i) => i !== target && Math.floor(i / bs) === row && c.value === 0,
)
await page.locator('.board-cells [role="gridcell"]').nth(conflictPos).click()
await page.keyboard.type(String(typed))
await page.waitForTimeout(700)
const marksAfterConflict = await page.locator('.board-cells .pencil-marks').count()
check('row conflict (UNSAT) clears every mark', marksAfterConflict === 0, `${marksAfterConflict} mark blocks remain`)
await board.screenshot({ path: `${SHOTS}/04-unsat-conflict.png` })

// ── 5. clearing the conflict brings marks back ───────────────────────
await page.keyboard.press('Backspace')
await page.waitForTimeout(700)
cells = await readCells(page)
console.log(
  'after backspace: conflict cell =',
  JSON.stringify(cells[conflictPos]),
  'activeElement:',
  await page.evaluate(() => document.activeElement?.tagName ?? 'none'),
)
const marksRestored = await page.locator('.board-cells .pencil-marks').count()
check('erasing the conflict restores marks', marksRestored > 10, `${marksRestored} mark blocks`)

// ── 6. dark mode + 4×4 shots ─────────────────────────────────────────
const darkCtx = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 2,
  colorScheme: 'dark',
})
const darkPage = await darkCtx.newPage()
await darkPage.goto(BASE + '?size=3&difficulty=HARD')
await darkPage.waitForSelector('.board-cells .pencil-marks', { timeout: 15000 })
await darkPage.waitForTimeout(1800)
await darkPage.locator('.board-wrapper').first().screenshot({ path: `${SHOTS}/05-board-9x9-dark.png` })

const smallPage = await ctx.newPage()
await smallPage.goto(BASE + '?size=2&difficulty=EASY')
await smallPage.waitForSelector('.board-cells .pencil-marks', { timeout: 15000 })
await smallPage.waitForTimeout(1800)
await smallPage.locator('.board-wrapper').first().screenshot({ path: `${SHOTS}/06-board-4x4.png` })

const bigPage = await ctx.newPage()
await bigPage.goto(BASE + '?size=4&difficulty=MEDIUM')
await bigPage.waitForSelector('.board-cells .pencil-marks', { timeout: 20000 })
await bigPage.waitForTimeout(2500)
await bigPage.locator('.board-wrapper').first().screenshot({ path: `${SHOTS}/07-board-16x16.png` })

await browser.close()

const failed = results.filter((r) => !r.ok)
console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
process.exit(failed.length ? 1 : 0)
