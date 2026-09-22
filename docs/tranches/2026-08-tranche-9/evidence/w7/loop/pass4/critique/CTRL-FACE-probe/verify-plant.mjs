import { chromium } from "playwright";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, baseURL: "http://127.0.0.1:4243" });
const p = await ctx.newPage();
await p.emulateMedia({ reducedMotion: "reduce" });
await p.goto("/?size=3&difficulty=EASY", { waitUntil: "networkidle" });
await p.waitForSelector("svg.handwritten-logo", { timeout: 25000 });
const r = await p.evaluate(() => {
  const card = [...document.querySelectorAll(".controls-card")].find((c) => c.getClientRects().length);
  const words = [...card.querySelectorAll(".tray-well .ctrl-btn .ctrl-word")].filter(w=>w.getClientRects().length).slice(0, 3);
  const btn = card.querySelector(".tray-well .ctrl-btn");
  return {
    wordFaces: words.map((w) => `${w.textContent.trim()} -> ${getComputedStyle(w).fontFamily}`),
    btnFace: btn ? getComputedStyle(btn).fontFamily : null,
  };
});
console.log(JSON.stringify(r, null, 1));
await b.close();
