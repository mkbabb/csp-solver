// G13 — a rAF trace across a staged chip press (the scribble's move is a one-frame pose swap), and the chip's colour
// transition under PRM (FACE charter row 9's read, cited). usage: BASE=… node g13.mjs <engine>
import { createRequire } from 'node:module';
const require = createRequire('/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json');
const pw = require('playwright');
const engine = process.argv[2] || 'chromium';
const BASE = process.env.BASE;
const Q = '/?size=3&difficulty=MEDIUM&board=ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5';
const browser = await pw[engine].launch();
for (const [mode, plant] of [['full', ''], ['prm', ''], ['prm+plant', '.ctrl-btn{transition:color 150ms !important}']]) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, reducedMotion: mode.startsWith('prm') ? 'reduce' : 'no-preference' });
  const p = await ctx.newPage(); await p.goto(BASE + Q, { waitUntil: 'load' });
  await p.waitForSelector('.new-game-zone .ctrl-btn', { timeout: 20000 }); await p.waitForTimeout(1200);
  if (plant) await p.addStyleTag({ content: plant });
  await p.evaluate(() => {
    const chips = [...document.querySelectorAll('.new-game-zone .staged-section')].at(-1).querySelectorAll('.ctrl-btn');
    window.__trace = []; const t0 = performance.now();
    const tick = () => { window.__trace.push([...chips].map((c) => (c.classList.contains('selected-item') && getComputedStyle(c).backgroundImage !== 'none' ? 1 : 0)).join('') + '@' + Math.round(performance.now() - t0)); if (window.__trace.length < 40) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  });
  await p.waitForTimeout(80);
  const target = p.locator('.new-game-zone .staged-section').last().locator('.ctrl-btn[aria-pressed="false"]').first();
  const lbl = (await target.textContent()).trim();
  await target.click();
  const colorProbe = await target.evaluate((el) => ({ dur: getComputedStyle(el).transitionDuration, prop: getComputedStyle(el).transitionProperty }));
  await p.waitForTimeout(700);
  const trace = await p.evaluate(() => window.__trace);
  const states = trace.map((s) => s.split('@')[0]);
  const distinct = states.filter((s, i) => i === 0 || s !== states[i - 1]);
  const mixed = states.filter((s) => (s.match(/1/g) || []).length !== 1).length;
  console.log(`${engine} ${mode}: pressed ${lbl}; pose sequence ${distinct.join(' → ')} (${distinct.length - 1} swap(s), ${mixed} frame(s) with ≠1 scribble); chip transition ${colorProbe.prop} ${colorProbe.dur}`);
  await ctx.close();
}
await browser.close();
