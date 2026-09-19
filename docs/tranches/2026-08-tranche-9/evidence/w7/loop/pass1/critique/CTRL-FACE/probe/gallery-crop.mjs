/** CRITIC — one crop of the UNCLAIMED surface (the gallery's staging band) + the tape's
 *  collisions there. BASE=http://127.0.0.1:4242/ node probe/gallery-crop.mjs */
const { chromium } = await import(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs"
);
const BASE = process.env.BASE || "http://127.0.0.1:4242/";
const b = await chromium.launch();
for (const cell of [{ name: "gallery-390x844-dark", w: 390, h: 844, mobile: true }]) {
  const ctx = await b.newContext({
    viewport: { width: cell.w, height: cell.h },
    hasTouch: cell.mobile,
    isMobile: cell.mobile,
    colorScheme: "dark",
  });
  const p = await ctx.newPage();
  await p.goto(BASE + "?view=gallery&size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
  await p.waitForSelector("#gallery-card-0 .boil-pose", { timeout: 60000 });
  await p.waitForTimeout(2500);
  const geom = await p.evaluate(() => {
    const tag = document.querySelector(".game-gallery .washi-tag");
    const t = tag.getBoundingClientRect();
    const hits = [];
    for (const sel of ["#gallery-card-0", ".gallery-pip", ".game-gallery button"])
      for (const c of document.querySelectorAll(sel)) {
        const r = c.getBoundingClientRect();
        const px2 =
          Math.max(0, Math.min(t.right, r.right) - Math.max(t.left, r.left)) *
          Math.max(0, Math.min(t.bottom, r.bottom) - Math.max(t.top, r.top));
        if (px2 > 0) hits.push({ sel, px2: +px2.toFixed(1) });
      }
    return { tape: { x: t.x, y: t.y, w: t.width, h: t.height }, hits };
  });
  console.log(cell.name, JSON.stringify(geom));
  await p.screenshot({
    path: "frames/critic-gallery-390x844-dark-staging-tape.png",
    clip: {
      x: 0,
      y: Math.max(0, geom.tape.y - 24),
      width: 390,
      height: Math.min(200, 844 - Math.max(0, geom.tape.y - 24)),
    },
  });
  await ctx.close();
}
await b.close();
