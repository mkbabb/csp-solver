/** PLR-SELF pass 7 — crop 3 re-shot (retires pass6/prototype/PLR-SELF/3-seam-b-vs-a-chromium-light-390x844-coarse.png).
 *  One payload (the pass-6 minted board, read back through the aria corpus), ONE variable (TAP_IS_A_LOOK, flipped between
 *  runs by seam.sh). B's peer id PINNED to p-0000000b0b0b through `session-identity-v1` (LAWS P6 §C); A's id is made
 *  identical across arms by Math.random re-seeded the instant before A's invite (the rig, the same in both arms). Coarse, witnessed,
 *  PRM reduce (the boil and the sun parked), light, DPR 1. OUTDIR gets raw panes; compose.mjs cuts the composite. */
import { test, expect, type Page } from '@playwright/test';
import fs from 'node:fs';
const OUTDIR = process.env.OUTDIR!, ARM = process.env.ARM!, DEV = 'http://127.0.0.1:4241';
const PAYLOAD = fs.readFileSync(`${OUTDIR}/payload.txt`, 'utf8').trim();
async function settled(p: Page) { await p.waitForSelector('svg.handwritten-logo', { timeout: 60000 }); await expect.poll(() => p.locator('.sudoku-cell .glyph-svg').count(), { timeout: 60000 }).toBeGreaterThan(0); }
async function stable(read: () => Promise<unknown>) { let last: unknown = Symbol('u'); await expect.poll(async () => { const v = JSON.stringify(await read()); const s = v === last; last = v; return s; }, { intervals: [150], timeout: 8000 }).toBe(true); }
const givens = (p: Page) => p.evaluate(() => [...document.querySelectorAll('.sudoku-cell input')].map((i) => /given clue (\d)/.exec(i.getAttribute('aria-label') ?? '')?.[1] ?? '0').join(''));
test(`seam ${ARM}`, async ({ browser }, info) => {
  const tag = info.project.name;
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, colorScheme: 'light', reducedMotion: 'reduce' });
  await ctx.addInitScript(() => { let s = 0x0b0b0b; Math.random = () => ((s = (s * 16807) % 2147483647) / 2147483647); (window as any).__reseed = () => { s = 0x0a0a0a; }; });
  const a = await ctx.newPage(); await a.goto(`${DEV}/?size=3&difficulty=EASY&wire=local&board=${PAYLOAD}`); await settled(a);
  expect(await a.evaluate(() => matchMedia('(pointer: coarse)').matches)).toBe(true);
  const g = await givens(a);
  const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
  await a.locator('.drawer-tab').first().click(); await stable(() => verb.evaluate((e) => e.getBoundingClientRect().top));
  // A's id: Math.random re-seeded the instant before the invite, so the id it mints is the same draw in both arms
  await a.evaluate(() => (window as any).__reseed()); await verb.click(); await expect.poll(() => a.locator('.players-roster .player-row').count()).toBe(1);
  await a.locator('.drawer-tab').first().click(); await expect(a.locator('#controls-drawer .drawer-case')).toBeHidden();
  const link = a.url(); const room = new URL(link).searchParams.get('s')!;
  const b = await ctx.newPage();
  await b.addInitScript((room) => sessionStorage.setItem('session-identity-v1', JSON.stringify({ [room]: 'p-0000000b0b0b' })), room);
  await b.goto(link); await settled(b);
  const bId = await b.evaluate(() => sessionStorage.getItem('session-identity-v1'));
  await a.bringToFront();
  await expect.poll(() => a.locator('.players-roster .player-row').count()).toBe(2);
  const slugs = await a.evaluate(() => [...document.querySelectorAll('.players-roster .player-row .player-name')].map((e) => e.textContent?.trim()));
  const cell = a.locator('.sudoku-cell input').nth(40);
  await cell.tap();
  await expect.poll(() => b.locator('.is-peer-cursor').count(), { timeout: 10000 }).toBe(1);
  const before = await b.locator('.is-peer-cursor').count();
  await a.locator('[data-player-mark]:visible').tap();
  await expect(a.locator('[data-player-mark]:visible')).toHaveAttribute('aria-expanded', 'true');
  await stable(() => a.locator('[data-lobby]:visible').evaluate((e) => getComputedStyle(e).opacity));
  // sleep-ok: an ABSENCE (a look-away frame that should never come) — CUR_MS is 120.
  await a.waitForTimeout(800);
  const wire = { arm: ARM, engine: tag, payload: PAYLOAD, givensReadBack: g === (await givens(b)) ? 'identical on A and B' : 'DIFFER', bSession: bId, aSession: await a.evaluate(() => sessionStorage.getItem('session-identity-v1')), slugs, ringOnBBefore: before, ringOnBAfter: await b.locator('.is-peer-cursor').count(), aFocusInCell: await a.evaluate(() => !!document.activeElement?.closest('.sudoku-cell')), aFocus: await a.evaluate(() => document.activeElement?.tagName + '.' + (document.activeElement?.className || '')) };
  fs.writeFileSync(`${OUTDIR}/seam-${ARM}-${tag}.json`, JSON.stringify(wire));
  console.log('SEAM', JSON.stringify(wire));
  await a.screenshot({ path: `${OUTDIR}/seam-${ARM}-a-${tag}.png`, clip: { x: 0, y: 0, width: 390, height: 300 } });
  const bb = (await b.locator('.board-cells').boundingBox())!;
  await b.bringToFront();
  await b.screenshot({ path: `${OUTDIR}/seam-${ARM}-b-${tag}.png`, clip: { x: Math.floor(bb.x), y: Math.floor(bb.y + bb.height / 3 - 4), width: Math.ceil(bb.width), height: Math.ceil(bb.height / 3 + 8) } });
  await ctx.close();
});
