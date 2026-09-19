/**
 * THE SHEET'S REAL GROUND, IN BYTES.
 *
 * `b-ground-*.b64` is the register's own box, shot at dpr 3 with every glyph and row-mark in it
 * hidden — so what is left is exactly the ground each text run sits on: the 80%-opaque popover
 * pose over whatever the page put behind it, the `sudoku` wordmark included. For each run's box
 * (from `b-ground-*.json`) this reports the extremes of that ground and the contrast the run's
 * own ink makes against the WORST of them.
 *
 * The estate's own composite rule: a translucent ink (`--ink-press-quiet` is 68% graphite) is
 * composited over the ground it lands on, and the ratio is taken between that composite and
 * that same ground — which is why a quiet caption that reads 5.23 on the card can read under
 * 4.5 over a wordmark bleeding through the same card.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const HERE = path.dirname(new URL(import.meta.url).pathname);
const READ = path.join(HERE, "..", "readings");
const DPR = 3;

const lum = ([r, g, b]) => {
  const f = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * f[0] + 0.7152 * f[1] + 0.0722 * f[2];
};
const ratio = (a, b) => {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return +((l1 + 0.05) / (l2 + 0.05)).toFixed(3);
};
const over = (fg, a, bg) => fg.map((c, i) => c * a + bg[i] * (1 - a));

/** `color(srgb 0.15 0.15 0.15 / 0.68)` and `rgb(38, 38, 38)` both, to 0-255 + alpha. */
function parseColor(s) {
  const nums = (s.match(/[-\d.]+(?:e[-+]?\d+)?/gi) ?? []).map(Number);
  if (s.startsWith("color(")) {
    const rgb = nums.slice(0, 3).map((v) => v * 255);
    return { rgb, a: nums.length > 3 ? nums[3] : 1 };
  }
  return { rgb: nums.slice(0, 3), a: nums.length > 3 ? nums[3] : 1 };
}

const out = [];
for (const f of fs.readdirSync(READ).filter((f) => f.endsWith(".b64"))) {
  const stem = f.replace(/\.b64$/, "");
  const json = JSON.parse(fs.readFileSync(path.join(READ, `${stem}.json`), "utf8"));
  const png = Buffer.from(fs.readFileSync(path.join(READ, f), "utf8"), "base64");
  const img = sharp(png);
  const meta = await img.metadata();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const px = (x, y) => {
    const i = (y * info.width + x) * info.channels;
    return [data[i], data[i + 1], data[i + 2]];
  };
  const sheet = json.sheet;
  const runs = [];
  for (const run of json.runs) {
    // the run's box, in the crop's own device pixels
    const x0 = Math.max(0, Math.round((run.box.x - sheet.x) * DPR));
    const y0 = Math.max(0, Math.round((run.box.y - sheet.y) * DPR));
    const x1 = Math.min(info.width - 1, Math.round((run.box.x - sheet.x + run.box.w) * DPR));
    const y1 = Math.min(info.height - 1, Math.round((run.box.y - sheet.y + run.box.h) * DPR));
    let lo = null;
    let hi = null;
    const seen = new Map();
    for (let y = y0; y <= y1; y++)
      for (let x = x0; x <= x1; x++) {
        const p = px(x, y);
        const L = lum(p);
        if (!lo || L < lo.L) lo = { p, L };
        if (!hi || L > hi.L) hi = { p, L };
        const k = p.join(",");
        seen.set(k, (seen.get(k) ?? 0) + 1);
      }
    const ink = parseColor(run.color);
    // the worst ground for a DARK ink is the darkest ground; for a LIGHT ink, the lightest.
    const inkL = lum(ink.rgb);
    const groundBg = json.sheet.own[0] > 0.5 ? null : null;
    const worst = inkL < 0.5 ? lo.p : hi.p;
    const best = inkL < 0.5 ? hi.p : lo.p;
    const topGrounds = [...seen.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([k, n]) => ({ rgb: k, n }));
    runs.push({
      sel: run.sel,
      text: run.text,
      ink: run.color,
      inkRgb: ink.rgb.map((v) => +v.toFixed(1)),
      inkAlpha: ink.a,
      groundDarkest: lo.p,
      groundLightest: hi.p,
      groundModes: topGrounds,
      ratioOnWorstGround: ratio(over(ink.rgb, ink.a, worst), worst),
      ratioOnBestGround: ratio(over(ink.rgb, ink.a, best), best),
      worstGround: worst,
    });
  }
  out.push({ file: stem, crop: { w: meta.width, h: meta.height }, runs });
}

fs.writeFileSync(path.join(READ, "ground-bytes.json"), JSON.stringify(out, null, 1));
for (const r of out) {
  console.log(`\n## ${r.file}  (crop ${r.crop.w}x${r.crop.h})`);
  for (const run of r.runs)
    console.log(
      `  ${run.sel.padEnd(14)} "${run.text}"\n` +
        `      ink ${run.ink}\n` +
        `      ground darkest ${run.groundDarkest.join(",")}  lightest ${run.groundLightest.join(",")}  modes ${run.groundModes.map((m) => `${m.rgb}×${m.n}`).join("  ")}\n` +
        `      WORST ${run.ratioOnWorstGround}:1 over rgb(${run.worstGround.join(",")})   best ${run.ratioOnBestGround}:1`,
    );
}
