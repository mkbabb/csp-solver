import { chromium } from "playwright";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.emulateMedia({ reducedMotion: "reduce" });
await page.goto("http://127.0.0.1:4233/");
await page.waitForSelector(".controls-card", { state: "attached", timeout: 25000 });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(800);
const r = await page.evaluate(() => {
  const card = document.querySelector(".controls-card");
  card.scrollTop = 58;
  const out = [];
  const heads = [...card.querySelectorAll(".cost-band-head")].map((h) => {
    const b = h.getBoundingClientRect();
    return { txt: h.textContent.trim().slice(0, 12), top: +b.top.toFixed(2), bottom: +b.bottom.toFixed(2), z: getComputedStyle(h).zIndex, pos: getComputedStyle(h).position };
  });
  const chips = [...card.querySelectorAll(".ctrl-btn")].slice(0, 6);
  for (const c of chips) {
    const b = c.getBoundingClientRect();
    const cx = b.x + b.width / 2, cy = b.y + b.height / 2;
    const hit = document.elementFromPoint(cx, cy);
    out.push({
      chip: c.textContent.trim().slice(0, 8),
      cy: +cy.toFixed(2),
      hit: hit ? `${hit.tagName.toLowerCase()}.${String(hit.className).slice(0, 60)}` : null,
      hitBox: hit ? (() => { const hb = hit.getBoundingClientRect(); return { top: +hb.top.toFixed(2), bottom: +hb.bottom.toFixed(2), h: +hb.height.toFixed(2) }; })() : null,
      inHead: !!hit?.closest?.(".cost-band-head"),
    });
  }
  return { cardTop: +card.getBoundingClientRect().top.toFixed(2), padTop: getComputedStyle(card).paddingTop, heads, out };
});
console.log(JSON.stringify(r, null, 1));
await browser.close();
