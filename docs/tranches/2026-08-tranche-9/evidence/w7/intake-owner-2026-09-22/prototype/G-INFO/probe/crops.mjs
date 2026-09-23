// The four crops (≤150 KB, palette PNG), all on the prototype's served dist (4255):
//  c1 chromium · light · 1280×800 · fine — open from the top (Row B, the fifth verb)
//  c2 webkit · dark · 1280×800 · fine — open from the end
//  c3 chromium · light+dark · 1280×800 · fine — the ring alt arm (?keys-ring), strip only, rest | open, at 2×
//  c4 chromium · light · 1024×768 · fine — open (density)
import { chromium, webkit } from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';
import sharp from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.mjs';
const DIR = '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_3b66f064-970-17/docs/tranches/2026-08-tranche-9/evidence/w7/intake-owner-2026-09-22/prototype/G-INFO/';
async function open(eng, { w, h, theme, start, q = '' }) {
  const b = await eng.launch();
  const ctx = await b.newContext({ viewport: { width: w, height: h }, colorScheme: theme, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto('http://127.0.0.1:4255/' + q, { waitUntil: 'load' });
  await page.waitForSelector('.controls-card .action-bar .info-btn', { state: 'attached', timeout: 30000 });
  await page.waitForTimeout(2500);
  if (start === 'end') await page.evaluate(() => { const c = document.querySelector('.controls-card'); c.scrollTop = c.scrollHeight; });
  await page.waitForTimeout(300);
  return { b, page };
}
async function press(page) {
  const ib = await page.locator('.info-btn').boundingBox();
  await page.mouse.click(ib.x + ib.width / 2, ib.y + ib.height / 2);
  await page.mouse.move(2, 2);
  await page.waitForTimeout(900);
}
async function cardCrop(page, h, top, file) {
  const cr = await page.locator('.controls-card').boundingBox();
  const buf = await page.screenshot({ clip: { x: cr.x - 12, y: top, width: cr.width + 24, height: h - top } });
  await sharp(buf).png({ palette: true, quality: 70, colors: 64 }).toFile(DIR + file);
}
{ const { b, page } = await open(chromium, { w: 1280, h: 800, theme: 'light', start: 'top' }); await press(page); await cardCrop(page, 800, 400, 'c1-chromium-light-1280x800-fine-open-from-top.png'); await b.close(); }
{ const { b, page } = await open(webkit, { w: 1280, h: 800, theme: 'dark', start: 'end' }); await press(page); await cardCrop(page, 800, 400, 'c2-webkit-dark-1280x800-fine-open-from-end.png'); await b.close(); }
{ const { b, page } = await open(chromium, { w: 1024, h: 768, theme: 'light', start: 'top' }); await press(page); await cardCrop(page, 768, 380, 'c4-chromium-light-1024x768-fine-open-density.png'); await b.close(); }
{
  const tiles = [];
  for (const theme of ['light', 'dark']) {
    const { b, page } = await open(chromium, { w: 1280, h: 800, theme, start: 'top', q: '?keys-ring' });
    const shot = async () => { const r = await page.evaluate(() => { const b = document.querySelector('.action-verbs').getBoundingClientRect(); const i = document.querySelector('.info-btn').getBoundingClientRect(); return { x: b.left - 8, y: Math.min(b.top, i.top) - 8, w: i.right - b.left + 16, h: Math.max(b.bottom, i.bottom) - Math.min(b.top, i.top) + 16 }; }); return page.screenshot({ clip: { x: r.x, y: r.y, width: r.w, height: r.h } }); };
    tiles.push(await shot());
    await press(page);
    tiles.push(await shot());
    await b.close();
  }
  const metas = await Promise.all(tiles.map((t) => sharp(t).metadata()));
  const W = Math.max(...metas.map((m) => m.width)), H = Math.max(...metas.map((m) => m.height));
  await sharp({ create: { width: W * 2 + 8, height: H * 2 + 8, channels: 3, background: '#808080' } })
    .composite(tiles.map((t, k) => ({ input: t, left: (k % 2) * (W + 8), top: Math.floor(k / 2) * (H + 8) })))
    .png({ palette: true, quality: 70, colors: 64 }).toFile(DIR + 'c3-chromium-light+dark-1280x800-fine-ring-arm-strip-rest-open-2x.png');
}
console.log('crops done');
