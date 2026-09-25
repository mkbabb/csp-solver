// pi-ring-d.mjs — π of the RING'S GEOMETRY (chair A.5.4: a paint-property census cannot see a recipe
// change; read `d` and drive the ring's states). Lane vs control on one payload per board, PRM, 1280×800
// fine, both engines: every path inside every `.game-cell` keyed (cell, class, index) — its `d` and its
// computed stroke / stroke-width / stroke-opacity / opacity — in three driven states: rest, cell 40
// HOVERED (tier 1), cell 40 FOCUSED by keyboard (tier 2). Prints identical / differing / only-here.
// Usage: node pi-ring-d.mjs <laneUrl> <controlUrl>
import { createRequire } from "node:module";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const pw = require("@playwright/test");
const [lane, ctl] = process.argv.slice(2);
function mint(sub) { const n = sub * sub; let cells = ""; for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) { const i = r * n + c; const keep = i > 1 && (r * 7 + c * 3) % 5 < 2; cells += (keep ? ((r * sub + Math.floor(r / sub) + c) % n) + 1 : 0).toString(36); } return Buffer.from(String.fromCharCode(1) + `${sub}.${cells}`, "latin1").toString("base64url"); }
const settled = async (page) => { for (let i = 0; i < 300; i++) { const n = await page.evaluate(() => document.getAnimations().filter((a) => a.playState === "running" && a.effect?.getTiming().iterations !== Infinity).length); if (!n) return; await page.waitForTimeout(50); } };
async function census(page, url, sub, state) {
  await page.goto(`${url}/?size=${sub}&board=${mint(sub)}`);
  for (let i = 0; i < 600 && (await page.locator(".board-shell .game-cell").count()) !== sub ** 4; i++) await page.waitForTimeout(200);
  await settled(page);
  const idx = sub === 3 ? 40 : 100;
  if (state === "hover") { await page.locator(".board-shell .game-cell").nth(idx).hover(); await page.waitForTimeout(400); }
  if (state === "focus") { await page.locator(".board-shell .game-cell .cell-native-input").nth(idx).focus(); await page.keyboard.press("Shift"); }
  await settled(page);
  return page.evaluate(() => { const out = {}; document.querySelectorAll(".board-shell .game-cell").forEach((c, i) => { c.querySelectorAll("path").forEach((p, k) => { const cs = getComputedStyle(p); const cls = p.getAttribute("class") || ""; out[`${i}|${cls}|${k}`] = { d: p.getAttribute("d"), paint: [cs.stroke, cs.strokeWidth, cs.strokeOpacity, cs.opacity, cs.fill].join(" ") }; }); }); return out; });
}
for (const engine of ["chromium", "webkit"]) {
  const b = await pw[engine].launch();
  for (const sub of [3, 4]) for (const state of ["rest", "hover", "focus"]) {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" }); const page = await ctx.newPage();
    const L = await census(page, lane, sub, state); const C = await census(page, ctl, sub, state); await ctx.close();
    let same = 0, dDiff = 0, paintDiff = 0; const onlyL = [], onlyC = [], ex = [];
    for (const k of Object.keys(L)) { if (!(k in C)) { onlyL.push(k); continue; } if (L[k].d !== C[k].d) { dDiff++; if (ex.length < 3) ex.push(`d@${k}`); } else if (L[k].paint !== C[k].paint) { paintDiff++; if (ex.length < 3) ex.push(`paint@${k}: ${C[k].paint} → ${L[k].paint}`); } else same++; }
    for (const k of Object.keys(C)) if (!(k in L)) onlyC.push(k);
    const cls = (xs) => [...new Set(xs.map((k) => k.split("|")[1]))].join(",");
    console.log(`${engine} ${sub * sub}×${sub * sub} ${state}: paths lane ${Object.keys(L).length} ctl ${Object.keys(C).length} · identical ${same} · d differs ${dDiff} · paint differs (d equal) ${paintDiff} · only-lane ${onlyL.length} [${cls(onlyL)}] · only-ctl ${onlyC.length} [${cls(onlyC)}]${ex.length ? " · e.g. " + ex.join(" | ") : ""}`);
  }
  await b.close();
}
console.log(`DONE load1=${(await import("node:os")).loadavg()[0].toFixed(1)}`);
