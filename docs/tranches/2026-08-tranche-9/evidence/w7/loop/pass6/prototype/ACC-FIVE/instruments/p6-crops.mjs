/**
 * ACC-FIVE pass 6 · THE SECTION'S FORK AT ONE BOARD, re-rendered (charter row 8; retires pass 5's
 * p5-2/p5-3). Gold (this tree) / violet (ACC-SIX -45) / graphite (ACC-GRAPHITE -40) / control
 * (74a2b5d9), all BUILT dists, ONE encoded payload read back on every arm, light · 1280×800 · fine
 * pointer · PRM reduce · ten hints, one engine per crop. The one variable is the section's accent.
 *
 * What changed from p5-crops.mjs: the labels are TWO lines and nothing is truncated; the band ratio
 * is quoted only where the arm HAS a chromatic gauge — graphite's trace is graphite, so the
 * "modal chromatic pixel" pass 5 quoted for it (11.96 chromium / 6.694 webkit) was whatever else was
 * chromatic in the band, and it is struck; each pane names its progressbar's value and valuetext,
 * so SIX's count against the leader's percent is on the frame.
 *
 *   node p6-crops.mjs <outdir> <gold> <violet> <graphite> <control>
 */
import sharp from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.mjs";
import { writeFileSync } from "node:fs";
import { chromium, webkit, mintFromControl, assertSameBoard, settled, ratio } from "./p6-lib.mjs";

const [OUT, GOLD, VIOLET, GRAPHITE, CTRL] = process.argv.slice(2);
const ARMS = { gold: GOLD, violet: VIOLET, graphite: GRAPHITE, control: CTRL };
const TREE = { gold: "ACC-FIVE -41 pass 6", violet: "ACC-SIX -45 pass 5", graphite: "ACC-GRAPHITE -40 pass 5", control: "74a2b5d9" };
const board = await mintFromControl(CTRL);
console.log(`payload ${board.payload} (${board.givens} givens)`);

const TRACE = () => {
  const t = document.querySelector(".progress-trace");
  return t ? { stroke: getComputedStyle(t).stroke, width: getComputedStyle(t).strokeWidth } : null;
};
const lin = (c) => ((c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const chromaOK = (r, g, b) => {
  const [R, G, B] = [lin(r), lin(g), lin(b)];
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B), m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B), s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  return Math.hypot(1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s);
};
/** the band's modal pixel of OKLCH C ≥ 0.05 and its ratio on the modal (paper) pixel */
const bandReading = async (buf) => {
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const freq = new Map(), chr = new Map();
  for (let i = 0; i < info.width * info.height; i++) {
    const o = i * info.channels, k = `${data[o]},${data[o + 1]},${data[o + 2]}`;
    freq.set(k, (freq.get(k) ?? 0) + 1);
    if (chromaOK(data[o], data[o + 1], data[o + 2]) >= 0.05) chr.set(k, (chr.get(k) ?? 0) + 1);
  }
  const paper = [...freq.entries()].sort((a, b) => b[1] - a[1])[0][0].split(",").map(Number);
  const top = [...chr.entries()].sort((a, b) => b[1] - a[1])[0];
  const total = [...chr.values()].reduce((a, b) => a + b, 0);
  return { paper, ink: top ? top[0].split(",").map(Number) : null, inkPx: top?.[1] ?? 0, chromaticPx: total, inkVsPaper: top ? +ratio(top[0].split(",").map(Number), paper).toFixed(3) : null };
};

async function shoot(browser, base) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce", colorScheme: "light" });
  const page = await ctx.newPage();
  await page.goto(base + board.query);
  await page.waitForSelector(".sudoku-cell", { timeout: 60000 });
  await page.waitForTimeout(1500);
  await assertSameBoard(page, board.cells);
  for (let i = 0; i < 10; i++) {
    await page.evaluate(() => document.querySelector('[aria-label*="Hint" i]:not([disabled])')?.click());
    await page.waitForTimeout(150);
  }
  await page.evaluate(() => document.activeElement?.blur?.());
  await page.mouse.move(2, 2);
  const trace = (await settled(page, TRACE)).value;
  const box = await page.locator("svg.hand-drawn-grid").first().boundingBox();
  const shot = await page.screenshot({ clip: { x: box.x - 14, y: box.y - 14, width: box.width + 28, height: box.height * 0.34 } });
  const band = await page.screenshot({ clip: { x: box.x + box.width * 0.1, y: box.y - 10, width: box.width * 0.8, height: 26 } });
  const meta = {
    trace,
    fine: await page.evaluate(() => matchMedia("(pointer: fine)").matches),
    aria: await page.evaluate(() => { const e = document.querySelector('[role="progressbar"]'); return e ? { now: e.getAttribute("aria-valuenow"), max: e.getAttribute("aria-valuemax"), text: e.getAttribute("aria-valuetext") } : null; }),
    band: await bandReading(band),
  };
  await ctx.close();
  return { shot, meta };
}

async function tile(buf, lines, width, file) {
  const LINE = 17, PAD = 5, H0 = PAD * 2 + LINE * lines.length;
  const img = sharp(buf).resize({ width });
  const m = await img.metadata();
  const h = Math.round((m.height * width) / m.width);
  const esc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const label = Buffer.from(`<svg width="${width}" height="${H0}"><rect width="100%" height="100%" fill="#ffffff"/>${lines.map((t, i) => `<text x="6" y="${PAD + 13 + i * LINE}" font-family="Helvetica" font-size="12" fill="#111">${esc(t)}</text>`).join("")}</svg>`);
  await sharp({ create: { width, height: H0 + h, channels: 3, background: "#ffffff" } })
    .composite([{ input: label, top: 0, left: 0 }, { input: await img.png().toBuffer(), top: H0, left: 0 }])
    .png()
    .toFile(file);
}

const report = { payload: board.payload, givens: board.givens };
for (const [name, type] of [["chromium", chromium], ["webkit", webkit]]) {
  const browser = await type.launch();
  const W = 470, tiles = [];
  report[name] = {};
  for (const arm of ["gold", "violet", "graphite", "control"]) {
    const r = await shoot(browser, ARMS[arm]);
    report[name][arm] = r.meta;
    const b = r.meta.band, a = r.meta.aria;
    const inkLine = arm === "graphite"
      ? "no chromatic gauge (the trace is graphite): band ratio not quoted"
      : `band ink ${b.ink?.join(",")} at ${b.inkVsPaper}:1 on paper ${b.paper.join(",")}`;
    const f = `${OUT}/.acc5-tile-${name}-${arm}.png`;
    await tile(r.shot, [`${arm.toUpperCase()} · ${TREE[arm]} · stroke ${r.meta.trace?.stroke}`, inkLine, `aria-valuenow ${a?.now} of ${a?.max} · valuetext "${a?.text}"`], W, f);
    tiles.push(f);
  }
  await browser.close();
  const metas = await Promise.all(tiles.map((t) => sharp(t).metadata()));
  const h = Math.max(...metas.map((m) => m.height));
  const head = Buffer.from(`<svg width="${W * 2}" height="24"><rect width="100%" height="100%" fill="#f2f2f2"/><text x="6" y="16" font-family="Helvetica" font-size="12" fill="#111">${name} · light · 1280x800 · fine pointer · PRM reduce · payload ${board.payload.slice(0, 16)}… · ten hints · the top third of each board</text></svg>`);
  const file = `${OUT}/p6-1-section-fork-gold-violet-graphite-light-${name}-1280x800-fine.png`;
  await sharp({ create: { width: W * 2, height: h * 2 + 24, channels: 3, background: "#ffffff" } })
    .composite([{ input: head, top: 0, left: 0 }, ...tiles.map((t, i) => ({ input: t, left: (i % 2) * W, top: 24 + Math.floor(i / 2) * h }))])
    .png({ palette: true, colours: 96, compressionLevel: 9 })
    .toFile(file);
  console.log(`SECTION ${name} -> ${file}`, JSON.stringify(report[name]));
}
writeFileSync(`${OUT}/.acc5-crops.json`, JSON.stringify(report, null, 2));
console.log("ALLDONE");
