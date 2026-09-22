/**
 * ACC-GRAPHITE pass 4 — π on INK as well as geometry. Copied from pass3's rect-census-fold.mjs
 * (routes, pinned permalink, three viewports, PRM) and extended: every element's TAG and its
 * computed PAINT properties (color, background, stroke, fill, stroke-width, opacities, font,
 * line-height, filter, outline) beside its rect. Proto DIST vs control DIST (74a2b5d9), both built.
 * usage: ENGINE=chromium|webkit node pi-paint.mjs <baseURL> <outFile>
 */
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
import { writeFileSync } from "node:fs";
const ENGINE = process.env.ENGINE === "webkit" ? webkit : chromium;
const [, , BASE, OUT] = process.argv;
function encodeSudoku(size, cells, total) {
  let c = "";
  for (let i = 0; i < total; i++) c += (cells[i] ?? 0).toString(36);
  return Buffer.from(String.fromCharCode(1) + `${size}.${c}`, "latin1").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
const PINNED = encodeSudoku(3, { 0: 5, 4: 3, 8: 7, 20: 9, 40: 1, 60: 4, 76: 2, 80: 6 }, 81);
const ROUTES = [
  { name: "board", url: `./?board=${PINNED}`, ready: ".sudoku-cell" },
  { name: "gallery", url: `./?view=gallery&board=${PINNED}`, ready: "main" },
];
const VIEWPORTS = [
  { name: "1280x800", width: 1280, height: 800 },
  { name: "390x844", width: 390, height: 844, touch: true },
  { name: "820x1180", width: 820, height: 1180 },
];
const PROPS = ["color", "background-color", "stroke", "fill", "stroke-width", "stroke-opacity", "fill-opacity", "opacity", "font-family", "font-size", "font-weight", "line-height", "filter", "outline-style", "outline-color", "border-top-color", "border-top-width", "display", "visibility"];
const CENSUS = (PROPS) => {
  const path = (el) => {
    const parts = [];
    let n = el;
    while (n && n.nodeType === 1 && n !== document.documentElement) {
      const p = n.parentElement;
      const i = p ? Array.prototype.indexOf.call(p.children, n) + 1 : 1;
      parts.unshift(`${n.tagName.toLowerCase()}:${i}`);
      n = p;
    }
    return "html/" + parts.join("/");
  };
  const out = {};
  for (const el of document.querySelectorAll("*")) {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    out[path(el)] = { tag: el.tagName.toLowerCase(), cls: (el.getAttribute("class") || "").slice(0, 80), r: [r.x, r.y, r.width, r.height].map((v) => Math.round(v * 100) / 100), p: PROPS.map((k) => cs.getPropertyValue(k)) };
  }
  return out;
};
const browser = await ENGINE.launch();
const all = {};
for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, reducedMotion: "reduce", deviceScaleFactor: 1, hasTouch: !!vp.touch });
  for (const route of ROUTES) {
    const page = await ctx.newPage();
    await page.goto(new URL(route.url, BASE).href, { waitUntil: "load" });
    await page.waitForSelector(route.ready, { timeout: 20000 });
    await page.waitForTimeout(2500);
    all[`${route.name}-${vp.name}`] = await page.evaluate(CENSUS, PROPS);
    await page.close();
  }
  await ctx.close();
}
await browser.close();
writeFileSync(OUT, JSON.stringify({ PROPS, all }));
console.log("ok", Object.keys(all).map((k) => `${k}:${Object.keys(all[k]).length}`).join(" "));
