/** T9-W7 pass 2 · CTRL-TAPE — the seam's terms, read one by one on the risen sheet. */
import { chromium } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";

const BASE = "http://127.0.0.1:4230";
const b = await chromium.launch();
for (const [w, h] of [
  [390, 844],
  [430, 932],
  [844, 390],
]) {
  const c = await b.newContext({ baseURL: BASE, viewport: { width: w, height: h }, hasTouch: true });
  const p = await c.newPage();
  await p.goto("/?size=3&difficulty=EASY");
  await p.waitForSelector("svg.handwritten-logo");
  await p.waitForSelector(".sudoku-cell .glyph-svg");
  await p.locator(".drawer-tab").click();
  await p.waitForTimeout(900);
  const r = await p.evaluate(() => {
    const rail = document.querySelector("#controls-drawer");
    const kase = document.querySelector("#controls-drawer .drawer-case");
    const svgs = [...document.querySelectorAll("#controls-drawer .drawer-case svg")];
    const paths = [...document.querySelectorAll("#controls-drawer .drawer-case svg path")];
    const box = (e) => {
      if (!e) return null;
      const q = e.getBoundingClientRect();
      return { t: +q.top.toFixed(2), l: +q.left.toFixed(2), w: +q.width.toFixed(2), h: +q.height.toFixed(2) };
    };
    const logo = document.querySelector("svg.handwritten-logo");
    return {
      rail: box(rail),
      case: box(kase),
      svg0: box(svgs[0]),
      svg0cls: svgs[0] ? svgs[0].parentElement.className : null,
      path0: box(paths[0]),
      path0parent: paths[0] ? paths[0].closest("div")?.className?.slice(0, 40) : null,
      nPaths: paths.length,
      logo: box(logo),
      logoParents: (() => {
        const out = [];
        let e = logo;
        for (let i = 0; i < 4 && e; i++) {
          e = e.parentElement;
          if (e) out.push({ tag: e.tagName, cls: String(e.className).slice(0, 40), ...box(e) });
        }
        return out;
      })(),
      published: getComputedStyle(document.documentElement).getPropertyValue("--masthead-foot"),
      caseOffset: getComputedStyle(document.documentElement).getPropertyValue("--case-offset"),
      chrome: getComputedStyle(document.querySelector("#controls-drawer")).getPropertyValue("--sheet-chrome"),
      maxH: getComputedStyle(document.querySelector("#controls-drawer")).maxHeight,
    };
  });
  console.log(`== ${w}x${h}`, JSON.stringify(r, null, 1));
  await c.close();
}
await b.close();
