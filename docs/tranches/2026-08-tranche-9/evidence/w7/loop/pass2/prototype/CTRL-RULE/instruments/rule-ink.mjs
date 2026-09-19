// T9-W7 pass 2 · CTRL-RULE arm (b) — THE RULE'S PAINTED INK, per rule, both engines, light.
//
// Census 1's `ruleContrast` read `worstColumn 1` at 390 and then threw at 1280 ("Clipped area
// is either empty or outside"): it clipped off a `getBoundingClientRect()` taken while the rule
// was still below the scrollport's own fold, so the box it asked the engine for was outside the
// viewport. The read was not wrong about the rule; it was reading paper. This is the same
// method with the missing half — the rule is scrolled INTO the card's view first, the rect is
// re-read after the scroll settles, and a rule that still cannot be brought on screen is
// reported `offscreen` rather than scored.
//
// METHOD (the r0 contrast idiom): screenshot the rule's own band, take the card's paper at the
// band's corner as the ground, and for every COLUMN of the band take the best ratio any pixel in
// that column reaches. The WORST of those columns is the number — an antialiased 1-ish px line's
// thinnest painted place, which is what 1.4.11's 3:1 is a floor on. A median is not a floor, and
// pass 1's 3.53 median hid a 2.451 column.
//
// SWEEP: `--rp-rule-stroke` at 1.8 and 2.0 (the token's 55% ramp is NOT moved for one consumer).
// Ships the THINNEST that clears 3.0 on every rule in both engines.
//
// node rule-ink.mjs   [BASE=http://127.0.0.1:4231/]
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
const BASE = process.env.BASE || "http://127.0.0.1:4231/";

const rl = (r, g, b) => {
  const f = (v) => {
    v /= 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => {
  const [x, y] = [rl(...a), rl(...b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

const CELLS = [
  { name: "390x844", w: 390, h: 844, touch: true },
  { name: "1280x800", w: 1280, h: 800, touch: false },
];

async function open(engine, cell) {
  const browser = await (engine === "webkit" ? webkit : chromium).launch();
  const ctx = await browser.newContext({
    viewport: { width: cell.w, height: cell.h },
    deviceScaleFactor: 1,
    hasTouch: cell.touch,
    isMobile: cell.touch && engine === "chromium" ? true : undefined,
    colorScheme: "light",
  });
  await ctx.addInitScript(() => {
    try {
      localStorage.clear();
      localStorage.setItem("sudoku-color-scheme", "light");
    } catch {}
  });
  const page = await ctx.newPage();
  await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 40000 });
  await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await page.waitForTimeout(1200);
  if (
    await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))
  ) {
    await page.locator(".drawer-tab").first().click({ force: true });
    await page.waitForTimeout(950); // THE SHEET SLIDES — settle before measuring it open
  }
  return { browser, page };
}

/** One rule's worst painted column, after bringing it into the scrollport's view. */
async function oneRule(page, sel, i) {
  const box = await page.evaluate(
    ([s, idx]) => {
      const el = document.querySelectorAll(s)[idx];
      if (!el) return null;
      el.scrollIntoView({ block: "center", behavior: "instant" });
      const r = el.getBoundingClientRect();
      const vw = document.documentElement.clientWidth;
      const vh = document.documentElement.clientHeight;
      const x = Math.max(0, Math.round(r.x));
      const y = Math.max(0, Math.round(r.y - 3));
      const w = Math.min(Math.round(r.width), vw - x);
      const h = Math.min(Math.round(r.height + 6), vh - y);
      if (w < 8 || h < 4 || y >= vh) return null;
      return { x, y, width: w, height: h };
    },
    [sel, i],
  );
  if (!box) return { i, offscreen: true };
  await page.waitForTimeout(120);
  const buf = await page.screenshot({ clip: box });
  const { data, info } = await sharp(buf)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const px = (x, y) => {
    const o = (y * width + x) * channels;
    return [data[o], data[o + 1], data[o + 2]];
  };
  // THE GROUND IS THE PAPER, AND IT IS FOUND RATHER THAN ASSUMED. Sampling one fixed corner
  // (`width-1, 0`) worked for the card's seven rules and LIED about the bar's: the foot's band
  // has the case's own fade above it, so that corner read 245 instead of the paper's 253 and
  // the same ink scored 2.394 against 3.53 — a reading about the sample, not about the line.
  // The band is paper plus one graphite rule by construction, so the paper is the lightest
  // thing in it; taking the max-luminance pixel is the same measurement with nothing assumed.
  let ground = px(width - 1, 0);
  {
    let bestL = -1;
    for (let x = 0; x < width; x++)
      for (let y = 0; y < height; y++) {
        const c = px(x, y);
        const L = rl(...c);
        if (L > bestL) {
          bestL = L;
          ground = c;
        }
      }
  }
  const cols = [];
  for (let x = 0; x < width; x++) {
    let best = 1;
    for (let y = 0; y < height; y++) best = Math.max(best, ratio(px(x, y), ground));
    cols.push(best);
  }
  const s = [...cols].sort((a, b) => a - b);
  return {
    i,
    ground,
    width,
    worstColumn: +s[0].toFixed(3),
    p05: +s[Math.floor(s.length * 0.05)].toFixed(3),
    median: +s[Math.floor(s.length / 2)].toFixed(3),
  };
}

const out = {};
for (const engine of ["chromium", "webkit"]) {
  for (const cell of CELLS) {
    const { browser, page } = await open(engine, cell);
    for (const stroke of [1.8, 2.0]) {
      await page.addStyleTag({ content: `:root{--rp-rule-stroke:${stroke}}` });
      await page.waitForTimeout(150);
      const n = await page.evaluate(
        () => document.querySelectorAll(".controls-card .rp-rule").length,
      );
      const rows = [];
      for (let i = 0; i < n; i++)
        rows.push(await oneRule(page, ".controls-card .rp-rule", i));
      const bar = await oneRule(page, "#card-foot .bar-rule, .action-bar .bar-rule", 0);
      const all = [...rows, { ...bar, i: "bar" }];
      const scored = all.filter((r) => !r.offscreen);
      const key = `${cell.name}/${engine}/${stroke}`;
      out[key] = {
        rules: n,
        scored: scored.length,
        offscreen: all.filter((r) => r.offscreen).map((r) => r.i),
        worst: scored.length ? Math.min(...scored.map((r) => r.worstColumn)) : null,
        rows: all,
      };
      console.log(
        key,
        `| rules ${n} scored ${scored.length}`,
        `| WORST ${out[key].worst}`,
        `| per-rule ${scored.map((r) => r.worstColumn).join(",")}`,
      );
    }
    await browser.close();
  }
}
writeFileSync(join(OUT, "rule-ink.json"), JSON.stringify(out, null, 1));
console.log("banked readings/rule-ink.json");
