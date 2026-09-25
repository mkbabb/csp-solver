/**
 * ACC-FIVE pass 7 · the DARK ink on the THIRD ground, PAINTED (pass-6 critique §3.4; registry-v6 §2.6 row 5).
 * Pass 6 found the trace's third ground (the board wrapper's 2 px border under the stroke's overhang) and moved
 * only the LIGHT token; the dark `#79650f` sits at the two-ground midpoint and the critic's `#7e6a17` (same hue
 * 94.5°, C 0.100) was ARITHMETIC. This paints the dark walk along that hue and chroma, both engines, DPR 1 and 2,
 * on the trace's own footprint (pass-6 p6-rows-bc's statistic, copied: coverage from a magenta re-stroke,
 * core = coverage ≥ 0.5, split by ground LINE / BORDER / PAPER; each core pixel's ratio against the ground it
 * covers). The population is the WHOLE footprint per ground, not a median alone: the median, the p10 and the
 * fraction under 3 (under 2.441, HEAD's dark border, for the border) are printed. An EMPTY ground is RED.
 *
 *   node p7-third-ground-paint.mjs <tree> <control> <out.json>
 */
import { writeFileSync } from "node:fs";
import { chromium, webkit, mintFromControl, assertSameBoard, fillTo, ratio, rawOf, stat } from "./p7-lib.mjs";
const [TREE, CTRL, OUT] = process.argv.slice(2);
const board = await mintFromControl(CTRL);
console.log(`payload ${board.payload.slice(0, 18)}… (${board.givens} givens)`);

// OKLCH → sRGB hex (Ottosson), to walk the dark tier along its own hue and chroma
const oklchHex = (L, C, h) => {
  const a = C * Math.cos((h * Math.PI) / 180), b = C * Math.sin((h * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3, m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3, s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const lin = [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s];
  const g = (x) => Math.round(255 * Math.min(1, Math.max(0, x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055)));
  return "#" + lin.map((x) => g(x).toString(16).padStart(2, "0")).join("");
};
const DARK = ["#79650f", "#7e6a17", ...[0.52, 0.528, 0.536, 0.544].map((L) => oklchHex(L, 0.1, 94.5))];
const LIGHT = ["#a27803"];

const style = (page, id, css) => page.evaluate(([i, c]) => { let s = document.getElementById(i); if (!s) { s = document.createElement("style"); s.id = i; document.head.appendChild(s); } s.textContent = c; }, [id, css]);
const unstyle = (page, id) => page.evaluate((i) => document.getElementById(i)?.remove(), id);

async function footprint(page) {
  const box = await page.locator("svg.hand-drawn-grid").first().boundingBox();
  const clip = { x: Math.max(0, box.x - 8), y: Math.max(0, box.y - 8), width: box.width + 16, height: box.height + 16 };
  const S = await rawOf(await page.screenshot({ clip }));
  const S2 = await rawOf(await page.screenshot({ clip }));
  await style(page, "tg-hide", "html body .progress-trace { visibility: hidden !important }");
  await page.waitForTimeout(250);
  const H = await rawOf(await page.screenshot({ clip }));
  await unstyle(page, "tg-hide");
  await style(page, "tg-mag", "@layer base { html body svg .progress-trace { stroke: #ff00ff !important; transition: none !important } } html body svg .progress-trace { stroke: #ff00ff !important; transition: none !important }");
  await page.waitForTimeout(250);
  const M = await rawOf(await page.screenshot({ clip }));
  await unstyle(page, "tg-mag");
  await page.waitForTimeout(250);
  const freq = new Map();
  for (let i = 0; i < H.data.length; i += 4) { const k = (H.data[i] << 16) | (H.data[i + 1] << 8) | H.data[i + 2]; freq.set(k, (freq.get(k) ?? 0) + 1); }
  const pk = [...freq.entries()].sort((a, b) => b[1] - a[1])[0][0];
  const paper = [pk >> 16, (pk >> 8) & 255, pk & 255];
  const pop = { line: [], border: [], paper: [] };
  let noise = 0;
  for (let i = 0; i < H.data.length; i += 4) {
    const n = Math.abs(S.data[i] - S2.data[i]) + Math.abs(S.data[i + 1] - S2.data[i + 1]) + Math.abs(S.data[i + 2] - S2.data[i + 2]);
    if (n > 8) { noise++; continue; }
    const g = [H.data[i], H.data[i + 1], H.data[i + 2]];
    const full = Math.abs(255 - g[0]) + Math.abs(0 - g[1]) + Math.abs(255 - g[2]);
    const d = Math.abs(M.data[i] - g[0]) + Math.abs(M.data[i + 1] - g[1]) + Math.abs(M.data[i + 2] - g[2]);
    if (full < 60 || d / full < 0.5) continue;
    const gp = ratio(g, paper);
    pop[gp >= 1.5 ? "line" : gp >= 1.1 ? "border" : "paper"].push(ratio([S.data[i], S.data[i + 1], S.data[i + 2]], g));
  }
  const bFloor = (a) => +(a.filter((v) => v < 2.441).length / Math.max(1, a.length)).toFixed(3);
  return { paper, noise, line: stat(pop.line, 3), border: { ...stat(pop.border, 3), under2441: bFloor(pop.border) }, paperG: stat(pop.paper, 3) };
}

const rows = [];
for (const [name, type] of [["chromium", chromium], ["webkit", webkit]]) {
  const browser = await type.launch();
  for (const dpr of [1, 2]) for (const scheme of ["dark", "light"]) for (const [arm, base] of [["tree", TREE], ["control", CTRL]]) {
    const ctx = await browser.newContext({ colorScheme: scheme, reducedMotion: "reduce", viewport: { width: 1280, height: 800 }, deviceScaleFactor: dpr });
    const page = await ctx.newPage();
    await page.goto(base + board.query);
    await page.waitForSelector(".sudoku-cell", { timeout: 60000 });
    await page.waitForTimeout(1500);
    await assertSameBoard(page, board.cells);
    const v = await fillTo(page, 25); if (v < 25) throw new Error(`gauge reached only ${v} %`);
    await page.evaluate(() => document.activeElement?.blur?.());
    await page.waitForTimeout(1500);
    const inks = arm === "control" ? ["(control)"] : scheme === "dark" ? DARK : LIGHT;
    for (const ink of inks) {
      if (arm === "tree") { await style(page, "tg-ink", `:root, .dark, html.dark { --color-progress-ink: ${ink} !important }`); await page.waitForTimeout(300); }
      const painted = await page.evaluate(() => getComputedStyle(document.querySelector(".progress-trace")).stroke);
      const fp = await footprint(page);
      const g = (s) => `${s.median}/${s.p10}/${s.under}/${s.n}`;
      const empty = [fp.line.n, fp.border.n, fp.paperG.n].some((n) => !n);
      console.log(`${name} dpr${dpr} ${scheme} ${arm} ${ink} → ${painted} · LINE med/p10/<3/n ${g(fp.line)} · BORDER ${g(fp.border)} (<2.441 ${fp.border.under2441}) · PAPER ${g(fp.paperG)} · noise ${fp.noise}${empty ? " · EMPTY GROUND RED" : ""}`);
      rows.push({ engine: name, dpr, scheme, arm, ink, painted, ...fp });
    }
    await ctx.close();
  }
  await browser.close();
}
writeFileSync(OUT, JSON.stringify({ payload: board.payload, rows }, null, 1));
console.log("ALLDONE");
