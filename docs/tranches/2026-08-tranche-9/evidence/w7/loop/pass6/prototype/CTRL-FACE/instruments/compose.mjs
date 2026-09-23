// compose labelled panels into one sheet: node compose.mjs <out.png> <scale> '<json rows: [[{f,l}...]...]>'
import { createRequire } from 'node:module';
const require = createRequire('/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json');
const sharp = require('sharp');
const [out, scaleS, rowsJ] = process.argv.slice(2);
const scale = +scaleS; const rows = JSON.parse(rowsJ); const PAD = 8, LAB = 18;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const built = [];
for (const row of rows) {
  const panels = [];
  for (const { f, l, s } of row) {
    const m = await sharp(f).metadata();
    const k = s ?? scale; const w = Math.round(m.width * k), h = Math.round(m.height * k);
    const img = await sharp(f).resize(w, h).png().toBuffer();
    const lab = Buffer.from(`<svg width="${w}" height="${LAB}"><rect width="100%" height="100%" fill="#fff"/><text x="2" y="13" font-family="Helvetica" font-size="12" fill="#000">${esc(l)}</text></svg>`);
    panels.push({ w, h: h + LAB, parts: [{ input: lab, top: 0, left: 0 }, { input: img, top: LAB, left: 0 }] });
  }
  const W = panels.reduce((a, p) => a + p.w + PAD, PAD), H = Math.max(...panels.map((p) => p.h)) + 2 * PAD;
  let x = PAD; const comp = [];
  for (const p of panels) { for (const part of p.parts) comp.push({ ...part, left: x + part.left, top: PAD + part.top }); x += p.w + PAD; }
  built.push({ W, H, buf: await sharp({ create: { width: W, height: H, channels: 3, background: '#ffffff' } }).composite(comp).png().toBuffer() });
}
const W = Math.max(...built.map((b) => b.W)), H = built.reduce((a, b) => a + b.H, 0);
let y = 0; const comp = []; for (const b of built) { comp.push({ input: b.buf, top: y, left: 0 }); y += b.H; }
await sharp({ create: { width: W, height: H, channels: 3, background: '#ffffff' } }).composite(comp).png().toFile(out);
console.log(out, W, H);
