/** L6-G4 born-RED: shrink the vignette so the clamp swallows most of the push.
 *  New floor (>30) must RED; the pass-6 floor (>0) must still PASS — that gap IS
 *  the discriminating power the re-cut recovers. */
import { chromium, webkit } from "playwright";
const BASE = "http://127.0.0.1:4237";
const COARSE = { viewport: { width: 390, height: 664 }, hasTouch: true, isMobile: true };
const H = +(process.argv[2] ?? 80);
for (const [label, type] of [["chromium", chromium], ["webkit", webkit]]) {
  const b = await type.launch(); const ctx = await b.newContext(COARSE); const page = await ctx.newPage();
  await page.goto(`${BASE}/?size=3&difficulty=EASY`);
  await page.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
  await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await page.waitForFunction(() => document.querySelectorAll(".sudoku-cell .glyph-svg").length > 0, { timeout: 20000 });
  await page.waitForTimeout(600);
  // the row's own CONTROL arm, plus the ABLATION: a shorter vignette
  await page.addStyleTag({ content: `.completion-vignette{position:static!important;height:${H}px!important;min-height:0!important;overflow:hidden!important}` });
  await page.waitForTimeout(200);
  const r = await page.evaluate(() => {
    const doc = document.scrollingElement || document.documentElement;
    const v = document.querySelector(".completion-vignette"), host = document.querySelector("#fold-tools");
    const before = { doc: doc.scrollHeight, top: host.getBoundingClientRect().top };
    const prior = v.style.display; v.style.display = "block"; void v.offsetHeight;
    const out = { docGrowth: doc.scrollHeight - before.doc,
                  ctrlPush: +(host.getBoundingClientRect().top - before.top).toFixed(2),
                  vignetteH: +v.getBoundingClientRect().height.toFixed(2) };
    v.style.display = prior; return out;
  });
  const newFloor = r.docGrowth > 30, oldFloor = r.docGrowth > 0;
  console.log(`${label.padEnd(9)} vignetteH=${r.vignetteH} docGrowth=${r.docGrowth} ctrlPush=${r.ctrlPush}` +
    ` | NEW floor(>30): ${newFloor ? "PASS" : "RED"}  | pass-6 floor(>0): ${oldFloor ? "PASS" : "RED"}`);
  await b.close();
}
