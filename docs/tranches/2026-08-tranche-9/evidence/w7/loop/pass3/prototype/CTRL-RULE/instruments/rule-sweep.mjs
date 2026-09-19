// T9-W7 pass 3 · CTRL-RULE — THE RULE'S WORST PAINTED COLUMN, swept.
//
// The reading is SUB-PIXEL-PHASE DEPENDENT: the same 2px stroke reads 3.530 at y 302.83 and
// 2.413 at y 766.03 when the rule lands between device pixels. A median is not a floor and one
// cell's read is not a population, so the gate is the WORST PAINTED COLUMN over
// 7 rules × 2 themes × 2 engines × 4 sub-pixel phases, against 1.4.11's 3:1.
//
// Per column: take the DARKEST pixel, compute its WCAG contrast against the card's own paper
// (sampled from the same crop, 2px above the rule). The worst column over the whole sweep is
// the number. σ per seed is the standard deviation of the painted centroid's y across columns
// — a CSS `border-top` hairline has σ 0 by construction and that is the incumbent this line
// replaces; the band is R3's grid band [0.722, 2.886].
//
// node rule-sweep.mjs <chromium|webkit> <theme> <BASE>
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const NM =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/";
const { chromium, webkit } = await import(NM + "playwright/index.mjs");
const sharp = (await import(NM + "sharp/dist/index.mjs")).default;

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..", "readings");
mkdirSync(OUT, { recursive: true });

const ENGINE = process.argv[2] || "chromium";
const THEME = process.argv[3] || "light";
const BASE = process.argv[4] || "http://127.0.0.1:4231/";
const PHASES = [0, 0.25, 0.5, 0.75];

const lin = (c) => {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const L = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const contrast = (a, b) => {
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
};

const browser = await (ENGINE === "webkit" ? webkit : chromium).launch();
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 1,
  colorScheme: THEME,
});
await ctx.addInitScript((t) => {
  try {
    localStorage.clear();
    localStorage.setItem("sudoku-color-scheme", t);
  } catch {}
}, THEME);
const page = await ctx.newPage();
await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
await page.waitForSelector("svg.handwritten-logo", { timeout: 40000 });
await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
await page.waitForTimeout(1600);
// the rules DRAW ON once at mount — let the animation finish before a pixel is read
await page.waitForTimeout(600);

const out = { engine: ENGINE, theme: THEME, base: BASE, rules: [] };
const n = await page.locator(".rp-rule").count();
for (let i = 0; i < n; i++) {
  for (const ph of PHASES) {
    await page.addStyleTag({
      content: `.rp-rule{transform:translateY(${ph}px)!important}`,
    });
    await page.waitForTimeout(60);
    const box = await page.locator(".rp-rule").nth(i).boundingBox();
    if (!box || box.width < 8) continue;
    const clip = {
      x: Math.round(box.x),
      y: Math.round(box.y) - 6,
      width: Math.round(box.width),
      height: Math.round(box.height) + 12,
    };
    if (clip.y < 0 || clip.y + clip.height > 800) continue;
    const buf = await page.screenshot({ clip });
    const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
    const { width: W, height: H, channels: C } = info;
    // PAPER is the crop's top row sampled across its width and taken at the MEDIAN, not one
    // corner pixel: one corner can land on a neighbouring group's ink and re-pitch every
    // contrast in the crop.
    const top = [];
    for (let x = 0; x < W; x++) top.push(L(data[x * C], data[x * C + 1], data[x * C + 2]));
    top.sort((a, b) => a - b);
    const paper = top[Math.floor(top.length / 2)];
    let worst = Infinity;
    let best = 0;
    let painted = 0;
    const centroids = [];
    // THE WORST PAINTED COLUMN IS OVER THE PAINTED COLUMNS. A drawn line with round caps does
    // not reach the last column of its own viewBox, and an unpainted column reads contrast
    // 1.000 — the first sweep reported exactly that at every cell, which is the instrument
    // measuring the gap beside the line rather than the line. INK_MIN is the ink mass a column
    // needs before its darkest pixel is a reading about the RULE.
    // PASS 1 over the columns: each column's darkest pixel and its ink MASS.
    const cols = [];
    for (let x = 0; x < W; x++) {
      let dark = Infinity;
      let wsum = 0;
      let ysum = 0;
      for (let y = 0; y < H; y++) {
        const o = (y * W + x) * C;
        const l = L(data[o], data[o + 1], data[o + 2]);
        if (l < dark) dark = l;
        const ink = Math.max(0, paper - l);
        wsum += ink;
        ysum += ink * y;
      }
      cols.push({ dark, wsum, y: wsum > 0 ? ysum / wsum : null });
    }
    // THE LINE'S BODY, not its CAP. A round cap tapers to nothing over its last pixel or two,
    // and a tapered column's darkest pixel is nearly paper — reading it as "the worst painted
    // column" measures the end of the stroke, not the stroke. The body is every column whose
    // ink mass is at least half the median inked column's; the count that falls out is
    // reported, so the exclusion can be argued with rather than discovered.
    const inked = cols.filter((c) => c.wsum > 0.02).map((c) => c.wsum).sort((a, b) => a - b);
    if (!inked.length) continue;
    const med = inked[Math.floor(inked.length / 2)];
    const body = cols.filter((c) => c.wsum >= med * 0.5);
    const capCols = cols.filter((c) => c.wsum > 0.02 && c.wsum < med * 0.5).length;
    if (!body.length) continue;
    for (const c of body) {
      painted++;
      const ct = contrast(paper, c.dark);
      if (ct < worst) worst = ct;
      if (ct > best) best = ct;
      if (c.y != null) centroids.push(c.y);
    }
    const mean = centroids.reduce((a, b) => a + b, 0) / (centroids.length || 1);
    const sigma = Math.sqrt(
      centroids.reduce((a, b) => a + (b - mean) ** 2, 0) / (centroids.length || 1),
    );
    out.rules.push({
      rule: i,
      phase: ph,
      cols: W,
      bodyCols: painted,
      capColsExcluded: capCols,
      worstColumn: +worst.toFixed(3),
      bestColumn: +best.toFixed(3),
      sigma: +sigma.toFixed(3),
      paperL: +paper.toFixed(4),
    });
  }
}
const worst = out.rules.length ? Math.min(...out.rules.map((r) => r.worstColumn)) : null;
const sigmas = out.rules.map((r) => r.sigma);
out.summary = {
  reads: out.rules.length,
  worstPaintedColumn: worst,
  sigmaMin: sigmas.length ? +Math.min(...sigmas).toFixed(3) : null,
  sigmaMax: sigmas.length ? +Math.max(...sigmas).toFixed(3) : null,
  clears3: worst != null ? worst >= 3.0 : null,
};
console.log(ENGINE, THEME, JSON.stringify(out.summary));
writeFileSync(join(OUT, `rule-sweep-${ENGINE}-${THEME}.json`), JSON.stringify(out, null, 2));
await browser.close();
console.log("EXIT OK");
