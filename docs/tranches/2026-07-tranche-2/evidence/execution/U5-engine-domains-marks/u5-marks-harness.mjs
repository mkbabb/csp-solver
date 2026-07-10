// W6 beat 9 — engine-domains pencil marks, landing verification.
// The P4 spike harness (evidence/pass2/p4-shots/p4-harness.mjs) re-run at
// landing, adapted for the product semantics: marks are OPT-IN behind the
// hold-to-peek gesture (never ambient — the P4 spoiler finding), so every
// P4 check now runs with the peek HELD (K toggle), plus three landing
// checks: never-ambient (0 marks before the gesture), release-clears
// (Esc), and the futoshiki twin (D16).
//
// Drives the built preview (port 4741) with Playwright:
//   0. asserts NO marks render pre-peek (the opt-in invariant)
//   1. K-peek → marks land on empty cells (re-rolls collapsed boards)
//   2. cross-checks every rendered mark set against naive peer elimination
//      (AC-3+GAC marks must be a SUBSET of the naive candidate set)
//   3. types a candidate into an empty cell → marks replaced by the glyph
//      AND every empty peer loses that candidate (peek stays held)
//   4. types a row conflict → ALL marks vanish (UNSAT path)
//   5. clears the conflict → marks return
//   6. Esc releases the peek → marks clear
//   7/8. futoshiki: K-peek shows marks, Esc clears them
//   screenshots along the way (sudoku light/zoom/entry/unsat/dark, 4×4,
//   futoshiki light/dark) for the gate lane's design check.
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
await page.waitForSelector('.board-cells [role="gridcell"]', { timeout: 15000 })
await page.waitForTimeout(2000) // board deals + grid draw-in settles

const bs = 9
const n = 3

// ── 0. the opt-in invariant: NO marks before the gesture ────────────
const marksPrePeek = await page.locator('.board-cells .pencil-marks').count()
check('no marks render before the peek gesture (never ambient)', marksPrePeek === 0, `${marksPrePeek} mark blocks pre-peek`)

// ── 1. K-peek → marks land. Templates vary per load (Date.now() seed);
// many collapse to all-singleton domains under root GAC (the spoiler
// finding). Re-roll via Randomize until a board keeps multi-candidate
// cells — the peek stays held across rolls (boardGeneration refresh).
await page.keyboard.press('k')
await page.waitForSelector('.board-cells .pencil-marks', { timeout: 15000 })
await page.waitForTimeout(600)
let cells = await readCells(page)
for (let roll = 0; roll < 12; roll++) {
  cells = await readCells(page)
  if (cells.some((c) => c.value === 0 && c.marks.length >= 2)) break
  console.log(`roll ${roll}: all-singleton board (spoiler case) — re-rolling`)
  await page.locator('.controls-card button[aria-label="Randomize board"]').first().click()
  await page.waitForTimeout(1200)
  await page.waitForSelector('.board-cells .pencil-marks', { timeout: 15000 })
}

const marked = cells.filter((c) => c.value === 0 && c.marks.length > 0)
check('marks render on empty cells while the peek is held', marked.length > 10, `${marked.length} marked cells`)

// ── 2. correctness: marks ⊆ naive peer elimination ──────────────────
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
await board.screenshot({ path: `${SHOTS}/01-sudoku-9x9-peek-light.png` })
const bb = await board.boundingBox()
await page.screenshot({
  path: `${SHOTS}/02-zoom-subgrid.png`,
  clip: { x: bb.x, y: bb.y, width: bb.width / 2.6, height: bb.height / 2.6 },
})

// ── 3. entry narrows peers (K-peek is a toggle — the page can still be
// written on with the marks up) ──────────────────────────────────────
cells = await readCells(page)
console.log(
  'mark-count distribution:',
  JSON.stringify(
    cells.reduce((acc, c) => ((acc[c.marks.length] = (acc[c.marks.length] ?? 0) + 1), acc), {}),
  ),
)
const target = cells.findIndex((c) => c.value === 0 && c.marks.length >= 2)
if (target === -1) throw new Error('no empty cell with >=2 marks found')
// A root-GAC-surviving candidate can still be refuted ONE propagation round
// deeper (observed live: typing it wipes every mark — the whole board goes
// UNSAT). The board itself is satisfiable, so the target's SOLUTION value is
// among its marks and keeps propagation alive — try candidates until the
// marks survive; on a wipe, erase and try the next.
const candidates = cells[target].marks
let typed = 0
await page.locator('.board-cells [role="gridcell"]').nth(target).click()
for (const v of candidates) {
  await page.keyboard.type(String(v))
  await page.waitForTimeout(700) // 150ms debounce + round-trip + fade
  if ((await page.locator('.board-cells .pencil-marks').count()) > 0) {
    typed = v
    break
  }
  console.log(`candidate ${v} at cell ${target} is GAC-survivor but UNSAT one round deeper — trying next`)
  await page.keyboard.press('Backspace')
  await page.waitForTimeout(700)
}
if (typed === 0) throw new Error('no consistent candidate found at the target cell')

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
const marksRestored = await page.locator('.board-cells .pencil-marks').count()
check('erasing the conflict restores marks', marksRestored > 10, `${marksRestored} mark blocks`)

// ── 6. releasing the gesture clears the marks ────────────────────────
await page.keyboard.press('Escape')
await page.waitForTimeout(500)
const marksAfterRelease = await page.locator('.board-cells .pencil-marks').count()
check('Esc (release) clears the marks', marksAfterRelease === 0, `${marksAfterRelease} mark blocks after release`)

// ── dark mode + 4×4 shots (peek held) ────────────────────────────────
const darkCtx = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 2,
  colorScheme: 'dark',
})
const darkPage = await darkCtx.newPage()
await darkPage.goto(BASE + '?size=3&difficulty=HARD')
await darkPage.waitForSelector('.board-cells [role="gridcell"]', { timeout: 15000 })
await darkPage.waitForTimeout(2000)
await darkPage.keyboard.press('k')
await darkPage.waitForSelector('.board-cells .pencil-marks', { timeout: 15000 })
await darkPage.waitForTimeout(800)
await darkPage.locator('.board-wrapper').first().screenshot({ path: `${SHOTS}/05-sudoku-9x9-peek-dark.png` })

const smallPage = await ctx.newPage()
await smallPage.goto(BASE + '?size=2&difficulty=EASY')
await smallPage.waitForSelector('.board-cells [role="gridcell"]', { timeout: 15000 })
await smallPage.waitForTimeout(2000)
await smallPage.keyboard.press('k')
await smallPage.waitForSelector('.board-cells .pencil-marks', { timeout: 15000 })
await smallPage.waitForTimeout(800)
await smallPage.locator('.board-wrapper').first().screenshot({ path: `${SHOTS}/06-sudoku-4x4-peek.png` })

// ── 7/8. the futoshiki twin (D16) ────────────────────────────────────
const futoPage = await ctx.newPage()
futoPage.on('pageerror', (e) => console.log('FUTOSHIKI PAGE ERROR:', e.message))
await futoPage.goto(BASE + '?game=futoshiki&board_size=6')
await futoPage.waitForSelector('.board-cells [role="gridcell"]', { timeout: 20000 })
await futoPage.waitForTimeout(2000)
const futoPrePeek = await futoPage.locator('.board-cells .pencil-marks').count()
await futoPage.keyboard.press('k')
await futoPage.waitForSelector('.board-cells .pencil-marks', { timeout: 15000 })
await futoPage.waitForTimeout(800)
const futoMarks = await futoPage.locator('.board-cells .pencil-marks').count()
check(
  'futoshiki: marks render only while the peek is held (D16 twin)',
  futoPrePeek === 0 && futoMarks > 0,
  `${futoPrePeek} pre-peek, ${futoMarks} held`,
)
await futoPage.locator('.board-wrapper').first().screenshot({ path: `${SHOTS}/07-futoshiki-6x6-peek-light.png` })
await futoPage.keyboard.press('Escape')
await futoPage.waitForTimeout(500)
const futoAfterRelease = await futoPage.locator('.board-cells .pencil-marks').count()
check('futoshiki: Esc (release) clears the marks', futoAfterRelease === 0, `${futoAfterRelease} after release`)

const futoDark = await darkCtx.newPage()
await futoDark.goto(BASE + '?game=futoshiki&board_size=6')
await futoDark.waitForSelector('.board-cells [role="gridcell"]', { timeout: 20000 })
await futoDark.waitForTimeout(2000)
await futoDark.keyboard.press('k')
await futoDark.waitForSelector('.board-cells .pencil-marks', { timeout: 15000 })
await futoDark.waitForTimeout(800)
await futoDark.locator('.board-wrapper').first().screenshot({ path: `${SHOTS}/08-futoshiki-6x6-peek-dark.png` })

await browser.close()

const failed = results.filter((r) => !r.ok)
console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
process.exit(failed.length ? 1 : 0)
