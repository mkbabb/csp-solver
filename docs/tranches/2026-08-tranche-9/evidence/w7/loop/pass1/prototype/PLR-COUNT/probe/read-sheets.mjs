/**
 * The register's own bytes — the row marks and the names, read off the sheet screenshots at
 * dpr3, against the CARD ground (the modal colour of the sheet's own corners). Answers G2's
 * card half with pixels rather than with a computed `oklch()` string a parser can mangle.
 */
import sharp from "sharp";
import fs from "node:fs";

const OUT =
  "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plr1/out";

const lin = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const lum = (p) => 0.2126 * lin(p[0] / 255) + 0.7152 * lin(p[1] / 255) + 0.0722 * lin(p[2] / 255);
const ratio = (a, b) => {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return +((l1 + 0.05) / (l2 + 0.05)).toFixed(3);
};

const rows = [];
for (const file of fs.readdirSync(OUT).filter((f) => f.startsWith("sheet-") && f.endsWith(".png"))) {
  const img = sharp(`${OUT}/${file}`);
  const { width, height } = await img.metadata();
  const raw = await img.ensureAlpha().raw().toBuffer();
  const at = (x, y) => {
    const i = (y * width + x) * 4;
    return [raw[i], raw[i + 1], raw[i + 2]];
  };
  // ground = the modal colour of the four inner corners (inside the 1rem padding, dpr3)
  const counts = new Map();
  for (const [ox, oy] of [
    [20, 20],
    [width - 26, 20],
    [20, height - 26],
    [width - 26, height - 26],
  ])
    for (let y = oy; y < oy + 6; y++)
      for (let x = ox; x < ox + 6; x++) {
        const k = at(x, y).join(",");
        counts.set(k, (counts.get(k) ?? 0) + 1);
      }
  const ground = [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0].split(",").map(Number);
  const dist = (p) =>
    Math.abs(p[0] - ground[0]) + Math.abs(p[1] - ground[1]) + Math.abs(p[2] - ground[2]);
  // The row marks live in the leftmost ~20 device px of the content box (4.4 CSS px at dpr3
  // plus the 1rem padding = x 48..70); everything darker than the ink floor in that column is
  // a stroke.
  const strokeBand = [];
  for (let x = 44; x < 78; x++)
    for (let y = 0; y < height; y++) {
      const p = at(x, y);
      if (dist(p) > 24) strokeBand.push({ p, d: dist(p), x, y });
    }
  // group into rows by y, take each group's darkest pixel = the painted core
  strokeBand.sort((a, b) => a.y - b.y);
  const groups = [];
  let cur = null;
  for (const s of strokeBand) {
    if (!cur || s.y - cur.maxY > 6) {
      cur = { minY: s.y, maxY: s.y, best: s };
      groups.push(cur);
    } else {
      cur.maxY = s.y;
      if (s.d > cur.best.d) cur.best = s;
    }
  }
  const marks = groups
    .filter((g) => g.maxY - g.minY > 20)
    .map((g) => ({ y: g.minY, rgb: g.best.p, contrast: ratio(g.best.p, ground) }));
  // the darkest pixel anywhere right of the marks = a name glyph's core
  let name = null;
  for (let x = 84; x < width - 20; x++)
    for (let y = 0; y < height; y++) {
      const p = at(x, y);
      if (!name || dist(p) > dist(name)) name = p;
    }
  rows.push({
    file,
    ground,
    marks,
    worstMark: marks.length ? Math.min(...marks.map((m) => m.contrast)) : null,
    nameCore: name,
    nameContrast: name ? ratio(name, ground) : null,
  });
}
fs.writeFileSync(`${OUT}/sheets-read.json`, JSON.stringify(rows, null, 1));
for (const r of rows)
  console.log(
    `${r.file.padEnd(26)} ground=${r.ground.join(",")} marks=${r.marks.length} ` +
      `contrasts=[${r.marks.map((m) => m.contrast).join(",")}] worst=${r.worstMark} name=${r.nameContrast}`,
  );
