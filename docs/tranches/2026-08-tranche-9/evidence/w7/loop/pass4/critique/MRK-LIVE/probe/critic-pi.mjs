// π census, my own: the lane (dev, 4246) against the chair's named control (w7-control,
// vite preview of the pre-built dist, identity index-CubiZsMVSwTc.js, 4247). COMPUTED PAINT
// PROPERTIES + tag names, not rects alone. Same board dealt to both arms (?board= is pinned
// by the seed query the estate accepts; the sudoku route deals from the same template bank).
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";

const OUT = process.env.OUT || "/tmp/critic-pi.json";
const PROPS = [
  "color", "fill", "stroke", "fillOpacity", "strokeOpacity", "strokeWidth",
  "font", "lineHeight", "backgroundColor", "opacity", "outlineWidth", "outlineStyle",
];
const SELECTORS = [
  "button.logo-trigger", ".sun-moon-toggle", ".drawer-tab", "[role=grid]", "main",
  ".game-cell", ".cell-ghost-path", ".cell-native-input", ".ctrl-btn", ".icon-btn",
  ".info-btn", "header", "footer", ".game-board", ".pencil-marks",
];

async function census(page, url) {
  await page.goto(url + "/?game=sudoku&board=1");
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 60000 });
  await page.waitForTimeout(1600);
  return page.evaluate(
    ({ SELECTORS, PROPS }) => {
      const rows = [];
      for (const sel of SELECTORS) {
        const els = Array.from(document.querySelectorAll(sel)).slice(0, 2);
        els.forEach((e, i) => {
          const c = getComputedStyle(e);
          const r = e.getBoundingClientRect();
          const paint = {};
          for (const p of PROPS) paint[p] = c[p];
          rows.push({
            key: sel + "#" + i,
            tag: e.tagName.toLowerCase(),
            paint,
            rect: [+r.width.toFixed(2), +r.height.toFixed(2)],
          });
        });
        if (!els.length) rows.push({ key: sel + "#missing", tag: null, paint: null, rect: null });
      }
      return rows;
    },
    { SELECTORS, PROPS },
  );
}

const out = {};
for (const [name, type] of [["chromium", chromium], ["webkit", webkit]]) {
  const b = await type.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } });
  const lane = await census(await ctx.newPage(), "http://127.0.0.1:4246");
  const ctl = await census(await ctx.newPage(), "http://127.0.0.1:4247");
  const byKey = Object.fromEntries(ctl.map((r) => [r.key, r]));
  const deltas = [];
  let maxRect = 0;
  for (const r of lane) {
    const c = byKey[r.key];
    if (!c) { deltas.push({ key: r.key, why: "absent on control" }); continue; }
    if (r.tag !== c.tag) deltas.push({ key: r.key, prop: "tag", lane: r.tag, control: c.tag });
    if (r.paint && c.paint)
      for (const p of PROPS)
        if (r.paint[p] !== c.paint[p])
          deltas.push({ key: r.key, prop: p, lane: r.paint[p], control: c.paint[p] });
    if (r.rect && c.rect)
      maxRect = Math.max(maxRect, Math.abs(r.rect[0] - c.rect[0]), Math.abs(r.rect[1] - c.rect[1]));
  }
  out[name] = { nodes: lane.length, paintDeltas: deltas.length, maxRectDelta: +maxRect.toFixed(2), deltas };
  await b.close();
}
writeFileSync(OUT, JSON.stringify(out, null, 2));
console.log("DONE");
