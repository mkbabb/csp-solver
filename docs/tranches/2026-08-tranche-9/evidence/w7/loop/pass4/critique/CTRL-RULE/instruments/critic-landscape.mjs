// T9-W7 pass 4 · CTRL-RULE · CRITIC — what the foot costs the card's scrollport, both arms, on the
// cells where the sheet is shortest (W2 §2.2's landscape cell + the portrait phone), hasTouch,
// witnessed, plus the card's HORIZONTAL overflow (scrollWidth − clientWidth) at every cell incl. the desk. The lane read the prototype arm only (cardClientH 224 / 209); this reads the control.
// node critic-landscape.mjs <chromium|webkit> <PROTO> <CTRL>
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const NM = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/";
const { chromium, webkit } = await import(NM + "playwright/index.mjs");
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "readings");
const [ENGINE = "chromium", PROTO = "http://127.0.0.1:4238/", CTRL = "http://127.0.0.1:4239/"] = process.argv.slice(2);
const BOARD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const browser = await (ENGINE === "webkit" ? webkit : chromium).launch();
const rows = [];
for (const [w, h, touch] of [[844, 390, true], [812, 375, true], [390, 844, true], [320, 568, true], [1280, 800, false], [1440, 900, false], [1024, 768, false]]) {
  for (const [arm, base] of [["proto", PROTO], ["ctrl", CTRL]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: touch, isMobile: touch && ENGINE === "chromium" });
    await ctx.addInitScript(() => { try { localStorage.clear(); } catch {} });
    const p = await ctx.newPage();
    await p.goto(`${base}?size=3&board=${BOARD}`, { waitUntil: "domcontentloaded" });
    await p.waitForSelector(".sudoku-cell", { timeout: 45000 });
    await p.waitForTimeout(2000);
    if (await p.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) await p.locator(".drawer-tab").first().click({ force: true });
    await p.waitForTimeout(1100);
    const r = await p.evaluate(() => {
      const card = document.querySelector(".controls-card"), cas = document.querySelector(".drawer-case");
      const bar = document.querySelector(".action-bar"), foot = document.getElementById("card-foot");
      const b = bar?.getBoundingClientRect();
      return { hOverflow: card ? card.scrollWidth - card.clientWidth : null, coarse: matchMedia("(pointer: coarse)").matches, cardClientH: card?.clientHeight, cardScrollH: card?.scrollHeight,
        caseH: cas ? +cas.getBoundingClientRect().height.toFixed(2) : null, footH: foot ? +foot.getBoundingClientRect().height.toFixed(2) : 0,
        barH: b ? +b.height.toFixed(2) : null, barInCard: !!(card && bar && card.contains(bar)),
        // the content the reader actually sees in the card that is NOT the bar
        contentViewH: card ? card.clientHeight - (bar && card.contains(bar) ? b.height : 0) : null };
    });
    rows.push({ cell: `${w}x${h}`, arm, ...r });
    await ctx.close();
  }
}
for (const r of rows) console.log(ENGINE, JSON.stringify(r));
writeFileSync(join(OUT, `critic-landscape-${ENGINE}.json`), JSON.stringify({ engine: ENGINE, control: "74a2b5d9", board: BOARD, rows }, null, 1));
await browser.close();
console.log("EXIT OK");
