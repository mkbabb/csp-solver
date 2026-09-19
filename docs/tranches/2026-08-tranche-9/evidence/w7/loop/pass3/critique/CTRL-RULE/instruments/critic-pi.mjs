// T9-W7 pass 3 · CTRL-RULE — π ON THE SURFACES THIS FAMILY DOES NOT CLAIM.
// The lane censused the GALLERY (11 rows, Δ 0.00). The gallery is not the only unclaimed
// surface: this diff moves `--sheet-chrome` 12 → 12.6rem below 1024 and `--type-option`
// 22 → 20px below 1024, and both of those are read by boxes OUTSIDE the controls card.
// Everything outside `.scene-controls` is censused here against the 74a2b5d9 control.
//
// node critic-pi.mjs <chromium|webkit> <w> <h> <A> <B>
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const NM =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/";
const { chromium, webkit } = await import(NM + "playwright/index.mjs");
const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..", "readings");
mkdirSync(OUT, { recursive: true });

const ENGINE = process.argv[2] || "chromium";
const W = +(process.argv[3] || 1280);
const H = +(process.argv[4] || 800);
const A = process.argv[5] || "http://127.0.0.1:4233/";
const B = process.argv[6] || "http://127.0.0.1:4234/";

const SELECTORS = [
  ".game-case",
  ".board-case",
  ".sudoku-board",
  "svg.handwritten-logo",
  ".masthead",
  ".site-header",
  ".game-gallery",
  ".gallery-card",
  ".drawer-tab",
  ".theme-toggle",
  ".scene-controls",
  ".drawer-case",
  "#card-foot",
  "main",
];

const CENSUS = (sels) => {
  const rows = [];
  for (const s of sels) {
    const els = [...document.querySelectorAll(s)];
    els.forEach((e, i) => {
      const r = e.getBoundingClientRect();
      if (r.width < 0.01 && r.height < 0.01) return;
      rows.push({
        sel: `${s}[${i}]`,
        x: +r.x.toFixed(2),
        y: +r.y.toFixed(2),
        w: +r.width.toFixed(2),
        h: +r.height.toFixed(2),
      });
    });
  }
  return rows;
};

const read = async (browser, url) => {
  const ctx = await browser.newContext({
    viewport: { width: W, height: H },
    deviceScaleFactor: 1,
    hasTouch: W < 1024,
    colorScheme: "light",
  });
  await ctx.addInitScript(() => {
    try {
      localStorage.clear();
      localStorage.setItem("sudoku-color-scheme", "light");
    } catch {}
  });
  const page = await ctx.newPage();
  await page.goto(url + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 45000 });
  await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await page.waitForTimeout(1600);
  const rows = await page.evaluate(CENSUS, SELECTORS);
  await ctx.close();
  return rows;
};

const browser = await (ENGINE === "webkit" ? webkit : chromium).launch();
const a = await read(browser, A);
const b = await read(browser, B);
await browser.close();

const key = (r) => r.sel;
const mb = new Map(b.map((r) => [key(r), r]));
const diffs = [];
for (const r of a) {
  const o = mb.get(key(r));
  if (!o) {
    diffs.push({ sel: r.sel, note: "absent at control", proto: r });
    continue;
  }
  const d = Math.max(Math.abs(r.x - o.x), Math.abs(r.y - o.y), Math.abs(r.w - o.w), Math.abs(r.h - o.h));
  if (d > 0.01) diffs.push({ sel: r.sel, worst: +d.toFixed(2), proto: r, control: o });
}
for (const r of b) if (!a.some((x) => key(x) === key(r))) diffs.push({ sel: r.sel, note: "absent at prototype", control: r });

const out = { engine: ENGINE, cell: `${W}x${H}`, protoRows: a.length, controlRows: b.length, diffs };
writeFileSync(join(OUT, `critic-pi-${ENGINE}-${W}x${H}.json`), JSON.stringify(out, null, 2));
console.log(
  ENGINE,
  `${W}x${H}`,
  "rows",
  a.length,
  "vs",
  b.length,
  "| differing",
  diffs.length,
  "| worst",
  diffs.length ? Math.max(...diffs.filter((d) => d.worst).map((d) => d.worst)) : 0,
  "|",
  JSON.stringify(diffs.map((d) => `${d.sel}:${d.worst ?? d.note}`)),
);
console.log("EXIT OK");
