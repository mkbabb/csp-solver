import { chromium } from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';
const PAYLOAD = 'ATMuNTA4MDAwMDAwMDAzMDAwMDAwNjA5MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAw';
const SEL = process.argv[2];
const b = await chromium.launch(); const ctx = await b.newContext({ baseURL: 'http://127.0.0.1:4232', viewport: { width: 390, height: 844 }, hasTouch: true });
const page = await ctx.newPage(); await page.goto('/?board=' + PAYLOAD); await page.waitForSelector('.controls-card', { state: 'attached' }); await page.waitForTimeout(800);
await page.locator('.drawer-tab').first().click(); await page.waitForTimeout(1200);
console.log(JSON.stringify(await page.evaluate((sel) => [...document.querySelectorAll('#controls-drawer .controls-card ' + sel.split(',').join(', #controls-drawer .controls-card '))].filter((e) => !(e.getAttribute('aria-label') || (e.textContent || '').trim())).map((e) => ({ tag: e.tagName, cls: String(e.className?.baseVal ?? e.className).slice(0, 60), role: e.getAttribute('role'), labelledby: e.getAttribute('aria-labelledby'), title: e.getAttribute('title'), h: Math.round(e.getBoundingClientRect().height) })), SEL)));
await b.close();
