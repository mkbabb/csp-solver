/** PLR-SELF pass 6 — the ballot frames, each pair on ONE minted payload with ONE variable (registry-v4 §2.9).
 *  MODE=edge  : drawn-full (FULL dist) vs drawn-quiet (QUIET dist), card open and lobby open, the mark in both arms.
 *  MODE=pose  : the stub at rest vs lifted (hover), FULL dist, ×4 nearest.
 *  MODE=seam  : ARM=a|b on the dev server (the const flipped between runs): B's board after A taps its mark, and A's
 *               head; the wire's reading (B's `.is-peer-cursor` count, A's focus) printed.
 *  PRM `reduce` parks the boil and the sun in every arm. OUTDIR gets raw panes; composites are cut by `compose.mjs`. */
import { test, expect, type Page } from '@playwright/test';
import fs from 'node:fs';
const OUTDIR = process.env.OUTDIR!;
const CTRL = 'http://127.0.0.1:4230', FULL = 'http://127.0.0.1:4231', QUIET = 'http://127.0.0.1:4233', DEV = 'http://127.0.0.1:4241';
async function settled(p: Page) { await p.waitForSelector('svg.handwritten-logo', { timeout: 60000 }); await expect.poll(() => p.locator('.sudoku-cell .glyph-svg').count(), { timeout: 60000 }).toBeGreaterThan(0); }
const givens = (p: Page) => p.evaluate(() => [...document.querySelectorAll('.sudoku-cell input')].map((i) => /given clue (\d)/.exec(i.getAttribute('aria-label') ?? '')?.[1] ?? '0').join(''));
const b64 = (s: string) => Buffer.from(s, 'latin1').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
async function stable(read: () => Promise<unknown>) { let last: unknown = Symbol('u'); await expect.poll(async () => { const v = JSON.stringify(await read()); const s = v === last; last = v; return s; }, { intervals: [150], timeout: 8000 }).toBe(true); }
async function mint(browser: any) { const c = await browser.newContext(); const p = await c.newPage(); await p.goto(`${CTRL}/?size=3&difficulty=EASY`); await settled(p); const g = await givens(p); await c.close(); return b64('\x01' + '3.' + g); }
const MODE = process.env.MODE, ARM = process.env.ARM ?? '';
const payloadFile = `${OUTDIR}/payload.txt`;
test(`frames ${MODE} ${ARM}`, async ({ browser }, info) => {
  const payload = fs.existsSync(payloadFile) ? fs.readFileSync(payloadFile, 'utf8').trim() : await mint(browser);
  fs.writeFileSync(payloadFile, payload);
  const tag = `${info.project.name}`;
  if (MODE === 'edge' || MODE === 'pose') {
    for (const [arm, base] of (MODE === 'edge' ? [['full', FULL], ['quiet', QUIET]] : [['full', FULL]]) as [string, string][]) {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, colorScheme: 'light', reducedMotion: 'reduce' });
      const p = await ctx.newPage(); await p.goto(`${base}/?size=3&difficulty=EASY&board=${payload}`); await settled(p);
      if (MODE === 'edge') {
        await p.locator('.corner-left .attribution-trigger').hover();
        const card = p.locator('.corner-left .hover-card');
        await stable(() => card.evaluate((e) => getComputedStyle(e).opacity + JSON.stringify(e.getBoundingClientRect())));
        await p.screenshot({ path: `${OUTDIR}/edge-${arm}-card-${tag}.png`, clip: { x: 0, y: 0, width: 280, height: 196 } });
        await p.mouse.move(700, 700);
        await expect(card).not.toHaveClass(/is-open/);
        await p.locator('[data-player-mark]:visible').click();
        const lob = p.locator('[data-lobby]:visible');
        await stable(() => lob.evaluate((e) => getComputedStyle(e).opacity + JSON.stringify(e.getBoundingClientRect())));
        await p.screenshot({ path: `${OUTDIR}/edge-${arm}-lobby-${tag}.png`, clip: { x: 0, y: 0, width: 280, height: 196 } });
      } else {
        const m = p.locator('[data-player-mark]:visible');
        const b = (await m.boundingBox())!;
        const clip = { x: Math.floor(b.x), y: Math.floor(b.y), width: Math.ceil(b.width), height: Math.ceil(b.height) };
        await p.mouse.move(700, 700); await stable(() => m.evaluate((e) => e.innerHTML.length + getComputedStyle(e).color));
        await p.screenshot({ path: `${OUTDIR}/pose-rest-${tag}.png`, clip });
        await m.hover(); await stable(() => m.evaluate((e) => e.innerHTML));
        await p.screenshot({ path: `${OUTDIR}/pose-lifted-${tag}.png`, clip });
      }
      await ctx.close();
    }
    return;
  }
  // SEAM — one context (BroadcastChannel is per context), coarse, both pages 390×844.
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, colorScheme: 'light', reducedMotion: 'reduce' });
  const a = await ctx.newPage(); await a.goto(`${DEV}/?size=3&difficulty=EASY&wire=local&board=${payload}`); await settled(a);
  const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
  await a.locator('.drawer-tab').first().click(); await stable(() => verb.evaluate((e) => e.getBoundingClientRect().top));
  await verb.click(); await expect.poll(() => a.locator('.players-roster .player-row').count()).toBe(1);
  await a.locator('.drawer-tab').first().click(); await expect(a.locator('#controls-drawer .drawer-case')).toBeHidden();
  const link = a.url();
  const b = await ctx.newPage(); await b.goto(link); await settled(b);
  await a.bringToFront();
  await expect.poll(() => a.locator('.players-roster .player-row').count()).toBe(2);
  const cell = a.locator('.sudoku-cell input').nth(40);
  await cell.tap();
  await expect.poll(() => b.locator('.is-peer-cursor').count(), { timeout: 10000 }).toBe(1);
  const before = await b.locator('.is-peer-cursor').count();
  await a.locator('[data-player-mark]:visible').tap();
  await expect(a.locator('[data-player-mark]:visible')).toHaveAttribute('aria-expanded', 'true');
  await stable(() => a.locator('[data-lobby]:visible').evaluate((e) => getComputedStyle(e).opacity));
  // sleep-ok: an ABSENCE (a look-away frame that should never come) — CUR_MS is 120.
  await a.waitForTimeout(800);
  const wire = { arm: ARM, ringOnBBefore: before, ringOnBAfter: await b.locator('.is-peer-cursor').count(), aFocusInCell: await a.evaluate(() => !!document.activeElement?.closest('.sudoku-cell')), aFocus: await a.evaluate(() => document.activeElement?.tagName + '.' + (document.activeElement?.className || '')) };
  fs.writeFileSync(`${OUTDIR}/seam-${ARM}-${tag}.json`, JSON.stringify(wire));
  console.log('SEAM', JSON.stringify(wire));
  await a.screenshot({ path: `${OUTDIR}/seam-${ARM}-a-${tag}.png`, clip: { x: 0, y: 0, width: 390, height: 300 } });
  const bb = (await b.locator('.board-cells').boundingBox())!;
  await b.bringToFront();
  await b.screenshot({ path: `${OUTDIR}/seam-${ARM}-b-${tag}.png`, clip: { x: Math.floor(bb.x), y: Math.floor(bb.y + bb.height / 3 - 4), width: Math.ceil(bb.width), height: Math.ceil(bb.height / 3 + 8) } });
  await ctx.close();
});
