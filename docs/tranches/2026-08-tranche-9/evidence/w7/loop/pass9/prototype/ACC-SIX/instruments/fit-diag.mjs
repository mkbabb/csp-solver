// ACC-SIX pass 9 · why the count yields at a FIT cell: the strip's room, the voice's and the count's widths and type,
// at `laid` (press 2) and press 3. Read-only. node <HELPER>/fit-diag.mjs --url <u> --engine chromium [--w 1280 --h 800]
import { args, playwright, openCell } from "../e2e/lib/paint-lib.mjs";
const A = args();
const browser = await playwright()[A.engine ?? "chromium"].launch();
const W = Number(A.w ?? 1280), H = Number(A.h ?? 800);
function mulberry(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const SOL16 = Array.from({ length: 256 }, (_, i) => ((4 * (Math.floor(i / 16) % 4) + Math.floor(Math.floor(i / 16) / 4) + (i % 16)) % 16) + 1);
const rnd = mulberry(20260923); const idx = [...Array(256).keys()];
for (let i = 255; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
const KEEP = new Set(idx.slice(0, 86));
const PUZ = SOL16.map((v, i) => (KEEP.has(i) ? v.toString(36) : "0")).join("");
const BOARD = "?board=" + Buffer.from(String.fromCharCode(1) + "4." + PUZ, "binary").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const { ctx, page } = await openCell(browser, { width: W, height: H, dpr: 1, colorScheme: "light", reducedMotion: "reduce" });
await page.goto(A.url + "/" + BOARD); await page.waitForSelector(".sudoku-cell", { timeout: 60000 }); await page.evaluate(() => document.fonts.ready);
const read = () => page.evaluate(() => {
  const r = (s) => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); const cs = getComputedStyle(e); return { w: +b.width.toFixed(1), x: +b.left.toFixed(1), fs: cs.fontSize, ls: cs.letterSpacing, gap: cs.columnGap, pad: cs.paddingLeft + "/" + cs.paddingRight, ff: cs.fontFamily.slice(0, 24) }; };
  const m = document.querySelector(".margin-note-meta"); let mw = null; if (m) { const rg = document.createRange(); rg.selectNodeContents(m); mw = +rg.getBoundingClientRect().width.toFixed(1); }
  const ink = document.querySelector(".margin-note-ink"); let vw = null; if (ink) { const rg = document.createRange(); rg.selectNodeContents(ink); vw = +rg.getBoundingClientRect().width.toFixed(1); }
  return { block: r(".margin-note-block"), voice: r(".margin-note"), voiceText: vw, meta: r(".margin-note-meta"), metaText: mw, strip: r(".board-margin"), text: document.querySelector(".margin-note")?.textContent?.trim() };
});
for (let k = 0; k < 2; k++) { await page.evaluate(() => document.querySelector('[aria-label*="Hint" i]:not([disabled])')?.click()); await page.waitForTimeout(1500); }
console.log("FITDIAG laid", JSON.stringify(await read()));
await page.evaluate(() => document.querySelector('[aria-label*="Hint" i]:not([disabled])')?.click()); await page.waitForTimeout(1500);
console.log("FITDIAG press3", JSON.stringify(await read()));
await ctx.close(); await browser.close();
