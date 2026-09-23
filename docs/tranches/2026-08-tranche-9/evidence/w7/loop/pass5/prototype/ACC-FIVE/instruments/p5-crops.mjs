/**
 * ACC-FIVE pass 5 · the owner's frames, each ONE payload, ONE variable per pair.
 *
 *  1. FORK A — the cell the fork disposes (pass-4 critique §3.5): chromium · light ·
 *     `prefers-contrast: more` · 1280×800 · fine pointer · AT THE WIN (the product's own Solve),
 *     three panes: CURED (this tree's dist), ABLATED (the same dist with the hedge struck by the
 *     pass-3 LAYERED idiom), CONTROL (`74a2b5d9`). Cured↔ablated differ by the hedge alone;
 *     cured↔control by the tree alone. `reducedMotion: reduce` holds the win still (the hedge is
 *     not a motion rule), and the stroke is polled to a settled value before each shot.
 *  2/3. THE SECTION'S FORK AT ONE BOARD — gold (this tree) / violet (ACC-SIX `-45`) / graphite
 *     (ACC-GRAPHITE `-40`) / control (`74a2b5d9`), all BUILT dists, one engine per crop
 *     (chromium, webkit) · light · 1280×800 · fine pointer · ten hints on the same payload.
 *
 * Each pane's painted reading goes in the JSON beside the crop (the number is the claim).
 *
 *   node p5-crops.mjs <outdir>   (ports: 4238 proto · 4237 control · 4239 SIX · 4240 GRAPHITE)
 */
import sharp from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.mjs";
import { writeFileSync } from "node:fs";
import { chromium, webkit, mintFromControl, assertSameBoard, settled, ratio, rgbOf } from "./p5-lib.mjs";

const OUT = process.argv[2];
if (!OUT) throw new Error("usage: node p5-crops.mjs <outdir>");
const ARMS = {
  gold: "http://127.0.0.1:4238",
  control: "http://127.0.0.1:4237",
  violet: "http://127.0.0.1:4239",
  graphite: "http://127.0.0.1:4240",
};
const board = await mintFromControl(ARMS.control);
console.log(`payload ${board.payload} (${board.givens} givens)`);
const ABLATE = "@layer base{.solve-success .progress-trace{stroke:var(--color-gold-star)!important}}";

const TRACE = () => {
  const t = document.querySelector(".progress-trace");
  return t ? { stroke: getComputedStyle(t).stroke, width: getComputedStyle(t).strokeWidth } : null;
};

/** The band's painted gauge: the modal pixel whose colour is not the paper's and not grey. */
const bandReading = async (buf) => {
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const freq = new Map();
  const chroma = new Map();
  for (let i = 0; i < info.width * info.height; i++) {
    const o = i * info.channels;
    const k = `${data[o]},${data[o + 1]},${data[o + 2]}`;
    freq.set(k, (freq.get(k) ?? 0) + 1);
    const mx = Math.max(data[o], data[o + 1], data[o + 2]);
    const mn = Math.min(data[o], data[o + 1], data[o + 2]);
    if (mx - mn >= 40) chroma.set(k, (chroma.get(k) ?? 0) + 1);
  }
  const paper = [...freq.entries()].sort((a, b) => b[1] - a[1])[0][0].split(",").map(Number);
  const top = [...chroma.entries()].sort((a, b) => b[1] - a[1])[0];
  const ink = top ? top[0].split(",").map(Number) : null;
  return { paper, ink, inkPx: top?.[1] ?? 0, inkVsPaper: ink ? +ratio(ink, paper).toFixed(3) : null };
};

async function shoot(browser, base, opts, act) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce", ...opts });
  const page = await ctx.newPage();
  await page.goto(base + board.query);
  await page.waitForSelector(".sudoku-cell", { timeout: 60000 });
  await page.waitForTimeout(1500);
  await assertSameBoard(page, board.cells);
  await act(page);
  await page.evaluate(() => document.activeElement?.blur?.());
  await page.mouse.move(2, 2);
  const trace = (await settled(page, TRACE)).value;
  const box = await page.locator("svg.hand-drawn-grid").first().boundingBox();
  const shot = await page.screenshot({ clip: { x: box.x - 14, y: box.y - 14, width: box.width + 28, height: box.height + 28 } });
  const band = await page.screenshot({ clip: { x: box.x + box.width * 0.1, y: box.y - 10, width: box.width * 0.8, height: 26 } });
  const meta = {
    trace,
    won: await page.evaluate(() => !!document.querySelector(".solve-success")),
    valuenow: await page.evaluate(() => document.querySelector("[aria-valuenow]")?.getAttribute("aria-valuenow") ?? null),
    matches: await page.evaluate(() => ({
      more: matchMedia("(prefers-contrast: more)").matches,
      dark: matchMedia("(prefers-color-scheme: dark)").matches,
      fine: matchMedia("(pointer: fine)").matches,
    })),
    band: await bandReading(band),
  };
  await ctx.close();
  return { shot, band, meta };
}

async function hints(page, n) {
  for (let i = 0; i < n; i++) {
    await page.evaluate(() => document.querySelector('[aria-label*="Hint" i]:not([disabled])')?.click());
    await page.waitForTimeout(150);
  }
}
const solve = async (page) => {
  await page.evaluate(() => document.querySelector('[aria-label="Solve puzzle"]')?.click());
  await page.waitForSelector(".solve-success", { timeout: 20000 });
  await page.waitForTimeout(800);
};

/** Stack panes with a thin label strip each (evidence labels, not product copy). */
async function compose(panes, width, file) {
  const LABEL = 22;
  const scaled = [];
  for (const p of panes) {
    const img = sharp(p.buf).resize({ width });
    const m = await img.metadata();
    const h = Math.round((m.height * width) / m.width);
    const label = Buffer.from(
      `<svg width="${width}" height="${LABEL}"><rect width="100%" height="100%" fill="#ffffff"/><text x="6" y="16" font-family="Helvetica" font-size="13" fill="#111">${p.label}</text></svg>`,
    );
    scaled.push({ label, img: await img.png().toBuffer(), h });
  }
  const H = scaled.reduce((a, s) => a + s.h + LABEL, 0);
  let y = 0;
  const comp = [];
  for (const s of scaled) {
    comp.push({ input: s.label, top: y, left: 0 });
    comp.push({ input: s.img, top: y + LABEL, left: 0 });
    y += s.h + LABEL;
  }
  await sharp({ create: { width, height: H, channels: 3, background: "#ffffff" } })
    .composite(comp)
    .png({ palette: true, colours: 128, compressionLevel: 9 })
    .toFile(file);
}

const report = { payload: board.payload, givens: board.givens };

// 1 · FORK A
{
  const browser = await chromium.launch();
  const o = { colorScheme: "light", contrast: "more" };
  const cured = await shoot(browser, ARMS.gold, o, solve);
  const ablated = await shoot(browser, ARMS.gold, o, async (p) => {
    await solve(p);
    await p.evaluate((css) => {
      const s = document.createElement("style");
      s.textContent = css;
      document.head.appendChild(s);
    }, ABLATE);
    await p.waitForTimeout(300);
  });
  const control = await shoot(browser, ARMS.control, o, solve);
  await browser.close();
  report.forkA = { cured: cured.meta, ablated: ablated.meta, control: control.meta };
  const f = `${OUT}/p5-1-forkA-win-light-contrastmore-chromium-fine.png`;
  await compose(
    [
      { buf: cured.band, label: `CURED (this tree) - stroke ${cured.meta.trace?.stroke} - band ink ${cured.meta.band.inkVsPaper}:1 on paper` },
      { buf: ablated.band, label: `ABLATED (hedge struck) - stroke ${ablated.meta.trace?.stroke} - ${ablated.meta.band.inkVsPaper}:1` },
      { buf: control.band, label: `CONTROL 74a2b5d9 - stroke ${control.meta.trace?.stroke} - ${control.meta.band.inkVsPaper}:1` },
    ],
    900,
    f,
  );
  console.log("FORK A", JSON.stringify(report.forkA));
}

// 2 / 3 · the section's fork at one board, one engine per crop
for (const [name, type] of [["chromium", chromium], ["webkit", webkit]]) {
  const browser = await type.launch();
  const o = { colorScheme: "light" };
  const panes = [];
  report[`section-${name}`] = {};
  for (const arm of ["gold", "violet", "graphite", "control"]) {
    const r = await shoot(browser, ARMS[arm], o, (p) => hints(p, 10));
    report[`section-${name}`][arm] = r.meta;
    panes.push({ buf: r.shot, label: `${arm.toUpperCase()} (${{ gold: "ACC-FIVE -41", violet: "ACC-SIX -45", graphite: "ACC-GRAPHITE -40", control: "74a2b5d9" }[arm]}) - ${r.meta.trace?.stroke} - band ink ${r.meta.band.inkVsPaper}:1 - valuenow ${r.meta.valuenow}` });
  }
  await browser.close();
  // two by two
  const W = 440;
  const tiles = [];
  for (const p of panes) {
    const f = `${OUT}/.tile-${tiles.length}.png`;
    await compose([p], W, f);
    tiles.push(f);
  }
  const metas = await Promise.all(tiles.map((t) => sharp(t).metadata()));
  const h = Math.max(...metas.map((m) => m.height));
  await sharp({ create: { width: W * 2, height: h * 2, channels: 3, background: "#ffffff" } })
    .composite(tiles.map((t, i) => ({ input: t, left: (i % 2) * W, top: Math.floor(i / 2) * h })))
    .png({ palette: true, colours: 128, compressionLevel: 9 })
    .toFile(`${OUT}/p5-${name === "chromium" ? 2 : 3}-section-fork-gold-violet-graphite-light-${name}-fine.png`);
  const { unlinkSync } = await import("node:fs");
  tiles.forEach((t) => unlinkSync(t));
  console.log(`SECTION ${name}`, JSON.stringify(report[`section-${name}`]));
}
writeFileSync(`${OUT}/crops.json`, JSON.stringify(report, null, 2));
