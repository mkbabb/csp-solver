// critic driver: the wash's painted step under prefers-contrast no-preference|more, both themes, one engine.
// usage: node wash-contrast.mjs <engine> <label> <baseURL>
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
import { onOff, lum, ratio } from "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc6-crit8/base/web/frontend/e2e/lib/paint-lib.mjs";
const [eng, label, base] = process.argv.slice(2);
const SOL9 = Array.from({ length: 81 }, (_, i) => { const r = Math.floor(i / 9); return ((3 * (r % 3) + Math.floor(r / 3) + (i % 9)) % 9) + 1; });
const KEEP9 = new Set([0, 4, 8, 10, 13, 16, 20, 22, 24, 27, 31, 35, 37, 39, 41, 43, 45, 49, 53, 56, 58, 60, 64, 67, 70, 72, 76, 80, 2, 78]);
const PUZ9 = SOL9.map((v, i) => (KEEP9.has(i) ? String(v) : "0")).join("");
const BOARD9 = "?board=" + Buffer.from(String.fromCharCode(1) + "3." + PUZ9, "binary").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const browser = await (eng === "webkit" ? webkit : chromium).launch();
for (const scheme of ["light", "dark"]) for (const contrast of ["no-preference", "more"]) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, colorScheme: scheme, baseURL: base });
  const page = await ctx.newPage();
  await page.emulateMedia({ reducedMotion: "reduce", contrast });
  await page.goto("/" + BOARD9);
  await page.waitForSelector("svg.hand-drawn-grid", { timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  const id = await page.evaluate(() => document.querySelector('script[src*="index-"]')?.getAttribute("src"));
  const empty = await page.evaluate(() => Array.from(document.querySelectorAll(".game-cell input")).map((i) => !/given/i.test(i.getAttribute("aria-label") ?? "") && !i.value));
  const pick = [40, 30, 50, 21].find((i) => empty[i]);
  await page.locator(".game-cell").nth(pick).click();
  await page.waitForTimeout(400);
  const peers = await page.evaluate(() => Array.from(document.querySelectorAll(".game-cell")).map((c) => !!c.querySelector(".cell-peer")));
  const r0 = Math.floor(pick / 9);
  const peer = [...Array(81).keys()].find((i) => i !== pick && peers[i] && empty[i] && Math.floor(i / 9) === r0);
  const b = await page.locator(".game-cell").nth(peer).boundingBox();
  const clip = { x: Math.round(b.x + b.width * 0.3), y: Math.round(b.y + b.height * 0.3), width: Math.max(2, Math.round(b.width * 0.4)), height: Math.max(2, Math.round(b.height * 0.4)) };
  const { on, off } = await onOff(page, clip, ".cell-peer { display: none !important; }");
  const mean = (p) => { const n = p.w * p.h; let s = 0; for (let k = 0; k < n; k++) s += lum(p.data, k * 3); return s / n; };
  const st = +ratio(mean(on), mean(off)).toFixed(3);
  const cm = await page.evaluate(() => matchMedia("(prefers-contrast: more)").matches);
  const bg = await page.evaluate((i) => getComputedStyle(document.querySelectorAll(".game-cell")[i].querySelector(".cell-peer")).backgroundColor, peer);
  console.log(`WASHC ${label} ${eng} ${scheme} contrast=${contrast} (matches more: ${cm}) ${id} peer ${peer} step ${st} bg ${bg}`);
  await ctx.close();
}
await browser.close();
