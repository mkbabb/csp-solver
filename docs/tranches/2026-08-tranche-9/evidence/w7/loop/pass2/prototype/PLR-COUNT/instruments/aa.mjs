/**
 * THE SHEET'S AA, IN PAINTED BYTES (T9-W7 PLR-COUNT G14).
 *
 * The register's own box, shot at dpr 3 with the wordmark behind it, and each text run's box
 * read out of the page. For every run this reports the ground it actually sits on (modal
 * colour and the spread across the run's box — the wordmark's bleed is exactly that spread)
 * and the contrast its darkest painted core makes against that ground.
 *
 * Pass 1's number for `.pl-more` was 4.166 against a ground that was 80% popover over a
 * wordmark; the ground is opaque now, so what this asks is whether the bleed is gone AND the
 * ratio clears 4.5.
 *
 * node aa.mjs <strips-dir> <geom.json>
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

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

const [stripDir, geomFile] = process.argv.slice(2);
const geom = JSON.parse(fs.readFileSync(geomFile, "utf8"));
const engine = path.basename(geomFile).replace(/^sheet16-geom-|\.json$/g, "");

for (const scheme of ["light", "dark"]) {
  const file = path.join(stripDir, `sheet16-${scheme}-${engine}.png`);
  if (!fs.existsSync(file)) continue;
  const img = sharp(file);
  const { width, height } = await img.metadata();
  const raw = await img.ensureAlpha().raw().toBuffer();
  const at = (x, y) => {
    const i = (y * width + x) * 4;
    return [raw[i], raw[i + 1], raw[i + 2]];
  };
  console.log(`\n== ${scheme} · ${engine} · ${width}x${height} device px`);
  for (const [sel, run] of Object.entries(geom[scheme].runs)) {
    if (!run) continue;
    const x0 = Math.max(0, Math.round(run.x * DPR));
    const y0 = Math.max(0, Math.round(run.y * DPR));
    const x1 = Math.min(width, Math.round((run.x + run.w) * DPR));
    const y1 = Math.min(height, Math.round((run.y + run.h) * DPR));
    const counts = new Map();
    let core = null;
    let coreL = scheme === "light" ? 2 : -1;
    for (let y = y0; y < y1; y++)
      for (let x = x0; x < x1; x++) {
        const p = at(x, y);
        const k = p.join(",");
        counts.set(k, (counts.get(k) ?? 0) + 1);
        const L = lum(p);
        if (scheme === "light" ? L < coreL : L > coreL) {
          coreL = L;
          core = p;
        }
      }
    const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
    const ground = sorted[0][0].split(",").map(Number);
    // the spread of the GROUND itself: every colour holding ≥1% of the box that is within
    // 12 bytes of the modal one is the same paper; anything further is either ink or bleed.
    const paperish = sorted
      .filter(([, n]) => n / ((x1 - x0) * (y1 - y0)) >= 0.01)
      .map(([k]) => k.split(",").map(Number))
      .filter((p) => Math.abs(lum(p) - lum(ground)) < 0.06);
    const lums = paperish.map(lum);
    console.log(
      `${sel.padEnd(14)} ground rgb(${ground})  spread ${(
        (Math.max(...lums) - Math.min(...lums)) *
        100
      ).toFixed(2)}%  core rgb(${core})  ratio ${ratio(core, ground)}  declared ${run.color}`,
    );
  }
}
