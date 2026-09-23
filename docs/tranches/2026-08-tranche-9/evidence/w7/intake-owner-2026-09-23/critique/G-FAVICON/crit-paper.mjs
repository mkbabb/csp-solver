import { chromium, webkit } from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const [en] = process.argv.slice(2);
const b = await (en === 'webkit' ? webkit : chromium).launch();
const regimes = { fine: { viewport: { width: 1280, height: 800 } }, coarse: { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: en === 'chromium', deviceScaleFactor: 3 } };
for (const [rk, r] of Object.entries(regimes)) for (const scheme of ['light', 'dark']) for (const port of [4257, 4258]) {
  const ctx = await b.newContext({ ...r, colorScheme: scheme, reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  await p.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'load' });
  await p.waitForTimeout(2500);
  const info = await p.evaluate(() => ({
    dark: document.documentElement.classList.contains('dark'),
    htmlBg: getComputedStyle(document.documentElement).backgroundColor,
    bodyBg: getComputedStyle(document.body).backgroundColor,
    bodyInk: getComputedStyle(document.body).color,
    coarse: matchMedia('(pointer: coarse)').matches,
    icon: [...document.querySelectorAll('link[rel~=icon],link[rel=apple-touch-icon]')].map((l) => l.rel + '=' + l.getAttribute('href')).join(' '),
  }));
  const shot = `<scratchpad>/crit-gfav/page_${en}_${rk}_${scheme}_${port}.png`;
  await p.screenshot({ path: shot });
  console.log(JSON.stringify({ en, rk, scheme, port, ...info, shot }));
  await ctx.close();
}
await b.close();
