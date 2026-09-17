// run: node docs/tranches/2026-08-tranche-9/evidence/w8/attribution/A4/dom-probe.mjs --regime mobile --port 4253
// A4 diagnostic: where the drawer tab is, in which berth, and what the regime classes read.
import { createRequire } from "node:module";
const FE = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/";
const { chromium } = createRequire(FE + "package.json")("playwright");
const argv = process.argv.slice(2);
const arg = (k, d) => (argv.indexOf("--" + k) === -1 ? d : argv[argv.indexOf("--" + k) + 1]);
const REGIME = arg("regime", "mobile");
const PORT = arg("port", "4253");
const V = {
  desk: { viewport: { width: 1280, height: 800 }, hasTouch: false, isMobile: false },
  mobile: { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true },
}[REGIME];
const b = await chromium.launch();
const ctx = await b.newContext(V);
const p = await ctx.newPage();
p.on("console", (m) => console.log("PAGE:", m.type(), m.text().slice(0, 300)));
p.on("pageerror", (m) => console.log("PAGEERROR:", String(m).slice(0, 400)));
await p.goto(`http://127.0.0.1:${PORT}/?game=sudoku&size=3&difficulty=EASY`, { waitUntil: "load" });
await p.waitForTimeout(5000);
console.log(
  JSON.stringify(
    await p.evaluate(() => {
      const d = (sel) =>
        Array.from(document.querySelectorAll(sel)).map((e) => {
          const cs = getComputedStyle(e);
          const r = e.getBoundingClientRect();
          return {
            sel,
            parent: e.parentElement?.id || e.parentElement?.className || null,
            display: cs.display,
            visibility: cs.visibility,
            opacity: cs.opacity,
            rects: e.getClientRects().length,
            box: [+r.x.toFixed(1), +r.y.toFixed(1), +r.width.toFixed(1), +r.height.toFixed(1)],
          };
        });
      return {
        html: document.documentElement.className,
        innerW: innerWidth,
        innerH: innerHeight,
        boardGroup: d(".board-group"),
        tab: d(".drawer-tab"),
        boardEdge: d("#board-edge"),
        handle: d("#drawer-handle"),
        sceneControls: d(".scene-controls"),
        foldTools: d("#fold-tools"),
        cells: document.querySelectorAll(".board-cells .game-cell").length,
      };
    }),
    null,
    1,
  ),
);
await b.close();
