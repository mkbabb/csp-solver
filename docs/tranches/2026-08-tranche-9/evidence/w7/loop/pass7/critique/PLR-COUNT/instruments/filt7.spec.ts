import { test, type Page } from "@playwright/test";
const BOARD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
async function count(page: Page, base: string, open: boolean) {
  await page.goto(`${base}/?board=${BOARD}`);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(2000);
  if (open) { const m = page.locator("button.player-mark:visible, .corner-left .attribution-trigger:visible").first(); if (await m.count()) await m.click(); await page.waitForTimeout(900); }
  return page.evaluate(() => {
    let css = 0, url = 0, vis = 0;
    for (const e of document.querySelectorAll("*")) {
      const f = getComputedStyle(e).filter;
      if (f && f !== "none") { css++; if (/url\(/.test(f)) url++; const r = e.getBoundingClientRect(); if (r.width && r.height && getComputedStyle(e).visibility !== "hidden") vis++; }
    }
    const filt = document.querySelectorAll("filter").length;
    const id = [...document.scripts].map((s) => s.src).find((s) => /index-/.test(s))?.split("/").pop();
    return { id, css, url, vis, filterEls: filt };
  });
}
for (const theme of ["light", "dark"] as const)
  test(`FILT7 ${theme}`, async ({ browser }) => {
    const out: Record<string, unknown> = {};
    for (const [n, base] of [["ctrl", "http://127.0.0.1:4244"], ["tree", "http://127.0.0.1:4245"]] as const)
      for (const open of [false, true]) {
        const p = await (await browser.newContext({ viewport: { width: 1280, height: 800 }, colorScheme: theme, reducedMotion: "reduce" })).newPage();
        out[`${n}-${open ? "open" : "shut"}`] = await count(p, base, open);
      }
    console.log("FILT7", test.info().project.name, theme, JSON.stringify(out));
  });
