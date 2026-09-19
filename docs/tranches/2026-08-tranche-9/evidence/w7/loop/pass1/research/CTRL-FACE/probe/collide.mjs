// CTRL-FACE pass-1 — two readings the JSON census did not carry:
//  (1) the grown tape's box against the tab-head row it straddles (the crop shows a collision);
//  (2) the APPARENT size of one px in each face — x-height and cap-height at the same font-size,
//      because "the face, not the size, is the hierarchy device" is a claim about perceived rank.
const { webkit, chromium } = await import(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs",
);
const BASE = process.env.BASE || "http://127.0.0.1:4234/";
for (const [eng, launch] of [["chromium", chromium], ["webkit", webkit]]) {
  const browser = await launch.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, colorScheme: "dark", deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
  await page.waitForTimeout(1600);
  if (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(950);
  }
  const r = await page.evaluate(() => {
    const tape = document.querySelector(".controls-card .tray-well > .washi-tag");
    const heads = [...document.querySelectorAll(".controls-card .mobile-heading-btn")];
    const t = tape.getBoundingClientRect();
    const rows = heads.map((h) => {
      const b = h.getBoundingClientRect();
      const ox = Math.max(0, Math.min(t.right, b.right) - Math.max(t.left, b.left));
      const oy = Math.max(0, Math.min(t.bottom, b.bottom) - Math.max(t.top, b.top));
      return { head: h.innerText.replace(/\s+/g, " ").trim().slice(0, 10), overlapPx2: +(ox * oy).toFixed(1), overlapX: +ox.toFixed(2), overlapY: +oy.toFixed(2) };
    });
    const c = document.createElement("canvas").getContext("2d");
    /* "x" and "H" are in NEITHER display cut (Fraunces ships no x; Patrick Hand ships no H),
       so measuring them reads the UA fallback in both and reports one number twice. The
       x-height proxy is "n" and the ascender proxy is "d" — both are in all three cmaps. */
    const metric = (fam) => {
      c.font = `400 20px "${fam}"`;
      const n = c.measureText("n");
      const d = c.measureText("d");
      const w = c.measureText("normal");
      return { xHeight_n: +n.actualBoundingBoxAscent.toFixed(2), ascender_d: +d.actualBoundingBoxAscent.toFixed(2), advance_normal: +w.width.toFixed(2) };
    };
    const fr = (wt) => { c.font = `${wt} 20px "Fraunces"`; const m = c.measureText("level"); return { weight: wt, advance_level: +m.width.toFixed(3), nAscent: +c.measureText("n").actualBoundingBoxAscent.toFixed(2) }; };
    return {
      tapeBox: [+t.width.toFixed(2), +t.height.toFixed(2)],
      tapeVsHeads: rows,
      faces: { "Fira Code": metric("Fira Code"), "Patrick Hand": metric("Patrick Hand"), Fraunces: metric("Fraunces") },
      frauncesAxis: [100, 300, 500, 700, 800, 900].map(fr),
    };
  });
  console.log(`--- ${eng} @ ${BASE}`);
  console.log(JSON.stringify(r, null, 1));
  await browser.close();
}
