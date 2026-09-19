// CTRL-TABS critic — THE RAIL PIN BETWEEN ITS TWO LITERALS. The card's inline-size is pinned at
// 324.22 (1280) and 330.00 (1440); the desk kill-condition was gated at exactly those two.
// Board x is read at 1280 / 1360 / 1440 / 1600 against the HEAD control.
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";
const OUT = process.env.OUT || "/tmp/deskw.json";
const A = process.env.PROTO || "http://127.0.0.1:4237/";
const B = process.env.HEAD || "http://127.0.0.1:4246/";
const out = {};
for (const engine of ["chromium", "webkit"]) {
  for (const [w, h] of [[1280, 800], [1360, 850], [1440, 900], [1600, 900]]) {
    for (const [tag, base] of [["proto", A], ["head", B]]) {
      const browser = await (engine === "webkit" ? webkit : chromium).launch();
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, colorScheme: "light" });
      const page = await ctx.newPage();
      await page.goto(base + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
      await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
      await page.waitForTimeout(1500);
      out[`${w}-${engine}-${tag}`] = await page.evaluate(() => {
        const b = document.querySelector(".board-wrapper");
        const card = document.querySelector(".controls-card");
        const r = (el) => (el ? { x: +el.getBoundingClientRect().x.toFixed(2), w: +el.getBoundingClientRect().width.toFixed(2) } : null);
        return { board: r(b), boardSel: b ? b.className.slice(0, 40) : null, card: r(card) };
      });
      await browser.close();
    }
  }
}
writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log("EXIT-OK");
