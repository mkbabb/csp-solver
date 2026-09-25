// whole-ring.mjs — MRK-ABS's whole-ring statistic (pass6 G-ABS-5 `ledgerRead`, copied whole; the
// dowry of registry-v6 §3.1), run as a CLI over a served tree. Per cell: the drawn path's own `d`
// through its screen CTM, 60 stations per side, at each the pixel of a 3×3 window that changed most
// between blurred and focused; a station that changed nothing (d < 8) is COUNTED UNDER (a dropped
// station is a miss, never a skip). Prints `under 3:1 of 240` per cell, two bare photographs each
// (A.5.7: the minimum over two photographs), and the left side's worst / median.
// Usage: node whole-ring.mjs <url> <label> [engines=chromium,webkit] [plant=css]
import { createRequire } from "node:module";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const pw = require("@playwright/test");
const [url, label, engs = "chromium,webkit", plant = ""] = process.argv.slice(2);
const lin = (c) => (c / 255 <= 0.04045 ? c / 255 / 12.92 : Math.pow((c / 255 + 0.055) / 1.055, 2.4));
const lum = (c) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
const ratio = (a, b) => (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05);
const dist = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
const r3 = (x) => Math.round(x * 1000) / 1000;
function mint(sub) {
  const n = sub * sub; let cells = "";
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) { const i = r * n + c; const keep = i > 1 && (r * 7 + c * 3) % 5 < 2; cells += (keep ? ((r * sub + Math.floor(r / sub) + c) % n) + 1 : 0).toString(36); }
  return Buffer.from(String.fromCharCode(1) + `${sub}.${cells}`, "latin1").toString("base64url");
}
const settled = async (page) => { for (let i = 0; i < 300; i++) { const n = await page.evaluate(() => document.getAnimations().filter((a) => a.playState === "running" && a.effect?.getTiming().iterations !== Infinity).length); if (!n) return; await page.waitForTimeout(50); } };
async function pixels(page, clip) {
  const png = await page.screenshot({ clip, scale: "css" });
  const data = await page.evaluate(async ({ b64, w, h }) => { const img = new Image(); img.src = `data:image/png;base64,${b64}`; await img.decode(); const c = document.createElement("canvas"); c.width = w; c.height = h; const g = c.getContext("2d"); g.drawImage(img, 0, 0); return Array.from(g.getImageData(0, 0, w, h).data); }, { b64: png.toString("base64"), w: clip.width, h: clip.height });
  return (x, y) => { const px = Math.round(x - clip.x), py = Math.round(y - clip.y); if (px < 0 || py < 0 || px >= clip.width || py >= clip.height) return null; const o = (py * clip.width + px) * 4; return [data[o], data[o + 1], data[o + 2]]; };
}
async function read(page, idx) {
  const geom = () => page.evaluate((i) => { const cell = document.querySelectorAll(".board-shell .game-cell")[i]; const p = cell.querySelector(".cell-ghost-path"); const m = p.getScreenCTM(); const pts = [...p.getAttribute("d").matchAll(/[ML]\s*(-?[\d.eE+]+),(-?[\d.eE+]+)/g)].map((g) => [m.e + m.a * +g[1], m.f + m.d * +g[2]]); const r = cell.getBoundingClientRect(); return { pts, box: { x: r.x, y: r.y, w: r.width, h: r.height } }; }, idx);
  const g0 = await geom();
  const clip = { x: Math.max(0, Math.floor(g0.box.x - 20)), y: Math.max(0, Math.floor(g0.box.y - 20)), width: Math.ceil(g0.box.w + 40), height: Math.ceil(g0.box.h + 40) };
  await page.evaluate(() => document.activeElement?.blur?.()); await settled(page);
  const before = await pixels(page, clip);
  await page.locator(".board-shell .game-cell .cell-native-input").nth(idx).focus();
  await page.keyboard.press("Shift");
  for (let i = 0; i < 100 && !(await page.evaluate(() => document.querySelectorAll(".game-cell:has(input:focus-visible)").length)); i++) await page.waitForTimeout(50);
  await settled(page);
  const g = await geom();
  const shots = [await pixels(page, clip), await pixels(page, clip)];
  await page.evaluate(() => document.activeElement?.blur?.());
  const nv = g.pts.length % 4 === 1 ? g.pts.length - 1 : g.pts.length; const q = nv / 4;
  return shots.map((after) => {
    const sides = [];
    for (let s = 0; s < 4; s++) {
      const side = g.pts.slice(s * q, (s + 1) * q).concat([g.pts[((s + 1) * q) % nv]]); const took = [];
      for (let i = 0; i < 60; i++) {
        const t = ((i + 0.5) / 60) * (side.length - 1); const k = Math.min(side.length - 2, Math.floor(t)), f = t - k;
        const x = side[k][0] + f * (side[k + 1][0] - side[k][0]), y = side[k][1] + f * (side[k + 1][1] - side[k][1]);
        let best = null;
        for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) { const a = after(x + dx, y + dy), b = before(x + dx, y + dy); if (!a || !b) continue; const d = dist(a, b); if (!best || d > best.d) best = { d, r: ratio(a, b) }; }
        took.push(best && best.d >= 8 ? best.r : null);
      }
      sides.push(took);
    }
    const all = sides.flat(); const left = sides[3];
    const painted = all.filter((v) => v !== null);
    return { under: all.filter((v) => v === null || v < 3).length, unpainted: all.filter((v) => v === null).length, worst: painted.length ? r3(Math.min(...painted)) : null, leftMedian: r3([...left.map((v) => v ?? 1)].sort((a, b) => a - b)[30]) };
  });
}
const out = [];
for (const engine of engs.split(",")) {
  const browser = await pw[engine].launch();
  for (const theme of ["light", "dark"]) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce", colorScheme: theme });
    const page = await ctx.newPage();
    for (const sub of [4, 3, 2]) {
      const payload = mint(sub);
      await page.goto(`${url}/?size=${sub}&board=${payload}`);
      for (let i = 0; i < 600 && (await page.locator(".board-shell .game-cell").count()) !== sub ** 4; i++) await page.waitForTimeout(200);
      const isDark = await page.evaluate(() => document.documentElement.classList.contains("dark"));
      if (isDark !== (theme === "dark")) { await page.locator("button.sun-moon-toggle").first().focus(); await page.keyboard.press("Enter"); for (let i = 0; i < 100 && (await page.evaluate(() => document.documentElement.classList.contains("dark"))) !== (theme === "dark"); i++) await page.waitForTimeout(100); await page.evaluate(() => document.activeElement?.blur?.()); }
      if (plant) await page.addStyleTag({ content: plant });
      await settled(page);
      const back = await page.evaluate(() => new URLSearchParams(location.search).get("board"));
      const r = await read(page, 0);
      const n = sub * sub;
      const row = { label, engine, theme, board: `${n}×${n}`, cell: 0, payloadOk: back === payload, under: r.map((x) => x.under), unpainted: r.map((x) => x.unpainted), worst: r.map((x) => x.worst), leftMedian: r.map((x) => x.leftMedian) };
      out.push(row);
      console.log(JSON.stringify(row));
    }
    await ctx.close();
  }
  await browser.close();
}
const load = (await import("node:os")).loadavg()[0].toFixed(1);
console.log(`DONE ${label} load1=${load}`);
