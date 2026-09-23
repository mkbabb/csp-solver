import { chromium, webkit } from '@playwright/test';
const B = 'ATMuMDM0NjA4OTEy';
for (const [name, eng] of [['chromium', chromium], ['webkit', webkit]]) {
  const b = await eng.launch();
  for (const port of [4238, 4239]) {
    const p = await b.newPage();
    await p.goto(`http://127.0.0.1:${port}/?game=sudoku`);
    await p.locator('.board-cells').first().waitFor();
    const r = await p.evaluate(() => {
      const out = [];
      const walk = (rules, depth) => { for (const r of rules) { if (r.constructor.name === 'CSSPropertyRule' && /^--(motion-|live-fit)/.test(r.name)) out.push(`${r.name}:${r.inherits}:${r.initialValue}:d${depth}`); if (r.cssRules) walk(r.cssRules, depth + 1); } };
      for (const s of document.styleSheets) { try { walk(s.cssRules, 0); } catch {} }
      return out;
    });
    console.log(name, port, r.length, r.join(' '));
    await p.close();
  }
  await b.close();
}
