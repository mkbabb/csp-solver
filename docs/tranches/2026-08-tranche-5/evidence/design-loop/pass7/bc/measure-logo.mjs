import { webkit, chromium } from "@playwright/test";

const BASE = "http://localhost:4251";
const GAMES = ["sudoku", "futoshiki", "thermo", "killer", "kenken"];

async function measure(engine, name) {
  const b = await engine.launch();
  const out = [];
  for (const game of GAMES) {
    const ctx = await b.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 2,
    });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/?game=${game}&size=3&difficulty=EASY`);
    await page.waitForSelector("svg.handwritten-logo image.logo-pose-bmp", {
      timeout: 15000,
    });
    await page.waitForTimeout(1200);
    const r = await page.evaluate(async () => {
      const svg = document.querySelector("svg.handwritten-logo");
      const rect = svg.getBoundingClientRect();
      const img = svg.querySelector("image.logo-pose-bmp");
      const href = img?.getAttribute("href");
      const nat = await new Promise((ok) => {
        if (!href) return ok(null);
        const i = new Image();
        i.onload = () => ok({ w: i.naturalWidth, h: i.naturalHeight });
        i.onerror = () => ok(null);
        i.src = href;
      });
      return { rectW: rect.width, rectH: rect.height, nat, dpr: devicePixelRatio };
    });
    const w = r.rectW;
    out.push({
      game,
      rectW: +w.toFixed(4),
      frac: +(w - Math.floor(w)).toFixed(4),
      round1: Math.round(w),
      round2: Math.round(w / 2) * 2,
      distTo1pxBoundary: +Math.abs(w - Math.floor(w) - 0.5).toFixed(4),
      distTo2pxBoundary: +Math.abs(w / 2 - Math.floor(w / 2) - 0.5).toFixed(4),
      bakedDevicePx: r.nat ? r.nat.w : null,
      expectedDevicePx: r.nat ? Math.round(w / 2) * 2 * r.dpr : null,
      dpr: r.dpr,
    });
    await ctx.close();
  }
  await b.close();
  console.log(`\n== ${name} ==`);
  for (const o of out) console.log(JSON.stringify(o));
}

await measure(webkit, "webkit");
await measure(chromium, "chromium");
