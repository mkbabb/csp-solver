// Reconstruction of verify-33's shoot-verify33c.mjs keyboard probe with the
// Q8-FLIPPED expectation: a keyboard-focused CONFLICTING cell must compute
// stroke-width: 10 + teacher-red fill (was: blue-ring defect confirmation).
// Runs both games (D16 twins). Usage: node focus-probe.mjs <baseURL> <outdir>
import { chromium } from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs'
import fs from 'fs'
import path from 'path'

const [base, outdir] = process.argv.slice(2)
fs.mkdirSync(outdir, { recursive: true })
const results = []
const check = (name, ok, detail) => {
  results.push({ name, ok, detail })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name} — ${detail}`)
}

const browser = await chromium.launch()

async function probe(game, cellSel, url) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 })
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForSelector(`${cellSel} input`, { timeout: 15000 })
  await page.waitForTimeout(2000)

  // Keyboard-drive a conflict: Tab to the grid (roving tabindex), type a digit,
  // ArrowRight, type the same digit -> row conflict on the focused cell.
  // Keyboard interaction keeps :focus-visible matching (verify-33's live probe).
  await page.evaluate(() => window.scrollTo(0, 0))
  let focusedInGrid = false
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press('Tab')
    focusedInGrid = await page.evaluate((sel) => {
      const a = document.activeElement
      return !!(a && a.tagName === 'INPUT' && a.closest(sel))
    }, cellSel)
    if (focusedInGrid) break
  }
  if (!focusedInGrid) {
    check(`${game}: reach grid by keyboard`, false, 'never focused a cell input via Tab')
    await page.close()
    return
  }
  await page.keyboard.press('1')
  await page.waitForTimeout(150)
  await page.keyboard.press('ArrowRight')
  await page.waitForTimeout(150)
  await page.keyboard.press('1')
  await page.waitForTimeout(200)

  // Conflicts render only while solveState === 'failed' (the teacher grades
  // actual work) — click the VISIBLE Solve button (keyboard-Tab reaches a
  // non-dispatching duplicate; the click is only the trigger, not the probe's
  // subject), await the failed grade, then Shift+Tab back into the grid
  // (keyboard return keeps :focus-visible matching on the conflicting cell).
  await page.locator('button[aria-label="Solve puzzle"]:visible').first().click()
  await page.waitForSelector('.solve-failure', { timeout: 20000 }).catch(() => {})
  const graded = await page.evaluate(() => !!document.querySelector('.solve-failure'))
  check(`${game}: solver graded the conflict 'failed'`, graded, `solve-failure present=${graded}`)
  let backInGrid = false
  for (let i = 0; i < 60; i++) {
    await page.keyboard.press('Shift+Tab')
    backInGrid = await page.evaluate((sel) => {
      const a = document.activeElement
      return !!(a && a.tagName === 'INPUT' && a.closest(sel))
    }, cellSel)
    if (backInGrid) break
  }
  if (!backInGrid) {
    check(`${game}: return to grid by keyboard`, false, 'Shift+Tab never re-entered the grid')
    await page.close()
    return
  }
  await page.waitForTimeout(400) // conflict recompute + ghost-draw-on 180ms

  const state = await page.evaluate((sel) => {
    const a = document.activeElement
    const cell = a && a.closest(sel)
    if (!cell) return { err: 'no focused cell' }
    const ghost = cell.querySelector('.cell-ghost-path')
    const cs = ghost ? getComputedStyle(ghost) : null
    const red = getComputedStyle(document.documentElement).getPropertyValue('--color-teacher-red').trim()
    // resolve the token to rgb via a probe element
    const probe = document.createElement('div')
    probe.style.color = 'var(--color-teacher-red)'
    document.body.appendChild(probe)
    const redRgb = getComputedStyle(probe).color
    probe.remove()
    return {
      cellClass: cell.className,
      isInvalid: cell.classList.contains('is-invalid'),
      focusVisible: a.matches(':focus-visible'),
      strokeWidth: cs && cs.strokeWidth,
      stroke: cs && cs.stroke,
      fill: cs && cs.fill,
      fillOpacity: cs && cs.fillOpacity,
      strokeOpacity: cs && cs.strokeOpacity,
      animationName: cs && cs.animationName,
      teacherRedToken: red,
      teacherRedRgb: redRgb,
    }
  }, cellSel)

  if (state.err) {
    check(`${game}: focused conflicting cell`, false, state.err)
  } else {
    check(`${game}: cell is-invalid under keyboard focus`, state.isInvalid && state.focusVisible,
      `is-invalid=${state.isInvalid} :focus-visible=${state.focusVisible}`)
    check(`${game}: stroke-width computes 10`, state.strokeWidth === '10px' || state.strokeWidth === '10',
      `stroke-width=${state.strokeWidth}`)
    const redMatch = state.fill === state.teacherRedRgb && state.stroke === state.teacherRedRgb
    check(`${game}: red fill + red stroke (teacher-red)`, redMatch,
      `fill=${state.fill} stroke=${state.stroke} teacher-red=${state.teacherRedRgb}`)
    check(`${game}: fill-opacity 0.16 / stroke-opacity 1`,
      state.fillOpacity === '0.16' && state.strokeOpacity === '1',
      `fill-opacity=${state.fillOpacity} stroke-opacity=${state.strokeOpacity}`)
    check(`${game}: ghost-draw-on NOT suppressed`, state.animationName.includes('ghost-draw-on'),
      `animation-name=${state.animationName}`)
  }
  const shot = path.join(outdir, `focus-conflict-${game}.png`)
  await page.screenshot({ path: shot })
  console.log(`  shot: ${shot}`)
  await page.close()
}

await probe('sudoku', '.sudoku-cell', `${base}/?size=3&difficulty=EASY`)
await probe('futoshiki', '.futoshiki-cell', `${base}/?game=futoshiki`)

fs.writeFileSync(path.join(outdir, 'focus-probe-results.json'), JSON.stringify(results, null, 2))
const failed = results.filter((r) => !r.ok).length
console.log(`\n${results.length - failed}/${results.length} checks passed`)
await browser.close()
process.exit(failed ? 1 : 0)
