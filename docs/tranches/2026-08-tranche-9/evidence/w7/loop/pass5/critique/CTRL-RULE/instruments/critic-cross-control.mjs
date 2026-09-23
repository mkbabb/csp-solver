// T9-W7 pass 5 · CRITIC · CTRL-RULE — the CROSS TAP on the CONTROL (74a2b5d9), 390×844 coarse: one
// guarded verb armed, the other tapped. Is the second tap live at HEAD? (The lane's tree swallows it.)
// node critic-cross-control.mjs <chromium|webkit> <CTRL>
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const NM = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/";
const { chromium, webkit } = await import(NM + "playwright/index.mjs");
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "readings");
const [ENGINE, CTRL] = process.argv.slice(2);
const BOARD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const DEAL = '.controls-card button[aria-label="Deal a new board"]', CLEAR = 'button[aria-label="Clear the board"]';
const browser = await (ENGINE === "webkit" ? webkit : chromium).launch();
const out = {};
for (const [first, second] of [[CLEAR, DEAL], [DEAL, CLEAR]]) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: ENGINE === "chromium" });
  await ctx.addInitScript(() => { try { localStorage.clear(); localStorage.setItem("sudoku-color-scheme", "light"); } catch {} });
  const p = await ctx.newPage();
  await p.goto(`${CTRL}?size=3&board=${BOARD}`, { waitUntil: "domcontentloaded" });
  await p.waitForSelector(".sudoku-cell"); await p.waitForTimeout(1500);
  const blank = await p.evaluate(() => [...document.querySelectorAll(".sudoku-cell")].findIndex((c) => !c.querySelector(".glyph-svg")));
  await p.locator(".sudoku-cell").nth(blank).click({ force: true });
  await p.evaluate((idx) => { const i = document.querySelectorAll(".sudoku-cell input")[idx]; Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(i, "1"); i.dispatchEvent(new Event("input", { bubbles: true })); }, blank);
  await p.waitForTimeout(300);
  if (await p.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) await p.locator(".drawer-tab").first().tap({ force: true });
  await p.waitForTimeout(1200);
  const sub = () => p.evaluate(() => [...document.querySelectorAll(".controls-card .icon-sublabel, .action-bar .icon-sublabel")].map((e) => e.textContent.trim()).join("|"));
  await p.locator(first).first().tap(); await p.waitForTimeout(250);
  const afterFirst = await sub();
  const g = await p.evaluate(() => [...document.querySelectorAll(".sudoku-cell")].map((c) => (c.querySelector(".glyph-svg") ? 1 : 0)).join(""));
  await p.locator(second).first().tap(); await p.waitForTimeout(400);
  const afterSecond = await sub();
  const g2 = await p.evaluate(() => [...document.querySelectorAll(".sudoku-cell")].map((c) => (c.querySelector(".glyph-svg") ? 1 : 0)).join(""));
  out[`${first === CLEAR ? "clear" : "deal"}ThenTap${second === CLEAR ? "Clear" : "Deal"}`] = { afterFirst, afterSecond, secondTapChangedSublabels: afterFirst !== afterSecond, boardChanged: g !== g2 };
  await ctx.close();
}
writeFileSync(join(OUT, `critic-cross-control-${ENGINE}.json`), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
await browser.close();
