// G-D8 positive control: after the boot settles, a second generation bump (Clear, pressed twice)
// must still erase the page once. usage: node pos.mjs <base> <tag> <reps>
import { createRequire } from 'node:module';
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';
const require = createRequire('/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json');
const pw = require('playwright');
const SP = process.env.SP; mkdirSync(SP + '/raw', { recursive: true });
const init = readFileSync(new URL('./init3.js', import.meta.url), 'utf8');
const [base, tag, reps] = process.argv.slice(2);
const browser = await pw.chromium.launch({ headless: true });
for (let i = 0; i < Number(reps); i++) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { window.__SPAN = 12000; });
  await ctx.addInitScript(init);
  const page = await ctx.newPage();
  await page.goto(base + '/', { waitUntil: 'load' });
  await page.waitForTimeout(6000);
  await page.click('button[aria-label="Clear the board"]');
  const armed = page.locator('button[aria-label="Press again to clear the board"]'); if (await armed.count()) await armed.click();
  await page.waitForTimeout(3000);
  const data = await page.evaluate(() => ({ ...window.__DI }));
  const name = `${tag}-chromium-d-cold-light-motion-${i}`;
  writeFileSync(`${SP}/raw/${name}.json`, JSON.stringify(data));
  console.log(name, 'frames', data.f.length);
  await ctx.close();
}
await browser.close();
