// CTRL-TABS critic — §14's TUCK, measured. The tongues are claimed "tucked 8px" under the
// paper with 40 proud; the berth is claimed --edge-strip-h 40px in flow. Read the board's paper
// rect, the strip's rect and the tongue's, at the portrait cells and the two landscape ones.
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";
const BASE = process.env.LANE_BASE || "http://127.0.0.1:4237/";
const OUT = process.env.OUT || "/tmp/tuck.json";
const out = {};
for (const engine of ["chromium", "webkit"]) {
  for (const [w, h] of [[390, 844], [844, 390], [900, 500]]) {
    const browser = await (engine === "webkit" ? webkit : chromium).launch();
    const ctx = await browser.newContext({
      viewport: { width: w, height: h }, deviceScaleFactor: 1,
      isMobile: engine === "chromium" ? true : undefined, hasTouch: true, colorScheme: "light",
    });
    const page = await ctx.newPage();
    await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
    await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
    await page.waitForTimeout(1500);
    out[`${w}x${h}-${engine}`] = await page.evaluate(() => {
      const R = (el) => { if (!el) return null; const b = el.getBoundingClientRect();
        return { x: +b.x.toFixed(2), y: +b.y.toFixed(2), w: +b.width.toFixed(2), h: +b.height.toFixed(2), bottom: +b.bottom.toFixed(2), right: +b.right.toFixed(2) }; };
      const paper = document.querySelector(".board-frame") || document.querySelector(".game-board") || document.querySelector("[class*=board-paper]");
      const edge = document.querySelector("#board-edge");
      const tools = document.querySelector(".edge-tools");
      const tongue = document.querySelector(".drawer-tab");
      const hit = (el) => { if (!el) return null; const b = el.getBoundingClientRect();
        const e = document.elementFromPoint(b.x + b.width / 2, b.y + b.height / 2);
        return el.contains(e) || (e && e.closest && e.closest(".edge-tools, .drawer-tab") ? true : false); };
      const btns = [...document.querySelectorAll(".edge-tools .icon-btn")].map((b) => ({
        t: (b.getAttribute("aria-label") || b.textContent || "").trim().slice(0, 10), ...R(b), hit: hit(b),
      }));
      return {
        paperSel: paper ? paper.className : null, paper: R(paper), edge: R(edge),
        edgeH: edge ? getComputedStyle(edge).height : null,
        stripVar: edge ? getComputedStyle(edge).getPropertyValue("--edge-strip-h").trim() : null,
        tools: R(tools), toolsBtns: btns, tongue: R(tongue),
        toolsCount: btns.length,
        docOver: document.documentElement.scrollHeight - document.documentElement.clientHeight,
      };
    });
    await browser.close();
  }
}
writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log("EXIT-OK");
