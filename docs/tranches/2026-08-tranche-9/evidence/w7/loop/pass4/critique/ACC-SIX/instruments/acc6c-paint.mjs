// ACC-SIX pass-4 CRITIC — the escape byte's ground re-read ACROSS DEVICE DENSITY (dpr 1/2/3), on a
// PINNED encoded board, both engines, both themes; plus the user-ink digit painted on a cell away
// from the trace. Method copied from the lane's p4-paint.mjs (pinnedGround/modalCore verbatim),
// with the glyph masks scaled to device pixels and the per-column line distribution reported.
import pw from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js";
import sharp from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.mjs";
import { writeFileSync } from "node:fs";
import { rgbToOklch, srgbToLinear, hueDist } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass4/prototype/ACC-SIX/instruments/oklch.COPY.mjs";
const { chromium, webkit } = pw;
const BASE = process.env.BASE || "http://127.0.0.1:4237";
const PUZ = "530070000600195000098000060800060003400803001700020006060000280000419005000080079";
const SOL = "534678912672195348198342567859761423426853791713924856961537284287419635345286179";
const b64u = (s) => Buffer.from(s, "binary").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const BOARD = "?board=" + b64u(String.fromCharCode(1) + "3." + PUZ);
const lum = ([r, g, b]) => 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return +((x + 0.05) / (y + 0.05)).toFixed(3); };
async function grid(buf) { const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true }); const ch = info.channels; return { at: (x, y) => { const o = (y * info.width + x) * ch; return [data[o], data[o + 1], data[o + 2]]; }, w: info.width, h: info.height }; }
function pinnedGround(img, masks, scheme, cols = 24) {
  const masked = (x, y) => masks.some((m) => x >= m.x0 && x < m.x1 && y >= m.y0 && y < m.y1);
  const freqAll = new Map();
  for (let y = 0; y < img.h; y++) for (let x = 0; x < img.w; x++) { const k = img.at(x, y).join(","); freqAll.set(k, (freqAll.get(k) || 0) + 1); }
  const paper = [...freqAll.entries()].sort((a, b) => b[1] - a[1])[0][0].split(",").map(Number);
  const step = Math.max(1, Math.floor(img.w / cols)); const per = [];
  for (let c = 0; c < cols; c++) { const x = Math.min(img.w - 1, c * step); let best = null;
    for (let y = 0; y < img.h; y++) { if (masked(x, y)) continue; const rgb = img.at(x, y); const o = rgbToOklch(...rgb); if (o.C >= 0.03) continue; if (!best || (scheme === "light" ? o.L < best.L : o.L > best.L)) best = { rgb, ...o }; }
    if (best) per.push(best); }
  const freq = new Map(); for (const p of per) freq.set(p.rgb.join(","), (freq.get(p.rgb.join(",")) || 0) + 1);
  const ranked = [...freq.entries()].sort((a, b) => b[1] - a[1]);
  return { paper, line: ranked[0][0].split(",").map(Number), agree: `${ranked[0][1]}/${per.length}`, perColumnGray: per.map((p) => p.rgb[0]) };
}
function modalCore(img, cols = 24) {
  const per = []; const step = Math.max(1, Math.floor(img.w / cols));
  for (let c = 0; c < cols; c++) { const x = Math.min(img.w - 1, c * step); let best = null; for (let y = 0; y < img.h; y++) { const rgb = img.at(x, y); const o = rgbToOklch(...rgb); if (!best || o.C > best.C) best = { rgb, ...o }; } if (best) per.push(best); }
  const freq = new Map(); for (const p of per) freq.set(p.rgb.join(","), (freq.get(p.rgb.join(",")) || 0) + 1);
  const ranked = [...freq.entries()].sort((a, b) => b[1] - a[1]);
  return { rgb: ranked[0][0].split(",").map(Number), agree: `${ranked[0][1]}/${per.length}` };
}
async function write(page, n) {
  for (let k = 0; k < n; k++) {
    const idx = await page.evaluate(() => { const cs = Array.from(document.querySelectorAll(".sudoku-cell")); const i = cs.findIndex((c) => { const x = c.querySelector("input"); return x && !x.value; }); if (i >= 0) cs[i].querySelector("input").focus(); return i; });
    if (idx < 0) return; await page.keyboard.type(SOL[idx]); await page.waitForTimeout(200);
  }
  await page.evaluate(() => document.activeElement?.blur?.());
}
const rows = { board: BOARD, base: BASE, cells: {} };
for (const [eng, L] of [["chromium", chromium], ["webkit", webkit]]) {
  const br = await L.launch();
  for (const scheme of ["light", "dark"]) for (const dpr of [1, 2, 3]) {
    const ctx = await br.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: dpr, colorScheme: scheme, reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto(BASE + "/" + BOARD);
    await page.waitForSelector(".sudoku-cell input", { timeout: 60000 });
    await page.waitForTimeout(1500);
    const R = (rows.cells[`${eng}/${scheme}/dpr${dpr}`] = {});
    R.asset = await page.evaluate(() => [...document.scripts].map((s) => s.src).find((s) => /index-/.test(s))?.split("/").pop());
    R.row1 = await page.evaluate(() => Array.from(document.querySelectorAll(".sudoku-cell input")).slice(0, 9).map((i) => i.value || ".").join(""));
    const box = await page.locator("svg.hand-drawn-grid").first().boundingBox();
    const clip = { x: Math.round(box.x + box.width * 0.15), y: Math.round(box.y - 10), width: Math.max(2, Math.round(box.width * 0.4)), height: 26 };
    const shot = async () => grid(await page.screenshot({ clip, type: "png" }));
    const masks = (await page.evaluate(() => Array.from(document.querySelectorAll(".sudoku-cell")).map((c) => { const r = c.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; })))
      .map((r) => ({ x0: Math.floor((r.x + r.w * 0.25 - clip.x) * dpr), x1: Math.ceil((r.x + r.w * 0.75 - clip.x) * dpr), y0: Math.floor((r.y + r.h * 0.25 - clip.y) * dpr), y1: Math.ceil((r.y + r.h * 0.75 - clip.y) * dpr) }));
    R.ground = pinnedGround(await shot(), masks, scheme);
    await write(page, 10);
    await page.waitForTimeout(800);
    const arm = async (hex) => {
      if (hex) await page.evaluate((h) => { const s = document.createElement("style"); s.id = "c6arm"; s.textContent = `:root{--color-progress-ink:${h} !important}`; document.head.appendChild(s); }, hex);
      await page.waitForTimeout(300);
      const core = modalCore(await shot());
      if (hex) await page.evaluate(() => document.getElementById("c6arm")?.remove());
      const vsLine = ratio(core.rgb, R.ground.line), vsPaper = ratio(core.rgb, R.ground.paper);
      // sensitivity: fraction of columns whose OWN line ground reads the ink under 3.10
      const under310 = R.ground.perColumnGray.filter((g) => ratio(core.rgb, [g, g, g]) < 3.10).length;
      return { core: core.rgb, agree: core.agree, vsLine, vsPaper, worst: Math.min(vsLine, vsPaper), colsUnder310: `${under310}/${R.ground.perColumnGray.length}` };
    };
    R.asBuilt = await arm(null);
    R.i8b5cf6 = await arm("#8b5cf6");
    R.e9b74f7 = await arm("#9b74f7");
    // user-ink digit on a written cell in ROW 5+ (far from the trace), blue-hued pixel only
    const cellBox = await page.evaluate(() => { const cs = Array.from(document.querySelectorAll(".sudoku-cell")); const c = cs.slice(36).find((c) => { const x = c.querySelector("input"); return x && x.value && !x.readOnly && !c.classList.contains("given") && !(c.className.includes("given")); }); if (!c) return null; const r = c.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height, cls: c.className }; });
    R.userCell = cellBox?.cls ?? null;
    if (cellBox) {
      const g = await grid(await page.screenshot({ clip: { x: Math.round(cellBox.x + cellBox.width * 0.12), y: Math.round(cellBox.y + cellBox.height * 0.12), width: Math.round(cellBox.width * 0.76), height: Math.round(cellBox.height * 0.76) }, type: "png" }));
      const freq = new Map(); let best = null;
      for (let y = 0; y < g.h; y++) for (let x = 0; x < g.w; x++) { const rgb = g.at(x, y); const k = rgb.join(","); freq.set(k, (freq.get(k) || 0) + 1); const o = rgbToOklch(...rgb); if (hueDist(o.h, 250) < 25 && (!best || o.C > best.C)) best = { rgb, C: o.C, h: o.h }; }
      const ground = [...freq.entries()].sort((a, b) => b[1] - a[1])[0][0].split(",").map(Number);
      R.userInk = { ink: best?.rgb ?? null, h: best && +best.h.toFixed(1), ground, ratio: best ? ratio(best.rgb, ground) : null, token: await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--color-user-ink").trim()) };
    }
    await ctx.close();
    console.error("done", eng, scheme, dpr);
  }
  await br.close();
}
writeFileSync(process.argv[2], JSON.stringify(rows, null, 2));
console.error("wrote", process.argv[2]);
