// compose.mjs <out.png> <scale> <cols> <pane...> — panes laid in a grid, 6px gaps on a mid-grey ground, nearest
// scaling, palette PNG. The panes are the raw captures p6-frames.spec.ts writes; nothing is retouched.
import sharp from 'sharp';
const [out, scaleS, colsS, ...panes] = process.argv.slice(2);
const scale = +scaleS, cols = +colsS, G = 6;
const imgs = await Promise.all(panes.map(async (p) => { const m = await sharp(p).metadata(); const buf = await sharp(p).resize(Math.round(m.width * scale), Math.round(m.height * scale), { kernel: 'nearest' }).png().toBuffer(); return { buf, w: Math.round(m.width * scale), h: Math.round(m.height * scale) }; }));
const rows = Math.ceil(imgs.length / cols);
const cw = Math.max(...imgs.map((i) => i.w)), rh = Math.max(...imgs.map((i) => i.h));
const W = cols * cw + (cols + 1) * G, H = rows * rh + (rows + 1) * G;
const comp = imgs.map((im, k) => ({ input: im.buf, left: G + (k % cols) * (cw + G), top: G + Math.floor(k / cols) * (rh + G) }));
await sharp({ create: { width: W, height: H, channels: 3, background: { r: 128, g: 128, b: 128 } } }).composite(comp).png({ palette: true, quality: 90, compressionLevel: 9 }).toFile(out);
console.log(out, W, H);
