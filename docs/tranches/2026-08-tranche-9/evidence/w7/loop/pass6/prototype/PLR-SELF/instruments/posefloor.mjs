import sharp from 'sharp';
const [a, b] = process.argv.slice(2);
const A = await sharp(a).raw().toBuffer({ resolveWithObject: true }), B = await sharp(b).raw().toBuffer({ resolveWithObject: true });
const ch = A.info.channels, n = A.info.width * A.info.height; const g = [A.data[0], A.data[1], A.data[2]];
let inked = 0, moved = 0;
for (let i = 0; i < n; i++) { const o = i * ch; const da = Math.max(...[0,1,2].map((k) => Math.abs(A.data[o+k] - g[k]))), db = Math.max(...[0,1,2].map((k) => Math.abs(B.data[o+k] - g[k]))); if (da >= 8 || db >= 8) { inked++; if (Math.max(...[0,1,2].map((k) => Math.abs(A.data[o+k] - B.data[o+k]))) >= 8) moved++; } }
console.log(JSON.stringify({ w: A.info.width, h: A.info.height, inked, moved }));
