// ACC-SIX pass 8 · charter row 10: the live-filter count at BOOT (first settled paint) and at REST (4 s on), light
// and dark, 1280x800 fine, PRM reduce, the default deal: every element whose computed `filter` is not `none`,
// the SVG `filter` attribute's elements included (the critic's pass-7 reading: control 25/9 light, 27/11 dark).
//   node .acc6p8/filter-count.mjs --urls tree=http://127.0.0.1:4237,control=http://127.0.0.1:4250 [--engine chromium]
import { args, playwright, openCell, load } from "../e2e/lib/paint-lib.mjs";

const A = args();
const engine = A.engine ?? "chromium";
const browser = await playwright()[engine].launch();
const count = (page) =>
  page.evaluate(() => {
    let n = 0;
    const names = {};
    for (const el of document.querySelectorAll("*")) {
      const f = getComputedStyle(el).filter;
      const attr = el instanceof SVGElement ? el.getAttribute("filter") : null;
      if ((f && f !== "none") || (attr && attr !== "none")) {
        n++;
        const k = (el.getAttribute("class") || el.tagName).toString().split(" ")[0];
        names[k] = (names[k] ?? 0) + 1;
      }
    }
    return { n, names };
  });
for (const [label, url] of A.urls.split(",").map((x) => x.split("=")))
  for (const colorScheme of ["light", "dark"]) {
    const { ctx, page } = await openCell(browser, { width: 1280, height: 800, dpr: 1, colorScheme, reducedMotion: "reduce" });
    await page.goto(url + "/");
    await page.waitForSelector(".sudoku-cell", { timeout: 60000 });
    const boot = await count(page);
    await page.waitForTimeout(4000);
    const rest = await count(page);
    console.log(`FILTERS ${label} ${engine} ${colorScheme} boot ${boot.n} / rest ${rest.n} · rest by class ${JSON.stringify(rest.names)} · LOAD ${load()}`);
    await ctx.close();
  }
await browser.close();
