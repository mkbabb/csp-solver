/**
 * MRK-WASH pass-1 CRITIQUE — the constraints, checked independently of the lane's instruments.
 *   1. filterBudget: live filters in BOTH schemes, both engines (the lane's G-WASH-5).
 *   2. one ground per cell: the DOM rule, on ?wire=local and on the plain board.
 *   3. forced-colors: the cell's focus ring survives.
 *   4. prefers-contrast: more -> the rim presses to 1, the body does not move.
 */
import { chromium, webkit } from "playwright";
import { writeFileSync, mkdirSync } from "node:fs";

const BASE = "http://127.0.0.1:4241";
const OUT = new URL("../logs/", import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

const countFilters = (page) =>
  page.evaluate(() => {
    let n = 0;
    const seen = [];
    for (const el of document.querySelectorAll("*")) {
      const f = getComputedStyle(el).filter;
      if (f && f !== "none") {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) {
          n++;
          seen.push(`${el.tagName.toLowerCase()}.${(el.getAttribute("class") || "").split(" ")[0]} = ${f}`);
        }
      }
    }
    return { n, seen };
  });

const out = {};
for (const engineName of ["chromium", "webkit"]) {
  const engine = engineName === "chromium" ? chromium : webkit;
  const browser = await engine.launch();
  for (const theme of ["light", "dark"]) {
    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      colorScheme: theme,
      reducedMotion: "reduce",
    });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/?size=3&difficulty=EASY`);
    await page.waitForSelector("path.cell-line", { state: "attached", timeout: 30000 });
    await page.waitForTimeout(1500);
    const key = `${engineName}-${theme}`;
    const f = await countFilters(page);

    // focus a cell, then read the one-ground rule off the DOM
    await page.evaluate(() => {
      const i = Array.from(document.querySelectorAll(".game-cell input")).findIndex((n) => !n.value);
      document.querySelectorAll(".game-cell input")[i]?.focus();
    });
    await page.waitForTimeout(400);
    const ground = await page.evaluate(() => {
      const cells = Array.from(document.querySelectorAll(".game-cell"));
      let peerWash = 0,
        doubleGround = 0,
        selfPeer = 0;
      const offenders = [];
      cells.forEach((c, i) => {
        const wash = !!c.querySelector(".cell-peer");
        const because = !!c.querySelector(".cell-because");
        const cursor = c.classList.contains("is-peer-cursor");
        const sel = !!c.querySelector("input:focus-visible");
        if (wash) peerWash++;
        if (sel && wash) selfPeer++;
        const grounds = [wash, because, cursor, sel].filter(Boolean).length;
        if (grounds > 1) {
          doubleGround++;
          offenders.push({ i, wash, because, cursor, sel });
        }
      });
      return { peerWash, doubleGround, selfPeer, offenders: offenders.slice(0, 6) };
    });

    // prefers-contrast: more
    await ctx.close();
    const ctxC = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      colorScheme: theme,
      reducedMotion: "reduce",
      contrast: "more",
    });
    const p2 = await ctxC.newPage();
    await p2.goto(`${BASE}/?size=3&difficulty=EASY`);
    await p2.waitForSelector("path.cell-line", { state: "attached", timeout: 30000 });
    await p2.waitForTimeout(1500);
    await p2.evaluate(() => {
      const i = Array.from(document.querySelectorAll(".game-cell input")).findIndex((n) => !n.value);
      document.querySelectorAll(".game-cell input")[i]?.focus();
    });
    await p2.waitForTimeout(400);
    const contrastMore = await p2.evaluate(() => {
      const c = document.querySelector(".game-cell:has(input:focus-visible) .cell-ghost-path");
      if (!c) return null;
      const s = getComputedStyle(c);
      return {
        strokeOpacity: s.strokeOpacity,
        fillOpacity: s.fillOpacity,
        strokeWidth: s.strokeWidth,
        paintOrder: s.paintOrder,
        animationName: s.animationName,
      };
    });
    await ctxC.close();

    out[key] = { liveFilters: f.n, filterList: f.seen, ground, contrastMore };
    console.log(
      `${key}  filters=${f.n}  peerWash=${ground.peerWash}  doubleGround=${ground.doubleGround}  selfPeer=${ground.selfPeer}  contrastMore=${JSON.stringify(contrastMore)}`,
    );
    if (f.n !== 9) console.log(`   ^^ filters over budget: ${f.seen.slice(-4).join(" | ")}`);
  }
  await browser.close();
}
writeFileSync(OUT + "constraints.json", JSON.stringify(out, null, 2));
console.log("\nbanked -> logs/constraints.json");
