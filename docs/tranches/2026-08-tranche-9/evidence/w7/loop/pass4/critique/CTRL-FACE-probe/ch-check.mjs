import { chromium, webkit } from "playwright";
for (const [name, L] of [["chromium", chromium], ["webkit", webkit]]) {
  const b = await L.launch();
  const c = await b.newContext({ viewport: { width: 390, height: 844 }, baseURL: "http://127.0.0.1:4243", hasTouch: true, isMobile: name === "chromium", deviceScaleFactor: 3 });
  const p = await c.newPage();
  await p.emulateMedia({ reducedMotion: "reduce" });
  await p.goto("/?size=3&difficulty=EASY", { waitUntil: "networkidle" });
  await p.waitForSelector("svg.handwritten-logo", { timeout: 25000 });
  const card = p.locator(".controls-card:visible").first();
  if (!(await card.isVisible().catch(() => false))) { await p.locator(".drawer-tab").tap(); await p.waitForTimeout(1100); }
  const r = await p.evaluate(() => {
    const card = [...document.querySelectorAll(".controls-card")].find((c) => c.getClientRects().length);
    const w = [...card.querySelectorAll(".tray-well .ctrl-btn .ctrl-word")].filter(x => x.getClientRects().length)[0];
    const s = getComputedStyle(w);
    return { text: w.textContent.trim(), bgSize: s.backgroundSize, wordW: Math.round(w.getBoundingClientRect().width * 1000) / 1000 };
  });
  console.log(name, JSON.stringify(r));
  await b.close();
}
