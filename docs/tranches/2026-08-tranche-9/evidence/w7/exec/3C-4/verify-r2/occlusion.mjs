/** r2 verifier — what the standing tape covers on a phone, and for how long it stands. */
import { chromium } from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';
const BASE = process.argv[2];
const SOLO = '?size=3&difficulty=EASY&wire=local';
const cellInput = (p, i) => p.locator('.sudoku-cell input').nth(i);
async function settled(page) {
  await page.waitForSelector('svg.handwritten-logo', { timeout: 60000 });
  for (let i = 0; i < 120; i++) {
    if ((await page.locator('.sudoku-cell .glyph-svg').count()) > 0) return;
    await page.waitForTimeout(500);
  }
  throw new Error('board never settled');
}
const values = (p) => p.evaluate(() => [...document.querySelectorAll('.sudoku-cell input')].map(i=>i.value));
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport:{width:390,height:844}, hasTouch:true, isMobile:true, reducedMotion:'reduce', deviceScaleFactor:2 });
const a = await ctx.newPage();
await a.setViewportSize({width:1280,height:800});
await a.goto(new URL('./'+SOLO, BASE).href); await settled(a);
const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
await verb.waitFor({state:'visible',timeout:30000});
for (let i=0;i<60 && await verb.isDisabled(); i++) await a.waitForTimeout(500);
await verb.click();
for (let i=0;i<60 && !new URL(a.url()).searchParams.get('s'); i++) await a.waitForTimeout(500);
const b = await ctx.newPage(); await b.goto(a.url()); await settled(b);
const tab = b.locator('.drawer-tab');
if (await tab.count() && (await tab.getAttribute('aria-expanded'))==='true') { await tab.tap(); await b.waitForTimeout(1200); }
const before = await values(a);
const peer = before.findIndex((v,i)=>!v && i%9!==0 && i>9);
await cellInput(a, peer).click(); await cellInput(a, peer).fill('5'); await a.waitForTimeout(900);
await cellInput(b, peer).tap(); await b.waitForTimeout(800);
const read = () => b.evaluate((peer) => {
  const lab = document.querySelector('.attribution-tape .washi-label');
  if (!lab) return { tape: null };
  const r = lab.getBoundingClientRect();
  const cells = [...document.querySelectorAll('.sudoku-cell')];
  const hits = [];
  cells.forEach((c,i)=>{ const q=c.getBoundingClientRect();
    const ox = Math.max(0, Math.min(r.right,q.right)-Math.max(r.left,q.left));
    const oy = Math.max(0, Math.min(r.bottom,q.bottom)-Math.max(r.top,q.top));
    if (ox>0.5 && oy>0.5) hits.push({ cell:i, coverPct: Math.round(1000*ox*oy/(q.width*q.height))/10, digit: c.querySelector('input')?.value || (c.querySelector('.glyph-svg')?'glyph':'') });
  });
  const cs = getComputedStyle(lab);
  return { tape:{ w:Math.round(r.width*100)/100, h:Math.round(r.height*100)/100, top:Math.round(r.top*100)/100 }, bg: cs.backgroundColor, opacity: cs.opacity, hits, peer };
}, peer);
const t0 = await read();
// type a digit into a DIFFERENT own cell after re-focusing? first: does the tape stand while the
// player keeps the peer cell selected and 8 seconds pass?
await b.waitForTimeout(8000);
const t1 = await read();
console.log(JSON.stringify({ peerCell: peer, atTap: t0, after8s: t1 }, null, 1));
await browser.close();
