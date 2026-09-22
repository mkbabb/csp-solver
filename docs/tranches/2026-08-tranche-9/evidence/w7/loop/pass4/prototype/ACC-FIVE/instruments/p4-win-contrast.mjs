/**
 * ACC-FIVE pass 4 · G4 ROW 3 — the `prefers-contrast: more` arm at the WIN, painted.
 *
 * The pass-3 critique measured a confirmed 1.4.11 regression here (§3.3): the win's
 * `.solve-success .progress-trace` (0,2,0 `!important`) beat the contrast arm's `.progress-trace`
 * (0,1,0), so a reader who asked for MORE contrast got gold WAX on paper at 2.533 — down from
 * gold INK's 4.967 a moment earlier, and under the 3:1 non-text floor. The cure is one rule
 * restated at the win's specificity AFTER it in source order. This reads what it PAINTS, at
 * no-preference, both engines, both themes, at rest and at the win, with and without the arm.
 *
 * Born-RED control in the same run: the arm is ABLATED live (the pass-3 LAYERED ablation idiom
 * — the win's rule re-stated inside `@layer base` cannot beat it, so the ablation instead
 * re-asserts the wax at higher specificity in a style element appended last) and the same
 * reading is taken. If the ablated arm does not reproduce the 2.533 the gate is vacuous.
 *
 *   node p4-win-contrast.mjs <url> <outdir>
 */
import { chromium, webkit } from "playwright";
import { writeFileSync, mkdirSync } from "node:fs";

const URL_ = process.argv[2] ?? "http://127.0.0.1:4236/?size=3&difficulty=EASY";
const OUT = process.argv[3] ?? ".";
mkdirSync(OUT, { recursive: true });

const CHROMA_FLOOR = 0.05;
const GOLD_HUE = { light: 83.7, dark: 95.2 };

const s2l = (c) => {
  const x = c / 255;
  return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
};
const lum = ([r, g, b]) => 0.2126 * s2l(r) + 0.7152 * s2l(g) + 0.0722 * s2l(b);
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
function oklch([r, g, b]) {
  const [R, G, B] = [s2l(r), s2l(g), s2l(b)];
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const Bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return {
    L: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    C: Math.hypot(A, Bb),
    h: ((Math.atan2(Bb, A) * 180) / Math.PI + 360) % 360,
  };
}
const hueGap = (a, b) => {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
};
const px = (p, x, y) => {
  const o = (p.w * y + x) << 2;
  return [p.data[o], p.data[o + 1], p.data[o + 2]];
};

/** The band decoded BY THE ENGINE THAT PAINTED IT — `pngjs` is not a dependency of this
 *  package (which is why the pass-3 spec had never run), and nothing is installed for a gate. */
async function band(page, clip) {
  const b64 = (await page.screenshot({ clip })).toString("base64");
  return page.evaluate(async (d) => {
    const img = new Image();
    img.src = "data:image/png;base64," + d;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    const ctx = c.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(img, 0, 0);
    return { w: c.width, h: c.height, data: Array.from(ctx.getImageData(0, 0, c.width, c.height).data) };
  }, b64);
}
function grounds(p) {
  const freq = new Map();
  for (let y = 0; y < p.h; y++)
    for (let x = 0; x < p.w; x++) {
      const k = px(p, x, y).join(",");
      freq.set(k, (freq.get(k) ?? 0) + 1);
    }
  const ranked = [...freq.entries()].sort((a, b) => b[1] - a[1]);
  const paper = ranked[0][0].split(",").map(Number);
  let line = null;
  for (const [k] of ranked) {
    const rgb = k.split(",").map(Number);
    if (k === ranked[0][0]) continue;
    if (oklch(rgb).C > 0.03) continue;
    if (Math.abs(lum(rgb) - lum(paper)) < 0.05) continue;
    line = rgb;
    break;
  }
  return { paper, line };
}
function core(p, scheme, cols = 24) {
  const per = [];
  let off = null;
  const step = Math.max(1, Math.floor(p.w / cols));
  for (let c = 0; c < cols; c++) {
    const x = Math.min(p.w - 1, c * step);
    let best = null;
    for (let y = 0; y < p.h; y++) {
      const rgb = px(p, x, y);
      const o = oklch(rgb);
      if (o.C < CHROMA_FLOOR) continue;
      if (!off || o.C > off.C) off = { rgb, ...o };
      if (hueGap(o.h, GOLD_HUE[scheme]) > 45) continue;
      if (!best || o.C > best.C) best = { rgb, ...o };
    }
    if (best) per.push(best);
  }
  const freq = new Map();
  for (const q of per) freq.set(q.rgb.join(","), (freq.get(q.rgb.join(",")) ?? 0) + 1);
  const ranked = [...freq.entries()].sort((a, b) => b[1] - a[1]);
  return {
    modal: ranked.length ? ranked[0][0].split(",").map(Number) : null,
    columns: per.length,
    offAnchor: off ? { rgb: off.rgb, h: +off.h.toFixed(1), C: +off.C.toFixed(3) } : null,
  };
}

const valuenow = (page) =>
  page.evaluate(() => {
    const el = document.querySelector('[role="progressbar"]');
    return el ? Number(el.getAttribute("aria-valuenow")) : -1;
  });

/** Fill through the product's own HINT (every digit correct, so the board stays solvable) until
 *  the gauge's own `aria-valuenow` reaches `stopAt`. Two calls give a pre-win and a win state. */
async function fillUntil(page, stopAt, max = 90) {
  let n = 0;
  for (; n < max; n++) {
    if ((await valuenow(page)) >= stopAt) break;
    const ok = await page.evaluate(() => {
      const b = document.querySelector('[aria-label*="Hint" i]');
      if (!b || b.disabled) return false;
      b.click();
      return true;
    });
    if (!ok) break;
    await page.waitForTimeout(90);
  }
  await page.evaluate(() => document.activeElement?.blur?.());
  await page.waitForTimeout(700);
  return { clicks: n, valuenow: await valuenow(page) };
}

const ABLATE = () => {
  const st = document.createElement("style");
  // THE BORN-RED CONTROL, and its first cut was wrong in a way worth keeping on the record:
  // an UNLAYERED `html body .solve-success .progress-trace { … !important }` has higher
  // specificity and still LOSES, because for important declarations the cascade-layer order is
  // REVERSED and unlayered important styles sort last. The ablation has to re-state the wax in
  // an EARLIER layer than `utilities` — the pass-3 LAYERED ablation idiom, verbatim.
  st.textContent =
    "@layer base{.solve-success .progress-trace{stroke:var(--color-gold-star)!important}}";
  document.head.appendChild(st);
};

const rows = [];
for (const [name, type] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const browser = await type.launch();
  for (const scheme of ["light", "dark"]) {
    for (const arm of ["default", "more", "more-ablated"]) {
      const ctx = await browser.newContext({
        colorScheme: scheme,
        reducedMotion: "no-preference",
        contrast: arm === "default" ? "no-preference" : "more",
        viewport: { width: 1280, height: 800 },
      });
      const page = await ctx.newPage();
      await page.goto(URL_);
      await page.waitForSelector(".sudoku-cell", { timeout: 60000 });
      await page.waitForTimeout(1400);
      const witness = await page.evaluate(() => ({
        more: matchMedia("(prefers-contrast: more)").matches,
        prm: matchMedia("(prefers-reduced-motion: reduce)").matches,
      }));
      const box = await page.locator("svg.hand-drawn-grid").first().boundingBox();
      const clip = {
        x: Math.round(box.x + box.width * 0.1),
        y: Math.round(box.y - 10),
        width: Math.round(box.width * 0.8),
        height: 26,
      };
      const g = grounds(await band(page, clip));

      // BEFORE the win: the gauge at its highest UNSOLVED pressure
      const pre = await fillUntil(page, 25);
      const before = core(await band(page, clip), scheme);
      const beforeStroke = await page.evaluate(() => {
        const t = document.querySelector(".progress-trace");
        return t
          ? {
              stroke: getComputedStyle(t).stroke,
              width: getComputedStyle(t).strokeWidth,
              solved: !!document.querySelector(".solve-success"),
            }
          : null;
      });
      // THE WIN, driven by the product.s own Solve (pass-3.s route): filling by Hint reaches
      // `aria-valuenow` 100 and never sets `.solve-success` — measured, all twelve cells of the
      // first run read `solved=false` at 100%. The verdict is an ACT, not a threshold.
      const post = { clicks: 0, valuenow: await valuenow(page) };
      await page.evaluate(() => document.querySelector('[aria-label="Solve puzzle"]')?.click());
      await page.waitForTimeout(1200);
      if (arm === "more-ablated") await page.evaluate(ABLATE);
      await page.waitForTimeout(1800);
      const after = core(await band(page, clip), scheme);
      const afterStroke = await page.evaluate(() => {
        const t = document.querySelector(".progress-trace");
        return t
          ? {
              stroke: getComputedStyle(t).stroke,
              width: getComputedStyle(t).strokeWidth,
              solved: !!document.querySelector(".solve-success"),
            }
          : null;
      });
      const r = (m) =>
        m && g.line
          ? { vsLine: +ratio(m, g.line).toFixed(3), vsPaper: +ratio(m, g.paper).toFixed(3) }
          : null;
      rows.push({
        engine: name,
        scheme,
        arm,
        witness,
        pre,
        post,
        paper: g.paper,
        line: g.line,
        before: {
          ...beforeStroke,
          modal: before.modal,
          columns: before.columns,
          ...r(before.modal),
        },
        after: {
          ...afterStroke,
          modal: after.modal,
          columns: after.columns,
          offAnchor: after.offAnchor,
          ...r(after.modal),
        },
      });
      console.log(`  done ${name}/${scheme}/${arm}`);
      await ctx.close();
    }
  }
  await browser.close();
}
writeFileSync(`${OUT}/win-contrast.json`, JSON.stringify(rows, null, 2));
for (const x of rows)
  console.log(
    `${x.engine}/${x.scheme}/${x.arm} more=${x.witness.more} pre=${x.pre.valuenow} post=${x.post.valuenow} | ` +
      `BEFORE ${x.before.stroke} @${x.before.width} solved=${x.before.solved} cols ${x.before.columns} line ${x.before.vsLine} paper ${x.before.vsPaper} | ` +
      `AFTER ${x.after.stroke} @${x.after.width} solved=${x.after.solved} cols ${x.after.columns} line ${x.after.vsLine} paper ${x.after.vsPaper}`,
  );
