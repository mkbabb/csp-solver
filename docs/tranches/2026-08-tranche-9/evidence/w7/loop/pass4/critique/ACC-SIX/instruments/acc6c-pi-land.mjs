// ACC-SIX pass-4 CRITIC — π against 74a2b5d9 on a PINNED encoded board (chair addendum), desk fine +
// phone coarse, fill 0 AND fill 3, EVERY element of each selector (not the first), paint props
// separated from rects. Claimed surfaces excluded: .progress-trace, .board-margin, .margin-note-meta, washi.
import pw from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js";
import { writeFileSync } from "node:fs";
const { chromium, webkit } = pw;
const PUZ = "530070000600195000098000060800060003400803001700020006060000280000419005000080079";
const SOL = "534678912672195348198342567859761423426853791713924856961537284287419635345286179";
const b64u = (s) => Buffer.from(s, "binary").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const BOARD = "?board=" + b64u(String.fromCharCode(1) + "3." + PUZ);
const ARMS = { proto: "http://127.0.0.1:4237", control: "http://127.0.0.1:4238" };
const SEL = [".board-wrapper", ".sudoku-cell", ".sudoku-cell input", ".glyph-svg", ".masthead", ".logo-text", ".controls-card", ".icon-btn", ".deal-row", ".board-voice", ".margin-note", ".margin-note-text", ".drawer-tab", "svg.hand-drawn-grid", ".play-controls", "button"];
const CELLS = [
  { name: "desk-fine", viewport: { width: 1280, height: 800 }, dpr: 1, touch: false },
  { name: "phone-coarse", viewport: { width: 393, height: 699 }, dpr: 3, touch: true },
  { name: "land-coarse", viewport: { width: 844, height: 390 }, dpr: 3, touch: true },
];
const READ = (sels) => sels.map((s) => {
  const els = Array.from(document.querySelectorAll(s)).slice(0, 120);
  return { sel: s, n: els.length, items: els.map((el) => { const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
    return { paint: [el.tagName, cs.font, cs.lineHeight, cs.color, cs.backgroundColor, cs.stroke, cs.fill, cs.opacity, cs.filter, cs.borderTopWidth + " " + cs.borderTopColor, cs.visibility, cs.display].join(" | "), rect: [r.x, r.y, r.width, r.height].map((v) => +v.toFixed(2)).join(",") }; }) };
});
async function write(page, n) { for (let k = 0; k < n; k++) { const idx = await page.evaluate(() => { const cs = Array.from(document.querySelectorAll(".sudoku-cell")); const i = cs.findIndex((c) => { const x = c.querySelector("input"); return x && !x.value; }); if (i >= 0) cs[i].querySelector("input").focus(); return i; }); if (idx < 0) return; await page.keyboard.type(SOL[idx]); await page.waitForTimeout(220); } await page.evaluate(() => document.activeElement?.blur?.()); }
const out = { board: BOARD, cells: {} };
for (const [eng, L] of [["chromium", chromium], ["webkit", webkit]]) {
  const br = await L.launch();
  for (const C of CELLS.filter((c) => c.name === "land-coarse")) for (const scheme of (process.env.PHONE ? ["light"] : ["light", "dark"])) {
    const got = {};
    for (const [arm, base] of Object.entries(ARMS)) {
      const ctx = await br.newContext({ viewport: C.viewport, deviceScaleFactor: C.dpr, hasTouch: C.touch, colorScheme: scheme, reducedMotion: "reduce" });
      const page = await ctx.newPage(); await page.goto(base + "/" + BOARD);
      await page.waitForSelector(".sudoku-cell input", { timeout: 60000 }); await page.waitForTimeout(1500);
      const row1 = await page.evaluate(() => Array.from(document.querySelectorAll(".sudoku-cell input")).slice(0, 9).map((i) => i.value || ".").join(""));
      const f0 = await page.evaluate(READ, SEL); await write(page, 3); await page.waitForTimeout(700);
      const f3 = await page.evaluate(READ, SEL);
      got[arm] = { row1, f0, f3 }; await ctx.close();
    }
    const cmp = (a, b) => { const paint = [], rect = [], count = []; a.forEach((x, i) => { const y = b[i]; if (x.n !== y.n) count.push(`${x.sel} n ${x.n} vs ${y.n}`); const m = Math.min(x.n, y.n); for (let j = 0; j < m; j++) { if (x.items[j].paint !== y.items[j].paint) paint.push({ sel: x.sel, j, proto: x.items[j].paint, control: y.items[j].paint }); if (x.items[j].rect !== y.items[j].rect) rect.push(`${x.sel}[${j}] ${x.items[j].rect} vs ${y.items[j].rect}`); } }); return { count, paintN: paint.length, paint: paint.slice(0, 8), rectN: rect.length, rect: rect.slice(0, 6), rectSels: [...new Set(rect.map((s) => s.split("[")[0]))], rectAll: rect }; };
    out.cells[`${eng}/${C.name}/${scheme}`] = { deal: [got.proto.row1, got.control.row1], fill0: cmp(got.proto.f0, got.control.f0), fill3: cmp(got.proto.f3, got.control.f3) };
    console.error("done", eng, C.name, scheme);
  }
  await br.close();
}
writeFileSync(process.argv[2], JSON.stringify(out, null, 2)); console.error("wrote");
