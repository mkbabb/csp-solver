// PLR-SELF pass 7 row 6: the frame's radius is read off the ground. Reads the lobby frame's path `d` (and the ground's
// computed radius) at a 16px root and at an 18px root, both engines; run once on the tree (live read) and once with the
// literal `:radius="15"` planted back. 16px: the two must be byte-identical (π: nothing moved); 18px: they must differ.
import { createRequire } from 'node:module';
const { chromium, webkit } = createRequire('/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json')('playwright');
import os from 'node:os';
const out = {};
for (const [name, eng] of [['chromium', chromium], ['webkit', webkit]]) {
  const b = await eng.launch(); const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' }); const p = await ctx.newPage();
  await p.goto(''+(process.env.U||'http://127.0.0.1:4241')+'/?size=3&difficulty=EASY&wire=local'); await p.waitForSelector('svg.handwritten-logo', { timeout: 60000 });
  await p.locator('[data-player-mark]:visible').click();
  await p.waitForFunction(() => getComputedStyle(document.querySelector('[data-lobby].is-open')).opacity === '1');
  const read = () => p.evaluate(() => { const l = [...document.querySelectorAll('[data-lobby]')].find((e) => e.getBoundingClientRect().width > 0); return { ground: getComputedStyle(l).borderTopLeftRadius, d: [...l.querySelectorAll('.head-sheet-edge path')].map((x) => x.getAttribute('d')).join('|') }; });
  const r16 = await read();
  await p.evaluate(() => { document.documentElement.style.fontSize = '18px'; });
  await p.waitForTimeout(600);
  const r18 = await read();
  out[name] = { r16: { ground: r16.ground, dLen: r16.d.length, d: r16.d }, r18: { ground: r18.ground, dLen: r18.d.length, d: r18.d } };
  await b.close();
}
import('node:fs').then(()=>{});
const fs = await import('node:fs'); const cr = await import('node:crypto');
fs.writeFileSync(process.env.OUT || '/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrself7b/radius-out.json', JSON.stringify(out));
for (const [k, v] of Object.entries(out)) console.log('RADIUS', k, 'r16 ground', v.r16.ground, 'd sha', cr.createHash('sha1').update(v.r16.d).digest('hex').slice(0, 12), 'len', v.r16.dLen, '| r18 ground', v.r18.ground, 'd sha', cr.createHash('sha1').update(v.r18.d).digest('hex').slice(0, 12), 'len', v.r18.dLen);
console.log(`LOAD ${os.loadavg().map((v) => v.toFixed(2)).join(' ')}`);
