// ACC-SIX pass-4 CRITIC — the count line's painted AA (the strip text), both themes, both engines,
// phone 393x699 dpr3 coarse, pinned board. Ink = the modal of pixels darker (light) / lighter (dark)
// than the paper by > 0.15 L; ground = the strip crop's modal pixel.
import pw from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js";
import sharp from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.mjs";
import { writeFileSync } from "node:fs";
const { chromium, webkit } = pw;
const PUZ = "530070000600195000098000060800060003400803001700020006060000280000419005000080079";
const SOL = "534678912672195348198342567859761423426853791713924856961537284287419635345286179";
const b64u = (s) => Buffer.from(s, "binary").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const BOARD = "?board=" + b64u(String.fromCharCode(1) + "3." + PUZ);
const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const L = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const cr = (a, b) => { const [x, y] = [L(a), L(b)].sort((p, q) => q - p); return +((x + 0.05) / (y + 0.05)).toFixed(3); };
const out = {};
for (const [eng, Lr] of [["chromium", chromium], ["webkit", webkit]]) {
  const br = await Lr.launch();
  for (const scheme of ["light", "dark"]) {
    const ctx = await br.newContext({ viewport: { width: 393, height: 699 }, deviceScaleFactor: 3, hasTouch: true, colorScheme: scheme, reducedMotion: "reduce" });
    const page = await ctx.newPage(); await page.goto("http://127.0.0.1:4237/" + BOARD);
    await page.waitForSelector(".sudoku-cell input", { timeout: 60000 }); await page.waitForTimeout(1500);
    const coarse = await page.evaluate(() => matchMedia("(pointer: coarse)").matches);
    for (let k = 0; k < 2; k++) { const idx = await page.evaluate(() => { const cs = Array.from(document.querySelectorAll(".sudoku-cell")); const i = cs.findIndex((c) => { const x = c.querySelector("input"); return x && !x.value; }); cs[i].querySelector("input").focus(); return i; }); await page.keyboard.type(SOL[idx]); await page.waitForTimeout(250); }
    await page.evaluate(() => document.activeElement?.blur?.()); await page.waitForTimeout(900);
    const r = await page.evaluate(() => { const e = document.querySelector(".margin-note-meta"); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height, color: getComputedStyle(e).color, text: e.textContent.trim() }; });
    if (!r) { out[`${eng}/${scheme}`] = { coarse, line: null }; await ctx.close(); continue; }
    const buf = await page.screenshot({ clip: { x: Math.max(0, Math.round(r.x - 4)), y: Math.round(r.y), width: Math.round(r.w + 8), height: Math.round(r.h) }, type: "png" });
    const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
    const f = new Map(); for (let p = 0; p < info.width * info.height; p++) { const o = p * info.channels; const k = [data[o], data[o + 1], data[o + 2]].join(","); f.set(k, (f.get(k) || 0) + 1); }
    const ranked = [...f.entries()].sort((a, b) => b[1] - a[1]); const paper = ranked[0][0].split(",").map(Number);
    const inks = ranked.map(([k, n]) => [k.split(",").map(Number), n]).filter(([v]) => Math.abs(L(v) - L(paper)) > 0.15);
    const modalInk = inks[0]?.[0];
    const ext = inks.map(([v]) => v).sort((a, b) => (scheme === "light" ? L(a) - L(b) : L(b) - L(a)))[0];
    out[`${eng}/${scheme}`] = { coarse, text: r.text, token: r.color, paper, modalInk, modalRatio: modalInk && cr(modalInk, paper), extreme: ext, extremeRatio: ext && cr(ext, paper) };
    await ctx.close(); console.error("done", eng, scheme);
  }
  await br.close();
}
writeFileSync(process.argv[2], JSON.stringify(out, null, 2)); console.error("wrote");
