// CTRL-FACE pass 10 - π at rest: two served builds, one engine, one cell, one pinned payload, PRM.
// usage: node pi10.mjs <engine> <urlA> <urlB> <w> <h> <dpr> [drawer]   (TOUCH=1 for the coarse cell)
// Reads the viewport of A and B (and A against A, the null floor) after the board is laid and the
// fonts are in, and counts the device pixels whose RGBA differ. One browser, a context per read.
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
import { createRequire } from "node:module";
const sharp = createRequire(import.meta.url)("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp");
const [eng, A, B, w, h, dpr, drawer] = process.argv.slice(2);
const PAYLOAD = "/?size=3&difficulty=MEDIUM&board=ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const touch = process.env.TOUCH === "1";
const b = await (eng === "webkit" ? webkit : chromium).launch();
const shot = async (url) => {
  const ctx = await b.newContext({ viewport: { width: +w, height: +h }, deviceScaleFactor: +dpr, reducedMotion: "reduce", hasTouch: touch, isMobile: touch && eng !== "webkit" });
  try {
    const p = await ctx.newPage();
    await p.goto(url + PAYLOAD);
    await p.waitForSelector("svg.handwritten-logo");
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(2500);
    if (drawer === "drawer" && !(await p.locator(".controls-card:visible").first().isVisible().catch(() => false))) {
      await (touch ? p.locator(".drawer-tab").tap() : p.locator(".drawer-tab").click());
      await p.waitForTimeout(1500);
    }
    const id = await p.evaluate(() => [...document.scripts].map((s) => s.src).find((s) => /index-/.test(s))?.split("/").pop());
    return { png: await p.screenshot(), id };
  } finally {
    await ctx.close();
  }
};
try {
  const a = await shot(A), a2 = await shot(A), c = await shot(B);
  const raw = async (png) => sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const diff = async (x, y) => {
    const [p, q] = [await raw(x), await raw(y)];
    if (p.info.width !== q.info.width || p.info.height !== q.info.height) return `size ${p.info.width}x${p.info.height} vs ${q.info.width}x${q.info.height}`;
    let n = 0;
    for (let i = 0; i < p.data.length; i += 4) if (p.data[i] !== q.data[i] || p.data[i + 1] !== q.data[i + 1] || p.data[i + 2] !== q.data[i + 2] || p.data[i + 3] !== q.data[i + 3]) n++;
    return n;
  };
  console.log(`PI ${eng} ${w}x${h}@${dpr}${touch ? " coarse" : ""}${drawer ? " drawer" : ""} A=${a.id} B=${c.id} · A-vs-B ${await diff(a.png, c.png)} px of ${(+w * +dpr) * (+h * +dpr)} · null A-vs-A ${await diff(a.png, a2.png)}`);
} finally {
  await b.close();
}
