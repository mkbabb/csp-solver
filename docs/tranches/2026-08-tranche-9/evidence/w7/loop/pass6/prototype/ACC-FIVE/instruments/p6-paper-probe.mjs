/** ACC-FIVE pass 6 · what the "paper-class" core pixels of the screen trace ARE: the top (S, H)
 *  pairs at coverage ≥ 0.9 on the crayon dist, chromium light, one payload, plus where they sit
 *  (distance from the board's outer edge). node p6-paper-probe.mjs <tree> <control> */
import { chromium, mintFromControl, assertSameBoard, rawOf, ratio } from "./p6-lib.mjs";
const [TREE, CTRL] = process.argv.slice(2);
const board = await mintFromControl(CTRL);
const b = await chromium.launch();
for (const [arm, base] of [["tree", TREE], ["control", CTRL]]) {
  const p = await (await b.newContext({ reducedMotion: "reduce", viewport: { width: 1280, height: 800 } })).newPage();
  await p.goto(base + board.query); await p.waitForSelector(".sudoku-cell"); await p.waitForTimeout(1500);
  await assertSameBoard(p, board.cells);
  for (let i = 0; i < 10; i++) { await p.evaluate(() => document.querySelector('[aria-label*="Hint" i]:not([disabled])')?.click()); await p.waitForTimeout(150); }
  await p.evaluate(() => document.activeElement?.blur?.()); await p.waitForTimeout(1500);
  const box = await p.locator("svg.hand-drawn-grid").first().boundingBox();
  const clip = { x: box.x - 8, y: box.y - 8, width: box.width + 16, height: box.height + 16 };
  const add = (id, c) => p.evaluate(([i, c]) => { const s = document.createElement("style"); s.id = i; s.textContent = c; document.head.appendChild(s); }, [id, c]);
  const drop = (id) => p.evaluate((i) => document.getElementById(i)?.remove(), id);
  const S = await rawOf(await p.screenshot({ clip }));
  await add("h", "html body .progress-trace{visibility:hidden!important}"); await p.waitForTimeout(250);
  const H = await rawOf(await p.screenshot({ clip })); await drop("h");
  await add("m", "@layer base{html body svg .progress-trace{stroke:#ff00ff!important}} html body svg .progress-trace{stroke:#ff00ff!important}"); await p.waitForTimeout(250);
  const M = await rawOf(await p.screenshot({ clip })); await drop("m");
  const layers = await p.evaluate(() => {
    const t = document.querySelector(".progress-trace");
    const out = []; for (let n = t; n && out.length < 6; n = n.parentElement) { const cs = getComputedStyle(n); out.push(`${n.tagName.toLowerCase()}.${(n.getAttribute("class") ?? "").split(" ")[0]} op ${cs.opacity} mix ${cs.mixBlendMode} so ${cs.strokeOpacity}`); }
    return out;
  });
  const pairs = new Map(); let n = 0;
  const paper = [253, 253, 252];
  for (let i = 0; i < H.data.length; i += 4) {
    const g = [H.data[i], H.data[i + 1], H.data[i + 2]];
    const full = Math.abs(255 - g[0]) + g[1] + Math.abs(255 - g[2]);
    const d = Math.abs(M.data[i] - g[0]) + Math.abs(M.data[i + 1] - g[1]) + Math.abs(M.data[i + 2] - g[2]);
    if (full < 60 || d / full < 0.9 || ratio(g, paper) >= 1.5) continue;
    n++;
    const key = `S(${S.data[i]},${S.data[i + 1]},${S.data[i + 2]}) H(${g})`;
    pairs.set(key, (pairs.get(key) ?? 0) + 1);
  }
  console.log(`${arm}: paper-class core@.9 n ${n}; trace chain: ${layers.join(" < ")}`);
  for (const [k, v] of [...pairs.entries()].sort((a, c) => c[1] - a[1]).slice(0, 8)) {
    const m = k.match(/\d+/g).map(Number);
    console.log(`  ${v}× ${k} ratio ${ratio(m.slice(0, 3), m.slice(3)).toFixed(3)}`);
  }
}
await b.close();
