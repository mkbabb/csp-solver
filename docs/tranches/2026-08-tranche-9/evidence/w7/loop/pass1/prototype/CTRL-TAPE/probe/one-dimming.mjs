// T9-W7 pass 1 · CTRL-TAPE — THE ONE-DIMMING ROW, from painted bytes.
// Opacity is invisible to a composited-colour walk, so the lifted tab's WORD is read off the
// engine's own pixels: crop the tape, take the ink decile against the modal ground. The
// negative control is the DOUBLE dim the spec refuses — 0.68 opacity over the quiet rung.
const ROOT = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion";
const { chromium, webkit } = await import(`${ROOT}/web/frontend/node_modules/playwright/index.mjs`);
const sharp = (await import(`${ROOT}/web/frontend/node_modules/sharp/dist/index.cjs`)).default;
import { writeFileSync } from "node:fs";
const BASE = "http://127.0.0.1:4244/";
const engines = { chromium, webkit };
const lum = (r, g, b) => {
  const f = (x) => { const v = x / 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
async function word(page, sel, idx, dark) {
  const box = await page.evaluate(([s, i]) => {
    const el = document.querySelectorAll(s)[i];
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height, op: getComputedStyle(el).opacity, color: getComputedStyle(el).color, text: el.textContent.trim() };
  }, [sel, idx]);
  if (!box) return { skipped: "no element" };
  const clip = { x: Math.floor(box.x), y: Math.floor(box.y), width: Math.max(4, Math.ceil(box.w)), height: Math.max(4, Math.ceil(box.h)) };
  const png = await page.screenshot({ clip });
  const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
  const ls = [];
  for (let i = 0; i < data.length; i += info.channels) ls.push(lum(data[i], data[i + 1], data[i + 2]));
  ls.sort((a, b) => a - b);
  const ink = dark ? ls[Math.floor(ls.length * 0.985)] : ls[Math.floor(ls.length * 0.015)];
  const ground = ls[Math.floor(ls.length * (dark ? 0.35 : 0.65))];
  const [hi, lo] = [ink, ground].sort((a, b) => b - a);
  return { text: box.text, opacity: box.op, color: box.color, ratio: +((hi + 0.05) / (lo + 0.05)).toFixed(2) };
}
const out = {};
for (const engine of ["chromium", "webkit"])
  for (const dark of [false, true]) {
    const browser = await engines[engine].launch();
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: engine === "chromium", colorScheme: dark ? "dark" : "light" });
    await ctx.addInitScript((d) => { try { localStorage.clear(); localStorage.setItem("sudoku-color-scheme", d ? "dark" : "light"); } catch {} }, dark);
    const p = await ctx.newPage();
    await p.goto(`${BASE}?size=3&difficulty=EASY`, { waitUntil: "domcontentloaded" });
    await p.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
    await p.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
    await p.waitForTimeout(1500);
    if (await p.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
      await p.locator(".drawer-tab").click({ force: true });
      await p.waitForTimeout(950);
    }
    const S = ".controls-card .mobile-heading-btn .section-heading";
    const k = `${engine}-${dark ? "dark" : "light"}`;
    out[k] = { pressed: await word(p, S, 0, dark), lifted: await word(p, S, 1, dark) };
    await p.addStyleTag({ content: `.controls-card .mobile-heading-btn .section-heading:not(.is-active){color:var(--ink-press-quiet)!important}` });
    await p.waitForTimeout(250);
    out[k].doubleDimControl = await word(p, S, 1, dark);
    await browser.close();
  }
writeFileSync(process.argv[2] || "/tmp/dim.json", JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
