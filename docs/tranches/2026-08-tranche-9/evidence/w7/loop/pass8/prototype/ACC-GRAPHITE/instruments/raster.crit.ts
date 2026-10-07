// Prints the board's span key per rig: wrapper CSS width x DPR, data-raster, and the focused
// retrace's computed stroke-width (the product's own reading). Report-only.
import { test } from "@playwright/test";
import { mintBoard } from "./band-lib";
const RIGS = [
  { n: "desk", w: 1280, h: 800, t: false, d: 1 }, { n: "phone", w: 393, h: 699, t: true, d: 1 },
  { n: "tablet", w: 768, h: 1024, t: true, d: 1 }, { n: "tabletL", w: 1024, h: 768, t: true, d: 1 },
  { n: "deskcoarse", w: 1280, h: 800, t: true, d: 1 }, { n: "phone812", w: 812, h: 375, t: true, d: 1 },
  { n: "phone-dpr2", w: 393, h: 699, t: true, d: 2 }, { n: "desk-dpr2", w: 1280, h: 800, t: false, d: 2 },
];
for (const R of RIGS)
  test(`raster-${R.n}`, async ({ browser }, info) => {
    for (const [arm, base] of [["tree", process.env.TREE_URL!], ["control", process.env.CONTROL_URL!]]) {
      const ctx = await browser.newContext({ viewport: { width: R.w, height: R.h }, deviceScaleFactor: R.d, hasTouch: R.t, isMobile: false, reducedMotion: "reduce", colorScheme: "light" });
      const page = await ctx.newPage();
      await page.goto(`${base}/?board=${mintBoard(3, 30)}`, { waitUntil: "domcontentloaded" });
      await page.waitForSelector("svg.hand-drawn-grid", { timeout: 60_000 });
      await page.waitForTimeout(2000);
      await page.locator(".game-cell input").nth(1).focus();
      await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(800);
      const r = await page.evaluate(() => {
        const w = document.querySelector(".board-wrapper") as HTMLElement;
        const svg = document.querySelector("svg.hand-drawn-grid")!.getBoundingClientRect();
        const rt = document.querySelector(".game-cell:has(input:focus-visible) .cell-ghost-retrace");
        return { wrapper: w.offsetWidth, svg: Math.round(svg.width), dpr: devicePixelRatio, raster: w.getAttribute("data-raster"), coarse: matchMedia("(pointer: coarse)").matches, retrace: rt ? getComputedStyle(rt).strokeWidth + " " + getComputedStyle(rt).display : "none" };
      });
      console.log(`RASTER ${info.project.name} ${R.n} ${arm} wrapper ${r.wrapper} svg ${r.svg} dpr ${r.dpr} span ${Math.round(r.svg * r.dpr)}dpx coarse ${r.coarse} data-raster ${r.raster} retrace ${r.retrace}`);
      await ctx.close();
    }
  });
