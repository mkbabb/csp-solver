import { test } from "@playwright/test";
import { mintBoard } from "./lib";
test("anc", async ({ browser }, info) => {
  const ctx = await browser.newContext({ viewport: { width: Number(process.env.VW ?? 1280), height: Number(process.env.VH ?? 800) }, deviceScaleFactor: 1, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(`${process.env.BASE}/?board=${mintBoard(Number(process.env.SZ ?? 4), Number(process.env.GV ?? 76))}`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("svg.hand-drawn-grid", { timeout: 60_000 }); await page.waitForTimeout(2000);
  const out = await page.evaluate(() => {
    const rows: string[] = [];
    let el: Element | null = document.querySelector("svg.hand-drawn-grid");
    const sr = el!.getBoundingClientRect();
    while (el && el !== document.body) {
      const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
      rows.push(`${el.tagName.toLowerCase()}.${(el.getAttribute("class") ?? "").split(" ").slice(0, 3).join(".")} rect ${r.x.toFixed(1)},${r.y.toFixed(1)} ${r.width.toFixed(1)}x${r.height.toFixed(1)} ov ${cs.overflow} clip ${cs.clipPath} contain ${cs.contain} pad ${cs.padding}`);
      el = el.parentElement;
    }
    const vb = document.querySelector("svg.hand-drawn-grid")!.getAttribute("viewBox");
    return { svg: `${sr.x},${sr.y} ${sr.width}x${sr.height} viewBox ${vb}`, rows };
  });
  console.log(info.project.name, out.svg); for (const r of out.rows) console.log("  " + r);
  await ctx.close();
});
