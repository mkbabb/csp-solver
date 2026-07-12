// PRT attribution controls: same 16x16 PRT peek, three arms —
//   shipped        : everything live (re-baseline)
//   no-key-drawons : key glyph draw-ons off, marks still write
//   no-drawons     : all .pencil-draw-on off
// Reports DroppedFrame counts/times per arm. DPR2, headless.
import pw from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js';
import fs from 'fs';
const { chromium } = pw;
const OUT =
  '/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/tranche3/w13-impl/g2';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const arms = [
  ['shipped', ''],
  ['no-key-drawons', '.answer-key-laminate .pencil-draw-on { animation: none !important; opacity: 0.9 !important; }'],
  ['no-drawons', '.pencil-draw-on { animation: none !important; opacity: 1 !important; }'],
];
const results = {};
const browser = await chromium.launch({ headless: true, args: ['--enable-gpu'] });
for (const [name, css] of arms) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.emulateMedia({ contrast: 'more' });
  await page.goto('http://localhost:3001/?size=4', { waitUntil: 'networkidle' });
  await page.waitForSelector('.sudoku-cell', { timeout: 25000 });
  await sleep(4000);
  if (css)
    await page.evaluate((c) => {
      const s = document.createElement('style');
      s.textContent = c;
      document.head.appendChild(s);
    }, css);
  const idx = await page.evaluate(() => [...document.querySelectorAll('.sudoku-cell')].findIndex((c) => !c.querySelector('.glyph-svg')));
  await page.evaluate((i) => document.querySelectorAll('.sudoku-cell')[i].querySelector('input').focus(), idx);
  await browser.startTracing(page, {
    path: `${OUT}/g2-prt-ctl-${name}.json`,
    categories: ['devtools.timeline', 'disabled-by-default-devtools.timeline', 'disabled-by-default-devtools.timeline.frame'],
  });
  await page.keyboard.down('k');
  await sleep(900);
  await browser.stopTracing();
  await page.keyboard.up('k');
  const t = JSON.parse(fs.readFileSync(`${OUT}/g2-prt-ctl-${name}.json`, 'utf8'));
  const ev = t.traceEvents;
  const t0 = Math.min(...ev.filter((e) => e.ts).map((e) => e.ts));
  const drops = ev.filter((e) => e.name === 'DroppedFrame').map((e) => Math.round((e.ts - t0) / 1000));
  const pr = ev.filter((e) => e.name === 'PipelineReporter');
  const states = {};
  for (const e of pr) { const s = e.args?.frame_reporter?.state || '?'; states[s] = (states[s] || 0) + 1; }
  results[name] = { droppedFrames: drops.length, dropTimes: drops, pipelineStates: states };
  await ctx.close();
}
await browser.close();
fs.writeFileSync(`${OUT}/g2-prt-control-results.json`, JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
