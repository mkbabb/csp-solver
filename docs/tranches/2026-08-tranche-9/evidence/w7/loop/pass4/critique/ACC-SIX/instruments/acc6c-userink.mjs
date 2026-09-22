// ACC-SIX pass-4 CRITIC — the ledger's user-ink row, PAINTED: one player-written digit in ROW 5
// (away from the trace), pinned board, both engines, both themes, dpr 1 and 2. Ink = the most
// chromatic blue-hued pixel of the glyph; ground = the crop's modal pixel; ALSO the p75-chroma
// blue pixel (a stroke-body read, not the single most saturated pixel).
import pw from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js";
import sharp from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.mjs";
import { writeFileSync } from "node:fs";
import { rgbToOklch, srgbToLinear, hueDist } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass4/prototype/ACC-SIX/instruments/oklch.COPY.mjs";
const { chromium, webkit } = pw;
const PUZ = "530070000600195000098000060800060003400803001700020006060000280000419005000080079";
const SOL = "534678912672195348198342567859761423426853791713924856961537284287419635345286179";
const b64u = (s) => Buffer.from(s, "binary").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const BOARD = "?board=" + b64u(String.fromCharCode(1) + "3." + PUZ);
const lum = ([r, g, b]) => 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return +((x + 0.05) / (y + 0.05)).toFixed(3); };
const out = { board: BOARD, cells: {} };
for (const [eng, L] of [["chromium", chromium], ["webkit", webkit]]) {
  const br = await L.launch();
  for (const scheme of ["light", "dark"]) for (const dpr of [1, 2]) {
    const ctx = await br.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: dpr, colorScheme: scheme, reducedMotion: "reduce" });
    const page = await ctx.newPage(); await page.goto("http://127.0.0.1:4237/" + BOARD);
    await page.waitForSelector(".sudoku-cell input", { timeout: 60000 }); await page.waitForTimeout(1500);
    const idx = await page.evaluate(() => { const cs = Array.from(document.querySelectorAll(".sudoku-cell")); for (let i = 37; i < 45; i++) { const x = cs[i].querySelector("input"); if (x && !x.value) { x.focus(); return i; } } return -1; });
    await page.keyboard.type(SOL[idx]); await page.waitForTimeout(300);
    await page.evaluate(() => document.activeElement?.blur?.()); await page.mouse.move(2, 2); await page.waitForTimeout(900);
    const b = await page.evaluate((i) => { const r = document.querySelectorAll(".sudoku-cell")[i].getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; }, idx);
    const buf = await page.screenshot({ clip: { x: Math.round(b.x + b.w * 0.12), y: Math.round(b.y + b.h * 0.12), width: Math.round(b.w * 0.76), height: Math.round(b.h * 0.76) }, type: "png" });
    const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
    const freq = new Map(); const blues = [];
    for (let p = 0; p < info.width * info.height; p++) { const o = p * info.channels; const rgb = [data[o], data[o + 1], data[o + 2]]; const k = rgb.join(","); freq.set(k, (freq.get(k) || 0) + 1); const c = rgbToOklch(...rgb); if (c.C > 0.04 && hueDist(c.h, 250) < 25) blues.push({ rgb, C: c.C }); }
    const ground = [...freq.entries()].sort((a, b) => b[1] - a[1])[0][0].split(",").map(Number);
    blues.sort((a, b) => b.C - a.C);
    const top = blues[0]?.rgb, p75 = blues[Math.floor(blues.length * 0.25)]?.rgb;
    out.cells[`${eng}/${scheme}/dpr${dpr}`] = { idx, bluePx: blues.length, ground, top, topRatio: top && ratio(top, ground), p75, p75Ratio: p75 && ratio(p75, ground), token: await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--color-user-ink").trim()) };
    await ctx.close(); console.error("done", eng, scheme, dpr);
  }
  await br.close();
}
writeFileSync(process.argv[2], JSON.stringify(out, null, 2)); console.error("wrote");
