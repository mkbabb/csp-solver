// ACC-SIX pass 8 · T9-B-ACC6-1 on the UNION: each ink arm's trace read as PAINTED, and the crops the composite is
// made of. One payload (the 9x9 band board of e2e/wash-step.spec.ts, 30 givens, its first 26 empty cells written
// with their solution digits by keyboard: 26 of 51 on the board), 1280x800 fine, PRM reduce. Per theme x DPR:
// the board's frame box photographed with the trace and with `.progress-trace` hidden (onOff); per changed pixel
// the contrast of the ink against the SAME pixel without it (the ledger's differencing), the core = pixels whose
// luminance move is ≥ 0.9 of the largest; median printed. The crop (DPR 2) is saved for the composite.
//   node .acc6p8/arm-read.mjs --url http://127.0.0.1:4237 --arm gold --engine chromium --crops <dir>
import { writeFileSync, mkdirSync } from "node:fs";
import { args, playwright, openCell, onOff, lum, ratio, median, load } from "../e2e/lib/paint-lib.mjs";

const A = args();
const engine = A.engine ?? "chromium";
const SOL9 = Array.from({ length: 81 }, (_, i) => {
  const r = Math.floor(i / 9);
  return ((3 * (r % 3) + Math.floor(r / 3) + (i % 9)) % 9) + 1;
});
const KEEP9 = new Set([0, 4, 8, 10, 13, 16, 20, 22, 24, 27, 31, 35, 37, 39, 41, 43, 45, 49, 53, 56, 58, 60, 64, 67, 70, 72, 76, 80, 2, 78]);
const PUZ9 = SOL9.map((v, i) => (KEEP9.has(i) ? String(v) : "0")).join("");
const BOARD9 = "?board=" + Buffer.from(String.fromCharCode(1) + "3." + PUZ9, "binary").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const EMPTIES = [...Array(81).keys()].filter((i) => !KEEP9.has(i)).slice(0, 26);

const browser = await playwright()[engine].launch();
if (A.crops) mkdirSync(A.crops, { recursive: true });
for (const colorScheme of ["light", "dark"])
  for (const dpr of [1, 2]) {
    const { ctx, page } = await openCell(browser, { width: 1280, height: 800, dpr, colorScheme, reducedMotion: "reduce" });
    await page.goto(A.url + "/" + BOARD9);
    await page.waitForSelector(".game-cell input", { timeout: 60000 });
    await page.evaluate(() => document.fonts.ready);
    const inputs = page.locator(".game-cell input");
    for (const i of EMPTIES) {
      await inputs.nth(i).click();
      await page.keyboard.type(String(SOL9[i]));
    }
    await page.mouse.click(5, 5);
    await page.waitForTimeout(1500);
    const st = await page.evaluate(() => {
      const t = document.querySelector(".progress-trace");
      const g = document.querySelector("svg.hand-drawn-grid")?.getBoundingClientRect();
      return {
        valuetext: document.querySelector('[role="progressbar"]')?.getAttribute("aria-valuetext"),
        stroke: t ? getComputedStyle(t).stroke : null,
        grid: g && { x: g.x, y: g.y, w: g.width, h: g.height },
      };
    });
    const g = st.grid;
    const clip = { x: Math.max(0, Math.floor(g.x - 10)), y: Math.max(0, Math.floor(g.y - 10)), width: Math.ceil(g.w + 20), height: Math.ceil(g.h + 20) };
    const { on, off } = await onOff(page, clip, ".progress-trace { visibility: hidden !important; }");
    const n = on.w * on.h;
    const d = new Float64Array(n);
    let mx = 0;
    for (let k = 0; k < n; k++) {
      d[k] = Math.abs(lum(on.data, k * 3) - lum(off.data, k * 3));
      if (d[k] > mx) mx = d[k];
    }
    const core = [];
    for (let k = 0; k < n; k++) if (mx > 0 && d[k] >= 0.9 * mx) core.push(ratio(lum(on.data, k * 3), lum(off.data, k * 3)));
    const changed = [...d].filter((x) => x > 0.01).length;
    console.log(
      `ARM ${A.arm} ${engine} ${colorScheme} dpr${dpr} · ${st.valuetext} · stroke ${st.stroke} · changed px ${changed} · core ${core.length} px median ${median(core)?.toFixed(3)} (max lum move ${mx.toFixed(3)}) · LOAD ${load()}`,
    );
    if (A.crops && dpr === 2) {
      const c = { x: Math.floor(g.x - 8), y: Math.floor(g.y - 8), width: 300, height: 44 };
      writeFileSync(`${A.crops}/${A.arm}-${engine}-${colorScheme}.png`, await page.screenshot({ clip: c, scale: "device", animations: "disabled" }));
    }
    await ctx.close();
  }
await browser.close();
