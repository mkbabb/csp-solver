// T9-W7 pass 5 · CTRL-RULE — charter row 11 (REPORT, do not tune): at 390×844 FINE the case's top vs the
// masthead's painted bottom (the wordmark svg's box and `.masthead`), drawer open and settled, both arms.
// node p5-masthead.mjs <chromium|webkit> <BASE> <arm>
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const NM = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/";
const { chromium, webkit } = await import(NM + "playwright/index.mjs");
const [ENGINE, BASE, ARM] = process.argv.slice(2);
const BOARD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const b = await (ENGINE === "webkit" ? webkit : chromium).launch();
const rows = [];
for (const [w, h, touch] of [[390, 844, false], [390, 844, true]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: touch, isMobile: touch && ENGINE === "chromium" });
  await ctx.addInitScript(() => { try { localStorage.clear(); localStorage.setItem("sudoku-color-scheme", "light"); } catch {} });
  const p = await ctx.newPage();
  await p.goto(`${BASE}?size=3&board=${BOARD}`, { waitUntil: "domcontentloaded" });
  await p.waitForSelector(".sudoku-cell", { timeout: 45000 });
  await p.waitForTimeout(1800);
  if (await p.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) await p.locator(".drawer-tab").first().click({ force: true });
  let last = -1; for (let i = 0; i < 40; i++) { await p.waitForTimeout(100); const t = await p.evaluate(() => document.querySelector(".drawer-case").getBoundingClientRect().top); if (Math.abs(t - last) < 0.01) break; last = t; }
  const r = await p.evaluate(() => {
    const q = (s) => { const e = document.querySelector(s); if (!e) return null; const x = e.getBoundingClientRect(); return { t: +x.top.toFixed(2), b: +x.bottom.toFixed(2) }; };
    return { caseTop: q(".drawer-case")?.t, masthead: q(".masthead"), logo: q("svg.handwritten-logo") };
  });
  rows.push({ cell: `${w}x${h}-${touch ? "coarse" : "fine"}`, ...r, crossLogo: r.logo ? +(r.logo.b - r.caseTop).toFixed(2) : null, crossMasthead: r.masthead ? +(r.masthead.b - r.caseTop).toFixed(2) : null });
  await ctx.close();
}
await b.close();
writeFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "readings", `p5-masthead-${ARM}-${ENGINE}.json`), JSON.stringify(rows, null, 1));
for (const r of rows) console.log(ENGINE, ARM, JSON.stringify(r));
