const { chromium } = await import("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs");
const BASE = process.env.BASE || "http://127.0.0.1:4242/";
const b = await chromium.launch();
for (const [label, url, w, h] of [
  ["gallery-390x844", "?view=gallery&size=3&difficulty=EASY", 390, 844],
  ["gallery-1280x800", "?view=gallery&size=3&difficulty=EASY", 1280, 800],
]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: w < 800, isMobile: w < 800, colorScheme: "dark" });
  const p = await ctx.newPage();
  await p.goto(BASE + url, { waitUntil: "domcontentloaded" });
  await p.waitForSelector("#gallery-card-0 .boil-pose", { timeout: 60000 });
  await p.waitForTimeout(2500);
  const inv = await p.evaluate(() => Array.from(document.querySelectorAll(".washi-tag")).map((t) => {
    const cs = getComputedStyle(t); const r = t.getBoundingClientRect();
    const chain = []; let e = t.parentElement;
    while (e && chain.length < 6) { chain.push(e.tagName.toLowerCase() + (e.className && typeof e.className === "string" ? "." + e.className.split(" ").filter(Boolean).slice(0,2).join(".") : "")); e = e.parentElement; }
    return { text: t.textContent.trim(), family: cs.fontFamily.split(",")[0].replace(/["']/g,"").trim(), px: +parseFloat(cs.fontSize).toFixed(2), weight: cs.fontWeight, lh: cs.lineHeight, mt: cs.marginTop, offsetH: t.offsetHeight, box: { x:+r.x.toFixed(1), y:+r.y.toFixed(1), w:+r.width.toFixed(2), h:+r.height.toFixed(2) }, inGallery: !!t.closest(".game-gallery"), inStaging: !!t.closest(".staging-band"), inCard: !!t.closest(".controls-card"), chain };
  }));
  console.log(label, JSON.stringify(inv, null, 1));
  await ctx.close();
}
await b.close();
