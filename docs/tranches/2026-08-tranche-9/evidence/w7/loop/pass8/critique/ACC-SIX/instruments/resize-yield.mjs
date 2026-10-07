// critic driver: the yield's RESIZE path (ResizeObserver), which count-yield never drives.
// usage: node resize-yield.mjs <engine> <label> <baseURL>
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
const [eng, label, base] = process.argv.slice(2);
function mulberry(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const SOL16 = Array.from({ length: 256 }, (_, i) => { const r = Math.floor(i / 16); return ((4 * (r % 4) + Math.floor(r / 4) + (i % 16)) % 16) + 1; });
const KEEP16 = (() => { const rnd = mulberry(20260923); const idx = [...Array(256).keys()]; for (let i = 255; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; } return new Set(idx.slice(0, 86)); })();
const PUZ16 = SOL16.map((v, i) => (KEEP16.has(i) ? v.toString(36) : "0")).join("");
const BOARD16 = "?board=" + Buffer.from(String.fromCharCode(1) + "4." + PUZ16, "binary").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const SNAP = () => {
  const voice = document.querySelector(".margin-note"); const meta = document.querySelector(".margin-note-meta");
  const v = voice?.getBoundingClientRect(); const mid = v ? v.top + v.height / 2 : null; let row2 = false, top = null;
  if (meta && mid !== null) { const r = document.createRange(); r.selectNodeContents(meta); top = +r.getBoundingClientRect().top.toFixed(1); row2 = top > mid; }
  return { voice: voice?.textContent?.trim() ?? "", meta: meta?.textContent?.trim() ?? null, row2, top, mid: mid && +mid.toFixed(1), strip: document.querySelector(".board-margin")?.getBoundingClientRect().height };
};
const browser = await (eng === "webkit" ? webkit : chromium).launch();
for (const [from, to, presses] of [[{ width: 1280, height: 800 }, { width: 393, height: 699 }, 2], [{ width: 1280, height: 800 }, { width: 393, height: 699 }, 3], [{ width: 844, height: 390 }, { width: 600, height: 390 }, 3]]) {
  const ctx = await browser.newContext({ viewport: from, baseURL: base });
  const page = await ctx.newPage();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/" + BOARD16);
  await page.waitForSelector(".sudoku-cell", { timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  for (let k = 0; k < presses; k++) { await page.evaluate(() => document.querySelector('[aria-label*="Hint" i]:not([disabled])')?.click()); await page.waitForTimeout(900); }
  const before = await page.evaluate(SNAP);
  await page.setViewportSize(to);
  await page.waitForTimeout(1200);
  const after = await page.evaluate(SNAP);
  console.log(`RESIZE ${label} ${eng} ${from.width}x${from.height}->${to.width}x${to.height} after ${presses} presses · before meta=${before.meta} row2=${before.row2} · after meta=${after.meta} row2=${after.row2} (range top ${after.top} vs voice mid ${after.mid}, strip ${after.strip?.toFixed(2)}) voice "${after.voice}"`);
  await ctx.close();
}
await browser.close();
