// CTRL-COST pass-1 · WHAT THE RESERVATION ACTUALLY COSTS.
//
// The card-height ablation said the reserved second line costs 23–24px and that moving the
// answer onto one line recovers only ~2 of them. A total that surprising is a question, not a
// finding: this reads the tier-3 BAND and its two FACES box by box under each arrangement, so
// the 23px has a cause with a number on it.
//
//   node tier3-shape.mjs
//
const { chromium, webkit } = await import(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs"
);
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const PROTO = resolve(HERE, "../proto");
const BASE = "http://127.0.0.1:4233/";
const CSS = readFileSync(resolve(PROTO, "cost-card.css"), "utf8");
const JS_SRC = readFileSync(resolve(PROTO, "cost-card.js"), "utf8").replace(
  /^export const costCard = /m,
  "window.__costCard = ",
);

const ARMS = {
  "reserved-second-line (the family's own)": "",
  "no reservation at all": ".cost-secondline{display:none!important}",
  "answer beside the question": ".cost-face-destructive{flex-direction:row;gap:0.4rem}.cost-secondline{margin-top:0}",
};

const SHAPE = () => {
  const band = document.querySelector(".cost-band:nth-of-type(3)");
  const faces = [...document.querySelectorAll(".cost-face-destructive")];
  const b = (e) => {
    const r = e.getBoundingClientRect();
    return { w: +r.width.toFixed(2), h: +r.height.toFixed(2), y: +r.top.toFixed(2) };
  };
  return {
    band: band ? b(band) : null,
    faces: faces.map(b),
    rowsUsed: new Set(faces.map((f) => Math.round(f.getBoundingClientRect().top))).size,
    words: faces.map((f) => ({
      rest: b(f.querySelector(".cost-word-rest")),
      armed: b(f.querySelector(".cost-word-armed")),
      stack: b(f.querySelector(".cost-wordstack")),
      second: b(f.querySelector(".cost-secondline")),
      icon: f.querySelector("svg") ? b(f.querySelector("svg")) : null,
    })),
  };
};

const out = {};
for (const cell of [
  { name: "dock-390x844", w: 390, h: 844, coarse: true },
  { name: "desk-1280x800", w: 1280, h: 800, coarse: false },
]) {
  for (const engine of ["chromium", "webkit"]) {
    const browser = await (engine === "webkit" ? webkit : chromium).launch();
    const ctx = await browser.newContext({
      viewport: { width: cell.w, height: cell.h },
      deviceScaleFactor: 1,
      hasTouch: cell.coarse,
      isMobile: cell.coarse && engine === "chromium",
      colorScheme: "light",
    });
    await ctx.addInitScript(() => {
      try {
        localStorage.clear();
        localStorage.setItem("sudoku-color-scheme", "light");
      } catch {}
    });
    const page = await ctx.newPage();
    await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
    await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
    await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
    await page.waitForTimeout(1400);
    if (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
      await page.locator(".drawer-tab").click({ force: true });
      await page.waitForTimeout(950);
    }
    await page.addStyleTag({ content: CSS });
    await page.evaluate(`(() => { ${JS_SRC} ; return window.__costCard(); })()`);
    await page.waitForTimeout(350);
    const key = `${cell.name}-${engine}`;
    out[key] = {};
    for (const [arm, css] of Object.entries(ARMS)) {
      await page.evaluate(() => document.getElementById("t3arm")?.remove());
      if (css)
        await page.evaluate((c) => {
          const s = document.createElement("style");
          s.id = "t3arm";
          s.textContent = c;
          document.head.appendChild(s);
        }, css);
      await page.waitForTimeout(200);
      out[key][arm] = await page.evaluate(SHAPE);
      const r = out[key][arm];
      console.log(
        `${key.padEnd(24)} ${arm.padEnd(38)} band ${r.band.h}px · faces ${r.faces
          .map((f) => `${f.w}×${f.h}`)
          .join(" ")} · rows ${r.rowsUsed}`,
      );
    }
    await browser.close();
  }
}
writeFileSync(resolve(HERE, "../readings/tier3-shape.json"), JSON.stringify(out, null, 1));
console.log("\nbanked readings/tier3-shape.json");
