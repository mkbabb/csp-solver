/**
 * L6-G4 — re-cut the covis row's `docGrowth` control threshold from measurement.
 * Reproduces the spec's own probe (in-flow vignette control arm) across the portrait
 * cells the row can run at, both engines, on the SEALED dist. Reports the clamp
 * decomposition: slack at rest, ctrlPush (real push), docGrowth (what survives the clamp).
 */
import { chromium, webkit } from "playwright";
const BASE = process.argv[2] ?? "http://127.0.0.1:4237";
const CELLS = [
  { name: "390x664 THE CASE", width: 390, height: 664 },
  { name: "390x844", width: 390, height: 844 },
  { name: "375x812", width: 375, height: 812 },
  { name: "430x932", width: 430, height: 932 },
  { name: "320x568", width: 320, height: 568 },
];
const probe = async (page) =>
  page.evaluate(() => {
    const doc = document.scrollingElement || document.documentElement;
    const v = document.querySelector(".completion-vignette");
    const host = document.querySelector("#fold-tools");
    const before = { doc: doc.scrollHeight, top: host.getBoundingClientRect().top };
    const restSlack = +(window.innerHeight - before.doc).toFixed(2);
    const prior = v.style.display;
    v.style.display = "block";
    void v.offsetHeight;
    const out = {
      restDoc: before.doc,
      innerH: window.innerHeight,
      restSlack,
      docGrowth: doc.scrollHeight - before.doc,
      ctrlPush: +(host.getBoundingClientRect().top - before.top).toFixed(2),
    };
    v.style.display = prior;
    return out;
  });

const rows = [];
for (const [label, type] of [["chromium", chromium], ["webkit", webkit]]) {
  const browser = await type.launch();
  for (const c of CELLS) {
    const ctx = await browser.newContext({
      viewport: { width: c.width, height: c.height },
      hasTouch: true, isMobile: label === "chromium" ? true : undefined,
      deviceScaleFactor: 3,
    });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/?size=3&difficulty=EASY`);
    await page.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
    await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
    await page.waitForFunction(() => document.querySelectorAll(".sudoku-cell .glyph-svg").length > 0, { timeout: 20000 });
    await page.waitForTimeout(600);
    const green = await probe(page);                       // vignette absolute (shipped)
    await page.addStyleTag({ content: ".completion-vignette{position:static!important}" });
    await page.waitForTimeout(200);
    const ctrl = await probe(page);                        // the CONTROL arm
    rows.push({ engine: label, cell: c.name, green, ctrl });
    console.log(
      `${label.padEnd(9)} ${c.name.padEnd(16)} rest doc=${ctrl.restDoc} innerH=${ctrl.innerH} slack=${ctrl.restSlack}` +
      `  | GREEN growth=${green.docGrowth} push=${green.ctrlPush}` +
      `  | CONTROL growth=${ctrl.docGrowth} push=${ctrl.ctrlPush}`,
    );
    await ctx.close();
  }
  await browser.close();
}
const controls = rows.map((r) => r.ctrl.docGrowth);
console.log(`\nCONTROL docGrowth across ${controls.length} cells x engines: min=${Math.min(...controls)} max=${Math.max(...controls)}`);
console.log(`CONTROL ctrlPush: min=${Math.min(...rows.map(r=>r.ctrl.ctrlPush))} max=${Math.max(...rows.map(r=>r.ctrl.ctrlPush))}`);
console.log(JSON.stringify(rows, null, 1));
