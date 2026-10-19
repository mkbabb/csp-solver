import { test } from "@playwright/test";
// Runtime filter census (PAL-WALK pass 9, read once): live elements painting a CSS filter or
// backdrop-filter, and <filter> elements in the DOM, on the board, light and dark, tree vs control.
const BOARD = "ATMuMzkxNjc4NDIwMjQwMDMwNjA4Njc4MDAwMDMwMTg2OTI3MzAwMDU5MzE0Mjg2NDAyODU2OTE3MDYzNTkxMDQwNTA3NDYyODkwOTI0NzgzMDYx";
for (const [name, base] of [["tree", "http://127.0.0.1:4244"], ["control", "http://127.0.0.1:4232"]] as const)
  test(`filters ${name}`, async ({ page }) => {
    await page.goto(`${base}/?board=${BOARD}`);
    await page.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 40000 });
    await page.waitForTimeout(2500);
    for (const arm of ["light", "dark"]) {
      await page.evaluate((d) => document.documentElement.classList.toggle("dark", d === "dark"), arm);
      await page.waitForTimeout(400);
      const r = await page.evaluate(() => {
        let css = 0, back = 0;
        for (const el of document.querySelectorAll("*")) {
          const cs = getComputedStyle(el);
          if (cs.filter && cs.filter !== "none") css++;
          if ((cs as unknown as Record<string, string>).backdropFilter && (cs as unknown as Record<string, string>).backdropFilter !== "none") back++;
        }
        return { css, back, svgFilter: document.querySelectorAll("filter").length };
      });
      console.log(`FILTERS ${name} ${arm} css-filter ${r.css} backdrop ${r.back} svg<filter> ${r.svgFilter}`);
    }
  });
