import { createRequire } from "node:module";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const sharp = require("sharp");
const [out, ...rows] = process.argv.slice(2); // rows: "a.png,b.png"
const grid = rows.map((r) => r.split(","));
const metas = await Promise.all(grid.flat().map((p) => sharp(p).metadata()));
const W = Math.max(...metas.map((m) => m.width)), H = Math.max(...metas.map((m) => m.height)), G = 8;
const cols = Math.max(...grid.map((r) => r.length));
const comp = []; let k = 0;
grid.forEach((r, y) => r.forEach((p, x) => { comp.push({ input: p, left: x * (W + G), top: y * (H + G) }); k++; }));
await sharp({ create: { width: cols * W + (cols - 1) * G, height: grid.length * H + (grid.length - 1) * G, channels: 3, background: "#808080" } }).composite(comp).png().toFile(out);
console.log(out, W, H);
