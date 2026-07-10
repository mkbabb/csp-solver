// CSP zero-violation check under live load of BOTH games against the AFTER
// dist served WITH the production CSP header. Exercises: load sudoku, solve,
// switch theme, load futoshiki, solve. Collects console messages, pageerrors,
// securitypolicyviolation events, and all font/external requests.
import { chromium } from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs'
import fs from 'fs'

const [base, outfile] = process.argv.slice(2)
const log = { violations: [], consoleErrors: [], pageErrors: [], fontRequests: [], externalRequests: [] }

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })

page.on('console', (m) => {
  const t = m.text()
  if (/content security policy|refused to (load|apply|connect|execute)/i.test(t)) log.violations.push(t)
  else if (m.type() === 'error') log.consoleErrors.push(t)
})
page.on('pageerror', (e) => log.pageErrors.push(String(e)))
page.on('request', (r) => {
  const u = r.url()
  if (r.resourceType() === 'font' || u.endsWith('.woff2')) log.fontRequests.push(u)
  if (!u.startsWith(base) && !u.startsWith('data:')) log.externalRequests.push(u)
})
await page.addInitScript(() => {
  document.addEventListener('securitypolicyviolation', (e) => {
    console.error(`CSP-VIOLATION ${e.violatedDirective} ${e.blockedURI}`)
  })
})

// Sudoku: load + solve (worker/wasm path under CSP worker-src)
await page.goto(`${base}/?size=3&difficulty=EASY`, { waitUntil: 'networkidle' })
await page.waitForSelector('path.grid-line', { timeout: 15000 })
await page.waitForTimeout(2500)
await page.locator('button[aria-label="Solve puzzle"]:visible').first().click()
await page.waitForTimeout(5000)
// theme flip (dark-mode CSS/fonts)
await page.locator('button[aria-label*="dark mode"]:visible').first().click().catch(() => {})
await page.waitForTimeout(1500)

// Futoshiki: load + solve
await page.goto(`${base}/?game=futoshiki`, { waitUntil: 'networkidle' })
await page.waitForSelector('.futoshiki-cell', { timeout: 15000 })
await page.waitForTimeout(2500)
await page.locator('button[aria-label="Solve puzzle"]:visible').first().click()
await page.waitForTimeout(5000)

log.fontRequests = [...new Set(log.fontRequests)]
log.externalRequests = [...new Set(log.externalRequests)]
fs.writeFileSync(outfile, JSON.stringify(log, null, 2))
console.log(JSON.stringify({
  violations: log.violations.length,
  consoleErrors: log.consoleErrors.length,
  pageErrors: log.pageErrors.length,
  fontRequests: log.fontRequests,
  externalRequests: log.externalRequests,
}, null, 2))
await browser.close()
process.exit(log.violations.length ? 1 : 0)
