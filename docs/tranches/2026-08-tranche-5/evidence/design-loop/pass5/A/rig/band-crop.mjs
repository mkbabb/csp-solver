/** The picker's composition on disk (T5-W4a DELTA discipline). One crop per pointer regime. */
import { chromium } from "@playwright/test";
const base = process.argv[2];
const b = await chromium.launch();
for (const r of [
  { tag: "fine-1280", viewport: { width: 1280, height: 900 }, dpr: 2, mobile: false },
  { tag: "coarse-390", viewport: { width: 390, height: 844 }, dpr: 3, mobile: true },
]) {
  const ctx = await b.newContext({ viewport: r.viewport, deviceScaleFactor: r.dpr, isMobile: r.mobile, hasTouch: r.mobile });
  const p = await ctx.newPage();
  await p.goto(base + "/?view=gallery&size=3&difficulty=EASY");
  await p.waitForSelector(".staging-band", { timeout: 20000 });
  await p.waitForTimeout(900);
  const path = `crops/band-${r.tag}.png`;
  await p.locator(".staging-band").screenshot({ path });
  console.log(path);
  await ctx.close();
}
await b.close();
