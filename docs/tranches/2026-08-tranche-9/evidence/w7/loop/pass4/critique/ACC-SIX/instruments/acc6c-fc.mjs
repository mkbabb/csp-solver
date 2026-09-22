// ACC-SIX pass-4 CRITIC — forced-colors + print emulation over .progress-trace (and .attribution-tape if mounted),
// pinned board, prototype (4237) vs control (4238), both engines.
import pw from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js";
import { writeFileSync } from "node:fs";
const { chromium, webkit } = pw;
const PUZ = "530070000600195000098000060800060003400803001700020006060000280000419005000080079";
const SOL = "534678912672195348198342567859761423426853791713924856961537284287419635345286179";
const b64u = (s) => Buffer.from(s, "binary").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const BOARD = "?board=" + b64u(String.fromCharCode(1) + "3." + PUZ);
const out = {};
for (const [eng, L] of [["chromium", chromium], ["webkit", webkit]]) {
  const br = await L.launch();
  for (const [arm, base] of [["proto", "http://127.0.0.1:4237"], ["control", "http://127.0.0.1:4238"]]) {
    const ctx = await br.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" });
    const page = await ctx.newPage(); await page.goto(base + "/" + BOARD);
    await page.waitForSelector(".sudoku-cell input", { timeout: 60000 }); await page.waitForTimeout(1500);
    for (let k = 0; k < 5; k++) { const idx = await page.evaluate(() => { const cs = Array.from(document.querySelectorAll(".sudoku-cell")); const i = cs.findIndex((c) => { const x = c.querySelector("input"); return x && !x.value; }); cs[i].querySelector("input").focus(); return i; }); await page.keyboard.type(SOL[idx]); await page.waitForTimeout(200); }
    await page.evaluate(() => document.activeElement?.blur?.()); await page.waitForTimeout(600);
    const read = () => page.evaluate(() => { const t = document.querySelector(".progress-trace"); const a = document.querySelector(".attribution-tape"); const cs = t && getComputedStyle(t); const pose = t?.closest(".progress-pose"); return { forced: matchMedia("(forced-colors: active)").matches, print: matchMedia("print").matches, trace: t ? { stroke: cs.stroke, opacity: cs.opacity, strokeOpacity: cs.strokeOpacity, display: cs.display, poseOpacity: pose ? getComputedStyle(pose).opacity : null, d: (t.getAttribute("d") || "").length } : null, tape: a ? getComputedStyle(a).display : "absent" }; });
    const R = (out[`${eng}/${arm}`] = {});
    R.normal = await read();
    try { await page.emulateMedia({ forcedColors: "active" }); await page.waitForTimeout(300); R.forced = await read(); } catch (e) { R.forced = "emulation unsupported: " + e.message.slice(0, 80); }
    await page.emulateMedia({ forcedColors: "none", media: "print" }); await page.waitForTimeout(300); R.print = await read();
    await ctx.close(); console.error("done", eng, arm);
  }
  await br.close();
}
writeFileSync(process.argv[2], JSON.stringify(out, null, 2)); console.error("wrote");
