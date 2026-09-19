/**
 * Reads every strip through pixels.mjs's own analysis and prints the two answers the gates
 * want: RUNS vs N (G1) and the painted core's contrast against the strip's own ground (G2).
 * Run from web/frontend (sharp lives there).
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";

const DIR =
  "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plr1";
const OUT = `${DIR}/out`;

const lum = (rgb) => {
  const f = rgb.map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * f[0] + 0.7152 * f[1] + 0.0722 * f[2];
};
const ratio = (a, b) => {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return +((l1 + 0.05) / (l2 + 0.05)).toFixed(3);
};

const files = fs
  .readdirSync(OUT)
  .filter((f) => /^strip-(chromium|webkit)-/.test(f) && f.endsWith(".png"))
  .sort();
const json = JSON.parse(
  execFileSync("node", [`${DIR}/pixels.mjs`, ...files.map((f) => `${OUT}/${f}`)], {
    maxBuffer: 1 << 28,
  }).toString(),
);

const rows = [];
for (const [name, v] of Object.entries(json)) {
  const m = name.match(/strip-(\w+)-(\w+)-n(\d+)\.png/);
  const r = v.rows[0];
  rows.push({
    engine: m[1],
    theme: m[2],
    n: +m[3],
    bands: v.bands,
    runs: r ? r.runs : 0,
    gaps: r ? r.gapsPx : [],
    widths: r ? r.runWidthsPx : [],
    chroma: r ? r.chroma : null,
    minHueSep: r ? r.minPaintedHueSep : null,
    ground: v.ground,
    worstContrast: r
      ? Math.min(...r.cores.map((c) => ratio(c.rgb, v.ground)))
      : null,
    cores: r ? r.cores.map((c) => ({ rgb: c.rgb, C: c.C, h: c.h, w: c.widthPx })) : [],
  });
}
rows.sort((a, b) => a.engine.localeCompare(b.engine) || a.theme.localeCompare(b.theme) || a.n - b.n);
fs.writeFileSync(`${OUT}/strips-read.json`, JSON.stringify(rows, null, 1));
for (const r of rows)
  console.log(
    `${r.engine.padEnd(8)} ${r.theme.padEnd(5)} N=${String(r.n).padEnd(2)} runs=${r.runs} ` +
      `gaps=[${r.gaps.join(",")}] widths=[${r.widths.join(",")}] C=${r.chroma?.min}..${r.chroma?.max} ` +
      `minHue=${r.minHueSep} worstContrast=${r.worstContrast}`,
  );
