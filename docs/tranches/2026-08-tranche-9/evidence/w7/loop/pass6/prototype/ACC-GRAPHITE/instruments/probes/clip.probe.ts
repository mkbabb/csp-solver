import { test } from "@playwright/test";
import { mintBoard } from "./lib";
test("clip", async ({ browser }, info) => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(`${process.env.BASE}/?board=${mintBoard(3, 30)}`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("svg.hand-drawn-grid", { timeout: 60_000 }); await page.waitForTimeout(3000);
  const r = await page.evaluate(() => {
    const svg = document.querySelector("svg.hand-drawn-grid")!;
    const imgs = [...svg.querySelectorAll("image")].map((i) => ({ w: i.getAttribute("width"), h: i.getAttribute("height"), x: i.getAttribute("x"), y: i.getAttribute("y"), vis: getComputedStyle(i.parentElement!).opacity }));
    const frame = svg.querySelector(".frame-line") as SVGPathElement | null;
    const fb = frame?.getBBox();
    return { overflow: getComputedStyle(svg).overflow, images: imgs.length, imgSample: imgs.slice(0, 2), frameLinePresent: !!frame, frameBBox: fb ? { x: fb.x, y: fb.y, w: fb.width, h: fb.height } : null, frameStroke: frame ? getComputedStyle(frame).strokeWidth : null, frameOpacity: frame ? getComputedStyle(frame).opacity : null, frameVis: frame ? getComputedStyle(frame.parentElement!).opacity : null };
  });
  console.log("CLIP", info.project.name, JSON.stringify(r));
  await ctx.close();
});
