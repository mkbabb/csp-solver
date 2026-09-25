import { createRequire } from 'node:module';
const require = createRequire('/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json');
const pw = require('playwright');
for (const eng of ['chromium']) {
  const b = await pw[eng].launch(); const ctx = await b.newContext({ viewport: { width: 768, height: 1024 }, hasTouch: true }); const p = await ctx.newPage();
  await p.goto('http://127.0.0.1:4241/?size=3&difficulty=EASY&wire=local'); await p.waitForSelector('svg.handwritten-logo', { timeout: 90000 });
  const verb = p.locator('.controls-card button[aria-label="Play together on this board"]');
  console.log('visible', await verb.isVisible());
  await p.locator('.drawer-tab').first().click();
  const t0 = Date.now(); const seq = [];
  for (let i = 0; i < 20; i++) { seq.push([Date.now() - t0, await verb.evaluate((e) => e.getBoundingClientRect().top)]); await p.waitForTimeout(150); }
  console.log(eng, JSON.stringify(seq));
  await b.close();
}
