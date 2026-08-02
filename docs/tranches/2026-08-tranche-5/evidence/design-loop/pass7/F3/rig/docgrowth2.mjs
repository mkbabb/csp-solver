/**
 * L6-G4 — the covis grade row's CONTROL arm, reproduced at its EXACT context.
 * COARSE = {viewport 390x664, hasTouch, isMobile} — the spec's own `test.use`.
 * N reps per engine because the deal is random per load and the vignette's verdict
 * text is deal-dependent; a threshold must clear the worst rep, not the mean.
 */
import { chromium, webkit } from "playwright";
const BASE = process.argv[2] ?? "http://127.0.0.1:4237";
const REPS = +(process.argv[3] ?? 6);
const COARSE = { viewport: { width: 390, height: 664 }, hasTouch: true, isMobile: true };

const probe = (page) =>
  page.evaluate(() => {
    const doc = document.scrollingElement || document.documentElement;
    const v = document.querySelector(".completion-vignette");
    const host = document.querySelector("#fold-tools");
    const before = { doc: doc.scrollHeight, top: host.getBoundingClientRect().top };
    const prior = v.style.display;
    v.style.display = "block";
    void v.offsetHeight;
    const r = v.getBoundingClientRect();
    const out = {
      restDoc: before.doc, innerH: window.innerHeight,
      slack: +(window.innerHeight - before.doc).toFixed(2),
      vignetteH: +r.height.toFixed(2),
      docGrowth: doc.scrollHeight - before.doc,
      ctrlPush: +(host.getBoundingClientRect().top - before.top).toFixed(2),
    };
    v.style.display = prior;
    return out;
  });

const all = [];
for (const [label, type] of [["chromium", chromium], ["webkit", webkit]]) {
  const browser = await type.launch();
  for (let i = 1; i <= REPS; i++) {
    const ctx = await browser.newContext(COARSE);
    const page = await ctx.newPage();
    await page.goto(`${BASE}/?size=3&difficulty=EASY`);
    await page.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
    await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
    await page.waitForFunction(() => document.querySelectorAll(".sudoku-cell .glyph-svg").length > 0, { timeout: 20000 });
    await page.waitForTimeout(600);
    const green = await probe(page);
    await page.addStyleTag({ content: ".completion-vignette{position:static!important}" });
    await page.waitForTimeout(200);
    const ctrl = await probe(page);
    all.push({ engine: label, rep: i, green, ctrl });
    console.log(
      `${label.padEnd(9)} rep${i}  rest=${ctrl.restDoc}/${ctrl.innerH} slack=${ctrl.slack} vignetteH=${ctrl.vignetteH}` +
      ` | GREEN growth=${green.docGrowth} push=${green.ctrlPush}` +
      ` | CONTROL growth=${ctrl.docGrowth} push=${ctrl.ctrlPush}`);
    await ctx.close();
  }
  await browser.close();
}
const g = all.map(r => r.ctrl.docGrowth), p = all.map(r => r.ctrl.ctrlPush);
console.log(`\nCONTROL docGrowth  n=${g.length}  min=${Math.min(...g)}  max=${Math.max(...g)}  distinct=${[...new Set(g)].sort((a,b)=>a-b).join(",")}`);
console.log(`CONTROL ctrlPush   min=${Math.min(...p)}  max=${Math.max(...p)}  distinct=${[...new Set(p)].sort((a,b)=>a-b).join(",")}`);
console.log(`GREEN arm docGrowth all zero: ${all.every(r=>r.green.docGrowth===0)}  ctrlPush all zero: ${all.every(r=>r.green.ctrlPush===0)}`);
