import { chromium } from "playwright";
const b = await chromium.launch();
for (const [name, port] of [["head", 4233], ["ablate", 4234]]) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 664 }, hasTouch: true, isMobile: true });
  const p = await ctx.newPage();
  await p.goto(`http://localhost:${port}/?size=3&difficulty=EASY`, { waitUntil: "load" });
  await p.waitForSelector("svg.handwritten-logo");
  await p.waitForTimeout(1200);
  const r = await p.evaluate(() => {
    const m = () => document.querySelector(".board-margin").offsetHeight;
    const out = { withVoice: m() };
    document.querySelector(".margin-note-ink")?.remove();
    out.silentInkRemoved = m();
    const blk = document.querySelector(".margin-note-block");
    out.blockMinHeight = getComputedStyle(blk).minHeight;
    blk.style.minHeight = "0";
    out.silentReservationStruck = m();
    return out;
  });
  console.log(name, JSON.stringify(r));
  await ctx.close();
}
await b.close();
